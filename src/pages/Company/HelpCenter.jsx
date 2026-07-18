// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Rocket,
//   BookOpen,
//   Users,
//   CreditCard,
//   UserCircle,
//   Wrench,
//   Search,
//   X,
//   Plus,
//   MessageCircle,
//   Mail,
//   ChevronRight,
//   Clock,
//   GraduationCap,
//   Moon,
//   Sun,
//   Phone,
//   Menu,
// } from "lucide-react";

// /* ══════════════════════════════════════════════
//    ILM ORA  ·  HELP CENTER PAGE — FULLY RESPONSIVE
//    Phone (360px+) | Tablet (768px+) | Laptop (1024px+)
// ══════════════════════════════════════════════ */

// const categories = [
//   {
//     id: "getting-started",
//     Icon: Rocket,
//     title: "Getting Started",
//     desc: "New to ILM ORA? Learn how to set up your account, enroll in courses, and begin your learning journey.",
//     articles: 12,
//     accent: "#F97316",
//   },
//   {
//     id: "courses",
//     Icon: BookOpen,
//     title: "Courses & Learning",
//     desc: "Browse courses, track progress, download certificates, and get the most out of every lesson.",
//     articles: 24,
//     accent: "#16a34a",
//   },
//   {
//     id: "mentors",
//     Icon: Users,
//     title: "Mentors & Sessions",
//     desc: "Book 1-on-1 mentor sessions, manage your schedule, and connect with industry professionals.",
//     articles: 9,
//     accent: "#2563eb",
//   },
//   {
//     id: "payments",
//     Icon: CreditCard,
//     title: "Payments & Billing",
//     desc: "Understand pricing plans, manage subscriptions, request refunds, and view invoices.",
//     articles: 14,
//     accent: "#9333ea",
//   },
//   {
//     id: "account",
//     Icon: UserCircle,
//     title: "Account & Profile",
//     desc: "Update your profile, change passwords, manage notifications, and control privacy settings.",
//     articles: 18,
//     accent: "#ca8a04",
//   },
//   {
//     id: "technical",
//     Icon: Wrench,
//     title: "Technical Support",
//     desc: "Fix login issues, troubleshoot video playback, clear cache, and resolve common platform errors.",
//     articles: 11,
//     accent: "#e11d48",
//   },
// ];

// const popularArticles = [
//   { title: "How to enroll in a course on ILM ORA", category: "Courses & Learning", readTime: "2 min" },
//   { title: "How to book a mentor session", category: "Mentors & Sessions", readTime: "3 min" },
//   { title: "Downloading your completion certificate", category: "Courses & Learning", readTime: "1 min" },
//   { title: "Resetting your password", category: "Account & Profile", readTime: "2 min" },
//   { title: "Requesting a refund", category: "Payments & Billing", readTime: "4 min" },
//   { title: "Video not loading? Try these fixes", category: "Technical Support", readTime: "3 min" },
// ];

// const faqs = [
//   {
//     q: "What courses does ILM ORA offer?",
//     a: "ILM ORA offers expert-led courses in Product Management, UI/UX Design, Growth Marketing, and Digital Skills. All courses are taught by top industry professionals with real-world experience.",
//   },
//   {
//     q: "Can I learn at my own pace?",
//     a: "Yes! All recorded courses are self-paced, meaning you can watch lessons anytime and revisit them as many times as you need. Live cohort sessions follow a fixed schedule.",
//   },
//   {
//     q: "How do I get a certificate?",
//     a: "After completing all lessons and assignments in a course, your certificate is automatically generated in your dashboard under 'My Certificates' and can be downloaded as a PDF.",
//   },
//   {
//     q: "Is there a free trial or free courses?",
//     a: "Yes! ILM ORA offers a range of free services and introductory lessons. Visit the 'Free Services' section in the navigation to explore what's available.",
//   },
//   {
//     q: "How do I contact a mentor?",
//     a: "Head to the Mentors page, browse by domain, and book a session directly using the mentor's calendar. You'll receive a confirmation email with the meeting link.",
//   },
// ];

// /* ── Social icon SVGs ── */
// const YoutubeIcon = () => (
//   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
//   </svg>
// );
// const LinkedInIcon = () => (
//   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//   </svg>
// );
// const WhatsAppIcon = () => (
//   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
//   </svg>
// );
// const InstagramIcon = () => (
//   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
//   </svg>
// );
// const XIcon = () => (
//   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
//   </svg>
// );

// const STYLES = `
// @keyframes slideDown {
//   from { opacity: 0; transform: translateY(-10px); }
//   to   { opacity: 1; transform: translateY(0); }
// }

// /* Mobile menu */
// .hc-mobile-menu {
//   display: none;
//   position: fixed; top: 0; left: 0; right: 0; bottom: 0;
//   background: white; z-index: 998;
//   padding: 80px 20px 24px;
//   flex-direction: column; gap: 8px;
//   animation: slideDown 0.25s ease;
//   overflow-y: auto;
// }
// .hc-mobile-menu.open { display: flex; }

// /* Dark mode mobile menu */
// .dark .hc-mobile-menu { background: #0a0a0a; }

// .hc-mobile-link {
//   display: flex; align-items: center; gap: 10px;
//   padding: 14px 16px; border-radius: 12px;
//   font-size: 15px; font-weight: 600; color: #1E293B;
//   background: none; border: none; cursor: pointer; text-align: left;
//   width: 100%; transition: background 0.15s;
//   text-decoration: none;
// }
// .dark .hc-mobile-link { color: #e5e7eb; }
// .hc-mobile-link:hover { background: #FFF3E8; color: #F97316; }
// .dark .hc-mobile-link:hover { background: rgba(249,115,22,0.12); color: #F97316; }

// /* Contact btn visible from sm (640px+) */
// .hc-contact-btn { display: none; }
// @media(min-width: 640px) { .hc-contact-btn { display: inline-flex; } }

// /* Hamburger shown below 640px */
// .hc-hamburger { display: flex; }
// @media(min-width: 640px) { .hc-hamburger { display: none; } }

// /* Category grid */
// .hc-cat-grid {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 20px;
// }
// @media(max-width: 1023px) {
//   .hc-cat-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
// }
// @media(max-width: 639px) {
//   .hc-cat-grid { grid-template-columns: 1fr; gap: 12px; }
// }

// /* Popular articles grid */
// .hc-articles-grid {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 16px;
// }
// @media(max-width: 1023px) {
//   .hc-articles-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
// }
// @media(max-width: 639px) {
//   .hc-articles-grid { grid-template-columns: 1fr; gap: 10px; }
// }

// /* Hero stats */
// .hc-stats-row {
//   display: flex; justify-content: center; gap: 32px;
//   flex-wrap: wrap;
// }
// @media(max-width: 480px) {
//   .hc-stats-row { gap: 20px; }
// }

// /* Hero title */
// .hc-hero-title {
//   font-size: clamp(28px, 6vw, 48px);
//   font-weight: 800; color: white; line-height: 1.15;
//   margin-bottom: 16px; letter-spacing: -1px;
// }

// /* Section padding */
// .hc-section {
//   max-width: 80rem; margin: 0 auto;
//   padding-left: 24px; padding-right: 24px;
// }
// @media(max-width: 639px) {
//   .hc-section { padding-left: 16px; padding-right: 16px; }
// }

// /* Footer grid */
// .hc-footer-grid {
//   display: grid;
//   gap: 40px;
//   grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
// }
// @media(max-width: 1023px) {
//   .hc-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
// }
// @media(max-width: 639px) {
//   .hc-footer-grid { grid-template-columns: 1fr; gap: 28px; }
// }

// /* CTA buttons */
// .hc-cta-btns {
//   display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
// }

// /* Navbar */
// .hc-nav {
//   background: rgba(255,255,255,0.9);
//   backdrop-filter: blur(12px);
//   box-shadow: 0 1px 8px rgba(0,0,0,0.06);
//   position: sticky; top: 0; z-index: 50;
//   border-bottom: 1px solid rgba(249,115,22,0.15);
// }
// .dark .hc-nav { background: rgba(0,0,0,0.9); border-color: rgba(55,65,81,0.5); }

// .hc-nav-inner {
//   max-width: 80rem; margin: 0 auto;
//   padding: 14px 24px;
//   display: flex; align-items: center; justify-content: space-between;
// }
// @media(max-width: 639px) {
//   .hc-nav-inner { padding: 12px 16px; }
// }

// /* Quick tags wrap on mobile */
// .hc-quick-tags {
//   display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px;
// }

// /* Search results count */
// @media(max-width: 639px) {
//   .hc-search-section { padding-top: 32px; padding-bottom: 32px; }
// }
// `;

// export default function HelpCenter() {
//   const navigate = useNavigate();
//   const [dark, setDark] = useState(() => {
//     try { return localStorage.getItem("theme") === "dark"; } catch { return false; }
//   });
//   const [search, setSearch] = useState("");
//   const [openFaq, setOpenFaq] = useState(null);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//       try { localStorage.setItem("theme", "dark"); } catch {}
//     } else {
//       document.documentElement.classList.remove("dark");
//       try { localStorage.setItem("theme", "light"); } catch {}
//     }
//   }, [dark]);

//   useEffect(() => {
//     if (mobileMenuOpen) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "";
//     return () => { document.body.style.overflow = ""; };
//   }, [mobileMenuOpen]);

//   const goHome = () => { navigate("/"); window.scrollTo({ top: 0, behavior: "instant" }); };

//   const filteredArticles = popularArticles.filter(
//     (a) =>
//       a.title.toLowerCase().includes(search.toLowerCase()) ||
//       a.category.toLowerCase().includes(search.toLowerCase())
//   );

//   const navLinks = [
//     { label: "Help Center", path: "/help-center" },
//     { label: "Contact", path: "/contact" },
//     { label: "FAQ", path: "/faq" },
//     { label: "Privacy Policy", path: "/privacy-policy" },
//     { label: "Terms of Service", path: "/terms-of-service" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
//       <style>{STYLES}</style>

//       {/* ══ NAVBAR ══ */}
//       <header className="hc-nav">
//         <div className="hc-nav-inner">
//           {/* Logo */}
//           <button
//             onClick={goHome}
//             className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
//           >
//             <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
//               <GraduationCap className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold">
//               <span className="text-green-600 dark:text-green-400">ILM </span>
//               <span className="text-[#F97316]">ORA</span>
//             </span>
//           </button>

//           {/* Right side */}
//           <div className="flex items-center gap-2">
//             {/* Contact btn — visible sm+ */}
//             <button
//               onClick={() => navigate("/contact")}
//               className="hc-contact-btn items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
//               style={{
//                 background: "rgba(249,115,22,0.08)",
//                 border: "1.5px solid rgba(249,115,22,0.25)",
//                 color: "#F97316",
//                 fontFamily: "inherit",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={e => {
//                 e.currentTarget.style.background = "rgba(249,115,22,0.15)";
//                 e.currentTarget.style.borderColor = "#F97316";
//                 e.currentTarget.style.transform = "translateY(-1px)";
//               }}
//               onMouseLeave={e => {
//                 e.currentTarget.style.background = "rgba(249,115,22,0.08)";
//                 e.currentTarget.style.borderColor = "rgba(249,115,22,0.25)";
//                 e.currentTarget.style.transform = "translateY(0)";
//               }}
//             >
//               <Phone className="w-4 h-4" />
//               Contact
//             </button>

//             {/* Dark mode toggle */}
//             <button
//               onClick={() => setDark(!dark)}
//               className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm"
//               aria-label="Toggle theme"
//             >
//               {dark ? (
//                 <Sun className="w-4 h-4 text-[#F97316]" />
//               ) : (
//                 <Moon className="w-4 h-4 text-[#1E293B]" />
//               )}
//             </button>

//             {/* Hamburger — visible below 640px */}
//             <button
//               className="hc-hamburger w-9 h-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 transition"
//               style={{ background: mobileMenuOpen ? "rgba(249,115,22,0.1)" : "transparent", borderColor: mobileMenuOpen ? "#F97316" : undefined }}
//               onClick={() => setMobileMenuOpen(p => !p)}
//               aria-label="Open menu"
//             >
//               {mobileMenuOpen ? <X className="w-4 h-4 text-[#F97316]" /> : <Menu className="w-4 h-4 text-[#1E293B] dark:text-white" />}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ── Mobile menu overlay ── */}
//       <div className={`hc-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
//         <div style={{ marginBottom: 8, padding: "0 4px" }}>
//           <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Navigation</span>
//         </div>
//         {navLinks.map(link => (
//           <button
//             key={link.path}
//             className="hc-mobile-link"
//             onClick={() => { setMobileMenuOpen(false); navigate(link.path); window.scrollTo({ top: 0, behavior: "instant" }); }}
//           >
//             <ChevronRight size={16} color="#F97316" />
//             {link.label}
//           </button>
//         ))}
//         <div style={{ borderTop: "1px solid #e5d9c8", marginTop: 8, paddingTop: 12 }}>
//           <button
//             className="hc-mobile-link"
//             style={{ background: "rgba(249,115,22,0.08)", color: "#F97316", border: "1.5px solid rgba(249,115,22,0.25)", borderRadius: 12 }}
//             onClick={() => { setMobileMenuOpen(false); navigate("/contact"); }}
//           >
//             <Phone size={16} />
//             Contact Support
//           </button>
//         </div>
//       </div>

//       {/* ══ HERO ══ */}
//       <section className="bg-[#1E293B] relative overflow-hidden">
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             background:
//               "radial-gradient(ellipse 70% 60% at 70% 0%, rgba(249,115,22,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(22,163,74,0.10) 0%, transparent 55%)",
//           }}
//         />
//         <div className="hc-section relative z-10 text-center" style={{ paddingTop: 48, paddingBottom: 48 }}>
//           <div className="inline-flex items-center gap-2 bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 px-4 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase">
//             <MessageCircle className="w-3.5 h-3.5" />
//             Help Center
//           </div>
//           <h1 className="hc-hero-title">
//             How can we <span className="text-[#F97316]">help you?</span>
//           </h1>
//           <p className="text-gray-400 text-base max-w-md mx-auto mb-7 leading-relaxed px-2">
//             Search our knowledge base or browse categories to find answers quickly.
//           </p>

//           {/* Search bar */}
//           <div className="max-w-lg mx-auto relative px-2">
//             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search articles, topics, guides..."
//               className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:bg-white/15 transition text-sm"
//             />
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Quick tags */}
//           <div className="hc-quick-tags px-2">
//             {["Getting Started", "Certificate", "Refund", "Mentor Booking"].map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => setSearch(tag)}
//                 className="bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 hover:text-white rounded-full px-3.5 py-1.5 text-xs font-medium transition"
//               >
//                 {tag}
//               </button>
//             ))}
//           </div>

//           {/* Stats */}
//           <div className="hc-stats-row mt-9">
//             {[
//               { val: "88+", lbl: "Help Articles" },
//               { val: "6", lbl: "Categories" },
//               { val: "24h", lbl: "Support Response" },
//             ].map((s) => (
//               <div key={s.lbl} className="text-center">
//                 <div className="text-2xl font-black text-white leading-none">{s.val}</div>
//                 <div className="text-xs text-gray-500 mt-1 font-medium">{s.lbl}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══ SEARCH RESULTS ══ */}
//       {search && (
//         <section className="hc-section hc-search-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
//           <div style={{ maxWidth: 768, margin: "0 auto" }}>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
//               {filteredArticles.length} result{filteredArticles.length !== 1 ? "s" : ""} for{" "}
//               <span className="text-[#F97316] font-semibold">"{search}"</span>
//             </p>
//             {filteredArticles.length === 0 ? (
//               <div className="text-center py-14 text-gray-400 dark:text-gray-500">
//                 <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
//                 <p className="text-lg font-medium">No results found.</p>
//                 <p className="text-sm mt-2">
//                   Try a different keyword or{" "}
//                   <a href="#contact" className="text-[#F97316] underline">contact us</a>.
//                 </p>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-3">
//                 {filteredArticles.map((a, i) => (
//                   <div
//                     key={i}
//                     className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#F97316]/40 hover:shadow-md px-5 py-4 flex items-center justify-between cursor-pointer transition-all duration-200"
//                   >
//                     <div>
//                       <p className="font-semibold text-[#1E293B] dark:text-white text-sm">{a.title}</p>
//                       <span className="text-xs text-[#F97316] font-medium">{a.category}</span>
//                     </div>
//                     <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* ══ CATEGORIES ══ */}
//       {!search && (
//         <section className="hc-section" style={{ paddingTop: 52, paddingBottom: 0 }}>
//           <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#1E293B] dark:text-white mb-2">
//             Browse by Category
//           </h2>
//           <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
//             Find guides organized by topic
//           </p>
//           <div className="hc-cat-grid">
//             {categories.map((cat) => {
//               const { Icon } = cat;
//               const isActive = activeCategory === cat.id;
//               return (
//                 <div
//                   key={cat.id}
//                   onClick={() => setActiveCategory(isActive ? null : cat.id)}
//                   className="bg-white dark:bg-gray-900 rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200"
//                   style={{
//                     borderColor: isActive ? cat.accent : "#e5e7eb",
//                     boxShadow: isActive ? `0 8px 24px ${cat.accent}18` : "none",
//                     transform: isActive ? "scale(1.02)" : "none",
//                   }}
//                   onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = cat.accent + "66"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
//                   onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; } }}
//                 >
//                   <div
//                     className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
//                     style={{ background: cat.accent + "18" }}
//                   >
//                     <Icon size={20} color={cat.accent} strokeWidth={1.8} />
//                   </div>
//                   <h3 className="font-bold text-base text-[#1E293B] dark:text-white mb-2">{cat.title}</h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{cat.desc}</p>
//                   <div className="flex items-center justify-between">
//                     <span
//                       className="text-xs font-bold px-3 py-1 rounded-full text-white"
//                       style={{ background: cat.accent }}
//                     >
//                       {cat.articles} articles
//                     </span>
//                     <ChevronRight size={15} color={cat.accent} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       )}

//       {/* ══ POPULAR ARTICLES ══ */}
//       {!search && (
//         <section className="hc-section" style={{ paddingTop: 48, paddingBottom: 0 }}>
//           <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white mb-2">
//             Popular Articles
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 mb-7 text-sm">
//             Most read by ILM ORA learners
//           </p>
//           <div className="hc-articles-grid">
//             {popularArticles.map((a, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#F97316]/40 hover:shadow-md px-4 py-4 flex items-start gap-3 cursor-pointer transition-all duration-200"
//               >
//                 <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950 text-[#F97316] flex items-center justify-center flex-shrink-0 text-xs font-bold">
//                   {i + 1}
//                 </span>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-sm text-[#1E293B] dark:text-white leading-snug mb-1.5">{a.title}</p>
//                   <div className="flex items-center gap-2 text-xs flex-wrap">
//                     <span className="text-[#F97316] font-medium">{a.category}</span>
//                     <span className="text-gray-400 flex items-center gap-1">
//                       · <Clock size={10} /> {a.readTime} read
//                     </span>
//                   </div>
//                 </div>
//                 <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* ══ FAQ ══ */}
//       {!search && (
//         <section className="hc-section" style={{ paddingTop: 48, paddingBottom: 0 }}>
//           <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#1E293B] dark:text-white mb-2">
//             Frequently Asked Questions
//           </h2>
//           <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
//             Quick answers to the questions we hear most
//           </p>
//           <div style={{ maxWidth: 768, margin: "0 auto" }} className="flex flex-col gap-3">
//             {faqs.map((faq, i) => {
//               const isOpen = openFaq === i;
//               return (
//                 <div
//                   key={i}
//                   className="bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden transition-all duration-200"
//                   style={{ borderColor: isOpen ? "rgba(249,115,22,0.4)" : "#e5e7eb", boxShadow: isOpen ? "0 4px 20px rgba(249,115,22,0.08)" : "none" }}
//                 >
//                   <button
//                     onClick={() => setOpenFaq(isOpen ? null : i)}
//                     className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
//                   >
//                     <span className="font-semibold text-[#1E293B] dark:text-gray-100 text-sm leading-snug">
//                       {faq.q}
//                     </span>
//                     <Plus
//                       className="w-5 h-5 text-[#F97316] flex-shrink-0 transition-transform duration-200"
//                       style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
//                     />
//                   </button>
//                   {isOpen && (
//                     <div className="px-5 pb-5">
//                       <div className="pl-3 border-l-2 border-[#F97316]/30">
//                         <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
//                           {faq.a}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       )}

//       {/* ══ CONTACT CTA ══ */}
//       <section id="contact" className="hc-section" style={{ paddingTop: 48, paddingBottom: 56 }}>
//         <div style={{ maxWidth: 672, margin: "0 auto" }}>
//           <div className="bg-[#1E293B] dark:bg-gray-900 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden border border-[#F97316]/20">
//             <div className="absolute top-0 left-0 right-0 h-1 bg-[#F97316]" />
//             <div
//               className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
//               style={{ background: "rgba(249,115,22,0.08)" }}
//             />
//             <div className="relative z-10">
//               <div className="w-12 h-12 bg-[#F97316]/15 border border-[#F97316]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <MessageCircle className="w-6 h-6 text-[#F97316]" />
//               </div>
//               <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3">Still need help?</h2>
//               <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
//                 Can't find what you're looking for? Our support team is happy to help you within 24 hours.
//               </p>
//               <div className="hc-cta-btns">
//                 <a
//                   href="mailto:support@ilmora.com"
//                   className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
//                 >
//                   <Mail className="w-4 h-4" />
//                   Email Support
//                 </a>
//                 <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
//                   <MessageCircle className="w-4 h-4" />
//                   Chat with Us
//                 </button>
//               </div>
//               <p className="text-gray-500 text-xs mt-5">
//                 support@ilmora.com · Mon–Sat, 9 AM – 7 PM IST
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══ FOOTER ══ */}
//       <footer className="bg-white dark:bg-gray-950 text-[#1E293B] dark:text-gray-200 border-t border-gray-200 dark:border-gray-800">
//         <div className="hc-section" style={{ paddingTop: 64, paddingBottom: 64 }}>
//           <div className="hc-footer-grid">

//             {/* Col 1 — Brand */}
//             <div className="flex flex-col gap-4">
//               <button onClick={goHome} className="bg-transparent border-none cursor-pointer p-0 text-left w-fit">
//                 <h3 className="text-2xl font-extrabold leading-none">
//                   <span className="text-green-600">ILM</span>{" "}
//                   <span className="text-[#F97316]">ORA</span>
//                 </h3>
//               </button>
//               <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
//                 Modern learning platform for ambitious professionals who want to break into product, design and growth roles.
//               </p>
//               <p className="text-sm text-gray-500">
//                 📧{" "}
//                 <a href="mailto:support@ilmora.com" className="hover:text-[#F97316] transition-colors">
//                   support@ilmora.com
//                 </a>
//               </p>
//               <p className="text-sm text-gray-500">📍 New Delhi, India</p>
//               {/* Social icons */}
//               <div className="flex items-center gap-2.5 flex-wrap">
//                 <a href="https://www.youtube.com/@Texoraai" target="_blank" rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all flex-shrink-0">
//                   <YoutubeIcon />
//                 </a>
//                 <a href="https://www.linkedin.com/company/105596104" target="_blank" rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all flex-shrink-0">
//                   <LinkedInIcon />
//                 </a>
//                 <a href="https://api.whatsapp.com/send?phone=919210970334" target="_blank" rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all flex-shrink-0">
//                   <WhatsAppIcon />
//                 </a>
//                 <a href="https://www.instagram.com/texora_ai" target="_blank" rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all flex-shrink-0"
//                   style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
//                   <InstagramIcon />
//                 </a>
//                 <a href="https://x.com/texoraai" target="_blank" rel="noreferrer"
//                   className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all flex-shrink-0">
//                   <XIcon />
//                 </a>
//               </div>
//             </div>

//             {/* Col 2: Programs */}
//             <div className="flex flex-col gap-4">
//               <h4 className="text-xs font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Programs</h4>
//               <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
//                 {["Product Management", "Growth Marketing", "UI / UX Design"].map((label) => (
//                   <li key={label} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
//                     {label}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Col 3: Resources */}
//             <div className="flex flex-col gap-4">
//               <h4 className="text-xs font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Resources</h4>
//               <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
//                 {[
//                   { label: "Success Stories", action: () => navigate("/") },
//                   { label: "Free Services", action: () => { navigate("/explore-programs"); window.scrollTo({ top: 0, behavior: "instant" }); } },
//                   { label: "Blogs", action: () => window.open("https://texora.ai/blogs", "_blank") },
//                 ].map((item) => (
//                   <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
//                     {item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Col 4: Company */}
//             <div className="flex flex-col gap-4">
//               <h4 className="text-xs font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Company</h4>
//               <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
//                 {[
//                   { label: "About Us", path: "/about" },
//                   { label: "Careers", path: "/careers" },
//                   { label: "Pricing", path: "/pricing" },
//                   { label: "Privacy Policy", path: "/privacy-policy" },
//                   { label: "Terms of Service", path: "/terms-of-service" },
//                   { label: "Contact Us", path: "/contact" },
//                 ].map((item) => (
//                   <li key={item.label} onClick={() => { navigate(item.path); window.scrollTo({ top: 0, behavior: "instant" }); }}
//                     className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
//                     {item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Col 5: Support */}
//             <div className="flex flex-col gap-4">
//               <h4 className="text-xs font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Support</h4>
//               <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
//                 {[
//                   { label: "Help Center", path: "/help-center" },
//                   { label: "Contact", path: "/contact" },
//                   { label: "FAQ", path: "/faq" },
//                 ].map((item) => (
//                   <li key={item.label} onClick={() => { navigate(item.path); window.scrollTo({ top: 0, behavior: "instant" }); }}
//                     className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
//                     {item.label}
//                   </li>
//                 ))}
//               </ul>
//               <div className="pt-1">
//                 <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
//                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                   Status: Live
//                 </span>
//               </div>
//             </div>

//           </div>

//           {/* Bottom bar */}
//           <div className="border-t border-gray-200 dark:border-gray-800 mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
//             <span>© {new Date().getFullYear()} ILM ORA. All rights reserved.</span>
//             <div className="flex items-center gap-2">
//               <span>Built with</span>
//               <span className="text-red-500 text-base">❤️</span>
//               <span>passion for modern learners</span>
//             </div>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// }



























































import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Rocket,
  BookOpen,
  Users,
  CreditCard,
  UserCircle,
  Wrench,
  Search,
  X,
  Plus,
  MessageCircle,
  Mail,
  ChevronRight,
  Clock,
} from "lucide-react";
import PublicLayout from "../Landing/components/PublicLayout";

/* ══════════════════════════════════════════════
   ILM ORA  ·  HELP CENTER PAGE — FULLY RESPONSIVE
   Now shares Navbar / Banner / Footer via PublicLayout
   and the same light/dark theme-token system (T) as
   PrivacyPolicy.jsx, instead of its own header/footer
   and a locally-managed dark-mode toggle.
══════════════════════════════════════════════ */

/* Brand/accent colors stay fixed across both themes (same as Pricing.jsx / PrivacyPolicy.jsx) */
const BRAND = {
  navy:    "#1a2340",
  orange:  "#f97316",
  orangeL: "#fff3e8",
  orangeB: "#fcd4a8",
  green:   "#16a34a",
  indigo:  "#6366f1",
  pink:    "#db2777",
  teal:    "#0d9488",
  white:   "#ffffff",
};

/* Surface/text colors DO change with the theme toggle (same as PrivacyPolicy.jsx) */
const THEMES = {
  light: {
    cream:   "#fdf6ee",
    cream2:  "#f5ede0",
    cream3:  "#fbeee0",
    surface: "#ffffff",
    heading: "#1a2340",
    navy2:   "#0f172a",
    text:    "#1e293b",
    muted:   "#475569",
    muted2:  "#64748b",
    border:  "#e5d9c8",
    borderM: "#d5c4aa",
  },
  dark: {
    cream:   "#0f1420",
    cream2:  "#161c2b",
    cream3:  "#0b0e16",
    surface: "#161c2c",
    heading: "#f5f7fb",
    navy2:   "#cbd5e1",
    text:    "#e2e8f0",
    muted:   "#a7b0c0",
    muted2:  "#8b93a6",
    border:  "#242c40",
    borderM: "#2d3652",
  },
};

const categories = [
  {
    id: "getting-started",
    Icon: Rocket,
    title: "Getting Started",
    desc: "New to ILM ORA? Learn how to set up your account, enroll in courses, and begin your learning journey.",
    articles: 12,
    accent: "#F97316",
  },
  {
    id: "courses",
    Icon: BookOpen,
    title: "Courses & Learning",
    desc: "Browse courses, track progress, download certificates, and get the most out of every lesson.",
    articles: 24,
    accent: "#16a34a",
  },
  {
    id: "mentors",
    Icon: Users,
    title: "Mentors & Sessions",
    desc: "Book 1-on-1 mentor sessions, manage your schedule, and connect with industry professionals.",
    articles: 9,
    accent: "#2563eb",
  },
  {
    id: "payments",
    Icon: CreditCard,
    title: "Payments & Billing",
    desc: "Understand pricing plans, manage subscriptions, request refunds, and view invoices.",
    articles: 14,
    accent: "#9333ea",
  },
  {
    id: "account",
    Icon: UserCircle,
    title: "Account & Profile",
    desc: "Update your profile, change passwords, manage notifications, and control privacy settings.",
    articles: 18,
    accent: "#ca8a04",
  },
  {
    id: "technical",
    Icon: Wrench,
    title: "Technical Support",
    desc: "Fix login issues, troubleshoot video playback, clear cache, and resolve common platform errors.",
    articles: 11,
    accent: "#e11d48",
  },
];

const popularArticles = [
  { title: "How to enroll in a course on ILM ORA", category: "Courses & Learning", readTime: "2 min" },
  { title: "How to book a mentor session", category: "Mentors & Sessions", readTime: "3 min" },
  { title: "Downloading your completion certificate", category: "Courses & Learning", readTime: "1 min" },
  { title: "Resetting your password", category: "Account & Profile", readTime: "2 min" },
  { title: "Requesting a refund", category: "Payments & Billing", readTime: "4 min" },
  { title: "Video not loading? Try these fixes", category: "Technical Support", readTime: "3 min" },
];

const faqs = [
  {
    q: "What courses does ILM ORA offer?",
    a: "ILM ORA offers expert-led courses in Product Management, UI/UX Design, Growth Marketing, and Digital Skills. All courses are taught by top industry professionals with real-world experience.",
  },
  {
    q: "Can I learn at my own pace?",
    a: "Yes! All recorded courses are self-paced, meaning you can watch lessons anytime and revisit them as many times as you need. Live cohort sessions follow a fixed schedule.",
  },
  {
    q: "How do I get a certificate?",
    a: "After completing all lessons and assignments in a course, your certificate is automatically generated in your dashboard under 'My Certificates' and can be downloaded as a PDF.",
  },
  {
    q: "Is there a free trial or free courses?",
    a: "Yes! ILM ORA offers a range of free services and introductory lessons. Visit the 'Free Services' section in the navigation to explore what's available.",
  },
  {
    q: "How do I contact a mentor?",
    a: "Head to the Mentors page, browse by domain, and book a session directly using the mentor's calendar. You'll receive a confirmation email with the meeting link.",
  },
];

/* Builds the scoped stylesheet for the given theme's tokens.
   Scoped to .help-center-page so it can't bleed into the shared
   Navbar/Banner/Footer rendered by PublicLayout alongside it
   (same fix already applied in Pricing.jsx / PrivacyPolicy.jsx).
   Class names are prefixed "hcp-" (Help Center Page) to avoid any
   collision with other pages' globally-injected <style> tags. */
function buildStyles(T) {
  return `
.help-center-page, .help-center-page *, .help-center-page *::before, .help-center-page *::after {
  box-sizing: border-box;
}
.help-center-page { background: ${T.cream3}; -webkit-font-smoothing: antialiased; }

/* Category grid */
.hcp-cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media(max-width: 1023px) {
  .hcp-cat-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
}
@media(max-width: 639px) {
  .hcp-cat-grid { grid-template-columns: 1fr; gap: 12px; }
}

/* Popular articles grid */
.hcp-articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media(max-width: 1023px) {
  .hcp-articles-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}
@media(max-width: 639px) {
  .hcp-articles-grid { grid-template-columns: 1fr; gap: 10px; }
}

/* Hero stats */
.hcp-stats-row {
  display: flex; justify-content: center; gap: 32px;
  flex-wrap: wrap;
}
@media(max-width: 480px) {
  .hcp-stats-row { gap: 20px; }
}

/* Hero title */
.hcp-hero-title {
  font-size: clamp(28px, 6vw, 48px);
  font-weight: 800; color: #ffffff; line-height: 1.15;
  margin-bottom: 16px; letter-spacing: -1px;
}

/* Section padding */
.hcp-section {
  max-width: 80rem; margin: 0 auto;
  padding-left: 24px; padding-right: 24px;
}
@media(max-width: 639px) {
  .hcp-section { padding-left: 16px; padding-right: 16px; }
}

/* CTA buttons */
.hcp-cta-btns {
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
}

/* Quick tags wrap on mobile */
.hcp-quick-tags {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px;
}

/* Search results section spacing */
@media(max-width: 639px) {
  .hcp-search-section { padding-top: 32px; padding-bottom: 32px; }
}

/* Cards */
.hcp-card {
  background: ${T.surface};
  border: 1.5px solid ${T.border};
  border-radius: 16px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
`;
}

const HelpCenter = ({ theme, toggleTheme, setShowLoginModal }) => {
  const { pathname } = useLocation();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  /* Theme-aware tokens: fixed brand colors + the light/dark surface set
     picked by the `theme` prop passed down from App.jsx — same approach
     as PrivacyPolicy.jsx, so this page also responds to the light/dark
     toggle in the shared navbar. */
  const isDarkTheme = theme === "dark";
  const T = { ...BRAND, ...THEMES[isDarkTheme ? "dark" : "light"] };
  const STYLES = buildStyles(T);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  const filteredArticles = popularArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{STYLES}</style>

      <PublicLayout
        theme={theme}
        toggleTheme={toggleTheme}
        setShowLoginModal={setShowLoginModal}
      >
      <div className="help-center-page" style={{
        minHeight: "100vh", background: T.cream3,
        color: T.text, fontFamily: "system-ui, sans-serif",
      }}>

        {/* ══ HERO ══ */}
        <section style={{ background: BRAND.navy, position: "relative", overflow: "hidden" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 70% 0%, rgba(249,115,22,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(22,163,74,0.10) 0%, transparent 55%)",
            }}
          />
          <div className="hcp-section relative z-10 text-center" style={{ paddingTop: 48, paddingBottom: 48 }}>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 px-4 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase">
              <MessageCircle className="w-3.5 h-3.5" />
              Help Center
            </div>
            <h1 className="hcp-hero-title">
              How can we <span style={{ color: BRAND.orange }}>help you?</span>
            </h1>
            <p className="text-base max-w-md mx-auto mb-7 leading-relaxed px-2" style={{ color: "#9ca3af" }}>
              Search our knowledge base or browse categories to find answers quickly.
            </p>

            {/* Search bar */}
            <div className="max-w-lg mx-auto relative px-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, topics, guides..."
                className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:bg-white/15 transition text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick tags */}
            <div className="hcp-quick-tags px-2">
              {["Getting Started", "Certificate", "Refund", "Mentor Booking"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 hover:text-white rounded-full px-3.5 py-1.5 text-xs font-medium transition"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="hcp-stats-row mt-9">
              {[
                { val: "88+", lbl: "Help Articles" },
                { val: "6", lbl: "Categories" },
                { val: "24h", lbl: "Support Response" },
              ].map((s) => (
                <div key={s.lbl} className="text-center">
                  <div className="text-2xl font-black text-white leading-none">{s.val}</div>
                  <div className="text-xs mt-1 font-medium" style={{ color: "#6b7280" }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SEARCH RESULTS ══ */}
        {search && (
          <section className="hcp-section hcp-search-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <div style={{ maxWidth: 768, margin: "0 auto" }}>
              <p className="text-sm mb-5" style={{ color: T.muted }}>
                {filteredArticles.length} result{filteredArticles.length !== 1 ? "s" : ""} for{" "}
                <span style={{ color: BRAND.orange }} className="font-semibold">"{search}"</span>
              </p>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-14" style={{ color: T.muted2 }}>
                  <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No results found.</p>
                  <p className="text-sm mt-2">
                    Try a different keyword or{" "}
                    <a href="#contact" style={{ color: BRAND.orange }} className="underline">contact us</a>.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredArticles.map((a, i) => (
                    <div
                      key={i}
                      className="hcp-card hover:shadow-md px-5 py-4 flex items-center justify-between cursor-pointer"
                      style={{ borderColor: T.border }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
                    >
                      <div>
                        <p className="font-semibold text-sm" style={{ color: T.heading }}>{a.title}</p>
                        <span className="text-xs font-medium" style={{ color: BRAND.orange }}>{a.category}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 flex-shrink-0 ml-3" style={{ color: T.muted2 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══ CATEGORIES ══ */}
        {!search && (
          <section className="hcp-section" style={{ paddingTop: 52, paddingBottom: 0 }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-2" style={{ color: T.heading }}>
              Browse by Category
            </h2>
            <p className="text-center mb-8 text-sm" style={{ color: T.muted }}>
              Find guides organized by topic
            </p>
            <div className="hcp-cat-grid">
              {categories.map((cat) => {
                const { Icon } = cat;
                const isActive = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className="hcp-card p-5 cursor-pointer"
                    style={{
                      borderWidth: 2,
                      borderColor: isActive ? cat.accent : T.border,
                      boxShadow: isActive ? `0 8px 24px ${cat.accent}18` : "none",
                      transform: isActive ? "scale(1.02)" : "none",
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = cat.accent + "66"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; } }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                      style={{ background: cat.accent + "18" }}
                    >
                      <Icon size={20} color={cat.accent} strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-base mb-2" style={{ color: T.heading }}>{cat.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: T.muted }}>{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: cat.accent }}
                      >
                        {cat.articles} articles
                      </span>
                      <ChevronRight size={15} color={cat.accent} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ POPULAR ARTICLES ══ */}
        {!search && (
          <section className="hcp-section" style={{ paddingTop: 48, paddingBottom: 0 }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: T.heading }}>
              Popular Articles
            </h2>
            <p className="mb-7 text-sm" style={{ color: T.muted }}>
              Most read by ILM ORA learners
            </p>
            <div className="hcp-articles-grid">
              {popularArticles.map((a, i) => (
                <div
                  key={i}
                  className="hcp-card hover:shadow-md px-4 py-4 flex items-start gap-3 cursor-pointer"
                  style={{ borderColor: T.border }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: "rgba(249,115,22,0.12)", color: BRAND.orange }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug mb-1.5" style={{ color: T.heading }}>{a.title}</p>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="font-medium" style={{ color: BRAND.orange }}>{a.category}</span>
                      <span className="flex items-center gap-1" style={{ color: T.muted2 }}>
                        · <Clock size={10} /> {a.readTime} read
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: T.muted2 }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ FAQ ══ */}
        {!search && (
          <section className="hcp-section" style={{ paddingTop: 48, paddingBottom: 0 }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-2" style={{ color: T.heading }}>
              Frequently Asked Questions
            </h2>
            <p className="text-center mb-8 text-sm" style={{ color: T.muted }}>
              Quick answers to the questions we hear most
            </p>
            <div style={{ maxWidth: 768, margin: "0 auto" }} className="flex flex-col gap-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="hcp-card overflow-hidden"
                    style={{ borderColor: isOpen ? "rgba(249,115,22,0.4)" : T.border, boxShadow: isOpen ? "0 4px 20px rgba(249,115,22,0.08)" : "none" }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-semibold text-sm leading-snug" style={{ color: T.heading }}>
                        {faq.q}
                      </span>
                      <Plus
                        className="w-5 h-5 flex-shrink-0 transition-transform duration-200"
                        style={{ color: BRAND.orange, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <div className="pl-3" style={{ borderLeft: "2px solid rgba(249,115,22,0.3)" }}>
                          <p className="text-sm leading-relaxed" style={{ color: T.text }}>
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ CONTACT CTA ══ */}
        <section id="contact" className="hcp-section" style={{ paddingTop: 48, paddingBottom: 56 }}>
          <div style={{ maxWidth: 672, margin: "0 auto" }}>
            <div
              className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
              style={{ background: BRAND.navy, border: "1px solid rgba(249,115,22,0.2)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: BRAND.orange }} />
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: "rgba(249,115,22,0.08)" }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
                  <MessageCircle className="w-6 h-6" style={{ color: BRAND.orange }} />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3">Still need help?</h2>
                <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{ color: "#9ca3af" }}>
                  Can't find what you're looking for? Our support team is happy to help you within 24 hours.
                </p>
                <div className="hcp-cta-btns">
                  <a
                    href="mailto:support@ilmora.com"
                    className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm text-white"
                    style={{ background: BRAND.orange }}
                  >
                    <Mail className="w-4 h-4" />
                    Email Support
                  </a>
                  <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                    <MessageCircle className="w-4 h-4" />
                    Chat with Us
                  </button>
                </div>
                <p className="text-xs mt-5" style={{ color: "#6b7280" }}>
                   ilmora@texora.ai · Mon–Sat, 9 AM – 7 PM IST
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
      </PublicLayout>
    </>
  );
};

export default HelpCenter;