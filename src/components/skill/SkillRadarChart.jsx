// src/components/skill/SkillRadarChart.jsx
import React from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";

const SkillRadarChart = ({ skills, t }) => {
  const data = skills.slice(0, 8).map((s) => ({
    subject: s.name.length > 8 ? s.name.slice(0, 7) + "…" : s.name,
    score:   s.score,
    fullMark: 100,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background:   t.cardBg,
        border:       `1px solid ${t.border}`,
        borderRadius: 10,
        padding:      "8px 14px",
        boxShadow:    t.shadow,
        fontFamily:   "'Poppins',sans-serif",
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0 }}>
          {payload[0]?.payload?.subject}
        </p>
        <p style={{ fontSize: 11, color: "#a78bfa", margin: "2px 0 0" }}>
          Score: <strong>{payload[0]?.value}</strong>
        </p>
      </div>
    );
  };

  return (
    <div style={{
      background:   t.cardBg,
      border:       `1px solid ${t.border}`,
      borderRadius: 20,
      padding:      24,
      boxShadow:    t.shadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "rgba(167,139,250,0.12)",
          border: "1px solid rgba(167,139,250,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
          Skill Distribution
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke={t.border} strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30} domain={[0, 100]}
            tick={{ fill: t.textMuted, fontSize: 9 }}
            tickCount={4}
          />
          <Radar
            name="Skill"
            dataKey="score"
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
        {[
          { label: "Advanced (70+)", color: "#34d399" },
          { label: "Intermediate (40–70)", color: "#fb923c" },
          { label: "Beginner (<40)", color: "#f87171" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            <span style={{ fontSize: 9, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadarChart;