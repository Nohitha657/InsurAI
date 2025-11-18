import React, { useState, useEffect } from "react";

// Agent Profile Modal/Panel
function AgentProfile({ agent, onClose }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!agent) return;
    fetch(`http://localhost:8080/api/agents/${agent.id}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [agent]);

  if (!profile) return <div className="p-4">Loading agent details...</div>;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50" style={{ background: 'rgba(211,218,232,.6)' }}>
  <div className="relative bg-white rounded-xl p-8 shadow-lg min-w-[340px] min-h-[240px] flex flex-col">
    {/* Close button for modal */}
    <button
      className="absolute right-6 top-6 text-xl text-blue-400 font-bold"
      onClick={onClose}
    >×</button>

    <h2 className="text-gray-500 text-xl font-bold mb-2">{profile.name}</h2>
    <p className="text-gray-500 mb-1">
      <strong>Agent:</strong> {profile.name}
    </p>
    <p className="text-gray-500 mb-1">
      <strong>Plan:</strong> {profile.planName} - {profile.planDescription}
    </p>
    <p className="text-gray-500 mb-1">
      <strong>Total Policy Amount:</strong> ₹{profile.totalAmount}<br />
      <strong>Paid:</strong> ₹{profile.paidAmount}<br />
      <strong>Balance:</strong> <span className="font-bold text-red-600">
        ₹{(profile.totalAmount || 0) - (profile.paidAmount || 0)}
      </span>
    </p>
    <button
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 self-center"
      onClick={onClose}
    >
      Close
    </button>
  </div>
</div>

  );
}

export default function AgentList() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/agents")
      .then(res => res.json())
      .then(data => setAgents(data));
  }, []);

  return (
    <div>
      <ul>
        {agents.map((agent, i) => (
          <li key={agent.id || i} className="py-3 flex justify-between items-center">
            <div>
              <span className="font-medium text-gray-500">{agent.name}</span>
              {/* Add email etc if desired */}
            </div>
            <div className="flex gap-2 items-center">
              <span className="px-2 py-1 rounded text-xs border border-blue-200 bg-blue-50 text-blue-700">
                {agent.status === "active" ? "active" : "inactive"}
              </span>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                onClick={() => setSelectedAgent(agent)}
              >
                Profile
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedAgent && (
        <AgentProfile agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}