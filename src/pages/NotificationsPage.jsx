
// import React from "react";
// import { useLocation } from "react-router-dom";
// import { Bell, CheckCheck } from "lucide-react";

// const NotificationsPage = () => {
//   const { pathname } = useLocation();
//   const isStudent = pathname.startsWith("/student");
//   const isTrainer = pathname.startsWith("/trainer");
//   const isAdmin = pathname.startsWith("/admin");
//   const isBusiness = pathname.startsWith("/business");

//   let notifications;

//   if (isStudent) {
//     notifications = [
//       {
//         id: 1,
//         title: "New assignment published",
//         description: "React Basics assignment has been added to your course.",
//         time: "5 min ago",
//         type: "assignment",
//         icon: "📘",
//         color: "from-blue-500 to-indigo-500",
//       },
//       {
//         id: 2,
//         title: "Quiz scheduled",
//         description: "JavaScript quiz scheduled for tomorrow 7 PM.",
//         time: "1 hr ago",
//         type: "quiz",
//         icon: "📝",
//         color: "from-purple-500 to-pink-500",
//       },
//     ];
//   } else if (isTrainer) {
//     notifications = [
//       {
//         id: 1,
//         title: "New doubt raised",
//         description: "1 new doubt in React Hooks topic (Batch A).",
//         time: "10 min ago",
//         type: "doubt",
//         icon: "❓",
//         color: "from-orange-500 to-red-500",
//       },
//       {
//         id: 2,
//         title: "Attendance pending",
//         description: "Today's Batch B attendance not marked yet.",
//         time: "2 hr ago",
//         type: "attendance",
//         icon: "📊",
//         color: "from-green-500 to-teal-500",
//       },
//     ];
//   } else if (isAdmin) {
//     notifications = [
//       {
//         id: 1,
//         title: "New user registered",
//         description: "A new student account awaits approval.",
//         time: "15 min ago",
//         type: "user",
//         icon: "👤",
//         color: "from-cyan-500 to-blue-500",
//       },
//       {
//         id: 2,
//         title: "Revenue report ready",
//         description: "Monthly revenue report for LMS is generated.",
//         time: "3 hr ago",
//         type: "report",
//         icon: "📑",
//         color: "from-violet-500 to-purple-500",
//       },
//     ];
//   } else if (isBusiness) {
//     notifications = [
//       {
//         id: 1,
//         title: "New lead assigned",
//         description: "A new corporate lead has been assigned to you.",
//         time: "20 min ago",
//         type: "lead",
//         icon: "📈",
//         color: "from-emerald-500 to-green-500",
//       },
//       {
//         id: 2,
//         title: "Invoice payment received",
//         description: "Payment received for invoice INV-101.",
//         time: "1 hr ago",
//         type: "payment",
//         icon: "💳",
//         color: "from-blue-500 to-cyan-500",
//       },
//       {
//         id: 3,
//         title: "Campaign performance updated",
//         description: "Winter Offer campaign performance report is ready.",
//         time: "3 hr ago",
//         type: "campaign",
//         icon: "📢",
//         color: "from-pink-500 to-rose-500",
//       },
//     ];
//   } else {
//     notifications = [];
//   }

//   const heading = isStudent
//     ? "Your notifications"
//     : isTrainer
//     ? "Trainer notifications"
//     : isAdmin
//     ? "Admin notifications"
//     : isBusiness
//     ? "Business notifications"
//     : "Notifications";

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
//               {heading}
//             </h1>
//           </div>
//           <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
//             {isStudent &&
//               "Assignments, quizzes, course updates aur system alerts yahan dikhte hain."}
//             {isTrainer &&
//               "Batches, students, doubts aur assessment related alerts yahan dikhte hain."}
//             {isAdmin &&
//               "User approvals, system status aur revenue related alerts yahan dikhte hain."}
//             {isBusiness &&
//               "Leads, enrollments, invoices aur campaigns se related alerts yahan dikhte hain."}
//             {!isStudent && !isTrainer && !isAdmin && !isBusiness &&
//               "Recent alerts from the system."}
//           </p>
//         </div>

//         <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
//           <CheckCheck className="w-4 h-4" />
//           Mark all read
//         </button>
//       </div>

//       {/* NOTIFICATIONS LIST */}
//       <div className="space-y-3">
//         {notifications.length === 0 && (
//           <div className="text-center py-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
//               <Bell className="w-8 h-8 text-gray-400 dark:text-slate-500" />
//             </div>
//             <p className="text-sm text-gray-500 dark:text-slate-400">
//               Abhi koi notification nahi hai.
//             </p>
//           </div>
//         )}

//         {notifications.map((item) => (
//           <div
//             key={item.id}
//             className="group relative flex items-start gap-4 rounded-xl border border-gray-200 dark:border-slate-700/70 bg-white dark:bg-slate-900/70 p-4 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-600"
//           >
//             {/* ICON */}
//             <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-lg shadow-md flex-shrink-0`}>
//               {item.icon}
//             </div>

//             {/* CONTENT */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-start justify-between gap-3">
//                 <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
//                   {item.title}
//                 </h2>
//                 <span className="text-xs text-gray-500 dark:text-slate-500 whitespace-nowrap">
//                   {item.time}
//                 </span>
//               </div>
//               <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
//                 {item.description}
//               </p>
//             </div>

//             {/* UNREAD INDICATOR */}
//             <div className="absolute top-4 right-4">
//               <span className="flex h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;

















import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchMyNotifications,
  markOneRead,
  markAllReadAPI,
  clearAllNotificationsAPI,
  connectWebSocket,
  disconnectWebSocket,
} from "../services/notificationService";

// ── Role-aware TYPE_META ─────────────────────────────────────
const TYPE_META = {
  NEW_VIDEO: {
    icon: "🎥",
    label: "Video",
    grad: "#6366f1,#818cf8",
    ring: "#6366f120",
  },
  NEW_FILE: {
    icon: "📁",
    label: "File",
    grad: "#10b981,#34d399",
    ring: "#10b98120",
  },
  NEW_ASSESSMENT: {
    icon: "📝",
    label: "Assessment",
    grad: "#f59e0b,#fbbf24",
    ring: "#f59e0b20",
  },
  NEW_CONTENT: {
    icon: "📘",
    label: "Content",
    grad: "#0ea5e9,#38bdf8",
    ring: "#0ea5e920",
  },
  NEW_QUIZ: {
    icon: "🧠",
    label: "Quiz",
    grad: "#8b5cf6,#a78bfa",
    ring: "#8b5cf620",
  },
  NEW_COURSE: {
    icon: "🎓",
    label: "Course",
    grad: "#ec4899,#f472b6",
    ring: "#ec489920",
  },
  NEW_ASSIGNMENT: {
    icon: "📋",
    label: "Assignment",
    grad: "#f97316,#fb923c",
    ring: "#f9731620",
  },
  ATTENDANCE: {
    icon: "✅",
    label: "Attendance",
    grad: "#14b8a6,#2dd4bf",
    ring: "#14b8a620",
  },
  BATCH_UPDATE: {
    icon: "🏫",
    label: "Batch",
    grad: "#f43f5e,#fb7185",
    ring: "#f43f5e20",
  },
  CHAT_MESSAGE: {
    icon: "💬",
    label: "Message",
    grad: "#ec4899,#f472b6",
    ring: "#ec489920",
  },
  LIVE_SESSION: {
    icon: "📡",
    label: "Live",
    grad: "#7c3aed,#8b5cf6",
    ring: "#7c3aed20",
  },
  STUDENT_JOINED: {
    icon: "👤",
    label: "Student",
    grad: "#0ea5e9,#38bdf8",
    ring: "#0ea5e920",
  },
  DOUBT_RAISED: {
    icon: "❓",
    label: "Doubt",
    grad: "#f59e0b,#fbbf24",
    ring: "#f59e0b20",
  },
  ASSIGNMENT_SUBMIT: {
    icon: "📤",
    label: "Submission",
    grad: "#10b981,#34d399",
    ring: "#10b98120",
  },
  SESSION_REMINDER: {
    icon: "⏰",
    label: "Reminder",
    grad: "#6366f1,#818cf8",
    ring: "#6366f120",
  },
  BATCH_ASSIGNED: {
    icon: "🏫",
    label: "Batch",
    grad: "#f43f5e,#fb7185",
    ring: "#f43f5e20",
  },
  DEFAULT: {
    icon: "🔔",
    label: "Alert",
    grad: "#64748b,#94a3b8",
    ring: "#64748b20",
  },
};

const getMeta = (type) => {
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

const groupByDay = (notifications) => {
  const groups = {};
  notifications.forEach((n) => {
    const date = n.createdAt ? new Date(n.createdAt) : new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let label;
    if (date.toDateString() === today.toDateString()) label = "Today";
    else if (date.toDateString() === yesterday.toDateString())
      label = "Yesterday";
    else
      label = date.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });
  return groups;
};

// ── Role config ──────────────────────────────────────────────
const ROLE_CONFIG = {
  student: {
    heading: "Notifications",
    subtext: "Your learning updates, quizzes, assignments & more",
    accentColor: "#6366f1",
    accentLight: "#eef2ff",
    gradFrom: "#6366f1",
    gradTo: "#8b5cf6",
  },
  trainer: {
    heading: "Trainer Hub",
    subtext: "Student activity, batch alerts & session reminders",
    accentColor: "#0ea5e9",
    accentLight: "#e0f2fe",
    gradFrom: "#0ea5e9",
    gradTo: "#6366f1",
  },
  admin: {
    heading: "Admin Alerts",
    subtext: "System events, user activity & platform alerts",
    accentColor: "#f43f5e",
    accentLight: "#fff1f2",
    gradFrom: "#f43f5e",
    gradTo: "#f97316",
  },
  business: {
    heading: "Business Insights",
    subtext: "Leads, enrollments & campaign alerts",
    accentColor: "#10b981",
    accentLight: "#ecfdf5",
    gradFrom: "#10b981",
    gradTo: "#0ea5e9",
  },
};

// ── Shimmer skeleton ─────────────────────────────────────────
const SkeletonCard = () => (
  <div
    style={{
      display: "flex",
      gap: 14,
      padding: "18px 20px",
      borderRadius: 16,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      marginBottom: 12,
      animation: "pulse 1.4s ease-in-out infinite",
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "#e2e8f0",
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1 }}>
      <div
        style={{
          width: "55%",
          height: 14,
          borderRadius: 7,
          background: "#e2e8f0",
          marginBottom: 8,
        }}
      />
      <div
        style={{
          width: "85%",
          height: 12,
          borderRadius: 6,
          background: "#f1f5f9",
        }}
      />
      <div
        style={{
          width: "40%",
          height: 12,
          borderRadius: 6,
          background: "#f1f5f9",
          marginTop: 6,
        }}
      />
    </div>
  </div>
);

// ── Single notification card ─────────────────────────────────
const NotifCard = ({ item, onRead, accent, index }) => {
  const { icon, grad, ring } = getMeta(item.type);
  const [g1, g2] = grad.split(",");
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => !item.read && onRead(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 16,
        background: item.read
          ? hovered
            ? "#f8fafc"
            : "#fff"
          : hovered
            ? `${ring}`
            : `${ring}`,
        border: `1.5px solid ${
          item.read
            ? hovered
              ? "#e2e8f0"
              : "#f1f5f9"
            : hovered
              ? accent
              : `${accent}40`
        }`,
        cursor: item.read ? "default" : "pointer",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        transform: hovered ? "translateY(-1px)" : "none",
        boxShadow: hovered
          ? "0 8px 25px -5px rgba(0,0,0,0.08)"
          : item.read
            ? "none"
            : `0 2px 12px -3px ${accent}25`,
        animationDelay: `${index * 60}ms`,
        animation: "slideIn 0.4s ease both",
      }}
    >
      {/* Gradient icon bubble */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${g1}, ${g2})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          boxShadow: `0 4px 12px ${g1}40`,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: item.read ? 500 : 700,
              color: item.read ? "#64748b" : "#0f172a",
              fontFamily: "'Sora', sans-serif",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#94a3b8",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {formatTime(item.createdAt)}
          </span>
        </div>
        <p
          style={{
            fontSize: 13,
            color: item.read ? "#94a3b8" : "#475569",
            lineHeight: 1.5,
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.message}
        </p>
        {!item.read && (
          <span
            style={{
              display: "inline-block",
              marginTop: 6,
              fontSize: 11,
              color: accent,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Tap to mark read ·
          </span>
        )}
      </div>

      {/* Unread pulse dot */}
      {!item.read && (
        <span
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 0 3px ${accent}30`,
            animation: "blink 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};

// ── Confirm Dialog ───────────────────────────────────────────
const ConfirmDialog = ({ onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9998,
      background: "rgba(15,23,42,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(4px)",
      animation: "fadeInDown 0.2s ease",
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "32px 28px",
        maxWidth: 360,
        width: "90%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        animation: "slideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: 18,
          fontWeight: 800,
          color: "#0f172a",
          fontFamily: "'Sora', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        Clear all notifications?
      </h3>
      <p
        style={{
          margin: "0 0 24px",
          fontSize: 13,
          color: "#64748b",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6,
        }}
      >
        This will remove all notifications from your inbox. This action cannot
        be undone.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "11px 0",
            borderRadius: 12,
            border: "1.5px solid #e2e8f0",
            background: "#f8fafc",
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8fafc";
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "11px 0",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #f43f5e, #e11d48)",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s ease",
            boxShadow: "0 4px 14px #f43f5e40",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Yes, Clear All
        </button>
      </div>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────
const NotificationsPage = () => {
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const toastRef = useRef(null);

  const role = pathname.startsWith("/student")
    ? "student"
    : pathname.startsWith("/trainer")
      ? "trainer"
      : pathname.startsWith("/admin")
        ? "admin"
        : pathname.startsWith("/business")
          ? "business"
          : "student";

  const cfg = ROLE_CONFIG[role];
  const userEmail = localStorage.getItem("email");
  const userRole = role.toUpperCase();

  // ── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetchMyNotifications()
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── WebSocket ────────────────────────────────────────────
  useEffect(() => {
    connectWebSocket({
      userEmail,
      userRole,
      onMessage: (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        showToast(`New: ${newNotif.title}`);
      },
    });
    return () => disconnectWebSocket();
  }, [userEmail, userRole]);

  const showToast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToastMsg(null), 3500);
  };

  // ── Handlers ─────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllRead = async () => {
    await markAllReadAPI();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read");
  };

  // ── CLEAR ALL: permanently deletes from DB via DELETE endpoint ─
  const handleClearAll = async () => {
    setShowConfirm(false);
    await clearAllNotificationsAPI(); // ← DELETE /api/notification/clear-all
    setNotifications([]);
    showToast("All notifications cleared");
  };

  // ── Derived ──────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const grouped = groupByDay(filtered);

  // ─────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: 780,
          margin: "0 auto",
          padding: "0 4px",
          animation: "fadeInDown 0.4s ease both",
        }}
      >
        {/* ── HEADER CARD ─────────────────────────────────── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${cfg.gradFrom}18, ${cfg.gradTo}10)`,
            border: `1.5px solid ${cfg.gradFrom}25`,
            borderRadius: 24,
            padding: "28px 28px 22px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              pointerEvents: "none",
              background: `radial-gradient(circle, ${cfg.gradFrom}20, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: 60,
              width: 80,
              height: 80,
              borderRadius: "50%",
              pointerEvents: "none",
              background: `radial-gradient(circle, ${cfg.gradTo}15, transparent 70%)`,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              position: "relative",
            }}
          >
            <div>
              {/* Role badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: `linear-gradient(90deg, ${cfg.gradFrom}, ${cfg.gradTo})`,
                  borderRadius: 99,
                  padding: "4px 12px",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13 }}>🔔</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} Notifications
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                  fontFamily: "'Sora', sans-serif",
                  lineHeight: 1.1,
                }}
              >
                {cfg.heading}
              </h1>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  color: "#64748b",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {cfg.subtext}
              </p>
            </div>

            {/* Right-side action buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {/* Unread pill */}
              {unreadCount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: cfg.accentColor,
                    borderRadius: 99,
                    padding: "6px 14px",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#fff",
                      animation: "blink 2s infinite",
                    }}
                  />
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}
                  >
                    {unreadCount} unread
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                {/* Mark all read */}
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#fff",
                      border: `1.5px solid ${cfg.accentColor}40`,
                      borderRadius: 10,
                      padding: "7px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: cfg.accentColor,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = cfg.accentLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    ✓ Mark all read
                  </button>
                )}

                {/* 🗑️ Clear all — visible whenever there are any notifications */}
                {notifications.length > 0 && (
                  <button
                    onClick={() => setShowConfirm(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#fff",
                      border: "1.5px solid #fecdd3",
                      borderRadius: 10,
                      padding: "7px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#f43f5e",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fff1f2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    🗑️ Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Total", value: notifications.length, icon: "📬" },
              { label: "Unread", value: unreadCount, icon: "🔴" },
              {
                label: "Read",
                value: notifications.length - unreadCount,
                icon: "✅",
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#fff",
                  borderRadius: 12,
                  padding: "8px 14px",
                  border: "1.5px solid #f1f5f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ fontSize: 15 }}>{icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#0f172a",
                      lineHeight: 1,
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#94a3b8",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTER TABS ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {["all", "unread"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 18px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                fontFamily: "'DM Sans', sans-serif",
                border:
                  filter === f
                    ? `1.5px solid ${cfg.accentColor}`
                    : "1.5px solid #e2e8f0",
                background: filter === f ? cfg.accentColor : "#fff",
                color: filter === f ? "#fff" : "#64748b",
                boxShadow:
                  filter === f ? `0 4px 12px ${cfg.accentColor}35` : "none",
              }}
            >
              {f === "all"
                ? `All (${notifications.length})`
                : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* ── NOTIFICATION LIST ────────────────────────────── */}
        <div>
          {/* Loading skeletons */}
          {loading && [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fff",
                borderRadius: 20,
                border: "1.5px dashed #e2e8f0",
                animation: "fadeInDown 0.4s ease",
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  marginBottom: 16,
                  lineHeight: 1,
                  filter: "grayscale(0.3)",
                }}
              >
                {notifications.length === 0
                  ? "🔕"
                  : filter === "unread"
                    ? "✨"
                    : "🔕"}
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#1e293b",
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {notifications.length === 0
                  ? "Inbox is clear!"
                  : filter === "unread"
                    ? "All caught up!"
                    : "No notifications yet"}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                {notifications.length === 0
                  ? "You've cleared everything. New alerts will appear here in real-time."
                  : filter === "unread"
                    ? "You've read everything. Great job! 🎉"
                    : role === "trainer"
                      ? "Student activity & batch alerts will appear here."
                      : "Videos, quizzes & updates will appear here in real-time."}
              </p>
            </div>
          )}

          {/* Grouped by day */}
          {!loading &&
            Object.entries(grouped).map(([day, items]) => (
              <div key={day} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontFamily: "'Sora', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {day}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                  <span
                    style={{
                      fontSize: 11,
                      color: "#cbd5e1",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {items.length} alert{items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {items.map((item, i) => (
                    <NotifCard
                      key={item.id}
                      item={item}
                      onRead={handleMarkRead}
                      accent={cfg.accentColor}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── CONFIRM DIALOG ────────────────────────────────── */}
      {showConfirm && (
        <ConfirmDialog
          onConfirm={handleClearAll}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* ── TOAST ─────────────────────────────────────────── */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0f172a",
            color: "#fff",
            padding: "12px 22px",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 9999,
            animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
          }}
        >
          <span>✓</span> {toastMsg}
        </div>
      )}
    </>
  );
};

export default NotificationsPage;