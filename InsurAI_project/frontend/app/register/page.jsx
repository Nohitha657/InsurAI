"use client";
import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Shield, User, Mail, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" // Always set default role here
  });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      // Send registration data to backend
      const res = await axios.post("http://localhost:8080/api/users/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role // Always include!
      });

      if (res.data && res.data.id) {
        toast.success("Account created successfully!", {
          description: "Welcome to InsurePro. You can now apply for policies.",
        });
        // You may redirect here if desired
        // router.push("/login");
        setForm({ fullName: "", email: "", password: "", role: "user" });
      } else {
        setErr("Registration failed. Try a different email or contact support.");
      }
    } catch (error) {
      setErr(
        error?.response?.data?.message || "Registration failed. Try later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-blue-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px:6 lg:px:8">
        <div className="w-full max-w-md mx-auto bg-white text-gray-900 rounded-xl shadow-lg border border-gray-300">
          <div className="space-y-1 pb-6 pt-8 px-8">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Create Your Account</h2>
            <p className="text-center text-gray-500">
              Register to start your insurance policy application
            </p>
          </div>
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
              {/* Hidden role input. If you ever want to expose for admin, use a select. */}
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
