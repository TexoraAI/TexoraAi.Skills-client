import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── EMAILS ────────────────────────────────────────────────────
// Maps to: com.lms.live_session.controller.EmailController
// Base path: /api/emails

/** POST /api/emails/draft — save without sending */
// export const draftEmail = (data) =>
//   axios.post(`${API_BASE}/emails/draft`, data, getAuthHeader());

// /** POST /api/emails/send */
// export const sendEmail = (data) =>
//   axios.post(`${API_BASE}/emails/send`, data, getAuthHeader());

/** POST /api/emails/draft — save without sending (multipart, supports file attachments) */
export const draftEmail = (formData) =>
  axios.post(`${API_BASE}/emails/draft`, formData, {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

/** POST /api/emails/send (multipart, supports file attachments) */
export const sendEmail = (formData) =>
  axios.post(`${API_BASE}/emails/send`, formData, {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });
/**
 * GET /api/emails?status=DRAFT|SENT|FAILED
 * status is optional — omit to get all emails for the logged-in user.
 */
export const getMyEmails = (status) =>
  axios.get(
    `${API_BASE}/emails${status ? `?status=${status}` : ""}`,
    getAuthHeader(),
  );

/** GET /api/emails/{id} */
export const getEmailById = (id) =>
  axios.get(`${API_BASE}/emails/${id}`, getAuthHeader());

/** PUT /api/emails/{id} — update a DRAFT */
export const updateDraft = (id, data) =>
  axios.put(`${API_BASE}/emails/${id}`, data, getAuthHeader());

/** DELETE /api/emails/{id} */
export const deleteEmail = (id) =>
  axios.delete(`${API_BASE}/emails/${id}`, getAuthHeader());

/** GET /api/emails/stats — { unread, sent, drafts } */
export const getEmailStats = () =>
  axios.get(`${API_BASE}/emails/stats`, getAuthHeader());
