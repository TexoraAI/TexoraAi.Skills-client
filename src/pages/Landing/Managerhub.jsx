import { useState, useEffect, useRef, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Users, GraduationCap, Video,
  BarChart2, FolderOpen, Award, Rocket, MessageSquare,
  Settings, ChevronRight, Menu, X, Sun, Moon, TrendingUp,
  Star, Clock, Briefcase, BookOpen, FileText, Download,
  Upload, Plus, LogIn, CheckCircle2, Lock, ArrowRight,
  Activity, Building2, ClipboardList, Workflow, PlayCircle,
  Calendar, Edit2, Search, Shield,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════════════ */
const DARK = {
  pageBg: "#0a0a0a", cardBg: "#111111", sectionBg: "#0d0d0d",
  heroBg: "#141414", border: "rgba(255,255,255,0.07)",
  borderHov: "rgba(255,255,255,0.15)", text: "#ffffff",
  textSub: "rgba(255,255,255,0.55)", textMuted: "rgba(255,255,255,0.3)",
  pillBg: "rgba(255,255,255,0.04)", iconBg: "rgba(255,255,255,0.06)",
  barBg: "rgba(255,255,255,0.07)", shadow: "0 4px 20px rgba(0,0,0,0.4)",
  navBg: "rgba(10,10,10,0.95)", btnBg: "rgba(255,255,255,0.07)",
};
const LIGHT = {
  pageBg: "#F8F3EE", cardBg: "#ffffff", sectionBg: "#f2ece6",
  heroBg: "#ffffff", border: "#e8e0d8", borderHov: "#d4c8be",
  text: "#1E293B", textSub: "#64748b", textMuted: "#94a3b8",
  pillBg: "#f1ede8", iconBg: "#fdf8f4", barBg: "#f1ede8",
  shadow: "0 2px 12px rgba(0,0,0,0.07)", navBg: "rgba(255,255,255,0.95)",
  btnBg: "#f3f4f6",
};

/* ═══════════════════════════════════════════════════════════════
   THEME CONTEXT
═══════════════════════════════════════════════════════════════ */
const ThemeContext = createContext(DARK);
const useTheme = () => useContext(ThemeContext);

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const FEATURES = [
  { color: "#F97316", icon: Package,      title: "Batch Management",    desc: "Create, edit, and manage multiple course batches with custom schedules, student quotas, and trainer assignments." },
  { color: "#3b82f6", icon: Users,        title: "Student Management",  desc: "Enroll students, track progress, review scores, and manage their full learning journey end to end." },
  { color: "#8b5cf6", icon: GraduationCap,title: "Trainer Assignment",  desc: "Assign, reassign, and review trainers per batch. Monitor session delivery and trainer performance." },
  { color: "#22c55e", icon: Video,        title: "Live Session Control",desc: "Schedule and monitor live classes, review attendance, recordings, and session feedback in real time." },
  { color: "#f59e0b", icon: ClipboardList,title: "Assessments & Quizzes",desc: "Create and assign quizzes, review scores, set passing criteria, and track batch-wise performance." },
  { color: "#ec4899", icon: FolderOpen,   title: "Resource Upload",     desc: "Upload PDFs, videos, lecture slides, and assignments. Organise by batch, course, and topic." },
  { color: "#14b8a6", icon: Award,        title: "Certificate Issuance",desc: "Generate and issue verifiable certificates to students who complete courses with passing grades." },
  { color: "#f97316", icon: Rocket,       title: "Placement Tracking",  desc: "Track job placements, company tie-ups, offer details, and aggregate placement statistics." },
  { color: "#6366f1", icon: BarChart2,    title: "Usage Analytics",     desc: "View real-time charts on enrollments, session attendance, resource downloads, and batch completion rates." },
  { color: "#0ea5e9", icon: Building2,    title: "Department Control",  desc: "Manage departments, branches, and categories to keep your platform structure clean and scalable." },
  { color: "#a855f7", icon: MessageSquare,title: "Feedback & Reports",  desc: "Collect structured feedback from students and trainers. Generate org-level reports with one click." },
  { color: "#22c55e", icon: Settings,     title: "Org Settings",        desc: "Configure org name, branding, notification templates, admin roles, and platform-wide settings." },
];

const BATCHES = [
  { title: "Java Backend Batch 12",     students: 42, trainer: "Rahul S.", color: "#f97316", tag: "Backend",  progress: 68, status: "Active" },
  { title: "React Development Batch 8", students: 35, trainer: "Priya M.", color: "#3b82f6", tag: "Frontend", progress: 45, status: "Active" },
  { title: "AWS Fundamentals Batch 5",  students: 28, trainer: "Arjun K.", color: "#22c55e", tag: "Cloud",    progress: 30, status: "Active" },
];

const TRAINERS = [
  { name: "Rahul Sharma", role: "Java & Backend Expert",  exp: "8 yrs", initials: "RS", color: "#F97316", rating: 4.9, batches: 3, students: 128 },
  { name: "Priya Mehta",  role: "React & Frontend Lead",  exp: "6 yrs", initials: "PM", color: "#3b82f6", rating: 4.8, batches: 2, students: 94  },
  { name: "Arjun Kumar",  role: "AWS & DevOps Engineer",  exp: "7 yrs", initials: "AK", color: "#8b5cf6", rating: 4.9, batches: 2, students: 76  },
];

const STUDENTS = [
  { name: "Ayesha Khan", batch: "Java Batch 12",  progress: 82, quizzes: 7, status: "Active"    },
  { name: "Rohan Mehta", batch: "React Batch 8",  progress: 60, quizzes: 5, status: "Active"    },
  { name: "Sara Gupta",  batch: "AWS Batch 5",    progress: 44, quizzes: 3, status: "Active"    },
  { name: "Aman Verma",  batch: "Java Batch 12",  progress: 91, quizzes: 8, status: "Completed" },
  { name: "Pooja Singh", batch: "React Batch 8",  progress: 30, quizzes: 2, status: "At Risk"   },
];

const SESSIONS = [
  { title: "Java Backend Masterclass", time: "Today • 6:00 PM",    trainer: "Rahul S.", avatar: "RS", live: true,  color: "#ef4444", attendance: 38   },
  { title: "React Workshop",           time: "Tomorrow • 7:00 PM", trainer: "Priya M.", avatar: "PM", live: false, color: "#3b82f6", attendance: null },
  { title: "AWS Bootcamp",             time: "Wed • 5:00 PM",      trainer: "Arjun K.", avatar: "AK", live: false, color: "#8b5cf6", attendance: null },
];

const SKILLS = [
  { name: "Java",          pct: 78, color: "#f97316" },
  { name: "React",         pct: 65, color: "#3b82f6" },
  { name: "SQL",           pct: 72, color: "#8b5cf6" },
  { name: "AWS",           pct: 48, color: "#22c55e" },
  { name: "System Design", pct: 55, color: "#f59e0b" },
];

const RESOURCES = [
  { color: "#f97316", icon: FileText,     title: "PDF Notes Library", desc: "Topic-wise notes uploaded by trainers for offline revision.",        tag: "128 Files"    },
  { color: "#3b82f6", icon: Video,        title: "Recorded Sessions", desc: "All past live sessions archived and accessible on demand.",           tag: "214 Videos"   },
  { color: "#8b5cf6", icon: BookOpen,     title: "Video Lectures",    desc: "Curated video tutorials covering every concept in the syllabus.",     tag: "340 Lectures" },
  { color: "#22c55e", icon: ClipboardList,title: "Assignments",       desc: "Practice assignments with test cases, rubrics, and grading.",         tag: "96 Tasks"     },
];

const CERTS = [
  { student: "Aman Verma",  course: "Java Backend Engineering", grade: "A+", date: "May 2025",    status: "Issued"  },
  { student: "Rohan Mehta", course: "React Development",        grade: "B+", date: "Apr 2025",    status: "Issued"  },
  { student: "Sara Gupta",  course: "AWS Fundamentals",         grade: "--", date: "In Progress", status: "Pending" },
  { student: "Ayesha Khan", course: "Java Backend Engineering", grade: "--", date: "In Progress", status: "Pending" },
];

const PLACEMENTS = [
  { student: "Aman Verma",  batch: "Java Batch 11", company: "Infosys",     role: "Backend Dev",    package: "₹7.5L", status: "Joined"         },
  { student: "Deepak Nair", batch: "React Batch 7", company: "TCS Digital", role: "Frontend Dev",   package: "₹6.8L", status: "Joined"         },
  { student: "Sneha Rao",   batch: "Java Batch 10", company: "Wipro",       role: "Java Engineer",  package: "₹8.2L", status: "Offer Accepted" },
  { student: "Aryan Das",   batch: "AWS Batch 4",   company: "HCL Cloud",   role: "Cloud Engineer", package: "₹9.5L", status: "Interviewing"   },
];

const FEEDBACK = [
  { name: "Ayesha K.", rating: 5, text: "Trainer Rahul explained Spring Boot in a very practical way.", batch: "Java 12" },
  { name: "Rohan M.",  rating: 4, text: "React workshop was great. More coding exercises would help.",  batch: "React 8" },
  { name: "Sara G.",   rating: 5, text: "AWS batch resources are very well organised. Loving it!",      batch: "AWS 5"   },
];

const REPORTS = [
  { icon: BarChart2,     title: "Monthly Enrollment Report",   desc: "All enrollments in the current month across batches."        },
  { icon: GraduationCap, title: "Trainer Performance Report",  desc: "Session delivery, attendance, and feedback summary."         },
  { icon: Rocket,        title: "Placement Statistics Report", desc: "Placement rates, companies, packages for the quarter."       },
  { icon: ClipboardList, title: "Batch Completion Report",     desc: "Completion rates, quiz scores, and certifications."          },
];

const ROADMAP = [
  { step: "Step 1", title: "Create Batch & Set Schedule",           status: "done"    },
  { step: "Step 2", title: "Assign Trainers & Students",            status: "done"    },
  { step: "Step 3", title: "Upload Resources & Materials",          status: "current" },
  { step: "Step 4", title: "Launch Live Sessions",                  status: "locked"  },
  { step: "Step 5", title: "Review Progress & Assessments",         status: "locked"  },
  { step: "Step 6", title: "Issue Certificates & Track Placements", status: "locked"  },
];

const ACTIVITY_LOG = [
  { event: "New Student Enrolled", user: "Ayesha Khan", module: "Java Backend Batch 12", time: "2 min ago",  status: "Success",   statusColor: "#22c55e" },
  { event: "Trainer Assigned",     user: "Rahul S.",    module: "React Batch 8",          time: "18 min ago", status: "Done",      statusColor: "#22c55e" },
  { event: "Resource Uploaded",    user: "Admin",       module: "Spring Boot Notes",       time: "1 hr ago",   status: "Published", statusColor: "#3b82f6" },
  { event: "Certificate Issued",   user: "Rohan M.",    module: "Java Backend Batch 11",  time: "3 hr ago",   status: "Issued",    statusColor: "#f97316" },
  { event: "Batch Created",        user: "Manager",     module: "AWS Batch 5",            time: "Yesterday",  status: "Active",    statusColor: "#22c55e" },
];

const MONTHS      = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ENROLL_VALS = [82,96,74,110,138,122,145,160,143,178,192,210];

/* ═══════════════════════════════════════════════════════════════
   PAGES CONFIG
═══════════════════════════════════════════════════════════════ */
const PAGES = [
  { id: "home",         label: "Home",         icon: LayoutDashboard },
  { id: "overview",     label: "Overview",     icon: Activity        },
  { id: "batches",      label: "Batches",      icon: Package         },
  { id: "trainers",     label: "Trainers",     icon: GraduationCap   },
  { id: "students",     label: "Students",     icon: Users           },
  { id: "sessions",     label: "Sessions",     icon: Video           },
  { id: "analytics",    label: "Analytics",    icon: BarChart2       },
  { id: "resources",    label: "Resources",    icon: FolderOpen      },
  { id: "certificates", label: "Certificates", icon: Award           },
  { id: "placements",   label: "Placements",   icon: Rocket          },
  { id: "feedback",     label: "Feedback",     icon: MessageSquare   },
  { id: "workflow",     label: "Workflow",     icon: Workflow        },
];

const NAV_DESKTOP_IDS = ["overview","batches","trainers","analytics","resources"];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const hex2rgba = (hex, a) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

/* ═══════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════════ */
function ProgressBar({ pct, color }) {
  const t = useTheme();
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(id);
  }, [pct]);
  return (
    <div style={{ background: t.barBg, borderRadius:99, height:8, overflow:"hidden", width:"100%" }}>
      <div style={{ height:"100%", borderRadius:99, background:color, width:`${width}%`, transition:"width 1.2s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function Pill({ label, color }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", borderRadius:99,
      padding:"3px 10px", fontSize:11, fontWeight:700,
      background:hex2rgba(color,0.12), color, whiteSpace:"nowrap"
    }}>{label}</span>
  );
}

function Badge({ label }) {
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:6,
      background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.22)",
      borderRadius:99, padding:"6px 16px", marginBottom:16,
      fontSize:13, fontWeight:600, color:"#f97316"
    }}>{label}</div>
  );
}

function SectionTitle({ badge, title, sub }) {
  const t = useTheme();
  return (
    <div style={{ textAlign:"center", marginBottom:48 }}>
      <Badge label={badge} />
      <h2 style={{
        fontFamily:"'Space Grotesk',sans-serif",
        fontSize:"clamp(22px,4vw,38px)", fontWeight:700,
        lineHeight:1.15, letterSpacing:"-.03em", color: t.text, marginBottom:14
      }} dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p style={{ color: t.textSub, fontSize:"clamp(14px,2vw,16px)", maxWidth:560, margin:"0 auto", lineHeight:1.7 }}>{sub}</p>}
    </div>
  );
}

function Card({ children, style={}, hover=true, onClick }) {
  const t = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: t.cardBg,
        border:`1px solid ${hov ? t.borderHov : t.border}`,
        borderRadius:18, padding:24, boxShadow: t.shadow,
        transform: hover && hov ? "translateY(-3px)" : "none",
        transition:"all .25s", cursor: onClick?"pointer":"default",
        wordBreak:"break-word", ...style
      }}
    >{children}</div>
  );
}

function StatCard({ icon:Icon, iconColor, value, label, trend, trendUp }) {
  const t = useTheme();
  return (
    <div style={{
      background: t.cardBg, border:`1px solid ${t.border}`,
      borderRadius:16, padding:"18px 20px", boxShadow: t.shadow
    }}>
      <Icon size={26} color={iconColor||"#f97316"} style={{ marginBottom:8 }} />
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(22px,3vw,28px)", fontWeight:700, color: t.text, letterSpacing:"-.03em" }}>{value}</div>
      <div style={{ fontSize:13, color: t.textMuted, fontWeight:500, marginTop:4 }}>{label}</div>
      {trend && (
        <div style={{ fontSize:12, fontWeight:700, marginTop:8, color: trendUp===true?"#22c55e":trendUp===false?"#ef4444":"#f97316" }}>{trend}</div>
      )}
    </div>
  );
}

function Avatar({ initials, color, size=48 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      display:"flex", alignItems:"center", justifyContent:"center",
      background:hex2rgba(color,0.18), border:`2px solid ${hex2rgba(color,0.4)}`,
      color, fontSize:size*0.3, fontWeight:800,
      fontFamily:"'Space Grotesk',sans-serif", flexShrink:0
    }}>{initials}</div>
  );
}

function PageWrapper({ children }) {
  const w = useWindowWidth();
  const px = w < 640 ? "16px" : w < 900 ? "20px" : "clamp(16px,4vw,24px)";
  const py = w < 640 ? "32px" : "clamp(40px,6vw,72px)";
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:`${py} ${px}` }}>
      {children}
    </div>
  );
}

function ActivityTable({ w }) {
  const t = useTheme();
  const isMobile = w < 640;
  if (isMobile) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"12px 16px" }}>
        {ACTIVITY_LOG.map((row,i) => (
          <div key={i} style={{ background: t.iconBg, borderRadius:12, padding:"12px 14px", border:`1px solid ${t.border}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontWeight:600, color: t.text, fontSize:13 }}>{row.event}</span>
              <Pill label={row.status} color={row.statusColor} />
            </div>
            <div style={{ fontSize:12, color: t.textSub }}>{row.user} · {row.module}</div>
            <div style={{ fontSize:11, color: t.textMuted, marginTop:4 }}>{row.time}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
        <thead>
          <tr>{["Event","User","Module","Time","Status"].map(h=>(
            <th key={h} style={{ color: t.textMuted, fontWeight:600, fontSize:12, textTransform:"uppercase", letterSpacing:".06em", padding:"10px 14px", borderBottom:`1px solid ${t.border}`, textAlign:"left" }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {ACTIVITY_LOG.map((row,i)=>(
            <tr key={i}
              onMouseEnter={e=>e.currentTarget.style.background=t.iconBg}
              onMouseLeave={e=>e.currentTarget.style.background=""}
            >
              <td style={{ padding:"13px 14px", borderBottom:`1px solid ${t.border}`, color: t.text }}>{row.event}</td>
              <td style={{ padding:"13px 14px", borderBottom:`1px solid ${t.border}`, color: t.textSub }}>{row.user}</td>
              <td style={{ padding:"13px 14px", borderBottom:`1px solid ${t.border}`, color: t.textSub }}>{row.module}</td>
              <td style={{ padding:"13px 14px", borderBottom:`1px solid ${t.border}`, color: t.textMuted, whiteSpace:"nowrap" }}>{row.time}</td>
              <td style={{ padding:"13px 14px", borderBottom:`1px solid ${t.border}` }}><Pill label={row.status} color={row.statusColor} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnrollmentChart() {
  const t = useTheme();
  const maxVal=220, W=580, H=180, pad=40, bW=32;
  const gap=(W-pad*2-MONTHS.length*bW)/(MONTHS.length-1);
  return (
    <div style={{ background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:18, padding:"clamp(16px,3vw,28px) clamp(12px,3vw,24px)", boxShadow: t.shadow }}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:"clamp(14px,2vw,17px)", color: t.text, marginBottom:4, letterSpacing:"-.02em" }}>Monthly Enrollments</div>
      <div style={{ fontSize:12, color: t.textMuted, marginBottom:20 }}>New student enrollments per month (2025)</div>
      <div style={{ overflowX:"auto" }}>
        <svg viewBox={`0 0 ${W} ${H+24}`} style={{ width:"100%", minWidth:300 }}>
          {MONTHS.map((m,i)=>{
            const x=pad+i*(bW+gap);
            const h2=Math.round((ENROLL_VALS[i]/maxVal)*(H-20));
            const y=H-h2;
            const hl=i>=9;
            return (
              <g key={m}>
                <rect x={x} y={y} width={bW} rx={5} height={h2} fill={hl?"#f97316":"rgba(249,115,22,0.32)"} />
                <text x={x+bW/2} y={H+14} textAnchor="middle" fill={t.textMuted} fontSize={10} fontFamily="Plus Jakarta Sans,sans-serif">{m}</text>
                {hl&&<text x={x+bW/2} y={y-6} textAnchor="middle" fill="#f97316" fontSize={10} fontWeight={700} fontFamily="Space Grotesk,sans-serif">{ENROLL_VALS[i]}</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function RoadmapList() {
  const t = useTheme();
  return (
    <div style={{ maxWidth:640, margin:"0 auto", position:"relative" }}>
      <div style={{ position:"absolute", left:23, top:24, bottom:24, width:2, background:`linear-gradient(to bottom, #f97316, ${t.border})` }} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {ROADMAP.map((r,i)=>{
          const done=r.status==="done", cur=r.status==="current", locked=r.status==="locked";
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:16, position:"relative" }}>
              <div style={{
                width:48, height:48, borderRadius:"50%", flexShrink:0, zIndex:1,
                display:"flex", alignItems:"center", justifyContent:"center",
                background: done?"#f97316":cur?"rgba(249,115,22,.12)": t.iconBg,
                border:`2px solid ${done||cur?"#f97316": t.border}`,
                color: done?"#fff":cur?"#f97316": t.textMuted
              }}>
                {done?<CheckCircle2 size={20}/>:cur?<ArrowRight size={20}/>:<Lock size={18}/>}
              </div>
              <div style={{
                flex:1, background: t.cardBg,
                border:`1px solid ${cur?"rgba(249,115,22,.35)": t.border}`,
                borderRadius:14, padding:"14px 18px",
                display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8,
                boxShadow: t.shadow, opacity:locked?0.55:1
              }}>
                <div>
                  <div style={{ fontSize:11, color: t.textMuted, fontWeight:600, marginBottom:2, letterSpacing:".04em", textTransform:"uppercase" }}>{r.step}</div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(13px,2vw,15px)", fontWeight:600, color: t.text, letterSpacing:"-.02em" }}>{r.title}</div>
                </div>
                {done&&<span style={{ background:"rgba(34,197,94,.12)", color:"#22c55e", border:"1px solid rgba(34,197,94,.25)", borderRadius:99, padding:"4px 10px", fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4, flexShrink:0 }}><CheckCircle2 size={11}/> Done</span>}
                {cur&&<span style={{ background:"rgba(249,115,22,.12)", color:"#f97316", border:"1px solid rgba(249,115,22,.25)", borderRadius:99, padding:"4px 10px", fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4, flexShrink:0 }}><ArrowRight size={11}/> Active</span>}
                {locked&&<span style={{ background: t.pillBg, color: t.textMuted, border:`1px solid ${t.border}`, borderRadius:99, padding:"4px 10px", fontSize:11, fontWeight:600, display:"inline-flex", alignItems:"center", gap:4, flexShrink:0 }}><Lock size={11}/> Locked</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CARD COMPONENTS
═══════════════════════════════════════════════════════════════ */
function FeatureCard({ f }) {
  const t = useTheme();
  const [hov,setHov]=useState(false);
  const Icon=f.icon;
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: t.cardBg, borderRadius:18, padding:"22px 20px",
        border:`1.5px solid ${hov?hex2rgba(f.color,0.4):hex2rgba(f.color,0.16)}`,
        borderTop:`3px solid ${f.color}`,
        boxShadow:hov?`0 12px 36px ${hex2rgba(f.color,0.18)}`:`0 2px 12px ${hex2rgba(f.color,0.07)}`,
        transform:hov?"translateY(-5px)":"none",
        transition:"all .25s", cursor:"pointer"
      }}
    >
      <div style={{ width:48, height:48, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, background:hex2rgba(f.color,0.12), border:`1.5px solid ${hex2rgba(f.color,0.3)}` }}>
        <Icon size={22} color={f.color}/>
      </div>
      <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(14px,2vw,16px)", fontWeight:700, color:f.color, marginBottom:8, letterSpacing:"-.02em" }}>{f.title}</h3>
      <p style={{ fontSize:"clamp(12px,1.5vw,13.5px)", color: t.textSub, lineHeight:1.65, margin:0 }}>{f.desc}</p>
    </div>
  );
}

function BatchCard({ b }) {
  const t = useTheme();
  const [hov,setHov]=useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: t.cardBg, borderRadius:18, overflow:"hidden",
        border:`1px solid ${hov?hex2rgba(b.color,0.5):hex2rgba(b.color,0.28)}`,
        boxShadow: t.shadow, transform:hov?"translateY(-3px)":"none", transition:"all .25s"
      }}
    >
      <div style={{ height:80, display:"flex", alignItems:"center", justifyContent:"center", background:hex2rgba(b.color,0.12) }}>
        <Package size={40} color={b.color}/>
      </div>
      <div style={{ padding:"16px 18px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:6 }}>
          <span style={{ background:hex2rgba(b.color,0.15), color:b.color, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{b.tag}</span>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ background:"rgba(34,197,94,.12)", color:"#22c55e", borderRadius:99, padding:"3px 8px", fontSize:11, fontWeight:700 }}>{b.status}</span>
            <span style={{ color:b.color, fontWeight:700, fontSize:14, fontFamily:"'Space Grotesk',sans-serif" }}>{b.progress}%</span>
          </div>
        </div>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(13px,2vw,15px)", fontWeight:600, color: t.text, margin:"0 0 5px", letterSpacing:"-.02em" }}>{b.title}</h3>
        <div style={{ fontSize:12, color: t.textMuted, marginBottom:10 }}>Trainer: {b.trainer} · {b.students} students</div>
        <ProgressBar pct={b.progress} color={b.color}/>
        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          <button style={{ flex:1, background:b.color, color:"#fff", border:"none", borderRadius:10, padding:"8px 0", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Manage</button>
          <button style={{ flex:1, background:"transparent", border:`1.5px solid ${b.color}`, color:b.color, borderRadius:10, padding:"8px 0", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>+ Assign</button>
        </div>
      </div>
    </div>
  );
}

function TrainerCard({ tr }) {
  const t = useTheme();
  const [hov,setHov]=useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: t.cardBg, borderRadius:20, padding:"24px 20px",
        border:`1px solid ${hov?hex2rgba(tr.color,0.4): t.border}`,
        boxShadow: t.shadow, transform:hov?"translateY(-4px)":"none",
        transition:"all .25s", textAlign:"center"
      }}
    >
      <div style={{ display:"flex", justifyContent:"center" }}>
        <Avatar initials={tr.initials} color={tr.color} size={68}/>
      </div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(15px,2vw,18px)", fontWeight:700, color: t.text, margin:"14px 0 4px", letterSpacing:"-.02em" }}>{tr.name}</div>
      <div style={{ fontSize:13, color: t.textSub, marginBottom:8 }}>{tr.role}</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:10, flexWrap:"wrap" }}>
        <span style={{ fontSize:12, color: t.textMuted, display:"flex", alignItems:"center", gap:4 }}><Clock size={12}/> {tr.exp}</span>
        <span style={{ color:"#f59e0b", fontSize:12.5, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", display:"flex", alignItems:"center", gap:3 }}><Star size={12} fill="#f59e0b"/> {tr.rating}</span>
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:18 }}>
        {[["Batches",tr.batches],["Students",tr.students]].map(([l,v])=>(
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:tr.color }}>{v}</div>
            <div style={{ fontSize:11, color: t.textMuted }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button style={{ flex:1, background:tr.color, color:"#fff", border:"none", borderRadius:10, padding:"9px 0", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Assign Batch</button>
        <button style={{ flex:1, background:"transparent", border:`1.5px solid ${tr.color}`, color:tr.color, borderRadius:10, padding:"9px 0", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>View Profile</button>
      </div>
    </div>
  );
}

function ResourceCard({ r }) {
  const t = useTheme();
  const [hov,setHov]=useState(false);
  const Icon=r.icon;
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: t.cardBg, borderRadius:18, padding:"20px 18px",
        border:`1px solid ${hov?hex2rgba(r.color,0.4): t.border}`,
        boxShadow: t.shadow, transform:hov?"translateY(-4px)":"none",
        transition:"all .25s", cursor:"pointer"
      }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div style={{ background:hex2rgba(r.color,0.12), border:`1px solid ${hex2rgba(r.color,0.22)}`, borderRadius:12, padding:10 }}>
          <Icon size={20} color={r.color}/>
        </div>
        <span style={{ background:hex2rgba(r.color,0.1), color:r.color, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:99 }}>{r.tag}</span>
      </div>
      <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(14px,2vw,16px)", fontWeight:600, color: t.text, marginBottom:8, letterSpacing:"-.02em" }}>{r.title}</h3>
      <p style={{ fontSize:"clamp(12px,1.5vw,13.5px)", color: t.textSub, lineHeight:1.65, marginBottom:14 }}>{r.desc}</p>
      <div style={{ display:"flex", gap:8 }}>
        <button style={{ flex:1, background:r.color, color:"#fff", border:"none", borderRadius:10, padding:8, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:5 }}>
          <Upload size={13}/> Upload
        </button>
        <button style={{ flex:1, background:"transparent", border:`1.5px solid ${r.color}`, color:r.color, borderRadius:10, padding:8, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Manage</button>
      </div>
    </div>
  );
}

function SessionCard({ s }) {
  const t = useTheme();
  const [hov,setHov]=useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: t.cardBg, borderRadius:18, padding:20,
        border:`1px solid ${hov?hex2rgba(s.color,0.4): t.border}`,
        boxShadow: t.shadow, transform:hov?"translateY(-3px)":"none", transition:"all .25s"
      }}
    >
      <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
        <Avatar initials={s.avatar} color={s.color} size={46}/>
        <div style={{ flex:1, minWidth:0 }}>
          {s.live&&(
            <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(239,68,68,.12)", color:"#ef4444", fontSize:10.5, fontWeight:700, padding:"2px 8px", borderRadius:99, marginBottom:5 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", display:"inline-block", animation:"pulse 1.4s infinite" }}/> LIVE
            </div>
          )}
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(14px,2vw,16px)", fontWeight:600, color: t.text, margin:"0 0 4px", letterSpacing:"-.02em" }}>{s.title}</h3>
          <div style={{ fontSize:12, color: t.textMuted, display:"flex", alignItems:"center", gap:5 }}><Calendar size={12}/> {s.time}</div>
          <div style={{ fontSize:12, color: t.textSub, marginTop:3 }}>Trainer: {s.trainer}{s.attendance?` · ${s.attendance} joined`:""}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:16 }}>
        <button style={{ flex:1, background:s.live?"#ef4444":s.color, color:"#fff", border:"none", borderRadius:11, padding:"9px 0", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"inherit" }}>
          <PlayCircle size={14}/> {s.live?"Monitor Live":"Schedule"}
        </button>
        <button style={{ flex:1, background:"transparent", border:`1.5px solid ${t.border}`, color: t.textMuted, borderRadius:11, padding:"9px 0", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Edit2 size={13}/> Edit
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════ */
function HomePage({ setPage }) {
  const t = useTheme();
  const w = useWindowWidth();
  const isPhone = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <div>
      {/* HERO */}
      <section style={{ background: t.heroBg, padding:"clamp(36px,7vw,64px) 0", borderBottom:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <div style={{
            display:"grid",
            gridTemplateColumns: isPhone ? "1fr" : isTablet ? "1fr" : "1fr 1fr",
            gap: isPhone ? 36 : isTablet ? 40 : 64,
            alignItems:"center"
          }}>
            <div>
              <Badge label="✦ Manager Control Panel"/>
              <h1 style={{
                fontFamily:"'Space Grotesk',sans-serif",
                fontSize:"clamp(28px,5vw,54px)", fontWeight:700,
                lineHeight:1.12, letterSpacing:"-.035em", color: t.text, marginBottom:18
              }}>
                Manage Your <span style={{ color:"#f97316" }}>Learning Operations</span>
              </h1>
              <p style={{ color: t.textSub, fontSize:"clamp(14px,2vw,17px)", lineHeight:1.75, maxWidth:480, marginBottom:36 }}>
                Oversee batches, assign trainers, track student performance, upload resources, review certifications, and drive placements — all from one powerful dashboard.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button onClick={()=>setPage("overview")} style={{
                  background:"#f97316", color:"#fff", border:"none", borderRadius:14,
                  padding:"12px 24px", fontWeight:700, fontSize:"clamp(13px,2vw,15px)",
                  display:"inline-flex", alignItems:"center", gap:8, cursor:"pointer",
                  boxShadow:"0 6px 24px rgba(249,115,22,.35)", fontFamily:"inherit",
                  ...(isPhone&&{width:"100%",justifyContent:"center"})
                }}>
                  <LayoutDashboard size={17}/> Open Manager Hub
                </button>
                <button onClick={()=>setPage("analytics")} style={{
                  background:"transparent", color: t.text,
                  border:`1.5px solid ${t.border}`, borderRadius:14,
                  padding:"12px 24px", fontWeight:600, fontSize:"clamp(13px,2vw,15px)",
                  display:"inline-flex", alignItems:"center", gap:8, cursor:"pointer", fontFamily:"inherit",
                  ...(isPhone&&{width:"100%",justifyContent:"center"})
                }}>
                  <BarChart2 size={17}/> View Analytics
                </button>
              </div>
              <div style={{ display:"flex", gap:isPhone?20:32, marginTop:40, flexWrap:"wrap" }}>
                {[["48","Active Batches"],["1.2k","Enrolled Students"],["24","Trainers"],["91%","Placement Rate"]].map(([v,l])=>(
                  <div key={l}>
                    <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(18px,3vw,24px)", fontWeight:700, color: t.text, letterSpacing:"-.03em" }}>{v}</div>
                    <div style={{ fontSize:12, color: t.textMuted, fontWeight:500, marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {!isPhone && (
              <div style={{
                background:"linear-gradient(135deg,rgba(249,115,22,.07) 0%,rgba(30,41,59,.05) 100%)",
                border:`1px solid ${t.border}`, borderRadius:24, padding:"clamp(18px,3vw,28px)",
                position:"relative", overflow:"hidden"
              }}>
                <div style={{ background:"#1e2329", borderRadius:14, padding:"clamp(14px,2vw,18px)", marginBottom:14, fontFamily:"monospace", fontSize:"clamp(10px,1.3vw,13px)", lineHeight:1.7, overflowX:"auto" }}>
                  <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                    {["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c, flexShrink:0 }}/>)}
                  </div>
                  <div><span style={{ color:"#8b949e" }}>// Manager Dashboard</span></div>
                  <div><span style={{ color:"#ff7b72" }}>const</span> <span style={{ color:"#79c0ff" }}>status</span> = <span style={{ color:"#3fb950" }}>fetchBatchStatus</span>();</div>
                  <div style={{ paddingLeft:16 }}><span style={{ color:"#a5d6ff" }}>"48 batches running"</span></div>
                  <div><span style={{ color:"#3fb950" }}>return</span> <span style={{ color:"#a5d6ff" }}>Overview()</span></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[
                    { icon:Users,      color:"#f97316", label:"Students",     val:"1,240"   },
                    { icon:TrendingUp, color:"#22c55e", label:"Placements",   val:"91%"     },
                    { icon:Calendar,   color:"#3b82f6", label:"Live Sessions", val:"3 Today" },
                    { icon:Award,      color:"#a855f7", label:"Certs Issued",  val:"342"    },
                  ].map(({icon:Icon,color,label,val})=>(
                    <div key={label} style={{ background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:11, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ background: t.iconBg, border:`1px solid ${t.border}`, borderRadius:8, padding:7, display:"flex", flexShrink:0 }}>
                        <Icon size={15} color={color}/>
                      </div>
                      <div>
                        <div style={{ fontSize:11, color: t.textMuted, fontWeight:500 }}>{label}</div>
                        <div style={{ fontSize:13, color: t.text, fontWeight:700 }}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ position:"absolute", top:-40, right:-40, width:150, height:150, borderRadius:"50%", border:"2px solid rgba(249,115,22,.15)", pointerEvents:"none" }}/>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OVERVIEW METRICS */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.sectionBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <SectionTitle badge="Platform Overview" title='Manager <span style="color:#f97316">Dashboard Overview</span>' sub="A real-time snapshot of everything happening across your learning platform."/>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isPhone?"140px":"170px"},1fr))`, gap:isPhone?10:14, marginBottom:28 }}>
            <StatCard icon={Package}      iconColor="#f97316" value="48"    label="Active Batches"     trend="↑ 6 this month"     trendUp={true}/>
            <StatCard icon={Users}        iconColor="#3b82f6" value="1,240" label="Total Students"     trend="↑ 142 this month"   trendUp={true}/>
            <StatCard icon={GraduationCap}iconColor="#8b5cf6" value="24"    label="Active Trainers"    trend="→ Stable"/>
            <StatCard icon={Video}        iconColor="#22c55e" value="342"   label="Live Sessions Done" trend="↑ 18 this week"     trendUp={true}/>
            <StatCard icon={Rocket}       iconColor="#f59e0b" value="91%"   label="Placement Rate"     trend="↑ 3% vs last batch" trendUp={true}/>
          </div>
          <div style={{ background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden", boxShadow: t.shadow }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:"clamp(14px,2vw,17px)", color: t.text, letterSpacing:"-.02em" }}>Recent Activity Log</div>
                <div style={{ fontSize:12, color: t.textMuted, marginTop:2 }}>Last 5 events across the platform</div>
              </div>
              <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13, display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                <Activity size={13}/> View All Logs
              </button>
            </div>
            <ActivityTable w={w}/>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.pageBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <SectionTitle badge="Admin Features" title='Everything You <span style="color:#f97316">Control</span>' sub="Complete toolkit to manage every aspect of your learning operations with precision."/>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isPhone?"100%":"220px"},1fr))`, gap:16 }}>
            {FEATURES.map(f=><FeatureCard key={f.title} f={f}/>)}
          </div>
        </div>
      </section>

      {/* BATCHES PREVIEW */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.sectionBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:36, flexWrap:"wrap", gap:14 }}>
            <div>
              <Badge label="📦 Batch Management"/>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(22px,4vw,36px)", fontWeight:700, letterSpacing:"-.03em", color: t.text, marginTop:4 }}>
                Active <span style={{ color:"#f97316" }}>Batches</span>
              </h2>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={()=>setPage("batches")} style={{ background:"transparent", border:`1.5px solid ${t.border}`, color: t.text, borderRadius:10, padding:"9px 16px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>View All</button>
              <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13, display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer", fontFamily:"inherit" }}>
                <Plus size={13}/> Create Batch
              </button>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isPhone?"100%":"260px"},1fr))`, gap:18 }}>
            {BATCHES.map(b=><BatchCard key={b.title} b={b}/>)}
          </div>
        </div>
      </section>

      {/* TRAINERS PREVIEW */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.pageBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <SectionTitle badge="Expert Mentors" title='Trainer <span style="color:#f97316">Management</span>' sub="Assign, review, and manage your panel of industry trainers with full control."/>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isPhone?"100%":"260px"},1fr))`, gap:18 }}>
            {TRAINERS.map(tr=><TrainerCard key={tr.name} tr={tr}/>)}
          </div>
        </div>
      </section>

      {/* ANALYTICS PREVIEW */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.sectionBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <SectionTitle badge="Usage Analytics" title='Platform <span style="color:#f97316">Analytics</span>' sub="Deep insights on student engagement, batch progress, and trainer performance."/>
          <div style={{ display:"grid", gridTemplateColumns: isPhone?"1fr": isTablet?"1fr":"1fr 1fr", gap:isPhone?32:56, alignItems:"center", marginBottom:40 }}>
            <div>
              <Badge label="📊 Skill Proficiency Across Batches"/>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(18px,3vw,22px)", fontWeight:700, color: t.text, margin:"0 0 10px", letterSpacing:"-.02em" }}>
                Average <span style={{ color:"#f97316" }}>Skill Levels</span>
              </h3>
              <p style={{ color: t.textSub, fontSize:"clamp(13px,2vw,15px)", lineHeight:1.7, marginBottom:24 }}>
                AI-aggregated skill proficiency of all enrolled students based on quizzes and coding performance.
              </p>
              <button onClick={()=>setPage("analytics")} style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:13, padding:"11px 20px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:8, fontSize:14 }}>
                <BarChart2 size={15}/> Full Analytics Report
              </button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {SKILLS.map(sk=>(
                <div key={sk.name}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                    <span style={{ color: t.text, fontWeight:600, fontSize:"clamp(13px,2vw,15px)" }}>{sk.name}</span>
                    <span style={{ color:sk.color, fontWeight:700, fontSize:"clamp(13px,2vw,15px)", fontFamily:"'Space Grotesk',sans-serif" }}>{sk.pct}%</span>
                  </div>
                  <ProgressBar pct={sk.pct} color={sk.color}/>
                </div>
              ))}
            </div>
          </div>
          <EnrollmentChart/>
        </div>
      </section>

      {/* RESOURCES PREVIEW */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.pageBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <SectionTitle badge="📁 Resources" title='Learning <span style="color:#f97316">Resources</span>' sub="Upload, organise, and publish study materials across all batches and courses."/>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isPhone?"100%":"220px"},1fr))`, gap:16 }}>
            {RESOURCES.map(r=><ResourceCard key={r.title} r={r}/>)}
          </div>
        </div>
      </section>

      {/* FEEDBACK & REPORTS */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.sectionBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <SectionTitle badge="📋 Feedback" title='Feedback <span style="color:#f97316">&amp; Reports</span>' sub="Review student and trainer feedback, generate org-level reports, and act on insights."/>
          <div style={{ display:"grid", gridTemplateColumns: isPhone?"1fr": isTablet?"1fr":"1fr 1fr", gap:isPhone?32:52, alignItems:"start" }}>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(15px,2vw,18px)", fontWeight:700, color: t.text, marginBottom:16, letterSpacing:"-.02em" }}>Recent Feedback</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {FEEDBACK.map((f,i)=>(
                  <Card key={i} style={{ borderRadius:13, padding:"14px 18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <Avatar initials={f.name.split(" ").map(w=>w[0]).join("")} color="#f97316" size={34}/>
                      <div>
                        <div style={{ fontWeight:600, color: t.text, fontSize:13 }}>{f.name}</div>
                        <div style={{ fontSize:11, color: t.textMuted }}>{f.batch}</div>
                      </div>
                      <div style={{ marginLeft:"auto", color:"#f59e0b", fontSize:12.5, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
                        <Star size={12} fill="#f59e0b"/> {f.rating}/5
                      </div>
                    </div>
                    <p style={{ fontSize:13, color: t.textSub, lineHeight:1.6, margin:0 }}>"{f.text}"</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(15px,2vw,18px)", fontWeight:700, color: t.text, marginBottom:16, letterSpacing:"-.02em" }}>Generate Reports</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {REPORTS.map((r,i)=>{
                  const Icon=r.icon;
                  return (
                    <Card key={i} style={{ borderRadius:13, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                      <Icon size={24} color="#f97316" style={{ flexShrink:0 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, color: t.text, fontSize:13 }}>{r.title}</div>
                        <div style={{ fontSize:12, color: t.textMuted, marginTop:2 }}>{r.desc}</div>
                      </div>
                      <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:4, flexShrink:0 }}>
                        <Download size={11}/> Export
                      </button>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section style={{ padding:"clamp(40px,7vw,72px) 0", background: t.pageBg }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)` }}>
          <SectionTitle badge="🗺️ Workflow" title='Manager <span style="color:#f97316">Workflow</span>' sub="The standard operating process every Manager follows to run a successful batch."/>
          <RoadmapList/>
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding:"clamp(40px,7vw,60px) 0", background:"linear-gradient(135deg,#1E293B 0%,#0f172a 100%)", position:"relative", overflow:"hidden", textAlign:"center" }}>
        <div style={{ position:"absolute", top:-40, left:-40, width:200, height:200, borderRadius:"50%", background:"rgba(249,115,22,.1)", filter:"blur(50px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(249,115,22,.07)", filter:"blur(40px)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:680, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)`, position:"relative" }}>
          <Badge label="⚡ Start Managing"/>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(22px,4vw,40px)", fontWeight:700, color:"#fff", lineHeight:1.15, letterSpacing:"-.035em", margin:"0 0 12px" }}>
            Ready To Run Your <span style={{ color:"#f97316" }}>Learning Platform?</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,.45)", fontSize:"clamp(13px,2vw,15px)", lineHeight:1.65, maxWidth:480, margin:"0 auto 24px" }}>
            Access the full Manager Hub to control every batch, trainer, student, and resource from one place.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>setPage("overview")} style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:8, ...(isPhone&&{width:"100%",justifyContent:"center"}) }}>
              <LayoutDashboard size={15}/> Open Manager Hub
            </button>
            <button onClick={()=>setPage("feedback")} style={{ background:"transparent", color:"#fff", border:"1.5px solid rgba(255,255,255,.18)", borderRadius:12, padding:"11px 22px", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit", ...(isPhone&&{width:"100%"}) }}>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INNER PAGES
═══════════════════════════════════════════════════════════════ */
function OverviewPage() {
  const t = useTheme();
  const w = useWindowWidth();
  return (
    <PageWrapper>
      <SectionTitle badge="Platform Overview" title='Manager <span style="color:#f97316">Dashboard Overview</span>' sub="A real-time snapshot of everything happening across your learning platform."/>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${w<640?"140px":"170px"},1fr))`, gap:w<640?10:14, marginBottom:28 }}>
        <StatCard icon={Package}      iconColor="#f97316" value="48"    label="Active Batches"     trend="↑ 6 this month"     trendUp={true}/>
        <StatCard icon={Users}        iconColor="#3b82f6" value="1,240" label="Total Students"     trend="↑ 142 this month"   trendUp={true}/>
        <StatCard icon={GraduationCap}iconColor="#8b5cf6" value="24"    label="Active Trainers"    trend="→ Stable"/>
        <StatCard icon={Video}        iconColor="#22c55e" value="342"   label="Live Sessions Done" trend="↑ 18 this week"     trendUp={true}/>
        <StatCard icon={Rocket}       iconColor="#f59e0b" value="91%"   label="Placement Rate"     trend="↑ 3% vs last batch" trendUp={true}/>
      </div>
      <div style={{ background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden", boxShadow: t.shadow }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:"clamp(14px,2vw,17px)", color: t.text, letterSpacing:"-.02em" }}>Recent Activity Log</div>
            <div style={{ fontSize:12, color: t.textMuted, marginTop:2 }}>Last 5 events across the platform</div>
          </div>
          <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13, display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
            <Activity size={13}/> View All Logs
          </button>
        </div>
        <ActivityTable w={w}/>
      </div>
    </PageWrapper>
  );
}

function BatchesPage() {
  const t = useTheme();
  const w = useWindowWidth();
  return (
    <PageWrapper>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:36, flexWrap:"wrap", gap:14 }}>
        <div>
          <Badge label="📦 Batch Management"/>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(22px,4vw,36px)", fontWeight:700, letterSpacing:"-.03em", color: t.text, marginTop:4 }}>
            Active <span style={{ color:"#f97316" }}>Batches</span>
          </h2>
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button style={{ background:"transparent", border:`1.5px solid ${t.border}`, color: t.text, borderRadius:10, padding:"9px 16px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>View All</button>
          <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13, display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer", fontFamily:"inherit" }}>
            <Plus size={13}/> Create Batch
          </button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${w<640?"100%":"260px"},1fr))`, gap:18 }}>
        {BATCHES.map(b=><BatchCard key={b.title} b={b}/>)}
      </div>
    </PageWrapper>
  );
}

function TrainersPage() {
  const w = useWindowWidth();
  return (
    <PageWrapper>
      <SectionTitle badge="Expert Mentors" title='Trainer <span style="color:#f97316">Management</span>' sub="Assign, review, and manage your panel of industry trainers with full control."/>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${w<640?"100%":"260px"},1fr))`, gap:18 }}>
        {TRAINERS.map(tr=><TrainerCard key={tr.name} tr={tr}/>)}
      </div>
    </PageWrapper>
  );
}

function StudentsPage() {
  const t = useTheme();
  const w = useWindowWidth();
  const [search, setSearch] = useState("");
  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.batch.toLowerCase().includes(search.toLowerCase())
  );
  const statusColor = { Active:"#22c55e", "At Risk":"#ef4444", Completed:"#3b82f6" };
  const isMobile = w < 640;

  return (
    <PageWrapper>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:36, flexWrap:"wrap", gap:14 }}>
        <div>
          <Badge label="👥 All Students"/>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(22px,4vw,36px)", fontWeight:700, letterSpacing:"-.03em", color: t.text, marginTop:4 }}>
            Student <span style={{ color:"#f97316" }}>Directory</span>
          </h2>
        </div>
        <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13, display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer", fontFamily:"inherit" }}>
          <Plus size={13}/> Add Student
        </button>
      </div>
      <div style={{ background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden", boxShadow: t.shadow }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background: t.iconBg, border:`1px solid ${t.border}`, borderRadius:10, padding:"9px 14px" }}>
            <Search size={15} color={t.textMuted} style={{ flexShrink:0 }}/>
            <input
              placeholder="Search students…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, background:"transparent", border:"none", outline:"none", color: t.text, fontFamily:"inherit", fontSize:14 }}
            />
          </div>
        </div>
        {isMobile ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"12px 16px" }}>
            {filtered.map((s,i)=>(
              <div key={i} style={{ background: t.iconBg, borderRadius:12, padding:"12px 14px", border:`1px solid ${t.border}` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontWeight:600, color: t.text, fontSize:13 }}>{s.name}</span>
                  <Pill label={s.status} color={statusColor[s.status]||"#888"}/>
                </div>
                <div style={{ fontSize:12, color: t.textSub, marginBottom:8 }}>{s.batch} · {s.quizzes} quizzes done</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ flex:1, background: t.barBg, borderRadius:99, height:6, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:99, background:"#f97316", width:`${s.progress}%` }}/>
                  </div>
                  <span style={{ fontSize:12, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:"#f97316" }}>{s.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
              <thead>
                <tr>{["Student","Batch","Progress","Quizzes","Status","Action"].map(h=>(
                  <th key={h} style={{ color: t.textMuted, fontWeight:600, fontSize:12, textTransform:"uppercase", letterSpacing:".06em", padding:"10px 14px", borderBottom:`1px solid ${t.border}`, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((s,i)=>(
                  <tr key={i}
                    onMouseEnter={e=>e.currentTarget.style.background=t.iconBg}
                    onMouseLeave={e=>e.currentTarget.style.background=""}
                  >
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, fontWeight:600, color: t.text }}>{s.name}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, color: t.textSub, whiteSpace:"nowrap" }}>{s.batch}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ background: t.barBg, borderRadius:99, height:6, width:70, overflow:"hidden", flexShrink:0 }}>
                          <div style={{ height:"100%", borderRadius:99, background:"#f97316", width:`${s.progress}%` }}/>
                        </div>
                        <span style={{ fontSize:12, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:"#f97316" }}>{s.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, color: t.textSub, whiteSpace:"nowrap" }}>{s.quizzes} done</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}` }}><Pill label={s.status} color={statusColor[s.status]||"#888"}/></td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}` }}>
                      <button style={{ background:"transparent", border:`1px solid ${t.border}`, borderRadius:8, padding:"5px 10px", fontSize:12, cursor:"pointer", color: t.textSub, fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
                        View <ChevronRight size={12}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function SessionsPage() {
  const w = useWindowWidth();
  return (
    <PageWrapper>
      <SectionTitle badge="📹 Live Sessions" title='Manage <span style="color:#f97316">Live Sessions</span>' sub="Schedule, monitor, and review all trainer-led live sessions in real time."/>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${w<640?"100%":"260px"},1fr))`, gap:18 }}>
        {SESSIONS.map(s=><SessionCard key={s.title} s={s}/>)}
      </div>
    </PageWrapper>
  );
}

function AnalyticsPage() {
  const t = useTheme();
  const w = useWindowWidth();
  const isPhone = w < 640;
  return (
    <PageWrapper>
      <SectionTitle badge="Usage Analytics" title='Platform <span style="color:#f97316">Analytics</span>' sub="Deep insights on student engagement, batch progress, and trainer performance."/>
      <div style={{ display:"grid", gridTemplateColumns: isPhone?"1fr":"1fr 1fr", gap:isPhone?32:56, alignItems:"center", marginBottom:40 }}>
        <div>
          <Badge label="📊 Skill Proficiency Across Batches"/>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(18px,3vw,22px)", fontWeight:700, color: t.text, margin:"0 0 10px", letterSpacing:"-.02em" }}>
            Average <span style={{ color:"#f97316" }}>Skill Levels</span>
          </h3>
          <p style={{ color: t.textSub, fontSize:"clamp(13px,2vw,15px)", lineHeight:1.7, marginBottom:24 }}>
            AI-aggregated skill proficiency of all enrolled students based on quizzes and coding performance.
          </p>
          <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:13, padding:"11px 20px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:8, fontSize:14 }}>
            <BarChart2 size={15}/> Full Analytics Report
          </button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {SKILLS.map(sk=>(
            <div key={sk.name}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ color: t.text, fontWeight:600, fontSize:"clamp(13px,2vw,15px)" }}>{sk.name}</span>
                <span style={{ color:sk.color, fontWeight:700, fontSize:"clamp(13px,2vw,15px)", fontFamily:"'Space Grotesk',sans-serif" }}>{sk.pct}%</span>
              </div>
              <ProgressBar pct={sk.pct} color={sk.color}/>
            </div>
          ))}
        </div>
      </div>
      <EnrollmentChart/>
    </PageWrapper>
  );
}

function ResourcesPage() {
  const w = useWindowWidth();
  return (
    <PageWrapper>
      <SectionTitle badge="📁 Resources" title='Learning <span style="color:#f97316">Resources</span>' sub="Upload, organise, and publish study materials across all batches and courses."/>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${w<640?"100%":"220px"},1fr))`, gap:16 }}>
        {RESOURCES.map(r=><ResourceCard key={r.title} r={r}/>)}
      </div>
    </PageWrapper>
  );
}

function CertificatesPage() {
  const t = useTheme();
  const w = useWindowWidth();
  const isMobile = w < 640;
  return (
    <PageWrapper>
      <SectionTitle badge="🏆 Certificates" title='Certificate <span style="color:#f97316">Management</span>' sub="Issue, review, and verify certificates for completed learners."/>
      <div style={{ background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden", boxShadow: t.shadow, maxWidth:isMobile?"100%":860, margin:"0 auto" }}>
        {isMobile ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"12px 16px" }}>
            {CERTS.map((c,i)=>(
              <div key={i} style={{ background: t.iconBg, borderRadius:12, padding:"14px 16px", border:`1px solid ${t.border}` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontWeight:600, color: t.text, fontSize:13 }}>{c.student}</span>
                  <Pill label={c.status} color={c.status==="Issued"?"#22c55e":"#f97316"}/>
                </div>
                <div style={{ fontSize:12, color: t.textSub, marginBottom:4 }}>{c.course}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:"#f97316", fontSize:13 }}>{c.grade}</span>
                    <span style={{ fontSize:11, color: t.textMuted, marginLeft:8 }}>{c.date}</span>
                  </div>
                  <button style={{ background:c.status==="Issued"?"#f97316":"transparent", color:c.status==="Issued"?"#fff": t.textMuted, border:`1px solid ${c.status==="Issued"?"#f97316": t.border}`, borderRadius:8, padding:"5px 10px", fontSize:11, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:4 }}>
                    {c.status==="Issued"?<><Download size={11}/> Download</>:"Pending"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
              <thead>
                <tr>{["Student","Course","Grade","Date","Status","Action"].map(h=>(
                  <th key={h} style={{ color: t.textMuted, fontWeight:600, fontSize:12, textTransform:"uppercase", letterSpacing:".06em", padding:"10px 14px", borderBottom:`1px solid ${t.border}`, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {CERTS.map((c,i)=>(
                  <tr key={i}
                    onMouseEnter={e=>e.currentTarget.style.background=t.iconBg}
                    onMouseLeave={e=>e.currentTarget.style.background=""}
                  >
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, fontWeight:600, color: t.text }}>{c.student}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, color: t.textSub }}>{c.course}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:"#f97316" }}>{c.grade}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, color: t.textMuted, whiteSpace:"nowrap" }}>{c.date}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}` }}><Pill label={c.status} color={c.status==="Issued"?"#22c55e":"#f97316"}/></td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}` }}>
                      <button style={{ background:c.status==="Issued"?"#f97316":"transparent", color:c.status==="Issued"?"#fff": t.textMuted, border:`1px solid ${c.status==="Issued"?"#f97316": t.border}`, borderRadius:8, padding:"5px 11px", fontSize:12, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:4 }}>
                        {c.status==="Issued"?<><Download size={12}/> Download</>:"Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function PlacementsPage() {
  const t = useTheme();
  const w = useWindowWidth();
  const isMobile = w < 640;
  const statusColors = { Joined:"#22c55e", "Offer Accepted":"#f97316", Interviewing:"#3b82f6" };
  return (
    <PageWrapper>
      <SectionTitle badge="🚀 Placements" title='Placement <span style="color:#f97316">Tracker</span>' sub="Track student job placements, company tie-ups, and offer letters in one place."/>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${isMobile?"140px":"170px"},1fr))`, gap:isMobile?10:14, marginBottom:28 }}>
        <StatCard icon={Building2} iconColor="#22c55e" value="87"    label="Students Placed"   trend="This Quarter"/>
        <StatCard icon={Briefcase} iconColor="#f97316" value="34"    label="Partner Companies" trend="↑ 4 new" trendUp={true}/>
        <StatCard icon={TrendingUp}iconColor="#3b82f6" value="₹8.4L" label="Avg. Package"       trend="↑ ₹60k vs last" trendUp={true}/>
      </div>
      <div style={{ background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden", boxShadow: t.shadow }}>
        {isMobile ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"12px 16px" }}>
            {PLACEMENTS.map((p,i)=>(
              <div key={i} style={{ background: t.iconBg, borderRadius:12, padding:"14px 16px", border:`1px solid ${t.border}` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontWeight:600, color: t.text, fontSize:13 }}>{p.student}</span>
                  <Pill label={p.status} color={statusColors[p.status]||"#888"}/>
                </div>
                <div style={{ fontSize:12, color: t.textSub, marginBottom:4 }}>{p.company} · {p.role}</div>
                <div style={{ fontSize:12, color: t.textMuted }}>{p.batch}</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:"#22c55e", fontSize:14, marginTop:6 }}>{p.package}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
              <thead>
                <tr>{["Student","Batch","Company","Role","Package","Status"].map(h=>(
                  <th key={h} style={{ color: t.textMuted, fontWeight:600, fontSize:12, textTransform:"uppercase", letterSpacing:".06em", padding:"10px 14px", borderBottom:`1px solid ${t.border}`, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {PLACEMENTS.map((p,i)=>(
                  <tr key={i}
                    onMouseEnter={e=>e.currentTarget.style.background=t.iconBg}
                    onMouseLeave={e=>e.currentTarget.style.background=""}
                  >
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, fontWeight:600, color: t.text }}>{p.student}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, color: t.textSub, whiteSpace:"nowrap" }}>{p.batch}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, color: t.text }}>{p.company}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, color: t.textSub, whiteSpace:"nowrap" }}>{p.role}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:"#22c55e", whiteSpace:"nowrap" }}>{p.package}</td>
                    <td style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}` }}><Pill label={p.status} color={statusColors[p.status]||"#888"}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function FeedbackPage() {
  const t = useTheme();
  const w = useWindowWidth();
  const isPhone = w < 640;
  return (
    <PageWrapper>
      <SectionTitle badge="📋 Feedback" title='Feedback <span style="color:#f97316">&amp; Reports</span>' sub="Review student and trainer feedback, generate org-level reports, and act on insights."/>
      <div style={{ display:"grid", gridTemplateColumns: isPhone?"1fr":"1fr 1fr", gap:isPhone?32:52, alignItems:"start" }}>
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(15px,2vw,18px)", fontWeight:700, color: t.text, marginBottom:16, letterSpacing:"-.02em" }}>Recent Feedback</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {FEEDBACK.map((f,i)=>(
              <Card key={i} style={{ borderRadius:13, padding:"14px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <Avatar initials={f.name.split(" ").map(w=>w[0]).join("")} color="#f97316" size={34}/>
                  <div>
                    <div style={{ fontWeight:600, color: t.text, fontSize:13 }}>{f.name}</div>
                    <div style={{ fontSize:11, color: t.textMuted }}>{f.batch}</div>
                  </div>
                  <div style={{ marginLeft:"auto", color:"#f59e0b", fontSize:12.5, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
                    <Star size={12} fill="#f59e0b"/> {f.rating}/5
                  </div>
                </div>
                <p style={{ fontSize:13, color: t.textSub, lineHeight:1.6, margin:0 }}>"{f.text}"</p>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(15px,2vw,18px)", fontWeight:700, color: t.text, marginBottom:16, letterSpacing:"-.02em" }}>Generate Reports</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {REPORTS.map((r,i)=>{
              const Icon=r.icon;
              return (
                <Card key={i} style={{ borderRadius:13, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                  <Icon size={24} color="#f97316" style={{ flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, color: t.text, fontSize:13 }}>{r.title}</div>
                    <div style={{ fontSize:12, color: t.textMuted, marginTop:2 }}>{r.desc}</div>
                  </div>
                  <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:4, flexShrink:0 }}>
                    <Download size={11}/> Export
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function WorkflowPage() {
  return (
    <PageWrapper>
      <SectionTitle badge="🗺️ Workflow" title='Manager <span style="color:#f97316">Workflow</span>' sub="The standard operating process every Manager follows to run a successful batch."/>
      <RoadmapList/>
    </PageWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
   ✅ FIX: Uses toggleTheme prop instead of local setDark
═══════════════════════════════════════════════════════════════ */
function Navbar({ dark, toggleTheme, page, setPage }) {
  const navigate = useNavigate();
  const t = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const w = useWindowWidth();
  const showMobileMenu = w < 900;

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:999,
        background: t.navBg, backdropFilter:"blur(18px)",
        borderBottom:`1px solid ${t.border}`, height:68,
        display:"flex", alignItems:"center", transition:"background .3s"
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 clamp(16px,4vw,24px)`, width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>

          {/* LOGO */}
          <div
            onClick={() => {
              navigate("/");
              setDrawerOpen(false);
            }}
            style={{ cursor:"pointer", userSelect:"none", display:"flex", alignItems:"center", flexShrink:0 }}
          >
            <span style={{ fontSize:"clamp(22px,3vw,28px)", fontWeight:800, fontFamily:"serif", lineHeight:1 }}>
              <span style={{ color:"#16a34a" }}>ILM</span>
              <span style={{ color:"#f97316", marginLeft:4 }}>ORA</span>
            </span>
            <span style={{
              display:"inline-flex", alignItems:"center",
              background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.3)",
              borderRadius:4, marginLeft:8, padding:"2px 6px",
              fontSize:9, fontWeight:700, letterSpacing:".1em", color:"#f97316",
              textTransform:"uppercase", verticalAlign:"middle"
            }}>Beta</span>
          </div>

          {!showMobileMenu && (
            <div style={{ display:"flex", alignItems:"center", gap:4, flex:1, justifyContent:"center", flexWrap:"nowrap" }}>
              {PAGES.filter(p=>NAV_DESKTOP_IDS.includes(p.id)).map(p=>(
                <NavLink key={p.id} label={p.label} active={page===p.id} onClick={()=>setPage(p.id)}/>
              ))}
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            {/* ✅ FIXED: was onClick={()=>setDark(!dark)} */}
            <button
              onClick={toggleTheme}
              style={{ width:38, height:38, borderRadius:11, border:`1px solid ${t.border}`, background: t.btnBg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color: t.text, transition:"all .2s", flexShrink:0 }}
              aria-label="Toggle theme"
            >
              {dark?<Sun size={17}/>:<Moon size={17}/>}
            </button>
            {!showMobileMenu && (
              <button style={{
                background:"#1E293B", color:"#fff", border:"none", borderRadius:11,
                padding:"0 16px", height:38, fontWeight:700, fontSize:13,
                display:"inline-flex", alignItems:"center", gap:6,
                cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"
              }}>
                <LogIn size={15}/> Manager Login
              </button>
            )}
            {showMobileMenu && (
              <button
                onClick={()=>setDrawerOpen(true)}
                style={{ width:38, height:38, borderRadius:11, border:`1px solid ${t.border}`, background: t.btnBg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color: t.text }}
                aria-label="Menu"
              >
                <Menu size={20}/>
              </button>
            )}
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <div style={{
          position:"fixed", inset:0, zIndex:9999, background: t.pageBg,
          display:"flex", flexDirection:"column", fontFamily:"inherit", overflowY:"auto"
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${t.border}`, position:"sticky", top:0, background: t.pageBg, zIndex:10 }}>
            <span
              onClick={() => { setPage("home"); setDrawerOpen(false); }}
              style={{ cursor:"pointer", userSelect:"none", display:"flex", alignItems:"center" }}
            >
              <span style={{ color:"#16a34a", fontSize:24, fontWeight:800, fontFamily:"serif" }}>ILM</span>
              <span style={{ color:"#f97316", fontSize:24, fontWeight:800, fontFamily:"serif" }}>ORA</span>
              <span style={{
                display:"inline-flex", alignItems:"center",
                background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.3)",
                borderRadius:4, marginLeft:8, padding:"2px 6px",
                fontSize:9, fontWeight:700, letterSpacing:".1em", color:"#f97316",
                textTransform:"uppercase"
              }}>Beta</span>
            </span>
            <button onClick={()=>setDrawerOpen(false)} style={{ border:"none", background: t.btnBg, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color: t.textMuted }}>
              <X size={18}/>
            </button>
          </div>
          <div style={{ flex:1, padding:"8px 0" }}>
            {PAGES.map(p=>{
              const Icon=p.icon;
              return (
                <button key={p.id} onClick={()=>{ setPage(p.id); setDrawerOpen(false); }} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:14,
                  padding:"14px 24px", border:"none", borderBottom:`1px solid ${t.border}`,
                  background: page===p.id ? "rgba(249,115,22,0.06)" : "transparent",
                  cursor:"pointer", textAlign:"left", fontSize:15, fontWeight:600,
                  color: page===p.id ? "#f97316" : t.text, fontFamily:"inherit",
                  borderLeft:`3px solid ${page===p.id?"#f97316":"transparent"}`
                }}>
                  <Icon size={18} color={page===p.id?"#f97316": t.textMuted}/> {p.label}
                </button>
              );
            })}
          </div>
          <div style={{ padding:"16px 20px", borderTop:`1px solid ${t.border}`, display:"flex", flexDirection:"column", gap:10 }}>
            {/* ✅ FIXED: was onClick={()=>setDark(!dark)} */}
            <button onClick={toggleTheme} style={{
              display:"flex", alignItems:"center", gap:10,
              background: t.btnBg, border:`1px solid ${t.border}`, borderRadius:11, padding:"11px 16px",
              cursor:"pointer", fontSize:14, fontWeight:600, color: t.text, fontFamily:"inherit"
            }}>
              {dark?<Sun size={17}/>:<Moon size={17}/>} {dark?"Light Mode":"Dark Mode"}
            </button>
            <button style={{ background:"#f97316", color:"#fff", border:"none", borderRadius:12, padding:"12px 0", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <LogIn size={16}/> Manager Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ label, active, onClick }) {
  const t = useTheme();
  const [hov,setHov]=useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: active?"rgba(249,115,22,0.08)":hov?"rgba(249,115,22,0.06)":"transparent",
        border:"none", cursor:"pointer",
        color: active||hov?"#f97316": t.text,
        fontWeight:500, fontSize:15, padding:"8px 14px", borderRadius:10,
        fontFamily:"inherit", transition:"all .2s", whiteSpace:"nowrap"
      }}
    >{label}</button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
function Sidebar({ page, setPage }) {
  const t = useTheme();
  return (
    <div style={{
      width:210, flexShrink:0, background: t.cardBg,
      borderRight:`1px solid ${t.border}`,
      minHeight:"calc(100vh - 68px)",
      position:"sticky", top:68, overflowY:"auto",
      padding:"12px 0", alignSelf:"flex-start"
    }}>
      {PAGES.map(p=>{
        const Icon=p.icon;
        const active=page===p.id;
        return (
          <button key={p.id} onClick={()=>setPage(p.id)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"10px 16px", border:"none",
            background: active?"rgba(249,115,22,0.08)":"transparent",
            cursor:"pointer", textAlign:"left", fontSize:13.5, fontWeight:active?600:500,
            color: active?"#f97316": t.textSub, fontFamily:"inherit",
            borderLeft:`3px solid ${active?"#f97316":"transparent"}`,
            transition:"all .15s"
          }}>
            <Icon size={15} color={active?"#f97316": t.textMuted}/> {p.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
   ✅ FIX: No local theme state. Uses theme + toggleTheme from App.jsx props.
   ✅ FIX: dark derived from theme prop only.
═══════════════════════════════════════════════════════════════ */
export default function ManagerHub({
  theme = "light",
  toggleTheme,
}) {
  const dark = theme === "dark";
  const [page, setPage] = useState("home");
  const t = dark ? DARK : LIGHT;
  const w = useWindowWidth();
  const showSidebar = w >= 900;
  const isHome = page === "home";

  const pageComponents = {
    home:         <HomePage setPage={setPage}/>,
    overview:     <OverviewPage/>,
    batches:      <BatchesPage/>,
    trainers:     <TrainersPage/>,
    students:     <StudentsPage/>,
    sessions:     <SessionsPage/>,
    analytics:    <AnalyticsPage/>,
    resources:    <ResourcesPage/>,
    certificates: <CertificatesPage/>,
    placements:   <PlacementsPage/>,
    feedback:     <FeedbackPage/>,
    workflow:     <WorkflowPage/>,
  };

  return (
    <ThemeContext.Provider value={t}>
      <div style={{ background: t.pageBg, color: t.text, minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"background .3s,color .3s" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
          html { scroll-behavior:smooth; }
          body { font-family:'Plus Jakarta Sans',sans-serif; overflow-x:hidden; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
          ::-webkit-scrollbar { width:6px; height:6px; }
          ::-webkit-scrollbar-track { background:transparent; }
          ::-webkit-scrollbar-thumb { background:rgba(249,115,22,0.3); border-radius:99px; }
          input::placeholder { color:${t.textMuted}; }
        `}</style>

        <Navbar
          dark={dark}
          toggleTheme={toggleTheme}
          page={page}
          setPage={setPage}
        />

        <div style={{ paddingTop:68, display:"flex", alignItems:"flex-start" }}>
          {!isHome && showSidebar && (
            <Sidebar page={page} setPage={setPage}/>
          )}
          <div style={{ flex:1, minWidth:0, background: t.pageBg }}>
            {pageComponents[page] || pageComponents["home"]}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}