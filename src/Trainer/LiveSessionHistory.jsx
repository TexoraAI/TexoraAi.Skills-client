// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Search,
//   Video,
//   Clock,
//   Users,
//   Play,
//   FileText,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const LiveSessionHistory = () => {
//   const navigate = useNavigate();
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   /* ================= FETCH FROM BACKEND ================= */
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch("/api/trainer/live-sessions/history");
//         const data = await res.json();
//         setSessions(data || []);
//       } catch (error) {
//         console.error("Failed to fetch session history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   const filtered = sessions.filter((s) => {
//     const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
//     const matchStatus = statusFilter === "all" || s.status === statusFilter;
//     return matchSearch && matchStatus;
//   });

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">

//       {/* HEADER */}
//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/trainer/live")}
//             className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
//           >
//             <ArrowLeft size={18} />
//           </button>
//           <div>
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Video size={22} />
//               Session History
//             </h2>
//             <p className="text-sm opacity-90 mt-1">
//               All your past live sessions in one place
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* FILTERS */}
//       <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 mb-6">
//         <CardContent className="p-4 flex gap-3 flex-wrap items-center">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search
//               size={14}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <Input
//               placeholder="Search sessions..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-8 bg-white text-black dark:bg-[#1F2937] dark:text-white dark:border-white/10"
//             />
//           </div>

//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-44 bg-white text-black dark:bg-[#1F2937] dark:text-white dark:border-white/10">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent
//               position="popper"
//               className="z-50 bg-white text-black border border-gray-200 dark:bg-[#111827] dark:text-white dark:border-white/10"
//             >
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="completed">Completed</SelectItem>
//               <SelectItem value="cancelled">Cancelled</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       {/* TABLE */}
//       <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
//         <CardContent className="p-0">
//           {loading ? (
//             <div className="p-8 text-center text-sm text-gray-500 dark:text-slate-400">
//               Loading history...
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="text-center py-16 text-gray-400 dark:text-slate-500">
//               <Video size={40} className="mx-auto mb-4 opacity-30" />
//               <p className="font-medium">No sessions found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#1F2937]">
//                     {["Session", "Date & Time", "Duration", "Viewers", "Status", "Actions"].map((h) => (
//                       <th
//                         key={h}
//                         className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filtered.map((s) => (
//                     <tr
//                       key={s.id}
//                       className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1F2937] transition cursor-pointer"
//                       onClick={() => navigate(`/trainer/live/attendance/${s.id}`)}
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
//                             <Video size={14} className="text-blue-500" />
//                           </div>
//                           <div>
//                             <p className="font-medium">{s.title}</p>
//                             <p className="text-xs text-gray-500 dark:text-slate-400">{s.category}</p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <p className="font-medium">{s.date}</p>
//                         <p className="text-xs text-gray-500 dark:text-slate-400">{s.time}</p>
//                       </td>

//                       <td className="px-6 py-4">
//                         <span className="flex items-center gap-1 text-gray-600 dark:text-slate-300">
//                           <Clock size={14} /> {s.duration ?? "—"}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4">
//                         <span className="flex items-center gap-1 text-gray-600 dark:text-slate-300">
//                           <Users size={14} />
//                           <strong>{s.viewers ?? 0}</strong>
//                         </span>
//                       </td>

//                       <td className="px-6 py-4">
//                         <Badge
//                           className={
//                             s.status === "completed"
//                               ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                               : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
//                           }
//                         >
//                           {s.status}
//                         </Badge>
//                       </td>

//                       <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
//                         {s.status === "completed" && (
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               className="text-xs dark:border-white/10"
//                               onClick={() => navigate(`/trainer/live/attendance/${s.id}`)}
//                             >
//                               <FileText size={12} className="mr-1" /> Report
//                             </Button>

//                             {s.recordingUrl && (
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="text-xs dark:border-white/10"
//                                 onClick={() => window.open(s.recordingUrl, "_blank")}
//                               >
//                                 <Play size={12} className="mr-1" /> Replay
//                               </Button>
//                             )}
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default LiveSessionHistory;
























import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Video, Clock, Users, Play, FileText, Sparkles, Activity } from "lucide-react";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)", pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)", actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
    actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)", liveColor: "#34d399", liveText: "#34d399",
    recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)", recentItemBgHov: "rgba(255,255,255,0.06)",
    inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
    tableBorderColor: "rgba(255,255,255,0.05)", tableHov: "rgba(255,255,255,0.03)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    theadBg: "rgba(255,255,255,0.03)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", heroBg: "#ffffff",
    border: "#e2e8f0", borderHov: "#cbd5e1", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    textLabel: "#94a3b8", pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
    actBg: "#f8fafc", actBorder: "#e2e8f0", actBar: "#94a3b8", actIcon: "#94a3b8",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9", liveColor: "#16a34a", liveText: "#16a34a",
    recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0", recentItemBgHov: "#f1f5f9",
    inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
    tableBorderColor: "#e2e8f0", tableHov: "#f8fafc",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    theadBg: "#f8fafc",
  },
};

const LiveSessionHistory = () => {
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

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/trainer/live-sessions/history");
        const data = await res.json();
        setSessions(data || []);
      } catch (error) {
        console.error("Failed to fetch session history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = sessions.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => navigate("/trainer/live")} style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, flexShrink: 0, transition: "all 0.2s" }}>
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <Sparkles size={11} color={t.textSub} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>History</span>
                  </div>
                  <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
                    <Video size={22} color="#22d3ee" /> Session History
                  </h1>
                  <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>All your past live sessions in one place</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub }}>
                  <span>{sessions.length} session{sessions.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ FILTERS ═══ */}
          <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "16px 20px", boxShadow: t.shadow, marginBottom: 14, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
              <input
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "9px 14px 9px 34px", borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none" }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 600, outline: "none", cursor: "pointer", minWidth: 160 }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* ═══ TABLE ═══ */}
          <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ height: 52, borderRadius: 10, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
                  <Video size={22} color={t.emptyIcon} />
                </div>
                <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No sessions found</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.tableBorderColor}` }}>
                      {["Session", "Date & Time", "Duration", "Viewers", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <HistoryRow key={s.id} session={s} t={t} navigate={navigate} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

function HistoryRow({ session: s, t, navigate }) {
  const [hov, setHov] = useState(false);
  const isCompleted = s.status === "completed";
  const statusColor = isCompleted ? "#34d399" : "#f87171";
  return (
    <tr
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/trainer/live/attendance/${s.id}`)}
      style={{ borderBottom: `1px solid ${t.tableBorderColor}`, background: hov ? t.tableHov : "transparent", cursor: "pointer", transition: "background 0.15s" }}
    >
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", flexShrink: 0 }}>
            <Video size={14} color="#22d3ee" />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{s.title}</p>
            <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{s.category}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{s.date}</p>
        <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{s.time}</p>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <span style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={12} /> {s.duration ?? "—"}
        </span>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <span style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
          <Users size={12} /> <strong>{s.viewers ?? 0}</strong>
        </span>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30`, padding: "3px 10px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>
          {s.status}
        </span>
      </td>
      <td style={{ padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
        {isCompleted && (
          <div style={{ display: "flex", gap: 6 }}>
            <TableActionBtn label="Report" icon={FileText} color="#22d3ee" onClick={() => navigate(`/trainer/live/attendance/${s.id}`)} />
            {s.recordingUrl && <TableActionBtn label="Replay" icon={Play} color="#a78bfa" onClick={() => window.open(s.recordingUrl, "_blank")} />}
          </div>
        )}
      </td>
    </tr>
  );
}

function TableActionBtn({ label, icon: Icon, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: `1px solid ${hov ? color + "55" : color + "30"}`, background: hov ? `${color}18` : `${color}0a`, color, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.15s" }}>
      <Icon size={11} /> {label}
    </button>
  );
}

export default LiveSessionHistory;