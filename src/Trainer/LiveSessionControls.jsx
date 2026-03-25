// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import LiveKitRoomComponent from "@/components/live/LiveKitRoomComponent";
// import {
//   startLiveSession,
//   endLiveSession,
// } from "@/services/liveSessionService";
// import {
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideo,
//   FaVideoSlash,
//   FaDesktop,
//   FaComments,
//   FaUsers,
//   FaPhoneSlash,
//   FaTimes,
//   FaDotCircle,
// } from "react-icons/fa";

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

// const LiveSessionControls = () => {
//   const navigate = useNavigate();

//   // ✅ File 2 fix: use `id` not `sessionId`
//   const { id } = useParams();

//   /* ================= BACKEND DATA STATE ================= */
//   const [token, setToken] = useState(null);
//   const [sessionInfo, setSessionInfo] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages] = useState([]);

//   /* ================= CONTROL STATE ================= */
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [screenShare, setScreenShare] = useState(false);
//   const [recording, setRecording] = useState(true);
//   const [showChat, setShowChat] = useState(true);
//   const [sidebarTab, setSidebarTab] = useState("chat");
//   const [input, setInput] = useState("");

//   const chatEndRef = useRef(null);
//   const timer = useLiveTimer();

//   /* ================= START LIVE SESSION (File 2 backend) ================= */
//   useEffect(() => {
//     const startLive = async () => {
//       try {
//         if (!id) return;

//         console.log("Starting live for session:", id);

//         const res = await startLiveSession(id);

//         console.log("LiveKit response:", res.data);

//         // Safely extract token from various response shapes
//         const liveToken =
//           res?.data?.token ||
//           res?.data?.data?.token ||
//           res?.data?.body?.token;

//         console.log("FINAL TOKEN:", liveToken);

//         if (liveToken) {
//           setToken(liveToken);
//         } else {
//           console.error("❌ Token not found in response");
//         }

//         setSessionInfo({
//           title: res?.data?.title || `Session ${id}`,
//         });

//         // Load participants if returned
//         if (res?.data?.participants) {
//           setParticipants(res.data.participants);
//         }
//       } catch (error) {
//         console.error("Live start failed:", error);
//       }
//     };

//     startLive();
//   }, [id]);

//   /* ================= SCROLL CHAT TO BOTTOM ================= */
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const newMsg = { id: Date.now(), user: "You (Trainer)", text: input };
//     setMessages((prev) => [...prev, newMsg]);
//     setInput("");
//     // 🔥 Future: send to backend socket/API
//   };

//   /* ================= END SESSION (File 2 backend) ================= */
//   const handleEndSession = async () => {
//     try {
//       await endLiveSession(id);
//       navigate("/trainer/live");
//     } catch (error) {
//       console.error("Failed to end session:", error);
//       navigate("/trainer/live");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex flex-col bg-gray-100 text-gray-900 dark:bg-[#0B1120] dark:text-white">

//       {/* ================= TOP BAR ================= */}
//       <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md dark:bg-[#111827] dark:border-b dark:border-white/10">
//         <div className="flex items-center gap-3">
//           <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
//           <span className="font-semibold tracking-wide text-red-500">LIVE</span>
//           <span className="text-sm font-mono text-gray-500 dark:text-slate-400">
//             {timer}
//           </span>
//           <span className="text-sm text-gray-500 dark:text-slate-400">
//             {sessionInfo?.title || "Live Session"}
//           </span>
//         </div>

//         <div className="flex items-center gap-6">
//           <span className="text-sm text-gray-500 dark:text-slate-400">
//             👥 {participants.length} Participants
//           </span>
//           <button
//             onClick={handleEndSession}
//             className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition flex items-center gap-2"
//           >
//             <FaPhoneSlash size={12} /> End Session
//           </button>
//           <button
//             onClick={() => navigate("/trainer/live")}
//             className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-[#1F2937] dark:hover:bg-[#374151]"
//           >
//             <FaTimes size={14} />
//           </button>
//         </div>
//       </div>

//       {/* ================= MAIN ================= */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* ================= VIDEO GRID ================= */}
//         <div className="flex-1 p-6 grid grid-cols-4 grid-rows-2 gap-5">

//           {/* Main camera / LiveKit stream */}
//           <div className="col-span-3 row-span-2 bg-black rounded-3xl shadow-2xl relative flex items-center justify-center text-white">

//             {/* ✅ LiveKit when token available, fallback UI otherwise */}
//             {token ? (
//               <LiveKitRoomComponent token={token} />
//             ) : camOn ? (
//               <div className="text-center opacity-50">
//                 <FaVideo size={48} className="mx-auto mb-3" />
//                 <p className="text-sm">Starting live session...</p>
//               </div>
//             ) : (
//               <div className="text-center opacity-50">
//                 <FaVideoSlash size={48} className="mx-auto mb-3" />
//                 <p className="text-sm">Camera Off</p>
//               </div>
//             )}

//             {/* Recording badge */}
//             {recording && (
//               <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-600/90 rounded-full text-xs font-semibold backdrop-blur-sm">
//                 <FaDotCircle className="animate-pulse" size={8} />
//                 REC
//               </div>
//             )}

//             {/* Screen share badge */}
//             {screenShare && (
//               <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-blue-600/90 rounded-full text-xs font-semibold backdrop-blur-sm">
//                 <FaDesktop size={10} />
//                 Sharing Screen
//               </div>
//             )}
//           </div>

//           {/* Participant tiles */}
//           {participants.length === 0 ? (
//             <div className="rounded-3xl shadow-lg flex flex-col items-center justify-center text-xs text-gray-400 bg-white border border-gray-200 dark:bg-[#1F2937] dark:border-white/10 gap-2">
//               <FaUsers size={18} className="opacity-30" />
//               <span>Waiting...</span>
//             </div>
//           ) : (
//             participants.slice(0, 2).map((u) => (
//               <div
//                 key={u.id}
//                 className="rounded-3xl shadow-lg flex items-center justify-center text-sm bg-white border border-gray-200 dark:bg-[#1F2937] dark:border-white/10 font-medium"
//               >
//                 {u.name}
//               </div>
//             ))
//           )}
//         </div>

//         {/* ================= SIDEBAR ================= */}
//         {showChat && (
//           <div className="w-96 flex flex-col bg-white shadow-lg border-l border-gray-200 dark:bg-[#111827] dark:border-white/10">

//             {/* Sidebar Tabs */}
//             <div className="flex border-b border-gray-200 dark:border-white/10">
//               {[
//                 { key: "chat", label: "💬 Chat" },
//                 { key: "participants", label: "👥 People" },
//               ].map((t) => (
//                 <button
//                   key={t.key}
//                   onClick={() => setSidebarTab(t.key)}
//                   className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
//                     sidebarTab === t.key
//                       ? "border-blue-600 text-blue-600"
//                       : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700"
//                   }`}
//                 >
//                   {t.label}
//                 </button>
//               ))}
//             </div>

//             {/* Chat Tab */}
//             {sidebarTab === "chat" && (
//               <>
//                 <div className="flex-1 overflow-y-auto p-5 space-y-4">
//                   {messages.length === 0 ? (
//                     <p className="text-sm text-gray-400 dark:text-slate-500">
//                       No messages yet
//                     </p>
//                   ) : (
//                     messages.map((msg) => (
//                       <div key={msg.id}>
//                         <span className="text-xs text-gray-500 dark:text-slate-400">
//                           {msg.user}
//                         </span>
//                         <div className="mt-1 px-4 py-3 rounded-2xl text-sm bg-gray-100 dark:bg-[#1F2937]">
//                           {msg.text}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                   <div ref={chatEndRef} />
//                 </div>

//                 <div className="p-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
//                   <input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                     placeholder="Message students..."
//                     className="flex-1 px-4 py-2 rounded-xl text-sm outline-none bg-gray-100 dark:bg-[#1F2937] dark:text-white placeholder:text-gray-400"
//                   />
//                   <button
//                     onClick={sendMessage}
//                     className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-500 transition"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Participants Tab */}
//             {sidebarTab === "participants" && (
//               <div className="flex-1 overflow-y-auto p-5 space-y-3">
//                 {participants.length === 0 ? (
//                   <p className="text-sm text-gray-400 dark:text-slate-500">
//                     No participants yet
//                   </p>
//                 ) : (
//                   participants.map((p) => (
//                     <div
//                       key={p.id}
//                       className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1F2937] transition"
//                     >
//                       <span className="w-2 h-2 rounded-full bg-green-500" />
//                       <span className="text-sm font-medium flex-1">{p.name}</span>
//                       <span className="text-xs text-gray-400 dark:text-slate-500">
//                         {p.joinedAt}
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ================= CONTROL BAR ================= */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-gray-200 dark:bg-[#111827] dark:border-white/10 px-8 py-4 rounded-full flex gap-5">

//         <button
//           title={micOn ? "Mute" : "Unmute"}
//           onClick={() => setMicOn(!micOn)}
//           className={`p-4 rounded-full transition ${
//             micOn
//               ? "bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151]"
//               : "bg-red-600 text-white hover:bg-red-500"
//           }`}
//         >
//           {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
//         </button>

//         <button
//           title={camOn ? "Stop Camera" : "Start Camera"}
//           onClick={() => setCamOn(!camOn)}
//           className={`p-4 rounded-full transition ${
//             camOn
//               ? "bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151]"
//               : "bg-red-600 text-white hover:bg-red-500"
//           }`}
//         >
//           {camOn ? <FaVideo /> : <FaVideoSlash />}
//         </button>

//         <button
//           title="Share Screen"
//           onClick={() => setScreenShare(!screenShare)}
//           className={`p-4 rounded-full transition ${
//             screenShare
//               ? "bg-blue-600 text-white"
//               : "bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151]"
//           }`}
//         >
//           <FaDesktop />
//         </button>

//         <button
//           title="Toggle Recording"
//           onClick={() => setRecording(!recording)}
//           className={`p-4 rounded-full transition ${
//             recording
//               ? "bg-red-100 dark:bg-red-900/30 text-red-600"
//               : "bg-gray-100 dark:bg-[#1F2937]"
//           }`}
//         >
//           <FaDotCircle />
//         </button>

//         <button
//           title="Toggle Chat"
//           onClick={() => setShowChat(!showChat)}
//           className={`p-4 rounded-full transition ${
//             showChat
//               ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
//               : "bg-gray-100 dark:bg-[#1F2937]"
//           }`}
//         >
//           <FaComments />
//         </button>

//         <button
//           title="Participants"
//           onClick={() => { setShowChat(true); setSidebarTab("participants"); }}
//           className="p-4 rounded-full bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151] transition"
//         >
//           <FaUsers />
//         </button>

//         <button
//           title="End Session"
//           onClick={handleEndSession}
//           className="p-4 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
//         >
//           <FaPhoneSlash />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LiveSessionControls;














































import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";

import {
  startLiveSession,
  endLiveSession,
} from "@/services/liveSessionService";

import {
  FaPhoneSlash, FaTimes, FaDotCircle,
  FaUsers, FaComments,
} from "react-icons/fa";

import { ChevronLeft, ChevronRight } from "lucide-react";

/* ================= LIVE TIMER HOOK ================= */
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

/* ============================================================
   MAIN COMPONENT
============================================================ */
const LiveSessionControls = () => {
  const navigate = useNavigate();
  const { id }   = useParams();
  const timer    = useLiveTimer();

  /* ================= BACKEND STATE ================= */
  const [token, setToken]               = useState(null);
  const [sessionInfo, setSessionInfo]   = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages]         = useState([]);
  const [recording, setRecording]       = useState(true);

  /* ================= SIDEBAR STATE ================= */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab]   = useState("chat");
  const [input, setInput]             = useState("");
  const chatEndRef                    = useRef(null);

  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

  /* ================= START LIVE SESSION ================= */
  useEffect(() => {
    const startLive = async () => {
      try {
        if (!id) return;
        console.log("Starting live for session:", id);
        const res = await startLiveSession(id);
        console.log("LiveKit response:", res.data);

        const liveToken =
          res?.data?.token ||
          res?.data?.data?.token ||
          res?.data?.body?.token;

        console.log("FINAL TOKEN:", liveToken);
        if (liveToken) setToken(liveToken);
        else console.error("❌ Token not found in response");

        setSessionInfo({ title: res?.data?.title || `Session ${id}` });
        if (res?.data?.participants) setParticipants(res.data.participants);
      } catch (error) {
        console.error("Live start failed:", error);
      }
    };
    startLive();
  }, [id]);

  /* ================= SCROLL CHAT ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You (Trainer)", text: input },
    ]);
    setInput("");
    // 🔥 Future: send to backend socket/API
  };

  /* ================= END SESSION ================= */
  const handleEndSession = async () => {
    try {
      await endLiveSession(id);
      navigate("/trainer/live");
    } catch (error) {
      console.error("Failed to end session:", error);
      navigate("/trainer/live");
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="fixed inset-0 flex flex-col bg-[#0a0c14] text-white overflow-hidden">

      {/* ===== TOP BAR ===== */}
      <div className="flex-shrink-0 flex items-center justify-between
                      px-5 py-2.5 bg-[#111827] border-b border-white/8 shadow-lg z-20">

        {/* Left */}
        <div className="flex items-center gap-3">
          {/* LIVE badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                          bg-red-600/20 border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-extrabold tracking-widest text-red-400">LIVE</span>
          </div>

          {/* Timer */}
          <span className="font-mono text-sm text-slate-400">{timer}</span>

          {/* Session title */}
          <span className="text-sm font-semibold text-slate-200 hidden md:block">
            {sessionInfo?.title || "Live Session"}
          </span>

          {/* REC badge */}
          {recording && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                            bg-red-900/30 border border-red-700/30
                            text-red-400 text-[10px] font-bold">
              <FaDotCircle size={8} className="animate-pulse" /> REC
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Participants count */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                          bg-white/5 border border-white/10 text-slate-300 text-sm">
            <FaUsers size={12} />
            <span>{participants.length} Participants</span>
          </div>

          {/* Toggle recording */}
          <button
            onClick={() => setRecording((r) => !r)}
            title={recording ? "Stop Recording" : "Start Recording"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition"
            style={{
              background : recording ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
              border     : `1px solid ${recording ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
              color      : recording ? "#f87171" : "#94a3b8",
            }}
          >
            <FaDotCircle size={10} className={recording ? "animate-pulse" : ""} />
            {recording ? "Recording" : "Record"}
          </button>

          {/* End Session */}
          <button
            onClick={handleEndSession}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       text-white text-sm font-bold transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#dc2626,#ef4444)" }}
          >
            <FaPhoneSlash size={12} /> End Session
          </button>

          {/* Close / back */}
          <button
            onClick={() => navigate("/trainer/live")}
            className="p-2 rounded-lg bg-white/5 border border-white/10
                       hover:bg-white/12 text-slate-400 hover:text-white transition"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== LIVEKIT VIDEO AREA ===== */}
        {/* VideoConference handles mic/cam/share/leave itself — DO NOT remove */}
        <div className="flex-1 relative overflow-hidden">
          {token ? (
            <LiveKitRoom
              token={token}
              serverUrl={serverUrl}
              connect={true}
              video={true}
              audio={true}
              style={{ height: "100%", width: "100%" }}
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-40">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Starting live session...</p>
            </div>
          )}
        </div>

        {/* ===== DRAG HANDLE — CRM ←|→ ===== */}
        <div
          onClick={() => setSidebarOpen((o) => !o)}
          className="relative flex-shrink-0 w-3 flex items-center justify-center
                     cursor-pointer group z-10
                     bg-white/3 border-x border-white/8
                     hover:bg-blue-900/20 transition"
        >
          <div className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
                          bg-[#1e293b] border border-white/15
                          shadow group-hover:border-blue-500/50
                          transition select-none">
            {sidebarOpen ? (
              <>
                <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
                  className="text-slate-400 group-hover:text-blue-400">
                  <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div className="w-px h-3 bg-slate-600 group-hover:bg-blue-500 transition mx-0.5" />
                <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
                  className="text-slate-400 group-hover:text-blue-400">
                  <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </>
            ) : (
              <>
                <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
                  className="text-slate-400 group-hover:text-blue-400">
                  <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div className="w-px h-3 bg-slate-600 group-hover:bg-blue-500 transition mx-0.5" />
                <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
                  className="text-slate-400 group-hover:text-blue-400">
                  <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </div>
        </div>

        {/* ===== SIDEBAR ===== */}
        <div
          className="flex-shrink-0 flex flex-col bg-[#111827] border-l border-white/8
                     transition-all duration-300 overflow-hidden"
          style={{ width: sidebarOpen ? "320px" : "0px" }}
        >
          {/* Tabs */}
          <div className="flex border-b border-white/8 flex-shrink-0">
            {[
              { key: "chat",         label: "💬 Chat" },
              { key: "participants", label: "👥 People" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setSidebarTab(t.key)}
                className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap
                  ${sidebarTab === t.key
                    ? "border-blue-500 text-blue-400 bg-blue-900/10"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── CHAT TAB ── */}
          {sidebarTab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
                    <FaComments size={28} />
                    <p className="text-xs text-slate-500">No messages yet</p>
                  </div>
                ) : messages.map((msg) => (
                  <div key={msg.id}>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {msg.user}
                    </span>
                    <div className="mt-1 px-3 py-2.5 rounded-xl text-sm
                                    bg-white/5 border border-white/8 text-slate-200">
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="flex-shrink-0 flex gap-2 p-3 border-t border-white/8">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message students..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm
                             bg-white/5 border border-white/10
                             text-slate-100 placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white
                             transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}
                >
                  Send
                </button>
              </div>
            </>
          )}

          {/* ── PARTICIPANTS TAB ── */}
          {sidebarTab === "participants" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {participants.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
                  <FaUsers size={28} />
                  <p className="text-xs text-slate-500">No participants yet</p>
                </div>
              ) : participants.map((p) => (
                <div key={p.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             bg-white/3 border border-white/8
                             hover:bg-white/8 transition">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm text-slate-200 flex-1">{p.name}</span>
                  <span className="text-[10px] text-slate-500">{p.joinedAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSessionControls;