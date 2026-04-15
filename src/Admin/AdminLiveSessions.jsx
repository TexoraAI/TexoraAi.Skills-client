// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ArrowLeft, Calendar, CheckCircle2, Clock, Eye,
//   GripVertical, Layers, Pencil, PlayCircle, Radio,
//   Save, StopCircle, Trash2, UserCheck, Video, X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// /* ── status config ── */
// const STATUS = {
//   Active:    { dot:"bg-emerald-500", text:"text-emerald-700 dark:text-emerald-400", bg:"bg-emerald-50 dark:bg-emerald-950/50",  border:"border-emerald-200 dark:border-emerald-800", icon:PlayCircle  },
//   Completed: { dot:"bg-blue-500",    text:"text-blue-700 dark:text-blue-400",       bg:"bg-blue-50 dark:bg-blue-950/50",        border:"border-blue-200 dark:border-blue-800",       icon:CheckCircle2 },
//   Scheduled: { dot:"bg-amber-400",   text:"text-amber-700 dark:text-amber-400",     bg:"bg-amber-50 dark:bg-amber-950/50",      border:"border-amber-200 dark:border-amber-800",     icon:Clock       },
//   Ended:     { dot:"bg-slate-400",   text:"text-slate-600 dark:text-slate-400",     bg:"bg-slate-100 dark:bg-slate-800",        border:"border-slate-200 dark:border-slate-700",     icon:StopCircle  },
// };

// /* ── gradient pool ── */
// const GRADS = [
//   "from-violet-500 to-purple-600","from-cyan-500 to-blue-600",
//   "from-rose-500 to-pink-600","from-amber-500 to-orange-600",
//   "from-emerald-500 to-teal-600","from-indigo-500 to-blue-700",
// ];
// const grad = name => GRADS[(name?.charCodeAt(0) ?? 0) % GRADS.length];

// /* ══ drag-list hook ══ */
// function useDragList(items, setItems) {
//   const dI = useRef(null), oI = useRef(null);
//   const [active, setActive] = useState(null), [over, setOver] = useState(null);
//   const handlers = i => ({
//     draggable: true,
//     onDragStart: () => { dI.current = i; setActive(i); },
//     onDragOver:  e  => { e.preventDefault(); oI.current = i; setOver(i); },
//     onDrop: () => {
//       const f = dI.current, t = oI.current;
//       if (f !== null && t !== null && f !== t) {
//         const n = [...items]; const [m] = n.splice(f,1); n.splice(t,0,m); setItems(n);
//       }
//       dI.current = null; oI.current = null; setActive(null); setOver(null);
//     },
//     onDragEnd: () => { dI.current = null; oI.current = null; setActive(null); setOver(null); },
//   });
//   return { handlers, active, over };
// }

// /* ══ CRM-style resize hook ══ */
// function useResize(initialPx = 320, min = 220, max = 560) {
//   const [width, setWidth] = useState(initialPx);
//   const dragging = useRef(false);
//   const startX   = useRef(0);
//   const startW   = useRef(initialPx);

//   const onMouseDown = useCallback(e => {
//     dragging.current = true;
//     startX.current   = e.clientX;
//     startW.current   = width;
//     document.body.style.cursor    = "col-resize";
//     document.body.style.userSelect = "none";
//   }, [width]);

//   useEffect(() => {
//     const onMove = e => {
//       if (!dragging.current) return;
//       const delta = startX.current - e.clientX;
//       setWidth(Math.min(max, Math.max(min, startW.current + delta)));
//     };
//     const onUp = () => {
//       dragging.current = false;
//       document.body.style.cursor     = "";
//       document.body.style.userSelect = "";
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup",   onUp);
//     return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//   }, [min, max]);

//   return { width, onMouseDown };
// }

// /* ══════════════════════════════════════
//    MAIN
// ══════════════════════════════════════ */
// const AdminLiveSessions = () => {
//   const navigate = useNavigate();

//   /* ── active tab: "live" | "recorded" ── */
//   const [tab, setTab] = useState("live");

//   /* ── LIVE SESSIONS state ── */
//   const [sessions, setSessions]               = useState([]);
//   const [search, setSearch]                   = useState("");
//   const [panelOpen, setPanelOpen]             = useState(false);
//   const [panelMode, setPanelMode]             = useState("view");
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [editForm, setEditForm]               = useState({ title:"", trainer:"", batch:"", status:"Active" });

//   /* ── RECORDED VIDEOS state ── */
//   const [videos, setVideos]               = useState([]);
//   const [videoSearch, setVideoSearch]     = useState("");
//   const [videoPanelOpen, setVideoPanelOpen] = useState(false);
//   const [videoPanelMode, setVideoPanelMode] = useState("view");
//   const [selectedVideo, setSelectedVideo]   = useState(null);
//   const [videoEditForm, setVideoEditForm]   = useState({ title:"", trainer:"", batch:"", date:"" });

//   /* resize handle */
//   const { width: panelW, onMouseDown: startResize } = useResize(320);

//   /* ══════════════════════════════════════
//      BACKEND API CALLS
//   ══════════════════════════════════════ */

//   /* ── Fetch live sessions on mount ── */
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const res = await fetch("/api/live-sessions");
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];
//         setSessions(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Failed to fetch live sessions", error);
//         setSessions([]);
//       }
//     };
//     fetchSessions();
//   }, []);

//   /* ── Fetch recorded videos on mount ── */
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await fetch("/api/recorded-videos");
//         if (!res.ok) { setVideos([]); return; }
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];
//         setVideos(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Failed to fetch recorded videos", error);
//         setVideos([]);
//       }
//     };
//     fetchVideos();
//   }, []);

//   /* ── live handlers ── */
//   const handleView = s => { setSelectedSession(s); setPanelMode("view"); setPanelOpen(true); };
//   const handleEdit = s => { setSelectedSession(s); setEditForm({ title:s.title, trainer:s.trainer, batch:s.batch, status:s.status }); setPanelMode("edit"); setPanelOpen(true); };

//   const handleSaveEdit = async () => {
//     try {
//       const res = await fetch(`/api/live-sessions/${selectedSession.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editForm),
//       });
//       const updated = await res.json();
//       setSessions(p => p.map(s => s.id === selectedSession.id ? { ...s, ...updated } : s));
//       setSelectedSession(p => ({ ...p, ...updated }));
//       setPanelMode("view");
//     } catch (error) {
//       console.error("Failed to update session", error);
//     }
//   };

//   const handleDelete = async id => {
//     if (!window.confirm("Delete this session?")) return;
//     try {
//       await fetch(`/api/live-sessions/${id}`, { method: "DELETE" });
//       setSessions(p => p.filter(s => s.id !== id));
//       if (selectedSession?.id === id) closePanel();
//     } catch (error) {
//       console.error("Failed to delete session", error);
//     }
//   };

//   const closePanel = () => { setPanelOpen(false); setSelectedSession(null); setPanelMode("view"); };

//   /* ── video handlers ── */
//   const handleVideoView   = v => { setSelectedVideo(v); setVideoPanelMode("view"); setVideoPanelOpen(true); };
//   const handleVideoEdit   = v => { setSelectedVideo(v); setVideoEditForm({ title:v.title, trainer:v.trainer, batch:v.batch, date:v.date }); setVideoPanelMode("edit"); setVideoPanelOpen(true); };

//   const handleVideoSave = async () => {
//     try {
//       const res = await fetch(`/api/recorded-videos/${selectedVideo.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(videoEditForm),
//       });
//       const updated = await res.json();
//       setVideos(p => p.map(v => v.id === selectedVideo.id ? { ...v, ...updated } : v));
//       setSelectedVideo(p => ({ ...p, ...updated }));
//       setVideoPanelMode("view");
//     } catch (error) {
//       console.error("Failed to update video", error);
//     }
//   };

//   const handleVideoDelete = async id => {
//     if (!window.confirm("Delete this video?")) return;
//     try {
//       await fetch(`/api/recorded-videos/${id}`, { method: "DELETE" });
//       setVideos(p => p.filter(v => v.id !== id));
//       if (selectedVideo?.id === id) closeVideoPanel();
//     } catch (error) {
//       console.error("Failed to delete video", error);
//     }
//   };

//   const closeVideoPanel = () => { setVideoPanelOpen(false); setSelectedVideo(null); setVideoPanelMode("view"); };

//   const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.trainer.toLowerCase().includes(search.toLowerCase()));
//   const filteredVideos   = videos.filter(v => v.title.toLowerCase().includes(videoSearch.toLowerCase()) || v.trainer.toLowerCase().includes(videoSearch.toLowerCase()));

//   /* drag */
//   const { handlers: dragS, active: dSA, over: dSO } = useDragList(sessions, setSessions);
//   const { handlers: dragV, active: dVA, over: dVO } = useDragList(videos,   setVideos);

//   /* which panel is open */
//   const anyPanelOpen = tab === "live" ? panelOpen : videoPanelOpen;

//   /* counts */
//   const counts = {
//     Active:    sessions.filter(s=>s.status==="Active").length,
//     Completed: sessions.filter(s=>s.status==="Completed").length,
//     Scheduled: sessions.filter(s=>s.status==="Scheduled").length,
//     Ended:     sessions.filter(s=>s.status==="Ended").length,
//   };

//   /* ══════════ RENDER ══════════ */
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

//       {/* ═══ HERO ═══ */}
//       <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
//         <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//         <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
//         <div className="relative flex items-center justify-between px-6 py-5">
//           <div className="flex items-center gap-4">
//             <button onClick={() => navigate(-1)}
//               className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all">
//               <ArrowLeft className="h-4 w-4" /> Back
//             </button>
//             <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
//               {tab === "live" ? <Radio className="h-5 w-5 text-white" /> : <Video className="h-5 w-5 text-white" />}
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">
//                 {tab === "live" ? "Admin Live Sessions" : "Admin Recorded Videos"}
//               </h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">
//                 {tab === "live" ? "Monitor and manage all live sessions conducted by trainers" : "Monitor and manage all recorded sessions uploaded by trainers"}
//               </p>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//             {tab === "live"
//               ? <><Radio className="h-5 w-5 text-cyan-200"/><span className="text-sm font-semibold text-white">{sessions.length}<span className="ml-1 font-normal text-blue-100/80">Sessions</span></span></>
//               : <><Video className="h-5 w-5 text-cyan-200"/><span className="text-sm font-semibold text-white">{videos.length}<span className="ml-1 font-normal text-blue-100/80">Videos</span></span></>}
//           </div>
//         </div>
//       </div>

//       {/* ═══ TAB BAR ═══ */}
//       <div className="flex gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm w-fit">
//         <button onClick={() => setTab("live")}
//           className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
//             tab === "live"
//               ? "bg-gradient-to-r from-[#1a56db] to-[#06b6d4] text-white shadow"
//               : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
//           <Radio className="h-4 w-4" /> Admin Live Sessions
//         </button>
//         <button onClick={() => setTab("recorded")}
//           className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
//             tab === "recorded"
//               ? "bg-gradient-to-r from-[#1a56db] to-[#06b6d4] text-white shadow"
//               : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
//           <Video className="h-4 w-4" /> Admin Recorded Videos
//         </button>
//       </div>

//       {/* ═══ STAT CARDS (live only) ═══ */}
//       {tab === "live" && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { label:"Active",    count:counts.Active,    grad:"from-emerald-500 to-teal-600",  bg:"bg-emerald-50 dark:bg-emerald-950/40",  text:"text-emerald-600 dark:text-emerald-400", icon:PlayCircle   },
//             { label:"Scheduled", count:counts.Scheduled, grad:"from-amber-400 to-orange-500",  bg:"bg-amber-50 dark:bg-amber-950/40",      text:"text-amber-600 dark:text-amber-400",     icon:Clock        },
//             { label:"Completed", count:counts.Completed, grad:"from-blue-500 to-cyan-600",     bg:"bg-blue-50 dark:bg-blue-950/40",        text:"text-blue-600 dark:text-blue-400",       icon:CheckCircle2 },
//             { label:"Ended",     count:counts.Ended,     grad:"from-slate-400 to-slate-600",   bg:"bg-slate-100 dark:bg-slate-800",        text:"text-slate-600 dark:text-slate-400",     icon:StopCircle   },
//           ].map(s => { const Icon=s.icon; return (
//             <div key={s.label} className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5">
//               <div className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`}/>
//               <div className="relative flex items-start justify-between">
//                 <div>
//                   <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
//                   <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{s.count}</p>
//                 </div>
//                 <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center`}>
//                   <Icon className={`h-5 w-5 ${s.text}`}/>
//                 </div>
//               </div>
//             </div>
//           );})}
//         </div>
//       )}

//       {/* ═══ SEARCH ═══ */}
//       <div className="flex items-center justify-between gap-3">
//         <div className="relative w-72">
//           <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
//           <Input
//             placeholder={tab==="live" ? "Search sessions or trainers…" : "Search videos or trainers…"}
//             value={tab==="live" ? search : videoSearch}
//             onChange={e => tab==="live" ? setSearch(e.target.value) : setVideoSearch(e.target.value)}
//             className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm"/>
//         </div>
//         <p className="text-xs text-slate-400 flex items-center gap-1.5">
//           <GripVertical className="h-3.5 w-3.5"/> Drag rows to reorder
//         </p>
//       </div>

//       {/* ═══ MAIN LAYOUT ═══ */}
//       <div className="flex gap-0 items-start">

//         {/* ── TABLE ── */}
//         <div className="flex-1 min-w-0 transition-all duration-150">

//           {/* ══ LIVE SESSIONS TABLE ══ */}
//           {tab === "live" && (
//             <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
//               <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//                 <div>
//                   <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">All Live Sessions</CardTitle>
//                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{filteredSessions.length} record{filteredSessions.length!==1&&"s"} found</p>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
//                       <th className="pl-4 py-3 w-8"/>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Session</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Trainer</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Batch</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</th>
//                       <th className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredSessions.length===0 ? (
//                       <tr><td colSpan={7}><div className="flex flex-col items-center justify-center py-16 gap-3"><Radio className="h-7 w-7 text-slate-400"/><p className="text-sm text-slate-500">No sessions found</p></div></td></tr>
//                     ) : filteredSessions.map((s, i) => {
//                       const dh=dragS(i), isDrag=dSA===i, isOv=dSO===i&&dSA!==i, isSel=selectedSession?.id===s.id&&panelOpen;
//                       const st=STATUS[s.status]||STATUS.Ended;
//                       return (
//                         <tr key={s.id} {...dh} className={`group border-b border-slate-100 dark:border-slate-800/60 transition-all duration-150 cursor-default
//                           ${isDrag?"opacity-40 scale-[0.98] bg-slate-50 dark:bg-slate-800/50":""}
//                           ${isOv?"bg-blue-50 dark:bg-blue-950/20 border-t-2 border-t-blue-400":""}
//                           ${isSel?"bg-blue-50/70 dark:bg-blue-950/20":!isDrag&&!isOv?"hover:bg-blue-50/40 dark:hover:bg-slate-800/40":""}`}>
//                           <td className="pl-4 py-3.5 w-8"><div className="cursor-grab opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-opacity"><GripVertical className="h-4 w-4 text-slate-400"/></div></td>
//                           <td className="py-3.5 text-sm text-slate-400 font-medium">{String(i+1).padStart(2,"0")}</td>
//                           <td className="py-3.5"><div className="flex items-center gap-2.5"><div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(s.title)} flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0`}>{s.title.charAt(0)}</div><span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{s.title}</span></div></td>
//                           <td className="py-3.5"><div className="flex items-center gap-2"><div className={`h-7 w-7 rounded-full bg-gradient-to-br ${grad(s.trainer)} flex items-center justify-center text-[11px] font-bold text-white`}>{s.trainer.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><span className="text-sm text-slate-700 dark:text-slate-300">{s.trainer}</span></div></td>
//                           <td className="py-3.5"><div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-blue-400"/><span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{s.batch}</span></div></td>
//                           <td className="py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${st.text} ${st.bg} ${st.border}`}><span className={`h-1.5 w-1.5 rounded-full ${st.dot} ${s.status==="Active"?"animate-pulse":""}`}/>{s.status}</span></td>
//                           <td className="pr-6 py-3.5 text-right"><div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button onClick={()=>handleView(s)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&panelMode==="view"?"bg-blue-500 text-white":"bg-blue-50 dark:bg-blue-950/50 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"}`}><Eye className="h-3.5 w-3.5"/></button>
//                             <button onClick={()=>handleEdit(s)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&panelMode==="edit"?"bg-violet-500 text-white":"bg-violet-50 dark:bg-violet-950/50 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900"}`}><Pencil className="h-3.5 w-3.5"/></button>
//                             <button onClick={()=>handleDelete(s.id)} className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
//                           </div></td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </CardContent>
//             </Card>
//           )}

//           {/* ══ RECORDED VIDEOS TABLE ══ */}
//           {tab === "recorded" && (
//             <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
//               <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//                 <div>
//                   <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">All Recorded Videos</CardTitle>
//                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{filteredVideos.length} record{filteredVideos.length!==1&&"s"} found</p>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
//                       <th className="pl-4 py-3 w-8"/>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Video</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Trainer</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Batch</th>
//                       <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Upload Date</th>
//                       <th className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredVideos.length===0 ? (
//                       <tr><td colSpan={7}><div className="flex flex-col items-center justify-center py-16 gap-3"><Video className="h-7 w-7 text-slate-400"/><p className="text-sm text-slate-500">No videos found</p></div></td></tr>
//                     ) : filteredVideos.map((v, i) => {
//                       const dh=dragV(i), isDrag=dVA===i, isOv=dVO===i&&dVA!==i, isSel=selectedVideo?.id===v.id&&videoPanelOpen;
//                       return (
//                         <tr key={v.id} {...dh} className={`group border-b border-slate-100 dark:border-slate-800/60 transition-all duration-150 cursor-default
//                           ${isDrag?"opacity-40 scale-[0.98] bg-slate-50 dark:bg-slate-800/50":""}
//                           ${isOv?"bg-blue-50 dark:bg-blue-950/20 border-t-2 border-t-blue-400":""}
//                           ${isSel?"bg-blue-50/70 dark:bg-blue-950/20":!isDrag&&!isOv?"hover:bg-blue-50/40 dark:hover:bg-slate-800/40":""}`}>
//                           <td className="pl-4 py-3.5 w-8"><div className="cursor-grab opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-opacity"><GripVertical className="h-4 w-4 text-slate-400"/></div></td>
//                           <td className="py-3.5 text-sm text-slate-400 font-medium">{String(i+1).padStart(2,"0")}</td>
//                           <td className="py-3.5"><div className="flex items-center gap-2.5"><div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(v.title)} flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0`}>{v.title.charAt(0)}</div><span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{v.title}</span></div></td>
//                           <td className="py-3.5"><div className="flex items-center gap-2"><div className={`h-7 w-7 rounded-full bg-gradient-to-br ${grad(v.trainer)} flex items-center justify-center text-[11px] font-bold text-white`}>{v.trainer.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><span className="text-sm text-slate-700 dark:text-slate-300">{v.trainer}</span></div></td>
//                           <td className="py-3.5"><div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-blue-400"/><span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{v.batch}</span></div></td>
//                           <td className="py-3.5"><div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400"/><span className="text-sm text-slate-600 dark:text-slate-400">{v.date}</span></div></td>
//                           <td className="pr-6 py-3.5 text-right"><div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button onClick={()=>handleVideoView(v)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&videoPanelMode==="view"?"bg-blue-500 text-white":"bg-blue-50 dark:bg-blue-950/50 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"}`}><Eye className="h-3.5 w-3.5"/></button>
//                             <button onClick={()=>handleVideoEdit(v)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&videoPanelMode==="edit"?"bg-violet-500 text-white":"bg-violet-50 dark:bg-violet-950/50 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900"}`}><Pencil className="h-3.5 w-3.5"/></button>
//                             <button onClick={()=>handleVideoDelete(v.id)} className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
//                           </div></td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* ═══ CRM DRAG-RESIZE HANDLE ═══ */}
//         {anyPanelOpen && (
//           <div
//             onMouseDown={startResize}
//             className="flex-shrink-0 w-2 mx-1 self-stretch flex items-center justify-center cursor-col-resize group"
//             title="Drag to resize panel"
//           >
//             <div className="w-1 h-16 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors" />
//           </div>
//         )}

//         {/* ═══ INLINE PANEL ═══ */}
//         {anyPanelOpen && (
//           <div className="flex-shrink-0 transition-none" style={{ width: panelW }}>

//             {/* LIVE SESSION PANEL */}
//             {tab === "live" && selectedSession && (
//               <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden" style={{ width: panelW }}>
//                 <div className={`px-5 py-4 bg-gradient-to-r ${panelMode==="edit"?"from-violet-600 to-purple-500":"from-[#1a56db] to-[#06b6d4]"}`}>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                       <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(selectedSession.title)} flex items-center justify-center text-base font-bold text-white shadow-md`}>{selectedSession.title.charAt(0)}</div>
//                       <div><h2 className="text-sm font-bold text-white">{panelMode==="edit"?"Edit Session":selectedSession.title}</h2><p className="text-[11px] text-white/70 mt-0.5">{panelMode==="edit"?"Update session details":"Session Details"}</p></div>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       {panelMode==="view"&&<button onClick={()=>{setEditForm({title:selectedSession.title,trainer:selectedSession.trainer,batch:selectedSession.batch,status:selectedSession.status});setPanelMode("edit");}} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><Pencil className="h-3.5 w-3.5 text-white"/></button>}
//                       <button onClick={closePanel} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><X className="h-4 w-4 text-white"/></button>
//                     </div>
//                   </div>
//                   <div className="mt-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">{panelMode==="edit"?<Pencil className="h-3 w-3"/>:<Eye className="h-3 w-3"/>}{panelMode==="edit"?"Edit Mode":"View Mode"}</span></div>
//                 </div>
//                 <div className="p-5 space-y-3 overflow-y-auto" style={{maxHeight:"calc(100vh - 340px)"}}>
//                   {panelMode==="view" ? (
//                     <>
//                       {[{label:"Session Title",value:selectedSession.title,icon:Radio},{label:"Trainer",value:selectedSession.trainer,icon:UserCheck},{label:"Batch",value:selectedSession.batch,icon:Layers},{label:"Status",value:selectedSession.status,icon:CheckCircle2}].map(({label,value,icon:Icon})=>(
//                         <div key={label} className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3">
//                           <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0"><Icon className="h-4 w-4 text-blue-500"/></div>
//                           <div className="min-w-0"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">{value}</p></div>
//                         </div>
//                       ))}
//                     </>
//                   ) : (
//                     <div className="space-y-3">
//                       {[{key:"title",label:"Session Title",icon:Radio,placeholder:"e.g. React Live Class",type:"text"},{key:"trainer",label:"Trainer Name",icon:UserCheck,placeholder:"e.g. John Doe",type:"text"},{key:"batch",label:"Batch",icon:Layers,placeholder:"e.g. Batch A",type:"text"}].map(({key,label,icon:Icon,placeholder,type})=>(
//                         <div key={key} className="space-y-1.5">
//                           <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Icon className="h-3 w-3"/>{label}</label>
//                           <Input type={type} placeholder={placeholder} value={editForm[key]} onChange={e=>setEditForm(f=>({...f,[key]:e.target.value}))} className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"/>
//                         </div>
//                       ))}
//                       <div className="space-y-1.5">
//                         <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3"/>Status</label>
//                         <select value={editForm.status} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))} className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
//                           {["Active","Scheduled","Completed","Ended"].map(s=><option key={s} value={s}>{s}</option>)}
//                         </select>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
//                   {panelMode==="view" ? (
//                     <><button onClick={closePanel} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
//                     <button onClick={()=>handleDelete(selectedSession.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow hover:opacity-90 transition-all"><Trash2 className="h-3.5 w-3.5"/>Delete</button></>
//                   ) : (
//                     <><button onClick={()=>setPanelMode("view")} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
//                     <button onClick={handleSaveEdit} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-500 shadow hover:opacity-90 hover:scale-105 transition-all"><Save className="h-3.5 w-3.5"/>Save Changes</button></>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* RECORDED VIDEO PANEL */}
//             {tab === "recorded" && selectedVideo && (
//               <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden" style={{ width: panelW }}>
//                 <div className={`px-5 py-4 bg-gradient-to-r ${videoPanelMode==="edit"?"from-violet-600 to-purple-500":"from-[#1a56db] to-[#06b6d4]"}`}>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                       <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(selectedVideo.title)} flex items-center justify-center text-base font-bold text-white shadow-md`}>{selectedVideo.title.charAt(0)}</div>
//                       <div><h2 className="text-sm font-bold text-white">{videoPanelMode==="edit"?"Edit Video":selectedVideo.title}</h2><p className="text-[11px] text-white/70 mt-0.5">{videoPanelMode==="edit"?"Update video details":"Video Details"}</p></div>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       {videoPanelMode==="view"&&<button onClick={()=>{setVideoEditForm({title:selectedVideo.title,trainer:selectedVideo.trainer,batch:selectedVideo.batch,date:selectedVideo.date});setVideoPanelMode("edit");}} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><Pencil className="h-3.5 w-3.5 text-white"/></button>}
//                       <button onClick={closeVideoPanel} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><X className="h-4 w-4 text-white"/></button>
//                     </div>
//                   </div>
//                   <div className="mt-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">{videoPanelMode==="edit"?<Pencil className="h-3 w-3"/>:<Eye className="h-3 w-3"/>}{videoPanelMode==="edit"?"Edit Mode":"View Mode"}</span></div>
//                 </div>
//                 <div className="p-5 space-y-3 overflow-y-auto" style={{maxHeight:"calc(100vh - 340px)"}}>
//                   {videoPanelMode==="view" ? (
//                     <>
//                       {[{label:"Video Title",value:selectedVideo.title,icon:Video},{label:"Trainer",value:selectedVideo.trainer,icon:UserCheck},{label:"Batch",value:selectedVideo.batch,icon:Layers},{label:"Upload Date",value:selectedVideo.date,icon:Calendar}].map(({label,value,icon:Icon})=>(
//                         <div key={label} className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3">
//                           <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0"><Icon className="h-4 w-4 text-blue-500"/></div>
//                           <div className="min-w-0"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">{value}</p></div>
//                         </div>
//                       ))}
//                     </>
//                   ) : (
//                     <div className="space-y-3">
//                       {[{key:"title",label:"Video Title",icon:Video,placeholder:"e.g. React Hooks Explained",type:"text"},{key:"trainer",label:"Trainer Name",icon:UserCheck,placeholder:"e.g. John Doe",type:"text"},{key:"batch",label:"Batch",icon:Layers,placeholder:"e.g. Batch A",type:"text"},{key:"date",label:"Upload Date",icon:Calendar,placeholder:"YYYY-MM-DD",type:"date"}].map(({key,label,icon:Icon,placeholder,type})=>(
//                         <div key={key} className="space-y-1.5">
//                           <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Icon className="h-3 w-3"/>{label}</label>
//                           <Input type={type} placeholder={placeholder} value={videoEditForm[key]} onChange={e=>setVideoEditForm(f=>({...f,[key]:e.target.value}))} className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"/>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
//                   {videoPanelMode==="view" ? (
//                     <><button onClick={closeVideoPanel} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
//                     <button onClick={()=>handleVideoDelete(selectedVideo.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow hover:opacity-90 transition-all"><Trash2 className="h-3.5 w-3.5"/>Delete</button></>
//                   ) : (
//                     <><button onClick={()=>setVideoPanelMode("view")} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
//                     <button onClick={handleVideoSave} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-500 shadow hover:opacity-90 hover:scale-105 transition-all"><Save className="h-3.5 w-3.5"/>Save Changes</button></>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminLiveSessions;



















import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Calendar, CheckCircle2, Clock, Eye,
  GripVertical, Layers, Pencil, PlayCircle, Radio,
  Save, StopCircle, Trash2, UserCheck, Video, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.al-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.al{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.al-inner{max-width:1400px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
/* header */
.al-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.al-hdr-l{display:flex;align-items:center;gap:14px;}
.al-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.al-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.al-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.al-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.al-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.al-sub{font-size:13px;color:var(--mu);margin:0;}
.al-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}
/* tabs */
.al-tabs{display:flex;gap:4px;padding:4px;background:var(--card);border:1px solid var(--bd);border-radius:14px;box-shadow:var(--sh);width:fit-content;}
.al-tab{display:flex;align-items:center;gap:6px;padding:9px 20px;border-radius:10px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap;}
.al-tab.on{background:var(--c1);color:#0a0a0a;}
.al-tab:not(.on){background:transparent;color:var(--mu);}
.al-tab:not(.on):hover{background:rgba(34,211,238,.06);color:var(--c1);}
/* stat cards */
.al-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;}
.al-stat{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px;box-shadow:var(--sh);display:flex;align-items:center;gap:12px;position:relative;overflow:hidden;}
.al-stat::before{content:"";position:absolute;right:-10px;top:-10px;width:56px;height:56px;border-radius:50%;opacity:.08;background:var(--stat-color);}
.al-stat-ico{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.al-stat-val{font-size:22px;font-weight:800;line-height:1;margin-bottom:3px;color:var(--tx);}
.al-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);}
/* search bar */
.al-sbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.al-sw{position:relative;}
.al-sw svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.al-sw input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.al-sw input::placeholder{color:var(--mu);}
.al-sw input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.al-drag-hint{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
/* main layout */
.al-main{display:flex;gap:0;align-items:flex-start;}
/* table card */
.al-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;flex:1;min-width:0;}
.al-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.al-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.al-thead-sub{font-size:11px;color:var(--mu);margin:0;}
table.al-t{width:100%;border-collapse:collapse;font-size:13px;}
.al-t thead th{padding:11px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.al-t thead th:first-child{padding-left:16px;width:36px;}
.al-t thead th:last-child{text-align:right;padding-right:20px;}
.al-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.al-t tbody tr:last-child{border-bottom:none;}
.al-t tbody tr:hover{background:rgba(34,211,238,.025);}
.al-t tbody tr.is-drag{opacity:.4;transform:scale(.98);}
.al-t tbody tr.is-over{background:rgba(34,211,238,.06);box-shadow:inset 0 2px 0 var(--c1);}
.al-t tbody tr.is-sel{background:rgba(34,211,238,.04);}
.al-t tbody td{padding:12px;vertical-align:middle;}
.al-t tbody td:first-child{padding-left:16px;}
.al-t tbody td:last-child{padding-right:20px;text-align:right;}
.al-grip{opacity:0;transition:opacity .15s;cursor:grab;padding:4px;border-radius:8px;color:var(--mu);}
.al-t tbody tr:hover .al-grip{opacity:1;}
.al-idx{font-size:12px;font-weight:700;color:var(--mu);}
.al-sess-cell{display:flex;align-items:center;gap:10px;}
.al-av{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0;}
.al-av-sm{width:28px;height:28px;border-radius:8px;font-size:11px;font-weight:800;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.al-sess-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;}
.al-t tbody tr:hover .al-sess-name{color:var(--c1);}
.al-trainer-cell{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mu);}
.al-batch-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.18);color:var(--c1);}
.al-status-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.al-actions{display:flex;justify-content:flex-end;gap:5px;opacity:0;transition:opacity .15s;}
.al-t tbody tr:hover .al-actions{opacity:1;}
.al-abtn{width:30px;height:30px;border-radius:9px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
/* empty */
.al-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:10px;text-align:center;}
.al-empty-ico{width:52px;height:52px;border-radius:15px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.al-empty-t{font-size:13px;font-weight:700;color:var(--mu);margin:0;}
/* resize handle */
.al-resize{flex-shrink:0;width:12px;margin:0 2px;display:flex;align-items:center;justify-content:center;cursor:col-resize;}
.al-resize-pill{width:3px;height:48px;border-radius:4px;background:var(--bd);transition:background .2s;}
.al-resize:hover .al-resize-pill{background:var(--c1);}
/* side panel */
.al-panel{flex-shrink:0;background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--shl);overflow:hidden;}
.al-panel-head{padding:18px 20px;border-bottom:1px solid var(--bd);}
.al-panel-head.view{background:rgba(34,211,238,.06);}
.al-panel-head.edit{background:rgba(167,139,250,.06);}
.al-panel-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.al-panel-head-l{display:flex;align-items:center;gap:10px;}
.al-panel-av{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0;}
.al-panel-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.al-panel-sub{font-size:11px;color:var(--mu);margin:0;}
.al-panel-actions{display:flex;gap:5px;}
.al-panel-ico-btn{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.al-panel-ico-btn:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.al-panel-ico-btn.del:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.al-mode-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.al-mode-view{background:rgba(34,211,238,.08);color:var(--c1);border-color:rgba(34,211,238,.20);}
.al-mode-edit{background:rgba(167,139,250,.08);color:var(--c4);border-color:rgba(167,139,250,.20);}
.al-panel-body{padding:18px 20px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}
.al-detail-row{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
.al-detail-ico{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(34,211,238,.10);color:var(--c1);}
.al-detail-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin:0 0 3px;}
.al-detail-val{font-size:13px;font-weight:700;color:var(--tx);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.al-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.al-inp{width:100%;padding:9px 12px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.al-inp:focus{border-color:var(--c4);box-shadow:0 0 0 3px rgba(167,139,250,.12);}
.al-inp::placeholder{color:var(--mu);}
.al-panel-foot{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid var(--bd);}
.al-foot-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:12px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
.al-foot-btn:hover{opacity:.87;transform:translateY(-1px);}
.al-foot-btn.cancel{background:var(--bg);border:1px solid var(--bd)!important;color:var(--mu);}
.al-foot-btn.cancel:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.al-foot-btn.save{background:var(--c4);color:#0a0a0a;}
.al-foot-btn.del-btn{background:rgba(248,113,113,.10);border:1px solid rgba(248,113,113,.20)!important;color:var(--cr);}
.al-foot-btn.del-btn:hover{background:rgba(248,113,113,.18);}
`;
if(!document.getElementById("al-st")){const t=document.createElement("style");t.id="al-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const STATUS_CFG={
  Active:   {bg:"rgba(52,211,153,.10)", color:"var(--c3)", bd:"rgba(52,211,153,.20)", dot:"#34d399"},
  Completed:{bg:"rgba(34,211,238,.10)", color:"var(--c1)", bd:"rgba(34,211,238,.20)", dot:"#22d3ee"},
  Scheduled:{bg:"rgba(251,146,60,.10)", color:"var(--c2)", bd:"rgba(251,146,60,.20)", dot:"#fb923c"},
  Ended:    {bg:"rgba(100,116,139,.10)",color:"var(--mu)", bd:"var(--bd)",            dot:"#64748b"},
};
const GRAD_BG=["linear-gradient(135deg,#6d28d9,#4338ca)","linear-gradient(135deg,#0891b2,#0e7490)","linear-gradient(135deg,#be123c,#9f1239)","linear-gradient(135deg,#b45309,#92400e)","linear-gradient(135deg,#047857,#065f46)","linear-gradient(135deg,#1d4ed8,#1e40af)"];
const gradBg=n=>GRAD_BG[(n?.charCodeAt(0)??0)%GRAD_BG.length];

function useDragList(items,setItems){
  const dI=useRef(null),oI=useRef(null);
  const[active,setActive]=useState(null),[over,setOver]=useState(null);
  const handlers=i=>({draggable:true,onDragStart:()=>{dI.current=i;setActive(i);},onDragOver:e=>{e.preventDefault();oI.current=i;setOver(i);},onDrop:()=>{const f=dI.current,t=oI.current;if(f!==null&&t!==null&&f!==t){const n=[...items];const[m]=n.splice(f,1);n.splice(t,0,m);setItems(n);}dI.current=null;oI.current=null;setActive(null);setOver(null);},onDragEnd:()=>{dI.current=null;oI.current=null;setActive(null);setOver(null);}});
  return{handlers,active,over};
}
function useResize(init=320,min=220,max=560){
  const[width,setWidth]=useState(init);const dragging=useRef(false);const startX=useRef(0);const startW=useRef(init);
  const onMouseDown=useCallback(e=>{dragging.current=true;startX.current=e.clientX;startW.current=width;document.body.style.cursor="col-resize";document.body.style.userSelect="none";},[width]);
  useEffect(()=>{const onMove=e=>{if(!dragging.current)return;const d=startX.current-e.clientX;setWidth(Math.min(max,Math.max(min,startW.current+d)));};const onUp=()=>{dragging.current=false;document.body.style.cursor="";document.body.style.userSelect="";};window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);};},[min,max]);
  return{width,onMouseDown};
}

const AdminLiveSessions=()=>{
  const navigate=useNavigate();
  const[dark,setDark]=useState(isDark);
  const[tab,setTab]=useState("live");
  const[sessions,setSessions]=useState([]);
  const[search,setSearch]=useState("");
  const[panelOpen,setPanelOpen]=useState(false);
  const[panelMode,setPanelMode]=useState("view");
  const[selectedSession,setSelectedSession]=useState(null);
  const[editForm,setEditForm]=useState({title:"",trainer:"",batch:"",status:"Active"});
  const[videos,setVideos]=useState([]);
  const[videoSearch,setVideoSearch]=useState("");
  const[videoPanelOpen,setVideoPanelOpen]=useState(false);
  const[videoPanelMode,setVideoPanelMode]=useState("view");
  const[selectedVideo,setSelectedVideo]=useState(null);
  const[videoEditForm,setVideoEditForm]=useState({title:"",trainer:"",batch:"",date:""});
  const{width:panelW,onMouseDown:startResize}=useResize(320);

  useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);

  useEffect(()=>{const f=async()=>{try{const r=await fetch("/api/live-sessions");const t=await r.text();const d=t?JSON.parse(t):[];setSessions(Array.isArray(d)?d:[]);}catch(e){console.error(e);setSessions([]); }};f();},[]);
  useEffect(()=>{const f=async()=>{try{const r=await fetch("/api/recorded-videos");if(!r.ok){setVideos([]);return;}const t=await r.text();const d=t?JSON.parse(t):[];setVideos(Array.isArray(d)?d:[]);}catch(e){console.error(e);setVideos([]);}};f();},[]);

  const handleView=s=>{setSelectedSession(s);setPanelMode("view");setPanelOpen(true);};
  const handleEdit=s=>{setSelectedSession(s);setEditForm({title:s.title,trainer:s.trainer,batch:s.batch,status:s.status});setPanelMode("edit");setPanelOpen(true);};
  const handleSaveEdit=async()=>{try{const r=await fetch(`/api/live-sessions/${selectedSession.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editForm)});const u=await r.json();setSessions(p=>p.map(s=>s.id===selectedSession.id?{...s,...u}:s));setSelectedSession(p=>({...p,...u}));setPanelMode("view");}catch(e){console.error(e);}};
  const handleDelete=async id=>{if(!window.confirm("Delete this session?"))return;try{await fetch(`/api/live-sessions/${id}`,{method:"DELETE"});setSessions(p=>p.filter(s=>s.id!==id));if(selectedSession?.id===id)closePanel();}catch(e){console.error(e);}};
  const closePanel=()=>{setPanelOpen(false);setSelectedSession(null);setPanelMode("view");};
  const handleVideoView=v=>{setSelectedVideo(v);setVideoPanelMode("view");setVideoPanelOpen(true);};
  const handleVideoEdit=v=>{setSelectedVideo(v);setVideoEditForm({title:v.title,trainer:v.trainer,batch:v.batch,date:v.date});setVideoPanelMode("edit");setVideoPanelOpen(true);};
  const handleVideoSave=async()=>{try{const r=await fetch(`/api/recorded-videos/${selectedVideo.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(videoEditForm)});const u=await r.json();setVideos(p=>p.map(v=>v.id===selectedVideo.id?{...v,...u}:v));setSelectedVideo(p=>({...p,...u}));setVideoPanelMode("view");}catch(e){console.error(e);}};
  const handleVideoDelete=async id=>{if(!window.confirm("Delete this video?"))return;try{await fetch(`/api/recorded-videos/${id}`,{method:"DELETE"});setVideos(p=>p.filter(v=>v.id!==id));if(selectedVideo?.id===id)closeVideoPanel();}catch(e){console.error(e);}};
  const closeVideoPanel=()=>{setVideoPanelOpen(false);setSelectedVideo(null);setVideoPanelMode("view");};

  const filteredSessions=sessions.filter(s=>s.title.toLowerCase().includes(search.toLowerCase())||s.trainer.toLowerCase().includes(search.toLowerCase()));
  const filteredVideos=videos.filter(v=>v.title.toLowerCase().includes(videoSearch.toLowerCase())||v.trainer.toLowerCase().includes(videoSearch.toLowerCase()));
  const{handlers:dragS,active:dSA,over:dSO}=useDragList(sessions,setSessions);
  const{handlers:dragV,active:dVA,over:dVO}=useDragList(videos,setVideos);
  const anyPanelOpen=tab==="live"?panelOpen:videoPanelOpen;
  const counts={Active:sessions.filter(s=>s.status==="Active").length,Completed:sessions.filter(s=>s.status==="Completed").length,Scheduled:sessions.filter(s=>s.status==="Scheduled").length,Ended:sessions.filter(s=>s.status==="Ended").length};

  const statCards=[
    {label:"Active",   count:counts.Active,    icon:<PlayCircle size={18}/>,   accent:"var(--c3)", bg:"rgba(52,211,153,.10)"},
    {label:"Scheduled",count:counts.Scheduled, icon:<Clock size={18}/>,        accent:"var(--c2)", bg:"rgba(251,146,60,.10)"},
    {label:"Completed",count:counts.Completed, icon:<CheckCircle2 size={18}/>, accent:"var(--c1)", bg:"rgba(34,211,238,.10)"},
    {label:"Ended",    count:counts.Ended,     icon:<StopCircle size={18}/>,   accent:"var(--mu)", bg:"rgba(100,116,139,.10)"},
  ];

  const renderTable=(rows,isVideo)=>{
    const cols=isVideo?["#","Video","Trainer","Batch","Upload Date","Actions"]:["#","Session","Trainer","Batch","Status","Actions"];
    const dh=isVideo?dragV:dragS;const dA=isVideo?dVA:dSA;const dO=isVideo?dVO:dSO;
    const selId=isVideo?selectedVideo?.id:selectedSession?.id;const panOpen=isVideo?videoPanelOpen:panelOpen;
    return(
      <table className="al-t">
        <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.length===0?(
            <tr><td colSpan={6}>
              <div className="al-empty">
                <div className="al-empty-ico">{isVideo?<Video size={24}/>:<Radio size={24}/>}</div>
                <p className="al-empty-t">No {isVideo?"videos":"sessions"} found</p>
              </div>
            </td></tr>
          ):rows.map((item,i)=>{
            const handlers=dh(i);const isDrag=dA===i;const isOver=dO===i&&dA!==i;const isSel=selId===item.id&&panOpen;
            const st=STATUS_CFG[item.status]||STATUS_CFG.Ended;
            return(
              <tr key={item.id}{...handlers} className={`${isDrag?"is-drag":""}${isOver?" is-over":""}${isSel?" is-sel":""}`}>
                <td><div className="al-grip"><GripVertical size={15}/></div></td>
                <td><span className="al-idx">{String(i+1).padStart(2,"0")}</span></td>
                <td>
                  <div className="al-sess-cell">
                    <div className="al-av" style={{background:gradBg(item.title)}}>{item.title.charAt(0)}</div>
                    <span className="al-sess-name">{item.title}</span>
                  </div>
                </td>
                <td>
                  <div className="al-trainer-cell">
                    <div className="al-av-sm" style={{background:gradBg(item.trainer)}}>{item.trainer.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                    {item.trainer}
                  </div>
                </td>
                <td><span className="al-batch-tag"><Layers size={11}/>{item.batch}</span></td>
                {!isVideo?(
                  <td><span className="al-status-tag" style={{background:st.bg,color:st.color,borderColor:st.bd}}><span style={{width:6,height:6,borderRadius:"50%",background:st.dot,display:"inline-block",animation:item.status==="Active"?"al-blink 1.4s infinite":""}}/>  {item.status}</span></td>
                ):(
                  <td><div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--mu)"}}><Calendar size={12}/>{item.date}</div></td>
                )}
                <td>
                  <div className="al-actions">
                    <button className="al-abtn" style={{background:isSel&&(isVideo?videoPanelMode:panelMode)==="view"?"var(--c1)":"rgba(34,211,238,.10)",color:isSel&&(isVideo?videoPanelMode:panelMode)==="view"?"#0a0a0a":"var(--c1)"}} onClick={()=>isVideo?handleVideoView(item):handleView(item)}><Eye size={13}/></button>
                    <button className="al-abtn" style={{background:isSel&&(isVideo?videoPanelMode:panelMode)==="edit"?"var(--c4)":"rgba(167,139,250,.10)",color:isSel&&(isVideo?videoPanelMode:panelMode)==="edit"?"#0a0a0a":"var(--c4)"}} onClick={()=>isVideo?handleVideoEdit(item):handleEdit(item)}><Pencil size={13}/></button>
                    <button className="al-abtn" style={{background:"rgba(248,113,113,.10)",color:"var(--cr)"}} onClick={()=>isVideo?handleVideoDelete(item.id):handleDelete(item.id)}><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderPanel=(sel,mode,setMode,form,setForm,onSave,onClose,onDel,isVideo)=>{
    if(!sel)return null;
    const isEdit=mode==="edit";
    const fields=isVideo?[{k:"title",l:"Video Title",ico:Video},{k:"trainer",l:"Trainer",ico:UserCheck},{k:"batch",l:"Batch",ico:Layers},{k:"date",l:"Upload Date",ico:Calendar,type:"date"}]:[{k:"title",l:"Session Title",ico:Radio},{k:"trainer",l:"Trainer",ico:UserCheck},{k:"batch",l:"Batch",ico:Layers}];
    return(
      <div className="al-panel" style={{width:panelW}}>
        <div className={`al-panel-head ${isEdit?"edit":"view"}`}>
          <div className="al-panel-head-row">
            <div className="al-panel-head-l">
              <div className="al-panel-av" style={{background:gradBg(sel.title)}}>{sel.title.charAt(0)}</div>
              <div>
                <p className="al-panel-title">{isEdit?`Edit ${isVideo?"Video":"Session"}`:sel.title}</p>
                <p className="al-panel-sub">{isEdit?"Update details":"Details"}</p>
              </div>
            </div>
            <div className="al-panel-actions">
              {!isEdit&&<button className="al-panel-ico-btn" onClick={()=>{setForm(isVideo?{title:sel.title,trainer:sel.trainer,batch:sel.batch,date:sel.date}:{title:sel.title,trainer:sel.trainer,batch:sel.batch,status:sel.status});setMode("edit");}}><Pencil size={13}/></button>}
              <button className="al-panel-ico-btn del" onClick={onClose}><X size={14}/></button>
            </div>
          </div>
          <span className={`al-mode-tag ${isEdit?"al-mode-edit":"al-mode-view"}`}>{isEdit?<Pencil size={11}/>:<Eye size={11}/>}{isEdit?"Edit Mode":"View Mode"}</span>
        </div>
        <div className="al-panel-body" style={{maxHeight:"calc(100vh - 360px)"}}>
          {!isEdit?(
            fields.map(({k,l,ico:Icon})=>(
              <div key={k} className="al-detail-row">
                <div className="al-detail-ico"><Icon size={15}/></div>
                <div style={{minWidth:0}}><p className="al-detail-lbl">{l}</p><p className="al-detail-val">{sel[k]||"—"}</p></div>
              </div>
            ))
          ):(
            <>
              {fields.map(({k,l,ico:Icon,type="text"})=>(
                <div key={k} className="al-field">
                  <label><Icon size={11}/>{l}</label>
                  <input className="al-inp" type={type} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={l}/>
                </div>
              ))}
              {!isVideo&&(
                <div className="al-field">
                  <label><CheckCircle2 size={11}/>Status</label>
                  <select className="al-inp" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                    {["Active","Scheduled","Completed","Ended"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
        <div className="al-panel-foot">
          {!isEdit?(
            <>
              <button className="al-foot-btn cancel" onClick={onClose}>Close</button>
              <button className="al-foot-btn del-btn" onClick={()=>onDel(sel.id)}><Trash2 size={13}/>Delete</button>
            </>
          ):(
            <>
              <button className="al-foot-btn cancel" onClick={()=>setMode("view")}>Cancel</button>
              <button className="al-foot-btn save" onClick={onSave}><Save size={13}/>Save Changes</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return(
    <div className={`al${dark?" al-dk":""}`}>
      <style>{`@keyframes al-blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      <div className="al-inner">
        {/* header */}
        <div className="al-hdr">
          <div className="al-hdr-l">
            <button className="al-back" onClick={()=>navigate(-1)}><ArrowLeft size={14}/> Back</button>
            <div className="al-hdr-ico">{tab==="live"?<Radio size={24}/>:<Video size={24}/>}</div>
            <div>
              <div className="al-bdg">{tab==="live"?<Radio size={10}/>:<Video size={10}/>} {tab==="live"?"Live Sessions":"Recorded Videos"}</div>
              <h1 className="al-h1">{tab==="live"?"Admin Live Sessions":"Admin Recorded Videos"}</h1>
              <p className="al-sub">{tab==="live"?"Monitor and manage all live sessions conducted by trainers":"Monitor and manage all recorded sessions uploaded by trainers"}</p>
            </div>
          </div>
          <div className="al-chip">
            {tab==="live"?<Radio size={14} style={{color:"var(--cr)"}}/>:<Video size={14} style={{color:"var(--c4)"}}/>}
            <span style={{fontWeight:800,color:tab==="live"?"var(--cr)":"var(--c4)"}}>{tab==="live"?sessions.length:videos.length}</span>
            <span style={{color:"var(--mu)",fontWeight:500}}>{tab==="live"?"Sessions":"Videos"}</span>
          </div>
        </div>

        {/* tabs */}
        <div className="al-tabs">
          <button className={`al-tab${tab==="live"?" on":""}`} onClick={()=>setTab("live")}><Radio size={13}/> Admin Live Sessions</button>
          <button className={`al-tab${tab==="recorded"?" on":""}`} onClick={()=>setTab("recorded")}><Video size={13}/> Admin Recorded Videos</button>
        </div>

        {/* stat cards (live only) */}
        {tab==="live"&&(
          <div className="al-stats">
            {statCards.map(s=>(
              <div key={s.label} className="al-stat">
                <div className="al-stat-ico" style={{background:s.bg,color:s.accent}}>{s.icon}</div>
                <div><div className="al-stat-val" style={{color:s.accent}}>{s.count}</div><div className="al-stat-lbl">{s.label}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* search */}
        <div className="al-sbar">
          <div className="al-sw">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder={tab==="live"?"Search sessions or trainers…":"Search videos or trainers…"} value={tab==="live"?search:videoSearch} onChange={e=>tab==="live"?setSearch(e.target.value):setVideoSearch(e.target.value)}/>
          </div>
          <div className="al-drag-hint"><GripVertical size={13}/> Drag rows to reorder</div>
        </div>

        {/* main */}
        <div className="al-main">
          <div className="al-tcard">
            <div className="al-thead-row">
              <div>
                <p className="al-thead-title">{tab==="live"?"All Live Sessions":"All Recorded Videos"}</p>
                <p className="al-thead-sub">{(tab==="live"?filteredSessions:filteredVideos).length} record{(tab==="live"?filteredSessions:filteredVideos).length!==1&&"s"} found</p>
              </div>
            </div>
            {tab==="live"?renderTable(filteredSessions,false):renderTable(filteredVideos,true)}
          </div>

          {anyPanelOpen&&(
            <div className="al-resize" onMouseDown={startResize}><div className="al-resize-pill"/></div>
          )}

          {anyPanelOpen&&(
            <div style={{flexShrink:0}}>
              {tab==="live"&&renderPanel(selectedSession,panelMode,setPanelMode,editForm,setEditForm,handleSaveEdit,closePanel,handleDelete,false)}
              {tab==="recorded"&&renderPanel(selectedVideo,videoPanelMode,setVideoPanelMode,videoEditForm,setVideoEditForm,handleVideoSave,closeVideoPanel,handleVideoDelete,true)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminLiveSessions;