
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // ICONS
// import {
//   FaAward,
//   FaBookOpen,
//   FaChartLine,
//   FaChevronRight,
//   FaGraduationCap,
//   FaSearch,
//   FaUser,
// } from "react-icons/fa";

// const API =  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const MyCourses = () => {
//   const [search, setSearch] = useState("");
//   const [courses, setCourses] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${API}/courses/student`, { headers: authHeader() })
//       .then((res) => setCourses(res.data))
//       .catch(console.error);
//   }, []);

//   const filtered = courses.filter((c) =>
//     c.title.toLowerCase().includes(search.toLowerCase()),
//   );

//   // Stats (placeholder – backend same)
//   const totalCourses = courses.length;
//   const inProgressCourses = courses.length;
//   const completedCourses = 0;

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       {/* ================= LIGHT BLUE HERO ================= */}
//       <header
//         className="relative overflow-hidden
//         bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//         dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
//       >
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative px-6 py-10 md:py-12 max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//             {/* LEFT */}
//             <div className="flex-1 text-center md:text-left">
//               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 backdrop-blur border border-white/30 mb-4">
//                 <FaGraduationCap className="h-3.5 w-3.5 text-white" />
//                 <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
//                   Learning Dashboard
//                 </span>
//               </div>

//               <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
//                 My Courses
//               </h1>

//               <p className="text-sm md:text-base text-white/90 mb-5 max-w-xl">
//                 Continue your learning journey and track your progress
//               </p>

//               {/* STATS */}
//               <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
//                 <Stat
//                   icon={<FaBookOpen />}
//                   label="Enrolled"
//                   value={totalCourses}
//                 />
//                 <Stat
//                   icon={<FaChartLine />}
//                   label="In Progress"
//                   value={inProgressCourses}
//                 />
//                 <Stat
//                   icon={<FaAward />}
//                   label="Completed"
//                   value={completedCourses}
//                 />
//               </div>
//             </div>

//             {/* RIGHT ICON */}
//             <div className="hidden lg:block">
//               <div className="w-40 h-40 rounded-xl bg-white/30 backdrop-blur border border-white/30 flex items-center justify-center shadow">
//                 <FaBookOpen className="h-14 w-14 text-white/90" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ================= SEARCH ================= */}
//       <div className="max-w-7xl mx-auto px-6 py-10">
//         <div className="mb-8">
//           <div className="relative w-full md:w-96">
//             <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search courses..."
//               className="w-full pl-12 pr-4 py-3 rounded-xl
//                          bg-white dark:bg-slate-900
//                          border border-slate-200 dark:border-slate-700
//                          text-slate-900 dark:text-slate-100
//                          focus:outline-none focus:ring-2 focus:ring-blue-500
//                          shadow-sm"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* ================= COURSES GRID ================= */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filtered.map((course) => (
//             <div
//               key={course.id}
//               className="group p-6 rounded-2xl
//                          bg-white dark:bg-slate-900
//                          border border-slate-200 dark:border-slate-800
//                          shadow-sm hover:shadow-xl
//                          transition-all hover:-translate-y-1
//                          flex flex-col"
//             >
//               {/* HEADER */}
//               <div className="flex justify-between items-start mb-4">
//                 <h2
//                   className="text-lg font-bold
//                                text-slate-900 dark:text-slate-100
//                                group-hover:text-blue-600 transition-colors
//                                line-clamp-2"
//                 >
//                   {course.title}
//                 </h2>
//                 <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
//                   <FaBookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                 </div>
//               </div>

//               {/* INSTRUCTOR */}
//               <div
//                 className="flex items-center gap-2 mb-4 pb-3
//                               border-b border-slate-200 dark:border-slate-700"
//               >
//                 <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
//                   <FaUser className="h-4 w-4 text-slate-600 dark:text-slate-400" />
//                 </div>
//                 <p
//                   className="text-sm font-semibold
//                               text-slate-900 dark:text-slate-100 truncate"
//                 >
//                   {course.createdBy}
//                 </p>
//               </div>

//               {/* CATEGORY */}
//               <span
//                 className="inline-flex w-fit px-3 py-1.5 mb-4
//                                text-xs font-semibold rounded-lg
//                                bg-blue-100 dark:bg-blue-900/30
//                                text-blue-700 dark:text-blue-300"
//               >
//                 {course.category || "General"}
//               </span>

//               {/* PROGRESS */}
//               <div className="mt-auto">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-xs text-slate-600 dark:text-slate-400">
//                     Progress
//                   </span>
//                   <span className="text-xs font-bold text-blue-600">0%</span>
//                 </div>

//                 <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mb-4">
//                   <div
//                     className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full"
//                     style={{ width: "0%" }}
//                   />
//                 </div>

//                 <button
//                   onClick={() => navigate(`/student/course/${course.id}`)}
//                   className="w-full inline-flex items-center justify-center gap-2
//                              py-3 px-4 rounded-xl
//                              bg-blue-600 hover:bg-blue-700
//                              text-white font-semibold transition"
//                 >
//                   View Course
//                   <FaChevronRight className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           ))}

//           {filtered.length === 0 && (
//             <div className="col-span-full text-center py-16">
//               <FaBookOpen className="mx-auto h-12 w-12 text-blue-500 mb-4" />
//               <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
//                 {search ? "No courses found" : "No courses enrolled"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ================= STAT =================
// const Stat = ({ icon, label, value }) => (
//   <div
//     className="flex items-center gap-2 px-4 py-2
//                   rounded-xl bg-white/30 backdrop-blur
//                   border border-white/30 text-white shadow"
//   >
//     <div className="text-lg">{icon}</div>
//     <div>
//       <p className="text-lg font-bold leading-none">{value}</p>
//       <p className="text-[11px] text-white/80">{label}</p>
//     </div>
//   </div>
// );

// export default MyCourses;














import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaAward,
  FaBookOpen,
  FaChartLine,
  FaChevronRight,
  FaGraduationCap,
  FaSearch,
  FaUser,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

/* ─── CSS injected once ─────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --bg:        #f1f5f9;
    --card:      #ffffff;
    --text:      #0f172a;
    --text-muted:#64748b;
    --border:    #e2e8f0;
    --accent1:   #22d3ee;
    --accent2:   #fb923c;
    --accent3:   #34d399;
    --accent4:   #a78bfa;
    --shadow:    0 4px 24px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --radius:    20px;
  }

  .dark-theme {
    --bg:        #0a0a0a;
    --card:      #111111;
    --text:      #ffffff;
    --text-muted:#94a3b8;
    --border:    rgba(255,255,255,0.06);
    --shadow:    0 4px 24px rgba(0,0,0,0.40);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .mc-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s, color 0.3s;
  }

  .mc-inner {
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ── Header card ── */
  .mc-header {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px 36px;
    margin-bottom: 28px;
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .mc-header-left {}

  .mc-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 50px;
    border: 1px solid var(--border);
    background: rgba(34,211,238,0.08);
    color: var(--accent1);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .mc-title {
    font-size: 32px;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 6px;
    line-height: 1.15;
  }

  .mc-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0 0 24px;
  }

  .mc-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .mc-stat {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 20px;
    min-width: 140px;
    box-shadow: var(--shadow);
  }

  .mc-stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .mc-stat-value {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 3px;
  }

  .mc-stat-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .mc-header-icon {
    width: 120px;
    height: 120px;
    border-radius: var(--radius);
    background: rgba(34,211,238,0.08);
    border: 1px solid rgba(34,211,238,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: var(--accent1);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .mc-header-icon { display: none; }
    .mc-title { font-size: 24px; }
  }

  /* ── Search ── */
  .mc-search-wrap {
    margin-bottom: 28px;
  }

  .mc-search {
    position: relative;
    width: 360px;
    max-width: 100%;
  }

  .mc-search svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 15px;
    pointer-events: none;
  }

  .mc-search input {
    width: 100%;
    padding: 13px 16px 13px 46px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--text);
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 500;
    outline: none;
    box-shadow: var(--shadow);
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .mc-search input::placeholder { color: var(--text-muted); }

  .mc-search input:focus {
    border-color: var(--accent1);
    box-shadow: 0 0 0 3px rgba(34,211,238,0.12);
  }

  /* ── Grid ── */
  .mc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  /* ── Course Card ── */
  .mc-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
    cursor: default;
  }

  .mc-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(34,211,238,0.20);
  }

  .mc-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .mc-card-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s;
    margin: 0;
  }

  .mc-card:hover .mc-card-title { color: var(--accent1); }

  .mc-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: rgba(34,211,238,0.10);
    color: var(--accent1);
    flex-shrink: 0;
  }

  .mc-card-divider {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }

  .mc-card-instructor-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(167,139,250,0.12);
    color: var(--accent4);
    font-size: 12px;
    flex-shrink: 0;
  }

  .mc-card-instructor {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-tag {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(52,211,153,0.10);
    color: var(--accent3);
    border: 1px solid rgba(52,211,153,0.15);
    margin-bottom: 18px;
    width: fit-content;
  }

  /* ── Progress ── */
  .mc-progress-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .mc-progress-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .mc-progress-pct {
    font-size: 11px;
    font-weight: 700;
    color: var(--accent1);
  }

  .mc-progress-track {
    width: 100%;
    height: 6px;
    border-radius: 99px;
    background: var(--border);
    margin-bottom: 18px;
    overflow: hidden;
  }

  .mc-progress-fill {
    height: 100%;
    border-radius: 99px;
    background: var(--accent1);
    transition: width 0.5s ease;
  }

  /* ── Button ── */
  .mc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 13px 20px;
    border-radius: 14px;
    border: none;
    background: var(--accent1);
    color: #0a0a0a;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    margin-top: auto;
  }

  .mc-btn:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  /* ── Empty ── */
  .mc-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
  }

  .mc-empty-icon {
    font-size: 48px;
    color: var(--accent1);
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .mc-empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-muted);
    margin: 0;
  }
`;

/* ─── Inject styles once ─────────────────────────────────────────────────── */
if (!document.getElementById("mc-styles")) {
  const tag = document.createElement("style");
  tag.id = "mc-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

/* ─── Detect dark mode from parent class or media query ─────────────────── */
const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ─── Component ──────────────────────────────────────────────────────────── */
const MyCourses = () => {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [dark, setDark] = useState(isDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/courses/student`, { headers: authHeader() })
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  /* sync dark mode with document class changes */
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDarkMode()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCourses = courses.length;
  const inProgressCourses = courses.length;
  const completedCourses = 0;

  return (
    <div className={`mc-root${dark ? " dark-theme" : ""}`}>
      <div className="mc-inner">

        {/* ── Header ── */}
        <div className="mc-header">
          <div className="mc-header-left">
            <div className="mc-badge">
              <FaGraduationCap />
              Learning Dashboard
            </div>
            <h1 className="mc-title">My Courses</h1>
            <p className="mc-subtitle">Continue your learning journey and track your progress</p>

            <div className="mc-stats">
              <Stat
                icon={<FaBookOpen />}
                label="Enrolled"
                value={totalCourses}
                accent="#22d3ee"
                bg="rgba(34,211,238,0.10)"
              />
              <Stat
                icon={<FaChartLine />}
                label="In Progress"
                value={inProgressCourses}
                accent="#fb923c"
                bg="rgba(251,146,60,0.10)"
              />
              <Stat
                icon={<FaAward />}
                label="Completed"
                value={completedCourses}
                accent="#34d399"
                bg="rgba(52,211,153,0.10)"
              />
            </div>
          </div>

          <div className="mc-header-icon">
            <FaBookOpen />
          </div>
        </div>

        {/* ── Search ── */}
        <div className="mc-search-wrap">
          <div className="mc-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="mc-grid">
          {filtered.map((course) => (
            <div key={course.id} className="mc-card">
              <div className="mc-card-header">
                <h2 className="mc-card-title">{course.title}</h2>
                <div className="mc-card-icon">
                  <FaBookOpen />
                </div>
              </div>

              <div className="mc-card-divider">
                <div className="mc-card-instructor-icon">
                  <FaUser />
                </div>
                <span className="mc-card-instructor">{course.createdBy}</span>
              </div>

              <span className="mc-tag">{course.category || "General"}</span>

              <div className="mc-progress-row">
                <span className="mc-progress-label">Progress</span>
                <span className="mc-progress-pct">0%</span>
              </div>
              <div className="mc-progress-track">
                <div className="mc-progress-fill" style={{ width: "0%" }} />
              </div>

              <button
                className="mc-btn"
                onClick={() => navigate(`/student/course/${course.id}`)}
              >
                View Course
                <FaChevronRight style={{ fontSize: 12 }} />
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="mc-empty">
              <div className="mc-empty-icon">
                <FaBookOpen />
              </div>
              <p className="mc-empty-text">
                {search ? "No courses found" : "No courses enrolled"}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

/* ─── Stat chip ──────────────────────────────────────────────────────────── */
const Stat = ({ icon, label, value, accent, bg }) => (
  <div className="mc-stat">
    <div
      className="mc-stat-icon"
      style={{ background: bg, color: accent }}
    >
      {icon}
    </div>
    <div>
      <div className="mc-stat-value" style={{ color: accent }}>{value}</div>
      <div className="mc-stat-label">{label}</div>
    </div>
  </div>
);

export default MyCourses;