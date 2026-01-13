import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setOk(!!data?.session);
    })();
  }, []);

  if (ok === null) return null;
  if (!ok) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
