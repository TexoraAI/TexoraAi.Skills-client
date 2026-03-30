// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import auth from "../../auth";

// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// const TexoraLogin = () => {
//   const navigate = useNavigate();
//   const [email, setEmail]         = useState("");
//   const [password, setPassword]   = useState("");
//   const [loading, setLoading]     = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [countdown, setCountdown] = useState(5);
//   const newUserRef = useRef(null);

//   // ─── Countdown auto-redirect for NEW users ───────────────────────────────
//   useEffect(() => {
//     if (!showPopup) return;
//     setCountdown(5);
//     const iv = setInterval(() => {
//       setCountdown(c => {
//         if (c <= 1) {
//           clearInterval(iv);
//           const d = newUserRef.current;
//           if (d) {
//             setShowPopup(false);
//             navigate("/apply", {
//               state: { name: d.name, email: d.email, isGoogleUser: true },
//             });
//           }
//           return 0;
//         }
//         return c - 1;
//       });
//     }, 1000);
//     return () => clearInterval(iv);
//   }, [showPopup]);

//   // ─── Role-based dashboard redirect (only for EXISTING users) ─────────────
//   const redirectByRole = r => {
//     switch (r.toUpperCase()) {
//       case "ADMIN":    navigate("/admin",    { replace: true }); break;
//       case "TRAINER":  navigate("/trainer",  { replace: true }); break;
//       case "BUSINESS": navigate("/business", { replace: true }); break;
//       default:         navigate("/student",  { replace: true });
//     }
//   };

//   // ─── Email / password login ───────────────────────────────────────────────
//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     try {
//       const ok = await auth.login({ email, password });
//       if (ok) {
//         const r = auth.getCurrentRole().toUpperCase();
//         localStorage.setItem("role", r);
//         navigate("/ilm-demo", { replace: true });
//       } else {
//         alert("Login failed! Check your credentials.");
//       }
//     } catch (err) {
//       alert("Login error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Google login ─────────────────────────────────────────────────────────
//   const handleGoogleSuccess = async res => {
//     try {
//       localStorage.removeItem("lms_token");
//       localStorage.removeItem("lms_user");
//       localStorage.removeItem("role");

//       const dec  = jwtDecode(res.credential);
//       const resp = await auth.googleLogin({ idToken: res.credential });

//       if (resp?.isNewUser === true) {
//         // New user → seedha IlmOraDemoPage, wahan se apply karenge
//         localStorage.setItem("role", "STUDENT");
//         localStorage.setItem("lms_user", JSON.stringify({
//           name: dec.name,
//           email: dec.email,
//           role: "student",
//         }));
//         navigate("/ilm-demo", { replace: true });
//       } else {
//         // ✅ USER EXISTS → go to ILM demo page
//         const r = (resp?.role || "STUDENT").toUpperCase();
//         localStorage.setItem("role", r);
//         navigate("/ilm-demo", { replace: true }); // ← ONLY THIS LINE CHANGED
//       }
//     } catch (err) {
//       console.error(err);
//       try {
//         const dec = jwtDecode(res.credential);
//         localStorage.setItem("role", "STUDENT");
//         localStorage.setItem("lms_user", JSON.stringify({
//           name: dec.name,
//           email: dec.email,
//           role: "student",
//         }));
//         navigate("/ilm-demo", { replace: true });
//       } catch (_) {
//         alert("Google login failed. Please try again.");
//       }
//     }
//   };

//   const handleGoogleError = () => {
//     console.error("Google OAuth failed");
//   };

//   const handleFillForm = () => {
//     const d = newUserRef.current;
//     setShowPopup(false);
//     navigate("/apply", {
//       state: { name: d?.name, email: d?.email, isGoogleUser: true },
//     });
//   };

//   const handleSkip = () => {
//     setShowPopup(false);
//     newUserRef.current = null;
//     localStorage.removeItem("lms_token");
//     localStorage.removeItem("lms_user");
//     localStorage.removeItem("role");
//   };

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

//         .pg { font-family:'DM Sans',sans-serif; min-height:100vh; background:#f5ece1; position:relative; overflow-x:hidden; display:flex; flex-direction:column; }
//         .pg::before { content:''; position:absolute; inset:0; z-index:0; background-image:radial-gradient(circle,rgba(180,100,30,0.08) 1px,transparent 1px); background-size:28px 28px; pointer-events:none; }

//         .blob { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; }
//         .b1 { width:700px;height:700px; background:radial-gradient(circle,rgba(249,115,22,0.14),transparent 60%); top:-250px;left:-200px; animation:bp 10s ease-in-out infinite; }
//         .b2 { width:600px;height:600px; background:radial-gradient(circle,rgba(249,115,22,0.09),transparent 60%); bottom:-200px;right:-180px; animation:bp 13s ease-in-out infinite 4s; }
//         .b3 { width:400px;height:400px; background:radial-gradient(circle,rgba(34,197,94,0.07),transparent 60%); top:20%;right:10%; animation:bp 8s ease-in-out infinite 2s; }
//         .b4 { width:300px;height:300px; background:radial-gradient(circle,rgba(249,115,22,0.07),transparent 60%); bottom:20%;left:10%; animation:bp 9s ease-in-out infinite 1s; }
//         @keyframes bp { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.1)} }

//         .chip { position:absolute; z-index:1; pointer-events:none; display:none; align-items:center; gap:8px; padding:9px 18px; background:rgba(255,255,255,0.68); border-radius:999px; font-size:.74rem; font-weight:700; color:#2a1206; border:1px solid rgba(255,255,255,0.85); box-shadow:0 8px 28px rgba(160,80,20,0.11); backdrop-filter:blur(12px); white-space:nowrap; animation:cf var(--t) ease-in-out var(--d) infinite; }
//         @media (min-width:1024px) { .chip { display:inline-flex; } }
//         @keyframes cf { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
//         .cdot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }

//         .nav { position:relative; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:20px 24px; }
//         @media (min-width:640px) { .nav { padding:24px 52px; } }
//         .nav-logo { font-family:'Playfair Display',serif; font-size:1.7rem;font-weight:900;line-height:1;cursor:pointer; animation:sdn .6s ease both; }
//         @media (min-width:640px) { .nav-logo { font-size:1.9rem; } }
//         @keyframes sdn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }

//         .nav-btn { position:relative;overflow:hidden; display:flex;align-items:center;gap:6px;padding:8px 16px; background:linear-gradient(135deg,#F97316,#ea580c); border:none;border-radius:10px;color:#fff; font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:700; cursor:pointer;box-shadow:0 4px 18px rgba(249,115,22,.35); transition:transform .2s,box-shadow .2s; animation:sdn .6s ease .1s both; }
//         @media (min-width:640px) { .nav-btn { padding:9px 22px; font-size:.82rem; } }
//         .nav-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.5); }
//         .nav-btn::after { content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transform:skewX(-20deg);transition:left .5s; }
//         .nav-btn:hover::after { left:130%; }

//         .center { position:relative; z-index:20; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px 16px 40px; gap:20px; animation:fup .8s ease .1s both; }
//         @media (min-width:640px) { .center { padding:10px 24px 40px; gap:28px; } }
//         @keyframes fup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

//         .hl { text-align:center; animation:fup .8s ease .15s both; }
//         .hl-badge { display:inline-flex;align-items:center;gap:7px; background:rgba(255,255,255,0.6); border:1px solid rgba(249,115,22,0.22); border-radius:999px;padding:5px 14px; font-size:.65rem;font-weight:600;color:#b84010; margin-bottom:12px;backdrop-filter:blur(8px); }
//         @media (min-width:640px) { .hl-badge { font-size:.7rem; padding:5px 16px; } }
//         .hl-badge-dot { width:6px;height:6px;border-radius:50%;background:#F97316;animation:blink 1.5s ease-in-out infinite;flex-shrink:0; }
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
//         .hl-h1 { font-family:'Playfair Display',serif; font-size:2rem;font-weight:900;color:#1e0e02;line-height:1.05; }
//         @media (min-width:640px) { .hl-h1 { font-size:2.6rem; } }
//         .hl-h1 em { color:#F97316;font-style:italic; }
//         .hl-sub { font-size:.65rem;color:rgba(100,55,12,.42);letter-spacing:.2em;text-transform:uppercase;margin-top:8px; }

//         .stats { display:flex;gap:10px;justify-content:center;flex-wrap:wrap; margin-top:10px;animation:fup .8s ease .3s both; width:100%;max-width:500px; }
//         @media (min-width:640px) { .stats { gap:14px; margin-top:18px; flex-wrap:nowrap; } }
//         .stat { display:flex;align-items:center;gap:8px; background:rgba(255,255,255,0.55); border:1px solid rgba(249,115,22,0.15); border-radius:14px;padding:9px 14px; backdrop-filter:blur(8px); box-shadow:0 2px 14px rgba(160,80,20,0.07); flex:1;min-width:90px; }
//         .stat-ico { font-size:1.1rem; }
//         .stat-n { font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:#1e0e02; }
//         .stat-l { font-size:.58rem;color:rgba(100,55,12,.5);font-weight:500;margin-top:1px; }

//         .fcard { width:100%;max-width:400px; background:rgba(255,255,255,0.75); border:1px solid rgba(249,115,22,0.16); border-radius:24px;padding:28px 20px; backdrop-filter:blur(24px); box-shadow:0 24px 70px rgba(160,80,20,0.13), 0 2px 8px rgba(160,80,20,0.05); animation:fup .8s ease .05s both; position:relative; z-index:10; }
//         @media (min-width:640px) { .fcard { border-radius:28px; padding:36px 32px; } }
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
//         .ff input { width:100%;padding:11px 14px; background:rgba(255,255,255,0.75); border:1.5px solid rgba(180,120,60,.17); border-radius:12px;font-size:.875rem;color:#1a0e06; font-family:'DM Sans',sans-serif;outline:none; transition:border-color .2s,box-shadow .2s,background .2s; }
//         .ff input:focus { border-color:#F97316;box-shadow:0 0 0 3px rgba(249,115,22,.1);background:#fff; }
//         .ff input::placeholder { color:#c0a070; }
//         .ffgt { text-align:right;margin-bottom:14px;margin-top:-4px; }
//         .ffgt button { background:none;border:none;cursor:pointer;font-size:.76rem;color:#F97316;font-family:'DM Sans',sans-serif;font-weight:500; }
//         .ffgt button:hover { text-decoration:underline; }
//         .fbtn { width:100%;padding:13px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff;font-family:'DM Sans',sans-serif; font-weight:700;font-size:.95rem;border:none;border-radius:12px; cursor:pointer;box-shadow:0 4px 20px rgba(249,115,22,.32); transition:opacity .2s,transform .15s;position:relative;overflow:hidden; }
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

//         .pu-page {
//           position: fixed; inset: 0; z-index: 9999;
//           display: flex; align-items: center; justify-content: center;
//           background: #f5ece1;
//           overflow: hidden;
//           animation: pgIn .35s ease both;
//         }
//         @keyframes pgIn { from{opacity:0} to{opacity:1} }

//         .pu-page::before {
//           content:''; position:absolute; inset:0; z-index:0;
//           background-image:radial-gradient(circle,rgba(180,100,30,0.09) 1px,transparent 1px);
//           background-size:28px 28px; pointer-events:none;
//         }

//         .pu-blob1 { position:absolute;width:700px;height:700px;border-radius:50%;filter:blur(120px);background:radial-gradient(circle,rgba(249,115,22,0.18),transparent 65%);top:-250px;left:-200px;animation:bp 10s ease-in-out infinite;pointer-events:none; }
//         .pu-blob2 { position:absolute;width:600px;height:600px;border-radius:50%;filter:blur(110px);background:radial-gradient(circle,rgba(249,115,22,0.12),transparent 65%);bottom:-200px;right:-180px;animation:bp 13s ease-in-out infinite 4s;pointer-events:none; }
//         .pu-blob3 { position:absolute;width:350px;height:350px;border-radius:50%;filter:blur(90px);background:radial-gradient(circle,rgba(34,197,94,0.09),transparent 65%);top:15%;right:8%;animation:bp 8s ease-in-out infinite 2s;pointer-events:none; }

//         .pu-card {
//           position: relative; z-index: 10;
//           width: 100%; max-width: 520px;
//           margin: 0 16px;
//           background: rgba(255,255,255,0.84);
//           border: 1px solid rgba(249,115,22,0.18);
//           border-radius: 32px;
//           padding: 48px 36px 36px;
//           backdrop-filter: blur(32px);
//           box-shadow:
//             0 40px 100px rgba(160,80,20,0.18),
//             0 4px 16px rgba(160,80,20,0.06),
//             inset 0 1px 0 rgba(255,255,255,0.95);
//           animation: cardPop .5s cubic-bezier(.34,1.56,.64,1) both;
//           text-align: center;
//         }
//         @media (max-width:560px) { .pu-card { padding:36px 20px 28px; border-radius:24px; } }
//         @keyframes cardPop { from{opacity:0;transform:scale(.82) translateY(40px)} to{opacity:1;transform:scale(1) translateY(0)} }

//         .pu-close { position:absolute;top:16px;right:16px; width:34px;height:34px;border-radius:50%; background:#fff0ed;border:none;cursor:pointer; display:flex;align-items:center;justify-content:center; font-size:.8rem;color:#c0503a; box-shadow:0 2px 10px rgba(200,80,50,.12); transition:background .2s,transform .15s; }
//         .pu-close:hover { background:#fdd8d2; transform:scale(1.08); }

//         .pu-icon-wrap { position:relative; display:inline-flex;align-items:center;justify-content:center; width:90px;height:90px;margin-bottom:20px; }
//         .pu-ring  { position:absolute;inset:0;border-radius:50%; border:2.5px solid rgba(249,115,22,0.28); animation:rp 2s ease-in-out infinite; }
//         .pu-ring2 { position:absolute;inset:-12px;border-radius:50%; border:2px solid rgba(249,115,22,0.13); animation:rp 2s ease-in-out infinite .6s; }
//         @keyframes rp { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.14);opacity:.35} }
//         .pu-emoji { font-size:3.2rem; animation:wv 1.4s ease-in-out infinite; display:block; filter:drop-shadow(0 4px 14px rgba(249,115,22,.28)); }
//         @keyframes wv { 0%,100%{transform:rotate(-4deg) scale(1)} 50%{transform:rotate(13deg) scale(1.1)} }

//         .pu-title { font-family:'Playfair Display',serif; font-size:2rem;font-weight:900;color:#1e0e02; line-height:1.1;margin-bottom:8px; }
//         .pu-title em { color:#F97316;font-style:italic; }
//         @media (max-width:480px) { .pu-title { font-size:1.6rem; } }

//         .pu-sub { font-size:.9rem;color:#a08060;line-height:1.65; margin-bottom:20px; }
//         .pu-sub .hi { color:#F97316;font-weight:700; }
//         .pu-sub .bd { color:#c0503a;font-weight:700; }

//         .pu-banner { display:flex;align-items:center;gap:12px; background:linear-gradient(135deg,#fff5f0,#fff0e8); border:1.5px solid rgba(249,115,22,0.24); border-radius:16px;padding:14px 18px; margin-bottom:18px;text-align:left; }
//         .pu-banner-ico { font-size:1.4rem;flex-shrink:0; }
//         .pu-banner-txt { font-size:.83rem;color:#7a4020;line-height:1.5; }
//         .pu-banner-txt strong { color:#c0503a; }

//         .pu-steps { display:flex;flex-direction:column;gap:11px; background:rgba(255,248,240,0.7); border:1px solid rgba(249,115,22,0.14); border-radius:18px;padding:18px; margin-bottom:22px;text-align:left; }
//         .pu-step { display:flex;align-items:flex-start;gap:12px; font-size:.85rem;color:#6a5040;line-height:1.55; }
//         .pu-step-n { min-width:26px;height:26px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff;border-radius:50%; display:flex;align-items:center;justify-content:center; font-size:.68rem;font-weight:800; box-shadow:0 3px 10px rgba(249,115,22,.3); flex-shrink:0;margin-top:1px; }

//         .pu-timer { display:flex;align-items:center;justify-content:center;gap:16px; margin-bottom:24px; }
//         .pu-ring-wrap { position:relative;width:54px;height:54px;flex-shrink:0; }
//         .pu-ring-wrap svg { transform:rotate(-90deg); }
//         .pu-rbg  { fill:none;stroke:#fde8d0;stroke-width:4.5; }
//         .pu-rarc { fill:none;stroke:#F97316;stroke-width:4.5;stroke-linecap:round;stroke-dasharray:132;transition:stroke-dashoffset 1s linear; }
//         .pu-rnum { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; font-size:1.05rem;font-weight:800;color:#F97316; }
//         .pu-timer-txt .big { font-size:.94rem;font-weight:700;color:#3a2010; }
//         .pu-timer-txt .sm  { font-size:.76rem;color:#a08060;margin-top:3px; }
//         .pu-timer-txt .sm span { color:#F97316;font-weight:700; }

//         .pu-cta { width:100%;padding:15px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff;border:none;border-radius:14px; font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700; cursor:pointer; box-shadow:0 8px 28px rgba(249,115,22,.38); transition:transform .2s,box-shadow .2s; position:relative;overflow:hidden; margin-bottom:12px; }
//         .pu-cta:hover { transform:translateY(-2px);box-shadow:0 14px 36px rgba(249,115,22,.5); }
//         .pu-cta::after { content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transform:skewX(-20deg);transition:left .5s; }
//         .pu-cta:hover::after { left:130%; }

//         .pu-skip { background:none;border:none;cursor:pointer; font-size:.78rem;color:#b8a898; font-family:'DM Sans',sans-serif; text-decoration:underline; transition:color .2s; }
//         .pu-skip:hover { color:#8a7060; }
//       `}</style>

//       <div className="pg">
//         <div className="blob b1"/>
//         <div className="blob b2"/>
//         <div className="blob b3"/>
//         <div className="blob b4"/>

//         {chips.map((c, i) => (
//           <div key={i} className="chip"
//             style={{ left:c.x, top:c.y, "--d":c.d, "--t":c.t }}>
//             <span>{c.icon}</span>
//             <span className="cdot" style={{background:c.c}}/>
//             {c.label}
//           </div>
//         ))}

//         {/* NAV */}
//         <nav className="nav">
//           <div className="nav-logo" onClick={() => navigate("/")}>
//             <span style={{color:"#22c55e"}}>ILM</span>
//             <span style={{color:"#F97316"}}> ORA</span>
//           </div>
//           <button className="nav-btn" onClick={() => navigate("/apply")}>🚀 Apply Now</button>
//         </nav>

//         {/* CENTER */}
//         <div className="center">
//           <div className="hl">
//             <div className="hl-badge">
//               <span className="hl-badge-dot"/>
//               Advanced Learning Platform for Modern Professionals
//             </div>
//             <h1 className="hl-h1">Become the <em>Top 1%</em></h1>
//             <p className="hl-sub">Knowledge · Growth · Excellence</p>
//           </div>

//           <div className="stats">
//             <div className="stat">
//               <span className="stat-ico">🎓</span>
//               <div><div className="stat-n">12K+</div><div className="stat-l">Students</div></div>
//             </div>
//             <div className="stat">
//               <span className="stat-ico">👨‍🏫</span>
//               <div><div className="stat-n">500+</div><div className="stat-l">Trainers</div></div>
//             </div>
//             <div className="stat">
//               <span className="stat-ico">📚</span>
//               <div><div className="stat-n">300+</div><div className="stat-l">Courses</div></div>
//             </div>
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
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleError}
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
//                   value={email} onChange={e => setEmail(e.target.value)}
//                   required disabled={loading}/>
//               </div>
//               <div className="ff">
//                 <label>Password</label>
//                 <input type="password" placeholder="Enter your password"
//                   value={password} onChange={e => setPassword(e.target.value)}
//                   required disabled={loading}/>
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

//       {showPopup && (
//         <div className="pu-page">
//           <div className="pu-blob1"/>
//           <div className="pu-blob2"/>
//           <div className="pu-blob3"/>

//           <div className="pu-card">
//             <button className="pu-close" onClick={handleSkip} title="Back to login">✕</button>

//             <div className="pu-icon-wrap">
//               <div className="pu-ring"/>
//               <div className="pu-ring2"/>
//               <span className="pu-emoji">👋</span>
//             </div>

//             <h2 className="pu-title">Almost <em>There!</em></h2>

//             <p className="pu-sub">
//               Hey <span className="hi">{newUserRef.current?.name?.split(" ")[0] || "there"}</span>!
//               Your Google account is <span className="bd">not registered</span> in our system yet.
//             </p>

//             <div className="pu-banner">
//               <span className="pu-banner-ico">🚫</span>
//               <div className="pu-banner-txt">
//                 <strong>Dashboard access is blocked</strong> until your application
//                 is submitted and approved by an admin.
//               </div>
//             </div>

//             <div className="pu-steps">
//               <div className="pu-step">
//                 <div className="pu-step-n">1</div>
//                 <span>Fill in your personal &amp; educational details in the Apply form</span>
//               </div>
//               <div className="pu-step">
//                 <div className="pu-step-n">2</div>
//                 <span>Submit — our admin team will review your application</span>
//               </div>
//               <div className="pu-step">
//                 <div className="pu-step-n">3</div>
//                 <span>After approval your full dashboard unlocks 🎉</span>
//               </div>
//             </div>

//             <div className="pu-timer">
//               <div className="pu-ring-wrap">
//                 <svg width="54" height="54" viewBox="0 0 54 54">
//                   <circle className="pu-rbg"  cx="27" cy="27" r="21"/>
//                   <circle className="pu-rarc" cx="27" cy="27" r="21"
//                     style={{ strokeDashoffset: 132 - (132 * countdown / 5) }}/>
//                 </svg>
//                 <div className="pu-rnum">{countdown}</div>
//               </div>
//               <div className="pu-timer-txt">
//                 <div className="big">Redirecting to Apply form…</div>
//                 <div className="sm">Auto-redirect <span>in {countdown}s</span></div>
//               </div>
//             </div>

//             <button className="pu-cta" onClick={handleFillForm}>
//               📄 Fill Application Now →
//             </button>
//             <br/>
//             <button className="pu-skip" onClick={handleSkip}>
//               Stay on login page
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default function Login() {
//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <TexoraLogin/>
//     </GoogleOAuthProvider>
//   );
// }



























import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const TexoraLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  /* ─── Role-based redirect (EXISTING users only) ─────────────────────────── */
  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "ADMIN":    navigate("/admin",    { replace: true }); break;
      case "TRAINER":  navigate("/trainer",  { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default:         navigate("/student",  { replace: true });
    }
  };

  /* ─── Email / password login ─────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const ok = await auth.login({ email, password });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        redirectByRole(role);           // ← role ke hisab se dashboard
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Google login ───────────────────────────────────────────────────────── */
  const handleGoogleSuccess = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec  = jwtDecode(res.credential);
      const resp = await auth.googleLogin({ idToken: res.credential });

      if (resp?.isNewUser === true) {
        /* NEW USER → /ilm-demo (public demo/landing) */
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name:      dec.name,
          email:     dec.email,
          role:      "student",
          isNewUser: true,
        }));
        navigate("/ilm-demo", { replace: true });

      } else {
        /* EXISTING USER → role-based dashboard */
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
      /* Fallback → treat as new user, send to demo */
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

  const chips = [
    { label:"Product Design",    icon:"📦", c:"#F97316", x:"3%",  y:"15%", d:"0s",   t:"6.2s" },
    { label:"UI/UX Design",      icon:"🎨", c:"#22c55e", x:"75%", y:"7%",  d:"1.1s", t:"7.4s" },
    { label:"Growth Hacking",    icon:"📈", c:"#3b82f6", x:"85%", y:"32%", d:"2.3s", t:"5.8s" },
    { label:"Digital Marketing", icon:"📣", c:"#a855f7", x:"80%", y:"62%", d:"0.6s", t:"8.1s" },
    { label:"Finance",           icon:"💹", c:"#F97316", x:"70%", y:"82%", d:"1.7s", t:"6.6s" },
    { label:"Data Analytics",    icon:"🔍", c:"#22c55e", x:"4%",  y:"72%", d:"2.5s", t:"7.8s" },
    { label:"Leadership",        icon:"🏆", c:"#3b82f6", x:"1%",  y:"44%", d:"0.9s", t:"6.3s" },
    { label:"Communication",     icon:"💬", c:"#a855f7", x:"20%", y:"90%", d:"1.9s", t:"8.6s" },
    { label:"Design Systems",    icon:"✏️", c:"#F97316", x:"58%", y:"90%", d:"1.3s", t:"7.2s" },
    { label:"Courses 300+",      icon:"📚", c:"#22c55e", x:"16%", y:"4%",  d:"0.4s", t:"6.9s" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        .pg { font-family:'DM Sans',sans-serif;min-height:100vh;background:#f5ece1;position:relative;overflow-x:hidden;display:flex;flex-direction:column; }
        .pg::before { content:'';position:absolute;inset:0;z-index:0;background-image:radial-gradient(circle,rgba(180,100,30,0.08) 1px,transparent 1px);background-size:28px 28px;pointer-events:none; }
        .blob { position:absolute;border-radius:50%;filter:blur(110px);pointer-events:none;z-index:0; }
        .b1 { width:700px;height:700px;background:radial-gradient(circle,rgba(249,115,22,0.14),transparent 60%);top:-250px;left:-200px;animation:bp 10s ease-in-out infinite; }
        .b2 { width:600px;height:600px;background:radial-gradient(circle,rgba(249,115,22,0.09),transparent 60%);bottom:-200px;right:-180px;animation:bp 13s ease-in-out infinite 4s; }
        .b3 { width:400px;height:400px;background:radial-gradient(circle,rgba(34,197,94,0.07),transparent 60%);top:20%;right:10%;animation:bp 8s ease-in-out infinite 2s; }
        .b4 { width:300px;height:300px;background:radial-gradient(circle,rgba(249,115,22,0.07),transparent 60%);bottom:20%;left:10%;animation:bp 9s ease-in-out infinite 1s; }
        @keyframes bp { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.1)} }
        .chip { position:absolute;z-index:1;pointer-events:none;display:none;align-items:center;gap:8px;padding:9px 18px;background:rgba(255,255,255,0.68);border-radius:999px;font-size:.74rem;font-weight:700;color:#2a1206;border:1px solid rgba(255,255,255,0.85);box-shadow:0 8px 28px rgba(160,80,20,0.11);backdrop-filter:blur(12px);white-space:nowrap;animation:cf var(--t) ease-in-out var(--d) infinite; }
        @media(min-width:1024px){ .chip { display:inline-flex; } }
        @keyframes cf { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .cdot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
        .nav { position:relative;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:20px 24px; }
        @media(min-width:640px){ .nav { padding:24px 52px; } }
        .nav-logo { font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:900;line-height:1;cursor:pointer;animation:sdn .6s ease both; }
        @media(min-width:640px){ .nav-logo { font-size:1.9rem; } }
        @keyframes sdn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        .nav-btn { position:relative;overflow:hidden;display:flex;align-items:center;gap:6px;padding:8px 16px;background:linear-gradient(135deg,#F97316,#ea580c);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(249,115,22,.35);transition:transform .2s,box-shadow .2s;animation:sdn .6s ease .1s both; }
        @media(min-width:640px){ .nav-btn { padding:9px 22px;font-size:.82rem; } }
        .nav-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.5); }
        .nav-btn::after { content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transform:skewX(-20deg);transition:left .5s; }
        .nav-btn:hover::after { left:130%; }
        .center { position:relative;z-index:20;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 16px 40px;gap:20px;animation:fup .8s ease .1s both; }
        @media(min-width:640px){ .center { padding:10px 24px 40px;gap:28px; } }
        @keyframes fup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hl { text-align:center;animation:fup .8s ease .15s both; }
        .hl-badge { display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.6);border:1px solid rgba(249,115,22,0.22);border-radius:999px;padding:5px 14px;font-size:.65rem;font-weight:600;color:#b84010;margin-bottom:12px;backdrop-filter:blur(8px); }
        @media(min-width:640px){ .hl-badge { font-size:.7rem;padding:5px 16px; } }
        .hl-badge-dot { width:6px;height:6px;border-radius:50%;background:#F97316;animation:blink 1.5s ease-in-out infinite;flex-shrink:0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        .hl-h1 { font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#1e0e02;line-height:1.05; }
        @media(min-width:640px){ .hl-h1 { font-size:2.6rem; } }
        .hl-h1 em { color:#F97316;font-style:italic; }
        .hl-sub { font-size:.65rem;color:rgba(100,55,12,.42);letter-spacing:.2em;text-transform:uppercase;margin-top:8px; }
        .stats { display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px;animation:fup .8s ease .3s both;width:100%;max-width:500px; }
        @media(min-width:640px){ .stats { gap:14px;margin-top:18px;flex-wrap:nowrap; } }
        .stat { display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.55);border:1px solid rgba(249,115,22,0.15);border-radius:14px;padding:9px 14px;backdrop-filter:blur(8px);box-shadow:0 2px 14px rgba(160,80,20,0.07);flex:1;min-width:90px; }
        .stat-ico { font-size:1.1rem; }
        .stat-n { font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:#1e0e02; }
        .stat-l { font-size:.58rem;color:rgba(100,55,12,.5);font-weight:500;margin-top:1px; }
        .fcard { width:100%;max-width:400px;background:rgba(255,255,255,0.75);border:1px solid rgba(249,115,22,0.16);border-radius:24px;padding:28px 20px;backdrop-filter:blur(24px);box-shadow:0 24px 70px rgba(160,80,20,0.13),0 2px 8px rgba(160,80,20,0.05);animation:fup .8s ease .05s both;position:relative;z-index:10; }
        @media(min-width:640px){ .fcard { border-radius:28px;padding:36px 32px; } }
        .ft { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#1e0e02;line-height:1.1;margin-bottom:4px; }
        .fs { color:#a08060;font-size:.8rem;margin-bottom:14px; }
        .ftr { display:flex;gap:14px;margin-bottom:16px; }
        .fti { display:flex;align-items:center;gap:5px;font-size:.7rem;color:#b8a080; }
        .ftd { width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block; }
        .fgw { margin-bottom:14px; }
        .fgw > div { width:100%!important; }
        .fdiv { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
        .fdl  { flex:1;height:1px;background:rgba(180,100,30,.13); }
        .fdt  { font-size:.65rem;color:#c4a080;letter-spacing:.12em;white-space:nowrap; }
        .ff { margin-bottom:12px; }
        .ff label { display:block;font-size:.69rem;font-weight:700;color:#8a6040;margin-bottom:5px;letter-spacing:.07em;text-transform:uppercase; }
        .ff input { width:100%;padding:11px 14px;background:rgba(255,255,255,0.75);border:1.5px solid rgba(180,120,60,.17);border-radius:12px;font-size:.875rem;color:#1a0e06;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s,background .2s; }
        .ff input:focus { border-color:#F97316;box-shadow:0 0 0 3px rgba(249,115,22,.1);background:#fff; }
        .ff input::placeholder { color:#c0a070; }
        .ffgt { text-align:right;margin-bottom:14px;margin-top:-4px; }
        .ffgt button { background:none;border:none;cursor:pointer;font-size:.76rem;color:#F97316;font-family:'DM Sans',sans-serif;font-weight:500; }
        .ffgt button:hover { text-decoration:underline; }
        .fbtn { width:100%;padding:13px;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.95rem;border:none;border-radius:12px;cursor:pointer;box-shadow:0 4px 20px rgba(249,115,22,.32);transition:opacity .2s,transform .15s;position:relative;overflow:hidden; }
        .fbtn:hover:not(:disabled) { opacity:.91;transform:translateY(-1px); }
        .fbtn:disabled { opacity:.55;cursor:not-allowed; }
        .fsp { display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spx .7s linear infinite;margin-right:8px;vertical-align:middle; }
        @keyframes spx { to{transform:rotate(360deg)} }
        .fnew { text-align:center;margin-top:14px;font-size:.8rem;color:#b8a080; }
        .fnew button { background:none;border:none;cursor:pointer;color:#F97316;font-weight:700;font-family:'DM Sans',sans-serif;font-size:.8rem; }
        .fnew button:hover { text-decoration:underline; }
        .ticker { position:relative;z-index:30;overflow:hidden;height:38px;background:rgba(249,115,22,.05);border-top:1px solid rgba(249,115,22,.1);display:flex;align-items:center; }
        .ticker-in { display:flex;white-space:nowrap;animation:tick 26s linear infinite; }
        @keyframes tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ti { font-size:.67rem;font-weight:600;color:rgba(120,65,15,.45);letter-spacing:.08em;padding:0 28px;text-transform:uppercase; }
        .td { color:#F97316;margin:0 4px;font-size:.42rem;vertical-align:middle; }
        .pgfoot { position:relative;z-index:30;text-align:center;font-size:.66rem;color:rgba(140,80,20,.3);padding:10px 0 14px; }
      `}</style>

      <div className="pg">
        <div className="blob b1"/><div className="blob b2"/>
        <div className="blob b3"/><div className="blob b4"/>

        {chips.map((c, i) => (
          <div key={i} className="chip" style={{ left:c.x, top:c.y, "--d":c.d, "--t":c.t }}>
            <span>{c.icon}</span>
            <span className="cdot" style={{background:c.c}}/>{c.label}
          </div>
        ))}

        <nav className="nav">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <span style={{color:"#22c55e"}}>ILM</span>
            <span style={{color:"#F97316"}}> ORA</span>
          </div>
          <button className="nav-btn" onClick={() => navigate("/apply")}>🚀 Apply Now</button>
        </nav>

        <div className="center">
          <div className="hl">
            <div className="hl-badge"><span className="hl-badge-dot"/>Advanced Learning Platform for Modern Professionals</div>
            <h1 className="hl-h1">Become the <em>Top 1%</em></h1>
            <p className="hl-sub">Knowledge · Growth · Excellence</p>
          </div>

          <div className="stats">
            <div className="stat"><span className="stat-ico">🎓</span><div><div className="stat-n">12K+</div><div className="stat-l">Students</div></div></div>
            <div className="stat"><span className="stat-ico">👨‍🏫</span><div><div className="stat-n">500+</div><div className="stat-l">Trainers</div></div></div>
            <div className="stat"><span className="stat-ico">📚</span><div><div className="stat-n">300+</div><div className="stat-l">Courses</div></div></div>
          </div>

          <div className="fcard">
            <h1 className="ft">Welcome back</h1>
            <p className="fs">Sign in to continue your journey</p>
            <div className="ftr">
              <span className="fti"><span className="ftd"/>Secure Login</span>
              <span className="fti"><span className="ftd" style={{background:"#F97316"}}/>12K+ Members</span>
            </div>
            <div className="fgw">
              <GoogleLogin
                onSuccess={handleGoogleSuccess} onError={handleGoogleError}
                theme="outline" size="large" text="signin_with"
                shape="rectangular" width="336"
                auto_select={false} cancel_on_tap_outside={true}
              />
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