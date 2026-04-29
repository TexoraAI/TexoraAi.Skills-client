// src/components/skill/CareerRoadmap.jsx
import React, { useState } from "react";
import { CheckCircle, Lock, ArrowRight } from "lucide-react";
import { CAREER_ROADMAPS } from "../../data/skillDummyData";

const CareerRoadmap = ({ skills, t }) => {
  const goals = Object.keys(CAREER_ROADMAPS);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);

  const steps = CAREER_ROADMAPS[selectedGoal];
  const skillMap = Object.fromEntries(skills.map((s) => [s.name, s.score]));

  const getStepStatus = (step) => {
    const score = skillMap[step.skill] ?? 0;
    if (score >= step.required) return "done";
    if (score > 0) return "inprogress";
    return "locked";
  };

  const STATUS_STYLE = {
    done:       { bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)",  icon: "#34d399", label: "✓" },
    inprogress: { bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.3)",  icon: "#fb923c", label: "~" },
    locked:     { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.15)", icon: "#94a3b8", label: "🔒" },
  };

  const completedCount = steps.filter((s) => getStepStatus(s) === "done").length;
  const totalSteps     = steps.length;
  const roadmapPct     = Math.round((completedCount / totalSteps) * 100);

  return (
    <div style={{
      background: t.cardBg, border: `1px solid ${t.border}`,
      borderRadius: 20, padding: 24, boxShadow: t.shadow,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
              Career Roadmap
            </span>
            <p style={{ fontSize: 10, color: t.textMuted, margin: "1px 0 0", fontFamily: "'Poppins',sans-serif" }}>
              {completedCount}/{totalSteps} steps completed · {roadmapPct}%
            </p>
          </div>
        </div>

        {/* Goal selector */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {goals.map((g) => (
            <button key={g} onClick={() => setSelectedGoal(g)} style={{
              padding: "5px 14px", borderRadius: 10, fontSize: 10, fontWeight: 600,
              fontFamily: "'Poppins',sans-serif", cursor: "pointer", transition: "all 0.2s",
              border: `1px solid ${selectedGoal === g ? "rgba(34,211,238,0.4)" : t.border}`,
              background: selectedGoal === g ? "rgba(34,211,238,0.1)" : "transparent",
              color: selectedGoal === g ? "#22d3ee" : t.textMuted,
            }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Overall progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Overall Progress</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", fontFamily: "'Poppins',sans-serif" }}>{roadmapPct}%</span>
        </div>
        <div style={{ height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99, background: "#22d3ee",
            width: `${roadmapPct}%`, transition: "width 0.8s ease",
          }} />
        </div>
      </div>

      {/* Steps — horizontal scroll on small screens */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "max-content" }}>
          {steps.map((step, idx) => {
            const status = getStepStatus(step);
            const ss     = STATUS_STYLE[status];
            const score  = skillMap[step.skill] ?? 0;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 90 }}>
                  {/* Circle */}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: ss.bg, border: `2px solid ${ss.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 8,
                  }}>
                    {status === "done" ? (
                      <CheckCircle size={18} color={ss.icon} />
                    ) : status === "locked" ? (
                      <Lock size={14} color={ss.icon} />
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 800, color: ss.icon, fontFamily: "'Poppins',sans-serif" }}>
                        {score}%
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: t.text, margin: 0, textAlign: "center", fontFamily: "'Poppins',sans-serif" }}>
                    {step.name}
                  </p>
                  <p style={{ fontSize: 9, color: t.textMuted, margin: "2px 0 0", textAlign: "center", fontFamily: "'Poppins',sans-serif" }}>
                    Need {step.required}%
                  </p>
                  <p style={{ fontSize: 9, color: ss.icon, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                    {status === "done" ? "Done" : status === "inprogress" ? "In Progress" : "Locked"}
                  </p>
                </div>

                {!isLast && (
                  <div style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -18 }}>
                    <ArrowRight size={14} color={status === "done" ? "#34d399" : t.textMuted} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;