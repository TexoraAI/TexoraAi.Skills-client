
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















































// import React, { useCallback, useEffect, useRef, useState } from "react";
// import videoService from "../services/videoService";
// import { progressService } from "../services/progressService";
// import StudentNotebook from "./StudentNotebook";
// import {
//   BookOpen, CheckCircle, ChevronLeft, ChevronRight,
//   Clock, Film, Globe, GripHorizontal, HardDrive,
//   Layers, Link, Maximize2, Minimize2, Pause, Play,
//   PlayCircle, Tag, Video, Volume2, VolumeX, X,
// } from "lucide-react";

// /* ═══════════════════════════════════════════════════════════════
//    ALL STYLES — main page + mini player — in one <style> block
// ═══════════════════════════════════════════════════════════════ */
// const ALL_STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

// /* ── CSS Variables ── */
// :root {
//   --vl-bg:      #f1f5f9;
//   --vl-card:    #ffffff;
//   --vl-text:    #0f172a;
//   --vl-muted:   #64748b;
//   --vl-border:  #e2e8f0;
//   --vl-accent1: #22d3ee;
//   --vl-accent2: #fb923c;
//   --vl-accent3: #34d399;
//   --vl-accent4: #a78bfa;
//   --vl-shadow:    0 4px 24px rgba(0,0,0,0.06);
//   --vl-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//   --vl-radius: 20px;
//   --vl-collapse: 36px;
// }
// .vl-dark {
//   --vl-bg:     #0a0a0a;
//   --vl-card:   #111111;
//   --vl-text:   #ffffff;
//   --vl-muted:  #94a3b8;
//   --vl-border: rgba(255,255,255,0.06);
//   --vl-shadow:    0 4px 24px rgba(0,0,0,0.40);
//   --vl-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
// }

// /* ── Root ── */
// .vl-root {
//   font-family:'Poppins',sans-serif;
//   min-height:100vh;
//   background:var(--vl-bg);
//   color:var(--vl-text);
//   padding:24px;
//   box-sizing:border-box;
//   display:flex; flex-direction:column; gap:20px;
//   transition:background .3s;
// }
// .vl-inner { max-width:1400px; margin:0 auto; width:100%; display:flex; flex-direction:column; gap:20px; flex:1; }

// /* ── Header ── */
// .vl-header {
//   background:var(--vl-card); border:1px solid var(--vl-border);
//   border-radius:var(--vl-radius); padding:28px 32px;
//   box-shadow:var(--vl-shadow);
//   display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
// }
// .vl-header-left { display:flex; align-items:center; gap:16px; }
// .vl-header-icon-box {
//   width:52px; height:52px; border-radius:14px;
//   background:rgba(34,211,238,.10); border:1px solid rgba(34,211,238,.18);
//   display:flex; align-items:center; justify-content:center;
//   color:var(--vl-accent1); flex-shrink:0;
// }
// .vl-badge {
//   display:inline-flex; align-items:center; gap:6px;
//   padding:4px 11px; border-radius:50px;
//   border:1px solid var(--vl-border); background:rgba(34,211,238,.08);
//   color:var(--vl-accent1); font-size:10px; font-weight:700;
//   letter-spacing:.08em; text-transform:uppercase; margin-bottom:6px;
// }
// .vl-h1 { font-size:24px; font-weight:800; color:var(--vl-text); margin:0 0 2px; }
// .vl-meta { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
// .vl-meta-item { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:500; color:var(--vl-muted); }
// .vl-tag {
//   padding:4px 10px; border-radius:8px;
//   background:rgba(52,211,153,.10); border:1px solid rgba(52,211,153,.18);
//   color:var(--vl-accent3); font-size:11px; font-weight:700;
// }
// .vl-progress-chip {
//   display:flex; align-items:center; gap:10px;
//   padding:10px 18px; border-radius:14px;
//   background:var(--vl-bg); border:1px solid var(--vl-border); box-shadow:var(--vl-shadow);
// }
// .vl-progress-chip-inner { display:flex; flex-direction:column; gap:4px; }
// .vl-progress-chip-val { font-size:14px; font-weight:700; color:var(--vl-accent1); line-height:1; }
// .vl-progress-chip-lbl { font-size:10px; font-weight:600; color:var(--vl-muted); text-transform:uppercase; letter-spacing:.06em; }
// .vl-progress-bar-wrap { width:80px; height:4px; border-radius:99px; background:rgba(34,211,238,.15); overflow:hidden; }
// .vl-progress-bar { height:100%; border-radius:99px; background:var(--vl-accent1); transition:width .5s ease; }

// /* ── Body layout ── */
// .vl-body { display:flex; gap:0; flex:1; min-height:0; align-items:stretch; }

// /* ── Sidebar panel ── */
// .vl-sidebar { flex-shrink:0; display:flex; overflow:hidden; transition:width .25s cubic-bezier(.4,0,.2,1); }
// .vl-sidebar-inner {
//   display:flex; flex-direction:column;
//   background:var(--vl-card); border:1px solid var(--vl-border);
//   border-radius:var(--vl-radius) 0 0 var(--vl-radius); box-shadow:var(--vl-shadow);
//   overflow:hidden; width:100%;
// }
// .vl-sidebar-head {
//   display:flex; align-items:center; justify-content:space-between;
//   padding:18px 20px; border-bottom:1px solid var(--vl-border); flex-shrink:0;
// }
// .vl-sidebar-title { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--vl-text); margin:0; }
// .vl-sidebar-count { font-size:11px; color:var(--vl-muted); margin-top:2px; }
// .vl-sidebar-list { flex:1; overflow-y:auto; padding:8px 0; }
// .vl-sidebar-list::-webkit-scrollbar { width:4px; }
// .vl-sidebar-list::-webkit-scrollbar-thumb { background:var(--vl-border); border-radius:4px; }

// /* ── Collapsed strip ── */
// .vl-collapsed-strip {
//   flex:1; display:flex; flex-direction:column;
//   align-items:center; padding-top:14px; gap:8px;
//   cursor:pointer; background:var(--vl-card);
//   border:1px solid var(--vl-border);
//   border-radius:var(--vl-radius) 0 0 var(--vl-radius);
//   transition:background .15s;
// }
// .vl-collapsed-strip:hover { background:rgba(34,211,238,.04); }
// .vl-collapsed-label {
//   writing-mode:vertical-rl; text-orientation:mixed;
//   transform:rotate(180deg);
//   font-size:10px; font-weight:700; color:var(--vl-muted);
//   letter-spacing:.08em; text-transform:uppercase;
//   white-space:nowrap; user-select:none; margin-top:10px;
// }
// .vl-collapsed-strip-right {
//   flex:1; display:flex; flex-direction:column;
//   align-items:center; padding-top:14px; gap:8px;
//   cursor:pointer; background:var(--vl-card);
//   border:1px solid var(--vl-border);
//   border-radius:0 var(--vl-radius) var(--vl-radius) 0;
//   transition:background .15s;
// }
// .vl-collapsed-strip-right:hover { background:rgba(167,139,250,.04); }

// /* ── List item ── */
// .vl-list-item {
//   display:flex; align-items:flex-start; gap:12px;
//   padding:12px 16px; border-left:3px solid transparent;
//   cursor:pointer; transition:background .15s,border-color .15s;
//   background:transparent; border-top:none; border-right:none; border-bottom:none;
//   width:100%; text-align:left;
// }
// .vl-list-item:hover { background:rgba(34,211,238,.04); }
// .vl-list-item.active { background:rgba(34,211,238,.07); border-left-color:var(--vl-accent1); }
// .vl-list-item.watched { background:rgba(52,211,153,.05); border-left-color:var(--vl-accent3); }
// .vl-list-thumb { width:44px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
// .vl-list-bars { display:flex; gap:2px; align-items:flex-end; height:14px; }
// .vl-bar { width:3px; border-radius:2px; background:white; }
// .vl-list-info { flex:1; min-width:0; }
// .vl-list-title { font-size:12px; font-weight:600; color:var(--vl-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0 0 3px; }
// .vl-list-item.active .vl-list-title { color:var(--vl-accent1); }
// .vl-list-item.watched .vl-list-title { color:var(--vl-accent3); }
// .vl-list-sub { display:flex; align-items:center; gap:4px; font-size:11px; color:var(--vl-muted); flex-wrap:wrap; }
// .vl-list-desc { font-size:10.5px; color:var(--vl-muted); margin:3px 0 0; line-height:1.4; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
// .vl-list-course { font-size:10px; font-weight:600; color:var(--vl-accent4); margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
// .vl-list-pills { display:flex; flex-wrap:wrap; gap:3px; margin-top:4px; }
// .vl-list-pill { font-size:9px; font-weight:700; padding:1px 6px; border-radius:10px; }
// .vl-playing-dot,.vl-watched-dot { font-size:10px; font-weight:700; color:var(--vl-accent3); }
// .vl-sidebar-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; gap:10px; color:var(--vl-muted); font-size:13px; text-align:center; }
// .vl-empty-icon-box { width:48px; height:48px; border-radius:14px; background:var(--vl-bg); border:1px solid var(--vl-border); display:flex; align-items:center; justify-content:center; color:var(--vl-muted); }

// /* ── Draggable resize handle ── */
// .vl-resize {
//   width:14px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
//   cursor:col-resize; z-index:5; position:relative;
//   background:var(--vl-bg);
// }
// .vl-resize-bar {
//   width:3px; height:48px; border-radius:4px;
//   background:var(--vl-border); transition:background .2s;
// }
// .vl-resize:hover .vl-resize-bar { background:var(--vl-accent1); }

// /* CRM-style divider pill */
// .vl-div-pill {
//   position:absolute;
//   top:50%; left:50%;
//   transform:translate(-50%,-50%);
//   width:18px; height:48px;
//   border-radius:6px;
//   background:var(--vl-card);
//   border:1px solid var(--vl-border);
//   display:flex; flex-direction:column;
//   align-items:center; justify-content:center; gap:2px;
//   cursor:pointer;
//   box-shadow:var(--vl-shadow);
//   transition:background .15s, border-color .15s;
//   z-index:3; user-select:none;
// }
// .vl-div-pill:hover {
//   background:rgba(34,211,238,.08);
//   border-color:rgba(34,211,238,.35);
// }
// .vl-div-arrow { color:var(--vl-muted); display:flex; align-items:center; }
// .vl-div-pill:hover .vl-div-arrow { color:var(--vl-accent1); }

// /* ── Player area ── */
// .vl-player { flex:1; display:flex; flex-direction:column; gap:0; min-width:0; }
// .vl-player-card {
//   flex:1; background:var(--vl-card);
//   border:1px solid var(--vl-border); border-radius:0;
//   box-shadow:none; overflow:hidden; display:flex; flex-direction:column;
// }

// .vl-toolbar {
//   display:flex; align-items:center; gap:10px; flex-wrap:wrap;
//   padding:12px 16px; background:var(--vl-card);
//   border:1px solid var(--vl-border);
//   border-bottom:none;
//   border-radius:0;
// }
// .vl-toggle-btn {
//   display:inline-flex; align-items:center; gap:6px;
//   padding:8px 14px; border-radius:12px;
//   border:1px solid var(--vl-border); background:var(--vl-bg); color:var(--vl-muted);
//   font-family:'Poppins',sans-serif; font-size:12px; font-weight:600;
//   cursor:pointer; box-shadow:var(--vl-shadow); transition:color .2s,border-color .2s,background .2s;
// }
// .vl-toggle-btn:hover { color:var(--vl-accent1); border-color:rgba(34,211,238,.3); background:rgba(34,211,238,.04); }

// /* ── Mini Player toggle button ── */
// .vl-pip-btn {
//   display:inline-flex; align-items:center; gap:6px;
//   padding:8px 14px; border-radius:12px;
//   border:1px solid var(--vl-border); background:var(--vl-bg); color:var(--vl-muted);
//   font-family:'Poppins',sans-serif; font-size:12px; font-weight:600;
//   cursor:pointer; box-shadow:var(--vl-shadow); transition:color .2s,border-color .2s,background .2s;
// }
// .vl-pip-btn:hover,.vl-pip-btn.active {
//   color:var(--vl-accent1); border-color:rgba(34,211,238,.35); background:rgba(34,211,238,.07);
// }
// .vl-pip-btn.active { animation:vlPipGlow 2s ease-in-out infinite; }
// @keyframes vlPipGlow {
//   0%,100% { box-shadow:0 0 0 0 rgba(34,211,238,0); }
//   50%      { box-shadow:0 0 0 4px rgba(34,211,238,.18); }
// }

// .vl-now-playing { font-size:12px; color:var(--vl-muted); }
// .vl-now-playing strong { color:var(--vl-text); font-weight:600; }

// video { display:block; width:100%; }
// .vl-iframe-player { width:100%; aspect-ratio:16/9; border:none; display:block; background:#000; }

// /* ── Info bar ── */
// .vl-info-bar {
//   display:flex; align-items:flex-start; justify-content:space-between;
//   padding:16px 24px 12px; border-top:1px solid var(--vl-border);
//   flex-shrink:0; flex-wrap:wrap; gap:12px;
// }
// .vl-info-left { display:flex; align-items:flex-start; gap:12px; flex:1; min-width:0; }
// .vl-info-thumb { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
// .vl-info-text { flex:1; min-width:0; }
// .vl-info-title { font-size:14px; font-weight:700; color:var(--vl-text); margin:0 0 3px; }
// .vl-info-desc { font-size:12px; color:var(--vl-muted); margin:0 0 6px; line-height:1.45; }
// .vl-info-size { font-size:11px; color:var(--vl-muted); }
// .vl-info-pills { display:flex; flex-wrap:wrap; gap:5px; margin-top:6px; }
// .vl-info-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; font-size:10px; font-weight:700; }
// .vl-info-tags { display:flex; flex-wrap:wrap; gap:4px; margin-top:5px; }
// .vl-info-tag { font-size:10px; font-weight:600; padding:2px 7px; border-radius:8px; }
// .vl-playing-badge {
//   display:inline-flex; align-items:center; gap:6px;
//   padding:5px 12px; border-radius:50px;
//   background:rgba(52,211,153,.10); border:1px solid rgba(52,211,153,.20);
//   color:var(--vl-accent3); font-size:11px; font-weight:700; flex-shrink:0;
// }
// .vl-pulse { width:6px; height:6px; border-radius:50%; background:var(--vl-accent3); animation:vlPulse 1.5s ease-in-out infinite; }
// @keyframes vlPulse { 0%,100%{opacity:1} 50%{opacity:.3} }

// /* ── Watched bar ── */
// .vl-watched-bar { display:flex; align-items:center; justify-content:space-between; padding:0 24px 16px; flex-shrink:0; }
// .vl-mark-btn {
//   display:inline-flex; align-items:center; gap:8px;
//   padding:10px 20px; border-radius:12px; border:none;
//   background:var(--vl-accent3); color:#0a0a0a;
//   font-family:'Poppins',sans-serif; font-size:12px; font-weight:700;
//   cursor:pointer; box-shadow:0 4px 16px rgba(52,211,153,.30);
//   transition:opacity .2s,transform .15s;
// }
// .vl-mark-btn:hover { opacity:.88; transform:translateY(-1px); }
// .vl-watched-confirm {
//   display:inline-flex; align-items:center; gap:8px;
//   padding:10px 16px; border-radius:12px;
//   background:rgba(52,211,153,.10); border:1px solid rgba(52,211,153,.25);
//   color:var(--vl-accent3); font-size:12px; font-weight:700;
// }
// .vl-watched-count { font-size:11px; color:var(--vl-muted); }

// /* ── Next button ── */
// .vl-next-btn {
//   display:flex; align-items:center; gap:10px;
//   margin:0 24px 16px; padding:12px 16px; border-radius:14px;
//   border:1px solid var(--vl-border); background:var(--vl-bg); color:var(--vl-muted);
//   font-family:'Poppins',sans-serif; font-size:12px; font-weight:600;
//   cursor:pointer; transition:border-color .2s,color .2s,background .2s; text-align:left;
// }
// .vl-next-btn:hover { border-color:rgba(34,211,238,.30); color:var(--vl-accent1); background:rgba(34,211,238,.04); }
// .vl-next-label { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

// /* ── Empty states ── */
// .vl-empty-state { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:40px; }
// .vl-empty-big-icon { width:80px; height:80px; border-radius:24px; background:rgba(34,211,238,.10); border:1px solid rgba(34,211,238,.18); display:flex; align-items:center; justify-content:center; color:var(--vl-accent1); }
// .vl-empty-title { font-size:16px; font-weight:700; color:var(--vl-text); margin:0 0 4px; }
// .vl-empty-sub { font-size:13px; color:var(--vl-muted); margin:0; }
// .vl-open-btn {
//   display:inline-flex; align-items:center; gap:8px;
//   padding:12px 24px; border-radius:14px; border:none;
//   background:var(--vl-accent1); color:#0a0a0a;
//   font-family:'Poppins',sans-serif; font-size:13px; font-weight:700;
//   cursor:pointer; transition:opacity .2s,transform .2s;
// }
// .vl-open-btn:hover { opacity:.87; transform:translateY(-1px); }

// /* ── PiP placeholder ── */
// .vl-pip-placeholder {
//   flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px;
//   background:rgba(34,211,238,.03); border:2px dashed rgba(34,211,238,.20);
//   border-radius:16px; margin:16px; padding:40px;
//   font-family:'Poppins',sans-serif;
// }
// .vl-pip-ph-icon {
//   width:64px; height:64px; border-radius:18px;
//   background:rgba(34,211,238,.10); border:1px solid rgba(34,211,238,.20);
//   display:flex; align-items:center; justify-content:center; color:var(--vl-accent1);
// }
// .vl-pip-ph-title { font-size:15px; font-weight:700; color:var(--vl-text); margin:0 0 4px; text-align:center; }
// .vl-pip-ph-sub { font-size:12px; color:var(--vl-muted); margin:0; text-align:center; line-height:1.6; }

// /* ── Notes panel ── */
// .vl-notes-panel {
//   flex-shrink:0; display:flex; overflow:hidden;
//   transition:width .25s cubic-bezier(.4,0,.2,1);
// }
// .vl-notes-inner {
//   display:flex; flex-direction:column;
//   background:var(--vl-card); border:1px solid var(--vl-border);
//   border-radius:0 var(--vl-radius) var(--vl-radius) 0;
//   overflow:hidden; width:100%;
// }
// .vl-notes-head {
//   display:flex; align-items:center; justify-content:space-between;
//   padding:18px 20px; border-bottom:1px solid var(--vl-border); flex-shrink:0;
// }
// .vl-notes-title { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--vl-text); margin:0; }
// .vl-notes-body { flex:1; overflow:hidden; display:flex; flex-direction:column; }

// /* ════════════════════════════════════════════════════
//    MINI PLAYER STYLES
// ════════════════════════════════════════════════════ */
// @keyframes mpFadeIn {
//   from { opacity:0; transform:translateY(16px) scale(.95); }
//   to   { opacity:1; transform:translateY(0) scale(1); }
// }

// .mp-root {
//   position:fixed; z-index:9999;
//   border-radius:16px; overflow:hidden;
//   box-shadow:
//     0 0 0 1px rgba(255,255,255,.08),
//     0 8px 32px rgba(0,0,0,.50),
//     0 24px 64px rgba(0,0,0,.35);
//   background:#0d0d0d;
//   display:flex; flex-direction:column;
//   animation:mpFadeIn .25s cubic-bezier(.34,1.56,.64,1) both;
//   touch-action:none; user-select:none;
//   transition:box-shadow .2s;
// }
// .mp-root:hover {
//   box-shadow:
//     0 0 0 1px rgba(34,211,238,.28),
//     0 8px 32px rgba(0,0,0,.55),
//     0 24px 64px rgba(0,0,0,.45);
// }

// .mp-drag-bar {
//   display:flex; align-items:center; justify-content:space-between;
//   padding:7px 10px;
//   background:rgba(255,255,255,.04);
//   border-bottom:1px solid rgba(255,255,255,.06);
//   cursor:grab; flex-shrink:0;
// }
// .mp-drag-bar:active { cursor:grabbing; }
// .mp-drag-title {
//   font-family:'Poppins',sans-serif; font-size:10px; font-weight:600;
//   color:rgba(255,255,255,.55);
//   white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:150px;
//   display:flex; align-items:center; gap:5px;
// }
// .mp-drag-actions { display:flex; align-items:center; gap:4px; flex-shrink:0; }
// .mp-icon-btn {
//   width:24px; height:24px; border-radius:8px; border:none;
//   background:rgba(255,255,255,.06); color:rgba(255,255,255,.6);
//   display:flex; align-items:center; justify-content:center;
//   cursor:pointer; transition:background .15s,color .15s,transform .1s;
//   padding:0; flex-shrink:0;
// }
// .mp-icon-btn:hover { background:rgba(255,255,255,.14); color:#fff; transform:scale(1.1); }
// .mp-icon-btn.mp-close:hover  { background:rgba(239,68,68,.25);  color:#f87171; }
// .mp-icon-btn.mp-expand:hover { background:rgba(34,211,238,.20); color:#22d3ee; }

// .mp-video-wrap {
//   position:relative; flex:1; background:#000;
//   overflow:hidden; min-height:0;
// }
// .mp-video-wrap video,
// .mp-video-wrap iframe {
//   width:100%; height:100%; display:block; object-fit:contain; border:none;
// }

// .mp-overlay {
//   position:absolute; inset:0;
//   background:rgba(0,0,0,0);
//   display:flex; align-items:center; justify-content:center;
//   opacity:0; transition:opacity .2s,background .2s;
//   pointer-events:none;
// }
// .mp-video-wrap:hover .mp-overlay {
//   opacity:1; background:rgba(0,0,0,.35); pointer-events:auto;
// }
// .mp-play-btn {
//   width:44px; height:44px; border-radius:50%;
//   background:rgba(255,255,255,.15);
//   backdrop-filter:blur(8px);
//   border:2px solid rgba(255,255,255,.30);
//   color:#fff; display:flex; align-items:center; justify-content:center;
//   cursor:pointer; padding:0;
//   transition:background .15s,transform .15s;
// }
// .mp-play-btn:hover { background:rgba(34,211,238,.35); border-color:#22d3ee; transform:scale(1.1); }

// .mp-mute-btn {
//   position:absolute; bottom:8px; right:8px;
//   width:26px; height:26px; border-radius:8px;
//   background:rgba(0,0,0,.55); backdrop-filter:blur(4px);
//   border:1px solid rgba(255,255,255,.10);
//   color:rgba(255,255,255,.75);
//   display:flex; align-items:center; justify-content:center;
//   cursor:pointer; padding:0;
//   opacity:0; pointer-events:none;
//   transition:opacity .2s,background .15s;
// }
// .mp-video-wrap:hover .mp-mute-btn { opacity:1; pointer-events:auto; }
// .mp-mute-btn:hover { background:rgba(34,211,238,.25); color:#22d3ee; }

// .mp-pip-badge {
//   position:absolute; top:7px; left:8px;
//   font-family:'Poppins',sans-serif; font-size:9px; font-weight:700;
//   letter-spacing:.06em; padding:3px 7px; border-radius:20px;
//   background:rgba(34,211,238,.18); border:1px solid rgba(34,211,238,.32);
//   color:#22d3ee; pointer-events:none;
//   opacity:0; transition:opacity .2s;
// }
// .mp-video-wrap:hover .mp-pip-badge { opacity:1; }

// .mp-iframe-note {
//   position:absolute; bottom:8px; left:8px;
//   font-family:'Poppins',sans-serif; font-size:9px; font-weight:600;
//   color:rgba(255,255,255,.35); pointer-events:none;
// }

// .mp-resize {
//   position:absolute; bottom:0; right:0;
//   width:18px; height:18px; cursor:nwse-resize;
//   display:flex; align-items:flex-end; justify-content:flex-end;
//   padding:3px; z-index:10;
//   opacity:0; transition:opacity .2s;
// }
// .mp-root:hover .mp-resize { opacity:1; }
// .mp-resize::after {
//   content:''; display:block; width:8px; height:8px;
//   border-right:2px solid rgba(255,255,255,.40);
//   border-bottom:2px solid rgba(255,255,255,.40);
//   border-radius:1px;
// }

// .mp-pip-active {
//   position:absolute; inset:0;
//   background:rgba(0,0,0,.78);
//   display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
//   pointer-events:none; z-index:5;
// }
// .mp-pip-active span { font-family:'Poppins',sans-serif; font-size:11px; font-weight:600; color:rgba(255,255,255,.65); }
// .mp-pip-dot { width:8px; height:8px; border-radius:50%; background:#22d3ee; animation:mpDot 1.5s ease-in-out infinite; }
// @keyframes mpDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }

// @media (max-width:480px) {
//   .mp-root { bottom:12px !important; right:12px !important; left:12px !important; width:auto !important; }
// }

// @keyframes vlBar { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(.5)} }
// `;

// /* ── Inject styles once ── */
// if (!document.getElementById("vl-all-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "vl-all-styles";
//   tag.textContent = ALL_STYLES;
//   document.head.appendChild(tag);
// }

// /* ════════════════════════════════════════════════════
//    HELPERS
// ════════════════════════════════════════════════════ */
// const GRADS = [
//   "linear-gradient(135deg,#6d28d9,#4338ca)",
//   "linear-gradient(135deg,#0891b2,#0e7490)",
//   "linear-gradient(135deg,#be123c,#9f1239)",
//   "linear-gradient(135deg,#b45309,#92400e)",
//   "linear-gradient(135deg,#047857,#065f46)",
//   "linear-gradient(135deg,#1d4ed8,#1e40af)",
// ];
// const grad = (s) => GRADS[(s?.charCodeAt(0) ?? 0) % GRADS.length];

// const parseVideoUrl = (rawUrl) => {
//   if (!rawUrl?.trim()) return null;
//   const url = rawUrl.trim();
//   const ytW = url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/);
//   const ytS = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
//   const ytE = url.match(/youtube\.com\/embed\/([\w-]{11})/);
//   if (ytW || ytS || ytE) {
//     const id = (ytW || ytS || ytE)[1];
//     return { type: "iframe", url: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` };
//   }
//   const vim = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
//   if (vim) return { type: "iframe", url: `https://player.vimeo.com/video/${vim[1]}` };
//   if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com/video/"))
//     return { type: "iframe", url };
//   if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) return { type: "video", url };
//   return { type: "video", url };
// };

// const getSourceUrl = (v) =>
//   v?.videoUrl || v?.originalUrl || v?.sourceUrl || v?.url || v?.embedUrl || null;

// const getEmailFromToken = () => {
//   try {
//     const t = localStorage.getItem("lms_token");
//     if (!t) return null;
//     return JSON.parse(atob(t.split(".")[1])).sub;
//   } catch { return null; }
// };

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const InfoPill = ({ bg, color, border, children }) => (
//   <span className="vl-info-pill" style={{ background: bg, color, border: `1px solid ${border || "transparent"}` }}>
//     {children}
//   </span>
// );

// /* ── Arrow SVG for divider pill ── */
// const ArrowSvg = ({ dir }) => (
//   <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="vl-div-arrow">
//     {dir === "left"
//       ? <path d="M5 1.5L2.5 4L5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//       : <path d="M3 1.5L5.5 4L3 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//     }
//   </svg>
// );

// /* ── CRM-style Draggable Divider ── */
// const Divider = ({ onMouseDown, onToggle, panelOpen, side }) => {
//   const topArrow = side === "left"
//     ? (panelOpen ? "left"  : "right")
//     : (panelOpen ? "right" : "left");
//   const botArrow = side === "left"
//     ? (panelOpen ? "right" : "left")
//     : (panelOpen ? "left"  : "right");

//   return (
//     <div className="vl-resize" onMouseDown={onMouseDown}>
//       <div className="vl-resize-bar" />
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

// /* ════════════════════════════════════════════════════
//    INLINE MINI PLAYER COMPONENT
// ════════════════════════════════════════════════════ */
// const MiniPlayer = ({ video, blobUrl, sourceUrl, onClose, onExpand }) => {
//   const [pos,       setPos]       = useState({ x: null, y: null });
//   const [size,      setSize]      = useState({ w: 320, h: 190 });
//   const [playing,   setPlaying]   = useState(true);
//   const [muted,     setMuted]     = useState(false);
//   const [pipActive, setPipActive] = useState(false);

//   const rootRef  = useRef(null);
//   const videoRef = useRef(null);
//   const dragRef  = useRef(null);
//   const resRef   = useRef(null);

//   const parsed   = sourceUrl ? parseVideoUrl(sourceUrl) : null;
//   const isIframe = !blobUrl && parsed?.type === "iframe";
//   const embedUrl = parsed?.url ?? null;

//   useEffect(() => {
//     const el = videoRef.current;
//     if (!el) return;
//     playing ? el.play().catch(() => {}) : el.pause();
//   }, [playing]);

//   useEffect(() => {
//     const el = videoRef.current;
//     if (el) el.muted = muted;
//   }, [muted]);

//   const toggleNativePip = async () => {
//     const el = videoRef.current;
//     if (!el) return;
//     try {
//       document.pictureInPictureElement
//         ? await document.exitPictureInPicture()
//         : await el.requestPictureInPicture();
//     } catch {}
//   };

//   useEffect(() => {
//     const el = videoRef.current;
//     if (!el) return;
//     const onEnter = () => setPipActive(true);
//     const onLeave = () => setPipActive(false);
//     el.addEventListener("enterpictureinpicture", onEnter);
//     el.addEventListener("leavepictureinpicture", onLeave);
//     return () => {
//       el.removeEventListener("enterpictureinpicture", onEnter);
//       el.removeEventListener("leavepictureinpicture", onLeave);
//     };
//   }, []);

//   const onDragStart = (e) => {
//     if (e.target.closest("button")) return;
//     e.preventDefault();
//     const rect = rootRef.current?.getBoundingClientRect();
//     if (!rect) return;
//     const cx = e.touches?.[0]?.clientX ?? e.clientX;
//     const cy = e.touches?.[0]?.clientY ?? e.clientY;
//     dragRef.current = { sx: cx, sy: cy, ox: rect.left, oy: rect.top };
//   };

//   const onResizeStart = (e) => {
//     e.preventDefault(); e.stopPropagation();
//     const cx = e.touches?.[0]?.clientX ?? e.clientX;
//     const cy = e.touches?.[0]?.clientY ?? e.clientY;
//     resRef.current = { sx: cx, sy: cy, ow: size.w, oh: size.h };
//   };

//   useEffect(() => {
//     const onMove = (e) => {
//       const cx = e.touches?.[0]?.clientX ?? e.clientX;
//       const cy = e.touches?.[0]?.clientY ?? e.clientY;
//       if (dragRef.current) {
//         const dx = cx - dragRef.current.sx, dy = cy - dragRef.current.sy;
//         const vw = window.innerWidth, vh = window.innerHeight;
//         setPos({
//           x: Math.min(vw - size.w - 8, Math.max(8, dragRef.current.ox + dx)),
//           y: Math.min(vh - size.h - 8, Math.max(8, dragRef.current.oy + dy)),
//         });
//       }
//       if (resRef.current) {
//         const dx = cx - resRef.current.sx, dy = cy - resRef.current.sy;
//         setSize({
//           w: Math.min(560, Math.max(240, resRef.current.ow + dx)),
//           h: Math.min(400, Math.max(148, resRef.current.oh + dy)),
//         });
//       }
//     };
//     const onUp = () => { dragRef.current = null; resRef.current = null; };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup",   onUp);
//     window.addEventListener("touchmove", onMove, { passive: false });
//     window.addEventListener("touchend",  onUp);
//     return () => {
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup",   onUp);
//       window.removeEventListener("touchmove", onMove);
//       window.removeEventListener("touchend",  onUp);
//     };
//   }, [size]);

//   const posStyle = pos.x !== null
//     ? { left: pos.x, top: pos.y, bottom: "auto", right: "auto" }
//     : { bottom: 24, right: 24 };

//   const title = video?.title || video?.originalFileName || "Video";

//   return (
//     <div ref={rootRef} className="mp-root" style={{ ...posStyle, width: size.w }}>
//       <div className="mp-drag-bar" onMouseDown={onDragStart} onTouchStart={onDragStart}>
//         <span className="mp-drag-title">
//           <GripHorizontal size={10} style={{ color: "rgba(255,255,255,.25)", flexShrink: 0 }} />
//           {title}
//         </span>
//         <div className="mp-drag-actions">
//           {!isIframe && document.pictureInPictureEnabled && (
//             <button className="mp-icon-btn mp-expand" title="Browser Picture-in-Picture" onClick={toggleNativePip}>
//               <Minimize2 size={11} />
//             </button>
//           )}
//           <button className="mp-icon-btn mp-expand" title="Back to full player" onClick={onExpand}>
//             <Maximize2 size={11} />
//           </button>
//           <button className="mp-icon-btn mp-close" title="Close" onClick={onClose}>
//             <X size={11} />
//           </button>
//         </div>
//       </div>

//       <div className="mp-video-wrap" style={{ height: size.h }}>
//         {blobUrl && (
//           <video ref={videoRef} src={blobUrl} autoPlay playsInline
//             style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
//         )}
//         {!blobUrl && sourceUrl && !isIframe && (
//           <video ref={videoRef} src={sourceUrl} autoPlay playsInline
//             style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
//         )}
//         {isIframe && embedUrl && (
//           <iframe src={embedUrl} title="Mini player"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
//             allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
//         )}
//         {!isIframe && (
//           <div className="mp-overlay">
//             <button className="mp-play-btn" onClick={() => setPlaying(p => !p)}>
//               {playing ? <Pause size={18} /> : <Play size={18} />}
//             </button>
//           </div>
//         )}
//         {!isIframe && (
//           <button className="mp-mute-btn" onClick={() => setMuted(m => !m)}>
//             {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
//           </button>
//         )}
//         {isIframe && <span className="mp-iframe-note">Use player controls ↑</span>}
//         <span className="mp-pip-badge">PiP</span>
//         {pipActive && (
//           <div className="mp-pip-active">
//             <div className="mp-pip-dot" />
//             <span>Playing in Picture-in-Picture</span>
//           </div>
//         )}
//         <div className="mp-resize" onMouseDown={onResizeStart} onTouchStart={onResizeStart} />
//       </div>
//     </div>
//   );
// };

// /* ════════════════════════════════════════════════════
//    SMART PLAYER (main area)
// ════════════════════════════════════════════════════ */
// const SmartPlayer = ({ blobUrl, sourceUrl, autoPlay = true }) => {
//   if (blobUrl) {
//     return (
//       <video style={{ width: "100%", aspectRatio: "16/9" }}
//         controls autoPlay={autoPlay} controlsList="nodownload" playsInline src={blobUrl} />
//     );
//   }
//   if (sourceUrl) {
//     const p = parseVideoUrl(sourceUrl);
//     if (!p) return null;
//     if (p.type === "iframe") {
//       return (
//         <iframe className="vl-iframe-player" src={p.url} title="Video player"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
//           allowFullScreen />
//       );
//     }
//     return (
//       <video style={{ width: "100%", aspectRatio: "16/9" }}
//         controls autoPlay={autoPlay} controlsList="nodownload" playsInline src={p.url} />
//     );
//   }
//   return null;
// };

// /* ════════════════════════════════════════════════════
//    MAIN PAGE COMPONENT
// ════════════════════════════════════════════════════ */
// const VideoLectures = () => {
//   const [videos,          setVideos]          = useState([]);
//   const [videoUrls,       setVideoUrls]       = useState({});
//   const [playingId,       setPlayingId]       = useState(null);
//   const [watchedVideoIds, setWatchedVideoIds] = useState([]);
//   const [watchPercentage, setWatchPercentage] = useState(0);
//   const [sidebarOpen,     setSidebarOpen]     = useState(true);
//   const [notesOpen,       setNotesOpen]       = useState(true);
//   const [sidebarW,        setSidebarW]        = useState(300);
//   const [notesW,          setNotesW]          = useState(300);
//   const [dark,            setDark]            = useState(isDark);
//   const [loadingVideoId,  setLoadingVideoId]  = useState(null);
//   const [miniActive,      setMiniActive]      = useState(false);

//   const playerCardRef  = useRef(null);
//   const draggingRef    = useRef(null); // "left" | "right" | null
//   const startX         = useRef(0);
//   const startW         = useRef(0);

//   const studentEmail = getEmailFromToken();

//   /* ── Load videos + progress ── */
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

//   /* ── Dark mode observer ── */
//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDark()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body,            { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   /* ── Auto mini player on scroll away ── */
//   useEffect(() => {
//     if (!playingId) return;
//     const el = playerCardRef.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([entry]) => { if (!entry.isIntersecting) setMiniActive(true); },
//       { threshold: 0.15 },
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [playingId]);

//   /* ── Global mouse resize handlers ── */
//   useEffect(() => {
//     const onMove = (e) => {
//       if (!draggingRef.current) return;
//       const dx = e.clientX - startX.current;
//       if (draggingRef.current === "left") {
//         setSidebarW(Math.min(460, Math.max(200, startW.current + dx)));
//       } else {
//         setNotesW(Math.min(460, Math.max(200, startW.current - dx)));
//       }
//     };
//     const onUp = () => {
//       draggingRef.current = null;
//       document.body.style.cursor = "";
//       document.body.style.userSelect = "";
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup",   onUp);
//     return () => {
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup",   onUp);
//     };
//   }, []);

//   const onResizeStart = (side) => (e) => {
//     if (!e || e.button !== 0) return;
//     draggingRef.current = side;
//     startX.current = e.clientX;
//     startW.current = side === "left" ? sidebarW : notesW;
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   };

//   /* ── Play video ── */
//   const playVideo = async (video) => {
//     setMiniActive(false);
//     const src = getSourceUrl(video);
//     if (src) { setPlayingId(video.id); return; }
//     if (!videoUrls[video.id]) {
//       if (!video.storedFileName) { alert("Video source not found"); return; }
//       try {
//         setLoadingVideoId(video.id);
//         setPlayingId(video.id);
//         const res     = await videoService.getVideoBlob(video.storedFileName);
//         const blobUrl = URL.createObjectURL(res.data);
//         setVideoUrls(prev => ({ ...prev, [video.id]: blobUrl }));
//       } catch { alert("Unable to play video"); setPlayingId(null); return; }
//       finally { setLoadingVideoId(null); }
//     } else {
//       setPlayingId(video.id);
//     }
//   };

//   /* ── Mark watched ── */
//   const markWatched = async (video) => {
//     if (!studentEmail) return;
//     try {
//       const res = await progressService.markVideoWatched(studentEmail, video.batchId, video.id, videos.length);
//       setWatchedVideoIds(res.data.watchedVideoIds || []);
//       setWatchPercentage(res.data.watchPercentage || 0);
//     } catch (e) { console.error("Mark watched failed", e); }
//   };

//   /* ── Mini player handlers ── */
//   const toggleMini = useCallback(() => { if (playingId) setMiniActive(p => !p); }, [playingId]);
//   const expandMini = useCallback(() => {
//     setMiniActive(false);
//     setTimeout(() => playerCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
//   }, []);
//   const closeMini = useCallback(() => { setMiniActive(false); setPlayingId(null); }, []);

//   /* ── Video meta ── */
//   const getVideoMeta = (v) => {
//     let tags = [];
//     if (Array.isArray(v?.tags)) tags = v.tags.filter(Boolean);
//     else if (typeof v?.tags === "string" && v.tags.trim()) tags = v.tags.split(",").map(t => t.trim()).filter(Boolean);
//     return {
//       desc:       v?.description || v?.shortDesc || "",
//       courseName: v?.course || v?.courseName || v?.playlist || "",
//       category:   v?.category || "",
//       language:   v?.language || "",
//       tags,
//     };
//   };

//   const selectedVideo = videos.find(v => v.id === playingId);
//   const totalSizeMB   = Math.round(videos.reduce((a, v) => a + (v.size || 0), 0) / 1024 / 1024);
//   const currentIdx    = videos.findIndex(v => v.id === playingId);

//   /* ── Render main player content ── */
//   const renderPlayerContent = () => {
//     if (!playingId || !selectedVideo) return null;
//     const src       = getSourceUrl(selectedVideo);
//     const blobUrl   = videoUrls[playingId];
//     const isLoading = loadingVideoId === playingId;

//     if (isLoading && !blobUrl && !src) {
//       return (
//         <div style={{ width: "100%", aspectRatio: "16/9", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <span style={{ color: "rgba(255,255,255,.5)", fontFamily: "'Poppins',sans-serif", fontSize: 13 }}>Loading video…</span>
//         </div>
//       );
//     }
//     return (
//       <div style={{ background: "#000", flexShrink: 0 }}>
//         <SmartPlayer blobUrl={src ? null : blobUrl} sourceUrl={src || null} autoPlay />
//       </div>
//     );
//   };

//   /* ════════════ JSX ════════════ */
//   return (
//     <div className={`vl-root${dark ? " vl-dark" : ""}`}>
//       <div className="vl-inner">

//         {/* ── Header ── */}
//         <div className="vl-header">
//           <div className="vl-header-left">
//             <div className="vl-header-icon-box"><Film size={24} /></div>
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
//             <CheckCircle size={18} color="var(--vl-accent3)" />
//             <div className="vl-progress-chip-inner">
//               <span className="vl-progress-chip-val">{watchedVideoIds.length} / {Math.max(videos.length, 1)} watched</span>
//               <span className="vl-progress-chip-lbl">Video Progress</span>
//               {videos.length > 0 && (
//                 <div className="vl-progress-bar-wrap">
//                   <div className="vl-progress-bar" style={{ width: `${watchPercentage}%` }} />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Body: 3-panel layout ── */}
//         <div className="vl-body">

//           {/* ── PANEL 1: Library Sidebar ── */}
//           <div className="vl-sidebar" style={{ width: sidebarOpen ? sidebarW : "var(--vl-collapse, 36px)" }}>
//             {sidebarOpen ? (
//               <div className="vl-sidebar-inner">
//                 <div className="vl-sidebar-head">
//                   <div>
//                     <p className="vl-sidebar-title">
//                       <BookOpen size={14} style={{ color: "var(--vl-accent1)" }} /> Lecture Library
//                     </p>
//                     <p className="vl-sidebar-count">{videos.length} lecture{videos.length !== 1 && "s"}</p>
//                   </div>
//                 </div>
//                 <div className="vl-sidebar-list">
//                   {videos.length === 0 ? (
//                     <div className="vl-sidebar-empty">
//                       <div className="vl-empty-icon-box"><Video size={22} /></div>
//                       No videos available yet
//                     </div>
//                   ) : videos.map((v, index) => {
//                     const active    = playingId === v.id;
//                     const isWatched = watchedVideoIds.includes(v.id);
//                     const sizeMb    = Math.round((v.size || 0) / 1024 / 1024);
//                     const title     = v.title || v.originalFileName || "Untitled";
//                     const meta      = getVideoMeta(v);
//                     const isUrlVid  = !!getSourceUrl(v);
//                     return (
//                       <button key={v.id} onClick={() => playVideo(v)}
//                         className={`vl-list-item${active ? " active" : isWatched ? " watched" : ""}`}>
//                         <div className="vl-list-thumb" style={{ background: grad(title) }}>
//                           {active ? (
//                             <div className="vl-list-bars">
//                               <div className="vl-bar" style={{ height: 12, animation: "vlBar .6s ease-in-out infinite" }} />
//                               <div className="vl-bar" style={{ height: 16, animation: "vlBar .6s ease-in-out .1s infinite" }} />
//                               <div className="vl-bar" style={{ height: 10, animation: "vlBar .6s ease-in-out .2s infinite" }} />
//                             </div>
//                           ) : isWatched ? <CheckCircle size={14} color="white" /> : <Play size={14} color="white" />}
//                         </div>
//                         <div className="vl-list-info">
//                           <p className="vl-list-title">{index + 1}. {title}</p>
//                           <div className="vl-list-sub">
//                             {isUrlVid ? <><Link size={10} /><span>External URL</span></> : <><Clock size={10} /><span>{sizeMb} MB</span></>}
//                             {active    && <span className="vl-playing-dot">● Playing</span>}
//                             {isWatched && !active && <span className="vl-watched-dot">✓ Watched</span>}
//                           </div>
//                           {meta.courseName && (
//                             <p className="vl-list-course">
//                               <BookOpen size={9} style={{ marginRight: 3, verticalAlign: "middle" }} />{meta.courseName}
//                             </p>
//                           )}
//                           {meta.desc && <p className="vl-list-desc">{meta.desc}</p>}
//                           {(meta.category || meta.language) && (
//                             <div className="vl-list-pills">
//                               {meta.category && <span className="vl-list-pill" style={{ background: "rgba(251,146,60,.12)", color: "#fb923c" }}>{meta.category}</span>}
//                               {meta.language && <span className="vl-list-pill" style={{ background: "rgba(34,211,238,.10)", color: "var(--vl-accent1)" }}>{meta.language}</span>}
//                             </div>
//                           )}
//                           {meta.tags.length > 0 && (
//                             <div className="vl-list-pills" style={{ marginTop: 3 }}>
//                               {meta.tags.slice(0, 3).map((tag, i) => (
//                                 <span key={i} className="vl-list-pill" style={{ background: "rgba(167,139,250,.12)", color: "var(--vl-accent4)" }}>#{tag}</span>
//                               ))}
//                               {meta.tags.length > 3 && <span style={{ fontSize: 9, color: "var(--vl-muted)" }}>+{meta.tags.length - 3}</span>}
//                             </div>
//                           )}
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             ) : (
//               <div className="vl-collapsed-strip" onClick={() => setSidebarOpen(true)} title="Expand Lecture Library">
//                 <BookOpen size={14} color="var(--vl-accent1)" />
//                 <span className="vl-collapsed-label">Lecture Library</span>
//               </div>
//             )}
//           </div>

//           {/* ── DIVIDER 1: Library / Player ── */}
//           <Divider
//             side="left"
//             panelOpen={sidebarOpen}
//             onMouseDown={sidebarOpen ? onResizeStart("left") : undefined}
//             onToggle={() => setSidebarOpen(o => !o)}
//           />

//           {/* ── PANEL 2: Player (middle) ── */}
//           <div className="vl-player">

//             {/* Toolbar */}
//             <div className="vl-toolbar">
//               {selectedVideo && (
//                 <button
//                   className={`vl-pip-btn${miniActive ? " active" : ""}`}
//                   onClick={toggleMini}
//                   title={miniActive ? "Close mini player" : "Pop out to mini player"}
//                 >
//                   <Minimize2 size={14} />
//                   {miniActive ? "Exit Mini Player" : "Mini Player"}
//                 </button>
//               )}
//               {selectedVideo && (
//                 <p className="vl-now-playing">
//                   Now playing: <strong>{selectedVideo.title || selectedVideo.originalFileName}</strong>
//                 </p>
//               )}
//               {!selectedVideo && (
//                 <p style={{ fontSize: 12, color: "var(--vl-muted)", margin: 0 }}>
//                   Select a lecture from the library to begin
//                 </p>
//               )}
//             </div>

//             {/* Player card */}
//             <div className="vl-player-card" ref={playerCardRef}>
//               {playingId && selectedVideo ? (
//                 <>
//                   {miniActive ? (
//                     <div className="vl-pip-placeholder">
//                       <div className="vl-pip-ph-icon"><Minimize2 size={28} /></div>
//                       <p className="vl-pip-ph-title">Playing in Mini Player</p>
//                       <p className="vl-pip-ph-sub">
//                         Video chal raha hai floating mini player mein.<br />
//                         Wapas aane ke liye <strong>Expand</strong> button dabayein.
//                       </p>
//                       <button className="vl-open-btn" style={{ marginTop: 8 }} onClick={expandMini}>
//                         <PlayCircle size={15} /> Full Player Pe Wapas Jao
//                       </button>
//                     </div>
//                   ) : (
//                     renderPlayerContent()
//                   )}

//                   {/* Info bar */}
//                   {!miniActive && (() => {
//                     const meta     = getVideoMeta(selectedVideo);
//                     const isUrlVid = !!getSourceUrl(selectedVideo);
//                     return (
//                       <div className="vl-info-bar">
//                         <div className="vl-info-left">
//                           <div className="vl-info-thumb" style={{ background: grad(selectedVideo?.title || "") }}>
//                             <Film size={16} color="white" />
//                           </div>
//                           <div className="vl-info-text">
//                             <p className="vl-info-title">{selectedVideo?.title || selectedVideo?.originalFileName}</p>
//                             {meta.desc && <p className="vl-info-desc">{meta.desc}</p>}
//                             <p className="vl-info-size">
//                               {isUrlVid
//                                 ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Link size={10} /> External URL video</span>
//                                 : `${Math.round((selectedVideo?.size || 0) / 1024 / 1024)} MB`}
//                             </p>
//                             <div className="vl-info-pills">
//                               {meta.courseName && <InfoPill bg="rgba(167,139,250,.12)" color="var(--vl-accent4)" border="rgba(167,139,250,.2)"><BookOpen size={9} />{meta.courseName}</InfoPill>}
//                               {meta.category   && <InfoPill bg="rgba(251,146,60,.12)"  color="#fb923c"           border="rgba(251,146,60,.2)"><Layers size={9} />{meta.category}</InfoPill>}
//                               {meta.language   && <InfoPill bg="rgba(34,211,238,.10)"  color="var(--vl-accent1)" border="rgba(34,211,238,.2)"><Globe size={9} />{meta.language}</InfoPill>}
//                             </div>
//                             {meta.tags.length > 0 && (
//                               <div className="vl-info-tags">
//                                 <Tag size={10} color="var(--vl-muted)" style={{ marginTop: 2 }} />
//                                 {meta.tags.map((tag, i) => (
//                                   <span key={i} className="vl-info-tag" style={{ background: "rgba(167,139,250,.10)", color: "var(--vl-accent4)" }}>{tag}</span>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <span className="vl-playing-badge"><span className="vl-pulse" />Playing</span>
//                       </div>
//                     );
//                   })()}

//                   {/* Mark watched */}
//                   {!miniActive && (
//                     <div className="vl-watched-bar">
//                       {watchedVideoIds.includes(selectedVideo.id) ? (
//                         <div className="vl-watched-confirm"><CheckCircle size={16} />Marked as Watched</div>
//                       ) : (
//                         <button className="vl-mark-btn" onClick={() => markWatched(selectedVideo)}>
//                           <CheckCircle size={15} />Mark as Watched
//                         </button>
//                       )}
//                       <span className="vl-watched-count">{watchedVideoIds.length} of {videos.length} watched</span>
//                     </div>
//                   )}

//                   {/* Next video */}
//                   {!miniActive && currentIdx < videos.length - 1 && (
//                     <button className="vl-next-btn" onClick={() => playVideo(videos[currentIdx + 1])}>
//                       <PlayCircle size={16} style={{ color: "var(--vl-accent1)", flexShrink: 0 }} />
//                       <span className="vl-next-label">
//                         Next: {videos[currentIdx + 1]?.title || videos[currentIdx + 1]?.originalFileName}
//                       </span>
//                       <ChevronRight size={14} style={{ flexShrink: 0 }} />
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 <div className="vl-empty-state">
//                   <div className="vl-empty-big-icon"><PlayCircle size={40} /></div>
//                   <div style={{ textAlign: "center" }}>
//                     <p className="vl-empty-title">Lecture select karein</p>
//                     <p className="vl-empty-sub">Left side library se video choose karein</p>
//                   </div>
//                   {!sidebarOpen && (
//                     <button className="vl-open-btn" onClick={() => setSidebarOpen(true)}>
//                       <BookOpen size={15} /> Library Kholein
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── DIVIDER 2: Player / Notes ── */}
//           <Divider
//             side="right"
//             panelOpen={notesOpen}
//             onMouseDown={notesOpen ? onResizeStart("right") : undefined}
//             onToggle={() => setNotesOpen(o => !o)}
//           />

//           {/* ── PANEL 3: Notes ── */}
//           <div className="vl-notes-panel" style={{ width: notesOpen ? notesW : "var(--vl-collapse, 36px)" }}>
//             {notesOpen ? (
//               <div className="vl-notes-inner">
//                 <div className="vl-notes-head">
//                   <p className="vl-notes-title">
//                     <BookOpen size={14} style={{ color: "var(--vl-accent4)" }} /> My Notes
//                   </p>
//                   {selectedVideo && (
//                     <span style={{
//                       fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
//                       background: "rgba(167,139,250,.12)", color: "var(--vl-accent4)",
//                       border: "1px solid rgba(167,139,250,.2)", whiteSpace: "nowrap",
//                       overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120,
//                     }}>
//                       {selectedVideo.title || selectedVideo.originalFileName}
//                     </span>
//                   )}
//                 </div>
//                 <div className="vl-notes-body">
//                   <StudentNotebook
//                     lectureId={playingId ?? "default"}
//                     lectureTitle={
//                       selectedVideo
//                         ? (selectedVideo.title || selectedVideo.originalFileName || "Lecture")
//                         : "Lecture"
//                     }
//                     isDark={dark}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="vl-collapsed-strip-right" onClick={() => setNotesOpen(true)} title="Expand My Notes">
//                 <BookOpen size={14} color="var(--vl-accent4)" />
//                 <span className="vl-collapsed-label" style={{ color: "var(--vl-accent4)" }}>My Notes</span>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>

//       {/* ════ FLOATING MINI PLAYER ════ */}
//       {miniActive && selectedVideo && (
//         <MiniPlayer
//           video={selectedVideo}
//           blobUrl={getSourceUrl(selectedVideo) ? null : videoUrls[playingId]}
//           sourceUrl={getSourceUrl(selectedVideo) || null}
//           onClose={closeMini}
//           onExpand={expandMini}
//         />
//       )}
//     </div>
//   );
// };

// export default VideoLectures;