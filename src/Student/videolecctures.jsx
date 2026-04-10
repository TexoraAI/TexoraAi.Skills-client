// import React, { useEffect, useRef, useState } from "react";
// import videoService from "../services/videoService";
// import {
//   BookOpen, ChevronLeft, ChevronRight, Clock,
//   Film, HardDrive, Maximize2, Minimize2,
//   Play, PlayCircle, Video,
// } from "lucide-react";

// /* ── gradient pool for thumbnails ── */
// const GRADS = [
//   "from-violet-600 to-indigo-700","from-cyan-500 to-blue-600",
//   "from-rose-500 to-pink-600","from-amber-500 to-orange-600",
//   "from-emerald-500 to-teal-600","from-indigo-500 to-blue-700",
// ];
// const grad = (s) => GRADS[(s?.charCodeAt(0) ?? 0) % GRADS.length];

// /* ════════════ MAIN ════════════ */
// const VideoLectures = () => {
//   /* ── backend state — ALL UNCHANGED ── */
//   const [videos, setVideos]         = useState([]);
//   const [videoUrls, setVideoUrls]   = useState({});
//   const [playingId, setPlayingId]   = useState(null);

//   /* ── UI state ── */
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [sidebarW, setSidebarW]       = useState(280);
//   const dragging = useRef(false);
//   const startX   = useRef(0);
//   const startW   = useRef(280);

//   /* ── load videos (unchanged) ── */
//   useEffect(() => {
//     videoService
//       .getStudentVideos()
//       .then((res) => setVideos(res.data || []))
//       .catch(console.error);
//   }, []);

//   /* ── play video (unchanged) ── */
//   const playVideo = async (video) => {
//     if (!videoUrls[video.id]) {
//       try {
//         const res    = await videoService.getVideoBlob(video.storedFileName);
//         const blobUrl = URL.createObjectURL(res.data);
//         setVideoUrls((prev) => ({ ...prev, [video.id]: blobUrl }));
//       } catch {
//         alert("Unable to play video");
//         return;
//       }
//     }
//     setPlayingId(video.id);
//   };

//   const selectedVideo = videos.find((v) => v.id === playingId);
//   const totalSizeMB   = Math.round(
//     videos.reduce((acc, v) => acc + (v.size || 0), 0) / 1024 / 1024,
//   );

//   /* ── sidebar resize (CRM style) ── */
//   const onResizeStart = (e) => {
//     dragging.current = true;
//     startX.current   = e.clientX;
//     startW.current   = sidebarW;
//     document.body.style.cursor     = "col-resize";
//     document.body.style.userSelect = "none";
//   };
//   useEffect(() => {
//     const onMove = (e) => {
//       if (!dragging.current) return;
//       const delta = e.clientX - startX.current;
//       setSidebarW(Math.min(420, Math.max(200, startW.current + delta)));
//     };
//     const onUp = () => {
//       dragging.current = false;
//       document.body.style.cursor     = "";
//       document.body.style.userSelect = "";
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup",   onUp);
//     return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//   }, []);

//   /* ════════════ RENDER ════════════ */
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] flex flex-col">

//       {/* ═══ HERO ═══ */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4] mx-5 mt-5 rounded-2xl shadow-xl flex-shrink-0">
//         <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//         <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

//         <div className="relative flex items-center justify-between px-6 py-5">
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
//               <Film className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">Video Lectures</h1>
//               <div className="flex items-center gap-3 mt-1 text-sm text-blue-100/80">
//                 <span className="flex items-center gap-1.5">
//                   <Video className="h-3.5 w-3.5" />
//                   {videos.length} {videos.length === 1 ? "video" : "videos"}
//                 </span>
//                 <span className="h-1 w-1 rounded-full bg-white/40" />
//                 <span className="flex items-center gap-1.5">
//                   <HardDrive className="h-3.5 w-3.5" />
//                   {totalSizeMB} MB total
//                 </span>
//                 <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
//                   HD quality
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="hidden sm:flex items-center gap-3">
//             <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm text-sm text-white font-semibold">
//               {playingId ? videos.findIndex(v => v.id === playingId) + 1 : 0} / {Math.max(videos.length, 1)} completed
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ═══ MAIN CONTENT ═══ */}
//       <div className="flex flex-1 gap-0 px-5 pb-5 pt-4 overflow-hidden min-h-0">

//         {/* ── SIDEBAR ── */}
//         <div
//           className={`flex-shrink-0 flex transition-all duration-300 ease-in-out`}
//           style={{ width: sidebarOpen ? sidebarW : 0 }}
//         >
//           {sidebarOpen && (
//             <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden min-w-0">

//               {/* sidebar header */}
//               <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex-shrink-0">
//                 <div>
//                   <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
//                     <BookOpen className="h-4 w-4 text-blue-500" />
//                     Lecture Library
//                   </h3>
//                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
//                     {videos.length} lecture{videos.length !== 1 && "s"}
//                   </p>
//                 </div>
//               </div>

//               {/* lecture list */}
//               <div className="flex-1 overflow-y-auto">
//                 {videos.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-12 gap-3">
//                     <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                       <Video className="h-6 w-6 text-slate-400" />
//                     </div>
//                     <p className="text-sm text-slate-500 text-center px-4">No videos available yet</p>
//                   </div>
//                 ) : (
//                   <ul className="divide-y divide-slate-100 dark:divide-slate-800">
//                     {videos.map((v, index) => {
//                       const active  = playingId === v.id;
//                       const sizeMb  = Math.round((v.size || 0) / 1024 / 1024);
//                       const title   = v.title || v.originalFileName || "Untitled";

//                       return (
//                         <li key={v.id}>
//                           <button
//                             onClick={() => playVideo(v)}
//                             className={`w-full flex gap-3 px-4 py-3.5 text-left border-l-2 transition-all group
//                               ${active
//                                 ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500"
//                                 : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                               }`}
//                           >
//                             {/* thumbnail */}
//                             <div className={`h-10 w-14 rounded-lg bg-gradient-to-br ${grad(title)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
//                               {active
//                                 ? <div className="flex gap-0.5 items-end h-4"><div className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{height:"12px"}}/><div className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_0.1s_infinite]" style={{height:"16px"}}/><div className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_0.2s_infinite]" style={{height:"10px"}}/></div>
//                                 : <Play className="h-4 w-4 text-white/90" />
//                               }
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <p className={`truncate text-sm font-medium leading-tight ${active ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-slate-200 group-hover:text-blue-600"}`}>
//                                 {index + 1}. {title}
//                               </p>
//                               <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
//                                 <Clock className="h-3 w-3" />
//                                 <span>{sizeMb} MB</span>
//                                 {active && <span className="text-blue-500 font-semibold">● Playing</span>}
//                               </div>
//                             </div>
//                           </button>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── RESIZE HANDLE ── */}
//         {sidebarOpen && (
//           <div
//             onMouseDown={onResizeStart}
//             className="flex-shrink-0 w-2 mx-1 self-stretch flex items-center justify-center cursor-col-resize group"
//             title="Drag to resize"
//           >
//             <div className="w-1 h-16 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors" />
//           </div>
//         )}

//         {/* ── VIDEO PLAYER ── */}
//         <div className="flex-1 flex flex-col gap-3 min-w-0">

//           {/* collapse/expand toggle */}
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <button
//               onClick={() => setSidebarOpen(o => !o)}
//               className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-all shadow-sm"
//             >
//               {sidebarOpen
//                 ? <><ChevronLeft className="h-3.5 w-3.5"/> Hide Library</>
//                 : <><ChevronRight className="h-3.5 w-3.5"/> Show Library</>
//               }
//             </button>
//             {selectedVideo && (
//               <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
//                 Now playing: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedVideo.title || selectedVideo.originalFileName}</span>
//               </p>
//             )}
//           </div>

//           {/* player card */}
//           <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden flex flex-col">

//             {playingId && videoUrls[playingId] ? (
//               <>
//                 {/* video */}
//                 <div className="relative bg-black flex-shrink-0">
//                   <video
//                     className="w-full aspect-video"
//                     controls
//                     autoPlay
//                     controlsList="nodownload"
//                     disablePictureInPicture
//                     src={videoUrls[playingId]}
//                   />
//                 </div>

//                 {/* video info bar */}
//                 <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
//                   <div className="flex items-center gap-3">
//                     <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(selectedVideo?.title || "")} flex items-center justify-center flex-shrink-0`}>
//                       <Film className="h-4 w-4 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-tight">
//                         {selectedVideo?.title || selectedVideo?.originalFileName}
//                       </h2>
//                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
//                         {Math.round((selectedVideo?.size || 0) / 1024 / 1024)} MB
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
//                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                       Playing
//                     </span>
//                   </div>
//                 </div>

//                 {/* next lecture */}
//                 {videos.findIndex(v => v.id === playingId) < videos.length - 1 && (
//                   <div className="px-6 pb-4 flex-shrink-0">
//                     <button
//                       onClick={() => {
//                         const idx = videos.findIndex(v => v.id === playingId);
//                         if (idx < videos.length - 1) playVideo(videos[idx + 1]);
//                       }}
//                       className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 transition-all w-full"
//                     >
//                       <PlayCircle className="h-4 w-4 flex-shrink-0" />
//                       <span className="truncate">
//                         Next: {videos[videos.findIndex(v => v.id === playingId) + 1]?.title || videos[videos.findIndex(v => v.id === playingId) + 1]?.originalFileName}
//                       </span>
//                       <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               /* empty state */
//               <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
//                 <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-950">
//                   <PlayCircle className="h-10 w-10 text-white" />
//                 </div>
//                 <div className="text-center">
//                   <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Select a lecture to play</h3>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//                     Choose a video from the {sidebarOpen ? "library on the left" : "lecture library"}
//                   </p>
//                 </div>
//                 {!sidebarOpen && (
//                   <button
//                     onClick={() => setSidebarOpen(true)}
//                     className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all"
//                   >
//                     <BookOpen className="h-4 w-4" /> Open Lecture Library
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoLectures;old ui















// import React, { useEffect, useRef, useState } from "react";
// import videoService from "../services/videoService";
// import {
//   BookOpen, ChevronLeft, ChevronRight, Clock,
//   Film, HardDrive, Play, PlayCircle, Video,
// } from "lucide-react";

// const GRADS = [
//   "linear-gradient(135deg,#6d28d9,#4338ca)",
//   "linear-gradient(135deg,#0891b2,#0e7490)",
//   "linear-gradient(135deg,#be123c,#9f1239)",
//   "linear-gradient(135deg,#b45309,#92400e)",
//   "linear-gradient(135deg,#047857,#065f46)",
//   "linear-gradient(135deg,#1d4ed8,#1e40af)",
// ];
// const grad = (s) => GRADS[(s?.charCodeAt(0) ?? 0) % GRADS.length];

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --vl-bg:        #f1f5f9;
//     --vl-card:      #ffffff;
//     --vl-text:      #0f172a;
//     --vl-muted:     #64748b;
//     --vl-border:    #e2e8f0;
//     --vl-accent1:   #22d3ee;
//     --vl-accent2:   #fb923c;
//     --vl-accent3:   #34d399;
//     --vl-accent4:   #a78bfa;
//     --vl-shadow:    0 4px 24px rgba(0,0,0,0.06);
//     --vl-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//     --vl-radius:    20px;
//   }

//   .vl-dark {
//     --vl-bg:        #0a0a0a;
//     --vl-card:      #111111;
//     --vl-text:      #ffffff;
//     --vl-muted:     #94a3b8;
//     --vl-border:    rgba(255,255,255,0.06);
//     --vl-shadow:    0 4px 24px rgba(0,0,0,0.40);
//     --vl-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
//   }

//   .vl-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--vl-bg);
//     color: var(--vl-text);
//     padding: 24px;
//     box-sizing: border-box;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//     transition: background 0.3s;
//   }

//   .vl-inner {
//     max-width: 1300px;
//     margin: 0 auto;
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//     flex: 1;
//   }

//   /* ── Header card ── */
//   .vl-header {
//     background: var(--vl-card);
//     border: 1px solid var(--vl-border);
//     border-radius: var(--vl-radius);
//     padding: 28px 32px;
//     box-shadow: var(--vl-shadow);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 20px;
//     flex-wrap: wrap;
//   }

//   .vl-header-left { display: flex; align-items: center; gap: 16px; }

//   .vl-header-icon-box {
//     width: 52px; height: 52px;
//     border-radius: 14px;
//     background: rgba(34,211,238,0.10);
//     border: 1px solid rgba(34,211,238,0.18);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--vl-accent1);
//     flex-shrink: 0;
//   }

//   .vl-badge {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 4px 11px; border-radius: 50px;
//     border: 1px solid var(--vl-border);
//     background: rgba(34,211,238,0.08);
//     color: var(--vl-accent1);
//     font-size: 10px; font-weight: 700;
//     letter-spacing: 0.08em; text-transform: uppercase;
//     margin-bottom: 6px;
//   }

//   .vl-h1 {
//     font-size: 24px; font-weight: 800;
//     color: var(--vl-text); margin: 0 0 2px;
//   }

//   .vl-meta {
//     display: flex; align-items: center; gap: 14px;
//     flex-wrap: wrap;
//   }

//   .vl-meta-item {
//     display: flex; align-items: center; gap: 5px;
//     font-size: 12px; font-weight: 500; color: var(--vl-muted);
//   }

//   .vl-tag {
//     padding: 4px 10px; border-radius: 8px;
//     background: rgba(52,211,153,0.10);
//     border: 1px solid rgba(52,211,153,0.18);
//     color: var(--vl-accent3);
//     font-size: 11px; font-weight: 700;
//   }

//   .vl-progress-chip {
//     padding: 8px 18px; border-radius: 12px;
//     background: var(--vl-bg);
//     border: 1px solid var(--vl-border);
//     font-size: 13px; font-weight: 700;
//     color: var(--vl-accent1);
//     white-space: nowrap;
//   }

//   /* ── Body row ── */
//   .vl-body {
//     display: flex;
//     gap: 16px;
//     flex: 1;
//     min-height: 0;
//     align-items: stretch;
//   }

//   /* ── Sidebar ── */
//   .vl-sidebar {
//     flex-shrink: 0;
//     display: flex;
//     transition: width 0.3s ease;
//     overflow: hidden;
//   }

//   .vl-sidebar-inner {
//     display: flex;
//     flex-direction: column;
//     background: var(--vl-card);
//     border: 1px solid var(--vl-border);
//     border-radius: var(--vl-radius);
//     box-shadow: var(--vl-shadow);
//     overflow: hidden;
//     width: 100%;
//   }

//   .vl-sidebar-head {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 18px 20px;
//     border-bottom: 1px solid var(--vl-border);
//     flex-shrink: 0;
//   }

//   .vl-sidebar-title {
//     display: flex; align-items: center; gap: 8px;
//     font-size: 13px; font-weight: 700; color: var(--vl-text); margin: 0;
//   }

//   .vl-sidebar-count {
//     font-size: 11px; color: var(--vl-muted); margin-top: 2px;
//   }

//   .vl-sidebar-list {
//     flex: 1; overflow-y: auto;
//     padding: 8px 0;
//   }

//   .vl-sidebar-list::-webkit-scrollbar { width: 4px; }
//   .vl-sidebar-list::-webkit-scrollbar-track { background: transparent; }
//   .vl-sidebar-list::-webkit-scrollbar-thumb { background: var(--vl-border); border-radius: 4px; }

//   .vl-list-item {
//     display: flex; align-items: center; gap: 12px;
//     padding: 12px 16px;
//     border-left: 3px solid transparent;
//     cursor: pointer;
//     transition: background 0.15s, border-color 0.15s;
//     background: transparent;
//     border-top: none; border-right: none; border-bottom: none;
//     width: 100%; text-align: left;
//   }

//   .vl-list-item:hover { background: rgba(34,211,238,0.04); }

//   .vl-list-item.active {
//     background: rgba(34,211,238,0.07);
//     border-left-color: var(--vl-accent1);
//   }

//   .vl-list-thumb {
//     width: 44px; height: 32px;
//     border-radius: 8px;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }

//   .vl-list-bars {
//     display: flex; gap: 2px; align-items: flex-end; height: 14px;
//   }

//   .vl-bar {
//     width: 3px; border-radius: 2px; background: white;
//   }

//   .vl-list-info { flex: 1; min-width: 0; }

//   .vl-list-title {
//     font-size: 12px; font-weight: 600;
//     color: var(--vl-text); white-space: nowrap;
//     overflow: hidden; text-overflow: ellipsis; margin: 0 0 3px;
//   }

//   .vl-list-item.active .vl-list-title { color: var(--vl-accent1); }

//   .vl-list-sub {
//     display: flex; align-items: center; gap: 4px;
//     font-size: 11px; color: var(--vl-muted);
//   }

//   .vl-playing-dot {
//     font-size: 10px; font-weight: 700; color: var(--vl-accent3);
//   }

//   .vl-sidebar-empty {
//     display: flex; flex-direction: column; align-items: center;
//     justify-content: center; padding: 40px 20px; gap: 10px;
//     color: var(--vl-muted); font-size: 13px; text-align: center;
//   }

//   .vl-empty-icon-box {
//     width: 48px; height: 48px; border-radius: 14px;
//     background: var(--vl-bg); border: 1px solid var(--vl-border);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--vl-muted);
//   }

//   /* ── Resize handle ── */
//   .vl-resize {
//     width: 14px; flex-shrink: 0; display: flex;
//     align-items: center; justify-content: center;
//     cursor: col-resize;
//   }

//   .vl-resize-bar {
//     width: 3px; height: 48px; border-radius: 4px;
//     background: var(--vl-border);
//     transition: background 0.2s;
//   }

//   .vl-resize:hover .vl-resize-bar { background: var(--vl-accent1); }

//   /* ── Player ── */
//   .vl-player {
//     flex: 1; display: flex; flex-direction: column;
//     gap: 12px; min-width: 0;
//   }

//   .vl-toggle-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 8px 14px; border-radius: 12px;
//     border: 1px solid var(--vl-border);
//     background: var(--vl-card);
//     color: var(--vl-muted);
//     font-family: 'Poppins', sans-serif;
//     font-size: 12px; font-weight: 600;
//     cursor: pointer;
//     box-shadow: var(--vl-shadow);
//     transition: color 0.2s, border-color 0.2s, background 0.2s;
//   }

//   .vl-toggle-btn:hover {
//     color: var(--vl-accent1);
//     border-color: rgba(34,211,238,0.3);
//     background: rgba(34,211,238,0.04);
//   }

//   .vl-now-playing {
//     font-size: 12px; color: var(--vl-muted);
//   }

//   .vl-now-playing strong { color: var(--vl-text); font-weight: 600; }

//   .vl-player-card {
//     flex: 1;
//     background: var(--vl-card);
//     border: 1px solid var(--vl-border);
//     border-radius: var(--vl-radius);
//     box-shadow: var(--vl-shadow);
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//   }

//   video { display: block; width: 100%; }

//   /* info bar below video */
//   .vl-info-bar {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 16px 24px;
//     border-top: 1px solid var(--vl-border);
//     flex-shrink: 0;
//   }

//   .vl-info-left { display: flex; align-items: center; gap: 12px; }

//   .vl-info-thumb {
//     width: 38px; height: 38px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }

//   .vl-info-title {
//     font-size: 14px; font-weight: 700; color: var(--vl-text); margin: 0 0 2px;
//   }

//   .vl-info-size { font-size: 11px; color: var(--vl-muted); }

//   .vl-playing-badge {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 5px 12px; border-radius: 50px;
//     background: rgba(52,211,153,0.10);
//     border: 1px solid rgba(52,211,153,0.20);
//     color: var(--vl-accent3);
//     font-size: 11px; font-weight: 700;
//   }

//   .vl-pulse {
//     width: 6px; height: 6px; border-radius: 50%;
//     background: var(--vl-accent3);
//     animation: vl-pulse 1.5s ease-in-out infinite;
//   }

//   @keyframes vl-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

//   /* next btn */
//   .vl-next-btn {
//     display: flex; align-items: center; gap: 10px;
//     margin: 0 24px 16px;
//     padding: 12px 16px; border-radius: 14px;
//     border: 1px solid var(--vl-border);
//     background: var(--vl-bg);
//     color: var(--vl-muted);
//     font-family: 'Poppins', sans-serif;
//     font-size: 12px; font-weight: 600;
//     cursor: pointer;
//     transition: border-color 0.2s, color 0.2s, background 0.2s;
//     text-align: left;
//   }

//   .vl-next-btn:hover {
//     border-color: rgba(34,211,238,0.30);
//     color: var(--vl-accent1);
//     background: rgba(34,211,238,0.04);
//   }

//   .vl-next-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

//   /* empty state */
//   .vl-empty-state {
//     flex: 1; display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     gap: 16px; padding: 40px;
//   }

//   .vl-empty-big-icon {
//     width: 80px; height: 80px; border-radius: 24px;
//     background: rgba(34,211,238,0.10);
//     border: 1px solid rgba(34,211,238,0.18);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--vl-accent1);
//   }

//   .vl-empty-title {
//     font-size: 16px; font-weight: 700; color: var(--vl-text); margin: 0 0 4px;
//   }

//   .vl-empty-sub {
//     font-size: 13px; color: var(--vl-muted); margin: 0;
//   }

//   .vl-open-btn {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 12px 24px; border-radius: 14px; border: none;
//     background: var(--vl-accent1); color: #0a0a0a;
//     font-family: 'Poppins', sans-serif;
//     font-size: 13px; font-weight: 700;
//     cursor: pointer;
//     transition: opacity 0.2s, transform 0.2s;
//   }

//   .vl-open-btn:hover { opacity: 0.87; transform: translateY(-1px); }
// `;

// if (!document.getElementById("vl-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "vl-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ════════════ MAIN ════════════ */
// const VideoLectures = () => {
//   const [videos, setVideos]       = useState([]);
//   const [videoUrls, setVideoUrls] = useState({});
//   const [playingId, setPlayingId] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [sidebarW, setSidebarW]   = useState(280);
//   const [dark, setDark]           = useState(isDark);
//   const dragging = useRef(false);
//   const startX   = useRef(0);
//   const startW   = useRef(280);

//   useEffect(() => {
//     videoService.getStudentVideos()
//       .then((res) => setVideos(res.data || []))
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDark()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   const playVideo = async (video) => {
//     if (!videoUrls[video.id]) {
//       try {
//         const res = await videoService.getVideoBlob(video.storedFileName);
//         const blobUrl = URL.createObjectURL(res.data);
//         setVideoUrls((prev) => ({ ...prev, [video.id]: blobUrl }));
//       } catch {
//         alert("Unable to play video");
//         return;
//       }
//     }
//     setPlayingId(video.id);
//   };

//   const selectedVideo = videos.find((v) => v.id === playingId);
//   const totalSizeMB   = Math.round(videos.reduce((acc, v) => acc + (v.size || 0), 0) / 1024 / 1024);

//   const onResizeStart = (e) => {
//     dragging.current = true;
//     startX.current   = e.clientX;
//     startW.current   = sidebarW;
//     document.body.style.cursor     = "col-resize";
//     document.body.style.userSelect = "none";
//   };

//   useEffect(() => {
//     const onMove = (e) => {
//       if (!dragging.current) return;
//       setSidebarW(Math.min(420, Math.max(200, startW.current + (e.clientX - startX.current))));
//     };
//     const onUp = () => {
//       dragging.current = false;
//       document.body.style.cursor     = "";
//       document.body.style.userSelect = "";
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//     return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//   }, []);

//   return (
//     <div className={`vl-root${dark ? " vl-dark" : ""}`}>
//       <div className="vl-inner">

//         {/* ── Header ── */}
//         <div className="vl-header">
//           <div className="vl-header-left">
//             <div className="vl-header-icon-box">
//               <Film size={24} />
//             </div>
//             <div>
//               <div className="vl-badge"><Film size={10} /> Video Lectures</div>
//               <h1 className="vl-h1">Video Lectures</h1>
//               <div className="vl-meta">
//                 <span className="vl-meta-item"><Video size={13} /> {videos.length} {videos.length === 1 ? "video" : "videos"}</span>
//                 <span className="vl-meta-item"><HardDrive size={13} /> {totalSizeMB} MB total</span>
//                 <span className="vl-tag">HD Quality</span>
//               </div>
//             </div>
//           </div>

//           <div className="vl-progress-chip">
//             {playingId ? videos.findIndex(v => v.id === playingId) + 1 : 0} / {Math.max(videos.length, 1)} played
//           </div>
//         </div>

//         {/* ── Body ── */}
//         <div className="vl-body">

//           {/* Sidebar */}
//           <div className="vl-sidebar" style={{ width: sidebarOpen ? sidebarW : 0 }}>
//             {sidebarOpen && (
//               <div className="vl-sidebar-inner">
//                 <div className="vl-sidebar-head">
//                   <div>
//                     <p className="vl-sidebar-title"><BookOpen size={14} style={{ color: "var(--vl-accent1)" }} /> Lecture Library</p>
//                     <p className="vl-sidebar-count">{videos.length} lecture{videos.length !== 1 && "s"}</p>
//                   </div>
//                 </div>

//                 <div className="vl-sidebar-list">
//                   {videos.length === 0 ? (
//                     <div className="vl-sidebar-empty">
//                       <div className="vl-empty-icon-box"><Video size={22} /></div>
//                       No videos available yet
//                     </div>
//                   ) : (
//                     videos.map((v, index) => {
//                       const active = playingId === v.id;
//                       const sizeMb = Math.round((v.size || 0) / 1024 / 1024);
//                       const title  = v.title || v.originalFileName || "Untitled";
//                       return (
//                         <button
//                           key={v.id}
//                           onClick={() => playVideo(v)}
//                           className={`vl-list-item${active ? " active" : ""}`}
//                         >
//                           <div className="vl-list-thumb" style={{ background: grad(title) }}>
//                             {active ? (
//                               <div className="vl-list-bars">
//                                 <div className="vl-bar" style={{ height: 12, animation: "vl-b1 0.6s ease-in-out infinite" }} />
//                                 <div className="vl-bar" style={{ height: 16, animation: "vl-b1 0.6s ease-in-out 0.1s infinite" }} />
//                                 <div className="vl-bar" style={{ height: 10, animation: "vl-b1 0.6s ease-in-out 0.2s infinite" }} />
//                               </div>
//                             ) : (
//                               <Play size={14} color="white" />
//                             )}
//                           </div>
//                           <div className="vl-list-info">
//                             <p className="vl-list-title">{index + 1}. {title}</p>
//                             <div className="vl-list-sub">
//                               <Clock size={10} />
//                               <span>{sizeMb} MB</span>
//                               {active && <span className="vl-playing-dot">● Playing</span>}
//                             </div>
//                           </div>
//                         </button>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Resize handle */}
//           {sidebarOpen && (
//             <div className="vl-resize" onMouseDown={onResizeStart}>
//               <div className="vl-resize-bar" />
//             </div>
//           )}

//           {/* Player */}
//           <div className="vl-player">
//             {/* Toggle + now playing */}
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <button className="vl-toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
//                 {sidebarOpen
//                   ? <><ChevronLeft size={14} /> Hide Library</>
//                   : <><ChevronRight size={14} /> Show Library</>
//                 }
//               </button>
//               {selectedVideo && (
//                 <p className="vl-now-playing">
//                   Now playing: <strong>{selectedVideo.title || selectedVideo.originalFileName}</strong>
//                 </p>
//               )}
//             </div>

//             {/* Card */}
//             <div className="vl-player-card">
//               {playingId && videoUrls[playingId] ? (
//                 <>
//                   <div style={{ background: "#000", flexShrink: 0 }}>
//                     <video
//                       style={{ width: "100%", aspectRatio: "16/9" }}
//                       controls autoPlay
//                       controlsList="nodownload"
//                       disablePictureInPicture
//                       src={videoUrls[playingId]}
//                     />
//                   </div>

//                   <div className="vl-info-bar">
//                     <div className="vl-info-left">
//                       <div className="vl-info-thumb" style={{ background: grad(selectedVideo?.title || "") }}>
//                         <Film size={16} color="white" />
//                       </div>
//                       <div>
//                         <p className="vl-info-title">{selectedVideo?.title || selectedVideo?.originalFileName}</p>
//                         <p className="vl-info-size">{Math.round((selectedVideo?.size || 0) / 1024 / 1024)} MB</p>
//                       </div>
//                     </div>
//                     <span className="vl-playing-badge">
//                       <span className="vl-pulse" />
//                       Playing
//                     </span>
//                   </div>

//                   {videos.findIndex(v => v.id === playingId) < videos.length - 1 && (
//                     <button
//                       className="vl-next-btn"
//                       onClick={() => {
//                         const idx = videos.findIndex(v => v.id === playingId);
//                         if (idx < videos.length - 1) playVideo(videos[idx + 1]);
//                       }}
//                     >
//                       <PlayCircle size={16} style={{ color: "var(--vl-accent1)", flexShrink: 0 }} />
//                       <span className="vl-next-label">
//                         Next: {videos[videos.findIndex(v => v.id === playingId) + 1]?.title || videos[videos.findIndex(v => v.id === playingId) + 1]?.originalFileName}
//                       </span>
//                       <ChevronRight size={14} style={{ flexShrink: 0 }} />
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 <div className="vl-empty-state">
//                   <div className="vl-empty-big-icon"><PlayCircle size={40} /></div>
//                   <div style={{ textAlign: "center" }}>
//                     <p className="vl-empty-title">Select a lecture to play</p>
//                     <p className="vl-empty-sub">Choose a video from the {sidebarOpen ? "library on the left" : "lecture library"}</p>
//                   </div>
//                   {!sidebarOpen && (
//                     <button className="vl-open-btn" onClick={() => setSidebarOpen(true)}>
//                       <BookOpen size={15} /> Open Lecture Library
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes vl-b1 { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.5)} }
//       `}</style>
//     </div>
//   );
// };

// export default VideoLectures; no progrees service add this ui 


















import React, { useEffect, useRef, useState } from "react";
import videoService from "../services/videoService";
import { progressService } from "../services/progressService";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  HardDrive,
  Play,
  PlayCircle,
  Video,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --vl-bg:        #f1f5f9;
    --vl-card:      #ffffff;
    --vl-text:      #0f172a;
    --vl-muted:     #64748b;
    --vl-border:    #e2e8f0;
    --vl-accent1:   #22d3ee;
    --vl-accent2:   #fb923c;
    --vl-accent3:   #34d399;
    --vl-accent4:   #a78bfa;
    --vl-shadow:    0 4px 24px rgba(0,0,0,0.06);
    --vl-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --vl-radius:    20px;
  }

  .vl-dark {
    --vl-bg:        #0a0a0a;
    --vl-card:      #111111;
    --vl-text:      #ffffff;
    --vl-muted:     #94a3b8;
    --vl-border:    rgba(255,255,255,0.06);
    --vl-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --vl-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .vl-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--vl-bg);
    color: var(--vl-text);
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
    transition: background 0.3s;
  }

  .vl-inner {
    max-width: 1300px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
  }

  .vl-header {
    background: var(--vl-card);
    border: 1px solid var(--vl-border);
    border-radius: var(--vl-radius);
    padding: 28px 32px;
    box-shadow: var(--vl-shadow);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .vl-header-left { display: flex; align-items: center; gap: 16px; }

  .vl-header-icon-box {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(34,211,238,0.10);
    border: 1px solid rgba(34,211,238,0.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--vl-accent1); flex-shrink: 0;
  }

  .vl-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 50px;
    border: 1px solid var(--vl-border);
    background: rgba(34,211,238,0.08);
    color: var(--vl-accent1);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
  }

  .vl-h1 { font-size: 24px; font-weight: 800; color: var(--vl-text); margin: 0 0 2px; }

  .vl-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

  .vl-meta-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 500; color: var(--vl-muted);
  }

  .vl-tag {
    padding: 4px 10px; border-radius: 8px;
    background: rgba(52,211,153,0.10);
    border: 1px solid rgba(52,211,153,0.18);
    color: var(--vl-accent3); font-size: 11px; font-weight: 700;
  }

  .vl-progress-chip {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 14px;
    background: var(--vl-bg); border: 1px solid var(--vl-border);
    box-shadow: var(--vl-shadow);
  }

  .vl-progress-chip-inner { display: flex; flex-direction: column; gap: 4px; }

  .vl-progress-chip-val {
    font-size: 14px; font-weight: 700; color: var(--vl-accent1);
    font-family: 'Poppins', sans-serif; line-height: 1;
  }

  .vl-progress-chip-lbl {
    font-size: 10px; font-weight: 600; color: var(--vl-muted);
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .vl-progress-bar-wrap {
    width: 80px; height: 4px; border-radius: 99px;
    background: rgba(34,211,238,0.15); overflow: hidden;
  }

  .vl-progress-bar {
    height: 100%; border-radius: 99px; background: var(--vl-accent1);
    transition: width 0.5s ease;
  }

  .vl-body { display: flex; gap: 16px; flex: 1; min-height: 0; align-items: stretch; }

  .vl-sidebar { flex-shrink: 0; display: flex; transition: width 0.3s ease; overflow: hidden; }

  .vl-sidebar-inner {
    display: flex; flex-direction: column;
    background: var(--vl-card);
    border: 1px solid var(--vl-border);
    border-radius: var(--vl-radius);
    box-shadow: var(--vl-shadow);
    overflow: hidden; width: 100%;
  }

  .vl-sidebar-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--vl-border);
    flex-shrink: 0;
  }

  .vl-sidebar-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 700; color: var(--vl-text); margin: 0;
  }

  .vl-sidebar-count { font-size: 11px; color: var(--vl-muted); margin-top: 2px; }

  .vl-sidebar-list { flex: 1; overflow-y: auto; padding: 8px 0; }
  .vl-sidebar-list::-webkit-scrollbar { width: 4px; }
  .vl-sidebar-list::-webkit-scrollbar-track { background: transparent; }
  .vl-sidebar-list::-webkit-scrollbar-thumb { background: var(--vl-border); border-radius: 4px; }

  .vl-list-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-left: 3px solid transparent;
    cursor: pointer; transition: background 0.15s, border-color 0.15s;
    background: transparent;
    border-top: none; border-right: none; border-bottom: none;
    width: 100%; text-align: left;
  }

  .vl-list-item:hover { background: rgba(34,211,238,0.04); }

  .vl-list-item.active {
    background: rgba(34,211,238,0.07);
    border-left-color: var(--vl-accent1);
  }

  .vl-list-item.watched {
    background: rgba(52,211,153,0.05);
    border-left-color: var(--vl-accent3);
  }

  .vl-list-thumb {
    width: 44px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .vl-list-bars { display: flex; gap: 2px; align-items: flex-end; height: 14px; }

  .vl-bar { width: 3px; border-radius: 2px; background: white; }

  .vl-list-info { flex: 1; min-width: 0; }

  .vl-list-title {
    font-size: 12px; font-weight: 600; color: var(--vl-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 3px;
  }

  .vl-list-item.active .vl-list-title { color: var(--vl-accent1); }
  .vl-list-item.watched .vl-list-title { color: var(--vl-accent3); }

  .vl-list-sub { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--vl-muted); }

  .vl-playing-dot { font-size: 10px; font-weight: 700; color: var(--vl-accent3); }
  .vl-watched-dot { font-size: 10px; font-weight: 700; color: var(--vl-accent3); }

  .vl-sidebar-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 40px 20px; gap: 10px;
    color: var(--vl-muted); font-size: 13px; text-align: center;
  }

  .vl-empty-icon-box {
    width: 48px; height: 48px; border-radius: 14px;
    background: var(--vl-bg); border: 1px solid var(--vl-border);
    display: flex; align-items: center; justify-content: center; color: var(--vl-muted);
  }

  .vl-resize { width: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: col-resize; }

  .vl-resize-bar {
    width: 3px; height: 48px; border-radius: 4px;
    background: var(--vl-border); transition: background 0.2s;
  }

  .vl-resize:hover .vl-resize-bar { background: var(--vl-accent1); }

  .vl-player { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }

  .vl-toggle-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 12px;
    border: 1px solid var(--vl-border);
    background: var(--vl-card); color: var(--vl-muted);
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; box-shadow: var(--vl-shadow);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }

  .vl-toggle-btn:hover {
    color: var(--vl-accent1);
    border-color: rgba(34,211,238,0.3);
    background: rgba(34,211,238,0.04);
  }

  .vl-now-playing { font-size: 12px; color: var(--vl-muted); }
  .vl-now-playing strong { color: var(--vl-text); font-weight: 600; }

  .vl-player-card {
    flex: 1; background: var(--vl-card);
    border: 1px solid var(--vl-border);
    border-radius: var(--vl-radius);
    box-shadow: var(--vl-shadow);
    overflow: hidden; display: flex; flex-direction: column;
  }

  video { display: block; width: 100%; }

  .vl-info-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px; border-top: 1px solid var(--vl-border); flex-shrink: 0;
  }

  .vl-info-left { display: flex; align-items: center; gap: 12px; }

  .vl-info-thumb {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .vl-info-title { font-size: 14px; font-weight: 700; color: var(--vl-text); margin: 0 0 2px; }
  .vl-info-size { font-size: 11px; color: var(--vl-muted); }

  .vl-playing-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 50px;
    background: rgba(52,211,153,0.10);
    border: 1px solid rgba(52,211,153,0.20);
    color: var(--vl-accent3); font-size: 11px; font-weight: 700;
  }

  .vl-pulse {
    width: 6px; height: 6px; border-radius: 50%; background: var(--vl-accent3);
    animation: vl-pulse 1.5s ease-in-out infinite;
  }

  @keyframes vl-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* Mark as watched button */
  .vl-watched-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px 16px; flex-shrink: 0;
  }

  .vl-mark-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 12px; border: none;
    background: var(--vl-accent3); color: #0a0a0a;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; box-shadow: 0 4px 16px rgba(52,211,153,0.30);
    transition: opacity 0.2s, transform 0.15s;
  }

  .vl-mark-btn:hover { opacity: 0.88; transform: translateY(-1px); }

  .vl-watched-confirm {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 12px;
    background: rgba(52,211,153,0.10);
    border: 1px solid rgba(52,211,153,0.25);
    color: var(--vl-accent3); font-size: 12px; font-weight: 700;
    font-family: 'Poppins', sans-serif;
  }

  .vl-watched-count { font-size: 11px; color: var(--vl-muted); font-family: 'Poppins', sans-serif; }

  .vl-next-btn {
    display: flex; align-items: center; gap: 10px;
    margin: 0 24px 16px; padding: 12px 16px; border-radius: 14px;
    border: 1px solid var(--vl-border); background: var(--vl-bg);
    color: var(--vl-muted);
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s; text-align: left;
  }

  .vl-next-btn:hover {
    border-color: rgba(34,211,238,0.30);
    color: var(--vl-accent1); background: rgba(34,211,238,0.04);
  }

  .vl-next-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .vl-empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px; padding: 40px;
  }

  .vl-empty-big-icon {
    width: 80px; height: 80px; border-radius: 24px;
    background: rgba(34,211,238,0.10);
    border: 1px solid rgba(34,211,238,0.18);
    display: flex; align-items: center; justify-content: center; color: var(--vl-accent1);
  }

  .vl-empty-title { font-size: 16px; font-weight: 700; color: var(--vl-text); margin: 0 0 4px; }
  .vl-empty-sub { font-size: 13px; color: var(--vl-muted); margin: 0; }

  .vl-open-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; border-radius: 14px; border: none;
    background: var(--vl-accent1); color: #0a0a0a;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s;
  }

  .vl-open-btn:hover { opacity: 0.87; transform: translateY(-1px); }
`;

if (!document.getElementById("vl-styles")) {
  const tag = document.createElement("style");
  tag.id = "vl-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

/* ── gradient pool for thumbnails ── */
const GRADS = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#0891b2,#0e7490)",
  "linear-gradient(135deg,#be123c,#9f1239)",
  "linear-gradient(135deg,#b45309,#92400e)",
  "linear-gradient(135deg,#047857,#065f46)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
];
const grad = (s) => GRADS[(s?.charCodeAt(0) ?? 0) % GRADS.length];

// ✅ Decode email from JWT
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ════════════ MAIN ════════════ */
const VideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [playingId, setPlayingId] = useState(null);

  // ✅ Progress state from backend
  const [watchedVideoIds, setWatchedVideoIds] = useState([]);
  const [watchPercentage, setWatchPercentage] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarW, setSidebarW] = useState(280);
  const [dark, setDark] = useState(isDarkMode);

  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(280);

  const studentEmail = getEmailFromToken();

  // ✅ Load videos + progress on mount
  useEffect(() => {
    videoService
      .getStudentVideos()
      .then(async (res) => {
        const data = res.data || [];
        setVideos(data);

        if (data.length > 0 && studentEmail) {
          try {
            const prog = await progressService.getVideoProgress(
              studentEmail,
              data[0].batchId,
            );
            setWatchedVideoIds(prog.data.watchedVideoIds || []);
            setWatchPercentage(prog.data.watchPercentage || 0);
          } catch {
            setWatchedVideoIds([]);
            setWatchPercentage(0);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDarkMode()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const playVideo = async (video) => {
    if (!videoUrls[video.id]) {
      try {
        const res = await videoService.getVideoBlob(video.storedFileName);
        const blobUrl = URL.createObjectURL(res.data);
        setVideoUrls((prev) => ({ ...prev, [video.id]: blobUrl }));
      } catch {
        alert("Unable to play video");
        return;
      }
    }
    setPlayingId(video.id);
  };

  // ✅ Mark video as watched
  const markWatched = async (video) => {
    if (!studentEmail) return;
    try {
      const res = await progressService.markVideoWatched(
        studentEmail,
        video.batchId,
        video.id,
        videos.length,
      );
      setWatchedVideoIds(res.data.watchedVideoIds || []);
      setWatchPercentage(res.data.watchPercentage || 0);
    } catch (err) {
      console.error("Mark watched failed", err);
    }
  };

  const selectedVideo = videos.find((v) => v.id === playingId);
  const totalSizeMB = Math.round(
    videos.reduce((acc, v) => acc + (v.size || 0), 0) / 1024 / 1024,
  );

  const onResizeStart = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = sidebarW;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      setSidebarW(Math.min(420, Math.max(200, startW.current + (e.clientX - startX.current))));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className={`vl-root${dark ? " vl-dark" : ""}`}>
      <div className="vl-inner">

        {/* ── Header ── */}
        <div className="vl-header">
          <div className="vl-header-left">
            <div className="vl-header-icon-box">
              <Film size={24} />
            </div>
            <div>
              <div className="vl-badge"><Film size={10} /> Video Lectures</div>
              <h1 className="vl-h1">Video Lectures</h1>
              <div className="vl-meta">
                <span className="vl-meta-item"><Video size={13} /> {videos.length} {videos.length === 1 ? "video" : "videos"}</span>
                <span className="vl-meta-item"><HardDrive size={13} /> {totalSizeMB} MB total</span>
                <span className="vl-tag">HD Quality</span>
              </div>
            </div>
          </div>

          {/* ✅ Real watched count + progress bar */}
          <div className="vl-progress-chip">
            <CheckCircle size={18} color="var(--vl-accent3)" />
            <div className="vl-progress-chip-inner">
              <span className="vl-progress-chip-val">
                {watchedVideoIds.length} / {Math.max(videos.length, 1)} watched
              </span>
              <span className="vl-progress-chip-lbl">Video Progress</span>
              {videos.length > 0 && (
                <div className="vl-progress-bar-wrap">
                  <div className="vl-progress-bar" style={{ width: `${watchPercentage}%` }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="vl-body">

          {/* Sidebar */}
          <div className="vl-sidebar" style={{ width: sidebarOpen ? sidebarW : 0 }}>
            {sidebarOpen && (
              <div className="vl-sidebar-inner">
                <div className="vl-sidebar-head">
                  <div>
                    <p className="vl-sidebar-title">
                      <BookOpen size={14} style={{ color: "var(--vl-accent1)" }} /> Lecture Library
                    </p>
                    <p className="vl-sidebar-count">{videos.length} lecture{videos.length !== 1 && "s"}</p>
                  </div>
                </div>

                <div className="vl-sidebar-list">
                  {videos.length === 0 ? (
                    <div className="vl-sidebar-empty">
                      <div className="vl-empty-icon-box"><Video size={22} /></div>
                      No videos available yet
                    </div>
                  ) : (
                    videos.map((v, index) => {
                      const active = playingId === v.id;
                      // ✅ Check watchedVideoIds from backend
                      const isWatched = watchedVideoIds.includes(v.id);
                      const sizeMb = Math.round((v.size || 0) / 1024 / 1024);
                      const title = v.title || v.originalFileName || "Untitled";
                      return (
                        <button
                          key={v.id}
                          onClick={() => playVideo(v)}
                          className={`vl-list-item${active ? " active" : isWatched ? " watched" : ""}`}
                        >
                          <div className="vl-list-thumb" style={{ background: grad(title) }}>
                            {active ? (
                              <div className="vl-list-bars">
                                <div className="vl-bar" style={{ height: 12, animation: "vl-b1 0.6s ease-in-out infinite" }} />
                                <div className="vl-bar" style={{ height: 16, animation: "vl-b1 0.6s ease-in-out 0.1s infinite" }} />
                                <div className="vl-bar" style={{ height: 10, animation: "vl-b1 0.6s ease-in-out 0.2s infinite" }} />
                              </div>
                            ) : isWatched ? (
                              <CheckCircle size={14} color="white" />
                            ) : (
                              <Play size={14} color="white" />
                            )}
                          </div>
                          <div className="vl-list-info">
                            <p className="vl-list-title">{index + 1}. {title}</p>
                            <div className="vl-list-sub">
                              <Clock size={10} />
                              <span>{sizeMb} MB</span>
                              {active && <span className="vl-playing-dot">● Playing</span>}
                              {isWatched && !active && <span className="vl-watched-dot">✓ Watched</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Resize handle */}
          {sidebarOpen && (
            <div className="vl-resize" onMouseDown={onResizeStart}>
              <div className="vl-resize-bar" />
            </div>
          )}

          {/* Player */}
          <div className="vl-player">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="vl-toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
                {sidebarOpen
                  ? <><ChevronLeft size={14} /> Hide Library</>
                  : <><ChevronRight size={14} /> Show Library</>
                }
              </button>
              {selectedVideo && (
                <p className="vl-now-playing">
                  Now playing: <strong>{selectedVideo.title || selectedVideo.originalFileName}</strong>
                </p>
              )}
            </div>

            <div className="vl-player-card">
              {playingId && videoUrls[playingId] ? (
                <>
                  <div style={{ background: "#000", flexShrink: 0 }}>
                    <video
                      style={{ width: "100%", aspectRatio: "16/9" }}
                      controls
                      autoPlay
                      controlsList="nodownload"
                      disablePictureInPicture
                      src={videoUrls[playingId]}
                    />
                  </div>

                  <div className="vl-info-bar">
                    <div className="vl-info-left">
                      <div className="vl-info-thumb" style={{ background: grad(selectedVideo?.title || "") }}>
                        <Film size={16} color="white" />
                      </div>
                      <div>
                        <p className="vl-info-title">{selectedVideo?.title || selectedVideo?.originalFileName}</p>
                        <p className="vl-info-size">{Math.round((selectedVideo?.size || 0) / 1024 / 1024)} MB</p>
                      </div>
                    </div>
                    <span className="vl-playing-badge">
                      <span className="vl-pulse" />
                      Playing
                    </span>
                  </div>

                  {/* ✅ Mark as Watched button */}
                  {selectedVideo && (
                    <div className="vl-watched-bar">
                      {watchedVideoIds.includes(selectedVideo.id) ? (
                        <div className="vl-watched-confirm">
                          <CheckCircle size={16} />
                          Marked as Watched
                        </div>
                      ) : (
                        <button className="vl-mark-btn" onClick={() => markWatched(selectedVideo)}>
                          <CheckCircle size={15} />
                          Mark as Watched
                        </button>
                      )}
                      <span className="vl-watched-count">
                        {watchedVideoIds.length} of {videos.length} watched
                      </span>
                    </div>
                  )}

                  {videos.findIndex(v => v.id === playingId) < videos.length - 1 && (
                    <button
                      className="vl-next-btn"
                      onClick={() => {
                        const idx = videos.findIndex(v => v.id === playingId);
                        if (idx < videos.length - 1) playVideo(videos[idx + 1]);
                      }}
                    >
                      <PlayCircle size={16} style={{ color: "var(--vl-accent1)", flexShrink: 0 }} />
                      <span className="vl-next-label">
                        Next: {videos[videos.findIndex(v => v.id === playingId) + 1]?.title || videos[videos.findIndex(v => v.id === playingId) + 1]?.originalFileName}
                      </span>
                      <ChevronRight size={14} style={{ flexShrink: 0 }} />
                    </button>
                  )}
                </>
              ) : (
                <div className="vl-empty-state">
                  <div className="vl-empty-big-icon"><PlayCircle size={40} /></div>
                  <div style={{ textAlign: "center" }}>
                    <p className="vl-empty-title">Select a lecture to play</p>
                    <p className="vl-empty-sub">Choose a video from the {sidebarOpen ? "library on the left" : "lecture library"}</p>
                  </div>
                  {!sidebarOpen && (
                    <button className="vl-open-btn" onClick={() => setSidebarOpen(true)}>
                      <BookOpen size={15} /> Open Lecture Library
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vl-b1 { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.5)} }
      `}</style>
    </div>
  );
};

export default VideoLectures;