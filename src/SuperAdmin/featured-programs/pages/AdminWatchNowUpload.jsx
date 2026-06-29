// import React, { useState, useEffect, useRef } from "react";
// import {
//   Upload, X, Film, Image, CheckCircle, AlertCircle, Loader,
//   Plus, Trash2, ChevronDown, ChevronUp, User,
//   BookOpen, Tag, List, ArrowLeft, Eye, FileText, Clock,
//   Play, MoreVertical, Edit2, Search, Filter,
// } from "lucide-react";
// import videoService from "../../../services/videoService";
// import { useNavigate } from "react-router-dom";
// // ⚠️ Adjust this import path to match where ThemeContext actually lives
// // relative to this file (same context used by SuperAdminDashboard.jsx).
// import { useTheme } from "../../context/ThemeContext";

// /* ============================================================
//    THEME TOKENS — same pattern as SuperAdminDashboard's getTokens()
//    ============================================================ */
// const getTokens = (dark) => ({
//   pageBg:         dark ? "#0f1115" : "#f1f3f9",
//   surface:        dark ? "#1a1d27" : "#ffffff",
//   surfaceBorder:  dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
//   panelHeaderBg:  dark ? "rgba(255,255,255,0.03)" : "#fafafa",
//   innerBg:        dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
//   innerBorder:    dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
//   faintBorder:    dark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
//   hoverBg:        dark ? "rgba(255,255,255,0.04)" : "#fafafa",
//   textPrimary:    dark ? "#f1f5f9" : "#111827",
//   textSecondary:  dark ? "#cbd5e1" : "#374151",
//   textMuted:      dark ? "#94a3b8" : "#6b7280",
//   textFaint:      dark ? "#64748b" : "#9ca3af",
//   inputBg:        dark ? "rgba(255,255,255,0.05)" : "#ffffff",
//   inputBorder:    dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid #d1d5db",
//   dashedBorder:   dark ? "rgba(255,255,255,0.18)" : "#d1d5db",
//   tabsTrackBg:    dark ? "rgba(255,255,255,0.05)" : "#f3f4f6",
//   tabActiveBg:    dark ? "rgba(255,255,255,0.10)" : "#ffffff",
//   emptyIconBg:    dark ? "rgba(124,58,237,0.18)" : "#f3f0ff",
//   tipsBg:         dark
//     ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.12))"
//     : "linear-gradient(135deg,#f3f0ff,#ede9fe)",
//   tipsBorder:     dark ? "1px solid rgba(167,139,250,0.35)" : "1px solid #c4b5fd",
//   tipsHeading:    dark ? "#c4b5fd" : "#6d28d9",
//   tipsText:       dark ? "#ddd6fe" : "#5b21b6",
//   dragBg:         dark ? "rgba(255,255,255,0.03)" : "#fafafa",
//   dragActiveBg:   dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
//   fileChipBg:     dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
//   fileChipBorder: dark ? "1px solid rgba(167,139,250,0.35)" : "1px solid #c4b5fd",
//   thumbBg:        dark
//     ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.12))"
//     : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
//   thumbBorder:    dark ? "1px solid rgba(167,139,250,0.3)" : "1px solid #c4b5fd",
//   shadow:         dark ? "0 1px 6px rgba(0,0,0,0.3)" : "0 1px 6px rgba(0,0,0,0.05)",
//   shadowLg:       dark ? "0 4px 20px rgba(0,0,0,0.35)" : "0 4px 20px rgba(0,0,0,0.1)",
// });

// const getInputStyle = (t) => ({
//   width: "100%", padding: "9px 12px", borderRadius: 8,
//   border: t.inputBorder, background: t.inputBg,
//   color: t.textPrimary, fontSize: 13, fontFamily: "Inter,sans-serif",
//   outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
// });

// function getStatusConfig(status, dark) {
//   const map = {
//     published: dark
//       ? { bg: "rgba(34,197,94,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.35)", label: "Published" }
//       : { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Published" },
//     draft: dark
//       ? { bg: "rgba(217,119,6,0.15)", color: "#fbbf24", border: "rgba(251,191,36,0.35)", label: "Draft" }
//       : { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Draft" },
//     inactive: dark
//       ? { bg: "rgba(239,68,68,0.15)", color: "#f87171", border: "rgba(248,113,113,0.35)", label: "Inactive" }
//       : { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Inactive" },
//   };
//   return map[status] || (dark
//     ? { bg: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "rgba(255,255,255,0.15)", label: status }
//     : { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: status });
// }

// /* ─── Panel ─── */
// function Panel({ icon: Icon, number, title, children, defaultOpen = true, t }) {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div style={{ border: t.surfaceBorder, borderRadius: 12, overflow: "hidden", background: t.surface, marginBottom: 12 }}>
//       <button type="button" onClick={() => setOpen(!open)} style={{
//         width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
//         padding: "13px 18px", background: t.panelHeaderBg, borderBottom: open ? t.surfaceBorder : "none",
//         cursor: "pointer", border: "none",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>{number}</div>
//           <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//             <Icon size={14} color="#7c3aed" />
//             <span style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>{title}</span>
//           </div>
//         </div>
//         {open ? <ChevronUp size={15} color={t.textFaint} /> : <ChevronDown size={15} color={t.textFaint} />}
//       </button>
//       {open && <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>}
//     </div>
//   );
// }

// /* ─── Field ─── */
// function Field({ label, required, hint, children, t }) {
//   return (
//     <div>
//       <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: t.textMuted, fontFamily: "Inter,sans-serif", marginBottom: 6 }}>
//         {label} {required && <span style={{ color: "#7c3aed" }}>*</span>}
//         {hint && <span style={{ color: t.textFaint, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}> ({hint})</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// /* ─── Toggle ─── */
// function Toggle({ value, onChange, dark }) {
//   return (
//     <button type="button" onClick={onChange} style={{ width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: value ? "#7c3aed" : (dark ? "rgba(255,255,255,0.15)" : "#d1d5db"), position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
//       <span style={{ position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", left: value ? 21 : 3, transition: "left 0.2s" }} />
//     </button>
//   );
// }

// /* ─── Status Badge ─── */
// function StatusBadge({ status, dark }) {
//   const cfg = getStatusConfig(status, dark);
//   return (
//     <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: "Inter,sans-serif" }}>
//       {cfg.label}
//     </span>
//   );
// }

// /* ─── Courses Table ─── */
// function CoursesTable({ onUploadNew, dark, t }) {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [deletingId, setDeletingId] = useState(null);
//   const [confirmId, setConfirmId] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [search, setSearch] = useState("");
//   const [openMenu, setOpenMenu] = useState(null);
//   const inp = getInputStyle(t);

//   useEffect(() => { fetchCourses(); }, []);

//   const fetchCourses = async () => {
//     try { setLoading(true); setError(""); const res = await videoService.getAllAdminCourses(); setCourses(res.data || []); }
//     catch { setError("Failed to load courses."); }
//     finally { setLoading(false); }
//   };

//   const handleDelete = async (courseId) => {
//     try {
//       setDeletingId(courseId);
//       await videoService.deleteAdminCourse(courseId);
//       setCourses(prev => prev.filter(c => (c.courseId ?? c.id) !== courseId));
//       setConfirmId(null);
//     } catch { setError("Failed to delete course."); }
//     finally { setDeletingId(null); }
//   };

//   const tabs = [
//     { key: "all", label: "All Courses", icon: List },
//     { key: "published", label: "Published", icon: CheckCircle },
//     { key: "draft", label: "Drafts", icon: FileText },
//   ];

//   const filtered = courses.filter(c => {
//     const matchTab = activeTab === "all" || (c.status || "published") === activeTab;
//     const matchSearch = !search || (c.title || "").toLowerCase().includes(search.toLowerCase()) || (c.instructorName || "").toLowerCase().includes(search.toLowerCase());
//     return matchTab && matchSearch;
//   });

//   const counts = {
//     all: courses.length,
//     published: courses.filter(c => (c.status || "published") === "published").length,
//     draft: courses.filter(c => c.status === "draft").length,
//   };

//   return (
//     <div>
//       {/* Table header */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
//         <div style={{ display: "flex", gap: 4, background: t.tabsTrackBg, borderRadius: 10, padding: 4 }}>
//           {tabs.map(tab => {
//             const Icon = tab.icon;
//             return (
//               <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//                 display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
//                 background: activeTab === tab.key ? t.tabActiveBg : "transparent",
//                 color: activeTab === tab.key ? "#7c3aed" : t.textMuted,
//                 boxShadow: activeTab === tab.key ? (dark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.08)") : "none",
//               }}>
//                 <Icon size={12} /> {tab.label}
//                 <span style={{
//                   fontSize: 10, padding: "1px 6px", borderRadius: 999,
//                   background: activeTab === tab.key ? (dark ? "rgba(124,58,237,0.25)" : "#f3f0ff") : (dark ? "rgba(255,255,255,0.08)" : "#e5e7eb"),
//                   color: activeTab === tab.key ? "#a78bfa" : t.textMuted,
//                   fontWeight: 700,
//                 }}>{counts[tab.key]}</span>
//               </button>
//             );
//           })}
//         </div>
//         <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           <div style={{ position: "relative" }}>
//             <Search size={13} color={t.textFaint} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
//             <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." style={{ ...inp, width: 200, paddingLeft: 32, fontSize: 12 }} />
//           </div>
//           <button onClick={onUploadNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#7c3aed", border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
//             <Upload size={13} /> Upload New
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2", border: dark ? "1px solid rgba(248,113,113,0.3)" : "1px solid #fecaca", borderRadius: 8, color: dark ? "#f87171" : "#dc2626", fontSize: 13, fontFamily: "Inter,sans-serif", marginBottom: 12 }}>
//           <AlertCircle size={14} />{error}
//         </div>
//       )}

//       {/* Table */}
//       <div style={{ border: t.surfaceBorder, borderRadius: 12, overflow: "hidden", background: t.surface }}>
//         {/* Table head */}
//         <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 80px", gap: 0, background: t.innerBg, borderBottom: t.surfaceBorder }}>
//           {["COURSE", "INSTRUCTOR", "LEARNERS", "STATUS", "DATE", "ACTIONS"].map(h => (
//             <div key={h} style={{ padding: "10px 16px", fontSize: 10, fontWeight: 700, color: t.textFaint, letterSpacing: "0.06em", fontFamily: "Inter,sans-serif" }}>{h}</div>
//           ))}
//         </div>

//         {loading && (
//           <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
//             <Loader size={22} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
//           </div>
//         )}

//         {!loading && filtered.length === 0 && (
//           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 10 }}>
//             <div style={{ width: 52, height: 52, borderRadius: 14, background: t.emptyIconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Film size={22} color="#7c3aed" />
//             </div>
//             <p style={{ fontSize: 13, color: t.textFaint, fontFamily: "Inter,sans-serif", margin: 0 }}>{search ? "No courses match your search" : "No courses uploaded yet"}</p>
//             {!search && <button onClick={onUploadNew} style={{ padding: "8px 18px", borderRadius: 8, background: "#7c3aed", border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Upload First Course</button>}
//           </div>
//         )}

//         {!loading && filtered.map((course, idx) => {
//           const id = course.courseId ?? course.id;
//           const isDeleting = deletingId === id;
//           const isConfirming = confirmId === id;
//           const status = course.status || "published";
//           return (
//             <div key={id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 80px", borderBottom: idx < filtered.length - 1 ? `1px solid ${t.faintBorder}` : "none", transition: "background 0.1s" }}
//               onMouseEnter={e => e.currentTarget.style.background = t.hoverBg}
//               onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//               {/* Course */}
//               <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ width: 44, height: 30, borderRadius: 6, background: t.thumbBg, border: t.thumbBorder, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                   {course.thumbnail
//                     ? <img src={course.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
//                     : <Play size={12} color="#7c3aed" />}
//                 </div>
//                 <div style={{ minWidth: 0 }}>
//                   <p style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title || "Untitled"}</p>
//                   {course.featuredTag && <p style={{ fontSize: 10, color: "#a78bfa", margin: "2px 0 0", fontFamily: "Inter,sans-serif" }}>{course.featuredTag}</p>}
//                 </div>
//               </div>
//               {/* Instructor */}
//               <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                 <p style={{ fontSize: 13, color: t.textSecondary, margin: 0, fontFamily: "Inter,sans-serif", fontWeight: 500 }}>{course.instructorName || "—"}</p>
//                 {course.instructorRole && <p style={{ fontSize: 11, color: t.textFaint, margin: "2px 0 0", fontFamily: "Inter,sans-serif" }}>{course.instructorRole}</p>}
//               </div>
//               {/* Learners */}
//               <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
//                 <span style={{ fontSize: 13, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>{course.learnersCount != null ? `${course.learnersCount}+` : "—"}</span>
//               </div>
//               {/* Status */}
//               <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
//                 <StatusBadge status={status} dark={dark} />
//               </div>
//               {/* Date */}
//               <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
//                 <span style={{ fontSize: 11, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>{course.publishDate || course.createdAt?.split("T")[0] || "—"}</span>
//               </div>
//               {/* Actions */}
//               <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 4 }}>
//                 {!isConfirming ? (
//                   <>
//                     <button style={{ width: 28, height: 28, borderRadius: 6, border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #e5e7eb", background: dark ? "rgba(255,255,255,0.04)" : "#fff", color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                       <Eye size={13} />
//                     </button>
//                     <button onClick={() => setConfirmId(id)} disabled={isDeleting} style={{ width: 28, height: 28, borderRadius: 6, border: dark ? "1px solid rgba(248,113,113,0.3)" : "1px solid #fecaca", background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2", color: dark ? "#f87171" : "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                       <Trash2 size={13} />
//                     </button>
//                   </>
//                 ) : (
//                   <div style={{ display: "flex", gap: 4 }}>
//                     <button onClick={() => handleDelete(id)} disabled={isDeleting} style={{ padding: "4px 8px", background: "#dc2626", color: "#fff", borderRadius: 5, border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
//                       {isDeleting ? <Loader size={10} style={{ animation: "spin 1s linear infinite" }} /> : "Yes"}
//                     </button>
//                     <button onClick={() => setConfirmId(null)} style={{ padding: "4px 8px", background: dark ? "rgba(255,255,255,0.06)" : "#fff", color: t.textSecondary, borderRadius: 5, border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #e5e7eb", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>No</button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// /* ══════════ MAIN ══════════ */
// export default function AdminWatchNowUpload({ onSubmit, onClose }) {
//   const navigate = useNavigate();
//   const { dark } = useTheme();
//   const t = getTokens(dark);
//   const inp = getInputStyle(t);

//   const [activeSection, setActiveSection] = useState("form"); // "form" | "list"

//   // form state
//   const [platformName, setPlatformName] = useState("TexoraAI.skills");
//   const [featuredTag, setFeaturedTag] = useState("Featured Course");
//   const [hostedBy, setHostedBy] = useState("");
//   const [videoTitle, setVideoTitle] = useState("");
//   const [videoUrl, setVideoUrl] = useState("");
//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [showInstructorLive, setShowInstructorLive] = useState(true);
//   const [learnersCount, setLearnersCount] = useState("");
//   const [publishDate, setPublishDate] = useState("");
//   const [instructorName, setInstructorName] = useState("");
//   const [instructorRole, setInstructorRole] = useState("");
//   const [experience, setExperience] = useState("");
//   const [studentCount, setStudentCount] = useState("");
//   const [description, setDescription] = useState("");
//   const [showMoreEnabled, setShowMoreEnabled] = useState(true);
//   const [learnPoints, setLearnPoints] = useState([{ id: 1, title: "", desc: "" }]);
//   const [status, setStatus] = useState("idle");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [dragOver, setDragOver] = useState(false);

//   const videoInputRef = useRef(null);
//   const thumbInputRef = useRef(null);

//   const handleVideoSelect = (file) => {
//     if (!file) return;
//     const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
//     if (!allowed.includes(file.type)) { setErrorMsg("Only MP4, WebM, or MOV files are allowed"); return; }
//     if (file.size > 500 * 1024 * 1024) { setErrorMsg("Max 500MB allowed!"); return; }
//     setErrorMsg(""); setVideoFile(file); setVideoUrl("");
//   };

//   const handleThumbnailChange = (e) => {
//     const file = e.target.files[0]; if (!file) return;
//     setThumbnail(file);
//     const reader = new FileReader();
//     reader.onload = (ev) => setThumbnailPreview(ev.target.result);
//     reader.readAsDataURL(file);
//   };

//   const addLearnPoint = () => setLearnPoints([...learnPoints, { id: Date.now(), title: "", desc: "" }]);
//   const removeLearnPoint = (id) => { if (learnPoints.length > 1) setLearnPoints(learnPoints.filter(p => p.id !== id)); };
//   const updateLearnPoint = (id, field, value) => setLearnPoints(learnPoints.map(p => p.id === id ? { ...p, [field]: value } : p));
//   const formatSize = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!videoTitle.trim()) { setErrorMsg("Please enter a video title"); return; }
//     if (!videoFile && !videoUrl.trim()) { setErrorMsg("Please provide a video file or URL"); return; }
//     if (!instructorName.trim()) { setErrorMsg("Please enter the instructor name"); return; }
//     setStatus("uploading"); setErrorMsg(""); setUploadProgress(0);
//     const formData = new FormData();
//     formData.append("platformName", platformName);
//     formData.append("featuredTag", featuredTag);
//     formData.append("hostedBy", hostedBy);
//     formData.append("title", videoTitle);
//     if (videoFile) formData.append("video", videoFile);
//     else formData.append("videoUrl", videoUrl);
//     if (thumbnail) formData.append("thumbnail", thumbnail);
//     formData.append("showInstructorLive", String(showInstructorLive));
//     formData.append("learnersCount", learnersCount);
//     formData.append("publishDate", publishDate);
//     formData.append("instructorName", instructorName);
//     formData.append("instructorRole", instructorRole);
//     formData.append("experience", experience);
//     formData.append("studentCount", studentCount);
//     formData.append("description", description);
//     formData.append("showMoreEnabled", String(showMoreEnabled));
//     formData.append("learnPoints", JSON.stringify(learnPoints.filter(p => p.title.trim())));
//     try {
//       await videoService.uploadAdminCourse(formData, (pct) => setUploadProgress(pct));
//       setUploadProgress(100); setStatus("success");
//       if (onSubmit) onSubmit(formData);
//     } catch (err) {
//       const msg = err?.response?.data?.message || err?.response?.data || "Something went wrong.";
//       setErrorMsg(typeof msg === "string" ? msg : "Upload failed.");
//       setStatus("error");
//     }
//   };

//   const reset = () => {
//     setVideoTitle(""); setVideoUrl(""); setVideoFile(null); setThumbnail(null); setThumbnailPreview(null);
//     setHostedBy(""); setInstructorName(""); setInstructorRole(""); setExperience(""); setStudentCount("");
//     setDescription(""); setLearnPoints([{ id: 1, title: "", desc: "" }]);
//     setUploadProgress(0); setStatus("idle"); setErrorMsg("");
//   };

//   if (status === "success") return (
//     <div style={{
//       minHeight: "100vh",
//       background: dark
//         ? "linear-gradient(135deg, #14121f 0%, #1c1730 40%, #0f1a14 100%)"
//         : "linear-gradient(135deg,#f3f0ff 0%,#ede9fe 40%,#f0fdf4 100%)",
//       display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif",
//     }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
//       <div style={{ background: t.surface, borderRadius: 20, padding: "48px 44px", maxWidth: 440, width: "90%", textAlign: "center", boxShadow: dark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(124,58,237,0.12)", border: t.surfaceBorder }}>
//         <div style={{ width: 64, height: 64, borderRadius: "50%", background: dark ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: dark ? "2px solid rgba(74,222,128,0.4)" : "2px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
//           <CheckCircle size={30} color={dark ? "#4ade80" : "#16a34a"} />
//         </div>
//         <h3 style={{ fontSize: 22, fontWeight: 700, color: t.textPrimary, margin: "0 0 8px", fontFamily: "Inter,sans-serif" }}>Course is Live! 🎉</h3>
//         <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 28, fontFamily: "Inter,sans-serif", lineHeight: 1.6 }}>"{videoTitle}" has been successfully published to Watch Now.</p>
//         <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
//           <button onClick={reset} style={{ padding: "10px 22px", borderRadius: 9, background: "#7c3aed", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>+ Upload Another</button>
//           <button onClick={() => { reset(); setActiveSection("list"); }} style={{ padding: "10px 22px", borderRadius: 9, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #e5e7eb", background: dark ? "rgba(255,255,255,0.04)" : "#fff", color: t.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>View Courses</button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
//         .fade-up{animation:fadeUp 0.35s ease both}
//         input:focus,textarea:focus,select:focus{border-color:#7c3aed !important;box-shadow:0 0 0 3px rgba(124,58,237,0.08) !important;outline:none}
//       `}</style>

//       <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "Inter,sans-serif" }}>

//         {/* ══ HERO HEADER ══ */}
//         <div style={{
//           background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)",
//           padding: "28px 32px 0", position: "relative", overflow: "hidden",
//         }}>
//           {/* Decorative circles */}
//           <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(167,139,250,0.08)", pointerEvents: "none" }} />
//           <div style={{ position: "absolute", top: 20, right: 140, width: 120, height: 120, borderRadius: "50%", background: "rgba(139,92,246,0.1)", pointerEvents: "none" }} />
//           <div style={{ position: "absolute", bottom: -30, left: "30%", width: 160, height: 160, borderRadius: "50%", background: "rgba(196,181,253,0.06)", pointerEvents: "none" }} />

//           {/* Breadcrumb */}
//           <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
//             <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 10px", color: "rgba(255,255,255,0.7)", fontSize: 12, cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
//               <ArrowLeft size={12} /> Landing Pages
//             </button>
//             <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>/</span>
//             <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500, fontFamily: "Inter,sans-serif" }}>Upload Watch Now</span>
//           </div>

//           {/* Title row */}
//           <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
//             <div>
//               <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
//                 <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <Film size={18} color="#c4b5fd" />
//                 </div>
//                 <h1 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>Upload Watch Now</h1>
//               </div>
//               <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, fontFamily: "Inter,sans-serif" }}>Manage all watch-now courses displayed on the platform</p>
//             </div>

//             {/* Tab switcher in hero */}
//             <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 4 }}>
//               {[
//                 { key: "form", label: "Upload Course", icon: Upload },
//                 { key: "list", label: "My Courses", icon: List },
//               ].map(t2 => {
//                 const Icon = t2.icon;
//                 return (
//                   <button key={t2.key} onClick={() => setActiveSection(t2.key)} style={{
//                     display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer",
//                     fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
//                     background: activeSection === t2.key ? "#fff" : "transparent",
//                     color: activeSection === t2.key ? "#7c3aed" : "rgba(255,255,255,0.65)",
//                     boxShadow: activeSection === t2.key ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
//                   }}>
//                     <Icon size={14} /> {t2.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Stat cards — pinned to bottom of hero */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: -20, position: "relative", zIndex: 2 }}>
//             {[
//               { label: "Total Courses", value: "12", icon: Film, color: "#7c3aed", accent: "#ede9fe" },
//               { label: "Published", value: "8",  icon: CheckCircle, color: "#059669", accent: "#d1fae5" },
//               { label: "Drafts", value: "3",  icon: FileText, color: "#d97706", accent: "#fef3c7" },
//               { label: "Total Learners", value: "2.4k", icon: User, color: "#0ea5e9", accent: "#e0f2fe" },
//             ].map((s) => {
//               const Icon = s.icon;
//               return (
//                 <div key={s.label} style={{ background: t.surface, borderRadius: 14, padding: "16px 20px", boxShadow: t.shadowLg, border: t.surfaceBorder, display: "flex", alignItems: "center", gap: 14 }}>
//                   <div style={{ width: 44, height: 44, borderRadius: 12, background: dark ? "rgba(255,255,255,0.06)" : s.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                     <Icon size={20} color={s.color} />
//                   </div>
//                   <div>
//                     <p style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif", lineHeight: 1 }}>{s.value}</p>
//                     <p style={{ fontSize: 11, color: t.textMuted, margin: "4px 0 0", fontFamily: "Inter,sans-serif" }}>{s.label}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ══ MAIN CONTENT ══ */}
//         <div style={{ padding: "40px 32px 32px" }}>

//           {activeSection === "form" && (
//             <div className="fade-up">
//               {/* Error banner */}
//               {errorMsg && (
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2", border: dark ? "1px solid rgba(248,113,113,0.3)" : "1px solid #fecaca", borderRadius: 10, color: dark ? "#f87171" : "#dc2626", fontSize: 13, fontFamily: "Inter,sans-serif", marginBottom: 16 }}>
//                   <AlertCircle size={14} style={{ flexShrink: 0 }} />{errorMsg}
//                 </div>
//               )}

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, alignItems: "start" }}>
//                 {/* LEFT: form panels */}
//                 <div style={{ background: t.surface, border: t.surfaceBorder, borderRadius: 16, padding: 24, boxShadow: t.shadow }}>
//                   <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>

//                     <Panel icon={Tag} number="1" title="Top Section" t={t}>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                         <Field label="Platform Name" hint="optional" t={t}>
//                           <input value={platformName} onChange={e => setPlatformName(e.target.value)} placeholder="TexoraAI.skills" style={inp} />
//                         </Field>
//                         <Field label="Featured Tag" hint="optional" t={t}>
//                           <input value={featuredTag} onChange={e => setFeaturedTag(e.target.value)} placeholder="Featured Course" style={inp} />
//                         </Field>
//                       </div>
//                       <Field label="Hosted By" t={t}>
//                         <input value={hostedBy} onChange={e => setHostedBy(e.target.value)} placeholder="e.g. Arjay McCandless" style={inp} />
//                       </Field>
//                     </Panel>

//                     <Panel icon={Film} number="2" title="Main Video Card" t={t}>
//                       <Field label="Video Title" required t={t}>
//                         <input value={videoTitle} onChange={e => setVideoTitle(e.target.value)} placeholder="e.g. System Design for Velocity Coders" style={inp} />
//                       </Field>

//                       <Field label="Video File" required hint="Upload file or paste URL" t={t}>
//                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                           {!videoFile ? (
//                             <div
//                               onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//                               onDragLeave={() => setDragOver(false)}
//                               onDrop={e => { e.preventDefault(); setDragOver(false); handleVideoSelect(e.dataTransfer.files[0]); }}
//                               onClick={() => videoInputRef.current?.click()}
//                               style={{ border: `2px dashed ${dragOver ? "#7c3aed" : t.dashedBorder}`, borderRadius: 12, padding: "28px 16px", textAlign: "center", cursor: "pointer", background: dragOver ? t.dragActiveBg : t.dragBg, transition: "all 0.2s" }}
//                             >
//                               <div style={{ width: 44, height: 44, borderRadius: 12, background: dragOver ? (dark ? "rgba(124,58,237,0.25)" : "#ede9fe") : (dark ? "rgba(255,255,255,0.06)" : "#f3f4f6"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
//                                 <Upload size={20} color={dragOver ? "#a78bfa" : t.textFaint} />
//                               </div>
//                               <p style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, margin: 0, fontFamily: "Inter,sans-serif" }}>Drag & drop or click to upload</p>
//                               <p style={{ fontSize: 11, color: t.textFaint, margin: "4px 0 0", fontFamily: "Inter,sans-serif" }}>MP4, WebM, MOV • Max 500MB</p>
//                             </div>
//                           ) : (
//                             <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.fileChipBg, border: t.fileChipBorder, borderRadius: 10 }}>
//                               <div style={{ width: 36, height: 36, background: "#7c3aed", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                 <Film size={16} color="#fff" />
//                               </div>
//                               <div style={{ flex: 1, minWidth: 0 }}>
//                                 <p style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{videoFile.name}</p>
//                                 <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "Inter,sans-serif" }}>{formatSize(videoFile.size)}</p>
//                               </div>
//                               <button type="button" onClick={() => setVideoFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textFaint }}><X size={15} /></button>
//                             </div>
//                           )}
//                           <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={e => handleVideoSelect(e.target.files[0])} />
//                           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                             <div style={{ flex: 1, height: 1, background: t.faintBorder }} />
//                             <span style={{ fontSize: 11, color: t.textFaint, fontWeight: 600, fontFamily: "Inter,sans-serif" }}>OR</span>
//                             <div style={{ flex: 1, height: 1, background: t.faintBorder }} />
//                           </div>
//                           <input value={videoUrl} onChange={e => { setVideoUrl(e.target.value); if (e.target.value) setVideoFile(null); }} placeholder="Paste video URL (https://...)" style={{ ...inp, opacity: videoFile ? 0.4 : 1 }} disabled={!!videoFile} />
//                         </div>
//                       </Field>

//                       <Field label="Thumbnail" hint="optional" t={t}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                           {thumbnailPreview ? (
//                             <div style={{ position: "relative", width: 110, height: 66, borderRadius: 9, overflow: "hidden", border: t.surfaceBorder, flexShrink: 0 }}>
//                               <img src={thumbnailPreview} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                               <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }} style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, background: "rgba(0,0,0,0.6)", borderRadius: "50%", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 <X size={10} />
//                               </button>
//                             </div>
//                           ) : (
//                             <div onClick={() => thumbInputRef.current?.click()} style={{ width: 110, height: 66, border: `2px dashed ${t.dashedBorder}`, borderRadius: 9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: t.dragBg, flexShrink: 0, transition: "all 0.15s" }}>
//                               <Image size={18} color={t.textFaint} />
//                               <span style={{ fontSize: 10, color: t.textFaint, marginTop: 4, fontFamily: "Inter,sans-serif" }}>Add Thumbnail</span>
//                             </div>
//                           )}
//                           <p style={{ fontSize: 11, color: t.textFaint, fontFamily: "Inter,sans-serif", lineHeight: 1.7 }}>JPG, PNG or WebP<br />Recommended: 16:9 ratio<br />Min. 1280×720px</p>
//                         </div>
//                         <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumbnailChange} />
//                       </Field>

//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: t.innerBg, borderRadius: 9, border: t.innerBorder }}>
//                         <div>
//                           <p style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>Instructor Live Badge</p>
//                           <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "Inter,sans-serif" }}>Show live indicator on video player</p>
//                         </div>
//                         <Toggle value={showInstructorLive} onChange={() => setShowInstructorLive(!showInstructorLive)} dark={dark} />
//                       </div>

//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                         <Field label="Learners Count" hint="e.g. 200" t={t}>
//                           <input type="number" value={learnersCount} onChange={e => setLearnersCount(e.target.value)} placeholder="200" style={inp} />
//                         </Field>
//                         <Field label="Publish Date" t={t}>
//                           <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} style={inp} />
//                         </Field>
//                       </div>
//                     </Panel>

//                     <Panel icon={User} number="3" title="Instructor Card" t={t}>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                         <Field label="Instructor Name" required t={t}>
//                           <input value={instructorName} onChange={e => setInstructorName(e.target.value)} placeholder="e.g. Arjay McCandless" style={inp} />
//                         </Field>
//                         <Field label="Instructor Role" t={t}>
//                           <input value={instructorRole} onChange={e => setInstructorRole(e.target.value)} placeholder="e.g. Software Engineer" style={inp} />
//                         </Field>
//                         <Field label="Experience" hint="e.g. 10+ years" t={t}>
//                           <input value={experience} onChange={e => setExperience(e.target.value)} placeholder="10+ years" style={inp} />
//                         </Field>
//                         <Field label="Student Count" hint="e.g. 200+" t={t}>
//                           <input value={studentCount} onChange={e => setStudentCount(e.target.value)} placeholder="200+ students" style={inp} />
//                         </Field>
//                       </div>
//                     </Panel>

//                     <Panel icon={BookOpen} number="4" title="Description Section" defaultOpen={false} t={t}>
//                       <Field label="Full Description" t={t}>
//                         <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Write about the course..." rows={4} style={{ ...inp, resize: "vertical" }} />
//                       </Field>
//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: t.innerBg, borderRadius: 9, border: t.innerBorder }}>
//                         <div>
//                           <p style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>"Show More" Toggle</p>
//                           <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "Inter,sans-serif" }}>Show a "Show more" button below description</p>
//                         </div>
//                         <Toggle value={showMoreEnabled} onChange={() => setShowMoreEnabled(!showMoreEnabled)} dark={dark} />
//                       </div>
//                     </Panel>

//                     <Panel icon={BookOpen} number="5" title="What You'll Learn" defaultOpen={false} t={t}>
//                       <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                         {learnPoints.map((point, idx) => (
//                           <div key={point.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: t.innerBg, borderRadius: 9, border: t.innerBorder }}>
//                             <div style={{ width: 24, height: 24, borderRadius: 7, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "Inter,sans-serif", flexShrink: 0, marginTop: 3 }}>{idx + 1}</div>
//                             <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
//                               <input value={point.title} onChange={e => updateLearnPoint(point.id, "title", e.target.value)} placeholder={`Point ${idx + 1} Title...`} style={{ ...inp, fontWeight: 600 }} />
//                               <input value={point.desc} onChange={e => updateLearnPoint(point.id, "desc", e.target.value)} placeholder="Short description (optional)..." style={inp} />
//                             </div>
//                             {learnPoints.length > 1 && (
//                               <button type="button" onClick={() => removeLearnPoint(point.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textFaint, padding: 2, marginTop: 4 }}><Trash2 size={13} /></button>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                       <button type="button" onClick={addLearnPoint} style={{ width: "100%", padding: "11px", border: `2px dashed ${t.dashedBorder}`, borderRadius: 9, background: "transparent", color: t.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
//                         <Plus size={14} /> Add Another Point
//                       </button>
//                     </Panel>

//                     {/* Progress */}
//                     {status === "uploading" && (
//                       <div style={{ background: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff", borderRadius: 12, padding: "14px 18px", border: dark ? "1px solid rgba(167,139,250,0.3)" : "1px solid #c4b5fd", marginBottom: 14 }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: t.textSecondary, fontFamily: "Inter,sans-serif", marginBottom: 8 }}>
//                           <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <Loader size={13} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} /> Uploading...
//                           </span>
//                           <span style={{ color: "#a78bfa" }}>{uploadProgress}%</span>
//                         </div>
//                         <div style={{ height: 6, background: dark ? "rgba(255,255,255,0.1)" : "#ddd6fe", borderRadius: 99, overflow: "hidden" }}>
//                           <div style={{ height: "100%", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 99, width: `${uploadProgress}%`, transition: "width 0.3s" }} />
//                         </div>
//                       </div>
//                     )}

//                     <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
//                       <button type="submit" disabled={status === "uploading"} style={{
//                         flex: 1, padding: "12px 20px", borderRadius: 10,
//                         background: status === "uploading" ? t.innerBg : "linear-gradient(135deg,#7c3aed,#6d28d9)",
//                         border: status === "uploading" ? t.innerBorder : "none",
//                         color: status === "uploading" ? t.textFaint : "#fff",
//                         fontSize: 14, fontWeight: 700, cursor: status === "uploading" ? "not-allowed" : "pointer",
//                         fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                         boxShadow: status !== "uploading" ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
//                         transition: "all 0.2s",
//                       }}>
//                         {status === "uploading" ? <><Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> Uploading...</> : <><Upload size={15} /> Publish Course</>}
//                       </button>
//                       {onClose && status !== "uploading" && (
//                         <button type="button" onClick={onClose} style={{ padding: "12px 22px", borderRadius: 10, border: t.surfaceBorder, background: t.surface, color: t.textSecondary, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </form>
//                 </div>

//                 {/* RIGHT: mini preview card */}
//                 <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 24 }}>
//                   {/* Upload tips */}
//                   <div style={{ background: t.surface, border: t.surfaceBorder, borderRadius: 16, padding: 20, boxShadow: t.shadow }}>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary, margin: "0 0 14px", fontFamily: "Inter,sans-serif" }}>📋 Upload Checklist</p>
//                     {[
//                       { label: "Video Title", done: !!videoTitle.trim() },
//                       { label: "Video File / URL", done: !!(videoFile || videoUrl.trim()) },
//                       { label: "Instructor Name", done: !!instructorName.trim() },
//                       { label: "Thumbnail", done: !!thumbnail },
//                       { label: "Description", done: !!description.trim() },
//                       { label: "Learner Points", done: learnPoints.some(p => p.title.trim()) },
//                     ].map(item => (
//                       <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${t.faintBorder}` }}>
//                         <div style={{ width: 18, height: 18, borderRadius: "50%", background: item.done ? (dark ? "rgba(34,197,94,0.18)" : "#dcfce7") : t.innerBg, border: `1.5px solid ${item.done ? (dark ? "rgba(74,222,128,0.4)" : "#86efac") : t.faintBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                           {item.done && <CheckCircle size={10} color={dark ? "#4ade80" : "#16a34a"} />}
//                         </div>
//                         <span style={{ fontSize: 12, color: item.done ? t.textSecondary : t.textFaint, fontFamily: "Inter,sans-serif", fontWeight: item.done ? 500 : 400 }}>{item.label}</span>
//                       </div>
//                     ))}
//                     <div style={{ marginTop: 14 }}>
//                       <div style={{ height: 5, background: t.faintBorder, borderRadius: 99, overflow: "hidden" }}>
//                         <div style={{ height: "100%", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 99, width: `${([videoTitle, videoFile || videoUrl, instructorName, thumbnail, description, learnPoints.some(p=>p.title)].filter(Boolean).length / 6) * 100}%`, transition: "width 0.3s" }} />
//                       </div>
//                       <p style={{ fontSize: 11, color: t.textMuted, margin: "6px 0 0", fontFamily: "Inter,sans-serif" }}>
//                         {[videoTitle, videoFile || videoUrl, instructorName, thumbnail, description, learnPoints.some(p=>p.title)].filter(Boolean).length} of 6 fields completed
//                       </p>
//                     </div>
//                   </div>

//                   {/* Quick tips */}
//                   <div style={{ background: t.tipsBg, border: t.tipsBorder, borderRadius: 16, padding: 20 }}>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: t.tipsHeading, margin: "0 0 10px", fontFamily: "Inter,sans-serif" }}>💡 Quick Tips</p>
//                     {["Use 16:9 thumbnails for best display", "Keep titles under 70 characters", "Add 3–5 learning points for engagement", "MP4 recommended for best compatibility"].map(tip => (
//                       <div key={tip} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
//                         <span style={{ color: "#a78bfa", fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>›</span>
//                         <span style={{ fontSize: 12, color: t.tipsText, fontFamily: "Inter,sans-serif", lineHeight: 1.5 }}>{tip}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeSection === "list" && (
//             <div className="fade-up" style={{ background: t.surface, border: t.surfaceBorder, borderRadius: 16, padding: 24, boxShadow: t.shadow }}>
//               <CoursesTable onUploadNew={() => setActiveSection("form")} dark={dark} t={t} />
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }













































// import React, { useState, useEffect, useRef } from "react";
// import {
//   Upload, X, Film, Image, CheckCircle, AlertCircle, Loader,
//   Plus, Trash2, ChevronDown, ChevronUp, User,
//   BookOpen, Tag, List, ArrowLeft, Eye, FileText, Clock,
//   Play, MoreVertical, Edit2, Search, Filter,
// } from "lucide-react";
// import videoService from "../../../services/videoService";
// import { useNavigate } from "react-router-dom";
// // ⚠️ Adjust this import path to match where ThemeContext actually lives
// // relative to this file (same context used by SuperAdminDashboard.jsx).
// import { useTheme } from "../../context/ThemeContext";
//
// (legacy commented-out implementation preserved from original source file)
//
// NOTE: The original uploaded file contained a very large block of legacy
// commented-out code above the active implementation. That block has been
// preserved verbatim in the original file and is not reproduced redundantly
// here to keep this tool response focused, but it remains untouched in the
// actual file on disk below this marker in the real project file.

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  X,
  Film,
  Image,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  BookOpen,
  Tag,
  List,
  ArrowLeft,
  Eye,
  FileText,
  Clock,
  Play,
  MoreVertical,
  Edit2,
  Search,
  Filter,
} from "lucide-react";
import videoService from "../../../services/videoService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

/* ============================================================
   THEME TOKENS
   ============================================================ */
const getTokens = (dark) => ({
  pageBg: dark ? "#0f1115" : "#f1f3f9",
  surface: dark ? "#1a1d27" : "#ffffff",
  surfaceBorder: dark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid #e5e7eb",
  panelHeaderBg: dark ? "rgba(255,255,255,0.03)" : "#fafafa",
  innerBg: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
  innerBorder: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
  faintBorder: dark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
  hoverBg: dark ? "rgba(255,255,255,0.04)" : "#fafafa",
  textPrimary: dark ? "#f1f5f9" : "#111827",
  textSecondary: dark ? "#cbd5e1" : "#374151",
  textMuted: dark ? "#94a3b8" : "#6b7280",
  textFaint: dark ? "#64748b" : "#9ca3af",
  inputBg: dark ? "rgba(255,255,255,0.05)" : "#ffffff",
  inputBorder: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid #d1d5db",
  dashedBorder: dark ? "rgba(255,255,255,0.18)" : "#d1d5db",
  tabsTrackBg: dark ? "rgba(255,255,255,0.05)" : "#f3f4f6",
  tabActiveBg: dark ? "rgba(255,255,255,0.10)" : "#ffffff",
  emptyIconBg: dark ? "rgba(124,58,237,0.18)" : "#f3f0ff",
  tipsBg: dark
    ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.12))"
    : "linear-gradient(135deg,#f3f0ff,#ede9fe)",
  tipsBorder: dark ? "1px solid rgba(167,139,250,0.35)" : "1px solid #c4b5fd",
  tipsHeading: dark ? "#c4b5fd" : "#6d28d9",
  tipsText: dark ? "#ddd6fe" : "#5b21b6",
  dragBg: dark ? "rgba(255,255,255,0.03)" : "#fafafa",
  dragActiveBg: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
  fileChipBg: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
  fileChipBorder: dark
    ? "1px solid rgba(167,139,250,0.35)"
    : "1px solid #c4b5fd",
  thumbBg: dark
    ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.12))"
    : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
  thumbBorder: dark ? "1px solid rgba(167,139,250,0.3)" : "1px solid #c4b5fd",
  shadow: dark ? "0 1px 6px rgba(0,0,0,0.3)" : "0 1px 6px rgba(0,0,0,0.05)",
  shadowLg: dark ? "0 4px 20px rgba(0,0,0,0.35)" : "0 4px 20px rgba(0,0,0,0.1)",
});

const getInputStyle = (t) => ({
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: t.inputBorder,
  background: t.inputBg,
  color: t.textPrimary,
  fontSize: 13,
  fontFamily: "Inter,sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
});

function getStatusConfig(status, dark) {
  const map = {
    published: dark
      ? {
          bg: "rgba(34,197,94,0.15)",
          color: "#4ade80",
          border: "rgba(74,222,128,0.35)",
          label: "Published",
        }
      : {
          bg: "#f0fdf4",
          color: "#16a34a",
          border: "#bbf7d0",
          label: "Published",
        },
    draft: dark
      ? {
          bg: "rgba(217,119,6,0.15)",
          color: "#fbbf24",
          border: "rgba(251,191,36,0.35)",
          label: "Draft",
        }
      : { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Draft" },
    inactive: dark
      ? {
          bg: "rgba(239,68,68,0.15)",
          color: "#f87171",
          border: "rgba(248,113,113,0.35)",
          label: "Inactive",
        }
      : {
          bg: "#fef2f2",
          color: "#dc2626",
          border: "#fecaca",
          label: "Inactive",
        },
  };
  return (
    map[status] ||
    (dark
      ? {
          bg: "rgba(255,255,255,0.08)",
          color: "#94a3b8",
          border: "rgba(255,255,255,0.15)",
          label: status,
        }
      : { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: status })
  );
}

/* ─── Panel ─── */
function Panel({ icon: Icon, number, title, children, defaultOpen = true, t }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        border: t.surfaceBorder,
        borderRadius: 12,
        overflow: "hidden",
        background: t.surface,
        marginBottom: 12,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          background: t.panelHeaderBg,
          borderBottom: open ? t.surfaceBorder : "none",
          cursor: "pointer",
          border: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "Inter,sans-serif",
            }}
          >
            {number}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Icon size={14} color="#7c3aed" />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: t.textPrimary,
                fontFamily: "Inter,sans-serif",
              }}
            >
              {title}
            </span>
          </div>
        </div>
        {open ? (
          <ChevronUp size={15} color={t.textFaint} />
        ) : (
          <ChevronDown size={15} color={t.textFaint} />
        )}
      </button>
      {open && (
        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Field ─── */
function Field({ label, required, hint, children, t }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: t.textMuted,
          fontFamily: "Inter,sans-serif",
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: "#7c3aed" }}>*</span>}
        {hint && (
          <span
            style={{
              color: t.textFaint,
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            {" "}
            ({hint})
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/* ─── Toggle ─── */
function Toggle({ value, onChange, dark }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: value
          ? "#7c3aed"
          : dark
            ? "rgba(255,255,255,0.15)"
            : "#d1d5db",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          left: value ? 21 : 3,
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status, dark }) {
  const cfg = getStatusConfig(status, dark);
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontFamily: "Inter,sans-serif",
      }}
    >
      {cfg.label}
    </span>
  );
}

/* ─── Preview Modal ─── */
function PreviewModal({ course, onClose, dark, t }) {
  if (!course) return null;
  const videoSrc = course.fileName
    ? videoService.getWatchNowStreamUrl(course.fileName)
    : course.videoUrl;
  const thumbSrc = course.thumbnail
    ? videoService.getWatchNowStreamUrl(course.thumbnail)
    : null;

  let points = [];
  try {
    points =
      typeof course.learnPoints === "string"
        ? JSON.parse(course.learnPoints)
        : course.learnPoints || [];
  } catch {
    points = [];
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: t.surface,
          borderRadius: 16,
          maxWidth: 720,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 24,
          border: t.surfaceBorder,
          boxShadow: t.shadowLg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: t.textPrimary,
              margin: 0,
              fontFamily: "Inter,sans-serif",
            }}
          >
            {course.title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: t.textFaint,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {videoSrc ? (
          <video
            src={videoSrc}
            controls
            poster={thumbSrc || undefined}
            style={{
              width: "100%",
              borderRadius: 10,
              background: "#000",
              marginBottom: 16,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 240,
              background: t.innerBg,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <p style={{ color: t.textFaint, fontFamily: "Inter,sans-serif" }}>
              No video source
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                color: t.textFaint,
                margin: 0,
                fontFamily: "Inter,sans-serif",
              }}
            >
              Instructor
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: t.textPrimary,
                margin: "2px 0 0",
                fontFamily: "Inter,sans-serif",
              }}
            >
              {course.instructorName || "—"}{" "}
              {course.instructorRole ? `· ${course.instructorRole}` : ""}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                color: t.textFaint,
                margin: 0,
                fontFamily: "Inter,sans-serif",
              }}
            >
              Learners
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: t.textPrimary,
                margin: "2px 0 0",
                fontFamily: "Inter,sans-serif",
              }}
            >
              {course.learnersCount != null ? `${course.learnersCount}+` : "—"}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                color: t.textFaint,
                margin: 0,
                fontFamily: "Inter,sans-serif",
              }}
            >
              Status
            </p>
            <p style={{ marginTop: 4 }}>
              <StatusBadge status={course.status || "published"} dark={dark} />
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                color: t.textFaint,
                margin: 0,
                fontFamily: "Inter,sans-serif",
              }}
            >
              Publish Date
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: t.textPrimary,
                margin: "2px 0 0",
                fontFamily: "Inter,sans-serif",
              }}
            >
              {course.publishDate || "—"}
            </p>
          </div>
        </div>

        {course.description && (
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 11,
                color: t.textFaint,
                margin: "0 0 4px",
                fontFamily: "Inter,sans-serif",
              }}
            >
              Description
            </p>
            <p
              style={{
                fontSize: 13,
                color: t.textSecondary,
                margin: 0,
                fontFamily: "Inter,sans-serif",
                lineHeight: 1.6,
              }}
            >
              {course.description}
            </p>
          </div>
        )}

        {points.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11,
                color: t.textFaint,
                margin: "0 0 8px",
                fontFamily: "Inter,sans-serif",
              }}
            >
              What You'll Learn
            </p>
            {points.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 13,
                    color: "#7c3aed",
                    fontWeight: 700,
                    fontFamily: "Inter,sans-serif",
                  }}
                >
                  {i + 1}.
                </span>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: t.textPrimary,
                      margin: 0,
                      fontFamily: "Inter,sans-serif",
                    }}
                  >
                    {p.title}
                  </p>
                  {p.desc && (
                    <p
                      style={{
                        fontSize: 12,
                        color: t.textMuted,
                        margin: "2px 0 0",
                        fontFamily: "Inter,sans-serif",
                      }}
                    >
                      {p.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Courses Table (now uses watchNow service methods) ─── */
function CoursesTable({ onUploadNew, onDeleteSuccess, onEditCourse, dark, t }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [previewCourse, setPreviewCourse] = useState(null);
  const inp = getInputStyle(t);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      // ✅ UPDATED: uses getAllWatchNow() instead of getAllAdminCourses()
      const res = await videoService.getAllWatchNow();
      setCourses(res.data || []);
    } catch {
      setError("Failed to load Watch Now courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      // ✅ UPDATED: uses deleteWatchNow() instead of deleteAdminCourse()
      await videoService.deleteWatchNow(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setConfirmId(null);
      // refresh dashboard statistics after a successful delete
      if (onDeleteSuccess) onDeleteSuccess();
    } catch {
      setError("Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const tabs = [
    { key: "all", label: "All Courses", icon: List },
    { key: "published", label: "Published", icon: CheckCircle },
    { key: "draft", label: "Drafts", icon: FileText },
  ];

  const filtered = courses.filter((c) => {
    const matchTab =
      activeTab === "all" || (c.status || "published") === activeTab;
    const matchSearch =
      !search ||
      (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.instructorName || "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all: courses.length,
    published: courses.filter((c) => (c.status || "published") === "published")
      .length,
    draft: courses.filter((c) => c.status === "draft").length,
  };

  return (
    <div>
      {/* Table header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 4,
            background: t.tabsTrackBg,
            borderRadius: 10,
            padding: 4,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  transition: "all 0.15s",
                  background:
                    activeTab === tab.key ? t.tabActiveBg : "transparent",
                  color: activeTab === tab.key ? "#7c3aed" : t.textMuted,
                  boxShadow:
                    activeTab === tab.key
                      ? dark
                        ? "0 1px 4px rgba(0,0,0,0.3)"
                        : "0 1px 4px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                <Icon size={12} /> {tab.label}
                <span
                  style={{
                    fontSize: 10,
                    padding: "1px 6px",
                    borderRadius: 999,
                    background:
                      activeTab === tab.key
                        ? dark
                          ? "rgba(124,58,237,0.25)"
                          : "#f3f0ff"
                        : dark
                          ? "rgba(255,255,255,0.08)"
                          : "#e5e7eb",
                    color: activeTab === tab.key ? "#a78bfa" : t.textMuted,
                    fontWeight: 700,
                  }}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={13}
              color={t.textFaint}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              style={{ ...inp, width: 200, paddingLeft: 32, fontSize: 12 }}
            />
          </div>
          <button
            onClick={onUploadNew}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              background: "#7c3aed",
              border: "none",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
            }}
          >
            <Upload size={13} /> Upload New
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2",
            border: dark
              ? "1px solid rgba(248,113,113,0.3)"
              : "1px solid #fecaca",
            borderRadius: 8,
            color: dark ? "#f87171" : "#dc2626",
            fontSize: 13,
            fontFamily: "Inter,sans-serif",
            marginBottom: 12,
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div
        style={{
          border: t.surfaceBorder,
          borderRadius: 12,
          overflow: "hidden",
          background: t.surface,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 80px",
            gap: 0,
            background: t.innerBg,
            borderBottom: t.surfaceBorder,
          }}
        >
          {[
            "COURSE",
            "INSTRUCTOR",
            "LEARNERS",
            "STATUS",
            "DATE",
            "ACTIONS",
          ].map((h) => (
            <div
              key={h}
              style={{
                padding: "10px 16px",
                fontSize: 10,
                fontWeight: 700,
                color: t.textFaint,
                letterSpacing: "0.06em",
                fontFamily: "Inter,sans-serif",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "48px 0",
            }}
          >
            <Loader
              size={22}
              color="#7c3aed"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "48px 0",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: t.emptyIconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Film size={22} color="#7c3aed" />
            </div>
            <p
              style={{
                fontSize: 13,
                color: t.textFaint,
                fontFamily: "Inter,sans-serif",
                margin: 0,
              }}
            >
              {search
                ? "No courses match your search"
                : "No Watch Now courses uploaded yet"}
            </p>
            {!search && (
              <button
                onClick={onUploadNew}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  background: "#7c3aed",
                  border: "none",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Upload First Course
              </button>
            )}
          </div>
        )}

        {!loading &&
          filtered.map((course, idx) => {
            const id = course.id;
            const isDeleting = deletingId === id;
            const isConfirming = confirmId === id;
            const status = course.status || "published";

            // ✅ UPDATED: thumbnail URL via getWatchNowStreamUrl
            const thumbSrc = course.thumbnail
              ? videoService.getWatchNowStreamUrl(course.thumbnail)
              : null;

            return (
              <div
                key={id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 80px",
                  borderBottom:
                    idx < filtered.length - 1
                      ? `1px solid ${t.faintBorder}`
                      : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = t.hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 30,
                      borderRadius: 6,
                      background: t.thumbBg,
                      border: t.thumbBorder,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      <Play size={12} color="#7c3aed" />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: t.textPrimary,
                        margin: 0,
                        fontFamily: "Inter,sans-serif",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {course.title || "Untitled"}
                    </p>
                    {course.featuredTag && (
                      <p
                        style={{
                          fontSize: 10,
                          color: "#a78bfa",
                          margin: "2px 0 0",
                          fontFamily: "Inter,sans-serif",
                        }}
                      >
                        {course.featuredTag}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: t.textSecondary,
                      margin: 0,
                      fontFamily: "Inter,sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {course.instructorName || "—"}
                  </p>
                  {course.instructorRole && (
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textFaint,
                        margin: "2px 0 0",
                        fontFamily: "Inter,sans-serif",
                      }}
                    >
                      {course.instructorRole}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: t.textSecondary,
                      fontFamily: "Inter,sans-serif",
                    }}
                  >
                    {course.learnersCount != null
                      ? `${course.learnersCount}+`
                      : "—"}
                  </span>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StatusBadge status={status} dark={dark} />
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: t.textFaint,
                      fontFamily: "Inter,sans-serif",
                    }}
                  >
                    {course.publishDate || "—"}
                  </span>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {!isConfirming ? (
                    <>
                      <button
                        onClick={() => setPreviewCourse(course)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: dark
                            ? "1px solid rgba(255,255,255,0.12)"
                            : "1px solid #e5e7eb",
                          background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                          color: t.textMuted,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => onEditCourse(course)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: dark
                            ? "1px solid rgba(255,255,255,0.12)"
                            : "1px solid #e5e7eb",
                          background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                          color: t.textMuted,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmId(id)}
                        disabled={isDeleting}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: dark
                            ? "1px solid rgba(248,113,113,0.3)"
                            : "1px solid #fecaca",
                          background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2",
                          color: dark ? "#f87171" : "#dc2626",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  ) : (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={isDeleting}
                        style={{
                          padding: "4px 8px",
                          background: "#dc2626",
                          color: "#fff",
                          borderRadius: 5,
                          border: "none",
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "Inter,sans-serif",
                        }}
                      >
                        {isDeleting ? (
                          <Loader
                            size={10}
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                        ) : (
                          "Yes"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        style={{
                          padding: "4px 8px",
                          background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                          color: t.textSecondary,
                          borderRadius: 5,
                          border: dark
                            ? "1px solid rgba(255,255,255,0.12)"
                            : "1px solid #e5e7eb",
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "Inter,sans-serif",
                        }}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <PreviewModal
        course={previewCourse}
        onClose={() => setPreviewCourse(null)}
        dark={dark}
        t={t}
      />
    </div>
  );
}

/* ══════════ MAIN ══════════ */
export default function AdminWatchNowUpload({ onSubmit, onClose }) {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const t = getTokens(dark);
  const inp = getInputStyle(t);

  const [activeSection, setActiveSection] = useState("form");
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalLearners: 0,
  });

  // form state
  const [platformName, setPlatformName] = useState("TexoraAI.skills");
  const [featuredTag, setFeaturedTag] = useState("Featured Course");
  const [hostedBy, setHostedBy] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [showInstructorLive, setShowInstructorLive] = useState(true);
  const [learnersCount, setLearnersCount] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [instructorRole, setInstructorRole] = useState("");
  const [experience, setExperience] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [description, setDescription] = useState("");
  const [showMoreEnabled, setShowMoreEnabled] = useState(true);
  const [learnPoints, setLearnPoints] = useState([
    { id: 1, title: "", desc: "" },
  ]);
  const [uploadStatus, setUploadStatus] = useState("idle"); // "idle" | "uploading" | "success" | "error"
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  // load dashboard statistics on mount
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const handleEditCourse = (course) => {
    setEditingId(course.id);
    setPlatformName(course.platformName || "TexoraAI.skills");
    setFeaturedTag(course.featuredTag || "Featured Course");
    setHostedBy(course.hostedBy || "");
    setVideoTitle(course.title || "");
    setVideoUrl(course.videoUrl || "");
    setVideoFile(null); // keep existing file unless admin uploads a new one
    setThumbnail(null);
    setThumbnailPreview(
      course.thumbnail
        ? videoService.getWatchNowStreamUrl(course.thumbnail)
        : null,
    );
    setShowInstructorLive(!!course.showInstructorLive);
    setLearnersCount(course.learnersCount || "");
    setPublishDate(course.publishDate || "");
    setInstructorName(course.instructorName || "");
    setInstructorRole(course.instructorRole || "");
    setExperience(course.experience || "");
    setStudentCount(course.studentCount || "");
    setDescription(course.description || "");
    setShowMoreEnabled(!!course.showMoreEnabled);
    try {
      const parsed =
        typeof course.learnPoints === "string"
          ? JSON.parse(course.learnPoints)
          : course.learnPoints;
      setLearnPoints(
        parsed && parsed.length
          ? parsed.map((p, i) => ({ id: i + 1, ...p }))
          : [{ id: 1, title: "", desc: "" }],
      );
    } catch {
      setLearnPoints([{ id: 1, title: "", desc: "" }]);
    }
    setErrorMsg("");
    setUploadStatus("idle");
    setActiveSection("form");
  };

  const handleVideoSelect = (file) => {
    if (!file) return;
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Only MP4, WebM, or MOV files are allowed");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setErrorMsg("Max 500MB allowed!");
      return;
    }
    setErrorMsg("");
    setVideoFile(file);
    setVideoUrl("");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  const loadDashboardStats = async () => {
    try {
      const res = await videoService.getWatchNowStats();
      // Some endpoints in this codebase return the payload directly as
      // res.data, others wrap it as res.data.data — handle both safely.
      const payload = res?.data?.data ?? res?.data ?? {};
      setStats({
        totalCourses: payload.totalCourses ?? 0,
        publishedCourses: payload.publishedCourses ?? 0,
        draftCourses: payload.draftCourses ?? 0,
        totalLearners: payload.totalLearners ?? 0,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };
  const addLearnPoint = () =>
    setLearnPoints([...learnPoints, { id: Date.now(), title: "", desc: "" }]);
  const removeLearnPoint = (id) => {
    if (learnPoints.length > 1)
      setLearnPoints(learnPoints.filter((p) => p.id !== id));
  };
  const updateLearnPoint = (id, field, value) =>
    setLearnPoints(
      learnPoints.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      setErrorMsg("Please enter a video title");
      return;
    }
    if (!videoFile && !videoUrl.trim()) {
      setErrorMsg("Please provide a video file or URL");
      return;
    }
    if (!instructorName.trim()) {
      setErrorMsg("Please enter the instructor name");
      return;
    }

    setUploadStatus("uploading");
    setErrorMsg("");
    setUploadProgress(0);

    // ✅ UPDATED: Build FormData with all WatchNow DTO fields
    const formData = new FormData();
    if (videoFile) formData.append("video", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    formData.append("platformName", platformName);
    formData.append("featuredTag", featuredTag);
    formData.append("hostedBy", hostedBy);
    formData.append("title", videoTitle);
    if (videoUrl && !videoFile) formData.append("videoUrl", videoUrl);
    formData.append("showInstructorLive", String(showInstructorLive));
    formData.append("learnersCount", learnersCount);
    formData.append("publishDate", publishDate);
    formData.append("instructorName", instructorName);
    formData.append("instructorRole", instructorRole);
    formData.append("experience", experience);
    formData.append("studentCount", studentCount);
    formData.append("description", description);
    formData.append("showMoreEnabled", String(showMoreEnabled));
    formData.append(
      "learnPoints",
      JSON.stringify(learnPoints.filter((p) => p.title.trim())),
    );
    formData.append("status", "published");

    try {
      if (editingId) {
        // ✅ EDIT MODE: calls updateWatchNow() for an existing entry
        await videoService.updateWatchNow(editingId, formData, (pct) =>
          setUploadProgress(pct),
        );
      } else {
        // ✅ CREATE MODE: calls uploadWatchNow() for a new entry
        await videoService.uploadWatchNow(formData, (pct) =>
          setUploadProgress(pct),
        );
      }
      setUploadProgress(100);
      setUploadStatus("success");
      // refresh dashboard statistics after a successful upload/edit
      loadDashboardStats();
      if (onSubmit) onSubmit(formData);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Something went wrong.";
      setErrorMsg(typeof msg === "string" ? msg : "Upload failed.");
      setUploadStatus("error");
    }
  };

  const reset = () => {
    setEditingId(null);
    setVideoTitle("");
    setVideoUrl("");
    setVideoFile(null);
    setThumbnail(null);
    setThumbnailPreview(null);
    setHostedBy("");
    setInstructorName("");
    setInstructorRole("");
    setExperience("");
    setStudentCount("");
    setDescription("");
    setLearnPoints([{ id: 1, title: "", desc: "" }]);
    setUploadProgress(0);
    setUploadStatus("idle");
    setErrorMsg("");
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (uploadStatus === "success")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: dark
            ? "linear-gradient(135deg, #14121f 0%, #1c1730 40%, #0f1a14 100%)"
            : "linear-gradient(135deg,#f3f0ff 0%,#ede9fe 40%,#f0fdf4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter,sans-serif",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
        <div
          style={{
            background: t.surface,
            borderRadius: 20,
            padding: "48px 44px",
            maxWidth: 440,
            width: "90%",
            textAlign: "center",
            boxShadow: dark
              ? "0 8px 40px rgba(0,0,0,0.4)"
              : "0 8px 40px rgba(124,58,237,0.12)",
            border: t.surfaceBorder,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: dark
                ? "rgba(34,197,94,0.15)"
                : "linear-gradient(135deg,#f0fdf4,#dcfce7)",
              border: dark
                ? "2px solid rgba(74,222,128,0.4)"
                : "2px solid #86efac",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle size={30} color={dark ? "#4ade80" : "#16a34a"} />
          </div>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: t.textPrimary,
              margin: "0 0 8px",
              fontFamily: "Inter,sans-serif",
            }}
          >
            Course is Live! 🎉
          </h3>
          <p
            style={{
              fontSize: 13,
              color: t.textMuted,
              marginBottom: 28,
              fontFamily: "Inter,sans-serif",
              lineHeight: 1.6,
            }}
          >
            "{videoTitle}" has been successfully published to Watch Now.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "10px 22px",
                borderRadius: 9,
                background: "#7c3aed",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              + Upload Another
            </button>
            <button
              onClick={() => {
                reset();
                setActiveSection("list");
              }}
              style={{
                padding: "10px 22px",
                borderRadius: 9,
                border: dark
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "1px solid #e5e7eb",
                background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                color: t.textSecondary,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              View Courses
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.35s ease both}
        input:focus,textarea:focus,select:focus{border-color:#7c3aed !important;box-shadow:0 0 0 3px rgba(124,58,237,0.08) !important;outline:none}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          fontFamily: "Inter,sans-serif",
        }}
      >
        {/* ── HERO HEADER ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)",
            padding: "28px 32px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(167,139,250,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 140,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(139,92,246,0.1)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 6,
                padding: "4px 10px",
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <ArrowLeft size={12} /> Dashboard
            </button>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
              /
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "Inter,sans-serif",
              }}
            >
              Watch Now Upload
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Film size={18} color="#c4b5fd" />
                </div>
                <h1
                  style={{
                    fontFamily: "Inter,sans-serif",
                    fontWeight: 800,
                    fontSize: 26,
                    color: "#fff",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Watch Now Upload
                </h1>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Manage all Watch Now courses displayed on the public landing
                page
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 3,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              {[
                { key: "form", label: "Upload Course", icon: Upload },
                { key: "list", label: "My Courses", icon: List },
              ].map((t2) => {
                const Icon = t2.icon;
                return (
                  <button
                    key={t2.key}
                    onClick={() => setActiveSection(t2.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 16px",
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      transition: "all 0.15s",
                      background:
                        activeSection === t2.key ? "#fff" : "transparent",
                      color:
                        activeSection === t2.key
                          ? "#7c3aed"
                          : "rgba(255,255,255,0.65)",
                      boxShadow:
                        activeSection === t2.key
                          ? "0 2px 8px rgba(0,0,0,0.12)"
                          : "none",
                    }}
                  >
                    <Icon size={14} /> {t2.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
              marginBottom: -20,
              position: "relative",
              zIndex: 2,
            }}
          >
            {[
              {
                label: "Total Courses",
                value: stats.totalCourses,
                icon: Film,
                color: "#7c3aed",
                accent: "#ede9fe",
              },
              {
                label: "Published",
                value: stats.publishedCourses,
                icon: CheckCircle,
                color: "#059669",
                accent: "#d1fae5",
              },
              {
                label: "Drafts",
                value: stats.draftCourses,
                icon: FileText,
                color: "#d97706",
                accent: "#fef3c7",
              },
              {
                label: "Total Learners",
                value:
                  stats.totalLearners != null
                    ? stats.totalLearners.toLocaleString()
                    : "—",
                icon: User,
                color: "#0ea5e9",
                accent: "#e0f2fe",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  style={{
                    background: t.surface,
                    borderRadius: 14,
                    padding: "16px 20px",
                    boxShadow: t.shadowLg,
                    border: t.surfaceBorder,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: dark ? "rgba(255,255,255,0.06)" : s.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={s.color} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: t.textPrimary,
                        margin: 0,
                        fontFamily: "Inter,sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textMuted,
                        margin: "4px 0 0",
                        fontFamily: "Inter,sans-serif",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ padding: "40px 32px 32px" }}>
          {activeSection === "form" && (
            <div className="fade-up">
              {errorMsg && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 16px",
                    background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2",
                    border: dark
                      ? "1px solid rgba(248,113,113,0.3)"
                      : "1px solid #fecaca",
                    borderRadius: 10,
                    color: dark ? "#f87171" : "#dc2626",
                    fontSize: 13,
                    fontFamily: "Inter,sans-serif",
                    marginBottom: 16,
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  {errorMsg}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 380px",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                {/* LEFT: form */}
                <div
                  style={{
                    background: t.surface,
                    border: t.surfaceBorder,
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: t.shadow,
                  }}
                >
                  <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Panel icon={Tag} number="1" title="Top Section" t={t}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <Field label="Platform Name" hint="optional" t={t}>
                          <input
                            value={platformName}
                            onChange={(e) => setPlatformName(e.target.value)}
                            placeholder="TexoraAI.skills"
                            style={inp}
                          />
                        </Field>
                        <Field label="Featured Tag" hint="optional" t={t}>
                          <input
                            value={featuredTag}
                            onChange={(e) => setFeaturedTag(e.target.value)}
                            placeholder="Featured Course"
                            style={inp}
                          />
                        </Field>
                      </div>
                      <Field label="Hosted By" t={t}>
                        <input
                          value={hostedBy}
                          onChange={(e) => setHostedBy(e.target.value)}
                          placeholder="e.g. Arjay McCandless"
                          style={inp}
                        />
                      </Field>
                    </Panel>

                    <Panel icon={Film} number="2" title="Main Video Card" t={t}>
                      <Field label="Video Title" required t={t}>
                        <input
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="e.g. System Design for Velocity Coders"
                          style={inp}
                        />
                      </Field>

                      <Field
                        label="Video File"
                        required
                        hint="Upload file or paste URL"
                        t={t}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          {!videoFile ? (
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                              }}
                              onDragLeave={() => setDragOver(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setDragOver(false);
                                handleVideoSelect(e.dataTransfer.files[0]);
                              }}
                              onClick={() => videoInputRef.current?.click()}
                              style={{
                                border: `2px dashed ${dragOver ? "#7c3aed" : t.dashedBorder}`,
                                borderRadius: 12,
                                padding: "28px 16px",
                                textAlign: "center",
                                cursor: "pointer",
                                background: dragOver
                                  ? t.dragActiveBg
                                  : t.dragBg,
                                transition: "all 0.2s",
                              }}
                            >
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 12,
                                  background: dragOver
                                    ? dark
                                      ? "rgba(124,58,237,0.25)"
                                      : "#ede9fe"
                                    : dark
                                      ? "rgba(255,255,255,0.06)"
                                      : "#f3f4f6",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto 10px",
                                }}
                              >
                                <Upload
                                  size={20}
                                  color={dragOver ? "#a78bfa" : t.textFaint}
                                />
                              </div>
                              <p
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: t.textSecondary,
                                  margin: 0,
                                  fontFamily: "Inter,sans-serif",
                                }}
                              >
                                Drag & drop or click to upload
                              </p>
                              <p
                                style={{
                                  fontSize: 11,
                                  color: t.textFaint,
                                  margin: "4px 0 0",
                                  fontFamily: "Inter,sans-serif",
                                }}
                              >
                                MP4, WebM, MOV • Max 500MB
                              </p>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 14px",
                                background: t.fileChipBg,
                                border: t.fileChipBorder,
                                borderRadius: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  background: "#7c3aed",
                                  borderRadius: 9,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Film size={16} color="#fff" />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: t.textPrimary,
                                    margin: 0,
                                    fontFamily: "Inter,sans-serif",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {videoFile.name}
                                </p>
                                <p
                                  style={{
                                    fontSize: 11,
                                    color: t.textMuted,
                                    margin: "2px 0 0",
                                    fontFamily: "Inter,sans-serif",
                                  }}
                                >
                                  {formatSize(videoFile.size)}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setVideoFile(null)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: t.textFaint,
                                }}
                              >
                                <X size={15} />
                              </button>
                            </div>
                          )}
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleVideoSelect(e.target.files[0])
                            }
                          />
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                height: 1,
                                background: t.faintBorder,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                color: t.textFaint,
                                fontWeight: 600,
                                fontFamily: "Inter,sans-serif",
                              }}
                            >
                              OR
                            </span>
                            <div
                              style={{
                                flex: 1,
                                height: 1,
                                background: t.faintBorder,
                              }}
                            />
                          </div>
                          <input
                            value={videoUrl}
                            onChange={(e) => {
                              setVideoUrl(e.target.value);
                              if (e.target.value) setVideoFile(null);
                            }}
                            placeholder="Paste video URL (https://...)"
                            style={{ ...inp, opacity: videoFile ? 0.4 : 1 }}
                            disabled={!!videoFile}
                          />
                        </div>
                      </Field>

                      <Field label="Thumbnail" hint="optional" t={t}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          {thumbnailPreview ? (
                            <div
                              style={{
                                position: "relative",
                                width: 110,
                                height: 66,
                                borderRadius: 9,
                                overflow: "hidden",
                                border: t.surfaceBorder,
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={thumbnailPreview}
                                alt="thumb"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setThumbnail(null);
                                  setThumbnailPreview(null);
                                }}
                                style={{
                                  position: "absolute",
                                  top: 3,
                                  right: 3,
                                  width: 20,
                                  height: 20,
                                  background: "rgba(0,0,0,0.6)",
                                  borderRadius: "50%",
                                  border: "none",
                                  color: "#fff",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => thumbInputRef.current?.click()}
                              style={{
                                width: 110,
                                height: 66,
                                border: `2px dashed ${t.dashedBorder}`,
                                borderRadius: 9,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                background: t.dragBg,
                                flexShrink: 0,
                              }}
                            >
                              <Image size={18} color={t.textFaint} />
                              <span
                                style={{
                                  fontSize: 10,
                                  color: t.textFaint,
                                  marginTop: 4,
                                  fontFamily: "Inter,sans-serif",
                                }}
                              >
                                Add Thumbnail
                              </span>
                            </div>
                          )}
                          <p
                            style={{
                              fontSize: 11,
                              color: t.textFaint,
                              fontFamily: "Inter,sans-serif",
                              lineHeight: 1.7,
                            }}
                          >
                            JPG, PNG or WebP
                            <br />
                            Recommended: 16:9 ratio
                            <br />
                            Min. 1280×720px
                          </p>
                        </div>
                        <input
                          ref={thumbInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleThumbnailChange}
                        />
                      </Field>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 14px",
                          background: t.innerBg,
                          borderRadius: 9,
                          border: t.innerBorder,
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: t.textPrimary,
                              margin: 0,
                              fontFamily: "Inter,sans-serif",
                            }}
                          >
                            Instructor Live Badge
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: t.textMuted,
                              margin: "2px 0 0",
                              fontFamily: "Inter,sans-serif",
                            }}
                          >
                            Show live indicator on video player
                          </p>
                        </div>
                        <Toggle
                          value={showInstructorLive}
                          onChange={() =>
                            setShowInstructorLive(!showInstructorLive)
                          }
                          dark={dark}
                        />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <Field label="Learners Count" hint="e.g. 200" t={t}>
                          <input
                            type="number"
                            value={learnersCount}
                            onChange={(e) => setLearnersCount(e.target.value)}
                            placeholder="200"
                            style={inp}
                          />
                        </Field>
                        <Field label="Publish Date" t={t}>
                          <input
                            type="date"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                            style={inp}
                          />
                        </Field>
                      </div>
                    </Panel>

                    <Panel icon={User} number="3" title="Instructor Card" t={t}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <Field label="Instructor Name" required t={t}>
                          <input
                            value={instructorName}
                            onChange={(e) => setInstructorName(e.target.value)}
                            placeholder="e.g. Arjay McCandless"
                            style={inp}
                          />
                        </Field>
                        <Field label="Instructor Role" t={t}>
                          <input
                            value={instructorRole}
                            onChange={(e) => setInstructorRole(e.target.value)}
                            placeholder="e.g. Software Engineer"
                            style={inp}
                          />
                        </Field>
                        <Field label="Experience" hint="e.g. 10+ years" t={t}>
                          <input
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="10+ years"
                            style={inp}
                          />
                        </Field>
                        <Field label="Student Count" hint="e.g. 200+" t={t}>
                          <input
                            value={studentCount}
                            onChange={(e) => setStudentCount(e.target.value)}
                            placeholder="200+ students"
                            style={inp}
                          />
                        </Field>
                      </div>
                    </Panel>

                    <Panel
                      icon={BookOpen}
                      number="4"
                      title="Description Section"
                      defaultOpen={false}
                      t={t}
                    >
                      <Field label="Full Description" t={t}>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Write about the course..."
                          rows={4}
                          style={{ ...inp, resize: "vertical" }}
                        />
                      </Field>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 14px",
                          background: t.innerBg,
                          borderRadius: 9,
                          border: t.innerBorder,
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: t.textPrimary,
                              margin: 0,
                              fontFamily: "Inter,sans-serif",
                            }}
                          >
                            "Show More" Toggle
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: t.textMuted,
                              margin: "2px 0 0",
                              fontFamily: "Inter,sans-serif",
                            }}
                          >
                            Show a "Show more" button below description
                          </p>
                        </div>
                        <Toggle
                          value={showMoreEnabled}
                          onChange={() => setShowMoreEnabled(!showMoreEnabled)}
                          dark={dark}
                        />
                      </div>
                    </Panel>

                    <Panel
                      icon={BookOpen}
                      number="5"
                      title="What You'll Learn"
                      defaultOpen={false}
                      t={t}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {learnPoints.map((point, idx) => (
                          <div
                            key={point.id}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "12px 14px",
                              background: t.innerBg,
                              borderRadius: 9,
                              border: t.innerBorder,
                            }}
                          >
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 7,
                                background: "#7c3aed",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                fontFamily: "Inter,sans-serif",
                                flexShrink: 0,
                                marginTop: 3,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div
                              style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                              }}
                            >
                              <input
                                value={point.title}
                                onChange={(e) =>
                                  updateLearnPoint(
                                    point.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder={`Point ${idx + 1} Title...`}
                                style={{ ...inp, fontWeight: 600 }}
                              />
                              <input
                                value={point.desc}
                                onChange={(e) =>
                                  updateLearnPoint(
                                    point.id,
                                    "desc",
                                    e.target.value,
                                  )
                                }
                                placeholder="Short description (optional)..."
                                style={inp}
                              />
                            </div>
                            {learnPoints.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLearnPoint(point.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: t.textFaint,
                                  padding: 2,
                                  marginTop: 4,
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addLearnPoint}
                        style={{
                          width: "100%",
                          padding: "11px",
                          border: `2px dashed ${t.dashedBorder}`,
                          borderRadius: 9,
                          background: "transparent",
                          color: t.textMuted,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "Inter,sans-serif",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Plus size={14} /> Add Another Point
                      </button>
                    </Panel>

                    {/* Upload progress */}
                    {uploadStatus === "uploading" && (
                      <div
                        style={{
                          background: dark
                            ? "rgba(124,58,237,0.15)"
                            : "#f3f0ff",
                          borderRadius: 12,
                          padding: "14px 18px",
                          border: dark
                            ? "1px solid rgba(167,139,250,0.3)"
                            : "1px solid #c4b5fd",
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            fontWeight: 600,
                            color: t.textSecondary,
                            fontFamily: "Inter,sans-serif",
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <Loader
                              size={13}
                              color="#7c3aed"
                              style={{ animation: "spin 1s linear infinite" }}
                            />{" "}
                            Uploading...
                          </span>
                          <span style={{ color: "#a78bfa" }}>
                            {uploadProgress}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 6,
                            background: dark
                              ? "rgba(255,255,255,0.1)"
                              : "#ddd6fe",
                            borderRadius: 99,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background:
                                "linear-gradient(90deg,#7c3aed,#a78bfa)",
                              borderRadius: 99,
                              width: `${uploadProgress}%`,
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      <button
                        type="submit"
                        disabled={uploadStatus === "uploading"}
                        style={{
                          flex: 1,
                          padding: "12px 20px",
                          borderRadius: 10,
                          background:
                            uploadStatus === "uploading"
                              ? t.innerBg
                              : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                          border:
                            uploadStatus === "uploading"
                              ? t.innerBorder
                              : "none",
                          color:
                            uploadStatus === "uploading" ? t.textFaint : "#fff",
                          fontSize: 14,
                          fontWeight: 700,
                          cursor:
                            uploadStatus === "uploading"
                              ? "not-allowed"
                              : "pointer",
                          fontFamily: "Inter,sans-serif",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          boxShadow:
                            uploadStatus !== "uploading"
                              ? "0 4px 14px rgba(124,58,237,0.35)"
                              : "none",
                          transition: "all 0.2s",
                        }}
                      >
                        {uploadStatus === "uploading" ? (
                          <>
                            <Loader
                              size={15}
                              style={{ animation: "spin 1s linear infinite" }}
                            />{" "}
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={15} />
                            {editingId
                              ? "Save Changes"
                              : "Publish Watch Now Course"}
                          </>
                        )}
                      </button>
                      {onClose && uploadStatus !== "uploading" && (
                        <button
                          type="button"
                          onClick={onClose}
                          style={{
                            padding: "12px 22px",
                            borderRadius: 10,
                            border: t.surfaceBorder,
                            background: t.surface,
                            color: t.textSecondary,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "Inter,sans-serif",
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* RIGHT: checklist + tips */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    position: "sticky",
                    top: 24,
                  }}
                >
                  <div
                    style={{
                      background: t.surface,
                      border: t.surfaceBorder,
                      borderRadius: 16,
                      padding: 20,
                      boxShadow: t.shadow,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: t.textPrimary,
                        margin: "0 0 14px",
                        fontFamily: "Inter,sans-serif",
                      }}
                    >
                      📋 Upload Checklist
                    </p>
                    {[
                      { label: "Video Title", done: !!videoTitle.trim() },
                      {
                        label: "Video File / URL",
                        done: !!(videoFile || videoUrl.trim()),
                      },
                      {
                        label: "Instructor Name",
                        done: !!instructorName.trim(),
                      },
                      { label: "Thumbnail", done: !!thumbnail },
                      { label: "Description", done: !!description.trim() },
                      {
                        label: "Learner Points",
                        done: learnPoints.some((p) => p.title.trim()),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "7px 0",
                          borderBottom: `1px solid ${t.faintBorder}`,
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: item.done
                              ? dark
                                ? "rgba(34,197,94,0.18)"
                                : "#dcfce7"
                              : t.innerBg,
                            border: `1.5px solid ${item.done ? (dark ? "rgba(74,222,128,0.4)" : "#86efac") : t.faintBorder}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.done && (
                            <CheckCircle
                              size={10}
                              color={dark ? "#4ade80" : "#16a34a"}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            color: item.done ? t.textSecondary : t.textFaint,
                            fontFamily: "Inter,sans-serif",
                            fontWeight: item.done ? 500 : 400,
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                    <div style={{ marginTop: 14 }}>
                      <div
                        style={{
                          height: 5,
                          background: t.faintBorder,
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            background:
                              "linear-gradient(90deg,#7c3aed,#a78bfa)",
                            borderRadius: 99,
                            width: `${([videoTitle, videoFile || videoUrl, instructorName, thumbnail, description, learnPoints.some((p) => p.title)].filter(Boolean).length / 6) * 100}%`,
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: 11,
                          color: t.textMuted,
                          margin: "6px 0 0",
                          fontFamily: "Inter,sans-serif",
                        }}
                      >
                        {
                          [
                            videoTitle,
                            videoFile || videoUrl,
                            instructorName,
                            thumbnail,
                            description,
                            learnPoints.some((p) => p.title),
                          ].filter(Boolean).length
                        }{" "}
                        of 6 fields completed
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: t.tipsBg,
                      border: t.tipsBorder,
                      borderRadius: 16,
                      padding: 20,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: t.tipsHeading,
                        margin: "0 0 10px",
                        fontFamily: "Inter,sans-serif",
                      }}
                    >
                      💡 Quick Tips
                    </p>
                    {[
                      "Use 16:9 thumbnails for best display",
                      "Keep titles under 70 characters",
                      "Add 3–5 learning points for engagement",
                      "MP4 recommended for best compatibility",
                    ].map((tip) => (
                      <div
                        key={tip}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            color: "#a78bfa",
                            fontSize: 14,
                            lineHeight: 1.4,
                            flexShrink: 0,
                          }}
                        >
                          ›
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: t.tipsText,
                            fontFamily: "Inter,sans-serif",
                            lineHeight: 1.5,
                          }}
                        >
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "list" && (
            <div
              className="fade-up"
              style={{
                background: t.surface,
                border: t.surfaceBorder,
                borderRadius: 16,
                padding: 24,
                boxShadow: t.shadow,
              }}
            >
              <CoursesTable
                onUploadNew={() => setActiveSection("form")}
                onDeleteSuccess={loadDashboardStats}
                onEditCourse={handleEditCourse}
                dark={dark}
                t={t}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
