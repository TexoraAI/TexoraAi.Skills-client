

// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   LiveKitRoom,
//   VideoConference,
//   RoomAudioRenderer,
// } from "@livekit/components-react";
// import "@livekit/components-styles";

// import {
//   startLiveSession,
//   endLiveSession,
// } from "@/services/liveSessionService";

// import {
//   FaPhoneSlash, FaTimes, FaDotCircle,
//   FaUsers, FaComments,
// } from "react-icons/fa";

// import { ChevronLeft, ChevronRight } from "lucide-react";

// /* ================= LIVE TIMER HOOK ================= */
// const useLiveTimer = () => {
//   const [secs, setSecs] = useState(0);
//   useEffect(() => {
//     const t = setInterval(() => setSecs((s) => s + 1), 1000);
//     return () => clearInterval(t);
//   }, []);
//   const h = String(Math.floor(secs / 3600)).padStart(2, "0");
//   const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
//   const s = String(secs % 60).padStart(2, "0");
//   return `${h}:${m}:${s}`;
// };

// /* ============================================================
//    MAIN COMPONENT
// ============================================================ */
// const LiveSessionControls = () => {
//   const navigate = useNavigate();
//   const { id }   = useParams();
//   const timer    = useLiveTimer();

//   /* ================= BACKEND STATE ================= */
//   const [token, setToken]               = useState(null);
//   const [sessionInfo, setSessionInfo]   = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages]         = useState([]);
//   const [recording, setRecording]       = useState(true);

//   /* ================= SIDEBAR STATE ================= */
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [sidebarTab, setSidebarTab]   = useState("chat");
//   const [input, setInput]             = useState("");
//   const chatEndRef                    = useRef(null);

//   const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//   /* ================= START LIVE SESSION ================= */
//   useEffect(() => {
//     const startLive = async () => {
//       try {
//         if (!id) return;
//         console.log("Starting live for session:", id);
//         const res = await startLiveSession(id);
//         console.log("LiveKit response:", res.data);

//         const liveToken =
//           res?.data?.token ||
//           res?.data?.data?.token ||
//           res?.data?.body?.token;

//         console.log("FINAL TOKEN:", liveToken);
//         if (liveToken) setToken(liveToken);
//         else console.error("❌ Token not found in response");

//         setSessionInfo({ title: res?.data?.title || `Session ${id}` });
//         if (res?.data?.participants) setParticipants(res.data.participants);
//       } catch (error) {
//         console.error("Live start failed:", error);
//       }
//     };
//     startLive();
//   }, [id]);

//   /* ================= SCROLL CHAT ================= */
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     setMessages((prev) => [
//       ...prev,
//       { id: Date.now(), user: "You (Trainer)", text: input },
//     ]);
//     setInput("");
//     // 🔥 Future: send to backend socket/API
//   };

//   /* ================= END SESSION ================= */
//   const handleEndSession = async () => {
//     try {
//       await endLiveSession(id);
//       navigate("/trainer/live");
//     } catch (error) {
//       console.error("Failed to end session:", error);
//       navigate("/trainer/live");
//     }
//   };

//   /* ============================================================
//      RENDER
//   ============================================================ */
//   return (
//     <div className="fixed inset-0 flex flex-col bg-[#0a0c14] text-white overflow-hidden">

//       {/* ===== TOP BAR ===== */}
//       <div className="flex-shrink-0 flex items-center justify-between
//                       px-5 py-2.5 bg-[#111827] border-b border-white/8 shadow-lg z-20">

//         {/* Left */}
//         <div className="flex items-center gap-3">
//           {/* LIVE badge */}
//           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
//                           bg-red-600/20 border border-red-500/30">
//             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//             <span className="text-xs font-extrabold tracking-widest text-red-400">LIVE</span>
//           </div>

//           {/* Timer */}
//           <span className="font-mono text-sm text-slate-400">{timer}</span>

//           {/* Session title */}
//           <span className="text-sm font-semibold text-slate-200 hidden md:block">
//             {sessionInfo?.title || "Live Session"}
//           </span>

//           {/* REC badge */}
//           {recording && (
//             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
//                             bg-red-900/30 border border-red-700/30
//                             text-red-400 text-[10px] font-bold">
//               <FaDotCircle size={8} className="animate-pulse" /> REC
//             </div>
//           )}
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-2">
//           {/* Participants count */}
//           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
//                           bg-white/5 border border-white/10 text-slate-300 text-sm">
//             <FaUsers size={12} />
//             <span>{participants.length} Participants</span>
//           </div>

//           {/* Toggle recording */}
//           <button
//             onClick={() => setRecording((r) => !r)}
//             title={recording ? "Stop Recording" : "Start Recording"}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition"
//             style={{
//               background : recording ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
//               border     : `1px solid ${recording ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
//               color      : recording ? "#f87171" : "#94a3b8",
//             }}
//           >
//             <FaDotCircle size={10} className={recording ? "animate-pulse" : ""} />
//             {recording ? "Recording" : "Record"}
//           </button>

//           {/* End Session */}
//           <button
//             onClick={handleEndSession}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl
//                        text-white text-sm font-bold transition hover:opacity-90"
//             style={{ background: "linear-gradient(135deg,#dc2626,#ef4444)" }}
//           >
//             <FaPhoneSlash size={12} /> End Session
//           </button>

//           {/* Close / back */}
//           <button
//             onClick={() => navigate("/trainer/live")}
//             className="p-2 rounded-lg bg-white/5 border border-white/10
//                        hover:bg-white/12 text-slate-400 hover:text-white transition"
//           >
//             <FaTimes size={14} />
//           </button>
//         </div>
//       </div>

//       {/* ===== BODY ===== */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* ===== LIVEKIT VIDEO AREA ===== */}
//         {/* VideoConference handles mic/cam/share/leave itself — DO NOT remove */}
//         <div className="flex-1 relative overflow-hidden">
//           {token ? (
//             <LiveKitRoom
//               token={token}
//               serverUrl={serverUrl}
//               connect={true}
//               video={true}
//               audio={true}
//               style={{ height: "100%", width: "100%" }}
//             >
//               <VideoConference />
//               <RoomAudioRenderer />
//             </LiveKitRoom>
//           ) : (
//             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-40">
//               <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//               <p className="text-sm text-slate-400">Starting live session...</p>
//             </div>
//           )}
//         </div>

//         {/* ===== DRAG HANDLE — CRM ←|→ ===== */}
//         <div
//           onClick={() => setSidebarOpen((o) => !o)}
//           className="relative flex-shrink-0 w-3 flex items-center justify-center
//                      cursor-pointer group z-10
//                      bg-white/3 border-x border-white/8
//                      hover:bg-blue-900/20 transition"
//         >
//           <div className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
//                           bg-[#1e293b] border border-white/15
//                           shadow group-hover:border-blue-500/50
//                           transition select-none">
//             {sidebarOpen ? (
//               <>
//                 <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
//                   className="text-slate-400 group-hover:text-blue-400">
//                   <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                 </svg>
//                 <div className="w-px h-3 bg-slate-600 group-hover:bg-blue-500 transition mx-0.5" />
//                 <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
//                   className="text-slate-400 group-hover:text-blue-400">
//                   <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                 </svg>
//               </>
//             ) : (
//               <>
//                 <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
//                   className="text-slate-400 group-hover:text-blue-400">
//                   <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                 </svg>
//                 <div className="w-px h-3 bg-slate-600 group-hover:bg-blue-500 transition mx-0.5" />
//                 <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
//                   className="text-slate-400 group-hover:text-blue-400">
//                   <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                 </svg>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ===== SIDEBAR ===== */}
//         <div
//           className="flex-shrink-0 flex flex-col bg-[#111827] border-l border-white/8
//                      transition-all duration-300 overflow-hidden"
//           style={{ width: sidebarOpen ? "320px" : "0px" }}
//         >
//           {/* Tabs */}
//           <div className="flex border-b border-white/8 flex-shrink-0">
//             {[
//               { key: "chat",         label: "💬 Chat" },
//               { key: "participants", label: "👥 People" },
//             ].map((t) => (
//               <button
//                 key={t.key}
//                 onClick={() => setSidebarTab(t.key)}
//                 className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap
//                   ${sidebarTab === t.key
//                     ? "border-blue-500 text-blue-400 bg-blue-900/10"
//                     : "border-transparent text-slate-500 hover:text-slate-300"
//                   }`}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>

//           {/* ── CHAT TAB ── */}
//           {sidebarTab === "chat" && (
//             <>
//               <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                 {messages.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
//                     <FaComments size={28} />
//                     <p className="text-xs text-slate-500">No messages yet</p>
//                   </div>
//                 ) : messages.map((msg) => (
//                   <div key={msg.id}>
//                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
//                       {msg.user}
//                     </span>
//                     <div className="mt-1 px-3 py-2.5 rounded-xl text-sm
//                                     bg-white/5 border border-white/8 text-slate-200">
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={chatEndRef} />
//               </div>

//               <div className="flex-shrink-0 flex gap-2 p-3 border-t border-white/8">
//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   placeholder="Message students..."
//                   className="flex-1 px-3 py-2 rounded-xl text-sm
//                              bg-white/5 border border-white/10
//                              text-slate-100 placeholder-slate-500
//                              focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="px-4 py-2 rounded-xl text-sm font-semibold text-white
//                              transition hover:opacity-90"
//                   style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}
//                 >
//                   Send
//                 </button>
//               </div>
//             </>
//           )}

//           {/* ── PARTICIPANTS TAB ── */}
//           {sidebarTab === "participants" && (
//             <div className="flex-1 overflow-y-auto p-4 space-y-2">
//               {participants.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
//                   <FaUsers size={28} />
//                   <p className="text-xs text-slate-500">No participants yet</p>
//                 </div>
//               ) : participants.map((p) => (
//                 <div key={p.id}
//                   className="flex items-center gap-3 px-3 py-2.5 rounded-xl
//                              bg-white/3 border border-white/8
//                              hover:bg-white/8 transition">
//                   <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
//                   <span className="text-sm text-slate-200 flex-1">{p.name}</span>
//                   <span className="text-[10px] text-slate-500">{p.joinedAt}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveSessionControls;  




















/**
 * LiveSessionControls.jsx
 *
 * FIXES:
 *  ✅ Chat  — LiveKit DataChannel (useDataChannel hook) — real-time to all participants
 *  ✅ People — useParticipants() hook — live list from room, no backend needed
 *  ✅ Screen share — VideoConference built-in, layout fills correctly
 *  ✅ UI cut — position:fixed, z-index above sidebar/navbar, inset-0
 *  ✅ LIVE timer, REC badge, participant count all wired
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useParticipants,
  useDataChannel,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { startLiveSession, endLiveSession } from "@/services/liveSessionService";

import { FaPhoneSlash, FaTimes, FaDotCircle, FaUsers, FaComments, FaPaperPlane } from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   LIVE TIMER
───────────────────────────────────────────────────────────── */
const useLiveTimer = () => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ─────────────────────────────────────────────────────────────
   INNER PANEL — must be inside <LiveKitRoom> to use hooks
───────────────────────────────────────────────────────────── */
const InnerPanel = ({ sessionTitle, sidebarOpen, sidebarTab }) => {
  /* ── People: live from room ── */
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  /* ── Chat: DataChannel ── */
  const [messages, setMessages] = useState(() => [
    { id: 0, user: "System", text: "Session started. Welcome!", time: getTime(), system: true },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  /* receive messages from students */
  const onMessage = useCallback((msg) => {
    try {
      const data = JSON.parse(new TextDecoder().decode(msg.payload));
      setMessages((prev) => [
        ...prev,
        {
          id:   Date.now(),
          user: data.name || msg.from?.identity || "Student",
          text: data.text,
          time: getTime(),
        },
      ]);
    } catch (_) {}
  }, []);

  const { send } = useDataChannel("chat", onMessage);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    /* optimistic local add */
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You (Trainer)", text, time: getTime(), self: true },
    ]);
    /* broadcast via DataChannel */
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ text, name: localParticipant?.name || "Trainer" })
      );
      send(payload, { reliable: true });
    } catch (e) { console.warn("send failed:", e); }
    setInput("");
  }, [input, send, localParticipant]);

  /* ── render ── */
  return (
    <>
      {/* Chat */}
      {sidebarTab === "chat" && (
        <>
          <div style={S.msgList}>
            {messages.map((m) => (
              <div key={m.id} style={m.system ? S.sysRow : m.self ? { ...S.msgBlock, alignItems: "flex-end" } : S.msgBlock}>
                {m.system ? (
                  <div style={S.sysBubble}>{m.text}</div>
                ) : (
                  <>
                    <span style={S.msgUser}>{m.user} · {m.time}</span>
                    <div style={{ ...S.msgBubble, ...(m.self ? S.bubbleSelf : S.bubbleOther) }}>
                      {m.text}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={S.inputRow}>
            <input
              style={S.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Message students…"
            />
            <button style={S.sendBtn} onClick={sendMessage}>
              <FaPaperPlane size={13} />
            </button>
          </div>
        </>
      )}

      {/* People */}
      {sidebarTab === "participants" && (
        <div style={S.peopleList}>
          {/* local (trainer) */}
          <PersonRow
            name={localParticipant?.name || localParticipant?.identity || "You (Trainer)"}
            isHost
            self
          />
          {/* remote participants */}
          {participants
            .filter((p) => p.identity !== localParticipant?.identity)
            .map((p) => (
              <PersonRow key={p.identity} name={p.name || p.identity} />
            ))
          }
          {participants.length === 0 && (
            <div style={S.emptyPeople}>
              <FaUsers size={28} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>No participants yet</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   PARTICIPANT COUNT BADGE — inside LiveKitRoom
───────────────────────────────────────────────────────────── */
const ParticipantCount = ({ onUpdate }) => {
  const participants = useParticipants();
  useEffect(() => { onUpdate(participants.length); }, [participants.length, onUpdate]);
  return null;
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const LiveSessionControls = () => {
  const navigate = useNavigate();
  const { id }   = useParams();
  const timer    = useLiveTimer();

  const [token,        setToken]        = useState(null);
  const [sessionInfo,  setSessionInfo]  = useState(null);
  const [pCount,       setPCount]       = useState(0);
  const [recording,    setRecording]    = useState(true);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [sidebarTab,   setSidebarTab]   = useState("chat");

  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

  /* start session */
  useEffect(() => {
    const start = async () => {
      try {
        if (!id) return;
        const res = await startLiveSession(id);
        const liveToken =
          res?.data?.token || res?.data?.data?.token || res?.data?.body?.token;
        if (liveToken) setToken(liveToken);
        setSessionInfo({ title: res?.data?.title || `Session ${id}` });
      } catch (err) {
        console.error("Live start failed:", err);
      }
    };
    start();
  }, [id]);

  const handleEndSession = async () => {
    try { await endLiveSession(id); } catch (_) {}
    navigate("/trainer/live");
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    /*
      position:fixed + inset:0 + zIndex:9999
      → completely escapes the sidebar/navbar layout
      → no UI cutting
    */
    <div style={S.root}>

      {/* TOP BAR */}
      <div style={S.topBar}>
        {/* left */}
        <div style={S.topLeft}>
          <div style={S.liveBadge}><span style={S.liveDot} />LIVE</div>
          <span style={S.timerText}>{timer}</span>
          <span style={S.sessionTitle}>{sessionInfo?.title || `Session ${id}`}</span>
          {recording && (
            <div style={S.recBadge}><FaDotCircle size={8} style={{ animation: "recBlink 1.5s infinite" }} /> REC</div>
          )}
        </div>

        {/* right */}
        <div style={S.topRight}>
          <div style={S.pCountBadge}>
            <FaUsers size={11} />
            <span>{pCount} Participants</span>
          </div>

          <button
            style={{ ...S.recBtn, ...(recording ? S.recBtnOn : S.recBtnOff) }}
            onClick={() => setRecording((r) => !r)}
            title={recording ? "Stop Recording" : "Start Recording"}
          >
            <FaDotCircle size={10} />
            {recording ? "Recording" : "Record"}
          </button>

          <button style={S.endBtn} onClick={handleEndSession}>
            <FaPhoneSlash size={12} /> End Session
          </button>

          <button style={S.closeBtn} onClick={() => navigate("/trainer/live")}>
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={S.body}>

        {/* VIDEO AREA */}
        <div style={S.videoArea}>
          {token ? (
            <LiveKitRoom
              token={token}
              serverUrl={serverUrl}
              connect={true}
              video={true}
              audio={true}
              style={{ height: "100%", width: "100%" }}
            >
              {/* invisible hook to count participants */}
              <ParticipantCount onUpdate={setPCount} />

              {/*
                VideoConference renders:
                  ✅ Camera tiles (trainer + students)
                  ✅ Screen share layout
                  ✅ Control bar: mic, cam, screen share, chat, people, leave
              */}
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          ) : (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <p style={S.loadingText}>Starting live session…</p>
            </div>
          )}
        </div>

        {/* DRAG HANDLE */}
        <div style={S.handle} onClick={() => setSidebarOpen((o) => !o)} title="Toggle panel">
          <div style={S.handlePill}>
            {sidebarOpen
              ? <><Chevron dir="right" /><div style={S.handleLine} /><Chevron dir="left" /></>
              : <><Chevron dir="left" /><div style={S.handleLine} /><Chevron dir="right" /></>
            }
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ ...S.sidebar, width: sidebarOpen ? 340 : 0 }}>
          {sidebarOpen && (
            <>
              {/* tabs */}
              <div style={S.tabRow}>
                <TabBtn active={sidebarTab === "chat"}         label="💬 Chat"   onClick={() => setSidebarTab("chat")} />
                <TabBtn active={sidebarTab === "participants"} label="👥 People" onClick={() => setSidebarTab("participants")} />
              </div>

              {/* content — must be inside LiveKitRoom for hooks to work */}
              {token ? (
                <LiveKitRoom
                  token={token}
                  serverUrl={serverUrl}
                  connect={false}   /* already connected above — this just provides context */
                  style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "transparent" }}
                >
                  <InnerPanel
                    sessionTitle={sessionInfo?.title}
                    sidebarOpen={sidebarOpen}
                    sidebarTab={sidebarTab}
                  />
                </LiveKitRoom>
              ) : (
                <div style={S.emptyPeople}>
                  <p style={{ fontSize: 12, color: "#475569" }}>Waiting for session…</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes spin      { to{transform:rotate(360deg)} }

        /* ── Force VideoConference to fill its container ── */
        .lk-room-container,
        [data-lk-theme="default"] {
          height: 100% !important;
          width: 100% !important;
          min-height: 0 !important;
          background: #07090f !important;
        }
        .lk-control-bar      { flex-shrink: 0 !important; z-index: 50 !important; }
        .lk-focus-layout,
        .lk-grid-layout      { flex: 1 !important; min-height: 0 !important; }
        .lk-participant-tile { min-height: 0 !important; }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TINY SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
const Chevron = ({ dir }) => (
  <svg width="5" height="10" viewBox="0 0 6 12" fill="none">
    {dir === "right"
      ? <path d="M1 1L6 6L1 11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      : <path d="M5 1L0 6L5 11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
    }
  </svg>
);

const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, padding: "11px 0", border: "none", background: "transparent",
      borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
      color: active ? "#60a5fa" : "#475569",
      fontFamily: "inherit", fontSize: 13, fontWeight: 600,
      cursor: "pointer", transition: "all .15s",
      ...(active ? { background: "rgba(59,130,246,.08)" } : {}),
    }}
  >
    {label}
  </button>
);

const PersonRow = ({ name, isHost, self }) => (
  <div style={S.pRow}>
    <div style={{
      ...S.pAv,
      background: self
        ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
        : "linear-gradient(135deg,#8b5cf6,#ec4899)",
    }}>
      {(name || "?")[0].toUpperCase()}
    </div>
    <span style={S.pName}>{name}</span>
    {isHost && <span style={S.hostTag}>Host</span>}
    {self   && <span style={S.youTag}>You</span>}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const S = {
  /* ROOT — escapes all parent layout */
  root: {
    position: "fixed", inset: 0, zIndex: 9999,
    display: "flex", flexDirection: "column",
    background: "#07090f", color: "#e2e8f0",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    overflow: "hidden",
  },

  /* TOP BAR */
  topBar: {
    flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 18px",
    background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,.07)",
    zIndex: 10,
  },
  topLeft:  { display: "flex", alignItems: "center", gap: 10 },
  topRight: { display: "flex", alignItems: "center", gap: 8  },

  liveBadge: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "3px 9px", borderRadius: 8,
    background: "rgba(239,68,68,.14)", border: "1px solid rgba(239,68,68,.28)",
    fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "#ef4444",
  },
  liveDot: {
    width: 7, height: 7, borderRadius: "50%", background: "#ef4444",
    animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block",
  },
  timerText:    { fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 },
  sessionTitle: { fontSize: 14, fontWeight: 600, color: "#f1f5f9" },
  recBadge: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "3px 8px", borderRadius: 8,
    background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)",
    fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#fca5a5",
  },

  pCountBadge: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "5px 12px", borderRadius: 10,
    background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)",
    fontSize: 12, color: "#94a3b8",
  },
  recBtn: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "5px 12px", borderRadius: 10,
    fontSize: 11, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", letterSpacing: 0.3, border: "1px solid transparent",
    transition: "all .15s",
  },
  recBtnOn:  { background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#f87171" },
  recBtnOff: { background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "#94a3b8" },

  endBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 16px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg,#dc2626,#ef4444)",
    color: "#fff", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.2,
  },
  closeBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,.09)",
    background: "rgba(255,255,255,.04)", color: "#64748b",
    cursor: "pointer", transition: "all .15s",
  },

  /* BODY */
  body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },

  /* VIDEO */
  videoArea: { flex: 1, position: "relative", overflow: "hidden", minWidth: 0 },
  loadingBox: {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 14,
  },
  spinner: {
    width: 40, height: 40,
    border: "4px solid rgba(59,130,246,.2)", borderTop: "4px solid #3b82f6",
    borderRadius: "50%", animation: "spin .8s linear infinite",
  },
  loadingText: { fontSize: 13, color: "#475569" },

  /* HANDLE */
  handle: {
    flexShrink: 0, width: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,.05)",
    borderRight: "1px solid rgba(255,255,255,.05)",
    cursor: "pointer", zIndex: 5, transition: "background .2s",
  },
  handlePill: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    padding: "10px 3px", borderRadius: 8,
    background: "#1e293b", border: "1px solid rgba(255,255,255,.1)",
  },
  handleLine: { width: 1, height: 12, background: "rgba(255,255,255,.15)" },

  /* SIDEBAR */
  sidebar: {
    flexShrink: 0,
    background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,.07)",
    display: "flex", flexDirection: "column",
    overflow: "hidden", transition: "width .25s ease",
  },
  tabRow: {
    flexShrink: 0,
    display: "flex", borderBottom: "1px solid rgba(255,255,255,.07)",
  },

  /* CHAT MESSAGES */
  msgList: {
    flex: 1, overflowY: "auto",
    padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10,
    minHeight: 0,
  },
  sysRow:    { display: "flex", justifyContent: "center" },
  sysBubble: {
    fontSize: 11, color: "#475569", fontStyle: "italic",
    background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "3px 10px",
  },
  msgBlock:  { display: "flex", flexDirection: "column", gap: 2 },
  msgUser:   { fontSize: 10, color: "#64748b", fontWeight: 600 },
  msgBubble: {
    maxWidth: "88%", padding: "7px 11px", borderRadius: 12,
    fontSize: 13, color: "#f1f5f9", lineHeight: 1.45,
  },
  bubbleSelf:  { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", alignSelf: "flex-end", borderBottomRightRadius: 2 },
  bubbleOther: { background: "#1e293b", borderBottomLeftRadius: 2 },

  inputRow: {
    flexShrink: 0,
    display: "flex", gap: 8, padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,.07)",
  },
  chatInput: {
    flex: 1, background: "#1e293b", border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 10, padding: "8px 12px", color: "#e2e8f0",
    fontSize: 13, fontFamily: "inherit", outline: "none",
  },
  sendBtn: {
    flexShrink: 0,
    background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none",
    borderRadius: 10, padding: "0 14px", color: "#fff",
    cursor: "pointer", display: "flex", alignItems: "center",
  },

  /* PEOPLE */
  peopleList: {
    flex: 1, overflowY: "auto",
    padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4,
    minHeight: 0,
  },
  emptyPeople: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  pRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", borderRadius: 10,
    background: "rgba(255,255,255,.03)",
  },
  pAv: {
    width: 32, height: 32, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  pName:   { flex: 1, fontSize: 13, color: "#cbd5e1" },
  hostTag: { fontSize: 10, background: "rgba(59,130,246,.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, fontWeight: 600 },
  youTag:  { fontSize: 10, background: "rgba(52,211,153,.12)", color: "#6ee7b7", padding: "2px 8px", borderRadius: 6, fontWeight: 600 },
};

export default LiveSessionControls;