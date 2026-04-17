
// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// API.interceptors.request.use((config) => {
//   const token =
//     localStorage.getItem("lms_token") ||
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     localStorage.getItem("jwt");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// /* ================= QUIZ ================= */
// export const createQuiz = (quiz) => API.post("/quizzes", quiz);
// export const getQuizById = (id) => API.get(`/quizzes/${id}`);
// export const getAllQuizzes = () => API.get("/quizzes");
// export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);

// export const getTrainerQuizzes = () => API.get("/quizzes/trainer");

// // student → only quizzes assigned to his trainer/batch
// export const getStudentQuizzes = () => API.get("/quizzes/student");

// // /* ================= QUESTION ================= */
// // export const addQuestion = ({ quizId, text, marks }) =>
// //   API.post("/questions", {
// //     quizId,
// //     questionText: text, // ✅ backend expected
// //     marks,
// //   });

// // /* ================= OPTION ================= */
// // export const addOption = ({ questionId, text, correct }) =>
// //   API.post("/options", {
// //     questionId,
// //     optionText: text, // ✅ backend expected
// //     isCorrect: correct, // ✅ backend expected
// //   });

// /* ================= QUESTION ================= */
// export const addQuestion = ({ quizId, text }) =>
//   API.post("/questions", {
//     quizId,
//     text, // ✅ matches DTO field "text"
//   });

// /* ================= OPTION ================= */
// export const addOption = ({ questionId, text, correct }) =>
//   API.post("/options", {
//     questionId,
//     text, // ✅ matches DTO field "text"
//     correct, // ✅ matches DTO field "correct"
//   });

// /* ================= ATTEMPT ================= */
// export const submitQuizAttempt = (attempt) =>
//   API.post("/attempts/submit", attempt);

// export const getAttemptById = (id) => API.get(`/attempts/${id}`);
// export const hasAttempted = (quizId) =>
//   API.get(`/attempts/has-attempted/${quizId}`);
// export const getMyQuizHistory = () => API.get("/attempts/my");

// /* ========================================================= */
// /* ================= ASSIGNMENT ============================ */
// /* ========================================================= */

// // 🔵 Create Assignment
// export const createAssignment = (assignment) =>
//   API.post("/assignments", assignment);

// // 🔵 Get Assignments By Batch
// export const getAssignmentsByBatch = (batchId) =>
//   API.get(`/assignments/batch/${batchId}`);

// // 🔵 Get Trainer Assignments  ✅ ADDED
// export const getTrainerAssignments = () => API.get("/assignments/trainer");

// // 🔵 Update Assignment  ✅ ADDED
// export const updateAssignment = (id, assignment) =>
//   API.put(`/assignments/${id}`, assignment);

// // 🔵 Delete Assignment  ✅ ADDED
// export const deleteAssignment = (id) => API.delete(`/assignments/${id}`);

// // 🔵 Upload Assignment File (Trainer)
// export const uploadAssignmentFile = (assignmentId, file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   return API.post(`/assignment-files/${assignmentId}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

// export const downloadAssignmentFileBlob = (downloadUrl) => {
//   const token =
//     localStorage.getItem("lms_token") ||
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     localStorage.getItem("jwt");

//   return axios.get(downloadUrl, {
//     responseType: "blob",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// // 🔵 Get Assignment Files
// export const getAssignmentFiles = (assignmentId) =>
//   API.get(`/assignment-files/${assignmentId}`);

// export const getStudentAssignments = () => API.get("/assignments/student");

// // 🔵 Student Submit Assignment
// export const submitAssignment = (assignmentId, file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   return API.post(`/submissions/${assignmentId}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

// // 🔵 Trainer Get Submissions
// export const getSubmissionsByAssignment = (assignmentId) =>
//   API.get(`/submissions/${assignmentId}`);

// // 🔵 Student get his submissions (marks)
// export const getMySubmissions = () => API.get("/submissions/my");

// export const evaluateSubmission = (submissionId, marks) => {
//   return API.put(`/submissions/evaluate/${submissionId}?marks=${marks}`);
// };

// export default {
//   createQuiz,
//   getQuizById,
//   getAllQuizzes,
//   deleteQuiz,
//   addQuestion,
//   addOption,
//   submitQuizAttempt,
//   getAttemptById,
//   hasAttempted,
//   getMyQuizHistory,
//   getTrainerQuizzes,
//   getStudentQuizzes,
//   createAssignment,
//   getAssignmentsByBatch,
//   evaluateSubmission,
//   getTrainerAssignments, // ✅ added
//   updateAssignment, // ✅ added
//   deleteAssignment, // ✅ added
//   uploadAssignmentFile,
//   getMySubmissions,

//   getAssignmentFiles,
//   submitAssignment,
//   getSubmissionsByAssignment,
//   getStudentAssignments,
// };




















import axios from "axios";

/* ================= API SETUP ================= */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH INTERCEPTOR ================= */
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("lms_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ========================================================= */
/* ======================= QUIZ ============================= */
/* ========================================================= */

export const createQuiz = (quiz) => API.post("/quizzes", quiz);

export const getQuizById = (id) => API.get(`/quizzes/${id}`);

export const getAllQuizzes = () => API.get("/quizzes");

export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);

export const getTrainerQuizzes = () => API.get("/quizzes/trainer");

export const getStudentQuizzes = () => API.get("/quizzes/student");

/* ================= QUESTION ================= */

export const addQuestion = ({ quizId, text }) =>
  API.post("/questions", {
    quizId,
    text,
  });

/* ================= OPTION ================= */

export const addOption = ({ questionId, text, correct }) =>
  API.post("/options", {
    questionId,
    text,
    correct,
  });

/* ========================================================= */
/* 🔥 NEW: BULK QUIZ UPLOAD (IMPORTANT) */
/* ========================================================= */

export const uploadBulkQuiz = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/quizzes/upload-bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* ========================================================= */
/* ===================== ATTEMPTS =========================== */
/* ========================================================= */

export const submitQuizAttempt = (attempt) =>
  API.post("/attempts/submit", attempt);

export const getAttemptById = (id) => API.get(`/attempts/${id}`);

export const hasAttempted = (quizId) =>
  API.get(`/attempts/has-attempted/${quizId}`);

export const getMyQuizHistory = () => API.get("/attempts/my");

/* ========================================================= */
/* ===================== ASSIGNMENTS ======================== */
/* ========================================================= */

export const createAssignment = (assignment) =>
  API.post("/assignments", assignment);

export const getAssignmentsByBatch = (batchId) =>
  API.get(`/assignments/batch/${batchId}`);

export const getTrainerAssignments = () =>
  API.get("/assignments/trainer");

export const updateAssignment = (id, assignment) =>
  API.put(`/assignments/${id}`, assignment);

export const deleteAssignment = (id) =>
  API.delete(`/assignments/${id}`);

export const uploadAssignmentFile = (assignmentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(`/assignment-files/${assignmentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAssignmentFiles = (assignmentId) =>
  API.get(`/assignment-files/${assignmentId}`);

export const submitAssignment = (assignmentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(`/submissions/${assignmentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSubmissionsByAssignment = (assignmentId) =>
  API.get(`/submissions/${assignmentId}`);

export const getStudentAssignments = () =>
  API.get("/assignments/student");

export const getMySubmissions = () =>
  API.get("/submissions/my");

export const evaluateSubmission = (submissionId, marks) =>
  API.put(`/submissions/evaluate/${submissionId}?marks=${marks}`);

/* ========================================================= */
/* 🔥 DEFAULT EXPORT (FIXED) */
/* ========================================================= */

export default {
  createQuiz,
  getQuizById,
  getAllQuizzes,
  deleteQuiz,
  addQuestion,
  addOption,
  uploadBulkQuiz,   // ✅ FIXED (THIS WAS MISSING)
  submitQuizAttempt,
  getAttemptById,
  hasAttempted,
  getMyQuizHistory,
  getTrainerQuizzes,
  getStudentQuizzes,
  createAssignment,
  getAssignmentsByBatch,
  getTrainerAssignments,
  updateAssignment,
  deleteAssignment,
  uploadAssignmentFile,
  getAssignmentFiles,
  submitAssignment,
  getSubmissionsByAssignment,
  getStudentAssignments,
  getMySubmissions,
  evaluateSubmission,
};