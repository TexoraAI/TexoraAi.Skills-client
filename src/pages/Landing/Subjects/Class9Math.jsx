// src/pages/Landing/Subjects/Class9Math.jsx
// Route: /school-class/9/math
// Flow: School Programs → Class 9 → Mathematics → [this page]

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, ChevronRight, Calculator, Play, FileText,
  Download, Lock, CheckCircle, Clock, ChevronDown, ChevronUp,
  BookOpen, Star, ArrowLeft, Video, Search,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const chapters = [
  {
    id: 1,
    title: "Number Systems",
    desc: "Real numbers, irrational numbers & number line",
    videos: [
      { id: "v1",  title: "Introduction to Real Numbers",        duration: "18:24", free: true,  watched: true  },
      { id: "v2",  title: "Rational vs Irrational Numbers",      duration: "22:10", free: true,  watched: true  },
      { id: "v3",  title: "Representing Numbers on Number Line", duration: "15:45", free: false, watched: false },
      { id: "v4",  title: "Operations on Real Numbers",          duration: "28:30", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 1 — Complete Notes PDF",  pages: 12, free: true  },
      { title: "Chapter 1 — MCQ Bank (50 Qs)",    pages: 8,  free: false },
    ],
  },
  {
    id: 2,
    title: "Polynomials",
    desc: "Degree, zeros, factor theorem & algebraic identities",
    videos: [
      { id: "v5",  title: "What is a Polynomial?",              duration: "14:20", free: true,  watched: false },
      { id: "v6",  title: "Zeroes of a Polynomial",            duration: "20:15", free: false, watched: false },
      { id: "v7",  title: "Remainder & Factor Theorem",        duration: "26:40", free: false, watched: false },
      { id: "v8",  title: "Algebraic Identities",              duration: "32:00", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 2 — Complete Notes PDF",  pages: 15, free: true  },
      { title: "Chapter 2 — Practice Worksheet",  pages: 6,  free: false },
    ],
  },
  {
    id: 3,
    title: "Coordinate Geometry",
    desc: "Cartesian plane, distance formula & section formula",
    videos: [
      { id: "v9",  title: "Cartesian Coordinate System",       duration: "16:30", free: true,  watched: false },
      { id: "v10", title: "Plotting Points on the Plane",      duration: "18:55", free: false, watched: false },
      { id: "v11", title: "Distance Between Two Points",       duration: "24:10", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 3 — Complete Notes PDF",  pages: 10, free: true  },
    ],
  },
  {
    id: 4,
    title: "Linear Equations in Two Variables",
    desc: "Graphical representation & solutions of linear equations",
    videos: [
      { id: "v12", title: "Introduction to Linear Equations",  duration: "20:00", free: true,  watched: false },
      { id: "v13", title: "Graphing a Linear Equation",        duration: "25:15", free: false, watched: false },
      { id: "v14", title: "Word Problems — Linear Equations",  duration: "30:20", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 4 — Complete Notes PDF",  pages: 14, free: false },
      { title: "Chapter 4 — Solved Examples",     pages: 9,  free: false },
    ],
  },
  {
    id: 5,
    title: "Introduction to Euclid's Geometry",
    desc: "Axioms, postulates & Euclid's theorems",
    videos: [
      { id: "v15", title: "Euclid's Definitions & Axioms",    duration: "17:40", free: true,  watched: false },
      { id: "v16", title: "Euclid's Postulates Explained",    duration: "22:55", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 5 — Summary Notes",        pages: 7, free: true  },
    ],
  },
  {
    id: 6,
    title: "Lines and Angles",
    desc: "Types of angles, parallel lines & transversals",
    videos: [
      { id: "v17", title: "Types of Angles",                  duration: "15:00", free: true,  watched: false },
      { id: "v18", title: "Parallel Lines & Transversal",     duration: "27:20", free: false, watched: false },
      { id: "v19", title: "Angle Sum Property of Triangle",   duration: "20:10", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 6 — Notes + Diagrams PDF", pages: 11, free: false },
    ],
  },
  {
    id: 7,
    title: "Triangles",
    desc: "Congruence, similarity & Pythagoras theorem",
    videos: [
      { id: "v20", title: "Congruence of Triangles",          duration: "24:30", free: true,  watched: false },
      { id: "v21", title: "SSS, SAS, ASA, RHS Rules",        duration: "32:00", free: false, watched: false },
      { id: "v22", title: "Inequalities in a Triangle",       duration: "18:45", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 7 — Complete Notes PDF",  pages: 16, free: false },
      { title: "Chapter 7 — MCQ Bank (40 Qs)",    pages: 7,  free: false },
    ],
  },
  {
    id: 8,
    title: "Statistics",
    desc: "Mean, median, mode & data representation",
    videos: [
      { id: "v23", title: "Collection & Organisation of Data", duration: "19:00", free: true,  watched: false },
      { id: "v24", title: "Mean, Median & Mode",              duration: "28:40", free: false, watched: false },
      { id: "v25", title: "Bar Graphs & Histograms",          duration: "22:15", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 8 — Notes + Examples PDF", pages: 13, free: true  },
    ],
  },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --green:#1a5c2a; --orange:#f47b20; --dark:#1a1f2e; --bg:#f5ede4;
    --white:#ffffff; --light-orange:#fff4ec; --text:#3a3a3a; --muted:#6b6b6b;
    --nav-border:#ede0d5; --math-accent:#f47b20;
  }

  .m9-wrap * { box-sizing:border-box; margin:0; padding:0; }
  .m9-wrap { font-family:'Poppins',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }

  /* NAVBAR */
  .m9-navbar {
    position:sticky; top:0; z-index:100; background:var(--white);
    border-bottom:1px solid var(--nav-border); padding:0 80px; height:64px;
    display:flex; align-items:center; justify-content:space-between;
    box-shadow:0 1px 8px rgba(0,0,0,0.06);
  }
  .m9-logo-btn { display:flex; align-items:center; gap:10px; background:transparent; border:none; cursor:pointer; padding:0; }
  .m9-logo-icon { width:40px; height:40px; background:#F97316; border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(249,115,22,0.35); }
  .m9-logo-text { font-family:'Nunito',sans-serif; font-size:1.6rem; font-weight:900; letter-spacing:-0.5px; }
  .m9-logo-text .lg { color:var(--green); }
  .m9-logo-text .lo { color:#F97316; }

  /* BREADCRUMB */
  .m9-breadcrumb { padding:20px 80px 0; display:flex; align-items:center; gap:6px; font-size:0.82rem; color:var(--muted); }
  .m9-breadcrumb span { cursor:pointer; transition:color 0.2s; }
  .m9-breadcrumb span:hover { color:var(--orange); }
  .m9-breadcrumb .active { color:var(--dark); font-weight:600; cursor:default; }
  .m9-breadcrumb svg { opacity:0.4; }

  /* SUBJECT HERO BANNER */
  .m9-hero {
    margin:24px 80px 0;
    background:linear-gradient(135deg,var(--dark) 60%,#2d3a52);
    border-radius:20px; padding:36px 44px;
    display:flex; align-items:center; justify-content:space-between; gap:24px;
    position:relative; overflow:hidden;
  }
  .m9-hero::before {
    content:''; position:absolute; right:-40px; top:-40px;
    width:220px; height:220px; border-radius:50%;
    background:rgba(244,123,32,0.12); pointer-events:none;
  }
  .m9-hero::after {
    content:''; position:absolute; right:60px; bottom:-60px;
    width:160px; height:160px; border-radius:50%;
    background:rgba(244,123,32,0.07); pointer-events:none;
  }
  .m9-back-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.2);
    border-radius:8px; padding:7px 14px; font-size:0.82rem; font-weight:600;
    color:white; cursor:pointer; margin-bottom:16px; transition:background 0.2s;
  }
  .m9-back-btn:hover { background:rgba(255,255,255,0.18); }
  .m9-hero-subject { font-size:0.78rem; font-weight:700; color:var(--orange); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .m9-hero h1 { font-family:'Nunito',sans-serif; font-size:2.2rem; font-weight:900; color:white; margin-bottom:8px; }
  .m9-hero p { font-size:0.9rem; color:rgba(255,255,255,0.6); margin-bottom:20px; }
  .m9-hero-stats { display:flex; gap:24px; flex-wrap:wrap; }
  .m9-hstat { text-align:center; }
  .m9-hstat-num { font-family:'Nunito',sans-serif; font-size:1.5rem; font-weight:900; color:var(--orange); }
  .m9-hstat-label { font-size:0.72rem; color:rgba(255,255,255,0.5); }
  .m9-hero-icon-wrap {
    width:100px; height:100px; border-radius:24px;
    background:rgba(244,123,32,0.2); border:2px solid rgba(244,123,32,0.3);
    display:flex; align-items:center; justify-content:center;
    color:var(--orange); flex-shrink:0; z-index:1;
  }

  /* TABS */
  .m9-tabs-row { padding:28px 80px 0; display:flex; gap:4px; }
  .m9-tab {
    padding:10px 22px; border-radius:8px 8px 0 0; border:none;
    font-family:'Poppins',sans-serif; font-size:0.9rem; font-weight:600;
    cursor:pointer; display:flex; align-items:center; gap:7px;
    transition:background 0.2s, color 0.2s;
    background:transparent; color:var(--muted);
  }
  .m9-tab.active { background:var(--white); color:var(--orange); box-shadow:0 -2px 0 var(--orange) inset; }
  .m9-tab:hover:not(.active) { background:var(--white); color:var(--dark); }

  /* CONTENT AREA */
  .m9-content { padding:0 80px 80px; }
  .m9-content-inner { background:var(--white); border-radius:0 16px 16px 16px; padding:32px; }

  /* SEARCH */
  .m9-search-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; gap:16px; }
  .m9-search {
    display:flex; align-items:center; gap:10px;
    background:var(--bg); border:1.5px solid #e8d5c4; border-radius:10px;
    padding:10px 16px; flex:1; max-width:360px;
  }
  .m9-search input { border:none; background:transparent; font-family:'Poppins',sans-serif; font-size:0.88rem; color:var(--text); outline:none; width:100%; }
  .m9-search input::placeholder { color:var(--muted); }
  .m9-progress-text { font-size:0.82rem; color:var(--muted); }
  .m9-progress-text strong { color:var(--orange); }

  /* CHAPTER ACCORDION */
  .m9-chapter { margin-bottom:16px; border:1.5px solid #ede0d5; border-radius:14px; overflow:hidden; transition:border-color 0.2s; }
  .m9-chapter.open { border-color:var(--orange); }

  .m9-chapter-header {
    padding:18px 22px; display:flex; align-items:center; gap:16px;
    cursor:pointer; background:var(--white); transition:background 0.2s;
    user-select:none;
  }
  .m9-chapter-header:hover { background:var(--light-orange); }
  .m9-chapter.open .m9-chapter-header { background:var(--light-orange); }

  .m9-ch-num {
    width:36px; height:36px; border-radius:10px;
    background:var(--light-orange); color:var(--orange);
    font-family:'Nunito',sans-serif; font-size:0.9rem; font-weight:900;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .m9-chapter.open .m9-ch-num { background:var(--orange); color:white; }

  .m9-ch-info { flex:1; }
  .m9-ch-title { font-weight:700; font-size:0.97rem; color:var(--dark); margin-bottom:2px; }
  .m9-ch-desc  { font-size:0.78rem; color:var(--muted); }

  .m9-ch-meta { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .m9-ch-badge { font-size:0.72rem; color:var(--muted); background:var(--bg); border-radius:6px; padding:3px 9px; display:flex; align-items:center; gap:4px; }
  .m9-ch-toggle { color:var(--muted); }

  /* CHAPTER BODY */
  .m9-chapter-body { padding:0 22px 22px; display:none; }
  .m9-chapter.open .m9-chapter-body { display:block; }

  .m9-body-tabs { display:flex; gap:8px; margin-bottom:18px; padding-top:18px; border-top:1px solid #ede0d5; }
  .m9-body-tab {
    font-size:0.8rem; font-weight:600; padding:6px 14px; border-radius:20px;
    border:1.5px solid #e8d5c4; background:transparent; cursor:pointer;
    color:var(--muted); display:flex; align-items:center; gap:5px;
    transition:background 0.2s, color 0.2s, border-color 0.2s;
  }
  .m9-body-tab.active { background:var(--orange); color:white; border-color:var(--orange); }

  /* VIDEO LIST */
  .m9-video-list { display:flex; flex-direction:column; gap:10px; }
  .m9-video-row {
    display:flex; align-items:center; gap:14px;
    padding:12px 14px; border-radius:10px; border:1.5px solid #ede0d5;
    cursor:pointer; transition:border-color 0.2s, background 0.2s;
    position:relative;
  }
  .m9-video-row:hover { border-color:var(--orange); background:var(--light-orange); }
  .m9-video-row.locked { opacity:0.65; cursor:default; }
  .m9-video-row.locked:hover { border-color:#ede0d5; background:transparent; }

  .m9-play-btn {
    width:38px; height:38px; border-radius:50%; flex-shrink:0;
    background:var(--orange); display:flex; align-items:center; justify-content:center;
    color:white; transition:transform 0.2s;
  }
  .m9-video-row:hover:not(.locked) .m9-play-btn { transform:scale(1.1); }
  .m9-play-btn.locked-btn { background:#e0d4cc; }

  .m9-video-info { flex:1; }
  .m9-video-title { font-size:0.88rem; font-weight:600; color:var(--dark); margin-bottom:2px; }
  .m9-video-dur   { font-size:0.75rem; color:var(--muted); display:flex; align-items:center; gap:4px; }

  .m9-free-badge { background:#dcfce7; color:#16a34a; font-size:0.68rem; font-weight:700; padding:2px 8px; border-radius:10px; }
  .m9-lock-badge { background:#f3f4f6; color:var(--muted); font-size:0.68rem; font-weight:600; padding:2px 8px; border-radius:10px; display:flex; align-items:center; gap:3px; }
  .m9-watched    { color:#16a34a; }

  /* NOTES LIST */
  .m9-notes-list { display:flex; flex-direction:column; gap:10px; }
  .m9-note-row {
    display:flex; align-items:center; gap:14px; padding:12px 14px;
    border-radius:10px; border:1.5px solid #ede0d5;
    cursor:pointer; transition:border-color 0.2s, background 0.2s;
  }
  .m9-note-row:hover { border-color:var(--orange); background:var(--light-orange); }
  .m9-note-row.locked { opacity:0.65; cursor:default; }
  .m9-note-row.locked:hover { border-color:#ede0d5; background:transparent; }
  .m9-note-icon { width:38px; height:38px; border-radius:10px; background:var(--light-orange); display:flex; align-items:center; justify-content:center; color:var(--orange); flex-shrink:0; }
  .m9-note-icon.locked-icon { background:#f3f4f6; color:var(--muted); }
  .m9-note-info { flex:1; }
  .m9-note-title { font-size:0.88rem; font-weight:600; color:var(--dark); margin-bottom:2px; }
  .m9-note-pages { font-size:0.75rem; color:var(--muted); }
  .m9-dl-btn { display:flex; align-items:center; gap:4px; font-size:0.78rem; font-weight:600; color:var(--orange); background:var(--light-orange); border:none; border-radius:8px; padding:6px 12px; cursor:pointer; white-space:nowrap; }
  .m9-dl-btn:hover { background:var(--orange); color:white; }

  /* RESPONSIVE */
  @media (max-width:1024px) {
    .m9-navbar,.m9-breadcrumb,.m9-tabs-row,.m9-content { padding-left:40px; padding-right:40px; }
    .m9-hero { margin:24px 40px 0; }
  }
  @media (max-width:768px) {
    .m9-navbar { padding:0 20px; }
    .m9-hero { margin:16px 20px 0; padding:24px; flex-direction:column; }
    .m9-hero-icon-wrap { display:none; }
    .m9-breadcrumb,.m9-tabs-row,.m9-content { padding-left:20px; padding-right:20px; }
    .m9-hero h1 { font-size:1.8rem; }
    .m9-search-row { flex-direction:column; align-items:flex-start; }
    .m9-search { max-width:100%; width:100%; }
  }
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Class9Math() {
  const navigate = useNavigate();
  const [openChapter, setOpenChapter] = useState(1);
  const [activeTab, setActiveTab]     = useState("chapters"); // "chapters" | "notes"
  const [bodyTab, setBodyTab]         = useState({});         // chapter id → "videos" | "notes"
  const [search, setSearch]           = useState("");

  useEffect(() => {
    const id = "class9math-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = css;
      document.head.appendChild(tag);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  const getBodyTab = (chId) => bodyTab[chId] || "videos";
  const setChBodyTab = (chId, tab) => setBodyTab((p) => ({ ...p, [chId]: tab }));

  const totalVideos   = chapters.reduce((a, c) => a + c.videos.length, 0);
  const watchedVideos = chapters.reduce((a, c) => a + c.videos.filter((v) => v.watched).length, 0);
  const totalNotes    = chapters.reduce((a, c) => a + c.notes.length, 0);

  const filtered = chapters.filter((c) =>
    search ? c.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  // Flatten all notes for the "All Notes" tab
  const allNotes = chapters.flatMap((c) =>
    c.notes.map((n) => ({ ...n, chapter: c.title }))
  );

  return (
    <div className="m9-wrap">

      {/* NAVBAR */}
      <nav className="m9-navbar">
        <button className="m9-logo-btn" onClick={() => navigate("/")}>
          <div className="m9-logo-icon"><GraduationCap size={22} color="white" /></div>
          <span className="m9-logo-text">
            <span className="lg">ILM </span><span className="lo">ORA</span>
          </span>
        </button>
      </nav>

      {/* BREADCRUMB */}
      <div className="m9-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={13} />
        <span onClick={() => navigate("/school-class")}>School Programs</span>
        <ChevronRight size={13} />
        <span onClick={() => navigate("/school-class/9")}>Class 9th</span>
        <ChevronRight size={13} />
        <span className="active">Mathematics</span>
      </div>

      {/* SUBJECT HERO BANNER */}
      <div className="m9-hero">
        <div>
          <button className="m9-back-btn" onClick={() => navigate("/school-class/9")}>
            <ArrowLeft size={14} /> Back to Subjects
          </button>
          <div className="m9-hero-subject">Class 9th · Mathematics</div>
          <h1>Mathematics</h1>
          <p>Algebra, Geometry, Statistics &amp; more — chapter by chapter.</p>
          <div className="m9-hero-stats">
            <div className="m9-hstat">
              <div className="m9-hstat-num">{chapters.length}</div>
              <div className="m9-hstat-label">Chapters</div>
            </div>
            <div className="m9-hstat">
              <div className="m9-hstat-num">{totalVideos}</div>
              <div className="m9-hstat-label">Videos</div>
            </div>
            <div className="m9-hstat">
              <div className="m9-hstat-num">{totalNotes}</div>
              <div className="m9-hstat-label">Notes PDFs</div>
            </div>
            <div className="m9-hstat">
              <div className="m9-hstat-num">{watchedVideos}/{totalVideos}</div>
              <div className="m9-hstat-label">Watched</div>
            </div>
          </div>
        </div>
        <div className="m9-hero-icon-wrap">
          <Calculator size={48} />
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="m9-tabs-row">
        <button
          className={`m9-tab${activeTab === "chapters" ? " active" : ""}`}
          onClick={() => setActiveTab("chapters")}
        >
          <BookOpen size={15} /> Chapters &amp; Videos
        </button>
        <button
          className={`m9-tab${activeTab === "notes" ? " active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <FileText size={15} /> All Notes
        </button>
      </div>

      {/* CONTENT */}
      <div className="m9-content">
        <div className="m9-content-inner">

          {/* ── CHAPTERS TAB ── */}
          {activeTab === "chapters" && (
            <>
              {/* Search + progress */}
              <div className="m9-search-row">
                <div className="m9-search">
                  <Search size={15} color="#9ca3af" />
                  <input
                    placeholder="Search chapters…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <p className="m9-progress-text">
                  Progress: <strong>{watchedVideos}</strong> / {totalVideos} videos watched
                </p>
              </div>

              {/* Accordion */}
              {filtered.map((ch) => (
                <div
                  key={ch.id}
                  className={`m9-chapter${openChapter === ch.id ? " open" : ""}`}
                >
                  {/* Header */}
                  <div
                    className="m9-chapter-header"
                    onClick={() => setOpenChapter(openChapter === ch.id ? null : ch.id)}
                  >
                    <div className="m9-ch-num">{ch.id}</div>
                    <div className="m9-ch-info">
                      <div className="m9-ch-title">{ch.title}</div>
                      <div className="m9-ch-desc">{ch.desc}</div>
                    </div>
                    <div className="m9-ch-meta">
                      <div className="m9-ch-badge"><Video size={11} /> {ch.videos.length} videos</div>
                      <div className="m9-ch-badge"><FileText size={11} /> {ch.notes.length} notes</div>
                      <div className="m9-ch-toggle">
                        {openChapter === ch.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="m9-chapter-body">
                    {/* Sub-tabs: Videos / Notes */}
                    <div className="m9-body-tabs">
                      <button
                        className={`m9-body-tab${getBodyTab(ch.id) === "videos" ? " active" : ""}`}
                        onClick={() => setChBodyTab(ch.id, "videos")}
                      >
                        <Play size={12} /> Videos ({ch.videos.length})
                      </button>
                      <button
                        className={`m9-body-tab${getBodyTab(ch.id) === "notes" ? " active" : ""}`}
                        onClick={() => setChBodyTab(ch.id, "notes")}
                      >
                        <FileText size={12} /> Notes ({ch.notes.length})
                      </button>
                    </div>

                    {/* VIDEOS */}
                    {getBodyTab(ch.id) === "videos" && (
                      <div className="m9-video-list">
                        {ch.videos.map((v) => (
                          <div
                            key={v.id}
                            className={`m9-video-row${!v.free ? " locked" : ""}`}
                          >
                            <div className={`m9-play-btn${!v.free ? " locked-btn" : ""}`}>
                              {v.free ? <Play size={14} fill="white" /> : <Lock size={14} />}
                            </div>
                            <div className="m9-video-info">
                              <div className="m9-video-title">{v.title}</div>
                              <div className="m9-video-dur">
                                <Clock size={11} /> {v.duration}
                              </div>
                            </div>
                            {v.watched && <CheckCircle size={18} className="m9-watched" color="#16a34a" />}
                            {v.free
                              ? <span className="m9-free-badge">FREE</span>
                              : <span className="m9-lock-badge"><Lock size={10} /> Premium</span>
                            }
                          </div>
                        ))}
                      </div>
                    )}

                    {/* NOTES */}
                    {getBodyTab(ch.id) === "notes" && (
                      <div className="m9-notes-list">
                        {ch.notes.map((n, i) => (
                          <div key={i} className={`m9-note-row${!n.free ? " locked" : ""}`}>
                            <div className={`m9-note-icon${!n.free ? " locked-icon" : ""}`}>
                              {n.free ? <FileText size={18} /> : <Lock size={18} />}
                            </div>
                            <div className="m9-note-info">
                              <div className="m9-note-title">{n.title}</div>
                              <div className="m9-note-pages">{n.pages} pages</div>
                            </div>
                            {n.free
                              ? <button className="m9-dl-btn"><Download size={13} /> Download</button>
                              : <span className="m9-lock-badge"><Lock size={10} /> Premium</span>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── ALL NOTES TAB ── */}
          {activeTab === "notes" && (
            <div className="m9-notes-list">
              {allNotes.map((n, i) => (
                <div key={i} className={`m9-note-row${!n.free ? " locked" : ""}`}>
                  <div className={`m9-note-icon${!n.free ? " locked-icon" : ""}`}>
                    {n.free ? <FileText size={18} /> : <Lock size={18} />}
                  </div>
                  <div className="m9-note-info">
                    <div className="m9-note-title">{n.title}</div>
                    <div className="m9-note-pages">{n.chapter} · {n.pages} pages</div>
                  </div>
                  {n.free
                    ? <button className="m9-dl-btn"><Download size={13} /> Download</button>
                    : <span className="m9-lock-badge"><Lock size={10} /> Premium</span>
                  }
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}