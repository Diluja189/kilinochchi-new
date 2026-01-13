// src/lib/seedFundingApi.ts

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

const API_BASE =
  (process.env.REACT_APP_API_URL as string) || "http://localhost:5000";

async function readJsonSafely(res: Response) {
  const txt = await res.text();
  try {
    return txt ? JSON.parse(txt) : null;
  } catch {
    return null;
  }
}

export const insertSeedFundingEnquiry = async (payload: {
  name: string;
  phone: string;
  email: string;
  startup_name?: string;
  funding_stage?: string;
  message: string;
}) => {
  const res = await fetch(`${API_BASE}/api/enquiries/seed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      startup_name: payload.startup_name ?? "",
      funding_stage: payload.funding_stage ?? "",
      message: payload.message,
    }),
  });

  const body = await readJsonSafely(res);

  if (!res.ok || !body?.ok) {
    const msg =
      body?.error ||
      (body?.issues ? JSON.stringify(body.issues) : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return body.data as SeedFundingEnquiry;
};

export const fetchSeedFundingEnquiries = async (): Promise<
  SeedFundingEnquiry[]
> => {
  const res = await fetch(`${API_BASE}/api/enquiries/seed`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const body = await readJsonSafely(res);

  if (!res.ok || !body?.ok) {
    const msg = body?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return (body.data || []) as SeedFundingEnquiry[];
};
