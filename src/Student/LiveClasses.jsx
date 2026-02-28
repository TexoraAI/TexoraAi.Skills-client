import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LiveClasses = () => {
  const navigate = useNavigate();

  /* ================= BACKEND DATA STATE ================= */

  const [liveClass, setLiveClass] = useState(null);   // class details
  const [participants, setParticipants] = useState([]); // students list
  const [messages, setMessages] = useState([]); // chat messages

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [input, setInput] = useState("");

  /* ================= FETCH FROM BACKEND ================= */

  useEffect(() => {
    // 🔥 Replace this with real API later
    /*
    fetch("/api/live-class")
      .then(res => res.json())
      .then(data => {
        setLiveClass(data.class);
        setParticipants(data.participants);
        setMessages(data.messages);
      });
    */
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      user: "You",
      text: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Later send to backend
    // fetch("/api/send-message", { method:"POST", body: JSON.stringify(newMessage) })
  };

  const handleClose = () => {
    navigate("/student");
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100 text-gray-900 dark:bg-[#0B1120] dark:text-white">

      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md dark:bg-[#111827] dark:border-b dark:border-white/10">

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span className="font-semibold tracking-wide">LIVE</span>

          <span className="text-sm text-gray-500 dark:text-slate-400">
            {liveClass?.title || "Loading..."}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            👥 {participants.length} Participants
          </span>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-[#1F2937]"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 overflow-hidden">

        {/* VIDEO GRID */}
        <div className="flex-1 p-6 grid grid-cols-4 grid-rows-2 gap-5">

          {/* Instructor */}
          <div className="col-span-3 row-span-2 bg-black rounded-3xl shadow-2xl relative flex items-center justify-center text-white text-xl">
            {liveClass ? "Instructor Stream Here" : "Waiting for Live Class..."}
          </div>

          {/* Participants */}
          {participants.map((user) => (
            <div
              key={user.id}
              className="rounded-3xl shadow-lg flex items-center justify-center text-sm bg-white border border-gray-200 dark:bg-[#1F2937] dark:border-white/10"
            >
              {user.name}
            </div>
          ))}

        </div>

        {/* ================= CHAT ================= */}
        {showChat && (
          <div className="w-96 flex flex-col bg-white shadow-lg border-l border-gray-200 dark:bg-[#111827] dark:border-white/10">

            <div className="px-6 py-4 font-semibold border-b border-gray-200 dark:border-white/10">
              Live Chat
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="text-sm text-gray-400">
                  No messages yet
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i}>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {msg.user}
                    </span>
                    <div className="mt-1 px-4 py-3 rounded-2xl text-sm bg-gray-200 dark:bg-[#1F2937]">
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 px-4 py-2 rounded-xl text-sm outline-none bg-gray-200 dark:bg-[#1F2937]"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-500 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= CONTROL BAR ================= */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-gray-200 dark:bg-[#111827] dark:border-white/10 px-8 py-4 rounded-full flex gap-6">

        <button
          onClick={() => setMicOn(!micOn)}
          className={`p-4 rounded-full ${
            micOn ? "bg-gray-200 dark:bg-[#1F2937]" : "bg-red-600 text-white"
          }`}
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>

        <button
          onClick={() => setCamOn(!camOn)}
          className={`p-4 rounded-full ${
            camOn ? "bg-gray-200 dark:bg-[#1F2937]" : "bg-red-600 text-white"
          }`}
        >
          {camOn ? <FaVideo /> : <FaVideoSlash />}
        </button>

        <button className="p-4 rounded-full bg-gray-200 dark:bg-[#1F2937]">
          <FaDesktop />
        </button>

        <button
          onClick={() => setShowChat(!showChat)}
          className="p-4 rounded-full bg-gray-200 dark:bg-[#1F2937]"
        >
          <FaComments />
        </button>

        <button className="p-4 rounded-full bg-gray-200 dark:bg-[#1F2937]">
          <FaUsers />
        </button>

        <button
          onClick={handleClose}
          className="p-4 bg-red-600 text-white rounded-full hover:bg-red-500"
        >
          <FaPhoneSlash />
        </button>

      </div>
    </div>
  );
};

export default LiveClasses;
