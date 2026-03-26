
// import {
//   getConversation,
//   sendMessage,
//   getStudentContext,
// } from "@/services/chatService";
// import { GraduationCap, Send } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// const Doubts = () => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const chatEndRef = useRef(null);

//   const studentEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;
//   const [batchId, setBatchId] = useState(null);
//   const [trainerEmail, setTrainerEmail] = useState(null);

//   /* ================= LOAD CHAT CONTEXT ================= */

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const ctx = await getStudentContext();
//         setBatchId(ctx.data.batchId);
//         setTrainerEmail(ctx.data.trainerEmail);
//       } catch (e) {
//         console.log("No classroom assigned");
//       }
//     };
//     load();
//   }, []);

//   /* ================= LOAD CONVERSATION ================= */

//   useEffect(() => {
//     if (!batchId || !trainerEmail) return;

//     getConversation(batchId, trainerEmail).then((res) => {
//       setChat(
//         res.data.map((m) => ({
//           sender: m.senderEmail === studentEmail ? "student" : "teacher",
//           text: m.message,
//           time: new Date(m.sentAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         })),
//       );
//     });
//   }, [batchId, trainerEmail]);

//   /* ================= AUTO SCROLL ================= */

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   /* ================= SEND MESSAGE ================= */

//   const sendMessageHandler = async () => {
//     if (!message.trim()) return;

//     await sendMessage({
//       batchId,
//       receiverEmail: trainerEmail,
//       message,
//     });

//     setMessage("");

//     const res = await getConversation(batchId, trainerEmail);
//     setChat(
//       res.data.map((m) => ({
//         sender: m.senderEmail === studentEmail ? "student" : "teacher",
//         text: m.message,
//         time: new Date(m.sentAt).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       })),
//     );
//   };

//   return (
//     <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-slate-950">
//       <div className="shrink-0 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 px-5 py-4 flex items-center gap-3 text-white">
//         <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center shadow">
//           <GraduationCap />
//         </div>
//         <div>
//           <p className="font-semibold leading-tight">Trainer Support</p>
//           <p className="text-xs text-white/80">Online</p>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//         {chat.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${
//               msg.sender === "student" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 text-sm rounded-2xl shadow ${
//                 msg.sender === "student" ? "bg-blue-600 text-white" : "bg-white"
//               }`}
//             >
//               {msg.text}
//               <div className="text-[10px] mt-1 text-right">{msg.time}</div>
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-t">
//         <textarea
//           rows="1"
//           placeholder="Type a message"
//           className="flex-1 resize-none rounded-full px-4 py-2 text-sm bg-slate-100 border"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) =>
//             e.key === "Enter" &&
//             !e.shiftKey &&
//             (e.preventDefault(), sendMessageHandler())
//           }
//         />
//         <button
//           onClick={sendMessageHandler}
//           disabled={!message.trim()}
//           className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white"
//         >
//           <Send size={18} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Doubts;
















import {
  getConversation,
  sendMessage,
  getStudentContext,
} from "@/services/chatService";
import { GraduationCap, Send, MessageSquare, Info } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const Doubts = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const studentEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;
  const [batchId, setBatchId] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);

  /* ================= RESIZABLE PANEL STATE ================= */
  const [leftWidth, setLeftWidth] = useState(65); // percent
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  /* ================= LOAD CHAT CONTEXT ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await getStudentContext();
        setBatchId(ctx.data.batchId);
        setTrainerEmail(ctx.data.trainerEmail);
      } catch (e) {
        console.log("No classroom assigned");
      }
    };
    load();
  }, []);

  /* ================= LOAD CONVERSATION ================= */
  useEffect(() => {
    if (!batchId || !trainerEmail) return;
    getConversation(batchId, trainerEmail).then((res) => {
      setChat(
        res.data.map((m) => ({
          sender: m.senderEmail === studentEmail ? "student" : "teacher",
          text: m.message,
          time: new Date(m.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );
    });
  }, [batchId, trainerEmail]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* ================= SEND MESSAGE ================= */
  const sendMessageHandler = async () => {
    if (!message.trim()) return;
    await sendMessage({ batchId, receiverEmail: trainerEmail, message });
    setMessage("");
    const res = await getConversation(batchId, trainerEmail);
    setChat(
      res.data.map((m) => ({
        sender: m.senderEmail === studentEmail ? "student" : "teacher",
        text: m.message,
        time: new Date(m.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
    );
  };

  /* ================= DRAG RESIZE LOGIC (UI only) ================= */
  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
    if (newLeft > 30 && newLeft < 80) setLeftWidth(newLeft);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100vh-64px)] flex bg-slate-100 dark:bg-[#0f1b38] overflow-hidden"
    >
      {/* ====================================================
          LEFT PANEL — Chat
      ==================================================== */}
      <div
        className="flex flex-col h-full"
        style={{ width: `${leftWidth}%`, minWidth: "30%" }}
      >
        {/* Header */}
        <div
          className="shrink-0 px-5 py-4 flex items-center gap-3 text-white shadow-md"
          style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}
        >
          <div className="h-11 w-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight tracking-wide">
              Trainer Support
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow shadow-green-400/60" />
              <p className="text-xs text-white/75">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {chat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-3 opacity-40">
              <MessageSquare className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No messages yet. Start a conversation!
              </p>
            </div>
          )}

          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "teacher" && (
                <div className="h-8 w-8 rounded-full flex-shrink-0 mr-2
                                bg-blue-100 dark:bg-blue-900/50
                                border border-blue-200 dark:border-blue-700/40
                                flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-2.5 text-sm rounded-2xl shadow-sm
                  ${msg.sender === "student"
                    ? "text-white rounded-br-sm"
                    : "bg-white dark:bg-[#162040] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                  }`}
                style={
                  msg.sender === "student"
                    ? { background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }
                    : {}
                }
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.sender === "student" ? "text-white/60" : "text-slate-400"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3
                        bg-white dark:bg-[#162040]
                        border-t border-slate-200 dark:border-white/10 shadow-lg">
          <textarea
            rows="1"
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm
                       bg-slate-100 dark:bg-white/5
                       border border-slate-200 dark:border-white/10
                       text-slate-800 dark:text-slate-100
                       placeholder-slate-400 dark:placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), sendMessageHandler())
            }
          />
          <button
            onClick={sendMessageHandler}
            disabled={!message.trim()}
            className="h-11 w-11 rounded-full flex items-center justify-center
                       text-white shadow-md transition
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
          >
            <Send size={17} />
          </button>
        </div>
      </div>

      {/* ====================================================
          DRAG HANDLE — CRM style ←|→
      ==================================================== */}
      <div
        onMouseDown={onMouseDown}
        className="relative flex-shrink-0 w-3 flex items-center justify-center
                   cursor-col-resize group z-10
                   bg-slate-200 dark:bg-white/5
                   border-x border-slate-300 dark:border-white/10
                   hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
      >
        {/* The ←|→ pill */}
        <div className="absolute flex items-center gap-0.5
                        px-1.5 py-2 rounded-lg
                        bg-white dark:bg-[#1e3a5f]
                        border border-slate-300 dark:border-white/20
                        shadow group-hover:shadow-blue-300/40 dark:group-hover:shadow-blue-900/60
                        group-hover:border-blue-400 dark:group-hover:border-blue-600
                        transition select-none">
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none" className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
            <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none" className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
            <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* ====================================================
          RIGHT PANEL — Trainer Info
      ==================================================== */}
      <div
        className="flex flex-col h-full overflow-y-auto
                   bg-white dark:bg-[#162040]
                   border-l border-slate-200 dark:border-white/10"
        style={{ flex: 1, minWidth: "20%" }}
      >
        {/* Right Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
            Session Info
          </span>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Trainer */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
              Trainer
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl
                            bg-slate-50 dark:bg-white/5
                            border border-slate-100 dark:border-white/8">
              <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50
                              border border-blue-200 dark:border-blue-700/40
                              flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {trainerEmail?.split("@")[0] || "—"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {trainerEmail || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
              Overview
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Messages", value: chat.length },
                { label: "From You", value: chat.filter((m) => m.sender === "student").length },
                { label: "From Trainer", value: chat.filter((m) => m.sender === "teacher").length },
                { label: "Batch ID", value: batchId || "—" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl px-3 py-3
                             bg-slate-50 dark:bg-white/5
                             border border-slate-100 dark:border-white/8"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {s.label}
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5 truncate">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
              Status
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl
                            bg-green-50 dark:bg-green-900/20
                            border border-green-200 dark:border-green-800/40">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow shadow-green-400/50" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Session Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doubts;