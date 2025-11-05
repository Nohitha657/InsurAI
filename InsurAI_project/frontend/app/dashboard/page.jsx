"use client";
import { Shield } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar"; 
import { useState } from "react";
import Footer from "../../components/layout/Footer";
import AgentDashboard  from "./agents/page";
import AppointmentsPage from "./appointments/page";
import PlansDashboard from "./plans/page";



export default function DashboardPage() {
  // Static user for demo; use real data later
  const user = { fullName: "Test User" };
  const [selected, setSelected] = useState("Dashboard");

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight select-none">
            InsurAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-blue-700">{user.fullName}</span>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT AREA */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="bg-white w-64 p-6 shadow-lg flex-shrink-0">
          <Sidebar selected={selected} setSelected={setSelected} />
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-gray-50 min-h-0" 
              style={{
              height: "calc(100vh - 120px)", // Adjust 120px to match your header+footer height
              overflowY: "auto",
            }}>
          <div className="rounded-xl shadow bg-white p-8 min-h-[300px]">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{selected}</h2>
            <div>
              {selected === "Dashboard" && <div>Welcome to your dashboard</div>}
              {selected === "Agents" && <AgentDashboard />}
              {selected === "Appointments" && <AppointmentsPage />}
              {selected === "Plans" && <PlansDashboard />}
              {/* {selected === "Admin" && <AdminDashboard />} */}
            </div>
          </div>
        </main>
      </div>
      {/* FOOTER */}
      <Footer />
    </div>
  );
}
