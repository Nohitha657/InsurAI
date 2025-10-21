"use client";
import dynamic from "next/dynamic";

const VoiceQuery = dynamic(() => import("../components/voice/VoiceQuery"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">InsurAI</h1>
            <p className="text-sm text-gray-600">
              Corporate Policy Automation & Appointment System
            </p>
          </div>
          <div className="space-x-3">
            <a href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded">
              Login
            </a>
            <a href="/register" className="px-4 py-2 border rounded">
              Register
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 grid grid-cols-3 gap-6">
        <section className="col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">What we do</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>User authentication & roles</li>
            <li>Voice-based customer query handling</li>
            <li>Agent availability & appointment scheduling</li>
            <li>Admin dashboard & notifications</li>
          </ul>
        </section>

        <aside className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-3">Try voice query</h3>
          <VoiceQuery />
        </aside>
      </main>
    </div>
  );
}
