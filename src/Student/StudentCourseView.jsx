// import axios from "axios";
// import {
//   BookOpen,
//   CheckCircle,
//   File,
//   FileText,
//   GraduationCap,
//   Lock,
//   PlayCircle,
//   Video,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { progressService } from "../services/progressService";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const getEmailFromToken = () => {
//   try {
//     const token = localStorage.getItem("lms_token");
//     if (!token) return null;
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch {
//     return null;
//   }
// };

// export default function StudentCourseView() {
//   const { id } = useParams();

//   const [course, setCourse] = useState(null);
//   const [contents, setContents] = useState([]);
//   const [active, setActive] = useState(null);
//   const [mediaUrl, setMediaUrl] = useState(null);
//   const [mediaType, setMediaType] = useState(null);
//   const [completedIds, setCompletedIds] = useState([]);
//   const [progressPercent, setProgressPercent] = useState(0);

//   // ✅ Track which video IDs have been auto-marked this session (prevent duplicate API calls)
//   const autoMarkedRef = useRef(new Set());
//   // ✅ Ref to video element for timeupdate tracking
//   const videoRef = useRef(null);

//   const studentEmail = getEmailFromToken();

//   // ✅ Recalculate percentage from real content count — fixes stale DB value
//   const calcPercent = (ids, validContents) => {
//     if (!validContents || validContents.length === 0) return 0;
//     return Math.min(Math.round((ids.length / validContents.length) * 100), 100);
//   };

//   useEffect(() => {
//     load();
//     return () => {
//       if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
//     };
//   }, []);

//   const load = async () => {
//     try {
//       const [courseRes, contentRes] = await Promise.all([
//         axios.get(`${API}/courses/${id}`, { headers: authHeader() }),
//         axios.get(`${API}/content/student/course/${id}`, {
//           headers: authHeader(),
//         }),
//       ]);

//       const valid = contentRes.data.filter(
//         (c) => c.url && c.url !== "undefined",
//       );
//       setCourse(courseRes.data);
//       setContents(valid);

//       if (studentEmail) {
//         try {
//           const prog = await progressService.getProgress(
//             studentEmail,
//             Number(id),
//           );
//           const ids = prog.data.completedContentIds || [];
//           setCompletedIds(ids);
//           setProgressPercent(calcPercent(ids, valid));
//         } catch {
//           setCompletedIds([]);
//           setProgressPercent(0);
//         }
//       }
//     } catch (err) {
//       console.error("Load failed", err);
//     }
//   };

//   // ✅ Core progress update — called automatically, never manually
//   const markComplete = async (contentId, currentContents) => {
//     if (!studentEmail) return;
//     try {
//       const res = await progressService.markContentComplete(
//         studentEmail,
//         Number(id),
//         contentId,
//         currentContents.length,
//       );
//       const updatedIds = res.data.completedContentIds || [];
//       setCompletedIds(updatedIds);
//       setProgressPercent(calcPercent(updatedIds, currentContents));
//     } catch (err) {
//       console.error("Progress update failed", err);
//     }
//   };

//   // ✅ Check if a content item is unlocked
//   // Rule: index 0 always unlocked, others only if previous is completed
//   const isUnlocked = (index) => {
//     if (index === 0) return true;
//     const prevContent = contents[index - 1];
//     return completedIds.includes(prevContent.id);
//   };

//   // ✅ Play video — only if unlocked
//   const playVideo = async (c, index) => {
//     if (!isUnlocked(index)) return; // locked — do nothing
//     if (!c?.url) {
//       alert("Video missing");
//       return;
//     }
//     try {
//       const cleanFileName = c.url.split("/").pop();
//       const res = await axios.get(
//         `${API}/course-videos/stream/${encodeURIComponent(cleanFileName)}`,
//         { responseType: "blob", headers: authHeader() },
//       );
//       const blobUrl = URL.createObjectURL(
//         new Blob([res.data], { type: "video/mp4" }),
//       );
//       setMediaUrl(blobUrl);
//       setMediaType("VIDEO");
//       setActive(c);
//       // ✅ DO NOT mark complete here for videos — wait for 80% watch
//     } catch (err) {
//       console.error("Video load failed", err);
//     }
//   };

//   // ✅ Open PDF — auto-mark complete immediately on open
//   const openPdf = async (c, index) => {
//     if (!isUnlocked(index)) return; // locked — do nothing
//     if (!c?.url) {
//       alert("File missing");
//       return;
//     }
//     try {
//       const cleanFileName = c.url.split("/").pop();
//       if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);

//       const res = await axios.get(
//         `${API}/course-files/download/${encodeURIComponent(cleanFileName)}`,
//         { responseType: "blob", headers: authHeader() },
//       );
//       const blobUrl = URL.createObjectURL(
//         new Blob([res.data], { type: "application/pdf" }),
//       );
//       setMediaUrl(blobUrl);
//       setMediaType("PDF");
//       setActive(c);

//       // ✅ PDF: mark complete immediately when opened
//       if (!completedIds.includes(c.id)) {
//         markComplete(c.id, contents);
//       }
//     } catch (err) {
//       console.error("PDF load failed", err);
//     }
//   };

//   // ✅ Auto-mark video watched at 80% — same pattern as VideoLectures.jsx
//   useEffect(() => {
//     const videoEl = videoRef.current;
//     if (!videoEl || !active || mediaType !== "VIDEO") return;

//     const handleTimeUpdate = () => {
//       const { currentTime, duration } = videoEl;
//       if (!duration || duration === 0) return;
//       const watchedPercent = (currentTime / duration) * 100;

//       if (watchedPercent >= 80) {
//         // ✅ Only fire once per video per session
//         if (
//           !autoMarkedRef.current.has(active.id) &&
//           !completedIds.includes(active.id)
//         ) {
//           autoMarkedRef.current.add(active.id);
//           markComplete(active.id, contents);
//         }
//       }
//     };

//     videoEl.addEventListener("timeupdate", handleTimeUpdate);
//     return () => videoEl.removeEventListener("timeupdate", handleTimeUpdate);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [active, mediaType, completedIds]);

//   const videoCount = contents.filter((c) => c.contentType === "VIDEO").length;
//   const pdfCount = contents.filter((c) => c.contentType === "PDF").length;
//   const isAllCompleted =
//     contents.length > 0 && completedIds.length >= contents.length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//       {/* HERO BANNER */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//         <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

//         <div className="relative px-6 py-12 md:py-16 max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row items-start justify-between gap-6">
//             <div className="flex-1">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
//                 <GraduationCap className="h-4 w-4 text-blue-300" />
//                 <span className="text-xs font-semibold text-white uppercase tracking-wider">
//                   Course Content
//                 </span>
//               </div>

//               <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
//                 {course?.title || "Loading..."}
//               </h1>
//               <p className="text-base md:text-lg text-white/90 mb-6 max-w-3xl">
//                 {course?.description || "Course description will appear here"}
//               </p>

//               {/* Stats */}
//               <div className="flex flex-wrap items-center gap-4 mb-4">
//                 <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
//                   <BookOpen className="h-5 w-5 text-white/80" />
//                   <div>
//                     <p className="text-xl font-bold text-white">
//                       {contents.length}
//                     </p>
//                     <p className="text-xs text-white/70">Total Modules</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
//                   <Video className="h-5 w-5 text-white/80" />
//                   <div>
//                     <p className="text-xl font-bold text-white">{videoCount}</p>
//                     <p className="text-xs text-white/70">Videos</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
//                   <FileText className="h-5 w-5 text-white/80" />
//                   <div>
//                     <p className="text-xl font-bold text-white">{pdfCount}</p>
//                     <p className="text-xs text-white/70">Documents</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               {contents.length > 0 && (
//                 <div className="max-w-md">
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-sm text-white/80 font-medium">
//                       Your Progress
//                     </span>
//                     <span className="text-sm font-bold text-white">
//                       {progressPercent}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-white/20 rounded-full h-3">
//                     <div
//                       className="bg-white rounded-full h-3 transition-all duration-500"
//                       style={{ width: `${progressPercent}%` }}
//                     />
//                   </div>
//                   <p className="text-xs text-white/60 mt-1">
//                     {completedIds.length} of {contents.length} completed
//                   </p>

//                   {/* ✅ Course Completed banner in hero */}
//                   {isAllCompleted && (
//                     <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-400/30 border border-green-300/50 backdrop-blur-sm">
//                       <CheckCircle className="h-5 w-5 text-green-300" />
//                       <span className="text-sm font-bold text-white">
//                         🎉 Course Completed!
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CONTENT AREA */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT — Content List */}
//           <div className="lg:col-span-1">
//             <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-5 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
//               <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
//                 <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
//                 <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
//                   Course Modules
//                 </h2>
//               </div>

//               {/* ✅ Sequential rule hint */}
//               <div className="mb-4 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
//                 <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
//                   📋 Complete each module in order to unlock the next one
//                 </p>
//               </div>

//               <div className="space-y-3">
//                 {contents.length === 0 ? (
//                   <div className="text-center py-8">
//                     <File className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       No content available
//                     </p>
//                   </div>
//                 ) : (
//                   contents.map((c, index) => {
//                     const isDone = completedIds.includes(c.id);
//                     const isActive = active?.id === c.id;
//                     const unlocked = isUnlocked(index);

//                     return (
//                       <div
//                         key={c.id}
//                         className={`group p-4 rounded-xl border-2 transition-all duration-200
//                           ${
//                             isActive
//                               ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border-indigo-500 dark:border-indigo-400 shadow-md"
//                               : isDone
//                                 ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
//                                 : unlocked
//                                   ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:shadow-sm cursor-pointer"
//                                   : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
//                           }`}
//                       >
//                         <div className="flex items-start gap-3">
//                           {/* Index / Status icon */}
//                           <div
//                             className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
//                               ${
//                                 isDone
//                                   ? "bg-green-500 text-white"
//                                   : isActive
//                                     ? "bg-indigo-500 text-white"
//                                     : unlocked
//                                       ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
//                                       : "bg-slate-200 dark:bg-slate-700 text-slate-400"
//                               }`}
//                           >
//                             {isDone ? (
//                               <CheckCircle size={16} />
//                             ) : !unlocked ? (
//                               <Lock size={14} />
//                             ) : (
//                               index + 1
//                             )}
//                           </div>

//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-start gap-2 mb-2">
//                               {c.contentType === "VIDEO" ? (
//                                 <Video
//                                   className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-indigo-600" : unlocked ? "text-slate-400" : "text-slate-300"}`}
//                                 />
//                               ) : (
//                                 <FileText
//                                   className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-indigo-600" : unlocked ? "text-slate-400" : "text-slate-300"}`}
//                                 />
//                               )}
//                               <h3
//                                 className={`text-sm font-semibold line-clamp-2
//                                 ${
//                                   unlocked
//                                     ? "text-slate-900 dark:text-slate-100"
//                                     : "text-slate-400 dark:text-slate-500"
//                                 }`}
//                               >
//                                 {c.title}
//                               </h3>
//                             </div>

//                             <div className="flex items-center gap-2 mb-3 flex-wrap">
//                               <span
//                                 className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
//                                 ${
//                                   c.contentType === "VIDEO"
//                                     ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
//                                     : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
//                                 }`}
//                               >
//                                 {c.contentType}
//                               </span>
//                               {isDone && (
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
//                                   ✓ Done
//                                 </span>
//                               )}
//                               {!unlocked && (
//                                 <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500">
//                                   <Lock size={10} /> Locked
//                                 </span>
//                               )}
//                               {/* ✅ Hint for videos not yet done */}
//                               {unlocked &&
//                                 !isDone &&
//                                 c.contentType === "VIDEO" && (
//                                   <span className="text-[10px] text-slate-400 italic">
//                                     Watch 80% to complete
//                                   </span>
//                                 )}
//                             </div>

//                             {/* Action buttons — only shown if unlocked */}
//                             {c.contentType === "VIDEO" && (
//                               <button
//                                 onClick={() => unlocked && playVideo(c, index)}
//                                 disabled={!unlocked}
//                                 className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all
//                                   ${
//                                     unlocked
//                                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg cursor-pointer"
//                                       : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
//                                   }`}
//                               >
//                                 <PlayCircle size={14} />
//                                 {isDone
//                                   ? "Replay Video"
//                                   : unlocked
//                                     ? "Play Video"
//                                     : "Locked"}
//                               </button>
//                             )}

//                             {c.contentType === "PDF" && (
//                               <button
//                                 onClick={() => unlocked && openPdf(c, index)}
//                                 disabled={!unlocked}
//                                 className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all
//                                   ${
//                                     unlocked
//                                       ? "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-300 cursor-pointer"
//                                       : "bg-slate-100 dark:bg-slate-700 text-slate-400 border-2 border-slate-200 dark:border-slate-700 cursor-not-allowed"
//                                   }`}
//                               >
//                                 <FileText size={14} />
//                                 {isDone
//                                   ? "View Again"
//                                   : unlocked
//                                     ? "View Document"
//                                     : "Locked"}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT — Media Player */}
//           <div className="lg:col-span-2">
//             <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6">
//               {!mediaUrl ? (
//                 <div className="h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
//                     <BookOpen
//                       className="relative w-20 h-20 mb-4 text-indigo-500 dark:text-indigo-400"
//                       strokeWidth={1.5}
//                     />
//                   </div>
//                   <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
//                     Ready to Learn?
//                   </p>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">
//                     Select a module from the left to begin
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {/* Active content header */}
//                   {active && (
//                     <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
//                       <div className="flex items-start gap-3">
//                         <div className="p-2 rounded-lg bg-indigo-500 text-white">
//                           {mediaType === "VIDEO" ? (
//                             <Video className="h-5 w-5" />
//                           ) : (
//                             <FileText className="h-5 w-5" />
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
//                             {active.title}
//                           </h3>
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <span
//                               className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
//                               ${
//                                 mediaType === "VIDEO"
//                                   ? "bg-purple-100 text-purple-700"
//                                   : "bg-blue-100 text-blue-700"
//                               }`}
//                             >
//                               {mediaType}
//                             </span>
//                             {completedIds.includes(active.id) && (
//                               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
//                                 <CheckCircle size={12} /> Completed
//                               </span>
//                             )}
//                             {/* ✅ Hint for video in progress */}
//                             {mediaType === "VIDEO" &&
//                               !completedIds.includes(active.id) && (
//                                 <span className="text-xs text-amber-600 dark:text-amber-400 italic">
//                                   ⏱ Watch 80% to auto-complete
//                                 </span>
//                               )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Media player */}
//                   <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-700">
//                     {mediaType === "VIDEO" && (
//                       // ✅ videoRef attached for 80% auto-complete tracking
//                       <video
//                         ref={videoRef}
//                         src={mediaUrl}
//                         controls
//                         autoPlay
//                         controlsList="nodownload"
//                         disablePictureInPicture
//                         className="w-full aspect-video bg-black"
//                       />
//                     )}
//                     {mediaType === "PDF" && (
//                       <iframe
//                         src={mediaUrl}
//                         className="w-full h-[600px]"
//                         title="PDF Viewer"
//                       />
//                     )}
//                   </div>

//                   {/* ✅ Status bar — no button, just auto status */}
//                   {active && (
//                     <div className="flex items-center justify-between pt-2">
//                       {completedIds.includes(active.id) ? (
//                         <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
//                           <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
//                           <span className="text-sm font-semibold text-green-700 dark:text-green-400">
//                             Marked as Complete
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
//                           <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
//                           <span className="text-sm text-amber-700 dark:text-amber-400">
//                             {mediaType === "VIDEO"
//                               ? "Keep watching... (80% needed)"
//                               : "Loading..."}
//                           </span>
//                         </div>
//                       )}
//                       <span className="text-xs text-slate-400 dark:text-slate-500">
//                         {completedIds.length} of {contents.length} completed
//                       </span>
//                     </div>
//                   )}

//                   {/* ✅ Course completed celebration */}
//                   {isAllCompleted && (
//                     <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700">
//                       <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400 flex-shrink-0" />
//                       <div>
//                         <p className="text-base font-bold text-green-800 dark:text-green-300">
//                           🎉 Course Completed!
//                         </p>
//                         <p className="text-xs text-green-600 dark:text-green-400">
//                           You have completed all modules in this course.
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






































import axios from "axios";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  File,
  FileText,
  GraduationCap,
  Lock,
  PlayCircle,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { progressService } from "../services/progressService";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ─── CSS — matches MyCourses exactly ───────────────────────────────────── */
const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  /* ── LIGHT TOKENS ── */
  .scv-root {
    --bg:           #f1f5f9;
    --card:         #ffffff;
    --text:         #0f172a;
    --text-muted:   #64748b;
    --border:       #e2e8f0;
    --accent1:      #22d3ee;
    --accent2:      #fb923c;
    --accent3:      #34d399;
    --accent4:      #a78bfa;
    --shadow:       0 4px 24px rgba(0,0,0,0.06);
    --shadow-lg:    0 8px 40px rgba(0,0,0,0.10);
    --radius:       20px;

    /* module states */
    --bg-active-hdr:      linear-gradient(135deg,#eef2ff,#f5f3ff);
    --bg-module-locked:   #f8fafc;
    --bg-prog-track:      #e2e8f0;
    --border-active:      #6366f1;
    --border-done-mod:    #86efac;
    --border-player:      #c7d2fe;
    --text-done:          #15803d;
    --text-watch:         #92400e;
    --bg-status-done:     #f0fdf4;
    --bg-status-watch:    #fffbeb;
    --bg-badge-video:     #ede9fe;
    --bg-badge-pdf:       #dbeafe;
    --bg-badge-done:      #dcfce7;
    --bg-badge-locked:    #f1f5f9;
    --text-badge-video:   #7c3aed;
    --text-badge-pdf:     #1d4ed8;
    --border-status-done: #86efac;
    --border-status-watch:#fde68a;
    --bg-celebration:     linear-gradient(135deg,#f0fdf4,#ecfdf5);
    --border-celebration: #86efac;
    --bg-alert:           #fffbeb;
    --border-alert:       #fde68a;
    --text-alert:         #92400e;
    --accent:             #6366f1;
    --accent2-mod:        #a855f7;
    --accent-teal:        #14b8a6;
    --shadow-player:      0 4px 16px rgba(0,0,0,0.08);
  }

  /* ── DARK TOKENS ── */
  .scv-root.dark-theme {
    --bg:           #0a0a0a;
    --card:         #111111;
    --text:         #ffffff;
    --text-muted:   #94a3b8;
    --border:       rgba(255,255,255,0.06);
    --shadow:       0 4px 24px rgba(0,0,0,0.40);
    --shadow-lg:    0 8px 40px rgba(0,0,0,0.60);

    --bg-active-hdr:      linear-gradient(135deg,#16161f,#111118);
    --bg-module-locked:   #0d0d14;
    --bg-prog-track:      #1c1c28;
    --border-active:      #6366f1;
    --border-done-mod:    #0d3d1f;
    --border-player:      #1e1e40;
    --text-done:          #22c55e;
    --text-watch:         #e0a800;
    --bg-status-done:     #051a0e;
    --bg-status-watch:    #1c1400;
    --bg-badge-video:     #16101f;
    --bg-badge-pdf:       #0c1020;
    --bg-badge-done:      #051a0e;
    --bg-badge-locked:    #111118;
    --text-badge-video:   #9b7eef;
    --text-badge-pdf:     #5b9cf6;
    --border-status-done: #0d3d1f;
    --border-status-watch:#3d2800;
    --bg-celebration:     linear-gradient(135deg,#051a0e,#041610);
    --border-celebration: #0d3d1f;
    --bg-alert:           #1c1400;
    --border-alert:       #3d2800;
    --text-alert:         #e0a800;
    --accent:             #6366f1;
    --accent2-mod:        #a855f7;
    --accent-teal:        #14b8a6;
    --shadow-player:      0 4px 28px rgba(0,0,0,0.65);
  }

  /* ── BASE ── */
  .scv-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s, color 0.3s;
  }

  .scv-inner {
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ══ HERO CARD — matches mc-header exactly ══ */
  .scv-hero {
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
    transition: background 0.3s, border-color 0.3s;
  }

  .scv-hero-left {}

  /* badge */
  .scv-hero-badge {
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

  .scv-hero-title {
    font-size: 32px;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 6px;
    line-height: 1.15;
  }

  .scv-hero-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0 0 24px;
  }

  /* stat chips — identical to mc-stat */
  .scv-stats-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }

  .scv-stat-chip {
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

  .scv-stat-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .scv-stat-num {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 3px;
  }

  .scv-stat-lbl {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* progress */
  .scv-prog-wrap   { max-width: 420px; }
  .scv-prog-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .scv-prog-title  { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .scv-prog-pct    { font-size: 11px; font-weight: 700; color: var(--accent1); }
  .scv-prog-track  { width: 100%; height: 6px; border-radius: 99px; background: var(--border); margin-bottom: 8px; overflow: hidden; }
  .scv-prog-fill   { height: 100%; border-radius: 99px; background: var(--accent1); transition: width 0.5s ease; }
  .scv-prog-sub    { font-size: 10px; color: var(--text-muted); }

  .scv-done-banner {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--bg-badge-done); border: 1px solid var(--border-done-mod);
    border-radius: 9px; padding: 5px 13px; margin-top: 8px;
    font-size: 11.5px; font-weight: 700; color: var(--text-done);
  }

  /* hero illustration — matches mc-header-icon */
  .scv-hero-illus {
    width: 120px; height: 120px;
    border-radius: var(--radius);
    background: rgba(34,211,238,0.08);
    border: 1px solid rgba(34,211,238,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 48px; color: var(--accent1); flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  .scv-hero-illus:hover { transform: translateY(-2px) scale(1.04); }

  @media (max-width: 768px) {
    .scv-hero-illus { display: none; }
    .scv-hero-title { font-size: 24px; }
    .scv-hero { padding: 20px; }
    .scv-root { padding: 12px; }
  }

  /* ── BODY GRID ── */
  .scv-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    .scv-grid { grid-template-columns: 1fr; }
  }

  /* ── SIDE CARD — matches mc-card style ── */
  .scv-side-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 20px;
    position: sticky; top: 16px;
    max-height: calc(100vh - 40px); overflow-y: auto;
    transition: background 0.3s, border-color 0.3s;
  }

  .scv-side-hdr {
    display: flex; align-items: center; gap: 8px;
    padding-bottom: 14px; border-bottom: 1px solid var(--border); margin-bottom: 12px;
  }
  .scv-side-title { font-size: 14px; font-weight: 700; color: var(--text); }

  .scv-alert-box {
    background: var(--bg-alert); border: 1px solid var(--border-alert);
    border-radius: 10px; padding: 8px 12px;
    font-size: 10.5px; font-weight: 500; color: var(--text-alert); margin-bottom: 12px;
  }

  /* MODULE ITEMS */
  .scv-mod {
    border-radius: 12px; padding: 10px 12px; margin-bottom: 8px;
    transition: box-shadow 0.2s, border-color 0.2s, background 0.25s;
    border: 1px solid transparent;
  }
  .scv-mod-active   { background: var(--bg-active-hdr);  border-color: var(--border-active); cursor: pointer; }
  .scv-mod-done     { background: var(--bg-status-done); border-color: var(--border-done-mod); cursor: pointer; }
  .scv-mod-unlocked { background: var(--card); border-color: var(--border); cursor: pointer; }
  .scv-mod-unlocked:hover { border-color: var(--accent1); box-shadow: 0 2px 12px rgba(34,211,238,0.12); }
  .scv-mod-locked   { background: var(--bg-module-locked); border-color: var(--border); cursor: not-allowed; opacity: 0.45; }

  .scv-mod-row { display: flex; gap: 8px; align-items: flex-start; }

  .scv-idx {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
  }
  .scv-idx-done    { background: #22c55e; color: #fff; }
  .scv-idx-active  { background: var(--accent); color: #fff; }
  .scv-idx-unlocked{ background: var(--bg); color: var(--text-muted); border: 1px solid var(--border); }
  .scv-idx-locked  { background: var(--border); color: var(--text-muted); }

  .scv-mod-title        { font-size: 11.5px; font-weight: 600; line-height: 1.35; margin-bottom: 5px; color: var(--text); }
  .scv-mod-title-locked { color: var(--text-muted); }

  .scv-bdg-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
  .scv-bdg {
    font-size: 9px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
    display: inline-flex; align-items: center; gap: 3px;
  }
  .scv-bdg-video  { background: var(--bg-badge-video); color: var(--text-badge-video); }
  .scv-bdg-pdf    { background: var(--bg-badge-pdf);   color: var(--text-badge-pdf); }
  .scv-bdg-done   { background: var(--bg-badge-done);  color: var(--text-done); }
  .scv-bdg-locked { background: var(--bg-badge-locked);color: var(--text-muted); }
  .scv-watch-hint { font-size: 9px; color: var(--text-muted); font-style: italic; }

  .scv-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 7px 10px; border-radius: 8px; border: none;
    font-size: 10.5px; font-weight: 600; font-family: 'Poppins', sans-serif;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s;
  }
  .scv-btn-video-on  { background: var(--accent1); color: #0a0a0a; }
  .scv-btn-video-on:hover { opacity: 0.85; transform: translateY(-1px); }
  .scv-btn-video-off { background: var(--border); color: var(--text-muted); cursor: not-allowed; }
  .scv-btn-pdf-on    { background: var(--bg); border: 1px solid var(--border) !important; color: var(--text); }
  .scv-btn-pdf-on:hover  { border-color: var(--accent1) !important; transform: translateY(-1px); }
  .scv-btn-pdf-off   { background: var(--bg); border: 1px solid var(--border) !important; color: var(--text-muted); cursor: not-allowed; }

  /* ── PLAYER CARD ── */
  .scv-player-card {
    background: var(--card); border-radius: var(--radius);
    box-shadow: var(--shadow); padding: 20px;
    border: 1px solid var(--border);
    transition: background 0.3s, border-color 0.3s;
  }

  .scv-empty {
    height: 460px; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: var(--bg);
    border-radius: 14px; border: 2px dashed var(--border);
  }
  .scv-empty-icon  { color: var(--accent1); opacity: 0.6; margin-bottom: 12px; }
  .scv-empty-title { font-size: 15px; font-weight: 700; color: var(--text-muted); margin: 0 0 4px; }
  .scv-empty-sub   { font-size: 12px; color: var(--text-muted); margin: 0; }

  .scv-act-hdr {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 14px;
    display: flex; gap: 10px; align-items: flex-start; margin-bottom: 14px;
    transition: background 0.3s;
  }
  .scv-act-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--accent1);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .scv-act-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 5px; }
  .scv-act-bdg-row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }

  .scv-video-wrap {
    border-radius: 12px; overflow: hidden;
    border: 1px solid var(--border); margin-bottom: 12px;
    box-shadow: var(--shadow-player);
  }
  .scv-video       { width: 100%; aspect-ratio: 16/9; background: #000; display: block; }
  .scv-iframe-wrap { width: 100%; height: 460px; border-radius: 12px; border: 1px solid var(--border); display: block; }

  .scv-status-bar  { display: flex; align-items: center; justify-content: space-between; padding-top: 6px; flex-wrap: wrap; gap: 8px; }
  .scv-status-done {
    display: flex; align-items: center; gap: 6px; padding: 7px 14px;
    background: var(--bg-status-done); border: 1px solid var(--border-status-done);
    border-radius: 10px; font-size: 11.5px; font-weight: 600; color: var(--text-done);
  }
  .scv-status-watch {
    display: flex; align-items: center; gap: 6px; padding: 7px 14px;
    background: var(--bg-status-watch); border: 1px solid var(--border-status-watch);
    border-radius: 10px; font-size: 11.5px; font-weight: 500; color: var(--text-watch);
  }
  .scv-status-count { font-size: 10px; color: var(--text-muted); }

  .scv-celebration {
    display: flex; align-items: center; gap: 10px; padding: 14px; margin-top: 12px;
    background: var(--bg-celebration); border: 1px solid var(--border-celebration); border-radius: 12px;
  }
  .scv-celeb-title { font-size: 13px; font-weight: 700; color: var(--text-done); }
  .scv-celeb-sub   { font-size: 10.5px; color: var(--text-done); opacity: 0.8; }

  @keyframes scv-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  .scv-dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; animation: scv-pulse 1.5s infinite; flex-shrink: 0; }
`;

function injectCSS() {
  if (document.getElementById("scv-theme-v4")) return;
  const s = document.createElement("style");
  s.id = "scv-theme-v4";
  s.textContent = THEME_CSS;
  document.head.appendChild(s);
}

/* ── dark mode detection identical to MyCourses ── */
const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark" ||
  document.body.getAttribute("data-theme") === "dark" ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function useDarkMode() {
  const [dark, setDark] = useState(isDarkMode);
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDarkMode()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    obs.observe(document.body,            { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT  — all logic identical to original StudentCourseView
   ════════════════════════════════════════════════════════════════ */
export default function StudentCourseView() {
  const { id } = useParams();

  const [course,          setCourse         ] = useState(null);
  const [contents,        setContents       ] = useState([]);
  const [active,          setActive         ] = useState(null);
  const [mediaUrl,        setMediaUrl       ] = useState(null);
  const [mediaType,       setMediaType      ] = useState(null);
  const [completedIds,    setCompletedIds   ] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);

  const autoMarkedRef = useRef(new Set());
  const videoRef      = useRef(null);
  const studentEmail  = getEmailFromToken();
  const dark          = useDarkMode();

  useEffect(() => { injectCSS(); }, []);

  const calcPercent = (ids, valid) => {
    if (!valid?.length) return 0;
    return Math.min(Math.round((ids.length / valid.length) * 100), 100);
  };

  useEffect(() => {
    load();
    return () => { if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl); };
  }, []);

  const load = async () => {
    try {
      const [courseRes, contentRes] = await Promise.all([
        axios.get(`${API}/courses/${id}`,                 { headers: authHeader() }),
        axios.get(`${API}/content/student/course/${id}`, { headers: authHeader() }),
      ]);
      const valid = contentRes.data.filter((c) => c.url && c.url !== "undefined");
      setCourse(courseRes.data);
      setContents(valid);
      if (studentEmail) {
        try {
          const prog = await progressService.getProgress(studentEmail, Number(id));
          const ids  = prog.data.completedContentIds || [];
          setCompletedIds(ids);
          setProgressPercent(calcPercent(ids, valid));
        } catch { setCompletedIds([]); setProgressPercent(0); }
      }
    } catch (err) { console.error("Load failed", err); }
  };

  const markComplete = async (contentId, currentContents) => {
    if (!studentEmail) return;
    try {
      const res = await progressService.markContentComplete(
        studentEmail, Number(id), contentId, currentContents.length,
      );
      const updatedIds = res.data.completedContentIds || [];
      setCompletedIds(updatedIds);
      setProgressPercent(calcPercent(updatedIds, currentContents));
    } catch (err) { console.error("Progress update failed", err); }
  };

  const isUnlocked = (index) => {
    if (index === 0) return true;
    return completedIds.includes(contents[index - 1].id);
  };

  const playVideo = async (c, index) => {
    if (!isUnlocked(index)) return;
    if (!c?.url) { alert("Video missing"); return; }
    try {
      const res = await axios.get(
        `${API}/course-videos/stream/${encodeURIComponent(c.url.split("/").pop())}`,
        { responseType: "blob", headers: authHeader() },
      );
      setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "video/mp4" })));
      setMediaType("VIDEO");
      setActive(c);
    } catch (err) { console.error("Video load failed", err); }
  };

  const openPdf = async (c, index) => {
    if (!isUnlocked(index)) return;
    if (!c?.url) { alert("File missing"); return; }
    try {
      if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
      const res = await axios.get(
        `${API}/course-files/download/${encodeURIComponent(c.url.split("/").pop())}`,
        { responseType: "blob", headers: authHeader() },
      );
      setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
      setMediaType("PDF");
      setActive(c);
      if (!completedIds.includes(c.id)) markComplete(c.id, contents);
    } catch (err) { console.error("PDF load failed", err); }
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !active || mediaType !== "VIDEO") return;
    const onTime = () => {
      const { currentTime, duration } = el;
      if (!duration) return;
      if (
        (currentTime / duration) * 100 >= 80 &&
        !autoMarkedRef.current.has(active.id) &&
        !completedIds.includes(active.id)
      ) {
        autoMarkedRef.current.add(active.id);
        markComplete(active.id, contents);
      }
    };
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mediaType, completedIds]);

  /* ── derived values ── */
  const videoCount     = contents.filter((c) => c.contentType === "VIDEO").length;
  const pdfCount       = contents.filter((c) => c.contentType === "PDF").length;
  const isAllCompleted = contents.length > 0 && completedIds.length >= contents.length;

  /* stat chips — mirrors MyCourses Stat component colours */
  const statChips = [
    {
      icon: <BookOpen size={16} />,
      val: contents.length,
      lbl: "Total Modules",
      accent: "#22d3ee",
      bg: "rgba(34,211,238,0.10)",
    },
    {
      icon: <Video size={16} />,
      val: videoCount,
      lbl: "Videos",
      accent: "#fb923c",
      bg: "rgba(251,146,60,0.10)",
    },
    {
      icon: <FileText size={16} />,
      val: pdfCount,
      lbl: "Documents",
      accent: "#34d399",
      bg: "rgba(52,211,153,0.10)",
    },
  ];

  return (
    <div className={`scv-root${dark ? " dark-theme" : ""}`}>
      <div className="scv-inner">

        {/* ══ HERO CARD — same layout as mc-header ══ */}
        <div className="scv-hero">
          <div className="scv-hero-left">
            {/* badge */}
            <div className="scv-hero-badge">
              <GraduationCap size={11} />
              Learning Dashboard
            </div>

            <h1 className="scv-hero-title">{course?.title || "Loading…"}</h1>
            <p className="scv-hero-desc">
              {course?.description || "Continue your learning journey and track your progress"}
            </p>

            {/* stat chips */}
            <div className="scv-stats-row">
              {statChips.map((s, i) => (
                <div key={i} className="scv-stat-chip">
                  <div
                    className="scv-stat-icon-wrap"
                    style={{ background: s.bg, color: s.accent }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div className="scv-stat-num" style={{ color: s.accent }}>{s.val}</div>
                    <div className="scv-stat-lbl">{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* progress bar */}
            {contents.length > 0 && (
              <div className="scv-prog-wrap">
                <div className="scv-prog-header">
                  <span className="scv-prog-title">Your Progress</span>
                  <span className="scv-prog-pct">{progressPercent}%</span>
                </div>
                <div className="scv-prog-track">
                  <div className="scv-prog-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="scv-prog-sub">
                  {completedIds.length} of {contents.length} modules completed
                </p>
                {isAllCompleted && (
                  <div className="scv-done-banner">
                    <CheckCircle size={13} /> 🎉 Course Completed!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* illustration — matches mc-header-icon */}
          <div className="scv-hero-illus">
            <BookOpen size={48} strokeWidth={1.4} />
          </div>
        </div>

        {/* ══ BODY GRID ══ */}
        <div className="scv-grid">

          {/* LEFT — Modules */}
          <div>
            <div className="scv-side-card">
              <div className="scv-side-hdr">
                <BookOpen size={15} color="var(--accent1)" />
                <span className="scv-side-title">Course Modules</span>
              </div>

              <div className="scv-alert-box">
                📋 Complete each module in order to unlock the next one
              </div>

              {contents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "26px 0" }}>
                  <File
                    size={34}
                    style={{ color: "var(--text-muted)", margin: "0 auto 7px", display: "block" }}
                  />
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No content available</p>
                </div>
              ) : (
                contents.map((c, index) => {
                  const isDone   = completedIds.includes(c.id);
                  const isActive = active?.id === c.id;
                  const unlocked = isUnlocked(index);
                  const modCls   = `scv-mod ${
                    isActive   ? "scv-mod-active"   :
                    isDone     ? "scv-mod-done"      :
                    unlocked   ? "scv-mod-unlocked"  :
                                 "scv-mod-locked"
                  }`;
                  const idxCls   = `scv-idx ${
                    isDone     ? "scv-idx-done"     :
                    isActive   ? "scv-idx-active"   :
                    unlocked   ? "scv-idx-unlocked" :
                                 "scv-idx-locked"
                  }`;
                  const iconColor = isActive  ? "var(--accent1)"    :
                                   unlocked   ? "var(--text-muted)" :
                                                "var(--border)";

                  return (
                    <div key={c.id} className={modCls}>
                      <div className="scv-mod-row">
                        <div className={idxCls}>
                          {isDone    ? <CheckCircle size={12} /> :
                           !unlocked ? <Lock size={10} />        :
                                       index + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 4 }}>
                            {c.contentType === "VIDEO"
                              ? <Video    size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
                              : <FileText size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
                            }
                            <span className={`scv-mod-title${unlocked ? "" : " scv-mod-title-locked"}`}>
                              {c.title}
                            </span>
                          </div>

                          <div className="scv-bdg-row">
                            <span className={`scv-bdg ${c.contentType === "VIDEO" ? "scv-bdg-video" : "scv-bdg-pdf"}`}>
                              {c.contentType}
                            </span>
                            {isDone     && <span className="scv-bdg scv-bdg-done">✓ Done</span>}
                            {!unlocked  && <span className="scv-bdg scv-bdg-locked"><Lock size={7} /> Locked</span>}
                            {unlocked && !isDone && c.contentType === "VIDEO" && (
                              <span className="scv-watch-hint">Watch 80% to complete</span>
                            )}
                          </div>

                          {c.contentType === "VIDEO" && (
                            <button
                              className={`scv-btn ${unlocked ? "scv-btn-video-on" : "scv-btn-video-off"}`}
                              onClick={() => unlocked && playVideo(c, index)}
                              disabled={!unlocked}
                            >
                              <PlayCircle size={11} />
                              {isDone ? "Replay Video" : unlocked ? "Play Video" : "Locked"}
                            </button>
                          )}
                          {c.contentType === "PDF" && (
                            <button
                              className={`scv-btn ${unlocked ? "scv-btn-pdf-on" : "scv-btn-pdf-off"}`}
                              onClick={() => unlocked && openPdf(c, index)}
                              disabled={!unlocked}
                            >
                              <FileText size={11} />
                              {isDone ? "View Again" : unlocked ? "View Document" : "Locked"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT — Player */}
          <div>
            <div className="scv-player-card">
              {!mediaUrl ? (
                <div className="scv-empty">
                  <div className="scv-empty-icon">
                    <BookOpen size={48} strokeWidth={1.4} />
                  </div>
                  <p className="scv-empty-title">Ready to Learn?</p>
                  <p className="scv-empty-sub">Select a module from the left to begin</p>
                </div>
              ) : (
                <>
                  {active && (
                    <div className="scv-act-hdr">
                      <div className="scv-act-icon">
                        {mediaType === "VIDEO"
                          ? <Video    size={16} color="#0a0a0a" />
                          : <FileText size={16} color="#0a0a0a" />
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="scv-act-title">{active.title}</div>
                        <div className="scv-act-bdg-row">
                          <span className={`scv-bdg ${mediaType === "VIDEO" ? "scv-bdg-video" : "scv-bdg-pdf"}`}>
                            {mediaType}
                          </span>
                          {completedIds.includes(active.id) && (
                            <span className="scv-bdg scv-bdg-done">
                              <CheckCircle size={9} /> Completed
                            </span>
                          )}
                          {mediaType === "VIDEO" && !completedIds.includes(active.id) && (
                            <span style={{ fontSize: 10, color: "#d97706", fontStyle: "italic" }}>
                              ⏱ Watch 80% to auto-complete
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {mediaType === "VIDEO" && (
                    <div className="scv-video-wrap">
                      <video
                        ref={videoRef} src={mediaUrl} controls autoPlay
                        controlsList="nodownload" disablePictureInPicture className="scv-video"
                      />
                    </div>
                  )}
                  {mediaType === "PDF" && (
                    <iframe src={mediaUrl} className="scv-iframe-wrap" title="PDF Viewer" />
                  )}

                  {active && (
                    <div className="scv-status-bar">
                      {completedIds.includes(active.id) ? (
                        <div className="scv-status-done">
                          <CheckCircle size={13} /> Marked as Complete
                        </div>
                      ) : (
                        <div className="scv-status-watch">
                          <div className="scv-dot" />
                          {mediaType === "VIDEO" ? "Keep watching… (80% needed)" : "Loading…"}
                        </div>
                      )}
                      <span className="scv-status-count">
                        {completedIds.length} of {contents.length} completed
                      </span>
                    </div>
                  )}

                  {isAllCompleted && (
                    <div className="scv-celebration">
                      <CheckCircle size={22} style={{ color: "var(--text-done)", flexShrink: 0 }} />
                      <div>
                        <div className="scv-celeb-title">🎉 Course Completed!</div>
                        <div className="scv-celeb-sub">You have completed all modules in this course.</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}