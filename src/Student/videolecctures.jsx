// import React, { useEffect, useRef, useState } from "react";
// import videoService from "../services/videoService";
// import { progressService } from "../services/progressService";
// import StudentNotebook from "./StudentNotebook";
// import {
//   BookOpen,
//   CheckCircle,
//   ChevronRight,
//   Clock,
//   Film,
//   HardDrive,
//   Play,
//   PlayCircle,
//   Video,
//   LayoutPanelLeft,
// } from "lucide-react";

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --vl-bg:          #f0f2f5;
//     --vl-surface:     #ffffff;
//     --vl-surface2:    #f8f9fb;
//     --vl-text:        #1a1d23;
//     --vl-text2:       #5a6072;
//     --vl-border:      #e3e6ed;
//     --vl-border2:     #d0d5e0;
//     --vl-accent:      #2563eb;
//     --vl-accent-bg:   rgba(37,99,235,0.07);
//     --vl-accent-bdr:  rgba(37,99,235,0.18);
//     --vl-green:       #16a34a;
//     --vl-green-bg:    rgba(22,163,74,0.08);
//     --vl-green-bdr:   rgba(22,163,74,0.20);
//     --vl-shadow-sm:   0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
//     --vl-radius-sm:   8px;
//     --vl-collapse:    36px;
//   }

//   .vl-dark {
//     --vl-bg:          #0d1117;
//     --vl-surface:     #161b22;
//     --vl-surface2:    #1c2230;
//     --vl-text:        #e6edf3;
//     --vl-text2:       #7d8590;
//     --vl-border:      rgba(255,255,255,0.08);
//     --vl-border2:     rgba(255,255,255,0.12);
//     --vl-accent:      #4f8ef7;
//     --vl-accent-bg:   rgba(79,142,247,0.10);
//     --vl-accent-bdr:  rgba(79,142,247,0.22);
//     --vl-green:       #3fb950;
//     --vl-green-bg:    rgba(63,185,80,0.10);
//     --vl-green-bdr:   rgba(63,185,80,0.22);
//     --vl-shadow-sm:   0 1px 3px rgba(0,0,0,0.30);
//   }

//   * { box-sizing: border-box; }

//   .vl-root {
//     font-family: 'Poppins', sans-serif;
//     background: var(--vl-bg);
//     color: var(--vl-text);
//     display: flex;
//     flex-direction: column;
//     height: 100vh;
//     overflow: hidden;
//   }

//   /* ── Top header ── */
//   .vl-topbar {
//     background: var(--vl-surface);
//     border-bottom: 1px solid var(--vl-border);
//     padding: 0 24px;
//     height: 56px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 16px;
//     flex-shrink: 0;
//     box-shadow: var(--vl-shadow-sm);
//     z-index: 10;
//   }

//   .vl-topbar-left { display: flex; align-items: center; gap: 12px; }

//   .vl-topbar-icon {
//     width: 34px; height: 34px;
//     border-radius: var(--vl-radius-sm);
//     background: var(--vl-accent-bg);
//     border: 1px solid var(--vl-accent-bdr);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--vl-accent); flex-shrink: 0;
//   }

//   .vl-topbar-title {
//     font-size: 15px; font-weight: 700;
//     color: var(--vl-text); margin: 0; line-height: 1.2;
//   }

//   .vl-topbar-sub { display: flex; align-items: center; gap: 8px; margin: 1px 0 0; }

//   .vl-topbar-meta {
//     display: flex; align-items: center; gap: 3px;
//     font-size: 11px; color: var(--vl-text2); font-weight: 500;
//   }

//   .vl-hd-badge {
//     padding: 1px 7px; border-radius: 4px;
//     background: var(--vl-accent-bg); border: 1px solid var(--vl-accent-bdr);
//     color: var(--vl-accent); font-size: 10px; font-weight: 700;
//   }

//   .vl-prog-pill {
//     display: flex; align-items: center; gap: 8px;
//     padding: 6px 14px;
//     background: var(--vl-surface2); border: 1px solid var(--vl-border);
//     border-radius: 50px; box-shadow: var(--vl-shadow-sm);
//   }

//   .vl-prog-label { font-size: 10px; font-weight: 600; color: var(--vl-text2); text-transform: uppercase; letter-spacing: 0.06em; }
//   .vl-prog-val { font-size: 12px; font-weight: 700; color: var(--vl-green); }
//   .vl-prog-track { width: 64px; height: 4px; border-radius: 99px; background: var(--vl-border); overflow: hidden; }
//   .vl-prog-fill { height: 100%; border-radius: 99px; background: var(--vl-green); transition: width 0.5s ease; }

//   /* ── Workspace ── */
//   .vl-workspace { flex: 1; display: flex; min-height: 0; overflow: hidden; }

//   /* ── Panel shell ── */
//   .vl-panel {
//     display: flex; flex-direction: column;
//     background: var(--vl-surface);
//     overflow: hidden; flex-shrink: 0;
//     transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
//   }

//   /* panel header */
//   .vl-panel-hd {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 0 12px; height: 44px;
//     border-bottom: 1px solid var(--vl-border);
//     background: var(--vl-surface2);
//     flex-shrink: 0; gap: 8px;
//   }

//   .vl-panel-hd-left {
//     display: flex; align-items: center; gap: 6px;
//     font-size: 12px; font-weight: 700; color: var(--vl-text);
//     white-space: nowrap; overflow: hidden; min-width: 0;
//   }

//   .vl-panel-hd-icon { color: var(--vl-accent); flex-shrink: 0; }

//   .vl-panel-count {
//     font-size: 10px; font-weight: 600; color: var(--vl-text2);
//     background: var(--vl-surface); border: 1px solid var(--vl-border);
//     border-radius: 50px; padding: 1px 7px; white-space: nowrap; flex-shrink: 0;
//   }

//   /* ── CRM-style divider with arrows ── */
//   .vl-divider {
//     width: 14px; flex-shrink: 0;
//     display: flex; align-items: center; justify-content: center;
//     background: var(--vl-surface2);
//     border-left: 1px solid var(--vl-border);
//     border-right: 1px solid var(--vl-border);
//     position: relative; z-index: 2;
//     cursor: col-resize;
//     transition: background 0.15s;
//   }

//   .vl-divider:hover { background: rgba(37,99,235,0.04); }

//   /* The ◀▶ pill — same as CRM */
//   .vl-div-pill {
//     position: absolute;
//     top: 50%; left: 50%;
//     transform: translate(-50%, -50%);
//     width: 18px; height: 48px;
//     border-radius: 6px;
//     background: var(--vl-surface);
//     border: 1px solid var(--vl-border2);
//     display: flex; flex-direction: column;
//     align-items: center; justify-content: center; gap: 2px;
//     cursor: pointer;
//     box-shadow: var(--vl-shadow-sm);
//     transition: background 0.15s, border-color 0.15s;
//     z-index: 3;
//     user-select: none;
//   }

//   .vl-div-pill:hover {
//     background: var(--vl-accent-bg);
//     border-color: var(--vl-accent-bdr);
//   }

//   .vl-div-arrow { color: var(--vl-text2); display: flex; align-items: center; }
//   .vl-div-pill:hover .vl-div-arrow { color: var(--vl-accent); }

//   /* ── Library list ── */
//   .vl-library-list { flex: 1; overflow-y: auto; padding: 4px 0; }
//   .vl-library-list::-webkit-scrollbar { width: 3px; }
//   .vl-library-list::-webkit-scrollbar-track { background: transparent; }
//   .vl-library-list::-webkit-scrollbar-thumb { background: var(--vl-border2); border-radius: 4px; }

//   .vl-lib-item {
//     display: flex; align-items: center; gap: 10px;
//     padding: 9px 12px;
//     border: none; background: transparent;
//     width: 100%; text-align: left; cursor: pointer;
//     border-left: 3px solid transparent;
//     transition: background 0.12s, border-color 0.12s;
//     font-family: 'Poppins', sans-serif;
//   }

//   .vl-lib-item:hover { background: var(--vl-surface2); }
//   .vl-lib-item.active { background: var(--vl-accent-bg); border-left-color: var(--vl-accent); }
//   .vl-lib-item.watched { background: var(--vl-green-bg); border-left-color: var(--vl-green); }

//   .vl-lib-num {
//     width: 22px; height: 22px; border-radius: 6px;
//     background: var(--vl-surface2); border: 1px solid var(--vl-border);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 10px; font-weight: 700; color: var(--vl-text2); flex-shrink: 0;
//   }

//   .vl-lib-item.active .vl-lib-num { background: var(--vl-accent); border-color: var(--vl-accent); color: white; }
//   .vl-lib-item.watched .vl-lib-num { background: var(--vl-green); border-color: var(--vl-green); color: white; }

//   .vl-lib-thumb {
//     width: 38px; height: 26px; border-radius: 5px;
//     display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//   }

//   .vl-lib-info { flex: 1; min-width: 0; }

//   .vl-lib-name {
//     font-size: 11px; font-weight: 600; color: var(--vl-text);
//     white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 2px;
//   }

//   .vl-lib-item.active .vl-lib-name { color: var(--vl-accent); }
//   .vl-lib-item.watched .vl-lib-name { color: var(--vl-green); }

//   .vl-lib-meta { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--vl-text2); }

//   .vl-lib-badge { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; }
//   .vl-lib-badge.playing { background: var(--vl-accent-bg); color: var(--vl-accent); }
//   .vl-lib-badge.done { background: var(--vl-green-bg); color: var(--vl-green); }

//   .vl-lib-bars { display: flex; gap: 2px; align-items: flex-end; height: 13px; }
//   .vl-lib-bar { width: 3px; border-radius: 2px; background: white; }

//   .vl-lib-empty {
//     display: flex; flex-direction: column; align-items: center;
//     gap: 10px; padding: 36px 16px; color: var(--vl-text2);
//     font-size: 12px; font-weight: 500; text-align: center;
//   }

//   .vl-lib-empty-icon {
//     width: 38px; height: 38px; border-radius: 10px;
//     background: var(--vl-surface2); border: 1px solid var(--vl-border);
//     display: flex; align-items: center; justify-content: center;
//   }

//   /* ── MIDDLE panel ── */
//   .vl-player-panel {
//     flex: 1; min-width: 0;
//     border-left: 1px solid var(--vl-border);
//     border-right: 1px solid var(--vl-border);
//     display: flex; flex-direction: column;
//   }

//   .vl-player-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

//   .vl-video-wrap { background: #000; flex-shrink: 0; }
//   .vl-video-wrap video { display: block; width: 100%; aspect-ratio: 16/9; }

//   .vl-player-info {
//     padding: 14px 18px;
//     border-bottom: 1px solid var(--vl-border);
//     display: flex; align-items: center; justify-content: space-between;
//     gap: 12px; flex-shrink: 0;
//   }

//   .vl-player-info-left { display: flex; align-items: center; gap: 10px; }

//   .vl-player-thumb {
//     width: 34px; height: 34px; border-radius: 8px;
//     display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//   }

//   .vl-player-vname { font-size: 13px; font-weight: 700; color: var(--vl-text); margin: 0 0 2px; }
//   .vl-player-vsize { font-size: 10px; color: var(--vl-text2); font-weight: 500; }

//   .vl-live-badge {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 4px 10px; border-radius: 50px;
//     background: var(--vl-green-bg); border: 1px solid var(--vl-green-bdr);
//     color: var(--vl-green); font-size: 10px; font-weight: 700;
//   }

//   .vl-live-dot {
//     width: 6px; height: 6px; border-radius: 50%; background: var(--vl-green);
//     animation: vl-pulse 1.5s ease-in-out infinite;
//   }

//   @keyframes vl-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

//   .vl-watched-row {
//     padding: 10px 18px;
//     display: flex; align-items: center; justify-content: space-between;
//     border-bottom: 1px solid var(--vl-border);
//     background: var(--vl-surface2); flex-shrink: 0;
//   }

//   .vl-mark-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 7px 16px; border-radius: var(--vl-radius-sm); border: none;
//     background: var(--vl-green); color: #fff;
//     font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700;
//     cursor: pointer; box-shadow: 0 2px 8px rgba(22,163,74,0.22);
//     transition: opacity 0.15s, transform 0.15s;
//   }

//   .vl-mark-btn:hover { opacity: 0.88; transform: translateY(-1px); }

//   .vl-mark-done {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 7px 12px; border-radius: var(--vl-radius-sm);
//     background: var(--vl-green-bg); border: 1px solid var(--vl-green-bdr);
//     color: var(--vl-green); font-size: 11px; font-weight: 700;
//     font-family: 'Poppins', sans-serif;
//   }

//   .vl-watched-stat { font-size: 10px; color: var(--vl-text2); font-weight: 600; }

//   .vl-next-row { padding: 10px 18px; flex-shrink: 0; }

//   .vl-next-btn {
//     display: flex; align-items: center; gap: 8px;
//     padding: 9px 12px; border-radius: var(--vl-radius-sm);
//     border: 1px solid var(--vl-border); background: var(--vl-surface2);
//     color: var(--vl-text2);
//     font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600;
//     cursor: pointer; width: 100%; text-align: left;
//     transition: border-color 0.15s, color 0.15s, background 0.15s;
//   }

//   .vl-next-btn:hover {
//     border-color: var(--vl-accent-bdr); color: var(--vl-accent); background: var(--vl-accent-bg);
//   }

//   .vl-next-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

//   .vl-empty-state {
//     flex: 1; display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     gap: 14px; padding: 48px 32px; min-height: 280px;
//   }

//   .vl-empty-icon {
//     width: 68px; height: 68px; border-radius: 18px;
//     background: var(--vl-accent-bg); border: 1px solid var(--vl-accent-bdr);
//     display: flex; align-items: center; justify-content: center; color: var(--vl-accent);
//   }

//   .vl-empty-title { font-size: 15px; font-weight: 700; color: var(--vl-text); margin: 0 0 3px; }
//   .vl-empty-sub { font-size: 12px; color: var(--vl-text2); margin: 0; text-align: center; font-weight: 500; }

//   .vl-open-btn {
//     display: inline-flex; align-items: center; gap: 7px;
//     padding: 9px 18px; border-radius: var(--vl-radius-sm); border: none;
//     background: var(--vl-accent); color: #fff;
//     font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
//     cursor: pointer; transition: opacity 0.15s, transform 0.15s;
//   }

//   .vl-open-btn:hover { opacity: 0.88; transform: translateY(-1px); }

//   /* notes */
//   .vl-notes-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

//   /* collapsed icon strip */
//   .vl-collapsed-strip {
//     flex: 1; display: flex; flex-direction: column;
//     align-items: center; padding-top: 12px; gap: 6px;
//     cursor: pointer;
//   }

//   .vl-collapsed-strip:hover { background: var(--vl-accent-bg); }

//   .vl-collapsed-label {
//     writing-mode: vertical-rl;
//     text-orientation: mixed;
//     transform: rotate(180deg);
//     font-size: 10px; font-weight: 700;
//     color: var(--vl-text2); letter-spacing: 0.08em;
//     text-transform: uppercase; white-space: nowrap; user-select: none;
//     margin-top: 10px;
//   }

//   @keyframes vl-b1 { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.5)} }
// `;

// if (!document.getElementById("vl-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "vl-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const GRADS = [
//   "linear-gradient(135deg,#6d28d9,#4338ca)",
//   "linear-gradient(135deg,#0891b2,#0e7490)",
//   "linear-gradient(135deg,#be123c,#9f1239)",
//   "linear-gradient(135deg,#b45309,#92400e)",
//   "linear-gradient(135deg,#047857,#065f46)",
//   "linear-gradient(135deg,#1d4ed8,#1e40af)",
// ];
// const grad = (s) => GRADS[(s?.charCodeAt(0) ?? 0) % GRADS.length];

// const getEmailFromToken = () => {
//   try {
//     const token = localStorage.getItem("lms_token");
//     if (!token) return null;
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch { return null; }
// };

// const isDarkMode = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ── CRM-style Divider ──
//    Shows a pill with two small chevron arrows pointing away from each other (◀ ▶)
//    Click → toggles adjacent panel | Drag → resizes
// */
// const Divider = ({ onMouseDown, onToggle, panelOpen, side }) => {
//   // For left divider: arrows point ◀ ▶ when open, ▶ ◀ when collapsed
//   // For right divider: arrows point ▶ ◀ when open, ◀ ▶ when collapsed
//   const topArrow  = (side === "left") ? (panelOpen ? "left"  : "right") : (panelOpen ? "right" : "left");
//   const botArrow  = (side === "left") ? (panelOpen ? "right" : "left")  : (panelOpen ? "left"  : "right");

//   const ArrowSvg = ({ dir }) => (
//     <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="vl-div-arrow">
//       {dir === "left"
//         ? <path d="M5 1.5L2.5 4L5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//         : <path d="M3 1.5L5.5 4L3 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//       }
//     </svg>
//   );

//   return (
//     <div className="vl-divider" onMouseDown={onMouseDown}>
//       <div
//         className="vl-div-pill"
//         onMouseDown={(e) => e.stopPropagation()}
//         onClick={onToggle}
//         title={panelOpen ? "Collapse panel" : "Expand panel"}
//       >
//         <ArrowSvg dir={topArrow} />
//         <ArrowSvg dir={botArrow} />
//       </div>
//     </div>
//   );
// };

// /* ════════════ MAIN ════════════ */
// const VideoLectures = () => {
//   const [videos, setVideos]               = useState([]);
//   const [videoUrls, setVideoUrls]         = useState({});
//   const [playingId, setPlayingId]         = useState(null);
//   const [watchedVideoIds, setWatchedVideoIds] = useState([]);
//   const [watchPercentage, setWatchPercentage] = useState(0);
//   const [libraryOpen, setLibraryOpen]     = useState(true);
//   const [notesOpen, setNotesOpen]         = useState(true);
//   const [libraryW, setLibraryW]           = useState(260);
//   const [notesW, setNotesW]               = useState(280);
//   const [dark, setDark]                   = useState(isDarkMode);

//   const dragging = useRef(null);
//   const startX   = useRef(0);
//   const startW   = useRef(0);

//   const studentEmail = getEmailFromToken();

//   useEffect(() => {
//     videoService.getStudentVideos().then(async (res) => {
//       const data = res.data || [];
//       setVideos(data);
//       if (data.length > 0 && studentEmail) {
//         try {
//           const prog = await progressService.getVideoProgress(studentEmail, data[0].batchId);
//           setWatchedVideoIds(prog.data.watchedVideoIds || []);
//           setWatchPercentage(prog.data.watchPercentage || 0);
//         } catch {
//           setWatchedVideoIds([]); setWatchPercentage(0);
//         }
//       }
//     }).catch(console.error);
//   }, []);

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDarkMode()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   const onResizeStart = (side) => (e) => {
//     dragging.current = side;
//     startX.current = e.clientX;
//     startW.current = side === "left" ? libraryW : notesW;
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   };

//   useEffect(() => {
//     const onMove = (e) => {
//       if (!dragging.current) return;
//       const dx = e.clientX - startX.current;
//       if (dragging.current === "left") setLibraryW(Math.min(400, Math.max(180, startW.current + dx)));
//       else setNotesW(Math.min(420, Math.max(200, startW.current - dx)));
//     };
//     const onUp = () => {
//       dragging.current = null;
//       document.body.style.cursor = "";
//       document.body.style.userSelect = "";
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//     return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//   }, []);

//   const playVideo = async (video) => {
//     if (!videoUrls[video.id]) {
//       try {
//         const res = await videoService.getVideoBlob(video.storedFileName);
//         setVideoUrls((p) => ({ ...p, [video.id]: URL.createObjectURL(res.data) }));
//       } catch { alert("Unable to play video"); return; }
//     }
//     setPlayingId(video.id);
//   };

//   const markWatched = async (video) => {
//     if (!studentEmail) return;
//     try {
//       const res = await progressService.markVideoWatched(studentEmail, video.batchId, video.id, videos.length);
//       setWatchedVideoIds(res.data.watchedVideoIds || []);
//       setWatchPercentage(res.data.watchPercentage || 0);
//     } catch (err) { console.error("Mark watched failed", err); }
//   };

//   const selectedVideo = videos.find((v) => v.id === playingId);
//   const totalSizeMB   = Math.round(videos.reduce((a, v) => a + (v.size || 0), 0) / 1024 / 1024);
//   const currentIdx    = videos.findIndex((v) => v.id === playingId);

//   return (
//     <div className={`vl-root${dark ? " vl-dark" : ""}`}>

//       {/* ── Topbar ── */}
//       <div className="vl-topbar">
//         <div className="vl-topbar-left">
//           <div className="vl-topbar-icon"><LayoutPanelLeft size={17} /></div>
//           <div>
//             <p className="vl-topbar-title">Video Lectures</p>
//             <div className="vl-topbar-sub">
//               <span className="vl-topbar-meta"><Video size={10} /> {videos.length} {videos.length === 1 ? "video" : "videos"}</span>
//               <span className="vl-topbar-meta"><HardDrive size={10} /> {totalSizeMB} MB</span>
//               <span className="vl-hd-badge">HD Quality</span>
//             </div>
//           </div>
//         </div>
//         <div className="vl-prog-pill">
//           <CheckCircle size={14} color="var(--vl-green)" />
//           <span className="vl-prog-label">Progress</span>
//           <span className="vl-prog-val">{watchedVideoIds.length}/{Math.max(videos.length, 1)}</span>
//           {videos.length > 0 && (
//             <div className="vl-prog-track">
//               <div className="vl-prog-fill" style={{ width: `${watchPercentage}%` }} />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── 3-Panel Workspace ── */}
//       <div className="vl-workspace">

//         {/* PANEL 1: Library */}
//         <div className="vl-panel" style={{ width: libraryOpen ? libraryW : "var(--vl-collapse)", borderRight: "none" }}>
//           <div className="vl-panel-hd" style={{ justifyContent: libraryOpen ? "space-between" : "center" }}>
//             {libraryOpen ? (
//               <div className="vl-panel-hd-left">
//                 <span className="vl-panel-hd-icon"><BookOpen size={13} /></span>
//                 Lecture Library
//                 <span className="vl-panel-count">{videos.length}</span>
//               </div>
//             ) : (
//               <BookOpen size={14} color="var(--vl-accent)" />
//             )}
//           </div>
//           {libraryOpen ? (
//             <div className="vl-library-list">
//               {videos.length === 0 ? (
//                 <div className="vl-lib-empty">
//                   <div className="vl-lib-empty-icon"><Video size={17} /></div>
//                   No videos available yet
//                 </div>
//               ) : videos.map((v, index) => {
//                 const active    = playingId === v.id;
//                 const isWatched = watchedVideoIds.includes(v.id);
//                 const sizeMb    = Math.round((v.size || 0) / 1024 / 1024);
//                 const title     = v.title || v.originalFileName || "Untitled";
//                 return (
//                   <button
//                     key={v.id}
//                     onClick={() => playVideo(v)}
//                     className={`vl-lib-item${active ? " active" : isWatched ? " watched" : ""}`}
//                   >
//                     <span className="vl-lib-num">
//                       {active ? (
//                         <div className="vl-lib-bars">
//                           <div className="vl-lib-bar" style={{ height: 9,  animation: "vl-b1 0.6s ease-in-out infinite" }} />
//                           <div className="vl-lib-bar" style={{ height: 13, animation: "vl-b1 0.6s ease-in-out 0.1s infinite" }} />
//                           <div className="vl-lib-bar" style={{ height: 7,  animation: "vl-b1 0.6s ease-in-out 0.2s infinite" }} />
//                         </div>
//                       ) : isWatched ? <CheckCircle size={11} color="white" /> : index + 1}
//                     </span>
//                     <div className="vl-lib-thumb" style={{ background: grad(title) }}>
//                       <Play size={11} color="white" />
//                     </div>
//                     <div className="vl-lib-info">
//                       <p className="vl-lib-name">{title}</p>
//                       <div className="vl-lib-meta">
//                         <Clock size={9} />
//                         <span>{sizeMb} MB</span>
//                         {active     && <span className="vl-lib-badge playing">● Playing</span>}
//                         {isWatched && !active && <span className="vl-lib-badge done">✓ Done</span>}
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="vl-collapsed-strip" onClick={() => setLibraryOpen(true)} title="Expand Lecture Library">
//               <span className="vl-collapsed-label">Lecture Library</span>
//             </div>
//           )}
//         </div>

//         {/* DIVIDER 1 */}
//         <Divider
//           side="left"
//           panelOpen={libraryOpen}
//           onMouseDown={libraryOpen ? onResizeStart("left") : undefined}
//           onToggle={() => setLibraryOpen((o) => !o)}
//         />

//         {/* PANEL 2: Player */}
//         <div className="vl-panel vl-player-panel">
//           <div className="vl-panel-hd">
//             <div className="vl-panel-hd-left">
//               <span className="vl-panel-hd-icon"><Film size={13} /></span>
//               {selectedVideo ? (selectedVideo.title || selectedVideo.originalFileName || "Playing") : "Video Player"}
//             </div>
//             {selectedVideo && (
//               <span className="vl-live-badge">
//                 <span className="vl-live-dot" /> Now Playing
//               </span>
//             )}
//           </div>
//           <div className="vl-player-body">
//             {playingId && videoUrls[playingId] ? (
//               <>
//                 <div className="vl-video-wrap">
//                   <video controls autoPlay controlsList="nodownload" disablePictureInPicture src={videoUrls[playingId]} />
//                 </div>
//                 <div className="vl-player-info">
//                   <div className="vl-player-info-left">
//                     <div className="vl-player-thumb" style={{ background: grad(selectedVideo?.title || "") }}>
//                       <Film size={15} color="white" />
//                     </div>
//                     <div>
//                       <p className="vl-player-vname">{selectedVideo?.title || selectedVideo?.originalFileName}</p>
//                       <p className="vl-player-vsize">
//                         {Math.round((selectedVideo?.size || 0) / 1024 / 1024)} MB · Lecture {currentIdx + 1} of {videos.length}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 {selectedVideo && (
//                   <div className="vl-watched-row">
//                     {watchedVideoIds.includes(selectedVideo.id) ? (
//                       <div className="vl-mark-done"><CheckCircle size={13} /> Marked as Watched</div>
//                     ) : (
//                       <button className="vl-mark-btn" onClick={() => markWatched(selectedVideo)}>
//                         <CheckCircle size={13} /> Mark as Watched
//                       </button>
//                     )}
//                     <span className="vl-watched-stat">{watchedVideoIds.length} / {videos.length} watched</span>
//                   </div>
//                 )}
//                 {currentIdx < videos.length - 1 && (
//                   <div className="vl-next-row">
//                     <button className="vl-next-btn" onClick={() => playVideo(videos[currentIdx + 1])}>
//                       <PlayCircle size={14} style={{ color: "var(--vl-accent)", flexShrink: 0 }} />
//                       <span className="vl-next-label">
//                         Next: {videos[currentIdx + 1]?.title || videos[currentIdx + 1]?.originalFileName}
//                       </span>
//                       <ChevronRight size={13} style={{ flexShrink: 0 }} />
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="vl-empty-state">
//                 <div className="vl-empty-icon"><PlayCircle size={34} /></div>
//                 <div style={{ textAlign: "center" }}>
//                   <p className="vl-empty-title">Select a lecture to play</p>
//                   <p className="vl-empty-sub">
//                     Choose a video from the {libraryOpen ? "Lecture Library on the left" : "library panel"}
//                   </p>
//                 </div>
//                 {!libraryOpen && (
//                   <button className="vl-open-btn" onClick={() => setLibraryOpen(true)}>
//                     <BookOpen size={13} /> Open Lecture Library
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* DIVIDER 2 */}
//         <Divider
//           side="right"
//           panelOpen={notesOpen}
//           onMouseDown={notesOpen ? onResizeStart("right") : undefined}
//           onToggle={() => setNotesOpen((o) => !o)}
//         />

//         {/* PANEL 3: Notes */}
//         <div className="vl-panel" style={{ width: notesOpen ? notesW : "var(--vl-collapse)", borderLeft: "none" }}>
//           <div className="vl-panel-hd" style={{ justifyContent: notesOpen ? "space-between" : "center" }}>
//             {notesOpen ? (
//               <div className="vl-panel-hd-left">
//                 <span className="vl-panel-hd-icon"><BookOpen size={13} /></span>
//                 My Notes
//               </div>
//             ) : (
//               <BookOpen size={14} color="var(--vl-accent)" />
//             )}
//           </div>
//           {notesOpen ? (
//             <div className="vl-notes-body">
//               <StudentNotebook
//                 lectureId={playingId ?? "default"}
//                 lectureTitle={selectedVideo ? (selectedVideo.title || selectedVideo.originalFileName || "Lecture") : "Lecture"}
//                 isDark={dark}
//               />
//             </div>
//           ) : (
//             <div className="vl-collapsed-strip" onClick={() => setNotesOpen(true)} title="Expand My Notes">
//               <span className="vl-collapsed-label">My Notes</span>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default VideoLectures;






















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
  Globe,
  HardDrive,
  Layers,
  Link,
  Play,
  PlayCircle,
  Tag,
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
    display: flex; align-items: flex-start; gap: 12px;
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
    width: 44px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    margin-top: 2px;
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

  .vl-list-sub { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--vl-muted); flex-wrap: wrap; }
  .vl-list-desc { font-size: 10.5px; color: var(--vl-muted); margin: 3px 0 0; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .vl-list-course { font-size: 10px; font-weight: 600; color: var(--vl-accent4); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vl-list-pills { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 4px; }
  .vl-list-pill { font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }

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
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 16px 24px 12px; border-top: 1px solid var(--vl-border); flex-shrink: 0;
    flex-wrap: wrap; gap: 12px;
  }

  .vl-info-left { display: flex; align-items: flex-start; gap: 12px; flex: 1; min-width: 0; }

  .vl-info-thumb {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
  }

  .vl-info-text { flex: 1; min-width: 0; }
  .vl-info-title { font-size: 14px; font-weight: 700; color: var(--vl-text); margin: 0 0 3px; }
  .vl-info-desc { font-size: 12px; color: var(--vl-muted); margin: 0 0 6px; line-height: 1.45; }
  .vl-info-size { font-size: 11px; color: var(--vl-muted); }

  .vl-info-pills { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
  .vl-info-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 10px; font-weight: 700;
    font-family: 'Poppins', sans-serif;
  }
  .vl-info-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
  .vl-info-tag {
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 8px; font-family: 'Poppins', sans-serif;
  }

  .vl-playing-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 50px;
    background: rgba(52,211,153,0.10);
    border: 1px solid rgba(52,211,153,0.20);
    color: var(--vl-accent3); font-size: 11px; font-weight: 700;
    flex-shrink: 0;
  }

  .vl-pulse {
    width: 6px; height: 6px; border-radius: 50%; background: var(--vl-accent3);
    animation: vl-pulse 1.5s ease-in-out infinite;
  }

  @keyframes vl-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

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

  /* iframe player */
  .vl-iframe-player {
    width: 100%; aspect-ratio: 16/9;
    border: none; display: block; background: #000;
  }
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

/* ─────────────────── URL → EMBED CONVERTER ─────────────────── */
const parseVideoUrl = (rawUrl) => {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();

  // YouTube
  const ytWatch  = url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/);
  const ytShorts = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  const ytEmbed  = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (ytWatch || ytShorts || ytEmbed) {
    const id = (ytWatch || ytShorts || ytEmbed)[1];
    return { type: "iframe", url: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` };
  }

  // Vimeo
  const vimeo = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
  if (vimeo) {
    return { type: "iframe", url: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  // Already an embed URL
  if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com/video/")) {
    return { type: "iframe", url };
  }

  // Direct video file
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) {
    return { type: "video", url };
  }

  // Fallback
  return { type: "video", url };
};

/**
 * Returns the raw source URL for a URL-based video, or null for uploaded files.
 * Checks multiple possible field names your backend might use.
 */
const getVideoSourceUrl = (video) => {
  if (!video) return null;
  return (
    video.videoUrl     ||
    video.originalUrl  ||
    video.sourceUrl    ||
    video.url          ||
    video.embedUrl     ||
    null
  );
};

const isUploadedFile = (video) => {
  if (!video) return false;
  const hasSourceUrl = !!getVideoSourceUrl(video);
  if (hasSourceUrl) return false;
  return !!(video.storedFileName && video.storedFileName.trim());
};

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

/* ── small inline pill ── */
const InfoPill = ({ bg, color, border, children }) => (
  <span className="vl-info-pill" style={{ background: bg, color, border: `1px solid ${border || "transparent"}` }}>
    {children}
  </span>
);

/* ─────────────────── SMART PLAYER ─────────────────── */
/**
 * Renders the right player:
 * - blobUrl provided  → uploaded file, use <video>
 * - sourceUrl provided → URL-based video, detect + render <iframe> or <video>
 */
const SmartPlayer = ({ blobUrl, sourceUrl, autoPlay = true }) => {
  if (blobUrl) {
    return (
      <video
        style={{ width: "100%", aspectRatio: "16/9" }}
        controls
        autoPlay={autoPlay}
        controlsList="nodownload"
        disablePictureInPicture
        src={blobUrl}
      />
    );
  }

  if (sourceUrl) {
    const parsed = parseVideoUrl(sourceUrl);
    if (!parsed) return null;

    if (parsed.type === "iframe") {
      return (
        <iframe
          className="vl-iframe-player"
          src={parsed.url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title="Video player"
        />
      );
    }

    // Direct MP4/WebM
    return (
      <video
        style={{ width: "100%", aspectRatio: "16/9" }}
        controls
        autoPlay={autoPlay}
        controlsList="nodownload"
        disablePictureInPicture
        src={parsed.url}
      />
    );
  }

  return null;
};

/* ════════════ MAIN ════════════ */
const VideoLectures = () => {
  const [videos,     setVideos]     = useState([]);
  // For uploaded files: stores blob URLs keyed by video.id
  const [videoUrls,  setVideoUrls]  = useState({});
  const [playingId,  setPlayingId]  = useState(null);

  // ✅ Progress state from backend
  const [watchedVideoIds,  setWatchedVideoIds]  = useState([]);
  const [watchPercentage,  setWatchPercentage]  = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarW,    setSidebarW]    = useState(300);
  const [dark,        setDark]        = useState(isDarkMode);

  // Loading state while fetching blob for uploaded video
  const [loadingVideoId, setLoadingVideoId] = useState(null);

  const dragging = useRef(false);
  const startX   = useRef(0);
  const startW   = useRef(300);

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

  /* ── Play a video (handles both uploaded files and URL-based) ── */
  const playVideo = async (video) => {
    const sourceUrl = getVideoSourceUrl(video);

    if (sourceUrl) {
      // URL-based video — no blob fetch needed, just set the playing ID
      setPlayingId(video.id);
      return;
    }

    // Uploaded file — fetch blob if not already cached
    if (!videoUrls[video.id]) {
      if (!video.storedFileName) {
        alert("Video source not found");
        return;
      }
      try {
        setLoadingVideoId(video.id);
        setPlayingId(video.id); // switch view immediately so loading shows in player
        const res = await videoService.getVideoBlob(video.storedFileName);
        const blobUrl = URL.createObjectURL(res.data);
        setVideoUrls((prev) => ({ ...prev, [video.id]: blobUrl }));
      } catch {
        alert("Unable to play video");
        setPlayingId(null);
        return;
      } finally {
        setLoadingVideoId(null);
      }
    } else {
      setPlayingId(video.id);
    }
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
      setSidebarW(Math.min(460, Math.max(220, startW.current + (e.clientX - startX.current))));
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

  /* ── helper to get metadata fields ── */
  const getVideoMeta = (v) => {
    let tags = [];
    if (Array.isArray(v?.tags)) {
      tags = v.tags.filter(Boolean);
    } else if (typeof v?.tags === "string" && v.tags.trim()) {
      tags = v.tags.split(",").map(tg => tg.trim()).filter(Boolean);
    }
    return {
      desc:       v?.description || v?.shortDesc || "",
      courseName: v?.course || v?.courseName || v?.playlist || "",
      category:   v?.category || "",
      language:   v?.language || "",
      tags,
      visibility: v?.visibility || "",
    };
  };

  /* ── Determine what to render in the player area ── */
  const renderPlayer = () => {
    if (!playingId || !selectedVideo) return null;

    const sourceUrl = getVideoSourceUrl(selectedVideo);
    const blobUrl   = videoUrls[playingId];
    const isLoading = loadingVideoId === playingId;

    // Still fetching blob for uploaded video
    if (isLoading && !blobUrl && !sourceUrl) {
      return (
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Poppins', sans-serif", fontSize: 13 }}>
            Loading video…
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: "#000", flexShrink: 0 }}>
        <SmartPlayer
          blobUrl={sourceUrl ? null : blobUrl}
          sourceUrl={sourceUrl || null}
          autoPlay
        />
      </div>
    );
  };

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
                      const active    = playingId === v.id;
                      const isWatched = watchedVideoIds.includes(v.id);
                      const sizeMb    = Math.round((v.size || 0) / 1024 / 1024);
                      const title     = v.title || v.originalFileName || "Untitled";
                      const meta      = getVideoMeta(v);
                      const isUrlVid  = !!getVideoSourceUrl(v);

                      return (
                        <button
                          key={v.id}
                          onClick={() => playVideo(v)}
                          className={`vl-list-item${active ? " active" : isWatched ? " watched" : ""}`}
                        >
                          {/* thumbnail */}
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

                          {/* info */}
                          <div className="vl-list-info">
                            <p className="vl-list-title">{index + 1}. {title}</p>

                            <div className="vl-list-sub">
                              {isUrlVid
                                ? <><Link size={10} /><span>External URL</span></>
                                : <><Clock size={10} /><span>{sizeMb} MB</span></>
                              }
                              {active    && <span className="vl-playing-dot">● Playing</span>}
                              {isWatched && !active && <span className="vl-watched-dot">✓ Watched</span>}
                            </div>

                            {meta.courseName && (
                              <p className="vl-list-course">
                                <BookOpen size={9} style={{ marginRight: 3, verticalAlign: "middle" }} />
                                {meta.courseName}
                              </p>
                            )}

                            {meta.desc && (
                              <p className="vl-list-desc">{meta.desc}</p>
                            )}

                            {(meta.category || meta.language) && (
                              <div className="vl-list-pills">
                                {meta.category && (
                                  <span className="vl-list-pill" style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c" }}>
                                    {meta.category}
                                  </span>
                                )}
                                {meta.language && (
                                  <span className="vl-list-pill" style={{ background: "rgba(34,211,238,0.10)", color: "var(--vl-accent1)" }}>
                                    {meta.language}
                                  </span>
                                )}
                              </div>
                            )}

                            {meta.tags.length > 0 && (
                              <div className="vl-list-pills" style={{ marginTop: 3 }}>
                                {meta.tags.slice(0, 3).map((tag, i) => (
                                  <span key={i} className="vl-list-pill" style={{ background: "rgba(167,139,250,0.12)", color: "var(--vl-accent4)" }}>
                                    #{tag}
                                  </span>
                                ))}
                                {meta.tags.length > 3 && (
                                  <span style={{ fontSize: 9, color: "var(--vl-muted)", fontFamily: "'Poppins',sans-serif" }}>+{meta.tags.length - 3}</span>
                                )}
                              </div>
                            )}
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
              {playingId && selectedVideo ? (
                <>
                  {/* ── Video / iframe player ── */}
                  {renderPlayer()}

                  {/* ── Info bar with all metadata ── */}
                  {(() => {
                    const meta      = getVideoMeta(selectedVideo);
                    const isUrlVid  = !!getVideoSourceUrl(selectedVideo);
                    return (
                      <div className="vl-info-bar">
                        <div className="vl-info-left">
                          <div className="vl-info-thumb" style={{ background: grad(selectedVideo?.title || "") }}>
                            <Film size={16} color="white" />
                          </div>
                          <div className="vl-info-text">
                            <p className="vl-info-title">{selectedVideo?.title || selectedVideo?.originalFileName}</p>

                            {meta.desc && (
                              <p className="vl-info-desc">{meta.desc}</p>
                            )}

                            <p className="vl-info-size">
                              {isUrlVid
                                ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Link size={10} /> External URL video</span>
                                : `${Math.round((selectedVideo?.size || 0) / 1024 / 1024)} MB`
                              }
                            </p>

                            <div className="vl-info-pills">
                              {meta.courseName && (
                                <InfoPill bg="rgba(167,139,250,0.12)" color="var(--vl-accent4)" border="rgba(167,139,250,0.2)">
                                  <BookOpen size={9} />{meta.courseName}
                                </InfoPill>
                              )}
                              {meta.category && (
                                <InfoPill bg="rgba(251,146,60,0.12)" color="#fb923c" border="rgba(251,146,60,0.2)">
                                  <Layers size={9} />{meta.category}
                                </InfoPill>
                              )}
                              {meta.language && (
                                <InfoPill bg="rgba(34,211,238,0.10)" color="var(--vl-accent1)" border="rgba(34,211,238,0.2)">
                                  <Globe size={9} />{meta.language}
                                </InfoPill>
                              )}
                            </div>

                            {meta.tags.length > 0 && (
                              <div className="vl-info-tags">
                                <Tag size={10} color="var(--vl-muted)" style={{ marginTop: 2 }} />
                                {meta.tags.map((tag, i) => (
                                  <span key={i} className="vl-info-tag" style={{ background: "rgba(167,139,250,0.10)", color: "var(--vl-accent4)" }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* playing badge */}
                        <span className="vl-playing-badge">
                          <span className="vl-pulse" />
                          Playing
                        </span>
                      </div>
                    );
                  })()}

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

                  {/* ✅ Next video button */}
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
