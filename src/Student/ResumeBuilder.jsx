// import { useState, useRef, useEffect, useCallback } from "react";
// import {
//   User, Mail, Phone, MapPin, Globe, Github, Linkedin,
//   Briefcase, GraduationCap, Zap, Rocket, Award,
//   ChevronDown, ChevronUp, Plus, X, Trash2,
//   Download, Printer, Upload, Sparkles, BarChart2,
//   Eye, RefreshCw, CheckCircle, AlertTriangle,
//   ExternalLink, FileText, Target, TrendingUp, Code,
//   Edit2, Search, Star, GitFork, Building, Calendar,
//   Layers, Shield, Package, Wand2, ArrowRight,
//   Check, Info, Send, Lock, LayoutTemplate, BookOpen,
//   Coffee, Cpu, UserCheck, Lightbulb, ChevronRight
// } from "lucide-react";

// const FONT_LINK = `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap`;

// const EXPERIENCE_LEVELS = [
//   {
//     id: "student", label: "Student / Fresher", icon: BookOpen, color: "#8b5cf6", bg: "#f5f3ff",
//     desc: "Final year student or recent graduate with internships or projects",
//     tips: ["Focus on projects & academics", "List internships & hackathons", "Highlight skills & certifications"],
//     defaultSummary: "Motivated final-year Computer Science student with hands-on experience in software development through academic projects and internships. Passionate about building impactful technology solutions.",
//   },
//   {
//     id: "junior", label: "Junior (0–2 yrs)", icon: Coffee, color: "#0891b2", bg: "#f0f9ff",
//     desc: "Early career professional with 0–2 years of work experience",
//     tips: ["Show growth mindset", "Quantify impact of your work", "List all tech stack you know"],
//     defaultSummary: "Enthusiastic junior developer with 1+ years of professional experience. Quick learner who thrives in collaborative environments and loves turning complex problems into clean, efficient code.",
//   },
//   {
//     id: "mid", label: "Mid-Level (3–5 yrs)", icon: Cpu, color: "#059669", bg: "#f0fdf4",
//     desc: "Experienced developer with proven track record and ownership",
//     tips: ["Highlight leadership moments", "Show architecture decisions", "Metrics & team impact"],
//     defaultSummary: "Results-driven software engineer with 4 years of experience building scalable web applications. Proven ability to lead features end-to-end and mentor junior engineers.",
//   },
//   {
//     id: "senior", label: "Senior (6–10 yrs)", icon: UserCheck, color: "#d97706", bg: "#fffbeb",
//     desc: "Senior engineer with leadership, mentoring & architecture experience",
//     tips: ["Emphasize system design", "Show cross-team impact", "Thought leadership matters"],
//     defaultSummary: "Senior Software Engineer with 8 years of experience architecting distributed systems at scale. Led teams of 8+ engineers, drove technical strategy, and delivered products used by millions.",
//   },
//   {
//     id: "lead", label: "Lead / Principal (10+ yrs)", icon: Lightbulb, color: "#dc2626", bg: "#fef2f2",
//     desc: "Principal engineer, tech lead, or architect with deep expertise",
//     tips: ["Board-level impact stories", "Patents & publications", "Org-wide transformations"],
//     defaultSummary: "Principal Engineer and technology leader with 12+ years driving innovation across Fortune 500 companies. Expert in cloud architecture, DevOps transformation, and building high-performance engineering organizations.",
//   },
// ];

// const THEMES = {
//   modern: {
//     name: "Modern", accent: "#6366f1", accentLight: "#ede9fe", bg: "#ffffff",
//     headerBg: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)",
//     text: "#1e1b4b", sub: "#64748b", border: "#e2e8f0", sectionTitle: "#6366f1",
//     nameFontSize: 28, bodyFont: "'Poppins', sans-serif",
//   },
//   dark: {
//     name: "Dark", accent: "#22d3ee", accentLight: "#164e63", bg: "#0f172a",
//     headerBg: "linear-gradient(135deg, #020617 0%, #0c4a6e 100%)",
//     text: "#f1f5f9", sub: "#94a3b8", border: "#1e293b", sectionTitle: "#22d3ee",
//     nameFontSize: 28, bodyFont: "'Poppins', sans-serif",
//   },
//   minimal: {
//     name: "Minimal", accent: "#111827", accentLight: "#f3f4f6", bg: "#fafaf9",
//     headerBg: "#111827", text: "#1c1917", sub: "#6b7280", border: "#e5e7eb",
//     sectionTitle: "#374151", nameFontSize: 30, bodyFont: "'Poppins', sans-serif",
//   },
//   ocean: {
//     name: "Ocean", accent: "#0891b2", accentLight: "#e0f2fe", bg: "#f0f9ff",
//     headerBg: "linear-gradient(135deg, #0c4a6e 0%, #0891b2 100%)",
//     text: "#0c4a6e", sub: "#0369a1", border: "#bae6fd", sectionTitle: "#0891b2",
//     nameFontSize: 28, bodyFont: "'Poppins', sans-serif",
//   },
// };

// const SKILLS_SUGGESTIONS = [
//   "React","Node.js","Python","TypeScript","JavaScript","MongoDB","PostgreSQL",
//   "Docker","AWS","Git","Machine Learning","GraphQL","Redis","Kubernetes","CI/CD",
//   "Next.js","Vue.js","Angular","Spring Boot","FastAPI","TensorFlow","PyTorch",
//   "Java","Go","Rust","Swift","Kotlin","Flutter","React Native","Firebase",
// ];

// const DEFAULT_DATA = {
//   personal: {
//     name:"Alex Johnson", title:"Full Stack Developer",
//     email:"alex@example.com", phone:"+1 555-0100",
//     location:"San Francisco, CA",
//     summary:"Passionate developer with 3+ years building scalable web applications. Experienced in React, Node.js, and cloud infrastructure.",
//     github:"alexjohnson", linkedin:"alexjohnson", website:"alexjohnson.dev",
//   },
//   experience:[
//     { id:1, company:"TechCorp Inc.", role:"Software Engineer", duration:"Jan 2023 – Present", location:"Remote",
//       bullets:["Built microservices handling 1M+ req/day","Led team of 4 to redesign customer dashboard","Reduced load time by 40% via code-splitting"] },
//     { id:2, company:"StartupXYZ", role:"Frontend Developer", duration:"Jun 2021 – Dec 2022", location:"San Francisco, CA",
//       bullets:["Developed React SPA from scratch","Integrated Stripe payments","Implemented CI/CD pipeline with GitHub Actions"] },
//   ],
//   education:[
//     { id:1, institution:"UC Berkeley", degree:"B.S. Computer Science", duration:"2017 – 2021", gpa:"3.8/4.0" },
//   ],
//   skills:["React","Node.js","Python","TypeScript","MongoDB","Docker","AWS","Git"],
//   projects:[
//     { id:1, name:"DevFlow", description:"Open-source project management tool built with Next.js and Prisma. 500+ GitHub stars.", tech:["Next.js","Prisma","PostgreSQL"], github:"alexjohnson/devflow", live:"devflow.app" },
//     { id:2, name:"AIChat", description:"Real-time AI chat application with WebSocket support and OpenAI integration.", tech:["React","Socket.io","OpenAI"], github:"alexjohnson/aichat", live:"" },
//   ],
//   certifications:[
//     { id:1, name:"AWS Certified Developer", issuer:"Amazon", year:"2023" },
//     { id:2, name:"Google Cloud Associate", issuer:"Google", year:"2022" },
//   ],
// };

// async function callClaude(messages, system = "") {
//   const res = await fetch("https://api.anthropic.com/v1/messages", {
//     method:"POST",
//     headers:{ "Content-Type":"application/json" },
//     body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, system, messages }),
//   });
//   if (!res.ok) throw new Error(`API ${res.status}`);
//   const d = await res.json();
//   return d.content?.filter(b => b.type==="text").map(b => b.text).join("") || "";
// }

// async function callClaudeJSON(messages, system = "") {
//   const raw = await callClaude(messages, system);
//   const clean = raw.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
//   const m = clean.match(/\{[\s\S]*\}/);
//   if (!m) throw new Error("No JSON found");
//   return JSON.parse(m[0]);
// }

// async function fetchGitHubRepos(username) {
//   const r = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=20`);
//   if (!r.ok) throw new Error("GitHub user not found");
//   return r.json();
// }

// // ─── Dark Mode Hook ───────────────────────────────────────────────────────────
// function useDarkMode() {
//   const [isDark, setIsDark] = useState(() => {
//     return (
//       document.documentElement.classList.contains("dark") ||
//       document.body.classList.contains("dark") ||
//       document.documentElement.getAttribute("data-theme") === "dark" ||
//       document.documentElement.getAttribute("data-mode") === "dark"
//     );
//   });

//   useEffect(() => {
//     const checkDark = () => {
//       const dark =
//         document.documentElement.classList.contains("dark") ||
//         document.body.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark" ||
//         document.documentElement.getAttribute("data-mode") === "dark" ||
//         document.body.getAttribute("data-theme") === "dark";
//       setIsDark(dark);
//     };

//     const observer = new MutationObserver(checkDark);
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class", "data-theme", "data-mode"],
//     });
//     observer.observe(document.body, {
//       attributes: true,
//       attributeFilter: ["class", "data-theme", "data-mode"],
//     });

//     checkDark();
//     return () => observer.disconnect();
//   }, []);

//   return isDark;
// }

// // ─── Small UI Components ──────────────────────────────────────────────────────
// function Inp({ label, value, onChange, placeholder, type="text", icon:Icon, isDark }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <div style={{ marginBottom:11 }}>
//       {label && <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color: isDark ? "#94a3b8" : "#64748b", marginBottom:4, fontFamily:"'Poppins',sans-serif" }}>{label}</label>}
//       <div style={{ position:"relative" }}>
//         {Icon && <Icon size={13} style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color: focused?"#6366f1": isDark ? "#64748b" : "#94a3b8", pointerEvents:"none" }} />}
//         <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
//           onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
//           style={{ width:"100%", padding: Icon?"8px 10px 8px 28px":"8px 10px", borderRadius:8,
//             border:`1.5px solid ${focused?"#6366f1": isDark ? "#334155" : "#e2e8f0"}`, fontSize:12.5, outline:"none",
//             background: isDark ? "#0f172a" : "#fff", color: isDark ? "#f1f5f9" : "#1e293b",
//             boxSizing:"border-box", transition:"border-color .15s",
//             fontFamily:"'Poppins',sans-serif" }} />
//       </div>
//     </div>
//   );
// }

// function Txt({ label, value, onChange, rows=3, placeholder, isDark }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <div style={{ marginBottom:11 }}>
//       {label && <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color: isDark ? "#94a3b8" : "#64748b", marginBottom:4, fontFamily:"'Poppins',sans-serif" }}>{label}</label>}
//       <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
//         onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
//         style={{ width:"100%", padding:"8px 10px", borderRadius:8,
//           border:`1.5px solid ${focused?"#6366f1": isDark ? "#334155" : "#e2e8f0"}`,
//           fontSize:12.5, outline:"none",
//           background: isDark ? "#0f172a" : "#fff",
//           color: isDark ? "#f1f5f9" : "#1e293b",
//           resize:"vertical", boxSizing:"border-box", fontFamily:"'Poppins',sans-serif", transition:"border-color .15s" }} />
//     </div>
//   );
// }

// function Card({ title, icon:Icon, children, onAdd, addLabel, isDark }) {
//   const [open, setOpen] = useState(true);
//   return (
//     <div style={{ background: isDark ? "#1e293b" : "#fff", borderRadius:13, border:`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`, marginBottom:12, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
//       <div onClick={()=>setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 15px", cursor:"pointer", background: open ? (isDark ? "#0f172a" : "#f8fafc") : (isDark ? "#1e293b" : "#fff") }}>
//         <div style={{ display:"flex", alignItems:"center", gap:7 }}>
//           {Icon && <Icon size={14} color="#6366f1" />}
//           <span style={{ fontWeight:700, fontSize:13, color: isDark ? "#f1f5f9" : "#1e293b", fontFamily:"'Poppins',sans-serif" }}>{title}</span>
//         </div>
//         <div style={{ display:"flex", gap:7, alignItems:"center" }}>
//           {onAdd && open && (
//             <button onClick={e=>{e.stopPropagation();onAdd();}}
//               style={{ display:"flex",alignItems:"center",gap:3, fontSize:11,fontWeight:700,padding:"4px 9px",borderRadius:6,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>
//               <Plus size={10}/> {addLabel||"Add"}
//             </button>
//           )}
//           {open ? <ChevronUp size={14} color={isDark ? "#64748b" : "#94a3b8"}/> : <ChevronDown size={14} color={isDark ? "#64748b" : "#94a3b8"}/>}
//         </div>
//       </div>
//       {open && <div style={{ padding:"13px 15px" }}>{children}</div>}
//     </div>
//   );
// }

// function Tag({ label, onRemove }) {
//   return (
//     <span style={{ display:"inline-flex",alignItems:"center",gap:3,padding:"4px 9px",borderRadius:20,background:"#ede9fe",color:"#6366f1",fontSize:11.5,fontWeight:600,margin:"3px",fontFamily:"'Poppins',sans-serif" }}>
//       {label}{onRemove && <X size={10} onClick={onRemove} style={{ cursor:"pointer",opacity:.6 }}/>}
//     </span>
//   );
// }

// function Btn({ children, onClick, variant="primary", size="md", icon:Icon, disabled, loading, style:extra }) {
//   const V = {
//     primary:{bg:"#6366f1",color:"#fff",border:"none"},
//     secondary:{bg:"#f1f5f9",color:"#64748b",border:"none"},
//     danger:{bg:"#fee2e2",color:"#ef4444",border:"none"},
//     ghost:{bg:"transparent",color:"#6366f1",border:"1.5px solid #6366f1"},
//     success:{bg:"#dcfce7",color:"#16a34a",border:"none"},
//     dark:{bg:"#1e293b",color:"#fff",border:"none"},
//     warning:{bg:"#fffbeb",color:"#d97706",border:"none"},
//     purple:{bg:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none"},
//   };
//   const SZ = { sm:"5px 11px", md:"9px 17px", lg:"11px 22px" };
//   const v = V[variant]||V.primary;
//   return (
//     <button onClick={onClick} disabled={disabled||loading}
//       style={{ display:"inline-flex",alignItems:"center",gap:5,padding:SZ[size],borderRadius:8,
//         border:v.border||"none",cursor:disabled||loading?"not-allowed":"pointer",
//         fontWeight:700,fontSize:size==="lg"?13:11.5,
//         background:disabled?"#e2e8f0":v.bg, color:disabled?"#94a3b8":v.color,
//         opacity:loading?.7:1, transition:"all .15s", fontFamily:"'Poppins',sans-serif", ...extra }}>
//       {loading ? <RefreshCw size={12} style={{ animation:"spin 1s linear infinite" }}/> : Icon ? <Icon size={12}/> : null}
//       {children}
//     </button>
//   );
// }

// function ExperienceLevelPicker({ selected, onSelect, isDark }) {
//   return (
//     <div style={{ background: isDark ? "#1e293b" : "#fff", borderRadius:16, border:`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`, padding:20, marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
//       <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
//         <div style={{ width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center" }}>
//           <UserCheck size={15} color="#fff"/>
//         </div>
//         <div>
//           <div style={{ fontWeight:700,fontSize:13.5,color: isDark ? "#f1f5f9" : "#1e293b",fontFamily:"'Poppins',sans-serif" }}>Experience Level</div>
//           <div style={{ fontSize:11,color: isDark ? "#94a3b8" : "#64748b",fontFamily:"'Poppins',sans-serif" }}>Resume will be tailored to your level</div>
//         </div>
//       </div>
//       <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
//         {EXPERIENCE_LEVELS.map(lvl => {
//           const active = selected?.id === lvl.id;
//           return (
//             <div key={lvl.id} onClick={()=>onSelect(lvl)}
//               style={{ padding:"11px 13px",borderRadius:11,border:`2px solid ${active?lvl.color: isDark ? "#334155" : "#e2e8f0"}`,
//                 background: active ? lvl.bg : (isDark ? "#0f172a" : "#f8fafc"),cursor:"pointer",transition:"all .2s",
//                 boxShadow:active?`0 0 0 3px ${lvl.color}22`:"none" }}>
//               <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:4 }}>
//                 <lvl.icon size={14} color={lvl.color}/>
//                 <span style={{ fontWeight:700,fontSize:11.5,color:active?lvl.color: isDark ? "#cbd5e1" : "#374151",fontFamily:"'Poppins',sans-serif" }}>{lvl.label}</span>
//               </div>
//               <p style={{ fontSize:10.5,color: isDark ? "#64748b" : "#6b7280",margin:0,lineHeight:1.5,fontFamily:"'Poppins',sans-serif" }}>{lvl.desc}</p>
//             </div>
//           );
//         })}
//       </div>
//       {selected && (
//         <div style={{ marginTop:12,padding:"10px 13px",borderRadius:10,background:selected.bg,border:`1.5px solid ${selected.color}33` }}>
//           <div style={{ fontWeight:700,fontSize:11,color:selected.color,marginBottom:5,fontFamily:"'Poppins',sans-serif" }}>💡 Tips for {selected.label}</div>
//           {selected.tips.map((tip,i)=>(
//             <div key={i} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
//               <Check size={11} color={selected.color}/>
//               <span style={{ fontSize:11,color:"#374151",fontFamily:"'Poppins',sans-serif" }}>{tip}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function Gauge({ score, size=130 }) {
//   const r = size/2 - 11;
//   const circ = 2*Math.PI*r;
//   const dash = (score/100)*circ;
//   const col = score>=80?"#22c55e":score>=60?"#f59e0b":"#ef4444";
//   const grade = score>=90?"A+":score>=80?"A":score>=70?"B":score>=60?"C":score>=50?"D":"F";
//   return (
//     <div style={{ position:"relative",width:size,height:size,flexShrink:0 }}>
//       <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
//         <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={11}/>
//         <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={11}
//           strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
//           style={{ transition:"stroke-dasharray 1.2s ease" }}/>
//       </svg>
//       <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
//         <div style={{ fontSize:size/3.8,fontWeight:900,color:col,lineHeight:1,fontFamily:"'Poppins',sans-serif" }}>{score}</div>
//         <div style={{ fontSize:size/7,fontWeight:700,color:"#94a3b8",marginTop:1,fontFamily:"'Poppins',sans-serif" }}>Grade {grade}</div>
//       </div>
//     </div>
//   );
// }

// // ─── Resume Templates ─────────────────────────────────────────────────────────
// function ResumePreview({ data, theme }) {
//   const t = THEMES[theme] || THEMES.modern;
//   if (theme === "minimal") return <MinimalTemplate data={data} t={t}/>;
//   if (theme === "dark")    return <DarkTemplate    data={data} t={t}/>;
//   if (theme === "ocean")   return <OceanTemplate   data={data} t={t}/>;
//   return <ModernTemplate data={data} t={t}/>;
// }

// function ModernTemplate({ data, t }) {
//   const pill = { display:"inline-block",padding:"2px 9px",borderRadius:20,background:"#ede9fe",color:"#6366f1",fontSize:10.5,fontWeight:600,margin:"2px 3px",fontFamily:"'Poppins',sans-serif" };
//   return (
//     <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",minHeight:"100%" }}>
//       <div style={{ background:t.headerBg,padding:"32px 36px 28px",color:"#fff" }}>
//         <h1 style={{ fontSize:t.nameFontSize,fontWeight:800,margin:"0 0 3px",letterSpacing:"-.02em",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
//         <p style={{ fontSize:13.5,fontWeight:500,margin:"0 0 14px",opacity:.85,fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
//         <div style={{ fontSize:10.5,display:"flex",flexWrap:"wrap",gap:"5px 16px",opacity:.8 }}>
//           {data.personal.email    && <span>✉ {data.personal.email}</span>}
//           {data.personal.phone    && <span>☎ {data.personal.phone}</span>}
//           {data.personal.location && <span>⌖ {data.personal.location}</span>}
//           {data.personal.github   && <span>⌥ github.com/{data.personal.github}</span>}
//           {data.personal.linkedin && <span>in linkedin/{data.personal.linkedin}</span>}
//           {data.personal.website  && <span>⊕ {data.personal.website}</span>}
//         </div>
//       </div>
//       <div style={{ padding:"26px 36px" }}>
//         {data.personal.summary && (
//           <div style={{ marginBottom:22 }}>
//             <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8 }}>Summary</div>
//             <p style={{ fontSize:11.5,color:"#475569",margin:0,lineHeight:1.75 }}>{data.personal.summary}</p>
//           </div>
//         )}
//         {data.experience.length>0 && (
//           <div style={{ marginBottom:22 }}>
//             <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:10,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Work Experience</div>
//             {data.experience.map(e=>(
//               <div key={e.id} style={{ marginBottom:14 }}>
//                 <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline" }}>
//                   <span style={{ fontWeight:700,fontSize:13,color:t.text }}>{e.role}</span>
//                   <span style={{ fontSize:10,color:"#94a3b8",fontWeight:500 }}>{e.duration}</span>
//                 </div>
//                 <div style={{ fontSize:10.5,color:"#6366f1",marginBottom:5,fontWeight:600 }}>{e.company}{e.location&&` · ${e.location}`}</div>
//                 {e.bullets.filter(Boolean).map((b,i)=>(
//                   <div key={i} style={{ fontSize:11.5,color:"#475569",marginBottom:3,paddingLeft:14,position:"relative" }}>
//                     <span style={{ position:"absolute",left:0,color:"#6366f1",fontWeight:900 }}>›</span>{b}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//         <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:22 }}>
//           <div>
//             {data.education.length>0 && (
//               <div style={{ marginBottom:18 }}>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Education</div>
//                 {data.education.map(e=>(
//                   <div key={e.id} style={{ marginBottom:9 }}>
//                     <div style={{ fontWeight:700,fontSize:12,color:t.text }}>{e.institution}</div>
//                     <div style={{ fontSize:10.5,color:"#64748b" }}>{e.degree}{e.gpa&&` · GPA ${e.gpa}`}</div>
//                     <div style={{ fontSize:10,color:"#94a3b8" }}>{e.duration}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             {data.certifications?.length>0 && (
//               <div>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Certifications</div>
//                 {data.certifications.map(c=>(
//                   <div key={c.id} style={{ marginBottom:5 }}>
//                     <div style={{ fontWeight:600,fontSize:11.5,color:t.text }}>{c.name}</div>
//                     <div style={{ fontSize:10.5,color:"#94a3b8" }}>{c.issuer} · {c.year}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div>
//             {data.skills.length>0 && (
//               <div style={{ marginBottom:18 }}>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:8,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Skills</div>
//                 <div>{data.skills.map(s=><span key={s} style={pill}>{s}</span>)}</div>
//               </div>
//             )}
//           </div>
//         </div>
//         {data.projects.length>0 && (
//           <div>
//             <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#6366f1",marginBottom:10,borderBottom:"2px solid #6366f1",paddingBottom:5 }}>Projects</div>
//             {data.projects.map(p=>(
//               <div key={p.id} style={{ marginBottom:10 }}>
//                 <div style={{ display:"flex",gap:9,alignItems:"baseline" }}>
//                   <span style={{ fontWeight:700,fontSize:12.5,color:t.text }}>{p.name}</span>
//                   {p.github&&<span style={{ fontSize:10,color:"#6366f1" }}>github.com/{p.github}</span>}
//                   {p.live&&<span style={{ fontSize:10,color:"#6366f1" }}>{p.live}</span>}
//                 </div>
//                 <p style={{ fontSize:11,color:"#64748b",margin:"2px 0 3px" }}>{p.description}</p>
//                 <div>{p.tech?.map(t=><span key={t} style={{ ...pill,background:"#f1f5f9",color:"#64748b" }}>{t}</span>)}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function DarkTemplate({ data, t }) {
//   const pill = { display:"inline-block",padding:"2px 9px",borderRadius:5,background:"#1e293b",color:"#22d3ee",fontSize:10.5,fontWeight:600,margin:"2px 3px",fontFamily:"'Poppins',sans-serif",border:"1px solid #334155" };
//   const secTitle = { fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#22d3ee",marginBottom:8,paddingBottom:5,borderBottom:"1px solid #1e293b",fontFamily:"'Poppins',sans-serif" };
//   return (
//     <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",minHeight:"100%",display:"grid",gridTemplateColumns:"220px 1fr" }}>
//       <div style={{ background:"#020617",padding:"32px 20px",borderRight:"1px solid #1e293b" }}>
//         <div style={{ width:62,height:62,borderRadius:14,background:"linear-gradient(135deg,#22d3ee,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff",marginBottom:16 }}>
//           {data.personal.name.charAt(0)}
//         </div>
//         <h2 style={{ fontSize:16,fontWeight:800,color:"#f1f5f9",margin:"0 0 2px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h2>
//         <p style={{ fontSize:10.5,color:"#22d3ee",fontWeight:600,margin:"0 0 20px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
//         <div style={{ marginBottom:20 }}>
//           {[
//             data.personal.email&&{icon:"✉",val:data.personal.email},
//             data.personal.phone&&{icon:"☎",val:data.personal.phone},
//             data.personal.location&&{icon:"⌖",val:data.personal.location},
//             data.personal.github&&{icon:"⌥",val:data.personal.github},
//             data.personal.linkedin&&{icon:"in",val:data.personal.linkedin},
//             data.personal.website&&{icon:"⊕",val:data.personal.website},
//           ].filter(Boolean).map((c,i)=>(
//             <div key={i} style={{ fontSize:10,color:"#94a3b8",marginBottom:5,display:"flex",gap:6,alignItems:"flex-start",fontFamily:"'Poppins',sans-serif" }}>
//               <span style={{ color:"#22d3ee",flexShrink:0 }}>{c.icon}</span>{c.val}
//             </div>
//           ))}
//         </div>
//         {data.skills.length>0 && (
//           <div style={{ marginBottom:18 }}>
//             <div style={secTitle}>Skills</div>
//             <div>{data.skills.map(s=><span key={s} style={pill}>{s}</span>)}</div>
//           </div>
//         )}
//         {data.education.length>0 && (
//           <div>
//             <div style={secTitle}>Education</div>
//             {data.education.map(e=>(
//               <div key={e.id} style={{ marginBottom:9 }}>
//                 <div style={{ fontWeight:700,fontSize:11,color:"#f1f5f9",fontFamily:"'Poppins',sans-serif" }}>{e.institution}</div>
//                 <div style={{ fontSize:10,color:"#64748b",fontFamily:"'Poppins',sans-serif" }}>{e.degree}</div>
//                 <div style={{ fontSize:9.5,color:"#475569",fontFamily:"'Poppins',sans-serif" }}>{e.duration}{e.gpa&&` · ${e.gpa}`}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <div style={{ padding:"32px 28px" }}>
//         {data.personal.summary && (
//           <div style={{ marginBottom:22,padding:"14px 16px",background:"#1e293b",borderRadius:10,borderLeft:"3px solid #22d3ee" }}>
//             <p style={{ fontSize:11.5,color:"#94a3b8",margin:0,lineHeight:1.75,fontFamily:"'Poppins',sans-serif" }}>{data.personal.summary}</p>
//           </div>
//         )}
//         {data.experience.length>0 && (
//           <div style={{ marginBottom:22 }}>
//             <div style={secTitle}>Work Experience</div>
//             {data.experience.map(e=>(
//               <div key={e.id} style={{ marginBottom:14,paddingLeft:12,borderLeft:"2px solid #1e293b" }}>
//                 <div style={{ display:"flex",justifyContent:"space-between" }}>
//                   <span style={{ fontWeight:700,fontSize:12.5,color:"#f1f5f9",fontFamily:"'Poppins',sans-serif" }}>{e.role}</span>
//                   <span style={{ fontSize:10,color:"#475569",fontFamily:"'Poppins',sans-serif" }}>{e.duration}</span>
//                 </div>
//                 <div style={{ fontSize:10.5,color:"#22d3ee",marginBottom:5,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{e.company}{e.location&&` · ${e.location}`}</div>
//                 {e.bullets.filter(Boolean).map((b,i)=>(
//                   <div key={i} style={{ fontSize:11,color:"#94a3b8",marginBottom:3,paddingLeft:12,position:"relative",fontFamily:"'Poppins',sans-serif" }}>
//                     <span style={{ position:"absolute",left:0,color:"#22d3ee" }}>›</span>{b}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//         {data.projects.length>0 && (
//           <div style={{ marginBottom:22 }}>
//             <div style={secTitle}>Projects</div>
//             <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
//               {data.projects.map(p=>(
//                 <div key={p.id} style={{ padding:"11px 13px",background:"#1e293b",borderRadius:9,border:"1px solid #334155" }}>
//                   <div style={{ fontWeight:700,fontSize:12,color:"#f1f5f9",marginBottom:3,fontFamily:"'Poppins',sans-serif" }}>{p.name}</div>
//                   <p style={{ fontSize:10.5,color:"#64748b",margin:"0 0 6px",fontFamily:"'Poppins',sans-serif" }}>{p.description}</p>
//                   <div>{p.tech?.map(t=><span key={t} style={pill}>{t}</span>)}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         {data.certifications?.length>0 && (
//           <div>
//             <div style={secTitle}>Certifications</div>
//             {data.certifications.map(c=>(
//               <div key={c.id} style={{ display:"flex",justifyContent:"space-between",padding:"7px 10px",background:"#1e293b",borderRadius:7,marginBottom:5 }}>
//                 <span style={{ fontSize:11.5,fontWeight:600,color:"#f1f5f9",fontFamily:"'Poppins',sans-serif" }}>{c.name}</span>
//                 <span style={{ fontSize:10.5,color:"#475569",fontFamily:"'Poppins',sans-serif" }}>{c.issuer} · {c.year}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function MinimalTemplate({ data, t }) {
//   return (
//     <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",padding:"44px 52px",minHeight:"100%" }}>
//       <div style={{ borderBottom:"3px solid #111827",paddingBottom:20,marginBottom:24 }}>
//         <h1 style={{ fontSize:t.nameFontSize,fontWeight:800,margin:0,color:"#111827",letterSpacing:"-.03em",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
//         <p style={{ fontSize:13,fontWeight:500,color:"#6b7280",margin:"4px 0 12px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
//         <div style={{ fontSize:10.5,color:"#9ca3af",display:"flex",flexWrap:"wrap",gap:"4px 16px" }}>
//           {data.personal.email    && <span>{data.personal.email}</span>}
//           {data.personal.phone    && <span>{data.personal.phone}</span>}
//           {data.personal.location && <span>{data.personal.location}</span>}
//           {data.personal.github   && <span>github/{data.personal.github}</span>}
//           {data.personal.linkedin && <span>linkedin/{data.personal.linkedin}</span>}
//           {data.personal.website  && <span>{data.personal.website}</span>}
//         </div>
//       </div>
//       {data.personal.summary && (
//         <div style={{ marginBottom:24 }}>
//           <p style={{ fontSize:12,color:"#6b7280",margin:0,lineHeight:1.8 }}>{data.personal.summary}</p>
//         </div>
//       )}
//       {data.experience.length>0 && (
//         <div style={{ marginBottom:24 }}>
//           <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:12,fontFamily:"'Poppins',sans-serif" }}>Experience</div>
//           {data.experience.map(e=>(
//             <div key={e.id} style={{ marginBottom:16,display:"grid",gridTemplateColumns:"140px 1fr",gap:"0 20px" }}>
//               <div style={{ paddingTop:2 }}>
//                 <div style={{ fontSize:10,color:"#9ca3af",fontWeight:500 }}>{e.duration}</div>
//                 <div style={{ fontSize:10.5,color:"#374151",fontWeight:600,marginTop:2 }}>{e.company}</div>
//               </div>
//               <div>
//                 <div style={{ fontWeight:700,fontSize:12.5,color:"#111827" }}>{e.role}</div>
//                 {e.bullets.filter(Boolean).map((b,i)=>(
//                   <div key={i} style={{ fontSize:11.5,color:"#6b7280",marginTop:3 }}>— {b}</div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px",marginBottom:20 }}>
//         {data.education.length>0 && (
//           <div>
//             <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10 }}>Education</div>
//             {data.education.map(e=>(
//               <div key={e.id} style={{ marginBottom:10 }}>
//                 <div style={{ fontWeight:700,fontSize:12,color:"#111827" }}>{e.institution}</div>
//                 <div style={{ fontSize:10.5,color:"#6b7280" }}>{e.degree}</div>
//                 <div style={{ fontSize:10,color:"#9ca3af" }}>{e.duration}{e.gpa&&` · GPA ${e.gpa}`}</div>
//               </div>
//             ))}
//           </div>
//         )}
//         {data.skills.length>0 && (
//           <div>
//             <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10 }}>Skills</div>
//             <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
//               {data.skills.map(s=>(
//                 <span key={s} style={{ fontSize:10.5,fontWeight:500,padding:"3px 9px",borderRadius:3,background:"#f3f4f6",color:"#374151",border:"1px solid #e5e7eb" }}>{s}</span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       {data.projects.length>0 && (
//         <div>
//           <div style={{ fontSize:9,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#9ca3af",marginBottom:12 }}>Projects</div>
//           {data.projects.map(p=>(
//             <div key={p.id} style={{ marginBottom:10 }}>
//               <span style={{ fontWeight:700,fontSize:12,color:"#111827" }}>{p.name}</span>
//               {(p.github||p.live) && <span style={{ fontSize:10,color:"#9ca3af",marginLeft:9 }}>{p.github&&`github/${p.github}`}{p.github&&p.live&&" · "}{p.live}</span>}
//               <p style={{ fontSize:11,color:"#6b7280",margin:"2px 0" }}>{p.description}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function OceanTemplate({ data, t }) {
//   const pill = { display:"inline-block",padding:"2px 9px",borderRadius:20,background:"#e0f2fe",color:"#0369a1",fontSize:10.5,fontWeight:600,margin:"2px 3px",fontFamily:"'Poppins',sans-serif" };
//   return (
//     <div style={{ background:t.bg,color:t.text,fontFamily:"'Poppins',sans-serif",minHeight:"100%" }}>
//       <div style={{ background:t.headerBg,padding:"32px 36px 28px",color:"#fff",position:"relative",overflow:"hidden" }}>
//         <div style={{ position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.08)" }}/>
//         <div style={{ position:"absolute",bottom:-60,right:80,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,.05)" }}/>
//         <div style={{ position:"relative",zIndex:1,display:"flex",alignItems:"flex-end",justifyContent:"space-between" }}>
//           <div>
//             <h1 style={{ fontSize:t.nameFontSize,fontWeight:800,margin:"0 0 3px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
//             <p style={{ fontSize:13,fontWeight:500,margin:"0 0 12px",opacity:.85,fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
//             <div style={{ fontSize:10.5,display:"flex",flexWrap:"wrap",gap:"4px 14px",opacity:.8 }}>
//               {data.personal.email    && <span>✉ {data.personal.email}</span>}
//               {data.personal.phone    && <span>☎ {data.personal.phone}</span>}
//               {data.personal.location && <span>⌖ {data.personal.location}</span>}
//               {data.personal.github   && <span>⌥ {data.personal.github}</span>}
//               {data.personal.website  && <span>⊕ {data.personal.website}</span>}
//             </div>
//           </div>
//           <div style={{ width:62,height:62,borderRadius:16,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:900,color:"#fff",border:"2px solid rgba(255,255,255,.4)" }}>
//             {data.personal.name.charAt(0)}
//           </div>
//         </div>
//       </div>
//       <div style={{ padding:"24px 36px" }}>
//         {data.personal.summary && (
//           <div style={{ marginBottom:20,padding:"12px 16px",background:"#e0f2fe",borderRadius:10,borderLeft:"4px solid #0891b2" }}>
//             <p style={{ fontSize:11.5,color:"#0369a1",margin:0,lineHeight:1.75,fontFamily:"'Poppins',sans-serif" }}>{data.personal.summary}</p>
//           </div>
//         )}
//         <div style={{ display:"grid",gridTemplateColumns:"1fr 260px",gap:24 }}>
//           <div>
//             {data.experience.length>0 && (
//               <div style={{ marginBottom:22 }}>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:10,display:"flex",alignItems:"center",gap:7 }}>
//                   <div style={{ height:2,flex:1,background:"linear-gradient(to right,#0891b2,transparent)" }}/> Experience
//                 </div>
//                 {data.experience.map(e=>(
//                   <div key={e.id} style={{ marginBottom:14,padding:"11px 14px",background:"#fff",borderRadius:10,border:"1.5px solid #bae6fd" }}>
//                     <div style={{ display:"flex",justifyContent:"space-between" }}>
//                       <span style={{ fontWeight:700,fontSize:12.5,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{e.role}</span>
//                       <span style={{ fontSize:10,color:"#94a3b8" }}>{e.duration}</span>
//                     </div>
//                     <div style={{ fontSize:10.5,color:"#0891b2",marginBottom:5,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{e.company}{e.location&&` · ${e.location}`}</div>
//                     {e.bullets.filter(Boolean).map((b,i)=>(
//                       <div key={i} style={{ fontSize:11,color:"#475569",marginBottom:3,paddingLeft:12,position:"relative",fontFamily:"'Poppins',sans-serif" }}>
//                         <span style={{ position:"absolute",left:0,color:"#0891b2" }}>›</span>{b}
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             )}
//             {data.projects.length>0 && (
//               <div>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:10,display:"flex",alignItems:"center",gap:7 }}>
//                   <div style={{ height:2,flex:1,background:"linear-gradient(to right,#0891b2,transparent)" }}/> Projects
//                 </div>
//                 {data.projects.map(p=>(
//                   <div key={p.id} style={{ marginBottom:10,padding:"11px 14px",background:"#fff",borderRadius:10,border:"1.5px solid #bae6fd" }}>
//                     <div style={{ fontWeight:700,fontSize:12,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{p.name}{p.live&&<span style={{ fontSize:10,color:"#0891b2",marginLeft:9 }}>{p.live}</span>}</div>
//                     <p style={{ fontSize:11,color:"#64748b",margin:"3px 0 5px",fontFamily:"'Poppins',sans-serif" }}>{p.description}</p>
//                     <div>{p.tech?.map(t=><span key={t} style={pill}>{t}</span>)}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div>
//             {data.skills.length>0 && (
//               <div style={{ marginBottom:18,padding:"14px",background:"#fff",borderRadius:12,border:"1.5px solid #bae6fd" }}>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:9,fontFamily:"'Poppins',sans-serif" }}>Skills</div>
//                 <div>{data.skills.map(s=><span key={s} style={pill}>{s}</span>)}</div>
//               </div>
//             )}
//             {data.education.length>0 && (
//               <div style={{ marginBottom:18,padding:"14px",background:"#fff",borderRadius:12,border:"1.5px solid #bae6fd" }}>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:9,fontFamily:"'Poppins',sans-serif" }}>Education</div>
//                 {data.education.map(e=>(
//                   <div key={e.id} style={{ marginBottom:7 }}>
//                     <div style={{ fontWeight:700,fontSize:11.5,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{e.institution}</div>
//                     <div style={{ fontSize:10.5,color:"#0369a1",fontFamily:"'Poppins',sans-serif" }}>{e.degree}</div>
//                     <div style={{ fontSize:10,color:"#94a3b8",fontFamily:"'Poppins',sans-serif" }}>{e.duration}{e.gpa&&` · GPA ${e.gpa}`}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             {data.certifications?.length>0 && (
//               <div style={{ padding:"14px",background:"#fff",borderRadius:12,border:"1.5px solid #bae6fd" }}>
//                 <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0891b2",marginBottom:9,fontFamily:"'Poppins',sans-serif" }}>Certifications</div>
//                 {data.certifications.map(c=>(
//                   <div key={c.id} style={{ marginBottom:6 }}>
//                     <div style={{ fontWeight:600,fontSize:11.5,color:"#0c4a6e",fontFamily:"'Poppins',sans-serif" }}>{c.name}</div>
//                     <div style={{ fontSize:10.5,color:"#94a3b8",fontFamily:"'Poppins',sans-serif" }}>{c.issuer} · {c.year}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── ATS Results ──────────────────────────────────────────────────────────────
// function ATSResults({ result, onUpdateResume, isDark }) {
//   const [editIdx, setEditIdx] = useState(null);
//   const [editVal, setEditVal] = useState("");
//   const sevBg  = { high: isDark?"#450a0a":"#fef2f2", medium: isDark?"#431407":"#fffbeb", low: isDark?"#052e16":"#f0fdf4" };
//   const sevBdr = { high: isDark?"#7f1d1d":"#fca5a5", medium: isDark?"#78350f":"#fcd34d", low: isDark?"#14532d":"#86efac" };
//   const sevCol = { high:"#ef4444", medium:"#f59e0b", low:"#22c55e" };
//   return (
//     <div>
//       <div style={{ display:"grid",gridTemplateColumns:"auto 1fr",gap:28,background: isDark?"#1e293b":"#fff",borderRadius:16,border:`1.5px solid ${isDark?"#334155":"#e2e8f0"}`,padding:24,marginBottom:18,alignItems:"start" }}>
//         <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
//           <Gauge score={result.score}/>
//           <div style={{ fontSize:12,fontWeight:700,color: isDark?"#94a3b8":"#64748b",fontFamily:"'Poppins',sans-serif" }}>ATS Score</div>
//         </div>
//         <div>
//           <h3 style={{ margin:"0 0 14px",fontSize:15,fontWeight:800,color: isDark?"#f1f5f9":"#1e293b",fontFamily:"'Poppins',sans-serif" }}>Category Breakdown</h3>
//           {Object.entries(result.categories||{}).map(([key,val])=>(
//             <div key={key} style={{ marginBottom:9 }}>
//               <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
//                 <span style={{ fontSize:12,fontWeight:600,color: isDark?"#94a3b8":"#64748b",textTransform:"capitalize",fontFamily:"'Poppins',sans-serif" }}>{key}</span>
//                 <span style={{ fontSize:12,fontWeight:700,color: isDark?"#f1f5f9":"#1e293b",fontFamily:"'Poppins',sans-serif" }}>{val.score}%</span>
//               </div>
//               <div style={{ height:7,background: isDark?"#0f172a":"#f1f5f9",borderRadius:4,overflow:"hidden",marginBottom:2 }}>
//                 <div style={{ height:"100%",width:`${val.score}%`,borderRadius:4,transition:"width 1.2s ease",background: val.score>=80?"#22c55e":val.score>=60?"#f59e0b":"#ef4444" }}/>
//               </div>
//               <p style={{ fontSize:11,color: isDark?"#64748b":"#94a3b8",margin:0,fontFamily:"'Poppins',sans-serif" }}>{val.feedback}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       {result.strengths?.length>0 && (
//         <div style={{ background: isDark?"#052e16":"#f0fdf4",borderRadius:12,border:`1.5px solid ${isDark?"#14532d":"#86efac"}`,padding:16,marginBottom:14 }}>
//           <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:8 }}>
//             <CheckCircle size={15} color="#16a34a"/>
//             <span style={{ fontWeight:700,fontSize:13,color: isDark?"#4ade80":"#15803d",fontFamily:"'Poppins',sans-serif" }}>Strengths</span>
//           </div>
//           {result.strengths.map((s,i)=>(
//             <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:5 }}>
//               <div style={{ width:6,height:6,borderRadius:"50%",background:"#16a34a",flexShrink:0,marginTop:5 }}/>
//               <span style={{ fontSize:12.5,color: isDark?"#86efac":"#166534",fontFamily:"'Poppins',sans-serif" }}>{s}</span>
//             </div>
//           ))}
//         </div>
//       )}
//       {result.weakAreas?.length>0 && (
//         <div>
//           <h3 style={{ fontSize:14,fontWeight:800,color: isDark?"#f1f5f9":"#1e293b",marginBottom:10,display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}>
//             <AlertTriangle size={15} color="#f59e0b"/> Areas to Improve ({result.weakAreas.length})
//           </h3>
//           {result.weakAreas.map((area,i)=>(
//             <div key={i} style={{ background:sevBg[area.severity]||( isDark?"#1e293b":"#fff"),borderRadius:12,border:`1.5px solid ${sevBdr[area.severity]||( isDark?"#334155":"#e2e8f0")}`,padding:15,marginBottom:11 }}>
//               <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7 }}>
//                 <div style={{ display:"flex",alignItems:"center",gap:8 }}>
//                   <span style={{ fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:sevCol[area.severity]||"#94a3b8",color:"#fff",textTransform:"uppercase",letterSpacing:".05em",fontFamily:"'Poppins',sans-serif" }}>{area.severity}</span>
//                   <span style={{ fontSize:13,fontWeight:700,color: isDark?"#f1f5f9":"#1e293b",fontFamily:"'Poppins',sans-serif" }}>{area.section}</span>
//                 </div>
//                 <Btn size="sm" icon={Edit2} variant="ghost" onClick={()=>{setEditIdx(i);setEditVal(area.current||area.suggestion||"");}}>Fix This</Btn>
//               </div>
//               <p style={{ fontSize:12.5,color: isDark?"#cbd5e1":"#374151",margin:"0 0 8px",fontFamily:"'Poppins',sans-serif" }}>{area.issue}</p>
//               <div style={{ background: isDark?"rgba(255,255,255,.05)":"rgba(255,255,255,.7)",borderRadius:8,padding:"9px 11px" }}>
//                 <p style={{ fontSize:10.5,fontWeight:700,color: isDark?"#64748b":"#6b7280",margin:"0 0 3px",textTransform:"uppercase",letterSpacing:".05em",fontFamily:"'Poppins',sans-serif" }}>Suggestion</p>
//                 <p style={{ fontSize:12.5,color: isDark?"#cbd5e1":"#374151",margin:0,fontFamily:"'Poppins',sans-serif" }}>{area.suggestion}</p>
//               </div>
//               {editIdx===i && (
//                 <div style={{ marginTop:10,padding:12,background: isDark?"#0f172a":"#fff",borderRadius:8,border:"1.5px solid #6366f1" }}>
//                   <p style={{ fontSize:10.5,fontWeight:700,color:"#6366f1",margin:"0 0 7px",textTransform:"uppercase",fontFamily:"'Poppins',sans-serif" }}>Edit Content</p>
//                   <textarea value={editVal} onChange={e=>setEditVal(e.target.value)} rows={3}
//                     style={{ width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${isDark?"#334155":"#e2e8f0"}`,fontSize:12.5,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"'Poppins',sans-serif",background: isDark?"#1e293b":"#fff",color: isDark?"#f1f5f9":"#1e293b" }}/>
//                   <div style={{ display:"flex",gap:7,marginTop:7,flexWrap:"wrap" }}>
//                     <Btn size="sm" icon={Sparkles} variant="warning" onClick={()=>setEditVal(area.suggestion)}>Use AI Suggestion</Btn>
//                     <Btn size="sm" icon={Check} variant="success" onClick={()=>{ onUpdateResume(area.section, editVal, area); setEditIdx(null); }}>Apply</Btn>
//                     <Btn size="sm" variant="secondary" icon={X} onClick={()=>setEditIdx(null)}>Cancel</Btn>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main App ─────────────────────────────────────────────────────────────────
// export default function ResumeBuilder() {
//   const isDark = useDarkMode();

//   const [data,   setData]   = useState(DEFAULT_DATA);
//   const [tab,    setTab]    = useState("start");
//   const [theme,  setTheme]  = useState("modern");
//   const [toast,  setToast]  = useState(null);
//   const [skillInput, setSkillInput] = useState("");
//   const [expLevel, setExpLevel] = useState(null);

//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiInfo, setAiInfo] = useState({ name:"", title:"", experience:"", skills:"" });
//   const [aiJobDesc, setAiJobDesc] = useState("");
//   const [generatedData, setGeneratedData] = useState(null);

//   const [ghUser,    setGhUser]    = useState("");
//   const [ghRepos,   setGhRepos]   = useState([]);
//   const [ghLoading, setGhLoading] = useState(false);
//   const [ghError,   setGhError]   = useState("");
//   const [ghSel,     setGhSel]     = useState([]);

//   const fileRef = useRef();
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadName,    setUploadName]    = useState("");

//   const [atsLoading, setAtsLoading] = useState(false);
//   const [atsResult,  setAtsResult]  = useState(null);
//   const [atsJobDesc, setAtsJobDesc] = useState("");

//   const flash = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
//   const setP = (k,v) => setData(d=>({...d,personal:{...d.personal,[k]:v}}));

//   const addExp = ()  => setData(d=>({...d,experience:[...d.experience,{id:Date.now(),company:"",role:"",duration:"",location:"",bullets:[""]}]}));
//   const upExp  = (id,k,v) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,[k]:v}:e)}));
//   const delExp = id  => setData(d=>({...d,experience:d.experience.filter(e=>e.id!==id)}));
//   const upBullet  = (id,i,v) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.map((b,j)=>j===i?v:b)}:e)}));
//   const addBullet = id => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:[...e.bullets,""]}:e)}));
//   const delBullet = (id,i) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.filter((_,j)=>j!==i)}:e)}));

//   const addEdu = ()      => setData(d=>({...d,education:[...d.education,{id:Date.now(),institution:"",degree:"",duration:"",gpa:""}]}));
//   const upEdu  = (id,k,v)=> setData(d=>({...d,education:d.education.map(e=>e.id===id?{...e,[k]:v}:e)}));
//   const delEdu = id      => setData(d=>({...d,education:d.education.filter(e=>e.id!==id)}));

//   const addSkill = s => { if(s&&!data.skills.includes(s)) setData(d=>({...d,skills:[...d.skills,s]})); setSkillInput(""); };
//   const delSkill = s => setData(d=>({...d,skills:d.skills.filter(x=>x!==s)}));

//   const addProj = ()      => setData(d=>({...d,projects:[...d.projects,{id:Date.now(),name:"",description:"",tech:[],github:"",live:""}]}));
//   const upProj  = (id,k,v)=> setData(d=>({...d,projects:d.projects.map(p=>p.id===id?{...p,[k]:v}:p)}));
//   const delProj = id      => setData(d=>({...d,projects:d.projects.filter(p=>p.id!==id)}));

//   const addCert = ()      => setData(d=>({...d,certifications:[...d.certifications,{id:Date.now(),name:"",issuer:"",year:""}]}));
//   const upCert  = (id,k,v)=> setData(d=>({...d,certifications:d.certifications.map(c=>c.id===id?{...c,[k]:v}:c)}));
//   const delCert = id      => setData(d=>({...d,certifications:d.certifications.filter(c=>c.id!==id)}));

//   const handleGenerate = async () => {
//     setAiLoading(true);
//     try {
//       const levelContext = expLevel ? `Experience Level: ${expLevel.label}. ${expLevel.desc}.` : "";
//       const result = await callClaudeJSON([{ role:"user", content:
//         `Generate a complete professional resume.\n${levelContext}\nName: ${aiInfo.name||"Alex Johnson"}\nTarget Role: ${aiInfo.title||"Software Engineer"}\nYears of Experience: ${aiInfo.experience||"3"}\nKey Skills: ${aiInfo.skills||"React, Node.js, Python"}\n${aiJobDesc?`\nTailor for this job:\n${aiJobDesc}`:""}\n\nReturn ONLY valid JSON:\n{"personal":{"name":"","title":"","email":"","phone":"","location":"","summary":"","github":"","linkedin":"","website":""},"experience":[{"id":1,"company":"","role":"","duration":"","location":"","bullets":[""]}],"education":[{"id":1,"institution":"","degree":"","duration":"","gpa":""}],"skills":[""],"projects":[{"id":1,"name":"","description":"","tech":[""],"github":"","live":""}],"certifications":[{"id":1,"name":"","issuer":"","year":""}]}`
//       }], "You are an expert resume writer. Return only valid JSON, no markdown.");
//       const fixed = {
//         ...result,
//         experience:    (result.experience||[]).map((e,i)=>({...e,id:Date.now()+i})),
//         education:     (result.education||[]).map((e,i)=>({...e,id:Date.now()+i+100})),
//         projects:      (result.projects||[]).map((p,i)=>({...p,id:Date.now()+i+200})),
//         certifications:(result.certifications||[]).map((c,i)=>({...c,id:Date.now()+i+300})),
//         skills: result.skills||[],
//       };
//       setGeneratedData(fixed);
//       flash("Resume generated!");
//     } catch(e) { flash("Generation failed: "+e.message,"error"); }
//     setAiLoading(false);
//   };

//   const handleFetchGH = async () => {
//     if(!ghUser) return;
//     setGhLoading(true); setGhError(""); setGhRepos([]); setGhSel([]);
//     try {
//       const repos = await fetchGitHubRepos(ghUser);
//       setGhRepos(repos);
//       if(!repos.length) setGhError("No public repos found.");
//     } catch(e) { setGhError(e.message); }
//     setGhLoading(false);
//   };

//   const handleImportGH = () => {
//     const projs = ghRepos.filter(r=>ghSel.includes(r.id)).map(r=>({
//       id:Date.now()+r.id, name:r.name, description:r.description||"",
//       tech: r.language?[r.language]:[], github:`${ghUser}/${r.name}`, live:r.homepage||"",
//     }));
//     setData(d=>({...d,projects:[...d.projects,...projs]}));
//     setGhSel([]); flash(`Imported ${projs.length} projects!`); setTab("builder");
//   };

//   const handleUpload = async file => {
//     if(!file) return;
//     setUploadLoading(true); setUploadName(file.name);
//     try {
//       let content;
//       if(file.type==="application/pdf") {
//         const b64 = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
//         content = [
//           { type:"document", source:{type:"base64",media_type:"application/pdf",data:b64} },
//           { type:"text", text:'Extract all resume data from this PDF. Return ONLY valid JSON: {"personal":{"name":"","title":"","email":"","phone":"","location":"","summary":"","github":"","linkedin":"","website":""},"experience":[{"id":1,"company":"","role":"","duration":"","location":"","bullets":[""]}],"education":[{"id":1,"institution":"","degree":"","duration":"","gpa":""}],"skills":[""],"projects":[{"id":1,"name":"","description":"","tech":[""],"github":"","live":""}],"certifications":[{"id":1,"name":"","issuer":"","year":""}]}' },
//         ];
//       } else {
//         const text = await file.text();
//         content = `Extract resume data from this text. Return ONLY valid JSON:\n\n${text}\n\nFormat: {"personal":{"name":"","title":"","email":"","phone":"","location":"","summary":"","github":"","linkedin":"","website":""},"experience":[{"id":1,"company":"","role":"","duration":"","location":"","bullets":[""]}],"education":[{"id":1,"institution":"","degree":"","duration":"","gpa":""}],"skills":[""],"projects":[{"id":1,"name":"","description":"","tech":[""],"github":"","live":""}],"certifications":[{"id":1,"name":"","issuer":"","year":""}]}`;
//       }
//       const result = await callClaudeJSON([{role:"user",content}], "Extract resume data. Return only valid JSON.");
//       const fixed = {
//         ...DEFAULT_DATA,...result,
//         experience:    (result.experience||[]).map((e,i)=>({...e,id:Date.now()+i})),
//         education:     (result.education||[]).map((e,i)=>({...e,id:Date.now()+i+100})),
//         projects:      (result.projects||[]).map((p,i)=>({...p,id:Date.now()+i+200})),
//         certifications:(result.certifications||[]).map((c,i)=>({...c,id:Date.now()+i+300})),
//       };
//       setData(fixed); flash("Resume imported!"); setTab("builder");
//     } catch(e) { flash("Upload failed: "+e.message,"error"); }
//     setUploadLoading(false);
//   };

//   const handleATS = async () => {
//     setAtsLoading(true); setAtsResult(null);
//     try {
//       const result = await callClaudeJSON([{ role:"user", content:
//         `Analyze this resume for ATS compatibility.\n${atsJobDesc?`Target Job:\n${atsJobDesc}\n`:""}\nResume: ${JSON.stringify(data)}\nReturn ONLY valid JSON:\n{"score":0,"grade":"A","categories":{"keywords":{"score":0,"feedback":""},"formatting":{"score":0,"feedback":""},"experience":{"score":0,"feedback":""},"skills":{"score":0,"feedback":""},"education":{"score":0,"feedback":""},"summary":{"score":0,"feedback":""}},"weakAreas":[{"section":"","severity":"high","issue":"","suggestion":"","current":""}],"strengths":[],"improvements":[]}`
//       }], "You are an ATS expert. Return only valid JSON. Score 0-100.");
//       setAtsResult(result);
//     } catch(e) { flash("ATS failed: "+e.message,"error"); }
//     setAtsLoading(false);
//   };

//   const handleATSEdit = (section, value) => {
//     const sec = section.toLowerCase();
//     if(sec.includes("summary")) setP("summary", value);
//     else if(sec.includes("skill")) {
//       const newSkills = value.split(",").map(s=>s.trim()).filter(Boolean);
//       setData(d=>({...d,skills:[...new Set([...d.skills,...newSkills])]}));
//     } else if(sec.includes("experience")&&data.experience.length>0) {
//       const exp = data.experience[0];
//       setData(d=>({...d,experience:d.experience.map(e=>e.id===exp.id?{...e,bullets:[value,...e.bullets.slice(1)]}:e)}));
//     }
//     flash("Change applied! Review in Builder tab.");
//   };

//   const handleExportJSON = () => {
//     const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob); a.download="resume.json"; a.click();
//     flash("Exported!");
//   };

//   // ─── Dynamic colors based on dark mode ───────────────────────────────────
//   const C = {
//     bg:  isDark ? "#0f172a" : "#f0f4ff",
//     sur: isDark ? "#1e293b" : "#ffffff",
//     pri: "#6366f1",
//     txt: isDark ? "#f1f5f9" : "#1e1b4b",
//     sub: isDark ? "#94a3b8" : "#64748b",
//     bdr: isDark ? "#334155" : "#e2e8f0",
//   };

//   const TABS = [
//     { id:"start",    label:"Get Started", icon:Rocket },
//     { id:"builder",  label:"Builder",     icon:Edit2 },
//     { id:"ai",       label:"AI Tools",    icon:Sparkles },
//     { id:"ats",      label:"ATS Score",   icon:Target },
//     { id:"portfolio",label:"Portfolio",   icon:Layers },
//     { id:"preview",  label:"Preview",     icon:Eye },
//   ];

//   return (
//     <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Poppins',system-ui,sans-serif", color:C.txt, transition:"background .3s, color .3s" }}>
//       <link rel="preconnect" href="https://fonts.googleapis.com"/>
//       <link href={FONT_LINK} rel="stylesheet"/>
//       <style>{`
//         @import url('${FONT_LINK}');
//         @keyframes spin    { to{transform:rotate(360deg)} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
//         @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.5} }
//         @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
//         *{box-sizing:border-box}
//         body,*{font-family:'Poppins',system-ui,sans-serif!important}
//         ::-webkit-scrollbar{width:5px}
//         ::-webkit-scrollbar-track{background:${isDark?"#0f172a":"#f1f5f9"}}
//         ::-webkit-scrollbar-thumb{background:${isDark?"#334155":"#cbd5e1"};border-radius:4px}
//         @media print{body>*{display:none!important}.print-zone{display:block!important;position:fixed;top:0;left:0;width:100%}}
//         input::placeholder, textarea::placeholder { color: ${isDark?"#475569":"#94a3b8"} !important; }
//       `}</style>

//       {/* Toast */}
//       {toast && (
//         <div style={{ position:"fixed",top:18,right:18,zIndex:9999,padding:"11px 18px",borderRadius:12,
//           background:toast.type==="error"?"#ef4444":"#22c55e",color:"#fff",fontWeight:700,fontSize:13,
//           boxShadow:"0 8px 32px rgba(0,0,0,.2)",animation:"fadeUp .3s",display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}>
//           {toast.type==="error"?<AlertTriangle size={14}/>:<CheckCircle size={14}/>}
//           {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4f46e5 55%,#0891b2 100%)", padding:"0 24px", boxShadow:"0 4px 24px rgba(79,70,229,.3)" }}>
//         <div style={{ maxWidth:1440,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:62 }}>
//           <div style={{ display:"flex",alignItems:"center",gap:10 }}>
//             <div style={{ width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
//               <FileText size={17} color="#fff"/>
//             </div>
//             <div>
//               <div style={{ fontWeight:800,fontSize:16,color:"#fff",letterSpacing:"-.01em",fontFamily:"'Poppins',sans-serif" }}>ResumeAI</div>
//               <div style={{ fontSize:9.5,color:"rgba(255,255,255,.5)",fontFamily:"'Poppins',sans-serif" }}>Build · Analyze · Impress</div>
//             </div>
//           </div>
//           <div style={{ display:"flex",gap:2,background:"rgba(255,255,255,.1)",borderRadius:12,padding:3 }}>
//             {TABS.map(t=>{
//               const active = tab===t.id;
//               return (
//                 <button key={t.id} onClick={()=>setTab(t.id)}
//                   style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,
//                     background:active?"#fff":"transparent",color:active?C.pri:"rgba(255,255,255,.7)",transition:"all .2s",fontFamily:"'Poppins',sans-serif" }}>
//                   <t.icon size={11}/>{t.label}
//                 </button>
//               );
//             })}
//           </div>
//           <div style={{ display:"flex",gap:7 }}>
//             <Btn variant="ghost" icon={Download} onClick={handleExportJSON} size="sm" style={{ background:"rgba(255,255,255,.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,.25)" }}>Export</Btn>
//             <Btn icon={Printer} onClick={()=>window.print()} size="sm" style={{ background:"rgba(255,255,255,.9)",color:"#4f46e5",border:"none" }}>Print PDF</Btn>
//           </div>
//         </div>
//       </div>

//       <div style={{ maxWidth:1440,margin:"0 auto",padding:"22px 18px" }}>

//         {/* ═══════ GET STARTED ═══════ */}
//         {tab==="start" && (
//           <div style={{ maxWidth:860,margin:"0 auto" }}>
//             <div style={{ textAlign:"center",marginBottom:32 }}>
//               <div style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:20,background: isDark?"#312e81":"#ede9fe",marginBottom:14 }}>
//                 <Sparkles size={12} color="#6366f1"/>
//                 <span style={{ fontSize:11,fontWeight:700,color: isDark?"#a5b4fc":"#6366f1",fontFamily:"'Poppins',sans-serif" }}>AI-Powered Resume Builder</span>
//               </div>
//               <h1 style={{ fontSize:36,fontWeight:900,color:C.txt,margin:"0 0 10px",letterSpacing:"-.03em",fontFamily:"'Poppins',sans-serif" }}>Create Your Dream Resume</h1>
//               <p style={{ fontSize:14,color:C.sub,maxWidth:480,margin:"0 auto",lineHeight:1.7,fontFamily:"'Poppins',sans-serif" }}>Pick your experience level, choose a template, and let AI do the heavy lifting. Works for students, freshers, and senior professionals alike.</p>
//             </div>

//             <ExperienceLevelPicker selected={expLevel} isDark={isDark} onSelect={lvl=>{
//               setExpLevel(lvl);
//               setData(d=>({...d,personal:{...d.personal,summary:lvl.defaultSummary}}));
//               setAiInfo(p=>({...p,experience: lvl.id==="student"?"0":lvl.id==="junior"?"1":lvl.id==="mid"?"4":lvl.id==="senior"?"8":"12"}));
//             }}/>

//             {/* Template picker */}
//             <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:20,marginBottom:20,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
//               <div style={{ fontWeight:700,fontSize:14,color:C.txt,marginBottom:14,display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}>
//                 <LayoutTemplate size={15} color="#6366f1"/> Choose Template
//               </div>
//               <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11 }}>
//                 {Object.entries(THEMES).map(([key,t])=>(
//                   <div key={key} onClick={()=>setTheme(key)}
//                     style={{ borderRadius:12,overflow:"hidden",border:`2px solid ${theme===key?"#6366f1":C.bdr}`,cursor:"pointer",transition:"all .2s",boxShadow:theme===key?"0 0 0 3px #6366f122":"none" }}>
//                     <div style={{ background: isDark?"#1e293b":t.bg,padding:11,minHeight:80 }}>
//                       <div style={{ background:key==="dark"?"#020617":key==="ocean"?"#0c4a6e":"linear-gradient(135deg,#1e1b4b,#4f46e5)",height:18,borderRadius:4,marginBottom:6 }}/>
//                       <div style={{ display:"flex",gap:4 }}>
//                         <div style={{ background: isDark?"#334155":t.border,height:6,borderRadius:3,flex:1 }}/>
//                         <div style={{ background: isDark?"#334155":t.border,height:6,borderRadius:3,flex:2 }}/>
//                       </div>
//                       <div style={{ marginTop:5 }}>
//                         <div style={{ background: isDark?"#334155":t.border,height:5,borderRadius:3,marginBottom:3,width:"70%" }}/>
//                         <div style={{ background: isDark?"#334155":t.border,height:5,borderRadius:3,width:"50%" }}/>
//                       </div>
//                     </div>
//                     <div style={{ padding:"8px 11px",background:theme===key?"#6366f1": isDark?"#0f172a":"#f8fafc",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
//                       <span style={{ fontSize:11.5,fontWeight:700,color:theme===key?"#fff": isDark?"#cbd5e1":"#374151",fontFamily:"'Poppins',sans-serif" }}>{t.name}</span>
//                       {theme===key && <Check size={12} color="#fff"/>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Start buttons */}
//             <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13,marginBottom:20 }}>
//               {[
//                 { icon:Wand2, color:"#6366f1", bg: isDark?"#312e81":"#ede9fe", title:"AI Generate", desc:"Fill in basics, AI writes everything", action:()=>setTab("ai") },
//                 { icon:Edit2, color:"#0891b2", bg: isDark?"#0c4a6e":"#e0f2fe", title:"Build Manually", desc:"Full control, step by step", action:()=>setTab("builder") },
//                 { icon:Upload, color:"#059669", bg: isDark?"#052e16":"#dcfce7", title:"Upload Resume", desc:"Import from PDF, DOCX, or TXT", action:()=>setTab("ai") },
//               ].map(opt=>(
//                 <div key={opt.title} onClick={opt.action}
//                   style={{ background:C.sur,borderRadius:14,border:`1.5px solid ${C.bdr}`,padding:"20px 18px",cursor:"pointer",transition:"all .2s" }}
//                   onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 28px rgba(99,102,241,.12)";}}
//                   onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
//                   <div style={{ width:44,height:44,borderRadius:12,background:opt.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12 }}>
//                     <opt.icon size={20} color={opt.color}/>
//                   </div>
//                   <div style={{ fontWeight:700,fontSize:13.5,color:C.txt,marginBottom:4,fontFamily:"'Poppins',sans-serif" }}>{opt.title}</div>
//                   <div style={{ fontSize:11.5,color:C.sub,marginBottom:12,fontFamily:"'Poppins',sans-serif" }}>{opt.desc}</div>
//                   <div style={{ display:"flex",alignItems:"center",gap:5,color:opt.color,fontWeight:700,fontSize:11.5,fontFamily:"'Poppins',sans-serif" }}>
//                     Start <ChevronRight size={13}/>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ═══════ BUILDER ═══════ */}
//         {tab==="builder" && (
//           <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
//             <div style={{ overflowY:"auto",maxHeight:"calc(100vh - 120px)",paddingRight:3 }}>
//               {expLevel && (
//                 <div style={{ padding:"10px 14px",borderRadius:10,background: isDark?`${expLevel.color}22`:expLevel.bg,border:`1.5px solid ${expLevel.color}33`,marginBottom:12,display:"flex",alignItems:"center",gap:9 }}>
//                   <expLevel.icon size={15} color={expLevel.color}/>
//                   <span style={{ fontSize:12,fontWeight:600,color:expLevel.color,fontFamily:"'Poppins',sans-serif" }}>Tailored for: {expLevel.label}</span>
//                   <button onClick={()=>setTab("start")} style={{ marginLeft:"auto",fontSize:10.5,color:C.sub,background:"none",border:"none",cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>Change →</button>
//                 </div>
//               )}
//               <Card title="Personal Information" icon={User} isDark={isDark}>
//                 <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
//                   <Inp label="Full Name"    value={data.personal.name}     onChange={v=>setP("name",v)}     placeholder="Your Name"           icon={User}      isDark={isDark}/>
//                   <Inp label="Job Title"    value={data.personal.title}    onChange={v=>setP("title",v)}    placeholder="Software Developer"  icon={Briefcase} isDark={isDark}/>
//                   <Inp label="Email"        value={data.personal.email}    onChange={v=>setP("email",v)}    placeholder="you@email.com"       icon={Mail}      isDark={isDark}/>
//                   <Inp label="Phone"        value={data.personal.phone}    onChange={v=>setP("phone",v)}    placeholder="+91 9876543210"       icon={Phone}     isDark={isDark}/>
//                   <Inp label="Location"     value={data.personal.location} onChange={v=>setP("location",v)} placeholder="City, Country"       icon={MapPin}    isDark={isDark}/>
//                   <Inp label="Website"      value={data.personal.website}  onChange={v=>setP("website",v)}  placeholder="yoursite.com"        icon={Globe}     isDark={isDark}/>
//                   <Inp label="GitHub"       value={data.personal.github}   onChange={v=>setP("github",v)}   placeholder="username"            icon={Github}    isDark={isDark}/>
//                   <Inp label="LinkedIn"     value={data.personal.linkedin} onChange={v=>setP("linkedin",v)} placeholder="username"            icon={Linkedin}  isDark={isDark}/>
//                 </div>
//                 <Txt label="Summary / About" value={data.personal.summary} onChange={v=>setP("summary",v)} rows={3} placeholder="Compelling professional summary…" isDark={isDark}/>
//                 {expLevel && (
//                   <button onClick={()=>setP("summary",expLevel.defaultSummary)} style={{ fontSize:11,color:"#6366f1",background: isDark?"#312e81":"#ede9fe",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:600,marginTop:4,fontFamily:"'Poppins',sans-serif" }}>
//                     <Sparkles size={10} style={{ display:"inline",marginRight:4 }}/>Use AI suggestion for {expLevel.label}
//                   </button>
//                 )}
//               </Card>

//               <Card title="Work Experience" icon={Briefcase} onAdd={addExp} addLabel="Add Job" isDark={isDark}>
//                 {expLevel?.id==="student" && (
//                   <div style={{ padding:"8px 11px",background: isDark?"#422006":"#fef9c3",borderRadius:7,border:`1.5px solid ${isDark?"#78350f":"#fde68a"}`,marginBottom:11,fontSize:11,color: isDark?"#fcd34d":"#92400e",fontFamily:"'Poppins',sans-serif" }}>
//                     💡 Fresher tip: Add internships, college projects, or part-time work here.
//                   </div>
//                 )}
//                 {data.experience.map((exp,idx)=>(
//                   <div key={exp.id} style={{ marginBottom:16,padding:13,borderRadius:10,background: isDark?"#0f172a":"#f8fafc",border:`1.5px solid ${C.bdr}` }}>
//                     <div style={{ display:"flex",justifyContent:"space-between",marginBottom:9 }}>
//                       <span style={{ fontWeight:700,fontSize:12.5,color:"#6366f1",fontFamily:"'Poppins',sans-serif" }}>Job #{idx+1}</span>
//                       <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>delExp(exp.id)}>Remove</Btn>
//                     </div>
//                     <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
//                       <Inp label="Company"  value={exp.company}  onChange={v=>upExp(exp.id,"company",v)}  placeholder="Company Name"      icon={Building}  isDark={isDark}/>
//                       <Inp label="Role"     value={exp.role}     onChange={v=>upExp(exp.id,"role",v)}     placeholder="Software Engineer" icon={Briefcase} isDark={isDark}/>
//                       <Inp label="Duration" value={exp.duration} onChange={v=>upExp(exp.id,"duration",v)} placeholder="Jan 2023 – Present" icon={Calendar}  isDark={isDark}/>
//                       <Inp label="Location" value={exp.location} onChange={v=>upExp(exp.id,"location",v)} placeholder="Remote / City"     icon={MapPin}    isDark={isDark}/>
//                     </div>
//                     <label style={{ fontSize:10,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:C.sub,display:"block",marginBottom:5,fontFamily:"'Poppins',sans-serif" }}>
//                       {expLevel?.id==="student"?"Projects / Achievements":"Achievements (with numbers!)"}
//                     </label>
//                     {exp.bullets.map((b,i)=>(
//                       <div key={i} style={{ display:"flex",gap:5,marginBottom:5 }}>
//                         <input value={b} onChange={e=>upBullet(exp.id,i,e.target.value)} placeholder={`Achievement ${i+1} — add metrics!`}
//                           style={{ flex:1,padding:"7px 9px",borderRadius:7,border:`1.5px solid ${C.bdr}`,fontSize:12,outline:"none",background: isDark?"#1e293b":"#fff",color:C.txt,fontFamily:"'Poppins',sans-serif" }}/>
//                         <button onClick={()=>delBullet(exp.id,i)} style={{ padding:"7px 9px",borderRadius:7,border:"none",background:"#fee2e2",color:"#ef4444",cursor:"pointer" }}>
//                           <X size={11}/>
//                         </button>
//                       </div>
//                     ))}
//                     <button onClick={()=>addBullet(exp.id)} style={{ fontSize:11.5,color:"#6366f1",background:"none",border:"none",cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:4,fontFamily:"'Poppins',sans-serif" }}>
//                       <Plus size={11}/> Add achievement
//                     </button>
//                   </div>
//                 ))}
//                 {data.experience.length===0 && <p style={{ textAlign:"center",color:C.sub,fontSize:12,padding:"16px 0",fontFamily:"'Poppins',sans-serif" }}>No experience yet. Click "Add Job" above.</p>}
//               </Card>

//               <Card title="Education" icon={GraduationCap} onAdd={addEdu} addLabel="Add" isDark={isDark}>
//                 {data.education.map((edu,idx)=>(
//                   <div key={edu.id} style={{ marginBottom:13,padding:13,borderRadius:10,background: isDark?"#0f172a":"#f8fafc",border:`1.5px solid ${C.bdr}` }}>
//                     <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
//                       <span style={{ fontWeight:700,fontSize:12.5,color:"#6366f1",fontFamily:"'Poppins',sans-serif" }}>Education #{idx+1}</span>
//                       <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>delEdu(edu.id)}>Remove</Btn>
//                     </div>
//                     <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
//                       <Inp label="Institution" value={edu.institution} onChange={v=>upEdu(edu.id,"institution",v)} placeholder="University Name"       isDark={isDark}/>
//                       <Inp label="Degree"      value={edu.degree}      onChange={v=>upEdu(edu.id,"degree",v)}      placeholder="B.S. Computer Science" isDark={isDark}/>
//                       <Inp label="Duration"    value={edu.duration}    onChange={v=>upEdu(edu.id,"duration",v)}    placeholder="2020 – 2024" icon={Calendar} isDark={isDark}/>
//                       <Inp label="GPA / %"     value={edu.gpa}         onChange={v=>upEdu(edu.id,"gpa",v)}         placeholder="3.8/4.0 or 85%"        isDark={isDark}/>
//                     </div>
//                   </div>
//                 ))}
//               </Card>

//               <Card title="Skills" icon={Zap} isDark={isDark}>
//                 <div style={{ display:"flex",gap:7,marginBottom:9 }}>
//                   <input value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill(skillInput)}
//                     placeholder="Type a skill + Enter…"
//                     style={{ flex:1,padding:"8px 11px",borderRadius:8,border:`1.5px solid ${C.bdr}`,fontSize:12.5,outline:"none",background: isDark?"#0f172a":"#fff",color:C.txt,fontFamily:"'Poppins',sans-serif" }}/>
//                   <Btn icon={Plus} onClick={()=>addSkill(skillInput)}>Add</Btn>
//                 </div>
//                 <div style={{ marginBottom:9 }}>{data.skills.map(s=><Tag key={s} label={s} onRemove={()=>delSkill(s)}/>)}</div>
//                 <div>
//                   <span style={{ fontSize:11,color:C.sub,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>Suggestions: </span>
//                   {SKILLS_SUGGESTIONS.filter(s=>!data.skills.includes(s)).slice(0,9).map(s=>(
//                     <span key={s} onClick={()=>addSkill(s)} style={{ fontSize:11,color:"#6366f1",cursor:"pointer",marginRight:7,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>+{s}</span>
//                   ))}
//                 </div>
//               </Card>

//               <Card title="Projects" icon={Rocket} onAdd={addProj} addLabel="Add Project" isDark={isDark}>
//                 {expLevel?.id==="student" && (
//                   <div style={{ padding:"8px 11px",background: isDark?"#052e16":"#f0fdf4",borderRadius:7,border:`1.5px solid ${isDark?"#14532d":"#86efac"}`,marginBottom:11,fontSize:11,color: isDark?"#4ade80":"#166534",fontFamily:"'Poppins',sans-serif" }}>
//                     🚀 Fresher tip: Projects are your portfolio! Add college projects, personal apps, and open source contributions.
//                   </div>
//                 )}
//                 {data.projects.map((p,idx)=>(
//                   <div key={p.id} style={{ marginBottom:13,padding:13,borderRadius:10,background: isDark?"#0f172a":"#f8fafc",border:`1.5px solid ${C.bdr}` }}>
//                     <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
//                       <span style={{ fontWeight:700,fontSize:12.5,color:"#6366f1",fontFamily:"'Poppins',sans-serif" }}>Project #{idx+1}</span>
//                       <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>delProj(p.id)}>Remove</Btn>
//                     </div>
//                     <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 13px" }}>
//                       <Inp label="Name"       value={p.name}             onChange={v=>upProj(p.id,"name",v)}                                             placeholder="My App"    icon={Package} isDark={isDark}/>
//                       <Inp label="Live URL"   value={p.live}             onChange={v=>upProj(p.id,"live",v)}                                             placeholder="myapp.com" icon={Globe}   isDark={isDark}/>
//                       <Inp label="GitHub"     value={p.github}           onChange={v=>upProj(p.id,"github",v)}                                           placeholder="user/repo" icon={Github}  isDark={isDark}/>
//                       <Inp label="Tech Stack" value={p.tech?.join(", ")} onChange={v=>upProj(p.id,"tech",v.split(",").map(t=>t.trim()).filter(Boolean))} placeholder="React, Node.js" icon={Code} isDark={isDark}/>
//                     </div>
//                     <Txt label="Description" value={p.description} onChange={v=>upProj(p.id,"description",v)} rows={2} isDark={isDark}/>
//                   </div>
//                 ))}
//               </Card>

//               <Card title="Certifications" icon={Award} onAdd={addCert} addLabel="Add" isDark={isDark}>
//                 {data.certifications.map((c,idx)=>(
//                   <div key={c.id} style={{ display:"grid",gridTemplateColumns:"1fr 1fr 80px auto",gap:7,alignItems:"end",marginBottom:7 }}>
//                     <Inp label={idx===0?"Name":""}   value={c.name}   onChange={v=>upCert(c.id,"name",v)}   placeholder="AWS Developer" isDark={isDark}/>
//                     <Inp label={idx===0?"Issuer":""} value={c.issuer} onChange={v=>upCert(c.id,"issuer",v)} placeholder="Amazon"       isDark={isDark}/>
//                     <Inp label={idx===0?"Year":""}   value={c.year}   onChange={v=>upCert(c.id,"year",v)}   placeholder="2024"         isDark={isDark}/>
//                     <button onClick={()=>delCert(c.id)} style={{ height:36,marginBottom:11,padding:"0 11px",borderRadius:8,border:"none",background:"#fee2e2",color:"#ef4444",cursor:"pointer",display:"flex",alignItems:"center" }}>
//                       <X size={12}/>
//                     </button>
//                   </div>
//                 ))}
//               </Card>
//             </div>

//             {/* Live Preview */}
//             <div>
//               <div style={{ background:C.sur,borderRadius:15,border:`1.5px solid ${C.bdr}`,boxShadow:"0 8px 40px rgba(99,102,241,.09)",overflow:"hidden",position:"sticky",top:18 }}>
//                 <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1.5px solid ${C.bdr}`,background: isDark?"#0f172a":"#f8fafc" }}>
//                   <div style={{ display:"flex",alignItems:"center",gap:6 }}>
//                     <Eye size={13} color="#6366f1"/>
//                     <span style={{ fontWeight:700,fontSize:12.5,fontFamily:"'Poppins',sans-serif",color:C.txt }}>Live Preview</span>
//                   </div>
//                   <div style={{ display:"flex",gap:4 }}>
//                     {Object.entries(THEMES).map(([key,t])=>(
//                       <button key={key} onClick={()=>setTheme(key)}
//                         style={{ padding:"4px 9px",borderRadius:6,border:`1.5px solid ${theme===key?"#6366f1":C.bdr}`,background:theme===key?"#6366f1": isDark?"#1e293b":"#fff",color:theme===key?"#fff":C.sub,fontSize:10.5,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>
//                         {t.name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div style={{ maxHeight:"calc(100vh - 190px)",overflowY:"auto",background:THEMES[theme].bg }}>
//                   <ResumePreview data={data} theme={theme}/>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════ AI TOOLS ═══════ */}
//         {tab==="ai" && (
//           <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18 }}>
//             {/* Auto Generate */}
//             <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
//               <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:18 }}>
//                 <div style={{ width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#6366f1,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center" }}>
//                   <Wand2 size={18} color="#fff"/>
//                 </div>
//                 <div>
//                   <h3 style={{ margin:0,fontSize:14,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>AI Generate</h3>
//                   <p style={{ margin:0,fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>Claude writes your full resume</p>
//                 </div>
//               </div>
//               {expLevel && (
//                 <div style={{ marginBottom:12,padding:"8px 12px",borderRadius:9,background: isDark?`${expLevel.color}22`:expLevel.bg,border:`1.5px solid ${expLevel.color}33`,display:"flex",alignItems:"center",gap:7 }}>
//                   <expLevel.icon size={13} color={expLevel.color}/>
//                   <span style={{ fontSize:11,fontWeight:600,color:expLevel.color,fontFamily:"'Poppins',sans-serif" }}>Mode: {expLevel.label}</span>
//                 </div>
//               )}
//               <Inp label="Your Name"          value={aiInfo.name}       onChange={v=>setAiInfo(p=>({...p,name:v}))}       placeholder="Your Full Name"           icon={User}      isDark={isDark}/>
//               <Inp label="Target Role"         value={aiInfo.title}      onChange={v=>setAiInfo(p=>({...p,title:v}))}      placeholder="Senior Software Engineer" icon={Briefcase} isDark={isDark}/>
//               <Inp label="Years of Experience" value={aiInfo.experience} onChange={v=>setAiInfo(p=>({...p,experience:v}))} placeholder="3"                                         isDark={isDark}/>
//               <Inp label="Key Skills"          value={aiInfo.skills}     onChange={v=>setAiInfo(p=>({...p,skills:v}))}     placeholder="React, Node.js, Python"   icon={Zap}       isDark={isDark}/>
//               <Txt label="Job Description (optional)" value={aiJobDesc} onChange={setAiJobDesc} rows={4} placeholder="Paste job description to tailor the resume…" isDark={isDark}/>
//               <Btn icon={Sparkles} onClick={handleGenerate} loading={aiLoading} size="lg">{aiLoading?"Generating…":"Generate Resume"}</Btn>
//               {generatedData && (
//                 <div style={{ marginTop:14,padding:13,background: isDark?"#052e16":"#f0fdf4",borderRadius:10,border:`1.5px solid ${isDark?"#14532d":"#86efac"}` }}>
//                   <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:9 }}>
//                     <CheckCircle size={14} color="#16a34a"/>
//                     <span style={{ fontWeight:700,fontSize:12.5,color: isDark?"#4ade80":"#15803d",fontFamily:"'Poppins',sans-serif" }}>Generated for: {generatedData.personal?.name}</span>
//                   </div>
//                   <Btn icon={ArrowRight} variant="success" onClick={()=>{ setData(generatedData); setGeneratedData(null); setTab("builder"); flash("Resume applied!"); }}>
//                     Apply to Builder
//                   </Btn>
//                 </div>
//               )}
//             </div>

//             {/* GitHub Import */}
//             <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
//               <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:18 }}>
//                 <div style={{ width:40,height:40,borderRadius:11,background:"#1e293b",display:"flex",alignItems:"center",justifyContent:"center" }}>
//                   <Github size={18} color="#fff"/>
//                 </div>
//                 <div>
//                   <h3 style={{ margin:0,fontSize:14,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>GitHub Import</h3>
//                   <p style={{ margin:0,fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>Import your repositories</p>
//                 </div>
//               </div>
//               <div style={{ display:"flex",gap:7,marginBottom:14 }}>
//                 <input value={ghUser} onChange={e=>setGhUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleFetchGH()}
//                   placeholder="GitHub username"
//                   style={{ flex:1,padding:"8px 11px",borderRadius:8,border:`1.5px solid ${C.bdr}`,fontSize:12.5,outline:"none",background: isDark?"#0f172a":"#fff",color:C.txt,fontFamily:"'Poppins',sans-serif" }}/>
//                 <Btn icon={Search} onClick={handleFetchGH} loading={ghLoading}>Fetch</Btn>
//               </div>
//               {ghError && <p style={{ color:"#ef4444",fontSize:12.5,margin:"0 0 10px",display:"flex",alignItems:"center",gap:5,fontFamily:"'Poppins',sans-serif" }}><AlertTriangle size={13}/>{ghError}</p>}
//               {ghRepos.length>0 && (
//                 <>
//                   <div style={{ maxHeight:300,overflowY:"auto",borderRadius:10,border:`1.5px solid ${C.bdr}` }}>
//                     {ghRepos.map(repo=>(
//                       <div key={repo.id} onClick={()=>setGhSel(s=>s.includes(repo.id)?s.filter(id=>id!==repo.id):[...s,repo.id])}
//                         style={{ display:"flex",alignItems:"flex-start",gap:9,padding:"10px 13px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer",background:ghSel.includes(repo.id)? isDark?"#312e81":"#ede9fe": C.sur,transition:"background .15s" }}>
//                         <div style={{ width:17,height:17,borderRadius:5,border:`2px solid ${ghSel.includes(repo.id)?"#6366f1":C.bdr}`,background:ghSel.includes(repo.id)?"#6366f1": isDark?"#0f172a":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
//                           {ghSel.includes(repo.id)&&<Check size={10} color="#fff"/>}
//                         </div>
//                         <div style={{ flex:1,minWidth:0 }}>
//                           <div style={{ fontWeight:700,fontSize:12.5,color:C.txt,marginBottom:2,fontFamily:"'Poppins',sans-serif" }}>{repo.name}</div>
//                           <div style={{ fontSize:11,color:C.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'Poppins',sans-serif" }}>{repo.description||"No description"}</div>
//                           <div style={{ display:"flex",gap:10,marginTop:3 }}>
//                             {repo.language&&<span style={{ fontSize:10.5,color:C.sub,display:"flex",alignItems:"center",gap:2,fontFamily:"'Poppins',sans-serif" }}><Code size={9}/>{repo.language}</span>}
//                             <span style={{ fontSize:10.5,color:C.sub,display:"flex",alignItems:"center",gap:2,fontFamily:"'Poppins',sans-serif" }}><Star size={9}/>{repo.stargazers_count}</span>
//                             <span style={{ fontSize:10.5,color:C.sub,display:"flex",alignItems:"center",gap:2,fontFamily:"'Poppins',sans-serif" }}><GitFork size={9}/>{repo.forks_count}</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div style={{ marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
//                     <span style={{ fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>{ghSel.length} selected</span>
//                     <Btn icon={Plus} onClick={handleImportGH} disabled={ghSel.length===0}>Import Selected</Btn>
//                   </div>
//                 </>
//               )}
//               {!ghRepos.length&&!ghLoading&&!ghError&&(
//                 <div style={{ textAlign:"center",padding:"28px 16px",color:C.sub }}>
//                   <Github size={34} style={{ opacity:.2,marginBottom:9 }}/>
//                   <p style={{ fontSize:12.5,margin:0,fontFamily:"'Poppins',sans-serif" }}>Enter your GitHub username to fetch public repos</p>
//                 </div>
//               )}
//             </div>

//             {/* Upload */}
//             <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
//               <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:18 }}>
//                 <div style={{ width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#0891b2,#0e7490)",display:"flex",alignItems:"center",justifyContent:"center" }}>
//                   <Upload size={18} color="#fff"/>
//                 </div>
//                 <div>
//                   <h3 style={{ margin:0,fontSize:14,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>Upload Resume</h3>
//                   <p style={{ margin:0,fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>PDF, DOCX, or TXT — AI extracts all data</p>
//                 </div>
//               </div>
//               <div onClick={()=>fileRef.current?.click()}
//                 onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.background= isDark?"#312e81":"#f5f3ff";}}
//                 onDragLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.background= isDark?"#0f172a":"#fff";}}
//                 onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.background= isDark?"#0f172a":"#fff";handleUpload(e.dataTransfer.files[0]);}}
//                 style={{ border:`2px dashed ${C.bdr}`,borderRadius:12,padding:"30px 16px",textAlign:"center",cursor:"pointer",transition:"all .2s",background: isDark?"#0f172a":"#fff",marginBottom:14 }}>
//                 <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={e=>handleUpload(e.target.files[0])} style={{ display:"none" }}/>
//                 {uploadLoading ? (
//                   <div>
//                     <RefreshCw size={30} color="#6366f1" style={{ animation:"spin 1s linear infinite",marginBottom:9 }}/>
//                     <p style={{ fontSize:12.5,color:C.sub,margin:0,fontFamily:"'Poppins',sans-serif" }}>Parsing {uploadName}…</p>
//                   </div>
//                 ) : (
//                   <div>
//                     <Upload size={28} color={isDark?"#475569":"#94a3b8"} style={{ marginBottom:9 }}/>
//                     <p style={{ fontSize:13.5,fontWeight:700,color:C.txt,margin:"0 0 5px",fontFamily:"'Poppins',sans-serif" }}>Drop your resume here</p>
//                     <p style={{ fontSize:11.5,color:C.sub,margin:"0 0 14px",fontFamily:"'Poppins',sans-serif" }}>or click to browse</p>
//                     <div style={{ display:"flex",gap:5,justifyContent:"center" }}>
//                       {["PDF","DOCX","TXT"].map(ext=>(
//                         <span key={ext} style={{ padding:"3px 9px",borderRadius:20,background: isDark?"#1e293b":"#f1f5f9",color:C.sub,fontSize:11,fontWeight:700,fontFamily:"'Poppins',sans-serif" }}>{ext}</span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div style={{ padding:13,background: isDark?"#0c1a3a":"#eff6ff",borderRadius:10,border:`1.5px solid ${isDark?"#1d4ed8":"#bfdbfe"}`,marginBottom:12 }}>
//                 <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:6 }}>
//                   <Linkedin size={13} color="#2563eb"/>
//                   <span style={{ fontSize:12,fontWeight:700,color: isDark?"#93c5fd":"#1e40af",fontFamily:"'Poppins',sans-serif" }}>LinkedIn → PDF Import</span>
//                 </div>
//                 <p style={{ fontSize:11.5,color: isDark?"#60a5fa":"#1d4ed8",margin:"0 0 7px",fontFamily:"'Poppins',sans-serif" }}>Export your LinkedIn profile as PDF, then upload above to auto-import all career data.</p>
//                 <a href="https://www.linkedin.com/in/me/" target="_blank" rel="noreferrer"
//                   style={{ fontSize:11,fontWeight:700,color:"#2563eb",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4,fontFamily:"'Poppins',sans-serif" }}>
//                   Open LinkedIn <ExternalLink size={10}/>
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════ ATS SCORE ═══════ */}
//         {tab==="ats" && (
//           <div style={{ maxWidth:920,margin:"0 auto" }}>
//             <div style={{ background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}`,padding:22,marginBottom:18 }}>
//               <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
//                 <div style={{ width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center" }}>
//                   <Target size={20} color="#fff"/>
//                 </div>
//                 <div>
//                   <h2 style={{ margin:0,fontSize:16,fontWeight:800,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>ATS Score Analyzer</h2>
//                   <p style={{ margin:0,fontSize:12.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>Check how well your resume passes Applicant Tracking Systems</p>
//                 </div>
//               </div>
//               <Txt label="Job Description (strongly recommended)" value={atsJobDesc} onChange={setAtsJobDesc} rows={5} placeholder="Paste the job description here for accurate scoring…" isDark={isDark}/>
//               <div style={{ display:"flex",gap:10,alignItems:"center" }}>
//                 <Btn icon={BarChart2} onClick={handleATS} loading={atsLoading} size="lg">{atsLoading?"Analyzing…":"Analyze My Resume"}</Btn>
//                 {atsResult&&<Btn variant="secondary" icon={RefreshCw} onClick={()=>{setAtsResult(null);setAtsJobDesc("");}}>Reset</Btn>}
//               </div>
//             </div>
//             {atsLoading && (
//               <div style={{ textAlign:"center",padding:48,background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}` }}>
//                 <RefreshCw size={34} color="#6366f1" style={{ animation:"spin 1s linear infinite",marginBottom:14 }}/>
//                 <p style={{ fontSize:14,fontWeight:700,color:C.txt,margin:"0 0 5px",fontFamily:"'Poppins',sans-serif" }}>Analyzing your resume…</p>
//                 <p style={{ fontSize:12.5,color:C.sub,margin:0,fontFamily:"'Poppins',sans-serif" }}>Checking keywords, formatting, experience & skills</p>
//               </div>
//             )}
//             {atsResult&&!atsLoading && <ATSResults result={atsResult} onUpdateResume={handleATSEdit} isDark={isDark}/>}
//             {!atsResult&&!atsLoading && (
//               <div style={{ textAlign:"center",padding:"44px 28px",background:C.sur,borderRadius:16,border:`1.5px solid ${C.bdr}` }}>
//                 <Target size={44} color={isDark?"#334155":"#e2e8f0"} style={{ marginBottom:14 }}/>
//                 <h3 style={{ fontSize:17,fontWeight:800,color:C.txt,margin:"0 0 7px",fontFamily:"'Poppins',sans-serif" }}>Ready to analyze?</h3>
//                 <p style={{ fontSize:13,color:C.sub,maxWidth:440,margin:"0 auto",fontFamily:"'Poppins',sans-serif" }}>Get a detailed ATS score with category breakdown, weak area detection, and inline editing.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ═══════ PORTFOLIO ═══════ */}
//         {tab==="portfolio" && (
//           <div>
//             <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4f46e5 100%)",borderRadius:20,padding:"42px 42px",marginBottom:22,position:"relative",overflow:"hidden" }}>
//               <div style={{ position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,.05)" }}/>
//               <div style={{ position:"relative",zIndex:1 }}>
//                 <div style={{ width:62,height:62,borderRadius:17,background:"linear-gradient(135deg,#818cf8,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:13,fontWeight:900,color:"#fff" }}>
//                   {data.personal.name.charAt(0)}
//                 </div>
//                 <h1 style={{ fontSize:32,fontWeight:900,color:"#fff",margin:"0 0 5px",letterSpacing:"-.03em",fontFamily:"'Poppins',sans-serif" }}>{data.personal.name}</h1>
//                 <p style={{ fontSize:15,color:"rgba(255,255,255,.75)",margin:"0 0 14px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.title}</p>
//                 {expLevel && (
//                   <div style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:20,background:"rgba(255,255,255,.15)",marginBottom:14 }}>
//                     <expLevel.icon size={13} color="#fff"/>
//                     <span style={{ fontSize:11.5,color:"#fff",fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{expLevel.label}</span>
//                   </div>
//                 )}
//                 <p style={{ fontSize:13.5,color:"rgba(255,255,255,.6)",maxWidth:560,lineHeight:1.7,margin:"0 0 20px",fontFamily:"'Poppins',sans-serif" }}>{data.personal.summary}</p>
//                 <div style={{ display:"flex",gap:9,flexWrap:"wrap" }}>
//                   {data.personal.github   && <a href={`https://github.com/${data.personal.github}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:9,background:"rgba(255,255,255,.15)",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12.5,border:"1.5px solid rgba(255,255,255,.2)",fontFamily:"'Poppins',sans-serif" }}><Github size={13}/> GitHub</a>}
//                   {data.personal.linkedin && <a href={`https://linkedin.com/in/${data.personal.linkedin}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:9,background:"rgba(255,255,255,.15)",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12.5,border:"1.5px solid rgba(255,255,255,.2)",fontFamily:"'Poppins',sans-serif" }}><Linkedin size={13}/> LinkedIn</a>}
//                   {data.personal.website  && <a href={`https://${data.personal.website}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:9,background:"#6366f1",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12.5,fontFamily:"'Poppins',sans-serif" }}><Globe size={13}/> Portfolio</a>}
//                 </div>
//               </div>
//             </div>

//             <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:22 }}>
//               {[
//                 { label:"Projects",       value:data.projects.length,           icon:Rocket,    color:"#6366f1" },
//                 { label:"Skills",         value:data.skills.length,             icon:Zap,       color:"#0891b2" },
//                 { label:"Certifications", value:data.certifications?.length||0, icon:Award,     color:"#f59e0b" },
//                 { label:"Roles",          value:data.experience.length,          icon:Briefcase, color:"#22c55e" },
//               ].map(s=>(
//                 <div key={s.label} style={{ background:C.sur,borderRadius:13,padding:"16px 20px",border:`1.5px solid ${C.bdr}`,display:"flex",alignItems:"center",gap:13 }}>
//                   <div style={{ width:42,height:42,borderRadius:11,background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
//                     <s.icon size={19} color={s.color}/>
//                   </div>
//                   <div>
//                     <div style={{ fontSize:24,fontWeight:900,color:s.color,fontFamily:"'Poppins',sans-serif" }}>{s.value}</div>
//                     <div style={{ fontSize:11.5,color:C.sub,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>{s.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <h2 style={{ fontSize:17,fontWeight:800,color:C.txt,marginBottom:13,display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif" }}><Rocket size={16} color="#6366f1"/> Projects</h2>
//             <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14,marginBottom:26 }}>
//               {data.projects.map(p=>(
//                 <div key={p.id} style={{ background:C.sur,borderRadius:13,border:`1.5px solid ${C.bdr}`,padding:20,transition:"transform .2s,box-shadow .2s" }}
//                   onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(99,102,241,.12)";}}
//                   onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
//                   <div style={{ display:"flex",justifyContent:"space-between",marginBottom:9 }}>
//                     <div style={{ width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center" }}>
//                       <Package size={16} color="#fff"/>
//                     </div>
//                     <div style={{ display:"flex",gap:5 }}>
//                       {p.github&&<a href={`https://github.com/${p.github}`} target="_blank" rel="noreferrer" style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background: isDark?"#312e81":"#ede9fe",color:"#6366f1",textDecoration:"none",display:"flex",alignItems:"center",gap:3,fontFamily:"'Poppins',sans-serif" }}><Github size={9}/> Code</a>}
//                       {p.live  &&<a href={`https://${p.live}`} target="_blank" rel="noreferrer" style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background: isDark?"#052e16":"#dcfce7",color:"#16a34a",textDecoration:"none",display:"flex",alignItems:"center",gap:3,fontFamily:"'Poppins',sans-serif" }}><ExternalLink size={9}/> Live</a>}
//                     </div>
//                   </div>
//                   <h3 style={{ fontSize:14.5,fontWeight:800,color:C.txt,margin:"0 0 5px",fontFamily:"'Poppins',sans-serif" }}>{p.name||"Untitled"}</h3>
//                   <p style={{ fontSize:12.5,color:C.sub,margin:"0 0 11px",lineHeight:1.6,fontFamily:"'Poppins',sans-serif" }}>{p.description}</p>
//                   <div>{p.tech?.map(t=><span key={t} style={{ fontSize:10.5,fontWeight:600,padding:"2px 8px",borderRadius:20,background: isDark?"#1e293b":"#f1f5f9",color:C.sub,marginRight:4,marginBottom:3,display:"inline-block",fontFamily:"'Poppins',sans-serif" }}>{t}</span>)}</div>
//                 </div>
//               ))}
//               {!data.projects.length && <div style={{ gridColumn:"1/-1",textAlign:"center",padding:40,color:C.sub }}><Rocket size={40} style={{ opacity:.2,marginBottom:10 }}/><p style={{ fontSize:13,fontFamily:"'Poppins',sans-serif" }}>No projects yet.</p></div>}
//             </div>

//             <h2 style={{ fontSize:17,fontWeight:800,color:C.txt,marginBottom:13,fontFamily:"'Poppins',sans-serif" }}><Zap size={16} color="#0891b2" style={{ display:"inline",marginRight:7 }}/>Skills</h2>
//             <div style={{ background:C.sur,borderRadius:13,border:`1.5px solid ${C.bdr}`,padding:20,marginBottom:26 }}>
//               <div>{data.skills.map((sk,i)=>(<span key={sk} style={{ display:"inline-block",padding:"6px 14px",borderRadius:24,margin:"4px 5px",fontWeight:700,fontSize:12.5,background:`hsl(${(i*47)%360},${isDark?40:70}%,${isDark?25:94}%)`,color:`hsl(${(i*47)%360},${isDark?60:55}%,${isDark?75:30}%)`,border:`1.5px solid hsl(${(i*47)%360},${isDark?40:55}%,${isDark?35:82}%)`,fontFamily:"'Poppins',sans-serif" }}>{sk}</span>))}</div>
//             </div>

//             <h2 style={{ fontSize:17,fontWeight:800,color:C.txt,marginBottom:13,fontFamily:"'Poppins',sans-serif" }}><Briefcase size={16} color="#22c55e" style={{ display:"inline",marginRight:7 }}/>Experience</h2>
//             <div style={{ position:"relative",paddingLeft:28,marginBottom:26 }}>
//               <div style={{ position:"absolute",left:7,top:0,bottom:0,width:2,background:"linear-gradient(to bottom,#6366f1,#0891b2)" }}/>
//               {data.experience.map(exp=>(
//                 <div key={exp.id} style={{ position:"relative",marginBottom:18 }}>
//                   <div style={{ position:"absolute",left:-24,top:14,width:13,height:13,borderRadius:"50%",background:"#6366f1",border:"3px solid "+C.bg,boxShadow:"0 0 0 2px #6366f1" }}/>
//                   <div style={{ background:C.sur,borderRadius:13,border:`1.5px solid ${C.bdr}`,padding:"14px 18px" }}>
//                     <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
//                       <span style={{ fontWeight:800,fontSize:13.5,color:C.txt,fontFamily:"'Poppins',sans-serif" }}>{exp.role} <span style={{ color:"#6366f1",fontWeight:600 }}>@ {exp.company}</span></span>
//                       <span style={{ fontSize:11.5,color:C.sub,fontFamily:"'Poppins',sans-serif" }}>{exp.duration}</span>
//                     </div>
//                     {exp.bullets.filter(Boolean).map((b,j)=>(
//                       <div key={j} style={{ fontSize:12.5,color:C.sub,marginBottom:3,paddingLeft:13,position:"relative",fontFamily:"'Poppins',sans-serif" }}>
//                         <span style={{ position:"absolute",left:0,color:"#6366f1",fontWeight:900 }}>›</span>{b}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ═══════ PREVIEW ═══════ */}
//         {tab==="preview" && (
//           <div style={{ maxWidth:810,margin:"0 auto" }}>
//             <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
//               <h2 style={{ fontSize:16,fontWeight:800,color:C.txt,margin:0,fontFamily:"'Poppins',sans-serif" }}>
//                 <FileText size={15} color="#6366f1" style={{ display:"inline",marginRight:7 }}/>Print Preview
//               </h2>
//               <div style={{ display:"flex",gap:9 }}>
//                 <div style={{ display:"flex",gap:4 }}>
//                   {Object.entries(THEMES).map(([key,t])=>(
//                     <button key={key} onClick={()=>setTheme(key)}
//                       style={{ padding:"6px 13px",borderRadius:8,border:`1.5px solid ${theme===key?"#6366f1":C.bdr}`,background:theme===key?"#6366f1": isDark?"#1e293b":"#fff",color:theme===key?"#fff":C.sub,fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>
//                       {t.name}
//                     </button>
//                   ))}
//                 </div>
//                 <Btn icon={Printer} onClick={()=>window.print()} size="lg">Print / Save PDF</Btn>
//               </div>
//             </div>
//             <div className="print-zone" style={{ background:THEMES[theme].bg,borderRadius:16,border:`1.5px solid ${C.bdr}`,boxShadow:"0 12px 48px rgba(0,0,0,.08)",overflow:"hidden" }}>
//               <ResumePreview data={data} theme={theme}/>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }
















import { useState, useEffect, useRef } from "react";
import userService from "../services/userService";

// ─── Constants ────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "summit",
    name: "Summit",
    accent: "#2563eb",
    bg: "#fff",
    sidebar: false,
    preview: { header: "#2563eb", bar: "#1d4ed8" },
    tag: "Popular",
    desc: "Clean & Professional",
  },
  {
    id: "maple",
    name: "Maple",
    accent: "#dc2626",
    bg: "#fff",
    sidebar: false,
    preview: { header: "#dc2626", bar: "#b91c1c" },
    tag: "New",
    desc: "Bold Red Accent",
  },
  {
    id: "valiant",
    name: "Valiant",
    accent: "#0891b2",
    bg: "#f0f9ff",
    sidebar: true,
    preview: { header: "#0891b2", bar: "#0e7490" },
    tag: "2-Col",
    desc: "Two Column Layout",
  },
  {
    id: "quartz",
    name: "Quartz",
    accent: "#b45309",
    bg: "#fffbeb",
    sidebar: false,
    preview: { header: "#b45309", bar: "#92400e" },
    tag: "Classic",
    desc: "Warm & Timeless",
  },
  {
    id: "executive",
    name: "Executive",
    accent: "#1e293b",
    bg: "#fff",
    sidebar: true,
    preview: { header: "#1e293b", bar: "#0f172a" },
    tag: "Pro",
    desc: "Dark Sidebar",
  },
  {
    id: "aurora",
    name: "Aurora",
    accent: "#7c3aed",
    bg: "#faf5ff",
    sidebar: false,
    preview: { header: "#7c3aed", bar: "#6d28d9" },
    tag: "Creative",
    desc: "Purple Creative",
  },
  {
    id: "minimal",
    name: "Minimal",
    accent: "#374151",
    bg: "#fff",
    sidebar: false,
    preview: { header: "#374151", bar: "#1f2937" },
    tag: "Clean",
    desc: "Ultra Minimal",
  },
  {
    id: "professional",
    name: "Professional",
    accent: "#065f46",
    bg: "#f0fdf4",
    sidebar: false,
    preview: { header: "#065f46", bar: "#064e3b" },
    tag: "ATS",
    desc: "ATS Friendly Green",
  },
  {
    id: "coral",
    name: "Coral",
    accent: "#e11d48",
    bg: "#fff1f2",
    sidebar: false,
    preview: { header: "#e11d48", bar: "#be123c" },
    tag: "Vibrant",
    desc: "Coral Pink Accent",
  },
  {
    id: "slate",
    name: "Slate",
    accent: "#475569",
    bg: "#f8fafc",
    sidebar: true,
    preview: { header: "#475569", bar: "#334155" },
    tag: "Modern",
    desc: "Slate Gray Modern",
  },
];

// ─── Experience Levels for AI Generate ───────────────────────────────────────
const EXPERIENCE_LEVELS = [
  {
    id: "fresher",
    label: "Fresher / Intern",
    badge: "0 years",
    years: "0",
    desc: "Just graduated or currently studying",
  },
  {
    id: "junior",
    label: "Junior Developer",
    badge: "1–2 years",
    years: "1.5",
    desc: "Early career with some hands-on experience",
  },
  {
    id: "mid",
    label: "Mid-level Developer",
    badge: "2–3 years",
    years: "2.5",
    desc: "Comfortable working independently",
  },
  {
    id: "senior",
    label: "Senior Developer",
    badge: "4–6 years",
    years: "5",
    desc: "Leads projects and mentors others",
  },
  {
    id: "lead",
    label: "Tech Lead / Manager",
    badge: "7+ years",
    years: "8",
    desc: "Architectural decisions and team leadership",
  },
];

// ─── Skill Sets for LinkedIn PDF Import ──────────────────────────────────────
const SKILL_SETS = {
  "Java Full Stack": [
    "Java",
    "Spring Boot",
    "Spring MVC",
    "Hibernate",
    "JPA",
    "React",
    "Angular",
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "MySQL",
    "PostgreSQL",
    "REST API",
    "Microservices",
    "Maven",
    "Git",
    "Docker",
    "AWS",
    "Jenkins",
  ],
  "Python Full Stack": [
    "Python",
    "Django",
    "Flask",
    "FastAPI",
    "React",
    "Vue.js",
    "HTML5",
    "CSS3",
    "JavaScript",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "REST API",
    "Celery",
    "Docker",
    "AWS",
    "Git",
    "Nginx",
  ],
  "MERN Stack": [
    "MongoDB",
    "Express.js",
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "HTML5",
    "CSS3",
    "Redux",
    "REST API",
    "GraphQL",
    "JWT",
    "Socket.io",
    "Docker",
    "AWS",
    "Git",
    "Webpack",
    "Jest",
  ],
  "Data Science / ML": [
    "Python",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Matplotlib",
    "Seaborn",
    "SQL",
    "Jupyter Notebook",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Tableau",
    "Power BI",
    "AWS SageMaker",
    "Git",
    "Statistics",
  ],
  "DevOps / Cloud": [
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Jenkins",
    "GitHub Actions",
    "Linux",
    "Bash",
    "Python",
    "Prometheus",
    "Grafana",
    "CI/CD",
    "Nginx",
    "Redis",
    "ELK Stack",
    "Git",
  ],
  "Android Developer": [
    "Java",
    "Kotlin",
    "Android SDK",
    "Jetpack Compose",
    "XML Layouts",
    "Room Database",
    "Retrofit",
    "Firebase",
    "REST API",
    "MVVM",
    "LiveData",
    "ViewModel",
    "Coroutines",
    "Dagger/Hilt",
    "Google Play",
    "Git",
    "SQLite",
    "Material Design",
  ],
  "iOS Developer": [
    "Swift",
    "Objective-C",
    "Xcode",
    "SwiftUI",
    "UIKit",
    "Core Data",
    "Alamofire",
    "Combine",
    "REST API",
    "MVVM",
    "Firebase",
    "CocoaPods",
    "SPM",
    "Auto Layout",
    "App Store Connect",
    "Git",
    "Instruments",
    "TestFlight",
  ],
  "Frontend Developer": [
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Tailwind CSS",
    "SASS/SCSS",
    "Redux",
    "GraphQL",
    "REST API",
    "Webpack",
    "Vite",
    "Jest",
    "Cypress",
    "Figma",
    "Git",
    "Performance Optimization",
  ],
  "Backend Developer": [
    "Node.js",
    "Express.js",
    "Java",
    "Spring Boot",
    "Python",
    "Django",
    "REST API",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "RabbitMQ",
    "Kafka",
    "Docker",
    "AWS",
    "Microservices",
    "JWT",
    "OAuth2",
    "Git",
    "Linux",
  ],
  Cybersecurity: [
    "Network Security",
    "Penetration Testing",
    "OWASP",
    "Kali Linux",
    "Wireshark",
    "Nmap",
    "Metasploit",
    "SIEM",
    "Firewalls",
    "Python",
    "Bash",
    "Incident Response",
    "Vulnerability Assessment",
    "ISO 27001",
    "GDPR",
    "Ethical Hacking",
    "Cryptography",
    "SOC",
  ],
  "QA / Testing": [
    "Manual Testing",
    "Selenium",
    "Cypress",
    "Playwright",
    "JUnit",
    "TestNG",
    "Postman",
    "REST Assured",
    "JMeter",
    "JIRA",
    "Agile/Scrum",
    "BDD",
    "Cucumber",
    "Java",
    "Python",
    "API Testing",
    "Performance Testing",
    "Git",
    "CI/CD",
    "Test Automation",
  ],
  "UI/UX Designer": [
    "Figma",
    "Adobe XD",
    "Sketch",
    "Zeplin",
    "InVision",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Usability Testing",
    "Design Systems",
    "HTML5",
    "CSS3",
    "Motion Design",
    "Adobe Illustrator",
    "Photoshop",
    "Typography",
    "Color Theory",
  ],
  "None / Custom": [],
};

const DUMMY_RESUME = {
  firstName: "Alex",
  lastName: "Johnson",
  jobTitle: "Full Stack Developer",
  email: "alex.johnson@email.com",
  phone: "+91 9876543210",
  city: "Hyderabad",
  country: "India",
  linkedinUrl: "linkedin.com/in/alexjohnson",
  githubUrl: "github.com/alexjohnson",
  portfolioUrl: "alexjohnson.dev",
  profileSummary:
    "Results-driven Full Stack Developer with 3+ years of hands-on experience building scalable web applications using React, Java Spring Boot, and AWS. Proficient in designing RESTful APIs and microservices architecture.",
  workExperiences: [
    {
      id: 1,
      companyName: "TechCorp Solutions",
      position: "Senior Full Stack Developer",
      startDate: "Jan 2023",
      endDate: "",
      isCurrent: true,
      location: "Hyderabad, India",
      description:
        "• Developed RESTful APIs using Spring Boot and MySQL, reducing response time by 35%\n• Architected microservices-based backend using Docker and AWS EC2",
      displayOrder: 0,
    },
    {
      id: 2,
      companyName: "Infosys Ltd",
      position: "Junior Developer",
      startDate: "Jun 2021",
      endDate: "Dec 2022",
      isCurrent: false,
      location: "Bangalore, India",
      description:
        "• Built responsive React frontends for 3 enterprise applications\n• Integrated third-party payment gateways increasing conversion by 20%",
      displayOrder: 1,
    },
  ],
  educations: [
    {
      id: 1,
      institution: "JNTUH College of Engineering",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Computer Science and Engineering",
      startDate: "2017",
      endDate: "2021",
      grade: "8.4 / 10",
      description: "",
      displayOrder: 0,
    },
  ],
  skills: [
    { id: 1, skillName: "React", proficiencyLevel: "EXPERT", displayOrder: 0 },
    { id: 2, skillName: "Java", proficiencyLevel: "EXPERT", displayOrder: 1 },
    {
      id: 3,
      skillName: "Spring Boot",
      proficiencyLevel: "ADVANCED",
      displayOrder: 2,
    },
    {
      id: 4,
      skillName: "MySQL",
      proficiencyLevel: "ADVANCED",
      displayOrder: 3,
    },
    {
      id: 5,
      skillName: "AWS",
      proficiencyLevel: "INTERMEDIATE",
      displayOrder: 4,
    },
    {
      id: 6,
      skillName: "Docker",
      proficiencyLevel: "INTERMEDIATE",
      displayOrder: 5,
    },
  ],
  projects: [
    {
      id: 1,
      projectName: "E-Commerce Microservices Platform",
      techStack: "React, Spring Boot, MySQL, Docker, AWS",
      projectUrl: "github.com/alexjohnson/ecommerce",
      startDate: "Mar 2023",
      endDate: "Jun 2023",
      description:
        "Full-stack e-commerce platform with microservices architecture.\n• Developed REST API using Spring Boot serving 10K+ daily users",
      displayOrder: 0,
    },
  ],
  certifications: [
    {
      id: 1,
      certName: "AWS Solutions Architect Associate",
      issuingOrganization: "Amazon Web Services",
      issueDate: "Jan 2024",
      expiryDate: "Jan 2027",
      credentialId: "AWS-SAA-123456",
      credentialUrl: "credly.com/badges/aws-saa",
      displayOrder: 0,
    },
  ],
};

const SECTIONS = [
  { id: "Personal Info", icon: "👤" },
  { id: "Profile", icon: "📝" },
  { id: "Experience", icon: "💼" },
  { id: "Education", icon: "🎓" },
  { id: "Skills", icon: "⚡" },
  { id: "Projects", icon: "🚀" },
  { id: "Certifications", icon: "🏆" },
];

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const LEVEL_COLOR = {
  BEGINNER: "#6b7280",
  INTERMEDIATE: "#3b82f6",
  ADVANCED: "#f59e0b",
  EXPERT: "#10b981",
};
const LEVEL_PCT = { BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 };

const emptyResume = {
  title: "My Resume",
  templateName: "summit",
  firstName: "",
  lastName: "",
  jobTitle: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  profileSummary: "",
  workExperiences: [],
  educations: [],
  skills: [],
  projects: [],
  certifications: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMyUserId() {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.sub || payload.id || null;
  } catch {
    return null;
  }
}

function mapResponseToLocal(dto) {
  const stamp = () => Date.now() + Math.random();
  return {
    id: dto.id,
    title: dto.title || "My Resume",
    templateName: dto.templateName || "summit",
    firstName: dto.firstName || "",
    lastName: dto.lastName || "",
    jobTitle: dto.jobTitle || "",
    email: dto.email || "",
    phone: dto.phone || "",
    city: dto.city || "",
    country: dto.country || "",
    linkedinUrl: dto.linkedinUrl || "",
    githubUrl: dto.githubUrl || "",
    portfolioUrl: dto.portfolioUrl || "",
    profileSummary: dto.profileSummary || "",
    resumeScore: dto.resumeScore || 0,
    isAtsFriendly: dto.isAtsFriendly || false,
    workExperiences: (dto.workExperiences || []).map((w) => ({
      ...w,
      id: w.id || stamp(),
    })),
    educations: (dto.educations || []).map((e) => ({
      ...e,
      id: e.id || stamp(),
    })),
    skills: (dto.skills || []).map((s) => ({ ...s, id: s.id || stamp() })),
    projects: (dto.projects || []).map((p) => ({ ...p, id: p.id || stamp() })),
    certifications: (dto.certifications || []).map((c) => ({
      ...c,
      id: c.id || stamp(),
    })),
  };
}

function mapLocalToRequest(r) {
  return {
    title: r.title,
    templateName: r.templateName,
    firstName: r.firstName,
    lastName: r.lastName,
    jobTitle: r.jobTitle,
    email: r.email,
    phone: r.phone,
    city: r.city,
    country: r.country,
    linkedinUrl: r.linkedinUrl,
    githubUrl: r.githubUrl,
    portfolioUrl: r.portfolioUrl,
    profileSummary: r.profileSummary,
    workExperiences: r.workExperiences.map(
      ({
        companyName,
        position,
        startDate,
        endDate,
        isCurrent,
        location,
        description,
        displayOrder,
      }) => ({
        companyName,
        position,
        startDate,
        endDate,
        isCurrent,
        location,
        description,
        displayOrder,
      }),
    ),
    educations: r.educations.map(
      ({
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        description,
        displayOrder,
      }) => ({
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        description,
        displayOrder,
      }),
    ),
    skills: r.skills.map(({ skillName, proficiencyLevel, displayOrder }) => ({
      skillName,
      proficiencyLevel,
      displayOrder,
    })),
    projects: r.projects.map(
      ({
        projectName,
        techStack,
        projectUrl,
        startDate,
        endDate,
        description,
        displayOrder,
      }) => ({
        projectName,
        techStack,
        projectUrl,
        startDate,
        endDate,
        description,
        displayOrder,
      }),
    ),
    certifications: r.certifications.map(
      ({
        certName,
        issuingOrganization,
        issueDate,
        expiryDate,
        credentialId,
        credentialUrl,
        displayOrder,
      }) => ({
        certName,
        issuingOrganization,
        issueDate,
        expiryDate,
        credentialId,
        credentialUrl,
        displayOrder,
      }),
    ),
  };
}

function calcScore(r) {
  let s = 0;
  if (r.firstName) s += 5;
  if (r.email) s += 5;
  if (r.phone) s += 5;
  if (r.city) s += 5;
  if ((r.profileSummary || "").length > 80) s += 15;
  s += Math.min(25, r.workExperiences.length * 9);
  s += Math.min(15, r.educations.length * 8);
  s += Math.min(15, r.skills.length * 2);
  if (r.projects.length) s += 5;
  if (r.certifications.length) s += 5;
  if (r.linkedinUrl) s += 5;
  if (r.githubUrl) s += 5;
  return Math.min(100, s);
}

function downloadResumeAsPdf(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const safeName = (filename || "resume").replace(/[^a-zA-Z0-9_\-]/g, "_");
  const win = window.open("", "_blank");
  win.document.write(
    `<!DOCTYPE html><html><head><title>${safeName}</title><style>* { box-sizing: border-box; margin: 0; padding: 0; } body { background: white; } @page { size: A4; margin: 0; } @media print { html, body { width: 210mm; height: 297mm; } body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }</style><script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };<\/script></head><body>${el.outerHTML}</body></html>`,
  );
  win.document.close();
}

// ─── Score Breakdown Modal ────────────────────────────────────────────────────
function ResumeScoreModal({ resume, onClose }) {
  const score = calcScore(resume);
  const scoreColor =
    score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  const items = [
    {
      label: "First Name",
      earned: resume.firstName ? 5 : 0,
      max: 5,
      tip: "Add your first name",
    },
    {
      label: "Email Address",
      earned: resume.email ? 5 : 0,
      max: 5,
      tip: "Add your email",
    },
    {
      label: "Phone Number",
      earned: resume.phone ? 5 : 0,
      max: 5,
      tip: "Add your phone number",
    },
    {
      label: "City / Location",
      earned: resume.city ? 5 : 0,
      max: 5,
      tip: "Add your city",
    },
    {
      label: "Profile Summary",
      earned: (resume.profileSummary || "").length > 80 ? 15 : 0,
      max: 15,
      tip: "Write a 80+ character summary",
    },
    {
      label: "Work Experience",
      earned: Math.min(25, resume.workExperiences.length * 9),
      max: 25,
      tip: "Add at least 2–3 work experiences",
    },
    {
      label: "Education",
      earned: Math.min(15, resume.educations.length * 8),
      max: 15,
      tip: "Add your education history",
    },
    {
      label: "Skills",
      earned: Math.min(15, resume.skills.length * 2),
      max: 15,
      tip: "Add 7+ skills for full marks",
    },
    {
      label: "Projects",
      earned: resume.projects.length ? 5 : 0,
      max: 5,
      tip: "Add at least one project",
    },
    {
      label: "Certifications",
      earned: resume.certifications.length ? 5 : 0,
      max: 5,
      tip: "Add a certification",
    },
    {
      label: "LinkedIn URL",
      earned: resume.linkedinUrl ? 5 : 0,
      max: 5,
      tip: "Add your LinkedIn profile URL",
    },
    {
      label: "GitHub URL",
      earned: resume.githubUrl ? 5 : 0,
      max: 5,
      tip: "Add your GitHub profile URL",
    },
  ];

  const r = score / 100;
  const circumference = 2 * Math.PI * 52;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          width: 540,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#111",
              }}
            >
              📊 Resume Score Breakdown
            </h2>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
              See exactly what's boosting or lowering your score
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            Close ✕
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            background: "#f8fafc",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              flexShrink: 0,
            }}
          >
            <svg
              width={120}
              height={120}
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx={60}
                cy={60}
                r={52}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={10}
              />
              <circle
                cx={60}
                cy={60}
                r={52}
                fill="none"
                stroke={scoreColor}
                strokeWidth={10}
                strokeDasharray={`${r * circumference} ${circumference}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: scoreColor,
                  lineHeight: 1,
                }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                / 100
              </span>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#111",
                marginBottom: 4,
              }}
            >
              {score >= 80
                ? "Excellent! 🚀"
                : score >= 60
                  ? "Good job! 👍"
                  : score >= 40
                    ? "Needs work 📝"
                    : "Just started 🌱"}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
              {score >= 80
                ? "Your resume is strong and ATS-ready. Keep it updated!"
                : score >= 60
                  ? "A few more sections will significantly boost your chances."
                  : score >= 40
                    ? "Fill in more sections to make your resume stand out."
                    : "Start filling in your details to build a strong resume."}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: item.earned === item.max ? "#f0fdf4" : "#fff",
                border: `1px solid ${item.earned === item.max ? "#bbf7d0" : "#e5e7eb"}`,
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 18, flexShrink: 0 }}>
                {item.earned === item.max
                  ? "✅"
                  : item.earned > 0
                    ? "🟡"
                    : "❌"}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontWeight: 700, fontSize: 13, color: "#111" }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        item.earned === item.max
                          ? "#10b981"
                          : item.earned > 0
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  >
                    {item.earned}/{item.max} pts
                  </span>
                </div>
                <div
                  style={{ height: 5, background: "#f1f5f9", borderRadius: 99 }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 99,
                      background:
                        item.earned === item.max
                          ? "#10b981"
                          : item.earned > 0
                            ? "#f59e0b"
                            : "#e5e7eb",
                      width: `${(item.earned / item.max) * 100}%`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                {item.earned < item.max && (
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
                    💡 {item.tip}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ATS Score Upload Modal ───────────────────────────────────────────────────
function ATSScoreUploadModal({ userId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setLoading(true);
    setError("");
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      try {
        const res = await userService.aiParsePdf(userId, base64, file.name);
        const parsed = res.data;
        const fakeResume = {
          firstName: parsed.firstName || "X",
          email: parsed.email || "",
          phone: parsed.phone || "",
          city: parsed.city || "",
          profileSummary: parsed.profileSummary || "",
          workExperiences: parsed.workExperiences || [],
          educations: parsed.educations || [],
          skills: parsed.skills || [],
          projects: parsed.projects || [],
          certifications: parsed.certifications || [],
          linkedinUrl: parsed.linkedinUrl || "",
          githubUrl: parsed.githubUrl || "",
        };
        const score = calcScore(fakeResume);
        const atsOk = !!(
          fakeResume.email &&
          fakeResume.profileSummary &&
          fakeResume.skills.length > 0 &&
          fakeResume.workExperiences.length > 0
        );
        setResult({
          score,
          atsOk,
          name: `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim(),
          jobTitle: parsed.jobTitle || "",
          skills: fakeResume.skills.length,
          workExp: fakeResume.workExperiences.length,
        });
      } catch {
        setError("Could not analyse PDF. Please use a text-based PDF.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const scoreColor = result
    ? result.score >= 80
      ? "#10b981"
      : result.score >= 50
        ? "#f59e0b"
        : "#ef4444"
    : "#e5e7eb";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          width: 500,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#111",
              }}
            >
              🎯 ATS Score Checker
            </h2>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
              Upload your resume PDF for instant ATS analysis
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>
        {!result && !loading && (
          <>
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              style={{
                border: `2.5px dashed ${dragging ? "#2563eb" : "#d1d5db"}`,
                borderRadius: 14,
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "#eff6ff" : "#f9fafb",
                transition: "all 0.2s",
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div style={{ fontSize: 44, marginBottom: 14 }}>📄</div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 6px",
                  fontSize: 15,
                }}
              >
                Drop your resume PDF here
              </p>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
                or click to browse · PDF only · text-based PDFs work best
              </p>
            </div>
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: 8,
                  fontSize: 12,
                  marginTop: 12,
                }}
              >
                {error}
              </div>
            )}
          </>
        )}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 16px",
                borderRadius: "50%",
                border: "5px solid #e5e7eb",
                borderTop: "5px solid #2563eb",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontWeight: 700, color: "#111" }}>
              Analysing your resume…
            </p>
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              AI is reading every section and checking ATS compatibility
            </p>
          </div>
        )}
        {result && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: "#f8fafc",
                borderRadius: 14,
                padding: "20px 24px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  flexShrink: 0,
                }}
              >
                <svg
                  width={100}
                  height={100}
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx={50}
                    cy={50}
                    r={42}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={9}
                  />
                  <circle
                    cx={50}
                    cy={50}
                    r={42}
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth={9}
                    strokeDasharray={`${(result.score / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 24, fontWeight: 900, color: scoreColor }}
                  >
                    {result.score}
                  </span>
                  <span style={{ fontSize: 10, color: "#6b7280" }}>/ 100</span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 17,
                    color: "#111",
                    marginBottom: 4,
                  }}
                >
                  {result.name || "Your Resume"}
                </div>
                {result.jobTitle && (
                  <div
                    style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}
                  >
                    {result.jobTitle}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: result.atsOk ? "#dcfce7" : "#fee2e2",
                      color: result.atsOk ? "#065f46" : "#dc2626",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {result.atsOk ? "✓ ATS Friendly" : "✗ Not ATS Ready"}
                  </span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {result.skills} skills
                  </span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "#faf5ff",
                      color: "#6d28d9",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {result.workExp} exp
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setResult(null)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Check Another PDF
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Done ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Writing Assistant Modal ───────────────────────────────────────────────
function AIWritingAssistantModal({ resume, onApply, onClose, userId }) {
  const [section, setSection] = useState("profileSummary");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sections = [
    { id: "profileSummary", label: "Profile Summary", icon: "📝" },
    { id: "workDescription", label: "Work Experience Bullet", icon: "💼" },
    { id: "projectDescription", label: "Project Description", icon: "🚀" },
  ];

  const placeholders = {
    profileSummary:
      "e.g. I'm a React developer with 2 years experience at a startup, worked on e-commerce and dashboards...",
    workDescription:
      "e.g. Built REST APIs using Spring Boot, worked on payment gateway integration, reduced load time...",
    projectDescription:
      "e.g. Built an online food delivery app with React and Node.js, user authentication, real-time order tracking...",
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please describe your experience first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await userService.aiWriteSection(userId, section, input);
      const text = res.data?.text || "";
      if (!text) throw new Error("No response");
      setResult(text.trim());
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          width: 580,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#111",
              }}
            >
              💬 AI Writing Assistant
            </h2>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
              Describe in plain words — AI will rewrite it professionally
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            overflowX: "auto",
          }}
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSection(s.id);
                setResult("");
                setError("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: `2px solid ${section === s.id ? "#2563eb" : "#e5e7eb"}`,
                background: section === s.id ? "#eff6ff" : "#fff",
                color: section === s.id ? "#2563eb" : "#374151",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Describe in your own words
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[section]}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
              minHeight: 100,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "#fee2e2",
              color: "#dc2626",
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: loading
              ? "#93c5fd"
              : "linear-gradient(135deg,#7c3aed,#2563eb)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            marginBottom: result ? 16 : 0,
          }}
        >
          {loading ? "✨ AI is writing…" : "✨ Generate Professional Text"}
        </button>
        {result && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              AI Result — click to copy
            </label>
            <div
              style={{
                background: "#f8fafc",
                border: "1.5px solid #e5e7eb",
                borderRadius: 10,
                padding: "14px 16px",
                fontSize: 13,
                color: "#111",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                marginBottom: 12,
                cursor: "pointer",
              }}
              onClick={() => navigator.clipboard?.writeText(result)}
            >
              {result}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => navigator.clipboard?.writeText(result)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 9,
                  border: "1.5px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                📋 Copy Text
              </button>
              {section === "profileSummary" && (
                <button
                  onClick={() => {
                    onApply("profileSummary", result);
                    onClose();
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 9,
                    border: "none",
                    background: "#10b981",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ✓ Apply to Resume
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ILMORA Navbar ────────────────────────────────────────────────────────────
function ILMORANavbar({ onCreateResume, resumes, onFeatureClick }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target))
        setActiveDropdown(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    {
      label: "Resume",
      dropdown: [
        {
          icon: "✨",
          title: "AI Resume Builder",
          sub: "Generate a complete ATS-optimised resume with AI",
          action: () => onCreateResume("ai"),
        },
        {
          icon: "🔗",
          title: "Import from LinkedIn",
          sub: "Upload your LinkedIn PDF and AI builds your resume",
          action: () => onCreateResume("linkedin"),
        },
        {
          icon: "📤",
          title: "Upload Existing Resume",
          sub: "Upload your PDF and AI extracts every section",
          action: () => onCreateResume("pdf"),
        },
        {
          icon: "✏️",
          title: "Build from Scratch",
          sub: "Start with a blank canvas and full control",
          action: () => onCreateResume("manual"),
        },
      ],
    },
    {
      label: "Templates",
      dropdown: [
        {
          icon: "🎨",
          title: "Browse All Templates",
          sub: "10 stunning ATS-friendly resume designs",
          action: () => onCreateResume("template"),
        },
        {
          icon: "🏆",
          title: "Professional Templates",
          sub: "Classic layouts trusted by hiring managers",
          action: () => onCreateResume("template"),
        },
        {
          icon: "🚀",
          title: "Creative Templates",
          sub: "Stand out with bold, modern designs",
          action: () => onCreateResume("template"),
        },
        {
          icon: "🎯",
          title: "ATS-Friendly Templates",
          sub: "Optimised to pass applicant tracking systems",
          action: () => onCreateResume("template"),
        },
      ],
    },
    {
      label: "Features",
      dropdown: [
        {
          icon: "🎯",
          title: "ATS Score Checker",
          sub: "Upload your resume PDF for instant ATS analysis",
          action: () => {
            onFeatureClick("ats-score");
            setActiveDropdown(null);
          },
        },
        {
          icon: "📊",
          title: "Resume Score",
          sub: "Detailed breakdown of your open resume quality",
          action: () => {
            onFeatureClick("resume-score");
            setActiveDropdown(null);
          },
        },
        {
          icon: "💬",
          title: "AI Writing Assistant",
          sub: "AI-powered content suggestions and rewrites",
          action: () => {
            onFeatureClick("ai-writing");
            setActiveDropdown(null);
          },
        },
        {
          icon: "⬇️",
          title: "PDF Export",
          sub: "Download your open resume as a professional PDF",
          action: () => {
            onFeatureClick("pdf-export");
            setActiveDropdown(null);
          },
        },
      ],
    },
    {
      label: "My Resumes",
      dropdown:
        resumes.length > 0
          ? resumes
              .slice(0, 4)
              .map((r) => ({
                icon: "📄",
                title: r.title || "Untitled Resume",
                sub:
                  `${r.firstName || ""} ${r.lastName || ""}`.trim() ||
                  "Click to edit",
                action: () => onCreateResume("edit", r),
              }))
          : [
              {
                icon: "📄",
                title: "No resumes yet",
                sub: "Create your first resume to get started",
                action: null,
              },
            ],
    },
  ];

  return (
    <nav
      ref={navRef}
      style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          height: 68,
          gap: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginRight: 40,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(29,78,216,0.3)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: -1,
              }}
            >
              I
            </span>
          </div>
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 16,
                color: "#0f172a",
                letterSpacing: -0.3,
              }}
            >
              ILMORA
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#2563eb",
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginTop: -2,
              }}
            >
              Resume Builder
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          {navItems.map((item) => (
            <div key={item.label} style={{ position: "relative" }}>
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === item.label ? null : item.label,
                  )
                }
                style={{
                  padding: "8px 14px",
                  border: "none",
                  background:
                    activeDropdown === item.label ? "#f0f9ff" : "transparent",
                  color: activeDropdown === item.label ? "#2563eb" : "#374151",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (activeDropdown !== item.label) {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.color = "#1d4ed8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeDropdown !== item.label) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#374151";
                  }
                }}
              >
                {item.label}
                <span
                  style={{
                    fontSize: 10,
                    transition: "transform 0.2s",
                    transform:
                      activeDropdown === item.label
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    display: "inline-block",
                  }}
                >
                  ▼
                </span>
              </button>
              {activeDropdown === item.label && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                    padding: "10px",
                    minWidth: 300,
                    zIndex: 200,
                    animation: "fadeSlideIn 0.15s ease",
                  }}
                >
                  <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
                  {item.dropdown.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        d.action && d.action();
                        setActiveDropdown(null);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "none",
                        background: "transparent",
                        cursor: d.action ? "pointer" : "default",
                        width: "100%",
                        textAlign: "left",
                        transition: "background 0.1s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        if (d.action)
                          e.currentTarget.style.background = "#f0f9ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span
                        style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}
                      >
                        {d.icon}
                      </span>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#0f172a",
                            marginBottom: 2,
                          }}
                        >
                          {d.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          {d.sub}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => onCreateResume("ai")}
          style={{
            padding: "10px 22px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(29,78,216,0.35)",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 18px rgba(29,78,216,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(29,78,216,0.35)";
          }}
        >
          + Create Resume
        </button>
      </div>
    </nav>
  );
}

// ─── Hero Homepage ────────────────────────────────────────────────────────────
function HomePage({ onCreateResume, resumes, onFeatureClick }) {
  const stats = [
    { num: "50K+", label: "Resumes Created" },
    { num: "98%", label: "ATS Pass Rate" },
    { num: "10", label: "Pro Templates" },
    { num: "3x", label: "More Interviews" },
  ];
  const features = [
    {
      icon: "✨",
      title: "AI Resume Generation",
      desc: "Describe your role and experience — AI writes a complete, ATS-optimised resume in under 60 seconds.",
      action: "ai",
      gradient: "linear-gradient(135deg, #7c3aed, #2563eb)",
      glow: "rgba(124,58,237,0.25)",
    },
    {
      icon: "🔗",
      title: "LinkedIn Import",
      desc: "Download your LinkedIn PDF and upload it — AI extracts your real work history, skills, and certifications automatically.",
      action: "linkedin",
      gradient: "linear-gradient(135deg, #0077b5, #0891b2)",
      glow: "rgba(0,119,181,0.25)",
    },
    {
      icon: "📤",
      title: "Upload Your Resume",
      desc: "Already have a resume? Upload your PDF and AI will extract every section — work, education, skills, projects.",
      action: "pdf",
      gradient: "linear-gradient(135deg, #059669, #0891b2)",
      glow: "rgba(5,150,105,0.25)",
    },
    {
      icon: "✏️",
      title: "Build from Scratch",
      desc: "Prefer full control? Use our guided editor to build a stunning resume section by section at your own pace.",
      action: "manual",
      gradient: "linear-gradient(135deg, #374151, #1f2937)",
      glow: "rgba(55,65,81,0.25)",
    },
  ];
  const steps = [
    {
      num: "01",
      title: "Choose your method",
      desc: "AI generate, LinkedIn PDF import, resume upload, or manual — pick what works for you.",
    },
    {
      num: "02",
      title: "Pick a template",
      desc: "Select from 10 professionally designed, ATS-friendly templates.",
    },
    {
      num: "03",
      title: "Customise & refine",
      desc: "Edit every section, get AI suggestions, and check your ATS score in real time.",
    },
    {
      num: "04",
      title: "Download & apply",
      desc: "Export your polished resume as a PDF and start applying with confidence.",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(29,78,216,0)} 50%{box-shadow:0 0 0 12px rgba(29,78,216,0.08)} }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .feature-card:hover { transform: translateY(-6px) !important; }
        .feature-card:hover .feature-icon { transform: scale(1.1) rotate(-3deg); }
        .resume-card-hover:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 36px rgba(0,0,0,0.14) !important; }
      `}</style>

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 8s ease infinite",
          padding: "72px 32px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(29,78,216,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(8,145,178,0.1)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              marginBottom: 28,
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ fontSize: 14 }}>🎯</span>
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              AI-Powered · ATS-Optimised · Get Hired Faster
            </span>
          </div>
          <h1
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 20px",
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            Build your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              winning resume
            </span>
            <br />
            in minutes
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 580,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            From AI generation to LinkedIn PDF import — ILMORA Resume Builder
            creates professional, ATS-friendly resumes that land you interviews.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 52,
            }}
          >
            <button
              onClick={() => onCreateResume("ai")}
              style={{
                padding: "14px 32px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #0891b2)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(37,99,235,0.5)",
                fontFamily: "inherit",
                animation: "pulse-glow 3s ease infinite",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              ✨ Generate with AI
            </button>
            <button
              onClick={() => onCreateResume("manual")}
              style={{
                padding: "14px 32px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
            >
              Start from Scratch →
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.55)",
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Resumes */}
      {resumes.length > 0 && (
        <div
          style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px 0" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#0f172a",
                  margin: "0 0 4px",
                }}
              >
                My Resumes
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""} · Click
                to edit
              </p>
            </div>
            <button
              onClick={() => onCreateResume("ai")}
              style={{
                padding: "10px 22px",
                borderRadius: 10,
                border: "none",
                background: "#1d4ed8",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              + New Resume
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {resumes.map((r) => {
              const sc = r.resumeScore || calcScore(r);
              const scColor =
                sc >= 80 ? "#10b981" : sc >= 50 ? "#f59e0b" : "#ef4444";
              const tmpl = TEMPLATES.find((t) => t.id === r.templateName);
              return (
                <div
                  key={r.id}
                  className="resume-card-hover"
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      height: 180,
                      background: "#f8fafc",
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => onCreateResume("edit", r)}
                  >
                    <div
                      style={{
                        transform: "scale(0.28)",
                        transformOrigin: "top left",
                        width: "357%",
                        pointerEvents: "none",
                      }}
                    >
                      <ResumePreview r={r} />
                    </div>
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: scColor + "22",
                          color: scColor,
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {sc}%
                      </span>
                    </div>
                    {r.isAtsFriendly && (
                      <div style={{ position: "absolute", top: 10, left: 10 }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "#eff6ff",
                            color: "#2563eb",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          ATS ✓
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#0f172a",
                        marginBottom: 3,
                      }}
                    >
                      {r.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 10,
                      }}
                    >
                      {r.firstName} {r.lastName}
                      {r.jobTitle && <span> · {r.jobTitle}</span>}
                      <span
                        style={{
                          marginLeft: 6,
                          color: tmpl?.accent || "#9ca3af",
                          fontWeight: 600,
                        }}
                      >
                        {tmpl?.name || r.templateName}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "#f1f5f9",
                        borderRadius: 99,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: 99,
                          background: scColor,
                          width: `${sc}%`,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => onCreateResume("edit", r)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: 8,
                          border: "1.5px solid #2563eb",
                          background: "#eff6ff",
                          color: "#2563eb",
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onCreateResume("download", r)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #fde68a",
                          background: "#fffbeb",
                          color: "#92400e",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                        title="Download PDF"
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => onCreateResume("delete", r)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #fee2e2",
                          background: "#fff",
                          color: "#dc2626",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Features */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 32px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#2563eb",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            4 Ways to Build
          </div>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#0f172a",
              margin: "0 0 12px",
              letterSpacing: -0.5,
            }}
          >
            Choose your fastest path
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              onClick={() => onCreateResume(f.action)}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "28px 24px",
                cursor: "pointer",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: f.gradient,
                  opacity: 0.06,
                  pointerEvents: "none",
                }}
              />
              <div
                className="feature-icon"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: f.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  marginBottom: 18,
                  boxShadow: `0 4px 14px ${f.glow}`,
                  transition: "transform 0.3s",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 8px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  margin: "0 0 18px",
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                Get started <span style={{ fontSize: 16 }}>→</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div
        style={{ background: "#fff", margin: "60px 0 0", padding: "60px 32px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#2563eb",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Simple Process
            </div>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 12px",
                letterSpacing: -0.5,
              }}
            >
              How it works
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                style={{ textAlign: "center", padding: "24px 16px" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                    border: "2px solid #bfdbfe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: 18,
                    fontWeight: 900,
                    color: "#2563eb",
                    fontFamily: "monospace",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0 0 8px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Gallery */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#2563eb",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Templates
          </div>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#0f172a",
              margin: "0 0 12px",
              letterSpacing: -0.5,
            }}
          >
            10 stunning designs
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 16,
          }}
        >
          {TEMPLATES.map((t) => {
            const dummyData = { ...DUMMY_RESUME, templateName: t.id };
            return (
              <div
                key={t.id}
                onClick={() => onCreateResume("template")}
                style={{
                  cursor: "pointer",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "2px solid #e5e7eb",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.accent;
                  e.currentTarget.style.boxShadow = `0 6px 20px ${t.accent}30`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    height: 160,
                    overflow: "hidden",
                    background: "#f8fafc",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      transform: "scale(0.22)",
                      transformOrigin: "top left",
                      width: "454%",
                      pointerEvents: "none",
                    }}
                  >
                    <ResumePreview r={dummyData} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: t.accent + "22",
                      color: t.accent,
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {t.tag}
                  </div>
                </div>
                <div
                  style={{
                    padding: "8px 10px",
                    background: "#fafafa",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: t.accent,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#374151",
                      }}
                    >
                      {t.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
          padding: "60px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 14px",
              letterSpacing: -0.5,
            }}
          >
            Ready to land your dream job?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 16,
              margin: "0 0 32px",
            }}
          >
            Join thousands of students who've built career-defining resumes with
            ILMORA.
          </p>
          <button
            onClick={() => onCreateResume("ai")}
            style={{
              padding: "16px 48px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #0891b2)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(37,99,235,0.5)",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.04)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ✨ Create My Resume Now →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Save Name Modal ──────────────────────────────────────────────────────────
function SaveNameModal({ defaultName, onConfirm, onCancel }) {
  const [name, setName] = useState(defaultName || "My Resume");
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 36px",
          width: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>
          💾
        </div>
        <h2
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: 800,
            color: "#111",
            marginBottom: 6,
          }}
        >
          Save Resume
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          Enter a name for your resume
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && name.trim() && onConfirm(name.trim())
          }
          autoFocus
          placeholder="e.g. My-Resume"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1.5px solid #2563eb",
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            marginBottom: 18,
          }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              color: "#374151",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onConfirm(name.trim())}
            disabled={!name.trim()}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: name.trim() ? "#2563eb" : "#93c5fd",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: name.trim() ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}
          >
            Save Resume ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({ score, size = 80 }) {
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const r = size * 0.4;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={size * 0.09}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.09}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: size * 0.24,
            fontWeight: 800,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: size * 0.11,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Score
        </span>
      </div>
    </div>
  );
}

// ─── UI Atoms ─────────────────────────────────────────────────────────────────
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
}) {
  const [focused, setFocused] = useState(false);
  const s = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: `1.5px solid ${focused ? "#2563eb" : "#e5e7eb"}`,
    fontSize: 13,
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    resize: multiline ? "vertical" : "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    minHeight: multiline ? 90 : "auto",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            color: "#374151",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={s}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={s}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        padding: 18,
        marginBottom: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 16px",
        borderRadius: 8,
        border: "1.5px dashed #2563eb",
        background: "#eff6ff",
        color: "#2563eb",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        width: "100%",
        justifyContent: "center",
        fontFamily: "inherit",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
      {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 6,
        border: "none",
        background: "#fee2e2",
        color: "#dc2626",
        fontSize: 12,
        cursor: "pointer",
        fontWeight: 600,
        fontFamily: "inherit",
      }}
    >
      ✕ Remove
    </button>
  );
}

function LoadingOverlay({ message, subMessage }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "44px 52px",
          textAlign: "center",
          maxWidth: 420,
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 20px",
            borderRadius: "50%",
            border: "5px solid #e5e7eb",
            borderTop: "5px solid #2563eb",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#111",
            marginBottom: 8,
          }}
        >
          {message}
        </div>
        {subMessage && (
          <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
            {subMessage}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ATS Tips Panel ───────────────────────────────────────────────────────────
function ATSTipsPanel({ userId, resume, onClose }) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    userService
      .aiGetAtsTips(userId, resume)
      .then((res) => {
        setTips(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to get ATS tips.");
        setLoading(false);
      });
  }, []);

  const typeStyle = {
    error: { bg: "#fee2e2", color: "#dc2626", icon: "❌" },
    warning: { bg: "#fef9c3", color: "#ca8a04", icon: "⚠️" },
    success: { bg: "#dcfce7", color: "#16a34a", icon: "✅" },
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 36,
          width: 560,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#111",
              }}
            >
              🎯 ATS Analysis
            </h2>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
              AI-powered resume optimisation tips
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            Close ✕
          </button>
        </div>
        {loading && (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p>AI is analysing your resume…</p>
          </div>
        )}
        {error && (
          <div
            style={{
              padding: "16px",
              background: "#fee2e2",
              color: "#dc2626",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        {!loading && tips && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#f8fafc",
                borderRadius: 14,
                padding: "18px 22px",
                marginBottom: 22,
              }}
            >
              <ScoreCircle score={tips.score || 0} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>
                  ATS Compatibility Score
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                  {tips.score >= 80
                    ? "Excellent! Recruiter systems will love this."
                    : tips.score >= 50
                      ? "Good, but a few improvements will help."
                      : "Needs work to pass ATS filters."}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(tips.tips || []).map((tip, i) => {
                const st = typeStyle[tip.type] || typeStyle.warning;
                return (
                  <div
                    key={i}
                    style={{
                      background: st.bg,
                      borderRadius: 10,
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <span>{st.icon}</span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: st.color,
                        }}
                      >
                        {tip.title}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#374151",
                        lineHeight: 1.5,
                      }}
                    >
                      {tip.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AI Generate Modal (with Experience Level) ────────────────────────────────
function AIGenerateModal({ userId, onClose, onApply }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [template, setTemplate] = useState("summit");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("mid");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadMsg, setLoadMsg] = useState("");

  const chosenLevel =
    EXPERIENCE_LEVELS.find((l) => l.id === selectedLevel) ||
    EXPERIENCE_LEVELS[2];

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      setError("Please enter a target job title");
      return;
    }
    setLoading(true);
    setError("");
    setLoadMsg("✨ AI is generating your complete resume…");
    setTimeout(
      () => setLoadMsg("📝 Writing ATS-optimised profile summary…"),
      12000,
    );
    setTimeout(
      () => setLoadMsg("✍️ Building skills, projects & certifications…"),
      25000,
    );
    try {
      const res = await userService.aiGenerateResume(
        userId,
        name,
        email,
        "",
        jobTitle,
        chosenLevel.years,
        skills,
        template,
      );
      const data = res.data;
      data.templateName = template;
      onApply(data);
      onClose();
    } catch (e) {
      setError(
        e?.response?.data?.message || "AI generation failed. Please try again.",
      );
      setLoading(false);
    }
  };

  if (loading)
    return (
      <LoadingOverlay
        message="AI is building your resume…"
        subMessage={loadMsg}
      />
    );

  const btnStyle = (primary, color = "#2563eb") => ({
    flex: primary ? 2 : 1,
    padding: "11px",
    borderRadius: 10,
    border: primary ? "none" : "1.5px solid #e5e7eb",
    background: primary ? color : "#fff",
    color: primary ? "#fff" : "#374151",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  });

  const StepBar = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        marginBottom: 28,
      }}
    >
      {[1, 2, 3].map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background:
                step >= n
                  ? "linear-gradient(135deg,#7c3aed,#2563eb)"
                  : "#e5e7eb",
              color: step >= n ? "#fff" : "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              boxShadow: step === n ? "0 0 0 4px rgba(37,99,235,0.15)" : "none",
            }}
          >
            {step > n ? "✓" : n}
          </div>
          {n < 3 && (
            <div
              style={{
                width: 40,
                height: 2,
                background: step > n ? "#2563eb" : "#e5e7eb",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const errBox = error && (
    <div
      style={{
        padding: "10px 14px",
        background: "#fee2e2",
        color: "#dc2626",
        borderRadius: 8,
        fontSize: 12,
        marginBottom: 12,
      }}
    >
      {error}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "36px 40px",
          width: 560,
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <StepBar />
        {step === 1 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>👤</div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111",
                }}
              >
                Who are you?
              </h2>
              <p style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
                Basic details to personalise your resume.
              </p>
            </div>
            <Input
              label="Your Full Name *"
              value={name}
              onChange={setName}
              placeholder="e.g. Rahul Sharma"
            />
            <Input
              label="Your Email *"
              value={email}
              onChange={setEmail}
              placeholder="e.g. rahul@email.com"
              type="email"
            />
            {errBox}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={onClose} style={btnStyle(false)}>
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!name.trim() || !email.trim()) {
                    setError("Please enter your name and email");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                style={btnStyle(true)}
              >
                Continue →
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🎨</div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111",
                }}
              >
                Choose a Template
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  style={{
                    border: `2px solid ${template === t.id ? t.accent : "#e5e7eb"}`,
                    borderRadius: 8,
                    background: template === t.id ? t.accent + "15" : "#fff",
                    cursor: "pointer",
                    padding: "8px 4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: t.accent,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: template === t.id ? t.accent : "#374151",
                    }}
                  >
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
            {errBox}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
                style={btnStyle(false)}
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  setError("");
                  setStep(3);
                }}
                style={btnStyle(true)}
              >
                Continue →
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🎯</div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111",
                }}
              >
                Target Role
              </h2>
              <p style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
                AI will generate a complete ATS-optimised resume.
              </p>
            </div>
            <Input
              label="Target Job Title *"
              value={jobTitle}
              onChange={setJobTitle}
              placeholder="e.g. Full Stack Developer"
            />
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Experience Level
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `2px solid ${selectedLevel === lvl.id ? "#2563eb" : "#e5e7eb"}`,
                      background: selectedLevel === lvl.id ? "#eff6ff" : "#fff",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: `2px solid ${selectedLevel === lvl.id ? "#2563eb" : "#d1d5db"}`,
                          background:
                            selectedLevel === lvl.id ? "#2563eb" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {selectedLevel === lvl.id && (
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#fff",
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color:
                              selectedLevel === lvl.id ? "#1d4ed8" : "#111",
                          }}
                        >
                          {lvl.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            marginTop: 1,
                          }}
                        >
                          {lvl.desc}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        background:
                          selectedLevel === lvl.id ? "#dbeafe" : "#f3f4f6",
                        color: selectedLevel === lvl.id ? "#1d4ed8" : "#6b7280",
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        marginLeft: 8,
                      }}
                    >
                      {lvl.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Key Skills (comma-separated)"
              value={skills}
              onChange={setSkills}
              placeholder="e.g. React, Java, MySQL, AWS"
            />
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 14,
                fontSize: 12,
                color: "#1e40af",
              }}
            >
              ✨ AI will generate resume tailored for{" "}
              <strong>{chosenLevel.label}</strong> ({chosenLevel.badge}) —
              polished summary,{" "}
              {chosenLevel.years === "0"
                ? "internship-ready content"
                : `${chosenLevel.years} years experience`}
              , 14 skills, 3 projects & 2 certifications.
            </div>
            {errBox}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={() => {
                  setError("");
                  setStep(2);
                }}
                style={btnStyle(false)}
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                style={btnStyle(
                  true,
                  "linear-gradient(135deg,#7c3aed,#2563eb)",
                )}
              >
                ✨ Generate Full Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LinkedIn PDF Import Modal ────────────────────────────────────────────────
// User downloads their LinkedIn PDF and uploads it here instead of providing a URL.
// Step 1: Upload the LinkedIn-exported PDF
// Step 2: Choose target job title + skill set (dropdown) + custom skills
function LinkedInScrapeModal({ userId, onClose, onApply }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [base64Pdf, setBase64Pdf] = useState("");

  // Step 2 fields
  const [jobTitle, setJobTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("None / Custom");
  const [skillPool, setSkillPool] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [template, setTemplate] = useState("summit");

  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10 MB.");
      return;
    }
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target.result.split(",")[1];
      setBase64Pdf(b64);
      setStep(2);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const pool = SKILL_SETS[cat] || [];
    setSkillPool(pool);
    setSelectedSkills([...pool]); // pre-select all
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (!s) return;
    if (!skillPool.includes(s)) setSkillPool((p) => [...p, s]);
    if (!selectedSkills.includes(s)) setSelectedSkills((p) => [...p, s]);
    setCustomSkill("");
  };

  const handleImport = async () => {
    if (!base64Pdf) {
      setError("Please upload your LinkedIn PDF first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Pass PDF as base64 + extra metadata via linkedInScrape service call
      // userService.linkedInScrape should accept (userId, url, jobTitle, extraSkills, template, base64Pdf, fileName)
      const res = await userService.linkedInScrape(
        userId,
        null, // no URL anymore
        jobTitle,
        selectedSkills.join(", "),
        template,
        base64Pdf, // LinkedIn PDF data
        fileName,
      );
      const data = res.data;
      data.templateName = template;
      onApply(data);
      onClose();
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Import failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <LoadingOverlay
        message="Reading your LinkedIn PDF…"
        subMessage="AI is extracting your work history, education, skills and more. This may take 30–60s."
      />
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: 580,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
        }}
      >
        {/* Gradient Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#0077b5,#0891b2)",
            borderRadius: "20px 20px 0 0",
            padding: "24px 28px",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                🔗 Import from LinkedIn
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.85 }}>
                {step === 1
                  ? "Upload your LinkedIn profile PDF"
                  : "Customize your import settings"}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 13,
                color: "#fff",
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              ✕
            </button>
          </div>
          {/* Step dots */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            {[1, 2].map((n) => (
              <div
                key={n}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: step >= n ? "#fff" : "rgba(255,255,255,0.3)",
                    color: step >= n ? "#0077b5" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {step > n ? "✓" : n}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    opacity: step >= n ? 1 : 0.6,
                    fontWeight: 600,
                  }}
                >
                  {n === 1 ? "Upload PDF" : "Customize"}
                </span>
                {n < 2 && (
                  <div
                    style={{
                      width: 24,
                      height: 1.5,
                      background: "rgba(255,255,255,0.4)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "28px 28px 24px" }}>
          {/* ── STEP 1: PDF Upload ── */}
          {step === 1 && (
            <>
              {/* How-to hint */}
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  fontSize: 12,
                  color: "#1e40af",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  📥 How to download your LinkedIn PDF:
                </div>
                <ol style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Go to your LinkedIn profile page</li>
                  <li>
                    Click <strong>"More"</strong> →{" "}
                    <strong>"Save to PDF"</strong>
                  </li>
                  <li>Upload that downloaded PDF below ↓</li>
                </ol>
              </div>

              <div
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                style={{
                  border: `2.5px dashed ${dragging ? "#0077b5" : "#d1d5db"}`,
                  borderRadius: 14,
                  padding: "48px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragging ? "#eff6ff" : "#f9fafb",
                  transition: "all 0.2s",
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div style={{ fontSize: 52, marginBottom: 14 }}>🔗</div>
                <p
                  style={{
                    fontWeight: 700,
                    color: "#111",
                    margin: "0 0 6px",
                    fontSize: 15,
                  }}
                >
                  Drop your LinkedIn PDF here
                </p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
                  or click to browse · PDF only · Max 10 MB
                </p>
              </div>

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: 8,
                    fontSize: 12,
                    marginTop: 12,
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "1.5px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => fileRef.current.click()}
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#0077b5,#0891b2)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  📎 Choose LinkedIn PDF
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Customize ── */}
          {step === 2 && (
            <>
              {/* Uploaded file badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 13, color: "#065f46" }}
                  >
                    PDF uploaded successfully
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    {fileName}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setStep(1);
                    setBase64Pdf("");
                    setFileName("");
                  }}
                  style={{
                    marginLeft: "auto",
                    border: "none",
                    background: "transparent",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                >
                  Change
                </button>
              </div>

              {/* Target Job Title */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 5,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Target Job Title (optional)
                </label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Developer"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #e5e7eb",
                    fontSize: 13,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Skill Set Dropdown */}
              <div
                style={{
                  marginBottom: selectedCategory !== "None / Custom" ? 12 : 16,
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 5,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Skill Set / Tech Stack
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #e5e7eb",
                    fontSize: 13,
                    background: "#fff",
                    fontFamily: "inherit",
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  {Object.keys(SKILL_SETS).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skill Pills */}
              {skillPool.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#374151",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Select Skills to Include
                    </label>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setSelectedSkills([...skillPool])}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#2563eb",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Select All
                      </button>
                      <span style={{ color: "#d1d5db" }}>|</span>
                      <button
                        onClick={() => setSelectedSkills([])}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#6b7280",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 7,
                      maxHeight: 160,
                      overflowY: "auto",
                      padding: "4px 0",
                    }}
                  >
                    {skillPool.map((skill) => {
                      const sel = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 999,
                            border: "1.5px solid",
                            borderColor: sel ? "#2563eb" : "#e5e7eb",
                            background: sel ? "#eff6ff" : "#fff",
                            color: sel ? "#2563eb" : "#374151",
                            fontSize: 12,
                            fontWeight: sel ? 700 : 500,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}
                        >
                          {sel && <span style={{ marginRight: 4 }}>✓</span>}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom skill */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 5,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Add Custom Skill
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                    placeholder="e.g. Kafka, Redis, GraphQL…"
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1.5px solid #e5e7eb",
                      fontSize: 13,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={addCustomSkill}
                    style={{
                      padding: "9px 18px",
                      borderRadius: 8,
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {selectedSkills.length > 0 && (
                <div
                  style={{ marginBottom: 14, fontSize: 12, color: "#6b7280" }}
                >
                  <span style={{ fontWeight: 700, color: "#2563eb" }}>
                    {selectedSkills.length}
                  </span>{" "}
                  skills selected to include in your resume
                </div>
              )}

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: 8,
                    fontSize: 12,
                    marginBottom: 12,
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "1.5px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleImport}
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#0077b5,#0891b2)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  🔗 Generate Resume from LinkedIn Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PDF Upload Modal ─────────────────────────────────────────────────────────
function PDFUploadModal({ userId, onClose, onApply }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10 MB.");
      return;
    }
    setLoading(true);
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      try {
        const res = await userService.aiParsePdf(userId, base64, file.name);
        onApply(res.data);
        onClose();
      } catch {
        setError(
          "Could not extract data. Please try a text-based PDF (not scanned).",
        );
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  if (loading)
    return (
      <LoadingOverlay
        message="AI is reading your resume…"
        subMessage={`Extracting all sections from ${fileName}. This may take 20–40 seconds.`}
      />
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 36,
          width: 500,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📄</div>
          <h2
            style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111" }}
          >
            Upload Your Resume
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
            AI extracts every job, skill, education, project and certification
            from your PDF.
          </p>
        </div>
        <div
          onClick={() => !loading && fileRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          style={{
            border: `2.5px dashed ${dragging ? "#2563eb" : "#d1d5db"}`,
            borderRadius: 14,
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "#eff6ff" : "#f9fafb",
            transition: "all 0.2s",
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: 44, marginBottom: 14 }}>📤</div>
          <p
            style={{
              fontWeight: 700,
              color: "#111",
              margin: "0 0 6px",
              fontSize: 15,
            }}
          >
            Drop PDF here or click to browse
          </p>
          <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
            PDF only · Max 10 MB · Text-based PDFs work best
          </p>
        </div>
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "#fee2e2",
              color: "#dc2626",
              borderRadius: 8,
              fontSize: 12,
              marginTop: 12,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              color: "#374151",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => fileRef.current.click()}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#059669,#0891b2)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            📤 Choose PDF File
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Editor Panels ────────────────────────────────────────────────────
function PersonalPanel({ r, set }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 12px",
        }}
      >
        <Input
          label="First Name"
          value={r.firstName}
          onChange={(v) => set({ ...r, firstName: v })}
          placeholder="John"
        />
        <Input
          label="Last Name"
          value={r.lastName}
          onChange={(v) => set({ ...r, lastName: v })}
          placeholder="Doe"
        />
      </div>
      <Input
        label="Job Title / Profession"
        value={r.jobTitle}
        onChange={(v) => set({ ...r, jobTitle: v })}
        placeholder="Full Stack Developer"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 12px",
        }}
      >
        <Input
          label="Email"
          value={r.email}
          onChange={(v) => set({ ...r, email: v })}
          placeholder="john@email.com"
          type="email"
        />
        <Input
          label="Phone"
          value={r.phone}
          onChange={(v) => set({ ...r, phone: v })}
          placeholder="+91 9999999999"
        />
        <Input
          label="City"
          value={r.city}
          onChange={(v) => set({ ...r, city: v })}
          placeholder="Hyderabad"
        />
        <Input
          label="Country"
          value={r.country}
          onChange={(v) => set({ ...r, country: v })}
          placeholder="India"
        />
      </div>
      <Input
        label="LinkedIn URL"
        value={r.linkedinUrl}
        onChange={(v) => set({ ...r, linkedinUrl: v })}
        placeholder="linkedin.com/in/johndoe"
      />
      <Input
        label="GitHub URL"
        value={r.githubUrl}
        onChange={(v) => set({ ...r, githubUrl: v })}
        placeholder="github.com/johndoe"
      />
      <Input
        label="Portfolio URL"
        value={r.portfolioUrl}
        onChange={(v) => set({ ...r, portfolioUrl: v })}
        placeholder="johndoe.dev"
      />
    </div>
  );
}

function ProfilePanel({ r, set }) {
  const wc = (r.profileSummary || "").split(/\s+/).filter(Boolean).length;
  return (
    <div>
      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
        Write 4–5 sentences. Include your job title, years of experience, key
        skills, and what you offer.
      </p>
      <Input
        multiline
        label="Professional Summary"
        value={r.profileSummary}
        onChange={(v) => set({ ...r, profileSummary: v })}
        placeholder="A results-driven Full Stack Developer with 3+ years…"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#9ca3af",
        }}
      >
        <span>Word count: {wc}</span>
        <span
          style={{
            color: wc >= 50 ? "#10b981" : wc >= 30 ? "#f59e0b" : "#ef4444",
          }}
        >
          {wc >= 50 ? "✓ Good length" : wc >= 30 ? "↑ Add more" : "Too short"}
        </span>
      </div>
    </div>
  );
}

function ExperiencePanel({ r, set }) {
  const add = () =>
    set({
      ...r,
      workExperiences: [
        ...r.workExperiences,
        {
          id: Date.now(),
          companyName: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          location: "",
          description: "",
          displayOrder: r.workExperiences.length,
        },
      ],
    });
  const upd = (i, f, v) => {
    const a = [...r.workExperiences];
    a[i] = { ...a[i], [f]: v };
    set({ ...r, workExperiences: a });
  };
  const del = (i) => {
    const a = [...r.workExperiences];
    a.splice(i, 1);
    set({ ...r, workExperiences: a });
  };
  return (
    <div>
      {r.workExperiences.map((we, i) => (
        <Card key={we.id || i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>
              Experience #{i + 1}
            </span>
            <RemoveBtn onClick={() => del(i)} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 12px",
            }}
          >
            <Input
              label="Company"
              value={we.companyName}
              onChange={(v) => upd(i, "companyName", v)}
              placeholder="Google"
            />
            <Input
              label="Position"
              value={we.position}
              onChange={(v) => upd(i, "position", v)}
              placeholder="Senior Engineer"
            />
            <Input
              label="Start Date"
              value={we.startDate}
              onChange={(v) => upd(i, "startDate", v)}
              placeholder="Jan 2022"
            />
            <Input
              label="End Date"
              value={we.isCurrent ? "" : we.endDate}
              onChange={(v) => upd(i, "endDate", v)}
              placeholder="Dec 2024"
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <input
              type="checkbox"
              checked={we.isCurrent}
              onChange={(e) => upd(i, "isCurrent", e.target.checked)}
              id={`curr-${i}`}
            />
            <label
              htmlFor={`curr-${i}`}
              style={{ fontSize: 12, color: "#374151" }}
            >
              Currently working here
            </label>
          </div>
          <Input
            label="Location"
            value={we.location}
            onChange={(v) => upd(i, "location", v)}
            placeholder="Bangalore, India"
          />
          <Input
            multiline
            label="Key Responsibilities / Achievements"
            value={we.description}
            onChange={(v) => upd(i, "description", v)}
            placeholder={
              "• Led development of…\n• Improved performance by 40%…"
            }
          />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Work Experience" />
    </div>
  );
}

function EducationPanel({ r, set }) {
  const add = () =>
    set({
      ...r,
      educations: [
        ...r.educations,
        {
          id: Date.now(),
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          grade: "",
          description: "",
          displayOrder: r.educations.length,
        },
      ],
    });
  const upd = (i, f, v) => {
    const a = [...r.educations];
    a[i] = { ...a[i], [f]: v };
    set({ ...r, educations: a });
  };
  const del = (i) => {
    const a = [...r.educations];
    a.splice(i, 1);
    set({ ...r, educations: a });
  };
  return (
    <div>
      {r.educations.map((edu, i) => (
        <Card key={edu.id || i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>
              Education #{i + 1}
            </span>
            <RemoveBtn onClick={() => del(i)} />
          </div>
          <Input
            label="Institution"
            value={edu.institution}
            onChange={(v) => upd(i, "institution", v)}
            placeholder="IIT Bombay"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 12px",
            }}
          >
            <Input
              label="Degree"
              value={edu.degree}
              onChange={(v) => upd(i, "degree", v)}
              placeholder="B.Tech"
            />
            <Input
              label="Field of Study"
              value={edu.fieldOfStudy}
              onChange={(v) => upd(i, "fieldOfStudy", v)}
              placeholder="Computer Science"
            />
            <Input
              label="Start Year"
              value={edu.startDate}
              onChange={(v) => upd(i, "startDate", v)}
              placeholder="2018"
            />
            <Input
              label="End Year"
              value={edu.endDate}
              onChange={(v) => upd(i, "endDate", v)}
              placeholder="2022"
            />
            <Input
              label="Grade / CGPA"
              value={edu.grade}
              onChange={(v) => upd(i, "grade", v)}
              placeholder="8.5 / 10"
            />
          </div>
          <Input
            multiline
            label="Description (optional)"
            value={edu.description}
            onChange={(v) => upd(i, "description", v)}
            placeholder="Relevant coursework: Algorithms, DBMS…"
          />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Education" />
    </div>
  );
}

function SkillsPanel({ r, set }) {
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState("INTERMEDIATE");
  const add = () => {
    if (!newSkill.trim()) return;
    set({
      ...r,
      skills: [
        ...r.skills,
        {
          id: Date.now(),
          skillName: newSkill.trim(),
          proficiencyLevel: newLevel,
          displayOrder: r.skills.length,
        },
      ],
    });
    setNewSkill("");
  };
  const del = (i) => {
    const a = [...r.skills];
    a.splice(i, 1);
    set({ ...r, skills: a });
  };
  const updLvl = (i, v) => {
    const a = [...r.skills];
    a[i] = { ...a[i], proficiencyLevel: v };
    set({ ...r, skills: a });
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g. React, Java, AWS…"
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: 8,
            border: "1.5px solid #e5e7eb",
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <select
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
          style={{
            padding: "9px 12px",
            borderRadius: 8,
            border: "1.5px solid #e5e7eb",
            fontSize: 12,
            background: "#fff",
            fontFamily: "inherit",
          }}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={add}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Add
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {r.skills.map((s, i) => (
          <div
            key={s.id || i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              background: "#f1f5f9",
              border: `1.5px solid ${LEVEL_COLOR[s.proficiencyLevel] || "#e5e7eb"}`,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>
              {s.skillName}
            </span>
            <select
              value={s.proficiencyLevel}
              onChange={(e) => updLvl(i, e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 10,
                color: LEVEL_COLOR[s.proficiencyLevel],
                fontWeight: 700,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <button
              onClick={() => del(i)}
              style={{
                border: "none",
                background: "none",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {r.skills.length === 0 && (
        <p
          style={{
            color: "#9ca3af",
            fontSize: 12,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          No skills added yet.
        </p>
      )}
    </div>
  );
}

function ProjectsPanel({ r, set }) {
  const add = () =>
    set({
      ...r,
      projects: [
        ...r.projects,
        {
          id: Date.now(),
          projectName: "",
          techStack: "",
          projectUrl: "",
          startDate: "",
          endDate: "",
          description: "",
          displayOrder: r.projects.length,
        },
      ],
    });
  const upd = (i, f, v) => {
    const a = [...r.projects];
    a[i] = { ...a[i], [f]: v };
    set({ ...r, projects: a });
  };
  const del = (i) => {
    const a = [...r.projects];
    a.splice(i, 1);
    set({ ...r, projects: a });
  };
  return (
    <div>
      {r.projects.map((proj, i) => (
        <Card key={proj.id || i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>
              Project #{i + 1}
            </span>
            <RemoveBtn onClick={() => del(i)} />
          </div>
          <Input
            label="Project Name"
            value={proj.projectName}
            onChange={(v) => upd(i, "projectName", v)}
            placeholder="E-Commerce Platform"
          />
          <Input
            label="Tech Stack"
            value={proj.techStack}
            onChange={(v) => upd(i, "techStack", v)}
            placeholder="React, Spring Boot, MySQL"
          />
          <Input
            label="Project URL"
            value={proj.projectUrl}
            onChange={(v) => upd(i, "projectUrl", v)}
            placeholder="github.com/john/project"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 12px",
            }}
          >
            <Input
              label="Start Date"
              value={proj.startDate}
              onChange={(v) => upd(i, "startDate", v)}
              placeholder="Mar 2023"
            />
            <Input
              label="End Date"
              value={proj.endDate}
              onChange={(v) => upd(i, "endDate", v)}
              placeholder="Jun 2023"
            />
          </div>
          <Input
            multiline
            label="Description"
            value={proj.description}
            onChange={(v) => upd(i, "description", v)}
            placeholder="Built a full-stack e-commerce platform…"
          />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Project" />
    </div>
  );
}

function CertsPanel({ r, set }) {
  const add = () =>
    set({
      ...r,
      certifications: [
        ...r.certifications,
        {
          id: Date.now(),
          certName: "",
          issuingOrganization: "",
          issueDate: "",
          expiryDate: "",
          credentialId: "",
          credentialUrl: "",
          displayOrder: r.certifications.length,
        },
      ],
    });
  const upd = (i, f, v) => {
    const a = [...r.certifications];
    a[i] = { ...a[i], [f]: v };
    set({ ...r, certifications: a });
  };
  const del = (i) => {
    const a = [...r.certifications];
    a.splice(i, 1);
    set({ ...r, certifications: a });
  };
  return (
    <div>
      {r.certifications.map((cert, i) => (
        <Card key={cert.id || i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>
              Certification #{i + 1}
            </span>
            <RemoveBtn onClick={() => del(i)} />
          </div>
          <Input
            label="Certification Name"
            value={cert.certName}
            onChange={(v) => upd(i, "certName", v)}
            placeholder="AWS Solutions Architect"
          />
          <Input
            label="Issuing Organization"
            value={cert.issuingOrganization}
            onChange={(v) => upd(i, "issuingOrganization", v)}
            placeholder="Amazon Web Services"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 12px",
            }}
          >
            <Input
              label="Issue Date"
              value={cert.issueDate}
              onChange={(v) => upd(i, "issueDate", v)}
              placeholder="Jan 2024"
            />
            <Input
              label="Expiry Date"
              value={cert.expiryDate}
              onChange={(v) => upd(i, "expiryDate", v)}
              placeholder="Jan 2027"
            />
          </div>
          <Input
            label="Credential ID"
            value={cert.credentialId}
            onChange={(v) => upd(i, "credentialId", v)}
            placeholder="AWS-12345"
          />
          <Input
            label="Credential URL"
            value={cert.credentialUrl}
            onChange={(v) => upd(i, "credentialUrl", v)}
            placeholder="credly.com/badges/…"
          />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Certification" />
    </div>
  );
}

// ─── Resume Preview ───────────────────────────────────────────────────────────
function SectionHeader({ title, accent }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 2,
        color: accent,
        borderBottom: `2px solid ${accent}`,
        paddingBottom: 3,
        marginBottom: 8,
      }}
    >
      {title}
    </div>
  );
}

function ResumePreview({ r, id }) {
  const tmpl = TEMPLATES.find((t) => t.id === r.templateName) || TEMPLATES[0];
  const { accent, bg, sidebar } = tmpl;
  const fullName =
    `${r.firstName || ""} ${r.lastName || ""}`.trim() || "Your Name";

  if (sidebar) {
    return (
      <div
        id={id}
        style={{
          background: bg,
          fontFamily: "'Georgia', serif",
          fontSize: 10,
          lineHeight: 1.55,
          display: "flex",
          minHeight: 1123,
        }}
      >
        <div
          style={{
            width: "33%",
            background: accent,
            color: "#fff",
            padding: "32px 18px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "3px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {(r.firstName || "")[0]}
            {(r.lastName || "")[0]}
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 2,
              lineHeight: 1.2,
            }}
          >
            {fullName}
          </div>
          {r.jobTitle && (
            <div
              style={{
                fontSize: 10,
                opacity: 0.8,
                marginBottom: 18,
                fontStyle: "italic",
              }}
            >
              {r.jobTitle}
            </div>
          )}
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              opacity: 0.7,
              marginBottom: 6,
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              paddingBottom: 3,
            }}
          >
            Contact
          </div>
          {[
            r.email && `✉  ${r.email}`,
            r.phone && `☎  ${r.phone}`,
            r.city && `📍  ${r.city}${r.country ? `, ${r.country}` : ""}`,
            r.linkedinUrl && `in  ${r.linkedinUrl}`,
            r.githubUrl && `⌥  ${r.githubUrl}`,
            r.portfolioUrl && `🌐  ${r.portfolioUrl}`,
          ]
            .filter(Boolean)
            .map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 9,
                  marginBottom: 4,
                  opacity: 0.9,
                  wordBreak: "break-all",
                }}
              >
                {line}
              </div>
            ))}
          {r.skills.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  opacity: 0.7,
                  margin: "16px 0 6px",
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  paddingBottom: 3,
                }}
              >
                Skills
              </div>
              {r.skills.map((s, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 9,
                      marginBottom: 2,
                    }}
                  >
                    <span>{s.skillName}</span>
                    <span style={{ opacity: 0.7, fontSize: 8 }}>
                      {s.proficiencyLevel}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.9)",
                        width: `${LEVEL_PCT[s.proficiencyLevel] || 50}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
          {r.certifications.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  opacity: 0.7,
                  margin: "16px 0 6px",
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  paddingBottom: 3,
                }}
              >
                Certifications
              </div>
              {r.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700 }}>
                    {c.certName}
                  </div>
                  <div style={{ fontSize: 8, opacity: 0.75 }}>
                    {c.issuingOrganization}
                  </div>
                  {c.issueDate && (
                    <div style={{ fontSize: 8, opacity: 0.65 }}>
                      {c.issueDate}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        <div style={{ flex: 1, padding: "32px 24px" }}>
          {r.profileSummary && (
            <div style={{ marginBottom: 16 }}>
              <SectionHeader title="Profile" accent={accent} />
              <div style={{ fontSize: 10, color: "#374151", lineHeight: 1.65 }}>
                {r.profileSummary}
              </div>
            </div>
          )}
          {r.workExperiences.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionHeader title="Work Experience" accent={accent} />
              {r.workExperiences.map((we, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{ fontWeight: 700, fontSize: 11, color: "#111" }}
                    >
                      {we.position}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        marginLeft: 8,
                      }}
                    >
                      {we.startDate}
                      {we.startDate || we.endDate ? " – " : ""}
                      {we.isCurrent ? "Present" : we.endDate}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: accent,
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    {we.companyName}
                    {we.location ? ` · ${we.location}` : ""}
                  </div>
                  {we.description && (
                    <div
                      style={{
                        fontSize: 9,
                        color: "#374151",
                        whiteSpace: "pre-line",
                        lineHeight: 1.6,
                      }}
                    >
                      {we.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {r.educations.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionHeader title="Education" accent={accent} />
              {r.educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 11 }}>
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </span>
                    <span style={{ fontSize: 9, color: "#6b7280" }}>
                      {edu.startDate}
                      {edu.startDate || edu.endDate ? " – " : ""}
                      {edu.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: accent }}>
                    {edu.institution}
                    {edu.grade ? ` · CGPA: ${edu.grade}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
          {r.projects.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionHeader title="Projects" accent={accent} />
              {r.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 11 }}>
                      {proj.projectName}
                    </span>
                    {proj.projectUrl && (
                      <span style={{ fontSize: 9, color: accent }}>
                        {proj.projectUrl}
                      </span>
                    )}
                  </div>
                  {proj.techStack && (
                    <div
                      style={{
                        fontSize: 9,
                        color: "#6b7280",
                        fontStyle: "italic",
                        marginBottom: 2,
                      }}
                    >
                      Tech: {proj.techStack}
                    </div>
                  )}
                  {proj.description && (
                    <div
                      style={{ fontSize: 9, color: "#374151", lineHeight: 1.6 }}
                    >
                      {proj.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      style={{
        background: bg,
        fontFamily: "'Georgia', serif",
        fontSize: 10,
        lineHeight: 1.55,
        padding: "36px 36px 30px",
        minHeight: 1123,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          borderBottom: `3px solid ${accent}`,
          paddingBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#111",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {fullName}
        </div>
        {r.jobTitle && (
          <div
            style={{
              fontSize: 12,
              color: accent,
              fontWeight: 600,
              marginTop: 3,
            }}
          >
            {r.jobTitle}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          {r.email && (
            <span style={{ fontSize: 9, color: "#374151" }}>✉ {r.email}</span>
          )}
          {r.phone && (
            <span style={{ fontSize: 9, color: "#374151" }}>☎ {r.phone}</span>
          )}
          {r.city && (
            <span style={{ fontSize: 9, color: "#374151" }}>
              📍 {r.city}
              {r.country ? `, ${r.country}` : ""}
            </span>
          )}
          {r.linkedinUrl && (
            <span style={{ fontSize: 9, color: accent }}>
              in {r.linkedinUrl}
            </span>
          )}
          {r.githubUrl && (
            <span style={{ fontSize: 9, color: accent }}>⌥ {r.githubUrl}</span>
          )}
          {r.portfolioUrl && (
            <span style={{ fontSize: 9, color: accent }}>
              🌐 {r.portfolioUrl}
            </span>
          )}
        </div>
      </div>
      {r.profileSummary && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Profile Summary" accent={accent} />
          <div style={{ fontSize: 10, color: "#374151", lineHeight: 1.65 }}>
            {r.profileSummary}
          </div>
        </div>
      )}
      {r.workExperiences.filter((we) => we.companyName || we.position).length >
        0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Work Experience" accent={accent} />
          {r.workExperiences
            .filter((we) => we.companyName || we.position)
            .map((we, i) => (
              <div key={i} style={{ marginBottom: 13 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{ fontWeight: 700, fontSize: 11, color: "#111" }}
                  >
                    {we.position}
                    {we.companyName ? ` — ${we.companyName}` : ""}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                      marginLeft: 8,
                    }}
                  >
                    {we.startDate}
                    {we.startDate || we.endDate ? " – " : ""}
                    {we.isCurrent ? "Present" : we.endDate}
                  </span>
                </div>
                {we.location && (
                  <div
                    style={{ fontSize: 9, color: "#6b7280", marginBottom: 3 }}
                  >
                    {we.location}
                  </div>
                )}
                {we.description && (
                  <div
                    style={{
                      fontSize: 9.5,
                      color: "#374151",
                      whiteSpace: "pre-line",
                      lineHeight: 1.65,
                      marginTop: 3,
                    }}
                  >
                    {we.description}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
      {r.educations.filter((e) => e.institution || e.degree).length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Education" accent={accent} />
          {r.educations
            .filter((e) => e.institution || e.degree)
            .map((edu, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 9,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div style={{ fontSize: 10, color: "#374151" }}>
                    {edu.institution}
                  </div>
                  {edu.description && (
                    <div
                      style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}
                    >
                      {edu.description}
                    </div>
                  )}
                </div>
                <div
                  style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}
                >
                  <div style={{ fontSize: 9, color: "#6b7280" }}>
                    {edu.startDate}
                    {edu.startDate || edu.endDate ? " – " : ""}
                    {edu.endDate}
                  </div>
                  {edu.grade && (
                    <div
                      style={{ fontSize: 9, color: accent, fontWeight: 600 }}
                    >
                      CGPA: {edu.grade}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
      {r.skills.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Technical Skills" accent={accent} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {r.skills.map((s, i) => (
              <span
                key={i}
                style={{
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: `${accent}18`,
                  border: `1px solid ${accent}40`,
                  fontSize: 9.5,
                  color: "#374151",
                  fontWeight: 500,
                }}
              >
                {s.skillName}
                <span
                  style={{
                    marginLeft: 4,
                    color: LEVEL_COLOR[s.proficiencyLevel],
                    fontSize: 8,
                    fontWeight: 700,
                  }}
                >
                  {s.proficiencyLevel === "EXPERT"
                    ? "★★★★"
                    : s.proficiencyLevel === "ADVANCED"
                      ? "★★★☆"
                      : s.proficiencyLevel === "INTERMEDIATE"
                        ? "★★☆☆"
                        : "★☆☆☆"}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
      {r.projects.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Projects" accent={accent} />
          {r.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 11 }}>
                  {proj.projectName}
                </span>
                {proj.projectUrl && (
                  <span style={{ fontSize: 9, color: accent }}>
                    {proj.projectUrl}
                  </span>
                )}
              </div>
              {proj.techStack && (
                <div
                  style={{
                    fontSize: 9,
                    color: "#6b7280",
                    fontStyle: "italic",
                    marginBottom: 2,
                  }}
                >
                  Tech: {proj.techStack}
                  {(proj.startDate || proj.endDate) && (
                    <span style={{ marginLeft: 10 }}>
                      {proj.startDate}
                      {proj.startDate && proj.endDate ? " – " : ""}
                      {proj.endDate}
                    </span>
                  )}
                </div>
              )}
              {proj.description && (
                <div
                  style={{
                    fontSize: 9.5,
                    color: "#374151",
                    lineHeight: 1.65,
                    whiteSpace: "pre-line",
                  }}
                >
                  {proj.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {r.certifications.length > 0 && (
        <div>
          <SectionHeader title="Certifications" accent={accent} />
          {r.certifications.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <div>
                <span style={{ fontWeight: 700, fontSize: 10 }}>
                  {c.certName}
                </span>
                {c.issuingOrganization && (
                  <span style={{ fontSize: 9, color: "#6b7280" }}>
                    {" "}
                    · {c.issuingOrganization}
                  </span>
                )}
                {c.credentialId && (
                  <span style={{ fontSize: 9, color: "#9ca3af" }}>
                    {" "}
                    · ID: {c.credentialId}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 9,
                  color: "#6b7280",
                  whiteSpace: "nowrap",
                  marginLeft: 10,
                }}
              >
                {c.issueDate}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template Gallery ─────────────────────────────────────────────────────────
function TemplateGallery({ selected, onSelect, onNext, onBack }) {
  const [hoveredId, setHoveredId] = useState(null);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#1d4ed8,#0891b2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 17 }}>
              I
            </span>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: "#0f172a" }}>
              ILMORA
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#2563eb",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              RESUME BUILDER
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["Get Started", "Template", "Build"].map((s, i) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: i <= 1 ? "#2563eb" : "#e5e7eb",
                  color: i <= 1 ? "#fff" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {i < 1 ? "✓" : i + 1}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: i === 1 ? 700 : 500,
                  color: i === 1 ? "#2563eb" : "#9ca3af",
                }}
              >
                {s}
              </span>
              {i < 2 && (
                <div
                  style={{
                    width: 32,
                    height: 1.5,
                    background: i < 1 ? "#2563eb" : "#e5e7eb",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onNext}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            color: "#6b7280",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          Skip →
        </button>
      </div>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#111",
              margin: "0 0 10px",
              letterSpacing: -0.5,
            }}
          >
            Choose Your Template
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>
            Click any template to preview · All 10 templates are fully
            customizable
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {TEMPLATES.map((t) => {
            const isSelected = selected === t.id;
            const isHovered = hoveredId === t.id;
            const dummyData = { ...DUMMY_RESUME, templateName: t.id };
            return (
              <div
                key={t.id}
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect(t.id)}
                style={{
                  border: `2.5px solid ${isSelected ? t.accent : isHovered ? t.accent + "60" : "#e5e7eb"}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "#fff",
                  boxShadow: isSelected
                    ? `0 0 0 4px ${t.accent}25, 0 8px 24px rgba(0,0,0,0.12)`
                    : isHovered
                      ? "0 8px 24px rgba(0,0,0,0.1)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                  transform: isSelected
                    ? "scale(1.02)"
                    : isHovered
                      ? "scale(1.01)"
                      : "scale(1)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    height: 280,
                    overflow: "hidden",
                    position: "relative",
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      transform: "scale(0.28)",
                      transformOrigin: "top left",
                      width: "357%",
                      pointerEvents: "none",
                    }}
                  >
                    <ResumePreview r={dummyData} />
                  </div>
                  {isHovered && !isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          color: "#111",
                          fontWeight: 800,
                          fontSize: 13,
                          padding: "8px 20px",
                          borderRadius: 8,
                        }}
                      >
                        Select Template
                      </span>
                    </div>
                  )}
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: t.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 800,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      ✓
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: isSelected
                        ? t.accent
                        : "rgba(255,255,255,0.9)",
                      color: isSelected ? "#fff" : "#374151",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {t.tag}
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    borderTop: `1px solid ${isSelected ? t.accent + "30" : "#f3f4f6"}`,
                    background: isSelected ? t.accent + "08" : "#fafafa",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: t.accent,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: isSelected ? 800 : 700,
                          fontSize: 13,
                          color: isSelected ? t.accent : "#111",
                        }}
                      >
                        {t.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>
                        {t.desc}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #e5e7eb",
            paddingTop: 24,
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              color: "#374151",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              Selected:{" "}
              <strong
                style={{
                  color: TEMPLATES.find((t) => t.id === selected)?.accent,
                }}
              >
                {TEMPLATES.find((t) => t.id === selected)?.name}
              </strong>
            </div>
            <button
              onClick={onNext}
              style={{
                padding: "12px 36px",
                borderRadius: 10,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                fontFamily: "inherit",
              }}
            >
              Start Editing →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HowToCreate ──────────────────────────────────────────────────────────────
function HowToCreate({ onManual, onAI, onPDF, onLinkedIn }) {
  const options = [
    {
      icon: "✨",
      label: "AI Generate",
      sub: "AI creates a complete ATS-optimised resume from your target role & skills",
      action: onAI,
      color: "#7c3aed",
      gradient: "linear-gradient(135deg,#7c3aed,#2563eb)",
    },
    {
      icon: "🔗",
      label: "Import from LinkedIn",
      sub: "Download your LinkedIn PDF and upload it — AI extracts your real profile data",
      action: onLinkedIn,
      color: "#0077b5",
      gradient: "linear-gradient(135deg,#0077b5,#0891b2)",
    },
    {
      icon: "📤",
      label: "Upload existing resume",
      sub: "Upload your current PDF and AI will extract every section automatically",
      action: onPDF,
      color: "#059669",
      gradient: "linear-gradient(135deg,#059669,#0891b2)",
    },
    {
      icon: "✏️",
      label: "Start from scratch",
      sub: "Build manually with a blank canvas and full control",
      action: onManual,
      color: "#374151",
      gradient: "linear-gradient(135deg,#374151,#1f2937)",
    },
  ];
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#1d4ed8,#0891b2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 17 }}>
              I
            </span>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: "#0f172a" }}>
              ILMORA
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#2563eb",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              RESUME BUILDER
            </div>
          </div>
        </div>
        <div style={{ width: 80 }} />
      </div>
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "64px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🎉</div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#111",
              margin: "0 0 12px",
              letterSpacing: -0.5,
            }}
          >
            How would you like to create your resume?
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>
            Choose the fastest path to your perfect resume
          </p>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={opt.action}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "28px 28px",
                borderRadius: 16,
                border: "2px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = opt.color;
                e.currentTarget.style.boxShadow = `0 4px 20px ${opt.color}20`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: opt.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: "#111",
                      marginBottom: 3,
                    }}
                  >
                    {opt.label}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}
                  >
                    {opt.sub}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span
                  style={{ fontSize: 12, color: opt.color, fontWeight: 700 }}
                >
                  Get started →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [view, setView] = useState("home");
  const [resumes, setResumes] = useState([]);
  const [editingResume, setEditingResume] = useState(null);
  const [activeSection, setActiveSection] = useState("Personal Info");
  const [previewScale, setPreviewScale] = useState(0.55);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showATSPanel, setShowATSPanel] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState("summit");
  const [showATSScoreUpload, setShowATSScoreUpload] = useState(false);
  const [showResumeScore, setShowResumeScore] = useState(false);
  const [showAIWriting, setShowAIWriting] = useState(false);

  const userId = getMyUserId();
  const score = editingResume ? calcScore(editingResume) : 0;
  const ats = editingResume
    ? !!(
        editingResume.email &&
        editingResume.profileSummary &&
        editingResume.skills.length > 0 &&
        editingResume.workExperiences.length > 0
      )
    : false;
  const previewId = "resume-print-target";

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    userService
      .getMyResumes(userId)
      .then((res) => setResumes((res.data || []).map(mapResponseToLocal)))
      .catch(() => setError("Failed to load resumes."))
      .finally(() => setLoading(false));
  }, [userId]);

  const applyAIData = (data) => {
    const stamp = (off) => Date.now() + off + Math.random();
    setEditingResume((prev) => ({
      ...(prev || emptyResume),
      ...data,
      workExperiences: (data.workExperiences || []).map((w, i) => ({
        ...w,
        id: stamp(i),
      })),
      educations: (data.educations || []).map((e, i) => ({
        ...e,
        id: stamp(i + 100),
      })),
      skills: (data.skills || []).map((s, i) => ({ ...s, id: stamp(i + 200) })),
      projects: (data.projects || []).map((p, i) => ({
        ...p,
        id: stamp(i + 300),
      })),
      certifications: (data.certifications || []).map((c, i) => ({
        ...c,
        id: stamp(i + 400),
      })),
    }));
    setView("editor");
  };

  const handleFeatureClick = (feature) => {
    if (feature === "ats-score") {
      setShowATSScoreUpload(true);
      return;
    }
    if (feature === "resume-score") {
      if (!editingResume) {
        alert("Please open a resume in the editor first.");
        return;
      }
      setShowResumeScore(true);
      return;
    }
    if (feature === "ai-writing") {
      if (!editingResume) {
        alert(
          "Please open a resume in the editor first, then use AI Writing Assistant.",
        );
        return;
      }
      setShowAIWriting(true);
      return;
    }
    if (feature === "pdf-export") {
      if (!editingResume) {
        alert("Please open a resume in the editor first to download PDF.");
        return;
      }
      const name = editingResume?.title || editingResume?.firstName || "resume";
      downloadResumeAsPdf(previewId, name);
      return;
    }
  };

  const handleCreateResume = (action, resumeData) => {
    if (action === "ai") {
      setEditingResume({ ...emptyResume, _isNew: true });
      setShowAIModal(true);
    } else if (action === "linkedin") {
      setEditingResume({ ...emptyResume, _isNew: true });
      setShowLinkedInModal(true);
    } else if (action === "pdf") {
      setEditingResume({ ...emptyResume, _isNew: true });
      setShowPDFModal(true);
    } else if (action === "manual") {
      setEditingResume({ ...emptyResume, _isNew: true });
      setActiveSection("Personal Info");
      setPendingTemplate("summit");
      setView("onboard-how");
    } else if (action === "template") {
      setEditingResume({ ...emptyResume, _isNew: true });
      setPendingTemplate("summit");
      setView("onboard-template");
    } else if (action === "edit" && resumeData) {
      setEditingResume({ ...resumeData });
      setActiveSection("Personal Info");
      setView("editor");
    } else if (action === "download" && resumeData) {
      setEditingResume({ ...resumeData });
      setTimeout(
        () =>
          downloadResumeAsPdf(
            previewId,
            resumeData.title || resumeData.firstName || "resume",
          ),
        300,
      );
    } else if (action === "delete" && resumeData) {
      handleDelete(resumeData.id);
    }
  };

  const handleSaveClick = () => {
    if (!editingResume) return;
    const defaultName =
      editingResume.title ||
      (editingResume.firstName
        ? `${editingResume.firstName}-${editingResume.lastName || "Resume"}`.replace(
            /\s+/g,
            "-",
          )
        : "My-Resume");
    setEditingResume((r) => ({ ...r, title: defaultName }));
    setShowSaveModal(true);
  };

  const handleSaveConfirm = async (chosenName) => {
    setShowSaveModal(false);
    const resumeToSave = { ...editingResume, title: chosenName };
    setEditingResume(resumeToSave);
    setSaving(true);
    setError(null);
    try {
      const payload = mapLocalToRequest(resumeToSave);
      let saved;
      if (resumeToSave._isNew) {
        const res = await userService.createResume(userId, payload);
        saved = mapResponseToLocal(res.data);
        setResumes((prev) => [saved, ...prev]);
      } else {
        const res = await userService.updateResume(
          userId,
          resumeToSave.id,
          payload,
        );
        saved = mapResponseToLocal(res.data);
        setResumes((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
      }
      setView("home");
    } catch {
      setError("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await userService.deleteResume(userId, id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to delete resume.");
    }
  };

  const modals = (
    <>
      {showAIModal && (
        <AIGenerateModal
          userId={userId}
          onClose={() => setShowAIModal(false)}
          onApply={applyAIData}
        />
      )}
      {showLinkedInModal && (
        <LinkedInScrapeModal
          userId={userId}
          onClose={() => setShowLinkedInModal(false)}
          onApply={applyAIData}
        />
      )}
      {showPDFModal && (
        <PDFUploadModal
          userId={userId}
          onClose={() => setShowPDFModal(false)}
          onApply={applyAIData}
        />
      )}
      {showATSScoreUpload && (
        <ATSScoreUploadModal
          userId={userId}
          onClose={() => setShowATSScoreUpload(false)}
        />
      )}
      {showResumeScore && editingResume && (
        <ResumeScoreModal
          resume={editingResume}
          onClose={() => setShowResumeScore(false)}
        />
      )}
      {showAIWriting && editingResume && (
        <AIWritingAssistantModal
          resume={editingResume}
          userId={userId}
          onApply={(field, value) =>
            setEditingResume((r) => ({ ...r, [field]: value }))
          }
          onClose={() => setShowAIWriting(false)}
        />
      )}
    </>
  );

  if (view === "home") {
    return (
      <>
        {modals}
        <ILMORANavbar
          onCreateResume={handleCreateResume}
          resumes={resumes}
          onFeatureClick={handleFeatureClick}
        />
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "100px 20px",
              color: "#6b7280",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <p style={{ fontSize: 15 }}>Loading your resumes…</p>
          </div>
        ) : (
          <HomePage
            onCreateResume={handleCreateResume}
            resumes={resumes}
            onFeatureClick={handleFeatureClick}
          />
        )}
        {editingResume && view === "home" && (
          <div
            style={{
              position: "absolute",
              left: -9999,
              top: -9999,
              pointerEvents: "none",
            }}
          >
            <ResumePreview r={editingResume} id={previewId} />
          </div>
        )}
      </>
    );
  }

  if (view === "onboard-how") {
    return (
      <>
        {modals}
        <HowToCreate
          onManual={() => setView("onboard-template")}
          onAI={() => setShowAIModal(true)}
          onLinkedIn={() => setShowLinkedInModal(true)}
          onPDF={() => setShowPDFModal(true)}
        />
      </>
    );
  }

  if (view === "onboard-template") {
    return (
      <TemplateGallery
        selected={pendingTemplate}
        onSelect={(id) => {
          setPendingTemplate(id);
          setEditingResume((r) => ({ ...r, templateName: id }));
        }}
        onNext={() => setView("editor")}
        onBack={() => setView("onboard-how")}
      />
    );
  }

  if (view === "editor") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f1f5f9",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showATSPanel && (
          <ATSTipsPanel
            userId={userId}
            resume={editingResume}
            onClose={() => setShowATSPanel(false)}
          />
        )}
        {showResumeScore && editingResume && (
          <ResumeScoreModal
            resume={editingResume}
            onClose={() => setShowResumeScore(false)}
          />
        )}
        {showAIWriting && editingResume && (
          <AIWritingAssistantModal
            resume={editingResume}
            userId={userId}
            onApply={(field, value) =>
              setEditingResume((r) => ({ ...r, [field]: value }))
            }
            onClose={() => setShowAIWriting(false)}
          />
        )}
        {showSaveModal && (
          <SaveNameModal
            defaultName={
              editingResume?.title ||
              (editingResume?.firstName
                ? `${editingResume.firstName}-${editingResume.lastName || "Resume"}`
                : "My-Resume")
            }
            onConfirm={handleSaveConfirm}
            onCancel={() => setShowSaveModal(false)}
          />
        )}

        {/* Editor Top Bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
            flexShrink: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setView("home")}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#374151",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              ← Back
            </button>
            <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "linear-gradient(135deg,#1d4ed8,#0891b2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>
                  I
                </span>
              </div>
              <input
                value={editingResume?.title || ""}
                onChange={(e) =>
                  setEditingResume((r) => ({ ...r, title: e.target.value }))
                }
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#111",
                  width: 220,
                  fontFamily: "inherit",
                }}
                placeholder="Resume name…"
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setShowATSPanel(true)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1.5px solid #10b981",
                background: "#f0fdf4",
                color: "#065f46",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              🎯 ATS Check
            </button>
            <button
              onClick={() => setShowResumeScore(true)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1.5px solid #6366f1",
                background: "#eef2ff",
                color: "#4338ca",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              📊 Score
            </button>
            <button
              onClick={() => setShowAIWriting(true)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1.5px solid #7c3aed",
                background: "#faf5ff",
                color: "#6d28d9",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              💬 AI Write
            </button>
            <button
              onClick={() => {
                const name =
                  editingResume?.title || editingResume?.firstName || "resume";
                downloadResumeAsPdf(previewId, name);
              }}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1.5px solid #f59e0b",
                background: "#fffbeb",
                color: "#92400e",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ⬇️ PDF
            </button>
            {ats && (
              <span
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "#eff6ff",
                  color: "#2563eb",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                ✓ ATS Friendly
              </span>
            )}
            {error && (
              <span style={{ fontSize: 11, color: "#dc2626" }}>{error}</span>
            )}
            <ScoreCircle score={score} size={52} />
            <button
              onClick={handleSaveClick}
              disabled={saving}
              style={{
                padding: "9px 22px",
                borderRadius: 9,
                border: "none",
                background: saving ? "#93c5fd" : "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {saving ? "Saving…" : "Save Resume"}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left Editor */}
          <div
            style={{
              width: 400,
              background: "#fff",
              borderRight: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                padding: "8px 12px 0",
                gap: 2,
                borderBottom: "1px solid #e5e7eb",
                scrollbarWidth: "none",
              }}
            >
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    padding: "7px 10px",
                    borderRadius: "8px 8px 0 0",
                    border: "none",
                    background:
                      activeSection === s.id ? "#eff6ff" : "transparent",
                    color: activeSection === s.id ? "#2563eb" : "#6b7280",
                    fontWeight: activeSection === s.id ? 700 : 500,
                    fontSize: 11,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    borderBottom:
                      activeSection === s.id
                        ? "2.5px solid #2563eb"
                        : "2.5px solid transparent",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{s.icon}</span>
                  {s.id}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
              {activeSection === "Personal Info" && (
                <PersonalPanel r={editingResume} set={setEditingResume} />
              )}
              {activeSection === "Profile" && (
                <ProfilePanel r={editingResume} set={setEditingResume} />
              )}
              {activeSection === "Experience" && (
                <ExperiencePanel r={editingResume} set={setEditingResume} />
              )}
              {activeSection === "Education" && (
                <EducationPanel r={editingResume} set={setEditingResume} />
              )}
              {activeSection === "Skills" && (
                <SkillsPanel r={editingResume} set={setEditingResume} />
              )}
              {activeSection === "Projects" && (
                <ProjectsPanel r={editingResume} set={setEditingResume} />
              )}
              {activeSection === "Certifications" && (
                <CertsPanel r={editingResume} set={setEditingResume} />
              )}
            </div>
          </div>

          {/* Right Preview */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Template switcher */}
            <div
              style={{
                background: "#fff",
                borderBottom: "1px solid #e5e7eb",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflowX: "auto",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#374151",
                  marginRight: 4,
                  whiteSpace: "nowrap",
                }}
              >
                Template:
              </span>
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    setEditingResume((r) => ({ ...r, templateName: t.id }))
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: `2px solid ${editingResume?.templateName === t.id ? t.accent : "#e5e7eb"}`,
                    background:
                      editingResume?.templateName === t.id
                        ? t.accent + "12"
                        : "#fff",
                    color:
                      editingResume?.templateName === t.id
                        ? t.accent
                        : "#374151",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: t.accent,
                    }}
                  />
                  {t.name}
                </button>
              ))}
            </div>

            {/* Preview canvas */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: 36,
                background: "#e2e8f0",
              }}
            >
              <div
                style={{
                  boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
                  borderRadius: 4,
                  overflow: "hidden",
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top center",
                  width: 794,
                  flexShrink: 0,
                  transition: "transform 0.2s",
                }}
              >
                {editingResume && (
                  <ResumePreview r={editingResume} id={previewId} />
                )}
              </div>
            </div>

            {/* Zoom controls */}
            <div
              style={{
                background: "#fff",
                borderTop: "1px solid #e5e7eb",
                padding: "8px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setPreviewScale((s) => Math.max(0.3, s - 0.05))}
                style={{
                  padding: "4px 14px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "inherit",
                }}
              >
                −
              </button>
              <span
                style={{
                  fontSize: 12,
                  color: "#374151",
                  fontWeight: 700,
                  minWidth: 52,
                  textAlign: "center",
                }}
              >
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(1, s + 0.05))}
                style={{
                  padding: "4px 14px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "inherit",
                }}
              >
                +
              </button>
              <div
                style={{
                  width: 1,
                  height: 20,
                  background: "#e5e7eb",
                  margin: "0 4px",
                }}
              />
              <button
                onClick={() => setPreviewScale(0.55)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  fontFamily: "inherit",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}













