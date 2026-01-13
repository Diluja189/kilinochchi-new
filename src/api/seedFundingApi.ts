import { supabase } from "../supabaseClient";
import { sendAdminEmail } from "./sendAdminEmail";

export type SeedFundingEnquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  startup_name: string | null;
  funding_stage: string | null;
  message: string;
  created_at: string;
};

const TABLE = "seed_funding_enquiries";

export const insertSeedFundingEnquiry = async (payload: {
  name: string;
  phone: string;
  email: string;
  startup_name?: string;
  funding_stage?: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        startup_name: payload.startup_name ?? null,
        funding_stage: payload.funding_stage ?? null,
        message: payload.message || null,
      },
    ])
    .select("*")
    .single();

  if (error) throw error;

  const text = [
    "New seed funding enquiry",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.startup_name ? `Startup: ${payload.startup_name}` : "",
    payload.funding_stage ? `Funding Stage: ${payload.funding_stage}` : "",
    payload.message ? `Message: ${payload.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await sendAdminEmail({
    subject: `New seed funding enquiry - ${payload.name}`,
    text,
    replyTo: payload.email,
  });

  return data as SeedFundingEnquiry;
};

export const fetchSeedFundingEnquiries = async (): Promise<
  SeedFundingEnquiry[]
> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []) as SeedFundingEnquiry[];
};
