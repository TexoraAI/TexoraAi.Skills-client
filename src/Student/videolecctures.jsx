
// import React, { useEffect, useState } from "react";
// import videoService from "../services/videoService";

// // ICONS
// import {
//   FaClock,
//   FaPlayCircle,
//   FaVideo,
//   FaBookOpen,
//   FaFilm,
// } from "react-icons/fa";

// const VideoLectures = () => {
//   const [videos, setVideos] = useState([]);
//   const [videoUrls, setVideoUrls] = useState({});
//   const [playingId, setPlayingId] = useState(null);

//   // ✅ FIXED — now loads only classroom videos
//   useEffect(() => {
//     videoService
//       .getStudentVideos()
//       .then((res) => setVideos(res.data || []))
//       .catch(console.error);
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

//   const totalSizeMB = Math.round(
//     videos.reduce((acc, v) => acc + (v.size || 0), 0) / 1024 / 1024,
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       ```
//       <header
//         className="relative overflow-hidden
//     bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//     dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
//       >
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
//           <div>
//             <div className="flex items-center gap-3 mb-1">
//               <div className="p-2 rounded-xl bg-white/30 backdrop-blur text-white shadow">
//                 <FaFilm className="w-5 h-5" />
//               </div>
//               <h1 className="text-2xl font-bold text-white">Video Lectures</h1>
//             </div>

//             <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
//               <span className="flex items-center gap-1.5">
//                 <FaVideo className="w-4 h-4" />
//                 {videos.length} {videos.length === 1 ? "video" : "videos"}
//               </span>

//               <span className="w-1 h-1 rounded-full bg-white/60" />

//               <span>{totalSizeMB} MB total</span>

//               <span className="px-2 py-0.5 rounded-full bg-white/30 text-white text-xs">
//                 HD quality
//               </span>
//             </div>
//           </div>

//           <div className="hidden sm:block">
//             <span className="px-4 py-2 rounded-xl bg-white/30 backdrop-blur text-sm text-white shadow">
//               1 / {Math.max(videos.length, 1)} completed
//             </span>
//           </div>
//         </div>
//       </header>
//       <main className="max-w-7xl mx-auto px-6 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] gap-6 items-start">
//           <aside
//             className="bg-white dark:bg-slate-900 rounded-2xl
//         border border-slate-200 dark:border-slate-800 shadow-sm"
//           >
//             <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
//               <h3
//                 className="text-sm font-semibold flex items-center gap-2
//             text-slate-900 dark:text-slate-50"
//               >
//                 <FaBookOpen className="text-blue-600 dark:text-blue-400" />
//                 Lecture Library
//               </h3>
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 {videos.length} lecture{videos.length !== 1 && "s"}
//               </p>
//             </div>

//             <div className="max-h-[560px] overflow-y-auto">
//               <ul className="divide-y divide-slate-100 dark:divide-slate-800">
//                 {videos.map((v, index) => {
//                   const active = playingId === v.id;
//                   const sizeMb = Math.round((v.size || 0) / 1024 / 1024);

//                   return (
//                     <li key={v.id}>
//                       <button
//                         onClick={() => playVideo(v)}
//                         className={`w-full flex gap-3 px-4 py-3 text-left border-l-2 transition
//                       ${
//                         active
//                           ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600"
//                           : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
//                       }`}
//                       >
//                         <FaPlayCircle className="w-4 h-4 mt-1 text-blue-500" />

//                         <div className="flex-1 min-w-0">
//                           <p
//                             className="truncate text-sm font-medium
//                         text-slate-800 dark:text-slate-200"
//                           >
//                             {index + 1}. {v.title || v.originalFileName}
//                           </p>
//                           <div
//                             className="flex items-center gap-2 text-[11px]
//                         text-slate-500 dark:text-slate-400"
//                           >
//                             <FaClock className="w-3 h-3" />
//                             {sizeMb} MB
//                           </div>
//                         </div>
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </aside>

//           <section
//             className="bg-white dark:bg-slate-900 rounded-2xl
//         border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
//           >
//             {playingId && videoUrls[playingId] ? (
//               <>
//                 <video
//                   className="w-full aspect-video bg-black"
//                   controls
//                   autoPlay
//                   controlsList="nodownload"
//                   disablePictureInPicture
//                   src={videoUrls[playingId]}
//                 />

//                 <div className="px-6 py-4">
//                   <h2
//                     className="text-sm font-semibold
//                 text-slate-900 dark:text-slate-50"
//                   >
//                     {selectedVideo?.title || selectedVideo?.originalFileName}
//                   </h2>
//                 </div>
//               </>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
//                 <FaPlayCircle className="w-8 h-8 mb-2" />
//                 <p className="text-sm">Select a lecture to play</p>
//               </div>
//             )}
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default VideoLectures;
































import React, { useEffect, useRef, useState } from "react";
import videoService from "../services/videoService";
import {
  BookOpen, ChevronLeft, ChevronRight, Clock,
  Film, HardDrive, Maximize2, Minimize2,
  Play, PlayCircle, Video,
} from "lucide-react";

/* ── gradient pool for thumbnails ── */
const GRADS = [
  "from-violet-600 to-indigo-700","from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600","from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600","from-indigo-500 to-blue-700",
];
const grad = (s) => GRADS[(s?.charCodeAt(0) ?? 0) % GRADS.length];

/* ════════════ MAIN ════════════ */
const VideoLectures = () => {
  /* ── backend state — ALL UNCHANGED ── */
  const [videos, setVideos]         = useState([]);
  const [videoUrls, setVideoUrls]   = useState({});
  const [playingId, setPlayingId]   = useState(null);

  /* ── UI state ── */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarW, setSidebarW]       = useState(280);
  const dragging = useRef(false);
  const startX   = useRef(0);
  const startW   = useRef(280);

  /* ── load videos (unchanged) ── */
  useEffect(() => {
    videoService
      .getStudentVideos()
      .then((res) => setVideos(res.data || []))
      .catch(console.error);
  }, []);

  /* ── play video (unchanged) ── */
  const playVideo = async (video) => {
    if (!videoUrls[video.id]) {
      try {
        const res    = await videoService.getVideoBlob(video.storedFileName);
        const blobUrl = URL.createObjectURL(res.data);
        setVideoUrls((prev) => ({ ...prev, [video.id]: blobUrl }));
      } catch {
        alert("Unable to play video");
        return;
      }
    }
    setPlayingId(video.id);
  };

  const selectedVideo = videos.find((v) => v.id === playingId);
  const totalSizeMB   = Math.round(
    videos.reduce((acc, v) => acc + (v.size || 0), 0) / 1024 / 1024,
  );

  /* ── sidebar resize (CRM style) ── */
  const onResizeStart = (e) => {
    dragging.current = true;
    startX.current   = e.clientX;
    startW.current   = sidebarW;
    document.body.style.cursor     = "col-resize";
    document.body.style.userSelect = "none";
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      setSidebarW(Math.min(420, Math.max(200, startW.current + delta)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  /* ════════════ RENDER ════════════ */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] flex flex-col">

      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4] mx-5 mt-5 rounded-2xl shadow-xl flex-shrink-0">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Video Lectures</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-blue-100/80">
                <span className="flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5" />
                  {videos.length} {videos.length === 1 ? "video" : "videos"}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5" />
                  {totalSizeMB} MB total
                </span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  HD quality
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm text-sm text-white font-semibold">
              {playingId ? videos.findIndex(v => v.id === playingId) + 1 : 0} / {Math.max(videos.length, 1)} completed
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex flex-1 gap-0 px-5 pb-5 pt-4 overflow-hidden min-h-0">

        {/* ── SIDEBAR ── */}
        <div
          className={`flex-shrink-0 flex transition-all duration-300 ease-in-out`}
          style={{ width: sidebarOpen ? sidebarW : 0 }}
        >
          {sidebarOpen && (
            <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden min-w-0">

              {/* sidebar header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex-shrink-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    Lecture Library
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {videos.length} lecture{videos.length !== 1 && "s"}
                  </p>
                </div>
              </div>

              {/* lecture list */}
              <div className="flex-1 overflow-y-auto">
                {videos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Video className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 text-center px-4">No videos available yet</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {videos.map((v, index) => {
                      const active  = playingId === v.id;
                      const sizeMb  = Math.round((v.size || 0) / 1024 / 1024);
                      const title   = v.title || v.originalFileName || "Untitled";

                      return (
                        <li key={v.id}>
                          <button
                            onClick={() => playVideo(v)}
                            className={`w-full flex gap-3 px-4 py-3.5 text-left border-l-2 transition-all group
                              ${active
                                ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500"
                                : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              }`}
                          >
                            {/* thumbnail */}
                            <div className={`h-10 w-14 rounded-lg bg-gradient-to-br ${grad(title)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                              {active
                                ? <div className="flex gap-0.5 items-end h-4"><div className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{height:"12px"}}/><div className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_0.1s_infinite]" style={{height:"16px"}}/><div className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_0.2s_infinite]" style={{height:"10px"}}/></div>
                                : <Play className="h-4 w-4 text-white/90" />
                              }
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={`truncate text-sm font-medium leading-tight ${active ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-slate-200 group-hover:text-blue-600"}`}>
                                {index + 1}. {title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>{sizeMb} MB</span>
                                {active && <span className="text-blue-500 font-semibold">● Playing</span>}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── RESIZE HANDLE ── */}
        {sidebarOpen && (
          <div
            onMouseDown={onResizeStart}
            className="flex-shrink-0 w-2 mx-1 self-stretch flex items-center justify-center cursor-col-resize group"
            title="Drag to resize"
          >
            <div className="w-1 h-16 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors" />
          </div>
        )}

        {/* ── VIDEO PLAYER ── */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">

          {/* collapse/expand toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-all shadow-sm"
            >
              {sidebarOpen
                ? <><ChevronLeft className="h-3.5 w-3.5"/> Hide Library</>
                : <><ChevronRight className="h-3.5 w-3.5"/> Show Library</>
              }
            </button>
            {selectedVideo && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Now playing: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedVideo.title || selectedVideo.originalFileName}</span>
              </p>
            )}
          </div>

          {/* player card */}
          <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden flex flex-col">

            {playingId && videoUrls[playingId] ? (
              <>
                {/* video */}
                <div className="relative bg-black flex-shrink-0">
                  <video
                    className="w-full aspect-video"
                    controls
                    autoPlay
                    controlsList="nodownload"
                    disablePictureInPicture
                    src={videoUrls[playingId]}
                  />
                </div>

                {/* video info bar */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(selectedVideo?.title || "")} flex items-center justify-center flex-shrink-0`}>
                      <Film className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-tight">
                        {selectedVideo?.title || selectedVideo?.originalFileName}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {Math.round((selectedVideo?.size || 0) / 1024 / 1024)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Playing
                    </span>
                  </div>
                </div>

                {/* next lecture */}
                {videos.findIndex(v => v.id === playingId) < videos.length - 1 && (
                  <div className="px-6 pb-4 flex-shrink-0">
                    <button
                      onClick={() => {
                        const idx = videos.findIndex(v => v.id === playingId);
                        if (idx < videos.length - 1) playVideo(videos[idx + 1]);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 transition-all w-full"
                    >
                      <PlayCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        Next: {videos[videos.findIndex(v => v.id === playingId) + 1]?.title || videos[videos.findIndex(v => v.id === playingId) + 1]?.originalFileName}
                      </span>
                      <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-950">
                  <PlayCircle className="h-10 w-10 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Select a lecture to play</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Choose a video from the {sidebarOpen ? "library on the left" : "lecture library"}
                  </p>
                </div>
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all"
                  >
                    <BookOpen className="h-4 w-4" /> Open Lecture Library
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLectures;
