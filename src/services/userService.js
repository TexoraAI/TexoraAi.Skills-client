import axios from "axios";

const API_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const userService = {
  // =========================
  // Admin: list users
  // =========================
  getUsers(page = 0, size = 20) {
    return axios.get(`${API_GATEWAY}/users`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // Get user by ID
  // =========================
  getUserById(id) {
    return axios.get(`${API_GATEWAY}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // Update user
  // =========================
  updateUser(id, data) {
    return axios.put(`${API_GATEWAY}/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // ✅ ADMIN CREATE USER (ONLY THIS IS USED)
  // =========================
  createUser(data) {
    return axios.post(`${API_GATEWAY}/users`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // 🔓 PUBLIC AUTH REGISTER (SIGNUP ONLY – NOT USED BY ADMIN)
  // =========================
  createAuthUser(data) {
    return axios.post(`${API_GATEWAY}/auth/register`, {
      email: data.email,
      password: data.password,
      name: data.displayName,
      role: data.roles?.replace("ROLE_", "") || "STUDENT",
    });
  },

  // =========================
  // Delete user
  // =========================
  deleteUser(id) {
    return axios.delete(`${API_GATEWAY}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  getMyProfile() {
    return axios.get(`${API_GATEWAY}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  updateMyProfile(data) {
    return axios.put(`${API_GATEWAY}/users/me`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },
};

export default userService;