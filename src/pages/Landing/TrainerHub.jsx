
// import { useState, useRef, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users, LayoutGrid, Calendar, ClipboardList, MessageSquare, Bot,
//   Play, Edit2, Upload, BookOpen, BarChart2, Mic, CheckSquare,
//   HelpCircle, Video, Map, Settings, PenTool, Layers, Star,
//   Send, ChevronRight, Activity, Bell, Zap, Award, TrendingUp,
//   FileText, Folder, Clock, AlertCircle, CheckCircle, XCircle,
//   Sun, Moon,
// } from "lucide-react";

// const getT = (isDark) => ({
//   bg:        isDark ? "#0A0A0A" : "#EDE8E1",
//   bgSec:     isDark ? "#111111" : "#E8E2DA",
//   surface:   isDark ? "#171717" : "#FFFFFF",
//   navBg:     isDark ? "#000000" : "#FFFFFF",

//   textH:     isDark ? "#FFFFFF" : "#1A2332",
//   textB:     isDark ? "#A1A1AA" : "#4A5568",
//   textM:     isDark ? "#71717A" : "#718096",

//   orange:    "#F97316",
//   orangeLt:  isDark ? "rgba(249,115,22,0.12)" : "#FFF0E6",
//   orangeBd:  isDark ? "rgba(249,115,22,0.35)" : "#FDBA74",

//   border:    isDark ? "rgba(255,255,255,0.12)" : "#E8E2D9",
//   borderHov: isDark ? "rgba(255,255,255,0.20)" : "#D4C8BE",

//   shadow:    isDark
//     ? "0 10px 30px rgba(0,0,0,0.45)"
//     : "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)",

//   shadowHov: isDark
//     ? "0 20px 40px rgba(0,0,0,0.60)"
//     : "0 4px 12px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.08)",

//   barBg:     isDark ? "rgba(255,255,255,0.08)" : "#F0EBE4",

//   inputBg:   isDark ? "#111111" : "#EDE8E1",

//   tableTh:   isDark ? "#1A1A1A" : "#FAF8F5",
//   tableRow:  isDark ? "#141414" : "#F5F2EE",

//   codeBg:    isDark ? "#111827" : "#1C2333",
// });

// // ─── STATIC DATA ──────────────────────────────────────────────────────────────
// const FEATURES = [
//   { color: "#F97316", bg: "#FFF0E6", Icon: Mic,           title: "Live Session Controls",     desc: "Host and manage live classes with attendance, polls, screen share, and recording." },
//   { color: "#6366f1", bg: "#EEF2FF", Icon: Layers,        title: "Batch Management",          desc: "Create multiple batches, track progress, and assign study plans per batch." },
//   { color: "#22c55e", bg: "#F0FDF4", Icon: CheckSquare,   title: "Attendance Tracker",        desc: "Mark, view and export attendance. Get alerts for consistently absent students." },
//   { color: "#a855f7", bg: "#FDF4FF", Icon: Bot,           title: "AI Companion",              desc: "Generate quizzes, lesson plans, and feedback instantly with AI assistance." },
//   { color: "#f59e0b", bg: "#FFFBEB", Icon: ClipboardList, title: "Quiz & Assignment Creator", desc: "Build MCQ, coding, and file-submission assessments with auto-grading." },
//   { color: "#ef4444", bg: "#FEF2F2", Icon: HelpCircle,    title: "Doubts Management",        desc: "Receive, reply, and track student doubts. AI suggests answers for frequent questions." },
//   { color: "#06b6d4", bg: "#ECFEFF", Icon: Folder,        title: "Course Modules & Files",    desc: "Upload videos and PDFs. Organize content into modules with progress-gated access." },
//   { color: "#10b981", bg: "#ECFDF5", Icon: BarChart2,     title: "Performance Analysis",      desc: "AI insights on quiz averages, assignment completion, and skill gap identification." },
//   { color: "#F97316", bg: "#FFF0E6", Icon: PenTool,       title: "Whiteboard Panel",          desc: "Interactive whiteboard with drawing tools and real-time sharing during sessions." },
//   { color: "#6366f1", bg: "#EEF2FF", Icon: Video,         title: "Recorded Classes",          desc: "Upload and manage session recordings. Students can replay at their own pace." },
//   { color: "#22c55e", bg: "#F0FDF4", Icon: Map,           title: "Study Plan Builder",        desc: "Design week-by-week study milestones per batch. Students get a clear roadmap." },
//   { color: "#a855f7", bg: "#FDF4FF", Icon: Settings,      title: "Trainer Settings",          desc: "Manage availability, theme, notifications, and your public trainer profile." },
// ];

// const BATCHES = [
//   { color: "#F97316", code: "B2", name: "Java Backend Engineering",   students: 42, progress: 68, tag: "Active",      modules: "12/18", next: "Today 6:00 PM" },
//   { color: "#6366f1", code: "B4", name: "React Frontend Development", students: 38, progress: 45, tag: "Active",      modules: "8/18",  next: "Tomorrow 5:00 PM" },
//   { color: "#22c55e", code: "B5", name: "Data Science & ML",          students: 55, progress: 22, tag: "New",         modules: "4/20",  next: "Today 8:00 PM" },
//   { color: "#a855f7", code: "B1", name: "DevOps & Cloud AWS",         students: 30, progress: 89, tag: "Ending Soon", modules: "16/18", next: "Wed 4:00 PM" },
//   { color: "#f59e0b", code: "B6", name: "System Design Masterclass",  students: 47, progress: 55, tag: "Active",      modules: "11/20", next: "Thu 7:00 PM" },
//   { color: "#06b6d4", code: "B3", name: "Python Full Stack",          students: 36, progress: 78, tag: "Active",      modules: "14/18", next: "Fri 5:30 PM" },
// ];

// const TAG_COLORS = { Active: "#22c55e", New: "#3b82f6", "Ending Soon": "#f59e0b" };

// const LIVE_SESSIONS = [
//   { color: "#F97316", title: "Java Collections Deep Dive",  batch: "Batch B2 · Java Backend",   time: "Today 6:00 PM",    students: 42, live: true },
//   { color: "#6366f1", title: "React Hooks & Context API",   batch: "Batch B4 · React Frontend", time: "Today 8:00 PM",    students: 38, live: false },
//   { color: "#22c55e", title: "Pandas & Data Cleaning",      batch: "Batch B5 · Data Science",   time: "Tomorrow 5:00 PM", students: 55, live: false },
// ];

// const STUDENTS = [
//   { name: "Aarav Sharma",  batch: "B2", att: "92%", quiz: "88%", asgn: "5/6", status: "On Track" },
//   { name: "Priya Verma",   batch: "B2", att: "78%", quiz: "72%", asgn: "4/6", status: "Needs Attention" },
//   { name: "Rohan Singh",   batch: "B4", att: "95%", quiz: "91%", asgn: "6/6", status: "Excellent" },
//   { name: "Sneha Patel",   batch: "B2", att: "60%", quiz: "65%", asgn: "3/6", status: "At Risk" },
//   { name: "Karan Mehta",   batch: "B5", att: "88%", quiz: "79%", asgn: "5/6", status: "On Track" },
//   { name: "Ananya Joshi",  batch: "B4", att: "97%", quiz: "94%", asgn: "6/6", status: "Excellent" },
// ];

// const STATUS_COLORS = { Excellent: "#22c55e", "On Track": "#3b82f6", "Needs Attention": "#f59e0b", "At Risk": "#ef4444" };
// const STATUS_ICONS  = { Excellent: CheckCircle, "On Track": CheckCircle, "Needs Attention": AlertCircle, "At Risk": XCircle };

// const ASSIGNMENTS = [
//   { color: "#F97316", bg: "#FFF0E6", title: "REST API Implementation",  batch: "B2 · Java",         submitted: 38, total: 42, due: "Dec 18" },
//   { color: "#6366f1", bg: "#EEF2FF", title: "React Dashboard Project",  batch: "B4 · React",         submitted: 30, total: 38, due: "Dec 20" },
//   { color: "#22c55e", bg: "#F0FDF4", title: "EDA on Dataset",           batch: "B5 · Data Science",  submitted: 44, total: 55, due: "Dec 22" },
//   { color: "#a855f7", bg: "#FDF4FF", title: "CI/CD Pipeline Setup",     batch: "B1 · DevOps",        submitted: 29, total: 30, due: "Dec 15" },
//   { color: "#f59e0b", bg: "#FFFBEB", title: "Design Twitter System",    batch: "B6 · System Design", submitted: 35, total: 47, due: "Dec 24" },
//   { color: "#06b6d4", bg: "#ECFEFF", title: "Flask CRUD App",           batch: "B3 · Python",        submitted: 33, total: 36, due: "Dec 19" },
// ];

// const COURSE_ITEMS = [
//   { color: "#F97316", bg: "#FFF0E6", Icon: Upload,      title: "Upload Videos",        desc: "Upload lectures, demos, and walkthroughs for your batch.",              btn: "Upload Now" },
//   { color: "#6366f1", bg: "#EEF2FF", Icon: BookOpen,    title: "Course Modules",        desc: "Organize lessons into modules with ordered, progress-gated access.",    btn: "Manage" },
//   { color: "#22c55e", bg: "#F0FDF4", Icon: Map,         title: "Study Plan Builder",    desc: "Create weekly milestones and schedules for each batch automatically.",  btn: "Build Plan" },
//   { color: "#a855f7", bg: "#FDF4FF", Icon: Video,       title: "Recorded Classes",      desc: "Manage your session recording library. Students replay anytime.",       btn: "View Library" },
//   { color: "#f59e0b", bg: "#FFFBEB", Icon: FileText,    title: "File List & Resources", desc: "Upload PDFs, notes, and references for students to access anytime.",   btn: "Manage Files" },
//   { color: "#06b6d4", bg: "#ECFEFF", Icon: Edit2,       title: "Edit Assignments",      desc: "Update deadlines, modify questions, or extend submissions per student.",btn: "Edit Now" },
// ];

// const PERF = [
//   { name: "Quiz Average Score",      pct: 81, color: "#F97316", Icon: Star },
//   { name: "Assignment Completion",   pct: 88, color: "#6366f1", Icon: ClipboardList },
//   { name: "Attendance Rate",         pct: 87, color: "#22c55e", Icon: CheckSquare },
//   { name: "Live Session Engagement", pct: 74, color: "#a855f7", Icon: Zap },
//   { name: "Doubt Resolution Speed",  pct: 92, color: "#f59e0b", Icon: HelpCircle },
// ];

// const ACTIVITIES = [
//   { ic: "#22c55e", ibg: "#F0FDF4", Icon: CheckCircle,  text: "Graded 12 Java Assignment submissions",           sub: "Batch B2 · 1 hour ago" },
//   { ic: "#6366f1", ibg: "#EEF2FF", Icon: Video,        text: "Completed Live Session — React Hooks",            sub: "Batch B4 · 90 mins · 3 hours ago" },
//   { ic: "#a855f7", ibg: "#FDF4FF", Icon: Bot,          text: "Resolved 5 student doubts via AI Companion",      sub: "Multiple batches · 5 hours ago" },
//   { ic: "#F97316", ibg: "#FFF0E6", Icon: Upload,       text: "Uploaded new video — Spring Boot REST APIs",      sub: "Batch B2 · Yesterday" },
//   { ic: "#f59e0b", ibg: "#FFFBEB", Icon: ClipboardList,text: "Created new Quiz — Data Structures MCQ (20 Qs)", sub: "Batch B5 · 2 days ago" },
// ];

// const INITIAL_THREADS = [
//   { id: 1, name: "Aarav Sharma",  initials: "AS", color: "#F97316", batch: "B2 · Java",         preview: "Sir, HashMap vs LinkedHashMap?",    time: "5m",  unread: 2 },
//   { id: 2, name: "Priya Verma",   initials: "PV", color: "#6366f1", batch: "B2 · Java",         preview: "Assignment submission link broken", time: "12m", unread: 1 },
//   { id: 3, name: "Rohan Singh",   initials: "RS", color: "#22c55e", batch: "B4 · React",        preview: "useEffect cleanup query",           time: "1h",  unread: 0 },
//   { id: 4, name: "Sneha Patel",   initials: "SP", color: "#ef4444", batch: "B2 · Java",         preview: "Can I get an extension please?",    time: "2h",  unread: 3 },
//   { id: 5, name: "Karan Mehta",   initials: "KM", color: "#f59e0b", batch: "B5 · Data Science", preview: "Pandas groupby doubt",              time: "3h",  unread: 0 },
//   { id: 6, name: "Ananya Joshi",  initials: "AJ", color: "#a855f7", batch: "B4 · React",        preview: "Loved today's session! 🔥",         time: "5h",  unread: 0 },
// ];

// const INITIAL_MESSAGES = {
//   1: [
//     { role: "student", text: "Sir, good evening! I have a doubt about HashMap vs LinkedHashMap. When should I prefer one over the other?", time: "6:02 PM" },
//     { role: "trainer", text: "Great question Aarav! HashMap gives O(1) for get/put but doesn't maintain insertion order. LinkedHashMap maintains insertion order with a small overhead.", time: "6:05 PM" },
//     { role: "student", text: "Understood! So for a cache eviction policy, LinkedHashMap makes more sense?", time: "6:07 PM" },
//     { role: "trainer", text: "Exactly! Override removeEldestEntry() in LinkedHashMap and you get a ready-made LRU cache. Try coding that as a bonus exercise 💪", time: "6:09 PM" },
//   ],
//   2: [
//     { role: "student", text: "Sir the assignment submission link is showing 404 error. Please check.", time: "5:48 PM" },
//     { role: "trainer", text: "Hi Priya, thanks for flagging this. I'm looking into it right now.", time: "5:52 PM" },
//     { role: "student", text: "It's still not working, all my batchmates are also facing the same issue.", time: "5:55 PM" },
//   ],
//   3: [
//     { role: "student", text: "Sir in useEffect, when exactly should I return a cleanup function?", time: "4:00 PM" },
//     { role: "trainer", text: "Return a cleanup whenever your effect sets up subscriptions, timers, or event listeners.", time: "4:05 PM" },
//     { role: "student", text: "Got it! So for WebSocket connections and setInterval both need cleanup. Makes sense!", time: "4:07 PM" },
//   ],
//   4: [
//     { role: "student", text: "Sir please can I get a 2-day extension for REST API assignment? I had exams.", time: "3:00 PM" },
//     { role: "student", text: "I've already done 80% of it, just need to finish the exception handling part.", time: "3:01 PM" },
//     { role: "student", text: "Sir please reply 🙏", time: "3:30 PM" },
//   ],
//   5: [
//     { role: "student", text: "Sir in groupby, how do I apply multiple aggregation functions at once?", time: "2:00 PM" },
//     { role: "trainer", text: "Use .agg() with a dict — e.g. df.groupby('col').agg({'salary': ['mean','max'], 'age': 'count'}). Very powerful!", time: "2:10 PM" },
//   ],
//   6: [
//     { role: "student", text: "Sir today's session on React Context was amazing! Finally understood prop drilling clearly 🔥", time: "11:00 AM" },
//     { role: "trainer", text: "Thank you Ananya! Your participation in class really helps the whole batch. Keep it up! 🎯", time: "11:05 AM" },
//   ],
// };

// const AI_INITIAL_MESSAGES = [
//   { role: "bot", text: "👋 Hi Rahul Sir! I'm your AI Companion. I can generate quiz questions, create lesson plans, summarize recorded sessions, and resolve student doubts. What do you need today?" },
//   { role: "user", text: "Generate 5 MCQ questions on Java Collections for Batch B2" },
//   {
//     role: "bot", html: true,
//     text: `Here are 5 MCQ questions on Java Collections for Batch B2:<br/><br/><strong>Q1.</strong> Which collection allows duplicates and maintains insertion order?<br/>A) HashSet &nbsp;B) TreeSet &nbsp;<strong style="color:#F97316">C) ArrayList</strong> &nbsp;D) LinkedHashSet<br/><br/><strong>Q2.</strong> Default initial capacity of HashMap?<br/>A) 8 &nbsp;<strong style="color:#F97316">B) 16</strong> &nbsp;C) 32 &nbsp;D) 10<br/><br/><strong>Q3.</strong> LinkedList implements which interfaces?<br/><strong style="color:#F97316">C) List and Deque</strong><br/><br/>Want me to add these to a quiz in Batch B2?`,
//   },
// ];

// // ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
// function useBreakpoint() {
//   const [bp, setBp] = useState(() => {
//     const w = typeof window !== "undefined" ? window.innerWidth : 1200;
//     if (w < 480) return "mobile";
//     if (w < 768) return "mobileLg";
//     if (w < 1024) return "tablet";
//     return "desktop";
//   });
//   useEffect(() => {
//     const update = () => {
//       const w = window.innerWidth;
//       if (w < 480) setBp("mobile");
//       else if (w < 768) setBp("mobileLg");
//       else if (w < 1024) setBp("tablet");
//       else setBp("desktop");
//     };
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);
//   return bp;
// }

// // ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
// function ProgressBar({ pct, color, barBg, animate = false }) {
//   const [width, setWidth] = useState(animate ? 0 : pct);
//   useEffect(() => {
//     if (animate) { const t = setTimeout(() => setWidth(pct), 200); return () => clearTimeout(t); }
//   }, [pct, animate]);
//   return (
//     <div style={{ background: barBg || "#F0EBE4", borderRadius: 99, height: 7, overflow: "hidden" }}>
//       <div style={{ height: "100%", borderRadius: 99, background: color, width: `${width}%`, transition: "width 1.3s cubic-bezier(.4,0,.2,1)" }} />
//     </div>
//   );
// }

// // ─── SECTION PILL ─────────────────────────────────────────────────────────────
// function SectionPill({ children, T }) {
//   return (
//     <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.orangeLt, border: `1px solid ${T.orangeBd}`, borderRadius: 99, padding: "5px 16px", marginBottom: 16, fontSize: 13, fontWeight: 600, color: T.orange }}>
//       {children}
//     </div>
//   );
// }

// // ─── SECTION HEAD ─────────────────────────────────────────────────────────────
// function SectionHead({ pill, title, sub, T }) {
//   return (
//     <div style={{ textAlign: "center", marginBottom: 48 }}>
//       <SectionPill T={T}>{pill}</SectionPill>
//       <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: T.textH, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 14 }}>{title}</h2>
//       {sub && <p style={{ fontSize: "clamp(14px,1.5vw,16px)", color: T.textB, maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>}
//     </div>
//   );
// }

// // ─── NAVBAR ───────────────────────────────────────────────────────────────────
// function Navbar({ activeSection, navShadow, theme, toggleTheme, T }) {
//   const navigate = useNavigate();
//   const bp = useBreakpoint();
//   const isMobile = bp === "mobile" || bp === "mobileLg";
//   const [menuOpen, setMenuOpen] = useState(false);

//   const links = [
//     { id: "dashboard",    label: "Dashboard",    Icon: LayoutGrid },
//     { id: "batches",      label: "Batches",      Icon: Layers },
//     { id: "live",         label: "Live Classes", Icon: Play },
//     { id: "students",     label: "Students",     Icon: Users },
//     { id: "assignments",  label: "Assignments",  Icon: ClipboardList },
//     { id: "discussion",   label: "Discussion",   Icon: MessageSquare },
//     { id: "ai-companion", label: "AI Companion", Icon: Bot },
//   ];

//   const scrollTo = (id) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
//     setMenuOpen(false);
//   };

//   return (
//     <nav style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 200, boxShadow: navShadow, transition: "background 0.3s, border-color 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)", height: 64, display: "flex", alignItems: "center", gap: 24 }}>

//         {/* Logo */}
//         <div
//           onClick={() => navigate("/")}
//           style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0, cursor: "pointer", userSelect: "none" }}
//         >
//           <span style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 800, fontFamily: "serif", lineHeight: 1 }}>
//             <span style={{ color: "#16a34a" }}>ILM</span>
//             <span style={{ color: "#f97316", marginLeft: 4 }}>ORA</span>
//           </span>
//           <span style={{ display: "inline-flex", alignItems: "center", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 4, marginLeft: 8, padding: "2px 6px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#F97316", textTransform: "uppercase" }}>Beta</span>
//         </div>

//         {/* Desktop Nav Links */}
//         {!isMobile && (
//           <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2vw,28px)", flex: 1, flexWrap: "nowrap", overflowX: "auto" }}>
//             {links.map(l => (
//               <button key={l.id} onClick={() => scrollTo(l.id)}
//                 style={{ background: "none", border: "none", fontSize: "clamp(12px,1.2vw,15px)", fontWeight: activeSection === l.id ? 600 : 500, color: activeSection === l.id ? T.orange : T.textH, cursor: "pointer", padding: "4px 0", transition: "color 0.2s", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5, borderBottom: activeSection === l.id ? `2px solid ${T.orange}` : "2px solid transparent" }}>
//                 <l.Icon size={14} />
//                 {l.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* ✅ FIX: Theme Toggle — calls the real toggleTheme prop from App.jsx */}
//         <button
//           onClick={toggleTheme}
//           style={{
//             background: theme === "dark" ? "rgba(255,255,255,0.08)" : T.bg,
//             border: `1.5px solid ${T.border}`,
//             borderRadius: 99,
//             padding: "6px 10px",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexShrink: 0,
//             transition: "background 0.3s",
//             marginLeft: isMobile ? "auto" : 0,
//           }}
//         >
//           {theme === "dark" ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color={T.textH} />}
//         </button>

//         {/* Mobile Hamburger */}
//         {isMobile && (
//           <button onClick={() => setMenuOpen(v => !v)}
//             style={{ background: "none", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
//             {[0, 1, 2].map(i => <div key={i} style={{ width: 18, height: 2, background: theme === "dark" ? "#111111" : T.textH, borderRadius: 2 }} />)}
//           </button>
//         )}
//       </div>

//       {/* Mobile Dropdown */}
//       {isMobile && menuOpen && (
//         <div style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
//           {links.map(l => (
//             <button key={l.id} onClick={() => scrollTo(l.id)}
//               style={{ background: activeSection === l.id ? T.orangeLt : "none", border: "none", borderRadius: 10, fontSize: 14, fontWeight: activeSection === l.id ? 700 : 500, color: activeSection === l.id ? T.orange : T.textH, cursor: "pointer", padding: "10px 14px", textAlign: "left", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
//               <l.Icon size={16} />
//               {l.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </nav>
//   );
// }

// // ─── HERO ─────────────────────────────────────────────────────────────────────
// function HeroSection({ T }) {
//   const bp = useBreakpoint();
//   const isMobile = bp === "mobile" || bp === "mobileLg";
//   const isTablet = bp === "tablet";
//   const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

//   return (
//     <section id="dashboard" style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "clamp(40px,6vw,72px) 0 clamp(40px,5vw,64px)", transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)", display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr", gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
//         <div>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.orangeLt, border: `1px solid ${T.orangeBd}`, borderRadius: 99, padding: "6px 16px", marginBottom: 24, fontSize: 13, fontWeight: 600, color: T.orange }}>
//             <Users size={13} /> Trainer Dashboard
//           </div>
//           <h1 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.03em", color: T.textH, marginBottom: 20 }}>
//             Welcome back,<br /><span style={{ color: T.orange }}>Rahul Sir 👋</span>
//           </h1>
//           <p style={{ fontSize: "clamp(14px,1.5vw,17px)", color: T.textB, lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
//             You have 3 live sessions today, 12 pending assignment reviews, and 7 open student doubts. Your AI Companion is ready.
//           </p>
//           <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//             <button onClick={() => scrollTo("live")} style={{ background: T.orange, color: "#fff", borderRadius: 99, padding: "clamp(10px,1.5vw,14px) clamp(20px,2vw,28px)", fontSize: "clamp(13px,1.2vw,15px)", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(249,115,22,0.3)", fontFamily: "inherit" }}>
//               <Play size={14} fill="white" /> Start Live Session
//             </button>
//             <button onClick={() => scrollTo("students")} style={{ background: "transparent", color: T.textH, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "clamp(10px,1.5vw,14px) clamp(20px,2vw,28px)", fontSize: "clamp(13px,1.2vw,15px)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
//               View Students
//             </button>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(16px,2vw,36px)", marginTop: 40 }}>
//             {[
//               { num: "248",  lbl: "Active Students", Icon: Users },
//               { num: "6",    lbl: "Live Batches",    Icon: Layers },
//               { num: "4.9★", lbl: "Trainer Rating",  Icon: Star },
//               { num: "92%",  lbl: "Completion",      Icon: TrendingUp },
//             ].map(s => (
//               <div key={s.lbl} style={{ textAlign: "center" }}>
//                 <div style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 800, color: T.textH, letterSpacing: "-0.02em" }}>{s.num}</div>
//                 <div style={{ fontSize: "clamp(10px,1vw,13px)", color: T.textM, marginTop: 2 }}>{s.lbl}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {!isMobile && (
//           <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 20, padding: "clamp(16px,2vw,24px)", boxShadow: T.shadow }}>
//             <div style={{ background: T.codeBg, borderRadius: 12, padding: "clamp(12px,1.5vw,16px)", fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1vw,12px)", lineHeight: 1.7, marginBottom: 4 }}>
//               <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
//                 {["#ef4444", "#f59e0b", "#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
//               </div>
//               <div><span style={{ color: "#ff7b72" }}>class</span> <span style={{ color: "#d2a8ff" }}>TrainerHub</span></div>
//               <div>&nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>def</span> <span style={{ color: "#d2a8ff" }}>teach</span></div>
//               <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>"Inspire every batch"</span></div>
//               <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>return</span> <span style={{ color: "#79c0ff" }}>Success()</span></div>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
//               {[
//                 { bg: "#FFF0E6", lbl: "Today's Sessions", val: "3 Classes", Icon: Calendar },
//                 { bg: "#EEF2FF", lbl: "Pending Review",   val: "12 Tasks",  Icon: ClipboardList },
//                 { bg: "#F0FDF4", lbl: "Attendance Avg",   val: "87%",        Icon: CheckSquare },
//                 { bg: "#FDF4FF", lbl: "Open Doubts",      val: "7 New",      Icon: HelpCircle },
//               ].map(tile => (
//                 <div key={tile.lbl} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
//                   <div style={{ width: 28, height: 28, borderRadius: 8, background: tile.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <tile.Icon size={13} color={T.orange} />
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 10.5, color: T.textM, fontWeight: 500 }}>{tile.lbl}</div>
//                     <div style={{ fontSize: 13, color: T.textH, fontWeight: 700, marginTop: 1 }}>{tile.val}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// // ─── TRAINER TOOLS ────────────────────────────────────────────────────────────
// function TrainerToolsSection({ T }) {
//   const bp = useBreakpoint();
//   const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "240px";
//   return (
//     <section id="features" style={{ padding: "clamp(48px,6vw,80px) 0", background: T.bg, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><Zap size={13} /> Trainer Toolkit</>}
//           title={<>Everything You Need <span style={{ color: T.orange }}>To Teach Better</span></>}
//           sub="Powerful tools designed for trainers — manage batches, run live classes, and leverage AI to teach at scale."
//         />
//         <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(12px,1.5vw,20px)" }}>
//           {FEATURES.map(f => <FeatureCard key={f.title} {...f} T={T} />)}
//         </div>
//       </div>
//     </section>
//   );
// }

// function FeatureCard({ color, bg, Icon, title, desc, T }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
//       style={{ background: T.surface, border: `1px solid ${hov ? T.borderHov : T.border}`, borderRadius: 16, padding: "clamp(20px,2vw,28px) clamp(16px,2vw,24px)", borderTop: `3px solid ${color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-3px)" : "none", transition: "all 0.22s", cursor: "pointer" }}>
//       <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
//         <Icon size={20} color={color} />
//       </div>
//       <div style={{ fontSize: "clamp(14px,1.2vw,16px)", fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
//       <div style={{ fontSize: "clamp(12px,1vw,14px)", color: T.textB, lineHeight: 1.6 }}>{desc}</div>
//     </div>
//   );
// }

// // ─── BATCHES ──────────────────────────────────────────────────────────────────
// function BatchesSection({ T }) {
//   const bp = useBreakpoint();
//   const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "300px";
//   return (
//     <section id="batches" style={{ padding: "clamp(48px,6vw,80px) 0", background: T.surface, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><Layers size={13} /> Your Batches</>}
//           title={<>Active <span style={{ color: T.orange }}>Batches</span></>}
//           sub="Track all your ongoing training batches with real-time progress and student data."
//         />
//         <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(12px,1.5vw,20px)" }}>
//           {BATCHES.map(b => <BatchCard key={b.code} batch={b} T={T} />)}
//         </div>
//       </div>
//     </section>
//   );
// }

// function BatchCard({ batch: b, T }) {
//   const [hov, setHov] = useState(false);
//   const tc = TAG_COLORS[b.tag] || "#3b82f6";
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
//       style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(16px,2vw,24px)", borderTop: `3px solid ${b.color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-2px)" : "none", transition: "all 0.22s" }}>
//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div style={{ width: 44, height: 44, borderRadius: 12, background: b.color + "18", border: `1.5px solid ${b.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: b.color, flexShrink: 0 }}>{b.code}</div>
//           <div>
//             <div style={{ fontSize: "clamp(13px,1.2vw,15px)", fontWeight: 700, color: T.textH }}>{b.name}</div>
//             <div style={{ fontSize: 12, color: T.textM, marginTop: 2 }}>{b.modules} modules</div>
//           </div>
//         </div>
//         <span style={{ background: tc + "18", color: tc, border: `1px solid ${tc}30`, borderRadius: 99, padding: "3px 11px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, marginLeft: 8 }}>{b.tag}</span>
//       </div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
//         <span style={{ fontSize: 13, color: T.textM, display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{b.students} students</span>
//         <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.progress}%</span>
//       </div>
//       <div style={{ marginBottom: 18 }}><ProgressBar pct={b.progress} color={b.color} barBg={T.barBg} animate /></div>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <span style={{ fontSize: 12.5, color: T.textM, display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{b.next}</span>
//         <button style={{ background: b.color, color: "#fff", border: "none", borderRadius: 99, padding: "7px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Manage</button>
//       </div>
//     </div>
//   );
// }

// // ─── LIVE SESSIONS ────────────────────────────────────────────────────────────
// function LiveSessionsSection({ T }) {
//   const bp = useBreakpoint();
//   const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "300px";
//   return (
//     <section id="live" style={{ padding: "clamp(48px,6vw,80px) 0", background: T.bg, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><Play size={13} fill={T.orange} /> Real-Time Teaching</>}
//           title={<>Live <span style={{ color: T.orange }}>Classes</span></>}
//           sub="Join, manage, and schedule live sessions for your batches. Take attendance, share screen, and use the whiteboard."
//         />
//         <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(12px,1.5vw,20px)" }}>
//           {LIVE_SESSIONS.map(s => <LiveCard key={s.title} session={s} T={T} />)}
//         </div>
//       </div>
//     </section>
//   );
// }

// function LiveCard({ session: s, T }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
//       style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(16px,2vw,24px)", borderTop: `3px solid ${s.color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-2px)" : "none", transition: "all 0.22s" }}>
//       <div style={{ marginBottom: 6, minHeight: 22 }}>
//         {s.live && (
//           <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FEE2E2", color: "#ef4444", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
//             <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.4s infinite" }} />
//             LIVE NOW
//           </span>
//         )}
//       </div>
//       <h3 style={{ fontSize: "clamp(14px,1.2vw,16px)", fontWeight: 700, color: T.textH, margin: "8px 0 4px" }}>{s.title}</h3>
//       <div style={{ fontSize: 13, color: T.textM, marginBottom: 4 }}>{s.batch}</div>
//       <div style={{ fontSize: 13, color: T.textM, marginBottom: 18, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{s.time}</span>
//         <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{s.students} students</span>
//       </div>
//       <div style={{ display: "flex", gap: 10 }}>
//         <button style={{ flex: 2, background: s.live ? "#ef4444" : s.color, color: "#fff", border: "none", borderRadius: 99, padding: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
//           <Play size={13} fill="white" />{s.live ? "Join Now" : "Schedule"}
//         </button>
//         <button style={{ flex: 1, background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: 11, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
//           <Edit2 size={13} />Edit
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── STUDENTS ─────────────────────────────────────────────────────────────────
// function StudentsSection({ T }) {
//   const bp = useBreakpoint();
//   const isMobile = bp === "mobile" || bp === "mobileLg";
//   return (
//     <section id="students" style={{ padding: "clamp(48px,6vw,80px) 0", background: T.surface, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><Users size={13} /> Student Management</>}
//           title={<>Student <span style={{ color: T.orange }}>Reports</span></>}
//           sub="View attendance, quiz scores, assignment submissions, and performance status for every student."
//         />
//         <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow }}>
//           <div style={{ padding: "clamp(14px,2vw,20px) clamp(16px,2.5vw,28px)", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
//             <h3 style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 700, color: T.textH }}>Batch B2 — Java Backend Engineering</h3>
//             <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//               <button style={{ background: "transparent", color: T.textH, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
//                 <FileText size={13} />Export CSV
//               </button>
//               <button style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
//                 <CheckSquare size={13} />Take Attendance
//               </button>
//             </div>
//           </div>

//           {isMobile ? (
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               {STUDENTS.map(s => {
//                 const sc = STATUS_COLORS[s.status] || "#3b82f6";
//                 const SIcon = STATUS_ICONS[s.status] || CheckCircle;
//                 const attPct = parseFloat(s.att);
//                 const attColor = attPct >= 85 ? "#22c55e" : attPct >= 70 ? "#f59e0b" : "#ef4444";
//                 return (
//                   <div key={s.name} style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//                       <div style={{ fontSize: 14, fontWeight: 700, color: T.textH }}>{s.name}</div>
//                       <span style={{ background: sc + "14", color: sc, border: `1px solid ${sc}28`, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
//                         <SIcon size={10} />{s.status}
//                       </span>
//                     </div>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
//                       {[
//                         { lbl: "Attendance", val: s.att, color: attColor },
//                         { lbl: "Quiz Avg",   val: s.quiz, color: T.textH },
//                         { lbl: "Assignments",val: s.asgn, color: T.textH },
//                       ].map(cell => (
//                         <div key={cell.lbl} style={{ background: T.bg, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
//                           <div style={{ fontSize: 10, color: T.textM, marginBottom: 2 }}>{cell.lbl}</div>
//                           <div style={{ fontSize: 14, fontWeight: 700, color: cell.color }}>{cell.val}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     {["Student", "Batch", "Attendance", "Quiz Avg", "Assignments", "Status", "Action"].map(h => (
//                       <th key={h} style={{ padding: "12px clamp(12px,1.5vw,20px)", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.textM, letterSpacing: "0.07em", textTransform: "uppercase", background: T.tableTh, borderBottom: `1px solid ${T.border}` }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {STUDENTS.map(s => {
//                     const sc = STATUS_COLORS[s.status] || "#3b82f6";
//                     const SIcon = STATUS_ICONS[s.status] || CheckCircle;
//                     const attPct = parseFloat(s.att);
//                     const attColor = attPct >= 85 ? "#22c55e" : attPct >= 70 ? "#f59e0b" : "#ef4444";
//                     return (
//                       <tr key={s.name}>
//                         <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, fontWeight: 600, color: T.textH, borderBottom: `1px solid ${T.border}` }}>{s.name}</td>
//                         <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, color: T.textB, borderBottom: `1px solid ${T.border}` }}><span style={{ background: T.orangeLt, color: T.orange, borderRadius: 99, padding: "3px 11px", fontSize: 11.5, fontWeight: 700 }}>{s.batch}</span></td>
//                         <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, fontWeight: 600, color: attColor, borderBottom: `1px solid ${T.border}` }}>{s.att}</td>
//                         <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, fontWeight: 600, color: T.textH, borderBottom: `1px solid ${T.border}` }}>{s.quiz}</td>
//                         <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, color: T.textB, borderBottom: `1px solid ${T.border}` }}>{s.asgn}</td>
//                         <td style={{ padding: "14px clamp(12px,1.5vw,20px)", borderBottom: `1px solid ${T.border}` }}>
//                           <span style={{ background: sc + "14", color: sc, border: `1px solid ${sc}28`, borderRadius: 99, padding: "3px 10px", fontSize: 11.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
//                             <SIcon size={10} />{s.status}
//                           </span>
//                         </td>
//                         <td style={{ padding: "14px clamp(12px,1.5vw,20px)", borderBottom: `1px solid ${T.border}` }}>
//                           <button style={{ background: "transparent", color: T.orange, border: `1.5px solid ${sc}40`, borderRadius: 99, padding: "5px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
//                             <ChevronRight size={13} />View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────
// function AssignmentsSection({ T }) {
//   const bp = useBreakpoint();
//   const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "300px";
//   return (
//     <section id="assignments" style={{ padding: "clamp(48px,6vw,80px) 0", background: T.bg, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><ClipboardList size={13} /> Assignments & Quizzes</>}
//           title={<>Manage <span style={{ color: T.orange }}>Assignments</span></>}
//           sub="Create, review and grade assignments. Track submissions and send reminders to lagging students."
//         />
//         <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(12px,1.5vw,20px)" }}>
//           {ASSIGNMENTS.map(a => <AssignmentCard key={a.title} assignment={a} T={T} />)}
//         </div>
//       </div>
//     </section>
//   );
// }

// function AssignmentCard({ assignment: a, T }) {
//   const pct = Math.round((a.submitted / a.total) * 100);
//   const pending = a.total - a.submitted;
//   const [hov, setHov] = useState(false);
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
//       style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(16px,2vw,24px)", borderTop: `3px solid ${a.color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-2px)" : "none", transition: "all 0.22s" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
//         <div style={{ background: a.bg, borderRadius: 12, padding: 10 }}><ClipboardList size={18} color={a.color} /></div>
//         <span style={{ background: a.bg, color: a.color, borderRadius: 99, padding: "3px 11px", fontSize: 11.5, fontWeight: 700 }}>{a.batch}</span>
//       </div>
//       <div style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 700, color: T.textH, marginBottom: 4 }}>{a.title}</div>
//       <div style={{ fontSize: 12.5, color: T.textM, marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />Due: {a.due}</div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
//         <span style={{ fontSize: 13, color: T.textM }}>{a.submitted}/{a.total} submitted</span>
//         <span style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{pct}%</span>
//       </div>
//       <div style={{ marginBottom: pending > 0 ? 10 : 16 }}><ProgressBar pct={pct} color={a.color} barBg={T.barBg} animate /></div>
//       {pending > 0 && (
//         <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "7px 12px", marginBottom: 14, fontSize: 12.5, color: "#ef4444", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
//           <AlertCircle size={13} />{pending} students haven't submitted
//         </div>
//       )}
//       <div style={{ display: "flex", gap: 10 }}>
//         <button style={{ flex: 1, background: a.color, color: "#fff", border: "none", borderRadius: 99, padding: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Review</button>
//         <button style={{ flex: 1, background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Edit2 size={13} />Edit</button>
//       </div>
//     </div>
//   );
// }

// // ─── COURSE MANAGEMENT ────────────────────────────────────────────────────────
// function CourseManagementSection({ T }) {
//   const bp = useBreakpoint();
//   const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "240px";
//   return (
//     <section style={{ padding: "clamp(48px,6vw,80px) 0", background: T.surface, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><BookOpen size={13} /> Content</>}
//           title={<>Course <span style={{ color: T.orange }}>Management</span></>}
//           sub="Upload videos, manage modules, study plans, and recorded sessions all from one place."
//         />
//         <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(12px,1.5vw,20px)" }}>
//           {COURSE_ITEMS.map(c => (
//             <div key={c.title} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(20px,2vw,28px) clamp(16px,2vw,24px)", borderTop: `3px solid ${c.color}`, boxShadow: T.shadow, cursor: "pointer" }}>
//               <div style={{ width: 48, height: 48, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
//                 <c.Icon size={20} color={c.color} />
//               </div>
//               <div style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 700, color: c.color, marginBottom: 8 }}>{c.title}</div>
//               <div style={{ fontSize: "clamp(12px,1vw,14px)", color: T.textB, lineHeight: 1.6, marginBottom: 18 }}>{c.desc}</div>
//               <button style={{ background: c.color, color: "#fff", border: "none", borderRadius: 99, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{c.btn}</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── PERFORMANCE ──────────────────────────────────────────────────────────────
// function PerformanceSection({ T }) {
//   const bp = useBreakpoint();
//   const isMobile = bp === "mobile" || bp === "mobileLg";
//   return (
//     <section style={{ padding: "clamp(48px,6vw,80px) 0", background: T.bg, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(32px,4vw,56px)", alignItems: "center" }}>
//           <div>
//             <SectionPill T={T}><BarChart2 size={13} /> AI Analysis</SectionPill>
//             <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: T.textH, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 14, textAlign: "left" }}>
//               Batch <span style={{ color: T.orange }}>Performance</span>
//             </h2>
//             <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: T.textB, lineHeight: 1.65, marginBottom: 30, maxWidth: 380 }}>
//               AI-powered insights on quiz averages, assignment completion, attendance trends, and live session engagement.
//             </p>
//             <button style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}>
//               <TrendingUp size={16} />Full Report
//             </button>
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
//             {PERF.map(p => (
//               <div key={p.name}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
//                   <span style={{ fontSize: "clamp(13px,1.2vw,14.5px)", fontWeight: 600, color: T.textH, display: "flex", alignItems: "center", gap: 6 }}>
//                     <p.Icon size={14} color={p.color} />{p.name}
//                   </span>
//                   <span style={{ fontSize: 14, fontWeight: 800, color: p.color }}>{p.pct}%</span>
//                 </div>
//                 <ProgressBar pct={p.pct} color={p.color} barBg={T.barBg} animate />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── WHITEBOARD ───────────────────────────────────────────────────────────────
// function WhiteboardSection({ T, theme }) {
//   const canvasRef = useRef(null);
//   const wrapRef   = useRef(null);
//   const drawing   = useRef(false);
//   const ctx       = useRef(null);
//   const [activeToolIdx, setActiveToolIdx] = useState(0);
//   const [wbColor, setWbColor]             = useState("#F97316");
//   const [showHint, setShowHint]           = useState(true);

//   const tools  = [
//     { icon: <PenTool size={13} />, label: "Pen" },
//     { icon: <Edit2 size={13} />,   label: "Shape" },
//     { icon: <FileText size={13} />,label: "Text" },
//     { icon: <XCircle size={13} />, label: "Eraser" },
//   ];
//   const colors = ["#F97316", "#3b82f6", "#22c55e", theme === "dark" ? "#FFFFFF" : "#1A2332"];

//   const initCanvas = useCallback(() => {
//     const cvs = canvasRef.current;
//     const wrap = wrapRef.current;
//     if (!cvs || !wrap) return;
//     cvs.width  = wrap.offsetWidth;
//     cvs.height = wrap.offsetHeight;
//     ctx.current = cvs.getContext("2d");

// ctx.current.fillStyle =
//   theme === "dark"
//     ? "#171717"
//     : "#FFFFFF";

// ctx.current.fillRect(
//   0,
//   0,
//   cvs.width,
//   cvs.height
// );

// ctx.current.lineCap = "round";
// ctx.current.lineJoin = "round";
// ctx.current.lineWidth = 3;
// ctx.current.strokeStyle = wbColor;
// }, [wbColor, theme]);

//   useEffect(() => {
//     initCanvas();
//     window.addEventListener("resize", initCanvas);
//     return () => window.removeEventListener("resize", initCanvas);
//   }, [initCanvas]);

//   const getPos = (e) => {
//     const r = canvasRef.current.getBoundingClientRect();
//     const touch = e.touches?.[0];
//     return touch ? [touch.clientX - r.left, touch.clientY - r.top] : [e.clientX - r.left, e.clientY - r.top];
//   };

//   return (
//     <section style={{ padding: "clamp(48px,6vw,80px) 0", background: T.surface, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T} pill={<><PenTool size={13} /> Interactive Teaching</>} title={<>Whiteboard <span style={{ color: T.orange }}>Panel</span></>} sub="Draw, annotate, and explain concepts in real time. Share the board live with your students during sessions." />
//         <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", maxWidth: 860, margin: "0 auto", boxShadow: T.shadow }}>
//           <div style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "14px 22px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//             {tools.map((t, i) => (
//               <button key={t.label} onClick={() => setActiveToolIdx(i)}
//                 style={{ background: activeToolIdx === i ? T.orangeLt : T.surface, border: `1.5px solid ${activeToolIdx === i ? T.orange : T.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, color: activeToolIdx === i ? T.orange : T.textB, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
//                 {t.icon}{t.label}
//               </button>
//             ))}
//             <div style={{ flex: 1 }} />
//             <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//               {colors.map(c => (
//                 <div key={c} onClick={() => { setWbColor(c); if (ctx.current) ctx.current.strokeStyle = c; }}
//                   style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: "2px solid rgba(0,0,0,0.15)", cursor: "pointer", boxShadow: wbColor === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none" }} />
//               ))}
//             </div>
//           </div>
//           <div ref={wrapRef} style={{ background: "#FAFAF8", height: "clamp(200px,30vw,280px)", position: "relative", overflow: "hidden" }}>
//           <canvas
//   ref={canvasRef}
//   style={{
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     cursor: "crosshair",
//     background: theme === "dark"
//       ? "#171717"
//       : "#FFFFFF"
//   }}

//               onMouseDown={e => { drawing.current = true; setShowHint(false); const [x, y] = getPos(e); ctx.current?.beginPath(); ctx.current?.moveTo(x, y); }}
//               onMouseMove={e => { if (!drawing.current || !ctx.current) return; const [x, y] = getPos(e); ctx.current.lineTo(x, y); ctx.current.stroke(); }}
//               onMouseUp={() => { drawing.current = false; }}
//               onMouseLeave={() => { drawing.current = false; }}
//               onTouchStart={e => { e.preventDefault(); drawing.current = true; setShowHint(false); const [x, y] = getPos(e); ctx.current?.beginPath(); ctx.current?.moveTo(x, y); }}
//               onTouchMove={e => { e.preventDefault(); if (!drawing.current || !ctx.current) return; const [x, y] = getPos(e); ctx.current.lineTo(x, y); ctx.current.stroke(); }}
//               onTouchEnd={() => { drawing.current = false; }}
//             />
//             {showHint && (
//               <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, pointerEvents: "none" }}>
//                 <PenTool size={36} color="#CBD5E0" />
//                 <div style={{ fontSize: 14, fontWeight: 600, color: "#A0AEC0" }}>Click and drag to draw</div>
//               </div>
//             )}
//           </div>
//           <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 22px", display: "flex", gap: 10, flexWrap: "wrap", background: T.surface }}>
//             <button style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}><Send size={13} />Share to Students</button>
//             <button onClick={() => { ctx.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); setShowHint(true); }}
//               style={{ background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear Board</button>
//             <button style={{ background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}><FileText size={13} />Save as PDF</button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── DISCUSSION ───────────────────────────────────────────────────────────────
// function DiscussionSection({ T }) {
//   const bp = useBreakpoint();
//   const isMobile = bp === "mobile" || bp === "mobileLg";
//   const [threads, setThreads]     = useState(INITIAL_THREADS);
//   const [messages, setMessages]   = useState(INITIAL_MESSAGES);
//   const [activeId, setActiveId]   = useState(1);
//   const [discInput, setDiscInput] = useState("");
//   const [discTab, setDiscTab]     = useState("Direct");
//   const [showList, setShowList]   = useState(true);
//   const msgEndRef = useRef(null);

//   useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeId]);

//   const activeThread = threads.find(t => t.id === activeId);

//   const switchThread = (id) => {
//     setActiveId(id);
//     setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t));
//     if (isMobile) setShowList(false);
//   };

//   const sendDisc = () => {
//     const val = discInput.trim();
//     if (!val) return;
//     const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
//     setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), { role: "trainer", text: val, time: now }] }));
//     setThreads(prev => prev.map(t => t.id === activeId ? { ...t, preview: val, time: "just now" } : t));
//     setDiscInput("");
//   };

//   const chatHeight = isMobile ? 420 : 580;

//   return (
//     <section id="discussion" style={{ padding: "clamp(48px,6vw,80px) 0", background: T.bg, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><MessageSquare size={13} /> Trainer–Student Chat</>}
//           title={<>Discussion <span style={{ color: T.orange }}>Panel</span></>}
//           sub="Reply to student questions, share resources, and keep every batch conversation organized."
//         />
//         <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: 16, maxWidth: 1100, margin: "0 auto" }}>

//           {(!isMobile || showList) && (
//             <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow, height: chatHeight, display: "flex", flexDirection: "column" }}>
//               <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, fontSize: 13, fontWeight: 700, color: T.textM, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 Conversations <span style={{ fontSize: 11, background: T.orange, color: "#fff", borderRadius: 99, padding: "2px 8px" }}>7 New</span>
//               </div>
//               <div style={{ flex: 1, overflowY: "auto" }}>
//                 {threads.map(t => (
//                   <div key={t.id} onClick={() => switchThread(t.id)}
//                     style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, cursor: "pointer", background: t.id === activeId && !isMobile ? T.orangeLt : "transparent", borderLeft: t.id === activeId && !isMobile ? `3px solid ${T.orange}` : "3px solid transparent", display: "flex", alignItems: "flex-start", gap: 10, transition: "background 0.15s" }}>
//                     <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{t.initials}</div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ fontSize: 13, fontWeight: 700, color: T.textH, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
//                       <div style={{ fontSize: 11.5, color: T.textM, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{t.preview}</div>
//                       <div style={{ fontSize: 10.5, color: T.textM, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                         <span>{t.batch}</span>
//                         <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                           {t.time}
//                           {t.unread > 0 && <span style={{ minWidth: 17, height: 17, borderRadius: 99, background: T.orange, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{t.unread}</span>}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {(!isMobile || !showList) && (
//             <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow, height: chatHeight, display: "flex", flexDirection: "column" }}>
//               <div style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
//                 {isMobile && (
//                   <button onClick={() => setShowList(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", marginRight: 4 }}>
//                     <ChevronRight size={18} style={{ transform: "rotate(180deg)" }} color={T.textH} />
//                   </button>
//                 )}
//                 <div style={{ width: 38, height: 38, borderRadius: 11, background: activeThread?.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>{activeThread?.initials}</div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: T.textH }}>{activeThread?.name}</div>
//                   <div style={{ fontSize: 11.5, color: T.textM }}>{activeThread?.batch}</div>
//                 </div>
//                 {!isMobile && (
//                   <div style={{ display: "flex", gap: 6 }}>
//                     {["Direct", "Batch Group", "Announcement"].map(tab => (
//                       <button key={tab} onClick={() => setDiscTab(tab)}
//                         style={{ background: discTab === tab ? T.orangeLt : "transparent", border: `1.5px solid ${discTab === tab ? T.orange : T.border}`, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: discTab === tab ? T.orange : T.textM, cursor: "pointer", fontFamily: "inherit" }}>{tab}</button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, background: T.surface }}>
//                 {(messages[activeId] || []).map((m, i) => (
//                   <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "trainer" ? "row-reverse" : "row" }}>
//                     <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: m.role === "trainer" ? T.orange : activeThread?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
//                       {m.role === "trainer" ? "RS" : activeThread?.initials}
//                     </div>
//                     <div style={{ maxWidth: "72%" }}>
//                       <div style={{ padding: "10px 14px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.6, background: m.role === "trainer" ? T.orange : T.bg, color: m.role === "trainer" ? "#fff" : T.textH, border: m.role === "trainer" ? "none" : `1px solid ${T.border}`, borderBottomRightRadius: m.role === "trainer" ? 4 : 12, borderBottomLeftRadius: m.role === "student" ? 4 : 12 }}>
//                         {m.text}
//                       </div>
//                       <div style={{ fontSize: 10.5, color: T.textM, marginTop: 3, textAlign: m.role === "trainer" ? "right" : "left" }}>{m.time}</div>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={msgEndRef} />
//               </div>

//               <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", background: T.surface }}>
//                 <input value={discInput} onChange={e => setDiscInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendDisc()}
//                   placeholder={`Reply to ${activeThread?.name}...`}
//                   style={{ flex: 1, background: T.inputBg, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "10px 16px", fontSize: 14, fontFamily: "inherit", color: T.textH, outline: "none" }} />
//                 <button onClick={sendDisc}
//                   style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
//                   <Send size={14} />{!isMobile && "Send"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── AI COMPANION ─────────────────────────────────────────────────────────────
// function AICompanionSection({ T }) {
//   const [aiMessages, setAiMessages] = useState(AI_INITIAL_MESSAGES);
//   const [aiInput, setAiInput]       = useState("");
//   const chatEndRef = useRef(null);

//   useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages]);

//   const sendMsg = () => {
//     const val = aiInput.trim();
//     if (!val) return;
//     setAiMessages(prev => [...prev, { role: "user", text: val }]);
//     setAiInput("");
//     setTimeout(() => {
//       setAiMessages(prev => [...prev, { role: "bot", text: `✅ Working on "${val}"...\n\nI'm analyzing your batch data. You can also ask me to:\n• Generate quiz questions for any topic\n• Draft a lesson plan for tomorrow\n• Summarize a student's overall performance` }]);
//     }, 700);
//   };

//   return (
//     <section id="ai-companion" style={{ padding: "clamp(48px,6vw,80px) 0", background: T.surface, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T}
//           pill={<><Bot size={13} /> AI Powered</>}
//           title={<>Your <span style={{ color: T.orange }}>AI Companion</span></>}
//           sub="Generate quizzes, draft lesson plans, summarize sessions, and resolve student doubts — instantly."
//         />
//         <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, maxWidth: 740, margin: "0 auto", boxShadow: T.shadow, overflow: "hidden" }}>
//           <div style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
//             <div style={{ width: 40, height: 40, borderRadius: 12, background: T.orangeLt, border: `1.5px solid ${T.orangeBd}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Bot size={20} color={T.orange} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{ fontSize: 15, fontWeight: 700, color: T.textH }}>Ilmora AI — Trainer Mode</div>
//               <div style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
//                 <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
//                 Online & Ready
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//               {[{ label: "Quiz Gen", Icon: ClipboardList }, { label: "Lesson Plan", Icon: BookOpen }, { label: "Doubt Solver", Icon: HelpCircle }].map(b => (
//                 <button key={b.label} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: T.textB, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
//                   <b.Icon size={12} />{b.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div style={{ padding: "20px 24px", maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: T.surface }}>
//             {aiMessages.map((m, i) => (
//               <div key={i} style={{ padding: "12px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.65, maxWidth: "86%", background: m.role === "user" ? T.orange : T.bg, color: m.role === "user" ? "#fff" : T.textH, border: m.role === "bot" ? `1px solid ${T.border}` : "none", borderBottomLeftRadius: m.role === "bot" ? 4 : 14, borderBottomRightRadius: m.role === "user" ? 4 : 14, marginLeft: m.role === "user" ? "auto" : 0, whiteSpace: "pre-line" }}>
//                 {m.html ? <span dangerouslySetInnerHTML={{ __html: m.text }} /> : m.text}
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>
//           <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 24px", display: "flex", gap: 10, background: T.surface }}>
//             <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
//               placeholder="Ask me to generate a quiz, plan a lesson, resolve a doubt..."
//               style={{ flex: 1, background: T.inputBg, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "11px 18px", fontSize: 14, fontFamily: "inherit", color: T.textH, outline: "none" }} />
//             <button onClick={sendMsg} style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
//               <Send size={15} />Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── ACTIVITY ─────────────────────────────────────────────────────────────────
// function ActivitySection({ T }) {
//   return (
//     <section style={{ padding: "clamp(48px,6vw,80px) 0", background: T.bg, transition: "background 0.3s" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
//         <SectionHead T={T} pill={<><Activity size={13} /> Timeline</>} title={<>Recent <span style={{ color: T.orange }}>Activity</span></>} />
//         <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
//           {ACTIVITIES.map((a, i) => (
//             <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 13, padding: "clamp(12px,1.5vw,14px) clamp(14px,2vw,20px)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
//               <div style={{ width: 38, height: 38, borderRadius: 10, background: a.ibg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <a.Icon size={16} color={a.ic} />
//               </div>
//               <div>
//                 <div style={{ fontSize: "clamp(13px,1.2vw,14px)", fontWeight: 600, color: T.textH }}>{a.text}</div>
//                 <div style={{ fontSize: 12, color: T.textM, marginTop: 2 }}>{a.sub}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── CTA ──────────────────────────────────────────────────────────────────────
// function CTASection({ T, theme }) {
//   return (
//     <div style={{ background: theme === "dark"
//       ? "#111111"
//       : T.textH, padding: "clamp(56px,7vw,88px) 0", textAlign: "center", position: "relative", overflow: "hidden", transition: "background 0.3s" }}>
//       <div style={{ position: "absolute", width: 340, height: 340, top: -80, left: -80, borderRadius: "50%", background: "rgba(249,115,22,0.12)", filter: "blur(60px)", pointerEvents: "none" }} />
//       <div style={{ position: "absolute", width: 280, height: 280, bottom: -60, right: -60, borderRadius: "50%", background: "rgba(249,115,22,0.12)", filter: "blur(60px)", pointerEvents: "none" }} />
//       <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)", position: "relative", zIndex: 1 }}>
//         <SectionPill T={T}><Play size={13} fill={T.orange} /> Teach Live</SectionPill>
//         <h2 style={{ fontSize: "clamp(26px,4vw,48px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 18 }}>
//           Ready to Inspire <span style={{ color: T.orange }}>Your Next Batch?</span>
//         </h2>
//         <p style={{ fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "0 auto", lineHeight: 1.65 }}>
//           Start a live session, upload content, or let AI design today's lesson plan for you.
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
// // ✅ FIX: Receives theme & toggleTheme from App.jsx via the route.
// //    No internal theme state — App.jsx owns it, this component just uses it.
// export default function TrainerHub({ theme = "light", toggleTheme = () => {} }) {
//   const isDark = theme === "dark";
//   const T = getT(isDark);

//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [navShadow, setNavShadow]         = useState(`0 1px 0 ${T.border}`);
//   const mounted = useRef(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const timer = setTimeout(() => { mounted.current = true; }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const onScroll = () => {
//       if (!mounted.current) return;
//       setNavShadow(window.scrollY > 10 ? "0 2px 12px rgba(0,0,0,0.08)" : `0 1px 0 ${T.border}`);
//       const sections = ["dashboard", "batches", "live", "students", "assignments", "discussion", "ai-companion"];
//       for (const id of [...sections].reverse()) {
//         const el = document.getElementById(id);
//         if (el && window.scrollY >= el.offsetTop - 80) { setActiveSection(id); break; }
//       }
//     };
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, [T.border]);

//   return (
//     <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: T.bg, color: T.textB, fontSize: 16, lineHeight: 1.6, transition: "background 0.3s, color 0.3s" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
//         ::-webkit-scrollbar { width: 6px; height: 6px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #D4C8BE; border-radius: 3px; }
//         button:hover { opacity: 0.92; }
//       `}</style>

//       {/* ✅ Pass both theme and toggleTheme so the toggle button works */}
//       <Navbar
//         activeSection={activeSection}
//         navShadow={navShadow}
//         theme={theme}
//         toggleTheme={toggleTheme}
//         T={T}
//       />

//       <HeroSection T={T} />
//       <TrainerToolsSection T={T} />
//       <BatchesSection T={T} />
//       <LiveSessionsSection T={T} />
//       <StudentsSection T={T} />
//       <AssignmentsSection T={T} />
//       <CourseManagementSection T={T} />
//       <PerformanceSection T={T} />
//       <WhiteboardSection T={T} theme={theme} />
//       <DiscussionSection T={T} />
//       <AICompanionSection T={T} />
//       <ActivitySection T={T} />
//       <CTASection T={T} theme={theme} />
//     </div>
//   );
// }















































































































import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, LayoutGrid, Calendar, ClipboardList, MessageSquare, Bot,
  Play, Edit2, Upload, BookOpen, BarChart2, Mic, CheckSquare,
  HelpCircle, Video, Map, Settings, PenTool, Layers, Star,
  Send, ChevronRight, Activity, Bell, Zap, Award, TrendingUp,
  FileText, Folder, Clock, AlertCircle, CheckCircle, XCircle,
  Sun, Moon,
} from "lucide-react";
import PublicLayout from "../Landing/components/PublicLayout";

const getT = (isDark) => ({
  bg:        isDark ? "#0A0A0A" : "#EDE8E1",
  bgSec:     isDark ? "#111111" : "#E8E2DA",
  surface:   isDark ? "#171717" : "#FFFFFF",
  navBg:     isDark ? "#000000" : "#FFFFFF",

  textH:     isDark ? "#FFFFFF" : "#1A2332",
  textB:     isDark ? "#A1A1AA" : "#4A5568",
  textM:     isDark ? "#71717A" : "#718096",

  orange:    "#F97316",
  orangeLt:  isDark ? "rgba(249,115,22,0.12)" : "#FFF0E6",
  orangeBd:  isDark ? "rgba(249,115,22,0.35)" : "#FDBA74",

  border:    isDark ? "rgba(255,255,255,0.12)" : "#E8E2D9",
  borderHov: isDark ? "rgba(255,255,255,0.20)" : "#D4C8BE",

  shadow:    isDark
    ? "0 10px 30px rgba(0,0,0,0.45)"
    : "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)",

  shadowHov: isDark
    ? "0 20px 40px rgba(0,0,0,0.60)"
    : "0 4px 12px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.08)",

  barBg:     isDark ? "rgba(255,255,255,0.08)" : "#F0EBE4",

  inputBg:   isDark ? "#111111" : "#EDE8E1",

  tableTh:   isDark ? "#1A1A1A" : "#FAF8F5",
  tableRow:  isDark ? "#141414" : "#F5F2EE",

  codeBg:    isDark ? "#111827" : "#1C2333",
});

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const FEATURES = [
  { color: "#F97316", bg: "#FFF0E6", Icon: Mic,           title: "Live Session Controls",     desc: "Host and manage live classes with attendance, polls, screen share, and recording." },
  { color: "#6366f1", bg: "#EEF2FF", Icon: Layers,        title: "Batch Management",          desc: "Create multiple batches, track progress, and assign study plans per batch." },
  { color: "#22c55e", bg: "#F0FDF4", Icon: CheckSquare,   title: "Attendance Tracker",        desc: "Mark, view and export attendance. Get alerts for consistently absent students." },
  { color: "#a855f7", bg: "#FDF4FF", Icon: Bot,           title: "AI Companion",              desc: "Generate quizzes, lesson plans, and feedback instantly with AI assistance." },
  { color: "#f59e0b", bg: "#FFFBEB", Icon: ClipboardList, title: "Quiz & Assignment Creator", desc: "Build MCQ, coding, and file-submission assessments with auto-grading." },
  { color: "#ef4444", bg: "#FEF2F2", Icon: HelpCircle,    title: "Doubts Management",        desc: "Receive, reply, and track student doubts. AI suggests answers for frequent questions." },
  { color: "#06b6d4", bg: "#ECFEFF", Icon: Folder,        title: "Course Modules & Files",    desc: "Upload videos and PDFs. Organize content into modules with progress-gated access." },
  { color: "#10b981", bg: "#ECFDF5", Icon: BarChart2,     title: "Performance Analysis",      desc: "AI insights on quiz averages, assignment completion, and skill gap identification." },
  { color: "#F97316", bg: "#FFF0E6", Icon: PenTool,       title: "Whiteboard Panel",          desc: "Interactive whiteboard with drawing tools and real-time sharing during sessions." },
  { color: "#6366f1", bg: "#EEF2FF", Icon: Video,         title: "Recorded Classes",          desc: "Upload and manage session recordings. Students can replay at their own pace." },
  { color: "#22c55e", bg: "#F0FDF4", Icon: Map,           title: "Study Plan Builder",        desc: "Design week-by-week study milestones per batch. Students get a clear roadmap." },
  { color: "#a855f7", bg: "#FDF4FF", Icon: Settings,      title: "Trainer Settings",          desc: "Manage availability, theme, notifications, and your public trainer profile." },
];

const BATCHES = [
  { color: "#F97316", code: "B2", name: "Java Backend Engineering",   students: 42, progress: 68, tag: "Active",      modules: "12/18", next: "Today 6:00 PM" },
  { color: "#6366f1", code: "B4", name: "React Frontend Development", students: 38, progress: 45, tag: "Active",      modules: "8/18",  next: "Tomorrow 5:00 PM" },
  { color: "#22c55e", code: "B5", name: "Data Science & ML",          students: 55, progress: 22, tag: "New",         modules: "4/20",  next: "Today 8:00 PM" },
  { color: "#a855f7", code: "B1", name: "DevOps & Cloud AWS",         students: 30, progress: 89, tag: "Ending Soon", modules: "16/18", next: "Wed 4:00 PM" },
  { color: "#f59e0b", code: "B6", name: "System Design Masterclass",  students: 47, progress: 55, tag: "Active",      modules: "11/20", next: "Thu 7:00 PM" },
  { color: "#06b6d4", code: "B3", name: "Python Full Stack",          students: 36, progress: 78, tag: "Active",      modules: "14/18", next: "Fri 5:30 PM" },
];

const TAG_COLORS = { Active: "#22c55e", New: "#3b82f6", "Ending Soon": "#f59e0b" };

const LIVE_SESSIONS = [
  { color: "#F97316", title: "Java Collections Deep Dive",  batch: "Batch B2 · Java Backend",   time: "Today 6:00 PM",    students: 42, live: true },
  { color: "#6366f1", title: "React Hooks & Context API",   batch: "Batch B4 · React Frontend", time: "Today 8:00 PM",    students: 38, live: false },
  { color: "#22c55e", title: "Pandas & Data Cleaning",      batch: "Batch B5 · Data Science",   time: "Tomorrow 5:00 PM", students: 55, live: false },
];

const STUDENTS = [
  { name: "Aarav Sharma",  batch: "B2", att: "92%", quiz: "88%", asgn: "5/6", status: "On Track" },
  { name: "Priya Verma",   batch: "B2", att: "78%", quiz: "72%", asgn: "4/6", status: "Needs Attention" },
  { name: "Rohan Singh",   batch: "B4", att: "95%", quiz: "91%", asgn: "6/6", status: "Excellent" },
  { name: "Sneha Patel",   batch: "B2", att: "60%", quiz: "65%", asgn: "3/6", status: "At Risk" },
  { name: "Karan Mehta",   batch: "B5", att: "88%", quiz: "79%", asgn: "5/6", status: "On Track" },
  { name: "Ananya Joshi",  batch: "B4", att: "97%", quiz: "94%", asgn: "6/6", status: "Excellent" },
];

const STATUS_COLORS = { Excellent: "#22c55e", "On Track": "#3b82f6", "Needs Attention": "#f59e0b", "At Risk": "#ef4444" };
const STATUS_ICONS  = { Excellent: CheckCircle, "On Track": CheckCircle, "Needs Attention": AlertCircle, "At Risk": XCircle };

const ASSIGNMENTS = [
  { color: "#F97316", bg: "#FFF0E6", title: "REST API Implementation",  batch: "B2 · Java",         submitted: 38, total: 42, due: "Dec 18" },
  { color: "#6366f1", bg: "#EEF2FF", title: "React Dashboard Project",  batch: "B4 · React",         submitted: 30, total: 38, due: "Dec 20" },
  { color: "#22c55e", bg: "#F0FDF4", title: "EDA on Dataset",           batch: "B5 · Data Science",  submitted: 44, total: 55, due: "Dec 22" },
  { color: "#a855f7", bg: "#FDF4FF", title: "CI/CD Pipeline Setup",     batch: "B1 · DevOps",        submitted: 29, total: 30, due: "Dec 15" },
  { color: "#f59e0b", bg: "#FFFBEB", title: "Design Twitter System",    batch: "B6 · System Design", submitted: 35, total: 47, due: "Dec 24" },
  { color: "#06b6d4", bg: "#ECFEFF", title: "Flask CRUD App",           batch: "B3 · Python",        submitted: 33, total: 36, due: "Dec 19" },
];

const COURSE_ITEMS = [
  { color: "#F97316", bg: "#FFF0E6", Icon: Upload,      title: "Upload Videos",        desc: "Upload lectures, demos, and walkthroughs for your batch.",              btn: "Upload Now" },
  { color: "#6366f1", bg: "#EEF2FF", Icon: BookOpen,    title: "Course Modules",        desc: "Organize lessons into modules with ordered, progress-gated access.",    btn: "Manage" },
  { color: "#22c55e", bg: "#F0FDF4", Icon: Map,         title: "Study Plan Builder",    desc: "Create weekly milestones and schedules for each batch automatically.",  btn: "Build Plan" },
  { color: "#a855f7", bg: "#FDF4FF", Icon: Video,       title: "Recorded Classes",      desc: "Manage your session recording library. Students replay anytime.",       btn: "View Library" },
  { color: "#f59e0b", bg: "#FFFBEB", Icon: FileText,    title: "File List & Resources", desc: "Upload PDFs, notes, and references for students to access anytime.",   btn: "Manage Files" },
  { color: "#06b6d4", bg: "#ECFEFF", Icon: Edit2,       title: "Edit Assignments",      desc: "Update deadlines, modify questions, or extend submissions per student.",btn: "Edit Now" },
];

const PERF = [
  { name: "Quiz Average Score",      pct: 81, color: "#F97316", Icon: Star },
  { name: "Assignment Completion",   pct: 88, color: "#6366f1", Icon: ClipboardList },
  { name: "Attendance Rate",         pct: 87, color: "#22c55e", Icon: CheckSquare },
  { name: "Live Session Engagement", pct: 74, color: "#a855f7", Icon: Zap },
  { name: "Doubt Resolution Speed",  pct: 92, color: "#f59e0b", Icon: HelpCircle },
];

const ACTIVITIES = [
  { ic: "#22c55e", ibg: "#F0FDF4", Icon: CheckCircle,  text: "Graded 12 Java Assignment submissions",           sub: "Batch B2 · 1 hour ago" },
  { ic: "#6366f1", ibg: "#EEF2FF", Icon: Video,        text: "Completed Live Session — React Hooks",            sub: "Batch B4 · 90 mins · 3 hours ago" },
  { ic: "#a855f7", ibg: "#FDF4FF", Icon: Bot,          text: "Resolved 5 student doubts via AI Companion",      sub: "Multiple batches · 5 hours ago" },
  { ic: "#F97316", ibg: "#FFF0E6", Icon: Upload,       text: "Uploaded new video — Spring Boot REST APIs",      sub: "Batch B2 · Yesterday" },
  { ic: "#f59e0b", ibg: "#FFFBEB", Icon: ClipboardList,text: "Created new Quiz — Data Structures MCQ (20 Qs)", sub: "Batch B5 · 2 days ago" },
];

const INITIAL_THREADS = [
  { id: 1, name: "Aarav Sharma",  initials: "AS", color: "#F97316", batch: "B2 · Java",         preview: "Sir, HashMap vs LinkedHashMap?",    time: "5m",  unread: 2 },
  { id: 2, name: "Priya Verma",   initials: "PV", color: "#6366f1", batch: "B2 · Java",         preview: "Assignment submission link broken", time: "12m", unread: 1 },
  { id: 3, name: "Rohan Singh",   initials: "RS", color: "#22c55e", batch: "B4 · React",        preview: "useEffect cleanup query",           time: "1h",  unread: 0 },
  { id: 4, name: "Sneha Patel",   initials: "SP", color: "#ef4444", batch: "B2 · Java",         preview: "Can I get an extension please?",    time: "2h",  unread: 3 },
  { id: 5, name: "Karan Mehta",   initials: "KM", color: "#f59e0b", batch: "B5 · Data Science", preview: "Pandas groupby doubt",              time: "3h",  unread: 0 },
  { id: 6, name: "Ananya Joshi",  initials: "AJ", color: "#a855f7", batch: "B4 · React",        preview: "Loved today's session! 🔥",         time: "5h",  unread: 0 },
];

const INITIAL_MESSAGES = {
  1: [
    { role: "student", text: "Sir, good evening! I have a doubt about HashMap vs LinkedHashMap. When should I prefer one over the other?", time: "6:02 PM" },
    { role: "trainer", text: "Great question Aarav! HashMap gives O(1) for get/put but doesn't maintain insertion order. LinkedHashMap maintains insertion order with a small overhead.", time: "6:05 PM" },
    { role: "student", text: "Understood! So for a cache eviction policy, LinkedHashMap makes more sense?", time: "6:07 PM" },
    { role: "trainer", text: "Exactly! Override removeEldestEntry() in LinkedHashMap and you get a ready-made LRU cache. Try coding that as a bonus exercise 💪", time: "6:09 PM" },
  ],
  2: [
    { role: "student", text: "Sir the assignment submission link is showing 404 error. Please check.", time: "5:48 PM" },
    { role: "trainer", text: "Hi Priya, thanks for flagging this. I'm looking into it right now.", time: "5:52 PM" },
    { role: "student", text: "It's still not working, all my batchmates are also facing the same issue.", time: "5:55 PM" },
  ],
  3: [
    { role: "student", text: "Sir in useEffect, when exactly should I return a cleanup function?", time: "4:00 PM" },
    { role: "trainer", text: "Return a cleanup whenever your effect sets up subscriptions, timers, or event listeners.", time: "4:05 PM" },
    { role: "student", text: "Got it! So for WebSocket connections and setInterval both need cleanup. Makes sense!", time: "4:07 PM" },
  ],
  4: [
    { role: "student", text: "Sir please can I get a 2-day extension for REST API assignment? I had exams.", time: "3:00 PM" },
    { role: "student", text: "I've already done 80% of it, just need to finish the exception handling part.", time: "3:01 PM" },
    { role: "student", text: "Sir please reply 🙏", time: "3:30 PM" },
  ],
  5: [
    { role: "student", text: "Sir in groupby, how do I apply multiple aggregation functions at once?", time: "2:00 PM" },
    { role: "trainer", text: "Use .agg() with a dict — e.g. df.groupby('col').agg({'salary': ['mean','max'], 'age': 'count'}). Very powerful!", time: "2:10 PM" },
  ],
  6: [
    { role: "student", text: "Sir today's session on React Context was amazing! Finally understood prop drilling clearly 🔥", time: "11:00 AM" },
    { role: "trainer", text: "Thank you Ananya! Your participation in class really helps the whole batch. Keep it up! 🎯", time: "11:05 AM" },
  ],
};

const AI_INITIAL_MESSAGES = [
  { role: "bot", text: "👋 Hi Rahul Sir! I'm your AI Companion. I can generate quiz questions, create lesson plans, summarize recorded sessions, and resolve student doubts. What do you need today?" },
  { role: "user", text: "Generate 5 MCQ questions on Java Collections for Batch B2" },
  {
    role: "bot", html: true,
    text: `Here are 5 MCQ questions on Java Collections for Batch B2:<br/><br/><strong>Q1.</strong> Which collection allows duplicates and maintains insertion order?<br/>A) HashSet &nbsp;B) TreeSet &nbsp;<strong style="color:#F97316">C) ArrayList</strong> &nbsp;D) LinkedHashSet<br/><br/><strong>Q2.</strong> Default initial capacity of HashMap?<br/>A) 8 &nbsp;<strong style="color:#F97316">B) 16</strong> &nbsp;C) 32 &nbsp;D) 10<br/><br/><strong>Q3.</strong> LinkedList implements which interfaces?<br/><strong style="color:#F97316">C) List and Deque</strong><br/><br/>Want me to add these to a quiz in Batch B2?`,
  },
];

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (w < 480) return "mobile";
    if (w < 768) return "mobileLg";
    if (w < 1024) return "tablet";
    return "desktop";
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setBp("mobile");
      else if (w < 768) setBp("mobileLg");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color, barBg, animate = false }) {
  const [width, setWidth] = useState(animate ? 0 : pct);
  useEffect(() => {
    if (animate) { const t = setTimeout(() => setWidth(pct), 200); return () => clearTimeout(t); }
  }, [pct, animate]);
  return (
    <div style={{ background: barBg || "#F0EBE4", borderRadius: 99, height: 7, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 99, background: color, width: `${width}%`, transition: "width 1.3s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

// ─── SECTION PILL ─────────────────────────────────────────────────────────────
function SectionPill({ children, T }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.orangeLt, border: `1px solid ${T.orangeBd}`, borderRadius: 99, padding: "5px 16px", marginBottom: 12, fontSize: 13, fontWeight: 600, color: T.orange }}>
      {children}
    </div>
  );
}

// ─── SECTION HEAD ─────────────────────────────────────────────────────────────
function SectionHead({ pill, title, sub, T }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <SectionPill T={T}>{pill}</SectionPill>
      <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, color: T.textH, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 10 }}>{title}</h2>
      {sub && <p style={{ fontSize: "clamp(13px,1.4vw,15px)", color: T.textB, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection({ T }) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile" || bp === "mobileLg";
  const isTablet = bp === "tablet";
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="dashboard" style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "clamp(28px,4vw,48px) 0 clamp(28px,3.5vw,40px)", transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)", display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr", gap: "clamp(24px,4vw,48px)", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.orangeLt, border: `1px solid ${T.orangeBd}`, borderRadius: 99, padding: "6px 16px", marginBottom: 18, fontSize: 13, fontWeight: 600, color: T.orange }}>
            <Users size={13} /> Trainer Dashboard
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,48px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.03em", color: T.textH, marginBottom: 16 }}>
            Welcome back,<br /><span style={{ color: T.orange }}>Rahul Sir 👋</span>
          </h1>
          <p style={{ fontSize: "clamp(13px,1.4vw,16px)", color: T.textB, lineHeight: 1.65, maxWidth: 480, marginBottom: 24 }}>
            You have 3 live sessions today, 12 pending assignment reviews, and 7 open student doubts. Your AI Companion is ready.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("live")} style={{ background: T.orange, color: "#fff", borderRadius: 99, padding: "clamp(10px,1.5vw,14px) clamp(20px,2vw,28px)", fontSize: "clamp(13px,1.2vw,15px)", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(249,115,22,0.3)", fontFamily: "inherit" }}>
              <Play size={14} fill="white" /> Start Live Session
            </button>
            <button onClick={() => scrollTo("students")} style={{ background: "transparent", color: T.textH, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "clamp(10px,1.5vw,14px) clamp(20px,2vw,28px)", fontSize: "clamp(13px,1.2vw,15px)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              View Students
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(12px,2vw,28px)", marginTop: 28 }}>
            {[
              { num: "248",  lbl: "Active Students", Icon: Users },
              { num: "6",    lbl: "Live Batches",    Icon: Layers },
              { num: "4.9★", lbl: "Trainer Rating",  Icon: Star },
              { num: "92%",  lbl: "Completion",      Icon: TrendingUp },
            ].map(s => (
              <div key={s.lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(18px,2.2vw,24px)", fontWeight: 800, color: T.textH, letterSpacing: "-0.02em" }}>{s.num}</div>
                <div style={{ fontSize: "clamp(10px,1vw,13px)", color: T.textM, marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 20, padding: "clamp(14px,2vw,20px)", boxShadow: T.shadow }}>
            <div style={{ background: T.codeBg, borderRadius: 12, padding: "clamp(12px,1.5vw,16px)", fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1vw,12px)", lineHeight: 1.7, marginBottom: 4 }}>
              <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                {["#ef4444", "#f59e0b", "#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              </div>
              <div><span style={{ color: "#ff7b72" }}>class</span> <span style={{ color: "#d2a8ff" }}>TrainerHub</span></div>
              <div>&nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>def</span> <span style={{ color: "#d2a8ff" }}>teach</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>"Inspire every batch"</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>return</span> <span style={{ color: "#79c0ff" }}>Success()</span></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {[
                { bg: "#FFF0E6", lbl: "Today's Sessions", val: "3 Classes", Icon: Calendar },
                { bg: "#EEF2FF", lbl: "Pending Review",   val: "12 Tasks",  Icon: ClipboardList },
                { bg: "#F0FDF4", lbl: "Attendance Avg",   val: "87%",        Icon: CheckSquare },
                { bg: "#FDF4FF", lbl: "Open Doubts",      val: "7 New",      Icon: HelpCircle },
              ].map(tile => (
                <div key={tile.lbl} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: tile.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <tile.Icon size={13} color={T.orange} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: T.textM, fontWeight: 500 }}>{tile.lbl}</div>
                    <div style={{ fontSize: 13, color: T.textH, fontWeight: 700, marginTop: 1 }}>{tile.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── TRAINER TOOLS ────────────────────────────────────────────────────────────
function TrainerToolsSection({ T }) {
  const bp = useBreakpoint();
  const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "240px";
  return (
    <section id="features" style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.bg, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><Zap size={13} /> Trainer Toolkit</>}
          title={<>Everything You Need <span style={{ color: T.orange }}>To Teach Better</span></>}
          sub="Powerful tools designed for trainers — manage batches, run live classes, and leverage AI to teach at scale."
        />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(10px,1.2vw,16px)" }}>
          {FEATURES.map(f => <FeatureCard key={f.title} {...f} T={T} />)}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ color, bg, Icon, title, desc, T }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: T.surface, border: `1px solid ${hov ? T.borderHov : T.border}`, borderRadius: 16, padding: "clamp(16px,1.6vw,22px) clamp(14px,1.6vw,20px)", borderTop: `3px solid ${color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-3px)" : "none", transition: "all 0.22s", cursor: "pointer" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <Icon size={19} color={color} />
      </div>
      <div style={{ fontSize: "clamp(14px,1.2vw,16px)", fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: "clamp(12px,1vw,14px)", color: T.textB, lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

// ─── BATCHES ──────────────────────────────────────────────────────────────────
function BatchesSection({ T }) {
  const bp = useBreakpoint();
  const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "300px";
  return (
    <section id="batches" style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.surface, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><Layers size={13} /> Your Batches</>}
          title={<>Active <span style={{ color: T.orange }}>Batches</span></>}
          sub="Track all your ongoing training batches with real-time progress and student data."
        />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(10px,1.2vw,16px)" }}>
          {BATCHES.map(b => <BatchCard key={b.code} batch={b} T={T} />)}
        </div>
      </div>
    </section>
  );
}

function BatchCard({ batch: b, T }) {
  const [hov, setHov] = useState(false);
  const tc = TAG_COLORS[b.tag] || "#3b82f6";
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(14px,1.6vw,20px)", borderTop: `3px solid ${b.color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-2px)" : "none", transition: "all 0.22s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: b.color + "18", border: `1.5px solid ${b.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: b.color, flexShrink: 0 }}>{b.code}</div>
          <div>
            <div style={{ fontSize: "clamp(13px,1.2vw,15px)", fontWeight: 700, color: T.textH }}>{b.name}</div>
            <div style={{ fontSize: 12, color: T.textM, marginTop: 2 }}>{b.modules} modules</div>
          </div>
        </div>
        <span style={{ background: tc + "18", color: tc, border: `1px solid ${tc}30`, borderRadius: 99, padding: "3px 11px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, marginLeft: 8 }}>{b.tag}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 13, color: T.textM, display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{b.students} students</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.progress}%</span>
      </div>
      <div style={{ marginBottom: 14 }}><ProgressBar pct={b.progress} color={b.color} barBg={T.barBg} animate /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12.5, color: T.textM, display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{b.next}</span>
        <button style={{ background: b.color, color: "#fff", border: "none", borderRadius: 99, padding: "7px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Manage</button>
      </div>
    </div>
  );
}

// ─── LIVE SESSIONS ────────────────────────────────────────────────────────────
function LiveSessionsSection({ T }) {
  const bp = useBreakpoint();
  const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "300px";
  return (
    <section id="live" style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.bg, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><Play size={13} fill={T.orange} /> Real-Time Teaching</>}
          title={<>Live <span style={{ color: T.orange }}>Classes</span></>}
          sub="Join, manage, and schedule live sessions for your batches. Take attendance, share screen, and use the whiteboard."
        />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(10px,1.2vw,16px)" }}>
          {LIVE_SESSIONS.map(s => <LiveCard key={s.title} session={s} T={T} />)}
        </div>
      </div>
    </section>
  );
}

function LiveCard({ session: s, T }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(14px,1.6vw,20px)", borderTop: `3px solid ${s.color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-2px)" : "none", transition: "all 0.22s" }}>
      <div style={{ marginBottom: 6, minHeight: 22 }}>
        {s.live && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FEE2E2", color: "#ef4444", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.4s infinite" }} />
            LIVE NOW
          </span>
        )}
      </div>
      <h3 style={{ fontSize: "clamp(14px,1.2vw,16px)", fontWeight: 700, color: T.textH, margin: "8px 0 4px" }}>{s.title}</h3>
      <div style={{ fontSize: 13, color: T.textM, marginBottom: 4 }}>{s.batch}</div>
      <div style={{ fontSize: 13, color: T.textM, marginBottom: 14, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{s.time}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{s.students} students</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ flex: 2, background: s.live ? "#ef4444" : s.color, color: "#fff", border: "none", borderRadius: 99, padding: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Play size={13} fill="white" />{s.live ? "Join Now" : "Schedule"}
        </button>
        <button style={{ flex: 1, background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: 11, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Edit2 size={13} />Edit
        </button>
      </div>
    </div>
  );
}

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
function StudentsSection({ T }) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile" || bp === "mobileLg";
  return (
    <section id="students" style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.surface, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><Users size={13} /> Student Management</>}
          title={<>Student <span style={{ color: T.orange }}>Reports</span></>}
          sub="View attendance, quiz scores, assignment submissions, and performance status for every student."
        />
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow }}>
          <div style={{ padding: "clamp(12px,1.6vw,16px) clamp(16px,2.5vw,28px)", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h3 style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 700, color: T.textH }}>Batch B2 — Java Backend Engineering</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={{ background: "transparent", color: T.textH, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={13} />Export CSV
              </button>
              <button style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckSquare size={13} />Take Attendance
              </button>
            </div>
          </div>

          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {STUDENTS.map(s => {
                const sc = STATUS_COLORS[s.status] || "#3b82f6";
                const SIcon = STATUS_ICONS[s.status] || CheckCircle;
                const attPct = parseFloat(s.att);
                const attColor = attPct >= 85 ? "#22c55e" : attPct >= 70 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={s.name} style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.textH }}>{s.name}</div>
                      <span style={{ background: sc + "14", color: sc, border: `1px solid ${sc}28`, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                        <SIcon size={10} />{s.status}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { lbl: "Attendance", val: s.att, color: attColor },
                        { lbl: "Quiz Avg",   val: s.quiz, color: T.textH },
                        { lbl: "Assignments",val: s.asgn, color: T.textH },
                      ].map(cell => (
                        <div key={cell.lbl} style={{ background: T.bg, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: T.textM, marginBottom: 2 }}>{cell.lbl}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: cell.color }}>{cell.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Student", "Batch", "Attendance", "Quiz Avg", "Assignments", "Status", "Action"].map(h => (
                      <th key={h} style={{ padding: "12px clamp(12px,1.5vw,20px)", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.textM, letterSpacing: "0.07em", textTransform: "uppercase", background: T.tableTh, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS.map(s => {
                    const sc = STATUS_COLORS[s.status] || "#3b82f6";
                    const SIcon = STATUS_ICONS[s.status] || CheckCircle;
                    const attPct = parseFloat(s.att);
                    const attColor = attPct >= 85 ? "#22c55e" : attPct >= 70 ? "#f59e0b" : "#ef4444";
                    return (
                      <tr key={s.name}>
                        <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, fontWeight: 600, color: T.textH, borderBottom: `1px solid ${T.border}` }}>{s.name}</td>
                        <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, color: T.textB, borderBottom: `1px solid ${T.border}` }}><span style={{ background: T.orangeLt, color: T.orange, borderRadius: 99, padding: "3px 11px", fontSize: 11.5, fontWeight: 700 }}>{s.batch}</span></td>
                        <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, fontWeight: 600, color: attColor, borderBottom: `1px solid ${T.border}` }}>{s.att}</td>
                        <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, fontWeight: 600, color: T.textH, borderBottom: `1px solid ${T.border}` }}>{s.quiz}</td>
                        <td style={{ padding: "14px clamp(12px,1.5vw,20px)", fontSize: 14, color: T.textB, borderBottom: `1px solid ${T.border}` }}>{s.asgn}</td>
                        <td style={{ padding: "14px clamp(12px,1.5vw,20px)", borderBottom: `1px solid ${T.border}` }}>
                          <span style={{ background: sc + "14", color: sc, border: `1px solid ${sc}28`, borderRadius: 99, padding: "3px 10px", fontSize: 11.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <SIcon size={10} />{s.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px clamp(12px,1.5vw,20px)", borderBottom: `1px solid ${T.border}` }}>
                          <button style={{ background: "transparent", color: T.orange, border: `1.5px solid ${sc}40`, borderRadius: 99, padding: "5px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                            <ChevronRight size={13} />View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────
function AssignmentsSection({ T }) {
  const bp = useBreakpoint();
  const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "300px";
  return (
    <section id="assignments" style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.bg, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><ClipboardList size={13} /> Assignments & Quizzes</>}
          title={<>Manage <span style={{ color: T.orange }}>Assignments</span></>}
          sub="Create, review and grade assignments. Track submissions and send reminders to lagging students."
        />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(10px,1.2vw,16px)" }}>
          {ASSIGNMENTS.map(a => <AssignmentCard key={a.title} assignment={a} T={T} />)}
        </div>
      </div>
    </section>
  );
}

function AssignmentCard({ assignment: a, T }) {
  const pct = Math.round((a.submitted / a.total) * 100);
  const pending = a.total - a.submitted;
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(14px,1.6vw,20px)", borderTop: `3px solid ${a.color}`, boxShadow: hov ? T.shadowHov : T.shadow, transform: hov ? "translateY(-2px)" : "none", transition: "all 0.22s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ background: a.bg, borderRadius: 12, padding: 10 }}><ClipboardList size={18} color={a.color} /></div>
        <span style={{ background: a.bg, color: a.color, borderRadius: 99, padding: "3px 11px", fontSize: 11.5, fontWeight: 700 }}>{a.batch}</span>
      </div>
      <div style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 700, color: T.textH, marginBottom: 4 }}>{a.title}</div>
      <div style={{ fontSize: 12.5, color: T.textM, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />Due: {a.due}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 13, color: T.textM }}>{a.submitted}/{a.total} submitted</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{pct}%</span>
      </div>
      <div style={{ marginBottom: pending > 0 ? 10 : 14 }}><ProgressBar pct={pct} color={a.color} barBg={T.barBg} animate /></div>
      {pending > 0 && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "7px 12px", marginBottom: 12, fontSize: 12.5, color: "#ef4444", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertCircle size={13} />{pending} students haven't submitted
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ flex: 1, background: a.color, color: "#fff", border: "none", borderRadius: 99, padding: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Review</button>
        <button style={{ flex: 1, background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Edit2 size={13} />Edit</button>
      </div>
    </div>
  );
}

// ─── COURSE MANAGEMENT ────────────────────────────────────────────────────────
function CourseManagementSection({ T }) {
  const bp = useBreakpoint();
  const colMin = bp === "mobile" ? "100%" : bp === "mobileLg" ? "calc(50% - 10px)" : "240px";
  return (
    <section style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.surface, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><BookOpen size={13} /> Content</>}
          title={<>Course <span style={{ color: T.orange }}>Management</span></>}
          sub="Upload videos, manage modules, study plans, and recorded sessions all from one place."
        />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${colMin},1fr))`, gap: "clamp(10px,1.2vw,16px)" }}>
          {COURSE_ITEMS.map(c => (
            <div key={c.title} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "clamp(16px,1.6vw,22px) clamp(14px,1.6vw,20px)", borderTop: `3px solid ${c.color}`, boxShadow: T.shadow, cursor: "pointer" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <c.Icon size={19} color={c.color} />
              </div>
              <div style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: "clamp(12px,1vw,14px)", color: T.textB, lineHeight: 1.55, marginBottom: 14 }}>{c.desc}</div>
              <button style={{ background: c.color, color: "#fff", border: "none", borderRadius: 99, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{c.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PERFORMANCE ──────────────────────────────────────────────────────────────
function PerformanceSection({ T }) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile" || bp === "mobileLg";
  return (
    <section style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.bg, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(24px,3vw,40px)", alignItems: "center" }}>
          <div>
            <SectionPill T={T}><BarChart2 size={13} /> AI Analysis</SectionPill>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, color: T.textH, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 10, textAlign: "left" }}>
              Batch <span style={{ color: T.orange }}>Performance</span>
            </h2>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: T.textB, lineHeight: 1.6, marginBottom: 22, maxWidth: 380 }}>
              AI-powered insights on quiz averages, assignment completion, attendance trends, and live session engagement.
            </p>
            <button style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}>
              <TrendingUp size={16} />Full Report
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,1.6vw,18px)" }}>
            {PERF.map(p => (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
                  <span style={{ fontSize: "clamp(13px,1.2vw,14.5px)", fontWeight: 600, color: T.textH, display: "flex", alignItems: "center", gap: 6 }}>
                    <p.Icon size={14} color={p.color} />{p.name}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: p.color }}>{p.pct}%</span>
                </div>
                <ProgressBar pct={p.pct} color={p.color} barBg={T.barBg} animate />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WHITEBOARD ───────────────────────────────────────────────────────────────
function WhiteboardSection({ T, theme }) {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const drawing   = useRef(false);
  const ctx       = useRef(null);
  const [activeToolIdx, setActiveToolIdx] = useState(0);
  const [wbColor, setWbColor]             = useState("#F97316");
  const [showHint, setShowHint]           = useState(true);

  const tools  = [
    { icon: <PenTool size={13} />, label: "Pen" },
    { icon: <Edit2 size={13} />,   label: "Shape" },
    { icon: <FileText size={13} />,label: "Text" },
    { icon: <XCircle size={13} />, label: "Eraser" },
  ];
  const colors = ["#F97316", "#3b82f6", "#22c55e", theme === "dark" ? "#FFFFFF" : "#1A2332"];

  const initCanvas = useCallback(() => {
    const cvs = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    cvs.width  = wrap.offsetWidth;
    cvs.height = wrap.offsetHeight;
    ctx.current = cvs.getContext("2d");

ctx.current.fillStyle =
  theme === "dark"
    ? "#171717"
    : "#FFFFFF";

ctx.current.fillRect(
  0,
  0,
  cvs.width,
  cvs.height
);

ctx.current.lineCap = "round";
ctx.current.lineJoin = "round";
ctx.current.lineWidth = 3;
ctx.current.strokeStyle = wbColor;
}, [wbColor, theme]);

  useEffect(() => {
    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, [initCanvas]);

  const getPos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const touch = e.touches?.[0];
    return touch ? [touch.clientX - r.left, touch.clientY - r.top] : [e.clientX - r.left, e.clientY - r.top];
  };

  return (
    <section style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.surface, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T} pill={<><PenTool size={13} /> Interactive Teaching</>} title={<>Whiteboard <span style={{ color: T.orange }}>Panel</span></>} sub="Draw, annotate, and explain concepts in real time. Share the board live with your students during sessions." />
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", maxWidth: 860, margin: "0 auto", boxShadow: T.shadow }}>
          <div style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "14px 22px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {tools.map((t, i) => (
              <button key={t.label} onClick={() => setActiveToolIdx(i)}
                style={{ background: activeToolIdx === i ? T.orangeLt : T.surface, border: `1.5px solid ${activeToolIdx === i ? T.orange : T.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, color: activeToolIdx === i ? T.orange : T.textB, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                {t.icon}{t.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {colors.map(c => (
                <div key={c} onClick={() => { setWbColor(c); if (ctx.current) ctx.current.strokeStyle = c; }}
                  style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: "2px solid rgba(0,0,0,0.15)", cursor: "pointer", boxShadow: wbColor === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none" }} />
              ))}
            </div>
          </div>
          <div ref={wrapRef} style={{ background: "#FAFAF8", height: "clamp(180px,26vw,240px)", position: "relative", overflow: "hidden" }}>
          <canvas
  ref={canvasRef}
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "crosshair",
    background: theme === "dark"
      ? "#171717"
      : "#FFFFFF"
  }}

              onMouseDown={e => { drawing.current = true; setShowHint(false); const [x, y] = getPos(e); ctx.current?.beginPath(); ctx.current?.moveTo(x, y); }}
              onMouseMove={e => { if (!drawing.current || !ctx.current) return; const [x, y] = getPos(e); ctx.current.lineTo(x, y); ctx.current.stroke(); }}
              onMouseUp={() => { drawing.current = false; }}
              onMouseLeave={() => { drawing.current = false; }}
              onTouchStart={e => { e.preventDefault(); drawing.current = true; setShowHint(false); const [x, y] = getPos(e); ctx.current?.beginPath(); ctx.current?.moveTo(x, y); }}
              onTouchMove={e => { e.preventDefault(); if (!drawing.current || !ctx.current) return; const [x, y] = getPos(e); ctx.current.lineTo(x, y); ctx.current.stroke(); }}
              onTouchEnd={() => { drawing.current = false; }}
            />
            {showHint && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, pointerEvents: "none" }}>
                <PenTool size={36} color="#CBD5E0" />
                <div style={{ fontSize: 14, fontWeight: 600, color: "#A0AEC0" }}>Click and drag to draw</div>
              </div>
            )}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 22px", display: "flex", gap: 10, flexWrap: "wrap", background: T.surface }}>
            <button style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}><Send size={13} />Share to Students</button>
            <button onClick={() => { ctx.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); setShowHint(true); }}
              style={{ background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear Board</button>
            <button style={{ background: "transparent", color: T.textB, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}><FileText size={13} />Save as PDF</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── DISCUSSION ───────────────────────────────────────────────────────────────
function DiscussionSection({ T }) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile" || bp === "mobileLg";
  const [threads, setThreads]     = useState(INITIAL_THREADS);
  const [messages, setMessages]   = useState(INITIAL_MESSAGES);
  const [activeId, setActiveId]   = useState(1);
  const [discInput, setDiscInput] = useState("");
  const [discTab, setDiscTab]     = useState("Direct");
  const [showList, setShowList]   = useState(true);
  const msgEndRef = useRef(null);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeId]);

  const activeThread = threads.find(t => t.id === activeId);

  const switchThread = (id) => {
    setActiveId(id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t));
    if (isMobile) setShowList(false);
  };

  const sendDisc = () => {
    const val = discInput.trim();
    if (!val) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), { role: "trainer", text: val, time: now }] }));
    setThreads(prev => prev.map(t => t.id === activeId ? { ...t, preview: val, time: "just now" } : t));
    setDiscInput("");
  };

  const chatHeight = isMobile ? 400 : 520;

  return (
    <section id="discussion" style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.bg, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><MessageSquare size={13} /> Trainer–Student Chat</>}
          title={<>Discussion <span style={{ color: T.orange }}>Panel</span></>}
          sub="Reply to student questions, share resources, and keep every batch conversation organized."
        />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: 16, maxWidth: 1100, margin: "0 auto" }}>

          {(!isMobile || showList) && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow, height: chatHeight, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, fontSize: 13, fontWeight: 700, color: T.textM, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                Conversations <span style={{ fontSize: 11, background: T.orange, color: "#fff", borderRadius: 99, padding: "2px 8px" }}>7 New</span>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {threads.map(t => (
                  <div key={t.id} onClick={() => switchThread(t.id)}
                    style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, cursor: "pointer", background: t.id === activeId && !isMobile ? T.orangeLt : "transparent", borderLeft: t.id === activeId && !isMobile ? `3px solid ${T.orange}` : "3px solid transparent", display: "flex", alignItems: "flex-start", gap: 10, transition: "background 0.15s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{t.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.textH, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                      <div style={{ fontSize: 11.5, color: T.textM, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{t.preview}</div>
                      <div style={{ fontSize: 10.5, color: T.textM, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>{t.batch}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {t.time}
                          {t.unread > 0 && <span style={{ minWidth: 17, height: 17, borderRadius: 99, background: T.orange, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{t.unread}</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!isMobile || !showList) && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow, height: chatHeight, display: "flex", flexDirection: "column" }}>
              <div style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {isMobile && (
                  <button onClick={() => setShowList(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", marginRight: 4 }}>
                    <ChevronRight size={18} style={{ transform: "rotate(180deg)" }} color={T.textH} />
                  </button>
                )}
                <div style={{ width: 38, height: 38, borderRadius: 11, background: activeThread?.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>{activeThread?.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.textH }}>{activeThread?.name}</div>
                  <div style={{ fontSize: 11.5, color: T.textM }}>{activeThread?.batch}</div>
                </div>
                {!isMobile && (
                  <div style={{ display: "flex", gap: 6 }}>
                    {["Direct", "Batch Group", "Announcement"].map(tab => (
                      <button key={tab} onClick={() => setDiscTab(tab)}
                        style={{ background: discTab === tab ? T.orangeLt : "transparent", border: `1.5px solid ${discTab === tab ? T.orange : T.border}`, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: discTab === tab ? T.orange : T.textM, cursor: "pointer", fontFamily: "inherit" }}>{tab}</button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, background: T.surface }}>
                {(messages[activeId] || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "trainer" ? "row-reverse" : "row" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: m.role === "trainer" ? T.orange : activeThread?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
                      {m.role === "trainer" ? "RS" : activeThread?.initials}
                    </div>
                    <div style={{ maxWidth: "72%" }}>
                      <div style={{ padding: "10px 14px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.6, background: m.role === "trainer" ? T.orange : T.bg, color: m.role === "trainer" ? "#fff" : T.textH, border: m.role === "trainer" ? "none" : `1px solid ${T.border}`, borderBottomRightRadius: m.role === "trainer" ? 4 : 12, borderBottomLeftRadius: m.role === "student" ? 4 : 12 }}>
                        {m.text}
                      </div>
                      <div style={{ fontSize: 10.5, color: T.textM, marginTop: 3, textAlign: m.role === "trainer" ? "right" : "left" }}>{m.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={msgEndRef} />
              </div>

              <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", background: T.surface }}>
                <input value={discInput} onChange={e => setDiscInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendDisc()}
                  placeholder={`Reply to ${activeThread?.name}...`}
                  style={{ flex: 1, background: T.inputBg, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "10px 16px", fontSize: 14, fontFamily: "inherit", color: T.textH, outline: "none" }} />
                <button onClick={sendDisc}
                  style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                  <Send size={14} />{!isMobile && "Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── AI COMPANION ─────────────────────────────────────────────────────────────
function AICompanionSection({ T }) {
  const [aiMessages, setAiMessages] = useState(AI_INITIAL_MESSAGES);
  const [aiInput, setAiInput]       = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages]);

  const sendMsg = () => {
    const val = aiInput.trim();
    if (!val) return;
    setAiMessages(prev => [...prev, { role: "user", text: val }]);
    setAiInput("");
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: "bot", text: `✅ Working on "${val}"...\n\nI'm analyzing your batch data. You can also ask me to:\n• Generate quiz questions for any topic\n• Draft a lesson plan for tomorrow\n• Summarize a student's overall performance` }]);
    }, 700);
  };

  return (
    <section id="ai-companion" style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.surface, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T}
          pill={<><Bot size={13} /> AI Powered</>}
          title={<>Your <span style={{ color: T.orange }}>AI Companion</span></>}
          sub="Generate quizzes, draft lesson plans, summarize sessions, and resolve student doubts — instantly."
        />
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, maxWidth: 740, margin: "0 auto", boxShadow: T.shadow, overflow: "hidden" }}>
          <div style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: T.orangeLt, border: `1.5px solid ${T.orangeBd}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={20} color={T.orange} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.textH }}>Ilmora AI — Trainer Mode</div>
              <div style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                Online & Ready
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{ label: "Quiz Gen", Icon: ClipboardList }, { label: "Lesson Plan", Icon: BookOpen }, { label: "Doubt Solver", Icon: HelpCircle }].map(b => (
                <button key={b.label} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: T.textB, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
                  <b.Icon size={12} />{b.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: "20px 24px", maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: T.surface }}>
            {aiMessages.map((m, i) => (
              <div key={i} style={{ padding: "12px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.65, maxWidth: "86%", background: m.role === "user" ? T.orange : T.bg, color: m.role === "user" ? "#fff" : T.textH, border: m.role === "bot" ? `1px solid ${T.border}` : "none", borderBottomLeftRadius: m.role === "bot" ? 4 : 14, borderBottomRightRadius: m.role === "user" ? 4 : 14, marginLeft: m.role === "user" ? "auto" : 0, whiteSpace: "pre-line" }}>
                {m.html ? <span dangerouslySetInnerHTML={{ __html: m.text }} /> : m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 24px", display: "flex", gap: 10, background: T.surface }}>
            <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Ask me to generate a quiz, plan a lesson, resolve a doubt..."
              style={{ flex: 1, background: T.inputBg, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "11px 18px", fontSize: 14, fontFamily: "inherit", color: T.textH, outline: "none" }} />
            <button onClick={sendMsg} style={{ background: T.orange, color: "#fff", border: "none", borderRadius: 99, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              <Send size={15} />Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
function ActivitySection({ T }) {
  return (
    <section style={{ padding: "clamp(32px,4.5vw,56px) 0", background: T.bg, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)" }}>
        <SectionHead T={T} pill={<><Activity size={13} /> Timeline</>} title={<>Recent <span style={{ color: T.orange }}>Activity</span></>} />
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {ACTIVITIES.map((a, i) => (
            <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 13, padding: "clamp(12px,1.5vw,14px) clamp(14px,2vw,20px)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: a.ibg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <a.Icon size={16} color={a.ic} />
              </div>
              <div>
                <div style={{ fontSize: "clamp(13px,1.2vw,14px)", fontWeight: 600, color: T.textH }}>{a.text}</div>
                <div style={{ fontSize: 12, color: T.textM, marginTop: 2 }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection({ T, theme }) {
  return (
    <div style={{ background: theme === "dark"
      ? "#111111"
      : T.textH, padding: "clamp(40px,5vw,64px) 0", textAlign: "center", position: "relative", overflow: "hidden", transition: "background 0.3s" }}>
      <div style={{ position: "absolute", width: 340, height: 340, top: -80, left: -80, borderRadius: "50%", background: "rgba(249,115,22,0.12)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 280, height: 280, bottom: -60, right: -60, borderRadius: "50%", background: "rgba(249,115,22,0.12)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)", position: "relative", zIndex: 1 }}>
        <SectionPill T={T}><Play size={13} fill={T.orange} /> Teach Live</SectionPill>
        <h2 style={{ fontSize: "clamp(24px,3.6vw,42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 14 }}>
          Ready to Inspire <span style={{ color: T.orange }}>Your Next Batch?</span>
        </h2>
        <p style={{ fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Start a live session, upload content, or let AI design today's lesson plan for you.
        </p>
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
// ✅ Now uses PublicLayout (navbar + footer) the same way StudentHub does.
//    Theme is self-managed with localStorage, but external theme/toggleTheme
//    props (if passed by a parent route) are still respected.
export default function TrainerHub({ theme: themeProp, toggleTheme: toggleThemeProp }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    } catch { return false; }
  });

  const isControlled = themeProp !== undefined;
  const theme = isControlled ? themeProp : (darkMode ? "dark" : "light");

  const toggleTheme = () => {
    if (isControlled && toggleThemeProp) { toggleThemeProp(); return; }
    setDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
        document.documentElement.classList.toggle("dark", next);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const onStorage = (e) => { if (e.key === "theme") setDarkMode(e.newValue === "dark"); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isDark = theme === "dark";
  const T = getT(isDark);

  const [activeSection, setActiveSection] = useState("dashboard");
  const mounted = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => { mounted.current = true; }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!mounted.current) return;
      const sections = ["dashboard", "batches", "live", "students", "assignments", "discussion", "ai-companion"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 80) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      scrollToSection={scrollToSection}
    >
      <div className="trainerhub-page" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: T.bg, color: T.textB, fontSize: 16, lineHeight: 1.6, transition: "background 0.3s, color 0.3s", width: "100%", overflowX: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          .trainerhub-page, .trainerhub-page *, .trainerhub-page *::before, .trainerhub-page *::after { box-sizing: border-box; }
          .trainerhub-page h1, .trainerhub-page h2, .trainerhub-page h3, .trainerhub-page h4,
          .trainerhub-page p, .trainerhub-page ul, .trainerhub-page ol, .trainerhub-page figure,
          .trainerhub-page table, .trainerhub-page th, .trainerhub-page td,
          .trainerhub-page button, .trainerhub-page input { margin: 0; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
          .trainerhub-page ::-webkit-scrollbar { width: 6px; height: 6px; }
          .trainerhub-page ::-webkit-scrollbar-track { background: transparent; }
          .trainerhub-page ::-webkit-scrollbar-thumb { background: #D4C8BE; border-radius: 3px; }
          .trainerhub-page button:hover { opacity: 0.92; }
        `}</style>

        <HeroSection T={T} />
        <TrainerToolsSection T={T} />
        <BatchesSection T={T} />
        <LiveSessionsSection T={T} />
        <StudentsSection T={T} />
        <AssignmentsSection T={T} />
        <CourseManagementSection T={T} />
        <PerformanceSection T={T} />
        <WhiteboardSection T={T} theme={theme} />
        <DiscussionSection T={T} />
        <AICompanionSection T={T} />
        <ActivitySection T={T} />
        <CTASection T={T} theme={theme} />
      </div>
    </PublicLayout>
  );
}