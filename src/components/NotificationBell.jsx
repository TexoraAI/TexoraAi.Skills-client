
// import React, { useEffect, useState, useRef } from "react";
// import { Bell, CheckCheck, X, Circle } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   fetchMyNotifications,
//   fetchUnreadCount,
//   markOneRead,
//   markAllReadAPI,
//   // ✅ NO connectWebSocket here — DashboardLayout owns the single connection
// } from "../services/notificationService";

// const TYPE_META = {
//   NEW_VIDEO:            { icon: "🎥", color: "from-blue-500 to-indigo-500" },
//   NEW_FILE:             { icon: "📁", color: "from-green-500 to-teal-500" },
//   NEW_ASSESSMENT:       { icon: "📝", color: "from-purple-500 to-pink-500" },
//   NEW_CONTENT:          { icon: "📘", color: "from-cyan-500 to-blue-500" },
//   NEW_QUIZ:             { icon: "📝", color: "from-purple-500 to-pink-500" },
//   NEW_COURSE:           { icon: "🎓", color: "from-indigo-500 to-blue-500" },
//   NEW_ASSIGNMENT:       { icon: "📋", color: "from-yellow-500 to-orange-500" },
//   BATCH_UPDATE:         { icon: "🏫", color: "from-orange-500 to-red-500" },
//   BATCH_ASSIGNED:       { icon: "🏫", color: "from-orange-500 to-red-500" },
//   NEW_CHAT:             { icon: "💬", color: "from-pink-500 to-rose-500" },
//   CHAT_MESSAGE:         { icon: "💬", color: "from-pink-500 to-rose-500" },
//   LIVE_SESSION:         { icon: "📡", color: "from-violet-500 to-purple-500" },
//   LIVE_SESSION_STARTED: { icon: "📡", color: "from-violet-500 to-purple-500" },
//   ATTENDANCE_MARKED:    { icon: "✅", color: "from-teal-500 to-green-500" },
//   DOUBT_RAISED:         { icon: "❓", color: "from-yellow-500 to-amber-500" },
//   DEFAULT:              { icon: "🔔", color: "from-gray-400 to-gray-600" },
// };
// const getMeta = (type) => TYPE_META[type] ?? TYPE_META.DEFAULT;

// const formatTime = (createdAt) => {
//   if (!createdAt) return "";
//   const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
//   if (diff < 60)    return `${diff}s ago`;
//   if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   return `${Math.floor(diff / 86400)}d ago`;
// };

// const NotificationBell = ({ roleOverride }) => {
//   const [open, setOpen]                   = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount]     = useState(0);
//   const [loading, setLoading]             = useState(true);
//   const [animateBell, setAnimateBell]     = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate    = useNavigate();
//   const { pathname } = useLocation();

//   const notificationsPath =
//   roleOverride === "student"
//     ? "/student/notifications"
//     : roleOverride === "trainer"
//     ? "/trainer/notifications"
//     : roleOverride === "admin"
//     ? "/admin/notifications"
//     : "/admin/notifications";

//   // ── Load initial data once ──
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [data, count] = await Promise.all([
//           fetchMyNotifications(),
//           fetchUnreadCount(),
//         ]);
//         setNotifications(data.slice(0, 8));
//         setUnreadCount(count);
//       } catch (err) {
//         console.error("Bell load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   // ✅ FIX: listen to custom window event dispatched by DashboardLayout's WebSocket
//   //         No second WebSocket connection opened here
//   useEffect(() => {
//     const handler = (e) => {
//       const newNotif = e.detail;
//       setAnimateBell(true);
//       setTimeout(() => setAnimateBell(false), 1000);
//       setNotifications((prev) => [newNotif, ...prev].slice(0, 8));
//       setUnreadCount((prev) => prev + 1);
//     };
//     window.addEventListener("lms:notification", handler);
//     return () => window.removeEventListener("lms:notification", handler);
//   }, []);

//   // ── Outside click closes dropdown ──
//   useEffect(() => {
//     const handle = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setOpen(false);
//     };
//     document.addEventListener("mousedown", handle);
//     return () => document.removeEventListener("mousedown", handle);
//   }, []);

//   const handleMarkRead = async (id, e) => {
//     e.stopPropagation();
//     await markOneRead(id);
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//     setUnreadCount((prev) => Math.max(0, prev - 1));
//   };

//   const handleMarkAllRead = async (e) => {
//     e.stopPropagation();
//     await markAllReadAPI();
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//     setUnreadCount(0);
//   };

//   const handleViewAll = () => {
//     setOpen(false);
//     navigate(notificationsPath);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="relative flex items-center justify-center w-10 h-10 rounded-xl
//                    text-gray-600 dark:text-slate-300
//                    hover:bg-gray-100 dark:hover:bg-slate-800
//                    transition-colors duration-200"
//         aria-label="Notifications"
//       >
//         <Bell className={`w-5 h-5 transition-transform duration-300
//           ${animateBell ? "animate-bounce" : ""}`} />

//         {unreadCount > 0 && (
//           <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center
//             justify-center rounded-full bg-indigo-500 text-white text-[10px]
//             font-bold shadow-lg ring-2 ring-white dark:ring-slate-900">
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         )}

//         {animateBell && (
//           <span className="absolute inset-0 rounded-xl animate-ping bg-indigo-400 opacity-30" />
//         )}
//       </button>

//       {open && (
//         <div
//           className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border
//                      border-gray-200 dark:border-slate-700
//                      bg-white dark:bg-slate-900
//                      shadow-2xl dark:shadow-black/40 z-[9999] overflow-hidden"
//           style={{ maxHeight: "480px", display: "flex", flexDirection: "column" }}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3
//             border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
//             <div className="flex items-center gap-2">
//               <Bell className="w-4 h-4 text-indigo-500" />
//               <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
//                 Notifications
//               </span>
//               {unreadCount > 0 && (
//                 <span className="px-2 py-0.5 text-[10px] font-bold rounded-full
//                   bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
//                   {unreadCount} new
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-1">
//               {unreadCount > 0 && (
//                 <button onClick={handleMarkAllRead}
//                   className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs
//                     text-indigo-600 dark:text-indigo-400
//                     hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
//                   <CheckCheck className="w-3 h-3" /> All read
//                 </button>
//               )}
//               <button onClick={() => setOpen(false)}
//                 className="p-1 rounded-lg text-gray-400 hover:text-gray-600
//                   dark:text-slate-500 dark:hover:text-slate-300
//                   hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* List */}
//           <div className="overflow-y-auto flex-1">
//             {loading && (
//               <div className="py-10 text-center text-sm text-gray-400 dark:text-slate-500">
//                 Loading...
//               </div>
//             )}
//             {!loading && notifications.length === 0 && (
//               <div className="py-10 text-center">
//                 <Bell className="w-8 h-8 mx-auto text-gray-300 dark:text-slate-600 mb-2" />
//                 <p className="text-sm text-gray-400 dark:text-slate-500">No notifications yet</p>
//               </div>
//             )}
//             {notifications.map((item) => {
//               const { icon, color } = getMeta(item.type);
//               return (
//                 <div key={item.id}
//                   onClick={(e) => !item.read && handleMarkRead(item.id, e)}
//                   className={`flex items-start gap-3 px-4 py-3 border-b
//                     border-gray-50 dark:border-slate-800/60
//                     hover:bg-gray-50 dark:hover:bg-slate-800/50
//                     transition-colors cursor-pointer
//                     ${!item.read ? "bg-indigo-50/50 dark:bg-indigo-950/10" : ""}`}>
//                   <div className={`flex h-9 w-9 flex-shrink-0 items-center
//                     justify-center rounded-xl text-base bg-gradient-to-br ${color} shadow-sm`}>
//                     {icon}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate">
//                       {item.title}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-0.5">
//                       {item.message}
//                     </p>
//                     <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-1">
//                       {formatTime(item.createdAt)}
//                     </p>
//                   </div>
//                   {!item.read && (
//                     <Circle className="w-2 h-2 fill-indigo-500 text-indigo-500 flex-shrink-0 mt-1" />
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Footer */}
//           <div className="flex-shrink-0 border-t border-gray-100 dark:border-slate-800">
//             <button onClick={handleViewAll}
//               className="w-full py-3 text-xs font-medium text-indigo-600
//                 dark:text-indigo-400 hover:bg-indigo-50
//                 dark:hover:bg-indigo-950/20 transition-colors">
//               View all notifications →
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;




































import React, { useEffect, useState, useRef } from "react";
import { Bell, X, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyNotifications,
  fetchUnreadCount,
  markOneRead,
  markAllReadAPI,
  // ✅ NO connectWebSocket here — DashboardLayout owns the single connection
} from "../services/notificationService";

// Small colored dot per notification type (matches the reference design)
const DOT_COLOR = {
  NEW_VIDEO: "#3b82f6",
  NEW_FILE: "#22c55e",
  NEW_ASSESSMENT: "#a855f7",
  NEW_CONTENT: "#06b6d4",
  NEW_QUIZ: "#a855f7",
  NEW_COURSE: "#6366f1",
  NEW_ASSIGNMENT: "#f59e0b",
  BATCH_UPDATE: "#f97316",
  BATCH_ASSIGNED: "#f97316",
  NEW_CHAT: "#ec4899",
  CHAT_MESSAGE: "#ec4899",
  LIVE_SESSION: "#8b5cf6",
  LIVE_SESSION_STARTED: "#8b5cf6",
  ATTENDANCE_MARKED: "#14b8a6",
  DOUBT_RAISED: "#f59e0b",
  ALERT: "#ef4444",
  SUSPENDED: "#ef4444",
  DEFAULT: "#94a3b8",
};
const getDotColor = (type) => DOT_COLOR[type] || DOT_COLOR.DEFAULT;

const formatTime = (createdAt) => {
  if (!createdAt) return "";
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = ({ roleOverride }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animateBell, setAnimateBell] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [btnHover, setBtnHover] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const notificationsPath =
    roleOverride === "student"
      ? "/student/notifications"
      : roleOverride === "trainer"
      ? "/trainer/notifications"
      : roleOverride === "admin"
      ? "/admin/notifications"
      : "/admin/notifications";

  // ── Load initial data once ──
  useEffect(() => {
    const load = async () => {
      try {
        const [data, count] = await Promise.all([
          fetchMyNotifications(),
          fetchUnreadCount(),
        ]);
        setNotifications((data || []).slice(0, 8));
        setUnreadCount(count || 0);
      } catch (err) {
        console.error("Bell load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ✅ Listen to custom window event dispatched by DashboardLayout's WebSocket
  useEffect(() => {
    const handler = (e) => {
      const newNotif = e.detail;
      setAnimateBell(true);
      setTimeout(() => setAnimateBell(false), 1000);
      setNotifications((prev) => [newNotif, ...prev].slice(0, 8));
      setUnreadCount((prev) => prev + 1);
    };
    window.addEventListener("lms:notification", handler);
    return () => window.removeEventListener("lms:notification", handler);
  }, []);

  // ── Outside click closes dropdown ──
  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await markAllReadAPI();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate(notificationsPath);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* ── Bell trigger button — styled to match .d-theme-toggle ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        aria-label="Notifications"
        style={{
          position: "relative",
          width: 36,
          height: 36,
          background: btnHover ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background .3s, border-color .3s, transform .2s",
          transform: btnHover ? "scale(1.1)" : "scale(1)",
        }}
      >
        <Bell
          size={18}
          color="#e5e7eb"
          style={{
            display: "block",
            transform: animateBell ? "rotate(-10deg)" : "none",
            transition: "transform .2s",
          }}
        />

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: "0 4px",
              borderRadius: 999,
              background: "#ef4444",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #181818",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {animateBell && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              background: "#f97316",
              opacity: 0.25,
              animation: "nbPing 1s ease",
            }}
          />
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 340,
            maxWidth: "90vw",
            borderRadius: 14,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            zIndex: 9999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: 440,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #f1f5f9",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
              Notifications
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6366f1",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading && (
              <div style={{ padding: "36px 0", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
                Loading...
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div style={{ padding: "36px 0", textAlign: "center" }}>
                <Bell size={30} color="#e2e8f0" style={{ margin: "0 auto 10px" }} />
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>No notifications yet</p>
              </div>
            )}

            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={(e) => !item.read && handleMarkRead(item.id, e)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 16px",
                  borderBottom: "1px solid #f8fafc",
                  cursor: "pointer",
                  background:
                    hoveredId === item.id
                      ? "#f8fafc"
                      : !item.read
                      ? "#f5f4ff"
                      : "transparent",
                  transition: "background .15s",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: getDotColor(item.type),
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#64748b" }}>
                    {formatTime(item.createdAt)}
                  </p>
                </div>
                {!item.read && (
                  <Circle size={7} style={{ marginTop: 6, flexShrink: 0 }} fill="#6366f1" color="#6366f1" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #f1f5f9", flexShrink: 0 }}>
            <button
              onClick={handleViewAll}
              style={{
                width: "100%",
                padding: "12px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#6366f1",
                fontFamily: "inherit",
              }}
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nbPing {
          0% { opacity: 0.35; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;