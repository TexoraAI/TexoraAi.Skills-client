/* ─────────────────────────────────────────────────────────────────
   ILMORA MEETINGS — LANDING PAGE STYLES
   Compaction + consistency pass:
   - ONE font pairing everywhere: 'Sora' for every heading (h1–h5,
     .wf-h3, section-head h2, card titles) and 'Plus Jakarta Sans' for
     every body/paragraph/label/button — declared once at the root and
     never overridden per-section, so no section can drift onto a
     different face.
   - Every section's padding/gaps reduced (~30-40%) for a denser,
     compact layout — same content, less dead air.
   - Band background colors reassigned so light/cream never repeats on
     two sections in a row (was: stats → intro → start&join all white
     back-to-back). Now strictly alternates: cream → white → cream →
     white → cream → white → dark → cream → white → dark.
   - Full responsive pass: breakpoints added for common device widths
     — 1440/1280 (laptop), 1024 (iPad Pro / small laptop), 834 (iPad
     Air), 768 (iPad / iPad mini), 600, 480 (large phones), 390
     (iPhone 12–15), 360 (small Android/iPhone SE) — on top of the
     existing ones, so nothing overflows or clips on any device.
───────────────────────────────────────────────────────────────── */

const ORANGE = "#f97316";
const GREEN = "#16a34a";
const DARK = "#0f172a";

export const THEME_VARS = {
  light: {
    "--bg": "#f7e9da",
    "--card": "#ffffff",
    "--border": "#e7ddcd",
    "--ink": "#111111",
    "--muted": "#6b5f78",
  },
  // Same light/dark concept as the ILM ORA Meet page: dark mode gets its
  // own near-black background + dark card surfaces, with ink/muted flipped
  // to light tones so every heading, paragraph and label (all of which are
  // built on top of var(--ink)/var(--muted)/var(--card)/var(--border)/
  // var(--bg)) stays fully readable in both modes.
  dark: {
    "--bg": "#0f0f0f",
    "--card": "#1a1a1a",
    "--border": "#2a2a2a",
    "--ink": "#f0f0f0",
    "--muted": "#9ca3af",
  },
};

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .ilmoraMeetingsPage{
    --brand:${GREEN};
    --brand-2:${ORANGE};
    --live:${GREEN};
    --font-display:'Sora',sans-serif;
    --font-body:'Plus Jakarta Sans',sans-serif;
    background:var(--card);
    color:var(--ink);
    font-family:var(--font-body);
    -webkit-font-smoothing:antialiased;
    transition:background .25s ease, color .25s ease;
    overflow-x:hidden;
  }
  .ilmoraMeetingsPage *{box-sizing:border-box; font-family:inherit;}
  .ilmoraMeetingsPage h1, .ilmoraMeetingsPage h2, .ilmoraMeetingsPage h3,
  .ilmoraMeetingsPage h4, .ilmoraMeetingsPage h5, .ilmoraMeetingsPage b,
  .ilmoraMeetingsPage button{ font-family:var(--font-display); letter-spacing:-0.02em; }
  .ilmoraMeetingsPage p, .ilmoraMeetingsPage span, .ilmoraMeetingsPage input,
  .ilmoraMeetingsPage label, .ilmoraMeetingsPage li{ font-family:var(--font-body); }

  /* ---------- Hero ("enter the code" section) ---------- */
  .ilmoraMeetingsPage .hero{
    max-width:1180px; margin:0 auto; padding:28px 24px 8px;
    display:grid; grid-template-columns:1.05fr 0.95fr; gap:32px; align-items:center;
  }
  .ilmoraMeetingsPage .eyebrow{
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(22,163,74,.09); color:var(--brand);
    border:1px solid rgba(22,163,74,.18);
    font-size:12px; font-weight:700; letter-spacing:.03em;
    padding:5px 11px; border-radius:999px; margin-bottom:14px;
  }
  .ilmoraMeetingsPage .eyebrow-dot{ width:6px; height:6px; border-radius:999px; background:var(--live); box-shadow:0 0 0 3px rgba(20,184,166,.2); }
  .ilmoraMeetingsPage .hero h1{ font-size:clamp(1.7rem,3.6vw,2.9rem); line-height:1.08; font-weight:900; margin:0 0 14px; letter-spacing:-1px; }
  .ilmoraMeetingsPage em{ font-style:normal; }
  .ilmoraMeetingsPage em.word-orange{ color:var(--brand-2); }
  .ilmoraMeetingsPage em.word-green{ color:var(--brand); }
  .ilmoraMeetingsPage .hero p{ font-size:15px; line-height:1.65; color:var(--muted); max-width:460px; margin:0 0 20px; }
  .ilmoraMeetingsPage .hero-ctas{ display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
  .ilmoraMeetingsPage .btn-primary{
    display:inline-flex; align-items:center; gap:8px;
    background:var(--brand-2); color:#fff;
    border:none; padding:12px 20px; border-radius:11px; font-size:14px; font-weight:700;
    cursor:pointer; box-shadow:0 8px 20px rgba(249,115,22,.28); font-family:var(--font-body);
    transition:all .2s;
  }
  .ilmoraMeetingsPage .btn-primary:hover{ background:#ea6c0e; transform:translateY(-2px); }
  .ilmoraMeetingsPage .btn-ghost{
    display:inline-flex; align-items:center; gap:8px;
    background:transparent; color:var(--ink); border:1px solid var(--border);
    padding:12px 18px; border-radius:11px; font-size:14px; font-weight:600; cursor:pointer;
    font-family:var(--font-body); transition:all .2s;
  }
  .ilmoraMeetingsPage .btn-ghost:hover{ border-color:var(--brand-2); color:var(--brand-2); }

  /* ---------- Hero toolbar: Join by code / New meeting ---------- */
  .ilmoraMeetingsPage .join-by-code{
    display:flex; align-items:center; gap:8px;
    background:var(--card); border:1px solid var(--border); border-radius:11px;
    padding:5px 5px 5px 13px; min-width:250px;
  }
  .ilmoraMeetingsPage .join-by-code-icon{ display:flex; align-items:center; opacity:.7; color:var(--muted); }
  .ilmoraMeetingsPage .join-by-code input{
    flex:1; border:none; outline:none; background:transparent; font-size:13.5px;
    font-family:var(--font-body); color:var(--ink); min-width:0;
  }
  .ilmoraMeetingsPage .join-by-code input::placeholder{ color:var(--muted); }
  .ilmoraMeetingsPage .join-inline-btn{ padding:8px 15px; border-radius:8px; font-size:13px; box-shadow:none; }
  .ilmoraMeetingsPage .join-inline-btn:disabled{ background:rgba(249,115,22,.35); cursor:not-allowed; transform:none; }
  .ilmoraMeetingsPage .hero-join-error{ color:#dc2626; font-size:12px; margin:-10px 0 14px; }

  .ilmoraMeetingsPage .new-meeting-split{ position:relative; display:flex; }
  .ilmoraMeetingsPage .split-btn-main{
    display:inline-flex; align-items:center; gap:6px;
    background:var(--brand-2); color:#fff;
    border:none; padding:12px 16px; border-radius:11px 0 0 11px; font-size:14px; font-weight:700;
    cursor:pointer; font-family:var(--font-body); box-shadow:0 8px 20px rgba(249,115,22,.28);
    transition:background .2s;
  }
  .ilmoraMeetingsPage .split-btn-main:hover{ background:#ea6c0e; }
  .ilmoraMeetingsPage .split-btn-caret{
    display:flex; align-items:center; justify-content:center;
    background:var(--brand-2); color:#fff;
    border:none; border-left:1px solid rgba(255,255,255,.3);
    padding:12px 11px; border-radius:0 11px 11px 0; cursor:pointer; font-size:12px;
    transition:background .2s;
  }
  .ilmoraMeetingsPage .split-btn-caret:hover{ background:#ea6c0e; }
  .ilmoraMeetingsPage .split-menu{
    position:absolute; top:calc(100% + 8px); left:0; min-width:200px; z-index:20;
    background:var(--card); border:1px solid var(--border); border-radius:12px;
    box-shadow:0 12px 30px rgba(0,0,0,.14); padding:6px;
  }
  .ilmoraMeetingsPage .split-menu button{
    display:flex; align-items:center; gap:8px; width:100%; text-align:left;
    background:transparent; border:none; padding:9px 11px; border-radius:8px;
    font-size:13px; color:var(--ink); cursor:pointer; font-family:var(--font-body);
  }
  .ilmoraMeetingsPage .split-menu button:hover{ background:rgba(22,163,74,.1); }

  .ilmoraMeetingsPage .hero-proof{ display:flex; gap:18px; font-size:12px; color:var(--muted); align-items:center; flex-wrap:wrap; }
  .ilmoraMeetingsPage .hero-proof b{ color:var(--ink); font-family:var(--font-display); font-size:14px; display:block; }
  .ilmoraMeetingsPage .hero-avatars{ display:flex; align-items:center; gap:10px; margin-top:4px; }
  .ilmoraMeetingsPage .avatar-stack{ display:flex; }
  .ilmoraMeetingsPage .avatar-stack span{
    width:32px; height:32px; border-radius:999px; border:2.5px solid var(--bg);
    display:flex; align-items:center; justify-content:center; color:#fff;
    font-family:var(--font-display); font-weight:700; font-size:12px; margin-left:-10px;
  }
  .ilmoraMeetingsPage .avatar-stack span:first-child{ margin-left:0; }
  .ilmoraMeetingsPage .avatar-stack span:nth-child(1){ background:#16a34a; }
  .ilmoraMeetingsPage .avatar-stack span:nth-child(2){ background:#f97316; }
  .ilmoraMeetingsPage .avatar-stack span:nth-child(3){ background:#0ea5e9; }
  .ilmoraMeetingsPage .hero-avatars small{ color:var(--muted); font-size:11.5px; }

  /* ---------- Hero mock ---------- */
  .ilmoraMeetingsPage .mock{
    background:var(--card); border:1px solid var(--border); border-radius:18px;
    box-shadow:0 20px 50px rgba(23,15,40,.09); overflow:hidden;
  }
  .ilmoraMeetingsPage .mock-bar{ display:flex; align-items:center; gap:6px; padding:10px 14px; border-bottom:1px solid var(--border); }
  .ilmoraMeetingsPage .mock-dot{ width:8px; height:8px; border-radius:999px; background:#e4dcf2; }
  .ilmoraMeetingsPage .mock-title{ margin-left:6px; font-size:12px; color:var(--muted); font-weight:600; }
  .ilmoraMeetingsPage .mock-body{ padding:12px; display:flex; flex-direction:column; gap:6px; }
  .ilmoraMeetingsPage .m-row{ display:flex; align-items:center; gap:12px; padding:10px 11px; border-radius:12px; }
  .ilmoraMeetingsPage .m-row:hover{ background:rgba(22,163,74,.06); }
  .ilmoraMeetingsPage .m-dot{ width:8px; height:8px; border-radius:999px; background:#d8d2e8; flex-shrink:0; }
  .ilmoraMeetingsPage .m-dot.live{ background:var(--live); box-shadow:0 0 0 3px rgba(20,184,166,.18); }
  .ilmoraMeetingsPage .m-dot.sched{ background:var(--brand); }
  .ilmoraMeetingsPage .m-main{ flex:1; min-width:0; }
  .ilmoraMeetingsPage .m-title{ font-size:13px; font-weight:700; }
  .ilmoraMeetingsPage .m-meta{ font-size:11.5px; color:var(--muted); margin-top:1px; }
  .ilmoraMeetingsPage .m-time{ font-size:12px; color:var(--muted); white-space:nowrap; }
  .ilmoraMeetingsPage .m-btn{ font-size:12px; font-weight:700; padding:6px 12px; border-radius:8px; border:none; color:#fff; }
  .ilmoraMeetingsPage .m-btn.live{ background:linear-gradient(135deg,var(--live),#0ea5e9); }
  .ilmoraMeetingsPage .m-btn.sched{ background:rgba(107,100,120,.18); color:var(--muted); }

  /* ---------- Hero banner — full-bleed auto-rotating image/video ---------- */
  .ilmoraMeetingsPage #hero-banner-section.hero-banner{
    max-width:none; width:100%; margin:0; padding:0;
    position:relative; overflow:hidden;
    height:min(78vh, 640px); min-height:420px;
    background:#0f172a;
  }
  .ilmoraMeetingsPage .hero-banner-track{
    display:flex; width:100%; height:100%;
    transition:transform .9s cubic-bezier(.65,0,.35,1);
    will-change:transform;
  }
  .ilmoraMeetingsPage .hero-banner-slide{
    position:relative; flex:0 0 100%; width:100%; height:100%;
  }
  .ilmoraMeetingsPage .hero-banner-media{
    position:absolute; inset:0; width:100%; height:100%;
    object-fit:cover; object-position:center;
  }
  /* Screenshot/UI-image slide: fill the banner edge-to-edge like the
     video does (no empty pillarbox bars), but anchor the crop to the
     TOP of the image so the sidebar/header/stat-cards stay fully
     visible — only the bottom-most row (quick actions) may crop. */
  .ilmoraMeetingsPage .hero-banner-media--contain{
    object-fit:cover;
    object-position:top center;
  }
  .ilmoraMeetingsPage .hero-banner-overlay{
    position:absolute; inset:0;
    background:linear-gradient(90deg, rgba(15,23,42,.72) 0%, rgba(15,23,42,.42) 45%, rgba(15,23,42,.15) 75%),
               linear-gradient(0deg, rgba(15,23,42,.55) 0%, rgba(15,23,42,0) 40%);
  }
  .ilmoraMeetingsPage .hero-banner-content{
    position:relative; z-index:2; height:100%; max-width:1180px; margin:0 auto;
    display:flex; flex-direction:column; justify-content:center;
    padding:0 24px; gap:14px; max-width:560px;
  }
  .ilmoraMeetingsPage .hero-banner-eyebrow{
    color:#5eead4; font-size:11.5px; font-weight:800; letter-spacing:.08em;
    text-transform:uppercase;
  }
  .ilmoraMeetingsPage .hero-banner-title{
    color:#fff; font-size:clamp(1.7rem, 4vw, 2.7rem); font-weight:800;
    letter-spacing:-1.1px; line-height:1.15; margin:0;
  }
  .ilmoraMeetingsPage .hero-banner-title .brand-ilm{ color:var(--brand); }
  .ilmoraMeetingsPage .hero-banner-title .brand-ora{ color:var(--brand-2); }
  .ilmoraMeetingsPage .hero-banner-copy{
    color:rgba(255,255,255,.85); font-size:14.5px; line-height:1.65; margin:0; max-width:460px;
  }
  .ilmoraMeetingsPage .hero-banner-cta{ margin-top:6px; align-self:flex-start; }
  .ilmoraMeetingsPage .hero-banner-dots{
    position:absolute; z-index:3; left:24px; bottom:22px;
    display:flex; gap:8px;
  }
  .ilmoraMeetingsPage .hero-banner-dot{
    width:22px; height:4px; border-radius:999px; border:none; cursor:pointer;
    background:rgba(255,255,255,.35); transition:background .25s ease, width .25s ease;
    padding:0;
  }
  .ilmoraMeetingsPage .hero-banner-dot--active{ background:#fff; width:34px; }

  @media (max-width:768px){
    .ilmoraMeetingsPage #hero-banner-section.hero-banner{ height:min(62vh, 480px); min-height:360px; }
    .ilmoraMeetingsPage .hero-banner-content{ padding:0 18px; }
    .ilmoraMeetingsPage .hero-banner-overlay{
      background:linear-gradient(180deg, rgba(15,23,42,.35) 0%, rgba(15,23,42,.55) 55%, rgba(15,23,42,.85) 100%);
    }
    .ilmoraMeetingsPage .hero-banner-dots{ left:18px; bottom:16px; }
  }

  /* ---------- Product demo — Coverr-style video hero ---------- */
  .ilmoraMeetingsPage .demo-hero{ padding-top:4px; padding-bottom:36px; }
  .ilmoraMeetingsPage #demo-section.demo-hero{ max-width:none; width:100%; margin:0; background:var(--bg); }
  .ilmoraMeetingsPage #demo-section.demo-hero .demo-hero-media{ max-width:1180px; margin-left:auto; margin-right:auto; }
  .ilmoraMeetingsPage .demo-hero-media{
    position:relative; border-radius:24px; overflow:hidden;
    aspect-ratio:16 / 8; max-height:520px;
    box-shadow:0 24px 56px rgba(23,15,40,.16);
    background:#0f172a;
  }
  .ilmoraMeetingsPage .demo-hero-video{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; }
  .ilmoraMeetingsPage .demo-hero-overlay{
    position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(15,23,42,.12) 0%, rgba(15,23,42,.32) 55%, rgba(15,23,42,.78) 100%);
  }
  .ilmoraMeetingsPage .demo-hero-content{
    position:relative; z-index:2; height:100%;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; gap:12px; padding:36px 22px;
  }
  .ilmoraMeetingsPage .demo-hero-content h2{ color:#fff; font-size:clamp(1.5rem, 3.2vw, 2.2rem); font-weight:800; letter-spacing:-1px; margin:0; max-width:600px; }
  .ilmoraMeetingsPage .demo-hero-content h2.demo-hero-title-nowrap{ max-width:none; white-space:nowrap; font-size:clamp(1.1rem, 3vw, 2.2rem); }
  .ilmoraMeetingsPage .demo-hero-content .brand-ilm{ color:var(--brand); }
  .ilmoraMeetingsPage .demo-hero-content .brand-ora{ color:var(--brand-2); }
  .ilmoraMeetingsPage .demo-hero-content p{ color:rgba(255,255,255,.85); font-size:14.5px; line-height:1.6; max-width:500px; margin:0; }
  .ilmoraMeetingsPage .demo-hero-cta{ margin-top:4px; }

  /* ---------- Section shell ---------- */
  .ilmoraMeetingsPage section{ max-width:1180px; margin:0 auto; padding:48px 24px; }
  .ilmoraMeetingsPage .section-head{ max-width:560px; margin-bottom:28px; }
  .ilmoraMeetingsPage .section-head h2{ font-size:clamp(1.8rem, 3.6vw, 2.6rem); font-weight:800; line-height:1.12; letter-spacing:-1.1px; margin:0 0 10px; color:var(--ink); }
  .ilmoraMeetingsPage .section-head h2.heading-nowrap{ white-space:nowrap; font-size:clamp(1.4rem, 3vw, 2.6rem); }
  .ilmoraMeetingsPage .section-head p{ color:var(--muted); font-size:14.5px; line-height:1.6; margin:0; }

  .ilmoraMeetingsPage #features-section{ max-width:none; width:100%; margin:0; padding:0; }
  .ilmoraMeetingsPage .wf-features-intro{ max-width:none; margin-bottom:32px; }
  .ilmoraMeetingsPage .wf-features-intro h2{ white-space:normal; font-size:clamp(1.7rem, 3.4vw, 2.4rem); }

  /* ---------- Premium spotlight carousel ---------- */
  .ilmoraMeetingsPage #carousel-section.pc-section{
    max-width:none; width:100%; margin:0; padding:64px 24px;
    position:relative; overflow:hidden; isolation:isolate;
    background:var(--bg);
  }
  .ilmoraMeetingsPage .pc-decor{ position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none; }
  .ilmoraMeetingsPage .pc-glow{
    position:absolute; top:50%; left:50%; width:900px; height:900px; transform:translate(-50%,-50%);
    background:radial-gradient(circle, rgba(249,115,22,.16) 0%, rgba(249,115,22,0) 70%); filter:blur(30px);
  }
  .ilmoraMeetingsPage .pc-circle{ position:absolute; border-radius:999px; border:1px solid rgba(249,115,22,.14); }
  .ilmoraMeetingsPage .pc-circle--1{ width:480px; height:480px; top:-140px; left:-160px; animation:pcDrift 14s ease-in-out infinite; }
  .ilmoraMeetingsPage .pc-circle--2{ width:360px; height:360px; bottom:-150px; right:-120px; border-color:rgba(249,115,22,.1); animation:pcDrift 18s ease-in-out infinite reverse; }
  .ilmoraMeetingsPage .pc-particle{ position:absolute; width:6px; height:6px; border-radius:999px; background:#F97316; opacity:.35; animation:pcFloatParticle 8s ease-in-out infinite; }
  .ilmoraMeetingsPage .pc-particle--1{ top:16%; left:11%; }
  .ilmoraMeetingsPage .pc-particle--2{ top:72%; left:7%; width:4px; height:4px; animation-delay:1.6s; }
  .ilmoraMeetingsPage .pc-particle--3{ top:20%; right:9%; animation-delay:.9s; }
  .ilmoraMeetingsPage .pc-particle--4{ top:76%; right:13%; width:5px; height:5px; animation-delay:2.4s; }
  @keyframes pcDrift{ 0%,100%{ transform:translateY(0) translateX(0);} 50%{ transform:translateY(-14px) translateX(10px);} }
  @keyframes pcFloatParticle{ 0%,100%{ transform:translateY(0); opacity:.25;} 50%{ transform:translateY(-18px); opacity:.6;} }

  .ilmoraMeetingsPage .pc-head{ position:relative; z-index:2; max-width:680px; margin:0 auto 32px; text-align:center; }
  .ilmoraMeetingsPage .pc-badge{
    display:inline-flex; align-items:center; gap:10px;
    background:var(--card); border-radius:999px; padding:6px 16px 6px 6px;
    box-shadow:0 10px 26px rgba(20,10,0,.07); font-size:12px; font-weight:700; color:var(--ink);
    margin-bottom:16px;
  }
  .ilmoraMeetingsPage .pc-badge-avatars{ display:flex; }
  .ilmoraMeetingsPage .pc-badge-avatars span{
    width:24px; height:24px; border-radius:999px; border:2px solid var(--card);
    display:flex; align-items:center; justify-content:center; color:#fff;
    font-family:var(--font-display); font-weight:700; font-size:9px; margin-left:-9px;
  }
  .ilmoraMeetingsPage .pc-badge-avatars span:first-child{ margin-left:0; }
  .ilmoraMeetingsPage .pc-badge-avatars span:nth-child(1){ background:#16a34a; }
  .ilmoraMeetingsPage .pc-badge-avatars span:nth-child(2){ background:#f97316; }
  .ilmoraMeetingsPage .pc-badge-avatars span:nth-child(3){ background:#0ea5e9; }
  .ilmoraMeetingsPage .pc-head h2{ font-size:clamp(1.8rem, 3.6vw, 2.6rem); font-weight:800; line-height:1.12; letter-spacing:-1.1px; margin:0 0 12px; color:var(--ink); }
  .ilmoraMeetingsPage .pc-head h2.pc-head-title-nowrap{ white-space:nowrap; font-size:clamp(1.1rem, 3vw, 2.6rem); }
  .ilmoraMeetingsPage .pc-head p{ font-size:16px; line-height:1.6; color:var(--muted); max-width:600px; margin:0 auto; }

  .ilmoraMeetingsPage .pc-wrap{ position:relative; z-index:2; display:flex; align-items:center; justify-content:center; gap:22px; }
  .ilmoraMeetingsPage .pc-card{
    position:relative; width:min(78vw, 760px); padding:14px; border-radius:24px;
    background:var(--card); border:1px solid var(--border);
    box-shadow:0 24px 54px rgba(0,0,0,.11);
    animation:pcFloat 6s cubic-bezier(.45,0,.55,1) infinite;
  }
  @keyframes pcFloat{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-9px); } }
  .ilmoraMeetingsPage .pc-stage{ position:relative; width:100%; aspect-ratio:3 / 2; border-radius:18px; overflow:hidden; background:var(--bg); }
  .ilmoraMeetingsPage .pc-stage--static{ aspect-ratio:auto; }
  .ilmoraMeetingsPage .pc-img{ width:100%; height:100%; object-fit:contain; object-position:center; display:block; }

  /* ---------- Stats ---------- */
  .ilmoraMeetingsPage .stat-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .ilmoraMeetingsPage .stat-card{ background:var(--card); border:1.5px solid var(--border); border-radius:16px; padding:16px; transition:transform .2s, box-shadow .2s; }
  .ilmoraMeetingsPage .stat-card:hover{ transform:translateY(-3px); box-shadow:0 10px 26px rgba(0,0,0,.08); }
  .ilmoraMeetingsPage .stat-value{ font-size:24px; font-weight:900; font-family:var(--font-display); }
  .ilmoraMeetingsPage .stat-label{ font-size:10.5px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-top:4px; }
  .ilmoraMeetingsPage .stat-underline{ height:3px; border-radius:999px; background:linear-gradient(90deg,var(--brand),var(--brand-2)); margin-top:12px; width:55%; }

  /* ---------- Final CTA ---------- */
  .ilmoraMeetingsPage .cta-band{
    background:linear-gradient(135deg, ${DARK}, #1c2b1e);
    border-radius:24px; overflow:hidden;
    display:flex; align-items:stretch; min-height:180px;
    margin-top:6px;
  }
  .ilmoraMeetingsPage .cta-band-media{
    flex:0 0 220px; align-self:stretch; position:relative; overflow:hidden;
    background:${DARK}; margin:0; padding:0; min-height:180px;
    border-top-left-radius:24px; border-bottom-left-radius:24px;
  }
  .ilmoraMeetingsPage .cta-band-media img{
    position:absolute; inset:0; margin:0; padding:0; border:none;
    width:100%; height:100%; object-fit:cover; object-position:center 20%; display:block;
  }
  .ilmoraMeetingsPage .cta-band-content{ flex:1; padding:28px 36px; text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center; }
  .ilmoraMeetingsPage .cta-band h2{ font-size:clamp(1.3rem,2.4vw,1.7rem); margin:0 0 8px; font-weight:900; color:#fff; }
  .ilmoraMeetingsPage .cta-band h2 em{ font-style:normal; }
  .ilmoraMeetingsPage .cta-band p{ color:rgba(255,255,255,.65); max-width:440px; margin:0 auto; font-size:14px; }
  .ilmoraMeetingsPage .cta-band .btn-primary{ box-shadow:0 10px 30px rgba(22,163,74,.4); }

  /* ═══════════════════════════════════════════════════════════════
     "Before / during / after" — real sections (wf-*).
     Band order now strictly alternates so no two adjacent sections
     share a background: cream(carousel) → white(hero) → cream(demo)
     → white(stats) → cream(intro+start&join) → white(before) →
     dark(during) → cream(host) → white(dashboard) → dark(after).
  ─────────────────────────────────────────────────────────────────── */
  .ilmoraMeetingsPage .wf-band{ width:100%; }
  .ilmoraMeetingsPage .wf-band-light{ background:var(--card); }
  .ilmoraMeetingsPage .wf-band-tint{ background:var(--bg); }
  .ilmoraMeetingsPage .wf-band-dark{ background:var(--bg); } /* neutralized: no more dark bands anywhere */
  .ilmoraMeetingsPage .wf-band-inner{ max-width:1180px; margin:0 auto; padding:40px 24px; }
  .ilmoraMeetingsPage .wf-band + .wf-band{ border-top:1px solid var(--border); }
  .ilmoraMeetingsPage .wf-band-dark + .wf-band,
  .ilmoraMeetingsPage .wf-band + .wf-band-dark{ border-top:none; }

  .ilmoraMeetingsPage .wf-eyebrow{ display:inline-flex; align-items:center; gap:7px; font-size:11.5px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#16a34a; margin-bottom:10px; }
  .ilmoraMeetingsPage .wf-eyebrow-dark{ color:#5eead4; }
  .ilmoraMeetingsPage .wf-h3{ font-family:var(--font-display); font-size:clamp(1.4rem,2.6vw,1.9rem); font-weight:800; letter-spacing:-.7px; line-height:1.15; margin:0 0 10px; max-width:640px; color:var(--ink); }
  .ilmoraMeetingsPage .wf-h3-dark{ color:#fff; }
  .ilmoraMeetingsPage .wf-lead{ font-size:14.5px; line-height:1.6; color:var(--muted); max-width:560px; margin:0 0 8px; }
  .ilmoraMeetingsPage .wf-lead-dark{ color:#AEB9CE; }

  .ilmoraMeetingsPage .wf-reveal{ opacity:0; transform:translateY(24px); transition:opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1); }
  .ilmoraMeetingsPage .wf-reveal.wf-in{ opacity:1; transform:translateY(0); }
  .ilmoraMeetingsPage .wf-dash-stat-reveal{ display:block; }

  .ilmoraMeetingsPage .wf-feat-row{ display:grid; grid-template-columns:0.9fr 1.1fr; gap:40px; align-items:center; padding:28px 0; border-top:1px solid var(--border); }
  .ilmoraMeetingsPage .wf-band-inner > .wf-reveal:first-of-type .wf-feat-row{ border-top:none; padding-top:16px; }
  .ilmoraMeetingsPage .wf-feat-row.wf-dark{ border-top-color:rgba(255,255,255,.08); }
  .ilmoraMeetingsPage .wf-feat-row.wf-rev{ grid-template-columns:1.1fr 0.9fr; }
  .ilmoraMeetingsPage .wf-feat-row.wf-rev .wf-feat-copy{ order:2; }
  .ilmoraMeetingsPage .wf-feat-tag{ display:inline-flex; align-items:center; font-size:11px; font-weight:800; color:#16a34a; text-transform:uppercase; letter-spacing:.07em; margin-bottom:8px; }
  .ilmoraMeetingsPage .wf-feat-row.wf-dark .wf-feat-tag{ color:#5eead4; }
  .ilmoraMeetingsPage .wf-feat-copy h4{ font-family:var(--font-display); font-size:18px; font-weight:700; margin:0 0 8px; color:var(--ink); }
  .ilmoraMeetingsPage .wf-feat-row.wf-dark .wf-feat-copy h4{ color:#fff; }
  .ilmoraMeetingsPage .wf-feat-copy p{ font-size:13.5px; line-height:1.6; color:var(--muted); margin:0 0 12px; }
  .ilmoraMeetingsPage .wf-feat-row.wf-dark .wf-feat-copy p{ color:#AEB9CE; }
  .ilmoraMeetingsPage .wf-feat-list{ list-style:none; display:flex; flex-direction:column; gap:7px; margin:0; padding:0; }
  .ilmoraMeetingsPage .wf-feat-list li{ font-size:13px; color:var(--muted); display:flex; gap:8px; align-items:flex-start; }
  .ilmoraMeetingsPage .wf-feat-row.wf-dark .wf-feat-list li{ color:#C4CCDD; }
  .ilmoraMeetingsPage .wf-feat-list li::before{ content:"✓"; color:#16a34a; font-weight:800; flex-shrink:0; }
  .ilmoraMeetingsPage .wf-feat-row.wf-dark .wf-feat-list li::before{ color:#5eead4; }

  .ilmoraMeetingsPage .wf-visual{ background:var(--card); border:1px solid var(--border); border-radius:18px; padding:16px; box-shadow:0 16px 36px -24px rgba(15,23,42,.2); min-height:200px; }
  .ilmoraMeetingsPage .wf-visual-flush{ padding:0; overflow:hidden; }
  .ilmoraMeetingsPage .wf-visual-dark, .ilmoraMeetingsPage .wf-feat-row.wf-dark .wf-visual{ background:#101C30; border-color:#22314A; box-shadow:0 16px 36px -24px rgba(0,0,0,.5); }
  .ilmoraMeetingsPage .wf-empty{ color:#7C879C; font-size:13px; padding:8px 2px; }

  .ilmoraMeetingsPage .wf-join-card{ padding:2px; }
  .ilmoraMeetingsPage .wf-code-row{ display:flex; gap:6px; margin-bottom:10px; }
  .ilmoraMeetingsPage .wf-code-row span{ flex:1; height:42px; border:1.5px solid var(--border); border-radius:9px; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--ink); background:var(--bg); transition:all .25s; }
  .ilmoraMeetingsPage .wf-code-row span.wf-filled{ border-color:#16a34a; background:rgba(22,163,74,.12); color:#0f5e2c; animation:wfPop .25s ease; }
  .ilmoraMeetingsPage .wf-join-hint{ font-size:11.5px; color:var(--muted); margin-bottom:12px; }
  @keyframes wfPop{ from{ transform:scale(.8); } to{ transform:scale(1); } }

  .ilmoraMeetingsPage .wf-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; border:none; cursor:pointer; border-radius:10px; font-weight:700; font-size:14px; font-family:var(--font-body); transition:all .18s; }
  .ilmoraMeetingsPage .wf-btn-primary{ background:#16a34a; color:#fff; padding:11px 18px; }
  .ilmoraMeetingsPage .wf-btn-primary:hover{ background:#128a3e; transform:translateY(-1px); }
  .ilmoraMeetingsPage .wf-btn-sm{ padding:8px 14px; font-size:12.5px; }

  .ilmoraMeetingsPage .wf-split-demo{ display:flex; border-radius:11px; overflow:hidden; border:1px solid #22314A; width:fit-content; }
  .ilmoraMeetingsPage .wf-split-demo button{ border:none; cursor:pointer; font-family:var(--font-body); }
  .ilmoraMeetingsPage .wf-split-main{ background:#16a34a; color:#04211D; font-weight:700; font-size:13.5px; padding:11px 18px; }
  .ilmoraMeetingsPage .wf-split-caret{ background:#128a3e; color:#04211D; padding:11px 13px; border-left:1px solid rgba(4,33,29,.25); display:flex; align-items:center; }
  .ilmoraMeetingsPage .wf-menu-demo{ margin-top:10px; display:flex; flex-direction:column; gap:7px; }
  .ilmoraMeetingsPage .wf-menu-item{ display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; background:#182C48; font-size:12.5px; color:#D7DEEA; }
  .ilmoraMeetingsPage .wf-menu-item svg{ color:#5eead4; flex-shrink:0; }

  .ilmoraMeetingsPage .wf-link-modal h5{ color:#fff; font-size:13.5px; margin:0 0 12px; font-family:var(--font-display); }
  .ilmoraMeetingsPage .wf-link-field{ margin-bottom:10px; }
  .ilmoraMeetingsPage .wf-link-field label{ font-size:10.5px; color:#7C879C; display:block; margin-bottom:5px; letter-spacing:.05em; }
  .ilmoraMeetingsPage .wf-link-input-row{ display:flex; gap:8px; }
  .ilmoraMeetingsPage .wf-link-input-row input{ flex:1; background:#152238; border:1px solid #22314A; border-radius:8px; padding:9px 11px; color:#D7DEEA; font-size:12px; font-family:monospace; }
  .ilmoraMeetingsPage .wf-copy-btn{ background:#16a34a; border:none; border-radius:8px; width:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; color:#04211D; transition:transform .15s; }
  .ilmoraMeetingsPage .wf-copy-btn:hover{ transform:scale(1.06); }
  .ilmoraMeetingsPage .wf-copy-confirm{ font-size:11px; color:#5eead4; margin-top:6px; animation:wfFadeIn .2s ease; }
  @keyframes wfFadeIn{ from{ opacity:0; } to{ opacity:1; } }

  .ilmoraMeetingsPage .wf-cal-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .ilmoraMeetingsPage .wf-cal-head b{ font-size:13.5px; font-family:var(--font-display); color:var(--ink); }
  .ilmoraMeetingsPage .wf-cal-nav{ display:flex; gap:6px; }
  .ilmoraMeetingsPage .wf-cal-nav span{ width:20px; height:20px; border-radius:6px; background:var(--bg); display:flex; align-items:center; justify-content:center; font-size:11px; color:var(--muted); cursor:pointer; }
  .ilmoraMeetingsPage .wf-cal-days{ display:grid; grid-template-columns:repeat(7,1fr); gap:5px; margin-bottom:8px; }
  .ilmoraMeetingsPage .wf-cal-days span{ font-size:9.5px; text-align:center; color:var(--muted); }
  .ilmoraMeetingsPage .wf-cal-dates{ display:grid; grid-template-columns:repeat(7,1fr); gap:5px; }
  .ilmoraMeetingsPage .wf-cal-dates div{ aspect-ratio:1; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:11.5px; color:var(--muted); background:var(--bg); }
  .ilmoraMeetingsPage .wf-cal-dates div.wf-active{ background:#16a34a; color:#fff; font-weight:700; }
  .ilmoraMeetingsPage .wf-slot-card{ margin-top:12px; background:rgba(22,163,74,.12); border-radius:10px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; }
  .ilmoraMeetingsPage .wf-slot-card b{ font-size:12.5px; color:#0f5e2c; }
  .ilmoraMeetingsPage .wf-slot-card span{ font-size:10.5px; color:#127a45; }

  .ilmoraMeetingsPage .wf-provider-row{ display:flex; align-items:center; justify-content:space-between; padding:11px 13px; border:1px solid var(--border); border-radius:10px; margin-bottom:8px; }
  .ilmoraMeetingsPage .wf-provider-row:last-child{ margin-bottom:0; }
  .ilmoraMeetingsPage .wf-provider-left{ display:flex; align-items:center; gap:10px; }
  .ilmoraMeetingsPage .wf-prov-icon{ width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ilmoraMeetingsPage .wf-provider-row b{ font-size:13px; display:block; color:var(--ink); }
  .ilmoraMeetingsPage .wf-provider-row span{ font-size:11px; color:var(--muted); }
  .ilmoraMeetingsPage .wf-pill{ font-size:10.5px; font-weight:700; padding:5px 10px; border-radius:999px; }
  .ilmoraMeetingsPage .wf-pill.wf-on{ background:rgba(22,163,74,.14); color:#0f5e2c; }
  .ilmoraMeetingsPage .wf-pill.wf-off{ background:var(--bg); color:var(--muted); }

  .ilmoraMeetingsPage .wf-mail-card{ border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .ilmoraMeetingsPage .wf-mail-field{ display:flex; align-items:flex-start; gap:10px; padding:11px 13px; border-bottom:1px solid var(--border); }
  .ilmoraMeetingsPage .wf-mail-field label{ font-size:11px; color:var(--muted); width:50px; padding-top:4px; flex-shrink:0; }
  .ilmoraMeetingsPage .wf-chips{ display:flex; flex-wrap:wrap; gap:6px; }
  .ilmoraMeetingsPage .wf-chip{ background:var(--bg); border-radius:999px; padding:5px 10px 5px 6px; font-size:11.5px; display:flex; align-items:center; gap:6px; color:var(--ink); }
  .ilmoraMeetingsPage .wf-chip .wf-dot{ width:16px; height:16px; border-radius:50%; font-size:9px; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; }
  .ilmoraMeetingsPage .wf-mail-body{ padding:12px; font-size:12px; color:var(--muted); line-height:1.55; }
  .ilmoraMeetingsPage .wf-mail-foot{ padding:11px 13px; display:flex; justify-content:flex-end; }

  .ilmoraMeetingsPage .wf-lobby-row{ display:flex; align-items:center; justify-content:space-between; padding:10px 11px; border-radius:10px; background:var(--bg); margin-bottom:7px; }
  .ilmoraMeetingsPage .wf-lobby-row:last-child{ margin-bottom:0; }
  .ilmoraMeetingsPage .wf-lobby-left{ display:flex; align-items:center; gap:10px; }
  .ilmoraMeetingsPage .wf-mini-av{ width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11.5px; font-weight:700; color:#fff; flex-shrink:0; }
  .ilmoraMeetingsPage .wf-lobby-left b{ font-size:12.5px; display:block; color:var(--ink); }
  .ilmoraMeetingsPage .wf-lobby-left span{ font-size:10.5px; color:var(--muted); }
  .ilmoraMeetingsPage .wf-stack{ display:flex; }
  .ilmoraMeetingsPage .wf-stack .wf-mini-av{ margin-left:-8px; border:2px solid var(--card); }
  .ilmoraMeetingsPage .wf-stack .wf-mini-av:first-child{ margin-left:0; }
  .ilmoraMeetingsPage .wf-counter-pill{ background:var(--ink); color:var(--card); font-size:10.5px; padding:5px 10px; border-radius:999px; }

  .ilmoraMeetingsPage .wf-frame{ background:#0E1A2C; border-radius:14px; overflow:hidden; position:relative; aspect-ratio:16/10; }
  .ilmoraMeetingsPage .wf-frame-inner{ position:absolute; inset:0; background:linear-gradient(160deg,#182C48,#0E1A2C); }
  .ilmoraMeetingsPage .wf-frame-topbar{ position:absolute; top:0; left:0; right:0; display:flex; justify-content:space-between; padding:9px 12px; }
  .ilmoraMeetingsPage .wf-frame-topbar span{ font-size:10px; color:#9AA6BC; background:rgba(0,0,0,.3); padding:3px 8px; border-radius:6px; }

  .ilmoraMeetingsPage .wf-share-window{ position:absolute; inset:14px 14px 40px 14px; background:#0A1220; border-radius:8px; border:1px solid #22314A; overflow:hidden; }
  .ilmoraMeetingsPage .wf-share-topbar{ display:flex; gap:5px; padding:8px 10px; border-bottom:1px solid #22314A; }
  .ilmoraMeetingsPage .wf-share-topbar span{ width:7px; height:7px; border-radius:50%; }
  .ilmoraMeetingsPage .wf-share-topbar span:nth-child(1){ background:#FF5F57; }
  .ilmoraMeetingsPage .wf-share-topbar span:nth-child(2){ background:#FEBC2E; }
  .ilmoraMeetingsPage .wf-share-topbar span:nth-child(3){ background:#28C840; }
  .ilmoraMeetingsPage .wf-share-bars{ display:flex; align-items:flex-end; gap:6px; padding:14px; height:62px; }
  .ilmoraMeetingsPage .wf-share-bars div{ flex:1; background:linear-gradient(180deg,#5eead4,#0d5a52); border-radius:3px 3px 0 0; transition:height .4s ease; }
  .ilmoraMeetingsPage .wf-presenter-chip{ position:absolute; bottom:10px; left:14px; background:rgba(0,0,0,.5); backdrop-filter:blur(6px); border-radius:999px; padding:5px 12px 5px 6px; display:flex; align-items:center; gap:7px; font-size:11px; color:#fff; }

  .ilmoraMeetingsPage .wf-chat-panel{ position:absolute; top:0; right:0; bottom:0; width:58%; background:#0B1424; border-left:1px solid #22314A; display:flex; flex-direction:column; }
  .ilmoraMeetingsPage .wf-chat-head{ padding:10px 12px; font-size:11px; color:#9AA6BC; border-bottom:1px solid #22314A; }
  .ilmoraMeetingsPage .wf-chat-msgs{ flex:1; padding:10px 12px; display:flex; flex-direction:column; gap:8px; }
  .ilmoraMeetingsPage .wf-msg b{ font-size:10.5px; color:#5eead4; display:block; margin-bottom:2px; }
  .ilmoraMeetingsPage .wf-msg span{ font-size:11px; color:#D7DEEA; background:#152238; padding:6px 9px; border-radius:8px; display:inline-block; }
  .ilmoraMeetingsPage .wf-chat-input{ margin:0 12px 12px; background:#152238; border-radius:999px; padding:8px 12px; font-size:10.5px; color:#67728A; }

  .ilmoraMeetingsPage .wf-emoji-float{ position:absolute; font-size:20px; animation:wfFloatUp 2.4s ease-in; }
  @keyframes wfFloatUp{ 0%{ transform:translateY(0) scale(.6); opacity:0; } 15%{ opacity:1; } 100%{ transform:translateY(-90px) scale(1.1); opacity:0; } }
  .ilmoraMeetingsPage .wf-reaction-bar{ position:absolute; bottom:40px; left:50%; transform:translateX(-50%); display:flex; gap:8px; background:rgba(0,0,0,.45); backdrop-filter:blur(6px); padding:7px 10px; border-radius:999px; }
  .ilmoraMeetingsPage .wf-reaction-bar span{ font-size:16px; cursor:pointer; transition:transform .15s; }
  .ilmoraMeetingsPage .wf-reaction-bar span:hover{ transform:scale(1.35); }

  .ilmoraMeetingsPage .wf-hand-toast{ position:absolute; top:14px; left:14px; background:rgba(249,115,22,.15); border:1px solid rgba(249,115,22,.4); color:#FFC896; font-size:11px; padding:6px 11px; border-radius:999px; display:flex; align-items:center; gap:7px; animation:wfPop .3s ease; }
  .ilmoraMeetingsPage .wf-queue{ position:absolute; top:14px; right:14px; display:flex; flex-direction:column; gap:6px; }
  .ilmoraMeetingsPage .wf-queue-row{ display:flex; align-items:center; gap:7px; background:rgba(0,0,0,.35); padding:5px 9px; border-radius:999px; }
  .ilmoraMeetingsPage .wf-queue-row span{ font-size:10px; color:#E7ECF5; }

  .ilmoraMeetingsPage .wf-cap-line{ position:absolute; bottom:14px; left:14px; right:14px; background:rgba(0,0,0,.55); border-radius:8px; padding:9px 11px; }
  .ilmoraMeetingsPage .wf-cap-line .wf-who{ font-size:9.5px; color:#5eead4; margin-bottom:4px; }
  .ilmoraMeetingsPage .wf-cap-line .wf-txt{ font-size:12.5px; color:#fff; line-height:1.5; }
  .ilmoraMeetingsPage .wf-cap-toggle{ position:absolute; top:14px; right:14px; background:#16a34a; color:#04211D; font-size:9.5px; font-weight:700; padding:5px 10px; border-radius:6px; }

  .ilmoraMeetingsPage .wf-toggle-demo{ display:flex; align-items:center; justify-content:center; gap:22px; height:100%; }
  .ilmoraMeetingsPage .wf-toggle-item{ display:flex; flex-direction:column; align-items:center; gap:9px; }
  .ilmoraMeetingsPage .wf-toggle-circle{ width:58px; height:58px; border-radius:50%; background:#152238; display:flex; align-items:center; justify-content:center; border:1px solid #22314A; cursor:pointer; transition:all .2s; color:#D7DEEA; }
  .ilmoraMeetingsPage .wf-toggle-circle.wf-active{ background:#16a34a; border-color:#16a34a; color:#04211D; transform:scale(1.04); }
  .ilmoraMeetingsPage .wf-toggle-item span{ font-size:10.5px; color:#9AA6BC; }

  .ilmoraMeetingsPage .wf-people-panel{ background:#0E1A2C; border-radius:14px; padding:13px; }
  .ilmoraMeetingsPage .wf-people-search{ background:#152238; border-radius:8px; padding:8px 12px; font-size:11px; color:#67728A; margin-bottom:10px; }
  .ilmoraMeetingsPage .wf-person-row{ display:flex; align-items:center; justify-content:space-between; padding:8px 4px; border-bottom:1px solid #1B2A42; }
  .ilmoraMeetingsPage .wf-person-row:last-child{ border-bottom:none; }
  .ilmoraMeetingsPage .wf-person-left{ display:flex; align-items:center; gap:10px; }
  .ilmoraMeetingsPage .wf-person-left b{ font-size:12px; color:#E7ECF5; font-weight:500; display:flex; align-items:center; }
  .ilmoraMeetingsPage .wf-role-tag{ font-size:9px; color:#5eead4; margin-left:6px; }
  .ilmoraMeetingsPage .wf-person-icons{ display:flex; gap:8px; color:#67728A; }
  .ilmoraMeetingsPage .wf-person-icons .wf-icon-off{ color:#EC6A6A; }

  .ilmoraMeetingsPage .wf-host-req{ background:#101C30; border:1px solid #22314A; border-radius:12px; padding:12px 13px; display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; transition:opacity .2s, transform .2s; }
  .ilmoraMeetingsPage .wf-host-req:last-child{ margin-bottom:0; }
  .ilmoraMeetingsPage .wf-host-req-left{ display:flex; align-items:center; gap:11px; }
  .ilmoraMeetingsPage .wf-host-req-left b{ font-size:12.5px; color:#E7ECF5; display:block; }
  .ilmoraMeetingsPage .wf-host-req-left span{ font-size:10.5px; color:#7C879C; }
  .ilmoraMeetingsPage .wf-host-req-actions{ display:flex; gap:8px; }
  .ilmoraMeetingsPage .wf-req-btn{ width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition:transform .15s; }
  .ilmoraMeetingsPage .wf-req-btn:hover{ transform:scale(1.1); }
  .ilmoraMeetingsPage .wf-req-btn.wf-accept{ background:#16a34a; color:#04211D; }
  .ilmoraMeetingsPage .wf-req-btn.wf-deny{ background:#2A1A1A; color:#EC6A6A; border:1px solid #4A2626; }
  .ilmoraMeetingsPage .wf-trust-row{ display:flex; gap:12px; margin-top:14px; }
  .ilmoraMeetingsPage .wf-trust-card{ flex:1; border:1px solid #22314A; border-radius:12px; padding:13px; background:#101C30; color:#5eead4; }
  .ilmoraMeetingsPage .wf-trust-card b{ font-size:12px; color:#E7ECF5; display:block; margin:9px 0 4px; }
  .ilmoraMeetingsPage .wf-trust-card span{ font-size:11px; color:#8B94A7; line-height:1.5; }

  .ilmoraMeetingsPage .wf-req-history{ display:flex; flex-direction:column; gap:7px; }
  .ilmoraMeetingsPage .wf-req-hist-row{ display:flex; align-items:center; justify-content:space-between; padding:9px 11px; border:1px solid #22314A; border-radius:10px; }
  .ilmoraMeetingsPage .wf-req-hist-left b{ font-size:12px; color:#E7ECF5; display:block; }
  .ilmoraMeetingsPage .wf-req-hist-left span{ font-size:10.5px; color:#7C879C; }
  .ilmoraMeetingsPage .wf-req-status{ font-size:10px; font-weight:700; padding:4px 10px; border-radius:999px; }
  .ilmoraMeetingsPage .wf-req-status.wf-admitted{ background:rgba(22,163,74,.16); color:#5eead4; }
  .ilmoraMeetingsPage .wf-req-status.wf-denied{ background:rgba(229,72,77,.16); color:#FF9A9A; }
  .ilmoraMeetingsPage .wf-req-status.wf-pending{ background:rgba(148,163,184,.16); color:#B7C0D1; }

  .ilmoraMeetingsPage .wf-dash-stat-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:12px; }
  .ilmoraMeetingsPage .wf-dash-stat-card{ background:var(--card); border:1px solid var(--border); border-radius:16px; padding:15px; transition:transform .2s; }
  .ilmoraMeetingsPage .wf-dash-stat-card:hover{ transform:translateY(-3px); }
  .ilmoraMeetingsPage .wf-dash-stat-icon{ width:30px; height:30px; border-radius:9px; background:rgba(22,163,74,.14); color:#128a3e; display:flex; align-items:center; justify-content:center; margin-bottom:11px; }
  .ilmoraMeetingsPage .wf-dash-stat-card.wf-tone-live .wf-dash-stat-icon{ background:rgba(229,72,77,.14); color:#E5484D; }
  .ilmoraMeetingsPage .wf-dash-stat-card.wf-tone-amber .wf-dash-stat-icon{ background:rgba(249,115,22,.14); color:#c2620d; }
  .ilmoraMeetingsPage .wf-dash-stat-value{ font-family:var(--font-display); font-size:23px; font-weight:800; color:var(--ink); }
  .ilmoraMeetingsPage .wf-dash-stat-label{ font-size:10.5px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }
  .ilmoraMeetingsPage .wf-dash-stat-delta{ font-size:11px; color:#16a34a; margin-top:7px; font-weight:700; }

  .ilmoraMeetingsPage .wf-session-panel{ background:var(--card); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
  .ilmoraMeetingsPage .wf-session-head{ display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid var(--border); }
  .ilmoraMeetingsPage .wf-session-tabs{ display:flex; gap:16px; }
  .ilmoraMeetingsPage .wf-session-tabs span{ font-size:12.5px; font-weight:700; color:var(--muted); padding-bottom:4px; border-bottom:2px solid transparent; cursor:pointer; transition:color .15s, border-color .15s; }
  .ilmoraMeetingsPage .wf-session-tabs span.wf-active{ color:var(--ink); border-color:#16a34a; }
  .ilmoraMeetingsPage .wf-srow{ display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid var(--border); animation:wfFadeIn .3s ease; }
  .ilmoraMeetingsPage .wf-srow:last-child{ border-bottom:none; }
  .ilmoraMeetingsPage .wf-sdot{ width:8px; height:8px; border-radius:50%; background:#94A3B8; flex-shrink:0; }
  .ilmoraMeetingsPage .wf-sdot.wf-dot-live{ background:#E5484D; box-shadow:0 0 0 3px rgba(229,72,77,.18); animation:wfPulse 1.8s infinite; }
  .ilmoraMeetingsPage .wf-sdot.wf-dot-sched{ background:#4C6EF5; }
  @keyframes wfPulse{ 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
  .ilmoraMeetingsPage .wf-smain{ flex:1; min-width:0; }
  .ilmoraMeetingsPage .wf-smain b{ font-size:13px; display:block; color:var(--ink); }
  .ilmoraMeetingsPage .wf-smain span{ font-size:11.5px; color:var(--muted); }
  .ilmoraMeetingsPage .wf-stime{ font-size:11.5px; color:var(--muted); white-space:nowrap; }
  .ilmoraMeetingsPage .wf-sjoin{ font-size:11.5px; font-weight:700; padding:7px 12px; border-radius:8px; border:none; cursor:pointer; white-space:nowrap; }
  .ilmoraMeetingsPage .wf-sjoin.wf-join-live{ background:#E5484D; color:#fff; }
  .ilmoraMeetingsPage .wf-sjoin.wf-join-sched{ background:var(--ink); color:var(--card); }
  .ilmoraMeetingsPage .wf-sjoin.wf-join-done{ background:var(--bg); color:var(--muted); cursor:not-allowed; }

  .ilmoraMeetingsPage .wf-timeline-head{ display:flex; justify-content:space-between; margin-bottom:12px; font-size:11px; color:#9AA6BC; }
  .ilmoraMeetingsPage .wf-timeline-track{ height:40px; background:#152238; border-radius:8px; position:relative; overflow:hidden; margin-bottom:9px; }
  .ilmoraMeetingsPage .wf-seg{ position:absolute; top:0; bottom:0; border-right:2px solid #0E1A2C; }
  .ilmoraMeetingsPage .wf-seg1{ left:0; width:22%; background:#2B4C6F; }
  .ilmoraMeetingsPage .wf-seg2{ left:22%; width:33%; background:#16a34a; }
  .ilmoraMeetingsPage .wf-seg3{ left:55%; width:20%; background:#2B4C6F; }
  .ilmoraMeetingsPage .wf-seg4{ left:75%; width:25%; background:#3B5C82; }
  .ilmoraMeetingsPage .wf-playhead{ position:absolute; top:-4px; bottom:-4px; width:2px; background:#fff; left:38%; animation:wfScrub 6s ease-in-out infinite; }
  @keyframes wfScrub{ 0%,100%{ left:38%; } 50%{ left:60%; } }
  .ilmoraMeetingsPage .wf-clip-tags{ display:flex; gap:7px; flex-wrap:wrap; }
  .ilmoraMeetingsPage .wf-clip-tags span{ font-size:10px; color:#9AA6BC; background:#152238; padding:5px 9px; border-radius:6px; }
  .ilmoraMeetingsPage .wf-clip-tags span.wf-hl{ color:#04211D; background:#16a34a; }

  .ilmoraMeetingsPage .wf-summary-head{ display:flex; align-items:center; gap:9px; margin-bottom:12px; }
  .ilmoraMeetingsPage .wf-ai-badge{ background:linear-gradient(135deg,#16a34a,#0d8f81); color:#04211D; font-size:9.5px; font-weight:800; padding:4px 9px; border-radius:6px; letter-spacing:.04em; }
  .ilmoraMeetingsPage .wf-summary-card h5{ font-size:13.5px; font-family:var(--font-display); color:#E7ECF5; margin:0; }
  .ilmoraMeetingsPage .wf-summary-card ul{ list-style:none; display:flex; flex-direction:column; gap:9px; margin:0 0 14px; padding:0; }
  .ilmoraMeetingsPage .wf-summary-card ul li{ font-size:12.5px; color:#C4CCDD; padding-left:16px; position:relative; line-height:1.5; }
  .ilmoraMeetingsPage .wf-summary-card ul li::before{ content:"—"; position:absolute; left:0; color:#5eead4; }
  .ilmoraMeetingsPage .wf-action-item{ display:flex; align-items:center; gap:8px; background:#152238; padding:8px 10px; border-radius:8px; font-size:11.5px; margin-bottom:6px; color:#D7DEEA; }
  .ilmoraMeetingsPage .wf-action-item input{ accent-color:#16a34a; }

  /* ═══════════════════════════════════════════════════════════════
     DASHBOARD SECTION — hero-style intro polish. This is the very
     first section on the page, so it gets its own pill eyebrow +
     soft glow backdrop (instead of the plain generic .wf-eyebrow)
     and the stat cards get a live gradient edge, a pulsing "live"
     icon ring, and a scale+fade entrance so it reads like an actual
     living dashboard overview rather than four static boxes.
  ─────────────────────────────────────────────────────────────────── */
  .ilmoraMeetingsPage .wf-dash-hero{ position:relative; overflow:hidden; }
  .ilmoraMeetingsPage .wf-dash-hero-glow{
    position:absolute; top:-140px; left:50%; transform:translateX(-50%);
    width:680px; height:440px; pointer-events:none; z-index:0;
    background:radial-gradient(circle, rgba(76,110,245,.14) 0%, rgba(249,115,22,.06) 45%, rgba(76,110,245,0) 72%);
    filter:blur(10px);
  }
  .ilmoraMeetingsPage .wf-dash-hero .wf-band-inner{ position:relative; z-index:1; }

  .ilmoraMeetingsPage .wf-dash-eyebrow{
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(76,110,245,.1); color:#4C6EF5;
    border:1px solid rgba(76,110,245,.22);
    font-size:11.5px; font-weight:800; letter-spacing:.06em; text-transform:uppercase;
    padding:6px 13px; border-radius:999px; margin-bottom:14px;
  }
  .ilmoraMeetingsPage .wf-dash-heading-accent{ color:var(--brand-2); }

  .ilmoraMeetingsPage .wf-dash-stat-card{ position:relative; }
  .ilmoraMeetingsPage .wf-dash-stat-card::before{
    content:""; position:absolute; left:0; right:0; top:0; height:3px;
    border-radius:16px 16px 0 0; background:linear-gradient(90deg,var(--brand),var(--brand-2));
    opacity:0; transition:opacity .25s ease;
  }
  .ilmoraMeetingsPage .wf-dash-stat-card:hover{ box-shadow:0 16px 36px rgba(0,0,0,.1); border-color:transparent; }
  .ilmoraMeetingsPage .wf-dash-stat-card:hover::before{ opacity:1; }

  .ilmoraMeetingsPage .wf-dash-icon-pulse{ position:relative; }
  .ilmoraMeetingsPage .wf-dash-icon-pulse::after{
    content:""; position:absolute; inset:0; border-radius:9px;
    box-shadow:0 0 0 0 rgba(229,72,77,.45);
    animation:wfDashPulseRing 1.8s ease-out infinite;
  }
  @keyframes wfDashPulseRing{
    0%{ box-shadow:0 0 0 0 rgba(229,72,77,.45); }
    70%{ box-shadow:0 0 0 9px rgba(229,72,77,0); }
    100%{ box-shadow:0 0 0 0 rgba(229,72,77,0); }
  }

  .ilmoraMeetingsPage .wf-dash-stat-value{ display:inline-flex; align-items:baseline; }

  /* Overrides the base .wf-reveal entrance for just the four stat cards:
     scale+fade instead of a plain slide-up, so they feel like they're
     "landing" into place rather than just appearing. */
  .ilmoraMeetingsPage .wf-dash-stat-reveal{
    opacity:0; transform:translateY(20px) scale(.92);
    transition:opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1);
  }
  .ilmoraMeetingsPage .wf-dash-stat-reveal.wf-in{ opacity:1; transform:translateY(0) scale(1); }

  /* ═══════════════════════════════════════════════════════════════
     RESPONSIVE — laptop / desktop / iPad / iPad mini / tablet /
     phone / small phone. Mobile-first overrides layered narrowest
     last isn't needed here since we go wide → narrow; each query
     only changes what actually breaks at that width.
  ─────────────────────────────────────────────────────────────────── */

  /* Laptops (1280–1440) — slightly tighter max width use, no layout change needed,
     clamp()s above already scale type down smoothly. */
  @media (max-width:1440px){
    .ilmoraMeetingsPage .hero,
    .ilmoraMeetingsPage section,
    .ilmoraMeetingsPage .wf-band-inner{ max-width:1120px; }
  }

  /* iPad Pro / small laptop landscape */
  @media (max-width:1024px){
    .ilmoraMeetingsPage .hero{ gap:26px; }
    .ilmoraMeetingsPage .wf-feat-row,
    .ilmoraMeetingsPage .wf-feat-row.wf-rev{ gap:28px; }
    .ilmoraMeetingsPage .pc-card{ width:min(84vw, 700px); }
  }

  /* iPad Air / large tablet portrait, and 2-col grids kick in */
  @media (max-width:920px){
    .ilmoraMeetingsPage .hero{ grid-template-columns:1fr; }
    .ilmoraMeetingsPage .hero > div:first-child{ order:1; }
    .ilmoraMeetingsPage .mock{ order:2; }
    .ilmoraMeetingsPage .stat-grid{ grid-template-columns:repeat(2,1fr); }
    .ilmoraMeetingsPage .wf-feat-row,
    .ilmoraMeetingsPage .wf-feat-row.wf-rev{ grid-template-columns:1fr; gap:24px; }
    .ilmoraMeetingsPage .wf-feat-row.wf-rev .wf-feat-copy{ order:0; }
    .ilmoraMeetingsPage .wf-dash-stat-grid{ grid-template-columns:repeat(2,1fr); }
  }

  /* iPad / iPad mini portrait */
  @media (max-width:834px){
    .ilmoraMeetingsPage section,
    .ilmoraMeetingsPage .wf-band-inner{ padding-left:20px; padding-right:20px; }
    .ilmoraMeetingsPage .demo-hero-media{ aspect-ratio:16/10; max-height:none; }
    .ilmoraMeetingsPage .cta-band{ flex-direction:column; }
    .ilmoraMeetingsPage .cta-band-media{ flex-basis:auto; height:150px; border-radius:0; }
    .ilmoraMeetingsPage .cta-band-content{ padding:24px 20px; }
  }

  @media (max-width:768px){
    .ilmoraMeetingsPage #carousel-section.pc-section{ padding:48px 18px; }
    .ilmoraMeetingsPage .pc-card{ padding:12px; border-radius:20px; }
    .ilmoraMeetingsPage .pc-stage{ border-radius:14px; }
    .ilmoraMeetingsPage .section-head h2.heading-nowrap,
    .ilmoraMeetingsPage .pc-head h2.pc-head-title-nowrap,
    .ilmoraMeetingsPage .demo-hero-content h2.demo-hero-title-nowrap{ white-space:normal; font-size:clamp(1.5rem, 5.4vw, 2.1rem); }
    .ilmoraMeetingsPage .wf-trust-row{ flex-direction:column; }
  }

  /* Large phones */
  @media (max-width:600px){
    .ilmoraMeetingsPage .hero{ padding:22px 18px 6px; }
    .ilmoraMeetingsPage section,
    .ilmoraMeetingsPage .wf-band-inner{ padding:32px 18px; }
    .ilmoraMeetingsPage .join-by-code{ min-width:0; width:100%; }
    .ilmoraMeetingsPage .hero-ctas{ width:100%; }
    .ilmoraMeetingsPage .new-meeting-split{ width:100%; }
    .ilmoraMeetingsPage .split-btn-main{ flex:1; }
    .ilmoraMeetingsPage .stat-grid{ grid-template-columns:repeat(2,1fr); gap:10px; }
    .ilmoraMeetingsPage .wf-dash-stat-grid{ grid-template-columns:repeat(2,1fr); gap:10px; }
    .ilmoraMeetingsPage .demo-hero-media{ aspect-ratio:9/13; max-height:none; border-radius:18px; }
    .ilmoraMeetingsPage .demo-hero-content{ padding:28px 18px; }
  }

  /* iPhone 12–15 / mid Android */
  @media (max-width:430px){
    .ilmoraMeetingsPage .hero h1{ font-size:clamp(1.5rem, 7vw, 2rem); }
    .ilmoraMeetingsPage .wf-h3{ font-size:clamp(1.25rem, 6vw, 1.6rem); }
    .ilmoraMeetingsPage .pc-wrap{ padding:0 4px; }
    .ilmoraMeetingsPage .wf-toggle-demo{ gap:16px; }
    .ilmoraMeetingsPage .wf-toggle-circle{ width:52px; height:52px; }
  }

  /* Small phones (iPhone SE etc.) */
  @media (max-width:375px){
    .ilmoraMeetingsPage .hero,
    .ilmoraMeetingsPage section,
    .ilmoraMeetingsPage .wf-band-inner{ padding-left:14px; padding-right:14px; }
    .ilmoraMeetingsPage .stat-grid,
    .ilmoraMeetingsPage .wf-dash-stat-grid{ grid-template-columns:1fr; }
    .ilmoraMeetingsPage .wf-code-row span{ height:36px; font-size:14px; }
  }
`;