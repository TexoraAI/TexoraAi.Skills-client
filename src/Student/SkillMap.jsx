// // src/Student/SkillMap.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Brain, Trophy, AlertTriangle, BarChart2,
//   ArrowLeft, RefreshCw, Star,
// } from "lucide-react";
// import { skillService } from "../services/skillService";
// import SkillCard from "../components/skill/SkillCard";
// import SkillRadarChart from "../components/skill/SkillRadarChart";
// import WeakSkillsSection from "../components/skill/WeakSkillsSection";
// import CareerRoadmap from "../components/skill/CareerRoadmap";

// /* ── Inline theme (matches DashboardPage T tokens) ── */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
//     border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
//     text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)",
//     pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)", pillText: "rgba(255,255,255,0.25)",
//     barBg: "rgba(255,255,255,0.05)",
//     recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     heroBg: "#1a1510", borderHero: "rgba(255,255,255,0.07)",
//     actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
//   },
//   light: {
//     pageBg: "#F8F9FB", cardBg: "#ffffff", cardBgHov: "#f8fafc",
//     border: "#e2e8f0", borderHov: "#cbd5e1",
//     text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
//     textLabel: "#94a3b8",
//     pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
//     barBg: "#f1f5f9",
//     recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     // heroBg: "#E8DED6", borderHero: "rgba(180,140,100,0.2)",
//     heroBg: "linear-gradient(135deg, #F6EDE6 0%, #EFE0D3 55%, #E8D5C4 100%)", borderHero: "rgba(170,120,80,0.15)",
//     actBg: "#f8fafc", actBorder: "#e2e8f0",
//   },
// };

// const SkillMap = () => {
//   const navigate = useNavigate();
//   const [skills,  setSkills]  = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [resumeToast, setResumeToast] = useState(null);

//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//        document.documentElement.getAttribute("data-theme") === "dark")
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() =>
//       setIsDark(document.documentElement.classList.contains("dark") ||
//                 document.documentElement.getAttribute("data-theme") === "dark")
//     );
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await skillService.getStudentSkills();
//       setSkills(data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => { load(); }, []);

//   const weakSkills   = skills.filter((s) => s.isWeak);
//   const strongSkills = skills.filter((s) => s.isStrong);
//   const avgScore     = skills.length
//     ? Math.round(skills.reduce((a, s) => a + s.score, 0) / skills.length)
//     : 0;

//   const handleResumeAdd = (skillName) => {
//     setResumeToast(`"${skillName}" added to resume!`);
//     setTimeout(() => setResumeToast(null), 3000);
//   };

//   const TABS = ["overview", "all skills", "weak areas", "roadmap"];

//   if (loading) return (
//     <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
//         <div style={{
//           width: 52, height: 52, borderRadius: 14,
//           background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           animation: "spin 1s linear infinite",
//         }}>
//           <Brain size={22} color="#a78bfa" />
//         </div>
//         <p style={{ fontSize: 13, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Analyzing your skills…</p>
//         <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
//         .sfade { animation: fadeUp 0.4s ease both; }
//       `}</style>

//       {/* Resume toast */}
//       {resumeToast && (
//         <div style={{
//           position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
//           background: "#1e293b", color: "#fff",
//           padding: "10px 20px", borderRadius: 12,
//           fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
//           boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
//           border: "1px solid rgba(255,255,255,0.08)",
//           zIndex: 9999, display: "flex", alignItems: "center", gap: 8,
//         }}>
//           <Star size={13} color="#fbbf24" fill="#fbbf24" /> {resumeToast}
//         </div>
//       )}

//       <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Poppins',sans-serif" }}>
//         <div style={{ maxWidth: 1300, margin: "0 auto", padding: 24, paddingBottom: 52 }}>

//            {/* ══ HERO ══ */}
//            <div className="sfade" style={{
//             background: t.cardBg,
//             border: `1px solid ${t.border}`,
//             borderRadius: 24, padding: "28px 32px", marginBottom: 20,
//             boxShadow: t.shadow,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

//                 {/* Icon */}
//                 <div style={{
//                   width: 52, height: 52, borderRadius: 14,
//                   background: "rgba(59,130,246,0.10)",
//                   border: "1px solid rgba(59,130,246,0.18)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   flexShrink: 0,
//                 }}>
//                   <Brain size={24} color="#3B82F6" />
//                 </div>

//                 <div>
                  

//                   {/* Badge */}
//                   <div style={{
//                     display: "inline-flex", alignItems: "center", gap: 6,
//                     padding: "4px 11px", borderRadius: 50,
//                     border: `1px solid ${t.border}`,
//                     background: "rgba(59,130,246,0.08)",
//                     color: "#3B82F6",
//                     fontSize: 10, fontWeight: 700,
//                     letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6,
//                   }}>
//                     <Brain size={10} /> Skill Intelligence
//                   </div>

//                   <h1 style={{
//                     fontFamily: "'Poppins', sans-serif",
//                     fontWeight: 620,
//                     fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
//                     color: "#3B82F6",
//                     margin: "0 0 4px",
//                     lineHeight: 1.1,
//                     letterSpacing: "-0.02em",
//                   }}>
//                     Skill Map
//                   </h1>

//                   <p style={{ fontSize: 13, color: t.textSub, margin: 0 }}>
//                     Your personalized skill analysis & career road map
//                   </p>

//                   {/* Tabs */}
//                   <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
//                     {TABS.map((tab) => (
//                       <button key={tab} onClick={() => setActiveTab(tab)} style={{
//                         padding: "6px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600,
//                         cursor: "pointer", fontFamily: "'Poppins',sans-serif",
//                         textTransform: "capitalize", transition: "all 0.2s",
//                         border: `1px solid ${activeTab === tab ? "rgba(59,130,246,0.5)" : t.borderHov}`,
//                         background: activeTab === tab ? "rgba(59,130,246,0.1)" : t.actBg,
//                         color: activeTab === tab ? "#3B82F6" : t.textSub,
//                       }}>
//                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Summary badges */}
//               <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 12,
//                   background: t.actBg, border: `1px solid ${t.actBorder}`,
//                   borderRadius: 12, padding: "8px 16px",
//                   fontSize: 11, fontWeight: 600, color: t.textSub,
//                 }}>
//                   <span>{skills.length} skills</span>
//                   <span style={{ width: 1, height: 14, background: t.actBorder }} />
//                   <span style={{ color: "#34d399" }}>{strongSkills.length} strong</span>
//                   <span style={{ width: 1, height: 14, background: t.actBorder }} />
//                   {weakSkills.length > 0
//                     ? <span style={{ color: "#f87171" }}>{weakSkills.length} weak</span>
//                     : <span style={{ color: "#34d399" }}>None weak ✓</span>
//                   }
//                 </div>
//                 <button
//                   onClick={load}
//                   style={{
//                     width: 38, height: 38, borderRadius: 10,
//                     background: t.actBg, border: `1px solid ${t.actBorder}`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     cursor: "pointer", color: t.textMuted,
//                   }}
//                 >
//                   <RefreshCw size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* ══ SUMMARY STAT CARDS ══ */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
//             {[
//               { label: "Avg. Score",    value: `${avgScore}%`,          color: "#a78bfa", icon: BarChart2 },
//               { label: "Strong Skills", value: strongSkills.length,     color: "#34d399", icon: Trophy },
//               { label: "Weak Areas",    value: weakSkills.length,       color: "#f87171", icon: AlertTriangle },
//               { label: "Total Skills",  value: skills.length,           color: "#22d3ee", icon: Brain },
//             ].map((s, i) => {
//               const Icon = s.icon;
//               return (
//                 <div key={i} className="sfade" style={{
//                   background: t.cardBg, border: `1px solid ${t.border}`,
//                   borderRadius: 16, padding: 20, boxShadow: t.shadow,
//                   animationDelay: `${i * 60}ms`,
//                 }}>
//                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
//                     <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, margin: 0 }}>
//                       {s.label}
//                     </p>
//                     <div style={{
//                       width: 32, height: 32, borderRadius: 9,
//                       background: `${s.color}18`, border: `1px solid ${s.color}30`,
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                     }}>
//                       <Icon size={14} color={s.color} />
//                     </div>
//                   </div>
//                   <p style={{ fontSize: 30, fontWeight: 800, color: t.text, margin: 0 }}>{s.value}</p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* ══ TAB CONTENT ══ */}

//           {/* OVERVIEW */}
//           {activeTab === "overview" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               {/* Top row: radar + weak */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <SkillRadarChart skills={skills} t={t} />
//                 <WeakSkillsSection weakSkills={weakSkills} t={t} />
//               </div>
//               {/* Roadmap */}
//               <CareerRoadmap skills={skills} t={t} />
//               {/* Top skills preview */}
//               <div>
//                 <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "0 0 14px", fontFamily: "'Poppins',sans-serif" }}>
//                   Top Skills
//                 </p>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
//                   {[...skills].sort((a, b) => b.score - a.score).slice(0, 3).map((skill) => (
//                     <SkillCard key={skill.id} skill={skill} t={t} onResumeAdd={handleResumeAdd} />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ALL SKILLS */}
//           {activeTab === "all skills" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               <p style={{ fontSize: 12, color: t.textMuted, margin: 0 }}>
//                 Showing <strong style={{ color: t.text }}>{skills.length}</strong> skills tracked
//               </p>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
//                 {[...skills].sort((a, b) => b.score - a.score).map((skill) => (
//                   <SkillCard key={skill.id} skill={skill} t={t} onResumeAdd={handleResumeAdd} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* WEAK AREAS */}
//           {activeTab === "weak areas" && (
//             <WeakSkillsSection weakSkills={weakSkills} t={t} />
//           )}

//           {/* ROADMAP */}
//           {activeTab === "roadmap" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               <CareerRoadmap skills={skills} t={t} />
//               <SkillRadarChart skills={skills} t={t} />
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// };

// export default SkillMap;






















// src/Student/SkillMap.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Trophy,
  AlertTriangle,
  BarChart2,
  ArrowLeft,
  RefreshCw,
  Star,
} from "lucide-react";
import { progressService } from "../services/progressService";
import SkillCard from "../components/skill/SkillCard";
import SkillRadarChart from "../components/skill/SkillRadarChart";
import WeakSkillsSection from "../components/skill/WeakSkillsSection";
import CareerRoadmap from "../components/skill/CareerRoadmap";

const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    barBg: "rgba(255,255,255,0.05)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    heroBg: "#1a1510",
    borderHero: "rgba(255,255,255,0.07)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
  },
  light: {
    pageBg: "#F8F9FB",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    barBg: "#f1f5f9",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    heroBg: "linear-gradient(135deg, #F6EDE6 0%, #EFE0D3 55%, #E8D5C4 100%)",
    borderHero: "rgba(170,120,80,0.15)",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
  },
};

const TABS = ["overview", "all skills", "weak areas", "roadmap"];

const SkillMap = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    avgScore: 0,
    strongCount: 0,
    weakCount: 0,
    totalSkills: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [resumeToast, setResumeToast] = useState(null);

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
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
  const t = isDark ? T.dark : T.light;

  // ── JWT helpers ──
  const getEmailFromToken = () => {
    try {
      const token = localStorage.getItem("lms_token");
      if (!token) return null;
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      return payload.sub ?? payload.email ?? payload.username ?? null;
    } catch {
      return null;
    }
  };

  const getBatchIdFromToken = () => {
    try {
      const token = localStorage.getItem("lms_token");
      if (!token) return null;
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      return payload.batchId ?? payload.batch_id ?? payload.batchid ?? null;
    } catch {
      return null;
    }
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // ── 1. Resolve email ──
      const email =
        getEmailFromToken() ??
        localStorage.getItem("lms_email") ??
        localStorage.getItem("userEmail") ??
        null;

      if (!email) {
        setError("Could not find your email. Please log out and log in again.");
        setLoading(false);
        return;
      }

      // ── 2. Resolve batchId ──
      let batchId =
        getBatchIdFromToken() ?? localStorage.getItem("lms_batch_id") ?? null;

      if (!batchId) {
        try {
          const { getStudentClassroom } =
            await import("../services/batchService");
          const classRes = await getStudentClassroom();
          const classData = classRes?.data ?? classRes;
          batchId =
            classData?.batchId ?? classData?.id ?? classData?.batch_id ?? null;
        } catch (classErr) {
          console.warn(
            "getStudentClassroom failed:",
            classErr?.response?.status,
            classErr?.message,
          );
        }
      }

      if (!batchId) {
        setError(
          "Could not resolve your batch ID. Please make sure you are assigned to a batch.",
        );
        setLoading(false);
        return;
      }

      // ── 3. SEED first so data always exists ──
      // This calls POST /api/skill-map/seed to auto-populate from existing progress
      try {
        await progressService.seedSkillScores();
      } catch (seedErr) {
        // seed failing is non-fatal — data may already exist
        console.warn("Seed attempt:", seedErr?.message);
      }

      // ── 4. Fetch skill map ──
      const res = await progressService.getStudentSkillMap(email, batchId);
      const data = res.data;

      // ── 5. Normalise skill shape ──
      // Backend SkillEntryDTO fields:
      //   skillName, quizScore, assignmentScore, videoScore,
      //   overallScore, isWeak (JSON: "weak"), isStrong (JSON: "strong"), level, updatedAt
      // Note: Java boolean getters isWeak()/isStrong() serialize to JSON as "weak"/"strong"
      const normalised = (data.skills ?? []).map((s, idx) => ({
        id: s.id ?? idx + 1,
        name: s.skillName ?? s.name ?? "Unknown Skill",
        // overallScore is the real score — NOT score field
        score: Math.round(s.overallScore ?? s.score ?? 0),
        quizScore: Math.round(s.quizScore ?? 0),
        assignmentScore: Math.round(s.assignmentScore ?? 0),
        videoScore: Math.round(s.videoScore ?? 0),
        overallScore: Math.round(s.overallScore ?? s.score ?? 0),
        // Java: isWeak() → JSON key "weak"; isStrong() → JSON key "strong"
        isWeak: s.weak ?? s.isWeak ?? Math.round(s.overallScore ?? 0) < 50,
        isStrong:
          s.strong ?? s.isStrong ?? Math.round(s.overallScore ?? 0) >= 70,
        level:
          s.level ??
          ((s.overallScore ?? 0) >= 70
            ? "Advanced"
            : (s.overallScore ?? 0) >= 40
              ? "Intermediate"
              : "Beginner"),
        updatedAt: s.updatedAt,
      }));

      setSkills(normalised);
      setSummaryStats({
        avgScore: Math.round(data.avgScore ?? 0),
        strongCount: data.strongCount ?? 0,
        weakCount: data.weakCount ?? 0,
        totalSkills: data.totalSkills ?? normalised.length,
      });
    } catch (e) {
      console.error("SkillMap fetch error:", e);
      if (e?.response?.status === 403) {
        setError(
          "Access denied (403). Your session may have expired — please log out and log in again.",
        );
      } else if (e?.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load skill data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const weakSkills = skills.filter((s) => s.isWeak);
  const strongSkills = skills.filter((s) => s.isStrong);

  const handleResumeAdd = (skillName) => {
    setResumeToast(`"${skillName}" added to resume!`);
    setTimeout(() => setResumeToast(null), 3000);
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
          <p
            style={{
              fontSize: 13,
              color: t.textMuted,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Analyzing your skills…
          </p>
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
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
            maxWidth: 420,
          }}
        >
          <AlertTriangle
            size={32}
            color="#f87171"
            style={{ display: "block", margin: "0 auto 12px" }}
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .sfade { animation: fadeUp 0.4s ease both; }
      `}</style>

      {resumeToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1e293b",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Poppins',sans-serif",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Star size={13} color="#fbbf24" fill="#fbbf24" /> {resumeToast}
        </div>
      )}

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
              boxShadow:
                "0 2px 24px rgba(180,120,70,0.10), 0 1px 0 rgba(255,255,255,0.7) inset",
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
                  onClick={() => navigate("/student")}
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
                    fontFamily: "'Poppins',sans-serif",
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
                    Skill Intelligence
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: "clamp(1.5rem,3vw,2rem)",
                    fontWeight: 900,
                    color: t.text,
                    margin: "0 0 6px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Skill Map
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: t.textSub,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Your personalized skill analysis & career roadmap
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 16,
                    flexWrap: "wrap",
                  }}
                >
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Poppins',sans-serif",
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
                  <span>{summaryStats.totalSkills} skills</span>
                  <span
                    style={{ width: 1, height: 14, background: t.actBorder }}
                  />
                  <span style={{ color: "#34d399" }}>
                    {summaryStats.strongCount} strong
                  </span>
                  <span
                    style={{ width: 1, height: 14, background: t.actBorder }}
                  />
                  {summaryStats.weakCount > 0 ? (
                    <span style={{ color: "#f87171" }}>
                      {summaryStats.weakCount} weak
                    </span>
                  ) : (
                    <span style={{ color: "#34d399" }}>None weak ✓</span>
                  )}
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

          {/* SUMMARY STAT CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Avg. Score",
                value: `${summaryStats.avgScore}%`,
                color: "#a78bfa",
                icon: BarChart2,
              },
              {
                label: "Strong Skills",
                value: summaryStats.strongCount,
                color: "#34d399",
                icon: Trophy,
              },
              {
                label: "Weak Areas",
                value: summaryStats.weakCount,
                color: "#f87171",
                icon: AlertTriangle,
              },
              {
                label: "Total Skills",
                value: summaryStats.totalSkills,
                color: "#22d3ee",
                icon: Brain,
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="sfade"
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: 16,
                    padding: 20,
                    boxShadow: t.shadow,
                    animationDelay: `${i * 60}ms`,
                  }}
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
                      fontSize: 30,
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

          {/* TAB CONTENT */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <SkillRadarChart skills={skills} t={t} />
                <WeakSkillsSection weakSkills={weakSkills} t={t} />
              </div>
              <CareerRoadmap skills={skills} t={t} />
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    margin: "0 0 14px",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Top Skills
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                    gap: 14,
                  }}
                >
                  {[...skills]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        t={t}
                        onResumeAdd={handleResumeAdd}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "all skills" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 12, color: t.textMuted, margin: 0 }}>
                Showing{" "}
                <strong style={{ color: t.text }}>{skills.length}</strong>{" "}
                skills tracked
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                  gap: 14,
                }}
              >
                {[...skills]
                  .sort((a, b) => b.score - a.score)
                  .map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      t={t}
                      onResumeAdd={handleResumeAdd}
                    />
                  ))}
              </div>
            </div>
          )}

          {activeTab === "weak areas" && (
            <WeakSkillsSection weakSkills={weakSkills} t={t} />
          )}

          {activeTab === "roadmap" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <CareerRoadmap skills={skills} t={t} />
              <SkillRadarChart skills={skills} t={t} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SkillMap;
