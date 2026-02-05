import axios from "axios";

const API_BASE = "http://localhost:9000/api/students";

// ================= LIST =================
export const listStudents = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

// ================= CREATE (UPDATED – EMAIL ADDED) =================
export const createStudent = async (userId, email) => {
  const res = await axios.post(API_BASE, {
    userId,
    email, // ✅ NEW (nothing else changed)
  });
  return res.data;
};

// ================= UPDATE STATUS =================
export const updateStudentStatus = async (id, status) => {
  const res = await axios.put(`${API_BASE}/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};

// ================= TOUCH =================
export const touchStudent = async (id) => {
  await axios.put(`${API_BASE}/${id}/touch`);
};

// ================= DELETE =================
export const deleteStudent = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};