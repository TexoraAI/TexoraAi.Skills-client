// import { useState, useEffect, useLayoutEffect, useRef } from "react";
// import {
//   Sparkles, FileText, Upload, Check, Target, BarChart3, Brain,
//   Download, Shield, Star, Users, ChevronRight, ChevronDown,
//   Linkedin, PenLine, TrendingUp, LayoutTemplate, Award, Menu, X,
//   Clock, BookOpen, GraduationCap, Code, Mic, Globe, Flag,
//   Zap, Moon, Search, BarChart2, Sun,
//   LogOut, User,
// } from "lucide-react";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import auth from "../../auth";

// const GOOGLE_CLIENT_ID = "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// const ORANGE = "#f97316";
// const GREEN  = "#16a34a";
// const DARK   = "#0f172a";

// const GLOBAL_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   html { scroll-behavior: smooth; }
//   body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; }
//   ::-webkit-scrollbar { width: 4px; }
//   ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 4px; }

//   @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
//   @keyframes slideL   { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
//   @keyframes slideR   { from { opacity:0; transform:translateX(20px); }  to { opacity:1; transform:translateX(0); } }
//   @keyframes float    { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-8px); } }
//   @keyframes shimmer  { 0%,100%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } }
//   @keyframes dropIn   { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
//   @keyframes spin     { to { transform:rotate(360deg); } }
//   @keyframes modalFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

//   .fade-up    { animation: fadeUp 0.6s ease both; }
//   .slide-l    { animation: slideL 0.6s ease both; }
//   .slide-r    { animation: slideR 0.6s ease both; }
//   .float-anim { animation: float 3.5s ease-in-out infinite; }
//   .drop-in    { animation: dropIn 0.2s ease both; }
//   .delay-1    { animation-delay: 0.1s; }
//   .delay-2    { animation-delay: 0.2s; }
//   .delay-3    { animation-delay: 0.3s; }
//   .delay-4    { animation-delay: 0.4s; }

//   .gradient-text {
//     background: linear-gradient(135deg, #f97316, #ea6a0a, #f59e0b);
//     background-size: 200%;
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//     animation: shimmer 3s ease infinite;
//   }

//   .btn-primary {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 12px 28px; background: #f97316; color: #fff;
//     font-weight: 700; font-size: 14px; border: none; border-radius: 10px;
//     cursor: pointer; font-family: inherit; transition: all 0.2s;
//     box-shadow: 0 4px 14px rgba(249,115,22,0.32);
//   }
//   .btn-primary:hover { background: #ea6a0a; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(249,115,22,0.4); }
//   .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

//   .btn-dark {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 10px 22px; background: #0f172a; color: #fff;
//     font-weight: 700; font-size: 14px; border: none; border-radius: 8px;
//     cursor: pointer; font-family: inherit; transition: all 0.2s;
//   }
//   .btn-dark:hover { background: #1e293b; transform: translateY(-1px); }

//   .btn-outline {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 11px 24px; background: #fff; color: #0f172a;
//     font-weight: 700; font-size: 14px; border: 2px solid #e2e8f0;
//     border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s;
//   }
//   .btn-outline:hover { border-color: #f97316; color: #f97316; transform: translateY(-1px); }

//   .btn-ghost-white {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 11px 24px; background: rgba(255,255,255,0.1); color: #fff;
//     font-weight: 700; font-size: 14px; border: 2px solid rgba(255,255,255,0.2);
//     border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s;
//   }
//   .btn-ghost-white:hover { background: rgba(255,255,255,0.18); }

//   .card-hover { transition: all 0.25s ease; cursor: pointer; }
//   .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.09); }

//   .nav-link {
//     display: flex; align-items: center; gap: 5px;
//     padding: 8px 14px; border-radius: 8px; font-size: 14px;
//     font-weight: 500; color: #475569; cursor: pointer; border: none;
//     background: transparent; font-family: inherit; transition: all 0.15s; white-space: nowrap;
//   }
//   .nav-link:hover, .nav-link.active { background: #fff7ed; color: #f97316; }

//   .mega-dropdown {
//     position: absolute; top: calc(100% + 10px); left: -20px;
//     background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
//     box-shadow: 0 20px 60px rgba(0,0,0,0.12); z-index: 500; display: flex;
//     overflow: hidden; width: 700px;
//   }

//   .feature-card {
//     background: #fff; border-radius: 16px; padding: 26px 22px;
//     border: 1.5px solid #e2e8f0; transition: all 0.25s; cursor: pointer;
//   }
//   .feature-card:hover { transform: translateY(-5px); border-color: #f97316; box-shadow: 0 14px 36px rgba(249,115,22,0.1); }

//   .stat-card {
//     background: #fff; border-radius: 14px; padding: 22px 18px;
//     border: 1.5px solid #e2e8f0; text-align: center; transition: all 0.25s;
//   }
//   .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.07); }

//   .step-card {
//     background: #fff; border-radius: 14px; padding: 24px 20px;
//     border: 1.5px solid #e2e8f0; position: relative; overflow: hidden; transition: all 0.25s;
//   }
//   .step-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.07); }

//   .tpl-thumb {
//     border-radius: 12px; overflow: hidden; border: 2px solid #e2e8f0;
//     cursor: pointer; transition: all 0.2s; background: #fff;
//   }
//   .tpl-thumb:hover, .tpl-thumb.sel { border-color: var(--tpl-accent, #f97316); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

//   .faq-item { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: border-color 0.2s; }
//   .faq-item.open { border-color: #f97316; }

//   .floating-badge {
//     position: absolute; background: #fff; border-radius: 12px;
//     padding: 10px 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);
//     border: 1px solid #e2e8f0; font-size: 12px; font-weight: 700;
//     display: flex; align-items: center; gap: 8px; white-space: nowrap; z-index: 2;
//   }

//   .hero-badge {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 6px 16px 6px 10px; border-radius: 999px;
//     background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.22);
//     color: #f97316; font-size: 12px; font-weight: 700;
//   }

//   .section-tag {
//     font-size: 11px; font-weight: 700; color: #f97316;
//     letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 10px;
//   }

//   .mobile-menu {
//     position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
//     background: #fff; z-index: 299; padding: 20px 24px;
//     display: flex; flex-direction: column; gap: 8px; overflow-y: auto;
//   }
//   .mobile-nav-link {
//     display: flex; align-items: center; padding: 14px 16px;
//     border-radius: 10px; font-size: 15px; font-weight: 600; color: #374151;
//     cursor: pointer; border: none; background: transparent;
//     font-family: inherit; text-align: left; width: 100%; transition: background 0.15s;
//   }
//   .mobile-nav-link:hover { background: #fff7ed; color: #f97316; }

//   /* ─── LAYOUT FLASH PREVENTION ─── */
//   .hero-grid {
//     display: grid !important;
//     grid-template-columns: 1fr 1fr;
//     gap: 60px;
//     align-items: center;
//   }

//   /* ─── RESPONSIVE BREAKPOINTS ─── */
//   @media (max-width: 1024px) {
//     .mega-dropdown { width: 560px; }
//   }

//   @media (max-width: 900px) {
//     .hide-mob { display: none !important; }
//     .show-mob { display: flex !important; }
//     .hero-grid { grid-template-columns: 1fr !important; }
//     .feats-grid { grid-template-columns: 1fr !important; }
//     .steps-grid { grid-template-columns: 1fr 1fr !important; }
//     .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
//     .tpl-grid { grid-template-columns: repeat(4,1fr) !important; }
//     .tpl-preview-grid { grid-template-columns: 1fr !important; }
//     .test-grid { grid-template-columns: 1fr !important; }
//     .feats-inner-grid { grid-template-columns: 1fr !important; }
//     .cta-section { padding: 28px 20px !important; }
//     .cta-btns { flex-direction: column; align-items: center; }
//     .cta-btns button { width: 100%; max-width: 320px; justify-content: center; }
//   }

//   @media (max-width: 600px) {
//     .steps-grid { grid-template-columns: 1fr !important; }
//     .tpl-grid { grid-template-columns: repeat(2,1fr) !important; }
//     .stats-grid { grid-template-columns: 1fr 1fr !important; }
//     .hero-title { font-size: 2rem !important; }
//     .cta-section { padding: 22px 16px !important; }
//     .cta-icon { width: 38px !important; height: 38px !important; margin-bottom: 10px !important; }
//     .cta-icon svg { width: 16px !important; height: 16px !important; }
//     .cta-title { font-size: 1.25rem !important; }
//     .cta-sub { font-size: 12px !important; margin-bottom: 16px !important; }
//   }
// `;

// function StyleInjector() {
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.id = "ilmora-resume-css";
//     style.textContent = GLOBAL_CSS;
//     document.head.appendChild(style);
//     return () => {
//       style.remove();
//     };
//   }, []);
//   return null;
// }

// /* ─── Resume Thumbnail ── */
// function ResumeThumbnail({ accent = "#2563eb", sidebar = false }) {
//   if (sidebar) return (
//     <div style={{ background: "#fff", display: "flex", minHeight: 200, fontSize: 6, fontFamily: "Georgia,serif" }}>
//       <div style={{ width: "34%", background: accent, color: "#fff", padding: "12px 8px" }}>
//         <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.2)", margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>AJ</div>
//         <div style={{ fontWeight: 700, fontSize: 6.5, textAlign: "center", marginBottom: 2 }}>Alex Johnson</div>
//         <div style={{ opacity: 0.75, fontSize: 5, textAlign: "center", marginBottom: 10 }}>Full Stack Dev</div>
//         {["Contact", "Skills", "Certs"].map(s => (
//           <div key={s}>
//             <div style={{ fontSize: 4.5, fontWeight: 700, textTransform: "uppercase", opacity: 0.6, borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: 2, marginBottom: 3, marginTop: 7 }}>{s}</div>
//             {[1,2,3].map(i => <div key={i} style={{ height: 3, background: "rgba(255,255,255,0.28)", borderRadius: 2, marginBottom: 2 }} />)}
//           </div>
//         ))}
//       </div>
//       <div style={{ flex: 1, padding: "12px 9px" }}>
//         {["Experience", "Education", "Projects"].map(s => (
//           <div key={s} style={{ marginBottom: 9 }}>
//             <div style={{ fontSize: 5, fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 2, marginBottom: 4 }}>{s}</div>
//             {[1,2,3].map(i => <div key={i} style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 2, width: i === 1 ? "100%" : i === 2 ? "80%" : "60%" }} />)}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
//   return (
//     <div style={{ background: "#fff", padding: "12px 11px", minHeight: 200, fontFamily: "Georgia,serif" }}>
//       <div style={{ textAlign: "center", borderBottom: `2px solid ${accent}`, paddingBottom: 7, marginBottom: 9 }}>
//         <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", marginBottom: 2 }}>Alex Johnson</div>
//         <div style={{ fontSize: 6, color: accent, fontWeight: 600, marginBottom: 4 }}>Full Stack Developer</div>
//         <div style={{ display: "flex", justifyContent: "center", gap: 7, flexWrap: "wrap" }}>
//           {["✉ alex@email.com", "☎ +91 98765", "📍 Hyderabad"].map(c => (
//             <span key={c} style={{ fontSize: 5, color: "#6b7280" }}>{c}</span>
//           ))}
//         </div>
//       </div>
//       {["Profile Summary", "Work Experience", "Education", "Technical Skills", "Projects", "Certifications"].map(s => (
//         <div key={s} style={{ marginBottom: 7 }}>
//           <div style={{ fontSize: 5, fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 2, marginBottom: 4 }}>{s}</div>
//           {[1, 2].map(i => <div key={i} style={{ height: 2.5, background: "#e5e7eb", borderRadius: 2, marginBottom: 2.5, width: i === 2 ? "75%" : "100%" }} />)}
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ─── LOGIN MODAL ── */
// function LoginModal({ show, onClose, theme, navigate }) {
//   const [modalEmail, setModalEmail] = useState("");
//   const [modalPassword, setModalPassword] = useState("");
//   const [modalLoading, setModalLoading] = useState(false);
//   const [showModalPw, setShowModalPw] = useState(false);

//   useEffect(() => {
//     const onKey = (e) => { if (e.key === "Escape") onClose(); };
//     if (show) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [show, onClose]);

//   useEffect(() => {
//     if (show) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => { document.body.style.overflow = ""; };
//   }, [show]);

//   if (!show) return null;

//   const redirectByRole = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "ADMIN":    navigate("/admin",    { replace: true }); break;
//       case "TRAINER":  navigate("/trainer",  { replace: true }); break;
//       case "BUSINESS": navigate("/business", { replace: true }); break;
//       default:         navigate("/student",  { replace: true });
//     }
//   };

//   const handleModalSubmit = async (e) => {
//     e.preventDefault();
//     if (modalLoading) return;
//     setModalLoading(true);
//     try {
//       const ok = await auth.login({ email: modalEmail, password: modalPassword });
//       if (ok) {
//         const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         onClose();
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

//   const handleModalGoogle = async (res) => {
//     try {
//       localStorage.removeItem("lms_token");
//       localStorage.removeItem("lms_user");
//       localStorage.removeItem("role");
//       const dec  = jwtDecode(res.credential);
//       const resp = await auth.googleLogin({ idToken: res.credential });
//       if (resp?.isNewUser === true) {
//         localStorage.setItem("role", "STUDENT");
//         localStorage.setItem("lms_user", JSON.stringify({
//           name: dec.name, email: dec.email, role: "student", isNewUser: true,
//         }));
//         onClose();
//         navigate("/ilm-demo", { replace: true });
//       } else {
//         const role = (resp?.role || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         localStorage.setItem("lms_user", JSON.stringify({
//           name: dec.name, email: dec.email, role: role.toLowerCase(),
//         }));
//         onClose();
//         redirectByRole(role);
//       }
//     } catch (err) {
//       try {
//         const dec = jwtDecode(res.credential);
//         localStorage.setItem("role", "STUDENT");
//         localStorage.setItem("lms_user", JSON.stringify({
//           name: dec.name, email: dec.email, role: "student", isNewUser: true,
//         }));
//         onClose();
//         navigate("/ilm-demo", { replace: true });
//       } catch (_) {
//         alert("Google login failed. Please try again.");
//       }
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <div
//         style={{
//           position: "fixed", inset: 0, zIndex: 9999,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           padding: "16px", background: "rgba(0,0,0,0.55)",
//           backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
//         }}
//         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//       >
//         <div
//           style={{
//             position: "relative", width: "100%", maxWidth: "420px",
//             borderRadius: "16px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
//             background: "rgba(255,255,255,0.97)", border: "1px solid rgba(249,115,22,0.18)",
//             padding: "36px 32px 28px", animation: "modalFadeUp 0.3s ease both",
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: "20px", fontWeight: 700, lineHeight: 1, transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }} aria-label="Close">×</button>

//           <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
//             <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.2rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.01em" }}>
//               <span style={{ color: "#16a34a" }}>ILM</span>
//               <span style={{ color: "#F97316", marginLeft: "8px" }}>ORA</span>
//             </span>
//           </div>

//           <div style={{ textAlign: "center", marginBottom: "22px" }}>
//             <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#1e0e02", marginBottom: "6px" }}>Welcome back!</h2>
//             <p style={{ fontSize: "0.84rem", color: "#8a6040", fontFamily: "'DM Sans', sans-serif" }}>
//               Don't have an account?{" "}
//               <button onClick={() => { onClose(); navigate("/complete-profile"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#F97316", fontWeight: 700, fontSize: "0.84rem", padding: 0, fontFamily: "inherit" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>Apply now</button>
//             </p>
//           </div>

//           <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
//             <GoogleLogin onSuccess={handleModalGoogle} onError={() => console.error("Google OAuth failed")} theme="outline" size="large" text="continue_with" shape="rectangular" width="356" auto_select={false} cancel_on_tap_outside={true} />
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
//             <div style={{ flex: 1, height: "1px", background: "rgba(180,100,30,0.15)" }} />
//             <span style={{ fontSize: "0.7rem", color: "#b8906a", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>OR</span>
//             <div style={{ flex: 1, height: "1px", background: "rgba(180,100,30,0.15)" }} />
//           </div>

//           <form onSubmit={handleModalSubmit}>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#8a6040", marginBottom: "5px", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Email</label>
//               <input type="email" placeholder="Enter your email" value={modalEmail} onChange={e => setModalEmail(e.target.value)} required disabled={modalLoading} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(180,120,60,0.2)", borderRadius: "10px", color: "#1a0e06", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", opacity: modalLoading ? 0.5 : 1 }} onFocus={e => { e.target.style.borderColor = "#F97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; e.target.style.background = "#fff"; }} onBlur={e => { e.target.style.borderColor = "rgba(180,120,60,0.2)"; e.target.style.boxShadow = "none"; }} />
//             </div>

//             <div style={{ marginBottom: "8px" }}>
//               <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#8a6040", marginBottom: "5px", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Password</label>
//               <div style={{ position: "relative" }}>
//                 <input type={showModalPw ? "text" : "password"} placeholder="Enter your password" value={modalPassword} onChange={e => setModalPassword(e.target.value)} required disabled={modalLoading} style={{ width: "100%", padding: "11px 44px 11px 14px", background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(180,120,60,0.2)", borderRadius: "10px", color: "#1a0e06", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", opacity: modalLoading ? 0.5 : 1 }} onFocus={e => { e.target.style.borderColor = "#F97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; e.target.style.background = "#fff"; }} onBlur={e => { e.target.style.borderColor = "rgba(180,120,60,0.2)"; e.target.style.boxShadow = "none"; }} />
//                 <button type="button" onClick={() => setShowModalPw(p => !p)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#b8906a", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "color 0.2s", lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = "#F97316"} onMouseLeave={e => e.currentTarget.style.color = "#b8906a"} tabIndex={-1}>
//                   {showModalPw ? (
//                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
//                   ) : (
//                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div style={{ textAlign: "right", marginBottom: "18px" }}>
//               <button type="button" onClick={() => { onClose(); navigate("/forgot-password"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#F97316", fontSize: "0.78rem", fontWeight: 500, fontFamily: "inherit" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>Forgot password?</button>
//             </div>

//             <button type="submit" disabled={modalLoading} style={{ width: "100%", padding: "13px", borderRadius: "10px", fontWeight: 700, color: "#fff", fontSize: "0.95rem", border: "none", cursor: modalLoading ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#F97316,#ea580c)", boxShadow: "0 4px 18px rgba(249,115,22,0.32)", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: modalLoading ? 0.7 : 1, transition: "opacity 0.2s, transform 0.15s" }} onMouseEnter={e => { if (!modalLoading) e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
//               {modalLoading ? (<><span style={{ display: "inline-block", width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Signing in…</>) : "Log in"}
//             </button>
//           </form>

//           <div style={{ textAlign: "center", marginTop: "18px" }}>
//             <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#b8906a", fontSize: "0.78rem", fontFamily: "inherit", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#8a6040"} onMouseLeave={e => e.currentTarget.style.color = "#b8906a"}>← Back to home</button>
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// /* ─── Constants ── */
// const TEMPLATES = [
//   { id: "summit",  name: "Summit",       accent: "#2563eb", sidebar: false, tag: "Popular" },
//   { id: "maple",   name: "Maple",        accent: "#dc2626", sidebar: false, tag: "Bold" },
//   { id: "valiant", name: "Valiant",      accent: "#0891b2", sidebar: true,  tag: "2-Col" },
//   { id: "quartz",  name: "Quartz",       accent: "#b45309", sidebar: false, tag: "Classic" },
//   { id: "exec",    name: "Executive",    accent: "#1e293b", sidebar: true,  tag: "Pro" },
//   { id: "aurora",  name: "Aurora",       accent: "#7c3aed", sidebar: false, tag: "Creative" },
//   { id: "minimal", name: "Minimal",      accent: "#374151", sidebar: false, tag: "Clean" },
//   { id: "pro",     name: "Professional", accent: "#065f46", sidebar: false, tag: "ATS" },
//   { id: "coral",   name: "Coral",        accent: "#e11d48", sidebar: false, tag: "Vibrant" },
//   { id: "slate",   name: "Slate",        accent: "#475569", sidebar: true,  tag: "Modern" },
// ];

// const FEATURES = [
//   { Icon: Sparkles, title: "AI Resume Generation", desc: "Describe your role — AI writes a complete ATS-optimised resume in 60 seconds with summary, experience, skills and projects.", badge: "Most Popular", badgeColor: ORANGE, gradient: "linear-gradient(135deg,#7c3aed,#f97316)" },
//   { Icon: Linkedin, title: "LinkedIn PDF Import", desc: "Download your LinkedIn PDF and upload it. AI extracts your complete work history, education and skills automatically.", badge: "Smart Import", badgeColor: "#0077b5", gradient: "linear-gradient(135deg,#0077b5,#0891b2)" },
//   { Icon: Upload,   title: "Upload Existing Resume", desc: "Have an old resume? Upload your PDF and AI extracts every section so you can modernise it with our fresh templates.", badge: "AI Powered", badgeColor: GREEN, gradient: `linear-gradient(135deg,${GREEN},#0891b2)` },
//   { Icon: PenLine,  title: "Build from Scratch", desc: "Prefer full control? Use our guided editor to build a stunning resume section by section with a live preview.", badge: "Full Control", badgeColor: "#6b7280", gradient: "linear-gradient(135deg,#4b5563,#374151)" },
// ];

// const ATS_FEATURES = [
//   { Icon: Search,         title: "ATS Score Checker",      desc: "Upload any resume PDF and get an instant ATS compatibility score with actionable suggestions.", color: GREEN },
//   { Icon: BarChart3,      title: "Resume Score Breakdown",  desc: "Detailed 100-point scoring across 12 sections — see exactly what's missing and how to fix it.", color: ORANGE },
//   { Icon: Brain,          title: "AI Writing Assistant",    desc: "Describe in plain words — AI rewrites it professionally for your summary and job descriptions.", color: "#7c3aed" },
//   { Icon: Download,       title: "One-Click PDF Export",    desc: "Download your polished resume as a professional PDF ready to attach to any job application.", color: "#0077b5" },
//   { Icon: Shield,         title: "ATS Ready Badge",         desc: "Get certified ATS-friendly status on your resume when you meet all key recruiter requirements.", color: "#e11d48" },
//   { Icon: LayoutTemplate, title: "10 Pro Templates",        desc: "Choose from 10 professionally designed templates — clean, modern, two-column, creative and more.", color: "#b45309" },
// ];

// const STEPS = [
//   { num: "01", title: "Choose your method",  desc: "AI generate, LinkedIn import, PDF upload, or manual — pick the fastest path for you." },
//   { num: "02", title: "Pick a template",     desc: "Select from 10 ATS-friendly designs and preview live as you make changes." },
//   { num: "03", title: "Customise & refine",  desc: "Edit every section, get AI writing suggestions, and check your score in real time." },
//   { num: "04", title: "Download & apply",    desc: "Export as PDF and start applying. Most users land interviews within 2 weeks." },
// ];

// const STATS = [
//   { num: "50K+", label: "Resumes Created",  Icon: FileText,       color: ORANGE },
//   { num: "98%",  label: "ATS Pass Rate",    Icon: Target,         color: GREEN },
//   { num: "10",   label: "Pro Templates",    Icon: LayoutTemplate, color: "#7c3aed" },
//   { num: "3x",   label: "More Interviews",  Icon: TrendingUp,     color: "#0077b5" },
//   { num: "60s",  label: "AI Build Time",    Icon: Clock,          color: "#e11d48" },
//   { num: "Free", label: "To Get Started",   Icon: Star,           color: "#b45309" },
// ];

// const FAQS = [
//   { q: "Is the AI resume builder really free?", a: "Yes! You can create, edit and download your resume completely free. AI generation and all 10 templates are included at no cost." },
//   { q: "Will my resume pass ATS systems?", a: "Absolutely. All templates are designed with ATS compatibility in mind. You also get a built-in ATS Score Checker that grades your resume and suggests improvements." },
//   { q: "How does AI resume generation work?", a: "You enter your name, target job title, experience level, and key skills. Our AI generates a complete, tailored resume in under 60 seconds with professional content across all sections." },
//   { q: "Can I import my LinkedIn profile?", a: "Yes! Download your LinkedIn profile as a PDF (Profile → More → Save to PDF), then upload it here. AI extracts your complete work history, education, and skills." },
//   { q: "How many resumes can I create?", a: "You can create and save multiple resumes — one tailored for each job role or company you're applying to." },
//   { q: "What file format can I download?", a: "You can download your resume as a professional PDF, ready to email or upload to any job portal." },
// ];

// const MEGA_CATS = [
//   { key: "courses",  Icon: BookOpen,      title: "Courses",           sub: "PM, Design, Growth, AI" },
//   { key: "school",   Icon: GraduationCap, title: "School Boards",     sub: "CBSE, Bihar, ICSE, UP Board" },
//   { key: "comp",     Icon: Award,         title: "Competitive Exams", sub: "JEE, NEET" },
//   { key: "career",   Icon: Code,          title: "Career Tracks",     sub: "Full Stack, AI, DevOps" },
//   { key: "talk",     Icon: Mic,           title: "ILM ORA Talk",      sub: "English, Public Speaking" },
//   { key: "study",    Icon: Globe,         title: "Study Abroad",      sub: "IELTS, TOEFL, UK, USA" },
//   { key: "gulf",     Icon: Flag,          title: "ILM ORA Gulf",      sub: "UAE, Oman, Kuwait, Qatar" },
// ];

// const MEGA_ITEMS = {
//   courses: [
//     { Icon: Target,         title: "Product Management", sub: "Master PM fundamentals" },
//     { Icon: BarChart2,      title: "Product Analytics",  sub: "Data-driven decisions" },
//     { Icon: TrendingUp,     title: "Product Strategy",   sub: "Strategy & positioning" },
//     { Icon: BarChart3,      title: "Data Analytics",     sub: "Analytics & BI tools" },
//     { Icon: Brain,          title: "Generative AI",      sub: "AI essentials" },
//     { Icon: LayoutTemplate, title: "UI/UX Design",       sub: "Design beautiful interfaces" },
//   ],
//   career: [
//     { Icon: Code,  title: "Full Stack Dev",   sub: "React, Node, Spring Boot" },
//     { Icon: Globe, title: "DevOps & Cloud",   sub: "AWS, Docker, Kubernetes" },
//     { Icon: Brain, title: "AI / ML Engineer", sub: "Python, TensorFlow, LLMs" },
//   ],
//   school: [
//     { Icon: BookOpen,      title: "CBSE",        sub: "Class 9-12 all subjects" },
//     { Icon: GraduationCap, title: "Bihar Board",  sub: "Matric & Inter" },
//     { Icon: Award,         title: "ICSE",         sub: "Class 9-10 curriculum" },
//     { Icon: BookOpen,      title: "UP Board",     sub: "High School & Inter" },
//   ],
//   comp: [
//     { Icon: Target, title: "JEE Main & Advanced", sub: "Physics, Chemistry, Math" },
//     { Icon: Brain,  title: "NEET",                sub: "Biology, Physics, Chemistry" },
//   ],
//   talk: [
//     { Icon: Mic,   title: "Spoken English",   sub: "Fluency & pronunciation" },
//     { Icon: Globe, title: "Public Speaking",  sub: "Confidence & delivery" },
//     { Icon: Users, title: "Group Discussion", sub: "GD & interview prep" },
//   ],
//   study: [
//     { Icon: Globe, title: "IELTS Preparation",  sub: "Band 7+ guaranteed" },
//     { Icon: Award, title: "TOEFL",              sub: "Score 100+ target" },
//     { Icon: Flag,  title: "UK Universities",    sub: "Top UK admissions guide" },
//     { Icon: Flag,  title: "USA Universities",   sub: "Ivy League applications" },
//   ],
//   gulf: [
//     { Icon: Flag, title: "UAE",    sub: "Dubai & Abu Dhabi jobs" },
//     { Icon: Flag, title: "Oman",   sub: "Career opportunities" },
//     { Icon: Flag, title: "Kuwait", sub: "Professional pathways" },
//     { Icon: Flag, title: "Qatar",  sub: "Work visa & jobs" },
//   ],
// };

// /* ─── Navbar ── */
// function Navbar({ onGetStarted, scrollTo, theme, toggleTheme, navigate }) {
//   const [megaOpen, setMegaOpen] = useState(false);
//   const [activeCat, setActiveCat] = useState("courses");
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const navRef = useRef();

//   useEffect(() => {
//     const handler = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setMegaOpen(false); };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const items = MEGA_ITEMS[activeCat] || MEGA_ITEMS["courses"];

//   return (
//     <>
//       <nav
//         ref={navRef}
//         style={{
//           background: theme === "dark" ? "rgba(0,0,0,0.95)" : "#fff",
//           borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0",
//           position: "sticky", top: 0, zIndex: 300,
//           boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//         }}
//       >
//         <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center" }}>
//           {/* Logo */}
//           <div onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 36, cursor: "pointer" }}>
//             <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, #ea6a0a)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(249,115,22,0.3)" }}>
//               <Sparkles size={18} color="#fff" />
//             </div>
//             <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 20, lineHeight: 1 }}>
//               <span style={{ color: GREEN }}>ILM</span>{" "}<span style={{ color: ORANGE }}>ORA</span>
//             </div>
//             <span style={{ background: "#f0fdf4", color: GREEN, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, border: "1px solid #bbf7d0" }}>BETA</span>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hide-mob" style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
//             <div style={{ position: "relative" }}>
//               <button className={`nav-link ${megaOpen ? "active" : ""}`} onClick={() => setMegaOpen(o => !o)}>
//                 All Courses
//                 <ChevronDown size={13} color={megaOpen ? ORANGE : "#9ca3af"} style={{ transform: megaOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
//               </button>
//               {megaOpen && (
//                 <div className="mega-dropdown drop-in">
//                   <div style={{ width: 210, background: "#f9fafb", borderRight: "1px solid #f0f0f0", padding: "12px 8px", flexShrink: 0 }}>
//                     <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, padding: "4px 12px 8px" }}>Categories</div>
//                     {MEGA_CATS.map(cat => {
//                       const CI = cat.Icon;
//                       return (
//                         <div key={cat.key} onMouseEnter={() => setActiveCat(cat.key)} onClick={() => setActiveCat(cat.key)}
//                           style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", background: activeCat === cat.key ? "#fff7ed" : "transparent", borderRight: activeCat === cat.key ? `3px solid ${ORANGE}` : "3px solid transparent", transition: "all 0.15s" }}>
//                           <div style={{ width: 32, height: 32, borderRadius: 9, background: "#fff7ed", border: "1px solid #fed7aa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                             <CI size={14} color={ORANGE} />
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{cat.title}</div>
//                             <div style={{ fontSize: 10, color: "#6b7280" }}>{cat.sub}</div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <div style={{ flex: 1, padding: "16px 18px", overflow: "hidden" }}>
//                     <div style={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
//                       {MEGA_CATS.find(c => c.key === activeCat)?.title}
//                     </div>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
//                       {items.map((item, i) => {
//                         const II = item.Icon;
//                         return (
//                           <div key={i} onClick={() => { setMegaOpen(false); onGetStarted(); }}
//                             style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "10px 11px", borderRadius: 10, cursor: "pointer", border: "1px solid transparent", transition: "all 0.15s" }}
//                             onMouseEnter={e => { e.currentTarget.style.background = "#fff7ed"; e.currentTarget.style.borderColor = "#fed7aa"; }}
//                             onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
//                             <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fff7ed", border: "1px solid #fed7aa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                               <II size={13} color={ORANGE} />
//                             </div>
//                             <div>
//                               <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{item.title}</div>
//                               <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{item.sub}</div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <button className="nav-link" onClick={() => { scrollTo("features"); setMegaOpen(false); }}>Mentors</button>
//             <button className="nav-link" onClick={() => { scrollTo("testimonials"); setMegaOpen(false); }}>Success Stories</button>
//             <button className="nav-link" onClick={() => { scrollTo("how-it-works"); setMegaOpen(false); }}>ILM ORA Meet</button>
//             <button className="nav-link" onClick={() => { scrollTo("resume-builder"); setMegaOpen(false); }}>
//               <Sparkles size={13} color={ORANGE} /> AI Resume Builder
//             </button>
//           </div>

//           {/* Right buttons — Log In removed, only Get Started remains */}
//           <div className="hide-mob" style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
//             <button onClick={toggleTheme} style={{ border: "1px solid #e2e8f0", background: "transparent", cursor: "pointer", padding: "7px 8px", borderRadius: 8, display: "flex", alignItems: "center" }} onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//               {theme === "dark" ? <Sun size={17} color={ORANGE} /> : <Moon size={17} color="#6b7280" />}
//             </button>
//             <button className="btn-dark" onClick={onGetStarted}><Zap size={14} color="#fff" /> Get Started</button>
//           </div>

//           {/* Hamburger */}
//           <button className="show-mob" style={{ marginLeft: "auto", border: "none", background: "transparent", cursor: "pointer", padding: 8, borderRadius: 8, display: "none" }} onClick={() => setMobileOpen(o => !o)}>
//             {mobileOpen ? <X size={22} color={DARK} /> : <Menu size={22} color={DARK} />}
//           </button>
//         </div>
//       </nav>

//       {mobileOpen && (
//         <div className="mobile-menu">
//           <button className="mobile-nav-link" onClick={() => { scrollTo("features"); setMobileOpen(false); }}>Mentors</button>
//           <button className="mobile-nav-link" onClick={() => { scrollTo("testimonials"); setMobileOpen(false); }}>Success Stories</button>
//           <button className="mobile-nav-link" onClick={() => { scrollTo("how-it-works"); setMobileOpen(false); }}>ILM ORA Meet</button>
//           <button className="mobile-nav-link" onClick={() => { scrollTo("resume-builder"); setMobileOpen(false); }}>AI Resume Builder</button>
//           <button className="mobile-nav-link" onClick={() => { scrollTo("templates"); setMobileOpen(false); }}>Templates</button>
//           <button className="mobile-nav-link" onClick={() => { scrollTo("faq"); setMobileOpen(false); }}>FAQ</button>
//           <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
//             <button className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 14, padding: "12px" }} onClick={() => { onGetStarted(); setMobileOpen(false); }}><Zap size={15} color="#fff" /> Get Started</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// /* ─── Main Landing Page ── */
// export default function ILMORALanding({ onNavigateToBuilder, theme, toggleTheme }) {
//   const [activeTplId, setActiveTplId] = useState("summit");
//   const [openFaq, setOpenFaq] = useState(null);
//   const [vis, setVis] = useState(new Set());
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const refs = useRef({});
//   const navigate = useNavigate();

//   const activeTpl = TEMPLATES.find(t => t.id === activeTplId) || TEMPLATES[0];

//   useEffect(() => {
//     const obs = new IntersectionObserver(entries => {
//       entries.forEach(e => { if (e.isIntersecting) setVis(p => new Set([...p, e.target.id])); });
//     }, { threshold: 0.1 });
//     Object.values(refs.current).forEach(el => el && obs.observe(el));
//     return () => obs.disconnect();
//   }, []);

//   useLayoutEffect(() => {
//     if ("scrollRestoration" in window.history) {
//       window.history.scrollRestoration = "manual";
//     }
//     window.scrollTo(0, 0);
//     document.documentElement.scrollTop = 0;
//     document.body.scrollTop = 0;
//     return () => {
//       if ("scrollRestoration" in window.history) {
//         window.history.scrollRestoration = "auto";
//       }
//     };
//   }, []);

//   const reg = (id) => el => { refs.current[id] = el; };
//   const isVis = id => vis.has(id);

//   const openLogin = () => setShowLoginModal(true);
//   const scrollTo = (id) => {
//     const element = document.getElementById(id);
//     if (!element) return;
//     const navbarHeight = 64;
//     const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
//     window.scrollTo({ top: y, behavior: "smooth" });
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "'Plus Jakarta Sans',sans-serif",
//         background: theme === "dark" ? "#000" : "#f8fafc",
//         color: theme === "dark" ? "#fff" : DARK,
//         minHeight: "100vh",
//       }}
//     >
//       <StyleInjector />
//       <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} theme={theme} navigate={navigate} />

//       <Navbar onGetStarted={openLogin} scrollTo={scrollTo} theme={theme} toggleTheme={toggleTheme} navigate={navigate} />

//       {/* ─── HERO ─── */}
//       <section style={{ position: "relative", overflow: "hidden", background: theme === "dark" ? "#000" : "linear-gradient(135deg,#fffbf7 0%,#f8fafc 50%,#f0f4ff 100%)", borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0", padding: "72px 24px 80px" }}>
//         <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.07),transparent 70%)", pointerEvents: "none" }} />
//         <div style={{ position: "absolute", bottom: -80, left: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)", pointerEvents: "none" }} />

//         <div className="hero-grid" style={{ maxWidth: 1280, margin: "0 auto" }}>
//           <div className="fade-up">
//             <div className="hero-badge" style={{ marginBottom: 24 }}>
//               <div style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <Target size={11} color="#fff" />
//               </div>
//               AI-Powered · ATS-Optimised · Free to Use
//             </div>
//             <h1 className="hero-title" style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(2rem,3.8vw,3.4rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 20, color: theme === "dark" ? "#fff" : DARK }}>
//               Build your{" "}<span className="gradient-text">winning</span><br />resume in{" "}<span style={{ color: ORANGE }}>60 seconds</span>
//             </h1>
//             <p style={{ fontSize: 16, color: theme === "dark" ? "#9ca3af" : "#64748b", lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
//               From AI generation to LinkedIn PDF import — ILM ORA creates professional, ATS-friendly resumes that land you <strong style={{ color: theme === "dark" ? "#fff" : DARK }}>3x more interviews.</strong>
//             </p>
//             <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
//               <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={openLogin}><Sparkles size={17} /> Generate with AI</button>
//               <button className="btn-outline" style={{ fontSize: 15, padding: "13px 26px" }} onClick={openLogin}><PenLine size={16} /> Start from Scratch</button>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <div style={{ display: "flex" }}>{[1,2,3,4,5].map(i => <Star key={i} size={13} color="#f59e0b" fill="#f59e0b" />)}</div>
//                 <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>4.9 / 5 from 2,000+ users</span>
//               </div>
//               <div style={{ width: 1, height: 16, background: "#e2e8f0" }} />
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <Shield size={13} color={GREEN} />
//                 <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>No credit card needed</span>
//               </div>
//             </div>
//           </div>

//           <div className="fade-up delay-2" style={{ position: "relative" }}>
//             <div className="float-anim">
//               <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden", border: "1px solid #e2e8f0", maxWidth: 340, margin: "0 auto" }}>
//                 <div style={{ background: "#2563eb", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
//                   <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>AJ</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Alex Johnson</div>
//                     <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>Full Stack Developer</div>
//                   </div>
//                   <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700, color: "#fff" }}>ATS ✓</div>
//                 </div>
//                 <div style={{ padding: "14px 16px" }}>
//                   {["Profile Summary", "Work Experience", "Education", "Technical Skills", "Projects", "Certifications"].map((s, i) => (
//                     <div key={s} style={{ marginBottom: 9 }}>
//                       <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", color: "#2563eb", borderBottom: "1.5px solid #2563eb", paddingBottom: 2, marginBottom: 5 }}>{s}</div>
//                       {[1, 2, i < 2 ? 3 : 2].map(j => <div key={j} style={{ height: 4, background: j === 1 ? "#f3f4f6" : "#e5e7eb", borderRadius: 3, marginBottom: 3, width: j === 2 ? "75%" : "100%" }} />)}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="floating-badge slide-l delay-3" style={{ top: -12, left: -18 }}>
//               <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={14} color="#fff" /></div>
//               <div><div style={{ fontSize: 11, fontWeight: 800, color: DARK }}>ATS Score: 97%</div><div style={{ fontSize: 9, color: "#6b7280" }}>Ready to apply!</div></div>
//             </div>
//             <div className="floating-badge slide-r delay-4" style={{ bottom: 16, right: -14 }}>
//               <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={14} color="#fff" /></div>
//               <div><div style={{ fontSize: 11, fontWeight: 800, color: DARK }}>AI Generated</div><div style={{ fontSize: 9, color: "#6b7280" }}>Under 60 seconds</div></div>
//             </div>
//             <div className="floating-badge slide-r" style={{ top: "42%", right: -22, animationDelay: "0.5s" }}>
//               <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={14} color="#fff" /></div>
//               <div><div style={{ fontSize: 11, fontWeight: 800, color: DARK }}>50K+ Resumes</div><div style={{ fontSize: 9, color: "#6b7280" }}>Created so far</div></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ─── STATS ─── */}
//       <section style={{ background: theme === "dark" ? "#111827" : "#fff", borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0", padding: "48px 24px" }}>
//         <div style={{ maxWidth: 1280, margin: "0 auto" }}>
//           <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14 }}>
//             {STATS.map((s, i) => {
//               const SI = s.Icon;
//               return (
//                 <div key={i} className="stat-card" style={{ background: theme === "dark" ? "#1f2937" : "#fff", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
//                   <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "14", border: `1.5px solid ${s.color}28`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><SI size={18} color={s.color} /></div>
//                   <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1, textAlign: "center", marginBottom: 4 }}>{s.num}</div>
//                   <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, textAlign: "center" }}>{s.label}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ─── 4 WAYS ─── */}
//       <section id="features" ref={reg("features")} style={{ padding: "76px 24px", background: theme === "dark" ? "#000" : "#f8fafc" }}>
//         <div style={{ maxWidth: 1280, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 50 }}>
//             <div className="section-tag">4 Ways to Build</div>
//             <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
//               Choose your <span style={{ color: ORANGE }}>fastest path</span>
//             </h2>
//             <p style={{ fontSize: 15, color: "#64748b", maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
//               Whether you prefer AI magic or hands-on control, we've got the perfect way to build your resume.
//             </p>
//           </div>
//           <div className="feats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
//             {FEATURES.map((f, i) => {
//               const FI = f.Icon;
//               return (
//                 <div key={i} className="feature-card" onClick={openLogin}
//                   style={{ opacity: isVis("features") ? 1 : 0, transform: isVis("features") ? "none" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.1}s`, background: theme === "dark" ? "#111827" : "#fff", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
//                   <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
//                     <div style={{ width: 52, height: 52, borderRadius: 14, background: f.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 6px 18px rgba(0,0,0,0.13)" }}>
//                       <FI size={22} color="#fff" />
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//                         <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: theme === "dark" ? "#fff" : DARK }}>{f.title}</h3>
//                         <span style={{ padding: "2px 9px", borderRadius: 999, background: f.badgeColor + "14", color: f.badgeColor, fontSize: 10, fontWeight: 700 }}>{f.badge}</span>
//                       </div>
//                       <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
//                     </div>
//                   </div>
//                   <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 5, color: ORANGE, fontSize: 13, fontWeight: 700 }}>
//                     Get started <ChevronRight size={13} color={ORANGE} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ─── AI RESUME BUILDER SECTION ─── */}
//       <section
//         id="resume-builder"
//         style={{
//           background: theme === "dark" ? "#111827" : "#fff",
//           padding: "76px 24px",
//           borderTop: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0",
//           borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0",
//         }}
//       >
//         <div style={{ maxWidth: 1280, margin: "0 auto" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="feats-inner-grid">
//             <div>
//               <div className="section-tag">Powerful Features</div>
//               <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.4rem,2.5vw,2.1rem)", fontWeight: 900, marginBottom: 14, letterSpacing: "-0.5px", lineHeight: 1.15, color: theme === "dark" ? "#fff" : DARK }}>
//                 Everything you need to <span style={{ color: ORANGE }}>land the job</span>
//               </h2>
//               <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 28 }}>
//                 From AI-powered content generation to ATS analysis — ILM ORA is the complete toolkit for modern job seekers.
//               </p>
//               <button className="btn-primary" onClick={openLogin}><Sparkles size={15} /> Explore All Features</button>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//               {ATS_FEATURES.map((f, i) => {
//                 const FI = f.Icon;
//                 return (
//                   <div key={i} className="card-hover" style={{ background: theme === "dark" ? "#1f2937" : "#f8fafc", borderRadius: 12, padding: "18px 15px", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }} onClick={openLogin}>
//                     <div style={{ width: 36, height: 36, borderRadius: 9, background: f.color + "13", border: `1.5px solid ${f.color}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 9 }}>
//                       <FI size={17} color={f.color} />
//                     </div>
//                     <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 12, marginBottom: 4, color: theme === "dark" ? "#fff" : DARK }}>{f.title}</div>
//                     <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ─── HOW IT WORKS ─── */}
//       <section id="how-it-works" ref={reg("how-it-works")} style={{ background: theme === "dark" ? "#000" : "#f8fafc", padding: "76px 24px" }}>
//         <div style={{ maxWidth: 1280, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 52 }}>
//             <div className="section-tag">Simple Process</div>
//             <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
//               Ready in <span style={{ color: ORANGE }}>4 simple steps</span>
//             </h2>
//             <p style={{ fontSize: 15, color: "#64748b", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>Most users complete their resume in under 5 minutes.</p>
//           </div>
//           <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, position: "relative" }}>
//             <div className="hide-mob" style={{ position: "absolute", top: 40, left: "calc(12.5%)", width: "75%", height: 2, background: `linear-gradient(90deg,${ORANGE},#fde68a)`, zIndex: 0 }} />
//             {STEPS.map((step, i) => (
//               <div key={i} className="step-card" style={{ opacity: isVis("how-it-works") ? 1 : 0, transform: isVis("how-it-works") ? "none" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.12}s`, zIndex: 1, background: theme === "dark" ? "#111827" : "#fff", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
//                 <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 4px 14px rgba(249,115,22,0.28)" }}>
//                   <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 900, color: "#fff" }}>{step.num}</span>
//                 </div>
//                 <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, marginBottom: 8, color: theme === "dark" ? "#fff" : DARK }}>{step.title}</h3>
//                 <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
//               </div>
//             ))}
//           </div>
//           <div style={{ textAlign: "center", marginTop: 40 }}>
//             <button className="btn-primary" onClick={openLogin} style={{ fontSize: 15, padding: "13px 32px" }}><Sparkles size={16} /> Start Building Now</button>
//           </div>
//         </div>
//       </section>

//       {/* ─── TEMPLATES ─── */}
//       <section id="templates" ref={reg("templates")} style={{ background: theme === "dark" ? "#111827" : "#fff", padding: "76px 24px", borderTop: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0", borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0" }}>
//         <div style={{ maxWidth: 1280, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 44 }}>
//             <div className="section-tag">Template Gallery</div>
//             <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
//               10 stunning <span style={{ color: ORANGE }}>ATS-ready designs</span>
//             </h2>
//             <p style={{ fontSize: 15, color: "#64748b", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>
//               Professionally designed, ATS-friendly and fully customizable. Click any template to preview.
//             </p>
//           </div>

//           <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 28, justifyContent: "center", flexWrap: "wrap" }}>
//             {TEMPLATES.map(t => (
//               <button key={t.id} onClick={() => setActiveTplId(t.id)} style={{ padding: "7px 16px", borderRadius: 999, border: `2px solid ${activeTplId === t.id ? t.accent : "#e2e8f0"}`, background: activeTplId === t.id ? t.accent + "11" : (theme === "dark" ? "#1f2937" : "#fff"), color: activeTplId === t.id ? t.accent : "#6b7280", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
//                 <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent }} />{t.name}
//               </button>
//             ))}
//           </div>

//           <div className="tpl-preview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 44, alignItems: "start", maxWidth: 860, margin: "0 auto 44px" }}>
//             <div>
//               <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, marginBottom: 8, color: theme === "dark" ? "#fff" : DARK }}>{activeTpl.name} Template</h3>
//               <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
//                 <div style={{ width: 9, height: 9, borderRadius: "50%", background: activeTpl.accent }} />
//                 <span style={{ fontSize: 13, color: "#64748b" }}>{activeTpl.sidebar ? "Two-Column" : "Single Column"} Layout</span>
//                 <span style={{ padding: "2px 8px", borderRadius: 999, background: activeTpl.accent + "14", color: activeTpl.accent, fontSize: 11, fontWeight: 700 }}>{activeTpl.tag}</span>
//               </div>
//               {["ATS Optimised", "Fully Customizable", "Professional Design", "Instant PDF Download"].map(f => (
//                 <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
//                   <div style={{ width: 20, height: 20, borderRadius: "50%", background: GREEN + "14", border: `1.5px solid ${GREEN}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                     <Check size={11} color={GREEN} />
//                   </div>
//                   <span style={{ fontSize: 13, color: theme === "dark" ? "#d1d5db" : "#44445a" }}>{f}</span>
//                 </div>
//               ))}
//               <button className="btn-primary" style={{ marginTop: 20 }} onClick={openLogin}>
//                 Use This Template <ChevronRight size={15} />
//               </button>
//             </div>
//             <div style={{ boxShadow: `0 14px 40px rgba(0,0,0,0.10), 0 0 0 3px ${activeTpl.accent}22`, borderRadius: 12, overflow: "hidden", border: `2px solid ${activeTpl.accent}38`, transition: "all 0.3s" }}>
//               <ResumeThumbnail accent={activeTpl.accent} sidebar={activeTpl.sidebar} />
//             </div>
//           </div>

//           <div className="tpl-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
//             {TEMPLATES.map(t => (
//               <div key={t.id} className={`tpl-thumb ${activeTplId === t.id ? "sel" : ""}`} style={{ "--tpl-accent": t.accent }} onClick={() => setActiveTplId(t.id)}>
//                 <div style={{ height: 104, overflow: "hidden", background: "#f9fafb", position: "relative" }}>
//                   <div style={{ transform: "scale(0.21)", transformOrigin: "top left", width: "476%", pointerEvents: "none" }}>
//                     <ResumeThumbnail accent={t.accent} sidebar={t.sidebar} />
//                   </div>
//                   {activeTplId === t.id && (
//                     <div style={{ position: "absolute", top: 5, right: 5, width: 18, height: 18, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <Check size={10} color="#fff" />
//                     </div>
//                   )}
//                 </div>
//                 <div style={{ padding: "7px 9px", borderTop: "1px solid #f0f0f8" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                     <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent }} />
//                     <span style={{ fontSize: 10, fontWeight: 700, color: DARK }}>{t.name}</span>
//                     <span style={{ marginLeft: "auto", fontSize: 8, color: "#9ca3af", background: "#f4f4f8", padding: "1px 5px", borderRadius: 4 }}>{t.tag}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ─── TESTIMONIALS ─── */}
//       <section id="testimonials" ref={reg("testimonials")} style={{ background: theme === "dark" ? "#000" : "#f8fafc", padding: "76px 24px" }}>
//         <div style={{ maxWidth: 1280, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 44 }}>
//             <div className="section-tag">Success Stories</div>
//             <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
//               Students who got <span style={{ color: ORANGE }}>hired</span>
//             </h2>
//           </div>
//           <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
//             {[
//               { name: "Rahul Sharma",  role: "SDE @ Infosys",       college: "NIT Warangal",  text: "The AI resume builder created a complete resume for me in under a minute. Got 4 interview calls in my first week!", avatar: "RS", color: ORANGE },
//               { name: "Priya Verma",   role: "Data Analyst @ TCS",   college: "IIT Hyderabad", text: "I imported my LinkedIn PDF and ILM ORA automatically extracted all my experience. Saved hours of manual work!", avatar: "PV", color: "#7c3aed" },
//               { name: "Arjun Mehta",   role: "Frontend Dev @ Wipro", college: "VIT Chennai",   text: "The ATS score checker showed exactly what was missing. After fixing it, my score went from 55% to 94%!", avatar: "AM", color: GREEN },
//             ].map((t, i) => (
//               <div key={i} className="card-hover" style={{ background: theme === "dark" ? "#111827" : "#fff", borderRadius: 16, padding: "24px 22px", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
//                 <div style={{ display: "flex", marginBottom: 8 }}>{[1,2,3,4,5].map(s => <Star key={s} size={13} color="#f59e0b" fill="#f59e0b" />)}</div>
//                 <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, marginBottom: 18 }}>"{t.text}"</p>
//                 <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
//                   <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color + "1a", border: `2px solid ${t.color}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: t.color }}>{t.avatar}</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: theme === "dark" ? "#fff" : DARK }}>{t.name}</div>
//                     <div style={{ fontSize: 11, color: "#6b7280" }}>{t.role} · {t.college}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ─── FAQ ─── */}
//       <section id="faq" ref={reg("faq")} style={{ background: theme === "dark" ? "#111827" : "#fff", padding: "76px 24px", borderTop: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0" }}>
//         <div style={{ maxWidth: 740, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 44 }}>
//             <div className="section-tag">FAQ</div>
//             <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
//               Frequently asked <span style={{ color: ORANGE }}>questions</span>
//             </h2>
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {FAQS.map((faq, i) => (
//               <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`} style={{ background: theme === "dark" ? "#1f2937" : "#fff", border: theme === "dark" ? `1.5px solid ${openFaq === i ? ORANGE : "#374151"}` : `1.5px solid ${openFaq === i ? ORANGE : "#e2e8f0"}` }}>
//                 <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "17px 20px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
//                   <span style={{ fontWeight: 700, fontSize: 14, color: theme === "dark" ? "#fff" : DARK, paddingRight: 14 }}>{faq.q}</span>
//                   <div style={{ flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.22s" }}>
//                     <ChevronDown size={17} color={openFaq === i ? ORANGE : "#6b7280"} />
//                   </div>
//                 </button>
//                 {openFaq === i && <div style={{ padding: "0 20px 17px", fontSize: 13, color: "#6b7280", lineHeight: 1.78 }}>{faq.a}</div>}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ─── CTA — compact banner ─── */}
//       <section
//         id="cta"
//         className="cta-section"
//         style={{
//           background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
//           padding: "32px 24px",          /* ← reduced from 52px */
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.14),transparent 70%)", pointerEvents: "none" }} />
//         <div style={{ position: "absolute", bottom: -50, left: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.14),transparent 70%)", pointerEvents: "none" }} />

//         <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", position: "relative" }}>
//           {/* Icon — smaller */}
//           <div
//             className="cta-icon"
//             style={{
//               width: 44, height: 44, borderRadius: 12,      /* ← reduced from 60/16 */
//               background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               margin: "0 auto 12px",                         /* ← reduced from 18px */
//               boxShadow: "0 4px 16px rgba(249,115,22,0.32)",
//               animation: "float 3s ease-in-out infinite",
//             }}
//           >
//             <Sparkles size={20} color="#fff" />              {/* ← reduced from 26 */}
//           </div>

//           <h2
//             className="cta-title"
//             style={{
//               fontFamily: "'Sora',sans-serif",
//               fontSize: "clamp(1.3rem,2.4vw,1.9rem)",        /* ← reduced */
//               fontWeight: 900,
//               color: "#fff",
//               marginBottom: 8,                               /* ← reduced from 12 */
//               letterSpacing: "-0.5px",
//               lineHeight: 1.12,
//             }}
//           >
//             Ready to land your <span style={{ color: ORANGE }}>dream job?</span>
//           </h2>

//           <p
//             className="cta-sub"
//             style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20, lineHeight: 1.65 }}  /* ← reduced */
//           >
//             Join 50,000+ students who've built career-defining resumes with ILM ORA.
//             Start free — no credit card needed.
//           </p>

//           <div
//             className="cta-btns"
//             style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
//           >
//             <button
//               className="btn-primary"
//               style={{ fontSize: 13, padding: "10px 24px", boxShadow: "0 4px 16px rgba(249,115,22,0.38)" }}  /* ← slightly smaller */
//               onClick={openLogin}
//             >
//               <Sparkles size={14} /> Create My Resume Now
//             </button>
//             <button
//               className="btn-ghost-white"
//               style={{ fontSize: 13, padding: "9px 20px" }}   /* ← slightly smaller */
//               onClick={() => scrollTo("templates")}
//             >
//               <LayoutTemplate size={14} /> Browse Templates
//             </button>
//           </div>

//           <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
//             <Shield size={11} color="rgba(255,255,255,0.4)" />
//             <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Free forever · No credit card · Instant download</span>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
























































import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Sparkles, FileText, Upload, Check, Target, BarChart3, Brain,
  Download, Shield, Star, Users, ChevronRight, ChevronDown,
  Linkedin, PenLine, TrendingUp, LayoutTemplate, Award,
  Clock, BookOpen, GraduationCap, Code, Mic, Globe, Flag,
  Zap, Moon, Search, BarChart2, Sun,
  LogOut, User,
} from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import auth from "../../auth";

// ✅ Same shared shell used by every other public page (Careers, ManagerHub,
// ILM ORA Meet, About, Pricing, Contact, FAQ, etc). Lives at
// src/pages/Landing/components/PublicLayout. If this file lives somewhere
// other than alongside Careers.jsx, adjust this relative path.
import PublicLayout from "../Landing/components/PublicLayout";

const GOOGLE_CLIENT_ID = "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const ORANGE = "#f97316";
const GREEN  = "#16a34a";
const DARK   = "#0f172a";

/* ✅ ALIGNMENT FIX (same fix as Careers/ManagerHub/ILM ORA Meet): everything
   is scoped under `.resume-page` instead of bare `*` / `html` / `body`
   selectors. The old global reset (`*,*::before,*::after{margin:0;padding:0;}`
   plus a bare `html{...}` / `body{...}`) leaked outside this component and
   stripped margin/padding off PublicLayout's navbar and footer — that's what
   caused the "cut"/misaligned look. Scoping it under `.resume-page` keeps
   this reset local only. */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
  .resume-page, .resume-page *, .resume-page *::before, .resume-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .resume-page { scroll-behavior: smooth; font-family: 'Plus Jakarta Sans', sans-serif; }
  .resume-page ::-webkit-scrollbar { width: 4px; }
  .resume-page ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 4px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideL   { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideR   { from { opacity:0; transform:translateX(20px); }  to { opacity:1; transform:translateX(0); } }
  @keyframes float    { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-8px); } }
  @keyframes shimmer  { 0%,100%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } }
  @keyframes dropIn   { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes modalFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

  .fade-up    { animation: fadeUp 0.6s ease both; }
  .slide-l    { animation: slideL 0.6s ease both; }
  .slide-r    { animation: slideR 0.6s ease both; }
  .float-anim { animation: float 3.5s ease-in-out infinite; }
  .drop-in    { animation: dropIn 0.2s ease both; }
  .delay-1    { animation-delay: 0.1s; }
  .delay-2    { animation-delay: 0.2s; }
  .delay-3    { animation-delay: 0.3s; }
  .delay-4    { animation-delay: 0.4s; }

  .gradient-text {
    background: linear-gradient(135deg, #f97316, #ea6a0a, #f59e0b);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s ease infinite;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; background: #f97316; color: #fff;
    font-weight: 700; font-size: 14px; border: none; border-radius: 10px;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(249,115,22,0.32);
  }
  .btn-primary:hover { background: #ea6a0a; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(249,115,22,0.4); }
  .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .btn-dark {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; background: #0f172a; color: #fff;
    font-weight: 700; font-size: 14px; border: none; border-radius: 8px;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-dark:hover { background: #1e293b; transform: translateY(-1px); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; background: #fff; color: #0f172a;
    font-weight: 700; font-size: 14px; border: 2px solid #e2e8f0;
    border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-outline:hover { border-color: #f97316; color: #f97316; transform: translateY(-1px); }

  .btn-ghost-white {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; background: rgba(255,255,255,0.1); color: #fff;
    font-weight: 700; font-size: 14px; border: 2px solid rgba(255,255,255,0.2);
    border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-ghost-white:hover { background: rgba(255,255,255,0.18); }

  .card-hover { transition: all 0.25s ease; cursor: pointer; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.09); }

  .feature-card {
    background: #fff; border-radius: 16px; padding: 26px 22px;
    border: 1.5px solid #e2e8f0; transition: all 0.25s; cursor: pointer;
  }
  .feature-card:hover { transform: translateY(-5px); border-color: #f97316; box-shadow: 0 14px 36px rgba(249,115,22,0.1); }

  .stat-card {
    background: #fff; border-radius: 14px; padding: 22px 18px;
    border: 1.5px solid #e2e8f0; text-align: center; transition: all 0.25s;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.07); }

  .step-card {
    background: #fff; border-radius: 14px; padding: 24px 20px;
    border: 1.5px solid #e2e8f0; position: relative; overflow: hidden; transition: all 0.25s;
  }
  .step-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.07); }

  .tpl-thumb {
    border-radius: 12px; overflow: hidden; border: 2px solid #e2e8f0;
    cursor: pointer; transition: all 0.2s; background: #fff;
  }
  .tpl-thumb:hover, .tpl-thumb.sel { border-color: var(--tpl-accent, #f97316); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

  .faq-item { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: border-color 0.2s; }
  .faq-item.open { border-color: #f97316; }

  .floating-badge {
    position: absolute; background: #fff; border-radius: 12px;
    padding: 10px 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; gap: 8px; white-space: nowrap; z-index: 2;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px 6px 10px; border-radius: 999px;
    background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.22);
    color: #f97316; font-size: 12px; font-weight: 700;
  }

  .section-tag {
    font-size: 11px; font-weight: 700; color: #f97316;
    letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 10px;
  }

  /* ─── LAYOUT FLASH PREVENTION ─── */
  .hero-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  /* ─── RESPONSIVE BREAKPOINTS ─── */
  @media (max-width: 900px) {
    .hide-mob { display: none !important; }
    .hero-grid { grid-template-columns: 1fr !important; }
    .feats-grid { grid-template-columns: 1fr !important; }
    .steps-grid { grid-template-columns: 1fr 1fr !important; }
    .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
    .tpl-grid { grid-template-columns: repeat(4,1fr) !important; }
    .tpl-preview-grid { grid-template-columns: 1fr !important; }
    .test-grid { grid-template-columns: 1fr !important; }
    .feats-inner-grid { grid-template-columns: 1fr !important; }
    .cta-section { padding: 28px 20px !important; }
    .cta-btns { flex-direction: column; align-items: center; }
    .cta-btns button { width: 100%; max-width: 320px; justify-content: center; }
  }

  @media (max-width: 600px) {
    .steps-grid { grid-template-columns: 1fr !important; }
    .tpl-grid { grid-template-columns: repeat(2,1fr) !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
    .hero-title { font-size: 2rem !important; }
    .cta-section { padding: 22px 16px !important; }
    .cta-icon { width: 38px !important; height: 38px !important; margin-bottom: 10px !important; }
    .cta-icon svg { width: 16px !important; height: 16px !important; }
    .cta-title { font-size: 1.25rem !important; }
    .cta-sub { font-size: 12px !important; margin-bottom: 16px !important; }
  }
`;

function StyleInjector() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "ilmora-resume-css";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);
  return null;
}

/* ─── Resume Thumbnail ── */
function ResumeThumbnail({ accent = "#2563eb", sidebar = false }) {
  if (sidebar) return (
    <div style={{ background: "#fff", display: "flex", minHeight: 200, fontSize: 6, fontFamily: "Georgia,serif" }}>
      <div style={{ width: "34%", background: accent, color: "#fff", padding: "12px 8px" }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.2)", margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>AJ</div>
        <div style={{ fontWeight: 700, fontSize: 6.5, textAlign: "center", marginBottom: 2 }}>Alex Johnson</div>
        <div style={{ opacity: 0.75, fontSize: 5, textAlign: "center", marginBottom: 10 }}>Full Stack Dev</div>
        {["Contact", "Skills", "Certs"].map(s => (
          <div key={s}>
            <div style={{ fontSize: 4.5, fontWeight: 700, textTransform: "uppercase", opacity: 0.6, borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: 2, marginBottom: 3, marginTop: 7 }}>{s}</div>
            {[1,2,3].map(i => <div key={i} style={{ height: 3, background: "rgba(255,255,255,0.28)", borderRadius: 2, marginBottom: 2 }} />)}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "12px 9px" }}>
        {["Experience", "Education", "Projects"].map(s => (
          <div key={s} style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 5, fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 2, marginBottom: 4 }}>{s}</div>
            {[1,2,3].map(i => <div key={i} style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 2, width: i === 1 ? "100%" : i === 2 ? "80%" : "60%" }} />)}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ background: "#fff", padding: "12px 11px", minHeight: 200, fontFamily: "Georgia,serif" }}>
      <div style={{ textAlign: "center", borderBottom: `2px solid ${accent}`, paddingBottom: 7, marginBottom: 9 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", marginBottom: 2 }}>Alex Johnson</div>
        <div style={{ fontSize: 6, color: accent, fontWeight: 600, marginBottom: 4 }}>Full Stack Developer</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 7, flexWrap: "wrap" }}>
          {["✉ alex@email.com", "☎ +91 98765", "📍 Hyderabad"].map(c => (
            <span key={c} style={{ fontSize: 5, color: "#6b7280" }}>{c}</span>
          ))}
        </div>
      </div>
      {["Profile Summary", "Work Experience", "Education", "Technical Skills", "Projects", "Certifications"].map(s => (
        <div key={s} style={{ marginBottom: 7 }}>
          <div style={{ fontSize: 5, fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 2, marginBottom: 4 }}>{s}</div>
          {[1, 2].map(i => <div key={i} style={{ height: 2.5, background: "#e5e7eb", borderRadius: 2, marginBottom: 2.5, width: i === 2 ? "75%" : "100%" }} />)}
        </div>
      ))}
    </div>
  );
}

/* ─── LOGIN MODAL ── */
function LoginModal({ show, onClose, theme, navigate }) {
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [showModalPw, setShowModalPw] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (show) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "ADMIN":    navigate("/admin",    { replace: true }); break;
      case "TRAINER":  navigate("/trainer",  { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default:         navigate("/student",  { replace: true });
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalLoading) return;
    setModalLoading(true);
    try {
      const ok = await auth.login({ email: modalEmail, password: modalPassword });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        onClose();
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

  const handleModalGoogle = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");
      const dec  = jwtDecode(res.credential);
      const resp = await auth.googleLogin({ idToken: res.credential });
      if (resp?.isNewUser === true) {
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name: dec.name, email: dec.email, role: "student", isNewUser: true,
        }));
        onClose();
        navigate("/ilm-demo", { replace: true });
      } else {
        const role = (resp?.role || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        localStorage.setItem("lms_user", JSON.stringify({
          name: dec.name, email: dec.email, role: role.toLowerCase(),
        }));
        onClose();
        redirectByRole(role);
      }
    } catch (err) {
      try {
        const dec = jwtDecode(res.credential);
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name: dec.name, email: dec.email, role: "student", isNewUser: true,
        }));
        onClose();
        navigate("/ilm-demo", { replace: true });
      } catch (_) {
        alert("Google login failed. Please try again.");
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px", background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          style={{
            position: "relative", width: "100%", maxWidth: "420px",
            borderRadius: "16px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            background: "rgba(255,255,255,0.97)", border: "1px solid rgba(249,115,22,0.18)",
            padding: "36px 32px 28px", animation: "modalFadeUp 0.3s ease both",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: "20px", fontWeight: 700, lineHeight: 1, transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }} aria-label="Close">×</button>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.2rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.01em" }}>
              <span style={{ color: "#16a34a" }}>ILM</span>
              <span style={{ color: "#F97316", marginLeft: "8px" }}>ORA</span>
            </span>
          </div>

          <div style={{ textAlign: "center", marginBottom: "22px" }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#1e0e02", marginBottom: "6px" }}>Welcome back!</h2>
            <p style={{ fontSize: "0.84rem", color: "#8a6040", fontFamily: "'DM Sans', sans-serif" }}>
              Don't have an account?{" "}
              <button onClick={() => { onClose(); navigate("/complete-profile"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#F97316", fontWeight: 700, fontSize: "0.84rem", padding: 0, fontFamily: "inherit" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>Apply now</button>
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
            <GoogleLogin onSuccess={handleModalGoogle} onError={() => console.error("Google OAuth failed")} theme="outline" size="large" text="continue_with" shape="rectangular" width="356" auto_select={false} cancel_on_tap_outside={true} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(180,100,30,0.15)" }} />
            <span style={{ fontSize: "0.7rem", color: "#b8906a", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(180,100,30,0.15)" }} />
          </div>

          <form onSubmit={handleModalSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#8a6040", marginBottom: "5px", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Email</label>
              <input type="email" placeholder="Enter your email" value={modalEmail} onChange={e => setModalEmail(e.target.value)} required disabled={modalLoading} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(180,120,60,0.2)", borderRadius: "10px", color: "#1a0e06", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", opacity: modalLoading ? 0.5 : 1 }} onFocus={e => { e.target.style.borderColor = "#F97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; e.target.style.background = "#fff"; }} onBlur={e => { e.target.style.borderColor = "rgba(180,120,60,0.2)"; e.target.style.boxShadow = "none"; }} />
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#8a6040", marginBottom: "5px", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showModalPw ? "text" : "password"} placeholder="Enter your password" value={modalPassword} onChange={e => setModalPassword(e.target.value)} required disabled={modalLoading} style={{ width: "100%", padding: "11px 44px 11px 14px", background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(180,120,60,0.2)", borderRadius: "10px", color: "#1a0e06", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", opacity: modalLoading ? 0.5 : 1 }} onFocus={e => { e.target.style.borderColor = "#F97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; e.target.style.background = "#fff"; }} onBlur={e => { e.target.style.borderColor = "rgba(180,120,60,0.2)"; e.target.style.boxShadow = "none"; }} />
                <button type="button" onClick={() => setShowModalPw(p => !p)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#b8906a", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "color 0.2s", lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = "#F97316"} onMouseLeave={e => e.currentTarget.style.color = "#b8906a"} tabIndex={-1}>
                  {showModalPw ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: "18px" }}>
              <button type="button" onClick={() => { onClose(); navigate("/forgot-password"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#F97316", fontSize: "0.78rem", fontWeight: 500, fontFamily: "inherit" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>Forgot password?</button>
            </div>

            <button type="submit" disabled={modalLoading} style={{ width: "100%", padding: "13px", borderRadius: "10px", fontWeight: 700, color: "#fff", fontSize: "0.95rem", border: "none", cursor: modalLoading ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#F97316,#ea580c)", boxShadow: "0 4px 18px rgba(249,115,22,0.32)", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: modalLoading ? 0.7 : 1, transition: "opacity 0.2s, transform 0.15s" }} onMouseEnter={e => { if (!modalLoading) e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
              {modalLoading ? (<><span style={{ display: "inline-block", width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Signing in…</>) : "Log in"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#b8906a", fontSize: "0.78rem", fontFamily: "inherit", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#8a6040"} onMouseLeave={e => e.currentTarget.style.color = "#b8906a"}>← Back to home</button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

/* ─── Constants ── */
const TEMPLATES = [
  { id: "summit",  name: "Summit",       accent: "#2563eb", sidebar: false, tag: "Popular" },
  { id: "maple",   name: "Maple",        accent: "#dc2626", sidebar: false, tag: "Bold" },
  { id: "valiant", name: "Valiant",      accent: "#0891b2", sidebar: true,  tag: "2-Col" },
  { id: "quartz",  name: "Quartz",       accent: "#b45309", sidebar: false, tag: "Classic" },
  { id: "exec",    name: "Executive",    accent: "#1e293b", sidebar: true,  tag: "Pro" },
  { id: "aurora",  name: "Aurora",       accent: "#7c3aed", sidebar: false, tag: "Creative" },
  { id: "minimal", name: "Minimal",      accent: "#374151", sidebar: false, tag: "Clean" },
  { id: "pro",     name: "Professional", accent: "#065f46", sidebar: false, tag: "ATS" },
  { id: "coral",   name: "Coral",        accent: "#e11d48", sidebar: false, tag: "Vibrant" },
  { id: "slate",   name: "Slate",        accent: "#475569", sidebar: true,  tag: "Modern" },
];

const FEATURES = [
  { Icon: Sparkles, title: "AI Resume Generation", desc: "Describe your role — AI writes a complete ATS-optimised resume in 60 seconds with summary, experience, skills and projects.", badge: "Most Popular", badgeColor: ORANGE, gradient: "linear-gradient(135deg,#7c3aed,#f97316)" },
  { Icon: Linkedin, title: "LinkedIn PDF Import", desc: "Download your LinkedIn PDF and upload it. AI extracts your complete work history, education and skills automatically.", badge: "Smart Import", badgeColor: "#0077b5", gradient: "linear-gradient(135deg,#0077b5,#0891b2)" },
  { Icon: Upload,   title: "Upload Existing Resume", desc: "Have an old resume? Upload your PDF and AI extracts every section so you can modernise it with our fresh templates.", badge: "AI Powered", badgeColor: GREEN, gradient: `linear-gradient(135deg,${GREEN},#0891b2)` },
  { Icon: PenLine,  title: "Build from Scratch", desc: "Prefer full control? Use our guided editor to build a stunning resume section by section with a live preview.", badge: "Full Control", badgeColor: "#6b7280", gradient: "linear-gradient(135deg,#4b5563,#374151)" },
];

const ATS_FEATURES = [
  { Icon: Search,         title: "ATS Score Checker",      desc: "Upload any resume PDF and get an instant ATS compatibility score with actionable suggestions.", color: GREEN },
  { Icon: BarChart3,      title: "Resume Score Breakdown",  desc: "Detailed 100-point scoring across 12 sections — see exactly what's missing and how to fix it.", color: ORANGE },
  { Icon: Brain,          title: "AI Writing Assistant",    desc: "Describe in plain words — AI rewrites it professionally for your summary and job descriptions.", color: "#7c3aed" },
  { Icon: Download,       title: "One-Click PDF Export",    desc: "Download your polished resume as a professional PDF ready to attach to any job application.", color: "#0077b5" },
  { Icon: Shield,         title: "ATS Ready Badge",         desc: "Get certified ATS-friendly status on your resume when you meet all key recruiter requirements.", color: "#e11d48" },
  { Icon: LayoutTemplate, title: "10 Pro Templates",        desc: "Choose from 10 professionally designed templates — clean, modern, two-column, creative and more.", color: "#b45309" },
];

const STEPS = [
  { num: "01", title: "Choose your method",  desc: "AI generate, LinkedIn import, PDF upload, or manual — pick the fastest path for you." },
  { num: "02", title: "Pick a template",     desc: "Select from 10 ATS-friendly designs and preview live as you make changes." },
  { num: "03", title: "Customise & refine",  desc: "Edit every section, get AI writing suggestions, and check your score in real time." },
  { num: "04", title: "Download & apply",    desc: "Export as PDF and start applying. Most users land interviews within 2 weeks." },
];

const STATS = [
  { num: "50K+", label: "Resumes Created",  Icon: FileText,       color: ORANGE },
  { num: "98%",  label: "ATS Pass Rate",    Icon: Target,         color: GREEN },
  { num: "10",   label: "Pro Templates",    Icon: LayoutTemplate, color: "#7c3aed" },
  { num: "3x",   label: "More Interviews",  Icon: TrendingUp,     color: "#0077b5" },
  { num: "60s",  label: "AI Build Time",    Icon: Clock,          color: "#e11d48" },
  { num: "Free", label: "To Get Started",   Icon: Star,           color: "#b45309" },
];

const FAQS = [
  { q: "Is the AI resume builder really free?", a: "Yes! You can create, edit and download your resume completely free. AI generation and all 10 templates are included at no cost." },
  { q: "Will my resume pass ATS systems?", a: "Absolutely. All templates are designed with ATS compatibility in mind. You also get a built-in ATS Score Checker that grades your resume and suggests improvements." },
  { q: "How does AI resume generation work?", a: "You enter your name, target job title, experience level, and key skills. Our AI generates a complete, tailored resume in under 60 seconds with professional content across all sections." },
  { q: "Can I import my LinkedIn profile?", a: "Yes! Download your LinkedIn profile as a PDF (Profile → More → Save to PDF), then upload it here. AI extracts your complete work history, education, and skills." },
  { q: "How many resumes can I create?", a: "You can create and save multiple resumes — one tailored for each job role or company you're applying to." },
  { q: "What file format can I download?", a: "You can download your resume as a professional PDF, ready to email or upload to any job portal." },
];

/* ─── Main Landing Page ── */
export default function ILMORALanding({
  onNavigateToBuilder,
  theme = "light",
  toggleTheme,
  scrollToSection,
}) {
  const [activeTplId, setActiveTplId] = useState("summit");
  const [openFaq, setOpenFaq] = useState(null);
  const [vis, setVis] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const refs = useRef({});
  const navigate = useNavigate();

  const activeTpl = TEMPLATES.find(t => t.id === activeTplId) || TEMPLATES[0];

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVis(p => new Set([...p, e.target.id])); });
    }, { threshold: 0.1 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  const reg = (id) => el => { refs.current[id] = el; };
  const isVis = id => vis.has(id);

  const openLogin = () => setShowLoginModal(true);
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const navbarHeight = 64;
    const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection || scrollTo}
    >
      <div
        className="resume-page"
        style={{
          background: theme === "dark" ? "#000" : "#f8fafc",
          color: theme === "dark" ? "#fff" : DARK,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <StyleInjector />
        <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} theme={theme} navigate={navigate} />

        {/* ─── HERO ─── */}
        <section style={{ position: "relative", overflow: "hidden", background: theme === "dark" ? "#000" : "linear-gradient(135deg,#fffbf7 0%,#f8fafc 50%,#f0f4ff 100%)", borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0", padding: "72px 24px 80px" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.07),transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)", pointerEvents: "none" }} />

          <div className="hero-grid" style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="fade-up">
              <div className="hero-badge" style={{ marginBottom: 24 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={11} color="#fff" />
                </div>
                AI-Powered · ATS-Optimised · Free to Use
              </div>
              <h1 className="hero-title" style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(2rem,3.8vw,3.4rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 20, color: theme === "dark" ? "#fff" : DARK }}>
                Build your{" "}<span className="gradient-text">winning</span><br />resume in{" "}<span style={{ color: ORANGE }}>60 seconds</span>
              </h1>
              <p style={{ fontSize: 16, color: theme === "dark" ? "#9ca3af" : "#64748b", lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
                From AI generation to LinkedIn PDF import — ILM ORA creates professional, ATS-friendly resumes that land you <strong style={{ color: theme === "dark" ? "#fff" : DARK }}>3x more interviews.</strong>
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={openLogin}><Sparkles size={17} /> Generate with AI</button>
                <button className="btn-outline" style={{ fontSize: 15, padding: "13px 26px" }} onClick={openLogin}><PenLine size={16} /> Start from Scratch</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ display: "flex" }}>{[1,2,3,4,5].map(i => <Star key={i} size={13} color="#f59e0b" fill="#f59e0b" />)}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>4.9 / 5 from 2,000+ users</span>
                </div>
                <div style={{ width: 1, height: 16, background: "#e2e8f0" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Shield size={13} color={GREEN} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>No credit card needed</span>
                </div>
              </div>
            </div>

            <div className="fade-up delay-2" style={{ position: "relative" }}>
              <div className="float-anim">
                <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden", border: "1px solid #e2e8f0", maxWidth: 340, margin: "0 auto" }}>
                  <div style={{ background: "#2563eb", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>AJ</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Alex Johnson</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>Full Stack Developer</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700, color: "#fff" }}>ATS ✓</div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    {["Profile Summary", "Work Experience", "Education", "Technical Skills", "Projects", "Certifications"].map((s, i) => (
                      <div key={s} style={{ marginBottom: 9 }}>
                        <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", color: "#2563eb", borderBottom: "1.5px solid #2563eb", paddingBottom: 2, marginBottom: 5 }}>{s}</div>
                        {[1, 2, i < 2 ? 3 : 2].map(j => <div key={j} style={{ height: 4, background: j === 1 ? "#f3f4f6" : "#e5e7eb", borderRadius: 3, marginBottom: 3, width: j === 2 ? "75%" : "100%" }} />)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="floating-badge slide-l delay-3" style={{ top: -12, left: -18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={14} color="#fff" /></div>
                <div><div style={{ fontSize: 11, fontWeight: 800, color: DARK }}>ATS Score: 97%</div><div style={{ fontSize: 9, color: "#6b7280" }}>Ready to apply!</div></div>
              </div>
              <div className="floating-badge slide-r delay-4" style={{ bottom: 16, right: -14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={14} color="#fff" /></div>
                <div><div style={{ fontSize: 11, fontWeight: 800, color: DARK }}>AI Generated</div><div style={{ fontSize: 9, color: "#6b7280" }}>Under 60 seconds</div></div>
              </div>
              <div className="floating-badge slide-r" style={{ top: "42%", right: -22, animationDelay: "0.5s" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={14} color="#fff" /></div>
                <div><div style={{ fontSize: 11, fontWeight: 800, color: DARK }}>50K+ Resumes</div><div style={{ fontSize: 9, color: "#6b7280" }}>Created so far</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section style={{ background: theme === "dark" ? "#111827" : "#fff", borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0", padding: "48px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14 }}>
              {STATS.map((s, i) => {
                const SI = s.Icon;
                return (
                  <div key={i} className="stat-card" style={{ background: theme === "dark" ? "#1f2937" : "#fff", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "14", border: `1.5px solid ${s.color}28`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><SI size={18} color={s.color} /></div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1, textAlign: "center", marginBottom: 4 }}>{s.num}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, textAlign: "center" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 4 WAYS ─── */}
        <section id="features" ref={reg("features")} style={{ padding: "76px 24px", background: theme === "dark" ? "#000" : "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div className="section-tag">4 Ways to Build</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
                Choose your <span style={{ color: ORANGE }}>fastest path</span>
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
                Whether you prefer AI magic or hands-on control, we've got the perfect way to build your resume.
              </p>
            </div>
            <div className="feats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
              {FEATURES.map((f, i) => {
                const FI = f.Icon;
                return (
                  <div key={i} className="feature-card" onClick={openLogin}
                    style={{ opacity: isVis("features") ? 1 : 0, transform: isVis("features") ? "none" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.1}s`, background: theme === "dark" ? "#111827" : "#fff", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: f.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 6px 18px rgba(0,0,0,0.13)" }}>
                        <FI size={22} color="#fff" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: theme === "dark" ? "#fff" : DARK }}>{f.title}</h3>
                          <span style={{ padding: "2px 9px", borderRadius: 999, background: f.badgeColor + "14", color: f.badgeColor, fontSize: 10, fontWeight: 700 }}>{f.badge}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 5, color: ORANGE, fontSize: 13, fontWeight: 700 }}>
                      Get started <ChevronRight size={13} color={ORANGE} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── AI RESUME BUILDER SECTION ─── */}
        <section
          id="resume-builder"
          style={{
            background: theme === "dark" ? "#111827" : "#fff",
            padding: "76px 24px",
            borderTop: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0",
            borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="feats-inner-grid">
              <div>
                <div className="section-tag">Powerful Features</div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.4rem,2.5vw,2.1rem)", fontWeight: 900, marginBottom: 14, letterSpacing: "-0.5px", lineHeight: 1.15, color: theme === "dark" ? "#fff" : DARK }}>
                  Everything you need to <span style={{ color: ORANGE }}>land the job</span>
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 28 }}>
                  From AI-powered content generation to ATS analysis — ILM ORA is the complete toolkit for modern job seekers.
                </p>
                <button className="btn-primary" onClick={openLogin}><Sparkles size={15} /> Explore All Features</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {ATS_FEATURES.map((f, i) => {
                  const FI = f.Icon;
                  return (
                    <div key={i} className="card-hover" style={{ background: theme === "dark" ? "#1f2937" : "#f8fafc", borderRadius: 12, padding: "18px 15px", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }} onClick={openLogin}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: f.color + "13", border: `1.5px solid ${f.color}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 9 }}>
                        <FI size={17} color={f.color} />
                      </div>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 12, marginBottom: 4, color: theme === "dark" ? "#fff" : DARK }}>{f.title}</div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" ref={reg("how-it-works")} style={{ background: theme === "dark" ? "#000" : "#f8fafc", padding: "76px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="section-tag">Simple Process</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
                Ready in <span style={{ color: ORANGE }}>4 simple steps</span>
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>Most users complete their resume in under 5 minutes.</p>
            </div>
            <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, position: "relative" }}>
              <div className="hide-mob" style={{ position: "absolute", top: 40, left: "calc(12.5%)", width: "75%", height: 2, background: `linear-gradient(90deg,${ORANGE},#fde68a)`, zIndex: 0 }} />
              {STEPS.map((step, i) => (
                <div key={i} className="step-card" style={{ opacity: isVis("how-it-works") ? 1 : 0, transform: isVis("how-it-works") ? "none" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.12}s`, zIndex: 1, background: theme === "dark" ? "#111827" : "#fff", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 4px 14px rgba(249,115,22,0.28)" }}>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 900, color: "#fff" }}>{step.num}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, marginBottom: 8, color: theme === "dark" ? "#fff" : DARK }}>{step.title}</h3>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button className="btn-primary" onClick={openLogin} style={{ fontSize: 15, padding: "13px 32px" }}><Sparkles size={16} /> Start Building Now</button>
            </div>
          </div>
        </section>

        {/* ─── TEMPLATES ─── */}
        <section id="templates" ref={reg("templates")} style={{ background: theme === "dark" ? "#111827" : "#fff", padding: "76px 24px", borderTop: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0", borderBottom: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div className="section-tag">Template Gallery</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
                10 stunning <span style={{ color: ORANGE }}>ATS-ready designs</span>
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>
                Professionally designed, ATS-friendly and fully customizable. Click any template to preview.
              </p>
            </div>

            <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 28, justifyContent: "center", flexWrap: "wrap" }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setActiveTplId(t.id)} style={{ padding: "7px 16px", borderRadius: 999, border: `2px solid ${activeTplId === t.id ? t.accent : "#e2e8f0"}`, background: activeTplId === t.id ? t.accent + "11" : (theme === "dark" ? "#1f2937" : "#fff"), color: activeTplId === t.id ? t.accent : "#6b7280", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent }} />{t.name}
                </button>
              ))}
            </div>

            <div className="tpl-preview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 44, alignItems: "start", maxWidth: 860, margin: "0 auto 44px" }}>
              <div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, marginBottom: 8, color: theme === "dark" ? "#fff" : DARK }}>{activeTpl.name} Template</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: activeTpl.accent }} />
                  <span style={{ fontSize: 13, color: "#64748b" }}>{activeTpl.sidebar ? "Two-Column" : "Single Column"} Layout</span>
                  <span style={{ padding: "2px 8px", borderRadius: 999, background: activeTpl.accent + "14", color: activeTpl.accent, fontSize: 11, fontWeight: 700 }}>{activeTpl.tag}</span>
                </div>
                {["ATS Optimised", "Fully Customizable", "Professional Design", "Instant PDF Download"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: GREEN + "14", border: `1.5px solid ${GREEN}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} color={GREEN} />
                    </div>
                    <span style={{ fontSize: 13, color: theme === "dark" ? "#d1d5db" : "#44445a" }}>{f}</span>
                  </div>
                ))}
                <button className="btn-primary" style={{ marginTop: 20 }} onClick={openLogin}>
                  Use This Template <ChevronRight size={15} />
                </button>
              </div>
              <div style={{ boxShadow: `0 14px 40px rgba(0,0,0,0.10), 0 0 0 3px ${activeTpl.accent}22`, borderRadius: 12, overflow: "hidden", border: `2px solid ${activeTpl.accent}38`, transition: "all 0.3s" }}>
                <ResumeThumbnail accent={activeTpl.accent} sidebar={activeTpl.sidebar} />
              </div>
            </div>

            <div className="tpl-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
              {TEMPLATES.map(t => (
                <div key={t.id} className={`tpl-thumb ${activeTplId === t.id ? "sel" : ""}`} style={{ "--tpl-accent": t.accent }} onClick={() => setActiveTplId(t.id)}>
                  <div style={{ height: 104, overflow: "hidden", background: "#f9fafb", position: "relative" }}>
                    <div style={{ transform: "scale(0.21)", transformOrigin: "top left", width: "476%", pointerEvents: "none" }}>
                      <ResumeThumbnail accent={t.accent} sidebar={t.sidebar} />
                    </div>
                    {activeTplId === t.id && (
                      <div style={{ position: "absolute", top: 5, right: 5, width: 18, height: 18, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={10} color="#fff" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "7px 9px", borderTop: "1px solid #f0f0f8" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: DARK }}>{t.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: 8, color: "#9ca3af", background: "#f4f4f8", padding: "1px 5px", borderRadius: 4 }}>{t.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section id="testimonials" ref={reg("testimonials")} style={{ background: theme === "dark" ? "#000" : "#f8fafc", padding: "76px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div className="section-tag">Success Stories</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
                Students who got <span style={{ color: ORANGE }}>hired</span>
              </h2>
            </div>
            <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {[
                { name: "Rahul Sharma",  role: "SDE @ Infosys",       college: "NIT Warangal",  text: "The AI resume builder created a complete resume for me in under a minute. Got 4 interview calls in my first week!", avatar: "RS", color: ORANGE },
                { name: "Priya Verma",   role: "Data Analyst @ TCS",   college: "IIT Hyderabad", text: "I imported my LinkedIn PDF and ILM ORA automatically extracted all my experience. Saved hours of manual work!", avatar: "PV", color: "#7c3aed" },
                { name: "Arjun Mehta",   role: "Frontend Dev @ Wipro", college: "VIT Chennai",   text: "The ATS score checker showed exactly what was missing. After fixing it, my score went from 55% to 94%!", avatar: "AM", color: GREEN },
              ].map((t, i) => (
                <div key={i} className="card-hover" style={{ background: theme === "dark" ? "#111827" : "#fff", borderRadius: 16, padding: "24px 22px", border: theme === "dark" ? "1.5px solid #374151" : "1.5px solid #e2e8f0" }}>
                  <div style={{ display: "flex", marginBottom: 8 }}>{[1,2,3,4,5].map(s => <Star key={s} size={13} color="#f59e0b" fill="#f59e0b" />)}</div>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, marginBottom: 18 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color + "1a", border: `2px solid ${t.color}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: t.color }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: theme === "dark" ? "#fff" : DARK }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{t.role} · {t.college}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" ref={reg("faq")} style={{ background: theme === "dark" ? "#111827" : "#fff", padding: "76px 24px", borderTop: theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div className="section-tag">FAQ</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.5px", color: theme === "dark" ? "#fff" : DARK }}>
                Frequently asked <span style={{ color: ORANGE }}>questions</span>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQS.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`} style={{ background: theme === "dark" ? "#1f2937" : "#fff", border: theme === "dark" ? `1.5px solid ${openFaq === i ? ORANGE : "#374151"}` : `1.5px solid ${openFaq === i ? ORANGE : "#e2e8f0"}` }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "17px 20px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: theme === "dark" ? "#fff" : DARK, paddingRight: 14 }}>{faq.q}</span>
                    <div style={{ flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.22s" }}>
                      <ChevronDown size={17} color={openFaq === i ? ORANGE : "#6b7280"} />
                    </div>
                  </button>
                  {openFaq === i && <div style={{ padding: "0 20px 17px", fontSize: 13, color: "#6b7280", lineHeight: 1.78 }}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA — compact banner ─── */}
        <section
          id="cta"
          className="cta-section"
          style={{
            background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
            padding: "32px 24px",          /* ← reduced from 52px */
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.14),transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -50, left: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.14),transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", position: "relative" }}>
            {/* Icon — smaller */}
            <div
              className="cta-icon"
              style={{
                width: 44, height: 44, borderRadius: 12,      /* ← reduced from 60/16 */
                background: `linear-gradient(135deg,${ORANGE},#ea6a0a)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",                         /* ← reduced from 18px */
                boxShadow: "0 4px 16px rgba(249,115,22,0.32)",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              <Sparkles size={20} color="#fff" />              {/* ← reduced from 26 */}
            </div>

            <h2
              className="cta-title"
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: "clamp(1.3rem,2.4vw,1.9rem)",        /* ← reduced */
                fontWeight: 900,
                color: "#fff",
                marginBottom: 8,                               /* ← reduced from 12 */
                letterSpacing: "-0.5px",
                lineHeight: 1.12,
              }}
            >
              Ready to land your <span style={{ color: ORANGE }}>dream job?</span>
            </h2>

            <p
              className="cta-sub"
              style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20, lineHeight: 1.65 }}  /* ← reduced */
            >
              Join 50,000+ students who've built career-defining resumes with ILM ORA.
              Start free — no credit card needed.
            </p>

            <div
              className="cta-btns"
              style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
            >
              <button
                className="btn-primary"
                style={{ fontSize: 13, padding: "10px 24px", boxShadow: "0 4px 16px rgba(249,115,22,0.38)" }}  /* ← slightly smaller */
                onClick={openLogin}
              >
                <Sparkles size={14} /> Create My Resume Now
              </button>
              <button
                className="btn-ghost-white"
                style={{ fontSize: 13, padding: "9px 20px" }}   /* ← slightly smaller */
                onClick={() => scrollTo("templates")}
              >
                <LayoutTemplate size={14} /> Browse Templates
              </button>
            </div>

            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Shield size={11} color="rgba(255,255,255,0.4)" />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Free forever · No credit card · Instant download</span>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}