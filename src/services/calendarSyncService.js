import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── GOOGLE CALENDAR SYNC ──────────────────────────────────────
// Maps to: com.lms.live_session.controller.CalendarSyncController
// Base path: /api/calendar-sync

/** GET /api/calendar-sync/auth-url — returns { authUrl } to redirect user to Google */
// export const getAuthorizationUrl = () =>
//   axios.get(`${API_BASE}/calendar-sync/auth-url`, getAuthHeader());
export const getAuthorizationUrl = (returnTo) =>
  axios.get(`${API_BASE}/calendar-sync/auth-url`, {
    ...getAuthHeader(),
    params: returnTo ? { returnTo } : undefined,
  });

/** GET /api/calendar-sync/callback?code=... — handled after Google redirects back */
export const handleOAuthCallback = (code) =>
  axios.get(
    `${API_BASE}/calendar-sync/callback?code=${encodeURIComponent(code)}`,
    getAuthHeader(),
  );

/** POST /api/calendar-sync/sync — manual "Sync Now" trigger */
export const syncNow = () =>
  axios.post(`${API_BASE}/calendar-sync/sync`, {}, getAuthHeader());

/** GET /api/calendar-sync/status — { connected, googleEmail, lastSyncAt, syncMessage } */
export const getSyncStatus = () =>
  axios.get(`${API_BASE}/calendar-sync/status`, getAuthHeader());

/** POST /api/calendar-sync/disconnect */
export const disconnectCalendar = () =>
  axios.post(`${API_BASE}/calendar-sync/disconnect`, {}, getAuthHeader());
