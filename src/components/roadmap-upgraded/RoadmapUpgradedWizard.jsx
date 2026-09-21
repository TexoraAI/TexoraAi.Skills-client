import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService from "../../services/roadmapService";
import {
  DOMAINS,
  CONTENT_SOURCES,
  pathTypesForRole,
  ROLE_CONFIG,
} from "./constants";
import { ruAccentStyle, useRuToast } from "./RuToast";
// FIX: these two were never imported here, even though both already exist
// and already understand this exact backend error. planErrorHandler.js's
// ERROR_CODE_META already has a ROADMAP_LIMIT_EXCEEDED entry
// (planType: "individual", the right message) — it was just never called
// from this file's generate() catch block, so the 429 from
// RoadmapUsageLimitExceededException fell through to the plain
// setError(...) path below instead of opening the upgrade popup.
// ADJUST PATH: point these at wherever they actually live in your tree
// (same place other gated features import them from).
import { parsePlanError } from "../../services/planErrorHandler";
import UpgradeModal from "../plan/UpgradeModal";
import "./roadmapUpgraded.css";

const BUILD_STAGES = [
  "Modules planned",
  "Sources ranked",
  "Quality check",
  "Finalizing",
];

// Best-effort read of the current user id out of the stored JWT, purely as
// a default for <UpgradeModal userId={...}/> below.
// TODO: replace with your app's real current-user id source (an auth
// context / useCurrentUser() hook, etc.) if one exists elsewhere in this
// codebase — this is only a fallback so the modal has *something* to pass.
function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId ?? payload.id ?? payload.sub ?? null;
  } catch {
    return null;
  }
}

/**
 * Generate flow: pick domain -> path type -> target role + content sources,
 * then POST /generate. The backend call is a single synchronous request (no
 * job id / polling endpoint exists), so the "building" screen below is a
 * cosmetic progress animation that runs while the real request is in
 * flight, and completes the moment the response actually comes back.
 *
 * FIX: generate() now runs a failed request through parsePlanError() and,
 * if the backend rejected it with 429 ROADMAP_LIMIT_EXCEEDED (monthly quota
 * hit — see RoadmapUsageService.checkAndIncrement), opens <UpgradeModal>
 * instead of just printing a plain inline error. usage.tier (fetched once
 * on mount from GET /usage) feeds the modal's currentPlan so it can offer
 * the right upgrade targets.
 *
 * Props:
 *   role - "student" | "trainer" | "admin" | "superadmin"
 */
export default function RoadmapUpgradedWizard({ role }) {
  const cfg = ROLE_CONFIG[role];
  const pathTypes = pathTypesForRole(role);
  const navigate = useNavigate();
  const { showToast, ToastEl } = useRuToast();

  const [step, setStep] = useState("form"); // "form" | "building"
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [pathType, setPathType] = useState(pathTypes[0].value);
  const [targetRole, setTargetRole] = useState("");
  const [sources, setSources] = useState(() =>
    CONTENT_SOURCES.map((s) => s.value),
  );
  const [error, setError] = useState("");

  const [pct, setPct] = useState(0);
  const [stageIdx, setStageIdx] = useState(-1);
  const [resultId, setResultId] = useState(null);
  const [requestDone, setRequestDone] = useState(false);
  const timerRef = useRef(null);

  // FIX: usage (for currentPlan) + upgradeModalConfig (set from
  // parsePlanError when the quota is hit).
  const [usage, setUsage] = useState(null);
  const [upgradeModalConfig, setUpgradeModalConfig] = useState(null);

  useEffect(() => {
    let cancelled = false;
    roadmapService
      .getUsageStatus()
      .then((data) => !cancelled && setUsage(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSource(value) {
    setSources((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  }

  async function generate() {
    if (!targetRole.trim()) {
      setError("Tell us your target role, skill, task or certification first.");
      return;
    }
    setError("");
    setStep("building");
    setPct(0);
    setStageIdx(0);
    setRequestDone(false);
    setResultId(null);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPct((p) => {
        const next = Math.min(p + 4, 90);
        setStageIdx(
          Math.min(
            BUILD_STAGES.length - 1,
            Math.floor((next / 100) * BUILD_STAGES.length),
          ),
        );
        return next;
      });
    }, 220);

    try {
      // Returns almost instantly now: READY (library fast-path) or
      // GENERATING (real generation kicked off in the background).
      const shell = await roadmapService.generateRoadmap({
        domain,
        pathType,
        targetRole: targetRole.trim(),
        language: "English",
        contentSources: sources,
        fromLibrary: false,
      });

      if (shell.status === "READY") {
        finishBuilding(shell.id);
        return;
      }

      pollUntilReady(shell.id);
    } catch (err) {
      clearInterval(timerRef.current);
      setStep("form");

      // FIX: check for the quota-exceeded shape before falling back to a
      // plain error string. This is the exact check the Events/Meetings
      // page already does for MEETING_LIMIT_EXCEEDED — roadmaps just never
      // had it.
      const planError = parsePlanError(err);
      if (planError) {
        setUpgradeModalConfig(planError);
      } else {
        setError(err.message || "Couldn't generate that roadmap — try again.");
      }
    }
  }

  function finishBuilding(id) {
    clearInterval(timerRef.current);
    setPct(100);
    setStageIdx(BUILD_STAGES.length);
    setResultId(id);
    setRequestDone(true);
  }

  function pollUntilReady(id, attempt = 0) {
    const MAX_ATTEMPTS = 100; // ~5 minutes at 3s intervals
    if (attempt >= MAX_ATTEMPTS) {
      clearInterval(timerRef.current);
      setError(
        "This is taking longer than usual — check 'My roadmaps' shortly, it should be ready.",
      );
      setStep("form");
      return;
    }
    setTimeout(async () => {
      try {
        const roadmap = await roadmapService.getRoadmapById(id);
        if (roadmap.status === "READY") {
          finishBuilding(id);
        } else if (roadmap.status === "FAILED") {
          clearInterval(timerRef.current);
          setError("Something went wrong generating this roadmap — try again.");
          setStep("form");
        } else {
          pollUntilReady(id, attempt + 1);
        }
      } catch (err) {
        clearInterval(timerRef.current);
        setError(err.message || "Couldn't check roadmap status — try again.");
        setStep("form");
      }
    }, 3000);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  if (step === "building") {
    return (
      <div className="ru-scope" style={ruAccentStyle(cfg)}>
        <div className="ru-stage">
          <div className="ru-eyebrow">GENERATING</div>
          <h1>Building: {targetRole || "New roadmap"}</h1>
          <p className="ru-lede">
            Ranking sources, checking difficulty and duration, removing
            duplicates, sequencing prerequisites.
          </p>

          <div
            className="ru-panel"
            style={{ textAlign: "center", padding: "48px 30px" }}
          >
            <div style={{ fontSize: "2.1rem", marginBottom: 16 }}>⟳</div>
            <h3>Engine is assembling your path</h3>

            <div
              className="ru-rail"
              style={{ maxWidth: 560, margin: "28px auto 0" }}
            >
              {BUILD_STAGES.map((label, i) => (
                <RailStep
                  key={label}
                  label={label}
                  state={i < stageIdx ? "done" : i === stageIdx ? "now" : ""}
                  last={i === BUILD_STAGES.length - 1}
                />
              ))}
            </div>

            <div id="ru-buildBar">
              <div id="ru-buildBarFill" style={{ width: `${pct}%` }} />
            </div>
            <p className="ru-build-pct">
              {pct < 100 ? `Processing… ${pct}%` : "Done"}
            </p>
          </div>

          <div className="ru-btn-row" style={{ justifyContent: "center" }}>
            <button
              className="ru-btn ru-btn-primary"
              disabled={!requestDone}
              onClick={() => navigate(`${cfg.basePath}/${resultId}`)}
            >
              {requestDone ? "✓ Ready — view your roadmap →" : "Generating…"}
            </button>
          </div>
        </div>
        {ToastEl}
      </div>
    );
  }

  return (
    <div className="ru-scope" style={ruAccentStyle(cfg)}>
      <div className="ru-stage">
        <div className="ru-eyebrow">STEP-BY-STEP GENERATOR</div>
        <h1>Build your roadmap</h1>
        <p className="ru-lede">
          Three quick choices. The engine pulls from video, articles, PDFs and
          practice sets — not just one source.
        </p>

        <div className="ru-panel">
          <h3>Step 1 — Pick a domain</h3>
          <div className="ru-sub">
            Which world should the roadmap draw from?
          </div>
          <div className="ru-grid-cards">
            {DOMAINS.map((d) => (
              <div
                key={d}
                className={`ru-opt-card${domain === d ? " selected" : ""}`}
                onClick={() => setDomain(d)}
              >
                <div className="ru-oc-title">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ru-panel">
          <h3>Step 2 — Choose your path type</h3>
          <div className="ru-sub">
            {role === "student"
              ? "Job Profile, Skill, Task or Certification — pick based on how deep you want to go."
              : "Same four types as everyone, plus Course/Batch for cohort-style teaching."}
          </div>
          <div className="ru-grid-cards">
            {pathTypes.map((t) => (
              <div
                key={t.value}
                className={`ru-opt-card${pathType === t.value ? " selected" : ""}`}
                onClick={() => setPathType(t.value)}
              >
                <div className="ru-oc-title">
                  {t.label} <span className="ru-oc-tag">{t.tag}</span>
                </div>
                <div className="ru-oc-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ru-panel">
          <h3>Step 3 — Tell us your target</h3>
          <div className="ru-sub">
            Type a role, skill, task or certification.
          </div>
          <input
            type="text"
            className="ru-input"
            placeholder="e.g. Full-stack Developer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />

          <div className="ru-sub" style={{ marginTop: 22, marginBottom: 8 }}>
            Content sources — this is where we go further than a single-platform
            curator
          </div>
          <div className="ru-chip-row">
            {CONTENT_SOURCES.map((s) => (
              <div
                key={s.value}
                className={`ru-chip${sources.includes(s.value) ? " selected" : ""}`}
                onClick={() => toggleSource(s.value)}
              >
                {s.icon} {s.label}
              </div>
            ))}
          </div>
        </div>

        {error && <div className="ru-error">{error}</div>}

        <div className="ru-btn-row">
          <button
            className="ru-btn ru-btn-ghost"
            onClick={() => navigate(cfg.basePath)}
          >
            ← Back
          </button>
          <button className="ru-btn ru-btn-primary" onClick={generate}>
            Generate roadmap →
          </button>
        </div>
      </div>

      {upgradeModalConfig && (
        <UpgradeModal
          isOpen={!!upgradeModalConfig}
          onClose={() => setUpgradeModalConfig(null)}
          planType={upgradeModalConfig.planType}
          userId={getUserIdFromToken()}
          currentPlan={usage?.tier || "free"}
          availableTargetPlans={["pro", "premium"].filter(
            (p) => p !== usage?.tier,
          )}
          featureLabel={upgradeModalConfig.message}
          onSuccess={() => {
            setUpgradeModalConfig(null);
            // Re-check quota so the badge/limit reflect the new plan
            // immediately if the person comes back to this wizard.
            roadmapService
              .getUsageStatus()
              .then(setUsage)
              .catch(() => {});
          }}
        />
      )}

      {ToastEl}
    </div>
  );
}

function RailStep({ label, state, last }) {
  return (
    <>
      <div className="ru-rail-step">
        <div className={`ru-rail-node ${state}`}>
          {state === "done" ? "✓" : ""}
        </div>
        <span className="ru-rail-label">{label}</span>
      </div>
      {!last && (
        <div className={`ru-rail-track ${state === "done" ? "done" : ""}`} />
      )}
    </>
  );
}
