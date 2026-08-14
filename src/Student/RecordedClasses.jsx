// import React, { useState, useRef, useEffect } from "react";
// import { getStudentBatch } from "@/services/batchService";
// import { getLiveSessionsByBatch } from "@/services/liveSessionService";
// import { Video, PlayCircle, Clock, BookOpen, Radio } from "lucide-react";

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --rc-bg:        #f1f5f9;
//     --rc-card:      #ffffff;
//     --rc-text:      #0f172a;
//     --rc-muted:     #64748b;
//     --rc-border:    #e2e8f0;
//     --rc-accent1:   #22d3ee;
//     --rc-accent2:   #fb923c;
//     --rc-accent3:   #34d399;
//     --rc-accent4:   #a78bfa;
//     --rc-shadow:    0 4px 24px rgba(0,0,0,0.06);
//     --rc-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//     --rc-radius:    20px;
//   }

//   .rc-dark {
//     --rc-bg:        #0a0a0a;
//     --rc-card:      #111111;
//     --rc-text:      #ffffff;
//     --rc-muted:     #94a3b8;
//     --rc-border:    rgba(255,255,255,0.06);
//     --rc-shadow:    0 4px 24px rgba(0,0,0,0.40);
//     --rc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
//   }

//   .rc-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--rc-bg);
//     color: var(--rc-text);
//     padding: 24px;
//     box-sizing: border-box;
//     transition: background 0.3s;
//   }

//   .rc-inner { max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

//   /* ── Header card ── */
//   .rc-header {
//     background: var(--rc-card);
//     border: 1px solid var(--rc-border);
//     border-radius: var(--rc-radius);
//     padding: 28px 32px;
//     box-shadow: var(--rc-shadow);
//     display: flex; align-items: center;
//     justify-content: space-between; gap: 20px; flex-wrap: wrap;
//   }

//   .rc-header-left { display: flex; align-items: center; gap: 16px; }

//   .rc-header-icon {
//     width: 52px; height: 52px; border-radius: 14px;
//     background: rgba(167,139,250,0.10);
//     border: 1px solid rgba(167,139,250,0.18);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--rc-accent4); flex-shrink: 0;
//   }

//   .rc-badge {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 4px 11px; border-radius: 50px;
//     border: 1px solid var(--rc-border);
//     background: rgba(167,139,250,0.08);
//     color: var(--rc-accent4);
//     font-size: 10px; font-weight: 700;
//     letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
//   }

//   .rc-h1 { font-size: 24px; font-weight: 800; color: var(--rc-text); margin: 0 0 2px; }
//   .rc-subtitle { font-size: 13px; color: var(--rc-muted); margin: 0; }

//   .rc-count-chip {
//     padding: 8px 18px; border-radius: 12px;
//     background: var(--rc-bg); border: 1px solid var(--rc-border);
//     font-size: 13px; font-weight: 700; color: var(--rc-accent4);
//     white-space: nowrap; box-shadow: var(--rc-shadow);
//   }

//   /* ── Main row ── */
//   .rc-main { display: flex; gap: 20px; align-items: flex-start; }

//   /* ── Playlist ── */
//   .rc-playlist {
//     width: 300px; flex-shrink: 0;
//     background: var(--rc-card);
//     border: 1px solid var(--rc-border);
//     border-radius: var(--rc-radius);
//     box-shadow: var(--rc-shadow);
//     overflow: hidden;
//   }

//   .rc-playlist-head {
//     padding: 16px 20px;
//     border-bottom: 1px solid var(--rc-border);
//     display: flex; align-items: center; gap: 8px;
//     font-size: 13px; font-weight: 700; color: var(--rc-text);
//   }

//   .rc-playlist-list { padding: 8px 0; }

//   .rc-lesson-btn {
//     display: flex; align-items: center; gap: 12px;
//     padding: 12px 16px; width: 100%;
//     border: none; background: transparent;
//     text-align: left; cursor: pointer;
//     border-left: 3px solid transparent;
//     transition: background 0.15s, border-color 0.15s;
//     font-family: 'Poppins', sans-serif;
//   }

//   .rc-lesson-btn:hover { background: rgba(167,139,250,0.05); }

//   .rc-lesson-btn.active {
//     background: rgba(167,139,250,0.07);
//     border-left-color: var(--rc-accent4);
//   }

//   .rc-lesson-num {
//     width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 11px; font-weight: 800;
//     background: rgba(167,139,250,0.10);
//     color: var(--rc-accent4);
//     border: 1px solid rgba(167,139,250,0.15);
//   }

//   .rc-lesson-btn.active .rc-lesson-num {
//     background: var(--rc-accent4); color: #0a0a0a;
//   }

//   .rc-lesson-info { flex: 1; min-width: 0; }

//   .rc-lesson-title {
//     font-size: 12px; font-weight: 600; color: var(--rc-text);
//     white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 3px;
//   }

//   .rc-lesson-btn.active .rc-lesson-title { color: var(--rc-accent4); }

//   .rc-lesson-meta { font-size: 11px; color: var(--rc-muted); display: flex; gap: 6px; }

//   .rc-loading-state { padding: 24px 20px; font-size: 13px; color: var(--rc-muted); }

//   .rc-empty-state {
//     padding: 32px 20px; text-align: center;
//     color: var(--rc-muted); font-size: 13px;
//   }

//   /* ── Video section ── */
//   .rc-video-section { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; }

//   .rc-player-card {
//     background: var(--rc-card);
//     border: 1px solid var(--rc-border);
//     border-radius: var(--rc-radius);
//     overflow: hidden;
//     box-shadow: var(--rc-shadow);
//   }

//   .rc-live-placeholder {
//     height: 360px; background: #000;
//     display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     gap: 16px; color: white;
//   }

//   .rc-live-icon-wrap {
//     width: 64px; height: 64px; border-radius: 18px;
//     background: rgba(248,113,113,0.20);
//     border: 1px solid rgba(248,113,113,0.30);
//     display: flex; align-items: center; justify-content: center;
//     color: #f87171;
//   }

//   .rc-live-text { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.8); }

//   .rc-select-placeholder {
//     height: 360px; background: var(--rc-bg);
//     display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     gap: 12px; color: var(--rc-muted);
//   }

//   .rc-select-icon {
//     width: 56px; height: 56px; border-radius: 16px;
//     background: rgba(167,139,250,0.10);
//     border: 1px solid rgba(167,139,250,0.15);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--rc-accent4);
//   }

//   .rc-select-text { font-size: 14px; font-weight: 600; color: var(--rc-muted); margin: 0; }

//   /* desc card */
//   .rc-desc-card {
//     background: var(--rc-card);
//     border: 1px solid var(--rc-border);
//     border-radius: var(--rc-radius);
//     padding: 22px 24px;
//     box-shadow: var(--rc-shadow);
//   }

//   .rc-desc-title {
//     font-size: 14px; font-weight: 700; color: var(--rc-text);
//     margin: 0 0 12px; display: flex; align-items: center; gap: 8px;
//   }

//   .rc-desc-text { font-size: 13px; color: var(--rc-muted); margin: 0; line-height: 1.6; }

//   /* ─── RESPONSIVE ────────────────────────────────────────────────── */

//   /* Tablet: 481px – 900px */
//   @media (max-width: 900px) {
//     .rc-root { padding: 16px; }

//     .rc-header {
//       padding: 20px;
//       flex-direction: column;
//       align-items: flex-start;
//       gap: 14px;
//     }

//     .rc-count-chip { align-self: flex-start; }

//     .rc-main {
//       flex-direction: column;
//       gap: 16px;
//     }

//     .rc-playlist {
//       width: 100%;
//       /* Horizontal scrollable playlist on tablet */
//     }

//     .rc-playlist-list {
//       display: flex;
//       flex-direction: row;
//       overflow-x: auto;
//       padding: 8px 8px;
//       gap: 8px;
//       scrollbar-width: thin;
//     }

//     .rc-lesson-btn {
//       flex-direction: column;
//       align-items: center;
//       gap: 6px;
//       padding: 10px 12px;
//       border-left: none;
//       border-bottom: 3px solid transparent;
//       min-width: 110px;
//       max-width: 130px;
//       border-radius: 10px;
//       text-align: center;
//       flex-shrink: 0;
//     }

//     .rc-lesson-btn.active {
//       border-left-color: transparent;
//       border-bottom-color: var(--rc-accent4);
//     }

//     .rc-lesson-info { width: 100%; }

//     .rc-lesson-title {
//       font-size: 11px;
//       white-space: normal;
//       display: -webkit-box;
//       -webkit-line-clamp: 2;
//       -webkit-box-orient: vertical;
//       overflow: hidden;
//       text-align: center;
//     }

//     .rc-lesson-meta { justify-content: center; }

//     .rc-live-placeholder { height: 260px; }
//     .rc-select-placeholder { height: 260px; }

//     .rc-desc-card { padding: 16px 18px; }
//   }

//   /* Phone: up to 480px */
//   @media (max-width: 480px) {
//     .rc-root { padding: 10px; }

//     .rc-inner { gap: 12px; }

//     .rc-header {
//       padding: 14px;
//       border-radius: 16px;
//       gap: 12px;
//     }

//     .rc-header-left { gap: 10px; }

//     .rc-header-icon { width: 40px; height: 40px; border-radius: 10px; }

//     .rc-badge { font-size: 9px; padding: 3px 8px; }

//     .rc-subtitle { font-size: 11px; }

//     .rc-count-chip { font-size: 11px; padding: 6px 12px; border-radius: 10px; }

//     .rc-playlist { border-radius: 14px; }

//     .rc-playlist-head { padding: 12px 14px; font-size: 12px; }

//     .rc-playlist-list {
//       display: flex;
//       flex-direction: row;
//       overflow-x: auto;
//       padding: 6px 8px;
//       gap: 6px;
//       scrollbar-width: thin;
//     }

//     .rc-lesson-btn {
//       flex-direction: column;
//       align-items: center;
//       gap: 4px;
//       padding: 8px 10px;
//       border-left: none;
//       border-bottom: 3px solid transparent;
//       min-width: 90px;
//       max-width: 110px;
//       border-radius: 8px;
//       text-align: center;
//       flex-shrink: 0;
//     }

//     .rc-lesson-btn.active {
//       border-left-color: transparent;
//       border-bottom-color: var(--rc-accent4);
//     }

//     .rc-lesson-num { width: 24px; height: 24px; border-radius: 6px; font-size: 10px; }

//     .rc-lesson-title {
//       font-size: 10px;
//       white-space: normal;
//       display: -webkit-box;
//       -webkit-line-clamp: 2;
//       -webkit-box-orient: vertical;
//       overflow: hidden;
//       text-align: center;
//     }

//     .rc-lesson-meta { font-size: 9px; justify-content: center; }

//     .rc-player-card { border-radius: 14px; }

//     .rc-live-placeholder { height: 200px; gap: 10px; }
//     .rc-live-icon-wrap { width: 48px; height: 48px; border-radius: 12px; }
//     .rc-live-text { font-size: 12px; }

//     .rc-select-placeholder { height: 200px; gap: 8px; }
//     .rc-select-icon { width: 44px; height: 44px; border-radius: 12px; }
//     .rc-select-text { font-size: 12px; }

//     .rc-desc-card { padding: 14px; border-radius: 14px; }
//     .rc-desc-title { font-size: 12px; margin-bottom: 8px; }
//     .rc-desc-text { font-size: 12px; }
//   }
// `;

// if (!document.getElementById("rc-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "rc-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const RecordedClasses = () => {
//   const [lessons, setLessons]           = useState([]);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [loading, setLoading]           = useState(true);
//   const [dark, setDark]                 = useState(isDark);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const fetchLessons = async () => {
//       try {
//         const batch = await getStudentBatch();
//         const batchId = batch?.id;
//         if (!batchId) { setLessons([]); return; }
//         const res = await getLiveSessionsByBatch(batchId);
//         const data = res.data || [];
//         const mapped = data.map((session) => ({
//           id: session.id,
//           title: session.title,
//           description: session.description,
//           videoUrl: "",
//           duration: session.duration + " mins",
//           size: "LIVE",
//         }));
//         setLessons(mapped);
//         if (mapped.length > 0) setSelectedLesson(mapped[0]);
//       } catch (error) {
//         console.error("Failed to fetch lessons:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLessons();
//   }, []);

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDark()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!selectedLesson) return;
//     const savedTime = localStorage.getItem(selectedLesson.id);
//     if (savedTime && videoRef.current) videoRef.current.currentTime = parseFloat(savedTime);
//   }, [selectedLesson]);

//   const handleTimeUpdate = () => {
//     if (!selectedLesson) return;
//     localStorage.setItem(selectedLesson.id, videoRef.current.currentTime);
//   };

//   return (
//     <div className={`rc-root${dark ? " rc-dark" : ""}`}>
//       <div className="rc-inner">

//         {/* ── Header ── */}
//         <div className="rc-header">
//           <div className="rc-header-left">
//             <div className="rc-header-icon"><Video size={24} /></div>
//             <div>
//               <div className="rc-badge"><Video size={10} /> Live & Recorded</div>
//               <h1 style={{
//                 fontFamily: "'Poppins',sans-serif",
//                 fontWeight: 700,
//                 fontSize: "clamp(1.5rem,3vw,2.2rem)",
//                 color: "#3B82F6",
//                 margin: "0 0 6px",
//                 lineHeight: 1.1,
//                 letterSpacing: "-0.02em"
//               }}>
//                 Video Lectures
//               </h1>
//               <p className="rc-subtitle">Watch your recorded and live sessions</p>
//             </div>
//           </div>
//           <div className="rc-count-chip">{lessons.length} videos · HD Streaming</div>
//         </div>

//         {/* ── Main ── */}
//         <div className="rc-main">

//           {/* Playlist */}
//           <div className="rc-playlist">
//             <div className="rc-playlist-head">
//               <BookOpen size={15} style={{ color: "var(--rc-accent4)" }} />
//               Course Content
//             </div>

//             <div className="rc-playlist-list">
//               {loading ? (
//                 <p className="rc-loading-state">Loading...</p>
//               ) : lessons.length === 0 ? (
//                 <p className="rc-empty-state">No recorded lessons available.</p>
//               ) : (
//                 lessons.map((lesson, idx) => (
//                   <button
//                     key={lesson.id}
//                     className={`rc-lesson-btn${selectedLesson?.id === lesson.id ? " active" : ""}`}
//                     onClick={() => setSelectedLesson(lesson)}
//                   >
//                     <div className="rc-lesson-num">{idx + 1}</div>
//                     <div className="rc-lesson-info">
//                       <p className="rc-lesson-title">{lesson.title}</p>
//                       <div className="rc-lesson-meta">
//                         <span>{lesson.duration}</span>
//                         <span>·</span>
//                         <span>{lesson.size}</span>
//                       </div>
//                     </div>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Video + desc */}
//           <div className="rc-video-section">
//             <div className="rc-player-card">
//               {selectedLesson ? (
//                 <div className="rc-live-placeholder">
//                   <div className="rc-live-icon-wrap"><Radio size={28} /></div>
//                   <p className="rc-live-text">🔴 LIVE SESSION — Click to Join</p>
//                 </div>
//               ) : (
//                 <div className="rc-select-placeholder">
//                   <div className="rc-select-icon"><PlayCircle size={26} /></div>
//                   <p className="rc-select-text">Select a lesson to start watching</p>
//                 </div>
//               )}
//             </div>

//             <div className="rc-desc-card">
//               <h3 className="rc-desc-title">
//                 <BookOpen size={15} style={{ color: "var(--rc-accent4)" }} />
//                 Lesson Description
//               </h3>
//               <p className="rc-desc-text">
//                 {selectedLesson?.description || "Lesson description will appear here once backend is connected."}
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecordedClasses;










































import React, { useState, useEffect, useRef } from "react";
import { getStudentBatch } from "@/services/batchService";
import { getLiveSessionsByBatch } from "@/services/liveSessionService";
import { Video, PlayCircle, BookOpen, Radio } from "lucide-react";

// ── Pulled from the same source of truth every other page uses.
// No local tokens, no local <style> injection, no bespoke breakpoints —
// this page now inherits the Golden Reference (DashboardPage) exactly.
import { T, PageContainer, FONT_FAMILY, FONT_WEIGHT, FONT_SIZE, LETTER_SPACING, LINE_HEIGHT } from "@/design-system";

const RecordedClasses = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  // Same dark-mode detection pattern as DashboardPage (data-theme + .dark class,
  // MutationObserver on <html>) — replaces the page's old bespoke isDark() poll.
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

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
    if (!selectedLesson) return;
    const savedTime = localStorage.getItem(selectedLesson.id);
    if (savedTime && videoRef.current) videoRef.current.currentTime = parseFloat(savedTime);
  }, [selectedLesson]);

  const handleTimeUpdate = () => {
    if (!selectedLesson) return;
    localStorage.setItem(selectedLesson.id, videoRef.current.currentTime);
  };

  // Shared card recipe used everywhere in the Golden Reference:
  // t.cardBg / t.border / 20px radius / t.shadow. No local overrides.
  const card = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow };
  const pill = {
    fontSize: 9, fontWeight: FONT_WEIGHT.bold, letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "4px 10px", borderRadius: 999, background: t.pillBg, border: `1px solid ${t.pillBorder}`,
    color: t.pillText, fontFamily: FONT_FAMILY,
  };

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>

      {/* ═══ HERO — same anatomy as DashboardPage: eyebrow dot, H1 in #3B82F6, subtitle, live badge ═══ */}
      <div className="dfade" style={{
        padding: "8px 0 24px",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${t.borderHero}`,
        marginBottom: 20,
        boxShadow: "none",
      }}>
        <div className="hero-flex">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} className="d1" />
              <span style={{ fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, textTransform: "uppercase", color: t.textSub, fontFamily: FONT_FAMILY }}>
                Student Portal
              </span>
            </div>
            <h1 style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              color: "#3B82F6",
              margin: "0 0 6px",
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}>
              Recorded Lectures
            </h1>
            <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
              Watch your recorded and live sessions
            </p>
          </div>

          <div className="hero-badges">
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 12px" }}>
              <Video size={12} color={t.actIcon} />
              <span style={{ fontSize: 11, fontWeight: FONT_WEIGHT.semibold, color: t.textSub, fontFamily: FONT_FAMILY }}>
                {lessons.length} videos · HD Streaming
              </span>
            </div>
            <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 999, padding: "8px 18px", color: "#7c3aed", fontSize: 11, fontWeight: FONT_WEIGHT.bold, letterSpacing: "0.1em", fontFamily: FONT_FAMILY }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN ROW — playlist + player, same card recipe & spacing as the dashboard row grid ═══ */}
      <div className="dash-row-grid" style={{ gridTemplateColumns: "300px 1fr", marginBottom: 14 }}>

        {/* Playlist */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={15} color="#7c3aed" />
            <span style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>Course Content</span>
          </div>

          <div style={{ padding: "8px 0" }}>
            {loading ? (
              <p style={{ padding: "24px 20px", fontSize: 13, color: t.textMuted, fontFamily: FONT_FAMILY }}>Loading...</p>
            ) : lessons.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Video size={20} color={t.emptyIcon} />
                </div>
                <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>No recorded lessons available.</p>
              </div>
            ) : (
              lessons.map((lesson, idx) => {
                const active = selectedLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, width: "100%",
                      padding: "12px 16px", border: "none", background: active ? "rgba(124,58,237,0.06)" : "transparent",
                      borderLeft: `3px solid ${active ? "#7c3aed" : "transparent"}`,
                      textAlign: "left", cursor: "pointer", fontFamily: FONT_FAMILY,
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = t.cardBgHov; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: FONT_WEIGHT.extrabold, fontFamily: FONT_FAMILY,
                      background: active ? "#7c3aed" : "rgba(124,58,237,0.1)",
                      color: active ? "#fff" : "#7c3aed",
                      border: active ? "none" : "1px solid rgba(124,58,237,0.2)",
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 12, fontWeight: FONT_WEIGHT.semibold, margin: "0 0 3px",
                        color: active ? "#7c3aed" : t.text,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        fontFamily: FONT_FAMILY,
                      }}>
                        {lesson.title}
                      </p>
                      <div style={{ display: "flex", gap: 6, fontSize: 11, color: t.textMuted, fontFamily: FONT_FAMILY }}>
                        <span>{lesson.duration}</span><span>·</span><span>{lesson.size}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Video + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...card, overflow: "hidden" }}>
            {selectedLesson ? (
              <div style={{ height: 360, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#fff" }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(248,113,113,0.20)", border: "1px solid rgba(248,113,113,0.30)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}>
                  <Radio size={28} />
                </div>
                <p style={{ fontSize: 14, fontWeight: FONT_WEIGHT.bold, color: "rgba(255,255,255,0.8)", fontFamily: FONT_FAMILY, margin: 0 }}>
                  🔴 LIVE SESSION — Click to Join
                </p>
              </div>
            ) : (
              <div style={{ height: 360, background: t.pageBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
                  <PlayCircle size={26} />
                </div>
                <p style={{ fontSize: 14, fontWeight: FONT_WEIGHT.semibold, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
                  Select a lesson to start watching
                </p>
              </div>
            )}
          </div>

          <div style={{ ...card, padding: "22px 24px" }}>
            <h3 style={{ fontSize: 14, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_FAMILY }}>
              <BookOpen size={15} color="#7c3aed" /> Lesson Description
            </h3>
            <p style={{ fontSize: 13, color: t.textMuted, margin: 0, lineHeight: 1.6, fontFamily: FONT_FAMILY }}>
              {selectedLesson?.description || "Lesson description will appear here once backend is connected."}
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default RecordedClasses;