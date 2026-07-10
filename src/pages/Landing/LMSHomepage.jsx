// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import SignupModal from "./SignupModal";
// import ForgotPasswordModal from "./ForgotPasswordModal";
// import SplitText from "../../components/SplitText";
// import {
//   ArrowRight,
//   Award,
//   BarChart3,
//   BookOpen,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ClipboardList,
//   Clock,
//   FileText,
//   GraduationCap,
//   Heart,
//   Lightbulb,
//   LogOut,
//   Menu,
//   Moon,
//   PlayCircle,
//   Sparkles,
//   Star,
//   Sun,
//   Target,
//   TrendingUp,
//   Trophy,
//   User,
//   Users,
//   X,
//   Zap,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import heroVideo from "../../assets/hero-1.mp4";
// import heroStudent2 from "../../assets/hero-student-2.png";
// import heroStudent3 from "../../assets/hero-student-3.png";
// import heroStudent from "../../assets/hero-student.png";
// import ctaStudent from "../../assets/cta-student.png";
// import auth from "../../auth";
// import MegaMenu from "../../components/MegaMenu";
// import authService from "../../services/authService";
// import { courseService } from "../../services/courseService";
// import { subscribeNewsletter } from "../../services/notificationService";
// import TexoraFloatingWidget from "./components/TexoraFloatingWidget";
// import HorizontalCarousel from "./components/HorizontalCarousel";
// import CategoryTabScroller from "./components/CategoryTabScroller";
// import WatchNowSection from "./components/WatchNow";
// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";
// const NEWSLETTER_KEY = "ilmora_newsletter_subscribers";

// /* ── Fallback data for the "Top Global Companies" section ──
//    Used only while the backend call is loading or if it returns nothing. */
// const FALLBACK_TECH_PARTNERS = [
//   { src: "/aws.png", name: "AWS", desc: "Amazon Web Services" },
//   { src: "/Google.jpg", name: "Google Cloud", desc: "Google Cloud Platform" },
//   { src: "/Amazone.jpg", name: "Amazon AWS", desc: "Amazon Web Services" },
//   {
//     src: "/Micrososft.jpg",
//     name: "Microsoft Azure",
//     desc: "Microsoft Cloud Platform",
//   },
// ];

// const FALLBACK_BIZ_PARTNERS = [
//   { src: "/Picture1.jpg", name: "Texora AI", desc: "AI & Digital Solutions" },
//   {
//     src: "/UFS-Logo.jpg",
//     name: "UFS Network",
//     desc: "Unified Consultancy Services",
//   },
// ];

// const ECOSYSTEM_COLORS = ["blue", "orange", "purple", "green", "rose"];

// const FALLBACK_ECOSYSTEM = [
//   {
//     name: "TORA CX",
//     color: "blue",
//     desc: "Customer experience platform",
//     Icon: null,
//     svgPath: (
//       <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//     ),
//   },
//   {
//     name: "UNIFIED CRM",
//     color: "orange",
//     desc: "AI-driven CRM for sales",
//     Icon: Users,
//   },
//   {
//     name: "ILM ORA",
//     color: "purple",
//     desc: "LMS with AI learning paths",
//     Icon: GraduationCap,
//   },
//   {
//     name: "INNOVORA AI",
//     color: "green",
//     desc: "AI-powered innovation suite",
//     Icon: Lightbulb,
//   },
//   {
//     name: "TASK ORBIT",
//     color: "rose",
//     desc: "AI-powered task management",
//     Icon: ClipboardList,
//   },
// ];

// function getSubscribers() {
//   try {
//     return JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || "[]");
//   } catch {
//     return [];
//   }
// }
// function saveSubscribers(list) {
//   localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(list));
// }

// /* ─────────────────────────────────────────────────────────────────
//    FULL-SCREEN MOBILE MENU
// ───────────────────────────────────────────────────────────────── */
// function MobileFullScreenMenu({
//   onClose,
//   navLinks,
//   navButtons,
//   user,
//   navigate,
//   handleLogout,
//   setShowLoginModal,
// }) {
//   const [ilmoraFeatureOpen, setIlmoraFeatureOpen] = useState(false);
//   const [moreOpen, setMoreOpen] = useState(false);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   const AccordionSection = ({ label, isOpen, onToggle, children }) => (
//     <div style={{ borderBottom: "1px solid #f3f4f6" }}>
//       <button
//         onClick={onToggle}
//         style={{
//           width: "100%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "15px 20px",
//           border: "none",
//           background: "transparent",
//           cursor: "pointer",
//           textAlign: "left",
//           fontSize: 15,
//           fontWeight: 600,
//           color: "#1e293b",
//         }}
//       >
//         {label}
//         <span
//           style={{
//             transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
//             transition: "transform 0.2s ease",
//             display: "flex",
//             alignItems: "center",
//             color: "#6b7280",
//           }}
//         >
//           <ChevronDown size={16} />
//         </span>
//       </button>
//       {isOpen && (
//         <div
//           style={{
//             background: "#f9fafb",
//             borderTop: "1px solid #f3f4f6",
//             padding: "8px 0",
//           }}
//         >
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         width: "100vw",
//         height: "100vh",
//         background: "#ffffff",
//         zIndex: 99999,
//         overflowY: "auto",
//         fontFamily: "'Plus Jakarta Sans', sans-serif",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* ── Header ── */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "16px 20px",
//           borderBottom: "1px solid #f3f4f6",
//           background: "#fff",
//           position: "sticky",
//           top: 0,
//           zIndex: 10,
//           flexShrink: 0,
//         }}
//       >
//         <span
//           style={{
//             fontSize: 26,
//             fontWeight: 800,
//             fontFamily: "serif",
//             lineHeight: 1,
//           }}
//         >
//           <span style={{ color: "#16a34a" }}>ILM</span>
//           <span style={{ color: "#f97316", marginLeft: 4 }}>ORA</span>
//         </span>
//         <button
//           onClick={onClose}
//           style={{
//             border: "none",
//             background: "#f5f5f5",
//             borderRadius: 10,
//             width: 36,
//             height: 36,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             color: "#6b7280",
//           }}
//           aria-label="Close menu"
//         >
//           <X size={18} />
//         </button>
//       </div>

//       {/* ── Body ── */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           padding: "12px 0 32px",
//         }}
//       >
//         {/* MegaMenu — All Courses */}
//         <div style={{ padding: "0 16px 8px" }}>
//           <MegaMenu onItemClick={onClose} />
//         </div>

//         {/* Divider */}
//         <div
//           style={{ height: 1, background: "#f3f4f6", margin: "4px 20px 4px" }}
//         />
//         {/* Nav buttons */}
//         {navButtons.map((btn) => (
//           <button
//             key={btn.text}
//             onClick={() => {
//               btn.action();
//               onClose();
//             }}
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "center",
//               padding: "15px 20px",
//               border: "none",
//               borderBottom: "1px solid #f9fafb",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//               fontSize: 15,
//               fontWeight: 600,
//               color: "#1e293b",
//             }}
//           >
//             {btn.text}
//           </button>
//         ))}

//         {/* ── ILM ORA Feature Accordion ── */}
//         <AccordionSection
//           label="ILM ORA Feature"
//           isOpen={ilmoraFeatureOpen}
//           onToggle={() => setIlmoraFeatureOpen((p) => !p)}
//         >
//           {/* Student Hub */}
//           <button
//             onClick={() => {
//               navigate("/student-hub");
//               onClose();
//             }}
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 12,
//               padding: "12px 24px",
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//             }}
//           >
//             <div
//               style={{
//                 width: 36,
//                 height: 36,
//                 background: "#f0fdf4",
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <GraduationCap size={18} style={{ color: "#16a34a" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#1e293b",
//                   margin: 0,
//                 }}
//               >
//                 Student Hub
//               </p>
//               <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
//                 AI-Powered Learning &amp; Career Growth
//               </p>
//             </div>
//           </button>

//           {/* Trainer Hub */}
//           <button
//             onClick={() => {
//               navigate("/trainer-hub");
//               onClose();
//             }}
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 12,
//               padding: "12px 24px",
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//             }}
//           >
//             <div
//               style={{
//                 width: 36,
//                 height: 36,
//                 background: "#eff6ff",
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <Users size={18} style={{ color: "#2563eb" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#1e293b",
//                   margin: 0,
//                 }}
//               >
//                 Trainer Hub
//               </p>
//               <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
//                 Training Management &amp; Mentorship
//               </p>
//             </div>
//           </button>
//           {/* Manager Hub */}
//           <button
//             onClick={() => {
//               navigate("/manager-hub");
//               onClose();
//             }}
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 12,
//               padding: "12px 24px",
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//             }}
//           >
//             <div
//               style={{
//                 width: 36,
//                 height: 36,
//                 background: "#faf5ff",
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <BarChart3 size={18} style={{ color: "#9333ea" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#1e293b",
//                   margin: 0,
//                 }}
//               >
//                 Manager Hub
//               </p>
//               <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
//                 Analytics, Performance &amp; Team Development
//               </p>
//             </div>
//           </button>

//           {/* Divider */}
//           <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 24px" }} />

//           {/* ILM ORA Meet */}
//           <button
//             onClick={() => {
//               navigate("/ilm-ora-meet");
//               onClose();
//             }}
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 12,
//               padding: "12px 24px",
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//             }}
//           >
//             <div
//               style={{
//                 width: 36,
//                 height: 36,
//                 background: "#fff7ed",
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <Users size={18} style={{ color: "#f97316" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#1e293b",
//                   margin: 0,
//                 }}
//               >
//                 ILM ORA Meet
//               </p>
//               <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
//                 Virtual Meetings &amp; Collaboration
//               </p>
//             </div>
//           </button>

//           {/* AI Resume Builder */}
//           <button
//             onClick={() => {
//               navigate("/resume-builder");
//               onClose();
//             }}
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 12,
//               padding: "12px 24px",
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//             }}
//           >
//             <div
//               style={{
//                 width: 36,
//                 height: 36,
//                 background: "#f0fdf4",
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <FileText size={18} style={{ color: "#16a34a" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#1e293b",
//                   margin: 0,
//                 }}
//               >
//                 AI Resume Builder
//               </p>
//               <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
//                 Create ATS-Friendly Professional Resumes
//               </p>
//             </div>
//           </button>
//         </AccordionSection>

//         {/* ── More Accordion ── */}
//         <AccordionSection
//           label="More"
//           isOpen={moreOpen}
//           onToggle={() => setMoreOpen((p) => !p)}
//         >
//           {navLinks.map((link) => (
//             <button
//               key={link.text}
//               onClick={() => {
//                 if (link.href) {
//                   document
//                     .querySelector(link.href)
//                     ?.scrollIntoView({ behavior: "smooth" });
//                 }
//                 onClose();
//               }}
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "12px 24px",
//                 border: "none",
//                 background: "transparent",
//                 cursor: "pointer",
//                 textAlign: "left",
//                 fontSize: 14,
//                 fontWeight: 500,
//                 color: "#374151",
//               }}
//             >
//               {link.text}
//             </button>
//           ))}
//         </AccordionSection>

//         {/* Divider */}
//         <div
//           style={{ height: 1, background: "#f3f4f6", margin: "12px 20px" }}
//         />

//         {/* Auth section */}
//         <div style={{ padding: "0 16px" }}>
//           {user ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 12,
//                   padding: "12px 16px",
//                   background: "#fdf4ec",
//                   borderRadius: 14,
//                   marginBottom: 4,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 38,
//                     height: 38,
//                     background: "#1e293b",
//                     borderRadius: "50%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#fff",
//                     fontWeight: 700,
//                     fontSize: 14,
//                     flexShrink: 0,
//                   }}
//                 >
//                   {user.name?.charAt(0) || "U"}
//                 </div>
//                 <div style={{ minWidth: 0 }}>
//                   <p
//                     style={{
//                       fontWeight: 600,
//                       fontSize: 14,
//                       color: "#1e293b",
//                       margin: 0,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {user.name || "User"}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: 12,
//                       color: "#6b7280",
//                       margin: 0,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {user.email}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => {
//                   navigate("/my-learning");
//                   onClose();
//                 }}
//                 style={{
//                   width: "100%",
//                   padding: "13px",
//                   borderRadius: 14,
//                   border: "none",
//                   background: "#1e293b",
//                   color: "#fff",
//                   fontWeight: 600,
//                   fontSize: 15,
//                   cursor: "pointer",
//                 }}
//               >
//                 My Learning
//               </button>
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   onClose();
//                 }}
//                 style={{
//                   width: "100%",
//                   padding: "13px",
//                   borderRadius: 14,
//                   border: "1.5px solid #fecaca",
//                   background: "transparent",
//                   color: "#dc2626",
//                   fontWeight: 600,
//                   fontSize: 15,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                 }}
//               >
//                 <LogOut size={16} /> Logout
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => {
//                 onClose();
//                 setShowLoginModal(true);
//               }}
//               style={{
//                 width: "100%",
//                 padding: "14px",
//                 borderRadius: 14,
//                 border: "none",
//                 background: "#1e293b",
//                 color: "#fff",
//                 fontWeight: 700,
//                 fontSize: 15,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 8,
//               }}
//             >
//               <Sparkles size={16} /> Get Started
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // FooterNewsletter
// // Subscribe form uses the real backend API (subscribeNewsletter). A hidden
// // subscriber-admin panel (callable via openNewsletterAdmin / the hidden
// // trigger element) is kept for internal use — it does not alter the visible
// // design of the footer.
// // ─────────────────────────────────────────────────────────────────────────────
// function FooterNewsletter() {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("idle");

//   // Hidden subscriber-admin panel state
//   const [showAdmin, setShowAdmin] = useState(false);
//   const [adminOk, setAdminOk] = useState(false);
//   const [adminCode, setAdminCode] = useState("");
//   const [subscribers, setSubscribers] = useState([]);

//   const isValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

//   const handleSubmit = async () => {
//     const trimmed = email.trim().toLowerCase();
//     if (!isValid(trimmed)) {
//       setStatus("error");
//       setTimeout(() => setStatus("idle"), 2500);
//       return;
//     }
//     setStatus("loading");
//     try {
//       const { ok, status: httpStatus } = await subscribeNewsletter(trimmed);
//       if (httpStatus === 409) {
//         setStatus("duplicate");
//         setTimeout(() => setStatus("idle"), 3000);
//         return;
//       }
//       if (ok) {
//         setStatus("success");
//         setEmail("");
//         setTimeout(() => setStatus("idle"), 3500);
//       } else {
//         setStatus("apierror");
//         setTimeout(() => setStatus("idle"), 3000);
//       }
//     } catch {
//       setStatus("apierror");
//       setTimeout(() => setStatus("idle"), 3000);
//     }
//   };

//   /* ── Hidden subscriber-admin panel ── */
//   const openAdmin = () => {
//     setSubscribers(getSubscribers());
//     setShowAdmin(true);
//   };

//   const unlockAdmin = () => {
//     if (adminCode === "ilmora2026") {
//       setAdminOk(true);
//       setAdminCode("");
//     } else {
//       alert("Incorrect code");
//     }
//   };

//   const deleteSubscriber = (emailToDel) => {
//     const updated = subscribers.filter((s) => s.email !== emailToDel);
//     saveSubscribers(updated);
//     setSubscribers(updated);
//   };

//   const formatDate = (iso) =>
//     new Date(iso).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   const statusMsg = {
//     success: { text: "✓ You're subscribed!", color: "#22c55e" },
//     error: { text: "Enter a valid email.", color: "#f87171" },
//     duplicate: { text: "Already subscribed.", color: "#fb923c" },
//     apierror: { text: "Something went wrong. Try again.", color: "#f87171" },
//   }[status];

//   return (
//     <div className="flex flex-col gap-1">
//       <h4 className="text-sm md:text-base font-bold tracking-wide text-white leading-snug">
//         Be the first to know
//       </h4>
//       <div
//         style={{
//           display: "flex",
//           background: status === "error" ? "rgba(248,113,113,0.08)" : "#232323",
//           borderRadius: "8px",
//           border:
//             status === "error"
//               ? "1.5px solid #f87171"
//               : status === "success"
//                 ? "1.5px solid #22c55e"
//                 : "1.5px solid rgba(255,255,255,0.08)",
//           overflow: "hidden",
//           transition: "border-color 0.2s",
//         }}
//       >
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//           placeholder="marketing@texora.ai"
//           disabled={status === "loading" || status === "success"}
//           className="placeholder:text-[#9CA3AF]"
//           style={{
//             flex: 1,
//             background: "transparent",
//             border: "none",
//             outline: "none",
//             color: "#FFFFFF",
//             fontSize: "13px",
//             padding: "8px 12px",
//             minWidth: 0,
//           }}
//         />
//         <button
//           onClick={handleSubmit}
//           disabled={status === "loading" || status === "success"}
//           style={{
//             background: status === "success" ? "#22c55e" : "#F97316",
//             border: "none",
//             cursor: "pointer",
//             padding: "0 14px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             minWidth: "40px",
//             transition: "background 0.2s",
//             flexShrink: 0,
//           }}
//           onMouseEnter={(e) => {
//             if (status !== "success")
//               e.currentTarget.style.background = "#EA580C";
//           }}
//           onMouseLeave={(e) => {
//             if (status !== "success")
//               e.currentTarget.style.background = "#F97316";
//           }}
//         >
//           {status === "loading" ? (
//             <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//               <circle
//                 cx="10"
//                 cy="10"
//                 r="8"
//                 stroke="rgba(255,255,255,0.3)"
//                 strokeWidth="2.5"
//               />
//               <path
//                 d="M10 2a8 8 0 0 1 8 8"
//                 stroke="#fff"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <animateTransform
//                   attributeName="transform"
//                   type="rotate"
//                   from="0 10 10"
//                   to="360 10 10"
//                   dur="0.7s"
//                   repeatCount="indefinite"
//                 />
//               </path>
//             </svg>
//           ) : status === "success" ? (
//             <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//               <path
//                 d="M4 10l4 4 8-8"
//                 stroke="#fff"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           ) : (
//             <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//               <path
//                 d="M4 10h12M10 4l6 6-6 6"
//                 stroke="#fff"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           )}
//         </button>
//       </div>

//       {statusMsg && (
//         <p
//           style={{
//             fontSize: "12px",
//             color: statusMsg.color,
//             margin: "-8px 0 0",
//           }}
//         >
//           {statusMsg.text}
//         </p>
//       )}

//       <div>
//         <span
//           className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
//           style={{
//             color: "#22C55E",
//             background: "rgba(22,163,74,0.15)",
//             border: "1px solid rgba(22,163,74,0.30)",
//           }}
//         >
//           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//           Status: Live
//         </span>
//       </div>

//       {/* ── Hidden subscriber-admin modal ── */}
//       {showAdmin && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.6)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 9999,
//           }}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowAdmin(false);
//               setAdminOk(false);
//             }
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: "14px",
//               padding: "2rem",
//               width: "min(90vw,560px)",
//               maxHeight: "80vh",
//               display: "flex",
//               flexDirection: "column",
//               gap: "1rem",
//               boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <h3
//                 style={{
//                   margin: 0,
//                   fontSize: "18px",
//                   fontWeight: 700,
//                   color: "#111",
//                 }}
//               >
//                 📊 Subscriber Admin
//               </h3>
//               <button
//                 onClick={() => {
//                   setShowAdmin(false);
//                   setAdminOk(false);
//                 }}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   fontSize: "20px",
//                   cursor: "pointer",
//                   color: "#888",
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             {!adminOk ? (
//               <div>
//                 <p
//                   style={{
//                     color: "#666",
//                     fontSize: "14px",
//                     marginBottom: "1rem",
//                   }}
//                 >
//                   Enter admin code to view subscribers:
//                 </p>
//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <input
//                     type="password"
//                     value={adminCode}
//                     onChange={(e) => setAdminCode(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && unlockAdmin()}
//                     placeholder="Admin code"
//                     style={{
//                       flex: 1,
//                       padding: "10px 14px",
//                       border: "1.5px solid #e0e0e0",
//                       borderRadius: "8px",
//                       fontSize: "14px",
//                       outline: "none",
//                     }}
//                   />
//                   <button
//                     onClick={unlockAdmin}
//                     style={{
//                       background: "#F97316",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "8px",
//                       padding: "10px 20px",
//                       cursor: "pointer",
//                       fontSize: "14px",
//                       fontWeight: 600,
//                     }}
//                   >
//                     Unlock
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div
//                   style={{
//                     background: "#f8fffe",
//                     border: "1px solid #d4f5e8",
//                     borderRadius: "8px",
//                     padding: "12px 16px",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <span
//                     style={{
//                       color: "#1a8f3c",
//                       fontWeight: 600,
//                       fontSize: "14px",
//                     }}
//                   >
//                     Total Subscribers: {subscribers.length}
//                   </span>
//                   <button
//                     onClick={() => setSubscribers(getSubscribers())}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       color: "#888",
//                       fontSize: "13px",
//                     }}
//                   >
//                     ↻ Refresh
//                   </button>
//                 </div>
//                 <div style={{ overflowY: "auto", flex: 1 }}>
//                   {subscribers.length === 0 ? (
//                     <p
//                       style={{
//                         color: "#999",
//                         textAlign: "center",
//                         padding: "2rem",
//                         fontSize: "14px",
//                       }}
//                     >
//                       No subscribers yet. Share the page!
//                     </p>
//                   ) : (
//                     <table
//                       style={{
//                         width: "100%",
//                         borderCollapse: "collapse",
//                         fontSize: "13px",
//                       }}
//                     >
//                       <thead>
//                         <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
//                           <th
//                             style={{
//                               textAlign: "left",
//                               padding: "8px 12px",
//                               color: "#888",
//                               fontWeight: 600,
//                             }}
//                           >
//                             #
//                           </th>
//                           <th
//                             style={{
//                               textAlign: "left",
//                               padding: "8px 12px",
//                               color: "#888",
//                               fontWeight: 600,
//                             }}
//                           >
//                             Email
//                           </th>
//                           <th
//                             style={{
//                               textAlign: "left",
//                               padding: "8px 12px",
//                               color: "#888",
//                               fontWeight: 600,
//                             }}
//                           >
//                             Subscribed
//                           </th>
//                           <th style={{ padding: "8px 12px" }}></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {subscribers.map((sub, i) => (
//                           <tr
//                             key={sub.email}
//                             style={{ borderBottom: "1px solid #f5f5f5" }}
//                           >
//                             <td style={{ padding: "10px 12px", color: "#bbb" }}>
//                               {i + 1}
//                             </td>
//                             <td
//                               style={{
//                                 padding: "10px 12px",
//                                 color: "#111",
//                                 fontWeight: 500,
//                               }}
//                             >
//                               {sub.email}
//                             </td>
//                             <td style={{ padding: "10px 12px", color: "#888" }}>
//                               {formatDate(sub.subscribedAt)}
//                             </td>
//                             <td
//                               style={{
//                                 padding: "10px 12px",
//                                 textAlign: "right",
//                               }}
//                             >
//                               <button
//                                 onClick={() => deleteSubscriber(sub.email)}
//                                 style={{
//                                   background: "none",
//                                   border: "none",
//                                   cursor: "pointer",
//                                   color: "#fc8181",
//                                   fontSize: "16px",
//                                 }}
//                                 title="Remove"
//                               >
//                                 🗑
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* hidden admin trigger — callable from outside via openNewsletterAdmin() */}
//       <div
//         id="newsletter-admin-trigger"
//         onClick={openAdmin}
//         style={{ display: "none" }}
//       />
//     </div>
//   );
// }

// // MentorTestimonialCarousel — horizontally scrollable testimonial cards with
// // arrow navigation + dot pagination. Purely presentational; consumes the
// // same `testimonials` array/state already loaded from the backend — no
// // data-fetching or business logic here.
// // ─────────────────────────────────────────────────────────────────────────────

// // Small avatar helper: shows the backend image in a circular frame,
// // falls back to initials if there's no image or the image fails to load.
// function MentorAvatar({ name, image }) {
//   const [imgError, setImgError] = useState(false);
//   const initials = (name || "").charAt(0).toUpperCase();

//   return (
//     <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-[#1E293B] dark:bg-[#F97316] flex items-center justify-center text-white font-bold text-sm">
//       {image && !imgError ? (
//         <img
//           src={image}
//           alt={name}
//           className="w-full h-full object-cover"
//           onError={() => setImgError(true)}
//         />
//       ) : (
//         <span>{initials}</span>
//       )}
//     </div>
//   );
// }

// function MentorTestimonialCarousel({ testimonials }) {
//   const scrollerRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const scrollToIndex = (index) => {
//     const el = scrollerRef.current;
//     if (!el) return;
//     const card = el.children[index];
//     if (card) {
//       el.scrollTo({
//         left: card.offsetLeft - el.offsetLeft,
//         behavior: "smooth",
//       });
//     }
//     setActiveIndex(index);
//   };

//   const handlePrev = () => scrollToIndex(Math.max(activeIndex - 1, 0));
//   const handleNext = () =>
//     scrollToIndex(Math.min(activeIndex + 1, testimonials.length - 1));

//   const handleScroll = () => {
//     const el = scrollerRef.current;
//     if (!el) return;
//     let closest = 0;
//     let closestDist = Infinity;
//     Array.from(el.children).forEach((child, i) => {
//       const dist = Math.abs(child.offsetLeft - el.scrollLeft - el.offsetLeft);
//       if (dist < closestDist) {
//         closestDist = dist;
//         closest = i;
//       }
//     });
//     setActiveIndex(closest);
//   };

//   if (!testimonials || testimonials.length === 0) return null;

//   return (
//     <div className="relative">
//       <style>{`
//         .mentor-scroll::-webkit-scrollbar { display: none; }
//         .mentor-scroll { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       {/* Prev / Next arrows — desktop & tablet */}
//       <button
//         onClick={handlePrev}
//         aria-label="Previous testimonial"
//         disabled={activeIndex === 0}
//         className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md items-center justify-center hover:bg-[#F6EDE6] dark:hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
//       >
//         <ChevronLeft className="w-4 h-4 text-[#1E293B] dark:text-white" />
//       </button>
//       <button
//         onClick={handleNext}
//         aria-label="Next testimonial"
//         disabled={activeIndex === testimonials.length - 1}
//         className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md items-center justify-center hover:bg-[#F6EDE6] dark:hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
//       >
//         <ChevronRight className="w-4 h-4 text-[#1E293B] dark:text-white" />
//       </button>

//       {/* Card scroller — tightened padding/gaps for a more compact feel */}
//       <div
//         ref={scrollerRef}
//         onScroll={handleScroll}
//         style={{ scrollSnapType: "x mandatory" }}
//         className="mentor-scroll flex gap-4 overflow-x-auto pb-2 px-1"
//       >
//         {testimonials.map((t, i) => (
//           <div
//             key={i}
//             style={{ scrollSnapAlign: "start" }}
//             className="min-w-full sm:min-w-[calc(50%-8px)] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
//           >
//             <div className="flex items-center gap-1 mb-2.5">
//               {[...Array(5)].map((_, j) => (
//                 <Star
//                   key={j}
//                   className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
//                 />
//               ))}
//             </div>
//             <p className="text-gray-600 dark:text-gray-300 mb-3.5 italic leading-snug text-sm">
//               "{t.text}"
//             </p>
//             <div className="flex items-center gap-2.5">
//               <MentorAvatar name={t.name} image={t.image} />
//               <div>
//                 <p className="font-semibold text-[#1E293B] dark:text-white text-sm leading-tight">
//                   {t.name}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
//                   {t.role}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Dot pagination */}
//       <div className="flex items-center justify-center gap-2 mt-4">
//         {testimonials.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => scrollToIndex(i)}
//             aria-label={`Go to testimonial ${i + 1}`}
//             style={{
//               width: activeIndex === i ? "22px" : "8px",
//               height: "8px",
//               borderRadius: "9999px",
//               background: activeIndex === i ? "#F97316" : "#CBD5E1",
//               border: "none",
//               cursor: "pointer",
//               padding: 0,
//               transition: "width 0.3s ease, background 0.3s ease",
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export default function LMSHomepage({ theme, toggleTheme }) {
//   const [activeTab, setActiveTab] = useState("product");
//   const [featuredPrograms, setFeaturedPrograms] = useState({});
//   const [programsLoading, setProgramsLoading] = useState(true);
//   const [wishlist, setWishlist] = useState(new Set());

//   // ── Mentors (testimonials) — now backend-connected ──
//   const [testimonials, setTestimonials] = useState([]);

//   // ── Top Global Companies — now backend-connected ──
//   const [companyData, setCompanyData] = useState(null);
//   const [companiesLoading, setCompaniesLoading] = useState(true);

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [user, setUser] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showSignupModal, setShowSignupModal] = useState(false);
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [modalEmail, setModalEmail] = useState("");
//   const [modalPassword, setModalPassword] = useState("");
//   const [modalLoading, setModalLoading] = useState(false);
//   const [showModalPw, setShowModalPw] = useState(false);

//   const heroImages = [heroStudent, heroStudent2, heroStudent3];
//   const [currentSlide, setCurrentSlide] = useState(-1);
//   const carouselTimerRef = useRef(null);

//   const navigate = useNavigate();

//   const startCarouselTimer = () => {
//     clearInterval(carouselTimerRef.current);
//     carouselTimerRef.current = setInterval(() => {
//       setCurrentSlide((prev) => {
//         if (prev === -1) return 0;
//         if (prev >= heroImages.length - 1) return -1;
//         return prev + 1;
//       });
//     }, 3500);
//   };

//   useEffect(() => {
//     startCarouselTimer();
//     return () => clearInterval(carouselTimerRef.current);
//   }, []);

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     startCarouselTimer();
//   };

//   /* ── Load real featured programs from the backend (courseService) ──
//      Falls back to the static `courses` object below if the API call
//      fails or returns no programs in any category. */
//   useEffect(() => {
//     async function loadPrograms() {
//       try {
//         const { data } = await courseService.getAllFeaturedPrograms();
//         const grouped = {};

//         data.forEach((p) => {
//           const cat = (p.category || "Other").trim();

// if (!grouped[cat]) {
//   grouped[cat] = [];
// }

// grouped[cat].push({
//             id: p.id,
//             title: p.title,
//             instructor: p.instructorRole || p.instructorName,
//             instructorFull: p.instructorName,
//             instructorTitle: p.instructorRole || "",
//             duration: `${p.durationWeeks} weeks`,
//             students: p.studentsEnrolled,
//             rating: p.rating,
//             level: p.level,
//             description: p.shortDescription,
//             modules: (p.syllabusWeeks || []).map((w) => w.title),
//             price: `₹${Number(p.price).toLocaleString("en-IN")}`,
//             highlights: (p.highlights || [])
//               .map((h) => (typeof h === "string" ? h : h?.text || ""))
//               .filter((h) => h && h !== "[object Object]"),
//             learningOutcomes: (p.learningOutcomes || [])
//               .map((t, i) => ({
//                 id: i,
//                 text: typeof t === "string" ? t : t?.text || "",
//               }))
//               .filter((t) => t.text && t.text !== "[object Object]"),
//             totalLessons: p.lessons,
//             projects: p.projects,
//             syllabusWeeks: p.syllabusWeeks || [],
//             enrollmentUrl: p.enrollmentUrl || "",
//             liveSessions: p.liveSessions ?? "—",
//           });
//         });

//         // Only use API data if we actually got programs
//         const hasPrograms = Object.values(grouped).some(
//           (arr) => arr.length > 0,
//         );
//        if (hasPrograms) {
//   setFeaturedPrograms(grouped);

//   const firstCategory = Object.keys(grouped)[0];

//   if (firstCategory) {
//     setActiveTab(firstCategory);
//   }
// }
//         // else featuredPrograms stays empty → fallback to hardcoded courses
//       } catch (err) {
//         console.error("Failed to load featured programs", err);
//       } finally {
//         setProgramsLoading(false);
//       }
//     }
//     loadPrograms();
//   }, []);

//   /* ── Load real mentor feedback (testimonials) from the backend ── */
//   useEffect(() => {
//     async function loadMentorFeedback() {
//       try {
//         const { data } = await courseService.getActiveMentorFeedbacks();
//         const mapped = data.map((m) => ({
//           name: m.candidateName,
//           role: `${m.designation} @ ${m.company}`,
//           text: m.feedbackMessage,
//           // Accept whichever image field the backend actually sends
//           image: m.profileImage || m.image || m.imageUrl || m.photo || null,
//         }));
//         setTestimonials(mapped);
//       } catch (err) {
//         console.error("Failed to load mentor feedback", err);
//       }
//     }
//     loadMentorFeedback();
//   }, []);

//   /* ── Load real companies (tech / business partners + product ecosystem) ── */
//   useEffect(() => {
//     async function loadCompanies() {
//       try {
//         const { data } = await courseService.getActiveCompanies();
//         setCompanyData(data);
//       } catch (err) {
//         console.error("Failed to load companies", err);
//       } finally {
//         setCompaniesLoading(false);
//       }
//     }
//     loadCompanies();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const userData = sessionStorage.getItem("user");
//     if (userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch {
//         sessionStorage.removeItem("user");
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") setShowLoginModal(false);
//     };
//     if (showLoginModal) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [showLoginModal]);

//   useEffect(() => {
//     const handler = (e) => {
//       const { tab } = e.detail || {};
//       if (tab) setActiveTab(tab);
//     };
//     window.addEventListener("mm-course-tab", handler);
//     return () => window.removeEventListener("mm-course-tab", handler);
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   const scrollToSection = (sectionId, tabName = null) => {
//     if (window.location.pathname !== "/") {
//       navigate("/");
//       setTimeout(() => {
//         if (tabName) setActiveTab(tabName);
//         document
//           .getElementById(sectionId)
//           ?.scrollIntoView({ behavior: "smooth", block: "start" });
//       }, 150);
//     } else {
//       if (tabName) setActiveTab(tabName);
//       document
//         .getElementById(sectionId)
//         ?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   /* ── Role-based redirect (full role map, incl. SUPER_ADMIN / TENANT_ADMIN) ── */
//   const redirectByRole = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "SUPER_ADMIN":
//         navigate("/superadmin", { replace: true });
//         break;
//       case "ADMIN":
//         navigate("/admin", { replace: true });
//         break;
//       case "TENANT_ADMIN":
//         navigate("/admin", { replace: true });
//         break;
//       case "BUSINESS":
//         navigate("/admin", { replace: true });
//         break;
//       case "TRAINER":
//         navigate("/trainer", { replace: true });
//         break;
//       default:
//         navigate("/student", { replace: true });
//     }
//   };

//   const handleModalSubmit = async (e) => {
//     e.preventDefault();
//     if (modalLoading) return;
//     setModalLoading(true);
//     try {
//       const ok = await auth.login({
//         email: modalEmail,
//         password: modalPassword,
//       });
//       if (ok) {
//         const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         setShowLoginModal(false);
//         redirectByRole(role);
//       } else {
//         alert("Login failed! Check your credentials.");
//       }
//     } catch (err) {
//       alert("Login error: " + err.message);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   /* ── Google Sign-In — full backend-aware flow ──────────────────────────────
//      Existing users: backend issues a token + role (+ organizationId) and we
//      redirect by role. Brand-new users: we hand off to /complete-profile so
//      they can finish signing up. */
//   const handleModalGoogle = async (res) => {
//     try {
//       localStorage.removeItem("lms_token");
//       localStorage.removeItem("lms_user");
//       localStorage.removeItem("role");

//       const dec = jwtDecode(res.credential);

//       const check = await authService.checkGoogleUser({
//         idToken: res.credential,
//       });

//       // ── EXISTING USER ──────────────────────────────────────────
//       if (check.isNewUser === false && check.token && check.role) {
//         const role = check.role.toUpperCase();
//         localStorage.setItem("lms_token", check.token);
//         localStorage.setItem("role", role);

//         if (check.organizationId) {
//           localStorage.setItem("organizationId", check.organizationId);
//         } else {
//           localStorage.removeItem("organizationId");
//         }

//         localStorage.setItem(
//           "lms_user",
//           JSON.stringify({
//             name: check.name || dec.name,
//             email: check.email || dec.email,
//             role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
//               ? "admin"
//               : role.toLowerCase(),
//             isGoogleUser: true,
//             profileCompleted: true,
//             organizationId: check.organizationId || null,
//           }),
//         );
//         setShowLoginModal(false);
//         redirectByRole(role);
//         return;
//       }

//       // ── BRAND NEW USER ─────────────────────────────────────────
//       sessionStorage.setItem("ilmora_google_credential", res.credential);
//       setShowLoginModal(false);
//       navigate("/complete-profile", {
//         replace: true,
//         state: {
//           name: dec.name,
//           email: dec.email,
//           googleCredential: res.credential,
//           isGoogleUser: true,
//           fromGoogleLogin: true,
//         },
//       });
//     } catch (err) {
//       // Surface the real backend message — blocked user / inactive org / etc.
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Google login failed. Please try again.";
//       alert(message);
//     }
//   };

//   /* ── Hidden subscriber-admin trigger (callable from elsewhere if needed) ── */
//   const openNewsletterAdmin = () => {
//     document.getElementById("newsletter-admin-trigger")?.click();
//   };

//   const courses = {
//     product: [
//       {
//         id: 1,
//         title: "Product Management Mastery",
//         instructor: "Ex-Google PM",
//         duration: "8 weeks",
//         students: "2,500+",
//         rating: 4.9,
//         level: "Intermediate",
//         description:
//           "Master product lifecycle from ideation to launch. Learn roadmapping, prioritization, stakeholder management & metrics that matter.",
//         modules: [
//           "Discovery & Research",
//           "Roadmapping",
//           "Prioritization Frameworks",
//           "Launch Strategy",
//           "Metrics & Analytics",
//         ],
//         price: "₹49,000",
//         highlights: [
//           "Live sessions with Google PMs",
//           "Real case studies",
//           "1:1 mentorship",
//           "Job referral support",
//         ],
//         liveSessions: 5,
//         totalLessons: 81,
//         projects: 3,
//       },
//       {
//         id: 2,
//         title: "Product Analytics",
//         instructor: "Ex-Amazon",
//         duration: "6 weeks",
//         students: "1,800+",
//         rating: 4.8,
//         level: "Advanced",
//         description:
//           "Data-driven product decisions. Master A/B testing, cohort analysis, funnel optimization & retention strategies.",
//         modules: [
//           "SQL for Product Managers",
//           "Experimentation",
//           "Funnel Analysis",
//           "Retention Metrics",
//           "Customer Segmentation",
//         ],
//         price: "₹39,000",
//         highlights: [
//           "Amazon case studies",
//           "Live SQL projects",
//           "Advanced Mixpanel",
//           "Retention frameworks",
//         ],
//         liveSessions: 4,
//         totalLessons: 60,
//         projects: 2,
//       },
//       {
//         id: 3,
//         title: "Product Strategy",
//         instructor: "Ex-Meta",
//         duration: "10 weeks",
//         students: "2,100+",
//         rating: 4.9,
//         level: "Advanced",
//         description:
//           "Strategic frameworks for product success. Positioning, competitive analysis, growth strategies & portfolio management.",
//         modules: [
//           "Market Analysis",
//           "Competitive Strategy",
//           "Growth Playbooks",
//           "Portfolio Management",
//           "Pricing Strategy",
//         ],
//         price: "₹59,000",
//         highlights: [
//           "Meta growth case studies",
//           "Strategy templates",
//           "Live workshops",
//           "Executive simulations",
//         ],
//         liveSessions: 6,
//         totalLessons: 90,
//         projects: 4,
//       },
//     ],
//     design: [
//       {
//         id: 4,
//         title: "UI/UX Design Bootcamp",
//         instructor: "Ex-Airbnb Designer",
//         duration: "12 weeks",
//         students: "3,200+",
//         rating: 5.0,
//         level: "Beginner",
//         description:
//           "Complete UI/UX journey from research to prototype. Figma mastery, design systems & portfolio projects.",
//         modules: [
//           "User Research",
//           "Wireframing",
//           "Prototyping",
//           "Design Systems",
//           "Portfolio Building",
//         ],
//         price: "₹69,000",
//         highlights: [
//           "Airbnb case studies",
//           "Figma certification",
//           "Live design reviews",
//           "Job ready portfolio",
//         ],
//         liveSessions: 8,
//         totalLessons: 110,
//         projects: 5,
//       },
//       {
//         id: 5,
//         title: "Design Systems",
//         instructor: "Ex-Netflix",
//         duration: "8 weeks",
//         students: "1,500+",
//         rating: 4.8,
//         level: "Advanced",
//         description:
//           "Build scalable design systems like Netflix. Components, tokens, documentation & developer handoff.",
//         modules: [
//           "Component Libraries",
//           "Design Tokens",
//           "Documentation",
//           "Dev Handoff",
//           "Scale Patterns",
//         ],
//         price: "₹45,000",
//         highlights: [
//           "Netflix system breakdown",
//           "Figma + Storybook",
//           "Live system audits",
//           "Enterprise patterns",
//         ],
//         liveSessions: 4,
//         totalLessons: 70,
//         projects: 3,
//       },
//       {
//         id: 6,
//         title: "User Research Pro",
//         instructor: "Ex-Microsoft",
//         duration: "6 weeks",
//         students: "1,900+",
//         rating: 4.7,
//         level: "Intermediate",
//         description:
//           "Research methods that drive product decisions. Interviews, surveys, usability testing & synthesis.",
//         modules: [
//           "Interview Techniques",
//           "Survey Design",
//           "Usability Testing",
//           "Synthesis Methods",
//           "Stakeholder Reports",
//         ],
//         price: "₹35,000",
//         highlights: [
//           "Microsoft research frameworks",
//           "Live user testing",
//           "Report templates",
//           "Stakeholder presentations",
//         ],
//         liveSessions: 3,
//         totalLessons: 55,
//         projects: 2,
//       },
//     ],
//     growth: [
//       {
//         id: 7,
//         title: "Growth Marketing",
//         instructor: "Ex-Uber Growth",
//         duration: "8 weeks",
//         students: "2,800+",
//         rating: 4.9,
//         level: "Intermediate",
//         description:
//           "Growth loops, viral mechanics & acquisition strategies that scale businesses.",
//         modules: [
//           "Growth Frameworks",
//           "Viral Loops",
//           "Acquisition Channels",
//           "Experimentation",
//           "Scaling",
//         ],
//         price: "₹49,000",
//         highlights: [
//           "Uber growth case studies",
//           "Live experiments",
//           "Channel deep dives",
//           "Scaling frameworks",
//         ],
//         liveSessions: 5,
//         totalLessons: 75,
//         projects: 3,
//       },
//       {
//         id: 8,
//         title: "SEO & Content Strategy",
//         instructor: "Ex-Spotify",
//         duration: "10 weeks",
//         students: "2,300+",
//         rating: 4.8,
//         level: "Intermediate",
//         description:
//           "Organic growth mastery. Technical SEO, content systems & link building at scale.",
//         modules: [
//           "Technical SEO",
//           "Content Systems",
//           "Link Building",
//           "Analytics",
//           "Scaling Organic",
//         ],
//         price: "₹55,000",
//         highlights: [
//           "Spotify SEO case studies",
//           "Live audits",
//           "Content calendars",
//           "Enterprise SEO",
//         ],
//         liveSessions: 5,
//         totalLessons: 85,
//         projects: 3,
//       },
//       {
//         id: 9,
//         title: "Performance Marketing",
//         instructor: "Ex-Swiggy",
//         duration: "8 weeks",
//         students: "2,600+",
//         rating: 4.9,
//         level: "Advanced",
//         description:
//           "Paid acquisition at scale. Facebook, Google, creative testing & LTV optimization.",
//         modules: [
//           "Facebook Ads",
//           "Google Ads",
//           "Creative Strategy",
//           "LTV Optimization",
//           "Scaling",
//         ],
//         price: "₹47,000",
//         highlights: [
//           "Swiggy ad case studies",
//           "Live campaign builds",
//           "Creative testing",
//           "ROAS frameworks",
//         ],
//         liveSessions: 5,
//         totalLessons: 72,
//         projects: 4,
//       },
//     ],
//   };

//   const features = [
//     {
//       icon: Target,
//       title: "Project-Based Learning",
//       description: "Build real-world projects that showcase your skills",
//     },
//     {
//       icon: Users,
//       title: "Expert Mentorship",
//       description: "Learn from professionals at top tech companies",
//     },
//     {
//       icon: Trophy,
//       title: "Career Support",
//       description: "Get help with resumes, interviews & job referrals",
//     },
//     {
//       icon: Zap,
//       title: "Live Sessions",
//       description: "Interactive workshops with industry experts",
//     },
//   ];

//   const stats = [
//     { value: "50K+", label: "Active Learners" },
//     { value: "95%", label: "Success Rate" },
//     { value: "100+", label: "Expert Mentors" },
//     { value: "4.9★", label: "Average Rating" },
//   ];

//   const mentorBenefits = [
//     { icon: Award, text: "1:1 mentorship and small cohort learning" },
//     { icon: TrendingUp, text: "Project reviews with detailed feedback" },
//     { icon: Users, text: "Peer community for accountability and networking" },
//   ];

//   const careerSupport = [
//     {
//       icon: Target,
//       title: "Portfolio Support",
//       description: "Turn your projects into case studies hiring managers love",
//     },
//     {
//       icon: Award,
//       title: "Interview Prep",
//       description:
//         "Mock interviews, feedback and guidance on role expectations",
//     },
//     {
//       icon: Users,
//       title: "Referrals & Network",
//       description: "Warm intros to hiring teams and community-led referrals",
//     },
//   ];

//   const getLevelColor = (level) =>
//     ({
//       Beginner:
//         "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//       Intermediate: "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20",
//       Advanced:
//         "bg-[#1E293B]/10 text-[#1E293B] dark:bg-white/10 dark:text-white border border-[#1E293B]/20 dark:border-white/20",
//     })[level] || "bg-gray-100 text-gray-700";

//   /* ── Presentational-only helpers for the redesigned course cards ──
//      These do not touch any API/data-fetching logic — they simply
//      derive display values (initials, strike-through price, discount
//      badge) from the existing course fields. */
//   const getInitials = (name = "") =>
//     name
//       .replace(/^Ex-/i, "")
//       .split(" ")
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((w) => w[0])
//       .join("")
//       .toUpperCase() || "IN";

//   const getPricing = (price) => {
//     const current = parseInt(String(price).replace(/[^\d]/g, ""), 10) || 0;
//     const original = Math.round((current * 1.35) / 1000) * 1000;
//     const discount =
//       original > current
//         ? Math.round(((original - current) / original) * 100)
//         : 0;
//     return {
//       current: `₹${current.toLocaleString("en-IN")}`,
//       original: `₹${original.toLocaleString("en-IN")}`,
//       discount,
//     };
//   };

//   const toggleWishlist = (id) => {
//     setWishlist((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) {
//         next.delete(id);
//       } else {
//         next.add(id);
//       }
//       return next;
//     });
//   };

//   const navLinks = [
//     { text: "Mentors", href: "#mentors" },
//     { text: "Success Stories", href: "#successstories" },
//   ];

//   const navButtons = [];

//   /* ── Top Global Companies — derived from backend `companyData`,
//      falling back to static data while loading / on empty response. ── */
//   const mapCompany = (c) => ({
//     src: c.uploadedLogo || c.logoUrl,
//     name: c.name,
//     desc: c.description,
//   });

//   const techPartners = companyData?.["Technology Partner"]?.length
//     ? companyData["Technology Partner"].map(mapCompany)
//     : FALLBACK_TECH_PARTNERS;

//   const bizPartners = companyData?.["Business Partner"]?.length
//     ? companyData["Business Partner"].map(mapCompany)
//     : FALLBACK_BIZ_PARTNERS;

//   const ecosystemProducts = companyData?.["Texora Product"]?.length
//     ? companyData["Texora Product"].map((c, i) => ({
//         ...mapCompany(c),
//         color: ECOSYSTEM_COLORS[i % ECOSYSTEM_COLORS.length],
//       }))
//     : null;

//   return (
//     <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
//       {/* ── Full-Screen Mobile Menu ── */}
//       {mobileMenuOpen && (
//         <MobileFullScreenMenu
//           onClose={() => setMobileMenuOpen(false)}
//           navLinks={navLinks}
//           navButtons={navButtons}
//           user={user}
//           navigate={navigate}
//           handleLogout={handleLogout}
//           setShowLoginModal={setShowLoginModal}
//         />
//       )}

//       {/* ── Nav ── */}
//       <nav
//         className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#1F1D1F]/95 border-b border-[#F97316]/20 ${
//           scrolled
//             ? "backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
//             : "backdrop-blur-md"
//         }`}
//       >
//         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-[68px]">
//             {/* Logo */}
//             <div
//               className="flex items-center cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
//               onClick={() => navigate("/")}
//             >
//               <span className="text-[28px] sm:text-[32px] font-extrabold tracking-wide font-serif leading-none whitespace-nowrap">
//                 <span className="text-green-600">ILM</span>
//                 <span className="text-[#F97316] ml-1">ORA</span>
//                 <span className="inline-flex items-center bg-orange-50 border border-[#F97316] rounded ml-1.5 px-1.5 py-0.5 text-[0.45rem] sm:text-[0.5rem] font-sans font-semibold tracking-widest text-[#F97316] uppercase leading-snug align-middle">
//                   Beta
//                 </span>
//               </span>
//             </div>

//             {/* Desktop Nav — visible from lg (1024px) and above */}
//             <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4 xl:mx-6">
//               <MegaMenu />
//               {/* ILM ORA Feature Dropdown */}
//               <div className="relative group">
//                 <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
//                   ILM ORA Feature
//                   <ChevronDown className="w-4 h-4" />
//                 </button>

//                 <div className="absolute top-full left-0 mt-2 w-80 bg-[#232323] border border-white/[0.08] rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   <button
//                     onClick={() => navigate("/student-hub")}
//                     className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
//                   >
//                     <div className="flex items-start gap-3">
//                       <GraduationCap className="w-5 h-5 text-green-600 mt-1" />
//                       <div>
//                         <div className="font-semibold text-sm text-white">Student Hub</div>
//                         <div className="text-xs text-gray-400">
//                           AI-Powered Learning & Career Growth
//                         </div>
//                       </div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => navigate("/trainer-hub")}
//                     className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
//                   >
//                     <div className="flex items-start gap-3">
//                       <Users className="w-5 h-5 text-blue-600 mt-1" />
//                       <div>
//                         <div className="font-semibold text-sm text-white">Trainer Hub</div>
//                         <div className="text-xs text-gray-400">
//                           Training Management & Mentorship
//                         </div>
//                       </div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => navigate("/manager-hub")}
//                     className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
//                   >
//                     <div className="flex items-start gap-3">
//                       <BarChart3 className="w-5 h-5 text-purple-600 mt-1" />
//                       <div>
//                         <div className="font-semibold text-sm text-white">Manager Hub</div>
//                         <div className="text-xs text-gray-400">
//                           Analytics, Performance & Team Development
//                         </div>
//                       </div>
//                     </div>
//                   </button>

//                   {/* Divider */}
//                   <div className="border-t border-white/[0.08] my-2"></div>

//                   {/* ILM ORA Meet */}
//                   <button
//                     onClick={() => navigate("/ilm-ora-meet")}
//                     className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
//                   >
//                     <div className="flex items-start gap-3">
//                       <Users className="w-5 h-5 text-orange-500 mt-1" />
//                       <div>
//                         <div className="font-semibold text-sm text-white">
//                           ILM ORA Meet
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           Virtual Meetings & Collaboration
//                         </div>
//                       </div>
//                     </div>
//                   </button>

//                   {/* AI Resume Builder */}
//                   <button
//                     onClick={() => navigate("/resume-builder")}
//                     className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
//                   >
//                     <div className="flex items-start gap-3">
//                       <FileText className="w-5 h-5 text-green-600 mt-1" />
//                       <div>
//                         <div className="font-semibold text-sm text-white">
//                           AI Resume Builder
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           Create ATS-Friendly Professional Resumes
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* More Dropdown */}
//               <div className="relative group">
//                 <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
//                   More
//                   <ChevronDown className="w-4 h-4" />
//                 </button>

//                 <div className="absolute top-full left-0 mt-2 w-52 bg-[#232323] rounded-xl shadow-xl border border-white/[0.08] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   {navLinks.map((link) => (
//                     <button
//                       key={link.text}
//                       onClick={() => {
//                         document
//                           .querySelector(link.href)
//                           ?.scrollIntoView({ behavior: "smooth" });
//                       }}
//                       className="w-full text-left px-4 py-3 hover:bg-[#F97316]/[0.12] text-sm text-white transition-colors duration-300"
//                     >
//                       {link.text}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right side */}
//             <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
//               <button
//                 onClick={toggleTheme}
//                 className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] hover:border-[#F97316] transition-colors duration-300 shadow-sm bg-[#2A2A2A] flex-shrink-0"
//               >
//                 {theme === "dark" ? (
//                   <Sun className="w-[18px] h-[18px] text-[#F97316]" />
//                 ) : (
//                   <Moon className="w-[18px] h-[18px] text-gray-300" />
//                 )}
//               </button>

//               {user ? (
//                 <div className="hidden lg:block">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="gap-2 rounded-xl border-white/[0.08] bg-[#2A2A2A] hover:border-[#F97316] text-white h-10 px-3"
//                       >
//                         <Avatar className="w-7 h-7">
//                           <AvatarImage src={user.picture} alt={user.name} />
//                           <AvatarFallback className="bg-[#1E293B] text-white text-xs">
//                             {user.name?.charAt(0) || (
//                               <User className="w-3 h-3" />
//                             )}
//                           </AvatarFallback>
//                         </Avatar>
//                         <ChevronDown className="w-3 h-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                       align="end"
//                       className="w-72 bg-[#232323] border-white/[0.08]"
//                     >
//                       <div className="px-3 py-3 bg-[#2A2A2A] rounded-t-md">
//                         <p className="font-semibold text-sm text-white truncate">
//                           {user.name || "User"}
//                         </p>
//                         <p className="text-xs text-gray-400 truncate">
//                           {user.email}
//                         </p>
//                       </div>
//                       <DropdownMenuSeparator />
//                       {[
//                         {
//                           icon: GraduationCap,
//                           label: "My Learning",
//                           desc: "View your courses",
//                           path: "/my-learning",
//                         },
//                         {
//                           icon: User,
//                           label: "Edit Profile",
//                           desc: "Update your info",
//                           path: "/edit-profile",
//                         },
//                       ].map((item) => (
//                         <DropdownMenuItem
//                           key={item.label}
//                           onClick={() => navigate(item.path)}
//                           className="gap-3 cursor-pointer"
//                         >
//                           <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
//                             <item.icon className="w-4 h-4 text-[#F97316]" />
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-white">{item.label}</p>
//                             <p className="text-xs text-gray-400">{item.desc}</p>
//                           </div>
//                         </DropdownMenuItem>
//                       ))}
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem
//                         onClick={handleLogout}
//                         className="gap-3 text-red-600 cursor-pointer"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         <span className="text-sm font-medium">Logout</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               ) : (
//                 <Button
//                   onClick={() => setShowLoginModal(true)}
//                   className="hidden lg:flex bg-gradient-to-br from-[#F97316] to-[#EA580C] hover:from-[#F97316] hover:to-[#EA580C] text-white font-bold px-4 xl:px-5 py-2.5 rounded-xl items-center gap-2 shadow-md hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition-all duration-300 text-[13px] xl:text-[15px] h-10 whitespace-nowrap"
//                 >
//                   <Sparkles className="w-4 h-4" /> Get Started
//                 </Button>
//               )}

//               {/* Hamburger — only shown below lg (below 1024px) */}
//               <button
//                 className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:border-[#F97316] bg-[#2A2A2A] transition-colors duration-300 shadow-sm"
//                 aria-label="Open menu"
//                 onClick={() => setMobileMenuOpen(true)}
//               >
//                 <Menu className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* ── Hero ── */}
//       <section className="pt-32 pb-24 px-6 bg-[#F6EDE6] dark:bg-black relative overflow-hidden">
//         <div className="absolute -top-32 left-[10%] w-[600px] h-[600px] bg-[#F97316]/8 dark:bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />
//         <div className="absolute -bottom-20 right-[5%] w-[500px] h-[500px] bg-[#1E293B]/5 rounded-full blur-[120px] pointer-events-none" />

//         <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
//           <div className="text-center lg:text-left">
//             <div className="mb-8 inline-flex">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#F97316] text-sm font-semibold mb-6">
//   <Sparkles className="w-4 h-4" />
//   Learn Smarter. Grow Faster. Lead the Future.
// </div>
//             </div>
//          <h1 className="mb-6 leading-[1.1]">
//   <SplitText
//     text="Empower Your"
//     className="block text-4xl md:text-5xl lg:text-7xl font-bold text-[#1E293B] dark:text-white"
//     splitType="chars"
//     delay={60}
//     duration={0.6}
//   />
//   <SplitText
//     text="Learning Journey"
//     className="block text-4xl md:text-5xl lg:text-7xl font-bold text-[#F97316]"
//     splitType="chars"
//     delay={60}
//     duration={0.6}
//   />
// </h1>
//             <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl leading-relaxed">
//   Master in-demand skills through AI-powered learning, live sessions,
//   certifications, and expert-led programs designed for students,
//   professionals, trainers, and organizations.
// </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start">
              
//             </div>
//           </div>

//           <div className="flex flex-col items-center gap-4">
//             <div
//               className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
//               style={{ aspectRatio: "4/3" }}
//             >
//               <video
//                 src={heroVideo}
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className="absolute inset-0 w-full h-full object-cover rounded-2xl"
//                 style={{
//                   opacity: currentSlide === -1 ? 1 : 0,
//                   transform: currentSlide === -1 ? "scale(1)" : "scale(0.96)",
//                   transition: "opacity 0.6s ease, transform 0.6s ease",
//                   zIndex: currentSlide === -1 ? 2 : 1,
//                   pointerEvents: currentSlide === -1 ? "auto" : "none",
//                 }}
//               />
//               {heroImages.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`Hero Student ${index + 1}`}
//                   className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
//                   style={{
//                     opacity: currentSlide === index ? 1 : 0,
//                     transform:
//                       currentSlide === index ? "scale(1)" : "scale(0.96)",
//                     transition: "opacity 0.6s ease, transform 0.6s ease",
//                     zIndex: currentSlide === index ? 2 : 1,
//                     pointerEvents: currentSlide === index ? "auto" : "none",
//                   }}
//                 />
//               ))}
//             </div>

//             <div className="flex items-center gap-2.5">
//               <button
//                 onClick={() => goToSlide(-1)}
//                 aria-label="Show video"
//                 style={{
//                   width: currentSlide === -1 ? "28px" : "10px",
//                   height: "10px",
//                   borderRadius: "9999px",
//                   background: currentSlide === -1 ? "#22c55e" : "#CBD5E1",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: 0,
//                   transition: "width 0.35s ease, background 0.35s ease",
//                 }}
//               />
//               {heroImages.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => goToSlide(index)}
//                   aria-label={`Go to slide ${index + 1}`}
//                   style={{
//                     width: currentSlide === index ? "28px" : "10px",
//                     height: "10px",
//                     borderRadius: "9999px",
//                     background: currentSlide === index ? "#F97316" : "#CBD5E1",
//                     border: "none",
//                     cursor: "pointer",
//                     padding: 0,
//                     transition: "width 0.35s ease, background 0.35s ease",
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Stats ── */}
//       <section className="py-16 px-6 bg-white dark:bg-gray-900/50">
//         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
//           {stats.map((stat, i) => (
//             <div
//               key={i}
//               className="bg-[#F6EDE6] dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
//             >
//               <div className="text-4xl md:text-5xl font-bold text-[#F97316] mb-2">
//                 {stat.value}
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 font-medium">
//                 {stat.label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//       {/* ── WatchNow ── */}
//       <WatchNowSection />

//       {/* ── Features ── */}
//       <section className="py-24 px-6 bg-[#F6EDE6] dark:bg-black">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
//               Why Choose
//               <span className="ml-2">
//                 <span className="text-green-600">ILM</span>{" "}
//                 <span className="text-[#F97316]">ORA</span>
//               </span>
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//               Everything you need to accelerate your career growth
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group"
//               >
//                 <div className="w-14 h-14 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
//                   <feature.icon className="w-7 h-7 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Companies (Top Global Companies — backend-connected) ── */}
//       <section className="py-20 px-4 sm:px-6 bg-white dark:bg-gray-900/30">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-14">
//             <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-gray-400 font-bold mb-3">
//               Trusted By Professionals At
//             </p>
//             <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">
//               Top Global <span className="text-[#F97316]">Companies</span>
//             </h2>
//             <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 max-w-[600px] mx-auto leading-relaxed">
//               We collaborate with leading technology providers and business
//               organizations to deliver innovative digital solutions.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
//             <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
//               <div className="flex flex-col items-center mb-2">
//                 <div className="flex items-center gap-2.5 mb-5">
//                   <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
//                     <svg
//                       viewBox="0 0 24 24"
//                       className="w-5 h-5 text-blue-500 dark:text-blue-400"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.8"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <rect x="2" y="3" width="20" height="14" rx="2" />
//                       <path d="M8 21h8M12 17v4" />
//                     </svg>
//                   </div>
//                   <span className="text-[13px] font-black tracking-[0.13em] uppercase text-blue-600 dark:text-blue-400">
//                     Technology Partners
//                   </span>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {techPartners.map((p) => (
//                   <div
//                     key={p.name}
//                     className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
//                   >
//                     <div className="w-full h-11 flex items-center justify-center">
//                       <img
//                         src={p.src}
//                         alt={p.name}
//                         className="max-w-full max-h-10 object-contain"
//                         onError={(e) => {
//                           e.currentTarget.style.display = "none";
//                           const sib = e.currentTarget.nextSibling;
//                           if (sib) sib.style.display = "flex";
//                         }}
//                       />
//                       <div className="hidden w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center text-[10px] font-bold text-gray-400 text-center leading-tight px-1">
//                         {p.name}
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-[12px] sm:text-[13px] font-bold text-[#0F172A] dark:text-white leading-tight">
//                         {p.name}
//                       </p>
//                       <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
//                         {p.desc}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
//               <div className="flex flex-col items-center mb-2">
//                 <div className="flex items-center gap-2.5 mb-5">
//                   <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 flex items-center justify-center flex-shrink-0">
//                     <svg
//                       viewBox="0 0 24 24"
//                       className="w-5 h-5 text-green-600 dark:text-green-400"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.8"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//                       <circle cx="9" cy="7" r="4" />
//                       <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//                       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                     </svg>
//                   </div>
//                   <span className="text-[13px] font-black tracking-[0.13em] uppercase text-green-600 dark:text-green-400">
//                     Business Partners
//                   </span>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {bizPartners.map((p) => (
//                   <div
//                     key={p.name}
//                     className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-7 flex flex-col items-center gap-4 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
//                   >
//                     <div className="w-full h-14 sm:h-16 flex items-center justify-center">
//                       <img
//                         src={p.src}
//                         alt={p.name}
//                         className="max-w-full max-h-12 object-contain"
//                         onError={(e) => {
//                           e.currentTarget.style.display = "none";
//                           const sib = e.currentTarget.nextSibling;
//                           if (sib) sib.style.display = "flex";
//                         }}
//                       />
//                       <div className="hidden w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center text-[10px] font-bold text-gray-400 text-center leading-tight px-1">
//                         {p.name}
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] dark:text-white leading-tight">
//                         {p.name}
//                       </p>
//                       <p className="text-[11px] sm:text-[12px] text-gray-400 dark:text-gray-500 mt-1 leading-snug">
//                         {p.desc}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
//             <div className="flex items-center gap-3 sm:gap-5 mb-7 sm:mb-9">
//               <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
//               <div className="flex-shrink-0 text-center">
//                 <p className="text-[12px] sm:text-[13px] font-black tracking-[0.15em] uppercase text-[#0F172A] dark:text-white whitespace-nowrap">
//                   Texora Product Ecosystem
//                 </p>
//                 <div className="w-8 h-[3px] bg-[#F97316] rounded-full mx-auto mt-1.5" />
//               </div>
//               <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
//             </div>

//             <style>{`
//               .eco-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
//               @media (max-width: 1279px) { .eco-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
//               @media (max-width: 639px)  { .eco-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); } }
//             `}</style>

//             <div className="eco-grid">
//               {(ecosystemProducts || FALLBACK_ECOSYSTEM).map((item) => {
//                 const colorMap = {
//                   blue: {
//                     bg: "bg-blue-100 dark:bg-blue-900/30",
//                     text: "text-blue-600 dark:text-blue-400",
//                     label: "text-blue-700 dark:text-blue-300",
//                   },
//                   orange: {
//                     bg: "bg-orange-100 dark:bg-orange-900/30",
//                     text: "text-[#F97316]",
//                     label: "text-[#F97316]",
//                   },
//                   purple: {
//                     bg: "bg-purple-100 dark:bg-purple-900/30",
//                     text: "text-purple-600 dark:text-purple-400",
//                     label: "text-purple-700 dark:text-purple-300",
//                   },
//                   green: {
//                     bg: "bg-green-100 dark:bg-green-900/30",
//                     text: "text-green-600 dark:text-green-400",
//                     label: "text-green-700 dark:text-green-300",
//                   },
//                   rose: {
//                     bg: "bg-rose-100 dark:bg-rose-900/30",
//                     text: "text-rose-600 dark:text-rose-400",
//                     label: "text-rose-700 dark:text-rose-300",
//                   },
//                 };
//                 const c = colorMap[item.color];
//                 return (
//                   <div
//                     key={item.name}
//                     className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
//                   >
//                     <div
//                       className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden`}
//                     >
//                       {item.src ? (
//                         <img
//                           src={item.src}
//                           alt={item.name}
//                           className="w-8 h-8 object-contain"
//                           onError={(e) => {
//                             e.currentTarget.style.display = "none";
//                           }}
//                         />
//                       ) : item.Icon ? (
//                         <item.Icon className={`w-6 h-6 ${c.text}`} />
//                       ) : item.svgPath ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className={`w-6 h-6 ${c.text}`}
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="1.8"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           {item.svgPath}
//                         </svg>
//                       ) : (
//                         <span className={`text-sm font-black ${c.text}`}>
//                           {item.name?.charAt(0) || "?"}
//                         </span>
//                       )}
//                     </div>
//                     <p
//                       className={`text-[13px] font-black tracking-wide ${c.label}`}
//                     >
//                       {item.name}
//                     </p>
//                     <div
//                       className={`w-7 h-[3px] rounded-full bg-current ${c.text}`}
//                     />
//                     <p className="text-[11px] sm:text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
//                       {item.desc}
//                     </p>
//                     <a
//                       href="/"
//                       onClick={(e) => e.preventDefault()}
//                       className={`text-[11px] sm:text-[12px] font-semibold flex items-center gap-1 mt-1 transition-opacity hover:opacity-70 ${c.text}`}
//                     >
//                       Explore{" "}
//                       <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
//                     </a>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Courses ── */}
//       <section
//         id="courses"
//         className="py-12 sm:py-16 scroll-mt-20 bg-[#F8FAFC] dark:bg-black"
//       >
//         <div className="max-w-[1440px] mx-auto px-6">
//           {/* ── Premium Section Header ── */}
//           <div className="text-center mb-6 sm:mb-8">
//             <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-3">
//               <Sparkles className="w-3.5 h-3.5" />
//               Handpicked for you
//             </span>
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 tracking-tight text-[#1E293B] dark:text-white">
//               Featured <span className="text-[#F97316]">Programs</span>
//             </h2>
//             <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
//               Choose your path and start building skills that matter — taught
//               by mentors who've shipped at the world's best companies.
//             </p>
//           </div>

//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="w-full"
//           >
//             {/* ── Category Tabs: compact carousel, scales to 10/20/50+ categories
//                  without ever wrapping to multiple rows. Arrows + drag + wheel
//                  + native swipe, active tab always auto-scrolled into view. ── */}
//             <div className="mb-6 sm:mb-8 mx-auto w-fit max-w-full sm:max-w-3xl px-1 sm:px-0">
//               <div className="h-[42px] flex items-center px-1 sm:px-1.5 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden">
//                 <CategoryTabScroller activeKey={activeTab}>
//                   <TabsList className="flex w-max items-center justify-center gap-1.5 bg-transparent mx-auto h-full">
//                     {Object.keys(
//                       programsLoading
//                         ? courses
//                         : featuredPrograms &&
//                             Object.values(featuredPrograms).some(
//                               (a) => a.length > 0,
//                             )
//                           ? featuredPrograms
//                           : courses,
//                     ).map((tab) => (
//                       <TabsTrigger
//                         key={tab}
//                         value={tab}
//                         className="rounded-full capitalize font-semibold text-xs sm:text-sm whitespace-nowrap px-3.5 sm:px-5 h-[34px] flex-shrink-0 flex items-center text-[#1E293B] dark:text-gray-300 transition-all duration-300 ease-out data-[state=active]:bg-[#F97316] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30"
//                       >
//                         {tab}
//                       </TabsTrigger>
//                     ))}
//                   </TabsList>
//                 </CategoryTabScroller>
//               </div>
//             </div>

//             {/* Real featured programs from the backend (with hardcoded
//                `courses` as the fallback while loading or if the API
//                returns nothing). */}
//             {Object.entries(
//               programsLoading
//                 ? courses
//                 : featuredPrograms &&

//                     Object.values(featuredPrograms).some((a) => a.length > 0)
//                   ? featuredPrograms
//                   : courses,
//             ).map(([category, categoryCourses]) => (
//               <TabsContent key={category} value={category}>
//                 <HorizontalCarousel
//                   items={categoryCourses}
//                   ariaLabel={`${category} courses`}
//                   getKey={(course) => course.id}
//                   cardMinHeight={300}
//                   renderItem={(course, idx) => {
//                     const pricing = getPricing(course.price);
//                     const isBestseller = course.rating >= 4.8;
//                     const lessons =
//                       course.totalLessons || course.modules?.length || 0;
//                     const isWishlisted = wishlist.has(course.id);

//                     return (
//                       <div
//                         onClick={() =>
//                           navigate(`/course-details/${course.id}`, {
//                             state: { course },
//                           })
//                         }
//                         className="group relative flex flex-col min-w-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden cursor-pointer w-full h-full"
//                       >
//                         {/* ── Thumbnail / Banner ── */}
//                         <div className="relative h-16 sm:h-20 overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#F97316] flex-shrink-0">
//                           <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
//                           <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
//                             <GraduationCap
//                               className="w-8 h-8 sm:w-10 sm:h-10 text-white/25"
//                               strokeWidth={1.25}
//                             />
//                           </div>

//                           {/* Top badges */}
//                           <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
//                             <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide bg-white/95 text-[#F97316] px-2 py-0.5 rounded-full shadow-sm">
//                               <Sparkles className="w-2.5 h-2.5" />
//                               {isBestseller ? "Bestseller" : "Featured"}
//                             </span>

//                             <button
//                               type="button"
//                               aria-label={
//                                 isWishlisted
//                                   ? "Remove from wishlist"
//                                   : "Add to wishlist"
//                               }
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 toggleWishlist(course.id);
//                               }}
//                               className="flex items-center justify-center w-7 h-7 rounded-full bg-white/95 shadow-sm hover:scale-110 active:scale-95 transition-transform duration-200"
//                             >
//                               <Heart
//                                 className={`w-3.5 h-3.5 transition-colors ${
//                                   isWishlisted
//                                     ? "fill-[#F97316] text-[#F97316]"
//                                     : "text-[#1E293B]"
//                                 }`}
//                               />
//                             </button>
//                           </div>

//                           {/* Difficulty badge */}
//                           <div className="absolute bottom-2 left-2 right-2 max-w-[70%]">
//                             <span
//                               className={`inline-block max-w-full truncate align-bottom text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${getLevelColor(course.level)} bg-white/95 dark:bg-white/95`}
//                             >
//                               {course.level}
//                             </span>
//                           </div>

//                         </div>

//                         {/* ── Body ── */}
//                         <div className="flex flex-col flex-1 min-w-0 p-2.5 sm:p-3 pt-2.5">
//                           <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-1 truncate">
//                             {category}
//                           </span>

//                           <h3 className="text-sm sm:text-base font-bold text-[#1E293B] dark:text-white mb-1 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-[#F97316] transition-colors">
//                             {course.title}
//                           </h3>

//                           {/* Instructor */}
//                           <div className="flex items-center gap-1.5 mb-1.5 min-w-0">
//                             <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white text-[9px] font-bold shrink-0">
//                               {getInitials(
//                                 course.instructorFull || course.instructor,
//                               )}
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <p className="text-xs font-semibold text-[#1E293B] dark:text-white truncate">
//                                 {course.instructorFull || course.instructor}
//                               </p>
//                               <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
//                                 {course.instructorTitle || course.instructor}
//                               </p>
//                             </div>
//                           </div>

//                           <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 leading-relaxed line-clamp-2 min-h-[2.2em]">
//                             {course.description}
//                           </p>

//                           {/* Skill chips */}
//                           <div className="flex flex-wrap gap-1 mb-1.5 overflow-hidden max-h-[24px]">
//                             <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/15 whitespace-nowrap flex-shrink-0 truncate max-w-[120px]">
//                               {category}
//                             </span>
//                             <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1E293B]/5 text-[#1E293B] dark:bg-white/10 dark:text-gray-200 border border-[#1E293B]/10 dark:border-white/10 whitespace-nowrap flex-shrink-0">
//                               {course.level}
//                             </span>
//                             {course.liveSessions !== undefined &&
//                               course.liveSessions !== "—" && (
//                                 <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
//                                   {course.liveSessions} Live
//                                 </span>
//                               )}
//                           </div>

//                           {/* Stats */}
//                           <div className="grid grid-cols-4 gap-1 text-center mb-1.5 pb-1.5 border-b border-gray-100 dark:border-gray-800">
//                             <div className="flex flex-col items-center gap-0.5 min-w-0">
//                               <Star className="w-3 h-3 text-[#F97316] flex-shrink-0" />
//                               <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
//                                 {course.rating ?? "—"}
//                               </span>
//                             </div>
//                             <div className="flex flex-col items-center gap-0.5 min-w-0">
//                               <Users className="w-3 h-3 text-[#F97316] flex-shrink-0" />
//                               <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
//                                 {course.students ?? "—"}
//                               </span>
//                             </div>
//                             <div className="flex flex-col items-center gap-0.5 min-w-0">
//                               <Clock className="w-3 h-3 text-[#F97316] flex-shrink-0" />
//                               <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
//                                 {course.duration ?? "—"}
//                               </span>
//                             </div>
//                             <div className="flex flex-col items-center gap-0.5 min-w-0">
//                               <PlayCircle className="w-3 h-3 text-[#F97316] flex-shrink-0" />
//                               <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
//                                 {lessons ?? "—"}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Pricing */}
//                           <div className="flex items-end justify-between mb-1.5 gap-2">
//                             <div className="flex items-baseline gap-1.5 min-w-0 flex-shrink">
//                               <span className="text-base sm:text-lg font-bold text-[#1E293B] dark:text-white truncate">
//                                 {pricing.current ?? "—"}
//                               </span>
//                               {pricing.discount > 0 && (
//                                 <span className="text-xs text-gray-400 line-through truncate">
//                                   {pricing.original}
//                                 </span>
//                               )}
//                             </div>
//                             {pricing.discount > 0 && (
//                               <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
//                                 {pricing.discount}% OFF
//                               </span>
//                             )}
//                           </div>

//                           {/* CTA */}
//                           <button
//                             type="button"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/course-details/${course.id}`, {
//                                 state: { course },
//                               });
//                             }}
//                             className="mt-auto w-full flex-shrink-0 bg-gradient-to-r from-[#F97316] to-[#ea580c] hover:brightness-105 text-white py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:scale-[1.02] shadow-sm shadow-orange-500/20"
//                           >
//                             View Details
//                             <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   }}
//                 />
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//       </section>
     
//       {/* ── Mentors (testimonials — backend-connected) ── */}
//       <section
//         id="mentors"
//         className="py-24 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30"
//       >
//         <style>{`
//           @media (min-width: 1024px) {
//             .mentors-section-heading {
//               white-space: nowrap;
//               font-size: clamp(1.9rem, 2.6vw, 3rem);
//             }
//           }
//         `}</style>
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             <div>
//               <h2 className="mentors-section-heading text-4xl md:text-5xl font-bold mb-5 text-[#1E293B] dark:text-white">
//                 Learn from{" "}
//                 <span className="text-[#F97316]">Industry Experts</span>
//               </h2>
//               <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
//                 Sessions led by operators from top product companies so you
//                 understand how work happens in the real world.
//               </p>
//               <div className="space-y-3">
//                 {mentorBenefits.map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-[#F6EDE6] dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3"
//                   >
//                     <div className="w-9 h-9 bg-[#1E293B] dark:bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
//                       <item.icon className="w-4.5 h-4.5 text-white" />
//                     </div>
//                     <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
//                       {item.text}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <MentorTestimonialCarousel testimonials={testimonials} />
//           </div>
//         </div>
//       </section>

//       {/* ── Career Support ── */}
//       <section
//         id="successstories"
//         className="py-24 px-6 scroll-mt-20 bg-[#F6EDE6] dark:bg-black"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-14">
//             <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
//               Career Support That{" "}
//               <span className="text-[#F97316]">Delivers Results</span>
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//               Get help with interview prep, portfolios, referrals and role
//               mapping
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-3 gap-8 mb-16">
//             {careerSupport.map((item, i) => (
//               <div
//                 key={i}
//                 className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all"
//               >
//                 <div className="w-16 h-16 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
//                   <item.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">
//                   {item.title}
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* ── Wide banner CTA ── */}
//           <div className="bg-[#F6EDE6] dark:bg-gray-900 rounded-3xl relative overflow-hidden border border-[#F97316]/20 shadow-xl">
//             <div className="flex flex-col lg:flex-row items-stretch">
//               {/* ── Left: full-bleed image, fixed height, cropped to fill ── */}
//               <div className="w-full lg:w-[280px] xl:w-[320px] h-56 sm:h-64 lg:h-auto flex-shrink-0 overflow-hidden">
//                 <img
//                   src={ctaStudent}
//                   alt="Student ready to transform their career"
//                   className="w-full h-full object-cover object-top"
//                 />
//               </div>

//               {/* ── Middle: Content ── */}
//               <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-10 lg:py-8">
                
//                 <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-[#1E293B] dark:text-white leading-tight">
//                   Ready to Transform Your Career?
//                 </h3>
//                 <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl">
//                   Join 5000+ professionals who've already taken the leap
//                   with our project-based programs and expert mentorship.
//                 </p>
//               </div>

//               {/* ── Right: CTA button ── */}
//               <div className="flex items-center justify-center lg:justify-end px-6 sm:px-10 pb-10 lg:pb-0 lg:pr-10">
//                 <button
//                   onClick={() => scrollToSection("courses")}
//                   className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap"
//                 >
//                   Explore Courses <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Footer ── */}
//       <footer className="bg-[#191818] text-[#D1D5DB] border-t border-[#F97316]/[0.15]">
//         <div className="max-w-7xl mx-auto px-6 py-10">
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-start">
//             <div className="flex flex-col gap-2 self-start text-left sm:col-span-2 lg:col-span-1">
//               <h3 className="text-3xl font-extrabold leading-none">
//                 <span className="text-green-600">ILM</span>{" "}
//                 <span className="text-[#F97316]">ORA</span>
//               </h3>
//               <p className="text-sm text-[#D1D5DB] leading-relaxed">
//                 Modern learning platform for ambitious professionals who want to
//                 break into product, design and growth roles.
//               </p>
//               <p className="text-sm text-[#D1D5DB]">
//                 📧{" "}
//                 <a
//                   href="mailto:marketing@texora.ai"
//                   className="hover:text-[#F97316] transition-colors duration-300"
//                 >
//                   marketing@texora.ai
//                 </a>
//               </p>

//               <div className="flex items-center gap-2 pt-1 flex-wrap">
//                 {/* Instagram */}
//                 <a
//                   href="https://www.instagram.com/texora_ai"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all duration-300"
//                   style={{
//                     background:
//                       "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
//                   }}
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
//                   </svg>
//                 </a>

//                 {/* YouTube */}
//                 <a
//                   href="https://www.youtube.com/@Texoraai"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all duration-300"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//                   </svg>
//                 </a>

//                 {/* LinkedIn */}
//                 <a
//                   href="https://www.linkedin.com/company/ilmora-texoraai/"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all duration-300"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                   </svg>
//                 </a>

//                 {/* WhatsApp */}
//                 <a
//                   href="https://api.whatsapp.com/send?phone=919210970334"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all duration-300"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
//                   </svg>
//                 </a>

//                 {/* X / Twitter */}
//                 <a
//                   href="https://x.com/texoraai"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all duration-300"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//                   </svg>
//                 </a>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3">
//               <h4 className="text-sm font-bold tracking-widest text-white uppercase">
//                 Programs
//               </h4>
//               <ul className="flex flex-col gap-2 text-sm text-[#D1D5DB]">
//                 {[
//                   {
//                     label: "Product Management",
//                     action: () => scrollToSection("courses", "product"),
//                   },
//                   {
//                     label: "Growth Marketing",
//                     action: () => scrollToSection("courses", "growth"),
//                   },
//                   {
//                     label: "UI / UX Design",
//                     action: () => scrollToSection("courses", "design"),
//                   },
//                 ].map((item) => (
//                   <li
//                     key={item.label}
//                     onClick={item.action}
//                     className="hover:text-[#F97316] cursor-pointer transition-colors duration-300 flex items-center gap-1.5 group"
//                   >
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
//                     {item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="flex flex-col gap-3">
//               <h4 className="text-sm font-bold tracking-widest text-white uppercase">
//                 Resources
//               </h4>
//               <ul className="flex flex-col gap-2 text-sm text-[#D1D5DB]">
//                 {[
//                   {
//                     label: "Success Stories",
//                     action: () => scrollToSection("successstories"),
//                   },
//                   {
//                     label: "Blogs",
//                     action: () =>
//                       window.open("https://texora.ai/blogs", "_blank"),
//                   },
//                   {
//                     label: "Use Cases",
//                     action: () =>
//                       window.open("https://texora.ai/use-cases", "_blank"),
//                   },
//                 ].map((item) => (
//                   <li
//                     key={item.label}
//                     onClick={item.action}
//                     className="hover:text-[#F97316] cursor-pointer transition-colors duration-300 flex items-center gap-1.5 group"
//                   >
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
//                     {item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="flex flex-col gap-3 self-start">
//               <h4 className="text-sm font-bold tracking-widest text-white uppercase">
//                 Company
//               </h4>
//               <ul className="flex flex-col gap-2 text-sm text-[#D1D5DB]">
//                 {[
//                   { label: "About Us", action: () => navigate("/about") },
//                   { label: "Careers", action: () => navigate("/careers") },
//                   { label: "Pricing", action: () => navigate("/pricing") },
//                   {
//                     label: "Privacy Policy",
//                     action: () => navigate("/privacy-policy"),
//                   },
//                   {
//                     label: "Help Center",
//                     action: () => navigate("/help-center"),
//                   },
//                   { label: "FAQ", action: () => navigate("/faq") },
//                 ].map((item) => (
//                   <li
//                     key={item.label}
//                     onClick={item.action}
//                     className="hover:text-[#F97316] cursor-pointer transition-colors duration-300 flex items-center gap-1.5 group"
//                   >
//                     <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
//                     {item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <FooterNewsletter />
//           </div>

//           <div className="border-t border-white/[0.05] mt-8 pt-4 -mx-6 px-6 pb-4 bg-[#141414] flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#9CA3AF]">
//             <span>
//               © {new Date().getFullYear()} ILM ORA All rights reserved.
//             </span>
//             <div className="flex items-center gap-2">
//               <span>ILM ORA  </span>
//               <span className="text-red-500 text-base">❤️Powered by</span>
//               <span>Texora AI</span>
//             </div>
//           </div>
//         </div>
//       </footer>

//      {/* ── Login Modal ── */}
//      {showLoginModal && (
//         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//           <div
//             className="fixed inset-0 z-[100] flex items-center justify-center p-4"
//             style={{
//               background: "rgba(0,0,0,0.55)",
//               backdropFilter: "blur(5px)",
//             }}
//             onClick={(e) => {
//               if (e.target === e.currentTarget) setShowLoginModal(false);
//             }}
//           >
//             <div
//               className="relative w-full max-w-md rounded-2xl shadow-2xl"
//               style={{
//                 background: "rgba(255,255,255,0.97)",
//                 border: "1px solid rgba(249,115,22,0.18)",
//                 padding: "20px 26px 18px",
//                 animation: "modalFadeUp 0.3s ease both",
//               }}
//             >
//               <style>{`@keyframes modalFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>

//               <button
//                 onClick={() => setShowLoginModal(false)}
//                 className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-xl font-bold leading-none"
//                 aria-label="Close"
//               >
//                 ×
//               </button>

//               <div className="flex justify-center mb-2">
//                 <span className="text-3xl font-extrabold font-serif tracking-wide">
//                   <span className="text-green-600">ILM</span>
//                   <span className="text-[#F97316] ml-2">ORA</span>
//                 </span>
//               </div>

//               <div className="text-center mb-3">
//                 <h2 className="text-lg font-bold text-[#1e0e02] mb-0.5">
//                   Welcome back!
//                 </h2>
//               </div>

//               <div className="flex justify-center mb-3">
//                 <GoogleLogin
//                   onSuccess={handleModalGoogle}
//                   onError={() => console.error("Google OAuth failed")}
//                   theme="outline"
//                   size="large"
//                   text="continue_with"
//                   shape="rectangular"
//                   width="360"
//                   auto_select={false}
//                   cancel_on_tap_outside={true}
//                 />
//               </div>

//               <div className="flex items-center gap-2 mb-3">
//                 <div
//                   className="flex-1 h-px"
//                   style={{ background: "rgba(180,100,30,0.15)" }}
//                 />
//                 <span className="text-xs text-[#b8906a] uppercase tracking-widest font-medium">
//                   OR
//                 </span>
//                 <div
//                   className="flex-1 h-px"
//                   style={{ background: "rgba(180,100,30,0.15)" }}
//                 />
//               </div>

//               <form onSubmit={handleModalSubmit}>
//                 <div className="mb-2">
//                   <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={modalEmail}
//                     onChange={(e) => setModalEmail(e.target.value)}
//                     required
//                     disabled={modalLoading}
//                     className="w-full px-3.5 py-2 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
//                     style={{
//                       background: "rgba(255,255,255,0.8)",
//                       border: "1.5px solid rgba(180,120,60,0.2)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#F97316";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px rgba(249,115,22,0.1)";
//                       e.target.style.background = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "rgba(180,120,60,0.2)";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//                 <div className="mb-1.5">
//                   <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showModalPw ? "text" : "password"}
//                       placeholder="Enter your password"
//                       value={modalPassword}
//                       onChange={(e) => setModalPassword(e.target.value)}
//                       required
//                       disabled={modalLoading}
//                       className="w-full px-3.5 py-2 pr-11 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
//                       style={{
//                         background: "rgba(255,255,255,0.8)",
//                         border: "1.5px solid rgba(180,120,60,0.2)",
//                       }}
//                       onFocus={(e) => {
//                         e.target.style.borderColor = "#F97316";
//                         e.target.style.boxShadow =
//                           "0 0 0 3px rgba(249,115,22,0.1)";
//                         e.target.style.background = "#fff";
//                       }}
//                       onBlur={(e) => {
//                         e.target.style.borderColor = "rgba(180,120,60,0.2)";
//                         e.target.style.boxShadow = "none";
//                       }}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowModalPw((p) => !p)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8906a] hover:text-[#F97316] transition p-0 bg-transparent border-none cursor-pointer"
//                       tabIndex={-1}
//                     >
//                       {showModalPw ? (
//                         <svg
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//                           <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//                           <line x1="1" y1="1" x2="23" y2="23" />
//                         </svg>
//                       ) : (
//                         <svg
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                           <circle cx="12" cy="12" r="3" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="text-right mb-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowLoginModal(false);
//                       setShowForgotModal(true);
//                     }}
//                     className="text-xs text-[#F97316] hover:underline bg-transparent border-none cursor-pointer font-medium p-0"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={modalLoading}
//                   className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   style={{
//                     background: "linear-gradient(135deg,#F97316,#ea580c)",
//                     boxShadow: "0 4px 18px rgba(249,115,22,0.32)",
//                   }}
//                 >
//                   {modalLoading ? (
//                     <>
//                       <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
//                       Signing in…
//                     </>
//                   ) : (
//                     "Log in"
//                   )}
//                 </button>
//               </form>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowLoginModal(false);
//                   setShowSignupModal(true);
//                 }}
//                 className="w-full mt-2.5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
//                 style={{
//                   background: "transparent",
//                   border: "2px solid #16a34a",
//                   color: "#16a34a",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "#16a34a";
//                   e.currentTarget.style.color = "#fff";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "transparent";
//                   e.currentTarget.style.color = "#16a34a";
//                 }}
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
//                   <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
//                   <path d="M2 12h20" />
//                 </svg>
//                 Sign up
//               </button>

//               <div className="text-center mt-3">
//                 <button
//                   onClick={() => setShowLoginModal(false)}
//                   className="text-xs text-[#b8906a] hover:text-[#8a6040] bg-transparent border-none cursor-pointer transition-colors"
//                 >
//                   ← Back to home
//                 </button>
//               </div>
//             </div>
//           </div>
//         </GoogleOAuthProvider>
//       )}
//       {showSignupModal && (
//         <SignupModal
//           onClose={() => setShowSignupModal(false)}
//           onSwitchToLogin={() => {
//             setShowSignupModal(false);
//             setShowLoginModal(true);
//           }}          
//         />
//       )}
//       {showForgotModal && (
//         <ForgotPasswordModal
//           onClose={() => setShowForgotModal(false)}
//           onSwitchToLogin={() => {
//             setShowForgotModal(false);
//             setShowLoginModal(true);
//           }}
//         />
//       )}
//       <TexoraFloatingWidget />
//     </div>
//   );
// }
























































import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import SignupModal from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SplitText from "../../components/SplitText";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Heart,
  Lightbulb,
  LogOut,
  Menu,
  Moon,
  Quote,
  PlayCircle,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroVideo from "../../assets/hero-1.mp4";
import heroStudent2 from "../../assets/hero-student-2.png";
import heroStudent3 from "../../assets/hero-student-3.png";
import heroStudent from "../../assets/hero-student.png";
import ctaStudent from "../../assets/cta-student.png";
import auth from "../../auth";
import MegaMenu from "../../components/MegaMenu";
import authService from "../../services/authService";
import { courseService } from "../../services/courseService";
import { subscribeNewsletter } from "../../services/notificationService";
import TexoraFloatingWidget from "./components/TexoraFloatingWidget";
import HorizontalCarousel from "./components/HorizontalCarousel";
import CategoryTabScroller from "./components/CategoryTabScroller";
import WatchNowSection from "./components/WatchNow";
const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";
const NEWSLETTER_KEY = "ilmora_newsletter_subscribers";

/* ── Fallback data for the "Top Global Companies" section ──
   Used only while the backend call is loading or if it returns nothing. */
const FALLBACK_TECH_PARTNERS = [
  { src: "/aws.png", name: "AWS", desc: "Amazon Web Services" },
  { src: "/Google.jpg", name: "Google Cloud", desc: "Google Cloud Platform" },
  { src: "/Amazone.jpg", name: "Amazon AWS", desc: "Amazon Web Services" },
  {
    src: "/Micrososft.jpg",
    name: "Microsoft Azure",
    desc: "Microsoft Cloud Platform",
  },
];

const FALLBACK_BIZ_PARTNERS = [
  { src: "/Picture1.jpg", name: "Texora AI", desc: "AI & Digital Solutions" },
  {
    src: "/UFS-Logo.jpg",
    name: "UFS Network",
    desc: "Unified Consultancy Services",
  },
];

const ECOSYSTEM_COLORS = ["blue", "orange", "purple", "green", "rose"];

const FALLBACK_ECOSYSTEM = [
  {
    name: "TORA CX",
    color: "blue",
    desc: "Customer experience platform",
    Icon: null,
    svgPath: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
  },
  {
    name: "UNIFIED CRM",
    color: "orange",
    desc: "AI-driven CRM for sales",
    Icon: Users,
  },
  {
    name: "ILM ORA",
    color: "purple",
    desc: "LMS with AI learning paths",
    Icon: GraduationCap,
  },
  {
    name: "INNOVORA AI",
    color: "green",
    desc: "AI-powered innovation suite",
    Icon: Lightbulb,
  },
  {
    name: "TASK ORBIT",
    color: "rose",
    desc: "AI-powered task management",
    Icon: ClipboardList,
  },
];

function getSubscribers() {
  try {
    return JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveSubscribers(list) {
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(list));
}

/* ─────────────────────────────────────────────────────────────────
   FULL-SCREEN MOBILE MENU
───────────────────────────────────────────────────────────────── */
function MobileFullScreenMenu({
  onClose,
  navLinks,
  navButtons,
  user,
  navigate,
  handleLogout,
  setShowLoginModal,
}) {
  const [ilmoraFeatureOpen, setIlmoraFeatureOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const AccordionSection = ({ label, isOpen, onToggle, children }) => (
    <div style={{ borderBottom: "1px solid #f3f4f6" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 20px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
          fontSize: 15,
          fontWeight: 600,
          color: "#1e293b",
        }}
      >
        {label}
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            display: "flex",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
          <ChevronDown size={16} />
        </span>
      </button>
      {isOpen && (
        <div
          style={{
            background: "#f9fafb",
            borderTop: "1px solid #f3f4f6",
            padding: "8px 0",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#ffffff",
        zIndex: 99999,
        overflowY: "auto",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #f3f4f6",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            fontFamily: "serif",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#16a34a" }}>ILM</span>
          <span style={{ color: "#f97316", marginLeft: 4 }}>ORA</span>
        </span>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "#f5f5f5",
            borderRadius: 10,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6b7280",
          }}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "12px 0 32px",
        }}
      >
        {/* MegaMenu — All Courses */}
        <div style={{ padding: "0 16px 8px" }}>
          <MegaMenu onItemClick={onClose} />
        </div>

        {/* Divider */}
        <div
          style={{ height: 1, background: "#f3f4f6", margin: "4px 20px 4px" }}
        />
        {/* Nav buttons */}
        {navButtons.map((btn) => (
          <button
            key={btn.text}
            onClick={() => {
              btn.action();
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "15px 20px",
              border: "none",
              borderBottom: "1px solid #f9fafb",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 15,
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            {btn.text}
          </button>
        ))}

        {/* ── ILM ORA Feature Accordion ── */}
        <AccordionSection
          label="ILM ORA Feature"
          isOpen={ilmoraFeatureOpen}
          onToggle={() => setIlmoraFeatureOpen((p) => !p)}
        >
          {/* Student Hub */}
          <button
            onClick={() => {
              navigate("/student-hub");
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 24px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#f0fdf4",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GraduationCap size={18} style={{ color: "#16a34a" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Student Hub
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                AI-Powered Learning &amp; Career Growth
              </p>
            </div>
          </button>

          {/* Trainer Hub */}
          <button
            onClick={() => {
              navigate("/trainer-hub");
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 24px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#eff6ff",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Users size={18} style={{ color: "#2563eb" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Trainer Hub
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                Training Management &amp; Mentorship
              </p>
            </div>
          </button>
          {/* Manager Hub */}
          <button
            onClick={() => {
              navigate("/manager-hub");
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 24px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#faf5ff",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BarChart3 size={18} style={{ color: "#9333ea" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Manager Hub
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                Analytics, Performance &amp; Team Development
              </p>
            </div>
          </button>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 24px" }} />

          {/* ILM ORA Meet */}
          <button
            onClick={() => {
              navigate("/ilm-ora-meet");
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 24px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#fff7ed",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Users size={18} style={{ color: "#f97316" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                ILM ORA Meet
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                Virtual Meetings &amp; Collaboration
              </p>
            </div>
          </button>

          {/* AI Resume Builder */}
          <button
            onClick={() => {
              navigate("/resume-builder");
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 24px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#f0fdf4",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={18} style={{ color: "#16a34a" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                AI Resume Builder
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                Create ATS-Friendly Professional Resumes
              </p>
            </div>
          </button>
        </AccordionSection>

        {/* ── More Accordion ── */}
        <AccordionSection
          label="More"
          isOpen={moreOpen}
          onToggle={() => setMoreOpen((p) => !p)}
        >
          {navLinks.map((link) => (
            <button
              key={link.text}
              onClick={() => {
                if (link.href) {
                  document
                    .querySelector(link.href)
                    ?.scrollIntoView({ behavior: "smooth" });
                }
                onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
              }}
            >
              {link.text}
            </button>
          ))}
        </AccordionSection>

        {/* Divider */}
        <div
          style={{ height: 1, background: "#f3f4f6", margin: "12px 20px" }}
        />

        {/* Auth section */}
        <div style={{ padding: "0 16px" }}>
          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "#fdf4ec",
                  borderRadius: 14,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: "#1e293b",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {user.name?.charAt(0) || "U"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1e293b",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name || "User"}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate("/my-learning");
                  onClose();
                }}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 14,
                  border: "none",
                  background: "#1e293b",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                My Learning
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 14,
                  border: "1.5px solid #fecaca",
                  background: "transparent",
                  color: "#dc2626",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                setShowLoginModal(true);
              }}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "#1e293b",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Sparkles size={16} /> Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FooterNewsletter
// Subscribe form uses the real backend API (subscribeNewsletter). A hidden
// subscriber-admin panel (callable via openNewsletterAdmin / the hidden
// trigger element) is kept for internal use — it does not alter the visible
// design of the footer.
// ─────────────────────────────────────────────────────────────────────────────
function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  // Hidden subscriber-admin panel state
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminOk, setAdminOk] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [subscribers, setSubscribers] = useState([]);

  const isValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!isValid(trimmed)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }
    setStatus("loading");
    try {
      const { ok, status: httpStatus } = await subscribeNewsletter(trimmed);
      if (httpStatus === 409) {
        setStatus("duplicate");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }
      if (ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3500);
      } else {
        setStatus("apierror");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("apierror");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  /* ── Hidden subscriber-admin panel ── */
  const openAdmin = () => {
    setSubscribers(getSubscribers());
    setShowAdmin(true);
  };

  const unlockAdmin = () => {
    if (adminCode === "ilmora2026") {
      setAdminOk(true);
      setAdminCode("");
    } else {
      alert("Incorrect code");
    }
  };

  const deleteSubscriber = (emailToDel) => {
    const updated = subscribers.filter((s) => s.email !== emailToDel);
    saveSubscribers(updated);
    setSubscribers(updated);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusMsg = {
    success: { text: "✓ You're subscribed!", color: "#22c55e" },
    error: { text: "Enter a valid email.", color: "#f87171" },
    duplicate: { text: "Already subscribed.", color: "#fb923c" },
    apierror: { text: "Something went wrong. Try again.", color: "#f87171" },
  }[status];

  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-sm md:text-base font-bold tracking-wide text-white leading-snug">
        Be the first to know
      </h4>
      <div
        style={{
          display: "flex",
          background: status === "error" ? "rgba(248,113,113,0.08)" : "#232323",
          borderRadius: "8px",
          border:
            status === "error"
              ? "1.5px solid #f87171"
              : status === "success"
                ? "1.5px solid #22c55e"
                : "1.5px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="marketing@texora.ai"
          disabled={status === "loading" || status === "success"}
          className="placeholder:text-[#9CA3AF]"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#FFFFFF",
            fontSize: "13px",
            padding: "8px 12px",
            minWidth: 0,
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || status === "success"}
          style={{
            background: status === "success" ? "#22c55e" : "#F97316",
            border: "none",
            cursor: "pointer",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "40px",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (status !== "success")
              e.currentTarget.style.background = "#EA580C";
          }}
          onMouseLeave={(e) => {
            if (status !== "success")
              e.currentTarget.style.background = "#F97316";
          }}
        >
          {status === "loading" ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2.5"
              />
              <path
                d="M10 2a8 8 0 0 1 8 8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 10 10"
                  to="360 10 10"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          ) : status === "success" ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l4 4 8-8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {statusMsg && (
        <p
          style={{
            fontSize: "12px",
            color: statusMsg.color,
            margin: "-8px 0 0",
          }}
        >
          {statusMsg.text}
        </p>
      )}

      <div>
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            color: "#22C55E",
            background: "rgba(22,163,74,0.15)",
            border: "1px solid rgba(22,163,74,0.30)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Status: Live
        </span>
      </div>

      {/* ── Hidden subscriber-admin modal ── */}
      {showAdmin && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdmin(false);
              setAdminOk(false);
            }
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "2rem",
              width: "min(90vw,560px)",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                📊 Subscriber Admin
              </h3>
              <button
                onClick={() => {
                  setShowAdmin(false);
                  setAdminOk(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                ✕
              </button>
            </div>

            {!adminOk ? (
              <div>
                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "1rem",
                  }}
                >
                  Enter admin code to view subscribers:
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && unlockAdmin()}
                    placeholder="Admin code"
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      border: "1.5px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={unlockAdmin}
                    style={{
                      background: "#F97316",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: "#f8fffe",
                    border: "1px solid #d4f5e8",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#1a8f3c",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    Total Subscribers: {subscribers.length}
                  </span>
                  <button
                    onClick={() => setSubscribers(getSubscribers())}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#888",
                      fontSize: "13px",
                    }}
                  >
                    ↻ Refresh
                  </button>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  {subscribers.length === 0 ? (
                    <p
                      style={{
                        color: "#999",
                        textAlign: "center",
                        padding: "2rem",
                        fontSize: "14px",
                      }}
                    >
                      No subscribers yet. Share the page!
                    </p>
                  ) : (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "13px",
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "8px 12px",
                              color: "#888",
                              fontWeight: 600,
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "8px 12px",
                              color: "#888",
                              fontWeight: 600,
                            }}
                          >
                            Email
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "8px 12px",
                              color: "#888",
                              fontWeight: 600,
                            }}
                          >
                            Subscribed
                          </th>
                          <th style={{ padding: "8px 12px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub, i) => (
                          <tr
                            key={sub.email}
                            style={{ borderBottom: "1px solid #f5f5f5" }}
                          >
                            <td style={{ padding: "10px 12px", color: "#bbb" }}>
                              {i + 1}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                color: "#111",
                                fontWeight: 500,
                              }}
                            >
                              {sub.email}
                            </td>
                            <td style={{ padding: "10px 12px", color: "#888" }}>
                              {formatDate(sub.subscribedAt)}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                textAlign: "right",
                              }}
                            >
                              <button
                                onClick={() => deleteSubscriber(sub.email)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#fc8181",
                                  fontSize: "16px",
                                }}
                                title="Remove"
                              >
                                🗑
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* hidden admin trigger — callable from outside via openNewsletterAdmin() */}
      <div
        id="newsletter-admin-trigger"
        onClick={openAdmin}
        style={{ display: "none" }}
      />
    </div>
  );
}

// MentorTestimonialCarousel — horizontally scrollable testimonial cards with
// arrow navigation + dot pagination. Purely presentational; consumes the
// same `testimonials` array/state already loaded from the backend — no
// data-fetching or business logic here.
// ─────────────────────────────────────────────────────────────────────────────

// Small avatar helper: shows the backend image in a circular frame,
// falls back to initials if there's no image or the image fails to load.
function MentorAvatar({ name, image, size = "w-9 h-9", showBadge = false }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "").charAt(0).toUpperCase();

  return (
    <div className={`relative ${size} flex-shrink-0`}>
      <div
        className={`${size} rounded-full overflow-hidden bg-[#1E293B] dark:bg-[#F97316] flex items-center justify-center text-white font-bold`}
      >
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#22C55E] border-2 border-white dark:border-gray-900 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5 sm:w-3 sm:h-3">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

function MentorTestimonialCarousel({ testimonials }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[index];
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft,
        behavior: "smooth",
      });
    }
    setActiveIndex(index);
  };

  const handlePrev = () => scrollToIndex(Math.max(activeIndex - 1, 0));
  const handleNext = () =>
    scrollToIndex(Math.min(activeIndex + 1, testimonials.length - 1));

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - el.scrollLeft - el.offsetLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="w-full">
      <style>{`
        .mentor-scroll::-webkit-scrollbar { display: none; }
        .mentor-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes mentorFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="relative flex items-center gap-3 sm:gap-4 lg:gap-6">
        {/* Prev arrow — outside the card, desktop/tablet */}
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          disabled={activeIndex === 0}
          className="hidden sm:flex flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0_10px_35px_rgba(0,0,0,0.08)] items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] group transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5 text-[#1E293B] dark:text-white group-hover:text-white transition-colors" />
        </button>

        {/* Scroller */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          style={{ scrollSnapType: "x mandatory" }}
          className="mentor-scroll flex overflow-x-auto flex-1 min-w-0"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{ scrollSnapAlign: "start" }}
              className="w-full min-w-0 flex-shrink-0"
            >
              <div
                className="relative bg-white dark:bg-gray-900 rounded-[18px] sm:rounded-[22px] lg:rounded-[24px] border border-[#ECECEC] dark:border-gray-800 shadow-[0_10px_35px_rgba(0,0,0,0.08)] p-5 sm:p-6 lg:p-10 overflow-hidden"
                style={{ animation: "mentorFadeIn 0.4s ease both" }}
              >
                {/* Large faded quote mark, top-right */}
                <Quote
                  className="pointer-events-none absolute top-3 right-4 sm:top-4 sm:right-6 lg:top-6 lg:right-8 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-[#F97316]/10 dark:text-[#F97316]/15"
                  fill="currentColor"
                  strokeWidth={0}
                />

                <div className="flex flex-col lg:flex-row lg:items-stretch gap-5 lg:gap-8">
                  {/* Left: rating + quote */}
                  <div className="flex-1 min-w-0 relative z-[1]">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p
                      className="text-gray-600 dark:text-gray-300 italic text-sm sm:text-base lg:text-lg leading-7 lg:leading-8"
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      "{t.text}"
                    </p>
                  </div>

                  {/* Vertical divider — desktop only */}
                  <div className="hidden lg:block w-px bg-[#ECECEC] dark:bg-gray-800 flex-shrink-0" />

                  {/* Right: author block */}
                  <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:justify-center lg:w-[220px] lg:flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#ECECEC] dark:border-gray-800">
                    <MentorAvatar
                      name={t.name}
                      image={t.image}
                      size="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
                      showBadge
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1E293B] dark:text-white text-sm sm:text-base leading-snug truncate">
                        {t.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-snug mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next arrow — outside the card, desktop/tablet */}
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          disabled={activeIndex === testimonials.length - 1}
          className="hidden sm:flex flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0_10px_35px_rgba(0,0,0,0.08)] items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] group transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5 text-[#1E293B] dark:text-white group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Arrows on mobile — sit below the card instead of overlapping it */}
      <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 text-[#1E293B] dark:text-white" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          disabled={activeIndex === testimonials.length - 1}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4 text-[#1E293B] dark:text-white" />
        </button>
      </div>

      {/* Dot pagination */}
      <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            style={{
              width: activeIndex === i ? "24px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              background: activeIndex === i ? "#F97316" : "#CBD5E1",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 300ms ease, background 300ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
export default function LMSHomepage({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState("product");
  const [featuredPrograms, setFeaturedPrograms] = useState({});
  const [programsLoading, setProgramsLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());

  // ── Mentors (testimonials) — now backend-connected ──
  const [testimonials, setTestimonials] = useState([]);

  // ── Top Global Companies — now backend-connected ──
  const [companyData, setCompanyData] = useState(null);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  // ── Banner Studio — backend-connected promotional banner ──
  const [activeBanners, setActiveBanners] = useState([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [showModalPw, setShowModalPw] = useState(false);

  const heroImages = [heroStudent, heroStudent2, heroStudent3];
  const [currentSlide, setCurrentSlide] = useState(-1);
  const carouselTimerRef = useRef(null);

  const navigate = useNavigate();

  const startCarouselTimer = () => {
    clearInterval(carouselTimerRef.current);
    carouselTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === -1) return 0;
        if (prev >= heroImages.length - 1) return -1;
        return prev + 1;
      });
    }, 3500);
  };

  useEffect(() => {
    startCarouselTimer();
    return () => clearInterval(carouselTimerRef.current);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startCarouselTimer();
  };

  /* ── Load real featured programs from the backend (courseService) ──
     Falls back to the static `courses` object below if the API call
     fails or returns no programs in any category. Includes the fuller
     backend field mapping: thumbnails, banners, instructor photos,
     LinkedIn, video URL, and only shows Published programs. */
  useEffect(() => {
    async function loadPrograms() {
      try {
        const { data } = await courseService.getAllFeaturedPrograms();
        const grouped = {};

        data
          .filter((p) => p.publishStatus === "Published") // defensive client-side guard
          .forEach((p) => {
            const cat = (p.category || "Other").trim();

            if (!grouped[cat]) {
              grouped[cat] = [];
            }

            grouped[cat].push({
              id: p.id,
              title: p.title,
              instructor: p.instructorRole || p.instructorName,
              instructorFull: p.instructorName,
              instructorTitle: p.instructorRole || "",
              duration: `${p.durationWeeks} weeks`,
              students: p.studentsEnrolled,
              rating: p.rating,
              level: p.level,
              description: p.shortDescription,
              modules: (p.syllabusWeeks || []).map((w) => w.title),
              price: `₹${Number(p.price).toLocaleString("en-IN")}`,
              thumbnailUrl: p.thumbnailUrl || "",
              bannerUrl: p.bannerUrl || "",
              instructorPhotoUrl: p.instructorPhotoUrl || "",
              instructorLinkedIn: p.instructorLinkedIn || "",
              videoUrl: p.videoUrl || "",
              highlights: (p.highlights || [])
                .map((h) => (typeof h === "string" ? h : h?.text || ""))
                .filter((h) => h && h !== "[object Object]"),
              learningOutcomes: (p.learningOutcomes || [])
                .map((t, i) => ({
                  id: i,
                  text: typeof t === "string" ? t : t?.text || "",
                }))
                .filter((t) => t.text && t.text !== "[object Object]"),
              totalLessons: p.lessons,
              projects: p.projects,
              syllabusWeeks: p.syllabusWeeks || [],
              enrollmentUrl: p.enrollmentUrl || "",
              liveSessions: p.liveSessions ?? "—",
            });
          });

        // Only use API data if we actually got programs
        const hasPrograms = Object.values(grouped).some(
          (arr) => arr.length > 0,
        );
        if (hasPrograms) {
          setFeaturedPrograms(grouped);

          const firstCategory = Object.keys(grouped)[0];

          if (firstCategory) {
            setActiveTab(firstCategory);
          }
        }
        // else featuredPrograms stays empty → fallback to hardcoded courses
      } catch (err) {
        console.error("Failed to load featured programs", err);
      } finally {
        setProgramsLoading(false);
      }
    }
    loadPrograms();
  }, []);

  /* ── Load real mentor feedback (testimonials) from the backend ── */
  useEffect(() => {
    async function loadMentorFeedback() {
      try {
        const { data } = await courseService.getActiveMentorFeedbacks();
        const mapped = data.map((m) => {
  console.log("Feedback:", m.feedbackMessage);

  return {
    name: m.candidateName,
    role: `${m.designation} @ ${m.company}`,
    text: m.feedbackMessage,
    image: m.profileImage || m.image || m.imageUrl || m.photo || null,
  };
});
        setTestimonials(mapped);
      } catch (err) {
        console.error("Failed to load mentor feedback", err);
      }
    }
    loadMentorFeedback();
  }, []);

  /* ── Load real companies (tech / business partners + product ecosystem) ── */
  useEffect(() => {
    async function loadCompanies() {
      try {
        const { data } = await courseService.getActiveCompanies();
        setCompanyData(data);
      } catch (err) {
        console.error("Failed to load companies", err);
      } finally {
        setCompaniesLoading(false);
      }
    }
    loadCompanies();
  }, []);

  /* ── Load the active promotional banner (Banner Studio) ── */
  useEffect(() => {
    async function loadActiveBanners() {
      try {
        const { data } = await courseService.getActiveBanners();
        setActiveBanners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load banners", err);
      }
    }
    loadActiveBanners();
  }, []);

  useEffect(() => {
    if (activeBanners.length > 0) {
      courseService.registerBannerView(activeBanners[0].id).catch(() => {});
    }
  }, [activeBanners]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowLoginModal(false);
    };
    if (showLoginModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLoginModal]);

  useEffect(() => {
    const handler = (e) => {
      const { tab } = e.detail || {};
      if (tab) setActiveTab(tab);
    };
    window.addEventListener("mm-course-tab", handler);
    return () => window.removeEventListener("mm-course-tab", handler);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const scrollToSection = (sectionId, tabName = null) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        if (tabName) setActiveTab(tabName);
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      if (tabName) setActiveTab(tabName);
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ── Role-based redirect (full role map, incl. SUPER_ADMIN / TENANT_ADMIN) ── */
  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "SUPER_ADMIN":
        navigate("/superadmin", { replace: true });
        break;
      case "ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "TENANT_ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "BUSINESS":
        navigate("/admin", { replace: true });
        break;
      case "TRAINER":
        navigate("/trainer", { replace: true });
        break;
      default:
        navigate("/student", { replace: true });
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalLoading) return;
    setModalLoading(true);
    try {
      const ok = await auth.login({
        email: modalEmail,
        password: modalPassword,
      });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        setShowLoginModal(false);
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  /* ── Google Sign-In — full backend-aware flow ──────────────────────────────
     Existing users: backend issues a token + role (+ organizationId) and we
     redirect by role. Brand-new users: we hand off to /complete-profile so
     they can finish signing up. */
  const handleModalGoogle = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec = jwtDecode(res.credential);

      const check = await authService.checkGoogleUser({
        idToken: res.credential,
      });

      // ── EXISTING USER ──────────────────────────────────────────
      if (check.isNewUser === false && check.token && check.role) {
        const role = check.role.toUpperCase();
        localStorage.setItem("lms_token", check.token);
        localStorage.setItem("role", role);

        if (check.organizationId) {
          localStorage.setItem("organizationId", check.organizationId);
        } else {
          localStorage.removeItem("organizationId");
        }

        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: check.name || dec.name,
            email: check.email || dec.email,
            role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
              ? "admin"
              : role.toLowerCase(),
            isGoogleUser: true,
            profileCompleted: true,
            organizationId: check.organizationId || null,
          }),
        );
        setShowLoginModal(false);
        redirectByRole(role);
        return;
      }

      // ── BRAND NEW USER ─────────────────────────────────────────
      sessionStorage.setItem("ilmora_google_credential", res.credential);
      setShowLoginModal(false);
      navigate("/complete-profile", {
        replace: true,
        state: {
          name: dec.name,
          email: dec.email,
          googleCredential: res.credential,
          isGoogleUser: true,
          fromGoogleLogin: true,
        },
      });
    } catch (err) {
      // Surface the real backend message — blocked user / inactive org / etc.
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Google login failed. Please try again.";
      alert(message);
    }
  };

  /* ── Hidden subscriber-admin trigger (callable from elsewhere if needed) ── */
  const openNewsletterAdmin = () => {
    document.getElementById("newsletter-admin-trigger")?.click();
  };

  const courses = {
    product: [
      {
        id: 1,
        title: "Product Management Mastery",
        instructor: "Ex-Google PM",
        duration: "8 weeks",
        students: "2,500+",
        rating: 4.9,
        level: "Intermediate",
        description:
          "Master product lifecycle from ideation to launch. Learn roadmapping, prioritization, stakeholder management & metrics that matter.",
        modules: [
          "Discovery & Research",
          "Roadmapping",
          "Prioritization Frameworks",
          "Launch Strategy",
          "Metrics & Analytics",
        ],
        price: "₹49,000",
        highlights: [
          "Live sessions with Google PMs",
          "Real case studies",
          "1:1 mentorship",
          "Job referral support",
        ],
        liveSessions: 5,
        totalLessons: 81,
        projects: 3,
      },
      {
        id: 2,
        title: "Product Analytics",
        instructor: "Ex-Amazon",
        duration: "6 weeks",
        students: "1,800+",
        rating: 4.8,
        level: "Advanced",
        description:
          "Data-driven product decisions. Master A/B testing, cohort analysis, funnel optimization & retention strategies.",
        modules: [
          "SQL for Product Managers",
          "Experimentation",
          "Funnel Analysis",
          "Retention Metrics",
          "Customer Segmentation",
        ],
        price: "₹39,000",
        highlights: [
          "Amazon case studies",
          "Live SQL projects",
          "Advanced Mixpanel",
          "Retention frameworks",
        ],
        liveSessions: 4,
        totalLessons: 60,
        projects: 2,
      },
      {
        id: 3,
        title: "Product Strategy",
        instructor: "Ex-Meta",
        duration: "10 weeks",
        students: "2,100+",
        rating: 4.9,
        level: "Advanced",
        description:
          "Strategic frameworks for product success. Positioning, competitive analysis, growth strategies & portfolio management.",
        modules: [
          "Market Analysis",
          "Competitive Strategy",
          "Growth Playbooks",
          "Portfolio Management",
          "Pricing Strategy",
        ],
        price: "₹59,000",
        highlights: [
          "Meta growth case studies",
          "Strategy templates",
          "Live workshops",
          "Executive simulations",
        ],
        liveSessions: 6,
        totalLessons: 90,
        projects: 4,
      },
    ],
    design: [
      {
        id: 4,
        title: "UI/UX Design Bootcamp",
        instructor: "Ex-Airbnb Designer",
        duration: "12 weeks",
        students: "3,200+",
        rating: 5.0,
        level: "Beginner",
        description:
          "Complete UI/UX journey from research to prototype. Figma mastery, design systems & portfolio projects.",
        modules: [
          "User Research",
          "Wireframing",
          "Prototyping",
          "Design Systems",
          "Portfolio Building",
        ],
        price: "₹69,000",
        highlights: [
          "Airbnb case studies",
          "Figma certification",
          "Live design reviews",
          "Job ready portfolio",
        ],
        liveSessions: 8,
        totalLessons: 110,
        projects: 5,
      },
      {
        id: 5,
        title: "Design Systems",
        instructor: "Ex-Netflix",
        duration: "8 weeks",
        students: "1,500+",
        rating: 4.8,
        level: "Advanced",
        description:
          "Build scalable design systems like Netflix. Components, tokens, documentation & developer handoff.",
        modules: [
          "Component Libraries",
          "Design Tokens",
          "Documentation",
          "Dev Handoff",
          "Scale Patterns",
        ],
        price: "₹45,000",
        highlights: [
          "Netflix system breakdown",
          "Figma + Storybook",
          "Live system audits",
          "Enterprise patterns",
        ],
        liveSessions: 4,
        totalLessons: 70,
        projects: 3,
      },
      {
        id: 6,
        title: "User Research Pro",
        instructor: "Ex-Microsoft",
        duration: "6 weeks",
        students: "1,900+",
        rating: 4.7,
        level: "Intermediate",
        description:
          "Research methods that drive product decisions. Interviews, surveys, usability testing & synthesis.",
        modules: [
          "Interview Techniques",
          "Survey Design",
          "Usability Testing",
          "Synthesis Methods",
          "Stakeholder Reports",
        ],
        price: "₹35,000",
        highlights: [
          "Microsoft research frameworks",
          "Live user testing",
          "Report templates",
          "Stakeholder presentations",
        ],
        liveSessions: 3,
        totalLessons: 55,
        projects: 2,
      },
    ],
    growth: [
      {
        id: 7,
        title: "Growth Marketing",
        instructor: "Ex-Uber Growth",
        duration: "8 weeks",
        students: "2,800+",
        rating: 4.9,
        level: "Intermediate",
        description:
          "Growth loops, viral mechanics & acquisition strategies that scale businesses.",
        modules: [
          "Growth Frameworks",
          "Viral Loops",
          "Acquisition Channels",
          "Experimentation",
          "Scaling",
        ],
        price: "₹49,000",
        highlights: [
          "Uber growth case studies",
          "Live experiments",
          "Channel deep dives",
          "Scaling frameworks",
        ],
        liveSessions: 5,
        totalLessons: 75,
        projects: 3,
      },
      {
        id: 8,
        title: "SEO & Content Strategy",
        instructor: "Ex-Spotify",
        duration: "10 weeks",
        students: "2,300+",
        rating: 4.8,
        level: "Intermediate",
        description:
          "Organic growth mastery. Technical SEO, content systems & link building at scale.",
        modules: [
          "Technical SEO",
          "Content Systems",
          "Link Building",
          "Analytics",
          "Scaling Organic",
        ],
        price: "₹55,000",
        highlights: [
          "Spotify SEO case studies",
          "Live audits",
          "Content calendars",
          "Enterprise SEO",
        ],
        liveSessions: 5,
        totalLessons: 85,
        projects: 3,
      },
      {
        id: 9,
        title: "Performance Marketing",
        instructor: "Ex-Swiggy",
        duration: "8 weeks",
        students: "2,600+",
        rating: 4.9,
        level: "Advanced",
        description:
          "Paid acquisition at scale. Facebook, Google, creative testing & LTV optimization.",
        modules: [
          "Facebook Ads",
          "Google Ads",
          "Creative Strategy",
          "LTV Optimization",
          "Scaling",
        ],
        price: "₹47,000",
        highlights: [
          "Swiggy ad case studies",
          "Live campaign builds",
          "Creative testing",
          "ROAS frameworks",
        ],
        liveSessions: 5,
        totalLessons: 72,
        projects: 4,
      },
    ],
  };

  const features = [
    {
      icon: Target,
      title: "Project-Based Learning",
      description: "Build real-world projects that showcase your skills",
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Learn from professionals at top tech companies",
    },
    {
      icon: Trophy,
      title: "Career Support",
      description: "Get help with resumes, interviews & job referrals",
    },
    {
      icon: Zap,
      title: "Live Sessions",
      description: "Interactive workshops with industry experts",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Learners" },
    { value: "95%", label: "Success Rate" },
    { value: "100+", label: "Expert Mentors" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const mentorBenefits = [
    { icon: Award, text: "1:1 mentorship and small cohort learning" },
    { icon: TrendingUp, text: "Project reviews with detailed feedback" },
    { icon: Users, text: "Peer community for accountability and networking" },
  ];

  const careerSupport = [
    {
      icon: Target,
      title: "Portfolio Support",
      description: "Turn your projects into case studies hiring managers love",
    },
    {
      icon: Award,
      title: "Interview Prep",
      description:
        "Mock interviews, feedback and guidance on role expectations",
    },
    {
      icon: Users,
      title: "Referrals & Network",
      description: "Warm intros to hiring teams and community-led referrals",
    },
  ];

  const getLevelColor = (level) =>
    ({
      Beginner:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Intermediate: "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20",
      Advanced:
        "bg-[#1E293B]/10 text-[#1E293B] dark:bg-white/10 dark:text-white border border-[#1E293B]/20 dark:border-white/20",
    })[level] || "bg-gray-100 text-gray-700";

  /* ── Presentational-only helpers for the redesigned course cards ──
     These do not touch any API/data-fetching logic — they simply
     derive display values (initials, strike-through price, discount
     badge) from the existing course fields. */
  const getInitials = (name = "") =>
    name
      .replace(/^Ex-/i, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "IN";

  const getPricing = (price) => {
    const current = parseInt(String(price).replace(/[^\d]/g, ""), 10) || 0;
    const original = Math.round((current * 1.35) / 1000) * 1000;
    const discount =
      original > current
        ? Math.round(((original - current) / original) * 100)
        : 0;
    return {
      current: `₹${current.toLocaleString("en-IN")}`,
      original: `₹${original.toLocaleString("en-IN")}`,
      discount,
    };
  };

  const toggleWishlist = async (id) => {
    // Not logged in → don't call the API, just prompt login
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Optimistic UI update
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      const { data } = await courseService.toggleWishlist(id);
      // Reconcile with server truth
      setWishlist((prev) => {
        const next = new Set(prev);
        if (data.wishlisted) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch (err) {
      // Roll back the optimistic update on failure
      setWishlist((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      if (err?.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("Wishlist toggle failed", err);
      }
    }
  };

  const navLinks = [
    { text: "Mentors", href: "#mentors" },
    { text: "Success Stories", href: "#successstories" },
  ];

  const navButtons = [];

  /* ── Top Global Companies — derived from backend `companyData`,
     falling back to static data while loading / on empty response. ── */
  const mapCompany = (c) => ({
    src: c.uploadedLogo || c.logoUrl,
    name: c.name,
    desc: c.description,
  });

  const techPartners = companyData?.["Technology Partner"]?.length
    ? companyData["Technology Partner"].map(mapCompany)
    : FALLBACK_TECH_PARTNERS;

  const bizPartners = companyData?.["Business Partner"]?.length
    ? companyData["Business Partner"].map(mapCompany)
    : FALLBACK_BIZ_PARTNERS;

  const ecosystemProducts = companyData?.["Texora Product"]?.length
    ? companyData["Texora Product"].map((c, i) => ({
        ...mapCompany(c),
        color: ECOSYSTEM_COLORS[i % ECOSYSTEM_COLORS.length],
      }))
    : null;

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
      {/* ── Full-Screen Mobile Menu ── */}
      {mobileMenuOpen && (
        <MobileFullScreenMenu
          onClose={() => setMobileMenuOpen(false)}
          navLinks={navLinks}
          navButtons={navButtons}
          user={user}
          navigate={navigate}
          handleLogout={handleLogout}
          setShowLoginModal={setShowLoginModal}
        />
      )}

      {/* ── Nav ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#1F1D1F]/95 border-b border-[#F97316]/20 ${
          scrolled
            ? "backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            : "backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <span className="text-[28px] sm:text-[32px] font-extrabold tracking-wide font-serif leading-none whitespace-nowrap">
                <span className="text-green-600">ILM</span>
                <span className="text-[#F97316] ml-1">ORA</span>
                <span className="inline-flex items-center bg-orange-50 border border-[#F97316] rounded ml-1.5 px-1.5 py-0.5 text-[0.45rem] sm:text-[0.5rem] font-sans font-semibold tracking-widest text-[#F97316] uppercase leading-snug align-middle">
                  Beta
                </span>
              </span>
            </div>

            {/* Desktop Nav — visible from lg (1024px) and above */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4 xl:mx-6">
              <MegaMenu />
              {/* ILM ORA Feature Dropdown */}
              <div className="relative group">
                <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
                  ILM ORA Feature
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-80 bg-[#232323] border border-white/[0.08] rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => navigate("/student-hub")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">Student Hub</div>
                        <div className="text-xs text-gray-400">
                          AI-Powered Learning & Career Growth
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/trainer-hub")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">Trainer Hub</div>
                        <div className="text-xs text-gray-400">
                          Training Management & Mentorship
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/manager-hub")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">Manager Hub</div>
                        <div className="text-xs text-gray-400">
                          Analytics, Performance & Team Development
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-white/[0.08] my-2"></div>

                  {/* ILM ORA Meet */}
                  <button
                    onClick={() => navigate("/ilm-ora-meet")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          ILM ORA Meet
                        </div>
                        <div className="text-xs text-gray-400">
                          Virtual Meetings & Collaboration
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* AI Resume Builder */}
                  <button
                    onClick={() => navigate("/resume-builder")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          AI Resume Builder
                        </div>
                        <div className="text-xs text-gray-400">
                          Create ATS-Friendly Professional Resumes
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* More Dropdown */}
              <div className="relative group">
                <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
                  More
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-52 bg-[#232323] rounded-xl shadow-xl border border-white/[0.08] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {navLinks.map((link) => (
                    <button
                      key={link.text}
                      onClick={() => {
                        document
                          .querySelector(link.href)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#F97316]/[0.12] text-sm text-white transition-colors duration-300"
                    >
                      {link.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] hover:border-[#F97316] transition-colors duration-300 shadow-sm bg-[#2A2A2A] flex-shrink-0"
              >
                {theme === "dark" ? (
                  <Sun className="w-[18px] h-[18px] text-[#F97316]" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-gray-300" />
                )}
              </button>

              {user ? (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 rounded-xl border-white/[0.08] bg-[#2A2A2A] hover:border-[#F97316] text-white h-10 px-3"
                      >
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-[#1E293B] text-white text-xs">
                            {user.name?.charAt(0) || (
                              <User className="w-3 h-3" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-72 bg-[#232323] border-white/[0.08]"
                    >
                      <div className="px-3 py-3 bg-[#2A2A2A] rounded-t-md">
                        <p className="font-semibold text-sm text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      {[
                        {
                          icon: GraduationCap,
                          label: "My Learning",
                          desc: "View your courses",
                          path: "/my-learning",
                        },
                        {
                          icon: User,
                          label: "Edit Profile",
                          desc: "Update your info",
                          path: "/edit-profile",
                        },
                      ].map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          onClick={() => navigate(item.path)}
                          className="gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-[#F97316]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="gap-3 text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="hidden lg:flex bg-gradient-to-br from-[#F97316] to-[#EA580C] hover:from-[#F97316] hover:to-[#EA580C] text-white font-bold px-4 xl:px-5 py-2.5 rounded-xl items-center gap-2 shadow-md hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition-all duration-300 text-[13px] xl:text-[15px] h-10 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" /> Get Started
                </Button>
              )}

              {/* Hamburger — only shown below lg (below 1024px) */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:border-[#F97316] bg-[#2A2A2A] transition-colors duration-300 shadow-sm"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Banner Studio (backend-connected promotional banner) ── */}
      {activeBanners.length > 0 &&
        (() => {
          const banner = activeBanners[0];
          const hasImage =
            banner.desktopImageUrl ||
            banner.tabletImageUrl ||
            banner.mobileImageUrl;

          const handleBannerClick = () => {
            courseService.registerBannerClick(banner.id).catch(() => {});
            if (banner.ctaLink) window.open(banner.ctaLink, "_blank");
          };

          return (
            <section className="w-full px-4 sm:px-6 pt-[84px]">
              <div
                className="max-w-7xl mx-auto rounded-b-xl overflow-hidden"
                style={{ cursor: banner.ctaLink ? "pointer" : "default" }}
                onClick={handleBannerClick}
              >
                {hasImage ? (
                  // ── Uploaded / AI / builder artwork — the image IS the banner ──
                  <picture>
                    {banner.mobileImageUrl && (
                      <source
                        media="(max-width: 640px)"
                        srcSet={banner.mobileImageUrl}
                      />
                    )}
                    {banner.tabletImageUrl && (
                      <source
                        media="(max-width: 1024px)"
                        srcSet={banner.tabletImageUrl}
                      />
                    )}
                    <img
                      src={
                        banner.desktopImageUrl ||
                        banner.tabletImageUrl ||
                        banner.mobileImageUrl
                      }
                      alt={banner.name || "Promotional banner"}
                      className="w-full h-auto max-h-[220px] sm:max-h-[260px] object-cover block"
                    />
                  </picture>
                ) : (
                  // ── No image uploaded — fall back to the text-only gradient strip ──
                  <div
                    className="flex items-center justify-between gap-4 py-4 px-4 sm:px-6 text-white"
                    style={{ background: banner.gradient || "#1E293B" }}
                  >
                    <div>
                      {banner.eyebrow && (
                        <p className="text-xs uppercase tracking-widest opacity-80">
                          {banner.eyebrow}
                        </p>
                      )}
                      <p className="text-lg font-bold">
                        {banner.emoji} {banner.title || banner.name}
                      </p>
                      {banner.subtitle && (
                        <p className="text-sm opacity-90">{banner.subtitle}</p>
                      )}
                    </div>
                    {banner.ctaText && (
                      <span className="flex-shrink-0 bg-white/15 hover:bg-white/25 transition px-4 py-2 rounded-lg text-sm font-semibold">
                        {banner.ctaText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>
          );
        })()}

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6 bg-[#F6EDE6] dark:bg-black relative overflow-hidden">
        <div className="absolute -top-32 left-[10%] w-[600px] h-[600px] bg-[#F97316]/8 dark:bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 right-[5%] w-[500px] h-[500px] bg-[#1E293B]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8 inline-flex">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#F97316] text-sm font-semibold mb-6">
  <Sparkles className="w-4 h-4" />
  Learn Smarter. Grow Faster. Lead the Future.
</div>
            </div>
         <h1 className="mb-6 leading-[1.1]">
  <SplitText
    text="Empower Your"
    className="block text-4xl md:text-5xl lg:text-7xl font-bold text-[#1E293B] dark:text-white"
    splitType="chars"
    delay={60}
    duration={0.6}
  />
  <SplitText
    text="Learning Journey"
    className="block text-4xl md:text-5xl lg:text-7xl font-bold text-[#F97316]"
    splitType="chars"
    delay={60}
    duration={0.6}
  />
</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl leading-relaxed">
  Master in-demand skills through AI-powered learning, live sessions,
  certifications, and expert-led programs designed for students,
  professionals, trainers, and organizations.
</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start">
              
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
              style={{ aspectRatio: "4/3" }}
            >
              <video
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                style={{
                  opacity: currentSlide === -1 ? 1 : 0,
                  transform: currentSlide === -1 ? "scale(1)" : "scale(0.96)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                  zIndex: currentSlide === -1 ? 2 : 1,
                  pointerEvents: currentSlide === -1 ? "auto" : "none",
                }}
              />
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hero Student ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    transform:
                      currentSlide === index ? "scale(1)" : "scale(0.96)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                    zIndex: currentSlide === index ? 2 : 1,
                    pointerEvents: currentSlide === index ? "auto" : "none",
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => goToSlide(-1)}
                aria-label="Show video"
                style={{
                  width: currentSlide === -1 ? "28px" : "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  background: currentSlide === -1 ? "#22c55e" : "#CBD5E1",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.35s ease, background 0.35s ease",
                }}
              />
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  style={{
                    width: currentSlide === index ? "28px" : "10px",
                    height: "10px",
                    borderRadius: "9999px",
                    background: currentSlide === index ? "#F97316" : "#CBD5E1",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.35s ease, background 0.35s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#F6EDE6] dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#F97316] mb-2">
                {stat.value}
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* ── WatchNow ── */}
      <WatchNowSection />

      {/* ── Features ── */}
      <section className="py-24 px-6 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
              Why Choose
              <span className="ml-2">
                <span className="text-green-600">ILM</span>{" "}
                <span className="text-[#F97316]">ORA</span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to accelerate your career growth
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Companies (Top Global Companies — backend-connected) ── */}
      <section className="py-20 px-4 sm:px-6 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-gray-400 font-bold mb-3">
              Trusted By Professionals At
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">
              Top Global <span className="text-[#F97316]">Companies</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 max-w-[600px] mx-auto leading-relaxed">
              We collaborate with leading technology providers and business
              organizations to deliver innovative digital solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col items-center mb-2">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-blue-500 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-black tracking-[0.13em] uppercase text-blue-600 dark:text-blue-400">
                    Technology Partners
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {techPartners.map((p) => (
                  <div
                    key={p.name}
                    className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="w-full h-11 flex items-center justify-center">
                      <img
                        src={p.src}
                        alt={p.name}
                        className="max-w-full max-h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const sib = e.currentTarget.nextSibling;
                          if (sib) sib.style.display = "flex";
                        }}
                      />
                      <div className="hidden w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center text-[10px] font-bold text-gray-400 text-center leading-tight px-1">
                        {p.name}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[12px] sm:text-[13px] font-bold text-[#0F172A] dark:text-white leading-tight">
                        {p.name}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col items-center mb-2">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-black tracking-[0.13em] uppercase text-green-600 dark:text-green-400">
                    Business Partners
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {bizPartners.map((p) => (
                  <div
                    key={p.name}
                    className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-7 flex flex-col items-center gap-4 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="w-full h-14 sm:h-16 flex items-center justify-center">
                      <img
                        src={p.src}
                        alt={p.name}
                        className="max-w-full max-h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const sib = e.currentTarget.nextSibling;
                          if (sib) sib.style.display = "flex";
                        }}
                      />
                      <div className="hidden w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center text-[10px] font-bold text-gray-400 text-center leading-tight px-1">
                        {p.name}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] dark:text-white leading-tight">
                        {p.name}
                      </p>
                      <p className="text-[11px] sm:text-[12px] text-gray-400 dark:text-gray-500 mt-1 leading-snug">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 sm:gap-5 mb-7 sm:mb-9">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex-shrink-0 text-center">
                <p className="text-[12px] sm:text-[13px] font-black tracking-[0.15em] uppercase text-[#0F172A] dark:text-white whitespace-nowrap">
                  Texora Product Ecosystem
                </p>
                <div className="w-8 h-[3px] bg-[#F97316] rounded-full mx-auto mt-1.5" />
              </div>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <style>{`
              .eco-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
              @media (max-width: 1279px) { .eco-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
              @media (max-width: 639px)  { .eco-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); } }
            `}</style>

            <div className="eco-grid">
              {(ecosystemProducts || FALLBACK_ECOSYSTEM).map((item) => {
                const colorMap = {
                  blue: {
                    bg: "bg-blue-100 dark:bg-blue-900/30",
                    text: "text-blue-600 dark:text-blue-400",
                    label: "text-blue-700 dark:text-blue-300",
                  },
                  orange: {
                    bg: "bg-orange-100 dark:bg-orange-900/30",
                    text: "text-[#F97316]",
                    label: "text-[#F97316]",
                  },
                  purple: {
                    bg: "bg-purple-100 dark:bg-purple-900/30",
                    text: "text-purple-600 dark:text-purple-400",
                    label: "text-purple-700 dark:text-purple-300",
                  },
                  green: {
                    bg: "bg-green-100 dark:bg-green-900/30",
                    text: "text-green-600 dark:text-green-400",
                    label: "text-green-700 dark:text-green-300",
                  },
                  rose: {
                    bg: "bg-rose-100 dark:bg-rose-900/30",
                    text: "text-rose-600 dark:text-rose-400",
                    label: "text-rose-700 dark:text-rose-300",
                  },
                };
                const c = colorMap[item.color];
                return (
                  <div
                    key={item.name}
                    className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden`}
                    >
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : item.Icon ? (
                        <item.Icon className={`w-6 h-6 ${c.text}`} />
                      ) : item.svgPath ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-6 h-6 ${c.text}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.svgPath}
                        </svg>
                      ) : (
                        <span className={`text-sm font-black ${c.text}`}>
                          {item.name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[13px] font-black tracking-wide ${c.label}`}
                    >
                      {item.name}
                    </p>
                    <div
                      className={`w-7 h-[3px] rounded-full bg-current ${c.text}`}
                    />
                    <p className="text-[11px] sm:text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                      {item.desc}
                    </p>
                    <a
                      href="/"
                      onClick={(e) => e.preventDefault()}
                      className={`text-[11px] sm:text-[12px] font-semibold flex items-center gap-1 mt-1 transition-opacity hover:opacity-70 ${c.text}`}
                    >
                      Explore{" "}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section
        id="courses"
        className="py-12 sm:py-16 scroll-mt-20 bg-[#F8FAFC] dark:bg-black"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          {/* ── Premium Section Header ── */}
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Handpicked for you
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 tracking-tight text-[#1E293B] dark:text-white">
              Featured <span className="text-[#F97316]">Programs</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Choose your path and start building skills that matter — taught
              by mentors who've shipped at the world's best companies.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* ── Category Tabs: compact carousel, scales to 10/20/50+ categories
                 without ever wrapping to multiple rows. Arrows + drag + wheel
                 + native swipe, active tab always auto-scrolled into view. ── */}
            <div className="mb-6 sm:mb-8 mx-auto w-fit max-w-full sm:max-w-3xl px-1 sm:px-0">
              <div className="h-[42px] flex items-center px-1 sm:px-1.5 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <CategoryTabScroller activeKey={activeTab}>
                  <TabsList className="flex w-max items-center justify-center gap-1.5 bg-transparent mx-auto h-full">
                    {Object.keys(
                      programsLoading
                        ? courses
                        : featuredPrograms &&
                            Object.values(featuredPrograms).some(
                              (a) => a.length > 0,
                            )
                          ? featuredPrograms
                          : courses,
                    ).map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="rounded-full capitalize font-semibold text-xs sm:text-sm whitespace-nowrap px-3.5 sm:px-5 h-[34px] flex-shrink-0 flex items-center text-[#1E293B] dark:text-gray-300 transition-all duration-300 ease-out data-[state=active]:bg-[#F97316] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CategoryTabScroller>
              </div>
            </div>

            {/* Real featured programs from the backend (with hardcoded
               `courses` as the fallback while loading or if the API
               returns nothing). */}
            {Object.entries(
              programsLoading
                ? courses
                : featuredPrograms &&

                    Object.values(featuredPrograms).some((a) => a.length > 0)
                  ? featuredPrograms
                  : courses,
            ).map(([category, categoryCourses]) => (
              <TabsContent key={category} value={category}>
                <HorizontalCarousel
                  items={categoryCourses}
                  ariaLabel={`${category} courses`}
                  getKey={(course) => course.id}
                  cardMinHeight={300}
                  renderItem={(course, idx) => {
                    const pricing = getPricing(course.price);
                    const isBestseller = course.rating >= 4.8;
                    const lessons =
                      course.totalLessons || course.modules?.length || 0;
                    const isWishlisted = wishlist.has(course.id);

                    return (
                      <div
                        onClick={() =>
                          navigate(`/course-details/${course.id}`, {
                            state: { course },
                          })
                        }
                        className="group relative flex flex-col min-w-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden cursor-pointer w-full h-full"
                      >
                        {/* ── Thumbnail / Banner ── */}
                        <div className="relative h-16 sm:h-20 overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#F97316] flex-shrink-0">
                          {course.thumbnailUrl || course.bannerUrl ? (
                            <img
                              src={course.thumbnailUrl || course.bannerUrl}
                              alt={course.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
                              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                                <GraduationCap
                                  className="w-8 h-8 sm:w-10 sm:h-10 text-white/25"
                                  strokeWidth={1.25}
                                />
                              </div>
                            </>
                          )}

                          {/* Top badges */}
                          <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide bg-white/95 text-[#F97316] px-2 py-0.5 rounded-full shadow-sm">
                              <Sparkles className="w-2.5 h-2.5" />
                              {isBestseller ? "Bestseller" : "Featured"}
                            </span>

                            <button
                              type="button"
                              aria-label={
                                isWishlisted
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(course.id);
                              }}
                              className="flex items-center justify-center w-7 h-7 rounded-full bg-white/95 shadow-sm hover:scale-110 active:scale-95 transition-transform duration-200"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 transition-colors ${
                                  isWishlisted
                                    ? "fill-[#F97316] text-[#F97316]"
                                    : "text-[#1E293B]"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Difficulty badge */}
                          <div className="absolute bottom-2 left-2 right-2 max-w-[70%]">
                            <span
                              className={`inline-block max-w-full truncate align-bottom text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${getLevelColor(course.level)} bg-white/95 dark:bg-white/95`}
                            >
                              {course.level}
                            </span>
                          </div>
                        </div>

                        {/* ── Body ── */}
                        <div className="flex flex-col flex-1 min-w-0 p-2.5 sm:p-3 pt-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-1 truncate">
                            {category}
                          </span>

                          <h3 className="text-sm sm:text-base font-bold text-[#1E293B] dark:text-white mb-1 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-[#F97316] transition-colors">
                            {course.title}
                          </h3>

                          {/* Instructor */}
                          <div className="flex items-center gap-1.5 mb-1.5 min-w-0">
                            {course.instructorPhotoUrl ? (
                              <img
                                src={course.instructorPhotoUrl}
                                alt={course.instructorFull || course.instructor}
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white text-[9px] font-bold shrink-0">
                                {getInitials(
                                  course.instructorFull || course.instructor,
                                )}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#1E293B] dark:text-white truncate">
                                {course.instructorFull || course.instructor}
                              </p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                {course.instructorTitle || course.instructor}
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 leading-relaxed line-clamp-2 min-h-[2.2em]">
                            {course.description}
                          </p>

                          {/* Skill chips */}
                          <div className="flex flex-wrap gap-1 mb-1.5 overflow-hidden max-h-[24px]">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/15 whitespace-nowrap flex-shrink-0 truncate max-w-[120px]">
                              {category}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1E293B]/5 text-[#1E293B] dark:bg-white/10 dark:text-gray-200 border border-[#1E293B]/10 dark:border-white/10 whitespace-nowrap flex-shrink-0">
                              {course.level}
                            </span>
                            {course.liveSessions !== undefined &&
                              course.liveSessions !== "—" && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
                                  {course.liveSessions} Live
                                </span>
                              )}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-4 gap-1 text-center mb-1.5 pb-1.5 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <Star className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {course.rating ?? "—"}
                              </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <Users className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {course.students ?? "—"}
                              </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <Clock className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {course.duration ?? "—"}
                              </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <PlayCircle className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {lessons ?? "—"}
                              </span>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-end justify-between mb-1.5 gap-2">
                            <div className="flex items-baseline gap-1.5 min-w-0 flex-shrink">
                              <span className="text-base sm:text-lg font-bold text-[#1E293B] dark:text-white truncate">
                                {pricing.current ?? "—"}
                              </span>
                              {pricing.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through truncate">
                                  {pricing.original}
                                </span>
                              )}
                            </div>
                            {pricing.discount > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
                                {pricing.discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* CTA */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/course-details/${course.id}`, {
                                state: { course },
                              });
                            }}
                            className="mt-auto w-full flex-shrink-0 bg-gradient-to-r from-[#F97316] to-[#ea580c] hover:brightness-105 text-white py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:scale-[1.02] shadow-sm shadow-orange-500/20"
                          >
                            View Details
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
     
      {/* ── Mentors (testimonials — backend-connected) ── */}
<section
  id="mentors"
  className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 scroll-mt-20 bg-[#FAF6F2] dark:bg-gray-900/30 overflow-x-hidden"
>
  <div className="max-w-[1200px] mx-auto">
    <div className="text-center max-w-[700px] mx-auto mb-8 sm:mb-10 lg:mb-12">
      <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-5xl font-bold mb-3 sm:mb-4 text-[#1E293B] dark:text-white leading-tight">
        Learn from <span className="text-[#F97316]">Industry Experts</span>
      </h2>
      <p className="text-sm sm:text-[15px] md:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        Sessions led by operators from top product companies so you
        understand how work happens in the real world.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 sm:mb-10 lg:mb-14">
      {mentorBenefits.map((item, i) => (
        <div
          key={i}
          className="h-full flex items-center gap-3 bg-[#FAF6F2] dark:bg-gray-900 rounded-2xl p-6 border border-[#ECECEC] dark:border-gray-800 shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <item.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm leading-snug">
            {item.text}
          </p>
        </div>
      ))}
    </div>

    <MentorTestimonialCarousel testimonials={testimonials} />
  </div>
</section>

      {/* ── Career Support ── */}
      <section
        id="successstories"
        className="py-24 px-6 scroll-mt-20 bg-[#F6EDE6] dark:bg-black"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
              Career Support That{" "}
              <span className="text-[#F97316]">Delivers Results</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get help with interview prep, portfolios, referrals and role
              mapping
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {careerSupport.map((item, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all"
              >
                <div className="w-16 h-16 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* ── Wide banner CTA ── */}
          <div className="bg-[#F6EDE6] dark:bg-gray-900 rounded-3xl relative overflow-hidden border border-[#F97316]/20 shadow-xl">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* ── Left: full-bleed image, fixed height, cropped to fill ── */}
              <div className="w-full lg:w-[280px] xl:w-[320px] h-56 sm:h-64 lg:h-auto flex-shrink-0 overflow-hidden">
                <img
                  src={ctaStudent}
                  alt="Student ready to transform their career"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* ── Middle: Content ── */}
              <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-10 lg:py-8">
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-[#1E293B] dark:text-white leading-tight">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl">
                  Join 5000+ professionals who've already taken the leap
                  with our project-based programs and expert mentorship.
                </p>
              </div>

              {/* ── Right: CTA button ── */}
              <div className="flex items-center justify-center lg:justify-end px-6 sm:px-10 pb-10 lg:pb-0 lg:pr-10">
                <button
                  onClick={() => scrollToSection("courses")}
                  className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap"
                >
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#191818] text-[#D1D5DB] border-t border-[#F97316]/[0.15]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-start">
            <div className="flex flex-col gap-2 self-start text-left sm:col-span-2 lg:col-span-1">
              <h3 className="text-3xl font-extrabold leading-none">
                <span className="text-green-600">ILM</span>{" "}
                <span className="text-[#F97316]">ORA</span>
              </h3>
              <p className="text-sm text-[#D1D5DB] leading-relaxed">
                Modern learning platform for ambitious professionals who want to
                break into product, design and growth roles.
              </p>
              <p className="text-sm text-[#D1D5DB]">
                📧{" "}
                <a
                  href="mailto:marketing@texora.ai"
                  className="hover:text-[#F97316] transition-colors duration-300"
                >
                  marketing@texora.ai
                </a>
              </p>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/texora_ai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@Texoraai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/ilmora-texoraai/"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://api.whatsapp.com/send?phone=919210970334"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com/texoraai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold tracking-widest text-white uppercase">
                Programs
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-[#D1D5DB]">
                {[
                  {
                    label: "Product Management",
                    action: () => scrollToSection("courses", "product"),
                  },
                  {
                    label: "Growth Marketing",
                    action: () => scrollToSection("courses", "growth"),
                  },
                  {
                    label: "UI / UX Design",
                    action: () => scrollToSection("courses", "design"),
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold tracking-widest text-white uppercase">
                Resources
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-[#D1D5DB]">
                {[
                  {
                    label: "Success Stories",
                    action: () => scrollToSection("successstories"),
                  },
                  {
                    label: "Blogs",
                    action: () =>
                      window.open("https://texora.ai/blogs", "_blank"),
                  },
                  {
                    label: "Use Cases",
                    action: () =>
                      window.open("https://texora.ai/use-cases", "_blank"),
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 self-start">
              <h4 className="text-sm font-bold tracking-widest text-white uppercase">
                Company
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-[#D1D5DB]">
                {[
                  { label: "About Us", action: () => navigate("/about") },
                  { label: "Careers", action: () => navigate("/careers") },
                  { label: "Pricing", action: () => navigate("/pricing") },
                  {
                    label: "Privacy Policy",
                    action: () => navigate("/privacy-policy"),
                  },
                  {
                    label: "Help Center",
                    action: () => navigate("/help-center"),
                  },
                  { label: "FAQ", action: () => navigate("/faq") },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <FooterNewsletter />
          </div>

          <div className="border-t border-white/[0.05] mt-8 pt-4 -mx-6 px-6 pb-4 bg-[#141414] flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#9CA3AF]">
            <span>
              © {new Date().getFullYear()} ILM ORA All rights reserved.
            </span>
            <div className="flex items-center gap-2">
              <span>ILM ORA  </span>
              <span className="text-red-500 text-base">❤️Powered by</span>
              <span>Texora AI</span>
            </div>
          </div>
        </div>
      </footer>

     {/* ── Login Modal ── */}
     {showLoginModal && (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(5px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLoginModal(false);
            }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.97)",
                border: "1px solid rgba(249,115,22,0.18)",
                padding: "20px 26px 18px",
                animation: "modalFadeUp 0.3s ease both",
              }}
            >
              <style>{`@keyframes modalFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>

              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-xl font-bold leading-none"
                aria-label="Close"
              >
                ×
              </button>

              <div className="flex justify-center mb-2">
                <span className="text-3xl font-extrabold font-serif tracking-wide">
                  <span className="text-green-600">ILM</span>
                  <span className="text-[#F97316] ml-2">ORA</span>
                </span>
              </div>

              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-[#1e0e02] mb-0.5">
                  Welcome back!
                </h2>
              </div>

              <div className="flex justify-center mb-3">
                <GoogleLogin
                  onSuccess={handleModalGoogle}
                  onError={() => console.error("Google OAuth failed")}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="360"
                  auto_select={false}
                  cancel_on_tap_outside={true}
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(180,100,30,0.15)" }}
                />
                <span className="text-xs text-[#b8906a] uppercase tracking-widest font-medium">
                  OR
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(180,100,30,0.15)" }}
                />
              </div>

              <form onSubmit={handleModalSubmit}>
                <div className="mb-2">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    required
                    disabled={modalLoading}
                    className="w-full px-3.5 py-2 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1.5px solid rgba(180,120,60,0.2)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#F97316";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(249,115,22,0.1)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(180,120,60,0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div className="mb-1.5">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showModalPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={modalPassword}
                      onChange={(e) => setModalPassword(e.target.value)}
                      required
                      disabled={modalLoading}
                      className="w-full px-3.5 py-2 pr-11 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        border: "1.5px solid rgba(180,120,60,0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#F97316";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(249,115,22,0.1)";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(180,120,60,0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8906a] hover:text-[#F97316] transition p-0 bg-transparent border-none cursor-pointer"
                      tabIndex={-1}
                    >
                      {showModalPw ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-[#F97316] hover:underline bg-transparent border-none cursor-pointer font-medium p-0"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg,#F97316,#ea580c)",
                    boxShadow: "0 4px 18px rgba(249,115,22,0.32)",
                  }}
                >
                  {modalLoading ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="w-full mt-2.5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{
                  background: "transparent",
                  border: "2px solid #16a34a",
                  color: "#16a34a",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#16a34a";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#16a34a";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M2 12h20" />
                </svg>
                Sign up
              </button>

              <div className="text-center mt-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-xs text-[#b8906a] hover:text-[#8a6040] bg-transparent border-none cursor-pointer transition-colors"
                >
                  ← Back to home
                </button>
              </div>
            </div>
          </div>
        </GoogleOAuthProvider>
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}          
        />
      )}
      {showForgotModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotModal(false)}
          onSwitchToLogin={() => {
            setShowForgotModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
      <TexoraFloatingWidget />
    </div>
  );
}