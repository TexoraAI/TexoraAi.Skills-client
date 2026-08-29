// ---------------------------------------------------------------------------
// roadmapService.js
// ---------------------------------------------------------------------------
// API layer for the "Roadmap Upgraded" feature (AI-generated learning
// syllabi: modules -> resources, progress tracking, AI mentor chat, and
// admin / super-admin usage stats).
//
// Backend controller: RoadmapUpgradedController -> @RequestMapping("/api/roadmap-upgraded")
// Auth: every endpoint reads the raw Authorization header on the backend
// (@RequestHeader("Authorization") String authHeader, then
// extractToken() expects "Bearer <token>"). The backend derives
// userId / role / organizationId from the JWT itself - the client never
// sends those fields, except organizationId is NOT even part of any request
// body in this controller (unlike the old roadmap service).
//
// This file COMPLETELY REPLACES the previous roadmapService.js (the one
// built around /api/progress/roadmaps, React-Flow nodes/edges, etc). That
// backend no longer exists in the new zip - this is the only roadmap
// controller present now. Do not merge the two; the old endpoints, DTOs and
// mappers (toApiNodeType, backendGraphToFlow, etc.) are gone.
// ---------------------------------------------------------------------------

import axios from "axios";

// --- Base config (same convention as the rest of the app) -----------------
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// RoadmapUpgradedController root -> /api/roadmap-upgraded
const ROADMAP_UPGRADED = `${API_BASE_URL}/roadmap-upgraded`;

function authHeader() {
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("lms_token")
      : null;
  // The backend does `authHeader.substring("Bearer ".length())` with no
  // fallback, and throws 401 if the header is missing/malformed - so we
  // always send a well-formed "Bearer <token>" (even if token is empty,
  // to surface the 401 instead of silently omitting the header).
  return { Authorization: `Bearer ${token || ""}` };
}

const http = axios.create({ baseURL: ROADMAP_UPGRADED });
http.interceptors.request.use((config) => {
  config.headers = { ...(config.headers || {}), ...authHeader() };
  return config;
});
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // ResponseStatusException on the backend serializes {status, error,
    // message, ...}; surface .message on the JS Error the same way the old
    // service did, so existing catch(err) => toast(err.message) code works.
    //
    // NOTE: for blob-response calls (getResourcePdfBlob below), a failed
    // request's err.response.data is itself a Blob, not a parsed JSON
    // object, so this branch is a no-op for those and the caller just sees
    // a normal axios error - which is fine, PdfModal only checks
    // success/failure, not err.message.
    const data = err?.response?.data;
    if (data && typeof data === "object" && typeof data.message === "string") {
      err.message = data.message;
    }
    return Promise.reject(err);
  },
);

// ===========================================================================
//  ENUM CONSTANTS (mirror the backend's plain-string "enums" - see
//  RoadmapUpgradedService: these are just Strings, not real Java enums, so
//  the values below are the exact literals the backend reads/writes)
// ===========================================================================

// Syllabus.sourceType
export const SOURCE_TYPE = {
  GENERATED: "GENERATED", // built fresh for this owner
  LIBRARY: "LIBRARY", // fromLibrary:true - reused/cloned from a cached template
};

// Syllabus.status
export const ROADMAP_STATUS = {
  GENERATING: "GENERATING",
  READY: "READY",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

// Resource.type - the only 4 values the generator ever produces
// (see RoadmapUpgradedService.ALL_CONTENT_SOURCES)
export const RESOURCE_TYPE = {
  VIDEO: "VIDEO",
  ARTICLE: "ARTICLE",
  PDF: "PDF",
  QUIZ: "QUIZ",
};

export const ALL_CONTENT_SOURCES = ["VIDEO", "ARTICLE", "PDF", "QUIZ"];

// Mentor message sender
export const MENTOR_SENDER = {
  USER: "USER",
  MENTOR: "MENTOR",
};

// ===========================================================================
//  API METHODS - one method per controller endpoint, same shape, same order
// ===========================================================================

const roadmapService = {
  SOURCE_TYPE,
  ROADMAP_STATUS,
  RESOURCE_TYPE,
  ALL_CONTENT_SOURCES,
  MENTOR_SENDER,

  // -------------------------------------------------------------------------
  // POST /api/roadmap-upgraded/generate -> RoadmapUpgradedResponseDto
  // Used for BOTH the step-by-step wizard (Path B, live generation) and the
  // library "Use this roadmap" one-click flow (Path A).
  //
  // request: {
  //   domain: string,            // e.g. "Technology & Computing"
  //   pathType: string,          // e.g. "JOB_PROFILE" | "SKILL" | "TASK" | "CERTIFICATION" | "COURSE_BATCH"
  //   targetRole: string,        // e.g. "Full-stack Developer"
  //   language: string,          // e.g. "English"
  //   contentSources: string[],  // subset of ALL_CONTENT_SOURCES; empty/omitted = all four
  //   fromLibrary: boolean,      // true = try to reuse a cached LIBRARY/READY syllabus for this targetRole first
  // }
  // -------------------------------------------------------------------------
  async generateRoadmap({
    domain,
    pathType,
    targetRole,
    language = "English",
    contentSources = [],
    fromLibrary = false,
  }) {
    const body = {
      domain,
      pathType,
      targetRole,
      language,
      contentSources,
      fromLibrary,
    };
    const res = await http.post("/generate", body);
    return res.data;
  },

  // GET /api/roadmap-upgraded/my -> RoadmapUpgradedResponseDto[]
  // All roadmaps owned by the caller (student/trainer/admin/super-admin - any
  // role can own roadmaps, ownership is just "who generated it").
  async getMyRoadmaps() {
    const res = await http.get("/my");
    return res.data;
  },

  // GET /api/roadmap-upgraded/{id} -> RoadmapUpgradedResponseDto
  // 403 if caller is not the owner, and not an ADMIN/TENANT_ADMIN of the same
  // org, and not SUPER_ADMIN. 404 if it doesn't exist.
  async getRoadmapById(id) {
    const res = await http.get(`/${id}`);
    return res.data;
  },

  // POST /api/roadmap-upgraded/resource/{id}/complete?quizScore=NN -> RoadmapUpgradedResponseDto
  // Marks a single resource complete, recomputes that module's progress %,
  // unlocks the next module if this one just hit 100%, recomputes overall
  // completionPercent/status, and returns the FULL updated roadmap (not just
  // the resource) so the UI can re-render module locks/progress in one shot.
  // quizScore is only meaningful when the resource's type is "QUIZ".
  async markResourceComplete(resourceId, quizScore = null) {
    const res = await http.post(`/resource/${resourceId}/complete`, null, {
      params: quizScore != null ? { quizScore } : {},
    });
    return res.data;
  },

  // GET /api/roadmap-upgraded/resource/{id}/pdf -> raw PDF bytes
  // (Content-Type: application/pdf). Fetched as a Blob (not JSON) so
  // PdfModal can build an object URL and render it inline via <iframe> -
  // never triggers a download or new tab. Same auth header as every other
  // call here (attached by the request interceptor above). 404s if the
  // resource isn't a PDF or has no stored content (see
  // RoadmapUpgradedService.getResourcePdf()); PdfModal treats any rejected
  // promise here as "couldn't be loaded".
  async getResourcePdfBlob(resourceId) {
    const res = await http.get(`/resource/${resourceId}/pdf`, {
      responseType: "blob",
    });
    return res.data;
  },

  // POST /api/roadmap-upgraded/{id}/regenerate -> RoadmapUpgradedResponseDto
  // Re-generates resources for every module that isn't already 100% complete
  // (progress on those modules resets to 0%). Always requests all four
  // content source types (contentSources isn't persisted on the syllabus, so
  // there's nothing role/user-specific to replay here).
  async regenerateRemainingModules(id) {
    const res = await http.post(`/${id}/regenerate`);
    return res.data;
  },

  // POST /api/roadmap-upgraded/{id}/clone -> RoadmapUpgradedResponseDto (201)
  // Deep-copies the roadmap's modules + resources under the CALLER as the new
  // owner, with all progress reset (only module 0 unlocked). Used for
  // "clone as batch template" (trainer) and similar reuse flows.
  async cloneAsTemplate(id) {
    const res = await http.post(`/${id}/clone`);
    return res.data;
  },

  // GET /api/roadmap-upgraded/admin/stats -> RoadmapUpgradedAdminStatsDto
  // ADMIN/TENANT_ADMIN only (403 otherwise). Scoped to the caller's own
  // organizationId (400 if the admin's token has no organizationId claim).
  async getAdminStats() {
    const res = await http.get("/admin/stats");
    return res.data;
  },

  // GET /api/roadmap-upgraded/super-admin/stats -> RoadmapUpgradedSuperAdminStatsDto
  // SUPER_ADMIN only (403 otherwise). Cross-org: totals, a per-org
  // breakdown (each shaped like an AdminStatsDto), plus null-org (unassigned)
  // students/trainers and a platform-wide top-users list.
  async getSuperAdminStats() {
    const res = await http.get("/super-admin/stats");
    return res.data;
  },

  // POST /api/roadmap-upgraded/mentor/ask -> RoadmapUpgradedMentorResponseDto
  // request: { syllabusId: number, message: string }
  // response: { reply: string, suggestedFollowUps: string[] }
  // Requires the same access as getRoadmapById (owner / same-org admin / super-admin).
  async askMentor(syllabusId, message) {
    const body = { syllabusId, message };
    const res = await http.post("/mentor/ask", body);
    return res.data;
  },

  // GET /api/roadmap-upgraded/mentor/{syllabusId}/history -> RoadmapUpgradedMentorMessageDto[]
  // Full chat history for this roadmap, oldest first: [{ id, sender: "USER"|"MENTOR", messageText, sentAt }]
  async getMentorHistory(syllabusId) {
    const res = await http.get(`/mentor/${syllabusId}/history`);
    return res.data;
  },

  // GET /api/roadmap-upgraded/{id}/export-pdf -> raw PDF bytes (application/pdf)
  // Whole-roadmap export (every module/topic/resource + completion state)
  // as ONE PDF - separate from getResourcePdfBlob above, which only ever
  // covers a single resource's own generated PDF. Fetched as a Blob so the
  // caller can trigger a real file download (unlike PdfModal, this one IS
  // meant to be saved/downloaded, not viewed inline).
  async exportRoadmapPdfBlob(id) {
    const res = await http.get(`/${id}/export-pdf`, {
      responseType: "blob",
    });
    return res.data;
  },
};

export default roadmapService;
