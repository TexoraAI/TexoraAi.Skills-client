
// import React, { useEffect, useState } from "react";
// import { Play, Trash2, Loader2, Film } from "lucide-react";
// import videoService from "../services/videoService";

// /* ─── theme tokens — same as rest of app ─── */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a", cardBg: "#111111",
//     border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
//     text: "#ffffff", textSub: "rgba(255,255,255,0.35)", textMuted: "rgba(255,255,255,0.2)",
//     shadow: "0 1px 8px rgba(0,0,0,0.4)", shadowHov: "0 8px 24px rgba(0,0,0,0.6)",
//     videoBg: "rgba(255,255,255,0.04)", inputBg: "rgba(255,255,255,0.05)",
//     skeletonBg: "rgba(255,255,255,0.07)",
//   },
//   light: {
//     pageBg: "#f1f5f9", cardBg: "#ffffff",
//     border: "#e2e8f0", borderHov: "#cbd5e1",
//     text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
//     shadow: "0 1px 8px rgba(0,0,0,0.06)", shadowHov: "0 6px 20px rgba(0,0,0,0.10)",
//     videoBg: "#f8fafc", inputBg: "#f8fafc",
//     skeletonBg: "#e2e8f0",
//   },
// };

// const VideoList = ({ refreshKey, trainerMode }) => {
//   const [videos, setVideos]       = useState([]);
//   const [videoUrls, setVideoUrls] = useState({});
//   const [loading, setLoading]     = useState(false);

//   /* ── theme detection ── */
//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" && (
//       document.documentElement.classList.contains("dark") ||
//       document.documentElement.getAttribute("data-theme") === "dark"
//     )
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() =>
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark"
//       )
//     );
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   /* ── fetch ── */
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         setLoading(true);
//         const res = trainerMode
//           ? await videoService.getTrainerVideos()
//           : await videoService.getStudentVideos();
//         setVideos(res.data || []);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideos();
//   }, [refreshKey, trainerMode]);

//   /* ── load blob ── */
//   const loadVideo = async (video) => {
//     if (videoUrls[video.id]) return;
//     const res = await videoService.getVideoBlob(video.storedFileName);
//     setVideoUrls(p => ({ ...p, [video.id]: URL.createObjectURL(res.data) }));
//   };

//   /* ── delete ── */
//   const deleteVideo = async (id) => {
//     if (!trainerMode) return;
//     if (!confirm("Delete this video?")) return;
//     await videoService.deleteVideo(id);
//     setVideos(p => p.filter(v => v.id !== id));
//   };

//   /* ── loading state ── */
//   if (loading) {
//     return (
//       <>
//         <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'); @keyframes shimmer{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//           gap: 16,
//           fontFamily: "'Poppins', sans-serif",
//         }}>
//           {[1, 2, 3].map(i => (
//             <div key={i} style={{
//               background: t.cardBg, borderRadius: 16,
//               border: `1px solid ${t.border}`, padding: 16,
//               boxShadow: t.shadow, animation: "shimmer 1.5s ease infinite",
//             }}>
//               <div style={{ height: 144, borderRadius: 10, background: t.skeletonBg, marginBottom: 12 }} />
//               <div style={{ height: 12, width: "60%", borderRadius: 6, background: t.skeletonBg, marginBottom: 8 }} />
//               <div style={{ height: 10, width: "40%", borderRadius: 5, background: t.skeletonBg }} />
//             </div>
//           ))}
//         </div>
//       </>
//     );
//   }

//   /* ── empty state ── */
//   if (videos.length === 0) {
//     return (
//       <>
//         <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>
//         <div style={{
//           display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", padding: "52px 24px", gap: 12,
//           background: t.cardBg, borderRadius: 16,
//           border: `1.5px dashed ${t.border}`,
//           boxShadow: t.shadow, fontFamily: "'Poppins', sans-serif",
//         }}>
//           <div style={{
//             width: 52, height: 52, borderRadius: 14,
//             background: isDark ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.07)",
//             border: "1px solid rgba(34,211,238,0.2)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <Film size={22} color="#22d3ee" />
//           </div>
//           <p style={{ fontSize: 13, fontWeight: 600, color: t.textSub, margin: 0 }}>No videos yet</p>
//           <p style={{ fontSize: 11, color: t.textMuted, margin: 0, textAlign: "center" }}>
//             {trainerMode ? "Upload your first video above" : "No lectures available yet"}
//           </p>
//         </div>
//       </>
//     );
//   }

//   /* ── main grid ── */
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
//         @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
//         .vl-card { transition: box-shadow .2s, border-color .2s, transform .2s; }
//         .vl-card:hover { box-shadow: var(--card-hov-shadow) !important; border-color: var(--card-hov-border) !important; transform: translateY(-2px); }
//         .vl-play-btn { transition: all .18s; }
//         .vl-play-btn:hover { background: #1d4ed8 !important; transform: scale(1.04); }
//         .vl-del-btn { transition: all .15s; }
//         .vl-del-btn:hover { background: rgba(248,113,113,0.15) !important; color: #f87171 !important; border-color: rgba(248,113,113,0.3) !important; }
//       `}</style>

//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//         gap: 16,
//         fontFamily: "'Poppins', sans-serif",
//       }}>
//         {videos.map((video, idx) => (
//           <div
//             key={video.id}
//             className="vl-card"
//             style={{
//               "--card-hov-shadow": isDark ? "0 8px 28px rgba(34,211,238,0.1), 0 2px 8px rgba(0,0,0,0.4)" : "0 8px 24px rgba(34,211,238,0.1), 0 2px 8px rgba(0,0,0,0.06)",
//               "--card-hov-border": "rgba(34,211,238,0.35)",
//               background: t.cardBg,
//               borderRadius: 16,
//               border: `1px solid ${t.border}`,
//               padding: 14,
//               boxShadow: t.shadow,
//               display: "flex", flexDirection: "column", gap: 10,
//               animation: `fadeUp .35s ease both`,
//               animationDelay: `${idx * 50}ms`,
//               position: "relative", overflow: "hidden",
//             }}
//           >
//             {/* top accent line */}
//             <div style={{
//               position: "absolute", top: 0, left: 16, right: 16, height: 2,
//               background: `linear-gradient(90deg,#22d3ee,transparent)`,
//               borderRadius: "0 0 99px 99px",
//               opacity: 0.5,
//             }} />

//             {/* video area */}
//             <div style={{
//               height: 144, borderRadius: 10, overflow: "hidden",
//               background: t.videoBg,
//               border: `1px solid ${t.border}`,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               position: "relative",
//             }}>
//               {!videoUrls[video.id] ? (
//                 /* play button */
//                 <button
//                   className="vl-play-btn"
//                   onClick={() => loadVideo(video)}
//                   style={{
//                     display: "flex", alignItems: "center", gap: 7,
//                     padding: "9px 20px", borderRadius: 10,
//                     background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
//                     border: "none", color: "#fff",
//                     fontSize: 13, fontWeight: 600, cursor: "pointer",
//                     boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
//                     fontFamily: "'Poppins', sans-serif",
//                   }}
//                 >
//                   <Play size={14} style={{ fill: "#fff", strokeWidth: 0 }} />
//                   Play
//                 </button>
//               ) : (
//                 <video
//                   src={videoUrls[video.id]}
//                   controls
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               )}
//             </div>

//             {/* title */}
//             <p style={{
//               fontSize: 13, fontWeight: 700, color: t.text,
//               margin: 0, lineHeight: 1.4,
//               overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//             }}>
//               {video.title}
//             </p>

//             {/* delete button */}
//             {trainerMode && (
//               <button
//                 className="vl-del-btn"
//                 onClick={() => deleteVideo(video.id)}
//                 style={{
//                   display: "inline-flex", alignItems: "center", justifyContent: "center",
//                   width: 32, height: 32, borderRadius: 8,
//                   background: isDark ? "rgba(248,113,113,0.08)" : "rgba(248,113,113,0.06)",
//                   border: "1px solid rgba(248,113,113,0.2)",
//                   color: "#f87171", cursor: "pointer",
//                   alignSelf: "flex-start",
//                 }}
//               >
//                 <Trash2 size={14} />
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default VideoList;
































import React, { useEffect, useRef, useState } from "react";
import { Play, Trash2, Film, Tag, Globe, BookOpen, AlignLeft, Layers, Link } from "lucide-react";
import videoService from "../services/videoService";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.35)", textMuted: "rgba(255,255,255,0.2)",
    shadow: "0 1px 8px rgba(0,0,0,0.4)", shadowHov: "0 8px 24px rgba(0,0,0,0.6)",
    videoBg: "rgba(255,255,255,0.04)", inputBg: "rgba(255,255,255,0.05)",
    skeletonBg: "rgba(255,255,255,0.07)",
    metaBg: "rgba(255,255,255,0.04)",
    tagBg: "rgba(34,211,238,0.10)", tagColor: "#22d3ee",
    courseBg: "rgba(167,139,250,0.12)", courseColor: "#a78bfa",
    catBg: "rgba(251,146,60,0.12)", catColor: "#fb923c",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff",
    border: "#e2e8f0", borderHov: "#cbd5e1",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    shadow: "0 1px 8px rgba(0,0,0,0.06)", shadowHov: "0 6px 20px rgba(0,0,0,0.10)",
    videoBg: "#f8fafc", inputBg: "#f8fafc",
    skeletonBg: "#e2e8f0",
    metaBg: "#f8fafc",
    tagBg: "rgba(34,211,238,0.10)", tagColor: "#0891b2",
    courseBg: "rgba(124,58,237,0.08)", courseColor: "#7c3aed",
    catBg: "rgba(234,88,12,0.08)", catColor: "#ea580c",
  },
};

/* ── gradient pool for thumbnails ── */
const GRADS = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#0891b2,#0e7490)",
  "linear-gradient(135deg,#be123c,#9f1239)",
  "linear-gradient(135deg,#b45309,#92400e)",
  "linear-gradient(135deg,#047857,#065f46)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
];
const gradFor = (s) => GRADS[(s?.charCodeAt(0) ?? 0) % GRADS.length];

/* ─────────────────── URL → EMBED CONVERTER ─────────────────── */
/**
 * Given a raw URL string, returns { type: "iframe" | "video", url: string }
 * so the caller knows whether to render <iframe> or <video>.
 */
const parseVideoUrl = (rawUrl) => {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();

  // YouTube: watch, youtu.be shortlink, shorts, already-embed
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

  // Direct video file
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) {
    return { type: "video", url };
  }

  // Already an embed URL?
  if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com/video/")) {
    return { type: "iframe", url };
  }

  // Fallback: try as direct video
  return { type: "video", url };
};

/**
 * Determine if a video object is URL-based (not an uploaded file).
 * Returns the raw source URL string, or null if it's an uploaded file.
 */
const getVideoSourceUrl = (video) => {
  // Check common field names your backend might store
  return (
    video.videoUrl ||
    video.originalUrl ||
    video.sourceUrl ||
    video.url ||
    // If no storedFileName but we have an embedUrl field
    video.embedUrl ||
    null
  );
};

/**
 * Is this video stored as an uploaded file on the server?
 * True when storedFileName exists AND it's not a URL-sourced video.
 */
const isUploadedFile = (video) => {
  const hasStoredFile = !!(video.storedFileName && video.storedFileName.trim());
  const hasSourceUrl  = !!getVideoSourceUrl(video);
  // If it has a source URL it's a URL video regardless of storedFileName
  if (hasSourceUrl) return false;
  return hasStoredFile;
};

/* ─────────────────── SMART VIDEO PLAYER ─────────────────── */
/**
 * Renders the right player element based on what we have:
 * - blobUrl   → uploaded file already fetched, use <video>
 * - sourceUrl → URL-based video, detect type and render <iframe> or <video>
 * - neither   → show nothing (shouldn't happen after load)
 */
const SmartPlayer = ({ blobUrl, sourceUrl, style = {} }) => {
  const base = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    border: "none",
    ...style,
  };

  if (blobUrl) {
    return <video src={blobUrl} controls style={base} />;
  }

  if (sourceUrl) {
    const parsed = parseVideoUrl(sourceUrl);
    if (!parsed) return null;

    if (parsed.type === "iframe") {
      return (
        <iframe
          src={parsed.url}
          style={{ ...base, objectFit: undefined }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
        />
      );
    }
    return <video src={parsed.url} controls style={base} />;
  }

  return null;
};

/* ── pill badge ── */
const Pill = ({ bg, color, children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 3,
    padding: "2px 8px", borderRadius: 20,
    background: bg, color, fontSize: 10, fontWeight: 700,
    fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap",
    letterSpacing: "0.02em",
  }}>{children}</span>
);

/* ── URL type badge ── */
const UrlBadge = ({ t }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 3,
    padding: "2px 7px", borderRadius: 20,
    background: "rgba(34,211,238,0.10)", color: t.tagColor,
    fontSize: 9, fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
  }}>
    <Link size={8} /> URL
  </span>
);

const VideoList = ({ refreshKey, trainerMode }) => {
  const [videos,    setVideos]    = useState([]);
  // videoUrls stores resolved blob URLs for uploaded files
  // videoUrlMap stores the source URL for URL-based videos (already available from video object)
  const [videoUrls, setVideoUrls] = useState({});
  const [loading,   setLoading]   = useState(false);
  const [expanded,  setExpanded]  = useState({});
  // Track which cards are showing the player (clicked Play)
  const [playing,   setPlaying]   = useState({});

  /* ── theme detection ── */
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      )
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  /* ── fetch videos ── */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = trainerMode
          ? await videoService.getTrainerVideos()
          : await videoService.getStudentVideos();
        setVideos(res.data || []);
        // Reset play state on refresh
        setPlaying({});
        setVideoUrls({});
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [refreshKey, trainerMode]);

  /* ── handle Play button click ── */
  const handlePlay = async (video) => {
    // Mark this card as playing so the player shows
    setPlaying(p => ({ ...p, [video.id]: true }));

    const sourceUrl = getVideoSourceUrl(video);

    if (sourceUrl) {
      // URL-based video — no blob fetch needed, parseVideoUrl handles it at render time
      return;
    }

    // Uploaded file — fetch blob if not already fetched
    if (!videoUrls[video.id] && video.storedFileName) {
      try {
        const res = await videoService.getVideoBlob(video.storedFileName);
        setVideoUrls(p => ({ ...p, [video.id]: URL.createObjectURL(res.data) }));
      } catch (err) {
        console.error("Failed to load video blob", err);
        setPlaying(p => ({ ...p, [video.id]: false }));
      }
    }
  };

  /* ── delete ── */
  const deleteVideo = async (id) => {
    if (!trainerMode) return;
    if (!confirm("Delete this video?")) return;
    await videoService.deleteVideo(id);
    setVideos(p => p.filter(v => v.id !== id));
  };

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'); @keyframes shimmer{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, fontFamily: "'Poppins', sans-serif" }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: t.cardBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 16, boxShadow: t.shadow, animation: "shimmer 1.5s ease infinite" }}>
              <div style={{ height: 144, borderRadius: 10, background: t.skeletonBg, marginBottom: 12 }} />
              <div style={{ height: 12, width: "70%", borderRadius: 6, background: t.skeletonBg, marginBottom: 8 }} />
              <div style={{ height: 10, width: "50%", borderRadius: 5, background: t.skeletonBg, marginBottom: 6 }} />
              <div style={{ height: 10, width: "40%", borderRadius: 5, background: t.skeletonBg }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  /* ── empty state ── */
  if (videos.length === 0) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 24px", gap: 12, background: t.cardBg, borderRadius: 16, border: `1.5px dashed ${t.border}`, boxShadow: t.shadow, fontFamily: "'Poppins', sans-serif" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: isDark ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Film size={22} color="#22d3ee" />
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: t.textSub, margin: 0 }}>No videos yet</p>
          <p style={{ fontSize: 11, color: t.textMuted, margin: 0, textAlign: "center" }}>
            {trainerMode ? "Upload your first video above" : "No lectures available yet"}
          </p>
        </div>
      </>
    );
  }

  /* ── main grid ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .vl-card { transition: box-shadow .2s, border-color .2s, transform .2s; }
        .vl-card:hover { box-shadow: var(--card-hov-shadow) !important; border-color: var(--card-hov-border) !important; transform: translateY(-2px); }
        .vl-play-btn { transition: all .18s; }
        .vl-play-btn:hover { background: #1d4ed8 !important; transform: scale(1.04); }
        .vl-del-btn { transition: all .15s; }
        .vl-del-btn:hover { background: rgba(248,113,113,0.15) !important; color: #f87171 !important; border-color: rgba(248,113,113,0.3) !important; }
        .vl-expand-btn { transition: all .15s; }
        .vl-expand-btn:hover { color: #22d3ee !important; }
        .vl-tags-row { display: flex; flex-wrap: wrap; gap: 4; margin-top: 4px; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, fontFamily: "'Poppins', sans-serif" }}>
        {videos.map((video, idx) => {
          const isExpanded  = expanded[video.id];
          const isPlaying   = playing[video.id];
          const sourceUrl   = getVideoSourceUrl(video);
          const isUrlVideo  = !!sourceUrl;
          const blobUrl     = videoUrls[video.id];

          // Decide if we can show the player right now
          const playerReady = isPlaying && (isUrlVideo ? true : !!blobUrl);

          let tags = [];
          if (Array.isArray(video.tags)) {
            tags = video.tags.filter(Boolean);
          } else if (typeof video.tags === "string" && video.tags.trim()) {
            tags = video.tags.split(",").map(tg => tg.trim()).filter(Boolean);
          }
          const desc       = video.description || video.shortDesc || "";
          const courseName = video.course || video.courseName || video.playlist || "";
          const category   = video.category || "";
          const language   = video.language || "";

          return (
            <div
              key={video.id}
              className="vl-card"
              style={{
                "--card-hov-shadow": isDark ? "0 8px 28px rgba(34,211,238,0.1), 0 2px 8px rgba(0,0,0,0.4)" : "0 8px 24px rgba(34,211,238,0.1), 0 2px 8px rgba(0,0,0,0.06)",
                "--card-hov-border": "rgba(34,211,238,0.35)",
                background: t.cardBg,
                borderRadius: 16,
                border: `1px solid ${t.border}`,
                padding: 14,
                boxShadow: t.shadow,
                display: "flex", flexDirection: "column", gap: 10,
                animation: `fadeUp .35s ease both`,
                animationDelay: `${idx * 50}ms`,
                position: "relative", overflow: "hidden",
              }}
            >
              {/* top accent line */}
              <div style={{ position: "absolute", top: 0, left: 16, right: 16, height: 2, background: `linear-gradient(90deg,#22d3ee,transparent)`, borderRadius: "0 0 99px 99px", opacity: 0.5 }} />

              {/* ── video thumbnail / player ── */}
              <div style={{
                height: playerReady ? "auto" : 144,
                aspectRatio: playerReady ? "16/9" : undefined,
                borderRadius: 10, overflow: "hidden",
                background: "#000",
                border: `1px solid ${t.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                {playerReady ? (
                  /* ── PLAYER: either blob <video>, YouTube <iframe>, or direct <video> ── */
                  <SmartPlayer
                    blobUrl={isUrlVideo ? null : blobUrl}
                    sourceUrl={isUrlVideo ? sourceUrl : null}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  /* ── THUMBNAIL + PLAY BUTTON ── */
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 10, width: "100%", height: "100%",
                    position: "relative", justifyContent: "center",
                  }}>
                    {/* gradient bg */}
                    <div style={{ position: "absolute", inset: 0, background: gradFor(video.title), opacity: 0.18, borderRadius: 10 }} />

                    {/* URL badge top-right */}
                    {isUrlVideo && (
                      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                        <UrlBadge t={t} />
                      </div>
                    )}

                    <button
                      className="vl-play-btn"
                      onClick={() => handlePlay(video)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "9px 20px", borderRadius: 10,
                        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                        border: "none", color: "#fff",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                        fontFamily: "'Poppins', sans-serif",
                        position: "relative", zIndex: 1,
                      }}
                    >
                      <Play size={14} style={{ fill: "#fff", strokeWidth: 0 }} />
                      {isUrlVideo ? "Play" : "Play"}
                    </button>

                    {/* loading state: uploaded file being fetched */}
                    {isPlaying && !isUrlVideo && !blobUrl && (
                      <div style={{ position: "absolute", bottom: 8, fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "'Poppins', sans-serif", zIndex: 2 }}>
                        Loading…
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* title */}
              <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {video.title}
              </p>

              {/* pills: course + category + language */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                {courseName && (
                  <Pill bg={t.courseBg} color={t.courseColor}>
                    <BookOpen size={9} />{courseName}
                  </Pill>
                )}
                {category && (
                  <Pill bg={t.catBg} color={t.catColor}>
                    <Layers size={9} />{category}
                  </Pill>
                )}
                {language && (
                  <Pill bg={t.tagBg} color={t.tagColor}>
                    <Globe size={9} />{language}
                  </Pill>
                )}
              </div>

              {/* description (expandable) */}
              {desc && (
                <div>
                  <p style={{
                    fontSize: 11, color: t.textSub, margin: 0, lineHeight: 1.55,
                    overflow: "hidden",
                    display: "-webkit-box", WebkitLineClamp: isExpanded ? "unset" : 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    <AlignLeft size={9} style={{ marginRight: 4, flexShrink: 0, verticalAlign: "middle", opacity: 0.6 }} />
                    {desc}
                  </p>
                  {desc.length > 80 && (
                    <button
                      className="vl-expand-btn"
                      onClick={() => toggleExpand(video.id)}
                      style={{ background: "none", border: "none", padding: 0, marginTop: 2, fontSize: 10, fontWeight: 600, color: t.textMuted, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}

              {/* tags */}
              {tags.length > 0 && (
                <div className="vl-tags-row">
                  <Tag size={10} color={t.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
                  {tags.slice(0, 4).map((tag, i) => (
                    <span key={i} style={{ fontSize: 10, fontWeight: 500, color: t.tagColor, background: t.tagBg, padding: "2px 7px", borderRadius: 8, fontFamily: "'Poppins', sans-serif" }}>
                      {tag}
                    </span>
                  ))}
                  {tags.length > 4 && (
                    <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins', sans-serif" }}>+{tags.length - 4}</span>
                  )}
                </div>
              )}

              {/* meta footer: size + visibility */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 6, borderTop: `1px solid ${t.border}` }}>
                <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins', sans-serif" }}>
                  {isUrlVideo
                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Link size={9} /> External URL</span>
                    : `${((video.size || 0) / 1024 / 1024).toFixed(1)} MB`
                  }
                </span>
                {video.visibility && (
                  <Pill bg={t.metaBg} color={t.textSub}>
                    {video.visibility}
                  </Pill>
                )}
              </div>

              {/* delete button */}
              {trainerMode && (
                <button
                  className="vl-del-btn"
                  onClick={() => deleteVideo(video.id)}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: isDark ? "rgba(248,113,113,0.08)" : "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", cursor: "pointer", alignSelf: "flex-start" }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VideoList;