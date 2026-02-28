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

//   useEffect(() => {
//     videoService
//       .getAllVideos()
//       .then((res) => setVideos(res.data))
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
//     videos.reduce((acc, v) => acc + (v.size || 0), 0) / 1024 / 1024
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

//       {/* ================= LIGHT HERO HEADER ================= */}
//       <header
//         className="relative overflow-hidden
//         bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//         dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
//       >
//         {/* soft overlay */}
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">

//           {/* LEFT */}
//           <div>
//             <div className="flex items-center gap-3 mb-1">
//               <div className="p-2 rounded-xl bg-white/30 backdrop-blur text-white shadow">
//                 <FaFilm className="w-5 h-5" />
//               </div>
//               <h1 className="text-2xl font-bold text-white">
//                 Video Lectures
//               </h1>
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

//           {/* RIGHT */}
//           <div className="hidden sm:block">
//             <span className="px-4 py-2 rounded-xl bg-white/30 backdrop-blur text-sm text-white shadow">
//               1 / {Math.max(videos.length, 1)} completed
//             </span>
//           </div>
//         </div>
//       </header>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="max-w-7xl mx-auto px-6 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] gap-6 items-start">

//           {/* ================= LEFT: LECTURE LIST ================= */}
//           <aside className="bg-white dark:bg-slate-900 rounded-2xl
//             border border-slate-200 dark:border-slate-800 shadow-sm">

//             <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
//               <h3 className="text-sm font-semibold flex items-center gap-2
//                 text-slate-900 dark:text-slate-50">
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
//                           ${
//                             active
//                               ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600"
//                               : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
//                           }`}
//                       >
//                         <FaPlayCircle className="w-4 h-4 mt-1 text-blue-500" />

//                         <div className="flex-1 min-w-0">
//                           <p className="truncate text-sm font-medium
//                             text-slate-800 dark:text-slate-200">
//                             {index + 1}. {v.title || v.originalFileName}
//                           </p>
//                           <div className="flex items-center gap-2 text-[11px]
//                             text-slate-500 dark:text-slate-400">
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

//           {/* ================= RIGHT: PLAYER ================= */}
//           <section className="bg-white dark:bg-slate-900 rounded-2xl
//             border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">

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
//                   <h2 className="text-sm font-semibold
//                     text-slate-900 dark:text-slate-50">
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

import React, { useEffect, useState } from "react";
import videoService from "../services/videoService";

// ICONS
import {
  FaClock,
  FaPlayCircle,
  FaVideo,
  FaBookOpen,
  FaFilm,
} from "react-icons/fa";

const VideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [playingId, setPlayingId] = useState(null);

  // ✅ FIXED — now loads only classroom videos
  useEffect(() => {
    videoService
      .getStudentVideos()
      .then((res) => setVideos(res.data || []))
      .catch(console.error);
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

  const selectedVideo = videos.find((v) => v.id === playingId);

  const totalSizeMB = Math.round(
    videos.reduce((acc, v) => acc + (v.size || 0), 0) / 1024 / 1024,
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      ```
      <header
        className="relative overflow-hidden
    bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
    dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-white/30 backdrop-blur text-white shadow">
                <FaFilm className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white">Video Lectures</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <FaVideo className="w-4 h-4" />
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>

              <span className="w-1 h-1 rounded-full bg-white/60" />

              <span>{totalSizeMB} MB total</span>

              <span className="px-2 py-0.5 rounded-full bg-white/30 text-white text-xs">
                HD quality
              </span>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="px-4 py-2 rounded-xl bg-white/30 backdrop-blur text-sm text-white shadow">
              1 / {Math.max(videos.length, 1)} completed
            </span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] gap-6 items-start">
          <aside
            className="bg-white dark:bg-slate-900 rounded-2xl
        border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3
                className="text-sm font-semibold flex items-center gap-2
            text-slate-900 dark:text-slate-50"
              >
                <FaBookOpen className="text-blue-600 dark:text-blue-400" />
                Lecture Library
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {videos.length} lecture{videos.length !== 1 && "s"}
              </p>
            </div>

            <div className="max-h-[560px] overflow-y-auto">
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {videos.map((v, index) => {
                  const active = playingId === v.id;
                  const sizeMb = Math.round((v.size || 0) / 1024 / 1024);

                  return (
                    <li key={v.id}>
                      <button
                        onClick={() => playVideo(v)}
                        className={`w-full flex gap-3 px-4 py-3 text-left border-l-2 transition
                      ${
                        active
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600"
                          : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                      >
                        <FaPlayCircle className="w-4 h-4 mt-1 text-blue-500" />

                        <div className="flex-1 min-w-0">
                          <p
                            className="truncate text-sm font-medium
                        text-slate-800 dark:text-slate-200"
                          >
                            {index + 1}. {v.title || v.originalFileName}
                          </p>
                          <div
                            className="flex items-center gap-2 text-[11px]
                        text-slate-500 dark:text-slate-400"
                          >
                            <FaClock className="w-3 h-3" />
                            {sizeMb} MB
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <section
            className="bg-white dark:bg-slate-900 rounded-2xl
        border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
          >
            {playingId && videoUrls[playingId] ? (
              <>
                <video
                  className="w-full aspect-video bg-black"
                  controls
                  autoPlay
                  controlsList="nodownload"
                  disablePictureInPicture
                  src={videoUrls[playingId]}
                />

                <div className="px-6 py-4">
                  <h2
                    className="text-sm font-semibold
                text-slate-900 dark:text-slate-50"
                  >
                    {selectedVideo?.title || selectedVideo?.originalFileName}
                  </h2>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <FaPlayCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">Select a lecture to play</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default VideoLectures;
