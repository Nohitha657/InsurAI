import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && !user) router.push("/login");
  }, [loadingUser, user]);

  if (loadingUser || !user) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold">Welcome, {user.fullName || user.email}</h1>
      {/* Add quick cards, upcoming appointments etc. */}
    </div>
  );
}
