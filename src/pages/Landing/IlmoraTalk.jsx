import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Mic, Briefcase, Building2, Target,
  ArrowRight, CheckCircle2, Star, Users, Award, TrendingUp,
  ChevronDown, Zap, Globe, Clock, BookOpen, Menu, Moon, Sun,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MegaMenu from "../../components/MegaMenu";

const PROGRAMS = [
  { id:1, Icon:MessageSquare, title:"Spoken English",          tagline:"Fluency From Day One",   desc:"Build natural English fluency through structured conversation practice, pronunciation drills, and real-world dialogue scenarios used by 1,000+ learners.",                                                                    duration:"8 Weeks", level:"Beginner–Intermediate", lessons:48, color:"#f97316", highlights:["Daily conversation practice with experts","Pronunciation & accent refinement","Grammar in context — not by rote","Reading, listening & speaking integrated"], badge:"Most Popular" },
  { id:2, Icon:Mic,           title:"Public Speaking",          tagline:"Command Any Room",       desc:"Transform stage fright into stage presence. Learn voice modulation, body language, storytelling structure, and how to hold attention from the first word.",                                                                    duration:"6 Weeks", level:"All Levels",             lessons:36, color:"#10b981", highlights:["Live practice sessions with feedback","Voice modulation & pacing techniques","Storytelling frameworks (Hero, STAR, etc.)","Handling Q&A and tough audiences"],            badge:"Top Rated"   },
  { id:3, Icon:Briefcase,     title:"Interview Communication",  tagline:"Crack Every Interview",  desc:"Master the language of interviews — from HR rounds to technical panels. Learn STAR answers, confident body language, and salary negotiation phrases.",                                                                           duration:"4 Weeks", level:"Intermediate",           lessons:24, color:"#6366f1", highlights:["Mock interviews with real-time feedback","STAR & behavioral answer frameworks","Salary & offer negotiation language","Body language & first-impression mastery"],         badge:"Career Boost"},
  { id:4, Icon:Building2,     title:"Corporate Communication",  tagline:"Speak Like a Leader",    desc:"Navigate meetings, emails, presentations and difficult conversations with executive-level communication skills used at Google, Infosys & Deloitte.",                                                                              duration:"6 Weeks", level:"Intermediate–Advanced",  lessons:40, color:"#f59e0b", highlights:["Email & report writing excellence","Meeting facilitation & influence","Conflict resolution communication","Cross-cultural business etiquette"],                          badge:null          },
  { id:5, Icon:Target,        title:"Presentation Skills",      tagline:"Slides That Persuade",   desc:"Design and deliver presentations that move people to action. Covers slide design principles, data storytelling, executive briefings, and live delivery coaching.",                                                               duration:"5 Weeks", level:"All Levels",             lessons:30, color:"#ec4899", highlights:["Slide design & visual storytelling","Data narration — making numbers land","Executive & boardroom presentations","Live delivery coaching & recordings"],                badge:null          },
];

const STATS = [
  { value:"12,000+", label:"Learners Transformed", Icon:Users },
  { value:"4.9★",   label:"Average Rating",        Icon:Star },
  { value:"95%",    label:"Confidence Boost",      Icon:TrendingUp },
  { value:"50+",    label:"Expert Coaches",         Icon:Award },
];

const TESTIMONIALS = [
  { name:"Sneha Kapoor", role:"Software Engineer @ TCS",  text:"The Interview Communication course completely changed how I present myself. Got 3 offers in 2 months after struggling for 6.", program:"Interview Comm.", rating:5 },
  { name:"Arjun Mehta",  role:"Team Lead @ Wipro",        text:"Public Speaking was a game-changer. I went from freezing on stage to leading all-hands meetings with 200+ people.",           program:"Public Speaking",   rating:5 },
  { name:"Priya Nair",   role:"HR Manager @ Deloitte",    text:"Corporate Communication helped me lead difficult conversations at work. My manager noticed the change within weeks.",           program:"Corporate Comm.",   rating:5 },
  { name:"Rahul Gupta",  role:"Sales Executive @ Zomato", text:"Spoken English course gave me the confidence to present in English to international clients. My accent improved dramatically.", program:"Spoken English",    rating:5 },
];

const WHY_ITEMS = [
  { Icon:Mic,   title:"Live Coach Sessions",    desc:"Real-time feedback from certified communication coaches — not pre-recorded videos." },
  { Icon:Users, title:"Small Cohorts",          desc:"Maximum 15 learners per batch so every voice gets heard and every weakness addressed." },
  { Icon:Zap,   title:"Practical-First",        desc:"80% of every session is hands-on practice. No death-by-theory." },
  { Icon:Globe, title:"Industry Context",       desc:"All scenarios are drawn from real workplace situations across IT, finance, sales, and more." },
  { Icon:Clock, title:"Flexible Schedule",      desc:"Morning, evening and weekend batches. Learn without disrupting your work life." },
  { Icon:Award, title:"Certified & Recognised", desc:"Completion certificates recognised by 200+ hiring partners across India." },
];

const FAQS = [
  { q:"Do I need any prior English knowledge to join Spoken English?", a:"No. Our Spoken English program starts from scratch and adapts to your current level. We accept complete beginners." },
  { q:"Are the sessions live or recorded?",                            a:"All core sessions are live with your coach. Recordings of each session are provided so you can revisit them anytime." },
  { q:"What is the batch size?",                                       a:"We cap every batch at 15 learners to ensure personalised attention and ample speaking time for everyone." },
  { q:"Can I switch programs mid-way?",                                a:"Yes. If you feel another program is a better fit after your first week, we'll transfer you at no extra cost." },
  { q:"Is there a certificate at the end?",                            a:"Yes, all programs award a verified digital certificate on completion, recognised by our 200+ hiring partners." },
  { q:"How do I enrol?",                                               a:"Click 'Enrol Now' on any program card, fill a short form and our counsellor will call within 24 hours to guide you through the process." },
];

const HOW_STEPS = [
  { step:"01", title:"Pick Your Program",            desc:"Choose the communication skill you want to master — from fluency to boardroom." },
  { step:"02", title:"Join a Live Cohort",           desc:"Get placed in a small batch of 15 learners with a certified coach assigned to you." },
  { step:"03", title:"Practice, Practice, Practice", desc:"80% of every session is live speaking practice with real-time expert feedback." },
  { step:"04", title:"Graduate & Succeed",           desc:"Receive your certificate and unlock placement support from our career network." },
];

const F = "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif";
const W = "920px";

/* ─── Global CSS ────────────────────────────────────────────────────────── */
const GLOBAL = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  .mob-only{display:none!important;}
  @media(max-width:1279px){
    .desk-nav{display:none!important;}
    .mob-only{display:flex!important;}
  }

  /* ── FIX: nav link always readable in both themes ── */
  .nav-lnk{
    background:transparent;
    border:none;
    padding:7px 13px;
    border-radius:8px;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:color .2s,background .2s;
    white-space:nowrap;
    color:#1E293B;          /* light default */
  }
  /* dark mode override via html.dark */
  html.dark .nav-lnk{ color:#e2e8f0 !important; }
  .nav-lnk:hover{ color:#f97316!important; background:rgba(249,115,22,.07)!important; }
`;

/* ─── NAVBAR ────────────────────────────────────────────────────────────── */
function Navbar({ isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV = [
    { label:"Mentors",         path:"/mentors" },
    { label:"Success Stories", path:"/success-stories" },
    { label:"Free Services",   path:"/free-services" },
    { label:"School Programs", path:"/school-class" },
  ];

  const navBg = isDark
    ? (scrolled ? "#0c0c14" : "rgba(12,12,20,.94)")
    : (scrolled ? "#ffffff" : "rgba(255,255,255,.94)");

  const btnBase = {
    width:"38px", height:"38px", display:"flex", alignItems:"center", justifyContent:"center",
    borderRadius:"10px", cursor:"pointer", transition:"all .2s",
    border: isDark ? "1px solid rgba(255,255,255,.13)" : "1px solid #e2e8f0",
    background: isDark ? "rgba(255,255,255,.05)" : "#f8fafc",
  };

  /* mobile drawer link color */
  const mLinkClr = isDark ? "#e2e8f0" : "#1E293B";

  return (
    <>
      <style>{GLOBAL}</style>
      <nav style={{ position:"fixed",top:0,width:"100%",zIndex:100,background:navBg,backdropFilter:"blur(18px)",borderBottom:isDark?"1px solid rgba(255,255,255,.07)":"1px solid rgba(249,115,22,.1)",boxShadow:scrolled?"0 2px 22px rgba(0,0,0,.13)":"none",transition:"background .3s,box-shadow .3s" }}>
        <div style={{ maxWidth:W, margin:"0 auto", padding:"0 20px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:"60px" }}>

            {/* Logo */}
            <div onClick={() => navigate("/")} style={{ cursor:"pointer", flexShrink:0 }}>
              <span style={{ fontSize:"clamp(22px,2.8vw,28px)", fontWeight:900, fontFamily:"Georgia,serif", lineHeight:1, whiteSpace:"nowrap" }}>
                <span style={{ color:"#16a34a" }}>ILM</span>
                <span style={{ color:"#f97316", marginLeft:"3px" }}>ORA</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="desk-nav" style={{ display:"flex", alignItems:"center", gap:"2px", flex:1, justifyContent:"center", margin:"0 16px" }}>
              <MegaMenu />
              {NAV.map(l => (
                <button key={l.label} className="nav-lnk" onClick={() => navigate(l.path)} style={{ fontFamily:F }}>{l.label}</button>
              ))}
            </div>

            {/* Right */}
            <div style={{ display:"flex", alignItems:"center", gap:"9px", flexShrink:0 }}>
              <button onClick={toggleTheme} style={btnBase}>
                {isDark
                  ? <Sun  style={{ width:"16px", height:"16px", color:"#f97316" }} />
                  : <Moon style={{ width:"16px", height:"16px", color:"#475569" }} />}
              </button>

              <div className="mob-only" style={{ alignItems:"center" }}>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <button style={btnBase}>
                      <Menu style={{ width:"18px", height:"18px", color: isDark ? "#e2e8f0" : "#1E293B" }} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" style={{ background:isDark?"#0c0c14":"#fff", width:"280px", padding:0, borderLeft:isDark?"1px solid rgba(255,255,255,.07)":"1px solid #f1f5f9" }}>
                    <div style={{ padding:"16px 20px", borderBottom:isDark?"1px solid rgba(255,255,255,.07)":"1px solid #f1f5f9" }}>
                      <span style={{ fontSize:"22px", fontWeight:900, fontFamily:"Georgia,serif" }}>
                        <span style={{ color:"#16a34a" }}>ILM</span>
                        <span style={{ color:"#f97316", marginLeft:"3px" }}>ORA</span>
                      </span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", padding:"12px", gap:"2px" }}>
                      <p style={{ fontSize:"10px", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:"#94a3b8", padding:"0 8px", marginBottom:"6px" }}>Menu</p>
                      <div style={{ paddingBottom:"6px" }}><MegaMenu /></div>
                      {NAV.map(l => (
                        <button key={l.label}
                          onClick={() => { navigate(l.path); setOpen(false); }}
                          style={{ color:mLinkClr, background:"transparent", border:"none", padding:"11px 10px", borderRadius:"9px", fontSize:"14px", fontWeight:600, cursor:"pointer", textAlign:"left", width:"100%", transition:"all .2s", fontFamily:F }}
                          onMouseEnter={e=>{ e.currentTarget.style.color="#f97316"; e.currentTarget.style.background="rgba(249,115,22,.07)"; }}
                          onMouseLeave={e=>{ e.currentTarget.style.color=mLinkClr; e.currentTarget.style.background="transparent"; }}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const Pill = ({ children }) => (
  <span style={{ display:"inline-block", fontSize:"10px", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:"#f97316", background:"rgba(249,115,22,.08)", border:"1px solid rgba(249,115,22,.2)", borderRadius:"100px", padding:"3px 13px" }}>
    {children}
  </span>
);

function SectionHead({ pill, title, sub, tp, ts }) {
  return (
    <div style={{ textAlign:"center", marginBottom:"28px" }}>
      <Pill>{pill}</Pill>
      <h2 style={{ fontSize:"clamp(18px,2.8vw,30px)", fontWeight:800, color:tp, marginTop:"10px", marginBottom:"7px", fontFamily:F, lineHeight:1.2 }}
        dangerouslySetInnerHTML={{ __html:title }} />
      {sub && <p style={{ color:ts, fontSize:"clamp(12px,1.2vw,13px)", maxWidth:"440px", margin:"0 auto", lineHeight:1.6 }}>{sub}</p>}
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────────────────────── */
export default function IlmOraTalk() {
  const navigate = useNavigate();
  const [faq,    setFaq]    = useState(null);
  const [active, setActive] = useState(0);
  const [theme,  setTheme]  = useState("light");

  const isDark = theme === "dark";

  useEffect(() => { document.documentElement.classList.toggle("dark", isDark); }, [isDark]);
  useEffect(() => { window.scrollTo({ top:0 }); }, []);

  const prog = PROGRAMS[active];
  const PI   = prog.Icon;

  /* Palette */
  const BG   = isDark ? "#0c0c14" : "#F5EDE6";
  const CARD = isDark ? "#13131e" : "#ffffff";
  const BDR  = isDark ? "rgba(255,255,255,.08)" : "#e8e8e8";
  const TP   = isDark ? "#f1f5f9" : "#1E293B";
  const TS   = isDark ? "#94a3b8" : "#64748b";
  const SW   = isDark ? "#0f0f18" : "#ffffff";
  const ST   = isDark ? "#0c0c14" : "#F5EDE6";
  const SD   = isDark ? "#07070e" : "#1E293B";
  const IC   = isDark ? "rgba(255,255,255,.03)" : "#f9f9f9";

  /* ── compact section padding ── */
  const SP = "clamp(32px,5vw,52px) clamp(14px,3vw,20px)";

  return (
    <div style={{ fontFamily:F, background:BG, minHeight:"100vh", color:TP, transition:"background .3s,color .3s" }}>
      <Navbar isDark={isDark} toggleTheme={() => setTheme(p => p==="dark"?"light":"dark")} />
      <div style={{ height:"60px" }} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f172a 55%,#1e1b3a 100%)", padding:"clamp(44px,7vw,76px) clamp(14px,3vw,20px) clamp(36px,6vw,60px)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"-60px",right:"-60px",width:"280px",height:"280px",borderRadius:"50%",background:"rgba(249,115,22,.07)",filter:"blur(80px)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:"-40px",left:"-40px",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(99,102,241,.07)",filter:"blur(80px)",pointerEvents:"none" }} />
        <div style={{ maxWidth:W, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:"7px",background:"rgba(249,115,22,.11)",border:"1px solid rgba(249,115,22,.28)",borderRadius:"100px",padding:"4px 14px",marginBottom:"18px" }}>
            <Mic size={12} color="#f97316" />
            <span style={{ fontSize:"11px",fontWeight:700,color:"#f97316",letterSpacing:".04em" }}>ILM ORA Talk — Communication Programs</span>
          </div>
          <h1 style={{ fontSize:"clamp(26px,4.5vw,50px)",fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:"14px",maxWidth:"560px",fontFamily:F }}>
            Find Your Voice.<br /><span style={{ color:"#f97316" }}>Own Every Room.</span>
          </h1>
          <p style={{ fontSize:"clamp(12px,1.5vw,15px)",color:"#94a3b8",maxWidth:"440px",lineHeight:1.7,marginBottom:"24px" }}>
            From spoken English to executive presentations — ILM ORA Talk's live coaching programs turn hesitation into confidence, and words into impact.
          </p>
          <button onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior:"smooth" })}
            style={{ display:"inline-flex",alignItems:"center",gap:"7px",background:"#f97316",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 22px",fontSize:"13px",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 18px rgba(249,115,22,.32)",transition:"all .2s",fontFamily:F }}
            onMouseEnter={e=>{e.currentTarget.style.background="#ea6c0a";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#f97316";e.currentTarget.style.transform="none";}}>
            Explore Programs <ArrowRight size={14} />
          </button>
          <div style={{ display:"flex",gap:"clamp(12px,2.5vw,24px)",marginTop:"36px",flexWrap:"wrap" }}>
            {STATS.map((s,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                <div style={{ width:"30px",height:"30px",borderRadius:"8px",background:"rgba(249,115,22,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <s.Icon size={13} color="#f97316" />
                </div>
                <div>
                  <div style={{ fontSize:"clamp(12px,1.4vw,15px)",fontWeight:800,color:"#fff",fontFamily:F }}>{s.value}</div>
                  <div style={{ fontSize:"9px",color:"#64748b",fontWeight:500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────────────────────── */}
      <section style={{ padding:SP, background:SW, transition:"background .3s" }}>
        <div style={{ maxWidth:W, margin:"0 auto" }}>
          <SectionHead pill="Why Choose Us"
            title={`Communication training that actually <span style="color:#f97316">sticks</span>`}
            sub="We don't teach theory. We build habits through repetition, feedback, and real-world scenarios."
            tp={TP} ts={TS} />
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",gap:"10px" }}>
            {WHY_ITEMS.map((item,i) => (
              <div key={i}
                style={{ background:IC,borderRadius:"12px",padding:"15px",border:`1px solid ${BDR}`,display:"flex",gap:"11px",alignItems:"flex-start",transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#fed7aa";e.currentTarget.style.boxShadow="0 4px 14px rgba(249,115,22,.09)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=BDR;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                <div style={{ width:"34px",height:"34px",borderRadius:"9px",background:"rgba(249,115,22,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <item.Icon size={15} color="#f97316" />
                </div>
                <div>
                  <div style={{ fontWeight:700,fontSize:"12px",color:TP,marginBottom:"3px" }}>{item.title}</div>
                  <div style={{ fontSize:"11px",color:TS,lineHeight:1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────────────────────────────── */}
      <section id="programs" style={{ padding:SP, background:ST, transition:"background .3s" }}>
        <div style={{ maxWidth:W, margin:"0 auto" }}>
          <SectionHead pill="Our Programs"
            title={`Five paths to <span style="color:#f97316">communication mastery</span>`}
            sub="Whether you're a fresher or a seasoned professional — there's a program built for your exact goal."
            tp={TP} ts={TS} />

          {/* Tab pills */}
          <div style={{ display:"flex",gap:"5px",flexWrap:"wrap",justifyContent:"center",marginBottom:"20px" }}>
            {PROGRAMS.map((p,i) => {
              const Ico = p.Icon; const isA = i===active;
              return (
                <button key={i} onClick={()=>setActive(i)}
                  style={{ display:"inline-flex",alignItems:"center",gap:"5px",padding:"6px clamp(9px,1.4vw,13px)",borderRadius:"100px",border:isA?`2px solid ${p.color}`:`2px solid ${BDR}`,background:isA?p.color:CARD,color:isA?"#fff":TS,fontSize:"clamp(10px,1vw,11px)",fontWeight:700,cursor:"pointer",transition:"all .2s",boxShadow:isA?`0 3px 10px ${p.color}44`:"none",fontFamily:F }}>
                  <Ico size={11} /> {p.title}
                </button>
              );
            })}
          </div>

          {/* Detail card */}
          <div style={{ background:CARD,borderRadius:"15px",overflow:"hidden",boxShadow:isDark?"0 8px 30px rgba(0,0,0,.44)":"0 4px 22px rgba(0,0,0,.07)",border:`1px solid ${prog.color}28`,transition:"background .3s" }}>
            <div style={{ height:"3px",background:prog.color }} />
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,280px),1fr))" }}>
              <div style={{ padding:"clamp(14px,2.5vw,26px)",borderRight:`1px solid ${BDR}` }}>
                <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px" }}>
                  <div style={{ width:"42px",height:"42px",borderRadius:"11px",background:`${prog.color}1a`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <PI size={18} color={prog.color} />
                  </div>
                  <div>
                    <div style={{ display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap" }}>
                      <h3 style={{ fontSize:"clamp(15px,1.8vw,18px)",fontWeight:800,color:TP,margin:0,fontFamily:F }}>{prog.title}</h3>
                      {prog.badge && <span style={{ fontSize:"9px",fontWeight:700,background:prog.color,color:"#fff",borderRadius:"100px",padding:"2px 7px",letterSpacing:".04em",whiteSpace:"nowrap" }}>{prog.badge}</span>}
                    </div>
                    <div style={{ fontSize:"10px",color:prog.color,fontWeight:600,marginTop:"1px" }}>{prog.tagline}</div>
                  </div>
                </div>
                <p style={{ fontSize:"12px",color:TS,lineHeight:1.7,marginBottom:"14px" }}>{prog.desc}</p>
                <div style={{ display:"flex",gap:"12px",marginBottom:"18px",flexWrap:"wrap" }}>
                  {[{Icon:Clock,label:prog.duration},{Icon:BookOpen,label:`${prog.lessons} Lessons`},{Icon:Users,label:prog.level}].map((m,mi)=>(
                    <div key={mi} style={{ display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color:TS,fontWeight:600 }}>
                      <m.Icon size={11} color={prog.color} /> {m.label}
                    </div>
                  ))}
                </div>
                <button onClick={()=>navigate("/course-details")}
                  style={{ display:"inline-flex",alignItems:"center",gap:"6px",background:prog.color,color:"#fff",border:"none",borderRadius:"9px",padding:"9px 18px",fontSize:"12px",fontWeight:700,cursor:"pointer",boxShadow:`0 3px 12px ${prog.color}44`,transition:"opacity .2s",fontFamily:F }}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".87"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  Enrol Now <ArrowRight size={12} />
                </button>
              </div>
              <div style={{ padding:"clamp(14px,2.5vw,26px)",background:IC }}>
                <div style={{ fontSize:"9px",fontWeight:800,textTransform:"uppercase",letterSpacing:".08em",color:TS,marginBottom:"12px" }}>What You'll Learn</div>
                <div style={{ display:"flex",flexDirection:"column",gap:"9px" }}>
                  {prog.highlights.map((h,hi)=>(
                    <div key={hi} style={{ display:"flex",alignItems:"flex-start",gap:"8px" }}>
                      <CheckCircle2 size={13} color={prog.color} style={{ flexShrink:0,marginTop:"2px" }} />
                      <span style={{ fontSize:"11px",color:isDark?"#cbd5e1":"#334155",lineHeight:1.5,fontWeight:500 }}>{h}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:"18px",background:`${prog.color}0e`,border:`1px solid ${prog.color}22`,borderRadius:"10px",padding:"12px" }}>
                  <div style={{ fontSize:"9px",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:prog.color,marginBottom:"4px" }}>Next Batch Starting</div>
                  <div style={{ fontSize:"13px",fontWeight:800,color:TP,fontFamily:F }}>June 10, 2026</div>
                  <div style={{ fontSize:"9px",color:TS,marginTop:"2px" }}>Limited seats — only 15 per batch</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini cards */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,140px),1fr))",gap:"8px",marginTop:"12px" }}>
            {PROGRAMS.map((p,i)=>{ const Ico=p.Icon; return (
              <div key={i} onClick={()=>setActive(i)}
                style={{ background:CARD,borderRadius:"10px",padding:"12px",border:`2px solid ${i===active?p.color:BDR}`,cursor:"pointer",transition:"all .2s",boxShadow:i===active?`0 3px 10px ${p.color}22`:"none" }}
                onMouseEnter={e=>{if(i!==active){e.currentTarget.style.borderColor=p.color+"55";e.currentTarget.style.transform="translateY(-2px)";}}}
                onMouseLeave={e=>{if(i!==active){e.currentTarget.style.borderColor=BDR;e.currentTarget.style.transform="none";}}}>
                <div style={{ width:"28px",height:"28px",borderRadius:"7px",background:`${p.color}14`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"6px" }}>
                  <Ico size={12} color={p.color} />
                </div>
                <div style={{ fontWeight:700,fontSize:"10px",color:TP,marginBottom:"2px",fontFamily:F }}>{p.title}</div>
                <div style={{ fontSize:"9px",color:TS }}>{p.duration} · {p.lessons} Lessons</div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ padding:SP, background:SD }}>
        <div style={{ maxWidth:W, margin:"0 auto" }}>
          <SectionHead pill="Student Stories"
            title={`Real people. <span style="color:#f97316">Real results.</span>`}
            tp="#ffffff" ts="#94a3b8" />
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,210px),1fr))",gap:"11px" }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i}
                style={{ background:"rgba(255,255,255,.05)",borderRadius:"12px",padding:"clamp(12px,2vw,17px)",border:"1px solid rgba(255,255,255,.07)",transition:"all .2s",display:"flex",flexDirection:"column" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.transform="none";}}>
                <div style={{ display:"flex",gap:"2px",marginBottom:"9px" }}>
                  {[...Array(t.rating)].map((_,j)=><Star key={j} size={11} color="#f97316" fill="#f97316" />)}
                </div>
                <p style={{ fontSize:"11px",color:"#cbd5e1",lineHeight:1.65,marginBottom:"13px",fontStyle:"italic",flex:1 }}>"{t.text}"</p>
                <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                  <div style={{ width:"30px",height:"30px",borderRadius:"50%",background:"#f97316",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:"12px",flexShrink:0 }}>{t.name.charAt(0)}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,fontSize:"10px",color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{t.name}</div>
                    <div style={{ fontSize:"9px",color:"#64748b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{t.role}</div>
                  </div>
                  <div style={{ fontSize:"8px",fontWeight:700,background:"rgba(249,115,22,.14)",color:"#f97316",borderRadius:"100px",padding:"2px 7px",whiteSpace:"nowrap",flexShrink:0 }}>{t.program}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding:SP, background:SW, transition:"background .3s" }}>
        <div style={{ maxWidth:W, margin:"0 auto" }}>
          <SectionHead pill="The Process"
            title={`How it <span style="color:#f97316">works</span>`}
            tp={TP} ts={TS} />
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,170px),1fr))",gap:"11px" }}>
            {HOW_STEPS.map((s,i)=>(
              <div key={i}
                style={{ textAlign:"center",padding:"clamp(16px,2vw,22px) clamp(10px,1.5vw,14px)",background:IC,borderRadius:"12px",border:`1px solid ${BDR}`,transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#fed7aa";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(249,115,22,.09)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=BDR;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                {/* FIX: step number — full opacity, solid colour, readable in both themes */}
                <div style={{
                  fontSize:"clamp(22px,3.5vw,34px)",
                  fontWeight:900,
                  color:"#f97316",        /* solid orange — fully visible */
                  opacity:1,              /* was 0.28 — now fully visible */
                  lineHeight:1,
                  marginBottom:"9px",
                  fontFamily:F
                }}>{s.step}</div>
                <h4 style={{ fontSize:"clamp(11px,1.2vw,12px)",fontWeight:800,color:TP,marginBottom:"5px",fontFamily:F }}>{s.title}</h4>
                <p style={{ fontSize:"10px",color:TS,lineHeight:1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ padding:SP, background:ST, transition:"background .3s" }}>
        <div style={{ maxWidth:"620px", margin:"0 auto" }}>
          <SectionHead pill="FAQ"
            title={`Frequently asked <span style="color:#f97316">questions</span>`}
            tp={TP} ts={TS} />
          <div style={{ display:"flex",flexDirection:"column",gap:"7px" }}>
            {FAQS.map((f,i)=>(
              <div key={i} style={{ background:CARD,borderRadius:"11px",border:`1px solid ${faq===i?"#fed7aa":BDR}`,overflow:"hidden",transition:"all .2s",boxShadow:faq===i?"0 3px 12px rgba(249,115,22,.07)":"none" }}>
                <button onClick={()=>setFaq(faq===i?null:i)}
                  style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"clamp(11px,1.5vw,14px) clamp(12px,1.6vw,17px)",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",gap:"8px" }}>
                  <span style={{ fontSize:"clamp(11px,1.1vw,12.5px)",fontWeight:700,color:TP,fontFamily:F }}>{f.q}</span>
                  <ChevronDown size={13} color="#94a3b8" style={{ flexShrink:0,transform:faq===i?"rotate(180deg)":"none",transition:"transform .25s" }} />
                </button>
                {faq===i && <div style={{ padding:"0 clamp(12px,1.6vw,17px) clamp(10px,1.5vw,13px)",fontSize:"11px",color:TS,lineHeight:1.65 }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding:SP, background:SD, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:"#f97316" }} />
        <div style={{ position:"absolute",top:"-50px",right:"-50px",width:"240px",height:"240px",borderRadius:"50%",background:"rgba(249,115,22,.06)",filter:"blur(70px)",pointerEvents:"none" }} />
        <div style={{ maxWidth:"560px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <h2 style={{ fontSize:"clamp(18px,3.2vw,34px)",fontWeight:800,color:"#fff",marginBottom:"10px",lineHeight:1.2,fontFamily:F }}>
            Your voice deserves to be <span style={{ color:"#f97316" }}>heard.</span>
          </h2>
          <p style={{ fontSize:"clamp(11px,1.3vw,13px)",color:"#94a3b8",marginBottom:"22px",lineHeight:1.6 }}>
            Join 12,000+ learners who found their confidence with ILM ORA Talk. The next batch starts June 10.
          </p>
          <button onClick={()=>navigate("/")}
            style={{ display:"inline-flex",alignItems:"center",gap:"6px",background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,.13)",borderRadius:"9px",padding:"10px 22px",fontSize:"12px",fontWeight:600,cursor:"pointer",transition:"all .2s",fontFamily:F }}
            onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,.3)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="#94a3b8";e.currentTarget.style.borderColor="rgba(255,255,255,.13)";}}>
            ← Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}