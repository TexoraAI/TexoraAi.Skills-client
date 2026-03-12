
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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getConversation, sendMessage } from "@/services/chatService";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DoubtsChatModal = ({ doubt, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

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
          })),
        );
      })
      .catch(console.error);
  }, [doubt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      })),
    );
  };

  if (!doubt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Chat with {doubt.studentEmail}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${msg.sender === "trainer" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
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

        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Type your reply..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendReply()}
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

