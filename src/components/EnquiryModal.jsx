import { useState } from "react";
import { insertAdmissionsEnquiry } from "../api/admissionsApi";
import { insertAngelInvestmentEnquiry } from "../api/angelInvestmentApi";
import { insertSeedFundingEnquiry } from "../api/seedFundingApi";
import { insertRemoteEmploymentEnquiry } from "../api/remoteEmploymentApi";

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

  if (!open) return null;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Name & Email required");
      return;
    }
    // Basic validation (message min 2)
    const safeMessage = (form.message || "").trim();
    if (safeMessage.length < 2) {
      alert("Message minimum 2 characters");
      return;
    }

    setLoading(true);

    try {
      let payload = {};

      if (isAdmissions) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          course: (form.course || "").trim() || "General",
          message: safeMessage,
        };
        await insertAdmissionsEnquiry(payload);
      } else if (isAngel) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          company: (form.company || "").trim(),
          investment_range: (form.investment_range || "").trim(),
          message: safeMessage,
        };
        await insertAngelInvestmentEnquiry(payload);
      } else if (isSeed) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          startup_name: (form.startup_name || "").trim(),
          funding_stage: (form.funding_stage || "").trim(),
          message: safeMessage,
        };
        await insertSeedFundingEnquiry(payload);
      } else if (isRemote) {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          role: (form.role || "").trim(),
          skills: (form.skills || "").trim(),
          message: safeMessage,
        };
        await insertRemoteEmploymentEnquiry(payload);
      } else {
        payload = {
          name: form.name.trim(),
          phone: (form.phone || "").trim(),
          email: form.email.trim(),
          course: (form.course || "").trim() || "General",
          message: safeMessage,
        };
        await insertAdmissionsEnquiry(payload);
      }

      alert("Enquiry submitted.");
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
