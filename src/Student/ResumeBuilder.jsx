import { useState, useEffect, useRef, createContext, useContext } from "react";
import userService from "../services/userService";
import {
  Sparkles, Link2, Upload, PenLine, LayoutTemplate, Target, BarChart3,
  MessageSquare, Download, FileText, ChevronDown, User, Briefcase,
  GraduationCap, Zap, FolderGit2, Award, Save, ArrowLeft, ZoomIn,
  ZoomOut, RotateCcw, Trash2, Edit3, Plus, X, Check, AlertCircle,
  Globe, Github, Linkedin, Phone, Mail, MapPin, ExternalLink,
  ChevronRight, Menu, Loader2, FileUp, ScanSearch, Brain,
  Layers, Star, TrendingUp, Users, Clock, Shield, RefreshCw
} from "lucide-react";

/* ─── Global Responsive Styles ───────────────────────────────────────────── */
const GLOBAL_STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; }

  .rb-hide-mobile { display: flex !important; }
  .rb-show-mobile { display: none !important; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 3px; }

  @keyframes rbspin { to { transform: rotate(360deg); } }
  @keyframes rbfadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes rbpulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

  .rb-animate-in { animation: rbfadein 0.3s ease forwards; }
  .rb-spin { animation: rbspin 0.9s linear infinite; }
  .rb-pulse { animation: rbpulse 2s ease-in-out infinite; }

  .rb-card-hover {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease !important;
  }
  .rb-card-hover:hover {
    transform: translateY(-4px) !important;
  }

  @media (max-width: 900px) {
    .rb-hide-mobile { display: none !important; }
    .rb-show-mobile { display: flex !important; }
    .rb-editor-layout { flex-direction: column !important; }
    .rb-editor-left  { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--rb-border) !important; max-height: 55vh; }
    .rb-editor-right { min-height: 400px; }
    .rb-preview-canvas { padding: 16px !important; align-items: flex-start !important; }
    .rb-topbar { padding: 0 12px !important; height: auto !important; min-height: 56px; flex-wrap: wrap; gap: 6px; padding-top: 8px !important; padding-bottom: 8px !important; }
    .rb-topbar-actions { flex-wrap: wrap; gap: 6px !important; }
    .rb-nav-inner { padding: 0 16px !important; height: auto !important; min-height: 56px; flex-wrap: wrap; gap: 8px; padding-top: 8px !important; padding-bottom: 8px !important; }
    .rb-hero { padding: 40px 16px 48px !important; }
    .rb-hero h1 { font-size: 32px !important; }
    .rb-hero p { font-size: 14px !important; }
    .rb-hero-btns { flex-direction: column !important; align-items: stretch !important; }
    .rb-stats-row { gap: 16px !important; }
    .rb-features-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
    .rb-steps-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
    .rb-template-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .rb-resumes-grid { grid-template-columns: 1fr 1fr !important; }
    .rb-howto-grid { grid-template-columns: 1fr !important; }
    .rb-dropdown { min-width: 240px !important; }
    .rb-modal-inner { width: 95vw !important; padding: 20px !important; }
    .rb-score-row { flex-direction: column !important; align-items: flex-start !important; }
  }

  @media (max-width: 480px) {
    .rb-features-grid { grid-template-columns: 1fr !important; }
    .rb-steps-grid { grid-template-columns: 1fr !important; }
    .rb-template-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .rb-resumes-grid { grid-template-columns: 1fr !important; }
    .rb-hero h1 { font-size: 26px !important; }
    .rb-stat-num { font-size: 22px !important; }
    .rb-howto-grid { grid-template-columns: 1fr !important; }
    .rb-nav-items { display: none !important; }
    .rb-tpl-gallery-grid-5 { grid-template-columns: repeat(2,1fr) !important; }
    .rb-ai-step-grid { grid-template-columns: repeat(3,1fr) !important; }
  }
`;

if (!document.getElementById("rb-global-style")) {
  const s = document.createElement("style");
  s.id = "rb-global-style";
  s.textContent = GLOBAL_STYLE;
  document.head.appendChild(s);
}

/* ─── Theme Color Palettes ───────────────────────────────────────────────── */
const DARK_C = {
  bg: "#080812",
  card: "#0f0f1f",
  card2: "#13132a",
  card3: "#1a1a35",
  border: "#252545",
  borderHover: "#3a3a6a",
  orange: "#f97316",
  orangeD: "#ea6a0a",
  orangeGlow: "rgba(249,115,22,0.18)",
  green: "#22c55e",
  greenGlow: "rgba(34,197,94,0.15)",
  text: "#e8e8f5",
  textSub: "#b8b8d8",
  muted: "#6666aa",
  red: "#f87171",
  redGlow: "rgba(248,113,113,0.12)",
  blue: "#60a5fa",
  blueGlow: "rgba(96,165,250,0.12)",
  purple: "#a78bfa",
  purpleGlow: "rgba(167,139,250,0.12)",
  inputBg: "#080812",
  inputBorder: "#252545",
  inputFocus: "#f97316",
  canvasBg: "#050510",
  scoreBg: "#0a0a18",
  dropBg: "#0a0a18",
  resultBg: "#0a0a18",
  previewThumbBg: "#0a0a18",
  navBg: "rgba(8,8,18,0.96)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)",
  shadowCard: "0 2px 16px rgba(0,0,0,0.5)",
  shadowHover: "0 12px 40px rgba(0,0,0,0.7)",
  isDark: true,
};

const LIGHT_C = {
  bg: "#f4f4f8",
  card: "#ffffff",
  card2: "#fafafa",
  card3: "#f0f0f8",
  border: "#e0e0ee",
  borderHover: "#c0c0dd",
  orange: "#ea6a0a",
  orangeD: "#d45e08",
  orangeGlow: "rgba(234,106,10,0.1)",
  green: "#16a34a",
  greenGlow: "rgba(22,163,74,0.1)",
  text: "#18182c",
  textSub: "#44445a",
  muted: "#7878a0",
  red: "#dc2626",
  redGlow: "rgba(220,38,38,0.08)",
  blue: "#2563eb",
  blueGlow: "rgba(37,99,235,0.08)",
  purple: "#7c3aed",
  purpleGlow: "rgba(124,58,237,0.08)",
  inputBg: "#ffffff",
  inputBorder: "#d8d8ec",
  inputFocus: "#ea6a0a",
  canvasBg: "#e4e4f0",
  scoreBg: "#f4f4f8",
  dropBg: "#fafafa",
  resultBg: "#f4f4f8",
  previewThumbBg: "#e8e8f4",
  navBg: "rgba(255,255,255,0.97)",
  shadow: "0 4px 24px rgba(0,0,0,0.1)",
  shadowCard: "0 2px 12px rgba(0,0,0,0.07)",
  shadowHover: "0 12px 36px rgba(0,0,0,0.14)",
  isDark: false,
};

const ColorContext = createContext(DARK_C);

/* ─── useDarkMode Hook ───────────────────────────────────────────────────── */
function useDarkMode() {
  const detectDark = () => {
    if (document.documentElement.classList.contains("dark")) return true;
    if (document.body.classList.contains("dark")) return true;
    if (document.documentElement.getAttribute("data-theme") === "dark") return true;
    if (document.documentElement.getAttribute("data-color-scheme") === "dark") return true;
    const stored =
      localStorage.getItem("theme") ||
      localStorage.getItem("ilmora-theme") ||
      localStorage.getItem("color-theme") ||
      localStorage.getItem("vite-ui-theme") ||
      localStorage.getItem("app-theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return true;
  };
  const [isDark, setIsDark] = useState(detectDark);
  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(detectDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "data-color-scheme"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    const interval = setInterval(() => setIsDark(detectDark()), 500);
    return () => { observer.disconnect(); clearInterval(interval); };
  }, []);
  return isDark;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const TEMPLATES = [
  { id:"summit",  name:"Summit",       accent:"#2563eb", bg:"#fff", sidebar:false, tag:"Popular", desc:"Clean & Professional" },
  { id:"maple",   name:"Maple",        accent:"#dc2626", bg:"#fff", sidebar:false, tag:"New",     desc:"Bold Red Accent" },
  { id:"valiant", name:"Valiant",      accent:"#0891b2", bg:"#f0f9ff", sidebar:true, tag:"2-Col", desc:"Two Column Layout" },
  { id:"quartz",  name:"Quartz",       accent:"#b45309", bg:"#fffbeb", sidebar:false, tag:"Classic", desc:"Warm & Timeless" },
  { id:"executive",name:"Executive",   accent:"#1e293b", bg:"#fff", sidebar:true, tag:"Pro",    desc:"Dark Sidebar" },
  { id:"aurora",  name:"Aurora",       accent:"#7c3aed", bg:"#faf5ff", sidebar:false, tag:"Creative", desc:"Purple Creative" },
  { id:"minimal", name:"Minimal",      accent:"#374151", bg:"#fff", sidebar:false, tag:"Clean",  desc:"Ultra Minimal" },
  { id:"professional",name:"Professional",accent:"#065f46",bg:"#f0fdf4",sidebar:false,tag:"ATS", desc:"ATS Friendly Green" },
  { id:"coral",   name:"Coral",        accent:"#e11d48", bg:"#fff1f2", sidebar:false, tag:"Vibrant",desc:"Coral Pink Accent" },
  { id:"slate",   name:"Slate",        accent:"#475569", bg:"#f8fafc", sidebar:true, tag:"Modern", desc:"Slate Gray Modern" },
];

const EXPERIENCE_LEVELS = [
  { id:"fresher", label:"Fresher / Intern",      badge:"0 years", years:"0",   desc:"Just graduated or currently studying" },
  { id:"junior",  label:"Junior Developer",       badge:"1–2 yrs", years:"1.5", desc:"Early career with some hands-on experience" },
  { id:"mid",     label:"Mid-level Developer",    badge:"2–3 yrs", years:"2.5", desc:"Comfortable working independently" },
  { id:"senior",  label:"Senior Developer",       badge:"4–6 yrs", years:"5",   desc:"Leads projects and mentors others" },
  { id:"lead",    label:"Tech Lead / Manager",    badge:"7+ yrs",  years:"8",   desc:"Architectural decisions and team leadership" },
];

const SKILL_SETS = {
  "Java Full Stack":["Java","Spring Boot","Spring MVC","Hibernate","JPA","React","Angular","HTML5","CSS3","JavaScript","TypeScript","MySQL","PostgreSQL","REST API","Microservices","Maven","Git","Docker","AWS","Jenkins"],
  "Python Full Stack":["Python","Django","Flask","FastAPI","React","Vue.js","HTML5","CSS3","JavaScript","PostgreSQL","MongoDB","Redis","REST API","Celery","Docker","AWS","Git","Nginx"],
  "MERN Stack":["MongoDB","Express.js","React","Node.js","JavaScript","TypeScript","HTML5","CSS3","Redux","REST API","GraphQL","JWT","Socket.io","Docker","AWS","Git","Webpack","Jest"],
  "Data Science / ML":["Python","NumPy","Pandas","Scikit-learn","TensorFlow","PyTorch","Matplotlib","Seaborn","SQL","Jupyter Notebook","Machine Learning","Deep Learning","NLP","Computer Vision","Tableau","Power BI","AWS SageMaker","Git","Statistics"],
  "DevOps / Cloud":["AWS","Azure","GCP","Docker","Kubernetes","Terraform","Ansible","Jenkins","GitHub Actions","Linux","Bash","Python","Prometheus","Grafana","CI/CD","Nginx","Redis","ELK Stack","Git"],
  "Android Developer":["Java","Kotlin","Android SDK","Jetpack Compose","XML Layouts","Room Database","Retrofit","Firebase","REST API","MVVM","LiveData","ViewModel","Coroutines","Dagger/Hilt","Google Play","Git","SQLite","Material Design"],
  "Frontend Developer":["HTML5","CSS3","JavaScript","TypeScript","React","Next.js","Vue.js","Tailwind CSS","SASS/SCSS","Redux","GraphQL","REST API","Webpack","Vite","Jest","Cypress","Figma","Git","Performance Optimization"],
  "Backend Developer":["Node.js","Express.js","Java","Spring Boot","Python","Django","REST API","GraphQL","PostgreSQL","MongoDB","Redis","RabbitMQ","Kafka","Docker","AWS","Microservices","JWT","OAuth2","Git","Linux"],
  "Cybersecurity":["Network Security","Penetration Testing","OWASP","Kali Linux","Wireshark","Nmap","Metasploit","SIEM","Firewalls","Python","Bash","Incident Response","Vulnerability Assessment","ISO 27001","GDPR","Ethical Hacking","Cryptography","SOC"],
  "QA / Testing":["Manual Testing","Selenium","Cypress","Playwright","JUnit","TestNG","Postman","REST Assured","JMeter","JIRA","Agile/Scrum","BDD","Cucumber","Java","Python","API Testing","Performance Testing","Git","CI/CD","Test Automation"],
  "None / Custom":[],
};

const DUMMY_RESUME = {
  firstName:"Alex", lastName:"Johnson", jobTitle:"Full Stack Developer",
  email:"alex.johnson@email.com", phone:"+91 9876543210", city:"Hyderabad", country:"India",
  linkedinUrl:"linkedin.com/in/alexjohnson", githubUrl:"github.com/alexjohnson", portfolioUrl:"alexjohnson.dev",
  profileSummary:"Results-driven Full Stack Developer with 3+ years of hands-on experience building scalable web applications using React, Java Spring Boot, and AWS. Proficient in designing RESTful APIs and microservices architecture.",
  workExperiences:[
    { id:1, companyName:"TechCorp Solutions", position:"Senior Full Stack Developer", startDate:"Jan 2023", endDate:"", isCurrent:true, location:"Hyderabad, India", description:"• Developed RESTful APIs using Spring Boot and MySQL, reducing response time by 35%\n• Architected microservices-based backend using Docker and AWS EC2", displayOrder:0 },
    { id:2, companyName:"Infosys Ltd", position:"Junior Developer", startDate:"Jun 2021", endDate:"Dec 2022", isCurrent:false, location:"Bangalore, India", description:"• Built responsive React frontends for 3 enterprise applications\n• Integrated third-party payment gateways increasing conversion by 20%", displayOrder:1 },
  ],
  educations:[{ id:1, institution:"JNTUH College of Engineering", degree:"Bachelor of Technology", fieldOfStudy:"Computer Science and Engineering", startDate:"2017", endDate:"2021", grade:"8.4 / 10", description:"", displayOrder:0 }],
  skills:[
    { id:1, skillName:"React", proficiencyLevel:"EXPERT", displayOrder:0 },
    { id:2, skillName:"Java", proficiencyLevel:"EXPERT", displayOrder:1 },
    { id:3, skillName:"Spring Boot", proficiencyLevel:"ADVANCED", displayOrder:2 },
    { id:4, skillName:"MySQL", proficiencyLevel:"ADVANCED", displayOrder:3 },
    { id:5, skillName:"AWS", proficiencyLevel:"INTERMEDIATE", displayOrder:4 },
    { id:6, skillName:"Docker", proficiencyLevel:"INTERMEDIATE", displayOrder:5 },
  ],
  projects:[{ id:1, projectName:"E-Commerce Microservices Platform", techStack:"React, Spring Boot, MySQL, Docker, AWS", projectUrl:"github.com/alexjohnson/ecommerce", startDate:"Mar 2023", endDate:"Jun 2023", description:"Full-stack e-commerce platform with microservices architecture.\n• Developed REST API using Spring Boot serving 10K+ daily users", displayOrder:0 }],
  certifications:[{ id:1, certName:"AWS Solutions Architect Associate", issuingOrganization:"Amazon Web Services", issueDate:"Jan 2024", expiryDate:"Jan 2027", credentialId:"AWS-SAA-123456", credentialUrl:"credly.com/badges/aws-saa", displayOrder:0 }],
};

const SECTIONS = [
  { id:"Personal Info", icon:User },
  { id:"Profile",       icon:FileText },
  { id:"Experience",    icon:Briefcase },
  { id:"Education",     icon:GraduationCap },
  { id:"Skills",        icon:Zap },
  { id:"Projects",      icon:FolderGit2 },
  { id:"Certifications",icon:Award },
];

const LEVELS = ["BEGINNER","INTERMEDIATE","ADVANCED","EXPERT"];
const LEVEL_COLOR = { BEGINNER:"#6b7280", INTERMEDIATE:"#3b82f6", ADVANCED:"#f59e0b", EXPERT:"#10b981" };
const LEVEL_PCT   = { BEGINNER:25, INTERMEDIATE:50, ADVANCED:75, EXPERT:100 };

const emptyResume = {
  title:"My Resume", templateName:"summit",
  firstName:"", lastName:"", jobTitle:"", email:"", phone:"",
  city:"", country:"", linkedinUrl:"", githubUrl:"", portfolioUrl:"",
  profileSummary:"", workExperiences:[], educations:[], skills:[], projects:[], certifications:[],
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getMyUserId() {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.sub || payload.id || null;
  } catch { return null; }
}
function mapResponseToLocal(dto) {
  const stamp = () => Date.now() + Math.random();
  return {
    id:dto.id, title:dto.title||"My Resume", templateName:dto.templateName||"summit",
    firstName:dto.firstName||"", lastName:dto.lastName||"", jobTitle:dto.jobTitle||"",
    email:dto.email||"", phone:dto.phone||"", city:dto.city||"", country:dto.country||"",
    linkedinUrl:dto.linkedinUrl||"", githubUrl:dto.githubUrl||"", portfolioUrl:dto.portfolioUrl||"",
    profileSummary:dto.profileSummary||"", resumeScore:dto.resumeScore||0, isAtsFriendly:dto.isAtsFriendly||false,
    workExperiences:(dto.workExperiences||[]).map(w=>({...w,id:w.id||stamp()})),
    educations:(dto.educations||[]).map(e=>({...e,id:e.id||stamp()})),
    skills:(dto.skills||[]).map(s=>({...s,id:s.id||stamp()})),
    projects:(dto.projects||[]).map(p=>({...p,id:p.id||stamp()})),
    certifications:(dto.certifications||[]).map(c=>({...c,id:c.id||stamp()})),
  };
}
function mapLocalToRequest(r) {
  return {
    title:r.title, templateName:r.templateName, firstName:r.firstName, lastName:r.lastName,
    jobTitle:r.jobTitle, email:r.email, phone:r.phone, city:r.city, country:r.country,
    linkedinUrl:r.linkedinUrl, githubUrl:r.githubUrl, portfolioUrl:r.portfolioUrl, profileSummary:r.profileSummary,
    workExperiences:r.workExperiences.map(({companyName,position,startDate,endDate,isCurrent,location,description,displayOrder})=>({companyName,position,startDate,endDate,isCurrent,location,description,displayOrder})),
    educations:r.educations.map(({institution,degree,fieldOfStudy,startDate,endDate,grade,description,displayOrder})=>({institution,degree,fieldOfStudy,startDate,endDate,grade,description,displayOrder})),
    skills:r.skills.map(({skillName,proficiencyLevel,displayOrder})=>({skillName,proficiencyLevel,displayOrder})),
    projects:r.projects.map(({projectName,techStack,projectUrl,startDate,endDate,description,displayOrder})=>({projectName,techStack,projectUrl,startDate,endDate,description,displayOrder})),
    certifications:r.certifications.map(({certName,issuingOrganization,issueDate,expiryDate,credentialId,credentialUrl,displayOrder})=>({certName,issuingOrganization,issueDate,expiryDate,credentialId,credentialUrl,displayOrder})),
  };
}
function calcScore(r) {
  let s=0;
  if(r.firstName)s+=5; if(r.email)s+=5; if(r.phone)s+=5; if(r.city)s+=5;
  if((r.profileSummary||"").length>80)s+=15;
  s+=Math.min(25,r.workExperiences.length*9); s+=Math.min(15,r.educations.length*8);
  s+=Math.min(15,r.skills.length*2); if(r.projects.length)s+=5;
  if(r.certifications.length)s+=5; if(r.linkedinUrl)s+=5; if(r.githubUrl)s+=5;
  return Math.min(100,s);
}
function downloadResumeAsPdf(elementId,filename) {
  const el=document.getElementById(elementId);
  if(!el)return;
  const safeName=(filename||"resume").replace(/[^a-zA-Z0-9_\-]/g,"_");
  const win=window.open("","_blank");
  win.document.write(`<!DOCTYPE html><html><head><title>${safeName}</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{background:white;}@page{size:A4;margin:0;}@media print{html,body{width:210mm;height:297mm;}body{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}</style><script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);};<\/script></head><body>${el.outerHTML}</body></html>`);
  win.document.close();
}

/* ─── Shared UI Atoms ─────────────────────────────────────────────────────── */
function Btn({ children, onClick, disabled, variant="primary", size="md", style={}, title }) {
  const C = useContext(ColorContext);
  const sizes = { sm:"5px 12px", md:"8px 16px", lg:"11px 26px" };
  const vars = {
    primary:  { background:`linear-gradient(135deg,${C.orange},${C.orangeD})`, color:"#fff", border:"none", boxShadow:`0 2px 12px ${C.orangeGlow}` },
    secondary:{ background:C.card3, color:C.textSub, border:`1.5px solid ${C.border}` },
    ghost:    { background:"transparent", color:C.muted, border:`1px solid ${C.border}` },
    danger:   { background:C.redGlow, color:C.red, border:`1px solid rgba(248,113,113,0.25)` },
    green:    { background:`linear-gradient(135deg,${C.green},#16a34a)`, color:"#fff", border:"none", boxShadow:`0 2px 10px ${C.greenGlow}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      padding:sizes[size], borderRadius:8, fontSize:12, fontWeight:700,
      cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit",
      opacity:disabled?0.45:1, transition:"all 0.2s ease", whiteSpace:"nowrap",
      display:"inline-flex", alignItems:"center", gap:5, justifyContent:"center",
      ...vars[variant], ...style,
    }}
    onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.filter="brightness(1.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
    onMouseLeave={e=>{ e.currentTarget.style.filter=""; e.currentTarget.style.transform=""; }}
    >{children}</button>
  );
}

function Input({ label, value, onChange, placeholder, type="text", multiline }) {
  const C = useContext(ColorContext);
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    width:"100%", padding:"9px 12px", borderRadius:8, fontSize:13, fontFamily:"inherit",
    background:C.inputBg, color:C.text, outline:"none", resize:multiline?"vertical":"none",
    border:`1.5px solid ${focused?C.inputFocus:C.inputBorder}`,
    boxShadow:focused?`0 0 0 3px ${C.orangeGlow}`:"none",
    transition:"border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing:"border-box", minHeight:multiline?88:"auto",
  };
  return (
    <div style={{ marginBottom:12 }}>
      {label && <label style={{ display:"block", fontSize:10, fontWeight:700, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.8 }}>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...baseStyle, color:C.text}} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={baseStyle} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} />
      }
    </div>
  );
}

function Card({ children, style={} }) {
  const C = useContext(ColorContext);
  return (
    <div style={{
      background:C.card, borderRadius:10, border:`1px solid ${C.border}`,
      padding:14, marginBottom:12, boxShadow:C.shadowCard, ...style
    }}>{children}</div>
  );
}

function AddBtn({ onClick, label }) {
  const C = useContext(ColorContext);
  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", justifyContent:"center", gap:7,
      padding:"9px 16px", borderRadius:9, width:"100%",
      border:`1.5px dashed ${C.orange}`,
      background:`${C.orangeGlow}`,
      color:C.orange, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
      transition:"all 0.2s ease",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.background=`rgba(249,115,22,0.15)`; e.currentTarget.style.borderStyle="solid"; }}
    onMouseLeave={e=>{ e.currentTarget.style.background=C.orangeGlow; e.currentTarget.style.borderStyle="dashed"; }}
    >
      <Plus size={14} />{label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  const C = useContext(ColorContext);
  return (
    <button onClick={onClick} style={{
      padding:"4px 10px", borderRadius:6, border:"none",
      background:C.redGlow, color:C.red,
      fontSize:11, cursor:"pointer", fontWeight:700, fontFamily:"inherit",
      display:"inline-flex", alignItems:"center", gap:4, transition:"all 0.15s ease",
    }}
    onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.15)"}
    onMouseLeave={e=>e.currentTarget.style.filter=""}
    >
      <X size={12} /> Remove
    </button>
  );
}

function ScoreCircle({ score, size=72 }) {
  const C = useContext(ColorContext);
  const color = score>=80 ? C.green : score>=50 ? "#f59e0b" : C.red;
  const r = size*0.4, circ = 2*Math.PI*r, dash = (score/100)*circ;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={size*0.09} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.09}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 0.8s ease" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:size*0.24, fontWeight:800, color, lineHeight:1 }}>{score}</span>
        <span style={{ fontSize:size*0.11, color:C.muted, textTransform:"uppercase", letterSpacing:0.8 }}>Score</span>
      </div>
    </div>
  );
}

function LoadingOverlay({ message, subMessage }) {
  const C = useContext(ColorContext);
  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.92)":"rgba(255,255,255,0.92)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
      <div style={{ background:C.card, borderRadius:20, padding:"40px 44px", textAlign:"center", maxWidth:380, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ width:56, height:56, margin:"0 auto 20px", borderRadius:"50%", border:`3px solid ${C.border}`, borderTop:`3px solid ${C.orange}` }} className="rb-spin" />
        <div style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:8 }}>{message}</div>
        {subMessage && <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{subMessage}</div>}
      </div>
    </div>
  );
}

/* ─── Section Divider ─────────────────────────────────────────────────────── */
function SectionDivider({ label }) {
  const C = useContext(ColorContext);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0 14px" }}>
      <div style={{ flex:1, height:1, background:C.border }} />
      <span style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:1.2 }}>{label}</span>
      <div style={{ flex:1, height:1, background:C.border }} />
    </div>
  );
}

/* ─── Badge ───────────────────────────────────────────────────────────────── */
function Badge({ children, color, bg }) {
  return (
    <span style={{ padding:"3px 10px", borderRadius:999, background:bg, color, fontSize:10, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
      {children}
    </span>
  );
}
/* ─── ILMORA Logo ─────────────────────────────────────────────────────────── */
function ILMORALogo({ size = "md" }) {
  const C = useContext(ColorContext);

  const sizes = {
    sm: { icon: 28, fs: 12, sub: 8 },
    md: { icon: 36, fs: 15, sub: 9 },
    lg: { icon: 44, fs: 18, sub: 10 },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      
      {/* Logo Icon */}
      <div
        style={{
          width: s.icon,
          height: s.icon,
          borderRadius: Math.round(s.icon * 0.28),
          background: `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 3px 14px ${C.orangeGlow}`,
          flexShrink: 0,
        }}
      >
        <Sparkles
          size={s.icon * 0.5}
          color="#fff"
          strokeWidth={2.5}
        />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col leading-none">
        
        <div
          className="font-black tracking-tight flex items-center"
          style={{
            fontSize: s.fs,
            lineHeight: 1,
          }}
        >
          <span className="text-green-600">ILM</span>

          <span
            className="ml-2"
            style={{
              color: C.orange,
            }}
          >
            ORA
          </span>
        </div>

        <div
          style={{
            fontSize: s.sub,
            color: C.orange,
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          Resume Builder
        </div>

      </div>
    </div>
  );
}
/* ─── ILMORA Navbar ───────────────────────────────────────────────────────── */
function ILMORANavbar({ onCreateResume, resumes, onFeatureClick }) {
  const C = useContext(ColorContext);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef();

  useEffect(() => {
    function hc(e) { if(navRef.current && !navRef.current.contains(e.target)){ setActiveDropdown(null); }}
    document.addEventListener("mousedown", hc);
    return ()=>document.removeEventListener("mousedown",hc);
  },[]);

  const navItems = [
    { label:"Resume", items:[
      { icon:Sparkles,  title:"AI Resume Builder",      sub:"Generate ATS-optimised resume with AI",      action:()=>onCreateResume("ai") },
      { icon:Linkedin,  title:"Import from LinkedIn",   sub:"Upload LinkedIn PDF and AI builds resume",   action:()=>onCreateResume("linkedin") },
      { icon:FileUp,    title:"Upload Existing Resume", sub:"Upload PDF and AI extracts every section",   action:()=>onCreateResume("pdf") },
      { icon:PenLine,   title:"Build from Scratch",     sub:"Start with blank canvas, full control",      action:()=>onCreateResume("manual") },
    ]},
    { label:"Templates", items:[
      { icon:LayoutTemplate,title:"Browse All Templates",   sub:"10 stunning ATS-friendly resume designs",   action:()=>onCreateResume("template") },
      { icon:Award,     title:"Professional Templates", sub:"Classic layouts trusted by hiring managers", action:()=>onCreateResume("template") },
      { icon:Star,      title:"Creative Templates",     sub:"Stand out with bold, modern designs",        action:()=>onCreateResume("template") },
      { icon:Shield,    title:"ATS-Friendly Templates", sub:"Optimised to pass applicant tracking systems",action:()=>onCreateResume("template") },
    ]},
    { label:"Features", items:[
      { icon:ScanSearch,title:"ATS Score Checker",      sub:"Upload resume PDF for instant ATS analysis", action:()=>{ onFeatureClick("ats-score"); setActiveDropdown(null); } },
      { icon:BarChart3, title:"Resume Score",           sub:"Detailed breakdown of resume quality",        action:()=>{ onFeatureClick("resume-score"); setActiveDropdown(null); } },
      { icon:Brain,     title:"AI Writing Assistant",   sub:"AI-powered content suggestions and rewrites", action:()=>{ onFeatureClick("ai-writing"); setActiveDropdown(null); } },
      { icon:Download,  title:"PDF Export",             sub:"Download resume as professional PDF",         action:()=>{ onFeatureClick("pdf-export"); setActiveDropdown(null); } },
    ]},
    { label:"My Resumes", items: resumes.length>0
      ? resumes.slice(0,4).map(r=>({ icon:FileText, title:r.title||"Untitled", sub:`${r.firstName||""} ${r.lastName||""}`.trim()||"Click to edit", action:()=>onCreateResume("edit",r) }))
      : [{ icon:FileText, title:"No resumes yet", sub:"Create your first resume to get started", action:null }]
    },
  ];

  return (
    <nav ref={navRef} style={{ background:C.navBg, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:100, boxShadow:C.shadow, backdropFilter:"blur(12px)" }}>
      <div className="rb-nav-inner" style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", height:64, gap:0 }}>
        <div style={{ marginRight:36 }}>
          <ILMORALogo size="md" />
        </div>

        <div className="rb-nav-items" style={{ display:"flex", alignItems:"center", gap:2, flex:1 }}>
          {navItems.map(item => (
            <div key={item.label} style={{ position:"relative" }}>
              <button
                onClick={()=>setActiveDropdown(activeDropdown===item.label?null:item.label)}
                style={{
                  padding:"7px 13px", border:"none",
                  background:activeDropdown===item.label?C.orangeGlow:"transparent",
                  color:activeDropdown===item.label?C.orange:C.muted,
                  fontWeight:600, fontSize:13, cursor:"pointer",
                  borderRadius:8, display:"flex", alignItems:"center", gap:5,
                  transition:"all 0.15s ease", fontFamily:"inherit",
                }}
                onMouseEnter={e=>{ if(activeDropdown!==item.label){ e.currentTarget.style.background=C.card3; e.currentTarget.style.color=C.text; }}}
                onMouseLeave={e=>{ if(activeDropdown!==item.label){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}}
              >
                {item.label}
                <ChevronDown size={13} style={{ transform:activeDropdown===item.label?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s ease" }} />
              </button>

              {activeDropdown===item.label && (
                <div className="rb-dropdown rb-animate-in" style={{
                  position:"absolute", top:"calc(100% + 10px)", left:0,
                  background:C.card, borderRadius:14, border:`1px solid ${C.border}`,
                  boxShadow:C.shadow, padding:8, minWidth:290, zIndex:200,
                }}>
                  {item.items.map((d,i) => {
                    const IconC = d.icon;
                    return (
                      <button key={i} onClick={()=>{ d.action&&d.action(); setActiveDropdown(null); }}
                        style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"10px 12px", borderRadius:9, border:"none", background:"transparent", cursor:d.action?"pointer":"default", width:"100%", textAlign:"left", fontFamily:"inherit", transition:"background 0.15s ease" }}
                        onMouseEnter={e=>{ if(d.action) e.currentTarget.style.background=C.card3; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}
                      >
                        <div style={{ width:32, height:32, borderRadius:8, background:C.card3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <IconC size={15} color={C.orange} />
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:12, color:C.text, marginBottom:2 }}>{d.title}</div>
                          <div style={{ fontSize:11, color:C.muted, lineHeight:1.4 }}>{d.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <Btn onClick={()=>onCreateResume("ai")} style={{ fontSize:13, padding:"9px 20px", boxShadow:`0 4px 16px ${C.orangeGlow}` }}>
          <Sparkles size={14} /> Create Resume
        </Btn>
      </div>
    </nav>
  );
}

/* ─── Resume Score Modal ──────────────────────────────────────────────────── */
function ResumeScoreModal({ resume, onClose }) {
  const C = useContext(ColorContext);
  const score = calcScore(resume);
  const scoreColor = score>=80?C.green:score>=50?"#f59e0b":C.red;
  const items = [
    { label:"First Name",      earned:resume.firstName?5:0,                              max:5,  tip:"Add your first name",                icon:User },
    { label:"Email Address",   earned:resume.email?5:0,                                  max:5,  tip:"Add your email",                     icon:Mail },
    { label:"Phone Number",    earned:resume.phone?5:0,                                  max:5,  tip:"Add your phone number",              icon:Phone },
    { label:"City / Location", earned:resume.city?5:0,                                   max:5,  tip:"Add your city",                      icon:MapPin },
    { label:"Profile Summary", earned:(resume.profileSummary||"").length>80?15:0,         max:15, tip:"Write a 80+ character summary",      icon:FileText },
    { label:"Work Experience", earned:Math.min(25,resume.workExperiences.length*9),       max:25, tip:"Add at least 2–3 work experiences",  icon:Briefcase },
    { label:"Education",       earned:Math.min(15,resume.educations.length*8),            max:15, tip:"Add your education history",         icon:GraduationCap },
    { label:"Skills",          earned:Math.min(15,resume.skills.length*2),                max:15, tip:"Add 7+ skills for full marks",       icon:Zap },
    { label:"Projects",        earned:resume.projects.length?5:0,                         max:5,  tip:"Add at least one project",           icon:FolderGit2 },
    { label:"Certifications",  earned:resume.certifications.length?5:0,                  max:5,  tip:"Add a certification",               icon:Award },
    { label:"LinkedIn URL",    earned:resume.linkedinUrl?5:0,                             max:5,  tip:"Add your LinkedIn profile URL",      icon:Linkedin },
    { label:"GitHub URL",      earned:resume.githubUrl?5:0,                               max:5,  tip:"Add your GitHub profile URL",        icon:Github },
  ];
  const circ=2*Math.PI*52;
  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.75)":"rgba(0,0,0,0.4)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:18, padding:28, width:520, maxHeight:"88vh", overflowY:"auto", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <h2 style={{ margin:0, fontSize:19, fontWeight:800, color:C.text, display:"flex", alignItems:"center", gap:8 }}>
              <BarChart3 size={20} color={C.purple} /> Resume Score Breakdown
            </h2>
            <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12 }}>See exactly what's boosting or lowering your score</p>
          </div>
          <button onClick={onClose} style={{ border:"none", background:C.card3, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:C.muted, display:"flex", alignItems:"center", gap:4 }}>
            <X size={16} />
          </button>
        </div>

        <div className="rb-score-row" style={{ display:"flex", alignItems:"center", gap:20, background:C.scoreBg, borderRadius:14, padding:"18px 22px", marginBottom:22, border:`1px solid ${C.border}` }}>
          <div style={{ position:"relative", width:110, height:110, flexShrink:0 }}>
            <svg width={110} height={110} style={{ transform:"rotate(-90deg)" }}>
              <circle cx={55} cy={55} r={52} fill="none" stroke={C.border} strokeWidth={10} />
              <circle cx={55} cy={55} r={52} fill="none" stroke={scoreColor} strokeWidth={10}
                strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round" style={{ transition:"stroke-dasharray 1s ease" }} />
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:26, fontWeight:900, color:scoreColor, lineHeight:1 }}>{score}</span>
              <span style={{ fontSize:10, color:C.muted, letterSpacing:0.8 }}>/ 100</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:5 }}>
              {score>=80?"Excellent! 🚀":score>=60?"Good job! 👍":score>=40?"Needs work 📝":"Just started 🌱"}
            </div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.65 }}>
              {score>=80?"Your resume is strong and ATS-ready.":score>=60?"A few more sections will boost your chances.":"Fill in more sections to make your resume stand out."}
            </div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {items.map((item,i) => {
            const filled = item.earned === item.max;
            const partial = item.earned > 0 && !filled;
            const ItemIcon = item.icon;
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 13px",
                background:filled?C.greenGlow:C.card3,
                border:`1px solid ${filled?C.green+(C.isDark?"44":"33"):C.border}`,
                borderRadius:10, transition:"all 0.2s",
              }}>
                <div style={{ width:28, height:28, borderRadius:7, background:filled?C.greenGlow:partial?"rgba(245,158,11,0.1)":C.redGlow, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <ItemIcon size={14} color={filled?C.green:partial?"#f59e0b":C.red} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:12, color:C.text }}>{item.label}</span>
                    <span style={{ fontSize:11, fontWeight:800, color:filled?C.green:partial?"#f59e0b":C.red }}>{item.earned}/{item.max} pts</span>
                  </div>
                  <div style={{ height:4, background:C.border, borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:99, background:filled?C.green:partial?"#f59e0b":C.border, width:`${(item.earned/item.max)*100}%`, transition:"width 0.6s ease" }} />
                  </div>
                  {!filled && <div style={{ fontSize:10, color:C.muted, marginTop:3, display:"flex", alignItems:"center", gap:4 }}><AlertCircle size={10} /> {item.tip}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── ATS Score Upload Modal ──────────────────────────────────────────────── */
function ATSScoreUploadModal({ userId, onClose }) {
  const C = useContext(ColorContext);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [dragging,setDragging]=useState(false);
  const [result,setResult]=useState(null);
  const fileRef=useRef();

  const handleFile=async(file)=>{
    if(!file||file.type!=="application/pdf"){ setError("Please upload a valid PDF file."); return; }
    setLoading(true); setError("");
    const reader=new FileReader();
    reader.onload=async(e)=>{
      const base64=e.target.result.split(",")[1];
      try {
        const res=await userService.aiParsePdf(userId,base64,file.name);
        const parsed=res.data;
        const fakeResume={ firstName:parsed.firstName||"X", email:parsed.email||"", phone:parsed.phone||"", city:parsed.city||"", profileSummary:parsed.profileSummary||"", workExperiences:parsed.workExperiences||[], educations:parsed.educations||[], skills:parsed.skills||[], projects:parsed.projects||[], certifications:parsed.certifications||[], linkedinUrl:parsed.linkedinUrl||"", githubUrl:parsed.githubUrl||"" };
        const score=calcScore(fakeResume);
        const atsOk=!!(fakeResume.email&&fakeResume.profileSummary&&fakeResume.skills.length>0&&fakeResume.workExperiences.length>0);
        setResult({ score, atsOk, name:`${parsed.firstName||""} ${parsed.lastName||""}`.trim(), jobTitle:parsed.jobTitle||"", skills:fakeResume.skills.length, workExp:fakeResume.workExperiences.length });
      } catch { setError("Could not analyse PDF. Please use a text-based PDF."); }
      finally { setLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.75)":"rgba(0,0,0,0.4)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:18, padding:28, width:460, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text, display:"flex", alignItems:"center", gap:8 }}>
              <Target size={18} color={C.orange} /> ATS Score Checker
            </h2>
            <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12 }}>Upload resume PDF for instant ATS analysis</p>
          </div>
          <button onClick={onClose} style={{ border:"none", background:C.card3, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:C.muted }}>
            <X size={16} />
          </button>
        </div>

        {!result&&!loading&&(
          <>
            <div
              onClick={()=>fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
              style={{ border:`2px dashed ${dragging?C.orange:C.border}`, borderRadius:14, padding:"44px 20px", textAlign:"center", cursor:"pointer", background:dragging?C.orangeGlow:C.dropBg, transition:"all 0.2s ease" }}
            >
              <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
              <div style={{ width:56, height:56, borderRadius:14, background:C.card3, border:`1px solid ${C.border}`, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FileText size={26} color={C.muted} />
              </div>
              <p style={{ fontWeight:700, color:C.text, margin:"0 0 5px", fontSize:14 }}>Drop your resume PDF here</p>
              <p style={{ color:C.muted, fontSize:11, margin:0 }}>or click to browse · PDF only</p>
            </div>
            {error && (
              <div style={{ padding:"10px 14px", background:C.redGlow, color:C.red, borderRadius:9, fontSize:12, marginTop:10, border:`1px solid rgba(248,113,113,0.25)`, display:"flex", alignItems:"center", gap:7 }}>
                <AlertCircle size={14} />{error}
              </div>
            )}
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <Btn onClick={onClose} variant="secondary" style={{ flex:1 }}>Cancel</Btn>
              <Btn onClick={()=>fileRef.current.click()} style={{ flex:2 }}><Upload size={13} /> Choose PDF</Btn>
            </div>
          </>
        )}

        {loading&&(
          <div style={{ textAlign:"center", padding:"36px 0" }}>
            <div style={{ width:52, height:52, margin:"0 auto 16px", borderRadius:"50%", border:`3px solid ${C.border}`, borderTop:`3px solid ${C.orange}` }} className="rb-spin" />
            <p style={{ fontWeight:700, color:C.text, margin:"0 0 5px" }}>Analysing your resume…</p>
            <p style={{ color:C.muted, fontSize:12, margin:0 }}>AI is reading every section</p>
          </div>
        )}

        {result&&(
          <div className="rb-animate-in">
            <div style={{ display:"flex", alignItems:"center", gap:16, background:C.scoreBg, borderRadius:14, padding:"16px 20px", marginBottom:16, border:`1px solid ${C.border}` }}>
              <ScoreCircle score={result.score} size={90} />
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:C.text, marginBottom:5 }}>{result.name||"Your Resume"}</div>
                {result.jobTitle&&<div style={{ fontSize:12, color:C.muted, marginBottom:9 }}>{result.jobTitle}</div>}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Badge bg={result.atsOk?C.greenGlow:C.redGlow} color={result.atsOk?C.green:C.red}>
                    {result.atsOk?<Check size={11}/>:<X size={11}/>} {result.atsOk?"ATS Friendly":"Not ATS Ready"}
                  </Badge>
                  <Badge bg={C.blueGlow} color={C.blue}><Zap size={10}/> {result.skills} skills</Badge>
                  <Badge bg={C.purpleGlow} color={C.purple}><Briefcase size={10}/> {result.workExp} exp</Badge>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={()=>setResult(null)} variant="secondary" style={{ flex:1 }}><RefreshCw size={13}/> Check Another</Btn>
              <Btn onClick={onClose} style={{ flex:1 }}><Check size={13}/> Done</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── AI Writing Assistant Modal ──────────────────────────────────────────── */
function AIWritingAssistantModal({ resume, onApply, onClose, userId }) {
  const C = useContext(ColorContext);
  const [section,setSection]=useState("profileSummary");
  const [input,setInput]=useState("");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const sections=[
    { id:"profileSummary",    label:"Profile Summary",        icon:FileText },
    { id:"workDescription",   label:"Work Experience Bullet", icon:Briefcase },
    { id:"projectDescription",label:"Project Description",    icon:FolderGit2 },
  ];
  const placeholders={
    profileSummary:"e.g. I'm a React developer with 2 years experience at a startup…",
    workDescription:"e.g. Built REST APIs using Spring Boot, worked on payment gateway…",
    projectDescription:"e.g. Built food delivery app with React and Node.js, real-time order tracking…",
  };
  const handleGenerate=async()=>{
    if(!input.trim()){ setError("Please describe your experience first."); return; }
    setLoading(true); setError(""); setResult("");
    try {
      const res=await userService.aiWriteSection(userId,section,input);
      const text=res.data?.text||"";
      if(!text)throw new Error("No response");
      setResult(text.trim());
    } catch { setError("Generation failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.75)":"rgba(0,0,0,0.4)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:18, padding:28, width:540, maxHeight:"88vh", overflowY:"auto", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text, display:"flex", alignItems:"center", gap:8 }}>
              <Brain size={18} color={C.purple} /> AI Writing Assistant
            </h2>
            <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12 }}>Describe in plain words — AI will rewrite professionally</p>
          </div>
          <button onClick={onClose} style={{ border:"none", background:C.card3, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:C.muted }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display:"flex", gap:7, marginBottom:20, overflowX:"auto" }}>
          {sections.map(s=>{
            const SI = s.icon;
            return (
              <button key={s.id} onClick={()=>{setSection(s.id);setResult("");setError("");}}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:9, border:`2px solid ${section===s.id?C.orange:C.border}`, background:section===s.id?C.orangeGlow:C.card3, color:section===s.id?C.orange:C.muted, fontWeight:700, fontSize:11, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all 0.15s ease" }}>
                <SI size={13} />{s.label}
              </button>
            );
          })}
        </div>

        <Input label="Describe in your own words" value={input} onChange={setInput} placeholder={placeholders[section]} multiline />

        {error&&(
          <div style={{ padding:"10px 14px", background:C.redGlow, color:C.red, borderRadius:9, fontSize:12, marginBottom:12, border:`1px solid rgba(248,113,113,0.25)`, display:"flex", alignItems:"center", gap:7 }}>
            <AlertCircle size={14} />{error}
          </div>
        )}

        <Btn onClick={handleGenerate} disabled={loading} style={{ width:"100%", background:loading?C.border:`linear-gradient(135deg,${C.purple},${C.orange})`, fontSize:13, padding:"11px", marginBottom:result?14:0 }}>
          {loading?<><Loader2 size={14} className="rb-spin" /> AI is writing…</>:<><Sparkles size={14} /> Generate Professional Text</>}
        </Btn>

        {result&&(
          <div className="rb-animate-in">
            <label style={{ display:"block", fontSize:10, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.8 }}>AI Result — click to copy</label>
            <div onClick={()=>navigator.clipboard?.writeText(result)}
              style={{ background:C.resultBg, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"13px 15px", fontSize:12, color:C.text, lineHeight:1.75, whiteSpace:"pre-line", marginBottom:12, cursor:"pointer", transition:"border-color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.orange}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
            >
              {result}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={()=>navigator.clipboard?.writeText(result)} variant="secondary" style={{ flex:1 }}><FileText size={13}/> Copy Text</Btn>
              {section==="profileSummary"&&(
                <Btn onClick={()=>{ onApply("profileSummary",result); onClose(); }} variant="green" style={{ flex:1 }}><Check size={13}/> Apply to Resume</Btn>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Homepage ────────────────────────────────────────────────────────────── */
function HomePage({ onCreateResume, resumes, onFeatureClick }) {
  const C = useContext(ColorContext);

  const stats = [
    { num:"50K+", label:"Resumes Created",  icon:FileText },
    { num:"98%",  label:"ATS Pass Rate",    icon:Target },
    { num:"10",   label:"Pro Templates",    icon:LayoutTemplate },
    { num:"3x",   label:"More Interviews",  icon:TrendingUp },
  ];

  const features = [
    { icon:Sparkles, title:"AI Resume Generation",  desc:"Describe your role — AI writes a complete ATS-optimised resume in 60 seconds.", action:"ai",      gradient:`linear-gradient(135deg,${C.purple},${C.orange})`, glow:C.purpleGlow },
    { icon:Linkedin, title:"LinkedIn Import",        desc:"Download your LinkedIn PDF and upload it — AI extracts your real work history automatically.", action:"linkedin", gradient:"linear-gradient(135deg,#0077b5,#0891b2)", glow:"rgba(0,119,181,0.15)" },
    { icon:FileUp,   title:"Upload Your Resume",     desc:"Already have a resume? Upload your PDF and AI will extract every section.", action:"pdf",       gradient:`linear-gradient(135deg,${C.green},#0891b2)`, glow:C.greenGlow },
    { icon:PenLine,  title:"Build from Scratch",     desc:"Prefer full control? Use our guided editor to build a stunning resume section by section.", action:"manual",  gradient:"linear-gradient(135deg,#4b5563,#374151)", glow:"rgba(75,85,99,0.15)" },
  ];

  const steps = [
    { num:"01", title:"Choose your method",  desc:"AI generate, LinkedIn PDF import, resume upload, or manual — pick what works for you." },
    { num:"02", title:"Pick a template",     desc:"Select from 10 professionally designed, ATS-friendly templates." },
    { num:"03", title:"Customise & refine",  desc:"Edit every section, get AI suggestions, and check your ATS score in real time." },
    { num:"04", title:"Download & apply",    desc:"Export your polished resume as a PDF and start applying with confidence." },
  ];

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh" }}>

      {/* Hero */}
      <div className="rb-hero" style={{ position:"relative", overflow:"hidden", padding:"80px 32px 88px", borderBottom:`1px solid ${C.border}` }}>
        {/* Gradient bg layers */}
        <div style={{ position:"absolute", inset:0, background:C.isDark?"linear-gradient(135deg,#0a0a20 0%,#080812 50%,#0f0a20 100%)":"linear-gradient(135deg,#f8f8ff 0%,#f4f4f8 50%,#eff0ff 100%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-80, right:-80, width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,${C.orangeGlow} 0%,transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-100, left:-60, width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle,${C.purpleGlow} 0%,transparent 70%)`, pointerEvents:"none" }} />

        <div style={{ maxWidth:860, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px 5px 10px", borderRadius:999, background:C.orangeGlow, border:`1px solid ${C.isDark?"rgba(249,115,22,0.3)":"rgba(234,106,10,0.25)"}`, marginBottom:26 }}>
            <div style={{ width:20, height:20, borderRadius:"50%", background:`linear-gradient(135deg,${C.orange},${C.orangeD})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Target size={11} color="#fff" />
            </div>
            <span style={{ fontSize:11, color:C.orange, fontWeight:700, letterSpacing:0.5 }}>AI-Powered · ATS-Optimised · Get Hired Faster</span>
          </div>
          <h1
  className="font-black leading-[1.05] tracking-[-1px]"
  style={{
    fontSize: "clamp(1.5rem, 4vw, 4rem)",
    color: C.text,
    margin: "0 0 20px",
    wordBreak: "break-word",
  }}
>
  Build your{" "}
  
  <span
    style={{
      color: C.orange,
      display: "inline",
      whiteSpace: "normal",
    }}
  >
    winning resume
  </span>

  <br />

  in minutes
</h1>
          <p style={{ fontSize:17, color:C.muted, maxWidth:540, margin:"0 auto 40px", lineHeight:1.75 }}>
            From AI generation to LinkedIn PDF import — ILM ORA Resume Builder creates professional, ATS-friendly resumes that land you interviews.
          </p>

          <div className="rb-hero-btns" style={{ display:"flex", gap:13, justifyContent:"center", flexWrap:"wrap", marginBottom:54 }}>
            <Btn onClick={()=>onCreateResume("ai")} size="lg" style={{ boxShadow:`0 6px 24px ${C.orangeGlow}`, fontSize:15 }}>
              <Sparkles size={17} /> Generate with AI
            </Btn>
            <Btn onClick={()=>onCreateResume("manual")} size="lg" variant="secondary" style={{ fontSize:15 }}>
              <PenLine size={16} /> Start from Scratch
            </Btn>
          </div>

          <div className="rb-stats-row" style={{ display:"flex", gap:32, justifyContent:"center", flexWrap:"wrap" }}>
            {stats.map((s,i)=>{
              const SI = s.icon;
              return (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginBottom:4 }}>
                    <SI size={14} color={C.orange} />
                    <span className="rb-stat-num" style={{ fontSize:26, fontWeight:900, color:C.orange, lineHeight:1 }}>{s.num}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.muted, fontWeight:500 }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* My Resumes */}
      {resumes.length>0&&(
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"52px 24px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26, flexWrap:"wrap", gap:12 }}>
            <div>
              <h2 style={{ fontSize:22, fontWeight:900, color:C.text, margin:"0 0 3px", display:"flex", alignItems:"center", gap:9 }}>
                <FileText size={20} color={C.orange} /> My Resumes
              </h2>
              <p style={{ color:C.muted, fontSize:13, margin:0 }}>{resumes.length} resume{resumes.length!==1?"s":""} · Click to edit</p>
            </div>
            <Btn onClick={()=>onCreateResume("ai")}><Plus size={14}/> New Resume</Btn>
          </div>
          <div className="rb-resumes-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18 }}>
            {resumes.map(r=>{
              const sc=r.resumeScore||calcScore(r);
              const scColor=sc>=80?C.green:sc>=50?"#f59e0b":C.red;
              const tmpl=TEMPLATES.find(t=>t.id===r.templateName);
              return (
                <div key={r.id} className="rb-card-hover" style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.shadowCard }}>
                  <div style={{ height:164, background:C.previewThumbBg, overflow:"hidden", position:"relative", cursor:"pointer" }} onClick={()=>onCreateResume("edit",r)}>
                    <div style={{ transform:"scale(0.27)", transformOrigin:"top left", width:"370%", pointerEvents:"none" }}>
                      <ResumePreview r={r} />
                    </div>
                    <div style={{ position:"absolute", top:9, right:9 }}>
                      <Badge bg={scColor+"22"} color={scColor}>{sc}%</Badge>
                    </div>
                    {r.isAtsFriendly&&<div style={{ position:"absolute", top:9, left:9 }}>
                      <Badge bg={C.orangeGlow} color={C.orange}><Shield size={9}/> ATS</Badge>
                    </div>}
                  </div>
                  <div style={{ padding:"13px 15px" }}>
                    <div style={{ fontWeight:800, fontSize:13, color:C.text, marginBottom:3 }}>{r.title}</div>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:9 }}>
                      {r.firstName} {r.lastName}{r.jobTitle&&<span> · {r.jobTitle}</span>}
                      {tmpl&&<span style={{ marginLeft:7, color:tmpl.accent, fontWeight:600, display:"inline-flex", alignItems:"center", gap:3 }}><Layers size={9}/> {tmpl.name}</span>}
                    </div>
                    <div style={{ height:3, background:C.border, borderRadius:99, marginBottom:11, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:99, background:scColor, width:`${sc}%`, transition:"width 0.6s ease" }} />
                    </div>
                    <div style={{ display:"flex", gap:7 }}>
                      <Btn onClick={()=>onCreateResume("edit",r)} variant="secondary" size="sm" style={{ flex:1, border:`1px solid ${C.border}` }}>
                        <Edit3 size={12}/> Edit
                      </Btn>
                      <Btn onClick={()=>onCreateResume("download",r)} variant="ghost" size="sm" title="Download PDF">
                        <Download size={13}/>
                      </Btn>
                      <Btn onClick={()=>onCreateResume("delete",r)} variant="danger" size="sm" title="Delete">
                        <Trash2 size={13}/>
                      </Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4 Ways */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"60px 24px 0" }}>
        <div style={{ textAlign:"center", marginBottom:42 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.orange, letterSpacing:2.5, textTransform:"uppercase", marginBottom:9 }}>4 Ways to Build</div>
          <h2 style={{ fontSize:30, fontWeight:900, color:C.text, margin:"0 0 10px", letterSpacing:-0.5 }}>Choose your fastest path</h2>
        </div>
        <div className="rb-features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18 }}>
          {features.map((f,i)=>{
            const FI = f.icon;
            return (
              <div key={i} className="rb-card-hover" onClick={()=>onCreateResume(f.action)}
                style={{ background:C.card, borderRadius:16, padding:"26px 22px", cursor:"pointer", border:`1px solid ${C.border}`, boxShadow:C.shadowCard, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-30, right:-30, width:90, height:90, borderRadius:"50%", background:f.gradient, opacity:0.12, pointerEvents:"none" }} />
                <div style={{ width:52, height:52, borderRadius:13, background:f.gradient, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:15, boxShadow:`0 4px 18px ${f.glow}` }}>
                  <FI size={24} color="#fff" />
                </div>
                <h3 style={{ fontSize:15, fontWeight:800, color:C.text, margin:"0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize:12, color:C.muted, margin:"0 0 15px", lineHeight:1.65 }}>{f.desc}</p>
                <span style={{ fontSize:12, fontWeight:700, color:C.orange, display:"flex", alignItems:"center", gap:4 }}>
                  Get started <ChevronRight size={13}/>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background:C.card, margin:"60px 0 0", padding:"56px 24px", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:42 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.orange, letterSpacing:2.5, textTransform:"uppercase", marginBottom:9 }}>Simple Process</div>
            <h2 style={{ fontSize:30, fontWeight:900, color:C.text, margin:"0 0 10px", letterSpacing:-0.5 }}>How it works</h2>
          </div>
          <div className="rb-steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:22 }}>
            {steps.map((step,i)=>(
              <div key={i} style={{ textAlign:"center", padding:"22px 16px" }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:C.orangeGlow, border:`2px solid ${C.orange}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:16, fontWeight:900, color:C.orange, fontFamily:"monospace" }}>{step.num}</div>
                <h3 style={{ fontSize:14, fontWeight:800, color:C.text, margin:"0 0 8px" }}>{step.title}</h3>
                <p style={{ fontSize:12, color:C.muted, margin:0, lineHeight:1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Gallery */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"60px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:38 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.orange, letterSpacing:2.5, textTransform:"uppercase", marginBottom:9 }}>Templates</div>
          <h2 style={{ fontSize:30, fontWeight:900, color:C.text, margin:"0 0 10px", letterSpacing:-0.5 }}>10 stunning designs</h2>
        </div>
        <div className="rb-template-gallery-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:14 }}>
          {TEMPLATES.map(t=>{
            const dummyData={...DUMMY_RESUME,templateName:t.id};
            return (
              <div key={t.id} className="rb-card-hover" onClick={()=>onCreateResume("template")}
                style={{ cursor:"pointer", borderRadius:11, overflow:"hidden", border:`2px solid ${C.border}`, background:C.card, boxShadow:C.shadowCard }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=t.accent; e.currentTarget.style.boxShadow=`0 8px 24px ${t.accent}30`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow=C.shadowCard; }}>
                <div style={{ height:140, overflow:"hidden", background:C.previewThumbBg, position:"relative" }}>
                  <div style={{ transform:"scale(0.22)", transformOrigin:"top left", width:"454%", pointerEvents:"none" }}><ResumePreview r={dummyData} /></div>
                  <div style={{ position:"absolute", top:6, left:6 }}>
                    <Badge bg={t.accent+"22"} color={t.accent}>{t.tag}</Badge>
                  </div>
                </div>
                <div style={{ padding:"9px 11px", borderTop:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:t.accent, flexShrink:0 }} />
                    <div>
                      <div style={{ fontWeight:700, fontSize:11, color:C.text }}>{t.name}</div>
                      <div style={{ fontSize:9, color:C.muted }}>{t.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:C.isDark?"linear-gradient(135deg,#0a0a20,#080812)":C.card, padding:"56px 24px", textAlign:"center", borderTop:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:540, margin:"0 auto" }}>
          <h2 style={{ fontSize:30, fontWeight:900, color:C.text, margin:"0 0 13px", letterSpacing:-0.5 }}>Ready to land your dream job?</h2>
          <p style={{ color:C.muted, fontSize:15, margin:"0 0 30px" }}>Join thousands of students who've built career-defining resumes with ILM ORA.</p>
          <Btn onClick={()=>onCreateResume("ai")} size="lg" style={{ boxShadow:`0 6px 24px ${C.orangeGlow}`, fontSize:15 }}>
            <Sparkles size={17}/> Create My Resume Now
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── Save Name Modal ─────────────────────────────────────────────────────── */
function SaveNameModal({ defaultName, onConfirm, onCancel }) {
  const C = useContext(ColorContext);
  const [name,setName]=useState(defaultName||"My Resume");
  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.75)":"rgba(0,0,0,0.4)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:16, padding:"30px 32px", width:400, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ width:52, height:52, borderRadius:13, background:C.orangeGlow, border:`1px solid ${C.isDark?"rgba(249,115,22,0.3)":"rgba(234,106,10,0.25)"}`, margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Save size={24} color={C.orange} />
        </div>
        <h2 style={{ textAlign:"center", fontSize:18, fontWeight:800, color:C.text, marginBottom:5 }}>Save Resume</h2>
        <p style={{ textAlign:"center", color:C.muted, fontSize:12, marginBottom:20 }}>Enter a name for your resume</p>
        <Input value={name} onChange={setName} placeholder="e.g. My-Resume" />
        <div style={{ display:"flex", gap:10, marginTop:10 }}>
          <Btn onClick={onCancel} variant="secondary" style={{ flex:1 }}>Cancel</Btn>
          <Btn onClick={()=>name.trim()&&onConfirm(name.trim())} disabled={!name.trim()} style={{ flex:2 }}>
            <Save size={13}/> Save Resume
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── AI Generate Modal ───────────────────────────────────────────────────── */
function AIGenerateModal({ userId, onClose, onApply }) {
  const C = useContext(ColorContext);
  const [step,setStep]=useState(1);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [template,setTemplate]=useState("summit");
  const [jobTitle,setJobTitle]=useState("");
  const [selectedLevel,setSelectedLevel]=useState("mid");
  const [skills,setSkills]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [loadMsg,setLoadMsg]=useState("");

  const chosenLevel=EXPERIENCE_LEVELS.find(l=>l.id===selectedLevel)||EXPERIENCE_LEVELS[2];

  const handleGenerate=async()=>{
    if(!jobTitle.trim()){ setError("Please enter a target job title"); return; }
    setLoading(true); setError("");
    setLoadMsg("AI is generating your complete resume…");
    setTimeout(()=>setLoadMsg("Writing ATS-optimised profile summary…"),12000);
    setTimeout(()=>setLoadMsg("Building skills, projects & certifications…"),25000);
    try {
      const res=await userService.aiGenerateResume(userId,name,email,"",jobTitle,chosenLevel.years,skills,template);
      const data=res.data; data.templateName=template;
      onApply(data); onClose();
    } catch(e) { setError(e?.response?.data?.message||"AI generation failed."); setLoading(false); }
  };

  if(loading)return <LoadingOverlay message="AI is building your resume…" subMessage={loadMsg} />;

  const errBox=error&&(
    <div style={{ padding:"10px 14px", background:C.redGlow, color:C.red, borderRadius:9, fontSize:12, marginBottom:12, border:`1px solid rgba(248,113,113,0.25)`, display:"flex", alignItems:"center", gap:7 }}>
      <AlertCircle size={14}/>{error}
    </div>
  );

  const StepBar=()=>(
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:24 }}>
      {[1,2,3].map(n=>(
        <div key={n} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:step>=n?`linear-gradient(135deg,${C.orange},${C.orangeD})`:C.card3, border:`2px solid ${step>=n?C.orange:C.border}`, color:step>=n?"#fff":C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, boxShadow:step===n?`0 0 0 5px ${C.orangeGlow}`:"none", transition:"all 0.2s" }}>
            {step>n?<Check size={14}/>:n}
          </div>
          {n<3&&<div style={{ width:44, height:2, background:step>n?C.orange:C.border, transition:"background 0.3s" }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.45)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(6px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:20, padding:"30px 34px", width:520, boxShadow:C.shadow, maxHeight:"92vh", overflowY:"auto", border:`1px solid ${C.border}` }}>
        <StepBar />
        {step===1&&(
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ width:60, height:60, borderRadius:15, background:C.orangeGlow, border:`1px solid ${C.isDark?"rgba(249,115,22,0.3)":"rgba(234,106,10,0.25)"}`, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <User size={28} color={C.orange} />
              </div>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.text }}>Who are you?</h2>
              <p style={{ color:C.muted, fontSize:12, marginTop:6 }}>Basic details to personalise your resume.</p>
            </div>
            <Input label="Your Full Name *" value={name} onChange={setName} placeholder="e.g. Rahul Sharma" />
            <Input label="Your Email *" value={email} onChange={setEmail} placeholder="e.g. rahul@email.com" type="email" />
            {errBox}
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <Btn onClick={onClose} variant="secondary" style={{ flex:1 }}>Cancel</Btn>
              <Btn onClick={()=>{ if(!name.trim()||!email.trim()){setError("Please enter name and email");return;} setError("");setStep(2); }} style={{ flex:2 }}>Continue <ChevronRight size={14}/></Btn>
            </div>
          </>
        )}
        {step===2&&(
          <>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ width:60, height:60, borderRadius:15, background:C.purpleGlow, border:`1px solid rgba(167,139,250,0.25)`, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <LayoutTemplate size={28} color={C.purple} />
              </div>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.text }}>Choose a Template</h2>
            </div>
            <div className="rb-ai-step-grid" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:16 }}>
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>setTemplate(t.id)}
                  style={{ border:`2px solid ${template===t.id?t.accent:C.border}`, borderRadius:9, background:template===t.id?t.accent+"15":C.card3, cursor:"pointer", padding:"8px 5px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontFamily:"inherit", transition:"all 0.15s" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:t.accent }} />
                  <span style={{ fontSize:9, fontWeight:700, color:template===t.id?t.accent:C.muted }}>{t.name}</span>
                </button>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <Btn onClick={()=>{setError("");setStep(1);}} variant="secondary" style={{ flex:1 }}><ArrowLeft size={14}/> Back</Btn>
              <Btn onClick={()=>{setError("");setStep(3);}} style={{ flex:2 }}>Continue <ChevronRight size={14}/></Btn>
            </div>
          </>
        )}
        {step===3&&(
          <>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ width:60, height:60, borderRadius:15, background:C.blueGlow, border:`1px solid rgba(96,165,250,0.25)`, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Target size={28} color={C.blue} />
              </div>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.text }}>Target Role</h2>
              <p style={{ color:C.muted, fontSize:12, marginTop:6 }}>AI will generate a complete ATS-optimised resume.</p>
            </div>
            <Input label="Target Job Title *" value={jobTitle} onChange={setJobTitle} placeholder="e.g. Full Stack Developer" />
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:10, fontWeight:700, color:C.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>Experience Level</label>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {EXPERIENCE_LEVELS.map(lvl=>(
                  <button key={lvl.id} onClick={()=>setSelectedLevel(lvl.id)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 15px", borderRadius:10, border:`2px solid ${selectedLevel===lvl.id?C.orange:C.border}`, background:selectedLevel===lvl.id?C.orangeGlow:C.card3, cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all 0.15s ease" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                      <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${selectedLevel===lvl.id?C.orange:C.border}`, background:selectedLevel===lvl.id?C.orange:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                        {selectedLevel===lvl.id&&<div style={{ width:5, height:5, borderRadius:"50%", background:"#fff" }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:12, color:selectedLevel===lvl.id?C.orange:C.text }}>{lvl.label}</div>
                        <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{lvl.desc}</div>
                      </div>
                    </div>
                    <Badge bg={selectedLevel===lvl.id?C.orangeGlow:C.card} color={selectedLevel===lvl.id?C.orange:C.muted}>{lvl.badge}</Badge>
                  </button>
                ))}
              </div>
            </div>
            <Input label="Key Skills (comma-separated)" value={skills} onChange={setSkills} placeholder="e.g. React, Java, MySQL, AWS" />
            <div style={{ background:C.orangeGlow, border:`1px solid ${C.isDark?"rgba(249,115,22,0.25)":"rgba(234,106,10,0.2)"}`, borderRadius:9, padding:"10px 13px", marginBottom:14, fontSize:11, color:C.orange, display:"flex", alignItems:"center", gap:7 }}>
              <Sparkles size={13}/> AI will generate resume tailored for <strong>{chosenLevel.label}</strong> ({chosenLevel.badge})
            </div>
            {errBox}
            <div style={{ display:"flex", gap:10, marginTop:6 }}>
              <Btn onClick={()=>{setError("");setStep(2);}} variant="secondary" style={{ flex:1 }}><ArrowLeft size={14}/> Back</Btn>
              <Btn onClick={handleGenerate} style={{ flex:2, background:`linear-gradient(135deg,${C.purple},${C.orange})` }}>
                <Sparkles size={14}/> Generate Full Resume
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── LinkedIn PDF Import Modal ───────────────────────────────────────────── */
function LinkedInScrapeModal({ userId, onClose, onApply }) {
  const C = useContext(ColorContext);
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [dragging,setDragging]=useState(false);
  const [fileName,setFileName]=useState("");
  const [base64Pdf,setBase64Pdf]=useState("");
  const [jobTitle,setJobTitle]=useState("");
  const [selectedCategory,setSelectedCategory]=useState("None / Custom");
  const [skillPool,setSkillPool]=useState([]);
  const [selectedSkills,setSelectedSkills]=useState([]);
  const [customSkill,setCustomSkill]=useState("");
  const [template,setTemplate]=useState("summit");
  const fileRef=useRef();

  const handleFile=(file)=>{
    if(!file||file.type!=="application/pdf"){ setError("Please upload a valid PDF file."); return; }
    if(file.size>10*1024*1024){ setError("File too large. Max 10 MB."); return; }
    setError(""); setFileName(file.name);
    const reader=new FileReader();
    reader.onload=(e)=>{ const b64=e.target.result.split(",")[1]; setBase64Pdf(b64); setStep(2); };
    reader.onerror=()=>setError("Failed to read file.");
    reader.readAsDataURL(file);
  };
  const handleCategoryChange=(cat)=>{ setSelectedCategory(cat); const pool=SKILL_SETS[cat]||[]; setSkillPool(pool); setSelectedSkills([...pool]); };
  const toggleSkill=(skill)=>setSelectedSkills(prev=>prev.includes(skill)?prev.filter(s=>s!==skill):[...prev,skill]);
  const addCustomSkill=()=>{ const s=customSkill.trim(); if(!s)return; if(!skillPool.includes(s))setSkillPool(p=>[...p,s]); if(!selectedSkills.includes(s))setSelectedSkills(p=>[...p,s]); setCustomSkill(""); };
  const handleImport=async()=>{
    if(!base64Pdf){ setError("Please upload your LinkedIn PDF first."); return; }
    setLoading(true); setError("");
    try {
      const res=await userService.linkedInScrape(userId,null,jobTitle,selectedSkills.join(", "),template,base64Pdf,fileName);
      const data=res.data; data.templateName=template;
      onApply(data); onClose();
    } catch(e) { setError(e?.response?.data?.message||e?.response?.data?.error||"Import failed. Please try again."); }
    finally { setLoading(false); }
  };

  if(loading)return <LoadingOverlay message="Reading your LinkedIn PDF…" subMessage="AI is extracting your work history. This may take 30–60s." />;

  const errBox = error&&(
    <div style={{ padding:"10px 14px", background:C.redGlow, color:C.red, borderRadius:9, fontSize:12, marginBottom:12, border:`1px solid rgba(248,113,113,0.25)`, display:"flex", alignItems:"center", gap:7 }}>
      <AlertCircle size={14}/>{error}
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.45)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(6px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:20, width:540, maxHeight:"92vh", overflowY:"auto", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ background:"linear-gradient(135deg,#0077b5,#0891b2)", borderRadius:"18px 18px 0 0", padding:"22px 26px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#fff", display:"flex", alignItems:"center", gap:8 }}>
                <Linkedin size={18}/> Import from LinkedIn
              </h2>
              <p style={{ margin:"4px 0 0", fontSize:12, color:"rgba(255,255,255,0.75)" }}>{step===1?"Upload your LinkedIn profile PDF":"Customize your import settings"}</p>
            </div>
            <button onClick={onClose} style={{ border:"none", background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"6px 10px", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center" }}>
              <X size={16}/>
            </button>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:16, alignItems:"center" }}>
            {[1,2].map(n=>(
              <div key={n} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:step>=n?"#fff":"rgba(255,255,255,0.2)", color:step>=n?"#0077b5":"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{step>n?<Check size={12}/>:n}</div>
                <span style={{ fontSize:11, opacity:step>=n?1:0.65, fontWeight:600, color:"#fff" }}>{n===1?"Upload PDF":"Customize"}</span>
                {n<2&&<div style={{ width:22, height:1.5, background:"rgba(255,255,255,0.3)" }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding:"24px 26px 22px" }}>
          {step===1&&(
            <>
              <div style={{ background:C.orangeGlow, border:`1px solid ${C.isDark?"rgba(249,115,22,0.25)":"rgba(234,106,10,0.2)"}`, borderRadius:10, padding:"12px 15px", marginBottom:20, fontSize:11, color:C.orange, lineHeight:1.65 }}>
                <div style={{ fontWeight:700, marginBottom:4, display:"flex", alignItems:"center", gap:6 }}><Linkedin size={13}/> How to download your LinkedIn PDF:</div>
                <ol style={{ margin:0, paddingLeft:18 }}>
                  <li>Go to your LinkedIn profile</li>
                  <li>Click <strong>"More"</strong> → <strong>"Save to PDF"</strong></li>
                  <li>Upload that PDF below</li>
                </ol>
              </div>
              <div
                onClick={()=>fileRef.current.click()}
                onDragOver={e=>{e.preventDefault();setDragging(true);}}
                onDragLeave={()=>setDragging(false)}
                onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
                style={{ border:`2px dashed ${dragging?C.orange:C.border}`, borderRadius:14, padding:"44px 20px", textAlign:"center", cursor:"pointer", background:dragging?C.orangeGlow:C.dropBg, transition:"all 0.2s ease" }}
              >
                <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
                <div style={{ width:56, height:56, borderRadius:14, background:C.card3, border:`1px solid ${C.border}`, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Linkedin size={26} color="#0077b5"/>
                </div>
                <p style={{ fontWeight:700, color:C.text, margin:"0 0 5px", fontSize:14 }}>Drop your LinkedIn PDF here</p>
                <p style={{ color:C.muted, fontSize:11, margin:0 }}>or click to browse · PDF only · Max 10 MB</p>
              </div>
              {errBox}
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <Btn onClick={onClose} variant="secondary" style={{ flex:1 }}>Cancel</Btn>
                <Btn onClick={()=>fileRef.current.click()} style={{ flex:2, background:"linear-gradient(135deg,#0077b5,#0891b2)" }}>
                  <Upload size={13}/> Choose LinkedIn PDF
                </Btn>
              </div>
            </>
          )}
          {step===2&&(
            <>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:C.greenGlow, border:`1px solid ${C.isDark?"rgba(34,197,94,0.25)":"rgba(22,163,74,0.2)"}`, borderRadius:10, padding:"10px 14px", marginBottom:20 }}>
                <Check size={16} color={C.green}/>
                <div>
                  <div style={{ fontWeight:700, fontSize:12, color:C.green }}>PDF uploaded successfully</div>
                  <div style={{ fontSize:10, color:C.muted }}>{fileName}</div>
                </div>
                <button onClick={()=>{setStep(1);setBase64Pdf("");setFileName("");}} style={{ marginLeft:"auto", border:"none", background:"transparent", color:C.muted, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
                  <RefreshCw size={11}/> Change
                </button>
              </div>
              <Input label="Target Job Title (optional)" value={jobTitle} onChange={setJobTitle} placeholder="e.g. Senior Full Stack Developer" />
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.8 }}>Skill Set / Tech Stack</label>
                <select value={selectedCategory} onChange={e=>handleCategoryChange(e.target.value)}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.inputBorder}`, fontSize:12, background:C.inputBg, color:C.text, fontFamily:"inherit", outline:"none", cursor:"pointer", boxSizing:"border-box" }}>
                  {Object.keys(SKILL_SETS).map(cat=><option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              {skillPool.length>0&&(
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:0.8 }}>Select Skills</label>
                    <div style={{ display:"flex", gap:9 }}>
                      <button onClick={()=>setSelectedSkills([...skillPool])} style={{ border:"none", background:"transparent", color:C.orange, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>All</button>
                      <button onClick={()=>setSelectedSkills([])} style={{ border:"none", background:"transparent", color:C.muted, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Clear</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, maxHeight:140, overflowY:"auto", padding:"2px 0" }}>
                    {skillPool.map(skill=>{
                      const sel=selectedSkills.includes(skill);
                      return (
                        <button key={skill} onClick={()=>toggleSkill(skill)}
                          style={{ padding:"4px 11px", borderRadius:999, border:`1.5px solid ${sel?C.orange:C.border}`, background:sel?C.orangeGlow:C.card3, color:sel?C.orange:C.muted, fontSize:11, fontWeight:sel?700:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s ease", display:"flex", alignItems:"center", gap:4 }}>
                          {sel&&<Check size={10}/>}{skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.8 }}>Add Custom Skill</label>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={customSkill} onChange={e=>setCustomSkill(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomSkill()} placeholder="e.g. Kafka, Redis…"
                    style={{ flex:1, padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.inputBorder}`, fontSize:12, fontFamily:"inherit", background:C.inputBg, color:C.text, outline:"none" }} />
                  <Btn onClick={addCustomSkill} size="sm"><Plus size={12}/> Add</Btn>
                </div>
              </div>
              {errBox}
              <div style={{ display:"flex", gap:10 }}>
                <Btn onClick={()=>{setStep(1);setError("");}} variant="secondary" style={{ flex:1 }}><ArrowLeft size={14}/> Back</Btn>
                <Btn onClick={handleImport} style={{ flex:2, background:"linear-gradient(135deg,#0077b5,#0891b2)" }}>
                  <Linkedin size={13}/> Generate from LinkedIn
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── PDF Upload Modal ────────────────────────────────────────────────────── */
function PDFUploadModal({ userId, onClose, onApply }) {
  const C = useContext(ColorContext);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [dragging,setDragging]=useState(false);
  const [fileName,setFileName]=useState("");
  const fileRef=useRef();

  const handleFile=async(file)=>{
    if(!file||file.type!=="application/pdf"){ setError("Please upload a valid PDF file."); return; }
    if(file.size>10*1024*1024){ setError("File too large. Max 10 MB."); return; }
    setLoading(true); setError(""); setFileName(file.name);
    const reader=new FileReader();
    reader.onload=async(e)=>{
      const base64=e.target.result.split(",")[1];
      try { const res=await userService.aiParsePdf(userId,base64,file.name); onApply(res.data); onClose(); }
      catch { setError("Could not extract data. Please try a text-based PDF."); }
      finally { setLoading(false); }
    };
    reader.onerror=()=>{ setLoading(false); setError("Failed to read file."); };
    reader.readAsDataURL(file);
  };

  if(loading)return <LoadingOverlay message="AI is reading your resume…" subMessage={`Extracting all sections from ${fileName}. This may take 20–40 seconds.`} />;

  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.45)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(6px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:18, padding:28, width:460, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ width:60, height:60, borderRadius:15, background:C.greenGlow, border:`1px solid ${C.isDark?"rgba(34,197,94,0.25)":"rgba(22,163,74,0.2)"}`, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FileUp size={28} color={C.green} />
          </div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.text }}>Upload Your Resume</h2>
          <p style={{ color:C.muted, fontSize:12, marginTop:6 }}>AI extracts every job, skill, education, project and certification from your PDF.</p>
        </div>
        <div
          onClick={()=>!loading&&fileRef.current.click()}
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
          style={{ border:`2px dashed ${dragging?C.orange:C.border}`, borderRadius:14, padding:"44px 20px", textAlign:"center", cursor:"pointer", background:dragging?C.orangeGlow:C.dropBg, transition:"all 0.2s ease" }}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          <div style={{ width:56, height:56, borderRadius:14, background:C.card3, border:`1px solid ${C.border}`, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Upload size={26} color={C.muted} />
          </div>
          <p style={{ fontWeight:700, color:C.text, margin:"0 0 5px", fontSize:14 }}>Drop PDF here or click to browse</p>
          <p style={{ color:C.muted, fontSize:11, margin:0 }}>PDF only · Max 10 MB · Text-based PDFs work best</p>
        </div>
        {error&&(
          <div style={{ padding:"10px 14px", background:C.redGlow, color:C.red, borderRadius:9, fontSize:12, marginTop:12, border:`1px solid rgba(248,113,113,0.25)`, display:"flex", alignItems:"center", gap:7 }}>
            <AlertCircle size={14}/>{error}
          </div>
        )}
        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <Btn onClick={onClose} variant="secondary" style={{ flex:1 }}>Cancel</Btn>
          <Btn onClick={()=>fileRef.current.click()} style={{ flex:2, background:`linear-gradient(135deg,${C.green},#0891b2)` }}>
            <FileUp size={13}/> Choose PDF File
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── ATS Tips Panel ──────────────────────────────────────────────────────── */
function ATSTipsPanel({ userId, resume, onClose }) {
  const C = useContext(ColorContext);
  const [tips,setTips]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{ userService.aiGetAtsTips(userId,resume).then(res=>{setTips(res.data);setLoading(false);}).catch(()=>{setError("Failed to get ATS tips.");setLoading(false);}); },[]);
  const typeStyle={
    error:  { bg:C.redGlow,    color:C.red,    icon:AlertCircle },
    warning:{ bg:"rgba(245,158,11,0.1)", color:"#f59e0b", icon:AlertCircle },
    success:{ bg:C.greenGlow,  color:C.green,  icon:Check },
  };

  return (
    <div style={{ position:"fixed", inset:0, background:C.isDark?"rgba(0,0,0,0.75)":"rgba(0,0,0,0.4)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div className="rb-modal-inner rb-animate-in" style={{ background:C.card, borderRadius:18, padding:28, width:520, maxHeight:"85vh", overflowY:"auto", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text, display:"flex", alignItems:"center", gap:8 }}>
              <Target size={18} color={C.green}/> ATS Analysis
            </h2>
            <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12 }}>AI-powered resume optimisation tips</p>
          </div>
          <button onClick={onClose} style={{ border:"none", background:C.card3, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:C.muted }}>
            <X size={16}/>
          </button>
        </div>
        {loading&&(
          <div style={{ textAlign:"center", padding:"40px 0", color:C.muted }}>
            <div style={{ width:48, height:48, margin:"0 auto 16px", borderRadius:"50%", border:`3px solid ${C.border}`, borderTop:`3px solid ${C.orange}` }} className="rb-spin"/>
            <p>AI is analysing your resume…</p>
          </div>
        )}
        {error&&<div style={{ padding:"14px", background:C.redGlow, color:C.red, borderRadius:10, textAlign:"center", border:`1px solid rgba(248,113,113,0.25)`, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}><AlertCircle size={15}/>{error}</div>}
        {!loading&&tips&&(
          <>
            <div style={{ display:"flex", alignItems:"center", gap:14, background:C.scoreBg, borderRadius:14, padding:"16px 20px", marginBottom:20, border:`1px solid ${C.border}` }}>
              <ScoreCircle score={tips.score||0} />
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:4 }}>ATS Compatibility Score</div>
                <div style={{ fontSize:12, color:C.muted }}>
                  {tips.score>=80?"Excellent! Recruiter systems will love this.":tips.score>=50?"Good, but a few improvements will help.":"Needs work to pass ATS filters."}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(tips.tips||[]).map((tip,i)=>{
                const st=typeStyle[tip.type]||typeStyle.warning;
                const TI = st.icon;
                return (
                  <div key={i} style={{ background:st.bg, borderRadius:10, padding:"12px 15px", border:`1px solid ${st.color}22` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <TI size={14} color={st.color}/><span style={{ fontWeight:700, fontSize:12, color:st.color }}>{tip.title}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>{tip.detail}</div>
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

/* ─── Section Editor Panels ───────────────────────────────────────────────── */
function PersonalPanel({ r, set }) {
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
        <Input label="First Name" value={r.firstName} onChange={v=>set({...r,firstName:v})} placeholder="John" />
        <Input label="Last Name" value={r.lastName} onChange={v=>set({...r,lastName:v})} placeholder="Doe" />
      </div>
      <Input label="Job Title / Profession" value={r.jobTitle} onChange={v=>set({...r,jobTitle:v})} placeholder="Full Stack Developer" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
        <Input label="Email" value={r.email} onChange={v=>set({...r,email:v})} placeholder="john@email.com" type="email" />
        <Input label="Phone" value={r.phone} onChange={v=>set({...r,phone:v})} placeholder="+91 9999999999" />
        <Input label="City" value={r.city} onChange={v=>set({...r,city:v})} placeholder="Hyderabad" />
        <Input label="Country" value={r.country} onChange={v=>set({...r,country:v})} placeholder="India" />
      </div>
      <Input label="LinkedIn URL" value={r.linkedinUrl} onChange={v=>set({...r,linkedinUrl:v})} placeholder="linkedin.com/in/johndoe" />
      <Input label="GitHub URL" value={r.githubUrl} onChange={v=>set({...r,githubUrl:v})} placeholder="github.com/johndoe" />
      <Input label="Portfolio URL" value={r.portfolioUrl} onChange={v=>set({...r,portfolioUrl:v})} placeholder="johndoe.dev" />
    </div>
  );
}

function ProfilePanel({ r, set }) {
  const C = useContext(ColorContext);
  const wc=(r.profileSummary||"").split(/\s+/).filter(Boolean).length;
  return (
    <div>
      <p style={{ fontSize:11, color:C.muted, marginBottom:10, lineHeight:1.6 }}>Write 4–5 sentences. Include your job title, years of experience, key skills, and what you offer.</p>
      <Input multiline label="Professional Summary" value={r.profileSummary} onChange={v=>set({...r,profileSummary:v})} placeholder="A results-driven Full Stack Developer with 3+ years…" />
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.muted, marginTop:-6 }}>
        <span>Word count: {wc}</span>
        <span style={{ color:wc>=50?C.green:wc>=30?"#f59e0b":C.red, fontWeight:700 }}>
          {wc>=50?"✓ Good length":wc>=30?"↑ Add more":"Too short"}
        </span>
      </div>
    </div>
  );
}

function ExperiencePanel({ r, set }) {
  const C = useContext(ColorContext);
  const add=()=>set({...r,workExperiences:[...r.workExperiences,{id:Date.now(),companyName:"",position:"",startDate:"",endDate:"",isCurrent:false,location:"",description:"",displayOrder:r.workExperiences.length}]});
  const upd=(i,f,v)=>{ const a=[...r.workExperiences]; a[i]={...a[i],[f]:v}; set({...r,workExperiences:a}); };
  const del=(i)=>{ const a=[...r.workExperiences]; a.splice(i,1); set({...r,workExperiences:a}); };
  return (
    <div>
      {r.workExperiences.map((we,i)=>(
        <Card key={we.id||i}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontWeight:700, fontSize:12, color:C.text, display:"flex", alignItems:"center", gap:6 }}><Briefcase size={13} color={C.orange}/> Experience #{i+1}</span>
            <RemoveBtn onClick={()=>del(i)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
            <Input label="Company" value={we.companyName} onChange={v=>upd(i,"companyName",v)} placeholder="Google" />
            <Input label="Position" value={we.position} onChange={v=>upd(i,"position",v)} placeholder="Senior Engineer" />
            <Input label="Start Date" value={we.startDate} onChange={v=>upd(i,"startDate",v)} placeholder="Jan 2022" />
            <Input label="End Date" value={we.isCurrent?"":we.endDate} onChange={v=>upd(i,"endDate",v)} placeholder="Dec 2024" />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <input type="checkbox" checked={we.isCurrent} onChange={e=>upd(i,"isCurrent",e.target.checked)} id={`curr-${i}`} style={{ accentColor:C.orange, width:14, height:14 }} />
            <label htmlFor={`curr-${i}`} style={{ fontSize:11, color:C.muted, cursor:"pointer" }}>Currently working here</label>
          </div>
          <Input label="Location" value={we.location} onChange={v=>upd(i,"location",v)} placeholder="Bangalore, India" />
          <Input multiline label="Key Responsibilities / Achievements" value={we.description} onChange={v=>upd(i,"description",v)} placeholder={"• Led development of…\n• Improved performance by 40%…"} />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Work Experience" />
    </div>
  );
}

function EducationPanel({ r, set }) {
  const C = useContext(ColorContext);
  const add=()=>set({...r,educations:[...r.educations,{id:Date.now(),institution:"",degree:"",fieldOfStudy:"",startDate:"",endDate:"",grade:"",description:"",displayOrder:r.educations.length}]});
  const upd=(i,f,v)=>{ const a=[...r.educations]; a[i]={...a[i],[f]:v}; set({...r,educations:a}); };
  const del=(i)=>{ const a=[...r.educations]; a.splice(i,1); set({...r,educations:a}); };
  return (
    <div>
      {r.educations.map((edu,i)=>(
        <Card key={edu.id||i}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontWeight:700, fontSize:12, color:C.text, display:"flex", alignItems:"center", gap:6 }}><GraduationCap size={13} color={C.orange}/> Education #{i+1}</span>
            <RemoveBtn onClick={()=>del(i)} />
          </div>
          <Input label="Institution" value={edu.institution} onChange={v=>upd(i,"institution",v)} placeholder="IIT Bombay" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
            <Input label="Degree" value={edu.degree} onChange={v=>upd(i,"degree",v)} placeholder="B.Tech" />
            <Input label="Field of Study" value={edu.fieldOfStudy} onChange={v=>upd(i,"fieldOfStudy",v)} placeholder="Computer Science" />
            <Input label="Start Year" value={edu.startDate} onChange={v=>upd(i,"startDate",v)} placeholder="2018" />
            <Input label="End Year" value={edu.endDate} onChange={v=>upd(i,"endDate",v)} placeholder="2022" />
            <Input label="Grade / CGPA" value={edu.grade} onChange={v=>upd(i,"grade",v)} placeholder="8.5 / 10" />
          </div>
          <Input multiline label="Description (optional)" value={edu.description} onChange={v=>upd(i,"description",v)} placeholder="Relevant coursework…" />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Education" />
    </div>
  );
}

function SkillsPanel({ r, set }) {
  const C = useContext(ColorContext);
  const [newSkill,setNewSkill]=useState("");
  const [newLevel,setNewLevel]=useState("INTERMEDIATE");
  const add=()=>{ if(!newSkill.trim())return; set({...r,skills:[...r.skills,{id:Date.now(),skillName:newSkill.trim(),proficiencyLevel:newLevel,displayOrder:r.skills.length}]}); setNewSkill(""); };
  const del=(i)=>{ const a=[...r.skills]; a.splice(i,1); set({...r,skills:a}); };
  const updLvl=(i,v)=>{ const a=[...r.skills]; a[i]={...a[i],proficiencyLevel:v}; set({...r,skills:a}); };
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <input value={newSkill} onChange={e=>setNewSkill(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. React, Java, AWS…"
          style={{ flex:1, padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.inputBorder}`, fontSize:12, fontFamily:"inherit", background:C.inputBg, color:C.text, outline:"none" }} />
        <select value={newLevel} onChange={e=>setNewLevel(e.target.value)}
          style={{ padding:"9px 10px", borderRadius:8, border:`1.5px solid ${C.inputBorder}`, fontSize:11, background:C.inputBg, color:C.text, fontFamily:"inherit", outline:"none" }}>
          {LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
        </select>
        <Btn onClick={add} size="sm"><Plus size={12}/> Add</Btn>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
        {r.skills.map((s,i)=>(
          <div key={s.id||i} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:999, background:C.card3, border:`1.5px solid ${LEVEL_COLOR[s.proficiencyLevel]||C.border}44` }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:LEVEL_COLOR[s.proficiencyLevel], flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:600, color:C.text }}>{s.skillName}</span>
            <select value={s.proficiencyLevel} onChange={e=>updLvl(i,e.target.value)}
              style={{ border:"none", background:"transparent", fontSize:9, color:LEVEL_COLOR[s.proficiencyLevel], fontWeight:700, cursor:"pointer", outline:"none" }}>
              {LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
            </select>
            <button onClick={()=>del(i)} style={{ border:"none", background:"none", color:C.muted, cursor:"pointer", fontSize:14, lineHeight:1, padding:0, display:"flex", alignItems:"center" }}>
              <X size={12}/>
            </button>
          </div>
        ))}
      </div>
      {r.skills.length===0&&<p style={{ color:C.muted, fontSize:12, textAlign:"center", marginTop:20, opacity:0.7 }}>No skills added yet. Add your first skill above.</p>}
    </div>
  );
}

function ProjectsPanel({ r, set }) {
  const C = useContext(ColorContext);
  const add=()=>set({...r,projects:[...r.projects,{id:Date.now(),projectName:"",techStack:"",projectUrl:"",startDate:"",endDate:"",description:"",displayOrder:r.projects.length}]});
  const upd=(i,f,v)=>{ const a=[...r.projects]; a[i]={...a[i],[f]:v}; set({...r,projects:a}); };
  const del=(i)=>{ const a=[...r.projects]; a.splice(i,1); set({...r,projects:a}); };
  return (
    <div>
      {r.projects.map((proj,i)=>(
        <Card key={proj.id||i}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontWeight:700, fontSize:12, color:C.text, display:"flex", alignItems:"center", gap:6 }}><FolderGit2 size={13} color={C.orange}/> Project #{i+1}</span>
            <RemoveBtn onClick={()=>del(i)} />
          </div>
          <Input label="Project Name" value={proj.projectName} onChange={v=>upd(i,"projectName",v)} placeholder="E-Commerce Platform" />
          <Input label="Tech Stack" value={proj.techStack} onChange={v=>upd(i,"techStack",v)} placeholder="React, Spring Boot, MySQL" />
          <Input label="Project URL" value={proj.projectUrl} onChange={v=>upd(i,"projectUrl",v)} placeholder="github.com/john/project" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
            <Input label="Start Date" value={proj.startDate} onChange={v=>upd(i,"startDate",v)} placeholder="Mar 2023" />
            <Input label="End Date" value={proj.endDate} onChange={v=>upd(i,"endDate",v)} placeholder="Jun 2023" />
          </div>
          <Input multiline label="Description" value={proj.description} onChange={v=>upd(i,"description",v)} placeholder="Built a full-stack e-commerce platform…" />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Project" />
    </div>
  );
}

function CertsPanel({ r, set }) {
  const C = useContext(ColorContext);
  const add=()=>set({...r,certifications:[...r.certifications,{id:Date.now(),certName:"",issuingOrganization:"",issueDate:"",expiryDate:"",credentialId:"",credentialUrl:"",displayOrder:r.certifications.length}]});
  const upd=(i,f,v)=>{ const a=[...r.certifications]; a[i]={...a[i],[f]:v}; set({...r,certifications:a}); };
  const del=(i)=>{ const a=[...r.certifications]; a.splice(i,1); set({...r,certifications:a}); };
  return (
    <div>
      {r.certifications.map((cert,i)=>(
        <Card key={cert.id||i}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontWeight:700, fontSize:12, color:C.text, display:"flex", alignItems:"center", gap:6 }}><Award size={13} color={C.orange}/> Certification #{i+1}</span>
            <RemoveBtn onClick={()=>del(i)} />
          </div>
          <Input label="Certification Name" value={cert.certName} onChange={v=>upd(i,"certName",v)} placeholder="AWS Solutions Architect" />
          <Input label="Issuing Organization" value={cert.issuingOrganization} onChange={v=>upd(i,"issuingOrganization",v)} placeholder="Amazon Web Services" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
            <Input label="Issue Date" value={cert.issueDate} onChange={v=>upd(i,"issueDate",v)} placeholder="Jan 2024" />
            <Input label="Expiry Date" value={cert.expiryDate} onChange={v=>upd(i,"expiryDate",v)} placeholder="Jan 2027" />
          </div>
          <Input label="Credential ID" value={cert.credentialId} onChange={v=>upd(i,"credentialId",v)} placeholder="AWS-12345" />
          <Input label="Credential URL" value={cert.credentialUrl} onChange={v=>upd(i,"credentialUrl",v)} placeholder="credly.com/badges/…" />
        </Card>
      ))}
      <AddBtn onClick={add} label="Add Certification" />
    </div>
  );
}

/* ─── Resume Preview (white paper output) ────────────────────────────────── */
function SectionHeader({ title, accent }) {
  return <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, color:accent, borderBottom:`2px solid ${accent}`, paddingBottom:3, marginBottom:8 }}>{title}</div>;
}

function ResumePreview({ r, id }) {
  const tmpl=TEMPLATES.find(t=>t.id===r.templateName)||TEMPLATES[0];
  const { accent, bg, sidebar }=tmpl;
  const fullName=`${r.firstName||""} ${r.lastName||""}`.trim()||"Your Name";
  if(sidebar) {
    return (
      <div id={id} style={{ background:bg, fontFamily:"'Georgia',serif", fontSize:10, lineHeight:1.55, display:"flex", minHeight:1123 }}>
        <div style={{ width:"33%", background:accent, color:"#fff", padding:"32px 18px", flexShrink:0 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(255,255,255,0.2)", border:"3px solid rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, fontSize:24, fontWeight:700 }}>{(r.firstName||"")[0]}{(r.lastName||"")[0]}</div>
          <div style={{ fontSize:17, fontWeight:700, marginBottom:2, lineHeight:1.2 }}>{fullName}</div>
          {r.jobTitle&&<div style={{ fontSize:10, opacity:0.8, marginBottom:18, fontStyle:"italic" }}>{r.jobTitle}</div>}
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, opacity:0.7, marginBottom:6, borderBottom:"1px solid rgba(255,255,255,0.3)", paddingBottom:3 }}>Contact</div>
          {[r.email&&`✉  ${r.email}`,r.phone&&`☎  ${r.phone}`,r.city&&`📍  ${r.city}${r.country?`, ${r.country}`:""}`,r.linkedinUrl&&`in  ${r.linkedinUrl}`,r.githubUrl&&`⌥  ${r.githubUrl}`,r.portfolioUrl&&`🌐  ${r.portfolioUrl}`].filter(Boolean).map((line,i)=>(
            <div key={i} style={{ fontSize:9, marginBottom:4, opacity:0.9, wordBreak:"break-all" }}>{line}</div>
          ))}
          {r.skills.length>0&&(<>
            <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, opacity:0.7, margin:"16px 0 6px", borderBottom:"1px solid rgba(255,255,255,0.3)", paddingBottom:3 }}>Skills</div>
            {r.skills.map((s,i)=>(<div key={i} style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, marginBottom:2 }}><span>{s.skillName}</span><span style={{ opacity:0.7, fontSize:8 }}>{s.proficiencyLevel}</span></div>
              <div style={{ height:4, background:"rgba(255,255,255,0.2)", borderRadius:2 }}><div style={{ height:"100%", borderRadius:2, background:"rgba(255,255,255,0.9)", width:`${LEVEL_PCT[s.proficiencyLevel]||50}%` }} /></div>
            </div>))}
          </>)}
          {r.certifications.length>0&&(<>
            <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, opacity:0.7, margin:"16px 0 6px", borderBottom:"1px solid rgba(255,255,255,0.3)", paddingBottom:3 }}>Certifications</div>
            {r.certifications.map((c,i)=>(<div key={i} style={{ marginBottom:8 }}><div style={{ fontSize:9, fontWeight:700 }}>{c.certName}</div><div style={{ fontSize:8, opacity:0.75 }}>{c.issuingOrganization}</div>{c.issueDate&&<div style={{ fontSize:8, opacity:0.65 }}>{c.issueDate}</div>}</div>))}
          </>)}
        </div>
        <div style={{ flex:1, padding:"32px 24px" }}>
          {r.profileSummary&&<div style={{ marginBottom:16 }}><SectionHeader title="Profile" accent={accent} /><div style={{ fontSize:10, color:"#374151", lineHeight:1.65 }}>{r.profileSummary}</div></div>}
          {r.workExperiences.length>0&&<div style={{ marginBottom:16 }}><SectionHeader title="Work Experience" accent={accent} />{r.workExperiences.map((we,i)=>(<div key={i} style={{ marginBottom:14 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}><span style={{ fontWeight:700, fontSize:11, color:"#111" }}>{we.position}</span><span style={{ fontSize:9, color:"#6b7280", whiteSpace:"nowrap", marginLeft:8 }}>{we.startDate}{(we.startDate||we.endDate)?" – ":""}{we.isCurrent?"Present":we.endDate}</span></div><div style={{ fontSize:10, color:accent, fontWeight:600, marginBottom:2 }}>{we.companyName}{we.location?` · ${we.location}`:""}</div>{we.description&&<div style={{ fontSize:9, color:"#374151", whiteSpace:"pre-line", lineHeight:1.6 }}>{we.description}</div>}</div>))}</div>}
          {r.educations.length>0&&<div style={{ marginBottom:16 }}><SectionHeader title="Education" accent={accent} />{r.educations.map((edu,i)=>(<div key={i} style={{ marginBottom:10 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}><span style={{ fontWeight:700, fontSize:11 }}>{edu.degree}{edu.fieldOfStudy?` in ${edu.fieldOfStudy}`:""}</span><span style={{ fontSize:9, color:"#6b7280" }}>{edu.startDate}{(edu.startDate||edu.endDate)?" – ":""}{edu.endDate}</span></div><div style={{ fontSize:10, color:accent }}>{edu.institution}{edu.grade?` · CGPA: ${edu.grade}`:""}</div></div>))}</div>}
          {r.projects.length>0&&<div style={{ marginBottom:16 }}><SectionHeader title="Projects" accent={accent} />{r.projects.map((proj,i)=>(<div key={i} style={{ marginBottom:10 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}><span style={{ fontWeight:700, fontSize:11 }}>{proj.projectName}</span>{proj.projectUrl&&<span style={{ fontSize:9, color:accent }}>{proj.projectUrl}</span>}</div>{proj.techStack&&<div style={{ fontSize:9, color:"#6b7280", fontStyle:"italic", marginBottom:2 }}>Tech: {proj.techStack}</div>}{proj.description&&<div style={{ fontSize:9, color:"#374151", lineHeight:1.6 }}>{proj.description}</div>}</div>))}</div>}
        </div>
      </div>
    );
  }
  return (
    <div id={id} style={{ background:bg, fontFamily:"'Georgia',serif", fontSize:10, lineHeight:1.55, padding:"36px 36px 30px", minHeight:1123, boxSizing:"border-box" }}>
      <div style={{ textAlign:"center", marginBottom:20, borderBottom:`3px solid ${accent}`, paddingBottom:14 }}>
        <div style={{ fontSize:24, fontWeight:700, color:"#111", letterSpacing:1.5, textTransform:"uppercase" }}>{fullName}</div>
        {r.jobTitle&&<div style={{ fontSize:12, color:accent, fontWeight:600, marginTop:3 }}>{r.jobTitle}</div>}
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:8, flexWrap:"wrap" }}>
          {r.email&&<span style={{ fontSize:9, color:"#374151" }}>✉ {r.email}</span>}
          {r.phone&&<span style={{ fontSize:9, color:"#374151" }}>☎ {r.phone}</span>}
          {r.city&&<span style={{ fontSize:9, color:"#374151" }}>📍 {r.city}{r.country?`, ${r.country}`:""}</span>}
          {r.linkedinUrl&&<span style={{ fontSize:9, color:accent }}>in {r.linkedinUrl}</span>}
          {r.githubUrl&&<span style={{ fontSize:9, color:accent }}>⌥ {r.githubUrl}</span>}
          {r.portfolioUrl&&<span style={{ fontSize:9, color:accent }}>🌐 {r.portfolioUrl}</span>}
        </div>
      </div>
      {r.profileSummary&&<div style={{ marginBottom:16 }}><SectionHeader title="Profile Summary" accent={accent} /><div style={{ fontSize:10, color:"#374151", lineHeight:1.65 }}>{r.profileSummary}</div></div>}
      {r.workExperiences.filter(we=>we.companyName||we.position).length>0&&<div style={{ marginBottom:16 }}><SectionHeader title="Work Experience" accent={accent} />{r.workExperiences.filter(we=>we.companyName||we.position).map((we,i)=>(<div key={i} style={{ marginBottom:13 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}><span style={{ fontWeight:700, fontSize:11, color:"#111" }}>{we.position}{we.companyName?` — ${we.companyName}`:""}</span><span style={{ fontSize:9, color:"#6b7280", whiteSpace:"nowrap", marginLeft:8 }}>{we.startDate}{(we.startDate||we.endDate)?" – ":""}{we.isCurrent?"Present":we.endDate}</span></div>{we.location&&<div style={{ fontSize:9, color:"#6b7280", marginBottom:3 }}>{we.location}</div>}{we.description&&<div style={{ fontSize:9.5, color:"#374151", whiteSpace:"pre-line", lineHeight:1.65, marginTop:3 }}>{we.description}</div>}</div>))}</div>}
      {r.educations.filter(e=>e.institution||e.degree).length>0&&<div style={{ marginBottom:16 }}><SectionHeader title="Education" accent={accent} />{r.educations.filter(e=>e.institution||e.degree).map((edu,i)=>(<div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}><div><div style={{ fontWeight:700, fontSize:11 }}>{edu.degree}{edu.fieldOfStudy?` in ${edu.fieldOfStudy}`:""}</div><div style={{ fontSize:10, color:"#374151" }}>{edu.institution}</div>{edu.description&&<div style={{ fontSize:9, color:"#6b7280", marginTop:2 }}>{edu.description}</div>}</div><div style={{ textAlign:"right", flexShrink:0, marginLeft:16 }}><div style={{ fontSize:9, color:"#6b7280" }}>{edu.startDate}{(edu.startDate||edu.endDate)?" – ":""}{edu.endDate}</div>{edu.grade&&<div style={{ fontSize:9, color:accent, fontWeight:600 }}>CGPA: {edu.grade}</div>}</div></div>))}</div>}
      {r.skills.length>0&&<div style={{ marginBottom:16 }}><SectionHeader title="Technical Skills" accent={accent} /><div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{r.skills.map((s,i)=>(<span key={i} style={{ padding:"3px 10px", borderRadius:999, background:`${accent}18`, border:`1px solid ${accent}40`, fontSize:9.5, color:"#374151", fontWeight:500 }}>{s.skillName}<span style={{ marginLeft:4, color:LEVEL_COLOR[s.proficiencyLevel], fontSize:8, fontWeight:700 }}>{s.proficiencyLevel==="EXPERT"?"★★★★":s.proficiencyLevel==="ADVANCED"?"★★★☆":s.proficiencyLevel==="INTERMEDIATE"?"★★☆☆":"★☆☆☆"}</span></span>))}</div></div>}
      {r.projects.length>0&&<div style={{ marginBottom:16 }}><SectionHeader title="Projects" accent={accent} />{r.projects.map((proj,i)=>(<div key={i} style={{ marginBottom:10 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}><span style={{ fontWeight:700, fontSize:11 }}>{proj.projectName}</span>{proj.projectUrl&&<span style={{ fontSize:9, color:accent }}>{proj.projectUrl}</span>}</div>{proj.techStack&&<div style={{ fontSize:9, color:"#6b7280", fontStyle:"italic", marginBottom:2 }}>Tech: {proj.techStack}{(proj.startDate||proj.endDate)&&<span style={{ marginLeft:10 }}>{proj.startDate}{proj.startDate&&proj.endDate?" – ":""}{proj.endDate}</span>}</div>}{proj.description&&<div style={{ fontSize:9.5, color:"#374151", lineHeight:1.65, whiteSpace:"pre-line" }}>{proj.description}</div>}</div>))}</div>}
      {r.certifications.length>0&&<div><SectionHeader title="Certifications" accent={accent} />{r.certifications.map((c,i)=>(<div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, alignItems:"baseline" }}><div><span style={{ fontWeight:700, fontSize:10 }}>{c.certName}</span>{c.issuingOrganization&&<span style={{ fontSize:9, color:"#6b7280" }}> · {c.issuingOrganization}</span>}{c.credentialId&&<span style={{ fontSize:9, color:"#9ca3af" }}> · ID: {c.credentialId}</span>}</div><span style={{ fontSize:9, color:"#6b7280", whiteSpace:"nowrap", marginLeft:10 }}>{c.issueDate}</span></div>))}</div>}
    </div>
  );
}

/* ─── Template Gallery ────────────────────────────────────────────────────── */
function TemplateGallery({ selected, onSelect, onNext, onBack }) {
  const C = useContext(ColorContext);
  const [hoveredId,setHoveredId]=useState(null);
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:C.navBg, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:62, flexWrap:"wrap", gap:8, backdropFilter:"blur(12px)" }}>
        <ILMORALogo size="sm" />
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {["Get Started","Template","Build"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:i<=1?C.orange:C.border, color:i<=1?"#fff":C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>
                {i<1?<Check size={13}/>:i+1}
              </div>
              <span style={{ fontSize:11, fontWeight:i===1?700:500, color:i===1?C.orange:C.muted }}>{s}</span>
              {i<2&&<div style={{ width:26, height:1.5, background:i<1?C.orange:C.border }} />}
            </div>
          ))}
        </div>
        <Btn onClick={onNext} variant="secondary" size="sm">Skip <ChevronRight size={13}/></Btn>
      </div>

      <div style={{ maxWidth:1300, margin:"0 auto", padding:"38px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:38 }}>
          <h1 style={{ fontSize:28, fontWeight:900, color:C.text, margin:"0 0 8px" }}>Choose Your Template</h1>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Click any template to preview · All 10 templates are fully customizable</p>
        </div>
        <div className="rb-tpl-gallery-grid-5" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginBottom:38 }}>
          {TEMPLATES.map(t=>{
            const isSel=selected===t.id, isHov=hoveredId===t.id;
            const dummyData={...DUMMY_RESUME,templateName:t.id};
            return (
              <div key={t.id}
                onMouseEnter={()=>setHoveredId(t.id)} onMouseLeave={()=>setHoveredId(null)}
                onClick={()=>onSelect(t.id)}
                style={{ border:`2.5px solid ${isSel?t.accent:isHov?t.accent+"80":C.border}`, borderRadius:13, overflow:"hidden", cursor:"pointer", background:C.card, boxShadow:isSel?`0 0 0 4px ${t.accent}20,0 10px 28px rgba(0,0,0,0.3)`:isHov?"0 8px 24px rgba(0,0,0,0.2)":C.shadowCard, transform:isSel?"scale(1.03)":isHov?"scale(1.01)":"scale(1)", transition:"all 0.2s ease" }}>
                <div style={{ height:244, overflow:"hidden", position:"relative", background:C.previewThumbBg }}>
                  <div style={{ transform:"scale(0.28)", transformOrigin:"top left", width:"357%", pointerEvents:"none" }}><ResumePreview r={dummyData} /></div>
                  {isHov&&!isSel&&<div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ background:"#fff", color:"#111", fontWeight:800, fontSize:12, padding:"8px 20px", borderRadius:9, display:"flex", alignItems:"center", gap:6 }}>
                      <Check size={13}/> Select
                    </span>
                  </div>}
                  {isSel&&<div style={{ position:"absolute", top:9, right:9, width:28, height:28, borderRadius:"50%", background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:`0 2px 10px ${t.accent}60` }}>
                    <Check size={15}/>
                  </div>}
                  <div style={{ position:"absolute", top:8, left:8 }}><Badge bg={isSel?t.accent:C.card3+"ee"} color={isSel?"#fff":C.text}>{t.tag}</Badge></div>
                </div>
                <div style={{ padding:"10px 13px", borderTop:`1px solid ${isSel?t.accent+"30":C.border}`, background:isSel?t.accent+"0d":C.card }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:t.accent }} />
                    <div>
                      <div style={{ fontWeight:isSel?800:700, fontSize:12, color:isSel?t.accent:C.text }}>{t.name}</div>
                      <div style={{ fontSize:9, color:C.muted }}>{t.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${C.border}`, paddingTop:22, flexWrap:"wrap", gap:12 }}>
          <Btn onClick={onBack} variant="secondary"><ArrowLeft size={14}/> Back</Btn>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ fontSize:13, color:C.muted }}>
              Selected: <strong style={{ color:TEMPLATES.find(t=>t.id===selected)?.accent }}>{TEMPLATES.find(t=>t.id===selected)?.name}</strong>
            </div>
            <Btn onClick={onNext} style={{ boxShadow:`0 4px 14px ${C.orangeGlow}`, fontSize:13, padding:"10px 30px" }}>
              Start Editing <ChevronRight size={15}/>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── How To Create ───────────────────────────────────────────────────────── */
function HowToCreate({ onManual, onAI, onPDF, onLinkedIn }) {
  const C = useContext(ColorContext);
  const options=[
    { icon:Sparkles, label:"AI Generate",             sub:"AI creates a complete ATS-optimised resume from your target role & skills", action:onAI,       color:C.orange,  gradient:`linear-gradient(135deg,${C.purple},${C.orange})` },
    { icon:Linkedin, label:"Import from LinkedIn",     sub:"Download your LinkedIn PDF and upload it — AI extracts your real profile", action:onLinkedIn, color:"#0077b5", gradient:"linear-gradient(135deg,#0077b5,#0891b2)" },
    { icon:FileUp,   label:"Upload existing resume",   sub:"Upload your current PDF and AI will extract every section automatically", action:onPDF,        color:C.green,   gradient:`linear-gradient(135deg,${C.green},#0891b2)` },
    { icon:PenLine,  label:"Start from scratch",       sub:"Build manually with a blank canvas and full control",                    action:onManual,    color:C.muted,   gradient:"linear-gradient(135deg,#4b5563,#374151)" },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background:C.navBg, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", height:62, backdropFilter:"blur(12px)" }}>
        <ILMORALogo size="sm" />
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"56px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ width:70, height:70, borderRadius:20, background:C.orangeGlow, border:`1px solid ${C.isDark?"rgba(249,115,22,0.3)":"rgba(234,106,10,0.2)"}`, margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Sparkles size={32} color={C.orange} />
          </div>
          <h1 style={{ fontSize:28, fontWeight:900, color:C.text, margin:"0 0 10px", letterSpacing:-0.5 }}>How would you like to create your resume?</h1>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Choose the fastest path to your perfect resume</p>
        </div>
        <div className="rb-howto-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {options.map(opt=>{
            const OI = opt.icon;
            return (
              <button key={opt.label} onClick={opt.action}
                style={{ display:"flex", flexDirection:"column", gap:12, padding:"24px 22px", borderRadius:14, border:`2px solid ${C.border}`, background:C.card, cursor:"pointer", textAlign:"left", transition:"all 0.22s ease", boxShadow:C.shadowCard, fontFamily:"inherit" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=opt.color; e.currentTarget.style.boxShadow=`0 6px 24px ${opt.color}22`; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow=C.shadowCard; e.currentTarget.style.transform="translateY(0)"; }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:13 }}>
                  <div style={{ width:48, height:48, borderRadius:13, background:opt.gradient, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <OI size={22} color="#fff"/>
                  </div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:C.text, marginBottom:3 }}>{opt.label}</div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.55 }}>{opt.sub}</div>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  <span style={{ fontSize:11, color:opt.color, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>Get started <ChevronRight size={13}/></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
export default function ResumeBuilder() {
  const isDark = useDarkMode();
  const C = isDark ? DARK_C : LIGHT_C;

  const [view,setView]=useState("home");
  const [resumes,setResumes]=useState([]);
  const [editingResume,setEditingResume]=useState(null);
  const [activeSection,setActiveSection]=useState("Personal Info");
  const [previewScale,setPreviewScale]=useState(0.52);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState(null);
  const [showAIModal,setShowAIModal]=useState(false);
  const [showPDFModal,setShowPDFModal]=useState(false);
  const [showLinkedInModal,setShowLinkedInModal]=useState(false);
  const [showATSPanel,setShowATSPanel]=useState(false);
  const [showSaveModal,setShowSaveModal]=useState(false);
  const [pendingTemplate,setPendingTemplate]=useState("summit");
  const [showATSScoreUpload,setShowATSScoreUpload]=useState(false);
  const [showResumeScore,setShowResumeScore]=useState(false);
  const [showAIWriting,setShowAIWriting]=useState(false);

  const userId=getMyUserId();
  const score=editingResume?calcScore(editingResume):0;
  const ats=editingResume?!!(editingResume.email&&editingResume.profileSummary&&editingResume.skills.length>0&&editingResume.workExperiences.length>0):false;
  const previewId="resume-print-target";

  useEffect(()=>{
    if(!userId)return;
    setLoading(true);
    userService.getMyResumes(userId).then(res=>setResumes((res.data||[]).map(mapResponseToLocal))).catch(()=>setError("Failed to load resumes.")).finally(()=>setLoading(false));
  },[userId]);

  const applyAIData=(data)=>{
    const stamp=(off)=>Date.now()+off+Math.random();
    setEditingResume(prev=>({...(prev||emptyResume),...data,workExperiences:(data.workExperiences||[]).map((w,i)=>({...w,id:stamp(i)})),educations:(data.educations||[]).map((e,i)=>({...e,id:stamp(i+100)})),skills:(data.skills||[]).map((s,i)=>({...s,id:stamp(i+200)})),projects:(data.projects||[]).map((p,i)=>({...p,id:stamp(i+300)})),certifications:(data.certifications||[]).map((c,i)=>({...c,id:stamp(i+400)})) }));
    setView("editor");
  };

  const handleFeatureClick=(feature)=>{
    if(feature==="ats-score"){ setShowATSScoreUpload(true); return; }
    if(feature==="resume-score"){ if(!editingResume){ alert("Please open a resume in the editor first."); return; } setShowResumeScore(true); return; }
    if(feature==="ai-writing"){ if(!editingResume){ alert("Please open a resume in the editor first."); return; } setShowAIWriting(true); return; }
    if(feature==="pdf-export"){ if(!editingResume){ alert("Please open a resume in the editor first."); return; } downloadResumeAsPdf(previewId,editingResume?.title||editingResume?.firstName||"resume"); return; }
  };

  const handleCreateResume=(action,resumeData)=>{
    if(action==="ai"){ setEditingResume({...emptyResume,_isNew:true}); setShowAIModal(true); }
    else if(action==="linkedin"){ setEditingResume({...emptyResume,_isNew:true}); setShowLinkedInModal(true); }
    else if(action==="pdf"){ setEditingResume({...emptyResume,_isNew:true}); setShowPDFModal(true); }
    else if(action==="manual"){ setEditingResume({...emptyResume,_isNew:true}); setActiveSection("Personal Info"); setPendingTemplate("summit"); setView("onboard-how"); }
    else if(action==="template"){ setEditingResume({...emptyResume,_isNew:true}); setPendingTemplate("summit"); setView("onboard-template"); }
    else if(action==="edit"&&resumeData){ setEditingResume({...resumeData}); setActiveSection("Personal Info"); setView("editor"); }
    else if(action==="download"&&resumeData){ setEditingResume({...resumeData}); setTimeout(()=>downloadResumeAsPdf(previewId,resumeData.title||resumeData.firstName||"resume"),300); }
    else if(action==="delete"&&resumeData){ handleDelete(resumeData.id); }
  };

  const handleSaveClick=()=>{
    if(!editingResume)return;
    const defaultName=editingResume.title||(editingResume.firstName?`${editingResume.firstName}-${editingResume.lastName||"Resume"}`.replace(/\s+/g,"-"):"My-Resume");
    setEditingResume(r=>({...r,title:defaultName})); setShowSaveModal(true);
  };

  const handleSaveConfirm=async(chosenName)=>{
    setShowSaveModal(false);
    const resumeToSave={...editingResume,title:chosenName};
    setEditingResume(resumeToSave); setSaving(true); setError(null);
    try {
      const payload=mapLocalToRequest(resumeToSave);
      let saved;
      if(resumeToSave._isNew){ const res=await userService.createResume(userId,payload); saved=mapResponseToLocal(res.data); setResumes(prev=>[saved,...prev]); }
      else { const res=await userService.updateResume(userId,resumeToSave.id,payload); saved=mapResponseToLocal(res.data); setResumes(prev=>prev.map(r=>r.id===saved.id?saved:r)); }
      setView("home");
    } catch { setError("Failed to save resume."); }
    finally { setSaving(false); }
  };

  const handleDelete=async(id)=>{
    if(!window.confirm("Delete this resume?"))return;
    try { await userService.deleteResume(userId,id); setResumes(prev=>prev.filter(r=>r.id!==id)); } catch { setError("Failed to delete resume."); }
  };

  const modals=(
    <>
      {showAIModal&&<AIGenerateModal userId={userId} onClose={()=>setShowAIModal(false)} onApply={applyAIData} />}
      {showLinkedInModal&&<LinkedInScrapeModal userId={userId} onClose={()=>setShowLinkedInModal(false)} onApply={applyAIData} />}
      {showPDFModal&&<PDFUploadModal userId={userId} onClose={()=>setShowPDFModal(false)} onApply={applyAIData} />}
      {showATSScoreUpload&&<ATSScoreUploadModal userId={userId} onClose={()=>setShowATSScoreUpload(false)} />}
      {showResumeScore&&editingResume&&<ResumeScoreModal resume={editingResume} onClose={()=>setShowResumeScore(false)} />}
      {showAIWriting&&editingResume&&<AIWritingAssistantModal resume={editingResume} userId={userId} onApply={(field,value)=>setEditingResume(r=>({...r,[field]:value}))} onClose={()=>setShowAIWriting(false)} />}
    </>
  );

  if(view==="home") return (
    <ColorContext.Provider value={C}>
      {modals}
      <ILMORANavbar onCreateResume={handleCreateResume} resumes={resumes} onFeatureClick={handleFeatureClick} />
      {loading
        ? <div style={{ textAlign:"center", padding:"80px 20px", color:C.muted, fontFamily:"sans-serif", background:C.bg, minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", border:`3px solid ${C.border}`, borderTop:`3px solid ${C.orange}` }} className="rb-spin"/>
            <p style={{ fontSize:14, margin:0 }}>Loading your resumes…</p>
          </div>
        : <HomePage onCreateResume={handleCreateResume} resumes={resumes} onFeatureClick={handleFeatureClick} />
      }
      {editingResume&&view==="home"&&<div style={{ position:"absolute", left:-9999, top:-9999, pointerEvents:"none" }}><ResumePreview r={editingResume} id={previewId} /></div>}
    </ColorContext.Provider>
  );

  if(view==="onboard-how") return (
    <ColorContext.Provider value={C}>
      {modals}
      <HowToCreate onManual={()=>setView("onboard-template")} onAI={()=>setShowAIModal(true)} onLinkedIn={()=>setShowLinkedInModal(true)} onPDF={()=>setShowPDFModal(true)} />
    </ColorContext.Provider>
  );

  if(view==="onboard-template") return (
    <ColorContext.Provider value={C}>
      <TemplateGallery selected={pendingTemplate} onSelect={id=>{ setPendingTemplate(id); setEditingResume(r=>({...r,templateName:id})); }} onNext={()=>setView("editor")} onBack={()=>setView("onboard-how")} />
    </ColorContext.Provider>
  );

  if(view==="editor") return (
    <ColorContext.Provider value={C}>
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
        {showATSPanel&&<ATSTipsPanel userId={userId} resume={editingResume} onClose={()=>setShowATSPanel(false)} />}
        {showResumeScore&&editingResume&&<ResumeScoreModal resume={editingResume} onClose={()=>setShowResumeScore(false)} />}
        {showAIWriting&&editingResume&&<AIWritingAssistantModal resume={editingResume} userId={userId} onApply={(field,value)=>setEditingResume(r=>({...r,[field]:value}))} onClose={()=>setShowAIWriting(false)} />}
        {showSaveModal&&<SaveNameModal defaultName={editingResume?.title||(editingResume?.firstName?`${editingResume.firstName}-${editingResume.lastName||"Resume"}`:"My-Resume")} onConfirm={handleSaveConfirm} onCancel={()=>setShowSaveModal(false)} />}

        {/* Editor Top Bar */}
        <div className="rb-topbar" style={{ background:C.navBg, borderBottom:`1px solid ${C.border}`, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, flexShrink:0, boxShadow:C.shadow, backdropFilter:"blur(12px)", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Btn onClick={()=>setView("home")} variant="secondary" size="sm"><ArrowLeft size={13}/> Back</Btn>
            <div style={{ width:1, height:20, background:C.border }} />
            <ILMORALogo size="sm" />
            <div style={{ width:1, height:20, background:C.border }} />
            <input value={editingResume?.title||""} onChange={e=>setEditingResume(r=>({...r,title:e.target.value}))}
              style={{ fontWeight:700, fontSize:13, border:"none", outline:"none", background:"transparent", color:C.text, width:170, fontFamily:"inherit" }} placeholder="Resume name…" />
          </div>

          <div className="rb-topbar-actions" style={{ display:"flex", alignItems:"center", gap:7 }}>
            <Btn onClick={()=>setShowATSPanel(true)} size="sm" style={{ background:C.greenGlow, color:C.green, border:`1px solid ${C.isDark?"rgba(34,197,94,0.25)":"rgba(22,163,74,0.2)"}` }}>
              <Target size={13}/> ATS
            </Btn>
            <Btn onClick={()=>setShowResumeScore(true)} size="sm" style={{ background:C.purpleGlow, color:C.purple, border:`1px solid rgba(167,139,250,0.25)` }}>
              <BarChart3 size={13}/> Score
            </Btn>
            <Btn onClick={()=>setShowAIWriting(true)} size="sm" style={{ background:C.orangeGlow, color:C.orange, border:`1px solid ${C.isDark?"rgba(249,115,22,0.25)":"rgba(234,106,10,0.2)"}` }}>
              <Brain size={13}/> AI Write
            </Btn>
            <Btn onClick={()=>downloadResumeAsPdf(previewId,editingResume?.title||editingResume?.firstName||"resume")} size="sm" style={{ background:"rgba(245,158,11,0.1)", color:"#f59e0b", border:"1px solid rgba(245,158,11,0.25)" }}>
              <Download size={13}/> PDF
            </Btn>
            {ats&&(
              <Badge bg={C.orangeGlow} color={C.orange}><Shield size={10}/> ATS Ready</Badge>
            )}
            {error&&<span style={{ fontSize:10, color:C.red, display:"flex", alignItems:"center", gap:4 }}><AlertCircle size={12}/>{error}</span>}
            <ScoreCircle score={score} size={48} />
            <Btn onClick={handleSaveClick} disabled={saving} style={{ fontSize:12, padding:"8px 18px" }}>
              {saving?<><Loader2 size={13} className="rb-spin"/> Saving…</>:<><Save size={13}/> Save</>}
            </Btn>
          </div>
        </div>

        <div className="rb-editor-layout" style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Left Editor Panel */}
          <div className="rb-editor-left" style={{ width:385, background:C.card, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
            {/* Section Tabs */}
            <div style={{ display:"flex", overflowX:"auto", padding:"8px 10px 0", gap:2, borderBottom:`1px solid ${C.border}`, scrollbarWidth:"none" }}>
              {SECTIONS.map(s=>{
                const SI = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <button key={s.id} onClick={()=>setActiveSection(s.id)}
                    style={{ padding:"7px 9px", borderRadius:"8px 8px 0 0", border:"none", background:isActive?C.orangeGlow:"transparent", color:isActive?C.orange:C.muted, fontWeight:isActive?700:500, fontSize:10, cursor:"pointer", whiteSpace:"nowrap", borderBottom:isActive?`2.5px solid ${C.orange}`:"2.5px solid transparent", transition:"all 0.15s ease", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
                    <SI size={12}/>{s.id}
                  </button>
                );
              })}
            </div>

            {/* Section Content */}
            <div style={{ flex:1, overflowY:"auto", padding:15 }}>
              {activeSection==="Personal Info"&&<PersonalPanel r={editingResume} set={setEditingResume} />}
              {activeSection==="Profile"&&<ProfilePanel r={editingResume} set={setEditingResume} />}
              {activeSection==="Experience"&&<ExperiencePanel r={editingResume} set={setEditingResume} />}
              {activeSection==="Education"&&<EducationPanel r={editingResume} set={setEditingResume} />}
              {activeSection==="Skills"&&<SkillsPanel r={editingResume} set={setEditingResume} />}
              {activeSection==="Projects"&&<ProjectsPanel r={editingResume} set={setEditingResume} />}
              {activeSection==="Certifications"&&<CertsPanel r={editingResume} set={setEditingResume} />}
            </div>
          </div>

          {/* Right Preview */}
          <div className="rb-editor-right" style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {/* Template switcher */}
            <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"8px 16px", display:"flex", alignItems:"center", gap:7, overflowX:"auto" }}>
              <span style={{ fontSize:10, fontWeight:700, color:C.muted, marginRight:4, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
                <LayoutTemplate size={12}/> Template:
              </span>
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>setEditingResume(r=>({...r,templateName:t.id}))}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 11px", borderRadius:7, border:`2px solid ${editingResume?.templateName===t.id?t.accent:C.border}`, background:editingResume?.templateName===t.id?t.accent+"15":C.card3, color:editingResume?.templateName===t.id?t.accent:C.muted, fontWeight:700, fontSize:10, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.15s ease", fontFamily:"inherit" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:t.accent }} />{t.name}
                </button>
              ))}
            </div>

            {/* Preview canvas */}
            <div className="rb-preview-canvas" style={{ flex:1, overflow:"auto", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:28, background:C.canvasBg }}>
              <div style={{ boxShadow:"0 10px 48px rgba(0,0,0,0.35)", borderRadius:4, overflow:"hidden", transform:`scale(${previewScale})`, transformOrigin:"top center", width:794, flexShrink:0, transition:"transform 0.2s ease" }}>
                {editingResume&&<ResumePreview r={editingResume} id={previewId} />}
              </div>
            </div>

            {/* Zoom controls */}
            <div style={{ background:C.card, borderTop:`1px solid ${C.border}`, padding:"8px 16px", display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
              <Btn onClick={()=>setPreviewScale(s=>Math.max(0.25,s-0.05))} variant="ghost" size="sm" title="Zoom out">
                <ZoomOut size={15}/>
              </Btn>
              <span style={{ fontSize:11, color:C.muted, fontWeight:700, minWidth:46, textAlign:"center" }}>{Math.round(previewScale*100)}%</span>
              <Btn onClick={()=>setPreviewScale(s=>Math.min(1,s+0.05))} variant="ghost" size="sm" title="Zoom in">
                <ZoomIn size={15}/>
              </Btn>
              <div style={{ width:1, height:16, background:C.border, margin:"0 3px" }} />
              <Btn onClick={()=>setPreviewScale(0.52)} variant="ghost" size="sm">
                <RotateCcw size={12}/> Reset
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </ColorContext.Provider>
  );

  return null;
}