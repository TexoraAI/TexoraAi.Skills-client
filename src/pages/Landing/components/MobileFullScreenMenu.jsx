// import { useEffect, useState } from "react";
// import {
//   BarChart3,
//   ChevronDown,
//   Code2,
//   FileText,
//   GraduationCap,
//   LogOut,
//   Sparkles,
//   Users,
//   LayoutDashboard,
//   PenTool,
//   CalendarCheck,
//   X,
// } from "lucide-react";

// /* ─────────────────────────────────────────────────────────────────
//    FULL-SCREEN MOBILE MENU
// ───────────────────────────────────────────────────────────────── */
// export default function MobileFullScreenMenu({
//   onClose,
//   navLinks,
//   navButtons,
//   user,
//   navigate,
//   handleLogout,
//   setShowLoginModal,
//   productMenuItems,
//   productRoutes,
// }) {
//   const [ilmoraFeatureOpen, setIlmoraFeatureOpen] = useState(false);
//   const [productOpen, setProductOpen] = useState(false);
  

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   const AccordionSection = ({ label, isOpen, onToggle, children }) => (
//     <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
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
//           color: "#ffffff",
//         }}
//       >
//         {label}
//         <span
//           style={{
//             transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
//             transition: "transform 0.2s ease",
//             display: "flex",
//             alignItems: "center",
//             color: "#9CA3AF",
//           }}
//         >
//           <ChevronDown size={16} />
//         </span>
//       </button>
//       {isOpen && (
//         <div
//           style={{
//             background: "#232323", // ⬅ matches navbar dropdown color
//             borderTop: "1px solid rgba(255,255,255,0.08)",
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
//         // ⬅ same dark family as navbar (#1F1D1F) + footer (#191818)
//         background: "linear-gradient(180deg, #1F1D1F 0%, #191818 100%)",
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
//           borderBottom: "1px solid rgba(255,255,255,0.08)",
//           background: "#1F1D1F", // ⬅ same as navbar bg
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
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = "#3a3a3a";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = "#2A2A2A";
//           }}
//           style={{
//             border: "none",
//             background: "#2A2A2A",
//             borderRadius: 10,
//             width: 36,
//             height: 36,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             color: "#ffffff",
//             transition: "background 0.2s ease",
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
//         {/* All Courses — navigates straight to the dedicated page.
//             No popup, no dropdown, no fullscreen category browser. */}
//         <div style={{ padding: "0 4px 8px" }}>
//           <button
//             onClick={() => {
//               navigate("/all-courses");
//               onClose();
//             }}
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "center",
//               padding: "15px 20px",
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//               fontSize: 15,
//               fontWeight: 600,
//               color: "#ffffff",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.12)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = "transparent";
//             }}
//           >
//             All Courses
//           </button>
//         </div>

//         {/* Divider */}
//         <div
//           style={{
//             height: 1,
//             background: "rgba(255,255,255,0.08)",
//             margin: "4px 20px 4px",
//           }}
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
//               borderBottom: "1px solid rgba(255,255,255,0.08)",
//               background: "transparent",
//               cursor: "pointer",
//               textAlign: "left",
//               fontSize: 15,
//               fontWeight: 600,
//               color: "#ffffff",
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
//                   color: "#ffffff",
//                   margin: 0,
//                 }}
//               >
//                 Student Hub
//               </p>
//               <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
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
//                   color: "#ffffff",
//                   margin: 0,
//                 }}
//               >
//                 Trainer Hub
//               </p>
//               <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
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
//                   color: "#ffffff",
//                   margin: 0,
//                 }}
//               >
//                 Manager Hub
//               </p>
//               <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
//                 Analytics, Performance &amp; Team Development
//               </p>
//             </div>
//           </button>

//           {/* Whiteboard — moved here from Product */}
//           <button
//             onClick={() => {
//               navigate(productRoutes.whiteboard);
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
//               <PenTool size={18} style={{ color: "#f97316" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#ffffff",
//                   margin: 0,
//                 }}
//               >
//                 Whiteboard
//               </p>
//               <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
//                 Draw, Design &amp; Collaborate Visually
//               </p>
//             </div>
//           </button>
//           {/* AI Companion — moved here from Product */}
//           <button
//             onClick={() => {
//               navigate(productRoutes.aiCompanion);
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
//               <Sparkles size={18} style={{ color: "#9333ea" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#ffffff",
//                   margin: 0,
//                 }}
//               >
//                 AI Companion
//               </p>
//               <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
//                 Your personal AI tutor, 24/7
//               </p>
//             </div>
//           </button>

//           {/* AI Resume Builder — moved here from Product */}
//           <button
//             onClick={() => {
//               navigate(productRoutes.resume);
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
//                   color: "#ffffff",
//                   margin: 0,
//                 }}
//               >
//                 AI Resume Builder
//               </p>
//               <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
//                 Build a job-ready resume with AI
//               </p>
//             </div>
//           </button>

//           {/* Coding Lab — new item, added directly below AI Resume Builder.
//               Same button shape/spacing/icon-box pattern as every item
//               above; only the icon, colors, label and route differ. */}
//           <button
//             onClick={() => {
//               navigate("/coding-lab");
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
//                 background: "#ecfeff",
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <Code2 size={18} style={{ color: "#0891b2" }} />
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "#ffffff",
//                   margin: 0,
//                 }}
//               >
//                 Coding Lab
//               </p>
//               <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
//                 Practice, Code &amp; Build Real Projects
//               </p>
//             </div>
//           </button>
//           {/* Study Plan — new item, added directly after Whiteboard */}

//           <button
//            onClick={() => {
//              navigate(productRoutes.studyPlan);
//              onClose();
//            }}
//            style={{
//              width: "100%",
//              display: "flex",
//              alignItems: "flex-start",             
//              gap: 12,
//              padding: "12px 24px",
//              border: "none",
//              background: "transparent",
//              cursor: "pointer",
//              textAlign: "left",
//            }}
//          >
//            <div
//              style={{
//                width: 36,
//                height: 36,
//                background: "#fff7ed",
//                borderRadius: 8,
//                display: "flex",
//                alignItems: "center",
//                justifyContent: "center",
//                flexShrink: 0,
//              }}
//            >
//              <CalendarCheck size={18} style={{ color: "#f97316" }} />
//            </div>
//            <div>
//             <p style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", margin: 0 }}>
//                Study Plan
//              </p>
//              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
//               Personalized Study Plans & Progress Tracking
//             </p>
//           </div>
//          </button>
//         </AccordionSection>

//         {/* ── Product Accordion ── */}
//         <AccordionSection
//           label="Product"
//           isOpen={productOpen}
//           onToggle={() => setProductOpen((p) => !p)}
//         >
//           {productMenuItems.map((item) => {
//             const iconMap = {
//               Users,
//               FileText,
//               LayoutDashboard,
//               Sparkles,
//             };
//             const Icon = iconMap[item.icon];

//             return (
//               <button
//                 key={item.key}
//                 onClick={() => {
//                   navigate(productRoutes[item.key]);
//                   onClose();
//                 }}
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: 12,
//                   padding: "12px 24px",
//                   border: "none",
//                   background: "transparent",
//                   cursor: "pointer",
//                   textAlign: "left",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 36,
//                     height: 36,
//                     background:
//                       item.key === "resume"
//                         ? "#f0fdf4"
//                         : item.key === "aiCompanion"
//                         ? "#faf5ff"
//                         : "#fff7ed",
//                     borderRadius: 8,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {Icon && (
//                     <Icon
//                       size={18}
//                       style={{
//                         color:
//                           item.key === "resume"
//                             ? "#16a34a"
//                             : item.key === "aiCompanion"
//                             ? "#9333ea"
//                             : "#f97316",
//                       }}
//                     />
//                   )}
//                 </div>
//                 <div>
//                   <p
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 600,
//                       color: "#ffffff",
//                       margin: 0,
//                     }}
//                   >
//                     {item.title}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: 12,
//                       color: "#9CA3AF",
//                       margin: "2px 0 0",
//                     }}
//                   >
//                     {item.description}
//                   </p>
//                 </div>
//               </button>
//             );
//           })}
//         </AccordionSection>

//        {/* Mentors */}
// <button
//   onClick={() => {
//     document.querySelector("#mentors")?.scrollIntoView({ behavior: "smooth" });
//     onClose();
//   }}
//   style={{
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     padding: "15px 20px",
//     border: "none",
//     borderBottom: "1px solid rgba(255,255,255,0.08)",
//     background: "transparent",
//     cursor: "pointer",
//     textAlign: "left",
//     fontSize: 15,
//     fontWeight: 600,
//     color: "#ffffff",
//   }}
// >
//   Mentors
// </button>

// {/* Success Stories */}
// <button
//   onClick={() => {
//     document
//       .querySelector("#successstories")
//       ?.scrollIntoView({ behavior: "smooth" });
//     onClose();
//   }}
//   style={{
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     padding: "15px 20px",
//     border: "none",
//     borderBottom: "1px solid rgba(255,255,255,0.08)",
//     background: "transparent",
//     cursor: "pointer",
//     textAlign: "left",
//     fontSize: 15,
//     fontWeight: 600,
//     color: "#ffffff",
//   }}
// >
//   Success Stories
// </button>
//         {/* Divider */}
//         <div
//           style={{
//             height: 1,
//             background: "rgba(255,255,255,0.08)",
//             margin: "12px 20px",
//           }}
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
//                   background: "#232323", // ⬅ matches dropdown/footer family
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   borderRadius: 14,
//                   marginBottom: 4,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 38,
//                     height: 38,
//                     background: "#F97316",
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
//                       color: "#ffffff",
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
//                       color: "#9CA3AF",
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
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   background: "#2A2A2A",
//                   color: "#fff",
//                   fontWeight: 600,
//                   fontSize: 15,
//                   cursor: "pointer",
//                 }}
//               >
//                 Go to Dashboard
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
//                 // ⬅ same orange gradient CTA as navbar's desktop "Get Started"
//                 background: "linear-gradient(135deg,#F97316,#EA580C)",
//                 color: "#fff",
//                 fontWeight: 700,
//                 fontSize: 15,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 8,
//                 boxShadow: "0 8px 20px rgba(249,115,22,0.3)",
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








































import { useEffect, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Code2,
  FileText,
  GraduationCap,
  LogOut,
  Sparkles,
  Users,
  LayoutDashboard,
  PenTool,
  CalendarCheck,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   FULL-SCREEN MOBILE MENU
───────────────────────────────────────────────────────────────── */
export default function MobileFullScreenMenu({
  onClose,
  navLinks,
  navButtons,
  user,
  navigate,
  handleLogout,
  setShowLoginModal,
  productMenuItems,
  productRoutes,
}) {
  const [ilmoraFeatureOpen, setIlmoraFeatureOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ILM ORA Feature items — same 8 items/order as the desktop Navbar
  // compact grid dropdown. Kept local to this component since routes
  // for a few keys (whiteboard, aiCompanion, resume, studyPlan) come
  // from the `productRoutes` prop, same as before.
  const HUB_ITEMS = [
    { key: "student", route: "/student-hub", icon: GraduationCap, color: "#16a34a", title: "Student Hub", desc: "AI-Powered Learning & Career Growth" },
    { key: "trainer", route: "/trainer-hub", icon: Users, color: "#2563eb", title: "Trainer Hub", desc: "Training Management & Mentorship" },
    { key: "admin", route: "/manager-hub", icon: BarChart3, color: "#9333ea", title: "Manager Hub", desc: "Analytics, Performance & Team Development" },
    { key: "whiteboard", route: productRoutes.whiteboard, icon: PenTool, color: "#f97316", title: "Whiteboard", desc: "Draw, Design & Collaborate Visually" },
    { key: "aiCompanion", route: productRoutes.aiCompanion, icon: Sparkles, color: "#9333ea", title: "AI Companion", desc: "Your personal AI tutor, 24/7" },
    { key: "resume", route: productRoutes.resume, icon: FileText, color: "#16a34a", title: "AI Resume Builder", desc: "Build a job-ready resume with AI" },
    { key: "codingLab", route: "/coding-lab", icon: Code2, color: "#0891b2", title: "Coding Lab", desc: "Practice, Code & Build Real Projects" },
    { key: "studyPlan", route: productRoutes.studyPlan, icon: CalendarCheck, color: "#f97316", title: "Study Plan", desc: "Personalized Study Plans & Progress Tracking" },
  ];

  const AccordionSection = ({ label, isOpen, onToggle, children }) => (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
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
          color: "#ffffff",
        }}
      >
        {label}
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            display: "flex",
            alignItems: "center",
            color: "#9CA3AF",
          }}
        >
          <ChevronDown size={16} />
        </span>
      </button>
      {isOpen && (
        <div
          style={{
            background: "#232323", // ⬅ matches navbar dropdown color
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "10px 12px",
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
        // ⬅ same dark family as navbar (#1F1D1F) + footer (#191818)
        background: "linear-gradient(180deg, #1F1D1F 0%, #191818 100%)",
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
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "#1F1D1F", // ⬅ same as navbar bg
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3a3a3a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#2A2A2A";
          }}
          style={{
            border: "none",
            background: "#2A2A2A",
            borderRadius: 10,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#ffffff",
            transition: "background 0.2s ease",
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
        {/* All Courses — navigates straight to the dedicated page.
            No popup, no dropdown, no fullscreen category browser. */}
        <div style={{ padding: "0 4px 8px" }}>
          <button
            onClick={() => {
              navigate("/all-courses");
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "15px 20px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 15,
              fontWeight: 600,
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            All Courses
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.08)",
            margin: "4px 20px 4px",
          }}
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
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 15,
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            {btn.text}
          </button>
        ))}

        {/* ── ILM ORA Feature Accordion — compact 2-column card grid,
            same visual language as the desktop Navbar dropdown. ── */}
        <AccordionSection
          label="ILM ORA Feature"
          isOpen={ilmoraFeatureOpen}
          onToggle={() => setIlmoraFeatureOpen((p) => !p)}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {HUB_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    navigate(item.route);
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 4,
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.05)",
                    background: "#1A1A1A",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon size={16} style={{ color: item.color, flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: "#9CA3AF",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </AccordionSection>

        {/* ── Product Accordion ── */}
        <AccordionSection
          label="Product"
          isOpen={productOpen}
          onToggle={() => setProductOpen((p) => !p)}
        >
          {productMenuItems.map((item) => {
            const iconMap = {
              Users,
              FileText,
              LayoutDashboard,
              Sparkles,
            };
            const Icon = iconMap[item.icon];

            return (
              <button
                key={item.key}
                onClick={() => {
                  navigate(productRoutes[item.key]);
                  onClose();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 12px",
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
                    background:
                      item.key === "resume"
                        ? "#f0fdf4"
                        : item.key === "aiCompanion"
                        ? "#faf5ff"
                        : "#fff7ed",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      style={{
                        color:
                          item.key === "resume"
                            ? "#16a34a"
                            : item.key === "aiCompanion"
                            ? "#9333ea"
                            : "#f97316",
                      }}
                    />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ffffff",
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      margin: "2px 0 0",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </AccordionSection>

        {/* Mentors */}
        <button
          onClick={() => {
            document.querySelector("#mentors")?.scrollIntoView({ behavior: "smooth" });
            onClose();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "15px 20px",
            border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
            fontSize: 15,
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          Mentors
        </button>

        {/* Success Stories */}
        <button
          onClick={() => {
            document
              .querySelector("#successstories")
              ?.scrollIntoView({ behavior: "smooth" });
            onClose();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "15px 20px",
            border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
            fontSize: 15,
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          Success Stories
        </button>
        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.08)",
            margin: "12px 20px",
          }}
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
                  background: "#232323", // ⬅ matches dropdown/footer family
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: "#F97316",
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
                      color: "#ffffff",
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
                      color: "#9CA3AF",
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
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#2A2A2A",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Go to Dashboard
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
                // ⬅ same orange gradient CTA as navbar's desktop "Get Started"
                background: "linear-gradient(135deg,#F97316,#EA580C)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 8px 20px rgba(249,115,22,0.3)",
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