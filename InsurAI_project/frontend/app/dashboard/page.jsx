"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Shield,Users,User,Calendar,FileText,Eye } from "lucide-react";
import Footer from "../../components/layout/Footer";
import AppointmentsPage from "../dashboard/appointments/page";
import PlansDashboard from "../dashboard/plans/page";



export default function DashboardPage() {
  // Static user for demo; use real data later
  const [selected, setSelected] = useState("Profile"); // default to Profile
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [contactAgent, setContactAgent] = useState(null); // selected agent
  const [contactMessage, setContactMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    profileImageUrl: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [editProfile, setEditProfile] = useState({
    fullName: "",
    phone: "",
    address: "",
    profileImageUrl: "",
  });
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const emailFromStorage = localStorage.getItem("userEmail");
  const nameFromStorage = localStorage.getItem("userName");
  const localProfileRaw = localStorage.getItem("userProfile");

  let localProfile = null;
  if (localProfileRaw) {
    try {
      localProfile = JSON.parse(localProfileRaw);
    } catch {
      localProfile = null;
    }
  }

  if (!emailFromStorage) {
    window.location.href = "/login";
    return;
  }

  // 1) If we already have a saved profile, USE IT and skip backend
  if (localProfile) {
    const mergedLocal = {
      fullName: localProfile.fullName || nameFromStorage || "User",
      email: localProfile.email || emailFromStorage,
      role: localProfile.role || "user",
      phone: localProfile.phone || "",
      address: localProfile.address || "",
      profileImageUrl: localProfile.profileImageUrl || "",
    };
    setProfile(mergedLocal);
    setUserName(mergedLocal.fullName || "User");
    setLoading(false);
    return; // IMPORTANT: do not fetch and overwrite
  }

  // 2) No saved profile yet → fall back to backend once
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users/me", {
        params: { email: emailFromStorage },
      });
      const data = res.data;

      const mergedFromApi = {
        fullName: data.fullName || nameFromStorage || "User",
        email: data.email || emailFromStorage,
        role: data.role || "user",
        phone: "",
        address: "",
        profileImageUrl: "",
      };

      setProfile(mergedFromApi);
      setUserName(mergedFromApi.fullName || "User");
    } catch (e) {
      console.error("Error loading profile", e);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSaveProfile = () => {
  const stored = {
    fullName: profile.fullName,
    email: profile.email,
    role: profile.role,
    phone: profile.phone,
    address: profile.address,
    profileImageUrl: profile.profileImageUrl,
  };

  localStorage.setItem("userProfile", JSON.stringify(stored));
  localStorage.setItem("userName", stored.fullName || "User");
  setUserName(stored.fullName || "User");

  setIsEditing(false);
  alert("Profile saved");
};



  const handleLogout = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userProfile");
        window.location.href = "/login";
      }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .catch(() => setAgents([]));
  }, []);


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
            {userName}
          </span>
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
            {["Profile", "Dashboard", "Appointments", "Agents", "Plans"].map(
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
                  {item === "Agents" && (
                    <Users className="w-4 h-4" />
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

        {/* Main Content Area */}
        <main
          className="flex-1 p-6 overflow-y-auto bg-blue-50"
          style={{
            height: "calc(100vh - 120px)"
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
                              {(profile.fullName ||
                                profile.email ||
                                "U")
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
                          <p className="text-sm font-semibold text-gray-500">Name</p>
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
                          <p className="text-sm font-semibold text-gray-500">Email</p>
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
                          <p className="text-sm font-semibold text-gray-500">Role</p>
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
                          <p className="text-sm font-semibold text-gray-500">Phone</p>
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
                          <p className="text-sm font-semibold text-gray-500">Address</p>
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
                  <div className="space-y-4">
                    <span className="font-semibold text-xl text-blue-700">
                      Dashboard
                    </span>
                    {policies.length === 0 ? (
                      <p className="text-gray-600">
                        You have no policies yet.
                      </p>
                    ) : (
                      <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-3 py-2 text-left">
                              Plan Name
                            </th>
                            <th className="border px-3 py-2 text-right">
                              Total Amount
                            </th>
                            <th className="border px-3 py-2 text-right">
                              Due Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {policies.map((p) => (
                            <tr key={p.id}>
                              <td className="border px-3 py-2">
                                {p.planName}
                              </td>
                              <td className="border px-3 py-2 text-right">
                                {p.totalAmount}
                              </td>
                              <td className="border px-3 py-2 text-right">
                                {p.dueAmount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
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
                                onClick={() => {
                                  // TODO: send to backend or email
                                  alert("Message sent to " + agent.name);
                                  setContactAgent(null);
                                  setContactMessage("");
                                }}
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

