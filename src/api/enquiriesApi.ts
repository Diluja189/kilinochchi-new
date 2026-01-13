import { supabase } from "../supabaseClient";


export type EnquiryPayload = {
  category: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status?: string;
};

/**
 * Insert enquiry into public.enquiries table
 */
export async function insertEnquiry(payload: EnquiryPayload) {
  const { error } = await supabase.from("enquiries").insert([
    {
      category: payload.category,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      message: payload.message || null,
      status: payload.status || "New",
    },
  ]);

  if (error) throw error;
}
