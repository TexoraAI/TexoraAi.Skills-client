// src/components/skill/SkillIntelligenceSection.jsx


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, AlertTriangle, ArrowRight, Trophy } from "lucide-react";
import { skillService } from "../../services/skillService";

const SkillIntelligenceSection = ({ t }) => {
  const navigate = useNavigate();
  const [skills,  setSkills]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillService.getStudentSkills()
      .then(setSkills)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topSkills  = [...skills].sort((a, b) => b.score - a.score).slice(0, 5);
  const weakSkills = skills.filter((s) => s.isWeak);

  return (
    <div style={{
      background:   t.cardBg,
      border:       `1px solid ${t.border}`,
      borderRadius: 20,
      padding:      24,
      boxShadow:    t.shadow,
      marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Brain size={15} color="#a78bfa" />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
              Skill Intelligence
            </span>
            {weakSkills.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <AlertTriangle size={10} color="#f87171" />
                <span style={{ fontSize: 10, color: "#f87171", fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                  {weakSkills.length} weak skill{weakSkills.length > 1 ? "s" : ""} detected
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate("/student/skill-map")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600,
            background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)",
            color: "#a78bfa", cursor: "pointer", fontFamily: "'Poppins',sans-serif",
            transition: "all 0.2s",
          }}
        >
          View Full Skill Roadmap <ArrowRight size={12} />
        </button>
      </div>

      {/* Skill bars */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 80, height: 10, borderRadius: 5, background: t.barBg }} />
              <div style={{ flex: 1, height: 6, borderRadius: 99, background: t.barBg }} />
              <div style={{ width: 30, height: 10, borderRadius: 5, background: t.barBg }} />
            </div>
          ))}
        </div>
      ) : topSkills.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
            No skill data yet. Complete quizzes and assignments to build your profile.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topSkills.map((skill) => (
            <div key={skill.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Skill name + icon */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: 120, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: `${skill.progressColor}15`,
                  border: `1px solid ${skill.progressColor}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: skill.progressColor,
                  fontFamily: "'Poppins',sans-serif",
                }}>
                  {skill.icon}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
                  {skill.name}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ flex: 1, height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  background: skill.progressColor,
                  width: `${skill.score}%`,
                  transition: "width 0.8s ease",
                }} />
              </div>

              {/* Score + badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: skill.progressColor, width: 36, textAlign: "right", fontFamily: "'Poppins',sans-serif" }}>
                  {skill.score}%
                </span>
                {skill.isWeak && (
                  <AlertTriangle size={12} color="#f87171" />
                )}
                {skill.isStrong && (
                  <Trophy size={12} color="#34d399" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weak skill warning banner */}
      {!loading && weakSkills.length > 0 && (
        <div style={{
          marginTop: 16, padding: "10px 14px", borderRadius: 12,
          background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={13} color="#f87171" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#f87171", fontFamily: "'Poppins',sans-serif" }}>
              {weakSkills.map((s) => s.name).join(", ")} — below 50%
            </span>
          </div>
          <button
            onClick={() => navigate("/student/skill-map")}
            style={{
              fontSize: 10, fontWeight: 700, color: "#f87171",
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4,
            }}
          >
            Fix now <ArrowRight size={11} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillIntelligenceSection;