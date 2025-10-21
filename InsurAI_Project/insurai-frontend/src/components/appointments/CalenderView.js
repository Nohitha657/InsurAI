import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import api from "../../utils/api";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarView({ onSelectSlot }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/api/appointments/user"); // or /api/appointments?userId=...
      const mapped = res.data.map(a => ({
        id: a.id,
        title: `${a.status} — ${a.planName || ""}`,
        start: new Date(a.startDatetime),
        end: new Date(a.endDatetime),
        resource: a
      }));
      setEvents(mapped);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={(slotInfo) => onSelectSlot && onSelectSlot(slotInfo)}
        onSelectEvent={(event) => console.log("selected event", event)}
      />
    </div>
  );
}
