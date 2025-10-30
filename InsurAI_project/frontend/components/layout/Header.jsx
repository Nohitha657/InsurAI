import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Shield } from "lucide-react";
export default function Header() {
  // const { user, logout } = useAuth();
  return (
    <header className="bg-blue-600 shadow p-4 flex justify-between items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="text-white w-8 h-8" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">InsurePro</h1>
        </div>
        <p className="text-center mt-2 text-sm opacity-90 text-white">Trusted Insurance Solutions</p>
      </div>
      <div className="flex items-center space-x-4">
        {/* {user ? (
          <>
            <div className="text-sm">Hello, {user.fullName || user.email}</div>
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          </>
        ) : (
          <a href="/login" className="px-3 py-1 bg-indigo-600 text-white rounded">Login</a>
        )} */}
      </div>
    </header>
  );
}
