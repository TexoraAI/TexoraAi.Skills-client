// import React, { useState, useEffect, useRef } from "react";
// import { X, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { sendMessage, getConversation } from "@/services/chatService";

// const DoubtsChatModal = ({ doubt, onClose }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const chatEndRef = useRef(null);

//   const trainerEmail = localStorage.getItem("email");

//   useEffect(() => {
//     if (!doubt) return;

//     getConversation(doubt.studentEmail, trainerEmail).then((res) => {
//       setMessages(
//         res.data.map((m) => ({
//           sender: m.senderRole === "TRAINER" ? "trainer" : "student",
//           text: m.message,
//           time: new Date(m.sentAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         })),
//       );
//     });
//   }, [doubt]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendReply = async () => {
//     if (!message.trim()) return;

//     await sendMessage({
//       senderEmail: trainerEmail,
//       receiverEmail: doubt.studentEmail,
//       senderRole: "TRAINER",
//       message,
//     });

//     setMessage("");

//     const res = await getConversation(doubt.studentEmail, trainerEmail);
//     setMessages(
//       res.data.map((m) => ({
//         sender: m.senderRole === "TRAINER" ? "trainer" : "student",
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
//     <>
//       {/* ---- UI BELOW IS 100% SAME ---- */}
//       {/* Replace sendMessage with sendReply */}
//     </>
//   );
// };

// export default DoubtsChatModal;
import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendMessage, getConversation } from "@/services/chatService";

const DoubtsChatModal = ({ doubt, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // ✅ Logged-in trainer email (from auth.js storage)
  const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

  // ================= LOAD CHAT =================
  useEffect(() => {
    if (!doubt || !trainerEmail) return;

    getConversation(doubt.studentEmail, trainerEmail)
      .then((res) => {
        setMessages(
          res.data.map((m) => ({
            sender: m.senderRole === "TRAINER" ? "trainer" : "student",
            text: m.message,
            time: new Date(m.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })),
        );
      })
      .catch((err) => {
        console.error("Failed to load conversation", err);
      });
  }, [doubt, trainerEmail]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendReply = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        receiverEmail: doubt.studentEmail,
        senderRole: "TRAINER",
        message,
      });

      setMessage("");

      // reload chat
      const res = await getConversation(doubt.studentEmail, trainerEmail);
      setMessages(
        res.data.map((m) => ({
          sender: m.senderRole === "TRAINER" ? "trainer" : "student",
          text: m.message,
          time: new Date(m.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      );
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  if (!doubt) return null;

  // ================= UI =================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg h-[600px] flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">
            Chat with {doubt.studentName || doubt.studentEmail}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "trainer" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  msg.sender === "trainer"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Type your reply..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendReply();
            }}
          />
          <Button onClick={sendReply} disabled={!message.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DoubtsChatModal;
