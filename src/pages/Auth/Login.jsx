
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import auth from "../../auth";

// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// const TexoraLogin = () => {
//   const navigate = useNavigate();
//   const [email,        setEmail]        = useState("");
//   const [password,     setPassword]     = useState("");
//   const [loading,      setLoading]      = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   /* ─── Role-based redirect ────────────────────────── */
//   const redirectByRole = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "ADMIN":    navigate("/admin",    { replace: true }); break;
//       case "TRAINER":  navigate("/trainer",  { replace: true }); break;
//       case "BUSINESS": navigate("/business", { replace: true }); break;
//       default:         navigate("/student",  { replace: true });
//     }
//   };

//   /* ─── Email / password login ─────────────────────── */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     try {
//       const ok = await auth.login({ email, password });
//       if (ok) {
//         const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);
//       } else {
//         alert("Login failed! Check your credentials.");
//       }
//     } catch (err) {
//       alert("Login error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ─── Google login ───────────────────────────────── */
//   const handleGoogleSuccess = async (res) => {
//     try {
//       localStorage.removeItem("lms_token");
//       localStorage.removeItem("lms_user");
//       localStorage.removeItem("role");

//       const dec  = jwtDecode(res.credential);
//       const resp = await auth.googleLogin({ idToken: res.credential });

//       if (resp?.isNewUser === true) {
//         localStorage.setItem("role", "STUDENT");
//         localStorage.setItem("lms_user", JSON.stringify({
//           name:      dec.name,
//           email:     dec.email,
//           role:      "student",
//           isNewUser: true,
//         }));
//         navigate("/ilm-demo", { replace: true });
//       } else {
//         const role = (resp?.role || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         localStorage.setItem("lms_user", JSON.stringify({
//           name:  dec.name,
//           email: dec.email,
//           role:  role.toLowerCase(),
//         }));
//         redirectByRole(role);
//       }
//     } catch (err) {
//       console.error("Google login error:", err);
//       try {
//         const dec = jwtDecode(res.credential);
//         localStorage.setItem("role", "STUDENT");
//         localStorage.setItem("lms_user", JSON.stringify({
//           name:      dec.name,
//           email:     dec.email,
//           role:      "student",
//           isNewUser: true,
//         }));
//         navigate("/ilm-demo", { replace: true });
//       } catch (_) {
//         alert("Google login failed. Please try again.");
//       }
//     }
//   };

//   const handleGoogleError = () => console.error("Google OAuth failed");

//   /* ─── SVG Icons ──────────────────────────────────── */
//   const EyeOpen = () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//       <circle cx="12" cy="12" r="3"/>
//     </svg>
//   );

//   const EyeOff = () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
//       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
//       <line x1="1" y1="1" x2="23" y2="23"/>
//     </svg>
//   );

//   /* ══════════════════════════════════════════════════ */
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .pg {
//           font-family: 'DM Sans', sans-serif;
//           min-height: 100vh;
//           background: #f5ece1;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           overflow: hidden;
//           padding: 24px 16px;
//         }

//         .pg::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background-image: radial-gradient(circle, rgba(180,100,30,0.08) 1px, transparent 1px);
//           background-size: 28px 28px;
//           pointer-events: none;
//           z-index: 0;
//         }

//         .card {
//           position: relative;
//           z-index: 10;
//           width: 100%;
//           max-width: 420px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 18px;
//           animation: fadeUp 0.55s ease both;
//         }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* ── LOGO ── */
//         .logo-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 0;
//           margin-bottom: 6px;
//           cursor: pointer;
//         }
//         .logo-ilm {
//           font-family: 'Playfair Display', serif;
//           font-size: 2.6rem;
//           font-weight: 900;
//           color: #16a34a;
//           line-height: 1;
//           letter-spacing: -0.01em;
//         }
//         .logo-ora {
//           font-family: 'Playfair Display', serif;
//           font-size: 2.6rem;
//           font-weight: 900;
//           color: #F97316;
//           line-height: 1;
//           letter-spacing: -0.01em;
//           margin-left: 10px;
//         }

//         /* ── HEADING ── */
//         .heading { text-align: center; }
//         .heading h2 {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 1.4rem;
//           font-weight: 700;
//           color: #1e0e02;
//           margin-bottom: 6px;
//         }
//         .heading p { font-size: 0.84rem; color: #8a6040; }
//         .heading p button {
//           background: none; border: none; cursor: pointer;
//           color: #F97316;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.84rem; font-weight: 700; padding: 0;
//         }
//         .heading p button:hover { text-decoration: underline; }

//         /* ── FORM BOX ── */
//         .form-box {
//           width: 100%;
//           background: rgba(255,255,255,0.72);
//           border: 1px solid rgba(249,115,22,0.16);
//           border-radius: 20px;
//           padding: 28px 24px;
//           backdrop-filter: blur(16px);
//           box-shadow: 0 20px 60px rgba(160,80,20,0.12), 0 2px 8px rgba(160,80,20,0.05);
//           display: flex;
//           flex-direction: column;
//           gap: 0;
//         }

//         /* ── GOOGLE ── */
//         .google-wrap {
//           width: 100%;
//           margin-bottom: 14px;
//           display: flex;
//           justify-content: center;
//         }
//         .google-wrap > div,
//         .google-wrap iframe,
//         .google-wrap > div > div {
//           width: 100% !important;
//           max-width: 100% !important;
//         }

//         /* ── OR divider ── */
//         .or-div {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 14px;
//         }
//         .or-line { flex: 1; height: 1px; background: rgba(180,100,30,0.15); }
//         .or-text  { font-size: 0.7rem; color: #b8906a; letter-spacing: 0.1em; text-transform: uppercase; }

//         /* ── FIELDS ── */
//         .field { margin-bottom: 12px; }
//         .field label {
//           display: block;
//           font-size: 0.72rem;
//           font-weight: 700;
//           color: #8a6040;
//           margin-bottom: 5px;
//           letter-spacing: 0.06em;
//           text-transform: uppercase;
//         }
//         .field input {
//           width: 100%;
//           padding: 11px 14px;
//           background: rgba(255,255,255,0.8);
//           border: 1.5px solid rgba(180,120,60,0.2);
//           border-radius: 10px;
//           color: #1a0e06;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.875rem;
//           outline: none;
//           transition: border-color 0.2s, box-shadow 0.2s;
//         }
//         .field input::placeholder { color: #c0a070; }
//         .field input:focus {
//           border-color: #F97316;
//           box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
//           background: #fff;
//         }
//         .field input:disabled { opacity: 0.5; cursor: not-allowed; }

//         /* ── PASSWORD WRAPPER ── */
//         .pw-wrap { position: relative; }
//         .pw-wrap input { padding-right: 44px; }
//         .eye-btn {
//           position: absolute;
//           right: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #b8906a;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0;
//           transition: color 0.2s;
//           line-height: 1;
//         }
//         .eye-btn:hover { color: #F97316; }

//         /* ── SUBMIT ── */
//         .sub-btn {
//           width: 100%;
//           padding: 13px;
//           background: linear-gradient(135deg, #F97316, #ea580c);
//           color: #fff;
//           font-family: 'DM Sans', sans-serif;
//           font-weight: 700;
//           font-size: 0.95rem;
//           border: none;
//           border-radius: 10px;
//           cursor: pointer;
//           transition: opacity 0.2s, transform 0.15s;
//           box-shadow: 0 4px 18px rgba(249,115,22,0.32);
//           margin-top: 2px;
//         }
//         .sub-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
//         .sub-btn:disabled { opacity: 0.5; cursor: not-allowed; }

//         .spinner {
//           display: inline-block;
//           width: 13px; height: 13px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: #fff;
//           border-radius: 50%;
//           animation: spin 0.7s linear infinite;
//           margin-right: 8px;
//           vertical-align: middle;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         /* ── FORGOT ── */
//         .forgot-row { text-align: right; margin: 6px 0 14px; }
//         .forgot-row button {
//           background: none; border: none; cursor: pointer;
//           color: #F97316;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.78rem; font-weight: 500;
//         }
//         .forgot-row button:hover { text-decoration: underline; }

//         /* ── BACK ── */
//         .back-link {
//           text-align: center;
//           font-size: 0.78rem;
//           color: #b8906a;
//           margin-top: 16px;
//         }
//         .back-link button {
//           background: none; border: none; cursor: pointer;
//           color: #b8906a;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.78rem;
//         }
//         .back-link button:hover { color: #8a6040; }
//       `}</style>

//       <div className="pg">
//         <div className="card">

//           {/* Logo */}
//           <div className="logo-badge" onClick={() => navigate("/")}>
//             <span className="logo-ilm">ILM</span>
//             <span className="logo-ora">ORA</span>
//           </div>

//           {/* Heading */}
//           <div className="heading">
//             <h2>Welcome back!</h2>
//             <p>
//               Don't have an account?{" "}
//               <button onClick={() => navigate("/complete-profile")}>Apply now</button>
//             </p>
//           </div>

//           {/* Form box */}
//           <div className="form-box" style={{ width: "100%" }}>

//             {/* Google Login */}
//             <div className="google-wrap">
//               <GoogleLogin
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleError}
//                 theme="outline"
//                 size="large"
//                 text="continue_with"
//                 shape="rectangular"
//                 width="372"
//                 auto_select={false}
//                 cancel_on_tap_outside={true}
//               />
//             </div>

//             {/* OR divider */}
//             <div className="or-div">
//               <div className="or-line" />
//               <span className="or-text">OR</span>
//               <div className="or-line" />
//             </div>

//             {/* Email / Password form */}
//             <form onSubmit={handleSubmit}>

//               <div className="field">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={e => setEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div className="field">
//                 <label>Password</label>
//                 <div className="pw-wrap">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     className="eye-btn"
//                     onClick={() => setShowPassword(p => !p)}
//                     tabIndex={-1}
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff /> : <EyeOpen />}
//                   </button>
//                 </div>
//               </div>

//               <div className="forgot-row">
//                 <button type="button" onClick={() => navigate("/forgot-password")}>
//                   Forgot password?
//                 </button>
//               </div>

//               <button type="submit" className="sub-btn" disabled={loading}>
//                 {loading ? <><span className="spinner" />Signing in…</> : "Log in"}
//               </button>

//             </form>

//             <div className="back-link">
//               <button onClick={() => navigate("/")}>← Back to home</button>
//             </div>

//           </div>
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
import { registerFcmToken } from "../../services/firebaseService";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const TexoraLogin = () => {
  const navigate = useNavigate();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup,    setShowPopup]    = useState(false);
  const [countdown,    setCountdown]    = useState(5);
  const newUserRef = useRef(null);

  // Auto-redirect countdown for new Google users
  useEffect(() => {
    if (!showPopup) return;
    setCountdown(5);
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(iv);
          const d = newUserRef.current;
          if (d) {
            setShowPopup(false);
            navigate("/apply", {
              state: { name: d.name, email: d.email, isGoogleUser: true },
            });
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [showPopup]);

  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "ADMIN":    navigate("/admin",    { replace: true }); break;
      case "TRAINER":  navigate("/trainer",  { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default:         navigate("/student",  { replace: true });
    }
  };

  // Email / password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const ok = await auth.login({ email, password });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        registerFcmToken(); // Firebase FCM token registered after login
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleSuccess = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec  = jwtDecode(res.credential);
      const resp = await auth.googleLogin({ idToken: res.credential });

      if (resp?.isNewUser === true) {
        newUserRef.current = { name: dec.name, email: dec.email };
        setShowPopup(true);
      } else {
        const role = (resp?.role || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        registerFcmToken(); // Firebase FCM token registered after Google login
        redirectByRole(role);
      }
    } catch (err) {
      console.error(err);
      try {
        const dec = jwtDecode(res.credential);
        newUserRef.current = { name: dec.name, email: dec.email };
      } catch (_) {
        newUserRef.current = { name: "", email: "" };
      }
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");
      setShowPopup(true);
    }
  };

  const handleGoogleError = () => console.error("Google OAuth failed");

  const handleFillForm = () => {
    const d = newUserRef.current;
    setShowPopup(false);
    navigate("/apply", {
      state: { name: d?.name, email: d?.email, isGoogleUser: true },
    });
  };

  const handleSkip = () => {
    setShowPopup(false);
    newUserRef.current = null;
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    localStorage.removeItem("role");
  };

  const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pg {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5ece1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
        }
        .pg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(180,100,30,0.08) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }
        .card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          animation: fadeUp 0.55s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .logo-badge { display: inline-flex; align-items: center; gap: 0; margin-bottom: 6px; cursor: pointer; }
        .logo-ilm { font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 900; color: #16a34a; line-height: 1; letter-spacing: -0.01em; }
        .logo-ora { font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 900; color: #F97316; line-height: 1; letter-spacing: -0.01em; margin-left: 10px; }
        .heading { text-align: center; }
        .heading h2 { font-family: 'DM Sans', sans-serif; font-size: 1.4rem; font-weight: 700; color: #1e0e02; margin-bottom: 6px; }
        .heading p { font-size: 0.84rem; color: #8a6040; }
        .heading p button { background: none; border: none; cursor: pointer; color: #F97316; font-family: 'DM Sans', sans-serif; font-size: 0.84rem; font-weight: 700; padding: 0; }
        .heading p button:hover { text-decoration: underline; }
        .form-box {
          width: 100%;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(249,115,22,0.16);
          border-radius: 20px;
          padding: 28px 24px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 60px rgba(160,80,20,0.12), 0 2px 8px rgba(160,80,20,0.05);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .google-wrap { width: 100%; margin-bottom: 14px; display: flex; justify-content: center; }
        .google-wrap > div, .google-wrap iframe, .google-wrap > div > div { width: 100% !important; max-width: 100% !important; }
        .or-div { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .or-line { flex: 1; height: 1px; background: rgba(180,100,30,0.15); }
        .or-text  { font-size: 0.7rem; color: #b8906a; letter-spacing: 0.1em; text-transform: uppercase; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: 0.72rem; font-weight: 700; color: #8a6040; margin-bottom: 5px; letter-spacing: 0.06em; text-transform: uppercase; }
        .field input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.8); border: 1.5px solid rgba(180,120,60,0.2); border-radius: 10px; color: #1a0e06; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .field input::placeholder { color: #c0a070; }
        .field input:focus { border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); background: #fff; }
        .field input:disabled { opacity: 0.5; cursor: not-allowed; }
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 44px; }
        .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #b8906a; display: flex; align-items: center; justify-content: center; padding: 0; transition: color 0.2s; line-height: 1; }
        .eye-btn:hover { color: #F97316; }
        .sub-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #F97316, #ea580c); color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem; border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 18px rgba(249,115,22,0.32); margin-top: 2px; }
        .sub-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .sub-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .forgot-row { text-align: right; margin: 6px 0 14px; }
        .forgot-row button { background: none; border: none; cursor: pointer; color: #F97316; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; }
        .forgot-row button:hover { text-decoration: underline; }
        .back-link { text-align: center; font-size: 0.78rem; color: #b8906a; margin-top: 16px; }
        .back-link button { background: none; border: none; cursor: pointer; color: #b8906a; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; }
        .back-link button:hover { color: #8a6040; }

        /* POPUP STYLES */
        .pu-page { position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#f5ece1;overflow:hidden;animation:pgIn .35s ease both; }
        @keyframes pgIn { from{opacity:0} to{opacity:1} }
        .pu-page::before { content:'';position:absolute;inset:0;z-index:0;background-image:radial-gradient(circle,rgba(180,100,30,0.09) 1px,transparent 1px);background-size:28px 28px;pointer-events:none; }
        .pu-blob1 { position:absolute;width:700px;height:700px;border-radius:50%;filter:blur(120px);background:radial-gradient(circle,rgba(249,115,22,0.18),transparent 65%);top:-250px;left:-200px;animation:bp 10s ease-in-out infinite;pointer-events:none; }
        .pu-blob2 { position:absolute;width:600px;height:600px;border-radius:50%;filter:blur(110px);background:radial-gradient(circle,rgba(249,115,22,0.12),transparent 65%);bottom:-200px;right:-180px;animation:bp 13s ease-in-out infinite 4s;pointer-events:none; }
        .pu-blob3 { position:absolute;width:350px;height:350px;border-radius:50%;filter:blur(90px);background:radial-gradient(circle,rgba(34,197,94,0.09),transparent 65%);top:15%;right:8%;animation:bp 8s ease-in-out infinite 2s;pointer-events:none; }
        @keyframes bp { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.1)} }
        .pu-card { position:relative;z-index:10;width:100%;max-width:520px;margin:0 16px;background:rgba(255,255,255,0.84);border:1px solid rgba(249,115,22,0.18);border-radius:32px;padding:48px 36px 36px;backdrop-filter:blur(32px);box-shadow:0 40px 100px rgba(160,80,20,0.18),0 4px 16px rgba(160,80,20,0.06),inset 0 1px 0 rgba(255,255,255,0.95);animation:cardPop .5s cubic-bezier(.34,1.56,.64,1) both;text-align:center; }
        @media (max-width:560px) { .pu-card { padding:36px 20px 28px;border-radius:24px; } }
        @keyframes cardPop { from{opacity:0;transform:scale(.82) translateY(40px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .pu-close { position:absolute;top:16px;right:16px;width:34px;height:34px;border-radius:50%;background:#fff0ed;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.8rem;color:#c0503a;box-shadow:0 2px 10px rgba(200,80,50,.12);transition:background .2s,transform .15s; }
        .pu-close:hover { background:#fdd8d2;transform:scale(1.08); }
        .pu-icon-wrap { position:relative;display:inline-flex;align-items:center;justify-content:center;width:90px;height:90px;margin-bottom:20px; }
        .pu-ring { position:absolute;inset:0;border-radius:50%;border:2.5px solid rgba(249,115,22,0.28);animation:rp 2s ease-in-out infinite; }
        .pu-ring2 { position:absolute;inset:-12px;border-radius:50%;border:2px solid rgba(249,115,22,0.13);animation:rp 2s ease-in-out infinite .6s; }
        @keyframes rp { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.14);opacity:.35} }
        .pu-emoji { font-size:3.2rem;animation:wv 1.4s ease-in-out infinite;display:block;filter:drop-shadow(0 4px 14px rgba(249,115,22,.28)); }
        @keyframes wv { 0%,100%{transform:rotate(-4deg) scale(1)} 50%{transform:rotate(13deg) scale(1.1)} }
        .pu-title { font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#1e0e02;line-height:1.1;margin-bottom:8px; }
        .pu-title em { color:#F97316;font-style:italic; }
        @media (max-width:480px) { .pu-title { font-size:1.6rem; } }
        .pu-sub { font-size:.9rem;color:#a08060;line-height:1.65;margin-bottom:20px; }
        .pu-sub .hi { color:#F97316;font-weight:700; }
        .pu-sub .bd { color:#c0503a;font-weight:700; }
        .pu-banner { display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#fff5f0,#fff0e8);border:1.5px solid rgba(249,115,22,0.24);border-radius:16px;padding:14px 18px;margin-bottom:18px;text-align:left; }
        .pu-banner-ico { font-size:1.4rem;flex-shrink:0; }
        .pu-banner-txt { font-size:.83rem;color:#7a4020;line-height:1.5; }
        .pu-banner-txt strong { color:#c0503a; }
        .pu-steps { display:flex;flex-direction:column;gap:11px;background:rgba(255,248,240,0.7);border:1px solid rgba(249,115,22,0.14);border-radius:18px;padding:18px;margin-bottom:22px;text-align:left; }
        .pu-step { display:flex;align-items:flex-start;gap:12px;font-size:.85rem;color:#6a5040;line-height:1.55; }
        .pu-step-n { min-width:26px;height:26px;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;box-shadow:0 3px 10px rgba(249,115,22,.3);flex-shrink:0;margin-top:1px; }
        .pu-timer { display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:24px; }
        .pu-ring-wrap { position:relative;width:54px;height:54px;flex-shrink:0; }
        .pu-ring-wrap svg { transform:rotate(-90deg); }
        .pu-rbg { fill:none;stroke:#fde8d0;stroke-width:4.5; }
        .pu-rarc { fill:none;stroke:#F97316;stroke-width:4.5;stroke-linecap:round;stroke-dasharray:132;transition:stroke-dashoffset 1s linear; }
        .pu-rnum { position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:800;color:#F97316; }
        .pu-timer-txt .big { font-size:.94rem;font-weight:700;color:#3a2010; }
        .pu-timer-txt .sm { font-size:.76rem;color:#a08060;margin-top:3px; }
        .pu-timer-txt .sm span { color:#F97316;font-weight:700; }
        .pu-cta { width:100%;padding:15px;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 8px 28px rgba(249,115,22,.38);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden;margin-bottom:12px; }
        .pu-cta:hover { transform:translateY(-2px);box-shadow:0 14px 36px rgba(249,115,22,.5); }
        .pu-skip { background:none;border:none;cursor:pointer;font-size:.78rem;color:#b8a898;font-family:'DM Sans',sans-serif;text-decoration:underline;transition:color .2s; }
        .pu-skip:hover { color:#8a7060; }
      `}</style>

      <div className="pg">
        <div className="card">

          {/* Logo */}
          <div className="logo-badge" onClick={() => navigate("/")}>
            <span className="logo-ilm">ILM</span>
            <span className="logo-ora">ORA</span>
          </div>

          {/* Heading */}
          <div className="heading">
            <h2>Welcome back!</h2>
            <p>
              Don't have an account?{" "}
              <button onClick={() => navigate("/apply")}>Apply now</button>
            </p>
          </div>

          {/* Form box */}
          <div className="form-box">

            {/* Google Login */}
            <div className="google-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline" size="large" text="continue_with"
                shape="rectangular" width="372"
                auto_select={false} cancel_on_tap_outside={true}
              />
            </div>

            {/* OR divider */}
            <div className="or-div">
              <div className="or-line" />
              <span className="or-text">OR</span>
              <div className="or-line" />
            </div>

            {/* Email / Password */}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="Enter your email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required disabled={loading} />
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pw-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    required disabled={loading}
                  />
                  <button type="button" className="eye-btn"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}>
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <div className="forgot-row">
                <button type="button" onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="sub-btn" disabled={loading}>
                {loading ? <><span className="spinner" />Signing in…</> : "Log in"}
              </button>
            </form>

            <div className="back-link">
              <button onClick={() => navigate("/")}>← Back to home</button>
            </div>
          </div>
        </div>
      </div>

      {/* New User Popup */}
      {showPopup && (
        <div className="pu-page">
          <div className="pu-blob1" /><div className="pu-blob2" /><div className="pu-blob3" />
          <div className="pu-card">
            <button className="pu-close" onClick={handleSkip}>✕</button>
            <div className="pu-icon-wrap">
              <div className="pu-ring" /><div className="pu-ring2" />
              <span className="pu-emoji">👋</span>
            </div>
            <h2 className="pu-title">Almost <em>There!</em></h2>
            <p className="pu-sub">
              Hey <span className="hi">{newUserRef.current?.name?.split(" ")[0] || "there"}</span>!
              Your Google account is <span className="bd">not registered</span> in our system yet.
            </p>
            <div className="pu-banner">
              <span className="pu-banner-ico">🚫</span>
              <div className="pu-banner-txt">
                <strong>Dashboard access is blocked</strong> until your application is submitted and approved by an admin.
              </div>
            </div>
            <div className="pu-steps">
              {[
                "Fill in your personal & educational details in the Apply form",
                "Submit — our admin team will review your application",
                "After approval your full dashboard unlocks 🎉",
              ].map((s, i) => (
                <div key={i} className="pu-step">
                  <div className="pu-step-n">{i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="pu-timer">
              <div className="pu-ring-wrap">
                <svg width="54" height="54" viewBox="0 0 54 54">
                  <circle className="pu-rbg" cx="27" cy="27" r="21" />
                  <circle className="pu-rarc" cx="27" cy="27" r="21"
                    style={{ strokeDashoffset: 132 - (132 * countdown) / 5 }} />
                </svg>
                <div className="pu-rnum">{countdown}</div>
              </div>
              <div className="pu-timer-txt">
                <div className="big">Redirecting to Apply form…</div>
                <div className="sm">Auto-redirect <span>in {countdown}s</span></div>
              </div>
            </div>
            <button className="pu-cta" onClick={handleFillForm}>📄 Fill Application Now →</button>
            <br />
            <button className="pu-skip" onClick={handleSkip}>Stay on login page</button>
          </div>
        </div>
      )}
    </>
  );
};

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TexoraLogin />
    </GoogleOAuthProvider>
  );
}