import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { BufReader, BufWriter } from 'https://deno.land/std@0.150.0/io/bufio.ts';
import { TextProtoReader } from 'https://deno.land/std@0.150.0/textproto/mod.ts';

type EmailPayload = {
  subject?: string;
  text?: string;
  html?: string;
  reply_to?: string;
};

const smtpHost = Deno.env.get('SMTP_HOST')?.trim() || 'smtp.gmail.com';
const smtpPort = Number(Deno.env.get('SMTP_PORT') ?? 465);
const smtpSecureEnv = Deno.env.get('SMTP_SECURE')?.trim().toLowerCase();
const smtpAuthEnv = Deno.env.get('SMTP_AUTH_METHOD')?.trim().toLowerCase();
const smtpUser = Deno.env.get('SMTP_USER')?.trim() || null;
const smtpPass = Deno.env.get('SMTP_PASS')?.trim() || null;
const configuredFromEmail = Deno.env.get('MAIL_FROM')?.trim() || smtpUser;
const configuredFromName = Deno.env.get('MAIL_FROM_NAME')?.trim() || null;
const adminTo = Deno.env.get('ADMIN_TO')?.trim() || null;

type SmtpMode = 'tls' | 'starttls' | 'plain';
type SmtpAuthMethod = 'auto' | 'login' | 'plain';

const smtpMode: SmtpMode = smtpSecureEnv === 'starttls'
  ? 'starttls'
  : smtpSecureEnv === 'true' || smtpSecureEnv === 'tls' || smtpSecureEnv === 'ssl'
  ? 'tls'
  : smtpSecureEnv === 'false' || smtpSecureEnv === 'plain'
  ? 'plain'
  : smtpPort === 465
  ? 'tls'
  : smtpPort === 587
  ? 'starttls'
  : 'plain';

const smtpAuthMethod: SmtpAuthMethod = smtpAuthEnv === 'login'
  ? 'login'
  : smtpAuthEnv === 'plain'
  ? 'plain'
  : 'auto';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Command = {
  code: number;
  args: string;
  continuation: boolean;
};

type SmtpConnectConfig = {
  hostname: string;
  port: number;
  mode: SmtpMode;
  username?: string | null;
  password?: string | null;
  authMethod?: SmtpAuthMethod;
};

type SmtpSendConfig = {
  from: string;
  to: string;
  subject: string;
  content: string;
  html?: string;
  replyTo?: string;
};

const SMTP_CODES = {
  READY: 220,
  AUTH_SUCCESS: 235,
  OK: 250,
  BEGIN_DATA: 354,
};

const encoder = new TextEncoder();

class SimpleSmtpClient {
  private conn: Deno.Conn | null = null;
  private reader: TextProtoReader | null = null;
  private writer: BufWriter | null = null;

  async connect(config: SmtpConnectConfig) {
    if (config.mode === 'tls') {
      this.conn = await Deno.connectTls({
        hostname: config.hostname,
        port: config.port,
      });
    } else {
      this.conn = await Deno.connect({
        hostname: config.hostname,
        port: config.port,
      });
    }

    this.resetReaders();
    const greeting = await this.readResponse();
    this.assertCode(lastCommand(greeting), SMTP_CODES.READY, 'SMTP server did not send a greeting.');
    const authMethods = await this.ehlo(config.hostname);

    if (config.mode === 'starttls') {
      if (!this.conn) {
        throw new Error('SMTP connection was not established.');
      }
      await this.writeLine('STARTTLS');
      const startTlsResponse = await this.readResponse();
      this.assertCode(lastCommand(startTlsResponse), SMTP_CODES.READY, 'SMTP server rejected STARTTLS.');
      this.conn = await Deno.startTls(this.conn, { hostname: config.hostname });
      this.resetReaders();
      const tlsAuthMethods = await this.ehlo(config.hostname);
      authMethods.splice(0, authMethods.length, ...tlsAuthMethods);
    }

    if (config.username && config.password) {
      await this.authenticate(config.username, config.password, authMethods, config.authMethod ?? 'auto');
    }
  }

  async close() {
    if (!this.conn) return;
    try {
      await this.writeLine('QUIT');
    } catch {
      // ignore SMTP quit failures
    }
    try {
      this.conn.close();
    } catch {
      // ignore close failures
    } finally {
      this.conn = null;
      this.reader = null;
      this.writer = null;
    }
  }

  async send(config: SmtpSendConfig) {
    const [from, fromData] = this.parseAddress(config.from);
    const [to, toData] = this.parseAddress(config.to);

    await this.writeLine('MAIL', 'FROM:', from);
    this.assertCode(await this.readCmd(), SMTP_CODES.OK);
    await this.writeLine('RCPT', 'TO:', to);
    this.assertCode(await this.readCmd(), SMTP_CODES.OK);
    await this.writeLine('DATA');
    this.assertCode(await this.readCmd(), SMTP_CODES.BEGIN_DATA);

    await this.writeLine('Subject:', config.subject);
    await this.writeLine('From:', fromData);
    await this.writeLine('To:', toData);
    if (config.replyTo) {
      const [, replyToData] = this.parseAddress(config.replyTo);
      await this.writeLine('Reply-To:', replyToData);
    }
    await this.writeLine('Date:', new Date().toUTCString());

    if (config.html) {
      const boundary = `InviteBoundary_${Date.now().toString(16)}`;
      await this.writeLine('MIME-Version:', '1.0');
      await this.writeLine('Content-Type:', `multipart/alternative; boundary="${boundary}"`);
      await this.writeLine('');
      await this.writeLine(`--${boundary}`);
      await this.writeLine('Content-Type:', 'text/plain; charset="utf-8"');
      await this.writeLine('Content-Transfer-Encoding:', '7bit');
      await this.writeLine('');
      await this.writeRaw(normalizeEol(config.content) + '\r\n');
      await this.writeLine(`--${boundary}`);
      await this.writeLine('Content-Type:', 'text/html; charset="utf-8"');
      await this.writeLine('Content-Transfer-Encoding:', '7bit');
      await this.writeLine('');
      await this.writeRaw(normalizeEol(config.html) + '\r\n');
      await this.writeLine(`--${boundary}--`);
    } else {
      await this.writeLine('MIME-Version:', '1.0');
      await this.writeLine('Content-Type:', 'text/plain; charset="utf-8"');
      await this.writeLine('Content-Transfer-Encoding:', '7bit');
      await this.writeLine('');
      await this.writeRaw(normalizeEol(config.content) + '\r\n');
    }

    await this.writeRaw('\r\n.\r\n');
    this.assertCode(await this.readCmd(), SMTP_CODES.OK);
  }

  private resetReaders() {
    if (!this.conn) return;
    const reader = new BufReader(this.conn);
    this.reader = new TextProtoReader(reader);
    this.writer = new BufWriter(this.conn);
  }

  private async authenticate(
    username: string,
    password: string,
    authMethods: string[],
    method: SmtpAuthMethod,
  ) {
    const available = authMethods.map((value) => value.toUpperCase());
    const canLogin = available.length === 0 || available.includes('LOGIN');
    const canPlain = available.length === 0 || available.includes('PLAIN');
    const errors: string[] = [];

    const tryLogin = method === 'login' || method === 'auto';
    const tryPlain = method === 'plain' || method === 'auto';

    if (tryLogin && canLogin) {
      try {
        await this.authLogin(username, password);
        return;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'AUTH LOGIN failed.');
      }
    }

    if (tryPlain && canPlain) {
      try {
        await this.authPlain(username, password);
        return;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'AUTH PLAIN failed.');
      }
    }

    if (errors.length > 0) {
      throw new Error(errors[0]);
    }

    throw new Error('SMTP server did not advertise supported AUTH methods.');
  }

  private async authLogin(username: string, password: string) {
    try {
      await this.writeLine('AUTH', 'LOGIN');
      const challenge = await this.readCmd();
      if (challenge?.code === SMTP_CODES.AUTH_SUCCESS) {
        return;
      }
      this.assertCode(challenge, 334, 'SMTP server rejected AUTH LOGIN.');
      await this.writeLine(btoa(username));
      const userResp = await this.readCmd();
      if (userResp?.code === SMTP_CODES.AUTH_SUCCESS) {
        return;
      }
      this.assertCode(userResp, 334, 'SMTP server rejected the username.');
      await this.writeLine(btoa(password));
      this.assertCode(await this.readCmd(), SMTP_CODES.AUTH_SUCCESS, 'SMTP server rejected the password.');
      return;
    } catch {
      // fall through to attempt inline AUTH LOGIN
    }

    await this.writeLine('AUTH', 'LOGIN', btoa(username));
    const response = await this.readCmd();
    if (response?.code === SMTP_CODES.AUTH_SUCCESS) {
      return;
    }
    this.assertCode(response, 334, 'SMTP server rejected AUTH LOGIN.');
    await this.writeLine(btoa(password));
    this.assertCode(await this.readCmd(), SMTP_CODES.AUTH_SUCCESS, 'SMTP server rejected the password.');
  }

  private async authPlain(username: string, password: string) {
    const token = btoa(`\u0000${username}\u0000${password}`);
    await this.writeLine('AUTH', 'PLAIN', token);
    const response = await this.readCmd();
    if (response?.code === SMTP_CODES.AUTH_SUCCESS) {
      return;
    }
    if (response?.code === 334) {
      await this.writeLine(token);
      this.assertCode(await this.readCmd(), SMTP_CODES.AUTH_SUCCESS, 'SMTP server rejected AUTH PLAIN.');
      return;
    }

    await this.writeLine('AUTH', 'PLAIN');
    const challenge = await this.readCmd();
    this.assertCode(challenge, 334, 'SMTP server rejected AUTH PLAIN.');
    await this.writeLine(token);
    this.assertCode(await this.readCmd(), SMTP_CODES.AUTH_SUCCESS, 'SMTP server rejected AUTH PLAIN.');
  }

  private async ehlo(hostname: string) {
    await this.writeLine('EHLO', hostname);
    const responses = await this.readResponse();
    if (responses.length === 0) {
      throw new Error('SMTP server closed the connection during EHLO.');
    }

    const authMethods: string[] = [];
    for (const cmd of responses) {
      const match = cmd.args.match(/AUTH(?:=|\s+)(.+)$/i);
      if (match) {
        const methods = match[1]
          .trim()
          .split(/\s+/)
          .map((method) => method.toUpperCase());
        authMethods.push(...methods);
      }
    }

    return Array.from(new Set(authMethods));
  }

  private parseAddress(email: string): [string, string] {
    const match = email.toString().match(/(.*)\s<(.*)>/);
    return match?.length === 3
      ? [`<${match[2]}>`, email]
      : [`<${email}>`, `<${email}>`];
  }

  private async readCmd(): Promise<Command | null> {
    if (!this.reader) {
      return null;
    }
    const result = await this.reader.readLine();
    if (result === null) return null;
    const code = parseInt(result.slice(0, 3).trim(), 10);
    const separator = result.length > 3 ? result[3] : ' ';
    const args = result.length > 4 ? result.slice(4).trim() : '';
    return { code, args, continuation: separator === '-' };
  }

  private async readResponse(): Promise<Command[]> {
    const first = await this.readCmd();
    if (!first) {
      return [];
    }
    const lines = [first];
    while (lines[lines.length - 1].continuation) {
      const next = await this.readCmd();
      if (!next) break;
      lines.push(next);
    }
    return lines;
  }

  private async writeLine(...parts: string[]) {
    if (!this.writer) return;
    const data = encoder.encode(`${parts.join(' ')}\r\n`);
    await this.writer.write(data);
    await this.writer.flush();
  }

  private async writeRaw(value: string) {
    if (!this.writer) return;
    const data = encoder.encode(value);
    await this.writer.write(data);
    await this.writer.flush();
  }

  private assertCode(cmd: Command | null, code: number, msg?: string) {
    if (!cmd) {
      throw new Error(msg ?? 'SMTP server closed the connection unexpectedly.');
    }
    if (cmd.code !== code) {
      const detail = `${cmd.code}: ${cmd.args}`;
      throw new Error(msg ? `${msg} (${detail})` : detail);
    }
  }
}

function lastCommand(commands: Command[]) {
  return commands.length > 0 ? commands[commands.length - 1] : null;
}

function extractEmailAddress(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  const match = trimmed.match(/<([^>]+)>/);
  const email = (match ? match[1] : trimmed).toLowerCase();
  return email.includes('@') ? email : null;
}

function normalizeEol(value: string) {
  return value.replace(/\r?\n/g, '\r\n');
}

function sanitizeHeader(value?: string | null) {
  if (!value) return '';
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function resolveFromEmail() {
  if (configuredFromEmail) {
    if (configuredFromName) {
      return `${configuredFromName} <${configuredFromEmail}>`;
    }
    return configuredFromEmail;
  }
  return null;
}

function jsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
  const headers = new Headers(init?.headers ?? {});
  headers.set('Content-Type', 'application/json');
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  let payload: EmailPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const subject = sanitizeHeader(payload?.subject);
  const textBody = (payload?.text ?? '').toString().trim();
  const htmlBody = (payload?.html ?? '').toString().trim();
  const replyTo = sanitizeHeader(payload?.reply_to);

  if (!subject || (!textBody && !htmlBody)) {
    return jsonResponse({ error: 'Subject and message content are required.' }, { status: 400 });
  }

  if (!smtpUser || !smtpPass) {
    return jsonResponse({ delivered: false, reason: 'SMTP credentials are not configured.' }, { status: 500 });
  }

  if (!adminTo) {
    return jsonResponse({ delivered: false, reason: 'ADMIN_TO is not configured.' }, { status: 500 });
  }

  const fromEmail = resolveFromEmail();
  if (!fromEmail) {
    return jsonResponse({ delivered: false, reason: 'MAIL_FROM is not configured.' }, { status: 500 });
  }

  const resolvedReplyTo = extractEmailAddress(replyTo) ? replyTo : undefined;
  const smtpClient = new SimpleSmtpClient();
  try {
    await smtpClient.connect({
      hostname: smtpHost,
      port: smtpPort,
      mode: smtpMode,
      username: smtpUser ?? undefined,
      password: smtpPass ?? undefined,
      authMethod: smtpAuthMethod,
    });

    await smtpClient.send({
      from: fromEmail,
      to: adminTo,
      subject,
      content: textBody || htmlBody.replace(/<[^>]+>/g, ' '),
      html: htmlBody || undefined,
      replyTo: resolvedReplyTo,
    });

    return jsonResponse({ delivered: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send email.';
    return jsonResponse({ delivered: false, reason: message }, { status: 502 });
  } finally {
    await smtpClient.close();
  }
});
