import axios from "axios";
import auth from "../auth"; // ✅ use existing auth.js

const BASE_URL = "http://localhost:9000/api";

// 🔐 Token only from auth (NO localStorage direct access)
const getAuthHeader = () => {
  const token = auth.isAuthenticated()
    ? localStorage.getItem("lms_token") // auth already manages this
    : null;

  if (!token) {
    console.error("❌ Trainer not logged in (token missing)");
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const attendanceService = {
  // ================= TRAINER =================
  markAttendance: (payload) => {
    return axios.post(`${BASE_URL}/trainer/attendance/mark`, payload, {
      headers: getAuthHeader(),
    });
  },

  // ================= STUDENT =================
  getMonthlyAttendance: (year, month) => {
    return axios.get(`${BASE_URL}/student/attendance/monthly`, {
      params: { year, month },
      headers: getAuthHeader(),
    });
  },
};

// ================= BATCH =================
getTrainerBatches: () => {
  return axios.get(`${BASE_URL}/batch/trainer`, {
    headers: getAuthHeader(),
  });
};

// ================= CHAT (students in batch) =================
getBatchStudentEmails: (batchId) => {
  return axios.get(`${BASE_URL}/chat/trainer/students?batchId=${batchId}`, {
    headers: getAuthHeader(),
  });
};

export default attendanceService;
