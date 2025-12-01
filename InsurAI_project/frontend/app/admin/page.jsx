"use client";
import { useState, useEffect } from "react";
import {User,Eye,Edit2,Trash,Users,Calendar,FileText,Plus,Shield,} from "lucide-react";
import AppointmentsPage from "../dashboard/appointments/page";
import PlansDashboard from "../dashboard/plans/page";
import Footer from "../../components/layout/Footer";
import { UserProfileInfo } from "../../components/layout/UserProfileInfo";
import AgentList from "../../components/layout/AgentList";

export default function AdminDashboard() {
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  
  // layout state
  const [selected, setSelected] = useState("Profile"); // Profile, Dashboard, Appointments,User, Agents, Plans
  const [userName, setUserName] = useState("");
  const [adminProfile, setAdminProfile] = useState({
    profileImageUrl: "",
    fullName: "",
    email: "",
    role: "",
    phone: "",
    address: "",
  });
  const [isAdminEditing, setIsAdminEditing] = useState(false);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const emailFromStorage =
    localStorage.getItem("adminEmail") || localStorage.getItem("userEmail");

  const storedProfileRaw = localStorage.getItem("adminProfile");
  if (storedProfileRaw) {
    try {
      const stored = JSON.parse(storedProfileRaw);
      setAdminProfile(stored);
      setUserName(stored.fullName || "Admin");
      return; // skip backend if local copy exists
    } catch {
      // ignore parse error and continue to backend
    }
  }

  if (!emailFromStorage) {
    window.location.href = "/login";
    return;
  }

  const nameFromStorage = localStorage.getItem("userName");
  setUserName(nameFromStorage || "Admin");

  const fetchAdmin = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/me?email=${encodeURIComponent(
          emailFromStorage
        )}`
      );
      if (!res.ok) return;
      const data = await res.json();
      const profile = {
        id: data.id,
        fullName: data.fullName || nameFromStorage || "Admin",
        email: data.email || emailFromStorage,
        role: data.role || "admin",
        phone: data.phone || "",
        address: data.address || "",
        profileImageUrl: data.profileImageUrl || "",
      };
      setAdminProfile(profile);
      setUserName(profile.fullName);
    } catch (e) {
      console.error("Error loading admin profile", e);
    }
  };

  fetchAdmin();
  }, []); 


  const summaryStats = [
    {
      icon: <User className="w-7 h-7 text-blue-600" />,
      label: "Users",
      value: users.filter((u) => u.role === "user").length,
    },
    {
      icon: <Users className="w-7 h-7 text-blue-500" />,
      label: "Agents",
      value: agents.length,
    },
    {
      icon: <Calendar className="w-7 h-7 text-blue-400" />,
      label: "Appointments",
      value: 0,
    },
    {
      icon: <FileText className="w-7 h-7 text-blue-300" />,
      label: "Plans",
      value: plans.length,
    },
  ];

  // Fetch plans
  useEffect(() => {
    fetch("http://localhost:8080/api/plans")
      .then((res) => res.json())
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .catch(() => setPlans([]));
  }, []);

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:8080/api/users/only-users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Fetch agents
  useEffect(() => {
    fetch("http://localhost:8080/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data));
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
  };
  const handleAdminFieldChange = (e) => {
  const { name, value } = e.target;
  setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.toString();
      setAdminProfile((prev) => ({ ...prev, profileImageUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdminSave = () => {
    // Save only to localStorage + state (no backend)
    const updated = { ...adminProfile };

    // Update header name
    setUserName(updated.fullName || "Admin");

    // Save name for header
    localStorage.setItem("userName", updated.fullName || "Admin");

    // Save full profile so it loads next time
    localStorage.setItem("adminProfile", JSON.stringify(updated));

    setAdminProfile(updated);
    setIsAdminEditing(false);
    alert("Profile saved locally");
  };


  // Add new plan to state
  const handleAdd = (plan) => setPlans((ps) => [...ps, plan]);

  // Update plan in state after edit
  const handleUpdate = (updatedPlan) => {
    setPlans((ps) => ps.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  // Delete plan
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    const res = await fetch(`http://localhost:8080/api/plans/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPlans(plans.filter((p) => p.id !== id));
      if (editPlan && editPlan.id === id) setEditPlan(null);
    } else {
      alert("Failed to delete plan.");
    }
  };

  const displayPlans = showAllPlans ? plans : plans.slice(0, 1);

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* TOP HEADER */}
      <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight select-none">
            InsurAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-blue-700">{userName}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* BODY: SIDEBAR + MAIN */}
      <div className="flex flex-1 min-h-0">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-blue-100 p-5 flex-shrink-0">
          <nav className="space-y-2">
            {["Profile", "Dashboard", "Appointments", "Agents","Users", "Plans"].map(
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

        {/* MAIN CONTENT */}
        <main
          className="flex-1 p-6 overflow-y-auto"
          style={{ height: "calc(100vh - 120px)" }}
        >
          {/* PROFILE VIEW (simple placeholder, you can plug your profile component here) */}
          {selected === "Profile" && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 max-w-3xl">
              <h2 className="text-xl font-bold text-blue-700 mb-4">
                Profile
              </h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {adminProfile.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={adminProfile.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-600">
                      {(adminProfile.fullName ||
                        adminProfile.email ||
                        "A")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {isAdminEditing && (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 block mb-1">
                        Change Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAdminImageChange}
                        className="text-sm"
                      />
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {!isAdminEditing ? (
                      <button
                        onClick={() => setIsAdminEditing(true)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleAdminSave}
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
                  {!isAdminEditing ? (
                    <p className="text-gray-800">
                      {adminProfile.fullName || "Not set"}
                    </p>
                  ) : (
                    <input
                      type="text"
                      name="fullName"
                      value={adminProfile.fullName}
                      onChange={handleAdminFieldChange}
                      className="border rounded px-3 py-2 w-full text-gray-500"
                    />
                  )}
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm font-semibold text-gray-500">Email</p>
                  {!isAdminEditing ? (
                    <p className="text-gray-800">
                      {adminProfile.email || "Not set"}
                    </p>
                  ) : (
                    <input
                      type="email"
                      name="email"
                      value={adminProfile.email}
                      onChange={handleAdminFieldChange}
                      className="border rounded px-3 py-2 w-full text-gray-500"
                    />
                  )}
                </div>

                {/* Role */}
                <div>
                  <p className="text-sm font-semibold text-gray-500">Role</p>
                  {!isAdminEditing ? (
                    <p className="text-gray-800">
                      {adminProfile.role || "Not set"}
                    </p>
                  ) : (
                    <select
                      name="role"
                      value={adminProfile.role}
                      onChange={handleAdminFieldChange}
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
                  {!isAdminEditing ? (
                    <p className="text-gray-800">
                      {adminProfile.phone || "Not set"}
                    </p>
                  ) : (
                    <input 
                      type="text"
                      name="phone"
                      value={adminProfile.phone}
                      onChange={handleAdminFieldChange}
                      className="border rounded px-3 py-2 w-full text-gray-500"
                    />
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold text-gray-500">Address</p>
                  {!isAdminEditing ? (
                    <p className="text-gray-800">
                      {adminProfile.address || "Not set"}
                    </p>
                  ) : (
                    <textarea 
                      name="address"
                      value={adminProfile.address}
                      onChange={handleAdminFieldChange}
                      className="border rounded px-3 py-2 w-full text-gray-500"
                      rows={3}
                    />
                  )}
                </div>
              </div>
            </div>
          )}


          {/* DASHBOARD: stats + recent agents/users/plans (your existing content) */}
          {selected === "Dashboard" && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-blue-700">
                  Admin Dashboard
                </h1>
                <p className="text-blue-400">
                  Manage your insurance system efficiently!
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {summaryStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center border border-blue-100"
                  >
                    <div className="mb-3">{stat.icon}</div>
                    <div className="font-semibold text-xl text-blue-700">
                      {stat.value}
                    </div>
                    <div className="text-blue-400 text-base font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPOINTMENTS (placeholder for now) */}
          {selected === "Appointments" && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-blue-700 mb-4">
                Appointments
              </h2>
              <p className="text-blue-500">
                Hook your appointments component here.
              </p>
            </div>
          )}

          {/* AGENTS: reuse existing Agents section in full width */}
          {selected === "Agents" && (
            <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <Users className="text-blue-500 w-6 h-6 mr-2" />
                <span className="font-semibold text-xl text-blue-700">
                  Agents
                </span>
                <button
                  className="ml-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  onClick={() => setShowAgentForm(true)}
                >
                  <Plus className="w-4 h-4" /> Add Agent
                </button>
              </div>
              <AgentList />
            </div>
          )}
          {/* USERS: simple list of users with modal */}
          {selected === "Users" && (
            <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <User className="text-blue-500 w-6 h-6 mr-2" />
                <span className="font-semibold text-xl text-blue-700">
                  Users
                </span>
              </div>
              <ul className="divide-y">
                {users.filter((u) => u.role === "user").length === 0 && (
                  <li className="py-3 text-gray-500">No users found.</li>
                )}

                {users
                  .filter((u) => u.role === "user")
                  .map((u, i) => (
                    <li
                      key={u.id || u.email || i}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium text-gray-800">
                          {u.fullName}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="px-2 py-1 rounded text-xs border border-blue-200 bg-blue-50 text-blue-700">
                          active
                        </span>
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                          onClick={() => setSelectedProfileUser(u)}
                        >
                          Profile
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {/* PLANS: your existing plans card list */}
          {selected === "Plans" && (
            <div
              className="bg-white shadow-md rounded-xl p-6 border border-blue-100"
              style={{ height: "calc(100vh - 160px)", overflowY: "auto" }}
            >
              <div className="flex items-center mb-4">
                <FileText className="text-blue-500 w-6 h-6 mr-2" />
                <span className="font-semibold text-xl text-blue-700">
                  Plans
                </span>
                <button
                  className="ml-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  onClick={() => setShowPlanForm(true)}
                >
                  <Plus className="w-4 h-4" /> Add Plan
                </button>
                <button
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                  onClick={() => setShowAllPlans((s) => !s)}
                >
                  <Eye className="w-5 h-5" />{" "}
                  {showAllPlans ? "Show One" : "View Plan"}
                </button>
              </div>

              <ul className="divide-y">
                {displayPlans.map((plan, i) => (
                  <div
                    key={plan.id || i}
                    className="bg-white rounded-xl shadow p-6 border border-blue-100 mb-4"
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
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white rounded px-5 py-2 hover:bg-green-700"
                        onClick={() => setEditPlan(plan)}
                      >
                        <Edit2 className="inline w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white rounded px-5 py-2 hover:bg-red-700"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash className="inline w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </ul>

              {showAdd && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                  <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
                    <AddPlanForm
                      onAdd={(plan) => {
                        handleAdd(plan);
                        setShowAdd(false);
                      }}
                      onClose={() => setShowAdd(false)}
                    />
                  </div>
                </div>
              )}

              {editPlan && (
                <Modal onClose={() => setEditPlan(null)}>
                  <AddPlanForm
                    edit={true}
                    plan={editPlan}
                    onAdd={async (form) => {
                      const updateBody = {
                        name: form.name,
                        description: form.description,
                        monthlyPremium: form.monthlyPremium,
                        coverageAmount: form.coverageAmount,
                        status: form.status,
                      };
                      const res = await fetch(
                        `http://localhost:8080/api/plans/${editPlan.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(updateBody),
                        }
                      );
                      if (!res.ok) {
                        alert("Error saving plan!");
                        return;
                      }
                      const updated = await res.json();
                      handleUpdate(updated);
                      setEditPlan(null);
                    }}
                    onClose={() => setEditPlan(null)}
                  />
                </Modal>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals (unchanged) */}
      {showAgentForm && (
        <Modal onClose={() => setShowAgentForm(false)}>
          <AddAgentForm
            onAdd={(agent) => setAgents((prev) => [...prev, agent])}
            onClose={() => setShowAgentForm(false)}
          />
        </Modal>
      )}
      {selectedProfileUser && (
        <Modal onClose={() => setSelectedProfileUser(null)}>
          <UserProfileInfo
            userId={selectedProfileUser.id}
            onClose={() => setSelectedProfileUser(null)}
          />
        </Modal>
      )}
      {showPlanForm && (
        <Modal onClose={() => setShowPlanForm(false)}>
          <AddPlanForm
            onAdd={(plan) => setPlans((prev) => [...prev, plan])}
            onClose={() => setShowPlanForm(false)}
          />
        </Modal>
      )}
      {showUserForm && (
        <Modal onClose={() => setShowUserForm(false)}>
          <div>
            <h2 className="text-blue-500 font-bold text-lg mb-3">All Users</h2>
            <ul>
              {users.length === 0 && (
                <li className="text-gray-500">No users found.</li>
              )}
              {users.map((user) => (
                <li key={user.id} className="mb-2 border-b pb-2">
                  <span className="text-gray-500 font-semibold">
                    {user.fullName}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {user.email}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
      <Footer />
    </div>
  );
}

// --- Modal Component ---
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur">
      <div className="bg-white rounded-lg shadow-xl p-8 min-w-[340px] relative">
        <button
          className="absolute top-3 right-3 text-blue-400 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
