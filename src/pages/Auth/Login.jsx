
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import auth from "../../auth";

// const colors = {
//   primary: "from-orange-500 to-orange-600",
//   primarySolid: "bg-orange-500",
//   accent: "from-orange-400 to-orange-600",
//   muted: "text-gray-600 dark:text-gray-400",
//   surface: "bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl",
// };

// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// const TexoraLogin = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [mobileMenu, setMobileMenu] = useState(false);

//   const redirectByRole = (role) => {
//     switch (role.toUpperCase()) {
//       case "ADMIN":
//         navigate("/admin", { replace: true });
//         break;
//       case "TRAINER":
//         navigate("/trainer", { replace: true });
//         break;
//       case "BUSINESS":
//         navigate("/business", { replace: true });
//         break;
//       default:
//         navigate("/student", { replace: true });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);

//     try {
//       const success = await auth.login({ email, password });
//       if (success) {
//         const role = auth.getCurrentRole().toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);
//       } else {
//         alert("Login failed!");
//       }
//     } catch (error) {
//       alert("Login error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (res) => {
//     try {
//       const decoded = jwtDecode(res.credential);
//       const roleGuess = getRoleFromEmail(decoded.email);

//       const success = await auth.googleLogin({
//         idToken: res.credential,
//         role: roleGuess.toLowerCase(),
//       });

//       if (success) {
//         const role = auth.getCurrentRole().toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);
//       }
//     } catch {
//       alert("Google login failed!");
//     }
//   };

//   const handleGoogleError = () => {
//     alert("Google Login Failed");
//   };

//   const getRoleFromEmail = (email) => {
//     if (!email) return "STUDENT";
//     const e = email.toLowerCase();
//     if (e.includes("admin")) return "ADMIN";
//     if (e.includes("trainer")) return "TRAINER";
//     if (e.includes("business")) return "BUSINESS";
//     return "STUDENT";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#F5E9E0] via-orange-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">

//      {/* HEADER */}
// <header className="bg-white/80 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">

// <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

//   {/* Logo */}
//   <div
//     className="flex items-center cursor-pointer"
//     onClick={() => navigate("/")}
//   >
//     <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide font-serif whitespace-nowrap">
//       <span className="text-green-600">ILM</span>
//       <span className="text-[#F97316] ml-1 sm:ml-2">ORA</span>
//     </span>
//   </div>

  
// {/* Desktop Menu */}
// <div className="hidden md:flex items-center gap-8 text-sm font-medium">

//   <button
//     className={`${colors.muted} hover:text-[#F97316] transition`}
//     onClick={() => navigate("/apply-admin")}
//   >
//     Apply to Admin
//   </button>

//   <button
//     className={`${colors.muted} hover:text-[#F97316] transition`}
//     onClick={() => navigate("/apply-business")}
//   >
//     Apply to Business
//   </button>

//   <button
//     className={`${colors.muted} hover:text-[#F97316] transition`}
//     onClick={() => navigate("/apply-trainer")}
//   >
//     Apply to Trainer
//   </button>

//   <button
//     className={`${colors.muted} hover:text-[#F97316] transition`}
//     onClick={() => navigate("/apply-student")}
//   >
//     Apply to Student
//   </button>

// </div>

//   {/* Mobile Menu Button */}
//   <div className="md:hidden">
//     <button
//       onClick={() => setMobileMenu(!mobileMenu)}
//       className="text-gray-700 dark:text-white text-2xl"
//     >
//       {mobileMenu ? "✕" : "☰"}
//     </button>
//   </div>

// </div>

// {/* Mobile Menu */}
// {mobileMenu && (
//   <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 space-y-4">

//     <button
//       className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
//       onClick={() => {
//         navigate("/apply-admin");
//         setMobileMenu(false);
//       }}
//     >
//       Apply to Admin
//     </button>

//     <button
//       className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
//       onClick={() => {
//         navigate("/apply-business");
//         setMobileMenu(false);
//       }}
//     >
//       Apply to Business
//     </button>

//     <button
//       className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
//       onClick={() => {
//         navigate("/apply-trainer");
//         setMobileMenu(false);
//       }}
//     >
//       Apply to Trainer
//     </button>

//     <button
//       className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
//       onClick={() => {
//         navigate("/apply-student");
//         setMobileMenu(false);
//       }}
//     >
//       Apply to Student
//     </button>

//   </div>
// )}

// </header>
//       {/* MAIN */}
//       <div className="flex items-center justify-center px-4 py-16">

//         <div className={`max-w-4xl w-full rounded-3xl shadow-2xl ${colors.surface} border border-gray-200 dark:border-gray-800`}>

//           <div className="flex flex-col md:flex-row">

//             <div className="flex-1 p-10 md:p-14">

//               <div className="max-w-md mx-auto">

//               <h1 className="text-3xl md:text-4xl font-semibold text-center leading-tight tracking-tight mb-2">

// Welcome back <br className="hidden sm:block" />

// <span className="text-3xl sm:text-4xl font-extrabold tracking-wider font-serif">
//   <span className="text-green-600">ILM</span>
//   <span className="text-[#F97316] ml-2">ORA</span>
// </span>

// </h1>

//                 {/* GOOGLE LOGIN */}
//                 <div className="flex justify-center mb-6">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                     theme="outline"
//                     size="large"
//                     text="signin_with"
//                     shape="rectangular"
//                     width="320"
//                   />
//                 </div>

//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
//                   <span className="text-xs text-gray-400">OR CONTINUE WITH EMAIL</span>
//                   <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5">

//                   <input
//                     type="email"
//                     placeholder="Email address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     disabled={loading}
//                     className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
//                   />

//                   <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                     className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
//                   />

//                   <div className="text-right">
//                     <button
//                       type="button"
//                       onClick={() => navigate("/forgot-password")}
//                       className="text-sm text-orange-500 hover:underline font-medium"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-md transition"
//                   >
//                     {loading ? "Signing in..." : "Sign In"}
//                   </button>

//                 </form>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default function Login() {
//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <TexoraLogin />
//     </GoogleOAuthProvider>
//   );
// }old1



















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import auth from "../../auth";

// const colors = {
//   primary: "from-orange-500 to-orange-600",
//   primarySolid: "bg-orange-500",
//   accent: "from-orange-400 to-orange-600",
//   muted: "text-gray-600 dark:text-gray-400",
//   surface: "bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl",
// };

// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// const TexoraLogin = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [mobileMenu, setMobileMenu] = useState(false);

//   const redirectByRole = (role) => {
//     switch (role.toUpperCase()) {
//       case "ADMIN":
//         navigate("/admin", { replace: true });
//         break;
//       case "TRAINER":
//         navigate("/trainer", { replace: true });
//         break;
//       case "BUSINESS":
//         navigate("/business", { replace: true });
//         break;
//       default:
//         navigate("/student", { replace: true });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);

//     try {
//       const success = await auth.login({ email, password });
//       if (success) {
//         const role = auth.getCurrentRole().toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);
//       } else {
//         alert("Login failed!");
//       }
//     } catch (error) {
//       alert("Login error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (res) => {
//     try {
//       const decoded = jwtDecode(res.credential);
  
//       // ✅ Backend call (NO role guessing)
//       const response = await auth.googleLogin({
//         idToken: res.credential,
//       });
  
//       // ✅ NEW USER → FORM
//       if (response?.isNewUser) {
//         navigate("/apply", {
//           state: {
//             name: decoded.name,
//             email: decoded.email,
//             isGoogleUser: true,
//           },
//         });
//       } else {
//         // ✅ EXISTING USER → DASHBOARD
//         const role = (response?.role || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Google login failed!");
//     }
//   };

//   const handleGoogleError = () => {
//     alert("Google Login Failed");
//   };

  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#F5E9E0] via-orange-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">

//      {/* HEADER */}
// <header className="bg-white/80 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">

// <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

//   {/* Logo */}
//   <div
//     className="flex items-center cursor-pointer"
//     onClick={() => navigate("/")}
//   >
//     <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide font-serif whitespace-nowrap">
//       <span className="text-green-600">ILM</span>
//       <span className="text-[#F97316] ml-1 sm:ml-2">ORA</span>
//     </span>
//   </div>

  
// {/* Desktop Menu */}
// <div className="hidden md:flex items-center gap-8 text-sm font-medium">

//   <button
//     className={`${colors.muted} hover:text-[#F97316] transition font-semibold`}
//     onClick={() => navigate("/apply")}
//   >
//     🚀 Apply Now
//   </button>

// </div>

//   {/* Mobile Menu Button */}
//   <div className="md:hidden">
//     <button
//       onClick={() => setMobileMenu(!mobileMenu)}
//       className="text-gray-700 dark:text-white text-2xl"
//     >
//       {mobileMenu ? "✕" : "☰"}
//     </button>
//   </div>

// </div>

// {/* Mobile Menu */}
// {mobileMenu && (
//   <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 space-y-4">

//     <button
//       className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500 font-semibold"
//       onClick={() => {
//         navigate("/apply");
//         setMobileMenu(false);
//       }}
//     >
//       🚀 Apply Now
//     </button>

//   </div>
// )}

// </header>
//       {/* MAIN */}
//       <div className="flex items-center justify-center px-4 py-16">

//         <div className={`max-w-4xl w-full rounded-3xl shadow-2xl ${colors.surface} border border-gray-200 dark:border-gray-800`}>

//           <div className="flex flex-col md:flex-row">

//             <div className="flex-1 p-10 md:p-14">

//               <div className="max-w-md mx-auto">

//               <h1 className="text-3xl md:text-4xl font-semibold text-center leading-tight tracking-tight mb-2">

// Welcome back <br className="hidden sm:block" />

// <span className="text-3xl sm:text-4xl font-extrabold tracking-wider font-serif">
//   <span className="text-green-600">ILM</span>
//   <span className="text-[#F97316] ml-2">ORA</span>
// </span>

// </h1>

//                 {/* GOOGLE LOGIN */}
//                 <div className="flex justify-center mb-6">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                     theme="outline"
//                     size="large"
//                     text="signin_with"
//                     shape="rectangular"
//                     width="320"
//                   />
//                 </div>

//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
//                   <span className="text-xs text-gray-400">OR CONTINUE WITH EMAIL</span>
//                   <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5">

//                   <input
//                     type="email"
//                     placeholder="Email address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     disabled={loading}
//                     className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
//                   />

//                   <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                     className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
//                   />

//                   <div className="text-right">
//                     <button
//                       type="button"
//                       onClick={() => navigate("/forgot-password")}
//                       className="text-sm text-orange-500 hover:underline font-medium"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-md transition"
//                   >
//                     {loading ? "Signing in..." : "Sign In"}
//                   </button>

//                 </form>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default function Login() {
//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <TexoraLogin />
//     </GoogleOAuthProvider>
//   );
// }old2







// import React, { useState } from "react"; old3 
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import auth from "../../auth";

// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// const TexoraLogin = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ── backend logic unchanged ── */
//   const redirectByRole = (role) => {
//     switch (role.toUpperCase()) {
//       case "ADMIN":    navigate("/admin",    { replace: true }); break;
//       case "TRAINER":  navigate("/trainer",  { replace: true }); break;
//       case "BUSINESS": navigate("/business", { replace: true }); break;
//       default:         navigate("/student",  { replace: true });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     try {
//       const success = await auth.login({ email, password });
//       if (success) {
//         const role = auth.getCurrentRole().toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);
//       } else {
//         alert("Login failed!");
//       }
//     } catch (error) {
//       alert("Login error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (res) => {
//     try {
//       const decoded = jwtDecode(res.credential);
//       const response = await auth.googleLogin({ idToken: res.credential });
//       if (response?.isNewUser) {
        
//         navigate("/apply", {
//           state: { name: decoded.name, email: decoded.email, isGoogleUser: true },
//         });
//       } else {
//         const role = (response?.role || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Google login failed!");
//     }
//   };

//   const handleGoogleError = () => alert("Google Login Failed");

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

//         * { box-sizing: border-box; }

//         .login-root {
//           font-family: 'DM Sans', sans-serif;
//           min-height: 100vh;
//           display: flex;
//           position: relative;
//           background: #0f0f0f;
//         }

//         /* ══ LEFT PANEL ══ */
//         .left-panel {
//           position: relative;
//           width: 48%;
//           background: linear-gradient(145deg, #1a0a00 0%, #2d1200 40%, #0f0f0f 100%);
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-direction: column;
//           padding: 48px;
//           flex-shrink: 0;
//         }

//         @media (max-width: 768px) {
//           .left-panel {
//             position: fixed;
//             inset: 0;
//             width: 100%;
//             height: 100%;
//             z-index: 0;
//             padding: 0;
//           }
//           .left-content { display: none; }
//         }

//         .ring {
//           position: absolute;
//           border-radius: 50%;
//           border: 1px solid rgba(249,115,22,0.15);
//         }
//         .ring-1 { width: 320px; height: 320px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: spin 18s linear infinite; }
//         .ring-2 { width: 480px; height: 480px; top: 50%; left: 50%; transform: translate(-50%,-50%); border-color: rgba(249,115,22,0.08); animation: spin 30s linear infinite reverse; }
//         .ring-3 { width: 620px; height: 620px; top: 50%; left: 50%; transform: translate(-50%,-50%); border-color: rgba(249,115,22,0.05); animation: spin 45s linear infinite; }

//         @keyframes spin {
//           from { transform: translate(-50%,-50%) rotate(0deg); }
//           to   { transform: translate(-50%,-50%) rotate(360deg); }
//         }

//         .orb { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
//         .orb-1 { width: 240px; height: 240px; background: radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%); top: 15%; left: 10%; animation: float1 7s ease-in-out infinite; }
//         .orb-2 { width: 180px; height: 180px; background: radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%); bottom: 20%; right: 5%; animation: float2 9s ease-in-out infinite; }
//         .orb-3 { width: 120px; height: 120px; background: radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%); bottom: 35%; left: 20%; animation: float1 5s ease-in-out infinite 1s; }

//         @keyframes float1 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
//         @keyframes float2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(16px) scale(0.97)} }

//         .dot-grid {
//           position: absolute; inset: 0;
//           background-image: radial-gradient(circle, rgba(249,115,22,0.12) 1px, transparent 1px);
//           background-size: 32px 32px;
//           pointer-events: none;
//         }

//         .ring-dot {
//           position: absolute;
//           width: 8px; height: 8px;
//           background: #F97316; border-radius: 50%;
//           box-shadow: 0 0 12px 4px rgba(249,115,22,0.6);
//         }
//         .ring-1 .ring-dot { top: -4px; left: calc(50% - 4px); }

//         .left-content { position: relative; z-index: 10; text-align: center; }
//         .brand-left { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; letter-spacing: 0.08em; line-height: 1; margin-bottom: 16px; }
//         .tagline { color: rgba(255,255,255,0.5); font-size: 0.875rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 40px; font-weight: 300; }
//         .stats-row { display: flex; gap: 32px; justify-content: center; margin-top: 8px; }
//         .stat { text-align: center; }
//         .stat-num { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: #F97316; }
//         .stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
//         .badge-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
//         .badge { background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.25); color: rgba(255,255,255,0.7); font-size: 0.7rem; padding: 4px 12px; border-radius: 999px; letter-spacing: 0.05em; }

//         /* ══ RIGHT PANEL ══ */
//         .right-panel {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           padding: 28px 40px 24px;
//           background: #faf7f4;
//           min-height: 100vh;
//           position: relative;
//           z-index: 1;
//         }

//         @media (max-width: 768px) {
//           .right-panel {
//             background: rgba(10, 6, 2, 0.72);
//             backdrop-filter: blur(22px);
//             -webkit-backdrop-filter: blur(22px);
//             padding: 28px 24px 24px;
//             width: 100%;
//           }
//           .welcome-text  { color: #fff !important; }
//           .welcome-sub   { color: rgba(255,255,255,0.45) !important; }
//           .divider-line  { background: rgba(255,255,255,0.1) !important; }
//           .divider-text  { color: rgba(255,255,255,0.25) !important; }
//           .field input   { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.12) !important; color: #fff !important; }
//           .field input::placeholder { color: rgba(255,255,255,0.3) !important; }
//           .field input:focus { border-color: #F97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.18) !important; }
//           .forgot-btn    { color: #fb923c !important; }
//           .apply-row     { color: rgba(255,255,255,0.35) !important; }
//           .right-footer  { color: rgba(255,255,255,0.18) !important; }
//         }

//         .right-header { display: flex; align-items: center; justify-content: space-between; }

//         .brand-right { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; letter-spacing: 0.06em; cursor: pointer; }

//         /* ══ APPLY NOW BUTTON ══ */
//         .apply-now-btn {
//           position: relative;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           gap: 7px;
//           padding: 9px 20px;
//           background: linear-gradient(135deg, #F97316 0%, #ea580c 100%);
//           border: none;
//           border-radius: 11px;
//           color: #fff;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.8rem;
//           font-weight: 700;
//           letter-spacing: 0.04em;
//           cursor: pointer;
//           box-shadow: 0 4px 18px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.18);
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }
//         .apply-now-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 28px rgba(249,115,22,0.6), inset 0 1px 0 rgba(255,255,255,0.18);
//         }
//         .apply-now-btn:active {
//           transform: translateY(0px);
//           box-shadow: 0 3px 10px rgba(249,115,22,0.35);
//         }
//         /* shimmer sweep on hover */
//         .apply-now-btn::after {
//           content: '';
//           position: absolute;
//           top: 0; left: -75%;
//           width: 50%; height: 100%;
//           background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
//           transform: skewX(-20deg);
//           transition: left 0.45s ease;
//         }
//         .apply-now-btn:hover::after { left: 130%; }

//         .apply-now-btn .rocket { font-size: 0.95rem; }

//         /* ══ FORM ══ */
//         .form-area { flex: 1; display: flex; align-items: center; justify-content: center; }
//         .form-box  { width: 100%; max-width: 360px; }

//         .welcome-text { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; line-height: 1.2; }
//         .welcome-sub  { color: #888; font-size: 0.82rem; margin-bottom: 28px; font-weight: 400; }

//         .google-wrap { margin-bottom: 20px; }
//         .google-wrap > div { width: 100% !important; }

//         .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
//         .divider-line { flex: 1; height: 1px; background: #e5e0da; }
//         .divider-text { font-size: 0.68rem; color: #aaa; letter-spacing: 0.12em; white-space: nowrap; }

//         .field { margin-bottom: 14px; }
//         .field input {
//           width: 100%; padding: 11px 16px;
//           background: #fff; border: 1.5px solid #e8e2db;
//           border-radius: 12px; font-size: 0.875rem; color: #1a1a1a;
//           font-family: 'DM Sans', sans-serif; outline: none;
//           transition: border-color 0.2s, box-shadow 0.2s;
//         }
//         .field input:focus { border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
//         .field input::placeholder { color: #bbb; }

//         .forgot-row { text-align: right; margin-bottom: 18px; margin-top: -6px; }
//         .forgot-btn { background: none; border: none; cursor: pointer; font-size: 0.78rem; color: #F97316; font-family: 'DM Sans', sans-serif; font-weight: 500; }
//         .forgot-btn:hover { text-decoration: underline; }

//         .sign-btn {
//           width: 100%; padding: 12px;
//           background: linear-gradient(135deg, #F97316 0%, #ea6010 100%);
//           color: #fff; font-family: 'DM Sans', sans-serif;
//           font-weight: 600; font-size: 0.9rem; border: none;
//           border-radius: 12px; cursor: pointer; letter-spacing: 0.04em;
//           transition: opacity 0.2s, transform 0.15s;
//           box-shadow: 0 4px 20px rgba(249,115,22,0.35);
//         }
//         .sign-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
//         .sign-btn:disabled { opacity: 0.6; cursor: not-allowed; }

//         .apply-row { text-align: center; margin-top: 20px; font-size: 0.8rem; color: #999; }
//         .apply-row button { background: none; border: none; cursor: pointer; color: #F97316; font-weight: 600; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; }
//         .apply-row button:hover { text-decoration: underline; }

//         .right-footer { text-align: center; font-size: 0.7rem; color: #ccc; padding-top: 12px; }
//       `}</style>

//       <div className="login-root">

//         {/* LEFT PANEL */}
//         <div className="left-panel">
//           <div className="dot-grid" />
//           <div className="orb orb-1" />
//           <div className="orb orb-2" />
//           <div className="orb orb-3" />
//           <div className="ring ring-1"><div className="ring-dot" /></div>
//           <div className="ring ring-2" />
//           <div className="ring ring-3" />

//           <div className="left-content">
//             <div className="brand-left">
//               <span style={{ color: "#22c55e" }}>ILM</span>
//               <span style={{ color: "#F97316", marginLeft: "8px" }}>ORA</span>
//             </div>
//             <p className="tagline">Knowledge · Growth · Excellence</p>
//             <div className="badge-row">
//               <span className="badge">Trainers</span>
//               <span className="badge">Students</span>
//               <span className="badge">Business</span>
//               <span className="badge">Courses</span>
//             </div>
//             <div className="stats-row">
//               <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Trainers</div></div>
//               <div className="stat"><div className="stat-num">12K+</div><div className="stat-label">Students</div></div>
//               <div className="stat"><div className="stat-num">300+</div><div className="stat-label">Courses</div></div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="right-panel">

//           <div className="right-header">
//             <div className="brand-right" onClick={() => navigate("/")}>
//               <span style={{ color: "#22c55e" }}>ILM</span>
//               <span style={{ color: "#F97316", marginLeft: "4px" }}>ORA</span>
//             </div>

//             {/* ✨ Modern Apply Now Button */}
//             <button className="apply-now-btn" onClick={() => navigate("/apply")}>
              
//               Apply Now
//             </button>
//           </div>

//           <div className="form-area">
//             <div className="form-box">
//               <h1 className="welcome-text">Welcome back</h1>
//               <p className="welcome-sub">Sign in to continue your journey</p>

//               <div className="google-wrap">
//                 <GoogleLogin
//                   onSuccess={handleGoogleSuccess}
//                   onError={handleGoogleError}
//                   theme="outline"
//                   size="large"
//                   text="signin_with"
//                   shape="rectangular"
//                   width="360"
//                 />
//               </div>

//               <div className="divider">
//                 <div className="divider-line" />
//                 <span className="divider-text">OR CONTINUE WITH EMAIL</span>
//                 <div className="divider-line" />
//               </div>

//               <form onSubmit={handleSubmit}>
//                 <div className="field">
//                   <input
//                     type="email" placeholder="Email address"
//                     value={email} onChange={(e) => setEmail(e.target.value)}
//                     required disabled={loading}
//                   />
//                 </div>
//                 <div className="field">
//                   <input
//                     type="password" placeholder="Password"
//                     value={password} onChange={(e) => setPassword(e.target.value)}
//                     required disabled={loading}
//                   />
//                 </div>
//                 <div className="forgot-row">
//                   <button type="button" className="forgot-btn"
//                     onClick={() => navigate("/forgot-password")}>
//                     Forgot password?
//                   </button>
//                 </div>
//                 <button type="submit" className="sign-btn" disabled={loading}>
//                   {loading ? "Signing in…" : "Sign In →"}
//                 </button>
//               </form>

//               <div className="apply-row">
//                 New here?{" "}
//                 <button onClick={() => navigate("/apply")}>Apply for access</button>
//               </div>
//             </div>
//           </div>

//           <div className="right-footer">© 2026 ILMORA · All rights reserved</div>
//         </div>

//       </div>
//     </>
//   );
// };

// export default function Login() {
//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <TexoraLogin />
//     </GoogleOAuthProvider>
//   );
// }





























import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const TexoraLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const newUserRef = useRef(null);

  useEffect(() => {
    if (!showPopup) return;
    setCountdown(4);
    const iv = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(iv);
          const d = newUserRef.current;
          if (d) { setShowPopup(false); navigate("/apply", { state: { name: d.name, email: d.email, isGoogleUser: true } }); }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [showPopup]);

  const redirectByRole = r => {
    switch (r.toUpperCase()) {
      case "ADMIN":    navigate("/admin",    { replace: true }); break;
      case "TRAINER":  navigate("/trainer",  { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default:         navigate("/student",  { replace: true });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault(); if (loading) return; setLoading(true);
    try {
      const ok = await auth.login({ email, password });
      if (ok) { const r = auth.getCurrentRole().toUpperCase(); localStorage.setItem("role", r); redirectByRole(r); }
      else alert("Login failed!");
    } catch (err) { alert("Login error: " + err.message); }
    finally { setLoading(false); }
  };

  const handleGoogleSuccess = async res => {
    try {
      localStorage.removeItem("lms_token"); localStorage.removeItem("lms_user"); localStorage.removeItem("role");
      const dec  = jwtDecode(res.credential);
      const resp = await auth.googleLogin({ idToken: res.credential });
      if (resp?.isNewUser === true) { newUserRef.current = { name: dec.name, email: dec.email }; setShowPopup(true); }
      else { const r = (resp?.role || "STUDENT").toUpperCase(); localStorage.setItem("role", r); redirectByRole(r); }
    } catch (err) { console.error(err); alert("Google login failed!"); }
  };

  const handleGoogleError = () => alert("Google Login Failed");
  const handleFillForm = () => { const d = newUserRef.current; setShowPopup(false); navigate("/apply", { state: { name: d?.name, email: d?.email, isGoogleUser: true } }); };
  const handleSkip = () => { setShowPopup(false); newUserRef.current = null; };

  // chips scattered ALL over the page — top/bottom/left/right corners
  const chips = [
    { label:"Product Design", icon:"📦", c:"#F97316", x:"3%",   y:"15%", d:"0s",   t:"6.2s" },
    { label:"UI/UX Design",   icon:"🎨", c:"#22c55e", x:"75%",  y:"7%",  d:"1.1s", t:"7.4s" },
    { label:"Growth Hacking", icon:"📈", c:"#3b82f6", x:"85%",  y:"32%", d:"2.3s", t:"5.8s" },
    { label:"Digital Marketing",icon:"📣",c:"#a855f7",x:"80%",  y:"62%", d:"0.6s", t:"8.1s" },
    { label:"Finance",        icon:"💹", c:"#F97316", x:"70%",  y:"82%", d:"1.7s", t:"6.6s" },
    { label:"Data Analytics", icon:"🔍", c:"#22c55e", x:"4%",   y:"72%", d:"2.5s", t:"7.8s" },
    { label:"Leadership",     icon:"🏆", c:"#3b82f6", x:"1%",   y:"44%", d:"0.9s", t:"6.3s" },
    { label:"Communication",  icon:"💬", c:"#a855f7", x:"20%",  y:"90%", d:"1.9s", t:"8.6s" },
    { label:"Design Systems", icon:"✏️", c:"#F97316", x:"58%",  y:"90%", d:"1.3s", t:"7.2s" },
    { label:"Courses 300+",   icon:"📚", c:"#22c55e", x:"16%",  y:"4%",  d:"0.4s", t:"6.9s" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        /* ══════════════════════════════════════
           SINGLE PAGE — cream, no split ever
        ══════════════════════════════════════ */
        .pg {
          font-family:'DM Sans',sans-serif;
          min-height:100vh;
          background: #f5ece1;
          position:relative;
          overflow:hidden;
          display:flex; flex-direction:column;
        }

        /* subtle dot texture — full page */
        .pg::before {
          content:''; position:absolute; inset:0; z-index:0;
          background-image:radial-gradient(circle,rgba(180,100,30,0.08) 1px,transparent 1px);
          background-size:28px 28px; pointer-events:none;
        }

        /* ── large warm blobs spread across full page ── */
        .blob { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; }
        .b1 { width:700px;height:700px; background:radial-gradient(circle,rgba(249,115,22,0.14),transparent 60%); top:-250px;left:-200px; animation:bp 10s ease-in-out infinite; }
        .b2 { width:600px;height:600px; background:radial-gradient(circle,rgba(249,115,22,0.09),transparent 60%); bottom:-200px;right:-180px; animation:bp 13s ease-in-out infinite 4s; }
        .b3 { width:400px;height:400px; background:radial-gradient(circle,rgba(34,197,94,0.07),transparent 60%); top:20%;right:10%; animation:bp 8s ease-in-out infinite 2s; }
        .b4 { width:300px;height:300px; background:radial-gradient(circle,rgba(249,115,22,0.07),transparent 60%); bottom:20%;left:10%; animation:bp 9s ease-in-out infinite 1s; }
        @keyframes bp { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.1)} }

        /* ══ floating chips — position:absolute, spread all over ══ */
        .chip {
          position:absolute; z-index:5; pointer-events:none;
          display:inline-flex; align-items:center; gap:8px;
          padding:9px 18px;
          background:rgba(255,255,255,0.68);
          border-radius:999px;
          font-size:.74rem; font-weight:700; color:#2a1206;
          border:1px solid rgba(255,255,255,0.85);
          box-shadow:0 8px 28px rgba(160,80,20,0.11);
          backdrop-filter:blur(12px);
          white-space:nowrap;
          animation:cf var(--t) ease-in-out var(--d) infinite;
        }
        @keyframes cf {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-14px); }
        }
        .cdot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }

        /* ══ NAV ══ */
        .nav {
          position:relative; z-index:50;
          display:flex; align-items:center; justify-content:space-between;
          padding:24px 52px;
        }
        .nav-logo {
          font-family:'Playfair Display',serif;
          font-size:1.9rem;font-weight:900;line-height:1;cursor:pointer;
          animation:sdn .6s ease both;
        }
        @keyframes sdn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        .nav-btn {
          position:relative;overflow:hidden;
          display:flex;align-items:center;gap:6px;padding:9px 22px;
          background:linear-gradient(135deg,#F97316,#ea580c);
          border:none;border-radius:10px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:700;
          cursor:pointer;box-shadow:0 4px 18px rgba(249,115,22,.35);
          transition:transform .2s,box-shadow .2s; animation:sdn .6s ease .1s both;
        }
        .nav-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.5); }
        .nav-btn::after { content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transform:skewX(-20deg);transition:left .5s; }
        .nav-btn:hover::after { left:130%; }

        /* ══ CENTER WRAPPER — everything centered ══ */
        .center {
          position:relative; z-index:20;
          flex:1; display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          padding:10px 24px 40px; gap:28px;
          animation:fup .8s ease .1s both;
        }
        @keyframes fup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        /* ── headline ABOVE form ── */
        .hl {
          text-align:center;
          animation:fup .8s ease .15s both;
        }
        .hl-badge {
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(255,255,255,0.6);
          border:1px solid rgba(249,115,22,0.22);
          border-radius:999px;padding:5px 16px;
          font-size:.7rem;font-weight:600;color:#b84010;
          margin-bottom:14px;backdrop-filter:blur(8px);
        }
        .hl-badge-dot { width:6px;height:6px;border-radius:50%;background:#F97316;animation:blink 1.5s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }

        .hl-h1 {
          font-family:'Playfair Display',serif;
          font-size:2.6rem;font-weight:900;color:#1e0e02;line-height:1.05;
        }
        .hl-h1 em { color:#F97316;font-style:italic; }
        .hl-sub {
          font-size:.7rem;color:rgba(100,55,12,.42);
          letter-spacing:.2em;text-transform:uppercase;margin-top:8px;
        }

        /* ── stat row ── */
        .stats {
          display:flex;gap:14px;justify-content:center;
          margin-top:18px;
          animation:fup .8s ease .3s both;
        }
        .stat {
          display:flex;align-items:center;gap:8px;
          background:rgba(255,255,255,0.55);
          border:1px solid rgba(249,115,22,0.15);
          border-radius:14px;padding:10px 18px;
          backdrop-filter:blur(8px);
          box-shadow:0 2px 14px rgba(160,80,20,0.07);
        }
        .stat-ico { font-size:1.2rem; }
        .stat-n { font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:800;color:#1e0e02; }
        .stat-l { font-size:.6rem;color:rgba(100,55,12,.5);font-weight:500;margin-top:1px; }

        /* ══ FORM CARD — centered, glass ══ */
        .fcard {
          width:100%;max-width:400px;
          background:rgba(255,255,255,0.7);
          border:1px solid rgba(249,115,22,0.16);
          border-radius:28px;padding:36px 32px;
          backdrop-filter:blur(24px);
          box-shadow:0 24px 70px rgba(160,80,20,0.13), 0 2px 8px rgba(160,80,20,0.05);
          animation:fup .8s ease .05s both;
        }

        .ft { font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;color:#1e0e02;line-height:1.1;margin-bottom:4px; }
        .fs { color:#a08060;font-size:.82rem;margin-bottom:16px; }

        .ftr { display:flex;gap:14px;margin-bottom:18px; }
        .fti { display:flex;align-items:center;gap:5px;font-size:.7rem;color:#b8a080; }
        .ftd { width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block; }

        .fgw { margin-bottom:16px; }
        .fgw > div { width:100%!important; }

        .fdiv { display:flex;align-items:center;gap:10px;margin-bottom:15px; }
        .fdl  { flex:1;height:1px;background:rgba(180,100,30,.13); }
        .fdt  { font-size:.65rem;color:#c4a080;letter-spacing:.12em;white-space:nowrap; }

        .ff { margin-bottom:12px; }
        .ff label { display:block;font-size:.69rem;font-weight:700;color:#8a6040;margin-bottom:5px;letter-spacing:.07em;text-transform:uppercase; }
        .ff input {
          width:100%;padding:11px 14px;
          background:rgba(255,255,255,0.75);
          border:1.5px solid rgba(180,120,60,.17);
          border-radius:12px;font-size:.875rem;color:#1a0e06;
          font-family:'DM Sans',sans-serif;outline:none;
          transition:border-color .2s,box-shadow .2s,background .2s;
        }
        .ff input:focus { border-color:#F97316;box-shadow:0 0 0 3px rgba(249,115,22,.1);background:#fff; }
        .ff input::placeholder { color:#c0a070; }

        .ffgt { text-align:right;margin-bottom:16px;margin-top:-4px; }
        .ffgt button { background:none;border:none;cursor:pointer;font-size:.76rem;color:#F97316;font-family:'DM Sans',sans-serif;font-weight:500; }
        .ffgt button:hover { text-decoration:underline; }

        .fbtn {
          width:100%;padding:13px;
          background:linear-gradient(135deg,#F97316,#ea580c);
          color:#fff;font-family:'DM Sans',sans-serif;
          font-weight:700;font-size:.95rem;border:none;border-radius:12px;
          cursor:pointer;box-shadow:0 4px 20px rgba(249,115,22,.32);
          transition:opacity .2s,transform .15s;position:relative;overflow:hidden;
        }
        .fbtn:hover:not(:disabled) { opacity:.91;transform:translateY(-1px);box-shadow:0 8px 30px rgba(249,115,22,.45); }
        .fbtn:disabled { opacity:.55;cursor:not-allowed; }
        .fbtn::after { content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.2),transparent);transform:skewX(-20deg);transition:left .5s; }
        .fbtn:hover:not(:disabled)::after { left:130%; }
        .fsp { display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spx .7s linear infinite;margin-right:8px;vertical-align:middle; }
        @keyframes spx { to{transform:rotate(360deg)} }

        .fnew { text-align:center;margin-top:16px;font-size:.8rem;color:#b8a080; }
        .fnew button { background:none;border:none;cursor:pointer;color:#F97316;font-weight:700;font-family:'DM Sans',sans-serif;font-size:.8rem; }
        .fnew button:hover { text-decoration:underline; }

        /* ══ TICKER ══ */
        .ticker { position:relative;z-index:30;overflow:hidden;height:38px;background:rgba(249,115,22,.05);border-top:1px solid rgba(249,115,22,.1);display:flex;align-items:center; }
        .ticker-in { display:flex;white-space:nowrap;animation:tick 26s linear infinite; }
        @keyframes tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ti { font-size:.67rem;font-weight:600;color:rgba(120,65,15,.45);letter-spacing:.08em;padding:0 28px;text-transform:uppercase; }
        .td { color:#F97316;margin:0 4px;font-size:.42rem;vertical-align:middle; }
        .pgfoot { position:relative;z-index:30;text-align:center;font-size:.66rem;color:rgba(140,80,20,.3);padding:10px 0 14px; }

        /* ══ POPUP ══ */
        .pu-ov { position:fixed;inset:0;background:rgba(20,8,0,.65);backdrop-filter:blur(12px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fdin .25s ease; }
        @keyframes fdin { from{opacity:0}to{opacity:1} }
        .pu-c { background:#fff;border-radius:24px;padding:40px 32px 30px;max-width:420px;width:100%;text-align:center;position:relative;box-shadow:0 40px 100px rgba(20,8,0,.25);animation:popin .4s cubic-bezier(.34,1.56,.64,1); }
        @keyframes popin { from{opacity:0;transform:scale(.78) translateY(36px)}to{opacity:1;transform:scale(1) translateY(0)} }
        .pu-x { position:absolute;top:14px;right:14px;background:#f5ede6;border:none;cursor:pointer;width:30px;height:30px;border-radius:50%;font-size:.75rem;color:#a08070;display:flex;align-items:center;justify-content:center; }
        .pu-x:hover { background:#ead8c8; }
        .pu-em { font-size:3rem;display:block;margin-bottom:14px;animation:wv 1.2s ease-in-out infinite; }
        @keyframes wv { 0%,100%{transform:rotate(0)}25%{transform:rotate(18deg)}75%{transform:rotate(-10deg)} }
        .pu-ti { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#111;margin-bottom:10px; }
        .pu-mg { font-size:.875rem;color:#7a6a5a;line-height:1.65;margin-bottom:20px; }
        .pu-mg .hi{color:#F97316;font-weight:700;} .pu-mg .bd{color:#333;font-weight:600;}
        .pu-st { background:#fff8f2;border:1px solid #fde2c8;border-radius:14px;padding:16px 18px;margin-bottom:22px;text-align:left; }
        .pu-s { display:flex;align-items:flex-start;gap:10px;font-size:.82rem;color:#6a5a4a;margin-bottom:10px;line-height:1.5; }
        .pu-s:last-child{margin-bottom:0;}
        .pu-sn { min-width:22px;height:22px;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;margin-top:1px; }
        .pu-cd { display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:18px; }
        .pu-rg { position:relative;width:40px;height:40px;flex-shrink:0; }
        .pu-rg svg{transform:rotate(-90deg);}
        .pu-bg2{fill:none;stroke:#fde8d0;stroke-width:3.5;}
        .pu-ar2{fill:none;stroke:#F97316;stroke-width:3.5;stroke-linecap:round;stroke-dasharray:100;transition:stroke-dashoffset 1s linear;}
        .pu-nm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:800;color:#F97316;}
        .pu-lb{font-size:.78rem;color:#b0a090;text-align:left;}
        .pu-bn{width:100%;padding:13px;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;border:none;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;box-shadow:0 6px 24px rgba(249,115,22,.35);transition:transform .2s;margin-bottom:10px;}
        .pu-bn:hover{transform:translateY(-2px);}
        .pu-sk{background:none;border:none;cursor:pointer;font-size:.75rem;color:#c8b8a8;font-family:'DM Sans',sans-serif;}
        .pu-sk:hover{color:#8a7060;}
      `}</style>

      <div className="pg">

        {/* ── blobs all over page ── */}
        <div className="blob b1"/>
        <div className="blob b2"/>
        <div className="blob b3"/>
        <div className="blob b4"/>

        {/* ── floating chips scattered entire page ── */}
        {chips.map((c, i) => (
          <div key={i} className="chip"
            style={{ left:c.x, top:c.y, "--d":c.d, "--t":c.t }}>
            <span>{c.icon}</span>
            <span className="cdot" style={{background:c.c}}/>
            {c.label}
          </div>
        ))}

        {/* ── SINGLE NAV ── */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <span style={{color:"#22c55e"}}>ILM</span>
            <span style={{color:"#F97316"}}> ORA</span>
          </div>
          <button className="nav-btn" onClick={() => navigate("/apply")}>🚀 Apply Now</button>
        </nav>

        {/* ── EVERYTHING CENTERED — headline + stats + form ── */}
        <div className="center">

          {/* headline */}
          <div className="hl">
            <div className="hl-badge">
              <span className="hl-badge-dot"/>
              Advanced Learning Platform for Modern Professionals
            </div>
            <h1 className="hl-h1">
              Become the <em>Top 1%</em>
            </h1>
            <p className="hl-sub">Knowledge · Growth · Excellence</p>
          </div>

          {/* stats */}
          <div className="stats">
            <div className="stat">
              <span className="stat-ico">🎓</span>
              <div><div className="stat-n">12K+</div><div className="stat-l">Students</div></div>
            </div>
            <div className="stat">
              <span className="stat-ico">👨‍🏫</span>
              <div><div className="stat-n">500+</div><div className="stat-l">Trainers</div></div>
            </div>
            <div className="stat">
              <span className="stat-ico">📚</span>
              <div><div className="stat-n">300+</div><div className="stat-l">Courses</div></div>
            </div>
          </div>

          {/* form card */}
          <div className="fcard">
            <h1 className="ft">Welcome back</h1>
            <p className="fs">Sign in to continue your journey</p>

            <div className="ftr">
              <span className="fti"><span className="ftd"/>Secure Login</span>
              <span className="fti"><span className="ftd" style={{background:"#F97316"}}/>12K+ Members</span>
            </div>

            <div className="fgw">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError}
                theme="outline" size="large" text="signin_with" shape="rectangular"
                width="336" auto_select={false} cancel_on_tap_outside={true}/>
            </div>

            <div className="fdiv">
              <div className="fdl"/><span className="fdt">OR CONTINUE WITH EMAIL</span><div className="fdl"/>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ff">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required disabled={loading}/>
              </div>
              <div className="ff">
                <label>Password</label>
                <input type="password" placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)} required disabled={loading}/>
              </div>
              <div className="ffgt">
                <button type="button" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
              </div>
              <button type="submit" className="fbtn" disabled={loading}>
                {loading ? <><span className="fsp"/>Signing in…</> : "Sign In →"}
              </button>
            </form>

            <div className="fnew">
              New here? <button onClick={() => navigate("/apply")}>Apply for access</button>
            </div>
          </div>
        </div>

        {/* ticker */}
        <div className="ticker">
          <div className="ticker-in">
            {[...Array(2)].map((_,i) => (
              <React.Fragment key={i}>
                {["Product Design","UI/UX","Growth Hacking","Digital Marketing","Finance","Data Analytics","Leadership","Communication"].map(t => (
                  <span key={t} className="ti"><span className="td">●</span>{t}</span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="pgfoot">© 2026 ILM ORA · All rights reserved</div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="pu-ov">
          <div className="pu-c">
            <button className="pu-x" onClick={handleSkip}>✕</button>
            <span className="pu-em">👋</span>
            <h2 className="pu-ti">One Step Away!</h2>
            <p className="pu-mg">Hey <span className="hi">{newUserRef.current?.name?.split(" ")[0]}</span>! Your Google account is <span className="bd">not registered</span> yet. Please complete your application form first.</p>
            <div className="pu-st">
              <div className="pu-s"><div className="pu-sn">1</div><span>Fill in your personal &amp; educational details</span></div>
              <div className="pu-s"><div className="pu-sn">2</div><span>Submit — admin will review your application</span></div>
              <div className="pu-s"><div className="pu-sn">3</div><span>After approval your dashboard unlocks 🎉</span></div>
            </div>
            <div className="pu-cd">
              <div className="pu-rg">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle className="pu-bg2" cx="20" cy="20" r="16"/>
                  <circle className="pu-ar2" cx="20" cy="20" r="16"
                    style={{strokeDashoffset:100-(100*countdown/4)}}/>
                </svg>
                <div className="pu-nm">{countdown}</div>
              </div>
              <div className="pu-lb">Redirecting…<br/>
                <span style={{color:"#F97316",fontWeight:600}}>in {countdown}s</span>
              </div>
            </div>
            <button className="pu-bn" onClick={handleFillForm}>📄 Fill Application Now →</button>
            <br/>
            <button className="pu-sk" onClick={handleSkip}>Skip for now</button>
          </div>
        </div>
      )}
    </>
  );
};

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TexoraLogin/>
    </GoogleOAuthProvider>
  );
}