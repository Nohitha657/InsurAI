"use client";

import React, { useEffect, useState } from "react";
import { FileText, Eye } from "lucide-react";

const useAuth = () => ({
  user: {
    // make sure you replace this with real auth later
    role: "user",
    email:
      typeof window !== "undefined"
        ? localStorage.getItem("userEmail")
        : "test@example.com",
  },
});

export default function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [claimData, setClaimData] = useState({
    name: "",
    age: "",
    cityOrVillage: "",
    gender: "",
    policyName: "",
    agentName: "",
  });

  const [showAllPlans, setShowAllPlans] = useState(false);

  // Load plans
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/plans")
      .then((res) => res.json())
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  // open claim modal
  const openClaimModal = (plan, agentName) => {
    setSelectedPlan(plan);
    setClaimData((prev) => ({
      ...prev,
      policyName: plan.name,
      agentName: agentName || "",
    }));
    setShowClaimModal(true);
  };

  const handleClaimChange = (e) => {
    const { name, value } = e.target;
    setClaimData((prev) => ({ ...prev, [name]: value }));
  };

  const submitClaim = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...claimData,
          age: Number(claimData.age),
          email: user.email,
          policyName: selectedPlan?.name ?? claimData.policyName,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      alert("Claim submitted successfully");
      setShowClaimModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit claim");
    }
  };

  if (loading) return <div>Loading plans...</div>;

  const displayPlans = showAllPlans ? plans : plans.slice(0, 1);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center mb-8">
        <FileText className="text-blue-500 w-8 h-8 mr-3" />
        <h1 className="text-2xl font-bold text-blue-700">Plans</h1>
        <button
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          onClick={() => setShowAllPlans((s) => !s)}
        >
          <Eye className="w-5 h-5" /> {showAllPlans ? "Show One" : "View Plan"}
        </button>
      </div>

      <div className="space-y-6">
        {plans.length === 0 && (
          <div className="text-center text-blue-400 p-8 bg-blue-50 rounded-xl">
            No plans available.
          </div>
        )}
        {displayPlans.map((plan, i) => (
          <div
            key={plan.id || i}
            className="bg-white rounded-xl shadow p-6 border border-blue-100"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg text-blue-700">
                {plan.name}
              </span>
            </div>
            <p className="text-blue-400 mb-2">{plan.description}</p>
            <div className="flex gap-6 text-blue-600 mb-4">
              <span className="font-medium">
                Premium: {plan.monthlyPremium}
              </span>
              <span className="font-medium">
                Coverage: {plan.coverageAmount}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white rounded px-5 py-2 hover:bg-blue-700"
                onClick={() => openClaimModal(plan)}
              >
                Claim
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Submit Claim</h2>
            <form onSubmit={submitClaim} className="space-y-3">
              <div>
                <label className="block text-blue-700 text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={claimData.name}
                  onChange={handleClaimChange}
                  className="w-full border text-black rounded px-2 py-1 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-blue-700 font-medium mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={claimData.age}
                  onChange={handleClaimChange}
                  className="w-full border text-black rounded px-2 py-1 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-blue-700 font-medium mb-1">
                  City / Village
                </label>
                <input
                  name="cityOrVillage"
                  value={claimData.cityOrVillage}
                  onChange={handleClaimChange}
                  className="w-full border text-black rounded px-2 py-1 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-blue-700 font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={claimData.gender}
                  onChange={handleClaimChange}
                  className="w-full border text-black rounded px-2 py-1 text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-blue-700 font-medium mb-1">
                  Policy Name
                </label>
                <input
                  name="policyName"
                  value={claimData.policyName}
                  onChange={handleClaimChange}
                  className="w-full border text-black rounded px-2 py-1 text-sm"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm text-blue-700 font-medium mb-1">
                  Agent Name
                </label>
                <select
                  name="agentName"
                  value={claimData.agentName}
                  onChange={handleClaimChange}
                  className="w-full border text-black rounded px-2 py-1 text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option value="Chidaraboina Nohitha">
                    Chidaraboina Nohitha
                  </option>
                  <option value="Agent B">Agent B</option>
                  <option value="Agent C">Agent C</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-3 py-1 hover:bg-blue-600 hover:text-white text-blue-600 rounded border text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
