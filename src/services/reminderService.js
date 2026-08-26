import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── REMINDERS CRUD ────────────────────────────────────────────
// Maps to: com.lms.live_session.controller.ReminderController
// Base path: /api/reminders

/** POST /api/reminders — body: { eventId?, scheduleId?, reminderTime } */
export const createReminder = (data) =>
  axios.post(`${API_BASE}/reminders`, data, getAuthHeader());

/** GET /api/reminders — all reminders for logged-in user */
export const getMyReminders = () =>
  axios.get(`${API_BASE}/reminders`, getAuthHeader());

/** GET /api/reminders/{id} */
export const getReminderById = (id) =>
  axios.get(`${API_BASE}/reminders/${id}`, getAuthHeader());

/** PUT /api/reminders/{id} */
export const updateReminder = (id, data) =>
  axios.put(`${API_BASE}/reminders/${id}`, data, getAuthHeader());

/** DELETE /api/reminders/{id} */
export const deleteReminder = (id) =>
  axios.delete(`${API_BASE}/reminders/${id}`, getAuthHeader());

/** POST /api/reminders/{id}/dismiss */
export const dismissReminder = (id) =>
  axios.post(`${API_BASE}/reminders/${id}/dismiss`, {}, getAuthHeader());
