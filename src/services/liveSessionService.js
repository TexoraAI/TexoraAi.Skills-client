import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ================= AUTH HEADER =================
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token"); // ✅ FIXED

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ================= LIVE SESSIONS =================

// Create live session
export const createLiveSession = async (data) => {
  return axios.post(`${API_BASE}/live-sessions`, data, getAuthHeader());
};

// Start live session (trainer)
export const startLiveSession = async (sessionId) => {
  return axios.post(
    `${API_BASE}/live-sessions/${sessionId}/start-live`,
    {},
    getAuthHeader(),
  );
};

// End session
export const endLiveSession = async (sessionId) => {
  return axios.post(
    `${API_BASE}/live-sessions/${sessionId}/end`,
    {},
    getAuthHeader(),
  );
};

// Get sessions for batch
export const getBatchSessions = async (batchId) => {
  return axios.get(
    `${API_BASE}/live-sessions/batch/${batchId}`,
    getAuthHeader(),
  );
};

export const getLiveSessionsByBatch = (batchId) => {
  return axios.get(
    `${API_BASE}/live-sessions/batch/${batchId}/live`,
    getAuthHeader(),
  );
};

// ================= JOIN SESSION =================

// Student joins session (gets LiveKit token)
export const joinLiveSession = async (sessionId, studentId) => {
  return axios.get(
    `${API_BASE}/live-sessions/${sessionId}/join?studentId=${studentId}`,
    getAuthHeader(),
  );
};

// ================= ATTENDANCE =================

export const joinAttendance = async (sessionId, studentId) => {
  return axios.post(
    `${API_BASE}/attendance/join`,
    {
      sessionId,
      studentId,
    },
    getAuthHeader(),
  );
};

export const leaveAttendance = async (participantId) => {
  return axios.post(
    `${API_BASE}/attendance/leave`,
    {
      participantId,
    },
    getAuthHeader(),
  );
};

// ================= RECORDINGS =================

export const getBatchRecordings = async (batchId) => {
  return axios.get(`${API_BASE}/recordings/batch/${batchId}`, getAuthHeader());
};

export const uploadRecording = async (formData) => {
  return axios.post(`${API_BASE}/recordings/upload`, formData, {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });
};
