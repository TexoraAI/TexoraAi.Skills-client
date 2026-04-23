import axios from "axios";

const API = axios.create({
  baseURL:  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api",
});

// attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("lms_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/* =====================================================
   TRAINER → GET STUDENTS IN A BATCH
   GET /api/chat/trainer/students?batchId=
   ===================================================== */
export const getTrainerStudents = (batchId) =>
  API.get(`/chat/trainer/students?batchId=${batchId}`);

/* =====================================================
   STUDENT → GET TRAINER
   GET /api/chat/student/trainer?batchId=
   ===================================================== */
export const getStudentTrainer = (batchId) =>
  API.get(`/chat/student/trainer?batchId=${batchId}`);

/* =====================================================
   GET CONVERSATION
   GET /api/chat/conversation?batchId=&otherUser=
   ===================================================== */
export const getConversation = (batchId, otherUser) =>
  API.get(
    `/chat/conversation?batchId=${batchId}&otherUser=${encodeURIComponent(otherUser)}`,
  );

/* =====================================================
   SEND MESSAGE
   POST /api/chat/send
   ===================================================== */
export const sendMessage = (data) => API.post("/chat/send", data);

/* =====================================================
   STUDENT → GET CHAT CONTEXT (batch + trainer)
   GET /api/chat/student/context
   ===================================================== */

export const getStudentContext = () => API.get("/chat/student/context");

// ── Feedback — Student ─────────────────────────────────────────────────────

/**
 * POST /api/feedback/submit
 * Frontend sends: { batchId, trainerEmail, moodRating, anonymous,
 *   trainerClarityRating, trainerDoubtClearingRating,
 *   trainerEnergyRating, trainerTechnicalDepthRating,
 *   contentTags, improvementTags, comment }
 * studentEmail is injected by the backend from JWT.
 */

/**
 * ✅ NEW: GET /api/feedback/check/{batchId}
 * Check if student already submitted feedback for a batch
 */
export const checkFeedbackStatus = (batchId) =>
  API.get(`/feedback/check/${batchId}`);

export const submitFeedback = (payload) =>
  API.post("/feedback/submit", payload);

/** GET /api/feedback/student/my */
export const getMyFeedback = () => API.get("/feedback/student/my");

/** GET /api/feedback/student/my/batch/{batchId} */
export const getMyFeedbackByBatch = (batchId) =>
  API.get(`/feedback/student/my/batch/${batchId}`);

// ── Feedback — Trainer ─────────────────────────────────────────────────────

/** GET /api/feedback/trainer/my */
export const getMyTrainerFeedback = () => API.get("/feedback/trainer/my");

/** GET /api/feedback/trainer/my/batch/{batchId} */
export const getMyTrainerFeedbackByBatch = (batchId) =>
  API.get(`/feedback/trainer/my/batch/${batchId}`);

/** GET /api/feedback/trainer/my/batch/{batchId}/summary */
export const getMyTrainerSummary = (batchId) =>
  API.get(`/feedback/trainer/my/batch/${batchId}/summary`);

// ── Feedback — Admin ───────────────────────────────────────────────────────

/** GET /api/feedback/admin/batch/{batchId} */
export const getBatchFeedback = (batchId) =>
  API.get(`/feedback/admin/batch/${batchId}`);

/** GET /api/feedback/admin/batch/{batchId}/summaries */
export const getBatchSummaries = (batchId) =>
  API.get(`/feedback/admin/batch/${batchId}/summaries`);

/**
 * PATCH /api/feedback/admin/{feedbackId}/status
 * Body: { status: "REVIEWED" | "ARCHIVED" }
 */
export const updateFeedbackStatus = (feedbackId, status) =>
  API.patch(`/feedback/admin/${feedbackId}/status`, { status });

// ── Alert Config — Admin ───────────────────────────────────────────────────

/** POST /api/feedback/alert-config */
export const createOrUpdateAlertConfig = (dto) =>
  API.post("/feedback/alert-config", dto);

/** GET /api/feedback/alert-config/{batchId} */
export const getAlertConfig = (batchId) =>
  API.get(`/feedback/alert-config/${batchId}`);

/** DELETE /api/feedback/alert-config/{batchId} */
export const deleteAlertConfig = (batchId) =>
  API.delete(`/feedback/alert-config/${batchId}`);
