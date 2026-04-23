// // src/trainer/TrainerLiveClasses.jsx
// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   getBatchSessions, endLiveSession, deleteLiveSession,
//   uploadRecording, joinCall, createLiveSession,
// } from "@/services/liveSessionService";
// import { getTrainerBatches } from "@/services/batchService";

// import {
//   Video, History, Upload, List, BarChart3, Circle, Calendar, Clock,
//   Users, Radio, ChevronDown, Sparkles, Phone, LayoutDashboard,
//   ArrowLeft, UploadCloud, X, Search, Play, FileText, Activity,
//   CheckCircle2, AlertCircle, XCircle, Download, MessageCircle,
//   Bell, MessageSquare,
// } from "lucide-react";
// import { Client } from "@stomp/stompjs";

// /* ─── theme tokens ─── */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
//     heroBg: "#141414", border: "rgba(255,255,255,0.06)",
//     borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
//     text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
//     pillBg: "rgba(255,255,255,0.04)", pillText: "rgba(255,255,255,0.25)",
//     barBg: "rgba(255,255,255,0.05)", actBg: "rgba(255,255,255,0.04)",
//     actBorder: "rgba(255,255,255,0.07)", gridLine: "rgba(255,255,255,0.5)",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)",
//     recentItemBgHov: "rgba(255,255,255,0.06)", emptyBorder: "rgba(255,255,255,0.07)",
//     emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
//     navStripBg: "#111111", navStripBorder: "rgba(255,255,255,0.06)",
//     tabInactiveBg: "rgba(255,255,255,0.04)", tabInactiveBorder: "rgba(255,255,255,0.10)",
//     tabInactiveText: "rgba(255,255,255,0.45)",
//     inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
//     labelColor: "rgba(255,255,255,0.4)", selectBg: "#1a1a1a",
//     dropBg: "rgba(255,255,255,0.02)", dropBorder: "rgba(255,255,255,0.07)",
//     thumbBg: "rgba(255,255,255,0.04)", videoBg: "rgba(255,255,255,0.03)",
//     videoBorder: "rgba(255,255,255,0.05)", tableBorderColor: "rgba(255,255,255,0.05)",
//     tableHov: "rgba(255,255,255,0.03)", theadBg: "rgba(255,255,255,0.03)",
//     toggleBg: "rgba(255,255,255,0.03)", toggleBorder: "rgba(255,255,255,0.06)",
//     liveColor: "#34d399", liveText: "#34d399",
//     actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
//     panelActiveBg: "#141414", panelInactiveBg: "#0f0f0f",
//     headHov: "rgba(255,255,255,0.02)",
//     reviewBg: "rgba(255,255,255,0.03)", reviewBorder: "rgba(255,255,255,0.06)",
//     numInactiveBg: "rgba(255,255,255,0.04)", numInactiveBorder: "rgba(255,255,255,0.10)", numInactiveText: "rgba(255,255,255,0.25)",
//   },
//   light: {
//     pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc",
//     heroBg: "#ffffff", border: "#e2e8f0",
//     borderHov: "#cbd5e1", borderHero: "#e2e8f0",
//     text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
//     pillBg: "#f1f5f9", pillText: "#94a3b8",
//     barBg: "#f1f5f9", actBg: "#f8fafc", actBorder: "#e2e8f0",
//     gridLine: "rgba(0,0,0,0.12)", shadow: "0 1px 8px rgba(0,0,0,0.07)",
//     shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0", recentItemBgHov: "#f1f5f9",
//     emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
//     navStripBg: "#ffffff", navStripBorder: "#e2e8f0",
//     tabInactiveBg: "#f8fafc", tabInactiveBorder: "#e2e8f0", tabInactiveText: "#64748b",
//     inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
//     labelColor: "#64748b", selectBg: "#f8fafc",
//     dropBg: "#f8fafc", dropBorder: "#e2e8f0",
//     thumbBg: "#f1f5f9", videoBg: "#f8fafc", videoBorder: "#e2e8f0",
//     tableBorderColor: "#e2e8f0", tableHov: "#f8fafc", theadBg: "#f8fafc",
//     toggleBg: "#f8fafc", toggleBorder: "#e2e8f0",
//     liveColor: "#16a34a", liveText: "#16a34a",
//     actBar: "#94a3b8", actIcon: "#94a3b8",
//     panelActiveBg: "#ffffff", panelInactiveBg: "#fafafa",
//     headHov: "rgba(0,0,0,0.015)",
//     reviewBg: "#f8fafc", reviewBorder: "#e2e8f0",
//     numInactiveBg: "#f1f5f9", numInactiveBorder: "#e2e8f0", numInactiveText: "#94a3b8",
//   },
// };

// /* ─── CRM Panel Accents ─── */
// const PANEL_ACCENTS = {
//   1: { color: "#f43f5e", dim: "rgba(244,63,94,0.10)",  border: "rgba(244,63,94,0.25)",  label: "Session Details",  sub: "Title, batch & schedule"    },
//   2: { color: "#22d3ee", dim: "rgba(34,211,238,0.10)", border: "rgba(34,211,238,0.25)", label: "Session Settings", sub: "Chat, recording & alerts"    },
//   3: { color: "#34d399", dim: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.25)", label: "Review & Launch",  sub: "Confirm and go live"         },
// };

// /* ─── Tab config ─── */
// const NAV_TABS = [
//   { key: "live-dashboard",  label: "Live Dashboard",         icon: LayoutDashboard, primary: true  },
//   { key: "start-live",      label: "Start Live Session",     icon: Video,           primary: false },
//   { key: "join-call",       label: "Join Call",              icon: Phone,           primary: false },
//   { key: "live-history",    label: "Live Session History",   icon: History,         primary: false },
//   { key: "live-attendance", label: "Live Attendance Report", icon: Users,           primary: false },
//   { key: "upload-recorded", label: "Upload Recorded Video",  icon: Upload,          primary: false },
//   { key: "recorded-list",   label: "Recorded Classes List",  icon: List,            primary: false },
// ];

// const wsUrl = (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:9000") + "/live-chat";
// const getTrainerEmail = () => {
//   try { const u = JSON.parse(localStorage.getItem("lms_user") || "{}"); return u.email || null; }
//   catch { return null; }
// };

// const statusConfig = {
//   present:      { label: "On Time",    icon: CheckCircle2, color: "#34d399" },
//   late:         { label: "Late",       icon: AlertCircle,  color: "#f59e0b" },
//   "left-early": { label: "Left Early", icon: XCircle,      color: "#f87171" },
// };

// /* ══════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════ */
// const TrainerLiveClasses = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("live-dashboard");

//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//        document.documentElement.getAttribute("data-theme") === "dark")
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
//   const switchTab = (tab) => setActiveTab(tab.key);

//   const heroMeta = {
//     "live-dashboard":  { title: "Live Dashboard",        subtitle: "Manage your live sessions & recorded content", color: "#f43f5e" },
//     "start-live":      { title: "Start Live Session",     subtitle: "Schedule or go live instantly",               color: "#f43f5e" },
//     "join-call":       { title: "Join Call",              subtitle: "Accept incoming student calls",               color: "#6366f1" },
//     "live-history":    { title: "Session History",        subtitle: "All your past live sessions in one place",    color: "#22d3ee" },
//     "live-attendance": { title: "Attendance Report",      subtitle: "Detailed attendance analytics",               color: "#a78bfa" },
//     "upload-recorded": { title: "Upload Recorded Video",  subtitle: "Publish recorded content for students",       color: "#2dd4bf" },
//     "recorded-list":   { title: "Recorded Classes",       subtitle: "Browse and manage your video library",        color: "#f43f5e" },
//   }[activeTab] || { title: "Live Studio", subtitle: "", color: "#f43f5e" };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
//         @keyframes liveDot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
//         @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.15} }
//         @keyframes uploadFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
//         @keyframes radarPulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
//         @keyframes callPulse   { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 70%{box-shadow:0 0 0 18px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
//         @keyframes callPulse2  { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.3)} 70%{box-shadow:0 0 0 32px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
//         @keyframes pulse-ring  { 0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)} 70%{box-shadow:0 0 0 8px rgba(52,211,153,0)} 100%{box-shadow:0 0 0 0 rgba(52,211,153,0)} }
//         @keyframes slideDown   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
//         .dfade       { animation: fadeUp 0.45s ease both }
//         .livebadge   { animation: pulse-ring 2.2s ease-out infinite }
//         .d1 { animation: blink 1.6s ease infinite }
//         .d2 { animation: blink 1.6s 0.3s ease infinite }
//         .d3 { animation: blink 1.6s 0.6s ease infinite }
//         .panel-body-inner { animation: slideDown 0.3s ease both }
//         .nav-strip-scroll { overflow-x:auto; overflow-y:visible; -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color: ${isDark ? "rgba(255,255,255,0.18) rgba(255,255,255,0.04)" : "rgba(0,0,0,0.18) rgba(0,0,0,0.04)"}; padding-bottom: 6px; }
//         .nav-strip-scroll::-webkit-scrollbar { display:block; height:4px; }
//         .nav-strip-scroll::-webkit-scrollbar-track { background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; border-radius:99px; }
//         .nav-strip-scroll::-webkit-scrollbar-thumb { background: ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}; border-radius:99px; }
//         .nav-strip-scroll::-webkit-scrollbar-thumb:hover { background: ${isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)"}; }
//         .nav-strip-inner { display:inline-flex; flex-wrap:nowrap; align-items:center; gap:6px; min-width:max-content; padding: 2px 2px; }
//         input[type=date]::-webkit-calendar-picker-indicator,
//         input[type=time]::-webkit-calendar-picker-indicator {
//           filter: ${isDark ? "invert(1) opacity(0.3)" : "opacity(0.5)"}; cursor:pointer;
//         }
//       `}</style>

//       <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
//         <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

//           {/* ══ HERO ══ */}
//           <div className="dfade" style={{
//             borderRadius: 24, padding: "28px 32px 24px", background: t.heroBg,
//             border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden",
//             marginBottom: 0, boxShadow: t.shadow,
//             borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: "none",
//           }}>
//             <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
//             <div style={{ position: "absolute", top: "-30%", left: "42%", width: 300, height: 200, background: `radial-gradient(ellipse,${heroMeta.color}10,transparent 70%)`, pointerEvents: "none" }} />
//             <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
//                   <Sparkles size={11} color={t.textSub} />
//                   <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Live Studio</span>
//                 </div>
//                 <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
//                   {heroMeta.title}
//                 </h1>
//                 <p style={{ fontSize: 12, color: t.textSub, marginTop: 6, marginBottom: 0, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
//                   {heroMeta.subtitle}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ══ NAV TAB STRIP ══ */}
//           <div style={{
//             background: t.navStripBg, border: `1px solid ${t.navStripBorder}`,
//             borderTop: "none", borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
//             padding: "12px 32px 10px", marginBottom: 0, boxShadow: t.shadow,
//           }}>
//             <div className="nav-strip-scroll">
//               <div className="nav-strip-inner">
//                 {NAV_TABS.map((tab) => {
//                   const isActive = activeTab === tab.key;
//                   const Icon = tab.icon;
//                   let bg, border, color;
//                   if (isActive) { bg = "#f43f5e"; border = "#f43f5e"; color = "#ffffff"; }
//                   else if (tab.primary) { bg = isDark ? "rgba(244,63,94,0.10)" : "rgba(244,63,94,0.07)"; border = "rgba(244,63,94,0.35)"; color = "#f43f5e"; }
//                   else { bg = t.tabInactiveBg; border = t.tabInactiveBorder; color = t.tabInactiveText; }
//                   return (
//                     <button key={tab.key} onClick={() => switchTab(tab)} style={{
//                       flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
//                       padding: "6px 14px", borderRadius: 8, border: `1px solid ${border}`,
//                       background: bg, color, fontSize: 11, fontWeight: isActive || tab.primary ? 700 : 600,
//                       cursor: "pointer", transition: "all 0.18s", fontFamily: "'Poppins',sans-serif",
//                       letterSpacing: "0.02em", whiteSpace: "nowrap",
//                     }}>
//                       <Icon size={12} strokeWidth={2.2} />{tab.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* ══ PANEL CONTENT ══ */}
//           <div style={{
//             background: t.heroBg, border: `1px solid ${t.borderHero}`,
//             borderTop: "none", borderRadius: 0,
//             padding: "20px 32px 28px", marginBottom: 20, boxShadow: t.shadow,
//             borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
//           }}>
//             {activeTab === "live-dashboard"   && <PanelLiveDashboard    t={t} isDark={isDark} navigate={navigate} />}
//             {activeTab === "start-live"       && <PanelStartLive        t={t} isDark={isDark} navigate={navigate} />}
//             {activeTab === "join-call"        && <PanelJoinCall         t={t} isDark={isDark} navigate={navigate} />}
//             {activeTab === "live-history"     && <PanelLiveHistory      t={t} isDark={isDark} navigate={navigate} />}
//             {activeTab === "live-attendance"  && <PanelAttendanceReport t={t} isDark={isDark} navigate={navigate} />}
//             {activeTab === "upload-recorded"  && <PanelUploadRecorded   t={t} isDark={isDark} navigate={navigate} />}
//             {activeTab === "recorded-list"    && <PanelRecordedList     t={t} isDark={isDark} navigate={navigate} />}
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// /* ══════════════════════════════════════════════════
//    PANEL 0 — LIVE DASHBOARD
// ══════════════════════════════════════════════════ */
// function PanelLiveDashboard({ t, isDark, navigate }) {
//   const [sessions,       setSessions]       = useState([]);
//   const [batchId,        setBatchId]        = useState(null);
//   const [stats,          setStats]          = useState({ live: 0, viewers: 0, scheduled: 0, completed: 0 });
//   const [loading,        setLoading]        = useState(true);
//   const [activeTab,      setActiveTab]      = useState("all");
//   const [isSessionsOpen, setIsSessionsOpen] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getTrainerBatches();
//         if (Array.isArray(data) && data.length > 0) {
//           const fb = data[0];
//           setBatchId(fb.id ?? fb.batchId ?? fb.batch_id);
//         }
//       } catch (err) { console.error(err); }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!batchId) return;
//     (async () => {
//       try {
//         const res  = await getBatchSessions(batchId);
//         const data = res.data || [];
//         setSessions(data);
//         setStats({
//           live:      data.filter((s) => s.status === "LIVE").length,
//           viewers:   data.reduce((acc, s) => acc + (s.viewers ?? 0), 0),
//           scheduled: data.filter((s) => s.status === "SCHEDULED").length,
//           completed: data.filter((s) => s.status === "ENDED").length,
//         });
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     })();
//   }, [batchId]);

//   const sessionTabs = ["all", "LIVE", "SCHEDULED", "ENDED"];
//   const filtered    = activeTab === "all" ? sessions : sessions.filter((s) => s.status === activeTab);

//   const handleEnd = async (id) => {
//     try {
//       await endLiveSession(id);
//       setSessions((prev) => prev.map((s) => s.id === id ? { ...s, status: "ENDED" } : s));
//       setStats((prev) => ({ ...prev, live: prev.live - 1, completed: prev.completed + 1 }));
//     } catch (err) { console.error(err); }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteLiveSession(id);
//       setSessions((prev) => prev.filter((s) => s.id !== id));
//       setStats((prev) => ({ ...prev, completed: prev.completed - 1 }));
//     } catch (err) { console.error(err); }
//   };

//   const statCards = [
//     { label: "Live Now",     value: stats.live,      color: "#f43f5e", icon: Circle    },
//     { label: "Live Viewers", value: stats.viewers,   color: "#f59e0b", icon: Users     },
//     { label: "Scheduled",    value: stats.scheduled, color: "#22d3ee", icon: Calendar  },
//     { label: "Completed",    value: stats.completed, color: "#34d399", icon: BarChart3 },
//   ];

//   return (
//     <>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12, marginBottom: 20 }}>
//         {statCards.map((s, i) => <StatCard key={i} stat={s} index={i} t={t} isDark={isDark} />)}
//       </div>
//       <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
//               <Radio size={15} color="#f43f5e" />
//             </div>
//             <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Sessions</span>
//           </div>
//           <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
//             {sessionTabs.map((tab) => (
//               <button key={tab} onClick={() => setActiveTab(tab)} style={{
//                 padding: "5px 14px", borderRadius: 999, fontSize: 10, fontWeight: 700,
//                 letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif",
//                 cursor: "pointer", border: "none", transition: "all 0.2s",
//                 background: activeTab === tab ? "#f43f5e" : t.pillBg,
//                 color: activeTab === tab ? "#fff" : t.pillText,
//               }}>{tab}</button>
//             ))}
//             <button onClick={() => setIsSessionsOpen((p) => !p)} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t.border}`, background: t.pillBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, transition: "all 0.2s" }}>
//               <ChevronDown size={13} style={{ transition: "transform 0.3s", transform: isSessionsOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
//             </button>
//           </div>
//         </div>
//         {isSessionsOpen && (
//           loading ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               {[1,2,3].map((i) => <div key={i} style={{ height: 56, borderRadius: 12, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />)}
//             </div>
//           ) : filtered.length === 0 ? (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 12 }}>
//               <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
//                 <Video size={22} color={t.emptyIcon} />
//               </div>
//               <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No sessions found</p>
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               {filtered.map((session) => (
//                 <SessionRow key={session.id} session={session} t={t} navigate={navigate} handleEnd={handleEnd} handleDelete={handleDelete} />
//               ))}
//             </div>
//           )
//         )}
//       </div>
//     </>
//   );
// }

// function StatCard({ stat, index, t }) {
//   const [hov, setHov] = useState(false);
//   const Icon = stat.icon;
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//       animationDelay: `${index * 80}ms`, background: hov ? t.cardBgHov : t.cardBg,
//       border: `1px solid ${hov ? t.borderHov : t.border}`,
//       boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
//       borderRadius: 16, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 12,
//       position: "relative", overflow: "hidden", transition: "all 0.25s ease",
//     }}>
//       <div style={{ position: "absolute", top: -16, right: -16, width: 72, height: 72, borderRadius: "50%", background: stat.color, filter: "blur(32px)", opacity: hov ? 0.18 : 0.05, transition: "opacity 0.4s", pointerEvents: "none" }} />
//       <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
//         <Icon size={17} color={stat.color} strokeWidth={2} />
//       </div>
//       <div>
//         <p style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{stat.value}</p>
//         <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "5px 0 0" }}>{stat.label}</p>
//       </div>
//       <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
//         <div style={{ height: "100%", borderRadius: 99, background: stat.color, width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
//       </div>
//     </div>
//   );
// }

// function SessionRow({ session, t, navigate, handleEnd, handleDelete }) {
//   const [hov, setHov] = useState(false);
//   const statusColors  = { LIVE: "#f43f5e", SCHEDULED: "#22d3ee", ENDED: "#34d399" };
//   const color         = statusColors[session.status] || t.textMuted;
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//       display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
//       background: hov ? t.recentItemBgHov : t.recentItemBg,
//       border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`, transition: "all 0.15s",
//     }}>
//       <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0 }}>
//         <Video size={15} color={color} />
//       </div>
//       <div style={{ flex: 1, minWidth: 0, cursor: session.status === "LIVE" ? "pointer" : "default" }} onClick={() => { if (session.status === "LIVE") navigate(`/trainer/live-controls/${session.id}`); }}>
//         <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.title}</p>
//         <div style={{ display: "flex", gap: 12, marginTop: 3 }}>
//           <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 3 }}><Calendar size={10} /> {session.date}</span>
//           <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} /> {session.time}</span>
//           <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 3 }}><Users size={10} /> {session.viewers ?? 0}</span>
//         </div>
//       </div>
//       <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color, background: `${color}18`, border: `1px solid ${color}30`, padding: "3px 10px", borderRadius: 999, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
//         {session.status === "LIVE" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block", animation: "liveDot 1.2s ease-in-out infinite" }} />}
//         {session.status}
//       </span>
//       <div style={{ display: "flex", gap: 6 }}>
//         {session.status === "LIVE"  && <><ActionBtn label="Join" color="#34d399" onClick={() => navigate(`/trainer/live-controls/${session.id}`)} /><ActionBtn label="End" color="#f59e0b" onClick={() => handleEnd(session.id)} /></>}
//         {session.status === "ENDED" && <ActionBtn label="Delete" color="#f43f5e" onClick={() => handleDelete(session.id)} />}
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════
//    SHARED HELPERS
// ══════════════════════════════════════════════════ */
// const inputStyle = (t) => ({
//   width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10,
//   border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText,
//   fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none",
//   transition: "border 0.2s", appearance: "none",
// });
// const labelStyle = (t) => ({
//   fontSize: 10, fontWeight: 600, color: t.labelColor, fontFamily: "'Poppins',sans-serif",
//   letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block",
// });

// function ActionBtn({ label, color, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
//       style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${color}40`, background: hov ? `${color}25` : `${color}12`, color, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.15s" }}>
//       {label}
//     </button>
//   );
// }

// function HeroBtn({ label, icon: Icon, color, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
//       style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: `1px solid ${hov ? color + "55" : color + "30"}`, background: hov ? `${color}22` : `${color}12`, color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}>
//       <Icon size={13} /> {label}
//     </button>
//   );
// }

// /* ══════════════════════════════════════════════════
//    CRM PANEL — reusable folding panel
// ══════════════════════════════════════════════════ */
// function CRMPanel({ num, t, isDark, isOpen, onToggle, summaryChips = [], children }) {
//   const a = PANEL_ACCENTS[num];
//   return (
//     <div style={{
//       background: isOpen ? t.panelActiveBg : t.panelInactiveBg,
//       border: `1px solid ${isOpen ? a.border : t.border}`,
//       borderRadius: 18, overflow: "hidden",
//       boxShadow: isOpen ? `0 4px 28px ${a.color}12` : t.shadow,
//       transition: "all 0.25s ease",
//     }}>
//       <div
//         onClick={onToggle}
//         style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", cursor: "pointer", transition: "background 0.15s" }}
//         onMouseEnter={(e) => e.currentTarget.style.background = t.headHov}
//         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//       >
//         {/* Number */}
//         <div style={{
//           width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
//           flexShrink: 0, transition: "all 0.2s",
//           background: isOpen ? a.dim : t.numInactiveBg,
//           border: `1px solid ${isOpen ? a.border : t.numInactiveBorder}`,
//           fontSize: 12, fontWeight: 800, fontFamily: "'Poppins',sans-serif",
//           color: isOpen ? a.color : t.numInactiveText,
//         }}>{num}</div>

//         {/* Title */}
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif", letterSpacing: "-0.01em" }}>{a.label}</div>
//           {!isOpen && <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginTop: 2 }}>{a.sub}</div>}
//         </div>

//         {/* Summary chips when collapsed */}
//         {!isOpen && summaryChips.length > 0 && (
//           <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
//             {summaryChips.slice(0, 3).map((chip, i) => (
//               <span key={i} style={{ fontSize: 9, fontWeight: 700, color: chip.color, background: `${chip.color}12`, border: `1px solid ${chip.color}25`, padding: "3px 8px", borderRadius: 99, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
//                 {chip.label}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Divider */}
//         <div style={{ width: 1, height: 20, background: t.border, flexShrink: 0 }} />

//         {/* Arrow */}
//         <div style={{
//           width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
//           background: isOpen ? a.dim : "transparent",
//           border: `1px solid ${isOpen ? a.border : t.border}`,
//           transition: "all 0.25s", flexShrink: 0,
//         }}>
//           <ChevronDown size={13} color={isOpen ? a.color : t.textMuted} style={{ transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
//         </div>
//       </div>

//       {/* Accent divider */}
//       {isOpen && <div style={{ height: 1, background: `linear-gradient(90deg, ${a.color}30, transparent)`, marginLeft: 20, marginRight: 20 }} />}

//       {/* Body */}
//       <div style={{ maxHeight: isOpen ? 1000 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
//         <div className="panel-body-inner" style={{ padding: "18px 20px 20px" }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// function PremiumToggleRow({ label, sub, Icon, checked, color, t, onChange }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, transition: "border-color 0.2s" }}>
//       <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: checked ? `${color}12` : t.barBg, border: `1px solid ${checked ? color + "25" : "transparent"}`, transition: "all 0.2s" }}>
//         <Icon size={14} color={checked ? color : t.textMuted} />
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{label}</div>
//         {sub && <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginTop: 1 }}>{sub}</div>}
//       </div>
//       <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", background: checked ? color : t.inputBorder, transition: "background 0.25s", flexShrink: 0 }}>
//         <span style={{ position: "absolute", top: 2, left: checked ? "calc(100% - 22px)" : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
//       </button>
//     </div>
//   );
// }

// function PanelNextBtn({ label, color, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//       display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//       padding: "9px 18px", borderRadius: 10, border: `1px solid ${hov ? color + "45" : color + "25"}`,
//       background: hov ? `${color}15` : `${color}08`, color,
//       fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
//       letterSpacing: "0.03em", transition: "all 0.18s", alignSelf: "flex-end",
//     }}>
//       {label}
//     </button>
//   );
// }

// /* ══════════════════════════════════════════════════
//    PANEL 1 — START LIVE SESSION  (3-panel CRM folding)
// ══════════════════════════════════════════════════ */
// function PanelStartLive({ t, isDark, navigate }) {
//   const [form, setForm]       = useState({ title: "", description: "", batchId: "", date: "", time: "", duration: "", chat: true, recording: true, notifications: true });
//   const [batches, setBatches] = useState([]);
//   const [submitting, setSub]  = useState(false);
//   const [openPanel,  setOpenPanel]  = useState(1);

//   const durations = ["15","30","45","60","75","90"];
//   const upd = (key, val) => setForm((p) => ({ ...p, [key]: val }));

//   useEffect(() => {
//     (async () => {
//       try { const data = await getTrainerBatches(); setBatches(data || []); }
//       catch (err) { console.error(err); }
//     })();
//   }, []);

//   const handleGoLive = async () => {
//     try {
//       setSub(true);
//       const payload = {
//         title: form.title, description: form.description,
//         batchId: Number(form.batchId), scheduledDate: form.date,
//         scheduledTime: form.time, duration: Number(form.duration),
//         chatEnabled: form.chat, autoRecord: form.recording,
//         notifyStudents: form.notifications,
//       };
//       const res = await createLiveSession(payload);
//       navigate(`/trainer/live-controls/${res.data.id}`);
//     } catch (err) { console.error(err); }
//     finally { setSub(false); }
//   };

//   const iStyle = inputStyle(t);
//   const lStyle = labelStyle(t);

//   /* batch label for summary chip */
//   const selectedBatch = batches.find((b) => String(b.id ?? b.batchId) === String(form.batchId));
//   const batchLabel    = selectedBatch ? (selectedBatch.name ?? selectedBatch.batchName ?? `Batch ${form.batchId}`) : null;

//   /* review items */
//   const reviewItems = [
//     { label: "Title",     value: form.title    || "—",                              Icon: Video         },
//     { label: "Batch",     value: batchLabel    || "—",                              Icon: Users         },
//     { label: "Date",      value: form.date     || "—",                              Icon: Calendar      },
//     { label: "Time",      value: form.time     || "—",                              Icon: Clock         },
//     { label: "Duration",  value: form.duration ? `${form.duration} min` : "—",      Icon: Clock         },
//     { label: "Chat",      value: form.chat          ? "Enabled" : "Off",            Icon: MessageSquare, bool: form.chat         },
//     { label: "Recording", value: form.recording     ? "Enabled" : "Off",            Icon: Radio,         bool: form.recording    },
//     { label: "Notify",    value: form.notifications ? "Enabled" : "Off",            Icon: Bell,          bool: form.notifications },
//   ];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

//       {/* Progress pills */}
//       <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
//         {[1, 2, 3].map((n) => {
//           const a = PANEL_ACCENTS[n];
//           const active = openPanel === n;
//           return (
//             <div key={n} onClick={() => setOpenPanel(n)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, border: `1px solid ${active ? a.border : t.border}`, background: active ? a.dim : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
//               <div style={{ width: active ? 16 : 6, height: 6, borderRadius: 99, background: active ? a.color : t.textMuted, transition: "all 0.3s ease" }} />
//               {active && <span style={{ fontSize: 9, fontWeight: 700, color: a.color, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.04em" }}>{n}/3</span>}
//             </div>
//           );
//         })}
//         <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginLeft: 4 }}>
//           {["Session Details", "Settings", "Review & Launch"][openPanel - 1]}
//         </span>
//       </div>

//       {/* ── Panel 1: Session Details ── */}
//       <CRMPanel
//         num={1} t={t} isDark={isDark} isOpen={openPanel === 1}
//         onToggle={() => setOpenPanel(openPanel === 1 ? null : 1)}
//         summaryChips={[
//           form.title  && { label: form.title.slice(0,20) + (form.title.length > 20 ? "…" : ""), color: "#f43f5e" },
//           batchLabel  && { label: batchLabel.split(" ").slice(0,2).join(" "),                    color: "#f43f5e" },
//           form.date   && { label: form.date,                                                      color: "#f43f5e" },
//         ].filter(Boolean)}
//       >
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           <div><label style={lStyle}>Session Title</label>
//             <input style={iStyle} value={form.title} onChange={(e) => upd("title", e.target.value)} placeholder="e.g. React Hooks Deep Dive" />
//           </div>
//           <div><label style={lStyle}>Description</label>
//             <textarea style={{ ...iStyle, resize: "vertical", minHeight: 72 }} value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Brief overview for students..." />
//           </div>
//           <div><label style={lStyle}>Select Batch</label>
//             <div style={{ position: "relative" }}>
//               <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.batchId} onChange={(e) => upd("batchId", e.target.value)}>
//                 <option value="">Choose a batch...</option>
//                 {batches.map((b, i) => {
//                   const id   = b.id ?? b.batchId ?? b.batch_id;
//                   const name = b.name ?? b.batchName ?? `Batch (ID: ${id})`;
//                   return <option key={i} value={String(id)}>{name}</option>;
//                 })}
//               </select>
//               <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
//             </div>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
//             <div><label style={lStyle}>Date</label><input type="date" style={iStyle} value={form.date} onChange={(e) => upd("date", e.target.value)} /></div>
//             <div><label style={lStyle}>Time</label><input type="time" style={iStyle} value={form.time} onChange={(e) => upd("time", e.target.value)} /></div>
//             <div><label style={lStyle}>Duration</label>
//               <div style={{ position: "relative" }}>
//                 <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.duration} onChange={(e) => upd("duration", e.target.value)}>
//                   <option value="">Select...</option>
//                   {durations.map((d) => <option key={d} value={d}>{d} min</option>)}
//                 </select>
//                 <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
//               </div>
//             </div>
//           </div>
//           <PanelNextBtn label="Next: Session Settings →" color="#f43f5e" onClick={() => setOpenPanel(2)} />
//         </div>
//       </CRMPanel>

//       {/* ── Panel 2: Session Settings ── */}
//       <CRMPanel
//         num={2} t={t} isDark={isDark} isOpen={openPanel === 2}
//         onToggle={() => setOpenPanel(openPanel === 2 ? null : 2)}
//         summaryChips={[
//           form.chat          && { label: "Chat On",     color: "#22d3ee" },
//           form.recording     && { label: "Auto Record", color: "#22d3ee" },
//           form.notifications && { label: "Notifying",   color: "#22d3ee" },
//         ].filter(Boolean)}
//       >
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {[
//             { key: "chat",          label: "Enable Chat",     sub: "Students can message during live",  color: "#22d3ee", Icon: MessageSquare },
//             { key: "recording",     label: "Auto Record",     sub: "Save session for replay access",    color: "#f43f5e", Icon: Radio         },
//             { key: "notifications", label: "Notify Students", sub: "Push alert when going live",        color: "#34d399", Icon: Bell          },
//           ].map(({ key, label, sub, color, Icon }) => (
//             <PremiumToggleRow key={key} label={label} sub={sub} Icon={Icon} checked={form[key]} color={color} t={t} onChange={(v) => upd(key, v)} />
//           ))}
//           <PanelNextBtn label="Next: Review & Launch →" color="#22d3ee" onClick={() => setOpenPanel(3)} />
//         </div>
//       </CRMPanel>

//       {/* ── Panel 3: Review & Launch ── */}
//       <CRMPanel
//         num={3} t={t} isDark={isDark} isOpen={openPanel === 3}
//         onToggle={() => setOpenPanel(openPanel === 3 ? null : 3)}
//         summaryChips={[]}
//       >
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
//           {reviewItems.map((item, i) => {
//             const Icon    = item.Icon;
//             const isBool  = item.bool !== undefined;
//             const boolCol = item.bool ? "#34d399" : t.textMuted;
//             return (
//               <div key={i} style={{ background: t.reviewBg, border: `1px solid ${t.reviewBorder}`, borderRadius: 12, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 5 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                   <Icon size={10} color={t.textMuted} />
//                   <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{item.label}</span>
//                 </div>
//                 <span style={{ fontSize: 11, fontWeight: 600, color: isBool ? boolCol : t.text, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                   {isBool && <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: boolCol, marginRight: 5 }} />}
//                   {item.value}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//         <GoLiveButton submitting={submitting} onClick={handleGoLive} />
//       </CRMPanel>

//     </div>
//   );
// }

// function GoLiveButton({ submitting, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button onClick={onClick} disabled={submitting} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//       width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
//       background: submitting ? "rgba(244,63,94,0.5)" : hov ? "#e11d48" : "#f43f5e",
//       color: "#fff", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
//       fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em", display: "flex",
//       alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
//       boxShadow: hov && !submitting ? "0 8px 28px rgba(244,63,94,0.38)" : "none",
//     }}>
//       <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "liveDot 1.2s ease-in-out infinite" }} />
//       {submitting ? "Starting session…" : "Go Live Now"}
//     </button>
//   );
// }

// /* ══════════════════════════════════════════════════
//    PANEL 2 — JOIN CALL
// ══════════════════════════════════════════════════ */
// function PanelJoinCall({ t, isDark, navigate }) {
//   const [room, setRoom]           = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [trainerEmail, setEmail]  = useState(null);
//   const stompRef = useRef(null);

//   useEffect(() => {
//     const email = getTrainerEmail();
//     if (!email) return;
//     setEmail(email);
//     const client = new Client({
//       brokerURL: wsUrl, reconnectDelay: 5000,
//       onConnect:    () => { setConnected(true);  client.subscribe(`/topic/calls/${email}`, (msg) => setRoom(msg.body)); },
//       onDisconnect: () => { setConnected(false); },
//     });
//     client.activate();
//     stompRef.current = client;
//     return () => client.deactivate();
//   }, []);

//   const handleJoin = async () => {
//     try {
//       if (!room) return alert("No incoming call");
//       const res = await joinCall(room);
//       const { token } = res.data;
//       if (!token) return alert("Invalid token");
//       sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
//       navigate("/trainer/call-room", { state: { room, token } });
//     } catch (err) { console.error(err); alert("Failed to join call."); }
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "32px 0" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
//           <span style={{ display: "flex", alignItems: "center", gap: 5, color: connected ? t.liveText : t.textMuted, fontWeight: 700 }}>
//             <span style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? t.liveColor : t.textMuted, display: "inline-block", animation: connected ? "liveDot 1.2s ease-in-out infinite" : "none" }} />
//             {connected ? "Connected" : "Offline"}
//           </span>
//         </div>
//         <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: isDark ? "rgba(52,211,153,0.08)" : "rgba(22,163,74,0.08)", border: isDark ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(22,163,74,0.3)", borderRadius: 999, padding: "8px 18px", color: t.liveText, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>
//           <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.liveColor, display: "inline-block" }} />LIVE
//         </div>
//       </div>

//       {room ? (
//         <>
//           <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.5)", animation: "callPulse 2s ease-out infinite" }} />
//             <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.3)", animation: "callPulse2 2s ease-out infinite 0.4s" }} />
//             <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#4338ca,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
//               <svg width="40" height="40" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="17" r="9" fill="rgba(255,255,255,0.9)" /><ellipse cx="22" cy="38" rx="15" ry="9" fill="rgba(255,255,255,0.9)" /></svg>
//             </div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "0 0 8px" }}>INCOMING CALL</p>
//             <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 900, color: t.text, margin: "0 0 6px", letterSpacing: "-0.04em" }}>Student</h2>
//             <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Room · {room}</p>
//           </div>
//           <div style={{ display: "flex", gap: 24 }}>
//             <CallActionBtn type="decline" onClick={() => setRoom(null)} />
//             <CallActionBtn type="accept"  onClick={handleJoin} />
//           </div>
//         </>
//       ) : (
//         <>
//           <div style={{ width: 120, height: 120, borderRadius: "50%", border: `1.5px solid rgba(99,102,241,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", animation: "radarPulse 3s ease-in-out infinite" }}>
//             <div style={{ width: 88, height: 88, borderRadius: "50%", border: `1.5px solid rgba(99,102,241,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <div style={{ width: 60, height: 60, borderRadius: "50%", background: isDark ? "rgba(99,102,241,0.12)" : "rgba(79,70,229,0.07)", border: `1.5px solid rgba(99,102,241,0.45)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <Phone size={22} color={isDark ? "#a5b4fc" : "#6366f1"} />
//               </div>
//             </div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 900, color: t.text, margin: "0 0 8px" }}>Waiting for calls</h3>
//             <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>
//               {connected ? `Listening as ${trainerEmail ?? "trainer"}` : trainerEmail ? "Connecting…" : "Email not found"}
//             </p>
//           </div>
//           <div style={{ display: "flex", gap: 8 }}>
//             {[0,1,2,3,4].map((i) => (
//               <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: connected ? (isDark ? "#6366f1" : "#4f46e5") : (isDark ? "#374151" : "#d1d5db"), animation: "liveDot 1.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function CallActionBtn({ type, onClick }) {
//   const [hov, setHov] = useState(false);
//   const isDecline = type === "decline";
//   return (
//     <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//       width: 72, height: 72, borderRadius: "50%", border: "none", cursor: "pointer",
//       background: isDecline ? (hov ? "#991b1b" : "linear-gradient(135deg,#7f1d1d,#ef4444)") : (hov ? "#14532d" : "linear-gradient(135deg,#14532d,#22c55e)"),
//       display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
//       boxShadow: isDecline ? "0 8px 32px rgba(239,68,68,0.4)" : "0 8px 32px rgba(34,197,94,0.45)",
//       transition: "transform 0.2s, box-shadow 0.2s", transform: hov ? "scale(1.06)" : "scale(1)",
//     }}>
//       {isDecline ? <X size={24} color="white" /> : <Phone size={24} color="white" />}
//       <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>{isDecline ? "Decline" : "Accept"}</span>
//     </button>
//   );
// }

// /* ══════════════════════════════════════════════════
//    PANEL 3 — LIVE SESSION HISTORY
// ══════════════════════════════════════════════════ */
// function PanelLiveHistory({ t, isDark, navigate }) {
//   const [sessions,     setSessions]     = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [search,       setSearch]       = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch("/api/trainer/live-sessions/history");
//         const data = await res.json();
//         setSessions(data || []);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   const filtered = sessions.filter((s) => {
//     const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
//     const matchStatus = statusFilter === "all" || s.status === statusFilter;
//     return matchSearch && matchStatus;
//   });

//   const iStyle = inputStyle(t);

//   return (
//     <div>
//       <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
//         <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
//           <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
//           <input placeholder="Search sessions..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...iStyle, padding: "9px 14px 9px 34px" }} />
//         </div>
//         <div style={{ position: "relative", minWidth: 160 }}>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...iStyle, cursor: "pointer", paddingRight: 36, width: "auto" }}>
//             <option value="all">All Status</option>
//             <option value="completed">Completed</option>
//             <option value="cancelled">Cancelled</option>
//           </select>
//           <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
//         </div>
//       </div>
//       <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden" }}>
//         {loading ? (
//           <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
//             {[1,2,3,4].map((i) => <div key={i} style={{ height: 52, borderRadius: 10, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />)}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
//             <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
//               <Video size={22} color={t.emptyIcon} />
//             </div>
//             <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No sessions found</p>
//           </div>
//         ) : (
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.tableBorderColor}` }}>
//                   {["Session","Date & Time","Duration","Viewers","Status","Actions"].map((h) => (
//                     <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((s) => <HistoryRow key={s.id} session={s} t={t} navigate={navigate} />)}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function HistoryRow({ session: s, t, navigate }) {
//   const [hov, setHov] = useState(false);
//   const isCompleted   = s.status === "completed";
//   const statusColor   = isCompleted ? "#34d399" : "#f87171";
//   return (
//     <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => navigate(`/trainer/live/attendance/${s.id}`)}
//       style={{ borderBottom: `1px solid ${t.tableBorderColor}`, background: hov ? t.tableHov : "transparent", cursor: "pointer", transition: "background 0.15s" }}>
//       <td style={{ padding: "14px 20px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", flexShrink: 0 }}><Video size={14} color="#22d3ee" /></div>
//           <div>
//             <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{s.title}</p>
//             <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{s.category}</p>
//           </div>
//         </div>
//       </td>
//       <td style={{ padding: "14px 20px" }}><p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{s.date}</p><p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{s.time}</p></td>
//       <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {s.duration ?? "—"}</span></td>
//       <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> <strong>{s.viewers ?? 0}</strong></span></td>
//       <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30`, padding: "3px 10px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>{s.status}</span></td>
//       <td style={{ padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
//         {isCompleted && (
//           <div style={{ display: "flex", gap: 6 }}>
//             <HeroBtn label="Report" icon={FileText} color="#22d3ee" onClick={() => navigate(`/trainer/live/attendance/${s.id}`)} />
//             {s.recordingUrl && <HeroBtn label="Replay" icon={Play} color="#a78bfa" onClick={() => window.open(s.recordingUrl, "_blank")} />}
//           </div>
//         )}
//       </td>
//     </tr>
//   );
// }

// /* ══════════════════════════════════════════════════
//    PANEL 4 — ATTENDANCE REPORT
// ══════════════════════════════════════════════════ */
// function PanelAttendanceReport({ t, isDark, navigate }) {
//   const [attendees, setAttendees] = useState([]);
//   const [report,    setReport]    = useState(null);
//   const [search,    setSearch]    = useState("");

//   useEffect(() => {
//     setReport({ sessionTitle: "React Live Class", date: "2026-02-19", time: "10:00 AM" });
//     setAttendees([{ name: "Raghib Imam", joinTime: "10:00 AM", leaveTime: "11:00 AM", duration: "60 min", watchPercent: 95, chatMessages: 5, status: "present" }]);
//   }, []);

//   const handleExport = () => {
//     const csv  = "data:text/csv;charset=utf-8,Name,Join Time,Leave Time,Duration,Watch %,Chat\n" + attendees.map((a) => `${a.name},${a.joinTime},${a.leaveTime},${a.duration},${a.watchPercent},${a.chatMessages}`).join("\n");
//     const link = document.createElement("a"); link.href = encodeURI(csv); link.download = "attendance.csv"; document.body.appendChild(link); link.click();
//   };

//   const filtered       = attendees.filter((a) => a.name?.toLowerCase().includes(search.toLowerCase()));
//   const completedCount = attendees.filter((a) => a.status === "present").length;
//   const completionRate = attendees.length > 0 ? Math.round((completedCount / attendees.length) * 100) : 0;
//   const avgWatch       = attendees.length > 0 ? Math.round(attendees.reduce((acc, a) => acc + (a.watchPercent ?? 0), 0) / attendees.length) : 0;
//   const totalMessages  = attendees.reduce((acc, a) => acc + (a.chatMessages ?? 0), 0);

//   const metricCards = [
//     { label: "Total Attendees", value: attendees.length,    color: "#22d3ee", icon: Users         },
//     { label: "Completed",       value: completedCount,      color: "#34d399", icon: CheckCircle2  },
//     { label: "Completion Rate", value: `${completionRate}%`, color: "#a78bfa", icon: BarChart3    },
//     { label: "Avg Watch Time",  value: `${avgWatch}%`,      color: "#f59e0b", icon: Clock         },
//     { label: "Chat Messages",   value: totalMessages,       color: "#f43f5e", icon: MessageCircle },
//   ];

//   return (
//     <div>
//       <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "flex-end" }}>
//         <HeroBtn label="Export CSV" icon={Download} color="#22d3ee" onClick={handleExport} />
//       </div>
//       {report && <p style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 16 }}>{report.sessionTitle} · {report.date} · {report.time}</p>}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
//         {metricCards.map((m, i) => <AttMetricCard key={i} metric={m} t={t} index={i} />)}
//       </div>
//       <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden" }}>
//         <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.tableBorderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}><Users size={15} color="#a78bfa" /></div>
//             <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Attendee Details</span>
//           </div>
//           <input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: isDark ? "#1a1a1a" : "#f8fafc", color: t.text, fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none", width: 200 }} />
//         </div>
//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.tableBorderColor}` }}>
//                 {["Student","Joined","Left","Duration","Watch %","Chat","Status"].map((h) => (
//                   <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>{filtered.map((a, i) => <AttendeeRow key={i} attendee={a} t={t} />)}</tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AttMetricCard({ metric, t, index }) {
//   const [hov, setHov] = useState(false);
//   const Icon = metric.icon;
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="dfade" style={{ animationDelay: `${index * 60}ms`, background: hov ? t.cardBgHov : t.cardBg, border: `1px solid ${hov ? metric.color + "30" : t.border}`, boxShadow: hov ? `0 8px 32px ${metric.color}12` : t.shadow, borderRadius: 20, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10, transition: "all 0.25s ease", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", top: -15, right: -15, width: 70, height: 70, borderRadius: "50%", background: metric.color, filter: "blur(30px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
//       <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${metric.color}18`, border: `1px solid ${metric.color}30` }}><Icon size={17} color={metric.color} /></div>
//       <div>
//         <p style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{metric.value}</p>
//         <p style={{ fontSize: 9, marginTop: 5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "5px 0 0" }}>{metric.label}</p>
//       </div>
//       <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 99, background: metric.color, width: hov ? "60%" : "18%", transition: "width 0.65s ease" }} /></div>
//     </div>
//   );
// }

// function AttendeeRow({ attendee: a, t }) {
//   const [hov, setHov] = useState(false);
//   const cfg  = statusConfig[a.status] || statusConfig.present;
//   const Icon = cfg.icon;
//   return (
//     <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderBottom: `1px solid ${t.tableBorderColor}`, background: hov ? t.tableHov : "transparent", transition: "background 0.15s" }}>
//       <td style={{ padding: "13px 18px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//           <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{(a.name||"?")[0]}</div>
//           <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.name}</span>
//         </div>
//       </td>
//       {[a.joinTime, a.leaveTime, a.duration].map((v, i) => <td key={i} style={{ padding: "13px 18px", fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{v}</td>)}
//       <td style={{ padding: "13px 18px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//           <div style={{ flex: 1, maxWidth: 60, height: 4, borderRadius: 99, background: t.barBg, overflow: "hidden" }}>
//             <div style={{ height: "100%", borderRadius: 99, background: a.watchPercent >= 80 ? "#34d399" : a.watchPercent >= 50 ? "#f59e0b" : "#f87171", width: `${a.watchPercent}%` }} />
//           </div>
//           <span style={{ fontSize: 11, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.watchPercent}%</span>
//         </div>
//       </td>
//       <td style={{ padding: "13px 18px", fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{a.chatMessages}</td>
//       <td style={{ padding: "13px 18px" }}>
//         <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, padding: "3px 10px", borderRadius: 999, width: "fit-content", fontFamily: "'Poppins',sans-serif" }}>
//           <Icon size={10} color={cfg.color} /> {cfg.label}
//         </span>
//       </td>
//     </tr>
//   );
// }

// /* ══════════════════════════════════════════════════
//    PANEL 5 — UPLOAD RECORDED VIDEO
// ══════════════════════════════════════════════════ */
// function PanelUploadRecorded({ t, isDark, navigate }) {
//   const fileRef = useRef(null);
//   const [file, setFile]           = useState(null);
//   const [batches, setBatches]     = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [dragOver, setDragOver]   = useState(false);
//   const [form, setForm]           = useState({ lectureTitle: "", shortDescription: "", batchId: "", batchName: "" });

//   const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

//   useEffect(() => {
//     (async () => {
//       try { const res = await fetch("/api/batches"); const data = await res.json(); setBatches(data); }
//       catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith("video/")) setFile(f); };
//   const handleBatchChange = (v) => { const sel = batches.find((b) => b.id === v); setForm((p) => ({ ...p, batchId: v, batchName: sel?.batchName || "" })); };

//   const handleUpload = async () => {
//     if (!form.lectureTitle || !form.batchId) { alert("Lecture Title and Batch are required"); return; }
//     try {
//       setUploading(true);
//       const fd = new FormData();
//       fd.append("file", file); fd.append("title", form.lectureTitle);
//       fd.append("description", form.shortDescription); fd.append("batchId", form.batchId);
//       await uploadRecording(fd);
//       alert("Video uploaded successfully");
//       setFile(null); setForm({ lectureTitle: "", shortDescription: "", batchId: "", batchName: "" });
//     } catch (err) { console.error(err); alert("Upload failed."); }
//     finally { setUploading(false); }
//   };

//   const iStyle = inputStyle(t);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//       {!file ? (
//         <div onClick={() => fileRef.current.click()} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
//           style={{ borderRadius: 20, border: `2px dashed ${dragOver ? "#2dd4bf" : t.dropBorder}`, background: dragOver ? (isDark ? "rgba(45,212,191,0.05)" : "rgba(45,212,191,0.04)") : t.dropBg, padding: "60px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: t.shadow, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
//           <div style={{ animation: "uploadFloat 2.5s ease-in-out infinite" }}>
//             <div style={{ width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
//               <UploadCloud size={28} color="#2dd4bf" />
//             </div>
//           </div>
//           <div>
//             <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, margin: "0 0 6px" }}>Drop your video here</p>
//             <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: t.textMuted, margin: 0 }}>MP4, MOV, AVI up to 2GB</p>
//           </div>
//           <button style={{ padding: "9px 22px", borderRadius: 10, border: "1px solid rgba(45,212,191,0.3)", background: "rgba(45,212,191,0.1)", color: "#2dd4bf", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Select File</button>
//           <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
//         </div>
//       ) : (
//         <>
//           <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "16px 20px", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", flexShrink: 0 }}>
//               <Video size={18} color="#2dd4bf" />
//             </div>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
//               <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//             </div>
//             <button onClick={() => setFile(null)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted }}>
//               <X size={14} />
//             </button>
//           </div>
//           <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.shadow }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
//               <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}><Video size={15} color="#2dd4bf" /></div>
//               <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Video Details</span>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               <div><label style={labelStyle(t)}>Lecture Title</label><input style={iStyle} value={form.lectureTitle} onChange={(e) => set("lectureTitle", e.target.value)} placeholder="Enter lecture title..." /></div>
//               <div><label style={labelStyle(t)}>Short Description</label><textarea style={{ ...iStyle, resize: "vertical", minHeight: 80 }} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="Brief description..." /></div>
//               <div>
//                 <label style={labelStyle(t)}>Select Batch</label>
//                 <div style={{ position: "relative" }}>
//                   <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.batchId} onChange={(e) => handleBatchChange(e.target.value)}>
//                     <option value="">{loading ? "Loading batches..." : "Select a batch..."}</option>
//                     {batches.map((b) => <option key={b.id} value={b.id}>{b.batchName}</option>)}
//                   </select>
//                   <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <UploadSubmitBtn uploading={uploading} onClick={handleUpload} />
//         </>
//       )}
//     </div>
//   );
// }

// function UploadSubmitBtn({ uploading, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button onClick={onClick} disabled={uploading} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: uploading ? "rgba(45,212,191,0.5)" : hov ? "#14b8a6" : "#2dd4bf", color: uploading ? "rgba(255,255,255,0.7)" : "#0f172a", fontSize: 13, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", boxShadow: hov && !uploading ? "0 8px 24px rgba(45,212,191,0.35)" : "none" }}>
//       <UploadCloud size={16} />{uploading ? "Uploading..." : "Upload & Publish"}
//     </button>
//   );
// }

// /* ══════════════════════════════════════════════════
//    PANEL 6 — RECORDED CLASSES LIST
// ══════════════════════════════════════════════════ */
// function PanelRecordedList({ t, isDark, navigate }) {
//   const [videos,  setVideos]  = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search,  setSearch]  = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch("/api/recorded-videos");
//         if (!res.ok) { setVideos([]); return; }
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];
//         setVideos(Array.isArray(data) ? data : []);
//       } catch (err) { console.error(err); setVideos([]); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   const filtered = videos.filter((v) => v.title?.toLowerCase().includes(search.toLowerCase()));
//   const iStyle   = inputStyle(t);

//   return (
//     <div>
//       <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "12px 16px", boxShadow: t.shadow, marginBottom: 20, position: "relative" }}>
//         <Search size={13} style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
//         <input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...iStyle, padding: "8px 14px 8px 34px" }} />
//       </div>
//       {loading ? (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
//           {[1,2,3,4,5,6].map((i) => (
//             <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, overflow: "hidden", boxShadow: t.shadow }}>
//               <div style={{ height: 160, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />
//               <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
//                 <div style={{ height: 12, borderRadius: 6, background: t.barBg, animation: "pulse 1.5s ease infinite", width: "75%" }} />
//                 <div style={{ height: 10, borderRadius: 5, background: t.barBg, animation: "pulse 1.5s ease infinite", width: "50%" }} />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : filtered.length === 0 ? (
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 14 }}>
//           <div style={{ width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}><Video size={28} color={t.emptyIcon} /></div>
//           <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No videos found</p>
//         </div>
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
//           {filtered.map((video, i) => <VideoCard key={video.id} video={video} t={t} isDark={isDark} index={i} navigate={navigate} />)}
//         </div>
//       )}
//     </div>
//   );
// }

// function VideoCard({ video, t, isDark, index, navigate }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <div onClick={() => navigate(`/trainer/live/recorded/edit/${video.id}`)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="dfade"
//       style={{ animationDelay: `${index * 50}ms`, background: hov ? t.cardBgHov : t.cardBg, border: `1px solid ${hov ? t.borderHov : t.border}`, boxShadow: hov ? `${t.shadowHov}, 0 0 40px rgba(244,63,94,0.08)` : t.shadow, borderRadius: 20, overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease" }}>
//       <div style={{ position: "relative", height: 160, background: video.thumbnail ? undefined : t.thumbBg, overflow: "hidden" }}>
//         {video.thumbnail ? (
//           <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
//         ) : (
//           <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? "linear-gradient(135deg,rgba(244,63,94,0.08),rgba(167,139,250,0.08))" : "linear-gradient(135deg,rgba(244,63,94,0.05),rgba(167,139,250,0.05))" }}>
//             <Video size={32} color={t.emptyIcon} />
//           </div>
//         )}
//         <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hov ? 1 : 0, transition: "opacity 0.25s" }}>
//           <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Play size={18} color="#0f172a" style={{ marginLeft: 2 }} />
//           </div>
//         </div>
//       </div>
//       <div style={{ padding: "14px 16px 16px" }}>
//         <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: t.text, margin: "0 0 5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.title}</h3>
//         <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: t.textMuted, margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{video.description}</p>
//         <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#f43f5e", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", padding: "3px 8px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>{video.batchName}</span>
//       </div>
//     </div>
//   );
// }

// export default TrainerLiveClasses;







// src/trainer/TrainerLiveClasses.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  getBatchSessions, endLiveSession, deleteLiveSession,
  uploadRecording, joinCall, createLiveSession,
} from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";

import {
  Video, History, Upload, List, BarChart3, Circle, Calendar, Clock,
  Users, Radio, ChevronDown, Sparkles, Phone, LayoutDashboard,
  ArrowLeft, UploadCloud, X, Search, Play, FileText, Activity,
  CheckCircle2, AlertCircle, XCircle, Download, MessageCircle,
  Bell, MessageSquare,
} from "lucide-react";
import { Client } from "@stomp/stompjs";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
    heroBg: "#141414", border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    pillBg: "rgba(255,255,255,0.04)", pillText: "rgba(255,255,255,0.25)",
    barBg: "rgba(255,255,255,0.05)", actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)", gridLine: "rgba(255,255,255,0.5)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)", emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    navStripBg: "#111111", navStripBorder: "rgba(255,255,255,0.06)",
    tabInactiveBg: "rgba(255,255,255,0.04)", tabInactiveBorder: "rgba(255,255,255,0.10)",
    tabInactiveText: "rgba(255,255,255,0.45)",
    inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
    labelColor: "rgba(255,255,255,0.4)", selectBg: "#1a1a1a",
    dropBg: "rgba(255,255,255,0.02)", dropBorder: "rgba(255,255,255,0.07)",
    thumbBg: "rgba(255,255,255,0.04)", videoBg: "rgba(255,255,255,0.03)",
    videoBorder: "rgba(255,255,255,0.05)", tableBorderColor: "rgba(255,255,255,0.05)",
    tableHov: "rgba(255,255,255,0.03)", theadBg: "rgba(255,255,255,0.03)",
    toggleBg: "rgba(255,255,255,0.03)", toggleBorder: "rgba(255,255,255,0.06)",
    liveColor: "#34d399", liveText: "#34d399",
    actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
    panelActiveBg: "#141414", panelInactiveBg: "#0f0f0f",
    headHov: "rgba(255,255,255,0.02)",
    reviewBg: "rgba(255,255,255,0.03)", reviewBorder: "rgba(255,255,255,0.06)",
    numInactiveBg: "rgba(255,255,255,0.04)", numInactiveBorder: "rgba(255,255,255,0.10)", numInactiveText: "rgba(255,255,255,0.25)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc",
    heroBg: "#ffffff", border: "#e2e8f0",
    borderHov: "#cbd5e1", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    pillBg: "#f1f5f9", pillText: "#94a3b8",
    barBg: "#f1f5f9", actBg: "#f8fafc", actBorder: "#e2e8f0",
    gridLine: "rgba(0,0,0,0.12)", shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0", recentItemBgHov: "#f1f5f9",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    navStripBg: "#ffffff", navStripBorder: "#e2e8f0",
    tabInactiveBg: "#f8fafc", tabInactiveBorder: "#e2e8f0", tabInactiveText: "#64748b",
    inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
    labelColor: "#64748b", selectBg: "#f8fafc",
    dropBg: "#f8fafc", dropBorder: "#e2e8f0",
    thumbBg: "#f1f5f9", videoBg: "#f8fafc", videoBorder: "#e2e8f0",
    tableBorderColor: "#e2e8f0", tableHov: "#f8fafc", theadBg: "#f8fafc",
    toggleBg: "#f8fafc", toggleBorder: "#e2e8f0",
    liveColor: "#16a34a", liveText: "#16a34a",
    actBar: "#94a3b8", actIcon: "#94a3b8",
    panelActiveBg: "#ffffff", panelInactiveBg: "#fafafa",
    headHov: "rgba(0,0,0,0.015)",
    reviewBg: "#f8fafc", reviewBorder: "#e2e8f0",
    numInactiveBg: "#f1f5f9", numInactiveBorder: "#e2e8f0", numInactiveText: "#94a3b8",
  },
};

/* ─── CRM Panel Accents ─── */
const PANEL_ACCENTS = {
  1: { color: "#f43f5e", dim: "rgba(244,63,94,0.10)",  border: "rgba(244,63,94,0.25)",  label: "Session Details",  sub: "Title, batch & schedule"    },
  2: { color: "#22d3ee", dim: "rgba(34,211,238,0.10)", border: "rgba(34,211,238,0.25)", label: "Session Settings", sub: "Chat, recording & alerts"    },
  3: { color: "#34d399", dim: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.25)", label: "Review & Launch",  sub: "Confirm and go live"         },
};

/* ─── Tab config ─── */
const NAV_TABS = [
  { key: "live-dashboard",  label: "Live Dashboard",         icon: LayoutDashboard, primary: true  },
  { key: "start-live",      label: "Start Live Session",     icon: Video,           primary: false },
  { key: "join-call",       label: "Join Call",              icon: Phone,           primary: false },
  { key: "live-history",    label: "Live Session History",   icon: History,         primary: false },
  { key: "live-attendance", label: "Live Attendance Report", icon: Users,           primary: false },
  { key: "upload-recorded", label: "Upload Recorded Video",  icon: Upload,          primary: false },
  { key: "recorded-list",   label: "Recorded Classes List",  icon: List,            primary: false },
];

const wsUrl = (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:9000") + "/live-chat";
const getTrainerEmail = () => {
  try { const u = JSON.parse(localStorage.getItem("lms_user") || "{}"); return u.email || null; }
  catch { return null; }
};

const statusConfig = {
  present:      { label: "On Time",    icon: CheckCircle2, color: "#34d399" },
  late:         { label: "Late",       icon: AlertCircle,  color: "#f59e0b" },
  "left-early": { label: "Left Early", icon: XCircle,      color: "#f87171" },
};

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const TrainerLiveClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live-dashboard");

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
       document.documentElement.getAttribute("data-theme") === "dark")
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
  const switchTab = (tab) => setActiveTab(tab.key);

  const heroMeta = {
    "live-dashboard":  { title: "Live Dashboard",        subtitle: "Manage your live sessions & recorded content", color: "#22c55e" },
    "start-live":      { title: "Start Live Session",     subtitle: "Schedule or go live instantly",               color: "#22c55e" },
    "join-call":       { title: "Join Call",              subtitle: "Accept incoming student calls",               color: "#6366f1" },
    "live-history":    { title: "Session History",        subtitle: "All your past live sessions in one place",    color: "#22d3ee" },
    "live-attendance": { title: "Attendance Report",      subtitle: "Detailed attendance analytics",               color: "#a78bfa" },
    "upload-recorded": { title: "Upload Recorded Video",  subtitle: "Publish recorded content for students",       color: "#2dd4bf" },
    "recorded-list":   { title: "Recorded Classes",       subtitle: "Browse and manage your video library",        color: "#22c55e" },
  }[activeTab] || { title: "Live Studio", subtitle: "", color: "#22c55e" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes liveDot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes uploadFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes radarPulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
        @keyframes callPulse   { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 70%{box-shadow:0 0 0 18px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
        @keyframes callPulse2  { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.3)} 70%{box-shadow:0 0 0 32px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
        @keyframes pulse-ring  { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
        @keyframes slideDown   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        /* ── Hero motion orbs ── */
        @keyframes orbFloat1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -20px) scale(1.08); }
          66%  { transform: translate(-15px, 25px) scale(0.94); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orbFloat2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-25px, 18px) scale(1.06); }
          66%  { transform: translate(20px, -22px) scale(0.96); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orbFloat3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(18px, 14px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orbFloat4 {
          0%   { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          50%  { transform: translate(-20px, -16px) scale(0.9) rotate(180deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gridDrift {
          0%   { transform: translateX(0) translateY(0); }
          100% { transform: translateX(40px) translateY(40px); }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0.6; }
          50%  { transform: translateY(-12px) translateX(8px); opacity: 1; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
        }

        .dfade       { animation: fadeUp 0.45s ease both }
        .livebadge   { animation: pulse-ring 2.2s ease-out infinite }
        .d1 { animation: blink 1.6s ease infinite }
        .d2 { animation: blink 1.6s 0.3s ease infinite }
        .d3 { animation: blink 1.6s 0.6s ease infinite }
        .panel-body-inner { animation: slideDown 0.3s ease both }
        .nav-strip-scroll { overflow-x:auto; overflow-y:visible; -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color: ${isDark ? "rgba(255,255,255,0.18) rgba(255,255,255,0.04)" : "rgba(0,0,0,0.18) rgba(0,0,0,0.04)"}; padding-bottom: 6px; }
        .nav-strip-scroll::-webkit-scrollbar { display:block; height:4px; }
        .nav-strip-scroll::-webkit-scrollbar-track { background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; border-radius:99px; }
        .nav-strip-scroll::-webkit-scrollbar-thumb { background: ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}; border-radius:99px; }
        .nav-strip-scroll::-webkit-scrollbar-thumb:hover { background: ${isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)"}; }
        .nav-strip-inner { display:inline-flex; flex-wrap:nowrap; align-items:center; gap:6px; min-width:max-content; padding: 2px 2px; }
        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator {
          filter: ${isDark ? "invert(1) opacity(0.3)" : "opacity(0.5)"}; cursor:pointer;
        }

        /* Hero orb elements */
        .hero-orb-1 { animation: orbFloat1 9s ease-in-out infinite; }
        .hero-orb-2 { animation: orbFloat2 11s ease-in-out infinite; }
        .hero-orb-3 { animation: orbFloat3 7s ease-in-out infinite; }
        .hero-orb-4 { animation: orbFloat4 14s linear infinite; }
        .hero-particle { animation: particleDrift ease-in-out infinite; }
        .hero-grid-drift { animation: gridDrift 8s linear infinite alternate; }
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ══ HERO ══ */}
          <div className="dfade" style={{
            borderRadius: 24, padding: "28px 32px 24px", background: t.heroBg,
            border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden",
            marginBottom: 0, boxShadow: t.shadow,
            borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: "none",
          }}>
            {/* ── Animated motion background ── */}

            {/* Drifting grid */}
            <div className="hero-grid-drift" style={{
              position: "absolute", inset: "-40px", pointerEvents: "none",
              opacity: isDark ? 0.035 : 0.018,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />

            {/* Orb 1 — large green glow, top-right */}
            <div className="hero-orb-1" style={{
              position: "absolute", top: "-40%", right: "5%",
              width: 320, height: 320,
              background: isDark
                ? "radial-gradient(ellipse, rgba(34,197,94,0.22) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 70%)",
              pointerEvents: "none", borderRadius: "50%",
            }} />

            {/* Orb 2 — cyan/teal, top-center */}
            <div className="hero-orb-2" style={{
              position: "absolute", top: "-30%", left: "40%",
              width: 240, height: 200,
              background: isDark
                ? "radial-gradient(ellipse, rgba(34,211,238,0.15) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%)",
              pointerEvents: "none", borderRadius: "50%",
            }} />

            {/* Orb 3 — emerald, bottom-left */}
            <div className="hero-orb-3" style={{
              position: "absolute", bottom: "-50%", left: "-5%",
              width: 280, height: 220,
              background: isDark
                ? "radial-gradient(ellipse, rgba(52,211,153,0.14) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(52,211,153,0.07) 0%, transparent 70%)",
              pointerEvents: "none", borderRadius: "50%",
            }} />

            {/* Orb 4 — violet accent, center */}
            <div className="hero-orb-4" style={{
              position: "absolute", top: "10%", left: "25%",
              width: 180, height: 180,
              background: isDark
                ? "radial-gradient(ellipse, rgba(167,139,250,0.10) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)",
              pointerEvents: "none", borderRadius: "50%",
            }} />

            {/* Floating particles */}
            {[
              { left: "15%", top: "20%", delay: "0s",   size: 3, color: isDark ? "rgba(34,197,94,0.5)"   : "rgba(34,197,94,0.35)",   dur: "4s"  },
              { left: "72%", top: "30%", delay: "1.2s", size: 2, color: isDark ? "rgba(34,211,238,0.45)" : "rgba(34,211,238,0.3)",   dur: "5.5s"},
              { left: "85%", top: "60%", delay: "0.6s", size: 3, color: isDark ? "rgba(52,211,153,0.4)"  : "rgba(52,211,153,0.25)",  dur: "6s"  },
              { left: "55%", top: "70%", delay: "2s",   size: 2, color: isDark ? "rgba(167,139,250,0.4)" : "rgba(167,139,250,0.25)", dur: "4.8s"},
              { left: "30%", top: "80%", delay: "0.9s", size: 2, color: isDark ? "rgba(34,197,94,0.35)"  : "rgba(34,197,94,0.2)",    dur: "7s"  },
              { left: "92%", top: "20%", delay: "1.8s", size: 4, color: isDark ? "rgba(34,211,238,0.3)"  : "rgba(34,211,238,0.18)",  dur: "5s"  },
            ].map((p, i) => (
              <div key={i} className="hero-particle" style={{
                position: "absolute", left: p.left, top: p.top,
                width: p.size, height: p.size, borderRadius: "50%",
                background: p.color, pointerEvents: "none",
                animationDelay: p.delay, animationDuration: p.dur,
              }} />
            ))}

            {/* Shimmer accent line */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
              background: isDark
                ? "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.4) 30%, rgba(34,211,238,0.4) 60%, transparent 100%)"
                : "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.25) 30%, rgba(34,211,238,0.25) 60%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* Content */}
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Live Studio</span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  {heroMeta.title}
                </h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 6, marginBottom: 0, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
                  {heroMeta.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* ══ NAV TAB STRIP ══ */}
          <div style={{
            background: t.navStripBg, border: `1px solid ${t.navStripBorder}`,
            borderTop: "none", borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
            padding: "12px 32px 10px", marginBottom: 0, boxShadow: t.shadow,
          }}>
            <div className="nav-strip-scroll">
              <div className="nav-strip-inner">
                {NAV_TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  const Icon = tab.icon;
                  let bg, border, color;
                  /* ── GREEN active button ── */
                  if (isActive) {
                    bg = "#22c55e"; border = "#22c55e"; color = "#ffffff";
                  } else if (tab.primary) {
                    bg = isDark ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.07)";
                    border = "rgba(34,197,94,0.35)";
                    color = "#22c55e";
                  } else {
                    bg = t.tabInactiveBg; border = t.tabInactiveBorder; color = t.tabInactiveText;
                  }
                  return (
                    <button key={tab.key} onClick={() => switchTab(tab)} style={{
                      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "6px 14px", borderRadius: 8, border: `1px solid ${border}`,
                      background: bg, color, fontSize: 11, fontWeight: isActive || tab.primary ? 700 : 600,
                      cursor: "pointer", transition: "all 0.18s", fontFamily: "'Poppins',sans-serif",
                      letterSpacing: "0.02em", whiteSpace: "nowrap",
                      boxShadow: isActive ? "0 4px 14px rgba(34,197,94,0.35)" : "none",
                    }}>
                      <Icon size={12} strokeWidth={2.2} />{tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══ PANEL CONTENT ══ */}
          <div style={{
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            borderTop: "none", borderRadius: 0,
            padding: "20px 32px 28px", marginBottom: 20, boxShadow: t.shadow,
            borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
          }}>
            {activeTab === "live-dashboard"   && <PanelLiveDashboard    t={t} isDark={isDark} navigate={navigate} />}
            {activeTab === "start-live"       && <PanelStartLive        t={t} isDark={isDark} navigate={navigate} />}
            {activeTab === "join-call"        && <PanelJoinCall         t={t} isDark={isDark} navigate={navigate} />}
            {activeTab === "live-history"     && <PanelLiveHistory      t={t} isDark={isDark} navigate={navigate} />}
            {activeTab === "live-attendance"  && <PanelAttendanceReport t={t} isDark={isDark} navigate={navigate} />}
            {activeTab === "upload-recorded"  && <PanelUploadRecorded   t={t} isDark={isDark} navigate={navigate} />}
            {activeTab === "recorded-list"    && <PanelRecordedList     t={t} isDark={isDark} navigate={navigate} />}
          </div>

        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════
   PANEL 0 — LIVE DASHBOARD
══════════════════════════════════════════════════ */
function PanelLiveDashboard({ t, isDark, navigate }) {
  const [sessions,       setSessions]       = useState([]);
  const [batchId,        setBatchId]        = useState(null);
  const [stats,          setStats]          = useState({ live: 0, viewers: 0, scheduled: 0, completed: 0 });
  const [loading,        setLoading]        = useState(true);
  const [activeTab,      setActiveTab]      = useState("all");
  const [isSessionsOpen, setIsSessionsOpen] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainerBatches();
        if (Array.isArray(data) && data.length > 0) {
          const fb = data[0];
          setBatchId(fb.id ?? fb.batchId ?? fb.batch_id);
        }
      } catch (err) { console.error(err); }
    })();
  }, []);

  useEffect(() => {
    if (!batchId) return;
    (async () => {
      try {
        const res  = await getBatchSessions(batchId);
        const data = res.data || [];
        setSessions(data);
        setStats({
          live:      data.filter((s) => s.status === "LIVE").length,
          viewers:   data.reduce((acc, s) => acc + (s.viewers ?? 0), 0),
          scheduled: data.filter((s) => s.status === "SCHEDULED").length,
          completed: data.filter((s) => s.status === "ENDED").length,
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [batchId]);

  const sessionTabs = ["all", "LIVE", "SCHEDULED", "ENDED"];
  const filtered    = activeTab === "all" ? sessions : sessions.filter((s) => s.status === activeTab);

  const handleEnd = async (id) => {
    try {
      await endLiveSession(id);
      setSessions((prev) => prev.map((s) => s.id === id ? { ...s, status: "ENDED" } : s));
      setStats((prev) => ({ ...prev, live: prev.live - 1, completed: prev.completed + 1 }));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLiveSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({ ...prev, completed: prev.completed - 1 }));
    } catch (err) { console.error(err); }
  };

  const statCards = [
    { label: "Live Now",     value: stats.live,      color: "#f43f5e", icon: Circle    },
    { label: "Live Viewers", value: stats.viewers,   color: "#f59e0b", icon: Users     },
    { label: "Scheduled",    value: stats.scheduled, color: "#22d3ee", icon: Calendar  },
    { label: "Completed",    value: stats.completed, color: "#34d399", icon: BarChart3 },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12, marginBottom: 20 }}>
        {statCards.map((s, i) => <StatCard key={i} stat={s} index={i} t={t} isDark={isDark} />)}
      </div>
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <Radio size={15} color="#22c55e" />
            </div>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Sessions</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {sessionTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "5px 14px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif",
                cursor: "pointer", border: "none", transition: "all 0.2s",
                background: activeTab === tab ? "#22c55e" : t.pillBg,
                color: activeTab === tab ? "#fff" : t.pillText,
                boxShadow: activeTab === tab ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
              }}>{tab}</button>
            ))}
            <button onClick={() => setIsSessionsOpen((p) => !p)} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t.border}`, background: t.pillBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, transition: "all 0.2s" }}>
              <ChevronDown size={13} style={{ transition: "transform 0.3s", transform: isSessionsOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
            </button>
          </div>
        </div>
        {isSessionsOpen && (
          loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1,2,3].map((i) => <div key={i} style={{ height: 56, borderRadius: 12, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
                <Video size={22} color={t.emptyIcon} />
              </div>
              <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No sessions found</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((session) => (
                <SessionRow key={session.id} session={session} t={t} navigate={navigate} handleEnd={handleEnd} handleDelete={handleDelete} />
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
}

function StatCard({ stat, index, t }) {
  const [hov, setHov] = useState(false);
  const Icon = stat.icon;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      animationDelay: `${index * 80}ms`, background: hov ? t.cardBgHov : t.cardBg,
      border: `1px solid ${hov ? t.borderHov : t.border}`,
      boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
      borderRadius: 16, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 12,
      position: "relative", overflow: "hidden", transition: "all 0.25s ease",
    }}>
      <div style={{ position: "absolute", top: -16, right: -16, width: 72, height: 72, borderRadius: "50%", background: stat.color, filter: "blur(32px)", opacity: hov ? 0.18 : 0.05, transition: "opacity 0.4s", pointerEvents: "none" }} />
      <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
        <Icon size={17} color={stat.color} strokeWidth={2} />
      </div>
      <div>
        <p style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{stat.value}</p>
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "5px 0 0" }}>{stat.label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: stat.color, width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
      </div>
    </div>
  );
}

function SessionRow({ session, t, navigate, handleEnd, handleDelete }) {
  const [hov, setHov] = useState(false);
  const statusColors  = { LIVE: "#f43f5e", SCHEDULED: "#22d3ee", ENDED: "#34d399" };
  const color         = statusColors[session.status] || t.textMuted;
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
        {session.status === "LIVE"  && <><ActionBtn label="Join" color="#34d399" onClick={() => navigate(`/trainer/live-controls/${session.id}`)} /><ActionBtn label="End" color="#f59e0b" onClick={() => handleEnd(session.id)} /></>}
        {session.status === "ENDED" && <ActionBtn label="Delete" color="#f43f5e" onClick={() => handleDelete(session.id)} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SHARED HELPERS
══════════════════════════════════════════════════ */
const inputStyle = (t) => ({
  width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10,
  border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText,
  fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none",
  transition: "border 0.2s", appearance: "none",
});
const labelStyle = (t) => ({
  fontSize: 10, fontWeight: 600, color: t.labelColor, fontFamily: "'Poppins',sans-serif",
  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block",
});

function ActionBtn({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${color}40`, background: hov ? `${color}25` : `${color}12`, color, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.15s" }}>
      {label}
    </button>
  );
}

function HeroBtn({ label, icon: Icon, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: `1px solid ${hov ? color + "55" : color + "30"}`, background: hov ? `${color}22` : `${color}12`, color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}>
      <Icon size={13} /> {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   CRM PANEL — reusable folding panel
══════════════════════════════════════════════════ */
function CRMPanel({ num, t, isDark, isOpen, onToggle, summaryChips = [], children }) {
  const a = PANEL_ACCENTS[num];
  return (
    <div style={{
      background: isOpen ? t.panelActiveBg : t.panelInactiveBg,
      border: `1px solid ${isOpen ? a.border : t.border}`,
      borderRadius: 18, overflow: "hidden",
      boxShadow: isOpen ? `0 4px 28px ${a.color}12` : t.shadow,
      transition: "all 0.25s ease",
    }}>
      <div
        onClick={onToggle}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", cursor: "pointer", transition: "background 0.15s" }}
        onMouseEnter={(e) => e.currentTarget.style.background = t.headHov}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s",
          background: isOpen ? a.dim : t.numInactiveBg,
          border: `1px solid ${isOpen ? a.border : t.numInactiveBorder}`,
          fontSize: 12, fontWeight: 800, fontFamily: "'Poppins',sans-serif",
          color: isOpen ? a.color : t.numInactiveText,
        }}>{num}</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif", letterSpacing: "-0.01em" }}>{a.label}</div>
          {!isOpen && <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginTop: 2 }}>{a.sub}</div>}
        </div>

        {!isOpen && summaryChips.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {summaryChips.slice(0, 3).map((chip, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 700, color: chip.color, background: `${chip.color}12`, border: `1px solid ${chip.color}25`, padding: "3px 8px", borderRadius: 99, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                {chip.label}
              </span>
            ))}
          </div>
        )}

        <div style={{ width: 1, height: 20, background: t.border, flexShrink: 0 }} />

        <div style={{
          width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? a.dim : "transparent",
          border: `1px solid ${isOpen ? a.border : t.border}`,
          transition: "all 0.25s", flexShrink: 0,
        }}>
          <ChevronDown size={13} color={isOpen ? a.color : t.textMuted} style={{ transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </div>

      {isOpen && <div style={{ height: 1, background: `linear-gradient(90deg, ${a.color}30, transparent)`, marginLeft: 20, marginRight: 20 }} />}

      <div style={{ maxHeight: isOpen ? 1000 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
        <div className="panel-body-inner" style={{ padding: "18px 20px 20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PremiumToggleRow({ label, sub, Icon, checked, color, t, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, transition: "border-color 0.2s" }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: checked ? `${color}12` : t.barBg, border: `1px solid ${checked ? color + "25" : "transparent"}`, transition: "all 0.2s" }}>
        <Icon size={14} color={checked ? color : t.textMuted} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginTop: 1 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", background: checked ? color : t.inputBorder, transition: "background 0.25s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 2, left: checked ? "calc(100% - 22px)" : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

function PanelNextBtn({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      padding: "9px 18px", borderRadius: 10, border: `1px solid ${hov ? color + "45" : color + "25"}`,
      background: hov ? `${color}15` : `${color}08`, color,
      fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
      letterSpacing: "0.03em", transition: "all 0.18s", alignSelf: "flex-end",
    }}>
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 1 — START LIVE SESSION  (3-panel CRM folding)
══════════════════════════════════════════════════ */
function PanelStartLive({ t, isDark, navigate }) {
  const [form, setForm]       = useState({ title: "", description: "", batchId: "", date: "", time: "", duration: "", chat: true, recording: true, notifications: true });
  const [batches, setBatches] = useState([]);
  const [submitting, setSub]  = useState(false);
  const [openPanel,  setOpenPanel]  = useState(1);

  const durations = ["15","30","45","60","75","90"];
  const upd = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  useEffect(() => {
    (async () => {
      try { const data = await getTrainerBatches(); setBatches(data || []); }
      catch (err) { console.error(err); }
    })();
  }, []);

  const handleGoLive = async () => {
    try {
      setSub(true);
      const payload = {
        title: form.title, description: form.description,
        batchId: Number(form.batchId), scheduledDate: form.date,
        scheduledTime: form.time, duration: Number(form.duration),
        chatEnabled: form.chat, autoRecord: form.recording,
        notifyStudents: form.notifications,
      };
      const res = await createLiveSession(payload);
      navigate(`/trainer/live-controls/${res.data.id}`);
    } catch (err) { console.error(err); }
    finally { setSub(false); }
  };

  const iStyle = inputStyle(t);
  const lStyle = labelStyle(t);

  const selectedBatch = batches.find((b) => String(b.id ?? b.batchId) === String(form.batchId));
  const batchLabel    = selectedBatch ? (selectedBatch.name ?? selectedBatch.batchName ?? `Batch ${form.batchId}`) : null;

  const reviewItems = [
    { label: "Title",     value: form.title    || "—",                              Icon: Video         },
    { label: "Batch",     value: batchLabel    || "—",                              Icon: Users         },
    { label: "Date",      value: form.date     || "—",                              Icon: Calendar      },
    { label: "Time",      value: form.time     || "—",                              Icon: Clock         },
    { label: "Duration",  value: form.duration ? `${form.duration} min` : "—",      Icon: Clock         },
    { label: "Chat",      value: form.chat          ? "Enabled" : "Off",            Icon: MessageSquare, bool: form.chat         },
    { label: "Recording", value: form.recording     ? "Enabled" : "Off",            Icon: Radio,         bool: form.recording    },
    { label: "Notify",    value: form.notifications ? "Enabled" : "Off",            Icon: Bell,          bool: form.notifications },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Progress pills */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        {[1, 2, 3].map((n) => {
          const a = PANEL_ACCENTS[n];
          const active = openPanel === n;
          return (
            <div key={n} onClick={() => setOpenPanel(n)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, border: `1px solid ${active ? a.border : t.border}`, background: active ? a.dim : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ width: active ? 16 : 6, height: 6, borderRadius: 99, background: active ? a.color : t.textMuted, transition: "all 0.3s ease" }} />
              {active && <span style={{ fontSize: 9, fontWeight: 700, color: a.color, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.04em" }}>{n}/3</span>}
            </div>
          );
        })}
        <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginLeft: 4 }}>
          {["Session Details", "Settings", "Review & Launch"][openPanel - 1]}
        </span>
      </div>

      {/* ── Panel 1: Session Details ── */}
      <CRMPanel
        num={1} t={t} isDark={isDark} isOpen={openPanel === 1}
        onToggle={() => setOpenPanel(openPanel === 1 ? null : 1)}
        summaryChips={[
          form.title  && { label: form.title.slice(0,20) + (form.title.length > 20 ? "…" : ""), color: "#f43f5e" },
          batchLabel  && { label: batchLabel.split(" ").slice(0,2).join(" "),                    color: "#f43f5e" },
          form.date   && { label: form.date,                                                      color: "#f43f5e" },
        ].filter(Boolean)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={lStyle}>Session Title</label>
            <input style={iStyle} value={form.title} onChange={(e) => upd("title", e.target.value)} placeholder="e.g. React Hooks Deep Dive" />
          </div>
          <div><label style={lStyle}>Description</label>
            <textarea style={{ ...iStyle, resize: "vertical", minHeight: 72 }} value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Brief overview for students..." />
          </div>
          <div><label style={lStyle}>Select Batch</label>
            <div style={{ position: "relative" }}>
              <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.batchId} onChange={(e) => upd("batchId", e.target.value)}>
                <option value="">Choose a batch...</option>
                {batches.map((b, i) => {
                  const id   = b.id ?? b.batchId ?? b.batch_id;
                  const name = b.name ?? b.batchName ?? `Batch (ID: ${id})`;
                  return <option key={i} value={String(id)}>{name}</option>;
                })}
              </select>
              <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><label style={lStyle}>Date</label><input type="date" style={iStyle} value={form.date} onChange={(e) => upd("date", e.target.value)} /></div>
            <div><label style={lStyle}>Time</label><input type="time" style={iStyle} value={form.time} onChange={(e) => upd("time", e.target.value)} /></div>
            <div><label style={lStyle}>Duration</label>
              <div style={{ position: "relative" }}>
                <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.duration} onChange={(e) => upd("duration", e.target.value)}>
                  <option value="">Select...</option>
                  {durations.map((d) => <option key={d} value={d}>{d} min</option>)}
                </select>
                <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
          <PanelNextBtn label="Next: Session Settings →" color="#f43f5e" onClick={() => setOpenPanel(2)} />
        </div>
      </CRMPanel>

      {/* ── Panel 2: Session Settings ── */}
      <CRMPanel
        num={2} t={t} isDark={isDark} isOpen={openPanel === 2}
        onToggle={() => setOpenPanel(openPanel === 2 ? null : 2)}
        summaryChips={[
          form.chat          && { label: "Chat On",     color: "#22d3ee" },
          form.recording     && { label: "Auto Record", color: "#22d3ee" },
          form.notifications && { label: "Notifying",   color: "#22d3ee" },
        ].filter(Boolean)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { key: "chat",          label: "Enable Chat",     sub: "Students can message during live",  color: "#22d3ee", Icon: MessageSquare },
            { key: "recording",     label: "Auto Record",     sub: "Save session for replay access",    color: "#f43f5e", Icon: Radio         },
            { key: "notifications", label: "Notify Students", sub: "Push alert when going live",        color: "#34d399", Icon: Bell          },
          ].map(({ key, label, sub, color, Icon }) => (
            <PremiumToggleRow key={key} label={label} sub={sub} Icon={Icon} checked={form[key]} color={color} t={t} onChange={(v) => upd(key, v)} />
          ))}
          <PanelNextBtn label="Next: Review & Launch →" color="#22d3ee" onClick={() => setOpenPanel(3)} />
        </div>
      </CRMPanel>

      {/* ── Panel 3: Review & Launch ── */}
      <CRMPanel
        num={3} t={t} isDark={isDark} isOpen={openPanel === 3}
        onToggle={() => setOpenPanel(openPanel === 3 ? null : 3)}
        summaryChips={[]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {reviewItems.map((item, i) => {
            const Icon    = item.Icon;
            const isBool  = item.bool !== undefined;
            const boolCol = item.bool ? "#34d399" : t.textMuted;
            return (
              <div key={i} style={{ background: t.reviewBg, border: `1px solid ${t.reviewBorder}`, borderRadius: 12, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon size={10} color={t.textMuted} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: isBool ? boolCol : t.text, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isBool && <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: boolCol, marginRight: 5 }} />}
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
        <GoLiveButton submitting={submitting} onClick={handleGoLive} />
      </CRMPanel>

    </div>
  );
}

function GoLiveButton({ submitting, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={submitting} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
      background: submitting ? "rgba(34,197,94,0.5)" : hov ? "#16a34a" : "#22c55e",
      color: "#fff", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
      fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em", display: "flex",
      alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
      boxShadow: hov && !submitting ? "0 8px 28px rgba(34,197,94,0.38)" : "none",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "liveDot 1.2s ease-in-out infinite" }} />
      {submitting ? "Starting session…" : "Go Live Now"}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 2 — JOIN CALL
══════════════════════════════════════════════════ */
function PanelJoinCall({ t, isDark, navigate }) {
  const [room, setRoom]           = useState(null);
  const [connected, setConnected] = useState(false);
  const [trainerEmail, setEmail]  = useState(null);
  const stompRef = useRef(null);

  useEffect(() => {
    const email = getTrainerEmail();
    if (!email) return;
    setEmail(email);
    const client = new Client({
      brokerURL: wsUrl, reconnectDelay: 5000,
      onConnect:    () => { setConnected(true);  client.subscribe(`/topic/calls/${email}`, (msg) => setRoom(msg.body)); },
      onDisconnect: () => { setConnected(false); },
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, []);

  const handleJoin = async () => {
    try {
      if (!room) return alert("No incoming call");
      const res = await joinCall(room);
      const { token } = res.data;
      if (!token) return alert("Invalid token");
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate("/trainer/call-room", { state: { room, token } });
    } catch (err) { console.error(err); alert("Failed to join call."); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "32px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, color: connected ? t.liveText : t.textMuted, fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? t.liveColor : t.textMuted, display: "inline-block", animation: connected ? "liveDot 1.2s ease-in-out infinite" : "none" }} />
            {connected ? "Connected" : "Offline"}
          </span>
        </div>
        <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: isDark ? "rgba(34,197,94,0.08)" : "rgba(22,163,74,0.08)", border: isDark ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(22,163,74,0.3)", borderRadius: 999, padding: "8px 18px", color: t.liveText, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.liveColor, display: "inline-block" }} />LIVE
        </div>
      </div>

      {room ? (
        <>
          <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.5)", animation: "callPulse 2s ease-out infinite" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.3)", animation: "callPulse2 2s ease-out infinite 0.4s" }} />
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#4338ca,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="17" r="9" fill="rgba(255,255,255,0.9)" /><ellipse cx="22" cy="38" rx="15" ry="9" fill="rgba(255,255,255,0.9)" /></svg>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "0 0 8px" }}>INCOMING CALL</p>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 900, color: t.text, margin: "0 0 6px", letterSpacing: "-0.04em" }}>Student</h2>
            <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Room · {room}</p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <CallActionBtn type="decline" onClick={() => setRoom(null)} />
            <CallActionBtn type="accept"  onClick={handleJoin} />
          </div>
        </>
      ) : (
        <>
          <div style={{ width: 120, height: 120, borderRadius: "50%", border: `1.5px solid rgba(99,102,241,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", animation: "radarPulse 3s ease-in-out infinite" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", border: `1.5px solid rgba(99,102,241,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: isDark ? "rgba(99,102,241,0.12)" : "rgba(79,70,229,0.07)", border: `1.5px solid rgba(99,102,241,0.45)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone size={22} color={isDark ? "#a5b4fc" : "#6366f1"} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 900, color: t.text, margin: "0 0 8px" }}>Waiting for calls</h3>
            <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>
              {connected ? `Listening as ${trainerEmail ?? "trainer"}` : trainerEmail ? "Connecting…" : "Email not found"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[0,1,2,3,4].map((i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: connected ? (isDark ? "#6366f1" : "#4f46e5") : (isDark ? "#374151" : "#d1d5db"), animation: "liveDot 1.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CallActionBtn({ type, onClick }) {
  const [hov, setHov] = useState(false);
  const isDecline = type === "decline";
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      width: 72, height: 72, borderRadius: "50%", border: "none", cursor: "pointer",
      background: isDecline ? (hov ? "#991b1b" : "linear-gradient(135deg,#7f1d1d,#ef4444)") : (hov ? "#14532d" : "linear-gradient(135deg,#14532d,#22c55e)"),
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
      boxShadow: isDecline ? "0 8px 32px rgba(239,68,68,0.4)" : "0 8px 32px rgba(34,197,94,0.45)",
      transition: "transform 0.2s, box-shadow 0.2s", transform: hov ? "scale(1.06)" : "scale(1)",
    }}>
      {isDecline ? <X size={24} color="white" /> : <Phone size={24} color="white" />}
      <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>{isDecline ? "Decline" : "Accept"}</span>
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 3 — LIVE SESSION HISTORY
══════════════════════════════════════════════════ */
function PanelLiveHistory({ t, isDark, navigate }) {
  const [sessions,     setSessions]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/trainer/live-sessions/history");
        const data = await res.json();
        setSessions(data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = sessions.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const iStyle = inputStyle(t);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
          <input placeholder="Search sessions..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...iStyle, padding: "9px 14px 9px 34px" }} />
        </div>
        <div style={{ position: "relative", minWidth: 160 }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...iStyle, cursor: "pointer", paddingRight: 36, width: "auto" }}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3,4].map((i) => <div key={i} style={{ height: 52, borderRadius: 10, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />)}
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
                  {["Session","Date & Time","Duration","Viewers","Status","Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => <HistoryRow key={s.id} session={s} t={t} navigate={navigate} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ session: s, t, navigate }) {
  const [hov, setHov] = useState(false);
  const isCompleted   = s.status === "completed";
  const statusColor   = isCompleted ? "#34d399" : "#f87171";
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => navigate(`/trainer/live/attendance/${s.id}`)}
      style={{ borderBottom: `1px solid ${t.tableBorderColor}`, background: hov ? t.tableHov : "transparent", cursor: "pointer", transition: "background 0.15s" }}>
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", flexShrink: 0 }}><Video size={14} color="#22d3ee" /></div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{s.title}</p>
            <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{s.category}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 20px" }}><p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{s.date}</p><p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{s.time}</p></td>
      <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {s.duration ?? "—"}</span></td>
      <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> <strong>{s.viewers ?? 0}</strong></span></td>
      <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30`, padding: "3px 10px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>{s.status}</span></td>
      <td style={{ padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
        {isCompleted && (
          <div style={{ display: "flex", gap: 6 }}>
            <HeroBtn label="Report" icon={FileText} color="#22d3ee" onClick={() => navigate(`/trainer/live/attendance/${s.id}`)} />
            {s.recordingUrl && <HeroBtn label="Replay" icon={Play} color="#a78bfa" onClick={() => window.open(s.recordingUrl, "_blank")} />}
          </div>
        )}
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 4 — ATTENDANCE REPORT
══════════════════════════════════════════════════ */
function PanelAttendanceReport({ t, isDark, navigate }) {
  const [attendees, setAttendees] = useState([]);
  const [report,    setReport]    = useState(null);
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    setReport({ sessionTitle: "React Live Class", date: "2026-02-19", time: "10:00 AM" });
    setAttendees([{ name: "Raghib Imam", joinTime: "10:00 AM", leaveTime: "11:00 AM", duration: "60 min", watchPercent: 95, chatMessages: 5, status: "present" }]);
  }, []);

  const handleExport = () => {
    const csv  = "data:text/csv;charset=utf-8,Name,Join Time,Leave Time,Duration,Watch %,Chat\n" + attendees.map((a) => `${a.name},${a.joinTime},${a.leaveTime},${a.duration},${a.watchPercent},${a.chatMessages}`).join("\n");
    const link = document.createElement("a"); link.href = encodeURI(csv); link.download = "attendance.csv"; document.body.appendChild(link); link.click();
  };

  const filtered       = attendees.filter((a) => a.name?.toLowerCase().includes(search.toLowerCase()));
  const completedCount = attendees.filter((a) => a.status === "present").length;
  const completionRate = attendees.length > 0 ? Math.round((completedCount / attendees.length) * 100) : 0;
  const avgWatch       = attendees.length > 0 ? Math.round(attendees.reduce((acc, a) => acc + (a.watchPercent ?? 0), 0) / attendees.length) : 0;
  const totalMessages  = attendees.reduce((acc, a) => acc + (a.chatMessages ?? 0), 0);

  const metricCards = [
    { label: "Total Attendees", value: attendees.length,    color: "#22d3ee", icon: Users         },
    { label: "Completed",       value: completedCount,      color: "#34d399", icon: CheckCircle2  },
    { label: "Completion Rate", value: `${completionRate}%`, color: "#a78bfa", icon: BarChart3    },
    { label: "Avg Watch Time",  value: `${avgWatch}%`,      color: "#f59e0b", icon: Clock         },
    { label: "Chat Messages",   value: totalMessages,       color: "#f43f5e", icon: MessageCircle },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "flex-end" }}>
        <HeroBtn label="Export CSV" icon={Download} color="#22d3ee" onClick={handleExport} />
      </div>
      {report && <p style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 16 }}>{report.sessionTitle} · {report.date} · {report.time}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
        {metricCards.map((m, i) => <AttMetricCard key={i} metric={m} t={t} index={i} />)}
      </div>
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.tableBorderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}><Users size={15} color="#a78bfa" /></div>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Attendee Details</span>
          </div>
          <input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: isDark ? "#1a1a1a" : "#f8fafc", color: t.text, fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none", width: 200 }} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.tableBorderColor}` }}>
                {["Student","Joined","Left","Duration","Watch %","Chat","Status"].map((h) => (
                  <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>{filtered.map((a, i) => <AttendeeRow key={i} attendee={a} t={t} />)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttMetricCard({ metric, t, index }) {
  const [hov, setHov] = useState(false);
  const Icon = metric.icon;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="dfade" style={{ animationDelay: `${index * 60}ms`, background: hov ? t.cardBgHov : t.cardBg, border: `1px solid ${hov ? metric.color + "30" : t.border}`, boxShadow: hov ? `0 8px 32px ${metric.color}12` : t.shadow, borderRadius: 20, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10, transition: "all 0.25s ease", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -15, right: -15, width: 70, height: 70, borderRadius: "50%", background: metric.color, filter: "blur(30px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
      <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${metric.color}18`, border: `1px solid ${metric.color}30` }}><Icon size={17} color={metric.color} /></div>
      <div>
        <p style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{metric.value}</p>
        <p style={{ fontSize: 9, marginTop: 5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "5px 0 0" }}>{metric.label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 99, background: metric.color, width: hov ? "60%" : "18%", transition: "width 0.65s ease" }} /></div>
    </div>
  );
}

function AttendeeRow({ attendee: a, t }) {
  const [hov, setHov] = useState(false);
  const cfg  = statusConfig[a.status] || statusConfig.present;
  const Icon = cfg.icon;
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderBottom: `1px solid ${t.tableBorderColor}`, background: hov ? t.tableHov : "transparent", transition: "background 0.15s" }}>
      <td style={{ padding: "13px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{(a.name||"?")[0]}</div>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.name}</span>
        </div>
      </td>
      {[a.joinTime, a.leaveTime, a.duration].map((v, i) => <td key={i} style={{ padding: "13px 18px", fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{v}</td>)}
      <td style={{ padding: "13px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ flex: 1, maxWidth: 60, height: 4, borderRadius: 99, background: t.barBg, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: a.watchPercent >= 80 ? "#34d399" : a.watchPercent >= 50 ? "#f59e0b" : "#f87171", width: `${a.watchPercent}%` }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.watchPercent}%</span>
        </div>
      </td>
      <td style={{ padding: "13px 18px", fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{a.chatMessages}</td>
      <td style={{ padding: "13px 18px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, padding: "3px 10px", borderRadius: 999, width: "fit-content", fontFamily: "'Poppins',sans-serif" }}>
          <Icon size={10} color={cfg.color} /> {cfg.label}
        </span>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 5 — UPLOAD RECORDED VIDEO
══════════════════════════════════════════════════ */
function PanelUploadRecorded({ t, isDark, navigate }) {
  const fileRef = useRef(null);
  const [file, setFile]           = useState(null);
  const [batches, setBatches]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [form, setForm]           = useState({ lectureTitle: "", shortDescription: "", batchId: "", batchName: "" });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  useEffect(() => {
    (async () => {
      try { const res = await fetch("/api/batches"); const data = await res.json(); setBatches(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith("video/")) setFile(f); };
  const handleBatchChange = (v) => { const sel = batches.find((b) => b.id === v); setForm((p) => ({ ...p, batchId: v, batchName: sel?.batchName || "" })); };

  const handleUpload = async () => {
    if (!form.lectureTitle || !form.batchId) { alert("Lecture Title and Batch are required"); return; }
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file); fd.append("title", form.lectureTitle);
      fd.append("description", form.shortDescription); fd.append("batchId", form.batchId);
      await uploadRecording(fd);
      alert("Video uploaded successfully");
      setFile(null); setForm({ lectureTitle: "", shortDescription: "", batchId: "", batchName: "" });
    } catch (err) { console.error(err); alert("Upload failed."); }
    finally { setUploading(false); }
  };

  const iStyle = inputStyle(t);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {!file ? (
        <div onClick={() => fileRef.current.click()} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          style={{ borderRadius: 20, border: `2px dashed ${dragOver ? "#2dd4bf" : t.dropBorder}`, background: dragOver ? (isDark ? "rgba(45,212,191,0.05)" : "rgba(45,212,191,0.04)") : t.dropBg, padding: "60px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: t.shadow, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ animation: "uploadFloat 2.5s ease-in-out infinite" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
              <UploadCloud size={28} color="#2dd4bf" />
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, margin: "0 0 6px" }}>Drop your video here</p>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: t.textMuted, margin: 0 }}>MP4, MOV, AVI up to 2GB</p>
          </div>
          <button style={{ padding: "9px 22px", borderRadius: 10, border: "1px solid rgba(45,212,191,0.3)", background: "rgba(45,212,191,0.1)", color: "#2dd4bf", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Select File</button>
          <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
        </div>
      ) : (
        <>
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "16px 20px", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", flexShrink: 0 }}>
              <Video size={18} color="#2dd4bf" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.shadow }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}><Video size={15} color="#2dd4bf" /></div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Video Details</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={labelStyle(t)}>Lecture Title</label><input style={iStyle} value={form.lectureTitle} onChange={(e) => set("lectureTitle", e.target.value)} placeholder="Enter lecture title..." /></div>
              <div><label style={labelStyle(t)}>Short Description</label><textarea style={{ ...iStyle, resize: "vertical", minHeight: 80 }} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="Brief description..." /></div>
              <div>
                <label style={labelStyle(t)}>Select Batch</label>
                <div style={{ position: "relative" }}>
                  <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.batchId} onChange={(e) => handleBatchChange(e.target.value)}>
                    <option value="">{loading ? "Loading batches..." : "Select a batch..."}</option>
                    {batches.map((b) => <option key={b.id} value={b.id}>{b.batchName}</option>)}
                  </select>
                  <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
          </div>
          <UploadSubmitBtn uploading={uploading} onClick={handleUpload} />
        </>
      )}
    </div>
  );
}

function UploadSubmitBtn({ uploading, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={uploading} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: uploading ? "rgba(45,212,191,0.5)" : hov ? "#14b8a6" : "#2dd4bf", color: uploading ? "rgba(255,255,255,0.7)" : "#0f172a", fontSize: 13, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", boxShadow: hov && !uploading ? "0 8px 24px rgba(45,212,191,0.35)" : "none" }}>
      <UploadCloud size={16} />{uploading ? "Uploading..." : "Upload & Publish"}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 6 — RECORDED CLASSES LIST
══════════════════════════════════════════════════ */
function PanelRecordedList({ t, isDark, navigate }) {
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/recorded-videos");
        if (!res.ok) { setVideos([]); return; }
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setVideos(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); setVideos([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = videos.filter((v) => v.title?.toLowerCase().includes(search.toLowerCase()));
  const iStyle   = inputStyle(t);

  return (
    <div>
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "12px 16px", boxShadow: t.shadow, marginBottom: 20, position: "relative" }}>
        <Search size={13} style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
        <input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...iStyle, padding: "8px 14px 8px 34px" }} />
      </div>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {[1,2,3,4,5,6].map((i) => (
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
          <div style={{ width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}><Video size={28} color={t.emptyIcon} /></div>
          <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No videos found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {filtered.map((video, i) => <VideoCard key={video.id} video={video} t={t} isDark={isDark} index={i} navigate={navigate} />)}
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, t, isDark, index, navigate }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => navigate(`/trainer/live/recorded/edit/${video.id}`)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="dfade"
      style={{ animationDelay: `${index * 50}ms`, background: hov ? t.cardBgHov : t.cardBg, border: `1px solid ${hov ? t.borderHov : t.border}`, boxShadow: hov ? `${t.shadowHov}, 0 0 40px rgba(34,197,94,0.08)` : t.shadow, borderRadius: 20, overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease" }}>
      <div style={{ position: "relative", height: 160, background: video.thumbnail ? undefined : t.thumbBg, overflow: "hidden" }}>
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(167,139,250,0.08))" : "linear-gradient(135deg,rgba(34,197,94,0.05),rgba(167,139,250,0.05))" }}>
            <Video size={32} color={t.emptyIcon} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hov ? 1 : 0, transition: "opacity 0.25s" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={18} color="#0f172a" style={{ marginLeft: 2 }} />
          </div>
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: t.text, margin: "0 0 5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.title}</h3>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: t.textMuted, margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{video.description}</p>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", padding: "3px 8px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>{video.batchName}</span>
      </div>
    </div>
  );
}

export default TrainerLiveClasses;