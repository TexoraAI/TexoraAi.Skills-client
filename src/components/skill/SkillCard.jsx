// src/components/skill/SkillCard.jsx
import React, { useState } from "react";
import { Trophy, AlertTriangle, Plus, CheckCircle } from "lucide-react";
import { skillService } from "../../services/skillService";

const SkillCard = ({ skill, t, onResumeAdd }) => {
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddResume = async () => {
    setAdding(true);
    try {
      await skillService.addToResume(skill.id, skill.name);
      setAdded(true);
      if (onResumeAdd) onResumeAdd(skill.name);
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      style={{
        background:   t.cardBg,
        border:       `1px solid ${skill.isWeak ? "rgba(248,113,113,0.25)" : t.border}`,
        borderRadius: 20,
        padding:      22,
        boxShadow:    t.shadow,
        display:      "flex",
        flexDirection: "column",
        gap:          14,
        position:     "relative",
        overflow:     "hidden",
        transition:   "all 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = t.shadowHov;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = t.shadow;
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Accent glow */}
      <div style={{
        position: "absolute", top: -24, right: -24,
        width: 80, height: 80, borderRadius: "50%",
        background: skill.progressColor,
        filter: "blur(32px)", opacity: 0.1,
        pointerEvents: "none",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: `${skill.progressColor}18`,
            border: `1px solid ${skill.progressColor}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: skill.progressColor,
            fontFamily: "'Poppins',sans-serif",
          }}>
            {skill.icon}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
              {skill.name}
            </p>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
              padding: "2px 8px", borderRadius: 999,
              background: skill.levelBg, color: skill.levelColor,
              fontFamily: "'Poppins',sans-serif",
            }}>
              {skill.level}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 28, fontWeight: 800, color: skill.progressColor, margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
            {skill.score}
          </p>
          <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>/ 100</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Skill Score</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: skill.progressColor, fontFamily: "'Poppins',sans-serif" }}>
            {skill.score}%
          </span>
        </div>
        <div style={{ height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: skill.progressColor,
            width: `${skill.score}%`,
            transition: "width 0.8s ease",
          }} />
        </div>
      </div>

      {/* Score breakdown */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Quiz", value: skill.quizScore,        color: "#a78bfa" },
          { label: "Assignment", value: skill.assignmentScore, color: "#22d3ee" },
          { label: "Video", value: skill.videoProgress,   color: "#34d399" },
        ].map((item) => (
          <div key={item.label} style={{
            flex: 1, padding: "6px 8px", borderRadius: 10,
            background: t.recentItemBg, border: `1px solid ${t.border}`,
            textAlign: "center",
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: item.color, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
              {item.value}%
            </p>
            <p style={{ fontSize: 9, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Badges + actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {skill.isStrong && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 700,
              padding: "4px 10px", borderRadius: 8,
              background: "rgba(52,211,153,0.1)", color: "#34d399",
              fontFamily: "'Poppins',sans-serif",
            }}>
              <Trophy size={11} /> Strong
            </div>
          )}
          {skill.isWeak && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 700,
              padding: "4px 10px", borderRadius: 8,
              background: "rgba(248,113,113,0.1)", color: "#f87171",
              fontFamily: "'Poppins',sans-serif",
            }}>
              <AlertTriangle size={11} /> Needs Work
            </div>
          )}
        </div>

        {skill.canAddResume && (
          <button
            onClick={handleAddResume}
            disabled={adding || added}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 10, fontWeight: 700,
              padding: "5px 12px", borderRadius: 8,
              background: added ? "rgba(52,211,153,0.1)" : "rgba(124,58,237,0.1)",
              border: `1px solid ${added ? "rgba(52,211,153,0.25)" : "rgba(124,58,237,0.25)"}`,
              color: added ? "#34d399" : "#a78bfa",
              cursor: (adding || added) ? "default" : "pointer",
              fontFamily: "'Poppins',sans-serif",
              transition: "all 0.2s",
            }}
          >
            {added ? <CheckCircle size={11} /> : <Plus size={11} />}
            {added ? "Added!" : adding ? "Adding…" : "Add to Resume"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillCard;