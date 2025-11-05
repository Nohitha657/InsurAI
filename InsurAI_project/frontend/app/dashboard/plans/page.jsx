"use client";
import React, { useEffect, useState } from "react";
import { FileText, Eye, Plus, Trash, Edit2 } from "lucide-react";

const useAuth = () => ({ user: { role: "admin" } }); // or "user"

export default function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);


  // Claim
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [claimResult, setClaimResult] = useState("");
  const [showAllPlans, setShowAllPlans] = useState(false);

  // Load plans
  useEffect(() => {
    setLoading(true); // ensure loading spinner on refresh
    fetch("http://localhost:8080/api/plans")
      .then(res => res.json())
      .then(data => setPlans(Array.isArray(data) ? data : []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  // Handle claim button
  const openClaimModal = (plan) => {
    setSelectedPlan(plan);
    setShowClaimModal(true);
    setMonthlyIncome("");
    setClaimResult("");
  };
  
  const handleClaim = async () => {
    // Client-only check, e.g., min. income
    if (Number(monthlyIncome) < 10000) {
      setClaimResult(`For ${selectedPlan.name}, you need a minimum monthly income of 10,000.`);
      return;
    }
    // Optionally POST to backend for actual claim
    
    await fetch(`http://localhost:8080/api/plans/${selectedPlan.id}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, monthlyIncome }),
    });
    
    setClaimResult(`You are eligible to claim the ${selectedPlan.name} plan. Our team will contact you soon.`);
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
            onClick={() => setShowAllPlans(s => !s)}
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
          <div key={plan.id || i} className="bg-white rounded-xl shadow p-6 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg text-blue-700">{plan.name}</span>
            </div>
            <p className="text-blue-400 mb-2">{plan.description}</p>
            <div className="flex gap-6 text-blue-600 mb-4">
              <span className="font-medium">Premium: {plan.monthlyPremium}</span>
              <span className="font-medium">Coverage: {plan.coverageAmount}</span>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
            <h2 className="font-bold text-blue-700 text-xl mb-3">
              Claim Insurance: {selectedPlan?.name}
            </h2>
            {!claimResult ? (
              <>
                <label className="block text-blue-700 font-medium mb-1">Enter your Monthly Income</label>
                <input
                  type="number"
                  className="border text-black border-blue-300 rounded px-3 py-2 mb-3 w-full"
                  value={monthlyIncome}
                  min={0}
                  onChange={e => setMonthlyIncome(e.target.value)}
                />
                <button
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                  onClick={handleClaim}
                  disabled={!monthlyIncome}
                >
                  Submit Claim
                </button>
                <button
                  className="ml-4 text-blue-400 hover:text-blue-700"
                  onClick={() => {
                    setShowClaimModal(false);
                    setMonthlyIncome("");
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="mb-3 text-blue-700">{claimResult}</p>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    setShowClaimModal(false);
                    setMonthlyIncome("");
                  }}
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
