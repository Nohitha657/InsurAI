import React from "react";
import { User2, Mail, Phone, Briefcase } from "lucide-react";

export default function AgentCard({ agent }) {
  // agent object expected shape: { name, email, phone, specialization, status, ... }
  return (
    <div className="bg-white rounded-xl shadow p-5 flex gap-5 items-center border border-gray-100">
      <div className="flex-shrink-0">
        {/* You can replace with agent avatar if you have URLs */}
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
          <User2 className="w-8 h-8" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-lg text-gray-900">{agent.name}</span>
          {agent.status && (
            <span className={`ml-2 text-xs px-2 py-1 rounded ${agent.status === "active" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-700"}`}>
              {agent.status}
            </span>
          )}
        </div>
        <p className="flex items-center text-gray-600 text-sm">
          <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
          {agent.specialization || "General Agent"}
        </p>
        <div className="flex gap-4 mt-2 text-gray-500 text-sm">
          <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{agent.email}</span>
          {agent.phone && (
            <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{agent.phone}</span>
          )}
        </div>
      </div>
    </div>
  );
}
