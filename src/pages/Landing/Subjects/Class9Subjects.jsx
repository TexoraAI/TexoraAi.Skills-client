// src/pages/Landing/Subjects/Class9Subjects.jsx
// Route: /school-class/9
// Flow: School Programs → Explore Class 9 → [this page] → subject page

import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, ChevronRight, Calculator, FlaskConical,
  BookOpen, Globe, BookMarked, Languages, ArrowLeft,
} from "lucide-react";

// ─── SUBJECTS DATA ────────────────────────────────────────────────────────────

const subjects = [
  {
    Icon: Sparkles,
    name: "Artificial Intelligence",
    desc: "AI Basics, Python, ML & Practical Projects",
    chapters: 10,
    videos: 75,
    color: "#7c3aed",
    bg: "#f3e8ff",
    route: "/school-class/9/ai",
  },
  {
    Icon: Calculator,
    name: "Mathematics",
    desc: "Algebra, Geometry, Trigonometry & more",
    chapters: 14,
    videos: 120,
    color: "#f47b20",
    bg: "#fff4ec",
    route: "/school-class/9/math",
  },
  {
    Icon: FlaskConical,
    name: "Science",
    desc: "Physics, Chemistry & Biology fundamentals",
    chapters: 18,
    videos: 145,
    color: "#16a34a",
    bg: "#f0fdf4",
    route: "/school-class/9/science",
  },
  {
    Icon: BookOpen,
    name: "English",
    desc: "Grammar, Comprehension & Writing skills",
    chapters: 12,
    videos: 96,
    color: "#2563eb",
    bg: "#eff6ff",
    route: "/school-class/9/english",
  },
  {
    Icon: Globe,
    name: "Social Studies",
    desc: "History, Geography, Civics & Economics",
    chapters: 16,
    videos: 110,
    color: "#7c3aed",
    bg: "#f5f3ff",
    route: "/school-class/9/social-studies",
  },
  {
    Icon: BookMarked,
    name: "Urdu",
    desc: "Nazm, Nasr, Grammar & Composition",
    chapters: 10,
    videos: 80,
    color: "#dc2626",
    bg: "#fef2f2",
    route: "/school-class/9/urdu",
  },
  {
    Icon: Languages,
    name: "Hindi",
    desc: "Gadya, Padya, Vyakaran & Lekhan",
    chapters: 10,
    videos: 75,
    color: "#d97706",
    bg: "#fffbeb",
    route: "/school-class/9/hindi",
  },
  {
    Icon: BookMarked,
    name: "Sanskrit",
    desc: "Shloka, Vyakaran & Translation practice",
    chapters: 8,
    videos: 60,
    color: "#0891b2",
    bg: "#ecfeff",
    route: "/school-class/9/sanskrit",
  },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --green:#1a5c2a; --orange:#f47b20; --dark:#1a1f2e; --bg:#f5ede4;
    --white:#ffffff; --light-orange:#fff4ec; --text:#3a3a3a; --muted:#6b6b6b;
    --nav-bg:#ffffff; --nav-border:#ede0d5;
  }

  .s9-wrap * { box-sizing:border-box; margin:0; padding:0; }
  .s9-wrap {
    font-family:'Poppins',sans-serif;
    background:var(--bg); color:var(--text); min-height:100vh;
  }

  /* NAVBAR */
  .s9-navbar {
    position:sticky; top:0; z-index:100;
    background:var(--nav-bg); border-bottom:1px solid var(--nav-border);
    padding:0 80px; height:64px;
    display:flex; align-items:center; justify-content:space-between;
    box-shadow:0 1px 8px rgba(0,0,0,0.06);
  }
  .s9-logo-btn { display:flex; align-items:center; gap:10px; background:transparent; border:none; cursor:pointer; padding:0; }
  .s9-logo-icon { width:40px; height:40px; background:#F97316; border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(249,115,22,0.35); }
  .s9-logo-text { font-family:'Nunito',sans-serif; font-size:1.6rem; font-weight:900; letter-spacing:-0.5px; }
  .s9-logo-text .lg { color:var(--green); }
  .s9-logo-text .lo { color:#F97316; }

  /* BREADCRUMB */
  .s9-breadcrumb {
    padding:20px 80px 0;
    display:flex; align-items:center; gap:6px;
    font-size:0.82rem; color:var(--muted);
  }
  .s9-breadcrumb span { cursor:pointer; transition:color 0.2s; }
  .s9-breadcrumb span:hover { color:var(--orange); }
  .s9-breadcrumb .active { color:var(--dark); font-weight:600; cursor:default; }
  .s9-breadcrumb svg { opacity:0.4; }

  /* HEADER */
  .s9-header {
    padding:32px 80px 48px;
    display:flex; align-items:flex-end; justify-content:space-between; gap:24px;
  }
  .s9-back-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:var(--white); border:1.5px solid #e8d5c4;
    border-radius:8px; padding:8px 16px;
    font-size:0.85rem; font-weight:600; color:var(--dark);
    cursor:pointer; transition:background 0.2s, border-color 0.2s; margin-bottom:16px;
  }
  .s9-back-btn:hover { background:var(--light-orange); border-color:var(--orange); }

  .s9-class-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:var(--orange); color:white;
    border-radius:30px; padding:4px 16px;
    font-size:0.8rem; font-weight:700;
    text-transform:uppercase; letter-spacing:0.5px;
    margin-bottom:12px;
  }
  .s9-header-left h1 {
    font-family:'Nunito',sans-serif; font-size:2.6rem; font-weight:900;
    color:var(--dark); line-height:1.2; margin-bottom:8px;
  }
  .s9-header-left h1 span { color:var(--orange); }
  .s9-header-left p { color:var(--muted); font-size:0.97rem; }

  /* STATS ROW */
  .s9-stats-row {
    padding:0 80px 40px;
    display:flex; gap:20px; flex-wrap:wrap;
  }
  .s9-stat-chip {
    background:var(--white); border:1.5px solid #e8d5c4;
    border-radius:10px; padding:10px 20px;
    display:flex; align-items:center; gap:8px;
    font-size:0.85rem; color:var(--dark); font-weight:600;
  }
  .s9-stat-chip span { color:var(--muted); font-weight:400; font-size:0.8rem; }

  /* SUBJECTS GRID */
  .s9-grid-wrap { padding:0 80px 80px; }
  .s9-grid-label { font-size:0.8rem; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:20px; }
  .s9-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }

  .s9-card {
    background:var(--white); border-radius:18px; padding:28px 24px;
    border:2px solid transparent;
    transition:border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    cursor:pointer; display:flex; flex-direction:column; gap:16px;
    position:relative; overflow:hidden;
  }
  .s9-card::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
    background:var(--card-color); transform:scaleX(0); transition:transform 0.25s;
    transform-origin:left;
  }
  .s9-card:hover { border-color:var(--card-color); transform:translateY(-5px); box-shadow:0 14px 36px rgba(0,0,0,0.1); }
  .s9-card:hover::after { transform:scaleX(1); }

  .s9-card-top { display:flex; align-items:center; justify-content:space-between; }

  .s9-card-icon {
    width:54px; height:54px; border-radius:14px;
    display:flex; align-items:center; justify-content:center;
    background:var(--card-bg); color:var(--card-color);
    transition:transform 0.2s;
  }
  .s9-card:hover .s9-card-icon { transform:scale(1.1); }

  .s9-card-arrow {
    width:32px; height:32px; border-radius:50%;
    background:var(--bg); display:flex; align-items:center; justify-content:center;
    color:var(--muted); transition:background 0.2s, color 0.2s;
  }
  .s9-card:hover .s9-card-arrow { background:var(--card-color); color:white; }

  .s9-card-name { font-family:'Nunito',sans-serif; font-size:1.25rem; font-weight:900; color:var(--dark); }
  .s9-card-desc { font-size:0.83rem; color:var(--muted); line-height:1.5; }

  .s9-card-meta { display:flex; gap:16px; }
  .s9-meta-item { display:flex; align-items:center; gap:5px; font-size:0.78rem; color:var(--muted); }
  .s9-meta-dot { width:6px; height:6px; border-radius:50%; background:var(--card-color); }
  .s9-meta-val { font-weight:700; color:var(--dark); }

  /* RESPONSIVE */
  @media (max-width:1024px) {
    .s9-navbar,.s9-header,.s9-breadcrumb,.s9-stats-row,.s9-grid-wrap { padding-left:40px; padding-right:40px; }
    .s9-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:768px) {
    .s9-navbar { padding:0 20px; }
    .s9-header,.s9-breadcrumb,.s9-stats-row,.s9-grid-wrap { padding-left:20px; padding-right:20px; }
    .s9-header-left h1 { font-size:2rem; }
    .s9-grid { grid-template-columns:1fr; }
    .s9-stats-row { flex-direction:column; }
  }
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Class9Subjects() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = "class9subj-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = css;
      document.head.appendChild(tag);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  const totalChapters = subjects.reduce((a, s) => a + s.chapters, 0);
  const totalVideos   = subjects.reduce((a, s) => a + s.videos, 0);

  return (
    <div className="s9-wrap">

      {/* NAVBAR */}
      <nav className="s9-navbar">
        <button className="s9-logo-btn" onClick={() => navigate("/")}>
          <div className="s9-logo-icon"><GraduationCap size={22} color="white" /></div>
          <span className="s9-logo-text">
            <span className="lg">ILM </span><span className="lo">ORA</span>
          </span>
        </button>
      </nav>

      {/* BREADCRUMB */}
      <div className="s9-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={13} />
        <span onClick={() => navigate("/school-class")}>School Programs</span>
        <ChevronRight size={13} />
        <span className="active">Class 9th</span>
      </div>

      {/* HEADER */}
      <div className="s9-header">
        <div className="s9-header-left">
          <button className="s9-back-btn" onClick={() => navigate("/school-class")}>
            <ArrowLeft size={15} /> Back to Classes
          </button>
          <div className="s9-class-badge">
            <GraduationCap size={13} /> Class 9th · Foundation Building
          </div>
          <h1>Choose Your <span>Subject</span></h1>
          <p>Select a subject to start learning with videos, notes &amp; chapter-wise practice.</p>
        </div>
      </div>

      {/* STATS CHIPS */}
      <div className="s9-stats-row">
        <div className="s9-stat-chip">
          <span style={{ color: "#f47b20", fontWeight: 700, fontSize: "1rem" }}>{subjects.length}</span>
          <span>Subjects available</span>
        </div>
        <div className="s9-stat-chip">
          <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "1rem" }}>{totalChapters}+</span>
          <span>Total chapters</span>
        </div>
        <div className="s9-stat-chip">
          <span style={{ color: "#2563eb", fontWeight: 700, fontSize: "1rem" }}>{totalVideos}+</span>
          <span>Video lessons</span>
        </div>
      </div>

      {/* SUBJECTS GRID */}
      <div className="s9-grid-wrap">
        <p className="s9-grid-label">All Subjects</p>
        <div className="s9-grid">
          {subjects.map((sub) => (
            <div
              key={sub.name}
              className="s9-card"
              style={{ "--card-color": sub.color, "--card-bg": sub.bg }}
              onClick={() => navigate(sub.route)}
            >
              <div className="s9-card-top">
                <div className="s9-card-icon"><sub.Icon size={26} /></div>
                <div className="s9-card-arrow"><ChevronRight size={16} /></div>
              </div>
              <div>
                <div className="s9-card-name">{sub.name}</div>
                <div className="s9-card-desc">{sub.desc}</div>
              </div>
              <div className="s9-card-meta">
                <div className="s9-meta-item">
                  <div className="s9-meta-dot" />
                  <span className="s9-meta-val">{sub.chapters}</span> chapters
                </div>
                <div className="s9-meta-item">
                  <div className="s9-meta-dot" />
                  <span className="s9-meta-val">{sub.videos}</span> videos
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}