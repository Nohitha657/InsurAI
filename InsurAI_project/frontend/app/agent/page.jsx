"use client";
import React, { useEffect, useState } from "react";
import Footer from "../../components/layout/Footer";
import AppointmentsPage from "../dashboard/appointments/page";
import PlansDashboard from "../dashboard/plans/page";
import {User,Eye,Edit2,Trash,Users,Calendar,FileText,Plus,Shield,} from "lucide-react";

export default function AgentDashboard() {
  const [agent, setAgent] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [requestStatus, setRequestStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("Profile"); // Profile | Appointments

  // Get email saved at login (you must save it there)
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("agentEmail")
      : null;

  useEffect(() => {
    if (!email) {
      console.error("No agent email found in localStorage");
      setLoading(false);
      return;
    }

    let completed = 0;
    const tryDone = () => {
      completed += 1;
      if (completed === 3) setLoading(false);
    };

    const safeFetch = (url, setter, fallback) => {
      fetch(url)
        .then((res) => {
          console.log("Fetch", url, "status", res.status);
          return res.text();
        })
        .then((text) => {
          let data = fallback;
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (e) {
              console.error("Failed to parse JSON from", url, "body:", text);
            }
          }
          setter(data);
        })
        .catch((err) => {
          console.error("Fetch error at", url, err);
          setter(fallback);
        })
        .finally(() => {
          tryDone();
        });
    };

    safeFetch(
      `http://localhost:8080/api/agents/me?email=${email}`,setAgent,null);
    safeFetch(
      `http://localhost:8080/api/agents/me/stats?email=${email}`,setStats,{});
    safeFetch(
      `http://localhost:8080/api/agents/me/appointments?email=${email}`,setAppointments,[]);
  }, [email]);

  const updateStatus = async (newStatus) => {
    if (!email) return;
    await fetch(
      `http://localhost:8080/api/agents/me/status?email=${email}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus), // "active" or "inactive"
      }
    );

    setAgent((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };
  const requestApproval = async () => {
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("agentEmail")
      : null;
  if (!email) return;

  const res = await fetch(
    `http://localhost:8080/api/agents/me/request-approval?email=${email}`,
    { method: "POST" }
  );

  if (res.ok) {
    setRequestStatus("Request sent successfully!");
  } else {
    setRequestStatus("Error — Already requested or not allowed.");
  }
  setTimeout(() => setRequestStatus(""), 3500);
};

  if (loading ) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-2xl font-semibold text-blue-700">
      Loading...
    </div>
  );
}
  const handleLogout = () => {
    // Clear any stored session data (e.g., localStorage)
    localStorage.removeItem("agentEmail");
    // Redirect to login page
    window.location.href = "/login";
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* TOP NAVBAR */}
      <header className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* InsurAI logo text similar to user dashboard */}
          <Shield className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight select-none">
            InsurAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-blue-700">
            {agent?.name || "Agent"}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 min-h-0">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-blue-100 p-5 flex-shrink-0">
          <nav className="space-y-2">
            {["Profile", "Dashboard", "Appointments","Users", "Plans"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setSelected(item)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    selected === item
                      ? "bg-blue-600 text-white"
                      : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {item === "Profile" && (
                    <User className="w-4 h-4" />
                  )}
                  {item === "Dashboard" && (
                    <Shield className="w-4 h-4" />
                  )}
                  {item === "Appointments" && (
                    <Calendar className="w-4 h-4" />
                  )}
                  {item==="Users" && (
                    <User className="w-4 h-4" />
                  )}
                  {item === "Plans" && (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>{item}</span>
                </button>
              )
            )}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main
          className="flex-1 p-8 bg-gray-50 min-h-0"
          style={{
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <div className="rounded-xl shadow bg-white p-8 min-h-[300px]">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {selected === "Profile" && (
                    <div className="space-y-6">
                      {/* Basic Info Card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-xl font-extrabold text-gray-800">
                              {agent?.name}
                            </div>
                            <div className="mt-1">
                              <button
                                className="px-4 py-2 bg-green-600 text-white rounded"
                                onClick={() => updateStatus("active")}
                              >
                                Set Active
                              </button>

                              <button
                                className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
                                onClick={() => updateStatus("inactive")}
                              >
                                Set Inactive
                              </button>
                            </div>
                          </div>
                          <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">
                            Edit Profile
                          </button>
                        </div>

                        {requestStatus && (
                          <div className="mb-2 text-sm text-blue-600">
                            {requestStatus}
                          </div>
                        )}

                        <div className="text-gray-700 text-base">
                          <b>Phone:</b> {agent?.phone || "-"}
                        </div>
                        <div className="text-gray-700 text-base">
                          <b>Email:</b> {agent?.email || "-"}
                        </div>
                        <div className="text-gray-700 text-base">
                          <b>Address:</b>{" "}
                          {agent?.address || "No address available (add in backend)"}
                        </div>
                      </div>

                      {/* Stats Card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-blue-700 mb-2">
                          Policy Statistics
                        </h3>
                        <div className="text-base">
                          <b>Policies Registered:</b> {stats?.policiesRegistered}
                        </div>
                        <div className="text-base">
                          <b>Running Policies:</b> {stats?.runningPolicies}
                        </div>
                        <div className="text-base">
                          <b>Completed Policies:</b> {stats?.completedPolicies}
                        </div>
                        <div className="text-base">
                          <b>Total Policy Amount:</b> ₹{stats?.totalAmount}
                        </div>
                        <div className="text-base">
                          <b>Total Paid:</b> ₹{stats?.paidAmount}
                        </div>
                        <div className="text-base">
                          <b>Balance:</b>{" "}
                          <span className="font-bold text-red-600">
                            ₹{(stats?.totalAmount || 0) - (stats?.paidAmount || 0)}
                          </span>
                        </div>
                        <button
                          className="mt-3 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow self-start"
                          onClick={requestApproval}
                        >
                          Request Approval
                        </button>
                      </div>
                    </div>
                  )}
                {selected === "Appointments" && <AppointmentsPage />}
                {selected === "Plans" && <PlansDashboard />}
              </div>
            )}
          </div>
        </main>
      </div>
        
      {/* FOOTER */}
      <Footer />
    </div>
  );
}



// {/* APPOINTMENTS VIEW */}
// {selected === "Appointments" && (
//   <div className="bg-white rounded-xl border border-gray-200 p-6">
//     <h3 className="text-lg font-bold text-blue-700 mb-3">
//       Appointments
//     </h3>
//     {Array.isArray(appointments) && appointments.length === 0 ? (
//       <div className="text-gray-400 text-base">
//         No appointments found.
//       </div>
//     ) : (
//       <table className="min-w-full text-gray-700 border">
//         <thead>
//           <tr>
//             <th className="border px-4 py-2">Date</th>
//             <th className="border px-4 py-2">Client Name</th>
//             <th className="border px-4 py-2">Purpose</th>
//             <th className="border px-4 py-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.isArray(appointments) &&
//             appointments.map((app) => (
//               <tr key={app.id}>
//                 <td className="border px-4 py-2">{app.date}</td>
//                 <td className="border px-4 py-2">
//                   {app.clientName}
//                 </td>
//                 <td className="border px-4 py-2">
//                   {app.purpose}
//                 </td>
//                 <td className="border px-4 py-2">
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       app.status === "approved"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {app.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     )}
//   </div>
// )}
          
