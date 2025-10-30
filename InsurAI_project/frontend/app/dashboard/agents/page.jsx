"use client";
import { useState } from "react";
import AgentCard from "../../../components/agents/AgentCard"; // adjust the path if needed
import { Users, Eye, Phone, Mic } from "lucide-react";

export default function AgentsPage() {
  // 👇 All useState are now inside the functional component
  const [showAgents, setShowAgents] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [userQuery, setUserQuery] = useState("");

  // Mock agent data (replace with backend/API when ready)
  const agents = [
    {
      name: "Amit Rao",
      email: "amit@insurai.com",
      phone: "9876543210",
      specialization: "Life Insurance",
      status: "active"
    },
    {
      name: "Priya Sharma",
      email: "priya@insurai.com",
      phone: "9930011122",
      specialization: "Health Insurance",
      status: "pending"
    }
  ];

  const handleContact = (agent) => {
    window.open(`mailto:${agent.email}`);
  };

  const handleVoiceQuery = (agent) => {
    setCurrentAgent(agent);
    setShowVoiceModal(true);
  };

  const handleSendQuery = () => {
    alert(`Query sent to ${currentAgent?.name}: ${userQuery}`);
    setShowVoiceModal(false);
    setUserQuery("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center mb-8">
        <Users className="text-blue-500 w-8 h-8 mr-3" />
        <h1 className="text-2xl font-bold text-blue-700">Agents</h1>
        <button
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          onClick={() => setShowAgents((curr) => !curr)}
        >
          <Eye className="w-5 h-5" /> {showAgents ? "Hide Agents" : "View Agents"}
        </button>
      </div>
      {showAgents && (
        <div className="space-y-6">
          {agents.map((agent, i) => (
            <div key={i} className="relative">
              <AgentCard agent={agent} />
              {agent.status === "active" && (
                <div className="flex gap-3 mt-2">
                  <button
                    className="flex items-center gap-1 px-4 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100"
                    onClick={() => handleContact(agent)}
                  >
                    <Phone className="w-4 h-4" /> Contact
                  </button>
                  <button
                    className="flex items-center gap-1 px-4 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100"
                    onClick={() => handleVoiceQuery(agent)}
                  >
                    <Mic className="w-4 h-4" /> Voice Query
                  </button>
                </div>
              )}
            </div>
          ))}
          {agents.length === 0 && (
            <div className="text-center text-blue-400 p-8 bg-blue-50 rounded-xl">No agents found.</div>
          )}
        </div>
      )}

      {/* Modal for Voice Query */}
      {showVoiceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="font-bold mb-4 text-blue-700 text-lg">
              Send Query to {currentAgent?.name}
            </h2>
            <textarea
              className="w-full text-black border rounded p-2 mb-4 focus:outline-blue-500"
              rows={4}
              placeholder="Type your question or message here"
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
              onClick={handleSendQuery}
              disabled={userQuery.length === 0}
            >
              Send
            </button>
            <button
              className="ml-3 text-blue-400 hover:text-blue-700"
              onClick={() => setShowVoiceModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
