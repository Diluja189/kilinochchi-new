import { supabase } from "../supabaseClient";
import { sendAdminEmail } from "./sendAdminEmail";

export type RemoteEmploymentEnquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string | null;
  skills: string | null;
  message: string;
  created_at: string;
};

const TABLE = "remote_employment_enquiries";

export const insertRemoteEmploymentEnquiry = async (payload: {
  name: string;
  phone: string;
  email: string;
  role?: string;
  skills?: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        role: payload.role ?? null,
        skills: payload.skills ?? null,
        message: payload.message || null,
      },
    ])
    .select("*")
    .single();

  if (error) throw error;

  const text = [
    "New remote employment enquiry",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.role ? `Role: ${payload.role}` : "",
    payload.skills ? `Skills: ${payload.skills}` : "",
    payload.message ? `Message: ${payload.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await sendAdminEmail({
    subject: `New remote employment enquiry - ${payload.name}`,
    text,
    replyTo: payload.email,
  });

  return data as RemoteEmploymentEnquiry;
};

export const fetchRemoteEmploymentEnquiries = async (): Promise<
  RemoteEmploymentEnquiry[]
> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []) as RemoteEmploymentEnquiry[];
};
