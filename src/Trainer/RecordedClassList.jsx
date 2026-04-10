// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Search,
//   Video,
//   Upload,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const RecordedClassList = () => {
//   const navigate = useNavigate();

//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   /* ================= FETCH VIDEOS FROM BACKEND ================= */
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await fetch("/api/recorded-videos");

//         // ✅ Check response is OK before parsing
//         if (!res.ok) {
//           console.error("Server error:", res.status);
//           setVideos([]);
//           return;
//         }

//         // ✅ Safe parse — avoids crash if response body is empty
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];

//         setVideos(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Failed to fetch videos:", error);
//         setVideos([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   const filtered = videos.filter((v) =>
//     v.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">

//       {/* ================= HEADER ================= */}
//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex justify-between items-center">

//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/trainer")}
//             className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
//           >
//             <ArrowLeft size={18} />
//           </button>

//           <div>
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Video size={22} />
//               Recorded Classes
//             </h2>
//             <p className="text-sm opacity-90 mt-1">
//               {videos.length} videos
//             </p>
//           </div>
//         </div>

//         <Button
//           onClick={() => navigate("/trainer/upload-recorded")}
//           className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2"
//         >
//           <Upload size={16} /> Upload Video
//         </Button>
//       </div>

//       {/* ================= SEARCH ================= */}
//       <Card className="mb-6 bg-white dark:bg-[#1F2937]">
//         <CardContent className="p-4">
//           <Input
//             placeholder="Search videos..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </CardContent>
//       </Card>

//       {/* ================= LOADING ================= */}
//       {loading && (
//         <div className="text-center py-20">
//           <p className="text-gray-500 dark:text-slate-400">Loading videos...</p>
//         </div>
//       )}

//       {/* ================= EMPTY ================= */}
//       {!loading && filtered.length === 0 && (
//         <div className="text-center py-20 text-gray-400 dark:text-slate-500">
//           <Video size={50} className="mx-auto mb-4 opacity-30" />
//           <p className="font-medium">No videos found</p>
//         </div>
//       )}

//       {/* ================= VIDEO GRID ================= */}
//       {!loading && filtered.length > 0 && (
//         <div className="grid md:grid-cols-3 gap-6">
//           {filtered.map((video) => (
//             <Card
//               key={video.id}
//               className="bg-white dark:bg-[#1F2937] border dark:border-white/10 hover:shadow-lg transition cursor-pointer"
//               onClick={() => navigate(`/trainer/live/recorded/edit/${video.id}`)}
//             >
//               <CardContent className="p-4">

//                 {/* Thumbnail */}
//                 {video.thumbnail ? (
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="rounded-lg mb-3 h-40 w-full object-cover"
//                   />
//                 ) : (
//                   <div className="rounded-lg mb-3 h-40 w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
//                     <Video size={32} className="text-blue-300 opacity-50" />
//                   </div>
//                 )}

//                 <h3 className="font-semibold text-lg">{video.title}</h3>

//                 <p className="text-sm opacity-70 mt-1 line-clamp-2">
//                   {video.description}
//                 </p>

//                 <p className="text-xs mt-2 opacity-60">
//                   Batch: {video.batchName}
//                 </p>

//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecordedClassList;













import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Video, Upload, Sparkles, Activity, Play } from "lucide-react";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
    actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    gridLine: "rgba(255,255,255,0.5)", barBg: "rgba(255,255,255,0.05)",
    inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
    videoBg: "rgba(255,255,255,0.03)", videoBorder: "rgba(255,255,255,0.05)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    thumbBg: "rgba(255,255,255,0.04)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc", heroBg: "#ffffff",
    border: "#e2e8f0", borderHov: "#cbd5e1", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    actBg: "#f8fafc", actBorder: "#e2e8f0", actBar: "#94a3b8", actIcon: "#94a3b8",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    gridLine: "rgba(0,0,0,0.12)", barBg: "#f1f5f9",
    inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
    videoBg: "#f8fafc", videoBorder: "#e2e8f0",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    thumbBg: "#f1f5f9",
  },
};

const RecordedClassList = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/recorded-videos");
        if (!res.ok) { setVideos([]); return; }
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filtered = videos.filter((v) => v.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(244,63,94,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => navigate("/trainer")} style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, flexShrink: 0 }}>
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <Sparkles size={11} color={t.textSub} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Library</span>
                  </div>
                  <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
                    <Video size={22} color="#f43f5e" /> Recorded Classes
                  </h1>
                  <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>{videos.length} video{videos.length !== 1 ? "s" : ""} in your library</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>
                <UploadBtn navigate={navigate} t={t} />
              </div>
            </div>
          </div>

          {/* ═══ SEARCH ═══ */}
          <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "12px 16px", boxShadow: t.shadow, marginBottom: 20, position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
            <input
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", padding: "8px 14px 8px 34px", borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none" }}
            />
          </div>

          {/* ═══ CONTENT ═══ */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, overflow: "hidden", boxShadow: t.shadow }}>
                  <div style={{ height: 160, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 12, borderRadius: 6, background: t.barBg, animation: "pulse 1.5s ease infinite", width: "75%" }} />
                    <div style={{ height: 10, borderRadius: 5, background: t.barBg, animation: "pulse 1.5s ease infinite", width: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
                <Video size={28} color={t.emptyIcon} />
              </div>
              <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No videos found</p>
              <button onClick={() => navigate("/trainer/upload-recorded")} style={{ padding: "8px 20px", borderRadius: 10, border: "1px solid rgba(244,63,94,0.25)", background: "rgba(244,63,94,0.08)", color: "#f43f5e", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                Upload Your First Video →
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {filtered.map((video, i) => (
                <VideoCard key={video.id} video={video} t={t} isDark={isDark} index={i} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function VideoCard({ video, t, isDark, index, navigate }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => navigate(`/trainer/live/recorded/edit/${video.id}`)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="dfade"
      style={{
        animationDelay: `${index * 50}ms`, background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px rgba(244,63,94,0.08)` : t.shadow,
        borderRadius: 20, overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 160, background: video.thumbnail ? undefined : t.thumbBg, overflow: "hidden" }}>
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? "linear-gradient(135deg,rgba(244,63,94,0.08),rgba(167,139,250,0.08))" : "linear-gradient(135deg,rgba(244,63,94,0.05),rgba(167,139,250,0.05))" }}>
            <Video size={32} color={t.emptyIcon} />
          </div>
        )}
        {/* Overlay play button on hover */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hov ? 1 : 0, transition: "opacity 0.25s" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={18} color="#0f172a" style={{ marginLeft: 2 }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: t.text, margin: "0 0 5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.title}</h3>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: t.textMuted, margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{video.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#f43f5e", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", padding: "3px 8px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>
            {video.batchName}
          </span>
        </div>
      </div>
    </div>
  );
}

function UploadBtn({ navigate, t }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={() => navigate("/trainer/upload-recorded")} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 10, border: "1px solid rgba(45,212,191,0.3)", background: hov ? "rgba(45,212,191,0.15)" : "rgba(45,212,191,0.08)", color: "#2dd4bf", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s", letterSpacing: "0.03em" }}>
      <Upload size={13} /> Upload Video
    </button>
  );
}

export default RecordedClassList;