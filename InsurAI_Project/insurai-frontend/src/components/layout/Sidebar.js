import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r p-4">
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard"><a className="block p-2 rounded hover:bg-gray-100">Dashboard</a></Link>
        <Link href="/dashboard/appointments"><a className="block p-2 rounded hover:bg-gray-100">Appointments</a></Link>
        <Link href="/dashboard/agents"><a className="block p-2 rounded hover:bg-gray-100">Agents</a></Link>
        <Link href="/dashboard/plans"><a className="block p-2 rounded hover:bg-gray-100">Plans</a></Link>
        <Link href="/admin"><a className="block p-2 mt-4 text-sm text-red-600">Admin</a></Link>
      </nav>
    </aside>
  );
}
