// src/components/skill/WeakSkillsSection.jsx
import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SKILL_RECOMMENDATIONS } from "../../data/skillDummyData";

const WeakSkillsSection = ({ weakSkills, t }) => {
  const navigate = useNavigate();

  if (!weakSkills.length) {
    return (
      <div style={{
        background: t.cardBg, border: `1px solid ${t.border}`,
        borderRadius: 20, padding: 28, textAlign: "center", boxShadow: t.shadow,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
          No Weak Areas!
        </p>
        <p style={{ fontSize: 12, color: t.textMuted, margin: "6px 0 0", fontFamily: "'Poppins',sans-serif" }}>
          All your skills are above 50%. Great work!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background:   t.cardBg,
      border:       "1px solid rgba(248,113,113,0.2)",
      borderRadius: 20,
      padding:      24,
      boxShadow:    t.shadow,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AlertTriangle size={15} color="#f87171" />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
              Weak Areas Detected
            </span>
            <p style={{ fontSize: 10, color: "#f87171", margin: "1px 0 0", fontFamily: "'Poppins',sans-serif" }}>
              {weakSkills.length} skill{weakSkills.length > 1 ? "s" : ""} need attention
            </p>
          </div>
        </div>
      </div>

      {/* Weak skill rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {weakSkills.map((skill) => {
          const recs = SKILL_RECOMMENDATIONS[skill.name] || SKILL_RECOMMENDATIONS.DEFAULT;
          return (
            <div key={skill.id} style={{
              background: "rgba(248,113,113,0.04)",
              border: "1px solid rgba(248,113,113,0.12)",
              borderRadius: 14, padding: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${skill.progressColor}15`,
                    border: `1px solid ${skill.progressColor}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: skill.progressColor,
                    fontFamily: "'Poppins',sans-serif",
                  }}>
                    {skill.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                      {skill.name}
                    </p>
                    <p style={{ fontSize: 10, color: "#f87171", margin: "1px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                      Score: {skill.score}/100 · {skill.level}
                    </p>
                  </div>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                  padding: "3px 10px", borderRadius: 999,
                  background: "rgba(248,113,113,0.1)", color: "#f87171",
                  fontFamily: "'Poppins',sans-serif",
                }}>
                  Below 50%
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  background: "#f87171", width: `${skill.score}%`,
                  transition: "width 0.8s ease",
                }} />
              </div>

              {/* Recommendations */}
              <p style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px", fontFamily: "'Poppins',sans-serif" }}>
                Recommended Resources
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {recs.map((rec, idx) => (
                  <div key={idx} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 8,
                    background: t.recentItemBg, border: `1px solid ${t.border}`,
                    cursor: "pointer",
                  }}
                    onClick={() => navigate("/student/courses")}
                  >
                    <span style={{ fontSize: 12 }}>
                      {rec.type === "course" ? "🎓" : rec.type === "video" ? "🎥" : "✏️"}
                    </span>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                        {rec.title}
                      </p>
                      <p style={{ fontSize: 9, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                        {rec.duration}
                      </p>
                    </div>
                    <ArrowRight size={11} color={t.textMuted} style={{ marginLeft: "auto" }} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeakSkillsSection;