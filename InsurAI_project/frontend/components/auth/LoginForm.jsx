"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) router.push("/dashboard"); // navigation works the same
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Login
      </button>
    </form>
  );
}
