import axios from "axios";

// ✅ Use Vercel env when deployed, fallback to localhost for local dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const authService = {
  // ================= LOGIN =================
  login(email, password) {
    return axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
  },

  // ================= GOOGLE LOGIN =================
  googleLogin({ idToken, role }) {
    console.log(idToken);
    console.log(role);
    return axios.post(
      `${API_BASE_URL}/api/auth/google`,
      {
        idToken,
        role,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  },

  // ================= REGISTER =================
  register({ name, email, password, role }) {
    return axios.post(`${API_BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
      role,
    });
  },

  // ================= FORGOT PASSWORD =================
  forgotPassword(email) {
    return axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
      email,
    });
  },

  // ================= RESET PASSWORD =================
  // ⚠️ BACKEND EXPECTS @RequestParam
  resetPassword(token, newPassword) {
    return axios.post(
      `${API_BASE_URL}/api/auth/reset-password?token=${token}&newPassword=${newPassword}`,
    );
  },

  // ================= VERIFY EMAIL =================
  verifyEmail(token, email) {
    return axios.post(`${API_BASE_URL}/api/auth/verify-email`, {
      token,
      email,
    });
  },

  // ================= RESEND VERIFICATION =================
  resendVerification(email) {
    return axios.post(`${API_BASE_URL}/api/auth/resend-verification`, {
      email,
    });
  },

  // ================= TOKEN HELPERS =================
  saveToken(token) {
    localStorage.setItem("lms_token", token);
  },

  getToken() {
    return localStorage.getItem("lms_token");
  },

  logout() {
    localStorage.removeItem("lms_token");
  },
};

export default authService;