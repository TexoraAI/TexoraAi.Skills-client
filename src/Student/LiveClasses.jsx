// import React, { useState, useEffect } from "react";
// import { getStudentClassroom } from "@/services/batchService";
// import {
//   getLiveSessionsByBatch,
//   joinLiveSession,
// } from "@/services/liveSessionService";
// import LiveRoom from "@/components/live/LiveRoom";

// const LiveClasses = () => {
//   const [sessions, setSessions] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [token, setToken] = useState(null);
//   const [room, setRoom] = useState(null);

//   // 🔥 LOAD LIVE SESSIONS (FIXED)
//   useEffect(() => {
//     const loadLive = async () => {
//       try {
//         // ✅ GET CLASSROOM
//         const response = await getStudentClassroom();
//         const classroom = response.data;

//         console.log("CLASSROOM:", classroom);

//         // ✅ ONLY THIS LINE (IMPORTANT FIX)
//         const batchId = classroom.batchId;

//         console.log("BATCH ID:", batchId);

//         if (!batchId) {
//           console.warn("No batch assigned");
//           return;
//         }

//         // ✅ FETCH LIVE SESSIONS
//         const res = await getLiveSessionsByBatch(batchId);

//         console.log("LIVE SESSIONS:", res.data);

//         setSessions(res.data || []);
//       } catch (err) {
//         console.error("Live fetch failed", err);
//       }
//     };

//     loadLive();
//   }, []);

//   // 🔥 JOIN LIVE SESSION
//   const handleJoin = async () => {
//     try {
//       if (!selected) return;

//       const studentId = 1; // ⚠️ later from JWT

//       const res = await joinLiveSession(selected.id, studentId);

//       console.log("JOIN RESPONSE:", res.data);

//       setToken(res.data.token);
//       setRoom(res.data.room);
//     } catch (err) {
//       console.error("Join failed", err);
//     }
//   };

//   // 🎥 IF JOINED → SHOW LIVE VIDEO
//   if (token) {
//     return <LiveRoom token={token} roomName={room} />;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">🔴 Live Classes</h2>

//       {sessions.length === 0 ? (
//         <p>No live sessions available</p>
//       ) : (
//         sessions.map((s) => (
//           <div
//             key={s.id}
//             onClick={() => setSelected(s)}
//             className={`p-3 border rounded mb-2 cursor-pointer ${
//               selected?.id === s.id ? "bg-red-100" : ""
//             }`}
//           >
//             {s.title}
//           </div>
//         ))
//       )}

//       {selected && (
//         <button
//           onClick={handleJoin}
//           className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
//         >
//           🔴 Join Live Session
//         </button>
//       )}
//     </div>
//   );
// };

// export default LiveClasses; old shareef















import React, { useState, useEffect } from "react";
import { getStudentClassroom } from "@/services/batchService";
import {
  getLiveSessionsByBatch,
  joinLiveSession,
} from "@/services/liveSessionService";
import LiveRoom from "@/components/live/LiveRoom";
import {
  ChevronDown, ChevronUp, Radio, Users,
  Calendar, Clock, Wifi, TrendingUp,
} from "lucide-react";

const LiveClasses = () => {
  const [sessions, setSessions]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [token, setToken]         = useState(null);
  const [room, setRoom]           = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [joining, setJoining]     = useState(false);

  /* ================= LOAD LIVE SESSIONS ================= */
  useEffect(() => {
    const loadLive = async () => {
      try {
        const response  = await getStudentClassroom();
        const classroom = response.data;
        console.log("CLASSROOM:", classroom);

        const batchId = classroom.batchId;
        console.log("BATCH ID:", batchId);

        if (!batchId) { console.warn("No batch assigned"); return; }

        const res = await getLiveSessionsByBatch(batchId);
        console.log("LIVE SESSIONS:", res.data);
        setSessions(res.data || []);
      } catch (err) {
        console.error("Live fetch failed", err);
      }
    };
    loadLive();
  }, []);

  /* ================= JOIN LIVE SESSION ================= */
  const handleJoin = async () => {
    try {
      if (!selected) return;
      setJoining(true);
      const studentId = 1; // ⚠️ later from JWT
      const res = await joinLiveSession(selected.id, studentId);
      console.log("JOIN RESPONSE:", res.data);
      setToken(res.data.token);
      setRoom(res.data.room);
    } catch (err) {
      console.error("Join failed", err);
    } finally {
      setJoining(false);
    }
  };

  /* ================= IF JOINED → LIVE ROOM ================= */
  if (token) {
    return <LiveRoom token={token} roomName={room} />;
  }

  /* ================= DERIVED STATS ================= */
  const liveCount     = sessions.filter((s) => s.isLive || s.status === "LIVE").length;
  const upcomingCount = sessions.filter((s) => !s.isLive && s.status !== "LIVE").length;

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] px-6 py-7">

      {/* ===== PAGE TITLE ===== */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg"
            style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
            <Radio className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Live & Recorded
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Live Classes</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Join your trainer's live sessions in real-time
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: <Radio size={18} />,       value: sessions.length, label: "Total Sessions", style: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
          { icon: <TrendingUp size={18} />,  value: liveCount,       label: "Live Now",       style: "linear-gradient(135deg,#991b1b,#ef4444)" },
          { icon: <Clock size={18} />,       value: upcomingCount,   label: "Upcoming",       style: "linear-gradient(135deg,#0369a1,#0ea5e9)" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
            style={{ background: s.style }}>
            <span className="text-white/70">{s.icon}</span>
            <span className="text-2xl font-extrabold">{s.value}</span>
            <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ===== MAIN PANEL ===== */}
      <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-white/10
                      bg-white dark:bg-[#162040] shadow-sm overflow-hidden">

        {/* Panel header with collapse toggle */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-white/10"
          style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Live Classes</p>
              <p className="text-[11px] text-white/65">
                {sessions.length > 0
                  ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} available${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
                  : "Loading sessions..."}
              </p>
            </div>
          </div>

          {/* CRM-style collapse button */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                       bg-white/15 hover:bg-white/25 text-white border border-white/20
                       transition select-none"
          >
            {collapsed
              ? <><ChevronDown className="w-3.5 h-3.5" /> Show</>
              : <><ChevronUp className="w-3.5 h-3.5" /> Hide</>
            }
          </button>
        </div>

        {/* ===== COLLAPSIBLE CONTENT ===== */}
        {!collapsed && (
          <div className="p-4">

            {/* Empty state */}
            {sessions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 gap-3 opacity-50">
                <Wifi className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No live sessions available
                </p>
                <p className="text-xs text-slate-400">Check back later or refresh the page</p>
              </div>
            )}

            {/* Session list */}
            <div className="space-y-2 mb-4">
              {sessions.map((s) => {
                const isLive     = s.isLive || s.status === "LIVE";
                const isSelected = selected?.id === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer
                                border transition-all duration-200 overflow-hidden
                      ${isSelected
                        ? isLive
                          ? "border-red-400 dark:border-red-500/60 bg-red-50 dark:bg-red-900/15 shadow-md"
                          : "border-blue-400 dark:border-blue-500/60 bg-blue-50 dark:bg-blue-900/15 shadow-md"
                        : isLive
                          ? "border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10 hover:border-red-300 dark:hover:border-red-700/50"
                          : "border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-white/3 hover:border-blue-200 dark:hover:border-blue-700/40 hover:bg-blue-50/30 dark:hover:bg-white/5"
                      }`}
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                      style={{
                        background: isSelected
                          ? isLive ? "linear-gradient(180deg,#ef4444,#f97316)" : "linear-gradient(180deg,#1d4ed8,#7c3aed)"
                          : isLive ? "#fecaca" : "#e2e8f0",
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isLive
                          ? "linear-gradient(135deg,#fee2e2,#fecaca)"
                          : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                        boxShadow: isLive && isSelected ? "0 0 0 3px rgba(239,68,68,0.2)" : undefined,
                      }}
                    >
                      <Radio
                        size={16}
                        color={isLive ? "#ef4444" : "#7c3aed"}
                        style={isLive ? { animation: "lc-pulse 1.5s ease-in-out infinite" } : {}}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold truncate
                          ${isSelected
                            ? isLive ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"
                            : "text-slate-800 dark:text-slate-100"
                          }`}>
                          {s.title}
                        </span>

                        {isLive && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md
                                           bg-red-100 dark:bg-red-900/40
                                           text-red-600 dark:text-red-400
                                           text-[10px] font-extrabold tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"
                              style={{ animation: "lc-blink 1s infinite" }} />
                            LIVE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {s.date && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <Calendar size={10} /> {s.date}
                          </span>
                        )}
                        {s.time && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <Clock size={10} /> {s.time}
                          </span>
                        )}
                        {s.viewers != null && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <Users size={10} /> {s.viewers} watching
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selection checkmark */}
                    {isSelected && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: isLive ? "#ef4444" : "#1d4ed8" }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ===== JOIN BUTTON ===== */}
            {selected && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full flex items-center justify-center gap-2.5
                           px-4 py-3.5 rounded-xl text-sm font-bold text-white
                           shadow-lg transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
              >
                {joining ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                      style={{ animation: "lc-spin 0.8s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Joining...
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white"
                      style={{ animation: "lc-blink 1s infinite" }} />
                    Join Live Session — {selected.title}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===== KEYFRAMES ===== */}
      <style>{`
        @keyframes lc-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes lc-spin  { to{transform:rotate(360deg)} }
        @keyframes lc-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
};

export default LiveClasses;