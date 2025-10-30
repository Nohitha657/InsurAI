"use client";
import Link from "next/link";
import Footer from "../components/layout/Footer";
import { Shield, CheckCircle, FileText, UserPlus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight select-none">
            InsurAI
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg text-blue-600 font-medium hover:bg-blue-100 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 justify-center items-stretch px-4">
          {/* What We Offer */}
          <div className="md:w-1/2 w-full bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <h2 className="text-blue-500 font-semibold text-lg mb-4">What We Offer</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                Register and manage your insurance policies online
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <FileText className="w-6 h-6 text-blue-400" />
                Simple, paperless documentation process
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <UserPlus className="w-6 h-6 text-blue-400" />
                Secure, fast account creation and sign in
              </li>
            </ul>
          </div>
          {/* Benefits */}
          <div className="md:w-1/2 w-full bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <h2 className="text-blue-500 font-semibold text-lg mb-4">Benefits</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-6 h-6 text-green-400" />
                24/7 access to your policy documents
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Instant notifications for updates
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Dedicated customer support
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
