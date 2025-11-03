import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export function AddPlanForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    premium: "",
    coverage: "",
    status: "Active"
  });
  const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.premium || !form.coverage) {
      toast.error("Please fill all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to add plan");
      const newPlan = await response.json();
      onAdd(newPlan); // update list in parent
      toast.success("Plan added!");
      setForm({ name: "", description: "", premium: "", coverage: "", status: "Active" });
      onClose();
    } catch (error) {
      toast.error("Error adding plan!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-blue-700 flex gap-2 items-center mb-2">
        <Plus /> New Plan
      </h2>
      <input
        type="text"
        placeholder="Plan Name"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Plan Description"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Premium (e.g. ₹10,000/year)"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.premium}
        onChange={e => setForm({ ...form, premium: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Coverage (e.g. ₹5,00,000)"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.coverage}
        onChange={e => setForm({ ...form, coverage: e.target.value })}
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 shadow"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Plan"}
      </button>
    </form>
  );
}
