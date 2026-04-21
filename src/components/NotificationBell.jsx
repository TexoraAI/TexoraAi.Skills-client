// import React, { useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   fetchMyNotifications,
//   markOneRead,
//   markAllReadAPI,
//   clearAllNotificationsAPI,
//   connectWebSocket,
//   disconnectWebSocket,
// } from "../services/notificationService";

// // ── Role-aware TYPE_META ─────────────────────────────────────
// const TYPE_META = {
//   NEW_VIDEO: { icon: "🎥", label: "Video", grad: "#6366f1,#818cf8", ring: "#6366f120" },
//   NEW_FILE: { icon: "📁", label: "File", grad: "#10b981,#34d399", ring: "#10b98120" },
//   NEW_ASSESSMENT: { icon: "📝", label: "Assessment", grad: "#f59e0b,#fbbf24", ring: "#f59e0b20" },
//   NEW_CONTENT: { icon: "📘", label: "Content", grad: "#0ea5e9,#38bdf8", ring: "#0ea5e920" },
//   NEW_QUIZ: { icon: "🧠", label: "Quiz", grad: "#8b5cf6,#a78bfa", ring: "#8b5cf620" },
//   NEW_COURSE: { icon: "🎓", label: "Course", grad: "#ec4899,#f472b6", ring: "#ec489920" },
//   NEW_ASSIGNMENT: { icon: "📋", label: "Assignment", grad: "#f97316,#fb923c", ring: "#f9731620" },
//   ATTENDANCE: { icon: "✅", label: "Attendance", grad: "#14b8a6,#2dd4bf", ring: "#14b8a620" },
//   BATCH_UPDATE: { icon: "🏫", label: "Batch", grad: "#f43f5e,#fb7185", ring: "#f43f5e20" },
//   CHAT_MESSAGE: { icon: "💬", label: "Message", grad: "#ec4899,#f472b6", ring: "#ec489920" },
//   LIVE_SESSION: { icon: "📡", label: "Live", grad: "#7c3aed,#8b5cf6", ring: "#7c3aed20" },
//   STUDENT_JOINED: { icon: "👤", label: "Student", grad: "#0ea5e9,#38bdf8", ring: "#0ea5e920" },
//   DOUBT_RAISED: { icon: "❓", label: "Doubt", grad: "#f59e0b,#fbbf24", ring: "#f59e0b20" },
//   ASSIGNMENT_SUBMIT: { icon: "📤", label: "Submission", grad: "#10b981,#34d399", ring: "#10b98120" },
//   SESSION_REMINDER: { icon: "⏰", label: "Reminder", grad: "#6366f1,#818cf8", ring: "#6366f120" },
//   BATCH_ASSIGNED: { icon: "🏫", label: "Batch", grad: "#f43f5e,#fb7185", ring: "#f43f5e20" },
//   DEFAULT: { icon: "🔔", label: "Alert", grad: "#64748b,#94a3b8", ring: "#64748b20" },
// };

// const getMeta = (type) => {
//   if (!type) return TYPE_META.DEFAULT;
//   const key = type
//     .replace(/^NEW_MESSAGE$/i, "CHAT_MESSAGE")
//     .replace(/^ATTENDANCE_MARKED$/i, "ATTENDANCE")
//     .replace(/^NEW_COURSE_AVAILABLE$/i, "NEW_COURSE")
//     .replace(/^NEW_QUIZ_AVAILABLE$/i, "NEW_QUIZ")
//     .replace(/^NEW_ASSIGNMENT_POSTED$/i, "NEW_ASSIGNMENT")
//     .toUpperCase();
//   return TYPE_META[key] ?? TYPE_META.DEFAULT;
// };

// const formatTime = (createdAt) => {
//   if (!createdAt) return "";
//   const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
//   if (diff < 60) return `${diff}s ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   return `${Math.floor(diff / 86400)}d ago`;
// };

// const groupByDay = (notifications) => {
//   const groups = {};
//   notifications.forEach((n) => {
//     const date = n.createdAt ? new Date(n.createdAt) : new Date();
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     let label;
//     if (date.toDateString() === today.toDateString()) label = "Today";
//     else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
//     else
//       label = date.toLocaleDateString("en-IN", {
//         weekday: "long",
//         month: "short",
//         day: "numeric",
//       });
//     if (!groups[label]) groups[label] = [];
//     groups[label].push(n);
//   });
//   return groups;
// };

// // ── Role config ──────────────────────────────────────────────
// const ROLE_CONFIG = {
//   student: {
//     heading: "Notifications",
//     subtext: "Your learning updates, quizzes, assignments & more",
//     accentColor: "#6366f1",
//     accentLight: "#eef2ff",
//     gradFrom: "#6366f1",
//     gradTo: "#8b5cf6",
//     gradMid: "#ec4899",
//   },
//   trainer: {
//     heading: "Trainer Hub",
//     subtext: "Student activity, batch alerts & session reminders",
//     accentColor: "#0ea5e9",
//     accentLight: "#e0f2fe",
//     gradFrom: "#0ea5e9",
//     gradTo: "#6366f1",
//     gradMid: "#8b5cf6",
//   },
//   admin: {
//     heading: "Admin Alerts",
//     subtext: "System events, user activity & platform alerts",
//     accentColor: "#f43f5e",
//     accentLight: "#fff1f2",
//     gradFrom: "#f43f5e",
//     gradTo: "#f97316",
//     gradMid: "#fb923c",
//   },
//   business: {
//     heading: "Business Insights",
//     subtext: "Leads, enrollments & campaign alerts",
//     accentColor: "#10b981",
//     accentLight: "#ecfdf5",
//     gradFrom: "#10b981",
//     gradTo: "#0ea5e9",
//     gradMid: "#06b6d4",
//   },
// };

// // ── Shimmer skeleton ─────────────────────────────────────────
// const SkeletonCard = () => (
//   <div
//     style={{
//       display: "flex",
//       gap: 10,
//       padding: "12px 14px",
//       borderRadius: 12,
//       background: "var(--color-background-secondary, #f8fafc)",
//       border: "0.5px solid var(--color-border-tertiary, #e2e8f0)",
//       marginBottom: 6,
//       animation: "pulse 1.4s ease-in-out infinite",
//     }}
//   >
//     <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--color-border-secondary, #e2e8f0)", flexShrink: 0 }} />
//     <div style={{ flex: 1 }}>
//       <div style={{ width: "50%", height: 11, borderRadius: 6, background: "var(--color-border-secondary, #e2e8f0)", marginBottom: 8 }} />
//       <div style={{ width: "80%", height: 11, borderRadius: 6, background: "var(--color-border-tertiary, #f1f5f9)" }} />
//     </div>
//   </div>
// );

// // ── Single notification card ─────────────────────────────────
// const NotifCard = ({ item, onRead, accent, index }) => {
//   const { icon, grad, ring } = getMeta(item.type);
//   const [g1, g2] = grad.split(",");
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       onClick={() => !item.read && onRead(item.id)}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         display: "flex",
//         alignItems: "flex-start",
//         gap: 10,
//         padding: "12px 14px",
//         borderRadius: 12,
//         background: item.read
//           ? hovered ? "var(--color-background-secondary, #f8fafc)" : "var(--color-background-primary, #fff)"
//           : hovered ? `${ring}` : `${ring}`,
//         border: `0.5px solid ${
//           item.read
//             ? hovered ? "var(--color-border-secondary, #e2e8f0)" : "var(--color-border-tertiary, #f1f5f9)"
//             : hovered ? accent : `${accent}40`
//         }`,
//         cursor: item.read ? "default" : "pointer",
//         transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
//         position: "relative",
//         transform: hovered ? "translateY(-1px)" : "none",
//         boxShadow: hovered ? "0 4px 14px -4px rgba(0,0,0,0.08)" : "none",
//         animationDelay: `${index * 50}ms`,
//         animation: "slideIn 0.35s ease both",
//         marginBottom: 6,
//       }}
//     >
//       {/* Gradient icon bubble */}
//       <div
//         style={{
//           width: 38,
//           height: 38,
//           borderRadius: 10,
//           flexShrink: 0,
//           background: `linear-gradient(135deg, ${g1}, ${g2})`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 17,
//         }}
//       >
//         {icon}
//       </div>

//       {/* Text */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 2 }}>
//           <span
//             style={{
//               fontSize: 13,
//               fontWeight: item.read ? 500 : 700,
//               color: item.read ? "var(--color-text-secondary, #64748b)" : "var(--color-text-primary, #0f172a)",
//               fontFamily: "'Sora', sans-serif",
//               letterSpacing: "-0.01em",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {item.title}
//           </span>
//           <span
//             style={{
//               fontSize: 10,
//               color: "var(--color-text-tertiary, #94a3b8)",
//               whiteSpace: "nowrap",
//               flexShrink: 0,
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             {formatTime(item.createdAt)}
//           </span>
//         </div>
//         <p
//           style={{
//             fontSize: 12,
//             color: item.read ? "var(--color-text-tertiary, #94a3b8)" : "var(--color-text-secondary, #475569)",
//             lineHeight: 1.4,
//             margin: 0,
//             fontFamily: "'DM Sans', sans-serif",
//             display: "-webkit-box",
//             WebkitLineClamp: 1,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//           }}
//         >
//           {item.message}
//         </p>
//         {!item.read && (
//           <span
//             style={{
//               display: "inline-block",
//               marginTop: 3,
//               fontSize: 10,
//               color: accent,
//               fontWeight: 600,
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             Tap to mark read ·
//           </span>
//         )}
//       </div>

//       {/* Unread pulse dot */}
//       {!item.read && (
//         <span
//           style={{
//             position: "absolute",
//             top: 13,
//             right: 13,
//             width: 6,
//             height: 6,
//             borderRadius: "50%",
//             background: accent,
//             boxShadow: `0 0 0 3px ${accent}30`,
//             animation: "blink 2s ease-in-out infinite",
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // ── Confirm Dialog ───────────────────────────────────────────
// const ConfirmDialog = ({ onConfirm, onCancel }) => (
//   <div
//     style={{
//       position: "fixed",
//       inset: 0,
//       zIndex: 9998,
//       background: "rgba(15,23,42,0.45)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       backdropFilter: "blur(4px)",
//       animation: "fadeInDown 0.2s ease",
//     }}
//   >
//     <div
//       style={{
//         background: "var(--color-background-primary, #fff)",
//         borderRadius: 16,
//         padding: "24px 20px",
//         maxWidth: 320,
//         width: "90%",
//         border: "0.5px solid var(--color-border-secondary, #e2e8f0)",
//         animation: "slideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
//         textAlign: "center",
//       }}
//     >
//       <div style={{ fontSize: 36, marginBottom: 10 }}>🗑️</div>
//       <h3
//         style={{
//           margin: "0 0 6px",
//           fontSize: 16,
//           fontWeight: 800,
//           color: "var(--color-text-primary, #0f172a)",
//           fontFamily: "'Sora', sans-serif",
//           letterSpacing: "-0.02em",
//         }}
//       >
//         Clear all notifications?
//       </h3>
//       <p
//         style={{
//           margin: "0 0 18px",
//           fontSize: 12,
//           color: "var(--color-text-secondary, #64748b)",
//           fontFamily: "'DM Sans', sans-serif",
//           lineHeight: 1.5,
//         }}
//       >
//         This will remove all notifications from your inbox. This action cannot be undone.
//       </p>
//       <div style={{ display: "flex", gap: 8 }}>
//         <button
//           onClick={onCancel}
//           style={{
//             flex: 1,
//             padding: "9px 0",
//             borderRadius: 10,
//             border: "0.5px solid var(--color-border-secondary, #e2e8f0)",
//             background: "var(--color-background-secondary, #f8fafc)",
//             fontSize: 12,
//             fontWeight: 600,
//             color: "var(--color-text-secondary, #64748b)",
//             cursor: "pointer",
//             fontFamily: "'DM Sans', sans-serif",
//             transition: "all 0.15s ease",
//           }}
//           onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-background-tertiary, #f1f5f9)"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-background-secondary, #f8fafc)"; }}
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           style={{
//             flex: 1,
//             padding: "9px 0",
//             borderRadius: 10,
//             border: "none",
//             background: "linear-gradient(135deg, #f43f5e, #e11d48)",
//             fontSize: 12,
//             fontWeight: 700,
//             color: "#fff",
//             cursor: "pointer",
//             fontFamily: "'DM Sans', sans-serif",
//             transition: "all 0.15s ease",
//           }}
//           onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
//         >
//           Yes, Clear All
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ── Main Page ────────────────────────────────────────────────
// const NotificationsPage = () => {
//   const { pathname } = useLocation();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [toastMsg, setToastMsg] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [hidden, setHidden] = useState(false);
//   const toastRef = useRef(null);

//   const role = pathname.startsWith("/student")
//     ? "student"
//     : pathname.startsWith("/trainer")
//       ? "trainer"
//       : pathname.startsWith("/admin")
//         ? "admin"
//         : pathname.startsWith("/business")
//           ? "business"
//           : "student";

//   const cfg = ROLE_CONFIG[role];
//   const userEmail = localStorage.getItem("email");
//   const userRole = role.toUpperCase();

//   useEffect(() => {
//     setLoading(true);
//     fetchMyNotifications()
//       .then((data) => setNotifications(Array.isArray(data) ? data : []))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     connectWebSocket({
//       userEmail,
//       userRole,
//       onMessage: (newNotif) => {
//         setNotifications((prev) => [newNotif, ...prev]);
//         showToast(`New: ${newNotif.title}`);
//       },
//     });
//     return () => disconnectWebSocket();
//   }, [userEmail, userRole]);

//   const showToast = (msg) => {
//     setToastMsg(msg);
//     clearTimeout(toastRef.current);
//     toastRef.current = setTimeout(() => setToastMsg(null), 3500);
//   };

//   const handleMarkRead = async (id) => {
//     await markOneRead(id);
//     setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
//   };

//   const handleMarkAllRead = async () => {
//     await markAllReadAPI();
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//     showToast("All notifications marked as read");
//   };

//   const handleClearAll = async () => {
//     setShowConfirm(false);
//     await clearAllNotificationsAPI();
//     setNotifications([]);
//     showToast("All notifications cleared");
//   };

//   const unreadCount = Array.isArray(notifications)
//   ? notifications.filter((n) => n && n.read === false).length
//   : 0;
//   const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
//   const grouped = groupByDay(filtered);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes pulse {
//           0%,100% { opacity: 1; }
//           50%      { opacity: 0.5; }
//         }
//         @keyframes blink {
//           0%,100% { opacity: 1; transform: scale(1); }
//           50%      { opacity: 0.6; transform: scale(0.85); }
//         }
//         @keyframes toastIn {
//           from { opacity: 0; transform: translateY(12px) scale(0.96); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes fadeInDown {
//           from { opacity: 0; transform: translateY(-6px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-thumb { background: var(--color-border-secondary, #e2e8f0); border-radius: 99px; }
//       `}</style>

//       <div
//         style={{
//           fontFamily: "'DM Sans', sans-serif",
//           width: "100%",
//           padding: "0 16px",
//           animation: "fadeInDown 0.4s ease both",
//         }}
//       >
//         {/* ── HERO HEADER CARD ─────────────────────────────── */}
//         <div
//           style={{
//             background: `linear-gradient(135deg, ${cfg.gradFrom} 0%, ${cfg.gradMid} 50%, ${cfg.gradTo} 100%)`,
//             border: "none",
//             borderRadius: 20,
//             padding: "22px 24px 18px",
//             marginBottom: 12,
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           {/* Decorative blobs */}
//           <div
//             style={{
//               position: "absolute",
//               top: -40,
//               right: -40,
//               width: 160,
//               height: 160,
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.08)",
//               pointerEvents: "none",
//             }}
//           />
//           <div
//             style={{
//               position: "absolute",
//               bottom: -30,
//               left: "30%",
//               width: 120,
//               height: 120,
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.06)",
//               pointerEvents: "none",
//             }}
//           />

//           {/* Top row: badge + title + actions */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 14,
//               flexWrap: "wrap",
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             {/* Role badge */}
//             <div
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 5,
//                 background: "rgba(255,255,255,0.2)",
//                 border: "0.5px solid rgba(255,255,255,0.35)",
//                 borderRadius: 99,
//                 padding: "4px 14px",
//                 flexShrink: 0,
//                 backdropFilter: "blur(6px)",
//               }}
//             >
//               <span style={{ fontSize: 12 }}>🔔</span>
//               <span
//                 style={{
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#fff",
//                   letterSpacing: "0.06em",
//                   textTransform: "uppercase",
//                   fontFamily: "'Sora', sans-serif",
//                 }}
//               >
//                 {role.charAt(0).toUpperCase() + role.slice(1)} Notifications
//               </span>
//             </div>

//             {/* Title + subtext */}
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <h1
//                 style={{
//                   margin: 0,
//                   fontSize: 22,
//                   fontWeight: 800,
//                   color: "#fff",
//                   letterSpacing: "-0.025em",
//                   fontFamily: "'Sora', sans-serif",
//                   lineHeight: 1.1,
//                 }}
//               >
//                 {cfg.heading}
//               </h1>
//               <p
//                 style={{
//                   margin: "4px 0 0",
//                   fontSize: 12,
//                   color: "rgba(255,255,255,0.75)",
//                   fontFamily: "'DM Sans', sans-serif",
//                 }}
//               >
//                 {cfg.subtext}
//               </p>
//             </div>

//             {/* Right-side action buttons */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 flexShrink: 0,
//                 flexWrap: "wrap",
//               }}
//             >
//               {/* Unread pill */}
//               {unreadCount > 0 && (
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 5,
//                     background: "rgba(255,255,255,0.25)",
//                     border: "0.5px solid rgba(255,255,255,0.4)",
//                     borderRadius: 99,
//                     padding: "4px 12px",
//                     backdropFilter: "blur(6px)",
//                   }}
//                 >
//                   <span
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: "50%",
//                       background: "#fff",
//                       animation: "blink 2s infinite",
//                       display: "inline-block",
//                     }}
//                   />
//                   <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
//                     {unreadCount} unread
//                   </span>
//                 </div>
//               )}

//               {/* Mark all read */}
//               {unreadCount > 0 && (
//                 <button
//                   onClick={handleMarkAllRead}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     background: "rgba(255,255,255,0.15)",
//                     border: "0.5px solid rgba(255,255,255,0.35)",
//                     borderRadius: 8,
//                     padding: "6px 12px",
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: "#fff",
//                     cursor: "pointer",
//                     fontFamily: "'DM Sans', sans-serif",
//                     transition: "all 0.15s ease",
//                     backdropFilter: "blur(6px)",
//                   }}
//                   onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.28)"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
//                 >
//                   ✓ Mark all read
//                 </button>
//               )}

//               {/* Clear all */}
//               {notifications.length > 0 && (
//                 <button
//                   onClick={() => setShowConfirm(true)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     background: "rgba(255,255,255,0.15)",
//                     border: "0.5px solid rgba(255,100,100,0.5)",
//                     borderRadius: 8,
//                     padding: "6px 12px",
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: "#fff",
//                     cursor: "pointer",
//                     fontFamily: "'DM Sans', sans-serif",
//                     transition: "all 0.15s ease",
//                     backdropFilter: "blur(6px)",
//                   }}
//                   onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.4)"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
//                 >
//                   🗑️ Clear all
//                 </button>
//               )}

//               {/* Hide / Show toggle */}
//               <button
//                 onClick={() => setHidden((prev) => !prev)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                   background: "rgba(255,255,255,0.15)",
//                   border: "0.5px solid rgba(255,255,255,0.35)",
//                   borderRadius: 8,
//                   padding: "6px 12px",
//                   fontSize: 11,
//                   fontWeight: 600,
//                   color: "#fff",
//                   cursor: "pointer",
//                   fontFamily: "'DM Sans', sans-serif",
//                   transition: "all 0.15s ease",
//                   backdropFilter: "blur(6px)",
//                 }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.28)"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
//               >
//                 {hidden ? "👁 Show" : "🙈 Hide"}
//               </button>
//             </div>
//           </div>

//           {/* Stats row */}
//           <div
//             style={{
//               display: "flex",
//               gap: 8,
//               marginTop: 16,
//               flexWrap: "wrap",
//               position: "relative",
//               zIndex: 1,
//             }}
//           >
//             {[
//               { label: "Total", value: notifications.length },
//               { label: "Unread", value: unreadCount },
//               { label: "Read", value: notifications.length - unreadCount },
//             ].map(({ label, value }) => (
//               <div
//                 key={label}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   background: "rgba(255,255,255,0.15)",
//                   border: "0.5px solid rgba(255,255,255,0.25)",
//                   backdropFilter: "blur(8px)",
//                   borderRadius: 10,
//                   padding: "8px 16px",
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 18,
//                       fontWeight: 800,
//                       color: "#fff",
//                       lineHeight: 1,
//                       fontFamily: "'Sora', sans-serif",
//                     }}
//                   >
//                     {value}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 10,
//                       color: "rgba(255,255,255,0.7)",
//                       fontWeight: 600,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.06em",
//                       marginTop: 2,
//                     }}
//                   >
//                     {label}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── COLLAPSIBLE SECTION ──────────────────────────── */}
//         {!hidden && (
//           <div style={{ animation: "slideIn 0.3s ease both" }}>
//             {/* Filter Tabs */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: 6,
//                 marginBottom: 10,
//                 overflowX: "auto",
//                 paddingBottom: 2,
//               }}
//             >
//               {["all", "unread"].map((f) => (
//                 <button
//                   key={f}
//                   onClick={() => setFilter(f)}
//                   style={{
//                     padding: "5px 14px",
//                     borderRadius: 99,
//                     fontSize: 11,
//                     fontWeight: 600,
//                     cursor: "pointer",
//                     whiteSpace: "nowrap",
//                     transition: "all 0.15s ease",
//                     fontFamily: "'DM Sans', sans-serif",
//                     border:
//                       filter === f
//                         ? `0.5px solid ${cfg.accentColor}`
//                         : "0.5px solid var(--color-border-secondary, #e2e8f0)",
//                     background:
//                       filter === f
//                         ? cfg.accentColor
//                         : "var(--color-background-primary, #fff)",
//                     color: filter === f ? "#fff" : "var(--color-text-secondary, #64748b)",
//                   }}
//                 >
//                   {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
//                 </button>
//               ))}
//             </div>

//             {/* Notification List */}
//             <div>
//               {loading && [1, 2, 3].map((i) => <SkeletonCard key={i} />)}

//               {!loading && filtered.length === 0 && (
//                 <div
//                   style={{
//                     textAlign: "center",
//                     padding: "48px 20px",
//                     background: "var(--color-background-primary, #fff)",
//                     borderRadius: 16,
//                     border: "0.5px dashed var(--color-border-secondary, #e2e8f0)",
//                     animation: "fadeInDown 0.4s ease",
//                   }}
//                 >
//                   <div style={{ fontSize: 44, marginBottom: 12, lineHeight: 1 }}>
//                     {notifications.length === 0 ? "🔕" : filter === "unread" ? "✨" : "🔕"}
//                   </div>
//                   <h3
//                     style={{
//                       margin: "0 0 5px",
//                       fontSize: 16,
//                       fontWeight: 700,
//                       color: "var(--color-text-primary, #1e293b)",
//                       fontFamily: "'Sora', sans-serif",
//                     }}
//                   >
//                     {notifications.length === 0
//                       ? "Inbox is clear!"
//                       : filter === "unread"
//                         ? "All caught up!"
//                         : "No notifications yet"}
//                   </h3>
//                   <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-tertiary, #94a3b8)" }}>
//                     {notifications.length === 0
//                       ? "You've cleared everything. New alerts will appear here in real-time."
//                       : filter === "unread"
//                         ? "You've read everything. Great job! 🎉"
//                         : role === "trainer"
//                           ? "Student activity & batch alerts will appear here."
//                           : "Videos, quizzes & updates will appear here in real-time."}
//                   </p>
//                 </div>
//               )}

//               {!loading &&
//                 Object.entries(grouped).map(([day, items]) => (
//                   <div key={day} style={{ marginBottom: 20 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                       <span
//                         style={{
//                           fontSize: 10,
//                           fontWeight: 700,
//                           color: "var(--color-text-tertiary, #94a3b8)",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.08em",
//                           fontFamily: "'Sora', sans-serif",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {day}
//                       </span>
//                       <div style={{ flex: 1, height: 1, background: "var(--color-border-tertiary, #f1f5f9)" }} />
//                       <span style={{ fontSize: 10, color: "var(--color-text-tertiary, #cbd5e1)", fontFamily: "'DM Sans', sans-serif" }}>
//                         {items.length} alert{items.length !== 1 ? "s" : ""}
//                       </span>
//                     </div>
//                     <div>
//                       {items.map((item, i) => (
//                         <NotifCard
//                           key={item.id}
//                           item={item}
//                           onRead={handleMarkRead}
//                           accent={cfg.accentColor}
//                           index={i}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//         {/* Hidden state message */}
//         {hidden && (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "20px",
//               background: "var(--color-background-secondary, #f8fafc)",
//               borderRadius: 12,
//               border: "0.5px dashed var(--color-border-secondary, #e2e8f0)",
//               animation: "slideIn 0.3s ease both",
//             }}
//           >
//             <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-tertiary, #94a3b8)", fontFamily: "'DM Sans', sans-serif" }}>
//               🙈 Notifications hidden — click{" "}
//               <strong style={{ color: "var(--color-text-secondary)" }}>Show</strong> to view them
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Confirm Dialog */}
//       {showConfirm && (
//         <ConfirmDialog onConfirm={handleClearAll} onCancel={() => setShowConfirm(false)} />
//       )}

//       {/* Toast */}
//       {toastMsg && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 20,
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "var(--color-background-primary, #0f172a)",
//             color: "var(--color-text-primary, #fff)",
//             padding: "10px 18px",
//             borderRadius: 12,
//             fontSize: 12,
//             fontWeight: 600,
//             zIndex: 9999,
//             animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
//             boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
//             fontFamily: "'DM Sans', sans-serif",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             whiteSpace: "nowrap",
//             border: "0.5px solid var(--color-border-secondary, #e2e8f0)",
//           }}
//         >
//           <span>✓</span> {toastMsg}
//         </div>
//       )}
//     </>
//   );
// };

// export default NotificationsPage;






















import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, X, Circle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchMyNotifications,
  fetchUnreadCount,
  markOneRead,
  markAllReadAPI,
  connectWebSocket,
  disconnectWebSocket,
} from "../services/notificationService";

// ── Type → icon + color map ──────────────────────────────────
const TYPE_META = {
  NEW_VIDEO:      { icon: "🎥", color: "from-blue-500 to-indigo-500" },
  NEW_FILE:       { icon: "📁", color: "from-green-500 to-teal-500" },
  NEW_ASSESSMENT: { icon: "📝", color: "from-purple-500 to-pink-500" },
  NEW_CONTENT:    { icon: "📘", color: "from-cyan-500 to-blue-500" },
  BATCH_UPDATE:   { icon: "🏫", color: "from-orange-500 to-red-500" },
  CHAT_MESSAGE:   { icon: "💬", color: "from-pink-500 to-rose-500" },
  NEW_CHAT:       { icon: "💬", color: "from-pink-500 to-rose-500" },
  LIVE_SESSION:   { icon: "📡", color: "from-violet-500 to-purple-500" },
  DEFAULT:        { icon: "🔔", color: "from-gray-400 to-gray-600" },
};
const getMeta = (type) => TYPE_META[type] ?? TYPE_META.DEFAULT;

const formatTime = (createdAt) => {
  if (!createdAt) return "";
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ✅ FIX 6: Play a soft notification sound using Web Audio API
//           No external file needed — generates a tone programmatically
const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // First beep
    const osc1  = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type      = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);           // A5
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.18);

    // Second beep (slightly higher, slightly later)
    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type      = "sine";
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.2);   // C#6
    gain2.gain.setValueAtTime(0.13, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
    osc2.start(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.38);

    // Close context after sound finishes
    setTimeout(() => ctx.close(), 500);
  } catch (err) {
    // Silently ignore if AudioContext not available
    console.warn("Could not play notification sound:", err);
  }
};

// ─────────────────────────────────────────────────────────────
const NotificationBell = () => {
  const [open, setOpen]               = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [animateBell, setAnimateBell] = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const { pathname } = useLocation();

  const userEmail = localStorage.getItem("email");
  const userRole  = pathname.startsWith("/student")
    ? "STUDENT"
    : pathname.startsWith("/trainer")
      ? "TRAINER"
      : pathname.startsWith("/admin")
        ? "ADMIN"
        : "BUSINESS";

  const notificationsPath = pathname.startsWith("/student")
    ? "/student/notifications"
    : pathname.startsWith("/trainer")
      ? "/trainer/notifications"
      : pathname.startsWith("/admin")
        ? "/admin/notifications"
        : "/business/notifications";

  // ── Load notifications + unread count ──
  useEffect(() => {
    const load = async () => {
      try {
        const [data, count] = await Promise.all([
          fetchMyNotifications(),
          fetchUnreadCount(),
        ]);
        setNotifications(data.slice(0, 8));
        setUnreadCount(count);
      } catch (err) {
        console.error("Bell load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── WebSocket — real-time push ──
  useEffect(() => {
    connectWebSocket({
      userEmail,
      userRole,
      onMessage: (newNotif) => {
        // ✅ FIX 7: Play sound when notification arrives
        playNotificationSound();

        // Ring the bell animation
        setAnimateBell(true);
        setTimeout(() => setAnimateBell(false), 1000);

        // Prepend to list
        setNotifications((prev) => [newNotif, ...prev].slice(0, 8));
        setUnreadCount((prev) => prev + 1);
      },
    });
    return () => disconnectWebSocket();
  }, [userEmail, userRole]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Mark one read ──
  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // ── Mark all read ──
  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await markAllReadAPI();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // ── View all ──
  const handleViewAll = () => {
    setOpen(false);
    navigate(notificationsPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── BELL BUTTON ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl
                   text-gray-600 dark:text-slate-300
                   hover:bg-gray-100 dark:hover:bg-slate-800
                   transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell
          className={`w-5 h-5 transition-transform duration-300
            ${animateBell ? "animate-bounce" : ""}`}
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center
                           justify-center rounded-full bg-indigo-500 text-white
                           text-[10px] font-bold shadow-lg ring-2
                           ring-white dark:ring-slate-900"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Pulse ring when new notification arrives */}
        {animateBell && (
          <span
            className="absolute inset-0 rounded-xl animate-ping
                           bg-indigo-400 opacity-30"
          />
        )}
      </button>

      {/* ── DROPDOWN PANEL ── */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border
                     border-gray-200 dark:border-slate-700
                     bg-white dark:bg-slate-900
                     shadow-2xl dark:shadow-black/40
                     z-[9999] overflow-hidden"
          style={{ maxHeight: "480px", display: "flex", flexDirection: "column" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3
                          border-b border-gray-100 dark:border-slate-800 flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full
                                 bg-indigo-100 dark:bg-indigo-900/40
                                 text-indigo-600 dark:text-indigo-400"
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs
                             text-indigo-600 dark:text-indigo-400
                             hover:bg-indigo-50 dark:hover:bg-indigo-950/30
                             transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600
                           dark:text-slate-500 dark:hover:text-slate-300
                           hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="overflow-y-auto flex-1">
            {loading && (
              <div className="py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                Loading...
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 mx-auto text-gray-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-gray-400 dark:text-slate-500">
                  No notifications yet
                </p>
              </div>
            )}

            {notifications.map((item) => {
              const { icon, color } = getMeta(item.type);
              return (
                <div
                  key={item.id}
                  onClick={(e) => !item.read && handleMarkRead(item.id, e)}
                  className={`flex items-start gap-3 px-4 py-3 border-b
                              border-gray-50 dark:border-slate-800/60
                              hover:bg-gray-50 dark:hover:bg-slate-800/50
                              transition-colors cursor-pointer group
                              ${!item.read ? "bg-indigo-50/50 dark:bg-indigo-950/10" : ""}`}
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center
                                   justify-center rounded-xl text-base
                                   bg-gradient-to-br ${color} shadow-sm`}
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
                    <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-1">
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

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-100 dark:border-slate-800">
            <button
              onClick={handleViewAll}
              className="w-full py-3 text-xs font-medium text-indigo-600
                         dark:text-indigo-400 hover:bg-indigo-50
                         dark:hover:bg-indigo-950/20 transition-colors"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;