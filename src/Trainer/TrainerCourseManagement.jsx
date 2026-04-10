// import axios from "axios";
// import {
//   BookOpen, CheckCircle, Clock, Download,
//   Edit2, Eye, GraduationCap, Plus, Search, Star,
//   Trash2, TrendingUp, Users, X, ChevronLeft, ChevronRight,
//   Layers, Sparkles, BarChart3, ArrowLeft,
// } from "lucide-react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// import { getTrainerBatches } from "@/services/batchService";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// /* ─── tiny helpers ─────────────────────────────────────────────────────────── */
// const grad = {
//   green:  "linear-gradient(135deg,#064e3b,#059669)",
//   blue:   "linear-gradient(135deg,#1e3a8a,#2563eb)",
//   amber:  "linear-gradient(135deg,#78350f,#d97706)",
//   indigo: "linear-gradient(135deg,#312e81,#6366f1)",
//   red:    "linear-gradient(135deg,#7f1d1d,#dc2626)",
// };

// const Field = ({ label, required, children }) => (
//   <div className="space-y-1.5">
//     <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
//       {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
//     </label>
//     {children}
//   </div>
// );

// const inputCls = `w-full rounded-xl px-3 py-2.5 text-sm
//   bg-white dark:bg-white/[0.04]
//   border border-slate-200 dark:border-white/[0.08]
//   text-slate-800 dark:text-slate-100
//   placeholder-slate-300 dark:placeholder-slate-600
//   focus:outline-none focus:ring-2 focus:ring-blue-500/25
//   focus:border-blue-400/60 dark:focus:border-blue-500/50
//   transition duration-150`;

// /* ─── DragHandle ──────────────────────────────────────────────────────────── */
// const DragHandle = ({ onMouseDown, direction = "both", onClick, hint }) => (
//   <div
//     onMouseDown={onMouseDown}
//     onClick={onClick}
//     title={hint}
//     className={`relative flex-shrink-0 w-[10px] flex items-center justify-center
//       ${onMouseDown ? "cursor-col-resize" : "cursor-pointer"}
//       group z-10 select-none
//       bg-slate-50 dark:bg-white/[0.025]
//       hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150`}
//   >
//     {/* thin rail */}
//     <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px
//       bg-slate-200 dark:bg-white/[0.07]
//       group-hover:bg-blue-300 dark:group-hover:bg-blue-700/60 transition-colors" />

//     {/* pill */}
//     <div className="absolute top-1/2 -translate-y-1/2
//       flex flex-col items-center gap-0.5
//       px-[5px] py-2 rounded-lg
//       bg-white dark:bg-[#1e3a5f]
//       border border-slate-200 dark:border-white/[0.14]
//       shadow-sm
//       group-hover:border-blue-400/70 dark:group-hover:border-blue-500/60
//       group-hover:shadow-blue-500/10 group-hover:shadow-md
//       transition-all duration-150">
//       {direction === "right" ? (
//         <ChevronLeft className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
//       ) : (
//         <>
//           <svg width="4" height="9" viewBox="0 0 4 9" fill="none">
//             <path d="M1 0.5L0 4.5L1 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
//               className="text-slate-400 group-hover:text-blue-500 transition-colors" />
//           </svg>
//           <div className="w-px h-2 bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-400 transition-colors rounded-full" />
//           <svg width="4" height="9" viewBox="0 0 4 9" fill="none">
//             <path d="M3 0.5L4 4.5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
//               className="text-slate-400 group-hover:text-blue-500 transition-colors" />
//           </svg>
//         </>
//       )}
//     </div>
//   </div>
// );

// /* ─── StatCard ────────────────────────────────────────────────────────────── */
// const StatCard = ({ icon, value, label, gradient, accent }) => (
//   <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
//     style={{ background: gradient }}>
//     <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10"
//       style={{ background: "white" }} />
//     <div className="absolute -right-1 -bottom-3 w-12 h-12 rounded-full opacity-10"
//       style={{ background: "white" }} />
//     <div className="relative flex flex-col gap-2">
//       <div className="w-8 h-8 rounded-xl flex items-center justify-center"
//         style={{ background: "rgba(255,255,255,0.18)" }}>
//         {icon}
//       </div>
//       <p className="text-3xl font-black tracking-tight">{value}</p>
//       <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/60">{label}</p>
//     </div>
//   </div>
// );

// /* ─── CategoryBadge ───────────────────────────────────────────────────────── */
// const categoryColor = {
//   Product:           { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300" },
//   Design:            { bg: "bg-pink-100 dark:bg-pink-900/30",     text: "text-pink-700 dark:text-pink-300" },
//   "Growth & Marketing": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
//   Development:       { bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-300" },
//   Business:          { bg: "bg-teal-100 dark:bg-teal-900/30",     text: "text-teal-700 dark:text-teal-300" },
//   _default:          { bg: "bg-slate-100 dark:bg-white/8",        text: "text-slate-600 dark:text-slate-400" },
// };
// const CatBadge = ({ cat }) => {
//   const c = categoryColor[cat] || categoryColor._default;
//   return (
//     <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
//       {cat}
//     </span>
//   );
// };

// /* ══════════════════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════ */
// const TrainerCourseManagement = () => {
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery]       = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [courses, setCourses]               = useState([]);
//   const [loading, setLoading]               = useState(true);
//   const [batches, setBatches]               = useState([]);
//   const [editingCourse, setEditingCourse]   = useState(null);
//   const [editForm, setEditForm]             = useState({ title: "", category: "", description: "" });

//   const [createForm, setCreateForm]         = useState({ title: "", category: "", description: "", batchId: "" });
//   const [showSuccess, setShowSuccess]       = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   /* preview state */
//   const [previewCourseId, setPreviewCourseId] = useState(null);

//   /* panel state */
//   const [leftCollapsed, setLeftCollapsed]   = useState(false);
//   const [rightOpen, setRightOpen]           = useState(false);
//   const [rightMode, setRightMode]           = useState("create");

//   const [rightWidth, setRightWidth]         = useState(340);
//   const isDragging  = useRef(false);
//   const containerRef = useRef(null);

//   /* drag ------------------------------------------------------------------ */
//   const onMouseDown = useCallback(() => {
//     isDragging.current = true;
//     document.body.style.cursor     = "col-resize";
//     document.body.style.userSelect = "none";
//   }, []);
//   const onMouseMove = useCallback((e) => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const fromRight = rect.right - e.clientX;
//     if (fromRight > 260 && fromRight < 580) setRightWidth(fromRight);
//   }, []);
//   const onMouseUp = useCallback(() => {
//     isDragging.current = false;
//     document.body.style.cursor     = "";
//     document.body.style.userSelect = "";
//   }, []);
//   useEffect(() => {
//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup",   onMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup",   onMouseUp);
//     };
//   }, [onMouseMove, onMouseUp]);

//   /* auth ------------------------------------------------------------------ */
//   const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });

//   /* fetch ----------------------------------------------------------------- */
//   useEffect(() => {
//     fetchCourses();
//     (async () => {
//       try { const res = await getTrainerBatches(); setBatches(res || []); }
//       catch (err) { console.error("Failed to load batches", err); }
//     })();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get(`${API}/courses/my`, { headers: authHeader() });
//       setCourses(res.data);
//     } catch (err) { console.error("Failed to load courses", err); }
//     finally { setLoading(false); }
//   };

//   const showSuccessNotification = (msg) => {
//     setSuccessMessage(msg);
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   /* CRUD ------------------------------------------------------------------ */
//   const createCourse = async (e) => {
//     e.preventDefault();
//     if (!createForm.title || !createForm.category || !createForm.batchId) {
//       alert("Please fill in all required fields"); return;
//     }
//     try {
//       await axios.post(`${API}/courses`, createForm, { headers: authHeader() });
//       setCreateForm({ title: "", category: "", description: "", batchId: "" });
//       setRightOpen(false);
//       fetchCourses();
//       showSuccessNotification("Course created successfully!");
//     } catch { alert("Failed to create course"); }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this course? This cannot be undone.")) return;
//     try {
//       await axios.delete(`${API}/courses/${id}`, { headers: authHeader() });
//       setCourses((prev) => prev.filter((c) => c.id !== id));
//       if (editingCourse?.id === id) { setEditingCourse(null); setRightOpen(false); }
//       if (previewCourseId === id) setPreviewCourseId(null);
//       showSuccessNotification("Course deleted.");
//     } catch { alert("Delete failed"); }
//   };

//   const openEdit = (course) => {
//     setEditingCourse(course);
//     setEditForm({ title: course.title, category: course.category, description: course.description || "" });
//     setRightMode("edit");
//     setRightOpen(true);
//     setPreviewCourseId(null);
//   };

//   const saveEdit = async () => {
//     try {
//       await axios.put(`${API}/courses/${editingCourse.id}`, editForm, { headers: authHeader() });
//       setEditingCourse(null);
//       setRightOpen(false);
//       fetchCourses();
//       showSuccessNotification("Course updated!");
//     } catch { alert("Update failed"); }
//   };

//   /* filter ---------------------------------------------------------------- */
//   const categories = ["All", "Product", "Design", "Growth & Marketing", "Development", "Business"];
//   const filteredCourses = courses.filter((c) => {
//     const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                         c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchCat    = selectedCategory === "All" || c.category === selectedCategory;
//     return matchSearch && matchCat;
//   });

//   /* stats ----------------------------------------------------------------- */
//   const totalCourses  = courses.length;
//   const totalStudents = courses.reduce((a, c) => a + (c.enrolledCount || 0), 0);
//   const avgRating     = courses.length
//     ? (courses.reduce((a, c) => a + (c.rating || 4.8), 0) / courses.length).toFixed(1)
//     : "—";

//   /* ══════════════════════════════════════════════════════════════════════
//      RENDER
//   ══════════════════════════════════════════════════════════════════════ */
//   return (
//     <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#0b1428] flex flex-col font-sans">

//       {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
//       <div className="px-6 pt-6 pb-4">
//         <div className="flex items-start justify-between">
//           {/* left */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20"
//               style={{ background: grad.blue }}>
//               <GraduationCap className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-0.5">
//                 Learning Management
//               </p>
//               <h1 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
//                 Course Management
//               </h1>
//             </div>
//           </div>

//           {/* right */}
//           <div className="flex items-center gap-2 pt-1">
//             <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
//               bg-white dark:bg-white/[0.06]
//               border border-slate-200 dark:border-white/[0.08]
//               text-slate-600 dark:text-slate-300
//               hover:bg-slate-50 dark:hover:bg-white/10 transition shadow-sm">
//               <Download className="w-3.5 h-3.5" /> Export
//             </button>
//             <button
//               onClick={() => { setRightMode("create"); setRightOpen(true); setEditingCourse(null); setPreviewCourseId(null); }}
//               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white shadow-md
//                 hover:opacity-90 active:scale-[0.98] transition"
//               style={{ background: grad.green }}>
//               <Plus className="w-3.5 h-3.5" /> New Course
//             </button>
//           </div>
//         </div>

//         {/* success toast */}
//         {showSuccess && (
//           <div className="mt-3 px-4 py-2.5 rounded-xl
//             bg-emerald-50 dark:bg-emerald-900/25
//             border border-emerald-200 dark:border-emerald-700/40
//             flex items-center gap-2 shadow-sm animate-pulse-once">
//             <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
//             <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{successMessage}</p>
//           </div>
//         )}
//       </div>

//       {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
//       <div className="px-6 pb-4 grid grid-cols-3 gap-4">
//         <StatCard icon={<BookOpen className="w-4 h-4" />}  value={totalCourses}  label="Total Courses"     gradient={grad.green} />
//         <StatCard icon={<Users    className="w-4 h-4" />}  value={totalStudents} label="Total Enrollments" gradient={grad.blue}  />
//         <StatCard icon={<Star     className="w-4 h-4" />}  value={avgRating}     label="Average Rating"    gradient={grad.amber} />
//       </div>

//       {/* ── 3-PANEL BODY ────────────────────────────────────────────────── */}
//       <div
//         ref={containerRef}
//         className="flex flex-1 mx-6 mb-6 overflow-hidden rounded-2xl
//           border border-slate-200/80 dark:border-white/[0.07]
//           bg-white dark:bg-[#111d35]
//           shadow-xl shadow-slate-200/60 dark:shadow-black/30"
//         style={{ height: "calc(100vh - 296px)", minHeight: "400px" }}
//       >

//         {/* ── PANEL 1 : Filters ─────────────────────────────────────────── */}
//         <div
//           className="flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300
//             border-r border-slate-100 dark:border-white/[0.06]"
//           style={{ width: leftCollapsed ? 0 : 210 }}
//         >
//           {/* header */}
//           <div className="flex items-center gap-2 px-4 py-3
//             border-b border-slate-100 dark:border-white/[0.06]
//             bg-slate-50/50 dark:bg-white/[0.02]">
//             <Layers className="w-3.5 h-3.5 text-blue-500" />
//             <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">
//               Categories
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
//             {categories.map((cat) => {
//               const active = selectedCategory === cat;
//               return (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`w-full text-left text-xs px-3 py-2.5 rounded-xl transition font-bold flex items-center justify-between
//                     ${active
//                       ? "text-white shadow-md"
//                       : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"}`}
//                   style={active ? { background: grad.blue } : {}}
//                 >
//                   <span className="truncate">{cat}</span>
//                   {active && (
//                     <span className="ml-1 w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* left collapse handle */}
//         <DragHandle
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           direction={leftCollapsed ? "right" : "both"}
//           hint={leftCollapsed ? "Expand filters" : "Collapse filters"}
//         />

//         {/* ── PANEL 2 : Course List ──────────────────────────────────────── */}
//         <div className="flex-1 flex flex-col overflow-hidden min-w-0">

//           {/* search */}
//           <div className="flex items-center gap-3 px-5 py-3
//             border-b border-slate-100 dark:border-white/[0.06]
//             bg-slate-50/30 dark:bg-white/[0.01]">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
//               <input
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={`${inputCls} pl-9`}
//               />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-widest
//               text-slate-400 dark:text-slate-600 whitespace-nowrap">
//               {filteredCourses.length} found
//             </span>
//           </div>

//           {/* grid */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {loading ? (
//               <div className="flex items-center justify-center py-20">
//                 <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : filteredCourses.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-20 gap-3">
//                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center
//                   bg-slate-100 dark:bg-white/[0.04]">
//                   <BookOpen className="w-7 h-7 text-slate-300 dark:text-slate-600" />
//                 </div>
//                 <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 text-center max-w-xs">
//                   {searchQuery || selectedCategory !== "All"
//                     ? "No courses match your filters"
//                     : "No courses yet — create your first!"}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
//                 {filteredCourses.map((course) => (
//                   <CourseCard
//                     key={course.id}
//                     course={course}
//                     onEdit={() => openEdit(course)}
//                     onModules={() => navigate(`/trainer/course/${course.id}/modules`)}
//                     onPreview={() => { setPreviewCourseId(course.id); setRightMode("preview"); setRightOpen(true); setEditingCourse(null); }}
//                     onDelete={() => handleDelete(course.id)}
//                     isActive={editingCourse?.id === course.id || previewCourseId === course.id}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── DRAG HANDLE between panel 2 & 3 ───────────────────────────── */}
//         {rightOpen ? (
//           <DragHandle onMouseDown={onMouseDown} direction="both" hint="Resize panel" />
//         ) : (
//           <DragHandle
//             onClick={() => { setRightMode("create"); setRightOpen(true); setEditingCourse(null); setPreviewCourseId(null); }}
//             direction="right"
//             hint="Open create panel"
//           />
//         )}

//         {/* ── PANEL 3 : Create / Edit / Preview ─────────────────────────── */}
//         {rightOpen && (
//           <div
//             className="flex-shrink-0 flex flex-col overflow-hidden
//               border-l border-slate-100 dark:border-white/[0.06]
//               bg-slate-50/30 dark:bg-white/[0.01]"
//             style={{ width: rightWidth }}
//           >
//             {/* panel header */}
//             <div className="flex items-center justify-between px-5 py-3
//               border-b border-slate-100 dark:border-white/[0.06]
//               bg-white/60 dark:bg-white/[0.03]">
//               <div className="flex items-center gap-2">
//                 <div className="w-7 h-7 rounded-xl flex items-center justify-center shadow-sm"
//                   style={{ background: rightMode === "create" ? grad.green : rightMode === "edit" ? grad.blue : grad.indigo }}>
//                   {rightMode === "create" && <Plus    className="w-3.5 h-3.5 text-white" />}
//                   {rightMode === "edit"   && <Edit2   className="w-3.5 h-3.5 text-white" />}
//                   {rightMode === "preview"&& <Eye     className="w-3.5 h-3.5 text-white" />}
//                 </div>
//                 <span className="text-sm font-black text-slate-700 dark:text-white">
//                   {rightMode === "create" ? "New Course" : rightMode === "edit" ? "Edit Course" : "Course Preview"}
//                 </span>
//               </div>
//               <button
//                 onClick={() => { setRightOpen(false); setEditingCourse(null); setPreviewCourseId(null); }}
//                 className="w-7 h-7 rounded-xl flex items-center justify-center
//                   hover:bg-slate-100 dark:hover:bg-white/10
//                   text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             </div>

//             {/* panel body */}
//             <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

//               {/* ── PREVIEW MODE ─── */}
//               {rightMode === "preview" && previewCourseId && (() => {
//                 const c = courses.find(x => x.id === previewCourseId);
//                 if (!c) return null;
//                 return (
//                   <div className="space-y-5">
//                     {/* hero */}
//                     <div className="rounded-2xl p-5 text-white space-y-2 shadow-lg"
//                       style={{ background: grad.indigo }}>
//                       <CatBadge cat={c.category} />
//                       <h2 className="text-lg font-black leading-snug mt-2">{c.title}</h2>
//                       <p className="text-white/60 text-xs flex items-center gap-1">
//                         <GraduationCap className="w-3 h-3" /> {c.ownerEmail}
//                       </p>
//                     </div>

//                     {/* meta row */}
//                     <div className="grid grid-cols-3 gap-2">
//                       {[
//                         { icon: <Clock className="w-3.5 h-3.5" />,  val: "8 weeks",             label: "Duration" },
//                         { icon: <Users className="w-3.5 h-3.5" />,  val: c.enrolledCount || 0,   label: "Enrolled" },
//                         { icon: <Star  className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />, val: c.rating || 4.8, label: "Rating" },
//                       ].map((m, i) => (
//                         <div key={i} className="rounded-xl p-3 text-center
//                           bg-white dark:bg-white/[0.04]
//                           border border-slate-100 dark:border-white/[0.06] shadow-sm">
//                           <div className="flex justify-center mb-1 text-slate-400">{m.icon}</div>
//                           <p className="text-sm font-black text-slate-800 dark:text-white">{m.val}</p>
//                           <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{m.label}</p>
//                         </div>
//                       ))}
//                     </div>

//                     {/* description */}
//                     {c.description && (
//                       <div className="rounded-xl p-4
//                         bg-white dark:bg-white/[0.04]
//                         border border-slate-100 dark:border-white/[0.06]">
//                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">About</p>
//                         <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.description}</p>
//                       </div>
//                     )}

//                     {/* quick actions */}
//                     <div className="space-y-2 pt-1">
//                       <button onClick={() => openEdit(c)}
//                         className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
//                         style={{ background: grad.blue }}>
//                         <Edit2 className="w-4 h-4" /> Edit This Course
//                       </button>
//                       <button onClick={() => navigate(`/trainer/course/${c.id}/modules`)}
//                         className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
//                         style={{ background: grad.indigo }}>
//                         <BookOpen className="w-4 h-4" /> Manage Modules
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })()}

//               {/* ── CREATE / EDIT FORM ─── */}
//               {(rightMode === "create" || rightMode === "edit") && (
//                 <>
//                   {rightMode === "create" && (
//                     <Field label="Batch" required>
//                       <select
//                         value={createForm.batchId}
//                         onChange={(e) => setCreateForm({ ...createForm, batchId: e.target.value })}
//                         className={inputCls}
//                         required
//                       >
//                         <option value="">Select Batch…</option>
//                         {batches.map((b) => (
//                           <option key={b.id} value={b.id}>Batch {b.id}</option>
//                         ))}
//                       </select>
//                     </Field>
//                   )}

//                   <Field label="Course Title" required>
//                     <input
//                       placeholder="e.g., Advanced React Development"
//                       value={rightMode === "create" ? createForm.title : editForm.title}
//                       onChange={(e) => rightMode === "create"
//                         ? setCreateForm({ ...createForm, title: e.target.value })
//                         : setEditForm({ ...editForm, title: e.target.value })}
//                       className={inputCls}
//                     />
//                   </Field>

//                   <Field label="Category" required>
//                     <input
//                       placeholder="e.g., Development"
//                       value={rightMode === "create" ? createForm.category : editForm.category}
//                       onChange={(e) => rightMode === "create"
//                         ? setCreateForm({ ...createForm, category: e.target.value })
//                         : setEditForm({ ...editForm, category: e.target.value })}
//                       className={inputCls}
//                     />
//                   </Field>

//                   <Field label="Description">
//                     <textarea
//                       rows={5}
//                       placeholder="Describe what students will learn…"
//                       value={rightMode === "create" ? createForm.description : editForm.description}
//                       onChange={(e) => rightMode === "create"
//                         ? setCreateForm({ ...createForm, description: e.target.value })
//                         : setEditForm({ ...editForm, description: e.target.value })}
//                       className={`${inputCls} resize-none`}
//                     />
//                   </Field>

//                   {/* submit row */}
//                   <div className="flex gap-2 pt-1">
//                     <button
//                       onClick={rightMode === "create" ? createCourse : saveEdit}
//                       className="flex-1 flex items-center justify-center gap-2
//                         py-2.5 rounded-xl text-sm font-black text-white shadow-md
//                         hover:opacity-90 active:scale-[0.98] transition"
//                       style={{ background: rightMode === "create" ? grad.green : grad.blue }}
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                       {rightMode === "create" ? "Create Course" : "Save Changes"}
//                     </button>
//                     <button
//                       onClick={() => { setRightOpen(false); setEditingCourse(null); }}
//                       className="px-4 py-2.5 rounded-xl text-sm font-bold
//                         bg-slate-100 dark:bg-white/[0.06]
//                         border border-slate-200 dark:border-white/[0.08]
//                         text-slate-600 dark:text-slate-300
//                         hover:bg-slate-200 dark:hover:bg-white/10 transition"
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

// /* ══════════════════════════════════════════════════════════════════════════
//    COURSE CARD (extracted for clarity)
// ══════════════════════════════════════════════════════════════════════════ */
// const CourseCard = ({ course, onEdit, onModules, onPreview, onDelete, isActive }) => (
//   <div
//     className={`rounded-2xl border transition-all duration-200 p-4 space-y-3 group flex flex-col
//       ${isActive
//         ? "border-blue-400/60 dark:border-blue-500/50 shadow-lg shadow-blue-500/10 bg-blue-50/40 dark:bg-blue-900/10"
//         : "border-slate-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-md"
//       }`}
//   >
//     {/* header */}
//     <div className="flex items-center justify-between gap-2">
//       <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest
//         px-2 py-1 rounded-full
//         bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
//         <CheckCircle className="w-2.5 h-2.5" /> Published
//       </span>
//       <CatBadge cat={course.category} />
//     </div>

//     {/* title */}
//     <div className="flex-1">
//       <h3 className="text-sm font-black text-slate-800 dark:text-white line-clamp-2
//         group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
//         {course.title}
//       </h3>
//       <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 truncate">
//         <GraduationCap className="w-3 h-3 flex-shrink-0" /> {course.ownerEmail}
//       </p>
//     </div>

//     {/* meta strip */}
//     <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500
//       pt-2 border-t border-slate-100 dark:border-white/[0.05]">
//       <span className="flex items-center gap-1"><Clock className="w-3 h-3" />8w</span>
//       <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledCount || 0}</span>
//       <span className="flex items-center gap-1">
//         <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{course.rating || 4.8}
//       </span>
//     </div>

//     {/* description */}
//     {course.description && (
//       <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
//         {course.description}
//       </p>
//     )}

//     {/* action buttons — 3 in a row + delete full width */}
//     <div className="space-y-1.5 pt-1">
//       <div className="grid grid-cols-3 gap-1.5">
//         {[
//           { label: "Edit",    icon: <Edit2    className="w-3 h-3" />, onClick: onEdit,    hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700" },
//           { label: "Modules", icon: <BookOpen className="w-3 h-3" />, onClick: onModules, hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300" },
//           { label: "Preview", icon: <Eye      className="w-3 h-3" />, onClick: onPreview, hover: "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300" },
//         ].map((btn, i) => (
//           <button key={i} onClick={btn.onClick}
//             className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-black
//               border border-slate-200 dark:border-white/[0.08]
//               bg-white dark:bg-transparent
//               text-slate-500 dark:text-slate-400
//               transition ${btn.hover}`}>
//             {btn.icon} {btn.label}
//           </button>
//         ))}
//       </div>

//       <button onClick={onDelete}
//         className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[10px] font-black
//           border border-slate-200 dark:border-white/[0.08]
//           bg-white dark:bg-transparent
//           text-slate-500 dark:text-slate-400
//           hover:bg-red-50 dark:hover:bg-red-900/20
//           hover:text-red-600 dark:hover:text-red-400
//           hover:border-red-300 dark:hover:border-red-700/50 transition">
//         <Trash2 className="w-3 h-3" /> Delete Course
//       </button>
//     </div>
//   </div>
// );

// export default TrainerCourseManagement;































import axios from "axios";
import {
  BookOpen, CheckCircle, Clock, Download,
  Edit2, Eye, GraduationCap, Plus, Search, Star,
  Trash2, Users, X, ChevronLeft, ChevronRight, Layers,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "@/services/batchService";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.tc-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.tc{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);display:flex;flex-direction:column;}
.tc-top{padding:20px 24px;}
.tc-toprow{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.tc-tl{display:flex;align-items:center;gap:12px;}
.tc-tl-ico{width:44px;height:44px;border-radius:13px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.tc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--mu);margin-bottom:3px;}
.tc-h1{font-size:20px;font-weight:800;color:var(--tx);margin:0;}
.tc-tr{display:flex;align-items:center;gap:8px;}
.tc-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:12px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;border:none;white-space:nowrap;}
.tc-btn:hover{opacity:.87;transform:translateY(-1px);}
.tc-btn-out{background:var(--card);border:1px solid var(--bd)!important;color:var(--mu);}
.tc-btn-out:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.tc-btn-green{background:var(--c3);color:#0a0a0a;}
.tc-toast{padding:11px 16px;border-radius:13px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.20);display:flex;align-items:center;gap:8px;color:var(--c3);font-size:13px;font-weight:600;}
.tc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 24px 16px;}
.tc-stat{border-radius:var(--r);padding:18px 20px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh);}
.tc-stat::before{content:"";position:absolute;right:-12px;top:-12px;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.10);}
.tc-sico{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:8px;}
.tc-sv{font-size:26px;font-weight:800;margin-bottom:3px;}
.tc-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.65;}
.tc-panels{display:flex;flex:1;margin:0 24px 24px;border-radius:var(--r);border:1px solid var(--bd);background:var(--card);box-shadow:var(--shl);overflow:hidden;}
.tc-p1{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--bd);transition:width .3s;}
.tc-p1-head{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.tc-p1-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);}
.tc-p1-list{flex:1;overflow-y:auto;padding:8px;}
.tc-cat-btn{width:100%;text-align:left;padding:9px 12px;border-radius:11px;border:none;background:transparent;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;color:var(--mu);cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .15s;}
.tc-cat-btn:hover{background:rgba(34,211,238,.06);color:var(--c1);}
.tc-cat-btn.on{color:white;}
.tc-resize{width:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize;background:var(--bg);border-left:1px solid var(--bd);border-right:1px solid var(--bd);transition:background .2s;}
.tc-resize:hover{background:rgba(34,211,238,.08);}
.tc-resize-pill{width:3px;height:40px;border-radius:4px;background:var(--bd);transition:background .2s;}
.tc-resize:hover .tc-resize-pill{background:var(--c1);}
.tc-p2{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.tc-p2-search{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.tc-sinput{position:relative;flex:1;}
.tc-sinput svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--mu);pointer-events:none;}
.tc-sinput input{width:100%;padding:9px 12px 9px 34px;border-radius:11px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;box-sizing:border-box;transition:border-color .2s;}
.tc-sinput input:focus{border-color:var(--c1);}
.tc-sinput input::placeholder{color:var(--mu);}
.tc-found{font-size:11px;font-weight:700;color:var(--mu);white-space:nowrap;}
.tc-p2-grid{flex:1;overflow-y:auto;padding:16px;}
.tc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
.tc-cc{border-radius:16px;border:1px solid var(--bd);background:var(--bg);padding:18px;display:flex;flex-direction:column;gap:0;transition:all .2s;}
.tc-cc:hover{border-color:rgba(34,211,238,.25);box-shadow:var(--sh);}
.tc-cc.on{border-color:rgba(34,211,238,.40);background:rgba(34,211,238,.03);box-shadow:var(--sh);}
.tc-cc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.tc-pub-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;background:rgba(52,211,153,.10);color:var(--c3);border:1px solid rgba(52,211,153,.15);}
.tc-cat-tag{display:inline-flex;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;}
.tc-ct{font-size:13px;font-weight:800;color:var(--tx);line-height:1.35;margin:0 0 4px;}
.tc-cc:hover .tc-ct{color:var(--c1);}
.tc-ce{font-size:11px;color:var(--mu);display:flex;align-items:center;gap:4px;margin:0 0 12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.tc-meta{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--mu);padding:10px 0;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);margin-bottom:10px;}
.tc-mi{display:flex;align-items:center;gap:4px;}
.tc-desc{font-size:11px;color:var(--mu);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px;}
.tc-3btn{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px;}
.tc-ab{display:flex;align-items:center;justify-content:center;gap:4px;padding:7px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--mu);font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;cursor:pointer;transition:all .15s;}
.tc-ab:hover{border-color:rgba(34,211,238,.30);color:var(--c1);background:rgba(34,211,238,.04);}
.tc-del{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;padding:7px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--mu);font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;cursor:pointer;transition:all .15s;}
.tc-del:hover{border-color:rgba(248,113,113,.30);color:var(--cr);background:rgba(248,113,113,.04);}
.tc-p3{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-left:1px solid var(--bd);}
.tc-p3-head{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--bd);background:var(--bg);}
.tc-p3-title-row{display:flex;align-items:center;gap:8px;}
.tc-p3-ico{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.tc-p3-title{font-size:13px;font-weight:800;color:var(--tx);}
.tc-xbtn{width:28px;height:28px;border-radius:8px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.tc-xbtn:hover{background:rgba(248,113,113,.10);color:var(--cr);}
.tc-p3-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;}
.tc-field label{display:block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--mu);margin-bottom:6px;}
.tc-field label span{color:var(--cr);}
.tc-inp{width:100%;padding:10px 13px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.tc-inp:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.tc-inp::placeholder{color:var(--mu);}
.tc-submit-row{display:flex;gap:8px;}
.tc-sub{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;border-radius:12px;border:none;color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.tc-sub:hover{opacity:.87;transform:translateY(-1px);}
.tc-can{padding:11px 16px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;}
.tc-can:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.tc-prev-hero{border-radius:16px;padding:20px;color:white;margin-bottom:14px;}
.tc-prev-type{display:inline-flex;padding:3px 9px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;margin-bottom:8px;}
.tc-prev-h2{font-size:17px;font-weight:800;margin:0 0 6px;line-height:1.3;}
.tc-prev-sub{font-size:11px;opacity:.65;display:flex;align-items:center;gap:4px;margin:0;}
.tc-prev-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
.tc-prev-mc{border-radius:12px;padding:12px;text-align:center;background:var(--bg);border:1px solid var(--bd);}
.tc-prev-mv{font-size:14px;font-weight:800;color:var(--tx);margin-bottom:3px;}
.tc-prev-ml{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mu);}
.tc-prev-about{border-radius:12px;padding:14px;background:var(--bg);border:1px solid var(--bd);margin-bottom:14px;}
.tc-prev-at{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);margin:0 0 6px;}
.tc-prev-ad{font-size:13px;color:var(--mu);line-height:1.6;margin:0;}
.tc-spin{width:20px;height:20px;border:2px solid rgba(0,0,0,.2);border-top-color:rgba(0,0,0,.7);border-radius:50%;animation:tc-spin .8s linear infinite;}
@keyframes tc-spin{to{transform:rotate(360deg)}}
.tc-loader{display:flex;align-items:center;justify-content:center;padding:60px;}
.tc-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:10px;text-align:center;color:var(--mu);font-size:13px;}
.tc-empty-ico{width:52px;height:52px;border-radius:15px;background:var(--bg);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;color:var(--mu);}
`;
if(!document.getElementById("tc-st")){const t=document.createElement("style");t.id="tc-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const CAT_COLORS={
  Product:{bg:"rgba(167,139,250,.10)",color:"var(--c4)"},
  Design:{bg:"rgba(251,146,60,.10)",color:"var(--c2)"},
  "Growth & Marketing":{bg:"rgba(34,211,238,.10)",color:"var(--c1)"},
  Development:{bg:"rgba(52,211,153,.10)",color:"var(--c3)"},
  Business:{bg:"rgba(248,113,113,.10)",color:"var(--cr)"},
  _d:{bg:"rgba(100,116,139,.10)",color:"var(--mu)"},
};
const catStyle=c=>CAT_COLORS[c]||CAT_COLORS._d;

const STAT_GRADS=["linear-gradient(135deg,#064e3b,#059669)","linear-gradient(135deg,#1e3a8a,#2563eb)","linear-gradient(135deg,#78350f,#d97706)"];

const TrainerCourseManagement = () => {
  const navigate = useNavigate();
  const [searchQuery,setSearchQuery]=useState("");
  const [selectedCategory,setSelectedCategory]=useState("All");
  const [courses,setCourses]=useState([]);
  const [loading,setLoading]=useState(true);
  const [batches,setBatches]=useState([]);
  const [editingCourse,setEditingCourse]=useState(null);
  const [editForm,setEditForm]=useState({title:"",category:"",description:""});
  const [createForm,setCreateForm]=useState({title:"",category:"",description:"",batchId:""});
  const [showSuccess,setShowSuccess]=useState(false);
  const [successMessage,setSuccessMessage]=useState("");
  const [previewCourseId,setPreviewCourseId]=useState(null);
  const [leftCollapsed,setLeftCollapsed]=useState(false);
  const [rightOpen,setRightOpen]=useState(false);
  const [rightMode,setRightMode]=useState("create");
  const [rightWidth,setRightWidth]=useState(320);
  const [dark,setDark]=useState(isDark);
  const isDragging=useRef(false);
  const containerRef=useRef(null);

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  const onMouseDown=useCallback(()=>{isDragging.current=true;document.body.style.cursor="col-resize";document.body.style.userSelect="none";},[]);
  const onMouseMove=useCallback(e=>{
    if(!isDragging.current||!containerRef.current)return;
    const rect=containerRef.current.getBoundingClientRect();
    const fr=rect.right-e.clientX;
    if(fr>240&&fr<560)setRightWidth(fr);
  },[]);
  const onMouseUp=useCallback(()=>{isDragging.current=false;document.body.style.cursor="";document.body.style.userSelect="";},[]);
  useEffect(()=>{
    window.addEventListener("mousemove",onMouseMove);window.addEventListener("mouseup",onMouseUp);
    return()=>{window.removeEventListener("mousemove",onMouseMove);window.removeEventListener("mouseup",onMouseUp);};
  },[onMouseMove,onMouseUp]);

  const authHeader=()=>({Authorization:`Bearer ${localStorage.getItem("lms_token")}`});

  useEffect(()=>{
    fetchCourses();
    (async()=>{try{const r=await getTrainerBatches();setBatches(r||[]);}catch(e){console.error(e);}})();
  },[]);

  const fetchCourses=async()=>{
    try{const r=await axios.get(`${API}/courses/my`,{headers:authHeader()});setCourses(r.data);}
    catch(e){console.error(e);}finally{setLoading(false);}
  };

  const showNotif=msg=>{setSuccessMessage(msg);setShowSuccess(true);setTimeout(()=>setShowSuccess(false),3000);};

  const createCourse=async e=>{
    e.preventDefault();
    if(!createForm.title||!createForm.category||!createForm.batchId){alert("Please fill in all required fields");return;}
    try{await axios.post(`${API}/courses`,createForm,{headers:authHeader()});setCreateForm({title:"",category:"",description:"",batchId:""});setRightOpen(false);fetchCourses();showNotif("Course created successfully!");}
    catch{alert("Failed to create course");}
  };

  const handleDelete=async id=>{
    if(!window.confirm("Delete this course?"))return;
    try{await axios.delete(`${API}/courses/${id}`,{headers:authHeader()});setCourses(p=>p.filter(c=>c.id!==id));if(editingCourse?.id===id){setEditingCourse(null);setRightOpen(false);}if(previewCourseId===id)setPreviewCourseId(null);showNotif("Course deleted.");}
    catch{alert("Delete failed");}
  };

  const openEdit=course=>{setEditingCourse(course);setEditForm({title:course.title,category:course.category,description:course.description||""});setRightMode("edit");setRightOpen(true);setPreviewCourseId(null);};

  const saveEdit=async()=>{
    try{await axios.put(`${API}/courses/${editingCourse.id}`,editForm,{headers:authHeader()});setEditingCourse(null);setRightOpen(false);fetchCourses();showNotif("Course updated!");}
    catch{alert("Update failed");}
  };

  const categories=["All","Product","Design","Growth & Marketing","Development","Business"];
  const filteredCourses=courses.filter(c=>{
    const ms=c.title.toLowerCase().includes(searchQuery.toLowerCase())||c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const mc=selectedCategory==="All"||c.category===selectedCategory;
    return ms&&mc;
  });

  const totalCourses=courses.length;
  const totalStudents=courses.reduce((a,c)=>a+(c.enrolledCount||0),0);
  const avgRating=courses.length?(courses.reduce((a,c)=>a+(c.rating||4.8),0)/courses.length).toFixed(1):"—";

  const statCards=[
    {icon:<BookOpen size={16}/>,value:totalCourses,label:"Total Courses",grad:STAT_GRADS[0]},
    {icon:<Users size={16}/>,value:totalStudents,label:"Enrollments",grad:STAT_GRADS[1]},
    {icon:<Star size={16}/>,value:avgRating,label:"Avg Rating",grad:STAT_GRADS[2]},
  ];

  const rightModeColor=rightMode==="create"?"var(--c3)":rightMode==="edit"?"var(--c1)":"var(--c4)";

  return(
    <div className={`tc${dark?" tc-dk":""}`}>
      <div className="tc-top">
        <div className="tc-toprow">
          <div className="tc-tl">
            <div className="tc-tl-ico"><GraduationCap size={22}/></div>
            <div>
              <div className="tc-label">Learning Management</div>
              <h1 className="tc-h1">Course Management</h1>
            </div>
          </div>
          <div className="tc-tr">
            <button className="tc-btn tc-btn-out"><Download size={13}/> Export</button>
            <button className="tc-btn tc-btn-green" onClick={()=>{setRightMode("create");setRightOpen(true);setEditingCourse(null);setPreviewCourseId(null);}}>
              <Plus size={13}/> New Course
            </button>
          </div>
        </div>
        {showSuccess&&<div className="tc-toast"><CheckCircle size={15}/>{successMessage}</div>}
      </div>

      <div className="tc-stats">
        {statCards.map((s,i)=>(
          <div key={i} className="tc-stat" style={{background:s.grad}}>
            <div className="tc-sico">{s.icon}</div>
            <div className="tc-sv">{s.value}</div>
            <div className="tc-sl">{s.label}</div>
          </div>
        ))}
      </div>

      <div ref={containerRef} className="tc-panels" style={{height:"calc(100vh - 280px)",minHeight:380}}>

        {/* Panel 1 - filters */}
        <div className="tc-p1" style={{width:leftCollapsed?0:196}}>
          <div className="tc-p1-head">
            <Layers size={13} style={{color:"var(--c1)",flexShrink:0}}/>
            <span className="tc-p1-title">Categories</span>
          </div>
          <div className="tc-p1-list">
            {categories.map(cat=>(
              <button key={cat} className={`tc-cat-btn${selectedCategory===cat?" on":""}`}
                style={selectedCategory===cat?{background:"linear-gradient(135deg,#1e3a8a,#2563eb)"}:{}}
                onClick={()=>setSelectedCategory(cat)}>
                <span>{cat}</span>
                {selectedCategory===cat&&<span style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.7)"}}/>}
              </button>
            ))}
          </div>
        </div>

        {/* Resize 1 */}
        <div className="tc-resize" style={{cursor:"pointer"}} onClick={()=>setLeftCollapsed(p=>!p)}>
          <div className="tc-resize-pill"/>
        </div>

        {/* Panel 2 - course list */}
        <div className="tc-p2">
          <div className="tc-p2-search">
            <div className="tc-sinput">
              <Search size={13}/>
              <input placeholder="Search courses..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
            </div>
            <span className="tc-found">{filteredCourses.length} found</span>
          </div>
          <div className="tc-p2-grid">
            {loading?(
              <div className="tc-loader"><div className="tc-spin"/></div>
            ):filteredCourses.length===0?(
              <div className="tc-empty-state">
                <div className="tc-empty-ico"><BookOpen size={24}/></div>
                <span>{searchQuery||selectedCategory!=="All"?"No courses match your filters":"No courses yet — create your first!"}</span>
              </div>
            ):(
              <div className="tc-grid">
                {filteredCourses.map(course=>{
                  const cs=catStyle(course.category);
                  const isActive=editingCourse?.id===course.id||previewCourseId===course.id;
                  return(
                    <div key={course.id} className={`tc-cc${isActive?" on":""}`}>
                      <div className="tc-cc-head">
                        <span className="tc-pub-tag"><CheckCircle size={10}/> Published</span>
                        <span className="tc-cat-tag" style={{background:cs.bg,color:cs.color}}>{course.category}</span>
                      </div>
                      <p className="tc-ct">{course.title}</p>
                      <p className="tc-ce"><GraduationCap size={11}/>{course.ownerEmail}</p>
                      <div className="tc-meta">
                        <span className="tc-mi"><Clock size={11}/>8w</span>
                        <span className="tc-mi"><Users size={11}/>{course.enrolledCount||0}</span>
                        <span className="tc-mi"><Star size={11} style={{color:"var(--c2)",fill:"var(--c2)"}}/>{course.rating||4.8}</span>
                      </div>
                      {course.description&&<p className="tc-desc">{course.description}</p>}
                      <div className="tc-3btn">
                        <button className="tc-ab" onClick={()=>openEdit(course)}><Edit2 size={11}/> Edit</button>
                        <button className="tc-ab" onClick={()=>navigate(`/trainer/course/${course.id}/modules`)}><BookOpen size={11}/> Modules</button>
                        <button className="tc-ab" onClick={()=>{setPreviewCourseId(course.id);setRightMode("preview");setRightOpen(true);setEditingCourse(null);}}><Eye size={11}/> Preview</button>
                      </div>
                      <button className="tc-del" onClick={()=>handleDelete(course.id)}><Trash2 size={11}/> Delete Course</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Resize 2 */}
        {rightOpen?(
          <div className="tc-resize" onMouseDown={onMouseDown}><div className="tc-resize-pill"/></div>
        ):(
          <div className="tc-resize" style={{cursor:"pointer"}} onClick={()=>{setRightMode("create");setRightOpen(true);setEditingCourse(null);setPreviewCourseId(null);}}>
            <div className="tc-resize-pill"/>
          </div>
        )}

        {/* Panel 3 */}
        {rightOpen&&(
          <div className="tc-p3" style={{width:rightWidth}}>
            <div className="tc-p3-head">
              <div className="tc-p3-title-row">
                <div className="tc-p3-ico" style={{background:`rgba(${rightMode==="create"?"52,211,153":rightMode==="edit"?"34,211,238":"167,139,250"},.15)`,color:rightModeColor}}>
                  {rightMode==="create"?<Plus size={14}/>:rightMode==="edit"?<Edit2 size={14}/>:<Eye size={14}/>}
                </div>
                <span className="tc-p3-title">{rightMode==="create"?"New Course":rightMode==="edit"?"Edit Course":"Course Preview"}</span>
              </div>
              <button className="tc-xbtn" onClick={()=>{setRightOpen(false);setEditingCourse(null);setPreviewCourseId(null);}}><X size={13}/></button>
            </div>

            <div className="tc-p3-body">
              {rightMode==="preview"&&previewCourseId&&(()=>{
                const c=courses.find(x=>x.id===previewCourseId);
                if(!c)return null;
                const cs=catStyle(c.category);
                return(
                  <>
                    <div className="tc-prev-hero" style={{background:"linear-gradient(135deg,#312e81,#6366f1)"}}>
                      <span className="tc-prev-type" style={{background:"rgba(255,255,255,.15)",color:"white"}}>{c.category}</span>
                      <h2 className="tc-prev-h2">{c.title}</h2>
                      <p className="tc-prev-sub"><GraduationCap size={12}/> {c.ownerEmail}</p>
                    </div>
                    <div className="tc-prev-meta">
                      {[{icon:<Clock size={13}/>,val:"8 weeks",lbl:"Duration"},{icon:<Users size={13}/>,val:c.enrolledCount||0,lbl:"Enrolled"},{icon:<Star size={13} style={{color:"var(--c2)",fill:"var(--c2)"}}/>,val:c.rating||4.8,lbl:"Rating"}].map((m,i)=>(
                        <div key={i} className="tc-prev-mc">
                          <div style={{display:"flex",justifyContent:"center",color:"var(--mu)",marginBottom:6}}>{m.icon}</div>
                          <div className="tc-prev-mv">{m.val}</div>
                          <div className="tc-prev-ml">{m.lbl}</div>
                        </div>
                      ))}
                    </div>
                    {c.description&&<div className="tc-prev-about"><p className="tc-prev-at">About</p><p className="tc-prev-ad">{c.description}</p></div>}
                    <button className="tc-btn" style={{width:"100%",justifyContent:"center",marginBottom:8,background:"var(--c1)",color:"#0a0a0a"}} onClick={()=>openEdit(c)}><Edit2 size={14}/> Edit This Course</button>
                    <button className="tc-btn" style={{width:"100%",justifyContent:"center",background:"var(--c4)",color:"#0a0a0a"}} onClick={()=>navigate(`/trainer/course/${c.id}/modules`)}><BookOpen size={14}/> Manage Modules</button>
                  </>
                );
              })()}

              {(rightMode==="create"||rightMode==="edit")&&(
                <>
                  {rightMode==="create"&&(
                    <div className="tc-field">
                      <label>Batch <span>*</span></label>
                      <select className="tc-inp" value={createForm.batchId} onChange={e=>setCreateForm({...createForm,batchId:e.target.value})}>
                        <option value="">Select Batch…</option>
                        {batches.map(b=><option key={b.id} value={b.id}>Batch {b.id}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="tc-field">
                    <label>Course Title <span>*</span></label>
                    <input className="tc-inp" placeholder="e.g., Advanced React Development"
                      value={rightMode==="create"?createForm.title:editForm.title}
                      onChange={e=>rightMode==="create"?setCreateForm({...createForm,title:e.target.value}):setEditForm({...editForm,title:e.target.value})}/>
                  </div>
                  <div className="tc-field">
                    <label>Category <span>*</span></label>
                    <input className="tc-inp" placeholder="e.g., Development"
                      value={rightMode==="create"?createForm.category:editForm.category}
                      onChange={e=>rightMode==="create"?setCreateForm({...createForm,category:e.target.value}):setEditForm({...editForm,category:e.target.value})}/>
                  </div>
                  <div className="tc-field">
                    <label>Description</label>
                    <textarea className="tc-inp" rows={5} style={{resize:"none"}} placeholder="Describe what students will learn…"
                      value={rightMode==="create"?createForm.description:editForm.description}
                      onChange={e=>rightMode==="create"?setCreateForm({...createForm,description:e.target.value}):setEditForm({...editForm,description:e.target.value})}/>
                  </div>
                  <div className="tc-submit-row">
                    <button className="tc-sub" style={{background:rightMode==="create"?"var(--c3)":"var(--c1)",color:"#0a0a0a"}}
                      onClick={rightMode==="create"?createCourse:saveEdit}>
                      <CheckCircle size={15}/>{rightMode==="create"?"Create Course":"Save Changes"}
                    </button>
                    <button className="tc-can" onClick={()=>{setRightOpen(false);setEditingCourse(null);}}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TrainerCourseManagement;