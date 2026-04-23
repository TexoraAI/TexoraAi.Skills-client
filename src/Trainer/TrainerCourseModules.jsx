// import axios from "axios";
// import {
//   FileText,
//   Plus,
//   Trash2,
//   Video,
//   BookOpen,
//   ChevronRight,
//   Upload,
//   List,
//   Pencil,
//   X,
//   Check,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import videoService from "../services/videoService"; // adjust path as needed
// import fileService from "../services/fileService"; // adjust path as needed

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// /* ─────────────────── HELPER ─────────────────── */
// const extractTitle = (fileName) =>
//   fileName
//     .replace(/\.[^/.]+$/, "")
//     .replace(/[_-]/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// /* ─────────────────── EDIT MODAL ─────────────────── */
// const EditModal = ({ module, onClose, onSaved }) => {
//   const [editTitle, setEditTitle] = useState(module.title || "");
//   const [editFile, setEditFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setEditFile(f);
//     // Auto-fill title only if user hasn't typed one yet
//     if (!editTitle.trim() || editTitle === module.title) {
//       setEditTitle(extractTitle(f.name));
//     }
//   };

//   const handleSave = async () => {
//     if (!editTitle.trim()) {
//       setError("Lesson title is required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       // ─── Step 1: Upload NEW physical file if one was chosen ───
//       // FIX: We don't have module.fileId (content record only stores the URL,
//       //      not the CourseVideo/CourseFile row ID).
//       //      Solution: upload a new file instead of trying to update by ID.
//       let updatedUrl = module.url;

//       if (editFile) {
//         if (module.contentType === "VIDEO") {
//           // Upload new video → get new stream URL back
//           const res = await videoService.uploadCourseVideo(
//             editFile,
//             module.courseId,
//             module.moduleId ?? 0,
//             module.batchId ?? 0,
//           );
//           updatedUrl = res.data?.url;
//         } else {
//           // Upload new PDF → get new download URL back
//           const res = await fileService.uploadCourseFile(
//             editFile,
//             module.courseId,
//             module.moduleId ?? 0,
//             module.batchId ?? 0,
//           );
//           updatedUrl = res.data?.url;
//         }
//       }

//       // ─── Step 2: Update the content-service record (title + url) ───
//       await axios.put(
//         `${API}/content/${module.id}`,
//         {
//           title: editTitle.trim(),
//           url: updatedUrl,
//           contentType: module.contentType,
//         },
//         { headers: authHeader() },
//       );

//       setSuccess("Module updated successfully!");
//       setTimeout(() => {
//         onSaved({ ...module, title: editTitle.trim(), url: updatedUrl });
//         onClose();
//       }, 800);
//     } catch (err) {
//       console.error("Edit failed:", err);
//       setError(
//         err?.response?.data?.message || "Update failed. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div
//         className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
//                    bg-white dark:bg-[#162040]
//                    border border-slate-200 dark:border-white/10"
//       >
//         {/* Header */}
//         <div
//           className="flex items-center justify-between px-6 py-4
//                      border-b border-slate-100 dark:border-white/10"
//           style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)" }}
//         >
//           <div className="flex items-center gap-2">
//             <Pencil className="w-4 h-4 text-white/80" />
//             <span className="text-sm font-bold text-white tracking-wide">
//               Edit Module
//             </span>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1.5 rounded-lg hover:bg-white/20 transition"
//           >
//             <X className="w-4 h-4 text-white" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-4">
//           {/* Current file info */}
//           <div
//             className="flex items-center gap-2 px-3 py-2 rounded-xl
//                        bg-slate-50 dark:bg-white/5
//                        border border-slate-200 dark:border-white/10"
//           >
//             {module.contentType === "VIDEO" ? (
//               <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />
//             ) : (
//               <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
//             )}
//             <div className="min-w-0">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
//                 Current File
//               </p>
//               <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
//                 {module.url || "No file"}
//               </p>
//             </div>
//           </div>

//           {/* Lesson Title */}
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//               Lesson Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//               placeholder="Enter lesson title"
//               className="w-full rounded-xl px-3 py-2.5 text-sm
//                          bg-slate-50 dark:bg-white/5
//                          border border-slate-200 dark:border-white/10
//                          text-slate-800 dark:text-slate-100
//                          placeholder-slate-400 dark:placeholder-slate-500
//                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//             />
//           </div>

//           {/* Replace File */}
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//               Replace File{" "}
//               <span className="text-slate-300 dark:text-slate-600">
//                 (optional)
//               </span>
//             </label>
//             <label
//               className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl
//                          border-2 border-dashed border-slate-200 dark:border-white/15
//                          bg-slate-50 dark:bg-white/3
//                          hover:border-blue-400 dark:hover:border-blue-600
//                          hover:bg-blue-50/50 dark:hover:bg-blue-900/10
//                          cursor-pointer transition"
//             >
//               <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500" />
//               <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
//                 {editFile ? (
//                   <span className="text-blue-600 dark:text-blue-400 font-medium">
//                     {editFile.name}
//                   </span>
//                 ) : (
//                   `Click to replace ${module.contentType === "VIDEO" ? "video" : "PDF"}`
//                 )}
//               </span>
//               <input
//                 type="file"
//                 className="hidden"
//                 accept={
//                   module.contentType === "VIDEO"
//                     ? "video/*"
//                     : ".pdf,.doc,.docx,.ppt,.pptx"
//                 }
//                 onChange={handleFileChange}
//               />
//             </label>
//           </div>

//           {/* Messages */}
//           {error && (
//             <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
//               <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
//               <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
//             </div>
//           )}
//           {success && (
//             <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
//               <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
//               <p className="text-xs text-green-600 dark:text-green-400">
//                 {success}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 px-6 pb-5">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
//                        text-slate-600 dark:text-slate-300
//                        border border-slate-200 dark:border-white/10
//                        bg-slate-50 dark:bg-white/5
//                        hover:border-slate-300 dark:hover:border-white/20
//                        disabled:opacity-50 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
//                        text-sm font-semibold text-white shadow-md
//                        hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
//             style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" /> Saving...
//               </>
//             ) : (
//               <>
//                 <Check className="w-4 h-4" /> Save Changes
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────── MAIN PAGE ─────────────────── */
// export default function TrainerCourseModules() {
//   const { courseId } = useParams();

//   const [modules, setModules] = useState([]);
//   const [title, setTitle] = useState("");
//   const [file, setFile] = useState(null);
//   const [type, setType] = useState("VIDEO");
//   const [loading, setLoading] = useState(false);
//   const [addError, setAddError] = useState("");

//   /* Edit modal */
//   const [editingModule, setEditingModule] = useState(null);

//   /* ── Panel resize ── */
//   const [leftCollapsed, setLeftCollapsed] = useState(false);
//   const [rightWidth, setRightWidth] = useState(300);
//   const isDragging = useRef(false);
//   const containerRef = useRef(null);

//   const onMouseDown = useCallback(() => {
//     isDragging.current = true;
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   }, []);

//   const onMouseMove = useCallback((e) => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const fromRight = rect.right - e.clientX;
//     if (fromRight > 220 && fromRight < 520) setRightWidth(fromRight);
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

//   /* ── Data ── */
//   useEffect(() => {
//     loadModules();
//   }, [courseId]);

//   const loadModules = async () => {
//     try {
//       const res = await axios.get(`${API}/content/course/${courseId}`, {
//         headers: authHeader(),
//       });
//       setModules(res.data);
//     } catch (err) {
//       console.error("Failed to load modules", err);
//     }
//   };

//   /* ── File select with auto-title ── */
//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setFile(f);
//     if (!title.trim()) setTitle(extractTitle(f.name));
//   };

//   /* ── Upload / Add module ── */
//   const uploadAsset = async () => {
//     if (!title.trim()) {
//       setAddError("Lesson title is required");
//       return;
//     }
//     if (!file) {
//       setAddError(`Please select a ${type === "VIDEO" ? "video" : "PDF"} file`);
//       return;
//     }

//     try {
//       setLoading(true);
//       setAddError("");

//       let fileUrl;
//       if (type === "VIDEO") {
//         const res = await videoService.uploadCourseVideo(file, courseId, 0, 0);
//         fileUrl = res.data?.url;
//       } else {
//         const res = await fileService.uploadCourseFile(file, courseId, 0, 0);
//         fileUrl = res.data?.url;
//       }

//       await axios.post(
//         `${API}/content`,
//         {
//           courseId,
//           title: title.trim(),
//           contentType: type,
//           url: fileUrl,
//           orderIndex: modules.length + 1,
//         },
//         { headers: authHeader() },
//       );

//       setTitle("");
//       setFile(null);
//       loadModules();
//     } catch (err) {
//       console.error(err);
//       setAddError("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── Delete ── */
//   const deleteModule = async (module) => {
//     if (!window.confirm("Delete this module?")) return;
//     try {
//       await axios.delete(`${API}/content/${module.id}`, {
//         headers: authHeader(),
//       });
//       setModules((prev) => prev.filter((m) => m.id !== module.id));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   /* ── After edit saved ── */
//   const handleModuleSaved = (updated) => {
//     setModules((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
//   };

//   /* ────────────────── RENDER ────────────────── */
//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] flex flex-col">
//       {/* Edit Modal */}
//       {editingModule && (
//         <EditModal
//           module={editingModule}
//           onClose={() => setEditingModule(null)}
//           onSaved={handleModuleSaved}
//         />
//       )}

//       {/* ── Page Title ── */}
//       <div className="px-6 pt-6 pb-4">
//         <div className="flex items-center gap-2 mb-1">
//           <div
//             className="p-2 rounded-lg"
//             style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}
//           >
//             <BookOpen className="h-4 w-4 text-white" />
//           </div>
//           <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
//             Course
//           </span>
//         </div>
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
//           Course Modules
//         </h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           Add and manage video/PDF lessons for this course
//         </p>
//       </div>

//       {/* ── Stat Row ── */}
//       <div className="px-6 pb-4">
//         <div className="grid grid-cols-3 gap-4">
//           {[
//             {
//               icon: <List size={18} />,
//               value: modules.length,
//               label: "Total Modules",
//               style: "linear-gradient(135deg,#1e3a8a,#2563eb)",
//             },
//             {
//               icon: <Video size={18} />,
//               value: modules.filter((m) => m.contentType === "VIDEO").length,
//               label: "Videos",
//               style: "linear-gradient(135deg,#0369a1,#0ea5e9)",
//             },
//             {
//               icon: <FileText size={18} />,
//               value: modules.filter((m) => m.contentType === "PDF").length,
//               label: "PDFs",
//               style: "linear-gradient(135deg,#92400e,#d97706)",
//             },
//           ].map((s, i) => (
//             <div
//               key={i}
//               className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
//               style={{ background: s.style }}
//             >
//               <span className="text-white/70">{s.icon}</span>
//               <span className="text-2xl font-extrabold">{s.value}</span>
//               <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">
//                 {s.label}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── 3-Panel Body ── */}
//       <div
//         ref={containerRef}
//         className="flex flex-1 mx-6 mb-6 overflow-hidden rounded-2xl
//                    border border-slate-200 dark:border-white/10
//                    bg-white dark:bg-[#162040] shadow-sm"
//         style={{ height: "calc(100vh - 270px)", minHeight: "420px" }}
//       >
//         {/* ═══ PANEL 1: Content Type (collapsible) ═══ */}
//         <div
//           className="flex-shrink-0 flex flex-col border-r border-slate-100 dark:border-white/10 transition-all duration-300 overflow-hidden"
//           style={{ width: leftCollapsed ? "0px" : "200px" }}
//         >
//           <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/10">
//             <List className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
//             <span className="text-sm font-bold text-slate-700 dark:text-white whitespace-nowrap">
//               Options
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
//                 Content Type
//               </p>
//               <div className="space-y-1">
//                 {["VIDEO", "PDF"].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => {
//                       setType(t);
//                       setFile(null);
//                       setTitle("");
//                       setAddError("");
//                     }}
//                     className={`w-full text-left text-sm px-3 py-2 rounded-lg transition font-medium flex items-center gap-2
//                       ${
//                         type === t
//                           ? "text-white"
//                           : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
//                       }`}
//                     style={
//                       type === t
//                         ? {
//                             background:
//                               "linear-gradient(135deg,#1e3a8a,#2563eb)",
//                           }
//                         : {}
//                     }
//                   >
//                     {t === "VIDEO" ? (
//                       <Video className="w-3.5 h-3.5" />
//                     ) : (
//                       <FileText className="w-3.5 h-3.5" />
//                     )}
//                     {t === "VIDEO" ? "Video" : "PDF"}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Left collapse handle */}
//         <div
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           className="relative flex-shrink-0 w-3 flex items-center justify-center
//                      cursor-pointer group z-10
//                      bg-slate-100 dark:bg-white/5
//                      border-r border-slate-200 dark:border-white/10
//                      hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
//         >
//           <div
//             className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
//                        bg-white dark:bg-[#1e3a5f]
//                        border border-slate-300 dark:border-white/20
//                        shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
//                        transition select-none"
//           >
//             {leftCollapsed ? (
//               <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
//             ) : (
//               <>
//                 <svg
//                   width="5"
//                   height="10"
//                   viewBox="0 0 6 12"
//                   fill="none"
//                   className="text-slate-400 group-hover:text-blue-500"
//                 >
//                   <path
//                     d="M1 1L0 6L1 11"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//                 <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
//                 <svg
//                   width="5"
//                   height="10"
//                   viewBox="0 0 6 12"
//                   fill="none"
//                   className="text-slate-400 group-hover:text-blue-500"
//                 >
//                   <path
//                     d="M5 1L6 6L5 11"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ═══ PANEL 2: Module List ═══ */}
//         <div className="flex-1 flex flex-col overflow-hidden min-w-0">
//           <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
//             <List className="w-4 h-4 text-blue-500 dark:text-blue-400" />
//             <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
//               Modules ({modules.length})
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-2">
//             {modules.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
//                 <BookOpen className="w-10 h-10 text-slate-400 dark:text-slate-500" />
//                 <p className="text-sm text-slate-400 dark:text-slate-500">
//                   No modules yet. Add your first lesson!
//                 </p>
//               </div>
//             )}

//             {modules.map((m, idx) => (
//               <div
//                 key={m.id}
//                 className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl
//                            border border-slate-100 dark:border-white/8
//                            bg-slate-50 dark:bg-white/3
//                            hover:border-blue-200 dark:hover:border-blue-700/40
//                            hover:bg-blue-50/50 dark:hover:bg-white/5 transition group"
//               >
//                 <div className="flex items-center gap-3 min-w-0">
//                   {/* Order badge */}
//                   <span
//                     className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
//                     style={{
//                       background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
//                     }}
//                   >
//                     {idx + 1}
//                   </span>

//                   {/* Type icon */}
//                   <div
//                     className={`flex-shrink-0 p-1.5 rounded-lg border
//                     ${
//                       m.contentType === "VIDEO"
//                         ? "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700/30"
//                         : "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700/30"
//                     }`}
//                   >
//                     {m.contentType === "VIDEO" ? (
//                       <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                     ) : (
//                       <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
//                     )}
//                   </div>

//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
//                       {m.title}
//                     </p>
//                     <p className="text-xs text-slate-400 truncate">{m.url}</p>
//                   </div>
//                 </div>

//                 {/* Action buttons */}
//                 <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
//                   <button
//                     onClick={() => setEditingModule(m)}
//                     className="p-1.5 rounded-lg
//                                text-slate-300 dark:text-slate-600
//                                hover:bg-blue-50 dark:hover:bg-blue-900/20
//                                hover:text-blue-500 dark:hover:text-blue-400
//                                border border-transparent
//                                hover:border-blue-200 dark:hover:border-blue-800/40
//                                transition"
//                     title="Edit module"
//                   >
//                     <Pencil className="w-4 h-4" />
//                   </button>

//                   <button
//                     onClick={() => deleteModule(m)}
//                     className="p-1.5 rounded-lg
//                                text-slate-300 dark:text-slate-600
//                                hover:bg-red-50 dark:hover:bg-red-900/20
//                                hover:text-red-500 dark:hover:text-red-400
//                                border border-transparent
//                                hover:border-red-200 dark:hover:border-red-800/40
//                                transition"
//                     title="Delete module"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ═══ Drag Handle between panel 2 & 3 ═══ */}
//         <div
//           onMouseDown={onMouseDown}
//           className="relative flex-shrink-0 w-3 flex items-center justify-center
//                      cursor-col-resize group z-10
//                      bg-slate-100 dark:bg-white/5
//                      border-x border-slate-200 dark:border-white/10
//                      hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
//         >
//           <div
//             className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
//                        bg-white dark:bg-[#1e3a5f]
//                        border border-slate-300 dark:border-white/20
//                        shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
//                        transition select-none"
//           >
//             <svg
//               width="5"
//               height="10"
//               viewBox="0 0 6 12"
//               fill="none"
//               className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400"
//             >
//               <path
//                 d="M1 1L0 6L1 11"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//               />
//             </svg>
//             <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
//             <svg
//               width="5"
//               height="10"
//               viewBox="0 0 6 12"
//               fill="none"
//               className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400"
//             >
//               <path
//                 d="M5 1L6 6L5 11"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* ═══ PANEL 3: Add Module Form ═══ */}
//         <div
//           className="flex-shrink-0 flex flex-col border-l border-slate-100 dark:border-white/10"
//           style={{ width: `${rightWidth}px` }}
//         >
//           <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
//             <div
//               className="p-1.5 rounded-lg"
//               style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
//             >
//               <Plus className="w-3.5 h-3.5 text-white" />
//             </div>
//             <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
//               Add Module
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
//             {/* Lesson Title */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                 Lesson Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 placeholder="e.g., Introduction to React"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full rounded-xl px-3 py-2.5 text-sm
//                            bg-slate-50 dark:bg-white/5
//                            border border-slate-200 dark:border-white/10
//                            text-slate-800 dark:text-slate-100
//                            placeholder-slate-400 dark:placeholder-slate-500
//                            focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//               />
//             </div>

//             {/* Content Type */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                 Content Type
//               </label>
//               <div className="flex gap-2">
//                 {["VIDEO", "PDF"].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => {
//                       setType(t);
//                       setFile(null);
//                       setTitle("");
//                       setAddError("");
//                     }}
//                     className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
//                       ${
//                         type === t
//                           ? "text-white border-transparent"
//                           : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-blue-300"
//                       }`}
//                     style={
//                       type === t
//                         ? {
//                             background:
//                               "linear-gradient(135deg,#1e3a8a,#2563eb)",
//                           }
//                         : {}
//                     }
//                   >
//                     {t === "VIDEO" ? (
//                       <Video className="w-3.5 h-3.5" />
//                     ) : (
//                       <FileText className="w-3.5 h-3.5" />
//                     )}
//                     {t === "VIDEO" ? "Video" : "PDF"}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* File Upload */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                 Upload File <span className="text-red-500">*</span>
//               </label>
//               <label
//                 className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl
//                            border-2 border-dashed border-slate-200 dark:border-white/15
//                            bg-slate-50 dark:bg-white/3
//                            hover:border-blue-400 dark:hover:border-blue-600
//                            hover:bg-blue-50/50 dark:hover:bg-blue-900/10
//                            cursor-pointer transition"
//               >
//                 <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500" />
//                 <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
//                   {file ? (
//                     <span className="text-blue-600 dark:text-blue-400 font-medium">
//                       {file.name}
//                     </span>
//                   ) : (
//                     `Click to upload ${type === "VIDEO" ? "video" : "PDF"}`
//                   )}
//                 </span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept={
//                     type === "VIDEO" ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx"
//                   }
//                   onChange={handleFileChange}
//                 />
//               </label>
//             </div>

//             {/* Error */}
//             {addError && (
//               <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
//                 <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
//                 <p className="text-xs text-red-600 dark:text-red-400">
//                   {addError}
//                 </p>
//               </div>
//             )}

//             {/* Submit */}
//             <button
//               onClick={uploadAsset}
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-2
//                          px-4 py-2.5 rounded-xl text-sm font-semibold text-white
//                          shadow-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" /> Saving...
//                 </>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4" /> Add Module
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







































import axios from "axios";
import {
  FileText,
  Plus,
  Trash2,
  Video,
  BookOpen,
  ChevronRight,
  Upload,
  List,
  Pencil,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import videoService from "../services/videoService"; // adjust path as needed
import fileService from "../services/fileService"; // adjust path as needed

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

/* ─────────────────── HELPER ─────────────────── */
const extractTitle = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ─────────────────── EDIT MODAL ─────────────────── */
const EditModal = ({ module, onClose, onSaved }) => {
  const [editTitle, setEditTitle] = useState(module.title || "");
  const [editFile, setEditFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setEditFile(f);
    // Auto-fill title only if user hasn't typed one yet
    if (!editTitle.trim() || editTitle === module.title) {
      setEditTitle(extractTitle(f.name));
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setError("Lesson title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ─── Step 1: Upload NEW physical file if one was chosen ───
      // FIX: We don't have module.fileId (content record only stores the URL,
      //      not the CourseVideo/CourseFile row ID).
      //      Solution: upload a new file instead of trying to update by ID.
      let updatedUrl = module.url;

      if (editFile) {
        if (module.contentType === "VIDEO") {
          // Upload new video → get new stream URL back
          const res = await videoService.uploadCourseVideo(
            editFile,
            module.courseId,
            module.moduleId ?? 0,
            module.batchId ?? 0,
          );
          updatedUrl = res.data?.url;
        } else {
          // Upload new PDF → get new download URL back
          const res = await fileService.uploadCourseFile(
            editFile,
            module.courseId,
            module.moduleId ?? 0,
            module.batchId ?? 0,
          );
          updatedUrl = res.data?.url;
        }
      }

      // ─── Step 2: Update the content-service record (title + url) ───
      await axios.put(
        `${API}/content/${module.id}`,
        {
          title: editTitle.trim(),
          url: updatedUrl,
          contentType: module.contentType,
        },
        { headers: authHeader() },
      );

      setSuccess("Module updated successfully!");
      setTimeout(() => {
        onSaved({ ...module, title: editTitle.trim(), url: updatedUrl });
        onClose();
      }, 800);
    } catch (err) {
      console.error("Edit failed:", err);
      setError(
        err?.response?.data?.message || "Update failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
                   bg-white dark:bg-[#162040]
                   border border-slate-200 dark:border-white/10"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4
                     border-b border-slate-100 dark:border-white/10"
          style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)" }}
        >
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-white/80" />
            <span className="text-sm font-bold text-white tracking-wide">
              Edit Module
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Current file info */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl
                       bg-slate-50 dark:bg-white/5
                       border border-slate-200 dark:border-white/10"
          >
            {module.contentType === "VIDEO" ? (
              <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Current File
              </p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                {module.url || "No file"}
              </p>
            </div>
          </div>

          {/* Lesson Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Lesson Title <span className="text-red-500">*</span>
            </label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter lesson title"
              className="w-full rounded-xl px-3 py-2.5 text-sm
                         bg-slate-50 dark:bg-white/5
                         border border-slate-200 dark:border-white/10
                         text-slate-800 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
            />
          </div>

          {/* Replace File */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Replace File{" "}
              <span className="text-slate-300 dark:text-slate-600">
                (optional)
              </span>
            </label>
            <label
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl
                         border-2 border-dashed border-slate-200 dark:border-white/15
                         bg-slate-50 dark:bg-white/3
                         hover:border-blue-400 dark:hover:border-blue-600
                         hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                         cursor-pointer transition"
            >
              <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {editFile ? (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {editFile.name}
                  </span>
                ) : (
                  `Click to replace ${module.contentType === "VIDEO" ? "video" : "PDF"}`
                )}
              </span>
              <input
                type="file"
                className="hidden"
                accept={
                  module.contentType === "VIDEO"
                    ? "video/*"
                    : ".pdf,.doc,.docx,.ppt,.pptx"
                }
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-green-600 dark:text-green-400">
                {success}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                       text-slate-600 dark:text-slate-300
                       border border-slate-200 dark:border-white/10
                       bg-slate-50 dark:bg-white/5
                       hover:border-slate-300 dark:hover:border-white/20
                       disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                       text-sm font-semibold text-white shadow-md
                       hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function TrainerCourseModules() {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("VIDEO");
  const [loading, setLoading] = useState(false);
  const [addError, setAddError] = useState("");

  /* Edit modal */
  const [editingModule, setEditingModule] = useState(null);

  /* ── Panel resize ── */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(300);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const fromRight = rect.right - e.clientX;
    if (fromRight > 220 && fromRight < 520) setRightWidth(fromRight);
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

  /* ── Data ── */
  useEffect(() => {
    loadModules();
  }, [courseId]);

  const loadModules = async () => {
    try {
      const res = await axios.get(`${API}/content/course/${courseId}`, {
        headers: authHeader(),
      });
      setModules(res.data);
    } catch (err) {
      console.error("Failed to load modules", err);
    }
  };

  /* ── File select with auto-title ── */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (!title.trim()) setTitle(extractTitle(f.name));
  };

  /* ── Upload / Add module ── */
  const uploadAsset = async () => {
    if (!title.trim()) {
      setAddError("Lesson title is required");
      return;
    }
    if (!file) {
      setAddError(`Please select a ${type === "VIDEO" ? "video" : "PDF"} file`);
      return;
    }

    try {
      setLoading(true);
      setAddError("");

      let fileUrl;
      if (type === "VIDEO") {
        const res = await videoService.uploadCourseVideo(file, courseId, 0, 0);
        fileUrl = res.data?.url;
      } else {
        const res = await fileService.uploadCourseFile(file, courseId, 0, 0);
        fileUrl = res.data?.url;
      }

      await axios.post(
        `${API}/content`,
        {
          courseId,
          title: title.trim(),
          contentType: type,
          url: fileUrl,
          orderIndex: modules.length + 1,
        },
        { headers: authHeader() },
      );

      setTitle("");
      setFile(null);
      loadModules();
    } catch (err) {
      console.error(err);
      setAddError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete ── */
  const deleteModule = async (module) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await axios.delete(`${API}/content/${module.id}`, {
        headers: authHeader(),
      });
      setModules((prev) => prev.filter((m) => m.id !== module.id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ── After edit saved ── */
  const handleModuleSaved = (updated) => {
    setModules((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  /* ────────────────── RENDER ────────────────── */
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] flex flex-col">
      {/* Edit Modal */}
      {editingModule && (
        <EditModal
          module={editingModule}
          onClose={() => setEditingModule(null)}
          onSaved={handleModuleSaved}
        />
      )}

      {/* ── Page Title ── */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="p-2 rounded-lg"
            style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}
          >
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Course
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Course Modules
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Add and manage video/PDF lessons for this course
        </p>
      </div>

      {/* ── Stat Row ── */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: <List size={18} />,
              value: modules.length,
              label: "Total Modules",
              style: "linear-gradient(135deg,#1e3a8a,#2563eb)",
            },
            {
              icon: <Video size={18} />,
              value: modules.filter((m) => m.contentType === "VIDEO").length,
              label: "Videos",
              style: "linear-gradient(135deg,#0369a1,#0ea5e9)",
            },
            {
              icon: <FileText size={18} />,
              value: modules.filter((m) => m.contentType === "PDF").length,
              label: "PDFs",
              style: "linear-gradient(135deg,#92400e,#d97706)",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
              style={{ background: s.style }}
            >
              <span className="text-white/70">{s.icon}</span>
              <span className="text-2xl font-extrabold">{s.value}</span>
              <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3-Panel Body ── */}
      <div
        ref={containerRef}
        className="flex flex-1 mx-6 mb-6 overflow-hidden rounded-2xl
                   border border-slate-200 dark:border-white/10
                   bg-white dark:bg-[#162040] shadow-sm"
        style={{ height: "calc(100vh - 270px)", minHeight: "420px" }}
      >
        {/* ═══ PANEL 1: Content Type (collapsible) ═══ */}
        <div
          className="flex-shrink-0 flex flex-col border-r border-slate-100 dark:border-white/10 transition-all duration-300 overflow-hidden"
          style={{ width: leftCollapsed ? "0px" : "200px" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/10">
            <List className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="text-sm font-bold text-slate-700 dark:text-white whitespace-nowrap">
              Options
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Content Type
              </p>
              <div className="space-y-1">
                {["VIDEO", "PDF"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      setFile(null);
                      setTitle("");
                      setAddError("");
                    }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition font-medium flex items-center gap-2
                      ${
                        type === t
                          ? "text-white"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    style={
                      type === t
                        ? {
                            background:
                              "linear-gradient(135deg,#1e3a8a,#2563eb)",
                          }
                        : {}
                    }
                  >
                    {t === "VIDEO" ? (
                      <Video className="w-3.5 h-3.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    {t === "VIDEO" ? "Video" : "PDF"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Left collapse handle */}
        <div
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          className="relative flex-shrink-0 w-3 flex items-center justify-center
                     cursor-pointer group z-10
                     bg-slate-100 dark:bg-white/5
                     border-r border-slate-200 dark:border-white/10
                     hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
        >
          <div
            className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
                       bg-white dark:bg-[#1e3a5f]
                       border border-slate-300 dark:border-white/20
                       shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
                       transition select-none"
          >
            {leftCollapsed ? (
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
            ) : (
              <>
                <svg
                  width="5"
                  height="10"
                  viewBox="0 0 6 12"
                  fill="none"
                  className="text-slate-400 group-hover:text-blue-500"
                >
                  <path
                    d="M1 1L0 6L1 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
                <svg
                  width="5"
                  height="10"
                  viewBox="0 0 6 12"
                  fill="none"
                  className="text-slate-400 group-hover:text-blue-500"
                >
                  <path
                    d="M5 1L6 6L5 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </>
            )}
          </div>
        </div>

        {/* ═══ PANEL 2: Module List ═══ */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
            <List className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
              Modules ({modules.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {modules.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                <BookOpen className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  No modules yet. Add your first lesson!
                </p>
              </div>
            )}

            {modules.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                           border border-slate-100 dark:border-white/8
                           bg-slate-50 dark:bg-white/3
                           hover:border-blue-200 dark:hover:border-blue-700/40
                           hover:bg-blue-50/50 dark:hover:bg-white/5 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Order badge */}
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                    }}
                  >
                    {idx + 1}
                  </span>

                  {/* Type icon */}
                  <div
                    className={`flex-shrink-0 p-1.5 rounded-lg border
                    ${
                      m.contentType === "VIDEO"
                        ? "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700/30"
                        : "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700/30"
                    }`}
                  >
                    {m.contentType === "VIDEO" ? (
                      <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{m.url}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => setEditingModule(m)}
                    className="p-1.5 rounded-lg
                               text-slate-300 dark:text-slate-600
                               hover:bg-blue-50 dark:hover:bg-blue-900/20
                               hover:text-blue-500 dark:hover:text-blue-400
                               border border-transparent
                               hover:border-blue-200 dark:hover:border-blue-800/40
                               transition"
                    title="Edit module"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteModule(m)}
                    className="p-1.5 rounded-lg
                               text-slate-300 dark:text-slate-600
                               hover:bg-red-50 dark:hover:bg-red-900/20
                               hover:text-red-500 dark:hover:text-red-400
                               border border-transparent
                               hover:border-red-200 dark:hover:border-red-800/40
                               transition"
                    title="Delete module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Drag Handle between panel 2 & 3 ═══ */}
        <div
          onMouseDown={onMouseDown}
          className="relative flex-shrink-0 w-3 flex items-center justify-center
                     cursor-col-resize group z-10
                     bg-slate-100 dark:bg-white/5
                     border-x border-slate-200 dark:border-white/10
                     hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
        >
          <div
            className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
                       bg-white dark:bg-[#1e3a5f]
                       border border-slate-300 dark:border-white/20
                       shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
                       transition select-none"
          >
            <svg
              width="5"
              height="10"
              viewBox="0 0 6 12"
              fill="none"
              className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400"
            >
              <path
                d="M1 1L0 6L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
            <svg
              width="5"
              height="10"
              viewBox="0 0 6 12"
              fill="none"
              className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400"
            >
              <path
                d="M5 1L6 6L5 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* ═══ PANEL 3: Add Module Form ═══ */}
        <div
          className="flex-shrink-0 flex flex-col border-l border-slate-100 dark:border-white/10"
          style={{ width: `${rightWidth}px` }}
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
            <div
              className="p-1.5 rounded-lg"
              style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
              Add Module
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {/* Lesson Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Introduction to React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm
                           bg-slate-50 dark:bg-white/5
                           border border-slate-200 dark:border-white/10
                           text-slate-800 dark:text-slate-100
                           placeholder-slate-400 dark:placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
              />
            </div>

            {/* Content Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Content Type
              </label>
              <div className="flex gap-2">
                {["VIDEO", "PDF"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      setFile(null);
                      setTitle("");
                      setAddError("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
                      ${
                        type === t
                          ? "text-white border-transparent"
                          : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-blue-300"
                      }`}
                    style={
                      type === t
                        ? {
                            background:
                              "linear-gradient(135deg,#1e3a8a,#2563eb)",
                          }
                        : {}
                    }
                  >
                    {t === "VIDEO" ? (
                      <Video className="w-3.5 h-3.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    {t === "VIDEO" ? "Video" : "PDF"}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Upload File <span className="text-red-500">*</span>
              </label>
              <label
                className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl
                           border-2 border-dashed border-slate-200 dark:border-white/15
                           bg-slate-50 dark:bg-white/3
                           hover:border-blue-400 dark:hover:border-blue-600
                           hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                           cursor-pointer transition"
              >
                <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  {file ? (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {file.name}
                    </span>
                  ) : (
                    `Click to upload ${type === "VIDEO" ? "video" : "PDF"}`
                  )}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={
                    type === "VIDEO" ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx"
                  }
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Error */}
            {addError && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400">
                  {addError}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={uploadAsset}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2
                         px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                         shadow-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Module
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
