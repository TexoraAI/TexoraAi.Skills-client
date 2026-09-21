import axios from "axios";

// Same gateway base URL every other service file uses. If your other
// services all route through one gateway (http://localhost:9000/api) this
// is correct as-is. If auth-service / payment-wallet-service sit behind
// different hosts, just change the two baseURLs below.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const api = axios.create({ baseURL: API_BASE_URL });

// ✅ REQUEST INTERCEPTOR — identical pattern to authService.js
api.interceptors.request.use(
  (config) => {
    if (config.noAuth) {
      if (config.headers) delete config.headers.Authorization;
      return config;
    }
    const token = localStorage.getItem("lms_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR — identical 401 handling to authService.js.
// NOTE: this deliberately does NOT swallow 402/403/429 plan-limit errors —
// those need to reach the calling page's .catch() so planErrorHandler.js
// can parse them and open the UpgradeModal.
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

const planEntitlementService = {
  // ================= PREVIEW (auth-service) =================

  // ORG plans: trial | starter | growth
  getOrgUpgradePreview(orgId, targetPlan, durationMonths) {
    return api
      .get(`/organizations/${orgId}/upgrade/preview`, {
        params: { targetPlan, durationMonths },
      })
      .then((res) => res.data);
  },

  // INDIVIDUAL plans: free | pro | premium (standalone users only — org-bound
  // users get rejected by the backend, this is expected, let the caller
  // handle `valid: false` / the error).
  getIndividualUpgradePreview(userId, targetPlan, durationMonths) {
    return api
      .get(`/users/${userId}/upgrade/preview`, {
        params: { targetPlan, durationMonths },
      })
      .then((res) => res.data);
  },

  // RESUME-SPECIFIC OVERRIDE: free | pro | premium — works for ANY user,
  // org-bound or not.
  getResumePlanUpgradePreview(userId, targetPlan, durationMonths) {
    return api
      .get(`/users/${userId}/resume-plan/upgrade/preview`, {
        params: { targetPlan, durationMonths },
      })
      .then((res) => res.data);
  },

  // ================= PAYMENT (payment-wallet-service) =================

  // referenceId must be built as "{targetPlan}:{durationMonths}" e.g. "pro:6"
  // purpose: "PLAN_UPGRADE" (org/individual) or "RESUME_PLAN_UPGRADE" (resume)
  // idempotencyKey: generate a fresh uuid per attempt (crypto.randomUUID()),
  // so a retried click never double-charges.
  initiatePayment(
    { userId, orgId = null, purpose, referenceId, amount },
    idempotencyKey,
  ) {
    return api
      .post(
        "/payments/initiate",
        { userId, orgId, purpose, referenceId, amount },
        { headers: { "Idempotency-Key": idempotencyKey } },
      )
      .then((res) => res.data);
  },

  getPaymentStatus(orderId) {
    return api.get(`/payments/${orderId}/status`).then((res) => res.data);
  },

  getWalletBalance(userId) {
    return api.get(`/wallet/${userId}/balance`).then((res) => res.data);
  },
};

export default planEntitlementService;