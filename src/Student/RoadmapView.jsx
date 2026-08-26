import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roadmapService, { backendGraphToFlow } from "../services/roadmapService";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import ResourceDrawer from "../components/roadmap/ResourceDrawer";
import ProgressBar from "../components/roadmap/ProgressBar";
import "../components/roadmap/roadmap-tokens.css";

/**
 * Student · RoadmapView
 * Renders one roadmap as an interactive graph with the student's own progress,
 * and lets the student mark nodes done / in-progress / skipped.
 *
 * Backend:
 *   GET /api/progress/roadmaps/{slug}                       -> RoadmapGraphResponse
 *   PUT /api/progress/roadmaps/{slug}/nodes/{nodeId}/progress
 */

// A node is "locked" (advisory) when it has prerequisites and not all of them
// are done. Locks are visual only — the student can still mark any node.
function applyLocks(nodes, edges) {
  const statusById = {};
  nodes.forEach((n) => {
    statusById[n.id] = n.data.status;
  });
  const parentsById = {};
  edges.forEach((e) => {
    (parentsById[e.target] = parentsById[e.target] || []).push(e.source);
  });
  return nodes.map((n) => {
    const parents = parentsById[n.id] || [];
    const locked =
      parents.length > 0 && !parents.every((p) => statusById[p] === "done");
    return { ...n, data: { ...n.data, locked } };
  });
}

export default function RoadmapView() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [meta, setMeta] = useState({
    title: "",
    description: "",
    orgRoadmapId: null,
  });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const graph = await roadmapService.getRoadmapGraph(slug);
      const { nodes: fnodes, edges: fedges } = backendGraphToFlow(graph);
      setMeta({
        title: graph.title,
        description: graph.description || "",
        orgRoadmapId: graph.orgRoadmapId,
      });
      setEdges(fedges);
      setNodes(applyLocks(fnodes, fedges));
    } catch (e) {
      setError(readError(e, "Could not load this roadmap."));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const progress = useMemo(() => {
    if (!nodes.length) return 0;
    const done = nodes.filter((n) => n.data.status === "done").length;
    return Math.round((done / nodes.length) * 100);
  }, [nodes]);

  const drawerNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId],
  );

  const handleNodeClick = useCallback((node) => {
    setSelectedNodeId(node.id);
    if (node.data?.locked) {
      // brief shake, but still open the drawer
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, shake: true } } : n,
        ),
      );
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === node.id ? { ...n, data: { ...n.data, shake: false } } : n,
          ),
        );
      }, 450);
    }
  }, []);

  const handleStatusChange = useCallback(
    async (flowId, newUiStatus) => {
      // optimistic update + recompute locks
      setNodes((prev) =>
        applyLocks(
          prev.map((n) =>
            n.id === flowId
              ? { ...n, data: { ...n.data, status: newUiStatus } }
              : n,
          ),
          edges,
        ),
      );
      setBusy(true);
      try {
        await roadmapService.updateNodeProgress(slug, Number(flowId), {
          status: newUiStatus,
        });
      } catch (e) {
        setError(readError(e, "Could not save your progress. Reloading…"));
        // reconcile with the server on failure
        load();
      } finally {
        setBusy(false);
      }
    },
    [slug, edges, load],
  );

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
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 20px",
          background: "var(--rm-surface, #fff)",
          borderBottom: "1px solid var(--rm-border, #d9d5cc)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate("/student/roadmaps")}
          style={backBtnStyle}
        >
          ← Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {meta.title || (loading ? "Loading…" : "Roadmap")}
          </h1>
        </div>
        <div style={{ width: 220, maxWidth: "40vw" }}>
          <ProgressBar percentage={progress} />
        </div>
      </header>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "8px 20px",
          fontSize: 12,
          color: "var(--rm-text-muted, #6b7280)",
          background: "var(--rm-surface-2, #faf9f6)",
          borderBottom: "1px solid var(--rm-border, #d9d5cc)",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <LegendDot color="var(--rm-done, #16a34a)" label="Done" />
        <LegendDot color="var(--rm-progress, #d97706)" label="In progress" />
        <LegendDot color="var(--rm-skipped, #6b7280)" label="Skipped" />
        <LegendDot color="var(--rm-node-border, #e0a800)" label="Not started" />
        <span>🔒 Locked (finish prerequisites)</span>
      </div>

      {/* Canvas / states */}
      <div style={{ flex: 1, position: "relative" }}>
        {loading && <Centered>Loading roadmap…</Centered>}
        {!loading && error && (
          <Centered>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</p>
              <button onClick={load} style={backBtnStyle}>
                Retry
              </button>
            </div>
          </Centered>
        )}
        {!loading && !error && nodes.length === 0 && (
          <Centered>This roadmap has no topics yet.</Centered>
        )}
        {!loading && !error && nodes.length > 0 && (
          <RoadmapCanvas
            nodes={nodes}
            edges={edges}
            readOnly
            showMiniMap
            onNodeClick={handleNodeClick}
          />
        )}
      </div>

      <ResourceDrawer
        node={drawerNode}
        isOpen={!!drawerNode}
        role="student"
        busy={busy}
        onClose={() => setSelectedNodeId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{ width: 10, height: 10, borderRadius: 999, background: color }}
      />
      {label}
    </span>
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
        fontSize: 15,
      }}
    >
      {children}
    </div>
  );
}

const backBtnStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
  borderRadius: 8,
  padding: "7px 14px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

function readError(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback
  );
}
