import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─── Auth Header ───────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── LIVE SESSIONS CRUD ────────────────────────────────────────

export const createLiveSession = (data) =>
  axios.post(`${API_BASE}/live-sessions`, data, getAuthHeader());

/**
 * Start live → records actualStartTime on backend → returns { room, token }
 * Backend enforces canStart check — will return 400 if too early
 */
export const startLiveSessionWithToken = (sessionId) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/start-live`,
    {},
    getAuthHeader(),
  );

export const endLiveSession = (sessionId) =>
  axios.post(`${API_BASE}/live-sessions/${sessionId}/end`, {}, getAuthHeader());

export const deleteLiveSession = (sessionId) =>
  axios.delete(`${API_BASE}/live-sessions/${sessionId}`, getAuthHeader());

export const getBatchSessions = (batchId) =>
  axios.get(`${API_BASE}/live-sessions/batch/${batchId}`, getAuthHeader());

export const getLiveSessionsByBatch = (batchId) =>
  axios.get(`${API_BASE}/live-sessions/batch/${batchId}/live`, getAuthHeader());

export const getSessionById = (sessionId) =>
  axios.get(`${API_BASE}/live-sessions/${sessionId}`, getAuthHeader());

/**
 * GET /api/live-sessions/history
 * Returns ALL sessions for the logged-in trainer (from JWT)
 */
export const getSessionHistory = () =>
  axios.get(`${API_BASE}/live-sessions/history`, getAuthHeader());

/**
 * GET /api/live-sessions/{id}/can-start
 * Returns { canStart, scheduledAt, minutesUntilStart, reason, createdAt }
 * Used by frontend to decide whether to show "Go Live" button
 */
export const checkCanStart = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/can-start`,
    getAuthHeader(),
  );
// ADD to your existing liveSessionApi.js

// Resolve meeting link — returns { type: "EXTERNAL"|"CUSTOM", url }
export const getMeetingLink = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/meeting-link`,
    getAuthHeader(),
  );

// Trainer calendar — pass ISO date strings e.g. "2025-05-01"
export const getTrainerCalendar = (from, to) =>
  axios.get(
    `${API_BASE}/live-sessions/calendar?from=${from}&to=${to}`,
    getAuthHeader(),
  );

// Published sessions — no auth needed for public viewing
export const getPublishedSessions = () =>
  axios.get(`${API_BASE}/live-sessions/published`);
// ─── JOIN SESSION ──────────────────────────────────────────────

// export const joinLiveSession = (sessionId, studentId) =>
//   axios.get(
//     `${API_BASE}/live-sessions/${sessionId}/join?studentId=${studentId}`,
//     getAuthHeader(),
//   );
export const joinLiveSession = (sessionId) =>
  axios.get(`${API_BASE}/live-sessions/${sessionId}/join`, getAuthHeader());

export const joinLiveSessionPublic = (sessionId, bookingId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/join?studentId=${bookingId}`,
  );

// ─── CALLS ─────────────────────────────────────────────────────

export const startCall = (trainerEmail) =>
  axios.post(
    `${API_BASE}/live-sessions/call/start?trainerEmail=${trainerEmail}`,
    {},
    getAuthHeader(),
  );

export const joinCall = (room) =>
  axios.get(
    `${API_BASE}/live-sessions/call/join?room=${room}`,
    getAuthHeader(),
  );

export const participantJoin = (sessionId, batchId, trainerEmail) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/participant/join?batchId=${batchId}&trainerEmail=${encodeURIComponent(trainerEmail)}`,
    {},
    getAuthHeader(),
  );

// studentEmail removed — backend gets it from JWT
export const participantLeave = (sessionId) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/participant/leave`,
    {},
    getAuthHeader(),
  );

export const getSessionParticipants = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/participants`,
    getAuthHeader(),
  );
// ─── RECORDINGS ────────────────────────────────────────────────

export const uploadRecording = (formData) =>
  axios.post(`${API_BASE}/live-sessions/recording/upload`, formData, {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

export const getAllRecordings = () =>
  axios.get(`${API_BASE}/live-sessions/recording/all`, getAuthHeader());

export const getBatchRecordings = (batchId) =>
  axios.get(
    `${API_BASE}/live-sessions/recording/batch/${batchId}`,
    getAuthHeader(),
  );

export const getSessionRecordings = (sessionId) =>
  axios.get(
    `${API_BASE}/live-sessions/recording/session/${sessionId}`,
    getAuthHeader(),
  );

/** Uses JWT to identify trainer — no trainerId param needed */
export const getMyRecordings = () =>
  axios.get(`${API_BASE}/live-sessions/recording/trainer/my`, getAuthHeader());

export const getRecordingById = (id) =>
  axios.get(`${API_BASE}/live-sessions/recording/${id}`, getAuthHeader());

export const updateRecording = (id, data) =>
  axios.put(`${API_BASE}/live-sessions/recording/${id}`, data, getAuthHeader());

export const deleteRecording = (id) =>
  axios.delete(`${API_BASE}/live-sessions/recording/${id}`, getAuthHeader());

export const incrementRecordingViews = (id) =>
  axios.post(
    `${API_BASE}/live-sessions/recording/${id}/view`,
    {},
    getAuthHeader(),
  );

export const markRecordingReady = (id) =>
  axios.post(
    `${API_BASE}/live-sessions/recording/${id}/mark-ready`,
    {},
    getAuthHeader(),
  );

export const markRecordingFailed = (id) =>
  axios.post(
    `${API_BASE}/live-sessions/recording/${id}/mark-failed`,
    {},
    getAuthHeader(),
  );

// ─── WHITEBOARD ────────────────────────────────────────────────

// GET /api/v1/live-sessions/{sessionId}/whiteboard/state
// Called by late-joiners to load current board state
export const getWhiteboardState = (sessionId) =>
  axios.get(
    `${API_BASE}/v1/live-sessions/${sessionId}/whiteboard/state`,
    getAuthHeader(),
  );

// POST /api/v1/live-sessions/{sessionId}/whiteboard/save
// Trainer saves current board snapshot
export const saveWhiteboardSnapshot = (sessionId, whiteboardEvent) =>
  axios.post(
    `${API_BASE}/v1/live-sessions/${sessionId}/whiteboard/save`,
    whiteboardEvent,
    getAuthHeader(),
  );

// POST /api/v1/live-sessions/{sessionId}/whiteboard/clear
// Clears board and broadcasts CLEAR event to all subscribers
export const clearWhiteboardSession = (sessionId) =>
  axios.post(
    `${API_BASE}/v1/live-sessions/${sessionId}/whiteboard/clear`,
    {},
    getAuthHeader(),
  );

// ─── AI COMPANION ──────────────────────────────────────────────

// Replace the existing sendAiCompanionMessage export with this:
export const sendAiCompanionMessage = (
  sessionId,
  mode,
  message,
  additionalContext = null,
  sources,
  resourceIds,
  conversationId,
  saveToHistory,
) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/chat`,
    {
      sessionId: sessionId || null,
      mode,
      message,
      additionalContext,
      sources: sources || ["MEETINGS"],
      resourceIds: resourceIds || [],
      conversationId: conversationId || null,
      saveToHistory: saveToHistory !== false,
    },
    getAuthHeader(),
  );
// GET /api/v1/ai-companion/modes
// Returns all available AI mode cards for the UI
export const getAiCompanionModes = () =>
  axios.get(`${API_BASE}/v1/ai-companion/modes`, getAuthHeader());

// GET /api/v1/ai-companion/health
export const checkAiCompanionHealth = () =>
  axios.get(`${API_BASE}/v1/ai-companion/health`, getAuthHeader());

// ─── AI COMPANION — CONVERSATIONS ─────────────────────────────

/** POST /api/v1/ai-companion/conversations */
export const createAiConversation = (data = {}) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/conversations`,
    data,
    getAuthHeader(),
  );

/** GET /api/v1/ai-companion/conversations */
export const getAiConversations = () =>
  axios.get(`${API_BASE}/v1/ai-companion/conversations`, getAuthHeader());

/** GET /api/v1/ai-companion/conversations/:id */
export const getAiConversation = (id) =>
  axios.get(`${API_BASE}/v1/ai-companion/conversations/${id}`, getAuthHeader());

/** GET /api/v1/ai-companion/conversations/:id/messages */
export const getAiConversationMessages = (id) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/conversations/${id}/messages`,
    getAuthHeader(),
  );

/** DELETE /api/v1/ai-companion/conversations/:id */
export const deleteAiConversation = (id) =>
  axios.delete(
    `${API_BASE}/v1/ai-companion/conversations/${id}`,
    getAuthHeader(),
  );

// ─── AI COMPANION — RESOURCES ──────────────────────────────────

/** GET /api/v1/ai-companion/resources/meetings */
export const getAiResourceMeetings = () =>
  axios.get(`${API_BASE}/v1/ai-companion/resources/meetings`, getAuthHeader());

/** GET /api/v1/ai-companion/resources/docs */
export const getAiResourceDocs = () =>
  axios.get(`${API_BASE}/v1/ai-companion/resources/docs`, getAuthHeader());

/** GET /api/v1/ai-companion/resources/chat */
export const getAiResourceChat = (sessionId) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/resources/chat${sessionId ? `?sessionId=${sessionId}` : ""}`,
    getAuthHeader(),
  );

/** GET /api/v1/ai-companion/resources/whiteboard */
export const getAiResourceWhiteboard = (sessionId) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/resources/whiteboard${sessionId ? `?sessionId=${sessionId}` : ""}`,
    getAuthHeader(),
  );

/** GET /api/v1/ai-companion/resources/recordings */
export const getAiResourceRecordings = (sessionId) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/resources/recordings${sessionId ? `?sessionId=${sessionId}` : ""}`,
    getAuthHeader(),
  );

/** POST /api/v1/ai-companion/resources/upload */
export const uploadAiResource = (formData) =>
  axios.post(`${API_BASE}/v1/ai-companion/resources/upload`, formData, {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

// ─── AI COMPANION — SESSION NOTES & ACTION ITEMS ───────────────

/** POST /api/v1/ai-companion/sessions/:sessionId/notes/generate */
export const generateSessionNotes = (sessionId) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/sessions/${sessionId}/notes/generate`,
    {},
    getAuthHeader(),
  );

/** GET /api/v1/ai-companion/sessions/:sessionId/notes */
export const getSessionAiNotes = (sessionId) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/sessions/${sessionId}/notes`,
    getAuthHeader(),
  );

/** GET /api/v1/ai-companion/sessions/:sessionId/action-items */
export const getSessionActionItems = (sessionId) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/sessions/${sessionId}/action-items`,
    getAuthHeader(),
  );

// ─── AI COMPANION — WORKFLOWS ────────────────────────────────────

/** POST /api/v1/ai-companion/workflows */
export const createWorkflow = (data) =>
  axios.post(`${API_BASE}/v1/ai-companion/workflows`, data, getAuthHeader());

export const getMyWorkflows = (params = {}) =>
  axios.get(`${API_BASE}/v1/ai-companion/workflows`, {
    ...getAuthHeader(),
    params,
  });

/** GET /api/v1/ai-companion/workflows/:id */
export const getWorkflow = (id) =>
  axios.get(`${API_BASE}/v1/ai-companion/workflows/${id}`, getAuthHeader());

/** PUT /api/v1/ai-companion/workflows/:id */
export const updateWorkflow = (id, data) =>
  axios.put(
    `${API_BASE}/v1/ai-companion/workflows/${id}`,
    data,
    getAuthHeader(),
  );

/** DELETE /api/v1/ai-companion/workflows/:id */
export const deleteWorkflow = (id) =>
  axios.delete(`${API_BASE}/v1/ai-companion/workflows/${id}`, getAuthHeader());

/** POST /api/v1/ai-companion/workflows/:id/duplicate */
export const duplicateWorkflow = (id) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/workflows/${id}/duplicate`,
    {},
    getAuthHeader(),
  );

/**
 * PATCH /api/v1/ai-companion/workflows/:id/status
 * status values: "DRAFT" | "ACTIVE" | "INACTIVE"
 */
export const updateWorkflowStatus = (id, status) =>
  axios.patch(
    `${API_BASE}/v1/ai-companion/workflows/${id}/status`,
    { status },
    getAuthHeader(),
  );

/** POST /api/v1/ai-companion/workflows/:id/run  — reserved for future phase */
export const runWorkflow = (id, data = {}) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/workflows/${id}/run`,
    data,
    getAuthHeader(),
  );

/** GET /api/v1/ai-companion/workflows/runs  — reserved for future phase */
export const getWorkflowRuns = () =>
  axios.get(`${API_BASE}/v1/ai-companion/workflows/runs`, getAuthHeader());
// ─── AI COMPANION — ACTIVITY LOGS ─────────────────────────────

/** GET /api/v1/ai-companion/activity */
export const getAiActivityLogs = (page = 0, size = 20) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/activity?page=${page}&size=${size}`,
    getAuthHeader(),
  );

/** GET /api/v1/ai-companion/activity/:id */
export const getAiActivityLog = (id) =>
  axios.get(`${API_BASE}/v1/ai-companion/activity/${id}`, getAuthHeader());

/**
 * POST /api/v1/ai-companion/transcripts/start
 * Body: { liveSessionId?, title? }
 * Returns: AiTranscriptSession { id, status, startedAt, ... }
 */
export const startAiTranscript = (data = {}) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/transcripts/start`,
    data,
    getAuthHeader(),
  );

/**
 * POST /api/v1/ai-companion/transcripts/{transcriptId}/segment
 * Body: { text, speakerName?, startedAtSecond? }
 */
export const addAiTranscriptSegment = (transcriptId, data) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/transcripts/${transcriptId}/segment`,
    data,
    getAuthHeader(),
  );

/**
 * POST /api/v1/ai-companion/transcripts/{transcriptId}/stop
 */
export const stopAiTranscript = (transcriptId) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/transcripts/${transcriptId}/stop`,
    {},
    getAuthHeader(),
  );

/**
 * GET /api/v1/ai-companion/transcripts/{transcriptId}
 * Returns: { session, segments }
 */
export const getAiTranscript = (transcriptId) =>
  axios.get(
    `${API_BASE}/v1/ai-companion/transcripts/${transcriptId}`,
    getAuthHeader(),
  );

/**
 * POST /api/v1/ai-companion/transcripts/{transcriptId}/summary
 * Returns: { summary }
 */
export const generateAiTranscriptSummary = (transcriptId) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/transcripts/${transcriptId}/summary`,
    {},
    getAuthHeader(),
  );

// ✅ NEW — mid-session recording toggle
export const startRecordingLive = (sessionId) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/recording/start`,
    {},
    getAuthHeader(),
  );

export const stopRecordingLive = (sessionId) =>
  axios.post(
    `${API_BASE}/live-sessions/${sessionId}/recording/stop`,
    {},
    getAuthHeader(),
  );
/**
 * POST /api/v1/ai-companion/transcripts/{transcriptId}/ask
 * Body: { question }
 * Returns: { answer }
 */
export const askAiTranscript = (transcriptId, question) =>
  axios.post(
    `${API_BASE}/v1/ai-companion/transcripts/${transcriptId}/ask`,
    { question },
    getAuthHeader(),
  );

// ✅ NEW — guest join (no auth), name-only
export const joinLiveSessionGuest = (sessionId, name) =>
  axios.get(
    `${API_BASE}/live-sessions/${sessionId}/join-guest?name=${encodeURIComponent(name)}`,
  );

// ✅ NEW — public session status/details for the join-waiting screen (no auth)
export const getPublicSessionStatus = (sessionId) =>
  axios.get(`${API_BASE}/live-sessions/public/session/${sessionId}`);

// ─── MEETINGS (Google-Meet-style module) ──────────────────────

/**
 * POST /api/meetings/instant
 * Body: { title?, organizationId?, creatorName }
 * creatorRole is no longer sent — extracted server-side from the JWT.
 * creatorName is the logged-in user's display name (for the public
 * join page host badge) — required now, since JWT has no name claim.
 * Meeting becomes ACTIVE immediately.
 */
export const createInstantMeeting = (data) =>
  axios.post(`${API_BASE}/meetings/instant`, data, getAuthHeader());
/**
 * POST /api/meetings/scheduled
 * Body: { title, date, time, timezone, organizationId?, creatorName }
 * creatorRole is no longer sent — extracted server-side from the JWT.
 * date: "yyyy-MM-dd"  time: "HH:mm"  timezone: e.g. "Asia/Kolkata"
 */
export const createScheduledMeeting = (data) =>
  axios.post(`${API_BASE}/meetings/scheduled`, data, getAuthHeader());
/**
 * GET /api/meetings/validate/{joinCode}
 * Returns { valid: true, meeting } or { valid: false, message }
 * Used by the "Enter session code" join box on every dashboard.
 */
export const validateMeetingJoinCode = (joinCode) =>
  axios.get(`${API_BASE}/meetings/validate/${joinCode}`, getAuthHeader());

/**
 * GET /api/meetings/join/{joinCode}
 * Full meeting details for a join code (404-style error if not found).
 */
export const getMeetingByJoinCode = (joinCode) =>
  axios.get(`${API_BASE}/meetings/join/${joinCode}`, getAuthHeader());

export const getMeetingById = (meetingId) =>
  axios.get(`${API_BASE}/meetings/${meetingId}`, getAuthHeader());

/** GET /api/meetings/my — all meetings created by the logged-in user (from JWT) */
export const getMyMeetings = () =>
  axios.get(`${API_BASE}/meetings/my`, getAuthHeader());

/**
 * GET /api/meetings/my/calendar?month=yyyy-MM
 * Returns meetings for the logged-in user grouped by date:
 * { "2026-07-25": [ {...meeting}, ... ], "2026-07-28": [...] }
 * month is optional — omit it to get the current month.
 */
export const getMeetingsCalendar = (month) =>
  axios.get(
    `${API_BASE}/meetings/my/calendar${month ? `?month=${month}` : ""}`,
    getAuthHeader(),
  );

/** POST /api/meetings/{id}/start — force-start a SCHEDULED meeting early */
export const startScheduledMeeting = (meetingId) =>
  axios.post(`${API_BASE}/meetings/${meetingId}/start`, {}, getAuthHeader());

/** POST /api/meetings/{id}/end */
export const endMeeting = (meetingId) =>
  axios.post(`${API_BASE}/meetings/${meetingId}/end`, {}, getAuthHeader());

/** DELETE /api/meetings/{id} — host only, permanently deletes the meeting + its join requests */
export const deleteMeetingApi = (meetingId) =>
  axios.delete(`${API_BASE}/meetings/${meetingId}`, getAuthHeader());
/**
 * GET /api/meetings/{id}/token?displayName=...
 * Returns { room, token } for the LiveKit room — only works while
 * the meeting is ACTIVE.
 */
export const getMeetingJoinToken = (meetingId, displayName) =>
  axios.get(
    `${API_BASE}/meetings/${meetingId}/token${displayName ? `?displayName=${encodeURIComponent(displayName)}` : ""}`,
    getAuthHeader(),
  );
// ─── MEETINGS — Guest lobby (public, guarded by guestIdentity) ─────

/** POST /api/meetings/{id}/join-requests — public, no auth (anonymous guest) */
// export const requestToJoin = (meetingId, guestName) =>
//   axios.post(`${API_BASE}/meetings/${meetingId}/join-requests`, { guestName });
/** POST /api/meetings/{id}/join-requests — public, no auth (anonymous guest) */
export const requestToJoin = (meetingId, guestName, guestEmail) =>
  axios.post(`${API_BASE}/meetings/${meetingId}/join-requests`, {
    guestName,
    guestEmail,
  });

/** GET /api/meetings/{id}/join-requests/{requestId}?guestIdentity=... — public */
export const getJoinRequestStatus = (meetingId, requestId, guestIdentity) =>
  axios.get(`${API_BASE}/meetings/${meetingId}/join-requests/${requestId}`, {
    params: { guestIdentity },
  });

/** GET /api/meetings/{id}/token/guest/{requestId}?guestIdentity=...&displayName=... — public */
export const getGuestToken = (
  meetingId,
  requestId,
  guestIdentity,
  displayName,
) =>
  axios.get(`${API_BASE}/meetings/${meetingId}/token/guest/${requestId}`, {
    params: { guestIdentity, displayName },
  });

// ─── MEETINGS — Host-only lobby controls ───────────────────────────

/**
 * GET /api/meetings/{id}/token?displayName=...
 * Host join — backend rejects this for non-hosts now, so this is the
 * same call as getMeetingJoinToken above. Kept as an alias for clarity
 * at call sites; consider removing one to avoid duplication.
 */
export const joinMeetingAsHost = (meetingId, displayName) =>
  axios.get(`${API_BASE}/meetings/${meetingId}/token`, {
    ...getAuthHeader(),
    params: { displayName },
  });

/** GET /api/meetings/{id}/join-requests — host only */
export const listPendingJoinRequests = (meetingId) =>
  axios.get(`${API_BASE}/meetings/${meetingId}/join-requests`, getAuthHeader());

/** GET /api/meetings/{id}/join-requests/all — host only, all guests who ever requested (any status) */
export const getAllJoinRequests = (meetingId) =>
  axios.get(
    `${API_BASE}/meetings/${meetingId}/join-requests/all`,
    getAuthHeader(),
  );

/** POST /api/meetings/{id}/join-requests/{requestId}/admit — host only */
export const admitJoinRequest = (meetingId, requestId) =>
  axios.post(
    `${API_BASE}/meetings/${meetingId}/join-requests/${requestId}/admit`,
    {},
    getAuthHeader(),
  );

/** POST /api/meetings/{id}/join-requests/{requestId}/deny — host only */
export const denyJoinRequest = (meetingId, requestId) =>
  axios.post(
    `${API_BASE}/meetings/${meetingId}/join-requests/${requestId}/deny`,
    {},
    getAuthHeader(),
  );

/** POST /api/meetings/{id}/join-requests/admit-all — host only */
export const admitAllJoinRequests = (meetingId) =>
  axios.post(
    `${API_BASE}/meetings/${meetingId}/join-requests/admit-all`,
    {},
    getAuthHeader(),
  );
