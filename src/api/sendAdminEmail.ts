import { supabase, supabaseAnonKey } from "../supabaseClient";

type AdminEmailPayload = {
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

type AdminEmailResponse = {
  delivered?: boolean;
  reason?: string;
};

export async function sendAdminEmail(payload: AdminEmailPayload) {
  const { data: authData } = await supabase.auth.getSession();
  const accessToken = authData.session?.access_token ?? supabaseAnonKey;

  const { data, error } = await supabase.functions.invoke<AdminEmailResponse>(
    "send-admin-email",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: supabaseAnonKey,
      },
      body: {
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        reply_to: payload.replyTo,
      },
    }
  );

  if (error) {
    throw error;
  }

  if (data?.delivered === false) {
    throw new Error(data.reason || "Email delivery failed.");
  }

  return data;
}
