import { supabase } from "../supabaseClient";
import { sendAdminEmail } from "./sendAdminEmail";

export type AngelInvestmentEnquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string | null;
  investment_range: string | null;
  message: string;
  created_at: string;
};

const TABLE = "angel_investment_enquiries";

export const insertAngelInvestmentEnquiry = async (payload: {
  name: string;
  phone: string;
  email: string;
  company?: string;
  investment_range?: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        company: payload.company ?? null,
        investment_range: payload.investment_range ?? null,
        message: payload.message || null,
      },
    ])
    .select("*")
    .single();

  if (error) throw error;

  const text = [
    "New angel investment enquiry",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : "",
    payload.investment_range ? `Investment Range: ${payload.investment_range}` : "",
    payload.message ? `Message: ${payload.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await sendAdminEmail({
    subject: `New angel investment enquiry - ${payload.name}`,
    text,
    replyTo: payload.email,
  });

  return data as AngelInvestmentEnquiry;
};

export const fetchAngelInvestmentEnquiries = async (): Promise<
  AngelInvestmentEnquiry[]
> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []) as AngelInvestmentEnquiry[];
};
