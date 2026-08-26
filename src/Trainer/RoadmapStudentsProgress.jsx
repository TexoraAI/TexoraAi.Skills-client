import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roadmapService from "../services/roadmapService";
import ProgressBar from "../components/roadmap/ProgressBar";
import "../components/roadmap/roadmap-tokens.css";

/**
 * Trainer · RoadmapStudentsProgress
 * How the trainer's students are doing on one roadmap.
 *
 * Backend:
 *   GET /api/progress/roadmaps/org/{id}                  -> OrgRoadmapResponse (title)
 *   GET /api/progress/roadmaps/org/{id}/students-progress
 *        -> PagedResponse<StudentProgressSummaryResponse>
 *           { studentId, studentName, orgId, orgRoadmapId, completionPercent(0-100), lastActiveAt }
 *           authorized by trainer ownership — the owning trainer CAN read this.
 *   GET /api/progress/roadmaps/org/{id}/analytics        -> RoadmapAnalyticsResponse
 *           { orgRoadmapId, orgId, totalStudents, completionPercent(0-100),
 *             nodeBottleneckStats:[{ nodeId, nodeTitle, stuckCount, notStartedCount,
 *                                    inProgressCount, doneCount, averageTimeSpentMinutes }] }
 *
 * SEAM (documented): analytics is authorized for SUPER_ADMIN / matching ORG_ADMIN
 * only — a pure TRAINER gets 403. So node-level bottleneck stats are rendered
 * best-effort: if the call is forbidden we simply hide that section (no error).
 * There is intentionally NO per-student-per-node endpoint in the backend, so this
 * page shows real per-student summaries + real per-node aggregates rather than a
 * fabricated per-student-per-node grid.
 */

const SORTABLE = {
  name: (a, b) => (a.studentName || "").localeCompare(b.studentName || ""),
  completion: (a, b) => (a.completionPercent || 0) - (b.completionPercent || 0),
  active: (a, b) => ts(a.lastActiveAt) - ts(b.lastActiveAt),
};

function ts(iso) {
  const t = iso ? new Date(iso).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

export default function RoadmapStudentsProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState("completion");
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [meta, page, stats] = await Promise.all([
        roadmapService.getOrgRoadmap(id).catch(() => null),
        roadmapService.getStudentsProgress(id, { page: 0, size: 200 }),
        // analytics is admin-only; a trainer gets 403 -> degrade silently
        roadmapService.getAnalytics(id).catch(() => null),
      ]);
      setTitle(meta?.title || "");
      setStudents(page?.content || []);
      setAnalytics(stats);
    } catch (e) {
      setError(readError(e, "Could not load student progress."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const count = analytics?.totalStudents ?? students.length;
    let avg = analytics?.completionPercent;
    if (avg == null) {
      avg = students.length
        ? students.reduce((s, r) => s + (r.completionPercent || 0), 0) /
          students.length
        : 0;
    }
    const completed = students.filter(
      (r) => (r.completionPercent || 0) >= 100,
    ).length;
    return { count, avg: Math.round(avg), completed };
  }, [analytics, students]);

  const sortedStudents = useMemo(() => {
    const cmp = SORTABLE[sortKey] || SORTABLE.completion;
    const arr = [...students].sort(cmp);
    return sortDir === "desc" ? arr.reverse() : arr;
  }, [students, sortKey, sortDir]);

  const bottlenecks = useMemo(() => {
    const list = analytics?.nodeBottleneckStats || [];
    // surface the most "stuck" nodes first
    return [...list].sort((a, b) => (b.stuckCount || 0) - (a.stuckCount || 0));
  }, [analytics]);

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--rm-bg, #f5f3ee)",
        color: "var(--rm-text, #17130a)",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
      }}
    >
      <div
        style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 64px" }}
      >
        {/* header */}
        <button
          onClick={() => navigate("/trainer/roadmaps")}
          style={backBtnStyle}
        >
          ← Back to roadmaps
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            {title ? `${title} · Students` : "Student progress"}
          </h1>
          <button
            onClick={() => navigate(`/trainer/roadmaps/${id}/edit`)}
            style={{ ...ghostBtnStyle, marginLeft: "auto" }}
          >
            Edit roadmap
          </button>
        </div>
        <p
          style={{ margin: "6px 0 0", color: "var(--rm-text-muted, #6b7280)" }}
        >
          Progress of the students you teach on this roadmap.
        </p>

        {loading && (
          <p style={{ marginTop: 28, color: "var(--rm-text-muted, #6b7280)" }}>
            Loading…
          </p>
        )}

        {!loading && error && (
          <div style={errorBoxStyle}>
            {error}{" "}
            <button onClick={load} style={linkBtnStyle}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* stat cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                margin: "24px 0",
              }}
            >
              <StatCard label="Students" value={stats.count} />
              <StatCard label="Avg. completion" value={`${stats.avg}%`} />
              <StatCard label="Finished (100%)" value={stats.completed} />
            </div>

            {/* students table */}
            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Students ({students.length})</h2>
              </div>

              {students.length === 0 ? (
                <div
                  style={{
                    padding: 24,
                    color: "var(--rm-text-muted, #6b7280)",
                    fontSize: 14.5,
                  }}
                >
                  No students are enrolled with you on this roadmap yet.
                </div>
              ) : (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <Th
                        onClick={() => toggleSort("name")}
                        active={sortKey === "name"}
                        dir={sortDir}
                      >
                        Student
                      </Th>
                      <Th
                        onClick={() => toggleSort("completion")}
                        active={sortKey === "completion"}
                        dir={sortDir}
                        style={{ width: "42%" }}
                      >
                        Completion
                      </Th>
                      <Th
                        onClick={() => toggleSort("active")}
                        active={sortKey === "active"}
                        dir={sortDir}
                      >
                        Last active
                      </Th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((s) => (
                      <tr
                        key={s.studentId}
                        style={{
                          borderTop: "1px solid var(--rm-border, #eee)",
                        }}
                      >
                        <td style={tdStyle}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <Avatar name={s.studentName} />
                            <span style={{ fontWeight: 600 }}>
                              {s.studentName || `Student #${s.studentId}`}
                            </span>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <ProgressBar
                                percentage={s.completionPercent || 0}
                                size="sm"
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                width: 40,
                                textAlign: "right",
                              }}
                            >
                              {Math.round(s.completionPercent || 0)}%
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            color: "var(--rm-text-muted, #6b7280)",
                            fontSize: 13.5,
                          }}
                        >
                          {formatRelative(s.lastActiveAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* node bottlenecks (analytics — admin only; hidden if forbidden) */}
            {analytics ? (
              <section style={{ ...cardStyle, marginTop: 24 }}>
                <div style={sectionHeaderStyle}>
                  <h2 style={sectionTitleStyle}>Where students get stuck</h2>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: "var(--rm-text-muted, #6b7280)",
                    }}
                  >
                    Per-topic breakdown across all students
                  </span>
                </div>
                {bottlenecks.length === 0 ? (
                  <div
                    style={{
                      padding: 24,
                      color: "var(--rm-text-muted, #6b7280)",
                      fontSize: 14.5,
                    }}
                  >
                    No topic activity yet.
                  </div>
                ) : (
                  <div style={{ padding: "4px 8px 12px" }}>
                    {bottlenecks.map((n) => (
                      <BottleneckRow key={n.nodeId} node={n} />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <p
                style={{
                  marginTop: 20,
                  fontSize: 13,
                  color: "var(--rm-text-muted, #9ca3af)",
                }}
              >
                Topic-level analytics (where students get stuck) is available to
                org admins.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BottleneckRow({ node }) {
  const total =
    (node.notStartedCount || 0) +
    (node.inProgressCount || 0) +
    (node.doneCount || 0);
  const seg = (v) => (total ? `${(100 * v) / total}%` : "0%");
  return (
    <div
      style={{
        padding: "12px 12px",
        borderTop: "1px solid var(--rm-border, #f0ede6)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 7,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          {node.nodeTitle || `Node #${node.nodeId}`}
        </span>
        <span
          style={{ fontSize: 12.5, color: "var(--rm-text-muted, #6b7280)" }}
        >
          {node.stuckCount > 0 ? `${node.stuckCount} stuck · ` : ""}
          {Math.round(node.averageTimeSpentMinutes || 0)} min avg
        </span>
      </div>
      {/* stacked distribution bar */}
      <div
        style={{
          display: "flex",
          height: 10,
          borderRadius: 999,
          overflow: "hidden",
          background: "var(--rm-border, #eceae4)",
        }}
        title={`Done ${node.doneCount} · In progress ${node.inProgressCount} · Not started ${node.notStartedCount}`}
      >
        <span
          style={{
            width: seg(node.doneCount),
            background: "var(--rm-done, #16a34a)",
          }}
        />
        <span
          style={{
            width: seg(node.inProgressCount),
            background: "var(--rm-progress, #d97706)",
          }}
        />
        <span
          style={{
            width: seg(node.notStartedCount),
            background: "var(--rm-locked, #cbd5e1)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 6,
          fontSize: 11.5,
          color: "var(--rm-text-muted, #6b7280)",
        }}
      >
        <Dot color="var(--rm-done, #16a34a)" /> Done {node.doneCount || 0}
        <Dot color="var(--rm-progress, #d97706)" /> In progress{" "}
        {node.inProgressCount || 0}
        <Dot color="var(--rm-locked, #cbd5e1)" /> Not started{" "}
        {node.notStartedCount || 0}
      </div>
    </div>
  );
}

function Dot({ color }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: 999,
        background: color,
        marginRight: 2,
      }}
    />
  );
}

function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      style={{
        width: 30,
        height: 30,
        borderRadius: 999,
        background: "var(--rm-accent-soft, #ede9fe)",
        color: "var(--rm-accent, #7c3aed)",
        fontSize: 12,
        fontWeight: 800,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      {initials || "?"}
    </span>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={cardStyle}>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
        <div
          style={{
            fontSize: 12.5,
            color: "var(--rm-text-muted, #6b7280)",
            marginTop: 2,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function Th({ children, onClick, active, dir, style }) {
  return (
    <th
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "12px 16px",
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        color: active
          ? "var(--rm-accent, #7c3aed)"
          : "var(--rm-text-muted, #6b7280)",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
      {active ? (dir === "asc" ? " ▲" : " ▼") : ""}
    </th>
  );
}

function formatRelative(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  if (diff < 0) return d.toLocaleDateString();
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readError(e, fallback) {
  const msg =
    e?.response?.data?.message || e?.response?.data?.error || e?.message;
  return typeof msg === "string" ? msg : fallback;
}

const cardStyle = {
  background: "var(--rm-surface, #fff)",
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "var(--rm-shadow, 0 1px 2px rgba(0,0,0,.04))",
};
const sectionHeaderStyle = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
  padding: "16px 18px",
  borderBottom: "1px solid var(--rm-border, #eee)",
};
const sectionTitleStyle = { margin: 0, fontSize: 16, fontWeight: 800 };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tdStyle = { padding: "12px 16px", fontSize: 14, verticalAlign: "middle" };
const backBtnStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
  borderRadius: 8,
  padding: "7px 14px",
  fontSize: 13.5,
  fontWeight: 600,
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
  color: "var(--rm-accent, #7c3aed)",
  fontWeight: 700,
  cursor: "pointer",
  padding: 0,
  fontSize: "inherit",
};
const errorBoxStyle = {
  marginTop: 24,
  padding: "12px 14px",
  borderRadius: 10,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  fontSize: 14,
};
