import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService from "../../services/roadmapService";
import { ROLE_CONFIG, STATUS_BADGE } from "./constants";
import { ruAccentStyle, useRuToast } from "./RuToast";
import StatsPanel from "./StatsPanel";
// FIX: this import was missing — UsageBadge.jsx already exists and is the
// exact shared component the Events/Meetings page uses to render its
// "0 / 5 this month" badge. It was never wired into the roadmap dashboard.
// ADJUST PATH: point this at wherever UsageBadge.jsx actually lives in your
// tree (same place the Events page imports it from).
import UsageBadge from "../plan/UsageBadge";
import "./roadmapUpgraded.css";

// UsageBadge expects a color-token object `c` (see UploadVideos.jsx-style
// usage in UsageBadge.jsx's own comments). The roadmap-upgraded screens
// theme themselves via CSS custom properties instead (--ru-accent /
// --ru-accent-soft, set per-role by ruAccentStyle() below), so this adapts
// that scheme into the shape UsageBadge needs rather than introducing a
// second color system. Swap this for your app's real color-token hook
// (e.g. getColors(isDark)) if one is already in scope here.
const RU_BADGE_COLORS = {
  cardBorder: "var(--ru-accent-soft)",
  cardBg: "transparent",
  textPrimary: "inherit",
  textSub: "inherit",
  divider: "var(--ru-accent-soft)",
  accent: "var(--ru-accent)",
  errorColor: "#ef4444",
};

/**
 * "My roadmaps" screen — GET /api/roadmap-upgraded/my — used by all four
 * role pages. Admin/super-admin roles additionally render the org usage
 * stats panel (GET /admin/stats or /super-admin/stats) below the list.
 *
 * FIX: also fetches GET /api/roadmap-upgraded/usage and renders a
 * <UsageBadge> next to "Generate roadmap" — this data existed on the
 * backend the whole time (RoadmapUpgradedService.getUsageStatus /
 * RoadmapUsageService), it just had no method in roadmapService.js and no
 * consumer here, so nothing ever showed up (compare Image 1 vs the working
 * Events page badge in Image 2).
 *
 * Props:
 *   role - "student" | "trainer" | "admin" | "superadmin"
 */
export default function RoadmapUpgradedDashboard({ role }) {
  const cfg = ROLE_CONFIG[role];
  const navigate = useNavigate();
  const { showToast, ToastEl } = useRuToast();

  const [roadmaps, setRoadmaps] = useState(null); // null = loading
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(null); // { tier, used, limit, period }

  useEffect(() => {
    let cancelled = false;
    roadmapService
      .getMyRoadmaps()
      .then((data) => !cancelled && setRoadmaps(data))
      .catch(
        (err) =>
          !cancelled && setError(err.message || "Couldn't load your roadmaps."),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Non-critical: if this fails, the roadmap list still renders fine,
    // the badge just doesn't show. Never surfaces as a page-level error.
    roadmapService
      .getUsageStatus()
      .then((data) => !cancelled && setUsage(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const activeRoadmaps = (roadmaps || []).length;
  const avgCompletion =
    roadmaps && roadmaps.length
      ? Math.round(
          roadmaps.reduce((s, r) => s + (r.completionPercent || 0), 0) /
            roadmaps.length,
        )
      : 0;
  const completedCount = (roadmaps || []).filter(
    (r) => r.status === "COMPLETED",
  ).length;

  return (
    <div className="ru-scope" style={ruAccentStyle(cfg)}>
      <div className="ru-stage">
        <div className="ru-eyebrow">{cfg.eyebrow}</div>
        <h1>{cfg.title}</h1>
        <p className="ru-lede">{cfg.lede}</p>

        <div className="ru-stat-row">
          <div className="ru-stat-box">
            <div className="ru-num">{activeRoadmaps}</div>
            <div className="ru-lbl">Roadmaps</div>
          </div>
          <div className="ru-stat-box">
            <div className="ru-num">{avgCompletion}%</div>
            <div className="ru-lbl">Avg. completion</div>
          </div>
          <div className="ru-stat-box">
            <div className="ru-num">{completedCount}</div>
            <div className="ru-lbl">Completed</div>
          </div>
        </div>

        <div className="ru-cta-generate">
          <div>
            <h4>{cfg.ctaTitle}</h4>
            <p>{cfg.ctaSub}</p>
            {usage && (
              <div style={{ marginTop: 10 }}>
                <UsageBadge
                  used={usage.used}
                  limit={usage.limit === "unlimited" ? null : usage.limit}
                  unlimited={usage.limit === "unlimited"}
                  period="month"
                  label="Roadmap generations"
                  c={RU_BADGE_COLORS}
                />
              </div>
            )}
          </div>
          <button
            className="ru-btn ru-btn-primary"
            onClick={() => navigate(`${cfg.basePath}/new`)}
          >
            ＋ Generate roadmap
          </button>
        </div>

        {error && <div className="ru-error">{error}</div>}

        {roadmaps === null && !error && (
          <div className="ru-loading">Loading your roadmaps…</div>
        )}

        {roadmaps && roadmaps.length === 0 && (
          <div className="ru-empty-state">
            No roadmaps yet — generate your first one above.
          </div>
        )}

        {roadmaps && roadmaps.length > 0 && (
          <div className="ru-roadmap-list">
            {roadmaps.map((rm) => (
              <div
                key={rm.id}
                className="ru-rm-item"
                onClick={() => navigate(`${cfg.basePath}/${rm.id}`)}
              >
                <div style={{ flex: 1 }}>
                  <div className="ru-rm-name">{rm.targetRole}</div>
                  <div className="ru-rm-meta">
                    {formatPathType(rm.pathType)} · {rm.totalWeeks ?? "?"} weeks
                    · {rm.totalModules ?? (rm.modules?.length || 0)} modules ·{" "}
                    {Math.round(rm.completionPercent || 0)}% complete
                  </div>
                </div>
                <span className="ru-badge">
                  {STATUS_BADGE[rm.status] || rm.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          className="ru-note"
          dangerouslySetInnerHTML={{ __html: cfg.note }}
        />

        {cfg.canSeeOrgStats && <StatsPanel role={role} />}
      </div>
      {ToastEl}
    </div>
  );
}

function formatPathType(pathType) {
  if (!pathType) return "Roadmap";
  return pathType
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export { formatPathType };
