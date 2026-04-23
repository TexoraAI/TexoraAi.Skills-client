//for github//
import { Bell, Menu, X } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { onForegroundMessage, registerFcmToken } from "../services/firebaseService";
import { useTrainerTheme } from "../Trainer/trainerTheme";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/notificationService";

// ── Notification type → icon map ─────────────────────────────
const TYPE_ICON = {
  NEW_VIDEO:            "🎥",
  NEW_FILE:             "📁",
  NEW_ASSESSMENT:       "📝",
  NEW_CONTENT:          "📘",
  NEW_QUIZ:             "📝",
  NEW_COURSE:           "🎓",
  NEW_ASSIGNMENT:       "📋",
  BATCH_UPDATE:         "🏫",
  BATCH_ASSIGNED:       "🏫",
  NEW_CHAT:             "💬",
  CHAT_MESSAGE:         "💬",
  LIVE_SESSION:         "📡",
  LIVE_SESSION_STARTED: "📡",
  ATTENDANCE_MARKED:    "✅",
  DOUBT_RAISED:         "❓",
  ASSIGNMENT_SUBMIT:    "📤",
  DEFAULT:              "🔔",
};
const getIcon = (type) => TYPE_ICON[type] ?? TYPE_ICON.DEFAULT;

// ── Sound using Web Audio API ────────────────────────────────
const playSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const g1   = ctx.createGain();
    osc1.connect(g1); g1.connect(ctx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    // ✅ FIX 1: louder sound — 0.15 → 0.6
    g1.gain.setValueAtTime(0.6, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.22);

    const osc2 = ctx.createOscillator();
    const g2   = ctx.createGain();
    osc2.connect(g2); g2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.25);
    // ✅ FIX 1: louder sound — 0.12 → 0.5
    g2.gain.setValueAtTime(0.5, ctx.currentTime + 0.25);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.48);
    osc2.start(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 0.48);

    setTimeout(() => ctx.close(), 600);
  } catch (e) {
    console.warn("Sound error:", e);
  }
};

// ─────────────────────────────────────────────────────────────
// Notification permission banner
// ─────────────────────────────────────────────────────────────
const NotificationBanner = () => {
  const [show, setShow] = useState(false);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    // ✅ FIX 2: remember dismissal — don't show banner again after X clicked
    const dismissed = localStorage.getItem("notif_banner_dismissed");
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default" &&
      !dismissed
    ) {
      setShow(true);
    }
  }, []);

  const handleEnable = async () => {
    setAsking(true);
    try {
      const token = await registerFcmToken();
      if (token) console.log("✅ FCM registered:", token);
    } catch (err) {
      console.error("FCM error:", err);
    } finally {
      setShow(false);
      setAsking(false);
    }
  };

  const handleDismiss = () => {
    // ✅ FIX 2: persist dismissal to localStorage
    localStorage.setItem("notif_banner_dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position:     "fixed",
      bottom:       24,
      left:         "50%",
      transform:    "translateX(-50%)",
      background:   "#1e293b",
      color:        "#f8fafc",
      padding:      "13px 18px",
      borderRadius: 14,
      display:      "flex",
      alignItems:   "center",
      gap:          12,
      boxShadow:    "0 8px 32px rgba(0,0,0,0.28)",
      border:       "1px solid rgba(255,255,255,0.08)",
      zIndex:       9998,
      fontFamily:   "DM Sans, sans-serif",
      fontSize:     "0.86rem",
      whiteSpace:   "nowrap",
      animation:    "bnrIn 0.35s ease",
    }}>
      <style>{`
        @keyframes bnrIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <span style={{ fontSize: 18 }}>🔔</span>
      <span style={{ color: "#cbd5e1" }}>
        Enable notifications to get video &amp; course alerts
      </span>
      <button
        onClick={handleEnable}
        disabled={asking}
        style={{
          background:   "#F97316",
          color:        "#fff",
          border:       "none",
          borderRadius: 8,
          padding:      "7px 16px",
          cursor:       asking ? "not-allowed" : "pointer",
          fontWeight:   700,
          fontSize:     "0.82rem",
          opacity:      asking ? 0.7 : 1,
          fontFamily:   "inherit",
        }}
      >
        {asking ? "Enabling…" : "Enable"}
      </button>
      <button
        onClick={handleDismiss}
        style={{
          background: "none",
          border:     "none",
          color:      "#64748b",
          cursor:     "pointer",
          display:    "flex",
          alignItems: "center",
          padding:    0,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Toast stack — shows multiple toasts, each auto-dismisses
// ─────────────────────────────────────────────────────────────
const ToastStack = ({ toasts, onDismiss, onNavigate }) => (
  // ✅ FIX 3: top: 24 instead of bottom: 24 → appears top-right
  <div style={{
    position:      "fixed",
    top:           24,
    right:         24,
    zIndex:        9999,
    display:       "flex",
    flexDirection: "column",
    gap:           10,
    alignItems:    "flex-end",
    maxWidth:      360,
  }}>
    {toasts.map((t) => (
      <div
        key={t.id}
        onClick={() => onNavigate(t)}
        style={{
          background:   "#1e293b",
          color:        "#f8fafc",
          padding:      "12px 16px",
          borderRadius: 14,
          fontSize:     13,
          fontWeight:   600,
          boxShadow:    "0 8px 32px rgba(0,0,0,0.25)",
          border:       "1px solid rgba(255,255,255,0.08)",
          display:      "flex",
          alignItems:   "flex-start",
          gap:          10,
          animation:    "slideDown 0.3s ease",
          cursor:       "pointer",
          width:        "100%",
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>
          {getIcon(t.type)}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, marginBottom: 2, fontSize: 13 }}>
            {t.title}
          </div>
          <div style={{
            color:        "#94a3b8",
            fontSize:     12,
            fontWeight:   400,
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}>
            {t.message}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(t.id); }}
          style={{
            background: "none",
            border:     "none",
            color:      "#64748b",
            cursor:     "pointer",
            padding:    0,
            flexShrink: 0,
            display:    "flex",
            alignItems: "center",
          }}
        >
          <X size={14} />
        </button>
      </div>
    ))}
    <style>{`
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Main layout
// ─────────────────────────────────────────────────────────────
const DashboardLayout = ({ SidebarComponent }) => {
  const { t }    = useTrainerTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const base     = "/" + location.pathname.split("/")[1];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts]           = useState([]);
  const toastCounterRef               = useRef(0);

  const userEmail = localStorage.getItem("email");
  const userRole  = location.pathname.startsWith("/student") ? "STUDENT"
                  : location.pathname.startsWith("/trainer") ? "TRAINER"
                  : location.pathname.startsWith("/admin")   ? "ADMIN"
                  : "BUSINESS";

  const notifPath = `${base}/notifications`;

  const addToast = useCallback((title, message, type) => {
    playSound();
    const id = ++toastCounterRef.current;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToastClick = (t) => {
    dismissToast(t.id);
    navigate(notifPath);
  };

  useEffect(() => {
    if (!userEmail) return;

    connectWebSocket({
      userEmail,
      userRole,
      onMessage: (notif) => {
        addToast(notif.title, notif.message, notif.type);
        window.dispatchEvent(
          new CustomEvent("lms:notification", { detail: notif })
        );
      },
    });

    return () => disconnectWebSocket();
  }, [userEmail, userRole, addToast]);

  useEffect(() => {
    onForegroundMessage((payload) => {
      const title = payload.notification?.title || payload.data?.title || "New Notification";
      const body  = payload.notification?.body  || payload.data?.body  || "";
      const type  = payload.data?.type || "DEFAULT";
      addToast(title, body, type);
    });
  }, [addToast]);

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <div className="h-screen bg-white text-slate-900 dark:bg-[#0a0a0a] dark:text-white">
      <div className="flex h-full overflow-hidden">

        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        <aside className={`
          fixed md:static z-40 top-0 left-0 h-full w-64 md:w-auto
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}>
          {SidebarComponent && <SidebarComponent closeSidebar={closeSidebar} />}
        </aside>

        <div className="flex flex-col flex-1 md:ml-0 min-w-0">

          <div className="h-16 flex items-center justify-between
            px-4 md:px-6
            bg-white dark:bg-[#0a0a0a]
            border-b border-slate-200 dark:border-[#1a1a1a]">

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <NotificationBellSlot navigate={navigate} notifPath={notifPath} />

              <button
                onClick={() => navigate(`${base}/profile`)}
                className="w-9 h-9 rounded-full
                  bg-gradient-to-br from-blue-600 to-indigo-600
                  hover:opacity-90 transition text-white font-semibold
                  text-sm flex items-center justify-center shadow-md"
              >
                S
              </button>
            </div>
          </div>

          <main
            className="flex-1 overflow-y-auto"
            style={{ background: t.pageBg }}
          >
            <Outlet />
          </main>
        </div>
      </div>

      <NotificationBanner />

      <ToastStack
        toasts={toasts}
        onDismiss={dismissToast}
        onNavigate={handleToastClick}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Lightweight bell slot — listens to custom window event
// NO WebSocket connection here — layout owns the connection
// ─────────────────────────────────────────────────────────────
const NotificationBellSlot = ({ navigate, notifPath }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    import("../services/notificationService").then(({ fetchUnreadCount }) => {
      fetchUnreadCount().then(setUnreadCount).catch(() => {});
    });
  }, []);

  useEffect(() => {
    const handler = () => {
      setUnreadCount((c) => c + 1);
    };
    window.addEventListener("lms:notification", handler);
    return () => window.removeEventListener("lms:notification", handler);
  }, []);

  return (
    <button
      onClick={() => {
        setUnreadCount(0);
        navigate(notifPath);
      }}
      className="relative p-2 rounded-lg hover:bg-slate-100
                 dark:hover:bg-white/5 transition"
    >
      <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center
          justify-center rounded-full bg-indigo-500 text-white
          text-[10px] font-bold shadow-lg ring-2 ring-white dark:ring-black">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default DashboardLayout;














// //for github//
// import { Bell, Menu, X } from "lucide-react";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useLocation, useNavigate, Outlet } from "react-router-dom";
// import { onForegroundMessage, registerFcmToken } from "../services/firebaseService";
// import { useTrainerTheme } from "../Trainer/trainerTheme";
// import {
//   connectWebSocket,
//   disconnectWebSocket,
// } from "../services/notificationService";

// // ── Notification type → icon map ─────────────────────────────
// const TYPE_ICON = {
//   NEW_VIDEO:            "🎥",
//   NEW_FILE:             "📁",
//   NEW_ASSESSMENT:       "📝",
//   NEW_CONTENT:          "📘",
//   NEW_QUIZ:             "📝",
//   NEW_COURSE:           "🎓",
//   NEW_ASSIGNMENT:       "📋",
//   BATCH_UPDATE:         "🏫",
//   BATCH_ASSIGNED:       "🏫",
//   NEW_CHAT:             "💬",
//   CHAT_MESSAGE:         "💬",
//   LIVE_SESSION:         "📡",
//   LIVE_SESSION_STARTED: "📡",
//   ATTENDANCE_MARKED:    "✅",
//   DOUBT_RAISED:         "❓",
//   ASSIGNMENT_SUBMIT:    "📤",
//   DEFAULT:              "🔔",
// };
// const getIcon = (type) => TYPE_ICON[type] ?? TYPE_ICON.DEFAULT;

// // ── Shared AudioContext — created once, reused ───────────────
// let _audioCtx = null;
// const getAudioCtx = () => {
//   if (!_audioCtx || _audioCtx.state === "closed") {
//     _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//   }
//   return _audioCtx;
// };

// // ── Unlock AudioContext on first user interaction ────────────
// // Browsers suspend AudioContext until user clicks/taps something.
// // This runs once and resumes it so sound works even on passive pages.
// const unlockAudio = () => {
//   try {
//     const ctx = getAudioCtx();
//     if (ctx.state === "suspended") {
//       ctx.resume();
//     }
//   } catch (_) {}
// };
// if (typeof window !== "undefined") {
//   window.addEventListener("click",      unlockAudio, { once: false });
//   window.addEventListener("keydown",    unlockAudio, { once: false });
//   window.addEventListener("touchstart", unlockAudio, { once: false });
// }

// // ── Sound using Web Audio API ────────────────────────────────
// const playSound = () => {
//   try {
//     const ctx = getAudioCtx();

//     // ✅ If still suspended (no interaction yet), resume first
//     const doPlay = () => {
//       const t = ctx.currentTime;

//       const osc1 = ctx.createOscillator();
//       const g1   = ctx.createGain();
//       osc1.connect(g1); g1.connect(ctx.destination);
//       osc1.type = "sine";
//       osc1.frequency.setValueAtTime(880, t);
//       g1.gain.setValueAtTime(0.6, t);
//       g1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
//       osc1.start(t);
//       osc1.stop(t + 0.22);

//       const osc2 = ctx.createOscillator();
//       const g2   = ctx.createGain();
//       osc2.connect(g2); g2.connect(ctx.destination);
//       osc2.type = "sine";
//       osc2.frequency.setValueAtTime(1100, t + 0.25);
//       g2.gain.setValueAtTime(0.5, t + 0.25);
//       g2.gain.exponentialRampToValueAtTime(0.001, t + 0.48);
//       osc2.start(t + 0.25);
//       osc2.stop(t + 0.48);
//     };

//     if (ctx.state === "suspended") {
//       ctx.resume().then(doPlay);
//     } else {
//       doPlay();
//     }
//   } catch (e) {
//     console.warn("Sound error:", e);
//   }
// };

// // ─────────────────────────────────────────────────────────────
// // Notification permission banner
// // ─────────────────────────────────────────────────────────────
// const NotificationBanner = () => {
//   const [show, setShow] = useState(false);
//   const [asking, setAsking] = useState(false);

//   useEffect(() => {
//     // ✅ FIX 2: remember dismissal — don't show banner again after X clicked
//     const dismissed = localStorage.getItem("notif_banner_dismissed");
//     if (
//       typeof Notification !== "undefined" &&
//       Notification.permission === "default" &&
//       !dismissed
//     ) {
//       setShow(true);
//     }
//   }, []);

//   const handleEnable = async () => {
//     setAsking(true);
//     try {
//       const token = await registerFcmToken();
//       if (token) console.log("✅ FCM registered:", token);
//     } catch (err) {
//       console.error("FCM error:", err);
//     } finally {
//       setShow(false);
//       setAsking(false);
//     }
//   };

//   const handleDismiss = () => {
//     // ✅ FIX 2: persist dismissal to localStorage
//     localStorage.setItem("notif_banner_dismissed", "true");
//     setShow(false);
//   };

//   if (!show) return null;

//   return (
//     <div style={{
//       position:     "fixed",
//       bottom:       24,
//       left:         "50%",
//       transform:    "translateX(-50%)",
//       background:   "#1e293b",
//       color:        "#f8fafc",
//       padding:      "13px 18px",
//       borderRadius: 14,
//       display:      "flex",
//       alignItems:   "center",
//       gap:          12,
//       boxShadow:    "0 8px 32px rgba(0,0,0,0.28)",
//       border:       "1px solid rgba(255,255,255,0.08)",
//       zIndex:       9998,
//       fontFamily:   "DM Sans, sans-serif",
//       fontSize:     "0.86rem",
//       whiteSpace:   "nowrap",
//       animation:    "bnrIn 0.35s ease",
//     }}>
//       <style>{`
//         @keyframes bnrIn {
//           from { opacity: 0; transform: translateX(-50%) translateY(16px); }
//           to   { opacity: 1; transform: translateX(-50%) translateY(0); }
//         }
//       `}</style>
//       <span style={{ fontSize: 18 }}>🔔</span>
//       <span style={{ color: "#cbd5e1" }}>
//         Enable notifications to get video &amp; course alerts
//       </span>
//       <button
//         onClick={handleEnable}
//         disabled={asking}
//         style={{
//           background:   "#F97316",
//           color:        "#fff",
//           border:       "none",
//           borderRadius: 8,
//           padding:      "7px 16px",
//           cursor:       asking ? "not-allowed" : "pointer",
//           fontWeight:   700,
//           fontSize:     "0.82rem",
//           opacity:      asking ? 0.7 : 1,
//           fontFamily:   "inherit",
//         }}
//       >
//         {asking ? "Enabling…" : "Enable"}
//       </button>
//       <button
//         onClick={handleDismiss}
//         style={{
//           background: "none",
//           border:     "none",
//           color:      "#64748b",
//           cursor:     "pointer",
//           display:    "flex",
//           alignItems: "center",
//           padding:    0,
//         }}
//       >
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Toast stack — shows multiple toasts, each auto-dismisses
// // ─────────────────────────────────────────────────────────────
// const ToastStack = ({ toasts, onDismiss, onNavigate }) => (
//   // ✅ FIX 3: top: 24 instead of bottom: 24 → appears top-right
//   <div style={{
//     position:      "fixed",
//     top:           24,
//     right:         24,
//     zIndex:        9999,
//     display:       "flex",
//     flexDirection: "column",
//     gap:           10,
//     alignItems:    "flex-end",
//     maxWidth:      360,
//   }}>
//     {toasts.map((t) => (
//       <div
//         key={t.id}
//         onClick={() => onNavigate(t)}
//         style={{
//           background:   "#1e293b",
//           color:        "#f8fafc",
//           padding:      "12px 16px",
//           borderRadius: 14,
//           fontSize:     13,
//           fontWeight:   600,
//           boxShadow:    "0 8px 32px rgba(0,0,0,0.25)",
//           border:       "1px solid rgba(255,255,255,0.08)",
//           display:      "flex",
//           alignItems:   "flex-start",
//           gap:          10,
//           animation:    "slideDown 0.3s ease",
//           cursor:       "pointer",
//           width:        "100%",
//         }}
//       >
//         <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>
//           {getIcon(t.type)}
//         </span>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ fontWeight: 700, marginBottom: 2, fontSize: 13 }}>
//             {t.title}
//           </div>
//           <div style={{
//             color:        "#94a3b8",
//             fontSize:     12,
//             fontWeight:   400,
//             overflow:     "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace:   "nowrap",
//           }}>
//             {t.message}
//           </div>
//         </div>
//         <button
//           onClick={(e) => { e.stopPropagation(); onDismiss(t.id); }}
//           style={{
//             background: "none",
//             border:     "none",
//             color:      "#64748b",
//             cursor:     "pointer",
//             padding:    0,
//             flexShrink: 0,
//             display:    "flex",
//             alignItems: "center",
//           }}
//         >
//           <X size={14} />
//         </button>
//       </div>
//     ))}
//     <style>{`
//       @keyframes slideDown {
//         from { opacity: 0; transform: translateY(-14px); }
//         to   { opacity: 1; transform: translateY(0); }
//       }
//     `}</style>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────
// // Main layout
// // ─────────────────────────────────────────────────────────────
// const DashboardLayout = ({ SidebarComponent }) => {
//   const { t }    = useTrainerTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const base     = "/" + location.pathname.split("/")[1];

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [toasts, setToasts]           = useState([]);
//   const toastCounterRef               = useRef(0);

//   const userEmail = localStorage.getItem("email");
//   const userRole  = location.pathname.startsWith("/student") ? "STUDENT"
//                   : location.pathname.startsWith("/trainer") ? "TRAINER"
//                   : location.pathname.startsWith("/admin")   ? "ADMIN"
//                   : "BUSINESS";

//   const notifPath = `${base}/notifications`;

//   const addToast = useCallback((title, message, type) => {
//     playSound();
//     const id = ++toastCounterRef.current;
//     setToasts((prev) => [...prev, { id, title, message, type }]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 5000);
//   }, []);

//   const dismissToast = (id) => {
//     setToasts((prev) => prev.filter((t) => t.id !== id));
//   };

//   const handleToastClick = (t) => {
//     dismissToast(t.id);
//     navigate(notifPath);
//   };

//   useEffect(() => {
//     if (!userEmail) return;

//     connectWebSocket({
//       userEmail,
//       userRole,
//       onMessage: (notif) => {
//         addToast(notif.title, notif.message, notif.type);
//         window.dispatchEvent(
//           new CustomEvent("lms:notification", { detail: notif })
//         );
//       },
//     });

//     return () => disconnectWebSocket();
//   }, [userEmail, userRole, addToast]);

//   useEffect(() => {
//     onForegroundMessage((payload) => {
//       const title = payload.notification?.title || payload.data?.title || "New Notification";
//       const body  = payload.notification?.body  || payload.data?.body  || "";
//       const type  = payload.data?.type || "DEFAULT";
//       addToast(title, body, type);
//     });
//   }, [addToast]);

//   const toggleSidebar = () => setSidebarOpen((o) => !o);
//   const closeSidebar  = () => setSidebarOpen(false);

//   return (
//     <div className="h-screen bg-white text-slate-900 dark:bg-[#0a0a0a] dark:text-white">
//       <div className="flex h-full overflow-hidden">

//         {sidebarOpen && (
//           <div
//             onClick={closeSidebar}
//             className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           />
//         )}

//         <aside className={`
//           fixed md:static z-40 top-0 left-0 h-full w-64 md:w-auto
//           transform transition-transform duration-300
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//         `}>
//           {SidebarComponent && <SidebarComponent closeSidebar={closeSidebar} />}
//         </aside>

//         <div className="flex flex-col flex-1 md:ml-0 min-w-0">

//           <div className="h-16 flex items-center justify-between
//             px-4 md:px-6
//             bg-white dark:bg-[#0a0a0a]
//             border-b border-slate-200 dark:border-[#1a1a1a]">

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleSidebar}
//                 className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
//               >
//                 <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
//               </button>
//             </div>

//             <div className="flex items-center gap-3 ml-auto">
//               <NotificationBellSlot navigate={navigate} notifPath={notifPath} />

//               <button
//                 onClick={() => navigate(`${base}/profile`)}
//                 className="w-9 h-9 rounded-full
//                   bg-gradient-to-br from-blue-600 to-indigo-600
//                   hover:opacity-90 transition text-white font-semibold
//                   text-sm flex items-center justify-center shadow-md"
//               >
//                 S
//               </button>
//             </div>
//           </div>

//           <main
//             className="flex-1 overflow-y-auto"
//             style={{ background: t.pageBg }}
//           >
//             <Outlet />
//           </main>
//         </div>
//       </div>

//       <NotificationBanner />

//       <ToastStack
//         toasts={toasts}
//         onDismiss={dismissToast}
//         onNavigate={handleToastClick}
//       />
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Lightweight bell slot — listens to custom window event
// // NO WebSocket connection here — layout owns the connection
// // ─────────────────────────────────────────────────────────────
// const NotificationBellSlot = ({ navigate, notifPath }) => {
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     import("../services/notificationService").then(({ fetchUnreadCount }) => {
//       fetchUnreadCount().then(setUnreadCount).catch(() => {});
//     });
//   }, []);

//   useEffect(() => {
//     const handler = () => {
//       setUnreadCount((c) => c + 1);
//     };
//     window.addEventListener("lms:notification", handler);
//     return () => window.removeEventListener("lms:notification", handler);
//   }, []);

//   return (
//     <button
//       onClick={() => {
//         setUnreadCount(0);
//         navigate(notifPath);
//       }}
//       className="relative p-2 rounded-lg hover:bg-slate-100
//                  dark:hover:bg-white/5 transition"
//     >
//       <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
//       {unreadCount > 0 && (
//         <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center
//           justify-center rounded-full bg-indigo-500 text-white
//           text-[10px] font-bold shadow-lg ring-2 ring-white dark:ring-black">
//           {unreadCount > 99 ? "99+" : unreadCount}
//         </span>
//       )}
//     </button>
//   );
// };

// export default DashboardLayout;