// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Video, Calendar, Clock, Users, Circle } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const StudentLiveSessions = () => {
//   const navigate = useNavigate();

//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const batchId = 1; // later fetch from student profile

//   /* ================= FETCH LIVE SESSIONS ================= */

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const res = await fetch(`/api/live-sessions/batch/${batchId}`);

//         const data = await res.json();

//         setSessions(data);
//       } catch (error) {
//         console.error("Failed to fetch live sessions", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, [batchId]);

//   /* ================= JOIN LIVE ================= */

//   const handleJoin = (sessionId) => {
//     navigate(`/student/live/${sessionId}`);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">
//       {/* ================= HEADER ================= */}

//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
//         <h2 className="text-2xl font-semibold flex items-center gap-2">
//           <Video size={22} />
//           Live Classes
//         </h2>

//         <p className="text-sm opacity-90 mt-1">
//           Join your upcoming and live sessions
//         </p>
//       </div>

//       {/* ================= CONTENT ================= */}

//       {loading ? (
//         <div className="text-center py-20">Loading live sessions...</div>
//       ) : sessions.length === 0 ? (
//         <div className="text-center py-20 opacity-70">
//           <Video size={40} className="mx-auto mb-4" />
//           No live sessions available
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sessions.map((session) => (
//             <Card
//               key={session.id}
//               className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10"
//             >
//               <CardContent className="p-6 space-y-4">
//                 {/* TITLE */}

//                 <h3 className="font-semibold text-lg">{session.title}</h3>

//                 {/* DETAILS */}

//                 <div className="text-sm text-gray-500 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Calendar size={14} />
//                     {session.date}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Clock size={14} />
//                     {session.time}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Users size={14} />
//                     {session.viewers ?? 0} students
//                   </div>
//                 </div>

//                 {/* STATUS */}

//                 <div className="flex items-center justify-between">
//                   <span className="text-sm flex items-center gap-2">
//                     {session.status === "LIVE" && (
//                       <Circle
//                         size={10}
//                         className="text-red-500 animate-pulse"
//                       />
//                     )}

//                     {session.status}
//                   </span>

//                   {/* JOIN BUTTON */}

//                   <Button
//                     onClick={() => handleJoin(session.id)}
//                     className="bg-blue-600 text-white hover:bg-blue-500"
//                   >
//                     Join
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentLiveSessions; old 1 shareef










import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video, VideoOff, Mic, MicOff, MessageSquare, Users,
  PhoneOff, Maximize2, Minimize2, ChevronDown, ChevronUp,
  Circle, Send, X, ScreenShare, Hand, Settings
} from "lucide-react";

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const StudentLiveSessions = () => {
  const navigate = useNavigate();

  // ── list view state ──
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  // ── live-room state ──
  const [activeSession, setActiveSession] = useState(null);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, name: "Trainer", text: "Welcome everyone! Class starts now.", time: "18:41", self: false },
    { id: 2, name: "You", text: "Thanks, ready!", time: "18:42", self: true },
  ]);
  const [msgInput, setMsgInput] = useState("");
  const chatEndRef = useRef(null);
  const localVideoRef = useRef(null);

  const batchId = 1;

  /* ── fetch sessions ── */
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/live-sessions/batch/${batchId}`);
        const data = await res.json();
        setSessions(data);
      } catch {
        // demo data when API not available
        setSessions([
          { id: 1, title: "Mathematics – Algebra", date: "24 Mar 2026", time: "6:00 PM", viewers: 34, status: "LIVE" },
          { id: 2, title: "Physics – Waves & Optics", date: "24 Mar 2026", time: "7:30 PM", viewers: 18, status: "UPCOMING" },
          { id: 3, title: "Chemistry – Organic Reactions", date: "25 Mar 2026", time: "5:00 PM", viewers: 0, status: "UPCOMING" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [batchId]);

  /* ── camera stream ── */
  useEffect(() => {
    if (!activeSession) return;
    if (camOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: micOn })
        .then(stream => { if (localVideoRef.current) localVideoRef.current.srcObject = stream; })
        .catch(() => {});
    } else {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
        localVideoRef.current.srcObject = null;
      }
    }
  }, [camOn, activeSession]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatOpen]);

  const handleJoin = (session) => setActiveSession(session);
  const handleLeave = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setActiveSession(null);
    setCamOn(true);
    setMicOn(true);
    setChatOpen(false);
    setHandRaised(false);
  };

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), name: "You", text: msgInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), self: true }]);
    setMsgInput("");
  };

  /* ════════════════════════════════════════════
     LIVE ROOM VIEW
  ════════════════════════════════════════════ */
  if (activeSession) {
    return (
      <div className={`live-room ${fullscreen ? "fullscreen" : ""}`} style={styles.liveRoom}>
        {/* ── top bar ── */}
        <div style={styles.topBar}>
          <div style={styles.topLeft}>
            <span style={styles.liveDot} />
            <span style={styles.liveLabel}>LIVE</span>
            <span style={styles.sessionTitle}>{activeSession.title}</span>
          </div>
          <div style={styles.topRight}>
            <div style={styles.viewerBadge}>
              <Users size={13} />
              <span>{activeSession.viewers ?? 0} watching</span>
            </div>
            <button onClick={() => setFullscreen(f => !f)} style={styles.iconBtn}>
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* ── main content ── */}
        <div style={styles.mainContent}>
          {/* Trainer video (placeholder) */}
          <div style={styles.trainerVideo}>
            <div style={styles.trainerPlaceholder}>
              <div style={styles.avatarRing}>
                <div style={styles.avatarInner}>T</div>
              </div>
              <span style={styles.trainerName}>Trainer's Video</span>
              <span style={styles.trainerSub}>Waiting for trainer's stream...</span>
            </div>
            {/* Student cam pip */}
            <div style={styles.pip}>
              {camOn
                ? <video ref={localVideoRef} autoPlay muted playsInline style={styles.pipVideo} />
                : <div style={styles.pipOff}><VideoOff size={18} color="#aaa" /></div>
              }
              <span style={styles.pipLabel}>You</span>
            </div>
          </div>

          {/* Side panel */}
          {(chatOpen || participantsOpen) && (
            <div style={styles.sidePanel}>
              {/* Tab switcher */}
              <div style={styles.tabRow}>
                <button style={{ ...styles.tab, ...(chatOpen ? styles.tabActive : {}) }} onClick={() => { setChatOpen(true); setParticipantsOpen(false); }}>
                  <MessageSquare size={14} /> Chat
                </button>
                <button style={{ ...styles.tab, ...(participantsOpen ? styles.tabActive : {}) }} onClick={() => { setParticipantsOpen(true); setChatOpen(false); }}>
                  <Users size={14} /> People
                </button>
                <button style={styles.closePanelBtn} onClick={() => { setChatOpen(false); setParticipantsOpen(false); }}>
                  <X size={14} />
                </button>
              </div>

              {/* Chat */}
              {chatOpen && (
                <div style={styles.chatArea}>
                  <div style={styles.msgList}>
                    {messages.map(m => (
                      <div key={m.id} style={{ ...styles.msgRow, ...(m.self ? styles.msgSelf : {}) }}>
                        {!m.self && <div style={styles.msgAvatar}>{m.name[0]}</div>}
                        <div style={styles.msgBubble(m.self)}>
                          {!m.self && <span style={styles.msgName}>{m.name}</span>}
                          <span style={styles.msgText}>{m.text}</span>
                          <span style={styles.msgTime}>{m.time}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div style={styles.chatInput}>
                    <input
                      style={styles.input}
                      placeholder="Type a message…"
                      value={msgInput}
                      onChange={e => setMsgInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMsg()}
                    />
                    <button style={styles.sendBtn} onClick={sendMsg}><Send size={14} /></button>
                  </div>
                </div>
              )}

              {/* Participants */}
              {participantsOpen && (
                <div style={styles.participantList}>
                  {["Trainer (Host)", "You", "Ahmed K.", "Priya S.", "Raza M.", "Fatima B."].map((p, i) => (
                    <div key={i} style={styles.participantRow}>
                      <div style={styles.pAvatar}>{p[0]}</div>
                      <span style={styles.pName}>{p}</span>
                      {i === 0 && <span style={styles.hostBadge}>Host</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── control bar ── */}
        <div style={styles.controlBar}>
          <ControlBtn
            icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
            label={micOn ? "Mute" : "Unmute"}
            active={micOn}
            danger={!micOn}
            onClick={() => setMicOn(m => !m)}
          />
          <ControlBtn
            icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
            label={camOn ? "Stop Video" : "Start Video"}
            active={camOn}
            danger={!camOn}
            onClick={() => setCamOn(c => !c)}
          />
          <ControlBtn
            icon={<MessageSquare size={18} />}
            label="Chat"
            active={chatOpen}
            onClick={() => { setChatOpen(o => !o); setParticipantsOpen(false); }}
          />
          <ControlBtn
            icon={<Users size={18} />}
            label="People"
            active={participantsOpen}
            onClick={() => { setParticipantsOpen(o => !o); setChatOpen(false); }}
          />
          <ControlBtn
            icon={<Hand size={18} />}
            label={handRaised ? "Lower Hand" : "Raise Hand"}
            active={handRaised}
            onClick={() => setHandRaised(h => !h)}
          />
          <ControlBtn
            icon={<PhoneOff size={18} />}
            label="Leave"
            danger
            onClick={handleLeave}
          />
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     SESSION LIST VIEW
  ════════════════════════════════════════════ */
  return (
    <div style={styles.page}>
      {/* Header card */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}><Video size={22} /></div>
          <div>
            <h2 style={styles.headerTitle}>Live Classes</h2>
            <p style={styles.headerSub}>Join your sessions in real-time</p>
          </div>
        </div>
        <button style={styles.collapseBtn} onClick={() => setExpanded(e => !e)}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Collapsible session list */}
      {expanded && (
        <div style={styles.sessionGrid}>
          {loading ? (
            <div style={styles.emptyState}>Loading sessions…</div>
          ) : sessions.length === 0 ? (
            <div style={styles.emptyState}>No live sessions available</div>
          ) : sessions.map((s) => (
            <SessionCard key={s.id} session={s} onJoin={() => handleJoin(s)} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SESSION CARD
───────────────────────────────────────────── */
const SessionCard = ({ session, onJoin }) => {
  const isLive = session.status === "LIVE";
  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <span style={styles.cardStatus(isLive)}>
          {isLive && <span style={styles.pulseDot} />}
          {session.status}
        </span>
        <span style={styles.cardViewers}><Users size={12} /> {session.viewers ?? 0}</span>
      </div>
      <h3 style={styles.cardTitle}>{session.title}</h3>
      <div style={styles.cardMeta}>
        <span>{session.date}</span>
        <span style={styles.dot}>·</span>
        <span>{session.time}</span>
      </div>
      <button
        style={styles.joinBtn(isLive)}
        onClick={onJoin}
        disabled={!isLive}
      >
        {isLive ? "Join Now" : "Upcoming"}
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CONTROL BUTTON
───────────────────────────────────────────── */
const ControlBtn = ({ icon, label, active, danger, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, background: danger ? "#ef4444" : active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
      border: "none", borderRadius: 12, padding: "10px 18px",
      color: "#fff", cursor: "pointer", fontSize: 11, fontFamily: "inherit",
      transition: "background 0.2s",
    }}
    onMouseOver={e => e.currentTarget.style.background = danger ? "#dc2626" : "rgba(255,255,255,0.22)"}
    onMouseOut={e => e.currentTarget.style.background = danger ? "#ef4444" : active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = {
  /* LIST PAGE */
  page: { minHeight: "100vh", background: "#0f1117", padding: "32px 24px", fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: "#e2e8f0" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg,#1e3a5f,#2d1b69)", borderRadius: 20, padding: "20px 28px", marginBottom: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  headerIcon: { background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 10, display: "flex" },
  headerTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" },
  headerSub: { margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" },
  collapseBtn: { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 8, color: "#fff", cursor: "pointer", display: "flex" },
  sessionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 },
  emptyState: { textAlign: "center", padding: "60px 0", opacity: 0.5, gridColumn: "1/-1" },

  /* CARD */
  card: { background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 22, display: "flex", flexDirection: "column", gap: 12, transition: "transform 0.2s,box-shadow 0.2s" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardStatus: (live) => ({ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: live ? "#f87171" : "#94a3b8", textTransform: "uppercase" }),
  pulseDot: { width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.2s infinite", display: "inline-block" },
  cardViewers: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94a3b8" },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.4 },
  cardMeta: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" },
  dot: { color: "#334155" },
  joinBtn: (live) => ({ marginTop: 4, padding: "10px 0", borderRadius: 12, border: "none", background: live ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : "#1e293b", color: live ? "#fff" : "#475569", fontWeight: 600, fontSize: 14, cursor: live ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: 0.3 }),

  /* LIVE ROOM */
  liveRoom: { display: "flex", flexDirection: "column", height: "100vh", background: "#0a0c14", fontFamily: "'Outfit','Segoe UI',sans-serif", color: "#e2e8f0", overflow: "hidden" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  topLeft: { display: "flex", alignItems: "center", gap: 10 },
  liveDot: { width: 10, height: 10, borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" },
  liveLabel: { fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#ef4444" },
  sessionTitle: { fontSize: 15, fontWeight: 600, color: "#f1f5f9" },
  topRight: { display: "flex", alignItems: "center", gap: 12 },
  viewerBadge: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#94a3b8", background: "rgba(255,255,255,0.07)", padding: "4px 10px", borderRadius: 20 },
  iconBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" },

  /* MAIN */
  mainContent: { flex: 1, display: "flex", overflow: "hidden" },

  /* TRAINER VIDEO */
  trainerVideo: { flex: 1, position: "relative", background: "#080c14" },
  trainerPlaceholder: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 },
  avatarRing: { width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", padding: 3 },
  avatarInner: { width: "100%", height: "100%", borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, color: "#fff" },
  trainerName: { fontSize: 18, fontWeight: 600, color: "#e2e8f0" },
  trainerSub: { fontSize: 13, color: "#475569" },

  /* PIP */
  pip: { position: "absolute", bottom: 20, right: 20, width: 160, height: 110, borderRadius: 14, overflow: "hidden", border: "2px solid rgba(255,255,255,0.15)", background: "#1a1f2e", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" },
  pipVideo: { width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" },
  pipOff: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" },
  pipLabel: { position: "absolute", bottom: 6, left: 8, fontSize: 10, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 },

  /* SIDE PANEL */
  sidePanel: { width: 320, borderLeft: "1px solid rgba(255,255,255,0.06)", background: "#111827", display: "flex", flexDirection: "column" },
  tabRow: { display: "flex", alignItems: "center", padding: "12px 16px", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" },
  tab: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 0", borderRadius: 10, border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "inherit" },
  tabActive: { background: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  closePanelBtn: { background: "none", border: "none", color: "#475569", cursor: "pointer", display: "flex", marginLeft: "auto" },

  /* CHAT */
  chatArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  msgList: { flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 8 },
  msgSelf: { flexDirection: "row-reverse" },
  msgAvatar: { width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  msgBubble: (self) => ({ maxWidth: "75%", background: self ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "#1e293b", borderRadius: self ? "14px 14px 2px 14px" : "14px 14px 14px 2px", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 3 }),
  msgName: { fontSize: 10, color: "#94a3b8", fontWeight: 600 },
  msgText: { fontSize: 13, color: "#f1f5f9", lineHeight: 1.4 },
  msgTime: { fontSize: 10, color: "rgba(255,255,255,0.35)", alignSelf: "flex-end" },
  chatInput: { display: "flex", gap: 8, padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  input: { flex: 1, background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none" },
  sendBtn: { background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "none", borderRadius: 10, padding: "0 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" },

  /* PARTICIPANTS */
  participantList: { flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 },
  participantRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.03)" },
  pAvatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 },
  pName: { flex: 1, fontSize: 13, color: "#cbd5e1" },
  hostBadge: { fontSize: 10, background: "rgba(59,130,246,0.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, fontWeight: 600 },

  /* CONTROLS */
  controlBar: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", background: "#111827", borderTop: "1px solid rgba(255,255,255,0.06)" },
};

export default StudentLiveSessions;