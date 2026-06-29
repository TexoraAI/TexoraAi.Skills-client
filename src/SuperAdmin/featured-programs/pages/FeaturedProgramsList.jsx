// import { useState, useMemo, useRef, useEffect } from "react";
// import {
//   Search, Plus, Eye, Pencil, Trash2, ChevronUp, ChevronDown,
//   ChevronsUpDown, X, BookOpen, CheckCircle, MinusCircle, Tag,
//   AlertTriangle, Filter, GraduationCap, Inbox,
// } from "lucide-react";
// import AddEditProgram from "./AddEditProgram";

// // ─── MOCK DATA ─────────────────────────────────────────────────────────────────
// export const COMPANIES = [
//   "Google","Adobe","Microsoft","Amazon","Apple","Meta","Netflix","Salesforce",
//   "Spotify","Airbnb","Uber","Lyft","Twitter","LinkedIn","Slack","Zoom","Dropbox",
//   "Shopify","Stripe","Square","PayPal","Visa","Mastercard","Intel","NVIDIA",
//   "Samsung","Sony","LG","Oracle","SAP","IBM","Accenture","Deloitte","McKinsey",
//   "BCG","Bain","KPMG","EY","PwC","Infosys","Wipro","TCS","HCL","Cognizant",
//   "Razorpay","BYJU's","Zomato","Swiggy","Paytm","Texora","UFS Network",
// ];

// export const mockCategories = [
//   { id: 1, name: "Product" },
//   { id: 2, name: "Design" },
//   { id: 3, name: "Engineering" },
//   { id: 4, name: "Marketing" },
//   { id: 5, name: "Data Science" },
// ];

// export const mockPrograms = [
//   {
//     id: 1, title: "Product Management Mastery", slug: "product-management-mastery",
//     categoryId: 1, categoryName: "Product", instructorName: "Ahmed Raza",
//     instructorCompany: "Google", difficultyLevel: "Intermediate", durationWeeks: 12,
//     lessonsCount: 81, projectsCount: 3, studentsCount: 1240, rating: 4.8,
//     price: 12999, offerText: "50% OFF - Limited Time", displayOrder: 1,
//     status: "Active", createdAt: "2024-01-15", thumbnail: null,
//     shortDescription: "Master product management from 0 to PM leader.",
//     aboutContent: "", learningOutcomes: [], highlights: [], faqs: [],
//     programBenefits: [], careerOpportunities: [], enrollmentButtonText: "Enroll Now",
//     enrollmentUrl: "", syllabusButtonText: "Download Syllabus",
//     syllabus: { mode: "manual", weeks: [], uploadedFile: null, generatedPreview: null },
//   },
//   {
//     id: 2, title: "UX/UI Design Bootcamp", slug: "ux-ui-design-bootcamp",
//     categoryId: 2, categoryName: "Design", instructorName: "Sara Khan",
//     instructorCompany: "Adobe", difficultyLevel: "Beginner", durationWeeks: 8,
//     lessonsCount: 60, projectsCount: 5, studentsCount: 980, rating: 4.7,
//     price: 9999, offerText: "Early Bird - 30% OFF", displayOrder: 2,
//     status: "Active", createdAt: "2024-02-10", thumbnail: null,
//     shortDescription: "Learn UX/UI design from industry experts.",
//     aboutContent: "", learningOutcomes: [], highlights: [], faqs: [],
//     programBenefits: [], careerOpportunities: [], enrollmentButtonText: "Enroll Now",
//     enrollmentUrl: "", syllabusButtonText: "Download Syllabus",
//     syllabus: { mode: "manual", weeks: [], uploadedFile: null, generatedPreview: null },
//   },
//   {
//     id: 3, title: "Full Stack Development", slug: "full-stack-development",
//     categoryId: 3, categoryName: "Engineering", instructorName: "Rahul Sharma",
//     instructorCompany: "Microsoft", difficultyLevel: "Advanced", durationWeeks: 20,
//     lessonsCount: 120, projectsCount: 8, studentsCount: 560, rating: 4.9,
//     price: 24999, offerText: "", displayOrder: 3,
//     status: "Inactive", createdAt: "2024-03-05", thumbnail: null,
//     shortDescription: "Build full stack applications with modern tech.",
//     aboutContent: "", learningOutcomes: [], highlights: [], faqs: [],
//     programBenefits: [], careerOpportunities: [], enrollmentButtonText: "Enroll Now",
//     enrollmentUrl: "", syllabusButtonText: "Download Syllabus",
//     syllabus: { mode: "manual", weeks: [], uploadedFile: null, generatedPreview: null },
//   },
// ];

// // ─── HELPERS ───────────────────────────────────────────────────────────────────
// const difficultyConfig = {
//   Beginner:     { cls: "bg-blue-500/10 text-blue-400",   dot: "bg-blue-400"   },
//   Intermediate: { cls: "bg-amber-500/10 text-amber-400", dot: "bg-amber-400"  },
//   Advanced:     { cls: "bg-purple-500/10 text-purple-400", dot: "bg-purple-400" },
// };

// // ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────
// const DifficultyBadge = ({ level, dark }) => {
//   const cfg = difficultyConfig[level] || { cls: "bg-white/10 text-slate-400", dot: "bg-slate-400" };
//   const lightCls = {
//     Beginner:     "bg-blue-100 text-blue-700",
//     Intermediate: "bg-amber-100 text-amber-700",
//     Advanced:     "bg-purple-100 text-purple-700",
//   }[level] || "bg-gray-100 text-gray-600";
//   return (
//     <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${dark ? cfg.cls : lightCls}`}>
//       <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
//       {level}
//     </span>
//   );
// };

// const StatCard = ({ icon, value, label, dark, accent }) => {
//   const accentMap = {
//     indigo: {
//       iconBg:   dark ? "bg-indigo-300/20"  : "bg-white/40",
//       gradient: dark
//         ? "linear-gradient(135deg, #3730a3 0%, #4f46e5 60%, #6d28d9 100%)"
//         : "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 50%, #818cf8 100%)",
//       border:   dark ? "rgba(129,140,248,0.35)" : "rgba(99,102,241,0.4)",
//       val:      dark ? "text-white"         : "text-indigo-900",
//       sub:      dark ? "text-indigo-200"    : "text-indigo-700",
//     },
//     emerald: {
//       iconBg:   dark ? "bg-emerald-300/20" : "bg-white/40",
//       gradient: dark
//         ? "linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%)"
//         : "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)",
//       border:   dark ? "rgba(52,211,153,0.35)" : "rgba(16,185,129,0.4)",
//       val:      dark ? "text-white"         : "text-emerald-900",
//       sub:      dark ? "text-emerald-200"   : "text-emerald-700",
//     },
//     red: {
//       iconBg:   dark ? "bg-red-300/20"     : "bg-white/40",
//       gradient: dark
//         ? "linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #ef4444 100%)"
//         : "linear-gradient(135deg, #fecaca 0%, #fca5a5 50%, #f87171 100%)",
//       border:   dark ? "rgba(248,113,113,0.35)" : "rgba(239,68,68,0.4)",
//       val:      dark ? "text-white"         : "text-red-900",
//       sub:      dark ? "text-red-200"       : "text-red-700",
//     },
//     amber: {
//       iconBg:   dark ? "bg-amber-300/20"   : "bg-white/40",
//       gradient: dark
//         ? "linear-gradient(135deg, #78350f 0%, #d97706 60%, #f59e0b 100%)"
//         : "linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #fbbf24 100%)",
//       border:   dark ? "rgba(251,191,36,0.35)" : "rgba(245,158,11,0.4)",
//       val:      dark ? "text-white"         : "text-amber-900",
//       sub:      dark ? "text-amber-200"     : "text-amber-800",
//     },
//   };
//   const a = accentMap[accent] || accentMap.indigo;
//   return (
//     <div
//       className="rounded-xl border p-3 flex items-center gap-2.5 transition-all hover:scale-[1.02] hover:shadow-lg"
//       style={{
//         background: a.gradient,
//         borderColor: a.border,
//       }}
//     >
//       <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${a.iconBg} backdrop-blur-sm`}>
//         {icon}
//       </div>
//       <div>
//         <div className={`text-xl font-bold leading-none mb-0.5 ${a.val}`}>{value}</div>
//         <div className={`text-xs font-medium ${a.sub}`}>{label}</div>
//       </div>
//     </div>
//   );
// };

// const SortIcon = ({ field, sortField, sortDir, dark }) => {
//   if (sortField !== field)
//     return <span className={`ml-0.5 inline-flex ${dark ? "text-white/20" : "text-gray-300"}`}><ChevronsUpDown size={12} /></span>;
//   return <span className="text-violet-400 ml-0.5 inline-flex">{sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>;
// };

// const DeleteModal = ({ program, onConfirm, onCancel, dark }) => {
//   if (!program) return null;
//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
//       <div className={`rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden ${
//         dark ? "bg-[#0f0f1a] border border-white/8" : "bg-white"
//       }`}>
//         <div className={`px-6 pt-5 pb-4 flex flex-col items-center text-center ${
//           dark ? "bg-red-500/5" : "bg-red-50"
//         }`}>
//           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-red-500 mb-2 ${
//             dark ? "bg-red-500/10" : "bg-red-100"
//           }`}>
//             <AlertTriangle size={24} />
//           </div>
//           <h3 className={`font-bold text-base ${dark ? "text-white" : "text-gray-900"}`}>Delete Program</h3>
//           <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-500"}`}>This action cannot be undone.</p>
//         </div>
//         <div className="px-6 py-3">
//           <p className={`text-sm text-center ${dark ? "text-slate-300" : "text-gray-700"}`}>
//             Are you sure you want to delete{" "}
//             <span className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>"{program.title}"</span>?
//           </p>
//         </div>
//         <div className="flex gap-3 px-6 pb-5">
//           <button
//             onClick={onCancel}
//             className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
//               dark
//                 ? "border border-white/8 text-slate-300 hover:bg-white/5"
//                 : "border border-gray-200 text-gray-700 hover:bg-gray-50"
//             }`}
//           >Cancel</button>
//           <button
//             onClick={() => onConfirm(program.id)}
//             className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
//           >Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
// export default function FeaturedProgramsList() {
//   // ── consume theme (same pattern as AnalyticsDashboard) ──────────────────────
//   // If you have a ThemeContext, swap this line:
//   // const { dark } = useTheme();
//   // For now we derive it from the html class (Tailwind dark mode = class strategy)
//   const [dark, setDark] = useState(
//     () => document.documentElement.classList.contains("dark")
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() =>
//       setDark(document.documentElement.classList.contains("dark"))
//     );
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   const [programs, setPrograms]             = useState(mockPrograms);
//   const [categories, setCategories]         = useState(mockCategories);
//   const [search, setSearch]                 = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [statusFilter, setStatusFilter]     = useState("all");
//   const [sortField, setSortField]           = useState("displayOrder");
//   const [sortDir, setSortDir]               = useState("asc");
//   const [page, setPage]                     = useState(1);
//   const [deleteModal, setDeleteModal]       = useState(null);
//   const [panelOpen, setPanelOpen]           = useState(false);
//   const [panelMode, setPanelMode]           = useState(null);
//   const [panelProgram, setPanelProgram]     = useState(null);
//   const [panelWidth, setPanelWidth]         = useState(480);

//   // ── Panel resize ─────────────────────────────────────────────────────────────
//   const dragRef = useRef({ dragging: false, startX: 0, startW: 480 });
//   useEffect(() => {
//     const onMove = (e) => {
//       if (!dragRef.current.dragging) return;
//       const delta = dragRef.current.startX - e.clientX;
//       const newW  = Math.max(420, Math.min(900, dragRef.current.startW + delta));
//       setPanelWidth(newW);
//     };
//     const onUp = () => {
//       if (dragRef.current.dragging) {
//         dragRef.current.dragging = false;
//         document.body.style.cursor = "";
//         document.body.style.userSelect = "";
//       }
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//     return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//   }, []);

//   const onDragStart = (e) => {
//     e.preventDefault();
//     dragRef.current = { dragging: true, startX: e.clientX, startW: panelWidth };
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   };

//   // ── Theme shorthands (mirroring AnalyticsDashboard pattern) ─────────────────
//   const pageBg    = dark ? "bg-[#0a0a14]"                        : "bg-gray-50";
//   const panelBg   = dark ? "bg-white/[0.03] border-white/8"      : "bg-white border-gray-200";
//   const headerBg  = dark ? "bg-[#0f0f1a] border-white/8"         : "bg-white border-gray-200";
//   const titleText = dark ? "text-white"                           : "text-gray-800";
//   const subText   = dark ? "text-slate-400"                       : "text-gray-500";
//   const mutedText = dark ? "text-slate-500"                       : "text-gray-400";
//   const divider   = dark ? "border-white/6"                       : "border-gray-200";
//   const rowHover  = dark ? "hover:bg-white/[0.03]"                : "hover:bg-gray-50/80";
//   const rowDivide = dark ? "divide-white/[0.05]"                  : "divide-gray-100";
//   const theadBg   = dark ? "bg-white/[0.04]"                      : "bg-gray-50";
//   const inputCls  = dark
//     ? "bg-white/[0.04] border-white/8 text-white placeholder-slate-600 focus:border-violet-500/60 focus:ring-violet-500/20"
//     : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-100";
//   const selectCls = dark
//     ? "bg-white/[0.04] border-white/8 text-white focus:border-violet-500/60"
//     : "bg-white border-gray-200 text-gray-900 focus:border-indigo-400";

//   // ── CRUD helpers ─────────────────────────────────────────────────────────────
//   const perPage = 10;

//   const openPanel = (mode, program = null) => { setPanelMode(mode); setPanelProgram(program); setPanelOpen(true); };
//   const closePanel = () => { setPanelOpen(false); setPanelMode(null); setPanelProgram(null); };

//   const handleSave = (formData) => {
//     const category = categories.find((c) => String(c.id) === String(formData.categoryId));
//     if (panelMode === "add") {
//       setPrograms((prev) => [{ ...formData, id: Date.now(), categoryName: category?.name || "", createdAt: new Date().toISOString().split("T")[0], thumbnail: null }, ...prev]);
//     } else {
//       setPrograms((prev) => prev.map((p) => p.id === panelProgram.id ? { ...p, ...formData, categoryName: category?.name || "" } : p));
//     }
//     closePanel();
//   };

//   const handleDelete = (id) => { setPrograms((prev) => prev.filter((p) => p.id !== id)); setDeleteModal(null); };

//   const filtered = useMemo(() => {
//     let data = [...programs];
//     if (search)          data = data.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || (p.instructorName || "").toLowerCase().includes(search.toLowerCase()));
//     if (categoryFilter !== "all") data = data.filter((p) => String(p.categoryId) === categoryFilter);
//     if (statusFilter   !== "all") data = data.filter((p) => p.status === statusFilter);
//     data.sort((a, b) => {
//       let va = a[sortField], vb = b[sortField];
//       if (typeof va === "string") { va = va.toLowerCase(); vb = (vb || "").toLowerCase(); }
//       return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
//     });
//     return data;
//   }, [programs, search, categoryFilter, statusFilter, sortField, sortDir]);

//   const paginated  = filtered.slice((page - 1) * perPage, page * perPage);
//   const totalPages = Math.ceil(filtered.length / perPage);

//   const handleSort = (field) => {
//     if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else { setSortField(field); setSortDir("asc"); }
//   };

//   // ── Inline sort-th ────────────────────────────────────────────────────────────
//   const SortTh = ({ label, field }) => (
//     <th
//       onClick={() => field && handleSort(field)}
//       className={`px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap select-none
//         ${dark ? "text-slate-400" : "text-gray-500"}
//         ${field ? `cursor-pointer transition-colors ${dark ? "hover:text-slate-200 hover:bg-white/[0.04]" : "hover:text-gray-700 hover:bg-gray-100"}` : ""}`}
//     >
//       <span className="inline-flex items-center gap-0.5">
//         {label}
//         {field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} dark={dark} />}
//       </span>
//     </th>
//   );

//   // ── Status badge (dark-aware) ────────────────────────────────────────────────
//   const statusBadge = (status) => {
//     const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold";
//     return status === "Active"
//       ? `${base} ${dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`
//       : `${base} ${dark ? "bg-red-500/10 text-red-400"         : "bg-red-100 text-red-600"}`;
//   };

//   // ── Category badge (dark-aware) ──────────────────────────────────────────────
//   const catBadge = dark
//     ? "bg-violet-500/10 text-violet-400"
//     : "bg-indigo-50 text-indigo-700";

//   // ── Order pill (dark-aware) ──────────────────────────────────────────────────
//   const orderPill = dark
//     ? "bg-white/[0.06] text-slate-300"
//     : "bg-gray-100 text-gray-700";

//   // ── Thumb placeholder (dark-aware) ──────────────────────────────────────────
//   const thumbBg = dark
//     ? "bg-violet-500/10 border-violet-500/15 text-violet-400"
//     : "bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-100 text-indigo-400";

//   return (
//     <div className={`min-h-screen flex flex-col ${pageBg}`}>

//       {/* ── Page Header ── */}
//       <div className={`border-b px-5 py-3 flex-shrink-0 ${headerBg}`}>
//         <div className="flex items-center justify-between flex-wrap gap-2">
//           <div>
//             <div className={`flex items-center gap-1.5 text-xs mb-0.5 ${mutedText}`}>
//               <span>Landing Pages</span>
//               <ChevronUp size={12} className={`rotate-90 ${dark ? "text-white/20" : "text-gray-300"}`} />
//               <span className={`font-medium ${dark ? "text-slate-200" : "text-gray-800"}`}>Featured Programs</span>
//             </div>
//             <h1 className={`text-xl font-bold ${titleText}`}>Featured Programs</h1>
//             <p className={`text-xs mt-0.5 ${subText}`}>Manage all featured programs displayed on the platform</p>
//           </div>
//           <button
//             onClick={() => openPanel("add")}
//             className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm shadow-violet-500/20"
//           >
//             <Plus size={16} /> Add Program
//           </button>
//         </div>
//       </div>

//       {/* ── Body ── */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* ── Left scrollable content ── */}
//         <div className="flex-1 min-w-0 overflow-y-auto">
//           <div className="px-5 py-4 space-y-4">

//             {/* Stats */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               <StatCard dark={dark} accent="indigo"  icon={<BookOpen size={18}   className="text-indigo-400"  />} value={programs.length}                                    label="Total Programs" />
//               <StatCard dark={dark} accent="emerald" icon={<CheckCircle size={18} className="text-emerald-400" />} value={programs.filter((p) => p.status === "Active").length}   label="Active"         />
//               <StatCard dark={dark} accent="red"     icon={<MinusCircle size={18} className="text-red-400"    />} value={programs.filter((p) => p.status === "Inactive").length} label="Inactive"       />
//               <StatCard dark={dark} accent="amber"   icon={<Tag size={18}         className="text-amber-400"  />} value={categories.length}                                  label="Categories"     />
//             </div>

//             {/* Filters */}
//             <div className={`rounded-xl border px-3 py-2.5 transition-all ${panelBg}`}>
//               <div className="flex flex-wrap gap-2 items-center">
//                 {/* Search */}
//                 <div className="flex-1 min-w-[140px] relative">
//                   <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${mutedText}`}>
//                     <Search size={15} />
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Search title or instructor..."
//                     value={search}
//                     onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//                     className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 transition-colors ${inputCls}`}
//                   />
//                 </div>

//                 <span className={`flex-shrink-0 ${mutedText}`}><Filter size={15} /></span>

//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
//                   className={`px-2.5 py-2 text-sm border rounded-lg outline-none transition-colors ${selectCls}`}
//                 >
//                   <option value="all">All Categories</option>
//                   {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
//                 </select>

//                 <select
//                   value={statusFilter}
//                   onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
//                   className={`px-2.5 py-2 text-sm border rounded-lg outline-none transition-colors ${selectCls}`}
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>

//                 {(search || categoryFilter !== "all" || statusFilter !== "all") && (
//                   <button
//                     onClick={() => { setSearch(""); setCategoryFilter("all"); setStatusFilter("all"); setPage(1); }}
//                     className={`flex items-center gap-1 px-2.5 py-2 text-sm border rounded-lg transition-colors ${
//                       dark
//                         ? "border-white/8 text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
//                         : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     <X size={14} /> Clear
//                   </button>
//                 )}

//                 <span className={`text-xs ml-auto ${mutedText}`}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
//               </div>
//             </div>

//             {/* Table */}
//             <div className={`rounded-xl border overflow-hidden ${panelBg}`}>
//               {paginated.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-center">
//                   <div className={`mb-3 ${dark ? "text-white/10" : "text-gray-300"}`}>
//                     <Inbox size={48} strokeWidth={1.2} />
//                   </div>
//                   <h3 className={`font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>No programs found</h3>
//                   <p className={`text-sm mb-4 ${mutedText}`}>Try adjusting your search or filters</p>
//                   <button
//                     onClick={() => openPanel("add")}
//                     className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
//                   >
//                     <Plus size={16} /> Add First Program
//                   </button>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className={`border-b ${dark ? "border-white/[0.06]" : "border-gray-200"} ${theadBg}`}>
//                         <SortTh label="Thumb"      field={null} />
//                         <SortTh label="Course"     field="title" />
//                         <SortTh label="Category"   field="categoryName" />
//                         <SortTh label="Instructor" field="instructorName" />
//                         <SortTh label="Price"      field="price" />
//                         <SortTh label="Status"     field="status" />
//                         <SortTh label="Order"      field="displayOrder" />
//                         <SortTh label="Created"    field="createdAt" />
//                         <th className={`px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-gray-500"}`}>
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className={`divide-y ${rowDivide}`}>
//                       {paginated.map((program) => {
//                         const isActive = panelProgram?.id === program.id && panelOpen;
//                         return (
//                           <tr
//                             key={program.id}
//                             className={`transition-colors group
//                               ${rowHover}
//                               ${isActive
//                                 ? dark
//                                   ? "bg-violet-500/[0.07] outline outline-1 outline-violet-500/20"
//                                   : "bg-indigo-50/40 outline outline-2 outline-indigo-200"
//                                 : ""
//                               }`}
//                           >
//                             {/* Thumb */}
//                             <td className="px-3 py-2.5">
//                               <div className={`w-10 h-8 rounded-md flex items-center justify-center overflow-hidden border ${thumbBg}`}>
//                                 {program.thumbnail
//                                   ? <img src={program.thumbnail} alt="" className="w-full h-full object-cover rounded-md" />
//                                   : <GraduationCap size={17} />}
//                               </div>
//                             </td>

//                             {/* Course */}
//                             <td className="px-3 py-2.5">
//                               <div className={`font-semibold text-xs max-w-[150px] truncate ${titleText}`}>{program.title}</div>
//                               <div className={`text-xs font-mono mt-0.5 truncate max-w-[150px] ${mutedText}`}>{program.slug}</div>
//                               <div className="mt-1"><DifficultyBadge level={program.difficultyLevel} dark={dark} /></div>
//                             </td>

//                             {/* Category */}
//                             <td className="px-3 py-2.5">
//                               <span className={`px-2 py-0.5 rounded text-xs font-semibold ${catBadge}`}>
//                                 {program.categoryName}
//                               </span>
//                             </td>

//                             {/* Instructor */}
//                             <td className="px-3 py-2.5">
//                               <div className={`text-xs font-medium whitespace-nowrap ${dark ? "text-slate-200" : "text-gray-800"}`}>{program.instructorName}</div>
//                               <div className={`text-xs ${mutedText}`}>{program.instructorCompany}</div>
//                             </td>

//                             {/* Price */}
//                             <td className="px-3 py-2.5">
//                               <div className={`font-semibold text-xs whitespace-nowrap ${titleText}`}>
//                                 ₹{Number(program.price || 0).toLocaleString()}
//                               </div>
//                               {program.offerText && (
//                                 <div className={`text-xs font-medium leading-tight max-w-[90px] truncate ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
//                                   {program.offerText}
//                                 </div>
//                               )}
//                             </td>

//                             {/* Status */}
//                             <td className="px-3 py-2.5">
//                               <span className={statusBadge(program.status)}>
//                                 <span className={`w-1.5 h-1.5 rounded-full ${program.status === "Active" ? "bg-emerald-500" : "bg-red-400"}`} />
//                                 {program.status}
//                               </span>
//                             </td>

//                             {/* Order */}
//                             <td className="px-3 py-2.5 text-center">
//                               <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${orderPill}`}>
//                                 {program.displayOrder}
//                               </span>
//                             </td>

//                             {/* Created */}
//                             <td className={`px-3 py-2.5 text-xs whitespace-nowrap ${mutedText}`}>
//                               {program.createdAt}
//                             </td>

//                             {/* Actions */}
//                             <td className="px-3 py-2.5">
//                               <div className="flex items-center gap-0.5">
//                                 <button
//                                   onClick={() => openPanel("view", program)}
//                                   title="View"
//                                   className={`p-1.5 rounded-lg transition-all ${
//                                     dark
//                                       ? "text-slate-500 hover:bg-blue-500/10 hover:text-blue-400"
//                                       : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
//                                   }`}
//                                 ><Eye size={14} /></button>
//                                 <button
//                                   onClick={() => openPanel("edit", program)}
//                                   title="Edit"
//                                   className={`p-1.5 rounded-lg transition-all ${
//                                     dark
//                                       ? "text-slate-500 hover:bg-violet-500/10 hover:text-violet-400"
//                                       : "text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
//                                   }`}
//                                 ><Pencil size={14} /></button>
//                                 <button
//                                   onClick={() => setDeleteModal(program)}
//                                   title="Delete"
//                                   className={`p-1.5 rounded-lg transition-all ${
//                                     dark
//                                       ? "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
//                                       : "text-gray-400 hover:bg-red-50 hover:text-red-600"
//                                   }`}
//                                 ><Trash2 size={14} /></button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className={`flex items-center justify-between px-4 py-3 border-t ${
//                   dark
//                     ? `border-white/[0.06] bg-white/[0.02]`
//                     : `border-gray-200 bg-gray-50`
//                 }`}>
//                   <span className={`text-xs ${mutedText}`}>
//                     Showing{" "}
//                     <strong className={dark ? "text-slate-200" : "text-gray-700"}>{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}</strong>
//                     {" "}of{" "}
//                     <strong className={dark ? "text-slate-200" : "text-gray-700"}>{filtered.length}</strong>
//                   </span>
//                   <div className="flex items-center gap-1">
//                     <button
//                       onClick={() => setPage((p) => Math.max(1, p - 1))}
//                       disabled={page === 1}
//                       className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
//                         dark
//                           ? "border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
//                           : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       <ChevronUp size={12} /> Prev
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//                       <button
//                         key={p}
//                         onClick={() => setPage(p)}
//                         className={`w-7 h-7 text-xs rounded-lg border transition-colors ${
//                           p === page
//                             ? "bg-violet-600 text-white border-violet-600"
//                             : dark
//                               ? "border-white/8 bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200"
//                               : "border-gray-200 bg-white hover:bg-gray-100 text-gray-600"
//                         }`}
//                       >{p}</button>
//                     ))}
//                     <button
//                       onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                       disabled={page === totalPages}
//                       className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
//                         dark
//                           ? "border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
//                           : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       Next <ChevronDown size={12} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Right: resizable side panel ── */}
//         {panelOpen && (
//           <div
//             style={{ width: `${panelWidth}px`, minWidth: `${panelWidth}px` }}
//             className={`relative flex-shrink-0 h-full flex flex-col border-l shadow-xl overflow-hidden ${
//               dark
//                 ? "border-white/[0.06] bg-[#0f0f1a]"
//                 : "border-gray-200 bg-white"
//             }`}
//           >
//             {/* Drag handle */}
//             <div
//               onMouseDown={onDragStart}
//               className={`absolute left-0 top-0 w-1.5 h-full cursor-col-resize z-10 transition-colors ${
//                 dark ? "hover:bg-violet-500/20" : "hover:bg-indigo-400/30"
//               }`}
//             />
//             <AddEditProgram
//               mode={panelMode}
//               program={panelProgram}
//               categories={categories}
//               onCategoriesChange={setCategories}
//               onSave={handleSave}
//               onClose={closePanel}
//               onSwitchToEdit={(prog) => openPanel("edit", prog)}
//             />
//           </div>
//         )}
//       </div>

//       <DeleteModal program={deleteModal} onConfirm={handleDelete} onCancel={() => setDeleteModal(null)} dark={dark} />
//     </div>
//   );
// }










































import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
  BookOpen,
  CheckCircle,
  MinusCircle,
  Tag,
  AlertTriangle,
  Filter,
  GraduationCap,
  Inbox,
} from "lucide-react";
import AddEditProgram from "./AddEditProgram";
import { courseService } from "../../../services/courseService";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
export const COMPANIES = [
  "Google",
  "Adobe",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Salesforce",
  "Spotify",
  "Airbnb",
  "Uber",
  "Lyft",
  "Twitter",
  "LinkedIn",
  "Slack",
  "Zoom",
  "Dropbox",
  "Shopify",
  "Stripe",
  "Square",
  "PayPal",
  "Visa",
  "Mastercard",
  "Intel",
  "NVIDIA",
  "Samsung",
  "Sony",
  "LG",
  "Oracle",
  "SAP",
  "IBM",
  "Accenture",
  "Deloitte",
  "McKinsey",
  "BCG",
  "Bain",
  "KPMG",
  "EY",
  "PwC",
  "Infosys",
  "Wipro",
  "TCS",
  "HCL",
  "Cognizant",
  "Razorpay",
  "BYJU's",
  "Zomato",
  "Swiggy",
  "Paytm",
  "Texora",
  "UFS Network",
];

export const mockCategories = [
  { id: 1, name: "Product" },
  { id: 2, name: "Design" },
  { id: 3, name: "Engineering" },
  { id: 4, name: "Marketing" },
  { id: 5, name: "Data Science" },
];

export const mockPrograms = [
  {
    id: 1,
    title: "Product Management Mastery",
    slug: "product-management-mastery",
    categoryId: 1,
    categoryName: "Product",
    instructorName: "Ahmed Raza",
    instructorCompany: "Google",
    difficultyLevel: "Intermediate",
    durationWeeks: 12,
    lessonsCount: 81,
    projectsCount: 3,
    studentsCount: 1240,
    rating: 4.8,
    price: 12999,
    offerText: "50% OFF - Limited Time",
    displayOrder: 1,
    status: "Active",
    createdAt: "2024-01-15",
    thumbnail: null,
    shortDescription: "Master product management from 0 to PM leader.",
    aboutContent: "",
    learningOutcomes: [],
    highlights: [],
    faqs: [],
    programBenefits: [],
    careerOpportunities: [],
    enrollmentButtonText: "Enroll Now",
    enrollmentUrl: "",
    syllabusButtonText: "Download Syllabus",
    syllabus: {
      mode: "manual",
      weeks: [],
      uploadedFile: null,
      generatedPreview: null,
    },
  },
  {
    id: 2,
    title: "UX/UI Design Bootcamp",
    slug: "ux-ui-design-bootcamp",
    categoryId: 2,
    categoryName: "Design",
    instructorName: "Sara Khan",
    instructorCompany: "Adobe",
    difficultyLevel: "Beginner",
    durationWeeks: 8,
    lessonsCount: 60,
    projectsCount: 5,
    studentsCount: 980,
    rating: 4.7,
    price: 9999,
    offerText: "Early Bird - 30% OFF",
    displayOrder: 2,
    status: "Active",
    createdAt: "2024-02-10",
    thumbnail: null,
    shortDescription: "Learn UX/UI design from industry experts.",
    aboutContent: "",
    learningOutcomes: [],
    highlights: [],
    faqs: [],
    programBenefits: [],
    careerOpportunities: [],
    enrollmentButtonText: "Enroll Now",
    enrollmentUrl: "",
    syllabusButtonText: "Download Syllabus",
    syllabus: {
      mode: "manual",
      weeks: [],
      uploadedFile: null,
      generatedPreview: null,
    },
  },
  {
    id: 3,
    title: "Full Stack Development",
    slug: "full-stack-development",
    categoryId: 3,
    categoryName: "Engineering",
    instructorName: "Rahul Sharma",
    instructorCompany: "Microsoft",
    difficultyLevel: "Advanced",
    durationWeeks: 20,
    lessonsCount: 120,
    projectsCount: 8,
    studentsCount: 560,
    rating: 4.9,
    price: 24999,
    offerText: "",
    displayOrder: 3,
    status: "Inactive",
    createdAt: "2024-03-05",
    thumbnail: null,
    shortDescription: "Build full stack applications with modern tech.",
    aboutContent: "",
    learningOutcomes: [],
    highlights: [],
    faqs: [],
    programBenefits: [],
    careerOpportunities: [],
    enrollmentButtonText: "Enroll Now",
    enrollmentUrl: "",
    syllabusButtonText: "Download Syllabus",
    syllabus: {
      mode: "manual",
      weeks: [],
      uploadedFile: null,
      generatedPreview: null,
    },
  },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const difficultyConfig = {
  Beginner: { cls: "bg-blue-500/10 text-blue-400", dot: "bg-blue-400" },
  Intermediate: { cls: "bg-amber-500/10 text-amber-400", dot: "bg-amber-400" },
  Advanced: { cls: "bg-purple-500/10 text-purple-400", dot: "bg-purple-400" },
};

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────
const DifficultyBadge = ({ level, dark }) => {
  const cfg = difficultyConfig[level] || {
    cls: "bg-white/10 text-slate-400",
    dot: "bg-slate-400",
  };
  const lightCls =
    {
      Beginner: "bg-blue-100 text-blue-700",
      Intermediate: "bg-amber-100 text-amber-700",
      Advanced: "bg-purple-100 text-purple-700",
    }[level] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${dark ? cfg.cls : lightCls}`}
    >
      <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
      {level}
    </span>
  );
};

const StatCard = ({ icon, value, label, dark, accent }) => {
  const accentMap = {
    indigo: {
      iconBg: dark ? "bg-indigo-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #3730a3 0%, #4f46e5 60%, #6d28d9 100%)"
        : "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 50%, #818cf8 100%)",
      border: dark ? "rgba(129,140,248,0.35)" : "rgba(99,102,241,0.4)",
      val: dark ? "text-white" : "text-indigo-900",
      sub: dark ? "text-indigo-200" : "text-indigo-700",
    },
    emerald: {
      iconBg: dark ? "bg-emerald-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%)"
        : "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)",
      border: dark ? "rgba(52,211,153,0.35)" : "rgba(16,185,129,0.4)",
      val: dark ? "text-white" : "text-emerald-900",
      sub: dark ? "text-emerald-200" : "text-emerald-700",
    },
    red: {
      iconBg: dark ? "bg-red-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #ef4444 100%)"
        : "linear-gradient(135deg, #fecaca 0%, #fca5a5 50%, #f87171 100%)",
      border: dark ? "rgba(248,113,113,0.35)" : "rgba(239,68,68,0.4)",
      val: dark ? "text-white" : "text-red-900",
      sub: dark ? "text-red-200" : "text-red-700",
    },
    amber: {
      iconBg: dark ? "bg-amber-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #78350f 0%, #d97706 60%, #f59e0b 100%)"
        : "linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #fbbf24 100%)",
      border: dark ? "rgba(251,191,36,0.35)" : "rgba(245,158,11,0.4)",
      val: dark ? "text-white" : "text-amber-900",
      sub: dark ? "text-amber-200" : "text-amber-800",
    },
  };
  const a = accentMap[accent] || accentMap.indigo;
  return (
    <div
      className="rounded-xl border p-3 flex items-center gap-2.5 transition-all hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: a.gradient,
        borderColor: a.border,
      }}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${a.iconBg} backdrop-blur-sm`}
      >
        {icon}
      </div>
      <div>
        <div className={`text-xl font-bold leading-none mb-0.5 ${a.val}`}>
          {value}
        </div>
        <div className={`text-xs font-medium ${a.sub}`}>{label}</div>
      </div>
    </div>
  );
};

const SortIcon = ({ field, sortField, sortDir, dark }) => {
  if (sortField !== field)
    return (
      <span
        className={`ml-0.5 inline-flex ${dark ? "text-white/20" : "text-gray-300"}`}
      >
        <ChevronsUpDown size={12} />
      </span>
    );
  return (
    <span className="text-violet-400 ml-0.5 inline-flex">
      {sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </span>
  );
};

const DeleteModal = ({ program, onConfirm, onCancel, dark }) => {
  if (!program) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden ${
          dark ? "bg-[#0f0f1a] border border-white/8" : "bg-white"
        }`}
      >
        <div
          className={`px-6 pt-5 pb-4 flex flex-col items-center text-center ${
            dark ? "bg-red-500/5" : "bg-red-50"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-red-500 mb-2 ${
              dark ? "bg-red-500/10" : "bg-red-100"
            }`}
          >
            <AlertTriangle size={24} />
          </div>
          <h3
            className={`font-bold text-base ${dark ? "text-white" : "text-gray-900"}`}
          >
            Delete Program
          </h3>
          <p
            className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-500"}`}
          >
            This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-3">
          <p
            className={`text-sm text-center ${dark ? "text-slate-300" : "text-gray-700"}`}
          >
            Are you sure you want to delete{" "}
            <span
              className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}
            >
              "{program.title}"
            </span>
            ?
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              dark
                ? "border border-white/8 text-slate-300 hover:bg-white/5"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(program.id)}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function FeaturedProgramsList() {
  // ── consume theme (same pattern as AnalyticsDashboard) ──────────────────────
  // If you have a ThemeContext, swap this line:
  // const { dark } = useTheme();
  // For now we derive it from the html class (Tailwind dark mode = class strategy)
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [{ data: progs }, { data: s }] = await Promise.all([
          courseService.getAllFeaturedProgramsForAdmin(),
          courseService.getFeaturedProgramStats(),
        ]);
        setPrograms(progs);
        setStats(s);
      } catch (err) {
        console.error("Failed to load featured programs", err);
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    }
    load();
  }, []);

  // const [programs, setPrograms] = useState(mockPrograms);
  // const [categories, setCategories] = useState(mockCategories);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState(mockCategories); // keep local until backend adds category endpoint
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    inactivePrograms: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("displayOrder");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState(null);
  const [panelProgram, setPanelProgram] = useState(null);
  const [panelWidth, setPanelWidth] = useState(480);

  // ── Panel resize ─────────────────────────────────────────────────────────────
  const dragRef = useRef({ dragging: false, startX: 0, startW: 480 });
  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      const delta = dragRef.current.startX - e.clientX;
      const newW = Math.max(420, Math.min(900, dragRef.current.startW + delta));
      setPanelWidth(newW);
    };
    const onUp = () => {
      if (dragRef.current.dragging) {
        dragRef.current.dragging = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onDragStart = (e) => {
    e.preventDefault();
    dragRef.current = { dragging: true, startX: e.clientX, startW: panelWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // ── Theme shorthands (mirroring AnalyticsDashboard pattern) ─────────────────
  const pageBg = dark ? "bg-[#0a0a14]" : "bg-gray-50";
  const panelBg = dark
    ? "bg-white/[0.03] border-white/8"
    : "bg-white border-gray-200";
  const headerBg = dark
    ? "bg-[#0f0f1a] border-white/8"
    : "bg-white border-gray-200";
  const titleText = dark ? "text-white" : "text-gray-800";
  const subText = dark ? "text-slate-400" : "text-gray-500";
  const mutedText = dark ? "text-slate-500" : "text-gray-400";
  const divider = dark ? "border-white/6" : "border-gray-200";
  const rowHover = dark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50/80";
  const rowDivide = dark ? "divide-white/[0.05]" : "divide-gray-100";
  const theadBg = dark ? "bg-white/[0.04]" : "bg-gray-50";
  const inputCls = dark
    ? "bg-white/[0.04] border-white/8 text-white placeholder-slate-600 focus:border-violet-500/60 focus:ring-violet-500/20"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-100";
  const selectCls = dark
    ? "bg-white/[0.04] border-white/8 text-white focus:border-violet-500/60"
    : "bg-white border-gray-200 text-gray-900 focus:border-indigo-400";

  // ── CRUD helpers ─────────────────────────────────────────────────────────────
  const perPage = 10;

  const openPanel = (mode, program = null) => {
    setPanelMode(mode);
    setPanelProgram(program);
    setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setPanelMode(null);
    setPanelProgram(null);
  };

  // Note: handleSave now receives the raw formData from AddEditProgram
  // The DTO transform already happened inside AddEditProgram before the API call,
  // but onSave still passes formData back for local state update.
  const handleSave = (formData) => {
    // Optimistic local update — real data already persisted by AddEditProgram
    if (panelMode === "add") {
      setPrograms((prev) => [
        {
          ...formData,
          id: formData.id ?? Date.now(),
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
    } else {
      setPrograms((prev) =>
        prev.map((p) => (p.id === panelProgram.id ? { ...p, ...formData } : p)),
      );
    }
    closePanel();
  };

  // const handleDelete = (id) => {
  //   setPrograms((prev) => prev.filter((p) => p.id !== id));
  //   setDeleteModal(null);
  // };
  const handleDelete = async (id) => {
    try {
      await courseService.deleteFeaturedProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      setStats((prev) => ({
        ...prev,
        totalPrograms: prev.totalPrograms - 1,
        activePrograms:
          programs.find((p) => p.id === id)?.status === "Active"
            ? prev.activePrograms - 1
            : prev.activePrograms,
      }));
    } catch (err) {
      alert("Delete failed: " + (err?.response?.data?.message || err.message));
    }
    setDeleteModal(null);
  };

  const filtered = useMemo(() => {
    let data = [...programs];
    if (search)
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.instructorName || "").toLowerCase().includes(search.toLowerCase()),
      );
    // if (categoryFilter !== "all")
    //   data = data.filter((p) => String(p.categoryId) === categoryFilter);
    if (categoryFilter !== "all")
      data = data.filter(
        (p) =>
          (p.category || p.categoryName || "").toLowerCase() ===
          categoryFilter.toLowerCase(),
      );
    if (statusFilter !== "all")
      data = data.filter((p) => p.status === statusFilter);
    data.sort((a, b) => {
      let va = a[sortField],
        vb = b[sortField];
      if (typeof va === "string") {
        va = va.toLowerCase();
        vb = (vb || "").toLowerCase();
      }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return data;
  }, [programs, search, categoryFilter, statusFilter, sortField, sortDir]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // ── Inline sort-th ────────────────────────────────────────────────────────────
  const SortTh = ({ label, field }) => (
    <th
      onClick={() => field && handleSort(field)}
      className={`px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap select-none
        ${dark ? "text-slate-400" : "text-gray-500"}
        ${field ? `cursor-pointer transition-colors ${dark ? "hover:text-slate-200 hover:bg-white/[0.04]" : "hover:text-gray-700 hover:bg-gray-100"}` : ""}`}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        {field && (
          <SortIcon
            field={field}
            sortField={sortField}
            sortDir={sortDir}
            dark={dark}
          />
        )}
      </span>
    </th>
  );

  // ── Status badge (dark-aware) ────────────────────────────────────────────────
  const statusBadge = (status) => {
    const base =
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold";
    return status === "Active"
      ? `${base} ${dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`
      : `${base} ${dark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-600"}`;
  };

  // ── Category badge (dark-aware) ──────────────────────────────────────────────
  const catBadge = dark
    ? "bg-violet-500/10 text-violet-400"
    : "bg-indigo-50 text-indigo-700";

  // ── Order pill (dark-aware) ──────────────────────────────────────────────────
  const orderPill = dark
    ? "bg-white/[0.06] text-slate-300"
    : "bg-gray-100 text-gray-700";

  // ── Thumb placeholder (dark-aware) ──────────────────────────────────────────
  const thumbBg = dark
    ? "bg-violet-500/10 border-violet-500/15 text-violet-400"
    : "bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-100 text-indigo-400";

  return (
    <div className={`min-h-screen flex flex-col ${pageBg}`}>
      {/* ── Page Header ── */}
      <div className={`border-b px-5 py-3 flex-shrink-0 ${headerBg}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div
              className={`flex items-center gap-1.5 text-xs mb-0.5 ${mutedText}`}
            >
              <span>Landing Pages</span>
              <ChevronUp
                size={12}
                className={`rotate-90 ${dark ? "text-white/20" : "text-gray-300"}`}
              />
              <span
                className={`font-medium ${dark ? "text-slate-200" : "text-gray-800"}`}
              >
                Featured Programs
              </span>
            </div>
            <h1 className={`text-xl font-bold ${titleText}`}>
              Featured Programs
            </h1>
            <p className={`text-xs mt-0.5 ${subText}`}>
              Manage all featured programs displayed on the platform
            </p>
          </div>
          <button
            onClick={() => openPanel("add")}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm shadow-violet-500/20"
          >
            <Plus size={16} /> Add Program
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left scrollable content ── */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-5 py-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                dark={dark}
                accent="indigo"
                icon={<BookOpen size={18} className="text-indigo-400" />}
                value={statsLoading ? "…" : stats.totalPrograms}
                label="Total Programs"
              />
              <StatCard
                dark={dark}
                accent="emerald"
                icon={<CheckCircle size={18} className="text-emerald-400" />}
                value={statsLoading ? "…" : stats.activePrograms}
                label="Active"
              />
              <StatCard
                dark={dark}
                accent="red"
                icon={<MinusCircle size={18} className="text-red-400" />}
                value={statsLoading ? "…" : stats.inactivePrograms}
                label="Inactive"
              />
              <StatCard
                dark={dark}
                accent="amber"
                icon={<Tag size={18} className="text-amber-400" />}
                value={statsLoading ? "…" : stats.totalCategories}
                label="Categories"
              />
            </div>

            {/* Filters */}
            <div
              className={`rounded-xl border px-3 py-2.5 transition-all ${panelBg}`}
            >
              <div className="flex flex-wrap gap-2 items-center">
                {/* Search */}
                <div className="flex-1 min-w-[140px] relative">
                  <span
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${mutedText}`}
                  >
                    <Search size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search title or instructor..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 transition-colors ${inputCls}`}
                  />
                </div>

                <span className={`flex-shrink-0 ${mutedText}`}>
                  <Filter size={15} />
                </span>

                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className={`px-2.5 py-2 text-sm border rounded-lg outline-none transition-colors ${selectCls}`}
                >
                  <option value="all">All Categories</option>
                  {/* {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))} */}
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className={`px-2.5 py-2 text-sm border rounded-lg outline-none transition-colors ${selectCls}`}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                {(search ||
                  categoryFilter !== "all" ||
                  statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("all");
                      setStatusFilter("all");
                      setPage(1);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-2 text-sm border rounded-lg transition-colors ${
                      dark
                        ? "border-white/8 text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <X size={14} /> Clear
                  </button>
                )}

                <span className={`text-xs ml-auto ${mutedText}`}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className={`rounded-xl border overflow-hidden ${panelBg}`}>
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div
                    className={`mb-3 ${dark ? "text-white/10" : "text-gray-300"}`}
                  >
                    <Inbox size={48} strokeWidth={1.2} />
                  </div>
                  <h3
                    className={`font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}
                  >
                    No programs found
                  </h3>
                  <p className={`text-sm mb-4 ${mutedText}`}>
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={() => openPanel("add")}
                    className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
                  >
                    <Plus size={16} /> Add First Program
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className={`border-b ${dark ? "border-white/[0.06]" : "border-gray-200"} ${theadBg}`}
                      >
                        <SortTh label="Thumb" field={null} />
                        <SortTh label="Course" field="title" />
                        <SortTh label="Category" field="categoryName" />
                        <SortTh label="Instructor" field="instructorName" />
                        <SortTh label="Price" field="price" />
                        <SortTh label="Status" field="status" />
                        <SortTh label="Order" field="displayOrder" />
                        <SortTh label="Created" field="createdAt" />
                        <th
                          className={`px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-gray-500"}`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${rowDivide}`}>
                      {paginated.map((program) => {
                        const isActive =
                          panelProgram?.id === program.id && panelOpen;
                        return (
                          <tr
                            key={program.id}
                            className={`transition-colors group
                              ${rowHover}
                              ${
                                isActive
                                  ? dark
                                    ? "bg-violet-500/[0.07] outline outline-1 outline-violet-500/20"
                                    : "bg-indigo-50/40 outline outline-2 outline-indigo-200"
                                  : ""
                              }`}
                          >
                            {/* Thumb */}
                            <td className="px-3 py-2.5">
                              <div
                                className={`w-10 h-8 rounded-md flex items-center justify-center overflow-hidden border ${thumbBg}`}
                              >
                                {program.thumbnail ? (
                                  <img
                                    src={program.thumbnail}
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <GraduationCap size={17} />
                                )}
                              </div>
                            </td>

                            {/* Course */}
                            <td className="px-3 py-2.5">
                              <div
                                className={`font-semibold text-xs max-w-[150px] truncate ${titleText}`}
                              >
                                {program.title}
                              </div>
                              <div
                                className={`text-xs font-mono mt-0.5 truncate max-w-[150px] ${mutedText}`}
                              >
                                {program.slug}
                              </div>
                              <div className="mt-1">
                                <DifficultyBadge
                                  level={
                                    program.level || program.difficultyLevel
                                  }
                                  dark={dark}
                                />
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-3 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${catBadge}`}
                              >
                                {/* {program.categoryName} */}
                                {program.category || program.categoryName}
                              </span>
                            </td>

                            {/* Instructor */}
                            <td className="px-3 py-2.5">
                              <div
                                className={`text-xs font-medium whitespace-nowrap ${dark ? "text-slate-200" : "text-gray-800"}`}
                              >
                                {program.instructorName}
                              </div>
                              <div className={`text-xs ${mutedText}`}>
                                {program.company || program.instructorCompany}
                              </div>
                            </td>

                            {/* Price */}
                            <td className="px-3 py-2.5">
                              <div
                                className={`font-semibold text-xs whitespace-nowrap ${titleText}`}
                              >
                                ₹{Number(program.price || 0).toLocaleString()}
                              </div>
                              {program.offerText && (
                                <div
                                  className={`text-xs font-medium leading-tight max-w-[90px] truncate ${dark ? "text-emerald-400" : "text-emerald-600"}`}
                                >
                                  {program.offerText}
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-3 py-2.5">
                              <span className={statusBadge(program.status)}>
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${program.status === "Active" ? "bg-emerald-500" : "bg-red-400"}`}
                                />
                                {program.status}
                              </span>
                            </td>

                            {/* Order */}
                            <td className="px-3 py-2.5 text-center">
                              <span
                                className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${orderPill}`}
                              >
                                {program.displayOrder}
                              </span>
                            </td>

                            {/* Created */}
                            <td
                              className={`px-3 py-2.5 text-xs whitespace-nowrap ${mutedText}`}
                            >
                              {program.createdAt}
                            </td>

                            {/* Actions */}
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={() => openPanel("view", program)}
                                  title="View"
                                  className={`p-1.5 rounded-lg transition-all ${
                                    dark
                                      ? "text-slate-500 hover:bg-blue-500/10 hover:text-blue-400"
                                      : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                                  }`}
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => openPanel("edit", program)}
                                  title="Edit"
                                  className={`p-1.5 rounded-lg transition-all ${
                                    dark
                                      ? "text-slate-500 hover:bg-violet-500/10 hover:text-violet-400"
                                      : "text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                                  }`}
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteModal(program)}
                                  title="Delete"
                                  className={`p-1.5 rounded-lg transition-all ${
                                    dark
                                      ? "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                                      : "text-gray-400 hover:bg-red-50 hover:text-red-600"
                                  }`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className={`flex items-center justify-between px-4 py-3 border-t ${
                    dark
                      ? `border-white/[0.06] bg-white/[0.02]`
                      : `border-gray-200 bg-gray-50`
                  }`}
                >
                  <span className={`text-xs ${mutedText}`}>
                    Showing{" "}
                    <strong
                      className={dark ? "text-slate-200" : "text-gray-700"}
                    >
                      {(page - 1) * perPage + 1}–
                      {Math.min(page * perPage, filtered.length)}
                    </strong>{" "}
                    of{" "}
                    <strong
                      className={dark ? "text-slate-200" : "text-gray-700"}
                    >
                      {filtered.length}
                    </strong>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                        dark
                          ? "border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <ChevronUp size={12} /> Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 text-xs rounded-lg border transition-colors ${
                            p === page
                              ? "bg-violet-600 text-white border-violet-600"
                              : dark
                                ? "border-white/8 bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200"
                                : "border-gray-200 bg-white hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                        dark
                          ? "border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Next <ChevronDown size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: resizable side panel ── */}
        {panelOpen && (
          <div
            style={{ width: `${panelWidth}px`, minWidth: `${panelWidth}px` }}
            className={`relative flex-shrink-0 h-full flex flex-col border-l shadow-xl overflow-hidden ${
              dark
                ? "border-white/[0.06] bg-[#0f0f1a]"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Drag handle */}
            <div
              onMouseDown={onDragStart}
              className={`absolute left-0 top-0 w-1.5 h-full cursor-col-resize z-10 transition-colors ${
                dark ? "hover:bg-violet-500/20" : "hover:bg-indigo-400/30"
              }`}
            />
            <AddEditProgram
              mode={panelMode}
              program={panelProgram}
              categories={categories}
              onCategoriesChange={setCategories}
              onSave={handleSave}
              onClose={closePanel}
              onSwitchToEdit={(prog) => openPanel("edit", prog)}
            />
          </div>
        )}
      </div>

      <DeleteModal
        program={deleteModal}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
        dark={dark}
      />
    </div>
  );
}
