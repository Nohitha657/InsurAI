"use client";
import React, { useEffect, useState } from "react";
import Footer from "../../components/layout/Footer";
import {
  User,
  Users,
  Calendar,
  Bell,
  FileText,
  Shield,
  Eye,
} from "lucide-react";

export default function AgentDashboard() {
  const [agent, setAgent] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [agentUsers, setAgentUsers] = useState([]);
  const [requestStatus, setRequestStatus] = useState("");
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("Profile");
  const [messages, setMessages] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [approvedUsers, setApprovedUsers] = useState([]);

  const unreadCount = messages.filter((m) => !m.read).length;
  const email =
    typeof window !== "undefined" ? localStorage.getItem("agentEmail") : null;
  const agentName =
    typeof window !== "undefined" ? localStorage.getItem("agentName") : null;
  // fetch agent data, stats, appointments, plans, and users
  useEffect(() => {
    console.log("AgentDashboard useEffect start");
    console.log("agentEmail from LS:", email);
    console.log("agentName  from LS:", agentName);

    if (!email) {
      console.error("No agent email found in localStorage");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [meRes, statsRes, apptRes, plansRes] = await Promise.all([
          fetch(`http://localhost:8080/api/agents/me?email=${email}`),
          fetch(`http://localhost:8080/api/agents/me/stats?email=${email}`),
          fetch(
            `http://localhost:8080/api/agents/me/appointments?email=${email}`
          ),
          fetch("http://localhost:8080/api/plans"),
        ]);

        const me = meRes.ok ? await meRes.json() : null;
        const statsJson = statsRes.ok ? await statsRes.json() : {};
        console.log("Stats fetch status:", statsRes.ok);
        console.log("Stats response:", statsJson);
        const apptsJson = apptRes.ok ? await apptRes.json() : [];
        const plansJson = plansRes.ok ? await plansRes.json() : [];

        setAgent(me);
        setStats(statsJson);
        console.log("Stats state set to:", statsJson);
        setAppointments(apptsJson);
        setPlans(Array.isArray(plansJson) ? plansJson : []);

        if (agentName) {
          console.log("Fetching users for agentName:", agentName);
          const usersRes = await fetch(
            `http://localhost:8080/api/claims/by-agent-from-claims?agentName=${encodeURIComponent(
              agentName
            )}`
          );
          const usersJson = usersRes.ok ? await usersRes.json() : [];
          console.log("Users from claims API:", usersJson);
          setAgentUsers(Array.isArray(usersJson) ? usersJson : []);
        } else {
          console.warn("agentName is empty, not fetching users");
          setAgentUsers([]);
        }
      } catch (e) {
        console.error("Error loading agent dashboard", e);
        setAgentUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [email, agentName]);
  // update status
  const updateStatus = async (newStatus) => {
    if (!email) return;
    await fetch(`http://localhost:8080/api/agents/me/status?email=${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    });
    setAgent((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };
  //request approval
  const requestApproval = async () => {
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
  //logout
  const handleLogout = () => {
    localStorage.removeItem("agentEmail");
    window.location.href = "/login";
  };

  const handleProfileFieldChange = (e) => {
    const { name, value } = e.target;
    setAgent((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.toString();
      setAgent((prev) => (prev ? { ...prev, profileImageUrl: base64 } : prev));
      localStorage.setItem(
        "agentProfileImage",
        JSON.stringify({ profileImageUrl: base64 })
      );
    };
    reader.readAsDataURL(file);
  };

  // load stored profile image (if any)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("agentProfileImage");
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        setAgent((prev) =>
          prev ? { ...prev, profileImageUrl: saved.profileImageUrl } : prev
        );
      } catch {
        // ignore
      }
    }
  }, []);
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    alert("Profile changes saved locally (image/name/role).");
  };
  //fetch approved users for the agent
  useEffect(() => {
    const name =
      typeof window !== "undefined" ? localStorage.getItem("agentName") : null;
    if (!name) return;

    const fetchApproved = async () => {
      const res = await fetch(
        `http://localhost:8080/api/claims/by-agent-approved?agentName=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      setApprovedUsers(Array.isArray(data) ? data : []);
    };

    fetchApproved();
    const interval = setInterval(fetchApproved, 10000);
    return () => clearInterval(interval);
  }, []);
  //refresh claims after request
  const refreshClaims = async () => {
    if (!agentName) return;
    const res = await fetch(
      `http://localhost:8080/api/claims/by-agent-from-claims?agentName=${encodeURIComponent(
        agentName
      )}`
    );
    const data = await res.json();
    setAgentUsers(Array.isArray(data) ? data : []);
  };
  //polling for claims
  useEffect(() => {
    const name =
      typeof window !== "undefined" ? localStorage.getItem("agentName") : null;
    if (!name) return;

    const fetchClaims = async () => {
      const res = await fetch(
        `http://localhost:8080/api/claims/by-agent-from-claims?agentName=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      setAgentUsers(Array.isArray(data) ? data : []);
    };

    fetchClaims(); // initial

    const interval = setInterval(fetchClaims, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  // load messages for agent
  useEffect(() => {
    const agentEmail = localStorage.getItem("agentEmail");
    if (!agentEmail) return;

    fetch(
      `http://localhost:8080/api/messages/me/messages?email=${encodeURIComponent(
        agentEmail
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
        else setMessages([]);
      })
      .catch((err) => {
        console.error("Error loading messages", err);
        setMessages([]);
      });
  }, []);
  //open message and mark as read
  const handleOpenMessage = async (msg) => {
    if (msg.read) return;

    // optimistic UI update
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
    );

    try {
      await fetch(`http://localhost:8080/api/messages/${msg.id}/read`, {
        method: "PATCH",
      });
    } catch (e) {
      console.error("Failed to mark message as read", e);
    }
  };
  //request approval message state
  const handleRequest = async (claim) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/claims/${claim.id}/request`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed");

      // optimistic UI update
      setAgentUsers((prev) =>
        prev.map((u) => (u.id === claim.id ? { ...u, requestSent: true } : u))
      );
      setRequestMessage(`Request sent for ${claim.name}`);
      setTimeout(() => setRequestMessage(""), 3000);
    } catch (e) {
      console.error(e);
      setRequestMessage("Failed to send request");
      setTimeout(() => setRequestMessage(""), 3000);
    }
  };
  //mark claim as completed
  const handleComplete = async (claimRow) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/claims/${claimRow.id}/complete`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed");

      // optimistic update
      setApprovedUsers((prev) =>
        prev.map((u) => (u.id === claimRow.id ? { ...u, completed: true } : u))
      );

      alert(`Marked completed for ${claimRow.name}`);
    } catch (e) {
      console.error(e);
      alert("Failed to mark completed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-2xl font-semibold text-blue-700">
        Loading...
      </div>
    );
  }
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

      {/* BODY */}
      <div className="flex flex-1 min-h-0">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-blue-100 p-5 flex-shrink-0">
          <nav className="space-y-2">
            {[
              "Profile",
              "Dashboard",
              "Notifications",
              "Appointments",
              "Users",
              "Plans",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setSelected(item)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  selected === item
                    ? "bg-blue-600 text-white"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                {item === "Profile" && <User className="w-4 h-4" />}
                {item === "Dashboard" && <Shield className="w-4 h-4" />}
                {item === "Notifications" && <Bell className="w-4 h-4" />}
                {item === "Appointments" && <Calendar className="w-4 h-4" />}
                {item === "Users" && <Users className="w-4 h-4" />}
                {item === "Plans" && <FileText className="w-4 h-4" />}
                <span className="flex-1">{item}</span>
                {item === "Notifications" && unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>
        {/* MAIN CONTENT */}
        <main
          className="flex-1 p-8 bg-blue-50 min-h-0"
          style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
        >
          <div className="rounded-xl shadow bg-white p-8 min-h-[300px]">
            {/* PROFILE */}
            {selected === "Profile" && (
              <div className="space-y-6">
                <div className="flex items-start gap-6 mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {agent?.profileImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={agent.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-600">
                        {(agent?.name || agent?.email || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {isEditingProfile && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 block mb-1">
                          Change Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="text-sm"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {!isEditingProfile ? (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Name</p>
                    {!isEditingProfile ? (
                      <p className="text-gray-800">
                        {agent?.name || "Not set"}
                      </p>
                    ) : (
                      <input
                        type="text"
                        name="name"
                        value={agent?.name || ""}
                        onChange={handleProfileFieldChange}
                        className="border rounded px-3 py-2 w-full"
                      />
                    )}
                  </div>
                  {/* Role */}
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Role</p>
                    {!isEditingProfile ? (
                      <p className="text-gray-800">{agent?.role || "agent"}</p>
                    ) : (
                      <input
                        type="text"
                        name="role"
                        value={agent?.role || "agent"}
                        onChange={handleProfileFieldChange}
                        className="border rounded px-3 py-2 w-full"
                      />
                    )}
                  </div>
                  {/* Phone (read-only) */}
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Phone</p>
                    <p className="text-gray-800">{agent?.phone || "Not set"}</p>
                  </div>
                  {/* Email */}
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Email</p>
                    <p className="text-gray-800">{agent?.email || "-"}</p>
                  </div>
                </div>
                {/* Status & approval / stats quick view */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        Status
                      </p>
                      <p className="text-gray-800 capitalize">
                        {agent?.status || "inactive"}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={() => updateStatus("active")}
                      >
                        Set Active
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                        onClick={() => updateStatus("inactive")}
                      >
                        Set Inactive
                      </button>
                      
                    </div>
                  </div>
                  {requestStatus && (
                    <div className="text-sm text-blue-600">{requestStatus}</div>
                  )}
                </div>
              </div>
            )}
            {/* DASHBOARD */}
            {selected === "Dashboard" && (
              <div className="space-y-4">
                <h2 className="font-semibold text-xl text-blue-700">
                  Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Claims */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-500">Total Claims</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {stats?.totalClaims || 0}
                    </p>
                  </div>

                  {/* Pending (not yet approved) */}
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-yellow-600">Pending Claims</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {stats?.pendingClaims || 0}
                    </p>
                  </div>

                  {/* Running (approved but not completed) */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-500">Running Policies</p>
                    <p className="text-2xl font-bold text-green-800">
                      {stats?.runningClaims || 0}
                    </p>
                  </div>

                  {/* Completed */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-sm text-purple-500">
                      Completed Policies
                    </p>
                    <p className="text-2xl font-bold text-purple-800">
                      {stats?.completedClaims || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {selected === "Notifications" && (
              <ul className="divide-y">
                {messages.length === 0 && (
                  <li className="py-2 text-sm text-gray-500">
                    No notifications yet.
                  </li>
                )}

                {messages.map((m) => (
                  <li
                    key={m.id}
                    className={`flex items-center justify-between gap-4 py-2 px-2 cursor-pointer ${
                      !m.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleOpenMessage(m)}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">
                        {m.fromName || m.from}
                        {!m.read && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-700 line-clamp-1">
                        {m.content}
                      </div>
                    </div>
                    <div className="w-32 text-sm text-gray-700 text-right">
                      {m.phone || "—"}
                    </div>
                    <div className="w-40 text-xs text-gray-500 text-right">
                      {m.createdAt && new Date(m.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* APPOINTMENTS */}
            {selected === "Appointments" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-blue-700">
                    Claims
                  </h2>
                  <button
                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={refreshClaims}
                  >
                    Refresh
                  </button>
                </div>

                {agentUsers.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No users have claimed policies with you yet.
                  </p>
                ) : (
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 text-blue-700">
                      <tr>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Gender</th>
                        <th className="px-3 py-2 text-left">Plan</th>
                        <th className="px-3 py-2 text-left">Claim Date</th>
                        <th className="px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-blue-600">
                      {agentUsers.map((u, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{u.name}</td>
                          <td className="px-3 py-2">{u.email}</td>
                          <td className="px-3 py-2">{u.gender}</td>
                          <td className="px-3 py-2">{u.policyName}</td>
                          <td className="px-3 py-2">{String(u.claimDate)}</td>
                          <td className="px-3 py-2">
                            {u.status === "APPROVED" ? (
                              <span className="text-xs text-green-600">
                                Approved
                              </span>
                            ) : u.requestSent ? (
                              <span className="text-xs text-blue-600">
                                Request sent
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* USERS of this agent */}
            {selected === "Users" && (
              <div>
                <h2 className="text-lg font-semibold text-blue-700 mb-4">
                  My Users (Approved)
                </h2>
                {approvedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No approved users yet.
                  </p>
                ) : (
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 text-blue-700">
                      <tr>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Gender</th>
                        <th className="px-3 py-2 text-left">Policy</th>
                        <th className="px-3 py-2 text-left">Location</th>
                        <th className="px-3 py-2 text-left">Claim Date</th>
                        <th className="px-3 py-2 text-left">Approved Date</th>
                        <th className="px-3 py-2 text-left">Balance</th>
                        <th className="px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-blue-600">
                      {approvedUsers.map((u, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{u.name}</td>
                          <td className="px-3 py-2">{u.gender}</td>
                          <td className="px-3 py-2">{u.policyName}</td>
                          <td className="px-3 py-2">{u.cityOrVillage}</td>
                          <td className="px-3 py-2">
                            {u.claimDate
                              ? String(u.claimDate).split("T")[0]
                              : "-"}
                          </td>
                          <td className="px-3 py-2">
                            {u.approvedDate ? String(u.approvedDate) : "-"}
                          </td>
                          <td className="px-3 py-2">₹{u.balance.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            {u.completed ? (
                              <span className="text-xs text-green-600">
                                Completed
                              </span>
                            ) : (
                              <button
                                className="px-3 py-1 text-xs rounded bg-orange-500 text-white hover:bg-orange-600"
                                onClick={() => handleComplete(u)}
                              >
                                On Going
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* PLANS (read-only list for agent) */}
            {selected === "Plans" && (
              <div className="space-y-4">
                <div className="flex items-center mb-8">
                  <FileText className="text-blue-500 w-8 h-8 mr-3" />
                  <h1 className="text-2xl font-bold text-blue-700">Plans</h1>
                  <button
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                    onClick={() => setShowAllPlans((s) => !s)}
                  >
                    <Eye className="w-5 h-5" />
                    {showAllPlans ? "Show One" : "View Plan"}
                  </button>
                </div>

                <div className="space-y-6">
                  {plans.length === 0 && (
                    <div className="text-center text-blue-400 p-8 bg-blue-50 rounded-xl">
                      No plans available.
                    </div>
                  )}

                  {(showAllPlans ? plans : plans.slice(0, 1)).map((plan, i) => (
                    <div
                      key={plan.id || i}
                      className="bg-white rounded-xl shadow p-6 border border-blue-100"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-lg text-blue-700">
                          {plan.name}
                        </span>
                      </div>
                      <p className="text-blue-400 mb-2">{plan.description}</p>
                      <div className="flex gap-6 text-blue-600 mb-4">
                        <span className="font-medium">
                          Premium: {plan.monthlyPremium}
                        </span>
                        <span className="font-medium">
                          Coverage: {plan.coverageAmount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
