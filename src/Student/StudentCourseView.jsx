// import axios from "axios";
// import {
//   Award,
//   BookOpen,
//   CheckCircle,
//   ChevronRight,
//   File,
//   FileText,
//   GraduationCap,
//   Lock,
//   PlayCircle,
//   Video,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { progressService } from "../services/progressService";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const getEmailFromToken = () => {
//   try {
//     const token = localStorage.getItem("lms_token");
//     if (!token) return null;
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch {
//     return null;
//   }
// };

// /* ─── CSS — matches MyCourses exactly ───────────────────────────────────── */
// const THEME_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   /* ── LIGHT TOKENS ── */
//   .scv-root {
//     --bg:           #f1f5f9;
//     --card:         #ffffff;
//     --text:         #0f172a;
//     --text-muted:   #64748b;
//     --border:       #e2e8f0;
//     --accent1:      #22d3ee;
//     --accent2:      #fb923c;
//     --accent3:      #34d399;
//     --accent4:      #a78bfa;
//     --shadow:       0 4px 24px rgba(0,0,0,0.06);
//     --shadow-lg:    0 8px 40px rgba(0,0,0,0.10);
//     --radius:       20px;

//     /* module states */
//     --bg-active-hdr:      linear-gradient(135deg,#eef2ff,#f5f3ff);
//     --bg-module-locked:   #f8fafc;
//     --bg-prog-track:      #e2e8f0;
//     --border-active:      #6366f1;
//     --border-done-mod:    #86efac;
//     --border-player:      #c7d2fe;
//     --text-done:          #15803d;
//     --text-watch:         #92400e;
//     --bg-status-done:     #f0fdf4;
//     --bg-status-watch:    #fffbeb;
//     --bg-badge-video:     #ede9fe;
//     --bg-badge-pdf:       #dbeafe;
//     --bg-badge-done:      #dcfce7;
//     --bg-badge-locked:    #f1f5f9;
//     --text-badge-video:   #7c3aed;
//     --text-badge-pdf:     #1d4ed8;
//     --border-status-done: #86efac;
//     --border-status-watch:#fde68a;
//     --bg-celebration:     linear-gradient(135deg,#f0fdf4,#ecfdf5);
//     --border-celebration: #86efac;
//     --bg-alert:           #fffbeb;
//     --border-alert:       #fde68a;
//     --text-alert:         #92400e;
//     --accent:             #6366f1;
//     --accent2-mod:        #a855f7;
//     --accent-teal:        #14b8a6;
//     --shadow-player:      0 4px 16px rgba(0,0,0,0.08);
//   }

//   /* ── DARK TOKENS ── */
//   .scv-root.dark-theme {
//     --bg:           #0a0a0a;
//     --card:         #111111;
//     --text:         #ffffff;
//     --text-muted:   #94a3b8;
//     --border:       rgba(255,255,255,0.06);
//     --shadow:       0 4px 24px rgba(0,0,0,0.40);
//     --shadow-lg:    0 8px 40px rgba(0,0,0,0.60);

//     --bg-active-hdr:      linear-gradient(135deg,#16161f,#111118);
//     --bg-module-locked:   #0d0d14;
//     --bg-prog-track:      #1c1c28;
//     --border-active:      #6366f1;
//     --border-done-mod:    #0d3d1f;
//     --border-player:      #1e1e40;
//     --text-done:          #22c55e;
//     --text-watch:         #e0a800;
//     --bg-status-done:     #051a0e;
//     --bg-status-watch:    #1c1400;
//     --bg-badge-video:     #16101f;
//     --bg-badge-pdf:       #0c1020;
//     --bg-badge-done:      #051a0e;
//     --bg-badge-locked:    #111118;
//     --text-badge-video:   #9b7eef;
//     --text-badge-pdf:     #5b9cf6;
//     --border-status-done: #0d3d1f;
//     --border-status-watch:#3d2800;
//     --bg-celebration:     linear-gradient(135deg,#051a0e,#041610);
//     --border-celebration: #0d3d1f;
//     --bg-alert:           #1c1400;
//     --border-alert:       #3d2800;
//     --text-alert:         #e0a800;
//     --accent:             #6366f1;
//     --accent2-mod:        #a855f7;
//     --accent-teal:        #14b8a6;
//     --shadow-player:      0 4px 28px rgba(0,0,0,0.65);
//   }

//   /* ── BASE ── */
//   .scv-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--bg);
//     color: var(--text);
//     padding: 24px;
//     box-sizing: border-box;
//     transition: background 0.3s, color 0.3s;
//   }

//   .scv-inner {
//     max-width: 1300px;
//     margin: 0 auto;
//   }

//   /* ══ HERO CARD — matches mc-header exactly ══ */
//   .scv-hero {
//     background: var(--card);
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     padding: 32px 36px;
//     margin-bottom: 28px;
//     box-shadow: var(--shadow);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 24px;
//     flex-wrap: wrap;
//     transition: background 0.3s, border-color 0.3s;
//   }

//   .scv-hero-left {}

//   /* badge */
//   .scv-hero-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 5px 12px;
//     border-radius: 50px;
//     border: 1px solid var(--border);
//     background: rgba(34,211,238,0.08);
//     color: var(--accent1);
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     margin-bottom: 14px;
//   }

//   .scv-hero-title {
//     font-size: 32px;
//     font-weight: 800;
//     color: var(--text);
//     margin: 0 0 6px;
//     line-height: 1.15;
//   }

//   .scv-hero-desc {
//     font-size: 13px;
//     color: var(--text-muted);
//     margin: 0 0 24px;
//   }

//   /* stat chips — identical to mc-stat */
//   .scv-stats-row {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 12px;
//     margin-bottom: 20px;
//   }

//   .scv-stat-chip {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     background: var(--bg);
//     border: 1px solid var(--border);
//     border-radius: 14px;
//     padding: 14px 20px;
//     min-width: 140px;
//     box-shadow: var(--shadow);
//   }

//   .scv-stat-icon-wrap {
//     width: 40px;
//     height: 40px;
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     flex-shrink: 0;
//   }

//   .scv-stat-num {
//     font-size: 22px;
//     font-weight: 800;
//     line-height: 1;
//     margin-bottom: 3px;
//   }

//   .scv-stat-lbl {
//     font-size: 10px;
//     font-weight: 600;
//     color: var(--text-muted);
//     text-transform: uppercase;
//     letter-spacing: 0.06em;
//   }

//   /* progress */
//   .scv-prog-wrap   { max-width: 420px; }
//   .scv-prog-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
//   .scv-prog-title  { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
//   .scv-prog-pct    { font-size: 11px; font-weight: 700; color: var(--accent1); }
//   .scv-prog-track  { width: 100%; height: 6px; border-radius: 99px; background: var(--border); margin-bottom: 8px; overflow: hidden; }
//   .scv-prog-fill   { height: 100%; border-radius: 99px; background: var(--accent1); transition: width 0.5s ease; }
//   .scv-prog-sub    { font-size: 10px; color: var(--text-muted); }

//   .scv-done-banner {
//     display: inline-flex; align-items: center; gap: 6px;
//     background: var(--bg-badge-done); border: 1px solid var(--border-done-mod);
//     border-radius: 9px; padding: 5px 13px; margin-top: 8px;
//     font-size: 11.5px; font-weight: 700; color: var(--text-done);
//   }

//   /* hero illustration — matches mc-header-icon */
//   .scv-hero-illus {
//     width: 120px; height: 120px;
//     border-radius: var(--radius);
//     background: rgba(34,211,238,0.08);
//     border: 1px solid rgba(34,211,238,0.15);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 48px; color: var(--accent1); flex-shrink: 0;
//     transition: transform 0.3s ease;
//   }
//   .scv-hero-illus:hover { transform: translateY(-2px) scale(1.04); }

//   @media (max-width: 768px) {
//     .scv-hero-illus { display: none; }
//     .scv-hero-title { font-size: 24px; }
//     .scv-hero { padding: 20px; }
//     .scv-root { padding: 12px; }
//   }

//   /* ── BODY GRID ── */
//   .scv-grid {
//     display: grid;
//     grid-template-columns: 1fr 2fr;
//     gap: 20px;
//   }

//   @media (max-width: 768px) {
//     .scv-grid { grid-template-columns: 1fr; }
//   }

//   /* ── SIDE CARD — matches mc-card style ── */
//   .scv-side-card {
//     background: var(--card);
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     box-shadow: var(--shadow);
//     padding: 20px;
//     position: sticky; top: 16px;
//     max-height: calc(100vh - 40px); overflow-y: auto;
//     transition: background 0.3s, border-color 0.3s;
//   }

//   .scv-side-hdr {
//     display: flex; align-items: center; gap: 8px;
//     padding-bottom: 14px; border-bottom: 1px solid var(--border); margin-bottom: 12px;
//   }
//   .scv-side-title { font-size: 14px; font-weight: 700; color: var(--text); }

//   .scv-alert-box {
//     background: var(--bg-alert); border: 1px solid var(--border-alert);
//     border-radius: 10px; padding: 8px 12px;
//     font-size: 10.5px; font-weight: 500; color: var(--text-alert); margin-bottom: 12px;
//   }

//   /* MODULE ITEMS */
//   .scv-mod {
//     border-radius: 12px; padding: 10px 12px; margin-bottom: 8px;
//     transition: box-shadow 0.2s, border-color 0.2s, background 0.25s;
//     border: 1px solid transparent;
//   }
//   .scv-mod-active   { background: var(--bg-active-hdr);  border-color: var(--border-active); cursor: pointer; }
//   .scv-mod-done     { background: var(--bg-status-done); border-color: var(--border-done-mod); cursor: pointer; }
//   .scv-mod-unlocked { background: var(--card); border-color: var(--border); cursor: pointer; }
//   .scv-mod-unlocked:hover { border-color: var(--accent1); box-shadow: 0 2px 12px rgba(34,211,238,0.12); }
//   .scv-mod-locked   { background: var(--bg-module-locked); border-color: var(--border); cursor: not-allowed; opacity: 0.45; }

//   .scv-mod-row { display: flex; gap: 8px; align-items: flex-start; }

//   .scv-idx {
//     width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 11px; font-weight: 700;
//   }
//   .scv-idx-done    { background: #22c55e; color: #fff; }
//   .scv-idx-active  { background: var(--accent); color: #fff; }
//   .scv-idx-unlocked{ background: var(--bg); color: var(--text-muted); border: 1px solid var(--border); }
//   .scv-idx-locked  { background: var(--border); color: var(--text-muted); }

//   .scv-mod-title        { font-size: 11.5px; font-weight: 600; line-height: 1.35; margin-bottom: 5px; color: var(--text); }
//   .scv-mod-title-locked { color: var(--text-muted); }

//   .scv-bdg-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
//   .scv-bdg {
//     font-size: 9px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
//     display: inline-flex; align-items: center; gap: 3px;
//   }
//   .scv-bdg-video  { background: var(--bg-badge-video); color: var(--text-badge-video); }
//   .scv-bdg-pdf    { background: var(--bg-badge-pdf);   color: var(--text-badge-pdf); }
//   .scv-bdg-done   { background: var(--bg-badge-done);  color: var(--text-done); }
//   .scv-bdg-locked { background: var(--bg-badge-locked);color: var(--text-muted); }
//   .scv-watch-hint { font-size: 9px; color: var(--text-muted); font-style: italic; }

//   .scv-btn {
//     width: 100%; display: flex; align-items: center; justify-content: center; gap: 5px;
//     padding: 7px 10px; border-radius: 8px; border: none;
//     font-size: 10.5px; font-weight: 600; font-family: 'Poppins', sans-serif;
//     cursor: pointer; transition: opacity 0.2s, transform 0.2s;
//   }
//   .scv-btn-video-on  { background: var(--accent1); color: #0a0a0a; }
//   .scv-btn-video-on:hover { opacity: 0.85; transform: translateY(-1px); }
//   .scv-btn-video-off { background: var(--border); color: var(--text-muted); cursor: not-allowed; }
//   .scv-btn-pdf-on    { background: var(--bg); border: 1px solid var(--border) !important; color: var(--text); }
//   .scv-btn-pdf-on:hover  { border-color: var(--accent1) !important; transform: translateY(-1px); }
//   .scv-btn-pdf-off   { background: var(--bg); border: 1px solid var(--border) !important; color: var(--text-muted); cursor: not-allowed; }

//   /* ── PLAYER CARD ── */
//   .scv-player-card {
//     background: var(--card); border-radius: var(--radius);
//     box-shadow: var(--shadow); padding: 20px;
//     border: 1px solid var(--border);
//     transition: background 0.3s, border-color 0.3s;
//   }

//   .scv-empty {
//     height: 460px; display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     background: var(--bg);
//     border-radius: 14px; border: 2px dashed var(--border);
//   }
//   .scv-empty-icon  { color: var(--accent1); opacity: 0.6; margin-bottom: 12px; }
//   .scv-empty-title { font-size: 15px; font-weight: 700; color: var(--text-muted); margin: 0 0 4px; }
//   .scv-empty-sub   { font-size: 12px; color: var(--text-muted); margin: 0; }

//   .scv-act-hdr {
//     background: var(--bg); border: 1px solid var(--border);
//     border-radius: 12px; padding: 12px 14px;
//     display: flex; gap: 10px; align-items: flex-start; margin-bottom: 14px;
//     transition: background 0.3s;
//   }
//   .scv-act-icon {
//     width: 36px; height: 36px; border-radius: 10px;
//     background: var(--accent1);
//     display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//   }
//   .scv-act-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 5px; }
//   .scv-act-bdg-row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }

//   .scv-video-wrap {
//     border-radius: 12px; overflow: hidden;
//     border: 1px solid var(--border); margin-bottom: 12px;
//     box-shadow: var(--shadow-player);
//   }
//   .scv-video       { width: 100%; aspect-ratio: 16/9; background: #000; display: block; }
//   .scv-iframe-wrap { width: 100%; height: 460px; border-radius: 12px; border: 1px solid var(--border); display: block; }

//   .scv-status-bar  { display: flex; align-items: center; justify-content: space-between; padding-top: 6px; flex-wrap: wrap; gap: 8px; }
//   .scv-status-done {
//     display: flex; align-items: center; gap: 6px; padding: 7px 14px;
//     background: var(--bg-status-done); border: 1px solid var(--border-status-done);
//     border-radius: 10px; font-size: 11.5px; font-weight: 600; color: var(--text-done);
//   }
//   .scv-status-watch {
//     display: flex; align-items: center; gap: 6px; padding: 7px 14px;
//     background: var(--bg-status-watch); border: 1px solid var(--border-status-watch);
//     border-radius: 10px; font-size: 11.5px; font-weight: 500; color: var(--text-watch);
//   }
//   .scv-status-count { font-size: 10px; color: var(--text-muted); }

//   .scv-celebration {
//     display: flex; align-items: center; gap: 10px; padding: 14px; margin-top: 12px;
//     background: var(--bg-celebration); border: 1px solid var(--border-celebration); border-radius: 12px;
//   }
//   .scv-celeb-title { font-size: 13px; font-weight: 700; color: var(--text-done); }
//   .scv-celeb-sub   { font-size: 10.5px; color: var(--text-done); opacity: 0.8; }

//   @keyframes scv-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
//   .scv-dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; animation: scv-pulse 1.5s infinite; flex-shrink: 0; }
// `;

// function injectCSS() {
//   if (document.getElementById("scv-theme-v4")) return;
//   const s = document.createElement("style");
//   s.id = "scv-theme-v4";
//   s.textContent = THEME_CSS;
//   document.head.appendChild(s);
// }

// /* ── dark mode detection identical to MyCourses ── */
// const isDarkMode = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   document.documentElement.getAttribute("data-theme") === "dark" ||
//   document.body.getAttribute("data-theme") === "dark" ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// function useDarkMode() {
//   const [dark, setDark] = useState(isDarkMode);
//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDarkMode()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     obs.observe(document.body,            { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   return dark;
// }

// /* ════════════════════════════════════════════════════════════════
//    COMPONENT  — all logic identical to original StudentCourseView
//    ════════════════════════════════════════════════════════════════ */
// export default function StudentCourseView() {
//   const { id } = useParams();

//   const [course,          setCourse         ] = useState(null);
//   const [contents,        setContents       ] = useState([]);
//   const [active,          setActive         ] = useState(null);
//   const [mediaUrl,        setMediaUrl       ] = useState(null);
//   const [mediaType,       setMediaType      ] = useState(null);
//   const [completedIds,    setCompletedIds   ] = useState([]);
//   const [progressPercent, setProgressPercent] = useState(0);

//   const autoMarkedRef = useRef(new Set());
//   const videoRef      = useRef(null);
//   const studentEmail  = getEmailFromToken();
//   const dark          = useDarkMode();

//   useEffect(() => { injectCSS(); }, []);

//   const calcPercent = (ids, valid) => {
//     if (!valid?.length) return 0;
//     return Math.min(Math.round((ids.length / valid.length) * 100), 100);
//   };

//   useEffect(() => {
//     load();
//     return () => { if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl); };
//   }, []);

//   const load = async () => {
//     try {
//       const [courseRes, contentRes] = await Promise.all([
//         axios.get(`${API}/courses/${id}`,                 { headers: authHeader() }),
//         axios.get(`${API}/content/student/course/${id}`, { headers: authHeader() }),
//       ]);
//       const valid = contentRes.data.filter((c) => c.url && c.url !== "undefined");
//       setCourse(courseRes.data);
//       setContents(valid);
//       if (studentEmail) {
//         try {
//           const prog = await progressService.getProgress(studentEmail, Number(id));
//           const ids  = prog.data.completedContentIds || [];
//           setCompletedIds(ids);
//           setProgressPercent(calcPercent(ids, valid));
//         } catch { setCompletedIds([]); setProgressPercent(0); }
//       }
//     } catch (err) { console.error("Load failed", err); }
//   };

//   const markComplete = async (contentId, currentContents) => {
//     if (!studentEmail) return;
//     try {
//       const res = await progressService.markContentComplete(
//         studentEmail, Number(id), contentId, currentContents.length,
//       );
//       const updatedIds = res.data.completedContentIds || [];
//       setCompletedIds(updatedIds);
//       setProgressPercent(calcPercent(updatedIds, currentContents));
//     } catch (err) { console.error("Progress update failed", err); }
//   };

//   const isUnlocked = (index) => {
//     if (index === 0) return true;
//     return completedIds.includes(contents[index - 1].id);
//   };

//   const playVideo = async (c, index) => {
//     if (!isUnlocked(index)) return;
//     if (!c?.url) { alert("Video missing"); return; }
//     try {
//       const res = await axios.get(
//         `${API}/course-videos/stream/${encodeURIComponent(c.url.split("/").pop())}`,
//         { responseType: "blob", headers: authHeader() },
//       );
//       setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "video/mp4" })));
//       setMediaType("VIDEO");
//       setActive(c);
//     } catch (err) { console.error("Video load failed", err); }
//   };

//   const openPdf = async (c, index) => {
//     if (!isUnlocked(index)) return;
//     if (!c?.url) { alert("File missing"); return; }
//     try {
//       if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
//       const res = await axios.get(
//         `${API}/course-files/download/${encodeURIComponent(c.url.split("/").pop())}`,
//         { responseType: "blob", headers: authHeader() },
//       );
//       setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
//       setMediaType("PDF");
//       setActive(c);
//       if (!completedIds.includes(c.id)) markComplete(c.id, contents);
//     } catch (err) { console.error("PDF load failed", err); }
//   };

//   useEffect(() => {
//     const el = videoRef.current;
//     if (!el || !active || mediaType !== "VIDEO") return;
//     const onTime = () => {
//       const { currentTime, duration } = el;
//       if (!duration) return;
//       if (
//         (currentTime / duration) * 100 >= 80 &&
//         !autoMarkedRef.current.has(active.id) &&
//         !completedIds.includes(active.id)
//       ) {
//         autoMarkedRef.current.add(active.id);
//         markComplete(active.id, contents);
//       }
//     };
//     el.addEventListener("timeupdate", onTime);
//     return () => el.removeEventListener("timeupdate", onTime);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [active, mediaType, completedIds]);

//   /* ── derived values ── */
//   const videoCount     = contents.filter((c) => c.contentType === "VIDEO").length;
//   const pdfCount       = contents.filter((c) => c.contentType === "PDF").length;
//   const isAllCompleted = contents.length > 0 && completedIds.length >= contents.length;

//   /* stat chips — mirrors MyCourses Stat component colours */
//   const statChips = [
//     {
//       icon: <BookOpen size={16} />,
//       val: contents.length,
//       lbl: "Total Modules",
//       accent: "#22d3ee",
//       bg: "rgba(34,211,238,0.10)",
//     },
//     {
//       icon: <Video size={16} />,
//       val: videoCount,
//       lbl: "Videos",
//       accent: "#fb923c",
//       bg: "rgba(251,146,60,0.10)",
//     },
//     {
//       icon: <FileText size={16} />,
//       val: pdfCount,
//       lbl: "Documents",
//       accent: "#34d399",
//       bg: "rgba(52,211,153,0.10)",
//     },
//   ];

//   return (
//     <div className={`scv-root${dark ? " dark-theme" : ""}`}>
//       <div className="scv-inner">

//         {/* ══ HERO CARD — same layout as mc-header ══ */}
//         <div className="scv-hero">
//           <div className="scv-hero-left">
//             {/* badge */}
//             <div className="scv-hero-badge">
//               <GraduationCap size={11} />
//               Learning Dashboard
//             </div>

//             <h1 className="scv-hero-title">{course?.title || "Loading…"}</h1>
//             <p className="scv-hero-desc">
//               {course?.description || "Continue your learning journey and track your progress"}
//             </p>

//             {/* stat chips */}
//             <div className="scv-stats-row">
//               {statChips.map((s, i) => (
//                 <div key={i} className="scv-stat-chip">
//                   <div
//                     className="scv-stat-icon-wrap"
//                     style={{ background: s.bg, color: s.accent }}
//                   >
//                     {s.icon}
//                   </div>
//                   <div>
//                     <div className="scv-stat-num" style={{ color: s.accent }}>{s.val}</div>
//                     <div className="scv-stat-lbl">{s.lbl}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* progress bar */}
//             {contents.length > 0 && (
//               <div className="scv-prog-wrap">
//                 <div className="scv-prog-header">
//                   <span className="scv-prog-title">Your Progress</span>
//                   <span className="scv-prog-pct">{progressPercent}%</span>
//                 </div>
//                 <div className="scv-prog-track">
//                   <div className="scv-prog-fill" style={{ width: `${progressPercent}%` }} />
//                 </div>
//                 <p className="scv-prog-sub">
//                   {completedIds.length} of {contents.length} modules completed
//                 </p>
//                 {isAllCompleted && (
//                   <div className="scv-done-banner">
//                     <CheckCircle size={13} /> 🎉 Course Completed!
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* illustration — matches mc-header-icon */}
//           <div className="scv-hero-illus">
//             <BookOpen size={48} strokeWidth={1.4} />
//           </div>
//         </div>

//         {/* ══ BODY GRID ══ */}
//         <div className="scv-grid">

//           {/* LEFT — Modules */}
//           <div>
//             <div className="scv-side-card">
//               <div className="scv-side-hdr">
//                 <BookOpen size={15} color="var(--accent1)" />
//                 <span className="scv-side-title">Course Modules</span>
//               </div>

//               <div className="scv-alert-box">
//                 📋 Complete each module in order to unlock the next one
//               </div>

//               {contents.length === 0 ? (
//                 <div style={{ textAlign: "center", padding: "26px 0" }}>
//                   <File
//                     size={34}
//                     style={{ color: "var(--text-muted)", margin: "0 auto 7px", display: "block" }}
//                   />
//                   <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No content available</p>
//                 </div>
//               ) : (
//                 contents.map((c, index) => {
//                   const isDone   = completedIds.includes(c.id);
//                   const isActive = active?.id === c.id;
//                   const unlocked = isUnlocked(index);
//                   const modCls   = `scv-mod ${
//                     isActive   ? "scv-mod-active"   :
//                     isDone     ? "scv-mod-done"      :
//                     unlocked   ? "scv-mod-unlocked"  :
//                                  "scv-mod-locked"
//                   }`;
//                   const idxCls   = `scv-idx ${
//                     isDone     ? "scv-idx-done"     :
//                     isActive   ? "scv-idx-active"   :
//                     unlocked   ? "scv-idx-unlocked" :
//                                  "scv-idx-locked"
//                   }`;
//                   const iconColor = isActive  ? "var(--accent1)"    :
//                                    unlocked   ? "var(--text-muted)" :
//                                                 "var(--border)";

//                   return (
//                     <div key={c.id} className={modCls}>
//                       <div className="scv-mod-row">
//                         <div className={idxCls}>
//                           {isDone    ? <CheckCircle size={12} /> :
//                            !unlocked ? <Lock size={10} />        :
//                                        index + 1}
//                         </div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 4 }}>
//                             {c.contentType === "VIDEO"
//                               ? <Video    size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
//                               : <FileText size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
//                             }
//                             <span className={`scv-mod-title${unlocked ? "" : " scv-mod-title-locked"}`}>
//                               {c.title}
//                             </span>
//                           </div>

//                           <div className="scv-bdg-row">
//                             <span className={`scv-bdg ${c.contentType === "VIDEO" ? "scv-bdg-video" : "scv-bdg-pdf"}`}>
//                               {c.contentType}
//                             </span>
//                             {isDone     && <span className="scv-bdg scv-bdg-done">✓ Done</span>}
//                             {!unlocked  && <span className="scv-bdg scv-bdg-locked"><Lock size={7} /> Locked</span>}
//                             {unlocked && !isDone && c.contentType === "VIDEO" && (
//                               <span className="scv-watch-hint">Watch 80% to complete</span>
//                             )}
//                           </div>

//                           {c.contentType === "VIDEO" && (
//                             <button
//                               className={`scv-btn ${unlocked ? "scv-btn-video-on" : "scv-btn-video-off"}`}
//                               onClick={() => unlocked && playVideo(c, index)}
//                               disabled={!unlocked}
//                             >
//                               <PlayCircle size={11} />
//                               {isDone ? "Replay Video" : unlocked ? "Play Video" : "Locked"}
//                             </button>
//                           )}
//                           {c.contentType === "PDF" && (
//                             <button
//                               className={`scv-btn ${unlocked ? "scv-btn-pdf-on" : "scv-btn-pdf-off"}`}
//                               onClick={() => unlocked && openPdf(c, index)}
//                               disabled={!unlocked}
//                             >
//                               <FileText size={11} />
//                               {isDone ? "View Again" : unlocked ? "View Document" : "Locked"}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* RIGHT — Player */}
//           <div>
//             <div className="scv-player-card">
//               {!mediaUrl ? (
//                 <div className="scv-empty">
//                   <div className="scv-empty-icon">
//                     <BookOpen size={48} strokeWidth={1.4} />
//                   </div>
//                   <p className="scv-empty-title">Ready to Learn?</p>
//                   <p className="scv-empty-sub">Select a module from the left to begin</p>
//                 </div>
//               ) : (
//                 <>
//                   {active && (
//                     <div className="scv-act-hdr">
//                       <div className="scv-act-icon">
//                         {mediaType === "VIDEO"
//                           ? <Video    size={16} color="#0a0a0a" />
//                           : <FileText size={16} color="#0a0a0a" />
//                         }
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <div className="scv-act-title">{active.title}</div>
//                         <div className="scv-act-bdg-row">
//                           <span className={`scv-bdg ${mediaType === "VIDEO" ? "scv-bdg-video" : "scv-bdg-pdf"}`}>
//                             {mediaType}
//                           </span>
//                           {completedIds.includes(active.id) && (
//                             <span className="scv-bdg scv-bdg-done">
//                               <CheckCircle size={9} /> Completed
//                             </span>
//                           )}
//                           {mediaType === "VIDEO" && !completedIds.includes(active.id) && (
//                             <span style={{ fontSize: 10, color: "#d97706", fontStyle: "italic" }}>
//                               ⏱ Watch 80% to auto-complete
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {mediaType === "VIDEO" && (
//                     <div className="scv-video-wrap">
//                       <video
//                         ref={videoRef} src={mediaUrl} controls autoPlay
//                         controlsList="nodownload" disablePictureInPicture className="scv-video"
//                       />
//                     </div>
//                   )}
//                   {mediaType === "PDF" && (
//                     <iframe src={mediaUrl} className="scv-iframe-wrap" title="PDF Viewer" />
//                   )}

//                   {active && (
//                     <div className="scv-status-bar">
//                       {completedIds.includes(active.id) ? (
//                         <div className="scv-status-done">
//                           <CheckCircle size={13} /> Marked as Complete
//                         </div>
//                       ) : (
//                         <div className="scv-status-watch">
//                           <div className="scv-dot" />
//                           {mediaType === "VIDEO" ? "Keep watching… (80% needed)" : "Loading…"}
//                         </div>
//                       )}
//                       <span className="scv-status-count">
//                         {completedIds.length} of {contents.length} completed
//                       </span>
//                     </div>
//                   )}

//                   {isAllCompleted && (
//                     <div className="scv-celebration">
//                       <CheckCircle size={22} style={{ color: "var(--text-done)", flexShrink: 0 }} />
//                       <div>
//                         <div className="scv-celeb-title">🎉 Course Completed!</div>
//                         <div className="scv-celeb-sub">You have completed all modules in this course.</div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }  old0




























































// import axios from "axios";
// import {
//   BookOpen,
//   CheckCircle,
//   File,
//   FileText,
//   GraduationCap,
//   Lock,
//   PlayCircle,
//   Video,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { progressService } from "../services/progressService";

// // ── Same Global Design System the Dashboard (Golden Reference) and
// // MyCourses use. Tokens, StatCard, and PageContainer are the single
// // source of truth for every page — no page-local CSS injection here.
// import { T, StatCard, PageContainer } from "@/design-system";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const getEmailFromToken = () => {
//   try {
//     const token = localStorage.getItem("lms_token");
//     if (!token) return null;
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch {
//     return null;
//   }
// };

// /* ─── Progress helpers (identical to Dashboard's/MyCourses')
//    Duplicated here for the same reason noted in MyCourses.jsx — these
//    should eventually be hoisted into @/design-system so there's one
//    copy shared by every page. ─── */
// const getProgressColor = (pct) => {
//   if (pct >= 100) return "#34d399";
//   if (pct >= 60) return "#a78bfa";
//   if (pct >= 30) return "#fb923c";
//   return "#94a3b8";
// };

// /* ════════════════════════════════════════════════════════════════
//    COMPONENT — all fetch/streaming/progress logic is unchanged from
//    the original; only the presentation layer below was migrated to
//    the shared design system (t tokens, PageContainer, StatCard).
//    ════════════════════════════════════════════════════════════════ */
// export default function StudentCourseView() {
//   const { id } = useParams();

//   const [course, setCourse] = useState(null);
//   const [contents, setContents] = useState([]);
//   const [active, setActive] = useState(null);
//   const [mediaUrl, setMediaUrl] = useState(null);
//   const [mediaType, setMediaType] = useState(null);
//   const [completedIds, setCompletedIds] = useState([]);
//   const [progressPercent, setProgressPercent] = useState(0);

//   const autoMarkedRef = useRef(new Set());
//   const videoRef = useRef(null);
//   const studentEmail = getEmailFromToken();

//   /* ── dark mode detection identical to Dashboard/MyCourses ── */
//   const [isDark, setIsDark] = useState(
//     () =>
//       typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark"),
//   );

//   useEffect(() => {
//     const obs = new MutationObserver(() => {
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//           document.documentElement.getAttribute("data-theme") === "dark",
//       );
//     });
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);

//   const t = isDark ? T.dark : T.light;

//   const calcPercent = (ids, valid) => {
//     if (!valid?.length) return 0;
//     return Math.min(Math.round((ids.length / valid.length) * 100), 100);
//   };

//   useEffect(() => {
//     load();
//     return () => {
//       if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const load = async () => {
//     try {
//       const [courseRes, contentRes] = await Promise.all([
//         axios.get(`${API}/courses/${id}`, { headers: authHeader() }),
//         axios.get(`${API}/content/student/course/${id}`, { headers: authHeader() }),
//       ]);
//       const valid = contentRes.data.filter((c) => c.url && c.url !== "undefined");
//       setCourse(courseRes.data);
//       setContents(valid);
//       if (studentEmail) {
//         try {
//           const prog = await progressService.getProgress(studentEmail, Number(id));
//           const ids = prog.data.completedContentIds || [];
//           setCompletedIds(ids);
//           setProgressPercent(calcPercent(ids, valid));
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
//       const updatedIds = res.data.completedContentIds || [];
//       setCompletedIds(updatedIds);
//       setProgressPercent(calcPercent(updatedIds, currentContents));
//     } catch (err) {
//       console.error("Progress update failed", err);
//     }
//   };

//   const isUnlocked = (index) => {
//     if (index === 0) return true;
//     return completedIds.includes(contents[index - 1].id);
//   };

//   const playVideo = async (c, index) => {
//     if (!isUnlocked(index)) return;
//     if (!c?.url) {
//       alert("Video missing");
//       return;
//     }
//     try {
//       const res = await axios.get(
//         `${API}/course-videos/stream/${encodeURIComponent(c.url.split("/").pop())}`,
//         { responseType: "blob", headers: authHeader() },
//       );
//       setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "video/mp4" })));
//       setMediaType("VIDEO");
//       setActive(c);
//     } catch (err) {
//       console.error("Video load failed", err);
//     }
//   };

//   const openPdf = async (c, index) => {
//     if (!isUnlocked(index)) return;
//     if (!c?.url) {
//       alert("File missing");
//       return;
//     }
//     try {
//       if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
//       const res = await axios.get(
//         `${API}/course-files/download/${encodeURIComponent(c.url.split("/").pop())}`,
//         { responseType: "blob", headers: authHeader() },
//       );
//       setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
//       setMediaType("PDF");
//       setActive(c);
//       if (!completedIds.includes(c.id)) markComplete(c.id, contents);
//     } catch (err) {
//       console.error("PDF load failed", err);
//     }
//   };

//   useEffect(() => {
//     const el = videoRef.current;
//     if (!el || !active || mediaType !== "VIDEO") return;
//     const onTime = () => {
//       const { currentTime, duration } = el;
//       if (!duration) return;
//       if (
//         (currentTime / duration) * 100 >= 80 &&
//         !autoMarkedRef.current.has(active.id) &&
//         !completedIds.includes(active.id)
//       ) {
//         autoMarkedRef.current.add(active.id);
//         markComplete(active.id, contents);
//       }
//     };
//     el.addEventListener("timeupdate", onTime);
//     return () => el.removeEventListener("timeupdate", onTime);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [active, mediaType, completedIds]);

//   /* ── derived values ── */
//   const videoCount = contents.filter((c) => c.contentType === "VIDEO").length;
//   const pdfCount = contents.filter((c) => c.contentType === "PDF").length;
//   const isAllCompleted = contents.length > 0 && completedIds.length >= contents.length;
//   const progressColor = getProgressColor(progressPercent);

//   // Reuse the exact accent colors Dashboard's ResourceBlock uses for
//   // videos (#22d3ee) and documents (#0ea5e9) so this page's badges and
//   // icons read as the same system, not a one-off palette.
//   const VIDEO_COLOR = "#22d3ee";
//   const PDF_COLOR = "#0ea5e9";

//   /* stat cards — same StatCard component + colorKey scheme as Dashboard/MyCourses */
//   const stats = [
//     { label: "Total Modules", numericValue: contents.length, change: `${contents.length} in course`, trend: "up", icon: BookOpen, colorKey: "blue" },
//     { label: "Videos", numericValue: videoCount, change: `${videoCount} to watch`, trend: "up", icon: Video, colorKey: "orange" },
//     { label: "Documents", numericValue: pdfCount, change: `${pdfCount} to review`, trend: "up", icon: FileText, colorKey: "green" },
//   ];

//   return (
//     <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
//       {/* ═══ HERO — same band as Dashboard/MyCourses ═══ */}
//       <div
//         className="dfade"
//         style={{
//           padding: "8px 0 24px",
//           background: "transparent",
//           border: "none",
//           borderBottom: `1px solid ${t.borderHero}`,
//           marginBottom: 20,
//           boxShadow: "none",
//         }}
//       >
//         <div className="hero-flex">
//           <div>
//             <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
//               <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} className="d1" />
//               <span
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   letterSpacing: "0.2em",
//                   textTransform: "uppercase",
//                   color: t.textSub,
//                   fontFamily: "'Poppins',sans-serif",
//                 }}
//               >
//                 Student Portal
//               </span>
//             </div>
//             <h1
//               style={{
//                 fontFamily: "'Poppins',sans-serif",
//                 fontWeight: 700,
//                 fontSize: "clamp(1.5rem,3vw,2.2rem)",
//                 color: "#3B82F6",
//                 margin: "0 0 6px",
//                 lineHeight: 1.1,
//                 letterSpacing: "-0.02em",
//               }}
//             >
//               {course?.title || "Loading…"}
//             </h1>
//             <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500, fontFamily: "'Poppins',sans-serif", maxWidth: 520 }}>
//               {course?.description || "Continue your learning journey and track your progress"}
//             </p>
//           </div>

//           <div className="hero-badges">
//             {isAllCompleted && (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   background: t.statusCompletedBg,
//                   border: `1px solid ${progressColor}40`,
//                   borderRadius: 999,
//                   padding: "8px 16px",
//                   color: t.statusCompletedText,
//                   fontSize: 11,
//                   fontWeight: 700,
//                   fontFamily: "'Poppins',sans-serif",
//                 }}
//               >
//                 <CheckCircle size={13} /> 🎉 Course Completed
//               </div>
//             )}
//             <div
//               className="livebadge"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 7,
//                 background: "rgba(124,58,237,0.08)",
//                 border: "1px solid rgba(124,58,237,0.3)",
//                 borderRadius: 999,
//                 padding: "8px 18px",
//                 color: "#7c3aed",
//                 fontSize: 11,
//                 fontWeight: 700,
//                 letterSpacing: "0.1em",
//                 fontFamily: "'Poppins',sans-serif",
//               }}
//             >
//               <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
//               LIVE
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ═══ STAT CARDS ═══ */}
//       <div className="stat-grid" style={{ marginBottom: 20 }}>
//         {stats.map((s, i) => (
//           <StatCard key={i} stat={s} index={i} loading={!course} />
//         ))}
//       </div>

//       {/* ═══ OVERALL PROGRESS — same bar styling Dashboard uses for resource progress ═══ */}
//       {contents.length > 0 && (
//         <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow, marginBottom: 20 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//             <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
//               Your Progress
//             </span>
//             <span style={{ fontSize: 13, fontWeight: 800, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{progressPercent}%</span>
//           </div>
//           <div style={{ height: 8, background: t.barBg, borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
//             <div style={{ height: "100%", borderRadius: 99, background: progressColor, width: `${progressPercent}%`, transition: "width 0.7s ease" }} />
//           </div>
//           <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//             {completedIds.length} of {contents.length} modules completed
//           </p>
//         </div>
//       )}

//       {/* ═══ BODY GRID ═══ */}
//       <div className="dash-row-grid" style={{ gridTemplateColumns: "1fr 2fr", alignItems: "flex-start" }}>
//         {/* LEFT — Modules */}
//         <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, padding: 20, position: "sticky", top: 16, maxHeight: "calc(100vh - 40px)", overflowY: "auto" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 14, borderBottom: `1px solid ${t.border}`, marginBottom: 12 }}>
//             <BookOpen size={15} color="#7c3aed" />
//             <span style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>Course Modules</span>
//           </div>

//           <div style={{ background: t.newBadgeBg, border: `1px solid ${t.newBadgeBorder}`, borderRadius: 10, padding: "8px 12px", fontSize: 10.5, fontWeight: 500, color: t.newBadgeText, marginBottom: 12, fontFamily: "'Poppins',sans-serif" }}>
//             📋 Complete each module in order to unlock the next one
//           </div>

//           {contents.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "26px 0" }}>
//               <File size={34} color={t.emptyIcon} style={{ margin: "0 auto 7px", display: "block" }} />
//               <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>No content available</p>
//             </div>
//           ) : (
//             contents.map((c, index) => {
//               const isDone = completedIds.includes(c.id);
//               const isActive = active?.id === c.id;
//               const unlocked = isUnlocked(index);
//               const typeColor = c.contentType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR;

//               // module container colors — reusing the same status tokens
//               // Dashboard's course cards use for completed / in-progress / not-started
//               let modBg = t.cardBg;
//               let modBorder = t.border;
//               let modOpacity = 1;
//               let modCursor = unlocked ? "pointer" : "not-allowed";
//               if (isActive) {
//                 modBg = t.statusProgressBg;
//                 modBorder = "#7c3aed";
//               } else if (isDone) {
//                 modBg = t.statusCompletedBg;
//                 modBorder = "#34d39950";
//               } else if (!unlocked) {
//                 modBg = t.statusNotStartedBg;
//                 modOpacity = 0.5;
//               }

//               let idxBg = t.statusNotStartedBg;
//               let idxColor = t.textMuted;
//               if (isDone) { idxBg = "#34d399"; idxColor = "#fff"; }
//               else if (isActive) { idxBg = "#7c3aed"; idxColor = "#fff"; }
//               else if (unlocked) { idxBg = t.iconBg; idxColor = t.textMuted; }

//               const iconColor = isActive ? "#7c3aed" : unlocked ? t.textMuted : t.textLabel;

//               return (
//                 <div
//                   key={c.id}
//                   style={{
//                     borderRadius: 12,
//                     padding: "10px 12px",
//                     marginBottom: 8,
//                     border: `1px solid ${modBorder}`,
//                     background: modBg,
//                     opacity: modOpacity,
//                     cursor: modCursor,
//                     transition: "box-shadow 0.2s, border-color 0.2s, background 0.25s",
//                   }}
//                 >
//                   <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
//                     <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: idxBg, color: idxColor, border: !unlocked && !isDone ? `1px solid ${t.border}` : "none" }}>
//                       {isDone ? <CheckCircle size={12} /> : !unlocked ? <Lock size={10} /> : index + 1}
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 4 }}>
//                         {c.contentType === "VIDEO" ? (
//                           <Video size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
//                         ) : (
//                           <FileText size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
//                         )}
//                         <span style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.35, color: unlocked ? t.text : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
//                           {c.title}
//                         </span>
//                       </div>

//                       <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
//                         <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: `${typeColor}18`, color: typeColor, fontFamily: "'Poppins',sans-serif" }}>
//                           {c.contentType}
//                         </span>
//                         {isDone && (
//                           <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: t.statusCompletedBg, color: t.statusCompletedText, fontFamily: "'Poppins',sans-serif" }}>
//                             ✓ Done
//                           </span>
//                         )}
//                         {!unlocked && (
//                           <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: t.statusNotStartedBg, color: t.textMuted, display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "'Poppins',sans-serif" }}>
//                             <Lock size={7} /> Locked
//                           </span>
//                         )}
//                         {unlocked && !isDone && c.contentType === "VIDEO" && (
//                           <span style={{ fontSize: 9, color: t.textMuted, fontStyle: "italic", fontFamily: "'Poppins',sans-serif" }}>Watch 80% to complete</span>
//                         )}
//                       </div>

//                       {c.contentType === "VIDEO" && (
//                         <button
//                           onClick={() => unlocked && playVideo(c, index)}
//                           disabled={!unlocked}
//                           style={{
//                             width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
//                             padding: "7px 10px", borderRadius: 8, border: "none",
//                             fontSize: 10.5, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
//                             cursor: unlocked ? "pointer" : "not-allowed",
//                             background: unlocked ? VIDEO_COLOR : t.barBg,
//                             color: unlocked ? "#0a0a0a" : t.textMuted,
//                           }}
//                         >
//                           <PlayCircle size={11} />
//                           {isDone ? "Replay Video" : unlocked ? "Play Video" : "Locked"}
//                         </button>
//                       )}
//                       {c.contentType === "PDF" && (
//                         <button
//                           onClick={() => unlocked && openPdf(c, index)}
//                           disabled={!unlocked}
//                           style={{
//                             width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
//                             padding: "7px 10px", borderRadius: 8,
//                             border: `1px solid ${t.border}`,
//                             fontSize: 10.5, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
//                             cursor: unlocked ? "pointer" : "not-allowed",
//                             background: t.actBg,
//                             color: unlocked ? t.text : t.textMuted,
//                           }}
//                         >
//                           <FileText size={11} />
//                           {isDone ? "View Again" : unlocked ? "View Document" : "Locked"}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* RIGHT — Player */}
//         <div style={{ background: t.cardBg, borderRadius: 20, boxShadow: t.shadow, border: `1px solid ${t.border}`, padding: 20 }}>
//           {!mediaUrl ? (
//             <div style={{ height: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: t.emptyBg, borderRadius: 14, border: `2px dashed ${t.emptyBorder}` }}>
//               <BookOpen size={48} strokeWidth={1.4} color={t.emptyIcon} style={{ marginBottom: 12 }} />
//               <p style={{ fontSize: 15, fontWeight: 700, color: t.textMuted, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif" }}>Ready to Learn?</p>
//               <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Select a module from the left to begin</p>
//             </div>
//           ) : (
//             <>
//               {active && (
//                 <div style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
//                   <div style={{ width: 36, height: 36, borderRadius: 10, background: mediaType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                     {mediaType === "VIDEO" ? <Video size={16} color="#0a0a0a" /> : <FileText size={16} color="#0a0a0a" />}
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 5, fontFamily: "'Poppins',sans-serif" }}>{active.title}</div>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
//                       <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: mediaType === "VIDEO" ? `${VIDEO_COLOR}18` : `${PDF_COLOR}18`, color: mediaType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR, fontFamily: "'Poppins',sans-serif" }}>
//                         {mediaType}
//                       </span>
//                       {completedIds.includes(active.id) && (
//                         <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: t.statusCompletedBg, color: t.statusCompletedText, display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "'Poppins',sans-serif" }}>
//                           <CheckCircle size={9} /> Completed
//                         </span>
//                       )}
//                       {mediaType === "VIDEO" && !completedIds.includes(active.id) && (
//                         <span style={{ fontSize: 10, color: t.newBadgeText, fontStyle: "italic", fontFamily: "'Poppins',sans-serif" }}>⏱ Watch 80% to auto-complete</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {mediaType === "VIDEO" && (
//                 <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${t.border}`, marginBottom: 12, boxShadow: t.shadow }}>
//                   <video
//                     ref={videoRef}
//                     src={mediaUrl}
//                     controls
//                     autoPlay
//                     controlsList="nodownload"
//                     disablePictureInPicture
//                     style={{ width: "100%", aspectRatio: "16/9", background: "#000", display: "block" }}
//                   />
//                 </div>
//               )}
//               {mediaType === "PDF" && (
//                 <iframe src={mediaUrl} title="PDF Viewer" style={{ width: "100%", height: 460, borderRadius: 12, border: `1px solid ${t.border}`, display: "block" }} />
//               )}

//               {active && (
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 6, flexWrap: "wrap", gap: 8 }}>
//                   {completedIds.includes(active.id) ? (
//                     <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: t.statusCompletedBg, border: `1px solid ${t.statusCompletedText}40`, borderRadius: 10, fontSize: 11.5, fontWeight: 600, color: t.statusCompletedText, fontFamily: "'Poppins',sans-serif" }}>
//                       <CheckCircle size={13} /> Marked as Complete
//                     </div>
//                   ) : (
//                     <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: t.newBadgeBg, border: `1px solid ${t.newBadgeBorder}`, borderRadius: 10, fontSize: 11.5, fontWeight: 500, color: t.newBadgeText, fontFamily: "'Poppins',sans-serif" }}>
//                       <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", flexShrink: 0, animation: "scv-pulse 1.5s infinite" }} />
//                       {mediaType === "VIDEO" ? "Keep watching… (80% needed)" : "Loading…"}
//                     </div>
//                   )}
//                   <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
//                     {completedIds.length} of {contents.length} completed
//                   </span>
//                 </div>
//               )}

//               {isAllCompleted && (
//                 <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, marginTop: 12, background: t.statusCompletedBg, border: `1px solid ${t.statusCompletedText}40`, borderRadius: 12 }}>
//                   <CheckCircle size={22} color={t.statusCompletedText} style={{ flexShrink: 0 }} />
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: t.statusCompletedText, fontFamily: "'Poppins',sans-serif" }}>🎉 Course Completed!</div>
//                     <div style={{ fontSize: 10.5, color: t.statusCompletedText, opacity: 0.8, fontFamily: "'Poppins',sans-serif" }}>You have completed all modules in this course.</div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <style>{`@keyframes scv-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>
//     </PageContainer>
//   );
// }old1




































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
import videoService from "../services/videoService";

// ── Same Global Design System the Dashboard (Golden Reference) and
// MyCourses use. Tokens, StatCard, and PageContainer are the single
// source of truth for every page — no page-local CSS injection here.
import { T, StatCard, PageContainer } from "@/design-system";

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

/* ─── Progress helpers (identical to Dashboard's/MyCourses')
   Duplicated here for the same reason noted in MyCourses.jsx — these
   should eventually be hoisted into @/design-system so there's one
   copy shared by every page. ─── */
const getProgressColor = (pct) => {
  if (pct >= 100) return "#34d399";
  if (pct >= 60) return "#a78bfa";
  if (pct >= 30) return "#fb923c";
  return "#94a3b8";
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT — all fetch/streaming/progress logic is unchanged from
   the original; presentation layer uses the shared design system
   (t tokens, PageContainer, StatCard). Transcript feature (polling,
   segment sync, panel UI) ported in and restyled with t tokens.
   ════════════════════════════════════════════════════════════════ */
export default function StudentCourseView() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [active, setActive] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);

  const autoMarkedRef = useRef(new Set());
  const videoRef = useRef(null);
  const studentEmail = getEmailFromToken();

  /* ── dark mode detection identical to Dashboard/MyCourses ── */
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

  // ── Transcript (course video) ──────────────────────────────────────────
  // NOTE: looked up by video URL, not by ContentItem.id — ContentItem
  // (course-service) has no field pointing back to video-service's
  // CourseVideo.id, only the stream `url`. This mirrors exactly how
  // ContentEventConsumer resolves CourseVideo rows on the backend
  // (repo.findByUrl(url)), so the same key is used here.
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [transcriptState, setTranscriptState] = useState({
    status: null,
    segments: [],
  });
  const [activeSegIdx, setActiveSegIdx] = useState(-1);
  const transcriptPollCountRef = useRef(0);
  const transcriptPollTimerRef = useRef(null);
  const transcriptVideoUrlRef = useRef(null);

  const getMaxPollAttempts = () => Math.ceil((10 * 60000) / 15000); // 10 min minimum window

  const pollTranscript = async (videoUrl) => {
    let data = null;
    try {
      const res = await videoService.getCourseVideoTranscriptByUrl(videoUrl);
      data = res.data;
    } catch {
      data = { status: "FAILED", segments: [] };
    }
    if (transcriptVideoUrlRef.current !== videoUrl) return;

    setTranscriptState({
      status: data?.status || "FAILED",
      segments: Array.isArray(data?.segments) ? data.segments : [],
    });

    if (data?.status === "PROCESSING" || data?.status === "NONE") {
      transcriptPollCountRef.current += 1;
      if (transcriptPollCountRef.current < getMaxPollAttempts()) {
        transcriptPollTimerRef.current = setTimeout(
          () => pollTranscript(videoUrl),
          15000,
        );
      } else {
        setTranscriptState((prev) => ({ ...prev, status: "TIMEOUT" }));
      }
    }
  };

  useEffect(() => {
    if (transcriptPollTimerRef.current)
      clearTimeout(transcriptPollTimerRef.current);
    transcriptPollCountRef.current = 0;
    setActiveSegIdx(-1);
    setTranscriptOpen(false);
    transcriptVideoUrlRef.current = active?.url ?? null;

    if (!active || mediaType !== "VIDEO") {
      setTranscriptState({ status: null, segments: [] });
      return;
    }
    pollTranscript(active.url);

    return () => {
      if (transcriptPollTimerRef.current)
        clearTimeout(transcriptPollTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mediaType]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || transcriptState.status !== "READY") return;
    const onTime = () => {
      const tSec = v.currentTime;
      const idx = transcriptState.segments.findIndex(
        (s) => tSec >= s.startSeconds && tSec < s.endSeconds,
      );
      setActiveSegIdx(idx);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [transcriptState.status, transcriptState.segments]);

  const seekToSegment = (seg) => {
    const v = videoRef.current;
    if (v) v.currentTime = seg.startSeconds;
  };

  const fmtTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };
  // ─────────────────────────────────────────────────────────────────────

  const calcPercent = (ids, valid) => {
    if (!valid?.length) return 0;
    return Math.min(Math.round((ids.length / valid.length) * 100), 100);
  };

  useEffect(() => {
    load();
    return () => {
      if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      const [courseRes, contentRes] = await Promise.all([
        axios.get(`${API}/courses/${id}`, { headers: authHeader() }),
        axios.get(`${API}/content/student/course/${id}`, { headers: authHeader() }),
      ]);
      const valid = contentRes.data.filter((c) => c.url && c.url !== "undefined");
      setCourse(courseRes.data);
      setContents(valid);
      if (studentEmail) {
        try {
          const prog = await progressService.getProgress(studentEmail, Number(id));
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

  const isUnlocked = (index) => {
    if (index === 0) return true;
    return completedIds.includes(contents[index - 1].id);
  };

  const playVideo = async (c, index) => {
    if (!isUnlocked(index)) return;
    if (!c?.url) {
      alert("Video missing");
      return;
    }
    try {
      const res = await axios.get(
        `${API}/course-videos/stream/${encodeURIComponent(c.url.split("/").pop())}`,
        { responseType: "blob", headers: authHeader() },
      );
      setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "video/mp4" })));
      setMediaType("VIDEO");
      setActive(c);
    } catch (err) {
      console.error("Video load failed", err);
    }
  };

  const openPdf = async (c, index) => {
    if (!isUnlocked(index)) return;
    if (!c?.url) {
      alert("File missing");
      return;
    }
    try {
      if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
      const res = await axios.get(
        `${API}/course-files/download/${encodeURIComponent(c.url.split("/").pop())}`,
        { responseType: "blob", headers: authHeader() },
      );
      setMediaUrl(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
      setMediaType("PDF");
      setActive(c);
      if (!completedIds.includes(c.id)) markComplete(c.id, contents);
    } catch (err) {
      console.error("PDF load failed", err);
    }
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !active || mediaType !== "VIDEO") return;
    const onTime = () => {
      const { currentTime, duration } = el;
      if (!duration) return;
      if (
        (currentTime / duration) * 100 >= 80 &&
        !autoMarkedRef.current.has(active.id) &&
        !completedIds.includes(active.id)
      ) {
        autoMarkedRef.current.add(active.id);
        markComplete(active.id, contents);
      }
    };
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mediaType, completedIds]);

  /* ── derived values ── */
  const videoCount = contents.filter((c) => c.contentType === "VIDEO").length;
  const pdfCount = contents.filter((c) => c.contentType === "PDF").length;
  const isAllCompleted = contents.length > 0 && completedIds.length >= contents.length;
  const progressColor = getProgressColor(progressPercent);

  // Reuse the exact accent colors Dashboard's ResourceBlock uses for
  // videos (#22d3ee) and documents (#0ea5e9) so this page's badges and
  // icons read as the same system, not a one-off palette.
  const VIDEO_COLOR = "#22d3ee";
  const PDF_COLOR = "#0ea5e9";

  /* stat cards — same StatCard component + colorKey scheme as Dashboard/MyCourses */
  const stats = [
    { label: "Total Modules", numericValue: contents.length, change: `${contents.length} in course`, trend: "up", icon: BookOpen, colorKey: "blue" },
    { label: "Videos", numericValue: videoCount, change: `${videoCount} to watch`, trend: "up", icon: Video, colorKey: "orange" },
    { label: "Documents", numericValue: pdfCount, change: `${pdfCount} to review`, trend: "up", icon: FileText, colorKey: "green" },
  ];

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      {/* ═══ HERO — same band as Dashboard/MyCourses ═══ */}
      <div
        className="dfade"
        style={{
          padding: "8px 0 24px",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
          boxShadow: "none",
        }}
      >
        <div className="hero-flex">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} className="d1" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: t.textSub,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Student Portal
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                color: "#3B82F6",
                margin: "0 0 6px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {course?.title || "Loading…"}
            </h1>
            <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500, fontFamily: "'Poppins',sans-serif", maxWidth: 520 }}>
              {course?.description || "Continue your learning journey and track your progress"}
            </p>
          </div>

          <div className="hero-badges">
            {isAllCompleted && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: t.statusCompletedBg,
                  border: `1px solid ${progressColor}40`,
                  borderRadius: 999,
                  padding: "8px 16px",
                  color: t.statusCompletedText,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                <CheckCircle size={13} /> 🎉 Course Completed
              </div>
            )}
            <div
              className="livebadge"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 999,
                padding: "8px 18px",
                color: "#7c3aed",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={!course} />
        ))}
      </div>

      {/* ═══ OVERALL PROGRESS — same bar styling Dashboard uses for resource progress ═══ */}
      {contents.length > 0 && (
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
              Your Progress
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{progressPercent}%</span>
          </div>
          <div style={{ height: 8, background: t.barBg, borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", borderRadius: 99, background: progressColor, width: `${progressPercent}%`, transition: "width 0.7s ease" }} />
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
            {completedIds.length} of {contents.length} modules completed
          </p>
        </div>
      )}

      {/* ═══ BODY GRID ═══ */}
      <div className="dash-row-grid" style={{ gridTemplateColumns: "1fr 2fr", alignItems: "flex-start" }}>
        {/* LEFT — Modules */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, padding: 20, position: "sticky", top: 16, maxHeight: "calc(100vh - 40px)", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 14, borderBottom: `1px solid ${t.border}`, marginBottom: 12 }}>
            <BookOpen size={15} color="#7c3aed" />
            <span style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>Course Modules</span>
          </div>

          <div style={{ background: t.newBadgeBg, border: `1px solid ${t.newBadgeBorder}`, borderRadius: 10, padding: "8px 12px", fontSize: 10.5, fontWeight: 500, color: t.newBadgeText, marginBottom: 12, fontFamily: "'Poppins',sans-serif" }}>
            📋 Complete each module in order to unlock the next one
          </div>

          {contents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "26px 0" }}>
              <File size={34} color={t.emptyIcon} style={{ margin: "0 auto 7px", display: "block" }} />
              <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>No content available</p>
            </div>
          ) : (
            contents.map((c, index) => {
              const isDone = completedIds.includes(c.id);
              const isActive = active?.id === c.id;
              const unlocked = isUnlocked(index);
              const typeColor = c.contentType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR;

              // module container colors — reusing the same status tokens
              // Dashboard's course cards use for completed / in-progress / not-started
              let modBg = t.cardBg;
              let modBorder = t.border;
              let modOpacity = 1;
              let modCursor = unlocked ? "pointer" : "not-allowed";
              if (isActive) {
                modBg = t.statusProgressBg;
                modBorder = "#7c3aed";
              } else if (isDone) {
                modBg = t.statusCompletedBg;
                modBorder = "#34d39950";
              } else if (!unlocked) {
                modBg = t.statusNotStartedBg;
                modOpacity = 0.5;
              }

              let idxBg = t.statusNotStartedBg;
              let idxColor = t.textMuted;
              if (isDone) { idxBg = "#34d399"; idxColor = "#fff"; }
              else if (isActive) { idxBg = "#7c3aed"; idxColor = "#fff"; }
              else if (unlocked) { idxBg = t.iconBg; idxColor = t.textMuted; }

              const iconColor = isActive ? "#7c3aed" : unlocked ? t.textMuted : t.textLabel;

              return (
                <div
                  key={c.id}
                  style={{
                    borderRadius: 12,
                    padding: "10px 12px",
                    marginBottom: 8,
                    border: `1px solid ${modBorder}`,
                    background: modBg,
                    opacity: modOpacity,
                    cursor: modCursor,
                    transition: "box-shadow 0.2s, border-color 0.2s, background 0.25s",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: idxBg, color: idxColor, border: !unlocked && !isDone ? `1px solid ${t.border}` : "none" }}>
                      {isDone ? <CheckCircle size={12} /> : !unlocked ? <Lock size={10} /> : index + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 4 }}>
                        {c.contentType === "VIDEO" ? (
                          <Video size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
                        ) : (
                          <FileText size={11} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.35, color: unlocked ? t.text : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                          {c.title}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: `${typeColor}18`, color: typeColor, fontFamily: "'Poppins',sans-serif" }}>
                          {c.contentType}
                        </span>
                        {isDone && (
                          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: t.statusCompletedBg, color: t.statusCompletedText, fontFamily: "'Poppins',sans-serif" }}>
                            ✓ Done
                          </span>
                        )}
                        {!unlocked && (
                          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: t.statusNotStartedBg, color: t.textMuted, display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "'Poppins',sans-serif" }}>
                            <Lock size={7} /> Locked
                          </span>
                        )}
                        {unlocked && !isDone && c.contentType === "VIDEO" && (
                          <span style={{ fontSize: 9, color: t.textMuted, fontStyle: "italic", fontFamily: "'Poppins',sans-serif" }}>Watch 80% to complete</span>
                        )}
                      </div>

                      {c.contentType === "VIDEO" && (
                        <button
                          onClick={() => unlocked && playVideo(c, index)}
                          disabled={!unlocked}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                            padding: "7px 10px", borderRadius: 8, border: "none",
                            fontSize: 10.5, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                            cursor: unlocked ? "pointer" : "not-allowed",
                            background: unlocked ? VIDEO_COLOR : t.barBg,
                            color: unlocked ? "#0a0a0a" : t.textMuted,
                          }}
                        >
                          <PlayCircle size={11} />
                          {isDone ? "Replay Video" : unlocked ? "Play Video" : "Locked"}
                        </button>
                      )}
                      {c.contentType === "PDF" && (
                        <button
                          onClick={() => unlocked && openPdf(c, index)}
                          disabled={!unlocked}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                            padding: "7px 10px", borderRadius: 8,
                            border: `1px solid ${t.border}`,
                            fontSize: 10.5, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                            cursor: unlocked ? "pointer" : "not-allowed",
                            background: t.actBg,
                            color: unlocked ? t.text : t.textMuted,
                          }}
                        >
                          <FileText size={11} />
                          {isDone ? "View Again" : unlocked ? "View Document" : "Locked"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT — Player */}
        <div style={{ background: t.cardBg, borderRadius: 20, boxShadow: t.shadow, border: `1px solid ${t.border}`, padding: 20 }}>
          {!mediaUrl ? (
            <div style={{ height: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: t.emptyBg, borderRadius: 14, border: `2px dashed ${t.emptyBorder}` }}>
              <BookOpen size={48} strokeWidth={1.4} color={t.emptyIcon} style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: t.textMuted, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif" }}>Ready to Learn?</p>
              <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Select a module from the left to begin</p>
            </div>
          ) : (
            <>
              {active && (
                <div style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: mediaType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {mediaType === "VIDEO" ? <Video size={16} color="#0a0a0a" /> : <FileText size={16} color="#0a0a0a" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 5, fontFamily: "'Poppins',sans-serif" }}>{active.title}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: mediaType === "VIDEO" ? `${VIDEO_COLOR}18` : `${PDF_COLOR}18`, color: mediaType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR, fontFamily: "'Poppins',sans-serif" }}>
                        {mediaType}
                      </span>
                      {completedIds.includes(active.id) && (
                        <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: t.statusCompletedBg, color: t.statusCompletedText, display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "'Poppins',sans-serif" }}>
                          <CheckCircle size={9} /> Completed
                        </span>
                      )}
                      {mediaType === "VIDEO" && !completedIds.includes(active.id) && (
                        <span style={{ fontSize: 10, color: t.newBadgeText, fontStyle: "italic", fontFamily: "'Poppins',sans-serif" }}>⏱ Watch 80% to auto-complete</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Transcript panel toggle ── */}
              {mediaType === "VIDEO" && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                  <button
                    onClick={() => setTranscriptOpen((o) => !o)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: t.textMuted,
                      background: "none",
                      border: `1px solid ${t.border}`,
                      borderRadius: 10,
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <FileText size={13} />
                    {transcriptOpen ? "Hide Transcript" : "Transcript"}
                  </button>
                </div>
              )}

              {mediaType === "VIDEO" && (
                <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${t.border}`, marginBottom: 12, boxShadow: t.shadow }}>
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    disablePictureInPicture
                    style={{ width: "100%", aspectRatio: "16/9", background: "#000", display: "block" }}
                  />
                </div>
              )}

              {/* ── Transcript panel ── */}
              {mediaType === "VIDEO" && transcriptOpen && (
                <div
                  style={{
                    border: `1px solid ${t.border}`,
                    borderRadius: 12,
                    marginBottom: 12,
                    maxHeight: 240,
                    overflowY: "auto",
                    padding: 12,
                    background: t.pageBg,
                  }}
                >
                  {transcriptState.status === "READY" && transcriptState.segments.length > 0 ? (
                    transcriptState.segments.map((seg, idx) => (
                      <button
                        key={idx}
                        onClick={() => seekToSegment(seg)}
                        style={{
                          display: "flex",
                          gap: 10,
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 8px",
                          borderRadius: 8,
                          border: "none",
                          background: idx === activeSegIdx ? `${VIDEO_COLOR}18` : "transparent",
                          cursor: "pointer",
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ fontSize: 11, fontWeight: 700, color: VIDEO_COLOR, flexShrink: 0, fontFamily: "'Poppins',sans-serif" }}>
                          {fmtTime(seg.startSeconds)}
                        </span>
                        <span style={{ fontSize: 12.5, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
                          {seg.text}
                        </span>
                      </button>
                    ))
                  ) : transcriptState.status === "TIMEOUT" ? (
                    <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center", padding: "24px 0", fontFamily: "'Poppins',sans-serif" }}>
                      Transcript is taking longer than expected.
                    </p>
                  ) : transcriptState.status === "PROCESSING" ||
                    transcriptState.status === "NONE" ||
                    transcriptState.status === null ? (
                    <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center", padding: "24px 0", fontFamily: "'Poppins',sans-serif" }}>
                      Generating transcript…
                    </p>
                  ) : (
                    <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center", padding: "24px 0", fontFamily: "'Poppins',sans-serif" }}>
                      Transcript unavailable for this video.
                    </p>
                  )}
                </div>
              )}

              {mediaType === "PDF" && (
                <iframe src={mediaUrl} title="PDF Viewer" style={{ width: "100%", height: 460, borderRadius: 12, border: `1px solid ${t.border}`, display: "block" }} />
              )}

              {active && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 6, flexWrap: "wrap", gap: 8 }}>
                  {completedIds.includes(active.id) ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: t.statusCompletedBg, border: `1px solid ${t.statusCompletedText}40`, borderRadius: 10, fontSize: 11.5, fontWeight: 600, color: t.statusCompletedText, fontFamily: "'Poppins',sans-serif" }}>
                      <CheckCircle size={13} /> Marked as Complete
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: t.newBadgeBg, border: `1px solid ${t.newBadgeBorder}`, borderRadius: 10, fontSize: 11.5, fontWeight: 500, color: t.newBadgeText, fontFamily: "'Poppins',sans-serif" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", flexShrink: 0, animation: "scv-pulse 1.5s infinite" }} />
                      {mediaType === "VIDEO" ? "Keep watching… (80% needed)" : "Loading…"}
                    </div>
                  )}
                  <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                    {completedIds.length} of {contents.length} completed
                  </span>
                </div>
              )}

              {isAllCompleted && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, marginTop: 12, background: t.statusCompletedBg, border: `1px solid ${t.statusCompletedText}40`, borderRadius: 12 }}>
                  <CheckCircle size={22} color={t.statusCompletedText} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.statusCompletedText, fontFamily: "'Poppins',sans-serif" }}>🎉 Course Completed!</div>
                    <div style={{ fontSize: 10.5, color: t.statusCompletedText, opacity: 0.8, fontFamily: "'Poppins',sans-serif" }}>You have completed all modules in this course.</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes scv-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>
    </PageContainer>
  );
}