import axios from "axios";

const API = axios.create({
  baseURL:  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api/chat",
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
  API.get(`/trainer/students?batchId=${batchId}`);

/* =====================================================
   STUDENT → GET TRAINER
   GET /api/chat/student/trainer?batchId=
   ===================================================== */
export const getStudentTrainer = (batchId) =>
  API.get(`/student/trainer?batchId=${batchId}`);

/* =====================================================
   GET CONVERSATION
   GET /api/chat/conversation?batchId=&otherUser=
   ===================================================== */
export const getConversation = (batchId, otherUser) =>
  API.get(
    `/conversation?batchId=${batchId}&otherUser=${encodeURIComponent(otherUser)}`,
  );

/* =====================================================
   SEND MESSAGE
   POST /api/chat/send
   ===================================================== */
export const sendMessage = (data) => API.post("/send", data);

/* =====================================================
   STUDENT → GET CHAT CONTEXT (batch + trainer)
   GET /api/chat/student/context
   ===================================================== */
export const getStudentContext = () => API.get("/student/context");
