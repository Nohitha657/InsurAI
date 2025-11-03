import React, { useState } from "react";
import { Shield, User, Mail, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function RegisterForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user"
  });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Make sure to use this!

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setIsLoading(true);

    // Basic validation
    if (!form.fullName.trim()) {
      setErr("Please enter your full name");
      setIsLoading(false);
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setErr("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (form.password.length < 8) {
      setErr("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/users/register", form);
      if (res.data && res.data.id) {
        setErr(""); // Clear error
        toast.success("Account created successfully!");
        setIsLoading(false);
        setForm({ fullName: "", email: "", password: "", role: "user" });

        setTimeout(() => {
          if (res.data.role === "admin") {
            router.push("/login");
          } else {
            router.push("/login");
          }
        }, 100); // short delay to let toast show

        return; // Stop here! Don't set error below
      } else {
        setErr("Registration failed. Try a different email.");
        setIsLoading(false);
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Registration failed. Try again later.");
      setIsLoading(false);
    }
  };

  return (
    
  <div className="px-8 pb-8">
            <form onSubmit={submit} className="space-y-4">
               {err && (
                <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-600 text-sm">
                  {err}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-gray-900 font-medium block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="pl-10 h-11 border border-gray-300 rounded-lg w-full focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-900 font-medium block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john.doe@example.com"
                    className="pl-10 h-11 border border-gray-300 rounded-lg w-full focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-900 font-medium block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Minimum 8 characters"
                    className="pl-10 h-11 border border-gray-300 rounded-lg w-full focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Use at least 8 characters with a mix of letters and numbers
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="Role" className="text-gray-900 font-medium block">
                  Role
                </label>
                <div className="relative">
                  {/* Replace Shield with another icon if you have a better fit */}
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className="appearance-none pl-10 h-11 border border-gray-300 rounded-lg w-full focus:border-blue-500 focus:ring-blue-500 bg-gray-50 text-gray-700"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {/* Optional: down arrow for select */}
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">
                  Select your account type
                </p>
              </div>

             {/* Hidden role input. If you ever want to expose for admin, use a select.  */}
              <input type="hidden" value={form.role} />
              <button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90 transition-opacity text-white font-semibold shadow-md rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                  Login
                </a>
              </p>
            </form>
          </div>
    
  );
}
