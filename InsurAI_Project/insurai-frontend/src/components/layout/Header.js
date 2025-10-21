import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="text-2xl font-bold">InsurAI</div>
        <div className="text-sm text-gray-500">Corporate Policy Automation</div>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="text-sm">Hello, {user.fullName || user.email}</div>
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          </>
        ) : (
          <a href="/login" className="px-3 py-1 bg-indigo-600 text-white rounded">Login</a>
        )}
      </div>
    </header>
  );
}
