"use client";
import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password) => {
    // const res = await api.post("/api/auth/LoginForm", { email, password });
    setUser({ email });
    router.push("/dashboard");
  };

  // const logout = () => {
  //   setUser(null);
  //   router.push("/LoginForm");
  // };

  return (
    // <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    /* </AuthContext.Provider> */
  );
}

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }
