 //  const [form, setForm] = useState({ email: "", password: "" });
  // const [err, setErr] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();

  // const submit = async (e) => {

  //   e.preventDefault();
  //   setErr("");
  //   setIsLoading(true);

  //   // Basic validation
  //   if (!form.email.trim() || !form.email.includes("@")) {
  //     setErr("Please enter a valid email address");
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (form.password.length < 8) {
  //     setErr("Password must be at least 8 characters long");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     // Adjust '/api/login' to wherever your login API is
  //     const res = await axios.post("/api/login", {
  //       email: form.email,
  //       password: form.password,
  //     });

  //     if (res.data.success) {
  //       toast.success("Login successful!", {
  //         description: "Welcome back to InsurePro.",
  //       });
  //       router.push("/dashboard"); // Redirect to dashboard
  //     } else {
  //       setErr(res.data.message || "Login failed.");
  //     }
  //   } catch (error) {
  //     setErr(
  //       error.response?.data?.message ||
  //         "Login failed. Please try again or contact support."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
"use client";
import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Shield, Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios"; // Make sure this is installed

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // const submit = async (e) => {
  //   e.preventDefault();
  //   setErr("");
  //   setIsLoading(true);

  //   // Example validation
  //   if (!form.email.trim() || !form.email.includes("@")) {
  //     setErr("Please enter a valid email address");
  //     setIsLoading(false);
  //     return;
  //   }
  //   if (form.password.length < 8) {
  //     setErr("Password must be at least 8 characters long");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     // Adjust the API route as needed
  //     const res = await axios.post("/api/login", {
  //       email: form.email,
  //       password: form.password,
  //     });

  //     if (res.data.success) {
  //       localStorage.setItem("userRole", res.data.user.role); // Save role
  //       toast.success("Login successful!");
  //       if (res.data.user.role === "admin") {
  //         router.push("/admin");
  //       } else {
  //         router.push("/dashboard");
  //       }
  //     } else {
  //       setErr(res.data.message || "Login failed.");
  //     }
  //   } catch (error) {
  //     setErr(
  //       error.response?.data?.message ||
  //       "Login failed. Please try again or contact support."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
const submit = async (e) => {
  e.preventDefault();
  setErr("");
  setIsLoading(true);

  // Basic validation
  if (!form.email.trim() || !form.email.includes("@")) {
    setErr("Please enter a valid email address");
    setIsLoading(false);
    return;
  }
  if (form.password.length < 3) {
    setErr("Password must be at least 3 characters long");
    setIsLoading(false);
    return;
  }

  // Mock login logic for development (replace with real API later)
  setTimeout(() => {
    setIsLoading(false);
    
    // Mock: If email contains "admin", make them admin
    const mockRole = form.email.includes("admin") ? "admin" : "user";
    
    localStorage.setItem("userRole", mockRole);
    toast.success("Login successful!");
    
    if (mockRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }, 1000);
};

  return (
    <div>
      <Header />
      <div className="bg-blue-50 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mx-auto bg-white text-gray-900 rounded-xl shadow-lg border border-gray-300">
          <div className="space-y-1 pb-6 pt-8 px-8">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Welcome Back</h2>
            <p className="text-center text-gray-500">
              Please login to your account
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
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
