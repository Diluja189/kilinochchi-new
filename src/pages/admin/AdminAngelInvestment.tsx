import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminAngelInvestment() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      // ✅ must be logged-in admin session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setRows([]);
        setLoading(false);
        return;
      }

      // ✅ fetch from correct table
      const { data, error } = await supabase
        .from("angel_investment_enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("AdminAngelInvestment select error:", error);
        setRows([]);
      } else {
        setRows(data || []);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!rows.length) return <div style={{ padding: 16 }}>No Angel Investment Enquiries yet</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Angel Investment Enquiries</h2>

      {rows.map((r) => (
        <div
          key={r.id}
          style={{
            padding: 12,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {r.name} — {r.phone}
          </div>
          <div>{r.email}</div>
        </div>
      ))}
    </div>
  );
}
