// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import videoService from "../../services/videoService";
// import {
//   PlayCircle,
//   Users,
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize,
//   Minimize,
//   Sparkles,
//   Sun,
//   Moon,
//   Share2,
//   Check,
//   SkipBack,
//   SkipForward,
//   Settings,
//   Instagram,
//   Twitter,
//   Youtube,
//   Linkedin,
//   MessageCircle,
//   ChevronDown,
//   Menu,
//   GraduationCap,
//   BarChart3,
//   FileText,
//   User,
//   LogOut,
// } from "lucide-react";

// const colors = {
//   muted: "text-gray-600 dark:text-gray-300",
//   surface: "bg-white dark:bg-gray-900",
// };

// const API_GATEWAY =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

//   // ─────────────────────────────────────────────────────────────────────────────
//   // FooterNewsletter
//   // CHANGED: Removed "Contact support: marketing@texora.ai" placeholder text from contact line.
//   //          Now shows: Contact support: marketing@texora.ai
//   // ─────────────────────────────────────────────────────────────────────────────
//   function FooterNewsletter() {
//     const [email, setEmail]   = useState("");
//     const [status, setStatus] = useState("idle");
   
//     const isValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
   
//     const handleSubmit = async () => {
//       const trimmed = email.trim().toLowerCase();
//       if (!isValid(trimmed)) {
//         setStatus("error");
//         setTimeout(() => setStatus("idle"), 2500);
//         return;
//       }
//       setStatus("loading");
//       try {
//         const { ok, status: httpStatus } = await subscribeNewsletter(trimmed);
//         if (httpStatus === 409) { setStatus("duplicate"); setTimeout(() => setStatus("idle"), 3000); return; }
//         if (ok) { setStatus("success"); setEmail(""); setTimeout(() => setStatus("idle"), 3500); }
//         else    { setStatus("apierror"); setTimeout(() => setStatus("idle"), 3000); }
//       } catch {
//         setStatus("apierror");
//         setTimeout(() => setStatus("idle"), 3000);
//       }
//     };
   
//     const statusMsg = {
//       success:  { text: "✓ You're subscribed!",            color: "#22c55e" },
//       error:    { text: "Enter a valid email.",             color: "#f87171" },
//       duplicate:{ text: "Already subscribed.",              color: "#fb923c" },
//       apierror: { text: "Something went wrong. Try again.", color: "#f87171" },
//     }[status];
   
//     return (
//       <div className="flex flex-col gap-1">
//         <h4 className="text-sm md:text-base font-bold tracking-wide text-[#1E293B] leading-snug">
//           Be the first to know
//         </h4>
//         <div
//           style={{
//             display: "flex",
//             background: status === "error" ? "rgba(248,113,113,0.06)" : "#f8fafc",
//             borderRadius: "8px",
//             border: status === "error"   ? "1.5px solid #f87171"
//                   : status === "success" ? "1.5px solid #22c55e"
//                   : "1.5px solid #e2e8f0",
//             overflow: "hidden",
//             transition: "border-color 0.2s",
//           }}
//         >
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//             placeholder="Contact support: marketing@texora.ai"
//             disabled={status === "loading" || status === "success"}
//             style={{
//               flex: 1, background: "transparent", border: "none", outline: "none",
//               color: "#1E293B", fontSize: "13px", padding: "9px 12px", minWidth: 0,
//             }}
//           />
//           <button
//             onClick={handleSubmit}
//             disabled={status === "loading" || status === "success"}
//             style={{
//               background: status === "success" ? "#22c55e" : "#1E293B",
//               border: "none", cursor: "pointer", padding: "0 14px",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               minWidth: "42px", transition: "background 0.2s", flexShrink: 0,
//             }}
//             onMouseEnter={e => { if (status !== "success") e.currentTarget.style.background = "#F97316"; }}
//             onMouseLeave={e => { if (status !== "success") e.currentTarget.style.background = "#1E293B"; }}
//           >
//             {status === "loading" ? (
//               <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                 <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
//                 <path d="M10 2a8 8 0 0 1 8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
//                   <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="0.7s" repeatCount="indefinite"/>
//                 </path>
//               </svg>
//             ) : status === "success" ? (
//               <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                 <path d="M4 10l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             ) : (
//               <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                 <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             )}
//           </button>
//         </div>
   
//         {statusMsg && (
//           <p style={{ fontSize: "12px", color: statusMsg.color, margin: "-8px 0 0" }}>
//             {statusMsg.text}
//           </p>
//         )}
   
//         {/* CHANGED: removed "your@email.com" — now just shows the support email link */}
        
   
//         <div>
//           <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
//             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//             Status: Live
//           </span>
//         </div>
//       </div>
//     );
//   }

// export default function TexoraAISkills() {
//   const { videoId } = useParams();
//   const navigate = useNavigate();

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [dark, setDark] = useState(
//     () => localStorage.getItem("theme") === "dark",
//   );
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(100);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [showSettingsMenu, setShowSettingsMenu] = useState(false);
//   const [settingsView, setSettingsView] = useState("main");
//   const [quality, setQuality] = useState("720p");
//   const [captions, setCaptions] = useState("off");
//   const [lockScreen, setLockScreen] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const [allCourses, setAllCourses] = useState([]);
//   const [currentCourse, setCurrentCourse] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const videoContainerRef = useRef(null);
//   const videoRef = useRef(null);

//   const shareUrl = `${window.location.origin}${window.location.pathname}${videoId ? `/${videoId}` : ""}`;

//   // ── Theme ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [dark]);

//   // ── Load Courses from /upload-course/all ──────────────────────
//   useEffect(() => {
//     let blobUrl;

//     const loadCourse = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // ✅ NEW: fetch from the correct endpoint
//         const res = await videoService.getAllAdminCourses();
//         const courses = res.data || [];

//         if (courses.length === 0) {
//           setError("No courses available yet.");
//           return;
//         }

//         setAllCourses(courses);

//         // Pick by id param or default to first
//         const selected =
//           courses.find((c) => String(c.id) === String(videoId)) || courses[0];
//         setCurrentCourse(selected);

//         // ✅ NEW: stream using fileName via /upload-course/stream/{fileName}
//         if (selected.fileName) {
//           const streamUrl = `${API_GATEWAY}/upload-course/stream/${encodeURIComponent(selected.fileName)}`;
//           setVideoUrl(streamUrl);
//         } else if (selected.videoUrl) {
//           // fallback: if admin provided a URL instead of uploading a file
//           setVideoUrl(selected.videoUrl);
//         } else {
//           setError("No video source found for this course.");
//         }
//       } catch (err) {
//         console.error("Course load error:", err);
//         setError("Failed to load course. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCourse();

//     return () => {
//       // only revoke if it was a blob URL
//       if (blobUrl) URL.revokeObjectURL(blobUrl);
//     };
//   }, [videoId]);

//   // ── Progress polling ──────────────────────────────────────────
//   useEffect(() => {
//     let interval;
//     if (isPlaying && videoRef.current) {
//       interval = setInterval(() => {
//         const video = videoRef.current;
//         if (video && video.duration)
//           setProgress((video.currentTime / video.duration) * 100);
//       }, 100);
//     }
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   const handleTimeUpdate = () => {
//     const video = videoRef.current;
//     if (video && video.duration)
//       setProgress((video.currentTime / video.duration) * 100);
//   };

//   // ── Fullscreen listeners ──────────────────────────────────────
//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(
//         !!(
//           document.fullscreenElement ||
//           document.webkitFullscreenElement ||
//           document.mozFullScreenElement ||
//           document.msFullscreenElement
//         ),
//       );
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
//     document.addEventListener("mozfullscreenchange", handleFullscreenChange);
//     document.addEventListener("MSFullscreenChange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//       document.removeEventListener(
//         "webkitfullscreenchange",
//         handleFullscreenChange,
//       );
//       document.removeEventListener(
//         "mozfullscreenchange",
//         handleFullscreenChange,
//       );
//       document.removeEventListener(
//         "MSFullscreenChange",
//         handleFullscreenChange,
//       );
//     };
//   }, []);

//   // ── Controls ──────────────────────────────────────────────────
//   const toggleFullscreen = async () => {
//     if (!videoContainerRef.current) return;
//     try {
//       if (!isFullscreen) {
//         if (videoContainerRef.current.requestFullscreen)
//           await videoContainerRef.current.requestFullscreen();
//         else if (videoContainerRef.current.webkitRequestFullscreen)
//           await videoContainerRef.current.webkitRequestFullscreen();
//         else if (videoContainerRef.current.mozRequestFullScreen)
//           await videoContainerRef.current.mozRequestFullScreen();
//         else if (videoContainerRef.current.msRequestFullscreen)
//           await videoContainerRef.current.msRequestFullscreen();
//       } else {
//         if (document.exitFullscreen) await document.exitFullscreen();
//         else if (document.webkitExitFullscreen)
//           await document.webkitExitFullscreen();
//         else if (document.mozCancelFullScreen)
//           await document.mozCancelFullScreen();
//         else if (document.msExitFullscreen) await document.msExitFullscreen();
//       }
//     } catch (error) {
//       console.error("Error toggling fullscreen:", error);
//     }
//   };

//   const togglePlay = () => {
//     const v = videoRef.current;
//     if (!v) return;
//     if (v.paused) {
//       v.play();
//       setIsPlaying(true);
//     } else {
//       v.pause();
//       setIsPlaying(false);
//     }
//   };

//   const handleShare = async () => {
//     setShowShareModal(true);
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getCurrentTime = () =>
//     videoRef.current?.duration
//       ? formatTime(videoRef.current.currentTime)
//       : "0:00";
//   const getTotalTime = () =>
//     videoRef.current?.duration ? formatTime(videoRef.current.duration) : "0:00";

//   const handleVolumeChange = (e) => {
//     const newVolume = parseInt(e.target.value);
//     setVolume(newVolume);
//     setIsMuted(false);
//     if (videoRef.current) videoRef.current.volume = newVolume / 100;
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     if (videoRef.current) videoRef.current.muted = !isMuted;
//   };

//   const handleSpeedChange = (speed) => {
//     setPlaybackSpeed(speed);
//     if (videoRef.current) videoRef.current.playbackRate = speed;
//     setSettingsView("main");
//   };

//   const handleProgressClick = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const percentage = ((e.clientX - rect.left) / rect.width) * 100;
//     setProgress(percentage);
//     if (videoRef.current?.duration)
//       videoRef.current.currentTime =
//         (percentage / 100) * videoRef.current.duration;
//   };

//   const skipBackward = () => {
//     if (videoRef.current)
//       videoRef.current.currentTime = Math.max(
//         0,
//         videoRef.current.currentTime - 10,
//       );
//   };
//   const skipForward = () => {
//     if (videoRef.current?.duration)
//       videoRef.current.currentTime = Math.min(
//         videoRef.current.duration,
//         videoRef.current.currentTime + 10,
//       );
//   };

//   const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
//   const qualityOptions = [
//     { value: "2160p", label: "4K (2160p)" },
//     { value: "1440p", label: "1440p" },
//     { value: "1080p", label: "1080p" },
//     { value: "720p", label: "720p" },
//     { value: "480p", label: "480p" },
//     { value: "360p", label: "360p" },
//     { value: "240p", label: "240p" },
//     { value: "144p", label: "144p" },
//   ];
//   const captionOptions = [
//     { value: "off", label: "Off" },
//     { value: "en", label: "English" },
//     { value: "hi", label: "Hindi" },
//     { value: "es", label: "Spanish" },
//   ];

//   // ── Helpers for display ───────────────────────────────────────
//   const displayTitle =
//     currentCourse?.title || "System Design for Velocity Coders";
//   const displayInstructor = currentCourse?.instructorName || "Arjay McCandless";
//   const displayRole =
//     currentCourse?.instructorRole || "Software Engineer & Instructor";
//   const displayExperience = currentCourse?.experience || "10+ years experience";
//   const displayStudents =
//     currentCourse?.studentCount || `${allCourses.length * 50}+ students`;
//   const displayLearners =
//     currentCourse?.learnersCount != null
//       ? `${currentCourse.learnersCount}+ learners`
//       : `${allCourses.length * 50}+ learners`;
//   const displayDate = currentCourse?.publishDate
//     ? new Date(currentCourse.publishDate).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       })
//     : new Date().toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//   const displayDescription =
//     currentCourse?.description ||
//     "Learn essential system design principles tailored for developers who need to move fast. This course covers practical patterns, scalability considerations, and real-world trade-offs that will help you design better systems from day one.";

//   // learnPoints is stored as JSON string in DB
//   let learnPoints = [];
//   try {
//     learnPoints =
//       typeof currentCourse?.learnPoints === "string"
//         ? JSON.parse(currentCourse.learnPoints)
//         : currentCourse?.learnPoints || [];
//   } catch {
//     learnPoints = [];
//   }
//   if (!learnPoints.length) {
//     learnPoints = [
//       {
//         title: "Designing Systems with AI",
//         desc: "Leverage AI tools and patterns for system architecture",
//       },
//       {
//         title: "Avoiding Common Pitfalls",
//         desc: "Learn from mistakes others have made in system design",
//       },
//       {
//         title: "Tools & Frameworks",
//         desc: "Discover the best tools and frameworks to consider",
//       },
//       {
//         title: "Practical Approach",
//         desc: "Quick, actionable insights - not comprehensive theory",
//       },
//     ];
//   }

//   // initials for avatar
//   const initials = displayInstructor
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   // thumbnail URL
//   const thumbnailUrl = currentCourse?.thumbnail
//     ? `${API_GATEWAY}/upload-course/stream/${encodeURIComponent(currentCourse.thumbnail)}`
//     : null;

//   return (
//     <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
//       {/* Header */}
// <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#F97316]/20 dark:border-gray-800">
//   <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

//     {/* ✅ Added Home Navigation on ILM ORA Click */}
//     <div
//       className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
//       onClick={() => navigate("/")}
//     >
//       <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md">
//         <Sparkles className="w-6 h-6 text-white" />
//       </div>

//       <span className="text-2xl sm:text-3xl md:text-2xl font-extrabold tracking-wide font-serif whitespace-nowrap">
//         <span className="text-green-600">ILM</span>
//         <span className="text-[#F97316] ml-1 sm:ml-2">ORA</span>
//       </span>
//     </div>

//     <nav className="flex gap-4 items-center">
//       <button
//         onClick={() => setDark(!dark)}
//         className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm"
//         aria-label="Toggle theme"
//       >
//         {dark ? (
//           <Sun className="w-5 h-5 text-[#F97316]" />
//         ) : (
//           <Moon className="w-5 h-5 text-[#1E293B]" />
//         )}
//       </button>
//     </nav>

//   </div>
// </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
//           <span className="text-[#F97316]">⚡</span>
//           <span className="text-[#F97316]">
//             {currentCourse?.featuredTag || "Featured Course"}
//           </span>
//         </div>

//         <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white mb-4">
//           {displayTitle}
//         </h1>

//         <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
//           Hosted by{" "}
//           <span className="font-semibold text-[#1E293B] dark:text-white">
//             {currentCourse?.hostedBy || displayInstructor}
//           </span>
//         </p>

//         {/* Loading / Error states */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="inline-flex items-center gap-3 text-lg text-gray-600 dark:text-gray-300">
//               <svg
//                 className="animate-spin w-6 h-6 text-[#F97316]"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8z"
//                 />
//               </svg>
//               Loading course...
//             </div>
//           </div>
//         )}
//         {error && (
//           <div className="text-center py-12">
//             <p className="text-red-500 text-lg">{error}</p>
//           </div>
//         )}

//         {/* ── Video Player ── */}
//         {!loading && videoUrl && currentCourse && (
//           <div
//             ref={videoContainerRef}
//             className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F97316]/20 ${
//               isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
//             }`}
//           >
//             <div className="aspect-video relative group">
//               <video
//                 ref={videoRef}
//                 src={videoUrl}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//                 onTimeUpdate={handleTimeUpdate}
//               />

//               {!isPlaying && (
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-950 flex">
//                   <div className="flex-1 flex items-center justify-center relative">
//                     <div className="text-white text-left px-12 max-w-4xl">
//                       <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#F97316]">
//                         You will learn my best practices for:
//                       </h2>
//                       <div className="space-y-4 text-xl md:text-2xl">
//                         {learnPoints.slice(0, 4).map((item, i) => (
//                           <div
//                             key={i}
//                             className="hover:translate-x-2 transition-transform"
//                           >
//                             <span className="text-[#F97316] font-bold">
//                               {i + 1}.
//                             </span>{" "}
//                             {item.title}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <button
//                       onClick={togglePlay}
//                       className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all"
//                     >
//                       <div className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
//                         <Play
//                           className="w-10 h-10 text-white ml-1"
//                           fill="white"
//                         />
//                       </div>
//                     </button>
//                   </div>

//                   {/* Instructor Live Badge */}
//                   {currentCourse.showInstructorLive !== false &&
//                     currentCourse.showInstructorLive !== "false" && (
//                       <div className="absolute top-4 right-4 w-32 h-32 bg-[#1E293B] rounded-lg overflow-hidden border-2 border-[#F97316] shadow-lg">
//                         {thumbnailUrl ? (
//                           <img
//                             src={thumbnailUrl}
//                             alt="thumbnail"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
//                             <span className="text-xs text-gray-300 font-semibold">
//                               Instructor Live
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                 </div>
//               )}

//               {/* Controls */}
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <div className="mb-3">
//                   <div
//                     className="h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
//                     onClick={handleProgressClick}
//                   >
//                     <div
//                       className="h-full bg-red-600 rounded-full relative"
//                       style={{ width: `${progress}%` }}
//                     >
//                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100"></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={togglePlay}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     {isPlaying ? (
//                       <Pause className="w-6 h-6" />
//                     ) : (
//                       <Play className="w-6 h-6" />
//                     )}
//                   </button>
//                   <button
//                     onClick={skipBackward}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     <SkipBack className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={skipForward}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     <SkipForward className="w-5 h-5" />
//                   </button>
//                   <div className="flex items-center gap-2 group/volume">
//                     <button
//                       onClick={toggleMute}
//                       className="text-white hover:scale-110 transition-transform"
//                     >
//                       {isMuted || volume === 0 ? (
//                         <VolumeX className="w-5 h-5" />
//                       ) : (
//                         <Volume2 className="w-5 h-5" />
//                       )}
//                     </button>
//                     <input
//                       type="range"
//                       min="0"
//                       max="100"
//                       value={isMuted ? 0 : volume}
//                       onChange={handleVolumeChange}
//                       className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2 text-white text-sm font-mono">
//                     <span>{getCurrentTime()}</span>
//                     <span>/</span>
//                     <span>{getTotalTime()}</span>
//                   </div>
//                   <div className="flex-1"></div>

//                   {/* Settings */}
//                   <div className="relative">
//                     <button
//                       onClick={() => {
//                         setShowSettingsMenu(!showSettingsMenu);
//                         setSettingsView("main");
//                       }}
//                       className="text-white hover:scale-110 transition-transform"
//                     >
//                       <Settings className="w-5 h-5" />
//                     </button>
//                     {showSettingsMenu && (
//                       <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 py-2 min-w-[280px] max-h-[400px] overflow-y-auto">
//                         {settingsView === "main" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("quality")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div>
//                                   <div className="text-white font-medium">
//                                     Quality
//                                   </div>
//                                   <div className="text-gray-400 text-xs">
//                                     Auto ({quality})
//                                   </div>
//                                 </div>
//                               </div>
//                               <svg
//                                 className="w-5 h-5 text-gray-400 group-hover:text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 5l7 7-7 7"
//                                 />
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() => setSettingsView("speed")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div>
//                                   <div className="text-white font-medium">
//                                     Playback speed
//                                   </div>
//                                   <div className="text-gray-400 text-xs">
//                                     {playbackSpeed === 1
//                                       ? "Normal"
//                                       : `${playbackSpeed}x`}
//                                   </div>
//                                 </div>
//                               </div>
//                               <svg
//                                 className="w-5 h-5 text-gray-400 group-hover:text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 5l7 7-7 7"
//                                 />
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() =>
//                                 setCaptions(captions === "off" ? "en" : "off")
//                               }
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div>
//                                   <div className="text-white font-medium">
//                                     Captions
//                                   </div>
//                                   <div className="text-gray-400 text-xs">
//                                     {captions === "off"
//                                       ? "Unavailable"
//                                       : captionOptions.find(
//                                           (c) => c.value === captions,
//                                         )?.label}
//                                   </div>
//                                 </div>
//                               </div>
//                             </button>
//                             <button
//                               onClick={() => setLockScreen(!lockScreen)}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div className="text-white font-medium">
//                                   Lock screen
//                                 </div>
//                               </div>
//                               {lockScreen && (
//                                 <svg
//                                   className="w-5 h-5 text-blue-400"
//                                   fill="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                 </svg>
//                               )}
//                             </button>
//                             <button
//                               onClick={() => setSettingsView("more")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div className="text-white font-medium">
//                                   More
//                                 </div>
//                               </div>
//                               <svg
//                                 className="w-5 h-5 text-gray-400 group-hover:text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 5l7 7-7 7"
//                                 />
//                               </svg>
//                             </button>
//                           </div>
//                         )}
//                         {settingsView === "quality" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("main")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
//                             >
//                               <svg
//                                 className="w-5 h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 19l-7-7 7-7"
//                                 />
//                               </svg>
//                               <span className="text-white font-medium">
//                                 Quality
//                               </span>
//                             </button>
//                             <button
//                               onClick={() => setQuality("auto")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                             >
//                               <span className="text-white">Auto (720p)</span>
//                               {quality === "auto" && (
//                                 <svg
//                                   className="w-5 h-5 text-blue-400"
//                                   fill="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                 </svg>
//                               )}
//                             </button>
//                             {qualityOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => setQuality(option.value)}
//                                 className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                               >
//                                 <span className="text-white">
//                                   {option.label}
//                                 </span>
//                                 {quality === option.value && (
//                                   <svg
//                                     className="w-5 h-5 text-blue-400"
//                                     fill="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                   </svg>
//                                 )}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                         {settingsView === "speed" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("main")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
//                             >
//                               <svg
//                                 className="w-5 h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 19l-7-7 7-7"
//                                 />
//                               </svg>
//                               <span className="text-white font-medium">
//                                 Playback speed
//                               </span>
//                             </button>
//                             {speedOptions.map((speed) => (
//                               <button
//                                 key={speed}
//                                 onClick={() => handleSpeedChange(speed)}
//                                 className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                               >
//                                 <span className="text-white">
//                                   {speed === 1 ? "Normal" : `${speed}x`}
//                                 </span>
//                                 {speed === playbackSpeed && (
//                                   <svg
//                                     className="w-5 h-5 text-blue-400"
//                                     fill="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                   </svg>
//                                 )}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                         {settingsView === "more" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("main")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
//                             >
//                               <svg
//                                 className="w-5 h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 19l-7-7 7-7"
//                                 />
//                               </svg>
//                               <span className="text-white font-medium">
//                                 More
//                               </span>
//                             </button>
//                             <button className="w-full px-4 py-3 text-left hover:bg-white/10">
//                               <span className="text-white">
//                                 Report playback issue
//                               </span>
//                             </button>
//                             <button className="w-full px-4 py-3 text-left hover:bg-white/10">
//                               <span className="text-white">
//                                 Stats for nerds
//                               </span>
//                             </button>
//                             <button className="w-full px-4 py-3 text-left hover:bg-white/10">
//                               <span className="text-white">Help</span>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     onClick={toggleFullscreen}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     {isFullscreen ? (
//                       <Minimize className="w-5 h-5" />
//                     ) : (
//                       <Maximize className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Video Info */}
//         {!loading && currentCourse && (
//           <div className="mt-6">
//             <div className="flex items-start justify-between gap-4 flex-wrap">
//               <div className="flex-1">
//                 <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">
//                   {displayTitle}
//                 </h3>
//                 <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
//                   <span>{displayLearners}</span>
//                   <span>•</span>
//                   <span>{displayDate}</span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <button
//                   onClick={handleShare}
//                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white transition-all font-semibold shadow-sm"
//                 >
//                   <Share2 className="w-5 h-5" />
//                   <span>SHARE</span>
//                 </button>
//               </div>
//             </div>

//             {/* Instructor chip */}
//             <div className="mt-6 flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
//               <div className="w-12 h-12 bg-[#1E293B] rounded-xl flex-shrink-0 flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">{initials}</span>
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-bold text-[#1E293B] dark:text-white">
//                   {displayInstructor}
//                 </h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   {displayRole}
//                 </p>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
//               <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                 {displayDescription}
//               </p>
//               {currentCourse.showMoreEnabled !== false &&
//                 currentCourse.showMoreEnabled !== "false" && (
//                   <button className="mt-3 text-sm font-semibold text-[#F97316] hover:underline">
//                     Show more
//                   </button>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* Course Info Grid */}
//         {!loading && currentCourse && (
//           <div className="mt-12 grid md:grid-cols-2 gap-10">
//             {/* What You'll Learn */}
//             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
//               <h3 className="text-2xl font-bold mb-6 text-[#1E293B] dark:text-white">
//                 What you&apos;ll learn
//               </h3>
//               <div className="space-y-4 text-[#1E293B] dark:text-gray-200">
//                 {learnPoints.map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex items-start gap-3 hover:translate-x-1 transition-transform"
//                   >
//                     <span className="bg-[#F97316] text-white font-bold text-sm p-1 rounded-lg flex-shrink-0 w-7 h-7 flex items-center justify-center">
//                       ✓
//                     </span>
//                     <div>
//                       <p className="font-semibold text-[#1E293B] dark:text-white">
//                         {item.title}
//                       </p>
//                       {item.desc && (
//                         <p className="text-sm text-gray-600 dark:text-gray-300">
//                           {item.desc}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* About the Instructor */}
//             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
//               <h3 className="text-2xl font-bold mb-6 text-[#1E293B] dark:text-white">
//                 About the Instructor
//               </h3>
//               <div className="flex items-start gap-6">
//                 <div className="w-20 h-20 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex-shrink-0 shadow-md flex items-center justify-center">
//                   <span className="text-white text-xl font-bold">
//                     {initials}
//                   </span>
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-bold mb-2 text-[#1E293B] dark:text-white">
//                     {displayInstructor}
//                   </h4>
//                   <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
//                     {displayRole}
//                   </p>
//                   <div className="flex gap-3 flex-wrap">
//                     <span className="bg-[#1E293B] dark:bg-[#F97316] text-white px-3 py-1 rounded-full font-semibold text-xs">
//                       {displayExperience}
//                     </span>
//                     <span className="bg-[#F97316]/10 dark:bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 px-3 py-1 rounded-full font-semibold text-xs">
//                       {displayStudents}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Share Modal */}
//       {showShareModal && (
//         <div
//           className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowShareModal(false)}
//         >
//           <div
//             className={`${colors.surface} rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                 Share this lesson
//               </h3>
//               <button
//                 onClick={() => setShowShareModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Share this link with your friends:
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={shareUrl}
//                   readOnly
//                   className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm"
//                 />
//                 <button
//                   onClick={copyToClipboard}
//                   className={`px-4 py-3 ${
//                     copied
//                       ? "bg-green-600 hover:bg-green-700"
//                       : "bg-[#1E293B] hover:bg-[#334155]"
//                   } text-white rounded-lg font-semibold transition-all flex items-center gap-2`}
//                 >
//                   {copied ? (
//                     <>
//                       <Check className="w-5 h-5" />
//                       Copied!
//                     </>
//                   ) : (
//                     "Copy"
//                   )}
//                 </button>
//               </div>
//             </div>
//             <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                 Or share via:
//               </p>
//               <div className="grid grid-cols-3 gap-3">
//                 <a
//                   href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this course on TexoraAI.skills!`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
//                 >
//                   <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//                     </svg>
//                   </div>
//                   <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                     Twitter
//                   </span>
//                 </a>
//                 <a
//                   href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
//                 >
//                   <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                     </svg>
//                   </div>
//                   <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                     LinkedIn
//                   </span>
//                 </a>
//                 <a
//                   href={`https://api.whatsapp.com/send?text=Check out this course: ${encodeURIComponent(shareUrl)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
//                 >
//                   <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
//                     </svg>
//                   </div>
//                   <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                     WhatsApp
//                   </span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//            {/* ── Footer ── */}
//            <footer className="bg-white text-[#1E293B]">
//         <div className="max-w-7xl mx-auto px-6 py-20">
//           <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-start">
//             <div className="flex flex-col gap-2.5 self-start text-left sm:col-span-2 lg:col-span-1">
//               <h3 className="text-3xl font-extrabold leading-none">
//                 <span className="text-green-600">ILM</span>{" "}<span className="text-[#F97316]">ORA</span>
//               </h3>
//               <p className="text-sm text-gray-600 leading-relaxed">Modern learning platform for ambitious professionals who want to break into product, design and growth roles.</p>
//               <p className="text-sm text-gray-500">
//                 📧{" "}
//                 <a href="mailto:marketing@texora.ai" className="hover:text-[#F97316] transition-colors">
//                   marketing@texora.ai
//                 </a>
//               </p>
 
              
//               <div className="flex items-center gap-3 pt-1 flex-wrap">
//                 {/* Instagram */}
//                 <a
//                   href="https://www.instagram.com/texoraai"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all"
//                   style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
//                 >
//                   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
//                   </svg>
//                 </a>
 
//                 {/* YouTube */}
//                 <a
//                   href="https://www.youtube.com/@Texoraai"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all"
//                 >
//                   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
//                   </svg>
//                 </a>
 
//                 {/* LinkedIn */}
//                 <a
//                   href="https://www.linkedin.com/company/ilmora-texoraai/"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all"
//                 >
//                   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//                   </svg>
//                 </a>
 
//                 {/* WhatsApp */}
//                 <a
//                   href="https://api.whatsapp.com/send?phone=919210970334"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all"
//                 >
//                   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
//                   </svg>
//                 </a>
 
//                 {/* X / Twitter */}
//                 <a
//                   href="https://x.com/texoraai"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all"
//                 >
//                   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
//                   </svg>
//                 </a>
//               </div>
//             </div>
 
//             <div className="flex flex-col gap-4">
//               <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Programs</h4>
//               <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
//                 {[
//                   { label: "Product Management", action: () => scrollToSection("courses", "product") },
//                   { label: "Growth Marketing",   action: () => scrollToSection("courses", "growth") },
//                   { label: "UI / UX Design",     action: () => scrollToSection("courses", "design") },
//                 ].map(item => (
//                   <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />{item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>
 
//             <div className="flex flex-col gap-4">
//               <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Resources</h4>
//               <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
//                 {[
//                   { label: "Success Stories", action: () => scrollToSection("successstories") },
//                   { label: "Blogs",           action: () => window.open("https://texora.ai/blogs", "_blank") },
//                   { label: "Use Cases",       action: () => window.open("https://texora.ai/use-cases", "_blank") },
//                 ].map(item => (
//                   <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />{item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>
 
//             <div className="flex flex-col gap-4 self-start">
//               <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Company</h4>
//               <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
//                 {[
//                   { label: "About Us",       action: () => navigate("/about") },
//                   { label: "Careers",        action: () => navigate("/careers") },
//                   { label: "Pricing",        action: () => navigate("/pricing") },
//                   { label: "Privacy Policy", action: () => navigate("/privacy-policy") },
//                   { label: "Help Center",    action: () => navigate("/help-center") },
//                   { label: "FAQ",            action: () => navigate("/faq") },
//                 ].map(item => (
//                   <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />{item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>
 
//             <FooterNewsletter />
//           </div>
 
//           <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
//             <span>© {new Date().getFullYear()} ILM ORA All rights reserved.</span>
//             <div className="flex items-center gap-2">
//               <span>Built with</span><span className="text-red-500 text-base">❤️</span><span>passion for modern learners</span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }  No backend add updated ui hai 



























































// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import videoService from "../../services/videoService";
// import {
//   PlayCircle,
//   Users,
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize,
//   Minimize,
//   Sparkles,
//   Sun,
//   Moon,
//   Share2,
//   Check,
//   SkipBack,
//   SkipForward,
//   Settings,
//   Instagram,
//   Twitter,
//   Youtube,
//   Linkedin,
//   MessageCircle,
// } from "lucide-react";

// const colors = {
//   muted: "text-gray-600 dark:text-gray-300",
//   surface: "bg-white dark:bg-gray-900",
// };

// const API_GATEWAY =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// export default function TexoraAISkills() {
//   const { videoId } = useParams();
//   const navigate = useNavigate();

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [dark, setDark] = useState(
//     () => localStorage.getItem("theme") === "dark",
//   );
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(100);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [showSettingsMenu, setShowSettingsMenu] = useState(false);
//   const [settingsView, setSettingsView] = useState("main");
//   const [quality, setQuality] = useState("720p");
//   const [captions, setCaptions] = useState("off");
//   const [lockScreen, setLockScreen] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const [allCourses, setAllCourses] = useState([]);
//   const [currentCourse, setCurrentCourse] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const videoContainerRef = useRef(null);
//   const videoRef = useRef(null);

//   const shareUrl = `${window.location.origin}${window.location.pathname}${videoId ? `/${videoId}` : ""}`;

//   // ── Theme ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [dark]);

//   // ── Load Courses from /upload-course/all ──────────────────────
//   useEffect(() => {
//     let blobUrl;

//     const loadCourse = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // ✅ NEW: fetch from the correct endpoint
//         // const res = await videoService.getAllAdminCourses();
//         // const courses = res.data || [];
//         // ✅ UPDATED: fetch from the WatchNow endpoint
//         const res = await videoService.getAllWatchNow();
//         const courses = res.data || [];

//         if (courses.length === 0) {
//           setError("No courses available yet.");
//           return;
//         }

//         setAllCourses(courses);

//         // Pick by id param or default to first
//         const selected =
//           courses.find((c) => String(c.id) === String(videoId)) || courses[0];
//         setCurrentCourse(selected);
//         console.log(
//           "Selected course:",
//           selected.id,
//           selected.title,
//           selected.fileName,
//         );

//         // ✅ NEW: stream using fileName via /upload-course/stream/{fileName}
//         // ✅ UPDATED: stream using fileName via WatchNow stream endpoint
//         if (selected.fileName) {
//           const streamUrl = videoService.getWatchNowStreamUrl(
//             selected.fileName,
//           );
//           setVideoUrl(streamUrl);
//         } else if (selected.videoUrl) {
//           // fallback: if admin provided a URL instead of uploading a file
//           setVideoUrl(selected.videoUrl);
//         } else {
//           setError("No video source found for this course.");
//         }
//       } catch (err) {
//         console.error("Course load error:", err);
//         setError("Failed to load course. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCourse();

//     return () => {
//       // only revoke if it was a blob URL
//       if (blobUrl) URL.revokeObjectURL(blobUrl);
//     };
//   }, [videoId]);

//   // ── Progress polling ──────────────────────────────────────────
//   useEffect(() => {
//     let interval;
//     if (isPlaying && videoRef.current) {
//       interval = setInterval(() => {
//         const video = videoRef.current;
//         if (video && video.duration)
//           setProgress((video.currentTime / video.duration) * 100);
//       }, 100);
//     }
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   const handleTimeUpdate = () => {
//     const video = videoRef.current;
//     if (video && video.duration)
//       setProgress((video.currentTime / video.duration) * 100);
//   };

//   // ── Fullscreen listeners ──────────────────────────────────────
//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(
//         !!(
//           document.fullscreenElement ||
//           document.webkitFullscreenElement ||
//           document.mozFullScreenElement ||
//           document.msFullscreenElement
//         ),
//       );
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
//     document.addEventListener("mozfullscreenchange", handleFullscreenChange);
//     document.addEventListener("MSFullscreenChange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//       document.removeEventListener(
//         "webkitfullscreenchange",
//         handleFullscreenChange,
//       );
//       document.removeEventListener(
//         "mozfullscreenchange",
//         handleFullscreenChange,
//       );
//       document.removeEventListener(
//         "MSFullscreenChange",
//         handleFullscreenChange,
//       );
//     };
//   }, []);

//   // ── Controls ──────────────────────────────────────────────────
//   const toggleFullscreen = async () => {
//     if (!videoContainerRef.current) return;
//     try {
//       if (!isFullscreen) {
//         if (videoContainerRef.current.requestFullscreen)
//           await videoContainerRef.current.requestFullscreen();
//         else if (videoContainerRef.current.webkitRequestFullscreen)
//           await videoContainerRef.current.webkitRequestFullscreen();
//         else if (videoContainerRef.current.mozRequestFullScreen)
//           await videoContainerRef.current.mozRequestFullScreen();
//         else if (videoContainerRef.current.msRequestFullscreen)
//           await videoContainerRef.current.msRequestFullscreen();
//       } else {
//         if (document.exitFullscreen) await document.exitFullscreen();
//         else if (document.webkitExitFullscreen)
//           await document.webkitExitFullscreen();
//         else if (document.mozCancelFullScreen)
//           await document.mozCancelFullScreen();
//         else if (document.msExitFullscreen) await document.msExitFullscreen();
//       }
//     } catch (error) {
//       console.error("Error toggling fullscreen:", error);
//     }
//   };

//   const togglePlay = () => {
//     const v = videoRef.current;
//     if (!v) return;
//     if (v.paused) {
//       v.play();
//       setIsPlaying(true);
//     } else {
//       v.pause();
//       setIsPlaying(false);
//     }
//   };

//   const handleShare = async () => {
//     setShowShareModal(true);
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getCurrentTime = () =>
//     videoRef.current?.duration
//       ? formatTime(videoRef.current.currentTime)
//       : "0:00";
//   const getTotalTime = () =>
//     videoRef.current?.duration ? formatTime(videoRef.current.duration) : "0:00";

//   const handleVolumeChange = (e) => {
//     const newVolume = parseInt(e.target.value);
//     setVolume(newVolume);
//     setIsMuted(false);
//     if (videoRef.current) videoRef.current.volume = newVolume / 100;
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     if (videoRef.current) videoRef.current.muted = !isMuted;
//   };

//   const handleSpeedChange = (speed) => {
//     setPlaybackSpeed(speed);
//     if (videoRef.current) videoRef.current.playbackRate = speed;
//     setSettingsView("main");
//   };

//   const handleProgressClick = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const percentage = ((e.clientX - rect.left) / rect.width) * 100;
//     setProgress(percentage);
//     if (videoRef.current?.duration)
//       videoRef.current.currentTime =
//         (percentage / 100) * videoRef.current.duration;
//   };

//   const skipBackward = () => {
//     if (videoRef.current)
//       videoRef.current.currentTime = Math.max(
//         0,
//         videoRef.current.currentTime - 10,
//       );
//   };
//   const skipForward = () => {
//     if (videoRef.current?.duration)
//       videoRef.current.currentTime = Math.min(
//         videoRef.current.duration,
//         videoRef.current.currentTime + 10,
//       );
//   };

//   const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
//   const qualityOptions = [
//     { value: "2160p", label: "4K (2160p)" },
//     { value: "1440p", label: "1440p" },
//     { value: "1080p", label: "1080p" },
//     { value: "720p", label: "720p" },
//     { value: "480p", label: "480p" },
//     { value: "360p", label: "360p" },
//     { value: "240p", label: "240p" },
//     { value: "144p", label: "144p" },
//   ];
//   const captionOptions = [
//     { value: "off", label: "Off" },
//     { value: "en", label: "English" },
//     { value: "hi", label: "Hindi" },
//     { value: "es", label: "Spanish" },
//   ];

//   // ── Helpers for display ───────────────────────────────────────
//   const displayTitle =
//     currentCourse?.title || "System Design for Velocity Coders";
//   const displayInstructor = currentCourse?.instructorName || "Arjay McCandless";
//   const displayRole =
//     currentCourse?.instructorRole || "Software Engineer & Instructor";
//   const displayExperience = currentCourse?.experience || "10+ years experience";
//   const displayStudents =
//     currentCourse?.studentCount || `${allCourses.length * 50}+ students`;
//   const displayLearners =
//     currentCourse?.learnersCount != null
//       ? `${currentCourse.learnersCount}+ learners`
//       : `${allCourses.length * 50}+ learners`;
//   const displayDate = currentCourse?.publishDate
//     ? new Date(currentCourse.publishDate).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       })
//     : new Date().toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//   const displayDescription =
//     currentCourse?.description ||
//     "Learn essential system design principles tailored for developers who need to move fast. This course covers practical patterns, scalability considerations, and real-world trade-offs that will help you design better systems from day one.";

//   // learnPoints is stored as JSON string in DB
//   let learnPoints = [];
//   try {
//     learnPoints =
//       typeof currentCourse?.learnPoints === "string"
//         ? JSON.parse(currentCourse.learnPoints)
//         : currentCourse?.learnPoints || [];
//   } catch {
//     learnPoints = [];
//   }
//   if (!learnPoints.length) {
//     learnPoints = [
//       {
//         title: "Designing Systems with AI",
//         desc: "Leverage AI tools and patterns for system architecture",
//       },
//       {
//         title: "Avoiding Common Pitfalls",
//         desc: "Learn from mistakes others have made in system design",
//       },
//       {
//         title: "Tools & Frameworks",
//         desc: "Discover the best tools and frameworks to consider",
//       },
//       {
//         title: "Practical Approach",
//         desc: "Quick, actionable insights - not comprehensive theory",
//       },
//     ];
//   }

//   // initials for avatar
//   const initials = displayInstructor
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   // thumbnail URL
//   const thumbnailUrl = currentCourse?.thumbnail
//     ? videoService.getWatchNowStreamUrl(currentCourse.thumbnail)
//     : null;

//   return (
//     <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
//       {/* Header */}
//       <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#F97316]/20 dark:border-gray-800">
//         <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold">
//               <span className="text-green-600 dark:text-green-400">ILM</span>{" "}
//               <span className="text-[#F97316]">ORA</span>
//             </span>
//           </div>
//           <nav className="flex gap-4 items-center">
//             <button
//               onClick={() => setDark(!dark)}
//               className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm"
//               aria-label="Toggle theme"
//             >
//               {dark ? (
//                 <Sun className="w-5 h-5 text-[#F97316]" />
//               ) : (
//                 <Moon className="w-5 h-5 text-[#1E293B]" />
//               )}
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
//           <span className="text-[#F97316]">⚡</span>
//           <span className="text-[#F97316]">
//             {currentCourse?.featuredTag || "Featured Course"}
//           </span>
//         </div>

//         <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white mb-4">
//           {displayTitle}
//         </h1>

//         <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
//           Hosted by{" "}
//           <span className="font-semibold text-[#1E293B] dark:text-white">
//             {currentCourse?.hostedBy || displayInstructor}
//           </span>
//         </p>

//         {/* Loading / Error states */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="inline-flex items-center gap-3 text-lg text-gray-600 dark:text-gray-300">
//               <svg
//                 className="animate-spin w-6 h-6 text-[#F97316]"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8z"
//                 />
//               </svg>
//               Loading course...
//             </div>
//           </div>
//         )}
//         {error && (
//           <div className="text-center py-12">
//             <p className="text-red-500 text-lg">{error}</p>
//           </div>
//         )}

//         {/* ── Video Player ── */}
//         {!loading && videoUrl && currentCourse && (
//           <div
//             ref={videoContainerRef}
//             className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F97316]/20 ${
//               isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
//             }`}
//           >
//             <div className="aspect-video relative group">
//               {/* <video
//                 ref={videoRef}
//                 src={videoUrl}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//                 onTimeUpdate={handleTimeUpdate}
//               /> */}
//               <video
//                 key={currentCourse?.id || videoUrl}
//                 ref={videoRef}
//                 src={videoUrl}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//                 onTimeUpdate={handleTimeUpdate}
//               />

//               {!isPlaying && (
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-950 flex">
//                   <div className="flex-1 flex items-center justify-center relative">
//                     <div className="text-white text-left px-12 max-w-4xl">
//                       <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#F97316]">
//                         You will learn my best practices for:
//                       </h2>
//                       <div className="space-y-4 text-xl md:text-2xl">
//                         {learnPoints.slice(0, 4).map((item, i) => (
//                           <div
//                             key={i}
//                             className="hover:translate-x-2 transition-transform"
//                           >
//                             <span className="text-[#F97316] font-bold">
//                               {i + 1}.
//                             </span>{" "}
//                             {item.title}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <button
//                       onClick={togglePlay}
//                       className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all"
//                     >
//                       <div className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
//                         <Play
//                           className="w-10 h-10 text-white ml-1"
//                           fill="white"
//                         />
//                       </div>
//                     </button>
//                   </div>

//                   {/* Instructor Live Badge */}
//                   {currentCourse.showInstructorLive !== false &&
//                     currentCourse.showInstructorLive !== "false" && (
//                       <div className="absolute top-4 right-4 w-32 h-32 bg-[#1E293B] rounded-lg overflow-hidden border-2 border-[#F97316] shadow-lg">
//                         {thumbnailUrl ? (
//                           <img
//                             src={thumbnailUrl}
//                             alt="thumbnail"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
//                             <span className="text-xs text-gray-300 font-semibold">
//                               Instructor Live
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                 </div>
//               )}

//               {/* Controls */}
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <div className="mb-3">
//                   <div
//                     className="h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
//                     onClick={handleProgressClick}
//                   >
//                     <div
//                       className="h-full bg-red-600 rounded-full relative"
//                       style={{ width: `${progress}%` }}
//                     >
//                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100"></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={togglePlay}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     {isPlaying ? (
//                       <Pause className="w-6 h-6" />
//                     ) : (
//                       <Play className="w-6 h-6" />
//                     )}
//                   </button>
//                   <button
//                     onClick={skipBackward}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     <SkipBack className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={skipForward}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     <SkipForward className="w-5 h-5" />
//                   </button>
//                   <div className="flex items-center gap-2 group/volume">
//                     <button
//                       onClick={toggleMute}
//                       className="text-white hover:scale-110 transition-transform"
//                     >
//                       {isMuted || volume === 0 ? (
//                         <VolumeX className="w-5 h-5" />
//                       ) : (
//                         <Volume2 className="w-5 h-5" />
//                       )}
//                     </button>
//                     <input
//                       type="range"
//                       min="0"
//                       max="100"
//                       value={isMuted ? 0 : volume}
//                       onChange={handleVolumeChange}
//                       className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2 text-white text-sm font-mono">
//                     <span>{getCurrentTime()}</span>
//                     <span>/</span>
//                     <span>{getTotalTime()}</span>
//                   </div>
//                   <div className="flex-1"></div>

//                   {/* Settings */}
//                   <div className="relative">
//                     <button
//                       onClick={() => {
//                         setShowSettingsMenu(!showSettingsMenu);
//                         setSettingsView("main");
//                       }}
//                       className="text-white hover:scale-110 transition-transform"
//                     >
//                       <Settings className="w-5 h-5" />
//                     </button>
//                     {showSettingsMenu && (
//                       <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 py-2 min-w-[280px] max-h-[400px] overflow-y-auto">
//                         {settingsView === "main" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("quality")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div>
//                                   <div className="text-white font-medium">
//                                     Quality
//                                   </div>
//                                   <div className="text-gray-400 text-xs">
//                                     Auto ({quality})
//                                   </div>
//                                 </div>
//                               </div>
//                               <svg
//                                 className="w-5 h-5 text-gray-400 group-hover:text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 5l7 7-7 7"
//                                 />
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() => setSettingsView("speed")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div>
//                                   <div className="text-white font-medium">
//                                     Playback speed
//                                   </div>
//                                   <div className="text-gray-400 text-xs">
//                                     {playbackSpeed === 1
//                                       ? "Normal"
//                                       : `${playbackSpeed}x`}
//                                   </div>
//                                 </div>
//                               </div>
//                               <svg
//                                 className="w-5 h-5 text-gray-400 group-hover:text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 5l7 7-7 7"
//                                 />
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() =>
//                                 setCaptions(captions === "off" ? "en" : "off")
//                               }
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div>
//                                   <div className="text-white font-medium">
//                                     Captions
//                                   </div>
//                                   <div className="text-gray-400 text-xs">
//                                     {captions === "off"
//                                       ? "Unavailable"
//                                       : captionOptions.find(
//                                           (c) => c.value === captions,
//                                         )?.label}
//                                   </div>
//                                 </div>
//                               </div>
//                             </button>
//                             <button
//                               onClick={() => setLockScreen(!lockScreen)}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div className="text-white font-medium">
//                                   Lock screen
//                                 </div>
//                               </div>
//                               {lockScreen && (
//                                 <svg
//                                   className="w-5 h-5 text-blue-400"
//                                   fill="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                 </svg>
//                               )}
//                             </button>
//                             <button
//                               onClick={() => setSettingsView("more")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                   <svg
//                                     className="w-5 h-5 text-white"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <div className="text-white font-medium">
//                                   More
//                                 </div>
//                               </div>
//                               <svg
//                                 className="w-5 h-5 text-gray-400 group-hover:text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 5l7 7-7 7"
//                                 />
//                               </svg>
//                             </button>
//                           </div>
//                         )}
//                         {settingsView === "quality" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("main")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
//                             >
//                               <svg
//                                 className="w-5 h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 19l-7-7 7-7"
//                                 />
//                               </svg>
//                               <span className="text-white font-medium">
//                                 Quality
//                               </span>
//                             </button>
//                             <button
//                               onClick={() => setQuality("auto")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                             >
//                               <span className="text-white">Auto (720p)</span>
//                               {quality === "auto" && (
//                                 <svg
//                                   className="w-5 h-5 text-blue-400"
//                                   fill="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                 </svg>
//                               )}
//                             </button>
//                             {qualityOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => setQuality(option.value)}
//                                 className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                               >
//                                 <span className="text-white">
//                                   {option.label}
//                                 </span>
//                                 {quality === option.value && (
//                                   <svg
//                                     className="w-5 h-5 text-blue-400"
//                                     fill="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                   </svg>
//                                 )}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                         {settingsView === "speed" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("main")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
//                             >
//                               <svg
//                                 className="w-5 h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 19l-7-7 7-7"
//                                 />
//                               </svg>
//                               <span className="text-white font-medium">
//                                 Playback speed
//                               </span>
//                             </button>
//                             {speedOptions.map((speed) => (
//                               <button
//                                 key={speed}
//                                 onClick={() => handleSpeedChange(speed)}
//                                 className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between"
//                               >
//                                 <span className="text-white">
//                                   {speed === 1 ? "Normal" : `${speed}x`}
//                                 </span>
//                                 {speed === playbackSpeed && (
//                                   <svg
//                                     className="w-5 h-5 text-blue-400"
//                                     fill="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                   </svg>
//                                 )}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                         {settingsView === "more" && (
//                           <div>
//                             <button
//                               onClick={() => setSettingsView("main")}
//                               className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 border-b border-gray-700"
//                             >
//                               <svg
//                                 className="w-5 h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 19l-7-7 7-7"
//                                 />
//                               </svg>
//                               <span className="text-white font-medium">
//                                 More
//                               </span>
//                             </button>
//                             <button className="w-full px-4 py-3 text-left hover:bg-white/10">
//                               <span className="text-white">
//                                 Report playback issue
//                               </span>
//                             </button>
//                             <button className="w-full px-4 py-3 text-left hover:bg-white/10">
//                               <span className="text-white">
//                                 Stats for nerds
//                               </span>
//                             </button>
//                             <button className="w-full px-4 py-3 text-left hover:bg-white/10">
//                               <span className="text-white">Help</span>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     onClick={toggleFullscreen}
//                     className="text-white hover:scale-110 transition-transform"
//                   >
//                     {isFullscreen ? (
//                       <Minimize className="w-5 h-5" />
//                     ) : (
//                       <Maximize className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Video Info */}
//         {!loading && currentCourse && (
//           <div className="mt-6">
//             <div className="flex items-start justify-between gap-4 flex-wrap">
//               <div className="flex-1">
//                 <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">
//                   {displayTitle}
//                 </h3>
//                 <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
//                   <span>{displayLearners}</span>
//                   <span>•</span>
//                   <span>{displayDate}</span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <button
//                   onClick={handleShare}
//                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white transition-all font-semibold shadow-sm"
//                 >
//                   <Share2 className="w-5 h-5" />
//                   <span>SHARE</span>
//                 </button>
//               </div>
//             </div>

//             {/* Instructor chip */}
//             <div className="mt-6 flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
//               <div className="w-12 h-12 bg-[#1E293B] rounded-xl flex-shrink-0 flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">{initials}</span>
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-bold text-[#1E293B] dark:text-white">
//                   {displayInstructor}
//                 </h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   {displayRole}
//                 </p>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
//               <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                 {displayDescription}
//               </p>
//               {currentCourse.showMoreEnabled !== false &&
//                 currentCourse.showMoreEnabled !== "false" && (
//                   <button className="mt-3 text-sm font-semibold text-[#F97316] hover:underline">
//                     Show more
//                   </button>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* Course Info Grid */}
//         {!loading && currentCourse && (
//           <div className="mt-12 grid md:grid-cols-2 gap-10">
//             {/* What You'll Learn */}
//             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
//               <h3 className="text-2xl font-bold mb-6 text-[#1E293B] dark:text-white">
//                 What you&apos;ll learn
//               </h3>
//               <div className="space-y-4 text-[#1E293B] dark:text-gray-200">
//                 {learnPoints.map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex items-start gap-3 hover:translate-x-1 transition-transform"
//                   >
//                     <span className="bg-[#F97316] text-white font-bold text-sm p-1 rounded-lg flex-shrink-0 w-7 h-7 flex items-center justify-center">
//                       ✓
//                     </span>
//                     <div>
//                       <p className="font-semibold text-[#1E293B] dark:text-white">
//                         {item.title}
//                       </p>
//                       {item.desc && (
//                         <p className="text-sm text-gray-600 dark:text-gray-300">
//                           {item.desc}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* About the Instructor */}
//             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
//               <h3 className="text-2xl font-bold mb-6 text-[#1E293B] dark:text-white">
//                 About the Instructor
//               </h3>
//               <div className="flex items-start gap-6">
//                 <div className="w-20 h-20 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex-shrink-0 shadow-md flex items-center justify-center">
//                   <span className="text-white text-xl font-bold">
//                     {initials}
//                   </span>
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-bold mb-2 text-[#1E293B] dark:text-white">
//                     {displayInstructor}
//                   </h4>
//                   <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
//                     {displayRole}
//                   </p>
//                   <div className="flex gap-3 flex-wrap">
//                     <span className="bg-[#1E293B] dark:bg-[#F97316] text-white px-3 py-1 rounded-full font-semibold text-xs">
//                       {displayExperience}
//                     </span>
//                     <span className="bg-[#F97316]/10 dark:bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 px-3 py-1 rounded-full font-semibold text-xs">
//                       {displayStudents}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Share Modal */}
//       {showShareModal && (
//         <div
//           className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowShareModal(false)}
//         >
//           <div
//             className={`${colors.surface} rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                 Share this lesson
//               </h3>
//               <button
//                 onClick={() => setShowShareModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Share this link with your friends:
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={shareUrl}
//                   readOnly
//                   className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm"
//                 />
//                 <button
//                   onClick={copyToClipboard}
//                   className={`px-4 py-3 ${
//                     copied
//                       ? "bg-green-600 hover:bg-green-700"
//                       : "bg-[#1E293B] hover:bg-[#334155]"
//                   } text-white rounded-lg font-semibold transition-all flex items-center gap-2`}
//                 >
//                   {copied ? (
//                     <>
//                       <Check className="w-5 h-5" />
//                       Copied!
//                     </>
//                   ) : (
//                     "Copy"
//                   )}
//                 </button>
//               </div>
//             </div>
//             <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                 Or share via:
//               </p>
//               <div className="grid grid-cols-3 gap-3">
//                 <a
//                   href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this course on TexoraAI.skills!`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
//                 >
//                   <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//                     </svg>
//                   </div>
//                   <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                     Twitter
//                   </span>
//                 </a>
//                 <a
//                   href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
//                 >
//                   <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                     </svg>
//                   </div>
//                   <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                     LinkedIn
//                   </span>
//                 </a>
//                 <a
//                   href={`https://api.whatsapp.com/send?text=Check out this course: ${encodeURIComponent(shareUrl)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
//                 >
//                   <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
//                     </svg>
//                   </div>
//                   <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                     WhatsApp
//                   </span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="bg-white text-[#1E293B] mt-20">
//         <div className="max-w-7xl mx-auto px-6 py-20">
//           <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
//             <div className="lg:col-span-2 space-y-5">
//               <h3 className="text-2xl font-bold">
//                 <span className="text-green-600">ILM</span>{" "}
//                 <span className="text-[#F97316]">ORA</span>
//               </h3>
//               <p className="text-sm text-gray-600 max-w-sm">
//                 Modern learning platform for ambitious professionals who want to
//                 break into product, design and growth roles.
//               </p>
//               <div className="flex gap-4 pt-4">
//                 <a
//                   href="https://www.youtube.com/@Texoraai"
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label="YouTube"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-red-600"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//                   </svg>
//                 </a>
//                 <a
//                   href="https://www.linkedin.com/company/105596104"
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label="LinkedIn"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-blue-700"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                   </svg>
//                 </a>
//                 <a
//                   href="https://api.whatsapp.com/send?phone=919210970334"
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label="WhatsApp"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-green-500"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
//                   </svg>
//                 </a>
//                 <a
//                   href="https://www.instagram.com/texora_ai"
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label="Instagram"
//                   className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
//                 >
//                   <Instagram size={18} />
//                 </a>
//                 <a
//                   href="https://x.com/texoraai"
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label="X"
//                   className="h-9 w-9 rounded-full flex items-center justify-center bg-black text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
//                 >
//                   <Twitter size={18} />
//                 </a>
//               </div>
//             </div>

//             {[
//               {
//                 title: "Resources",
//                 items: [
//                   { label: "Success Stories", action: () => {} },
//                   {
//                     label: "Free Services",
//                     action: () => navigate("/explore-programs"),
//                   },
//                 ],
//               },
//               {
//                 title: "Company",
//                 items: [
//                   { label: "About Us", action: () => navigate("/about") },
//                   { label: "Careers", action: () => navigate("/careers") },
//                   {
//                     label: "Privacy Policy",
//                     action: () => navigate("/privacy-policy"),
//                   },
//                   {
//                     label: "Terms of Service",
//                     action: () => navigate("/terms-of-service"),
//                   },
//                 ],
//               },
//             ].map((section, i) => (
//               <div key={i} className="space-y-4">
//                 <h4 className="text-sm font-semibold text-[#1E293B] tracking-wide">
//                   {section.title}
//                 </h4>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   {section.items.map((item) => (
//                     <li
//                       key={item.label}
//                       onClick={item.action}
//                       className="hover:text-[#F97316] cursor-pointer transition"
//                     >
//                       {item.label}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-gray-300 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
//             <span>
//               © {new Date().getFullYear()} ILM ORA. All rights reserved.
//             </span>
//             <span>Built for modern learners</span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }  backend add hai lekin updated ui nhi hai 












































































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
  Share2,
  Check,
  SkipBack,
  SkipForward,
  Settings,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageCircle,
  ChevronDown,
  Menu,
  GraduationCap,
  BarChart3,
  FileText,
  User,
  LogOut,
} from "lucide-react";

const colors = {
  muted: "text-gray-600 dark:text-gray-300",
  surface: "bg-white dark:bg-gray-900",
};

const API_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ─────────────────────────────────────────────────────────────────────────────
// FooterNewsletter
// CHANGED: Removed "Contact support: marketing@texora.ai" placeholder text from contact line.
//          Now shows: Contact support: marketing@texora.ai
// ─────────────────────────────────────────────────────────────────────────────
function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const isValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!isValid(trimmed)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }
    setStatus("loading");
    try {
      const { ok, status: httpStatus } = await subscribeNewsletter(trimmed);
      if (httpStatus === 409) { setStatus("duplicate"); setTimeout(() => setStatus("idle"), 3000); return; }
      if (ok) { setStatus("success"); setEmail(""); setTimeout(() => setStatus("idle"), 3500); }
      else    { setStatus("apierror"); setTimeout(() => setStatus("idle"), 3000); }
    } catch {
      setStatus("apierror");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const statusMsg = {
    success:  { text: "✓ You're subscribed!",            color: "#22c55e" },
    error:    { text: "Enter a valid email.",             color: "#f87171" },
    duplicate:{ text: "Already subscribed.",              color: "#fb923c" },
    apierror: { text: "Something went wrong. Try again.", color: "#f87171" },
  }[status];

  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-sm md:text-base font-bold tracking-wide text-[#1E293B] leading-snug">
        Be the first to know
      </h4>
      <div
        style={{
          display: "flex",
          background: status === "error" ? "rgba(248,113,113,0.06)" : "#f8fafc",
          borderRadius: "8px",
          border: status === "error"   ? "1.5px solid #f87171"
                : status === "success" ? "1.5px solid #22c55e"
                : "1.5px solid #e2e8f0",
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Contact support: marketing@texora.ai"
          disabled={status === "loading" || status === "success"}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#1E293B", fontSize: "13px", padding: "9px 12px", minWidth: 0,
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || status === "success"}
          style={{
            background: status === "success" ? "#22c55e" : "#1E293B",
            border: "none", cursor: "pointer", padding: "0 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            minWidth: "42px", transition: "background 0.2s", flexShrink: 0,
          }}
          onMouseEnter={e => { if (status !== "success") e.currentTarget.style.background = "#F97316"; }}
          onMouseLeave={e => { if (status !== "success") e.currentTarget.style.background = "#1E293B"; }}
        >
          {status === "loading" ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
              <path d="M10 2a8 8 0 0 1 8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="0.7s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : status === "success" ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      {statusMsg && (
        <p style={{ fontSize: "12px", color: statusMsg.color, margin: "-8px 0 0" }}>
          {statusMsg.text}
        </p>
      )}

      {/* CHANGED: removed "your@email.com" — now just shows the support email link */}

      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Status: Live
        </span>
      </div>
    </div>
  );
}

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

  const [allCourses, setAllCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  const shareUrl = `${window.location.origin}${window.location.pathname}${videoId ? `/${videoId}` : ""}`;

  // ── Theme ──────────────────────────────────────────────────────
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // ── Load Courses from WatchNow endpoint ─────────────────────────
  useEffect(() => {
    let blobUrl;

    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ UPDATED: fetch from the WatchNow endpoint
        const res = await videoService.getAllWatchNow();
        const courses = res.data || [];

        if (courses.length === 0) {
          setError("No courses available yet.");
          return;
        }

        setAllCourses(courses);

        // Pick by id param or default to first
        const selected =
          courses.find((c) => String(c.id) === String(videoId)) || courses[0];
        setCurrentCourse(selected);
        console.log(
          "Selected course:",
          selected.id,
          selected.title,
          selected.fileName,
        );

        // ✅ UPDATED: stream using fileName via WatchNow stream endpoint
        if (selected.fileName) {
          const streamUrl = videoService.getWatchNowStreamUrl(
            selected.fileName,
          );
          setVideoUrl(streamUrl);
        } else if (selected.videoUrl) {
          // fallback: if admin provided a URL instead of uploading a file
          setVideoUrl(selected.videoUrl);
        } else {
          setError("No video source found for this course.");
        }
      } catch (err) {
        console.error("Course load error:", err);
        setError("Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();

    return () => {
      // only revoke if it was a blob URL
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [videoId]);

  // ── Progress polling ──────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (isPlaying && videoRef.current) {
      interval = setInterval(() => {
        const video = videoRef.current;
        if (video && video.duration)
          setProgress((video.currentTime / video.duration) * 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration)
      setProgress((video.currentTime / video.duration) * 100);
  };

  // ── Fullscreen listeners ──────────────────────────────────────
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

  // ── Controls ──────────────────────────────────────────────────
  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return;
    try {
      if (!isFullscreen) {
        if (videoContainerRef.current.requestFullscreen)
          await videoContainerRef.current.requestFullscreen();
        else if (videoContainerRef.current.webkitRequestFullscreen)
          await videoContainerRef.current.webkitRequestFullscreen();
        else if (videoContainerRef.current.mozRequestFullScreen)
          await videoContainerRef.current.mozRequestFullScreen();
        else if (videoContainerRef.current.msRequestFullscreen)
          await videoContainerRef.current.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen)
          await document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen)
          await document.mozCancelFullScreen();
        else if (document.msExitFullscreen) await document.msExitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentTime = () =>
    videoRef.current?.duration
      ? formatTime(videoRef.current.currentTime)
      : "0:00";
  const getTotalTime = () =>
    videoRef.current?.duration ? formatTime(videoRef.current.duration) : "0:00";

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
    if (videoRef.current) videoRef.current.volume = newVolume / 100;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setSettingsView("main");
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(percentage);
    if (videoRef.current?.duration)
      videoRef.current.currentTime =
        (percentage / 100) * videoRef.current.duration;
  };

  const skipBackward = () => {
    if (videoRef.current)
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10,
      );
  };
  const skipForward = () => {
    if (videoRef.current?.duration)
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10,
      );
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

  // ── Helpers for display ───────────────────────────────────────
  const displayTitle =
    currentCourse?.title || "System Design for Velocity Coders";
  const displayInstructor = currentCourse?.instructorName || "Arjay McCandless";
  const displayRole =
    currentCourse?.instructorRole || "Software Engineer & Instructor";
  const displayExperience = currentCourse?.experience || "10+ years experience";
  const displayStudents =
    currentCourse?.studentCount || `${allCourses.length * 50}+ students`;
  const displayLearners =
    currentCourse?.learnersCount != null
      ? `${currentCourse.learnersCount}+ learners`
      : `${allCourses.length * 50}+ learners`;
  const displayDate = currentCourse?.publishDate
    ? new Date(currentCourse.publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  const displayDescription =
    currentCourse?.description ||
    "Learn essential system design principles tailored for developers who need to move fast. This course covers practical patterns, scalability considerations, and real-world trade-offs that will help you design better systems from day one.";

  // learnPoints is stored as JSON string in DB
  let learnPoints = [];
  try {
    learnPoints =
      typeof currentCourse?.learnPoints === "string"
        ? JSON.parse(currentCourse.learnPoints)
        : currentCourse?.learnPoints || [];
  } catch {
    learnPoints = [];
  }
  if (!learnPoints.length) {
    learnPoints = [
      {
        title: "Designing Systems with AI",
        desc: "Leverage AI tools and patterns for system architecture",
      },
      {
        title: "Avoiding Common Pitfalls",
        desc: "Learn from mistakes others have made in system design",
      },
      {
        title: "Tools & Frameworks",
        desc: "Discover the best tools and frameworks to consider",
      },
      {
        title: "Practical Approach",
        desc: "Quick, actionable insights - not comprehensive theory",
      },
    ];
  }

  // initials for avatar
  const initials = displayInstructor
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // thumbnail URL
  const thumbnailUrl = currentCourse?.thumbnail
    ? videoService.getWatchNowStreamUrl(currentCourse.thumbnail)
    : null;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
      {/* Header */}
      <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#F97316]/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">

          {/* ✅ Added Home Navigation on ILM ORA Click */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:scale-105 transition-transform min-w-0"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            <span className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-extrabold tracking-wide font-serif whitespace-nowrap truncate">
              <span className="text-green-600">ILM</span>
              <span className="text-[#F97316] ml-1 sm:ml-2">ORA</span>
            </span>
          </div>

          <nav className="flex gap-2 sm:gap-4 items-center shrink-0">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm"
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#F97316]" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E293B]" />
              )}
            </button>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold">
          <span className="text-[#F97316]">⚡</span>
          <span className="text-[#F97316]">
            {currentCourse?.featuredTag || "Featured Course"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-white mb-3 sm:mb-4 break-words">
          {displayTitle}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
          Hosted by{" "}
          <span className="font-semibold text-[#1E293B] dark:text-white">
            {currentCourse?.hostedBy || displayInstructor}
          </span>
        </p>

        {/* Loading / Error states */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-lg text-gray-600 dark:text-gray-300">
              <svg
                className="animate-spin w-6 h-6 text-[#F97316]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Loading course...
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        )}

        {/* ── Video Player ── */}
        {!loading && videoUrl && currentCourse && (
          <div
            ref={videoContainerRef}
            className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F97316]/20 ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
            }`}
          >
            <div className="aspect-video relative group">
              <video
                key={currentCourse?.id || videoUrl}
                ref={videoRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
              />

              {!isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-950 flex">
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="text-white text-left px-4 sm:px-8 md:px-12 max-w-4xl">
                      <h2 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-5 md:mb-8 text-[#F97316]">
                        You will learn my best practices for:
                      </h2>
                      <div className="space-y-1.5 sm:space-y-3 md:space-y-4 text-xs sm:text-base md:text-xl lg:text-2xl">
                        {learnPoints.slice(0, 4).map((item, i) => (
                          <div
                            key={i}
                            className="hover:translate-x-2 transition-transform"
                          >
                            <span className="text-[#F97316] font-bold">
                              {i + 1}.
                            </span>{" "}
                            {item.title}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                        <Play
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white ml-0.5 sm:ml-1"
                          fill="white"
                        />
                      </div>
                    </button>
                  </div>

                  {/* Instructor Live Badge */}
                  {currentCourse.showInstructorLive !== false &&
                    currentCourse.showInstructorLive !== "false" && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#1E293B] rounded-lg overflow-hidden border-2 border-[#F97316] shadow-lg">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <span className="text-[8px] sm:text-xs text-gray-300 font-semibold text-center px-1">
                              Instructor Live
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-2 sm:p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <div className="mb-2 sm:mb-3">
                  <div
                    className="h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-red-600 rounded-full relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                  <button
                    onClick={skipBackward}
                    className="text-white hover:scale-110 transition-transform hidden sm:inline-flex"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={skipForward}
                    className="text-white hover:scale-110 transition-transform hidden sm:inline-flex"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-16 sm:group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100 hidden sm:block"
                    />
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-white text-[10px] sm:text-sm font-mono whitespace-nowrap">
                    <span>{getCurrentTime()}</span>
                    <span>/</span>
                    <span>{getTotalTime()}</span>
                  </div>
                  <div className="flex-1"></div>

                  {/* Settings */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(!showSettingsMenu);
                        setSettingsView("main");
                      }}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {showSettingsMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 py-2 w-[220px] sm:min-w-[280px] max-h-[300px] sm:max-h-[400px] overflow-y-auto max-w-[90vw]">
                        {settingsView === "main" && (
                          <div>
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
                            <button
                              onClick={() =>
                                setCaptions(captions === "off" ? "en" : "off")
                              }
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

                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Info */}
        {!loading && currentCourse && (
          <div className="mt-5 sm:mt-6">
            <div className="flex items-start justify-between gap-3 sm:gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white mb-2 break-words">
                  {displayTitle}
                </h3>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex-wrap">
                  <span>{displayLearners}</span>
                  <span>•</span>
                  <span>{displayDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white transition-all font-semibold shadow-sm text-sm sm:text-base"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>SHARE</span>
                </button>
              </div>
            </div>

            {/* Instructor chip */}
            <div className="mt-5 sm:mt-6 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1E293B] rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#1E293B] dark:text-white text-sm sm:text-base truncate">
                  {displayInstructor}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                  {displayRole}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5 sm:mt-6 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {displayDescription}
              </p>
              {currentCourse.showMoreEnabled !== false &&
                currentCourse.showMoreEnabled !== "false" && (
                  <button className="mt-3 text-sm font-semibold text-[#F97316] hover:underline">
                    Show more
                  </button>
                )}
            </div>
          </div>
        )}

        {/* Course Info Grid */}
        {!loading && currentCourse && (
          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {/* What You'll Learn */}
            <div className="bg-white dark:bg-gray-900 p-5 sm:p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#1E293B] dark:text-white">
                What you&apos;ll learn
              </h3>
              <div className="space-y-3 sm:space-y-4 text-[#1E293B] dark:text-gray-200">
                {learnPoints.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 hover:translate-x-1 transition-transform"
                  >
                    <span className="bg-[#F97316] text-white font-bold text-sm p-1 rounded-lg flex-shrink-0 w-7 h-7 flex items-center justify-center">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1E293B] dark:text-white text-sm sm:text-base">
                        {item.title}
                      </p>
                      {item.desc && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About the Instructor */}
            <div className="bg-white dark:bg-gray-900 p-5 sm:p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#1E293B] dark:text-white">
                About the Instructor
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex-shrink-0 shadow-md flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    {initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-[#1E293B] dark:text-white">
                    {displayInstructor}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs sm:text-sm leading-relaxed">
                    {displayRole}
                  </p>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    <span className="bg-[#1E293B] dark:bg-[#F97316] text-white px-3 py-1 rounded-full font-semibold text-xs">
                      {displayExperience}
                    </span>
                    <span className="bg-[#F97316]/10 dark:bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 px-3 py-1 rounded-full font-semibold text-xs">
                      {displayStudents}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className={`${colors.surface} rounded-2xl p-5 sm:p-8 max-w-[92vw] sm:max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Share this lesson
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="mb-5 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Share this link with your friends:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2.5 sm:py-3 ${
                    copied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#1E293B] hover:bg-[#334155]"
                  } text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base shrink-0`}
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
            <div className="border-t border-gray-200 dark:border-gray-800 pt-5 sm:pt-6">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                Or share via:
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this course on TexoraAI.skills!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Twitter
                  </span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    LinkedIn
                  </span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=Check out this course: ${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="bg-white text-[#1E293B] w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-start">
            <div className="flex flex-col gap-2.5 self-start text-left sm:col-span-2 lg:col-span-1">
              <h3 className="text-3xl font-extrabold leading-none">
                <span className="text-green-600">ILM</span>{" "}<span className="text-[#F97316]">ORA</span>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">Modern learning platform for ambitious professionals who want to break into product, design and growth roles.</p>
              <p className="text-sm text-gray-500">
                📧{" "}
                <a href="mailto:marketing@texora.ai" className="hover:text-[#F97316] transition-colors">
                  marketing@texora.ai
                </a>
              </p>

              <div className="flex items-center gap-3 pt-1 flex-wrap">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/texoraai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all"
                  style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@Texoraai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/ilmora-texoraai/"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://api.whatsapp.com/send?phone=919210970334"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com/texoraai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Programs</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "Product Management", action: () => scrollToSection("courses", "product") },
                  { label: "Growth Marketing",   action: () => scrollToSection("courses", "growth") },
                  { label: "UI / UX Design",     action: () => scrollToSection("courses", "design") },
                ].map(item => (
                  <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />{item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Resources</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "Success Stories", action: () => scrollToSection("successstories") },
                  { label: "Blogs",           action: () => window.open("https://texora.ai/blogs", "_blank") },
                  { label: "Use Cases",       action: () => window.open("https://texora.ai/use-cases", "_blank") },
                ].map(item => (
                  <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />{item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Company</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "About Us",       action: () => navigate("/about") },
                  { label: "Careers",        action: () => navigate("/careers") },
                  { label: "Pricing",        action: () => navigate("/pricing") },
                  { label: "Privacy Policy", action: () => navigate("/privacy-policy") },
                  { label: "Help Center",    action: () => navigate("/help-center") },
                  { label: "FAQ",            action: () => navigate("/faq") },
                ].map(item => (
                  <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />{item.label}
                  </li>
                ))}
              </ul>
            </div>

            <FooterNewsletter />
          </div>

          <div className="border-t border-gray-200 mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 text-center">
            <span>© {new Date().getFullYear()} ILM ORA All rights reserved.</span>
            <div className="flex items-center gap-2">
              <span>Built with</span><span className="text-red-500 text-base">❤️</span><span>passion for modern learners</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
    