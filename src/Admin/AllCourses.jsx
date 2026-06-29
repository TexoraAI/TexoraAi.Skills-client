// import { courseService } from "@/services/courseService";
// import {
//   ArrowLeft,
//   BookOpen,
//   Folder,
//   Mail,
//   Search,
//   Tag,
//   Users,
//   X
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .ac-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

// .ac{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
// .ac-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

// /* header */
// .ac-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
// .ac-hdr-l{display:flex;align-items:center;gap:14px;}
// .ac-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
// .ac-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
// .ac-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .ac-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
// .ac-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .ac-sub{font-size:13px;color:var(--mu);margin:0;}
// .ac-chips{display:flex;gap:10px;flex-wrap:wrap;}
// .ac-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

// /* action bar */
// .ac-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
// .ac-search{position:relative;}
// .ac-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
// .ac-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
// .ac-search input::placeholder{color:var(--mu);}
// .ac-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .ac-abar-r{display:flex;gap:8px;}
// .ac-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:13px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
// .ac-btn:hover{opacity:.87;transform:translateY(-1px);}
// .ac-btn-outline{background:var(--card);border:1px solid var(--bd)!important;color:var(--mu);}
// .ac-btn-outline:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
// .ac-btn-cyan{background:var(--c1);color:#0a0a0a;}

// /* table card */
// .ac-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
// .ac-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .ac-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
// .ac-thead-sub{font-size:11px;color:var(--mu);margin:0;}

// /* skeleton */
// .ac-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);}
// .ac-skel-l{display:flex;align-items:center;gap:12px;}
// .ac-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
// .ac-skel-line{height:10px;border-radius:6px;background:var(--bd);}
// .ac-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}
// @keyframes ac-pulse{0%,100%{opacity:1}50%{opacity:.45}}
// .ac-skel-row{animation:ac-pulse 1.4s ease-in-out infinite;}

// /* empty */
// .ac-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
// .ac-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
// .ac-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
// .ac-empty-s{font-size:12px;color:var(--mu);margin:0;}

// /* table */
// table.ac-t{width:100%;border-collapse:collapse;font-size:13px;}
// .ac-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
// .ac-t thead th:first-child{padding-left:22px;}
// .ac-t thead th:last-child{text-align:right;padding-right:22px;}
// .ac-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
// .ac-t tbody tr:last-child{border-bottom:none;}
// .ac-t tbody tr:hover{background:rgba(34,211,238,.025);}
// .ac-t tbody td{padding:12px 14px;vertical-align:middle;}
// .ac-t tbody td:first-child{padding-left:22px;}
// .ac-t tbody td:last-child{padding-right:22px;text-align:right;}
// .ac-idx{font-size:12px;font-weight:700;color:var(--mu);}
// .ac-course-cell{display:flex;align-items:center;gap:12px;}
// .ac-course-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .ac-course-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;}
// .ac-t tbody tr:hover .ac-course-name{color:var(--c1);}
// .ac-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
// .ac-trainer-cell{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
// .ac-status-ok{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
// .ac-status-dot{width:6px;height:6px;border-radius:50%;background:var(--c3);animation:ac-blink 1.4s ease-in-out infinite;}
// @keyframes ac-blink{0%,100%{opacity:1}50%{opacity:.3}}
// .ac-enroll-cell{display:flex;align-items:center;justify-content:flex-end;gap:5px;font-size:13px;font-weight:700;color:var(--tx);}

// /* modal overlay */
// .ac-modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
// .ac-modal{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:400px;overflow:hidden;box-shadow:var(--shl);}
// .ac-modal-head{padding:18px 20px;background:rgba(34,211,238,.06);border-bottom:1px solid var(--bd);}
// .ac-modal-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:0;}
// .ac-modal-head-l{display:flex;align-items:center;gap:10px;}
// .ac-modal-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.20);display:flex;align-items:center;justify-content:center;color:var(--c1);}
// .ac-modal-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .ac-modal-sub{font-size:11px;color:var(--mu);margin:0;}
// .ac-modal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
// .ac-modal-close:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
// .ac-modal-body{padding:20px;display:flex;flex-direction:column;gap:14px;}
// .ac-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:6px;}
// .ac-input{width:100%;padding:10px 13px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
// .ac-input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .ac-input::placeholder{color:var(--mu);}
// .ac-modal-footer{display:flex;justify-content:flex-end;gap:8px;}
// .ac-cancel{padding:10px 18px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
// .ac-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
// .ac-submit{padding:10px 22px;border-radius:12px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
// .ac-submit:hover{opacity:.87;transform:translateY(-1px);}
// `;

// if (!document.getElementById("ac-st")) {
//   const t = document.createElement("style");
//   t.id = "ac-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ── category tag colours ── */
// const CAT_COLORS = [
//   {
//     bg: "rgba(34,211,238,.10)",
//     color: "var(--c1)",
//     bd: "rgba(34,211,238,.20)",
//   },
//   {
//     bg: "rgba(167,139,250,.10)",
//     color: "var(--c4)",
//     bd: "rgba(167,139,250,.20)",
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

// /* ── avatar gradients ── */
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
//    MAIN
// ════════════════════════════════════════════════════════════════════ */
// const AllCourses = () => {
//   const navigate = useNavigate();
//   const [dark, setDark] = useState(isDark);

//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
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

//   /* ── LOAD (unchanged) ── */
//   useEffect(() => {
//     loadCourses();
//   }, []);

//   const loadCourses = () => {
//     courseService
//       .getOrgAdminCourses()
//       .then((res) => {
//         const mapped = res.data.map((c) => ({
//           id: c.id,
//           name: c.title,
//           category: c.category,
//           trainerName: c.ownerEmail,
//           status: "PUBLISHED",
//           enrollments: 0,
//         }));
//         setCourses(mapped);
//       })
//       .catch((err) => console.error("Failed to load courses", err))
//       .finally(() => setLoading(false));
//   };

//   const filteredCourses = courses.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

//   return (
//     <div className={`ac${dark ? " ac-dk" : ""}`}>
//       <div className="ac-inner">
//         {/* ── Header ── */}
//         <div className="ac-hdr">
//           <div className="ac-hdr-l">
//             <button className="ac-back" onClick={() => navigate(-1)}>
//               <ArrowLeft size={14} /> Back
//             </button>
//             <div className="ac-hdr-ico">
//               <BookOpen size={24} />
//             </div>
//             <div>
//               <div className="ac-bdg">
//                 <BookOpen size={10} /> Course Management
//               </div>
//               <h1 className="ac-h1">All Courses</h1>
//               <p className="ac-sub">
//                 Approve, publish and manage all courses on the platform
//               </p>
//             </div>
//           </div>
//           <div className="ac-chips">
//             <div className="ac-chip">
//               <BookOpen size={14} style={{ color: "var(--c1)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c1)" }}>
//                 {courses.length}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Courses
//               </span>
//             </div>
//             <div className="ac-chip">
//               <Users size={14} style={{ color: "var(--c3)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c3)" }}>
//                 {publishedCount}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Published
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ── Action bar ── */}
//         <div className="ac-abar">
//           <div className="ac-search">
//             <Search size={14} />
//             <input
//               placeholder="Search courses…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div className="ac-abar-r">
//             {/* <button
//               className="ac-btn ac-btn-outline"
//               onClick={() => navigate("/admin/categories")}
//             >
//               <Folder size={14} style={{ color: "var(--c1)" }} /> Categories
//             </button> */}
//             <button
//               className="ac-btn ac-btn-outline"
//               // onClick={() => navigate("/org-admin/categories")}
//               onClick={() => navigate("/admin/categories")}
//             >
//               <Folder size={14} style={{ color: "var(--c1)" }} /> Categories
//             </button>
//           </div>
//         </div>

//         {/* ── Table card ── */}
//         <div className="ac-tcard">
//           <div className="ac-thead-row">
//             <div>
//               <p className="ac-thead-title">Course List</p>
//               <p className="ac-thead-sub">
//                 {filteredCourses.length} course
//                 {filteredCourses.length !== 1 && "s"} found
//               </p>
//             </div>
//           </div>

//           {/* skeleton */}
//           {loading &&
//             [1, 2, 3].map((i) => (
//               <div key={i} className="ac-skel-row">
//                 <div className="ac-skel-l">
//                   <div className="ac-skel-sq" />
//                   <div>
//                     <div
//                       className="ac-skel-line"
//                       style={{ width: 160, marginBottom: 8 }}
//                     />
//                     <div className="ac-skel-line" style={{ width: 100 }} />
//                   </div>
//                 </div>
//                 <div className="ac-skel-pill" />
//               </div>
//             ))}

//           {/* empty */}
//           {!loading && filteredCourses.length === 0 && (
//             <div className="ac-empty">
//               <div className="ac-empty-ico">
//                 <BookOpen size={26} />
//               </div>
//               <p className="ac-empty-t">No courses available</p>
//               <p className="ac-empty-s">
//                 Courses created by trainers will appear here
//               </p>
//             </div>
//           )}

//           {/* table */}
//           {!loading && filteredCourses.length > 0 && (
//             <table className="ac-t">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Course</th>
//                   <th>Category</th>
//                   <th>Trainer</th>
//                   <th>Status</th>
//                   <th>Enrollments</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCourses.map((c, index) => {
//                   const cc = catColor(c.category);
//                   return (
//                     <tr key={c.id}>
//                       <td>
//                         <span className="ac-idx">
//                           {String(index + 1).padStart(2, "0")}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="ac-course-cell">
//                           <div
//                             className="ac-course-av"
//                             style={{ background: gradBg(c.name) }}
//                           >
//                             <BookOpen size={16} color="white" />
//                           </div>
//                           <span className="ac-course-name">{c.name}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <span
//                           className="ac-cat-tag"
//                           style={{
//                             background: cc.bg,
//                             color: cc.color,
//                             borderColor: cc.bd,
//                           }}
//                         >
//                           <Tag size={11} /> {c.category || "—"}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="ac-trainer-cell">
//                           <Mail size={12} /> {c.trainerName}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="ac-status-ok">
//                           <span className="ac-status-dot" /> {c.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="ac-enroll-cell">
//                           <Users size={13} style={{ color: "var(--mu)" }} />{" "}
//                           {c.enrollments}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ── Modal (unchanged logic) ── */}
//       {open && (
//         <div
//           className={`ac-modal-overlay${dark ? " ac-dk" : ""}`}
//           onClick={() => setOpen(false)}
//         >
//           <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="ac-modal-head">
//               <div className="ac-modal-head-row">
//                 <div className="ac-modal-head-l">
//                   <div className="ac-modal-ico">
//                     <BookOpen size={17} />
//                   </div>
//                   <div>
//                     <p className="ac-modal-title">Create Course</p>
//                     <p className="ac-modal-sub">Fill in the details below</p>
//                   </div>
//                 </div>
//                 <button
//                   className="ac-modal-close"
//                   onClick={() => setOpen(false)}
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             </div>
//             <div className="ac-modal-body">
//               <div className="ac-field">
//                 <label>Course Name</label>
//                 <input
//                   className="ac-input"
//                   placeholder="e.g. React for Beginners"
//                 />
//               </div>
//               <div className="ac-field">
//                 <label>Category</label>
//                 <input
//                   className="ac-input"
//                   placeholder="e.g. Web Development"
//                 />
//               </div>
//               <div className="ac-field">
//                 <label>Trainer Name</label>
//                 <input className="ac-input" placeholder="trainer@example.com" />
//               </div>
//               <div className="ac-modal-footer">
//                 <button className="ac-cancel" onClick={() => setOpen(false)}>
//                   Cancel
//                 </button>
//                 <button className="ac-submit">Create</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllCourses;  old raghib






























// // export default AllCourses;
// import { courseService } from "@/services/courseService";
// import {
//   ArrowLeft,
//   BookOpen,
//   Folder,
//   Mail,
//   Plus,
//   Search,
//   Tag,
//   Users,
//   X,
//   UserCheck,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .ac-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

// .ac{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
// .ac-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

// /* header */
// .ac-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
// .ac-hdr-l{display:flex;align-items:center;gap:14px;}
// .ac-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
// .ac-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
// .ac-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .ac-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
// .ac-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .ac-sub{font-size:13px;color:var(--mu);margin:0;}
// .ac-chips{display:flex;gap:10px;flex-wrap:wrap;}
// .ac-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

// /* action bar */
// .ac-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
// .ac-search{position:relative;}
// .ac-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
// .ac-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
// .ac-search input::placeholder{color:var(--mu);}
// .ac-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .ac-abar-r{display:flex;gap:8px;}
// .ac-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:13px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
// .ac-btn:hover{opacity:.87;transform:translateY(-1px);}
// .ac-btn-outline{background:var(--card);border:1px solid var(--bd)!important;color:var(--mu);}
// .ac-btn-outline:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
// .ac-btn-cyan{background:var(--c1);color:#0a0a0a;}

// /* table card */
// .ac-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
// .ac-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .ac-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
// .ac-thead-sub{font-size:11px;color:var(--mu);margin:0;}

// /* skeleton */
// .ac-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);}
// .ac-skel-l{display:flex;align-items:center;gap:12px;}
// .ac-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
// .ac-skel-line{height:10px;border-radius:6px;background:var(--bd);}
// .ac-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}
// @keyframes ac-pulse{0%,100%{opacity:1}50%{opacity:.45}}
// .ac-skel-row{animation:ac-pulse 1.4s ease-in-out infinite;}

// /* empty */
// .ac-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
// .ac-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
// .ac-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
// .ac-empty-s{font-size:12px;color:var(--mu);margin:0;}

// /* table */
// table.ac-t{width:100%;border-collapse:collapse;font-size:13px;}
// .ac-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
// .ac-t thead th:first-child{padding-left:22px;}
// .ac-t thead th:last-child{text-align:right;padding-right:22px;}
// .ac-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
// .ac-t tbody tr:last-child{border-bottom:none;}
// .ac-t tbody tr:hover{background:rgba(34,211,238,.025);}
// .ac-t tbody td{padding:12px 14px;vertical-align:middle;}
// .ac-t tbody td:first-child{padding-left:22px;}
// .ac-t tbody td:last-child{padding-right:22px;text-align:right;}
// .ac-idx{font-size:12px;font-weight:700;color:var(--mu);}
// .ac-course-cell{display:flex;align-items:center;gap:12px;}
// .ac-course-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .ac-course-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;}
// .ac-t tbody tr:hover .ac-course-name{color:var(--c1);}
// .ac-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
// .ac-trainer-cell{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
// .ac-assigned-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.20);color:var(--c4);margin-left:6px;}
// .ac-status-ok{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
// .ac-status-dot{width:6px;height:6px;border-radius:50%;background:var(--c3);animation:ac-blink 1.4s ease-in-out infinite;}
// @keyframes ac-blink{0%,100%{opacity:1}50%{opacity:.3}}
// .ac-enroll-cell{display:flex;align-items:center;justify-content:flex-end;gap:5px;font-size:13px;font-weight:700;color:var(--tx);}

// /* toast */
// .ac-toast{position:fixed;bottom:24px;right:24px;z-index:100;padding:12px 20px;border-radius:13px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);color:var(--c3);font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;box-shadow:var(--shl);display:flex;align-items:center;gap:8px;animation:ac-slidein .25s ease;}
// @keyframes ac-slidein{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
// .ac-toast-err{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.25);color:var(--cr);}

// /* modal overlay */
// .ac-modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
// .ac-modal{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:420px;overflow:hidden;box-shadow:var(--shl);}
// .ac-modal-head{padding:18px 20px;background:rgba(34,211,238,.06);border-bottom:1px solid var(--bd);}
// .ac-modal-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:0;}
// .ac-modal-head-l{display:flex;align-items:center;gap:10px;}
// .ac-modal-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.20);display:flex;align-items:center;justify-content:center;color:var(--c1);}
// .ac-modal-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .ac-modal-sub{font-size:11px;color:var(--mu);margin:0;}
// .ac-modal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
// .ac-modal-close:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
// .ac-modal-body{padding:20px;display:flex;flex-direction:column;gap:14px;}
// .ac-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:6px;}
// .ac-field label span{color:var(--cr);}
// .ac-input{width:100%;padding:10px 13px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
// .ac-input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .ac-input::placeholder{color:var(--mu);}
// select.ac-input{cursor:pointer;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;padding-right:34px;}
// .ac-modal-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:4px;}
// .ac-cancel{padding:10px 18px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
// .ac-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
// .ac-submit{padding:10px 22px;border-radius:12px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;display:inline-flex;align-items:center;gap:6px;}
// .ac-submit:hover{opacity:.87;transform:translateY(-1px);}
// .ac-submit:disabled{opacity:.5;cursor:not-allowed;transform:none;}
// `;

// if (!document.getElementById("ac-st")) {
//   const t = document.createElement("style");
//   t.id = "ac-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ── category tag colours ── */
// const CAT_COLORS = [
//   {
//     bg: "rgba(34,211,238,.10)",
//     color: "var(--c1)",
//     bd: "rgba(34,211,238,.20)",
//   },
//   {
//     bg: "rgba(167,139,250,.10)",
//     color: "var(--c4)",
//     bd: "rgba(167,139,250,.20)",
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

// /* ── avatar gradients ── */
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

// /* ── default form ── */
// const EMPTY_FORM = {
//   title: "",
//   category: "",
//   description: "",
//   assignedTrainerEmail: "",
// };

// /* ════════════════════════════════════════════════════════════════════
//    MAIN
// ════════════════════════════════════════════════════════════════════ */
// const AllCourses = () => {
//   const navigate = useNavigate();
//   const [dark, setDark] = useState(isDark);
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [trainers, setTrainers] = useState([]);
//   const [trainersLoading, setTrainersLoading] = useState(false);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast] = useState(null); // { msg, err }

//   /* ── dark mode observer ── */
//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   /* ── load trainers for dropdown ── */
//   useEffect(() => {
//     setTrainersLoading(true);
//     courseService
//       .getOrgTrainers()
//       .then((res) => setTrainers(res.data || []))
//       .catch((err) => console.error("Failed to load trainers", err))
//       .finally(() => setTrainersLoading(false));
//   }, []);

//   /* ── load courses ── */
//   useEffect(() => {
//     loadCourses();
//   }, []);

//   const loadCourses = () => {
//     setLoading(true);
//     courseService
//       .getOrgAdminCourses()
//       .then((res) => {
//         const mapped = res.data.map((c) => ({
//           id: c.id,
//           name: c.title,
//           category: c.category,
//           trainerName: c.ownerEmail,
//           assignedTrainer: c.assignedTrainerEmail || null,
//           status: "PUBLISHED",
//           enrollments: 0,
//         }));
//         setCourses(mapped);
//       })
//       .catch((err) => console.error("Failed to load courses", err))
//       .finally(() => setLoading(false));
//   };

//   /* ── toast helper ── */
//   const showToast = (msg, err = false) => {
//     setToast({ msg, err });
//     setTimeout(() => setToast(null), 3000);
//   };

//   /* ── open modal ── */
//   const openModal = () => {
//     setForm(EMPTY_FORM);
//     setOpen(true);
//   };

//   /* ── close modal ── */
//   const closeModal = () => {
//     setOpen(false);
//     setForm(EMPTY_FORM);
//   };

//   /* ── submit create course ── */
//   const handleCreate = async () => {
//     if (!form.title.trim()) {
//       showToast("Course name is required", true);
//       return;
//     }
//     if (!form.category.trim()) {
//       showToast("Category is required", true);
//       return;
//     }
//     if (!form.assignedTrainerEmail) {
//       showToast("Please assign a trainer", true);
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await courseService.adminCreateCourse({
//         title: form.title.trim(),
//         category: form.category.trim(),
//         description: form.description.trim(),
//         assignedTrainerEmail: form.assignedTrainerEmail,
//       });
//       closeModal();
//       loadCourses();
//       showToast("Course created and assigned successfully!");
//     } catch (err) {
//       console.error("Create course failed", err);
//       showToast(
//         err?.response?.data?.message || "Failed to create course",
//         true,
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const filteredCourses = courses.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

//   /* ── field change helper ── */
//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

//   return (
//     <div className={`ac${dark ? " ac-dk" : ""}`}>
//       <div className="ac-inner">
//         {/* ── Header ── */}
//         <div className="ac-hdr">
//           <div className="ac-hdr-l">
//             <button className="ac-back" onClick={() => navigate(-1)}>
//               <ArrowLeft size={14} /> Back
//             </button>
//             <div className="ac-hdr-ico">
//               <BookOpen size={24} />
//             </div>
//             <div>
//               <div className="ac-bdg">
//                 <BookOpen size={10} /> Course Management
//               </div>
//               <h1 className="ac-h1">All Courses</h1>
//               <p className="ac-sub">
//                 Create, assign and manage all courses in your organisation
//               </p>
//             </div>
//           </div>
//           <div className="ac-chips">
//             <div className="ac-chip">
//               <BookOpen size={14} style={{ color: "var(--c1)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c1)" }}>
//                 {courses.length}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Courses
//               </span>
//             </div>
//             <div className="ac-chip">
//               <Users size={14} style={{ color: "var(--c3)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c3)" }}>
//                 {publishedCount}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Published
//               </span>
//             </div>
//             <div className="ac-chip">
//               <UserCheck size={14} style={{ color: "var(--c4)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c4)" }}>
//                 {trainers.length}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Trainers
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ── Action bar ── */}
//         <div className="ac-abar">
//           <div className="ac-search">
//             <Search size={14} />
//             <input
//               placeholder="Search courses…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div className="ac-abar-r">
//             {/* Create Course button */}
//             <button className="ac-btn ac-btn-cyan" onClick={openModal}>
//               <Plus size={14} /> Create Course
//             </button>

//             {/* Categories */}
//             <button
//               className="ac-btn ac-btn-outline"
//               onClick={() => navigate("/admin/categories")}
//             >
//               <Folder size={14} style={{ color: "var(--c1)" }} /> Categories
//             </button>
//           </div>
//         </div>

//         {/* ── Table card ── */}
//         <div className="ac-tcard">
//           <div className="ac-thead-row">
//             <div>
//               <p className="ac-thead-title">Course List</p>
//               <p className="ac-thead-sub">
//                 {filteredCourses.length} course
//                 {filteredCourses.length !== 1 && "s"} found
//               </p>
//             </div>
//           </div>

//           {/* skeleton */}
//           {loading &&
//             [1, 2, 3].map((i) => (
//               <div key={i} className="ac-skel-row">
//                 <div className="ac-skel-l">
//                   <div className="ac-skel-sq" />
//                   <div>
//                     <div
//                       className="ac-skel-line"
//                       style={{ width: 160, marginBottom: 8 }}
//                     />
//                     <div className="ac-skel-line" style={{ width: 100 }} />
//                   </div>
//                 </div>
//                 <div className="ac-skel-pill" />
//               </div>
//             ))}

//           {/* empty */}
//           {!loading && filteredCourses.length === 0 && (
//             <div className="ac-empty">
//               <div className="ac-empty-ico">
//                 <BookOpen size={26} />
//               </div>
//               <p className="ac-empty-t">No courses yet</p>
//               <p className="ac-empty-s">
//                 Click "Create Course" to add your first course and assign it to
//                 a trainer
//               </p>
//             </div>
//           )}

//           {/* table */}
//           {!loading && filteredCourses.length > 0 && (
//             <table className="ac-t">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Course</th>
//                   <th>Category</th>
//                   <th>Trainer</th>
//                   <th>Status</th>
//                   <th>Enrollments</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCourses.map((c, index) => {
//                   const cc = catColor(c.category);
//                   return (
//                     <tr key={c.id}>
//                       <td>
//                         <span className="ac-idx">
//                           {String(index + 1).padStart(2, "0")}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="ac-course-cell">
//                           <div
//                             className="ac-course-av"
//                             style={{ background: gradBg(c.name) }}
//                           >
//                             <BookOpen size={16} color="white" />
//                           </div>
//                           <span className="ac-course-name">{c.name}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <span
//                           className="ac-cat-tag"
//                           style={{
//                             background: cc.bg,
//                             color: cc.color,
//                             borderColor: cc.bd,
//                           }}
//                         >
//                           <Tag size={11} /> {c.category || "—"}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="ac-trainer-cell">
//                           <Mail size={12} />
//                           {/* Show assigned trainer if set, otherwise owner */}
//                           {c.assignedTrainer ? (
//                             <>
//                               {c.assignedTrainer}
//                               <span className="ac-assigned-badge">
//                                 <UserCheck size={9} /> Assigned
//                               </span>
//                             </>
//                           ) : (
//                             c.trainerName
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="ac-status-ok">
//                           <span className="ac-status-dot" /> {c.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="ac-enroll-cell">
//                           <Users size={13} style={{ color: "var(--mu)" }} />{" "}
//                           {c.enrollments}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ── Create Course Modal ── */}
//       {open && (
//         <div
//           className={`ac-modal-overlay${dark ? " ac-dk" : ""}`}
//           onClick={closeModal}
//         >
//           <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
//             {/* head */}
//             <div className="ac-modal-head">
//               <div className="ac-modal-head-row">
//                 <div className="ac-modal-head-l">
//                   <div className="ac-modal-ico">
//                     <BookOpen size={17} />
//                   </div>
//                   <div>
//                     <p className="ac-modal-title">Create Course</p>
//                     <p className="ac-modal-sub">
//                       Fill in the details and assign to a trainer
//                     </p>
//                   </div>
//                 </div>
//                 <button className="ac-modal-close" onClick={closeModal}>
//                   <X size={14} />
//                 </button>
//               </div>
//             </div>

//             {/* body */}
//             <div className="ac-modal-body">
//               {/* Course Name */}
//               <div className="ac-field">
//                 <label>
//                   Course Name <span>*</span>
//                 </label>
//                 <input
//                   className="ac-input"
//                   placeholder="e.g. React for Beginners"
//                   value={form.title}
//                   onChange={set("title")}
//                 />
//               </div>

//               {/* Category */}
//               <div className="ac-field">
//                 <label>
//                   Category <span>*</span>
//                 </label>
//                 <input
//                   className="ac-input"
//                   placeholder="e.g. Web Development"
//                   value={form.category}
//                   onChange={set("category")}
//                 />
//               </div>

//               {/* Description */}
//               <div className="ac-field">
//                 <label>Description</label>
//                 <textarea
//                   className="ac-input"
//                   rows={3}
//                   style={{ resize: "none" }}
//                   placeholder="Brief course description…"
//                   value={form.description}
//                   onChange={set("description")}
//                 />
//               </div>

//               {/* Assign Trainer dropdown */}
//               <div className="ac-field">
//                 <label>
//                   Assign Trainer <span>*</span>
//                 </label>
//                 <select
//                   className="ac-input"
//                   value={form.assignedTrainerEmail}
//                   onChange={set("assignedTrainerEmail")}
//                   disabled={trainersLoading}
//                 >
//                   <option value="">
//                     {trainersLoading
//                       ? "Loading trainers…"
//                       : trainers.length === 0
//                         ? "No trainers available"
//                         : "Select a trainer…"}
//                   </option>
//                   {trainers.map((t) => (
//                     <option key={t.email} value={t.email}>
//                       {/* {t.name ? `${t.name} — ${t.email}` : t.email} */}
//                       {t.displayName
//                         ? `${t.displayName} — ${t.email}`
//                         : t.email}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* footer */}
//               <div className="ac-modal-footer">
//                 <button className="ac-cancel" onClick={closeModal}>
//                   Cancel
//                 </button>
//                 <button
//                   className="ac-submit"
//                   onClick={handleCreate}
//                   disabled={submitting}
//                 >
//                   {submitting ? (
//                     "Creating…"
//                   ) : (
//                     <>
//                       <Plus size={13} /> Create &amp; Assign
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Toast ── */}
//       {toast && (
//         <div className={`ac-toast${toast.err ? " ac-toast-err" : ""}`}>
//           {toast.msg}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllCourses; shareef
































// export default AllCourses;
import { courseService } from "@/services/courseService";
import {
  ArrowLeft,
  BookOpen,
  Folder,
  Mail,
  Plus,
  Search,
  Tag,
  Users,
  X,
  UserCheck,
  GripVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.ac-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.ac{font-family:'Plus Jakarta Sans','Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);box-sizing:border-box;}

/* ══════════ SPLIT VIEW ROOT ══════════ */
/* The whole page becomes a horizontal flex row when the panel opens.
   No position:fixed, no overlay, no backdrop — true layout resize. */
.ac-split{display:flex;align-items:stretch;width:100%;min-height:100vh;}
.ac-split-left{flex:1 1 auto;min-width:0;padding:24px;box-sizing:border-box;transition:flex-basis .28s cubic-bezier(.16,1,.3,1);overflow-y:auto;}
.ac-split-left-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

/* draggable divider between the two panels */
.ac-divider{width:6px;flex:0 0 6px;cursor:col-resize;background:transparent;position:relative;align-self:stretch;display:flex;align-items:center;justify-content:center;touch-action:none;z-index:2;}
.ac-divider::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--bd);transition:background .15s,width .15s;}
.ac-divider:hover::before,.ac-divider.ac-dragging::before{background:var(--c1);width:2px;}
.ac-divider-grip{width:16px;height:36px;border-radius:8px;background:var(--card);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;color:var(--mu);opacity:0;transition:opacity .15s,color .15s,border-color .15s;box-shadow:var(--sh);}
.ac-divider:hover .ac-divider-grip,.ac-divider.ac-dragging .ac-divider-grip{opacity:1;color:var(--c1);border-color:rgba(34,211,238,.35);}

/* right panel — part of layout flow, slides in via width animation */
.ac-panel{flex:0 0 auto;height:100vh;position:sticky;top:0;align-self:flex-start;background:var(--card);border-left:1px solid var(--bd);box-shadow:-8px 0 28px rgba(0,0,0,.04);display:flex;flex-direction:column;overflow:hidden;
  animation:ac-panel-in .28s cubic-bezier(.16,1,.3,1);}
@keyframes ac-panel-in{from{flex-basis:0;opacity:.4;}to{opacity:1;}}
.ac-panel.ac-closing{animation:ac-panel-out .2s cubic-bezier(.4,0,1,1) forwards;}
@keyframes ac-panel-out{to{flex-basis:0!important;width:0!important;opacity:0;}}

/* header */
.ac-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ac-hdr-l{display:flex;align-items:center;gap:14px;}
.ac-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.ac-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.ac-hdr-ico{width:52px;height:52px;border-radius:14px;background:linear-gradient(145deg,rgba(34,211,238,.16),rgba(99,102,241,.10));border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.ac-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.ac-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;letter-spacing:-.01em;}
.ac-sub{font-size:13px;color:var(--mu);margin:0;}
.ac-chips{display:flex;gap:10px;flex-wrap:wrap;}
.ac-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

/* action bar */
.ac-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.ac-search{position:relative;}
.ac-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.ac-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:inherit;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.ac-search input::placeholder{color:var(--mu);}
.ac-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.ac-abar-r{display:flex;gap:8px;}
.ac-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:13px;border:none;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;}
.ac-btn:hover{opacity:.92;transform:translateY(-1px);}
.ac-btn-outline{background:var(--card);border:1px solid var(--bd)!important;color:var(--mu);}
.ac-btn-outline:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.ac-btn-cyan{background:linear-gradient(135deg,#22d3ee,#0ea5e9);color:#04222a;box-shadow:0 6px 18px rgba(34,211,238,.28);}
.ac-btn-cyan:hover{box-shadow:0 8px 22px rgba(34,211,238,.38);}
.ac-btn-cyan.ac-active{background:var(--bg);color:var(--c1);box-shadow:none;border:1.5px solid rgba(34,211,238,.35);}

/* table card */
.ac-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.ac-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.ac-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.ac-thead-sub{font-size:11px;color:var(--mu);margin:0;}

/* skeleton */
.ac-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);}
.ac-skel-l{display:flex;align-items:center;gap:12px;}
.ac-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
.ac-skel-line{height:10px;border-radius:6px;background:var(--bd);}
.ac-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}
@keyframes ac-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.ac-skel-row{animation:ac-pulse 1.4s ease-in-out infinite;}

/* empty */
.ac-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
.ac-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.ac-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.ac-empty-s{font-size:12px;color:var(--mu);margin:0;}

/* table */
table.ac-t{width:100%;border-collapse:collapse;font-size:13px;}
.ac-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.ac-t thead th:first-child{padding-left:22px;}
.ac-t thead th:last-child{text-align:right;padding-right:22px;}
.ac-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.ac-t tbody tr:last-child{border-bottom:none;}
.ac-t tbody tr:hover{background:rgba(34,211,238,.025);}
.ac-t tbody td{padding:12px 14px;vertical-align:middle;}
.ac-t tbody td:first-child{padding-left:22px;}
.ac-t tbody td:last-child{padding-right:22px;text-align:right;}
.ac-idx{font-size:12px;font-weight:700;color:var(--mu);}
.ac-course-cell{display:flex;align-items:center;gap:12px;}
.ac-course-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ac-course-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;}
.ac-t tbody tr:hover .ac-course-name{color:var(--c1);}
.ac-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.ac-trainer-cell{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
.ac-assigned-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.20);color:var(--c4);margin-left:6px;}
.ac-status-ok{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
.ac-status-dot{width:6px;height:6px;border-radius:50%;background:var(--c3);animation:ac-blink 1.4s ease-in-out infinite;}
@keyframes ac-blink{0%,100%{opacity:1}50%{opacity:.3}}
.ac-enroll-cell{display:flex;align-items:center;justify-content:flex-end;gap:5px;font-size:13px;font-weight:700;color:var(--tx);}

/* toast */
.ac-toast{position:fixed;bottom:24px;right:24px;z-index:200;padding:12px 20px;border-radius:13px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);color:var(--c3);font-family:inherit;font-size:13px;font-weight:700;box-shadow:var(--shl);display:flex;align-items:center;gap:8px;animation:ac-slidein .25s ease;backdrop-filter:blur(6px);}
@keyframes ac-slidein{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.ac-toast-err{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.25);color:var(--cr);}

/* ── Create Course panel (in-flow, NOT overlay) ── */
.ac-dr-head{flex-shrink:0;padding:22px 26px;background:linear-gradient(180deg,rgba(34,211,238,.07),rgba(34,211,238,.02));border-bottom:1px solid var(--bd);}
.ac-dr-head-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.ac-dr-head-l{display:flex;align-items:center;gap:13px;}
.ac-dr-ico{width:44px;height:44px;border-radius:13px;background:linear-gradient(145deg,#22d3ee,#0ea5e9);display:flex;align-items:center;justify-content:center;color:#04222a;flex-shrink:0;box-shadow:0 6px 16px rgba(34,211,238,.30);}
.ac-dr-title{font-size:17px;font-weight:800;color:var(--tx);margin:0 0 3px;letter-spacing:-.01em;}
.ac-dr-sub{font-size:12px;color:var(--mu);margin:0;}
.ac-dr-close{width:34px;height:34px;border-radius:10px;border:1px solid var(--bd);background:var(--card);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0;}
.ac-dr-close:hover{border-color:rgba(248,113,113,.30);color:var(--cr);background:rgba(248,113,113,.06);}

.ac-dr-body{flex:1;overflow-y:auto;padding:26px;display:flex;flex-direction:column;gap:18px;min-width:0;}
.ac-dr-body::-webkit-scrollbar{width:8px;}
.ac-dr-body::-webkit-scrollbar-thumb{background:var(--bd);border-radius:8px;}

.ac-field{display:flex;flex-direction:column;gap:7px;}
.ac-field label{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);}
.ac-field label span{color:var(--cr);}
.ac-input{width:100%;padding:13px 15px;border-radius:14px;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:13.5px;outline:none;box-sizing:border-box;transition:border-color .18s,box-shadow .18s,background .18s;}
.ac-input:focus{border-color:var(--c1);box-shadow:0 0 0 4px rgba(34,211,238,.10);background:var(--card);}
.ac-input::placeholder{color:var(--mu);}
.ac-input:disabled{opacity:.6;cursor:not-allowed;}
textarea.ac-input{font-family:inherit;}
select.ac-input{cursor:pointer;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 15px center;padding-right:38px;}
.ac-field-hint{font-size:11px;color:var(--mu);margin-top:1px;}

.ac-divider-soft{height:1px;background:var(--bd);margin:4px 0;}

.ac-dr-foot{flex-shrink:0;display:flex;justify-content:flex-end;gap:10px;padding:18px 26px;background:var(--card);border-top:1px solid var(--bd);}
.ac-cancel{padding:11px 20px;border-radius:13px;border:1.5px solid var(--bd);background:var(--bg);color:var(--mu);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;}
.ac-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.ac-submit{padding:11px 24px;border-radius:13px;border:none;background:linear-gradient(135deg,#22d3ee,#0ea5e9);color:#04222a;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 18px rgba(34,211,238,.28);}
.ac-submit:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 8px 22px rgba(34,211,238,.38);}
.ac-submit:disabled{opacity:.55;cursor:not-allowed;transform:none;box-shadow:none;}
.ac-spin{animation:ac-spin 0.8s linear infinite;}
@keyframes ac-spin{to{transform:rotate(360deg);}}

/* responsive */
@media (max-width:1024px){
  .ac-split{flex-direction:column;}
  .ac-divider{display:none;}
  .ac-panel{width:100%!important;height:auto;position:relative;border-left:none;border-top:1px solid var(--bd);}
}
@media (max-width:640px){
  .ac-dr-head,.ac-dr-body,.ac-dr-foot{padding-left:18px;padding-right:18px;}
}
`;

if (!document.getElementById("ac-st")) {
  const t = document.createElement("style");
  t.id = "ac-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ── category tag colours ── */
const CAT_COLORS = [
  {
    bg: "rgba(34,211,238,.10)",
    color: "var(--c1)",
    bd: "rgba(34,211,238,.20)",
  },
  {
    bg: "rgba(167,139,250,.10)",
    color: "var(--c4)",
    bd: "rgba(167,139,250,.20)",
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

/* ── avatar gradients ── */
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

/* ── default form ── */
const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  assignedTrainerEmail: "",
};

/* ── split layout constraints (per spec) ── */
const MIN_LEFT_WIDTH = 500; // px
const MIN_RIGHT_WIDTH = 420; // px
const DEFAULT_RIGHT_PCT = 0.4; // 40% of screen

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
const AllCourses = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDark);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { msg, err }

  /* ── split-view resizable width state (right panel width in px) ── */
  const getDefaultRightWidth = () => {
    const pct = window.innerWidth * DEFAULT_RIGHT_PCT;
    const maxAllowedByLeft = window.innerWidth - MIN_LEFT_WIDTH - 6; // 6 = divider
    return Math.max(MIN_RIGHT_WIDTH, Math.min(pct, maxAllowedByLeft));
  };
  const [rightWidth, setRightWidth] = useState(getDefaultRightWidth);
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef({ startX: 0, startWidth: 0 });
  const splitRef = useRef(null);

  /* ── dark mode observer ── */
  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  /* ── load trainers for dropdown ── */
  useEffect(() => {
    setTrainersLoading(true);
    courseService
      .getOrgTrainers()
      .then((res) => setTrainers(res.data || []))
      .catch((err) => console.error("Failed to load trainers", err))
      .finally(() => setTrainersLoading(false));
  }, []);

  /* ── load courses ── */
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setLoading(true);
    courseService
      .getOrgAdminCourses()
      .then((res) => {
        const mapped = res.data.map((c) => ({
          id: c.id,
          name: c.title,
          category: c.category,
          trainerName: c.ownerEmail,
          assignedTrainer: c.assignedTrainerEmail || null,
          status: "PUBLISHED",
          enrollments: 0,
        }));
        setCourses(mapped);
      })
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => setLoading(false));
  };

  /* ── toast helper ── */
  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── open the split panel ── */
  const openModal = () => {
    setForm(EMPTY_FORM);
    setRightWidth(getDefaultRightWidth());
    setOpen(true);
    setClosing(false);
  };

  /* ── close the split panel (animated) ── */
  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setForm(EMPTY_FORM);
    }, 200);
  }, []);

  /* ── ESC closes panel (accessibility) ── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  /* ── drag-to-resize divider logic ──
     Dragging left edge moves the boundary; right panel width = distance
     from the mouse to the right edge of the viewport/container. */
  const onDividerMouseDown = (e) => {
    e.preventDefault();
    dragStateRef.current = { startX: e.clientX, startWidth: rightWidth };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const containerWidth = splitRef.current
        ? splitRef.current.getBoundingClientRect().width
        : window.innerWidth;
      const delta = dragStateRef.current.startX - e.clientX; // drag left = wider right panel
      let nextRight = dragStateRef.current.startWidth + delta;
      const maxRight = containerWidth - MIN_LEFT_WIDTH - 6;
      nextRight = Math.min(maxRight, Math.max(MIN_RIGHT_WIDTH, nextRight));
      setRightWidth(nextRight);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  /* ── submit create course ── */
  const handleCreate = async () => {
    if (!form.title.trim()) {
      showToast("Course name is required", true);
      return;
    }
    if (!form.category.trim()) {
      showToast("Category is required", true);
      return;
    }
    if (!form.assignedTrainerEmail) {
      showToast("Please assign a trainer", true);
      return;
    }

    try {
      setSubmitting(true);
      await courseService.adminCreateCourse({
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        assignedTrainerEmail: form.assignedTrainerEmail,
      });
      closeModal();
      loadCourses();
      showToast("Course created and assigned successfully!");
    } catch (err) {
      console.error("Create course failed", err);
      showToast(
        err?.response?.data?.message || "Failed to create course",
        true,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

  /* ── field change helper ── */
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className={`ac${dark ? " ac-dk" : ""}`}>
      {/* ══════════ TRUE SPLIT VIEW ROW ══════════
          Left = course list (shrinks), Divider (drag), Right = create panel (in-flow).
          No position:fixed, no backdrop, no overlay — the page layout itself resizes. */}
      <div className="ac-split" ref={splitRef}>
        {/* ── LEFT: Course List ── */}
        <div className="ac-split-left">
          <div className="ac-split-left-inner">
            {/* ── Header ── */}
            <div className="ac-hdr">
              <div className="ac-hdr-l">
                <button className="ac-back" onClick={() => navigate(-1)}>
                  <ArrowLeft size={14} /> Back
                </button>
                <div className="ac-hdr-ico">
                  <BookOpen size={24} />
                </div>
                <div>
                  <div className="ac-bdg">
                    <BookOpen size={10} /> Course Management
                  </div>
                  <h1 className="ac-h1">All Courses</h1>
                  <p className="ac-sub">
                    Create, assign and manage all courses in your organisation
                  </p>
                </div>
              </div>
              <div className="ac-chips">
                <div className="ac-chip">
                  <BookOpen size={14} style={{ color: "var(--c1)" }} />
                  <span style={{ fontWeight: 800, color: "var(--c1)" }}>
                    {courses.length}
                  </span>
                  <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                    Courses
                  </span>
                </div>
                <div className="ac-chip">
                  <Users size={14} style={{ color: "var(--c3)" }} />
                  <span style={{ fontWeight: 800, color: "var(--c3)" }}>
                    {publishedCount}
                  </span>
                  <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                    Published
                  </span>
                </div>
                <div className="ac-chip">
                  <UserCheck size={14} style={{ color: "var(--c4)" }} />
                  <span style={{ fontWeight: 800, color: "var(--c4)" }}>
                    {trainers.length}
                  </span>
                  <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                    Trainers
                  </span>
                </div>
              </div>
            </div>

            {/* ── Action bar ── */}
            <div className="ac-abar">
              <div className="ac-search">
                <Search size={14} />
                <input
                  placeholder="Search courses…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="ac-abar-r">
                {/* Create Course button — toggles split panel */}
                <button
                  className={`ac-btn ac-btn-cyan${open ? " ac-active" : ""}`}
                  onClick={openModal}
                >
                  <Plus size={14} /> Create Course
                </button>

                {/* Categories */}
                <button
                  className="ac-btn ac-btn-outline"
                  onClick={() => navigate("/admin/categories")}
                >
                  <Folder size={14} style={{ color: "var(--c1)" }} /> Categories
                </button>
              </div>
            </div>

            {/* ── Table card ── */}
            <div className="ac-tcard">
              <div className="ac-thead-row">
                <div>
                  <p className="ac-thead-title">Course List</p>
                  <p className="ac-thead-sub">
                    {filteredCourses.length} course
                    {filteredCourses.length !== 1 && "s"} found
                  </p>
                </div>
              </div>

              {/* skeleton */}
              {loading &&
                [1, 2, 3].map((i) => (
                  <div key={i} className="ac-skel-row">
                    <div className="ac-skel-l">
                      <div className="ac-skel-sq" />
                      <div>
                        <div
                          className="ac-skel-line"
                          style={{ width: 160, marginBottom: 8 }}
                        />
                        <div className="ac-skel-line" style={{ width: 100 }} />
                      </div>
                    </div>
                    <div className="ac-skel-pill" />
                  </div>
                ))}

              {/* empty */}
              {!loading && filteredCourses.length === 0 && (
                <div className="ac-empty">
                  <div className="ac-empty-ico">
                    <BookOpen size={26} />
                  </div>
                  <p className="ac-empty-t">No courses yet</p>
                  <p className="ac-empty-s">
                    Click "Create Course" to add your first course and assign
                    it to a trainer
                  </p>
                </div>
              )}

              {/* table */}
              {!loading && filteredCourses.length > 0 && (
                <table className="ac-t">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course</th>
                      <th>Category</th>
                      <th>Trainer</th>
                      <th>Status</th>
                      <th>Enrollments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((c, index) => {
                      const cc = catColor(c.category);
                      return (
                        <tr key={c.id}>
                          <td>
                            <span className="ac-idx">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </td>
                          <td>
                            <div className="ac-course-cell">
                              <div
                                className="ac-course-av"
                                style={{ background: gradBg(c.name) }}
                              >
                                <BookOpen size={16} color="white" />
                              </div>
                              <span className="ac-course-name">{c.name}</span>
                            </div>
                          </td>
                          <td>
                            <span
                              className="ac-cat-tag"
                              style={{
                                background: cc.bg,
                                color: cc.color,
                                borderColor: cc.bd,
                              }}
                            >
                              <Tag size={11} /> {c.category || "—"}
                            </span>
                          </td>
                          <td>
                            <div className="ac-trainer-cell">
                              <Mail size={12} />
                              {/* Show assigned trainer if set, otherwise owner */}
                              {c.assignedTrainer ? (
                                <>
                                  {c.assignedTrainer}
                                  <span className="ac-assigned-badge">
                                    <UserCheck size={9} /> Assigned
                                  </span>
                                </>
                              ) : (
                                c.trainerName
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="ac-status-ok">
                              <span className="ac-status-dot" /> {c.status}
                            </span>
                          </td>
                          <td>
                            <div className="ac-enroll-cell">
                              <Users
                                size={13}
                                style={{ color: "var(--mu)" }}
                              />{" "}
                              {c.enrollments}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* ── DRAGGABLE DIVIDER + RIGHT PANEL (only rendered when open) ── */}
        {open && (
          <>
            <div
              className={`ac-divider${dragging ? " ac-dragging" : ""}`}
              onMouseDown={onDividerMouseDown}
              title="Drag to resize"
            >
              <div className="ac-divider-grip">
                <GripVertical size={12} />
              </div>
            </div>

            <div
              className={`ac-panel${closing ? " ac-closing" : ""}${dark ? " ac-dk" : ""}`}
              style={{ width: rightWidth, flexBasis: rightWidth }}
              role="region"
              aria-label="Create Course"
            >
              {/* header */}
              <div className="ac-dr-head">
                <div className="ac-dr-head-row">
                  <div className="ac-dr-head-l">
                    <div className="ac-dr-ico">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="ac-dr-title">Create Course</p>
                      <p className="ac-dr-sub">
                        Fill in the details and assign to a trainer
                      </p>
                    </div>
                  </div>
                  <button
                    className="ac-dr-close"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* scrollable form body */}
              <div className="ac-dr-body">
                {/* Course Name */}
                <div className="ac-field">
                  <label>
                    Course Name <span>*</span>
                  </label>
                  <input
                    className="ac-input"
                    placeholder="e.g. React for Beginners"
                    value={form.title}
                    onChange={set("title")}
                  />
                </div>

                {/* Category */}
                <div className="ac-field">
                  <label>
                    Category <span>*</span>
                  </label>
                  <input
                    className="ac-input"
                    placeholder="e.g. Web Development"
                    value={form.category}
                    onChange={set("category")}
                  />
                </div>

                {/* Description */}
                <div className="ac-field">
                  <label>Description</label>
                  <textarea
                    className="ac-input"
                    rows={5}
                    style={{ resize: "none" }}
                    placeholder="Brief course description…"
                    value={form.description}
                    onChange={set("description")}
                  />
                </div>

                <div className="ac-divider-soft" />

                {/* Assign Trainer dropdown */}
                <div className="ac-field">
                  <label>
                    Assign Trainer <span>*</span>
                  </label>
                  <select
                    className="ac-input"
                    value={form.assignedTrainerEmail}
                    onChange={set("assignedTrainerEmail")}
                    disabled={trainersLoading}
                  >
                    <option value="">
                      {trainersLoading
                        ? "Loading trainers…"
                        : trainers.length === 0
                          ? "No trainers available"
                          : "Select a trainer…"}
                    </option>
                    {trainers.map((t) => (
                      <option key={t.email} value={t.email}>
                        {/* {t.name ? `${t.name} — ${t.email}` : t.email} */}
                        {t.displayName
                          ? `${t.displayName} — ${t.email}`
                          : t.email}
                      </option>
                    ))}
                  </select>
                  <p className="ac-field-hint">
                    The selected trainer will own and manage this course.
                  </p>
                </div>
              </div>

              {/* footer */}
              <div className="ac-dr-foot">
                <button className="ac-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="ac-submit"
                  onClick={handleCreate}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="ac-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      <Plus size={13} /> Create &amp; Assign
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`ac-toast${toast.err ? " ac-toast-err" : ""}`}>
          {toast.err ? <AlertCircle size={14} /> : null}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
