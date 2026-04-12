// import axios from "axios";

// // ✅ Use Vercel env when deployed, fallback to localhost for local dev
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authService = {
//   // ================= LOGIN =================
//   login(email, password) {
//     return axios.post(`${API_BASE_URL}/auth/login`, {
//       email,
//       password,
//     });
//   },

//   // ================= GOOGLE LOGIN =================
//   googleLogin({ idToken, role }) {
//     return axios.post(
//       `${API_BASE_URL}/auth/google`,
//       {
//         idToken,
//         role,
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   },

//   // ================= REGISTER =================
//   register({ name, email, password, role }) {
//     return axios.post(`${API_BASE_URL}/auth/register`, {
//       name,
//       email,
//       password,
//       role,
//     });
//   },

//   // ================= FORGOT PASSWORD =================
//   forgotPassword(email) {
//     return axios.post(`${API_BASE_URL}/auth/forgot-password`, {
//       email,
//     });
//   },

//   // ================= RESET PASSWORD =================
//   resetPassword(token, newPassword) {
//     return axios.post(
//       `${API_BASE_URL}/auth/reset-password?token=${token}&newPassword=${newPassword}`,
//     );
//   },

//   // ================= VERIFY EMAIL =================
//   verifyEmail(token, email) {
//     return axios.post(`${API_BASE_URL}/auth/verify-email`, {
//       token,
//       email,
//     });
//   },

//   // ================= RESEND VERIFICATION =================
//   resendVerification(email) {
//     return axios.post(`${API_BASE_URL}/auth/resend-verification`, {
//       email,
//     });
//   },

//   // ================= CHANGE PASSWORD =================
//   changePassword(newPassword, confirmPassword) {
//     return axios.post(
//       `${API_BASE_URL}/auth/change-password`,
//       {
//         newPassword,
//         confirmPassword,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//         },
//       },
//     );
//   },

//   // ================= TOKEN HELPERS =================
//   saveToken(token) {
//     localStorage.setItem("lms_token", token);
//   },

//   getToken() {
//     return localStorage.getItem("lms_token");
//   },

//   logout() {
//     localStorage.removeItem("lms_token");
//   },
// };

// export default authService;



import axios from "axios";

// ✅ Use Vercel env when deployed, fallback to localhost for local dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ══════════════════════════════════════════════════════════════
   AXIOS INSTANCE — automatically attaches Bearer token on
   every request so you never have to pass headers manually.
   This is why change-password was returning 401: the token
   from localStorage was null or the key name was wrong.
══════════════════════════════════════════════════════════════ */
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ REQUEST INTERCEPTOR — runs before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR — handle 401 globally (token expired / missing)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token is invalid or expired — clear it and redirect to login
      localStorage.removeItem("lms_token");
      // Only redirect if not already on a public page
      const publicPaths = ["/", "/login", "/register", "/forgot-password"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

const authService = {
  // ================= LOGIN =================
  login(email, password) {
    return api.post("/auth/login", { email, password });
  },

  // ================= GOOGLE LOGIN =================
  googleLogin({ idToken, role }) {
    return api.post(
      "/auth/google",
      { idToken, role },
      { headers: { "Content-Type": "application/json" } },
    );
  },

  // ================= REGISTER =================
  register({ name, email, password, role }) {
    return api.post("/auth/register", { name, email, password, role });
  },

  // ================= FORGOT PASSWORD =================
  forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  // ================= RESET PASSWORD =================
  resetPassword(token, newPassword) {
    return api.post(
      `/auth/reset-password?token=${token}&newPassword=${newPassword}`,
    );
  },

  // ================= VERIFY EMAIL =================
  verifyEmail(token, email) {
    return api.post("/auth/verify-email", { token, email });
  },

  // ================= RESEND VERIFICATION =================
  resendVerification(email) {
    return api.post("/auth/resend-verification", { email });
  },

  // ================= CHANGE PASSWORD =================
  // ✅ FIX: No need to manually set Authorization header anymore —
  // the interceptor above handles it automatically for every request.
  // Previously this was failing with 401 because:
  //   1. localStorage.getItem("lms_token") returned null (wrong key or not saved)
  //   2. The header was "Bearer null" which the Gateway rejected
  changePassword(newPassword, confirmPassword) {
    return api.post("/auth/change-password", { newPassword, confirmPassword });
  },

  // ================= TOKEN HELPERS =================
  // ✅ Always use these helpers — never read/write localStorage directly
  saveToken(token) {
    localStorage.setItem("lms_token", token);
  },

  getToken() {
    return localStorage.getItem("lms_token");
  },

  isLoggedIn() {
    return !!localStorage.getItem("lms_token");
  },

  logout() {
    localStorage.removeItem("lms_token");
  },
  // ================= CHECK GOOGLE USER (read-only, no DB write) =================
  checkGoogleUser({ idToken }) {
    return api.post("/auth/check-google", { idToken }).then(res => res.data);
  },
};

export default authService;
