// export default attendanceService;
import axios from "axios";
import auth from "../auth"; // ✅ use existing auth.js

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

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
  // ================= TRAINER (existing) =================
  markAttendance: (payload) => {
    return axios.post(`${BASE_URL}/trainer/attendance/mark`, payload, {
      headers: getAuthHeader(),
    });
  },

  // ================= STUDENT (existing) =================
  getMonthlyAttendance: (year, month) => {
    return axios.get(`${BASE_URL}/student/attendance/monthly`, {
      params: { year, month },
      headers: getAuthHeader(),
    });
  },

  // ================= BATCH (existing — moved inside the object literal, was previously outside it and unreachable) =================
  getTrainerBatches: () => {
    return axios.get(`${BASE_URL}/batch/trainer`, {
      headers: getAuthHeader(),
    });
  },

  // ================= CHAT / students in batch (existing — same fix as above) =================
  getBatchStudentEmails: (batchId) => {
    return axios.get(`${BASE_URL}/chat/trainer/students?batchId=${batchId}`, {
      headers: getAuthHeader(),
    });
  },

  // ================= TRAINER — OWN SESSION ATTENDANCE (NEW) =================
  markOwnSession: ({ batchId, date, status }) => {
    return axios.post(
      `${BASE_URL}/trainer/attendance/session/mark`,
      { batchId, date, status },
      { headers: getAuthHeader() },
    );
  },

  getOwnSessionHistory: (year, month) => {
    return axios.get(`${BASE_URL}/trainer/attendance/session/history`, {
      params: { year, month },
      headers: getAuthHeader(),
    });
  },

  // ================= ADMIN (NEW) =================
  getAdminAttendanceOverview: () => {
    return axios.get(`${BASE_URL}/trainer/attendance/admin/overview`, {
      headers: getAuthHeader(),
    });
  },

  // getAdminBatchAttendance: (batchId) => {
  //   return axios.get(`${BASE_URL}/trainer/attendance/admin/batch/${batchId}`, {
  //     headers: getAuthHeader(),
  //   });
  // },
  // AFTER
  getAdminBatchAttendance: (batchId, filters = {}) => {
    const { filterType, startDate, endDate } = filters;
    return axios.get(`${BASE_URL}/trainer/attendance/admin/batch/${batchId}`, {
      params: { filterType, startDate, endDate },
      headers: getAuthHeader(),
    });
  },

  // ================= SUPER ADMIN (NEW) =================
  getSuperAdminAttendanceOverview: () => {
    return axios.get(`${BASE_URL}/trainer/attendance/superadmin/overview`, {
      headers: getAuthHeader(),
    });
  },

  // getSuperAdminBatchAttendance: (batchId) => {
  //   return axios.get(
  //     `${BASE_URL}/trainer/attendance/superadmin/batch/${batchId}`,
  //     { headers: getAuthHeader() },
  //   );
  // },
  // AFTER
  getSuperAdminBatchAttendance: (batchId, filters = {}) => {
    const { filterType, startDate, endDate } = filters;
    return axios.get(
      `${BASE_URL}/trainer/attendance/superadmin/batch/${batchId}`,
      {
        params: { filterType, startDate, endDate },
        headers: getAuthHeader(),
      },
    );
  },

  // ================= ADMIN — HISTORY / FILTERS / EXCEL (NEW) =================
  getAdminHistory: ({
    filterType,
    startDate,
    endDate,
    batchId,
    trainerEmail,
    studentEmail,
  }) => {
    return axios.get(`${BASE_URL}/trainer/attendance/admin/history`, {
      params: {
        filterType,
        startDate,
        endDate,
        batchId,
        trainerEmail,
        studentEmail,
      },
      headers: getAuthHeader(),
    });
  },

  downloadAdminReport: ({
    filterType,
    startDate,
    endDate,
    batchId,
    trainerEmail,
    studentEmail,
    type,
  }) => {
    return axios.get(`${BASE_URL}/trainer/attendance/admin/download`, {
      params: {
        filterType,
        startDate,
        endDate,
        batchId,
        trainerEmail,
        studentEmail,
        type,
      },
      headers: getAuthHeader(),
      responseType: "blob", // ✅ required for binary Excel file
    });
  },
  // ================= TRAINER — HISTORY / FILTERS / EXCEL (NEW) =================
  getTrainerHistory: ({ filterType, startDate, endDate, batchId }) => {
    return axios.get(`${BASE_URL}/trainer/attendance/history`, {
      params: { filterType, startDate, endDate, batchId },
      headers: getAuthHeader(),
    });
  },

  getTrainerSessionHistoryFiltered: ({
    filterType,
    startDate,
    endDate,
    batchId,
  }) => {
    return axios.get(`${BASE_URL}/trainer/attendance/session/history/filter`, {
      params: { filterType, startDate, endDate, batchId },
      headers: getAuthHeader(),
    });
  },

  downloadTrainerReport: ({
    filterType,
    startDate,
    endDate,
    batchId,
    type,
  }) => {
    return axios.get(`${BASE_URL}/trainer/attendance/download`, {
      params: { filterType, startDate, endDate, batchId, type },
      headers: getAuthHeader(),
      responseType: "blob",
    });
  },

  // ================= STUDENT — HISTORY / FILTERS / EXCEL (NEW) =================
  getStudentHistory: ({ filterType, startDate, endDate }) => {
    return axios.get(`${BASE_URL}/student/attendance/history`, {
      params: { filterType, startDate, endDate },
      headers: getAuthHeader(),
    });
  },

  downloadStudentReport: ({ filterType, startDate, endDate }) => {
    return axios.get(`${BASE_URL}/student/attendance/download`, {
      params: { filterType, startDate, endDate },
      headers: getAuthHeader(),
      responseType: "blob",
    });
  },
  // ================= SUPER ADMIN — HISTORY / FILTERS / EXCEL (NEW — was missing) =================
  getSuperAdminHistory: ({
    filterType,
    startDate,
    endDate,
    batchId,
    trainerEmail,
    studentEmail,
  }) => {
    return axios.get(`${BASE_URL}/trainer/attendance/superadmin/history`, {
      params: {
        filterType,
        startDate,
        endDate,
        batchId,
        trainerEmail,
        studentEmail,
      },
      headers: getAuthHeader(),
    });
  },

  downloadSuperAdminReport: ({
    filterType,
    startDate,
    endDate,
    batchId,
    trainerEmail,
    studentEmail,
    type,
  }) => {
    return axios.get(`${BASE_URL}/trainer/attendance/superadmin/download`, {
      params: {
        filterType,
        startDate,
        endDate,
        batchId,
        trainerEmail,
        studentEmail,
        type,
      },
      headers: getAuthHeader(),
      responseType: "blob", // ✅ required for binary Excel file
    });
  },

  // ================= FEATURE FLAGS (NEW) =================
  getOrgAttendanceFeatureFlags: (organizationId) => {
    return axios.get(
      `${BASE_URL}/attendance-feature-flags/org/${organizationId}`,
      { headers: getAuthHeader() },
    );
  },

  updateOrgAttendanceFeatureFlags: (organizationId, dto) => {
    return axios.put(
      `${BASE_URL}/attendance-feature-flags/org/${organizationId}`,
      dto,
      { headers: getAuthHeader() },
    );
  },

  getIndividualAttendanceFeatureFlags: (email) => {
    return axios.get(`${BASE_URL}/attendance-feature-flags/individual`, {
      params: { email },
      headers: getAuthHeader(),
    });
  },

  updateIndividualAttendanceFeatureFlags: (email, dto) => {
    return axios.put(`${BASE_URL}/attendance-feature-flags/individual`, dto, {
      params: { email },
      headers: getAuthHeader(),
    });
  },
};

export default attendanceService;
