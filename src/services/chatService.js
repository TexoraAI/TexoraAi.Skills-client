import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9000/api/chat",
});

// ✅ Attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("lms_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================= API METHODS =================

// 🔹 Send message
export const sendMessage = (data) => {
  return API.post("/send", data);
};

// 🔹 Get conversation between TWO users (MANDATORY)
export const getConversation = (user1, user2) => {
  return API.get(`/conversation?user1=${user1}&user2=${user2}`);
};

// 🔹 Trainer inbox
export const getTrainerInbox = (trainerEmail) => {
  return API.get(`/trainer/inbox?trainerEmail=${trainerEmail}`);
};
