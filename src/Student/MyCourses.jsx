// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   FaAward,
//   FaBookOpen,
//   FaChartLine,
//   FaChevronRight,
//   FaGraduationCap,
//   FaSearch,
//   FaUser,
// } from "react-icons/fa";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// /* ─── CSS injected once ─────────────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --bg:        #f1f5f9;
//     --card:      #ffffff;
//     --text:      #0f172a;
//     --text-muted:#64748b;
//     --border:    #e2e8f0;
//     --accent1:   #22d3ee;
//     --accent2:   #fb923c;
//     --accent3:   #34d399;
//     --accent4:   #a78bfa;
//     --shadow:    0 4px 24px rgba(0,0,0,0.06);
//     --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//     --radius:    20px;
//   }

//   .dark-theme {
//     --bg:        #0a0a0a;
//     --card:      #111111;
//     --text:      #ffffff;
//     --text-muted:#94a3b8;
//     --border:    rgba(255,255,255,0.06);
//     --shadow:    0 4px 24px rgba(0,0,0,0.40);
//     --shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
//   }

//   .mc-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--bg);
//     color: var(--text);
//     padding: 24px;
//     box-sizing: border-box;
//     transition: background 0.3s, color 0.3s;
//   }

//   .mc-inner {
//     max-width: 1300px;
//     margin: 0 auto;
//   }

//   /* ── Header card ── */
//   .mc-header {
//     background: var(--card);
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     padding: 32px 36px;
//     margin-bottom: 28px;
//     box-shadow: var(--shadow);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 24px;
//     flex-wrap: wrap;
//   }

//   .mc-header-left {}

//   .mc-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 5px 12px;
//     border-radius: 50px;
//     border: 1px solid var(--border);
//     background: rgba(34,211,238,0.08);
//     color: var(--accent1);
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     margin-bottom: 14px;
//   }

//   .mc-title {
//     font-size: 32px;
//     font-weight: 800;
//     color: var(--text);
//     margin: 0 0 6px;
//     line-height: 1.15;
//   }

//   .mc-subtitle {
//     font-size: 13px;
//     color: var(--text-muted);
//     margin: 0 0 24px;
//   }

//   .mc-stats {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 12px;
//   }

//   .mc-stat {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     background: var(--bg);
//     border: 1px solid var(--border);
//     border-radius: 14px;
//     padding: 14px 20px;
//     min-width: 140px;
//     box-shadow: var(--shadow);
//   }

//   .mc-stat-icon {
//     width: 40px;
//     height: 40px;
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 16px;
//     flex-shrink: 0;
//   }

//   .mc-stat-value {
//     font-size: 22px;
//     font-weight: 800;
//     line-height: 1;
//     margin-bottom: 3px;
//   }

//   .mc-stat-label {
//     font-size: 10px;
//     font-weight: 600;
//     color: var(--text-muted);
//     text-transform: uppercase;
//     letter-spacing: 0.06em;
//   }

//   .mc-header-icon {
//     width: 120px;
//     height: 120px;
//     border-radius: var(--radius);
//     background: rgba(34,211,238,0.08);
//     border: 1px solid rgba(34,211,238,0.15);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 48px;
//     color: var(--accent1);
//     flex-shrink: 0;
//   }

//   @media (max-width: 768px) {
//     .mc-header-icon { display: none; }
//     .mc-title { font-size: 24px; }
//   }

//   /* ── Search ── */
//   .mc-search-wrap {
//     margin-bottom: 28px;
//   }

//   .mc-search {
//     position: relative;
//     width: 360px;
//     max-width: 100%;
//   }

//   .mc-search svg {
//     position: absolute;
//     left: 16px;
//     top: 50%;
//     transform: translateY(-50%);
//     color: var(--text-muted);
//     font-size: 15px;
//     pointer-events: none;
//   }

//   .mc-search input {
//     width: 100%;
//     padding: 13px 16px 13px 46px;
//     border-radius: 14px;
//     border: 1px solid var(--border);
//     background: var(--card);
//     color: var(--text);
//     font-family: 'Poppins', sans-serif;
//     font-size: 13px;
//     font-weight: 500;
//     outline: none;
//     box-shadow: var(--shadow);
//     transition: border-color 0.2s, box-shadow 0.2s;
//     box-sizing: border-box;
//   }

//   .mc-search input::placeholder { color: var(--text-muted); }

//   .mc-search input:focus {
//     border-color: var(--accent1);
//     box-shadow: 0 0 0 3px rgba(34,211,238,0.12);
//   }

//   /* ── Grid ── */
//   .mc-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//     gap: 20px;
//   }

//   /* ── Course Card ── */
//   .mc-card {
//     background: var(--card);
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     padding: 24px;
//     box-shadow: var(--shadow);
//     display: flex;
//     flex-direction: column;
//     transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
//     cursor: default;
//   }

//   .mc-card:hover {
//     transform: translateY(-4px);
//     box-shadow: var(--shadow-lg);
//     border-color: rgba(34,211,238,0.20);
//   }

//   .mc-card-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     gap: 12px;
//     margin-bottom: 16px;
//   }

//   .mc-card-title {
//     font-size: 15px;
//     font-weight: 700;
//     color: var(--text);
//     line-height: 1.4;
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//     transition: color 0.2s;
//     margin: 0;
//   }

//   .mc-card:hover .mc-card-title { color: var(--accent1); }

//   .mc-card-icon {
//     width: 44px;
//     height: 44px;
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 18px;
//     background: rgba(34,211,238,0.10);
//     color: var(--accent1);
//     flex-shrink: 0;
//   }

//   .mc-card-divider {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     padding-bottom: 14px;
//     margin-bottom: 14px;
//     border-bottom: 1px solid var(--border);
//   }

//   .mc-card-instructor-icon {
//     width: 30px;
//     height: 30px;
//     border-radius: 8px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: rgba(167,139,250,0.12);
//     color: var(--accent4);
//     font-size: 12px;
//     flex-shrink: 0;
//   }

//   .mc-card-instructor {
//     font-size: 12px;
//     font-weight: 600;
//     color: var(--text);
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .mc-tag {
//     display: inline-flex;
//     align-items: center;
//     padding: 5px 12px;
//     border-radius: 8px;
//     font-size: 11px;
//     font-weight: 700;
//     background: rgba(52,211,153,0.10);
//     color: var(--accent3);
//     border: 1px solid rgba(52,211,153,0.15);
//     margin-bottom: 18px;
//     width: fit-content;
//   }

//   /* ── Progress ── */
//   .mc-progress-row {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 8px;
//   }

//   .mc-progress-label {
//     font-size: 11px;
//     font-weight: 600;
//     color: var(--text-muted);
//     text-transform: uppercase;
//     letter-spacing: 0.05em;
//   }

//   .mc-progress-pct {
//     font-size: 11px;
//     font-weight: 700;
//     color: var(--accent1);
//   }

//   .mc-progress-track {
//     width: 100%;
//     height: 6px;
//     border-radius: 99px;
//     background: var(--border);
//     margin-bottom: 18px;
//     overflow: hidden;
//   }

//   .mc-progress-fill {
//     height: 100%;
//     border-radius: 99px;
//     background: var(--accent1);
//     transition: width 0.5s ease;
//   }

//   /* ── Button ── */
//   .mc-btn {
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     gap: 8px;
//     width: 100%;
//     padding: 13px 20px;
//     border-radius: 14px;
//     border: none;
//     background: var(--accent1);
//     color: #0a0a0a;
//     font-family: 'Poppins', sans-serif;
//     font-size: 13px;
//     font-weight: 700;
//     cursor: pointer;
//     transition: opacity 0.2s, transform 0.2s;
//     margin-top: auto;
//   }

//   .mc-btn:hover {
//     opacity: 0.88;
//     transform: translateY(-1px);
//   }

//   /* ── Empty ── */
//   .mc-empty {
//     grid-column: 1 / -1;
//     text-align: center;
//     padding: 80px 20px;
//   }

//   .mc-empty-icon {
//     font-size: 48px;
//     color: var(--accent1);
//     margin-bottom: 16px;
//     opacity: 0.6;
//   }

//   .mc-empty-text {
//     font-size: 16px;
//     font-weight: 600;
//     color: var(--text-muted);
//     margin: 0;
//   }
// `;

// /* ─── Inject styles once ─────────────────────────────────────────────────── */
// if (!document.getElementById("mc-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "mc-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// /* ─── Detect dark mode from parent class or media query ─────────────────── */
// const isDarkMode = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ─── Component ──────────────────────────────────────────────────────────── */
// const MyCourses = () => {
//   const [search, setSearch] = useState("");
//   const [courses, setCourses] = useState([]);
//   const [dark, setDark] = useState(isDarkMode);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${API}/courses/student`, { headers: authHeader() })
//       .then((res) => setCourses(res.data))
//       .catch(console.error);
//   }, []);

//   /* sync dark mode with document class changes */
//   useEffect(() => {
//     const observer = new MutationObserver(() => setDark(isDarkMode()));
//     observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => observer.disconnect();
//   }, []);

//   const filtered = courses.filter((c) =>
//     c.title.toLowerCase().includes(search.toLowerCase()),
//   );

//   const totalCourses = courses.length;
//   const inProgressCourses = courses.length;
//   const completedCourses = 0;

//   return (
//     <div className={`mc-root${dark ? " dark-theme" : ""}`}>
//       <div className="mc-inner">

//         {/* ── Header ── */}
//         <div className="mc-header">
//           <div className="mc-header-left">
//             <div className="mc-badge">
//               <FaGraduationCap />
//               Learning Dashboard
//             </div>
//             {/* <h1 className="mc-title">My Courses</h1> */}
//             <h1 style={{
//   fontFamily: "'Poppins',sans-serif",
//   fontWeight: 700,
//   fontSize: "clamp(1.5rem,3vw,2.2rem)",
//   color: "#3B82F6", // 🔵 Blue text
//   margin: "0 0 6px",
//   lineHeight: 1.1,
//   letterSpacing: "-0.02em"
// }}>
//   My Courses
// </h1>
//             <p className="mc-subtitle">Continue your learning journey and track your progress</p>

//             <div className="mc-stats">
//               <Stat
//                 icon={<FaBookOpen />}
//                 label="Enrolled"
//                 value={totalCourses}
//                 accent="#22d3ee"
//                 bg="rgba(34,211,238,0.10)"
//               />
//               <Stat
//                 icon={<FaChartLine />}
//                 label="In Progress"
//                 value={inProgressCourses}
//                 accent="#fb923c"
//                 bg="rgba(251,146,60,0.10)"
//               />
//               <Stat
//                 icon={<FaAward />}
//                 label="Completed"
//                 value={completedCourses}
//                 accent="#34d399"
//                 bg="rgba(52,211,153,0.10)"
//               />
//             </div>
//           </div>

//           <div className="mc-header-icon">
//             <FaBookOpen />
//           </div>
//         </div>

//         {/* ── Search ── */}
//         <div className="mc-search-wrap">
//           <div className="mc-search">
//             <FaSearch />
//             <input
//               type="text"
//               placeholder="Search courses..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* ── Grid ── */}
//         <div className="mc-grid">
//           {filtered.map((course) => (
//             <div key={course.id} className="mc-card">
//               <div className="mc-card-header">
//                 <h2 className="mc-card-title">{course.title}</h2>
//                 <div className="mc-card-icon">
//                   <FaBookOpen />
//                 </div>
//               </div>

//               <div className="mc-card-divider">
//                 <div className="mc-card-instructor-icon">
//                   <FaUser />
//                 </div>
//                 <span className="mc-card-instructor">{course.createdBy}</span>
//               </div>

//               <span className="mc-tag">{course.category || "General"}</span>

//               <div className="mc-progress-row">
//                 <span className="mc-progress-label">Progress</span>
//                 <span className="mc-progress-pct">0%</span>
//               </div>
//               <div className="mc-progress-track">
//                 <div className="mc-progress-fill" style={{ width: "0%" }} />
//               </div>

//               <button
//                 className="mc-btn"
//                 onClick={() => navigate(`/student/course/${course.id}`)}
//               >
//                 View Course
//                 <FaChevronRight style={{ fontSize: 12 }} />
//               </button>
//             </div>
//           ))}

//           {filtered.length === 0 && (
//             <div className="mc-empty">
//               <div className="mc-empty-icon">
//                 <FaBookOpen />
//               </div>
//               <p className="mc-empty-text">
//                 {search ? "No courses found" : "No courses enrolled"}
//               </p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// /* ─── Stat chip ──────────────────────────────────────────────────────────── */
// const Stat = ({ icon, label, value, accent, bg }) => (
//   <div className="mc-stat">
//     <div
//       className="mc-stat-icon"
//       style={{ background: bg, color: accent }}
//     >
//       {icon}
//     </div>
//     <div>
//       <div className="mc-stat-value" style={{ color: accent }}>{value}</div>
//       <div className="mc-stat-label">{label}</div>
//     </div>
//   </div>
// );

// export default MyCourses;






















































import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  Search,
  User,
  GraduationCap,
  PlayCircle,
  FileText,
} from "lucide-react";

import { courseService } from "@/services/courseService";
import { progressService } from "@/services/progressService";

// ── Same Global Design System the Dashboard (Golden Reference) uses.
// Nothing page-specific is redefined here — tokens, StatCard, and
// PageContainer are the single source of truth for every page.
import { T, StatCard, PageContainer, FONT_FAMILY, FONT_WEIGHT, FONT_SIZE, LETTER_SPACING, LINE_HEIGHT } from "@/design-system";

/* ─── JWT helper (identical to Dashboard) ─── */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ─── Progress helpers (identical to Dashboard's)
   NOTE: these currently live in both Dashboard.jsx and here. Since the
   design system doc calls Dashboard the Golden Reference and says pages
   should share tokens, the next cleanup step should hoist these two
   functions into @/design-system (e.g. design-system/utils/progress.js)
   so there's truly one copy. Left duplicated-but-identical for now so
   this page matches pixel-for-pixel without touching the reference file. ─── */
const getProgressColor = (pct) => {
  if (pct >= 100) return "#34d399";
  if (pct >= 60) return "#a78bfa";
  if (pct >= 30) return "#fb923c";
  return "#94a3b8";
};

const getStatusLabel = (pct, t) => {
  if (pct >= 100) return { label: "Completed", bg: t.statusCompletedBg, color: t.statusCompletedText };
  if (pct > 0) return { label: "In Progress", bg: t.statusProgressBg, color: t.statusProgressText };
  return { label: "Not Started", bg: t.statusNotStartedBg, color: t.statusNotStartedText };
};

/* ═══════════════════════════════════════════════
   MY COURSES PAGE
   Same shell as Dashboard: PageContainer + hero band + StatCard row +
   the exact course-card grid styling from Dashboard's CoursesTab.
═══════════════════════════════════════════════ */
const MyCourses = () => {
  const navigate = useNavigate();
  const studentEmail = getEmailFromToken();

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    if (!studentEmail) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const coursesRes = await courseService.getStudentCourses();
        const courseList = coursesRes?.data ?? [];
        setCourses(courseList);

        const entries = await Promise.all(
          courseList.map(async (c) => {
            try {
              const res = await progressService.getProgress(studentEmail, c.id);
              return [c.id, res.data];
            } catch {
              return [c.id, null];
            }
          }),
        );
        setProgressMap(Object.fromEntries(entries));
      } catch (err) {
        console.error("My Courses load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentEmail]);

  const filtered = courses.filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()));

  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => {
    const p = progressMap[c.id];
    return p && p.progressPercentage >= 100;
  }).length;
  const inProgressCourses = courses.filter((c) => {
    const p = progressMap[c.id];
    return p && p.progressPercentage > 0 && p.progressPercentage < 100;
  }).length;

  const stats = [
    { label: "Enrolled Courses", numericValue: totalCourses, change: `${totalCourses} total`, trend: "up", icon: BookOpen, colorKey: "blue" },
    { label: "In Progress", numericValue: inProgressCourses, change: `${inProgressCourses} active`, trend: "up", icon: TrendingUp, colorKey: "orange" },
    { label: "Completed", numericValue: completedCourses, change: `${completedCourses} finished`, trend: "up", icon: CheckCircle, colorKey: "green" },
  ];

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      {/* ═══ HERO — same band styling as Dashboard ═══ */}
      <div
        className="dfade"
        style={{
          padding: "8px 0 24px",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
          boxShadow: "none",
        }}
      >
        <div className="hero-flex">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} className="d1" />
              <span
                style={{
                  fontSize: FONT_SIZE.eyebrow,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: LETTER_SPACING.eyebrowWide,
                  textTransform: "uppercase",
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Student Portal
              </span>
            </div>
            <h1
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.heroTitle,
                fontSize: FONT_SIZE.heroTitle,
                color: "#3B82F6",
                margin: "0 0 6px",
                lineHeight: LINE_HEIGHT.heroTitle,
                letterSpacing: LETTER_SPACING.heroTitle,
              }}
            >
              My Courses
            </h1>
            <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
              Continue your learning journey and track your progress
            </p>
          </div>

          <div className="hero-badges">
            <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 999, padding: "8px 18px", color: "#7c3aed", fontSize: 11, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, fontFamily: FONT_FAMILY }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS — same StatCard component as Dashboard ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} />
        ))}
      </div>

      {/* ═══ SEARCH ═══ */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: "relative", width: 360, maxWidth: "100%" }}>
          <Search size={15} color={t.textMuted} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "13px 16px 13px 46px",
              borderRadius: 14,
              border: `1px solid ${t.border}`,
              background: t.cardBg,
              color: t.text,
              fontFamily: FONT_FAMILY,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.medium,
              outline: "none",
              boxShadow: t.shadow,
              boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#22d3ee";
              e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = t.border;
              e.target.style.boxShadow = t.shadow;
            }}
          />
        </div>
      </div>

      {/* ═══ COURSE GRID — identical card design to Dashboard's CoursesTab ═══ */}
      {loading ? (
        <div className="courses-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, animation: "pulse 1.5s ease-in-out infinite" }}>
              <div style={{ height: 4, borderRadius: 99, background: t.barBg, marginBottom: 18 }} />
              <div style={{ width: 44, height: 44, borderRadius: 12, background: t.barBg, marginBottom: 14 }} />
              <div style={{ height: 12, borderRadius: 6, background: t.barBg, width: "75%", marginBottom: 8 }} />
              <div style={{ height: 8, borderRadius: 4, background: t.barBg, marginBottom: 16 }} />
              <div style={{ height: 6, borderRadius: 99, background: t.barBg, marginBottom: 16 }} />
              <div style={{ height: 36, borderRadius: 12, background: t.barBg }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "60px 20px", textAlign: "center", boxShadow: t.shadow }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <BookOpen size={28} color={t.emptyIcon} />
          </div>
          <p style={{ fontSize: 15, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 6px", fontFamily: FONT_FAMILY }}>
            {search ? "No Courses Found" : "No Courses Yet"}
          </p>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
            {search ? "Try a different search term." : "You haven't been enrolled in any courses."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
            Showing <strong style={{ color: t.text }}>{filtered.length}</strong> enrolled course{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="courses-grid">
            {filtered.map((course) => {
              const prog = progressMap[course.id];
              const pct = prog ? Math.round(prog.progressPercentage) : 0;
              const completed = prog?.completedContentIds?.length ?? 0;
              const total = prog?.totalContentCount ?? 0;
              const status = getStatusLabel(pct, t);
              const color = getProgressColor(pct);

              return (
                <div
                  key={course.id}
                  style={{ background: t.courseCardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.2s", cursor: "default" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = t.shadowHov;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = t.shadow;
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ height: 4, background: color, opacity: 0.85 }} />
                  <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {pct >= 100 ? <CheckCircle size={20} color={color} /> : <BookOpen size={20} color={color} />}
                      </div>
                      <span style={{ fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold, letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 999, background: status.bg, color: status.color, fontFamily: FONT_FAMILY, whiteSpace: "nowrap" }}>
                        {status.label}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 4px", fontFamily: FONT_FAMILY, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {course.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 14px" }}>
                      <User size={11} color={t.textMuted} />
                      <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_FAMILY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {course.createdBy || "Instructor"}
                      </span>
                    </div>
                    <div style={{ marginTop: "auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_FAMILY }}>Progress</span>
                        <span style={{ fontSize: 11, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                        <div style={{ height: "100%", borderRadius: 99, background: color, width: `${pct}%`, transition: "width 0.7s ease" }} />
                      </div>
                      {total > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: t.textMuted, fontFamily: FONT_FAMILY, marginBottom: 12 }}>
                          <FileText size={11} color={t.textMuted} />
                          {completed} / {total} modules completed
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/student/course/${course.id}`)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 12,
                          background: pct >= 100 ? status.bg : "linear-gradient(135deg,#7c3aed,#a855f7)",
                          border: pct >= 100 ? `1px solid ${color}40` : "none",
                          color: pct >= 100 ? color : "#fff",
                          fontSize: 11,
                          fontWeight: FONT_WEIGHT.bold,
                          cursor: "pointer",
                          fontFamily: FONT_FAMILY,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          transition: "all 0.2s",
                        }}
                      >
                        {pct >= 100 ? (
                          <>
                            <CheckCircle size={13} /> Review Course
                          </>
                        ) : pct > 0 ? (
                          <>
                            <PlayCircle size={13} /> Continue Learning
                          </>
                        ) : (
                          <>
                            <PlayCircle size={13} /> Start Course
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default MyCourses;