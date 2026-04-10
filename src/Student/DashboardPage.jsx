
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   CheckCircle,
//   Clock,
//   Percent,
//   ArrowUp,
//   ArrowDown,
//   User,
//   Bell,
//   MessageCircle,
//   Calendar,
//   TrendingUp,
//   ChevronLeft,
//   ChevronRight,
//   MoreHorizontal,
//   Inbox,
//   Send,
//   GraduationCap,
//   X,
//   Circle,
//   CheckCheck,
//   Sparkles,
//   CalendarDays,
//   Zap,
//   Activity,
//   ArrowUpRight,
// } from "lucide-react";

// // ─── Services ───────────────────────────────────────────────────────────────
// import { getStudentClassroom } from "@/services/batchService";
// import {
//   getConversation,
//   sendMessage,
//   getStudentContext,
// } from "@/services/chatService";
// import {
//   fetchMyNotifications,
//   fetchUnreadCount,
//   markOneRead,
//   markAllReadAPI,
//   connectWebSocket,
//   disconnectWebSocket,
// } from "@/services/notificationService";
// import { courseService } from "@/services/courseService";
// import attendanceService from "@/services/attendanceService";
// import {
//   getStudentQuizzes,
//   getMyQuizHistory,
//   getStudentAssignments,
//   getMySubmissions,
// } from "@/services/assessmentService";

// /* ═══════════════════════════════════════════════
//    THEME TOKEN MAP (same as Admin Dashboard)
// ═══════════════════════════════════════════════ */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a",
//     cardBg: "#111111",
//     cardBgHov: "#161616",
//     heroBg: "#141414",
//     border: "rgba(255,255,255,0.06)",
//     borderHov: "rgba(255,255,255,0.14)",
//     borderHero: "rgba(255,255,255,0.07)",
//     text: "#ffffff",
//     textSub: "rgba(255,255,255,0.3)",
//     textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)",
//     pillBg: "rgba(255,255,255,0.04)",
//     pillBorder: "rgba(255,255,255,0.07)",
//     pillText: "rgba(255,255,255,0.25)",
//     iconBg: "rgba(255,255,255,0.05)",
//     iconBorder: "rgba(255,255,255,0.08)",
//     calDayText: "rgba(255,255,255,0.6)",
//     calDayHeader: "rgba(255,255,255,0.22)",
//     calFooter: "rgba(255,255,255,0.2)",
//     calFooterBdr: "rgba(255,255,255,0.05)",
//     emptyBorder: "rgba(255,255,255,0.07)",
//     emptyBg: "rgba(255,255,255,0.02)",
//     emptyIcon: "rgba(255,255,255,0.12)",
//     gridLine: "rgba(255,255,255,0.5)",
//     barBg: "rgba(255,255,255,0.05)",
//     actBar: "rgba(255,255,255,0.5)",
//     actIcon: "rgba(255,255,255,0.3)",
//     actBg: "rgba(255,255,255,0.04)",
//     actBorder: "rgba(255,255,255,0.07)",
//     navBtnBg: "rgba(255,255,255,0.04)",
//     navBtnBorder: "rgba(255,255,255,0.08)",
//     navBtnColor: "#888",
//     todayBg: "#ffffff",
//     todayText: "#000000",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)",
//     shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     liveColor: "#34d399",
//     liveText: "#34d399",
//     recentItemBg: "rgba(255,255,255,0.03)",
//     recentItemBorder: "rgba(255,255,255,0.05)",
//     recentItemBgHov: "rgba(255,255,255,0.06)",
//     overdueBg: "rgba(239,68,68,0.12)",
//     overdueText: "#f87171",
//     overdueBorder: "rgba(239,68,68,0.2)",
//     newBadgeBg: "rgba(245,158,11,0.12)",
//     newBadgeText: "#fbbf24",
//     newBadgeBorder: "rgba(245,158,11,0.2)",
//   },
//   light: {
//     pageBg: "#f1f5f9",
//     cardBg: "#ffffff",
//     cardBgHov: "#f8fafc",
//     heroBg: "#ffffff",
//     border: "#e2e8f0",
//     borderHov: "#cbd5e1",
//     borderHero: "#e2e8f0",
//     text: "#0f172a",
//     textSub: "#64748b",
//     textMuted: "#94a3b8",
//     textLabel: "#94a3b8",
//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#94a3b8",
//     iconBg: "#f8fafc",
//     iconBorder: "#e2e8f0",
//     calDayText: "#374151",
//     calDayHeader: "#9ca3af",
//     calFooter: "#9ca3af",
//     calFooterBdr: "#e5e7eb",
//     emptyBorder: "#e2e8f0",
//     emptyBg: "#f8fafc",
//     emptyIcon: "#cbd5e1",
//     gridLine: "rgba(0,0,0,0.12)",
//     barBg: "#f1f5f9",
//     actBar: "#94a3b8",
//     actIcon: "#94a3b8",
//     actBg: "#f8fafc",
//     actBorder: "#e2e8f0",
//     navBtnBg: "#f8fafc",
//     navBtnBorder: "#e2e8f0",
//     navBtnColor: "#64748b",
//     todayBg: "#0f172a",
//     todayText: "#ffffff",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)",
//     shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     liveColor: "#16a34a",
//     liveText: "#16a34a",
//     recentItemBg: "#f8fafc",
//     recentItemBorder: "#e2e8f0",
//     recentItemBgHov: "#f1f5f9",
//     overdueBg: "#fef2f2",
//     overdueText: "#ef4444",
//     overdueBorder: "#fecaca",
//     newBadgeBg: "#fffbeb",
//     newBadgeText: "#d97706",
//     newBadgeBorder: "#fde68a",
//   },
// };

// /* ═══════════════════════════════════════════════
//    COUNT-UP HOOK
// ═══════════════════════════════════════════════ */
// function useCountUp(target, duration = 1200) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     if (target === 0) { setVal(0); return; }
//     let start = null;
//     const step = (ts) => {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / duration, 1);
//       setVal(Math.floor(p * target));
//       if (p < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   }, [target, duration]);
//   return val;
// }

// /* ═══════════════════════════════════════════════
//    NOTIFICATION TYPE META
// ═══════════════════════════════════════════════ */
// const TYPE_META = {
//   NEW_VIDEO: { icon: "🎥", color: "from-blue-500 to-indigo-500" },
//   NEW_FILE: { icon: "📁", color: "from-green-500 to-teal-500" },
//   NEW_ASSESSMENT: { icon: "📝", color: "from-purple-500 to-pink-500" },
//   NEW_CONTENT: { icon: "📘", color: "from-cyan-500 to-blue-500" },
//   NEW_QUIZ: { icon: "🧠", color: "from-violet-500 to-purple-500" },
//   NEW_COURSE: { icon: "🎓", color: "from-pink-500 to-rose-500" },
//   NEW_ASSIGNMENT: { icon: "📋", color: "from-orange-500 to-amber-500" },
//   ATTENDANCE: { icon: "✅", color: "from-teal-500 to-emerald-500" },
//   BATCH_UPDATE: { icon: "🏫", color: "from-orange-500 to-red-500" },
//   CHAT_MESSAGE: { icon: "💬", color: "from-pink-500 to-rose-500" },
//   LIVE_SESSION: { icon: "📡", color: "from-violet-500 to-purple-500" },
//   SESSION_REMINDER: { icon: "⏰", color: "from-indigo-500 to-blue-500" },
//   BATCH_ASSIGNED: { icon: "🏫", color: "from-red-500 to-pink-500" },
//   DEFAULT: { icon: "🔔", color: "from-gray-400 to-gray-600" },
// };

// const getNotifMeta = (type) => {
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

// /* ═══════════════════════════════════════════════
//    MINI CALENDAR (Admin style)
// ═══════════════════════════════════════════════ */
// const MiniCalendar = ({ t }) => {
//   const today = new Date();
//   const [current, setCurrent] = useState({
//     month: today.getMonth(),
//     year: today.getFullYear(),
//   });

//   const monthNames = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ];
//   const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

//   const firstDay = new Date(current.year, current.month, 1).getDay();
//   const startOffset = firstDay === 0 ? 6 : firstDay - 1;
//   const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

//   const prevMonth = () =>
//     setCurrent((p) => ({
//       month: p.month === 0 ? 11 : p.month - 1,
//       year: p.month === 0 ? p.year - 1 : p.year,
//     }));
//   const nextMonth = () =>
//     setCurrent((p) => ({
//       month: p.month === 11 ? 0 : p.month + 1,
//       year: p.month === 11 ? p.year + 1 : p.year,
//     }));

//   const isToday = (d) =>
//     d === today.getDate() &&
//     current.month === today.getMonth() &&
//     current.year === today.getFullYear();

//   const cells = Array(startOffset).fill(null).concat(
//     Array.from({ length: daysInMonth }, (_, i) => i + 1)
//   );
//   while (cells.length % 7 !== 0) cells.push(null);

//   return (
//     <div style={{
//       background: t.cardBg,
//       border: `1px solid ${t.border}`,
//       borderRadius: 20,
//       padding: 22,
//       height: "100%",
//       boxSizing: "border-box",
//       boxShadow: t.shadow,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{
//             width: 34, height: 34, borderRadius: 10,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             background: t.iconBg, border: `1px solid ${t.iconBorder}`,
//           }}>
//             <CalendarDays size={16} color={t.text} />
//           </div>
//           <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>
//             {monthNames[current.month]} {current.year}
//           </span>
//         </div>
//         <div style={{ display: "flex", gap: 4 }}>
//           {[prevMonth, nextMonth].map((fn, i) => (
//             <button key={i} onClick={fn} style={{
//               width: 28, height: 28, borderRadius: 8,
//               border: `1px solid ${t.navBtnBorder}`, cursor: "pointer",
//               background: t.navBtnBg, color: t.navBtnColor,
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               {i === 0 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
//         {dayNames.map((d) => (
//           <div key={d} style={{
//             textAlign: "center", fontSize: 9, fontWeight: 700,
//             color: t.calDayHeader, letterSpacing: "0.06em",
//             paddingBottom: 6, fontFamily: "'Poppins',sans-serif",
//           }}>{d}</div>
//         ))}
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
//         {cells.map((d, i) => (
//           <div key={i} style={{
//             aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
//             borderRadius: 8, fontSize: 11, fontWeight: isToday(d) ? 700 : 500,
//             cursor: d ? "pointer" : "default",
//             background: isToday(d) ? t.todayBg : "transparent",
//             color: isToday(d) ? t.todayText : d ? t.calDayText : "transparent",
//             fontFamily: "'Poppins',sans-serif", transition: "background 0.15s",
//           }}>{d}</div>
//         ))}
//       </div>
//       <div style={{
//         marginTop: 16, paddingTop: 12, borderTop: `1px solid ${t.calFooterBdr}`,
//         fontSize: 10, color: t.calFooter, textAlign: "center",
//         fontFamily: "'Poppins',sans-serif", fontWeight: 500, letterSpacing: "0.05em",
//       }}>
//         NO EVENTS SCHEDULED
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    STAT CARD (Admin style with count-up)
// ═══════════════════════════════════════════════ */
// const StatCard = ({ stat, index, t, loading }) => {
//   const Icon = stat.icon;
//   const count = useCountUp(loading ? 0 : (stat.numericValue ?? 0));
//   const [hov, setHov] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         animationDelay: `${index * 80}ms`,
//         background: hov ? t.cardBgHov : t.cardBg,
//         border: `1px solid ${hov ? t.borderHov : t.border}`,
//         boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
//         borderRadius: 20, padding: "22px 22px 20px",
//         display: "flex", flexDirection: "column", gap: 14,
//         textAlign: "left", cursor: "default",
//         transition: "all 0.25s ease", position: "relative", overflow: "hidden",
//       }}
//     >
//       <div style={{
//         position: "absolute", top: -20, right: -20, width: 90, height: 90,
//         borderRadius: "50%", background: stat.color, filter: "blur(40px)",
//         opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none",
//       }} />
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div style={{
//           width: 42, height: 42, borderRadius: 12,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
//         }}>
//           <Icon size={19} color={stat.color} strokeWidth={2} />
//         </div>
//         <ArrowUpRight size={13} style={{ color: stat.color, opacity: hov ? 0.7 : 0, transition: "opacity 0.2s" }} />
//       </div>
//       <div>
//         {loading ? (
//           <div style={{ width: 48, height: 40, borderRadius: 8, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />
//         ) : (
//           <p style={{
//             fontSize: 40, fontWeight: 800, lineHeight: 1,
//             fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0,
//           }}>
//             {stat.isPercent
//               ? (stat.numericValue !== null ? `${stat.numericValue}%` : "—")
//               : String(count)}
//           </p>
//         )}
//         <p style={{
//           fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em",
//           textTransform: "uppercase", color: t.textMuted,
//           fontFamily: "'Poppins',sans-serif", margin: "6px 0 0",
//         }}>{stat.label}</p>
//       </div>
//       <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
//         <div style={{
//           height: "100%", borderRadius: 99, background: stat.color,
//           width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85,
//         }} />
//       </div>
//       <div style={{
//         position: "absolute", bottom: 0, left: 0,
//         width: hov ? "60%" : "30%", height: 1,
//         background: `linear-gradient(90deg,${stat.color},transparent)`,
//         transition: "width 0.5s ease", opacity: 0.5,
//       }} />
//       <div style={{
//         display: "flex", alignItems: "center", gap: 4,
//         fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif",
//       }}>
//         {stat.trend === "up"
//           ? <ArrowUp size={12} color={t.liveText} />
//           : <ArrowDown size={12} color="#f87171" />}
//         <span>{stat.change}</span>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    QUICK ACTION PILL
// ═══════════════════════════════════════════════ */
// const QuickAction = ({ label, color, onClick, t }) => {
//   const [hov, setHov] = useState(false);
//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex", alignItems: "center", gap: 8,
//         padding: "9px 18px", borderRadius: 10,
//         border: `1px solid ${hov ? color + "55" : t.border}`,
//         background: hov ? `${color}12` : "transparent",
//         color: hov ? color : t.textMuted,
//         fontSize: 12, fontWeight: 600, cursor: "pointer",
//         transition: "all 0.2s", fontFamily: "'Poppins',sans-serif",
//         letterSpacing: "0.03em",
//       }}
//     >
//       <span style={{
//         width: 5, height: 5, borderRadius: "50%",
//         background: hov ? color : t.textMuted,
//         transition: "background 0.2s", flexShrink: 0,
//       }} />
//       {label}
//     </button>
//   );
// };

// /* ═══════════════════════════════════════════════
//    RECENT ITEM ROW
// ═══════════════════════════════════════════════ */
// const RecentRow = ({ color, Icon: Ic, title, sub, badge, t }) => {
//   const [hov, setHov] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex", alignItems: "center", gap: 10,
//         padding: "8px 10px", borderRadius: 12,
//         background: hov ? t.recentItemBgHov : t.recentItemBg,
//         border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
//         transition: "all 0.15s", cursor: "default",
//       }}
//     >
//       <div style={{
//         width: 34, height: 34, borderRadius: 10,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0,
//       }}>
//         <Ic size={15} color={color} />
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p style={{
//           fontSize: 11, fontWeight: 600, color: t.text, margin: 0,
//           fontFamily: "'Poppins',sans-serif",
//           overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//         }}>{title}</p>
//         <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{sub}</p>
//       </div>
//       {badge && (
//         <span style={{
//           fontSize: 9, fontWeight: 700, color: t.overdueText,
//           background: t.overdueBg, border: `1px solid ${t.overdueBorder}`,
//           padding: "2px 7px", borderRadius: 999, flexShrink: 0,
//           fontFamily: "'Poppins',sans-serif",
//         }}>Pending</span>
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    RECENT PANEL
// ═══════════════════════════════════════════════ */
// const RecentPanel = ({ title, color, items, loading, emptyIcon: EmptyIcon, emptyText, viewLabel, onView, renderItem, t }) => {
//   return (
//     <div style={{
//       background: t.cardBg, border: `1px solid ${t.border}`,
//       borderRadius: 20, padding: 22, boxShadow: t.shadow,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{
//             width: 34, height: 34, borderRadius: 10,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             background: `${color}18`, border: `1px solid ${color}30`,
//           }}>
//             <EmptyIcon size={15} color={color} />
//           </div>
//           <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{title}</span>
//         </div>
//         <button onClick={onView} style={{
//           fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
//           color: t.textMuted, background: t.pillBg, border: `1px solid ${t.pillBorder}`,
//           borderRadius: 999, padding: "4px 12px", cursor: "pointer",
//           fontFamily: "'Poppins',sans-serif",
//         }}>{viewLabel || "View all"}</button>
//       </div>
//       {loading ? (
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {[1, 2, 3].map((i) => (
//             <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
//               <div style={{ width: 36, height: 36, borderRadius: 10, background: t.barBg, flexShrink: 0 }} />
//               <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
//                 <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "70%" }} />
//                 <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "45%" }} />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : items.length === 0 ? (
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 10 }}>
//           <div style={{
//             width: 48, height: 48, borderRadius: 14,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
//           }}>
//             <EmptyIcon size={20} color={t.emptyIcon} />
//           </div>
//           <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{emptyText}</p>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//           {items.map((item, i) => renderItem(item, i))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    NOTIFICATION BELL DROPDOWN
// ═══════════════════════════════════════════════ */
// const NotificationBell = ({ t }) => {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [animateBell, setAnimateBell] = useState(false);
//   const dropdownRef = useRef(null);

//   const userEmail =
//     JSON.parse(localStorage.getItem("lms_user") || "{}")?.email ||
//     localStorage.getItem("email");

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [data, count] = await Promise.all([
//           fetchMyNotifications(),
//           fetchUnreadCount(),
//         ]);
//         setNotifications(Array.isArray(data) ? data.slice(0, 8) : []);
//         setUnreadCount(count || 0);
//       } catch (err) {
//         console.error("Bell load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     connectWebSocket({
//       userEmail,
//       userRole: "STUDENT",
//       onMessage: (newNotif) => {
//         setAnimateBell(true);
//         setTimeout(() => setAnimateBell(false), 1000);
//         setNotifications((prev) => [newNotif, ...prev].slice(0, 8));
//         setUnreadCount((prev) => prev + 1);
//       },
//     });
//     return () => disconnectWebSocket();
//   }, [userEmail]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
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

//   return (
//     <div style={{ position: "relative" }} ref={dropdownRef}>
//       <button
//         onClick={() => setOpen((p) => !p)}
//         style={{
//           position: "relative", display: "flex", alignItems: "center",
//           justifyContent: "center", width: 40, height: 40, borderRadius: 10,
//           background: t.actBg, border: `1px solid ${t.actBorder}`,
//           color: t.text, cursor: "pointer", transition: "all 0.2s",
//         }}
//       >
//         <Bell size={18} style={{ transition: "transform 0.3s", transform: animateBell ? "rotate(15deg)" : "none" }} />
//         {unreadCount > 0 && (
//           <span style={{
//             position: "absolute", top: -2, right: -2,
//             minWidth: 18, height: 18, borderRadius: 999,
//             background: "#7c3aed", color: "#fff",
//             fontSize: 9, fontWeight: 700,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             padding: "0 4px", fontFamily: "'Poppins',sans-serif",
//           }}>
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div style={{
//           position: "absolute", right: 0, top: "calc(100% + 8px)",
//           width: 340, borderRadius: 16,
//           border: `1px solid ${t.border}`,
//           background: t.cardBg,
//           boxShadow: t.shadowHov,
//           zIndex: 9999, overflow: "hidden",
//           display: "flex", flexDirection: "column", maxHeight: 480,
//         }}>
//           <div style={{
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//             padding: "12px 16px",
//             borderBottom: `1px solid ${t.border}`,
//             flexShrink: 0,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Bell size={14} color="#7c3aed" />
//               <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
//                 Notifications
//               </span>
//               {unreadCount > 0 && (
//                 <span style={{
//                   padding: "2px 8px", fontSize: 10, fontWeight: 700, borderRadius: 999,
//                   background: "rgba(124,58,237,0.12)", color: "#7c3aed",
//                   fontFamily: "'Poppins',sans-serif",
//                 }}>{unreadCount} new</span>
//               )}
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               {unreadCount > 0 && (
//                 <button onClick={handleMarkAllRead} style={{
//                   display: "flex", alignItems: "center", gap: 4,
//                   padding: "4px 8px", borderRadius: 8,
//                   fontSize: 11, color: "#7c3aed", cursor: "pointer",
//                   background: "transparent", border: "none",
//                   fontFamily: "'Poppins',sans-serif", fontWeight: 600,
//                 }}>
//                   <CheckCheck size={12} /> All read
//                 </button>
//               )}
//               <button onClick={() => setOpen(false)} style={{
//                 padding: 4, borderRadius: 8, background: "transparent",
//                 border: "none", cursor: "pointer", color: t.textMuted,
//               }}>
//                 <X size={14} />
//               </button>
//             </div>
//           </div>

//           <div style={{ overflowY: "auto", flex: 1 }}>
//             {loading && (
//               <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
//                 Loading...
//               </div>
//             )}
//             {!loading && notifications.length === 0 && (
//               <div style={{ padding: "32px 16px", textAlign: "center" }}>
//                 <Bell size={28} color={t.emptyIcon} style={{ display: "block", margin: "0 auto 8px" }} />
//                 <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>No notifications yet</p>
//               </div>
//             )}
//             {notifications.map((item) => {
//               const { icon } = getNotifMeta(item.type);
//               return (
//                 <div
//                   key={item.id}
//                   onClick={(e) => !item.read && handleMarkRead(item.id, e)}
//                   style={{
//                     display: "flex", alignItems: "flex-start", gap: 10,
//                     padding: "10px 16px",
//                     borderBottom: `1px solid ${t.border}`,
//                     background: !item.read ? "rgba(124,58,237,0.04)" : "transparent",
//                     cursor: "pointer", transition: "background 0.15s",
//                   }}
//                 >
//                   <div style={{
//                     width: 36, height: 36, borderRadius: 10, flexShrink: 0,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
//                     fontSize: 14,
//                   }}>{icon}</div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                       {item.title}
//                     </p>
//                     <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
//                       {item.message}
//                     </p>
//                     <p style={{ fontSize: 9, color: t.textLabel, marginTop: 3, fontFamily: "'Poppins',sans-serif" }}>
//                       {formatTime(item.createdAt)}
//                     </p>
//                   </div>
//                   {!item.read && (
//                     <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: 4 }} />
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <div style={{ flexShrink: 0, borderTop: `1px solid ${t.border}` }}>
//             <button style={{
//               width: "100%", padding: "10px", fontSize: 11, fontWeight: 600,
//               color: "#7c3aed", background: "transparent", border: "none", cursor: "pointer",
//               fontFamily: "'Poppins',sans-serif",
//             }}>
//               View all notifications →
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    LIVE CHAT PANEL (Admin card style)
// ═══════════════════════════════════════════════ */
// const LatestMessagePanel = ({ t }) => {
//   const [chat, setChat] = useState([]);
//   const [message, setMessage] = useState("");
//   const [batchId, setBatchId] = useState(null);
//   const [trainerEmail, setTrainerEmail] = useState(null);
//   const [expanded, setExpanded] = useState(false);
//   const [sending, setSending] = useState(false);
//   const chatEndRef = useRef(null);

//   const studentEmail = JSON.parse(
//     localStorage.getItem("lms_user") || "{}"
//   )?.email;

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const ctx = await getStudentContext();
//         setBatchId(ctx.data.batchId);
//         setTrainerEmail(ctx.data.trainerEmail);
//       } catch (e) {
//         console.log("No classroom assigned");
//       }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     if (!batchId || !trainerEmail) return;
//     getConversation(batchId, trainerEmail).then((res) => {
//       setChat(
//         res.data.map((m) => ({
//           sender: m.senderEmail === studentEmail ? "student" : "teacher",
//           text: m.message,
//           time: new Date(m.sentAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         }))
//       );
//     });
//   }, [batchId, trainerEmail]);

//   useEffect(() => {
//     if (expanded) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, expanded]);

//   const handleSend = async () => {
//     if (!message.trim() || !batchId || !trainerEmail) return;
//     setSending(true);
//     try {
//       await sendMessage({ batchId, receiverEmail: trainerEmail, message });
//       setMessage("");
//       const res = await getConversation(batchId, trainerEmail);
//       setChat(
//         res.data.map((m) => ({
//           sender: m.senderEmail === studentEmail ? "student" : "teacher",
//           text: m.message,
//           time: new Date(m.sentAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         }))
//       );
//     } finally {
//       setSending(false);
//     }
//   };

//   const cardStyle = {
//     background: t.cardBg,
//     border: `1px solid ${t.border}`,
//     borderRadius: 20,
//     boxShadow: t.shadow,
//   };

//   if (!expanded) {
//     return (
//       <div style={{ ...cardStyle, padding: 22, display: "flex", flexDirection: "column" }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{
//               width: 34, height: 34, borderRadius: 10,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
//             }}>
//               <MessageCircle size={15} color="#7c3aed" />
//             </div>
//             <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Latest Message</span>
//           </div>
//           <button onClick={() => setExpanded(true)} style={{
//             fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
//             color: t.textMuted, background: t.pillBg, border: `1px solid ${t.pillBorder}`,
//             borderRadius: 999, padding: "4px 12px", cursor: "pointer",
//             fontFamily: "'Poppins',sans-serif",
//           }}>Expand</button>
//         </div>

//         {chat.length === 0 ? (
//           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 10 }}>
//             <div style={{
//               width: 48, height: 48, borderRadius: 14,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
//             }}>
//               <MessageCircle size={20} color={t.emptyIcon} />
//             </div>
//             <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No messages yet</p>
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12, maxHeight: 140, overflowY: "auto" }}>
//             {chat.slice(-3).map((msg, idx) => (
//               <div key={idx} style={{ display: "flex", justifyContent: msg.sender === "student" ? "flex-end" : "flex-start" }}>
//                 <div style={{
//                   maxWidth: "80%", padding: "8px 12px", borderRadius: 12, fontSize: 11,
//                   background: msg.sender === "student"
//                     ? "linear-gradient(135deg,#7c3aed,#a855f7)"
//                     : t.recentItemBg,
//                   color: msg.sender === "student" ? "#fff" : t.text,
//                   fontFamily: "'Poppins',sans-serif",
//                 }}>
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {batchId && trainerEmail && (
//           <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
//             <input
//               type="text"
//               placeholder="Quick message to trainer..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               style={{
//                 flex: 1, fontSize: 11, padding: "8px 12px", borderRadius: 10,
//                 background: t.actBg, border: `1px solid ${t.actBorder}`,
//                 color: t.text, outline: "none", fontFamily: "'Poppins',sans-serif",
//               }}
//             />
//             <button
//               onClick={handleSend}
//               disabled={!message.trim() || sending}
//               style={{
//                 width: 34, height: 34, borderRadius: 10,
//                 background: "linear-gradient(135deg,#7c3aed,#a855f7)",
//                 border: "none", cursor: "pointer", color: "#fff",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 opacity: (!message.trim() || sending) ? 0.4 : 1,
//               }}
//             >
//               <Send size={13} />
//             </button>
//           </div>
//         )}

//         <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
//           <button
//             onClick={() => setExpanded(true)}
//             style={{
//               width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
//               gap: 8, padding: "9px", borderRadius: 10,
//               border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.06)",
//               color: "#7c3aed", fontSize: 11, fontWeight: 600, cursor: "pointer",
//               fontFamily: "'Poppins',sans-serif",
//             }}
//           >
//             <Inbox size={13} /> Go to Inbox
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ ...cardStyle, display: "flex", flexDirection: "column", height: 380 }}>
//       <div style={{
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         padding: "12px 16px", borderBottom: `1px solid ${t.border}`,
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <div style={{
//             width: 28, height: 28, borderRadius: 999,
//             background: "rgba(124,58,237,0.1)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <GraduationCap size={13} color="#7c3aed" />
//           </div>
//           <div>
//             <p style={{ fontSize: 11, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//               {trainerEmail?.split("@")[0] || "Trainer"}
//             </p>
//             <p style={{ fontSize: 9, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//               {trainerEmail || "Not assigned"}
//             </p>
//           </div>
//         </div>
//         <button onClick={() => setExpanded(false)} style={{
//           padding: 4, borderRadius: 8, background: "transparent",
//           border: "none", cursor: "pointer", color: t.textMuted,
//         }}>
//           <X size={14} />
//         </button>
//       </div>

//       <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
//         {chat.length === 0 ? (
//           <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>No messages yet. Say hello!</p>
//           </div>
//         ) : (
//           chat.map((msg, idx) => (
//             <div key={idx} style={{ display: "flex", justifyContent: msg.sender === "student" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6 }}>
//               {msg.sender === "teacher" && (
//                 <div style={{
//                   width: 24, height: 24, borderRadius: 999, flexShrink: 0,
//                   background: "rgba(124,58,237,0.1)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <GraduationCap size={11} color="#7c3aed" />
//                 </div>
//               )}
//               <div style={{
//                 maxWidth: "75%", padding: "8px 12px", borderRadius: 12, fontSize: 11,
//                 background: msg.sender === "student"
//                   ? "linear-gradient(135deg,#7c3aed,#a855f7)"
//                   : t.recentItemBg,
//                 color: msg.sender === "student" ? "#fff" : t.text,
//                 fontFamily: "'Poppins',sans-serif",
//               }}>
//                 <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
//                 <p style={{ fontSize: 9, margin: "3px 0 0", opacity: 0.6, textAlign: "right" }}>{msg.time}</p>
//               </div>
//             </div>
//           ))
//         )}
//         <div ref={chatEndRef} />
//       </div>

//       <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderTop: `1px solid ${t.border}` }}>
//         <input
//           type="text"
//           placeholder={batchId ? "Type a message..." : "No classroom assigned"}
//           disabled={!batchId}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
//           style={{
//             flex: 1, fontSize: 11, padding: "8px 12px", borderRadius: 10,
//             background: t.actBg, border: `1px solid ${t.actBorder}`,
//             color: t.text, outline: "none", fontFamily: "'Poppins',sans-serif",
//             opacity: !batchId ? 0.5 : 1,
//           }}
//         />
//         <button
//           onClick={handleSend}
//           disabled={!message.trim() || sending || !batchId}
//           style={{
//             width: 34, height: 34, borderRadius: 10,
//             background: "linear-gradient(135deg,#7c3aed,#a855f7)",
//             border: "none", cursor: "pointer", color: "#fff",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             opacity: (!message.trim() || sending || !batchId) ? 0.4 : 1,
//             transition: "transform 0.1s",
//           }}
//         >
//           <Send size={13} />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    HELPER — calculate attendance %
// ═══════════════════════════════════════════════ */
// const calcAttendancePercent = (data) => {
//   if (!data) return null;
//   if (typeof data.presentDays === "number" && typeof data.totalDays === "number") {
//     if (data.totalDays === 0) return 0;
//     return Math.round((data.presentDays / data.totalDays) * 100);
//   }
//   if (Array.isArray(data)) {
//     const total = data.length;
//     const present = data.filter((r) => r.status === "PRESENT").length;
//     if (total === 0) return 0;
//     return Math.round((present / total) * 100);
//   }
//   return null;
// };

// /* ═══════════════════════════════════════════════
//    MAIN DASHBOARD PAGE
// ═══════════════════════════════════════════════ */
// const DashboardPage = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [classroom, setClassroom] = useState(null);
//   const [classLoading, setClassLoading] = useState(true);

//   const [statsLoading, setStatsLoading] = useState(true);
//   const [activeCourses, setActiveCourses] = useState(0);
//   const [completedCourses, setCompletedCourses] = useState(0);
//   const [pendingAssessments, setPendingAssessments] = useState(0);
//   const [overdueAssessments, setOverdueAssessments] = useState(0);
//   const [attendancePercent, setAttendancePercent] = useState(null);

//   const [isDark, setIsDark] = useState(
//     () =>
//       typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark")
//   );

//   useEffect(() => {
//     const obs = new MutationObserver(() => {
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//           document.documentElement.getAttribute("data-theme") === "dark"
//       );
//     });
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);

//   const t = isDark ? T.dark : T.light;

//   useEffect(() => {
//     getStudentClassroom()
//       .then((res) => setClassroom(res.data))
//       .catch(() => setClassroom(null))
//       .finally(() => setClassLoading(false));
//   }, []);

//   useEffect(() => {
//     const loadStats = async () => {
//       setStatsLoading(true);
//       try {
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = now.getMonth() + 1;

//         const [
//           coursesRes,
//           attendanceRes,
//           quizzesRes,
//           quizHistoryRes,
//           assignmentsRes,
//           submissionsRes,
//         ] = await Promise.allSettled([
//           courseService.getStudentCourses(),
//           attendanceService.getMonthlyAttendance(year, month),
//           getStudentQuizzes(),
//           getMyQuizHistory(),
//           getStudentAssignments(),
//           getMySubmissions(),
//         ]);

//         if (coursesRes.status === "fulfilled") {
//           const courses = coursesRes.value?.data ?? [];
//           setActiveCourses(courses.filter((c) => c.status === "ACTIVE" || !c.completed).length);
//           setCompletedCourses(courses.filter((c) => c.status === "COMPLETED" || c.completed).length);
//         }

//         if (attendanceRes.status === "fulfilled") {
//           setAttendancePercent(calcAttendancePercent(attendanceRes.value?.data));
//         }

//         let pendingQuizCount = 0, overdueQuizCount = 0;
//         if (quizzesRes.status === "fulfilled" && quizHistoryRes.status === "fulfilled") {
//           const allQuizzes = quizzesRes.value?.data ?? [];
//           const attemptedIds = new Set(
//             (quizHistoryRes.value?.data ?? []).map((a) => a.quizId ?? a.quiz?.id)
//           );
//           const notAttempted = allQuizzes.filter((q) => !attemptedIds.has(q.id));
//           pendingQuizCount = notAttempted.length;
//           overdueQuizCount = notAttempted.filter((q) => q.dueDate && new Date(q.dueDate) < now).length;
//         }

//         let pendingAssignmentCount = 0, overdueAssignmentCount = 0;
//         if (assignmentsRes.status === "fulfilled" && submissionsRes.status === "fulfilled") {
//           const allAssignments = assignmentsRes.value?.data ?? [];
//           const submittedIds = new Set(
//             (submissionsRes.value?.data ?? []).map((s) => s.assignmentId ?? s.assignment?.id)
//           );
//           const notSubmitted = allAssignments.filter((a) => !submittedIds.has(a.id));
//           pendingAssignmentCount = notSubmitted.length;
//           overdueAssignmentCount = notSubmitted.filter((a) => a.dueDate && new Date(a.dueDate) < now).length;
//         }

//         setPendingAssessments(pendingQuizCount + pendingAssignmentCount);
//         setOverdueAssessments(overdueQuizCount + overdueAssignmentCount);
//       } catch (err) {
//         console.error("Stats load error:", err);
//       } finally {
//         setStatsLoading(false);
//       }
//     };
//     loadStats();
//   }, []);

//   const stats = [
//     {
//       label: "Active Courses",
//       numericValue: activeCourses,
//       change: `${activeCourses} enrolled`,
//       trend: "up",
//       icon: BookOpen,
//       color: "#22d3ee",
//     },
//     {
//       label: "Completed Courses",
//       numericValue: completedCourses,
//       change: `${completedCourses} finished`,
//       trend: "up",
//       icon: CheckCircle,
//       color: "#34d399",
//     },
//     {
//       label: "Pending Assessments",
//       numericValue: pendingAssessments,
//       change: overdueAssessments > 0 ? `${overdueAssessments} overdue` : "None overdue",
//       trend: overdueAssessments > 0 ? "down" : "up",
//       icon: Clock,
//       color: "#fb923c",
//     },
//     {
//       label: "Attendance",
//       numericValue: attendancePercent ?? 0,
//       isPercent: true,
//       change:
//         attendancePercent !== null
//           ? attendancePercent >= 75
//             ? "Good standing"
//             : "Below 75% ⚠️"
//           : "No data",
//       trend: attendancePercent !== null && attendancePercent >= 75 ? "up" : "down",
//       icon: Percent,
//       color: "#a78bfa",
//     },
//   ];

//   const quickActions = [
//     { label: "My Courses", color: "#22d3ee", tab: "courses" },
//     { label: "Assessments", color: "#fb923c", tab: "overview" },
//     { label: "Attendance", color: "#34d399", tab: "overview" },
//     { label: "Progress", color: "#a78bfa", tab: "progress" },
//     { label: "Messages", color: "#f43f5e", tab: "overview" },
//     { label: "Schedule", color: "#f59e0b", tab: "overview" },
//   ];

//   const card = {
//     background: t.cardBg,
//     border: `1px solid ${t.border}`,
//     borderRadius: 20,
//     padding: 24,
//     boxShadow: t.shadow,
//   };

//   const pill = {
//     fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
//     padding: "4px 10px", borderRadius: 999, background: t.pillBg,
//     border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif",
//   };

//   const OverviewPage = () => (
//     <div>
//       {/* Stat Cards */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))",
//         gap: 14, marginBottom: 20,
//       }}>
//         {stats.map((s, i) => (
//           <StatCard key={i} stat={s} index={i} t={t} loading={statsLoading} />
//         ))}
//       </div>

//       {/* Recent Panels Row */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
//         gap: 14, marginBottom: 14,
//       }}>
//         <RecentPanel
//           title="My Courses"
//           color="#22d3ee"
//           items={[]}
//           loading={statsLoading}
//           emptyIcon={BookOpen}
//           emptyText="No active courses"
//           viewLabel="View all"
//           onView={() => setActiveTab("courses")}
//           t={t}
//           renderItem={(c, i) => (
//             <RecentRow key={i} color="#22d3ee" Icon={BookOpen} t={t}
//               title={c.title || "Untitled Course"}
//               sub={c.status || "Active"}
//             />
//           )}
//         />
//         <RecentPanel
//           title="Pending Assessments"
//           color="#fb923c"
//           items={[]}
//           loading={statsLoading}
//           emptyIcon={Clock}
//           emptyText="No pending assessments"
//           viewLabel="View all"
//           onView={() => {}}
//           t={t}
//           renderItem={(a, i) => (
//             <RecentRow key={i} color="#fb923c" Icon={Clock} t={t}
//               title={a.title || "Assessment"}
//               sub={a.dueDate || "No due date"}
//               badge={true}
//             />
//           )}
//         />
//         <RecentPanel
//           title="Notifications & Updates"
//           color="#a78bfa"
//           items={[]}
//           loading={statsLoading}
//           emptyIcon={Bell}
//           emptyText="No notifications yet"
//           viewLabel="View all"
//           onView={() => {}}
//           t={t}
//           renderItem={(n, i) => (
//             <RecentRow key={i} color="#a78bfa" Icon={Bell} t={t}
//               title={n.title || "Notification"}
//               sub={formatTime(n.createdAt)}
//             />
//           )}
//         />
//       </div>

//       {/* Bottom Row */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "1fr 1fr 290px",
//         gap: 14, marginBottom: 14,
//       }}>
//         {/* Classroom Info */}
//         <div style={card} className="dfade">
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{
//                 width: 34, height: 34, borderRadius: 10,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
//               }}>
//                 <User size={15} color="#22d3ee" />
//               </div>
//               <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>My Classroom</span>
//             </div>
//             <span style={pill}>Overview</span>
//           </div>
//           {classLoading ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {[1, 2].map((i) => (
//                 <div key={i} style={{ display: "flex", gap: 10 }}>
//                   <div style={{ width: 36, height: 36, borderRadius: 10, background: t.barBg, flexShrink: 0 }} />
//                   <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
//                     <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "70%" }} />
//                     <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "45%" }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : classroom ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {[
//                 { label: "Batch Name", value: classroom.batchName, color: "#22d3ee", Icon: GraduationCap },
//                 { label: "Trainer", value: classroom.trainerName, color: "#34d399", Icon: User },
//                 { label: "Trainer Email", value: classroom.trainerEmail, color: "#a78bfa", Icon: MessageCircle },
//               ].map((row) => (
//                 <div key={row.label} style={{
//                   display: "flex", alignItems: "center", gap: 10,
//                   padding: "10px", borderRadius: 12,
//                   background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
//                 }}>
//                   <div style={{
//                     width: 32, height: 32, borderRadius: 9,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: `${row.color}18`, border: `1px solid ${row.color}30`, flexShrink: 0,
//                   }}>
//                     <row.Icon size={14} color={row.color} />
//                   </div>
//                   <div>
//                     <p style={{ fontSize: 10, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{row.label}</p>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{row.value || "—"}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 10 }}>
//               <div style={{
//                 width: 52, height: 52, borderRadius: 14,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
//               }}>
//                 <User size={20} color={t.emptyIcon} />
//               </div>
//               <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
//                 No Classroom Assigned
//               </p>
//               <p style={{ fontSize: 10, color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
//                 Waiting for admin to assign trainer
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Learning Progress */}
//         <div style={card} className="dfade">
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{
//                 width: 34, height: 34, borderRadius: 10,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
//               }}>
//                 <TrendingUp size={15} color="#a78bfa" />
//               </div>
//               <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Learning Progress</span>
//             </div>
//             <span style={pill}>This Month</span>
//           </div>
//           <div style={{
//             display: "flex", flexDirection: "column",
//             alignItems: "center", justifyContent: "center",
//             padding: "28px 0", gap: 12,
//           }}>
//             <div style={{
//               width: 52, height: 52, borderRadius: 14,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
//             }}>
//               <TrendingUp size={20} color={t.emptyIcon} />
//             </div>
//             <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
//               No progress data yet
//             </p>
//             <button onClick={() => setActiveTab("progress")} style={{
//               padding: "6px 18px", borderRadius: 8,
//               border: "1px solid rgba(167,139,250,0.25)",
//               background: "rgba(167,139,250,0.08)", color: "#7c3aed",
//               fontSize: 11, fontWeight: 600, cursor: "pointer",
//               fontFamily: "'Poppins',sans-serif",
//             }}>View Progress →</button>
//           </div>
//         </div>

//         {/* Calendar */}
//         <MiniCalendar t={t} />
//       </div>

//       {/* Chat Panel */}
//       <div style={{ marginBottom: 14 }}>
//         <LatestMessagePanel t={t} />
//       </div>

//       {/* Quick Actions */}
//       <div style={{ ...card, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }} className="dfade">
//         <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 10 }}>
//           <Zap size={14} color={t.textLabel} />
//           <span style={{
//             fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
//             textTransform: "uppercase", color: t.textLabel,
//             fontFamily: "'Poppins',sans-serif",
//           }}>Quick Actions</span>
//         </div>
//         {quickActions.map((a, i) => (
//           <QuickAction key={i} label={a.label} color={a.color} t={t} onClick={() => setActiveTab(a.tab)} />
//         ))}
//       </div>
//     </div>
//   );

//   const CoursesPage = () => (
//     <div style={card}>
//       <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
//         My Courses
//       </h2>
//       <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
//         Courses will appear here
//       </p>
//     </div>
//   );

//   const ProgressPage = () => (
//     <div style={card}>
//       <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
//         Learning Progress
//       </h2>
//       <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
//         Progress will appear here
//       </p>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         .dfade{animation:fadeUp 0.45s ease both}
//         @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
//         .d1{animation:blink 1.6s ease infinite}
//         .d2{animation:blink 1.6s 0.3s ease infinite}
//         .d3{animation:blink 1.6s 0.6s ease infinite}
//         @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)}70%{box-shadow:0 0 0 8px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}
//         .livebadge{animation:pulse-ring 2.2s ease-out infinite}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
//       `}</style>

//       <div style={{
//         minHeight: "100vh", background: t.pageBg, color: t.text,
//         fontFamily: "'Poppins',sans-serif", position: "relative",
//         transition: "background 0.3s,color 0.3s",
//       }}>
//         <div style={{
//           position: "relative", zIndex: 1, padding: 24,
//           maxWidth: 1300, margin: "0 auto", paddingBottom: 52,
//         }}>

//           {/* ═══ HERO (same as Admin) ═══ */}
//           <div className="dfade" style={{
//             borderRadius: 24, padding: "30px 36px",
//             background: t.heroBg, border: `1px solid ${t.borderHero}`,
//             position: "relative", overflow: "hidden",
//             marginBottom: 20, boxShadow: t.shadow,
//           }}>
//             <div style={{
//               position: "absolute", inset: 0, pointerEvents: "none",
//               opacity: isDark ? 0.04 : 0.025,
//               backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
//               backgroundSize: "40px 40px",
//             }} />
//             <div style={{
//               position: "absolute", top: "-30%", left: "40%",
//               width: 300, height: 200,
//               background: "radial-gradient(ellipse,rgba(124,58,237,0.06),transparent 70%)",
//               pointerEvents: "none",
//             }} />
//             <div style={{
//               position: "absolute", bottom: "-40%", right: "10%",
//               width: 250, height: 200,
//               background: "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)",
//               pointerEvents: "none",
//             }} />

//             <div style={{
//               position: "relative", display: "flex", alignItems: "center",
//               justifyContent: "space-between", flexWrap: "wrap", gap: 16,
//             }}>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
//                   <Sparkles size={11} color={t.textSub} />
//                   <span style={{
//                     fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
//                     textTransform: "uppercase", color: t.textSub,
//                     fontFamily: "'Poppins',sans-serif",
//                   }}>Student Portal</span>
//                 </div>
//                 <h1 style={{
//                   fontFamily: "'Poppins',sans-serif", fontWeight: 900,
//                   fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text,
//                   margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
//                 }}>Student Dashboard</h1>
//                 <p style={{
//                   fontSize: 12, color: t.textSub, marginTop: 7,
//                   fontWeight: 500, fontFamily: "'Poppins',sans-serif",
//                 }}>Your classroom &amp; learning overview</p>

//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
//                   {["overview", "courses", "progress"].map((tab) => (
//                     <button key={tab} onClick={() => setActiveTab(tab)} style={{
//                       padding: "7px 16px", borderRadius: 10,
//                       border: `1px solid ${activeTab === tab ? "rgba(124,58,237,0.5)" : t.borderHov}`,
//                       background: activeTab === tab ? "rgba(124,58,237,0.1)" : t.actBg,
//                       color: activeTab === tab ? "#7c3aed" : t.textSub,
//                       fontSize: 11, fontWeight: 600, cursor: "pointer",
//                       fontFamily: "'Poppins',sans-serif",
//                       textTransform: "capitalize",
//                       transition: "all 0.2s",
//                     }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
//                   ))}
//                 </div>
//               </div>

//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 {!statsLoading && (
//                   <div style={{
//                     display: "flex", alignItems: "center", gap: 12,
//                     background: t.actBg, border: `1px solid ${t.actBorder}`,
//                     borderRadius: 12, padding: "8px 16px",
//                     fontSize: 11, fontWeight: 600,
//                     fontFamily: "'Poppins',sans-serif", color: t.textSub,
//                   }}>
//                     <span>{activeCourses} courses</span>
//                     <span style={{ width: 1, height: 14, background: t.actBorder }} />
//                     <span>{completedCourses} completed</span>
//                     <span style={{ width: 1, height: 14, background: t.actBorder }} />
//                     {pendingAssessments > 0 ? (
//                       <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#fb923c", fontWeight: 700 }}>
//                         <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block" }} />
//                         {pendingAssessments} pending
//                       </span>
//                     ) : (
//                       <span style={{ color: t.liveText }}>All clear ✓</span>
//                     )}
//                   </div>
//                 )}
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 8,
//                   background: t.actBg, border: `1px solid ${t.actBorder}`,
//                   borderRadius: 10, padding: "8px 14px",
//                 }}>
//                   <Activity size={12} color={t.actIcon} />
//                   <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
//                     <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
//                     <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
//                     <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
//                   </div>
//                 </div>
//                 <NotificationBell t={t} />
//                 <div className="livebadge" style={{
//                   display: "flex", alignItems: "center", gap: 7,
//                   background: isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.08)",
//                   border: isDark ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(124,58,237,0.3)",
//                   borderRadius: 999, padding: "8px 18px",
//                   color: "#7c3aed", fontSize: 11, fontWeight: 700,
//                   letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif",
//                 }}>
//                   <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
//                   LIVE
//                 </div>
//               </div>
//             </div>
//           </div>

//           {activeTab === "overview" && <OverviewPage />}
//           {activeTab === "courses" && <CoursesPage />}
//           {activeTab === "progress" && <ProgressPage />}
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardPage;  updated ui no progrees service add 























import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Sparkles,
  CalendarDays,
  Zap,
  Activity,
  ArrowUpRight,
  Film,
  FolderOpen,
  ClipboardList,
  Brain,
  Trophy,
  BarChart2,
  PlayCircle,
} from "lucide-react";

import { getStudentClassroom } from "@/services/batchService";
import { getConversation, sendMessage, getStudentContext } from "@/services/chatService";
import {
  fetchMyNotifications, fetchUnreadCount, markOneRead,
  markAllReadAPI, connectWebSocket, disconnectWebSocket,
} from "@/services/notificationService";
import { courseService } from "@/services/courseService";
import attendanceService from "@/services/attendanceService";
import {
  getStudentQuizzes, getMyQuizHistory,
  getStudentAssignments, getMySubmissions,
} from "@/services/assessmentService";
import { progressService } from "@/services/progressService";
import videoService from "@/services/videoService";
import fileService from "@/services/fileService";

/* ─── JWT helper ─── */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch { return null; }
};

/* ═══════════════════════════════════════════════
   THEME TOKEN MAP
═══════════════════════════════════════════════ */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)", pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)", iconBorder: "rgba(255,255,255,0.08)",
    calDayText: "rgba(255,255,255,0.6)", calDayHeader: "rgba(255,255,255,0.22)",
    calFooter: "rgba(255,255,255,0.2)", calFooterBdr: "rgba(255,255,255,0.05)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    gridLine: "rgba(255,255,255,0.5)", barBg: "rgba(255,255,255,0.05)",
    actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
    actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
    navBtnBg: "rgba(255,255,255,0.04)", navBtnBorder: "rgba(255,255,255,0.08)", navBtnColor: "#888",
    todayBg: "#ffffff", todayText: "#000000",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    liveColor: "#34d399", liveText: "#34d399",
    recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)", recentItemBgHov: "rgba(255,255,255,0.06)",
    overdueBg: "rgba(239,68,68,0.12)", overdueText: "#f87171", overdueBorder: "rgba(239,68,68,0.2)",
    newBadgeBg: "rgba(245,158,11,0.12)", newBadgeText: "#fbbf24", newBadgeBorder: "rgba(245,158,11,0.2)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc", heroBg: "#ffffff",
    border: "#e2e8f0", borderHov: "#cbd5e1", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8", textLabel: "#94a3b8",
    pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
    iconBg: "#f8fafc", iconBorder: "#e2e8f0",
    calDayText: "#374151", calDayHeader: "#9ca3af", calFooter: "#9ca3af", calFooterBdr: "#e5e7eb",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    gridLine: "rgba(0,0,0,0.12)", barBg: "#f1f5f9",
    actBar: "#94a3b8", actIcon: "#94a3b8", actBg: "#f8fafc", actBorder: "#e2e8f0",
    navBtnBg: "#f8fafc", navBtnBorder: "#e2e8f0", navBtnColor: "#64748b",
    todayBg: "#0f172a", todayText: "#ffffff",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    liveColor: "#16a34a", liveText: "#16a34a",
    recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0", recentItemBgHov: "#f1f5f9",
    overdueBg: "#fef2f2", overdueText: "#ef4444", overdueBorder: "#fecaca",
    newBadgeBg: "#fffbeb", newBadgeText: "#d97706", newBadgeBorder: "#fde68a",
  },
};

/* ─── Count-up hook ─── */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* ─── Notification meta ─── */
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

const calcAttendancePercent = (data) => {
  if (!data) return null;
  if (typeof data.presentDays === "number" && typeof data.totalDays === "number") {
    if (data.totalDays === 0) return 0;
    return Math.round((data.presentDays / data.totalDays) * 100);
  }
  if (Array.isArray(data)) {
    const total = data.length;
    const present = data.filter((r) => r.status === "PRESENT").length;
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  }
  return null;
};

const getProgressColor = (pct) => {
  if (pct >= 100) return "from-emerald-400 to-teal-500";
  if (pct >= 60) return "from-violet-500 to-purple-600";
  if (pct >= 30) return "from-amber-400 to-orange-500";
  return "from-slate-300 to-slate-400";
};

const getProgressBg = (pct) => {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 60) return "bg-violet-500";
  if (pct >= 30) return "bg-amber-500";
  return "bg-slate-300";
};

/* ═══════════════════════════════════════════════
   MINI CALENDAR
═══════════════════════════════════════════════ */
const MiniCalendar = ({ t }) => {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const cells = Array(startOffset).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) => d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  return (
    <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, height: "100%", boxSizing: "border-box", boxShadow: t.shadow }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: t.iconBg, border: `1px solid ${t.iconBorder}` }}>
            <CalendarDays size={16} color={t.text} />
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>
            {monthNames[current.month]} {current.year}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[() => setCurrent(p => ({ month: p.month === 0 ? 11 : p.month - 1, year: p.month === 0 ? p.year - 1 : p.year })),
            () => setCurrent(p => ({ month: p.month === 11 ? 0 : p.month + 1, year: p.month === 11 ? p.year + 1 : p.year }))].map((fn, i) => (
            <button key={i} onClick={fn} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t.navBtnBorder}`, cursor: "pointer", background: t.navBtnBg, color: t.navBtnColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i === 0 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {dayNames.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: t.calDayHeader, letterSpacing: "0.06em", paddingBottom: 6, fontFamily: "'Poppins',sans-serif" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => (
          <div key={i} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 11, fontWeight: isToday(d) ? 700 : 500, cursor: d ? "pointer" : "default", background: isToday(d) ? t.todayBg : "transparent", color: isToday(d) ? t.todayText : d ? t.calDayText : "transparent", fontFamily: "'Poppins',sans-serif", transition: "background 0.15s" }}>{d}</div>
        ))}
      </div>
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${t.calFooterBdr}`, fontSize: 10, color: t.calFooter, textAlign: "center", fontFamily: "'Poppins',sans-serif", fontWeight: 500, letterSpacing: "0.05em" }}>
        NO EVENTS SCHEDULED
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
const StatCard = ({ stat, index, t, loading }) => {
  const Icon = stat.icon;
  const count = useCountUp(loading ? 0 : (stat.numericValue ?? 0));
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animationDelay: `${index * 80}ms`,
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
        borderRadius: 20, padding: "22px 22px 20px",
        display: "flex", flexDirection: "column", gap: 14,
        cursor: "default", transition: "all 0.25s ease", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: stat.color, filter: "blur(40px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
          <Icon size={19} color={stat.color} strokeWidth={2} />
        </div>
        <ArrowUpRight size={13} style={{ color: stat.color, opacity: hov ? 0.7 : 0, transition: "opacity 0.2s" }} />
      </div>
      <div>
        {loading ? (
          <div style={{ width: 48, height: 40, borderRadius: 8, background: t.barBg }} />
        ) : (
          <p style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>
            {stat.isPercent ? (stat.numericValue !== null ? `${stat.numericValue}%` : "—") : String(count)}
          </p>
        )}
        <p style={{ fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0" }}>{stat.label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: stat.color, width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
        {stat.trend === "up" ? <ArrowUp size={12} color={t.liveText} /> : <ArrowDown size={12} color="#f87171" />}
        <span>{stat.change}</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MINI PROGRESS CARD (for overview + progress tab)
═══════════════════════════════════════════════ */
const MiniProgressCard = ({ icon: Icon, label, colorClass, color, done, total, pct, navigateTo, navigateLabel, t }) => {
  const navigate = useNavigate();
  return (
    <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
            <Icon size={15} color={color} />
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{label}</span>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 999, background: `${color}18`, border: `1px solid ${color}30`, color: color, fontFamily: "'Poppins',sans-serif" }}>
          {done} / {total}
        </span>
      </div>
      {total === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0", gap: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
            <Icon size={18} color={t.emptyIcon} />
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No data yet</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Completion</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{Math.round(pct)}%</span>
            </div>
            <div style={{ height: 6, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: color, width: `${pct}%`, transition: "width 0.7s ease" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "rgba(52,211,153,0.10)", color: "#34d399", fontFamily: "'Poppins',sans-serif" }}>✓ {done} done</span>
            {total - done > 0 && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "rgba(251,146,60,0.10)", color: "#fb923c", fontFamily: "'Poppins',sans-serif" }}>{total - done} left</span>
            )}
          </div>
        </>
      )}
      {navigateTo && (
        <button onClick={() => navigate(navigateTo)} style={{ marginTop: 12, width: "100%", padding: "8px", borderRadius: 10, border: `1px solid ${color}25`, background: `${color}08`, color: color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "background 0.2s" }}>
          {navigateLabel} →
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   NOTIFICATION BELL
═══════════════════════════════════════════════ */
const NotificationBell = ({ t }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animateBell, setAnimateBell] = useState(false);
  const dropdownRef = useRef(null);
  const userEmail = JSON.parse(localStorage.getItem("lms_user") || "{}")?.email || localStorage.getItem("email");

  useEffect(() => {
    const load = async () => {
      try {
        const [data, count] = await Promise.all([fetchMyNotifications(), fetchUnreadCount()]);
        setNotifications(Array.isArray(data) ? data.slice(0, 8) : []);
        setUnreadCount(count || 0);
      } catch (e) {} finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    connectWebSocket({ userEmail, userRole: "STUDENT", onMessage: (n) => { setAnimateBell(true); setTimeout(() => setAnimateBell(false), 1000); setNotifications((p) => [n, ...p].slice(0, 8)); setUnreadCount((p) => p + 1); } });
    return () => disconnectWebSocket();
  }, [userEmail]);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleMarkRead = async (id, e) => { e.stopPropagation(); await markOneRead(id); setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n))); setUnreadCount((p) => Math.max(0, p - 1)); };
  const handleMarkAllRead = async (e) => { e.stopPropagation(); await markAllReadAPI(); setNotifications((p) => p.map((n) => ({ ...n, read: true }))); setUnreadCount(0); };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button onClick={() => setOpen((p) => !p)} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.text, cursor: "pointer", transition: "all 0.2s" }}>
        <Bell size={18} style={{ transition: "transform 0.3s", transform: animateBell ? "rotate(15deg)" : "none" }} />
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 999, background: "#7c3aed", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", fontFamily: "'Poppins',sans-serif" }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 340, borderRadius: 16, border: `1px solid ${t.border}`, background: t.cardBg, boxShadow: t.shadowHov, zIndex: 9999, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: 480 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={14} color="#7c3aed" />
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>Notifications</span>
              {unreadCount > 0 && <span style={{ padding: "2px 8px", fontSize: 10, fontWeight: 700, borderRadius: 999, background: "rgba(124,58,237,0.12)", color: "#7c3aed", fontFamily: "'Poppins',sans-serif" }}>{unreadCount} new</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 8, fontSize: 11, color: "#7c3aed", cursor: "pointer", background: "transparent", border: "none", fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                  <CheckCheck size={12} /> All read
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ padding: 4, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", color: t.textMuted }}>
                <X size={14} />
              </button>
            </div>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading && <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Loading...</div>}
            {!loading && notifications.length === 0 && (
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <Bell size={28} color={t.emptyIcon} style={{ display: "block", margin: "0 auto 8px" }} />
                <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>No notifications yet</p>
              </div>
            )}
            {notifications.map((item) => {
              const { icon } = getNotifMeta(item.type);
              return (
                <div key={item.id} onClick={(e) => !item.read && handleMarkRead(item.id, e)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderBottom: `1px solid ${t.border}`, background: !item.read ? "rgba(124,58,237,0.04)" : "transparent", cursor: "pointer", transition: "background 0.15s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", fontSize: 14 }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.message}</p>
                    <p style={{ fontSize: 9, color: t.textLabel, marginTop: 3, fontFamily: "'Poppins',sans-serif" }}>{formatTime(item.createdAt)}</p>
                  </div>
                  {!item.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: 4 }} />}
                </div>
              );
            })}
          </div>
          <div style={{ flexShrink: 0, borderTop: `1px solid ${t.border}` }}>
            <button style={{ width: "100%", padding: "10px", fontSize: 11, fontWeight: 600, color: "#7c3aed", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>View all notifications →</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   CHAT PANEL
═══════════════════════════════════════════════ */
const LatestMessagePanel = ({ t }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [batchId, setBatchId] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const studentEmail = JSON.parse(localStorage.getItem("lms_user") || "{}")?.email;

  useEffect(() => {
    getStudentContext().then((ctx) => { setBatchId(ctx.data.batchId); setTrainerEmail(ctx.data.trainerEmail); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!batchId || !trainerEmail) return;
    getConversation(batchId, trainerEmail).then((res) => {
      setChat(res.data.map((m) => ({ sender: m.senderEmail === studentEmail ? "student" : "teacher", text: m.message, time: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })));
    });
  }, [batchId, trainerEmail]);

  useEffect(() => { if (expanded) chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, expanded]);

  const handleSend = async () => {
    if (!message.trim() || !batchId || !trainerEmail) return;
    setSending(true);
    try {
      await sendMessage({ batchId, receiverEmail: trainerEmail, message });
      setMessage("");
      const res = await getConversation(batchId, trainerEmail);
      setChat(res.data.map((m) => ({ sender: m.senderEmail === studentEmail ? "student" : "teacher", text: m.message, time: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })));
    } finally { setSending(false); }
  };

  const cardStyle = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow };

  if (!expanded) return (
    <div style={{ ...cardStyle, padding: 22, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <MessageCircle size={15} color="#7c3aed" />
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Latest Message</span>
        </div>
        <button onClick={() => setExpanded(true)} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: t.textMuted, background: t.pillBg, border: `1px solid ${t.pillBorder}`, borderRadius: 999, padding: "4px 12px", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Expand</button>
      </div>
      {chat.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
            <MessageCircle size={20} color={t.emptyIcon} />
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No messages yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12, maxHeight: 140, overflowY: "auto" }}>
          {chat.slice(-3).map((msg, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: msg.sender === "student" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: 12, fontSize: 11, background: msg.sender === "student" ? "linear-gradient(135deg,#7c3aed,#a855f7)" : t.recentItemBg, color: msg.sender === "student" ? "#fff" : t.text, fontFamily: "'Poppins',sans-serif" }}>{msg.text}</div>
            </div>
          ))}
        </div>
      )}
      {batchId && trainerEmail && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input type="text" placeholder="Quick message to trainer..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} style={{ flex: 1, fontSize: 11, padding: "8px 12px", borderRadius: 10, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.text, outline: "none", fontFamily: "'Poppins',sans-serif" }} />
          <button onClick={handleSend} disabled={!message.trim() || sending} style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!message.trim() || sending) ? 0.4 : 1 }}>
            <Send size={13} />
          </button>
        </div>
      )}
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
        <button onClick={() => setExpanded(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px", borderRadius: 10, border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.06)", color: "#7c3aed", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
          <Inbox size={13} /> Go to Inbox
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ ...cardStyle, display: "flex", flexDirection: "column", height: 380 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={13} color="#7c3aed" />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{trainerEmail?.split("@")[0] || "Trainer"}</p>
            <p style={{ fontSize: 9, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{trainerEmail || "Not assigned"}</p>
          </div>
        </div>
        <button onClick={() => setExpanded(false)} style={{ padding: 4, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", color: t.textMuted }}><X size={14} /></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {chat.length === 0 ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>No messages yet. Say hello!</p>
          </div>
        ) : chat.map((msg, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: msg.sender === "student" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6 }}>
            {msg.sender === "teacher" && <div style={{ width: 24, height: 24, borderRadius: 999, flexShrink: 0, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><GraduationCap size={11} color="#7c3aed" /></div>}
            <div style={{ maxWidth: "75%", padding: "8px 12px", borderRadius: 12, fontSize: 11, background: msg.sender === "student" ? "linear-gradient(135deg,#7c3aed,#a855f7)" : t.recentItemBg, color: msg.sender === "student" ? "#fff" : t.text, fontFamily: "'Poppins',sans-serif" }}>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
              <p style={{ fontSize: 9, margin: "3px 0 0", opacity: 0.6, textAlign: "right" }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderTop: `1px solid ${t.border}` }}>
        <input type="text" placeholder={batchId ? "Type a message..." : "No classroom assigned"} disabled={!batchId} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} style={{ flex: 1, fontSize: 11, padding: "8px 12px", borderRadius: 10, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.text, outline: "none", fontFamily: "'Poppins',sans-serif", opacity: !batchId ? 0.5 : 1 }} />
        <button onClick={handleSend} disabled={!message.trim() || sending || !batchId} style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!message.trim() || sending || !batchId) ? 0.4 : 1 }}>
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   QUICK ACTION PILL
═══════════════════════════════════════════════ */
const QuickAction = ({ label, color, onClick, t }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 10, border: `1px solid ${hov ? color + "55" : t.border}`, background: hov ? `${color}12` : "transparent", color: hov ? color : t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Poppins',sans-serif" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: hov ? color : t.textMuted, transition: "background 0.2s", flexShrink: 0 }} />
      {label}
    </button>
  );
};

/* ═══════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════ */
const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [classroom, setClassroom] = useState(null);
  const [classLoading, setClassLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeCourses, setActiveCourses] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [pendingAssessments, setPendingAssessments] = useState(0);
  const [overdueAssessments, setOverdueAssessments] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState(null);

  // ✅ All progress states from doc 6
  const [videoProgress, setVideoProgress] = useState({ watchedCount: 0, totalVideos: 0, watchPercentage: 0 });
  const [fileProgress, setFileProgress] = useState({ downloadedCount: 0, totalFiles: 0, downloadPercentage: 0 });
  const [assignmentProgress, setAssignmentProgress] = useState({ completedCount: 0, totalAssignments: 0, percentage: 0 });
  const [quizProgress, setQuizProgress] = useState({ completedCount: 0, totalQuizzes: 0, percentage: 0 });

  const studentEmail = getEmailFromToken();

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => { setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    getStudentClassroom().then((res) => setClassroom(res.data)).catch(() => setClassroom(null)).finally(() => setClassLoading(false));
  }, []);

  // ✅ Load all progress from doc 6
  useEffect(() => {
    if (!studentEmail) { setStatsLoading(false); return; }
    const loadAll = async () => {
      setStatsLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const [coursesRes, attendanceRes, quizzesRes, quizHistoryRes, assignmentsRes, submissionsRes] = await Promise.allSettled([
          courseService.getStudentCourses(),
          attendanceService.getMonthlyAttendance(year, month),
          getStudentQuizzes(),
          getMyQuizHistory(),
          getStudentAssignments(),
          getMySubmissions(),
        ]);

        if (coursesRes.status === "fulfilled") {
          const courses = coursesRes.value?.data ?? [];
          setActiveCourses(courses.filter((c) => c.status === "ACTIVE" || !c.completed).length);
          setCompletedCourses(courses.filter((c) => c.status === "COMPLETED" || c.completed).length);
        }

        if (attendanceRes.status === "fulfilled") setAttendancePercent(calcAttendancePercent(attendanceRes.value?.data));

        let pq = 0, oq = 0;
        if (quizzesRes.status === "fulfilled" && quizHistoryRes.status === "fulfilled") {
          const all = quizzesRes.value?.data ?? [];
          const done = new Set((quizHistoryRes.value?.data ?? []).map((a) => a.quizId ?? a.quiz?.id));
          const na = all.filter((q) => !done.has(q.id));
          pq = na.length;
          oq = na.filter((q) => q.dueDate && new Date(q.dueDate) < now).length;
        }

        let pa = 0, oa = 0;
        if (assignmentsRes.status === "fulfilled" && submissionsRes.status === "fulfilled") {
          const all = assignmentsRes.value?.data ?? [];
          const done = new Set((submissionsRes.value?.data ?? []).map((s) => s.assignmentId ?? s.assignment?.id));
          const na = all.filter((a) => !done.has(a.id));
          pa = na.length;
          oa = na.filter((a) => a.dueDate && new Date(a.dueDate) < now).length;
        }
        setPendingAssessments(pq + pa);
        setOverdueAssessments(oq + oa);

        // ✅ Video progress
        try {
          const videosRes = await videoService.getStudentVideos();
          const videos = videosRes.data || [];
          if (videos.length > 0 && videos[0].batchId) {
            const vpRes = await progressService.getVideoProgress(studentEmail, videos[0].batchId);
            const vp = vpRes.data;
            setVideoProgress({ watchedCount: vp.watchedVideoIds?.length ?? 0, totalVideos: videos.length, watchPercentage: vp.watchPercentage ?? 0 });
          } else { setVideoProgress({ watchedCount: 0, totalVideos: videos.length, watchPercentage: 0 }); }
        } catch { setVideoProgress({ watchedCount: 0, totalVideos: 0, watchPercentage: 0 }); }

        // ✅ File/Document progress
        try {
          const filesRes = await fileService.getStudentFiles();
          const files = filesRes.data || [];
          if (files.length > 0 && files[0].batchId) {
            const fpRes = await progressService.getFileProgress(studentEmail, files[0].batchId);
            const fp = fpRes.data;
            setFileProgress({ downloadedCount: fp.downloadedFileIds?.length ?? 0, totalFiles: files.length, downloadPercentage: fp.downloadPercentage ?? 0 });
          } else { setFileProgress({ downloadedCount: 0, totalFiles: files.length, downloadPercentage: 0 }); }
        } catch { setFileProgress({ downloadedCount: 0, totalFiles: 0, downloadPercentage: 0 }); }

        // ✅ Assignment progress
        try {
          const assignRes = await getStudentAssignments();
          const assignList = Array.isArray(assignRes?.data) ? assignRes.data : assignRes?.data?.data || assignRes?.data?.assignments || [];
          if (assignList.length > 0 && assignList[0].batchId) {
            const apRes = await progressService.getAssignmentProgress(studentEmail, assignList[0].batchId);
            const ap = apRes.data;
            setAssignmentProgress({ completedCount: ap.completedAssignmentIds?.length ?? 0, totalAssignments: assignList.length, percentage: ap.percentage ?? 0 });
          } else { setAssignmentProgress({ completedCount: 0, totalAssignments: assignList.length, percentage: 0 }); }
        } catch { setAssignmentProgress({ completedCount: 0, totalAssignments: 0, percentage: 0 }); }

        // ✅ Quiz progress
        try {
          const quizList = quizzesRes.status === "fulfilled" ? (quizzesRes.value?.data ?? []) : [];
          if (quizList.length > 0 && quizList[0].batchId) {
            const qpRes = await progressService.getQuizProgress(studentEmail, quizList[0].batchId);
            const qp = qpRes.data;
            setQuizProgress({ completedCount: qp.completedQuizIds?.length ?? 0, totalQuizzes: quizList.length, percentage: qp.percentage ?? 0 });
          } else { setQuizProgress({ completedCount: 0, totalQuizzes: quizList.length, percentage: 0 }); }
        } catch { setQuizProgress({ completedCount: 0, totalQuizzes: 0, percentage: 0 }); }

      } catch (err) { console.error("Dashboard load error:", err); } finally { setStatsLoading(false); }
    };
    loadAll();
  }, [studentEmail]);

  const stats = [
    { label: "Active Courses", numericValue: activeCourses, change: `${activeCourses} enrolled`, trend: "up", icon: BookOpen, color: "#22d3ee" },
    { label: "Completed Courses", numericValue: completedCourses, change: `${completedCourses} finished`, trend: "up", icon: CheckCircle, color: "#34d399" },
    { label: "Pending Assessments", numericValue: pendingAssessments, change: overdueAssessments > 0 ? `${overdueAssessments} overdue` : "None overdue", trend: overdueAssessments > 0 ? "down" : "up", icon: Clock, color: "#fb923c" },
    { label: "Attendance", numericValue: attendancePercent ?? 0, isPercent: true, change: attendancePercent !== null ? (attendancePercent >= 75 ? "Good standing" : "Below 75% ⚠️") : "No data", trend: attendancePercent !== null && attendancePercent >= 75 ? "up" : "down", icon: Percent, color: "#a78bfa" },
  ];

  const card = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.shadow };
  const pill = { fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif" };

  const OverviewPage = () => (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 14, marginBottom: 20 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} index={i} t={t} loading={statsLoading} />)}
      </div>

      {/* Classroom + Chat + Calendar row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 290px", gap: 14, marginBottom: 14 }}>
        {/* Classroom */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}><User size={15} color="#22d3ee" /></div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>My Classroom</span>
            </div>
            <span style={pill}>Overview</span>
          </div>
          {classLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2].map((i) => <div key={i} style={{ display: "flex", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: t.barBg, flexShrink: 0 }} /><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}><div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "70%" }} /><div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "45%" }} /></div></div>)}
            </div>
          ) : classroom ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Batch Name", value: classroom.batchName, color: "#22d3ee", Icon: GraduationCap },
                { label: "Trainer", value: classroom.trainerName, color: "#34d399", Icon: User },
                { label: "Trainer Email", value: classroom.trainerEmail, color: "#a78bfa", Icon: MessageCircle },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 12, background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: `${row.color}18`, border: `1px solid ${row.color}30`, flexShrink: 0 }}><row.Icon size={14} color={row.color} /></div>
                  <div>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{row.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{row.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}><User size={20} color={t.emptyIcon} /></div>
              <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No Classroom Assigned</p>
              <p style={{ fontSize: 10, color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: 0 }}>Waiting for admin to assign trainer</p>
            </div>
          )}
        </div>

        {/* Chat */}
        <LatestMessagePanel t={t} />

        {/* Calendar */}
        <MiniCalendar t={t} />
      </div>

      {/* ✅ Video + File + Assignment + Quiz mini progress cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 14 }}>
        <MiniProgressCard icon={Film} label="Video Progress" color="#22d3ee" done={videoProgress.watchedCount} total={videoProgress.totalVideos} pct={videoProgress.watchPercentage} navigateTo="/student/videos" navigateLabel="Go to Videos" t={t} />
        <MiniProgressCard icon={FolderOpen} label="Documents Progress" color="#0ea5e9" done={fileProgress.downloadedCount} total={fileProgress.totalFiles} pct={fileProgress.downloadPercentage} navigateTo="/student/documents" navigateLabel="Go to Documents" t={t} />
        <MiniProgressCard icon={ClipboardList} label="Assignment Progress" color="#fb923c" done={assignmentProgress.completedCount} total={assignmentProgress.totalAssignments} pct={assignmentProgress.percentage} navigateTo="/student/assignments" navigateLabel="Go to Assignments" t={t} />
        <MiniProgressCard icon={Brain} label="Quiz Progress" color="#a78bfa" done={quizProgress.completedCount} total={quizProgress.totalQuizzes} pct={quizProgress.percentage} navigateTo="/student/assessments" navigateLabel="Go to Quizzes" t={t} />
      </div>

      {/* Quick actions */}
      <div style={{ ...card, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 10 }}>
          <Zap size={14} color={t.textLabel} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, fontFamily: "'Poppins',sans-serif" }}>Quick Actions</span>
        </div>
        {[
          { label: "My Courses", color: "#22d3ee", path: "/student/courses" },
          { label: "Videos", color: "#34d399", path: "/student/videos" },
          { label: "Documents", color: "#0ea5e9", path: "/student/documents" },
          { label: "Assessments", color: "#fb923c", path: "/student/assessments" },
          { label: "Assignments", color: "#f43f5e", path: "/student/assignments" },
          { label: "Progress", color: "#a78bfa", path: null },
        ].map((a, i) => (
          <QuickAction key={i} label={a.label} color={a.color} t={t} onClick={() => a.path ? navigate(a.path) : setActiveTab("progress")} />
        ))}
      </div>
    </div>
  );

  const ProgressPage = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 14 }}>
        {[
          { label: "Active Courses", value: activeCourses, icon: BookOpen, color: "#22d3ee" },
          { label: "Completed", value: completedCourses, icon: Trophy, color: "#34d399" },
          { label: "Pending Assessments", value: pendingAssessments, icon: Clock, color: "#fb923c" },
          { label: "Attendance", value: attendancePercent !== null ? `${attendancePercent}%` : "—", icon: Percent, color: "#a78bfa" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20, boxShadow: t.shadow }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{s.label}</p>
                <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${s.color}18`, border: `1px solid ${s.color}30` }}><Icon size={15} color={s.color} /></div>
              </div>
              <p style={{ fontSize: 32, fontWeight: 800, color: t.text, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Detailed progress blocks */}
      <MiniProgressCard icon={Film} label="Video Lecture Progress" color="#22d3ee" done={videoProgress.watchedCount} total={videoProgress.totalVideos} pct={videoProgress.watchPercentage} navigateTo="/student/videos" navigateLabel="Go to Videos" t={t} />
      <MiniProgressCard icon={FolderOpen} label="Document Progress" color="#0ea5e9" done={fileProgress.downloadedCount} total={fileProgress.totalFiles} pct={fileProgress.downloadPercentage} navigateTo="/student/documents" navigateLabel="Go to Documents" t={t} />
      <MiniProgressCard icon={ClipboardList} label="Assignment Progress" color="#fb923c" done={assignmentProgress.completedCount} total={assignmentProgress.totalAssignments} pct={assignmentProgress.percentage} navigateTo="/student/assignments" navigateLabel="Go to Assignments" t={t} />
      <MiniProgressCard icon={Brain} label="Quiz Progress" color="#a78bfa" done={quizProgress.completedCount} total={quizProgress.totalQuizzes} pct={quizProgress.percentage} navigateTo="/student/assessments" navigateLabel="Go to Quizzes" t={t} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)}70%{box-shadow:0 0 0 8px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(124,58,237,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Student Portal</span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Student Dashboard</h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>Your classroom &amp; learning overview</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                  {["overview", "progress"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${activeTab === tab ? "rgba(124,58,237,0.5)" : t.borderHov}`, background: activeTab === tab ? "rgba(124,58,237,0.1)" : t.actBg, color: activeTab === tab ? "#7c3aed" : t.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", textTransform: "capitalize", transition: "all 0.2s" }}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {!statsLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub }}>
                    <span>{activeCourses} courses</span>
                    <span style={{ width: 1, height: 14, background: t.actBorder }} />
                    <span>{completedCourses} completed</span>
                    <span style={{ width: 1, height: 14, background: t.actBorder }} />
                    {pendingAssessments > 0 ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#fb923c", fontWeight: 700 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block" }} />
                        {pendingAssessments} pending
                      </span>
                    ) : <span style={{ color: t.liveText }}>All clear ✓</span>}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>
                <NotificationBell t={t} />
                <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 999, padding: "8px 18px", color: "#7c3aed", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {activeTab === "overview" && <OverviewPage />}
          {activeTab === "progress" && <ProgressPage />}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

































