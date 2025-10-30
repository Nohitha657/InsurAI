import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function AvailabilityEditor({ agentId }) {
  const [slots, setSlots] = useState([]);
  const [form,setForm] = useState({ date: "", startTime: "", endTime: "" });

  useEffect(()=>{ load(); }, []);

  async function load() {
    try {
      const res = await api.get(`/api/agents/${agentId}/availability`);
      setSlots(res.data);
    } catch(err){ console.error(err); }
  }

  async function add(e) {
    e.preventDefault();
    try {
      await api.post(`/api/agents/${agentId}/availability`, {
        date: form.date, startTime: form.startTime, endTime: form.endTime
      });
      setForm({ date: "", startTime: "", endTime: "" });
      load();
    } catch(err){ console.error(err); alert("Add failed"); }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Availability</h3>
      <form onSubmit={add} className="flex flex-col gap-2">
        <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="p-2 border rounded" />
        <input type="time" value={form.startTime} onChange={e=>setForm({...form, startTime: e.target.value})} className="p-2 border rounded" />
        <input type="time" value={form.endTime} onChange={e=>setForm({...form, endTime: e.target.value})} className="p-2 border rounded" />
        <button className="py-2 bg-green-600 text-white rounded">Add</button>
      </form>
      <ul className="mt-4 space-y-2">
        {slots.map(s => <li key={s.id} className="p-2 border rounded">{s.date} {s.startTime} - {s.endTime}</li>)}
      </ul>
    </div>
  );
}
