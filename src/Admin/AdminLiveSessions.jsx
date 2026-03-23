

// import React, { useEffect, useState } from "react";
// import { Radio, Trash2, Eye } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const AdminLiveSessions = () => {
//   const [sessions, setSessions] = useState([]);
//   const [selectedSession, setSelectedSession] = useState(null);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const res = await fetch("/api/live-sessions");

//         const data = await res.json();

//         setSessions(data);
//       } catch (error) {
//         console.error("Failed to fetch live sessions", error);
//       }
//     };

//     fetchSessions();
//   }, []);

//   const handleView = (session) => {
//     setSelectedSession(session);
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete?");

//     if (!confirmDelete) return;

//     try {
//       await fetch(`/api/live-sessions/${id}`, {
//         method: "DELETE",
//       });

//       setSessions((prev) => prev.filter((s) => s.id !== id));
//     } catch (error) {
//       console.error("Delete failed", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}

//       <div className="mb-6">
//         <div
//           className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 
//                         text-white p-6 rounded-2xl shadow-lg"
//         >
//           <div className="flex items-center gap-3">
//             <Radio size={28} />
//             <div>
//               <h1 className="text-2xl font-semibold">Admin Live Sessions</h1>
//               <p className="text-sm opacity-90 mt-1">
//                 Monitor and manage all live sessions conducted by trainers
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-4">
//           <table className="w-full text-sm">
//             <thead className="border-b">
//               <tr className="text-left">
//                 <th className="p-2">Title</th>
//                 <th className="p-2">Trainer</th>
//                 <th className="p-2">Batch</th>
//                 <th className="p-2">Status</th>
//                 <th className="p-2">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {sessions.map((session) => (
//                 <tr
//                   key={session.id}
//                   className="border-b hover:bg-gray-50 dark:hover:bg-white/5"
//                 >
//                   <td className="p-2">{session.title}</td>
//                   <td className="p-2">{session.trainer}</td>
//                   <td className="p-2">{session.batch}</td>
//                   <td className="p-2">{session.status}</td>

//                   <td className="p-2 flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleView(session)}
//                     >
//                       <Eye size={16} />
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => handleDelete(session.id)}
//                     >
//                       <Trash2 size={16} />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>

//       {/* Modal */}

//       {selectedSession && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-[#1F2937] p-6 rounded-xl w-96 shadow-xl">
//             <h2 className="text-lg font-semibold mb-4">Live Session Details</h2>

//             <p>
//               <strong>Title:</strong> {selectedSession.title}
//             </p>
//             <p>
//               <strong>Trainer:</strong> {selectedSession.trainer}
//             </p>
//             <p>
//               <strong>Batch:</strong> {selectedSession.batch}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedSession.status}
//             </p>

//             <div className="flex justify-end mt-4">
//               <Button onClick={() => setSelectedSession(null)}>Close</Button>
//             </div>
//           </div>
//         </div>
//       )}
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ── status config ── */
const STATUS = {
  Active:    { dot:"bg-emerald-500", text:"text-emerald-700 dark:text-emerald-400", bg:"bg-emerald-50 dark:bg-emerald-950/50",  border:"border-emerald-200 dark:border-emerald-800", icon:PlayCircle  },
  Completed: { dot:"bg-blue-500",    text:"text-blue-700 dark:text-blue-400",       bg:"bg-blue-50 dark:bg-blue-950/50",        border:"border-blue-200 dark:border-blue-800",       icon:CheckCircle2 },
  Scheduled: { dot:"bg-amber-400",   text:"text-amber-700 dark:text-amber-400",     bg:"bg-amber-50 dark:bg-amber-950/50",      border:"border-amber-200 dark:border-amber-800",     icon:Clock       },
  Ended:     { dot:"bg-slate-400",   text:"text-slate-600 dark:text-slate-400",     bg:"bg-slate-100 dark:bg-slate-800",        border:"border-slate-200 dark:border-slate-700",     icon:StopCircle  },
};

/* ── gradient pool ── */
const GRADS = [
  "from-violet-500 to-purple-600","from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600","from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600","from-indigo-500 to-blue-700",
];
const grad = name => GRADS[(name?.charCodeAt(0) ?? 0) % GRADS.length];

/* ══ drag-list hook ══ */
function useDragList(items, setItems) {
  const dI = useRef(null), oI = useRef(null);
  const [active, setActive] = useState(null), [over, setOver] = useState(null);
  const handlers = i => ({
    draggable: true,
    onDragStart: () => { dI.current = i; setActive(i); },
    onDragOver:  e  => { e.preventDefault(); oI.current = i; setOver(i); },
    onDrop: () => {
      const f = dI.current, t = oI.current;
      if (f !== null && t !== null && f !== t) {
        const n = [...items]; const [m] = n.splice(f,1); n.splice(t,0,m); setItems(n);
      }
      dI.current = null; oI.current = null; setActive(null); setOver(null);
    },
    onDragEnd: () => { dI.current = null; oI.current = null; setActive(null); setOver(null); },
  });
  return { handlers, active, over };
}

/* ══ CRM-style resize hook ══ */
function useResize(initialPx = 320, min = 220, max = 560) {
  const [width, setWidth] = useState(initialPx);
  const dragging = useRef(false);
  const startX   = useRef(0);
  const startW   = useRef(initialPx);

  const onMouseDown = useCallback(e => {
    dragging.current = true;
    startX.current   = e.clientX;
    startW.current   = width;
    document.body.style.cursor    = "col-resize";
    document.body.style.userSelect = "none";
  }, [width]);

  useEffect(() => {
    const onMove = e => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      setWidth(Math.min(max, Math.max(min, startW.current + delta)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [min, max]);

  return { width, onMouseDown };
}

/* ══════════════════════════════════════
   MAIN
══════════════════════════════════════ */
const AdminLiveSessions = () => {
  const navigate = useNavigate();

  /* ── active tab: "live" | "recorded" ── */
  const [tab, setTab] = useState("live");

  /* ── LIVE SESSIONS state ── */
  const [sessions, setSessions]               = useState([]);
  const [search, setSearch]                   = useState("");
  const [panelOpen, setPanelOpen]             = useState(false);
  const [panelMode, setPanelMode]             = useState("view");
  const [selectedSession, setSelectedSession] = useState(null);
  const [editForm, setEditForm]               = useState({ title:"", trainer:"", batch:"", status:"Active" });

  /* ── RECORDED VIDEOS state ── */
  const [videos, setVideos]               = useState([]);
  const [videoSearch, setVideoSearch]     = useState("");
  const [videoPanelOpen, setVideoPanelOpen] = useState(false);
  const [videoPanelMode, setVideoPanelMode] = useState("view");
  const [selectedVideo, setSelectedVideo]   = useState(null);
  const [videoEditForm, setVideoEditForm]   = useState({ title:"", trainer:"", batch:"", date:"" });

  /* resize handle */
  const { width: panelW, onMouseDown: startResize } = useResize(320);

  /* ══════════════════════════════════════
     BACKEND API CALLS
  ══════════════════════════════════════ */

  /* ── Fetch live sessions on mount ── */
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/live-sessions");
        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch live sessions", error);
      }
    };
    fetchSessions();
  }, []);

  /* ── Fetch recorded videos on mount ── */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/recorded-videos");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch recorded videos", error);
      }
    };
    fetchVideos();
  }, []);

  /* ── live handlers ── */
  const handleView = s => { setSelectedSession(s); setPanelMode("view"); setPanelOpen(true); };
  const handleEdit = s => { setSelectedSession(s); setEditForm({ title:s.title, trainer:s.trainer, batch:s.batch, status:s.status }); setPanelMode("edit"); setPanelOpen(true); };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/live-sessions/${selectedSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const updated = await res.json();
      setSessions(p => p.map(s => s.id === selectedSession.id ? { ...s, ...updated } : s));
      setSelectedSession(p => ({ ...p, ...updated }));
      setPanelMode("view");
    } catch (error) {
      console.error("Failed to update session", error);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await fetch(`/api/live-sessions/${id}`, { method: "DELETE" });
      setSessions(p => p.filter(s => s.id !== id));
      if (selectedSession?.id === id) closePanel();
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  };

  const closePanel = () => { setPanelOpen(false); setSelectedSession(null); setPanelMode("view"); };

  /* ── video handlers ── */
  const handleVideoView   = v => { setSelectedVideo(v); setVideoPanelMode("view"); setVideoPanelOpen(true); };
  const handleVideoEdit   = v => { setSelectedVideo(v); setVideoEditForm({ title:v.title, trainer:v.trainer, batch:v.batch, date:v.date }); setVideoPanelMode("edit"); setVideoPanelOpen(true); };

  const handleVideoSave = async () => {
    try {
      const res = await fetch(`/api/recorded-videos/${selectedVideo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoEditForm),
      });
      const updated = await res.json();
      setVideos(p => p.map(v => v.id === selectedVideo.id ? { ...v, ...updated } : v));
      setSelectedVideo(p => ({ ...p, ...updated }));
      setVideoPanelMode("view");
    } catch (error) {
      console.error("Failed to update video", error);
    }
  };

  const handleVideoDelete = async id => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await fetch(`/api/recorded-videos/${id}`, { method: "DELETE" });
      setVideos(p => p.filter(v => v.id !== id));
      if (selectedVideo?.id === id) closeVideoPanel();
    } catch (error) {
      console.error("Failed to delete video", error);
    }
  };

  const closeVideoPanel = () => { setVideoPanelOpen(false); setSelectedVideo(null); setVideoPanelMode("view"); };

  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.trainer.toLowerCase().includes(search.toLowerCase()));
  const filteredVideos   = videos.filter(v => v.title.toLowerCase().includes(videoSearch.toLowerCase()) || v.trainer.toLowerCase().includes(videoSearch.toLowerCase()));

  /* drag */
  const { handlers: dragS, active: dSA, over: dSO } = useDragList(sessions, setSessions);
  const { handlers: dragV, active: dVA, over: dVO } = useDragList(videos,   setVideos);

  /* which panel is open */
  const anyPanelOpen = tab === "live" ? panelOpen : videoPanelOpen;

  /* counts */
  const counts = {
    Active:    sessions.filter(s=>s.status==="Active").length,
    Completed: sessions.filter(s=>s.status==="Completed").length,
    Scheduled: sessions.filter(s=>s.status==="Scheduled").length,
    Ended:     sessions.filter(s=>s.status==="Ended").length,
  };

  /* ══════════ RENDER ══════════ */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              {tab === "live" ? <Radio className="h-5 w-5 text-white" /> : <Video className="h-5 w-5 text-white" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {tab === "live" ? "Admin Live Sessions" : "Admin Recorded Videos"}
              </h1>
              <p className="mt-0.5 text-sm text-blue-100/80">
                {tab === "live" ? "Monitor and manage all live sessions conducted by trainers" : "Monitor and manage all recorded sessions uploaded by trainers"}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            {tab === "live"
              ? <><Radio className="h-5 w-5 text-cyan-200"/><span className="text-sm font-semibold text-white">{sessions.length}<span className="ml-1 font-normal text-blue-100/80">Sessions</span></span></>
              : <><Video className="h-5 w-5 text-cyan-200"/><span className="text-sm font-semibold text-white">{videos.length}<span className="ml-1 font-normal text-blue-100/80">Videos</span></span></>}
          </div>
        </div>
      </div>

      {/* ═══ TAB BAR ═══ */}
      <div className="flex gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm w-fit">
        <button onClick={() => setTab("live")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
            tab === "live"
              ? "bg-gradient-to-r from-[#1a56db] to-[#06b6d4] text-white shadow"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
          <Radio className="h-4 w-4" /> Admin Live Sessions
        </button>
        <button onClick={() => setTab("recorded")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
            tab === "recorded"
              ? "bg-gradient-to-r from-[#1a56db] to-[#06b6d4] text-white shadow"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
          <Video className="h-4 w-4" /> Admin Recorded Videos
        </button>
      </div>

      {/* ═══ STAT CARDS (live only) ═══ */}
      {tab === "live" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:"Active",    count:counts.Active,    grad:"from-emerald-500 to-teal-600",  bg:"bg-emerald-50 dark:bg-emerald-950/40",  text:"text-emerald-600 dark:text-emerald-400", icon:PlayCircle   },
            { label:"Scheduled", count:counts.Scheduled, grad:"from-amber-400 to-orange-500",  bg:"bg-amber-50 dark:bg-amber-950/40",      text:"text-amber-600 dark:text-amber-400",     icon:Clock        },
            { label:"Completed", count:counts.Completed, grad:"from-blue-500 to-cyan-600",     bg:"bg-blue-50 dark:bg-blue-950/40",        text:"text-blue-600 dark:text-blue-400",       icon:CheckCircle2 },
            { label:"Ended",     count:counts.Ended,     grad:"from-slate-400 to-slate-600",   bg:"bg-slate-100 dark:bg-slate-800",        text:"text-slate-600 dark:text-slate-400",     icon:StopCircle   },
          ].map(s => { const Icon=s.icon; return (
            <div key={s.label} className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5">
              <div className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`}/>
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{s.count}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${s.text}`}/>
                </div>
              </div>
            </div>
          );})}
        </div>
      )}

      {/* ═══ SEARCH ═══ */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <Input
            placeholder={tab==="live" ? "Search sessions or trainers…" : "Search videos or trainers…"}
            value={tab==="live" ? search : videoSearch}
            onChange={e => tab==="live" ? setSearch(e.target.value) : setVideoSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm"/>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <GripVertical className="h-3.5 w-3.5"/> Drag rows to reorder
        </p>
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex gap-0 items-start">

        {/* ── TABLE ── */}
        <div className="flex-1 min-w-0 transition-all duration-150">

          {/* ══ LIVE SESSIONS TABLE ══ */}
          {tab === "live" && (
            <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">All Live Sessions</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{filteredSessions.length} record{filteredSessions.length!==1&&"s"} found</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                      <th className="pl-4 py-3 w-8"/>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Session</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Trainer</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Batch</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</th>
                      <th className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.length===0 ? (
                      <tr><td colSpan={7}><div className="flex flex-col items-center justify-center py-16 gap-3"><Radio className="h-7 w-7 text-slate-400"/><p className="text-sm text-slate-500">No sessions found</p></div></td></tr>
                    ) : filteredSessions.map((s, i) => {
                      const dh=dragS(i), isDrag=dSA===i, isOv=dSO===i&&dSA!==i, isSel=selectedSession?.id===s.id&&panelOpen;
                      const st=STATUS[s.status]||STATUS.Ended;
                      return (
                        <tr key={s.id} {...dh} className={`group border-b border-slate-100 dark:border-slate-800/60 transition-all duration-150 cursor-default
                          ${isDrag?"opacity-40 scale-[0.98] bg-slate-50 dark:bg-slate-800/50":""}
                          ${isOv?"bg-blue-50 dark:bg-blue-950/20 border-t-2 border-t-blue-400":""}
                          ${isSel?"bg-blue-50/70 dark:bg-blue-950/20":!isDrag&&!isOv?"hover:bg-blue-50/40 dark:hover:bg-slate-800/40":""}`}>
                          <td className="pl-4 py-3.5 w-8"><div className="cursor-grab opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-opacity"><GripVertical className="h-4 w-4 text-slate-400"/></div></td>
                          <td className="py-3.5 text-sm text-slate-400 font-medium">{String(i+1).padStart(2,"0")}</td>
                          <td className="py-3.5"><div className="flex items-center gap-2.5"><div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(s.title)} flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0`}>{s.title.charAt(0)}</div><span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{s.title}</span></div></td>
                          <td className="py-3.5"><div className="flex items-center gap-2"><div className={`h-7 w-7 rounded-full bg-gradient-to-br ${grad(s.trainer)} flex items-center justify-center text-[11px] font-bold text-white`}>{s.trainer.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><span className="text-sm text-slate-700 dark:text-slate-300">{s.trainer}</span></div></td>
                          <td className="py-3.5"><div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-blue-400"/><span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{s.batch}</span></div></td>
                          <td className="py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${st.text} ${st.bg} ${st.border}`}><span className={`h-1.5 w-1.5 rounded-full ${st.dot} ${s.status==="Active"?"animate-pulse":""}`}/>{s.status}</span></td>
                          <td className="pr-6 py-3.5 text-right"><div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>handleView(s)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&panelMode==="view"?"bg-blue-500 text-white":"bg-blue-50 dark:bg-blue-950/50 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"}`}><Eye className="h-3.5 w-3.5"/></button>
                            <button onClick={()=>handleEdit(s)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&panelMode==="edit"?"bg-violet-500 text-white":"bg-violet-50 dark:bg-violet-950/50 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900"}`}><Pencil className="h-3.5 w-3.5"/></button>
                            <button onClick={()=>handleDelete(s.id)} className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
                          </div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* ══ RECORDED VIDEOS TABLE ══ */}
          {tab === "recorded" && (
            <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">All Recorded Videos</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{filteredVideos.length} record{filteredVideos.length!==1&&"s"} found</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                      <th className="pl-4 py-3 w-8"/>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Video</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Trainer</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Batch</th>
                      <th className="py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">Upload Date</th>
                      <th className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVideos.length===0 ? (
                      <tr><td colSpan={7}><div className="flex flex-col items-center justify-center py-16 gap-3"><Video className="h-7 w-7 text-slate-400"/><p className="text-sm text-slate-500">No videos found</p></div></td></tr>
                    ) : filteredVideos.map((v, i) => {
                      const dh=dragV(i), isDrag=dVA===i, isOv=dVO===i&&dVA!==i, isSel=selectedVideo?.id===v.id&&videoPanelOpen;
                      return (
                        <tr key={v.id} {...dh} className={`group border-b border-slate-100 dark:border-slate-800/60 transition-all duration-150 cursor-default
                          ${isDrag?"opacity-40 scale-[0.98] bg-slate-50 dark:bg-slate-800/50":""}
                          ${isOv?"bg-blue-50 dark:bg-blue-950/20 border-t-2 border-t-blue-400":""}
                          ${isSel?"bg-blue-50/70 dark:bg-blue-950/20":!isDrag&&!isOv?"hover:bg-blue-50/40 dark:hover:bg-slate-800/40":""}`}>
                          <td className="pl-4 py-3.5 w-8"><div className="cursor-grab opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-opacity"><GripVertical className="h-4 w-4 text-slate-400"/></div></td>
                          <td className="py-3.5 text-sm text-slate-400 font-medium">{String(i+1).padStart(2,"0")}</td>
                          <td className="py-3.5"><div className="flex items-center gap-2.5"><div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(v.title)} flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0`}>{v.title.charAt(0)}</div><span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{v.title}</span></div></td>
                          <td className="py-3.5"><div className="flex items-center gap-2"><div className={`h-7 w-7 rounded-full bg-gradient-to-br ${grad(v.trainer)} flex items-center justify-center text-[11px] font-bold text-white`}>{v.trainer.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><span className="text-sm text-slate-700 dark:text-slate-300">{v.trainer}</span></div></td>
                          <td className="py-3.5"><div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-blue-400"/><span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{v.batch}</span></div></td>
                          <td className="py-3.5"><div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400"/><span className="text-sm text-slate-600 dark:text-slate-400">{v.date}</span></div></td>
                          <td className="pr-6 py-3.5 text-right"><div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>handleVideoView(v)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&videoPanelMode==="view"?"bg-blue-500 text-white":"bg-blue-50 dark:bg-blue-950/50 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"}`}><Eye className="h-3.5 w-3.5"/></button>
                            <button onClick={()=>handleVideoEdit(v)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isSel&&videoPanelMode==="edit"?"bg-violet-500 text-white":"bg-violet-50 dark:bg-violet-950/50 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900"}`}><Pencil className="h-3.5 w-3.5"/></button>
                            <button onClick={()=>handleVideoDelete(v.id)} className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
                          </div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ═══ CRM DRAG-RESIZE HANDLE ═══ */}
        {anyPanelOpen && (
          <div
            onMouseDown={startResize}
            className="flex-shrink-0 w-2 mx-1 self-stretch flex items-center justify-center cursor-col-resize group"
            title="Drag to resize panel"
          >
            <div className="w-1 h-16 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors" />
          </div>
        )}

        {/* ═══ INLINE PANEL ═══ */}
        {anyPanelOpen && (
          <div className="flex-shrink-0 transition-none" style={{ width: panelW }}>

            {/* LIVE SESSION PANEL */}
            {tab === "live" && selectedSession && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden" style={{ width: panelW }}>
                <div className={`px-5 py-4 bg-gradient-to-r ${panelMode==="edit"?"from-violet-600 to-purple-500":"from-[#1a56db] to-[#06b6d4]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(selectedSession.title)} flex items-center justify-center text-base font-bold text-white shadow-md`}>{selectedSession.title.charAt(0)}</div>
                      <div><h2 className="text-sm font-bold text-white">{panelMode==="edit"?"Edit Session":selectedSession.title}</h2><p className="text-[11px] text-white/70 mt-0.5">{panelMode==="edit"?"Update session details":"Session Details"}</p></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {panelMode==="view"&&<button onClick={()=>{setEditForm({title:selectedSession.title,trainer:selectedSession.trainer,batch:selectedSession.batch,status:selectedSession.status});setPanelMode("edit");}} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><Pencil className="h-3.5 w-3.5 text-white"/></button>}
                      <button onClick={closePanel} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><X className="h-4 w-4 text-white"/></button>
                    </div>
                  </div>
                  <div className="mt-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">{panelMode==="edit"?<Pencil className="h-3 w-3"/>:<Eye className="h-3 w-3"/>}{panelMode==="edit"?"Edit Mode":"View Mode"}</span></div>
                </div>
                <div className="p-5 space-y-3 overflow-y-auto" style={{maxHeight:"calc(100vh - 340px)"}}>
                  {panelMode==="view" ? (
                    <>
                      {[{label:"Session Title",value:selectedSession.title,icon:Radio},{label:"Trainer",value:selectedSession.trainer,icon:UserCheck},{label:"Batch",value:selectedSession.batch,icon:Layers},{label:"Status",value:selectedSession.status,icon:CheckCircle2}].map(({label,value,icon:Icon})=>(
                        <div key={label} className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0"><Icon className="h-4 w-4 text-blue-500"/></div>
                          <div className="min-w-0"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">{value}</p></div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="space-y-3">
                      {[{key:"title",label:"Session Title",icon:Radio,placeholder:"e.g. React Live Class",type:"text"},{key:"trainer",label:"Trainer Name",icon:UserCheck,placeholder:"e.g. John Doe",type:"text"},{key:"batch",label:"Batch",icon:Layers,placeholder:"e.g. Batch A",type:"text"}].map(({key,label,icon:Icon,placeholder,type})=>(
                        <div key={key} className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Icon className="h-3 w-3"/>{label}</label>
                          <Input type={type} placeholder={placeholder} value={editForm[key]} onChange={e=>setEditForm(f=>({...f,[key]:e.target.value}))} className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"/>
                        </div>
                      ))}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3"/>Status</label>
                        <select value={editForm.status} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))} className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
                          {["Active","Scheduled","Completed","Ended"].map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
                  {panelMode==="view" ? (
                    <><button onClick={closePanel} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
                    <button onClick={()=>handleDelete(selectedSession.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow hover:opacity-90 transition-all"><Trash2 className="h-3.5 w-3.5"/>Delete</button></>
                  ) : (
                    <><button onClick={()=>setPanelMode("view")} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button onClick={handleSaveEdit} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-500 shadow hover:opacity-90 hover:scale-105 transition-all"><Save className="h-3.5 w-3.5"/>Save Changes</button></>
                  )}
                </div>
              </div>
            )}

            {/* RECORDED VIDEO PANEL */}
            {tab === "recorded" && selectedVideo && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden" style={{ width: panelW }}>
                <div className={`px-5 py-4 bg-gradient-to-r ${videoPanelMode==="edit"?"from-violet-600 to-purple-500":"from-[#1a56db] to-[#06b6d4]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(selectedVideo.title)} flex items-center justify-center text-base font-bold text-white shadow-md`}>{selectedVideo.title.charAt(0)}</div>
                      <div><h2 className="text-sm font-bold text-white">{videoPanelMode==="edit"?"Edit Video":selectedVideo.title}</h2><p className="text-[11px] text-white/70 mt-0.5">{videoPanelMode==="edit"?"Update video details":"Video Details"}</p></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {videoPanelMode==="view"&&<button onClick={()=>{setVideoEditForm({title:selectedVideo.title,trainer:selectedVideo.trainer,batch:selectedVideo.batch,date:selectedVideo.date});setVideoPanelMode("edit");}} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><Pencil className="h-3.5 w-3.5 text-white"/></button>}
                      <button onClick={closeVideoPanel} className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center"><X className="h-4 w-4 text-white"/></button>
                    </div>
                  </div>
                  <div className="mt-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">{videoPanelMode==="edit"?<Pencil className="h-3 w-3"/>:<Eye className="h-3 w-3"/>}{videoPanelMode==="edit"?"Edit Mode":"View Mode"}</span></div>
                </div>
                <div className="p-5 space-y-3 overflow-y-auto" style={{maxHeight:"calc(100vh - 340px)"}}>
                  {videoPanelMode==="view" ? (
                    <>
                      {[{label:"Video Title",value:selectedVideo.title,icon:Video},{label:"Trainer",value:selectedVideo.trainer,icon:UserCheck},{label:"Batch",value:selectedVideo.batch,icon:Layers},{label:"Upload Date",value:selectedVideo.date,icon:Calendar}].map(({label,value,icon:Icon})=>(
                        <div key={label} className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0"><Icon className="h-4 w-4 text-blue-500"/></div>
                          <div className="min-w-0"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">{value}</p></div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="space-y-3">
                      {[{key:"title",label:"Video Title",icon:Video,placeholder:"e.g. React Hooks Explained",type:"text"},{key:"trainer",label:"Trainer Name",icon:UserCheck,placeholder:"e.g. John Doe",type:"text"},{key:"batch",label:"Batch",icon:Layers,placeholder:"e.g. Batch A",type:"text"},{key:"date",label:"Upload Date",icon:Calendar,placeholder:"YYYY-MM-DD",type:"date"}].map(({key,label,icon:Icon,placeholder,type})=>(
                        <div key={key} className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Icon className="h-3 w-3"/>{label}</label>
                          <Input type={type} placeholder={placeholder} value={videoEditForm[key]} onChange={e=>setVideoEditForm(f=>({...f,[key]:e.target.value}))} className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
                  {videoPanelMode==="view" ? (
                    <><button onClick={closeVideoPanel} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
                    <button onClick={()=>handleVideoDelete(selectedVideo.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow hover:opacity-90 transition-all"><Trash2 className="h-3.5 w-3.5"/>Delete</button></>
                  ) : (
                    <><button onClick={()=>setVideoPanelMode("view")} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button onClick={handleVideoSave} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-500 shadow hover:opacity-90 hover:scale-105 transition-all"><Save className="h-3.5 w-3.5"/>Save Changes</button></>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveSessions;