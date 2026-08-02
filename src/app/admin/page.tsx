"use client";

import { useEffect, useState } from "react";
import { getAdminToken } from "@/lib/adminSession";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    // Deliberately read localStorage post-mount (not during render) so the
    // statically-exported HTML always matches on first hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(getAdminToken());
  }, []);

  if (token === undefined) {
    return null;
  }

  if (!token) {
    return <AdminLogin onLogin={setToken} />;
  }

  return <AdminDashboard token={token} onLogout={() => setToken(null)} />;
}
