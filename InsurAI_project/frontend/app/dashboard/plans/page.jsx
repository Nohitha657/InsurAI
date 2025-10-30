"use client";
import { useState } from "react";
import { FileText, Eye } from "lucide-react";

export default function PlansPage() {
  // Plans Data
  const plans = [
    {
      name: "Health Secure",
      description: "Comprehensive health insurance plan for families.",
      premium: "₹10,000/year",
      coverage: "₹5,00,000",
      status: "Active",
    },
    {
      name: "Life Shield",
      description: "Long-term protection and tax benefits.",
      premium: "₹15,000/year",
      coverage: "₹10,00,000",
      status: "Active",
    }
  ];

  const [showPlans, setShowPlans] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [claimResult, setClaimResult] = useState("");

  // Logic: Example eligibility check
  const handleClaim = () => {
    // Example rule: If monthly income > 25,000, user can claim any plan.
    if (Number(monthlyIncome) > 25000) {
      setClaimResult(
        `You are eligible to claim the "${selectedPlan.name}" plan. Our team will contact you soon.`
      );
    } else {
      setClaimResult(
        `For "${selectedPlan.name}" you need a minimum monthly income of ₹25,001.`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center mb-8">
        <FileText className="text-blue-500 w-8 h-8 mr-3" />
        <h1 className="text-2xl font-bold text-blue-700">Plans</h1>
        <button
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          onClick={() => setShowPlans((curr) => !curr)}
        >
          <Eye className="w-5 h-5" /> {showPlans ? "Hide Plans" : "View Plans"}
        </button>
      </div>
      {showPlans && (
        <div className="space-y-6">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg text-blue-700">{plan.name}</span>
                <span className="px-2 py-1 rounded text-xs border border-blue-200 bg-blue-50 text-blue-700">
                  {plan.status}
                </span>
              </div>
              <p className="text-blue-400 mb-2">{plan.description}</p>
              <div className="flex gap-6 text-blue-600 mb-4">
                <span className="font-medium">Premium: {plan.premium}</span>
                <span className="font-medium">Coverage: {plan.coverage}</span>
              </div>
              <button
                className="bg-blue-500 text-white rounded px-5 py-2 mt-2 hover:bg-blue-700"
                onClick={() => {
                  setSelectedPlan(plan);
                  setShowClaimModal(true);
                  setClaimResult("");
                }}
              >
                Claim Insurance
              </button>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="text-center text-blue-400 p-8 bg-blue-50 rounded-xl">
              No plans available.
            </div>
          )}
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
            <h2 className="font-bold text-blue-700 text-xl mb-3">
              Claim Insurance: {selectedPlan?.name}
            </h2>
            {!claimResult ? (
              <div>
                <label className="block text-blue-700 font-medium mb-1">
                  Enter your Monthly Income (₹)
                </label>
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
              </div>
            ) : (
              <div>
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
