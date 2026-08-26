// ---------------------------------------------------------------------------
// roadmapService.js
// ---------------------------------------------------------------------------
// API layer for the Roadmap feature of the LMS `progress-service` backend.
//
// Backend controller: RoadmapController  ->  @RequestMapping("/api/progress/roadmaps")
// Auth: every call is authenticated with a JWT Bearer token. The backend derives
//       role / userId / orgId from the token itself (resolveCaller()), so the
//       client never sends email / userId / orgId for the roadmap endpoints
//       (unlike the older progressService methods).
//
// This module is intentionally self-contained and follows the exact same
// conventions as your existing `progressService` (same base URL + same
// Authorization header read from localStorage["lms_token"]). You can either
// import it directly, or copy its methods into progressService.js.
//
// It also exports the enum / status / graph mapping helpers that the roadmap
// components and pages rely on to translate between the React-Flow UI shape
// and the backend DTO shape.
// ---------------------------------------------------------------------------

import axios from "axios";

// --- Base config (mirrors progressService) --------------------------------
const API_BASE_URL =
  // (typeof import.meta !== "undefined" &&
  //   import.meta.env &&
  //   import.meta.env.VITE_API_BASE_URL) ||
  // "http://localhost:9000/api";
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// Roadmap controller root.
const ROADMAPS = `${API_BASE_URL}/progress/roadmaps`;

function authHeader() {
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("lms_token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// A single pre-configured axios instance keeps the Authorization header fresh
// on every request (interceptor re-reads the token so login/logout mid-session
// is picked up automatically).
const http = axios.create({ baseURL: ROADMAPS });
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
//  ENUM / STATUS MAPPERS
//  UI (lowercase, react-flow friendly)  <->  Backend (UPPERCASE enums)
// ===========================================================================

// --- NodeStatus:  NOT_STARTED | IN_PROGRESS | DONE | SKIPPED ---------------
// The RoadmapView page also uses an internal vocabulary (locked / available /
// in-progress / completed) for lock derivation, so we accept those spellings
// too and normalise them here.
export function toApiStatus(uiStatus) {
  switch (String(uiStatus || "").toLowerCase()) {
    case "done":
    case "completed":
      return "DONE";
    case "in_progress":
    case "in-progress":
    case "inprogress":
      return "IN_PROGRESS";
    case "skipped":
      return "SKIPPED";
    case "not_started":
    case "available":
    case "locked":
    default:
      return "NOT_STARTED";
  }
}

export function toUiStatus(apiStatus) {
  switch (String(apiStatus || "").toUpperCase()) {
    case "DONE":
      return "done";
    case "IN_PROGRESS":
      return "in_progress";
    case "SKIPPED":
      return "skipped";
    case "NOT_STARTED":
    default:
      return "not_started";
  }
}

// --- NodeType:  TOPIC | SUBTOPIC | MILESTONE -------------------------------
// The trainer editor UI offers topic / subtopic / task / resource / milestone,
// but the backend enum only has TOPIC / SUBTOPIC / MILESTONE. "task" and
// "resource" are therefore stored as SUBTOPIC (lossy — on reload they read
// back as "subtopic"). If you need to preserve the finer UI subtype you'd have
// to add a column to the backend node model.
export function toApiNodeType(uiType) {
  switch (String(uiType || "").toLowerCase()) {
    case "milestone":
      return "MILESTONE";
    case "topic":
      return "TOPIC";
    case "subtopic":
    case "task":
    case "resource":
      return "SUBTOPIC";
    default:
      return "TOPIC";
  }
}

export function toUiNodeType(apiType) {
  switch (String(apiType || "").toUpperCase()) {
    case "MILESTONE":
      return "milestone";
    case "SUBTOPIC":
      return "subtopic";
    case "TOPIC":
    default:
      return "topic";
  }
}

// --- ResourceType: ARTICLE | VIDEO | COURSE | BOOK | DOCUMENTATION | TOOL ---
export function toApiResourceType(uiType) {
  switch (String(uiType || "").toLowerCase()) {
    case "video":
      return "VIDEO";
    case "course":
      return "COURSE";
    case "book":
      return "BOOK";
    case "doc":
    case "documentation":
      return "DOCUMENTATION";
    case "tool":
      return "TOOL";
    case "article":
    default:
      return "ARTICLE";
  }
}

export function toUiResourceType(apiType) {
  switch (String(apiType || "").toUpperCase()) {
    case "VIDEO":
      return "video";
    case "COURSE":
      return "course";
    case "BOOK":
      return "book";
    case "DOCUMENTATION":
      return "doc";
    case "TOOL":
      return "tool";
    case "ARTICLE":
    default:
      return "article";
  }
}

// ===========================================================================
//  TOKEN HELPERS
//  The roadmap endpoints derive identity from the JWT, but a few org-admin
//  writes (createCustomRoadmap / cloneTemplate) still need orgId in the BODY.
//  These helpers read it from the stored token so the UI doesn't have to.
// ===========================================================================

export function decodeJwt(token) {
  try {
    const raw =
      token ||
      (typeof localStorage !== "undefined"
        ? localStorage.getItem("lms_token")
        : null);
    if (!raw) return null;
    const payload = raw.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Best-effort orgId extraction. Tries the common claim names, then falls back
// to an explicit VITE_DEFAULT_ORG_ID (or a value stashed in localStorage).
// NOTE: organization IDs are opaque strings (UUIDs), so this returns the claim
// AS-IS. Do NOT wrap in Number() — Number("some-uuid") is NaN, which serializes
// to null in a JSON body and silently drops the org (this broke clone/create).
export function getOrgIdFromToken(token) {
  const claims = decodeJwt(token) || {};
  const fromClaim =
    claims.orgId ??
    claims.org_id ??
    claims.organizationId ??
    claims.organisationId ??
    claims.tenantId ??
    claims.tenant_id ??
    null;
  if (fromClaim != null && String(fromClaim).trim() !== "")
    return String(fromClaim);

  const ls =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("lms_org_id")
      : null;
  if (ls != null && ls !== "") return String(ls);

  const env =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_DEFAULT_ORG_ID;
  return env != null && env !== "" ? String(env) : null;
}

// ===========================================================================
//  GRAPH TRANSFORMS
//  Backend graph DTO  <->  React-Flow { nodes, edges }
// ===========================================================================

// Map a backend resource (OrgResourceResponse) to the UI shape used by
// ResourceDrawer. NOTE the boolean JSON key from the backend is "featured"
// (Jackson serialises the isFeatured() getter as "featured").
export function mapResourceToUi(r) {
  if (!r) return null;
  return {
    id: r.id,
    backendId: r.id,
    nodeId: r.nodeId,
    type: toUiResourceType(r.type),
    title: r.title,
    url: r.url,
    description: r.description || "",
    durationMinutes: r.durationMinutes ?? null,
    difficulty: r.difficulty || null,
    upvotes: r.upvotes ?? 0,
    isFeatured: r.featured ?? false, // backend JSON key = "featured"
    addedBy: r.addedBy ?? null,
    createdAt: r.createdAt ?? null,
  };
}

// Convert either a student RoadmapGraphResponse or a trainer
// OrgRoadmapGraphResponse into the React-Flow shape the RoadmapCanvas expects.
//   - Student graph nodes carry `progressStatus` (per-user status).
//   - Trainer graph nodes do not, so status falls back to "not_started".
// Boolean JSON keys coming FROM the backend responses are: "optional",
// "hasQuiz", "hasProject" (see GraphNodeResponse / OrgNodeResponse).
export function backendGraphToFlow(graph) {
  if (!graph) return { nodes: [], edges: [] };

  const nodes = (graph.nodes || []).map((n) => {
    const parents = (n.parentNodeIds || []).map((id) => String(id));
    return {
      id: String(n.id),
      type: "roadmapNode",
      position: { x: n.positionX ?? 0, y: n.positionY ?? 0 },
      data: {
        title: n.title,
        description: n.description || "",
        nodeType: toUiNodeType(n.type),
        status: toUiStatus(n.progressStatus), // "not_started" for trainer graphs
        estimatedHours: n.estimatedHours ?? null,
        orderIndex: n.orderIndex ?? null,
        isOptional: n.optional ?? false, // backend JSON key = "optional"
        hasQuiz: n.hasQuiz ?? false,
        hasProject: n.hasProject ?? false,
        prerequisites: parents,
        hasPrerequisites: parents.length > 0,
        resources: (n.resources || []).map(mapResourceToUi),
        // keep the raw backend id (Long) for write-back calls
        backendId: n.id,
        sourceNodeId: n.sourceNodeId ?? null,
        progressCompletedAt: n.progressCompletedAt ?? null,
        progressLastAccessedAt: n.progressLastAccessedAt ?? null,
      },
    };
  });

  const edges = (graph.edges || []).map((e) => ({
    id: `e-${e.fromNodeId}-${e.toNodeId}`,
    source: String(e.fromNodeId),
    target: String(e.toNodeId),
  }));

  return { nodes, edges };
}

// Given a react-flow node id and the current edge list, collect the backend
// (Long) ids of its parents. Edges are parent -> child (source -> target), so a
// node's parents are the `source` of every edge whose `target` is this node.
// Only numeric (already-persisted) ids are included; temp/client ids are skipped.
export function parentIdsFromEdges(flowNodeId, edges) {
  return (edges || [])
    .filter((e) => String(e.target) === String(flowNodeId))
    .map((e) => Number(e.source))
    .filter((id) => Number.isFinite(id));
}

// Build a CreateOrgNodeRequest body from a react-flow node.
// IMPORTANT: create uses the JSON key "optional" (primitive boolean getter
// isOptional() -> Jackson property "optional").
export function flowNodeToCreateRequest(flowNode, orgRoadmapId, edges) {
  const d = flowNode.data || {};
  return {
    orgRoadmapId,
    sourceNodeId: d.sourceNodeId ?? null,
    title: d.title || "Untitled node",
    description: d.description || null,
    type: toApiNodeType(d.nodeType),
    positionX: flowNode.position?.x ?? 0,
    positionY: flowNode.position?.y ?? 0,
    optional: !!d.isOptional, // <-- create key
    estimatedHours: d.estimatedHours ?? null,
    orderIndex: d.orderIndex ?? null,
    hasQuiz: !!d.hasQuiz,
    hasProject: !!d.hasProject,
    parentNodeIds: parentIdsFromEdges(flowNode.id, edges),
  };
}

// Build an UpdateOrgNodeRequest body from a react-flow node.
// IMPORTANT: update uses the JSON key "isOptional" (Boolean getter
// getIsOptional() -> Jackson property "isOptional"). All fields are nullable /
// partial; pass only what you want to change.
export function flowNodeToUpdateRequest(flowNode, edges) {
  const d = flowNode.data || {};
  return {
    title: d.title,
    description: d.description ?? null,
    type: toApiNodeType(d.nodeType),
    positionX: flowNode.position?.x,
    positionY: flowNode.position?.y,
    isOptional: !!d.isOptional, // <-- update key (differs from create!)
    estimatedHours: d.estimatedHours ?? null,
    orderIndex: d.orderIndex ?? null,
    hasQuiz: !!d.hasQuiz,
    hasProject: !!d.hasProject,
    parentNodeIds: parentIdsFromEdges(flowNode.id, edges),
  };
}

// Lightweight position-only update, e.g. after a drag on the canvas.
export function flowNodePositionUpdate(flowNode) {
  return {
    positionX: flowNode.position?.x ?? 0,
    positionY: flowNode.position?.y ?? 0,
  };
}

// ===========================================================================
//  API METHODS
// ===========================================================================

const roadmapService = {
  // expose mappers on the service object too, for convenience
  toApiStatus,
  toUiStatus,
  toApiNodeType,
  toUiNodeType,
  toApiResourceType,
  toUiResourceType,
  backendGraphToFlow,
  mapResourceToUi,
  flowNodeToCreateRequest,
  flowNodeToUpdateRequest,
  flowNodePositionUpdate,
  parentIdsFromEdges,
  decodeJwt,
  getOrgIdFromToken,

  // -------------------------------------------------------------------------
  //  STUDENT  (identity from JWT; scoped to caller.orgId)
  // -------------------------------------------------------------------------

  // GET /  -> PagedResponse<RoadmapListItemResponse>
  // Published roadmaps in the student's org. (No completion field here — merge
  // with getStudentDashboard() for completion %.)
  async listRoadmaps({ page = 0, size = 50 } = {}) {
    const res = await http.get("", { params: { page, size } });
    return res.data;
  },

  // GET /dashboard -> StudentDashboardResponse
  // { userId, orgId, enrolledRoadmaps:[EnrolledRoadmapSummary], totalEnrolled,
  //   averageCompletionPercent }
  async getStudentDashboard() {
    const res = await http.get("/dashboard");
    return res.data;
  },

  // GET /{slug} -> RoadmapGraphResponse (nodes carry this student's progressStatus)
  async getRoadmapGraph(slug) {
    const res = await http.get(`/${encodeURIComponent(slug)}`);
    return res.data;
  },

  // GET /{slug}/progress -> List<NodeProgressResponse>
  async getRoadmapProgress(slug) {
    const res = await http.get(`/${encodeURIComponent(slug)}/progress`);
    return res.data;
  },

  // PUT /{slug}/nodes/{nodeId}/progress -> NodeProgressResponse
  // status may be a UI value ("done") or a backend value ("DONE"); it's normalised.
  async updateNodeProgress(
    slug,
    nodeId,
    {
      status,
      additionalTimeSpentMinutes = null,
      incrementResourceClick = null,
    } = {},
  ) {
    const body = {
      nodeId: Number(nodeId),
      status: toApiStatus(status),
      additionalTimeSpentMinutes,
      incrementResourceClick,
    };
    const res = await http.put(
      `/${encodeURIComponent(slug)}/nodes/${nodeId}/progress`,
      body,
    );
    return res.data;
  },

  // PUT /{slug}/progress/batch -> BatchUpdateProgressResponse
  // updates: [{ nodeId, status }]  (status normalised to backend enum)
  async batchUpdateProgress(slug, orgRoadmapId, updates = []) {
    const body = {
      orgRoadmapId: Number(orgRoadmapId),
      updates: updates.map((u) => ({
        nodeId: Number(u.nodeId),
        status: toApiStatus(u.status),
      })),
    };
    const res = await http.put(
      `/${encodeURIComponent(slug)}/progress/batch`,
      body,
    );
    return res.data;
  },

  // -------------------------------------------------------------------------
  //  TRAINER / OWNER  (must own the roadmap: createdBy == caller userId)
  // -------------------------------------------------------------------------

  // GET /org/mine -> PagedResponse<OrgRoadmapResponse>  (roadmaps I created)
  async listMyRoadmaps({ page = 0, size = 50 } = {}) {
    const res = await http.get("/org/mine", { params: { page, size } });
    return res.data;
  },

  // GET /org/{id} -> OrgRoadmapResponse (metadata incl. "published"/"archived")
  async getOrgRoadmap(id) {
    const res = await http.get(`/org/${id}`);
    return res.data;
  },

  // GET /org/{id}/graph -> OrgRoadmapGraphResponse (editing view, no per-user status)
  async getOrgRoadmapGraph(id) {
    const res = await http.get(`/org/${id}/graph`);
    return res.data;
  },

  // POST /org/{id}/nodes -> OrgNodeResponse (201)
  // Pass a body built with flowNodeToCreateRequest(), or a raw CreateOrgNodeRequest.
  async createNode(id, createOrgNodeRequest) {
    const res = await http.post(`/org/${id}/nodes`, createOrgNodeRequest);
    return res.data;
  },

  // PUT /org/{id}/nodes/{nodeId} -> OrgNodeResponse
  async updateNode(id, nodeId, updateOrgNodeRequest) {
    const res = await http.put(
      `/org/${id}/nodes/${nodeId}`,
      updateOrgNodeRequest,
    );
    return res.data;
  },

  // DELETE /org/{id}/nodes/{nodeId} -> 204
  async deleteNode(id, nodeId) {
    await http.delete(`/org/${id}/nodes/${nodeId}`);
    return true;
  },

  // POST /org/{id}/nodes/{nodeId}/resources -> OrgResourceResponse (201)
  // resource: { type, title, url, description, durationMinutes, difficulty }
  // (type may be UI ("doc") or backend ("DOCUMENTATION"); it's normalised.)
  async addResource(id, nodeId, resource) {
    const body = {
      nodeId: Number(nodeId),
      type: toApiResourceType(resource.type),
      title: resource.title,
      url: resource.url,
      description: resource.description ?? null,
      durationMinutes: resource.durationMinutes ?? null,
      difficulty: resource.difficulty ?? null,
    };
    const res = await http.post(`/org/${id}/nodes/${nodeId}/resources`, body);
    return res.data;
  },

  // PUT /org/{id}/resources/{resourceId} -> OrgResourceResponse
  // Update uses the JSON key "isFeatured" (getIsFeatured()).
  async updateResource(id, resourceId, resource) {
    const body = {
      type: resource.type != null ? toApiResourceType(resource.type) : null,
      title: resource.title ?? null,
      url: resource.url ?? null,
      description: resource.description ?? null,
      durationMinutes: resource.durationMinutes ?? null,
      difficulty: resource.difficulty ?? null,
      isFeatured: resource.isFeatured ?? null, // <-- update key
    };
    const res = await http.put(`/org/${id}/resources/${resourceId}`, body);
    return res.data;
  },

  // DELETE /org/{id}/resources/{resourceId} -> 204
  async deleteResource(id, resourceId) {
    await http.delete(`/org/${id}/resources/${resourceId}`);
    return true;
  },

  // GET /org/{id}/students-progress -> PagedResponse<StudentProgressSummaryResponse>
  // NOTE: summaries only (studentId, studentName, completionPercent, lastActiveAt).
  // There is NO backend endpoint for another student's per-node progress.
  async getStudentsProgress(id, { page = 0, size = 100 } = {}) {
    const res = await http.get(`/org/${id}/students-progress`, {
      params: { page, size },
    });
    return res.data;
  },

  // GET /org/{id}/analytics -> RoadmapAnalyticsResponse (org-admin / super-admin)
  async getAnalytics(id) {
    const res = await http.get(`/org/${id}/analytics`);
    return res.data;
  },

  // -------------------------------------------------------------------------
  //  ORG ADMIN / SUPER ADMIN  (roadmap lifecycle)
  //  NOTE: authorizeOrgRoadmapAccess() allows only SUPER_ADMIN and a matching
  //  ORG_ADMIN. A pure TRAINER role gets 403 FORBIDDEN_ROLE on create / clone /
  //  update / publish / unpublish / analytics / org-list. See header notes.
  // -------------------------------------------------------------------------

  // POST /org/custom -> OrgRoadmapResponse (201). Server auto-generates the slug
  // (any client slug is ignored).
  async createCustomRoadmap({
    orgId,
    title,
    description = null,
    category = null,
    thumbnailUrl = null,
  }) {
    const body = { orgId, title, description, category, thumbnailUrl };
    const res = await http.post("/org/custom", body);
    return res.data;
  },

  // POST /org/clone/{templateId} -> OrgRoadmapResponse (201)
  async cloneTemplate(
    templateId,
    {
      orgId,
      title = null,
      description = null,
      category = null,
      thumbnailUrl = null,
    } = {},
  ) {
    const body = {
      sourceTemplateId: templateId,
      orgId,
      title,
      description,
      category,
      thumbnailUrl,
    };
    const res = await http.post(`/org/clone/${templateId}`, body);
    return res.data;
  },

  // PUT /org/{id} -> OrgRoadmapResponse. Booleans use keys isPublished/isArchived.
  async updateOrgRoadmap(id, patch = {}) {
    const body = {
      title: patch.title ?? null,
      description: patch.description ?? null,
      category: patch.category ?? null,
      thumbnailUrl: patch.thumbnailUrl ?? null,
      isPublished: patch.isPublished ?? null,
      isArchived: patch.isArchived ?? null,
    };
    const res = await http.put(`/org/${id}`, body);
    return res.data;
  },

  // POST /org/{id}/publish -> OrgRoadmapResponse
  async publishRoadmap(id) {
    const res = await http.post(`/org/${id}/publish`);
    return res.data;
  },

  // POST /org/{id}/unpublish -> OrgRoadmapResponse
  async unpublishRoadmap(id) {
    const res = await http.post(`/org/${id}/unpublish`);
    return res.data;
  },

  // GET /org?orgId=(optional) -> PagedResponse<RoadmapListItemResponse>
  // TRAINER / STUDENT are rejected by the controller.
  async listOrgRoadmaps({ orgId = null, page = 0, size = 50 } = {}) {
    const params = { page, size };
    if (orgId != null) params.orgId = orgId;
    const res = await http.get("/org", { params });
    return res.data;
  },

  // -------------------------------------------------------------------------
  //  SUPER ADMIN — global templates (included for completeness)
  // -------------------------------------------------------------------------

  async createTemplate(createTemplateRequest) {
    const res = await http.post("/admin/templates", createTemplateRequest);
    return res.data;
  },
  async listTemplates({ page = 0, size = 50 } = {}) {
    const res = await http.get("/admin/templates", { params: { page, size } });
    return res.data;
  },
  async getTemplate(id) {
    const res = await http.get(`/admin/templates/${id}`);
    return res.data;
  },
  async updateTemplate(id, updateTemplateRequest) {
    const res = await http.put(`/admin/templates/${id}`, updateTemplateRequest);
    return res.data;
  },
  async getTemplateGraph(id) {
    const res = await http.get(`/admin/templates/${id}/graph`);
    return res.data;
  },
  async publishTemplate(templateId) {
    const res = await http.post(`/admin/templates/${templateId}/publish`);
    return res.data;
  },
  async createTemplateNode(templateId, createTemplateNodeRequest) {
    const res = await http.post(
      `/admin/templates/${templateId}/nodes`,
      createTemplateNodeRequest,
    );
    return res.data;
  },
  async updateTemplateNode(nodeId, updateTemplateNodeRequest) {
    const res = await http.put(
      `/admin/templates/nodes/${nodeId}`,
      updateTemplateNodeRequest,
    );
    return res.data;
  },
  async deleteTemplateNode(nodeId) {
    await http.delete(`/admin/templates/nodes/${nodeId}`);
    return true;
  },
  async addTemplateResource(nodeId, createTemplateResourceRequest) {
    const res = await http.post(
      `/admin/templates/nodes/${nodeId}/resources`,
      createTemplateResourceRequest,
    );
    return res.data;
  },
  async updateTemplateResource(resourceId, updateTemplateResourceRequest) {
    const res = await http.put(
      `/admin/templates/resources/${resourceId}`,
      updateTemplateResourceRequest,
    );
    return res.data;
  },
  async deleteTemplateResource(resourceId) {
    await http.delete(`/admin/templates/resources/${resourceId}`);
    return true;
  },
};

export default roadmapService;
