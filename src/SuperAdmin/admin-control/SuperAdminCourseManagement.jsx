// import { courseService } from "@/services/courseService";
// import {
//   ArrowLeft,
//   BookOpen,
//   Layers,
//   Mail,
//   Search,
//   Tag,
//   Users,
//   Globe,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// /* ─── Styles ──────────────────────────────────────────────────────────── */
// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

// :root {
//   --bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#a78bfa;--c2:#fb923c;--c3:#34d399;--c4:#22d3ee;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;
// }
// .sm-dk {
//   --bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;
//   --bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);
// }

// .sm { font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box; }
// .sm-inner { max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px; }

// /* ── header ── */
// .sm-hdr { background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap; }
// .sm-hdr-l { display:flex;align-items:center;gap:14px; }
// .sm-back { display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0; }
// .sm-back:hover { border-color:rgba(167,139,250,.35);color:var(--c1); }
// .sm-hdr-ico { width:52px;height:52px;border-radius:14px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0; }
// .sm-bdg { display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(167,139,250,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px; }
// .sm-h1 { font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px; }
// .sm-sub { font-size:13px;color:var(--mu);margin:0; }
// .sm-chips { display:flex;gap:10px;flex-wrap:wrap; }
// .sm-chip { display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh); }

// /* ── tabs ── */
// .sm-tabs { display:flex;gap:4px;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:5px;width:fit-content;box-shadow:var(--sh); }
// .sm-tab { display:inline-flex;align-items:center;gap:7px;padding:9px 20px;border-radius:12px;border:none;font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:var(--mu); }
// .sm-tab:hover { color:var(--c1); }
// .sm-tab.sm-tab-active { background:rgba(167,139,250,.12);color:var(--c1);border:1px solid rgba(167,139,250,.25); }

// /* ── toolbar ── */
// .sm-toolbar { display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap; }
// .sm-search { position:relative; }
// .sm-search svg { position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu); }
// .sm-search input { padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:280px;transition:border-color .2s,box-shadow .2s; }
// .sm-search input::placeholder { color:var(--mu); }
// .sm-search input:focus { border-color:var(--c1);box-shadow:0 0 0 3px rgba(167,139,250,.12); }

// /* ── card ── */
// .sm-card { background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden; }
// .sm-card-head { display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg); }
// .sm-card-title { font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px; }
// .sm-card-sub { font-size:11px;color:var(--mu);margin:0; }

// /* ── skeleton ── */
// .sm-skel { display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);animation:sm-pulse 1.4s ease-in-out infinite; }
// .sm-skel-l { display:flex;align-items:center;gap:12px; }
// .sm-skel-sq { width:38px;height:38px;border-radius:12px;background:var(--bd); }
// .sm-skel-line { height:10px;border-radius:6px;background:var(--bd); }
// .sm-skel-pill { height:22px;width:80px;border-radius:30px;background:var(--bd); }
// @keyframes sm-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

// /* ── empty ── */
// .sm-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center; }
// .sm-empty-ico { width:56px;height:56px;border-radius:16px;background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;color:var(--c1); }
// .sm-empty-t { font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px; }
// .sm-empty-s { font-size:12px;color:var(--mu);margin:0; }

// /* ── table ── */
// table.sm-t { width:100%;border-collapse:collapse;font-size:13px; }
// .sm-t thead th { padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd); }
// .sm-t thead th:first-child { padding-left:22px; }
// .sm-t thead th:last-child { padding-right:22px; }
// .sm-t tbody tr { border-bottom:1px solid var(--bd);transition:background .15s; }
// .sm-t tbody tr:last-child { border-bottom:none; }
// .sm-t tbody tr:hover { background:rgba(167,139,250,.025); }
// .sm-t tbody td { padding:12px 14px;vertical-align:middle; }
// .sm-t tbody td:first-child { padding-left:22px; }
// .sm-t tbody td:last-child { padding-right:22px; }
// .sm-idx { font-size:12px;font-weight:700;color:var(--mu); }
// .sm-course-cell { display:flex;align-items:center;gap:12px; }
// .sm-course-av { width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
// .sm-course-name { font-size:13px;font-weight:700;color:var(--tx);transition:color .15s; }
// .sm-t tbody tr:hover .sm-course-name { color:var(--c1); }
// .sm-cat-tag { display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid; }
// .sm-trainer-cell { display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu); }
// .sm-status-ok { display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3); }
// .sm-dot { width:6px;height:6px;border-radius:50%;background:var(--c3);animation:sm-blink 1.4s ease-in-out infinite; }
// @keyframes sm-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
// .sm-count-cell { display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:700;color:var(--tx); }
// `;

// if (!document.getElementById("sm-st")) {
//   const t = document.createElement("style");
//   t.id = "sm-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// /* ── helpers ── */
// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const CAT_COLORS = [
//   {
//     bg: "rgba(167,139,250,.10)",
//     color: "var(--c1)",
//     bd: "rgba(167,139,250,.20)",
//   },
//   {
//     bg: "rgba(34,211,238,.10)",
//     color: "var(--c4)",
//     bd: "rgba(34,211,238,.20)",
//   },
//   {
//     bg: "rgba(251,146,60,.10)",
//     color: "var(--c2)",
//     bd: "rgba(251,146,60,.20)",
//   },
//   {
//     bg: "rgba(52,211,153,.10)",
//     color: "var(--c3)",
//     bd: "rgba(52,211,153,.20)",
//   },
//   {
//     bg: "rgba(248,113,113,.10)",
//     color: "var(--cr)",
//     bd: "rgba(248,113,113,.20)",
//   },
// ];
// const catColor = (val) =>
//   CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

// const GRAD_BG = [
//   "linear-gradient(135deg,#6d28d9,#4338ca)",
//   "linear-gradient(135deg,#0891b2,#0e7490)",
//   "linear-gradient(135deg,#be123c,#9f1239)",
//   "linear-gradient(135deg,#b45309,#92400e)",
//   "linear-gradient(135deg,#047857,#065f46)",
//   "linear-gradient(135deg,#1d4ed8,#1e40af)",
// ];
// const gradBg = (val) =>
//   GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

// /* ════════════════════════════════════════════════════════════════════
//    COURSES TAB
// ════════════════════════════════════════════════════════════════════ */
// const CoursesTab = ({ courses, loading }) => {
//   const [search, setSearch] = useState("");

//   const filtered = courses.filter(
//     (c) =>
//       c.name.toLowerCase().includes(search.toLowerCase()) ||
//       (c.trainerEmail || "").toLowerCase().includes(search.toLowerCase()) ||
//       (c.category || "").toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <>
//       <div className="sm-toolbar">
//         <div className="sm-search">
//           <Search size={14} />
//           <input
//             placeholder="Search by course, trainer, or category…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="sm-card">
//         <div className="sm-card-head">
//           <div>
//             <p className="sm-card-title">Independent Trainer Courses</p>
//             <p className="sm-card-sub">
//               {filtered.length} course{filtered.length !== 1 && "s"} found
//             </p>
//           </div>
//         </div>

//         {loading &&
//           [1, 2, 3, 4].map((i) => (
//             <div key={i} className="sm-skel">
//               <div className="sm-skel-l">
//                 <div className="sm-skel-sq" />
//                 <div>
//                   <div
//                     className="sm-skel-line"
//                     style={{ width: 160, marginBottom: 8 }}
//                   />
//                   <div className="sm-skel-line" style={{ width: 110 }} />
//                 </div>
//               </div>
//               <div className="sm-skel-pill" />
//             </div>
//           ))}

//         {!loading && filtered.length === 0 && (
//           <div className="sm-empty">
//             <div className="sm-empty-ico">
//               <BookOpen size={26} />
//             </div>
//             <p className="sm-empty-t">No courses found</p>
//             <p className="sm-empty-s">
//               Courses created by independent trainers (no organization) will
//               appear here
//             </p>
//           </div>
//         )}

//         {!loading && filtered.length > 0 && (
//           <table className="sm-t">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Course</th>
//                 <th>Category</th>
//                 <th>Trainer</th>
//                 <th>Batch ID</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((c, i) => {
//                 const cc = catColor(c.category);
//                 return (
//                   <tr key={c.id}>
//                     <td>
//                       <span className="sm-idx">
//                         {String(i + 1).padStart(2, "0")}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="sm-course-cell">
//                         <div
//                           className="sm-course-av"
//                           style={{ background: gradBg(c.name) }}
//                         >
//                           <BookOpen size={16} color="white" />
//                         </div>
//                         <span className="sm-course-name">{c.name}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <span
//                         className="sm-cat-tag"
//                         style={{
//                           background: cc.bg,
//                           color: cc.color,
//                           borderColor: cc.bd,
//                         }}
//                       >
//                         <Tag size={11} /> {c.category || "—"}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="sm-trainer-cell">
//                         <Mail size={12} /> {c.trainerEmail}
//                       </div>
//                     </td>
//                     <td>
//                       <span
//                         style={{
//                           fontSize: 12,
//                           fontWeight: 600,
//                           color: "var(--mu)",
//                         }}
//                       >
//                         #{c.batchId}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="sm-status-ok">
//                         <span className="sm-dot" /> PUBLISHED
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </>
//   );
// };

// /* ════════════════════════════════════════════════════════════════════
//    CATEGORIES TAB
// ════════════════════════════════════════════════════════════════════ */
// const CategoriesTab = ({ courses, loading }) => {
//   const [search, setSearch] = useState("");

//   // Derive category counts from the same courses list — no extra API call needed
//   const categoryMap = {};
//   courses.forEach((c) => {
//     const cat = c.category || "Uncategorized";
//     categoryMap[cat] = (categoryMap[cat] || 0) + 1;
//   });
//   const allCategories = Object.entries(categoryMap).map(([name, count]) => ({
//     name,
//     count,
//   }));

//   const filtered = allCategories.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <>
//       <div className="sm-toolbar">
//         <div className="sm-search">
//           <Search size={14} />
//           <input
//             placeholder="Search categories…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="sm-card">
//         <div className="sm-card-head">
//           <div>
//             <p className="sm-card-title">Course Categories</p>
//             <p className="sm-card-sub">
//               {filtered.length} categor{filtered.length !== 1 ? "ies" : "y"}{" "}
//               found
//             </p>
//           </div>
//         </div>

//         {loading &&
//           [1, 2, 3].map((i) => (
//             <div key={i} className="sm-skel">
//               <div className="sm-skel-l">
//                 <div className="sm-skel-sq" />
//                 <div>
//                   <div
//                     className="sm-skel-line"
//                     style={{ width: 140, marginBottom: 8 }}
//                   />
//                   <div className="sm-skel-line" style={{ width: 80 }} />
//                 </div>
//               </div>
//               <div className="sm-skel-pill" />
//             </div>
//           ))}

//         {!loading && filtered.length === 0 && (
//           <div className="sm-empty">
//             <div className="sm-empty-ico">
//               <Layers size={26} />
//             </div>
//             <p className="sm-empty-t">No categories found</p>
//             <p className="sm-empty-s">
//               Categories are derived from independent trainer courses
//             </p>
//           </div>
//         )}

//         {!loading && filtered.length > 0 && (
//           <table className="sm-t">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Category</th>
//                 <th>Total Courses</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((c, i) => {
//                 const cc = catColor(c.name);
//                 return (
//                   <tr key={c.name}>
//                     <td>
//                       <span className="sm-idx">
//                         {String(i + 1).padStart(2, "0")}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="sm-course-cell">
//                         <div
//                           className="sm-course-av"
//                           style={{ background: gradBg(c.name) }}
//                         >
//                           <Tag size={16} color="white" />
//                         </div>
//                         <span
//                           className="sm-cat-tag"
//                           style={{
//                             background: cc.bg,
//                             color: cc.color,
//                             borderColor: cc.bd,
//                           }}
//                         >
//                           <Tag size={11} /> {c.name}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <span className="sm-count-cell">
//                         <BookOpen size={13} style={{ color: "var(--mu)" }} />
//                         {c.count} {c.count === 1 ? "course" : "courses"}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="sm-status-ok">
//                         <span className="sm-dot" /> Active
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </>
//   );
// };

// /* ════════════════════════════════════════════════════════════════════
//    MAIN PAGE
// ════════════════════════════════════════════════════════════════════ */
// const SuperAdminCourseManagement = () => {
//   const navigate = useNavigate();
//   const [dark, setDark] = useState(isDark);
//   const [activeTab, setActiveTab] = useState("courses"); // "courses" | "categories"
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     courseService
//       .getIndependentTrainerCourses() // ← new service method
//       .then((res) => {
//         const mapped = (res.data || []).map((c) => ({
//           id: c.id,
//           name: c.title,
//           category: c.category,
//           trainerEmail: c.ownerEmail,
//           batchId: c.batchId,
//         }));
//         setCourses(mapped);
//       })
//       .catch((err) => console.error("Failed to load independent courses", err))
//       .finally(() => setLoading(false));
//   }, []);

//   // Derive category count for chips
//   const categoryCount = new Set(
//     courses.map((c) => c.category || "Uncategorized"),
//   ).size;

//   return (
//     <div className={`sm${dark ? " sm-dk" : ""}`}>
//       <div className="sm-inner">
//         {/* ── Header ── */}
//         <div className="sm-hdr">
//           <div className="sm-hdr-l">
//             <button className="sm-back" onClick={() => navigate(-1)}>
//               <ArrowLeft size={14} /> Back
//             </button>
//             <div className="sm-hdr-ico">
//               <BookOpen size={24} />
//             </div>
//             <div>
//               <div className="sm-bdg">
//                 <Globe size={10} /> Super Admin · Independent Trainers
//               </div>
//               <h1 className="sm-h1">Course Management</h1>
//               <p className="sm-sub">
//                 Courses created by trainers not linked to any organization
//               </p>
//             </div>
//           </div>
//           <div className="sm-chips">
//             <div className="sm-chip">
//               <BookOpen size={14} style={{ color: "var(--c1)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c1)" }}>
//                 {courses.length}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Courses
//               </span>
//             </div>
//             <div className="sm-chip">
//               <Layers size={14} style={{ color: "var(--c4)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c4)" }}>
//                 {categoryCount}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Categories
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ── Tabs ── */}
//         <div className="sm-tabs">
//           <button
//             className={`sm-tab${activeTab === "courses" ? " sm-tab-active" : ""}`}
//             onClick={() => setActiveTab("courses")}
//           >
//             <BookOpen size={14} /> Courses
//           </button>
//           <button
//             className={`sm-tab${activeTab === "categories" ? " sm-tab-active" : ""}`}
//             onClick={() => setActiveTab("categories")}
//           >
//             <Layers size={14} /> Categories
//           </button>
//         </div>

//         {/* ── Tab content ── */}
//         {activeTab === "courses" ? (
//           <CoursesTab courses={courses} loading={loading} />
//         ) : (
//           <CategoriesTab courses={courses} loading={loading} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SuperAdminCourseManagement;



























































import { courseService } from "@/services/courseService";
import {
  BookOpen,
  Layers,
  Mail,
  Search,
  Tag,
  Users,
  Globe,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

:root {
  --bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#a78bfa;--c2:#fb923c;--c3:#34d399;--c4:#22d3ee;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:16px;
}
.sm-dk {
  --bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;
  --bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);
}

.sm { font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:16px 20px;box-sizing:border-box;width:100%; }
.sm-inner { max-width:100%;width:100%;margin:0 auto;display:flex;flex-direction:column;gap:14px;box-sizing:border-box; }

/* ── header (compact, colorful gradient hero — color switches per tab) ── */
.sm-hdr { position:relative;overflow:hidden;border-radius:14px;padding:14px 18px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;transition:background .25s; }
.sm-hdr::before { content:"";position:absolute;top:0;left:0;bottom:0;width:4px; }
.sm-hdr-courses, .sm-hdr-categories { background:linear-gradient(135deg,#fff5f0 0%,#ffe9d6 55%,#ffdfc2 100%);border:1px solid rgba(251,146,60,.25); }
.sm-hdr-courses::before, .sm-hdr-categories::before { background:linear-gradient(180deg,#fed7aa,#fb923c); }
.sm-hdr-courses .sm-h1, .sm-hdr-categories .sm-h1 { color:#7c2d12; }
.sm-hdr-courses .sm-sub, .sm-hdr-categories .sm-sub { color:rgba(124,45,18,.65); }
.sm-hdr-courses .sm-bdg, .sm-hdr-categories .sm-bdg { background:rgba(251,146,60,.16);border-color:rgba(251,146,60,.35);color:#c2410c; }
.sm-hdr-courses .sm-hdr-ico, .sm-hdr-categories .sm-hdr-ico { background:rgba(251,146,60,.14);border-color:rgba(251,146,60,.30);color:#c2410c; }
.sm-hdr-l { display:flex;align-items:center;gap:12px;position:relative; }
.sm-hdr-ico { width:38px;height:38px;border-radius:10px;background:rgba(167,139,250,.14);border:1px solid rgba(167,139,250,.22);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0; }
.sm-bdg { display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:50px;border:1px solid rgba(167,139,250,.3);background:rgba(167,139,250,.12);color:var(--c1);font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px; }
.sm-h1 { font-size:17px;font-weight:600;color:var(--tx);margin:0 0 2px;letter-spacing:-.01em; }
.sm-sub { font-size:11px;color:var(--mu);margin:0;font-weight:500; }
.sm-chips { display:flex;gap:8px;flex-wrap:wrap;position:relative; }
.sm-chip { display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:11px;font-size:11px;font-weight:600;white-space:nowrap;color:#fff;position:relative;overflow:hidden;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28); }
.sm-hdr-courses .sm-chip, .sm-hdr-categories .sm-chip { box-shadow:0 2px 8px rgba(124,45,18,.10); }
.sm-chip-num { font-size:15px;font-weight:700; }

/* ── tabs (compact) ── */
.sm-tabs { display:flex;gap:3px;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:4px;width:fit-content;box-shadow:var(--sh); }
.sm-tab { display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:9px;border:none;font-family:'Poppins',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;background:transparent;color:var(--mu); }
.sm-tab:hover { color:var(--c1); }
.sm-tab.sm-tab-active { background:rgba(167,139,250,.12);color:var(--c1);border:1px solid rgba(167,139,250,.25); }

/* ── toolbar ── */
.sm-toolbar { display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap; }
.sm-search { position:relative;flex:0 1 260px;min-width:180px;max-width:260px;margin-left:auto; }
.sm-search svg { position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu); }
.sm-search input { padding:8px 12px 8px 32px;border-radius:10px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;outline:none;width:100%;box-sizing:border-box;transition:border-color .2s,box-shadow .2s; }
.sm-search input::placeholder { color:var(--mu); }
.sm-search input:focus { border-color:var(--c1);box-shadow:0 0 0 3px rgba(167,139,250,.12); }

/* ── card ── */
.sm-card { background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden; }
.sm-card-head { display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 16px;border-bottom:1px solid var(--bd);background:var(--bg);flex-wrap:wrap; }
.sm-card-title { font-size:12px;font-weight:600;color:var(--tx);margin:0 0 2px; }
.sm-card-sub { font-size:10px;color:var(--mu);margin:0; }

/* ── skeleton ── */
.sm-skel { display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--bd);animation:sm-pulse 1.4s ease-in-out infinite; }
.sm-skel-l { display:flex;align-items:center;gap:10px; }
.sm-skel-sq { width:30px;height:30px;border-radius:9px;background:var(--bd); }
.sm-skel-line { height:8px;border-radius:5px;background:var(--bd); }
.sm-skel-pill { height:18px;width:64px;border-radius:30px;background:var(--bd); }
@keyframes sm-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

/* ── empty ── */
.sm-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 16px;gap:9px;text-align:center; }
.sm-empty-ico { width:42px;height:42px;border-radius:12px;background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;color:var(--c1); }
.sm-empty-t { font-size:12px;font-weight:600;color:var(--tx);margin:0 0 3px; }
.sm-empty-s { font-size:10px;color:var(--mu);margin:0; }

/* ── table ── */
table.sm-t { width:100%;border-collapse:collapse;font-size:12px; }
.sm-t thead th { padding:8px 12px;text-align:left;font-size:9px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd); }
.sm-t thead th:first-child { padding-left:16px; }
.sm-t thead th:last-child { padding-right:16px; }
.sm-t tbody tr { border-bottom:1px solid var(--bd);transition:background .15s; }
.sm-t tbody tr:last-child { border-bottom:none; }
.sm-t tbody tr:hover { background:rgba(167,139,250,.025); }
.sm-t tbody td { padding:9px 12px;vertical-align:middle; }
.sm-t tbody td:first-child { padding-left:16px; }
.sm-t tbody td:last-child { padding-right:16px; }
.sm-idx { font-size:11px;font-weight:600;color:var(--mu); }
.sm-course-cell { display:flex;align-items:center;gap:9px; }
.sm-course-av { width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.sm-course-name { font-size:12px;font-weight:600;color:var(--tx);transition:color .15s; }
.sm-t tbody tr:hover .sm-course-name { color:var(--c1); }
.sm-cat-tag { display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:7px;font-size:10px;font-weight:600;border:1px solid; }
.sm-trainer-cell { display:flex;align-items:center;gap:4px;font-size:11px;color:var(--mu); }
.sm-status-ok { display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:7px;font-size:10px;font-weight:600;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3); }
.sm-dot { width:5px;height:5px;border-radius:50%;background:var(--c3);animation:sm-blink 1.4s ease-in-out infinite; }
@keyframes sm-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.sm-count-cell { display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--tx); }

/* ── mobile responsiveness ── */
@media (max-width: 480px) {
  .sm { padding:12px; }
  .sm-hdr { padding:14px; }
  .sm-hdr-l { width:100%; }
  .sm-chips { width:100%; }
  .sm-chip { flex:1 1 auto;justify-content:center; }
  .sm-card-head { flex-direction:column;align-items:stretch; }
  .sm-search { flex:1 1 auto;width:100%;min-width:0;max-width:100%;margin-left:0; }
  .sm-t { display:block;overflow-x:auto;white-space:nowrap; }
}

`;

if (!document.getElementById("sm-st")) {
  const t = document.createElement("style");
  t.id = "sm-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

/* ── helpers ── */
const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const CAT_COLORS = [
  {
    bg: "rgba(167,139,250,.10)",
    color: "var(--c1)",
    bd: "rgba(167,139,250,.20)",
  },
  {
    bg: "rgba(34,211,238,.10)",
    color: "var(--c4)",
    bd: "rgba(34,211,238,.20)",
  },
  {
    bg: "rgba(251,146,60,.10)",
    color: "var(--c2)",
    bd: "rgba(251,146,60,.20)",
  },
  {
    bg: "rgba(52,211,153,.10)",
    color: "var(--c3)",
    bd: "rgba(52,211,153,.20)",
  },
  {
    bg: "rgba(248,113,113,.10)",
    color: "var(--cr)",
    bd: "rgba(248,113,113,.20)",
  },
];
const catColor = (val) =>
  CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

const GRAD_BG = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#0891b2,#0e7490)",
  "linear-gradient(135deg,#be123c,#9f1239)",
  "linear-gradient(135deg,#b45309,#92400e)",
  "linear-gradient(135deg,#047857,#065f46)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
];
const gradBg = (val) =>
  GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

/* ── per-tab header content (title/subtitle/badge/color switch per tab) ── */
const TAB_CONTENT = {
  courses: {
    badge: "Super Admin · Independent Trainers",
    title: "Course Management",
    subtitle: "Courses created by trainers not linked to any organization",
    cls: "sm-hdr-courses",
    icon: BookOpen,
  },
  categories: {
    badge: "Super Admin · Independent Trainers",
    title: "Category Management",
    subtitle: "Categories derived from independent trainer courses",
    cls: "sm-hdr-categories",
    icon: Layers,
  },
};

/* ════════════════════════════════════════════════════════════════════
   COURSES TAB
════════════════════════════════════════════════════════════════════ */
const CoursesTab = ({ courses, loading }) => {
  const [search, setSearch] = useState("");

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.trainerEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.category || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="sm-card">
        <div className="sm-card-head">
          <div>
            <p className="sm-card-title">Independent Trainer Courses</p>
            <p className="sm-card-sub">
              {filtered.length} course{filtered.length !== 1 && "s"} found
            </p>
          </div>
          <div className="sm-search">
            <Search size={13} />
            <input
              placeholder="Search by course, trainer, or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading &&
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="sm-skel">
              <div className="sm-skel-l">
                <div className="sm-skel-sq" />
                <div>
                  <div
                    className="sm-skel-line"
                    style={{ width: 140, marginBottom: 7 }}
                  />
                  <div className="sm-skel-line" style={{ width: 95 }} />
                </div>
              </div>
              <div className="sm-skel-pill" />
            </div>
          ))}

        {!loading && filtered.length === 0 && (
          <div className="sm-empty">
            <div className="sm-empty-ico">
              <BookOpen size={20} />
            </div>
            <p className="sm-empty-t">No courses found</p>
            <p className="sm-empty-s">
              Courses created by independent trainers (no organization) will
              appear here
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <table className="sm-t">
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Category</th>
                <th>Trainer</th>
                <th>Batch ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const cc = catColor(c.category);
                return (
                  <tr key={c.id}>
                    <td>
                      <span className="sm-idx">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td>
                      <div className="sm-course-cell">
                        <div
                          className="sm-course-av"
                          style={{ background: gradBg(c.name) }}
                        >
                          <BookOpen size={14} color="white" />
                        </div>
                        <span className="sm-course-name">{c.name}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="sm-cat-tag"
                        style={{
                          background: cc.bg,
                          color: cc.color,
                          borderColor: cc.bd,
                        }}
                      >
                        <Tag size={10} /> {c.category || "—"}
                      </span>
                    </td>
                    <td>
                      <div className="sm-trainer-cell">
                        <Mail size={11} /> {c.trainerEmail}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--mu)",
                        }}
                      >
                        #{c.batchId}
                      </span>
                    </td>
                    <td>
                      <span className="sm-status-ok">
                        <span className="sm-dot" /> PUBLISHED
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════════
   CATEGORIES TAB
════════════════════════════════════════════════════════════════════ */
const CategoriesTab = ({ courses, loading }) => {
  const [search, setSearch] = useState("");

  // Derive category counts from the same courses list — no extra API call needed
  const categoryMap = {};
  courses.forEach((c) => {
    const cat = c.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const allCategories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  const filtered = allCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="sm-card">
        <div className="sm-card-head">
          <div>
            <p className="sm-card-title">Course Categories</p>
            <p className="sm-card-sub">
              {filtered.length} categor{filtered.length !== 1 ? "ies" : "y"}{" "}
              found
            </p>
          </div>
          <div className="sm-search">
            <Search size={13} />
            <input
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="sm-skel">
              <div className="sm-skel-l">
                <div className="sm-skel-sq" />
                <div>
                  <div
                    className="sm-skel-line"
                    style={{ width: 125, marginBottom: 7 }}
                  />
                  <div className="sm-skel-line" style={{ width: 70 }} />
                </div>
              </div>
              <div className="sm-skel-pill" />
            </div>
          ))}

        {!loading && filtered.length === 0 && (
          <div className="sm-empty">
            <div className="sm-empty-ico">
              <Layers size={20} />
            </div>
            <p className="sm-empty-t">No categories found</p>
            <p className="sm-empty-s">
              Categories are derived from independent trainer courses
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <table className="sm-t">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Total Courses</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const cc = catColor(c.name);
                return (
                  <tr key={c.name}>
                    <td>
                      <span className="sm-idx">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td>
                      <div className="sm-course-cell">
                        <div
                          className="sm-course-av"
                          style={{ background: gradBg(c.name) }}
                        >
                          <Tag size={14} color="white" />
                        </div>
                        <span
                          className="sm-cat-tag"
                          style={{
                            background: cc.bg,
                            color: cc.color,
                            borderColor: cc.bd,
                          }}
                        >
                          <Tag size={10} /> {c.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="sm-count-cell">
                        <BookOpen size={12} style={{ color: "var(--mu)" }} />
                        {c.count} {c.count === 1 ? "course" : "courses"}
                      </span>
                    </td>
                    <td>
                      <span className="sm-status-ok">
                        <span className="sm-dot" /> Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════ */
const SuperAdminCourseManagement = () => {
  const [dark, setDark] = useState(isDark);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" | "categories"
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    setLoading(true);
    courseService
      .getIndependentTrainerCourses() // ← new service method
      .then((res) => {
        const mapped = (res.data || []).map((c) => ({
          id: c.id,
          name: c.title,
          category: c.category,
          trainerEmail: c.ownerEmail,
          batchId: c.batchId,
        }));
        setCourses(mapped);
      })
      .catch((err) => console.error("Failed to load independent courses", err))
      .finally(() => setLoading(false));
  }, []);

  // Derive category count for chips
  const categoryCount = new Set(
    courses.map((c) => c.category || "Uncategorized"),
  ).size;

  const tab = TAB_CONTENT[activeTab];
  const TabIcon = tab.icon;

  return (
    <div className={`sm${dark ? " sm-dk" : ""}`}>
      <div className="sm-inner">
        {/* ── Header (dynamic per active tab) ── */}
        <div className={`sm-hdr ${tab.cls}`}>
          <div className="sm-hdr-l">
            <div className="sm-hdr-ico">
              <TabIcon size={18} />
            </div>
            <div>
              <div className="sm-bdg">
                <Globe size={9} /> {tab.badge}
              </div>
              <h1 className="sm-h1">{tab.title}</h1>
              <p className="sm-sub">{tab.subtitle}</p>
            </div>
          </div>
          <div className="sm-chips">
            <div
              className="sm-chip"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
              }}
            >
              <BookOpen size={13} />
              <span className="sm-chip-num">{courses.length}</span>
              <span style={{ opacity: 0.85, fontWeight: 500 }}>Courses</span>
            </div>
            <div
              className="sm-chip"
              style={{
                background: "linear-gradient(135deg,#22d3ee,#0891b2)",
              }}
            >
              <Layers size={13} />
              <span className="sm-chip-num">{categoryCount}</span>
              <span style={{ opacity: 0.85, fontWeight: 500 }}>
                Categories
              </span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="sm-tabs">
          <button
            className={`sm-tab${activeTab === "courses" ? " sm-tab-active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen size={13} /> Courses
          </button>
          <button
            className={`sm-tab${activeTab === "categories" ? " sm-tab-active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <Layers size={13} /> Categories
          </button>
        </div>

        {/* ── Tab content ── */}
        {activeTab === "courses" ? (
          <CoursesTab courses={courses} loading={loading} />
        ) : (
          <CategoriesTab courses={courses} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default SuperAdminCourseManagement;