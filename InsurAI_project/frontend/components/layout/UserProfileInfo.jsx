// UserProfileInfo.jsx
import React, { useEffect, useState } from "react";

export function UserProfileInfo({ userId, onClose }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${userId}/profile`)
  .then(res => {
    if (!res.ok) throw new Error("Network error");
    return res.text();
  })
  .then(text => text ? JSON.parse(text) : {})
  .then(data => setInfo(data))
  .finally(() => setLoading(false));

  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!info) return <div>Profile load failed.</div>;

  return (
    <div>
      <h2 className="text-gray-500 text-xl font-bold mb-2">{info.fullName}</h2>
      <p className="text-gray-500 mb-1">
        <strong>Agent:</strong> {info.agentName}
      </p>
      <p className="text-gray-500 mb-1">
        <strong>Plan:</strong> {info.planName} - {info.planDescription}
      </p>
      <p className="text-gray-500 mb-1">
        <strong>Total Policy Amount:</strong> ₹{info.totalAmount}<br />
        <strong>Paid:</strong> ₹{info.paidAmount}<br />
        <strong>Balance:</strong> <span className="font-bold text-red-600">₹{info.totalAmount - info.paidAmount}</span>
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
