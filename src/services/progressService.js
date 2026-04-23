import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

export const progressService = {
  // ✅ Called when student opens a video or PDF
  // Automatically creates progress record if not exists
  markContentComplete(email, courseId, contentId, totalContentCount) {
    return axios.post(`${API}/progress/mark-complete`, null, {
      params: { email, courseId, contentId, totalContentCount },
      headers: authHeader(),
    });
  },

  // ✅ Get progress for a specific student + course
  getProgress(email, courseId) {
    return axios.get(`${API}/progress/user`, {
      params: { email, courseId },
      headers: authHeader(),
    });
  },
  //vidoe progress endpoints

  // ✅ Called on VideoLectures page load
  // Returns 0% if student hasn't watched anything yet — no crash
  // GET /api/video-progress/user?email=x&batchId=54
  getVideoProgress(email, batchId) {
    return axios.get(`${API}/video-progress/user`, {
      params: { email, batchId },
      headers: authHeader(),
    });
  },

  // ✅ Called when student clicks "Mark as Watched" in VideoLectures
  // Uses batchId NOT courseId — videos belong to batch
  // POST /api/video-progress/mark-watched?email=x&batchId=54&videoId=35&totalVideoCount=5
  markVideoWatched(email, batchId, videoId, totalVideoCount) {
    return axios.post(`${API}/video-progress/mark-watched`, null, {
      params: { email, batchId, videoId, totalVideoCount },
      headers: authHeader(),
    });
  },

  // ============================
  // FILE PROGRESS
  // Used by: Documents.jsx
  // Tracks: Files/documents that belong to a batch
  // Key fields: downloadedFileIds, downloadPercentage, batchId
  // ============================

  // ✅ Called on Documents page load
  // Returns 0% if student hasn't previewed anything yet — no crash
  // GET /api/file-progress/user?email=x&batchId=54
  getFileProgress(email, batchId) {
    return axios.get(`${API}/file-progress/user`, {
      params: { email, batchId },
      headers: authHeader(),
    });
  },

  // ✅ Called when student clicks Preview button in Documents
  // POST /api/file-progress/mark-downloaded?email=x&batchId=54&fileId=12&totalFileCount=5
  markFileDownloaded(email, batchId, fileId, totalFileCount) {
    return axios.post(`${API}/file-progress/mark-downloaded`, null, {
      params: { email, batchId, fileId, totalFileCount },
      headers: authHeader(),
    });
  },

  // ============================
  // ASSIGNMENT PROGRESS
  // Used by: Assignments.jsx
  // ============================

  getAssignmentProgress(email, batchId) {
    return axios.get(`${API}/assignment-progress/user`, {
      params: { email, batchId },
      headers: authHeader(),
    });
  },

  markAssignmentComplete(email, batchId, assignmentId, totalAssignments) {
    return axios.post(`${API}/assignment-progress/mark-complete`, null, {
      params: {
        email,
        batchId,
        assignmentId,
        totalAssignments, // ✅ was "totalAssignmentCount" before — backend needs "totalAssignments"
      },
      headers: authHeader(),
    });
  },

  getQuizProgress(email, batchId) {
    return axios.get(`${API}/quiz-progress/user`, {
      params: { email, batchId },
      headers: authHeader(),
    });
  },

  markQuizAttempted(email, batchId, quizId, totalQuizzes) {
    return axios.post(`${API}/quiz-progress/mark-attempted`, null, {
      params: { email, batchId, quizId, totalQuizzes }, // ✅ FIXED
      headers: authHeader(),
    });
  },

  // ✅ Get progress by ID
  getById(id) {
    return axios.get(`${API}/progress/${id}`, {
      headers: authHeader(),
    });
  },

  // REPORT ENDPOINTS

  getBatchProgressReport(batchId) {
    return axios.get(`${API}/progress/reports/batch/${batchId}`, {
      headers: authHeader(),
    });
  },

  getStudentProgressInBatch(batchId, studentEmail) {
    return axios.get(
      `${API}/progress/reports/batch/${batchId}/student/${encodeURIComponent(studentEmail)}`,
      { headers: authHeader() },
    );
  },

  getTrainerProgressReport(trainerEmail) {
    return axios.get(
      `${API}/progress/reports/trainer/${encodeURIComponent(trainerEmail)}`,
      { headers: authHeader() },
    );
  },
};
