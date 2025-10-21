// src/pages/dashboard/plans.js
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import Link from "next/link";

export default function PlansPage() {
  const { get, del } = useApi();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await get("/api/plans");
      setPlans(data || []);
    } catch (err) {
      console.error("Failed to load plans", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(planId) {
    if (!confirm("Delete this plan?")) return;
    try {
      await del(`/api/plans/${planId}`);
      load();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Plans</h1>
          <Link href="/admin"><a className="px-3 py-2 bg-indigo-600 text-white rounded">Admin</a></Link>
        </div>

        <div className="grid gap-4">
          {loading && <div className="p-4 bg-white rounded shadow">Loading...</div>}
          {!loading && plans.length === 0 && <div className="p-4 bg-white rounded shadow">No plans found</div>}
          {plans.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-700">₹{p.price}</div>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
