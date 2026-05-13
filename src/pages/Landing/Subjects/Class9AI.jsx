// src/pages/Landing/Subjects/Class9AI.jsx
// Route: /school-class/9/ai
// Flow: School Programs → Class 9 → Artificial Intelligence → [this page]

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, ChevronRight, Brain, Play, FileText,
  Download, Lock, CheckCircle, Clock, ChevronDown, ChevronUp,
  BookOpen, ArrowLeft, Video, Search,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const chapters = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    desc: "What is AI, history, types & real-world applications",
    videos: [
      { id: "v1",  title: "What is Artificial Intelligence?",         duration: "16:10", free: true,  watched: true  },
      { id: "v2",  title: "History & Evolution of AI",                duration: "20:30", free: true,  watched: true  },
      { id: "v3",  title: "Types of AI: Narrow, General & Super AI",  duration: "18:45", free: false, watched: false },
      { id: "v4",  title: "Real-World Applications of AI",            duration: "22:00", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 1 — Complete Notes PDF",   pages: 10, free: true  },
      { title: "Chapter 1 — MCQ Bank (40 Qs)",     pages: 7,  free: false },
    ],
  },
  {
    id: 2,
    title: "AI vs Human Intelligence",
    desc: "Comparing human cognition with machine intelligence",
    videos: [
      { id: "v5",  title: "How Humans Think vs How Machines Think",   duration: "19:20", free: true,  watched: false },
      { id: "v6",  title: "Strengths & Limitations of AI",            duration: "17:40", free: false, watched: false },
      { id: "v7",  title: "Turing Test & Intelligence Benchmarks",    duration: "21:15", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 2 — Complete Notes PDF",   pages: 9,  free: true  },
      { title: "Chapter 2 — Worksheet",            pages: 5,  free: false },
    ],
  },
  {
    id: 3,
    title: "Data & Its Role in AI",
    desc: "Types of data, data collection, cleaning & importance",
    videos: [
      { id: "v8",  title: "What is Data? Structured vs Unstructured", duration: "15:30", free: true,  watched: false },
      { id: "v9",  title: "Data Collection Methods",                  duration: "18:00", free: false, watched: false },
      { id: "v10", title: "Data Cleaning & Preprocessing Basics",     duration: "24:10", free: false, watched: false },
      { id: "v11", title: "Why Data is the Fuel of AI",               duration: "16:55", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 3 — Complete Notes PDF",   pages: 11, free: true  },
      { title: "Chapter 3 — Solved Examples",      pages: 6,  free: false },
    ],
  },
  {
    id: 4,
    title: "Machine Learning Basics",
    desc: "Supervised, unsupervised & reinforcement learning concepts",
    videos: [
      { id: "v12", title: "What is Machine Learning?",                duration: "20:00", free: true,  watched: false },
      { id: "v13", title: "Supervised Learning — Explained Simply",   duration: "25:30", free: false, watched: false },
      { id: "v14", title: "Unsupervised Learning & Clustering",       duration: "22:45", free: false, watched: false },
      { id: "v15", title: "Reinforcement Learning — How Machines Learn", duration: "28:10", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 4 — Complete Notes PDF",   pages: 14, free: false },
      { title: "Chapter 4 — MCQ Bank (50 Qs)",     pages: 9,  free: false },
    ],
  },
  {
    id: 5,
    title: "Introduction to Python for AI",
    desc: "Python basics, variables, loops & functions for AI",
    videos: [
      { id: "v16", title: "Why Python for AI?",                       duration: "12:00", free: true,  watched: false },
      { id: "v17", title: "Python Basics — Variables & Data Types",   duration: "24:40", free: false, watched: false },
      { id: "v18", title: "Loops & Conditions in Python",             duration: "26:20", free: false, watched: false },
      { id: "v19", title: "Functions & Libraries in Python",          duration: "30:00", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 5 — Python Quick Reference PDF", pages: 12, free: true  },
      { title: "Chapter 5 — Practice Problems",          pages: 8,  free: false },
    ],
  },
  {
    id: 6,
    title: "Neural Networks & Deep Learning",
    desc: "Neurons, layers, activation functions & how deep learning works",
    videos: [
      { id: "v20", title: "What is a Neural Network?",                duration: "18:30", free: true,  watched: false },
      { id: "v21", title: "Layers: Input, Hidden & Output",           duration: "22:10", free: false, watched: false },
      { id: "v22", title: "Activation Functions — Simple Explanation", duration: "20:00", free: false, watched: false },
      { id: "v23", title: "Introduction to Deep Learning",            duration: "27:50", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 6 — Notes + Diagrams PDF", pages: 13, free: false },
      { title: "Chapter 6 — Worksheet",            pages: 6,  free: false },
    ],
  },
  {
    id: 7,
    title: "Natural Language Processing (NLP)",
    desc: "How AI understands and generates human language",
    videos: [
      { id: "v24", title: "What is NLP?",                             duration: "16:00", free: true,  watched: false },
      { id: "v25", title: "Tokenization, Stemming & Lemmatization",   duration: "23:30", free: false, watched: false },
      { id: "v26", title: "Chatbots & Voice Assistants Explained",    duration: "25:15", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 7 — Complete Notes PDF",  pages: 10, free: true  },
      { title: "Chapter 7 — MCQ Bank (35 Qs)",    pages: 7,  free: false },
    ],
  },
  {
    id: 8,
    title: "Computer Vision",
    desc: "How AI sees and interprets images and videos",
    videos: [
      { id: "v27", title: "What is Computer Vision?",                 duration: "15:45", free: true,  watched: false },
      { id: "v28", title: "How AI Recognizes Faces & Objects",        duration: "24:00", free: false, watched: false },
      { id: "v29", title: "Applications: Self-Driving Cars & More",   duration: "20:30", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 8 — Notes + Examples PDF", pages: 11, free: true  },
    ],
  },
  {
    id: 9,
    title: "AI Ethics & Responsible AI",
    desc: "Bias, fairness, privacy, deepfakes & ethical AI design",
    videos: [
      { id: "v30", title: "What is AI Ethics?",                       duration: "14:20", free: true,  watched: false },
      { id: "v31", title: "Bias in AI — Real Examples",               duration: "19:10", free: false, watched: false },
      { id: "v32", title: "Privacy, Surveillance & AI",               duration: "22:00", free: false, watched: false },
      { id: "v33", title: "Deepfakes & Misinformation",               duration: "18:40", free: false, watched: false },
    ],
    notes: [
      { title: "Chapter 9 — Complete Notes PDF",   pages: 10, free: true  },
      { title: "Chapter 9 — Case Studies PDF",     pages: 8,  free: false },
    ],
  },
  {
    id: 10,
    title: "AI Project — Build Your First AI App",
    desc: "Hands-on mini project: train a simple classifier using Python",
    videos: [
      { id: "v34", title: "Project Overview & Setup",                  duration: "12:00", free: true,  watched: false },
      { id: "v35", title: "Loading & Exploring the Dataset",           duration: "20:15", free: false, watched: false },
      { id: "v36", title: "Training a Simple Model with sklearn",      duration: "30:00", free: false, watched: false },
      { id: "v37", title: "Testing, Evaluating & Presenting Results",  duration: "25:30", free: false, watched: false },
    ],
    notes: [
      { title: "Project — Step-by-Step Guide PDF",  pages: 15, free: false },
      { title: "Project — Starter Code & Dataset",  pages: 4,  free: false },
    ],
  },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --green:#1a5c2a; --orange:#f47b20; --dark:#1a1f2e; --bg:#f5ede4;
    --white:#ffffff; --light-orange:#fff4ec; --text:#3a3a3a; --muted:#6b6b6b;
    --nav-border:#ede0d5; --ai-accent:#7c3aed;
    --ai-light:#f3eeff; --ai-dark:#4c1d95;
  }

  .ai9-wrap * { box-sizing:border-box; margin:0; padding:0; }
  .ai9-wrap { font-family:'Poppins',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }

  /* NAVBAR */
  .ai9-navbar {
    position:sticky; top:0; z-index:100; background:var(--white);
    border-bottom:1px solid var(--nav-border); padding:0 80px; height:64px;
    display:flex; align-items:center; justify-content:space-between;
    box-shadow:0 1px 8px rgba(0,0,0,0.06);
  }
  .ai9-logo-btn { display:flex; align-items:center; gap:10px; background:transparent; border:none; cursor:pointer; padding:0; }
  .ai9-logo-icon { width:40px; height:40px; background:#F97316; border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(249,115,22,0.35); }
  .ai9-logo-text { font-family:'Nunito',sans-serif; font-size:1.6rem; font-weight:900; letter-spacing:-0.5px; }
  .ai9-logo-text .lg { color:var(--green); }
  .ai9-logo-text .lo { color:#F97316; }

  /* BREADCRUMB */
  .ai9-breadcrumb { padding:20px 80px 0; display:flex; align-items:center; gap:6px; font-size:0.82rem; color:var(--muted); }
  .ai9-breadcrumb span { cursor:pointer; transition:color 0.2s; }
  .ai9-breadcrumb span:hover { color:var(--orange); }
  .ai9-breadcrumb .active { color:var(--dark); font-weight:600; cursor:default; }
  .ai9-breadcrumb svg { opacity:0.4; }

  /* SUBJECT HERO BANNER */
  .ai9-hero {
    margin:24px 80px 0;
    background:linear-gradient(135deg,#1e1040 60%,#2d1b69);
    border-radius:20px; padding:36px 44px;
    display:flex; align-items:center; justify-content:space-between; gap:24px;
    position:relative; overflow:hidden;
  }
  .ai9-hero::before {
    content:''; position:absolute; right:-40px; top:-40px;
    width:220px; height:220px; border-radius:50%;
    background:rgba(124,58,237,0.18); pointer-events:none;
  }
  .ai9-hero::after {
    content:''; position:absolute; right:60px; bottom:-60px;
    width:160px; height:160px; border-radius:50%;
    background:rgba(124,58,237,0.10); pointer-events:none;
  }
  .ai9-back-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.2);
    border-radius:8px; padding:7px 14px; font-size:0.82rem; font-weight:600;
    color:white; cursor:pointer; margin-bottom:16px; transition:background 0.2s;
  }
  .ai9-back-btn:hover { background:rgba(255,255,255,0.18); }
  .ai9-hero-subject { font-size:0.78rem; font-weight:700; color:#a78bfa; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .ai9-hero h1 { font-family:'Nunito',sans-serif; font-size:2.2rem; font-weight:900; color:white; margin-bottom:8px; }
  .ai9-hero p { font-size:0.9rem; color:rgba(255,255,255,0.6); margin-bottom:20px; }
  .ai9-hero-stats { display:flex; gap:24px; flex-wrap:wrap; }
  .ai9-hstat { text-align:center; }
  .ai9-hstat-num { font-family:'Nunito',sans-serif; font-size:1.5rem; font-weight:900; color:#a78bfa; }
  .ai9-hstat-label { font-size:0.72rem; color:rgba(255,255,255,0.5); }
  .ai9-hero-icon-wrap {
    width:100px; height:100px; border-radius:24px;
    background:rgba(124,58,237,0.25); border:2px solid rgba(124,58,237,0.4);
    display:flex; align-items:center; justify-content:center;
    color:#a78bfa; flex-shrink:0; z-index:1;
  }

  /* TABS */
  .ai9-tabs-row { padding:28px 80px 0; display:flex; gap:4px; }
  .ai9-tab {
    padding:10px 22px; border-radius:8px 8px 0 0; border:none;
    font-family:'Poppins',sans-serif; font-size:0.9rem; font-weight:600;
    cursor:pointer; display:flex; align-items:center; gap:7px;
    transition:background 0.2s, color 0.2s;
    background:transparent; color:var(--muted);
  }
  .ai9-tab.active { background:var(--white); color:var(--ai-accent); box-shadow:0 -2px 0 var(--ai-accent) inset; }
  .ai9-tab:hover:not(.active) { background:var(--white); color:var(--dark); }

  /* CONTENT AREA */
  .ai9-content { padding:0 80px 80px; }
  .ai9-content-inner { background:var(--white); border-radius:0 16px 16px 16px; padding:32px; }

  /* SEARCH */
  .ai9-search-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; gap:16px; }
  .ai9-search {
    display:flex; align-items:center; gap:10px;
    background:var(--bg); border:1.5px solid #e8d5c4; border-radius:10px;
    padding:10px 16px; flex:1; max-width:360px;
  }
  .ai9-search input { border:none; background:transparent; font-family:'Poppins',sans-serif; font-size:0.88rem; color:var(--text); outline:none; width:100%; }
  .ai9-search input::placeholder { color:var(--muted); }
  .ai9-progress-text { font-size:0.82rem; color:var(--muted); }
  .ai9-progress-text strong { color:var(--ai-accent); }

  /* CHAPTER ACCORDION */
  .ai9-chapter { margin-bottom:16px; border:1.5px solid #ede0d5; border-radius:14px; overflow:hidden; transition:border-color 0.2s; }
  .ai9-chapter.open { border-color:var(--ai-accent); }

  .ai9-chapter-header {
    padding:18px 22px; display:flex; align-items:center; gap:16px;
    cursor:pointer; background:var(--white); transition:background 0.2s;
    user-select:none;
  }
  .ai9-chapter-header:hover { background:var(--ai-light); }
  .ai9-chapter.open .ai9-chapter-header { background:var(--ai-light); }

  .ai9-ch-num {
    width:36px; height:36px; border-radius:10px;
    background:var(--ai-light); color:var(--ai-accent);
    font-family:'Nunito',sans-serif; font-size:0.9rem; font-weight:900;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .ai9-chapter.open .ai9-ch-num { background:var(--ai-accent); color:white; }

  .ai9-ch-info { flex:1; }
  .ai9-ch-title { font-weight:700; font-size:0.97rem; color:var(--dark); margin-bottom:2px; }
  .ai9-ch-desc  { font-size:0.78rem; color:var(--muted); }

  .ai9-ch-meta { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .ai9-ch-badge { font-size:0.72rem; color:var(--muted); background:var(--bg); border-radius:6px; padding:3px 9px; display:flex; align-items:center; gap:4px; }
  .ai9-ch-toggle { color:var(--muted); }

  /* CHAPTER BODY */
  .ai9-chapter-body { padding:0 22px 22px; display:none; }
  .ai9-chapter.open .ai9-chapter-body { display:block; }

  .ai9-body-tabs { display:flex; gap:8px; margin-bottom:18px; padding-top:18px; border-top:1px solid #ede0d5; }
  .ai9-body-tab {
    font-size:0.8rem; font-weight:600; padding:6px 14px; border-radius:20px;
    border:1.5px solid #e8d5c4; background:transparent; cursor:pointer;
    color:var(--muted); display:flex; align-items:center; gap:5px;
    transition:background 0.2s, color 0.2s, border-color 0.2s;
  }
  .ai9-body-tab.active { background:var(--ai-accent); color:white; border-color:var(--ai-accent); }

  /* VIDEO LIST */
  .ai9-video-list { display:flex; flex-direction:column; gap:10px; }
  .ai9-video-row {
    display:flex; align-items:center; gap:14px;
    padding:12px 14px; border-radius:10px; border:1.5px solid #ede0d5;
    cursor:pointer; transition:border-color 0.2s, background 0.2s;
    position:relative;
  }
  .ai9-video-row:hover { border-color:var(--ai-accent); background:var(--ai-light); }
  .ai9-video-row.locked { opacity:0.65; cursor:default; }
  .ai9-video-row.locked:hover { border-color:#ede0d5; background:transparent; }

  .ai9-play-btn {
    width:38px; height:38px; border-radius:50%; flex-shrink:0;
    background:var(--ai-accent); display:flex; align-items:center; justify-content:center;
    color:white; transition:transform 0.2s;
  }
  .ai9-video-row:hover:not(.locked) .ai9-play-btn { transform:scale(1.1); }
  .ai9-play-btn.locked-btn { background:#e0d4cc; }

  .ai9-video-info { flex:1; }
  .ai9-video-title { font-size:0.88rem; font-weight:600; color:var(--dark); margin-bottom:2px; }
  .ai9-video-dur   { font-size:0.75rem; color:var(--muted); display:flex; align-items:center; gap:4px; }

  .ai9-free-badge { background:#dcfce7; color:#16a34a; font-size:0.68rem; font-weight:700; padding:2px 8px; border-radius:10px; }
  .ai9-lock-badge { background:#f3f4f6; color:var(--muted); font-size:0.68rem; font-weight:600; padding:2px 8px; border-radius:10px; display:flex; align-items:center; gap:3px; }
  .ai9-watched    { color:#16a34a; }

  /* NOTES LIST */
  .ai9-notes-list { display:flex; flex-direction:column; gap:10px; }
  .ai9-note-row {
    display:flex; align-items:center; gap:14px; padding:12px 14px;
    border-radius:10px; border:1.5px solid #ede0d5;
    cursor:pointer; transition:border-color 0.2s, background 0.2s;
  }
  .ai9-note-row:hover { border-color:var(--ai-accent); background:var(--ai-light); }
  .ai9-note-row.locked { opacity:0.65; cursor:default; }
  .ai9-note-row.locked:hover { border-color:#ede0d5; background:transparent; }
  .ai9-note-icon { width:38px; height:38px; border-radius:10px; background:var(--ai-light); display:flex; align-items:center; justify-content:center; color:var(--ai-accent); flex-shrink:0; }
  .ai9-note-icon.locked-icon { background:#f3f4f6; color:var(--muted); }
  .ai9-note-info { flex:1; }
  .ai9-note-title { font-size:0.88rem; font-weight:600; color:var(--dark); margin-bottom:2px; }
  .ai9-note-pages { font-size:0.75rem; color:var(--muted); }
  .ai9-dl-btn { display:flex; align-items:center; gap:4px; font-size:0.78rem; font-weight:600; color:var(--ai-accent); background:var(--ai-light); border:none; border-radius:8px; padding:6px 12px; cursor:pointer; white-space:nowrap; }
  .ai9-dl-btn:hover { background:var(--ai-accent); color:white; }

  /* RESPONSIVE */
  @media (max-width:1024px) {
    .ai9-navbar,.ai9-breadcrumb,.ai9-tabs-row,.ai9-content { padding-left:40px; padding-right:40px; }
    .ai9-hero { margin:24px 40px 0; }
  }
  @media (max-width:768px) {
    .ai9-navbar { padding:0 20px; }
    .ai9-hero { margin:16px 20px 0; padding:24px; flex-direction:column; }
    .ai9-hero-icon-wrap { display:none; }
    .ai9-breadcrumb,.ai9-tabs-row,.ai9-content { padding-left:20px; padding-right:20px; }
    .ai9-hero h1 { font-size:1.8rem; }
    .ai9-search-row { flex-direction:column; align-items:flex-start; }
    .ai9-search { max-width:100%; width:100%; }
  }
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Class9AI() {
  const navigate = useNavigate();
  const [openChapter, setOpenChapter] = useState(1);
  const [activeTab, setActiveTab]     = useState("chapters"); // "chapters" | "notes"
  const [bodyTab, setBodyTab]         = useState({});         // chapter id → "videos" | "notes"
  const [search, setSearch]           = useState("");

  useEffect(() => {
    const id = "class9ai-styles";
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

  const allNotes = chapters.flatMap((c) =>
    c.notes.map((n) => ({ ...n, chapter: c.title }))
  );

  return (
    <div className="ai9-wrap">

      {/* NAVBAR */}
      <nav className="ai9-navbar">
        <button className="ai9-logo-btn" onClick={() => navigate("/")}>
          <div className="ai9-logo-icon"><GraduationCap size={22} color="white" /></div>
          <span className="ai9-logo-text">
            <span className="lg">ILM </span><span className="lo">ORA</span>
          </span>
        </button>
      </nav>

      {/* BREADCRUMB */}
      <div className="ai9-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={13} />
        <span onClick={() => navigate("/school-class")}>School Programs</span>
        <ChevronRight size={13} />
        <span onClick={() => navigate("/school-class/9")}>Class 9th</span>
        <ChevronRight size={13} />
        <span className="active">Artificial Intelligence</span>
      </div>

      {/* SUBJECT HERO BANNER */}
      <div className="ai9-hero">
        <div>
          <button className="ai9-back-btn" onClick={() => navigate("/school-class/9")}>
            <ArrowLeft size={14} /> Back to Subjects
          </button>
          <div className="ai9-hero-subject">Class 9th · Artificial Intelligence</div>
          <h1>Artificial Intelligence</h1>
          <p>AI Basics, Python, Machine Learning &amp; Hands-on Projects — chapter by chapter.</p>
          <div className="ai9-hero-stats">
            <div className="ai9-hstat">
              <div className="ai9-hstat-num">{chapters.length}</div>
              <div className="ai9-hstat-label">Chapters</div>
            </div>
            <div className="ai9-hstat">
              <div className="ai9-hstat-num">{totalVideos}</div>
              <div className="ai9-hstat-label">Videos</div>
            </div>
            <div className="ai9-hstat">
              <div className="ai9-hstat-num">{totalNotes}</div>
              <div className="ai9-hstat-label">Notes PDFs</div>
            </div>
            <div className="ai9-hstat">
              <div className="ai9-hstat-num">{watchedVideos}/{totalVideos}</div>
              <div className="ai9-hstat-label">Watched</div>
            </div>
          </div>
        </div>
        <div className="ai9-hero-icon-wrap">
          <Brain size={48} />
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="ai9-tabs-row">
        <button
          className={`ai9-tab${activeTab === "chapters" ? " active" : ""}`}
          onClick={() => setActiveTab("chapters")}
        >
          <BookOpen size={15} /> Chapters &amp; Videos
        </button>
        <button
          className={`ai9-tab${activeTab === "notes" ? " active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <FileText size={15} /> All Notes
        </button>
      </div>

      {/* CONTENT */}
      <div className="ai9-content">
        <div className="ai9-content-inner">

          {/* ── CHAPTERS TAB ── */}
          {activeTab === "chapters" && (
            <>
              {/* Search + progress */}
              <div className="ai9-search-row">
                <div className="ai9-search">
                  <Search size={15} color="#9ca3af" />
                  <input
                    placeholder="Search chapters…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <p className="ai9-progress-text">
                  Progress: <strong>{watchedVideos}</strong> / {totalVideos} videos watched
                </p>
              </div>

              {/* Accordion */}
              {filtered.map((ch) => (
                <div
                  key={ch.id}
                  className={`ai9-chapter${openChapter === ch.id ? " open" : ""}`}
                >
                  {/* Header */}
                  <div
                    className="ai9-chapter-header"
                    onClick={() => setOpenChapter(openChapter === ch.id ? null : ch.id)}
                  >
                    <div className="ai9-ch-num">{ch.id}</div>
                    <div className="ai9-ch-info">
                      <div className="ai9-ch-title">{ch.title}</div>
                      <div className="ai9-ch-desc">{ch.desc}</div>
                    </div>
                    <div className="ai9-ch-meta">
                      <div className="ai9-ch-badge"><Video size={11} /> {ch.videos.length} videos</div>
                      <div className="ai9-ch-badge"><FileText size={11} /> {ch.notes.length} notes</div>
                      <div className="ai9-ch-toggle">
                        {openChapter === ch.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="ai9-chapter-body">
                    {/* Sub-tabs: Videos / Notes */}
                    <div className="ai9-body-tabs">
                      <button
                        className={`ai9-body-tab${getBodyTab(ch.id) === "videos" ? " active" : ""}`}
                        onClick={() => setChBodyTab(ch.id, "videos")}
                      >
                        <Play size={12} /> Videos ({ch.videos.length})
                      </button>
                      <button
                        className={`ai9-body-tab${getBodyTab(ch.id) === "notes" ? " active" : ""}`}
                        onClick={() => setChBodyTab(ch.id, "notes")}
                      >
                        <FileText size={12} /> Notes ({ch.notes.length})
                      </button>
                    </div>

                    {/* VIDEOS */}
                    {getBodyTab(ch.id) === "videos" && (
                      <div className="ai9-video-list">
                        {ch.videos.map((v) => (
                          <div
                            key={v.id}
                            className={`ai9-video-row${!v.free ? " locked" : ""}`}
                          >
                            <div className={`ai9-play-btn${!v.free ? " locked-btn" : ""}`}>
                              {v.free ? <Play size={14} fill="white" /> : <Lock size={14} />}
                            </div>
                            <div className="ai9-video-info">
                              <div className="ai9-video-title">{v.title}</div>
                              <div className="ai9-video-dur">
                                <Clock size={11} /> {v.duration}
                              </div>
                            </div>
                            {v.watched && <CheckCircle size={18} className="ai9-watched" color="#16a34a" />}
                            {v.free
                              ? <span className="ai9-free-badge">FREE</span>
                              : <span className="ai9-lock-badge"><Lock size={10} /> Premium</span>
                            }
                          </div>
                        ))}
                      </div>
                    )}

                    {/* NOTES */}
                    {getBodyTab(ch.id) === "notes" && (
                      <div className="ai9-notes-list">
                        {ch.notes.map((n, i) => (
                          <div key={i} className={`ai9-note-row${!n.free ? " locked" : ""}`}>
                            <div className={`ai9-note-icon${!n.free ? " locked-icon" : ""}`}>
                              {n.free ? <FileText size={18} /> : <Lock size={18} />}
                            </div>
                            <div className="ai9-note-info">
                              <div className="ai9-note-title">{n.title}</div>
                              <div className="ai9-note-pages">{n.pages} pages</div>
                            </div>
                            {n.free
                              ? <button className="ai9-dl-btn"><Download size={13} /> Download</button>
                              : <span className="ai9-lock-badge"><Lock size={10} /> Premium</span>
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
            <div className="ai9-notes-list">
              {allNotes.map((n, i) => (
                <div key={i} className={`ai9-note-row${!n.free ? " locked" : ""}`}>
                  <div className={`ai9-note-icon${!n.free ? " locked-icon" : ""}`}>
                    {n.free ? <FileText size={18} /> : <Lock size={18} />}
                  </div>
                  <div className="ai9-note-info">
                    <div className="ai9-note-title">{n.title}</div>
                    <div className="ai9-note-pages">{n.chapter} · {n.pages} pages</div>
                  </div>
                  {n.free
                    ? <button className="ai9-dl-btn"><Download size={13} /> Download</button>
                    : <span className="ai9-lock-badge"><Lock size={10} /> Premium</span>
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