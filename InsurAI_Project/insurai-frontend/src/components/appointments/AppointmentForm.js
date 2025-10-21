import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AppointmentForm({ initial, onDone }) {
  const [agents, setAgents] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    agentId: initial?.agentId || "",
    planId: initial?.planId || "",
    date: initial?.date || "",
    startTime: initial?.startTime || "",
    durationMins: initial?.durationMins || 30,
    notes: ""
  });

  useEffect(() => {
    api.get("/api/agents").then(r => setAgents(r.data)).catch(()=>{});
    api.get("/api/plans").then(r => setPlans(r.data)).catch(()=>{});
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const start = new Date(form.date + "T" + form.startTime);
      const end = new Date(start.getTime() + form.durationMins * 60000);
      const payload = {
        agentId: form.agentId,
        planId: form.planId,
        startDatetime: start.toISOString(),
        endDatetime: end.toISOString(),
        notes: form.notes
      };
      await api.post("/api/appointments", payload);
      alert("Appointment requested");
      onDone && onDone();
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md">
      <h3 className="mb-3 font-semibold">Book appointment</h3>
      <select value={form.agentId} onChange={e=>setForm({...form, agentId: e.target.value})} className="w-full mb-2 p-2 border rounded">
        <option value="">Select agent</option>
        {agents.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
      </select>
      <select value={form.planId} onChange={e=>setForm({...form, planId: e.target.value})} className="w-full mb-2 p-2 border rounded">
        <option value="">Select plan</option>
        {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full mb-2 p-2 border rounded" />
      <input type="time" value={form.startTime} onChange={e=>setForm({...form, startTime: e.target.value})} className="w-full mb-2 p-2 border rounded" />
      <input type="number" value={form.durationMins} onChange={e=>setForm({...form, durationMins: e.target.value})} className="w-full mb-2 p-2 border rounded" />
      <textarea value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} placeholder="Notes" className="w-full p-2 mb-2 border rounded"></textarea>
      <button className="w-full py-2 bg-indigo-600 text-white rounded">Book</button>
    </form>
  );
}
