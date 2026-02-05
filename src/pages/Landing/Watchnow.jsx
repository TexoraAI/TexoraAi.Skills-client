// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import videoService from "../../services/videoService";

// import {
//   Play,
//   Pause,
//   Volume2,
//   Maximize,
//   Sparkles,
//   Sun,
//   Moon,
//   Users,
//   Youtube,
//   Linkedin,
//   MessageCircle,
// } from "lucide-react";

// const colors = {
//   primary: "from-blue-600 to-emerald-600",
//   primarySolid: "bg-blue-600",
//   accent: "from-yellow-400 to-orange-500",
//   muted: "text-gray-600 dark:text-gray-400",
// };

// export default function TexoraAISkills() {
//   const { videoId } = useParams();
//   const navigate = useNavigate();

//   const [dark, setDark] = useState(
//     () => localStorage.getItem("theme") === "dark",
//   );

//   const [allVideos, setAllVideos] = useState([]);
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isPlaying, setIsPlaying] = useState(false);

//   const videoRef = useRef(null);

//   /* ================= THEME ================= */
//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [dark]);

//   /* ================= LOAD FULL COURSE ================= */
//   useEffect(() => {
//     let blobUrl;

//     const loadCourse = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // 🔥 SAME BACKEND API (NO CHANGE)
//         const res = await videoService.getAllVideos();
//         const videos = res.data || [];

//         if (videos.length === 0) {
//           setError("No videos available");
//           return;
//         }

//         setAllVideos(videos);

//         // 🎯 current video by URL or first video
//         const selected =
//           videos.find((v) => String(v.id) === String(videoId)) || videos[0];

//         setCurrentVideo(selected);

//         const blobRes = await videoService.getVideoBlob(
//           selected.storedFileName,
//         );

//         blobUrl = URL.createObjectURL(blobRes.data);
//         setVideoUrl(blobUrl);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load course videos");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCourse();

//     return () => blobUrl && URL.revokeObjectURL(blobUrl);
//   }, [videoId]);

//   /* ================= PLAY / PAUSE ================= */
//   const togglePlay = () => {
//     const v = videoRef.current;
//     if (!v) return;
//     v.paused ? v.play() : v.pause();
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-slate-900 text-black dark:text-white">
//       {/* HEADER */}
//       <header
//         className={`bg-gradient-to-r ${colors.primary} text-white py-4 px-6 shadow-lg`}
//       >
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Sparkles className="w-8 h-8" />
//             <span className="text-2xl font-bold">TexoraAI.skills</span>
//           </div>
//           <button
//             onClick={() => setDark(!dark)}
//             className="w-10 h-10 rounded-full border border-white/40 bg-white/10"
//           >
//             {dark ? <Sun /> : <Moon />}
//           </button>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* VIDEO PLAYER */}
//         <div className="lg:col-span-3">
//           {loading && <p>Loading video...</p>}
//           {error && <p className="text-red-500">{error}</p>}

//           {videoUrl && currentVideo && (
//             <>
//               <h1 className="text-3xl font-bold mb-4">
//                 {currentVideo.title}
//               </h1>

//               <div className="relative bg-black rounded-xl overflow-hidden">
//                 <video
//                   ref={videoRef}
//                   src={videoUrl}
//                   controls
//                   className="w-full h-[420px] object-cover"
//                   onPlay={() => setIsPlaying(true)}
//                   onPause={() => setIsPlaying(false)}
//                 />

//                 <div className="absolute bottom-4 left-4 flex gap-4">
//                   <button
//                     onClick={togglePlay}
//                     className={`${colors.primarySolid} p-2 rounded-full text-white`}
//                   >
//                     {isPlaying ? <Pause /> : <Play />}
//                   </button>
//                   <Volume2 />
//                   <Maximize />
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* PLAYLIST */}
//         <div className="bg-white dark:bg-black rounded-xl shadow p-4">
//           <h3 className="font-bold mb-4">Full Course Content</h3>

//           {allVideos.map((v, i) => (
//             <button
//               key={v.id}
//               onClick={() => navigate(`/course/${v.id}`)}
//               className={`w-full text-left p-3 rounded-lg mb-2 transition
//                 ${
//                   currentVideo?.id === v.id
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-100 dark:hover:bg-gray-800"
//                 }`}
//             >
//               {i + 1}. {v.title}
//             </button>
//           ))}

//           <div className="flex items-center gap-2 mt-4 text-sm">
//             <Users className="w-4 h-4" />
//             <span>{allVideos.length * 50}+ learners</span>
//           </div>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="py-8 text-center text-sm text-gray-400">
//         © {new Date().getFullYear()} TexoraAI.skills
//       </footer>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import videoService from "../../services/videoService";
import {
  PlayCircle,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Sun,
  Moon,
  Youtube,
  Linkedin,
  MessageCircle,
  Share2,
  Check,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";

const colors = {
  primary: "from-blue-600 to-emerald-600",
  primarySolid: "bg-blue-600",
  accent: "from-yellow-400 to-orange-500",
  muted: "text-gray-600 dark:text-gray-400",
  surface: "bg-white dark:bg-black",
};

export default function TexoraAISkills() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [settingsView, setSettingsView] = useState("main");
  const [quality, setQuality] = useState("720p");
  const [captions, setCaptions] = useState("off");
  const [lockScreen, setLockScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Backend state
  const [allVideos, setAllVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  const shareUrl = `${window.location.origin}${window.location.pathname}${videoId ? `/${videoId}` : ""}`;

  /* ================= THEME ================= */
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  /* ================= LOAD FULL COURSE FROM BACKEND ================= */
  useEffect(() => {
    let blobUrl;

    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all videos from backend
        const res = await videoService.getAllVideos();
        const videos = res.data || [];

        if (videos.length === 0) {
          setError("No videos available");
          return;
        }

        setAllVideos(videos);

        // Select current video by URL parameter or first video
        const selected =
          videos.find((v) => String(v.id) === String(videoId)) || videos[0];

        setCurrentVideo(selected);

        // Fetch video blob from backend
        const blobRes = await videoService.getVideoBlob(
          selected.storedFileName,
        );

        blobUrl = URL.createObjectURL(blobRes.data);
        setVideoUrl(blobUrl);
      } catch (err) {
        console.error(err);
        setError("Failed to load course videos");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [videoId]);

  /* ================= VIDEO PROGRESS TRACKING ================= */
  useEffect(() => {
    let interval;
    if (isPlaying && videoRef.current) {
      interval = setInterval(() => {
        const video = videoRef.current;
        if (video && video.duration) {
          const currentProgress = (video.currentTime / video.duration) * 100;
          setProgress(currentProgress);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ================= HANDLE VIDEO TIME UPDATE ================= */
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
    }
  };

  /* ================= HANDLE FULLSCREEN CHANGE ================= */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ),
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  /* ================= TOGGLE FULLSCREEN ================= */
  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return;

    try {
      if (!isFullscreen) {
        if (videoContainerRef.current.requestFullscreen) {
          await videoContainerRef.current.requestFullscreen();
        } else if (videoContainerRef.current.webkitRequestFullscreen) {
          await videoContainerRef.current.webkitRequestFullscreen();
        } else if (videoContainerRef.current.mozRequestFullScreen) {
          await videoContainerRef.current.mozRequestFullScreen();
        } else if (videoContainerRef.current.msRequestFullscreen) {
          await videoContainerRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  /* ================= TOGGLE PLAY/PAUSE ================= */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  /* ================= SHARE HANDLERS ================= */
  const handleShare = async () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  /* ================= FORMAT TIME ================= */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentTime = () => {
    if (videoRef.current && videoRef.current.duration) {
      return formatTime(videoRef.current.currentTime);
    }
    return "0:00";
  };

  const getTotalTime = () => {
    if (videoRef.current && videoRef.current.duration) {
      return formatTime(videoRef.current.duration);
    }
    return "0:00";
  };

  /* ================= VOLUME CONTROL ================= */
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  /* ================= PLAYBACK SPEED ================= */
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setSettingsView("main");
  };

  /* ================= PROGRESS BAR CLICK ================= */
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);

    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime =
        (percentage / 100) * videoRef.current.duration;
    }
  };

  /* ================= SKIP CONTROLS ================= */
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10,
      );
    }
  };

  const skipForward = () => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10,
      );
    }
  };

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualityOptions = [
    { value: "2160p", label: "4K (2160p)" },
    { value: "1440p", label: "1440p" },
    { value: "1080p", label: "1080p" },
    { value: "720p", label: "720p" },
    { value: "480p", label: "480p" },
    { value: "360p", label: "360p" },
    { value: "240p", label: "240p" },
    { value: "144p", label: "144p" },
  ];

  const captionOptions = [
    { value: "off", label: "Off" },
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "es", label: "Spanish" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-slate-900 text-black dark:text-white">
      {/* Header */}
      <header
        className={`bg-gradient-to-r ${colors.primary} text-white py-4 px-6 shadow-lg`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <span className="text-2xl font-bold">TexoraAI.skills</span>
          </div>
          <nav className="flex gap-4 items-center">
            <button
              onClick={() => setDark(!dark)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 bg-white/10 hover:bg-white/20 transition"
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Sub Navigation */}
      <div
        className={`bg-gradient-to-r ${colors.primary} text-white py-4 px-6 border-t border-white/20`}
      ></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div
          className={`mb-4 flex items-center gap-2 text-sm ${colors.muted} font-semibold`}
        >
          <span
            className={`bg-gradient-to-r ${colors.accent} text-transparent bg-clip-text`}
          >
            ⚡
          </span>
          <span
            className={`bg-gradient-to-r ${colors.accent} text-transparent bg-clip-text`}
          >
            Featured Course
          </span>
        </div>

        <h1
          className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text mb-4`}
        >
          {currentVideo
            ? currentVideo.title
            : "System Design for Velocity Coders"}
        </h1>

        <p className={`text-lg ${colors.muted} mb-8`}>
          Hosted by{" "}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Arjay McCandless
          </span>
        </p>

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg">Loading video...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        )}

        {/* Video Section - YouTube-like Player */}
        {videoUrl && currentVideo && (
          <div
            ref={videoContainerRef}
            className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-600/20 ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
            }`}
          >
            <div className="aspect-video relative group">
              {/* Actual Video Element */}
              <video
                ref={videoRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
              />

              {/* Demo overlay - only show when video is not playing or loading */}
              {(!videoUrl || !isPlaying) && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-950 flex">
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="text-white text-left px-12 max-w-4xl">
                      <h2
                        className={`text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r ${colors.accent} text-transparent bg-clip-text`}
                      >
                        You will learn my best practices for:
                      </h2>
                      <div className="space-y-4 text-xl md:text-2xl">
                        <div className="hover:translate-x-2 transition-transform">
                          <span
                            className={`bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text font-bold`}
                          >
                            1.
                          </span>{" "}
                          Designing Systems with AI
                        </div>
                        <div className="hover:translate-x-2 transition-transform">
                          <span
                            className={`bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text font-bold`}
                          >
                            2.
                          </span>{" "}
                          Avoiding common pitfalls
                        </div>
                        <div className="hover:translate-x-2 transition-transform">
                          <span
                            className={`bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text font-bold`}
                          >
                            3.
                          </span>{" "}
                          Good tools / frameworks to consider
                        </div>
                        <div className="hover:translate-x-2 transition-transform">
                          <span
                            className={`bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text font-bold`}
                          >
                            4.
                          </span>{" "}
                          Not comprehensive
                        </div>
                      </div>
                    </div>

                    {/* Center Play Button Overlay */}
                    {!isPlaying && (
                      <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all"
                      >
                        <div className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                          <Play
                            className="w-10 h-10 text-white ml-1"
                            fill="white"
                          />
                        </div>
                      </button>
                    )}
                  </div>

                  <div
                    className={`absolute top-4 right-4 w-32 h-32 bg-gradient-to-br ${colors.primary} rounded-lg overflow-hidden border-2 border-yellow-400 shadow-lg`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <span className="text-xs text-gray-300 font-semibold">
                        Instructor Live
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* YouTube-like Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div
                    className="h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
                    onClick={handleProgressClick}
                  >
                    <div
                      className={`h-full bg-red-600 rounded-full relative`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>

                  {/* Skip buttons */}
                  <button
                    onClick={skipBackward}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={skipForward}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100"
                    />
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-white text-sm font-mono">
                    <span>{getCurrentTime()}</span>
                    <span>/</span>
                    <span>{getTotalTime()}</span>
                  </div>

                  <div className="flex-1"></div>

                  {/* Settings Menu */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(!showSettingsMenu);
                        setSettingsView("main");
                      }}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      <Settings className="w-5 h-5" />
                    </button>

                    {showSettingsMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 py-2 min-w-[280px] max-h-[400px] overflow-y-auto">
                        {/* Main Settings Menu */}
                        {settingsView === "main" && (
                          <div>
                            {/* Quality Option */}
                            <button
                              onClick={() => setSettingsView("quality")}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-white font-medium">
                                    Quality
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    Auto ({quality})
                                  </div>
                                </div>
                              </div>
                              <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>

                            {/* Playback Speed Option */}
                            <button
                              onClick={() => setSettingsView("speed")}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-white font-medium">
                                    Playback speed
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {playbackSpeed === 1
                                      ? "Normal"
                                      : `${playbackSpeed}x`}
                                  </div>
                                </div>
                              </div>
                              <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>

                            {/* Captions Option */}
                            <button
                              onClick={() => {
                                setCaptions(captions === "off" ? "en" : "off");
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-white font-medium">
                                    Captions
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {captions === "off"
                                      ? "Unavailable"
                                      : captionOptions.find(
                                          (c) => c.value === captions,
                                        )?.label}
                                  </div>
                                </div>
                              </div>
                            </button>

                            {/* Lock Screen Option */}
                            <button
                              onClick={() => setLockScreen(!lockScreen)}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                </div>
                                <div className="text-white font-medium">
                                  Lock screen
                                </div>
                              </div>
                              {lockScreen && (
                                <svg
                                  className="w-5 h-5 text-blue-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                            </button>

                            {/* More Option */}
                            <button
                              onClick={() => setSettingsView("more")}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                  </svg>
                                </div>
                                <div className="text-white font-medium">
                                  More
                                </div>
                              </div>
                              <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* Quality Submenu */}
                        {settingsView === "quality" && (
                          <div>
                            <button
                              onClick={() => setSettingsView("main")}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
                            >
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              <span className="text-white font-medium">
                                Quality
                              </span>
                            </button>
                            <button
                              onClick={() => setQuality("auto")}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
                            >
                              <span className="text-white">Auto (720p)</span>
                              {quality === "auto" && (
                                <svg
                                  className="w-5 h-5 text-blue-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                            </button>
                            {qualityOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => setQuality(option.value)}
                                className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
                              >
                                <span className="text-white">
                                  {option.label}
                                </span>
                                {quality === option.value && (
                                  <svg
                                    className="w-5 h-5 text-blue-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Playback Speed Submenu */}
                        {settingsView === "speed" && (
                          <div>
                            <button
                              onClick={() => setSettingsView("main")}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
                            >
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              <span className="text-white font-medium">
                                Playback speed
                              </span>
                            </button>
                            {speedOptions.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
                              >
                                <span className="text-white">
                                  {speed === 1 ? "Normal" : `${speed}x`}
                                </span>
                                {speed === playbackSpeed && (
                                  <svg
                                    className="w-5 h-5 text-blue-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* More Submenu */}
                        {settingsView === "more" && (
                          <div>
                            <button
                              onClick={() => setSettingsView("main")}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
                            >
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              <span className="text-white font-medium">
                                More
                              </span>
                            </button>
                            <button className="w-full px-4 py-3 text-left hover:bg-white/10">
                              <span className="text-white">
                                Report playback issue
                              </span>
                            </button>
                            <button className="w-full px-4 py-3 text-left hover:bg-white/10">
                              <span className="text-white">
                                Stats for nerds
                              </span>
                            </button>
                            <button className="w-full px-4 py-3 text-left hover:bg-white/10">
                              <span className="text-white">Help</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Info & Actions */}
        {currentVideo && (
          <div className="mt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {currentVideo.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{allVideos.length * 50}+ learners</span>
                  <span>•</span>
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleShare}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.primarySolid} hover:bg-blue-700 text-white transition-all font-semibold`}
                >
                  <Share2 className="w-5 h-5" />
                  <span>SHARE</span>
                </button>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="mt-6 flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${colors.primary} rounded-full flex-shrink-0`}
              ></div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                  Arjay McCandless
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Software Engineer & Instructor
                </p>
              </div>
            </div>

            {/* Course Description */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Learn essential system design principles tailored for developers
                who need to move fast. This course covers practical patterns,
                scalability considerations, and real-world trade-offs that will
                help you design better systems from day one.
              </p>
              <button className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Show more
              </button>
            </div>
          </div>
        )}

        {/* Additional Course Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-12">
          <div
            className={`${colors.surface} p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800`}
          >
            <h3
              className={`text-2xl font-bold mb-4 bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text`}
            >
              What you&apos;ll learn
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-200">
              <div className="flex items-start gap-3 hover:translate-x-2 transition-transform">
                <span
                  className={`bg-gradient-to-r ${colors.accent} text-white font-bold text-lg p-1 rounded`}
                >
                  ✓
                </span>
                <div>
                  <p className="font-semibold">Designing Systems with AI</p>
                  <p className={`text-sm ${colors.muted}`}>
                    Leverage AI tools and patterns for system architecture
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 hover:translate-x-2 transition-transform">
                <span
                  className={`bg-gradient-to-r ${colors.accent} text-white font-bold text-lg p-1 rounded`}
                >
                  ✓
                </span>
                <div>
                  <p className="font-semibold">Avoiding Common Pitfalls</p>
                  <p className={`text-sm ${colors.muted}`}>
                    Learn from mistakes others have made in system design
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 hover:translate-x-2 transition-transform">
                <span
                  className={`bg-gradient-to-r ${colors.accent} text-white font-bold text-lg p-1 rounded`}
                >
                  ✓
                </span>
                <div>
                  <p className="font-semibold">Tools & Frameworks</p>
                  <p className={`text-sm ${colors.muted}`}>
                    Discover the best tools and frameworks to consider
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 hover:translate-x-2 transition-transform">
                <span
                  className={`bg-gradient-to-r ${colors.accent} text-white font-bold text-lg p-1 rounded`}
                >
                  ✓
                </span>
                <div>
                  <p className="font-semibold">Practical Approach</p>
                  <p className={`text-sm ${colors.muted}`}>
                    Quick, actionable insights - not comprehensive theory
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${colors.surface} p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800`}
          >
            <h3
              className={`text-2xl font-bold mb-6 bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text`}
            >
              About the Instructor
            </h3>
            <div className="flex items-start gap-6">
              <div
                className={`w-24 h-24 bg-gradient-to-br ${colors.primary} rounded-full flex-shrink-0 shadow-lg`}
              ></div>
              <div>
                <h4 className="text-xl font-bold mb-2">Arjay McCandless</h4>
                <p className={`${colors.muted} mb-4`}>
                  Software Engineer with extensive experience in building and
                  scaling systems. Passionate about sharing practical knowledge
                  and helping developers write better code faster.
                </p>
                <div className={`flex gap-4 text-sm ${colors.muted} flex-wrap`}>
                  <span
                    className={`bg-gradient-to-r ${colors.primary} text-white px-3 py-1 rounded-full font-semibold`}
                  >
                    10+ years experience
                  </span>
                  <span
                    className={`bg-gradient-to-r ${colors.accent} text-white px-3 py-1 rounded-full font-semibold`}
                  >
                    {allVideos.length * 50}+ students
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className={`${colors.surface} rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Share this lesson
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Share this link with your friends:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-3 ${
                    copied
                      ? "bg-green-600 hover:bg-green-700"
                      : `${colors.primarySolid} hover:bg-blue-700`
                  } text-white rounded-lg font-semibold transition-all flex items-center gap-2`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    "Copy"
                  )}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Or share via:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl,
                  )}&text=Check out this course on TexoraAI.skills!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">𝕏</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Twitter
                  </span>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <Linkedin className="w-10 h-10 text-blue-700" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    LinkedIn
                  </span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=Check out this course: ${encodeURIComponent(
                    shareUrl,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <MessageCircle className="w-10 h-10 text-green-600" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 dark:from-blue-900 dark:via-emerald-900 dark:to-teal-900 border-t border-blue-500/30 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent mb-4">
              TexoraAi.skills
            </p>
            <p className="text-blue-100 dark:text-blue-200 text-sm">
              Modern learning platform for ambitious professionals who want to
              break into product, design and growth roles.
            </p>
          </div>

          <div className="text-blue-100 dark:text-blue-200 text-sm space-y-3">
            <p className="font-semibold text-white mb-2">Contact</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-xs">✉</span>
              </div>
              <a
                href="mailto:support@texoraai.skills"
                className="hover:text-white transition"
              >
                support@texoraai.skills
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-xs">📍</span>
              </div>
              <span>Skalholtsgatan 2, Kista, Stockholm, Sweden - 164 40</span>
            </div>
          </div>

          <div className="text-blue-100 dark:text-blue-200">
            <p className="font-semibold text-white mb-4">Connect</p>
            <div className="flex gap-3 mb-4">
              <a
                href="https://www.youtube.com/@Texoraai"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <Youtube size={20} className="text-white" />
              </a>
              <a
                href="https://www.linkedin.com/company/105596104"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <Linkedin size={20} className="text-white" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=919210970334"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <MessageCircle size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-blue-200 dark:text-blue-300 text-sm">
            {new Date().getFullYear()} TexoraAi.skills. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
