import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

/* ─── TypeWriter ─────────────────────────────────────────────────────────── */
function TypeWriter({
  texts = [], typingSpeed = 75, deletingSpeed = 50, pauseDuration = 1500,
  showCursor = true, cursorCharacter = "_", cursorBlinkDuration = 0.5,
  variableSpeedEnabled = false, variableSpeedMin = 60, variableSpeedMax = 120, className = "",
}) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase]         = useState("typing");
  const [index, setIndex]         = useState(0);
  const [charPos, setCharPos]     = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  const getSpeed = useCallback(
    (base) => variableSpeedEnabled
      ? Math.random() * (variableSpeedMax - variableSpeedMin) + variableSpeedMin
      : base,
    [variableSpeedEnabled, variableSpeedMin, variableSpeedMax]
  );

  useEffect(() => {
    if (!showCursor) return;
    const id = setInterval(() => setCursorVisible((v) => !v), cursorBlinkDuration * 1000);
    return () => clearInterval(id);
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[index % texts.length];
    if (phase === "typing") {
      if (charPos < current.length) {
        const t = setTimeout(() => { setDisplayed(current.slice(0, charPos + 1)); setCharPos((p) => p + 1); }, getSpeed(typingSpeed));
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("deleting"), pauseDuration);
        return () => clearTimeout(t);
      }
    }
    if (phase === "deleting") {
      if (charPos > 0) {
        const t = setTimeout(() => { setDisplayed(current.slice(0, charPos - 1)); setCharPos((p) => p - 1); }, getSpeed(deletingSpeed));
        return () => clearTimeout(t);
      } else { setIndex((i) => (i + 1) % texts.length); setPhase("typing"); }
    }
  }, [phase, charPos, index, texts, typingSpeed, deletingSpeed, pauseDuration, getSpeed]);

  return (
    <span className={className} aria-live="polite">
      {displayed}
      {showCursor && <span style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }} aria-hidden="true">{cursorCharacter}</span>}
    </span>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const ALL_COURSES = {
  product: [
    { id:1, title:"Product Management Mastery", instructor:"Ex-Google PM",      duration:"8 weeks",  students:"2,500+", rating:4.9, level:"Intermediate", desc:"Master product lifecycle from ideation to launch. Roadmapping, prioritization & metrics that matter.",           price:"₹49,000", videoId:"1", modules:5, lessons:81 },
    { id:2, title:"Product Analytics",          instructor:"Ex-Amazon",          duration:"6 weeks",  students:"1,800+", rating:4.8, level:"Advanced",      desc:"Data-driven product decisions. A/B testing, cohort analysis & funnel optimization.",                           price:"₹39,000", videoId:"2", modules:5, lessons:60 },
    { id:3, title:"Product Strategy",           instructor:"Ex-Meta",            duration:"10 weeks", students:"2,100+", rating:4.9, level:"Advanced",      desc:"Strategic frameworks for product success. Positioning, competitive analysis & growth strategies.",               price:"₹59,000", videoId:"3", modules:5, lessons:90 },
  ],
  design: [
    { id:4, title:"UI/UX Design Bootcamp",      instructor:"Ex-Airbnb Designer", duration:"12 weeks", students:"3,200+", rating:5.0, level:"Beginner",      desc:"Complete UI/UX journey from research to prototype. Figma mastery & portfolio projects.",                       price:"₹69,000", videoId:"4", modules:5, lessons:110 },
    { id:5, title:"Design Systems",             instructor:"Ex-Netflix",         duration:"8 weeks",  students:"1,500+", rating:4.8, level:"Advanced",      desc:"Build scalable design systems. Components, tokens, documentation & developer handoff.",                         price:"₹45,000", videoId:"5", modules:5, lessons:70 },
    { id:6, title:"User Research Pro",          instructor:"Ex-Microsoft",       duration:"6 weeks",  students:"1,900+", rating:4.7, level:"Intermediate", desc:"Research methods that drive product decisions. Interviews, surveys & usability testing.",                        price:"₹35,000", videoId:"6", modules:5, lessons:55 },
  ],
  growth: [
    { id:7, title:"Growth Marketing",           instructor:"Ex-Uber Growth",     duration:"8 weeks",  students:"2,800+", rating:4.9, level:"Intermediate", desc:"Growth loops, viral mechanics & acquisition strategies that scale businesses.",                                  price:"₹49,000", videoId:"7", modules:5, lessons:75 },
    { id:8, title:"SEO & Content Strategy",     instructor:"Ex-Spotify",         duration:"10 weeks", students:"2,300+", rating:4.8, level:"Intermediate", desc:"Organic growth mastery. Technical SEO, content systems & link building at scale.",                              price:"₹55,000", videoId:"8", modules:5, lessons:85 },
    { id:9, title:"Performance Marketing",      instructor:"Ex-Swiggy",          duration:"8 weeks",  students:"2,600+", rating:4.9, level:"Advanced",      desc:"Paid acquisition at scale. Facebook, Google, creative testing & LTV optimization.",                            price:"₹47,000", videoId:"9", modules:5, lessons:72 },
  ],
};

const LEVEL_STYLES = {
  Beginner:     { bg:"#dcfce7", color:"#15803d" },
  Intermediate: { bg:"#fff7ed", color:"#c2410c", border:"#fed7aa" },
  Advanced:     { bg:"#f1f5f9", color:"#1e293b", border:"#cbd5e1" },
};

const TOOLS = [
  { icon:"texora",     desc:"AI-powered platform redefining professional growth, automation and business intelligence at scale.",         tags:["AI Platform","Flagship"],   key:"texora",    route:"https://texora.ai/" },
  { icon:"tora-cx",   desc:"Customer experience platform powered by AI. Automate support, boost satisfaction and retain more users.",    tags:["Customer AI","Free Trial"], key:"tora-cx",   route:"https://tora-cx.texora.ai/" },
  { icon:"crm",       desc:"Smart CRM built for modern teams. Track leads, manage pipelines and close deals faster with AI insights.",   tags:["CRM","Free"],               key:"crmorbit",  route:"https://crm-orbit.texora.ai/" },
  { icon:"ilm_ora",   desc:"AI-powered learning platform. World-class courses, skill assessments, resume builder & mock interviews.",    tags:["EdTech","You are here"],    key:"ilmora",    route:"https://ilm.ora.texora.ai/" },
  { icon:"taskorbit", desc:"Smarter task & team management. AI nudges, goal tracking and workflow automation in one clean space.",       tags:["Productivity","Free"],      key:"taskorbit", route:"https://task-orbit.texora.ai/" },
  { icon:"innovara",  desc:"Next-gen AI innovation suite. Build, deploy and scale AI solutions for your business effortlessly.",        tags:["AI Builder","Beta"],        key:"innovora",  route:"https://texora.ai/innovora-ai" },
];

const STATS = [
  { value:"50K+", label:"Active Learners" },
  { value:"95%",  label:"Success Rate" },
  { value:"100+", label:"Expert Mentors" },
  { value:"4.9★", label:"Average Rating" },
];

const COMPANIES    = ["Capgemini","Microsoft","Google","Amazon","Apple","Cognizant","Texora","UFS"];
const QUICK_ACTIONS = [];

const BLOG_POSTS = [
  {
    emoji:"",
    cover:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80",
    title:"How ILM ORA Is Redefining Professional Learning in 2026",
    cat:"Platform Updates", date:"Mar 26, 2026", reads:4, featured:true,
    excerpt:"From AI-powered skill scores to real-time mentor sessions — here's how ILM ORA is changing the game for working professionals.",
  },
  {
    emoji:"",
    cover:"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80",
    title:"Task Orbit: A Smarter Way to Manage Learning Teams",
    cat:"Product Updates", date:"Mar 23, 2026", reads:7,
    excerpt:"Built for team leads and L&D managers who want clarity, automation, and zero friction.",
  },
  {
    emoji:"",
    cover:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
    title:"What Is a Skill Score? And Why It Decides Your Career",
    cat:"How-To Guides", date:"Mar 23, 2026", reads:5,
    excerpt:"Your Skill Score is more than a number — it's a career signal that employers and mentors are watching.",
  },
  {
    emoji:"",
    cover:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    title:"Why 'Course Sync' Might Be the Missing Piece in Your Growth",
    cat:"Use Cases", date:"Mar 20, 2026", reads:3,
    excerpt:"Synchronising your learning goals with your team calendar sounds simple. The results are anything but.",
  },
];

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function IlmOraDemoPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("product");

  const savedUser = JSON.parse(localStorage.getItem("lms_user") || "{}");
  const userName  = savedUser?.name || savedUser?.email?.split("@")[0] || "there";

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const currentCourses = ALL_COURSES[activeTab] || ALL_COURSES.product;

  const heroRef    = useRef(null);
  const statsRef   = useRef(null);
  const toolsRef   = useRef(null);
  const coursesRef = useRef(null);
  const blogRef    = useRef(null);
  const ctaRef     = useRef(null);

  // scrollToSection helper used by footer
  const scrollToSection = (id, tab) => {
    if (tab) setActiveTab(tab);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults:{ ease:"power3.out" } });
      tl.fromTo(".d-hero-greeting", { opacity:0, y:20 }, { opacity:1, y:0, duration:0.5 })
        .fromTo(".d-hero-name",     { opacity:0, y:24 }, { opacity:1, y:0, duration:0.55 }, "-=0.25")
        .fromTo(".d-hero-subtitle", { opacity:0, y:16 }, { opacity:1, y:0, duration:0.45 }, "-=0.2")
        .fromTo(".d-quick-btn",     { opacity:0, y:14, scale:0.96 }, { opacity:1, y:0, scale:1, duration:0.4, stagger:0.07 }, "-=0.15")
        .fromTo(".d-hero-title",    { opacity:0, y:32 }, { opacity:1, y:0, duration:0.6 }, "-=0.2")
        .fromTo(".d-hero-typing",   { opacity:0, y:14 }, { opacity:1, y:0, duration:0.45 }, "-=0.25")
        .fromTo(".d-hero-btns",     { opacity:0, y:14 }, { opacity:1, y:0, duration:0.4 }, "-=0.2");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-stat", { opacity:0, y:30 }, { opacity:1, y:0, duration:0.55, stagger:0.1, ease:"power3.out", scrollTrigger:{ trigger:statsRef.current, start:"top 85%" } });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-tool-card", { opacity:0, y:40, scale:0.97 }, { opacity:1, y:0, scale:1, duration:0.5, stagger:0.08, ease:"power3.out", scrollTrigger:{ trigger:toolsRef.current, start:"top 80%" } });
    }, toolsRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-course-card", { opacity:0, y:36 }, { opacity:1, y:0, duration:0.45, stagger:0.09, ease:"power3.out", scrollTrigger:{ trigger:coursesRef.current, start:"top 85%", toggleActions:"play none none none" } });
    }, coursesRef);
    return () => ctx.revert();
  }, [activeTab]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-blog-featured,.d-blog-side-card", { opacity:0, y:32 }, { opacity:1, y:0, duration:0.5, stagger:0.1, ease:"power3.out", scrollTrigger:{ trigger:blogRef.current, start:"top 85%" } });
    }, blogRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-cta", { opacity:0, y:40, scale:0.98 }, { opacity:1, y:0, scale:1, duration:0.6, ease:"power3.out", scrollTrigger:{ trigger:ctaRef.current, start:"top 85%" } });
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .d-page { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #F6EDE6; color: #1E293B; overflow-x: hidden; }

        /* ── NAVBAR ── */
        .d-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 68px; background: rgba(246,237,230,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(249,115,22,0.15); box-shadow: 0 1px 20px rgba(0,0,0,0.06); }
        @media(min-width:768px){ .d-nav { padding: 0 48px; } }
        .d-nav-logo { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .d-beta { font-family: 'DM Sans', sans-serif; font-size: 0.58rem; font-weight: 700; background: #F97316; color: #fff; border-radius: 6px; padding: 2px 7px; letter-spacing: 0.05em; }
        .d-nav-right { display: flex; align-items: center; gap: 10px; }
        .d-btn-login { font-size: 0.8rem; font-weight: 600; color: #475569; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 18px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.18s; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
        .d-btn-login:hover { border-color: #F97316; color: #F97316; }
        .d-btn-signup { font-size: 0.8rem; font-weight: 700; color: #fff; background: #1E293B; border: none; border-radius: 10px; padding: 8px 20px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.18s; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(30,41,59,0.25); }
        .d-btn-signup:hover { background: #334155; transform: translateY(-1px); }

        /* ── HERO ── */
        .d-hero { background: linear-gradient(135deg, #F6EDE6 0%, #fff 60%, #F6EDE6 100%); padding: 56px 24px 48px; text-align: center; position: relative; overflow: hidden; }
        @media(min-width:768px){ .d-hero { padding: 72px 48px 60px; } }
        .d-hero::before { content:''; position:absolute; top:-100px; right:-100px; width:400px; height:400px; background:rgba(249,115,22,0.06); border-radius:50%; pointer-events:none; }
        .d-hero::after  { content:''; position:absolute; bottom:-80px; left:-80px; width:300px; height:300px; background:rgba(34,197,94,0.05); border-radius:50%; pointer-events:none; }
        .d-hero-welcome { display:flex; flex-direction:column; align-items:center; gap:4px; margin-bottom:20px; }
        .d-hero-greeting { font-size:0.82rem; font-weight:600; color:#94a3b8; display:flex; align-items:center; gap:7px; }
        .d-hero-name { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:900; color:#1E293B; }
        .d-hero-name .ora { color:#F97316; }
        .d-hero-subtitle { font-size:0.85rem; color:#64748b; }
        .d-quick-actions { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:28px; }
        .d-quick-btn { display:flex; align-items:center; gap:7px; padding:10px 18px; background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; color:#1E293B; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:700; cursor:pointer; transition:all 0.18s; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
        .d-quick-btn:hover { border-color:#F97316; color:#F97316; transform:translateY(-2px); }
        .d-hero-title { font-family:'Playfair Display',serif; font-size:2.8rem; font-weight:900; line-height:1.1; color:#1E293B; margin-bottom:16px; }
        @media(min-width:768px){ .d-hero-title { font-size:4rem; } }
        .d-hero-title .ora { color:#F97316; }
        .d-hero-title .ilm { color:#16a34a; }
        .d-hero-typing { min-height:2em; margin-bottom:24px; font-size:1.05rem; color:#64748b; display:flex; align-items:center; justify-content:center; gap:6px; }
        .d-typewriter { color:#F97316; font-weight:700; font-size:1.1rem; }
        .d-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .d-hero-secondary { background:#fff; color:#1E293B; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px 32px; font-size:0.95rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; gap:8px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
        .d-hero-secondary:hover { border-color:#1E293B; transform:translateY(-2px); }

        /* ── STATS ── */
        .d-stats { background:#1E293B; padding:36px 24px; display:grid; grid-template-columns:repeat(2,1fr); gap:1px; }
        @media(min-width:640px){ .d-stats { grid-template-columns:repeat(4,1fr); padding:36px 48px; } }
        .d-stat { text-align:center; padding:20px 10px; }
        .d-stat-val { font-size:2rem; font-weight:800; color:#F97316; }
        .d-stat-lbl { font-size:0.78rem; color:rgba(255,255,255,0.5); margin-top:4px; font-weight:500; }

        /* ── SECTION ── */
        .d-section { padding:64px 24px; }
        @media(min-width:768px){ .d-section { padding:72px 48px; } }
        .d-section-inner { max-width:1200px; margin:0 auto; }
        .d-section-head { text-align:center; margin-bottom:40px; }
        .d-section-tag { display:inline-block; font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#F97316; background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.2); border-radius:999px; padding:4px 14px; margin-bottom:12px; }
        .d-section-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:#1E293B; }
        @media(min-width:768px){ .d-section-title { font-size:2.6rem; } }
        .d-section-title .accent { color:#F97316; }
        .d-section-sub { font-size:0.95rem; color:#64748b; margin-top:8px; max-width:500px; margin-left:auto; margin-right:auto; }

        /* ── TOOLS ── */
        .d-tools-grid { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:640px){ .d-tools-grid { grid-template-columns:repeat(3,1fr); } }
        .d-tool-card { background:#fff; border-radius:20px; padding:24px; cursor:pointer; border:1.5px solid #f1f5f9; box-shadow:0 2px 12px rgba(0,0,0,0.05); transition:all 0.22s; display:flex; flex-direction:column; gap:14px; }
        .d-tool-card:hover { border-color:#F97316; box-shadow:0 12px 32px rgba(249,115,22,0.15); transform:translateY(-4px); }
        .d-tool-icon { overflow:hidden; border-radius:10px; }
        .d-tool-title { font-size:1rem; font-weight:800; color:#1E293B; }
        .d-tool-desc { font-size:0.8rem; color:#64748b; line-height:1.65; flex:1; }
        .d-tool-tags { display:flex; gap:7px; flex-wrap:wrap; margin-top:auto; }
        .d-tool-tag { font-size:0.65rem; font-weight:700; border-radius:999px; padding:3px 10px; background:rgba(249,115,22,0.08); color:#F97316; border:1px solid rgba(249,115,22,0.2); }
        .d-tool-tag.green { background:rgba(34,197,94,0.08); color:#16a34a; border-color:rgba(34,197,94,0.2); }
        .d-tool-cta { display:flex; align-items:center; justify-content:space-between; margin-top:4px; }
        .d-tool-try { font-size:0.78rem; font-weight:700; color:#F97316; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; padding:0; }

        /* ── TABS ── */
        .d-tabs { display:flex; gap:8px; justify-content:center; margin-bottom:32px; flex-wrap:wrap; }
        .d-tab { padding:9px 22px; border-radius:10px; font-size:0.82rem; font-weight:700; cursor:pointer; transition:all 0.18s; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; font-family:'DM Sans',sans-serif; }
        .d-tab.active { background:#1E293B; color:#fff; border-color:#1E293B; box-shadow:0 4px 12px rgba(30,41,59,0.2); }

        /* ── COURSES ── */
        .d-courses-grid { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:640px){ .d-courses-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .d-courses-grid { grid-template-columns:repeat(3,1fr); } }
        .d-course-card { background:#fff; border-radius:20px; border:1.5px solid #f1f5f9; box-shadow:0 2px 12px rgba(0,0,0,0.05); overflow:hidden; transition:all 0.22s; display:flex; flex-direction:column; }
        .d-course-card:hover { border-color:rgba(249,115,22,0.3); box-shadow:0 16px 40px rgba(0,0,0,0.1); transform:translateY(-4px); }
        .d-course-body { padding:20px; flex:1; display:flex; flex-direction:column; gap:10px; }
        .d-course-head { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
        .d-course-level { font-size:0.65rem; font-weight:700; border-radius:999px; padding:3px 10px; border:1px solid; }
        .d-course-rating { font-size:0.7rem; font-weight:700; background:#fff7ed; color:#c2410c; border:1px solid #fed7aa; border-radius:999px; padding:3px 10px; white-space:nowrap; display:flex; align-items:center; gap:3px; }
        .d-course-title { font-size:1rem; font-weight:800; color:#1E293B; line-height:1.3; }
        .d-course-instructor { font-size:0.75rem; color:#94a3b8; }
        .d-course-desc { font-size:0.8rem; color:#64748b; line-height:1.6; flex:1; }
        .d-course-meta { display:flex; gap:16px; padding:12px 0; border-top:1px solid #f1f5f9; border-bottom:1px solid #f1f5f9; flex-wrap:wrap; }
        .d-course-meta-item { font-size:0.72rem; color:#94a3b8; display:flex; align-items:center; gap:4px; }
        .d-course-meta-item span.val { color:#1E293B; font-weight:600; }
        .d-course-price { font-size:1.1rem; font-weight:800; color:#1E293B; }
        .d-course-actions { display:flex; gap:8px; margin-top:4px; }
        .d-btn-watch { flex:1; padding:10px; border-radius:10px; font-size:0.78rem; font-weight:700; background:#F6EDE6; color:#F97316; border:1.5px solid rgba(249,115,22,0.25); cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; justify-content:center; gap:5px; }
        .d-btn-watch:hover { background:rgba(249,115,22,0.12); border-color:#F97316; }
        .d-btn-apply { flex:1; padding:10px; border-radius:10px; font-size:0.78rem; font-weight:700; background:#1E293B; color:#fff; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; justify-content:center; gap:5px; }
        .d-btn-apply:hover { background:#334155; }

        /* ── COMPANIES ── */
        .d-companies { background:#fff; padding:48px 24px; }
        .d-companies-inner { max-width:1200px; margin:0 auto; }
        .d-companies-label { text-align:center; font-size:0.72rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#94a3b8; margin-bottom:28px; }
        .d-companies-grid { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
        .d-company-pill { background:#F6EDE6; border:1px solid #e2e8f0; border-radius:10px; padding:10px 20px; font-size:0.82rem; font-weight:700; color:#475569; transition:all 0.18s; }
        .d-company-pill:hover { border-color:#F97316; color:#F97316; }

        /* ── BLOG v2 ── */
        .d-blog-grid { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:768px){ .d-blog-grid { grid-template-columns:1.6fr 1fr; gap:24px; } }
        .d-blog-featured { background:#fff; border-radius:20px; border:1.5px solid #f1f5f9; box-shadow:0 2px 12px rgba(0,0,0,0.05); overflow:hidden; cursor:pointer; transition:all 0.22s; display:flex; flex-direction:column; }
        .d-blog-featured:hover { border-color:rgba(249,115,22,0.35); box-shadow:0 16px 40px rgba(0,0,0,0.1); transform:translateY(-4px); }
        .d-blog-featured-img { width:100%; height:220px; object-fit:cover; display:block; }
        @media(min-width:768px){ .d-blog-featured-img { height:258px; } }
        .d-blog-featured-body { padding:22px 24px 26px; display:flex; flex-direction:column; gap:10px; flex:1; }
        .d-blog-featured-badge { display:inline-flex; align-items:center; gap:5px; font-size:0.6rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#fff; background:#F97316; border-radius:6px; padding:3px 10px; width:fit-content; }
        .d-blog-featured-title { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:900; color:#1E293B; line-height:1.3; }
        @media(min-width:768px){ .d-blog-featured-title { font-size:1.38rem; } }
        .d-blog-featured-excerpt { font-size:0.8rem; color:#64748b; line-height:1.65; flex:1; }
        .d-blog-featured-meta { display:flex; align-items:center; gap:8px; font-size:0.68rem; color:#94a3b8; margin-top:4px; flex-wrap:wrap; }
        .d-blog-featured-cat { color:#F97316; font-weight:700; }
        .d-blog-side { display:flex; flex-direction:column; gap:14px; }
        .d-blog-side-card { background:#fff; border-radius:16px; border:1.5px solid #f1f5f9; box-shadow:0 2px 8px rgba(0,0,0,0.04); padding:14px; cursor:pointer; transition:all 0.2s; display:flex; gap:12px; align-items:flex-start; }
        .d-blog-side-card:hover { border-color:rgba(249,115,22,0.3); box-shadow:0 8px 24px rgba(0,0,0,0.08); transform:translateX(4px); }
        .d-blog-side-img { width:72px; height:72px; border-radius:12px; object-fit:cover; flex-shrink:0; background:#f1f5f9; }
        .d-blog-side-body { flex:1; display:flex; flex-direction:column; gap:5px; }
        .d-blog-side-cat { font-size:0.58rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#F97316; }
        .d-blog-side-title { font-size:0.82rem; font-weight:700; color:#1E293B; line-height:1.4; }
        .d-blog-side-meta { font-size:0.66rem; color:#94a3b8; display:flex; gap:5px; align-items:center; margin-top:2px; }
        .d-blog-dot { width:3px; height:3px; border-radius:50%; background:#cbd5e1; flex-shrink:0; display:inline-block; }
        .d-blog-more-btn { display:inline-flex; align-items:center; gap:8px; margin-top:28px; padding:11px 28px; background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; font-size:0.82rem; font-weight:700; color:#1E293B; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
        .d-blog-more-btn:hover { border-color:#F97316; color:#F97316; transform:translateY(-2px); }

        /* ── CTA ── */
        .d-cta { background:#1E293B; border-radius:24px; padding:56px 32px; text-align:center; margin:0 24px 64px; position:relative; overflow:hidden; }
        @media(min-width:768px){ .d-cta { margin:0 48px 80px; } }
        .d-cta::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#F97316,#22c55e); }
        .d-cta-title { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:900; color:#fff; margin-bottom:12px; }
        .d-cta-sub { color:rgba(255,255,255,0.55); font-size:0.95rem; margin-bottom:32px; }
        .d-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .d-cta-primary { background:#F97316; color:#fff; border:none; border-radius:12px; padding:14px 32px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.4); }
        .d-cta-primary:hover { background:#ea6c0a; transform:translateY(-2px); }

        /* ── FOOTER ── */
        .d-footer-new { background:#fff; color:#1E293B; font-family:'DM Sans',sans-serif; }
        .d-footer-inner { max-width:1200px; margin:0 auto; padding:64px 24px 0; }
        .d-footer-grid { display:grid; gap:40px; grid-template-columns:1fr; }
        @media(min-width:768px){ .d-footer-grid { grid-template-columns:1fr 1fr; } }
        @media(min-width:1024px){ .d-footer-grid { grid-template-columns:2fr 1fr 1fr 1fr; } }
        .d-footer-brand h3 { font-size:1.8rem; font-weight:900; margin-bottom:12px; }
        .d-footer-brand p { font-size:0.82rem; color:#64748b; line-height:1.65; max-width:280px; margin-bottom:16px; }
        .d-footer-socials { display:flex; gap:10px; flex-wrap:wrap; }
        .d-footer-social-btn { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; transition:transform 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.15); flex-shrink:0; }
        .d-footer-social-btn:hover { transform:scale(1.1); }
        .d-footer-col h4 { font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#1E293B; margin-bottom:14px; }
        .d-footer-col ul { list-style:none; display:flex; flex-direction:column; gap:8px; }
        .d-footer-col ul li { font-size:0.82rem; color:#64748b; cursor:pointer; transition:color 0.18s; }
        .d-footer-col ul li:hover { color:#F97316; }
        .d-footer-bottom { max-width:1200px; margin:0 auto; padding:20px 24px; border-top:1px solid #e2e8f0; margin-top:48px; display:flex; flex-direction:column; align-items:center; gap:8px; font-size:0.72rem; color:#94a3b8; }
        @media(min-width:768px){ .d-footer-bottom { flex-direction:row; justify-content:space-between; } }

        @keyframes fpulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      <div className="d-page">

        {/* ═══ NAVBAR ═══ */}
        <nav className="d-nav">
          <div className="d-nav-logo" onClick={() => navigate("/")}>
            <span style={{color:"#16a34a"}}>ILM</span>
            <span style={{color:"#F97316"}}> ORA</span>
            <span className="d-beta">BETA</span>
          </div>
          <div className="d-nav-right">
            <button className="d-btn-login"  onClick={() => navigate("/login")}>Login</button>
            <button className="d-btn-signup" onClick={() => navigate("/complete-profile")}>Apply Now ✦</button>
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <section className="d-hero" ref={heroRef}>
          <div className="d-hero-welcome">
            <div className="d-hero-greeting"><span>👋</span> {greeting}</div>
            <div className="d-hero-name">Welcome back, <span className="ora">{userName}</span></div>
            <div className="d-hero-subtitle">Your AI-powered learning hub is ready. Pick up where you left off.</div>
          </div>
          <div className="d-quick-actions">
            {QUICK_ACTIONS.map(a => (
              <button key={a.label} className="d-quick-btn" onClick={() => navigate(a.route)}>
                <span>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>
          <h1 className="d-hero-title">
            Become the <span className="ora">Top 1%</span><br />
            with <span className="ilm">ILM</span> <span className="ora">ORA</span>
          </h1>
          <div className="d-hero-typing">
            <TypeWriter
              className="d-typewriter"
              texts={["Start today. Stay consistent.","Your next milestone awaits.","Learning compounds. Keep going.","Top 1% is a daily choice.","Built for ambitious professionals."]}
              typingSpeed={70} deletingSpeed={40} pauseDuration={1800}
              showCursor cursorCharacter="_" cursorBlinkDuration={0.5}
            />
          </div>
          <div className="d-hero-btns"></div>
        </section>

        {/* ═══ STATS ═══ */}
        <div className="d-stats" ref={statsRef} id="successstories">
          {STATS.map((s, i) => (
            <div key={i} className="d-stat">
              <div className="d-stat-val">{s.value}</div>
              <div className="d-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══ TOOLS ═══ */}
        <section className="d-section" style={{background:"#F6EDE6"}} ref={toolsRef}>
          <div className="d-section-inner">
            <div className="d-section-head">
              <div className="d-section-tag">Texora Products</div>
              <h2 className="d-section-title">Explore Our <span className="accent">Products</span></h2>
              <p className="d-section-sub">Powerful AI products built by Texora — click to explore</p>
            </div>
            <div className="d-tools-grid">
              {TOOLS.map(t => (
                <div key={t.key} className="d-tool-card" onClick={() => window.open(t.route, '_blank')}>
                  <div className="d-tool-icon" style={{background:"#f8fafc", padding:0, overflow:"hidden"}}>
                    {["texora","crm","ilm_ora","taskorbit","innovara","tora-cx"].includes(t.icon)
                      ? <img src={`/images/${t.icon}.jpeg`} alt={t.icon} style={{width:"100%",height:"100%",objectFit:"contain",borderRadius:"10px",padding:"4px 8px"}} />
                      : t.icon}
                  </div>
                  <div className="d-tool-title">{t.title}</div>
                  <div className="d-tool-desc">{t.desc}</div>
                  <div className="d-tool-tags">
                    {t.tags.map((tag, i) => <span key={tag} className={`d-tool-tag ${i === 1 ? "green" : ""}`}>{tag}</span>)}
                  </div>
                  <div className="d-tool-cta"><button className="d-tool-try">Try Free →</button></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ═══ BLOG ═══ */}
        <section className="d-section" style={{background:"#F6EDE6"}} ref={blogRef}>
          <div className="d-section-inner">
            <div className="d-section-head">
              <div className="d-section-tag">Latest Insights</div>
              <h2 className="d-section-title">From Our <span className="accent">Blog</span></h2>
              <p className="d-section-sub">Tips, updates and guides to grow your career</p>
            </div>
            <div className="d-blog-grid">
              <div className="d-blog-featured">
                <img className="d-blog-featured-img" src={BLOG_POSTS[0].cover} alt={BLOG_POSTS[0].title} onError={e => { e.target.style.height="120px"; e.target.style.background="#F6EDE6"; }} />
                <div className="d-blog-featured-body">
                  <span className="d-blog-featured-badge">⭐ Featured</span>
                  <div className="d-blog-featured-title">{BLOG_POSTS[0].title}</div>
                  <div className="d-blog-featured-excerpt">{BLOG_POSTS[0].excerpt}</div>
                  <div className="d-blog-featured-meta">
                    <span className="d-blog-featured-cat">{BLOG_POSTS[0].cat}</span>
                    <span className="d-blog-dot"/>
                    <span>{BLOG_POSTS[0].date}</span>
                    <span className="d-blog-dot"/>
                    <span>{BLOG_POSTS[0].reads} min read</span>
                  </div>
                </div>
              </div>
              <div className="d-blog-side">
                {BLOG_POSTS.slice(1).map((b, i) => (
                  <div key={i} className="d-blog-side-card">
                    <img className="d-blog-side-img" src={b.cover} alt={b.title} onError={e => { e.target.style.display="none"; }} />
                    <div className="d-blog-side-body">
                      <div className="d-blog-side-cat">{b.cat}</div>
                      <div className="d-blog-side-title">{b.title}</div>
                      <div className="d-blog-side-meta">
                        <span>{b.date}</span>
                        <span className="d-blog-dot"/>
                        <span>{b.reads} min read</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <div ref={ctaRef}>
          <div className="d-cta">
            <div className="d-cta-title">Ready to Transform Your Career?</div>
            <p className="d-cta-sub">Join 50,000+ professionals who've already taken the leap with ILM ORA</p>
            <div className="d-cta-btns">
              <button className="d-cta-primary" onClick={() => navigate("/complete-profile")}>Create Account →</button>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER (from LMSHomepage) ═══ */}
        <footer className="d-footer-new">
          <div className="d-footer-inner">
            <div className="d-footer-grid">

              {/* Brand col */}
              <div className="d-footer-brand">
                <h3>
                  <span style={{color:"#16a34a"}}>ILM</span>{" "}
                  <span style={{color:"#F97316"}}>ORA</span>
                </h3>
                <p>Modern learning platform for ambitious professionals who want to break into product, design and growth roles.</p>
                <div className="d-footer-socials">
                  <a href="https://www.youtube.com/@Texoraai" target="_blank" rel="noreferrer" className="d-footer-social-btn" style={{background:"#dc2626"}}>
                    <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/105596104" target="_blank" rel="noreferrer" className="d-footer-social-btn" style={{background:"#1d4ed8"}}>
                    <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="https://api.whatsapp.com/send?phone=919205299338" target="_blank" rel="noreferrer" className="d-footer-social-btn" style={{background:"#22c55e"}}>
                    <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/texora_ai" target="_blank" rel="noreferrer" className="d-footer-social-btn" style={{background:"#db2777"}}>
                    <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="currentColor"><path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.216 4 20 5.784 20 7.75v8.5C20 18.216 18.216 20 16.25 20h-8.5C5.784 20 4 18.216 4 16.25v-8.5C4 5.784 5.784 4 7.75 4zm4.25 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"/></svg>
                  </a>
                  <a href="https://x.com/texoraai" target="_blank" rel="noreferrer" className="d-footer-social-btn" style={{background:"#000"}}>
                    <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.54 7.482L22 22h-6.828l-5.34-6.977L3.64 22H1l7.042-8.053L2 2h6.828l4.86 6.35L18.244 2zm-2.396 18h1.89L8.224 4H6.176l9.672 16z"/></svg>
                  </a>
                </div>
              </div>

              {/* Company col only */}
<div className="d-footer-col">
  <h4>Company</h4>
  <ul>
    <li onClick={() => navigate("/about")}>About Us</li>
    <li onClick={() => navigate("/careers")}>Careers</li>
    <li onClick={() => navigate("/privacy-policy")}>Privacy Policy</li>
    <li onClick={() => navigate("/terms-of-service")}>Terms of Service</li>
  </ul>
</div>
            </div>
          </div>

          <div className="d-footer-bottom">
            <span>© {new Date().getFullYear()} ILM ORA All rights reserved.</span>
            <span>Built with passion for modern learners 🚀</span>
          </div>
        </footer>

      </div>
    </>
  );
}