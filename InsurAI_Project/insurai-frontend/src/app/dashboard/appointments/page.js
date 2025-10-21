import React, { useState } from "react";
import CalendarView from "../../components/appointments/CalendarView";
import AppointmentForm from "../../components/appointments/AppointmentForm";

export default function AppointmentsPage() {
  const [slot, setSlot] = useState(null);
  const [showForm,setShowForm] = useState(false);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Appointments</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <CalendarView onSelectSlot={(s) => { setSlot(s); setShowForm(true); }} />
        </div>
        <div>
          {showForm ? (
            <AppointmentForm initial={{
              date: slot?.start ? new Date(slot.start).toISOString().slice(0,10) : "",
              startTime: slot?.start ? new Date(slot.start).toTimeString().slice(0,5) : ""
            }} onDone={() => window.location.reload()} />
          ) : (
            <div className="bg-white p-4 rounded shadow">Select a slot on the calendar to book.</div>
          )}
        </div>
      </div>
    </div>
  );
}
