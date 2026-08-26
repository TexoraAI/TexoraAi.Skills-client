import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── EVENTS CRUD ───────────────────────────────────────────────
// Maps to: com.lms.live_session.controller.EventController
// Base path: /api/events

/** POST /api/events */
export const createEvent = (data) =>
  axios.post(`${API_BASE}/events`, data, getAuthHeader());

/** GET /api/events — all events for logged-in user (from JWT) */
export const getMyEvents = () =>
  axios.get(`${API_BASE}/events`, getAuthHeader());

/** GET /api/events/{id} */
export const getEventById = (id) =>
  axios.get(`${API_BASE}/events/${id}`, getAuthHeader());

/** PUT /api/events/{id} */
export const updateEvent = (id, data) =>
  axios.put(`${API_BASE}/events/${id}`, data, getAuthHeader());

/** DELETE /api/events/{id} */
export const deleteEvent = (id) =>
  axios.delete(`${API_BASE}/events/${id}`, getAuthHeader());

/**
 * GET /api/events/calendar?month=yyyy-MM
 * Returns events grouped by date. month is optional — omit for current month.
 */
export const getEventsCalendar = (month) =>
  axios.get(
    `${API_BASE}/events/calendar${month ? `?month=${month}` : ""}`,
    getAuthHeader(),
  );

/** PUT /api/events/{id}/restore */
export const restoreEvent = (id) =>
  axios.put(`${API_BASE}/events/${id}/restore`, {}, getAuthHeader());
