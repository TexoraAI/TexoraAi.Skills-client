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
  ChevronDown,
  ChevronUp,
  Radio,
  Users,
  Calendar,
  Clock,
  Wifi,
} from "lucide-react";

const LiveClasses = () => {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(null);
  const [room, setRoom] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [joining, setJoining] = useState(false);

  // 🔥 LOAD LIVE SESSIONS (FIXED)
  useEffect(() => {
    const loadLive = async () => {
      try {
        // ✅ GET CLASSROOM
        const response = await getStudentClassroom();
        const classroom = response.data;
        console.log("CLASSROOM:", classroom);

        // ✅ ONLY THIS LINE (IMPORTANT FIX)
        const batchId = classroom.batchId;
        console.log("BATCH ID:", batchId);

        if (!batchId) {
          console.warn("No batch assigned");
          return;
        }

        // ✅ FETCH LIVE SESSIONS
        const res = await getLiveSessionsByBatch(batchId);
        console.log("LIVE SESSIONS:", res.data);
        setSessions(res.data || []);
      } catch (err) {
        console.error("Live fetch failed", err);
      }
    };

    loadLive();
  }, []);

  // 🔥 JOIN LIVE SESSION
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

  // 🎥 IF JOINED → SHOW LIVE VIDEO
  if (token) {
    return <LiveRoom token={token} roomName={room} />;
  }

  const liveCount = sessions.filter((s) => s.isLive || s.status === "LIVE").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .lc-wrap * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }

        .lc-card {
          background: #ffffff;
          border: 1.5px solid #e8eaf0;
          border-radius: 16px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
          overflow: hidden;
        }
        .lc-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: #e2e8f0;
          border-radius: 4px 0 0 4px;
          transition: background 0.2s;
        }
        .lc-card:hover {
          border-color: #c7d2fe;
          background: #fafbff;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(99,102,241,0.08);
        }
        .lc-card:hover::before { background: #818cf8; }
        .lc-card.selected {
          border-color: #6366f1;
          background: linear-gradient(135deg, #fafaff 0%, #f0f0ff 100%);
          box-shadow: 0 4px 24px rgba(99,102,241,0.15);
        }
        .lc-card.selected::before { background: linear-gradient(180deg, #6366f1, #8b5cf6); }

        .lc-card.live-card {
          border-color: #fecaca;
          background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
        }
        .lc-card.live-card::before { background: linear-gradient(180deg, #ef4444, #f97316); }
        .lc-card.live-card.selected {
          border-color: #ef4444;
          background: linear-gradient(135deg, #fff1f1 0%, #fff8f8 100%);
          box-shadow: 0 4px 24px rgba(239,68,68,0.15);
        }

        .pulse-ring {
          position: relative;
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pulse-ring.live-icon {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
        }
        .pulse-ring.live-icon::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 14px;
          border: 2px solid #ef4444;
          opacity: 0.4;
          animation: ring-pulse 1.5s ease-in-out infinite;
        }
        .pulse-ring.normal-icon {
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
        }

        @keyframes ring-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0; transform: scale(1.15); }
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .join-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(239,68,68,0.35);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239,68,68,0.45);
        }
        .join-btn:active { transform: translateY(0); }
        .join-btn:disabled {
          background: linear-gradient(135deg, #cbd5e1, #94a3b8);
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }

        .collapse-btn {
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          padding: 6px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .collapse-btn:hover { background: #e2e8f0; color: #334155; }

        .session-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .meta-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #94a3b8;
        }
        .empty-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: #f1f5f9;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
        }
      `}</style>

      <div className="lc-wrap" style={{ padding: "28px 24px", maxWidth: 780, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
          borderRadius: 20,
          padding: "22px 26px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(99,102,241,0.25)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* bg decoration */}
          <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", right: 40, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}>
              <Radio size={22} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>
                Live Classes
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                {sessions.length > 0
                  ? `${sessions.length} session${sessions.length > 1 ? "s" : ""} available${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
                  : "Loading sessions..."}
              </p>
            </div>
          </div>

          <button className="collapse-btn" onClick={() => setCollapsed((c) => !c)}
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", position: "relative" }}>
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            {collapsed ? "Show" : "Hide"}
          </button>
        </div>

        {/* ── SESSION LIST ── */}
        {!collapsed && (
          <>
            {sessions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Wifi size={24} color="#cbd5e1" /></div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#64748b" }}>No live sessions available</p>
                <p style={{ margin: "6px 0 0", fontSize: 12 }}>Check back later or refresh the page</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {sessions.map((s) => {
                  const isLive = s.isLive || s.status === "LIVE";
                  const isSelected = selected?.id === s.id;

                  return (
                    <div
                      key={s.id}
                      className={`lc-card ${isLive ? "live-card" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelected(s)}
                    >
                      {/* icon */}
                      <div className={`pulse-ring ${isLive ? "live-icon" : "normal-icon"}`}>
                        <Radio size={18} color={isLive ? "#ef4444" : "#7c3aed"} />
                      </div>

                      {/* info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 14, fontWeight: 700,
                            color: isSelected ? (isLive ? "#dc2626" : "#4338ca") : "#1e293b",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {s.title}
                          </span>

                          {isLive && (
                            <span style={{
                              display: "flex", alignItems: "center", gap: 4,
                              background: "#fee2e2", color: "#ef4444",
                              fontSize: 10, fontWeight: 800, letterSpacing: 1,
                              padding: "2px 8px", borderRadius: 6, textTransform: "uppercase",
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "dot-blink 1s infinite", display: "inline-block" }} />
                              LIVE
                            </span>
                          )}
                        </div>

                        <div className="session-meta">
                          {s.date && (
                            <span className="meta-chip">
                              <Calendar size={11} /> {s.date}
                            </span>
                          )}
                          {s.time && (
                            <span className="meta-chip">
                              <Clock size={11} /> {s.time}
                            </span>
                          )}
                          {s.viewers != null && (
                            <span className="meta-chip">
                              <Users size={11} /> {s.viewers} watching
                            </span>
                          )}
                        </div>
                      </div>

                      {/* selection indicator */}
                      {isSelected && (
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                          background: isLive ? "#ef4444" : "#6366f1",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── JOIN BUTTON ── */}
            {selected && (
              <button className="join-btn" onClick={handleJoin} disabled={joining}>
                {joining ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Joining...
                  </>
                ) : (
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white", animation: "dot-blink 1s infinite", display: "inline-block" }} />
                    Join Live Session — {selected.title}
                  </>
                )}
              </button>
            )}
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};

export default LiveClasses;
