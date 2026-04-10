// import React, { useState, useRef, useEffect } from "react";
// import { getStudentBatch } from "@/services/batchService";
// import { getLiveSessionsByBatch } from "@/services/liveSessionService";

// const RecordedClasses = () => {
//   const [lessons, setLessons] = useState([]);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const videoRef = useRef(null);

//   /* ================= FETCH LIVE SESSIONS ================= */
//   useEffect(() => {
//     const fetchLessons = async () => {
//       try {
//         // ✅ Get student batch
//         const batch = await getStudentBatch();
//         const batchId = batch?.id;

//         if (!batchId) {
//           setLessons([]);
//           return;
//         }

//         // ✅ Get LIVE sessions
//         const res = await getLiveSessionsByBatch(batchId);
//         const data = res.data || [];

//         // ✅ Map to UI format (NO UI CHANGE)
//         const mapped = data.map((session) => ({
//           id: session.id,
//           title: session.title,
//           description: session.description,
//           videoUrl: "", // live → no video file
//           duration: session.duration + " mins",
//           size: "LIVE",
//         }));

//         setLessons(mapped);

//         if (mapped.length > 0) {
//           setSelectedLesson(mapped[0]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch lessons:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLessons();
//   }, []);

//   /* ================= RESUME PLAYBACK ================= */
//   useEffect(() => {
//     if (!selectedLesson) return;

//     const savedTime = localStorage.getItem(selectedLesson.id);

//     if (savedTime && videoRef.current) {
//       videoRef.current.currentTime = parseFloat(savedTime);
//     }
//   }, [selectedLesson]);

//   const handleTimeUpdate = () => {
//     if (!selectedLesson) return;
//     localStorage.setItem(selectedLesson.id, videoRef.current.currentTime);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 text-gray-900 dark:bg-[#0B1120] dark:text-white">
//       {/* HEADER */}
//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-semibold">🎬 Video Lectures</h2>
//             <div className="text-sm opacity-90 mt-2">
//               {lessons.length} videos • HD Streaming
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN */}
//       <div className="flex gap-8">
//         {/* PLAYLIST */}
//         <div className="w-80 p-6 rounded-2xl shadow-md bg-white border border-gray-200 dark:bg-[#111827] dark:border-white/10">
//           <h3 className="font-semibold mb-4">Course Content</h3>

//           {loading ? (
//             <p className="text-sm text-gray-500">Loading...</p>
//           ) : lessons.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No recorded lessons available.
//             </p>
//           ) : (
//             lessons.map((lesson) => (
//               <div
//                 key={lesson.id}
//                 onClick={() => setSelectedLesson(lesson)}
//                 className={`p-3 rounded-xl cursor-pointer mb-3 transition
//                 ${
//                   selectedLesson?.id === lesson.id
//                     ? "bg-blue-100 dark:bg-blue-900/40"
//                     : "hover:bg-gray-200 dark:hover:bg-[#1F2937]"
//                 }`}
//               >
//                 <div className="text-sm font-medium">{lesson.title}</div>

//                 <div className="text-xs text-gray-500 dark:text-slate-400">
//                   {lesson.duration} • {lesson.size}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* VIDEO SECTION */}
//         <div className="flex-1">
//           <div className="rounded-3xl overflow-hidden shadow-2xl bg-black">
//             {selectedLesson ? (
//               <div className="h-[480px] flex items-center justify-center text-white">
//                 🔴 LIVE SESSION - Click to Join
//               </div>
//             ) : (
//               <div className="h-[480px] flex items-center justify-center text-gray-400">
//                 Select a lesson to start watching
//               </div>
//             )}
//           </div>

//           {/* DESCRIPTION */}
//           <div className="mt-6 p-6 rounded-2xl shadow-md bg-white dark:bg-[#111827] dark:border dark:border-white/10">
//             <h3 className="font-semibold mb-3">Lesson Description</h3>

//             <p className="text-sm text-gray-600 dark:text-slate-400">
//               {selectedLesson?.description ||
//                 "Lesson description will appear here once backend is connected."}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecordedClasses;






















import React, { useState, useRef, useEffect } from "react";
import { getStudentBatch } from "@/services/batchService";
import { getLiveSessionsByBatch } from "@/services/liveSessionService";
import { Video, PlayCircle, Clock, BookOpen, Radio } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --rc-bg:        #f1f5f9;
    --rc-card:      #ffffff;
    --rc-text:      #0f172a;
    --rc-muted:     #64748b;
    --rc-border:    #e2e8f0;
    --rc-accent1:   #22d3ee;
    --rc-accent2:   #fb923c;
    --rc-accent3:   #34d399;
    --rc-accent4:   #a78bfa;
    --rc-shadow:    0 4px 24px rgba(0,0,0,0.06);
    --rc-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --rc-radius:    20px;
  }

  .rc-dark {
    --rc-bg:        #0a0a0a;
    --rc-card:      #111111;
    --rc-text:      #ffffff;
    --rc-muted:     #94a3b8;
    --rc-border:    rgba(255,255,255,0.06);
    --rc-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --rc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .rc-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--rc-bg);
    color: var(--rc-text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s;
  }

  .rc-inner { max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  /* ── Header card ── */
  .rc-header {
    background: var(--rc-card);
    border: 1px solid var(--rc-border);
    border-radius: var(--rc-radius);
    padding: 28px 32px;
    box-shadow: var(--rc-shadow);
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
  }

  .rc-header-left { display: flex; align-items: center; gap: 16px; }

  .rc-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(167,139,250,0.10);
    border: 1px solid rgba(167,139,250,0.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--rc-accent4); flex-shrink: 0;
  }

  .rc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 50px;
    border: 1px solid var(--rc-border);
    background: rgba(167,139,250,0.08);
    color: var(--rc-accent4);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
  }

  .rc-h1 { font-size: 24px; font-weight: 800; color: var(--rc-text); margin: 0 0 2px; }
  .rc-subtitle { font-size: 13px; color: var(--rc-muted); margin: 0; }

  .rc-count-chip {
    padding: 8px 18px; border-radius: 12px;
    background: var(--rc-bg); border: 1px solid var(--rc-border);
    font-size: 13px; font-weight: 700; color: var(--rc-accent4);
    white-space: nowrap; box-shadow: var(--rc-shadow);
  }

  /* ── Main row ── */
  .rc-main { display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; }

  /* ── Playlist ── */
  .rc-playlist {
    width: 300px; flex-shrink: 0;
    background: var(--rc-card);
    border: 1px solid var(--rc-border);
    border-radius: var(--rc-radius);
    box-shadow: var(--rc-shadow);
    overflow: hidden;
  }

  .rc-playlist-head {
    padding: 16px 20px;
    border-bottom: 1px solid var(--rc-border);
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 700; color: var(--rc-text);
  }

  .rc-playlist-list { padding: 8px 0; }

  .rc-lesson-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; width: 100%;
    border: none; background: transparent;
    text-align: left; cursor: pointer;
    border-left: 3px solid transparent;
    transition: background 0.15s, border-color 0.15s;
    font-family: 'Poppins', sans-serif;
  }

  .rc-lesson-btn:hover { background: rgba(167,139,250,0.05); }

  .rc-lesson-btn.active {
    background: rgba(167,139,250,0.07);
    border-left-color: var(--rc-accent4);
  }

  .rc-lesson-num {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800;
    background: rgba(167,139,250,0.10);
    color: var(--rc-accent4);
    border: 1px solid rgba(167,139,250,0.15);
  }

  .rc-lesson-btn.active .rc-lesson-num {
    background: var(--rc-accent4); color: #0a0a0a;
  }

  .rc-lesson-info { flex: 1; min-width: 0; }

  .rc-lesson-title {
    font-size: 12px; font-weight: 600; color: var(--rc-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 3px;
  }

  .rc-lesson-btn.active .rc-lesson-title { color: var(--rc-accent4); }

  .rc-lesson-meta { font-size: 11px; color: var(--rc-muted); display: flex; gap: 6px; }

  .rc-loading-state { padding: 24px 20px; font-size: 13px; color: var(--rc-muted); }

  .rc-empty-state {
    padding: 32px 20px; text-align: center;
    color: var(--rc-muted); font-size: 13px;
  }

  /* ── Video section ── */
  .rc-video-section { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; }

  .rc-player-card {
    background: var(--rc-card);
    border: 1px solid var(--rc-border);
    border-radius: var(--rc-radius);
    overflow: hidden;
    box-shadow: var(--rc-shadow);
  }

  .rc-live-placeholder {
    height: 360px; background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; color: white;
  }

  .rc-live-icon-wrap {
    width: 64px; height: 64px; border-radius: 18px;
    background: rgba(248,113,113,0.20);
    border: 1px solid rgba(248,113,113,0.30);
    display: flex; align-items: center; justify-content: center;
    color: #f87171;
  }

  .rc-live-text { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.8); }

  .rc-select-placeholder {
    height: 360px; background: var(--rc-bg);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; color: var(--rc-muted);
  }

  .rc-select-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(167,139,250,0.10);
    border: 1px solid rgba(167,139,250,0.15);
    display: flex; align-items: center; justify-content: center;
    color: var(--rc-accent4);
  }

  .rc-select-text { font-size: 14px; font-weight: 600; color: var(--rc-muted); margin: 0; }

  /* desc card */
  .rc-desc-card {
    background: var(--rc-card);
    border: 1px solid var(--rc-border);
    border-radius: var(--rc-radius);
    padding: 22px 24px;
    box-shadow: var(--rc-shadow);
  }

  .rc-desc-title {
    font-size: 14px; font-weight: 700; color: var(--rc-text);
    margin: 0 0 12px; display: flex; align-items: center; gap: 8px;
  }

  .rc-desc-text { font-size: 13px; color: var(--rc-muted); margin: 0; line-height: 1.6; }
`;

if (!document.getElementById("rc-styles")) {
  const tag = document.createElement("style");
  tag.id = "rc-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const RecordedClasses = () => {
  const [lessons, setLessons]           = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [dark, setDark]                 = useState(isDark);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const batch = await getStudentBatch();
        const batchId = batch?.id;
        if (!batchId) { setLessons([]); return; }
        const res = await getLiveSessionsByBatch(batchId);
        const data = res.data || [];
        const mapped = data.map((session) => ({
          id: session.id,
          title: session.title,
          description: session.description,
          videoUrl: "",
          duration: session.duration + " mins",
          size: "LIVE",
        }));
        setLessons(mapped);
        if (mapped.length > 0) setSelectedLesson(mapped[0]);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedLesson) return;
    const savedTime = localStorage.getItem(selectedLesson.id);
    if (savedTime && videoRef.current) videoRef.current.currentTime = parseFloat(savedTime);
  }, [selectedLesson]);

  const handleTimeUpdate = () => {
    if (!selectedLesson) return;
    localStorage.setItem(selectedLesson.id, videoRef.current.currentTime);
  };

  return (
    <div className={`rc-root${dark ? " rc-dark" : ""}`}>
      <div className="rc-inner">

        {/* ── Header ── */}
        <div className="rc-header">
          <div className="rc-header-left">
            <div className="rc-header-icon"><Video size={24} /></div>
            <div>
              <div className="rc-badge"><Video size={10} /> Live & Recorded</div>
              <h1 className="rc-h1">Video Lectures</h1>
              <p className="rc-subtitle">Watch your recorded and live sessions</p>
            </div>
          </div>
          <div className="rc-count-chip">{lessons.length} videos · HD Streaming</div>
        </div>

        {/* ── Main ── */}
        <div className="rc-main">

          {/* Playlist */}
          <div className="rc-playlist">
            <div className="rc-playlist-head">
              <BookOpen size={15} style={{ color: "var(--rc-accent4)" }} />
              Course Content
            </div>

            <div className="rc-playlist-list">
              {loading ? (
                <p className="rc-loading-state">Loading...</p>
              ) : lessons.length === 0 ? (
                <p className="rc-empty-state">No recorded lessons available.</p>
              ) : (
                lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    className={`rc-lesson-btn${selectedLesson?.id === lesson.id ? " active" : ""}`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="rc-lesson-num">{idx + 1}</div>
                    <div className="rc-lesson-info">
                      <p className="rc-lesson-title">{lesson.title}</p>
                      <div className="rc-lesson-meta">
                        <span>{lesson.duration}</span>
                        <span>·</span>
                        <span>{lesson.size}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Video + desc */}
          <div className="rc-video-section">
            <div className="rc-player-card">
              {selectedLesson ? (
                <div className="rc-live-placeholder">
                  <div className="rc-live-icon-wrap"><Radio size={28} /></div>
                  <p className="rc-live-text">🔴 LIVE SESSION — Click to Join</p>
                </div>
              ) : (
                <div className="rc-select-placeholder">
                  <div className="rc-select-icon"><PlayCircle size={26} /></div>
                  <p className="rc-select-text">Select a lesson to start watching</p>
                </div>
              )}
            </div>

            <div className="rc-desc-card">
              <h3 className="rc-desc-title">
                <BookOpen size={15} style={{ color: "var(--rc-accent4)" }} />
                Lesson Description
              </h3>
              <p className="rc-desc-text">
                {selectedLesson?.description || "Lesson description will appear here once backend is connected."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecordedClasses;