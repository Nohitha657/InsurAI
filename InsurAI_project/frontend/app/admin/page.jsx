"use client";
import { useState,useEffect } from "react";
import { User, Eye, Edit2,Trash, Users, Calendar, FileText, Plus } from "lucide-react";
import { AddAgentForm } from "../../components/layout/newAgentForm"; 
import { AddPlanForm } from "../../components/layout/newPlanForm";
import Footer from "@/components/layout/Footer";

export default function AdminDashboard() {
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [showAllPlans, setShowAllPlans] = useState(false);

  const summaryStats = [
    { icon: <User className="w-7 h-7 text-blue-600" />, label: "Users", value: users.length },
    { icon: <Users className="w-7 h-7 text-blue-500" />, label: "Agents", value: agents.length },
    { icon: <Calendar className="w-7 h-7 text-blue-400" />, label: "Appointments", value: 0 },
    { icon: <FileText className="w-7 h-7 text-blue-300" />, label: "Plans", value: plans.length },
  ];

  useEffect(() => {
    fetch("http://localhost:8080/api/plans")
      .then(res => res.json())
      .then(data => setPlans(Array.isArray(data) ? data : []))
      .catch(() => setPlans([]));
  }, []);

   // Add new plan to state
  const handleAdd = (plan) => setPlans(ps => [...ps, plan]);

  // Update plan in state after edit
  const handleUpdate = (updatedPlan) => {
    setPlans(ps => ps.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  // Delete plan (with confirmation and close edit if active)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    const res = await fetch(`http://localhost:8080/api/plans/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPlans(plans.filter((p) => p.id !== id));
      if (editPlan && editPlan.id === id) setEditPlan(null); // Close edit if open
    } else {
      alert("Failed to delete plan.");
    }
  };
const displayPlans = showAllPlans ? plans : plans.slice(0, 1);
  return (
    <div className="bg-blue-50 max-w-7xl mx-auto px-6">
      <div className="mb-8 text-center pt-10">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <p className="text-blue-400">Manage your insurance system efficiently!</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {summaryStats.map(stat => (
          <div key={stat.label} className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center border border-blue-100">
            <div className="mb-3">{stat.icon}</div>
            <div className="font-semibold text-xl text-blue-700">{stat.value}</div>
            <div className="text-blue-400 text-base font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Agents Section */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
          <div className="flex items-center mb-4">
            <Users className="text-blue-500 w-6 h-6 mr-2" />
            <span className="font-semibold text-xl text-blue-700">Recent Agents</span>
            <button className="ml-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setShowAgentForm(true)}>
              <Plus className="w-4 h-4" /> Add Agent
            </button>
          </div>
          <ul className="divide-y">
            {agents.map((agent, i) => (
              <li key={agent.email || i} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-blue-700">{agent.name}</span>
                  <span className="ml-2 text-xs text-blue-400">{agent.email}</span>
                </div>
                <span className="px-2 py-1 rounded text-xs border border-blue-200 bg-blue-50 text-blue-700">{agent.status}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Users Section */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
          <div className="flex items-center mb-4">
            <User className="text-blue-600 w-6 h-6 mr-2" />
            <span className="font-semibold text-xl text-blue-700">Recent Users</span>
            <button className="ml-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setShowUserForm(true)}>
              <Eye className="w-4 h-4" /> View User
            </button>
          </div>
          <ul className="divide-y">
            {users.map((user, i) => (
              <li key={user.email || i} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-medium text-blue-700">{user.fullName}</span>
                <span className="ml-2 text-xs text-blue-400">{user.email}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="px-2 py-1 rounded text-xs border border-blue-200 bg-blue-50 text-blue-700">active</span>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                  onClick={() => setSelectedProfileUser(user)}
                >
                  Profile
                </button>
              </div>
              </li>
              ))}
          </ul>
        </div>
        {/*Plans Section */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100 mt-10" style={{
              height: "calc(100vh - 120px)", // Adjust 120px to match your header+footer height
              overflowY: "auto",
            }}>
          <div className="flex items-center mb-4" >
            <FileText className="text-blue-500 w-6 h-6 mr-2" />
            <span className="font-semibold text-xl text-blue-700">Plans</span>
            <button className="ml-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setShowPlanForm(true)}>
              <Plus className="w-4 h-4" /> Add Plan
            </button>
            <button
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              onClick={() => setShowAllPlans(s => !s)}
            >
              <Eye className="w-5 h-5" /> {showAllPlans ? "Show One" : "View Plan"}
            </button>
          </div>
          
          <ul className="divide-y" >
          {displayPlans.map((plan, i) => (
          <div key={plan.id || i} className="bg-white rounded-xl shadow p-6 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg text-blue-700">{plan.name}</span>
            </div>
            <p className="text-blue-400 mb-2">{plan.description}</p>
            <div className="flex gap-6 text-blue-600 mb-4">
              <span className="font-medium">Premium: {plan.monthlyPremium}</span>
              <span className="font-medium">Coverage: {plan.coverageAmount}</span>
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
          {/* Edit Plan Modal (reuse AddPlanForm with plan prop and PUT logic) */}
          {editPlan && (
            <Modal onClose={() => setEditPlan(null)}>
              <AddPlanForm
                edit={true}
                plan={editPlan}
                onAdd={async (form) => {
                  // Construct updateBody with backend field names
                  const updateBody = {
                    name: form.name,
                    description: form.description,
                    monthlyPremium: form.monthlyPremium,
                    coverageAmount: form.coverageAmount,
                    status: form.status,
                  };
                  const res = await fetch(`http://localhost:8080/api/plans/${editPlan.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateBody),
                  });
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
      </div>



      {/* Modal Forms */}
      {showAgentForm && (
        <Modal onClose={() => setShowAgentForm(false)}>
          <AddAgentForm
            onAdd={agent => setAgents(prev => [...prev, agent])}
            onClose={() => setShowAgentForm(false)}
          />
        </Modal>
      )}
      {selectedProfileUser && (
        <Modal onClose={() => setSelectedProfileUser(null)}>
          <UserProfileInfo userId={selectedProfileUser.id} onClose={() => setSelectedProfileUser(null)} />
        </Modal>
      )}
      {showPlanForm && (
      <Modal onClose={() => setShowPlanForm(false)}>
        <AddPlanForm
          onAdd={plan => setPlans(prev => [...prev, plan])}
          onClose={() => setShowPlanForm(false)}
        />
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
        <button className="absolute top-3 right-3 text-blue-400 text-xl" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}
