import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import roadmapService from "../services/roadmapService";
import ProgressBar from "../components/roadmap/ProgressBar";
import "../components/roadmap/roadmap-tokens.css";

/**
 * Admin · RoadmapAnalytics
 * Real analytics for one org roadmap, sourced entirely from the backend.
 *
 * Backend (all under /api/progress/roadmaps):
 *   GET /org/mine                 -> PagedResponse<OrgRoadmapResponse>       (selector: my roadmaps, incl. drafts)
 *   GET /org                      -> PagedResponse<RoadmapListItemResponse>  (selector: all published in org)
 *   GET /org/{id}/analytics       -> RoadmapAnalyticsResponse                (the numbers on this page)
 *
 * RoadmapAnalyticsResponse = {
 *   orgRoadmapId, orgId, totalStudents:Int, completionPercent:Double(0-100),
 *   nodeBottleneckStats: [{
 *     nodeId, nodeTitle,
 *     stuckCount, notStartedCount, inProgressCount, doneCount,   // per-node student distribution
 *     averageTimeSpentMinutes                                    // avg minutes spent on that node
 *   }]
 * }
 *
 * SEAM (documented, handled honestly): the backend does NOT store a historical
 * time series (no daily snapshots) and has no per-student "time invested" field.
 * So instead of fabricating a 30-day trend line, this page shows only what the
 * backend actually measures: overall completion, a real per-topic completion
 * breakdown, a bottleneck table, and an aggregate status funnel — all derived
 * from nodeBottleneckStats. "Avg time / student" is derived by summing each
 * node's averageTimeSpentMinutes (a lower-bound estimate, labeled as such).
 */
export default function RoadmapAnalytics() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id") || "";

  const [options, setOptions] = useState([]); // [{ id, title, published }]
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  const [data, setData] = useState(null); // RoadmapAnalyticsResponse
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  // ---- load the roadmap selector ------------------------------------------

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    setOptionsError("");
    try {
      const [mine, published] = await Promise.all([
        roadmapService.listMyRoadmaps({ page: 0, size: 100 }).catch(() => null),
        roadmapService
          .listOrgRoadmaps({ page: 0, size: 100 })
          .catch(() => null),
      ]);
      const byId = new Map();
      (mine?.content || []).forEach((r) =>
        byId.set(r.id, { id: r.id, title: r.title, published: !!r.published }),
      );
      (published?.content || []).forEach((r) => {
        if (!byId.has(r.id))
          byId.set(r.id, { id: r.id, title: r.title, published: true });
      });
      const list = [...byId.values()].sort((a, b) =>
        String(a.title).localeCompare(String(b.title)),
      );
      setOptions(list);

      // Preselect: keep the ?id= if valid, else fall back to the first roadmap.
      if (list.length > 0) {
        const stillValid =
          selectedId && list.some((o) => String(o.id) === String(selectedId));
        if (!stillValid) {
          setSearchParams({ id: String(list[0].id) }, { replace: true });
        }
      }
    } catch (e) {
      setOptionsError(readError(e, "Could not load your roadmaps."));
    } finally {
      setOptionsLoading(false);
    }
    // selectedId intentionally omitted: we only want to pick a default once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  // ---- load analytics for the selected roadmap ----------------------------

  const loadAnalytics = useCallback(async (id) => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    setError("");
    setForbidden(false);
    try {
      const res = await roadmapService.getAnalytics(id);
      setData(res);
    } catch (e) {
      if (e?.response?.status === 403) {
        setForbidden(true);
      } else if (e?.response?.status === 404) {
        setError("That roadmap no longer exists.");
      } else {
        setError(readError(e, "Could not load analytics for this roadmap."));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics(selectedId);
  }, [selectedId, loadAnalytics]);

  // ---- derived metrics (all from real fields) -----------------------------

  const stats = data?.nodeBottleneckStats || [];
  const totalStudents = data?.totalStudents ?? 0;

  const derived = useMemo(() => {
    const totalMinutes = stats.reduce(
      (s, n) => s + (Number(n.averageTimeSpentMinutes) || 0),
      0,
    );
    const agg = stats.reduce(
      (a, n) => {
        a.notStarted += Number(n.notStartedCount) || 0;
        a.inProgress += Number(n.inProgressCount) || 0;
        a.done += Number(n.doneCount) || 0;
        return a;
      },
      { notStarted: 0, inProgress: 0, done: 0 },
    );
    const aggTotal = agg.notStarted + agg.inProgress + agg.done;

    // per-topic completion (done / participants on that node)
    const topics = stats.map((n) => {
      const total =
        (Number(n.notStartedCount) || 0) +
        (Number(n.inProgressCount) || 0) +
        (Number(n.doneCount) || 0);
      const donePct =
        total > 0 ? Math.round((Number(n.doneCount) / total) * 100) : 0;
      const inProgPct =
        total > 0 ? Math.round((Number(n.inProgressCount) / total) * 100) : 0;
      return {
        nodeId: n.nodeId,
        nodeTitle: n.nodeTitle || `Topic ${n.nodeId}`,
        donePct,
        inProgPct,
        notStartedPct: Math.max(0, 100 - donePct - inProgPct),
        stuckCount: Number(n.stuckCount) || 0,
        avgMinutes: Number(n.averageTimeSpentMinutes) || 0,
        total,
      };
    });

    const byCompletion = [...topics].sort((a, b) => a.donePct - b.donePct); // least → most
    const byStuck = [...topics].sort((a, b) => b.stuckCount - a.stuckCount);

    return { totalMinutes, agg, aggTotal, topics, byCompletion, byStuck };
  }, [stats]);

  const completionRate =
    data?.completionPercent != null ? Math.round(data.completionPercent) : 0;

  const currentTitle =
    options.find((o) => String(o.id) === String(selectedId))?.title || "";

  // ---- render -------------------------------------------------------------

  return (
    <div className="ran-page">
      <style>{ROADMAP_ANALYTICS_CSS}</style>

      <header className="ran-header">
        <div>
          <h1 className="ran-title">Roadmap Analytics</h1>
          <p className="ran-subtitle">
            How your learners are progressing through a roadmap.
          </p>
        </div>
        <div className="ran-controls">
          <label className="ran-select-label" htmlFor="ran-roadmap">
            Roadmap
          </label>
          <select
            id="ran-roadmap"
            className="ran-select"
            value={selectedId}
            disabled={optionsLoading || options.length === 0}
            onChange={(e) => setSearchParams({ id: e.target.value })}
          >
            {optionsLoading && <option>Loading…</option>}
            {!optionsLoading && options.length === 0 && (
              <option value="">No roadmaps</option>
            )}
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
                {o.published ? "" : " (draft)"}
              </option>
            ))}
          </select>
          {selectedId && (
            <button
              className="ran-btn-ghost"
              onClick={() => navigate(`/admin/roadmaps/${selectedId}/edit`)}
            >
              Open editor
            </button>
          )}
        </div>
      </header>

      {optionsError && <div className="ran-alert">{optionsError}</div>}

      {!optionsLoading && options.length === 0 && !optionsError && (
        <div className="ran-empty">
          You don&rsquo;t have any roadmaps yet. Create one in{" "}
          <button
            className="ran-link-btn"
            onClick={() => navigate("/admin/roadmaps")}
          >
            Roadmap Management
          </button>
          .
        </div>
      )}

      {loading && <p className="ran-muted">Loading analytics…</p>}

      {!loading && forbidden && (
        <div className="ran-empty">
          You don&rsquo;t have permission to view analytics for this roadmap.
          Analytics are available to the roadmap&rsquo;s org admin (or a super
          admin).
        </div>
      )}

      {!loading && error && (
        <div className="ran-alert">
          {error}{" "}
          <button
            className="ran-link-btn"
            onClick={() => loadAnalytics(selectedId)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && !forbidden && data && (
        <>
          {currentTitle && <h2 className="ran-context">{currentTitle}</h2>}

          {/* Stat cards — all real backend fields */}
          <div className="ran-stats">
            <StatCard
              label="Enrolled students"
              value={totalStudents.toLocaleString()}
              hint="Students with progress on this roadmap"
            />
            <StatCard
              label="Overall completion"
              value={`${completionRate}%`}
              hint="Average completion across all students"
              accent
            />
            <StatCard
              label="Topics"
              value={stats.length.toLocaleString()}
              hint="Nodes in this roadmap"
            />
            <StatCard
              label="Avg time / student"
              value={formatMinutes(derived.totalMinutes)}
              hint="Summed avg time across all topics (lower-bound estimate)"
            />
          </div>

          {totalStudents === 0 && (
            <div className="ran-empty">
              No students have started this roadmap yet, so there&rsquo;s
              nothing to analyze. Publish it and share the link to start
              collecting progress.
            </div>
          )}

          {totalStudents > 0 && (
            <>
              {/* Aggregate status funnel */}
              <section className="ran-card ran-block">
                <div className="ran-block-head">
                  <h3>Where students are right now</h3>
                  <span className="ran-block-sub">
                    Across every topic ({derived.aggTotal.toLocaleString()}{" "}
                    topic states)
                  </span>
                </div>
                <div className="ran-funnel">
                  <FunnelRow
                    label="Done"
                    count={derived.agg.done}
                    total={derived.aggTotal}
                    color="var(--rm-done, #16a34a)"
                  />
                  <FunnelRow
                    label="In progress"
                    count={derived.agg.inProgress}
                    total={derived.aggTotal}
                    color="var(--rm-progress, #d97706)"
                  />
                  <FunnelRow
                    label="Not started"
                    count={derived.agg.notStarted}
                    total={derived.aggTotal}
                    color="var(--rm-border-strong, #9ca3af)"
                  />
                </div>
              </section>

              {/* Per-topic completion (real, replaces the fabricated trend line) */}
              <section className="ran-card ran-block">
                <div className="ran-block-head">
                  <h3>Completion by topic</h3>
                  <span className="ran-block-sub">Lowest completion first</span>
                </div>
                <div className="ran-topics">
                  {derived.byCompletion.map((t) => (
                    <div className="ran-topic-row" key={t.nodeId}>
                      <div className="ran-topic-name" title={t.nodeTitle}>
                        {t.nodeTitle}
                      </div>
                      <div className="ran-topic-bar" aria-hidden="true">
                        <span
                          className="ran-seg ran-seg-done"
                          style={{ width: `${t.donePct}%` }}
                        />
                        <span
                          className="ran-seg ran-seg-prog"
                          style={{ width: `${t.inProgPct}%` }}
                        />
                      </div>
                      <div className="ran-topic-pct">{t.donePct}%</div>
                    </div>
                  ))}
                </div>
                <div className="ran-legend">
                  <span>
                    <i className="ran-dot ran-dot-done" /> Done
                  </span>
                  <span>
                    <i className="ran-dot ran-dot-prog" /> In progress
                  </span>
                  <span>
                    <i className="ran-dot ran-dot-not" /> Not started
                  </span>
                </div>
              </section>

              {/* Bottleneck table */}
              <section className="ran-card ran-block">
                <div className="ran-block-head">
                  <h3>Bottlenecks</h3>
                  <span className="ran-block-sub">
                    Topics where the most students are stuck
                  </span>
                </div>
                <div className="ran-table-wrap">
                  <table className="ran-table">
                    <thead>
                      <tr>
                        <th>Topic</th>
                        <th className="ran-num">Stuck</th>
                        <th className="ran-num">% stuck</th>
                        <th className="ran-num">Avg time on topic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {derived.byStuck.map((t) => (
                        <tr key={t.nodeId}>
                          <td>{t.nodeTitle}</td>
                          <td className="ran-num">
                            {t.stuckCount.toLocaleString()}
                          </td>
                          <td className="ran-num">
                            {totalStudents > 0
                              ? `${Math.round((t.stuckCount / totalStudents) * 100)}%`
                              : "—"}
                          </td>
                          <td className="ran-num">
                            {formatMinutes(t.avgMinutes)}
                          </td>
                        </tr>
                      ))}
                      {derived.byStuck.length === 0 && (
                        <tr>
                          <td colSpan={4} className="ran-muted">
                            No topic data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <p className="ran-seam-note">
                Note: the backend tracks current progress, not day-by-day
                history, so a time-over-time trend isn&rsquo;t shown here.
                &ldquo;Avg time / student&rdquo; sums each topic&rsquo;s
                average, which is a lower-bound estimate.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, hint, accent }) {
  return (
    <div className={`ran-stat ${accent ? "ran-stat-accent" : ""}`}>
      <div className="ran-stat-label">{label}</div>
      <div className="ran-stat-value">{value}</div>
      {hint && <div className="ran-stat-hint">{hint}</div>}
    </div>
  );
}

function FunnelRow({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="ran-funnel-row">
      <div className="ran-funnel-top">
        <span className="ran-funnel-label">{label}</span>
        <span className="ran-funnel-count">
          {count.toLocaleString()}{" "}
          <span className="ran-funnel-pct">({pct}%)</span>
        </span>
      </div>
      <ProgressBar value={pct} showLabel={false} size="md" color={color} />
    </div>
  );
}

// ---- helpers --------------------------------------------------------------

function formatMinutes(min) {
  const m = Math.round(Number(min) || 0);
  if (m <= 0) return "0m";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

function readError(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback
  );
}

// ---- styles (page-local; aligned to the shared --rm-* palette) -----------

const ROADMAP_ANALYTICS_CSS = `
.ran-page {
  padding: 32px 40px 64px;
  max-width: 1120px;
  margin: 0 auto;
  color: var(--rm-text, #17130a);
  font-family: var(--rm-font-ui, system-ui, sans-serif);
}
.ran-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.ran-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.ran-subtitle { margin: 0; font-size: 14.5px; color: var(--rm-text-muted, #6b7280); }
.ran-controls { display: flex; align-items: center; gap: 10px; }
.ran-select-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--rm-text-muted, #6b7280);
}
.ran-select {
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--rm-border, #d9d5cc);
  background: var(--rm-surface, #fff);
  color: var(--rm-text, #17130a);
  min-width: 220px;
}
.ran-select:focus {
  outline: none;
  border-color: var(--rm-accent, #7c3aed);
  box-shadow: 0 0 0 3px var(--rm-accent-soft, rgba(124,58,237,.15));
}
.ran-btn-ghost {
  font-size: 13.5px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid var(--rm-border, #d9d5cc);
  background: transparent;
  color: var(--rm-text, #17130a);
  cursor: pointer;
}
.ran-btn-ghost:hover { background: var(--rm-surface-2, #f3f4f6); }
.ran-context {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px;
  color: var(--rm-text, #17130a);
}
.ran-muted { color: var(--rm-text-muted, #6b7280); }
.ran-link-btn {
  background: none; border: none; padding: 0;
  font-size: inherit; font-weight: 700;
  color: var(--rm-accent, #7c3aed); cursor: pointer;
}
.ran-link-btn:hover { text-decoration: underline; }

.ran-alert {
  padding: 12px 14px; border-radius: 10px;
  background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
  font-size: 14px; margin-bottom: 16px;
}
.ran-empty {
  padding: 28px; border-radius: 12px;
  background: var(--rm-surface, #fff);
  border: 1px dashed var(--rm-border, #d9d5cc);
  color: var(--rm-text-muted, #6b7280);
  text-align: center; font-size: 14.5px; margin-bottom: 16px;
}

/* Stat cards */
.ran-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.ran-stat {
  background: var(--rm-surface, #fff);
  border: 1px solid var(--rm-border, #d9d5cc);
  border-radius: var(--rm-radius-lg, 16px);
  padding: 18px 20px;
}
.ran-stat-accent {
  background: var(--rm-accent-soft, #ede9fe);
  border-color: var(--rm-accent, #7c3aed);
}
.ran-stat-label {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.04em; color: var(--rm-text-muted, #6b7280); margin-bottom: 8px;
}
.ran-stat-value {
  font-size: 30px; font-weight: 800; line-height: 1;
  color: var(--rm-text, #17130a); letter-spacing: -0.02em;
}
.ran-stat-hint { font-size: 12px; color: var(--rm-text-muted, #9ca3af); margin-top: 8px; }

/* Blocks */
.ran-card {
  background: var(--rm-surface, #fff);
  border: 1px solid var(--rm-border, #d9d5cc);
  border-radius: var(--rm-radius-lg, 16px);
  padding: 22px 24px;
}
.ran-block { margin-bottom: 22px; }
.ran-block-head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 12px; flex-wrap: wrap; margin-bottom: 18px;
}
.ran-block-head h3 { font-size: 16px; font-weight: 700; margin: 0; }
.ran-block-sub { font-size: 12.5px; color: var(--rm-text-muted, #9ca3af); }

/* Funnel */
.ran-funnel { display: flex; flex-direction: column; gap: 16px; }
.ran-funnel-top {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 6px;
}
.ran-funnel-label { font-size: 14px; font-weight: 600; }
.ran-funnel-count { font-size: 13.5px; font-weight: 700; }
.ran-funnel-pct { color: var(--rm-text-muted, #9ca3af); font-weight: 600; }

/* Per-topic bars */
.ran-topics { display: flex; flex-direction: column; gap: 10px; }
.ran-topic-row {
  display: grid;
  grid-template-columns: minmax(120px, 220px) 1fr 44px;
  align-items: center; gap: 12px;
}
.ran-topic-name {
  font-size: 13.5px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ran-topic-bar {
  display: flex; height: 12px; border-radius: 999px; overflow: hidden;
  background: var(--rm-surface-2, #f1efe9);
}
.ran-seg { display: block; height: 100%; }
.ran-seg-done { background: var(--rm-done, #16a34a); }
.ran-seg-prog { background: var(--rm-progress, #d97706); }
.ran-topic-pct { font-size: 13px; font-weight: 700; text-align: right; }
.ran-legend {
  display: flex; gap: 18px; margin-top: 16px;
  font-size: 12.5px; color: var(--rm-text-muted, #6b7280);
}
.ran-legend span { display: inline-flex; align-items: center; gap: 6px; }
.ran-dot { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
.ran-dot-done { background: var(--rm-done, #16a34a); }
.ran-dot-prog { background: var(--rm-progress, #d97706); }
.ran-dot-not { background: var(--rm-border-strong, #9ca3af); }

/* Table */
.ran-table-wrap { overflow-x: auto; }
.ran-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ran-table th {
  text-align: left; font-size: 12px; text-transform: uppercase;
  letter-spacing: 0.04em; color: var(--rm-text-muted, #6b7280);
  font-weight: 700; padding: 8px 12px; border-bottom: 2px solid var(--rm-border, #d9d5cc);
}
.ran-table td {
  padding: 11px 12px; border-bottom: 1px solid var(--rm-border, #eee);
}
.ran-table tbody tr:last-child td { border-bottom: none; }
.ran-num { text-align: right; font-variant-numeric: tabular-nums; }

.ran-seam-note {
  font-size: 12.5px; color: var(--rm-text-muted, #9ca3af);
  margin: 4px 0 0; line-height: 1.5;
}

@media (max-width: 640px) {
  .ran-page { padding: 24px 18px 48px; }
  .ran-header { flex-direction: column; }
  .ran-topic-row { grid-template-columns: minmax(90px, 140px) 1fr 40px; }
}
`;
