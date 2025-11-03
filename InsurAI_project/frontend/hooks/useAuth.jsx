"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const login = async (email, password) => {
    setUser({ email });
    router.push("/dashboard");
  };
  return (
      {children}
  );
}


