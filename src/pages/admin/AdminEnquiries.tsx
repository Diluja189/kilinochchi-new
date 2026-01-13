import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminEnquiries() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setRows([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("admissions_enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("AdminEnquiries select error:", error);
        setRows([]);
      } else {
        setRows(data || []);
      }

      setLoading(false);
    })();
  }, []);

  // ✅ Logout FIX
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      // 1) Supabase session clear
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        alert("Logout failed");
        return;
      }

      // 2) If AdminGuard uses localStorage keys, clear them also (safe)
      // (remove only if you know exact keys)
      localStorage.removeItem("admin"); 
      localStorage.removeItem("ADMIN_AUTH");
      localStorage.removeItem("admin_session");

      // 3) Redirect to login
      navigate("/admin/login", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!rows.length)
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>AdminEnquiries</h2>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(128,0,0,0.25)",
              color: "#fff",
              fontWeight: 700,
              cursor: loggingOut ? "not-allowed" : "pointer",
            }}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div style={{ marginTop: 12 }}>No Enquiries yet</div>
      </div>
    );

  return (
    <div style={{ padding: 16 }}>
      {/* Header + Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>AdminEnquiries</h2>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(128,0,0,0.25)",
            color: "#fff",
            fontWeight: 700,
            cursor: loggingOut ? "not-allowed" : "pointer",
          }}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* List */}
      <div style={{ marginTop: 14 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
            <div>
              <b>{r.name}</b> — {r.phone}
            </div>
            <div>{r.email}</div>
            <div>{r.course}</div>
            <div>{r.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
