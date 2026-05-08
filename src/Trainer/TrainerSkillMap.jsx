// src/Trainer/TrainerSkillMap.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  BarChart2,
  ArrowLeft,
  Users,
  Trophy,
  AlertTriangle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { progressService } from "../services/progressService";
import { getTrainerBatches } from "../services/batchService";

const T_DARK = {
  pageBg: "#0a0a0a",
  cardBg: "#111111",
  cardBgHov: "#161616",
  border: "rgba(255,255,255,0.06)",
  borderHov: "rgba(255,255,255,0.14)",
  text: "#ffffff",
  textSub: "rgba(255,255,255,0.3)",
  textMuted: "rgba(255,255,255,0.2)",
  barBg: "rgba(255,255,255,0.05)",
  shadow: "0 4px 20px rgba(0,0,0,0.4)",
  shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
  actBg: "rgba(255,255,255,0.04)",
  actBorder: "rgba(255,255,255,0.07)",
  heroBg: "#1a1510",
  borderHero: "rgba(255,255,255,0.07)",
};
const T_LIGHT = {
  pageBg: "#F8F9FB",
  cardBg: "#ffffff",
  cardBgHov: "#f8fafc",
  border: "#e2e8f0",
  borderHov: "#cbd5e1",
  text: "#0f172a",
  textSub: "#64748b",
  textMuted: "#94a3b8",
  barBg: "#f1f5f9",
  shadow: "0 1px 8px rgba(0,0,0,0.07)",
  shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
  actBg: "#f8fafc",
  actBorder: "#e2e8f0",
  heroBg: "#E8DED6",
  borderHero: "rgba(180,140,100,0.2)",
};

const getLevel = (s) =>
  s >= 70 ? "Advanced" : s >= 40 ? "Intermediate" : "Beginner";
const getLevelColor = (s) =>
  s >= 70 ? "#34d399" : s >= 40 ? "#fb923c" : "#f87171";
const getProgressColor = (s) =>
  s >= 70 ? "#34d399" : s >= 50 ? "#fb923c" : "#f87171";

const TrainerSkillMap = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () =>
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark",
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      ),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T_DARK : T_LIGHT;

  // ── State ──
  // Backend TrainerBatchSkillResponse fields:
  //   totalStudents, batchAvgScore, strongStudents, weakStudents
  //   students: TrainerStudentSkillRow[]  ← key is "students" NOT "studentRows"
  //   skillAverages: SkillAvgEntry[]      ← key is "skillAverages"
  // TrainerStudentSkillRow fields:
  //   studentEmail, avgScore, needsHelp, skills: SkillEntryDTO[]
  // SkillAvgEntry fields:
  //   skillName, avgScore, level          ← key is "avgScore" NOT "avg"
  // SkillEntryDTO fields:
  //   skillName, overallScore, quizScore, assignmentScore, videoScore
  //   weak (isWeak), strong (isStrong), level

  const [students, setStudents] = useState([]); // TrainerStudentSkillRow[]
  const [skillAverages, setSkillAverages] = useState([]); // SkillAvgEntry[]
  const [summary, setSummary] = useState({
    totalStudents: 0,
    batchAvgScore: 0,
    strongStudents: 0,
    weakStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // ── 1. Resolve batchId ──
      const batchesData = await getTrainerBatches();
      const batches = Array.isArray(batchesData) ? batchesData : [batchesData];

      if (!batches || batches.length === 0) {
        setError(
          "No batches assigned to your account. Please contact your admin.",
        );
        setLoading(false);
        return;
      }

      const batch = batches[0];
      const batchId = batch.id ?? batch.batchId ?? batch.batch_id ?? null;

      if (!batchId) {
        setError("Could not resolve batch ID. Please contact support.");
        setLoading(false);
        return;
      }

      // ── 2. Seed so data always exists ──
      try {
        await progressService.seedSkillScores();
      } catch (seedErr) {
        console.warn("Seed attempt:", seedErr?.message);
      }

      // ── 3. Fetch batch skill analytics ──
      const res = await progressService.getBatchSkillAnalytics(batchId);
      const data = res.data;

      // ── 4. Map backend fields correctly ──
      // Backend sends:
      //   data.students         ← array of TrainerStudentSkillRow
      //   data.skillAverages    ← array of SkillAvgEntry
      //   data.totalStudents
      //   data.batchAvgScore    ← NOT avgScore
      //   data.strongStudents
      //   data.weakStudents

      // Normalise students array
      const normalisedStudents = (data.students ?? []).map((s) => ({
        studentEmail: s.studentEmail ?? "",
        studentName: s.studentEmail?.split("@")[0]?.replace(/[._]/g, " ") ?? "",
        avgScore: Math.round(s.avgScore ?? 0),
        needsHelp: s.needsHelp ?? false,
        // skills: SkillEntryDTO[] — fix overallScore → score for display
        skills: (s.skills ?? []).map((sk) => ({
          skillName: sk.skillName ?? "",
          score: Math.round(sk.overallScore ?? sk.score ?? 0),
          quizScore: Math.round(sk.quizScore ?? 0),
          assignmentScore: Math.round(sk.assignmentScore ?? 0),
          videoScore: Math.round(sk.videoScore ?? 0),
          isWeak: sk.weak ?? sk.isWeak ?? false,
          isStrong: sk.strong ?? sk.isStrong ?? false,
          level: sk.level ?? getLevel(sk.overallScore ?? 0),
        })),
      }));

      // Normalise skill averages
      const normalisedAverages = (data.skillAverages ?? []).map((sa) => ({
        skillName: sa.skillName ?? "",
        avg: Math.round(sa.avgScore ?? sa.avg ?? 0), // backend: avgScore
        level: sa.level ?? getLevel(sa.avgScore ?? 0),
      }));

      setStudents(normalisedStudents);
      setSkillAverages(normalisedAverages);
      setSummary({
        totalStudents: data.totalStudents ?? 0,
        batchAvgScore: Math.round(data.batchAvgScore ?? data.avgScore ?? 0),
        strongStudents: data.strongStudents ?? 0,
        weakStudents: data.weakStudents ?? 0,
      });
    } catch (e) {
      console.error("TrainerSkillMap fetch error:", e);
      if (e?.response?.status === 403) {
        setError("Access denied (403). Please log out and log in again.");
      } else if (e?.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load skill analytics. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filtered students for search
  const filteredStudents = students.filter(
    (s) =>
      searchQ === "" ||
      s.studentName.toLowerCase().includes(searchQ.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(searchQ.toLowerCase()),
  );

  // Weak students = those who have needsHelp true
  const weakStudentList = students.filter((s) => s.needsHelp);

  // Radar data — uses skillAverages
  const radarData = skillAverages.map((s) => ({
    subject: s.skillName,
    score: s.avg,
    fullMark: 100,
  }));

  const card = (extra = {}) => ({
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    padding: 22,
    boxShadow: t.shadow,
    ...extra,
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 10,
          padding: "8px 14px",
          boxShadow: t.shadow,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0 }}>
          {payload[0]?.payload?.subject ??
            payload[0]?.payload?.skillName ??
            payload[0]?.payload?.skill}
        </p>
        <p style={{ fontSize: 11, color: "#a78bfa", margin: "2px 0 0" }}>
          Avg: <strong>{payload[0]?.value}%</strong>
        </p>
      </div>
    );
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "spin 1s linear infinite",
            }}
          >
            <Brain size={22} color="#a78bfa" />
          </div>
          <p style={{ fontSize: 13, color: t.textMuted }}>
            Loading skill analytics…
          </p>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: "40px 32px",
            maxWidth: 360,
          }}
        >
          <AlertTriangle
            size={32}
            color="#f87171"
            style={{ marginBottom: 12 }}
          />
          <p
            style={{
              fontSize: 13,
              color: t.text,
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Something went wrong
          </p>
          <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 20px" }}>
            {error}
          </p>
          <button
            onClick={load}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.3)",
              color: "#a78bfa",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .sfade{animation:fadeUp .4s ease both}`}</style>
      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: 24,
            paddingBottom: 52,
          }}
        >
          {/* HERO */}
          <div
            className="sfade"
            style={{
              background: t.heroBg,
              border: `1px solid ${t.borderHero}`,
              borderRadius: 24,
              padding: "28px 32px",
              marginBottom: 20,
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <button
                  onClick={() => navigate("/trainer")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.textMuted,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: 12,
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={13} /> Back to Dashboard
                </button>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#a78bfa",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: t.textSub,
                    }}
                  >
                    Trainer Panel
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: "clamp(1.4rem,3vw,2rem)",
                    fontWeight: 900,
                    color: t.text,
                    margin: "0 0 6px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Skill Analytics
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: t.textSub,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Monitor student skill progress across your batch
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 16,
                    flexWrap: "wrap",
                  }}
                >
                  {["overview", "students", "weak areas"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        transition: "all 0.2s",
                        border: `1px solid ${activeTab === tab ? "rgba(167,139,250,0.5)" : t.borderHov}`,
                        background:
                          activeTab === tab ? "rgba(167,139,250,0.1)" : t.actBg,
                        color: activeTab === tab ? "#a78bfa" : t.textSub,
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: t.actBg,
                    border: `1px solid ${t.actBorder}`,
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.textSub,
                  }}
                >
                  <span>{summary.totalStudents} students</span>
                  <span
                    style={{ width: 1, height: 14, background: t.actBorder }}
                  />
                  <span style={{ color: "#f87171" }}>
                    {summary.weakStudents} need help
                  </span>
                </div>
                <button
                  onClick={load}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: t.actBg,
                    border: `1px solid ${t.actBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: t.textMuted,
                  }}
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Total Students",
                value: summary.totalStudents,
                color: "#22d3ee",
                icon: Users,
              },
              {
                label: "Avg Score",
                value: `${summary.batchAvgScore}%`,
                color: "#a78bfa",
                icon: BarChart2,
              },
              {
                label: "Strong Students",
                value: summary.strongStudents,
                color: "#34d399",
                icon: Trophy,
              },
              {
                label: "Weak Areas",
                value: summary.weakStudents,
                color: "#f87171",
                icon: AlertTriangle,
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="sfade"
                  style={{ ...card(), animationDelay: `${i * 60}ms` }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: t.textMuted,
                        margin: 0,
                      }}
                    >
                      {s.label}
                    </p>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: `${s.color}18`,
                        border: `1px solid ${s.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={14} color={s.color} />
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: t.text,
                      margin: 0,
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {/* Radar */}
                <div style={card()}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: "rgba(167,139,250,0.1)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Brain size={15} color="#a78bfa" />
                    </div>
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: t.text }}
                    >
                      Batch Skill Radar
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={t.border} />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: t.textMuted,
                          fontSize: 10,
                          fontFamily: "'Poppins',sans-serif",
                          fontWeight: 600,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: t.textMuted, fontSize: 9 }}
                        tickCount={4}
                      />
                      <Radar
                        name="Avg"
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
                </div>

                {/* Bar Chart */}
                <div style={card()}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: "rgba(34,211,238,0.1)",
                        border: "1px solid rgba(34,211,238,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BarChart2 size={15} color="#22d3ee" />
                    </div>
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: t.text }}
                    >
                      Average Scores by Skill
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={skillAverages.map((s) => ({
                        skill: s.skillName,
                        avg: s.avg,
                      }))}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={t.barBg} />
                      <XAxis
                        dataKey="skill"
                        tick={{
                          fill: t.textMuted,
                          fontSize: 10,
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: t.textMuted, fontSize: 9 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="avg" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skill avg table */}
              <div style={card()}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    margin: "0 0 16px",
                  }}
                >
                  Skill-wise Batch Average
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {skillAverages.map((item) => (
                    <div
                      key={item.skillName}
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <span
                        style={{
                          width: 140,
                          fontSize: 12,
                          fontWeight: 600,
                          color: t.text,
                          flexShrink: 0,
                        }}
                      >
                        {item.skillName}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: t.barBg,
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 99,
                            background: getProgressColor(item.avg),
                            width: `${item.avg}%`,
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: getProgressColor(item.avg),
                          width: 40,
                          textAlign: "right",
                        }}
                      >
                        {item.avg}%
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: `${getLevelColor(item.avg)}15`,
                          color: getLevelColor(item.avg),
                          flexShrink: 0,
                        }}
                      >
                        {getLevel(item.avg)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === "students" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 12,
                  background: t.actBg,
                  border: `1px solid ${t.actBorder}`,
                }}
              >
                <Search size={14} color={t.textMuted} />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search students…"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 12,
                    color: t.text,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                />
                {searchQ && (
                  <button
                    onClick={() => setSearchQ("")}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: t.textMuted,
                      display: "flex",
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {filteredStudents.length === 0 ? (
                <div
                  style={{
                    ...card(),
                    textAlign: "center",
                    padding: "48px 20px",
                  }}
                >
                  <p style={{ fontSize: 13, color: t.textMuted, margin: 0 }}>
                    No students found.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                    gap: 14,
                  }}
                >
                  {filteredStudents.map((student) => (
                    <div
                      key={student.studentEmail}
                      style={{ ...card(), transition: "all 0.2s" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = t.shadowHov;
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = t.shadow;
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg,#7c3aed,#a855f7)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#fff",
                              flexShrink: 0,
                            }}
                          >
                            {student.studentEmail.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: t.text,
                                margin: 0,
                                textTransform: "capitalize",
                              }}
                            >
                              {student.studentName || student.studentEmail}
                            </p>
                            <p
                              style={{
                                fontSize: 10,
                                color: t.textMuted,
                                margin: "2px 0 0",
                              }}
                            >
                              {student.studentEmail}
                            </p>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: student.needsHelp
                              ? "rgba(248,113,113,0.1)"
                              : "rgba(52,211,153,0.1)",
                            color: student.needsHelp ? "#f87171" : "#34d399",
                          }}
                        >
                          {student.needsHelp ? "Needs Help" : "On Track"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {student.skills.map((skill) => (
                          <div
                            key={skill.skillName}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <span
                              style={{
                                width: 120,
                                fontSize: 11,
                                fontWeight: 600,
                                color: t.text,
                                flexShrink: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {skill.skillName}
                            </span>
                            <div
                              style={{
                                flex: 1,
                                height: 5,
                                background: t.barBg,
                                borderRadius: 99,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: 99,
                                  background: getProgressColor(skill.score),
                                  width: `${skill.score}%`,
                                  transition: "width 0.8s ease",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: getProgressColor(skill.score),
                                width: 32,
                                textAlign: "right",
                              }}
                            >
                              {skill.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WEAK AREAS TAB */}
          {activeTab === "weak areas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {weakStudentList.length === 0 ? (
                <div
                  style={{
                    ...card(),
                    textAlign: "center",
                    padding: "48px 20px",
                  }}
                >
                  <Trophy
                    size={36}
                    color="#34d399"
                    style={{ display: "block", margin: "0 auto 12px" }}
                  />
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: t.text,
                      margin: 0,
                    }}
                  >
                    All students are on track!
                  </p>
                </div>
              ) : (
                weakStudentList.map((student) => {
                  const weakSkills = student.skills.filter((k) => k.isWeak);
                  return (
                    <div
                      key={student.studentEmail}
                      style={{
                        ...card(),
                        border: "1px solid rgba(248,113,113,0.2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg,#f87171,#fb923c)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          {student.studentEmail.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: t.text,
                              margin: 0,
                              textTransform: "capitalize",
                            }}
                          >
                            {student.studentName || student.studentEmail}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: t.textMuted,
                              margin: "2px 0 0",
                            }}
                          >
                            {student.studentEmail}
                          </p>
                        </div>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: "rgba(248,113,113,0.1)",
                            color: "#f87171",
                          }}
                        >
                          {weakSkills.length} weak skill
                          {weakSkills.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill,minmax(160px,1fr))",
                          gap: 8,
                        }}
                      >
                        {weakSkills.map((skill) => (
                          <div
                            key={skill.skillName}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 12,
                              background: "rgba(248,113,113,0.05)",
                              border: "1px solid rgba(248,113,113,0.15)",
                            }}
                          >
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: t.text,
                                margin: "0 0 6px",
                              }}
                            >
                              {skill.skillName}
                            </p>
                            <div
                              style={{
                                height: 5,
                                background: t.barBg,
                                borderRadius: 99,
                                overflow: "hidden",
                                marginBottom: 4,
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: 99,
                                  background: "#f87171",
                                  width: `${skill.score}%`,
                                }}
                              />
                            </div>
                            <p
                              style={{
                                fontSize: 10,
                                color: "#f87171",
                                margin: 0,
                                fontWeight: 600,
                              }}
                            >
                              {skill.score}% · {getLevel(skill.score)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainerSkillMap;
