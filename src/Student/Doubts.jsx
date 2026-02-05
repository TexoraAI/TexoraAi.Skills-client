import React, { useState, useRef, useEffect } from "react";
import { Send, User, GraduationCap } from "lucide-react";
import { sendMessage, getConversation } from "@/services/chatService";

const Doubts = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // ✅ logged-in student
  const currentUser = JSON.parse(localStorage.getItem("lms_user"));
  const studentEmail = currentUser?.email;

  // 🔒 hardcoded trainer (as requested)
  const trainerEmail = "saleem77987@gmail.com";

  // ================= LOAD CONVERSATION =================
  useEffect(() => {
    if (!studentEmail) return;

    getConversation(studentEmail, trainerEmail)
      .then((res) => {
        setChat(
          res.data.map((m) => ({
            sender: m.senderRole === "STUDENT" ? "student" : "teacher",
            text: m.message,
            time: new Date(m.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })),
        );
      })
      .catch(() => console.log("No messages yet"));
  }, [studentEmail]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ================= SEND MESSAGE =================
  const sendMessageHandler = async () => {
    if (!message.trim()) return;

    await sendMessage({
      receiverEmail: trainerEmail,
      senderRole: "STUDENT",
      message,
    });

    setMessage("");

    const res = await getConversation(studentEmail, trainerEmail);
    setChat(
      res.data.map((m) => ({
        sender: m.senderRole === "STUDENT" ? "student" : "teacher",
        text: m.message,
        time: new Date(m.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "student" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex gap-2 items-end max-w-md">
                {msg.sender === "teacher" && (
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                )}

                <div
                  className={`px-4 py-2 rounded-xl text-sm ${
                    msg.sender === "student"
                      ? "bg-rose-500 text-white"
                      : "bg-slate-200"
                  }`}
                >
                  {msg.text}
                  <div className="text-xs opacity-70 mt-1">{msg.time}</div>
                </div>

                {msg.sender === "student" && (
                  <User className="w-5 h-5 text-rose-600" />
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 flex gap-3">
          <textarea
            rows="2"
            placeholder="Type your doubt..."
            className="flex-1 border rounded-lg p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessageHandler();
              }
            }}
          />

          <button
            onClick={sendMessageHandler}
            disabled={!message.trim()}
            className="bg-rose-600 text-white px-4 rounded-lg"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Doubts;
