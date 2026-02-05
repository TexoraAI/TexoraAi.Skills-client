import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

/* ================= QUIZ ================= */
export const createQuiz = (quiz) => API.post("/quizzes", quiz);
export const getQuizById = (id) => API.get(`/quizzes/${id}`);
export const getAllQuizzes = () => API.get("/quizzes");
export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);

/* ================= QUESTION ================= */
export const addQuestion = ({ quizId, text, marks }) =>
  API.post("/questions", {
    quizId,
    questionText: text,   // ✅ backend expected
    marks,
  });

/* ================= OPTION ================= */
export const addOption = ({ questionId, text, correct }) =>
  API.post("/options", {
    questionId,
    optionText: text,     // ✅ backend expected
    isCorrect: correct,   // ✅ backend expected
  });

/* ================= ATTEMPT ================= */
export const submitQuizAttempt = (attempt) =>
  API.post("/attempts/submit", attempt);

export const getAttemptById = (id) => API.get(`/attempts/${id}`);
export const hasAttempted = (quizId) =>
  API.get(`/attempts/has-attempted/${quizId}`);
export const getMyQuizHistory = () => API.get("/attempts/my");

export default {
  createQuiz,
  getQuizById,
  getAllQuizzes,
  deleteQuiz,
  addQuestion,
  addOption,
  submitQuizAttempt,
  getAttemptById,
  hasAttempted,
  getMyQuizHistory,
};
