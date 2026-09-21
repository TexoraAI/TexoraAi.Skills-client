// import { useState, useEffect, useCallback } from "react";
// import {
//   Users, Calendar, Link2, CreditCard, Palette,
//   Video, Clock, MapPin, User, ChevronLeft, ChevronRight,
//   X, Check,
//   ArrowRight, Globe, Apple,
//   Play, Target, TrendingUp, Code2, Briefcase,
//   GraduationCap, Sparkles,
// } from "lucide-react";

// // ✅ Same shared shell used by every other public page (Careers, ManagerHub,
// // About, Pricing, Contact, FAQ, etc). Lives at src/pages/Landing/components/PublicLayout.
// // If this file lives somewhere other than alongside Careers.jsx, adjust this path.
// import PublicLayout from "../Landing/components/PublicLayout";

// // ─── CSS INJECTION ────────────────────────────────────────────────────────
// // ✅ ALIGNMENT FIX (same fix as Careers/ManagerHub): everything is scoped
// // under `.meet-page` instead of bare `*` / `body` selectors. The old global
// // reset (`*,*::before,*::after{margin:0;padding:0;}` + a bare `body{...}`)
// // leaked outside this component and stripped margin/padding off
// // PublicLayout's navbar and footer — that's what caused the "cut"/misaligned
// // look. Scoping it under `.meet-page` keeps this reset local only.
// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
//   .meet-page, .meet-page *, .meet-page *::before, .meet-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   .meet-page { overflow-x: hidden; }
  
//   /* Responsive helpers */
//   .ilm-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
//   .ilm-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
//   .ilm-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
//   .ilm-grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
//   .ilm-flex-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
//   .ilm-flex-col { display: flex; flex-direction: column; gap: 24px; }
//   .ilm-nav-links { display: flex; gap: 2px; list-style: none; }
//   .ilm-nav-auth { display: flex; gap: 8px; }
//   .ilm-hero-widget { display: block; }
//   .ilm-widget-sidebar { display: block; }
//   .ilm-booking-sidebar { display: flex; }
//   .ilm-pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
//   .ilm-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; }
//   .ilm-sol-flex { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
//   .ilm-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
//   .ilm-about-grid { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
//   .ilm-about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
//   .ilm-feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
//   .ilm-reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
//   .ilm-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
//   .ilm-integ-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
//   .ilm-mobile-app-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
//   .ilm-footer-bottom { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; }
//   .ilm-newsletter-row { display: flex; flex-direction: row; align-items: center; gap: 20px; flex-wrap: wrap; }
//   .ilm-howit-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
//   .ilm-section-px { padding-left: 5%; padding-right: 5%; }
//   .ilm-hero-h1 { font-size: clamp(1.8rem, 4vw, 3.2rem); }
//   .ilm-h2 { font-size: clamp(1.4rem, 2.8vw, 2.1rem); }
//   .ilm-sol-h3 { font-size: 1.4rem; }
//   .ilm-cta-h2 { font-size: clamp(1.4rem, 3vw, 2.2rem); }
//   .ilm-tab-show { display: flex; }
//   .ilm-tab-hide { display: none; }
//   .ilm-hero-btns { flex-direction: row; }
//   .ilm-app-btns { flex-direction: row; }
//   .ilm-sol-tabs { flex-wrap: wrap; }
//   .ilm-mini-card-wrap { flex: 1; min-width: 260px; }

//   /* Scrollbar */
//   .meet-page ::-webkit-scrollbar { width: 6px; } 
//   .meet-page ::-webkit-scrollbar-track { background: transparent; }
//   .meet-page ::-webkit-scrollbar-thumb { background: #e87722; border-radius: 3px; }

//   /* ── TABLET: 640–1023px ── */
//   @media (max-width: 1023px) {
//     .ilm-nav-links { display: none; }
//     .ilm-pricing-grid { grid-template-columns: repeat(2,1fr); }
//     .ilm-footer-grid { grid-template-columns: 1fr 1fr; }
//     .ilm-feat-grid { grid-template-columns: repeat(2,1fr); }
//     .ilm-reviews-grid { grid-template-columns: repeat(2,1fr); }
//     .ilm-widget-sidebar { display: none; }
//     .ilm-h2 { font-size: clamp(1.3rem, 2.5vw, 1.8rem); }
//     .ilm-sol-h3 { font-size: 1.2rem; }
//   }

//   /* ── MOBILE: <640px ── */
//   @media (max-width: 639px) {
//     .ilm-nav-auth { display: none !important; }
//     .ilm-hero-widget { display: none !important; }
//     .ilm-booking-sidebar { display: none !important; }
//     .ilm-pricing-grid { grid-template-columns: 1fr !important; }
//     .ilm-footer-grid { grid-template-columns: 1fr !important; }
//     .ilm-feat-grid { grid-template-columns: 1fr !important; }
//     .ilm-reviews-grid { grid-template-columns: 1fr !important; }
//     .ilm-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
//     .ilm-flex-row { flex-direction: column !important; }
//     .ilm-sol-flex { flex-direction: column !important; }
//     .ilm-integ-row { flex-direction: column !important; }
//     .ilm-mobile-app-row { flex-direction: column !important; }
//     .ilm-about-grid { flex-direction: column !important; }
//     .ilm-howit-row { flex-direction: column !important; }
//     .ilm-footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
//     .ilm-newsletter-row { flex-direction: column !important; }
//     .ilm-hero-h1 { font-size: 1.8rem !important; }
//     .ilm-h2 { font-size: 1.35rem !important; }
//     .ilm-sol-h3 { font-size: 1.05rem !important; }
//     .ilm-cta-h2 { font-size: 1.3rem !important; }
//     .ilm-section-px { padding-left: 4% !important; padding-right: 4% !important; }
//     .ilm-hero-btns { flex-direction: column !important; align-items: center !important; }
//     .ilm-app-btns { flex-direction: row !important; flex-wrap: wrap !important; }
//     .ilm-mini-card-wrap { min-width: 100% !important; width: 100% !important; }
//     .ilm-about-stats { gap: 10px !important; }
//   }

//   /* Hover lift */
//   .card-hover { transition: transform 0.22s, box-shadow 0.22s; }
//   .card-hover:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.1); }
  
//   /* Booking modal slot row on mobile */
//   @media (max-width: 480px) {
//     .ilm-slot-col { flex-direction: row !important; flex-wrap: wrap !important; width: 100% !important; }
//   }
// `;

// function StyleInjector() {
//   useEffect(() => {
//     const el = document.createElement("style");
//     el.textContent = CSS;
//     document.head.appendChild(el);
//     return () => document.head.removeChild(el);
//   }, []);
//   return null;
// }

// // ─── WINDOW SIZE ──────────────────────────────────────────────────────────
// function useWindowSize() {
//   const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
//   useEffect(() => {
//     const h = () => setW(window.innerWidth);
//     window.addEventListener("resize", h);
//     return () => window.removeEventListener("resize", h);
//   }, []);
//   return w;
// }

// // ─── LOGO ─────────────────────────────────────────────────────────────────
// const Logo = ({ size = "1.3rem", variant = "dark", onClick }) => (
//   <div
//     onClick={onClick}
//     style={{ display:"inline-flex", alignItems:"center", gap:10, cursor: onClick ? "pointer" : "default", transition:"transform 0.2s" }}
//     onMouseOver={e => { if (onClick) e.currentTarget.style.transform = "scale(1.05)"; }}
//     onMouseOut={e => { if (onClick) e.currentTarget.style.transform = "scale(1)"; }}
//   >
//     <div style={{ width:40, height:40, background:"#F97316", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(249,115,22,0.35)", flexShrink:0 }}>
//       <Sparkles size={22} color="#fff"/>
//     </div>
//     <span style={{ fontSize: size, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1, fontFamily: "Georgia, 'Times New Roman', serif", whiteSpace: "nowrap" }}>
//       <span style={{ color: variant === "light" ? "#fff" : "#16a34a" }}>ILM</span>
//       <span style={{ color: "#F97316", marginLeft: "0.2em" }}>ORA</span>
//     </span>
//   </div>
// );

// // ─── THEMES ───────────────────────────────────────────────────────────────
// const T = {
//   light: {
//     bg: "#f5ede0", orange: "#e87722", dark: "#1a1a2e", text: "#2d2d2d",
//     muted: "#666", white: "#ffffff", border: "#e8ddd0",
//     navBg: "rgba(245,237,224,0.97)",
//     heroBg: "linear-gradient(160deg,#f5ede0 0%,#eee4d4 60%,#e8ddd0 100%)",
//     cardBg: "#ffffff", statsBg: "#f5ede0", footerBg: "#ffffff", footerText: "#1E293B",
//   },
//   dark: {
//     bg: "#0f0f0f", orange: "#e87722", dark: "#f0f0f0", text: "#e0e0e0",
//     muted: "#9ca3af", white: "#1a1a1a", border: "#2a2a2a",
//     navBg: "rgba(15,15,15,0.97)",
//     heroBg: "linear-gradient(160deg,#0f0f0f 0%,#141414 60%,#1a1a1a 100%)",
//     cardBg: "#1a1a1a", statsBg: "#0f0f0f", footerBg: "#111111", footerText: "#e0e0e0",
//   },
// };

// // ─── DATA ─────────────────────────────────────────────────────────────────
// const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];
// const SLOTS = ["09:00 am","09:30 am","10:00 am","10:30 am","11:00 am","11:30 am"];

// const STATS = [
//   { label: "Increase",  num: "62%",  sub: "Career Advancement" },
//   { label: "Faster",    num: "5x",   sub: "Skill Development" },
//   { label: "Placement", num: "98%",  sub: "Success Rate" },
//   { label: "Students",  num: "10k+", sub: "Enrolled Worldwide" },
// ];

// const FEATURES = [
//   { icon: <GraduationCap size={24}/>, title: "Custom Learning Paths",  desc: "Build & personalise your curriculum based on your career goals." },
//   { icon: <Users size={24}/>,         title: "Team-Based Learning",     desc: "Join cohort programs or group sessions. Learn through real team dynamics." },
//   { icon: <Calendar size={24}/>,      title: "Sync your Calendar",      desc: "Connect Google and Outlook calendars, avoid missed or double-booked sessions." },
//   { icon: <Link2 size={24}/>,         title: "Share Learning Links",    desc: "Share your booking link so mentors can schedule with one click." },
//   { icon: <CreditCard size={24}/>,    title: "Easy Payments",           desc: "Pay via PayPal, Stripe, or Razorpay. Collect course fees securely." },
//   { icon: <Palette size={24}/>,       title: "Easy Customisations",     desc: "Customize your dashboard, colors, and availability to match your workflow." },
// ];

// const SOLUTIONS = [
//   { tab: "Product Mgmt", tabIcon: <Target size={13}/>,
//     stat: "4.5x", statLabel: "faster career transitions with ILM ORA mentorship",
//     title: "Convert Skills Into Career Wins",
//     desc: "Create a personalized learning path and build the exact skills employers are looking for. Land PM roles at top companies.",
//     card: { title: "Product Management Cohort", dur: "12 Weeks", mentor: "James Edward, PM @ Google", type: "Live Sessions + Recordings" }},
//   { tab: "UI/UX Design", tabIcon: <Palette size={13}/>,
//     stat: "3.8x", statLabel: "more interviews with a strong ILM ORA design portfolio",
//     title: "Design. Prototype. Get Hired.",
//     desc: "Master Figma, user research, and design systems with mentors from leading design teams.",
//     card: { title: "UI/UX Design Mastery", dur: "10 Weeks", mentor: "Ananya Sharma, Lead Designer", type: "Live + Portfolio Reviews" }},
//   { tab: "Growth Mktg", tabIcon: <TrendingUp size={13}/>,
//     stat: "5x", statLabel: "salary hike for growth marketers who complete ILM ORA",
//     title: "Growth Playbooks That Actually Work",
//     desc: "Learn the exact strategies that grew India's biggest startups. Master growth marketing at scale.",
//     card: { title: "Growth & Digital Marketing", dur: "8 Weeks", mentor: "Rohit Mehra, Growth Lead", type: "Weekly Live Sessions" }},
//   { tab: "Full Stack Dev", tabIcon: <Code2 size={13}/>,
//     stat: "92%", statLabel: "of ILM ORA dev graduates get placed within 3 months",
//     title: "From Zero to Production-Ready Developer",
//     desc: "Build modern web apps with React, Node.js, and cloud tools. Graduate with a live portfolio.",
//     card: { title: "Full Stack Development", dur: "16 Weeks", mentor: "Kiran Rao, Senior Engineer", type: "Project-Based Learning" }},
//   { tab: "Consultancy", tabIcon: <Briefcase size={13}/>,
//     stat: "50+", statLabel: "expert mentors available for personal consultancy",
//     title: "Mentorship That Transforms Careers",
//     desc: "Get personalized 1:1 consulting from industry veterans. Our mentors have your back every step of the way.",
//     card: { title: "1:1 Career Consultancy", dur: "60 min", mentor: "Vikash Sharma, Career Coach", type: "Google Meet / Zoom" }},
// ];

// const REVIEWS = [
//   { initials: "AK", name: "Aisha Khan",      role: "Product Manager @ Razorpay", text: "ILM ORA completely transformed my career. I went from marketing executive to PM at a Series B startup within 6 months." },
//   { initials: "RS", name: "Rohit Sharma",    role: "UI Designer @ Swiggy",       text: "The UI/UX course is genuinely the best investment I've made. Real projects, real feedback, community that actually helps." },
//   { initials: "PV", name: "Priya Verma",     role: "Growth Lead @ Zepto",        text: "The Growth Marketing program blew my expectations. The ROI is incredible. Best platform for any professional." },
//   { initials: "MJ", name: "Mohammed Junaid", role: "SWE @ Google",               text: "The 1:1 mentorship sessions alone are worth the entire course fee. My mentor helped me crack Google in 3 weeks." },
//   { initials: "SA", name: "Sara Ahmed",      role: "Product Designer @ CRED",    text: "Best platform for anyone serious about a tech career. Real projects, honest feedback, unmatched community support." },
//   { initials: "KP", name: "Karan Patel",     role: "Full Stack Dev @ Paytm",     text: "From fresher to full-stack developer in 5 months. Perfectly structured curriculum and super responsive placement team." },
// ];

// const PRICING_PLANS = [
//   {
//     name: "Free Forever", monthlyPrice: 0, yearlyPrice: 0,
//     tagline: "Experience Hassle-Free Meetings with Our Free Plan",
//     btnLabel: "Get Started", popular: false,
//     features: ["One event with unlimited bookings","Custom embed for your website","Connect one calendar","Basic video conferencing","Team short availability","Contact management","Basic booking customization","Booking confirmation notifications","API access","Calendar block","Different location support","No-Show Tracking","Share ILM ORA link","Booking Limit Controls"],
//   },
//   {
//     name: "Starter", monthlyPrice: 399, yearlyPrice: 299,
//     tagline: "Boost Your Productivity with Our Starter Plan",
//     btnLabel: "Start Free Trial", popular: false,
//     features: ["Unlimited events with unlimited bookings","Multiple calendar support","Group and Collective Events","Secret events","Payment integration","Roles and Permission","Workflows support","Booking notes","Internal Notes","Zapier integration","Advance Priority Links","Multiple Question Options","Zoom video conferencing","Analytics"],
//   },
//   {
//     name: "Pro", monthlyPrice: 599, yearlyPrice: 449,
//     tagline: "Unlock Your Team's Full Potential with Our Pro Tools",
//     btnLabel: "Start Free Trial", popular: true,
//     features: ["Round robin events","Remove watermark","Share Availability","Holiday management","Automated notifications","Multiple webhooks support","24/7 customer support","SSO Integration","Request Feedback","Export Your Bookings","Display Reviews/Stats"],
//   },
//   {
//     name: "Premium", monthlyPrice: 799, yearlyPrice: 599,
//     tagline: "For Power Users — Our Premium Offers the Best Features",
//     btnLabel: "Start Free Trial", popular: false,
//     features: ["Teams","Dedicated booking page","Host selection by attendees","Co-Host support","Routing","Routing response report","Multiple Slot booking","Booking Question API"],
//   },
// ];

// // ─── SHARED ───────────────────────────────────────────────────────────────
// const SectionTag = ({ children }) => (
//   <span style={{ display:"inline-block", background:"rgba(232,119,34,0.12)", color:"#e87722", padding:"5px 14px", borderRadius:50, fontSize:"0.75rem", fontWeight:600, letterSpacing:"0.5px", marginBottom:12 }}>
//     {children}
//   </span>
// );

// const MiniCard = ({ title, dur, mentor, type, initials, dark }) => (
//   <div style={{ background: dark?"#242424":"#fff", borderRadius:12, padding:18, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
//     <div style={{ fontSize:"0.9rem", fontWeight:700, color:dark?"#f0f0f0":"#1a1a2e", marginBottom:8 }}>{title}</div>
//     <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:20, padding:"3px 10px", fontSize:"0.7rem", fontWeight:600, marginBottom:10 }}>
//       <Clock size={11}/> {dur}
//     </div>
//     <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:dark?"#9ca3af":"#555", marginBottom:6 }}>
//       <div style={{ width:22, height:22, borderRadius:"50%", background:"#e87722", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.6rem", color:"#fff", fontWeight:700, flexShrink:0 }}>{initials||mentor[0]}</div>
//       <span>{mentor}</span>
//     </div>
//     <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:dark?"#9ca3af":"#555", marginBottom:4 }}><Video size={12}/><span>{type}</span></div>
//     <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:dark?"#9ca3af":"#555" }}><MapPin size={12}/><span>Fully Online</span></div>
//   </div>
// );

// // ─── BOOKING MODAL ────────────────────────────────────────────────────────
// function BookingModal({ open, onClose }) {
//   const [step, setStep] = useState("calendar");
//   const [calYear, setCalYear] = useState(2026);
//   const [calMonth, setCalMonth] = useState(4);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [successText, setSuccessText] = useState("");
//   const w = useWindowSize();
//   const isMob = w < 600;

//   useEffect(() => { if (open) { setStep("calendar"); setSelectedDate(null); setSelectedSlot(null); } }, [open]);
//   if (!open) return null;

//   const changeMonth = (dir) => {
//     let m = calMonth + dir, y = calYear;
//     if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
//     setCalMonth(m); setCalYear(y); setSelectedDate(null); setSelectedSlot(null);
//   };
//   const today = new Date();
//   const firstDay = new Date(calYear, calMonth, 1).getDay();
//   const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
//   const selectDate = (d) => { setSelectedDate({ d, m: calMonth, y: calYear }); setSelectedSlot(null); };
//   const selectSlot = (slot) => { setSelectedSlot(slot); setTimeout(() => setStep("form"), 280); };
//   const formatDate = (sd) => {
//     const dn = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
//     return `${dn[new Date(sd.y,sd.m,sd.d).getDay()]}, ${sd.d} ${MONTHS[sd.m]} ${sd.y}`;
//   };
//   const submit = () => {
//     if (!name || !email) { alert("Please fill in name and email."); return; }
//     setSuccessText(`📅 ${formatDate(selectedDate)} at ${selectedSlot}`);
//     setStep("success");
//   };
//   const inp = { width:"100%", padding:"10px 13px", border:"1.5px solid #e8ddd0", borderRadius:8, fontFamily:"Poppins, sans-serif", fontSize:"0.85rem", background:"#fafafa", outline:"none", boxSizing:"border-box" };

//   return (
//     <div onClick={e => e.target===e.currentTarget&&onClose()}
//       style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:isMob?8:16 }}>
//       <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:isMob?"98vw":860, maxHeight:"95vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
//         {/* Header */}
//         <div style={{ background:"linear-gradient(90deg,#1a1a2e,#2a2a4e)", padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", color:"#fff", fontSize:"0.76rem", flexShrink:0 }}>
//           <span>Powered by <strong>ILM ORA Bookings</strong></span>
//           <button onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={14}/></button>
//         </div>
//         {/* Body */}
//         <div style={{ display:"flex", flex:1, overflow:"hidden", flexDirection:isMob?"column":"row" }}>
//           {/* Sidebar — hidden on mobile */}
//           <div className="ilm-booking-sidebar" style={{ width:190, padding:"20px 16px", borderRight:"1px solid #f0ece8", flexDirection:"column", gap:10, background:"#fafafa", overflowY:"auto", flexShrink:0 }}>
//             <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#1a1a2e,#e87722)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", flexShrink:0 }}>IO</div>
//             <Logo size="1rem" variant="dark"/>
//             <div style={{ fontSize:"0.9rem", fontWeight:700, color:"#1a1a2e" }}>Free Demo Session</div>
//             {[[<Users size={12}/>, "Vikash Sharma"],[<Clock size={12}/>, "30 min"],[<Video size={12}/>, "Google Meet"]].map(([ic,txt],i)=>(
//               <div key={i} style={{ display:"flex", alignItems:"center", gap:7, fontSize:"0.76rem", color:"#555" }}>{ic}<span>{txt}</span></div>
//             ))}
//           </div>
//           {/* Main */}
//           <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
//             {step==="calendar" && (
//               <div style={{ padding:isMob?12:20, display:"flex", gap:14, flex:1, flexDirection:isMob?"column":"row" }}>
//                 {/* Calendar */}
//                 <div style={{ flex:1 }}>
//                   <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
//                     <button onClick={()=>changeMonth(-1)} style={{ width:28, height:28, border:"1px solid #e0dbd5", borderRadius:7, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={14}/></button>
//                     <div style={{ fontSize:"0.88rem", fontWeight:700, color:"#1a1a2e" }}>{MONTHS[calMonth]} {calYear}</div>
//                     <button onClick={()=>changeMonth(1)} style={{ width:28, height:28, border:"1px solid #e0dbd5", borderRadius:7, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={14}/></button>
//                   </div>
//                   <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
//                     {DAYS_SHORT.map(d=><div key={d} style={{ textAlign:"center", fontSize:"0.66rem", fontWeight:600, color:"#aaa", padding:"4px 0" }}>{d}</div>)}
//                     {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
//                     {Array(daysInMonth).fill(null).map((_,i)=>{
//                       const d=i+1, date=new Date(calYear,calMonth,d);
//                       const isPast=date<new Date(today.getFullYear(),today.getMonth(),today.getDate());
//                       const isWeekend=[0,6].includes(date.getDay());
//                       const isToday=d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear();
//                       const isSel=selectedDate&&selectedDate.d===d&&selectedDate.m===calMonth&&selectedDate.y===calYear;
//                       const disabled=isPast||isWeekend;
//                       return <div key={d} onClick={()=>!disabled&&selectDate(d)} style={{ aspectRatio:1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.76rem", borderRadius:"50%", cursor:disabled?"not-allowed":"pointer", color:disabled?"#ccc":isSel?"#fff":isToday?"#e87722":"#333", background:isSel?"#e87722":"transparent", border:isToday&&!isSel?"1.5px solid #e87722":"none", fontWeight:isSel||isToday?700:400, transition:"all 0.15s" }}>{d}</div>;
//                     })}
//                   </div>
//                   <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:5, fontSize:"0.68rem", color:"#888" }}><Globe size={11}/><span>Asia/Kolkata</span></div>
//                 </div>
//                 {/* Slots */}
//                 <div className="ilm-slot-col" style={{ width:isMob?"100%":125, display:"flex", flexDirection:"column", gap:7 }}>
//                   <div style={{ fontSize:"0.7rem", fontWeight:600, color:"#aaa", textAlign:"center", width:"100%" }}>Select slot</div>
//                   {selectedDate ? SLOTS.map(slot=>(
//                     <button key={slot} onClick={()=>selectSlot(slot)} style={{ flex:isMob?"1 0 28%":"unset", padding:"8px 6px", border:"1.5px solid #e87722", borderRadius:9, background:selectedSlot===slot?"#e87722":"#fff", color:selectedSlot===slot?"#fff":"#e87722", fontSize:"0.75rem", fontWeight:600, cursor:"pointer", fontFamily:"Poppins, sans-serif", transition:"all 0.15s" }}>{slot}</button>
//                   )) : <div style={{ fontSize:"0.73rem", color:"#bbb", textAlign:"center", paddingTop:12 }}>← Select a date first</div>}
//                 </div>
//               </div>
//             )}
//             {step==="form" && (
//               <div style={{ padding:isMob?"12px 14px":"20px 26px", display:"flex", flexDirection:"column" }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
//                   <button onClick={()=>setStep("calendar")} style={{ width:28, height:28, borderRadius:"50%", border:"1px solid #e0dbd5", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={14}/></button>
//                   <span style={{ fontSize:"0.8rem", fontWeight:600, color:"#e87722" }}>{selectedDate&&`${formatDate(selectedDate)}, ${selectedSlot}`}</span>
//                 </div>
//                 {[{label:"Name",type:"text",placeholder:"Your full name",val:name,set:setName},{label:"Email",type:"email",placeholder:"you@email.com",val:email,set:setEmail}].map(f=>(
//                   <div key={f.label} style={{ marginBottom:12 }}>
//                     <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#333", marginBottom:4 }}>{f.label}</label>
//                     <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={inp}/>
//                   </div>
//                 ))}
//                 <div style={{ marginBottom:12 }}>
//                   <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#333", marginBottom:4 }}>Phone Number</label>
//                   <div style={{ display:"flex" }}>
//                     <div style={{ padding:"10px 11px", border:"1.5px solid #e8ddd0", borderRight:"none", borderRadius:"8px 0 0 8px", background:"#fafafa", fontSize:"0.78rem", color:"#555", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>🇮🇳 +91</div>
//                     <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" style={{ ...inp, borderRadius:"0 8px 8px 0" }}/>
//                   </div>
//                 </div>
//                 <div style={{ marginBottom:14 }}>
//                   <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#333", marginBottom:4 }}>Message (Optional)</label>
//                   <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3} placeholder="Tell us about your goals..." style={{ ...inp, resize:"none" }}/>
//                 </div>
//                 <button onClick={submit} style={{ width:"100%", padding:13, background:"#1a1a2e", color:"#fff", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}
//                   onMouseOver={e=>e.currentTarget.style.background="#e87722"} onMouseOut={e=>e.currentTarget.style.background="#1a1a2e"}>
//                   Schedule Meeting
//                 </button>
//               </div>
//             )}
//             {step==="success" && (
//               <div style={{ padding:"36px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center" }}>
//                 <div style={{ fontSize:"3rem", marginBottom:12 }}>🎉</div>
//                 <div style={{ fontSize:"1.15rem", fontWeight:800, color:"#1a1a2e", marginBottom:8 }}>Demo Booked Successfully!</div>
//                 <div style={{ background:"rgba(232,119,34,0.1)", color:"#e87722", padding:"9px 22px", borderRadius:50, fontSize:"0.8rem", fontWeight:600, marginBottom:14 }}>{successText}</div>
//                 <div style={{ fontSize:"0.82rem", color:"#888", marginBottom:22, lineHeight:1.7 }}>You'll receive a confirmation email with the Google Meet link shortly.</div>
//                 <button onClick={onClose} style={{ maxWidth:200, width:"100%", padding:13, background:"#1a1a2e", color:"#fff", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>Done ✓</button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── AUTH MODAL ───────────────────────────────────────────────────────────
// function AuthModal({ mode, onClose, onSwitch }) {
//   const isSign = mode==="signin", isEnroll = mode==="enroll";
//   if (!mode) return null;
//   const inp = { width:"100%", padding:"10px 13px", border:"1.5px solid #e8ddd0", borderRadius:8, fontFamily:"Poppins, sans-serif", fontSize:"0.85rem", background:"#f5ede0", outline:"none", boxSizing:"border-box" };
//   return (
//     <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ display:"flex", position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:2000, alignItems:"center", justifyContent:"center", padding:16 }}>
//       <div style={{ background:"#fff", borderRadius:18, padding:"26px 22px", maxWidth:420, width:"100%", position:"relative", maxHeight:"95vh", overflowY:"auto" }}>
//         <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"#f5ede0", border:"none", borderRadius:8, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={15}/></button>
//         <h3 style={{ fontSize:"1.2rem", fontWeight:800, color:"#1a1a2e", marginBottom:6 }}>{isSign?"Welcome Back 👋":isEnroll?"Enroll Now 🎓":"Get Started Free ✦"}</h3>
//         <p style={{ color:"#666", fontSize:"0.82rem", marginBottom:18 }}>{isSign?"Sign in to your ILM ORA account":isEnroll?"Secure your spot in our next cohort":"Join 10,000+ learners on ILM ORA"}</p>
//         {!isSign&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Full Name</label><input type="text" placeholder="Your full name" style={inp}/></div>}
//         <div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Email Address</label><input type="email" placeholder="you@email.com" style={inp}/></div>
//         {isSign&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Password</label><input type="password" placeholder="••••••••" style={inp}/></div>}
//         {(mode==="signup"||isEnroll)&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Phone Number</label><input type="tel" placeholder="+91 98765 43210" style={inp}/></div>}
//         {mode==="signup"&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Interested In</label><select style={inp}><option>Product Management</option><option>UI/UX Design</option><option>Growth & Marketing</option><option>Full Stack Development</option></select></div>}
//         <button onClick={onClose} style={{ width:"100%", padding:12, background:"#1a1a2e", color:"#fff", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
//           {isSign?"Sign In":isEnroll?"Reserve My Seat →":"Create Free Account"}
//         </button>
//         {!isEnroll&&<p style={{ textAlign:"center", marginTop:12, fontSize:"0.76rem", color:"#666" }}>{isSign?"Don't have an account? ":"Already have an account? "}<span onClick={()=>onSwitch(isSign?"signup":"signin")} style={{ color:"#e87722", fontWeight:600, cursor:"pointer" }}>{isSign?"Sign Up":"Sign In"}</span></p>}
//       </div>
//     </div>
//   );
// }

// // ─── PRICING SECTION ──────────────────────────────────────────────────────
// function PricingSection({ th, setAuthMode }) {
//   const [billing, setBilling] = useState("monthly");
//   return (
//     <section id="pricing" style={{ padding:"56px 0", background:th.bg }}>
//       <div className="ilm-section-px" style={{ maxWidth:"100%" }}>
//         <div style={{ textAlign:"center", marginBottom:32 }}>
//           <SectionTag>Pricing Plans</SectionTag>
//           <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:14 }}>
//             Choose the Perfect Plan for <span style={{ color:th.orange }}>Your Needs</span>
//           </h2>
//           <div style={{ display:"inline-flex", alignItems:"center", background:th.white, border:`1px solid ${th.border}`, borderRadius:50, padding:4, marginBottom:8 }}>
//             {["monthly","yearly"].map(b=>(
//               <button key={b} onClick={()=>setBilling(b)} style={{ padding:"8px 22px", borderRadius:50, border:"none", cursor:"pointer", fontFamily:"Poppins, sans-serif", fontSize:"0.84rem", fontWeight:600, background:billing===b?"#1a1a2e":"transparent", color:billing===b?"#fff":th.muted, transition:"all 0.2s" }}>
//                 {b==="monthly"?"Monthly":"Yearly"}
//               </button>
//             ))}
//           </div>
//           {billing==="yearly"&&<div style={{ fontSize:"0.78rem", color:"#16a34a", fontWeight:600 }}>🎉 2 Months Free on Yearly Plans!</div>}
//         </div>
//         <div className="ilm-pricing-grid" style={{ maxWidth:1100, margin:"0 auto" }}>
//           {PRICING_PLANS.map((plan,i)=>{
//             const price = billing==="yearly" ? plan.yearlyPrice : plan.monthlyPrice;
//             return (
//               <div key={i} className="card-hover" style={{ background:plan.popular?"#1a1a2e":th.white, borderRadius:16, padding:"22px 18px", border:plan.popular?"2px solid #e87722":`1px solid ${th.border}`, position:"relative", boxShadow:plan.popular?"0 16px 48px rgba(232,119,34,0.15)":"none" }}>
//                 {plan.popular&&<div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"#e87722", color:"#fff", fontSize:"0.68rem", fontWeight:700, padding:"4px 14px", borderRadius:50, whiteSpace:"nowrap" }}>⭐ Most Popular</div>}
//                 <div style={{ fontSize:"0.97rem", fontWeight:700, color:plan.popular?"#fff":th.dark, marginBottom:4 }}>{plan.name}</div>
//                 <div style={{ fontSize:"0.73rem", color:plan.popular?"rgba(255,255,255,0.5)":th.muted, marginBottom:14, lineHeight:1.5 }}>{plan.tagline}</div>
//                 <div style={{ marginBottom:16 }}>
//                   {price===0
//                     ? <div style={{ fontSize:"1.9rem", fontWeight:800, color:plan.popular?"#fff":th.dark }}>Free</div>
//                     : <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
//                         <span style={{ fontSize:"0.83rem", fontWeight:600, color:plan.popular?"rgba(255,255,255,0.55)":th.muted }}>₹</span>
//                         <span style={{ fontSize:"1.9rem", fontWeight:800, color:plan.popular?"#e87722":th.dark }}>{price.toLocaleString()}</span>
//                         <span style={{ fontSize:"0.73rem", color:plan.popular?"rgba(255,255,255,0.4)":th.muted }}>/mo</span>
//                       </div>
//                   }
//                   {billing==="yearly"&&price>0&&<div style={{ fontSize:"0.68rem", color:plan.popular?"rgba(255,255,255,0.4)":th.muted, marginTop:2 }}>Billed ₹{(price*12).toLocaleString()}/year</div>}
//                 </div>
//                 <button onClick={()=>setAuthMode("signup")} style={{ width:"100%", padding:"10px 0", borderRadius:10, fontSize:"0.85rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", marginBottom:16, transition:"all 0.2s", background:plan.popular?"#e87722":"transparent", color:plan.popular?"#fff":th.dark, border:plan.popular?"none":`2px solid ${th.dark}` }}
//                   onMouseOver={e=>{e.currentTarget.style.background=plan.popular?"#d06a1a":th.dark;e.currentTarget.style.color="#fff";}}
//                   onMouseOut={e=>{e.currentTarget.style.background=plan.popular?"#e87722":"transparent";e.currentTarget.style.color=plan.popular?"#fff":th.dark;}}>
//                   {plan.btnLabel}
//                 </button>
//                 <div style={{ borderTop:`1px solid ${plan.popular?"rgba(255,255,255,0.1)":th.border}`, marginBottom:12 }}/>
//                 <div style={{ fontSize:"0.7rem", fontWeight:600, color:plan.popular?"rgba(255,255,255,0.4)":th.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>
//                   {i===0?"Key Features":`Everything in ${PRICING_PLANS[i-1].name} plus:`}
//                 </div>
//                 <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
//                   {plan.features.map((f,fi)=>(
//                     <div key={fi} style={{ display:"flex", alignItems:"flex-start", gap:7, fontSize:"0.76rem", color:plan.popular?"rgba(255,255,255,0.78)":th.text }}>
//                       <div style={{ width:15, height:15, borderRadius:"50%", background:plan.popular?"rgba(232,119,34,0.3)":"rgba(22,163,74,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
//                         <Check size={9} color={plan.popular?"#e87722":"#16a34a"}/>
//                       </div>
//                       <span style={{ lineHeight:1.4 }}>{f}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         {/* Enterprise */}
//         <div style={{ maxWidth:1100, margin:"24px auto 0", background:"linear-gradient(135deg,#1a1a2e,#2a2a4e)", borderRadius:16, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
//           <div>
//             <div style={{ fontSize:"1.05rem", fontWeight:700, color:"#fff", marginBottom:4 }}>Let's Build Tailored Enterprise Plan</div>
//             <div style={{ fontSize:"0.81rem", color:"rgba(255,255,255,0.52)" }}>Custom pricing, dedicated support, SSO, and advanced security for large teams.</div>
//           </div>
//           <button style={{ padding:"12px 22px", background:"#e87722", color:"#fff", border:"none", borderRadius:10, fontSize:"0.88rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", whiteSpace:"nowrap" }}
//             onMouseOver={e=>e.currentTarget.style.background="#d06a1a"} onMouseOut={e=>e.currentTarget.style.background="#e87722"}>
//             Contact Sales →
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────
// export default function ILMORAMeet({
//   theme = "light",
//   toggleTheme,
//   setShowLoginModal,
//   scrollToSection,
// }) {
//   const dark = theme === "dark";
//   const [authMode, setAuthMode] = useState(null);
//   const [bookingOpen, setBookingOpen] = useState(false);
//   const [activeSol, setActiveSol] = useState(0);
//   const w = useWindowSize();
//   const isMobile = w < 640;
//   const th = dark ? T.dark : T.light;

//   const scrollTo = useCallback((id) => {
//     const el = document.querySelector(id);
//     if (el) el.scrollIntoView({ behavior:"smooth" });
//   }, []);

//   const SP = "56px 0";
//   const spStyle = { padding: SP };

//   return (
//     <PublicLayout
//       theme={theme}
//       toggleTheme={toggleTheme}
//       setShowLoginModal={setShowLoginModal}
//       scrollToSection={scrollToSection}
//     >
//       <div className="meet-page" style={{ fontFamily:"Poppins, sans-serif", background:th.bg, color:th.text, minWidth:320, width:"100%" }}>
//         <StyleInjector/>

//         {/* ── HERO ── */}
//         <section style={{ paddingTop:44, paddingBottom:isMobile?32:44, paddingLeft:"5%", paddingRight:"5%", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", background:th.heroBg, position:"relative", overflow:"hidden" }}>
//           <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,119,34,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>
//           <div style={{ maxWidth:700, width:"100%", margin:"0 auto" }}>
//             <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:50, padding:"5px 14px", fontSize:"0.73rem", fontWeight:600, marginBottom:16, border:"1px solid rgba(232,119,34,0.2)" }}>
//               🚀 India's #1 Career Learning Platform
//             </div>
//             <h1 className="ilm-hero-h1" style={{ fontWeight:700, lineHeight:1.18, color:th.dark, marginBottom:14, letterSpacing:"-0.3px" }}>
//               Easy learning platform for <span style={{ color:th.orange, fontWeight:800 }}>everyone</span>
//             </h1>
//             <p style={{ fontSize:isMobile?"0.88rem":"0.97rem", color:th.muted, lineHeight:1.75, marginBottom:28, maxWidth:520, margin:"0 auto 28px" }}>
//               Eliminate the hassle of managing your career growth with an advanced platform that takes care of everything for you.
//             </p>
//             <div className="ilm-hero-btns" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:isMobile?24:40 }}>
//               <button onClick={()=>setBookingOpen(true)} style={{ padding:isMobile?"12px 22px":"13px 28px", background:th.dark, color:dark?"#0f0f0f":"#fff", borderRadius:10, border:"none", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif", width:isMobile?"100%":"auto", justifyContent:"center" }}>
//                 <Calendar size={16}/> Book Free Demo
//               </button>
//               <button onClick={()=>scrollTo("#courses")} style={{ padding:isMobile?"12px 22px":"13px 28px", background:"transparent", color:th.dark, border:`2px solid ${th.dark}`, borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", width:isMobile?"100%":"auto" }}>
//                 Explore Courses
//               </button>
//             </div>
//           </div>
//           {/* Widget Preview — hidden on mobile */}
//           <div className="ilm-hero-widget" style={{ width:"100%", maxWidth:640, margin:"0 auto", background:"#fff", borderRadius:14, boxShadow:"0 16px 60px rgba(0,0,0,0.12)", overflow:"hidden", border:"1px solid #e8ddd0" }}>
//             <div style={{ background:"linear-gradient(90deg,#1a1a2e,#2a2a4e)", padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//               <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.7rem" }}>←</span>
//               <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.7rem" }}>Powered by <strong style={{ color:"#fff" }}>ILM ORA</strong></span>
//               <span/>
//             </div>
//             <div style={{ display:"flex", minHeight:180 }}>
//               <div className="ilm-widget-sidebar" style={{ background:"#fafaf8", borderRight:"1px solid #f0ece8", padding:16, width:155, flexShrink:0, flexDirection:"column", gap:6 }}>
//                 <Logo size="1rem" variant="dark"/>
//                 <div style={{ fontSize:"0.58rem", color:"#aaa", marginBottom:4 }}>ilmora.texora.ai</div>
//                 <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#1a1a2e", marginBottom:6 }}>Free Demo Session</div>
//                 {[[<Clock size={10}/>, "30 min"],[<Video size={10}/>, "Google Meet"],[<User size={10}/>, "Vikash Sharma"]].map(([ic,txt],i)=>(
//                   <div key={i} style={{ fontSize:"0.66rem", color:"#888", marginBottom:3, display:"flex", alignItems:"center", gap:5 }}>{ic}{txt}</div>
//                 ))}
//               </div>
//               <div style={{ flex:1, padding:14 }}>
//                 <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
//                   <div style={{ width:22, height:22, border:"1px solid #e0dbd5", borderRadius:6, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={12}/></div>
//                   <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#1a1a2e" }}>June 2026</div>
//                   <div style={{ width:22, height:22, border:"1px solid #e0dbd5", borderRadius:6, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={12}/></div>
//                 </div>
//                 <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, fontSize:"0.65rem" }}>
//                   {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{ textAlign:"center", color:"#aaa", fontWeight:600, padding:"2px 0" }}>{d}</div>)}
//                   {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((d,i)=>{
//                     const wknd=[0,6].includes(i%7), sel=d===11;
//                     return <div key={d} style={{ textAlign:"center", padding:"4px 2px", borderRadius:"50%", color:wknd?"#ddd":sel?"#fff":"#555", background:sel?"#e87722":"transparent", fontWeight:sel?700:400 }}>{d}</div>;
//                   })}
//                 </div>
//               </div>
//               <div style={{ padding:"14px 10px", width:100, flexShrink:0, borderLeft:"1px solid #f0ece8" }}>
//                 <div style={{ fontSize:"0.63rem", color:"#aaa", fontWeight:600, marginBottom:7, textAlign:"center" }}>Select slot</div>
//                 {["09:00 am","09:30 am","10:00 am","10:30 am","11:00 am"].map((s,i)=>(
//                   <div key={s} style={{ padding:"5px 6px", border:"1.5px solid #e87722", borderRadius:7, color:i===0?"#fff":"#e87722", background:i===0?"#e87722":"transparent", fontSize:"0.66rem", fontWeight:600, textAlign:"center", marginBottom:5, cursor:"pointer" }}>{s}</div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── STATS ── */}
//         <section style={{ ...spStyle, background:th.statsBg, textAlign:"center" }} className="ilm-section-px">
//           <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:24 }}>ILM ORA Helps You Achieve</h2>
//           <div className="ilm-stats-grid" style={{ maxWidth:860, margin:"0 auto" }}>
//             {STATS.map((s,i)=>(
//               <div key={i} style={{ background:"linear-gradient(135deg,#1a1a2e,#2a2a4e)", borderRadius:14, padding:"20px 14px", color:"#fff" }}>
//                 <div style={{ fontSize:"0.7rem", fontWeight:500, opacity:0.65, marginBottom:5 }}>{s.label}</div>
//                 <div style={{ fontSize:"2rem", fontWeight:800, color:"#e87722", marginBottom:3 }}>{s.num}</div>
//                 <div style={{ fontSize:"0.68rem", opacity:0.55 }}>{s.sub}</div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── HOW IT WORKS ── */}
//         <section id="mentors" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//           <div style={{ textAlign:"center", marginBottom:36 }}>
//             <SectionTag>HOW IT WORKS</SectionTag>
//             <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Start your learning in <span style={{ color:th.orange }}>3 simple steps</span></h2>
//           </div>
//           <div className="ilm-howit-row" style={{ maxWidth:1060, margin:"0 auto" }}>
//             <div style={{ flex:1, minWidth:isMobile?"100%":280, display:"flex", flexDirection:"column", gap:26 }}>
//               {[{n:"1",title:"Enroll in a Program",desc:"Choose your course and create your personalized learning path with expert guidance."},
//                 {n:"2",title:"Set Your Schedule",desc:"Set your learning time at your convenience. Book 1:1 mentor sessions anytime."},
//                 {n:"3",title:"Learn & Get Hired",desc:"Complete projects, ace mock interviews and land your dream job with placement support."},
//               ].map((s,i,arr)=>(
//                 <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
//                   <div style={{ position:"relative" }}>
//                     <div style={{ width:38, height:38, borderRadius:"50%", background:"#e87722", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1rem", flexShrink:0 }}>{s.n}</div>
//                     {i<arr.length-1&&<div style={{ position:"absolute", left:18, top:38, bottom:-26, width:2, background:"linear-gradient(to bottom,#e87722,transparent)" }}/>}
//                   </div>
//                   <div>
//                     <h4 style={{ fontSize:"0.96rem", fontWeight:700, color:th.dark, marginBottom:4 }}>{s.title}</h4>
//                     <p style={{ fontSize:"0.83rem", color:th.muted, lineHeight:1.65 }}>{s.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="ilm-mini-card-wrap" style={{ background:th.bg, borderRadius:16, padding:20, border:`1px solid ${th.border}` }}>
//               <MiniCard title="Free Demo Session" dur="30 min" mentor="Vikash Sharma, Mentor" type="Google Meet" initials="VS" dark={dark}/>
//             </div>
//           </div>
//         </section>

//         {/* ── FEATURES ── */}
//         <section id="features" style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
//           <div style={{ textAlign:"center", marginBottom:32 }}>
//             <SectionTag>GET YOUR HANDS ON</SectionTag>
//             <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Features of our <span style={{ color:th.orange }}>Platform</span></h2>
//           </div>
//           <div className="ilm-feat-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
//             {FEATURES.map((f,i)=>(
//               <div key={i} className="card-hover" style={{ background:th.white, borderRadius:14, padding:"20px", border:`1px solid ${th.border}`, cursor:"default" }}
//                 onMouseOver={e=>e.currentTarget.style.borderColor="#e87722"}
//                 onMouseOut={e=>e.currentTarget.style.borderColor=th.border}>
//                 <div style={{ width:46, height:46, borderRadius:11, background:th.bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, border:`1px solid ${th.border}`, color:"#e87722" }}>{f.icon}</div>
//                 <h4 style={{ fontSize:"0.95rem", fontWeight:700, color:th.dark, marginBottom:7 }}>{f.title}</h4>
//                 <p style={{ fontSize:"0.82rem", color:th.muted, lineHeight:1.65 }}>{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── SOLUTIONS ── */}
//         <section id="courses" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//           <div style={{ textAlign:"center", marginBottom:26 }}>
//             <SectionTag>Build For Your Business</SectionTag>
//             <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Optimised learning for <span style={{ color:th.orange }}>all type of goals</span></h2>
//           </div>
//           <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:28 }}>
//             {SOLUTIONS.map((s,i)=>(
//               <button key={i} onClick={()=>setActiveSol(i)} style={{ display:"flex", alignItems:"center", gap:5, padding:isMobile?"6px 12px":"8px 18px", border:`1.5px solid ${i===activeSol?"#e87722":th.border}`, borderRadius:50, background:i===activeSol?"rgba(232,119,34,0.08)":th.cardBg, cursor:"pointer", fontSize:isMobile?"0.73rem":"0.8rem", fontWeight:600, color:i===activeSol?th.dark:th.muted, transition:"all 0.2s", fontFamily:"Poppins, sans-serif" }}>
//                 {s.tabIcon} {s.tab}
//               </button>
//             ))}
//           </div>
//           {SOLUTIONS.map((s,i)=>i===activeSol&&(
//             <div key={i} className="ilm-sol-flex" style={{ maxWidth:1060, margin:"0 auto" }}>
//               <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//                 <h3 className="ilm-sol-h3" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>{s.title}</h3>
//                 <p style={{ color:th.muted, lineHeight:1.75, marginBottom:14 }}>{s.desc}</p>
//                 <div style={{ fontSize:"1.7rem", fontWeight:800, color:th.orange, marginBottom:3 }}>{s.stat}</div>
//                 <div style={{ fontSize:"0.8rem", color:th.muted, marginBottom:16 }}>{s.statLabel}</div>
//                 <button onClick={()=>i===4?setBookingOpen(true):setAuthMode("enroll")} style={{ color:th.orange, fontSize:"0.85rem", fontWeight:600, background:"none", border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5, fontFamily:"Poppins, sans-serif" }}>
//                   {i===4?"Book a Session":"Enroll Now"} <ArrowRight size={14}/>
//                 </button>
//               </div>
//               <div className="ilm-mini-card-wrap" style={{ background:th.bg, borderRadius:14, padding:18, border:`1px solid ${th.border}` }}>
//                 <MiniCard {...s.card} initials={s.card.mentor[0]} dark={dark}/>
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* ── PRICING ── */}
//         <PricingSection th={th} setAuthMode={setAuthMode}/>

//         {/* ── INTEGRATIONS ── */}
//         <section style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//           <div className="ilm-integ-row" style={{ maxWidth:1060, margin:"0 auto" }}>
//             <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//               <SectionTag>Integrations</SectionTag>
//               <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>Integrate your favourite calendar</h2>
//               <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Integrate Zoom, Google Meet, and MS Teams seamlessly for hassle-free sessions.</p>
//               <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
//                 {[[<Video size={14}/>, "Zoom"],[<Video size={14}/>, "Google Meet"],[<Briefcase size={14}/>, "MS Teams"]].map(([ic,name],i)=>(
//                   <div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", background:th.bg, border:`1px solid ${th.border}`, borderRadius:50, fontSize:"0.8rem", fontWeight:600, color:th.dark }}>
//                     <span style={{ color:"#e87722" }}>{ic}</span> {name}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div style={{ flex:1, minWidth:isMobile?"100%":260, background:th.white, borderRadius:14, padding:18, boxShadow:dark?"none":"0 6px 30px rgba(0,0,0,0.07)", border:`1px solid ${th.border}` }}>
//               <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
//                 <div style={{ fontSize:"0.85rem", fontWeight:700, color:th.dark }}>June 2026</div>
//                 <div style={{ display:"flex", gap:6 }}>
//                   {[<ChevronLeft size={12}/>,<ChevronRight size={12}/>].map((ic,i)=>(
//                     <span key={i} style={{ width:24, height:24, border:`1px solid ${th.border}`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:th.muted }}>{ic}</span>
//                   ))}
//                 </div>
//               </div>
//               <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, fontSize:"0.7rem" }}>
//                 {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} style={{ textAlign:"center", color:"#aaa", fontWeight:600, padding:"3px 0" }}>{d}</div>)}
//                 {[2,3,4,5,6,7,1,9,10,11,12,13,14,8,16,17,18,19,20,21,15,23,24,25,26,27,28,22,30].map((d,i)=>(
//                   <div key={i} style={{ textAlign:"center", padding:"4px 2px", borderRadius:"50%", cursor:"pointer", color:[10,11,12].includes(d)?"#fff":th.text, background:[10,11,12].includes(d)?"#e87722":"transparent", fontWeight:[10,11,12].includes(d)?700:400 }}>{d}</div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── MOBILE APP ── */}
//         <section style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
//           <div className="ilm-mobile-app-row" style={{ maxWidth:1060, margin:"0 auto" }}>
//             <div style={{ flex:isMobile?undefined:1, minWidth:isMobile?"100%":180, display:"flex", justifyContent:"center" }}>
//               <div style={{ width:180, background:"#1a1a2e", borderRadius:28, padding:8, boxShadow:"0 16px 50px rgba(0,0,0,0.18)" }}>
//                 <div style={{ background:"#fafaf8", borderRadius:22, overflow:"hidden" }}>
//                   <div style={{ background:"#1a1a2e", padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                     <span style={{ color:"#fff", fontSize:"0.7rem", fontWeight:600 }}>9:41</span>
//                     <span style={{ color:"#fff", fontSize:"0.6rem" }}>●●●</span>
//                   </div>
//                   <div style={{ padding:11 }}>
//                     <Logo size="0.85rem" variant="dark"/>
//                     <div style={{ fontSize:"0.46rem", color:"#aaa", textAlign:"center", marginBottom:7 }}>ilmora.texora.ai</div>
//                     <div style={{ background:"#fff", borderRadius:8, padding:9, marginBottom:7, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
//                       <div style={{ fontSize:"0.68rem", fontWeight:700, color:"#1a1a2e", marginBottom:3 }}>Free Demo Session</div>
//                       <div style={{ display:"inline-flex", alignItems:"center", gap:3, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:7, padding:"2px 6px", fontSize:"0.54rem", fontWeight:600, marginBottom:4 }}><Clock size={8}/> 30 min</div>
//                       {[[<User size={8}/>, "Vikash Sharma"],[<Video size={8}/>, "Google Meet"],[<MapPin size={8}/>, "Online"]].map(([ic,txt],i)=>(
//                         <div key={i} style={{ fontSize:"0.58rem", color:"#666", marginBottom:2, display:"flex", alignItems:"center", gap:4 }}>{ic}{txt}</div>
//                       ))}
//                     </div>
//                     <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, fontSize:"0.48rem", color:"#555", textAlign:"center" }}>
//                       {["M","T","W","T","F","S","S"].map((d,i)=><span key={i}>{d}</span>)}
//                       {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((d,i)=>(
//                         <span key={i} style={{ background:d===10?"#e87722":"transparent", color:d===10?"#fff":"inherit", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", width:13, height:13, margin:"0 auto", fontWeight:d===10?700:400 }}>{d}</span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//               <SectionTag>Mobile App</SectionTag>
//               <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>Access your Learning from Anywhere</h2>
//               <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Learn on-the-go with your mentors and sessions with our mobile app available on App Store and Play Store.</p>
//               <div className="ilm-app-btns" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
//                 {[{icon:<Apple size={22}/>,small:"Download on the",big:"App Store"},{icon:<Play size={22}/>,small:"GET IT ON",big:"Google Play"}].map((b,i)=>(
//                   <a key={i} href="#" style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 18px", background:"#1a1a2e", color:"#fff", borderRadius:10, textDecoration:"none", transition:"all 0.2s" }}
//                     onMouseOver={e=>{e.currentTarget.style.background="#e87722";e.currentTarget.style.transform="translateY(-2px)";}}
//                     onMouseOut={e=>{e.currentTarget.style.background="#1a1a2e";e.currentTarget.style.transform="";}}>
//                     {b.icon}
//                     <div style={{ lineHeight:1.3 }}>
//                       <span style={{ fontSize:"0.57rem", opacity:0.65, display:"block" }}>{b.small}</span>
//                       <span style={{ fontSize:"0.82rem", fontWeight:700, display:"block" }}>{b.big}</span>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── CTA BANNER ── */}
//         <section style={{ ...spStyle, background:"linear-gradient(135deg,#1a1a2e 0%,#2a2a4e 100%)", textAlign:"center", position:"relative", overflow:"hidden" }} className="ilm-section-px">
//           <h2 className="ilm-cta-h2" style={{ fontWeight:700, color:"#fff", marginBottom:10, position:"relative", zIndex:1 }}>Easy access for easy learning</h2>
//           <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.92rem", marginBottom:26, position:"relative", zIndex:1 }}>Start your free 14-Day premium plan. Free Forever Plan also available.</p>
//           <div className="ilm-cta-btns" style={{ position:"relative", zIndex:1 }}>
//             <button onClick={()=>setBookingOpen(true)} style={{ padding:"13px 26px", background:"#fff", color:"#1a1a2e", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif" }}>
//               <Calendar size={15}/> Book Free Demo
//             </button>
//             <button onClick={()=>setAuthMode("signup")} style={{ padding:"13px 26px", background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,0.35)", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
//               Start Free Trial →
//             </button>
//           </div>
//         </section>

//         {/* ── REVIEWS ── */}
//         <section id="success" style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
//           <div style={{ textAlign:"center", maxWidth:540, margin:"0 auto 32px" }}>
//             <SectionTag>Student Stories</SectionTag>
//             <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>See What Our <span style={{ color:th.orange }}>Students Say</span></h2>
//           </div>
//           <div className="ilm-reviews-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
//             {REVIEWS.map((r,i)=>(
//               <div key={i} className="card-hover" style={{ background:th.white, border:`1px solid ${th.border}`, borderRadius:14, padding:"20px" }}>
//                 <div style={{ color:"#e87722", fontSize:"0.85rem", marginBottom:10 }}>★★★★★</div>
//                 <p style={{ fontSize:"0.82rem", color:th.text, lineHeight:1.65, marginBottom:14, fontStyle:"italic" }}>"{r.text}"</p>
//                 <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                   <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#e87722,#1a1a2e)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.8rem", flexShrink:0 }}>{r.initials}</div>
//                   <div>
//                     <div style={{ fontSize:"0.82rem", fontWeight:700, color:th.dark }}>{r.name}</div>
//                     <div style={{ fontSize:"0.7rem", color:th.muted }}>{r.role}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── ABOUT ── */}
//         <section id="careers" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//           <div className="ilm-about-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
//             <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//               <SectionTag>About ILM ORA</SectionTag>
//               <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, lineHeight:1.2, marginBottom:10 }}>Ready to start your learning in <span style={{ color:th.orange }}>one simple click.</span></h2>
//               <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Start your free 14-Day premium plan. ILM ORA is India's most trusted advanced learning platform for modern professionals.</p>
//               <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
//                 <button onClick={()=>setBookingOpen(true)} style={{ padding:"13px 22px", background:"#1a1a2e", color:"#fff", borderRadius:10, border:"none", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif" }}>
//                   <Calendar size={15}/> Book a Free Demo
//                 </button>
//                 <button onClick={()=>scrollTo("#courses")} style={{ padding:"13px 22px", background:"transparent", color:th.dark, border:`2px solid ${th.dark}`, borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
//                   See All Courses
//                 </button>
//               </div>
//             </div>
//             <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//               <div className="ilm-about-stats">
//                 {[{num:"10k+",label:"Worldwide Learners"},{num:"98%",label:"Placement Rate"},{num:"50+",label:"Expert Mentors"},{num:"4+",label:"Career Tracks"}].map((s,i)=>(
//                   <div key={i} className="card-hover" style={{ background:th.bg, borderRadius:14, padding:"18px", border:`1px solid ${th.border}`, textAlign:"center" }}
//                     onMouseOver={e=>e.currentTarget.style.borderColor="#e87722"}
//                     onMouseOut={e=>e.currentTarget.style.borderColor=th.border}>
//                     <div style={{ fontSize:"1.7rem", fontWeight:800, color:"#e87722" }}>{s.num}</div>
//                     <div style={{ fontSize:"0.72rem", color:th.muted, marginTop:3 }}>{s.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <BookingModal open={bookingOpen} onClose={()=>setBookingOpen(false)}/>
//         <AuthModal mode={authMode} onClose={()=>setAuthMode(null)} onSwitch={m=>setAuthMode(m)}/>
//       </div>
//     </PublicLayout>
//   );
// }








































// import React, { useState, useEffect, useRef, useCallback } from "react";

// // Same shared shell used by every other public page (Careers, ManagerHub,
// // About, Pricing, Contact, FAQ, etc). Lives at src/pages/Landing/components/PublicLayout.
// // If this file lives somewhere other than alongside those pages, adjust this path.
// import PublicLayout from "../Landing/components/PublicLayout";

// // Integration logos (from Icon_ilmora_calendry.zip). Copy the "integrations"
// // folder into your assets directory and adjust these import paths to match.
// // Path matches: src/pages/Landing/ilmorameet.jsx -> ../../assets/integration-icons-webp/
// // If you move the folder later (e.g. to src/assets/icons/integrations), update these paths to match.
// import zoomIcon from "../../assets/integration-icons-webp/zoom-logo-icon-1.webp";
// import googleCalendarIcon from "../../assets/integration-icons-webp/google-calendar-icon.webp";
// import gmailIcon from "../../assets/integration-icons-webp/google-gmail-icon.webp";
// import hubspotIcon from "../../assets/integration-icons-webp/hubspot.webp";
// import slackIcon from "../../assets/integration-icons-webp/slack-logo-icon.webp";
// import teamsIcon from "../../assets/integration-icons-webp/microsoft-teams-logo-icon.webp";
// import chromeIcon from "../../assets/integration-icons-webp/chrome-logo.webp";
// import linkedinIcon from "../../assets/integration-icons-webp/linkedin-logo-icon.webp";
// import openaiIcon from "../../assets/integration-icons-webp/openai-icon.webp";
// import claudeIcon from "../../assets/integration-icons-webp/claude-icon.webp";
// import greenhouseIcon from "../../assets/integration-icons-webp/greenhouse-logo-icon.webp";
// import microsoftIcon from "../../assets/integration-icons-webp/microsoft-logo-icon.webp";
// import paypalIcon from "../../assets/integration-icons-webp/paypal-icon.webp";
// import salesforceIcon from "../../assets/integration-icons-webp/saleforce.webp";
// import meetIcon from "../../assets/integration-icons-webp/google-meet-icon.webp";

// /**
//  * ILM ORA — full landing page, ported from the static HTML build.
//  * Nav + footer come from PublicLayout (same as the rest of the site);
//  * everything between them is this page's own content and styles, scoped
//  * under `.ilmora-landing` so nothing here leaks onto the shared shell.
//  */

// /* ================= data ================= */

// const CHAT_MESSAGES = [
//   ["AS", "av-b", "Can you show a real spec, not a template?"],
//   ["MR", "av-a", "Sharing one now. Notice how it opens with the decision."],
//   ["RK", "av-c", "Posted my draft in the assignment tab."],
//   ["DP", "av-d", "Which metric would you pick for onboarding?"],
//   ["MR", "av-a", "One you can move within a week. Let\u2019s work through it."],
// ];

// const JOURNEY = [
//   {
//     title: "Discover",
//     desc: "Find the class that fits your goal and your level.",
//     steps: [
//       "Browse tracks by goal and experience",
//       "See the mentor, schedule and syllabus first",
//       "Reserve your seat in one tap",
//     ],
//   },
//   {
//     title: "Join live",
//     desc: "Learn in the room with the mentor, not from a recording.",
//     steps: [
//       "Join from your phone or laptop",
//       "Ask questions and get answers as you go",
//       "Rewatch the session whenever you need",
//     ],
//   },
//   {
//     title: "Practice",
//     desc: "Apply the lesson to a real task the same week.",
//     steps: [
//       "Get an assignment based on real work",
//       "Receive feedback from mentors and Texora AI",
//       "Revise and resubmit until it is strong",
//     ],
//   },
//   {
//     title: "Get certified",
//     desc: "Finish with proof of skill you can show to employers.",
//     steps: [
//       "Receive your certificate when you complete a track",
//       "Share a verifiable link on your profile",
//       "Keep your progress across every course",
//     ],
//   },
// ];

// const TRACKS = [
//   {
//     id: "t-product",
//     nav: "Product",
//     cls: "tr-product",
//     h: "Product management",
//     p: "Learn to find the right problem, write the plan and measure the result.",
//     weeks: [
//       ["Week 1", "Discovery and problem framing"],
//       ["Week 2", "Specs, priorities and roadmaps"],
//       ["Week 3", "Metrics and experiments"],
//       ["Week 4", "Launch and iterate"],
//     ],
//     outputs: ["One-page spec", "Roadmap", "Metrics tree"],
//   },
//   {
//     id: "t-design",
//     nav: "Design",
//     cls: "tr-design",
//     h: "UX design",
//     p: "Move from research to a clickable prototype you can present with confidence.",
//     weeks: [
//       ["Week 1", "User research and flows"],
//       ["Week 2", "Wireframes and interaction"],
//       ["Week 3", "Visual design and systems"],
//       ["Week 4", "Usability testing and handoff"],
//     ],
//     outputs: ["Case study", "Prototype", "Design system starter"],
//   },
//   {
//     id: "t-growth",
//     nav: "Growth",
//     cls: "tr-growth",
//     h: "Growth",
//     p: "Understand the funnel, run better experiments and keep users coming back.",
//     weeks: [
//       ["Week 1", "Funnels and retention"],
//       ["Week 2", "Experiment design"],
//       ["Week 3", "Lifecycle messaging"],
//       ["Week 4", "Attribution and reporting"],
//     ],
//     outputs: ["Experiment plan", "Funnel report", "Lifecycle map"],
//   },
//   {
//     id: "t-marketing",
//     nav: "Marketing",
//     cls: "tr-marketing",
//     h: "Marketing",
//     p: "Say the right thing to the right people, and prove what worked.",
//     weeks: [
//       ["Week 1", "Positioning and messaging"],
//       ["Week 2", "Content and search"],
//       ["Week 3", "Paid and performance"],
//       ["Week 4", "Brand and community"],
//     ],
//     outputs: ["Messaging doc", "Content calendar", "Campaign brief"],
//   },
// ];

// const STORIES = [
//   {
//     cls: "s1",
//     avatar: "AS",
//     av: "av-b",
//     metric: "3 interviews in 4 weeks",
//     quote:
//       "\u201CThe spec I wrote in class became the centrepiece of my interview. I finally had something real to talk about.\u201D",
//     who: "Ananya S.",
//     role: "Junior product manager, Product track",
//   },
//   {
//     cls: "s2",
//     avatar: "RK",
//     av: "av-c",
//     metric: "Portfolio ready in 6 weeks",
//     quote:
//       "\u201CWeekly feedback from a working designer changed how I explain my decisions. My case study finally read like a story.\u201D",
//     who: "Rahul K.",
//     role: "UX designer, Design track",
//   },
//   {
//     cls: "s3",
//     avatar: "DP",
//     av: "av-d",
//     metric: "2\u00D7 signup conversion",
//     quote:
//       "\u201CI ran the first experiment from the course on our own landing page. The result convinced my team to test every week.\u201D",
//     who: "Divya P.",
//     role: "Growth associate, Growth track",
//   },
//   {
//     cls: "s4",
//     avatar: "IA",
//     av: "av-a",
//     metric: "Promoted to team lead",
//     quote:
//       "\u201CThe messaging framework gave my team a shared language. Leadership noticed, and so did our campaign results.\u201D",
//     who: "Imran A.",
//     role: "Marketing lead, Marketing track",
//   },
// ];

// const MARQUEE = [
//   { ico: "i-blue", title: "Seat reserved", sub: "Product Strategy Sprint", icon: "calendar" },
//   { ico: "i-mint", title: "Session attended", sub: "Live with an industry mentor", icon: "video" },
//   { ico: "i-peach", title: "Assignment graded", sub: "Feedback in your inbox", icon: "check" },
//   { ico: "i-lav", title: "Certificate earned", sub: "Verifiable link ready to share", icon: "seal" },
//   { ico: "i-butter", title: "Portfolio shared", sub: "Case study published", icon: "chart" },
//   { ico: "i-blue", title: "Interview booked", sub: "Your next step, scheduled", icon: "briefcase" },
// ];

// // Row 1 / Row 2 layout mirrors the reference (Calendly-style) integrations grid.
// const INTEGRATIONS_ROW_1 = [
//   { name: "Zoom", icon: zoomIcon },
//   { name: "Google Calendar", icon: googleCalendarIcon },
//   { name: "Gmail", icon: gmailIcon },
//   { name: "HubSpot", icon: hubspotIcon },
//   { name: "Slack", icon: slackIcon },
//   { name: "Microsoft Teams", icon: teamsIcon },
//   { name: "Chrome", icon: chromeIcon },
//   { name: "LinkedIn", icon: linkedinIcon },
// ];
// const INTEGRATIONS_ROW_2 = [
//   { name: "OpenAI", icon: openaiIcon },
//   { name: "Claude", icon: claudeIcon },
//   { name: "Greenhouse", icon: greenhouseIcon },
//   { name: "Microsoft", icon: microsoftIcon },
//   { name: "PayPal", icon: paypalIcon },
//   { name: "Salesforce", icon: salesforceIcon },
//   { name: "Google Meet", icon: meetIcon },
// ];

// const INTEGRATION_SUITES = [
//   {
//     icon: googleCalendarIcon,
//     title: "Google Workspace",
//     desc: "Get your class schedule done faster by connecting ILM ORA to Google Calendar, Meet, Gmail and more.",
//   },
//   {
//     icon: microsoftIcon,
//     title: "Microsoft suite",
//     desc: "Make live sessions easier with integrations for Microsoft Teams, Outlook and more.",
//   },
// ];

// /* ================= small icons ================= */

// function CheckIcon(props) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
//       <path d="M20 6 9 17l-5-5" />
//     </svg>
//   );
// }
// function SearchIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
//       <circle cx="11" cy="11" r="7" />
//       <path d="m20 20-3.5-3.5" />
//     </svg>
//   );
// }
// function SealIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="12" cy="9" r="6" />
//       <path d="m8.5 14 -1.5 8 5-3 5 3-1.5-8" />
//     </svg>
//   );
// }
// function ArrowRightIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M5 12h14M13 6l6 6-6 6" />
//     </svg>
//   );
// }
// function VideoIcon(props) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//       <rect x="3" y="6" width="13" height="12" rx="3" /><path d="m16 10 5-3v10l-5-3" />
//     </svg>
//   );
// }
// function SparkIcon(props) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//       <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
//     </svg>
//   );
// }
// function ShieldIcon(props) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//       <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="m9 12 2 2 4-4" />
//     </svg>
//   );
// }
// function ChatDotsIcon(props) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//       <path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 10h.01M12 10h.01M16 10h.01" />
//     </svg>
//   );
// }
// function ChevronIcon({ dir = "left" }) {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === "right" ? "rotate(180deg)" : "none" }}>
//       <path d="m15 6-6 6 6 6" />
//     </svg>
//   );
// }
// function marqueeIcon(name) {
//   switch (name) {
//     case "calendar":
//       return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />
//         </svg>
//       );
//     case "video":
//       return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="6" width="13" height="12" rx="3" /><path d="m16 10 5-3v10l-5-3" />
//         </svg>
//       );
//     case "check":
//       return <CheckIcon width="20" height="20" strokeWidth="2.4" />;
//     case "seal":
//       return <SealIcon />;
//     case "chart":
//       return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="4" width="18" height="16" rx="3" /><path d="m3 15 5-5 4 4 3-3 6 6" />
//         </svg>
//       );
//     default:
//       return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
//         </svg>
//       );
//   }
// }

// /* ================= reveal-on-scroll hook ================= */

// function useReveal(threshold = 0.15) {
//   const ref = useRef(null);
//   const [inView, setInView] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     if (reduce || !("IntersectionObserver" in window)) {
//       setInView(true);
//       return;
//     }
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) {
//             setInView(true);
//             io.unobserve(e.target);
//           }
//         });
//       },
//       { threshold }
//     );
//     io.observe(el);
//     return () => io.disconnect();
//   }, [threshold]);
//   return [ref, inView];
// }

// /* ================= main component ================= */

// export default function IlmoraMeet({
//   theme = "light",
//   toggleTheme,
//   setShowLoginModal,
//   scrollToSection,
// }) {
//   const [reduce, setReduce] = useState(false);

//   useEffect(() => {
//     setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
//   }, []);

//   return (
//     <PublicLayout
//       theme={theme}
//       toggleTheme={toggleTheme}
//       setShowLoginModal={setShowLoginModal}
//       scrollToSection={scrollToSection}
//     >
//       <div className="ilmora-landing" id="top">
//         <style>{CSS}</style>

//         <main>
//           <Hero reduce={reduce} />
//           <BookingShowcase reduce={reduce} />
//           <Journey reduce={reduce} />
//           <Tracks />
//           <Stories />
//           <Marquee reduce={reduce} />
//           <Integrations />
//         </main>
//       </div>
//     </PublicLayout>
//   );
// }

// /* ---------------- Hero ---------------- */

// function Hero({ reduce }) {
//   const [chat, setChat] = useState(CHAT_MESSAGES.slice(0, 3));
//   const idxRef = useRef(3);
//   const [seconds, setSeconds] = useState(42 * 60 + 18);

//   useEffect(() => {
//     if (reduce) return;
//     const t = setInterval(() => {
//       const m = CHAT_MESSAGES[idxRef.current % CHAT_MESSAGES.length];
//       idxRef.current += 1;
//       setChat((prev) => [...prev, m].slice(-3));
//     }, 2800);
//     return () => clearInterval(t);
//   }, [reduce]);

//   useEffect(() => {
//     if (reduce) return;
//     const t = setInterval(() => setSeconds((s) => s + 1), 1000);
//     return () => clearInterval(t);
//   }, [reduce]);

//   const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
//   const ss = String(seconds % 60).padStart(2, "0");

//   return (
//     <section className="hero">
//       <div className="wrap hero-in">
//         <div className="hero-copy">
//           <h1>Learn live from people who do the work.</h1>
//           <p className="lead">
//             Master Product, Design, Growth and Marketing in live sessions led by industry experts,
//             with real assignments, feedback and a certificate at the end.
//           </p>
//           <div className="hero-actions">
//             <a className="btn btn-primary" href="#join">Join a live class</a>
//             <a className="btn btn-line" href="#tracks">Explore the tracks</a>
//           </div>
//           <p className="fine">Pick a track, reserve a seat and join from any device.</p>
//         </div>

//         <div className="hero-stage">
//           <div
//             className="live"
//             role="img"
//             aria-label="Preview of a live class with a mentor, learner chat and a graded assignment notification"
//           >
//             <div className="live-bar" aria-hidden="true">
//               <span className="live-tag"><i /> Live</span>
//               <span className="live-title">Writing a spec engineers actually read</span>
//               <span className="live-time">{mm}:{ss}</span>
//             </div>
//             <div className="live-video" aria-hidden="true">
//               <div className="mentor">
//                 <span className="avatar lg av-a">MR</span>
//                 <div className="eq"><i /><i /><i /><i /><i /></div>
//               </div>
//               <div className="caption">Start with the decision the reader has to make.</div>
//               <div className="thumbs">
//                 <span className="avatar sm av-b">AS</span>
//                 <span className="avatar sm av-c">RK</span>
//                 <span className="avatar sm av-d">DP</span>
//               </div>
//             </div>
//             <div className="chat" aria-hidden="true">
//               {chat.map((m, i) => (
//                 <div className="msg" key={`${m[0]}-${i}-${m[2].slice(0, 6)}`}>
//                   <span className={`avatar xs ${m[1]}`}>{m[0]}</span>
//                   <span className="bubble">{m[2]}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="live-foot" aria-hidden="true">
//               <span>148 learners in the room</span>
//               <span className="hand">Hand raised</span>
//             </div>
//           </div>

//           <div className="chip chip-a" aria-hidden="true">
//             <span className="ico"><CheckIcon width="18" height="18" /></span>
//             <span><b>Assignment graded</b><small>92 out of 100</small></span>
//           </div>
//           <div className="chip chip-b" aria-hidden="true">
//             <span className="ico"><SealIcon /></span>
//             <span><b>Certificate ready</b><small>Product Management</small></span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- Booking showcase ---------------- */
// /* Ported from the Calendly hero: a gradient card peeking with floating
//    icon bubbles at the top, a glass info panel on the left and a live
//    calendar/time-slot mock on the right. A fake cursor drives the whole
//    demo automatically on a loop (pick a date -> pick a slot -> confirm),
//    so nothing needs to be clicked for the motion to happen. */

// // Each floating icon now drives its OWN panel: its own left-side copy and
// // its own right-side mock, not just a shared calendar. `key` matches the
// // panel that BookingShowcase renders below. `duration` is how long that
// // panel stays on screen during the automatic cycle before advancing to the
// // next one (the calendar panel gets more time since it runs its own
// // pick-a-date -> pick-a-slot -> confirm animation).
// const FEATURES = [
//   {
//     key: "video",
//     Icon: VideoIcon,
//     label: "Live sessions",
//     badge: "Scheduling",
//     heading: "Book a seat with the world\u2019s best mentors",
//     desc: "Giving you complete control over your calendar, ILM ORA makes it the easiest and most flexible way to find your next live class.",
//     linkText: "Learn more",
//     duration: 7200,
//   },
//   {
//     key: "spark",
//     Icon: SparkIcon,
//     label: "AI-matched mentors",
//     badge: "AI matching",
//     heading: "Get matched to the right mentor, instantly",
//     desc: "Texora AI reads your goal and current level, then recommends the class and mentor most likely to move you forward this week.",
//     linkText: "See how matching works",
//     duration: 3200,
//   },
//   {
//     key: "shield",
//     Icon: ShieldIcon,
//     label: "Verified credentials",
//     badge: "Credentials",
//     heading: "A certificate employers can actually check",
//     desc: "Every certificate carries a verifiable link, so anyone you share it with can confirm it in seconds.",
//     linkText: "View a sample certificate",
//     duration: 3200,
//   },
//   {
//     key: "chat",
//     Icon: ChatDotsIcon,
//     label: "Live chat support",
//     badge: "Support",
//     heading: "Help is one message away",
//     desc: "Stuck mid-assignment or unsure which track fits? Message a mentor or our support team and get a real answer, fast.",
//     linkText: "Message support",
//     duration: 3200,
//   },
// ];

// const CURSOR_DATE = 24;
// const CURSOR_SLOT = "2:00 PM";

// function BookingShowcase({ reduce }) {
//   const [headRef, headIn] = useReveal();
//   const [cardRef, cardIn] = useReveal(0.2);

//   const stageRef = useRef(null);
//   const dateElRef = useRef(null);
//   const slotElRef = useRef(null);
//   const confirmElRef = useRef(null);

//   const [cursor, setCursor] = useState({ x: 24, y: 24, show: false });
//   const [pickedDate, setPickedDate] = useState(19);
//   const [pickedSlot, setPickedSlot] = useState(null);
//   const [confirming, setConfirming] = useState(false);
//   const [activeFloat, setActiveFloat] = useState(0);
//   const current = FEATURES[activeFloat];
//   const isVideoActive = activeFloat === 0;

//   // Auto-advance through the four feature panels. Each panel gets its own
//   // dwell time (see FEATURES[].duration) before moving to the next one.
//   // Clicking an icon jumps straight to that panel and restarts the timer
//   // from there, so manual and automatic motion share the same state.
//   useEffect(() => {
//     if (reduce) return;
//     const t = setTimeout(() => {
//       setActiveFloat((i) => (i + 1) % FEATURES.length);
//     }, FEATURES[activeFloat].duration);
//     return () => clearTimeout(t);
//   }, [reduce, activeFloat]);

//   // The pick-a-date -> pick-a-slot -> confirm cursor demo only plays while
//   // the "Live sessions" (calendar) panel is the one on screen. Switching to
//   // any other panel resets it so it starts clean the next time it's shown.
//   useEffect(() => {
//     if (reduce) {
//       setPickedDate(CURSOR_DATE);
//       setPickedSlot(CURSOR_SLOT);
//       return;
//     }
//     if (!isVideoActive) {
//       setPickedDate(19);
//       setPickedSlot(null);
//       setConfirming(false);
//       setCursor((c) => ({ ...c, show: false }));
//       return;
//     }

//     let cancelled = false;
//     const wait = (ms) => new Promise((r) => setTimeout(r, ms));

//     const moveCursorTo = (el) => {
//       if (!el || !stageRef.current) return;
//       const target = el.getBoundingClientRect();
//       const stage = stageRef.current.getBoundingClientRect();
//       setCursor({
//         x: target.left - stage.left + target.width / 2,
//         y: target.top - stage.top + target.height / 2,
//         show: true,
//       });
//     };

//     async function run() {
//       setPickedDate(19);
//       setPickedSlot(null);
//       setConfirming(false);
//       setCursor((c) => ({ ...c, x: 24, y: 24, show: false }));
//       await wait(500);
//       if (cancelled) return;

//       moveCursorTo(dateElRef.current);
//       await wait(650);
//       if (cancelled) return;
//       setPickedDate(CURSOR_DATE);
//       await wait(550);
//       if (cancelled) return;

//       moveCursorTo(slotElRef.current);
//       await wait(650);
//       if (cancelled) return;
//       setPickedSlot(CURSOR_SLOT);
//       await wait(550);
//       if (cancelled) return;

//       moveCursorTo(confirmElRef.current);
//       await wait(650);
//       if (cancelled) return;
//       setConfirming(true);
//       await wait(900);
//       if (cancelled) return;

//       setCursor((c) => ({ ...c, show: false }));
//     }
//     run();
//     return () => {
//       cancelled = true;
//     };
//   }, [isVideoActive, reduce]);

//   return (
//     <section className="section booking" id="booking">
//       <div className="wrap">
//         <div ref={headRef} className={`sec-head center reveal${headIn ? " in" : ""}`}>
//           <h2>Book your next session in seconds</h2>
//           <p>One calendar for every mentor, every track, every time zone.</p>
//         </div>

//         <div ref={cardRef} className={`booking-card reveal${cardIn ? " in" : ""}`}>
//           <div className="booking-floaters" role="tablist" aria-label="ILM ORA features">
//             {FEATURES.map(({ Icon, label }, i) => (
//               <button
//                 key={label}
//                 type="button"
//                 role="tab"
//                 aria-selected={activeFloat === i}
//                 title={label}
//                 className={`float-ico${activeFloat === i ? " is-active" : ""}${reduce ? " no-float" : ""}`}
//                 style={{ animationDelay: `${i * 0.35}s` }}
//                 onClick={() => setActiveFloat(i)}
//               >
//                 <Icon />
//                 <span className="float-label">{label}</span>
//               </button>
//             ))}
//           </div>

//           <div className="booking-panels" ref={stageRef}>
//             <div className="booking-info" key={`info-${current.key}`}>
//               <span className="badge">{current.badge}</span>
//               <h3>{current.heading}</h3>
//               <p>{current.desc}</p>
//               <a className="link-underline" href="#tracks">{current.linkText} <ArrowRightIcon /></a>
//             </div>

//             <div className="booking-visual" key={`visual-${current.key}`} aria-hidden="true">
//               {current.key === "video" && (
//                 <div className="booking-calendar">
//                   <div className="bc-head">
//                     <span>September 2026</span>
//                     <span className="bc-nav">
//                       <i><ChevronIcon dir="left" /></i>
//                       <i><ChevronIcon dir="right" /></i>
//                     </span>
//                   </div>
//                   <div className="bc-week">
//                     {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
//                       <span key={i}>{d}</span>
//                     ))}
//                   </div>
//                   <div className="bc-days">
//                     {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
//                       <span
//                         key={d}
//                         ref={d === CURSOR_DATE ? dateElRef : null}
//                         className={d === 19 ? "is-today" : d === pickedDate ? "is-picked" : ""}
//                       >
//                         {d}
//                       </span>
//                     ))}
//                   </div>
//                   <div className="bc-slots">
//                     {["10:00 AM", CURSOR_SLOT, "4:30 PM"].map((s) => (
//                       <span
//                         key={s}
//                         ref={s === CURSOR_SLOT ? slotElRef : null}
//                         className={`bc-slot${s === pickedSlot ? " is-picked" : ""}`}
//                       >
//                         {s}
//                       </span>
//                     ))}
//                   </div>
//                   <div
//                     ref={confirmElRef}
//                     className={`bc-confirm${confirming ? " is-confirming" : ""}`}
//                   >
//                     {confirming ? "Seat confirmed" : "Confirm seat"}
//                   </div>
//                 </div>
//               )}

//               {current.key === "spark" && (
//                 <div className="feature-card match-card">
//                   <span className="mini-badge">Texora AI match</span>
//                   <div className="match-row">
//                     <span className="avatar sm av-a">MR</span>
//                     <div>
//                       <b>Meera Rao</b>
//                       <small>Product mentor &middot; 98% fit for your goal</small>
//                     </div>
//                   </div>
//                   <div className="match-row">
//                     <span className="avatar sm av-b">AS</span>
//                     <div>
//                       <b>Writing Specs Engineers Read</b>
//                       <small>Recommended next class, Sunday 11:00</small>
//                     </div>
//                   </div>
//                   <div className="m-btn"><span>View match</span></div>
//                 </div>
//               )}

//               {current.key === "shield" && (
//                 <div className="feature-card cert-mini">
//                   <small>Certificate of completion</small>
//                   <h4>Product Management</h4>
//                   <div className="who">Ananya Sharma</div>
//                   <small>completed all sessions and assignments</small>
//                   <span className="verified">
//                     <CheckIcon width="16" height="16" strokeWidth="2.6" />
//                     Verified credential
//                   </span>
//                 </div>
//               )}

//               {current.key === "chat" && (
//                 <div className="feature-card chat-mini">
//                   <div className="msg">
//                     <span className="avatar xs av-c">RK</span>
//                     <span className="bubble">Which metric should I pick for onboarding?</span>
//                   </div>
//                   <div className="msg">
//                     <span className="avatar xs av-a">MR</span>
//                     <span className="bubble">Start with activation rate in week one.</span>
//                   </div>
//                   <div className="m-btn"><span>Ask a mentor</span></div>
//                 </div>
//               )}

//               {!reduce && isVideoActive && (
//                 <div
//                   className={`fake-cursor${cursor.show ? " is-visible" : ""}${confirming ? " is-clicking" : ""}`}
//                   style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
//                   aria-hidden="true"
//                 >
//                   <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
//                     <path d="M2 1.5 19 9.2l-6.9 1.6L9 19 2 1.5Z" fill="#1a1a2e" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- Learning journey (accordion + auto-advance) ---------------- */

// function Journey({ reduce }) {
//   const [headRef, headIn] = useReveal();
//   const tabsRef = useRef(null);
//   const [active, setActive] = useState(0);
//   const [mode, setMode] = useState("idle"); // idle | play | manual
//   const [runId, setRunId] = useState(0);

//   const setIndex = useCallback((n, manual) => {
//     setActive((cur) => {
//       const total = JOURNEY.length;
//       const next = ((n % total) + total) % total;
//       return next;
//     });
//     if (manual) setMode("manual");
//     setRunId((k) => k + 1);
//   }, []);

//   useEffect(() => {
//     if (reduce) {
//       setMode("manual");
//       return;
//     }
//     const el = tabsRef.current;
//     if (!el || !("IntersectionObserver" in window)) return;
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           setMode((m) => (m === "manual" ? m : e.isIntersecting ? "play" : "idle"));
//         });
//       },
//       { threshold: 0.4 }
//     );
//     io.observe(el);
//     return () => io.disconnect();
//   }, [reduce]);

//   const onBarEnd = () => {
//     if (mode === "play") setIndex(active + 1, false);
//   };

//   const onKeyDown = (e, k) => {
//     if (e.key === "ArrowDown" || e.key === "ArrowUp") {
//       e.preventDefault();
//       const t = (k + (e.key === "ArrowDown" ? 1 : -1) + JOURNEY.length) % JOURNEY.length;
//       setIndex(t, true);
//       requestAnimationFrame(() => {
//         document.getElementById(`acc-btn-${t + 1}`)?.focus();
//       });
//     }
//   };

//   return (
//     <section className="section" id="journey">
//       <div className="wrap">
//         <div ref={headRef} className={`sec-head reveal${headIn ? " in" : ""}`}>
//           <h2>Everything between “I want to learn this” and “I can do this”</h2>
//           <p>From choosing a class to holding a certificate, each step happens in one place.</p>
//         </div>

//         <div className="tabs" id="tabs" ref={tabsRef} data-mode={mode}>
//           <div className="acc-list">
//             {JOURNEY.map((item, k) => {
//               const isActive = k === active;
//               return (
//                 <div className={`acc${isActive ? " is-active" : ""}`} key={item.title}>
//                   <button
//                     className="acc-btn"
//                     id={`acc-btn-${k + 1}`}
//                     aria-expanded={isActive}
//                     aria-controls={`acc-p-${k + 1}`}
//                     onClick={() => setIndex(k, true)}
//                     onKeyDown={(e) => onKeyDown(e, k)}
//                   >
//                     {item.title}
//                   </button>
//                   <div className="acc-panel" id={`acc-p-${k + 1}`} role="region" aria-labelledby={`acc-btn-${k + 1}`}>
//                     <div className="acc-inner">
//                       <p className="acc-desc">{item.desc}</p>
//                       <div className="steps">
//                         {item.steps.map((s) => (
//                           <div className="step" key={s}><CheckIcon />{s}</div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bar">
//                     {isActive && (
//                       <i
//                         key={`${k}-${mode}-${runId}`}
//                         className={mode === "play" ? "bar-play" : "bar-full"}
//                         onAnimationEnd={onBarEnd}
//                       />
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="stage" aria-hidden="true">
//             <div className={`scene sc1${active === 0 ? " is-active" : ""}`}>
//               <div className="m-card">
//                 <div className="m-in"><SearchIcon /> product management</div>
//                 <div className="m-row"><div><b>Product Strategy Sprint</b><small>Saturday 10:00, 3 sessions</small></div><span className="tag">Product</span></div>
//                 <div className="m-row sel"><div><b>Writing Specs Engineers Read</b><small>Sunday 11:00, live with Meera Rao</small></div><span className="tag">Product</span></div>
//                 <div className="m-row"><div><b>Research to Prototype</b><small>Saturday 14:00, 4 sessions</small></div><span className="tag t2">Design</span></div>
//                 <div className="m-btn"><span>Reserve seat</span></div>
//               </div>
//             </div>

//             <div className={`scene sc2${active === 1 ? " is-active" : ""}`}>
//               <div className="m-card">
//                 <div className="m-grid">
//                   <div className="tile big"><div className="eq"><i /><i /><i /><i /><i /></div><small>Meera, mentor</small></div>
//                   <div className="tile av-b">AS</div>
//                   <div className="tile av-c">RK</div>
//                 </div>
//                 <div className="m-cc">\u201CStart with the decision the reader has to make.\u201D</div>
//                 <div className="m-meta"><span>Live captions on</span><span className="hand">Rahul raised a hand</span></div>
//               </div>
//             </div>

//             <div className={`scene sc3${active === 2 ? " is-active" : ""}`}>
//               <div className="m-card">
//                 <span className="score">92 <small>out of 100</small></span>
//                 <div className="m-title">Assignment: write a one-page spec for a checkout fix</div>
//                 <div className="m-prog"><i /></div>
//                 <div className="m-sub"><span>Draft submitted</span><span>Reviewed</span></div>
//                 <div className="fb"><span className="avatar sm av-a">MR</span><span className="bubble">Clear problem statement. Add one success metric and it is ready.</span></div>
//               </div>
//             </div>

//             <div className={`scene sc4${active === 3 ? " is-active" : ""}`}>
//               <div className="m-card cert">
//                 <small>Certificate of completion</small>
//                 <h4>Product Management</h4>
//                 <div className="who">Ananya Sharma</div>
//                 <small>completed all sessions and assignments</small>
//                 <div className="seal">ILM ORA</div>
//                 <span className="verified"><CheckIcon width="16" height="16" strokeWidth="2.6" />Verified credential</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- Tracks (sticky nav + scroll spy) ---------------- */

// function Tracks() {
//   const [activeId, setActiveId] = useState(TRACKS[0].id);
//   const refs = useRef({});

//   useEffect(() => {
//     if (!("IntersectionObserver" in window)) return;
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) setActiveId(e.target.id);
//         });
//       },
//       { rootMargin: "-40% 0px -50% 0px" }
//     );
//     Object.values(refs.current).forEach((el) => el && io.observe(el));
//     return () => io.disconnect();
//   }, []);

//   return (
//     <section className="section tracks" id="tracks">
//       <div className="wrap tracks-in">
//         <div className="tracks-side">
//           <div className="sticky">
//             <h2>Four tracks, one way of learning</h2>
//             <p>Every track follows the same rhythm: live session, assignment, feedback, repeat.</p>
//             <ul className="track-nav">
//               {TRACKS.map((t) => (
//                 <li key={t.id}>
//                   <a href={`#${t.id}`} className={activeId === t.id ? "is-active" : ""}>{t.nav}</a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="tracks-list">
//           {TRACKS.map((t) => (
//             <TrackCard key={t.id} track={t} setRef={(el) => (refs.current[t.id] = el)} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function TrackCard({ track, setRef }) {
//   const [revealRef, inView] = useReveal();
//   return (
//     <article
//       className={`track ${track.cls}${inView ? " in" : ""}`}
//       id={track.id}
//       ref={(el) => {
//         setRef(el);
//         revealRef.current = el;
//       }}
//     >
//       <h3>{track.h}</h3>
//       <p>{track.p}</p>
//       <ol className="timeline">
//         {track.weeks.map(([wk, label]) => (
//           <li key={wk}><small>{wk}</small><b>{label}</b></li>
//         ))}
//       </ol>
//       <div className="outputs">
//         {track.outputs.map((o) => (
//           <span key={o}>{o}</span>
//         ))}
//       </div>
//     </article>
//   );
// }

// /* ---------------- Learner stories ---------------- */

// function Stories() {
//   const [headRef, headIn] = useReveal();
//   const [active, setActive] = useState(0);

//   const open = (i) => setActive(i);

//   return (
//     <section className="section" id="stories">
//       <div className="wrap">
//         <div ref={headRef} className={`sec-head reveal${headIn ? " in" : ""}`}>
//           <h2>Real learners, real next steps</h2>
//           <p>Hover or tap a card to read the story.</p>
//         </div>

//         <div className="stories">
//           {STORIES.map((s, i) => {
//             const isActive = i === active;
//             return (
//               <button
//                 key={s.cls}
//                 className={`story ${s.cls}${isActive ? " is-active" : ""}`}
//                 aria-expanded={isActive}
//                 onClick={() => open(i)}
//                 onFocus={() => open(i)}
//                 onMouseEnter={() => {
//                   if (window.matchMedia("(hover:hover) and (min-width:821px)").matches) open(i);
//                 }}
//               >
//                 <span className={`avatar ${s.av}`}>{s.avatar}</span>
//                 <span className="s-metric">{s.metric}</span>
//                 <span className="s-detail">
//                   <span className="s-quote">{s.quote}</span>
//                   <span className="s-who"><b>{s.who}</b> {s.role}</span>
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- Marquee ---------------- */

// function Marquee({ reduce }) {
//   const items = [...MARQUEE, ...MARQUEE]; // duplicate for a seamless loop
//   return (
//     <section className="marquee-sec" aria-label="Moments from the learning journey">
//       <div className="marquee">
//         <div className={`m-track${reduce ? " no-anim" : ""}`}>
//           {items.map((m, i) => (
//             <div className="m-item" key={`${m.title}-${i}`} aria-hidden={i >= MARQUEE.length}>
//               <span className={`ico ${m.ico}`}>{marqueeIcon(m.icon)}</span>
//               <span><b>{m.title}</b><small>{m.sub}</small></span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- Integrations (replaces the old FinalCta) ---------------- */
// /* Layout modeled on the Calendly "Connect Calendly with your favorite tools"
//    section: eyebrow label, heading, subtext, a "view all" link, a two-row
//    logo grid, then two suite cards underneath. */

// function Integrations() {
//   const [headRef, headIn] = useReveal();
//   const [gridRef, gridIn] = useReveal(0.05);

//   return (
//     <section className="section integrations" id="join">
//       <div className="wrap">
//         <div ref={headRef} className={`int-head reveal${headIn ? " in" : ""}`}>
//           <span className="int-eyebrow">15+ integrations</span>
//           <h2>Connect ILM ORA with your favorite tools</h2>
//           <p>Our growing list of integrations makes ILM ORA flexible.</p>
//           <a className="int-viewall" href="#join">
//             View all integrations <ArrowRightIcon />
//           </a>
//         </div>

//         <div ref={gridRef} className={`int-grid reveal${gridIn ? " in" : ""}`}>
//           <div className="int-row">
//             {INTEGRATIONS_ROW_1.map((it) => (
//               <span className="int-tile" key={it.name} title={it.name}>
//                 <img src={it.icon} alt={it.name} loading="lazy" />
//               </span>
//             ))}
//           </div>
//           <div className="int-row">
//             {INTEGRATIONS_ROW_2.map((it) => (
//               <span className="int-tile" key={it.name} title={it.name}>
//                 <img src={it.icon} alt={it.name} loading="lazy" />
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="int-suites">
//           {INTEGRATION_SUITES.map((s) => (
//             <div className="int-suite" key={s.title}>
//               <span className="int-suite-ico"><img src={s.icon} alt="" /></span>
//               <div>
//                 <b>{s.title}</b>
//                 <p>{s.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ================= styles ================= */

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// .ilmora-landing{
//   --ink:#1a1a2e; --ink-2:#666666; --line:#e8ddd0; --bg:#f5ede0; --white:#fff;
//   --blue:#e87722; --blue-d:#d06a1a; --sky:#FFE3C7; --mint:#FFD9B0; --peach:#FFC7A3;
//   --lav:#FFDCC2; --butter:#FFE8A3;
//   --ease:cubic-bezier(.22,1,.36,1); --d-fast:200ms; --d-base:600ms; --d-slow:900ms;
//   --r-xl:28px; --r-lg:22px; --r-md:14px; --r-sm:10px;
//   --shadow-card:0 30px 60px -24px rgba(26,26,46,.28), 0 2px 8px rgba(26,26,46,.06);
//   --shadow-soft:0 12px 30px -14px rgba(26,26,46,.20);
//   --font-display:"Poppins","Segoe UI",system-ui,sans-serif;
//   --font-body:"Poppins","Segoe UI",system-ui,-apple-system,sans-serif;
//   font-family:var(--font-body);font-size:1.0625rem;line-height:1.6;color:var(--ink);background:var(--bg);
//   -webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;
// }
// .ilmora-landing *{box-sizing:border-box}
// .ilmora-landing img,.ilmora-landing svg{display:block;max-width:100%}
// .ilmora-landing a{color:inherit;text-decoration:none}
// .ilmora-landing button{font:inherit;color:inherit}
// .ilmora-landing h1,.ilmora-landing h2,.ilmora-landing h3,.ilmora-landing h4{font-family:var(--font-display);font-weight:700;line-height:1.08;letter-spacing:-.025em;margin:0}
// .ilmora-landing p{margin:0}
// .ilmora-landing :focus-visible{outline:3px solid var(--blue);outline-offset:3px;border-radius:8px}
// .ilmora-landing .wrap{width:min(1180px,100% - 48px);margin-inline:auto}

// /* buttons */
// .ilmora-landing .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:999px;font-weight:600;font-size:1rem;border:1.5px solid transparent;cursor:pointer;transition:transform var(--d-fast) var(--ease),box-shadow var(--d-fast) var(--ease),background var(--d-fast) var(--ease),border-color var(--d-fast) var(--ease)}
// .ilmora-landing .btn:hover{transform:translateY(-2px)}
// .ilmora-landing .btn-primary{background:var(--blue);color:#fff;box-shadow:0 10px 24px -10px rgba(232,119,34,.6)}
// .ilmora-landing .btn-primary:hover{background:var(--blue-d);box-shadow:0 14px 28px -10px rgba(232,119,34,.7)}
// .ilmora-landing .btn-line{background:rgba(255,255,255,.6);border-color:rgba(14,26,58,.18);color:var(--ink);backdrop-filter:blur(6px)}
// .ilmora-landing .btn-line:hover{border-color:var(--ink);background:#fff}
// .ilmora-landing .btn-ghost{color:var(--ink)}
// .ilmora-landing .btn-ghost:hover{background:rgba(14,26,58,.06)}
// .ilmora-landing .btn-white{background:#fff;color:var(--ink)}
// .ilmora-landing .btn-white:hover{box-shadow:0 14px 28px -12px rgba(0,0,0,.5)}
// .ilmora-landing .btn-outline-w{border-color:rgba(255,255,255,.4);color:#fff}
// .ilmora-landing .btn-outline-w:hover{border-color:#fff;background:rgba(255,255,255,.08)}

// /* nav */
// .ilmora-landing .nav{position:sticky;top:0;z-index:50;transition:background var(--d-base) var(--ease),box-shadow var(--d-base) var(--ease),backdrop-filter var(--d-base) var(--ease)}
// .ilmora-landing .nav.scrolled{background:rgba(245,248,254,.78);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);box-shadow:0 1px 0 var(--line)}
// .ilmora-landing .nav-in{display:flex;align-items:center;justify-content:space-between;height:72px}
// .ilmora-landing .logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:800;font-size:1.3rem;letter-spacing:-.02em}
// .ilmora-landing .logo-mark{width:30px;height:30px;border-radius:9px;background:conic-gradient(from 210deg,var(--blue),var(--lav),var(--mint),var(--blue));position:relative}
// .ilmora-landing .logo-mark::after{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--bg)}
// .ilmora-landing .nav-links{display:flex;gap:6px}
// .ilmora-landing .nav-links a{padding:8px 16px;border-radius:999px;font-weight:500;color:var(--ink-2);transition:color var(--d-fast),background var(--d-fast)}
// .ilmora-landing .nav-links a:hover{color:var(--ink);background:rgba(14,26,58,.06)}
// .ilmora-landing .nav-cta{display:flex;gap:8px;align-items:center}

// /* hero — flat, no blur/grain */
// .ilmora-landing .hero{background:var(--bg);padding:80px 0 90px}
// .ilmora-landing .hero-in{display:grid;grid-template-columns:1.02fr 1fr;gap:56px;align-items:center}
// .ilmora-landing .hero h1{font-size:clamp(2.3rem,5.3vw,4.1rem);margin-bottom:22px;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .1s forwards}
// .ilmora-landing .lead{font-size:clamp(1.02rem,1.5vw,1.2rem);color:var(--ink-2);max-width:34em;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .22s forwards}
// .ilmora-landing .hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .34s forwards}
// .ilmora-landing .fine{margin-top:18px;font-size:.95rem;color:var(--ink-2);opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .46s forwards}
// @keyframes im-rise{to{opacity:1;transform:none}}
// .ilmora-landing .hero-stage{opacity:0;transform:translateY(30px) scale(.985);animation:im-rise var(--d-slow) var(--ease) .35s forwards;position:relative;padding:18px 0 34px 18px}

// .ilmora-landing .live{background:#fff;border-radius:var(--r-xl);box-shadow:var(--shadow-card);padding:14px;max-width:560px;margin-left:auto}
// .ilmora-landing .live-bar{display:flex;align-items:center;gap:10px;padding:4px 6px 12px}
// .ilmora-landing .live-tag{display:inline-flex;align-items:center;gap:6px;background:#FFE7E4;color:#C22B1D;font-weight:600;font-size:.8rem;padding:3px 10px;border-radius:999px}
// .ilmora-landing .live-tag i{width:7px;height:7px;border-radius:50%;background:#E5402F;animation:im-pulse 1.6s ease-in-out infinite}
// @keyframes im-pulse{50%{transform:scale(1.7);opacity:.4}}
// .ilmora-landing .live-title{font-weight:600;font-size:.95rem;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
// .ilmora-landing .live-time{font-variant-numeric:tabular-nums;font-size:.85rem;color:var(--ink-2)}
// .ilmora-landing .live-video{position:relative;height:230px;border-radius:var(--r-lg);background:linear-gradient(135deg,#1A2A5E,#3653C7 70%,#5C7BFF);display:grid;place-items:center;overflow:hidden}
// .ilmora-landing .live-video::before{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 65%);top:-80px;right:-60px}
// .ilmora-landing .mentor{display:flex;align-items:center;gap:18px}
// .ilmora-landing .avatar{display:inline-grid;place-items:center;flex:none;width:64px;height:64px;border-radius:50%;font-weight:600;font-size:1.1rem;color:var(--ink);letter-spacing:.01em}
// .ilmora-landing .avatar.sm{width:38px;height:38px;font-size:.8rem}
// .ilmora-landing .avatar.xs{width:28px;height:28px;font-size:.68rem}
// .ilmora-landing .avatar.lg{width:88px;height:88px;font-size:1.5rem}
// .ilmora-landing .av-a{background:linear-gradient(135deg,#FFE8A3,#FFC7B8)}
// .ilmora-landing .av-b{background:linear-gradient(135deg,#9BE7D6,#CFE0FF)}
// .ilmora-landing .av-c{background:linear-gradient(135deg,#C3B3FF,#CFE0FF)}
// .ilmora-landing .av-d{background:linear-gradient(135deg,#FFC7B8,#C3B3FF)}
// .ilmora-landing .eq{display:flex;align-items:center;gap:4px;height:34px}
// .ilmora-landing .eq i{width:5px;height:100%;background:#fff;border-radius:3px;transform-origin:center;animation:im-eq 1s ease-in-out infinite}
// .ilmora-landing .eq i:nth-child(1){animation-duration:.9s}
// .ilmora-landing .eq i:nth-child(2){animation-duration:.7s;animation-delay:.1s}
// .ilmora-landing .eq i:nth-child(3){animation-duration:1.1s;animation-delay:.2s}
// .ilmora-landing .eq i:nth-child(4){animation-duration:.8s;animation-delay:.05s}
// .ilmora-landing .eq i:nth-child(5){animation-duration:1s;animation-delay:.3s}
// @keyframes im-eq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
// .ilmora-landing .thumbs{position:absolute;right:12px;bottom:12px;display:flex;gap:6px}
// .ilmora-landing .thumbs .avatar{border:2px solid rgba(255,255,255,.9)}
// .ilmora-landing .caption{position:absolute;left:12px;bottom:12px;max-width:62%;background:rgba(9,18,45,.62);backdrop-filter:blur(6px);color:#fff;font-size:.82rem;line-height:1.35;padding:7px 11px;border-radius:10px}
// .ilmora-landing .chat{display:flex;flex-direction:column;justify-content:flex-end;gap:8px;height:138px;overflow:hidden;padding:12px 6px 4px}
// .ilmora-landing .msg{display:flex;align-items:flex-end;gap:8px;animation:im-msgin .5s var(--ease) both}
// @keyframes im-msgin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
// .ilmora-landing .bubble{background:#EEF3FF;border-radius:14px 14px 14px 4px;padding:7px 12px;font-size:.88rem;line-height:1.35;max-width:82%}
// .ilmora-landing .msg:nth-child(even) .bubble{background:#E6F8F3}
// .ilmora-landing .live-foot{display:flex;justify-content:space-between;align-items:center;padding:10px 6px 2px;border-top:1px solid var(--line);font-size:.85rem;color:var(--ink-2)}
// .ilmora-landing .hand{background:var(--butter);color:#6B4E00;font-weight:600;padding:3px 10px;border-radius:999px;font-size:.78rem}
// .ilmora-landing .chip{position:absolute;display:flex;align-items:center;gap:10px;background:#fff;border-radius:16px;padding:10px 14px 10px 10px;box-shadow:var(--shadow-soft);font-size:.86rem;line-height:1.3;opacity:0;animation:im-chipin .8s var(--ease) forwards}
// .ilmora-landing .chip b{display:block;font-weight:600}
// .ilmora-landing .chip small{color:var(--ink-2);font-size:.78rem}
// .ilmora-landing .chip .ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none}
// .ilmora-landing .chip-a{left:-6px;top:170px;animation-delay:1.2s}
// .ilmora-landing .chip-b{right:-10px;bottom:0;animation-delay:1.8s}
// .ilmora-landing .chip-a .ico{background:#DDF7EF;color:#0E7A5F}
// .ilmora-landing .chip-b .ico{background:#E6DEFF;color:#5A3FD1}
// @keyframes im-chipin{from{opacity:0;transform:translateY(16px) scale(.94)}to{opacity:1;transform:none}}

// /* booking showcase — Calendly-style gradient card with floating icons */
// .ilmora-landing .booking{padding:20px 0 100px}
// .ilmora-landing .sec-head.center{text-align:center;margin-inline:auto}
// .ilmora-landing .booking-card{position:relative;border-radius:36px;padding:56px 40px 40px;background:linear-gradient(150deg,#FFD9B0 0%,var(--blue) 55%,#C9531B 100%);box-shadow:0 40px 80px -30px rgba(208,106,26,.45);overflow:visible}
// .ilmora-landing .booking-floaters{position:absolute;left:50%;top:0;transform:translate(-50%,-50%);display:flex;gap:14px;z-index:2}
// .ilmora-landing .float-ico{position:relative;width:56px;height:56px;border-radius:50%;background:#fff;border:0;display:grid;place-items:center;color:var(--ink-2);box-shadow:var(--shadow-soft);animation:im-float 3.2s ease-in-out infinite;cursor:pointer;transition:background var(--d-fast) var(--ease),color var(--d-fast) var(--ease),width var(--d-fast) var(--ease),height var(--d-fast) var(--ease)}
// .ilmora-landing .float-ico:hover{color:var(--ink)}
// .ilmora-landing .float-ico.no-float{animation:none}
// .ilmora-landing .float-ico.is-active{width:64px;height:64px;background:var(--ink);color:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.55),var(--shadow-soft)}
// .ilmora-landing .float-label{position:absolute;left:50%;top:calc(100% + 10px);transform:translateX(-50%) translateY(4px);white-space:nowrap;background:var(--ink);color:#fff;font-size:.76rem;font-weight:600;padding:5px 10px;border-radius:8px;opacity:0;pointer-events:none;transition:opacity var(--d-fast) var(--ease),transform var(--d-fast) var(--ease)}
// .ilmora-landing .float-ico:hover .float-label,.ilmora-landing .float-ico.is-active .float-label{opacity:1;transform:translateX(-50%) translateY(0)}
// @keyframes im-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
// .ilmora-landing .booking-panels{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
// .ilmora-landing .booking-info{background:rgba(255,255,255,.14);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.35);border-radius:var(--r-lg);padding:32px;color:#fff;display:flex;flex-direction:column;justify-content:center}
// .ilmora-landing .booking-info .badge{display:inline-flex;align-self:flex-start;background:rgba(255,255,255,.22);font-size:.78rem;font-weight:600;padding:5px 12px;border-radius:999px;margin-bottom:16px}
// .ilmora-landing .booking-info h3{font-size:1.6rem;margin-bottom:12px;color:#fff}
// .ilmora-landing .booking-info p{color:rgba(255,255,255,.85);margin-bottom:18px;max-width:28em}
// .ilmora-landing .link-underline{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:#fff;border-bottom:2px solid rgba(255,255,255,.6);width:fit-content;padding-bottom:2px;transition:border-color var(--d-fast)}
// .ilmora-landing .link-underline:hover{border-color:#fff}
// .ilmora-landing .booking-calendar{background:#fff;border-radius:var(--r-lg);padding:22px;box-shadow:var(--shadow-card)}
// .ilmora-landing .bc-head{display:flex;justify-content:space-between;align-items:center;font-weight:600;margin-bottom:14px}
// .ilmora-landing .bc-nav{display:flex;gap:6px}
// .ilmora-landing .bc-nav i{width:26px;height:26px;border-radius:50%;background:var(--bg);display:grid;place-items:center;color:var(--ink-2)}
// .ilmora-landing .bc-week{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:.72rem;color:var(--ink-2);margin-bottom:6px}
// .ilmora-landing .bc-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px}
// .ilmora-landing .bc-days span{aspect-ratio:1;display:grid;place-items:center;border-radius:8px;font-size:.82rem;color:var(--ink);transition:background var(--d-fast) var(--ease),color var(--d-fast) var(--ease)}
// .ilmora-landing .bc-days span.is-today{border:1.5px solid var(--blue);font-weight:600}
// .ilmora-landing .bc-days span.is-picked{background:var(--blue);color:#fff;font-weight:600}
// .ilmora-landing .bc-slots{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
// .ilmora-landing .bc-slot{border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;font-size:.86rem;font-weight:500;transition:border-color var(--d-fast) var(--ease),background var(--d-fast) var(--ease),color var(--d-fast) var(--ease)}
// .ilmora-landing .bc-slot.is-picked{border-color:var(--blue);background:#FFF1E6;color:var(--blue-d)}
// .ilmora-landing .bc-confirm{background:var(--ink);color:#fff;text-align:center;font-weight:600;padding:12px;border-radius:12px;transition:transform var(--d-fast) var(--ease),background var(--d-fast) var(--ease)}
// .ilmora-landing .bc-confirm.is-confirming{background:#0E7A5F;transform:scale(.97)}
// .ilmora-landing .booking-info{animation:im-chipin .5s var(--ease) both}
// .ilmora-landing .booking-visual{position:relative;animation:im-chipin .5s var(--ease) both}
// .ilmora-landing .feature-card{background:#fff;border-radius:var(--r-lg);padding:26px;box-shadow:var(--shadow-card);height:100%;display:flex;flex-direction:column;justify-content:center;gap:12px}
// .ilmora-landing .mini-badge{display:inline-flex;align-self:flex-start;background:#EEF3FF;color:var(--blue-d);font-size:.76rem;font-weight:600;padding:4px 10px;border-radius:999px;margin-bottom:4px}
// .ilmora-landing .match-row{display:flex;align-items:center;gap:12px;border:1.5px solid var(--line);border-radius:12px;padding:12px 14px}
// .ilmora-landing .match-row b{display:block;font-weight:600;font-size:.95rem;line-height:1.3}
// .ilmora-landing .match-row small{color:var(--ink-2);font-size:.8rem}
// .ilmora-landing .cert-mini{text-align:center;align-items:center}
// .ilmora-landing .cert-mini small{color:var(--ink-2)}
// .ilmora-landing .cert-mini h4{font-family:var(--font-display);font-size:1.3rem;letter-spacing:-.02em;margin:2px 0}
// .ilmora-landing .cert-mini .who{font-weight:600;font-size:1.05rem}
// .ilmora-landing .chat-mini .msg{align-items:flex-end}
// .ilmora-landing .fake-cursor{position:absolute;left:0;top:0;pointer-events:none;opacity:0;transition:transform .65s cubic-bezier(.22,1,.36,1),opacity .3s ease;z-index:5;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35))}
// .ilmora-landing .fake-cursor.is-visible{opacity:1}
// .ilmora-landing .fake-cursor.is-clicking svg{animation:im-click .5s ease}
// @keyframes im-click{0%{transform:scale(1)}35%{transform:scale(.72)}100%{transform:scale(1)}}

// /* sections */
// .ilmora-landing .section{padding:100px 0}
// .ilmora-landing .sec-head{max-width:760px;margin-bottom:56px}
// .ilmora-landing .sec-head h2{font-size:clamp(1.9rem,3.9vw,2.9rem);margin-bottom:16px}
// .ilmora-landing .sec-head p{color:var(--ink-2);font-size:1.1rem;max-width:36em}
// .ilmora-landing .reveal{opacity:0;transform:translateY(24px);transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease)}
// .ilmora-landing .reveal.in{opacity:1;transform:none}

// /* journey tabs */
// .ilmora-landing .tabs{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start}
// .ilmora-landing .acc-list{display:flex;flex-direction:column;gap:6px}
// .ilmora-landing .acc{position:relative;border-radius:var(--r-lg);padding:0 24px;transition:background var(--d-base) var(--ease),box-shadow var(--d-base) var(--ease)}
// .ilmora-landing .acc.is-active{background:#fff;box-shadow:var(--shadow-soft)}
// .ilmora-landing .acc-btn{display:block;width:100%;text-align:left;background:none;border:0;padding:22px 0;cursor:pointer;font-family:var(--font-display);font-weight:700;font-size:1.35rem;letter-spacing:-.02em;color:var(--ink-2);transition:color var(--d-fast)}
// .ilmora-landing .acc:hover .acc-btn,.ilmora-landing .acc.is-active .acc-btn{color:var(--ink)}
// .ilmora-landing .acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--d-base) var(--ease)}
// .ilmora-landing .acc.is-active .acc-panel{grid-template-rows:1fr}
// .ilmora-landing .acc-inner{overflow:hidden}
// .ilmora-landing .acc-desc{color:var(--ink-2);margin-bottom:14px;max-width:30em}
// .ilmora-landing .steps{display:flex;flex-direction:column;gap:10px;padding-bottom:26px}
// .ilmora-landing .step{display:flex;gap:12px;align-items:flex-start;font-weight:500}
// .ilmora-landing .step svg{flex:none;margin-top:3px;color:var(--blue)}
// .ilmora-landing .bar{position:absolute;left:24px;right:24px;bottom:0;height:3px;border-radius:3px;background:var(--line);overflow:hidden;opacity:0;transition:opacity var(--d-base)}
// .ilmora-landing .acc.is-active .bar{opacity:1}
// .ilmora-landing .bar i{display:block;height:100%;background:var(--blue);transform-origin:left}
// .ilmora-landing .bar i.bar-play{animation:im-fill 6.5s linear forwards}
// .ilmora-landing .bar i.bar-full{transform:scaleX(1)}
// @keyframes im-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}

// .ilmora-landing .stage{position:relative;aspect-ratio:1/1.02;border-radius:var(--r-xl);overflow:hidden;background:var(--sky);box-shadow:var(--shadow-soft)}
// .ilmora-landing .scene{position:absolute;inset:0;display:grid;place-items:center;padding:8%;opacity:0;transform:scale(.97);transition:opacity var(--d-base) var(--ease),transform var(--d-slow) var(--ease);pointer-events:none}
// .ilmora-landing .scene.is-active{opacity:1;transform:none}
// .ilmora-landing .sc1{background:radial-gradient(80% 70% at 15% 10%,#9EC5FF,transparent 60%),radial-gradient(70% 60% at 95% 90%,#C3B3FF,transparent 60%),#DCEAFF}
// .ilmora-landing .sc2{background:radial-gradient(80% 70% at 90% 10%,#9BE7D6,transparent 60%),radial-gradient(70% 60% at 5% 95%,#9EC5FF,transparent 60%),#DDF6F2}
// .ilmora-landing .sc3{background:radial-gradient(80% 70% at 10% 90%,#FFC7B8,transparent 60%),radial-gradient(70% 60% at 95% 5%,#FFE8A3,transparent 60%),#FFF0E6}
// .ilmora-landing .sc4{background:radial-gradient(80% 70% at 85% 90%,#C3B3FF,transparent 60%),radial-gradient(70% 60% at 5% 10%,#9BE7D6,transparent 60%),#EDE9FF}
// .ilmora-landing .m-card{width:100%;max-width:400px;background:#fff;border-radius:20px;padding:18px;box-shadow:var(--shadow-card);position:relative}
// .ilmora-landing .m-in{display:flex;align-items:center;gap:10px;background:#F1F5FD;border-radius:12px;padding:10px 14px;color:var(--ink-2);font-size:.92rem;margin-bottom:12px}
// .ilmora-landing .m-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);margin-bottom:8px;font-size:.92rem}
// .ilmora-landing .m-row.sel{border-color:var(--blue);background:#EEF3FF}
// .ilmora-landing .m-row b{display:block;font-weight:600;line-height:1.25}
// .ilmora-landing .m-row small{color:var(--ink-2);font-size:.8rem}
// .ilmora-landing .tag{font-size:.74rem;font-weight:600;padding:3px 10px;border-radius:999px;background:#E3ECFF;color:var(--blue-d);flex:none}
// .ilmora-landing .tag.t2{background:#EADFFF;color:#5A3FD1}
// .ilmora-landing .m-btn{position:relative;display:block;width:100%;margin-top:6px;padding:12px;border-radius:12px;background:var(--blue);color:#fff;text-align:center;font-weight:600}
// .ilmora-landing .m-grid{display:grid;grid-template-columns:1.5fr 1fr;grid-template-rows:1fr 1fr;gap:8px;height:190px}
// .ilmora-landing .tile{border-radius:12px;display:grid;place-items:center;font-weight:600;position:relative;overflow:hidden}
// .ilmora-landing .tile.big{grid-row:span 2;background:linear-gradient(135deg,#1A2A5E,#3653C7)}
// .ilmora-landing .tile.big .eq i{background:#fff}
// .ilmora-landing .tile small{position:absolute;left:8px;bottom:6px;color:#fff;font-size:.72rem;font-weight:500}
// .ilmora-landing .m-meta{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:.85rem;color:var(--ink-2)}
// .ilmora-landing .m-cc{margin-top:10px;background:#F1F5FD;border-radius:10px;padding:8px 12px;font-size:.85rem}
// .ilmora-landing .m-title{font-weight:600;margin-bottom:12px;line-height:1.3}
// .ilmora-landing .m-prog{height:8px;border-radius:8px;background:#EEF1F8;overflow:hidden;margin-bottom:6px}
// .ilmora-landing .m-prog i{display:block;height:100%;width:78%;background:linear-gradient(90deg,var(--blue),#FFB37A);border-radius:8px}
// .ilmora-landing .m-sub{display:flex;justify-content:space-between;font-size:.8rem;color:var(--ink-2)}
// .ilmora-landing .fb{margin-top:16px;display:flex;gap:10px}
// .ilmora-landing .fb .bubble{background:#FFF3E9;max-width:none;font-size:.88rem}
// .ilmora-landing .score{position:absolute;right:16px;top:-16px;background:var(--ink);color:#fff;border-radius:14px;padding:8px 14px;font-weight:600}
// .ilmora-landing .score small{font-weight:400;opacity:.75}
// .ilmora-landing .cert{text-align:center;padding:26px 20px 22px}
// .ilmora-landing .cert small{color:var(--ink-2)}
// .ilmora-landing .cert h4{font-family:var(--font-display);font-size:1.35rem;letter-spacing:-.02em;margin:6px 0 2px}
// .ilmora-landing .cert .who{font-weight:600;margin:10px 0 2px;font-size:1.05rem}
// .ilmora-landing .seal{width:64px;height:64px;margin:16px auto 6px;border-radius:50%;background:conic-gradient(from 20deg,var(--blue),var(--lav),var(--mint),var(--blue));display:grid;place-items:center;color:#fff;font-size:.62rem;font-weight:700;letter-spacing:.04em}
// .ilmora-landing .verified{position:relative;display:inline-flex;gap:8px;align-items:center;background:#fff;border-radius:14px;padding:9px 14px;box-shadow:var(--shadow-soft);font-size:.84rem;font-weight:600;color:#0E7A5F;margin-top:14px}

// /* tracks */
// .ilmora-landing .tracks{background:#fff;border-block:1px solid var(--line)}
// .ilmora-landing .tracks-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:64px;align-items:start}
// .ilmora-landing .tracks-side .sticky{position:sticky;top:90px}
// .ilmora-landing .tracks-side h2{font-size:clamp(1.9rem,3.6vw,2.7rem);margin-bottom:16px}
// .ilmora-landing .tracks-side p{color:var(--ink-2);margin-bottom:28px;max-width:26em}
// .ilmora-landing .track-nav{list-style:none;display:flex;flex-direction:column;gap:2px;margin:0;padding:0}
// .ilmora-landing .track-nav a{display:flex;align-items:center;gap:14px;padding:10px 0;font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:#8A94AD;transition:color var(--d-fast),transform var(--d-base) var(--ease)}
// .ilmora-landing .track-nav a::before{content:"";width:0;height:3px;border-radius:3px;background:var(--blue);transition:width var(--d-base) var(--ease)}
// .ilmora-landing .track-nav a.is-active{color:var(--ink);transform:translateX(4px)}
// .ilmora-landing .track-nav a.is-active::before{width:28px}
// .ilmora-landing .tracks-list{display:flex;flex-direction:column;gap:28px}
// .ilmora-landing .track{scroll-margin-top:100px;border-radius:var(--r-xl);padding:36px;position:relative;overflow:hidden}
// .ilmora-landing .tr-product{background:linear-gradient(140deg,#E3EDFF,#EEE8FF)}
// .ilmora-landing .tr-design{background:linear-gradient(140deg,#E8E2FF,#FFE9E3)}
// .ilmora-landing .tr-growth{background:linear-gradient(140deg,#DDF6F0,#E3EDFF)}
// .ilmora-landing .tr-marketing{background:linear-gradient(140deg,#FFF1D6,#FFE1D8)}
// .ilmora-landing .track h3{font-size:1.8rem;margin-bottom:8px}
// .ilmora-landing .track>p{color:var(--ink-2);max-width:32em;margin-bottom:26px}
// .ilmora-landing .timeline{position:relative;list-style:none;padding-left:34px;margin:0;display:flex;flex-direction:column;gap:18px}
// .ilmora-landing .timeline::before{content:"";position:absolute;left:8px;top:8px;bottom:8px;width:2px;background:rgba(14,26,58,.16);transform:scaleY(0);transform-origin:top;transition:transform 1.2s var(--ease) .2s}
// .ilmora-landing .track.in .timeline::before{transform:scaleY(1)}
// .ilmora-landing .timeline li{position:relative;opacity:0;transform:translateX(-10px);transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease)}
// .ilmora-landing .timeline li::before{content:"";position:absolute;left:-34px;top:6px;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--blue)}
// .ilmora-landing .timeline small{display:block;color:var(--ink-2);font-size:.82rem}
// .ilmora-landing .timeline b{font-weight:600}
// .ilmora-landing .track.in .timeline li{opacity:1;transform:none}
// .ilmora-landing .track.in .timeline li:nth-child(1){transition-delay:.25s}
// .ilmora-landing .track.in .timeline li:nth-child(2){transition-delay:.45s}
// .ilmora-landing .track.in .timeline li:nth-child(3){transition-delay:.65s}
// .ilmora-landing .track.in .timeline li:nth-child(4){transition-delay:.85s}
// .ilmora-landing .outputs{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
// .ilmora-landing .outputs span{background:rgba(255,255,255,.75);border-radius:999px;padding:5px 14px;font-size:.88rem;font-weight:500}

// /* learner stories */
// .ilmora-landing .stories{display:flex;gap:14px;height:470px}
// .ilmora-landing .story{position:relative;flex:1;min-width:0;border:0;border-radius:var(--r-xl);overflow:hidden;cursor:pointer;text-align:left;padding:28px;display:block;transition:flex var(--d-slow) var(--ease),transform var(--d-base) var(--ease);color:var(--ink)}
// .ilmora-landing .story.is-active{flex:3.3;cursor:default}
// .ilmora-landing .s1{background:radial-gradient(90% 70% at 100% 0%,#C3B3FF,transparent 60%),#DCE7FF}
// .ilmora-landing .s2{background:radial-gradient(90% 70% at 100% 0%,#9BE7D6,transparent 60%),#DFF3FF}
// .ilmora-landing .s3{background:radial-gradient(90% 70% at 100% 0%,#FFE8A3,transparent 60%),#FFE4DA}
// .ilmora-landing .s4{background:radial-gradient(90% 70% at 100% 0%,#FFC7B8,transparent 60%),#EDE6FF}
// .ilmora-landing .story .avatar{position:absolute;right:24px;top:24px}
// .ilmora-landing .s-metric{display:block;font-family:var(--font-display);font-weight:700;font-size:1.5rem;line-height:1.12;letter-spacing:-.02em;max-width:8.5em;transition:font-size var(--d-slow) var(--ease)}
// .ilmora-landing .story.is-active .s-metric{font-size:2.4rem}
// .ilmora-landing .s-detail{position:absolute;left:28px;bottom:28px;width:min(430px,calc(100% - 56px));opacity:0;transform:translateY(14px);visibility:hidden;transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease),visibility 0s var(--d-base)}
// .ilmora-landing .story.is-active .s-detail{opacity:1;transform:none;visibility:visible;transition-delay:.25s,.25s,0s}
// .ilmora-landing .s-quote{display:block;font-size:1.1rem;line-height:1.45;margin-bottom:14px}
// .ilmora-landing .s-who{display:block;font-size:.92rem;color:var(--ink-2)}
// .ilmora-landing .s-who b{color:var(--ink);font-weight:600}

// /* marquee */
// .ilmora-landing .marquee-sec{padding:20px 0 100px;overflow:hidden}
// .ilmora-landing .marquee{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
// .ilmora-landing .m-track{display:flex;width:max-content;animation:im-marq 42s linear infinite}
// .ilmora-landing .m-track.no-anim{animation:none;overflow-x:auto}
// .ilmora-landing .marquee:hover .m-track{animation-play-state:paused}
// @keyframes im-marq{to{transform:translateX(-50%)}}
// .ilmora-landing .m-item{display:flex;align-items:center;gap:14px;margin-right:16px;padding:14px 22px 14px 14px;border-radius:18px;background:#fff;box-shadow:var(--shadow-soft);white-space:nowrap}
// .ilmora-landing .m-item .ico{width:42px;height:42px;border-radius:12px;display:grid;place-items:center}
// .ilmora-landing .m-item b{display:block;font-weight:600;line-height:1.25}
// .ilmora-landing .m-item small{color:var(--ink-2);font-size:.84rem}
// .ilmora-landing .i-blue{background:#E3ECFF;color:var(--blue-d)}
// .ilmora-landing .i-mint{background:#DDF7EF;color:#0E7A5F}
// .ilmora-landing .i-lav{background:#E6DEFF;color:#5A3FD1}
// .ilmora-landing .i-peach{background:#FFE6DC;color:#B4471F}
// .ilmora-landing .i-butter{background:#FFF1C7;color:#7A5A00}

// /* integrations (replaces the old dark final-cta block) */
// .ilmora-landing .integrations{background:#fff;border-top:1px solid var(--line)}
// .ilmora-landing .int-head{text-align:center;max-width:640px;margin:0 auto 48px}
// .ilmora-landing .int-eyebrow{display:inline-block;font-size:.8rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--blue-d);margin-bottom:14px}
// .ilmora-landing .int-head h2{font-size:clamp(1.8rem,3.6vw,2.5rem);margin-bottom:14px}
// .ilmora-landing .int-head p{color:var(--ink-2);font-size:1.05rem}
// .ilmora-landing .int-viewall{display:inline-flex;align-items:center;gap:6px;margin-top:20px;font-weight:600;color:var(--ink);border-bottom:2px solid transparent;transition:border-color var(--d-fast)}
// .ilmora-landing .int-viewall:hover{border-color:var(--ink)}
// .ilmora-landing .int-viewall svg{transition:transform var(--d-fast) var(--ease)}
// .ilmora-landing .int-viewall:hover svg{transform:translateX(3px)}
// .ilmora-landing .int-grid{display:flex;flex-direction:column;gap:16px;max-width:920px;margin:0 auto 56px}
// .ilmora-landing .int-row{display:flex;justify-content:center;flex-wrap:wrap;gap:16px}
// .ilmora-landing .int-tile{width:72px;height:72px;border-radius:18px;background:var(--bg);border:1px solid var(--line);display:grid;place-items:center;transition:transform var(--d-fast) var(--ease),box-shadow var(--d-fast) var(--ease),border-color var(--d-fast)}
// .ilmora-landing .int-tile:hover{transform:translateY(-4px);box-shadow:var(--shadow-soft);border-color:transparent}
// .ilmora-landing .int-tile img{width:34px;height:34px;object-fit:contain}
// .ilmora-landing .int-suites{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:920px;margin:0 auto}
// .ilmora-landing .int-suite{display:flex;gap:16px;align-items:flex-start;background:var(--bg);border-radius:var(--r-lg);padding:22px;border:1px solid var(--line)}
// .ilmora-landing .int-suite-ico{flex:none;width:36px;height:36px;border-radius:10px;background:#fff;display:grid;place-items:center;box-shadow:var(--shadow-soft)}
// .ilmora-landing .int-suite-ico img{width:22px;height:22px;object-fit:contain}
// .ilmora-landing .int-suite b{display:block;font-family:var(--font-display);font-weight:700;margin-bottom:6px}
// .ilmora-landing .int-suite p{color:var(--ink-2);font-size:.92rem;line-height:1.5}

// /* footer */
// .ilmora-landing .foot{border-top:1px solid var(--line);padding:56px 0 40px;font-size:.95rem;color:var(--ink-2)}
// .ilmora-landing .foot-in{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:32px}
// .ilmora-landing .foot h4{font-family:var(--font-display);color:var(--ink);font-size:1rem;margin-bottom:12px}
// .ilmora-landing .foot ul{list-style:none;display:flex;flex-direction:column;gap:8px;margin:0;padding:0}
// .ilmora-landing .foot a:hover{color:var(--blue)}
// .ilmora-landing .foot-base{margin-top:40px;padding-top:24px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:.88rem}

// /* ===================== RESPONSIVE ===================== */
// /* Laptops */
// @media (max-width:1200px){
//   .ilmora-landing .wrap{width:min(1040px,100% - 36px)}
// }
// /* iPad Pro / small laptops */
// @media (max-width:1024px){
//   .ilmora-landing .tracks-in{grid-template-columns:1fr;gap:40px}
//   .ilmora-landing .tracks-side .sticky{position:static}
// }
// /* Tablets (iPad / iPad mini) */
// @media (max-width:960px){
//   .ilmora-landing .hero{padding:64px 0 70px;min-height:0}
//   .ilmora-landing .hero-in,.ilmora-landing .tabs{grid-template-columns:1fr;gap:40px}
//   .ilmora-landing .hero-stage{padding:0 0 30px}
//   .ilmora-landing .live{margin:0 auto}
//   .ilmora-landing .chip-a{left:0}
//   .ilmora-landing .chip-b{right:0}
//   .ilmora-landing .nav-links{display:none}
//   .ilmora-landing .section{padding:64px 0}
//   .ilmora-landing .stage{aspect-ratio:1/.95}
//   .ilmora-landing .foot-in{grid-template-columns:1fr 1fr}
//   .ilmora-landing .blob{filter:blur(50px)}
//   .ilmora-landing .int-suites{grid-template-columns:1fr}
//   .ilmora-landing .booking-panels{grid-template-columns:1fr}
// }
// /* Large phones / small tablets */
// @media (max-width:820px){
//   .ilmora-landing .stories{flex-direction:column;height:auto}
//   .ilmora-landing .story{flex:none;min-height:130px;padding:22px}
//   .ilmora-landing .story.is-active{flex:none}
//   .ilmora-landing .s-detail{position:static;width:auto;max-height:0;overflow:hidden;transform:none;margin-top:0}
//   .ilmora-landing .story.is-active .s-detail{max-height:280px;margin-top:18px}
//   .ilmora-landing .story.is-active .s-metric{font-size:1.85rem}
//   .ilmora-landing .story .avatar{width:52px;height:52px;font-size:1rem}
// }
// /* Phones */
// @media (max-width:560px){
//   .ilmora-landing .wrap{width:calc(100% - 28px)}
//   .ilmora-landing .btn-ghost{display:none}
//   .ilmora-landing .track{padding:26px 22px}
//   .ilmora-landing .foot-in{grid-template-columns:1fr}
//   .ilmora-landing .chip-a{top:150px}
//   .ilmora-landing .live-video{height:190px}
//   .ilmora-landing .nav-cta .btn{padding:10px 16px;font-size:.9rem}
//   .ilmora-landing .int-tile{width:60px;height:60px;border-radius:14px}
//   .ilmora-landing .int-tile img{width:28px;height:28px}
//   .ilmora-landing .booking-card{padding:44px 20px 28px;border-radius:26px}
//   .ilmora-landing .float-ico{width:44px;height:44px}
//   .ilmora-landing .float-ico.is-active{width:50px;height:50px}
//   .ilmora-landing .booking-floaters{gap:8px}
// }
// /* Small phones (iPhone SE, older Android) */
// @media (max-width:380px){
//   .ilmora-landing .hero h1{font-size:1.9rem}
//   .ilmora-landing .live{padding:10px}
//   .ilmora-landing .chip{font-size:.78rem;padding:8px 10px 8px 8px}
// }

// @media (prefers-reduced-motion:reduce){
//   .ilmora-landing *,.ilmora-landing *::before,.ilmora-landing *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;animation-delay:0s!important;transition-duration:.001ms!important;transition-delay:0s!important}
//   .ilmora-landing .hero h1,.ilmora-landing .lead,.ilmora-landing .hero-actions,.ilmora-landing .fine,.ilmora-landing .hero-stage,.ilmora-landing .chip{opacity:1;transform:none}
//   .ilmora-landing .m-track{overflow-x:auto}
//   .ilmora-landing .float-ico{animation:none!important}
// }
// `;
















import React, { useState, useEffect, useRef, useCallback } from "react";

// Same shared shell used by every other public page (Careers, ManagerHub,
// About, Pricing, Contact, FAQ, etc). Lives at src/pages/Landing/components/PublicLayout.
// If this file lives somewhere other than alongside those pages, adjust this path.
import PublicLayout from "../Landing/components/PublicLayout";

// Integration logos (from Icon_ilmora_calendry.zip). Copy the "integrations"
// folder into your assets directory and adjust these import paths to match.
// Path matches: src/pages/Landing/ilmorameet.jsx -> ../../assets/integration-icons-webp/
// If you move the folder later (e.g. to src/assets/icons/integrations), update these paths to match.
import zoomIcon from "../../assets/integration-icons-webp/zoom-logo-icon-1.webp";
import googleCalendarIcon from "../../assets/integration-icons-webp/google-calendar-icon.webp";
import gmailIcon from "../../assets/integration-icons-webp/google-gmail-icon.webp";
import hubspotIcon from "../../assets/integration-icons-webp/hubspot.webp";
import slackIcon from "../../assets/integration-icons-webp/slack-logo-icon.webp";
import teamsIcon from "../../assets/integration-icons-webp/microsoft-teams-logo-icon.webp";
import chromeIcon from "../../assets/integration-icons-webp/chrome-logo.webp";
import linkedinIcon from "../../assets/integration-icons-webp/linkedin-logo-icon.webp";
import openaiIcon from "../../assets/integration-icons-webp/openai-icon.webp";
import claudeIcon from "../../assets/integration-icons-webp/claude-icon.webp";
import greenhouseIcon from "../../assets/integration-icons-webp/greenhouse-logo-icon.webp";
import microsoftIcon from "../../assets/integration-icons-webp/microsoft-logo-icon.webp";
import paypalIcon from "../../assets/integration-icons-webp/paypal-icon.webp";
import salesforceIcon from "../../assets/integration-icons-webp/saleforce.webp";
import meetIcon from "../../assets/integration-icons-webp/google-meet-icon.webp";

/**
 * ILM ORA — full landing page, ported from the static HTML build.
 * Nav + footer come from PublicLayout (same as the rest of the site);
 * everything between them is this page's own content and styles, scoped
 * under `.ilmora-landing` so nothing here leaks onto the shared shell.
 */

/* ================= data ================= */

const CHAT_MESSAGES = [
  ["AS", "av-b", "Can you show a real spec, not a template?"],
  ["MR", "av-a", "Sharing one now. Notice how it opens with the decision."],
  ["RK", "av-c", "Posted my draft in the assignment tab."],
  ["DP", "av-d", "Which metric would you pick for onboarding?"],
  ["MR", "av-a", "One you can move within a week. Let\u2019s work through it."],
];

const JOURNEY = [
  {
    title: "Discover",
    desc: "Find the class that fits your goal and your level.",
    steps: [
      "Browse tracks by goal and experience",
      "See the mentor, schedule and syllabus first",
      "Reserve your seat in one tap",
    ],
  },
  {
    title: "Join live",
    desc: "Learn in the room with the mentor, not from a recording.",
    steps: [
      "Join from your phone or laptop",
      "Ask questions and get answers as you go",
      "Rewatch the session whenever you need",
    ],
  },
  {
    title: "Practice",
    desc: "Apply the lesson to a real task the same week.",
    steps: [
      "Get an assignment based on real work",
      "Receive feedback from mentors and Texora AI",
      "Revise and resubmit until it is strong",
    ],
  },
  {
    title: "Get certified",
    desc: "Finish with proof of skill you can show to employers.",
    steps: [
      "Receive your certificate when you complete a track",
      "Share a verifiable link on your profile",
      "Keep your progress across every course",
    ],
  },
];

const TRACKS = [
  {
    id: "t-product",
    nav: "Product",
    cls: "tr-product",
    h: "Product management",
    p: "Learn to find the right problem, write the plan and measure the result.",
    weeks: [
      ["Week 1", "Discovery and problem framing"],
      ["Week 2", "Specs, priorities and roadmaps"],
      ["Week 3", "Metrics and experiments"],
      ["Week 4", "Launch and iterate"],
    ],
    outputs: ["One-page spec", "Roadmap", "Metrics tree"],
  },
  {
    id: "t-design",
    nav: "Design",
    cls: "tr-design",
    h: "UX design",
    p: "Move from research to a clickable prototype you can present with confidence.",
    weeks: [
      ["Week 1", "User research and flows"],
      ["Week 2", "Wireframes and interaction"],
      ["Week 3", "Visual design and systems"],
      ["Week 4", "Usability testing and handoff"],
    ],
    outputs: ["Case study", "Prototype", "Design system starter"],
  },
  {
    id: "t-growth",
    nav: "Growth",
    cls: "tr-growth",
    h: "Growth",
    p: "Understand the funnel, run better experiments and keep users coming back.",
    weeks: [
      ["Week 1", "Funnels and retention"],
      ["Week 2", "Experiment design"],
      ["Week 3", "Lifecycle messaging"],
      ["Week 4", "Attribution and reporting"],
    ],
    outputs: ["Experiment plan", "Funnel report", "Lifecycle map"],
  },
  {
    id: "t-marketing",
    nav: "Marketing",
    cls: "tr-marketing",
    h: "Marketing",
    p: "Say the right thing to the right people, and prove what worked.",
    weeks: [
      ["Week 1", "Positioning and messaging"],
      ["Week 2", "Content and search"],
      ["Week 3", "Paid and performance"],
      ["Week 4", "Brand and community"],
    ],
    outputs: ["Messaging doc", "Content calendar", "Campaign brief"],
  },
];

const STORIES = [
  {
    cls: "s1",
    avatar: "AS",
    av: "av-b",
    metric: "3 interviews in 4 weeks",
    quote:
      "\u201CThe spec I wrote in class became the centrepiece of my interview. I finally had something real to talk about.\u201D",
    who: "Ananya S.",
    role: "Junior product manager, Product track",
  },
  {
    cls: "s2",
    avatar: "RK",
    av: "av-c",
    metric: "Portfolio ready in 6 weeks",
    quote:
      "\u201CWeekly feedback from a working designer changed how I explain my decisions. My case study finally read like a story.\u201D",
    who: "Rahul K.",
    role: "UX designer, Design track",
  },
  {
    cls: "s3",
    avatar: "DP",
    av: "av-d",
    metric: "2\u00D7 signup conversion",
    quote:
      "\u201CI ran the first experiment from the course on our own landing page. The result convinced my team to test every week.\u201D",
    who: "Divya P.",
    role: "Growth associate, Growth track",
  },
  {
    cls: "s4",
    avatar: "IA",
    av: "av-a",
    metric: "Promoted to team lead",
    quote:
      "\u201CThe messaging framework gave my team a shared language. Leadership noticed, and so did our campaign results.\u201D",
    who: "Imran A.",
    role: "Marketing lead, Marketing track",
  },
];

const MARQUEE = [
  { ico: "i-blue", title: "Seat reserved", sub: "Product Strategy Sprint", icon: "calendar" },
  { ico: "i-mint", title: "Session attended", sub: "Live with an industry mentor", icon: "video" },
  { ico: "i-peach", title: "Assignment graded", sub: "Feedback in your inbox", icon: "check" },
  { ico: "i-lav", title: "Certificate earned", sub: "Verifiable link ready to share", icon: "seal" },
  { ico: "i-butter", title: "Portfolio shared", sub: "Case study published", icon: "chart" },
  { ico: "i-blue", title: "Interview booked", sub: "Your next step, scheduled", icon: "briefcase" },
];

// Row 1 / Row 2 layout mirrors the reference (Calendly-style) integrations grid.
const INTEGRATIONS_ROW_1 = [
  { name: "Zoom", icon: zoomIcon },
  { name: "Google Calendar", icon: googleCalendarIcon },
  { name: "Gmail", icon: gmailIcon },
  { name: "HubSpot", icon: hubspotIcon },
  { name: "Slack", icon: slackIcon },
  { name: "Microsoft Teams", icon: teamsIcon },
  { name: "Chrome", icon: chromeIcon },
  { name: "LinkedIn", icon: linkedinIcon },
];
const INTEGRATIONS_ROW_2 = [
  { name: "OpenAI", icon: openaiIcon },
  { name: "Claude", icon: claudeIcon },
  { name: "Greenhouse", icon: greenhouseIcon },
  { name: "Microsoft", icon: microsoftIcon },
  { name: "PayPal", icon: paypalIcon },
  { name: "Salesforce", icon: salesforceIcon },
  { name: "Google Meet", icon: meetIcon },
];

const INTEGRATION_SUITES = [
  {
    icon: googleCalendarIcon,
    title: "Google Workspace",
    desc: "Get your class schedule done faster by connecting ILM ORA to Google Calendar, Meet, Gmail and more.",
  },
  {
    icon: microsoftIcon,
    title: "Microsoft suite",
    desc: "Make live sessions easier with integrations for Microsoft Teams, Outlook and more.",
  },
];

/* ================= small icons ================= */

function CheckIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function SealIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14 -1.5 8 5-3 5 3-1.5-8" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function VideoIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="13" height="12" rx="3" /><path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}
function SparkIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}
function ShieldIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function ChatDotsIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}
function ChevronIcon({ dir = "left" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === "right" ? "rotate(180deg)" : "none" }}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}
function marqueeIcon(name) {
  switch (name) {
    case "calendar":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case "video":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="13" height="12" rx="3" /><path d="m16 10 5-3v10l-5-3" />
        </svg>
      );
    case "check":
      return <CheckIcon width="20" height="20" strokeWidth="2.4" />;
    case "seal":
      return <SealIcon />;
    case "chart":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" /><path d="m3 15 5-5 4 4 3-3 6 6" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      );
  }
}

/* ================= reveal-on-scroll hook ================= */

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ================= main component ================= */

export default function IlmoraMeet({
  // theme / toggleTheme were previously accepted as props and just forwarded
  // to PublicLayout without IlmoraMeet ever using them itself — the page's
  // own CSS never responded to a theme change, so clicking the toggle did
  // nothing here even though it worked on StudentHub. This component now
  // manages dark mode itself, the same way StudentHub does.
  setShowLoginModal,
  scrollToSection,
}) {
  const [reduce, setReduce] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Stay in sync if the theme is changed from another tab/page.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "theme") setDarkMode(e.newValue === "dark");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        // ignore storage errors (e.g. private browsing)
      }
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <PublicLayout
      theme={darkMode ? "dark" : "light"}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
      <div className={`ilmora-landing${darkMode ? " dark" : ""}`} id="top">
        <style>{CSS}</style>

        <main>
          <Hero reduce={reduce} />
          <BookingShowcase reduce={reduce} />
          <Journey reduce={reduce} />
          <Tracks />
          <Stories />
          <Marquee reduce={reduce} />
          <Integrations />
        </main>
      </div>
    </PublicLayout>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ reduce }) {
  const [chat, setChat] = useState(CHAT_MESSAGES.slice(0, 3));
  const idxRef = useRef(3);
  const [seconds, setSeconds] = useState(42 * 60 + 18);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      const m = CHAT_MESSAGES[idxRef.current % CHAT_MESSAGES.length];
      idxRef.current += 1;
      setChat((prev) => [...prev, m].slice(-3));
    }, 2800);
    return () => clearInterval(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [reduce]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>Learn live from people who do the work.</h1>
          <p className="lead">
            Master Product, Design, Growth and Marketing in live sessions led by industry experts,
            with real assignments, feedback and a certificate at the end.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#join">Join a live class</a>
            <a className="btn btn-line" href="#tracks">Explore the tracks</a>
          </div>
          <p className="fine">Pick a track, reserve a seat and join from any device.</p>
        </div>

        <div className="hero-stage">
          <div
            className="live"
            role="img"
            aria-label="Preview of a live class with a mentor, learner chat and a graded assignment notification"
          >
            <div className="live-bar" aria-hidden="true">
              <span className="live-tag"><i /> Live</span>
              <span className="live-title">Writing a spec engineers actually read</span>
              <span className="live-time">{mm}:{ss}</span>
            </div>
            <div className="live-video" aria-hidden="true">
              <div className="mentor">
                <span className="avatar lg av-a">MR</span>
                <div className="eq"><i /><i /><i /><i /><i /></div>
              </div>
              <div className="caption">Start with the decision the reader has to make.</div>
              <div className="thumbs">
                <span className="avatar sm av-b">AS</span>
                <span className="avatar sm av-c">RK</span>
                <span className="avatar sm av-d">DP</span>
              </div>
            </div>
            <div className="chat" aria-hidden="true">
              {chat.map((m, i) => (
                <div className="msg" key={`${m[0]}-${i}-${m[2].slice(0, 6)}`}>
                  <span className={`avatar xs ${m[1]}`}>{m[0]}</span>
                  <span className="bubble">{m[2]}</span>
                </div>
              ))}
            </div>
            <div className="live-foot" aria-hidden="true">
              <span>148 learners in the room</span>
              <span className="hand">Hand raised</span>
            </div>
          </div>

          <div className="chip chip-a" aria-hidden="true">
            <span className="ico"><CheckIcon width="18" height="18" /></span>
            <span><b>Assignment graded</b><small>92 out of 100</small></span>
          </div>
          <div className="chip chip-b" aria-hidden="true">
            <span className="ico"><SealIcon /></span>
            <span><b>Certificate ready</b><small>Product Management</small></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Booking showcase ---------------- */
/* Ported from the Calendly hero: a gradient card peeking with floating
   icon bubbles at the top, a glass info panel on the left and a live
   calendar/time-slot mock on the right. A fake cursor drives the whole
   demo automatically on a loop (pick a date -> pick a slot -> confirm),
   so nothing needs to be clicked for the motion to happen. */

// Each floating icon now drives its OWN panel: its own left-side copy and
// its own right-side mock, not just a shared calendar. `key` matches the
// panel that BookingShowcase renders below. `duration` is how long that
// panel stays on screen during the automatic cycle before advancing to the
// next one (the calendar panel gets more time since it runs its own
// pick-a-date -> pick-a-slot -> confirm animation).
const FEATURES = [
  {
    key: "video",
    Icon: VideoIcon,
    label: "Live sessions",
    badge: "Scheduling",
    heading: "Book a seat with the world\u2019s best mentors",
    desc: "Giving you complete control over your calendar, ILM ORA makes it the easiest and most flexible way to find your next live class.",
    linkText: "Learn more",
    duration: 7200,
  },
  {
    key: "spark",
    Icon: SparkIcon,
    label: "AI-matched mentors",
    badge: "AI matching",
    heading: "Get matched to the right mentor, instantly",
    desc: "Texora AI reads your goal and current level, then recommends the class and mentor most likely to move you forward this week.",
    linkText: "See how matching works",
    duration: 3200,
  },
  {
    key: "shield",
    Icon: ShieldIcon,
    label: "Verified credentials",
    badge: "Credentials",
    heading: "A certificate employers can actually check",
    desc: "Every certificate carries a verifiable link, so anyone you share it with can confirm it in seconds.",
    linkText: "View a sample certificate",
    duration: 3200,
  },
  {
    key: "chat",
    Icon: ChatDotsIcon,
    label: "Live chat support",
    badge: "Support",
    heading: "Help is one message away",
    desc: "Stuck mid-assignment or unsure which track fits? Message a mentor or our support team and get a real answer, fast.",
    linkText: "Message support",
    duration: 3200,
  },
];

const CURSOR_DATE = 24;
const CURSOR_SLOT = "2:00 PM";

function BookingShowcase({ reduce }) {
  const [headRef, headIn] = useReveal();
  const [cardRef, cardIn] = useReveal(0.2);

  const stageRef = useRef(null);
  const dateElRef = useRef(null);
  const slotElRef = useRef(null);
  const confirmElRef = useRef(null);

  const [cursor, setCursor] = useState({ x: 24, y: 24, show: false });
  const [pickedDate, setPickedDate] = useState(19);
  const [pickedSlot, setPickedSlot] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [activeFloat, setActiveFloat] = useState(0);
  const current = FEATURES[activeFloat];
  const isVideoActive = activeFloat === 0;

  // Auto-advance through the four feature panels. Each panel gets its own
  // dwell time (see FEATURES[].duration) before moving to the next one.
  // Clicking an icon jumps straight to that panel and restarts the timer
  // from there, so manual and automatic motion share the same state.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      setActiveFloat((i) => (i + 1) % FEATURES.length);
    }, FEATURES[activeFloat].duration);
    return () => clearTimeout(t);
  }, [reduce, activeFloat]);

  // The pick-a-date -> pick-a-slot -> confirm cursor demo only plays while
  // the "Live sessions" (calendar) panel is the one on screen. Switching to
  // any other panel resets it so it starts clean the next time it's shown.
  useEffect(() => {
    if (reduce) {
      setPickedDate(CURSOR_DATE);
      setPickedSlot(CURSOR_SLOT);
      return;
    }
    if (!isVideoActive) {
      setPickedDate(19);
      setPickedSlot(null);
      setConfirming(false);
      setCursor((c) => ({ ...c, show: false }));
      return;
    }

    let cancelled = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const moveCursorTo = (el) => {
      if (!el || !stageRef.current) return;
      const target = el.getBoundingClientRect();
      const stage = stageRef.current.getBoundingClientRect();
      setCursor({
        x: target.left - stage.left + target.width / 2,
        y: target.top - stage.top + target.height / 2,
        show: true,
      });
    };

    async function run() {
      setPickedDate(19);
      setPickedSlot(null);
      setConfirming(false);
      setCursor((c) => ({ ...c, x: 24, y: 24, show: false }));
      await wait(500);
      if (cancelled) return;

      moveCursorTo(dateElRef.current);
      await wait(650);
      if (cancelled) return;
      setPickedDate(CURSOR_DATE);
      await wait(550);
      if (cancelled) return;

      moveCursorTo(slotElRef.current);
      await wait(650);
      if (cancelled) return;
      setPickedSlot(CURSOR_SLOT);
      await wait(550);
      if (cancelled) return;

      moveCursorTo(confirmElRef.current);
      await wait(650);
      if (cancelled) return;
      setConfirming(true);
      await wait(900);
      if (cancelled) return;

      setCursor((c) => ({ ...c, show: false }));
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [isVideoActive, reduce]);

  return (
    <section className="section booking" id="booking">
      <div className="wrap">
        <div ref={headRef} className={`sec-head center reveal${headIn ? " in" : ""}`}>
          <h2>Book your next session in seconds</h2>
          <p>One calendar for every mentor, every track, every time zone.</p>
        </div>

        <div ref={cardRef} className={`booking-card reveal${cardIn ? " in" : ""}`}>
          <div className="booking-floaters" role="tablist" aria-label="ILM ORA features">
            {FEATURES.map(({ Icon, label }, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={activeFloat === i}
                title={label}
                className={`float-ico${activeFloat === i ? " is-active" : ""}${reduce ? " no-float" : ""}`}
                style={{ animationDelay: `${i * 0.35}s` }}
                onClick={() => setActiveFloat(i)}
              >
                <Icon />
                <span className="float-label">{label}</span>
              </button>
            ))}
          </div>

          <div className="booking-panels" ref={stageRef}>
            <div className="booking-info" key={`info-${current.key}`}>
              <span className="badge">{current.badge}</span>
              <h3>{current.heading}</h3>
              <p>{current.desc}</p>
              <a className="link-underline" href="#tracks">{current.linkText} <ArrowRightIcon /></a>
            </div>

            <div className="booking-visual" key={`visual-${current.key}`} aria-hidden="true">
              {current.key === "video" && (
                <div className="booking-calendar">
                  <div className="bc-head">
                    <span>September 2026</span>
                    <span className="bc-nav">
                      <i><ChevronIcon dir="left" /></i>
                      <i><ChevronIcon dir="right" /></i>
                    </span>
                  </div>
                  <div className="bc-week">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                  <div className="bc-days">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                      <span
                        key={d}
                        ref={d === CURSOR_DATE ? dateElRef : null}
                        className={d === 19 ? "is-today" : d === pickedDate ? "is-picked" : ""}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="bc-slots">
                    {["10:00 AM", CURSOR_SLOT, "4:30 PM"].map((s) => (
                      <span
                        key={s}
                        ref={s === CURSOR_SLOT ? slotElRef : null}
                        className={`bc-slot${s === pickedSlot ? " is-picked" : ""}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div
                    ref={confirmElRef}
                    className={`bc-confirm${confirming ? " is-confirming" : ""}`}
                  >
                    {confirming ? "Seat confirmed" : "Confirm seat"}
                  </div>
                </div>
              )}

              {current.key === "spark" && (
                <div className="feature-card match-card">
                  <span className="mini-badge">Texora AI match</span>
                  <div className="match-row">
                    <span className="avatar sm av-a">MR</span>
                    <div>
                      <b>Meera Rao</b>
                      <small>Product mentor &middot; 98% fit for your goal</small>
                    </div>
                  </div>
                  <div className="match-row">
                    <span className="avatar sm av-b">AS</span>
                    <div>
                      <b>Writing Specs Engineers Read</b>
                      <small>Recommended next class, Sunday 11:00</small>
                    </div>
                  </div>
                  <div className="m-btn"><span>View match</span></div>
                </div>
              )}

              {current.key === "shield" && (
                <div className="feature-card cert-mini">
                  <small>Certificate of completion</small>
                  <h4>Product Management</h4>
                  <div className="who">Ananya Sharma</div>
                  <small>completed all sessions and assignments</small>
                  <span className="verified">
                    <CheckIcon width="16" height="16" strokeWidth="2.6" />
                    Verified credential
                  </span>
                </div>
              )}

              {current.key === "chat" && (
                <div className="feature-card chat-mini">
                  <div className="msg">
                    <span className="avatar xs av-c">RK</span>
                    <span className="bubble">Which metric should I pick for onboarding?</span>
                  </div>
                  <div className="msg">
                    <span className="avatar xs av-a">MR</span>
                    <span className="bubble">Start with activation rate in week one.</span>
                  </div>
                  <div className="m-btn"><span>Ask a mentor</span></div>
                </div>
              )}

              {!reduce && isVideoActive && (
                <div
                  className={`fake-cursor${cursor.show ? " is-visible" : ""}${confirming ? " is-clicking" : ""}`}
                  style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
                  aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M2 1.5 19 9.2l-6.9 1.6L9 19 2 1.5Z" fill="#1a1a2e" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Learning journey (accordion + auto-advance) ---------------- */

function Journey({ reduce }) {
  const [headRef, headIn] = useReveal();
  const tabsRef = useRef(null);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("idle"); // idle | play | manual
  const [runId, setRunId] = useState(0);

  const setIndex = useCallback((n, manual) => {
    setActive((cur) => {
      const total = JOURNEY.length;
      const next = ((n % total) + total) % total;
      return next;
    });
    if (manual) setMode("manual");
    setRunId((k) => k + 1);
  }, []);

  useEffect(() => {
    if (reduce) {
      setMode("manual");
      return;
    }
    const el = tabsRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setMode((m) => (m === "manual" ? m : e.isIntersecting ? "play" : "idle"));
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const onBarEnd = () => {
    if (mode === "play") setIndex(active + 1, false);
  };

  const onKeyDown = (e, k) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const t = (k + (e.key === "ArrowDown" ? 1 : -1) + JOURNEY.length) % JOURNEY.length;
      setIndex(t, true);
      requestAnimationFrame(() => {
        document.getElementById(`acc-btn-${t + 1}`)?.focus();
      });
    }
  };

  return (
    <section className="section" id="journey">
      <div className="wrap">
        <div ref={headRef} className={`sec-head reveal${headIn ? " in" : ""}`}>
          <h2>Everything between “I want to learn this” and “I can do this”</h2>
          <p>From choosing a class to holding a certificate, each step happens in one place.</p>
        </div>

        <div className="tabs" id="tabs" ref={tabsRef} data-mode={mode}>
          <div className="acc-list">
            {JOURNEY.map((item, k) => {
              const isActive = k === active;
              return (
                <div className={`acc${isActive ? " is-active" : ""}`} key={item.title}>
                  <button
                    className="acc-btn"
                    id={`acc-btn-${k + 1}`}
                    aria-expanded={isActive}
                    aria-controls={`acc-p-${k + 1}`}
                    onClick={() => setIndex(k, true)}
                    onKeyDown={(e) => onKeyDown(e, k)}
                  >
                    {item.title}
                  </button>
                  <div className="acc-panel" id={`acc-p-${k + 1}`} role="region" aria-labelledby={`acc-btn-${k + 1}`}>
                    <div className="acc-inner">
                      <p className="acc-desc">{item.desc}</p>
                      <div className="steps">
                        {item.steps.map((s) => (
                          <div className="step" key={s}><CheckIcon />{s}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bar">
                    {isActive && (
                      <i
                        key={`${k}-${mode}-${runId}`}
                        className={mode === "play" ? "bar-play" : "bar-full"}
                        onAnimationEnd={onBarEnd}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="stage" aria-hidden="true">
            <div className={`scene sc1${active === 0 ? " is-active" : ""}`}>
              <div className="m-card">
                <div className="m-in"><SearchIcon /> product management</div>
                <div className="m-row"><div><b>Product Strategy Sprint</b><small>Saturday 10:00, 3 sessions</small></div><span className="tag">Product</span></div>
                <div className="m-row sel"><div><b>Writing Specs Engineers Read</b><small>Sunday 11:00, live with Meera Rao</small></div><span className="tag">Product</span></div>
                <div className="m-row"><div><b>Research to Prototype</b><small>Saturday 14:00, 4 sessions</small></div><span className="tag t2">Design</span></div>
                <div className="m-btn"><span>Reserve seat</span></div>
              </div>
            </div>

            <div className={`scene sc2${active === 1 ? " is-active" : ""}`}>
              <div className="m-card">
                <div className="m-grid">
                  <div className="tile big"><div className="eq"><i /><i /><i /><i /><i /></div><small>Meera, mentor</small></div>
                  <div className="tile av-b">AS</div>
                  <div className="tile av-c">RK</div>
                </div>
                <div className="m-cc">\u201CStart with the decision the reader has to make.\u201D</div>
                <div className="m-meta"><span>Live captions on</span><span className="hand">Rahul raised a hand</span></div>
              </div>
            </div>

            <div className={`scene sc3${active === 2 ? " is-active" : ""}`}>
              <div className="m-card">
                <span className="score">92 <small>out of 100</small></span>
                <div className="m-title">Assignment: write a one-page spec for a checkout fix</div>
                <div className="m-prog"><i /></div>
                <div className="m-sub"><span>Draft submitted</span><span>Reviewed</span></div>
                <div className="fb"><span className="avatar sm av-a">MR</span><span className="bubble">Clear problem statement. Add one success metric and it is ready.</span></div>
              </div>
            </div>

            <div className={`scene sc4${active === 3 ? " is-active" : ""}`}>
              <div className="m-card cert">
                <small>Certificate of completion</small>
                <h4>Product Management</h4>
                <div className="who">Ananya Sharma</div>
                <small>completed all sessions and assignments</small>
                <div className="seal">ILM ORA</div>
                <span className="verified"><CheckIcon width="16" height="16" strokeWidth="2.6" />Verified credential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tracks (sticky nav + scroll spy) ---------------- */

function Tracks() {
  const [activeId, setActiveId] = useState(TRACKS[0].id);
  const refs = useRef({});

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section tracks" id="tracks">
      <div className="wrap tracks-in">
        <div className="tracks-side">
          <div className="sticky">
            <h2>Four tracks, one way of learning</h2>
            <p>Every track follows the same rhythm: live session, assignment, feedback, repeat.</p>
            <ul className="track-nav">
              {TRACKS.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={activeId === t.id ? "is-active" : ""}>{t.nav}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tracks-list">
          {TRACKS.map((t) => (
            <TrackCard key={t.id} track={t} setRef={(el) => (refs.current[t.id] = el)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrackCard({ track, setRef }) {
  const [revealRef, inView] = useReveal();
  return (
    <article
      className={`track ${track.cls}${inView ? " in" : ""}`}
      id={track.id}
      ref={(el) => {
        setRef(el);
        revealRef.current = el;
      }}
    >
      <h3>{track.h}</h3>
      <p>{track.p}</p>
      <ol className="timeline">
        {track.weeks.map(([wk, label]) => (
          <li key={wk}><small>{wk}</small><b>{label}</b></li>
        ))}
      </ol>
      <div className="outputs">
        {track.outputs.map((o) => (
          <span key={o}>{o}</span>
        ))}
      </div>
    </article>
  );
}

/* ---------------- Learner stories ---------------- */

function Stories() {
  const [headRef, headIn] = useReveal();
  const [active, setActive] = useState(0);

  const open = (i) => setActive(i);

  return (
    <section className="section" id="stories">
      <div className="wrap">
        <div ref={headRef} className={`sec-head reveal${headIn ? " in" : ""}`}>
          <h2>Real learners, real next steps</h2>
          <p>Hover or tap a card to read the story.</p>
        </div>

        <div className="stories">
          {STORIES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.cls}
                className={`story ${s.cls}${isActive ? " is-active" : ""}`}
                aria-expanded={isActive}
                onClick={() => open(i)}
                onFocus={() => open(i)}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover:hover) and (min-width:821px)").matches) open(i);
                }}
              >
                <span className={`avatar ${s.av}`}>{s.avatar}</span>
                <span className="s-metric">{s.metric}</span>
                <span className="s-detail">
                  <span className="s-quote">{s.quote}</span>
                  <span className="s-who"><b>{s.who}</b> {s.role}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Marquee ---------------- */

function Marquee({ reduce }) {
  const items = [...MARQUEE, ...MARQUEE]; // duplicate for a seamless loop
  return (
    <section className="marquee-sec" aria-label="Moments from the learning journey">
      <div className="marquee">
        <div className={`m-track${reduce ? " no-anim" : ""}`}>
          {items.map((m, i) => (
            <div className="m-item" key={`${m.title}-${i}`} aria-hidden={i >= MARQUEE.length}>
              <span className={`ico ${m.ico}`}>{marqueeIcon(m.icon)}</span>
              <span><b>{m.title}</b><small>{m.sub}</small></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Integrations (replaces the old FinalCta) ---------------- */
/* Layout modeled on the Calendly "Connect Calendly with your favorite tools"
   section: eyebrow label, heading, subtext, a "view all" link, a two-row
   logo grid, then two suite cards underneath. */

function Integrations() {
  const [headRef, headIn] = useReveal();
  const [gridRef, gridIn] = useReveal(0.05);

  return (
    <section className="section integrations" id="join">
      <div className="wrap">
        <div ref={headRef} className={`int-head reveal${headIn ? " in" : ""}`}>
          <span className="int-eyebrow">15+ integrations</span>
          <h2>Connect ILM ORA with your favorite tools</h2>
          <p>Our growing list of integrations makes ILM ORA flexible.</p>
          <a className="int-viewall" href="#join">
            View all integrations <ArrowRightIcon />
          </a>
        </div>

        <div ref={gridRef} className={`int-grid reveal${gridIn ? " in" : ""}`}>
          <div className="int-row">
            {INTEGRATIONS_ROW_1.map((it) => (
              <span className="int-tile" key={it.name} title={it.name}>
                <img src={it.icon} alt={it.name} loading="lazy" />
              </span>
            ))}
          </div>
          <div className="int-row">
            {INTEGRATIONS_ROW_2.map((it) => (
              <span className="int-tile" key={it.name} title={it.name}>
                <img src={it.icon} alt={it.name} loading="lazy" />
              </span>
            ))}
          </div>
        </div>

        <div className="int-suites">
          {INTEGRATION_SUITES.map((s) => (
            <div className="int-suite" key={s.title}>
              <span className="int-suite-ico"><img src={s.icon} alt="" /></span>
              <div>
                <b>{s.title}</b>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= styles ================= */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
.ilmora-landing{
  --ink:#1a1a2e; --ink-2:#666666; --line:#e8ddd0; --bg:#f5ede0; --white:#fff;
  --surface:#fff; --ink-fixed:#1a1a2e;
  --blue:#e87722; --blue-d:#d06a1a; --sky:#FFE3C7; --mint:#FFD9B0; --peach:#FFC7A3;
  --lav:#FFDCC2; --butter:#FFE8A3;
  --ease:cubic-bezier(.22,1,.36,1); --d-fast:200ms; --d-base:600ms; --d-slow:900ms;
  --r-xl:28px; --r-lg:22px; --r-md:14px; --r-sm:10px;
  --shadow-card:0 30px 60px -24px rgba(26,26,46,.28), 0 2px 8px rgba(26,26,46,.06);
  --shadow-soft:0 12px 30px -14px rgba(26,26,46,.20);
  --font-display:"Poppins","Segoe UI",system-ui,sans-serif;
  --font-body:"Poppins","Segoe UI",system-ui,-apple-system,sans-serif;
  font-family:var(--font-body);font-size:1.0625rem;line-height:1.6;color:var(--ink);background:var(--bg);
  -webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;
  transition:background var(--d-base) var(--ease),color var(--d-base) var(--ease);
}
.ilmora-landing.dark{
  --ink:#f3ede4; --ink-2:rgba(243,237,228,.62); --line:rgba(255,255,255,.12);
  --bg:#0f0f16; --white:#1b1b24; --surface:#1b1b24;
  --shadow-card:0 30px 60px -24px rgba(0,0,0,.6), 0 2px 8px rgba(0,0,0,.4);
  --shadow-soft:0 12px 30px -14px rgba(0,0,0,.5);
}
.ilmora-landing *{box-sizing:border-box}
.ilmora-landing img,.ilmora-landing svg{display:block;max-width:100%}
.ilmora-landing a{color:inherit;text-decoration:none}
.ilmora-landing button{font:inherit;color:inherit}
.ilmora-landing h1,.ilmora-landing h2,.ilmora-landing h3,.ilmora-landing h4{font-family:var(--font-display);font-weight:700;line-height:1.08;letter-spacing:-.025em;margin:0}
.ilmora-landing p{margin:0}
.ilmora-landing :focus-visible{outline:3px solid var(--blue);outline-offset:3px;border-radius:8px}
.ilmora-landing .wrap{width:min(1180px,100% - 48px);margin-inline:auto}

/* buttons */
.ilmora-landing .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:999px;font-weight:600;font-size:1rem;border:1.5px solid transparent;cursor:pointer;transition:transform var(--d-fast) var(--ease),box-shadow var(--d-fast) var(--ease),background var(--d-fast) var(--ease),border-color var(--d-fast) var(--ease)}
.ilmora-landing .btn:hover{transform:translateY(-2px)}
.ilmora-landing .btn-primary{background:var(--blue);color:#fff;box-shadow:0 10px 24px -10px rgba(232,119,34,.6)}
.ilmora-landing .btn-primary:hover{background:var(--blue-d);box-shadow:0 14px 28px -10px rgba(232,119,34,.7)}
.ilmora-landing .btn-line{background:rgba(255,255,255,.6);border-color:rgba(14,26,58,.18);color:var(--ink);backdrop-filter:blur(6px)}
.ilmora-landing .btn-line:hover{border-color:var(--ink);background:#fff}
.ilmora-landing .btn-ghost{color:var(--ink)}
.ilmora-landing .btn-ghost:hover{background:rgba(14,26,58,.06)}
.ilmora-landing .btn-white{background:#fff;color:var(--ink)}
.ilmora-landing .btn-white:hover{box-shadow:0 14px 28px -12px rgba(0,0,0,.5)}
.ilmora-landing .btn-outline-w{border-color:rgba(255,255,255,.4);color:#fff}
.ilmora-landing .btn-outline-w:hover{border-color:#fff;background:rgba(255,255,255,.08)}

/* nav */
.ilmora-landing .nav{position:sticky;top:0;z-index:50;transition:background var(--d-base) var(--ease),box-shadow var(--d-base) var(--ease),backdrop-filter var(--d-base) var(--ease)}
.ilmora-landing .nav.scrolled{background:rgba(245,248,254,.78);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);box-shadow:0 1px 0 var(--line)}
.ilmora-landing .nav-in{display:flex;align-items:center;justify-content:space-between;height:72px}
.ilmora-landing .logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:800;font-size:1.3rem;letter-spacing:-.02em}
.ilmora-landing .logo-mark{width:30px;height:30px;border-radius:9px;background:conic-gradient(from 210deg,var(--blue),var(--lav),var(--mint),var(--blue));position:relative}
.ilmora-landing .logo-mark::after{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--bg)}
.ilmora-landing .nav-links{display:flex;gap:6px}
.ilmora-landing .nav-links a{padding:8px 16px;border-radius:999px;font-weight:500;color:var(--ink-2);transition:color var(--d-fast),background var(--d-fast)}
.ilmora-landing .nav-links a:hover{color:var(--ink);background:rgba(14,26,58,.06)}
.ilmora-landing .nav-cta{display:flex;gap:8px;align-items:center}

/* hero — flat, no blur/grain */
.ilmora-landing .hero{background:var(--bg);padding:80px 0 90px}
.ilmora-landing .hero-in{display:grid;grid-template-columns:1.02fr 1fr;gap:56px;align-items:center}
.ilmora-landing .hero h1{font-size:clamp(2.3rem,5.3vw,4.1rem);margin-bottom:22px;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .1s forwards}
.ilmora-landing .lead{font-size:clamp(1.02rem,1.5vw,1.2rem);color:var(--ink-2);max-width:34em;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .22s forwards}
.ilmora-landing .hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .34s forwards}
.ilmora-landing .fine{margin-top:18px;font-size:.95rem;color:var(--ink-2);opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .46s forwards}
@keyframes im-rise{to{opacity:1;transform:none}}
.ilmora-landing .hero-stage{opacity:0;transform:translateY(30px) scale(.985);animation:im-rise var(--d-slow) var(--ease) .35s forwards;position:relative;padding:18px 0 34px 18px}

.ilmora-landing .live{background:var(--surface);border-radius:var(--r-xl);box-shadow:var(--shadow-card);padding:14px;max-width:560px;margin-left:auto}
.ilmora-landing .live-bar{display:flex;align-items:center;gap:10px;padding:4px 6px 12px}
.ilmora-landing .live-tag{display:inline-flex;align-items:center;gap:6px;background:#FFE7E4;color:#C22B1D;font-weight:600;font-size:.8rem;padding:3px 10px;border-radius:999px}
.ilmora-landing .live-tag i{width:7px;height:7px;border-radius:50%;background:#E5402F;animation:im-pulse 1.6s ease-in-out infinite}
@keyframes im-pulse{50%{transform:scale(1.7);opacity:.4}}
.ilmora-landing .live-title{font-weight:600;font-size:.95rem;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ilmora-landing .live-time{font-variant-numeric:tabular-nums;font-size:.85rem;color:var(--ink-2)}
.ilmora-landing .live-video{position:relative;height:230px;border-radius:var(--r-lg);background:linear-gradient(135deg,#1A2A5E,#3653C7 70%,#5C7BFF);display:grid;place-items:center;overflow:hidden}
.ilmora-landing .live-video::before{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 65%);top:-80px;right:-60px}
.ilmora-landing .mentor{display:flex;align-items:center;gap:18px}
.ilmora-landing .avatar{display:inline-grid;place-items:center;flex:none;width:64px;height:64px;border-radius:50%;font-weight:600;font-size:1.1rem;color:var(--ink);letter-spacing:.01em}
.ilmora-landing .avatar.sm{width:38px;height:38px;font-size:.8rem}
.ilmora-landing .avatar.xs{width:28px;height:28px;font-size:.68rem}
.ilmora-landing .avatar.lg{width:88px;height:88px;font-size:1.5rem}
.ilmora-landing .av-a{background:linear-gradient(135deg,#FFE8A3,#FFC7B8)}
.ilmora-landing .av-b{background:linear-gradient(135deg,#9BE7D6,#CFE0FF)}
.ilmora-landing .av-c{background:linear-gradient(135deg,#C3B3FF,#CFE0FF)}
.ilmora-landing .av-d{background:linear-gradient(135deg,#FFC7B8,#C3B3FF)}
.ilmora-landing .eq{display:flex;align-items:center;gap:4px;height:34px}
.ilmora-landing .eq i{width:5px;height:100%;background:#fff;border-radius:3px;transform-origin:center;animation:im-eq 1s ease-in-out infinite}
.ilmora-landing .eq i:nth-child(1){animation-duration:.9s}
.ilmora-landing .eq i:nth-child(2){animation-duration:.7s;animation-delay:.1s}
.ilmora-landing .eq i:nth-child(3){animation-duration:1.1s;animation-delay:.2s}
.ilmora-landing .eq i:nth-child(4){animation-duration:.8s;animation-delay:.05s}
.ilmora-landing .eq i:nth-child(5){animation-duration:1s;animation-delay:.3s}
@keyframes im-eq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.ilmora-landing .thumbs{position:absolute;right:12px;bottom:12px;display:flex;gap:6px}
.ilmora-landing .thumbs .avatar{border:2px solid rgba(255,255,255,.9)}
.ilmora-landing .caption{position:absolute;left:12px;bottom:12px;max-width:62%;background:rgba(9,18,45,.62);backdrop-filter:blur(6px);color:#fff;font-size:.82rem;line-height:1.35;padding:7px 11px;border-radius:10px}
.ilmora-landing .chat{display:flex;flex-direction:column;justify-content:flex-end;gap:8px;height:138px;overflow:hidden;padding:12px 6px 4px}
.ilmora-landing .msg{display:flex;align-items:flex-end;gap:8px;animation:im-msgin .5s var(--ease) both}
@keyframes im-msgin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ilmora-landing .bubble{background:#EEF3FF;border-radius:14px 14px 14px 4px;padding:7px 12px;font-size:.88rem;line-height:1.35;max-width:82%}
.ilmora-landing .msg:nth-child(even) .bubble{background:#E6F8F3}
.ilmora-landing .live-foot{display:flex;justify-content:space-between;align-items:center;padding:10px 6px 2px;border-top:1px solid var(--line);font-size:.85rem;color:var(--ink-2)}
.ilmora-landing .hand{background:var(--butter);color:#6B4E00;font-weight:600;padding:3px 10px;border-radius:999px;font-size:.78rem}
.ilmora-landing .chip{position:absolute;display:flex;align-items:center;gap:10px;background:var(--surface);border-radius:16px;padding:10px 14px 10px 10px;box-shadow:var(--shadow-soft);font-size:.86rem;line-height:1.3;opacity:0;animation:im-chipin .8s var(--ease) forwards}
.ilmora-landing .chip b{display:block;font-weight:600}
.ilmora-landing .chip small{color:var(--ink-2);font-size:.78rem}
.ilmora-landing .chip .ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none}
.ilmora-landing .chip-a{left:-6px;top:170px;animation-delay:1.2s}
.ilmora-landing .chip-b{right:-10px;bottom:0;animation-delay:1.8s}
.ilmora-landing .chip-a .ico{background:#DDF7EF;color:#0E7A5F}
.ilmora-landing .chip-b .ico{background:#E6DEFF;color:#5A3FD1}
@keyframes im-chipin{from{opacity:0;transform:translateY(16px) scale(.94)}to{opacity:1;transform:none}}

/* booking showcase — Calendly-style gradient card with floating icons */
.ilmora-landing .booking{padding:20px 0 100px}
.ilmora-landing .sec-head.center{text-align:center;margin-inline:auto}
.ilmora-landing .booking-card{position:relative;border-radius:36px;padding:56px 40px 40px;background:linear-gradient(150deg,#FFD9B0 0%,var(--blue) 55%,#C9531B 100%);box-shadow:0 40px 80px -30px rgba(208,106,26,.45);overflow:visible}
.ilmora-landing .booking-floaters{position:absolute;left:50%;top:0;transform:translate(-50%,-50%);display:flex;gap:14px;z-index:2}
.ilmora-landing .float-ico{position:relative;width:56px;height:56px;border-radius:50%;background:var(--surface);border:0;display:grid;place-items:center;color:var(--ink-2);box-shadow:var(--shadow-soft);animation:im-float 3.2s ease-in-out infinite;cursor:pointer;transition:background var(--d-fast) var(--ease),color var(--d-fast) var(--ease),width var(--d-fast) var(--ease),height var(--d-fast) var(--ease)}
.ilmora-landing .float-ico:hover{color:var(--ink)}
.ilmora-landing .float-ico.no-float{animation:none}
.ilmora-landing .float-ico.is-active{width:64px;height:64px;background:var(--ink-fixed);color:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.55),var(--shadow-soft)}
.ilmora-landing .float-label{position:absolute;left:50%;top:calc(100% + 10px);transform:translateX(-50%) translateY(4px);white-space:nowrap;background:var(--ink);color:#fff;font-size:.76rem;font-weight:600;padding:5px 10px;border-radius:8px;opacity:0;pointer-events:none;transition:opacity var(--d-fast) var(--ease),transform var(--d-fast) var(--ease)}
.ilmora-landing .float-ico:hover .float-label,.ilmora-landing .float-ico.is-active .float-label{opacity:1;transform:translateX(-50%) translateY(0)}
@keyframes im-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.ilmora-landing .booking-panels{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
.ilmora-landing .booking-info{background:rgba(255,255,255,.14);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.35);border-radius:var(--r-lg);padding:32px;color:#fff;display:flex;flex-direction:column;justify-content:center}
.ilmora-landing .booking-info .badge{display:inline-flex;align-self:flex-start;background:rgba(255,255,255,.22);font-size:.78rem;font-weight:600;padding:5px 12px;border-radius:999px;margin-bottom:16px}
.ilmora-landing .booking-info h3{font-size:1.6rem;margin-bottom:12px;color:#fff}
.ilmora-landing .booking-info p{color:rgba(255,255,255,.85);margin-bottom:18px;max-width:28em}
.ilmora-landing .link-underline{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:#fff;border-bottom:2px solid rgba(255,255,255,.6);width:fit-content;padding-bottom:2px;transition:border-color var(--d-fast)}
.ilmora-landing .link-underline:hover{border-color:#fff}
.ilmora-landing .booking-calendar{background:var(--surface);border-radius:var(--r-lg);padding:22px;box-shadow:var(--shadow-card)}
.ilmora-landing .bc-head{display:flex;justify-content:space-between;align-items:center;font-weight:600;margin-bottom:14px}
.ilmora-landing .bc-nav{display:flex;gap:6px}
.ilmora-landing .bc-nav i{width:26px;height:26px;border-radius:50%;background:var(--bg);display:grid;place-items:center;color:var(--ink-2)}
.ilmora-landing .bc-week{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:.72rem;color:var(--ink-2);margin-bottom:6px}
.ilmora-landing .bc-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px}
.ilmora-landing .bc-days span{aspect-ratio:1;display:grid;place-items:center;border-radius:8px;font-size:.82rem;color:var(--ink);transition:background var(--d-fast) var(--ease),color var(--d-fast) var(--ease)}
.ilmora-landing .bc-days span.is-today{border:1.5px solid var(--blue);font-weight:600}
.ilmora-landing .bc-days span.is-picked{background:var(--blue);color:#fff;font-weight:600}
.ilmora-landing .bc-slots{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.ilmora-landing .bc-slot{border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;font-size:.86rem;font-weight:500;transition:border-color var(--d-fast) var(--ease),background var(--d-fast) var(--ease),color var(--d-fast) var(--ease)}
.ilmora-landing .bc-slot.is-picked{border-color:var(--blue);background:#FFF1E6;color:var(--blue-d)}
.ilmora-landing .bc-confirm{background:var(--ink-fixed);color:#fff;text-align:center;font-weight:600;padding:12px;border-radius:12px;transition:transform var(--d-fast) var(--ease),background var(--d-fast) var(--ease)}
.ilmora-landing .bc-confirm.is-confirming{background:#0E7A5F;transform:scale(.97)}
.ilmora-landing .booking-info{animation:im-chipin .5s var(--ease) both}
.ilmora-landing .booking-visual{position:relative;animation:im-chipin .5s var(--ease) both}
.ilmora-landing .feature-card{background:var(--surface);border-radius:var(--r-lg);padding:26px;box-shadow:var(--shadow-card);height:100%;display:flex;flex-direction:column;justify-content:center;gap:12px}
.ilmora-landing .mini-badge{display:inline-flex;align-self:flex-start;background:#EEF3FF;color:var(--blue-d);font-size:.76rem;font-weight:600;padding:4px 10px;border-radius:999px;margin-bottom:4px}
.ilmora-landing .match-row{display:flex;align-items:center;gap:12px;border:1.5px solid var(--line);border-radius:12px;padding:12px 14px}
.ilmora-landing .match-row b{display:block;font-weight:600;font-size:.95rem;line-height:1.3}
.ilmora-landing .match-row small{color:var(--ink-2);font-size:.8rem}
.ilmora-landing .cert-mini{text-align:center;align-items:center}
.ilmora-landing .cert-mini small{color:var(--ink-2)}
.ilmora-landing .cert-mini h4{font-family:var(--font-display);font-size:1.3rem;letter-spacing:-.02em;margin:2px 0}
.ilmora-landing .cert-mini .who{font-weight:600;font-size:1.05rem}
.ilmora-landing .chat-mini .msg{align-items:flex-end}
.ilmora-landing .fake-cursor{position:absolute;left:0;top:0;pointer-events:none;opacity:0;transition:transform .65s cubic-bezier(.22,1,.36,1),opacity .3s ease;z-index:5;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35))}
.ilmora-landing .fake-cursor.is-visible{opacity:1}
.ilmora-landing .fake-cursor.is-clicking svg{animation:im-click .5s ease}
@keyframes im-click{0%{transform:scale(1)}35%{transform:scale(.72)}100%{transform:scale(1)}}

/* sections */
.ilmora-landing .section{padding:100px 0}
.ilmora-landing .sec-head{max-width:760px;margin-bottom:56px}
.ilmora-landing .sec-head h2{font-size:clamp(1.9rem,3.9vw,2.9rem);margin-bottom:16px}
.ilmora-landing .sec-head p{color:var(--ink-2);font-size:1.1rem;max-width:36em}
.ilmora-landing .reveal{opacity:0;transform:translateY(24px);transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease)}
.ilmora-landing .reveal.in{opacity:1;transform:none}

/* journey tabs */
.ilmora-landing .tabs{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start}
.ilmora-landing .acc-list{display:flex;flex-direction:column;gap:6px}
.ilmora-landing .acc{position:relative;border-radius:var(--r-lg);padding:0 24px;transition:background var(--d-base) var(--ease),box-shadow var(--d-base) var(--ease)}
.ilmora-landing .acc.is-active{background:var(--surface);box-shadow:var(--shadow-soft)}
.ilmora-landing .acc-btn{display:block;width:100%;text-align:left;background:none;border:0;padding:22px 0;cursor:pointer;font-family:var(--font-display);font-weight:700;font-size:1.35rem;letter-spacing:-.02em;color:var(--ink-2);transition:color var(--d-fast)}
.ilmora-landing .acc:hover .acc-btn,.ilmora-landing .acc.is-active .acc-btn{color:var(--ink)}
.ilmora-landing .acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--d-base) var(--ease)}
.ilmora-landing .acc.is-active .acc-panel{grid-template-rows:1fr}
.ilmora-landing .acc-inner{overflow:hidden}
.ilmora-landing .acc-desc{color:var(--ink-2);margin-bottom:14px;max-width:30em}
.ilmora-landing .steps{display:flex;flex-direction:column;gap:10px;padding-bottom:26px}
.ilmora-landing .step{display:flex;gap:12px;align-items:flex-start;font-weight:500}
.ilmora-landing .step svg{flex:none;margin-top:3px;color:var(--blue)}
.ilmora-landing .bar{position:absolute;left:24px;right:24px;bottom:0;height:3px;border-radius:3px;background:var(--line);overflow:hidden;opacity:0;transition:opacity var(--d-base)}
.ilmora-landing .acc.is-active .bar{opacity:1}
.ilmora-landing .bar i{display:block;height:100%;background:var(--blue);transform-origin:left}
.ilmora-landing .bar i.bar-play{animation:im-fill 6.5s linear forwards}
.ilmora-landing .bar i.bar-full{transform:scaleX(1)}
@keyframes im-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}

.ilmora-landing .stage{position:relative;aspect-ratio:1/1.02;border-radius:var(--r-xl);overflow:hidden;background:var(--sky);box-shadow:var(--shadow-soft)}
.ilmora-landing .scene{position:absolute;inset:0;display:grid;place-items:center;padding:8%;opacity:0;transform:scale(.97);transition:opacity var(--d-base) var(--ease),transform var(--d-slow) var(--ease);pointer-events:none}
.ilmora-landing .scene.is-active{opacity:1;transform:none}
.ilmora-landing .sc1{background:radial-gradient(80% 70% at 15% 10%,#9EC5FF,transparent 60%),radial-gradient(70% 60% at 95% 90%,#C3B3FF,transparent 60%),#DCEAFF}
.ilmora-landing .sc2{background:radial-gradient(80% 70% at 90% 10%,#9BE7D6,transparent 60%),radial-gradient(70% 60% at 5% 95%,#9EC5FF,transparent 60%),#DDF6F2}
.ilmora-landing .sc3{background:radial-gradient(80% 70% at 10% 90%,#FFC7B8,transparent 60%),radial-gradient(70% 60% at 95% 5%,#FFE8A3,transparent 60%),#FFF0E6}
.ilmora-landing .sc4{background:radial-gradient(80% 70% at 85% 90%,#C3B3FF,transparent 60%),radial-gradient(70% 60% at 5% 10%,#9BE7D6,transparent 60%),#EDE9FF}
.ilmora-landing .m-card{width:100%;max-width:400px;background:var(--surface);border-radius:20px;padding:18px;box-shadow:var(--shadow-card);position:relative}
.ilmora-landing .m-in{display:flex;align-items:center;gap:10px;background:#F1F5FD;border-radius:12px;padding:10px 14px;color:var(--ink-2);font-size:.92rem;margin-bottom:12px}
.ilmora-landing .m-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);margin-bottom:8px;font-size:.92rem}
.ilmora-landing .m-row.sel{border-color:var(--blue);background:#EEF3FF}
.ilmora-landing .m-row b{display:block;font-weight:600;line-height:1.25}
.ilmora-landing .m-row small{color:var(--ink-2);font-size:.8rem}
.ilmora-landing .tag{font-size:.74rem;font-weight:600;padding:3px 10px;border-radius:999px;background:#E3ECFF;color:var(--blue-d);flex:none}
.ilmora-landing .tag.t2{background:#EADFFF;color:#5A3FD1}
.ilmora-landing .m-btn{position:relative;display:block;width:100%;margin-top:6px;padding:12px;border-radius:12px;background:var(--blue);color:#fff;text-align:center;font-weight:600}
.ilmora-landing .m-grid{display:grid;grid-template-columns:1.5fr 1fr;grid-template-rows:1fr 1fr;gap:8px;height:190px}
.ilmora-landing .tile{border-radius:12px;display:grid;place-items:center;font-weight:600;position:relative;overflow:hidden}
.ilmora-landing .tile.big{grid-row:span 2;background:linear-gradient(135deg,#1A2A5E,#3653C7)}
.ilmora-landing .tile.big .eq i{background:#fff}
.ilmora-landing .tile small{position:absolute;left:8px;bottom:6px;color:#fff;font-size:.72rem;font-weight:500}
.ilmora-landing .m-meta{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:.85rem;color:var(--ink-2)}
.ilmora-landing .m-cc{margin-top:10px;background:#F1F5FD;border-radius:10px;padding:8px 12px;font-size:.85rem}
.ilmora-landing .m-title{font-weight:600;margin-bottom:12px;line-height:1.3}
.ilmora-landing .m-prog{height:8px;border-radius:8px;background:#EEF1F8;overflow:hidden;margin-bottom:6px}
.ilmora-landing .m-prog i{display:block;height:100%;width:78%;background:linear-gradient(90deg,var(--blue),#FFB37A);border-radius:8px}
.ilmora-landing .m-sub{display:flex;justify-content:space-between;font-size:.8rem;color:var(--ink-2)}
.ilmora-landing .fb{margin-top:16px;display:flex;gap:10px}
.ilmora-landing .fb .bubble{background:#FFF3E9;max-width:none;font-size:.88rem}
.ilmora-landing .score{position:absolute;right:16px;top:-16px;background:var(--ink-fixed);color:#fff;border-radius:14px;padding:8px 14px;font-weight:600}
.ilmora-landing .score small{font-weight:400;opacity:.75}
.ilmora-landing .cert{text-align:center;padding:26px 20px 22px}
.ilmora-landing .cert small{color:var(--ink-2)}
.ilmora-landing .cert h4{font-family:var(--font-display);font-size:1.35rem;letter-spacing:-.02em;margin:6px 0 2px}
.ilmora-landing .cert .who{font-weight:600;margin:10px 0 2px;font-size:1.05rem}
.ilmora-landing .seal{width:64px;height:64px;margin:16px auto 6px;border-radius:50%;background:conic-gradient(from 20deg,var(--blue),var(--lav),var(--mint),var(--blue));display:grid;place-items:center;color:#fff;font-size:.62rem;font-weight:700;letter-spacing:.04em}
.ilmora-landing .verified{position:relative;display:inline-flex;gap:8px;align-items:center;background:var(--surface);border-radius:14px;padding:9px 14px;box-shadow:var(--shadow-soft);font-size:.84rem;font-weight:600;color:#0E7A5F;margin-top:14px}

/* tracks */
.ilmora-landing .tracks{background:var(--surface);border-block:1px solid var(--line)}
.ilmora-landing .tracks-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:64px;align-items:start}
.ilmora-landing .tracks-side .sticky{position:sticky;top:90px}
.ilmora-landing .tracks-side h2{font-size:clamp(1.9rem,3.6vw,2.7rem);margin-bottom:16px}
.ilmora-landing .tracks-side p{color:var(--ink-2);margin-bottom:28px;max-width:26em}
.ilmora-landing .track-nav{list-style:none;display:flex;flex-direction:column;gap:2px;margin:0;padding:0}
.ilmora-landing .track-nav a{display:flex;align-items:center;gap:14px;padding:10px 0;font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:#8A94AD;transition:color var(--d-fast),transform var(--d-base) var(--ease)}
.ilmora-landing .track-nav a::before{content:"";width:0;height:3px;border-radius:3px;background:var(--blue);transition:width var(--d-base) var(--ease)}
.ilmora-landing .track-nav a.is-active{color:var(--ink);transform:translateX(4px)}
.ilmora-landing .track-nav a.is-active::before{width:28px}
.ilmora-landing .tracks-list{display:flex;flex-direction:column;gap:28px}
.ilmora-landing .track{scroll-margin-top:100px;border-radius:var(--r-xl);padding:36px;position:relative;overflow:hidden}
.ilmora-landing .tr-product{background:linear-gradient(140deg,#E3EDFF,#EEE8FF)}
.ilmora-landing .tr-design{background:linear-gradient(140deg,#E8E2FF,#FFE9E3)}
.ilmora-landing .tr-growth{background:linear-gradient(140deg,#DDF6F0,#E3EDFF)}
.ilmora-landing .tr-marketing{background:linear-gradient(140deg,#FFF1D6,#FFE1D8)}
.ilmora-landing .track h3{font-size:1.8rem;margin-bottom:8px}
.ilmora-landing .track>p{color:var(--ink-2);max-width:32em;margin-bottom:26px}
.ilmora-landing .timeline{position:relative;list-style:none;padding-left:34px;margin:0;display:flex;flex-direction:column;gap:18px}
.ilmora-landing .timeline::before{content:"";position:absolute;left:8px;top:8px;bottom:8px;width:2px;background:rgba(14,26,58,.16);transform:scaleY(0);transform-origin:top;transition:transform 1.2s var(--ease) .2s}
.ilmora-landing .track.in .timeline::before{transform:scaleY(1)}
.ilmora-landing .timeline li{position:relative;opacity:0;transform:translateX(-10px);transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease)}
.ilmora-landing .timeline li::before{content:"";position:absolute;left:-34px;top:6px;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--blue)}
.ilmora-landing .timeline small{display:block;color:var(--ink-2);font-size:.82rem}
.ilmora-landing .timeline b{font-weight:600}
.ilmora-landing .track.in .timeline li{opacity:1;transform:none}
.ilmora-landing .track.in .timeline li:nth-child(1){transition-delay:.25s}
.ilmora-landing .track.in .timeline li:nth-child(2){transition-delay:.45s}
.ilmora-landing .track.in .timeline li:nth-child(3){transition-delay:.65s}
.ilmora-landing .track.in .timeline li:nth-child(4){transition-delay:.85s}
.ilmora-landing .outputs{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.ilmora-landing .outputs span{background:rgba(255,255,255,.75);border-radius:999px;padding:5px 14px;font-size:.88rem;font-weight:500}

/* learner stories */
.ilmora-landing .stories{display:flex;gap:14px;height:470px}
.ilmora-landing .story{position:relative;flex:1;min-width:0;border:0;border-radius:var(--r-xl);overflow:hidden;cursor:pointer;text-align:left;padding:28px;display:block;transition:flex var(--d-slow) var(--ease),transform var(--d-base) var(--ease);color:var(--ink)}
.ilmora-landing .story.is-active{flex:3.3;cursor:default}
.ilmora-landing .s1{background:radial-gradient(90% 70% at 100% 0%,#C3B3FF,transparent 60%),#DCE7FF}
.ilmora-landing .s2{background:radial-gradient(90% 70% at 100% 0%,#9BE7D6,transparent 60%),#DFF3FF}
.ilmora-landing .s3{background:radial-gradient(90% 70% at 100% 0%,#FFE8A3,transparent 60%),#FFE4DA}
.ilmora-landing .s4{background:radial-gradient(90% 70% at 100% 0%,#FFC7B8,transparent 60%),#EDE6FF}
.ilmora-landing .story .avatar{position:absolute;right:24px;top:24px}
.ilmora-landing .s-metric{display:block;font-family:var(--font-display);font-weight:700;font-size:1.5rem;line-height:1.12;letter-spacing:-.02em;max-width:8.5em;transition:font-size var(--d-slow) var(--ease)}
.ilmora-landing .story.is-active .s-metric{font-size:2.4rem}
.ilmora-landing .s-detail{position:absolute;left:28px;bottom:28px;width:min(430px,calc(100% - 56px));opacity:0;transform:translateY(14px);visibility:hidden;transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease),visibility 0s var(--d-base)}
.ilmora-landing .story.is-active .s-detail{opacity:1;transform:none;visibility:visible;transition-delay:.25s,.25s,0s}
.ilmora-landing .s-quote{display:block;font-size:1.1rem;line-height:1.45;margin-bottom:14px}
.ilmora-landing .s-who{display:block;font-size:.92rem;color:var(--ink-2)}
.ilmora-landing .s-who b{color:var(--ink);font-weight:600}

/* marquee */
.ilmora-landing .marquee-sec{padding:20px 0 100px;overflow:hidden}
.ilmora-landing .marquee{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.ilmora-landing .m-track{display:flex;width:max-content;animation:im-marq 42s linear infinite}
.ilmora-landing .m-track.no-anim{animation:none;overflow-x:auto}
.ilmora-landing .marquee:hover .m-track{animation-play-state:paused}
@keyframes im-marq{to{transform:translateX(-50%)}}
.ilmora-landing .m-item{display:flex;align-items:center;gap:14px;margin-right:16px;padding:14px 22px 14px 14px;border-radius:18px;background:#fff;box-shadow:var(--shadow-soft);white-space:nowrap}
.ilmora-landing .m-item .ico{width:42px;height:42px;border-radius:12px;display:grid;place-items:center}
.ilmora-landing .m-item b{display:block;font-weight:600;line-height:1.25}
.ilmora-landing .m-item small{color:var(--ink-2);font-size:.84rem}
.ilmora-landing .i-blue{background:#E3ECFF;color:var(--blue-d)}
.ilmora-landing .i-mint{background:#DDF7EF;color:#0E7A5F}
.ilmora-landing .i-lav{background:#E6DEFF;color:#5A3FD1}
.ilmora-landing .i-peach{background:#FFE6DC;color:#B4471F}
.ilmora-landing .i-butter{background:#FFF1C7;color:#7A5A00}

/* integrations (replaces the old dark final-cta block) */
.ilmora-landing .integrations{background:var(--surface);border-top:1px solid var(--line)}
.ilmora-landing .int-head{text-align:center;max-width:640px;margin:0 auto 48px}
.ilmora-landing .int-eyebrow{display:inline-block;font-size:.8rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--blue-d);margin-bottom:14px}
.ilmora-landing .int-head h2{font-size:clamp(1.8rem,3.6vw,2.5rem);margin-bottom:14px}
.ilmora-landing .int-head p{color:var(--ink-2);font-size:1.05rem}
.ilmora-landing .int-viewall{display:inline-flex;align-items:center;gap:6px;margin-top:20px;font-weight:600;color:var(--ink);border-bottom:2px solid transparent;transition:border-color var(--d-fast)}
.ilmora-landing .int-viewall:hover{border-color:var(--ink)}
.ilmora-landing .int-viewall svg{transition:transform var(--d-fast) var(--ease)}
.ilmora-landing .int-viewall:hover svg{transform:translateX(3px)}
.ilmora-landing .int-grid{display:flex;flex-direction:column;gap:16px;max-width:920px;margin:0 auto 56px}
.ilmora-landing .int-row{display:flex;justify-content:center;flex-wrap:wrap;gap:16px}
.ilmora-landing .int-tile{width:72px;height:72px;border-radius:18px;background:var(--bg);border:1px solid var(--line);display:grid;place-items:center;transition:transform var(--d-fast) var(--ease),box-shadow var(--d-fast) var(--ease),border-color var(--d-fast)}
.ilmora-landing .int-tile:hover{transform:translateY(-4px);box-shadow:var(--shadow-soft);border-color:transparent}
.ilmora-landing .int-tile img{width:34px;height:34px;object-fit:contain}
.ilmora-landing .int-suites{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:920px;margin:0 auto}
.ilmora-landing .int-suite{display:flex;gap:16px;align-items:flex-start;background:var(--bg);border-radius:var(--r-lg);padding:22px;border:1px solid var(--line)}
.ilmora-landing .int-suite-ico{flex:none;width:36px;height:36px;border-radius:10px;background:#fff;display:grid;place-items:center;box-shadow:var(--shadow-soft)}
.ilmora-landing .int-suite-ico img{width:22px;height:22px;object-fit:contain}
.ilmora-landing .int-suite b{display:block;font-family:var(--font-display);font-weight:700;margin-bottom:6px}
.ilmora-landing .int-suite p{color:var(--ink-2);font-size:.92rem;line-height:1.5}

/* footer */
.ilmora-landing .foot{border-top:1px solid var(--line);padding:56px 0 40px;font-size:.95rem;color:var(--ink-2)}
.ilmora-landing .foot-in{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:32px}
.ilmora-landing .foot h4{font-family:var(--font-display);color:var(--ink);font-size:1rem;margin-bottom:12px}
.ilmora-landing .foot ul{list-style:none;display:flex;flex-direction:column;gap:8px;margin:0;padding:0}
.ilmora-landing .foot a:hover{color:var(--blue)}
.ilmora-landing .foot-base{margin-top:40px;padding-top:24px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:.88rem}

/* ===================== RESPONSIVE ===================== */
/* Laptops */
@media (max-width:1200px){
  .ilmora-landing .wrap{width:min(1040px,100% - 36px)}
}
/* iPad Pro / small laptops */
@media (max-width:1024px){
  .ilmora-landing .tracks-in{grid-template-columns:1fr;gap:40px}
  .ilmora-landing .tracks-side .sticky{position:static}
}
/* Tablets (iPad / iPad mini) */
@media (max-width:960px){
  .ilmora-landing .hero{padding:64px 0 70px;min-height:0}
  .ilmora-landing .hero-in,.ilmora-landing .tabs{grid-template-columns:1fr;gap:40px}
  .ilmora-landing .hero-stage{padding:0 0 30px}
  .ilmora-landing .live{margin:0 auto}
  .ilmora-landing .chip-a{left:0}
  .ilmora-landing .chip-b{right:0}
  .ilmora-landing .nav-links{display:none}
  .ilmora-landing .section{padding:64px 0}
  .ilmora-landing .stage{aspect-ratio:1/.95}
  .ilmora-landing .foot-in{grid-template-columns:1fr 1fr}
  .ilmora-landing .blob{filter:blur(50px)}
  .ilmora-landing .int-suites{grid-template-columns:1fr}
  .ilmora-landing .booking-panels{grid-template-columns:1fr}
}
/* Large phones / small tablets */
@media (max-width:820px){
  .ilmora-landing .stories{flex-direction:column;height:auto}
  .ilmora-landing .story{flex:none;min-height:130px;padding:22px}
  .ilmora-landing .story.is-active{flex:none}
  .ilmora-landing .s-detail{position:static;width:auto;max-height:0;overflow:hidden;transform:none;margin-top:0}
  .ilmora-landing .story.is-active .s-detail{max-height:280px;margin-top:18px}
  .ilmora-landing .story.is-active .s-metric{font-size:1.85rem}
  .ilmora-landing .story .avatar{width:52px;height:52px;font-size:1rem}
}
/* Phones */
@media (max-width:560px){
  .ilmora-landing .wrap{width:calc(100% - 28px)}
  .ilmora-landing .btn-ghost{display:none}
  .ilmora-landing .track{padding:26px 22px}
  .ilmora-landing .foot-in{grid-template-columns:1fr}
  .ilmora-landing .chip-a{top:150px}
  .ilmora-landing .live-video{height:190px}
  .ilmora-landing .nav-cta .btn{padding:10px 16px;font-size:.9rem}
  .ilmora-landing .int-tile{width:60px;height:60px;border-radius:14px}
  .ilmora-landing .int-tile img{width:28px;height:28px}
  .ilmora-landing .booking-card{padding:44px 20px 28px;border-radius:26px}
  .ilmora-landing .float-ico{width:44px;height:44px}
  .ilmora-landing .float-ico.is-active{width:50px;height:50px}
  .ilmora-landing .booking-floaters{gap:8px}
}
/* Small phones (iPhone SE, older Android) */
@media (max-width:380px){
  .ilmora-landing .hero h1{font-size:1.9rem}
  .ilmora-landing .live{padding:10px}
  .ilmora-landing .chip{font-size:.78rem;padding:8px 10px 8px 8px}
}

@media (prefers-reduced-motion:reduce){
  .ilmora-landing *,.ilmora-landing *::before,.ilmora-landing *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;animation-delay:0s!important;transition-duration:.001ms!important;transition-delay:0s!important}
  .ilmora-landing .hero h1,.ilmora-landing .lead,.ilmora-landing .hero-actions,.ilmora-landing .fine,.ilmora-landing .hero-stage,.ilmora-landing .chip{opacity:1;transform:none}
  .ilmora-landing .m-track{overflow-x:auto}
  .ilmora-landing .float-ico{animation:none!important}
}

/* =====================================================================
   DARK MODE CONTRAST FIX
   A bunch of cards below (chat bubbles, avatars, marquee items, the
   "sel" list row, journey mini tiles, learner-story panels, track
   panels) keep a fixed light background on purpose — it never switches
   with the theme. Their text, though, was inheriting var(--ink)/
   var(--ink-2), which flips to a near-white color in dark mode. Light
   text on a light card = invisible, which is exactly what was showing
   up as "missing" sections. Fix: pin these cards' text to a fixed dark
   ink color whenever .dark is active, so they stay readable regardless
   of the page theme (same idea as .tag / .verified / .mini-badge,
   which already used a fixed color and never had this bug).
   ===================================================================== */
.ilmora-landing.dark .bubble,
.ilmora-landing.dark .avatar,
.ilmora-landing.dark .m-item,
.ilmora-landing.dark .m-row.sel,
.ilmora-landing.dark .m-cc,
.ilmora-landing.dark .tile,
.ilmora-landing.dark .story,
.ilmora-landing.dark .track{
  color:#1a1a2e;
}
.ilmora-landing.dark .m-item small,
.ilmora-landing.dark .m-row.sel small,
.ilmora-landing.dark .story .s-who,
.ilmora-landing.dark .track>p,
.ilmora-landing.dark .timeline small,
.ilmora-landing.dark .outputs span{
  color:rgba(26,26,46,.62);
}
.ilmora-landing.dark .tile.big{
  color:#fff; /* this tile alone has a fixed dark-navy background, so it keeps white text */
}
.ilmora-landing.dark .tile.big small{
  color:#fff;
}
`;