
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { getConversation, sendMessage } from "@/services/chatService";
// import { Send, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// const DoubtsChatModal = ({ doubt, onClose }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const chatEndRef = useRef(null);

//   const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

//   useEffect(() => {
//     if (!doubt) return;

//     getConversation(doubt.batchId, doubt.studentEmail)
//       .then((res) => {
//         setMessages(
//           res.data.map((m) => ({
//             sender: m.senderEmail === trainerEmail ? "trainer" : "student",
//             text: m.message,
//             time: new Date(m.sentAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//           })),
//         );
//       })
//       .catch(console.error);
//   }, [doubt]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendReply = async () => {
//     if (!message.trim()) return;

//     await sendMessage({
//       batchId: doubt.batchId,
//       receiverEmail: doubt.studentEmail,
//       message,
//     });

//     setMessage("");

//     const res = await getConversation(doubt.batchId, doubt.studentEmail);
//     setMessages(
//       res.data.map((m) => ({
//         sender: m.senderEmail === trainerEmail ? "trainer" : "student",
//         text: m.message,
//         time: new Date(m.sentAt).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       })),
//     );
//   };

//   if (!doubt) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <Card className="w-full max-w-lg h-[600px] flex flex-col">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="font-semibold">Chat with {doubt.studentEmail}</h3>
//           <Button variant="ghost" size="icon" onClick={onClose}>
//             <X size={18} />
//           </Button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${msg.sender === "trainer" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
//               >
//                 <p>{msg.text}</p>
//                 <p className="text-[10px] opacity-70 mt-1 text-right">
//                   {msg.time}
//                 </p>
//               </div>
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>

//         <div className="p-4 border-t flex gap-2">
//           <Input
//             placeholder="Type your reply..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendReply()}
//           />
//           <Button onClick={sendReply} disabled={!message.trim()}>
//             <Send size={16} />
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default DoubtsChatModal;





























import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getConversation, sendMessage } from "@/services/chatService";
import { Send, X, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DoubtsChatModal = ({ doubt, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

  /* ── Fetch conversation ── */
  useEffect(() => {
    if (!doubt) return;
    getConversation(doubt.batchId, doubt.studentEmail)
      .then((res) => {
        setMessages(
          res.data.map((m) => ({
            sender: m.senderEmail === trainerEmail ? "trainer" : "student",
            text: m.message,
            time: new Date(m.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      })
      .catch(console.error);
  }, [doubt]);

  /* ── Auto scroll ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send ── */
  const sendReply = async () => {
    if (!message.trim()) return;
    await sendMessage({
      batchId: doubt.batchId,
      receiverEmail: doubt.studentEmail,
      message,
    });
    setMessage("");
    const res = await getConversation(doubt.batchId, doubt.studentEmail);
    setMessages(
      res.data.map((m) => ({
        sender: m.senderEmail === trainerEmail ? "trainer" : "student",
        text: m.message,
        time: new Date(m.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
    );
  };

  if (!doubt) return null;

  const initials = doubt.student?.[0]?.toUpperCase() || "S";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg h-[90vh] sm:h-[600px] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold uppercase select-none">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight capitalize">{doubt.student}</p>
              <p className="text-[11px] opacity-70 leading-tight">{doubt.studentEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#f6f7fb] dark:bg-slate-950">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
              <MessageCircle className="w-8 h-8" />
              <p className="text-xs">No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.sender === "trainer"
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm"
                }`}
              >
                <p className="leading-snug">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${
                    msg.sender === "trainer" ? "opacity-60" : "text-slate-400"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* ── Input Bar ── */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center gap-2">
          <Input
            className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400"
            placeholder="Type your reply..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendReply()}
          />
          <Button
            onClick={sendReply}
            disabled={!message.trim()}
            className="h-10 w-10 p-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition shadow-sm"
          >
            <Send size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoubtsChatModal;