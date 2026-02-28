// import React, { useState } from "react";

// const LiveSessionControls = () => {
//   const [participants] = useState(["Ali", "Sara", "Ahmed"]);
//   const [chatEnabled, setChatEnabled] = useState(true);

//   const handleEnd = () => {
//     alert("Session Ended");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Live Session Controls</h2>

//       <div className="mb-4">
//         <p>Total Participants: {participants.length}</p>
//       </div>

//       <div className="mb-4">
//         <button className="bg-yellow-500 text-white px-4 py-2 mr-3 rounded">
//           Mute All
//         </button>

//         <button
//           onClick={() => setChatEnabled(!chatEnabled)}
//           className="bg-gray-600 text-white px-4 py-2 rounded"
//         >
//           {chatEnabled ? "Disable Chat" : "Enable Chat"}
//         </button>
//       </div>

//       <div className="mb-4">
//         <h3 className="font-semibold">Participants</h3>
//         <ul>
//           {participants.map((p, index) => (
//             <li key={index} className="border p-2 mb-1">
//               {p}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button
//         onClick={handleEnd}
//         className="bg-red-600 text-white px-6 py-2 rounded"
//       >
//         End Session
//       </button>
//     </div>
//   );
// };

// export default LiveSessionControls;






import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaComments,
  FaUsers,
  FaPhoneSlash,
  FaTimes,
  FaDotCircle,
} from "react-icons/fa";

// ================= LIVE TIMER HOOK =================
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

const LiveSessionControls = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  /* ================= BACKEND DATA STATE ================= */
  const [sessionInfo, setSessionInfo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  /* ================= CONTROL STATE ================= */
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [recording, setRecording] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("chat");
  const [input, setInput] = useState("");

  const chatEndRef = useRef(null);
  const timer = useLiveTimer();

  /* ================= FETCH FROM BACKEND ================= */
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // 🔥 Future API Call
        // const res = await fetch(`/api/trainer/sessions/${sessionId}/live`);
        // const data = await res.json();
        // setSessionInfo(data.session);
        // setParticipants(data.participants);
        // setMessages(data.messages);
      } catch (error) {
        console.error("Failed to fetch live session:", error);
      }
    };

    fetchSession();
  }, [sessionId]);

  /* ================= SCROLL CHAT TO BOTTOM ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), user: "You (Trainer)", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    // 🔥 Future: send to backend socket/API
  };

  const handleEndSession = async () => {
    try {
      // 🔥 Future API Call
      // await fetch(`/api/trainer/sessions/${sessionId}/end`, { method: "POST" });
      navigate("/trainer/live");
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100 text-gray-900 dark:bg-[#0B1120] dark:text-white">

      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md dark:bg-[#111827] dark:border-b dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="font-semibold tracking-wide text-red-500">LIVE</span>
          <span className="text-sm font-mono text-gray-500 dark:text-slate-400">
            {timer}
          </span>
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {sessionInfo?.title || "Live Session"}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            👥 {participants.length} Participants
          </span>
          <button
            onClick={handleEndSession}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition flex items-center gap-2"
          >
            <FaPhoneSlash size={12} /> End Session
          </button>
          <button
            onClick={() => navigate("/trainer/live")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-[#1F2937] dark:hover:bg-[#374151]"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 overflow-hidden">

        {/* ================= VIDEO GRID ================= */}
        <div className="flex-1 p-6 grid grid-cols-4 grid-rows-2 gap-5">

          {/* Main camera / instructor view */}
          <div className="col-span-3 row-span-2 bg-black rounded-3xl shadow-2xl relative flex items-center justify-center text-white">
            {camOn ? (
              <div className="text-center opacity-50">
                <FaVideo size={48} className="mx-auto mb-3" />
                <p className="text-sm">Camera Active</p>
              </div>
            ) : (
              <div className="text-center opacity-50">
                <FaVideoSlash size={48} className="mx-auto mb-3" />
                <p className="text-sm">Camera Off</p>
              </div>
            )}

            {/* Recording badge */}
            {recording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-600/90 rounded-full text-xs font-semibold backdrop-blur-sm">
                <FaDotCircle className="animate-pulse" size={8} />
                REC
              </div>
            )}

            {/* Screen share badge */}
            {screenShare && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-blue-600/90 rounded-full text-xs font-semibold backdrop-blur-sm">
                <FaDesktop size={10} />
                Sharing Screen
              </div>
            )}
          </div>

          {/* Participant tiles */}
          {participants.length === 0 ? (
            <div className="rounded-3xl shadow-lg flex flex-col items-center justify-center text-xs text-gray-400 bg-white border border-gray-200 dark:bg-[#1F2937] dark:border-white/10 gap-2">
              <FaUsers size={18} className="opacity-30" />
              <span>Waiting...</span>
            </div>
          ) : (
            participants.slice(0, 2).map((u) => (
              <div
                key={u.id}
                className="rounded-3xl shadow-lg flex items-center justify-center text-sm bg-white border border-gray-200 dark:bg-[#1F2937] dark:border-white/10 font-medium"
              >
                {u.name}
              </div>
            ))
          )}
        </div>

        {/* ================= SIDEBAR ================= */}
        {showChat && (
          <div className="w-96 flex flex-col bg-white shadow-lg border-l border-gray-200 dark:bg-[#111827] dark:border-white/10">

            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-200 dark:border-white/10">
              {[
                { key: "chat", label: "💬 Chat" },
                { key: "participants", label: "👥 People" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSidebarTab(t.key)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
                    sidebarTab === t.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Chat Tab */}
            {sidebarTab === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-slate-500">
                      No messages yet
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id}>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {msg.user}
                        </span>
                        <div className="mt-1 px-4 py-3 rounded-2xl text-sm bg-gray-100 dark:bg-[#1F2937]">
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Message students..."
                    className="flex-1 px-4 py-2 rounded-xl text-sm outline-none bg-gray-100 dark:bg-[#1F2937] dark:text-white placeholder:text-gray-400"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-500 transition"
                  >
                    Send
                  </button>
                </div>
              </>
            )}

            {/* Participants Tab */}
            {sidebarTab === "participants" && (
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {participants.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-slate-500">
                    No participants yet
                  </p>
                ) : (
                  participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1F2937] transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium flex-1">{p.name}</span>
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {p.joinedAt}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= CONTROL BAR ================= */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-gray-200 dark:bg-[#111827] dark:border-white/10 px-8 py-4 rounded-full flex gap-5">

        <button
          title={micOn ? "Mute" : "Unmute"}
          onClick={() => setMicOn(!micOn)}
          className={`p-4 rounded-full transition ${
            micOn
              ? "bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151]"
              : "bg-red-600 text-white hover:bg-red-500"
          }`}
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>

        <button
          title={camOn ? "Stop Camera" : "Start Camera"}
          onClick={() => setCamOn(!camOn)}
          className={`p-4 rounded-full transition ${
            camOn
              ? "bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151]"
              : "bg-red-600 text-white hover:bg-red-500"
          }`}
        >
          {camOn ? <FaVideo /> : <FaVideoSlash />}
        </button>

        <button
          title="Share Screen"
          onClick={() => setScreenShare(!screenShare)}
          className={`p-4 rounded-full transition ${
            screenShare
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151]"
          }`}
        >
          <FaDesktop />
        </button>

        <button
          title="Toggle Recording"
          onClick={() => setRecording(!recording)}
          className={`p-4 rounded-full transition ${
            recording
              ? "bg-red-100 dark:bg-red-900/30 text-red-600"
              : "bg-gray-100 dark:bg-[#1F2937]"
          }`}
        >
          <FaDotCircle />
        </button>

        <button
          title="Toggle Chat"
          onClick={() => setShowChat(!showChat)}
          className={`p-4 rounded-full transition ${
            showChat
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
              : "bg-gray-100 dark:bg-[#1F2937]"
          }`}
        >
          <FaComments />
        </button>

        <button
          title="Participants"
          onClick={() => { setShowChat(true); setSidebarTab("participants"); }}
          className="p-4 rounded-full bg-gray-100 dark:bg-[#1F2937] hover:bg-gray-200 dark:hover:bg-[#374151] transition"
        >
          <FaUsers />
        </button>

        <button
          title="End Session"
          onClick={handleEndSession}
          className="p-4 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
        >
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
};

export default LiveSessionControls;