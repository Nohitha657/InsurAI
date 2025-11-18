import { useState } from "react";
import { UserPlus, User } from "lucide-react";
import { toast } from "react-hot-toast";

export function AddAgentForm({ onAdd,onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    status: "active"
  });
  const addAgent = (agent) => {
    fetch('http://localhost:8080/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    })
      .then(res => res.json())
      .then(newAgent => setAgents([...agents, newAgent]));
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.specialization) {
      toast.error("Please fill all required fields.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to add agent");
      const newAgent = await response.json();
      onAdd(newAgent); // update list in parent/Admin Dashboard
      toast.success("Agent added!");
      setForm({ name: "", email: "", phone: "", specialization: "", status: "active" });
      onClose();
    } catch (error) {
      toast.error("Error adding agent!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-blue-700 flex gap-2 items-center mb-2">
        <UserPlus /> Add Agent
      </h2>
      <input
        type="text"
        placeholder="Name"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Phone"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />
      <input
        type="text"
        placeholder="Specialization"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.specialization}
        onChange={e => setForm({ ...form, specialization: e.target.value })}
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 shadow"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Agent"}
      </button>
    </form>
  );
}
