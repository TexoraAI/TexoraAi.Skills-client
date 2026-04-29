// src/Trainer/TrainerSkillMap.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain, BarChart2, ArrowLeft, Users, Trophy,
  AlertTriangle, RefreshCw, ChevronDown, Search, X,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

/* ── Theme tokens (matches trainerTheme) ── */
const T_DARK = {
  pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
  border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
  text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
  barBg: "rgba(255,255,255,0.05)", shadow: "0 4px 20px rgba(0,0,0,0.4)",
  shadowHov: "0 20px 60px rgba(0,0,0,0.6)", actBg: "rgba(255,255,255,0.04)",
  actBorder: "rgba(255,255,255,0.07)", recentItemBg: "rgba(255,255,255,0.03)",
  heroBg: "#1a1510", borderHero: "rgba(255,255,255,0.07)",
  emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)",
};
const T_LIGHT = {
  pageBg: "#F8F9FB", cardBg: "#ffffff", cardBgHov: "#f8fafc",
  border: "#e2e8f0", borderHov: "#cbd5e1",
  text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
  barBg: "#f1f5f9", shadow: "0 1px 8px rgba(0,0,0,0.07)",
  shadowHov: "0 8px 32px rgba(0,0,0,0.10)", actBg: "#f8fafc",
  actBorder: "#e2e8f0", recentItemBg: "#f8fafc",
  heroBg: "#E8DED6", borderHero: "rgba(180,140,100,0.2)",
  emptyBorder: "#e2e8f0", emptyBg: "#f8fafc",
};

/* ── Dummy data (replace with API calls) ── */
const MOCK_STUDENTS = [
  { id: 1, name: "Ali Hassan",    email: "ali@demo.com",    batch: "Batch A", skills: [ { name: "JavaScript", score: 72 }, { name: "React", score: 65 }, { name: "SQL", score: 38 }, { name: "Python", score: 30 }, { name: "CSS", score: 80 } ] },
  { id: 2, name: "Sara Khan",     email: "sara@demo.com",   batch: "Batch A", skills: [ { name: "JavaScript", score: 85 }, { name: "React", score: 78 }, { name: "SQL", score: 60 }, { name: "Python", score: 45 }, { name: "CSS", score: 90 } ] },
  { id: 3, name: "Usman Malik",   email: "usman@demo.com",  batch: "Batch B", skills: [ { name: "JavaScript", score: 45 }, { name: "React", score: 30 }, { name: "SQL", score: 70 }, { name: "Python", score: 80 }, { name: "CSS", score: 55 } ] },
  { id: 4, name: "Fatima Noor",   email: "fatima@demo.com", batch: "Batch B", skills: [ { name: "JavaScript", score: 60 }, { name: "React", score: 55 }, { name: "SQL", score: 42 }, { name: "Python", score: 35 }, { name: "CSS", score: 70 } ] },
  { id: 5, name: "Hamza Sheikh",  email: "hamza@demo.com",  batch: "Batch A", skills: [ { name: "JavaScript", score: 90 }, { name: "React", score: 88 }, { name: "SQL", score: 75 }, { name: "Python", score: 70 }, { name: "CSS", score: 95 } ] },
];

const getLevel = (s) => s >= 70 ? "Advanced" : s >= 40 ? "Intermediate" : "Beginner";
const getLevelColor = (s) => s >= 70 ? "#34d399" : s >= 40 ? "#fb923c" : "#f87171";
const getProgressColor = (s) => s >= 70 ? "#34d399" : s >= 50 ? "#fb923c" : "#f87171";

const TrainerSkillMap = () => {
  const navigate  = useNavigate();
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

  const [students,      setStudents]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQ,       setSearchQ]       = useState("");
  const [activeTab,     setActiveTab]     = useState("overview");

  useEffect(() => {
    setTimeout(() => { setStudents(MOCK_STUDENTS); setLoading(false); }, 700);
  }, []);

  const batches = ["All", ...new Set(MOCK_STUDENTS.map(s => s.batch))];

  const filtered = students.filter(s =>
    (selectedBatch === "All" || s.batch === selectedBatch) &&
    (searchQ === "" || s.name.toLowerCase().includes(searchQ.toLowerCase()))
  );

  /* ── Aggregate skill averages ── */
  const skillNames = ["JavaScript","React","SQL","Python","CSS"];
  const batchAvg = skillNames.map(skill => {
    const scores = filtered.map(s => s.skills.find(k => k.name === skill)?.score ?? 0);
    return { skill, avg: Math.round(scores.reduce((a,b) => a+b, 0) / (scores.length || 1)) };
  });

  const weakStudents = filtered.filter(s => s.skills.some(k => k.score < 50));

  const card = (extra = {}) => ({
    background: t.cardBg, border: `1px solid ${t.border}`,
    borderRadius: 20, padding: 22, boxShadow: t.shadow, ...extra,
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 14px", boxShadow: t.shadow, fontFamily: "'Poppins',sans-serif" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0 }}>{payload[0]?.payload?.skill ?? payload[0]?.name}</p>
        <p style={{ fontSize: 11, color: "#a78bfa", margin: "2px 0 0" }}>Avg: <strong>{payload[0]?.value}%</strong></p>
      </div>
    );
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .sfade{animation:fadeUp .4s ease both}`}</style>
      <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Poppins',sans-serif" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: 24, paddingBottom: 52 }}>

          {/* ══ HERO ══ */}
          <div className="sfade" style={{ background: t.heroBg, border: `1px solid ${t.borderHero}`, borderRadius: 24, padding: "28px 32px", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <button onClick={() => navigate("/trainer")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: t.textMuted, background: "transparent", border: "none", cursor: "pointer", marginBottom: 12, padding: 0 }}>
                  <ArrowLeft size={13} /> Back to Dashboard
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: t.textSub }}>Trainer Panel</span>
                </div>
                <h1 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, color: t.text, margin: "0 0 6px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Skill Analytics</h1>
                <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500 }}>Monitor student skill progress across your batches</p>
                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                  {["overview", "students", "weak areas"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                      padding: "6px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                      cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s",
                      border: `1px solid ${activeTab === tab ? "rgba(167,139,250,0.5)" : t.borderHov}`,
                      background: activeTab === tab ? "rgba(167,139,250,0.1)" : t.actBg,
                      color: activeTab === tab ? "#a78bfa" : t.textSub,
                    }}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, color: t.textSub }}>
                  <span>{filtered.length} students</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span style={{ color: "#f87171" }}>{weakStudents.length} need help</span>
                </div>
                {/* Batch filter */}
                <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.actBorder}`, background: t.actBg, color: t.text, fontSize: 11, fontWeight: 600, cursor: "pointer", outline: "none" }}>
                  {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ══ SUMMARY CARDS ══ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total Students", value: filtered.length,      color: "#22d3ee", icon: Users    },
              { label: "Avg Score",      value: `${Math.round(filtered.reduce((a,s) => a + s.skills.reduce((x,k) => x+k.score,0)/s.skills.length, 0) / (filtered.length||1))}%`, color: "#a78bfa", icon: BarChart2 },
              { label: "Strong Students", value: filtered.filter(s => s.skills.every(k => k.score >= 70)).length, color: "#34d399", icon: Trophy  },
              { label: "Weak Areas",     value: weakStudents.length,   color: "#f87171", icon: AlertTriangle },
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
                {/* Radar Chart */}
                <div style={card()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Brain size={15} color="#a78bfa" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Batch Skill Radar</span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={batchAvg.map(b => ({ subject: b.skill, score: b.avg, fullMark: 100 }))}>
                      <PolarGrid stroke={t.border} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill: t.textMuted, fontSize: 9 }} tickCount={4} />
                      <Radar name="Avg" dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.18} strokeWidth={2} dot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div style={card()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BarChart2 size={15} color="#22d3ee" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Average Scores by Skill</span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={batchAvg} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.barBg} />
                      <XAxis dataKey="skill" tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'Poppins',sans-serif" }} />
                      <YAxis domain={[0,100]} tick={{ fill: t.textMuted, fontSize: 9 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="avg" fill="#a78bfa" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skill avg table */}
              <div style={card()}>
                <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "0 0 16px" }}>Skill-wise Batch Average</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {batchAvg.map(item => (
                    <div key={item.skill} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 100, fontSize: 12, fontWeight: 600, color: t.text, flexShrink: 0 }}>{item.skill}</span>
                      <div style={{ flex: 1, height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 99, background: getProgressColor(item.avg), width: `${item.avg}%`, transition: "width 0.8s ease" }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: getProgressColor(item.avg), width: 40, textAlign: "right" }}>{item.avg}%</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: `${getLevelColor(item.avg)}15`, color: getLevelColor(item.avg), flexShrink: 0 }}>{getLevel(item.avg)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ STUDENTS TAB ══ */}
          {activeTab === "students" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}` }}>
                <Search size={14} color={t.textMuted} />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search students…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 12, color: t.text, fontFamily: "'Poppins',sans-serif" }} />
                {searchQ && <button onClick={() => setSearchQ("")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, display: "flex" }}><X size={13} /></button>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
                {filtered.map(student => (
                  <div key={student.id} style={{ ...card(), cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                          {student.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0 }}>{student.name}</p>
                          <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0" }}>{student.batch}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: student.skills.some(k => k.score < 50) ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)", color: student.skills.some(k => k.score < 50) ? "#f87171" : "#34d399" }}>
                        {student.skills.some(k => k.score < 50) ? "Needs Help" : "On Track"}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {student.skills.map(skill => (
                        <div key={skill.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ width: 80, fontSize: 11, fontWeight: 600, color: t.text }}>{skill.name}</span>
                          <div style={{ flex: 1, height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 99, background: getProgressColor(skill.score), width: `${skill.score}%`, transition: "width 0.8s ease" }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: getProgressColor(skill.score), width: 32, textAlign: "right" }}>{skill.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ WEAK AREAS TAB ══ */}
          {activeTab === "weak areas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {weakStudents.length === 0 ? (
                <div style={{ ...card(), textAlign: "center", padding: "48px 20px" }}>
                  <Trophy size={36} color="#34d399" style={{ display: "block", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0 }}>All students are on track!</p>
                </div>
              ) : weakStudents.map(student => (
                <div key={student.id} style={{ ...card(), border: "1px solid rgba(248,113,113,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f87171,#fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                      {student.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0 }}>{student.name}</p>
                      <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0" }}>{student.batch} · {student.email}</p>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                      {student.skills.filter(k => k.score < 50).length} weak skill{student.skills.filter(k => k.score < 50).length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8 }}>
                    {student.skills.filter(k => k.score < 50).map(skill => (
                      <div key={skill.name} style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)" }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: "0 0 6px" }}>{skill.name}</p>
                        <div style={{ height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden", marginBottom: 4 }}>
                          <div style={{ height: "100%", borderRadius: 99, background: "#f87171", width: `${skill.score}%` }} />
                        </div>
                        <p style={{ fontSize: 10, color: "#f87171", margin: 0, fontWeight: 600 }}>{skill.score}% · {getLevel(skill.score)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainerSkillMap;