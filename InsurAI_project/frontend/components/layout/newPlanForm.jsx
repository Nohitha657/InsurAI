import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export function AddPlanForm({ onAdd, onClose, edit = false, plan = null }) {
  // If editing, pre-fill otherwise blank
  const [form, setForm] = useState(
    plan
      ? {
          name: plan.name,
          description: plan.description,
          monthlyPremium: plan.monthlyPremium,
          coverageAmount: plan.coverageAmount
        }
      : {
          name: "",
          description: "",
          monthlyPremium: "",
          coverageAmount: ""
        }
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.name ||
      !form.description ||
      !form.monthlyPremium ||
      !form.coverageAmount
    ) {
      toast.error("Please fill all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const apiData = {
        name: form.name,
        description: form.description,
        monthlyPremium: Number(form.monthlyPremium),
        coverageAmount: Number(form.coverageAmount)
      };
      const backendUrl = "http://localhost:8080/api/plans";
      const response = await fetch(
        edit && plan?.id ? `${backendUrl}/${plan.id}` : backendUrl,
        {
          method: edit && plan?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData)
        }
      );

      if (!response.ok) throw new Error("Failed to save plan");
      const newPlan = await response.json();
      onAdd(newPlan);
      toast.success(edit ? "Plan updated!" : "Plan added!");
      setForm({
        name: "",
        description: "",
        monthlyPremium: "",
        coverageAmount: ""
      });
      onClose();
    } catch (error) {
      toast.error("Error saving plan!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-blue-700 flex gap-2 items-center mb-2">
        <Plus /> {edit ? "Edit Plan" : "New Plan"}
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
        type="number"
        placeholder="Monthly Premium"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.monthlyPremium}
        onChange={e => setForm({ ...form, monthlyPremium: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Coverage Amount"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.coverageAmount}
        onChange={e => setForm({ ...form, coverageAmount: e.target.value })}
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 shadow"
        disabled={isLoading}
      >
        {isLoading ? (edit ? "Saving..." : "Adding...") : (edit ? "Save Changes" : "Add Plan")}
      </button>
    </form>
  );
}
