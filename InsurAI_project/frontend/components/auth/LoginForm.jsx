"use client";
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 const submit = async (e) => {
  e.preventDefault();
  setErr("");
  setIsLoading(true);

  // Basic validation
  if (!email.trim() || !email.includes("@")) {
    setErr("Please enter a valid email address");
    setIsLoading(false);
    return;
  }
  if (password.length < 8) {
    setErr("Password must be at least 8 characters long");
    setIsLoading(false);
    return;
  }
  try {
      const res = await axios.post("http://localhost:8080/api/users/login", {
      email,
      password,
      });
      
        if (res.data.success && res.data.user) {
          console.log("LOGIN USER:", res.data.user);
          const {email: userEmail, fullName, role} = res.data.user;
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userName", fullName || "User");
        toast.success("Login successful!");

        if (res.data.user.role === "admin") {
          router.push("/admin");
        } else if (res.data.user.role === "agent") {
          localStorage.setItem("agentEmail", userEmail);
          router.push("/agent");
        }
        else {
          router.push("/dashboard");
        }
      } else {
        setErr("Login failed (Invalid credentials)");
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed. Try again!");
    } finally {
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
                <label htmlFor="email" className="text-gray-900 font-medium block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="pl-10 h-11 border border-gray-300 rounded-lg w-full focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-900 font-medium block">
                  Password
                </label>
                <a href="/forgot-password" className="text-xs text-primary hover:text-accent transition-colors">
                  Forgot password?
                </a>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 h-11 border border-gray-300 rounded-lg w-full focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90 transition-opacity text-white font-semibold shadow-md rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login Account"}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign In
                </a>
              </p>
            </form>
          </div>
  );
}
