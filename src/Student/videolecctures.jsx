
// import React, { useEffect, useState } from "react";
// import { Clock, PlayCircle } from "lucide-react";
// import videoService from "../services/videoService";

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

//   return (
//     <div
//       className="
//         p-6 min-h-screen space-y-6
//         bg-gradient-to-b from-slate-50 to-slate-100
//         dark:from-slate-900 dark:to-slate-950
//       "
//     >
//       {/* HEADER */}
//       <div
//         className="
//           bg-white dark:bg-slate-900
//           border border-slate-200 dark:border-slate-700
//           rounded-xl p-6
//         "
//       >
//         <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
//           Video Lectures
//         </h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//           Watch recorded lectures & live session replays
//         </p>
//       </div>

//       {/* LMS LAYOUT */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* LEFT – VIDEO LIST */}
//         <div
//           className="
//             bg-white dark:bg-slate-900
//             border border-slate-200 dark:border-slate-700
//             rounded-xl shadow-md p-4 space-y-3
//           "
//         >
//           {videos.map((v) => (
//             <div
//               key={v.id}
//               onClick={() => playVideo(v)}
//               className={`p-3 rounded-lg cursor-pointer border transition
//                 ${
//                   playingId === v.id
//                     ? "bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500"
//                     : "hover:bg-indigo-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
//                 }
//               `}
//             >
//               <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
//                 {v.title || v.originalFileName}
//               </p>

//               <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
//                 {v.description || "No description available"}
//               </p>

//               <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2">
//                 <Clock className="w-3 h-3" />
//                 {Math.round(v.size / 1024 / 1024)} MB
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* RIGHT – VIDEO PLAYER */}
//         <div
//           className="
//             lg:col-span-2
//             bg-white dark:bg-slate-900
//             border border-slate-200 dark:border-slate-700
//             rounded-xl shadow-md p-6
//           "
//         >
//           {playingId && videoUrls[playingId] ? (
//             <>
//               <video
//                 className="w-full rounded-lg mb-4 bg-black"
//                 controls
//                 autoPlay
//                 controlsList="nodownload"
//                 disablePictureInPicture
//                 src={videoUrls[playingId]}
//               />

//               <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
//                 {selectedVideo?.title || selectedVideo?.originalFileName}
//               </h2>

//               <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
//                 {selectedVideo?.description || "No description available"}
//               </p>
//             </>
//           ) : (
//             <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
//               <PlayCircle className="w-14 h-14 mb-2 text-indigo-500" />
//               <p className="text-sm font-medium">
//                 Select a lecture from the left panel to start learning
//               </p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default VideoLectures;




import React, { useEffect, useState } from "react";
import { Clock, PlayCircle, Video, TrendingUp, BookOpen } from "lucide-react";
import videoService from "../services/videoService";

const VideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    videoService
      .getAllVideos()
      .then((res) => setVideos(res.data))
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

  // Calculate total size
  const totalSize = videos.reduce((acc, v) => acc + (v.size || 0), 0);
  const totalSizeMB = Math.round(totalSize / 1024 / 1024);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Video className="h-4 w-4 text-cyan-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Learning Hub
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Video Lectures
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Access recorded lectures and live session replays anytime, anywhere
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <PlayCircle className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{videos.length}</p>
                    <p className="text-xs text-white/70">Total Videos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <BookOpen className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{totalSizeMB}</p>
                    <p className="text-xs text-white/70">MB Content</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <TrendingUp className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">HD</p>
                    <p className="text-xs text-white/70">Quality</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                      <PlayCircle className="h-24 w-24 text-white/80" strokeWidth={1.5} />
                    </div>
                    {/* Play button glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-xl animate-pulse" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-teal-400/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                  <Video className="h-10 w-10 text-teal-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LMS LAYOUT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT – VIDEO LIST */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-5 space-y-3 h-fit max-h-[700px] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 pb-3 mb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Lecture Library
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {videos.length} videos available
              </p>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No videos available yet</p>
              </div>
            ) : (
              videos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => playVideo(v)}
                  className={`group p-4 rounded-xl cursor-pointer border-2 transition-all duration-200
                    ${
                      playingId === v.id
                        ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 border-blue-500 dark:border-blue-400 shadow-md"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      playingId === v.id 
                        ? "bg-blue-500 text-white" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600"
                    }`}>
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                        {v.title || v.originalFileName}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                        {v.description || "No description available"}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.round(v.size / 1024 / 1024)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT – VIDEO PLAYER */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6">
            {playingId && videoUrls[playingId] ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-700">
                  <video
                    className="w-full bg-black aspect-video"
                    controls
                    autoPlay
                    controlsList="nodownload"
                    disablePictureInPicture
                    src={videoUrls[playingId]}
                  />
                </div>

                <div className="space-y-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                      <Video className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {selectedVideo?.title || selectedVideo?.originalFileName}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {selectedVideo?.description || "No description available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                  <PlayCircle className="relative w-20 h-20 mb-4 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
                </div>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Ready to Start Learning?
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select a lecture from the library to begin
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoLectures;