// src/api/admissionsApi.ts

export type AdmissionsPayload = {
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
};

function getApiBase() {
  return process.env.REACT_APP_API_URL || "http://localhost:5001";
}

export async function insertAdmissionsEnquiry(payload: AdmissionsPayload) {
  const API = getApiBase();

  const res = await fetch(`${API}/api/enquiries/admissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      course: payload.course,
      message: payload.message,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to submit admission enquiry");
  }

  return data;
}
