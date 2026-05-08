import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── LIVE SESSIONS CRUD ────────────────────────────────────────

export const createLiveSession = (data) =>
  axios.post(`${API_BASE}/live-sessions`, data, getAuthHeader());

/**
 * Start live → records actualStartTime on backend → returns { room, token }
 * Backend enforces canStart check — will return 400 if too early
 */
export const startLiveSessionWithToken = (sessionId) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/start-live`,
    {},
    getAuthHeader(),
  );

export const endLiveSession = (sessionId) =>
  axios.post(`${API_BASE}/live-sessions/${sessionId}/end`, {}, getAuthHeader());

export const deleteLiveSession = (sessionId) =>
  axios.delete(`${API_BASE}/live-sessions/${sessionId}`, getAuthHeader());

export const getBatchSessions = (batchId) =>
  axios.get(`${API_BASE}/live-sessions/batch/${batchId}`, getAuthHeader());

export const getLiveSessionsByBatch = (batchId) =>
  axios.get(`${API_BASE}/live-sessions/batch/${batchId}/live`, getAuthHeader());

export const getSessionById = (sessionId) =>
  axios.get(`${API_BASE}/live-sessions/${sessionId}`, getAuthHeader());

/**
 * GET /api/live-sessions/history
 * Returns ALL sessions for the logged-in trainer (from JWT)
 */
export const getSessionHistory = () =>
  axios.get(`${API_BASE}/live-sessions/history`, getAuthHeader());

/**
 * GET /api/live-sessions/{id}/can-start
 * Returns { canStart, scheduledAt, minutesUntilStart, reason, createdAt }
 * Used by frontend to decide whether to show "Go Live" button
 */
export const checkCanStart = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/can-start`,
    getAuthHeader(),
  );
// ADD to your existing liveSessionApi.js

// Resolve meeting link — returns { type: "EXTERNAL"|"CUSTOM", url }
export const getMeetingLink = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/meeting-link`,
    getAuthHeader(),
  );

// Trainer calendar — pass ISO date strings e.g. "2025-05-01"
export const getTrainerCalendar = (from, to) =>
  axios.get(
    `${API_BASE}/live-sessions/calendar?from=${from}&to=${to}`,
    getAuthHeader(),
  );

// Published sessions — no auth needed for public viewing
export const getPublishedSessions = () =>
  axios.get(`${API_BASE}/live-sessions/published`);
// ─── JOIN SESSION ──────────────────────────────────────────────

export const joinLiveSession = (sessionId, studentId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/join?studentId=${studentId}`,
    getAuthHeader(),
  );

export const joinLiveSessionPublic = (sessionId, bookingId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/join?studentId=${bookingId}`,
  );

// ─── CALLS ─────────────────────────────────────────────────────

export const startCall = (trainerEmail) =>
  axios.post(
    `${API_BASE}/live-sessions/call/start?trainerEmail=${trainerEmail}`,
    {},
    getAuthHeader(),
  );

export const joinCall = (room) =>
  axios.get(
    `${API_BASE}/live-sessions/call/join?room=${room}`,
    getAuthHeader(),
  );

// ─── PARTICIPANTS ──────────────────────────────────────────────

// export const participantJoin = (
//   sessionId,
//   batchId,
//   studentEmail,
//   trainerEmail,
// ) =>
//   axios.post(
//     `${API_BASE}/live-sessions/${sessionId}/participant/join?batchId=${batchId}&studentEmail=${encodeURIComponent(studentEmail)}&trainerEmail=${encodeURIComponent(trainerEmail)}`,
//     {},
//     getAuthHeader(),
//   );

// export const participantLeave = (sessionId, studentEmail) =>
//   axios.post(
//     `${API_BASE}/live-sessions/${sessionId}/participant/leave?studentEmail=${encodeURIComponent(studentEmail)}`,
//     {},
//     getAuthHeader(),
//   );

// export const getSessionParticipants = (sessionId) =>
//   axios.get(
//     `${API_BASE}/live-sessions/${sessionId}/participants`,
//     getAuthHeader(),
//   );
// studentEmail removed — backend gets it from JWT
export const participantJoin = (sessionId, batchId, trainerEmail) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/participant/join?batchId=${batchId}&trainerEmail=${encodeURIComponent(trainerEmail)}`,
    {},
    getAuthHeader(),
  );

// studentEmail removed — backend gets it from JWT
export const participantLeave = (sessionId) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/participant/leave`,
    {},
    getAuthHeader(),
  );

export const getSessionParticipants = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/participants`,
    getAuthHeader(),
  );
// ─── RECORDINGS ────────────────────────────────────────────────

export const uploadRecording = (formData) =>
  axios.post(`${API_BASE}/live-sessions/recording/upload`, formData, {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

export const getAllRecordings = () =>
  axios.get(`${API_BASE}/live-sessions/recording/all`, getAuthHeader());

export const getBatchRecordings = (batchId) =>
  axios.get(
    `${API_BASE}/live-sessions/recording/batch/${batchId}`,
    getAuthHeader(),
  );

export const getSessionRecordings = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/recording/session/${sessionId}`,
    getAuthHeader(),
  );

/** Uses JWT to identify trainer — no trainerId param needed */
export const getMyRecordings = () =>
  axios.get(`${API_BASE}/live-sessions/recording/trainer/my`, getAuthHeader());

export const getRecordingById = (id) =>
  axios.get(`${API_BASE}/live-sessions/recording/${id}`, getAuthHeader());

export const updateRecording = (id, data) =>
  axios.put(`${API_BASE}/live-sessions/recording/${id}`, data, getAuthHeader());

export const deleteRecording = (id) =>
  axios.delete(`${API_BASE}/live-sessions/recording/${id}`, getAuthHeader());

export const incrementRecordingViews = (id) =>
  axios.post(
    `${API_BASE}/live-sessions/recording/${id}/view`,
    {},
    getAuthHeader(),
  );

export const markRecordingReady = (id) =>
  axios.post(
    `${API_BASE}/live-sessions/recording/${id}/mark-ready`,
    {},
    getAuthHeader(),
  );

export const markRecordingFailed = (id) =>
  axios.post(
    `${API_BASE}/live-sessions/recording/${id}/mark-failed`,
    {},
    getAuthHeader(),
  );
