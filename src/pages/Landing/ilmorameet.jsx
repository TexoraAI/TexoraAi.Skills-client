// import { useState, useEffect, useCallback } from "react";
// import {
//   Users, Calendar, Link2, CreditCard, Palette,
//   Video, Clock, MapPin, User, ChevronLeft, ChevronRight,
//   X, Sun, Moon, Check, Menu,
//   ArrowRight, Globe, Apple,
//   Play, Target, TrendingUp, Code2, Briefcase,
//   GraduationCap, Sparkles,
// } from "lucide-react";

// // ─── CSS INJECTION ────────────────────────────────────────────────────────
// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   body { overflow-x: hidden; }
  
//   /* Responsive helpers */
//   .ilm-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
//   .ilm-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
//   .ilm-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
//   .ilm-grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
//   .ilm-flex-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
//   .ilm-flex-col { display: flex; flex-direction: column; gap: 24px; }
//   .ilm-nav-links { display: flex; gap: 2px; list-style: none; }
//   /* FIX 1: Nav auth buttons - visible on tablet/desktop, hidden on mobile */
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
//   ::-webkit-scrollbar { width: 6px; } 
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: #e87722; border-radius: 3px; }

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
//     /* FIX 1: Hide nav auth buttons on mobile */
//     .ilm-nav-auth { display: none !important; }
//     .ilm-hero-widget { display: none !important; }
//     .ilm-booking-sidebar { display: none !important; }
//     .ilm-pricing-grid { grid-template-columns: 1fr !important; }
//     .ilm-footer-grid { grid-template-columns: 1fr !important; }
//     .ilm-feat-grid { grid-template-columns: 1fr !important; }
//     .ilm-reviews-grid { grid-template-columns: 1fr !important; }
//     .ilm-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
//     /* FIX 2: !important on all mobile layout overrides */
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

// // ─── MOBILE DRAWER ────────────────────────────────────────────────────────
// function MobileDrawer({ open, onClose, th, scrollTo, setBookingOpen, setAuthMode }) {
//   if (!open) return null;
//   return (
//     <div style={{ position:"fixed", inset:0, zIndex:1500, background:"rgba(0,0,0,0.4)" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
//       <div style={{ position:"absolute", top:0, right:0, bottom:0, width:"min(290px,82vw)", background:th.navBg, backdropFilter:"blur(16px)", display:"flex", flexDirection:"column", padding:"20px 0 28px" }}>
//         <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 18px", borderBottom:`1px solid ${th.border}` }}>
//           <Logo size="1.3rem" variant="dark"/>
//           <button onClick={onClose} style={{ background:"transparent", border:"none", cursor:"pointer", color:th.dark, display:"flex", alignItems:"center" }}><X size={22}/></button>
//         </div>
//         <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
//           {[["#pricing","Pricing"],["#courses","Solutions"],["#features","Features"],["#success","What's New"]].map(([href,label])=>(
//             <div key={label} onClick={()=>{onClose();scrollTo(href);}} style={{ padding:"13px 22px", fontSize:"0.97rem", fontWeight:600, color:th.dark, cursor:"pointer", borderBottom:`1px solid ${th.border}` }}
//               onMouseOver={e=>e.currentTarget.style.color="#e87722"} onMouseOut={e=>e.currentTarget.style.color=th.dark}>
//               {label}
//             </div>
//           ))}
//           <div onClick={()=>{onClose();setBookingOpen(true);}} style={{ padding:"13px 22px", fontSize:"0.97rem", fontWeight:600, color:th.dark, cursor:"pointer", borderBottom:`1px solid ${th.border}` }}
//             onMouseOver={e=>e.currentTarget.style.color="#e87722"} onMouseOut={e=>e.currentTarget.style.color=th.dark}>
//             Book Free Demo
//           </div>
//         </div>
//         <div style={{ padding:"14px 18px" }}></div>
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
// export default function App() {
//   const [dark, setDark] = useState(false);
//   const [authMode, setAuthMode] = useState(null);
//   const [bookingOpen, setBookingOpen] = useState(false);
//   const [activeSol, setActiveSol] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const w = useWindowSize();
//   const isMobile = w < 640;
//   const isTablet = w >= 640 && w < 1024;
//   const isDesktop = w >= 1024;
//   const th = dark ? T.dark : T.light;

//   const scrollTo = useCallback((id) => {
//     const el = document.querySelector(id);
//     if (el) el.scrollIntoView({ behavior:"smooth" });
//   }, []);

//   const SP = "56px 0";
//   const spStyle = { padding: SP };

//   return (
//     <div style={{ fontFamily:"Poppins, sans-serif", background:th.bg, color:th.text, overflowX:"hidden", minWidth:320 }}>
//       <StyleInjector/>

//       {/* ── NAV ── */}
//       <nav style={{ position:"fixed", top:0, left:0, right:0, height:64, background:th.navBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${th.border}`, display:"flex", alignItems:"center", zIndex:1000, gap:10, padding:"0 5%" }}>
//         <div style={{ marginRight:"auto" }}>
//           <Logo size={isMobile?"1.2rem":"1.5rem"} variant={dark?"light":"dark"} onClick={()=>window.location.href="/"}/>
//         </div>

//         {/* Desktop nav links */}
//         {isDesktop&&(
//           <ul className="ilm-nav-links" style={{ gap:2, padding:0 }}>
//             {[["#pricing","Pricing"],["#courses","Solutions"],["#features","Features"],["#success","What's New"]].map(([href,label],i)=>(
//               <li key={i}>
//                 <a href={href} onClick={e=>{e.preventDefault();scrollTo(href);}} style={{ textDecoration:"none", color:th.dark, fontSize:"0.83rem", fontWeight:600, padding:"6px 12px", borderRadius:20, display:"block", transition:"background 0.2s" }}
//                   onMouseOver={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.05)"}
//                   onMouseOut={e=>e.currentTarget.style.background="transparent"}>
//                   {label}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* Tablet: key links */}
//         {isTablet&&(
//           <div style={{ display:"flex", gap:4 }}>
//             {[["#pricing","Pricing"],["#courses","Solutions"],["#features","Features"]].map(([href,label])=>(
//               <a key={label} href={href} onClick={e=>{e.preventDefault();scrollTo(href);}} style={{ textDecoration:"none", color:th.dark, fontSize:"0.82rem", fontWeight:600, padding:"6px 12px", borderRadius:20 }}>{label}</a>
//             ))}
//           </div>
//         )}

//         {/* Get Demo button — tablet + desktop only */}
//         {!isMobile&&(
//           <button onClick={()=>setBookingOpen(true)} style={{ padding:"8px 16px", background:"#e87722", color:"#fff", border:"none", borderRadius:8, fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", whiteSpace:"nowrap", flexShrink:0 }}
//             onMouseOver={e=>e.currentTarget.style.background="#d06a1a"} onMouseOut={e=>e.currentTarget.style.background="#e87722"}>
//             Get Demo
//           </button>
//         )}



//         {/* Dark mode */}
//         <button onClick={()=>setDark(!dark)} style={{ width:34, height:34, border:`1.5px solid ${th.border}`, borderRadius:8, background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:th.text, flexShrink:0 }}>
//           {dark?<Sun size={15}/>:<Moon size={15}/>}
//         </button>

//         {/* Hamburger — only on non-desktop */}
//         {!isDesktop&&(
//           <button onClick={()=>setDrawerOpen(true)} style={{ width:34, height:34, border:`1.5px solid ${th.border}`, borderRadius:8, background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:th.text, flexShrink:0 }}>
//             <Menu size={18}/>
//           </button>
//         )}
//       </nav>

//       <MobileDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} th={th} scrollTo={scrollTo} setBookingOpen={setBookingOpen} setAuthMode={setAuthMode}/>

//       {/* ── HERO ── */}
//       <section style={{ paddingTop:"calc(64px + 44px)", paddingBottom:isMobile?32:44, paddingLeft:"5%", paddingRight:"5%", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", background:th.heroBg, position:"relative", overflow:"hidden" }}>
//         <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,119,34,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>
//         <div style={{ maxWidth:700, width:"100%", margin:"0 auto" }}>
//           <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:50, padding:"5px 14px", fontSize:"0.73rem", fontWeight:600, marginBottom:16, border:"1px solid rgba(232,119,34,0.2)" }}>
//             🚀 India's #1 Career Learning Platform
//           </div>
//           <h1 className="ilm-hero-h1" style={{ fontWeight:700, lineHeight:1.18, color:th.dark, marginBottom:14, letterSpacing:"-0.3px" }}>
//             Easy learning platform for <span style={{ color:th.orange, fontWeight:800 }}>everyone</span>
//           </h1>
//           <p style={{ fontSize:isMobile?"0.88rem":"0.97rem", color:th.muted, lineHeight:1.75, marginBottom:28, maxWidth:520, margin:"0 auto 28px" }}>
//             Eliminate the hassle of managing your career growth with an advanced platform that takes care of everything for you.
//           </p>
//           <div className="ilm-hero-btns" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:isMobile?24:40 }}>
//             <button onClick={()=>setBookingOpen(true)} style={{ padding:isMobile?"12px 22px":"13px 28px", background:th.dark, color:dark?"#0f0f0f":"#fff", borderRadius:10, border:"none", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif", width:isMobile?"100%":"auto", justifyContent:"center" }}>
//               <Calendar size={16}/> Book Free Demo
//             </button>
//             <button onClick={()=>scrollTo("#courses")} style={{ padding:isMobile?"12px 22px":"13px 28px", background:"transparent", color:th.dark, border:`2px solid ${th.dark}`, borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", width:isMobile?"100%":"auto" }}>
//               Explore Courses
//             </button>
//           </div>
//         </div>
//         {/* Widget Preview — hidden on mobile */}
//         <div className="ilm-hero-widget" style={{ width:"100%", maxWidth:640, margin:"0 auto", background:"#fff", borderRadius:14, boxShadow:"0 16px 60px rgba(0,0,0,0.12)", overflow:"hidden", border:"1px solid #e8ddd0" }}>
//           <div style={{ background:"linear-gradient(90deg,#1a1a2e,#2a2a4e)", padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//             <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.7rem" }}>←</span>
//             <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.7rem" }}>Powered by <strong style={{ color:"#fff" }}>ILM ORA</strong></span>
//             <span/>
//           </div>
//           <div style={{ display:"flex", minHeight:180 }}>
//             <div className="ilm-widget-sidebar" style={{ background:"#fafaf8", borderRight:"1px solid #f0ece8", padding:16, width:155, flexShrink:0, flexDirection:"column", gap:6 }}>
//               <Logo size="1rem" variant="dark"/>
//               <div style={{ fontSize:"0.58rem", color:"#aaa", marginBottom:4 }}>ilmora.texora.ai</div>
//               <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#1a1a2e", marginBottom:6 }}>Free Demo Session</div>
//               {[[<Clock size={10}/>, "30 min"],[<Video size={10}/>, "Google Meet"],[<User size={10}/>, "Vikash Sharma"]].map(([ic,txt],i)=>(
//                 <div key={i} style={{ fontSize:"0.66rem", color:"#888", marginBottom:3, display:"flex", alignItems:"center", gap:5 }}>{ic}{txt}</div>
//               ))}
//             </div>
//             <div style={{ flex:1, padding:14 }}>
//               <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
//                 <div style={{ width:22, height:22, border:"1px solid #e0dbd5", borderRadius:6, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={12}/></div>
//                 <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#1a1a2e" }}>June 2026</div>
//                 <div style={{ width:22, height:22, border:"1px solid #e0dbd5", borderRadius:6, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={12}/></div>
//               </div>
//               <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, fontSize:"0.65rem" }}>
//                 {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{ textAlign:"center", color:"#aaa", fontWeight:600, padding:"2px 0" }}>{d}</div>)}
//                 {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((d,i)=>{
//                   const wknd=[0,6].includes(i%7), sel=d===11;
//                   return <div key={d} style={{ textAlign:"center", padding:"4px 2px", borderRadius:"50%", color:wknd?"#ddd":sel?"#fff":"#555", background:sel?"#e87722":"transparent", fontWeight:sel?700:400 }}>{d}</div>;
//                 })}
//               </div>
//             </div>
//             <div style={{ padding:"14px 10px", width:100, flexShrink:0, borderLeft:"1px solid #f0ece8" }}>
//               <div style={{ fontSize:"0.63rem", color:"#aaa", fontWeight:600, marginBottom:7, textAlign:"center" }}>Select slot</div>
//               {["09:00 am","09:30 am","10:00 am","10:30 am","11:00 am"].map((s,i)=>(
//                 <div key={s} style={{ padding:"5px 6px", border:"1.5px solid #e87722", borderRadius:7, color:i===0?"#fff":"#e87722", background:i===0?"#e87722":"transparent", fontSize:"0.66rem", fontWeight:600, textAlign:"center", marginBottom:5, cursor:"pointer" }}>{s}</div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── STATS ── */}
//       <section style={{ ...spStyle, background:th.statsBg, textAlign:"center" }} className="ilm-section-px">
//         <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:24 }}>ILM ORA Helps You Achieve</h2>
//         <div className="ilm-stats-grid" style={{ maxWidth:860, margin:"0 auto" }}>
//           {STATS.map((s,i)=>(
//             <div key={i} style={{ background:"linear-gradient(135deg,#1a1a2e,#2a2a4e)", borderRadius:14, padding:"20px 14px", color:"#fff" }}>
//               <div style={{ fontSize:"0.7rem", fontWeight:500, opacity:0.65, marginBottom:5 }}>{s.label}</div>
//               <div style={{ fontSize:"2rem", fontWeight:800, color:"#e87722", marginBottom:3 }}>{s.num}</div>
//               <div style={{ fontSize:"0.68rem", opacity:0.55 }}>{s.sub}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── HOW IT WORKS ── */}
//       <section id="mentors" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//         <div style={{ textAlign:"center", marginBottom:36 }}>
//           <SectionTag>HOW IT WORKS</SectionTag>
//           <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Start your learning in <span style={{ color:th.orange }}>3 simple steps</span></h2>
//         </div>
//         <div className="ilm-howit-row" style={{ maxWidth:1060, margin:"0 auto" }}>
//           <div style={{ flex:1, minWidth:isMobile?"100%":280, display:"flex", flexDirection:"column", gap:26 }}>
//             {[{n:"1",title:"Enroll in a Program",desc:"Choose your course and create your personalized learning path with expert guidance."},
//               {n:"2",title:"Set Your Schedule",desc:"Set your learning time at your convenience. Book 1:1 mentor sessions anytime."},
//               {n:"3",title:"Learn & Get Hired",desc:"Complete projects, ace mock interviews and land your dream job with placement support."},
//             ].map((s,i,arr)=>(
//               <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
//                 <div style={{ position:"relative" }}>
//                   <div style={{ width:38, height:38, borderRadius:"50%", background:"#e87722", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1rem", flexShrink:0 }}>{s.n}</div>
//                   {i<arr.length-1&&<div style={{ position:"absolute", left:18, top:38, bottom:-26, width:2, background:"linear-gradient(to bottom,#e87722,transparent)" }}/>}
//                 </div>
//                 <div>
//                   <h4 style={{ fontSize:"0.96rem", fontWeight:700, color:th.dark, marginBottom:4 }}>{s.title}</h4>
//                   <p style={{ fontSize:"0.83rem", color:th.muted, lineHeight:1.65 }}>{s.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="ilm-mini-card-wrap" style={{ background:th.bg, borderRadius:16, padding:20, border:`1px solid ${th.border}` }}>
//             <MiniCard title="Free Demo Session" dur="30 min" mentor="Vikash Sharma, Mentor" type="Google Meet" initials="VS" dark={dark}/>
//           </div>
//         </div>
//       </section>

//       {/* ── FEATURES ── */}
//       <section id="features" style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
//         <div style={{ textAlign:"center", marginBottom:32 }}>
//           <SectionTag>GET YOUR HANDS ON</SectionTag>
//           <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Features of our <span style={{ color:th.orange }}>Platform</span></h2>
//         </div>
//         <div className="ilm-feat-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
//           {FEATURES.map((f,i)=>(
//             <div key={i} className="card-hover" style={{ background:th.white, borderRadius:14, padding:"20px", border:`1px solid ${th.border}`, cursor:"default" }}
//               onMouseOver={e=>e.currentTarget.style.borderColor="#e87722"}
//               onMouseOut={e=>e.currentTarget.style.borderColor=th.border}>
//               <div style={{ width:46, height:46, borderRadius:11, background:th.bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, border:`1px solid ${th.border}`, color:"#e87722" }}>{f.icon}</div>
//               <h4 style={{ fontSize:"0.95rem", fontWeight:700, color:th.dark, marginBottom:7 }}>{f.title}</h4>
//               <p style={{ fontSize:"0.82rem", color:th.muted, lineHeight:1.65 }}>{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── SOLUTIONS ── */}
//       <section id="courses" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//         <div style={{ textAlign:"center", marginBottom:26 }}>
//           <SectionTag>Build For Your Business</SectionTag>
//           <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Optimised learning for <span style={{ color:th.orange }}>all type of goals</span></h2>
//         </div>
//         <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:28 }}>
//           {SOLUTIONS.map((s,i)=>(
//             <button key={i} onClick={()=>setActiveSol(i)} style={{ display:"flex", alignItems:"center", gap:5, padding:isMobile?"6px 12px":"8px 18px", border:`1.5px solid ${i===activeSol?"#e87722":th.border}`, borderRadius:50, background:i===activeSol?"rgba(232,119,34,0.08)":th.cardBg, cursor:"pointer", fontSize:isMobile?"0.73rem":"0.8rem", fontWeight:600, color:i===activeSol?th.dark:th.muted, transition:"all 0.2s", fontFamily:"Poppins, sans-serif" }}>
//               {s.tabIcon} {s.tab}
//             </button>
//           ))}
//         </div>
//         {SOLUTIONS.map((s,i)=>i===activeSol&&(
//           <div key={i} className="ilm-sol-flex" style={{ maxWidth:1060, margin:"0 auto" }}>
//             <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//               <h3 className="ilm-sol-h3" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>{s.title}</h3>
//               <p style={{ color:th.muted, lineHeight:1.75, marginBottom:14 }}>{s.desc}</p>
//               <div style={{ fontSize:"1.7rem", fontWeight:800, color:th.orange, marginBottom:3 }}>{s.stat}</div>
//               <div style={{ fontSize:"0.8rem", color:th.muted, marginBottom:16 }}>{s.statLabel}</div>
//               <button onClick={()=>i===4?setBookingOpen(true):setAuthMode("enroll")} style={{ color:th.orange, fontSize:"0.85rem", fontWeight:600, background:"none", border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5, fontFamily:"Poppins, sans-serif" }}>
//                 {i===4?"Book a Session":"Enroll Now"} <ArrowRight size={14}/>
//               </button>
//             </div>
//             <div className="ilm-mini-card-wrap" style={{ background:th.bg, borderRadius:14, padding:18, border:`1px solid ${th.border}` }}>
//               <MiniCard {...s.card} initials={s.card.mentor[0]} dark={dark}/>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* ── PRICING ── */}
//       <PricingSection th={th} setAuthMode={setAuthMode}/>

//       {/* ── INTEGRATIONS ── */}
//       <section style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//         <div className="ilm-integ-row" style={{ maxWidth:1060, margin:"0 auto" }}>
//           <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//             <SectionTag>Integrations</SectionTag>
//             <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>Integrate your favourite calendar</h2>
//             <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Integrate Zoom, Google Meet, and MS Teams seamlessly for hassle-free sessions.</p>
//             <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
//               {[[<Video size={14}/>, "Zoom"],[<Video size={14}/>, "Google Meet"],[<Briefcase size={14}/>, "MS Teams"]].map(([ic,name],i)=>(
//                 <div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", background:th.bg, border:`1px solid ${th.border}`, borderRadius:50, fontSize:"0.8rem", fontWeight:600, color:th.dark }}>
//                   <span style={{ color:"#e87722" }}>{ic}</span> {name}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div style={{ flex:1, minWidth:isMobile?"100%":260, background:th.white, borderRadius:14, padding:18, boxShadow:dark?"none":"0 6px 30px rgba(0,0,0,0.07)", border:`1px solid ${th.border}` }}>
//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
//               <div style={{ fontSize:"0.85rem", fontWeight:700, color:th.dark }}>June 2026</div>
//               <div style={{ display:"flex", gap:6 }}>
//                 {[<ChevronLeft size={12}/>,<ChevronRight size={12}/>].map((ic,i)=>(
//                   <span key={i} style={{ width:24, height:24, border:`1px solid ${th.border}`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:th.muted }}>{ic}</span>
//                 ))}
//               </div>
//             </div>
//             <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, fontSize:"0.7rem" }}>
//               {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} style={{ textAlign:"center", color:"#aaa", fontWeight:600, padding:"3px 0" }}>{d}</div>)}
//               {[2,3,4,5,6,7,1,9,10,11,12,13,14,8,16,17,18,19,20,21,15,23,24,25,26,27,28,22,30].map((d,i)=>(
//                 <div key={i} style={{ textAlign:"center", padding:"4px 2px", borderRadius:"50%", cursor:"pointer", color:[10,11,12].includes(d)?"#fff":th.text, background:[10,11,12].includes(d)?"#e87722":"transparent", fontWeight:[10,11,12].includes(d)?700:400 }}>{d}</div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── MOBILE APP ── */}
//       <section style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
//         <div className="ilm-mobile-app-row" style={{ maxWidth:1060, margin:"0 auto" }}>
//           <div style={{ flex:isMobile?undefined:1, minWidth:isMobile?"100%":180, display:"flex", justifyContent:"center" }}>
//             <div style={{ width:180, background:"#1a1a2e", borderRadius:28, padding:8, boxShadow:"0 16px 50px rgba(0,0,0,0.18)" }}>
//               <div style={{ background:"#fafaf8", borderRadius:22, overflow:"hidden" }}>
//                 <div style={{ background:"#1a1a2e", padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                   <span style={{ color:"#fff", fontSize:"0.7rem", fontWeight:600 }}>9:41</span>
//                   <span style={{ color:"#fff", fontSize:"0.6rem" }}>●●●</span>
//                 </div>
//                 <div style={{ padding:11 }}>
//                   <Logo size="0.85rem" variant="dark"/>
//                   <div style={{ fontSize:"0.46rem", color:"#aaa", textAlign:"center", marginBottom:7 }}>ilmora.texora.ai</div>
//                   <div style={{ background:"#fff", borderRadius:8, padding:9, marginBottom:7, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
//                     <div style={{ fontSize:"0.68rem", fontWeight:700, color:"#1a1a2e", marginBottom:3 }}>Free Demo Session</div>
//                     <div style={{ display:"inline-flex", alignItems:"center", gap:3, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:7, padding:"2px 6px", fontSize:"0.54rem", fontWeight:600, marginBottom:4 }}><Clock size={8}/> 30 min</div>
//                     {[[<User size={8}/>, "Vikash Sharma"],[<Video size={8}/>, "Google Meet"],[<MapPin size={8}/>, "Online"]].map(([ic,txt],i)=>(
//                       <div key={i} style={{ fontSize:"0.58rem", color:"#666", marginBottom:2, display:"flex", alignItems:"center", gap:4 }}>{ic}{txt}</div>
//                     ))}
//                   </div>
//                   <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, fontSize:"0.48rem", color:"#555", textAlign:"center" }}>
//                     {["M","T","W","T","F","S","S"].map((d,i)=><span key={i}>{d}</span>)}
//                     {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((d,i)=>(
//                       <span key={i} style={{ background:d===10?"#e87722":"transparent", color:d===10?"#fff":"inherit", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", width:13, height:13, margin:"0 auto", fontWeight:d===10?700:400 }}>{d}</span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//             <SectionTag>Mobile App</SectionTag>
//             <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>Access your Learning from Anywhere</h2>
//             <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Learn on-the-go with your mentors and sessions with our mobile app available on App Store and Play Store.</p>
//             <div className="ilm-app-btns" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
//               {[{icon:<Apple size={22}/>,small:"Download on the",big:"App Store"},{icon:<Play size={22}/>,small:"GET IT ON",big:"Google Play"}].map((b,i)=>(
//                 <a key={i} href="#" style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 18px", background:"#1a1a2e", color:"#fff", borderRadius:10, textDecoration:"none", transition:"all 0.2s" }}
//                   onMouseOver={e=>{e.currentTarget.style.background="#e87722";e.currentTarget.style.transform="translateY(-2px)";}}
//                   onMouseOut={e=>{e.currentTarget.style.background="#1a1a2e";e.currentTarget.style.transform="";}}>
//                   {b.icon}
//                   <div style={{ lineHeight:1.3 }}>
//                     <span style={{ fontSize:"0.57rem", opacity:0.65, display:"block" }}>{b.small}</span>
//                     <span style={{ fontSize:"0.82rem", fontWeight:700, display:"block" }}>{b.big}</span>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── CTA BANNER ── */}
//       <section style={{ ...spStyle, background:"linear-gradient(135deg,#1a1a2e 0%,#2a2a4e 100%)", textAlign:"center", position:"relative", overflow:"hidden" }} className="ilm-section-px">
//         <h2 className="ilm-cta-h2" style={{ fontWeight:700, color:"#fff", marginBottom:10, position:"relative", zIndex:1 }}>Easy access for easy learning</h2>
//         <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.92rem", marginBottom:26, position:"relative", zIndex:1 }}>Start your free 14-Day premium plan. Free Forever Plan also available.</p>
//         <div className="ilm-cta-btns" style={{ position:"relative", zIndex:1 }}>
//           <button onClick={()=>setBookingOpen(true)} style={{ padding:"13px 26px", background:"#fff", color:"#1a1a2e", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif" }}>
//             <Calendar size={15}/> Book Free Demo
//           </button>
//           <button onClick={()=>setAuthMode("signup")} style={{ padding:"13px 26px", background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,0.35)", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
//             Start Free Trial →
//           </button>
//         </div>
//       </section>

//       {/* ── REVIEWS ── */}
//       <section id="success" style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
//         <div style={{ textAlign:"center", maxWidth:540, margin:"0 auto 32px" }}>
//           <SectionTag>Student Stories</SectionTag>
//           <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>See What Our <span style={{ color:th.orange }}>Students Say</span></h2>
//         </div>
//         <div className="ilm-reviews-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
//           {REVIEWS.map((r,i)=>(
//             <div key={i} className="card-hover" style={{ background:th.white, border:`1px solid ${th.border}`, borderRadius:14, padding:"20px" }}>
//               <div style={{ color:"#e87722", fontSize:"0.85rem", marginBottom:10 }}>★★★★★</div>
//               <p style={{ fontSize:"0.82rem", color:th.text, lineHeight:1.65, marginBottom:14, fontStyle:"italic" }}>"{r.text}"</p>
//               <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                 <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#e87722,#1a1a2e)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.8rem", flexShrink:0 }}>{r.initials}</div>
//                 <div>
//                   <div style={{ fontSize:"0.82rem", fontWeight:700, color:th.dark }}>{r.name}</div>
//                   <div style={{ fontSize:"0.7rem", color:th.muted }}>{r.role}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── ABOUT ── */}
//       <section id="careers" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
//         <div className="ilm-about-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
//           <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//             <SectionTag>About ILM ORA</SectionTag>
//             <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, lineHeight:1.2, marginBottom:10 }}>Ready to start your learning in <span style={{ color:th.orange }}>one simple click.</span></h2>
//             <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Start your free 14-Day premium plan. ILM ORA is India's most trusted advanced learning platform for modern professionals.</p>
//             <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
//               <button onClick={()=>setBookingOpen(true)} style={{ padding:"13px 22px", background:"#1a1a2e", color:"#fff", borderRadius:10, border:"none", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif" }}>
//                 <Calendar size={15}/> Book a Free Demo
//               </button>
//               <button onClick={()=>scrollTo("#courses")} style={{ padding:"13px 22px", background:"transparent", color:th.dark, border:`2px solid ${th.dark}`, borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
//                 See All Courses
//               </button>
//             </div>
//           </div>
//           <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
//             <div className="ilm-about-stats">
//               {[{num:"10k+",label:"Worldwide Learners"},{num:"98%",label:"Placement Rate"},{num:"50+",label:"Expert Mentors"},{num:"4+",label:"Career Tracks"}].map((s,i)=>(
//                 <div key={i} className="card-hover" style={{ background:th.bg, borderRadius:14, padding:"18px", border:`1px solid ${th.border}`, textAlign:"center" }}
//                   onMouseOver={e=>e.currentTarget.style.borderColor="#e87722"}
//                   onMouseOut={e=>e.currentTarget.style.borderColor=th.border}>
//                   <div style={{ fontSize:"1.7rem", fontWeight:800, color:"#e87722" }}>{s.num}</div>
//                   <div style={{ fontSize:"0.72rem", color:th.muted, marginTop:3 }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer style={{ background:th.footerBg, borderTop:`1px solid ${th.border}` }}>
//         <div style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"36px 4%":"52px 5%" }}>
//           <div className="ilm-footer-grid">
//             <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
//               <h3 style={{ fontSize:"1.7rem", fontWeight:800, lineHeight:1, margin:0 }}>
//                 <span style={{ color:"#16a34a" }}>ILM</span>{" "}<span style={{ color:"#F97316" }}>ORA</span>
//               </h3>
//               <p style={{ fontSize:"0.82rem", color:th.muted, lineHeight:1.7, margin:0 }}>Modern learning platform for ambitious professionals who want to break into product, design and growth roles.</p>
//               <p style={{ fontSize:"0.82rem", color:th.muted, margin:0 }}>📧 <a href="mailto:support@ilmora.com" style={{ color:th.muted, textDecoration:"none" }}
//                 onMouseOver={e=>e.currentTarget.style.color="#F97316"} onMouseOut={e=>e.currentTarget.style.color=th.muted}>support@ilmora.com</a></p>
//               <p style={{ fontSize:"0.82rem", color:th.muted, margin:0 }}>📍 New Delhi, India</p>
//               <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", paddingTop:4 }}>
//                 {[
//                   ["https://www.youtube.com/@Texoraai","#FF0000",'<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'],
//                   ["https://www.linkedin.com/company/ilmora-texoraai/","#0A66C2",'<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'],
//                   ["https://api.whatsapp.com/send?phone=919210970334","#25D366",'<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>'],
//                   ["https://x.com/texoraai","#000",'<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'],
//                 ].map(([href,bg,path],i)=>(
//                   <a key={i} href={href} target="_blank" rel="noreferrer" style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:bg, color:"#fff", textDecoration:"none", transition:"transform 0.2s" }}
//                     onMouseOver={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseOut={e=>e.currentTarget.style.transform=""}>
//                     <svg style={{ width:15, height:15 }} viewBox="0 0 24 24" fill="currentColor" dangerouslySetInnerHTML={{ __html:path }}/>
//                   </a>
//                 ))}
//               </div>
//             </div>
//             <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//               <h4 style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"2px", color:th.footerText, textTransform:"uppercase", margin:0 }}>Programs</h4>
//               {["Product Management","Growth Marketing","UI / UX Design","Full Stack Dev"].map(item=>(
//                 <div key={item} onClick={()=>scrollTo("#courses")} style={{ fontSize:"0.82rem", color:th.muted, cursor:"pointer", transition:"color 0.2s" }}
//                   onMouseOver={e=>e.currentTarget.style.color="#F97316"} onMouseOut={e=>e.currentTarget.style.color=th.muted}>{item}</div>
//               ))}
//             </div>
//             <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//               <h4 style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"2px", color:th.footerText, textTransform:"uppercase", margin:0 }}>Resources</h4>
//               {[["Success Stories","#success"],["Blogs","https://texora.ai/blogs"],["Use Cases","https://texora.ai/use-cases"],["Product Updates","https://texora.ai/product-updates"]].map(([label,href])=>(
//                 <div key={label} onClick={()=>href.startsWith("#")?scrollTo(href):window.open(href,"_blank")} style={{ fontSize:"0.82rem", color:th.muted, cursor:"pointer", transition:"color 0.2s" }}
//                   onMouseOver={e=>e.currentTarget.style.color="#F97316"} onMouseOut={e=>e.currentTarget.style.color=th.muted}>{label}</div>
//               ))}
//             </div>
//             <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//               <h4 style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"2px", color:th.footerText, textTransform:"uppercase", margin:0 }}>Company</h4>
//               {["About Us","Pricing","Privacy Policy","Help Center","FAQ"].map(item=>(
//                 <div key={item} style={{ fontSize:"0.82rem", color:th.muted, cursor:"pointer", transition:"color 0.2s" }}
//                   onMouseOver={e=>e.currentTarget.style.color="#F97316"} onMouseOut={e=>e.currentTarget.style.color=th.muted}>{item}</div>
//               ))}
//             </div>
//           </div>
//           <div style={{ marginTop:28, padding:isMobile?"18px":"22px 26px", background:th.bg, borderRadius:14, border:`1px solid ${th.border}` }}>
//             <div className="ilm-newsletter-row">
//               <div style={{ flex:1, minWidth:200 }}>
//                 <div style={{ fontSize:"0.9rem", fontWeight:700, color:th.dark, marginBottom:4 }}>📬 Newsletter</div>
//                 <div style={{ fontSize:"0.8rem", color:th.muted }}>Get weekly career tips, program updates & exclusive offers.</div>
//               </div>
//               <div style={{ display:"flex", gap:8, flex:1, minWidth:200, width:isMobile?"100%":"auto" }}>
//                 <input type="email" placeholder="your@email.com" style={{ flex:1, minWidth:0, padding:"9px 12px", fontSize:"0.82rem", border:`1px solid ${th.border}`, borderRadius:8, outline:"none", fontFamily:"Poppins, sans-serif", background:th.white, color:th.text }}/>
//                 <button style={{ padding:"9px 16px", background:"#F97316", color:"#fff", fontSize:"0.82rem", fontWeight:600, border:"none", borderRadius:8, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"Poppins, sans-serif" }}
//                   onMouseOver={e=>e.currentTarget.style.background="#ea6c00"} onMouseOut={e=>e.currentTarget.style.background="#F97316"}>
//                   Subscribe
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="ilm-footer-bottom" style={{ borderTop:`1px solid ${th.border}`, marginTop:28, paddingTop:20, fontSize:"0.8rem", color:th.muted }}>
//             <span>© {new Date().getFullYear()} ILM ORA. All rights reserved.</span>
//             <span>Built with ❤️ passion for modern learners</span>
//           </div>
//         </div>
//       </footer>

//       <BookingModal open={bookingOpen} onClose={()=>setBookingOpen(false)}/>
//       <AuthModal mode={authMode} onClose={()=>setAuthMode(null)} onSwitch={m=>setAuthMode(m)}/>
//     </div>
//   );
// }



































import { useState, useEffect, useCallback } from "react";
import {
  Users, Calendar, Link2, CreditCard, Palette,
  Video, Clock, MapPin, User, ChevronLeft, ChevronRight,
  X, Check,
  ArrowRight, Globe, Apple,
  Play, Target, TrendingUp, Code2, Briefcase,
  GraduationCap, Sparkles,
} from "lucide-react";

// ✅ Same shared shell used by every other public page (Careers, ManagerHub,
// About, Pricing, Contact, FAQ, etc). Lives at src/pages/Landing/components/PublicLayout.
// If this file lives somewhere other than alongside Careers.jsx, adjust this path.
import PublicLayout from "../Landing/components/PublicLayout";

// ─── CSS INJECTION ────────────────────────────────────────────────────────
// ✅ ALIGNMENT FIX (same fix as Careers/ManagerHub): everything is scoped
// under `.meet-page` instead of bare `*` / `body` selectors. The old global
// reset (`*,*::before,*::after{margin:0;padding:0;}` + a bare `body{...}`)
// leaked outside this component and stripped margin/padding off
// PublicLayout's navbar and footer — that's what caused the "cut"/misaligned
// look. Scoping it under `.meet-page` keeps this reset local only.
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  .meet-page, .meet-page *, .meet-page *::before, .meet-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .meet-page { overflow-x: hidden; }
  
  /* Responsive helpers */
  .ilm-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .ilm-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .ilm-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
  .ilm-grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
  .ilm-flex-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
  .ilm-flex-col { display: flex; flex-direction: column; gap: 24px; }
  .ilm-nav-links { display: flex; gap: 2px; list-style: none; }
  .ilm-nav-auth { display: flex; gap: 8px; }
  .ilm-hero-widget { display: block; }
  .ilm-widget-sidebar { display: block; }
  .ilm-booking-sidebar { display: flex; }
  .ilm-pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .ilm-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; }
  .ilm-sol-flex { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
  .ilm-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
  .ilm-about-grid { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
  .ilm-about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ilm-feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .ilm-reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .ilm-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .ilm-integ-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
  .ilm-mobile-app-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
  .ilm-footer-bottom { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; }
  .ilm-newsletter-row { display: flex; flex-direction: row; align-items: center; gap: 20px; flex-wrap: wrap; }
  .ilm-howit-row { display: flex; flex-direction: row; gap: 40px; align-items: center; flex-wrap: wrap; }
  .ilm-section-px { padding-left: 5%; padding-right: 5%; }
  .ilm-hero-h1 { font-size: clamp(1.8rem, 4vw, 3.2rem); }
  .ilm-h2 { font-size: clamp(1.4rem, 2.8vw, 2.1rem); }
  .ilm-sol-h3 { font-size: 1.4rem; }
  .ilm-cta-h2 { font-size: clamp(1.4rem, 3vw, 2.2rem); }
  .ilm-tab-show { display: flex; }
  .ilm-tab-hide { display: none; }
  .ilm-hero-btns { flex-direction: row; }
  .ilm-app-btns { flex-direction: row; }
  .ilm-sol-tabs { flex-wrap: wrap; }
  .ilm-mini-card-wrap { flex: 1; min-width: 260px; }

  /* Scrollbar */
  .meet-page ::-webkit-scrollbar { width: 6px; } 
  .meet-page ::-webkit-scrollbar-track { background: transparent; }
  .meet-page ::-webkit-scrollbar-thumb { background: #e87722; border-radius: 3px; }

  /* ── TABLET: 640–1023px ── */
  @media (max-width: 1023px) {
    .ilm-nav-links { display: none; }
    .ilm-pricing-grid { grid-template-columns: repeat(2,1fr); }
    .ilm-footer-grid { grid-template-columns: 1fr 1fr; }
    .ilm-feat-grid { grid-template-columns: repeat(2,1fr); }
    .ilm-reviews-grid { grid-template-columns: repeat(2,1fr); }
    .ilm-widget-sidebar { display: none; }
    .ilm-h2 { font-size: clamp(1.3rem, 2.5vw, 1.8rem); }
    .ilm-sol-h3 { font-size: 1.2rem; }
  }

  /* ── MOBILE: <640px ── */
  @media (max-width: 639px) {
    .ilm-nav-auth { display: none !important; }
    .ilm-hero-widget { display: none !important; }
    .ilm-booking-sidebar { display: none !important; }
    .ilm-pricing-grid { grid-template-columns: 1fr !important; }
    .ilm-footer-grid { grid-template-columns: 1fr !important; }
    .ilm-feat-grid { grid-template-columns: 1fr !important; }
    .ilm-reviews-grid { grid-template-columns: 1fr !important; }
    .ilm-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
    .ilm-flex-row { flex-direction: column !important; }
    .ilm-sol-flex { flex-direction: column !important; }
    .ilm-integ-row { flex-direction: column !important; }
    .ilm-mobile-app-row { flex-direction: column !important; }
    .ilm-about-grid { flex-direction: column !important; }
    .ilm-howit-row { flex-direction: column !important; }
    .ilm-footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
    .ilm-newsletter-row { flex-direction: column !important; }
    .ilm-hero-h1 { font-size: 1.8rem !important; }
    .ilm-h2 { font-size: 1.35rem !important; }
    .ilm-sol-h3 { font-size: 1.05rem !important; }
    .ilm-cta-h2 { font-size: 1.3rem !important; }
    .ilm-section-px { padding-left: 4% !important; padding-right: 4% !important; }
    .ilm-hero-btns { flex-direction: column !important; align-items: center !important; }
    .ilm-app-btns { flex-direction: row !important; flex-wrap: wrap !important; }
    .ilm-mini-card-wrap { min-width: 100% !important; width: 100% !important; }
    .ilm-about-stats { gap: 10px !important; }
  }

  /* Hover lift */
  .card-hover { transition: transform 0.22s, box-shadow 0.22s; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.1); }
  
  /* Booking modal slot row on mobile */
  @media (max-width: 480px) {
    .ilm-slot-col { flex-direction: row !important; flex-wrap: wrap !important; width: 100% !important; }
  }
`;

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ─── WINDOW SIZE ──────────────────────────────────────────────────────────
function useWindowSize() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─── LOGO ─────────────────────────────────────────────────────────────────
const Logo = ({ size = "1.3rem", variant = "dark", onClick }) => (
  <div
    onClick={onClick}
    style={{ display:"inline-flex", alignItems:"center", gap:10, cursor: onClick ? "pointer" : "default", transition:"transform 0.2s" }}
    onMouseOver={e => { if (onClick) e.currentTarget.style.transform = "scale(1.05)"; }}
    onMouseOut={e => { if (onClick) e.currentTarget.style.transform = "scale(1)"; }}
  >
    <div style={{ width:40, height:40, background:"#F97316", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(249,115,22,0.35)", flexShrink:0 }}>
      <Sparkles size={22} color="#fff"/>
    </div>
    <span style={{ fontSize: size, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1, fontFamily: "Georgia, 'Times New Roman', serif", whiteSpace: "nowrap" }}>
      <span style={{ color: variant === "light" ? "#fff" : "#16a34a" }}>ILM</span>
      <span style={{ color: "#F97316", marginLeft: "0.2em" }}>ORA</span>
    </span>
  </div>
);

// ─── THEMES ───────────────────────────────────────────────────────────────
const T = {
  light: {
    bg: "#f5ede0", orange: "#e87722", dark: "#1a1a2e", text: "#2d2d2d",
    muted: "#666", white: "#ffffff", border: "#e8ddd0",
    navBg: "rgba(245,237,224,0.97)",
    heroBg: "linear-gradient(160deg,#f5ede0 0%,#eee4d4 60%,#e8ddd0 100%)",
    cardBg: "#ffffff", statsBg: "#f5ede0", footerBg: "#ffffff", footerText: "#1E293B",
  },
  dark: {
    bg: "#0f0f0f", orange: "#e87722", dark: "#f0f0f0", text: "#e0e0e0",
    muted: "#9ca3af", white: "#1a1a1a", border: "#2a2a2a",
    navBg: "rgba(15,15,15,0.97)",
    heroBg: "linear-gradient(160deg,#0f0f0f 0%,#141414 60%,#1a1a1a 100%)",
    cardBg: "#1a1a1a", statsBg: "#0f0f0f", footerBg: "#111111", footerText: "#e0e0e0",
  },
};

// ─── DATA ─────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const SLOTS = ["09:00 am","09:30 am","10:00 am","10:30 am","11:00 am","11:30 am"];

const STATS = [
  { label: "Increase",  num: "62%",  sub: "Career Advancement" },
  { label: "Faster",    num: "5x",   sub: "Skill Development" },
  { label: "Placement", num: "98%",  sub: "Success Rate" },
  { label: "Students",  num: "10k+", sub: "Enrolled Worldwide" },
];

const FEATURES = [
  { icon: <GraduationCap size={24}/>, title: "Custom Learning Paths",  desc: "Build & personalise your curriculum based on your career goals." },
  { icon: <Users size={24}/>,         title: "Team-Based Learning",     desc: "Join cohort programs or group sessions. Learn through real team dynamics." },
  { icon: <Calendar size={24}/>,      title: "Sync your Calendar",      desc: "Connect Google and Outlook calendars, avoid missed or double-booked sessions." },
  { icon: <Link2 size={24}/>,         title: "Share Learning Links",    desc: "Share your booking link so mentors can schedule with one click." },
  { icon: <CreditCard size={24}/>,    title: "Easy Payments",           desc: "Pay via PayPal, Stripe, or Razorpay. Collect course fees securely." },
  { icon: <Palette size={24}/>,       title: "Easy Customisations",     desc: "Customize your dashboard, colors, and availability to match your workflow." },
];

const SOLUTIONS = [
  { tab: "Product Mgmt", tabIcon: <Target size={13}/>,
    stat: "4.5x", statLabel: "faster career transitions with ILM ORA mentorship",
    title: "Convert Skills Into Career Wins",
    desc: "Create a personalized learning path and build the exact skills employers are looking for. Land PM roles at top companies.",
    card: { title: "Product Management Cohort", dur: "12 Weeks", mentor: "James Edward, PM @ Google", type: "Live Sessions + Recordings" }},
  { tab: "UI/UX Design", tabIcon: <Palette size={13}/>,
    stat: "3.8x", statLabel: "more interviews with a strong ILM ORA design portfolio",
    title: "Design. Prototype. Get Hired.",
    desc: "Master Figma, user research, and design systems with mentors from leading design teams.",
    card: { title: "UI/UX Design Mastery", dur: "10 Weeks", mentor: "Ananya Sharma, Lead Designer", type: "Live + Portfolio Reviews" }},
  { tab: "Growth Mktg", tabIcon: <TrendingUp size={13}/>,
    stat: "5x", statLabel: "salary hike for growth marketers who complete ILM ORA",
    title: "Growth Playbooks That Actually Work",
    desc: "Learn the exact strategies that grew India's biggest startups. Master growth marketing at scale.",
    card: { title: "Growth & Digital Marketing", dur: "8 Weeks", mentor: "Rohit Mehra, Growth Lead", type: "Weekly Live Sessions" }},
  { tab: "Full Stack Dev", tabIcon: <Code2 size={13}/>,
    stat: "92%", statLabel: "of ILM ORA dev graduates get placed within 3 months",
    title: "From Zero to Production-Ready Developer",
    desc: "Build modern web apps with React, Node.js, and cloud tools. Graduate with a live portfolio.",
    card: { title: "Full Stack Development", dur: "16 Weeks", mentor: "Kiran Rao, Senior Engineer", type: "Project-Based Learning" }},
  { tab: "Consultancy", tabIcon: <Briefcase size={13}/>,
    stat: "50+", statLabel: "expert mentors available for personal consultancy",
    title: "Mentorship That Transforms Careers",
    desc: "Get personalized 1:1 consulting from industry veterans. Our mentors have your back every step of the way.",
    card: { title: "1:1 Career Consultancy", dur: "60 min", mentor: "Vikash Sharma, Career Coach", type: "Google Meet / Zoom" }},
];

const REVIEWS = [
  { initials: "AK", name: "Aisha Khan",      role: "Product Manager @ Razorpay", text: "ILM ORA completely transformed my career. I went from marketing executive to PM at a Series B startup within 6 months." },
  { initials: "RS", name: "Rohit Sharma",    role: "UI Designer @ Swiggy",       text: "The UI/UX course is genuinely the best investment I've made. Real projects, real feedback, community that actually helps." },
  { initials: "PV", name: "Priya Verma",     role: "Growth Lead @ Zepto",        text: "The Growth Marketing program blew my expectations. The ROI is incredible. Best platform for any professional." },
  { initials: "MJ", name: "Mohammed Junaid", role: "SWE @ Google",               text: "The 1:1 mentorship sessions alone are worth the entire course fee. My mentor helped me crack Google in 3 weeks." },
  { initials: "SA", name: "Sara Ahmed",      role: "Product Designer @ CRED",    text: "Best platform for anyone serious about a tech career. Real projects, honest feedback, unmatched community support." },
  { initials: "KP", name: "Karan Patel",     role: "Full Stack Dev @ Paytm",     text: "From fresher to full-stack developer in 5 months. Perfectly structured curriculum and super responsive placement team." },
];

const PRICING_PLANS = [
  {
    name: "Free Forever", monthlyPrice: 0, yearlyPrice: 0,
    tagline: "Experience Hassle-Free Meetings with Our Free Plan",
    btnLabel: "Get Started", popular: false,
    features: ["One event with unlimited bookings","Custom embed for your website","Connect one calendar","Basic video conferencing","Team short availability","Contact management","Basic booking customization","Booking confirmation notifications","API access","Calendar block","Different location support","No-Show Tracking","Share ILM ORA link","Booking Limit Controls"],
  },
  {
    name: "Starter", monthlyPrice: 399, yearlyPrice: 299,
    tagline: "Boost Your Productivity with Our Starter Plan",
    btnLabel: "Start Free Trial", popular: false,
    features: ["Unlimited events with unlimited bookings","Multiple calendar support","Group and Collective Events","Secret events","Payment integration","Roles and Permission","Workflows support","Booking notes","Internal Notes","Zapier integration","Advance Priority Links","Multiple Question Options","Zoom video conferencing","Analytics"],
  },
  {
    name: "Pro", monthlyPrice: 599, yearlyPrice: 449,
    tagline: "Unlock Your Team's Full Potential with Our Pro Tools",
    btnLabel: "Start Free Trial", popular: true,
    features: ["Round robin events","Remove watermark","Share Availability","Holiday management","Automated notifications","Multiple webhooks support","24/7 customer support","SSO Integration","Request Feedback","Export Your Bookings","Display Reviews/Stats"],
  },
  {
    name: "Premium", monthlyPrice: 799, yearlyPrice: 599,
    tagline: "For Power Users — Our Premium Offers the Best Features",
    btnLabel: "Start Free Trial", popular: false,
    features: ["Teams","Dedicated booking page","Host selection by attendees","Co-Host support","Routing","Routing response report","Multiple Slot booking","Booking Question API"],
  },
];

// ─── SHARED ───────────────────────────────────────────────────────────────
const SectionTag = ({ children }) => (
  <span style={{ display:"inline-block", background:"rgba(232,119,34,0.12)", color:"#e87722", padding:"5px 14px", borderRadius:50, fontSize:"0.75rem", fontWeight:600, letterSpacing:"0.5px", marginBottom:12 }}>
    {children}
  </span>
);

const MiniCard = ({ title, dur, mentor, type, initials, dark }) => (
  <div style={{ background: dark?"#242424":"#fff", borderRadius:12, padding:18, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
    <div style={{ fontSize:"0.9rem", fontWeight:700, color:dark?"#f0f0f0":"#1a1a2e", marginBottom:8 }}>{title}</div>
    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:20, padding:"3px 10px", fontSize:"0.7rem", fontWeight:600, marginBottom:10 }}>
      <Clock size={11}/> {dur}
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:dark?"#9ca3af":"#555", marginBottom:6 }}>
      <div style={{ width:22, height:22, borderRadius:"50%", background:"#e87722", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.6rem", color:"#fff", fontWeight:700, flexShrink:0 }}>{initials||mentor[0]}</div>
      <span>{mentor}</span>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:dark?"#9ca3af":"#555", marginBottom:4 }}><Video size={12}/><span>{type}</span></div>
    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:dark?"#9ca3af":"#555" }}><MapPin size={12}/><span>Fully Online</span></div>
  </div>
);

// ─── BOOKING MODAL ────────────────────────────────────────────────────────
function BookingModal({ open, onClose }) {
  const [step, setStep] = useState("calendar");
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [successText, setSuccessText] = useState("");
  const w = useWindowSize();
  const isMob = w < 600;

  useEffect(() => { if (open) { setStep("calendar"); setSelectedDate(null); setSelectedSlot(null); } }, [open]);
  if (!open) return null;

  const changeMonth = (dir) => {
    let m = calMonth + dir, y = calYear;
    if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
    setCalMonth(m); setCalYear(y); setSelectedDate(null); setSelectedSlot(null);
  };
  const today = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const selectDate = (d) => { setSelectedDate({ d, m: calMonth, y: calYear }); setSelectedSlot(null); };
  const selectSlot = (slot) => { setSelectedSlot(slot); setTimeout(() => setStep("form"), 280); };
  const formatDate = (sd) => {
    const dn = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return `${dn[new Date(sd.y,sd.m,sd.d).getDay()]}, ${sd.d} ${MONTHS[sd.m]} ${sd.y}`;
  };
  const submit = () => {
    if (!name || !email) { alert("Please fill in name and email."); return; }
    setSuccessText(`📅 ${formatDate(selectedDate)} at ${selectedSlot}`);
    setStep("success");
  };
  const inp = { width:"100%", padding:"10px 13px", border:"1.5px solid #e8ddd0", borderRadius:8, fontFamily:"Poppins, sans-serif", fontSize:"0.85rem", background:"#fafafa", outline:"none", boxSizing:"border-box" };

  return (
    <div onClick={e => e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:isMob?8:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:isMob?"98vw":860, maxHeight:"95vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(90deg,#1a1a2e,#2a2a4e)", padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", color:"#fff", fontSize:"0.76rem", flexShrink:0 }}>
          <span>Powered by <strong>ILM ORA Bookings</strong></span>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={14}/></button>
        </div>
        {/* Body */}
        <div style={{ display:"flex", flex:1, overflow:"hidden", flexDirection:isMob?"column":"row" }}>
          {/* Sidebar — hidden on mobile */}
          <div className="ilm-booking-sidebar" style={{ width:190, padding:"20px 16px", borderRight:"1px solid #f0ece8", flexDirection:"column", gap:10, background:"#fafafa", overflowY:"auto", flexShrink:0 }}>
            <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#1a1a2e,#e87722)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", flexShrink:0 }}>IO</div>
            <Logo size="1rem" variant="dark"/>
            <div style={{ fontSize:"0.9rem", fontWeight:700, color:"#1a1a2e" }}>Free Demo Session</div>
            {[[<Users size={12}/>, "Vikash Sharma"],[<Clock size={12}/>, "30 min"],[<Video size={12}/>, "Google Meet"]].map(([ic,txt],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:7, fontSize:"0.76rem", color:"#555" }}>{ic}<span>{txt}</span></div>
            ))}
          </div>
          {/* Main */}
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            {step==="calendar" && (
              <div style={{ padding:isMob?12:20, display:"flex", gap:14, flex:1, flexDirection:isMob?"column":"row" }}>
                {/* Calendar */}
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <button onClick={()=>changeMonth(-1)} style={{ width:28, height:28, border:"1px solid #e0dbd5", borderRadius:7, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={14}/></button>
                    <div style={{ fontSize:"0.88rem", fontWeight:700, color:"#1a1a2e" }}>{MONTHS[calMonth]} {calYear}</div>
                    <button onClick={()=>changeMonth(1)} style={{ width:28, height:28, border:"1px solid #e0dbd5", borderRadius:7, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={14}/></button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
                    {DAYS_SHORT.map(d=><div key={d} style={{ textAlign:"center", fontSize:"0.66rem", fontWeight:600, color:"#aaa", padding:"4px 0" }}>{d}</div>)}
                    {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
                    {Array(daysInMonth).fill(null).map((_,i)=>{
                      const d=i+1, date=new Date(calYear,calMonth,d);
                      const isPast=date<new Date(today.getFullYear(),today.getMonth(),today.getDate());
                      const isWeekend=[0,6].includes(date.getDay());
                      const isToday=d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear();
                      const isSel=selectedDate&&selectedDate.d===d&&selectedDate.m===calMonth&&selectedDate.y===calYear;
                      const disabled=isPast||isWeekend;
                      return <div key={d} onClick={()=>!disabled&&selectDate(d)} style={{ aspectRatio:1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.76rem", borderRadius:"50%", cursor:disabled?"not-allowed":"pointer", color:disabled?"#ccc":isSel?"#fff":isToday?"#e87722":"#333", background:isSel?"#e87722":"transparent", border:isToday&&!isSel?"1.5px solid #e87722":"none", fontWeight:isSel||isToday?700:400, transition:"all 0.15s" }}>{d}</div>;
                    })}
                  </div>
                  <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:5, fontSize:"0.68rem", color:"#888" }}><Globe size={11}/><span>Asia/Kolkata</span></div>
                </div>
                {/* Slots */}
                <div className="ilm-slot-col" style={{ width:isMob?"100%":125, display:"flex", flexDirection:"column", gap:7 }}>
                  <div style={{ fontSize:"0.7rem", fontWeight:600, color:"#aaa", textAlign:"center", width:"100%" }}>Select slot</div>
                  {selectedDate ? SLOTS.map(slot=>(
                    <button key={slot} onClick={()=>selectSlot(slot)} style={{ flex:isMob?"1 0 28%":"unset", padding:"8px 6px", border:"1.5px solid #e87722", borderRadius:9, background:selectedSlot===slot?"#e87722":"#fff", color:selectedSlot===slot?"#fff":"#e87722", fontSize:"0.75rem", fontWeight:600, cursor:"pointer", fontFamily:"Poppins, sans-serif", transition:"all 0.15s" }}>{slot}</button>
                  )) : <div style={{ fontSize:"0.73rem", color:"#bbb", textAlign:"center", paddingTop:12 }}>← Select a date first</div>}
                </div>
              </div>
            )}
            {step==="form" && (
              <div style={{ padding:isMob?"12px 14px":"20px 26px", display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <button onClick={()=>setStep("calendar")} style={{ width:28, height:28, borderRadius:"50%", border:"1px solid #e0dbd5", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={14}/></button>
                  <span style={{ fontSize:"0.8rem", fontWeight:600, color:"#e87722" }}>{selectedDate&&`${formatDate(selectedDate)}, ${selectedSlot}`}</span>
                </div>
                {[{label:"Name",type:"text",placeholder:"Your full name",val:name,set:setName},{label:"Email",type:"email",placeholder:"you@email.com",val:email,set:setEmail}].map(f=>(
                  <div key={f.label} style={{ marginBottom:12 }}>
                    <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#333", marginBottom:4 }}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={inp}/>
                  </div>
                ))}
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#333", marginBottom:4 }}>Phone Number</label>
                  <div style={{ display:"flex" }}>
                    <div style={{ padding:"10px 11px", border:"1.5px solid #e8ddd0", borderRight:"none", borderRadius:"8px 0 0 8px", background:"#fafafa", fontSize:"0.78rem", color:"#555", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>🇮🇳 +91</div>
                    <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" style={{ ...inp, borderRadius:"0 8px 8px 0" }}/>
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:"#333", marginBottom:4 }}>Message (Optional)</label>
                  <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3} placeholder="Tell us about your goals..." style={{ ...inp, resize:"none" }}/>
                </div>
                <button onClick={submit} style={{ width:"100%", padding:13, background:"#1a1a2e", color:"#fff", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}
                  onMouseOver={e=>e.currentTarget.style.background="#e87722"} onMouseOut={e=>e.currentTarget.style.background="#1a1a2e"}>
                  Schedule Meeting
                </button>
              </div>
            )}
            {step==="success" && (
              <div style={{ padding:"36px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center" }}>
                <div style={{ fontSize:"3rem", marginBottom:12 }}>🎉</div>
                <div style={{ fontSize:"1.15rem", fontWeight:800, color:"#1a1a2e", marginBottom:8 }}>Demo Booked Successfully!</div>
                <div style={{ background:"rgba(232,119,34,0.1)", color:"#e87722", padding:"9px 22px", borderRadius:50, fontSize:"0.8rem", fontWeight:600, marginBottom:14 }}>{successText}</div>
                <div style={{ fontSize:"0.82rem", color:"#888", marginBottom:22, lineHeight:1.7 }}>You'll receive a confirmation email with the Google Meet link shortly.</div>
                <button onClick={onClose} style={{ maxWidth:200, width:"100%", padding:13, background:"#1a1a2e", color:"#fff", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>Done ✓</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onSwitch }) {
  const isSign = mode==="signin", isEnroll = mode==="enroll";
  if (!mode) return null;
  const inp = { width:"100%", padding:"10px 13px", border:"1.5px solid #e8ddd0", borderRadius:8, fontFamily:"Poppins, sans-serif", fontSize:"0.85rem", background:"#f5ede0", outline:"none", boxSizing:"border-box" };
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ display:"flex", position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:2000, alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:18, padding:"26px 22px", maxWidth:420, width:"100%", position:"relative", maxHeight:"95vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"#f5ede0", border:"none", borderRadius:8, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={15}/></button>
        <h3 style={{ fontSize:"1.2rem", fontWeight:800, color:"#1a1a2e", marginBottom:6 }}>{isSign?"Welcome Back 👋":isEnroll?"Enroll Now 🎓":"Get Started Free ✦"}</h3>
        <p style={{ color:"#666", fontSize:"0.82rem", marginBottom:18 }}>{isSign?"Sign in to your ILM ORA account":isEnroll?"Secure your spot in our next cohort":"Join 10,000+ learners on ILM ORA"}</p>
        {!isSign&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Full Name</label><input type="text" placeholder="Your full name" style={inp}/></div>}
        <div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Email Address</label><input type="email" placeholder="you@email.com" style={inp}/></div>
        {isSign&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Password</label><input type="password" placeholder="••••••••" style={inp}/></div>}
        {(mode==="signup"||isEnroll)&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Phone Number</label><input type="tel" placeholder="+91 98765 43210" style={inp}/></div>}
        {mode==="signup"&&<div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:"0.76rem", fontWeight:600, marginBottom:4 }}>Interested In</label><select style={inp}><option>Product Management</option><option>UI/UX Design</option><option>Growth & Marketing</option><option>Full Stack Development</option></select></div>}
        <button onClick={onClose} style={{ width:"100%", padding:12, background:"#1a1a2e", color:"#fff", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
          {isSign?"Sign In":isEnroll?"Reserve My Seat →":"Create Free Account"}
        </button>
        {!isEnroll&&<p style={{ textAlign:"center", marginTop:12, fontSize:"0.76rem", color:"#666" }}>{isSign?"Don't have an account? ":"Already have an account? "}<span onClick={()=>onSwitch(isSign?"signup":"signin")} style={{ color:"#e87722", fontWeight:600, cursor:"pointer" }}>{isSign?"Sign Up":"Sign In"}</span></p>}
      </div>
    </div>
  );
}

// ─── PRICING SECTION ──────────────────────────────────────────────────────
function PricingSection({ th, setAuthMode }) {
  const [billing, setBilling] = useState("monthly");
  return (
    <section id="pricing" style={{ padding:"56px 0", background:th.bg }}>
      <div className="ilm-section-px" style={{ maxWidth:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <SectionTag>Pricing Plans</SectionTag>
          <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:14 }}>
            Choose the Perfect Plan for <span style={{ color:th.orange }}>Your Needs</span>
          </h2>
          <div style={{ display:"inline-flex", alignItems:"center", background:th.white, border:`1px solid ${th.border}`, borderRadius:50, padding:4, marginBottom:8 }}>
            {["monthly","yearly"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{ padding:"8px 22px", borderRadius:50, border:"none", cursor:"pointer", fontFamily:"Poppins, sans-serif", fontSize:"0.84rem", fontWeight:600, background:billing===b?"#1a1a2e":"transparent", color:billing===b?"#fff":th.muted, transition:"all 0.2s" }}>
                {b==="monthly"?"Monthly":"Yearly"}
              </button>
            ))}
          </div>
          {billing==="yearly"&&<div style={{ fontSize:"0.78rem", color:"#16a34a", fontWeight:600 }}>🎉 2 Months Free on Yearly Plans!</div>}
        </div>
        <div className="ilm-pricing-grid" style={{ maxWidth:1100, margin:"0 auto" }}>
          {PRICING_PLANS.map((plan,i)=>{
            const price = billing==="yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div key={i} className="card-hover" style={{ background:plan.popular?"#1a1a2e":th.white, borderRadius:16, padding:"22px 18px", border:plan.popular?"2px solid #e87722":`1px solid ${th.border}`, position:"relative", boxShadow:plan.popular?"0 16px 48px rgba(232,119,34,0.15)":"none" }}>
                {plan.popular&&<div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"#e87722", color:"#fff", fontSize:"0.68rem", fontWeight:700, padding:"4px 14px", borderRadius:50, whiteSpace:"nowrap" }}>⭐ Most Popular</div>}
                <div style={{ fontSize:"0.97rem", fontWeight:700, color:plan.popular?"#fff":th.dark, marginBottom:4 }}>{plan.name}</div>
                <div style={{ fontSize:"0.73rem", color:plan.popular?"rgba(255,255,255,0.5)":th.muted, marginBottom:14, lineHeight:1.5 }}>{plan.tagline}</div>
                <div style={{ marginBottom:16 }}>
                  {price===0
                    ? <div style={{ fontSize:"1.9rem", fontWeight:800, color:plan.popular?"#fff":th.dark }}>Free</div>
                    : <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
                        <span style={{ fontSize:"0.83rem", fontWeight:600, color:plan.popular?"rgba(255,255,255,0.55)":th.muted }}>₹</span>
                        <span style={{ fontSize:"1.9rem", fontWeight:800, color:plan.popular?"#e87722":th.dark }}>{price.toLocaleString()}</span>
                        <span style={{ fontSize:"0.73rem", color:plan.popular?"rgba(255,255,255,0.4)":th.muted }}>/mo</span>
                      </div>
                  }
                  {billing==="yearly"&&price>0&&<div style={{ fontSize:"0.68rem", color:plan.popular?"rgba(255,255,255,0.4)":th.muted, marginTop:2 }}>Billed ₹{(price*12).toLocaleString()}/year</div>}
                </div>
                <button onClick={()=>setAuthMode("signup")} style={{ width:"100%", padding:"10px 0", borderRadius:10, fontSize:"0.85rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", marginBottom:16, transition:"all 0.2s", background:plan.popular?"#e87722":"transparent", color:plan.popular?"#fff":th.dark, border:plan.popular?"none":`2px solid ${th.dark}` }}
                  onMouseOver={e=>{e.currentTarget.style.background=plan.popular?"#d06a1a":th.dark;e.currentTarget.style.color="#fff";}}
                  onMouseOut={e=>{e.currentTarget.style.background=plan.popular?"#e87722":"transparent";e.currentTarget.style.color=plan.popular?"#fff":th.dark;}}>
                  {plan.btnLabel}
                </button>
                <div style={{ borderTop:`1px solid ${plan.popular?"rgba(255,255,255,0.1)":th.border}`, marginBottom:12 }}/>
                <div style={{ fontSize:"0.7rem", fontWeight:600, color:plan.popular?"rgba(255,255,255,0.4)":th.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  {i===0?"Key Features":`Everything in ${PRICING_PLANS[i-1].name} plus:`}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {plan.features.map((f,fi)=>(
                    <div key={fi} style={{ display:"flex", alignItems:"flex-start", gap:7, fontSize:"0.76rem", color:plan.popular?"rgba(255,255,255,0.78)":th.text }}>
                      <div style={{ width:15, height:15, borderRadius:"50%", background:plan.popular?"rgba(232,119,34,0.3)":"rgba(22,163,74,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        <Check size={9} color={plan.popular?"#e87722":"#16a34a"}/>
                      </div>
                      <span style={{ lineHeight:1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* Enterprise */}
        <div style={{ maxWidth:1100, margin:"24px auto 0", background:"linear-gradient(135deg,#1a1a2e,#2a2a4e)", borderRadius:16, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ fontSize:"1.05rem", fontWeight:700, color:"#fff", marginBottom:4 }}>Let's Build Tailored Enterprise Plan</div>
            <div style={{ fontSize:"0.81rem", color:"rgba(255,255,255,0.52)" }}>Custom pricing, dedicated support, SSO, and advanced security for large teams.</div>
          </div>
          <button style={{ padding:"12px 22px", background:"#e87722", color:"#fff", border:"none", borderRadius:10, fontSize:"0.88rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", whiteSpace:"nowrap" }}
            onMouseOver={e=>e.currentTarget.style.background="#d06a1a"} onMouseOut={e=>e.currentTarget.style.background="#e87722"}>
            Contact Sales →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────
export default function ILMORAMeet({
  theme = "light",
  toggleTheme,
  setShowLoginModal,
  scrollToSection,
}) {
  const dark = theme === "dark";
  const [authMode, setAuthMode] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeSol, setActiveSol] = useState(0);
  const w = useWindowSize();
  const isMobile = w < 640;
  const th = dark ? T.dark : T.light;

  const scrollTo = useCallback((id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior:"smooth" });
  }, []);

  const SP = "56px 0";
  const spStyle = { padding: SP };

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
      <div className="meet-page" style={{ fontFamily:"Poppins, sans-serif", background:th.bg, color:th.text, minWidth:320, width:"100%" }}>
        <StyleInjector/>

        {/* ── HERO ── */}
        <section style={{ paddingTop:44, paddingBottom:isMobile?32:44, paddingLeft:"5%", paddingRight:"5%", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", background:th.heroBg, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,119,34,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ maxWidth:700, width:"100%", margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:50, padding:"5px 14px", fontSize:"0.73rem", fontWeight:600, marginBottom:16, border:"1px solid rgba(232,119,34,0.2)" }}>
              🚀 India's #1 Career Learning Platform
            </div>
            <h1 className="ilm-hero-h1" style={{ fontWeight:700, lineHeight:1.18, color:th.dark, marginBottom:14, letterSpacing:"-0.3px" }}>
              Easy learning platform for <span style={{ color:th.orange, fontWeight:800 }}>everyone</span>
            </h1>
            <p style={{ fontSize:isMobile?"0.88rem":"0.97rem", color:th.muted, lineHeight:1.75, marginBottom:28, maxWidth:520, margin:"0 auto 28px" }}>
              Eliminate the hassle of managing your career growth with an advanced platform that takes care of everything for you.
            </p>
            <div className="ilm-hero-btns" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:isMobile?24:40 }}>
              <button onClick={()=>setBookingOpen(true)} style={{ padding:isMobile?"12px 22px":"13px 28px", background:th.dark, color:dark?"#0f0f0f":"#fff", borderRadius:10, border:"none", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif", width:isMobile?"100%":"auto", justifyContent:"center" }}>
                <Calendar size={16}/> Book Free Demo
              </button>
              <button onClick={()=>scrollTo("#courses")} style={{ padding:isMobile?"12px 22px":"13px 28px", background:"transparent", color:th.dark, border:`2px solid ${th.dark}`, borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif", width:isMobile?"100%":"auto" }}>
                Explore Courses
              </button>
            </div>
          </div>
          {/* Widget Preview — hidden on mobile */}
          <div className="ilm-hero-widget" style={{ width:"100%", maxWidth:640, margin:"0 auto", background:"#fff", borderRadius:14, boxShadow:"0 16px 60px rgba(0,0,0,0.12)", overflow:"hidden", border:"1px solid #e8ddd0" }}>
            <div style={{ background:"linear-gradient(90deg,#1a1a2e,#2a2a4e)", padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.7rem" }}>←</span>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.7rem" }}>Powered by <strong style={{ color:"#fff" }}>ILM ORA</strong></span>
              <span/>
            </div>
            <div style={{ display:"flex", minHeight:180 }}>
              <div className="ilm-widget-sidebar" style={{ background:"#fafaf8", borderRight:"1px solid #f0ece8", padding:16, width:155, flexShrink:0, flexDirection:"column", gap:6 }}>
                <Logo size="1rem" variant="dark"/>
                <div style={{ fontSize:"0.58rem", color:"#aaa", marginBottom:4 }}>ilmora.texora.ai</div>
                <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#1a1a2e", marginBottom:6 }}>Free Demo Session</div>
                {[[<Clock size={10}/>, "30 min"],[<Video size={10}/>, "Google Meet"],[<User size={10}/>, "Vikash Sharma"]].map(([ic,txt],i)=>(
                  <div key={i} style={{ fontSize:"0.66rem", color:"#888", marginBottom:3, display:"flex", alignItems:"center", gap:5 }}>{ic}{txt}</div>
                ))}
              </div>
              <div style={{ flex:1, padding:14 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ width:22, height:22, border:"1px solid #e0dbd5", borderRadius:6, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={12}/></div>
                  <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#1a1a2e" }}>June 2026</div>
                  <div style={{ width:22, height:22, border:"1px solid #e0dbd5", borderRadius:6, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={12}/></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, fontSize:"0.65rem" }}>
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{ textAlign:"center", color:"#aaa", fontWeight:600, padding:"2px 0" }}>{d}</div>)}
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((d,i)=>{
                    const wknd=[0,6].includes(i%7), sel=d===11;
                    return <div key={d} style={{ textAlign:"center", padding:"4px 2px", borderRadius:"50%", color:wknd?"#ddd":sel?"#fff":"#555", background:sel?"#e87722":"transparent", fontWeight:sel?700:400 }}>{d}</div>;
                  })}
                </div>
              </div>
              <div style={{ padding:"14px 10px", width:100, flexShrink:0, borderLeft:"1px solid #f0ece8" }}>
                <div style={{ fontSize:"0.63rem", color:"#aaa", fontWeight:600, marginBottom:7, textAlign:"center" }}>Select slot</div>
                {["09:00 am","09:30 am","10:00 am","10:30 am","11:00 am"].map((s,i)=>(
                  <div key={s} style={{ padding:"5px 6px", border:"1.5px solid #e87722", borderRadius:7, color:i===0?"#fff":"#e87722", background:i===0?"#e87722":"transparent", fontSize:"0.66rem", fontWeight:600, textAlign:"center", marginBottom:5, cursor:"pointer" }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ ...spStyle, background:th.statsBg, textAlign:"center" }} className="ilm-section-px">
          <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:24 }}>ILM ORA Helps You Achieve</h2>
          <div className="ilm-stats-grid" style={{ maxWidth:860, margin:"0 auto" }}>
            {STATS.map((s,i)=>(
              <div key={i} style={{ background:"linear-gradient(135deg,#1a1a2e,#2a2a4e)", borderRadius:14, padding:"20px 14px", color:"#fff" }}>
                <div style={{ fontSize:"0.7rem", fontWeight:500, opacity:0.65, marginBottom:5 }}>{s.label}</div>
                <div style={{ fontSize:"2rem", fontWeight:800, color:"#e87722", marginBottom:3 }}>{s.num}</div>
                <div style={{ fontSize:"0.68rem", opacity:0.55 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="mentors" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <SectionTag>HOW IT WORKS</SectionTag>
            <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Start your learning in <span style={{ color:th.orange }}>3 simple steps</span></h2>
          </div>
          <div className="ilm-howit-row" style={{ maxWidth:1060, margin:"0 auto" }}>
            <div style={{ flex:1, minWidth:isMobile?"100%":280, display:"flex", flexDirection:"column", gap:26 }}>
              {[{n:"1",title:"Enroll in a Program",desc:"Choose your course and create your personalized learning path with expert guidance."},
                {n:"2",title:"Set Your Schedule",desc:"Set your learning time at your convenience. Book 1:1 mentor sessions anytime."},
                {n:"3",title:"Learn & Get Hired",desc:"Complete projects, ace mock interviews and land your dream job with placement support."},
              ].map((s,i,arr)=>(
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ position:"relative" }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:"#e87722", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1rem", flexShrink:0 }}>{s.n}</div>
                    {i<arr.length-1&&<div style={{ position:"absolute", left:18, top:38, bottom:-26, width:2, background:"linear-gradient(to bottom,#e87722,transparent)" }}/>}
                  </div>
                  <div>
                    <h4 style={{ fontSize:"0.96rem", fontWeight:700, color:th.dark, marginBottom:4 }}>{s.title}</h4>
                    <p style={{ fontSize:"0.83rem", color:th.muted, lineHeight:1.65 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ilm-mini-card-wrap" style={{ background:th.bg, borderRadius:16, padding:20, border:`1px solid ${th.border}` }}>
              <MiniCard title="Free Demo Session" dur="30 min" mentor="Vikash Sharma, Mentor" type="Google Meet" initials="VS" dark={dark}/>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <SectionTag>GET YOUR HANDS ON</SectionTag>
            <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Features of our <span style={{ color:th.orange }}>Platform</span></h2>
          </div>
          <div className="ilm-feat-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="card-hover" style={{ background:th.white, borderRadius:14, padding:"20px", border:`1px solid ${th.border}`, cursor:"default" }}
                onMouseOver={e=>e.currentTarget.style.borderColor="#e87722"}
                onMouseOut={e=>e.currentTarget.style.borderColor=th.border}>
                <div style={{ width:46, height:46, borderRadius:11, background:th.bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, border:`1px solid ${th.border}`, color:"#e87722" }}>{f.icon}</div>
                <h4 style={{ fontSize:"0.95rem", fontWeight:700, color:th.dark, marginBottom:7 }}>{f.title}</h4>
                <p style={{ fontSize:"0.82rem", color:th.muted, lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SOLUTIONS ── */}
        <section id="courses" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
          <div style={{ textAlign:"center", marginBottom:26 }}>
            <SectionTag>Build For Your Business</SectionTag>
            <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>Optimised learning for <span style={{ color:th.orange }}>all type of goals</span></h2>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:28 }}>
            {SOLUTIONS.map((s,i)=>(
              <button key={i} onClick={()=>setActiveSol(i)} style={{ display:"flex", alignItems:"center", gap:5, padding:isMobile?"6px 12px":"8px 18px", border:`1.5px solid ${i===activeSol?"#e87722":th.border}`, borderRadius:50, background:i===activeSol?"rgba(232,119,34,0.08)":th.cardBg, cursor:"pointer", fontSize:isMobile?"0.73rem":"0.8rem", fontWeight:600, color:i===activeSol?th.dark:th.muted, transition:"all 0.2s", fontFamily:"Poppins, sans-serif" }}>
                {s.tabIcon} {s.tab}
              </button>
            ))}
          </div>
          {SOLUTIONS.map((s,i)=>i===activeSol&&(
            <div key={i} className="ilm-sol-flex" style={{ maxWidth:1060, margin:"0 auto" }}>
              <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
                <h3 className="ilm-sol-h3" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>{s.title}</h3>
                <p style={{ color:th.muted, lineHeight:1.75, marginBottom:14 }}>{s.desc}</p>
                <div style={{ fontSize:"1.7rem", fontWeight:800, color:th.orange, marginBottom:3 }}>{s.stat}</div>
                <div style={{ fontSize:"0.8rem", color:th.muted, marginBottom:16 }}>{s.statLabel}</div>
                <button onClick={()=>i===4?setBookingOpen(true):setAuthMode("enroll")} style={{ color:th.orange, fontSize:"0.85rem", fontWeight:600, background:"none", border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5, fontFamily:"Poppins, sans-serif" }}>
                  {i===4?"Book a Session":"Enroll Now"} <ArrowRight size={14}/>
                </button>
              </div>
              <div className="ilm-mini-card-wrap" style={{ background:th.bg, borderRadius:14, padding:18, border:`1px solid ${th.border}` }}>
                <MiniCard {...s.card} initials={s.card.mentor[0]} dark={dark}/>
              </div>
            </div>
          ))}
        </section>

        {/* ── PRICING ── */}
        <PricingSection th={th} setAuthMode={setAuthMode}/>

        {/* ── INTEGRATIONS ── */}
        <section style={{ ...spStyle, background:th.white }} className="ilm-section-px">
          <div className="ilm-integ-row" style={{ maxWidth:1060, margin:"0 auto" }}>
            <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
              <SectionTag>Integrations</SectionTag>
              <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>Integrate your favourite calendar</h2>
              <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Integrate Zoom, Google Meet, and MS Teams seamlessly for hassle-free sessions.</p>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                {[[<Video size={14}/>, "Zoom"],[<Video size={14}/>, "Google Meet"],[<Briefcase size={14}/>, "MS Teams"]].map(([ic,name],i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", background:th.bg, border:`1px solid ${th.border}`, borderRadius:50, fontSize:"0.8rem", fontWeight:600, color:th.dark }}>
                    <span style={{ color:"#e87722" }}>{ic}</span> {name}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex:1, minWidth:isMobile?"100%":260, background:th.white, borderRadius:14, padding:18, boxShadow:dark?"none":"0 6px 30px rgba(0,0,0,0.07)", border:`1px solid ${th.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontSize:"0.85rem", fontWeight:700, color:th.dark }}>June 2026</div>
                <div style={{ display:"flex", gap:6 }}>
                  {[<ChevronLeft size={12}/>,<ChevronRight size={12}/>].map((ic,i)=>(
                    <span key={i} style={{ width:24, height:24, border:`1px solid ${th.border}`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:th.muted }}>{ic}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, fontSize:"0.7rem" }}>
                {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} style={{ textAlign:"center", color:"#aaa", fontWeight:600, padding:"3px 0" }}>{d}</div>)}
                {[2,3,4,5,6,7,1,9,10,11,12,13,14,8,16,17,18,19,20,21,15,23,24,25,26,27,28,22,30].map((d,i)=>(
                  <div key={i} style={{ textAlign:"center", padding:"4px 2px", borderRadius:"50%", cursor:"pointer", color:[10,11,12].includes(d)?"#fff":th.text, background:[10,11,12].includes(d)?"#e87722":"transparent", fontWeight:[10,11,12].includes(d)?700:400 }}>{d}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MOBILE APP ── */}
        <section style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
          <div className="ilm-mobile-app-row" style={{ maxWidth:1060, margin:"0 auto" }}>
            <div style={{ flex:isMobile?undefined:1, minWidth:isMobile?"100%":180, display:"flex", justifyContent:"center" }}>
              <div style={{ width:180, background:"#1a1a2e", borderRadius:28, padding:8, boxShadow:"0 16px 50px rgba(0,0,0,0.18)" }}>
                <div style={{ background:"#fafaf8", borderRadius:22, overflow:"hidden" }}>
                  <div style={{ background:"#1a1a2e", padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ color:"#fff", fontSize:"0.7rem", fontWeight:600 }}>9:41</span>
                    <span style={{ color:"#fff", fontSize:"0.6rem" }}>●●●</span>
                  </div>
                  <div style={{ padding:11 }}>
                    <Logo size="0.85rem" variant="dark"/>
                    <div style={{ fontSize:"0.46rem", color:"#aaa", textAlign:"center", marginBottom:7 }}>ilmora.texora.ai</div>
                    <div style={{ background:"#fff", borderRadius:8, padding:9, marginBottom:7, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize:"0.68rem", fontWeight:700, color:"#1a1a2e", marginBottom:3 }}>Free Demo Session</div>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:3, background:"rgba(232,119,34,0.1)", color:"#e87722", borderRadius:7, padding:"2px 6px", fontSize:"0.54rem", fontWeight:600, marginBottom:4 }}><Clock size={8}/> 30 min</div>
                      {[[<User size={8}/>, "Vikash Sharma"],[<Video size={8}/>, "Google Meet"],[<MapPin size={8}/>, "Online"]].map(([ic,txt],i)=>(
                        <div key={i} style={{ fontSize:"0.58rem", color:"#666", marginBottom:2, display:"flex", alignItems:"center", gap:4 }}>{ic}{txt}</div>
                      ))}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, fontSize:"0.48rem", color:"#555", textAlign:"center" }}>
                      {["M","T","W","T","F","S","S"].map((d,i)=><span key={i}>{d}</span>)}
                      {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((d,i)=>(
                        <span key={i} style={{ background:d===10?"#e87722":"transparent", color:d===10?"#fff":"inherit", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", width:13, height:13, margin:"0 auto", fontWeight:d===10?700:400 }}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
              <SectionTag>Mobile App</SectionTag>
              <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, marginBottom:12 }}>Access your Learning from Anywhere</h2>
              <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Learn on-the-go with your mentors and sessions with our mobile app available on App Store and Play Store.</p>
              <div className="ilm-app-btns" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[{icon:<Apple size={22}/>,small:"Download on the",big:"App Store"},{icon:<Play size={22}/>,small:"GET IT ON",big:"Google Play"}].map((b,i)=>(
                  <a key={i} href="#" style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 18px", background:"#1a1a2e", color:"#fff", borderRadius:10, textDecoration:"none", transition:"all 0.2s" }}
                    onMouseOver={e=>{e.currentTarget.style.background="#e87722";e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseOut={e=>{e.currentTarget.style.background="#1a1a2e";e.currentTarget.style.transform="";}}>
                    {b.icon}
                    <div style={{ lineHeight:1.3 }}>
                      <span style={{ fontSize:"0.57rem", opacity:0.65, display:"block" }}>{b.small}</span>
                      <span style={{ fontSize:"0.82rem", fontWeight:700, display:"block" }}>{b.big}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ ...spStyle, background:"linear-gradient(135deg,#1a1a2e 0%,#2a2a4e 100%)", textAlign:"center", position:"relative", overflow:"hidden" }} className="ilm-section-px">
          <h2 className="ilm-cta-h2" style={{ fontWeight:700, color:"#fff", marginBottom:10, position:"relative", zIndex:1 }}>Easy access for easy learning</h2>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.92rem", marginBottom:26, position:"relative", zIndex:1 }}>Start your free 14-Day premium plan. Free Forever Plan also available.</p>
          <div className="ilm-cta-btns" style={{ position:"relative", zIndex:1 }}>
            <button onClick={()=>setBookingOpen(true)} style={{ padding:"13px 26px", background:"#fff", color:"#1a1a2e", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif" }}>
              <Calendar size={15}/> Book Free Demo
            </button>
            <button onClick={()=>setAuthMode("signup")} style={{ padding:"13px 26px", background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,0.35)", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
              Start Free Trial →
            </button>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section id="success" style={{ ...spStyle, background:th.bg }} className="ilm-section-px">
          <div style={{ textAlign:"center", maxWidth:540, margin:"0 auto 32px" }}>
            <SectionTag>Student Stories</SectionTag>
            <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark }}>See What Our <span style={{ color:th.orange }}>Students Say</span></h2>
          </div>
          <div className="ilm-reviews-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
            {REVIEWS.map((r,i)=>(
              <div key={i} className="card-hover" style={{ background:th.white, border:`1px solid ${th.border}`, borderRadius:14, padding:"20px" }}>
                <div style={{ color:"#e87722", fontSize:"0.85rem", marginBottom:10 }}>★★★★★</div>
                <p style={{ fontSize:"0.82rem", color:th.text, lineHeight:1.65, marginBottom:14, fontStyle:"italic" }}>"{r.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#e87722,#1a1a2e)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.8rem", flexShrink:0 }}>{r.initials}</div>
                  <div>
                    <div style={{ fontSize:"0.82rem", fontWeight:700, color:th.dark }}>{r.name}</div>
                    <div style={{ fontSize:"0.7rem", color:th.muted }}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="careers" style={{ ...spStyle, background:th.white }} className="ilm-section-px">
          <div className="ilm-about-grid" style={{ maxWidth:1060, margin:"0 auto" }}>
            <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
              <SectionTag>About ILM ORA</SectionTag>
              <h2 className="ilm-h2" style={{ fontWeight:700, color:th.dark, lineHeight:1.2, marginBottom:10 }}>Ready to start your learning in <span style={{ color:th.orange }}>one simple click.</span></h2>
              <p style={{ color:th.muted, lineHeight:1.75, marginBottom:20 }}>Start your free 14-Day premium plan. ILM ORA is India's most trusted advanced learning platform for modern professionals.</p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button onClick={()=>setBookingOpen(true)} style={{ padding:"13px 22px", background:"#1a1a2e", color:"#fff", borderRadius:10, border:"none", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:"Poppins, sans-serif" }}>
                  <Calendar size={15}/> Book a Free Demo
                </button>
                <button onClick={()=>scrollTo("#courses")} style={{ padding:"13px 22px", background:"transparent", color:th.dark, border:`2px solid ${th.dark}`, borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"Poppins, sans-serif" }}>
                  See All Courses
                </button>
              </div>
            </div>
            <div style={{ flex:1, minWidth:isMobile?"100%":260 }}>
              <div className="ilm-about-stats">
                {[{num:"10k+",label:"Worldwide Learners"},{num:"98%",label:"Placement Rate"},{num:"50+",label:"Expert Mentors"},{num:"4+",label:"Career Tracks"}].map((s,i)=>(
                  <div key={i} className="card-hover" style={{ background:th.bg, borderRadius:14, padding:"18px", border:`1px solid ${th.border}`, textAlign:"center" }}
                    onMouseOver={e=>e.currentTarget.style.borderColor="#e87722"}
                    onMouseOut={e=>e.currentTarget.style.borderColor=th.border}>
                    <div style={{ fontSize:"1.7rem", fontWeight:800, color:"#e87722" }}>{s.num}</div>
                    <div style={{ fontSize:"0.72rem", color:th.muted, marginTop:3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <BookingModal open={bookingOpen} onClose={()=>setBookingOpen(false)}/>
        <AuthModal mode={authMode} onClose={()=>setAuthMode(null)} onSwitch={m=>setAuthMode(m)}/>
      </div>
    </PublicLayout>
  );
}