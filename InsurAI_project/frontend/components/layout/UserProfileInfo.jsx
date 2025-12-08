// UserProfileInfo.jsx
import React, { useEffect, useState } from "react";

export function UserProfileInfo({ userId, isAgent, onClose }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Choose endpoint based on whether it's an agent or user
    const url = isAgent
      ? `http://localhost:8080/api/agents/${userId}/profile`
      : `http://localhost:8080/api/users/${userId}/profile`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.text();
      })
      .then((text) => (text ? JSON.parse(text) : {}))
      .then((data) => setInfo(data))
      .catch((err) => {
        console.error("Error loading profile:", err);
        setInfo(null);
      })
      .finally(() => setLoading(false));
  }, [userId, isAgent]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!info) return <div className="p-6 text-red-600">Profile load failed.</div>;

  // Agent profile view
  if (isAgent) {
    return (
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Agent Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-500">Agent Name:</label>
            <p className="text-gray-800 text-lg">{info.name}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Email:</label>
            <p className="text-gray-800">{info.email}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Phone:</label>
            <p className="text-gray-800">{info.phone || "N/A"}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Status:</label>
            <p className="text-gray-800 capitalize">{info.status}</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Statistics</h3>

            <div className="mb-2">
              <label className="text-sm font-semibold text-gray-500">Total Policies:</label>
              <p className="text-gray-800 text-lg">{info.totalPolicies}</p>
            </div>

            <div className="mb-2">
              <label className="text-sm font-semibold text-gray-500">Completed Policies:</label>
              <p className="text-green-600 text-lg">{info.completedPolicies}</p>
            </div>

            <div className="mb-2">
              <label className="text-sm font-semibold text-gray-500">Pending Policies:</label>
              <p className="text-orange-600 text-lg">{info.pendingPolicies}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    );
  }

  // User profile view 
  return (
  <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto">
    <h2 className="text-xl font-bold text-blue-700 mb-4 sticky top-0 bg-white pb-2 border-b">
      User Profile
    </h2>

    <div className="space-y-3 px-1">
      {/* User Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
          <p className="text-gray-800 font-medium">{info.fullName}</p>
        </div>
        
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Agent</label>
          <p className="text-gray-800 font-medium">{info.agentName}</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
        <p className="text-gray-800 text-sm">{info.email}</p>
      </div>

      {/* Plan Details */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
        <label className="text-xs font-semibold text-blue-700 uppercase block mb-1">
          Plan
        </label>
        <p className="text-gray-800 font-semibold">{info.planName}</p>
        {info.planDescription && (
          <p className="text-xs text-gray-600 mt-1">{info.planDescription}</p>
        )}
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Payment Details</h3>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white rounded p-2 border">
            <label className="text-xs text-gray-500 block">Total</label>
            <p className="text-gray-800 font-bold">
              ₹{info.totalAmount?.toFixed(0) || 0}
            </p>
          </div>
          
          <div className="bg-white rounded p-2 border">
            <label className="text-xs text-green-600 block">Paid</label>
            <p className="text-green-600 font-bold">
              ₹{info.paidAmount?.toFixed(0) || 0}
            </p>
          </div>
          
          <div className="bg-white rounded p-2 border">
            <label className="text-xs text-red-600 block">Balance</label>
            <p className="text-red-600 font-bold">
              ₹{((info.totalAmount || 0) - (info.paidAmount || 0)).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={onClose}
      className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Close
    </button>
  </div>
);

}
