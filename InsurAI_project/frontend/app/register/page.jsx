"use client";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";
import { Shield, User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const router = useRouter();

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
          <RegisterForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}
