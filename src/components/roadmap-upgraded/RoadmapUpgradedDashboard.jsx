import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService from "../../services/roadmapService";
import { ROLE_CONFIG, STATUS_BADGE } from "./constants";
import { ruAccentStyle, useRuToast } from "./RuToast";
import StatsPanel from "./StatsPanel";
import "./roadmapUpgraded.css";

/**
 * "My roadmaps" screen — GET /api/roadmap-upgraded/my — used by all four
 * role pages. Admin/super-admin roles additionally render the org usage
 * stats panel (GET /admin/stats or /super-admin/stats) below the list.
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

  useEffect(() => {
    let cancelled = false;
    roadmapService
      .getMyRoadmaps()
      .then((data) => !cancelled && setRoadmaps(data))
      .catch((err) => !cancelled && setError(err.message || "Couldn't load your roadmaps."));
    return () => {
      cancelled = true;
    };
  }, []);

  const activeRoadmaps = (roadmaps || []).length;
  const avgCompletion = roadmaps && roadmaps.length
    ? Math.round(roadmaps.reduce((s, r) => s + (r.completionPercent || 0), 0) / roadmaps.length)
    : 0;
  const completedCount = (roadmaps || []).filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="ru-scope" style={ruAccentStyle(cfg)}>
      <div className="ru-stage">
        <div className="ru-eyebrow">{cfg.eyebrow}</div>
        <h1>{cfg.title}</h1>
        <p className="ru-lede">{cfg.lede}</p>

        <div className="ru-stat-row">
          <div className="ru-stat-box"><div className="ru-num">{activeRoadmaps}</div><div className="ru-lbl">Roadmaps</div></div>
          <div className="ru-stat-box"><div className="ru-num">{avgCompletion}%</div><div className="ru-lbl">Avg. completion</div></div>
          <div className="ru-stat-box"><div className="ru-num">{completedCount}</div><div className="ru-lbl">Completed</div></div>
        </div>

        <div className="ru-cta-generate">
          <div>
            <h4>{cfg.ctaTitle}</h4>
            <p>{cfg.ctaSub}</p>
          </div>
          <button className="ru-btn ru-btn-primary" onClick={() => navigate(`${cfg.basePath}/new`)}>
            ＋ Generate roadmap
          </button>
        </div>

        {error && <div className="ru-error">{error}</div>}

        {roadmaps === null && !error && <div className="ru-loading">Loading your roadmaps…</div>}

        {roadmaps && roadmaps.length === 0 && (
          <div className="ru-empty-state">No roadmaps yet — generate your first one above.</div>
        )}

        {roadmaps && roadmaps.length > 0 && (
          <div className="ru-roadmap-list">
            {roadmaps.map((rm) => (
              <div key={rm.id} className="ru-rm-item" onClick={() => navigate(`${cfg.basePath}/${rm.id}`)}>
                <div style={{ flex: 1 }}>
                  <div className="ru-rm-name">{rm.targetRole}</div>
                  <div className="ru-rm-meta">
                    {formatPathType(rm.pathType)} · {rm.totalWeeks ?? "?"} weeks · {rm.totalModules ?? (rm.modules?.length || 0)} modules · {Math.round(rm.completionPercent || 0)}% complete
                  </div>
                </div>
                <span className="ru-badge">{STATUS_BADGE[rm.status] || rm.status}</span>
              </div>
            ))}
          </div>
        )}

        <div className="ru-note" dangerouslySetInnerHTML={{ __html: cfg.note }} />

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
