// src/pages/dashboard/agent.js
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import AvailabilityEditor from "../../components/agents/AvailabilityEditor";
import AgentCard from "../../components/agents/AgentCard";
import { formatDateTime } from "../../utils/dateHelper";

export default function AgentDashboard() {
  const { get } = useApi();
  const [agent, setAgent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // assuming backend has a /api/users/me or /api/agents/me
        const profile = await get("/api/users/me");
        setAgent(profile);

        // fetch agent appointments
        const appts = await get(`/api/appointments/agent?agentId=${profile.id}`);
        setAppointments(appts || []);
      } catch (err) {
        console.error("Agent dashboard load error", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!agent) return <div className="p-6">No agent profile found. Please login as an agent.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <AgentCard agent={agent} />
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Manage availability</h3>
            <AvailabilityEditor agentId={agent.id} />
          </div>
        </div>

        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {appointments.length === 0 && <div className="bg-white p-4 rounded shadow">No upcoming appointments</div>}
            {appointments.map(a => (
              <div key={a.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-medium">{a.customerName || a.customerEmail}</div>
                  <div className="text-sm text-gray-600">{a.planName || "Plan not set"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{formatDateTime(a.startDatetime)}</div>
                  <div className="text-xs text-gray-500">{a.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
