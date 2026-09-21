// ---------------------------------------------------------------------------
// auditService.js
// ---------------------------------------------------------------------------
// API layer for the "Audit & Monitoring" section of the ILM ORA Super Admin.
//
// Backend controller: AuditController -> @RequestMapping("/api/audit")
// Routes through API Gateway at port 9000 (same as all other services).
// Auth: reads Authorization header — backend extracts JWT via JwtUtil,
// same pattern as every other controller in this project.
//
// Every method returns the raw response data (res.data) on success,
// or rejects with an axios error whose err.message is rewritten to
// err.response.data.message (same interceptor pattern as roadmapService.js).
//
// Usage in any component:
//   import auditService from "../../../services/auditService";
//   const data = await auditService.searchLogs({ service: "auth-service" });
// ---------------------------------------------------------------------------

import axios from "axios";

// ── Base config (same convention as roadmapService.js) ────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// AuditController root → /api/audit
const AUDIT_BASE = `${API_BASE_URL}/audit`;

function authHeader() {
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("lms_token")
      : null;
  return { Authorization: `Bearer ${token || ""}` };
}

const http = axios.create({ baseURL: AUDIT_BASE });

http.interceptors.request.use((config) => {
  config.headers = { ...(config.headers || {}), ...authHeader() };
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err?.response?.data;
    if (data && typeof data === "object" && typeof data.message === "string") {
      err.message = data.message;
    }
    return Promise.reject(err);
  },
);

// ===========================================================================
//  CONSTANTS  (mirror the backend enums / string literals)
// ===========================================================================

// AuditResult enum
export const AUDIT_RESULT = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  PARTIAL: "PARTIAL",
};

// ActorType enum
export const ACTOR_TYPE = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
  SYSTEM: "SYSTEM",
};

// All LMS service names (matches spring.application.name in each service)
export const LMS_SERVICES = [
  "auth-service",
  "payment-service",
  "course-service",
  "batch-service",
  "assessment",
  "attendance-service",
  "file-service",
  "live-session-service",
  "video-service",
  "audit-service",
  "notification-service",
  "chat-service",
  "user-service",
  "api-gateway",
];

// All audit action constants (SCREAMING_SNAKE_CASE, matches backend)
export const AUDIT_ACTIONS = [
  "USER_LOGIN",
  "USER_LOGOUT",
  "USER_REGISTERED",
  "USER_PROFILE_UPDATED",
  "USER_ROLE_CHANGED",
  "PASSWORD_CHANGED",
  "COURSE_CREATED",
  "COURSE_UPDATED",
  "COURSE_DELETED",
  "COURSE_PUBLISHED",
  "BATCH_CREATED",
  "BATCH_UPDATED",
  "BATCH_STUDENT_ADDED",
  "BATCH_STUDENT_REMOVED",
  "PAYMENT_INITIATED",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "PAYMENT_REFUNDED",
  "ASSESSMENT_CREATED",
  "ASSESSMENT_SUBMITTED",
  "ASSESSMENT_GRADED",
  "ATTENDANCE_MARKED",
  "ATTENDANCE_UPDATED",
  "FILE_UPLOADED",
  "FILE_DELETED",
  "LIVE_SESSION_STARTED",
  "LIVE_SESSION_ENDED",
  "LIVE_SESSION_JOINED",
  "VIDEO_UPLOADED",
  "VIDEO_PROCESSED",
  "VIDEO_TRANSCRIBED",
  "NOTIFICATION_SENT",
  "PROGRESS_UPDATED",
];

// Alert thresholds — used by AlertsPage to decide when to show alerts
export const ALERT_THRESHOLDS = {
  paymentFailuresPerHour: 20,
  loginFailuresPer10Min: 30,
  kafkaLagMessages: 500,
  serviceResponseTimeMs: 1000,
};

// Service registry — port per service (for /actuator/health direct calls)
// All go through api-gateway in production; these are direct ports for dev.
export const SERVICE_REGISTRY = [
  { name: "auth-service", port: 8081 },
  { name: "user-service", port: 8082 },
  { name: "course-service", port: 8083 },
  { name: "video-service", port: 8084 },
  { name: "notification-service", port: 8085 },
  { name: "assessment", port: 8087 }, // gateway: services.assessment
  { name: "attendance-service", port: 8094 },
  { name: "file-service", port: 8092 },
  { name: "batch-service", port: 8095 },
  { name: "chat-service", port: 8096 },
  { name: "live-session-service", port: 8097 },
  { name: "payment-service", port: 8091 },
  { name: "audit-service", port: 8098 },
  { name: "api-gateway", port: 9000 },
];
// ===========================================================================
//  API METHODS — one method per controller endpoint, same shape, same order
//  as AuditController.java
// ===========================================================================

const auditService = {
  // expose constants on the service object (same pattern as roadmapService)
  AUDIT_RESULT,
  ACTOR_TYPE,
  LMS_SERVICES,
  AUDIT_ACTIONS,
  ALERT_THRESHOLDS,
  SERVICE_REGISTRY,

  // -------------------------------------------------------------------------
  // GET /api/audit/health
  // Returns { success: true, message: "audit-service is running" }
  // Safe to call without auth — used by ServiceHealthPage to ping audit-service.
  // -------------------------------------------------------------------------
  async checkHealth() {
    const res = await http.get("/health");
    return res.data;
  },

  // -------------------------------------------------------------------------
  // POST /api/audit/log
  // REST intake endpoint — for services whose methods do NOT publish a
  // Kafka topic. Those services call this directly.
  // Also used by the Super Admin UI to manually log a test event.
  //
  // body: {
  //   service:      string,   // e.g. "auth-service"
  //   action:       string,   // e.g. "USER_LOGIN"
  //   actorId:      string,   // userId from JWT
  //   actorType:    string,   // STUDENT | INSTRUCTOR | ADMIN | SYSTEM
  //   resourceType: string,   // Course | User | Payment | Batch | Assessment
  //   resourceId:   string,   // ID of the affected record
  //   ipAddress:    string,   // optional
  //   result:       string,   // SUCCESS | FAILURE | PARTIAL
  //   metadata:     object,   // any extra context
  // }
  // Returns ApiResponse<AuditEventDTO>
  // -------------------------------------------------------------------------
  async logEvent(eventDto) {
    const res = await http.post("/log", eventDto);
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/actor/:actorId?page=0&size=15
  // All actions performed by one user.
  // Returns Spring Page<AuditEventDTO>:
  //   { content: [...], totalElements, totalPages, number, size }
  // -------------------------------------------------------------------------
  async getByActor(actorId, page = 0, size = 15) {
    const res = await http.get(`/actor/${encodeURIComponent(actorId)}`, {
      params: { page, size },
    });
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/service/:serviceName?page=0&size=15
  // All events published by one microservice.
  // Used by ServiceHealthPage expanded card to show recent events.
  // -------------------------------------------------------------------------
  async getByService(serviceName, page = 0, size = 15) {
    const res = await http.get(`/service/${encodeURIComponent(serviceName)}`, {
      params: { page, size },
    });
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/action/:action?page=0&size=15
  // All events of one action type (e.g. all USER_LOGIN events).
  // -------------------------------------------------------------------------
  async getByAction(action, page = 0, size = 15) {
    const res = await http.get(`/action/${encodeURIComponent(action)}`, {
      params: { page, size },
    });
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/resource/:resourceType/:resourceId?page=0&size=15
  // All events on a specific resource (e.g. Course/crs_82).
  // -------------------------------------------------------------------------
  async getByResource(resourceType, resourceId, page = 0, size = 15) {
    const res = await http.get(
      `/resource/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      { params: { page, size } },
    );
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/timerange?from=...&to=...&page=0&size=15
  // Events between two ISO 8601 datetime strings.
  // e.g. from="2026-09-20T00:00:00Z"  to="2026-09-20T23:59:59Z"
  // -------------------------------------------------------------------------
  async getByTimeRange(from, to, page = 0, size = 15) {
    const res = await http.get("/timerange", {
      params: { from, to, page, size },
    });
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/actor/:actorId/timerange?from=...&to=...
  // Actor-specific events in a date range — compliance queries.
  // -------------------------------------------------------------------------
  async getByActorAndTimeRange(actorId, from, to, page = 0, size = 15) {
    const res = await http.get(
      `/actor/${encodeURIComponent(actorId)}/timerange`,
      { params: { from, to, page, size } },
    );
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/failures?service=...&page=0&size=15
  // All FAILURE events, optionally filtered by service.
  // AlertsPage uses this when "View Logs" is clicked for a failure alert.
  // -------------------------------------------------------------------------
  async getFailures(service = null, page = 0, size = 15) {
    const res = await http.get("/failures", {
      params: {
        ...(service ? { service } : {}),
        page,
        size,
      },
    });
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/failures/count?service=...
  // Count of FAILURE events for one service.
  // AlertsPage polls this every 60s to detect threshold breaches.
  // Returns ApiResponse<Long> — the count is in res.data.data
  // -------------------------------------------------------------------------
  async countFailuresByService(service) {
    const res = await http.get("/failures/count", {
      params: { service },
    });
    return res.data;
  },

  // -------------------------------------------------------------------------
  // GET /api/audit/search?actorId=&service=&action=&resourceType=&resourceId=
  //                       &result=&from=&to=&page=0&size=15
  //
  // Dynamic multi-filter search — the main endpoint for AuditLogsPage.
  // All params are optional; backend JPQL ignores null values.
  // Returns Spring Page<AuditEventDTO>:
  //   { content: [...], totalElements, totalPages, number, size }
  //
  // filters shape:
  // {
  //   actorId:      string | null,
  //   service:      string | null,   // e.g. "auth-service"
  //   action:       string | null,   // e.g. "USER_LOGIN"
  //   resourceType: string | null,
  //   resourceId:   string | null,
  //   result:       string | null,   // "SUCCESS" | "FAILURE" | "PARTIAL"
  //   from:         string | null,   // ISO 8601
  //   to:           string | null,   // ISO 8601
  //   page:         number,          // 0-indexed
  //   size:         number,          // default 15, max 100
  // }
  // -------------------------------------------------------------------------
  async searchLogs(filters = {}) {
    const {
      actorId = null,
      service = null,
      action = null,
      resourceType = null,
      resourceId = null,
      result = null,
      from = null,
      to = null,
      page = 0,
      size = 15,
    } = filters;

    // Strip null/empty params so the URL stays clean
    const params = {};
    if (actorId) params.actorId = actorId;
    if (service) params.service = service;
    if (action) params.action = action;
    if (resourceType) params.resourceType = resourceType;
    if (resourceId) params.resourceId = resourceId;
    if (result) params.result = result;
    if (from) params.from = from;
    if (to) params.to = to;
    params.page = page;
    params.size = size;

    const res = await http.get("/search", { params });
    return res.data;
  },

  // -------------------------------------------------------------------------
  // getDashboardStats()
  // NOT a single backend endpoint — fires 4 parallel searchLogs() calls
  // to build the numbers needed by AuditOverviewPage stat cards.
  //
  // Returns:
  // {
  //   totalEvents:    number,   // all events today
  //   totalFailures:  number,   // FAILURE events today
  //   eventsThisHour: number,   // events in last 60 minutes
  //   recentEvents:   array,    // last 5 events (for Recent Critical Events table)
  // }
  // -------------------------------------------------------------------------
  async getDashboardStats() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();
    const endOfDay = now.toISOString();

    const [allToday, failuresToday, thisHour, recent] = await Promise.all([
      auditService.searchLogs({
        from: startOfDay,
        to: endOfDay,
        page: 0,
        size: 1,
      }),
      auditService.searchLogs({
        result: "FAILURE",
        from: startOfDay,
        to: endOfDay,
        page: 0,
        size: 1,
      }),
      auditService.searchLogs({
        from: oneHourAgo,
        to: endOfDay,
        page: 0,
        size: 1,
      }),
      auditService.searchLogs({ page: 0, size: 5 }),
    ]);

    // Each response is ApiResponse<Page<...>> → .data is the Page object
    return {
      totalEvents: allToday?.data?.totalElements ?? 0,
      totalFailures: failuresToday?.data?.totalElements ?? 0,
      eventsThisHour: thisHour?.data?.totalElements ?? 0,
      recentEvents: recent?.data?.content ?? [],
    };
  },

  // -------------------------------------------------------------------------
  // pollAlertCounts()
  // NOT a backend endpoint — polls countFailuresByService for critical
  // services and returns breached/not-breached status.
  // AlertsPage calls this on mount and every 60 seconds.
  //
  // Returns array of:
  // { service: string, failureCount: number, threshold: number, breached: boolean }
  // -------------------------------------------------------------------------
  async pollAlertCounts() {
    const targets = [
      {
        service: "payment-service",
        threshold: ALERT_THRESHOLDS.paymentFailuresPerHour,
      },
      {
        service: "auth-service",
        threshold: ALERT_THRESHOLDS.loginFailuresPer10Min,
      },
    ];

    const results = await Promise.all(
      targets.map(async ({ service, threshold }) => {
        try {
          const res = await auditService.countFailuresByService(service);
          // ApiResponse<Long> shape: { success, message, data: <count>, timestamp }
          const count = res?.data ?? 0;
          return {
            service,
            failureCount: count,
            threshold,
            breached: count > threshold,
          };
        } catch {
          return { service, failureCount: 0, threshold, breached: false };
        }
      }),
    );

    return results;
  },

  // -------------------------------------------------------------------------
  // checkServiceHealth(service)
  // Calls /actuator/health directly on each service (bypasses api-gateway).
  // Times the request to measure response latency.
  //
  // @param {{ name: string, port: number }} service
  // Returns:
  // { name, port, status: "UP"|"DEGRADED"|"DOWN", responseTimeMs, details, error }
  // -------------------------------------------------------------------------
  async checkServiceHealth(service) {
    const start = performance.now();
    const token = localStorage.getItem("lms_token") || "";
    const url = `http://localhost:${service.port}/actuator/health`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
      });
      const responseTimeMs = Math.round(performance.now() - start);
      const body = await res.json().catch(() => ({}));
      const status =
        body.status === "UP"
          ? "UP"
          : body.status === "DOWN"
            ? "DOWN"
            : "DEGRADED";

      return {
        name: service.name,
        port: service.port,
        status,
        responseTimeMs,
        details: body,
        error: null,
      };
    } catch (err) {
      return {
        name: service.name,
        port: service.port,
        status: "DOWN",
        responseTimeMs: Math.round(performance.now() - start),
        details: {},
        error: err.message,
      };
    }
  },

  // -------------------------------------------------------------------------
  // checkAllServicesHealth()
  // Checks all 14 LMS services in parallel.
  // Returns array of health result objects (same shape as checkServiceHealth).
  // -------------------------------------------------------------------------
  async checkAllServicesHealth() {
    return Promise.all(
      SERVICE_REGISTRY.map((svc) => auditService.checkServiceHealth(svc)),
    );
  },

  // -------------------------------------------------------------------------
  // exportToCsv(filters, onProgress?)
  // Fetches all pages of the current search in parallel (100 rows/page),
  // builds a CSV string, and triggers a browser file download.
  // Never triggers a new tab or navigation.
  //
  // @param {Object}   filters    — same shape as searchLogs filters
  // @param {Function} onProgress — optional (fetched, total) => void
  // -------------------------------------------------------------------------
  async exportToCsv(filters = {}, onProgress = null) {
    const PAGE_SIZE = 100;

    // Page 0 to get totalElements + totalPages
    const first = await auditService.searchLogs({
      ...filters,
      page: 0,
      size: PAGE_SIZE,
    });
    const page0 = first?.data;
    if (!page0) throw new Error("Could not fetch audit logs for export");

    const totalElements = page0.totalElements || 0;
    const totalPages = page0.totalPages || 1;
    let allRows = [...(page0.content || [])];

    if (onProgress) onProgress(allRows.length, totalElements);

    // Fetch remaining pages in parallel
    if (totalPages > 1) {
      const restPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          auditService.searchLogs({ ...filters, page: i + 1, size: PAGE_SIZE }),
        ),
      );
      for (const pg of restPages) {
        if (pg?.data?.content) {
          allRows = [...allRows, ...pg.data.content];
          if (onProgress) onProgress(allRows.length, totalElements);
        }
      }
    }

    // Build CSV
    const HEADERS = [
      "Event ID",
      "Timestamp",
      "Service",
      "Action",
      "Actor ID",
      "Actor Type",
      "Resource Type",
      "Resource ID",
      "IP Address",
      "Result",
      "Metadata",
    ];

    const esc = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };

    const csvContent = [
      HEADERS.join(","),
      ...allRows.map((r) =>
        [
          r.eventId,
          r.timestamp,
          r.service,
          r.action,
          r.actorId,
          r.actorType,
          r.resourceType,
          r.resourceId,
          r.ipAddress,
          r.result,
          r.metadata ? JSON.stringify(r.metadata) : "",
        ]
          .map(esc)
          .join(","),
      ),
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    return { exported: allRows.length };
  },
};

export default auditService;
