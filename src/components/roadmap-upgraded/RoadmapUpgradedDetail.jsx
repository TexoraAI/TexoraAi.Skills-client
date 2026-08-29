import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import roadmapService from "../../services/roadmapService";
import { ROLE_CONFIG } from "./constants";
import { formatPathType } from "./RoadmapUpgradedDashboard";
import { ruAccentStyle, useRuToast } from "./RuToast";
import ModuleTree from "./ModuleTree";
import MentorPanel from "./MentorPanel";
import "./roadmapUpgraded.css";

/**
 * GET /api/roadmap-upgraded/{id} + all the per-roadmap actions:
 *   - mark a resource complete   POST /resource/{id}/complete
 *   - regenerate remaining       POST /{id}/regenerate
 *   - clone as template          POST /{id}/clone      (trainer only, per cfg.canClone)
 *   - ask the AI mentor          POST /mentor/ask + GET /mentor/{id}/history
 *
 * Props:
 *   role - "student" | "trainer" | "admin" | "superadmin"
 */
export default function RoadmapUpgradedDetail({ role }) {
  const cfg = ROLE_CONFIG[role];
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, ToastEl } = useRuToast();

  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);

  const load = useCallback(() => {
    roadmapService
      .getRoadmapById(id)
      .then(setRoadmap)
      .catch((err) => setError(err.message || "Couldn't load this roadmap."));
  }, [id]);

  useEffect(() => {
    setRoadmap(null);
    setError("");
    load();
  }, [load]);

  async function handleCompleteResource(resourceId, quizScore) {
    try {
      const updated = await roadmapService.markResourceComplete(
        resourceId,
        quizScore,
      );
      setRoadmap(updated);
      showToast("Marked complete");
    } catch (err) {
      showToast(err.message || "Couldn't update that resource.");
    }
  }

  async function handleRegenerate() {
    if (busy) return;
    setBusy(true);
    showToast("Re-ranking remaining modules…");
    try {
      const updated = await roadmapService.regenerateRemainingModules(id);
      setRoadmap(updated);
      showToast("Remaining modules regenerated");
    } catch (err) {
      showToast(err.message || "Couldn't regenerate this roadmap.");
    } finally {
      setBusy(false);
    }
  }

  async function handleClone() {
    if (busy) return;
    setBusy(true);
    try {
      const clone = await roadmapService.cloneAsTemplate(id);
      showToast("Cloned — new template created in your dashboard");
      navigate(`${cfg.basePath}/${clone.id}`);
    } catch (err) {
      showToast(err.message || "Couldn't clone this roadmap.");
    } finally {
      setBusy(false);
    }
  }

  // function handleExport() {
  //   showToast("PDF export isn't wired up on the backend yet.");
  // }

  async function handleExport() {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await roadmapService.exportRoadmapPdfBlob(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(roadmap?.targetRole || "roadmap").replace(/[^a-z0-9]+/gi, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Roadmap PDF downloaded");
    } catch (err) {
      showToast(err.message || "Couldn't export this roadmap.");
    } finally {
      setBusy(false);
    }
  }

  function handleLockedClick(moduleTitle) {
    showToast(`Locked — finish the module before "${moduleTitle}" first`);
  }

  if (error) {
    return (
      <div className="ru-scope" style={ruAccentStyle(cfg)}>
        <div className="ru-stage">
          <div className="ru-error">{error}</div>
          <button
            className="ru-btn ru-btn-ghost"
            style={{ marginTop: 16 }}
            onClick={() => navigate(cfg.basePath)}
          >
            ← Back to your roadmaps
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="ru-scope" style={ruAccentStyle(cfg)}>
        <div className="ru-stage">
          <div className="ru-loading">Loading roadmap…</div>
        </div>
      </div>
    );
  }

  const currentModule = (roadmap.modules || []).find(
    (m) => (m.progressPercent ?? 0) < 100 && !m.locked,
  );
  const contextLabel = currentModule
    ? `Currently on Module ${(currentModule.orderIndex ?? 0) + 1} — ${currentModule.title}`
    : undefined;

  return (
    <div className="ru-scope" style={ruAccentStyle(cfg)}>
      <div className="ru-stage">
        <div className="ru-eyebrow">CURATED LEARNING PATH · OWNED BY YOU</div>
        <h1>{roadmap.targetRole}</h1>
        <p className="ru-lede">
          {formatPathType(roadmap.pathType)} · {roadmap.domain} ·{" "}
          {roadmap.totalModules ?? (roadmap.modules?.length || 0)} modules ·{" "}
          {roadmap.totalWeeks ?? "?"} weeks
        </p>

        <div className="ru-stat-row">
          <div className="ru-stat-box">
            <div className="ru-num">
              {roadmap.totalModules ?? (roadmap.modules?.length || 0)}
            </div>
            <div className="ru-lbl">Modules</div>
          </div>
          <div className="ru-stat-box">
            <div className="ru-num">{roadmap.totalWeeks ?? "—"}</div>
            <div className="ru-lbl">Weeks</div>
          </div>
          <div className="ru-stat-box">
            <div className="ru-num">
              {Math.round(roadmap.completionPercent || 0)}%
            </div>
            <div className="ru-lbl">Complete</div>
          </div>
        </div>

        <div className="ru-tool-row">
          <button className="ru-tool-btn" onClick={handleExport}>
            ⤓ Export as PDF
          </button>
          <button
            className="ru-tool-btn"
            disabled={busy}
            onClick={handleRegenerate}
          >
            ↻ Regenerate remaining modules
          </button>
          {cfg.canClone && (
            <button
              className="ru-tool-btn"
              disabled={busy}
              onClick={handleClone}
            >
              ⧉ Clone as new batch template
            </button>
          )}
          <button className="ru-tool-btn" onClick={() => setMentorOpen(true)}>
            💬 Ask AI Mentor about this path
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          <ModuleTree
            modules={roadmap.modules}
            onCompleteResource={handleCompleteResource}
            onLockedClick={handleLockedClick}
          />
        </div>

        <div className="ru-note">
          <b>Adaptive:</b> completing resources unlocks the next module
          automatically once the current one hits 100%.
        </div>
      </div>

      <MentorPanel
        open={mentorOpen}
        onClose={() => setMentorOpen(false)}
        syllabusId={roadmap.id}
        roadmapTitle={roadmap.targetRole}
        contextLabel={contextLabel}
      />
      {ToastEl}
    </div>
  );
}
