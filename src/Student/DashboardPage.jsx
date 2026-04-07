

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Percent,
  ArrowUp,
  ArrowDown,
  User,
  Bell,
  MessageCircle,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Inbox,
  Send,
  GraduationCap,
  X,
  Circle,
  CheckCheck,
} from "lucide-react";

// ─── Services ───────────────────────────────────────────────────────────────
import { getStudentClassroom } from "@/services/batchService";
import {
  getConversation,
  sendMessage,
  getStudentContext,
} from "@/services/chatService";
import {
  fetchMyNotifications,
  fetchUnreadCount,
  markOneRead,
  markAllReadAPI,
  connectWebSocket,
  disconnectWebSocket,
} from "@/services/notificationService";
import { courseService } from "@/services/courseService";
import attendanceService from "@/services/attendanceService";
import {
  getStudentQuizzes,
  getMyQuizHistory,
  getStudentAssignments,
  getMySubmissions,
} from "@/services/assessmentService"; // your existing api.js exports

/* ═══════════════════════════════════════════════
   NOTIFICATION TYPE META
═══════════════════════════════════════════════ */
const TYPE_META = {
  NEW_VIDEO: { icon: "🎥", color: "from-blue-500 to-indigo-500" },
  NEW_FILE: { icon: "📁", color: "from-green-500 to-teal-500" },
  NEW_ASSESSMENT: { icon: "📝", color: "from-purple-500 to-pink-500" },
  NEW_CONTENT: { icon: "📘", color: "from-cyan-500 to-blue-500" },
  NEW_QUIZ: { icon: "🧠", color: "from-violet-500 to-purple-500" },
  NEW_COURSE: { icon: "🎓", color: "from-pink-500 to-rose-500" },
  NEW_ASSIGNMENT: { icon: "📋", color: "from-orange-500 to-amber-500" },
  ATTENDANCE: { icon: "✅", color: "from-teal-500 to-emerald-500" },
  BATCH_UPDATE: { icon: "🏫", color: "from-orange-500 to-red-500" },
  CHAT_MESSAGE: { icon: "💬", color: "from-pink-500 to-rose-500" },
  LIVE_SESSION: { icon: "📡", color: "from-violet-500 to-purple-500" },
  SESSION_REMINDER: { icon: "⏰", color: "from-indigo-500 to-blue-500" },
  BATCH_ASSIGNED: { icon: "🏫", color: "from-red-500 to-pink-500" },
  DEFAULT: { icon: "🔔", color: "from-gray-400 to-gray-600" },
};

const getNotifMeta = (type) => {
  if (!type) return TYPE_META.DEFAULT;
  const key = type
    .replace(/^NEW_MESSAGE$/i, "CHAT_MESSAGE")
    .replace(/^ATTENDANCE_MARKED$/i, "ATTENDANCE")
    .replace(/^NEW_COURSE_AVAILABLE$/i, "NEW_COURSE")
    .replace(/^NEW_QUIZ_AVAILABLE$/i, "NEW_QUIZ")
    .replace(/^NEW_ASSIGNMENT_POSTED$/i, "NEW_ASSIGNMENT")
    .toUpperCase();
  return TYPE_META[key] ?? TYPE_META.DEFAULT;
};

const formatTime = (createdAt) => {
  if (!createdAt) return "";
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/* ═══════════════════════════════════════════════
   MINI CALENDAR
═══════════════════════════════════════════════ */
const MiniCalendar = () => {
  const today = new Date();
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const prevMonth = () =>
    setCurrent((p) => ({
      month: p.month === 0 ? 11 : p.month - 1,
      year: p.month === 0 ? p.year - 1 : p.year,
    }));
  const nextMonth = () =>
    setCurrent((p) => ({
      month: p.month === 11 ? 0 : p.month + 1,
      year: p.month === 11 ? p.year + 1 : p.year,
    }));

  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-700 dark:text-white">
          {monthNames[current.month]} {current.year}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-slate-400 dark:text-zinc-600 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center py-1">
            {d ? (
              <button
                className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition ${
                  isToday(d)
                    ? "bg-violet-600 text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {d}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   EMPTY CHART PLACEHOLDER
═══════════════════════════════════════════════ */
const EmptyChart = () => (
  <div className="flex items-end justify-center gap-2 h-24 px-4">
    {[30, 50, 20, 70, 40, 60, 35, 55, 25, 45, 65, 30].map((h, i) => (
      <div
        key={i}
        className="flex-1 rounded-t-sm bg-slate-100 dark:bg-white/5"
        style={{ height: `${h}%` }}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════
   NOTIFICATION BELL DROPDOWN
═══════════════════════════════════════════════ */
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animateBell, setAnimateBell] = useState(false);
  const dropdownRef = useRef(null);

  const userEmail =
    JSON.parse(localStorage.getItem("lms_user") || "{}")?.email ||
    localStorage.getItem("email");

  useEffect(() => {
    const load = async () => {
      try {
        const [data, count] = await Promise.all([
          fetchMyNotifications(),
          fetchUnreadCount(),
        ]);
        setNotifications(Array.isArray(data) ? data.slice(0, 8) : []);
        setUnreadCount(count || 0);
      } catch (err) {
        console.error("Bell load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    connectWebSocket({
      userEmail,
      userRole: "STUDENT",
      onMessage: (newNotif) => {
        setAnimateBell(true);
        setTimeout(() => setAnimateBell(false), 1000);
        setNotifications((prev) => [newNotif, ...prev].slice(0, 8));
        setUnreadCount((prev) => prev + 1);
      },
    });
    return () => disconnectWebSocket();
  }, [userEmail]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await markAllReadAPI();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
      >
        <Bell
          className={`w-5 h-5 transition-transform duration-300 ${animateBell ? "animate-bounce" : ""}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white text-[10px] font-bold shadow-lg ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {animateBell && (
          <span className="absolute inset-0 rounded-xl animate-ping bg-indigo-400 opacity-30" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl dark:shadow-black/40 z-[9999] overflow-hidden"
          style={{
            maxHeight: "480px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                >
                  <CheckCheck className="w-3 h-3" /> All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading && (
              <div className="py-10 text-center text-sm text-gray-400">
                Loading...
              </div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            )}
            {notifications.map((item) => {
              const { icon, color } = getNotifMeta(item.type);
              return (
                <div
                  key={item.id}
                  onClick={(e) => !item.read && handleMarkRead(item.id, e)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!item.read ? "bg-indigo-50/50 dark:bg-indigo-950/10" : ""}`}
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base bg-gradient-to-br ${color} shadow-sm`}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {item.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {formatTime(item.createdAt)}
                    </p>
                  </div>
                  {!item.read && (
                    <Circle className="w-2 h-2 fill-indigo-500 text-indigo-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex-shrink-0 border-t border-gray-100 dark:border-slate-800">
            <button className="w-full py-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors">
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   LIVE CHAT PANEL
═══════════════════════════════════════════════ */
const LatestMessagePanel = () => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [batchId, setBatchId] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const studentEmail = JSON.parse(
    localStorage.getItem("lms_user") || "{}",
  )?.email;

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

  useEffect(() => {
    if (expanded) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, expanded]);

  const handleSend = async () => {
    if (!message.trim() || !batchId || !trainerEmail) return;
    setSending(true);
    try {
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
        })),
      );
    } finally {
      setSending(false);
    }
  };

  if (!expanded) {
    return (
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-semibold text-slate-700 dark:text-white">
              Latest Message
            </p>
          </div>
          <button
            onClick={() => setExpanded(true)}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <MoreHorizontal size={15} />
          </button>
        </div>

        {chat.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <MessageCircle className="h-5 w-5 text-slate-300 dark:text-zinc-700" />
            </div>
            <p className="text-sm text-slate-400 dark:text-zinc-600">
              No messages yet
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-2 mb-3 max-h-36 overflow-y-auto">
            {chat.slice(-3).map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 text-xs rounded-xl ${
                    msg.sender === "student"
                      ? "text-white"
                      : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200"
                  }`}
                  style={
                    msg.sender === "student"
                      ? {
                          background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                        }
                      : {}
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {batchId && trainerEmail && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Quick message to trainer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="h-8 w-8 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center disabled:opacity-40 transition"
            >
              <Send size={13} />
            </button>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-[#1a1a1a]">
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition"
          >
            <Inbox size={14} />
            Go to Inbox
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm flex flex-col"
      style={{ height: "380px" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-white">
              {trainerEmail?.split("@")[0] || "Trainer"}
            </p>
            <p className="text-[10px] text-slate-400">
              {trainerEmail || "Not assigned"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {chat.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-slate-400 dark:text-zinc-600">
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "teacher" && (
                <div className="h-6 w-6 rounded-full mr-1.5 bg-violet-100 dark:bg-violet-900/30 flex-shrink-0 flex items-center justify-center">
                  <GraduationCap className="w-3 h-3 text-violet-600" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-3 py-2 text-xs rounded-2xl ${
                  msg.sender === "student"
                    ? "text-white rounded-br-sm"
                    : "bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                }`}
                style={
                  msg.sender === "student"
                    ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)" }
                    : {}
                }
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p
                  className={`text-[9px] mt-0.5 text-right ${msg.sender === "student" ? "text-white/60" : "text-slate-400"}`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-slate-100 dark:border-[#1a1a1a]">
        <input
          type="text"
          placeholder={batchId ? "Type a message..." : "No classroom assigned"}
          disabled={!batchId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || sending || !batchId}
          className="h-8 w-8 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center disabled:opacity-40 transition hover:scale-105 active:scale-95"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   NOTIFICATIONS SIDEBAR PANEL
═══════════════════════════════════════════════ */
const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail =
    JSON.parse(localStorage.getItem("lms_user") || "{}")?.email ||
    localStorage.getItem("email");

  useEffect(() => {
    fetchMyNotifications()
      .then((data) =>
        setNotifications(Array.isArray(data) ? data.slice(0, 6) : []),
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    connectWebSocket({
      userEmail,
      userRole: "STUDENT",
      onMessage: (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev].slice(0, 6));
      },
    });
    return () => {};
  }, [userEmail]);

  const handleMarkRead = async (id) => {
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-violet-500" />
          <p className="text-sm font-semibold text-slate-700 dark:text-white">
            Notifications & Update
          </p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition">
          <MoreHorizontal size={15} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-1.5 py-1">
                <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded w-3/4" />
                <div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
            <Bell className="h-5 w-5 text-slate-300 dark:text-zinc-700" />
          </div>
          <p className="text-sm text-slate-400 dark:text-zinc-600">
            No notifications yet
          </p>
          <p className="text-xs text-slate-300 dark:text-zinc-700 mt-1">
            You're all caught up!
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {notifications.map((item) => {
            const { icon, color } = getNotifMeta(item.type);
            return (
              <div
                key={item.id}
                onClick={() => !item.read && handleMarkRead(item.id)}
                className={`flex gap-3 p-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${!item.read ? "bg-violet-50/50 dark:bg-violet-900/10" : ""}`}
              >
                <div
                  className={`h-9 w-9 flex-shrink-0 rounded-xl flex items-center justify-center text-base bg-gradient-to-br ${color} shadow-sm`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${item.read ? "text-slate-500 dark:text-zinc-500" : "text-slate-800 dark:text-white"}`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-600 line-clamp-1">
                    {item.message}
                  </p>
                  <p className="text-[10px] text-slate-300 dark:text-zinc-700 mt-0.5">
                    {formatTime(item.createdAt)}
                  </p>
                </div>
                {!item.read && (
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-1 flex-shrink-0 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   STAT CARD SKELETON
═══════════════════════════════════════════════ */
const StatSkeleton = () => (
  <div className="rounded-2xl border-l-4 border-l-slate-200 border border-slate-100 dark:border-[#1a1a1a] bg-white dark:bg-[#111111] p-5 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-24" />
      <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/5" />
    </div>
    <div className="h-8 bg-slate-100 dark:bg-white/5 rounded w-16 mt-2" />
    <div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-20 mt-3" />
  </div>
);

/* ═══════════════════════════════════════════════
   ✅ HELPER — calculate attendance % from API data
   Adjust field names below if your backend returns
   different keys (e.g. "present" vs "presentDays").
═══════════════════════════════════════════════ */
const calcAttendancePercent = (data) => {
  // Backend may return: { presentDays, totalDays } OR an array of records
  if (!data) return null;

  // Case 1: { presentDays: 18, totalDays: 22 }
  if (
    typeof data.presentDays === "number" &&
    typeof data.totalDays === "number"
  ) {
    if (data.totalDays === 0) return 0;
    return Math.round((data.presentDays / data.totalDays) * 100);
  }

  // Case 2: array of attendance records [{ status: "PRESENT" | "ABSENT" }, ...]
  if (Array.isArray(data)) {
    const total = data.length;
    const present = data.filter((r) => r.status === "PRESENT").length;
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  }

  return null;
};

/* ═══════════════════════════════════════════════
   MAIN DASHBOARD PAGE
═══════════════════════════════════════════════ */
const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [classroom, setClassroom] = useState(null);
  const [classLoading, setClassLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("Annual");

  // ─── Real stats state ────────────────────────────────────────────────────
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeCourses, setActiveCourses] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [pendingAssessments, setPendingAssessments] = useState(0);
  const [overdueAssessments, setOverdueAssessments] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState(null);

  // ─── Load classroom ───────────────────────────────────────────────────────
  useEffect(() => {
    getStudentClassroom()
      .then((res) => setClassroom(res.data))
      .catch(() => setClassroom(null))
      .finally(() => setClassLoading(false));
  }, []);

  // ─── Load real stats ──────────────────────────────────────────────────────
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 1-based

        const [
          coursesRes,
          attendanceRes,
          quizzesRes,
          quizHistoryRes,
          assignmentsRes,
          submissionsRes,
        ] = await Promise.allSettled([
          courseService.getStudentCourses(),
          attendanceService.getMonthlyAttendance(year, month),
          getStudentQuizzes(),
          getMyQuizHistory(),
          getStudentAssignments(),
          getMySubmissions(),
        ]);

        /* ── Courses ────────────────────────────────────────────────────── */
        if (coursesRes.status === "fulfilled") {
          const courses = coursesRes.value?.data ?? [];
          // Adjust status field name to match your backend: "ACTIVE" / "COMPLETED" etc.
          const active = courses.filter(
            (c) => c.status === "ACTIVE" || !c.completed,
          ).length;
          const completed = courses.filter(
            (c) => c.status === "COMPLETED" || c.completed,
          ).length;
          setActiveCourses(active);
          setCompletedCourses(completed);
        }

        /* ── Attendance ─────────────────────────────────────────────────── */
        if (attendanceRes.status === "fulfilled") {
          const pct = calcAttendancePercent(attendanceRes.value?.data);
          setAttendancePercent(pct);
        }

        /* ── Pending Assessments ────────────────────────────────────────── */
        // Quizzes: those NOT already in history
        let pendingQuizCount = 0;
        let overdueQuizCount = 0;
        if (
          quizzesRes.status === "fulfilled" &&
          quizHistoryRes.status === "fulfilled"
        ) {
          const allQuizzes = quizzesRes.value?.data ?? [];
          const attemptedIds = new Set(
            (quizHistoryRes.value?.data ?? []).map(
              (a) => a.quizId ?? a.quiz?.id,
            ),
          );
          const notAttempted = allQuizzes.filter(
            (q) => !attemptedIds.has(q.id),
          );
          pendingQuizCount = notAttempted.length;
          // Optional: count as overdue if dueDate < now
          overdueQuizCount = notAttempted.filter(
            (q) => q.dueDate && new Date(q.dueDate) < now,
          ).length;
        }

        // Assignments: those not submitted by the student
        let pendingAssignmentCount = 0;
        let overdueAssignmentCount = 0;
        if (
          assignmentsRes.status === "fulfilled" &&
          submissionsRes.status === "fulfilled"
        ) {
          const allAssignments = assignmentsRes.value?.data ?? [];
          const submittedIds = new Set(
            (submissionsRes.value?.data ?? []).map(
              (s) => s.assignmentId ?? s.assignment?.id,
            ),
          );
          const notSubmitted = allAssignments.filter(
            (a) => !submittedIds.has(a.id),
          );
          pendingAssignmentCount = notSubmitted.length;
          overdueAssignmentCount = notSubmitted.filter(
            (a) => a.dueDate && new Date(a.dueDate) < now,
          ).length;
        }

        setPendingAssessments(pendingQuizCount + pendingAssignmentCount);
        setOverdueAssessments(overdueQuizCount + overdueAssignmentCount);
      } catch (err) {
        console.error("Stats load error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // ─── Stats config (uses real values) ─────────────────────────────────────
  const stats = [
    {
      label: "Active Courses",
      value: String(activeCourses),
      change: `${activeCourses} enrolled`,
      trend: "up",
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-700",
      accent: "border-l-violet-500",
    },
    {
      label: "Completed Courses",
      value: String(completedCourses),
      change: `${completedCourses} finished`,
      trend: "up",
      icon: CheckCircle,
      gradient: "from-emerald-400 to-teal-600",
      accent: "border-l-emerald-500",
    },
    {
      label: "Pending Assessments",
      value: String(pendingAssessments),
      change:
        overdueAssessments > 0
          ? `${overdueAssessments} overdue`
          : "None overdue",
      trend: overdueAssessments > 0 ? "down" : "up",
      icon: Clock,
      gradient: "from-amber-400 to-orange-500",
      accent: "border-l-amber-500",
    },
    {
      label: "Attendance",
      value: attendancePercent !== null ? `${attendancePercent}%` : "—",
      change:
        attendancePercent !== null
          ? attendancePercent >= 75
            ? "Good standing"
            : "Below 75% ⚠️"
          : "No data",
      trend:
        attendancePercent !== null && attendancePercent >= 75 ? "up" : "down",
      icon: Percent,
      gradient: "from-rose-400 to-pink-600",
      accent: "border-l-sky-500",
    },
  ];

  // ─── Classroom card ────────────────────────────────────────────────────────
  const ClassroomCard = () => (
    <div className="bg-white dark:bg-[#111111] rounded-2xl p-5 border border-slate-100 dark:border-[#1a1a1a] shadow-sm flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-200 dark:shadow-violet-900/30">
        <User className="text-white h-5 w-5" />
      </div>
      {classLoading ? (
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Loading classroom...
          </h3>
          <p className="text-sm text-slate-400 dark:text-zinc-500">
            Please wait
          </p>
        </div>
      ) : classroom ? (
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">
            {classroom.batchName}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Trainer: {classroom.trainerName}
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            {classroom.trainerEmail}
          </p>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">
            No Classroom Assigned
          </h3>
          <p className="text-sm text-slate-400 dark:text-zinc-500">
            Waiting for admin to assign trainer
          </p>
        </div>
      )}
    </div>
  );

  // ─── Overview ─────────────────────────────────────────────────────────────
  const OverviewPage = () => (
    <div className="space-y-5">
      <ClassroomCard />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsLoading
          ? [0, 1, 2, 3].map((i) => <StatSkeleton key={i} />)
          : stats.map((item) => {
              const Icon = item.icon;
              const TrendIcon = item.trend === "up" ? ArrowUp : ArrowDown;
              return (
                <div
                  key={item.label}
                  className={`rounded-2xl border-l-4 ${item.accent} border border-slate-100 dark:border-[#1a1a1a] bg-white dark:bg-[#111111] p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-default`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                      {item.label}
                    </p>
                    <div
                      className={`h-9 w-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                  <div className="flex items-center gap-1 text-[12px] mt-2 text-slate-400 dark:text-zinc-500">
                    <TrendIcon className="h-3 w-3" />
                    {item.change}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Chart + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">
                Total Users
              </p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-500">
                  0% vs last period
                </span>
              </div>
            </div>
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              {["Today", "Weekly", "Monthly", "Annual"].map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                    chartPeriod === p
                      ? "bg-white dark:bg-[#1a1a1a] text-violet-600 dark:text-violet-400 shadow-sm"
                      : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <EmptyChart />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-slate-400 dark:text-zinc-600 font-medium">
                No chart data available
              </p>
            </div>
          </div>
        </div>

        <NotificationsPanel />
      </div>

      {/* Calendar + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-white">
                Schedule
              </p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition">
              <MoreHorizontal size={15} />
            </button>
          </div>
          <MiniCalendar />
        </div>
        <LatestMessagePanel />
      </div>
    </div>
  );

  const CoursesPage = () => (
    <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-100 dark:border-[#1a1a1a] shadow-sm">
      <h2 className="text-lg font-bold mb-1 text-slate-800 dark:text-white">
        My Courses
      </h2>
      <p className="text-sm text-slate-400 dark:text-zinc-500">
        Courses will appear here
      </p>
    </div>
  );

  const ProgressPage = () => (
    <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-100 dark:border-[#1a1a1a] shadow-sm">
      <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">
        Learning Progress
      </h2>
      <p className="text-sm text-slate-400 dark:text-zinc-500">
        Progress will appear here
      </p>
    </div>
  );

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HERO */}
        <div
          className="rounded-3xl p-8 text-white relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 100%)",
          }}
        >
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #fbbf24, transparent 70%)",
              transform: "translate(-30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #34d399, transparent 70%)",
              transform: "translate(30%, 30%)",
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
                Student Portal
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                Student Dashboard
              </h1>
              <p className="text-sm text-white/65 mt-1 font-normal">
                Your classroom & learning overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
                <NotificationBell />
              </div>
              <div className="flex bg-black/20 backdrop-blur-sm border border-white/15 p-1 rounded-2xl gap-0.5">
                {["overview", "courses", "progress"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-xl text-sm capitalize font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-violet-600 shadow-sm"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {activeTab === "overview" && <OverviewPage />}
        {activeTab === "courses" && <CoursesPage />}
        {activeTab === "progress" && <ProgressPage />}
      </div>
    </div>
  );
};

export default DashboardPage;
