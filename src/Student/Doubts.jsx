// import {
//   getConversation,
//   sendMessage,
//   getStudentTrainer,
// } from "@/services/chatService";
// import { getStudentBatch } from "@/services/batchService";
// import { GraduationCap, Send } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// const Doubts = () => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const chatEndRef = useRef(null);

//   const studentEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;
//   const [batchId, setBatchId] = useState(null);
//   const [trainerEmail, setTrainerEmail] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       const batch = await getStudentBatch();
//       if (!batch) return;

//       setBatchId(batch.id);

//       const trainer = await getStudentTrainer(batch.id);
//       setTrainerEmail(trainer.data);
//     };
//     load();
//   }, []);

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

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

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
//             className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-4 py-2 text-sm rounded-2xl shadow ${msg.sender === "student" ? "bg-blue-600 text-white" : "bg-white"}`}
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
import { GraduationCap, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Doubts = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const studentEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;
  const [batchId, setBatchId] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);

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
        })),
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

    await sendMessage({
      batchId,
      receiverEmail: trainerEmail,
      message,
    });

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
      })),
    );
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="shrink-0 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 px-5 py-4 flex items-center gap-3 text-white">
        <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center shadow">
          <GraduationCap />
        </div>
        <div>
          <p className="font-semibold leading-tight">Trainer Support</p>
          <p className="text-xs text-white/80">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "student" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 text-sm rounded-2xl shadow ${
                msg.sender === "student" ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {msg.text}
              <div className="text-[10px] mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-t">
        <textarea
          rows="1"
          placeholder="Type a message"
          className="flex-1 resize-none rounded-full px-4 py-2 text-sm bg-slate-100 border"
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
          className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Doubts;
