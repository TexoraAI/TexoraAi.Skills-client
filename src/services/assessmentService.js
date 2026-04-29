
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

export const getTrainerAssignments = () => API.get("/assignments/trainer");

export const updateAssignment = (id, assignment) =>
  API.put(`/assignments/${id}`, assignment);

export const deleteAssignment = (id) => API.delete(`/assignments/${id}`);

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

export const getStudentAssignments = () => API.get("/assignments/student");

export const getMySubmissions = () => API.get("/submissions/my");

export const evaluateSubmission = (submissionId, marks) =>
  API.put(`/submissions/evaluate/${submissionId}?marks=${marks}`);

/* ========================================================= */
/* 🔥 DOWNLOAD ASSIGNMENT FILE (FIXED) */
/* ========================================================= */

export const downloadAssignmentFileBlob = async (fileId) => {
  const res = await API.get(`/assignment-files/download/${fileId}`, {
    responseType: "blob",
  });

  return res.data;
};

// ========= 🖥️  PHASE 1 — CODE EXECUTION (FREE RUN) ======= */
/* ========================================================= */

/**
 * Run any code freely (no problem attached).
 * POST /v1/code/run
 * Body: { batchId, language, code }
 * Returns: CodeExecutionResponse
 */
// export const runCode = (batchId, language, code) =>
//   API.post("/v1/code/run", { batchId, language, code });

// To this:
export const runCode = (batchId, language, code, sampleInput = "") =>
  API.post("/v1/code/run", { batchId, language, code, sampleInput });
/**
 * Student: get own submission history for a batch.
 * GET /v1/code/submissions/student?batchId=...
 */
export const getMyCodeSubmissions = (batchId) =>
  API.get("/v1/code/submissions/student", { params: { batchId } });

/**
 * Trainer: get ALL student submissions for a batch.
 * GET /v1/code/submissions/batch/:batchId
 */
export const getBatchCodeSubmissions = (batchId) =>
  API.get(`/v1/code/submissions/batch/${batchId}`);

/* ========================================================= */
/* ========= 🧩  PHASE 2 — PROBLEM MANAGEMENT (TRAINER) ==== */
/* ========================================================= */

/**
 * Trainer: create a new coding problem with test cases.
 * POST /v1/problems
 * Body: CodingProblemRequest
 */
export const createCodingProblem = (problemData) =>
  API.post("/v1/problems", problemData);

/**
 * Trainer: update an existing problem.
 * PUT /v1/problems/:problemId
 */
export const updateCodingProblem = (problemId, problemData) =>
  API.put(`/v1/problems/${problemId}`, problemData);

/**
 * Trainer: soft-delete a problem.
 * DELETE /v1/problems/:problemId
 */
export const deleteCodingProblem = (problemId) =>
  API.delete(`/v1/problems/${problemId}`);

/**
 * Trainer: get all problems created by them.
 * GET /v1/problems/my
 */
export const getMyProblems = () => API.get("/v1/problems/my");

/**
 * Trainer: get full problem details including all test cases.
 * GET /v1/problems/:problemId
 */
export const getProblemById = (problemId) =>
  API.get(`/v1/problems/${problemId}`);

/**
 * Trainer: add a test case to an existing problem.
 * POST /v1/problems/:problemId/testcases
 */
export const addTestCase = (problemId, testCaseData) =>
  API.post(`/v1/problems/${problemId}/testcases`, testCaseData);

/**
 * Trainer: get all test cases for a problem.
 * GET /v1/problems/:problemId/testcases
 */
export const getTestCases = (problemId) =>
  API.get(`/v1/problems/${problemId}/testcases`);

/* ========================================================= */
/* ========= 🎯  PHASE 2 — PROBLEM ASSIGNMENTS ============= */
/* ========================================================= */

/**
 * Trainer: assign a problem to a batch.
 * POST /v1/assignments
 * Body: { problemId, batchId, dueDate? }
 */
export const assignProblemToBatch = (assignmentData) =>
  API.post("/v1/assignments", assignmentData);

/**
 * Trainer: remove a problem assignment from a batch.
 * DELETE /v1/assignments/:assignmentId
 */
export const unassignProblem = (assignmentId) =>
  API.delete(`/v1/assignments/${assignmentId}`);

/**
 * Trainer: see all assigned problems for a batch.
 * GET /v1/assignments/batch/:batchId
 */
export const getAssignmentsByBatchForTrainer = (batchId) =>
  API.get(`/v1/assignments/batch/${batchId}`);

/**
 * Student: get all active coding problems for their batch.
 * GET /v1/assignments/student/problems?batchId=...
 */
export const getStudentProblems = (batchId) =>
  API.get("/v1/assignments/student/problems", { params: { batchId } });

/**
 * Student: open a specific problem (hidden test cases masked).
 * GET /v1/assignments/student/problems/:problemId
 */
export const getStudentProblemById = (problemId) =>
  API.get(`/v1/assignments/student/problems/${problemId}`);

/**
 * Student: submit code against a problem — judge runs all test cases.
 * POST /v1/assignments/student/problems/:problemId/submit?batchId=...&language=...
 * Body: raw code string (text/plain)
 */
export const submitCodeForJudge = (problemId, batchId, language, code) =>
  API.post(`/v1/assignments/student/problems/${problemId}/submit`, code, {
    params: { batchId, language },
    headers: { "Content-Type": "text/plain" },
  });

export const getMySQLState = () => API.get(`/v1/code/mysql/state`);

export const resetMySQLDatabase = () => API.delete(`/v1/code/mysql/reset`);

/* ========================================================= */
/* ========= 📁 CODE FILE MANAGEMENT ======================= */
/* ========================================================= */

/**
 * Save or overwrite a code file
 * POST /v1/code-files
 */
export const saveCodeFile = (data) => API.post("/v1/code-files", data);

/**
 * Get all files of logged-in student (by batch)
 * GET /v1/code-files/my?batchId=...
 */
export const getMyCodeFiles = (batchId) =>
  API.get("/v1/code-files/my", {
    params: { batchId },
  });

/**
 * Get single file by ID
 * GET /v1/code-files/:id
 */
export const getCodeFileById = (id) => API.get(`/v1/code-files/${id}`);

/**
 * Update file (rename or change code)
 * PUT /v1/code-files/:id
 */
export const updateCodeFile = (id, data) =>
  API.put(`/v1/code-files/${id}`, data);

/**
 * Delete file
 * DELETE /v1/code-files/:id
 */
export const deleteCodeFile = (id) => API.delete(`/v1/code-files/${id}`);

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
  uploadBulkQuiz, // ✅ FIXED (THIS WAS MISSING)
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
  downloadAssignmentFileBlob,

  // Phase 1 — Free Code Execution
  runCode,
  getMyCodeSubmissions,
  getBatchCodeSubmissions,

  // Phase 2 — Problem Management
  createCodingProblem,
  updateCodingProblem,
  deleteCodingProblem,
  getMyProblems,
  getProblemById,
  addTestCase,
  getTestCases,

  // Phase 2 — Problem Assignments
  assignProblemToBatch,
  unassignProblem,
  getAssignmentsByBatchForTrainer,
  getStudentProblems,
  getStudentProblemById,
  submitCodeForJudge,
  getMySQLState,
  resetMySQLDatabase,
  saveCodeFile,
  getMyCodeFiles,
  getCodeFileById,
  updateCodeFile,
  deleteCodeFile,
};
