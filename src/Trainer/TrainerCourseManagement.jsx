// import axios from "axios";
// import {
//   BookOpen,
//   CheckCircle,
//   Clock,
//   Download,
//   Edit2,
//   Eye,
//   GraduationCap,
//   Plus,
//   Search,
//   Star,
//   Trash2,
//   Users,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Layers,
// } from "lucide-react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { getTrainerBatches } from "@/services/batchService";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .tc-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
// .tc{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);display:flex;flex-direction:column;}
// .tc-top{padding:20px 24px;}
// .tc-toprow{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
// .tc-tl{display:flex;align-items:center;gap:12px;}
// .tc-tl-ico{width:44px;height:44px;border-radius:13px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .tc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--mu);margin-bottom:3px;}
// .tc-h1{font-size:20px;font-weight:800;color:var(--tx);margin:0;}
// .tc-tr{display:flex;align-items:center;gap:8px;}
// .tc-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:12px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;border:none;white-space:nowrap;}
// .tc-btn:hover{opacity:.87;transform:translateY(-1px);}
// .tc-btn-out{background:var(--card);border:1px solid var(--bd)!important;color:var(--mu);}
// .tc-btn-out:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
// .tc-btn-green{background:var(--c3);color:#0a0a0a;}
// .tc-toast{padding:11px 16px;border-radius:13px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.20);display:flex;align-items:center;gap:8px;color:var(--c3);font-size:13px;font-weight:600;}
// .tc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 24px 16px;}
// .tc-stat{border-radius:var(--r);padding:18px 20px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh);}
// .tc-stat::before{content:"";position:absolute;right:-12px;top:-12px;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.10);}
// .tc-sico{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:8px;}
// .tc-sv{font-size:26px;font-weight:800;margin-bottom:3px;}
// .tc-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.65;}
// .tc-panels{display:flex;flex:1;margin:0 24px 24px;border-radius:var(--r);border:1px solid var(--bd);background:var(--card);box-shadow:var(--shl);overflow:hidden;}
// .tc-p1{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--bd);transition:width .3s;}
// .tc-p1-head{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .tc-p1-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);}
// .tc-p1-list{flex:1;overflow-y:auto;padding:8px;}
// .tc-cat-btn{width:100%;text-align:left;padding:9px 12px;border-radius:11px;border:none;background:transparent;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;color:var(--mu);cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .15s;}
// .tc-cat-btn:hover{background:rgba(34,211,238,.06);color:var(--c1);}
// .tc-cat-btn.on{color:white;}
// .tc-resize{width:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize;background:var(--bg);border-left:1px solid var(--bd);border-right:1px solid var(--bd);transition:background .2s;}
// .tc-resize:hover{background:rgba(34,211,238,.08);}
// .tc-resize-pill{width:3px;height:40px;border-radius:4px;background:var(--bd);transition:background .2s;}
// .tc-resize:hover .tc-resize-pill{background:var(--c1);}
// .tc-p2{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
// .tc-p2-search{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .tc-sinput{position:relative;flex:1;}
// .tc-sinput svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--mu);pointer-events:none;}
// .tc-sinput input{width:100%;padding:9px 12px 9px 34px;border-radius:11px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;box-sizing:border-box;transition:border-color .2s;}
// .tc-sinput input:focus{border-color:var(--c1);}
// .tc-sinput input::placeholder{color:var(--mu);}
// .tc-found{font-size:11px;font-weight:700;color:var(--mu);white-space:nowrap;}
// .tc-p2-grid{flex:1;overflow-y:auto;padding:16px;}
// .tc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
// .tc-cc{border-radius:16px;border:1px solid var(--bd);background:var(--bg);padding:18px;display:flex;flex-direction:column;gap:0;transition:all .2s;}
// .tc-cc:hover{border-color:rgba(34,211,238,.25);box-shadow:var(--sh);}
// .tc-cc.on{border-color:rgba(34,211,238,.40);background:rgba(34,211,238,.03);box-shadow:var(--sh);}
// .tc-cc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
// .tc-pub-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;background:rgba(52,211,153,.10);color:var(--c3);border:1px solid rgba(52,211,153,.15);}
// .tc-cat-tag{display:inline-flex;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;}
// .tc-ct{font-size:13px;font-weight:800;color:var(--tx);line-height:1.35;margin:0 0 4px;}
// .tc-cc:hover .tc-ct{color:var(--c1);}
// .tc-ce{font-size:11px;color:var(--mu);display:flex;align-items:center;gap:4px;margin:0 0 12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
// .tc-meta{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--mu);padding:10px 0;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);margin-bottom:10px;}
// .tc-mi{display:flex;align-items:center;gap:4px;}
// .tc-desc{font-size:11px;color:var(--mu);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px;}
// .tc-3btn{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px;}
// .tc-ab{display:flex;align-items:center;justify-content:center;gap:4px;padding:7px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--mu);font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;cursor:pointer;transition:all .15s;}
// .tc-ab:hover{border-color:rgba(34,211,238,.30);color:var(--c1);background:rgba(34,211,238,.04);}
// .tc-del{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;padding:7px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--mu);font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;cursor:pointer;transition:all .15s;}
// .tc-del:hover{border-color:rgba(248,113,113,.30);color:var(--cr);background:rgba(248,113,113,.04);}
// .tc-p3{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-left:1px solid var(--bd);}
// .tc-p3-head{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .tc-p3-title-row{display:flex;align-items:center;gap:8px;}
// .tc-p3-ico{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .tc-p3-title{font-size:13px;font-weight:800;color:var(--tx);}
// .tc-xbtn{width:28px;height:28px;border-radius:8px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
// .tc-xbtn:hover{background:rgba(248,113,113,.10);color:var(--cr);}
// .tc-p3-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;}
// .tc-field label{display:block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--mu);margin-bottom:6px;}
// .tc-field label span{color:var(--cr);}
// .tc-inp{width:100%;padding:10px 13px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
// .tc-inp:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .tc-inp::placeholder{color:var(--mu);}
// .tc-submit-row{display:flex;gap:8px;}
// .tc-sub{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;border-radius:12px;border:none;color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
// .tc-sub:hover{opacity:.87;transform:translateY(-1px);}
// .tc-can{padding:11px 16px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;}
// .tc-can:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
// .tc-prev-hero{border-radius:16px;padding:20px;color:white;margin-bottom:14px;}
// .tc-prev-type{display:inline-flex;padding:3px 9px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;margin-bottom:8px;}
// .tc-prev-h2{font-size:17px;font-weight:800;margin:0 0 6px;line-height:1.3;}
// .tc-prev-sub{font-size:11px;opacity:.65;display:flex;align-items:center;gap:4px;margin:0;}
// .tc-prev-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
// .tc-prev-mc{border-radius:12px;padding:12px;text-align:center;background:var(--bg);border:1px solid var(--bd);}
// .tc-prev-mv{font-size:14px;font-weight:800;color:var(--tx);margin-bottom:3px;}
// .tc-prev-ml{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mu);}
// .tc-prev-about{border-radius:12px;padding:14px;background:var(--bg);border:1px solid var(--bd);margin-bottom:14px;}
// .tc-prev-at{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);margin:0 0 6px;}
// .tc-prev-ad{font-size:13px;color:var(--mu);line-height:1.6;margin:0;}
// .tc-spin{width:20px;height:20px;border:2px solid rgba(0,0,0,.2);border-top-color:rgba(0,0,0,.7);border-radius:50%;animation:tc-spin .8s linear infinite;}
// @keyframes tc-spin{to{transform:rotate(360deg)}}
// .tc-loader{display:flex;align-items:center;justify-content:center;padding:60px;}
// .tc-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:10px;text-align:center;color:var(--mu);font-size:13px;}
// .tc-empty-ico{width:52px;height:52px;border-radius:15px;background:var(--bg);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;color:var(--mu);}
// `;
// if (!document.getElementById("tc-st")) {
//   const t = document.createElement("style");
//   t.id = "tc-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }
// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const CAT_COLORS = {
//   Product: { bg: "rgba(167,139,250,.10)", color: "var(--c4)" },
//   Design: { bg: "rgba(251,146,60,.10)", color: "var(--c2)" },
//   "Growth & Marketing": { bg: "rgba(34,211,238,.10)", color: "var(--c1)" },
//   Development: { bg: "rgba(52,211,153,.10)", color: "var(--c3)" },
//   Business: { bg: "rgba(248,113,113,.10)", color: "var(--cr)" },
//   _d: { bg: "rgba(100,116,139,.10)", color: "var(--mu)" },
// };
// const catStyle = (c) => CAT_COLORS[c] || CAT_COLORS._d;

// const STAT_GRADS = [
//   "linear-gradient(135deg,#064e3b,#059669)",
//   "linear-gradient(135deg,#1e3a8a,#2563eb)",
//   "linear-gradient(135deg,#78350f,#d97706)",
// ];

// const TrainerCourseManagement = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState("All");
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     category: "",
//     description: "",
//   });
//   const [createForm, setCreateForm] = useState({
//     title: "",
//     category: "",
//     description: "",
//     batchId: "",
//   });
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [previewCourseId, setPreviewCourseId] = useState(null);
//   const [leftCollapsed, setLeftCollapsed] = useState(false);
//   const [rightOpen, setRightOpen] = useState(false);
//   const [rightMode, setRightMode] = useState("create");
//   const [rightWidth, setRightWidth] = useState(320);
//   const [dark, setDark] = useState(isDark);
//   const isDragging = useRef(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   const onMouseDown = useCallback(() => {
//     isDragging.current = true;
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   }, []);
//   const onMouseMove = useCallback((e) => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const fr = rect.right - e.clientX;
//     if (fr > 240 && fr < 560) setRightWidth(fr);
//   }, []);
//   const onMouseUp = useCallback(() => {
//     isDragging.current = false;
//     document.body.style.cursor = "";
//     document.body.style.userSelect = "";
//   }, []);
//   useEffect(() => {
//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//     };
//   }, [onMouseMove, onMouseUp]);

//   const authHeader = () => ({
//     Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//   });

//   useEffect(() => {
//     fetchCourses();
//     (async () => {
//       try {
//         const r = await getTrainerBatches();
//         setBatches(r || []);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       // const r = await axios.get(`${API}/courses/my`, { headers: authHeader() });
//       const r = await axios.get(`${API}/courses/trainer/all`, {
//         headers: authHeader(),
//       });
//       setCourses(r.data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotif = (msg) => {
//     setSuccessMessage(msg);
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   const createCourse = async (e) => {
//     e.preventDefault();
//     if (!createForm.title || !createForm.category || !createForm.batchId) {
//       alert("Please fill in all required fields");
//       return;
//     }
//     try {
//       await axios.post(`${API}/courses`, createForm, { headers: authHeader() });
//       setCreateForm({ title: "", category: "", description: "", batchId: "" });
//       setRightOpen(false);
//       fetchCourses();
//       showNotif("Course created successfully!");
//     } catch {
//       alert("Failed to create course");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this course?")) return;
//     try {
//       await axios.delete(`${API}/courses/${id}`, { headers: authHeader() });
//       setCourses((p) => p.filter((c) => c.id !== id));
//       if (editingCourse?.id === id) {
//         setEditingCourse(null);
//         setRightOpen(false);
//       }
//       if (previewCourseId === id) setPreviewCourseId(null);
//       showNotif("Course deleted.");
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   const openEdit = (course) => {
//     setEditingCourse(course);
//     setEditForm({
//       title: course.title,
//       category: course.category,
//       description: course.description || "",
//     });
//     setRightMode("edit");
//     setRightOpen(true);
//     setPreviewCourseId(null);
//   };

//   const saveEdit = async () => {
//     try {
//       await axios.put(`${API}/courses/${editingCourse.id}`, editForm, {
//         headers: authHeader(),
//       });
//       setEditingCourse(null);
//       setRightOpen(false);
//       fetchCourses();
//       showNotif("Course updated!");
//     } catch {
//       alert("Update failed");
//     }
//   };

//   const categories = [
//     "All",
//     "Product",
//     "Design",
//     "Growth & Marketing",
//     "Development",
//     "Business",
//   ];
//   // const filteredCourses = courses.filter((c) => {
//   //   const ms =
//   //     c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
//   //   const mc = selectedCategory === "All" || c.category === selectedCategory;
//   //   return ms && mc;
//   // });
//   const filteredCourses = courses.filter((c) => {
//     const ms =
//       c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
//     const mc = selectedCategory === "All" || c.category === selectedCategory;
//     const mb = selectedBatch === "All" || c.batchId === selectedBatch;
//     return ms && mc && mb;
//   });
//   const totalCourses = courses.length;
//   const totalStudents = courses.reduce((a, c) => a + (c.enrolledCount || 0), 0);
//   const avgRating = courses.length
//     ? (
//         courses.reduce((a, c) => a + (c.rating || 4.8), 0) / courses.length
//       ).toFixed(1)
//     : "—";

//   const statCards = [
//     {
//       icon: <BookOpen size={16} />,
//       value: totalCourses,
//       label: "Total Courses",
//       grad: STAT_GRADS[0],
//     },
//     {
//       icon: <Users size={16} />,
//       value: totalStudents,
//       label: "Enrollments",
//       grad: STAT_GRADS[1],
//     },
//     {
//       icon: <Star size={16} />,
//       value: avgRating,
//       label: "Avg Rating",
//       grad: STAT_GRADS[2],
//     },
//   ];

//   const rightModeColor =
//     rightMode === "create"
//       ? "var(--c3)"
//       : rightMode === "edit"
//         ? "var(--c1)"
//         : "var(--c4)";

//   return (
//     <div className={`tc${dark ? " tc-dk" : ""}`}>
//       <div className="tc-top">
//         <div className="tc-toprow">
//           <div className="tc-tl">
//             <div className="tc-tl-ico">
//               <GraduationCap size={22} />
//             </div>
//             <div>
//               <div className="tc-label">Learning Management</div>
//               <h1 className="tc-h1">Course Management</h1>
//             </div>
//           </div>
//           <div className="tc-tr">
//             <button className="tc-btn tc-btn-out">
//               <Download size={13} /> Export
//             </button>
//             <button
//               className="tc-btn tc-btn-green"
//               onClick={() => {
//                 setRightMode("create");
//                 setRightOpen(true);
//                 setEditingCourse(null);
//                 setPreviewCourseId(null);
//               }}
//             >
//               <Plus size={13} /> New Course
//             </button>
//           </div>
//         </div>
//         {showSuccess && (
//           <div className="tc-toast">
//             <CheckCircle size={15} />
//             {successMessage}
//           </div>
//         )}
//       </div>

//       <div className="tc-stats">
//         {statCards.map((s, i) => (
//           <div key={i} className="tc-stat" style={{ background: s.grad }}>
//             <div className="tc-sico">{s.icon}</div>
//             <div className="tc-sv">{s.value}</div>
//             <div className="tc-sl">{s.label}</div>
//           </div>
//         ))}
//       </div>
//       {/* Batch filter bar */}
//       <div
//         style={{
//           display: "flex",
//           gap: 8,
//           padding: "0 24px 16px",
//           overflowX: "auto",
//           flexWrap: "wrap",
//         }}
//       >
//         <button
//           className="tc-btn"
//           style={{
//             background:
//               selectedBatch === "All"
//                 ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
//                 : "var(--card)",
//             color: selectedBatch === "All" ? "white" : "var(--mu)",
//             border: selectedBatch === "All" ? "none" : "1px solid var(--bd)",
//           }}
//           onClick={() => setSelectedBatch("All")}
//         >
//           All Batches
//         </button>
//         {batches.map((b) => (
//           <button
//             key={b.id}
//             className="tc-btn"
//             style={{
//               background:
//                 selectedBatch === b.id
//                   ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
//                   : "var(--card)",
//               color: selectedBatch === b.id ? "white" : "var(--mu)",
//               border: selectedBatch === b.id ? "none" : "1px solid var(--bd)",
//             }}
//             onClick={() => setSelectedBatch(b.id)}
//           >
//             Batch {b.id}
//             {b.name ? ` — ${b.name}` : ""}
//           </button>
//         ))}
//       </div>
//       <div
//         ref={containerRef}
//         className="tc-panels"
//         style={{ height: "calc(100vh - 280px)", minHeight: 380 }}
//       >
//         {/* Panel 1 - filters */}
//         <div className="tc-p1" style={{ width: leftCollapsed ? 0 : 196 }}>
//           <div className="tc-p1-head">
//             <Layers size={13} style={{ color: "var(--c1)", flexShrink: 0 }} />
//             <span className="tc-p1-title">Categories</span>
//           </div>
//           <div className="tc-p1-list">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 className={`tc-cat-btn${selectedCategory === cat ? " on" : ""}`}
//                 style={
//                   selectedCategory === cat
//                     ? { background: "linear-gradient(135deg,#1e3a8a,#2563eb)" }
//                     : {}
//                 }
//                 onClick={() => setSelectedCategory(cat)}
//               >
//                 <span>{cat}</span>
//                 {selectedCategory === cat && (
//                   <span
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: "50%",
//                       background: "rgba(255,255,255,.7)",
//                     }}
//                   />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Resize 1 */}
//         <div
//           className="tc-resize"
//           style={{ cursor: "pointer" }}
//           onClick={() => setLeftCollapsed((p) => !p)}
//         >
//           <div className="tc-resize-pill" />
//         </div>

//         {/* Panel 2 - course list */}
//         <div className="tc-p2">
//           <div className="tc-p2-search">
//             <div className="tc-sinput">
//               <Search size={13} />
//               <input
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <span className="tc-found">{filteredCourses.length} found</span>
//           </div>
//           <div className="tc-p2-grid">
//             {loading ? (
//               <div className="tc-loader">
//                 <div className="tc-spin" />
//               </div>
//             ) : filteredCourses.length === 0 ? (
//               <div className="tc-empty-state">
//                 <div className="tc-empty-ico">
//                   <BookOpen size={24} />
//                 </div>
//                 <span>
//                   {searchQuery || selectedCategory !== "All"
//                     ? "No courses match your filters"
//                     : "No courses yet — create your first!"}
//                 </span>
//               </div>
//             ) : (
//               <div className="tc-grid">
//                 {filteredCourses.map((course) => {
//                   const cs = catStyle(course.category);
//                   const isActive =
//                     editingCourse?.id === course.id ||
//                     previewCourseId === course.id;
//                   return (
//                     <div
//                       key={course.id}
//                       className={`tc-cc${isActive ? " on" : ""}`}
//                     >
//                       {/* <div className="tc-cc-head">
//                         <span className="tc-pub-tag">
//                           <CheckCircle size={10} /> Published
//                         </span>
//                         <span
//                           className="tc-cat-tag"
//                           style={{ background: cs.bg, color: cs.color }}
//                         >
//                           {course.category}
//                         </span>
//                       </div> */}
//                       <div className="tc-cc-head">
//                         <span className="tc-pub-tag">
//                           <CheckCircle size={10} /> Published
//                         </span>
//                         <span
//                           className="tc-cat-tag"
//                           style={{ background: cs.bg, color: cs.color }}
//                         >
//                           {course.category}
//                         </span>
//                       </div>
//                       {/* Batch badge */}
//                       <div style={{ marginBottom: 8 }}>
//                         <span
//                           style={{
//                             fontSize: 10,
//                             fontWeight: 700,
//                             padding: "3px 8px",
//                             borderRadius: 6,
//                             background: "rgba(34,211,238,.10)",
//                             color: "var(--c1)",
//                             border: "1px solid rgba(34,211,238,.15)",
//                           }}
//                         >
//                           Batch {course.batchId}
//                         </span>
//                       </div>
//                       <p className="tc-ct">{course.title}</p>
//                       <p className="tc-ce">
//                         <GraduationCap size={11} />
//                         {course.ownerEmail}
//                       </p>
//                       <div className="tc-meta">
//                         <span className="tc-mi">
//                           <Clock size={11} />
//                           8w
//                         </span>
//                         <span className="tc-mi">
//                           <Users size={11} />
//                           {course.enrolledCount || 0}
//                         </span>
//                         <span className="tc-mi">
//                           <Star
//                             size={11}
//                             style={{ color: "var(--c2)", fill: "var(--c2)" }}
//                           />
//                           {course.rating || 4.8}
//                         </span>
//                       </div>
//                       {course.description && (
//                         <p className="tc-desc">{course.description}</p>
//                       )}
//                       <div className="tc-3btn">
//                         <button
//                           className="tc-ab"
//                           onClick={() => openEdit(course)}
//                         >
//                           <Edit2 size={11} /> Edit
//                         </button>
//                         <button
//                           className="tc-ab"
//                           onClick={() =>
//                             navigate(`/trainer/course/${course.id}/modules`)
//                           }
//                         >
//                           <BookOpen size={11} /> Modules
//                         </button>
//                         <button
//                           className="tc-ab"
//                           onClick={() => {
//                             setPreviewCourseId(course.id);
//                             setRightMode("preview");
//                             setRightOpen(true);
//                             setEditingCourse(null);
//                           }}
//                         >
//                           <Eye size={11} /> Preview
//                         </button>
//                       </div>
//                       <button
//                         className="tc-del"
//                         onClick={() => handleDelete(course.id)}
//                       >
//                         <Trash2 size={11} /> Delete Course
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Resize 2 */}
//         {rightOpen ? (
//           <div className="tc-resize" onMouseDown={onMouseDown}>
//             <div className="tc-resize-pill" />
//           </div>
//         ) : (
//           <div
//             className="tc-resize"
//             style={{ cursor: "pointer" }}
//             onClick={() => {
//               setRightMode("create");
//               setRightOpen(true);
//               setEditingCourse(null);
//               setPreviewCourseId(null);
//             }}
//           >
//             <div className="tc-resize-pill" />
//           </div>
//         )}

//         {/* Panel 3 */}
//         {rightOpen && (
//           <div className="tc-p3" style={{ width: rightWidth }}>
//             <div className="tc-p3-head">
//               <div className="tc-p3-title-row">
//                 <div
//                   className="tc-p3-ico"
//                   style={{
//                     background: `rgba(${rightMode === "create" ? "52,211,153" : rightMode === "edit" ? "34,211,238" : "167,139,250"},.15)`,
//                     color: rightModeColor,
//                   }}
//                 >
//                   {rightMode === "create" ? (
//                     <Plus size={14} />
//                   ) : rightMode === "edit" ? (
//                     <Edit2 size={14} />
//                   ) : (
//                     <Eye size={14} />
//                   )}
//                 </div>
//                 <span className="tc-p3-title">
//                   {rightMode === "create"
//                     ? "New Course"
//                     : rightMode === "edit"
//                       ? "Edit Course"
//                       : "Course Preview"}
//                 </span>
//               </div>
//               <button
//                 className="tc-xbtn"
//                 onClick={() => {
//                   setRightOpen(false);
//                   setEditingCourse(null);
//                   setPreviewCourseId(null);
//                 }}
//               >
//                 <X size={13} />
//               </button>
//             </div>

//             <div className="tc-p3-body">
//               {rightMode === "preview" &&
//                 previewCourseId &&
//                 (() => {
//                   const c = courses.find((x) => x.id === previewCourseId);
//                   if (!c) return null;
//                   const cs = catStyle(c.category);
//                   return (
//                     <>
//                       <div
//                         className="tc-prev-hero"
//                         style={{
//                           background: "linear-gradient(135deg,#312e81,#6366f1)",
//                         }}
//                       >
//                         <span
//                           className="tc-prev-type"
//                           style={{
//                             background: "rgba(255,255,255,.15)",
//                             color: "white",
//                           }}
//                         >
//                           {c.category}
//                         </span>
//                         <h2 className="tc-prev-h2">{c.title}</h2>
//                         <p className="tc-prev-sub">
//                           <GraduationCap size={12} /> {c.ownerEmail}
//                         </p>
//                       </div>
//                       <div className="tc-prev-meta">
//                         {[
//                           {
//                             icon: <Clock size={13} />,
//                             val: "8 weeks",
//                             lbl: "Duration",
//                           },
//                           {
//                             icon: <Users size={13} />,
//                             val: c.enrolledCount || 0,
//                             lbl: "Enrolled",
//                           },
//                           {
//                             icon: (
//                               <Star
//                                 size={13}
//                                 style={{
//                                   color: "var(--c2)",
//                                   fill: "var(--c2)",
//                                 }}
//                               />
//                             ),
//                             val: c.rating || 4.8,
//                             lbl: "Rating",
//                           },
//                         ].map((m, i) => (
//                           <div key={i} className="tc-prev-mc">
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 color: "var(--mu)",
//                                 marginBottom: 6,
//                               }}
//                             >
//                               {m.icon}
//                             </div>
//                             <div className="tc-prev-mv">{m.val}</div>
//                             <div className="tc-prev-ml">{m.lbl}</div>
//                           </div>
//                         ))}
//                       </div>
//                       {c.description && (
//                         <div className="tc-prev-about">
//                           <p className="tc-prev-at">About</p>
//                           <p className="tc-prev-ad">{c.description}</p>
//                         </div>
//                       )}
//                       <button
//                         className="tc-btn"
//                         style={{
//                           width: "100%",
//                           justifyContent: "center",
//                           marginBottom: 8,
//                           background: "var(--c1)",
//                           color: "#0a0a0a",
//                         }}
//                         onClick={() => openEdit(c)}
//                       >
//                         <Edit2 size={14} /> Edit This Course
//                       </button>
//                       <button
//                         className="tc-btn"
//                         style={{
//                           width: "100%",
//                           justifyContent: "center",
//                           background: "var(--c4)",
//                           color: "#0a0a0a",
//                         }}
//                         onClick={() =>
//                           navigate(`/trainer/course/${c.id}/modules`)
//                         }
//                       >
//                         <BookOpen size={14} /> Manage Modules
//                       </button>
//                     </>
//                   );
//                 })()}

//               {(rightMode === "create" || rightMode === "edit") && (
//                 <>
//                   {rightMode === "create" && (
//                     <div className="tc-field">
//                       <label>
//                         Batch <span>*</span>
//                       </label>
//                       <select
//                         className="tc-inp"
//                         value={createForm.batchId}
//                         onChange={(e) =>
//                           setCreateForm({
//                             ...createForm,
//                             batchId: e.target.value,
//                           })
//                         }
//                       >
//                         <option value="">Select Batch…</option>
//                         {batches.map((b) => (
//                           <option key={b.id} value={b.id}>
//                             Batch {b.id}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}
//                   <div className="tc-field">
//                     <label>
//                       Course Title <span>*</span>
//                     </label>
//                     <input
//                       className="tc-inp"
//                       placeholder="e.g., Advanced React Development"
//                       value={
//                         rightMode === "create"
//                           ? createForm.title
//                           : editForm.title
//                       }
//                       onChange={(e) =>
//                         rightMode === "create"
//                           ? setCreateForm({
//                               ...createForm,
//                               title: e.target.value,
//                             })
//                           : setEditForm({ ...editForm, title: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="tc-field">
//                     <label>
//                       Category <span>*</span>
//                     </label>
//                     <input
//                       className="tc-inp"
//                       placeholder="e.g., Development"
//                       value={
//                         rightMode === "create"
//                           ? createForm.category
//                           : editForm.category
//                       }
//                       onChange={(e) =>
//                         rightMode === "create"
//                           ? setCreateForm({
//                               ...createForm,
//                               category: e.target.value,
//                             })
//                           : setEditForm({
//                               ...editForm,
//                               category: e.target.value,
//                             })
//                       }
//                     />
//                   </div>
//                   <div className="tc-field">
//                     <label>Description</label>
//                     <textarea
//                       className="tc-inp"
//                       rows={5}
//                       style={{ resize: "none" }}
//                       placeholder="Describe what students will learn…"
//                       value={
//                         rightMode === "create"
//                           ? createForm.description
//                           : editForm.description
//                       }
//                       onChange={(e) =>
//                         rightMode === "create"
//                           ? setCreateForm({
//                               ...createForm,
//                               description: e.target.value,
//                             })
//                           : setEditForm({
//                               ...editForm,
//                               description: e.target.value,
//                             })
//                       }
//                     />
//                   </div>
//                   <div className="tc-submit-row">
//                     <button
//                       className="tc-sub"
//                       style={{
//                         background:
//                           rightMode === "create" ? "var(--c3)" : "var(--c1)",
//                         color: "#0a0a0a",
//                       }}
//                       onClick={rightMode === "create" ? createCourse : saveEdit}
//                     >
//                       <CheckCircle size={15} />
//                       {rightMode === "create"
//                         ? "Create Course"
//                         : "Save Changes"}
//                     </button>
//                     <button
//                       className="tc-can"
//                       onClick={() => {
//                         setRightOpen(false);
//                         setEditingCourse(null);
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default TrainerCourseManagement;










































import axios from "axios";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Edit2,
  Eye,
  GraduationCap,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  X,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "@/services/batchService";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page now visually
// matches the Attendance page (Golden Reference) — same Hero anatomy,
// same typography tokens (FONT_SIZE / LINE_HEIGHT / LETTER_SPACING), same
// stat-card grid, same card surfaces — instead of redeclaring page-local
// type scales or a bespoke CSS-variable theme.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const FF = FONT_FAMILY;

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark" ||
  document.body.classList.contains("dark");

const CAT_COLORS = {
  Product: { bg: "rgba(167,139,250,.12)", color: "#a78bfa" },
  Design: { bg: "rgba(251,146,60,.12)", color: "#fb923c" },
  "Growth & Marketing": { bg: "rgba(34,211,238,.12)", color: "#22d3ee" },
  Development: { bg: "rgba(52,211,153,.12)", color: "#34d399" },
  Business: { bg: "rgba(248,113,113,.12)", color: "#f87171" },
  _d: { bg: "rgba(100,116,139,.12)", color: "#64748b" },
};
const catStyle = (c) => CAT_COLORS[c] || CAT_COLORS._d;

/* ─── page-local layout chrome only (resizable 3-panel workspace has no
   design-system equivalent yet). Card surfaces, type, and color all pull
   from the shared tokens below — same rule the Golden Reference follows
   for its page-local MiniCalendar / RecentPanel helpers.
   Responsive breakpoints cover: desktop / laptop, iPad Pro (1024px),
   Surface Pro / standard tablets (900px), iPad & iPad Mini (768px),
   large phones (480px), and small phones (380px). ─── */
const LOCAL_STYLES = `
.tcm-panels{display:flex;flex:1;overflow:hidden;}
.tcm-p1{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;transition:width .3s;}
.tcm-p1-list{flex:1;overflow-y:auto;padding:8px;}
.tcm-resize{width:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize;transition:background .2s;}
.tcm-resize-pill{width:3px;height:40px;border-radius:4px;transition:background .2s;}
.tcm-p2{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.tcm-p2-grid{flex:1;overflow-y:auto;padding:16px;}
.tcm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
.tcm-p3{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;}
.tcm-p3-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;}
.tcm-cc{transition:all .2s;}
.tcm-cc:hover{transform:translateY(-2px);}
.tcm-cat-btn{transition:all .15s;}
.tcm-ab{transition:all .15s;}
.tcm-del{transition:all .15s;}
.tcm-sub,.tcm-btn{transition:opacity .2s,transform .15s;}
.tcm-sub:hover,.tcm-btn:hover{opacity:.88;transform:translateY(-1px);}
.tcm-spin{width:20px;height:20px;border-radius:50%;animation:tcm-spin .8s linear infinite;}
.tcm-batch-row{display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;flex-wrap:wrap;}
@keyframes tcm-spin{to{transform:rotate(360deg)}}

/* ── iPad Pro / small laptops ── */
@media (max-width: 1024px){
  .tcm-grid{grid-template-columns:repeat(auto-fill,minmax(210px,1fr));}
}

/* ── Surface / standard tablets — stack the 3-panel workspace ── */
@media (max-width: 900px){
  .tcm-panels{flex-direction:column;height:auto !important;min-height:0 !important;}
  .tcm-p1{width:100% !important;border-right:none !important;border-bottom:1px solid var(--tcm-border,transparent);}
  .tcm-p1-list{display:flex;flex-wrap:wrap;gap:6px;padding:10px;}
  .tcm-p1-list .tcm-cat-btn{width:auto;flex:0 0 auto;}
  .tcm-resize{display:none;}
  .tcm-p2-grid{max-height:70vh;}
  .tcm-p3{width:100% !important;max-height:80vh;}
}

/* ── iPad / iPad Mini ── */
@media (max-width: 768px){
  .tcm-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;}
  .tcm-batch-row{gap:6px;}
}

/* ── Large phones (iPhone Pro Max, Pixel, Galaxy) ── */
@media (max-width: 600px){
  .tcm-grid{grid-template-columns:1fr;}
  .tcm-p2-grid{padding:10px;}
  .tcm-p3-body{padding:14px;}
}

/* ── Small phones (iPhone SE / compact Android) ── */
@media (max-width: 380px){
  .tcm-batch-row button{padding:7px 12px !important;font-size:11px !important;}
  .tcm-cc{padding:14px !important;}
}
`;
if (typeof document !== "undefined" && !document.getElementById("tcm-st")) {
  const s = document.createElement("style");
  s.id = "tcm-st";
  s.textContent = LOCAL_STYLES;
  document.head.appendChild(s);
}

const TrainerCourseManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", category: "", description: "" });
  const [createForm, setCreateForm] = useState({ title: "", category: "", description: "", batchId: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [previewCourseId, setPreviewCourseId] = useState(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightMode, setRightMode] = useState("create");
  const [rightWidth, setRightWidth] = useState(340);
  const [isDark, setIsDark] = useState(isDarkMode);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    const o = new MutationObserver(() => setIsDark(isDarkMode()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const fr = rect.right - e.clientX;
    if (fr > 260 && fr < 560) setRightWidth(fr);
  }, []);
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });

  useEffect(() => {
    fetchCourses();
    (async () => {
      try {
        const r = await getTrainerBatches();
        setBatches(r || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const fetchCourses = async () => {
    try {
      const r = await axios.get(`${API}/courses/trainer/all`, { headers: authHeader() });
      setCourses(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showNotif = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const createCourse = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.category || !createForm.batchId) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      await axios.post(`${API}/courses`, createForm, { headers: authHeader() });
      setCreateForm({ title: "", category: "", description: "", batchId: "" });
      setRightOpen(false);
      fetchCourses();
      showNotif("Course created successfully!");
    } catch {
      alert("Failed to create course");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API}/courses/${id}`, { headers: authHeader() });
      setCourses((p) => p.filter((c) => c.id !== id));
      if (editingCourse?.id === id) {
        setEditingCourse(null);
        setRightOpen(false);
      }
      if (previewCourseId === id) setPreviewCourseId(null);
      showNotif("Course deleted.");
    } catch {
      alert("Delete failed");
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setEditForm({ title: course.title, category: course.category, description: course.description || "" });
    setRightMode("edit");
    setRightOpen(true);
    setPreviewCourseId(null);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API}/courses/${editingCourse.id}`, editForm, { headers: authHeader() });
      setEditingCourse(null);
      setRightOpen(false);
      fetchCourses();
      showNotif("Course updated!");
    } catch {
      alert("Update failed");
    }
  };

  const categories = ["All", "Product", "Design", "Growth & Marketing", "Development", "Business"];
  const filteredCourses = courses.filter((c) => {
    const ms =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const mc = selectedCategory === "All" || c.category === selectedCategory;
    const mb = selectedBatch === "All" || c.batchId === selectedBatch;
    return ms && mc && mb;
  });

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((a, c) => a + (c.enrolledCount || 0), 0);

  // ── Avg Rating source number (unchanged business logic). numericValue
  // fed to <StatCard> is always a plain Number — passing the old
  // pre-formatted "4.8" / "—" string caused StatCard to render NaN on
  // other pages (Performance Analysis, Attendance), so the same fix
  // applies here: raw number, empty-state text moved into `change`.
  const avgRatingNum = courses.length
    ? courses.reduce((a, c) => a + (c.rating || 4.8), 0) / courses.length
    : 0;

  // ── stat cards through the shared <StatCard>, identical pattern to
  // the Attendance page (Golden Reference). ──
  const stats = [
    { label: "Total Courses", numericValue: totalCourses, change: `${totalCourses} created`, icon: BookOpen, colorKey: "blue" },
    { label: "Enrollments", numericValue: totalStudents, change: `${totalStudents} students`, icon: Users, colorKey: "green" },
    {
      label: "Avg Rating",
      numericValue: Number(avgRatingNum.toFixed(1)),
      change: courses.length ? "across all courses" : "No courses yet",
      icon: Star,
      colorKey: "orange",
    },
  ];

  const rightModeColor = rightMode === "create" ? "#34d399" : rightMode === "edit" ? "#22d3ee" : "#a78bfa";
  const rightModeBg = rightMode === "create" ? "rgba(52,211,153,.15)" : rightMode === "edit" ? "rgba(34,211,238,.15)" : "rgba(167,139,250,.15)";

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${t.border}`,
    background: t.pageBg,
    color: t.text,
    fontFamily: FF,
    fontSize: 12.5,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    fontSize: 9.5,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: t.textMuted,
    marginBottom: 4,
    fontFamily: FF,
  };
  const fieldStyle = { marginBottom: 10 };

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      {/* ═══ HERO — shared <Hero> component; same anatomy (eyebrow dot +
          label, title, subtitle, right-side badge cluster) and the same
          typography tokens (FONT_SIZE / LINE_HEIGHT / LETTER_SPACING)
          used on the Attendance page, so the two pages read as one
          product instead of two different type scales. ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
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
              Learning Management
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              color: ACCENT_PURPLE.base,
              margin: "0 0 6px",
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}
          >
            Course Management
          </h1>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <BookOpen size={12} /> Create, organize, and publish your courses
          </p>
        </div>

        <div className="hero-badges">
          <div
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: t.actBg, border: `1px solid ${t.actBorder}`,
              borderRadius: 12, padding: "8px 16px",
              fontSize: 11, fontWeight: 600, fontFamily: FONT_FAMILY, color: t.textSub,
            }}
          >
            <span>{totalCourses} course{totalCourses !== 1 ? "s" : ""}</span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <span>{batches.length} batch{batches.length !== 1 ? "es" : ""}</span>
          </div>

          {showSuccess && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(52,211,153,.08)",
                border: "1px solid rgba(52,211,153,.25)",
                borderRadius: RADIUS.pill,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                fontFamily: FONT_FAMILY,
                color: "#34d399",
              }}
            >
              <CheckCircle size={13} /> {successMessage}
            </div>
          )}

          <button
            className="tcm-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: RADIUS.button,
              border: `1px solid ${t.border}`,
              background: t.cardBg,
              color: t.textSub,
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
            }}
          >
            <Download size={13} /> Export
          </button>
          <button
            className="tcm-btn"
            onClick={() => {
              setRightMode("create");
              setRightOpen(true);
              setEditingCourse(null);
              setPreviewCourseId(null);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "9px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: FONT_FAMILY,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> New Course
          </button>
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard>, same .stat-grid class the
          Attendance page uses, so column counts and breakpoints inherit
          identically across both pages. ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} />
        ))}
      </div>

      {/* ═══ BATCH FILTER — pill row, same shape/weight as the Attendance
          page's toolbar pills; active state reuses the shared blue
          gradient already used for primary actions on both pages. ═══ */}
      <div className="tcm-batch-row">
        <button
          className="tcm-btn"
          style={{
            padding: "8px 16px",
            borderRadius: RADIUS.pill,
            fontFamily: FF,
            fontSize: 12,
            fontWeight: FONT_WEIGHT.bold,
            cursor: "pointer",
            background: selectedBatch === "All" ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : t.pillBg,
            color: selectedBatch === "All" ? "#fff" : t.textMuted,
            border: selectedBatch === "All" ? "none" : `1px solid ${t.pillBorder}`,
          }}
          onClick={() => setSelectedBatch("All")}
        >
          All Batches
        </button>
        {batches.map((b) => (
          <button
            key={b.id}
            className="tcm-btn"
            style={{
              padding: "8px 16px",
              borderRadius: RADIUS.pill,
              fontFamily: FF,
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              background: selectedBatch === b.id ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : t.pillBg,
              color: selectedBatch === b.id ? "#fff" : t.textMuted,
              border: selectedBatch === b.id ? "none" : `1px solid ${t.pillBorder}`,
            }}
            onClick={() => setSelectedBatch(b.id)}
          >
            Batch {b.id}
            {b.name ? ` — ${b.name}` : ""}
          </button>
        ))}
      </div>

      {/* ═══ 3-PANEL WORKSPACE — same card surface, radius, and shadow
          tokens (t.cardBg / t.border / RADIUS.standardCard / t.shadow)
          as every SectionCard on the Attendance page. Panel chrome is
          page-local since no resizable-panel component exists in the
          design system yet, but it borrows the surface tokens. ═══ */}
      <div
        ref={containerRef}
        className="tcm-panels"
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: RADIUS.standardCard,
          boxShadow: t.shadow,
          height: "calc(100vh - 340px)",
          minHeight: 420,
          marginBottom: 20,
        }}
      >
        {/* Panel 1 - categories */}
        <div className="tcm-p1" style={{ width: leftCollapsed ? 0 : 200, borderRight: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", borderBottom: `1px solid ${t.border}`, background: t.pageBg }}>
            <Layers size={13} style={{ color: "#22d3ee", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textMuted, fontFamily: FF }}>
              Categories
            </span>
          </div>
          <div className="tcm-p1-list">
            {categories.map((cat) => (
              <button
                key={cat}
                className="tcm-cat-btn"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 12px",
                  borderRadius: RADIUS.chip,
                  border: "none",
                  background: selectedCategory === cat ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "transparent",
                  fontFamily: FF,
                  fontSize: 12,
                  fontWeight: FONT_WEIGHT.bold,
                  color: selectedCategory === cat ? "#fff" : t.textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span>{cat}</span>
                {selectedCategory === cat && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.7)" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Resize 1 */}
        <div
          className="tcm-resize"
          style={{ cursor: "pointer", background: t.pageBg, borderLeft: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}` }}
          onClick={() => setLeftCollapsed((p) => !p)}
        >
          <div className="tcm-resize-pill" style={{ background: t.border }} />
        </div>

        {/* Panel 2 - course list */}
        <div className="tcm-p2">
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${t.border}`, background: t.pageBg }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }} />
              <input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 34px",
                  borderRadius: RADIUS.chip,
                  border: `1px solid ${t.border}`,
                  background: t.cardBg,
                  color: t.text,
                  fontFamily: FF,
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <span style={{ fontSize: 11, fontWeight: FONT_WEIGHT.bold, color: t.textMuted, whiteSpace: "nowrap", fontFamily: FF }}>
              {filteredCourses.length} found
            </span>
          </div>

          <div className="tcm-p2-grid">
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
                <div className="tcm-spin" style={{ border: `2px solid ${t.border}`, borderTopColor: "#22d3ee" }} />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: 10, textAlign: "center", color: t.textMuted, fontSize: 13, fontFamily: FF }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: t.pageBg, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={24} color={t.textMuted} />
                </div>
                <span>{searchQuery || selectedCategory !== "All" ? "No courses match your filters" : "No courses yet — create your first!"}</span>
              </div>
            ) : (
              <div className="tcm-grid">
                {filteredCourses.map((course) => {
                  const cs = catStyle(course.category);
                  const isActive = editingCourse?.id === course.id || previewCourseId === course.id;
                  return (
                    <div
                      key={course.id}
                      className="tcm-cc"
                      style={{
                        borderRadius: RADIUS.standardCard,
                        border: isActive ? "1px solid rgba(34,211,238,.4)" : `1px solid ${t.border}`,
                        background: isActive ? "rgba(34,211,238,.04)" : t.pageBg,
                        padding: 18,
                        boxShadow: isActive ? t.shadow : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 8px",
                            borderRadius: RADIUS.chip,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            background: "rgba(52,211,153,.10)",
                            color: "#34d399",
                            border: "1px solid rgba(52,211,153,.15)",
                            fontFamily: FF,
                          }}
                        >
                          <CheckCircle size={10} /> Published
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "3px 8px",
                            borderRadius: RADIUS.chip,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            background: cs.bg,
                            color: cs.color,
                            fontFamily: FF,
                          }}
                        >
                          {course.category}
                        </span>
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            padding: "3px 8px",
                            borderRadius: RADIUS.chip,
                            background: "rgba(34,211,238,.10)",
                            color: "#22d3ee",
                            border: "1px solid rgba(34,211,238,.15)",
                            fontFamily: FF,
                          }}
                        >
                          Batch {course.batchId}
                        </span>
                      </div>

                      <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, lineHeight: 1.35, margin: "0 0 4px", fontFamily: FF }}>
                        {course.title}
                      </p>
                      <p style={{ fontSize: 11, color: t.textMuted, display: "flex", alignItems: "center", gap: 4, margin: "0 0 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: FF }}>
                        <GraduationCap size={11} /> {course.ownerEmail}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: t.textMuted, padding: "10px 0", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, marginBottom: 10, fontFamily: FF }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> 8w</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={11} /> {course.enrolledCount || 0}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Star size={11} style={{ color: "#fb923c", fill: "#fb923c" }} /> {course.rating || 4.8}
                        </span>
                      </div>

                      {course.description && (
                        <p style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 10, fontFamily: FF }}>
                          {course.description}
                        </p>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 6 }}>
                        <button
                          className="tcm-ab"
                          onClick={() => openEdit(course)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: 7, borderRadius: RADIUS.chip, border: `1px solid ${t.border}`, background: t.cardBg, color: t.textMuted, fontFamily: FF, fontSize: 10, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                        <button
                          className="tcm-ab"
                          onClick={() => navigate(`/trainer/course/${course.id}/modules`)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: 7, borderRadius: RADIUS.chip, border: `1px solid ${t.border}`, background: t.cardBg, color: t.textMuted, fontFamily: FF, fontSize: 10, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
                        >
                          <BookOpen size={11} /> Modules
                        </button>
                        <button
                          className="tcm-ab"
                          onClick={() => {
                            setPreviewCourseId(course.id);
                            setRightMode("preview");
                            setRightOpen(true);
                            setEditingCourse(null);
                          }}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: 7, borderRadius: RADIUS.chip, border: `1px solid ${t.border}`, background: t.cardBg, color: t.textMuted, fontFamily: FF, fontSize: 10, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
                        >
                          <Eye size={11} /> Preview
                        </button>
                      </div>
                      <button
                        className="tcm-del"
                        onClick={() => handleDelete(course.id)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%", padding: 7, borderRadius: RADIUS.chip, border: `1px solid ${t.border}`, background: t.cardBg, color: t.textMuted, fontFamily: FF, fontSize: 10, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
                      >
                        <Trash2 size={11} /> Delete Course
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Resize 2 */}
        {rightOpen ? (
          <div className="tcm-resize" style={{ background: t.pageBg, borderLeft: `1px solid ${t.border}` }} onMouseDown={onMouseDown}>
            <div className="tcm-resize-pill" style={{ background: t.border }} />
          </div>
        ) : (
          <div
            className="tcm-resize"
            style={{ cursor: "pointer", background: t.pageBg, borderLeft: `1px solid ${t.border}` }}
            onClick={() => {
              setRightMode("create");
              setRightOpen(true);
              setEditingCourse(null);
              setPreviewCourseId(null);
            }}
          >
            <div className="tcm-resize-pill" style={{ background: t.border }} />
          </div>
        )}

        {/* Panel 3 */}
        {rightOpen && (
          <div className="tcm-p3" style={{ width: rightWidth, borderLeft: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: `1px solid ${t.border}`, background: t.pageBg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", background: rightModeBg, color: rightModeColor, flexShrink: 0 }}>
                  {rightMode === "create" ? <Plus size={14} /> : rightMode === "edit" ? <Edit2 size={14} /> : <Eye size={14} />}
                </div>
                <span style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FF }}>
                  {rightMode === "create" ? "New Course" : rightMode === "edit" ? "Edit Course" : "Course Preview"}
                </span>
              </div>
              <button
                onClick={() => {
                  setRightOpen(false);
                  setEditingCourse(null);
                  setPreviewCourseId(null);
                }}
                style={{ width: 28, height: 28, borderRadius: RADIUS.chip, border: `1px solid ${t.border}`, background: t.pageBg, color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={13} />
              </button>
            </div>

            <div className="tcm-p3-body">
              {rightMode === "preview" && previewCourseId && (() => {
                const c = courses.find((x) => x.id === previewCourseId);
                if (!c) return null;
                return (
                  <>
                    <div style={{ borderRadius: RADIUS.standardCard, padding: 20, color: "white", marginBottom: 14, background: "linear-gradient(135deg,#312e81,#6366f1)" }}>
                      <span style={{ display: "inline-flex", padding: "3px 9px", borderRadius: RADIUS.chip, fontSize: 10, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", marginBottom: 8, background: "rgba(255,255,255,.15)", color: "white", fontFamily: FF }}>
                        {c.category}
                      </span>
                      <h2 style={{ fontSize: 17, fontWeight: FONT_WEIGHT.bold, margin: "0 0 6px", lineHeight: 1.3, fontFamily: FF }}>{c.title}</h2>
                      <p style={{ fontSize: 11, opacity: 0.7, display: "flex", alignItems: "center", gap: 4, margin: 0, fontFamily: FF }}>
                        <GraduationCap size={12} /> {c.ownerEmail}
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
                      {[
                        { icon: <Clock size={13} />, val: "8 weeks", lbl: "Duration" },
                        { icon: <Users size={13} />, val: c.enrolledCount || 0, lbl: "Enrolled" },
                        { icon: <Star size={13} style={{ color: "#fb923c", fill: "#fb923c" }} />, val: c.rating || 4.8, lbl: "Rating" },
                      ].map((m, i) => (
                        <div key={i} style={{ borderRadius: RADIUS.chip, padding: 12, textAlign: "center", background: t.pageBg, border: `1px solid ${t.border}` }}>
                          <div style={{ display: "flex", justifyContent: "center", color: t.textMuted, marginBottom: 6 }}>{m.icon}</div>
                          <div style={{ fontSize: 14, fontWeight: FONT_WEIGHT.bold, color: t.text, marginBottom: 3, fontFamily: FF }}>{m.val}</div>
                          <div style={{ fontSize: 10, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", letterSpacing: "0.06em", color: t.textMuted, fontFamily: FF }}>{m.lbl}</div>
                        </div>
                      ))}
                    </div>
                    {c.description && (
                      <div style={{ borderRadius: RADIUS.chip, padding: 14, background: t.pageBg, border: `1px solid ${t.border}`, marginBottom: 14 }}>
                        <p style={{ fontSize: 10, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", letterSpacing: "0.08em", color: t.textMuted, margin: "0 0 6px", fontFamily: FF }}>About</p>
                        <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.6, margin: 0, fontFamily: FF }}>{c.description}</p>
                      </div>
                    )}
                    <button
                      className="tcm-sub"
                      style={{ width: "100%", justifyContent: "center", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, padding: 11, borderRadius: RADIUS.button, border: "none", background: "#22d3ee", color: "#0a0a0a", fontFamily: FF, fontSize: 13, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
                      onClick={() => openEdit(c)}
                    >
                      <Edit2 size={14} /> Edit This Course
                    </button>
                    <button
                      className="tcm-sub"
                      style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 6, padding: 11, borderRadius: RADIUS.button, border: "none", background: "#a78bfa", color: "#0a0a0a", fontFamily: FF, fontSize: 13, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
                      onClick={() => navigate(`/trainer/course/${c.id}/modules`)}
                    >
                      <BookOpen size={14} /> Manage Modules
                    </button>
                  </>
                );
              })()}

              {(rightMode === "create" || rightMode === "edit") && (
                <>
                  {rightMode === "create" && (
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Batch <span style={{ color: "#f87171" }}>*</span></label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={createForm.batchId}
                        onChange={(e) => setCreateForm({ ...createForm, batchId: e.target.value })}
                      >
                        <option value="">Select Batch…</option>
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>Batch {b.id}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Course Title <span style={{ color: "#f87171" }}>*</span></label>
                    <input
                      style={inputStyle}
                      placeholder="e.g., Advanced React Development"
                      value={rightMode === "create" ? createForm.title : editForm.title}
                      onChange={(e) =>
                        rightMode === "create"
                          ? setCreateForm({ ...createForm, title: e.target.value })
                          : setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Category <span style={{ color: "#f87171" }}>*</span></label>
                    <input
                      style={inputStyle}
                      placeholder="e.g., Development"
                      value={rightMode === "create" ? createForm.category : editForm.category}
                      onChange={(e) =>
                        rightMode === "create"
                          ? setCreateForm({ ...createForm, category: e.target.value })
                          : setEditForm({ ...editForm, category: e.target.value })
                      }
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      style={{ ...inputStyle, resize: "none" }}
                      rows={5}
                      placeholder="Describe what students will learn…"
                      value={rightMode === "create" ? createForm.description : editForm.description}
                      onChange={(e) =>
                        rightMode === "create"
                          ? setCreateForm({ ...createForm, description: e.target.value })
                          : setEditForm({ ...editForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="tcm-sub"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 11, borderRadius: RADIUS.button, border: "none", color: "#0a0a0a", fontFamily: FF, fontSize: 13, fontWeight: FONT_WEIGHT.bold, cursor: "pointer", background: rightMode === "create" ? "#34d399" : "#22d3ee" }}
                      onClick={rightMode === "create" ? createCourse : saveEdit}
                    >
                      <CheckCircle size={15} /> {rightMode === "create" ? "Create Course" : "Save Changes"}
                    </button>
                    <button
                      style={{ padding: "11px 16px", borderRadius: RADIUS.button, border: `1px solid ${t.border}`, background: t.pageBg, color: t.textMuted, fontFamily: FF, fontSize: 13, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
                      onClick={() => {
                        setRightOpen(false);
                        setEditingCourse(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TrainerCourseManagement;