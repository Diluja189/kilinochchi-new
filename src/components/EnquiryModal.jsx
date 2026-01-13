import { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const API_BASE =
  (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function EnquiryModal({ open, onClose, category }) {
  const [loading, setLoading] = useState(false);

  // ✅ category based extra fields
  const isAdmissions = category === "Admissions" || category === "admissions";
  const isAngel = category === "AngelInvestment" || category === "angel";
  const isSeed = category === "SeedFunding" || category === "seed";
  const isRemote = category === "RemoteEmployment" || category === "remote";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    course: "", // admissions
    company: "", // angel
    investment_range: "", // angel
    startup_name: "", // seed
    funding_stage: "", // seed
    role: "", // remote
    skills: "", // remote
  });

  const apiUrl = useMemo(() => API_BASE, []);
  console.log("API:", apiUrl);

  if (!open) return null;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ✅ map category -> backend route
  const getEndpoint = () => {
    if (isAdmissions) return `${apiUrl}/api/enquiries/admissions`;
    if (isAngel) return `${apiUrl}/api/enquiries/angel`;
    if (isSeed) return `${apiUrl}/api/enquiries/seed`;
    if (isRemote) return `${apiUrl}/api/enquiries/remote`;
    // fallback (default admissions)
    return `${apiUrl}/api/enquiries/admissions`;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Name & Email required");
      return;
    }

    // ✅ Backend Zod validations (message min 2) — empty இருந்தா 400 வரும்
    const safeMessage = (form.message || "").trim();
    if (safeMessage.length < 2) {
      alert("Message minimum 2 characters");
      return;
    }

    setLoading(true);

    try {
      // ✅ Build payload exactly as backend expects
      let payload = {};

      if (isAdmissions) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          course: (form.course || "").trim() || "General",
          message: safeMessage,
        };
      } else if (isAngel) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          company: (form.company || "").trim(),
          investment_range: (form.investment_range || "").trim(),
          message: safeMessage,
        };
      } else if (isSeed) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          startup_name: (form.startup_name || "").trim(),
          funding_stage: (form.funding_stage || "").trim(),
          message: safeMessage,
        };
      } else if (isRemote) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          role: (form.role || "").trim(),
          skills: (form.skills || "").trim(),
          message: safeMessage,
        };
      } else {
        // default admissions
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          course: (form.course || "").trim() || "General",
          message: safeMessage,
        };
      }

      // ✅ 1) FIRST: send to backend => MySQL + Email
      const endpoint = getEndpoint();
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ After OPTIONS, you MUST see this POST in Network
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg =
          data?.error ||
          (data?.issues ? JSON.stringify(data.issues) : "") ||
          `HTTP ${resp.status}`;
        alert("API Submit failed: " + msg);
        setLoading(false);
        return;
      }

      // ✅ 2) OPTIONAL: also store in Supabase (backup/admin UI)
      // (If you want only MySQL, comment this block)
      // NOTE: use your existing table "enquiries" or separate ones
      const sbPayload = {
        category: String(category || "").trim() || "General",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: safeMessage || null,
        status: "New",
      };

      const { error: sbErr } = await supabase.from("enquiries").insert([sbPayload]);
      if (sbErr) {
        console.warn("Supabase backup insert failed:", sbErr.message);
        // not blocking success (because MySQL already ok)
      }

      alert("Enquiry submitted ✅ (MySQL + API ok)");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        course: "",
        company: "",
        investment_range: "",
        startup_name: "",
        funding_stage: "",
        role: "",
        skills: "",
      });
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Submit failed: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Submit Enquiry</h2>
            <p className="text-sm text-slate-500">{String(category || "")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-3 py-1 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Name *"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />

        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />

        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />

        {/* ✅ category-specific fields (minimal UI change) */}
        {isAdmissions && (
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Course *"
            value={form.course}
            onChange={(e) => set("course", e.target.value)}
          />
        )}

        {isAngel && (
          <>
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Company (optional)"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Investment Range (optional)"
              value={form.investment_range}
              onChange={(e) => set("investment_range", e.target.value)}
            />
          </>
        )}

        {isSeed && (
          <>
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Startup Name (optional)"
              value={form.startup_name}
              onChange={(e) => set("startup_name", e.target.value)}
            />
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Funding Stage (optional)"
              value={form.funding_stage}
              onChange={(e) => set("funding_stage", e.target.value)}
            />
          </>
        )}

        {isRemote && (
          <>
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Role (optional)"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            />
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Skills (optional)"
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
            />
          </>
        )}

        <textarea
          className="w-full rounded-xl border px-3 py-2"
          rows={4}
          placeholder="Message * (min 2 chars)"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
