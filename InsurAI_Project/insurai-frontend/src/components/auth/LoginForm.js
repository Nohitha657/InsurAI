import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-3 border rounded" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 mb-3 border rounded" />
      <button className="w-full py-2 bg-indigo-600 text-white rounded">Login</button>
    </form>
  );
}
