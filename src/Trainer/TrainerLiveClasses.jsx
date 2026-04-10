
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   getBatchSessions,
//   endLiveSession,
//   deleteLiveSession,
// } from "@/services/liveSessionService";

// import { getTrainerBatches } from "@/services/batchService";

// import {
//   Video,
//   History,
//   Upload,
//   List,
//   BarChart3,
//   Circle,
//   Calendar,
//   Clock,
//   Users,
//   Radio,
//   ChevronDown,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// const TrainerLiveClasses = () => {
//   const navigate = useNavigate();

//   const [sessions, setSessions] = useState([]);
//   const [batchId, setBatchId] = useState(null);
//   const [stats, setStats] = useState({
//     live: 0,
//     viewers: 0,
//     scheduled: 0,
//     completed: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("all");
//   const [isSessionsOpen, setIsSessionsOpen] = useState(true); // ✅ UI only

//   // ✅ STEP 1: Load trainer batches to get batchId dynamically
//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const data = await getTrainerBatches();
//         console.log("BATCHES:", data);

//         if (Array.isArray(data) && data.length > 0) {
//           const firstBatch = data[0];
//           const id = firstBatch.id ?? firstBatch.batchId ?? firstBatch.batch_id;
//           console.log("BATCH ID:", id);
//           setBatchId(id);
//         }
//       } catch (err) {
//         console.error("Failed to load batches:", err);
//       }
//     };

//     loadBatches();
//   }, []);

//   // ✅ STEP 2: Load sessions once batchId is available
//   useEffect(() => {
//     if (!batchId) return;

//     const loadSessions = async () => {
//       try {
//         const res = await getBatchSessions(batchId);
//         const data = res.data || [];

//         console.log("Sessions:", data);

//         setSessions(data);

//         setStats({
//           live: data.filter((s) => s.status === "LIVE").length,
//           viewers: data.reduce((acc, s) => acc + (s.viewers ?? 0), 0),
//           scheduled: data.filter((s) => s.status === "SCHEDULED").length,
//           completed: data.filter((s) => s.status === "ENDED").length,
//         });
//       } catch (err) {
//         console.error("Failed to load sessions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSessions();
//   }, [batchId]);

//   const tabs = ["all", "LIVE", "SCHEDULED", "ENDED"];

//   const filtered =
//     activeTab === "all"
//       ? sessions
//       : sessions.filter((s) => s.status === activeTab);

//   // ✅ End a live session
//   const handleEnd = async (id) => {
//     try {
//       await endLiveSession(id);
//       setSessions((prev) =>
//         prev.map((s) => (s.id === id ? { ...s, status: "ENDED" } : s)),
//       );
//       // Update stats
//       setStats((prev) => ({
//         ...prev,
//         live: prev.live - 1,
//         completed: prev.completed + 1,
//       }));
//     } catch (err) {
//       console.error("End failed", err);
//     }
//   };

//   // ✅ Delete an ended session
//   const handleDelete = async (id) => {
//     try {
//       await deleteLiveSession(id);
//       setSessions((prev) => prev.filter((s) => s.id !== id));
//       setStats((prev) => ({
//         ...prev,
//         completed: prev.completed - 1,
//       }));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   const quickLinks = [
//     {
//       icon: <Radio size={18} />,
//       label: "Start Live Session",
//       desc: "Launch a new live class",
//       path: "/trainer/start-live",
//       color: "text-red-500",
//       bg: "bg-red-50 dark:bg-red-900/20",
//     },
//     {
//       icon: <History size={18} />,
//       label: "Session History",
//       desc: "View past live sessions",
//       path: "/trainer/live-history",
//       color: "text-blue-500",
//       bg: "bg-blue-50 dark:bg-blue-900/20",
//     },
//     {
//       icon: <Upload size={18} />,
//       label: "Upload Video",
//       desc: "Upload a recorded class",
//       path: "/trainer/upload-recorded",
//       color: "text-green-500",
//       bg: "bg-green-50 dark:bg-green-900/20",
//     },
//     {
//       icon: <List size={18} />,
//       label: "Recorded Classes",
//       desc: "Manage your video library",
//       path: "/trainer/recorded-list",
//       color: "text-purple-500",
//       bg: "bg-purple-50 dark:bg-purple-900/20",
//     },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">
//       {/* ================= HEADER ================= */}
//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Radio size={22} />
//               Live Studio
//             </h2>
//             <p className="text-sm opacity-90 mt-1">
//               Manage your live sessions & recorded content
//             </p>
//           </div>

//           <Button
//             onClick={() => navigate("/trainer/start-live")}
//             className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
//           >
//             + Go Live
//           </Button>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {[
//           {
//             label: "Live Now",
//             value: stats.live,
//             icon: <Circle className="text-red-500 animate-pulse" size={16} />,
//             color: "text-red-500",
//           },
//           {
//             label: "Live Viewers",
//             value: stats.viewers,
//             icon: <Users className="text-yellow-500" size={18} />,
//             color: "text-yellow-500",
//           },
//           {
//             label: "Scheduled",
//             value: stats.scheduled,
//             icon: <Calendar className="text-blue-500" size={18} />,
//             color: "text-blue-500",
//           },
//           {
//             label: "Completed",
//             value: stats.completed,
//             icon: <BarChart3 className="text-green-500" size={18} />,
//             color: "text-green-500",
//           },
//         ].map((s) => (
//           <Card key={s.label}>
//             <CardContent className="p-5 flex items-center gap-4">
//               {s.icon}
//               <div>
//                 <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
//                 <p className="text-xs text-gray-500">{s.label}</p>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* ================= QUICK LINKS ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {quickLinks.map((q) => (
//           <button
//             key={q.path}
//             onClick={() => navigate(q.path)}
//             className="flex items-center gap-3 p-4 rounded-2xl border bg-white dark:bg-[#111827] hover:shadow-md transition text-left"
//           >
//             <div className={`p-3 rounded-xl ${q.bg} ${q.color}`}>{q.icon}</div>
//             <div>
//               <p className="font-semibold text-sm">{q.label}</p>
//               <p className="text-xs text-gray-500">{q.desc}</p>
//             </div>
//           </button>
//         ))}
//       </div>

//       {/* ================= SESSIONS ================= */}
//       <Card>
//         <CardContent className="p-6">
//           {/* Header row with tabs + collapse arrow */}
//           <div className="flex justify-between mb-5 flex-wrap gap-3">
//             <h3 className="font-semibold text-lg">Sessions</h3>

//             <div className="flex gap-2 flex-wrap items-center">
//               {tabs.map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setActiveTab(t)}
//                   className={`px-4 py-1.5 rounded-full text-sm capitalize ${
//                     activeTab === t
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 dark:bg-[#1F2937]"
//                   }`}
//                 >
//                   {t}
//                 </button>
//               ))}

//               {/* ✅ Collapse / Expand arrow — UI only */}
//               <button
//                 onClick={() => setIsSessionsOpen((prev) => !prev)}
//                 title={isSessionsOpen ? "Collapse sessions" : "Expand sessions"}
//                 className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] hover:bg-gray-100 dark:hover:bg-gray-600 transition"
//               >
//                 <ChevronDown
//                   size={14}
//                   className={`text-gray-500 transition-transform duration-300 ${
//                     isSessionsOpen ? "rotate-0" : "-rotate-90"
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           {/* ✅ Sessions body — collapses/expands */}
//           {isSessionsOpen && (
//             <>
//               {loading ? (
//                 <p className="text-gray-500 dark:text-slate-400">
//                   Loading sessions...
//                 </p>
//               ) : filtered.length === 0 ? (
//                 <div className="text-center py-16">
//                   <Video size={40} className="mx-auto mb-4 opacity-30" />
//                   <p className="text-gray-400 dark:text-slate-500">
//                     No sessions found
//                   </p>
//                   <Button
//                     onClick={() => navigate("/trainer/start-live")}
//                     className="mt-4 bg-blue-600 text-white"
//                   >
//                     Start Now
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {filtered.map((session) => (
//                     <div
//                       key={session.id}
//                       className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-[#1F2937] transition"
//                     >
//                       {/* Clickable info area */}
//                       <div
//                         className="flex-1 cursor-pointer"
//                         onClick={() => {
//                           if (session.status === "LIVE") {
//                             navigate(`/trainer/live-controls/${session.id}`);
//                           }
//                         }}
//                       >
//                         <p className="font-medium">{session.title}</p>
//                         <div className="flex gap-4 mt-1 text-xs text-gray-500 flex-wrap">
//                           <span className="flex items-center gap-1">
//                             <Calendar size={12} /> {session.date}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Clock size={12} /> {session.time}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Users size={12} /> {session.viewers ?? 0}
//                           </span>
//                         </div>
//                       </div>

//                       <Badge>
//                         {session.status === "LIVE" && (
//                           <Circle
//                             size={8}
//                             className="inline mr-1 text-red-500 animate-pulse"
//                           />
//                         )}
//                         {session.status}
//                       </Badge>

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         {session.status === "LIVE" && (
//                           <>
//                             <Button
//                               onClick={() =>
//                                 navigate(
//                                   `/trainer/live-controls/${session.id}`,
//                                 )
//                               }
//                               className="bg-green-500 hover:bg-green-600"
//                             >
//                               Join
//                             </Button>

//                             <Button
//                               onClick={() => handleEnd(session.id)}
//                               className="bg-yellow-500 hover:bg-yellow-600"
//                             >
//                               End
//                             </Button>
//                           </>
//                         )}

//                         {session.status === "ENDED" && (
//                           <Button
//                             onClick={() => handleDelete(session.id)}
//                             className="bg-red-500 hover:bg-red-600"
//                           >
//                             Delete
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TrainerLiveClasses;

























import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getBatchSessions,
  endLiveSession,
  deleteLiveSession,
} from "@/services/liveSessionService";

import { getTrainerBatches } from "@/services/batchService";

import {
  Video,
  History,
  Upload,
  List,
  BarChart3,
  Circle,
  Calendar,
  Clock,
  Users,
  Radio,
  ChevronDown,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react";

/* ─── theme token map (mirrors Dashboard) ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    barBg: "rgba(255,255,255,0.05)",
    actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    gridLine: "rgba(255,255,255,0.5)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    liveColor: "#34d399",
    liveText: "#34d399",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    overdueBg: "rgba(239,68,68,0.12)",
    overdueText: "#f87171",
    overdueBorder: "rgba(239,68,68,0.2)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    barBg: "#f1f5f9",
    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    gridLine: "rgba(0,0,0,0.12)",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    overdueBg: "#fef2f2",
    overdueText: "#ef4444",
    overdueBorder: "#fecaca",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
  },
};

const TrainerLiveClasses = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  const [sessions, setSessions] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [stats, setStats] = useState({ live: 0, viewers: 0, scheduled: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isSessionsOpen, setIsSessionsOpen] = useState(true);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await getTrainerBatches();
        if (Array.isArray(data) && data.length > 0) {
          const firstBatch = data[0];
          const id = firstBatch.id ?? firstBatch.batchId ?? firstBatch.batch_id;
          setBatchId(id);
        }
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    };
    loadBatches();
  }, []);

  useEffect(() => {
    if (!batchId) return;
    const loadSessions = async () => {
      try {
        const res = await getBatchSessions(batchId);
        const data = res.data || [];
        setSessions(data);
        setStats({
          live: data.filter((s) => s.status === "LIVE").length,
          viewers: data.reduce((acc, s) => acc + (s.viewers ?? 0), 0),
          scheduled: data.filter((s) => s.status === "SCHEDULED").length,
          completed: data.filter((s) => s.status === "ENDED").length,
        });
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, [batchId]);

  const tabs = ["all", "LIVE", "SCHEDULED", "ENDED"];
  const filtered = activeTab === "all" ? sessions : sessions.filter((s) => s.status === activeTab);

  const handleEnd = async (id) => {
    try {
      await endLiveSession(id);
      setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "ENDED" } : s)));
      setStats((prev) => ({ ...prev, live: prev.live - 1, completed: prev.completed + 1 }));
    } catch (err) {
      console.error("End failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLiveSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({ ...prev, completed: prev.completed - 1 }));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const statCards = [
    { label: "Live Now", value: stats.live, color: "#f43f5e", icon: Circle },
    { label: "Live Viewers", value: stats.viewers, color: "#f59e0b", icon: Users },
    { label: "Scheduled", value: stats.scheduled, color: "#22d3ee", icon: Calendar },
    { label: "Completed", value: stats.completed, color: "#34d399", icon: BarChart3 },
  ];

  const quickLinks = [
    { icon: Radio, label: "Start Live Session", desc: "Launch a new live class", path: "/trainer/start-live", color: "#f43f5e" },
    { icon: History, label: "Session History", desc: "View past live sessions", path: "/trainer/live-history", color: "#22d3ee" },
    { icon: Upload, label: "Upload Video", desc: "Upload a recorded class", path: "/trainer/upload-recorded", color: "#34d399" },
    { icon: List, label: "Recorded Classes", desc: "Manage your video library", path: "/trainer/recorded-list", color: "#a78bfa" },
  ];

  const pill = {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "4px 10px", borderRadius: 999, background: t.pillBg,
    border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif",
  };

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
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes liveDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.5)}}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{
            borderRadius: 24, padding: "30px 36px", background: t.heroBg,
            border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden",
            marginBottom: 20, boxShadow: t.shadow,
          }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(244,63,94,0.06),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40%", right: "10%", width: 250, height: 200, background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Live Studio</span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  Live Classes
                </h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
                  Manage your live sessions &amp; recorded content
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub }}>
                  <span>{stats.live} live</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span>{stats.scheduled} scheduled</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span>{stats.completed} completed</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>
                <button onClick={() => navigate("/trainer/start-live")} style={{ display: "flex", alignItems: "center", gap: 7, background: isDark ? "rgba(244,63,94,0.12)" : "rgba(244,63,94,0.08)", border: isDark ? "1px solid rgba(244,63,94,0.3)" : "1px solid rgba(244,63,94,0.3)", borderRadius: 999, padding: "8px 18px", color: "#f43f5e", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif", cursor: "pointer" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f43f5e", display: "inline-block", animation: "liveDot 1.2s ease-in-out infinite" }} />
                  GO LIVE
                </button>
              </div>
            </div>
          </div>

          {/* ═══ STAT CARDS ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 14, marginBottom: 20 }}>
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <StatCard key={i} stat={s} index={i} t={t} isDark={isDark} />
              );
            })}
          </div>

          {/* ═══ QUICK LINKS ═══ */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow, marginBottom: 20, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }} className="dfade">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 10 }}>
              <Zap size={14} color={t.textLabel} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, fontFamily: "'Poppins',sans-serif" }}>Quick Actions</span>
            </div>
            {quickLinks.map((q, i) => (
              <QuickActionPill key={i} item={q} navigate={navigate} t={t} />
            ))}
          </div>

          {/* ═══ SESSIONS TABLE ═══ */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }} className="dfade">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
                  <Radio size={15} color="#f43f5e" />
                </div>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Sessions</span>
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: "5px 14px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif",
                    cursor: "pointer", border: "none", transition: "all 0.2s",
                    background: activeTab === tab ? "#f43f5e" : t.pillBg,
                    color: activeTab === tab ? "#fff" : t.pillText,
                  }}>
                    {tab}
                  </button>
                ))}
                <button onClick={() => setIsSessionsOpen((p) => !p)} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t.border}`, background: t.pillBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, transition: "all 0.2s" }}>
                  <ChevronDown size={13} style={{ transition: "transform 0.3s", transform: isSessionsOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
                </button>
              </div>
            </div>

            {isSessionsOpen && (
              <>
                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ height: 56, borderRadius: 12, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 12 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
                      <Video size={22} color={t.emptyIcon} />
                    </div>
                    <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No sessions found</p>
                    <button onClick={() => navigate("/trainer/start-live")} style={{ padding: "6px 18px", borderRadius: 8, border: "1px solid rgba(244,63,94,0.25)", background: "rgba(244,63,94,0.08)", color: "#f43f5e", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                      Start Now →
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filtered.map((session) => (
                      <SessionRow key={session.id} session={session} t={t} isDark={isDark} navigate={navigate} handleEnd={handleEnd} handleDelete={handleDelete} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Stat Card ─── */
function StatCard({ stat, index, t, isDark }) {
  const [hov, setHov] = useState(false);
  const Icon = stat.icon;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      animationDelay: `${index * 80}ms`, background: hov ? t.cardBgHov : t.cardBg,
      border: `1px solid ${hov ? t.borderHov : t.border}`,
      boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
      borderRadius: 20, padding: "22px 22px 20px", display: "flex", flexDirection: "column", gap: 14,
      position: "relative", overflow: "hidden", transition: "all 0.25s ease",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: stat.color, filter: "blur(40px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
      <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
        <Icon size={19} color={stat.color} strokeWidth={2} />
      </div>
      <div>
        <p style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{stat.value}</p>
        <p style={{ fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0" }}>{stat.label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: stat.color, width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
      </div>
    </div>
  );
}

/* ─── Quick Action Pill ─── */
function QuickActionPill({ item, navigate, t }) {
  const [hov, setHov] = useState(false);
  const Icon = item.icon;
  return (
    <button onClick={() => navigate(item.path)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 10,
      border: `1px solid ${hov ? item.color + "55" : t.border}`, background: hov ? `${item.color}12` : "transparent",
      color: hov ? item.color : t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer",
      transition: "all 0.2s", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.03em",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: hov ? item.color : t.textMuted, transition: "background 0.2s", flexShrink: 0 }} />
      {item.label}
    </button>
  );
}

/* ─── Session Row ─── */
function SessionRow({ session, t, navigate, handleEnd, handleDelete }) {
  const [hov, setHov] = useState(false);
  const statusColors = { LIVE: "#f43f5e", SCHEDULED: "#22d3ee", ENDED: "#34d399" };
  const color = statusColors[session.status] || t.textMuted;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
      background: hov ? t.recentItemBgHov : t.recentItemBg,
      border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`, transition: "all 0.15s",
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0 }}>
        <Video size={15} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0, cursor: session.status === "LIVE" ? "pointer" : "default" }} onClick={() => { if (session.status === "LIVE") navigate(`/trainer/live-controls/${session.id}`); }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.title}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 3 }}>
          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 3 }}><Calendar size={10} /> {session.date}</span>
          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} /> {session.time}</span>
          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 3 }}><Users size={10} /> {session.viewers ?? 0}</span>
        </div>
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color, background: `${color}18`, border: `1px solid ${color}30`, padding: "3px 10px", borderRadius: 999, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
        {session.status === "LIVE" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block", animation: "liveDot 1.2s ease-in-out infinite" }} />}
        {session.status}
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {session.status === "LIVE" && (
          <>
            <ActionBtn label="Join" color="#34d399" onClick={() => navigate(`/trainer/live-controls/${session.id}`)} />
            <ActionBtn label="End" color="#f59e0b" onClick={() => handleEnd(session.id)} />
          </>
        )}
        {session.status === "ENDED" && (
          <ActionBtn label="Delete" color="#f43f5e" onClick={() => handleDelete(session.id)} />
        )}
      </div>
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${color}40`, background: hov ? `${color}25` : `${color}12`, color, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.15s" }}>
      {label}
    </button>
  );
}

export default TrainerLiveClasses;