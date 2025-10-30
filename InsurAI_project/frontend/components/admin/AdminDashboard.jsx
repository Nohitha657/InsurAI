import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AdminDashboard() {
  const [stats,setStats] = useState(null);
  useEffect(() => {
    api.get("/api/admin/stats").then(r => setStats(r.data)).catch(()=>{});
  }, []);
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Admin</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Total users: {stats?.users || "—"}</div>
        <div className="bg-white p-4 rounded shadow">Total agents: {stats?.agents || "—"}</div>
        <div className="bg-white p-4 rounded shadow">Appointments today: {stats?.appointmentsToday || "—"}</div>
      </div>
    </div>
  );
}
