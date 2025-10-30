import React from "react";
import { useAuth } from "../../hooks/useAuth";


export default function Footer() {
  // const { user, logout } = useAuth();
  return (
    <footer className="bg-blue-50 py-6 text-center text-sm text-muted-foreground">
        <p className="text-gray-500">© 2025 InsurePro. All rights reserved. Licensed and regulated insurance provider.</p>
    </footer>
  );
}