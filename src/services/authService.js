// export default authService;
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const api = axios.create({ baseURL: API_BASE_URL });

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lms_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("lms_token");
      const publicPaths = ["/", "/login", "/register", "/forgot-password"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

const authService = {
  // ✅ EMAIL LOGIN
  login({ email, password }) {
    return api.post("/auth/login", { email, password }).then((res) => res.data);
  },

  // ✅ CHECK GOOGLE USER (before complete-profile)
  // Returns: { isNewUser, profileCompleted, role, name, email }
  checkGoogleUser({ idToken }) {
    console.log("📡 POST /auth/check-google");
    return api
      .post("/auth/check-google", { idToken })
      .then((res) => {
        console.log("✅ checkGoogleUser response:", res.data);
        return res.data; // Already the response body
      })
      .catch((err) => {
        console.error("❌ checkGoogleUser error:", err);
        throw err;
      });
  },

  // ✅ GOOGLE LOGIN (after complete-profile with onboarding answers)
  // Input: { idToken, role, onboardingAnswers }
  // Returns: { token, email, role, name, profileCompleted, newUser }
  googleLogin({ idToken, role, onboardingAnswers }) {
    console.log("📡 POST /auth/google", {
      role,
      onboardingAnswersCount: onboardingAnswers
        ? Object.keys(onboardingAnswers).length
        : 0,
    });
    return api
      .post(
        "/auth/google",
        {
          idToken,
          role,
          onboardingAnswers: onboardingAnswers || {}, // Send even if empty
        },
        { headers: { "Content-Type": "application/json" } },
      )
      .then((res) => {
        console.log("✅ googleLogin full response:", res.data);
        return res.data; // Return the data directly
      })
      .catch((err) => {
        console.error("❌ googleLogin error:", err);
        throw err;
      });
  },

  // Mark profile as completed
  markProfileCompleted() {
    return api.patch("/auth/me/profile-completed").then((res) => res.data);
  },

  // ================= SUPERADMIN: DELETE USER =================
  deleteUser(userId) {
    return api.delete(`/auth/users/${userId}`).then((res) => res.data);
  },

  // ================= ORGANIZATIONS =================

  // GET all orgs (super admin)
  getAllOrganizations() {
    return api.get("/organizations").then((res) => res.data);
  },

  // POST create org (super admin)
  createOrganization(payload) {
    return api.post("/organizations", payload).then((res) => res.data);
  },

  // GET single org
  getOrganizationById(id) {
    return api.get(`/organizations/${id}`).then((res) => res.data);
  },

  // GET capacity + full profile (admin profile tab uses this)
  getOrgCapacity(orgId) {
    return api.get(`/organizations/${orgId}/capacity`).then((res) => res.data);
  },

  // PUT full update (super admin edit org)
  updateOrganization(id, payload) {
    return api.put(`/organizations/${id}`, payload).then((res) => res.data);
  },

  // PATCH status only (super admin suspend/activate)
  updateOrganizationStatus(id, status) {
    return api
      .patch(`/organizations/${id}/status?status=${status}`)
      .then((res) => res.data);
  },

  // PATCH admin self-update (only editable fields, locked fields untouched)
  updateAdminOrgProfile(orgId, payload) {
    return api
      .patch(`/organizations/${orgId}/profile`, payload)
      .then((res) => res.data);
  },

  // GET public list (student signup dropdown, no auth)
  getPublicOrganizations() {
    return api.get("/organizations/public").then((res) => res.data);
  },

  //super admin sees admin onboadring responses this endpoint is used for that

  getAdminOnboardingByEmail(email) {
    return api
      .get(`/auth/admin/onboarding-by-email?email=${encodeURIComponent(email)}`)
      .then((res) => res.data);
  },

  // DELETE org (super admin)
  deleteOrganizationById(id) {
    return api.delete(`/organizations/${id}`).then((res) => res.data);
  },
  // Block/unblock individual user (onboarding page)
  toggleUserBlock(userId, blocked) {
    return api
      .patch(`/auth/users/${userId}/block?blocked=${blocked}`)
      .then((res) => res.data);
  },

  register({ name, email, password, role }) {
    return api.post("/auth/register", { name, email, password, role });
  },

  forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword(token, newPassword) {
    return api.post(
      `/auth/reset-password?token=${token}&newPassword=${newPassword}`,
    );
  },

  verifyEmail(token, email) {
    return api.post("/auth/verify-email", { token, email });
  },

  resendVerification(email) {
    return api.post("/auth/resend-verification", { email });
  },

  changePassword(newPassword, confirmPassword) {
    return api.post("/auth/change-password", {
      newPassword,
      confirmPassword,
    });
  },

  // ================= ADMIN: LIST USERS (own org, or all if SUPER_ADMIN) =================
  getOrgUsersForAdmin() {
    return api.get("/auth/admin/org-users").then((res) => res.data);
  },

  // ================= ADMIN: UPDATE USER (name / email / role) =================
  adminUpdateUser(userId, payload) {
    return api
      .patch(`/auth/admin/users/${userId}`, payload)
      .then((res) => res.data);
  },

  // ================= ADMIN: RESEND SET-PASSWORD EMAIL =================
  adminResendSetPasswordEmail(userId) {
    return api
      .post(`/auth/admin/users/${userId}/resend-set-password`)
      .then((res) => res.data);
  },

  // ================= ADMIN: UPDATE USER BY EMAIL (for Tenant Admin / user-service IDs) ===
  adminUpdateUserByEmail(email, payload) {
    return api
      .patch(
        `/auth/admin/users/by-email?email=${encodeURIComponent(email)}`,
        payload,
      )
      .then((res) => res.data);
  },

  // ================= ADMIN: RESEND SET-PASSWORD EMAIL BY EMAIL =================
  adminResendSetPasswordEmailByEmail(email) {
    return api
      .post(
        `/auth/admin/users/by-email/resend-set-password?email=${encodeURIComponent(email)}`,
      )
      .then((res) => res.data);
  },
  // ================= SUPERADMIN: GET ONBOARDING RESPONSES =================
  getOnboardingResponses() {
    return api.get("/auth/admin/onboarding-responses").then((res) => res.data);
  },
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
    localStorage.removeItem("organizationId"); // ✅ ADD THIS
    localStorage.removeItem("role"); // ✅ ADD THIS too
    localStorage.removeItem("lms_user");
  },

  getCurrentRole() {
    return localStorage.getItem("role");
  },
};

export default authService;
