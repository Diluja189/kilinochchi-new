// src/lib/angelInvestmentApi.ts

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

export const insertAngelInvestmentEnquiry = async (payload: {
  name: string;
  phone: string;
  email: string;
  company?: string;
  investment_range?: string;
  message: string;
}) => {
  const res = await fetch(`${API_BASE}/api/enquiries/angel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      company: payload.company ?? "",
      investment_range: payload.investment_range ?? "",
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

  // backend returns { ok: true, data: {...row...} }
  return body.data as AngelInvestmentEnquiry;
};

export const fetchAngelInvestmentEnquiries = async (): Promise<
  AngelInvestmentEnquiry[]
> => {
  const res = await fetch(`${API_BASE}/api/enquiries/angel`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const body = await readJsonSafely(res);

  if (!res.ok || !body?.ok) {
    const msg = body?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return (body.data || []) as AngelInvestmentEnquiry[];
};
