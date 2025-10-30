"use client";
import { useState } from "react";
import { User, Users, Calendar, FileText, Plus } from "lucide-react";
import { AddAgentForm } from "../../components/layout/newAgentForm"; 
import { AddUserForm } from "../../components/layout/newUserForm"; 
import { AddPlanForm } from "../../components/layout/newPlanForm";

export default function AdminDashboard() {
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  const summaryStats = [
    { icon: <User className="w-7 h-7 text-blue-600" />, label: "Users", value: users.length },
    { icon: <Users className="w-7 h-7 text-blue-500" />, label: "Agents", value: agents.length },
    { icon: <Calendar className="w-7 h-7 text-blue-400" />, label: "Appointments", value: 0 },
    { icon: <FileText className="w-7 h-7 text-blue-300" />, label: "Plans", value: plans.length },
  ];

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
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
          <ul className="divide-y">
            {users.map((user, i) => (
              <li key={user.email || i} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-blue-700">{user.fullName}</span>
                  <span className="ml-2 text-xs text-blue-400">{user.email}</span>
                </div>
                <span className="px-2 py-1 rounded text-xs border border-blue-200 bg-blue-50 text-blue-700">active</span>
              </li>
            ))}
          </ul>
        </div>
        {/*Plans Section */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100 mt-10">
          <div className="flex items-center mb-4">
            <FileText className="text-blue-500 w-6 h-6 mr-2" />
            <span className="font-semibold text-xl text-blue-700">Plans</span>
            <button className="ml-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setShowPlanForm(true)}>
              <Plus className="w-4 h-4" /> Add Plan
            </button>
          </div>
          <ul className="divide-y">
          {plans.map((plan, i) => (
          <li key={i} className="py-3 flex flex-col gap-1">
            <span className="font-bold text-blue-700">{plan.name}</span>
            <span className="text-blue-400">{plan.description}</span>
            <span className="font-medium text-blue-600">Premium: {plan.premium}</span>
            <span className="font-medium text-blue-600">Coverage: {plan.coverage}</span>
          </li>
          ))}
          </ul>
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
      {showUserForm && (
        <Modal onClose={() => setShowUserForm(false)}>
          <AddUserForm
            onAdd={user => setUsers(prev => [...prev, user])}
            onClose={() => setShowUserForm(false)}
          />
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
