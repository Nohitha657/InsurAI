"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Shield, Users, User, Calendar, FileText } from "lucide-react";
import Footer from "../../components/layout/Footer";
import AppointmentsPage from "../dashboard/appointments/page";
import PlansDashboard from "../dashboard/plans/page";

export default function DashboardPage() {
  const [selected, setSelected] = useState("Profile");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [claimedPlans, setClaimedPlans] = useState(null);
  const [contactAgent, setContactAgent] = useState(null);
  const [contactMessage, setContactMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    profileImageUrl: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    role: "",
  });
  const [claimForm, setClaimForm] = useState({
    age: "",
    agentName: "",
    cityOrVillage: "",
    gender: "",
    name: "",
    policyName: "",
    claimDate: "",
  });

  const [planSummary, setPlanSummary] = useState(null);

  // Load profile on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const emailFromStorage = localStorage.getItem("userEmail");
    const nameFromStorage = localStorage.getItem("userName");

    if (!emailFromStorage) {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users/me", {
          params: { email: emailFromStorage },
        });
        const data = res.data;

        const profileFromApi = {
          fullName: data.fullName || nameFromStorage || "User",
          email: data.email || emailFromStorage,
          role: data.role || "user",
          phone: data.phone || "",
          address: data.address || "",
          profileImageUrl: data.profileImageUrl || "",
        };

        setProfile(profileFromApi);
        setUserName(profileFromApi.fullName || "User");
        localStorage.setItem("userName", profileFromApi.fullName || "User");
      } catch (e) {
        console.error("Error loading profile", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Load agents once
  useEffect(() => {
    fetch("http://localhost:8080/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .catch(() => setAgents([]));
  }, []);

  // helper: fetch claimed plans
  const fetchClaimedPlans = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const res = await fetch(
      `http://localhost:8080/api/users/me/claimed-plans?email=${encodeURIComponent(
        email
      )}`
    );
    if (!res.ok) return;
    const data = await res.json();
    setClaimedPlans(data);
  };

  // helper: fetch plan summary
  const fetchPlanSummary = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const res = await fetch(
      `http://localhost:8080/api/users/me/plan-summary?email=${encodeURIComponent(
        email
      )}`
    );
    if (!res.ok) return;
    const data = await res.json();
    setPlanSummary(data);
  };

  // when tab changes to Dashboard, load both
  useEffect(() => {
    if (selected === "Dashboard") {
      fetchClaimedPlans();
      fetchPlanSummary();
    }
  }, [selected]);

  // Called by PlansDashboard when user selects a plan
  const handlePlanSelected = async (plan) => {
    try {
      const email =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;
      if (!email) {
        alert("No user email found, please login again.");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/users/select-plan?email=${encodeURIComponent(
          email
        )}&planId=${plan.id}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed to select plan");

      alert("Plan selected successfully");
      await fetchPlanSummary(); // refresh dashboard data
      setSelected("Dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to select plan");
    }
  };

  // message sending to agent
  const handleSendMessage = async (agent) => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      await fetch("http://localhost:8080/api/messages/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentEmail: agent.email,
          userEmail,
          message: contactMessage,
        }),
      });
      alert("Message sent to " + agent.name);
      setContactAgent(null);
      setContactMessage("");
    } catch (e) {
      console.error("Error sending message", e);
      alert("Failed to send message");
    }
  };

  // handle edit profile
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // handle profile field changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.toString();
      setProfile((prev) => ({ ...prev, profileImageUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // save profile changes
  const handleSaveProfile = async () => {
    try {
      const emailFromStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;
      if (!emailFromStorage) {
        alert("No user email found, please login again.");
        return;
      }

      await axios.put(
        "http://localhost:8080/api/users/me",
        {
          fullName: profile.fullName,
          phone: profile.phone,
          address: profile.address,
        },
        {
          params: { email: emailFromStorage },
        }
      );

      alert("Profile updated");
      setIsEditing(false);
    } catch (e) {
      console.error("Error saving profile", e);
      alert("Error saving profile");
    }
  };

  // payment modal
  const [paymentPlan, setPaymentPlan] = useState(null);
  const openPaymentModal = (planRow) => {
    setPaymentPlan(planRow);
  };
  const closePaymentModal = () => setPaymentPlan(null);

  // confirm payment
  const confirmPayment = async (planRow) => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("No user email found");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/users/me/mark-paid?email=${encodeURIComponent(
          email
        )}&amount=${planRow.monthlyPremium}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      alert("Payment recorded successfully");

      // refresh claimed plans so table updates
      await fetchClaimedPlans();
      closePaymentModal();
    } catch (e) {
      console.error(e);
      alert("Failed to record payment");
    }
  };

  // logout handler
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userProfile");
      window.location.href = "/login";
    }
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
          <span className="font-semibold text-blue-700">{userName}</span>
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
        <aside className="w-64 bg-white border-r border-blue-100 p-5 flex-shrink-0">
          <nav className="space-y-2">
            {["Profile", "Dashboard", "Agents", "Plans"].map((item) => (
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
                {item === "Appointments" && <Calendar className="w-4 h-4" />}
                {item === "Agents" && <Users className="w-4 h-4" />}
                {item === "Users" && <User className="w-4 h-4" />}
                {item === "Plans" && <FileText className="w-4 h-4" />}
                <span>{item}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main
          className="flex-1 p-6 overflow-y-auto bg-blue-50"
          style={{
            height: "calc(100vh - 120px)",
          }}
        >
          <div className="rounded-xl shadow bg-white p-8 min-h-[300px]">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {/* PROFILE SECTION */}
                {selected === "Profile" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-blue-700 mb-4">
                      Profile
                    </h2>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profile.profileImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profile.profileImageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-gray-600">
                            {(profile.fullName || profile.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        {isEditing && (
                          <div>
                            <label className="text-sm font-semibold text-gray-500 block mb-1">
                              Change Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="text-sm"
                            />
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          {!isEditing ? (
                            <button
                              onClick={() => handleEditProfile(true)}
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
                        <p className="text-sm font-semibold text-gray-500">
                          Name
                        </p>
                        {!isEditing ? (
                          <p className="text-gray-800">
                            {profile.fullName || "Not set"}
                          </p>
                        ) : (
                          <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleProfileChange}
                            className="border rounded px-3 py-2 w-full text-gray-500"
                          />
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Email
                        </p>
                        {!isEditing ? (
                          <p className="text-gray-800">
                            {profile.email || "Not set"}
                          </p>
                        ) : (
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="border rounded px-3 py-2 w-full text-gray-500"
                          />
                        )}
                      </div>

                      {/* Role */}
                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Role
                        </p>
                        {!isEditing ? (
                          <p className="text-gray-800">
                            {profile.role || "Not set"}
                          </p>
                        ) : (
                          <select
                            name="role"
                            value={profile.role}
                            onChange={handleProfileChange}
                            className="border rounded px-3 py-2 w-full text-gray-500"
                          >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                          </select>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Phone
                        </p>
                        {!isEditing ? (
                          <p className="text-gray-800">
                            {profile.phone || "Not set"}
                          </p>
                        ) : (
                          <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="border rounded px-3 py-2 w-full text-gray-500"
                          />
                        )}
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-gray-500">
                          Address
                        </p>
                        {!isEditing ? (
                          <p className="text-gray-800">
                            {profile.address || "Not set"}
                          </p>
                        ) : (
                          <textarea
                            name="address"
                            value={profile.address}
                            onChange={handleProfileChange}
                            className="border rounded px-3 py-2 w-full text-gray-500"
                            rows={3}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* DASHBOARD / POLICIES SECTION */}
                {selected === "Dashboard" && (
                  <div>
                    <h2 className="text-lg text-blue-600 font-semibold mb-4">
                      My Claimed Plans
                    </h2>
                    {!claimedPlans || claimedPlans.hasClaims === false ? (
                      <p className="text-sm text-gray-500">
                        You have not claimed any plans yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead className="bg-gray-50 text-blue-600 border-b">
                            <tr>
                              <th className="px-3 py-2 text-left">
                                Policy Name
                              </th>
                              <th className="px-3 py-2 text-left">Agent</th>
                              <th className="px-3 py-2 text-left">
                                Total Amount
                              </th>
                              <th className="px-3 py-2 text-left">
                                Monthly Premium
                              </th>
                              <th className="px-3 py-2 text-left">Paid</th>
                              <th className="px-3 py-2 text-left">Due</th>
                              <th className="px-3 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-blue-400">
                            {claimedPlans.plans.map((p, i) => (
                              <tr key={i} className="border-t">
                                <td className="px-3 py-2">{p.policyName}</td>
                                <td className="px-3 py-2">{p.agentName}</td>
                                <td className="px-3 py-2">₹{p.totalAmount}</td>
                                <td className="px-3 py-2">
                                  ₹{p.monthlyPremium}
                                </td>
                                <td className="px-3 py-2">₹{p.paidAmount}</td>
                                <td className="px-3 py-2">₹{p.dueAmount}</td>
                                <td className="px-3 py-2">
                                  <button
                                    className="px-3 py-1 rounded bg-green-600 text-white text-xs"
                                    onClick={() => openPaymentModal(p)}
                                  >
                                    Pay
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {/* payment modal */}
                {paymentPlan && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Pay for {paymentPlan.policyName}
                      </h2>
                      {/* For now show a static QR image / UPI link */}
                      <div className="flex justify-center mb-4">
                        {/* replace src with your QR code image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/qr-code.png"
                          alt="Payment QR"
                          className="w-40 h-40 border"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Scan this QR code with your UPI app to pay ₹
                        {paymentPlan.monthlyPremium}. After payment, click “I
                        have paid”.
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1 text-sm rounded border"
                          onClick={closePaymentModal}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
                          onClick={() => confirmPayment(paymentPlan)}
                        >
                          I have paid
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* EXISTING SECTIONS */}
                {selected === "Agents" && (
                  <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <Users className="text-blue-500 w-6 h-6 mr-2" />
                      <span className="font-semibold text-xl text-blue-700">
                        Agents
                      </span>
                    </div>
                    <ul className="divide-y">
                      {agents.length === 0 && (
                        <li className="py-3 text-gray-500">No agents found.</li>
                      )}

                      {agents.map((agent, i) => (
                        <li
                          key={agent.id || agent.email || i}
                          className="py-3 flex flex-col gap-2"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-gray-800">
                                {agent.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                {agent.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded text-xs border border-blue-200 bg-blue-50 text-blue-700">
                                {agent.status || "active"}
                              </span>
                              <button
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-700"
                                onClick={() => {
                                  setContactAgent(agent);
                                  setContactMessage("");
                                }}
                              >
                                Contact
                              </button>
                            </div>
                          </div>

                          {/* Contact box for this agent */}
                          {contactAgent && contactAgent.id === agent.id && (
                            <div className="mt-2 border border-blue-100 rounded-lg p-3 bg-blue-50">
                              <label className="block text-xs font-semibold text-blue-700 mb-1">
                                Message to {agent.name}
                              </label>
                              <textarea
                                rows={3}
                                className="w-full border rounded px-2 py-1 text-sm text-gray-500"
                                value={contactMessage}
                                onChange={(e) =>
                                  setContactMessage(e.target.value)
                                }
                                placeholder="Type your message here..."
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  onClick={() => {
                                    setContactAgent(null);
                                    setContactMessage("");
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                                  onClick={() =>
                                    // TODO: send to backend or email
                                    handleSendMessage(agent)
                                  }
                                >
                                  Send
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
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
