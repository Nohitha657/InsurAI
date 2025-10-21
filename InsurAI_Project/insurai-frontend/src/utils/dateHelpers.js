// src/utils/dateHelper.js
export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString();
}

export function toISODate(dateStr, timeStr = "00:00") {
  // dateStr: "2025-10-20", timeStr: "14:30"
  if (!dateStr) return null;
  return new Date(dateStr + "T" + (timeStr || "00:00")).toISOString();
}

export function addMinutes(isoDatetime, minutes) {
  const d = new Date(isoDatetime);
  d.setMinutes(d.getMinutes() + Number(minutes));
  return d.toISOString();
}
