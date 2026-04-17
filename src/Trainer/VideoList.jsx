// import React, { useEffect, useState } from "react";
// import { Play, Trash2, Loader2 } from "lucide-react";
// import videoService from "../services/videoService";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const VideoList = ({ refreshKey, trainerMode }) => {
//   const [videos, setVideos] = useState([]);
//   const [videoUrls, setVideoUrls] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         setLoading(true);

//         // 🔥 FIXED: trainer should see only his batch videos
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

//   const loadVideo = async (video) => {
//     if (videoUrls[video.id]) return;
//     const res = await videoService.getVideoBlob(video.storedFileName);
//     setVideoUrls((p) => ({
//       ...p,
//       [video.id]: URL.createObjectURL(res.data),
//     }));
//   };

//   const deleteVideo = async (id) => {
//     if (!trainerMode) return;
//     if (!confirm("Delete this video?")) return;
//     await videoService.deleteVideo(id);
//     setVideos((p) => p.filter((v) => v.id !== id));
//   };

//   if (loading) {
//     return <Loader2 className="w-7 h-7 animate-spin mx-auto mt-10" />;
//   }

//   return (
//     <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
//       {videos.map((video) => (
//         <Card key={video.id} className="p-4 space-y-2">
//           <div className="h-36 flex items-center justify-center bg-muted rounded-lg">
//             {!videoUrls[video.id] ? (
//               <Button size="sm" onClick={() => loadVideo(video)}>
//                 <Play className="w-4 h-4 mr-1" /> Play
//               </Button>
//             ) : (
//               <video
//                 src={videoUrls[video.id]}
//                 controls
//                 className="w-full h-full"
//               />
//             )}
//           </div>

//           <h3 className="text-sm font-semibold">{video.title}</h3>

//           {trainerMode && (
//             <Button
//               size="sm"
//               variant="destructive"
//               onClick={() => deleteVideo(video.id)}
//             >
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           )}
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default VideoList;













import React, { useEffect, useState } from "react";
import { Play, Trash2, Loader2, Film } from "lucide-react";
import videoService from "../services/videoService";

/* ─── theme tokens — same as rest of app ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.35)", textMuted: "rgba(255,255,255,0.2)",
    shadow: "0 1px 8px rgba(0,0,0,0.4)", shadowHov: "0 8px 24px rgba(0,0,0,0.6)",
    videoBg: "rgba(255,255,255,0.04)", inputBg: "rgba(255,255,255,0.05)",
    skeletonBg: "rgba(255,255,255,0.07)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff",
    border: "#e2e8f0", borderHov: "#cbd5e1",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    shadow: "0 1px 8px rgba(0,0,0,0.06)", shadowHov: "0 6px 20px rgba(0,0,0,0.10)",
    videoBg: "#f8fafc", inputBg: "#f8fafc",
    skeletonBg: "#e2e8f0",
  },
};

const VideoList = ({ refreshKey, trainerMode }) => {
  const [videos, setVideos]       = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [loading, setLoading]     = useState(false);

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

  /* ── fetch ── */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = trainerMode
          ? await videoService.getTrainerVideos()
          : await videoService.getStudentVideos();
        setVideos(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [refreshKey, trainerMode]);

  /* ── load blob ── */
  const loadVideo = async (video) => {
    if (videoUrls[video.id]) return;
    const res = await videoService.getVideoBlob(video.storedFileName);
    setVideoUrls(p => ({ ...p, [video.id]: URL.createObjectURL(res.data) }));
  };

  /* ── delete ── */
  const deleteVideo = async (id) => {
    if (!trainerMode) return;
    if (!confirm("Delete this video?")) return;
    await videoService.deleteVideo(id);
    setVideos(p => p.filter(v => v.id !== id));
  };

  /* ── loading state ── */
  if (loading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'); @keyframes shimmer{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
          fontFamily: "'Poppins', sans-serif",
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: t.cardBg, borderRadius: 16,
              border: `1px solid ${t.border}`, padding: 16,
              boxShadow: t.shadow, animation: "shimmer 1.5s ease infinite",
            }}>
              <div style={{ height: 144, borderRadius: 10, background: t.skeletonBg, marginBottom: 12 }} />
              <div style={{ height: 12, width: "60%", borderRadius: 6, background: t.skeletonBg, marginBottom: 8 }} />
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
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "52px 24px", gap: 12,
          background: t.cardBg, borderRadius: 16,
          border: `1.5px dashed ${t.border}`,
          boxShadow: t.shadow, fontFamily: "'Poppins', sans-serif",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: isDark ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.07)",
            border: "1px solid rgba(34,211,238,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
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
      `}</style>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
        fontFamily: "'Poppins', sans-serif",
      }}>
        {videos.map((video, idx) => (
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
            <div style={{
              position: "absolute", top: 0, left: 16, right: 16, height: 2,
              background: `linear-gradient(90deg,#22d3ee,transparent)`,
              borderRadius: "0 0 99px 99px",
              opacity: 0.5,
            }} />

            {/* video area */}
            <div style={{
              height: 144, borderRadius: 10, overflow: "hidden",
              background: t.videoBg,
              border: `1px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              {!videoUrls[video.id] ? (
                /* play button */
                <button
                  className="vl-play-btn"
                  onClick={() => loadVideo(video)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 20px", borderRadius: 10,
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    border: "none", color: "#fff",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Play size={14} style={{ fill: "#fff", strokeWidth: 0 }} />
                  Play
                </button>
              ) : (
                <video
                  src={videoUrls[video.id]}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>

            {/* title */}
            <p style={{
              fontSize: 13, fontWeight: 700, color: t.text,
              margin: 0, lineHeight: 1.4,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {video.title}
            </p>

            {/* delete button */}
            {trainerMode && (
              <button
                className="vl-del-btn"
                onClick={() => deleteVideo(video.id)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 8,
                  background: isDark ? "rgba(248,113,113,0.08)" : "rgba(248,113,113,0.06)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171", cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default VideoList;