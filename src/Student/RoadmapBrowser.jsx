import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService from "../services/roadmapService";
import RoadmapCard from "../components/roadmap/RoadmapCard";
import "../components/roadmap/roadmap-tokens.css";

/**
 * Student · RoadmapBrowser
 * Lists the published roadmaps in the student's org and merges in the
 * completion % from the student's dashboard.
 *
 * Backend:
 *   GET /api/progress/roadmaps            -> PagedResponse<RoadmapListItemResponse>
 *   GET /api/progress/roadmaps/dashboard  -> StudentDashboardResponse
 */
export default function RoadmapBrowser() {
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // dashboard is best-effort; the list is the essential call
        const [listPage, dash] = await Promise.all([
          roadmapService.listRoadmaps({ page: 0, size: 100 }),
          roadmapService.getStudentDashboard().catch(() => null),
        ]);
        if (!alive) return;
        setRoadmaps(listPage?.content || []);
        setDashboard(dash);
      } catch (e) {
        if (!alive) return;
        setError(readError(e, "Could not load roadmaps."));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // completion % by slug, from the dashboard's enrolled roadmaps
  const completionBySlug = useMemo(() => {
    const map = {};
    (dashboard?.enrolledRoadmaps || []).forEach((e) => {
      if (e.slug != null) map[e.slug] = e.completionPercent;
    });
    return map;
  }, [dashboard]);

  const categories = useMemo(() => {
    const set = new Set();
    roadmaps.forEach((r) => r.category && set.add(r.category));
    return ["All", ...Array.from(set).sort()];
  }, [roadmaps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roadmaps.filter((r) => {
      const matchesCat =
        activeCategory === "All" || r.category === activeCategory;
      const matchesSearch =
        !q ||
        (r.title || "").toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [roadmaps, search, activeCategory]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--rm-dark-bg, #0f1117)",
        color: "var(--rm-dark-text, #e6e8ec)",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
      }}
    >
      <div
        style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 64px" }}
      >
        {/* Header */}
        <header style={{ marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>Roadmaps</h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "var(--rm-dark-text-muted, #9aa1ac)",
            }}
          >
            Structured learning paths. Pick one and track your progress.
          </p>
        </header>

        {/* Dashboard summary */}
        {dashboard && (
          <div
            style={{
              display: "flex",
              gap: 24,
              margin: "20px 0 8px",
              flexWrap: "wrap",
            }}
          >
            <Stat label="Enrolled" value={dashboard.totalEnrolled ?? 0} />
            <Stat
              label="Avg. completion"
              value={`${Math.round(dashboard.averageCompletionPercent || 0)}%`}
            />
          </div>
        )}

        {/* Search + categories */}
        <div style={{ margin: "24px 0" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roadmaps…"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid var(--rm-dark-border, #2a2f3a)",
              background: "var(--rm-dark-surface, #171a21)",
              color: "var(--rm-dark-text, #e6e8ec)",
              fontSize: 15,
              outline: "none",
            }}
          />
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}
          >
            {categories.map((c) => {
              const active = c === activeCategory;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1px solid ${
                      active
                        ? "var(--rm-accent, #7c3aed)"
                        : "var(--rm-dark-border, #2a2f3a)"
                    }`,
                    background: active
                      ? "var(--rm-accent, #7c3aed)"
                      : "transparent",
                    color: active
                      ? "#fff"
                      : "var(--rm-dark-text-muted, #9aa1ac)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* States */}
        {loading && <SkeletonGrid />}
        {!loading && error && <Banner tone="error">{error}</Banner>}
        {!loading && !error && filtered.length === 0 && (
          <Banner tone="muted">No roadmaps match your search.</Banner>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {filtered.map((r) => (
              <RoadmapCard
                key={r.id ?? r.slug}
                variant="dark"
                title={r.title}
                category={r.category}
                thumbnailUrl={r.thumbnailUrl}
                nodeCount={r.totalNodes}
                completionPercent={completionBySlug[r.slug] ?? 0}
                showProgress={completionBySlug[r.slug] != null}
                onClick={() => navigate(`/student/roadmap/${r.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
      <div
        style={{ fontSize: 12.5, color: "var(--rm-dark-text-muted, #9aa1ac)" }}
      >
        {label}
      </div>
    </div>
  );
}

function Banner({ children, tone }) {
  const colors =
    tone === "error"
      ? { bg: "rgba(220,38,38,.12)", border: "#dc2626", text: "#fca5a5" }
      : {
          bg: "var(--rm-dark-surface, #171a21)",
          border: "var(--rm-dark-border, #2a2f3a)",
          text: "var(--rm-dark-text-muted, #9aa1ac)",
        };
  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 18,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 150,
            borderRadius: 16,
            background:
              "linear-gradient(90deg, #171a21 25%, #1e222b 37%, #171a21 63%)",
            backgroundSize: "400% 100%",
            animation: "rm-shimmer 1.4s ease infinite",
          }}
        />
      ))}
      <style>{`@keyframes rm-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
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
