import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNodesState, useEdgesState, addEdge } from "@xyflow/react";
import roadmapService, {
  backendGraphToFlow,
  mapResourceToUi,
} from "../../services/roadmapService";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import ResourceDrawer from "../components/roadmap/ResourceDrawer";
import "../components/roadmap/roadmap-tokens.css";

/**
 * Trainer · RoadmapEditor
 * Authoring canvas for a single roadmap the trainer owns.
 *
 * Backend:
 *   GET    /api/progress/roadmaps/org/{id}                 -> OrgRoadmapResponse (meta)
 *   GET    /api/progress/roadmaps/org/{id}/graph           -> OrgRoadmapGraphResponse
 *   POST   /api/progress/roadmaps/org/{id}/nodes           -> OrgNodeResponse
 *   PUT    /api/progress/roadmaps/org/{id}/nodes/{nodeId}
 *   DELETE /api/progress/roadmaps/org/{id}/nodes/{nodeId}
 *   POST   /api/progress/roadmaps/org/{id}/nodes/{nodeId}/resources
 *   PUT    /api/progress/roadmaps/org/{id}/resources/{resourceId}
 *   DELETE /api/progress/roadmaps/org/{id}/resources/{resourceId}
 *   POST   /api/progress/roadmaps/org/{id}/publish | /unpublish  (org-admin only)
 *   PUT    /api/progress/roadmaps/org/{id}                        (org-admin only)
 *
 * Edges are parent -> child (source -> target). A connection is persisted by
 * updating the CHILD node's parentNodeIds. The backend runs DAG/cycle
 * validation, so an illegal connection returns 400 INVALID_NODE_GRAPH.
 */

const NODE_TYPE_OPTIONS = [
  { value: "topic", label: "Topic" },
  { value: "subtopic", label: "Subtopic" },
  { value: "milestone", label: "Milestone" },
];

export default function RoadmapEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meta, setMeta] = useState(null); // OrgRoadmapResponse
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPublish, setShowPublish] = useState(false);

  // refs so canvas callbacks read fresh state without re-subscribing
  const edgesRef = useRef(edges);
  const nodesRef = useRef(nodes);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [m, graph] = await Promise.all([
        roadmapService.getOrgRoadmap(id).catch(() => null),
        roadmapService.getOrgRoadmapGraph(id),
      ]);
      const { nodes: fnodes, edges: fedges } = backendGraphToFlow(graph);
      setMeta(m || { id: Number(id), title: graph.title, published: false });
      setNodes(fnodes);
      setEdges(fedges);
    } catch (e) {
      setError(readError(e, "Could not load this roadmap for editing."));
    } finally {
      setLoading(false);
    }
  }, [id, setNodes, setEdges]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId],
  );

  function flash(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2600);
  }

  // ---- canvas: drag persistence -------------------------------------------
  const onNodesChange = useCallback(
    (changes) => {
      onNodesChangeInternal(changes);
      changes
        .filter(
          (c) => c.type === "position" && c.dragging === false && c.position,
        )
        .forEach((c) => {
          roadmapService
            .updateNode(id, Number(c.id), {
              positionX: c.position.x,
              positionY: c.position.y,
            })
            .catch((e) =>
              setError(readError(e, "Could not save node position.")),
            );
        });
    },
    [id, onNodesChangeInternal],
  );

  // ---- canvas: connect (persist child's parents) --------------------------
  const onConnect = useCallback(
    (connection) => {
      if (!connection.source || !connection.target) return;
      if (connection.source === connection.target) return;
      const newEdge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}`,
        type: "smoothstep",
      };
      const next = addEdge(newEdge, edgesRef.current);
      setEdges(next);
      const childId = connection.target;
      const parents = Array.from(
        new Set(
          next.filter((e) => e.target === childId).map((e) => Number(e.source)),
        ),
      );
      roadmapService
        .updateNode(id, Number(childId), { parentNodeIds: parents })
        .catch((e) => {
          setError(readError(e, "Could not save the connection."));
          // roll the edge back on failure (e.g. cycle rejected by backend)
          setEdges((eds) => eds.filter((x) => x.id !== newEdge.id));
        });
    },
    [id, setEdges],
  );

  // ---- canvas: edge removal (recompute affected child's parents) ----------
  const onEdgesChange = useCallback(
    (changes) => {
      onEdgesChangeInternal(changes);
      const removed = changes.filter((c) => c.type === "remove");
      if (!removed.length) return;
      const removedIds = new Set(removed.map((c) => c.id));
      const before = edgesRef.current;
      const next = before.filter((e) => !removedIds.has(e.id));
      const affected = new Set(
        before.filter((e) => removedIds.has(e.id)).map((e) => e.target),
      );
      affected.forEach((childId) => {
        const parents = Array.from(
          new Set(
            next
              .filter((e) => e.target === childId)
              .map((e) => Number(e.source)),
          ),
        );
        roadmapService
          .updateNode(id, Number(childId), { parentNodeIds: parents })
          .catch((e) =>
            setError(readError(e, "Could not update prerequisites.")),
          );
      });
    },
    [id, onEdgesChangeInternal],
  );

  // ---- add node -----------------------------------------------------------
  async function handleAddNode() {
    setBusy(true);
    try {
      // spread new nodes out a little so they don't stack
      const offset = nodesRef.current.length * 30;
      const created = await roadmapService.createNode(id, {
        orgRoadmapId: Number(id),
        title: "New topic",
        description: null,
        type: "TOPIC",
        positionX: 120 + (offset % 300),
        positionY: 120 + offset,
        optional: false, // CREATE key
        estimatedHours: null,
        orderIndex: nodesRef.current.length,
        hasQuiz: false,
        hasProject: false,
        parentNodeIds: [],
      });
      const flowNode = {
        id: String(created.id),
        type: "roadmapNode",
        position: { x: created.positionX ?? 120, y: created.positionY ?? 120 },
        data: {
          title: created.title,
          description: created.description || "",
          nodeType: roadmapService.toUiNodeType(created.type),
          status: "not_started",
          estimatedHours: created.estimatedHours ?? null,
          orderIndex: created.orderIndex ?? null,
          isOptional: created.optional ?? false,
          hasQuiz: created.hasQuiz ?? false,
          hasProject: created.hasProject ?? false,
          prerequisites: [],
          hasPrerequisites: false,
          resources: [],
          backendId: created.id,
        },
      };
      setNodes((nds) => [...nds, flowNode]);
      setSelectedNodeId(flowNode.id);
      flash("Topic added.");
    } catch (e) {
      setError(readError(e, "Could not add a topic."));
    } finally {
      setBusy(false);
    }
  }

  // ---- update selected node fields (property panel) -----------------------
  function patchSelectedLocal(patch) {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n,
      ),
    );
  }

  async function handleSaveNode() {
    const node = nodesRef.current.find((n) => n.id === selectedNodeId);
    if (!node) return;
    setBusy(true);
    try {
      const parents = Array.from(
        new Set(
          edgesRef.current
            .filter((e) => e.target === node.id)
            .map((e) => Number(e.source)),
        ),
      );
      await roadmapService.updateNode(id, Number(node.id), {
        title: node.data.title,
        description: node.data.description ?? null,
        type: roadmapService.toApiNodeType(node.data.nodeType),
        positionX: node.position.x,
        positionY: node.position.y,
        isOptional: !!node.data.isOptional, // UPDATE key
        estimatedHours: node.data.estimatedHours ?? null,
        orderIndex: node.data.orderIndex ?? null,
        hasQuiz: !!node.data.hasQuiz,
        hasProject: !!node.data.hasProject,
        parentNodeIds: parents,
      });
      flash("Saved.");
    } catch (e) {
      setError(readError(e, "Could not save the topic."));
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteNode() {
    const node = nodesRef.current.find((n) => n.id === selectedNodeId);
    if (!node) return;
    if (!window.confirm(`Delete "${node.data.title}"? This can't be undone.`))
      return;
    setBusy(true);
    try {
      await roadmapService.deleteNode(id, Number(node.id));
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== node.id && e.target !== node.id),
      );
      setSelectedNodeId(null);
      setDrawerOpen(false);
      flash("Topic deleted.");
    } catch (e) {
      setError(readError(e, "Could not delete the topic."));
    } finally {
      setBusy(false);
    }
  }

  // ---- resources ----------------------------------------------------------
  async function handleAddResource(nodeId, resource) {
    setBusy(true);
    try {
      const resp = await roadmapService.addResource(id, nodeId, resource);
      const ui = mapResourceToUi(resp);
      setNodes((nds) =>
        nds.map((n) =>
          Number(n.id) === Number(nodeId)
            ? {
                ...n,
                data: {
                  ...n.data,
                  resources: [...(n.data.resources || []), ui],
                },
              }
            : n,
        ),
      );
    } catch (e) {
      setError(readError(e, "Could not add the resource."));
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveResource(resourceId) {
    setBusy(true);
    try {
      await roadmapService.deleteResource(id, resourceId);
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            resources: (n.data.resources || []).filter(
              (r) => (r.backendId ?? r.id) !== resourceId,
            ),
          },
        })),
      );
    } catch (e) {
      setError(readError(e, "Could not remove the resource."));
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateResource(resourceId, patch) {
    setBusy(true);
    try {
      const resp = await roadmapService.updateResource(id, resourceId, patch);
      const ui = mapResourceToUi(resp);
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            resources: (n.data.resources || []).map((r) =>
              (r.backendId ?? r.id) === resourceId ? ui : r,
            ),
          },
        })),
      );
    } catch (e) {
      setError(readError(e, "Could not update the resource."));
    } finally {
      setBusy(false);
    }
  }

  // ---- publish / unpublish (org-admin only; trainer -> 403) ---------------
  async function handleTogglePublish() {
    setBusy(true);
    setShowPublish(false);
    try {
      const updated = meta?.published
        ? await roadmapService.unpublishRoadmap(id)
        : await roadmapService.publishRoadmap(id);
      setMeta(updated);
      flash(updated.published ? "Roadmap published." : "Roadmap unpublished.");
    } catch (e) {
      const status = e?.response?.status;
      setError(
        status === 403
          ? "Only an org admin can publish this roadmap."
          : readError(e, "Could not change publish state."),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--rm-bg, #f5f3ee)",
        color: "var(--rm-text, #17130a)",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
      }}
    >
      {/* toolbar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 18px",
          background: "var(--rm-surface, #fff)",
          borderBottom: "1px solid var(--rm-border, #d9d5cc)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate("/trainer/roadmaps")}
          style={ghostBtnStyle}
        >
          ← Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 800,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {meta?.title || (loading ? "Loading…" : "Roadmap editor")}
          </h1>
        </div>

        {meta && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              padding: "3px 10px",
              borderRadius: 999,
              color: meta.published
                ? "var(--rm-done, #16a34a)"
                : "var(--rm-progress, #d97706)",
              background: meta.published
                ? "var(--rm-done-bg, #dcfce7)"
                : "var(--rm-progress-bg, #fef3c7)",
            }}
          >
            {meta.published ? "Published" : "Draft"}
          </span>
        )}

        <button
          onClick={handleAddNode}
          disabled={busy || loading}
          style={ghostBtnStyle}
        >
          + Add topic
        </button>
        <button
          onClick={() => setShowPublish(true)}
          disabled={busy || loading || !meta}
          style={primaryBtnStyle}
        >
          {meta?.published ? "Unpublish" : "Publish"}
        </button>
      </header>

      {/* notices */}
      {(error || notice) && (
        <div
          style={{
            padding: "8px 18px",
            fontSize: 13.5,
            background: error ? "#fef2f2" : "#ecfdf5",
            color: error ? "#b91c1c" : "#047857",
            borderBottom: "1px solid var(--rm-border, #d9d5cc)",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span>{error || notice}</span>
          {error && (
            <button
              onClick={() => setError("")}
              style={{ ...linkBtnStyle, color: "#b91c1c" }}
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* body: canvas + property panel */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ flex: 1, position: "relative" }}>
          {loading ? (
            <Centered>Loading editor…</Centered>
          ) : (
            <RoadmapCanvas
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              readOnly={false}
              showMiniMap
              onSelectNode={setSelectedNodeId}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
            />
          )}
          {!loading && nodes.length === 0 && (
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--rm-surface, #fff)",
                border: "1px dashed var(--rm-border, #d9d5cc)",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13.5,
                color: "var(--rm-text-muted, #6b7280)",
              }}
            >
              Empty roadmap — click “Add topic” to begin. Drag from a node’s
              bottom handle to another node’s top handle to set a prerequisite.
            </div>
          )}
        </div>

        {/* property panel */}
        {selectedNode && (
          <NodePropertyPanel
            node={selectedNode}
            busy={busy}
            onChange={patchSelectedLocal}
            onSave={handleSaveNode}
            onDelete={handleDeleteNode}
            onManageResources={() => setDrawerOpen(true)}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      {/* resources drawer (trainer) */}
      <ResourceDrawer
        node={selectedNode}
        isOpen={drawerOpen && !!selectedNode}
        role="trainer"
        busy={busy}
        onClose={() => setDrawerOpen(false)}
        onAddResource={handleAddResource}
        onRemoveResource={handleRemoveResource}
        onUpdateResource={handleUpdateResource}
      />

      {showPublish && (
        <ConfirmModal
          title={meta?.published ? "Unpublish roadmap?" : "Publish roadmap?"}
          body={
            meta?.published
              ? "Students will no longer see this roadmap until you publish it again."
              : "Students in your org will be able to see and follow this roadmap."
          }
          confirmLabel={meta?.published ? "Unpublish" : "Publish"}
          busy={busy}
          onConfirm={handleTogglePublish}
          onCancel={() => setShowPublish(false)}
        />
      )}
    </div>
  );
}

function NodePropertyPanel({
  node,
  onChange,
  onSave,
  onDelete,
  onManageResources,
  onClose,
  busy,
}) {
  const d = node.data;
  return (
    <aside
      style={{
        width: 300,
        flexShrink: 0,
        borderLeft: "1px solid var(--rm-border, #d9d5cc)",
        background: "var(--rm-surface, #fff)",
        padding: 18,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Topic</h3>
        <button onClick={onClose} style={iconBtnStyle} aria-label="Deselect">
          ✕
        </button>
      </div>

      <label style={fieldLabel}>Title</label>
      <input
        value={d.title || ""}
        onChange={(e) => onChange({ title: e.target.value })}
        style={inputStyle}
      />

      <label style={fieldLabel}>Description</label>
      <textarea
        value={d.description || ""}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={4}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label style={fieldLabel}>Type</label>
      <select
        value={d.nodeType || "topic"}
        onChange={(e) => onChange({ nodeType: e.target.value })}
        style={inputStyle}
      >
        {NODE_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <label style={fieldLabel}>Estimated hours</label>
      <input
        type="number"
        min={0}
        value={d.estimatedHours ?? ""}
        onChange={(e) =>
          onChange({
            estimatedHours:
              e.target.value === "" ? null : Number(e.target.value),
          })
        }
        style={inputStyle}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 14,
        }}
      >
        <Toggle
          label="Optional"
          checked={!!d.isOptional}
          onChange={(v) => onChange({ isOptional: v })}
        />
        <Toggle
          label="Has quiz"
          checked={!!d.hasQuiz}
          onChange={(v) => onChange({ hasQuiz: v })}
        />
        <Toggle
          label="Has project"
          checked={!!d.hasProject}
          onChange={(v) => onChange({ hasProject: v })}
        />
      </div>

      <button
        onClick={onManageResources}
        style={{ ...ghostBtnStyle, width: "100%", marginTop: 16 }}
      >
        Manage resources ({(d.resources || []).length})
      </button>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          onClick={onSave}
          disabled={busy}
          style={{ ...primaryBtnStyle, flex: 1 }}
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onDelete}
          disabled={busy}
          style={{
            ...ghostBtnStyle,
            color: "#dc2626",
            borderColor: "#fecaca",
          }}
        >
          Delete
        </button>
      </div>
    </aside>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 13.5,
        cursor: "pointer",
      }}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function ConfirmModal({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  busy,
}) {
  return (
    <div style={modalBackdrop} onClick={onCancel}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 800 }}>
          {title}
        </h2>
        <p
          style={{
            margin: "0 0 18px",
            fontSize: 14,
            color: "var(--rm-text-muted, #6b7280)",
            lineHeight: 1.5,
          }}
        >
          {body}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onCancel} style={ghostBtnStyle} disabled={busy}>
            Cancel
          </button>
          <button onClick={onConfirm} style={primaryBtnStyle} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        color: "var(--rm-text-muted, #6b7280)",
      }}
    >
      {children}
    </div>
  );
}

function readError(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback
  );
}

const primaryBtnStyle = {
  border: "none",
  background: "var(--rm-accent, #7c3aed)",
  color: "#fff",
  borderRadius: 9,
  padding: "8px 15px",
  fontSize: 13.5,
  fontWeight: 700,
  cursor: "pointer",
};
const ghostBtnStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
  borderRadius: 9,
  padding: "8px 15px",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
};
const linkBtnStyle = {
  border: "none",
  background: "none",
  fontWeight: 700,
  cursor: "pointer",
  padding: 0,
  fontSize: "inherit",
};
const iconBtnStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  borderRadius: 8,
  width: 28,
  height: 28,
  cursor: "pointer",
  fontSize: 13,
  display: "grid",
  placeItems: "center",
};
const fieldLabel = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--rm-text-muted, #6b7280)",
  margin: "12px 0 5px",
};
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13.5,
  fontFamily: "inherit",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
};
const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.4)",
  display: "grid",
  placeItems: "center",
  zIndex: 50,
  padding: 20,
};
const modalCard = {
  width: "min(440px, 100%)",
  background: "var(--rm-surface, #fff)",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 20px 60px rgba(0,0,0,.3)",
  fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
};
