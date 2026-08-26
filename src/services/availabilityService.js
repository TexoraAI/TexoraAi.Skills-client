import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── AVAILABILITY SLOTS ────────────────────────────────────────
// Maps to: com.lms.live_session.controller.AvailabilityController
// Base path: /api/availability

/** POST /api/availability — body: { dayOfWeek, startTime, endTime, timezone, isRecurring } */
export const createAvailability = (data) =>
  axios.post(`${API_BASE}/availability`, data, getAuthHeader());

/** GET /api/availability — returns Map<dayOfWeek, AvailabilitySlot[]> for logged-in user */
export const getMyAvailability = () =>
  axios.get(`${API_BASE}/availability`, getAuthHeader());

/** GET /api/availability/{id} */
export const getSlotById = (id) =>
  axios.get(`${API_BASE}/availability/${id}`, getAuthHeader());

/** PUT /api/availability/{id} */
export const updateAvailability = (id, data) =>
  axios.put(`${API_BASE}/availability/${id}`, data, getAuthHeader());

/** DELETE /api/availability/{id} */
export const deleteAvailability = (id) =>
  axios.delete(`${API_BASE}/availability/${id}`, getAuthHeader());

/**
 * GET /api/availability/check?date=yyyy-MM-dd&startTime=HH:mm&endTime=HH:mm
 * Returns { available: true|false }
 */
export const checkAvailability = (date, startTime, endTime) =>
  axios.get(
    `${API_BASE}/availability/check?date=${date}&startTime=${startTime}&endTime=${endTime}`,
    getAuthHeader(),
  );
