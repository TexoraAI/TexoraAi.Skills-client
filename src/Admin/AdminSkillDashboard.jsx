// src/Admin/AdminSkillDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain, BarChart2, ArrowLeft, Users, Trophy,
  AlertTriangle, TrendingUp, BookOpen,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Legend,
} from "recharts";

const T_DARK = {
  pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
  border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
  text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
  barBg: "rgba(255,255,255,0.05)", shadow: "0 4px 20px rgba(0,0,0,0.4)",
  shadowHov: "0 20px 60px rgba(0,0,0,0.6)", actBg: "rgba(255,255,255,0.04)",
  actBorder: "rgba(255,255,255,0.07)", heroBg: "#1a1510",
  borderHero: "rgba(255,255,255,0.07)",
};
const T_LIGHT = {
  pageBg: "#F8F9FB", cardBg: "#ffffff", cardBgHov: "#f8fafc",
  border: "#e2e8f0", borderHov: "#cbd5e1",
  text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
  barBg: "#f1f5f9", shadow: "0 1px 8px rgba(0,0,0,0.07)",
  shadowHov: "0 8px 32px rgba(0,0,0,0.10)", actBg: "#f8fafc",
  actBorder: "#e2e8f0", heroBg: "#E8DED6",
  borderHero: "rgba(180,140,100,0.2)",
};

/* ── Mock org-wide data ── */
const ORG_SKILL_DATA = [
  { skill: "JavaScript", batchA: 74, batchB: 52, batchC: 68 },
  { skill: "React",      batchA: 70, batchB: 45, batchC: 60 },
  { skill: "SQL",        batchA: 56, batchB: 63, batchC: 48 },
  { skill: "Python",     batchA: 45, batchB: 72, batchC: 55 },
  { skill: "CSS",        batchA: 82, batchB: 58, batchC: 75 },
];

const TREND_DATA = [
  { month: "Nov", avg: 52 },
  { month: "Dec", avg: 58 },
  { month: "Jan", avg: 61 },
  { month: "Feb", avg: 67 },
  { month: "Mar", avg: 70 },
  { month: "Apr", avg: 74 },
];

const BATCH_SUMMARY = [
  { batch: "Batch A", students: 18, avgScore: 65, strong: 10, weak: 3, trainer: "Dr. Ahmed" },
  { batch: "Batch B", students: 22, avgScore: 58, strong: 8,  weak: 7, trainer: "Ms. Fatima" },
  { batch: "Batch C", trainer: "Mr. Usman", students: 15, avgScore: 61, strong: 7, weak: 4 },
];

const RADAR_DATA = ORG_SKILL_DATA.map(d => ({
  subject: d.skill,
  score:   Math.round((d.batchA + d.batchB + d.batchC) / 3),
  fullMark: 100,
}));

const getProgressColor = (s) => s >= 70 ? "#34d399" : s >= 50 ? "#fb923c" : "#f87171";
const getLevel = (s) => s >= 70 ? "Advanced" : s >= 40 ? "Intermediate" : "Beginner";

const AdminSkillDashboard = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark") ||
                document.documentElement.getAttribute("data-theme") === "dark")
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class","data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T_DARK : T_LIGHT;

  const [activeTab, setActiveTab] = useState("overview");

  const card = (extra = {}) => ({
    background: t.cardBg, border: `1px solid ${t.border}`,
    borderRadius: 20, padding: 22, boxShadow: t.shadow, ...extra,
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 14px", boxShadow: t.shadow, fontFamily: "'Poppins',sans-serif" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0 }}>{label ?? payload[0]?.payload?.subject}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 11, color: p.color ?? "#a78bfa", margin: "2px 0 0" }}>{p.name}: <strong>{p.value}%</strong></p>
        ))}
      </div>
    );
  };

  const totalStudents = BATCH_SUMMARY.reduce((a, b) => a + b.students, 0);
  const orgAvg = Math.round(BATCH_SUMMARY.reduce((a, b) => a + b.avgScore, 0) / BATCH_SUMMARY.length);
  const totalWeak = BATCH_SUMMARY.reduce((a, b) => a + b.weak, 0);
  const totalStrong = BATCH_SUMMARY.reduce((a, b) => a + b.strong, 0);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .sfade{animation:fadeUp .4s ease both}`}</style>
      <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Poppins',sans-serif" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: 24, paddingBottom: 52 }}>

          {/* ══ HERO ══ */}
          <div className="sfade" style={{ background: t.heroBg, border: `1px solid ${t.borderHero}`, borderRadius: 24, padding: "28px 32px", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <button onClick={() => navigate("/admin")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: t.textMuted, background: "transparent", border: "none", cursor: "pointer", marginBottom: 12, padding: 0 }}>
                  <ArrowLeft size={13} /> Back to Dashboard
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: t.textSub }}>Manager Panel</span>
                </div>
                <h1 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, color: t.text, margin: "0 0 6px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Org Skill Analytics</h1>
                <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500 }}>Organisation-wide skill intelligence & performance overview</p>
                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                  {["overview", "by batch", "trends"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                      padding: "6px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                      cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s",
                      border: `1px solid ${activeTab === tab ? "rgba(34,211,238,0.5)" : t.borderHov}`,
                      background: activeTab === tab ? "rgba(34,211,238,0.1)" : t.actBg,
                      color: activeTab === tab ? "#22d3ee" : t.textSub,
                    }}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, color: t.textSub }}>
                  <span>{totalStudents} students</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span style={{ color: "#34d399" }}>{totalStrong} strong</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span style={{ color: "#f87171" }}>{totalWeak} weak</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ SUMMARY STATS ══ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total Students",  value: totalStudents, color: "#22d3ee", icon: Users       },
              { label: "Org Avg Score",   value: `${orgAvg}%`,  color: "#a78bfa", icon: BarChart2   },
              { label: "Strong Learners", value: totalStrong,   color: "#34d399", icon: Trophy      },
              { label: "Need Attention",  value: totalWeak,     color: "#f87171", icon: AlertTriangle },
              { label: "Active Batches",  value: BATCH_SUMMARY.length, color: "#fb923c", icon: BookOpen },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="sfade" style={{ ...card(), animationDelay: `${i*60}ms` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, margin: 0 }}>{s.label}</p>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={14} color={s.color} />
                    </div>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: 0 }}>{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* ══ OVERVIEW TAB ══ */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Radar */}
                <div style={card()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Brain size={15} color="#a78bfa" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Org Skill Distribution</span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke={t.border} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill: t.textMuted, fontSize: 9 }} tickCount={4} />
                      <Radar name="Org Avg" dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Skill avg bars */}
                <div style={card()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BarChart2 size={15} color="#22d3ee" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Org Skill Averages</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {RADAR_DATA.map(item => (
                      <div key={item.subject} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 90, fontSize: 12, fontWeight: 600, color: t.text, flexShrink: 0 }}>{item.subject}</span>
                        <div style={{ flex: 1, height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 99, background: getProgressColor(item.score), width: `${item.score}%`, transition: "width 0.8s ease" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: getProgressColor(item.score), width: 36, textAlign: "right", flexShrink: 0 }}>{item.score}%</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: `${getProgressColor(item.score)}15`, color: getProgressColor(item.score), flexShrink: 0 }}>{getLevel(item.score)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Batch cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                {BATCH_SUMMARY.map(b => (
                  <div key={b.batch} style={card()}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0 }}>{b.batch}</p>
                        <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0" }}>Trainer: {b.trainer}</p>
                      </div>
                      <span style={{ fontSize: 22, fontWeight: 800, color: getProgressColor(b.avgScore) }}>{b.avgScore}%</span>
                    </div>
                    <div style={{ height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                      <div style={{ height: "100%", borderRadius: 99, background: getProgressColor(b.avgScore), width: `${b.avgScore}%`, transition: "width 0.8s ease" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "rgba(34,211,238,0.1)", color: "#22d3ee" }}>{b.students} students</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "rgba(52,211,153,0.1)", color: "#34d399" }}>✓ {b.strong} strong</span>
                      {b.weak > 0 && <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "rgba(248,113,113,0.1)", color: "#f87171" }}>⚠ {b.weak} weak</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ BY BATCH TAB ══ */}
          {activeTab === "by batch" && (
            <div style={card()}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <BarChart2 size={16} color="#22d3ee" />
                <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Skill Comparison — All Batches</span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={ORG_SKILL_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.barBg} />
                  <XAxis dataKey="skill" tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'Poppins',sans-serif" }} />
                  <YAxis domain={[0,100]} tick={{ fill: t.textMuted, fontSize: 9 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'Poppins',sans-serif", color: t.textMuted }} />
                  <Bar dataKey="batchA" name="Batch A" fill="#a78bfa" radius={[4,4,0,0]} />
                  <Bar dataKey="batchB" name="Batch B" fill="#22d3ee" radius={[4,4,0,0]} />
                  <Bar dataKey="batchC" name="Batch C" fill="#34d399" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ══ TRENDS TAB ══ */}
          {activeTab === "trends" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={card()}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <TrendingUp size={16} color="#34d399" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Org Average Score Trend (6 months)</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.barBg} />
                    <XAxis dataKey="month" tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'Poppins',sans-serif" }} />
                    <YAxis domain={[40,100]} tick={{ fill: t.textMuted, fontSize: 9 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="avg" name="Avg Score" stroke="#34d399" strokeWidth={2.5} dot={{ r: 5, fill: "#34d399", strokeWidth: 0 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Trend insight cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                {[
                  { label: "Score improvement", value: "+22%", sub: "Nov → Apr", color: "#34d399" },
                  { label: "Best performing skill", value: "CSS", sub: "Avg 75%", color: "#a78bfa" },
                  { label: "Skill needing focus", value: "Python", sub: "Avg 57%", color: "#f87171" },
                  { label: "Best batch", value: "Batch A", sub: "Avg 65%", color: "#22d3ee" },
                ].map((item, i) => (
                  <div key={i} style={card()}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, margin: "0 0 8px" }}>{item.label}</p>
                    <p style={{ fontSize: 24, fontWeight: 800, color: item.color, margin: 0 }}>{item.value}</p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "4px 0 0" }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminSkillDashboard;