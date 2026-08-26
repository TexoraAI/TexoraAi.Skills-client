import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── CONTACTS CRUD ─────────────────────────────────────────────
// Maps to: com.lms.live_session.controller.ContactController
// Base path: /api/contacts

/** POST /api/contacts */
export const createContact = (data) =>
  axios.post(`${API_BASE}/contacts`, data, getAuthHeader());

/** GET /api/contacts — all contacts for logged-in user */
export const getMyContacts = () =>
  axios.get(`${API_BASE}/contacts`, getAuthHeader());

/** GET /api/contacts/{id} */
export const getContactById = (id) =>
  axios.get(`${API_BASE}/contacts/${id}`, getAuthHeader());

/** PUT /api/contacts/{id} */
export const updateContact = (id, data) =>
  axios.put(`${API_BASE}/contacts/${id}`, data, getAuthHeader());

/** DELETE /api/contacts/{id} */
export const deleteContact = (id) =>
  axios.delete(`${API_BASE}/contacts/${id}`, getAuthHeader());

/** GET /api/contacts/search?q=... — search by name or email */
export const searchContacts = (q) =>
  axios.get(
    `${API_BASE}/contacts/search?q=${encodeURIComponent(q)}`,
    getAuthHeader(),
  );

/** GET /api/contacts/suggestions?q=... — email autocomplete for EventForm attendees */
export const getEmailSuggestions = (q) =>
  axios.get(
    `${API_BASE}/contacts/suggestions?q=${encodeURIComponent(q)}`,
    getAuthHeader(),
  );
