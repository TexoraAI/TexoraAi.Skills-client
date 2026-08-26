import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService from "../../services/roadmapService";
import ProgressBar from "../../components/roadmap/ProgressBar";
import "../../components/roadmap/roadmap-tokens.css";

/**
 * Super Admin · PlatformOverviewPage
 * A platform-level snapshot of the roadmap template catalogue.
 *
 * HONESTY NOTE — what the backend actually supports:
 *   The only super-admin, platform-wide data source is
 *     GET /api/progress/roadmaps/admin/templates  (PagedResponse<TemplateResponse>)
 *   which is PUBLISHED-templates-only. Everything below is derived from that:
 *     • published template count, total topics, category mix, versions, dates.
 *   There is NO endpoint for:
 *     • number of organizations
 *     • students engaged platform-wide
 *     • clones per template ("most cloned")
 *     • adoption over time (monthly trend)
 *   The dummy page fabricated all of those. Rather than invent numbers, we show
 *   the real catalogue metrics and disclose the unavailable ones in a clearly
 *   labelled panel, so the page never misleads.
 *
 * TemplateResponse boolean JSON keys: "published"/"archived"; nodeCount =
 * totalNodes.
 */

const TEMPLATE_ROUTE = "/superadmin/roadmap-templates";

const UNAVAILABLE_METRICS = [
  {
    label: "Organizations on platform",
    need: "a tenant/org count endpoint (org data lives in a different service)",
  },
  {
    label: "Students engaged",
    need: "a platform-wide progress aggregate across all orgs",
  },
  {
    label: "Clones per template",
    need: "a count of org roadmaps grouped by sourceTemplateId",
  },
  {
    label: "Adoption over time",
    need: "a time series of publishes/clones per month",
  },
];

export default function PlatformOverviewPage() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setForbidden(false);
    try {
      const res = await roadmapService.listTemplates({ page: 0, size: 100 });
      setTemplates(res?.content || []);
      setTotal(res?.totalElements ?? (res?.content || []).length);
    } catch (e) {
      if (e?.response?.status === 403) setForbidden(true);
      else setError(readError(e, "Could not load the platform overview."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const totalTopics = templates.reduce(
      (sum, t) => sum + (t.totalNodes || 0),
      0,
    );
    const categorySet = new Set(
      templates.map((t) => t.category).filter((c) => c && c.trim()),
    );
    const avgTopics = templates.length
      ? Math.round(totalTopics / templates.length)
      : 0;
    return {
      publishedCount: total,
      loadedCount: templates.length,
      totalTopics,
      categoryCount: categorySet.size,
      avgTopics,
    };
  }, [templates, total]);

  // Real category distribution (counts of published templates per category).
  const categoryDist = useMemo(() => {
    const map = new Map();
    templates.forEach((t) => {
      const key = (t.category && t.category.trim()) || "Uncategorized";
      map.set(key, (map.get(key) || 0) + 1);
    });
    const rows = Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
    }));
    rows.sort((a, b) => b.count - a.count);
    const max = rows.reduce((m, r) => Math.max(m, r.count), 0);
    return { rows, max };
  }, [templates]);

  // Templates ranked by size (real signal — NOT clone count, which we don't have).
  const ranked = useMemo(() => {
    return [...templates]
      .sort((a, b) => (b.totalNodes || 0) - (a.totalNodes || 0))
      .slice(0, 8);
  }, [templates]);

  if (forbidden) {
    return (
      <Shell>
        <ForbiddenPanel />
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={headerRow}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
            Platform overview
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "var(--rm-text-muted, #6b7280)",
              fontSize: 14,
            }}
          >
            Global roadmap template catalogue at a glance.
          </p>
        </div>
        <button
          style={primaryBtnStyle}
          onClick={() => navigate(TEMPLATE_ROUTE)}
        >
          Manage templates →
        </button>
      </div>

      {error && (
        <div style={errorBar}>
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            style={{ ...linkBtnStyle, color: "#b91c1c" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <Centered>Loading overview…</Centered>
      ) : (
        <>
          {/* real stat cards */}
          <div style={statGrid}>
            <StatCard
              label="Published templates"
              value={stats.publishedCount}
            />
            <StatCard
              label="Topics across templates"
              value={stats.totalTopics}
            />
            <StatCard label="Categories" value={stats.categoryCount} />
            <StatCard label="Avg topics / template" value={stats.avgTopics} />
          </div>
          <p style={dataScopeNote}>
            Figures cover <strong>published</strong> templates only
            {stats.publishedCount > stats.loadedCount
              ? ` (showing the first ${stats.loadedCount} of ${stats.publishedCount})`
              : ""}
            . Drafts aren’t included — the catalogue endpoint returns published
            templates.
          </p>

          <div style={twoCol}>
            {/* category distribution (real) */}
            <section style={panel}>
              <h2 style={panelTitle}>Templates by category</h2>
              {categoryDist.rows.length === 0 ? (
                <Empty>No published templates yet.</Empty>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {categoryDist.rows.map((r) => {
                    const pct = categoryDist.max
                      ? (r.count / categoryDist.max) * 100
                      : 0;
                    return (
                      <div key={r.category}>
                        <div style={distRow}>
                          <span style={{ fontWeight: 600 }}>{r.category}</span>
                          <span
                            style={{ color: "var(--rm-text-muted, #6b7280)" }}
                          >
                            {r.count}
                          </span>
                        </div>
                        <ProgressBar
                          percentage={pct}
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* largest templates (real; ranked by topic count) */}
            <section style={panel}>
              <h2 style={panelTitle}>Largest templates</h2>
              <p style={panelSub}>
                Ranked by number of topics. (Clone/adoption counts aren’t
                available — see below.)
              </p>
              {ranked.length === 0 ? (
                <Empty>No published templates yet.</Empty>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {ranked.map((t, i) => (
                    <li
                      key={t.id}
                      style={rankRow}
                      onClick={() => navigate(`${TEMPLATE_ROUTE}/${t.id}/edit`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          navigate(`${TEMPLATE_ROUTE}/${t.id}/edit`);
                      }}
                    >
                      <span style={rankNum}>{i + 1}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {t.title}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--rm-text-muted, #6b7280)",
                          }}
                        >
                          {t.category || "Uncategorized"} · v{t.version ?? 1}
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--rm-text-muted, #6b7280)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.totalNodes ?? 0} topics
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* honest disclosure of unavailable metrics */}
          <section style={{ ...panel, marginTop: 20 }}>
            <h2 style={panelTitle}>Not available yet</h2>
            <p style={panelSub}>
              These platform metrics need backend endpoints that don’t exist in
              the progress service today. They’re listed here instead of being
              shown with placeholder numbers.
            </p>
            <div style={unavailGrid}>
              {UNAVAILABLE_METRICS.map((m) => (
                <div key={m.label} style={unavailCard}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "var(--rm-border-strong, #b9b3a6)",
                      margin: "4px 0",
                    }}
                  >
                    —
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--rm-text-muted, #6b7280)",
                      lineHeight: 1.5,
                    }}
                  >
                    Needs {m.need}.
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--rm-text-muted, #6b7280)",
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--rm-bg, #f5f3ee)",
        color: "var(--rm-text, #17130a)",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
        padding: "28px clamp(16px, 5vw, 56px)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function ForbiddenPanel() {
  return (
    <div
      style={{
        maxWidth: 560,
        margin: "60px auto 0",
        textAlign: "center",
        padding: 32,
        background: "var(--rm-surface, #fff)",
        border: "1px solid var(--rm-border, #d9d5cc)",
        borderRadius: 16,
      }}
    >
      <div style={{ fontSize: 40 }}>🔒</div>
      <h2 style={{ margin: "10px 0 6px", fontSize: 20, fontWeight: 800 }}>
        Super admin only
      </h2>
      <p
        style={{
          margin: 0,
          color: "var(--rm-text-muted, #6b7280)",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        The platform overview is restricted to super administrators.
      </p>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: 240,
        color: "var(--rm-text-muted, #6b7280)",
        fontSize: 14.5,
      }}
    >
      {children}
    </div>
  );
}

function Empty({ children }) {
  return (
    <p
      style={{
        fontSize: 13.5,
        color: "var(--rm-text-muted, #6b7280)",
        margin: 0,
      }}
    >
      {children}
    </p>
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

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const headerRow = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 20,
};

const errorBar = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  background: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  borderRadius: 10,
  padding: "9px 14px",
  fontSize: 13.5,
  marginBottom: 16,
};

const statGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
};

const statCard = {
  background: "var(--rm-surface, #fff)",
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: 14,
  padding: "18px 20px",
};

const dataScopeNote = {
  fontSize: 12.5,
  color: "var(--rm-text-muted, #6b7280)",
  margin: "10px 2px 22px",
  lineHeight: 1.5,
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 18,
};

const panel = {
  background: "var(--rm-surface, #fff)",
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: 16,
  padding: 20,
};

const panelTitle = { margin: "0 0 4px", fontSize: 16, fontWeight: 800 };
const panelSub = {
  margin: "0 0 16px",
  fontSize: 12.5,
  color: "var(--rm-text-muted, #6b7280)",
  lineHeight: 1.5,
};

const distRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
  marginBottom: 5,
};

const rankRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 6px",
  borderTop: "1px solid var(--rm-border, #d9d5cc)",
  cursor: "pointer",
};

const rankNum = {
  width: 24,
  height: 24,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: 999,
  background: "var(--rm-surface-2, #faf9f6)",
  border: "1px solid var(--rm-border, #d9d5cc)",
  fontSize: 12,
  fontWeight: 700,
};

const unavailGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 12,
};

const unavailCard = {
  background: "var(--rm-surface-2, #faf9f6)",
  border: "1px dashed var(--rm-border-strong, #b9b3a6)",
  borderRadius: 12,
  padding: "14px 16px",
};

const primaryBtnStyle = {
  border: "none",
  background: "var(--rm-accent, #7c3aed)",
  color: "#fff",
  borderRadius: 9,
  padding: "9px 16px",
  fontSize: 13.5,
  fontWeight: 700,
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
