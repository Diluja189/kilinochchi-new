Supabase Edge Function + cPanel SMTP (Full Instructions)

This guide creates a Supabase Edge Function that sends email using your cPanel
mailbox over SMTP. Everything is in one file so it will not get cut off.

-----------------------------------------------------------------------
1) What you need
-----------------------------------------------------------------------
- A Supabase project (new or existing)
- Supabase CLI installed and logged in
- A cPanel email account (ex: info@yourdomain.com) with its password

Important note about SMTP on Edge:
Supabase Edge Functions run on Deno. SMTP uses raw TCP. If your runtime blocks
TCP, SMTP will fail. If that happens, you must use an HTTP email API instead.

-----------------------------------------------------------------------
2) Find your SMTP settings in cPanel
-----------------------------------------------------------------------
In cPanel:
1. Go to Email Accounts
2. Click "Connect Devices" for your email account
3. Copy the SMTP settings shown there

Typical cPanel SMTP values are:
- SMTP Host: mail.yourdomain.com
- SMTP Port: 465 (SSL) or 587 (TLS)
- Username: your full email address (info@yourdomain.com)
- Password: your email account password
- TLS: true (for port 587)
- SSL: true (for port 465)

You can use either 465 (SSL) or 587 (TLS). This guide defaults to 587 TLS.

-----------------------------------------------------------------------
3) Initialize Supabase (if needed)
-----------------------------------------------------------------------
If you get:
  "supabase : The term 'supabase' is not recognized"
then the Supabase CLI is not installed or not on PATH.
Install it first, then reopen PowerShell.

Windows install options (pick ONE):

Option A) Winget (recommended if you have it)
  winget install Supabase.CLI

Option B) Scoop
  scoop install supabase

Option C) Chocolatey
  choco install supabase

Option D) Manual download (works even if winget/scoop/choco fail)
  1. Open your browser and go to:
     https://github.com/supabase/cli/releases/latest
  2. Download: supabase_windows_amd64.zip
  3. Extract supabase.exe to a folder, for example:
     C:\Supabase\
  4. Add that folder to PATH:
     - Press Win+R, type sysdm.cpl, press Enter
     - Advanced tab -> Environment Variables
     - Under "User variables", select Path -> Edit -> New
     - Add: C:\Supabase\
     - OK -> OK
  5. Close and reopen PowerShell

If winget fails with certificate errors, you can try:
  winget source reset --force
Then retry:
  winget install Supabase.CLI

Verify installation:
  supabase --version

Log in:
  supabase login

Open a terminal in your project folder and run:

  supabase init

-----------------------------------------------------------------------
4) Create the Edge Function
-----------------------------------------------------------------------
Run:

  supabase functions new send-email

This creates:
  supabase/functions/send-email/index.ts

-----------------------------------------------------------------------
5) Replace the function code
-----------------------------------------------------------------------
Open:
  supabase/functions/send-email/index.ts

Replace the entire file with this:

  import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    let payload: {
      to?: string | string[];
      subject?: string;
      text?: string;
      html?: string;
      from?: string;
    };

    try {
      payload = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    }

    const to = payload.to;
    const subject = payload.subject;
    const text = payload.text;
    const html = payload.html;

    if (!to || !subject || (!text && !html)) {
      return new Response(
        JSON.stringify({ error: "Missing to, subject, and text or html" }),
        { status: 400, headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    }

    const host = Deno.env.get("SMTP_HOST");
    const port = Number(Deno.env.get("SMTP_PORT") ?? "587");
    const user = Deno.env.get("SMTP_USER");
    const pass = Deno.env.get("SMTP_PASS");
    const fromEnv = Deno.env.get("SMTP_FROM");
    const tls = (Deno.env.get("SMTP_TLS") ?? "true").toLowerCase() === "true";

    if (!host || !user || !pass || !(payload.from || fromEnv)) {
      return new Response(
        JSON.stringify({ error: "Missing SMTP config or from address" }),
        { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: host,
        port,
        tls,
        auth: { username: user, password: pass },
      },
    });

    try {
      await client.send({
        from: payload.from ?? fromEnv!,
        to,
        subject,
        content: text ?? "",
        html,
      });

      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: String(err) }),
        { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    } finally {
      await client.close();
    }
  });

-----------------------------------------------------------------------
6) Add your SMTP secrets
-----------------------------------------------------------------------
Replace values with your cPanel settings:

  supabase secrets set SMTP_HOST="mail.yourdomain.com"
  supabase secrets set SMTP_PORT="587"
  supabase secrets set SMTP_USER="info@yourdomain.com"
  supabase secrets set SMTP_PASS="YOUR_EMAIL_PASSWORD"
  supabase secrets set SMTP_FROM="Your Name <info@yourdomain.com>"
  supabase secrets set SMTP_TLS="true"

If you use port 465 (SSL), you can keep SMTP_TLS="true" and set SMTP_PORT="465".

-----------------------------------------------------------------------
7) Deploy the function
-----------------------------------------------------------------------

  supabase functions deploy send-email

-----------------------------------------------------------------------
8) Call the function (test)
-----------------------------------------------------------------------
Use your project URL and key:

  $PROJECT_URL="https://YOUR_PROJECT.supabase.co"
  $KEY="YOUR_SUPABASE_ANON_OR_SERVICE_KEY"

  curl -i "$PROJECT_URL/functions/v1/send-email" `
    -H "Authorization: Bearer $KEY" `
    -H "apikey: $KEY" `
    -H "Content-Type: application/json" `
    -d "{\"to\":\"you@example.com\",\"subject\":\"Test\",\"text\":\"Hello from Supabase\"}"

-----------------------------------------------------------------------
9) Common problems
-----------------------------------------------------------------------
1) "PermissionDenied" or connection errors:
   - SMTP might be blocked by the runtime.
   - If this happens, you must use an HTTP email API (Resend/SendGrid/etc.).
2) Auth failures:
   - Double-check username and password.
   - Use the full email address as the username.
3) SPF/DKIM:
   - For best deliverability, set SPF and DKIM in your DNS.
   - cPanel can generate these records.

-----------------------------------------------------------------------
10) Optional: lock down access
-----------------------------------------------------------------------
If you want to restrict who can call the function, do not use the anon key
from a public client. Use a logged-in user JWT or verify a shared secret.

-----------------------------------------------------------------------
Done.
If you want me to tailor this for your exact cPanel host/ports,
send me the "Connect Devices" SMTP values and I will update the file.
