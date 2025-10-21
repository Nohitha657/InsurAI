import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [form,setForm] = useState({ fullName: "", email: "", password: "" });
  const [err,setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await register(form);
      router.push("/login");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <input value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} placeholder="Full name" className="w-full p-2 mb-3 border rounded" />
      <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 mb-3 border rounded" />
      <input value={form.password} onChange={e=>setForm({...form, password: e.target.value})} placeholder="Password" type="password" className="w-full p-2 mb-3 border rounded" />
      <button className="w-full py-2 bg-green-600 text-white rounded">Create account</button>
    </form>
  );
}
