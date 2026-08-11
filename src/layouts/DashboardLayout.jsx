// // for github //
// import {
//   Bell,
//   X,
//   Video,
//   FileText,
//   ClipboardCheck,
//   BookOpen,
//   ClipboardList,
//   GraduationCap,
//   ClipboardEdit,
//   Building2,
//   MessageSquare,
//   Radio,
//   CheckCircle2,
//   HelpCircle,
//   Send,
//   Menu,
//   Sun,
//   Moon,
//   User,
//   LogOut,
// } from "lucide-react";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useLocation, useNavigate, Outlet } from "react-router-dom";
// import LiveMeetingRouteSync from "@/components/live/LiveMeetingRouteSync";
// import FloatingMeetingWidget from "@/components/live/FloatingMeetingWidget";
// import {
//   onForegroundMessage,
//   registerFcmToken,
// } from "../services/firebaseService";
// import { useTrainerTheme } from "../Trainer/trainerTheme";
// import {
//   connectWebSocket,
//   disconnectWebSocket,
// } from "../services/notificationService";
// import userService from "../services/userService";
// import auth from "../auth";
// import TopNavbar from "../components/TopNavbar";
// // ── Notification type → REAL icon map (no more emoji placeholders) ──
// const TYPE_ICON = {
//   NEW_VIDEO: Video,
//   NEW_FILE: FileText,
//   NEW_ASSESSMENT: ClipboardCheck,
//   NEW_CONTENT: BookOpen,
//   NEW_QUIZ: ClipboardList,
//   NEW_COURSE: GraduationCap,
//   NEW_ASSIGNMENT: ClipboardEdit,
//   BATCH_UPDATE: Building2,
//   BATCH_ASSIGNED: Building2,
//   NEW_CHAT: MessageSquare,
//   CHAT_MESSAGE: MessageSquare,
//   LIVE_SESSION: Radio,
//   LIVE_SESSION_STARTED: Radio,
//   ATTENDANCE_MARKED: CheckCircle2,
//   DOUBT_RAISED: HelpCircle,
//   ASSIGNMENT_SUBMIT: Send,
//   DEFAULT: Bell,
// };
// const getIcon = (type) => TYPE_ICON[type] ?? TYPE_ICON.DEFAULT;

// // ── Role label for the profile dropdown — mirrors TopNavbar's roleConfig ──
// const ROLE_LABELS = {
//   STUDENT: "Student Portal",
//   TRAINER: "Trainer Panel",
//   ADMIN: "Manager Panel",
//   BUSINESS: "Tenant Admin Panel",
// };

// // ── Shared AudioContext — created once, resumed on interaction ─
// let _audioCtx = null;
// const getAudioCtx = () => {
//   if (!_audioCtx || _audioCtx.state === "closed") {
//     _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//   }
//   return _audioCtx;
// };
// const unlockAudio = () => {
//   try {
//     const ctx = getAudioCtx();
//     if (ctx.state === "suspended") ctx.resume();
//   } catch (_) {}
// };
// if (typeof window !== "undefined") {
//   window.addEventListener("click", unlockAudio, { passive: true });
//   window.addEventListener("keydown", unlockAudio, { passive: true });
//   window.addEventListener("touchstart", unlockAudio, { passive: true });
// }

// // ── Sound ────────────────────────────────────────────────────
// const playSound = () => {
//   try {
//     const ctx = getAudioCtx();
//     const doPlay = () => {
//       const t = ctx.currentTime;
//       const o1 = ctx.createOscillator(),
//         g1 = ctx.createGain();
//       o1.connect(g1);
//       g1.connect(ctx.destination);
//       o1.type = "sine";
//       o1.frequency.setValueAtTime(880, t);
//       g1.gain.setValueAtTime(0.6, t);
//       g1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
//       o1.start(t);
//       o1.stop(t + 0.22);

//       const o2 = ctx.createOscillator(),
//         g2 = ctx.createGain();
//       o2.connect(g2);
//       g2.connect(ctx.destination);
//       o2.type = "sine";
//       o2.frequency.setValueAtTime(1100, t + 0.25);
//       g2.gain.setValueAtTime(0.5, t + 0.25);
//       g2.gain.exponentialRampToValueAtTime(0.001, t + 0.48);
//       o2.start(t + 0.25);
//       o2.stop(t + 0.48);
//     };
//     if (ctx.state === "suspended") ctx.resume().then(doPlay);
//     else doPlay();
//   } catch (e) {
//     console.warn("Sound error:", e);
//   }
// };

// // ─────────────────────────────────────────────────────────────
// // Shared responsive CSS for this file only — scoped under .dl-root
// // so it can't leak into / clash with anything else on the page.
// // Layout-affecting rules (padding, gaps, widths, flex-wrap) live
// // here so media queries can win; colors that depend on the isDark
// // flag stay as inline styles below, computed in JS as before.
// // ─────────────────────────────────────────────────────────────
// const DashboardResponsiveStyles = () => (
//   <style>{`
//     /* FIX (Bug 2): global reset so the OUTER document never scrolls.
//        Without this, the <html>/<body> could scroll independently of
//        .dl-main, which is what produced the "extra gap below the
//        sticky header" feeling — you were effectively looking at two
//        nested scroll containers fighting each other. Now there is
//        exactly one scroll container (.dl-main); the header stays
//        visually pinned for free since it's a sibling outside it. */
//     html, body, #root {
//       height: 100%;
//       margin: 0;
//       padding: 0;
//       overflow: hidden;
//     }

//     .dl-root, .dl-root * { box-sizing: border-box; }
//     .dl-root { overflow-x: hidden; }
//     .dl-shell { min-width: 0; }

//     .dl-aside {
//       flex-shrink: 0;
//       height: 100%;
//       overflow-y: auto;
//       overflow-x: visible;
//       max-width: 100vw;
//       transition: width .28s ease, margin .28s ease, transform .28s ease;
//     }

//     .dl-main-col {
//       min-width: 0;
//       transition: width .28s ease, margin .28s ease, transform .28s ease;
//     }

//     /* FIX (Bug 2): smooth, contained scrolling on the single scroll
//        container. overscroll-behavior: contain stops scroll-chaining
//        past the top/bottom edge (another source of "janky" feeling
//        scroll), and margin/padding are pinned to 0 so no stray
//        top-margin can create a gap directly under the sticky header. */
//     .dl-main {
//       min-width: 0;
//       margin: 0;
//       padding: 0;
//       scroll-behavior: smooth;
//       overscroll-behavior: contain;
//       -webkit-overflow-scrolling: touch;
//     }

//     .dl-header {
//       height: 64px;
//       padding: 0 24px;
//       gap: 12px;
//     }
//     .dl-topbar-slot { gap: 8px; }
//     .dl-right-cluster { gap: 10px; }
//     .dl-avatar { width: 36px; height: 36px; font-size: 14px; }
//     .dl-bell { width: 38px; height: 38px; }

//     /* ── Sidebar restore control (hamburger) ──
//        Sits in the header when the sidebar is hidden, and doubles
//        as a floating pill on desktop / a fixed pill on mobile so
//        it's always reachable regardless of scroll position. */
//     .dl-restore-btn {
//       display: none;
//       align-items: center;
//       justify-content: center;
//       width: 40px;
//       height: 40px;
//       border-radius: 10px;
//       cursor: pointer;
//       flex-shrink: 0;
//       transition: all 0.15s;
//     }
//     .dl-restore-btn[data-show="true"] { display: flex; }

//     .dl-toast-stack {
//       top: 24px;
//       right: 24px;
//       max-width: 360px;
//     }
//     .dl-banner {
//       bottom: 24px;
//       padding: 13px 18px;
//       white-space: nowrap;
//     }

//     /* ---- Large laptop / small desktop ---- */
//     @media (max-width: 1439px) {
//       .dl-toast-stack { max-width: 340px; }
//     }

//     /* ---- Laptop ---- */
//     @media (max-width: 1199px) {
//       .dl-header { padding: 0 20px; }
//     }

//     /* ---- Tablet / iPad / iPad Air ---- */
//     @media (max-width: 1023px) {
//       .dl-header { height: 60px; padding: 0 16px; gap: 8px; }
//       .dl-toast-stack { top: 16px; right: 16px; max-width: min(320px, calc(100vw - 32px)); }
//       .dl-banner { bottom: 16px; max-width: calc(100vw - 32px); }
//     }

//     /* ---- iPad Mini / small tablet / large phone landscape ---- */
//     @media (max-width: 820px) {
//       .dl-header { gap: 6px; }
//       .dl-right-cluster { gap: 8px; }
//     }

//     /* ---- Mobile: phones, iPhone SE and up ---- */
//     @media (max-width: 640px) {
//       .dl-header { height: 56px; padding: 0 12px; }
//       .dl-avatar { width: 32px; height: 32px; font-size: 13px; }
//       .dl-bell { width: 34px; height: 34px; }
//       .dl-topbar-slot { flex-wrap: wrap; }

//       .dl-toast-stack {
//         top: 12px;
//         left: 12px;
//         right: 12px;
//         max-width: none;
//         align-items: stretch;
//       }

//       .dl-banner {
//         left: 12px;
//         right: 12px;
//         bottom: 12px;
//         transform: none;
//         max-width: none;
//         width: auto;
//         white-space: normal;
//         flex-wrap: wrap;
//         row-gap: 8px;
//       }
//     }

//     /* ---- iPhone SE / very small phones ---- */
//     @media (max-width: 375px) {
//       .dl-header { padding: 0 10px; }
//       .dl-right-cluster { gap: 6px; }
//     }

//     /* ---- Respect iOS safe areas (notch / home indicator) ---- */
//     @supports (padding: max(0px)) {
//       .dl-header { padding-left: max(24px, env(safe-area-inset-left)); padding-right: max(24px, env(safe-area-inset-right)); }
//       @media (max-width: 1023px) {
//         .dl-header { padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); }
//       }
//       @media (max-width: 640px) {
//         .dl-header { padding-left: max(12px, env(safe-area-inset-left)); padding-right: max(12px, env(safe-area-inset-right)); }
//       }
//       .dl-banner { margin-bottom: env(safe-area-inset-bottom); }
//     }
//   `}</style>
// );

// // ─────────────────────────────────────────────────────────────
// // Notification permission banner
// // ─────────────────────────────────────────────────────────────
// const NotificationBanner = () => {
//   const [show, setShow] = useState(false);
//   const [asking, setAsking] = useState(false);

//   useEffect(() => {
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
//     localStorage.setItem("notif_banner_dismissed", "true");
//     setShow(false);
//   };

//   if (!show) return null;

//   return (
//     <div
//       className="dl-banner"
//       style={{
//         position: "fixed",
//         left: "50%",
//         transform: "translateX(-50%)",
//         background: "#1e293b",
//         color: "#f8fafc",
//         borderRadius: 14,
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//         boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
//         border: "1px solid rgba(255,255,255,0.08)",
//         zIndex: 9998,
//         fontFamily: "DM Sans, sans-serif",
//         fontSize: "0.86rem",
//         animation: "bnrIn 0.35s ease",
//       }}
//     >
//       <style>{`
//         @keyframes bnrIn {
//           from { opacity: 0; transform: translateX(-50%) translateY(16px); }
//           to   { opacity: 1; transform: translateX(-50%) translateY(0); }
//         }
//         @media (max-width: 640px) {
//           @keyframes bnrIn {
//             from { opacity: 0; transform: translateY(16px); }
//             to   { opacity: 1; transform: translateY(0); }
//           }
//         }
//       `}</style>
//       <span
//         style={{
//           width: 26,
//           height: 26,
//           borderRadius: 8,
//           background: "rgba(249,115,22,0.15)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexShrink: 0,
//         }}
//       >
//         <Bell size={15} color="#F97316" />
//       </span>
//       <span style={{ color: "#cbd5e1", minWidth: 0 }}>
//         Enable notifications to get video &amp; course alerts
//       </span>
//       <button
//         onClick={handleEnable}
//         disabled={asking}
//         style={{
//           background: "#F97316",
//           color: "#fff",
//           border: "none",
//           borderRadius: 8,
//           padding: "7px 16px",
//           cursor: asking ? "not-allowed" : "pointer",
//           fontWeight: 700,
//           fontSize: "0.82rem",
//           opacity: asking ? 0.7 : 1,
//           fontFamily: "inherit",
//           boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
//           flexShrink: 0,
//         }}
//       >
//         {asking ? "Enabling…" : "Enable"}
//       </button>
//       <button
//         onClick={handleDismiss}
//         style={{
//           background: "none",
//           border: "none",
//           color: "#64748b",
//           cursor: "pointer",
//           display: "flex",
//           alignItems: "center",
//           padding: 0,
//           flexShrink: 0,
//         }}
//       >
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Toast stack
// // ─────────────────────────────────────────────────────────────
// const ToastStack = ({ toasts, onDismiss, onNavigate }) => (
//   <div
//     className="dl-toast-stack"
//     style={{
//       position: "fixed",
//       zIndex: 9999,
//       display: "flex",
//       flexDirection: "column",
//       gap: 10,
//       alignItems: "flex-end",
//     }}
//   >
//     {toasts.map((t) => {
//       const Icon = getIcon(t.type);
//       return (
//         <div
//           key={t.id}
//           onClick={() => onNavigate(t)}
//           style={{
//             background: "rgba(255,255,255,0.98)",
//             color: "#0f172a",
//             padding: "12px 16px",
//             borderRadius: 14,
//             fontSize: 13,
//             fontWeight: 600,
//             boxShadow:
//               "0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
//             border: "1px solid rgba(226,232,240,0.9)",
//             display: "flex",
//             alignItems: "flex-start",
//             gap: 10,
//             animation: "slideDown 0.3s ease",
//             cursor: "pointer",
//             width: "100%",
//             backdropFilter: "blur(12px)",
//           }}
//         >
//           <div
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 10,
//               flexShrink: 0,
//               background: "rgba(249,115,22,0.1)",
//               border: "1px solid rgba(249,115,22,0.2)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Icon size={17} color="#F97316" />
//           </div>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div
//               style={{
//                 fontWeight: 700,
//                 marginBottom: 2,
//                 fontSize: 13,
//                 color: "#0f172a",
//               }}
//             >
//               {t.title}
//             </div>
//             <div
//               style={{
//                 color: "#64748b",
//                 fontSize: 12,
//                 fontWeight: 400,
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {t.message}
//             </div>
//           </div>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onDismiss(t.id);
//             }}
//             style={{
//               background: "none",
//               border: "none",
//               color: "#94a3b8",
//               cursor: "pointer",
//               padding: 0,
//               flexShrink: 0,
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <X size={14} />
//           </button>
//         </div>
//       );
//     })}
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
//   const { t } = useTrainerTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const base = "/" + location.pathname.split("/")[1];

//   const [toasts, setToasts] = useState([]);
//   const toastCounterRef = useRef(0);

//   const [isDark, setIsDark] = useState(
//     () =>
//       typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark"),
//   );

//   useEffect(() => {
//     const obs = new MutationObserver(() => {
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//           document.documentElement.getAttribute("data-theme") === "dark",
//       );
//     });
//     obs.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class", "data-theme"],
//     });
//     return () => obs.disconnect();
//   }, []);

//   // ✅ Theme toggle — flips the document class; the MutationObserver
//   // above picks it up and syncs isDark, so every themed bit in this
//   // header (and anywhere else watching document.documentElement)
//   // updates together, same as Sidebar.jsx's toggle used to do.
//   const toggleTheme = () => {
//     const next = !document.documentElement.classList.contains("dark");
//     document.documentElement.classList.toggle("dark", next);
//   };

// const userEmail = localStorage.getItem("email");
//   const userRole = location.pathname.startsWith("/student")
//     ? "STUDENT"
//     : location.pathname.startsWith("/trainer")
//       ? "TRAINER"
//       : location.pathname.startsWith("/admin")
//         ? "ADMIN"
//         : "BUSINESS";

//   const roleLabel = ROLE_LABELS[userRole] || "Portal";

//   const notifPath = `${base}/notifications`;

//   // ✅ Avatar initial + full name — fetched fresh from API, cached in localStorage
//   const [userName, setUserName] = useState(
//     localStorage.getItem("userName") || "User",
//   );
//   const [userInitial, setUserInitial] = useState(
//     (localStorage.getItem("userName") || "U").trim().charAt(0).toUpperCase() ||
//       "U",
//   );

//   useEffect(() => {
//     let cancelled = false;
//     userService
//       .getMyProfile()
//       .then((res) => {
//         if (cancelled) return;
//         const name = res.data?.displayName || res.data?.name || "User";
//         localStorage.setItem("userName", name);
//         setUserName(name);
//         setUserInitial(name.trim().charAt(0).toUpperCase() || "U");
//       })
//       .catch(() => {
//         // keep whatever is cached in localStorage if the call fails
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [location.pathname]);

//   const handleLogout = () => {
//     auth.logout();
//     navigate("/login");
//   };

//   const addToast = useCallback((title, message, type) => {
//     playSound();
//     const id = ++toastCounterRef.current;
//     setToasts((prev) => [...prev, { id, title, message, type }]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((tt) => tt.id !== id));
//     }, 5000);
//   }, []);

//   const dismissToast = (id) =>
//     setToasts((prev) => prev.filter((tt) => tt.id !== id));
//   const handleToastClick = (toast) => {
//     dismissToast(toast.id);
//     navigate(notifPath);
//   };

//   // ── Single WebSocket for whole app ────────────────────────
//   useEffect(() => {
//     if (!userEmail) return;
//     connectWebSocket({
//       userEmail,
//       userRole,
//       onMessage: (notif) => {
//         addToast(notif.title, notif.message, notif.type);
//         window.dispatchEvent(
//           new CustomEvent("lms:notification", { detail: notif }),
//         );
//       },
//     });
//     return () => disconnectWebSocket();
//   }, [userEmail, userRole, addToast]);

//   // ── FCM foreground — tab open but minimized ───────────────
//   useEffect(() => {
//     onForegroundMessage((payload) => {
//       const title =
//         payload.notification?.title ||
//         payload.data?.title ||
//         "New Notification";
//       const body = payload.notification?.body || payload.data?.body || "";
//       const type = payload.data?.type || "DEFAULT";
//       const sender = payload.data?.senderEmail || "";
//       const current = (localStorage.getItem("email") || "").toLowerCase();
//       if (type === "NEW_CHAT" && sender && sender.toLowerCase() === current) {
//         console.log("⏭️ Skipping self FCM notification");
//         return;
//       }
//       addToast(title, body, type);
//     });
//   }, [addToast]);

//   const headerStyle = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     background: isDark ? "rgba(10,10,10,0.92)" : "rgba(255,255,255,0.88)",
//     backdropFilter: "blur(14px)",
//     WebkitBackdropFilter: "blur(14px)",
//     borderBottom: isDark
//       ? "1px solid rgba(255,255,255,0.06)"
//       : "1px solid rgba(226,232,240,0.85)",
//     boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.05)",
//     position: "sticky",
//     top: 0,
//     zIndex: 20,
//     flexShrink: 0,
//   };

//   return (
//     <div
//       className="dl-root"
//       style={{
//         height: "100vh",
//         background: isDark ? "#0a0a0a" : "#F8F9FB",
//         color: isDark ? "#ffffff" : "#0f172a",
//       }}
//     >
//       <DashboardResponsiveStyles />

//      <div
//         className="dl-shell"
//         style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
//       >
//         {/* ═══ HEADER — logo + role-tab dropdown nav (replaces Sidebar) + live-slot + theme/bell/profile ═══ */}
//         <div className="dl-header" style={headerStyle}>
//           <TopNavbar isDark={isDark} />

//           <div
//             id="lr-topbar-slot"
//             className="dl-topbar-slot"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               flexShrink: 0,
//               minWidth: 0,
//             }}
//           />

//           {/* Right: theme toggle + bell + profile dropdown */}
//           <div
//             className="dl-right-cluster"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginLeft: "auto",
//               flexShrink: 0,
//             }}
//           >
//             <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />

//             <NotificationBellSlot
//               navigate={navigate}
//               notifPath={notifPath}
//               isDark={isDark}
//             />

//             <ProfileMenu
//               isDark={isDark}
//               userName={userName}
//               userInitial={userInitial}
//               roleLabel={roleLabel}
//               onProfile={() => navigate(`${base}/profile`)}
//               onLogout={handleLogout}
//             />
//           </div>
//         </div>

//         {/* ═══ MAIN — the ONLY scrollable region (see DashboardResponsiveStyles
//              for the global html/body reset that makes this true) ═══ */}
//         <main
//           className="dl-main"
//           style={{ flex: 1, overflowY: "auto", background: t.pageBg }}
//         >
//           <Outlet />
//         </main>
//       </div>

//       <FloatingMeetingWidget />
//       <LiveMeetingRouteSync />

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
// // Theme toggle button — sun/moon, same footprint as the bell
// // ─────────────────────────────────────────────────────────────
// const ThemeToggleButton = ({ isDark, onToggle }) => {
//   const [hov, setHov] = useState(false);

//   return (
//     <button
//       className="dl-bell"
//       onClick={onToggle}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       title={isDark ? "Switch to light mode" : "Switch to dark mode"}
//       aria-label="Toggle theme"
//       style={{
//         position: "relative",
//         borderRadius: 10,
//         background: hov
//           ? isDark
//             ? "rgba(255,255,255,0.06)"
//             : "rgba(241,245,249,0.9)"
//           : "transparent",
//         border: isDark
//           ? "1px solid rgba(255,255,255,0.07)"
//           : "1px solid rgba(226,232,240,0.8)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: "pointer",
//         transition: "all 0.2s",
//         boxShadow: hov && !isDark ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
//         flexShrink: 0,
//       }}
//     >
//       {isDark ? <Sun size={17} color="#3b82f6" /> : <Moon size={17} color="#64748b" />}
//     </button>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Profile dropdown — avatar trigger, name + role header,
// // Profile + Logout actions. Matches Super Admin's panel.
// // ─────────────────────────────────────────────────────────────
// const PROFILE_MENU_CSS = `
//   .dl-profile-wrap { position: relative; flex-shrink: 0; }

//   .dl-profile-dropdown {
//     position: absolute; top: calc(100% + 10px); right: 0; z-index: 250;
//     min-width: 210px; border-radius: 12px; padding: 6px;
//     display: flex; flex-direction: column; gap: 2px;
//     animation: dlProfIn .15s ease;
//   }
//   [data-dark="false"] .dl-profile-dropdown { background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 16px 40px rgba(0,0,0,0.14); }
//   [data-dark="true"]  .dl-profile-dropdown { background: #18181b; border: 1px solid #27272a; box-shadow: 0 16px 40px rgba(0,0,0,0.45); }
//   @keyframes dlProfIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

//   .dl-profile-header { display: flex; align-items: center; gap: 10px; padding: 8px 8px 10px; }
//   .dl-profile-avatar {
//     width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
//     background: linear-gradient(135deg, #F97316, #EA580C);
//     color: #fff; font-weight: 700; font-size: 13px;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .dl-profile-name {
//     margin: 0; font-size: 13px; font-weight: 700;
//     overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//   }
//   [data-dark="false"] .dl-profile-name { color: #0f172a; }
//   [data-dark="true"]  .dl-profile-name { color: #ffffff; }
//   .dl-profile-role {
//     margin: 2px 0 0; font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em;
//     overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//   }
//   [data-dark="false"] .dl-profile-role { color: #94a3b8; }
//   [data-dark="true"]  .dl-profile-role { color: #71717a; }

//   .dl-profile-divider { height: 1px; margin: 2px 6px 4px; }
//   [data-dark="false"] .dl-profile-divider { background: #e2e8f0; }
//   [data-dark="true"]  .dl-profile-divider { background: #27272a; }

//   .dl-profile-item {
//     display: flex; align-items: center; gap: 9px;
//     width: 100%; padding: 8px 10px; border-radius: 8px; border: none;
//     background: transparent; cursor: pointer; text-align: left;
//     font-size: 12.5px; font-weight: 500; font-family: inherit;
//     transition: all .12s;
//   }
//   [data-dark="false"] .dl-profile-item { color: #374151; }
//   [data-dark="true"]  .dl-profile-item { color: #d4d4d8; }
//   [data-dark="false"] .dl-profile-item:hover { background: #f1f5f9; }
//   [data-dark="true"]  .dl-profile-item:hover { background: rgba(255,255,255,0.06); }

//   [data-dark="false"] .dl-profile-item.danger { color: #dc2626; }
//   [data-dark="true"]  .dl-profile-item.danger { color: #f87171; }
//   [data-dark="false"] .dl-profile-item.danger:hover { background: #fee2e2; }
//   [data-dark="true"]  .dl-profile-item.danger:hover { background: rgba(239,68,68,0.14); }
// `;

// const ProfileMenu = ({ isDark, userName, userInitial, roleLabel, onProfile, onLogout }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const onClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, []);

//   return (
//     <div className="dl-profile-wrap" ref={ref} data-dark={String(!!isDark)}>
//       <style>{PROFILE_MENU_CSS}</style>

//       <button
//         className="dl-avatar"
//         onClick={() => setOpen((p) => !p)}
//         style={{
//           borderRadius: "50%",
//           background: "linear-gradient(135deg, #F97316, #EA580C)",
//           color: "#fff",
//           fontWeight: 700,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           border: "2px solid rgba(249,115,22,0.3)",
//           boxShadow: "0 2px 10px rgba(249,115,22,0.35)",
//           cursor: "pointer",
//           fontFamily: "inherit",
//           transition: "opacity 0.2s",
//           flexShrink: 0,
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
//         onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//       >
//         {userInitial}
//       </button>

//       {open && (
//         <div className="dl-profile-dropdown">
//           <div className="dl-profile-header">
//             <div className="dl-profile-avatar">{userInitial}</div>
//             <div style={{ minWidth: 0 }}>
//               <p className="dl-profile-name">{userName}</p>
//               <p className="dl-profile-role">{roleLabel.toUpperCase()}</p>
//             </div>
//           </div>

//           <div className="dl-profile-divider" />

//           <button
//             type="button"
//             className="dl-profile-item"
//             onClick={() => {
//               setOpen(false);
//               onProfile();
//             }}
//           >
//             <User size={15} style={{ flexShrink: 0 }} />
//             <span>Profile</span>
//           </button>

//           <button
//             type="button"
//             className="dl-profile-item danger"
//             onClick={() => {
//               setOpen(false);
//               onLogout();
//             }}
//           >
//             <LogOut size={15} style={{ flexShrink: 0 }} />
//             <span>Logout</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Notification bell slot — listens to window event, no WebSocket
// // ─────────────────────────────────────────────────────────────
// const NotificationBellSlot = ({ navigate, notifPath, isDark }) => {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [hov, setHov] = useState(false);

//   useEffect(() => {
//     import("../services/notificationService").then(({ fetchUnreadCount }) => {
//       fetchUnreadCount()
//         .then(setUnreadCount)
//         .catch(() => {});
//     });
//   }, []);

//   useEffect(() => {
//     const handler = () => setUnreadCount((c) => c + 1);
//     window.addEventListener("lms:notification", handler);
//     return () => window.removeEventListener("lms:notification", handler);
//   }, []);

//   return (
//     <button
//       className="dl-bell"
//       onClick={() => {
//         setUnreadCount(0);
//         navigate(notifPath);
//       }}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         position: "relative",
//         borderRadius: 10,
//         background: hov
//           ? isDark
//             ? "rgba(255,255,255,0.06)"
//             : "rgba(241,245,249,0.9)"
//           : "transparent",
//         border: isDark
//           ? "1px solid rgba(255,255,255,0.07)"
//           : "1px solid rgba(226,232,240,0.8)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: "pointer",
//         transition: "all 0.2s",
//         boxShadow: hov && !isDark ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
//         flexShrink: 0,
//       }}
//     >
//       <Bell
//         size={18}
//         color={isDark ? "#94a3b8" : "#64748b"}
//         style={{
//           transition: "transform 0.2s",
//           transform: hov ? "rotate(12deg)" : "none",
//         }}
//       />
//       {unreadCount > 0 && (
//         <span
//           style={{
//             position: "absolute",
//             top: -3,
//             right: -3,
//             minWidth: 18,
//             height: 18,
//             borderRadius: 999,
//             background: "#F97316",
//             color: "#fff",
//             fontSize: 9,
//             fontWeight: 700,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 4px",
//             boxShadow: "0 2px 6px rgba(249,115,22,0.45)",
//             border: isDark ? "2px solid #0a0a0a" : "2px solid #fff",
//             fontFamily: "inherit",
//           }}
//         >
//           {unreadCount > 99 ? "99+" : unreadCount}
//         </span>
//       )}
//     </button>
//   );
// };

// export default DashboardLayout;




























// for github //
import {
  Bell,
  X,
  Video,
  FileText,
  ClipboardCheck,
  BookOpen,
  ClipboardList,
  GraduationCap,
  ClipboardEdit,
  Building2,
  MessageSquare,
  Radio,
  CheckCircle2,
  HelpCircle,
  Send,
  Menu,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import LiveMeetingRouteSync from "@/components/live/LiveMeetingRouteSync";
import FloatingMeetingWidget from "@/components/live/FloatingMeetingWidget";
import ChatWidgetButton from "../Student/ChatWidgetButton";
import {
  onForegroundMessage,
  registerFcmToken,
} from "../services/firebaseService";
import { useTrainerTheme } from "../Trainer/trainerTheme";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/notificationService";
import userService from "../services/userService";
import auth from "../auth";
import TopNavbar from "../components/TopNavbar";
// ── Notification type → REAL icon map (no more emoji placeholders) ──
const TYPE_ICON = {
  NEW_VIDEO: Video,
  NEW_FILE: FileText,
  NEW_ASSESSMENT: ClipboardCheck,
  NEW_CONTENT: BookOpen,
  NEW_QUIZ: ClipboardList,
  NEW_COURSE: GraduationCap,
  NEW_ASSIGNMENT: ClipboardEdit,
  BATCH_UPDATE: Building2,
  BATCH_ASSIGNED: Building2,
  NEW_CHAT: MessageSquare,
  CHAT_MESSAGE: MessageSquare,
  LIVE_SESSION: Radio,
  LIVE_SESSION_STARTED: Radio,
  ATTENDANCE_MARKED: CheckCircle2,
  DOUBT_RAISED: HelpCircle,
  ASSIGNMENT_SUBMIT: Send,
  DEFAULT: Bell,
};
const getIcon = (type) => TYPE_ICON[type] ?? TYPE_ICON.DEFAULT;

// ── Role label for the profile dropdown — mirrors TopNavbar's roleConfig ──
const ROLE_LABELS = {
  STUDENT: "Student Portal",
  TRAINER: "Trainer Panel",
  ADMIN: "Manager Panel",
  BUSINESS: "Tenant Admin Panel",
};

// ── Shared AudioContext — created once, resumed on interaction ─
let _audioCtx = null;
const getAudioCtx = () => {
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
};
const unlockAudio = () => {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") ctx.resume();
  } catch (_) {}
};
if (typeof window !== "undefined") {
  window.addEventListener("click", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
}

// ── Sound ────────────────────────────────────────────────────
const playSound = () => {
  try {
    const ctx = getAudioCtx();
    const doPlay = () => {
      const t = ctx.currentTime;
      const o1 = ctx.createOscillator(),
        g1 = ctx.createGain();
      o1.connect(g1);
      g1.connect(ctx.destination);
      o1.type = "sine";
      o1.frequency.setValueAtTime(880, t);
      g1.gain.setValueAtTime(0.6, t);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o1.start(t);
      o1.stop(t + 0.22);

      const o2 = ctx.createOscillator(),
        g2 = ctx.createGain();
      o2.connect(g2);
      g2.connect(ctx.destination);
      o2.type = "sine";
      o2.frequency.setValueAtTime(1100, t + 0.25);
      g2.gain.setValueAtTime(0.5, t + 0.25);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.48);
      o2.start(t + 0.25);
      o2.stop(t + 0.48);
    };
    if (ctx.state === "suspended") ctx.resume().then(doPlay);
    else doPlay();
  } catch (e) {
    console.warn("Sound error:", e);
  }
};

// ─────────────────────────────────────────────────────────────
// Shared responsive CSS for this file only — scoped under .dl-root
// so it can't leak into / clash with anything else on the page.
// Layout-affecting rules (padding, gaps, widths, flex-wrap) live
// here so media queries can win; colors that depend on the isDark
// flag stay as inline styles below, computed in JS as before.
// ─────────────────────────────────────────────────────────────
const DashboardResponsiveStyles = () => (
  <style>{`
    /* FIX (Bug 2): global reset so the OUTER document never scrolls.
       Without this, the <html>/<body> could scroll independently of
       .dl-main, which is what produced the "extra gap below the
       sticky header" feeling — you were effectively looking at two
       nested scroll containers fighting each other. Now there is
       exactly one scroll container (.dl-main); the header stays
       visually pinned for free since it's a sibling outside it. */
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    .dl-root, .dl-root * { box-sizing: border-box; }
    .dl-root { overflow-x: hidden; }
    .dl-shell { min-width: 0; }

    .dl-aside {
      flex-shrink: 0;
      height: 100%;
      overflow-y: auto;
      overflow-x: visible;
      max-width: 100vw;
      transition: width .28s ease, margin .28s ease, transform .28s ease;
    }

    .dl-main-col {
      min-width: 0;
      transition: width .28s ease, margin .28s ease, transform .28s ease;
    }

    /* FIX (Bug 2): smooth, contained scrolling on the single scroll
       container. overscroll-behavior: contain stops scroll-chaining
       past the top/bottom edge (another source of "janky" feeling
       scroll), and margin/padding are pinned to 0 so no stray
       top-margin can create a gap directly under the sticky header. */
    .dl-main {
      min-width: 0;
      margin: 0;
      padding: 0;
      scroll-behavior: smooth;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }

    /* FIX (Bug 3 — header/content overlap): the header used to be a
       fixed 64px (60px tablet / 56px mobile) box with TopNavbar and
       the theme/bell/profile icons as separate flex siblings inside
       it. TopNavbar is now a two-row component (52px logo row + 44px
       tabs row = 96px total) with the icons rendered INSIDE its row1
       via the rightSlot prop — so .dl-header no longer needs (or
       wants) a fixed height. It now sizes itself naturally to
       whatever TopNavbar renders (96px desktop/tablet, 52px on
       mobile once the tabs row hides itself), so the tabs row can
       never spill out of a too-short header and overlap the page
       content below it again. */
    .dl-header {
      padding: 0 24px;
    }
    .dl-topbar-slot { gap: 8px; }
    .dl-right-cluster { gap: 10px; }
    .dl-avatar { width: 36px; height: 36px; font-size: 14px; }
    .dl-bell { width: 38px; height: 38px; }

    /* ── Sidebar restore control (hamburger) ──
       Sits in the header when the sidebar is hidden, and doubles
       as a floating pill on desktop / a fixed pill on mobile so
       it's always reachable regardless of scroll position. */
    .dl-restore-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .dl-restore-btn[data-show="true"] { display: flex; }

    .dl-toast-stack {
      top: 24px;
      right: 24px;
      max-width: 360px;
    }
    .dl-banner {
      bottom: 24px;
      padding: 13px 18px;
      white-space: nowrap;
    }

    /* ---- Large laptop / small desktop ---- */
    @media (max-width: 1439px) {
      .dl-toast-stack { max-width: 340px; }
    }

    /* ---- Laptop ---- */
    @media (max-width: 1199px) {
      .dl-header { padding: 0 20px; }
    }

    /* ---- Tablet / iPad / iPad Air ---- */
    @media (max-width: 1023px) {
      .dl-header { padding: 0 16px; }
      .dl-toast-stack { top: 16px; right: 16px; max-width: min(320px, calc(100vw - 32px)); }
      .dl-banner { bottom: 16px; max-width: calc(100vw - 32px); }
    }

    /* ---- iPad Mini / small tablet / large phone landscape ---- */
    @media (max-width: 820px) {
      .dl-right-cluster { gap: 8px; }
    }

    /* ---- Mobile: phones, iPhone SE and up ---- */
    @media (max-width: 640px) {
      .dl-header { padding: 0 12px; }
      .dl-avatar { width: 32px; height: 32px; font-size: 13px; }
      .dl-bell { width: 34px; height: 34px; }
      .dl-topbar-slot { flex-wrap: wrap; }

      .dl-toast-stack {
        top: 12px;
        left: 12px;
        right: 12px;
        max-width: none;
        align-items: stretch;
      }

      .dl-banner {
        left: 12px;
        right: 12px;
        bottom: 12px;
        transform: none;
        max-width: none;
        width: auto;
        white-space: normal;
        flex-wrap: wrap;
        row-gap: 8px;
      }
    }

    /* ---- iPhone SE / very small phones ---- */
    @media (max-width: 375px) {
      .dl-header { padding: 0 10px; }
      .dl-right-cluster { gap: 6px; }
    }

    /* ---- Respect iOS safe areas (notch / home indicator) ---- */
    @supports (padding: max(0px)) {
      .dl-header { padding-left: max(24px, env(safe-area-inset-left)); padding-right: max(24px, env(safe-area-inset-right)); }
      @media (max-width: 1023px) {
        .dl-header { padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); }
      }
      @media (max-width: 640px) {
        .dl-header { padding-left: max(12px, env(safe-area-inset-left)); padding-right: max(12px, env(safe-area-inset-right)); }
      }
      .dl-banner { margin-bottom: env(safe-area-inset-bottom); }
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
// Notification permission banner
// ─────────────────────────────────────────────────────────────
const NotificationBanner = () => {
  const [show, setShow] = useState(false);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
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
    localStorage.setItem("notif_banner_dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="dl-banner"
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1e293b",
        color: "#f8fafc",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
        border: "1px solid rgba(255,255,255,0.08)",
        zIndex: 9998,
        fontFamily: "DM Sans, sans-serif",
        fontSize: "0.86rem",
        animation: "bnrIn 0.35s ease",
      }}
    >
      <style>{`
        @keyframes bnrIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 640px) {
          @keyframes bnrIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: "rgba(249,115,22,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Bell size={15} color="#F97316" />
      </span>
      <span style={{ color: "#cbd5e1", minWidth: 0 }}>
        Enable notifications to get video &amp; course alerts
      </span>
      <button
        onClick={handleEnable}
        disabled={asking}
        style={{
          background: "#F97316",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "7px 16px",
          cursor: asking ? "not-allowed" : "pointer",
          fontWeight: 700,
          fontSize: "0.82rem",
          opacity: asking ? 0.7 : 1,
          fontFamily: "inherit",
          boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
          flexShrink: 0,
        }}
      >
        {asking ? "Enabling…" : "Enable"}
      </button>
      <button
        onClick={handleDismiss}
        style={{
          background: "none",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: 0,
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Toast stack
// ─────────────────────────────────────────────────────────────
const ToastStack = ({ toasts, onDismiss, onNavigate }) => (
  <div
    className="dl-toast-stack"
    style={{
      position: "fixed",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: "flex-end",
    }}
  >
    {toasts.map((t) => {
      const Icon = getIcon(t.type);
      return (
        <div
          key={t.id}
          onClick={() => onNavigate(t)}
          style={{
            background: "rgba(255,255,255,0.98)",
            color: "#0f172a",
            padding: "12px 16px",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid rgba(226,232,240,0.9)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            animation: "slideDown 0.3s ease",
            cursor: "pointer",
            width: "100%",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flexShrink: 0,
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={17} color="#F97316" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 2,
                fontSize: 13,
                color: "#0f172a",
              }}
            >
              {t.title}
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: 12,
                fontWeight: 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t.message}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(t.id);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>
      );
    })}
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
  const { t } = useTrainerTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const base = "/" + location.pathname.split("/")[1];

  const [toasts, setToasts] = useState([]);
  const toastCounterRef = useRef(0);

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  // ✅ Theme toggle — flips the document class; the MutationObserver
  // above picks it up and syncs isDark, so every themed bit in this
  // header (and anywhere else watching document.documentElement)
  // updates together, same as Sidebar.jsx's toggle used to do.
  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
  };

const userEmail = localStorage.getItem("email");
  const userRole = location.pathname.startsWith("/student")
    ? "STUDENT"
    : location.pathname.startsWith("/trainer")
      ? "TRAINER"
      : location.pathname.startsWith("/admin")
        ? "ADMIN"
        : "BUSINESS";

  const roleLabel = ROLE_LABELS[userRole] || "Portal";

  const notifPath = `${base}/notifications`;

  // ✅ Avatar initial + full name — fetched fresh from API, cached in localStorage
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User",
  );
  const [userInitial, setUserInitial] = useState(
    (localStorage.getItem("userName") || "U").trim().charAt(0).toUpperCase() ||
      "U",
  );

  useEffect(() => {
    let cancelled = false;
    userService
      .getMyProfile()
      .then((res) => {
        if (cancelled) return;
        const name = res.data?.displayName || res.data?.name || "User";
        localStorage.setItem("userName", name);
        setUserName(name);
        setUserInitial(name.trim().charAt(0).toUpperCase() || "U");
      })
      .catch(() => {
        // keep whatever is cached in localStorage if the call fails
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const addToast = useCallback((title, message, type) => {
    playSound();
    const id = ++toastCounterRef.current;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((tt) => tt.id !== id));
    }, 5000);
  }, []);

  const dismissToast = (id) =>
    setToasts((prev) => prev.filter((tt) => tt.id !== id));
  const handleToastClick = (toast) => {
    dismissToast(toast.id);
    navigate(notifPath);
  };

  // ── Single WebSocket for whole app ────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    connectWebSocket({
      userEmail,
      userRole,
      onMessage: (notif) => {
        addToast(notif.title, notif.message, notif.type);
        window.dispatchEvent(
          new CustomEvent("lms:notification", { detail: notif }),
        );
      },
    });
    return () => disconnectWebSocket();
  }, [userEmail, userRole, addToast]);

  // ── FCM foreground — tab open but minimized ───────────────
  useEffect(() => {
    onForegroundMessage((payload) => {
      const title =
        payload.notification?.title ||
        payload.data?.title ||
        "New Notification";
      const body = payload.notification?.body || payload.data?.body || "";
      const type = payload.data?.type || "DEFAULT";
      const sender = payload.data?.senderEmail || "";
      const current = (localStorage.getItem("email") || "").toLowerCase();
      if (type === "NEW_CHAT" && sender && sender.toLowerCase() === current) {
        console.log("⏭️ Skipping self FCM notification");
        return;
      }
      addToast(title, body, type);
    });
  }, [addToast]);

  const headerStyle = {
    display: "flex",
    alignItems: "stretch",
    background: isDark ? "rgba(10,10,10,0.92)" : "rgba(255,255,255,0.88)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: isDark
      ? "1px solid rgba(255,255,255,0.06)"
      : "1px solid rgba(226,232,240,0.85)",
    boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 20,
    flexShrink: 0,
  };

  // FIX (Bug 3): theme toggle / bell / profile now render INSIDE
  // TopNavbar's own row1 (via the `rightSlot` prop) instead of as
  // separate flex siblings next to it in `.dl-header`. That's what
  // keeps them in the exact same row as the logo — matching the
  // SuperAdmin header — and it's also what lets `.dl-header` drop
  // its old fixed height and simply size itself to TopNavbar's real
  // (two-row) height, so nothing overlaps the page content below it
  // anymore.
  const headerRightSlot = (
    <>
      <div
        id="lr-topbar-slot"
        className="dl-topbar-slot"
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          minWidth: 0,
        }}
      />

      <div
        className="dl-right-cluster"
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />

        <NotificationBellSlot
          navigate={navigate}
          notifPath={notifPath}
          isDark={isDark}
        />

        <ProfileMenu
          isDark={isDark}
          userName={userName}
          userInitial={userInitial}
          roleLabel={roleLabel}
          onProfile={() => navigate(`${base}/profile`)}
          onLogout={handleLogout}
        />
      </div>
    </>
  );

  return (
    <div
      className="dl-root"
      style={{
        height: "100vh",
        background: isDark ? "#0a0a0a" : "#F8F9FB",
        color: isDark ? "#ffffff" : "#0f172a",
      }}
    >
      <DashboardResponsiveStyles />

     <div
        className="dl-shell"
        style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
      >
        {/* ═══ HEADER — TopNavbar now owns the whole header: row1 is
             logo + (theme/bell/profile via rightSlot), row2 is the
             underline tabs — exactly like the SuperAdmin header. ═══ */}
        <div className="dl-header" style={headerStyle}>
          <TopNavbar isDark={isDark} rightSlot={headerRightSlot} />
        </div>

        {/* ═══ MAIN — the ONLY scrollable region (see DashboardResponsiveStyles
             for the global html/body reset that makes this true) ═══ */}
        <main
          className="dl-main"
          style={{ flex: 1, overflowY: "auto", background: t.pageBg }}
        >
          <Outlet />
        </main>
      </div>

      <FloatingMeetingWidget />
      <LiveMeetingRouteSync />
      {userRole === "STUDENT" && <ChatWidgetButton />}   {/* ← add ye line */}
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
// Theme toggle button — sun/moon, same footprint as the bell
// ─────────────────────────────────────────────────────────────
const ThemeToggleButton = ({ isDark, onToggle }) => {
  const [hov, setHov] = useState(false);

  return (
    <button
      className="dl-bell"
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
      style={{
        position: "relative",
        borderRadius: 10,
        background: hov
          ? isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(241,245,249,0.9)"
          : "transparent",
        border: isDark
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid rgba(226,232,240,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: hov && !isDark ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        flexShrink: 0,
      }}
    >
      {isDark ? <Sun size={17} color="#3b82f6" /> : <Moon size={17} color="#64748b" />}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// Profile dropdown — avatar trigger, name + role header,
// Profile + Logout actions. Matches Super Admin's panel.
// ─────────────────────────────────────────────────────────────
const PROFILE_MENU_CSS = `
  .dl-profile-wrap { position: relative; flex-shrink: 0; }

  .dl-profile-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0; z-index: 250;
    min-width: 210px; border-radius: 12px; padding: 6px;
    display: flex; flex-direction: column; gap: 2px;
    animation: dlProfIn .15s ease;
  }
  [data-dark="false"] .dl-profile-dropdown { background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 16px 40px rgba(0,0,0,0.14); }
  [data-dark="true"]  .dl-profile-dropdown { background: #18181b; border: 1px solid #27272a; box-shadow: 0 16px 40px rgba(0,0,0,0.45); }
  @keyframes dlProfIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  .dl-profile-header { display: flex; align-items: center; gap: 10px; padding: 8px 8px 10px; }
  .dl-profile-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #F97316, #EA580C);
    color: #fff; font-weight: 700; font-size: 13px;
    display: flex; align-items: center; justify-content: center;
  }
  .dl-profile-name {
    margin: 0; font-size: 13px; font-weight: 700;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  [data-dark="false"] .dl-profile-name { color: #0f172a; }
  [data-dark="true"]  .dl-profile-name { color: #ffffff; }
  .dl-profile-role {
    margin: 2px 0 0; font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  [data-dark="false"] .dl-profile-role { color: #94a3b8; }
  [data-dark="true"]  .dl-profile-role { color: #71717a; }

  .dl-profile-divider { height: 1px; margin: 2px 6px 4px; }
  [data-dark="false"] .dl-profile-divider { background: #e2e8f0; }
  [data-dark="true"]  .dl-profile-divider { background: #27272a; }

  .dl-profile-item {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 8px 10px; border-radius: 8px; border: none;
    background: transparent; cursor: pointer; text-align: left;
    font-size: 12.5px; font-weight: 500; font-family: inherit;
    transition: all .12s;
  }
  [data-dark="false"] .dl-profile-item { color: #374151; }
  [data-dark="true"]  .dl-profile-item { color: #d4d4d8; }
  [data-dark="false"] .dl-profile-item:hover { background: #f1f5f9; }
  [data-dark="true"]  .dl-profile-item:hover { background: rgba(255,255,255,0.06); }

  [data-dark="false"] .dl-profile-item.danger { color: #dc2626; }
  [data-dark="true"]  .dl-profile-item.danger { color: #f87171; }
  [data-dark="false"] .dl-profile-item.danger:hover { background: #fee2e2; }
  [data-dark="true"]  .dl-profile-item.danger:hover { background: rgba(239,68,68,0.14); }
`;

const ProfileMenu = ({ isDark, userName, userInitial, roleLabel, onProfile, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="dl-profile-wrap" ref={ref} data-dark={String(!!isDark)}>
      <style>{PROFILE_MENU_CSS}</style>

      <button
        className="dl-avatar"
        onClick={() => setOpen((p) => !p)}
        style={{
          borderRadius: "50%",
          background: "linear-gradient(135deg, #F97316, #EA580C)",
          color: "#fff",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(249,115,22,0.3)",
          boxShadow: "0 2px 10px rgba(249,115,22,0.35)",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "opacity 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {userInitial}
      </button>

      {open && (
        <div className="dl-profile-dropdown">
          <div className="dl-profile-header">
            <div className="dl-profile-avatar">{userInitial}</div>
            <div style={{ minWidth: 0 }}>
              <p className="dl-profile-name">{userName}</p>
              <p className="dl-profile-role">{roleLabel.toUpperCase()}</p>
            </div>
          </div>

          <div className="dl-profile-divider" />

          <button
            type="button"
            className="dl-profile-item"
            onClick={() => {
              setOpen(false);
              onProfile();
            }}
          >
            <User size={15} style={{ flexShrink: 0 }} />
            <span>Profile</span>
          </button>

          <button
            type="button"
            className="dl-profile-item danger"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Notification bell slot — listens to window event, no WebSocket
// ─────────────────────────────────────────────────────────────
const NotificationBellSlot = ({ navigate, notifPath, isDark }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    import("../services/notificationService").then(({ fetchUnreadCount }) => {
      fetchUnreadCount()
        .then(setUnreadCount)
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    const handler = () => setUnreadCount((c) => c + 1);
    window.addEventListener("lms:notification", handler);
    return () => window.removeEventListener("lms:notification", handler);
  }, []);

  return (
    <button
      className="dl-bell"
      onClick={() => {
        setUnreadCount(0);
        navigate(notifPath);
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        borderRadius: 10,
        background: hov
          ? isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(241,245,249,0.9)"
          : "transparent",
        border: isDark
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid rgba(226,232,240,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: hov && !isDark ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        flexShrink: 0,
      }}
    >
      <Bell
        size={18}
        color={isDark ? "#94a3b8" : "#64748b"}
        style={{
          transition: "transform 0.2s",
          transform: hov ? "rotate(12deg)" : "none",
        }}
      />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            minWidth: 18,
            height: 18,
            borderRadius: 999,
            background: "#F97316",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            boxShadow: "0 2px 6px rgba(249,115,22,0.45)",
            border: isDark ? "2px solid #0a0a0a" : "2px solid #fff",
            fontFamily: "inherit",
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default DashboardLayout;