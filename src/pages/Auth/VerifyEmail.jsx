// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";
// console.log("API_BASE_URL =>", API_BASE_URL);

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

// :root {
//   --bg:#f1f5f9; --card:#ffffff; --tx:#0f172a; --mu:#64748b; --bd:#e2e8f0;
//   --c1:#22d3ee; --c2:#fb923c; --c3:#34d399; --c4:#a78bfa; --cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06); --shl:0 8px 40px rgba(0,0,0,0.10); --r:20px;
// }
// .ve-dk {
//   --bg:#0a0a0a; --card:#111111; --tx:#ffffff; --mu:#94a3b8;
//   --bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40); --shl:0 8px 40px rgba(0,0,0,0.60);
// }

// .ve-root {
//   font-family:'Poppins',sans-serif;
//   min-height:100vh;
//   background:var(--bg);
//   color:var(--tx);
//   display:flex;
//   flex-direction:column;
//   transition:background 0.3s;
// }

// /* ── Header ── */
// .ve-header {
//   background:var(--card);
//   border-bottom:1px solid var(--bd);
//   box-shadow:var(--sh);
//   flex-shrink:0;
// }

// .ve-header-inner {
//   max-width:1200px;
//   margin:0 auto;
//   padding:16px 24px;
//   display:flex;
//   align-items:center;
//   justify-content:space-between;
// }

// .ve-logo {
//   display:flex;
//   align-items:center;
//   gap:10px;
//   cursor:pointer;
//   text-decoration:none;
// }

// .ve-logo-box {
//   width:36px; height:36px;
//   border-radius:10px;
//   background:var(--c1);
//   display:flex;
//   align-items:center;
//   justify-content:center;
//   font-size:18px;
//   font-weight:800;
//   color:#0a0a0a;
//   flex-shrink:0;
// }

// .ve-logo-name {
//   font-size:18px;
//   font-weight:800;
//   color:var(--tx);
//   margin:0;
// }

// /* ── Main ── */
// .ve-main {
//   flex:1;
//   display:flex;
//   align-items:center;
//   justify-content:center;
//   padding:48px 24px;
// }

// .ve-card {
//   background:var(--card);
//   border:1px solid var(--bd);
//   border-radius:var(--r);
//   box-shadow:var(--shl);
//   padding:48px 40px;
//   width:100%;
//   max-width:440px;
//   text-align:center;
// }

// /* ── Icon circles ── */
// .ve-icon-wrap {
//   width:72px; height:72px;
//   border-radius:50%;
//   display:flex;
//   align-items:center;
//   justify-content:center;
//   margin:0 auto 24px;
// }

// .ve-icon-wrap.cyan   { background:rgba(34,211,238,.12); border:1px solid rgba(34,211,238,.20); }
// .ve-icon-wrap.green  { background:rgba(52,211,153,.12);  border:1px solid rgba(52,211,153,.20); }
// .ve-icon-wrap.red    { background:rgba(248,113,113,.12); border:1px solid rgba(248,113,113,.20); }

// /* Spinner */
// .ve-spinner {
//   width:36px; height:36px;
//   border-radius:50%;
//   border:3px solid rgba(34,211,238,.2);
//   border-top-color:var(--c1);
//   animation:ve-spin 0.8s linear infinite;
// }
// @keyframes ve-spin { to { transform:rotate(360deg); } }

// /* ── Typography ── */
// .ve-title {
//   font-size:22px;
//   font-weight:800;
//   color:var(--tx);
//   margin:0 0 8px;
//   line-height:1.3;
// }

// .ve-sub {
//   font-size:13px;
//   color:var(--mu);
//   margin:0 0 24px;
//   line-height:1.6;
// }

// .ve-email-display {
//   font-size:14px;
//   font-weight:700;
//   color:var(--c1);
//   margin:0 0 24px;
// }

// /* ── Message box ── */
// .ve-msg {
//   padding:12px 16px;
//   border-radius:13px;
//   margin-bottom:20px;
//   font-size:13px;
//   font-weight:500;
//   text-align:left;
// }

// .ve-msg.green {
//   background:rgba(52,211,153,.08);
//   border:1px solid rgba(52,211,153,.20);
//   color:var(--c3);
// }

// .ve-msg.red {
//   background:rgba(248,113,113,.08);
//   border:1px solid rgba(248,113,113,.20);
//   color:var(--cr);
// }

// /* ── Divider ── */
// .ve-divider {
//   height:1px;
//   background:var(--bd);
//   margin:24px 0;
// }

// /* ── Buttons ── */
// .ve-btn {
//   display:inline-flex;
//   align-items:center;
//   justify-content:center;
//   gap:8px;
//   width:100%;
//   padding:13px 20px;
//   border-radius:14px;
//   border:none;
//   font-family:'Poppins',sans-serif;
//   font-size:13px;
//   font-weight:700;
//   cursor:pointer;
//   transition:opacity 0.2s, transform 0.15s;
//   margin-bottom:10px;
// }

// .ve-btn:last-child { margin-bottom:0; }
// .ve-btn:hover { opacity:0.87; transform:translateY(-1px); }
// .ve-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

// .ve-btn-cyan { background:var(--c1); color:#0a0a0a; }
// .ve-btn-outline {
//   background:transparent;
//   color:var(--mu);
//   border:1px solid var(--bd) !important;
// }
// .ve-btn-outline:hover { border-color:rgba(34,211,238,.30) !important; color:var(--c1); opacity:1; }
// .ve-btn-ghost {
//   background:transparent;
//   color:var(--mu);
//   border:none !important;
// }
// .ve-btn-ghost:hover { color:var(--c1); opacity:1; }
// `;

// if (!document.getElementById("ve-st")) {
//   const t = document.createElement("style");
//   t.id = "ve-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ════════════════════════════════════════════════════════════════════
//    COMPONENT
// ════════════════════════════════════════════════════════════════════ */
// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [dark, setDark] = useState(isDark);

//   const [verificationStatus, setVerificationStatus] = useState("verifying");
//   const [email, setEmail] = useState("");
//   const [resendCooldown, setResendCooldown] = useState(0);
//   const [message, setMessage] = useState("");

//   const token = searchParams.get("token");
//   const emailParam = searchParams.get("email");

//   /* dark mode observer */
//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   /* verify token */
//   useEffect(() => {
//     if (token && emailParam) {
//       setEmail(emailParam);
//       verifyEmailToken(token, emailParam);
//     } else if (emailParam) {
//       setEmail(emailParam);
//       setVerificationStatus("pending");
//     } else {
//       navigate("/login");
//     }
//   }, [token, emailParam, navigate]);

//   /* cooldown timer */
//   useEffect(() => {
//     if (resendCooldown > 0) {
//       const timer = setTimeout(() => setResendCooldown(p => p - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [resendCooldown]);

//   /* ── API: verify ── */
//   const verifyEmailToken = async (token, email) => {
//     try {
//       setVerificationStatus("verifying");
//       const res = await axios.post(
//         `${API_BASE_URL}/api/auth/verify-email`,
//         { token, email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setVerificationStatus("success");
//       setMessage(res?.data?.message || "Email verified successfully!");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (error) {
//       console.error("Verify Email Error:", error);
//       const backendMsg =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         "Invalid or expired verification link.";
//       setVerificationStatus("error");
//       setMessage(backendMsg);
//     }
//   };

//   /* ── API: resend ── */
//   const handleResendVerification = async () => {
//     if (!email) { setMessage("Email is missing."); return; }
//     if (resendCooldown > 0) return;
//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/api/auth/resend-verification`,
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setMessage(res?.data?.message || "Verification email sent again!");
//       setResendCooldown(60);
//     } catch (error) {
//       console.error("Resend Verification Error:", error);
//       const backendMsg =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         "Failed to resend verification email.";
//       setMessage(backendMsg);
//     }
//   };

//   /* ── Render states ── */
//   const renderContent = () => {
//     switch (verificationStatus) {

//       case "verifying":
//         return (
//           <>
//             <div className="ve-icon-wrap cyan">
//               <div className="ve-spinner" />
//             </div>
//             <h2 className="ve-title">Verifying your email...</h2>
//             <p className="ve-sub">Please wait while we verify your email address.</p>
//           </>
//         );

//       case "success":
//         return (
//           <>
//             <div className="ve-icon-wrap green">
//               <CheckCircle size={32} style={{ color: "var(--c3)" }} />
//             </div>
//             <h2 className="ve-title">Email Verified!</h2>
//             <p className="ve-sub">{message}</p>
//             <div className="ve-divider" />
//             <button className="ve-btn ve-btn-cyan" onClick={() => navigate("/login")}>
//               Continue to Login <ArrowRight size={15} />
//             </button>
//           </>
//         );

//       case "error":
//         return (
//           <>
//             <div className="ve-icon-wrap red">
//               <XCircle size={32} style={{ color: "var(--cr)" }} />
//             </div>
//             <h2 className="ve-title">Verification Failed</h2>
//             {message && <div className="ve-msg red">{message}</div>}
//             <div className="ve-divider" />
//             <button
//               className="ve-btn ve-btn-cyan"
//               onClick={handleResendVerification}
//               disabled={resendCooldown > 0}
//             >
//               <Mail size={15} />
//               {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Verification Email"}
//             </button>
//             <button className="ve-btn ve-btn-outline" onClick={() => navigate("/login")}>
//               Back to Login
//             </button>
//           </>
//         );

//       case "pending":
//         return (
//           <>
//             <div className="ve-icon-wrap cyan">
//               <Mail size={32} style={{ color: "var(--c1)" }} />
//             </div>
//             <h2 className="ve-title">Check your email</h2>
//             <p className="ve-sub" style={{ marginBottom: 8 }}>
//               We've sent a verification link to
//             </p>
//             <p className="ve-email-display">{email}</p>

//             {message && <div className="ve-msg green">{message}</div>}

//             <div className="ve-divider" />

//             <button
//               className="ve-btn ve-btn-cyan"
//               onClick={handleResendVerification}
//               disabled={resendCooldown > 0}
//             >
//               <Mail size={15} />
//               {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Verification Email"}
//             </button>
//             <button className="ve-btn ve-btn-ghost" onClick={() => navigate("/login")}>
//               Back to Login
//             </button>
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={`ve-root${dark ? " ve-dk" : ""}`}>

//       {/* Header */}
//       <header className="ve-header">
//         <div className="ve-header-inner">
//           <div className="ve-logo" onClick={() => navigate("/")}>
//             <div className="ve-logo-box">T</div>
//             <span className="ve-logo-name">TexoraAi.skills</span>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="ve-main">
//         <div className="ve-card">
//           {renderContent()}
//         </div>
//       </main>

//     </div>
//   );
// };

// export default VerifyEmail;













import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";
console.log("API_BASE_URL =>", API_BASE_URL);

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

:root {
  --bg:#ede8e0;
  --card:#ffffff; --tx:#0f172a; --mu:#64748b; --bd:#e2e8f0;
  --c1:#16a34a;
  --c2:#F97316;
  --c3:#34d399; --cr:#f87171;
  --navy:#1e293b;
  --sh:0 4px 24px rgba(0,0,0,0.06); --shl:0 8px 40px rgba(0,0,0,0.10); --r:20px;
}
.ve-dk {
  --bg:#0a0a0a; --card:#111111; --tx:#ffffff; --mu:#94a3b8;
  --bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40); --shl:0 8px 40px rgba(0,0,0,0.60);
}

.ve-root {
  font-family:'Poppins',sans-serif;
  min-height:100vh;
  background:var(--bg);
  color:var(--tx);
  display:flex;
  flex-direction:column;
  transition:background 0.3s;
}

/* ── Header ── */
.ve-header {
  background:var(--card);
  border-bottom:1px solid var(--bd);
  box-shadow:var(--sh);
  flex-shrink:0;
}

.ve-header-inner {
  max-width:100%;
  margin:0;
  padding:16px 32px;
  display:flex;
  align-items:center;
  justify-content:flex-start;
}

.ve-logo {
  display:flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
  text-decoration:none;
}

.ve-logo-name {
  font-family:'Playfair Display', serif;
  font-size:22px;
  font-weight:800;
  letter-spacing:0.04em;
  line-height:1;
  margin:0;
  display:flex;
  align-items:baseline;
  gap:4px;
}

.ve-logo-ilm { color:#16a34a; }
.ve-logo-ora { color:#F97316; }

/* ── Main ── */
.ve-main {
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:48px 24px;
}

.ve-card {
  background:var(--card);
  border:1px solid var(--bd);
  border-radius:var(--r);
  box-shadow:var(--shl);
  padding:48px 40px;
  width:100%;
  max-width:440px;
  text-align:center;
}

/* ── Card accent bar ── */
.ve-card-accent {
  height:4px;
  background:linear-gradient(90deg, #16a34a 0%, #F97316 100%);
  margin:-48px -40px 40px -40px;
  border-radius:20px 20px 0 0;
}

/* ── Icon circles ── */
.ve-icon-wrap {
  width:72px; height:72px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto 24px;
}

.ve-icon-wrap.green {
  background:rgba(22,163,74,.12);
  border:1px solid rgba(22,163,74,.25);
}
.ve-icon-wrap.cyan {
  background:rgba(249,115,22,.10);
  border:1px solid rgba(249,115,22,.22);
}
.ve-icon-wrap.red {
  background:rgba(248,113,113,.12);
  border:1px solid rgba(248,113,113,.20);
}

/* Spinner */
.ve-spinner {
  width:36px; height:36px;
  border-radius:50%;
  border:3px solid rgba(249,115,22,.2);
  border-top-color:#F97316;
  animation:ve-spin 0.8s linear infinite;
}
@keyframes ve-spin { to { transform:rotate(360deg); } }

/* ── Typography ── */
.ve-title {
  font-size:22px;
  font-weight:800;
  color:var(--tx);
  margin:0 0 8px;
  line-height:1.3;
}

.ve-sub {
  font-size:13px;
  color:var(--mu);
  margin:0 0 24px;
  line-height:1.6;
}

.ve-email-display {
  font-size:14px;
  font-weight:700;
  color:#16a34a;
  margin:0 0 24px;
}

/* ── Message box ── */
.ve-msg {
  padding:12px 16px;
  border-radius:13px;
  margin-bottom:20px;
  font-size:13px;
  font-weight:500;
  text-align:left;
}

.ve-msg.green {
  background:rgba(22,163,74,.08);
  border:1px solid rgba(22,163,74,.20);
  color:#16a34a;
}

.ve-msg.red {
  background:rgba(248,113,113,.08);
  border:1px solid rgba(248,113,113,.20);
  color:var(--cr);
}

/* ── Divider ── */
.ve-divider {
  height:1px;
  background:var(--bd);
  margin:24px 0;
}

/* ── Buttons ── */
.ve-btn {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  width:100%;
  padding:13px 20px;
  border-radius:14px;
  border:none;
  font-family:'Poppins',sans-serif;
  font-size:13px;
  font-weight:700;
  cursor:pointer;
  transition:opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  margin-bottom:10px;
}

.ve-btn:last-child { margin-bottom:0; }
.ve-btn:hover { opacity:0.88; transform:translateY(-1px); }
.ve-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

/* 🔶 Primary — Orange (Resend / Continue) */
.ve-btn-orange {
  background:#F97316;
  color:#ffffff;
  box-shadow:0 4px 16px rgba(249,115,22,0.35);
}
.ve-btn-orange:hover {
  box-shadow:0 6px 20px rgba(249,115,22,0.45);
  opacity:1;
}

/* 🟦 Secondary — Dark Navy (Back to Login) */
.ve-btn-navy {
  background:#1e293b;
  color:#ffffff;
  box-shadow:0 4px 14px rgba(0,0,0,0.18);
}
.ve-btn-navy:hover {
  background:#0f172a;
  box-shadow:0 6px 18px rgba(0,0,0,0.25);
  opacity:1;
}

/* Ghost — plain text link style */
.ve-btn-ghost {
  background:transparent;
  color:var(--mu);
  border:none !important;
  box-shadow:none;
}
.ve-btn-ghost:hover { color:#F97316; opacity:1; }
`;

if (!document.getElementById("ve-st")) {
  const t = document.createElement("style");
  t.id = "ve-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════ */
const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dark, setDark] = useState(isDark);

  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [email, setEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  /* dark mode observer */
  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  /* verify token */
  useEffect(() => {
    if (token && emailParam) {
      setEmail(emailParam);
      verifyEmailToken(token, emailParam);
    } else if (emailParam) {
      setEmail(emailParam);
      setVerificationStatus("pending");
    } else {
      navigate("/login");
    }
  }, [token, emailParam, navigate]);

  /* cooldown timer */
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(p => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /* ── API: verify ── */
  const verifyEmailToken = async (token, email) => {
    try {
      setVerificationStatus("verifying");
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-email`,
        { token, email },
        { headers: { "Content-Type": "application/json" } }
      );
      setVerificationStatus("success");
      setMessage(res?.data?.message || "Email verified successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Verify Email Error:", error);
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid or expired verification link.";
      setVerificationStatus("error");
      setMessage(backendMsg);
    }
  };

  /* ── API: resend ── */
  const handleResendVerification = async () => {
    if (!email) { setMessage("Email is missing."); return; }
    if (resendCooldown > 0) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/resend-verification`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage(res?.data?.message || "Verification email sent again!");
      setResendCooldown(60);
    } catch (error) {
      console.error("Resend Verification Error:", error);
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to resend verification email.";
      setMessage(backendMsg);
    }
  };

  /* ── Render states ── */
  const renderContent = () => {
    switch (verificationStatus) {

      case "verifying":
        return (
          <>
            <div className="ve-icon-wrap cyan">
              <div className="ve-spinner" />
            </div>
            <h2 className="ve-title">Verifying your email...</h2>
            <p className="ve-sub">Please wait while we verify your email address.</p>
          </>
        );

      case "success":
        return (
          <>
            <div className="ve-icon-wrap green">
              <CheckCircle size={32} style={{ color: "#16a34a" }} />
            </div>
            <h2 className="ve-title">Email Verified!</h2>
            <p className="ve-sub">{message}</p>
            <div className="ve-divider" />
            <button className="ve-btn ve-btn-orange" onClick={() => navigate("/login")}>
              Continue to Login <ArrowRight size={15} />
            </button>
          </>
        );

      case "error":
        return (
          <>
            <div className="ve-icon-wrap red">
              <XCircle size={32} style={{ color: "var(--cr)" }} />
            </div>
            <h2 className="ve-title">Verification Failed</h2>
            {message && <div className="ve-msg red">{message}</div>}
            <div className="ve-divider" />
            <button
              className="ve-btn ve-btn-orange"
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
            >
              <Mail size={15} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Verification Email"}
            </button>
            <button className="ve-btn ve-btn-navy" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </>
        );

      case "pending":
        return (
          <>
            <div className="ve-icon-wrap cyan">
              <Mail size={32} style={{ color: "#F97316" }} />
            </div>
            <h2 className="ve-title">Check your email</h2>
            <p className="ve-sub" style={{ marginBottom: 8 }}>
              We've sent a verification link to
            </p>
            <p className="ve-email-display">{email}</p>

            {message && <div className="ve-msg green">{message}</div>}

            <div className="ve-divider" />

            <button
              className="ve-btn ve-btn-orange"
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
            >
              <Mail size={15} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Verification Email"}
            </button>
            <button className="ve-btn ve-btn-ghost" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`ve-root${dark ? " ve-dk" : ""}`}>

      {/* Header */}
      <header className="ve-header">
        <div className="ve-header-inner">
          <div className="ve-logo" onClick={() => navigate("/")}>
            <span className="ve-logo-name">
              <span className="ve-logo-ilm">ILM</span>
              <span className="ve-logo-ora"> ORA</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="ve-main">
        <div className="ve-card">
          <div className="ve-card-accent" />
          {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default VerifyEmail;