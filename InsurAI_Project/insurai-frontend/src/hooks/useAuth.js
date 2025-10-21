import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" && localStorage.getItem("token");
    if (token) {
      // fetch profile
      api.get("/api/users/me")
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, []);

  async function login(email, password) {
    const res = await api.post("/api/auth/login", { email, password });
    const token = res.data.accessToken || res.data.token;
    localStorage.setItem("token", token);
    // set header is handled by interceptor
    const profile = (await api.get("/api/users/me")).data;
    setUser(profile);
    return profile;
  }

  async function register(payload) {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loadingUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
