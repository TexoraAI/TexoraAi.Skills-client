// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   BookOpen,
//   Clock,
//   DollarSign,
//   TrendingUp,
//   ArrowUpRight,
//   BarChart3,
//   Calendar,
//   Activity,
//   Sparkles,
//   ChevronLeft,
//   ChevronRight,
//   CalendarDays,
//   GraduationCap,
//   ShieldCheck,
//   UserCheck,
//   Layers,
// } from "lucide-react";

// /* ─── theme token map ─── */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a",
//     cardBg: "#111111",
//     cardBgHov: "#161616",
//     heroBg: "#0d0d14",
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
//     heroTitle: "#ffffff",
//     heroSub: "rgba(255,255,255,0.38)",
//     heroGrid: "rgba(255,255,255,0.03)",
//     heroBadgeBg: "rgba(99,102,241,0.10)",
//     heroBadgeBorder: "rgba(99,102,241,0.28)",
//     heroBadgeText: "#a5b4fc",
//     heroBadgeDot: "#818cf8",
//     heroBtnBg: "rgba(255,255,255,0.04)",
//     heroBtnBorder: "rgba(255,255,255,0.09)",
//     heroBtnColor: "rgba(255,255,255,0.50)",
//     heroStatBg: "rgba(255,255,255,0.04)",
//     heroStatBorder: "rgba(255,255,255,0.08)",
//     heroStatText: "rgba(255,255,255,0.42)",
//     heroStatDiv: "rgba(255,255,255,0.10)",
//     heroActBg: "rgba(255,255,255,0.04)",
//     heroActBorder: "rgba(255,255,255,0.08)",
//     heroActBar: "rgba(255,255,255,0.40)",
//     heroActIcon: "rgba(255,255,255,0.40)",
//     heroFloatBg: "rgba(12,12,22,0.88)",
//     heroFloatBorder: "rgba(255,255,255,0.10)",
//     heroFloatLabel: "rgba(255,255,255,0.28)",
//     heroFloatSub: "rgba(255,255,255,0.30)",
//     heroEllipse1: "rgba(99,102,241,0.14)",
//     heroEllipse2: "rgba(34,211,238,0.10)",
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
//     heroTitle: "#0f172a",
//     heroSub: "#64748b",
//     heroGrid: "rgba(0,0,0,0.04)",
//     heroBadgeBg: "rgba(99,102,241,0.08)",
//     heroBadgeBorder: "rgba(99,102,241,0.20)",
//     heroBadgeText: "#4f46e5",
//     heroBadgeDot: "#6366f1",
//     heroBtnBg: "#f8fafc",
//     heroBtnBorder: "#e2e8f0",
//     heroBtnColor: "#475569",
//     heroStatBg: "#f8fafc",
//     heroStatBorder: "#e2e8f0",
//     heroStatText: "#64748b",
//     heroStatDiv: "#e2e8f0",
//     heroActBg: "#f8fafc",
//     heroActBorder: "#e2e8f0",
//     heroActBar: "#94a3b8",
//     heroActIcon: "#94a3b8",
//     heroFloatBg: "rgba(255,255,255,0.97)",
//     heroFloatBorder: "#e2e8f0",
//     heroFloatLabel: "#94a3b8",
//     heroFloatSub: "#94a3b8",
//     heroEllipse1: "rgba(99,102,241,0.10)",
//     heroEllipse2: "rgba(34,211,238,0.08)",
//   },
// };

// /* ─── count-up hook ─── */
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

// /* ─── mini calendar ─── */
// function MiniCalendar({ t }) {
//   const today = new Date();
//   const [current, setCurrent] = useState({
//     year: today.getFullYear(),
//     month: today.getMonth(),
//   });
//   const monthNames = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ];
//   const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
//   const firstDay = new Date(current.year, current.month, 1).getDay();
//   const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
//   const offset = firstDay === 0 ? 6 : firstDay - 1;
//   const prev = () => setCurrent((c) => ({
//     year: c.month === 0 ? c.year - 1 : c.year,
//     month: c.month === 0 ? 11 : c.month - 1,
//   }));
//   const next = () => setCurrent((c) => ({
//     year: c.month === 11 ? c.year + 1 : c.year,
//     month: c.month === 11 ? 0 : c.month + 1,
//   }));
//   const isToday = (d) =>
//     d === today.getDate() &&
//     current.month === today.getMonth() &&
//     current.year === today.getFullYear();
//   const cells = Array(offset).fill(null).concat(
//     Array.from({ length: daysInMonth }, (_, i) => i + 1)
//   );
//   while (cells.length % 7 !== 0) cells.push(null);

//   return (
//     <div style={{
//       background: `linear-gradient(160deg, rgba(99,102,241,0.14), transparent 55%), ${t.cardBg}`,
//       border: "1px solid rgba(99,102,241,0.25)",
//       borderRadius: 20,
//       padding: 16,
//       height: "100%",
//       boxSizing: "border-box",
//       boxShadow: t.shadow,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{
//             width: 28, height: 28, borderRadius: 8,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             background: "linear-gradient(135deg,#6366f1,#4338ca)",
//             boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
//           }}>
//             <CalendarDays size={16} color="#ffffff" />
//           </div>
//           <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: t.text }}>
//             {monthNames[current.month]} {current.year}
//           </span>
//         </div>
//         <div style={{ display: "flex", gap: 4 }}>
//           {[prev, next].map((fn, i) => (
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
//             textAlign: "center", fontSize: 13, fontWeight: 600,
//             color: t.calDayHeader, letterSpacing: "0.06em",
//             paddingBottom: 6, fontFamily: "'Poppins',sans-serif",
//           }}>{d}</div>
//         ))}
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
//         {cells.map((d, i) => (
//           <div key={i} style={{
//             aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
//             borderRadius: 8, fontSize: 13, fontWeight: isToday(d) ? 700 : 500,
//             cursor: d ? "pointer" : "default",
//             background: isToday(d) ? "linear-gradient(135deg,#6366f1,#4338ca)" : "transparent",
//             color: isToday(d) ? "#ffffff" : d ? t.calDayText : "transparent",
//             boxShadow: isToday(d) ? "0 4px 10px rgba(99,102,241,0.4)" : "none",
//             fontFamily: "'Poppins',sans-serif", transition: "background 0.15s",
//           }}>{d}</div>
//         ))}
//       </div>
//       <div style={{
//         marginTop: 16, paddingTop: 12, borderTop: `1px solid ${t.calFooterBdr}`,
//         fontSize: 13, color: t.calFooter, textAlign: "center",
//         fontFamily: "'Poppins',sans-serif", fontWeight: 600, letterSpacing: "0.05em",
//       }}>
//         NO EVENTS SCHEDULED
//       </div>
//     </div>
//   );
// }

// /* ─── stat card (colorful) ─── */
// function StatCard({ stat, index, navigate, t, loading }) {
//   const Icon = stat.icon;
//   const count = useCountUp(loading ? 0 : stat.value);
//   const [hov, setHov] = useState(false);

//   return (
//     <button
//       onClick={() => navigate(stat.route)}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         animationDelay: `${index * 80}ms`,
//         background: `linear-gradient(135deg, ${stat.color}, ${stat.colorTo})`,
//         border: `1px solid ${stat.colorTo}`,
//         boxShadow: hov
//           ? `0 14px 28px -12px ${stat.color}66, 0 0 0 1px ${stat.color}55`
//           : `0 6px 16px -8px ${stat.color}55`,
//         borderRadius: 16, padding: "14px 14px 12px",
//         display: "flex", flexDirection: "column", gap: 8,
//         textAlign: "left", cursor: "pointer",
//         transition: "all 0.25s ease", position: "relative", overflow: "hidden",
//         transform: hov ? "translateY(-2px)" : "translateY(0)",
//       }}
//       className="stat-card"
//     >
//       <div style={{
//         position: "absolute", top: -20, right: -20, width: 80, height: 80,
//         borderRadius: "50%", background: "rgba(255,255,255,0.16)",
//         opacity: hov ? 1 : 0.6, transition: "opacity 0.4s", pointerEvents: "none",
//       }} />
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
//         <div style={{
//           width: 26, height: 26, borderRadius: 8,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.3)",
//         }}>
//           <Icon size={15} color="#ffffff" strokeWidth={2} />
//         </div>
//         <ArrowUpRight size={12} style={{ color: "#ffffff", opacity: hov ? 0.9 : 0.55, transition: "opacity 0.2s" }} />
//       </div>
//       <div style={{ position: "relative" }}>
//         {loading ? (
//           <div style={{ width: 40, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.25)", animation: "pulse 1.5s ease infinite" }} />
//         ) : (
//           <p style={{
//             fontSize: 13, fontWeight: 600, lineHeight: 1,
//             fontFamily: "'Poppins',sans-serif", color: "#ffffff", margin: 0,
//             textShadow: "0 2px 12px rgba(0,0,0,0.15)",
//           }}>
//             {stat.prefix || ""}{count}{stat.suffix || ""}
//           </p>
//         )}
//         <p style={{
//           fontSize: 13, marginTop: 4, fontWeight: 600, letterSpacing: "0.08em",
//           textTransform: "uppercase", color: "rgba(255,255,255,0.85)",
//           fontFamily: "'Poppins',sans-serif", margin: "4px 0 0",
//         }}>{stat.label}</p>
//       </div>
//       <div style={{ height: 2, background: "rgba(255,255,255,0.22)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
//         <div style={{
//           height: "100%", borderRadius: 99, background: "#ffffff",
//           width: hov ? "65%" : "30%", transition: "width 0.65s ease", opacity: 0.9,
//         }} />
//       </div>
//     </button>
//   );
// }

// /* ─── recent item row ─── */
// function RecentRow({ color, colorTo, Icon: Ic, title, sub, badge, t }) {
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
//         width: 28, height: 28, borderRadius: 8,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         background: `linear-gradient(135deg, ${color}, ${colorTo || color})`,
//         boxShadow: `0 4px 10px -2px ${color}66`, flexShrink: 0,
//       }}>
//         <Ic size={15} color="#ffffff" />
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p style={{
//           fontSize: 13, fontWeight: 600, color: t.text, margin: 0,
//           fontFamily: "'Poppins',sans-serif",
//           overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//         }}>{title}</p>
//         <p style={{ fontSize: 13, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{sub}</p>
//       </div>
//       {badge && (
//         <span style={{
//           fontSize: 13, fontWeight: 600, color: t.overdueText,
//           background: t.overdueBg, border: `1px solid ${t.overdueBorder}`,
//           padding: "2px 7px", borderRadius: 999, flexShrink: 0,
//           fontFamily: "'Poppins',sans-serif",
//         }}>Pending</span>
//       )}
//     </div>
//   );
// }

// /* ─── recent panel ─── */
// function RecentPanel({ title, color, colorTo, items, loading, emptyIcon: EmptyIcon, emptyText, viewRoute, renderItem, navigate, t }) {
//   return (
//     <div style={{
//       background: `linear-gradient(160deg, ${color}22, transparent 55%), ${t.cardBg}`,
//       border: `1px solid ${color}40`,
//       borderRadius: 16, padding: 16, boxShadow: t.shadow,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{
//             width: 28, height: 28, borderRadius: 8,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             background: `linear-gradient(135deg, ${color}, ${colorTo})`,
//             boxShadow: `0 4px 12px -2px ${color}66`,
//           }}>
//             <EmptyIcon size={15} color="#ffffff" />
//           </div>
//           <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: t.text }}>{title}</span>
//         </div>
//         <button onClick={() => navigate(viewRoute)} style={{
//           fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
//           color: t.textMuted, background: t.pillBg, border: `1px solid ${t.pillBorder}`,
//           borderRadius: 999, padding: "4px 12px", cursor: "pointer",
//           fontFamily: "'Poppins',sans-serif",
//         }}>View all</button>
//       </div>
//       {loading ? (
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {[1,2,3].map((i) => (
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
//           <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{emptyText}</p>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//           {items.map((item, i) => renderItem(item, i))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ══ MAIN ══ */
// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   /* ─────────────────────────────────────────────────────────
//      THEME DETECTION — FIXED
//      App.jsx only ever toggles the "dark" class on <html>:
//         classList.toggle("dark", theme === "dark")
//      It NEVER adds a "light" class. So the old code, which
//      fell back to `return true` (dark) whenever neither "dark"
//      nor "light" was found, meant Light Mode (which just
//      REMOVES the "dark" class) always fell through to the
//      dark-default and the dashboard stayed dark.

//      Fix: treat "dark" class as the single source of truth.
//      No class => light. No confusing fallback needed.
//      ───────────────────────────────────────────────────────── */
//   const detectDark = () => {
//     if (typeof document === "undefined") return false;
//     const root = document.documentElement;
//     return (
//       root.classList.contains("dark") ||
//       root.getAttribute("data-theme") === "dark"
//     );
//   };

//   const [isDark, setIsDark] = useState(detectDark);
//   useEffect(() => {
//     // sync once on mount in case theme changed before this component mounted
//     setIsDark(detectDark());

//     const obs = new MutationObserver(() => setIsDark(detectDark()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);

//   const t = isDark ? T.dark : T.light;

//   const [loading, setLoading] = useState(true);
//   const [counts, setCounts] = useState({
//     totalUsers: 0,
//     activeCourses: 0,
//     pendingApprovals: 0,
//     revenue: 0,
//     trainers: 0,
//     students: 0,
//     batches: 0,
//     admins: 0,
//   });
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [recentCourses, setRecentCourses] = useState([]);
//   const [recentApprovals, setRecentApprovals] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         setCounts({
//           totalUsers: 0,
//           activeCourses: 0,
//           pendingApprovals: 0,
//           revenue: 0,
//           trainers: 0,
//           students: 0,
//           batches: 0,
//           admins: 0,
//         });
//         setRecentUsers([]);
//         setRecentCourses([]);
//         setRecentApprovals([]);
//       } catch (e) {
//         console.error("Admin dashboard load failed:", e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const fmt = (dateStr) => {
//     if (!dateStr) return "";
//     return new Date(dateStr).toLocaleDateString(undefined, { day: "numeric", month: "short" });
//   };

//   const stats = [
//     { label: "Total Users",        value: counts.totalUsers,       icon: Users,        color: "#22d3ee", colorTo: "#0891b2", route: "/admin/users" },
//     { label: "Active Courses",     value: counts.activeCourses,    icon: BookOpen,     color: "#34d399", colorTo: "#059669", route: "/admin/courses" },
//     { label: "Pending Approvals",  value: counts.pendingApprovals, icon: Clock,        color: "#fb923c", colorTo: "#ea580c", route: "/admin/approvals", live: true },
//     { label: "Revenue (MTD)",      value: counts.revenue,          icon: DollarSign,   color: "#a78bfa", colorTo: "#7c3aed", route: "/admin/revenue", prefix: "$" },
//     { label: "Total Trainers",     value: counts.trainers,         icon: UserCheck,    color: "#f43f5e", colorTo: "#be123c", route: "/admin/trainers" },
//     { label: "Total Students",     value: counts.students,         icon: GraduationCap,color: "#2dd4bf", colorTo: "#0d9488", route: "/admin/students" },
//     { label: "Active Batches",     value: counts.batches,          icon: Layers,       color: "#f59e0b", colorTo: "#b45309", route: "/admin/batches" },
//     { label: "Admins",             value: counts.admins,           icon: ShieldCheck,  color: "#c084fc", colorTo: "#9333ea", route: "/admin/admins" },
//   ];

//   const keyReports = [
//     { title: "User Growth",       value: "0%",  icon: TrendingUp, color: "#22d3ee", colorTo: "#0891b2" },
//     { title: "Revenue Trend",     value: "$0K", icon: DollarSign, color: "#a78bfa", colorTo: "#7c3aed" },
//     { title: "Course Performance",value: "0%",  icon: BookOpen,   color: "#34d399", colorTo: "#059669" },
//     { title: "Active Sessions",   value: "0",   icon: Calendar,   color: "#f59e0b", colorTo: "#b45309" },
//   ];

//   const card = {
//     background: t.cardBg,
//     border: `1px solid ${t.border}`,
//     borderRadius: 20,
//     padding: 16,
//     boxShadow: t.shadow,
//   };
//   const pill = {
//     fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
//     padding: "4px 10px", borderRadius: 999, background: t.pillBg,
//     border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif",
//   };

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
//         @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
//         .livebadge{animation:pulse-ring 2.2s ease-out infinite}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}

//         /* ═══ RESPONSIVE LAYOUT ═══ */
//         .dash-wrap { padding: 24px; max-width: 1300px; margin: 0 auto; padding-bottom: 52px; }
//         .hero-left { display:flex; flex-direction:column; gap:2px; min-width:0; }
//         .hero-right { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; width:100%; }
//         .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:14px; }
//         .recent-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:10px; margin-bottom:10px; }
//         .bottom-grid { display:grid; grid-template-columns: 1fr 1fr 260px; gap:10px; margin-bottom:10px; }
//         .key-reports-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

//         @media (max-width: 1100px) {
//           .bottom-grid { grid-template-columns: 1fr 1fr; }
//           .stats-grid { grid-template-columns: repeat(4,1fr); }
//         }
//         @media (max-width: 900px) {
//           .stats-grid { grid-template-columns: repeat(3,1fr); }
//         }
//         @media (max-width: 768px) {
//           .bottom-grid { grid-template-columns: 1fr; }
//           .dash-wrap { padding: 16px; }
//           .key-reports-grid { grid-template-columns: 1fr 1fr; }
//           .hero-right { grid-template-columns: 1fr; }
//           .stats-grid { grid-template-columns: repeat(2,1fr); }
//         }
//         @media (max-width: 480px) {
//           .stats-grid { grid-template-columns: repeat(2,1fr); gap:10px; }
//           .key-reports-grid { grid-template-columns: 1fr; }
//           .dash-wrap { padding: 12px; }
//         }
//       `}</style>

//       <div style={{
//         minHeight: "100vh", background: t.pageBg, color: t.text,
//         fontFamily: "'Poppins',sans-serif", position: "relative",
//         transition: "background 0.3s,color 0.3s",
//       }}>
//         <div className="dash-wrap" style={{ position: "relative", zIndex: 1 }}>

//           {/* ═══ HERO ═══ */}
//           <div className="dfade" style={{
//             borderRadius: 16,
//             padding: "14px 18px",
//             background: t.heroBg,
//             border: `1px solid ${t.borderHero}`,
//             marginBottom: 14,
//             boxShadow: t.shadow,
//           }}>
//             <div className="hero-left" style={{ marginBottom: 12 }}>

//                 {/* Title + Subtitle */}
//                 <div>
//                   <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 22, color: t.heroTitle, margin: "0 0 3px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
//                     Admin <span style={{ background: "linear-gradient(135deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Dashboard</span>
//                   </h1>
//                   <p style={{ fontSize: 13, color: t.heroSub, margin: 0, fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
//                     Manage users, courses &amp; platform performance at a glance
//                   </p>
//                 </div>

//                 {/* Status Row */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
//                   {!loading && (
//                     <>
//                       <div style={{
//                         display: "flex", alignItems: "center", gap: 6,
//                         background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
//                         borderRadius: 10, padding: "5px 12px",
//                         fontSize: 13, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
//                         color: t.heroStatText,
//                       }}>
//                         <Users size={13} color={t.heroStatText} />
//                         <span>{counts.totalUsers} Users</span>
//                       </div>

//                       <div style={{
//                         display: "flex", alignItems: "center", gap: 6,
//                         background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
//                         borderRadius: 10, padding: "5px 12px",
//                         fontSize: 13, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
//                         color: t.heroStatText,
//                       }}>
//                         <BookOpen size={13} color={t.heroStatText} />
//                         <span>{counts.activeCourses} courses</span>
//                       </div>

//                       <div style={{
//                         display: "flex", alignItems: "center", gap: 6,
//                         background: counts.pendingApprovals > 0 ? "rgba(251,146,60,0.08)" : t.heroStatBg,
//                         border: counts.pendingApprovals > 0 ? "1px solid rgba(251,146,60,0.28)" : `1px solid ${t.heroStatBorder}`,
//                         borderRadius: 10, padding: "5px 12px",
//                         fontSize: 13, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
//                       }}>
//                         {counts.pendingApprovals > 0
//                           ? <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fb923c" }}>
//                               <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block" }} />
//                               {counts.pendingApprovals} pending
//                             </span>
//                           : <span style={{ color: t.liveText }}>All clear ✓</span>
//                         }
//                       </div>
//                     </>
//                   )}

//                   {/* Activity mini-bar */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 5, background: t.heroActBg, border: `1px solid ${t.heroActBorder}`, borderRadius: 8, padding: "5px 10px" }}>
//                     <Activity size={12} color={t.heroActIcon} />
//                     <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
//                       <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.heroActBar, display: "block" }} />
//                       <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.heroActBar, display: "block" }} />
//                       <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.heroActBar, display: "block" }} />
//                     </div>
//                   </div>

//                   {/* LIVE badge */}
//                   <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: 999, padding: "5px 12px", color: "#34d399", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", fontFamily: "'Poppins',sans-serif" }}>
//                     <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />LIVE
//                   </div>
//                 </div>

//               </div>

//               {/* ── Stat Cards Row (full width) ── */}
//               {!loading && (
//                 <div className="hero-right">

//                   {/* Total Users */}
//                   <div style={{
//                     background: "linear-gradient(135deg,#22d3ee,#0891b2)",
//                     borderRadius: 14,
//                     padding: "12px 16px",
//                     position: "relative",
//                     overflow: "hidden",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 14,
//                     boxShadow: "0 8px 20px -6px rgba(34,211,238,0.4)",
//                   }}>
//                     <Users size={54} color="rgba(255,255,255,0.16)" style={{ position: "absolute", right: -8, bottom: -10 }} />
//                     <div style={{
//                       width: 40, height: 40, borderRadius: 10, flexShrink: 0,
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       background: "rgba(255,255,255,0.22)", position: "relative",
//                     }}>
//                       <Users size={18} color="#ffffff" />
//                     </div>
//                     <div style={{ position: "relative" }}>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "'Poppins',sans-serif" }}>Total Users</div>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", fontFamily: "'Poppins',sans-serif", lineHeight: 1.3 }}>{counts.totalUsers}</div>
//                       <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "'Poppins',sans-serif" }}>Active learners</div>
//                     </div>
//                   </div>

//                   {/* Courses */}
//                   <div style={{
//                     background: "linear-gradient(135deg,#fb923c,#ea580c)",
//                     borderRadius: 14,
//                     padding: "12px 16px",
//                     position: "relative",
//                     overflow: "hidden",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 14,
//                     boxShadow: "0 8px 20px -6px rgba(251,146,60,0.4)",
//                   }}>
//                     <BookOpen size={54} color="rgba(255,255,255,0.16)" style={{ position: "absolute", right: -8, bottom: -10 }} />
//                     <div style={{
//                       width: 40, height: 40, borderRadius: 10, flexShrink: 0,
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       background: "rgba(255,255,255,0.22)", position: "relative",
//                     }}>
//                       <BookOpen size={18} color="#ffffff" />
//                     </div>
//                     <div style={{ position: "relative" }}>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "'Poppins',sans-serif" }}>Courses</div>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", fontFamily: "'Poppins',sans-serif", lineHeight: 1.3 }}>{counts.activeCourses}</div>
//                       <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "'Poppins',sans-serif" }}>Active now</div>
//                     </div>
//                   </div>

//                   {/* Revenue MTD */}
//                   <div style={{
//                     background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
//                     borderRadius: 14,
//                     padding: "12px 16px",
//                     minWidth: 150,
//                     position: "relative",
//                     overflow: "hidden",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 14,
//                     boxShadow: "0 8px 20px -6px rgba(167,139,250,0.4)",
//                   }}>
//                     <TrendingUp size={54} color="rgba(255,255,255,0.16)" style={{ position: "absolute", right: -8, bottom: -10 }} />
//                     <div style={{
//                       width: 40, height: 40, borderRadius: 10, flexShrink: 0,
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       background: "rgba(255,255,255,0.22)", position: "relative",
//                     }}>
//                       <DollarSign size={18} color="#ffffff" />
//                     </div>
//                     <div style={{ position: "relative" }}>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "'Poppins',sans-serif" }}>Revenue MTD</div>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", fontFamily: "'Poppins',sans-serif", lineHeight: 1.3 }}>${counts.revenue ?? 0}</div>
//                       <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "'Poppins',sans-serif" }}>This month</div>
//                     </div>
//                   </div>

//                 </div>
//               )}

//           </div>
//           {/* ═══ HERO END ═══ */}

//           {/* ═══ 8 STAT CARDS ═══ */}
//           <div className="stats-grid">
//             {stats.map((s, i) => (
//               <StatCard key={i} stat={s} index={i} navigate={navigate} t={t} loading={loading} />
//             ))}
//           </div>

//           {/* ═══ RECENT PANELS ROW ═══ */}
//           <div className="recent-grid">
//             <RecentPanel
//               title="Recent Users"
//               color="#22d3ee"
//               colorTo="#0891b2"
//               items={recentUsers}
//               loading={loading}
//               emptyIcon={Users}
//               emptyText="No users registered yet"
//               viewRoute="/admin/users"
//               navigate={navigate}
//               t={t}
//               renderItem={(u, i) => (
//                 <RecentRow key={i} color="#22d3ee" colorTo="#0891b2" Icon={Users} t={t}
//                   title={u.name || u.email || "Unknown User"}
//                   sub={u.role || fmt(u.createdAt)}
//                 />
//               )}
//             />

//             <RecentPanel
//               title="Recent Courses"
//               color="#34d399"
//               colorTo="#059669"
//               items={recentCourses}
//               loading={loading}
//               emptyIcon={BookOpen}
//               emptyText="No courses created yet"
//               viewRoute="/admin/courses"
//               navigate={navigate}
//               t={t}
//               renderItem={(c, i) => (
//                 <RecentRow key={i} color="#34d399" colorTo="#059669" Icon={BookOpen} t={t}
//                   title={c.title || c.courseName || "Untitled"}
//                   sub={fmt(c.createdAt)}
//                 />
//               )}
//             />

//             <RecentPanel
//               title="Pending Approvals"
//               color="#fb923c"
//               colorTo="#ea580c"
//               items={recentApprovals}
//               loading={loading}
//               emptyIcon={Clock}
//               emptyText="No pending approvals"
//               viewRoute="/admin/approvals"
//               navigate={navigate}
//               t={t}
//               renderItem={(a, i) => (
//                 <RecentRow key={i} color="#fb923c" colorTo="#ea580c" Icon={Clock} t={t}
//                   title={a.name || a.title || "Approval Request"}
//                   sub={fmt(a.createdAt)}
//                   badge={true}
//                 />
//               )}
//             />
//           </div>

//           {/* ═══ BOTTOM ROW ═══ */}
//           <div className="bottom-grid">
//             {/* Key Reports */}
//             <div style={{
//               ...card,
//               background: `linear-gradient(160deg, rgba(34,211,238,0.14), transparent 55%), ${t.cardBg}`,
//               border: "1px solid rgba(34,211,238,0.28)",
//             }} className="dfade">
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <div style={{
//                     width: 28, height: 28, borderRadius: 8,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: "linear-gradient(135deg,#22d3ee,#0891b2)",
//                     boxShadow: "0 4px 12px -2px rgba(34,211,238,0.5)",
//                   }}>
//                     <BarChart3 size={15} color="#ffffff" />
//                   </div>
//                   <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: t.text }}>Key Reports</span>
//                 </div>
//                 <span style={pill}>Platform</span>
//               </div>
//               <div className="key-reports-grid">
//                 {keyReports.map((item) => {
//                   const Ic = item.icon;
//                   return (
//                     <div key={item.title} style={{
//                       display: "flex", alignItems: "center", gap: 10,
//                       padding: "10px", borderRadius: 10,
//                       background: `linear-gradient(135deg, ${item.color}, ${item.colorTo})`,
//                       boxShadow: `0 6px 16px -6px ${item.color}66`,
//                     }}>
//                       <div style={{
//                         width: 26, height: 26, borderRadius: 8,
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.3)", flexShrink: 0,
//                       }}>
//                         <Ic size={14} color="#ffffff" />
//                       </div>
//                       <div>
//                         <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{item.title}</p>
//                         <p style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{item.value}</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <button onClick={() => navigate("/admin/reports")} style={{
//                 marginTop: 14, width: "100%", padding: "8px",
//                 borderRadius: 10, border: "1px solid rgba(34,211,238,0.25)",
//                 background: "rgba(34,211,238,0.06)", color: "#0891b2",
//                 fontSize: 13, fontWeight: 600, cursor: "pointer",
//                 fontFamily: "'Poppins',sans-serif",
//               }}>View Full Reports →</button>
//             </div>

//             {/* Recent Activity */}
//             <div style={{
//               ...card,
//               background: `linear-gradient(160deg, rgba(167,139,250,0.16), transparent 55%), ${t.cardBg}`,
//               border: "1px solid rgba(167,139,250,0.30)",
//             }} className="dfade">
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <div style={{
//                     width: 28, height: 28, borderRadius: 8,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
//                     boxShadow: "0 4px 12px -2px rgba(167,139,250,0.5)",
//                   }}>
//                     <Activity size={15} color="#ffffff" />
//                   </div>
//                   <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: t.text }}>Recent Activity</span>
//                 </div>
//                 <span style={pill}>Today</span>
//               </div>
//               <div style={{
//                 display: "flex", flexDirection: "column",
//                 alignItems: "center", justifyContent: "center",
//                 padding: "28px 0", gap: 12,
//               }}>
//                 <div style={{
//                   width: 52, height: 52, borderRadius: 14,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
//                 }}>
//                   <Activity size={20} color={t.emptyIcon} />
//                 </div>
//                 <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
//                   No recent activity
//                 </p>
//                 <button onClick={() => navigate("/admin/users")} style={{
//                   padding: "6px 18px", borderRadius: 8,
//                   border: "1px solid rgba(167,139,250,0.25)",
//                   background: "rgba(167,139,250,0.08)", color: "#7c3aed",
//                   fontSize: 13, fontWeight: 600, cursor: "pointer",
//                   fontFamily: "'Poppins',sans-serif",
//                 }}>Manage Users →</button>
//               </div>
//             </div>

//             {/* Calendar */}
//             <MiniCalendar t={t} />
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;



































import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Layers,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// Attendance.jsx, the Golden Reference, which this page now visually
// matches).
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

// Shared, real-time greeting + clock strip — same component used by the
// Student and Trainer dashboards, so all three stay perfectly in sync.
import DashboardGreeting from "@/components/DashboardGreeting";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way Attendance.jsx's SectionCard / SectionHeader /
   ListRow / EmptyBlock are page-local but token-driven.
───────────────────────────────────────────────────────────────────────── */

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark";

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ t, icon: Icon, color, title, sub, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge icon={Icon} color={color} />
        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 11,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 0",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`,
          background: t.emptyBg,
        }}
      >
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <p
        style={{
          fontSize: 13,
          color: t.textMuted,
          fontWeight: FONT_WEIGHT.bold,
          fontFamily: FONT_FAMILY,
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function ViewAllButton({ t, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        fontWeight: FONT_WEIGHT.bold,
        letterSpacing: LETTER_SPACING.eyebrow,
        color: t.textMuted,
        background: t.pillBg,
        border: `1px solid ${t.pillBorder}`,
        borderRadius: RADIUS.pill,
        padding: "5px 14px",
        cursor: "pointer",
        fontFamily: FONT_FAMILY,
      }}
    >
      View all
    </button>
  );
}

function RecentRow({ t, color, Icon, title, sub, badge }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: RADIUS.chip,
        background: t.recentItemBg,
        border: `1px solid ${t.recentItemBorder}`,
      }}
    >
      <IconBadge icon={Icon} color={color} size={30} iconSize={14} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            margin: 0,
            fontFamily: FONT_FAMILY,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>{sub}</p>
      </div>
      {badge && (
        <span
          style={{
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            color: t.overdueText,
            background: t.overdueBg,
            border: `1px solid ${t.overdueBorder}`,
            padding: "3px 9px",
            borderRadius: RADIUS.pill,
            flexShrink: 0,
            fontFamily: FONT_FAMILY,
          }}
        >
          Pending
        </span>
      )}
    </div>
  );
}

function RecentPanel({ t, title, color, icon, items, loading, emptyText, viewRoute, navigate, renderItem }) {
  return (
    <SectionCard t={t}>
      <SectionHeader
        t={t}
        icon={icon}
        color={color}
        title={title}
        right={<ViewAllButton t={t} onClick={() => navigate(viewRoute)} />}
      />
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: RADIUS.chip, background: t.barBg, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "70%" }} />
                <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "45%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyBlock t={t} icon={icon} title={emptyText} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </SectionCard>
  );
}

/* ─── mini calendar — same behavior as before, restyled with tokens ─── */
function MiniCalendar({ t }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const prev = () =>
    setCurrent((c) => ({
      year: c.month === 0 ? c.year - 1 : c.year,
      month: c.month === 0 ? 11 : c.month - 1,
    }));
  const next = () =>
    setCurrent((c) => ({
      year: c.month === 11 ? c.year + 1 : c.year,
      month: c.month === 11 ? 0 : c.month + 1,
    }));
  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();
  const cells = Array(offset)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <SectionCard t={t} style={{ height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <IconBadge icon={CalendarDays} color={ACCENT_PURPLE.base} />
          <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.bold, fontSize: 13, color: t.text }}>
            {monthNames[current.month]} {current.year}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[prev, next].map((fn, i) => (
            <button
              key={i}
              onClick={fn}
              style={{
                width: 28,
                height: 28,
                borderRadius: RADIUS.chip,
                border: `1px solid ${t.navBtnBorder}`,
                cursor: "pointer",
                background: t.navBtnBg,
                color: t.navBtnColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i === 0 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {dayNames.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              color: t.calDayHeader,
              letterSpacing: LETTER_SPACING.eyebrow,
              paddingBottom: 6,
              fontFamily: FONT_FAMILY,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: RADIUS.chip,
              fontSize: 12,
              fontWeight: isToday(d) ? FONT_WEIGHT.bold : FONT_WEIGHT.medium,
              cursor: d ? "pointer" : "default",
              background: isToday(d) ? ACCENT_PURPLE.base : "transparent",
              color: isToday(d) ? "#ffffff" : d ? t.calDayText : "transparent",
              fontFamily: FONT_FAMILY,
              transition: "background 0.15s",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: `1px solid ${t.calFooterBdr}`,
          fontSize: 11,
          color: t.calFooter,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: LETTER_SPACING.eyebrow,
        }}
      >
        NO EVENTS SCHEDULED
      </div>
    </SectionCard>
  );
}

/* ══ MAIN ══ */
const AdminDashboard = () => {
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────────────────
     THEME DETECTION — FIXED
     App.jsx only ever toggles the "dark" class on <html>:
        classList.toggle("dark", theme === "dark")
     It NEVER adds a "light" class. So the old code, which
     fell back to `return true` (dark) whenever neither "dark"
     nor "light" was found, meant Light Mode (which just
     REMOVES the "dark" class) always fell through to the
     dark-default and the dashboard stayed dark.

     Fix: treat "dark" class as the single source of truth.
     No class => light. No confusing fallback needed.
     ───────────────────────────────────────────────────────── */
  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    // sync once on mount in case theme changed before this component mounted
    setDark(isDark());

    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = dark ? T.dark : T.light;

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalUsers: 0,
    activeCourses: 0,
    pendingApprovals: 0,
    revenue: 0,
    trainers: 0,
    students: 0,
    batches: 0,
    admins: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentApprovals, setRecentApprovals] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setCounts({
          totalUsers: 0,
          activeCourses: 0,
          pendingApprovals: 0,
          revenue: 0,
          trainers: 0,
          students: 0,
          batches: 0,
          admins: 0,
        });
        setRecentUsers([]);
        setRecentCourses([]);
        setRecentApprovals([]);
      } catch (e) {
        console.error("Admin dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fmt = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  };

  // ── stat cards — rendered through the shared design-system <StatCard>,
  // colorKey drawn from the same blue/green/amber/red/purple set the
  // Trainer/Attendance page uses, so this page inherits identical
  // stat-card visuals instead of the page's old bespoke gradient tiles.
  const stats = [
    { label: "Total Users", numericValue: counts.totalUsers, icon: Users, colorKey: "blue", route: "/admin/users", change: "All registered accounts" },
    { label: "Active Courses", numericValue: counts.activeCourses, icon: BookOpen, colorKey: "green", route: "/admin/courses", change: "Currently running" },
    { label: "Pending Approvals", numericValue: counts.pendingApprovals, icon: Clock, colorKey: "amber", route: "/admin/approvals", change: "Awaiting review" },
    { label: "Revenue (MTD)", numericValue: counts.revenue, icon: DollarSign, colorKey: "purple", route: "/admin/revenue", change: "This month, in USD" },
    { label: "Total Trainers", numericValue: counts.trainers, icon: UserCheck, colorKey: "red", route: "/admin/trainers", change: "Active on platform" },
    { label: "Total Students", numericValue: counts.students, icon: GraduationCap, colorKey: "blue", route: "/admin/students", change: "Enrolled learners" },
    { label: "Active Batches", numericValue: counts.batches, icon: Layers, colorKey: "amber", route: "/admin/batches", change: "Running now" },
    { label: "Admins", numericValue: counts.admins, icon: ShieldCheck, colorKey: "purple", route: "/admin/admins", change: "Platform administrators" },
  ];

  const keyReports = [
    { title: "User Growth", value: "0%", icon: TrendingUp, color: "#22d3ee" },
    { title: "Revenue Trend", value: "$0K", icon: DollarSign, color: ACCENT_PURPLE.base },
    { title: "Course Performance", value: "0%", icon: BookOpen, color: "#16a34a" },
    { title: "Active Sessions", value: "0", icon: Calendar, color: "#f59e0b" },
  ];

  const pill = {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: LETTER_SPACING.eyebrowWide,
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: RADIUS.pill,
    background: t.pillBg,
    border: `1px solid ${t.pillBorder}`,
    color: t.pillText,
    fontFamily: FONT_FAMILY,
  };

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:560px){
          .admin-hero-badges{width:100%;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Attendance/Trainer Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FONT_FAMILY,
              }}
            >
              Platform Overview
            </span>
          </div>
          <DashboardGreeting t={t} />
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Manage users, courses &amp; platform performance at a glance
          </p>
        </div>

        <div className="hero-badges admin-hero-badges">
          {!loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: RADIUS.chip,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
                flexWrap: "wrap",
              }}
            >
              <span>{counts.totalUsers} users</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{counts.activeCourses} courses</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              {counts.pendingApprovals > 0 ? (
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#fb923c" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block" }} />
                  {counts.pendingApprovals} pending
                </span>
              ) : (
                <span style={{ color: t.liveText }}>All clear ✓</span>
              )}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ 8 STAT CARDS — shared <StatCard>, via the shared .stat-grid class ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} onClick={() => navigate(s.route)} style={{ cursor: "pointer" }}>
            <StatCard stat={s} index={i} loading={loading} mode={dark ? "dark" : "light"} />
          </div>
        ))}
      </div>

      {/* ═══ RECENT PANELS ROW ═══ */}
      <div className="dash-row-grid" style={{ marginBottom: 14 }}>
        <RecentPanel
          t={t}
          title="Recent Users"
          color="#3b82f6"
          icon={Users}
          items={recentUsers}
          loading={loading}
          emptyText="No users registered yet"
          viewRoute="/admin/users"
          navigate={navigate}
          renderItem={(u, i) => (
            <RecentRow
              key={i}
              t={t}
              color="#3b82f6"
              Icon={Users}
              title={u.name || u.email || "Unknown User"}
              sub={u.role || fmt(u.createdAt)}
            />
          )}
        />

        <RecentPanel
          t={t}
          title="Recent Courses"
          color="#16a34a"
          icon={BookOpen}
          items={recentCourses}
          loading={loading}
          emptyText="No courses created yet"
          viewRoute="/admin/courses"
          navigate={navigate}
          renderItem={(c, i) => (
            <RecentRow
              key={i}
              t={t}
              color="#16a34a"
              Icon={BookOpen}
              title={c.title || c.courseName || "Untitled"}
              sub={fmt(c.createdAt)}
            />
          )}
        />

        <RecentPanel
          t={t}
          title="Pending Approvals"
          color="#f59e0b"
          icon={Clock}
          items={recentApprovals}
          loading={loading}
          emptyText="No pending approvals"
          viewRoute="/admin/approvals"
          navigate={navigate}
          renderItem={(a, i) => (
            <RecentRow
              key={i}
              t={t}
              color="#f59e0b"
              Icon={Clock}
              title={a.name || a.title || "Approval Request"}
              sub={fmt(a.createdAt)}
              badge={true}
            />
          )}
        />
      </div>

      {/* ═══ BOTTOM ROW ═══ */}
      <div className="dash-row-grid">
        {/* Key Reports */}
        <SectionCard t={t}>
          <SectionHeader t={t} icon={BarChart3} color="#22d3ee" title="Key Reports" right={<span style={pill}>Platform</span>} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {keyReports.map((item) => {
              const Ic = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    borderRadius: RADIUS.chip,
                    background: t.recentItemBg,
                    border: `1px solid ${t.recentItemBorder}`,
                  }}
                >
                  <IconBadge icon={Ic} color={item.color} size={30} iconSize={14} />
                  <div>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>{item.title}</p>
                    <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate("/admin/reports")}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "10px",
              borderRadius: RADIUS.button,
              border: `1px solid ${t.border}`,
              background: t.pillBg,
              color: ACCENT_PURPLE.base,
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
            }}
          >
            View Full Reports →
          </button>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard t={t}>
          <SectionHeader t={t} icon={Activity} color={ACCENT_PURPLE.base} title="Recent Activity" right={<span style={pill}>Today</span>} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 12 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1.5px dashed ${t.emptyBorder}`,
                background: t.emptyBg,
              }}
            >
              <Activity size={20} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 13, color: t.textMuted, fontWeight: FONT_WEIGHT.bold, fontFamily: FONT_FAMILY, margin: 0 }}>No recent activity</p>
            <button
              onClick={() => navigate("/admin/users")}
              style={{
                padding: "8px 18px",
                borderRadius: RADIUS.button,
                border: `1px solid ${t.border}`,
                background: t.pillBg,
                color: ACCENT_PURPLE.base,
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                cursor: "pointer",
                fontFamily: FONT_FAMILY,
              }}
            >
              Manage Users →
            </button>
          </div>
        </SectionCard>

        {/* Calendar */}
        <MiniCalendar t={t} />
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;