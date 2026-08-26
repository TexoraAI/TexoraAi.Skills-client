import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── SCHEDULES CRUD ────────────────────────────────────────────
// Maps to: com.lms.live_session.controller.ScheduleController
// Base path: /api/schedules

/** POST /api/schedules */
export const createSchedule = (data) =>
  axios.post(`${API_BASE}/schedules`, data, getAuthHeader());

/**
 * GET /api/schedules?tab=Upcoming|Today|This Week|This Month
 * tab is optional — omit to get all schedules for the logged-in user.
 */
export const getMySchedules = (tab) =>
  axios.get(
    `${API_BASE}/schedules${tab ? `?tab=${encodeURIComponent(tab)}` : ""}`,
    getAuthHeader(),
  );

/** GET /api/schedules/{id} */
export const getScheduleById = (id) =>
  axios.get(`${API_BASE}/schedules/${id}`, getAuthHeader());

/** PUT /api/schedules/{id} */
export const updateSchedule = (id, data) =>
  axios.put(`${API_BASE}/schedules/${id}`, data, getAuthHeader());

/** DELETE /api/schedules/{id} */
export const deleteSchedule = (id) =>
  axios.delete(`${API_BASE}/schedules/${id}`, getAuthHeader());

/**
 * GET /api/schedules/calendar?month=yyyy-MM
 * Returns schedules grouped by date. month is optional.
 */
export const getSchedulesCalendar = (month) =>
  axios.get(
    `${API_BASE}/schedules/calendar${month ? `?month=${month}` : ""}`,
    getAuthHeader(),
  );
