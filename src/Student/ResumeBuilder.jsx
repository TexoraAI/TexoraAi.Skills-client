import { useState, useRef, useEffect, useCallback } from "react";
import {
  User, Mail, Phone, MapPin, Globe, Github, Linkedin,
  Briefcase, GraduationCap, Zap, Rocket, Award,
  ChevronDown, ChevronUp, Plus, X, Trash2,
  Download, Printer, Upload, Sparkles, BarChart2,
  Eye, RefreshCw, CheckCircle, AlertTriangle,
  ExternalLink, FileText, Target, TrendingUp, Code,
  Edit2, Search, Star, GitFork, Building, Calendar,
  Layers, Shield, Package, Wand2, ArrowRight,
  Check, Info, Send, Lock, LayoutTemplate, BookOpen,
  Coffee, Cpu, UserCheck, Lightbulb, ChevronRight
} from "lucide-react";

const FONT_LINK = `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap`;

const EXPERIENCE_LEVELS = [
  {
    id: "student", label: "Student / Fresher", icon: BookOpen, color: "#8b5cf6", bg: "#f5f3ff",
    desc: "Final year student or recent graduate with internships or projects",
    tips: ["Focus on projects & academics", "List internships & hackathons", "Highlight skills & certifications"],
    defaultSummary: "Motivated final-year Computer Science student with hands-on experience in software development through academic projects and internships. Passionate about building impactful technology solutions.",
  },
  {
    id: "junior", label: "Junior (0–2 yrs)", icon: Coffee, color: "#0891b2", bg: "#f0f9ff",
    desc: "Early career professional with 0–2 years of work experience",
    tips: ["Show growth mindset", "Quantify impact of your work", "List all tech stack you know"],
    defaultSummary: "Enthusiastic junior developer with 1+ years of professional experience. Quick learner who thrives in collaborative environments and loves turning complex problems into clean, efficient code.",
  },
  {
    id: "mid", label: "Mid-Level (3–5 yrs)", icon: Cpu, color: "#059669", bg: "#f0fdf4",
    desc: "Experienced developer with proven track record and ownership",
    tips: ["Highlight leadership moments", "Show architecture decisions", "Metrics & team impact"],
    defaultSummary: "Results-driven software engineer with 4 years of experience building scalable web applications. Proven ability to lead features end-to-end and mentor junior engineers.",
  },
  {
    id: "senior", label: "Senior (6–10 yrs)", icon: UserCheck, color: "#d97706", bg: "#fffbeb",
    desc: "Senior engineer with leadership, mentoring & architecture experience",
    tips: ["Emphasize system design", "Show cross-team impact", "Thought leadership matters"],
    defaultSummary: "Senior Software Engineer with 8 years of experience architecting distributed systems at scale. Led teams of 8+ engineers, drove technical strategy, and delivered products used by millions.",
  },
  {
    id: "lead", label: "Lead / Principal (10+ yrs)", icon: Lightbulb, color: "#dc2626", bg: "#fef2f2",
    desc: "Principal engineer, tech lead, or architect with deep expertise",
    tips: ["Board-level impact stories", "Patents & publications", "Org-wide transformations"],
    defaultSummary: "Principal Engineer and technology leader with 12+ years driving innovation across Fortune 500 companies. Expert in cloud architecture, DevOps transformation, and building high-performance engineering organizations.",
  },
];

const THEMES = {
  modern: {
    name: "Modern", accent: "#6366f1", accentLight: "#ede9fe", bg: "#ffffff",
    headerBg: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)",
    text: "#1e1b4b", sub: "#64748b", border: "#e2e8f0", sectionTitle: "#6366f1",
    nameFontSize: 28, bodyFont: "'Poppins', sans-serif",
  },
  dark: {
    name: "Dark", accent: "#22d3ee", accentLight: "#164e63", bg: "#0f172a",
    headerBg: "linear-gradient(135deg, #020617 0%, #0c4a6e 100%)",
    text: "#f1f5f9", sub: "#94a3b8", border: "#1e293b", sectionTitle: "#22d3ee",
    nameFontSize: 28, bodyFont: "'Poppins', sans-serif",
  },
  minimal: {
    name: "Minimal", accent: "#111827", accentLight: "#f3f4f6", bg: "#fafaf9",
    headerBg: "#111827", text: "#1c1917", sub: "#6b7280", border: "#e5e7eb",
    sectionTitle: "#374151", nameFontSize: 30, bodyFont: "'Poppins', sans-serif",
  },
  ocean: {
    name: "Ocean", accent: "#0891b2", accentLight: "#e0f2fe", bg: "#f0f9ff",
    headerBg: "linear-gradient(135deg, #0c4a6e 0%, #0891b2 100%)",
    text: "#0c4a6e", sub: "#0369a1", border: "#bae6fd", sectionTitle: "#0891b2",
    nameFontSize: 28, bodyFont: "'Poppins', sans-serif",
  },
};

const SKILLS_SUGGESTIONS = [
  "React","Node.js","Python","TypeScript","JavaScript","MongoDB","PostgreSQL",
  "Docker","AWS","Git","Machine Learning","GraphQL","Redis","Kubernetes","CI/CD",
  "Next.js","Vue.js","Angular","Spring Boot","FastAPI","TensorFlow","PyTorch",
  "Java","Go","Rust","Swift","Kotlin","Flutter","React Native","Firebase",
];

const DEFAULT_DATA = {
  personal: {
    name:"Alex Johnson", title:"Full Stack Developer",
    email:"alex@example.com", phone:"+1 555-0100",
    location:"San Francisco, CA",
    summary:"Passionate developer with 3+ years building scalable web applications. Experienced in React, Node.js, and cloud infrastructure.",
    github:"alexjohnson", linkedin:"alexjohnson", website:"alexjohnson.dev",
  },
  experience:[
    { id:1, company:"TechCorp Inc.", role:"Software Engineer", duration:"Jan 2023 – Present", location:"Remote",
      bullets:["Built microservices handling 1M+ req/day","Led team of 4 to redesign customer dashboard","Reduced load time by 40% via code-splitting"] },
    { id:2, company:"StartupXYZ", role:"Frontend Developer", duration:"Jun 2021 – Dec 2022", location:"San Francisco, CA",
      bullets:["Developed React SPA from scratch","Integrated Stripe payments","Implemented CI/CD pipeline with GitHub Actions"] },
  ],
  education:[
    { id:1, institution:"UC Berkeley", degree:"B.S. Computer Science", duration:"2017 – 2021", gpa:"3.8/4.0" },
  ],
  skills:["React","Node.js","Python","TypeScript","MongoDB","Docker","AWS","Git"],
  projects:[
    { id:1, name:"DevFlow", description:"Open-source project management tool built with Next.js and Prisma. 500+ GitHub stars.", tech:["Next.js","Prisma","PostgreSQL"], github:"alexjohnson/devflow", live:"devflow.app" },
    { id:2, name:"AIChat", description:"Real-time AI chat application with WebSocket support and OpenAI integration.", tech:["React","Socket.io","OpenAI"], github:"alexjohnson/aichat", live:"" },
  ],
  certifications:[
    { id:1, name:"AWS Certified Developer", issuer:"Amazon", year:"2023" },
    { id:2, name:"Google Cloud Associate", issuer:"Google", year:"2022" },
  ],
};

async function callClaude(messages, system = "") {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, system, messages }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const d = await res.json();
  return d.content?.filter(b => b.type==="text").map(b => b.text).join("") || "";
}

async function callClaudeJSON(messages, system = "") {
  const raw = await callClaude(messages, system);
  const clean = raw.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
  const m = clean.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("No JSON found");
  return JSON.parse(m[0]);
}

async function fetchGitHubRepos(username) {
  const r = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=20`);
  if (!r.ok) throw new Error("GitHub user not found");
  return r.json();
}

// ─── Dark Mode Hook ───────────────────────────────────────────────────────────
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark" ||
      document.documentElement.getAttribute("data-mode") === "dark"
    );
  });

  useEffect(() => {
    const checkDark = () => {
      const dark =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.getAttribute("data-mode") === "dark" ||
        document.body.getAttribute("data-theme") === "dark";
      setIsDark(dark);
    };

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"],
    });

    checkDark();
    return () => observer.disconnect();
  }, []);

  return isDark;
}

// ─── Small UI Components ──────────────────────────────────────────────────────
function Inp({ label, value, onChange, placeholder, type="text", icon:Icon, isDark }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:11 }}>
      {label && <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color: isDark ? "#94a3b8" : "#64748b", marginBottom:4, fontFamily:"'Poppins',sans-serif" }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {Icon && <Icon size={13} style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color: focused?"#6366f1": isDark ? "#64748b" : "#94a3b8", pointerEvents:"none" }} />}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{ width:"100%", padding: Icon?"8px 10px 8px 28px":"8px 10px", borderRadius:8,
            border:`1.5px solid ${focused?"#6366f1": isDark ? "#334155" : "#e2e8f0"}`, fontSize:12.5, outline:"none",
            background: isDark ? "#0f172a" : "#fff", color: isDark ? "#f1f5f9" : "#1e293b",
            boxSizing:"border-box", transition:"border-color .15s",
            fontFamily:"'Poppins',sans-serif" }} />
      </div>
    </div>
  );
}

function Txt({ label, value, onChange, rows=3, placeholder, isDark }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:11 }}>
      {label && <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color: isDark ? "#94a3b8" : "#64748b", marginBottom:4, fontFamily:"'Poppins',sans-serif" }}>{label}</label>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{ width:"100%", padding:"8px 10px", borderRadius:8,
          border:`1.5px solid ${focused?"#6366f1": isDark ? "#334155" : "#e2e8f0"}`,
          fontSize:12.5, outline:"none",
          background: isDark ? "#0f172a" : "#fff",
          color: isDark ? "#f1f5f9" : "#1e293b",
          resize:"vertical", boxSizing:"border-box", fontFamily:"'Poppins',sans-serif", transition:"border-color .15s" }} />
    </div>
  );
}

function Card({ title, icon:Icon, children, onAdd, addLabel, isDark }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: isDark ? "#1e293b" : "#fff", borderRadius:13, border:`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`, marginBottom:12, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
      <div onClick={()=>setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 15px", cursor:"pointer", background: open ? (isDark ? "#0f172a" : "#f8fafc") : (isDark ? "#1e293b" : "#fff") }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          {Icon && <Icon size={14} color="#6366f1" />}
          <span style={{ fontWeight:700, fontSize:13, color: isDark ? "#f1f5f9" : "#1e293b", fontFamily:"'Poppins',sans-serif" }}>{title}</span>
        </div>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          {onAdd && open && (
            <button onClick={e=>{e.stopPropagation();onAdd();}}
              style={{ display:"flex",alignItems:"center",gap:3, fontSize:11,fontWeight:700,padding:"4px 9px",borderRadius:6,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>
              <Plus size={10}/> {addLabel||"Add"}
            </button>
          )}
          {open ? <ChevronUp size={14} color={isDark ? "#64748b" : "#94a3b8"}/> : <ChevronDown size={14} color={isDark ? "#64748b" : "#94a3b8"}/>}
        </div>
      </div>
      {open && <div style={{ padding:"13px 15px" }}>{children}</div>}
    </div>
  );
}

function Tag({ label, onRemove }) {
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:3,padding:"4px 9px",borderRadius:20,background:"#ede9fe",color:"#6366f1",fontSize:11.5,fontWeight:600,margin:"3px",fontFamily:"'Poppins',sans-serif" }}>
      {label}{onRemove && <X size={10} onClick={onRemove} style={{ cursor:"pointer",opacity:.6 }}/>}
    </span>
  );
}

function Btn({ children, onClick, variant="primary", size="md", icon:Icon, disabled, loading, style:extra }) {
  const V = {
    primary:{bg:"#6366f1",color:"#fff",border:"none"},
    secondary:{bg:"#f1f5f9",color:"#64748b",border:"none"},
    danger:{bg:"#fee2e2",color:"#ef4444",border:"none"},
    ghost:{bg:"transparent",color:"#6366f1",border:"1.5px solid #6366f1"},
    success:{bg:"#dcfce7",color:"#16a34a",border:"none"},
    dark:{bg:"#1e293b",color:"#fff",border:"none"},
    warning:{bg:"#fffbeb",color:"#d97706",border:"none"},
    purple:{bg:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none"},
  };
  const SZ = { sm:"5px 11px", md:"9px 17px", lg:"11px 22px" };
  const v = V[variant]||V.primary;
  return (
    <button onClick={onClick} disabled={disabled||loading}
      style={{ display:"inline-flex",alignItems:"center",gap:5,padding:SZ[size],borderRadius:8,
        border:v.border||"none",cursor:disabled||loading?"not-allowed":"pointer",
        fontWeight:700,fontSize:size==="lg"?13:11.5,
        background:disabled?"#e2e8f0":v.bg, color:disabled?"#94a3b8":v.color,
        opacity:loading?.7:1, transition:"all .15s", fontFamily:"'Poppins',sans-serif", ...extra }}>
      {loading ? <RefreshCw size={12} style={{ animation:"spin 1s linear infinite" }}/> : Icon ? <Icon size={12}/> : null}
      {children}
    </button>
  );
}

function ExperienceLevelPicker({ selected, onSelect, isDark }) {
  return (
    <div style={{ background: isDark ? "#1e293b" : "#fff", borderRadius:16, border:`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`, padding:20, marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
        <div style={{ width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <UserCheck size={15} color="#fff"/>
        </div>
        <div>
          <div style={{ fontWeight:700,fontSize:13.5,color: isDark ? "#f1f5f9" : "#1e293b",fontFamily:"'Poppins',sans-serif" }}>Experience Level</div>
          <div style={{ fontSize:11,color: isDark ? "#94a3b8" : "#64748b",fontFamily:"'Poppins',sans-serif" }}>Resume will be tailored to your level</div>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
        {EXPERIENCE_LEVELS.map(lvl => {
          const active = selected?.id === lvl.id;
          return (
            <div key={lvl.id} onClick={()=>onSelect(lvl)}
              style={{ padding:"11px 13px",borderRadius:11,border:`2px solid ${active?lvl.color: isDark ? "#334155" : "#e2e8f0"}`,
                background: active ? lvl.bg : (isDark ? "#0f172a" : "#f8fafc"),cursor:"pointer",transition:"all .2s",
                boxShadow:active?`0 0 0 3px ${lvl.color}22`:"none" }}>
              <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:4 }}>
                <lvl.icon size={14} color={lvl.color}/>
                <span style={{ fontWeight:700,fontSize:11.5,color:active?lvl.color: isDark ? "#cbd5e1" : "#374151",fontFamily:"'Poppins',sans-serif" }}>{lvl.label}</span>
              </div>
              <p style={{ fontSize:10.5,color: isDark ? "#64748b" : "#6b7280",margin:0,lineHeight:1.5,fontFamily:"'Poppins',sans-serif" }}>{lvl.desc}</p>
            </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ marginTop:12,padding:"10px 13px",borderRadius:10,background:selected.bg,border:`1.5px solid ${selected.color}33` }}>
          <div style={{ fontWeight:700,fontSize:11,color:selected.color,marginBottom:5,fontFamily:"'Poppins',sans-serif" }}>💡 Tips for {selected.label}</div>
          {selected.tips.map((tip,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
              <Check size={11} color={selected.color}/>
              <span style={{ fontSize:11,color:"#374151",fontFamily:"'Poppins',sans-serif" }}>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Gauge({ score, size=130 }) {
  const r = size/2 - 11;
  const circ = 2*Math.PI*r;
  const dash = (score/100)*circ;
  const col = score>=80?"#22c55e":score>=60?"#f59e0b":"#ef4444";
  const grade = score>=90?"A+":score>=80?"A":score>=70?"B":score>=60?"C":score>=50?"D":"F";
  return (
    <div style={{ position:"relative",width:size,height:size,flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={11}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={11}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1.2s ease" }}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <div style={{ fontSize:size/3.8,fontWeight:900,color:col,lineHeight:1,fontFamily:"'Poppins',sans-serif" }}>{score}</div>
        <div style={{ fontSize:size/7,fontWeight:700,color:"#94a3b8",marginTop:1,fontFamily:"'Poppins',sans-serif" }}>Grade {grade}</div>
      </div>
    </div>
  );
}

// ─── Resume Templates ─────────────────────────────────────────────────────────
function ResumePreview({ data, theme }) {
  const t = THEMES[theme] || THEMES.modern;
  if (theme === "minimal") return <MinimalTemplate data={data} t={t}/>;
  if (theme === "dark")    return <DarkTemplate    data={data} t={t}/>;
  if (theme === "ocean")   return <OceanTemplate   data={data} t={t}/>;
  return <ModernTemplate data={data} t={t}/>;
}

function ModernTemplate({ data, t }) {
  const pill = { display:"inline-block",padding:"2px 9px",borderRadius:20,background:"#ede9fe",color:"#6366f1",fontSize:10.5,fontWeight:600,margin:"2px 3px",fontFamily:"'Poppins',sans-serif" };
  return (
    <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",minHeight:"100%" }}>
      <div style={{ background:t.headerBg,padding:"32px 36px 28px",color:"#fff" }}>
        <h1 style={{ fontSize:t.nameFontSize,fontWeight:800,margin:"0 0 3px",letterSpacing:"-.02em",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
        <p style={{ fontSize:13.5,fontWeight:500,margin:"0 0 14px",opacity:.85,fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
        <div style={{ fontSize:10.5,display:"flex",flexWrap:"wrap",gap:"5px 16px",opacity:.8 }}>
          {data.personal.email    && <span>✉ {data.personal.email}</span>}
          {data.personal.phone    && <span>☎ {data.personal.phone}</span>}
          {data.personal.location && <span>⌖ {data.personal.location}</span>}
          {data.personal.github   && <span>⌥ github.com/{data.personal.github}</span>}
          {data.personal.linkedin && <span>in linkedin/{data.personal.linkedin}</span>}
          {data.personal.website  && <span>⊕ {data.personal.website}</span>}
        </div>
      </div>
      <div style={{ padding:"26px 36px" }}>
        {data.personal.summary && (
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8 }}>Summary</div>
            <p style={{ fontSize:11.5,color:"#475569",margin:0,lineHeight:1.75 }}>{data.personal.summary}</p>
          </div>
        )}
        {data.experience.length>0 && (
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:10,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Work Experience</div>
            {data.experience.map(e=>(
              <div key={e.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline" }}>
                  <span style={{ fontWeight:700,fontSize:13,color:t.text }}>{e.role}</span>
                  <span style={{ fontSize:10,color:"#94a3b8",fontWeight:500 }}>{e.duration}</span>
                </div>
                <div style={{ fontSize:10.5,color:"#6366f1",marginBottom:5,fontWeight:600 }}>{e.company}{e.location&&` · ${e.location}`}</div>
                {e.bullets.filter(Boolean).map((b,i)=>(
                  <div key={i} style={{ fontSize:11.5,color:"#475569",marginBottom:3,paddingLeft:14,position:"relative" }}>
                    <span style={{ position:"absolute",left:0,color:"#6366f1",fontWeight:900 }}>›</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:22 }}>
          <div>
            {data.education.length>0 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Education</div>
                {data.education.map(e=>(
                  <div key={e.id} style={{ marginBottom:9 }}>
                    <div style={{ fontWeight:700,fontSize:12,color:t.text }}>{e.institution}</div>
                    <div style={{ fontSize:10.5,color:"#64748b" }}>{e.degree}{e.gpa&&` · GPA ${e.gpa}`}</div>
                    <div style={{ fontSize:10,color:"#94a3b8" }}>{e.duration}</div>
                  </div>
                ))}
              </div>
            )}
            {data.certifications?.length>0 && (
              <div>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Certifications</div>
                {data.certifications.map(c=>(
                  <div key={c.id} style={{ marginBottom:5 }}>
                    <div style={{ fontWeight:600,fontSize:11.5,color:t.text }}>{c.name}</div>
                    <div style={{ fontSize:10.5,color:"#94a3b8" }}>{c.issuer} · {c.year}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {data.skills.length>0 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Skills</div>
                <div>{data.skills.map(s=><span key={s} style={pill}>{s}</span>)}</div>
              </div>
            )}
          </div>
        </div>
        {data.projects.length>0 && (
          <div>
            <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:10,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Projects</div>
            {data.projects.map(p=>(
              <div key={p.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",gap:9,alignItems:"baseline" }}>
                  <span style={{ fontWeight:700,fontSize:12.5,color:t.text }}>{p.name}</span>
                  {p.github&&<span style={{ fontSize:10,color:"#6366f1" }}>github.com/{p.github}</span>}
                  {p.live&&<span style={{ fontSize:10,color:"#6366f1" }}>{p.live}</span>}
                </div>
                <p style={{ fontSize:11,color:"#64748b",margin:"2px 0 3px" }}>{p.description}</p>
                <div>{p.tech?.map(t=><span key={t} style={{ ...pill,background:"#f1f5f9",color:"#64748b" }}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DarkTemplate({ data, t }) {
  const pill = { display:"inline-block",padding:"2px 9px",borderRadius:5,background:"#1e293b",color:"#22d3ee",fontSize:10.5,fontWeight:600,margin:"2px 3px",fontFamily:"'Poppins',sans-serif",border:"1px solid #334155" };
  const secTitle = { fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#22d3ee",marginBottom:8,paddingBottom:5,borderBottom:"1px solid #1e293b",fontFamily:"'Poppins',sans-serif" };
  return (
    <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",minHeight:"100%",display:"grid",gridTemplateColumns:"220px 1fr" }}>
      <div style={{ background:"#020617",padding:"32px 20px",borderRight:"1px solid #1e293b" }}>
        <div style={{ width:62,height:62,borderRadius:14,background:"linear-gradient(135deg,#22d3ee,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff",marginBottom:16 }}>
          {data.personal.name.charAt(0)}
        </div>
        <h2 style={{ fontSize:16,fontWeight:800,color:"#f1f5f9",margin:"0 0 2px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h2>
        <p style={{ fontSize:10.5,color:"#22d3ee",fontWeight:600,margin:"0 0 20px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
        <div style={{ marginBottom:20 }}>
          {[
            data.personal.email&&{icon:"✉",val:data.personal.email},
            data.personal.phone&&{icon:"☎",val:data.personal.phone},
            data.personal.location&&{icon:"⌖",val:data.personal.location},
            data.personal.github&&{icon:"⌥",val:data.personal.github},
            data.personal.linkedin&&{icon:"in",val:data.personal.linkedin},
            data.personal.website&&{icon:"⊕",val:data.personal.website},
          ].filter(Boolean).map((c,i)=>(
            <div key={i} style={{ fontSize:10,color:"#94a3b8",marginBottom:5,display:"flex",gap:6,alignItems:"flex-start",fontFamily:"'Poppins',sans-serif" }}>
              <span style={{ color:"#22d3ee",flexShrink:0 }}>{c.icon}</span>{c.val}
            </div>
          ))}
        </div>
        {data.skills.length>0 && (
          <div style={{ marginBottom:18 }}>
            <div style={secTitle}>Skills</div>
            <div>{data.skills.map(s=><span key={s} style={pill}>{s}</span>)}</div>
          </div>
        )}
        {data.education.length>0 && (
          <div>
            <div style={secTitle}>Education</div>
            {data.education.map(e=>(
              <div key={e.id} style={{ marginBottom:9 }}>
                <div style={{ fontWeight:700,fontSize:11,color:"#f1f5f9",fontFamily:"'Poppins',sans-serif" }}>{e.institution}</div>
                <div style={{ fontSize:10,color:"#64748b",fontFamily:"'Poppins',sans-serif" }}>{e.degree}</div>
                <div style={{ fontSize:9.5,color:"#475569",fontFamily:"'Poppins',sans-serif" }}>{e.duration}{e.gpa&&` · ${e.gpa}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding:"32px 28px" }}>
        {data.personal.summary && (
          <div style={{ marginBottom:22,padding:"14px 16px",background:"#1e293b",borderRadius:10,borderLeft:"3px solid #22d3ee" }}>
            <p style={{ fontSize:11.5,color:"#94a3b8",margin:0,lineHeight:1.75,fontFamily:"'Poppins',sans-serif" }}>{data.personal.summary}</p>
          </div>
        )}
        {data.experience.length>0 && (
          <div style={{ marginBottom:22 }}>
            <div style={secTitle}>Work Experience</div>
            {data.experience.map(e=>(
              <div key={e.id} style={{ marginBottom:14,paddingLeft:12,borderLeft:"2px solid #1e293b" }}>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700,fontSize:12.5,color:"#f1f5f9",fontFamily:"'Poppins',sans-serif" }}>{e.role}</span>
                  <span style={{ fontSize:10,color:"#475569",fontFamily:"'Poppins',sans-serif" }}>{e.duration}</span>
                </div>
                <div style={{ fontSize:10.5,color:"#22d3ee",marginBottom:5,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{e.company}{e.location&&` · ${e.location}`}</div>
                {e.bullets.filter(Boolean).map((b,i)=>(
                  <div key={i} style={{ fontSize:11,color:"#94a3b8",marginBottom:3,paddingLeft:12,position:"relative",fontFamily:"'Poppins',sans-serif" }}>
                    <span style={{ position:"absolute",left:0,color:"#22d3ee" }}>›</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {data.projects.length>0 && (
          <div style={{ marginBottom:22 }}>
            <div style={secTitle}>Projects</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {data.projects.map(p=>(
                <div key={p.id} style={{ padding:"11px 13px",background:"#1e293b",borderRadius:9,border:"1px solid #334155" }}>
                  <div style={{ fontWeight:700,fontSize:12,color:"#f1f5f9",marginBottom:3,fontFamily:"'Poppins',sans-serif" }}>{p.name}</div>
                  <p style={{ fontSize:10.5,color:"#64748b",margin:"0 0 6px",fontFamily:"'Poppins',sans-serif" }}>{p.description}</p>
                  <div>{p.tech?.map(t=><span key={t} style={pill}>{t}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.certifications?.length>0 && (
          <div>
            <div style={secTitle}>Certifications</div>
            {data.certifications.map(c=>(
              <div key={c.id} style={{ display:"flex",justifyContent:"space-between",padding:"7px 10px",background:"#1e293b",borderRadius:7,marginBottom:5 }}>
                <span style={{ fontSize:11.5,fontWeight:600,color:"#f1f5f9",fontFamily:"'Poppins',sans-serif" }}>{c.name}</span>
                <span style={{ fontSize:10.5,color:"#475569",fontFamily:"'Poppins',sans-serif" }}>{c.issuer} · {c.year}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalTemplate({ data, t }) {
  return (
    <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",padding:"44px 52px",minHeight:"100%" }}>
      <div style={{ borderBottom:"3px solid #111827",paddingBottom:20,marginBottom:24 }}>
        <h1 style={{ fontSize:t.nameFontSize,fontWeight:800,margin:0,color:"#111827",letterSpacing:"-.03em",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
        <p style={{ fontSize:13,fontWeight:500,color:"#6b7280",margin:"4px 0 12px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
        <div style={{ fontSize:10.5,color:"#9ca3af",display:"flex",flexWrap:"wrap",gap:"4px 16px" }}>
          {data.personal.email    && <span>{data.personal.email}</span>}
          {data.personal.phone    && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.github   && <span>github/{data.personal.github}</span>}
          {data.personal.linkedin && <span>linkedin/{data.personal.linkedin}</span>}
          {data.personal.website  && <span>{data.personal.website}</span>}
        </div>
      </div>
      {data.personal.summary && (
        <div style={{ marginBottom:24 }}>
          <p style={{ fontSize:12,color:"#6b7280",margin:0,lineHeight:1.8 }}>{data.personal.summary}</p>
        </div>
      )}
      {data.experience.length>0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:12,fontFamily:"'Poppins',sans-serif" }}>Experience</div>
          {data.experience.map(e=>(
            <div key={e.id} style={{ marginBottom:16,display:"grid",gridTemplateColumns:"140px 1fr",gap:"0 20px" }}>
              <div style={{ paddingTop:2 }}>
                <div style={{ fontSize:10,color:"#9ca3af",fontWeight:500 }}>{e.duration}</div>
                <div style={{ fontSize:10.5,color:"#374151",fontWeight:600,marginTop:2 }}>{e.company}</div>
              </div>
              <div>
                <div style={{ fontWeight:700,fontSize:12.5,color:"#111827" }}>{e.role}</div>
                {e.bullets.filter(Boolean).map((b,i)=>(
                  <div key={i} style={{ fontSize:11.5,color:"#6b7280",marginTop:3 }}>— {b}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px",marginBottom:20 }}>
        {data.education.length>0 && (
          <div>
            <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10 }}>Education</div>
            {data.education.map(e=>(
              <div key={e.id} style={{ marginBottom:10 }}>
                <div style={{ fontWeight:700,fontSize:12,color:"#111827" }}>{e.institution}</div>
                <div style={{ fontSize:10.5,color:"#6b7280" }}>{e.degree}</div>
                <div style={{ fontSize:10,color:"#9ca3af" }}>{e.duration}{e.gpa&&` · GPA ${e.gpa}`}</div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length>0 && (
          <div>
            <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10 }}>Skills</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
              {data.skills.map(s=>(
                <span key={s} style={{ fontSize:10.5,fontWeight:500,padding:"3px 9px",borderRadius:3,background:"#f3f4f6",color:"#374151",border:"1px solid #e5e7eb" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {data.projects.length>0 && (
        <div>
          <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:12 }}>Projects</div>
          {data.projects.map(p=>(
            <div key={p.id} style={{ marginBottom:10 }}>
              <span style={{ fontWeight:700,fontSize:12,color:"#111827" }}>{p.name}</span>
              {(p.github||p.live) && <span style={{ fontSize:10,color:"#9ca3af",marginLeft:9 }}>{p.github&&`github/${p.github}`}{p.github&&p.live&&" · "}{p.live}</span>}
              <p style={{ fontSize:11,color:"#6b7280",margin:"2px 0" }}>{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OceanTemplate({ data, t }) {
  const pill = { display:"inline-block",padding:"2px 9px",borderRadius:20,background:"#e0f2fe",color:"#0369a1",fontSize:10.5,fontWeight:600,margin:"2px 3px",fontFamily:"'Poppins',sans-serif" };
  return (
    <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",minHeight:"100%" }}>
      <div style={{ background:t.headerBg,padding:"32px 36px 28px",color:"#fff",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.08)" }}/>
        <div style={{ position:"absolute",bottom:-60,right:80,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,.05)" }}/>
        <div style={{ position:"relative",zIndex:1,display:"flex",alignItems:"flex-end",justifyContent:"space-between" }}>
          <div>
            <h1 style={{ fontSize:t.nameFontSize,fontWeight:800,margin:"0 0 3px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
            <p style={{ fontSize:13,fontWeight:500,margin:"0 0 12px",opacity:.85,fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
            <div style={{ fontSize:10.5,display:"flex",flexWrap:"wrap",gap:"4px 14px",opacity:.8 }}>
              {data.personal.email    && <span>✉ {data.personal.email}</span>}
              {data.personal.phone    && <span>☎ {data.personal.phone}</span>}
              {data.personal.location && <span>⌖ {data.personal.location}</span>}
              {data.personal.github   && <span>⌥ {data.personal.github}</span>}
              {data.personal.website  && <span>⊕ {data.personal.website}</span>}
            </div>
          </div>
          <div style={{ width:62,height:62,borderRadius:16,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:900,color:"#fff",border:"2px solid rgba(255,255,255,.4)" }}>
            {data.personal.name.charAt(0)}
          </div>
        </div>
      </div>
      <div style={{ padding:"24px 36px" }}>
        {data.personal.summary && (
          <div style={{ marginBottom:20,padding:"12px 16px",background:"#e0f2fe",borderRadius:10,borderLeft:"4px solid #0891b2" }}>
            <p style={{ fontSize:11.5,color:"#0369a1",margin:0,lineHeight:1.75,fontFamily:"'Poppins',sans-serif" }}>{data.personal.summary}</p>
          </div>
        )}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 260px",gap:24 }}>
          <div>
            {data.experience.length>0 && (
              <div style={{ marginBottom:22 }}>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:10,display:"flex",alignItems:"center",gap:7 }}>
                  <div style={{ height:2,flex:1,background:"linear-gradient(to right,#0891b2,transparent)" }}/> Experience
                </div>
                {data.experience.map(e=>(
                  <div key={e.id} style={{ marginBottom:14,padding:"11px 14px",background:"#fff",borderRadius:10,border:"1.5px solid #bae6fd" }}>
                    <div style={{ display:"flex",justifyContent:"space-between" }}>
                      <span style={{ fontWeight:700,fontSize:12.5,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{e.role}</span>
                      <span style={{ fontSize:10,color:"#94a3b8" }}>{e.duration}</span>
                    </div>
                    <div style={{ fontSize:10.5,color:"#0891b2",marginBottom:5,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{e.company}{e.location&&` · ${e.location}`}</div>
                    {e.bullets.filter(Boolean).map((b,i)=>(
                      <div key={i} style={{ fontSize:11,color:"#475569",marginBottom:3,paddingLeft:12,position:"relative",fontFamily:"'Poppins',sans-serif" }}>
                        <span style={{ position:"absolute",left:0,color:"#0891b2" }}>›</span>{b}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {data.projects.length>0 && (
              <div>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:10,display:"flex",alignItems:"center",gap:7 }}>
                  <div style={{ height:2,flex:1,background:"linear-gradient(to right,#0891b2,transparent)" }}/> Projects
                </div>
                {data.projects.map(p=>(
                  <div key={p.id} style={{ marginBottom:10,padding:"11px 14px",background:"#fff",borderRadius:10,border:"1.5px solid #bae6fd" }}>
                    <div style={{ fontWeight:700,fontSize:12,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{p.name}{p.live&&<span style={{ fontSize:10,color:"#0891b2",marginLeft:9 }}>{p.live}</span>}</div>
                    <p style={{ fontSize:11,color:"#64748b",margin:"3px 0 5px",fontFamily:"'Poppins',sans-serif" }}>{p.description}</p>
                    <div>{p.tech?.map(t=><span key={t} style={pill}>{t}</span>)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {data.skills.length>0 && (
              <div style={{ marginBottom:18,padding:"14px",background:"#fff",borderRadius:12,border:"1.5px solid #bae6fd" }}>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:9,fontFamily:"'Poppins',sans-serif" }}>Skills</div>
                <div>{data.skills.map(s=><span key={s} style={pill}>{s}</span>)}</div>
              </div>
            )}
            {data.education.length>0 && (
              <div style={{ marginBottom:18,padding:"14px",background:"#fff",borderRadius:12,border:"1.5px solid #bae6fd" }}>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:9,fontFamily:"'Poppins',sans-serif" }}>Education</div>
                {data.education.map(e=>(
                  <div key={e.id} style={{ marginBottom:7 }}>
                    <div style={{ fontWeight:700,fontSize:11.5,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{e.institution}</div>
                    <div style={{ fontSize:10.5,color:"#0369a1",fontFamily:"'Poppins',sans-serif" }}>{e.degree}</div>
                    <div style={{ fontSize:10,color:"#94a3b8",fontFamily:"'Poppins',sans-serif" }}>{e.duration}{e.gpa&&` · GPA ${e.gpa}`}</div>
                  </div>
                ))}
              </div>
            )}
            {data.certifications?.length>0 && (
              <div style={{ padding:"14px",background:"#fff",borderRadius:12,border:"1.5px solid #bae6fd" }}>
                <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:9,fontFamily:"'Poppins',sans-serif" }}>Certifications</div>
                {data.certifications.map(c=>(
                  <div key={c.id} style={{ marginBottom:6 }}>
                    <div style={{ fontWeight:600,fontSize:11.5,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{c.name}</div>
                    <div style={{ fontSize:10.5,color:"#94a3b8",fontFamily:"'Poppins',sans-serif" }}>{c.issuer} · {c.year}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ATS Results ──────────────────────────────────────────────────────────────
function ATSResults({ result, onUpdateResume, isDark }) {
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");
  const sevBg  = { high: isDark?"#450a0a":"#fef2f2", medium: isDark?"#431407":"#fffbeb", low: isDark?"#052e16":"#f0fdf4" };
  const sevBdr = { high: isDark?"#7f1d1d":"#fca5a5", medium: isDark?"#78350f":"#fcd34d", low: isDark?"#14532d":"#86efac" };
  const sevCol = { high:"#ef4444", medium:"#f59e0b", low:"#22c55e" };
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"auto 1fr",gap:28,background: isDark?"#1e293b":"#fff",borderRadius:16,border:`1.5px solid ${isDark?"#334155":"#e2e8f0"}`,padding:24,marginBottom:18,alignItems:"start" }}>
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
          <Gauge score={result.score}/>
          <div style={{ fontSize:12,fontWeight:700,color: isDark?"#94a3b8":"#64748b",fontFamily:"'Poppins',sans-serif" }}>ATS Score</div>
        </div>
        <div>
          <h3 style={{ margin:"0 0 14px",fontSize:15,fontWeight:800,color: isDark?"#f1f5f9":"#1e293b",fontFamily:"'Poppins',sans-serif" }}>Category Breakdown</h3>
          {Object.entries(result.categories||{}).map(([key,val])=>(
            <div key={key} style={{ marginBottom:9 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                <span style={{ fontSize:12,fontWeight:600,color: isDark?"#94a3b8":"#64748b",textTransform:"capitalize",fontFamily:"'Poppins',sans-serif" }}>{key}</span>
                <span style={{ fontSize:12,fontWeight:700,color: isDark?"#f1f5f9":"#1e293b",fontFamily:"'Poppins',sans-serif" }}>{val.score}%</span>
              </div>
              <div style={{ height:7,background: isDark?"#0f172a":"#f1f5f9",borderRadius:4,overflow:"hidden",marginBottom:2 }}>
                <div style={{ height:"100%",width:`${val.score}%`,borderRadius:4,transition:"width 1.2s ease",background: val.score>=80?"#22c55e":val.score>=60?"#f59e0b":"#ef4444" }}/>
              </div>
              <p style={{ fontSize:11,color: isDark?"#64748b":"#94a3b8",margin:0,fontFamily:"'Poppins',sans-serif" }}>{val.feedback}</p>
            </div>
          ))}
        </div>
      </div>
      {result.strengths?.length>0 && (
        <div style={{ background: isDark?"#052e16":"#f0fdf4",borderRadius:12,border:`1.5px solid ${isDark?"#14532d":"#86efac"}`,padding:16,marginBottom:14 }}>
          <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:8 }}>
            <CheckCircle size={15} color="#16a34a"/>
            <span style={{ fontWeight:700,fontSize:13,color: isDark?"#4ade80":"#15803d",fontFamily:"'Poppins',sans-serif" }}>Strengths</span>
          </div>
          {result.strengths.map((s,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:5 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#16a34a",flexShrink:0,marginTop:5 }}/>
              <span style={{ fontSize:12.5,color: isDark?"#86efac":"#166534",fontFamily:"'Poppins',sans-serif" }}>{s}</span>
            </div>
          ))}
        </div>
      )}
      {result.weakAreas?.length>0 && (
        <div>
          <h3 style={{ fontSize:14,fontWeight:800,color: isDark?"#f1f5f9":"#1e293b",marginBottom:10,display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}>
            <AlertTriangle size={15} color="#f59e0b"/> Areas to Improve ({result.weakAreas.length})
          </h3>
          {result.weakAreas.map((area,i)=>(
            <div key={i} style={{ background:sevBg[area.severity]||( isDark?"#1e293b":"#fff"),borderRadius:12,border:`1.5px solid ${sevBdr[area.severity]||( isDark?"#334155":"#e2e8f0")}`,padding:15,marginBottom:11 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:sevCol[area.severity]||"#94a3b8",color:"#fff",textTransform:"uppercase",letterSpacing:".05em",fontFamily:"'Poppins',sans-serif" }}>{area.severity}</span>
                  <span style={{ fontSize:13,fontWeight:700,color: isDark?"#f1f5f9":"#1e293b",fontFamily:"'Poppins',sans-serif" }}>{area.section}</span>
                </div>
                <Btn size="sm" icon={Edit2} variant="ghost" onClick={()=>{setEditIdx(i);setEditVal(area.current||area.suggestion||"");}}>Fix This</Btn>
              </div>
              <p style={{ fontSize:12.5,color: isDark?"#cbd5e1":"#374151",margin:"0 0 8px",fontFamily:"'Poppins',sans-serif" }}>{area.issue}</p>
              <div style={{ background: isDark?"rgba(255,255,255,.05)":"rgba(255,255,255,.7)",borderRadius:8,padding:"9px 11px" }}>
                <p style={{ fontSize:10.5,fontWeight:700,color: isDark?"#64748b":"#6b7280",margin:"0 0 3px",textTransform:"uppercase",letterSpacing:".05em",fontFamily:"'Poppins',sans-serif" }}>Suggestion</p>
                <p style={{ fontSize:12.5,color: isDark?"#cbd5e1":"#374151",margin:0,fontFamily:"'Poppins',sans-serif" }}>{area.suggestion}</p>
              </div>
              {editIdx===i && (
                <div style={{ marginTop:10,padding:12,background: isDark?"#0f172a":"#fff",borderRadius:8,border:"1.5px solid #6366f1" }}>
                  <p style={{ fontSize:10.5,fontWeight:700,color:"#6366f1",margin:"0 0 7px",textTransform:"uppercase",fontFamily:"'Poppins',sans-serif" }}>Edit Content</p>
                  <textarea value={editVal} onChange={e=>setEditVal(e.target.value)} rows={3}
                    style={{ width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${isDark?"#334155":"#e2e8f0"}`,fontSize:12.5,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"'Poppins',sans-serif",background: isDark?"#1e293b":"#fff",color: isDark?"#f1f5f9":"#1e293b" }}/>
                  <div style={{ display:"flex",gap:7,marginTop:7,flexWrap:"wrap" }}>
                    <Btn size="sm" icon={Sparkles} variant="warning" onClick={()=>setEditVal(area.suggestion)}>Use AI Suggestion</Btn>
                    <Btn size="sm" icon={Check} variant="success" onClick={()=>{ onUpdateResume(area.section, editVal, area); setEditIdx(null); }}>Apply</Btn>
                    <Btn size="sm" variant="secondary" icon={X} onClick={()=>setEditIdx(null)}>Cancel</Btn>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const isDark = useDarkMode();

  const [data,   setData]   = useState(DEFAULT_DATA);
  const [tab,    setTab]    = useState("start");
  const [theme,  setTheme]  = useState("modern");
  const [toast,  setToast]  = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [expLevel, setExpLevel] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiInfo, setAiInfo] = useState({ name:"", title:"", experience:"", skills:"" });
  const [aiJobDesc, setAiJobDesc] = useState("");
  const [generatedData, setGeneratedData] = useState(null);

  const [ghUser,    setGhUser]    = useState("");
  const [ghRepos,   setGhRepos]   = useState([]);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError,   setGhError]   = useState("");
  const [ghSel,     setGhSel]     = useState([]);

  const fileRef = useRef();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadName,    setUploadName]    = useState("");

  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult,  setAtsResult]  = useState(null);
  const [atsJobDesc, setAtsJobDesc] = useState("");

  const flash = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const setP = (k,v) => setData(d=>({...d,personal:{...d.personal,[k]:v}}));

  const addExp = ()  => setData(d=>({...d,experience:[...d.experience,{id:Date.now(),company:"",role:"",duration:"",location:"",bullets:[""]}]}));
  const upExp  = (id,k,v) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,[k]:v}:e)}));
  const delExp = id  => setData(d=>({...d,experience:d.experience.filter(e=>e.id!==id)}));
  const upBullet  = (id,i,v) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.map((b,j)=>j===i?v:b)}:e)}));
  const addBullet = id => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:[...e.bullets,""]}:e)}));
  const delBullet = (id,i) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.filter((_,j)=>j!==i)}:e)}));

  const addEdu = ()      => setData(d=>({...d,education:[...d.education,{id:Date.now(),institution:"",degree:"",duration:"",gpa:""}]}));
  const upEdu  = (id,k,v)=> setData(d=>({...d,education:d.education.map(e=>e.id===id?{...e,[k]:v}:e)}));
  const delEdu = id      => setData(d=>({...d,education:d.education.filter(e=>e.id!==id)}));

  const addSkill = s => { if(s&&!data.skills.includes(s)) setData(d=>({...d,skills:[...d.skills,s]})); setSkillInput(""); };
  const delSkill = s => setData(d=>({...d,skills:d.skills.filter(x=>x!==s)}));

  const addProj = ()      => setData(d=>({...d,projects:[...d.projects,{id:Date.now(),name:"",description:"",tech:[],github:"",live:""}]}));
  const upProj  = (id,k,v)=> setData(d=>({...d,projects:d.projects.map(p=>p.id===id?{...p,[k]:v}:p)}));
  const delProj = id      => setData(d=>({...d,projects:d.projects.filter(p=>p.id!==id)}));

  const addCert = ()      => setData(d=>({...d,certifications:[...d.certifications,{id:Date.now(),name:"",issuer:"",year:""}]}));
  const upCert  = (id,k,v)=> setData(d=>({...d,certifications:d.certifications.map(c=>c.id===id?{...c,[k]:v}:c)}));
  const delCert = id      => setData(d=>({...d,certifications:d.certifications.filter(c=>c.id!==id)}));

  const handleGenerate = async () => {
    setAiLoading(true);
    try {
      const levelContext = expLevel ? `Experience Level: ${expLevel.label}. ${expLevel.desc}.` : "";
      const result = await callClaudeJSON([{ role:"user", content:
        `Generate a complete professional resume.\n${levelContext}\nName: ${aiInfo.name||"Alex Johnson"}\nTarget Role: ${aiInfo.title||"Software Engineer"}\nYears of Experience: ${aiInfo.experience||"3"}\nKey Skills: ${aiInfo.skills||"React, Node.js, Python"}\n${aiJobDesc?`\nTailor for this job:\n${aiJobDesc}`:""}\n\nReturn ONLY valid JSON:\n{"personal":{"name":"","title":"","email":"","phone":"","location":"","summary":"","github":"","linkedin":"","website":""},"experience":[{"id":1,"company":"","role":"","duration":"","location":"","bullets":[""]}],"education":[{"id":1,"institution":"","degree":"","duration":"","gpa":""}],"skills":[""],"projects":[{"id":1,"name":"","description":"","tech":[""],"github":"","live":""}],"certifications":[{"id":1,"name":"","issuer":"","year":""}]}`
      }], "You are an expert resume writer. Return only valid JSON, no markdown.");
      const fixed = {
        ...result,
        experience:    (result.experience||[]).map((e,i)=>({...e,id:Date.now()+i})),
        education:     (result.education||[]).map((e,i)=>({...e,id:Date.now()+i+100})),
        projects:      (result.projects||[]).map((p,i)=>({...p,id:Date.now()+i+200})),
        certifications:(result.certifications||[]).map((c,i)=>({...c,id:Date.now()+i+300})),
        skills: result.skills||[],
      };
      setGeneratedData(fixed);
      flash("Resume generated!");
    } catch(e) { flash("Generation failed: "+e.message,"error"); }
    setAiLoading(false);
  };

  const handleFetchGH = async () => {
    if(!ghUser) return;
    setGhLoading(true); setGhError(""); setGhRepos([]); setGhSel([]);
    try {
      const repos = await fetchGitHubRepos(ghUser);
      setGhRepos(repos);
      if(!repos.length) setGhError("No public repos found.");
    } catch(e) { setGhError(e.message); }
    setGhLoading(false);
  };

  const handleImportGH = () => {
    const projs = ghRepos.filter(r=>ghSel.includes(r.id)).map(r=>({
      id:Date.now()+r.id, name:r.name, description:r.description||"",
      tech: r.language?[r.language]:[], github:`${ghUser}/${r.name}`, live:r.homepage||"",
    }));
    setData(d=>({...d,projects:[...d.projects,...projs]}));
    setGhSel([]); flash(`Imported ${projs.length} projects!`); setTab("builder");
  };

  const handleUpload = async file => {
    if(!file) return;
    setUploadLoading(true); setUploadName(file.name);
    try {
      let content;
      if(file.type==="application/pdf") {
        const b64 = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
        content = [
          { type:"document", source:{type:"base64",media_type:"application/pdf",data:b64} },
          { type:"text", text:'Extract all resume data from this PDF. Return ONLY valid JSON: {"personal":{"name":"","title":"","email":"","phone":"","location":"","summary":"","github":"","linkedin":"","website":""},"experience":[{"id":1,"company":"","role":"","duration":"","location":"","bullets":[""]}],"education":[{"id":1,"institution":"","degree":"","duration":"","gpa":""}],"skills":[""],"projects":[{"id":1,"name":"","description":"","tech":[""],"github":"","live":""}],"certifications":[{"id":1,"name":"","issuer":"","year":""}]}' },
        ];
      } else {
        const text = await file.text();
        content = `Extract resume data from this text. Return ONLY valid JSON:\n\n${text}\n\nFormat: {"personal":{"name":"","title":"","email":"","phone":"","location":"","summary":"","github":"","linkedin":"","website":""},"experience":[{"id":1,"company":"","role":"","duration":"","location":"","bullets":[""]}],"education":[{"id":1,"institution":"","degree":"","duration":"","gpa":""}],"skills":[""],"projects":[{"id":1,"name":"","description":"","tech":[""],"github":"","live":""}],"certifications":[{"id":1,"name":"","issuer":"","year":""}]}`;
      }
      const result = await callClaudeJSON([{role:"user",content}], "Extract resume data. Return only valid JSON.");
      const fixed = {
        ...DEFAULT_DATA,...result,
        experience:    (result.experience||[]).map((e,i)=>({...e,id:Date.now()+i})),
        education:     (result.education||[]).map((e,i)=>({...e,id:Date.now()+i+100})),
        projects:      (result.projects||[]).map((p,i)=>({...p,id:Date.now()+i+200})),
        certifications:(result.certifications||[]).map((c,i)=>({...c,id:Date.now()+i+300})),
      };
      setData(fixed); flash("Resume imported!"); setTab("builder");
    } catch(e) { flash("Upload failed: "+e.message,"error"); }
    setUploadLoading(false);
  };

  const handleATS = async () => {
    setAtsLoading(true); setAtsResult(null);
    try {
      const result = await callClaudeJSON([{ role:"user", content:
        `Analyze this resume for ATS compatibility.\n${atsJobDesc?`Target Job:\n${atsJobDesc}\n`:""}\nResume: ${JSON.stringify(data)}\nReturn ONLY valid JSON:\n{"score":0,"grade":"A","categories":{"keywords":{"score":0,"feedback":""},"formatting":{"score":0,"feedback":""},"experience":{"score":0,"feedback":""},"skills":{"score":0,"feedback":""},"education":{"score":0,"feedback":""},"summary":{"score":0,"feedback":""}},"weakAreas":[{"section":"","severity":"high","issue":"","suggestion":"","current":""}],"strengths":[],"improvements":[]}`
      }], "You are an ATS expert. Return only valid JSON. Score 0-100.");
      setAtsResult(result);
    } catch(e) { flash("ATS failed: "+e.message,"error"); }
    setAtsLoading(false);
  };

  const handleATSEdit = (section, value) => {
    const sec = section.toLowerCase();
    if(sec.includes("summary")) setP("summary", value);
    else if(sec.includes("skill")) {
      const newSkills = value.split(",").map(s=>s.trim()).filter(Boolean);
      setData(d=>({...d,skills:[...new Set([...d.skills,...newSkills])]}));
    } else if(sec.includes("experience")&&data.experience.length>0) {
      const exp = data.experience[0];
      setData(d=>({...d,experience:d.experience.map(e=>e.id===exp.id?{...e,bullets:[value,...e.bullets.slice(1)]}:e)}));
    }
    flash("Change applied! Review in Builder tab.");
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download="resume.json"; a.click();
    flash("Exported!");
  };

  // ─── Dynamic colors based on dark mode ───────────────────────────────────
  const C = {
    bg:  isDark ? "#0f172a" : "#f0f4ff",
    sur: isDark ? "#1e293b" : "#ffffff",
    pri: "#6366f1",
    txt: isDark ? "#f1f5f9" : "#1e1b4b",
    sub: isDark ? "#94a3b8" : "#64748b",
    bdr: isDark ? "#334155" : "#e2e8f0",
  };

  const TABS = [
    { id:"start",    label:"Get Started", icon:Rocket },
    { id:"builder",  label:"Builder",     icon:Edit2 },
    { id:"ai",       label:"AI Tools",    icon:Sparkles },
    { id:"ats",      label:"ATS Score",   icon:Target },
    { id:"portfolio",label:"Portfolio",   icon:Layers },
    { id:"preview",  label:"Preview",     icon:Eye },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Poppins',system-ui,sans-serif", color:C.txt, transition:"background .3s, color .3s" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href={FONT_LINK} rel="stylesheet"/>
      <style>{`
        @import url('${FONT_LINK}');
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
        *{box-sizing:border-box}
        body,*{font-family:'Poppins',system-ui,sans-serif!important}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${isDark?"#0f172a":"#f1f5f9"}}
        ::-webkit-scrollbar-thumb{background:${isDark?"#334155":"#cbd5e1"};border-radius:4px}
        @media print{body>*{display:none!important}.print-zone{display:block!important;position:fixed;top:0;left:0;width:100%}}
        input::placeholder, textarea::placeholder { color: ${isDark?"#475569":"#94a3b8"} !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed",top:18,right:18,zIndex:9999,padding:"11px 18px",borderRadius:12,
          background:toast.type==="error"?"#ef4444":"#22c55e",color:"#fff",fontWeight:700,fontSize:13,
          boxShadow:"0 8px 32px rgba(0,0,0,.2)",animation:"fadeUp .3s",display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}>
          {toast.type==="error"?<AlertTriangle size={14}/>:<CheckCircle size={14}/>}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4f46e5 55%,#0891b2 100%)", padding:"0 24px", boxShadow:"0 4px 24px rgba(79,70,229,.3)" }}>
        <div style={{ maxWidth:1440,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:62 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <FileText size={17} color="#fff"/>
            </div>
            <div>
              <div style={{ fontWeight:800,fontSize:16,color:"#fff",letterSpacing:"-.01em",fontFamily:"'Poppins',sans-serif" }}>ResumeAI</div>
              <div style={{ fontSize:9.5,color:"rgba(255,255,255,.5)",fontFamily:"'Poppins',sans-serif" }}>Build · Analyze · Impress</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:2,background:"rgba(255,255,255,.1)",borderRadius:12,padding:3 }}>
            {TABS.map(t=>{
              const active = tab===t.id;
              return (
                <button key={t.id} onClick={()=>setTab(t.id)}
                  style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,
                    background:active?"#fff":"transparent",color:active?C.pri:"rgba(255,255,255,.7)",transition:"all .2s",fontFamily:"'Poppins',sans-serif" }}>
                  <t.icon size={11}/>{t.label}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex",gap:7 }}>
            <Btn variant="ghost" icon={Download} onClick={handleExportJSON} size="sm" style={{ background:"rgba(255,255,255,.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,.25)" }}>Export</Btn>
            <Btn icon={Printer} onClick={()=>window.print()} size="sm" style={{ background:"rgba(255,255,255,.9)",color:"#4f46e5",border:"none" }}>Print PDF</Btn>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1440,margin:"0 auto",padding:"22px 18px" }}>

        {/* ═══════ GET STARTED ═══════ */}
        {tab==="start" && (
          <div style={{ maxWidth:860,margin:"0 auto" }}>
            <div style={{ textAlign:"center",marginBottom:32 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:20,background: isDark?"#312e81":"#ede9fe",marginBottom:14 }}>
                <Sparkles size={12} color="#6366f1"/>
                <span style={{ fontSize:11,fontWeight:700,color: isDark?"#a5b4fc":"#6366f1",fontFamily:"'Poppins',sans-serif" }}>AI-Powered Resume Builder</span>
              </div>
              <h1 style={{ fontSize:36,fontWeight:900,color:C.txt,margin:"0 0 10px",letterSpacing:"-.03em",fontFamily:"'Poppins',sans-serif" }}>Create Your Dream Resume</h1>
              <p style={{ fontSize:14,color:C.sub,maxWidth:480,margin:"0 auto",lineHeight:1.7,fontFamily:"'Poppins',sans-serif" }}>Pick your experience level, choose a template, and let AI do the heavy lifting. Works for students, freshers, and senior professionals alike.</p>
            </div>

            <ExperienceLevelPicker selected={expLevel} isDark={isDark} onSelect={lvl=>{
              setExpLevel(lvl);
              setData(d=>({...d,personal:{...d.personal,summary:lvl.defaultSummary}}));
              setAiInfo(p=>({...p,experience: lvl.id==="student"?"0":lvl.id==="junior"?"1":lvl.id==="mid"?"4":lvl.id==="senior"?"8":"12"}));
            }}/>

            {/* Template picker */}
            <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:20,marginBottom:20,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ fontWeight:700,fontSize:14,color:C.txt,marginBottom:14,display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}>
                <LayoutTemplate size={15} color="#6366f1"/> Choose Template
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11 }}>
                {Object.entries(THEMES).map(([key,t])=>(
                  <div key={key} onClick={()=>setTheme(key)}
                    style={{ borderRadius:12,overflow:"hidden",border:`2px solid ${theme===key?"#6366f1":C.bdr}`,cursor:"pointer",transition:"all .2s",boxShadow:theme===key?"0 0 0 3px #6366f122":"none" }}>
                    <div style={{ background: isDark?"#1e293b":t.bg,padding:11,minHeight:80 }}>
                      <div style={{ background:key==="dark"?"#020617":key==="ocean"?"#0c4a6e":"linear-gradient(135deg,#1e1b4b,#4f46e5)",height:18,borderRadius:4,marginBottom:6 }}/>
                      <div style={{ display:"flex",gap:4 }}>
                        <div style={{ background: isDark?"#334155":t.border,height:6,borderRadius:3,flex:1 }}/>
                        <div style={{ background: isDark?"#334155":t.border,height:6,borderRadius:3,flex:2 }}/>
                      </div>
                      <div style={{ marginTop:5 }}>
                        <div style={{ background: isDark?"#334155":t.border,height:5,borderRadius:3,marginBottom:3,width:"70%" }}/>
                        <div style={{ background: isDark?"#334155":t.border,height:5,borderRadius:3,width:"50%" }}/>
                      </div>
                    </div>
                    <div style={{ padding:"8px 11px",background:theme===key?"#6366f1": isDark?"#0f172a":"#f8fafc",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                      <span style={{ fontSize:11.5,fontWeight:700,color:theme===key?"#fff": isDark?"#cbd5e1":"#374151",fontFamily:"'Poppins',sans-serif" }}>{t.name}</span>
                      {theme===key && <Check size={12} color="#fff"/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start buttons */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13,marginBottom:20 }}>
              {[
                { icon:Wand2, color:"#6366f1", bg: isDark?"#312e81":"#ede9fe", title:"AI Generate", desc:"Fill in basics, AI writes everything", action:()=>setTab("ai") },
                { icon:Edit2, color:"#0891b2", bg: isDark?"#0c4a6e":"#e0f2fe", title:"Build Manually", desc:"Full control, step by step", action:()=>setTab("builder") },
                { icon:Upload, color:"#059669", bg: isDark?"#052e16":"#dcfce7", title:"Upload Resume", desc:"Import from PDF, DOCX, or TXT", action:()=>setTab("ai") },
              ].map(opt=>(
                <div key={opt.title} onClick={opt.action}
                  style={{ background:C.sur,borderRadius:14,border:`1.5px solid ${C.bdr}`,padding:"20px 18px",cursor:"pointer",transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 28px rgba(99,102,241,.12)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ width:44,height:44,borderRadius:12,background:opt.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12 }}>
                    <opt.icon size={20} color={opt.color}/>
                  </div>
                  <div style={{ fontWeight:700,fontSize:13.5,color:C.txt,marginBottom:4,fontFamily:"'Poppins',sans-serif" }}>{opt.title}</div>
                  <div style={{ fontSize:11.5,color:C.sub,marginBottom:12,fontFamily:"'Poppins',sans-serif" }}>{opt.desc}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:5,color:opt.color,fontWeight:700,fontSize:11.5,fontFamily:"'Poppins',sans-serif" }}>
                    Start <ChevronRight size={13}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ BUILDER ═══════ */}
        {tab==="builder" && (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
            <div style={{ overflowY:"auto",maxHeight:"calc(100vh - 120px)",paddingRight:3 }}>
              {expLevel && (
                <div style={{ padding:"10px 14px",borderRadius:10,background: isDark?`${expLevel.color}22`:expLevel.bg,border:`1.5px solid ${expLevel.color}33`,marginBottom:12,display:"flex",alignItems:"center",gap:9 }}>
                  <expLevel.icon size={15} color={expLevel.color}/>
                  <span style={{ fontSize:12,fontWeight:600,color:expLevel.color,fontFamily:"'Poppins',sans-serif" }}>Tailored for: {expLevel.label}</span>
                  <button onClick={()=>setTab("start")} style={{ marginLeft:"auto",fontSize:10.5,color:C.sub,background:"none",border:"none",cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>Change →</button>
                </div>
              )}
              <Card title="Personal Information" icon={User} isDark={isDark}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
                  <Inp label="Full Name"    value={data.personal.name}     onChange={v=>setP("name",v)}     placeholder="Your Name"           icon={User}      isDark={isDark}/>
                  <Inp label="Job Title"    value={data.personal.title}    onChange={v=>setP("title",v)}    placeholder="Software Developer"  icon={Briefcase} isDark={isDark}/>
                  <Inp label="Email"        value={data.personal.email}    onChange={v=>setP("email",v)}    placeholder="you@email.com"       icon={Mail}      isDark={isDark}/>
                  <Inp label="Phone"        value={data.personal.phone}    onChange={v=>setP("phone",v)}    placeholder="+91 9876543210"       icon={Phone}     isDark={isDark}/>
                  <Inp label="Location"     value={data.personal.location} onChange={v=>setP("location",v)} placeholder="City, Country"       icon={MapPin}    isDark={isDark}/>
                  <Inp label="Website"      value={data.personal.website}  onChange={v=>setP("website",v)}  placeholder="yoursite.com"        icon={Globe}     isDark={isDark}/>
                  <Inp label="GitHub"       value={data.personal.github}   onChange={v=>setP("github",v)}   placeholder="username"            icon={Github}    isDark={isDark}/>
                  <Inp label="LinkedIn"     value={data.personal.linkedin} onChange={v=>setP("linkedin",v)} placeholder="username"            icon={Linkedin}  isDark={isDark}/>
                </div>
                <Txt label="Summary / About" value={data.personal.summary} onChange={v=>setP("summary",v)} rows={3} placeholder="Compelling professional summary…" isDark={isDark}/>
                {expLevel && (
                  <button onClick={()=>setP("summary",expLevel.defaultSummary)} style={{ fontSize:11,color:"#6366f1",background: isDark?"#312e81":"#ede9fe",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:600,marginTop:4,fontFamily:"'Poppins',sans-serif" }}>
                    <Sparkles size={10} style={{ display:"inline",marginRight:4 }}/>Use AI suggestion for {expLevel.label}
                  </button>
                )}
              </Card>

              <Card title="Work Experience" icon={Briefcase} onAdd={addExp} addLabel="Add Job" isDark={isDark}>
                {expLevel?.id==="student" && (
                  <div style={{ padding:"8px 11px",background: isDark?"#422006":"#fef9c3",borderRadius:7,border:`1.5px solid ${isDark?"#78350f":"#fde68a"}`,marginBottom:11,fontSize:11,color: isDark?"#fcd34d":"#92400e",fontFamily:"'Poppins',sans-serif" }}>
                    💡 Fresher tip: Add internships, college projects, or part-time work here.
                  </div>
                )}
                {data.experience.map((exp,idx)=>(
                  <div key={exp.id} style={{ marginBottom:16,padding:13,borderRadius:10,background: isDark?"#0f172a":"#f8fafc",border:`1.5px solid ${C.bdr}` }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:9 }}>
                      <span style={{ fontWeight:700,fontSize:12.5,color:"#6366f1",fontFamily:"'Poppins',sans-serif" }}>Job #{idx+1}</span>
                      <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>delExp(exp.id)}>Remove</Btn>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
                      <Inp label="Company"  value={exp.company}  onChange={v=>upExp(exp.id,"company",v)}  placeholder="Company Name"      icon={Building}  isDark={isDark}/>
                      <Inp label="Role"     value={exp.role}     onChange={v=>upExp(exp.id,"role",v)}     placeholder="Software Engineer" icon={Briefcase} isDark={isDark}/>
                      <Inp label="Duration" value={exp.duration} onChange={v=>upExp(exp.id,"duration",v)} placeholder="Jan 2023 – Present" icon={Calendar}  isDark={isDark}/>
                      <Inp label="Location" value={exp.location} onChange={v=>upExp(exp.id,"location",v)} placeholder="Remote / City"     icon={MapPin}    isDark={isDark}/>
                    </div>
                    <label style={{ fontSize:10,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:C.sub,display:"block",marginBottom:5,fontFamily:"'Poppins',sans-serif" }}>
                      {expLevel?.id==="student"?"Projects / Achievements":"Achievements (with numbers!)"}
                    </label>
                    {exp.bullets.map((b,i)=>(
                      <div key={i} style={{ display:"flex",gap:5,marginBottom:5 }}>
                        <input value={b} onChange={e=>upBullet(exp.id,i,e.target.value)} placeholder={`Achievement ${i+1} — add metrics!`}
                          style={{ flex:1,padding:"7px 9px",borderRadius:7,border:`1.5px solid ${C.bdr}`,fontSize:12,outline:"none",background: isDark?"#1e293b":"#fff",color:C.txt,fontFamily:"'Poppins',sans-serif" }}/>
                        <button onClick={()=>delBullet(exp.id,i)} style={{ padding:"7px 9px",borderRadius:7,border:"none",background:"#fee2e2",color:"#ef4444",cursor:"pointer" }}>
                          <X size={11}/>
                        </button>
                      </div>
                    ))}
                    <button onClick={()=>addBullet(exp.id)} style={{ fontSize:11.5,color:"#6366f1",background:"none",border:"none",cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:4,fontFamily:"'Poppins',sans-serif" }}>
                      <Plus size={11}/> Add achievement
                    </button>
                  </div>
                ))}
                {data.experience.length===0 && <p style={{ textAlign:"center",color:C.sub,fontSize:12,padding:"16px 0",fontFamily:"'Poppins',sans-serif" }}>No experience yet. Click "Add Job" above.</p>}
              </Card>

              <Card title="Education" icon={GraduationCap} onAdd={addEdu} addLabel="Add" isDark={isDark}>
                {data.education.map((edu,idx)=>(
                  <div key={edu.id} style={{ marginBottom:13,padding:13,borderRadius:10,background: isDark?"#0f172a":"#f8fafc",border:`1.5px solid ${C.bdr}` }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                      <span style={{ fontWeight:700,fontSize:12.5,color:"#6366f1",fontFamily:"'Poppins',sans-serif" }}>Education #{idx+1}</span>
                      <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>delEdu(edu.id)}>Remove</Btn>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
                      <Inp label="Institution" value={edu.institution} onChange={v=>upEdu(edu.id,"institution",v)} placeholder="University Name"       isDark={isDark}/>
                      <Inp label="Degree"      value={edu.degree}      onChange={v=>upEdu(edu.id,"degree",v)}      placeholder="B.S. Computer Science" isDark={isDark}/>
                      <Inp label="Duration"    value={edu.duration}    onChange={v=>upEdu(edu.id,"duration",v)}    placeholder="2020 – 2024" icon={Calendar} isDark={isDark}/>
                      <Inp label="GPA / %"     value={edu.gpa}         onChange={v=>upEdu(edu.id,"gpa",v)}         placeholder="3.8/4.0 or 85%"        isDark={isDark}/>
                    </div>
                  </div>
                ))}
              </Card>

              <Card title="Skills" icon={Zap} isDark={isDark}>
                <div style={{ display:"flex",gap:7,marginBottom:9 }}>
                  <input value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill(skillInput)}
                    placeholder="Type a skill + Enter…"
                    style={{ flex:1,padding:"8px 11px",borderRadius:8,border:`1.5px solid ${C.bdr}`,fontSize:12.5,outline:"none",background: isDark?"#0f172a":"#fff",color:C.txt,fontFamily:"'Poppins',sans-serif" }}/>
                  <Btn icon={Plus} onClick={()=>addSkill(skillInput)}>Add</Btn>
                </div>
                <div style={{ marginBottom:9 }}>{data.skills.map(s=><Tag key={s} label={s} onRemove={()=>delSkill(s)}/>)}</div>
                <div>
                  <span style={{ fontSize:11,color:C.sub,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>Suggestions: </span>
                  {SKILLS_SUGGESTIONS.filter(s=>!data.skills.includes(s)).slice(0,9).map(s=>(
                    <span key={s} onClick={()=>addSkill(s)} style={{ fontSize:11,color:"#6366f1",cursor:"pointer",marginRight:7,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>+{s}</span>
                  ))}
                </div>
              </Card>

              <Card title="Projects" icon={Rocket} onAdd={addProj} addLabel="Add Project" isDark={isDark}>
                {expLevel?.id==="student" && (
                  <div style={{ padding:"8px 11px",background: isDark?"#052e16":"#f0fdf4",borderRadius:7,border:`1.5px solid ${isDark?"#14532d":"#86efac"}`,marginBottom:11,fontSize:11,color: isDark?"#4ade80":"#166534",fontFamily:"'Poppins',sans-serif" }}>
                    🚀 Fresher tip: Projects are your portfolio! Add college projects, personal apps, and open source contributions.
                  </div>
                )}
                {data.projects.map((p,idx)=>(
                  <div key={p.id} style={{ marginBottom:13,padding:13,borderRadius:10,background: isDark?"#0f172a":"#f8fafc",border:`1.5px solid ${C.bdr}` }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                      <span style={{ fontWeight:700,fontSize:12.5,color:"#6366f1",fontFamily:"'Poppins',sans-serif" }}>Project #{idx+1}</span>
                      <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>delProj(p.id)}>Remove</Btn>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
                      <Inp label="Name"       value={p.name}             onChange={v=>upProj(p.id,"name",v)}                                             placeholder="My App"    icon={Package} isDark={isDark}/>
                      <Inp label="Live URL"   value={p.live}             onChange={v=>upProj(p.id,"live",v)}                                             placeholder="myapp.com" icon={Globe}   isDark={isDark}/>
                      <Inp label="GitHub"     value={p.github}           onChange={v=>upProj(p.id,"github",v)}                                           placeholder="user/repo" icon={Github}  isDark={isDark}/>
                      <Inp label="Tech Stack" value={p.tech?.join(", ")} onChange={v=>upProj(p.id,"tech",v.split(",").map(t=>t.trim()).filter(Boolean))} placeholder="React, Node.js" icon={Code} isDark={isDark}/>
                    </div>
                    <Txt label="Description" value={p.description} onChange={v=>upProj(p.id,"description",v)} rows={2} isDark={isDark}/>
                  </div>
                ))}
              </Card>

              <Card title="Certifications" icon={Award} onAdd={addCert} addLabel="Add" isDark={isDark}>
                {data.certifications.map((c,idx)=>(
                  <div key={c.id} style={{ display:"grid",gridTemplateColumns:"1fr 1fr 80px auto",gap:7,alignItems:"end",marginBottom:7 }}>
                    <Inp label={idx===0?"Name":""}   value={c.name}   onChange={v=>upCert(c.id,"name",v)}   placeholder="AWS Developer" isDark={isDark}/>
                    <Inp label={idx===0?"Issuer":""} value={c.issuer} onChange={v=>upCert(c.id,"issuer",v)} placeholder="Amazon"       isDark={isDark}/>
                    <Inp label={idx===0?"Year":""}   value={c.year}   onChange={v=>upCert(c.id,"year",v)}   placeholder="2024"         isDark={isDark}/>
                    <button onClick={()=>delCert(c.id)} style={{ height:36,marginBottom:11,padding:"0 11px",borderRadius:8,border:"none",background:"#fee2e2",color:"#ef4444",cursor:"pointer",display:"flex",alignItems:"center" }}>
                      <X size={12}/>
                    </button>
                  </div>
                ))}
              </Card>
            </div>

            {/* Live Preview */}
            <div>
              <div style={{ background:C.sur,borderRadius:15,border:`1.5px solid ${C.bdr}`,boxShadow:"0 8px 40px rgba(99,102,241,.09)",overflow:"hidden",position:"sticky",top:18 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1.5px solid ${C.bdr}`,background: isDark?"#0f172a":"#f8fafc" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <Eye size={13} color="#6366f1"/>
                    <span style={{ fontWeight:700,fontSize:12.5,fontFamily:"'Poppins',sans-serif",color:C.txt }}>Live Preview</span>
                  </div>
                  <div style={{ display:"flex",gap:4 }}>
                    {Object.entries(THEMES).map(([key,t])=>(
                      <button key={key} onClick={()=>setTheme(key)}
                        style={{ padding:"4px 9px",borderRadius:6,border:`1.5px solid ${theme===key?"#6366f1":C.bdr}`,background:theme===key?"#6366f1": isDark?"#1e293b":"#fff",color:theme===key?"#fff":C.sub,fontSize:10.5,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ maxHeight:"calc(100vh - 190px)",overflowY:"auto",background:THEMES[theme].bg }}>
                  <ResumePreview data={data} theme={theme}/>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ AI TOOLS ═══════ */}
        {tab==="ai" && (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18 }}>
            {/* Auto Generate */}
            <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:18 }}>
                <div style={{ width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#6366f1,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Wand2 size={18} color="#fff"/>
                </div>
                <div>
                  <h3 style={{ margin:0,fontSize:14,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>AI Generate</h3>
                  <p style={{ margin:0,fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>Claude writes your full resume</p>
                </div>
              </div>
              {expLevel && (
                <div style={{ marginBottom:12,padding:"8px 12px",borderRadius:9,background: isDark?`${expLevel.color}22`:expLevel.bg,border:`1.5px solid ${expLevel.color}33`,display:"flex",alignItems:"center",gap:7 }}>
                  <expLevel.icon size={13} color={expLevel.color}/>
                  <span style={{ fontSize:11,fontWeight:600,color:expLevel.color,fontFamily:"'Poppins',sans-serif" }}>Mode: {expLevel.label}</span>
                </div>
              )}
              <Inp label="Your Name"          value={aiInfo.name}       onChange={v=>setAiInfo(p=>({...p,name:v}))}       placeholder="Your Full Name"           icon={User}      isDark={isDark}/>
              <Inp label="Target Role"         value={aiInfo.title}      onChange={v=>setAiInfo(p=>({...p,title:v}))}      placeholder="Senior Software Engineer" icon={Briefcase} isDark={isDark}/>
              <Inp label="Years of Experience" value={aiInfo.experience} onChange={v=>setAiInfo(p=>({...p,experience:v}))} placeholder="3"                                         isDark={isDark}/>
              <Inp label="Key Skills"          value={aiInfo.skills}     onChange={v=>setAiInfo(p=>({...p,skills:v}))}     placeholder="React, Node.js, Python"   icon={Zap}       isDark={isDark}/>
              <Txt label="Job Description (optional)" value={aiJobDesc} onChange={setAiJobDesc} rows={4} placeholder="Paste job description to tailor the resume…" isDark={isDark}/>
              <Btn icon={Sparkles} onClick={handleGenerate} loading={aiLoading} size="lg">{aiLoading?"Generating…":"Generate Resume"}</Btn>
              {generatedData && (
                <div style={{ marginTop:14,padding:13,background: isDark?"#052e16":"#f0fdf4",borderRadius:10,border:`1.5px solid ${isDark?"#14532d":"#86efac"}` }}>
                  <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:9 }}>
                    <CheckCircle size={14} color="#16a34a"/>
                    <span style={{ fontWeight:700,fontSize:12.5,color: isDark?"#4ade80":"#15803d",fontFamily:"'Poppins',sans-serif" }}>Generated for: {generatedData.personal?.name}</span>
                  </div>
                  <Btn icon={ArrowRight} variant="success" onClick={()=>{ setData(generatedData); setGeneratedData(null); setTab("builder"); flash("Resume applied!"); }}>
                    Apply to Builder
                  </Btn>
                </div>
              )}
            </div>

            {/* GitHub Import */}
            <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:18 }}>
                <div style={{ width:40,height:40,borderRadius:11,background:"#1e293b",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Github size={18} color="#fff"/>
                </div>
                <div>
                  <h3 style={{ margin:0,fontSize:14,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>GitHub Import</h3>
                  <p style={{ margin:0,fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>Import your repositories</p>
                </div>
              </div>
              <div style={{ display:"flex",gap:7,marginBottom:14 }}>
                <input value={ghUser} onChange={e=>setGhUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleFetchGH()}
                  placeholder="GitHub username"
                  style={{ flex:1,padding:"8px 11px",borderRadius:8,border:`1.5px solid ${C.bdr}`,fontSize:12.5,outline:"none",background: isDark?"#0f172a":"#fff",color:C.txt,fontFamily:"'Poppins',sans-serif" }}/>
                <Btn icon={Search} onClick={handleFetchGH} loading={ghLoading}>Fetch</Btn>
              </div>
              {ghError && <p style={{ color:"#ef4444",fontSize:12.5,margin:"0 0 10px",display:"flex",alignItems:"center",gap:5,fontFamily:"'Poppins',sans-serif" }}><AlertTriangle size={13}/>{ghError}</p>}
              {ghRepos.length>0 && (
                <>
                  <div style={{ maxHeight:300,overflowY:"auto",borderRadius:10,border:`1.5px solid ${C.bdr}` }}>
                    {ghRepos.map(repo=>(
                      <div key={repo.id} onClick={()=>setGhSel(s=>s.includes(repo.id)?s.filter(id=>id!==repo.id):[...s,repo.id])}
                        style={{ display:"flex",alignItems:"flex-start",gap:9,padding:"10px 13px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer",background:ghSel.includes(repo.id)? isDark?"#312e81":"#ede9fe": C.sur,transition:"background .15s" }}>
                        <div style={{ width:17,height:17,borderRadius:5,border:`2px solid ${ghSel.includes(repo.id)?"#6366f1":C.bdr}`,background:ghSel.includes(repo.id)?"#6366f1": isDark?"#0f172a":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                          {ghSel.includes(repo.id)&&<Check size={10} color="#fff"/>}
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontWeight:700,fontSize:12.5,color:C.txt,marginBottom:2,fontFamily:"'Poppins',sans-serif" }}>{repo.name}</div>
                          <div style={{ fontSize:11,color:C.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'Poppins',sans-serif" }}>{repo.description||"No description"}</div>
                          <div style={{ display:"flex",gap:10,marginTop:3 }}>
                            {repo.language&&<span style={{ fontSize:10.5,color:C.sub,display:"flex",alignItems:"center",gap:2,fontFamily:"'Poppins',sans-serif" }}><Code size={9}/>{repo.language}</span>}
                            <span style={{ fontSize:10.5,color:C.sub,display:"flex",alignItems:"center",gap:2,fontFamily:"'Poppins',sans-serif" }}><Star size={9}/>{repo.stargazers_count}</span>
                            <span style={{ fontSize:10.5,color:C.sub,display:"flex",alignItems:"center",gap:2,fontFamily:"'Poppins',sans-serif" }}><GitFork size={9}/>{repo.forks_count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <span style={{ fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>{ghSel.length} selected</span>
                    <Btn icon={Plus} onClick={handleImportGH} disabled={ghSel.length===0}>Import Selected</Btn>
                  </div>
                </>
              )}
              {!ghRepos.length&&!ghLoading&&!ghError&&(
                <div style={{ textAlign:"center",padding:"28px 16px",color:C.sub }}>
                  <Github size={34} style={{ opacity:.2,marginBottom:9 }}/>
                  <p style={{ fontSize:12.5,margin:0,fontFamily:"'Poppins',sans-serif" }}>Enter your GitHub username to fetch public repos</p>
                </div>
              )}
            </div>

            {/* Upload */}
            <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:18 }}>
                <div style={{ width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#0891b2,#0e7490)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Upload size={18} color="#fff"/>
                </div>
                <div>
                  <h3 style={{ margin:0,fontSize:14,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>Upload Resume</h3>
                  <p style={{ margin:0,fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>PDF, DOCX, or TXT — AI extracts all data</p>
                </div>
              </div>
              <div onClick={()=>fileRef.current?.click()}
                onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.background= isDark?"#312e81":"#f5f3ff";}}
                onDragLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.background= isDark?"#0f172a":"#fff";}}
                onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.background= isDark?"#0f172a":"#fff";handleUpload(e.dataTransfer.files[0]);}}
                style={{ border:`2px dashed ${C.bdr}`,borderRadius:12,padding:"30px 16px",textAlign:"center",cursor:"pointer",transition:"all .2s",background: isDark?"#0f172a":"#fff",marginBottom:14 }}>
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={e=>handleUpload(e.target.files[0])} style={{ display:"none" }}/>
                {uploadLoading ? (
                  <div>
                    <RefreshCw size={30} color="#6366f1" style={{ animation:"spin 1s linear infinite",marginBottom:9 }}/>
                    <p style={{ fontSize:12.5,color:C.sub,margin:0,fontFamily:"'Poppins',sans-serif" }}>Parsing {uploadName}…</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={28} color={isDark?"#475569":"#94a3b8"} style={{ marginBottom:9 }}/>
                    <p style={{ fontSize:13.5,fontWeight:700,color:C.txt,margin:"0 0 5px",fontFamily:"'Poppins',sans-serif" }}>Drop your resume here</p>
                    <p style={{ fontSize:11.5,color:C.sub,margin:"0 0 14px",fontFamily:"'Poppins',sans-serif" }}>or click to browse</p>
                    <div style={{ display:"flex",gap:5,justifyContent:"center" }}>
                      {["PDF","DOCX","TXT"].map(ext=>(
                        <span key={ext} style={{ padding:"3px 9px",borderRadius:20,background: isDark?"#1e293b":"#f1f5f9",color:C.sub,fontSize:11,fontWeight:700,fontFamily:"'Poppins',sans-serif" }}>{ext}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding:13,background: isDark?"#0c1a3a":"#eff6ff",borderRadius:10,border:`1.5px solid ${isDark?"#1d4ed8":"#bfdbfe"}`,marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:6 }}>
                  <Linkedin size={13} color="#2563eb"/>
                  <span style={{ fontSize:12,fontWeight:700,color: isDark?"#93c5fd":"#1e40af",fontFamily:"'Poppins',sans-serif" }}>LinkedIn → PDF Import</span>
                </div>
                <p style={{ fontSize:11.5,color: isDark?"#60a5fa":"#1d4ed8",margin:"0 0 7px",fontFamily:"'Poppins',sans-serif" }}>Export your LinkedIn profile as PDF, then upload above to auto-import all career data.</p>
                <a href="https://www.linkedin.com/in/me/" target="_blank" rel="noreferrer"
                  style={{ fontSize:11,fontWeight:700,color:"#2563eb",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4,fontFamily:"'Poppins',sans-serif" }}>
                  Open LinkedIn <ExternalLink size={10}/>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ ATS SCORE ═══════ */}
        {tab==="ats" && (
          <div style={{ maxWidth:920,margin:"0 auto" }}>
            <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,marginBottom:18 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
                <div style={{ width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Target size={20} color="#fff"/>
                </div>
                <div>
                  <h2 style={{ margin:0,fontSize:16,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>ATS Score Analyzer</h2>
                  <p style={{ margin:0,fontSize:12.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>Check how well your resume passes Applicant Tracking Systems</p>
                </div>
              </div>
              <Txt label="Job Description (strongly recommended)" value={atsJobDesc} onChange={setAtsJobDesc} rows={5} placeholder="Paste the job description here for accurate scoring…" isDark={isDark}/>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <Btn icon={BarChart2} onClick={handleATS} loading={atsLoading} size="lg">{atsLoading?"Analyzing…":"Analyze My Resume"}</Btn>
                {atsResult&&<Btn variant="secondary" icon={RefreshCw} onClick={()=>{setAtsResult(null);setAtsJobDesc("");}}>Reset</Btn>}
              </div>
            </div>
            {atsLoading && (
              <div style={{ textAlign:"center",padding:48,background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}` }}>
                <RefreshCw size={34} color="#6366f1" style={{ animation:"spin 1s linear infinite",marginBottom:14 }}/>
                <p style={{ fontSize:14,fontWeight:700,color:C.txt,margin:"0 0 5px",fontFamily:"'Poppins',sans-serif" }}>Analyzing your resume…</p>
                <p style={{ fontSize:12.5,color:C.sub,margin:0,fontFamily:"'Poppins',sans-serif" }}>Checking keywords, formatting, experience & skills</p>
              </div>
            )}
            {atsResult&&!atsLoading && <ATSResults result={atsResult} onUpdateResume={handleATSEdit} isDark={isDark}/>}
            {!atsResult&&!atsLoading && (
              <div style={{ textAlign:"center",padding:"44px 28px",background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}` }}>
                <Target size={44} color={isDark?"#334155":"#e2e8f0"} style={{ marginBottom:14 }}/>
                <h3 style={{ fontSize:17,fontWeight:800,color:C.txt,margin:"0 0 7px",fontFamily:"'Poppins',sans-serif" }}>Ready to analyze?</h3>
                <p style={{ fontSize:13,color:C.sub,maxWidth:440,margin:"0 auto",fontFamily:"'Poppins',sans-serif" }}>Get a detailed ATS score with category breakdown, weak area detection, and inline editing.</p>
              </div>
            )}
          </div>
        )}

        {/* ═══════ PORTFOLIO ═══════ */}
        {tab==="portfolio" && (
          <div>
            <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4f46e5 100%)",borderRadius:20,padding:"42px 42px",marginBottom:22,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,.05)" }}/>
              <div style={{ position:"relative",zIndex:1 }}>
                <div style={{ width:62,height:62,borderRadius:17,background:"linear-gradient(135deg,#818cf8,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:13,fontWeight:900,color:"#fff" }}>
                  {data.personal.name.charAt(0)}
                </div>
                <h1 style={{ fontSize:32,fontWeight:900,color:"#fff",margin:"0 0 5px",letterSpacing:"-.03em",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
                <p style={{ fontSize:15,color:"rgba(255,255,255,.75)",margin:"0 0 14px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
                {expLevel && (
                  <div style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:20,background:"rgba(255,255,255,.15)",marginBottom:14 }}>
                    <expLevel.icon size={13} color="#fff"/>
                    <span style={{ fontSize:11.5,color:"#fff",fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{expLevel.label}</span>
                  </div>
                )}
                <p style={{ fontSize:13.5,color:"rgba(255,255,255,.6)",maxWidth:560,lineHeight:1.7,margin:"0 0 20px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.summary}</p>
                <div style={{ display:"flex",gap:9,flexWrap:"wrap" }}>
                  {data.personal.github   && <a href={`https://github.com/${data.personal.github}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:9,background:"rgba(255,255,255,.15)",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12.5,border:"1.5px solid rgba(255,255,255,.2)",fontFamily:"'Poppins',sans-serif" }}><Github size={13}/> GitHub</a>}
                  {data.personal.linkedin && <a href={`https://linkedin.com/in/${data.personal.linkedin}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:9,background:"rgba(255,255,255,.15)",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12.5,border:"1.5px solid rgba(255,255,255,.2)",fontFamily:"'Poppins',sans-serif" }}><Linkedin size={13}/> LinkedIn</a>}
                  {data.personal.website  && <a href={`https://${data.personal.website}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:9,background:"#6366f1",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12.5,fontFamily:"'Poppins',sans-serif" }}><Globe size={13}/> Portfolio</a>}
                </div>
              </div>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:22 }}>
              {[
                { label:"Projects",       value:data.projects.length,           icon:Rocket,    color:"#6366f1" },
                { label:"Skills",         value:data.skills.length,             icon:Zap,       color:"#0891b2" },
                { label:"Certifications", value:data.certifications?.length||0, icon:Award,     color:"#f59e0b" },
                { label:"Roles",          value:data.experience.length,          icon:Briefcase, color:"#22c55e" },
              ].map(s=>(
                <div key={s.label} style={{ background:C.sur,borderRadius:13,padding:"16px 20px",border:`1.5px solid ${C.bdr}`,display:"flex",alignItems:"center",gap:13 }}>
                  <div style={{ width:42,height:42,borderRadius:11,background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <s.icon size={19} color={s.color}/>
                  </div>
                  <div>
                    <div style={{ fontSize:24,fontWeight:900,color:s.color,fontFamily:"'Poppins',sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize:11.5,color:C.sub,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize:17,fontWeight:800,color:C.txt,marginBottom:13,display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}><Rocket size={16} color="#6366f1"/> Projects</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14,marginBottom:26 }}>
              {data.projects.map(p=>(
                <div key={p.id} style={{ background:C.sur,borderRadius:13,border:`1.5px solid ${C.bdr}`,padding:20,transition:"transform .2s,box-shadow .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(99,102,241,.12)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:9 }}>
                    <div style={{ width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <Package size={16} color="#fff"/>
                    </div>
                    <div style={{ display:"flex",gap:5 }}>
                      {p.github&&<a href={`https://github.com/${p.github}`} target="_blank" rel="noreferrer" style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background: isDark?"#312e81":"#ede9fe",color:"#6366f1",textDecoration:"none",display:"flex",alignItems:"center",gap:3,fontFamily:"'Poppins',sans-serif" }}><Github size={9}/> Code</a>}
                      {p.live  &&<a href={`https://${p.live}`} target="_blank" rel="noreferrer" style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background: isDark?"#052e16":"#dcfce7",color:"#16a34a",textDecoration:"none",display:"flex",alignItems:"center",gap:3,fontFamily:"'Poppins',sans-serif" }}><ExternalLink size={9}/> Live</a>}
                    </div>
                  </div>
                  <h3 style={{ fontSize:14.5,fontWeight:800,color:C.txt,margin:"0 0 5px",fontFamily:"'Poppins',sans-serif" }}>{p.name||"Untitled"}</h3>
                  <p style={{ fontSize:12.5,color:C.sub,margin:"0 0 11px",lineHeight:1.6,fontFamily:"'Poppins',sans-serif" }}>{p.description}</p>
                  <div>{p.tech?.map(t=><span key={t} style={{ fontSize:10.5,fontWeight:600,padding:"2px 8px",borderRadius:20,background: isDark?"#1e293b":"#f1f5f9",color:C.sub,marginRight:4,marginBottom:3,display:"inline-block",fontFamily:"'Poppins',sans-serif" }}>{t}</span>)}</div>
                </div>
              ))}
              {!data.projects.length && <div style={{ gridColumn:"1/-1",textAlign:"center",padding:40,color:C.sub }}><Rocket size={40} style={{ opacity:.2,marginBottom:10 }}/><p style={{ fontSize:13,fontFamily:"'Poppins',sans-serif" }}>No projects yet.</p></div>}
            </div>

            <h2 style={{ fontSize:17,fontWeight:800,color:C.txt,marginBottom:13,fontFamily:"'Poppins',sans-serif" }}><Zap size={16} color="#0891b2" style={{ display:"inline",marginRight:7 }}/>Skills</h2>
            <div style={{ background:C.sur,borderRadius:13,border:`1.5px solid ${C.bdr}`,padding:20,marginBottom:26 }}>
              <div>{data.skills.map((sk,i)=>(<span key={sk} style={{ display:"inline-block",padding:"6px 14px",borderRadius:24,margin:"4px 5px",fontWeight:700,fontSize:12.5,background:`hsl(${(i*47)%360},${isDark?40:70}%,${isDark?25:94}%)`,color:`hsl(${(i*47)%360},${isDark?60:55}%,${isDark?75:30}%)`,border:`1.5px solid hsl(${(i*47)%360},${isDark?40:55}%,${isDark?35:82}%)`,fontFamily:"'Poppins',sans-serif" }}>{sk}</span>))}</div>
            </div>

            <h2 style={{ fontSize:17,fontWeight:800,color:C.txt,marginBottom:13,fontFamily:"'Poppins',sans-serif" }}><Briefcase size={16} color="#22c55e" style={{ display:"inline",marginRight:7 }}/>Experience</h2>
            <div style={{ position:"relative",paddingLeft:28,marginBottom:26 }}>
              <div style={{ position:"absolute",left:7,top:0,bottom:0,width:2,background:"linear-gradient(to bottom,#6366f1,#0891b2)" }}/>
              {data.experience.map(exp=>(
                <div key={exp.id} style={{ position:"relative",marginBottom:18 }}>
                  <div style={{ position:"absolute",left:-24,top:14,width:13,height:13,borderRadius:"50%",background:"#6366f1",border:"3px solid "+C.bg,boxShadow:"0 0 0 2px #6366f1" }}/>
                  <div style={{ background:C.sur,borderRadius:13,border:`1.5px solid ${C.bdr}`,padding:"14px 18px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                      <span style={{ fontWeight:800,fontSize:13.5,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>{exp.role} <span style={{ color:"#6366f1",fontWeight:600 }}>@ {exp.company}</span></span>
                      <span style={{ fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>{exp.duration}</span>
                    </div>
                    {exp.bullets.filter(Boolean).map((b,j)=>(
                      <div key={j} style={{ fontSize:12.5,color:C.sub,marginBottom:3,paddingLeft:13,position:"relative",fontFamily:"'Poppins',sans-serif" }}>
                        <span style={{ position:"absolute",left:0,color:"#6366f1",fontWeight:900 }}>›</span>{b}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ PREVIEW ═══════ */}
        {tab==="preview" && (
          <div style={{ maxWidth:810,margin:"0 auto" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
              <h2 style={{ fontSize:16,fontWeight:800,color:C.txt,margin:0,fontFamily:"'Poppins',sans-serif" }}>
                <FileText size={15} color="#6366f1" style={{ display:"inline",marginRight:7 }}/>Print Preview
              </h2>
              <div style={{ display:"flex",gap:9 }}>
                <div style={{ display:"flex",gap:4 }}>
                  {Object.entries(THEMES).map(([key,t])=>(
                    <button key={key} onClick={()=>setTheme(key)}
                      style={{ padding:"6px 13px",borderRadius:8,border:`1.5px solid ${theme===key?"#6366f1":C.bdr}`,background:theme===key?"#6366f1": isDark?"#1e293b":"#fff",color:theme===key?"#fff":C.sub,fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>
                      {t.name}
                    </button>
                  ))}
                </div>
                <Btn icon={Printer} onClick={()=>window.print()} size="lg">Print / Save PDF</Btn>
              </div>
            </div>
            <div className="print-zone" style={{ background:THEMES[theme].bg,borderRadius:16,border:`1.5px solid ${C.bdr}`,boxShadow:"0 12px 48px rgba(0,0,0,.08)",overflow:"hidden" }}>
              <ResumePreview data={data} theme={theme}/>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}