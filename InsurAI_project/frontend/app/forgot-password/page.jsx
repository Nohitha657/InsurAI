"use client";
import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Mail, Shield } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    // Simulate API call for now. Replace this with your API in the future!
    setTimeout(() => {
      setIsLoading(false);
      toast.success("If your email exists, password reset instructions were sent.");
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
            <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
            <p className="text-center text-gray-500">
              Enter your email address and we’ll send you a password reset link.
            </p>
          </div>
          <div className="px-8 pb-8">
            <form onSubmit={handleForgot} className="space-y-4">
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
                    placeholder="Enter your email"
                    className="pl-10 h-11 border border-gray-300 rounded-lg w-full focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90 transition-opacity text-white font-semibold shadow-md rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                <a href="/login" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                  Back to Login
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
