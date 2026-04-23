
// import axios from "axios";
// import {
//   BookOpen,
//   CheckCircle,
//   File,
//   FileText,
//   GraduationCap,
//   PlayCircle,
//   Video,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { progressService } from "../services/progressService";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// // ✅ FIX — decode email from JWT instead of relying on lms_email key
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

//   // ✅ FIX — read email from JWT token, not localStorage key
//   const studentEmail = getEmailFromToken();

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
//           setCompletedIds(prog.data.completedContentIds || []);
//           setProgressPercent(prog.data.progressPercentage || 0);
//         } catch {
//           setCompletedIds([]);
//           setProgressPercent(0);
//         }
//       }
//     } catch (err) {
//       console.error("Load failed", err);
//     }
//   };

//   const markComplete = async (contentId, currentContents) => {
//     if (!studentEmail) return;
//     try {
//       const res = await progressService.markContentComplete(
//         studentEmail,
//         Number(id),
//         contentId,
//         currentContents.length,
//       );
//       setCompletedIds(res.data.completedContentIds || []);
//       setProgressPercent(res.data.progressPercentage || 0);
//     } catch (err) {
//       console.error("Progress update failed", err);
//     }
//   };

//   const playVideo = async (c) => {
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
//     } catch (err) {
//       console.error("Video load failed", err);
//     }
//   };

//   const openPdf = async (c) => {
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
//     } catch (err) {
//       console.error("PDF load failed", err);
//     }
//   };

//   const videoCount = contents.filter((c) => c.contentType === "VIDEO").length;
//   const pdfCount = contents.filter((c) => c.contentType === "PDF").length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//       {/* ── HERO BANNER ── */}
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
//                       {Math.round(progressPercent)}%
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
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── CONTENT AREA ── */}
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
//                     return (
//                       <div
//                         key={c.id}
//                         className={`group p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
//                           isActive
//                             ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border-indigo-500 dark:border-indigo-400 shadow-md"
//                             : isDone
//                               ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
//                               : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:shadow-sm"
//                         }`}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div
//                             className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
//                               isDone
//                                 ? "bg-green-500 text-white"
//                                 : isActive
//                                   ? "bg-indigo-500 text-white"
//                                   : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
//                             }`}
//                           >
//                             {isDone ? <CheckCircle size={16} /> : index + 1}
//                           </div>

//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-start gap-2 mb-2">
//                               {c.contentType === "VIDEO" ? (
//                                 <Video
//                                   className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
//                                 />
//                               ) : (
//                                 <FileText
//                                   className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
//                                 />
//                               )}
//                               <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
//                                 {c.title}
//                               </h3>
//                             </div>

//                             <div className="flex items-center gap-2 mb-3">
//                               <span
//                                 className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
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
//                             </div>

//                             {c.contentType === "VIDEO" && (
//                               <button
//                                 onClick={() => playVideo(c)}
//                                 className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
//                               >
//                                 <PlayCircle size={14} />
//                                 {isDone ? "Replay Video" : "Play Video"}
//                               </button>
//                             )}

//                             {c.contentType === "PDF" && (
//                               <button
//                                 onClick={() => openPdf(c)}
//                                 className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-300 transition-all"
//                               >
//                                 <FileText size={14} />
//                                 {isDone ? "View Again" : "View Document"}
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
//                           <div className="flex items-center gap-2">
//                             <span
//                               className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
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
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Media */}
//                   <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-700">
//                     {mediaType === "VIDEO" && (
//                       <video
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

//                   {/* Mark as Complete */}
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
//                         <button
//                           onClick={() => markComplete(active.id, contents)}
//                           className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
//                         >
//                           <CheckCircle size={16} />
//                           Mark as Complete
//                         </button>
//                       )}

//                       <span className="text-xs text-slate-400 dark:text-slate-500">
//                         {completedIds.length} of {contents.length} completed
//                       </span>
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
  BookOpen,
  CheckCircle,
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

export default function StudentCourseView() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [active, setActive] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);

  // ✅ Track which video IDs have been auto-marked this session (prevent duplicate API calls)
  const autoMarkedRef = useRef(new Set());
  // ✅ Ref to video element for timeupdate tracking
  const videoRef = useRef(null);

  const studentEmail = getEmailFromToken();

  // ✅ Recalculate percentage from real content count — fixes stale DB value
  const calcPercent = (ids, validContents) => {
    if (!validContents || validContents.length === 0) return 0;
    return Math.min(Math.round((ids.length / validContents.length) * 100), 100);
  };

  useEffect(() => {
    load();
    return () => {
      if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, []);

  const load = async () => {
    try {
      const [courseRes, contentRes] = await Promise.all([
        axios.get(`${API}/courses/${id}`, { headers: authHeader() }),
        axios.get(`${API}/content/student/course/${id}`, {
          headers: authHeader(),
        }),
      ]);

      const valid = contentRes.data.filter(
        (c) => c.url && c.url !== "undefined",
      );
      setCourse(courseRes.data);
      setContents(valid);

      if (studentEmail) {
        try {
          const prog = await progressService.getProgress(
            studentEmail,
            Number(id),
          );
          const ids = prog.data.completedContentIds || [];
          setCompletedIds(ids);
          setProgressPercent(calcPercent(ids, valid));
        } catch {
          setCompletedIds([]);
          setProgressPercent(0);
        }
      }
    } catch (err) {
      console.error("Load failed", err);
    }
  };

  // ✅ Core progress update — called automatically, never manually
  const markComplete = async (contentId, currentContents) => {
    if (!studentEmail) return;
    try {
      const res = await progressService.markContentComplete(
        studentEmail,
        Number(id),
        contentId,
        currentContents.length,
      );
      const updatedIds = res.data.completedContentIds || [];
      setCompletedIds(updatedIds);
      setProgressPercent(calcPercent(updatedIds, currentContents));
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  // ✅ Check if a content item is unlocked
  // Rule: index 0 always unlocked, others only if previous is completed
  const isUnlocked = (index) => {
    if (index === 0) return true;
    const prevContent = contents[index - 1];
    return completedIds.includes(prevContent.id);
  };

  // ✅ Play video — only if unlocked
  const playVideo = async (c, index) => {
    if (!isUnlocked(index)) return; // locked — do nothing
    if (!c?.url) {
      alert("Video missing");
      return;
    }
    try {
      const cleanFileName = c.url.split("/").pop();
      const res = await axios.get(
        `${API}/course-videos/stream/${encodeURIComponent(cleanFileName)}`,
        { responseType: "blob", headers: authHeader() },
      );
      const blobUrl = URL.createObjectURL(
        new Blob([res.data], { type: "video/mp4" }),
      );
      setMediaUrl(blobUrl);
      setMediaType("VIDEO");
      setActive(c);
      // ✅ DO NOT mark complete here for videos — wait for 80% watch
    } catch (err) {
      console.error("Video load failed", err);
    }
  };

  // ✅ Open PDF — auto-mark complete immediately on open
  const openPdf = async (c, index) => {
    if (!isUnlocked(index)) return; // locked — do nothing
    if (!c?.url) {
      alert("File missing");
      return;
    }
    try {
      const cleanFileName = c.url.split("/").pop();
      if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);

      const res = await axios.get(
        `${API}/course-files/download/${encodeURIComponent(cleanFileName)}`,
        { responseType: "blob", headers: authHeader() },
      );
      const blobUrl = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      setMediaUrl(blobUrl);
      setMediaType("PDF");
      setActive(c);

      // ✅ PDF: mark complete immediately when opened
      if (!completedIds.includes(c.id)) {
        markComplete(c.id, contents);
      }
    } catch (err) {
      console.error("PDF load failed", err);
    }
  };

  // ✅ Auto-mark video watched at 80% — same pattern as VideoLectures.jsx
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !active || mediaType !== "VIDEO") return;

    const handleTimeUpdate = () => {
      const { currentTime, duration } = videoEl;
      if (!duration || duration === 0) return;
      const watchedPercent = (currentTime / duration) * 100;

      if (watchedPercent >= 80) {
        // ✅ Only fire once per video per session
        if (
          !autoMarkedRef.current.has(active.id) &&
          !completedIds.includes(active.id)
        ) {
          autoMarkedRef.current.add(active.id);
          markComplete(active.id, contents);
        }
      }
    };

    videoEl.addEventListener("timeupdate", handleTimeUpdate);
    return () => videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mediaType, completedIds]);

  const videoCount = contents.filter((c) => c.contentType === "VIDEO").length;
  const pdfCount = contents.filter((c) => c.contentType === "PDF").length;
  const isAllCompleted =
    contents.length > 0 && completedIds.length >= contents.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative px-6 py-12 md:py-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <GraduationCap className="h-4 w-4 text-blue-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Course Content
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                {course?.title || "Loading..."}
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-3xl">
                {course?.description || "Course description will appear here"}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <BookOpen className="h-5 w-5 text-white/80" />
                  <div>
                    <p className="text-xl font-bold text-white">
                      {contents.length}
                    </p>
                    <p className="text-xs text-white/70">Total Modules</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Video className="h-5 w-5 text-white/80" />
                  <div>
                    <p className="text-xl font-bold text-white">{videoCount}</p>
                    <p className="text-xs text-white/70">Videos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FileText className="h-5 w-5 text-white/80" />
                  <div>
                    <p className="text-xl font-bold text-white">{pdfCount}</p>
                    <p className="text-xs text-white/70">Documents</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {contents.length > 0 && (
                <div className="max-w-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/80 font-medium">
                      Your Progress
                    </span>
                    <span className="text-sm font-bold text-white">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-white rounded-full h-3 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    {completedIds.length} of {contents.length} completed
                  </p>

                  {/* ✅ Course Completed banner in hero */}
                  {isAllCompleted && (
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-400/30 border border-green-300/50 backdrop-blur-sm">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <span className="text-sm font-bold text-white">
                        🎉 Course Completed!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — Content List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-5 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Course Modules
                </h2>
              </div>

              {/* ✅ Sequential rule hint */}
              <div className="mb-4 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  📋 Complete each module in order to unlock the next one
                </p>
              </div>

              <div className="space-y-3">
                {contents.length === 0 ? (
                  <div className="text-center py-8">
                    <File className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No content available
                    </p>
                  </div>
                ) : (
                  contents.map((c, index) => {
                    const isDone = completedIds.includes(c.id);
                    const isActive = active?.id === c.id;
                    const unlocked = isUnlocked(index);

                    return (
                      <div
                        key={c.id}
                        className={`group p-4 rounded-xl border-2 transition-all duration-200
                          ${
                            isActive
                              ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border-indigo-500 dark:border-indigo-400 shadow-md"
                              : isDone
                                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                                : unlocked
                                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:shadow-sm cursor-pointer"
                                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Index / Status icon */}
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                              ${
                                isDone
                                  ? "bg-green-500 text-white"
                                  : isActive
                                    ? "bg-indigo-500 text-white"
                                    : unlocked
                                      ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                      : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                              }`}
                          >
                            {isDone ? (
                              <CheckCircle size={16} />
                            ) : !unlocked ? (
                              <Lock size={14} />
                            ) : (
                              index + 1
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              {c.contentType === "VIDEO" ? (
                                <Video
                                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-indigo-600" : unlocked ? "text-slate-400" : "text-slate-300"}`}
                                />
                              ) : (
                                <FileText
                                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-indigo-600" : unlocked ? "text-slate-400" : "text-slate-300"}`}
                                />
                              )}
                              <h3
                                className={`text-sm font-semibold line-clamp-2
                                ${
                                  unlocked
                                    ? "text-slate-900 dark:text-slate-100"
                                    : "text-slate-400 dark:text-slate-500"
                                }`}
                              >
                                {c.title}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                                ${
                                  c.contentType === "VIDEO"
                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                }`}
                              >
                                {c.contentType}
                              </span>
                              {isDone && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  ✓ Done
                                </span>
                              )}
                              {!unlocked && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500">
                                  <Lock size={10} /> Locked
                                </span>
                              )}
                              {/* ✅ Hint for videos not yet done */}
                              {unlocked &&
                                !isDone &&
                                c.contentType === "VIDEO" && (
                                  <span className="text-[10px] text-slate-400 italic">
                                    Watch 80% to complete
                                  </span>
                                )}
                            </div>

                            {/* Action buttons — only shown if unlocked */}
                            {c.contentType === "VIDEO" && (
                              <button
                                onClick={() => unlocked && playVideo(c, index)}
                                disabled={!unlocked}
                                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all
                                  ${
                                    unlocked
                                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg cursor-pointer"
                                      : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                                  }`}
                              >
                                <PlayCircle size={14} />
                                {isDone
                                  ? "Replay Video"
                                  : unlocked
                                    ? "Play Video"
                                    : "Locked"}
                              </button>
                            )}

                            {c.contentType === "PDF" && (
                              <button
                                onClick={() => unlocked && openPdf(c, index)}
                                disabled={!unlocked}
                                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all
                                  ${
                                    unlocked
                                      ? "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-300 cursor-pointer"
                                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 border-2 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                                  }`}
                              >
                                <FileText size={14} />
                                {isDone
                                  ? "View Again"
                                  : unlocked
                                    ? "View Document"
                                    : "Locked"}
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
          </div>

          {/* RIGHT — Media Player */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6">
              {!mediaUrl ? (
                <div className="h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                    <BookOpen
                      className="relative w-20 h-20 mb-4 text-indigo-500 dark:text-indigo-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Ready to Learn?
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Select a module from the left to begin
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Active content header */}
                  {active && (
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500 text-white">
                          {mediaType === "VIDEO" ? (
                            <Video className="h-5 w-5" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {active.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                              ${
                                mediaType === "VIDEO"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {mediaType}
                            </span>
                            {completedIds.includes(active.id) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
                                <CheckCircle size={12} /> Completed
                              </span>
                            )}
                            {/* ✅ Hint for video in progress */}
                            {mediaType === "VIDEO" &&
                              !completedIds.includes(active.id) && (
                                <span className="text-xs text-amber-600 dark:text-amber-400 italic">
                                  ⏱ Watch 80% to auto-complete
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media player */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-700">
                    {mediaType === "VIDEO" && (
                      // ✅ videoRef attached for 80% auto-complete tracking
                      <video
                        ref={videoRef}
                        src={mediaUrl}
                        controls
                        autoPlay
                        controlsList="nodownload"
                        disablePictureInPicture
                        className="w-full aspect-video bg-black"
                      />
                    )}
                    {mediaType === "PDF" && (
                      <iframe
                        src={mediaUrl}
                        className="w-full h-[600px]"
                        title="PDF Viewer"
                      />
                    )}
                  </div>

                  {/* ✅ Status bar — no button, just auto status */}
                  {active && (
                    <div className="flex items-center justify-between pt-2">
                      {completedIds.includes(active.id) ? (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            Marked as Complete
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-sm text-amber-700 dark:text-amber-400">
                            {mediaType === "VIDEO"
                              ? "Keep watching... (80% needed)"
                              : "Loading..."}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {completedIds.length} of {contents.length} completed
                      </span>
                    </div>
                  )}

                  {/* ✅ Course completed celebration */}
                  {isAllCompleted && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700">
                      <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-base font-bold text-green-800 dark:text-green-300">
                          🎉 Course Completed!
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          You have completed all modules in this course.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
