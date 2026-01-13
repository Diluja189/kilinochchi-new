// src/api/admissionsApi.ts

import { supabase } from "../supabaseClient";
import { sendAdminEmail } from "./sendAdminEmail";

export type AdmissionsPayload = {
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
};

const TABLE = "admissions_enquiries";

export async function insertAdmissionsEnquiry(payload: AdmissionsPayload) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        course: payload.course,
        message: payload.message || null,
      },
    ])
    .select("*")
    .single();

  if (error) throw error;

  const text = [
    "New admissions enquiry",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Course: ${payload.course}`,
    payload.message ? `Message: ${payload.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await sendAdminEmail({
    subject: `New admissions enquiry - ${payload.name}`,
    text,
    replyTo: payload.email,
  });

  return data;
}
