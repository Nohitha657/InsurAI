"use client";
import { Calendar, Clock, Plus } from "lucide-react";

export default function AppointmentsPage() {
  // Example data: replace with your actual backend connection
  const appointments = [
    // {
    //   id: 1,
    //   title: "Policy Consultation",
    //   date: "2025-11-01",
    //   time: "10:00 AM",
    //   agent: "Amit Rao",
    //   status: "Scheduled",
    // },
    // {
    //   id: 2,
    //   title: "Renewal Discussion",
    //   date: "2025-11-03",
    //   time: "2:00 PM",
    //   agent: "Priya Sharma",
    //   status: "Scheduled",
    // },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center mb-7">
        <Calendar className="text-blue-500 w-8 h-8 mr-3" />
        <h1 className="text-2xl font-bold text-blue-700">Appointments</h1>
        <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium">
          <Plus className="w-5 h-5" /> New Appointment
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
        {appointments.length === 0 ? (
          <p className="text-blue-400">No appointments scheduled.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="px-3 py-2 text-left font-semibold">Title</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
                <th className="px-3 py-2 text-left font-semibold">Time</th>
                <th className="px-3 py-2 text-left font-semibold">Agent</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id} className="hover:bg-blue-50">
                  <td className="px-3 py-2 text-blue-400">{app.title}</td>
                  <td className="px-3 py-2 text-blue-400">{app.date}</td>
                  <td className="px-3 py-2 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-400" /> {app.time}
                  </td>
                  <td className="px-3 py-2 text-blue-400">{app.agent}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* You can add appointment form, calendar, and actions here in future */}
    </div>
  );
}
