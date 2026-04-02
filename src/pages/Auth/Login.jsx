// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import auth from "../../auth";

// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// const TexoraLogin = () => {
//   const navigate = useNavigate();
//   const [email, setEmail]       = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading]   = useState(false);

//   /* ─── Role-based redirect (EXISTING users only) ─────────────────────────── */
//   const redirectByRole = (role) => {
//     switch ((role || "").toUpperCase()) {
//       case "ADMIN":    navigate("/admin",    { replace: true }); break;
//       case "TRAINER":  navigate("/trainer",  { replace: true }); break;
//       case "BUSINESS": navigate("/business", { replace: true }); break;
//       default:         navigate("/student",  { replace: true });
//     }
//   };

//   /* ─── Email / password login ─────────────────────────────────────────────── */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     try {
//       const ok = await auth.login({ email, password });
//       if (ok) {
//         const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         redirectByRole(role);           // ← role ke hisab se dashboard
//       } else {
//         alert("Login failed! Check your credentials.");
//       }
//     } catch (err) {
//       alert("Login error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ─── Google login ───────────────────────────────────────────────────────── */
//   const handleGoogleSuccess = async (res) => {
//     try {
//       localStorage.removeItem("lms_token");
//       localStorage.removeItem("lms_user");
//       localStorage.removeItem("role");

//       const dec  = jwtDecode(res.credential);
//       const resp = await auth.googleLogin({ idToken: res.credential });

//       if (resp?.isNewUser === true) {
//         /* NEW USER → /ilm-demo (public demo/landing) */
//         localStorage.setItem("role", "STUDENT");
//         localStorage.setItem("lms_user", JSON.stringify({
//           name:      dec.name,
//           email:     dec.email,
//           role:      "student",
//           isNewUser: true,
//         }));
//         navigate("/ilm-demo", { replace: true });

//       } else {
//         /* EXISTING USER → role-based dashboard */
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
//       /* Fallback → treat as new user, send to demo */
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

//   const chips = [
//     { label:"Product Design",    icon:"📦", c:"#F97316", x:"3%",  y:"15%", d:"0s",   t:"6.2s" },
//     { label:"UI/UX Design",      icon:"🎨", c:"#22c55e", x:"75%", y:"7%",  d:"1.1s", t:"7.4s" },
//     { label:"Growth Hacking",    icon:"📈", c:"#3b82f6", x:"85%", y:"32%", d:"2.3s", t:"5.8s" },
//     { label:"Digital Marketing", icon:"📣", c:"#a855f7", x:"80%", y:"62%", d:"0.6s", t:"8.1s" },
//     { label:"Finance",           icon:"💹", c:"#F97316", x:"70%", y:"82%", d:"1.7s", t:"6.6s" },
//     { label:"Data Analytics",    icon:"🔍", c:"#22c55e", x:"4%",  y:"72%", d:"2.5s", t:"7.8s" },
//     { label:"Leadership",        icon:"🏆", c:"#3b82f6", x:"1%",  y:"44%", d:"0.9s", t:"6.3s" },
//     { label:"Communication",     icon:"💬", c:"#a855f7", x:"20%", y:"90%", d:"1.9s", t:"8.6s" },
//     { label:"Design Systems",    icon:"✏️", c:"#F97316", x:"58%", y:"90%", d:"1.3s", t:"7.2s" },
//     { label:"Courses 300+",      icon:"📚", c:"#22c55e", x:"16%", y:"4%",  d:"0.4s", t:"6.9s" },
//   ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
//         *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
//         .pg { font-family:'DM Sans',sans-serif;min-height:100vh;background:#f5ece1;position:relative;overflow-x:hidden;display:flex;flex-direction:column; }
//         .pg::before { content:'';position:absolute;inset:0;z-index:0;background-image:radial-gradient(circle,rgba(180,100,30,0.08) 1px,transparent 1px);background-size:28px 28px;pointer-events:none; }
//         .blob { position:absolute;border-radius:50%;filter:blur(110px);pointer-events:none;z-index:0; }
//         .b1 { width:700px;height:700px;background:radial-gradient(circle,rgba(249,115,22,0.14),transparent 60%);top:-250px;left:-200px;animation:bp 10s ease-in-out infinite; }
//         .b2 { width:600px;height:600px;background:radial-gradient(circle,rgba(249,115,22,0.09),transparent 60%);bottom:-200px;right:-180px;animation:bp 13s ease-in-out infinite 4s; }
//         .b3 { width:400px;height:400px;background:radial-gradient(circle,rgba(34,197,94,0.07),transparent 60%);top:20%;right:10%;animation:bp 8s ease-in-out infinite 2s; }
//         .b4 { width:300px;height:300px;background:radial-gradient(circle,rgba(249,115,22,0.07),transparent 60%);bottom:20%;left:10%;animation:bp 9s ease-in-out infinite 1s; }
//         @keyframes bp { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.1)} }
//         .chip { position:absolute;z-index:1;pointer-events:none;display:none;align-items:center;gap:8px;padding:9px 18px;background:rgba(255,255,255,0.68);border-radius:999px;font-size:.74rem;font-weight:700;color:#2a1206;border:1px solid rgba(255,255,255,0.85);box-shadow:0 8px 28px rgba(160,80,20,0.11);backdrop-filter:blur(12px);white-space:nowrap;animation:cf var(--t) ease-in-out var(--d) infinite; }
//         @media(min-width:1024px){ .chip { display:inline-flex; } }
//         @keyframes cf { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
//         .cdot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
//         .nav { position:relative;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:20px 24px; }
//         @media(min-width:640px){ .nav { padding:24px 52px; } }
//         .nav-logo { font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:900;line-height:1;cursor:pointer;animation:sdn .6s ease both; }
//         @media(min-width:640px){ .nav-logo { font-size:1.9rem; } }
//         @keyframes sdn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
//         .nav-btn { position:relative;overflow:hidden;display:flex;align-items:center;gap:6px;padding:8px 16px;background:linear-gradient(135deg,#F97316,#ea580c);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(249,115,22,.35);transition:transform .2s,box-shadow .2s;animation:sdn .6s ease .1s both; }
//         @media(min-width:640px){ .nav-btn { padding:9px 22px;font-size:.82rem; } }
//         .nav-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.5); }
//         .nav-btn::after { content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transform:skewX(-20deg);transition:left .5s; }
//         .nav-btn:hover::after { left:130%; }
//         .center { position:relative;z-index:20;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 16px 40px;gap:20px;animation:fup .8s ease .1s both; }
//         @media(min-width:640px){ .center { padding:10px 24px 40px;gap:28px; } }
//         @keyframes fup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//         .hl { text-align:center;animation:fup .8s ease .15s both; }
//         .hl-badge { display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.6);border:1px solid rgba(249,115,22,0.22);border-radius:999px;padding:5px 14px;font-size:.65rem;font-weight:600;color:#b84010;margin-bottom:12px;backdrop-filter:blur(8px); }
//         @media(min-width:640px){ .hl-badge { font-size:.7rem;padding:5px 16px; } }
//         .hl-badge-dot { width:6px;height:6px;border-radius:50%;background:#F97316;animation:blink 1.5s ease-in-out infinite;flex-shrink:0; }
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
//         .hl-h1 { font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#1e0e02;line-height:1.05; }
//         @media(min-width:640px){ .hl-h1 { font-size:2.6rem; } }
//         .hl-h1 em { color:#F97316;font-style:italic; }
//         .hl-sub { font-size:.65rem;color:rgba(100,55,12,.42);letter-spacing:.2em;text-transform:uppercase;margin-top:8px; }
//         .stats { display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px;animation:fup .8s ease .3s both;width:100%;max-width:500px; }
//         @media(min-width:640px){ .stats { gap:14px;margin-top:18px;flex-wrap:nowrap; } }
//         .stat { display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.55);border:1px solid rgba(249,115,22,0.15);border-radius:14px;padding:9px 14px;backdrop-filter:blur(8px);box-shadow:0 2px 14px rgba(160,80,20,0.07);flex:1;min-width:90px; }
//         .stat-ico { font-size:1.1rem; }
//         .stat-n { font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:#1e0e02; }
//         .stat-l { font-size:.58rem;color:rgba(100,55,12,.5);font-weight:500;margin-top:1px; }
//         .fcard { width:100%;max-width:400px;background:rgba(255,255,255,0.75);border:1px solid rgba(249,115,22,0.16);border-radius:24px;padding:28px 20px;backdrop-filter:blur(24px);box-shadow:0 24px 70px rgba(160,80,20,0.13),0 2px 8px rgba(160,80,20,0.05);animation:fup .8s ease .05s both;position:relative;z-index:10; }
//         @media(min-width:640px){ .fcard { border-radius:28px;padding:36px 32px; } }
//         .ft { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#1e0e02;line-height:1.1;margin-bottom:4px; }
//         .fs { color:#a08060;font-size:.8rem;margin-bottom:14px; }
//         .ftr { display:flex;gap:14px;margin-bottom:16px; }
//         .fti { display:flex;align-items:center;gap:5px;font-size:.7rem;color:#b8a080; }
//         .ftd { width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block; }
//         .fgw { margin-bottom:14px; }
//         .fgw > div { width:100%!important; }
//         .fdiv { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
//         .fdl  { flex:1;height:1px;background:rgba(180,100,30,.13); }
//         .fdt  { font-size:.65rem;color:#c4a080;letter-spacing:.12em;white-space:nowrap; }
//         .ff { margin-bottom:12px; }
//         .ff label { display:block;font-size:.69rem;font-weight:700;color:#8a6040;margin-bottom:5px;letter-spacing:.07em;text-transform:uppercase; }
//         .ff input { width:100%;padding:11px 14px;background:rgba(255,255,255,0.75);border:1.5px solid rgba(180,120,60,.17);border-radius:12px;font-size:.875rem;color:#1a0e06;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s,background .2s; }
//         .ff input:focus { border-color:#F97316;box-shadow:0 0 0 3px rgba(249,115,22,.1);background:#fff; }
//         .ff input::placeholder { color:#c0a070; }
//         .ffgt { text-align:right;margin-bottom:14px;margin-top:-4px; }
//         .ffgt button { background:none;border:none;cursor:pointer;font-size:.76rem;color:#F97316;font-family:'DM Sans',sans-serif;font-weight:500; }
//         .ffgt button:hover { text-decoration:underline; }
//         .fbtn { width:100%;padding:13px;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.95rem;border:none;border-radius:12px;cursor:pointer;box-shadow:0 4px 20px rgba(249,115,22,.32);transition:opacity .2s,transform .15s;position:relative;overflow:hidden; }
//         .fbtn:hover:not(:disabled) { opacity:.91;transform:translateY(-1px); }
//         .fbtn:disabled { opacity:.55;cursor:not-allowed; }
//         .fsp { display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spx .7s linear infinite;margin-right:8px;vertical-align:middle; }
//         @keyframes spx { to{transform:rotate(360deg)} }
//         .fnew { text-align:center;margin-top:14px;font-size:.8rem;color:#b8a080; }
//         .fnew button { background:none;border:none;cursor:pointer;color:#F97316;font-weight:700;font-family:'DM Sans',sans-serif;font-size:.8rem; }
//         .fnew button:hover { text-decoration:underline; }
//         .ticker { position:relative;z-index:30;overflow:hidden;height:38px;background:rgba(249,115,22,.05);border-top:1px solid rgba(249,115,22,.1);display:flex;align-items:center; }
//         .ticker-in { display:flex;white-space:nowrap;animation:tick 26s linear infinite; }
//         @keyframes tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
//         .ti { font-size:.67rem;font-weight:600;color:rgba(120,65,15,.45);letter-spacing:.08em;padding:0 28px;text-transform:uppercase; }
//         .td { color:#F97316;margin:0 4px;font-size:.42rem;vertical-align:middle; }
//         .pgfoot { position:relative;z-index:30;text-align:center;font-size:.66rem;color:rgba(140,80,20,.3);padding:10px 0 14px; }
//       `}</style>

//       <div className="pg">
//         <div className="blob b1"/><div className="blob b2"/>
//         <div className="blob b3"/><div className="blob b4"/>

//         {chips.map((c, i) => (
//           <div key={i} className="chip" style={{ left:c.x, top:c.y, "--d":c.d, "--t":c.t }}>
//             <span>{c.icon}</span>
//             <span className="cdot" style={{background:c.c}}/>{c.label}
//           </div>
//         ))}

//         <nav className="nav">
//           <div className="nav-logo" onClick={() => navigate("/")}>
//             <span style={{color:"#22c55e"}}>ILM</span>
//             <span style={{color:"#F97316"}}> ORA</span>
//           </div>
//           <button className="nav-btn" onClick={() => navigate("/apply")}>🚀 Apply Now</button>
//         </nav>

//         <div className="center">
//           <div className="hl">
//             <div className="hl-badge"><span className="hl-badge-dot"/>Advanced Learning Platform for Modern Professionals</div>
//             <h1 className="hl-h1">Become the <em>Top 1%</em></h1>
//             <p className="hl-sub">Knowledge · Growth · Excellence</p>
//           </div>

//           <div className="stats">
//             <div className="stat"><span className="stat-ico">🎓</span><div><div className="stat-n">12K+</div><div className="stat-l">Students</div></div></div>
//             <div className="stat"><span className="stat-ico">👨‍🏫</span><div><div className="stat-n">500+</div><div className="stat-l">Trainers</div></div></div>
//             <div className="stat"><span className="stat-ico">📚</span><div><div className="stat-n">300+</div><div className="stat-l">Courses</div></div></div>
//           </div>

//           <div className="fcard">
//             <h1 className="ft">Welcome back</h1>
//             <p className="fs">Sign in to continue your journey</p>
//             <div className="ftr">
//               <span className="fti"><span className="ftd"/>Secure Login</span>
//               <span className="fti"><span className="ftd" style={{background:"#F97316"}}/>12K+ Members</span>
//             </div>
//             <div className="fgw">
//               <GoogleLogin
//                 onSuccess={handleGoogleSuccess} onError={handleGoogleError}
//                 theme="outline" size="large" text="signin_with"
//                 shape="rectangular" width="336"
//                 auto_select={false} cancel_on_tap_outside={true}
//               />
//             </div>
//             <div className="fdiv">
//               <div className="fdl"/><span className="fdt">OR CONTINUE WITH EMAIL</span><div className="fdl"/>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="ff">
//                 <label>Email Address</label>
//                 <input type="email" placeholder="you@example.com"
//                   value={email} onChange={e => setEmail(e.target.value)} required disabled={loading}/>
//               </div>
//               <div className="ff">
//                 <label>Password</label>
//                 <input type="password" placeholder="Enter your password"
//                   value={password} onChange={e => setPassword(e.target.value)} required disabled={loading}/>
//               </div>
//               <div className="ffgt">
//                 <button type="button" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
//               </div>
//               <button type="submit" className="fbtn" disabled={loading}>
//                 {loading ? <><span className="fsp"/>Signing in…</> : "Sign In →"}
//               </button>
//             </form>
//             <div className="fnew">
//               New here? <button onClick={() => navigate("/apply")}>Apply for access</button>
//             </div>
//           </div>
//         </div>

//         <div className="ticker">
//           <div className="ticker-in">
//             {[...Array(2)].map((_,i) => (
//               <React.Fragment key={i}>
//                 {["Product Design","UI/UX","Growth Hacking","Digital Marketing","Finance","Data Analytics","Leadership","Communication"].map(t => (
//                   <span key={t} className="ti"><span className="td">●</span>{t}</span>
//                 ))}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//         <div className="pgfoot">© 2026 ILM ORA · All rights reserved</div>
//       </div>
//     </>
//   );
// };

// export default function Login() {
//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <TexoraLogin/>
//     </GoogleOAuthProvider>
//   );
// } old





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const TexoraLogin = () => {
  const navigate = useNavigate();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ─── Role-based redirect ────────────────────────── */
  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "ADMIN":    navigate("/admin",    { replace: true }); break;
      case "TRAINER":  navigate("/trainer",  { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default:         navigate("/student",  { replace: true });
    }
  };

  /* ─── Email / password login ─────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const ok = await auth.login({ email, password });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
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

  /* ─── Google login ───────────────────────────────── */
  const handleGoogleSuccess = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec  = jwtDecode(res.credential);
      const resp = await auth.googleLogin({ idToken: res.credential });

      if (resp?.isNewUser === true) {
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name:      dec.name,
          email:     dec.email,
          role:      "student",
          isNewUser: true,
        }));
        navigate("/ilm-demo", { replace: true });
      } else {
        const role = (resp?.role || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        localStorage.setItem("lms_user", JSON.stringify({
          name:  dec.name,
          email: dec.email,
          role:  role.toLowerCase(),
        }));
        redirectByRole(role);
      }
    } catch (err) {
      console.error("Google login error:", err);
      try {
        const dec = jwtDecode(res.credential);
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name:      dec.name,
          email:     dec.email,
          role:      "student",
          isNewUser: true,
        }));
        navigate("/ilm-demo", { replace: true });
      } catch (_) {
        alert("Google login failed. Please try again.");
      }
    }
  };

  const handleGoogleError = () => console.error("Google OAuth failed");

  /* ─── SVG Icons ──────────────────────────────────── */
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

  /* ══════════════════════════════════════════════════ */
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

        /* ── LOGO ── */
        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin-bottom: 6px;
          cursor: pointer;
        }
        .logo-ilm {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 900;
          color: #16a34a;
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .logo-ora {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 900;
          color: #F97316;
          line-height: 1;
          letter-spacing: -0.01em;
          margin-left: 10px;
        }

        /* ── HEADING ── */
        .heading { text-align: center; }
        .heading h2 {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e0e02;
          margin-bottom: 6px;
        }
        .heading p { font-size: 0.84rem; color: #8a6040; }
        .heading p button {
          background: none; border: none; cursor: pointer;
          color: #F97316;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem; font-weight: 700; padding: 0;
        }
        .heading p button:hover { text-decoration: underline; }

        /* ── FORM BOX ── */
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

        /* ── GOOGLE ── */
        .google-wrap {
          width: 100%;
          margin-bottom: 14px;
          display: flex;
          justify-content: center;
        }
        .google-wrap > div,
        .google-wrap iframe,
        .google-wrap > div > div {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* ── OR divider ── */
        .or-div {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .or-line { flex: 1; height: 1px; background: rgba(180,100,30,0.15); }
        .or-text  { font-size: 0.7rem; color: #b8906a; letter-spacing: 0.1em; text-transform: uppercase; }

        /* ── FIELDS ── */
        .field { margin-bottom: 12px; }
        .field label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #8a6040;
          margin-bottom: 5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .field input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid rgba(180,120,60,0.2);
          border-radius: 10px;
          color: #1a0e06;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field input::placeholder { color: #c0a070; }
        .field input:focus {
          border-color: #F97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
          background: #fff;
        }
        .field input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── PASSWORD WRAPPER ── */
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 44px; }
        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #b8906a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
          line-height: 1;
        }
        .eye-btn:hover { color: #F97316; }

        /* ── SUBMIT ── */
        .sub-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #F97316, #ea580c);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 18px rgba(249,115,22,0.32);
          margin-top: 2px;
        }
        .sub-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .sub-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── FORGOT ── */
        .forgot-row { text-align: right; margin: 6px 0 14px; }
        .forgot-row button {
          background: none; border: none; cursor: pointer;
          color: #F97316;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; font-weight: 500;
        }
        .forgot-row button:hover { text-decoration: underline; }

        /* ── BACK ── */
        .back-link {
          text-align: center;
          font-size: 0.78rem;
          color: #b8906a;
          margin-top: 16px;
        }
        .back-link button {
          background: none; border: none; cursor: pointer;
          color: #b8906a;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
        }
        .back-link button:hover { color: #8a6040; }
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
              <button onClick={() => navigate("/complete-profile")}>Apply now</button>
            </p>
          </div>

          {/* Form box */}
          <div className="form-box" style={{ width: "100%" }}>

            {/* Google Login */}
            <div className="google-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="372"
                auto_select={false}
                cancel_on_tap_outside={true}
              />
            </div>

            {/* OR divider */}
            <div className="or-div">
              <div className="or-line" />
              <span className="or-text">OR</span>
              <div className="or-line" />
            </div>

            {/* Email / Password form */}
            <form onSubmit={handleSubmit}>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pw-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
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