

// src/services/publicBookingService.js

import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── PUBLIC BOOKINGS ───────────────────────────────────────────────────────────

/**
 * Book a public session (no auth required)
 * POST /api/live-sessions/public/bookings
 * ✅ Now includes 4 custom fields
 */
export const createPublicBooking = (bookingData) =>
  axios.post(`${API_BASE}/live-sessions/public/bookings`, {
    sessionId:        bookingData.sessionId,
    fullName:         bookingData.fullName,
    email:            bookingData.email,
    phoneNumber:      bookingData.phoneNumber,
    country:          bookingData.country,
    gdprConsent:      bookingData.gdprConsent,
    // ✅ new fields
    topicsOfInterest: bookingData.topicsOfInterest,
    jobRole:          bookingData.jobRole,
    howDidYouHear:    bookingData.howDidYouHear,
    learningGoal:     bookingData.learningGoal,
  });

/**
 * Verify a booking by unique access token (no auth required)
 * GET /api/live-sessions/public/bookings/verify/{token}
 */
export const verifyPublicBooking = (token) =>
  axios.get(`${API_BASE}/live-sessions/public/bookings/verify/${token}`);

/**
 * Mark booking as joined
 * POST /api/live-sessions/public/bookings/{id}/join
 */
export const markBookingAsJoined = (bookingId) =>
  axios.post(
    `${API_BASE}/live-sessions/public/bookings/${bookingId}/join`,
    {}
  );

/**
 * Mark booking as left
 * POST /api/live-sessions/public/bookings/{id}/leave
 */
export const markBookingAsLeft = (bookingId) =>
  axios.post(
    `${API_BASE}/live-sessions/public/bookings/${bookingId}/leave`,
    {}
  );

/**
 * Get booking duration in minutes
 * GET /api/live-sessions/public/bookings/{id}/duration
 * Response: { bookingId, durationMinutes }
 */
export const getBookingDuration = (bookingId) =>
  axios.get(
    `${API_BASE}/live-sessions/public/bookings/${bookingId}/duration`
  );

/**
 * Cancel a booking
 * POST /api/live-sessions/public/bookings/{id}/cancel
 */
export const cancelPublicBooking = (bookingId) =>
  axios.post(
    `${API_BASE}/live-sessions/public/bookings/${bookingId}/cancel`,
    {}
  );

/**
 * Get all bookings for a session
 * GET /api/live-sessions/public/bookings/session/{sessionId}
 */
export const getSessionBookings = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/public/bookings/session/${sessionId}`
  );

/**
 * Get public session details (no auth required)
 * GET /api/live-sessions/{sessionId}
 */
// export const getPublicSessionDetails = (sessionId) =>
//   axios.get(`${API_BASE}/live-sessions/${sessionId}`);

export const getPublicSessionDetails = (sessionId) =>
  axios.get(`${API_BASE}/live-sessions/public/session/${sessionId}`);