// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Video,
//   FileText,
//   Bot,
//   BarChart2,
//   Users,
//   Gift,
//   FlaskConical,
//   Calculator,
//   BookOpen,
//   Cpu,
//   Trophy,
//   Target,
//   Microscope,
//   GraduationCap,
//   Moon,
//   Sun,
// } from "lucide-react";

// // ─── DATA ─────────────────────────────────────────────────────────────────────

// const stats = [
//   { num: "5K+", label: "Students" },
//   { num: "95%", label: "Pass Rate" },
//   { num: "50+", label: "Video Lessons" },
// ];

// const competitiveExams = [
//   {
//     Icon: Microscope,
//     code: "NEET",
//     label: "Medical Entrance Exam",
//     subjects: ["Physics", "Chemistry", "Biology", "Botany", "Zoology"],
//     route: "/competitive/neet",
//     color: "#16a34a",
//     lightColor: "#f0fdf4",
//     tag: "Medical",
//   },
//   {
//     Icon: Calculator,
//     code: "JEE",
//     label: "Engineering Entrance Exam",
//     subjects: ["Physics", "Chemistry", "Mathematics", "Algebra", "Calculus"],
//     route: "/competitive/jee",
//     color: "#2563eb",
//     lightColor: "#eff6ff",
//     tag: "Engineering",
//   },
// ];

// const classes = [
//   {
//     Icon: BookOpen,
//     num: "9",
//     suffix: "th",
//     label: "Foundation Building",
//     subjects: ["Mathematics", "Science", "English", "Social Studies", "Urdu"],
//     route: "/school-class/9",
//   },
//   {
//     Icon: Target,
//     num: "10",
//     suffix: "th",
//     label: "Matric Preparation",
//     subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
//     route: "/school-class/10",
//   },
//   {
//     Icon: FlaskConical,
//     num: "11",
//     suffix: "th",
//     label: "Intermediate Year 1",
//     subjects: ["Physics", "Chemistry", "Bio / CS", "Mathematics", "English"],
//     route: "/school-class/11",
//   },
//   {
//     Icon: Trophy,
//     num: "12",
//     suffix: "th",
//     label: "Intermediate Year 2",
//     subjects: ["Physics", "Chemistry", "Bio / CS", "Mathematics", "English"],
//     route: "/school-class/12",
//   },
// ];

// const features = [
//   {
//     Icon: Video,
//     title: "HD Video Lectures",
//     text: "Watch crystal-clear video lessons recorded by top subject experts, available 24/7 at your convenience.",
//   },
//   {
//     Icon: FileText,
//     title: "Past Paper Practice",
//     text: "Access 10+ years of board exam past papers with complete solutions and marking schemes.",
//   },
//   {
//     Icon: Bot,
//     title: "AI-Powered Doubt Solving",
//     text: "Get instant answers to your doubts 24/7 with our intelligent AI tutor powered by advanced technology.",
//   },
//   {
//     Icon: BarChart2,
//     title: "Progress Tracking",
//     text: "Monitor your performance with detailed analytics, weekly reports, and personalized improvement plans.",
//   },
//   {
//     Icon: Users,
//     title: "Live Mentorship Sessions",
//     text: "Weekly live sessions with experienced teachers to clarify concepts and prepare you for exams.",
//   },
//   {
//     Icon: Gift,
//     title: "Free Study Material",
//     text: "Download free notes, MCQ banks, and study guides curated by subject specialists.",
//   },
// ];

// const mentors = [
//   {
//     Icon: Calculator,
//     subject: "Physics & Mathematics",
//     name: "Sir Ahmed Raza",
//     exp: "15 years experience · 4,200+ students",
//   },
//   {
//     Icon: Microscope,
//     subject: "Chemistry & Biology",
//     name: "Ma'am Sana Iqbal",
//     exp: "12 years experience · 3,800+ students",
//   },
//   {
//     Icon: Cpu,
//     subject: "Computer Science",
//     name: "Sir Bilal Hassan",
//     exp: "8 years experience · 2,500+ students",
//   },
// ];

// // ─── CSS ──────────────────────────────────────────────────────────────────────

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --green: #1a5c2a;
//     --orange: #f47b20;
//     --dark: #1a1f2e;
//     --bg: #f5ede4;
//     --white: #ffffff;
//     --light-orange: #fff4ec;
//     --text: #3a3a3a;
//     --muted: #6b6b6b;

//     --nav-bg: #ffffff;
//     --nav-border: #ede0d5;
//     --nav-text: #3a3a3a;
//     --nav-muted: #6b6b6b;
//     --toggle-bg: #f0e6dd;
//     --toggle-hover: #e8d5c4;
//   }

//   .sc-wrap.dark-mode {
//     --bg: #111827;
//     --white: #1f2937;
//     --dark: #f9fafb;
//     --text: #e5e7eb;
//     --muted: #9ca3af;
//     --light-orange: #2a1f14;

//     --nav-bg: #1f2937;
//     --nav-border: #374151;
//     --nav-text: #e5e7eb;
//     --nav-muted: #9ca3af;
//     --toggle-bg: #374151;
//     --toggle-hover: #4b5563;
//   }

//   .sc-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

//   .sc-wrap {
//     font-family: 'Poppins', sans-serif;
//     background: var(--bg);
//     color: var(--text);
//     transition: background 0.3s, color 0.3s;
//   }

//   /* ── NAVBAR ── */
//   .sc-navbar {
//     position: sticky;
//     top: 0;
//     z-index: 100;
//     background: var(--nav-bg);
//     border-bottom: 1px solid var(--nav-border);
//     padding: 0 80px;
//     height: 64px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     box-shadow: 0 1px 8px rgba(0,0,0,0.06);
//     transition: background 0.3s, border-color 0.3s;
//   }

//   .sc-nav-left { display: flex; align-items: center; }
//   .sc-nav-right { display: flex; align-items: center; gap: 12px; }

//   .sc-dark-toggle {
//     width: 40px;
//     height: 40px;
//     border-radius: 50%;
//     border: none;
//     background: var(--toggle-bg);
//     color: var(--nav-text);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: background 0.2s, transform 0.2s;
//     flex-shrink: 0;
//   }
//   .sc-dark-toggle:hover { background: var(--toggle-hover); transform: rotate(15deg); }

//   /* ── LOGO ── */
//   .sc-logo-btn {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     background: transparent;
//     border: none;
//     cursor: pointer;
//     padding: 0;
//     text-decoration: none;
//   }

//   .sc-logo-icon {
//     width: 40px;
//     height: 40px;
//     background: #F97316;
//     border-radius: 10px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     box-shadow: 0 4px 12px rgba(249,115,22,0.35);
//     flex-shrink: 0;
//   }

//   .sc-logo-text {
//     font-family: 'Nunito', sans-serif;
//     font-size: 1.6rem;
//     font-weight: 900;
//     letter-spacing: -0.5px;
//     line-height: 1;
//   }
//   .sc-logo-text .l-green  { color: var(--green); }
//   .sc-logo-text .l-orange { color: #F97316; }

//   /* ── HERO ── */
//   .sc-hero {
//     background: var(--bg);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 80px 80px 64px;
//     min-height: 520px;
//     gap: 40px;
//     transition: background 0.3s;
//   }

//   .sc-hero-left { flex: 1; max-width: 540px; }

//   .sc-hero-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 8px;
//     background: var(--white);
//     border: 1.5px solid #e8d5c4;
//     border-radius: 30px;
//     padding: 6px 16px;
//     font-size: 0.82rem;
//     font-weight: 600;
//     color: var(--orange);
//     margin-bottom: 28px;
//     transition: background 0.3s, border-color 0.3s;
//   }

//   .sc-hero-left h1 {
//     font-family: 'Nunito', sans-serif;
//     font-size: 3.2rem;
//     font-weight: 900;
//     line-height: 1.15;
//     color: var(--dark);
//     margin-bottom: 20px;
//   }
//   .sc-hero-left h1 .highlight { color: var(--orange); }

//   .sc-hero-left p {
//     font-size: 1rem;
//     color: var(--muted);
//     line-height: 1.7;
//     margin-bottom: 36px;
//     max-width: 420px;
//   }

//   .sc-hero-cta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

//   .sc-btn-start {
//     background: var(--dark);
//     color: var(--white);
//     border: none;
//     padding: 14px 28px;
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 1rem;
//     font-weight: 700;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     transition: transform 0.2s, box-shadow 0.2s;
//   }
//   .sc-btn-start:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,31,46,0.25); }

//   .sc-btn-explore {
//     background: transparent;
//     color: var(--dark);
//     border: 2px solid var(--dark);
//     padding: 12px 24px;
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.95rem;
//     font-weight: 600;
//     cursor: pointer;
//     transition: background 0.2s, color 0.2s;
//   }
//   .sc-btn-explore:hover { background: var(--dark); color: var(--white); }

//   .sc-hero-right { flex: 1; max-width: 500px; position: relative; }

//   .sc-hero-img-wrapper {
//     border-radius: 16px;
//     overflow: hidden;
//     box-shadow: 0 20px 60px rgba(0,0,0,0.12);
//     height: 380px;
//   }
//   .sc-hero-img-wrapper img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     object-position: center top;
//     display: block;
//   }

//   .sc-hero-stats {
//     position: absolute;
//     bottom: -20px;
//     left: -20px;
//     background: var(--white);
//     border-radius: 12px;
//     padding: 12px 20px;
//     box-shadow: 0 8px 30px rgba(0,0,0,0.1);
//     display: flex;
//     gap: 20px;
//     transition: background 0.3s;
//   }

//   .sc-stat { text-align: center; }
//   .sc-stat-num { font-size: 1.4rem; font-weight: 800; color: var(--dark); font-family: 'Nunito', sans-serif; }
//   .sc-stat-label { font-size: 0.72rem; color: var(--muted); }

//   /* ── SECTION COMMON ── */
//   .sc-section { padding: 72px 80px; }
//   .sc-section-alt { background: var(--white); transition: background 0.3s; }

//   .sc-section-tag {
//     display: inline-block;
//     background: var(--light-orange);
//     color: var(--orange);
//     font-size: 0.8rem;
//     font-weight: 700;
//     padding: 4px 14px;
//     border-radius: 20px;
//     letter-spacing: 0.5px;
//     text-transform: uppercase;
//     margin-bottom: 14px;
//     transition: background 0.3s;
//   }

//   .sc-section-title {
//     font-family: 'Nunito', sans-serif;
//     font-size: 2.2rem;
//     font-weight: 900;
//     color: var(--dark);
//     margin-bottom: 10px;
//   }
//   .sc-section-title span { color: var(--orange); }

//   .sc-section-sub {
//     color: var(--muted);
//     font-size: 0.97rem;
//     margin-bottom: 48px;
//     max-width: 520px;
//   }

//   /* ── COMPETITIVE EXAMS — COMPACT HORIZONTAL CARDS ── */
//   .sc-comp-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 20px;
//   }

//   .sc-comp-card {
//     background: var(--bg);
//     border-radius: 16px;
//     padding: 22px 22px 20px;
//     border: 2px solid transparent;
//     display: flex;
//     align-items: flex-start;
//     gap: 18px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//     transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.3s;
//   }
//   .sc-comp-card::after {
//     content: '';
//     position: absolute;
//     top: 0; left: 0; right: 0;
//     height: 3px;
//     background: var(--comp-color);
//     transform: scaleX(0);
//     transform-origin: left;
//     transition: transform 0.28s ease;
//   }
//   .sc-comp-card:hover {
//     border-color: var(--comp-color);
//     transform: translateY(-4px);
//     box-shadow: 0 12px 32px rgba(0,0,0,0.09);
//   }
//   .sc-comp-card:hover::after { transform: scaleX(1); }

//   .sc-comp-icon {
//     width: 50px;
//     height: 50px;
//     border-radius: 13px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     flex-shrink: 0;
//     margin-top: 2px;
//   }

//   .sc-comp-body { flex: 1; min-width: 0; }

//   .sc-comp-header {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     margin-bottom: 2px;
//   }

//   .sc-comp-code {
//     font-family: 'Nunito', sans-serif;
//     font-size: 1.65rem;
//     font-weight: 900;
//     line-height: 1;
//   }

//   .sc-comp-tag {
//     font-size: 0.65rem;
//     font-weight: 700;
//     padding: 2px 9px;
//     border-radius: 20px;
//     letter-spacing: 0.3px;
//     text-transform: uppercase;
//     font-family: 'Poppins', sans-serif;
//   }

//   .sc-comp-label {
//     font-size: 0.78rem;
//     color: var(--muted);
//     margin-bottom: 10px;
//     font-family: 'Poppins', sans-serif;
//   }

//   .sc-comp-subjects {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 5px;
//     margin-bottom: 14px;
//   }

//   .sc-comp-pill {
//     font-size: 0.66rem;
//     padding: 2px 9px;
//     border-radius: 10px;
//     font-weight: 600;
//     font-family: 'Poppins', sans-serif;
//   }

//   .sc-comp-cta {
//     border: none;
//     padding: 8px 16px;
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.78rem;
//     font-weight: 700;
//     cursor: pointer;
//     color: white;
//     transition: opacity 0.2s, transform 0.15s;
//     letter-spacing: 0.2px;
//     display: inline-block;
//   }
//   .sc-comp-cta:hover { opacity: 0.85; transform: translateY(-1px); }

//   /* ── CLASS CARDS ── */
//   .sc-class-grid {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 24px;
//   }

//   .sc-class-card {
//     background: var(--white);
//     border-radius: 16px;
//     padding: 32px 24px;
//     text-align: center;
//     border: 2px solid transparent;
//     transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.3s;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//   }
//   .sc-class-card::before {
//     content: '';
//     position: absolute;
//     top: 0; left: 0; right: 0;
//     height: 4px;
//     background: var(--orange);
//     transform: scaleX(0);
//     transition: transform 0.25s;
//   }
//   .sc-class-card:hover { border-color: var(--orange); transform: translateY(-6px); box-shadow: 0 16px 40px rgba(244,123,32,0.15); }
//   .sc-class-card:hover::before { transform: scaleX(1); }

//   .sc-class-icon {
//     width: 64px;
//     height: 64px;
//     background: var(--light-orange);
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin: 0 auto 18px;
//     color: var(--orange);
//     transition: background 0.3s;
//   }

//   .sc-class-num { font-family: 'Nunito', sans-serif; font-size: 2rem; font-weight: 900; color: var(--dark); }
//   .sc-class-num span { color: var(--orange); }
//   .sc-class-label { font-size: 0.85rem; color: var(--muted); margin-bottom: 18px; }

//   .sc-subjects { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px; }

//   .sc-pill {
//     background: var(--bg);
//     color: var(--text);
//     font-size: 0.72rem;
//     padding: 3px 10px;
//     border-radius: 12px;
//     font-weight: 500;
//     font-family: 'Poppins', sans-serif;
//     transition: background 0.3s, color 0.3s;
//   }

//   .sc-class-cta {
//     background: var(--dark);
//     color: var(--white);
//     border: none;
//     padding: 10px 22px;
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.85rem;
//     font-weight: 600;
//     cursor: pointer;
//     width: 100%;
//     transition: background 0.2s;
//   }
//   .sc-class-cta:hover { background: var(--orange); }

//   /* ── FEATURES ── */
//   .sc-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

//   .sc-feature-card { background: var(--bg); border-radius: 14px; padding: 28px; transition: background 0.3s; }

//   .sc-feature-icon {
//     width: 48px;
//     height: 48px;
//     background: var(--light-orange);
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: var(--orange);
//     margin-bottom: 14px;
//     transition: background 0.3s;
//   }

//   .sc-feature-title { font-weight: 700; font-size: 1.05rem; color: var(--dark); margin-bottom: 8px; font-family: 'Poppins', sans-serif; }
//   .sc-feature-text { font-size: 0.88rem; color: var(--muted); line-height: 1.6; }

//   /* ── MENTORS ── */
//   .sc-mentor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

//   .sc-mentor-card {
//     background: var(--white);
//     border-radius: 16px;
//     padding: 28px;
//     display: flex;
//     align-items: center;
//     gap: 18px;
//     border: 1.5px solid #ede0d5;
//     transition: box-shadow 0.2s, background 0.3s, border-color 0.3s;
//   }
//   .sc-mentor-card:hover { box-shadow: 0 8px 28px rgba(244,123,32,0.12); }

//   .sc-mentor-avatar {
//     width: 64px;
//     height: 64px;
//     border-radius: 50%;
//     background: linear-gradient(135deg, var(--orange), #ff9a4a);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     flex-shrink: 0;
//   }

//   .sc-mentor-name { font-weight: 700; font-size: 1rem; color: var(--dark); font-family: 'Poppins', sans-serif; }
//   .sc-mentor-sub  { font-size: 0.8rem; color: var(--orange); font-weight: 600; margin-bottom: 4px; font-family: 'Poppins', sans-serif; }
//   .sc-mentor-exp  { font-size: 0.78rem; color: var(--muted); font-family: 'Poppins', sans-serif; }

//   /* ── CTA BANNER ── */
//   .sc-cta-banner {
//     background: var(--dark);
//     margin: 0 80px 72px;
//     border-radius: 20px;
//     padding: 56px 64px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 32px;
//     transition: background 0.3s;
//   }

//   .sc-cta-banner h2 {
//     font-family: 'Nunito', sans-serif;
//     font-size: 2rem;
//     font-weight: 900;
//     color: var(--white);
//     max-width: 420px;
//     line-height: 1.3;
//   }
//   .sc-cta-banner h2 span { color: var(--orange); }
//   .sc-cta-banner p { color: rgba(255,255,255,0.6); margin-top: 10px; font-size: 0.95rem; }

//   .sc-btn-cta-white {
//     background: var(--white);
//     color: var(--dark);
//     border: none;
//     padding: 14px 32px;
//     border-radius: 10px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 1rem;
//     font-weight: 700;
//     cursor: pointer;
//     white-space: nowrap;
//     transition: background 0.2s, color 0.2s;
//   }
//   .sc-btn-cta-white:hover { background: var(--orange); color: var(--white); }

//   /* ── FOOTER ── */
//   .sc-footer {
//     background: var(--white);
//     border-top: 1px solid #ede0d5;
//     padding: 24px 80px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     font-size: 0.85rem;
//     color: var(--muted);
//     font-family: 'Poppins', sans-serif;
//     transition: background 0.3s, border-color 0.3s;
//   }

//   /* ── RESPONSIVE — TABLET 1024px ── */
//   @media (max-width: 1024px) {
//     .sc-navbar { padding: 0 40px; }
//     .sc-hero { padding: 80px 40px 48px; }
//     .sc-section { padding: 56px 40px; }
//     .sc-class-grid { grid-template-columns: repeat(2, 1fr); }
//     .sc-features-grid, .sc-mentor-grid { grid-template-columns: repeat(2, 1fr); }
//     .sc-comp-row { grid-template-columns: 1fr 1fr; gap: 16px; }
//     .sc-cta-banner { margin: 0 40px 56px; padding: 40px; flex-direction: column; text-align: center; }
//     .sc-footer { padding: 20px 40px; }
//   }

//   /* ── RESPONSIVE — MOBILE 768px ── */
//   @media (max-width: 768px) {
//     .sc-navbar { padding: 0 20px; }
//     .sc-hero { flex-direction: column; padding: 80px 20px 48px; }
//     .sc-hero-left h1 { font-size: 2.2rem; }
//     .sc-hero-right { max-width: 100%; width: 100%; }
//     .sc-hero-stats { left: 0; right: 0; bottom: -20px; justify-content: center; }
//     .sc-section { padding: 48px 20px; }
//     .sc-class-grid { grid-template-columns: 1fr 1fr; }
//     .sc-features-grid, .sc-mentor-grid { grid-template-columns: 1fr; }
//     .sc-comp-row { grid-template-columns: 1fr; gap: 14px; }
//     .sc-cta-banner { margin: 0 20px 48px; padding: 32px 24px; }
//     .sc-footer { padding: 16px 20px; flex-direction: column; gap: 8px; text-align: center; }
//   }

//   /* ── RESPONSIVE — SMALL PHONE 480px ── */
//   @media (max-width: 480px) {
//     .sc-hero-left h1 { font-size: 1.9rem; }
//     .sc-class-grid { grid-template-columns: 1fr; }
//     .sc-comp-card { flex-direction: column; gap: 12px; }
//     .sc-comp-icon { width: 44px; height: 44px; }
//   }
// `;

// // ─── COMPONENT ────────────────────────────────────────────────────────────────

// import schoolImg from "../../assets/school.jpeg";

// export default function Schoolclass() {
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const styleId = "schoolclass-styles";
//     if (!document.getElementById(styleId)) {
//       const tag = document.createElement("style");
//       tag.id = styleId;
//       tag.textContent = css;
//       document.head.appendChild(tag);
//     }
//     return () => {
//       const tag = document.getElementById(styleId);
//       if (tag) tag.remove();
//     };
//   }, []);

//   const scrollToClasses = (e) => {
//     e.preventDefault();
//     document.getElementById("classes")?.scrollIntoView({ behavior: "smooth" });
//   };

//   const goHome = () => navigate("/");

//   return (
//     <div className={`sc-wrap${darkMode ? " dark-mode" : ""}`}>

//       {/* ── NAVBAR ── */}
//       <nav className="sc-navbar">
//         <div className="sc-nav-left">
//           <button className="sc-logo-btn" onClick={goHome}>
//             <div className="sc-logo-icon">
//               <GraduationCap size={22} color="white" />
//             </div>
//             <span className="sc-logo-text">
//               <span className="l-green">ILM </span>
//               <span className="l-orange">ORA</span>
//             </span>
//           </button>
//         </div>
//         <div className="sc-nav-right">
//           <button
//             className="sc-dark-toggle"
//             onClick={() => setDarkMode((prev) => !prev)}
//             aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//           >
//             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//           </button>
//         </div>
//       </nav>

//       {/* ── HERO ── */}
//       <section className="sc-hero">
//         <div className="sc-hero-left">
//           <div className="sc-hero-badge">
//             <BookOpen size={14} />
//             Advanced Learning Platform for School Students
//           </div>
//           <h1>
//             Become the <span className="highlight">Top 1%</span>
//             <br />
//             in Your Class
//           </h1>
//           <p>
//             Learn Science, Math, English &amp; more from Pakistan's top educators.
//             Designed for Class 9th, 10th, 11th &amp; 12th students.
//           </p>
//           <div className="sc-hero-cta">
//             <button className="sc-btn-start" onClick={scrollToClasses}>
//               Start Learning →
//             </button>
//             <button className="sc-btn-explore" onClick={scrollToClasses}>
//               Explore Courses
//             </button>
//           </div>
//         </div>

//         <div className="sc-hero-right">
//           <div className="sc-hero-img-wrapper">
//             <img src={schoolImg} alt="Student" />
//           </div>
//           <div className="sc-hero-stats">
//             {stats.map((s) => (
//               <div className="sc-stat" key={s.label}>
//                 <div className="sc-stat-num">{s.num}</div>
//                 <div className="sc-stat-label">{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── COMPETITIVE EXAMS — right after hero ── */}
//       <section className="sc-section sc-section-alt">
//         <div className="sc-section-tag">Competitive Exams</div>
//         <h2 className="sc-section-title">
//           Crack <span>NEET &amp; JEE</span>
//         </h2>
//         <p className="sc-section-sub">
//           Targeted preparation for top medical and engineering entrance exams —
//           curated by experts with proven results.
//         </p>

//         <div className="sc-comp-row">
//           {competitiveExams.map((exam) => (
//             <div
//               className="sc-comp-card"
//               key={exam.code}
//               style={{ "--comp-color": exam.color }}
//             >
//               <div
//                 className="sc-comp-icon"
//                 style={{ background: exam.color }}
//               >
//                 <exam.Icon size={22} />
//               </div>

//               <div className="sc-comp-body">
//                 <div className="sc-comp-header">
//                   <span className="sc-comp-code" style={{ color: exam.color }}>
//                     {exam.code}
//                   </span>
//                   <span
//                     className="sc-comp-tag"
//                     style={{ background: exam.lightColor, color: exam.color }}
//                   >
//                     {exam.tag}
//                   </span>
//                 </div>

//                 <div className="sc-comp-label">{exam.label}</div>

//                 <div className="sc-comp-subjects">
//                   {exam.subjects.map((sub) => (
//                     <span
//                       className="sc-comp-pill"
//                       key={sub}
//                       style={{ background: exam.lightColor, color: exam.color }}
//                     >
//                       {sub}
//                     </span>
//                   ))}
//                 </div>

//                 <button
//                   className="sc-comp-cta"
//                   style={{ background: exam.color }}
//                   onClick={() => navigate(exam.route)}
//                 >
//                   Explore {exam.code} Prep →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── CLASS CARDS — School Program ── */}
//       <section className="sc-section" id="classes">
//         <div className="sc-section-tag">School Program</div>
//         <h2 className="sc-section-title">
//           Pick Your <span>Class</span>
//         </h2>
//         <p className="sc-section-sub">
//           Comprehensive curriculum designed for CBSE &amp; Punjab boards — learn
//           at your own pace.
//         </p>

//         <div className="sc-class-grid">
//           {classes.map((cls) => (
//             <div className="sc-class-card" key={cls.num}>
//               <div className="sc-class-icon">
//                 <cls.Icon size={28} />
//               </div>
//               <div className="sc-class-num">
//                 <span>{cls.num}</span>
//                 {cls.suffix}
//               </div>
//               <div className="sc-class-label">{cls.label}</div>
//               <div className="sc-subjects">
//                 {cls.subjects.map((sub) => (
//                   <span className="sc-pill" key={sub}>{sub}</span>
//                 ))}
//               </div>
//               <button className="sc-class-cta" onClick={() => navigate(cls.route)}>
//                 Explore Class {cls.num}
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── WHY ILM ORA ── */}
//       <section className="sc-section sc-section-alt">
//         <div className="sc-section-tag">Why Choose Us</div>
//         <h2 className="sc-section-title">
//           Learn Smarter, <span>Score Higher</span>
//         </h2>
//         <p className="sc-section-sub">
//           Everything you need to ace your exams and build a strong academic
//           foundation.
//         </p>

//         <div className="sc-features-grid">
//           {features.map((f) => (
//             <div className="sc-feature-card" key={f.title}>
//               <div className="sc-feature-icon">
//                 <f.Icon size={22} />
//               </div>
//               <div className="sc-feature-title">{f.title}</div>
//               <div className="sc-feature-text">{f.text}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── MENTORS ── */}
//       <section className="sc-section">
//         <div className="sc-section-tag">Our Educators</div>
//         <h2 className="sc-section-title">
//           Learn from the <span>Best</span>
//         </h2>
//         <p className="sc-section-sub">
//           Our school faculty brings decades of teaching experience from top
//           institutions.
//         </p>

//         <div className="sc-mentor-grid">
//           {mentors.map((m) => (
//             <div className="sc-mentor-card" key={m.name}>
//               <div className="sc-mentor-avatar">
//                 <m.Icon size={26} />
//               </div>
//               <div>
//                 <div className="sc-mentor-sub">{m.subject}</div>
//                 <div className="sc-mentor-name">{m.name}</div>
//                 <div className="sc-mentor-exp">{m.exp}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── CTA BANNER ── */}
//       <div className="sc-cta-banner">
//         <div>
//           <h2>
//             Ready to <span>Transform</span> Your Results?
//           </h2>
//           <p>
//             Join 10,000+ students already achieving their academic goals with
//             ILM ORA.
//           </p>
//         </div>
//         <button className="sc-btn-cta-white" onClick={goHome}>
//           Start for Free →
//         </button>
//       </div>

//       {/* ── FOOTER ── */}
//       <footer className="sc-footer">
//         <button className="sc-logo-btn" onClick={goHome}>
//           <div className="sc-logo-icon">
//             <GraduationCap size={22} color="white" />
//           </div>
//           <span className="sc-logo-text">
//             <span className="l-green">ILM </span>
//             <span className="l-orange">ORA</span>
//           </span>
//         </button>

//         <p>© 2024 ILM ORA · Advanced Learning Platform for Modern Professionals</p>
//         <p>Courses · Mentors · Free Services</p>
//       </footer>

//     </div>
//   );
// } old working but board missing 





















































// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Video,
//   FileText,
//   Bot,
//   BarChart2,
//   Users,
//   Gift,
//   FlaskConical,
//   Calculator,
//   BookOpen,
//   Cpu,
//   Trophy,
//   Target,
//   Microscope,
//   GraduationCap,
//   Moon,
//   Sun,
//   ArrowLeft,
//   ChevronRight,
// } from "lucide-react";

// // ─── EXISTING DATA ────────────────────────────────────────────────────────────

// const stats = [
//   { num: "5K+", label: "Students" },
//   { num: "95%", label: "Pass Rate" },
//   { num: "50+", label: "Video Lessons" },
// ];

// const competitiveExams = [
//   {
//     Icon: Microscope,
//     code: "NEET",
//     label: "Medical Entrance Exam",
//     subjects: ["Physics", "Chemistry", "Biology", "Botany", "Zoology"],
//     route: "/competitive/neet",
//     color: "#16a34a",
//     lightColor: "#f0fdf4",
//     tag: "Medical",
//   },
//   {
//     Icon: Calculator,
//     code: "JEE",
//     label: "Engineering Entrance Exam",
//     subjects: ["Physics", "Chemistry", "Mathematics", "Algebra", "Calculus"],
//     route: "/competitive/jee",
//     color: "#2563eb",
//     lightColor: "#eff6ff",
//     tag: "Engineering",
//   },
// ];

// const features = [
//   {
//     Icon: Video,
//     title: "HD Video Lectures",
//     text: "Watch crystal-clear video lessons recorded by top subject experts, available 24/7 at your convenience.",
//   },
//   {
//     Icon: FileText,
//     title: "Past Paper Practice",
//     text: "Access 10+ years of board exam past papers with complete solutions and marking schemes.",
//   },
//   {
//     Icon: Bot,
//     title: "AI-Powered Doubt Solving",
//     text: "Get instant answers to your doubts 24/7 with our intelligent AI tutor powered by advanced technology.",
//   },
//   {
//     Icon: BarChart2,
//     title: "Progress Tracking",
//     text: "Monitor your performance with detailed analytics, weekly reports, and personalized improvement plans.",
//   },
//   {
//     Icon: Users,
//     title: "Live Mentorship Sessions",
//     text: "Weekly live sessions with experienced teachers to clarify concepts and prepare you for exams.",
//   },
//   {
//     Icon: Gift,
//     title: "Free Study Material",
//     text: "Download free notes, MCQ banks, and study guides curated by subject specialists.",
//   },
// ];

// const mentors = [
//   {
//     Icon: Calculator,
//     subject: "Physics & Mathematics",
//     name: "Sir Ahmed Raza",
//     exp: "15 years experience · 4,200+ students",
//   },
//   {
//     Icon: Microscope,
//     subject: "Chemistry & Biology",
//     name: "Ma'am Sana Iqbal",
//     exp: "12 years experience · 3,800+ students",
//   },
//   {
//     Icon: Cpu,
//     subject: "Computer Science",
//     name: "Sir Bilal Hassan",
//     exp: "8 years experience · 2,500+ students",
//   },
// ];

// // ─── BOARD PORTAL DATA ────────────────────────────────────────────────────────

// const BOARDS = [
//   { id: "cbse",    name: "CBSE",        fullName: "Central Board of Secondary Education",       color: "#f97316", accent: "#fff7ed", emoji: "🏛️", tagline: "National Level • All India Recognition" },
//   { id: "bihar",   name: "Bihar Board", fullName: "Bihar School Examination Board",             color: "#2d7d2d", accent: "#f0fdf4", emoji: "📚", tagline: "State Level • BSEB Certified" },
//   { id: "upboard", name: "UP Board",    fullName: "Uttar Pradesh Madhyamik Shiksha Parishad",   color: "#1a2744", accent: "#eef1f8", emoji: "🎓", tagline: "State Level • UPMSP Certified" },
//   { id: "icse",    name: "ICSE",        fullName: "Indian Certificate of Secondary Education",  color: "#c2410c", accent: "#fff1ec", emoji: "🌟", tagline: "National Level • CISCE Board" },
// ];

// const CBSE_CLASSES = [
//   {
//     id: 9, label: "Class 9", tagline: "Foundation of Excellence",
//     description: "Class 9 is the foundation year for your board examinations. This year introduces you to advanced concepts in Science, Mathematics, Social Science, and languages. Strong performance here sets the stage for Class 10 boards.",
//     highlights: ["Introduction to Advanced Science", "Algebra & Geometry Deep Dive", "History & Civics", "English Literature"],
//     subjects: [
//       { name: "Mathematics", icon: "📐",
//         chapters: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations", "Triangles", "Heron's Formula", "Statistics"],
//         syllabus: [
//           { unit: "Unit 1 – Number Systems",           topics: ["Real Numbers", "Irrational Numbers", "Laws of Exponents"] },
//           { unit: "Unit 2 – Algebra",                  topics: ["Polynomials", "Linear Equations in Two Variables"] },
//           { unit: "Unit 3 – Geometry",                 topics: ["Lines & Angles", "Triangles", "Quadrilaterals", "Circles"] },
//           { unit: "Unit 4 – Mensuration",              topics: ["Areas", "Surface Areas & Volumes"] },
//           { unit: "Unit 5 – Statistics & Probability", topics: ["Statistics", "Probability"] },
//         ],
//       },
//       { name: "Science", icon: "🔬",
//         chapters: ["Matter", "Force & Laws", "Gravitation", "Work & Energy", "Sound", "Tissues", "Diversity of Life"],
//         syllabus: [
//           { unit: "Unit 1 – Matter",                       topics: ["Matter in our Surroundings", "Is Matter Pure?", "Atoms & Molecules", "Structure of Atom"] },
//           { unit: "Unit 2 – Organization in Living World", topics: ["Cell: Basic Unit", "Tissues", "Diversity in Living Organisms"] },
//           { unit: "Unit 3 – Motion, Force & Work",         topics: ["Motion", "Force & Newton's Laws", "Gravitation", "Work & Energy", "Sound"] },
//           { unit: "Unit 4 – Natural Resources",            topics: ["Natural Resources", "Improvement in Food Resources"] },
//         ],
//       },
//       { name: "Social Science", icon: "🌍",
//         chapters: ["French Revolution", "Socialism", "Nazism", "Forest & Wildlife", "Democracy"],
//         syllabus: [
//           { unit: "History – India & the Contemporary World I", topics: ["French Revolution", "Socialism in Europe", "Nazism & Rise of Hitler", "Forest Society", "Pastoralists"] },
//           { unit: "Geography – Contemporary India I",           topics: ["India: Size & Location", "Physical Features", "Drainage", "Climate", "Natural Vegetation"] },
//           { unit: "Civics – Democratic Politics I",             topics: ["What is Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions"] },
//           { unit: "Economics",                                  topics: ["The Story of Village Palampur", "People as Resource", "Poverty as a Challenge", "Food Security"] },
//         ],
//       },
//       { name: "English", icon: "📖",
//         chapters: ["Beehive", "Moments", "Literature", "Writing Skills"],
//         syllabus: [
//           { unit: "Reading",               topics: ["Unseen Passages", "Note Making"] },
//           { unit: "Writing",               topics: ["Formal Letters", "Story Writing", "Descriptive Paragraphs"] },
//           { unit: "Grammar",               topics: ["Tenses", "Modals", "Voice", "Clauses"] },
//           { unit: "Literature – Beehive",  topics: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind"] },
//           { unit: "Literature – Moments",  topics: ["The Lost Child", "Adventures of Toto", "Iswaran the Storyteller"] },
//         ],
//       },
//       { name: "Hindi", icon: "📝",
//         chapters: ["Kshitij", "Sparsh", "Kritika", "Sanchayan"],
//         syllabus: [
//           { unit: "Prose Section",  topics: ["Do Bailon Ki Katha", "Lhasa Ki Or", "Upbhoktavad Ki Sanskriti"] },
//           { unit: "Poetry Section", topics: ["Sakhiyan Evam Sabad", "Vakh", "Savaiye"] },
//           { unit: "Grammar",        topics: ["Word Study", "Sentence Study", "Unseen Passage"] },
//         ],
//       },
//       {
//         name: "Artificial Intelligence",
//         icon: "🤖",
//         chapters: [
//           "Introduction to AI",
//           "AI Project Cycle",
//           "Python Basics",
//           "Data Handling",
//           "Machine Learning Basics",
//           "AI Ethics"
//         ],
//         syllabus: [
//           {
//             unit: "Unit 1 – Introduction to AI",
//             topics: [
//               "What is AI?",
//               "Applications of AI",
//               "Future of AI"
//             ]
//           },
//           {
//             unit: "Unit 2 – AI Project Cycle",
//             topics: [
//               "Problem Scoping",
//               "Data Acquisition",
//               "Data Exploration",
//               "Modeling",
//               "Evaluation"
//             ]
//           },
//           {
//             unit: "Unit 3 – Python Basics",
//             topics: [
//               "Variables",
//               "Loops",
//               "Functions",
//               "Lists & Dictionaries"
//             ]
//           },
//           {
//             unit: "Unit 4 – Machine Learning",
//             topics: [
//               "Supervised Learning",
//               "Unsupervised Learning",
//               "Neural Networks"
//             ]
//           },
//           {
//             unit: "Unit 5 – Ethics in AI",
//             topics: [
//               "Bias in AI",
//               "Responsible AI",
//               "Privacy & Security"
//             ]
//           }
//         ]
//       },
//     ],
//   },
//   {
//     id: 10, label: "Class 10", tagline: "Board Exam Year – Make It Count",
//     description: "Class 10 is the most crucial milestone in school education. The CBSE Board Exams determine your academic trajectory. This year requires dedicated preparation, conceptual clarity, and consistent practice across all subjects.",
//     highlights: ["CBSE Board Examination", "Real Numbers & Polynomials", "Chemical Reactions", "India & its Neighbours"],
//     subjects: [
//       { name: "Mathematics", icon: "📐",
//         chapters: ["Real Numbers", "Polynomials", "Quadratic Equations", "AP", "Triangles", "Circles", "Trigonometry"],
//         syllabus: [
//           { unit: "Unit 1 – Number Systems",  topics: ["Real Numbers", "Euclid's Division Lemma", "Fundamental Theorem of Arithmetic"] },
//           { unit: "Unit 2 – Algebra",         topics: ["Polynomials", "Pair of Linear Equations", "Quadratic Equations", "Arithmetic Progressions"] },
//           { unit: "Unit 3 – Geometry",        topics: ["Triangles", "Circles", "Constructions"] },
//           { unit: "Unit 4 – Trigonometry",    topics: ["Introduction to Trigonometry", "Trigonometric Identities", "Heights & Distances"] },
//           { unit: "Unit 5 – Statistics & Probability", topics: ["Statistics", "Probability"] },
//         ],
//       },
//       { name: "Science", icon: "🔬",
//         chapters: ["Chemical Reactions", "Acids & Bases", "Metals & Non-metals", "Life Processes", "Electricity", "Light"],
//         syllabus: [
//           { unit: "Chemical Substances",  topics: ["Chemical Reactions", "Acids, Bases & Salts", "Metals & Non-metals", "Carbon & its Compounds", "Periodic Classification"] },
//           { unit: "World of Living",       topics: ["Life Processes", "Control & Coordination", "How do Organisms Reproduce", "Heredity & Evolution"] },
//           { unit: "Natural Phenomena",    topics: ["Light – Reflection & Refraction", "Human Eye"] },
//           { unit: "Effects of Current",   topics: ["Electricity", "Magnetic Effects of Current"] },
//           { unit: "Natural Resources",    topics: ["Our Environment", "Sustainable Management"] },
//         ],
//       },
//       { name: "Social Science", icon: "🌍",
//         chapters: ["Nationalism", "Rise of Nationalism", "Resources", "Federalism", "Development"],
//         syllabus: [
//           { unit: "History – India & Contemporary World II", topics: ["Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "Age of Industrialisation", "Print Culture"] },
//           { unit: "Geography – Contemporary India II",       topics: ["Resources & Development", "Forest & Wildlife Resources", "Water Resources", "Agriculture", "Minerals & Energy"] },
//           { unit: "Civics – Democratic Politics II",         topics: ["Power Sharing", "Federalism", "Gender, Religion, Caste", "Political Parties", "Outcomes of Democracy"] },
//           { unit: "Economics",                               topics: ["Development", "Sectors of Economy", "Money & Credit", "Globalisation"] },
//         ],
//       },
//       { name: "English", icon: "📖",
//         chapters: ["First Flight", "Footprints Without Feet", "Writing & Grammar"],
//         syllabus: [
//           { unit: "Reading",                    topics: ["Factual Passages", "Discursive Passages"] },
//           { unit: "Writing",                    topics: ["Formal Letters", "Analytical Paragraphs", "Emails"] },
//           { unit: "Grammar",                    topics: ["Tenses", "Modals", "Subject-Verb Agreement", "Reported Speech"] },
//           { unit: "Literature – First Flight",  topics: ["A Letter to God", "Nelson Mandela", "Two Stories About Flying", "From the Diary of Anne Frank"] },
//           { unit: "Literature – Footprints",    topics: ["A Triumph of Surgery", "The Thief's Story", "The Midnight Visitor", "A Question of Trust"] },
//         ],
//       },
//       { name: "Hindi", icon: "📝",
//         chapters: ["Kshitij 2", "Sparsh 2", "Sanchayan 2", "Kritika 2"],
//         syllabus: [
//           { unit: "Prose",     topics: ["Netaji Ka Chashma", "Balgobin Bhagat", "Lakhnavee Andaz", "Maanviya Karuna Ki Divya Chamak"] },
//           { unit: "Poetry",    topics: ["Surdas", "Tulsidas", "Dev", "Jaishankar Prasad", "Suryakant Tripathi"] },
//           { unit: "Grammar",   topics: ["Voice (Vachya)", "Word Analysis (Pad Parichay)", "Poetic Sentiment (Ras)", "Figures of Speech (Alankar)"] },
//         ],
//       },
//     ],
//   },
//   {
//     id: 11, label: "Class 11", tagline: "Stream Selection & Deep Learning",
//     description: "Class 11 marks a turning point — you now study your chosen stream (Science, Commerce, or Arts/Humanities) in depth. This year introduces college-level concepts and demands independent thinking, problem-solving, and deeper understanding.",
//     highlights: ["Stream-specific Deep Learning", "Physics, Chemistry & Biology", "Accountancy & Economics", "Advanced Mathematics"],
//     subjects: [
//       { name: "Physics", icon: "⚛️",
//         chapters: ["Units & Measurement", "Kinematics", "Laws of Motion", "Work & Energy", "Thermodynamics", "Waves"],
//         syllabus: [
//           { unit: "Unit 1 – Physical World & Measurement", topics: ["Physical World", "Units & Measurements"] },
//           { unit: "Unit 2 – Kinematics",                   topics: ["Motion in a Straight Line", "Motion in a Plane"] },
//           { unit: "Unit 3 – Laws of Motion",               topics: ["Newton's Laws", "Friction", "Circular Motion"] },
//           { unit: "Unit 4 – Work, Energy & Power",         topics: ["Work-Energy Theorem", "Conservation of Energy", "Collisions"] },
//           { unit: "Unit 5 – Thermodynamics",               topics: ["Thermal Properties", "Thermodynamics Laws", "Kinetic Theory"] },
//           { unit: "Unit 6 – Oscillations & Waves",         topics: ["Oscillations", "Waves"] },
//         ],
//       },
//       { name: "Chemistry", icon: "🧪",
//         chapters: ["Some Basic Concepts", "Atomic Structure", "Chemical Bonding", "Equilibrium", "Organic Chemistry"],
//         syllabus: [
//           { unit: "Unit 1 – Basic Concepts",   topics: ["Mole Concept", "Stoichiometry", "Atomic Structure", "Chemical Bonding"] },
//           { unit: "Unit 2 – States of Matter", topics: ["Gases", "Liquids", "Solids"] },
//           { unit: "Unit 3 – Equilibrium",      topics: ["Chemical Equilibrium", "Ionic Equilibrium", "Acids & Bases"] },
//           { unit: "Unit 4 – Organic Chemistry",topics: ["Basics of Organic Chemistry", "Hydrocarbons"] },
//         ],
//       },
//       { name: "Mathematics", icon: "📐",
//         chapters: ["Sets & Functions", "Algebra", "Coordinate Geometry", "Calculus", "Statistics"],
//         syllabus: [
//           { unit: "Unit 1 – Sets & Functions",        topics: ["Sets", "Relations & Functions", "Trigonometric Functions"] },
//           { unit: "Unit 2 – Algebra",                 topics: ["Complex Numbers", "Linear Inequalities", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series"] },
//           { unit: "Unit 3 – Coordinate Geometry",     topics: ["Straight Lines", "Conic Sections", "3D Geometry Intro"] },
//           { unit: "Unit 4 – Calculus",                topics: ["Limits & Derivatives"] },
//           { unit: "Unit 5 – Statistics & Probability", topics: ["Statistics", "Probability"] },
//         ],
//       },
//       { name: "Biology", icon: "🌱",
//         chapters: ["Cell Biology", "Plant Kingdom", "Animal Kingdom", "Morphology", "Human Physiology"],
//         syllabus: [
//           { unit: "Unit 1 – Diversity in Living World",  topics: ["Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"] },
//           { unit: "Unit 2 – Structural Organization",    topics: ["Morphology of Flowering Plants", "Anatomy of Plants", "Animal Tissues"] },
//           { unit: "Unit 3 – Cell",                       topics: ["Cell: Unit of Life", "Biomolecules", "Cell Cycle & Division"] },
//           { unit: "Unit 4 – Plant Physiology",           topics: ["Photosynthesis", "Respiration in Plants", "Plant Growth"] },
//           { unit: "Unit 5 – Human Physiology",           topics: ["Digestion", "Breathing & Exchange", "Body Fluids", "Excretion"] },
//         ],
//       },
//     ],
//   },
//   {
//     id: 12, label: "Class 12", tagline: "Board Exam + JEE/NEET/CUET Prep",
//     description: "Class 12 is the ultimate milestone — your board results, JEE/NEET/CUET performance, and college applications all converge. This year demands peak academic performance, strategic preparation, and focused revision.",
//     highlights: ["CBSE Board Exams", "JEE/NEET Preparation", "CUET Readiness", "College Applications"],
//     subjects: [
//       { name: "Physics", icon: "⚛️",
//         chapters: ["Electrostatics", "Current Electricity", "Magnetism", "EMI", "Optics", "Modern Physics"],
//         syllabus: [
//           { unit: "Unit 1 – Electrostatics",      topics: ["Electric Charges & Fields", "Electrostatic Potential", "Capacitance"] },
//           { unit: "Unit 2 – Current Electricity",  topics: ["Current, Resistance, EMF", "Kirchhoff's Laws", "Wheatstone Bridge"] },
//           { unit: "Unit 3 – Magnetic Effects",     topics: ["Moving Charges & Magnetism", "Magnetism & Matter", "EMI", "AC"] },
//           { unit: "Unit 4 – Optics",               topics: ["Ray Optics", "Wave Optics"] },
//           { unit: "Unit 5 – Modern Physics",       topics: ["Dual Nature of Radiation", "Atoms", "Nuclei", "Semiconductors"] },
//         ],
//       },
//       { name: "Chemistry", icon: "🧪",
//         chapters: ["Solid State", "Solutions", "Electrochemistry", "Coordination Compounds", "Biomolecules"],
//         syllabus: [
//           { unit: "Unit 1 – Solid State & Solutions",   topics: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics"] },
//           { unit: "Unit 2 – Surface Chemistry & Metals",topics: ["Surface Chemistry", "General Principles", "p,d,f Block Elements", "Coordination Compounds"] },
//           { unit: "Unit 3 – Organic Chemistry",         topics: ["Haloalkanes", "Alcohols", "Aldehydes & Ketones", "Carboxylic Acids", "Amines"] },
//           { unit: "Unit 4 – Biochemistry",              topics: ["Biomolecules", "Polymers", "Chemistry in Everyday Life"] },
//         ],
//       },
//       { name: "Mathematics", icon: "📐",
//         chapters: ["Relations & Functions", "Matrices", "Calculus", "Vectors", "Linear Programming"],
//         syllabus: [
//           { unit: "Unit 1 – Relations & Functions",           topics: ["Relations & Functions", "Inverse Trigonometric Functions"] },
//           { unit: "Unit 2 – Algebra",                         topics: ["Matrices", "Determinants"] },
//           { unit: "Unit 3 – Calculus",                        topics: ["Continuity & Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations"] },
//           { unit: "Unit 4 – Vectors & 3D",                    topics: ["Vectors", "3D Geometry"] },
//           { unit: "Unit 5 – Linear Programming & Probability",topics: ["Linear Programming", "Probability"] },
//         ],
//       },
//       { name: "Biology", icon: "🌱",
//         chapters: ["Reproduction", "Genetics", "Evolution", "Biotechnology", "Ecology"],
//         syllabus: [
//           { unit: "Unit 1 – Reproduction",             topics: ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health"] },
//           { unit: "Unit 2 – Genetics & Evolution",     topics: ["Principles of Inheritance", "Molecular Basis of Inheritance", "Evolution"] },
//           { unit: "Unit 3 – Biology in Human Welfare", topics: ["Human Health & Disease", "Microbes in Human Welfare"] },
//           { unit: "Unit 4 – Biotechnology",            topics: ["Principles of Biotechnology", "Biotechnology & its Applications"] },
//           { unit: "Unit 5 – Ecology",                  topics: ["Organisms & Populations", "Ecosystem", "Biodiversity", "Environmental Issues"] },
//         ],
//       },
//     ],
//   },
// ];

// const CLASSES = { cbse: CBSE_CLASSES };
// ["bihar", "upboard", "icse"].forEach((id) => {
//   CLASSES[id] = CBSE_CLASSES.map((c) => ({ ...c }));
// });

// // ─── CSS ──────────────────────────────────────────────────────────────────────

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --green: #1a5c2a;
//     --orange: #f47b20;
//     --dark: #1a1f2e;
//     --bg: #f5ede4;
//     --white: #ffffff;
//     --light-orange: #fff4ec;
//     --text: #3a3a3a;
//     --muted: #6b6b6b;

//     --nav-bg: #ffffff;
//     --nav-border: #ede0d5;
//     --nav-text: #3a3a3a;
//     --nav-muted: #6b6b6b;
//     --toggle-bg: #f0e6dd;
//     --toggle-hover: #e8d5c4;
//   }

//   .sc-wrap.dark-mode {
//     --bg: #111827;
//     --white: #1f2937;
//     --dark: #f9fafb;
//     --text: #e5e7eb;
//     --muted: #9ca3af;
//     --light-orange: #2a1f14;

//     --nav-bg: #1f2937;
//     --nav-border: #374151;
//     --nav-text: #e5e7eb;
//     --nav-muted: #9ca3af;
//     --toggle-bg: #374151;
//     --toggle-hover: #4b5563;
//   }

//   .sc-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

//   .sc-wrap {
//     font-family: 'Poppins', sans-serif;
//     background: var(--bg);
//     color: var(--text);
//     transition: background 0.3s, color 0.3s;
//     min-width: 0;
//     width: 100%;
//     overflow-x: hidden;
//   }

//   /* ── NAVBAR ── */
//   .sc-navbar {
//     position: sticky;
//     top: 0;
//     z-index: 100;
//     background: var(--nav-bg);
//     border-bottom: 1px solid var(--nav-border);
//     padding: 0 80px;
//     height: 64px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     box-shadow: 0 1px 8px rgba(0,0,0,0.06);
//     transition: background 0.3s, border-color 0.3s;
//   }

//   .sc-nav-left { display: flex; align-items: center; }
//   .sc-nav-right { display: flex; align-items: center; gap: 12px; }

//   .sc-dark-toggle {
//     width: 40px;
//     height: 40px;
//     border-radius: 50%;
//     border: none;
//     background: var(--toggle-bg);
//     color: var(--nav-text);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: background 0.2s, transform 0.2s;
//     flex-shrink: 0;
//   }
//   .sc-dark-toggle:hover { background: var(--toggle-hover); transform: rotate(15deg); }

//   /* ── LOGO ── */
//   .sc-logo-btn {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     background: transparent;
//     border: none;
//     cursor: pointer;
//     padding: 0;
//     text-decoration: none;
//   }

//   .sc-logo-icon {
//     width: 40px;
//     height: 40px;
//     background: #F97316;
//     border-radius: 10px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     box-shadow: 0 4px 12px rgba(249,115,22,0.35);
//     flex-shrink: 0;
//   }

//   .sc-logo-text {
//     font-family: 'Nunito', sans-serif;
//     font-size: 1.6rem;
//     font-weight: 900;
//     letter-spacing: -0.5px;
//     line-height: 1;
//   }
//   .sc-logo-text .l-green  { color: var(--green); }
//   .sc-logo-text .l-orange { color: #F97316; }

//   /* ── HERO ── */
//   .sc-hero {
//     background: var(--bg);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 80px 80px 64px;
//     min-height: 520px;
//     gap: 40px;
//     transition: background 0.3s;
//   }

//   .sc-hero-left { flex: 1; max-width: 540px; }

//   .sc-hero-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 8px;
//     background: var(--white);
//     border: 1.5px solid #e8d5c4;
//     border-radius: 30px;
//     padding: 6px 16px;
//     font-size: 0.82rem;
//     font-weight: 600;
//     color: var(--orange);
//     margin-bottom: 28px;
//     transition: background 0.3s, border-color 0.3s;
//     flex-wrap: wrap;
//   }

//   .sc-hero-left h1 {
//     font-family: 'Nunito', sans-serif;
//     font-size: 3.2rem;
//     font-weight: 900;
//     line-height: 1.15;
//     color: var(--dark);
//     margin-bottom: 20px;
//   }
//   .sc-hero-left h1 .highlight { color: var(--orange); }

//   .sc-hero-left p {
//     font-size: 1rem;
//     color: var(--muted);
//     line-height: 1.7;
//     margin-bottom: 36px;
//     max-width: 420px;
//   }

//   .sc-hero-cta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

//   .sc-btn-start {
//     background: var(--dark);
//     color: var(--white);
//     border: none;
//     padding: 14px 28px;
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 1rem;
//     font-weight: 700;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     transition: transform 0.2s, box-shadow 0.2s;
//     white-space: nowrap;
//   }
//   .sc-btn-start:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,31,46,0.25); }

//   .sc-btn-explore {
//     background: transparent;
//     color: var(--dark);
//     border: 2px solid var(--dark);
//     padding: 12px 24px;
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.95rem;
//     font-weight: 600;
//     cursor: pointer;
//     transition: background 0.2s, color 0.2s;
//     white-space: nowrap;
//   }
//   .sc-btn-explore:hover { background: var(--dark); color: var(--white); }

//   .sc-hero-right { flex: 1; max-width: 500px; position: relative; }

//   .sc-hero-img-wrapper {
//     border-radius: 16px;
//     overflow: hidden;
//     box-shadow: 0 20px 60px rgba(0,0,0,0.12);
//     height: 380px;
//   }
//   .sc-hero-img-wrapper img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     object-position: center top;
//     display: block;
//   }

//   .sc-hero-stats {
//     position: absolute;
//     bottom: -20px;
//     left: -20px;
//     background: var(--white);
//     border-radius: 12px;
//     padding: 12px 20px;
//     box-shadow: 0 8px 30px rgba(0,0,0,0.1);
//     display: flex;
//     gap: 20px;
//     transition: background 0.3s;
//   }

//   .sc-stat { text-align: center; }
//   .sc-stat-num { font-size: 1.4rem; font-weight: 800; color: var(--dark); font-family: 'Nunito', sans-serif; }
//   .sc-stat-label { font-size: 0.72rem; color: var(--muted); }

//   /* ── SECTION COMMON ── */
//   .sc-section { padding: 72px 80px; }
//   .sc-section-alt { background: var(--white); transition: background 0.3s; }

//   .sc-section-tag {
//     display: inline-block;
//     background: var(--light-orange);
//     color: var(--orange);
//     font-size: 0.8rem;
//     font-weight: 700;
//     padding: 4px 14px;
//     border-radius: 20px;
//     letter-spacing: 0.5px;
//     text-transform: uppercase;
//     margin-bottom: 14px;
//     transition: background 0.3s;
//   }

//   .sc-section-title {
//     font-family: 'Nunito', sans-serif;
//     font-size: 2.2rem;
//     font-weight: 900;
//     color: var(--dark);
//     margin-bottom: 10px;
//   }
//   .sc-section-title span { color: var(--orange); }

//   .sc-section-sub {
//     color: var(--muted);
//     font-size: 0.97rem;
//     margin-bottom: 48px;
//     max-width: 520px;
//   }

//   /* ── COMPETITIVE EXAMS ── */
//   .sc-comp-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 20px;
//   }

//   .sc-comp-card {
//     background: var(--bg);
//     border-radius: 16px;
//     padding: 22px 22px 20px;
//     border: 2px solid transparent;
//     display: flex;
//     align-items: flex-start;
//     gap: 18px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//     transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.3s;
//   }
//   .sc-comp-card::after {
//     content: '';
//     position: absolute;
//     top: 0; left: 0; right: 0;
//     height: 3px;
//     background: var(--comp-color);
//     transform: scaleX(0);
//     transform-origin: left;
//     transition: transform 0.28s ease;
//   }
//   .sc-comp-card:hover {
//     border-color: var(--comp-color);
//     transform: translateY(-4px);
//     box-shadow: 0 12px 32px rgba(0,0,0,0.09);
//   }
//   .sc-comp-card:hover::after { transform: scaleX(1); }

//   .sc-comp-icon {
//     width: 50px;
//     height: 50px;
//     border-radius: 13px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     flex-shrink: 0;
//     margin-top: 2px;
//   }

//   .sc-comp-body { flex: 1; min-width: 0; }

//   .sc-comp-header {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     margin-bottom: 2px;
//     flex-wrap: wrap;
//   }

//   .sc-comp-code {
//     font-family: 'Nunito', sans-serif;
//     font-size: 1.65rem;
//     font-weight: 900;
//     line-height: 1;
//   }

//   .sc-comp-tag {
//     font-size: 0.65rem;
//     font-weight: 700;
//     padding: 2px 9px;
//     border-radius: 20px;
//     letter-spacing: 0.3px;
//     text-transform: uppercase;
//     font-family: 'Poppins', sans-serif;
//   }

//   .sc-comp-label {
//     font-size: 0.78rem;
//     color: var(--muted);
//     margin-bottom: 10px;
//     font-family: 'Poppins', sans-serif;
//   }

//   .sc-comp-subjects {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 5px;
//     margin-bottom: 14px;
//   }

//   .sc-comp-pill {
//     font-size: 0.66rem;
//     padding: 2px 9px;
//     border-radius: 10px;
//     font-weight: 600;
//     font-family: 'Poppins', sans-serif;
//   }

//   .sc-comp-cta {
//     border: none;
//     padding: 8px 16px;
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.78rem;
//     font-weight: 700;
//     cursor: pointer;
//     color: white;
//     transition: opacity 0.2s, transform 0.15s;
//     letter-spacing: 0.2px;
//     display: inline-block;
//   }
//   .sc-comp-cta:hover { opacity: 0.85; transform: translateY(-1px); }

//   /* ── FEATURES ── */
//   .sc-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

//   .sc-feature-card { background: var(--bg); border-radius: 14px; padding: 28px; transition: background 0.3s; }

//   .sc-feature-icon {
//     width: 48px;
//     height: 48px;
//     background: var(--light-orange);
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: var(--orange);
//     margin-bottom: 14px;
//     transition: background 0.3s;
//   }

//   .sc-feature-title { font-weight: 700; font-size: 1.05rem; color: var(--dark); margin-bottom: 8px; font-family: 'Poppins', sans-serif; }
//   .sc-feature-text { font-size: 0.88rem; color: var(--muted); line-height: 1.6; }

//   /* ── MENTORS ── */
//   .sc-mentor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

//   .sc-mentor-card {
//     background: var(--white);
//     border-radius: 16px;
//     padding: 28px;
//     display: flex;
//     align-items: center;
//     gap: 18px;
//     border: 1.5px solid #ede0d5;
//     transition: box-shadow 0.2s, background 0.3s, border-color 0.3s;
//   }
//   .sc-mentor-card:hover { box-shadow: 0 8px 28px rgba(244,123,32,0.12); }

//   .sc-mentor-avatar {
//     width: 64px;
//     height: 64px;
//     border-radius: 50%;
//     background: linear-gradient(135deg, var(--orange), #ff9a4a);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     flex-shrink: 0;
//   }

//   .sc-mentor-name { font-weight: 700; font-size: 1rem; color: var(--dark); font-family: 'Poppins', sans-serif; }
//   .sc-mentor-sub  { font-size: 0.8rem; color: var(--orange); font-weight: 600; margin-bottom: 4px; font-family: 'Poppins', sans-serif; }
//   .sc-mentor-exp  { font-size: 0.78rem; color: var(--muted); font-family: 'Poppins', sans-serif; }

//   /* ── CTA BANNER ── */
//   .sc-cta-banner {
//     background: var(--dark);
//     margin: 0 80px 72px;
//     border-radius: 20px;
//     padding: 56px 64px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 32px;
//     transition: background 0.3s;
//   }

//   .sc-cta-banner h2 {
//     font-family: 'Nunito', sans-serif;
//     font-size: 2rem;
//     font-weight: 900;
//     color: var(--white);
//     max-width: 420px;
//     line-height: 1.3;
//   }
//   .sc-cta-banner h2 span { color: var(--orange); }
//   .sc-cta-banner p { color: rgba(255,255,255,0.6); margin-top: 10px; font-size: 0.95rem; }

//   .sc-btn-cta-white {
//     background: var(--white);
//     color: var(--dark);
//     border: none;
//     padding: 14px 32px;
//     border-radius: 10px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 1rem;
//     font-weight: 700;
//     cursor: pointer;
//     white-space: nowrap;
//     transition: background 0.2s, color 0.2s;
//   }
//   .sc-btn-cta-white:hover { background: var(--orange); color: var(--white); }

//   /* ── FOOTER ── */
//   .sc-footer {
//     background: var(--white);
//     border-top: 1px solid #ede0d5;
//     padding: 24px 80px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     font-size: 0.85rem;
//     color: var(--muted);
//     font-family: 'Poppins', sans-serif;
//     transition: background 0.3s, border-color 0.3s;
//     flex-wrap: wrap;
//     gap: 12px;
//   }

//   /* ════════════════════════════════════
//      BOARD PORTAL STYLES  (.scp- prefix)
//   ════════════════════════════════════ */

//   .scp-back-btn {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     background: var(--white);
//     border: 1.5px solid var(--nav-border);
//     border-radius: 10px;
//     padding: 8px 18px;
//     font-size: 0.85rem;
//     font-weight: 600;
//     color: var(--dark);
//     cursor: pointer;
//     margin-bottom: 28px;
//     transition: background 0.15s, color 0.15s, border-color 0.15s;
//   }
//   .scp-back-btn:hover { background: var(--light-orange); color: var(--orange); border-color: var(--orange); }

//   .scp-breadcrumb {
//     display: flex;
//     align-items: center;
//     gap: 6px;
//     font-size: 0.8rem;
//     font-weight: 600;
//     color: var(--muted);
//     margin-bottom: 28px;
//     flex-wrap: wrap;
//   }
//   .scp-bc-sep { opacity: 0.5; }

//   .scp-boards-grid {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 20px;
//   }

//   .scp-board-card {
//     background: var(--white);
//     border-radius: 20px;
//     padding: 28px 22px;
//     border: 2px solid transparent;
//     cursor: pointer;
//     box-shadow: 0 4px 20px rgba(0,0,0,0.05);
//     transition: transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s, border-color 0.25s, background 0.3s;
//   }
//   .scp-board-card:hover {
//     transform: translateY(-6px);
//     box-shadow: 0 20px 40px rgba(0,0,0,0.13);
//   }

//   .scp-board-emoji { font-size: 2.2rem; margin-bottom: 12px; line-height: 1; }
//   .scp-board-name  { font-size: 1.25rem; font-weight: 900; margin-bottom: 4px; font-family: 'Nunito', sans-serif; }
//   .scp-board-full  { font-size: 0.75rem; color: var(--muted); font-weight: 600; margin-bottom: 10px; line-height: 1.4; }

//   .scp-board-tagline {
//     display: inline-block;
//     border-radius: 8px;
//     padding: 4px 12px;
//     font-size: 0.72rem;
//     font-weight: 700;
//     margin-bottom: 16px;
//   }

//   .scp-board-pills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
//   .scp-class-pill {
//     border-radius: 8px;
//     padding: 3px 9px;
//     font-size: 0.7rem;
//     font-weight: 700;
//     font-family: 'Poppins', sans-serif;
//   }

//   .scp-board-cta {
//     width: 100%;
//     border: none;
//     border-radius: 10px;
//     padding: 10px 0;
//     color: white;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.83rem;
//     font-weight: 800;
//     cursor: pointer;
//     text-align: center;
//     transition: opacity 0.2s;
//   }
//   .scp-board-cta:hover { opacity: 0.85; }

//   .scp-classes-header {
//     display: flex;
//     align-items: center;
//     gap: 16px;
//     margin-bottom: 32px;
//     flex-wrap: wrap;
//   }
//   .scp-ch-emoji { font-size: 3rem; }
//   .scp-ch-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
//   .scp-ch-title { font-family: 'Nunito', sans-serif; font-size: 1.7rem; font-weight: 900; color: var(--dark); margin-bottom: 2px; }
//   .scp-ch-sub   { font-size: 0.82rem; color: var(--muted); font-weight: 500; }

//   .scp-classes-grid {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 20px;
//   }

//   .scp-class-card {
//     background: var(--white);
//     border-radius: 16px;
//     border: 1.5px solid var(--nav-border);
//     overflow: hidden;
//     cursor: pointer;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//     transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
//   }
//   .scp-class-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.12); }

//   .scp-class-card-header { padding: 24px 20px; color: white; }
//   .scp-cc-icon  { font-size: 1.8rem; margin-bottom: 8px; }
//   .scp-cc-label { font-size: 1.5rem; font-weight: 900; font-family: 'Nunito', sans-serif; }
//   .scp-cc-tag   { font-size: 0.75rem; opacity: 0.9; font-weight: 600; margin-top: 4px; }

//   .scp-class-card-body { padding: 16px 20px; }
//   .scp-class-card-body p { font-size: 0.78rem; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }

//   .scp-subject-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
//   .scp-subject-tag {
//     border-radius: 6px;
//     padding: 3px 9px;
//     font-size: 0.68rem;
//     font-weight: 700;
//     font-family: 'Poppins', sans-serif;
//   }

//   .scp-class-cta {
//     width: 100%;
//     border: none;
//     border-radius: 9px;
//     padding: 9px 0;
//     color: white;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.78rem;
//     font-weight: 800;
//     cursor: pointer;
//     transition: opacity 0.2s;
//   }
//   .scp-class-cta:hover { opacity: 0.85; }

//   .scp-class-hero {
//     border-radius: 20px;
//     padding: 36px 32px;
//     margin-bottom: 32px;
//     color: white;
//   }
//   .scp-hero-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.85; margin-bottom: 8px; }
//   .scp-hero-h2 { font-family: 'Nunito', sans-serif; font-size: 1.9rem; font-weight: 900; margin-bottom: 10px; }
//   .scp-hero-desc { font-size: 0.9rem; line-height: 1.7; opacity: 0.9; max-width: 680px; margin-bottom: 20px; }
//   .scp-highlights { display: flex; gap: 8px; flex-wrap: wrap; }
//   .scp-highlight-tag {
//     background: rgba(255,255,255,0.2);
//     border-radius: 8px;
//     padding: 5px 13px;
//     font-size: 0.75rem;
//     font-weight: 600;
//   }

//   .scp-subjects-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
//   .scp-subjects-header h3 { font-size: 1.15rem; font-weight: 800; color: var(--dark); font-family: 'Nunito', sans-serif; }
//   .scp-count-badge {
//     border-radius: 8px;
//     padding: 3px 12px;
//     font-size: 0.75rem;
//     font-weight: 700;
//     font-family: 'Poppins', sans-serif;
//   }

//   .scp-subjects-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
//     gap: 16px;
//   }

//   .scp-subject-card {
//     background: var(--white);
//     border: 1.5px solid var(--nav-border);
//     border-radius: 14px;
//     padding: 22px 20px;
//     cursor: pointer;
//     box-shadow: 0 2px 8px rgba(0,0,0,0.04);
//     transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
//   }
//   .scp-subject-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.11); }

//   .scp-sub-emoji  { font-size: 2.2rem; margin-bottom: 10px; }
//   .scp-sub-name   { font-size: 1.05rem; font-weight: 800; color: var(--dark); margin-bottom: 5px; font-family: 'Nunito', sans-serif; }
//   .scp-sub-meta   { font-size: 0.75rem; color: var(--muted); margin-bottom: 12px; }
//   .scp-sub-tags   { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
//   .scp-sub-tag    { border-radius: 6px; padding: 3px 9px; font-size: 0.68rem; font-weight: 700; }

//   .scp-sub-cta {
//     width: 100%;
//     border: none;
//     border-radius: 9px;
//     padding: 9px 0;
//     color: white;
//     font-family: 'Poppins', sans-serif;
//     font-size: 0.78rem;
//     font-weight: 800;
//     cursor: pointer;
//     transition: opacity 0.2s;
//   }
//   .scp-sub-cta:hover { opacity: 0.85; }

//   .scp-subj-header-card {
//     background: var(--white);
//     border: 1.5px solid var(--nav-border);
//     border-radius: 18px;
//     padding: 28px 28px 0;
//     margin-bottom: 24px;
//     transition: background 0.3s;
//   }

//   .scp-subj-header-top {
//     display: flex;
//     align-items: flex-start;
//     gap: 16px;
//     margin-bottom: 20px;
//     flex-wrap: wrap;
//   }
//   .scp-subj-big-icon { font-size: 3.2rem; line-height: 1; }
//   .scp-subj-board-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
//   .scp-subj-name { font-family: 'Nunito', sans-serif; font-size: 1.7rem; font-weight: 900; color: var(--dark); margin-top: 2px; }
//   .scp-subj-meta { font-size: 0.8rem; color: var(--muted); margin-top: 4px; }

//   .scp-tabs {
//     display: flex;
//     gap: 4px;
//     border-top: 1.5px solid var(--nav-border);
//     margin-top: 4px;
//     overflow-x: auto;
//   }
//   .scp-tab-btn {
//     cursor: pointer;
//     padding: 12px 22px;
//     border-radius: 10px 10px 0 0;
//     font-size: 0.85rem;
//     font-weight: 700;
//     border: none;
//     border-bottom: 3px solid transparent;
//     transition: all 0.2s;
//     background: transparent;
//     color: var(--muted);
//     font-family: 'Poppins', sans-serif;
//     white-space: nowrap;
//   }
//   .scp-tab-btn.active { color: white; }

//   .scp-chapters-box {
//     background: var(--white);
//     border-radius: 16px;
//     border: 1.5px solid var(--nav-border);
//     padding: 24px;
//     transition: background 0.3s;
//   }
//   .scp-chapters-box h3 { font-size: 1rem; font-weight: 800; color: var(--dark); margin-bottom: 16px; font-family: 'Nunito', sans-serif; }

//   .scp-chapter-pills { display: flex; flex-wrap: wrap; gap: 4px; }
//   .scp-chapter-pill {
//     background: var(--light-orange);
//     border-radius: 20px;
//     padding: 5px 14px;
//     font-size: 0.78rem;
//     font-weight: 600;
//     color: var(--text);
//     margin: 3px;
//     display: inline-block;
//     transition: background 0.3s;
//   }

//   .scp-study-tip {
//     margin-top: 24px;
//     border-radius: 12px;
//     padding: 16px 20px;
//   }
//   .scp-study-tip .scp-tip-label { font-size: 0.82rem; font-weight: 700; margin-bottom: 6px; }
//   .scp-study-tip p { font-size: 0.8rem; color: var(--muted); line-height: 1.6; }

//   .scp-syllabus-meta { margin-bottom: 16px; font-size: 0.82rem; color: var(--muted); font-weight: 600; }
//   .scp-syllabus-unit {
//     background: var(--white);
//     border-radius: 14px;
//     margin-bottom: 12px;
//     padding: 18px 20px;
//     border: 1.5px solid var(--nav-border);
//     transition: background 0.3s;
//   }
//   .scp-unit-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
//   .scp-unit-num {
//     color: white;
//     border-radius: 8px;
//     width: 28px; height: 28px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 0.78rem; font-weight: 800;
//     flex-shrink: 0;
//   }
//   .scp-unit-title { font-size: 0.9rem; font-weight: 800; color: var(--dark); font-family: 'Nunito', sans-serif; }
//   .scp-topic-item {
//     padding: 5px 14px;
//     font-size: 0.8rem;
//     color: var(--muted);
//     border-left: 3px solid var(--nav-border);
//     margin: 5px 0;
//     line-height: 1.5;
//   }

//   /* ══════════════════════════════════════
//      RESPONSIVE — LAPTOP / SMALL DESKTOP  (max-width: 1200px)
//   ══════════════════════════════════════ */
//   @media (max-width: 1200px) {
//     .sc-navbar { padding: 0 48px; }
//     .sc-hero { padding: 72px 48px 56px; }
//     .sc-section { padding: 64px 48px; }
//     .sc-cta-banner { margin: 0 48px 64px; padding: 48px 48px; }
//     .sc-footer { padding: 20px 48px; }
//     .scp-boards-grid { grid-template-columns: repeat(2, 1fr); }
//     .scp-classes-grid { grid-template-columns: repeat(2, 1fr); }
//   }

//   /* ══════════════════════════════════════
//      RESPONSIVE — TABLET  (max-width: 1024px)
//   ══════════════════════════════════════ */
//   @media (max-width: 1024px) {
//     .sc-navbar { padding: 0 32px; }
//     .sc-hero { padding: 72px 32px 48px; gap: 32px; }
//     .sc-hero-left h1 { font-size: 2.6rem; }
//     .sc-hero-right { max-width: 420px; }
//     .sc-hero-img-wrapper { height: 320px; }
//     .sc-section { padding: 56px 32px; }
//     .sc-section-title { font-size: 1.9rem; }
//     .sc-features-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
//     .sc-mentor-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
//     .sc-comp-row { grid-template-columns: 1fr 1fr; gap: 16px; }
//     .sc-cta-banner { margin: 0 32px 56px; padding: 36px 36px; gap: 24px; }
//     .sc-footer { padding: 20px 32px; }
//     .scp-boards-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
//     .scp-classes-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
//     .scp-subjects-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
//   }

//   /* ══════════════════════════════════════
//      RESPONSIVE — TABLET PORTRAIT  (max-width: 768px)
//   ══════════════════════════════════════ */
//   @media (max-width: 768px) {
//     .sc-navbar { padding: 0 20px; height: 58px; }
//     .sc-logo-text { font-size: 1.35rem; }
//     .sc-logo-icon { width: 34px; height: 34px; }

//     .sc-hero {
//       flex-direction: column;
//       padding: 72px 20px 48px;
//       min-height: auto;
//       gap: 36px;
//     }
//     .sc-hero-left { max-width: 100%; }
//     .sc-hero-left h1 { font-size: 2rem; }
//     .sc-hero-left p { max-width: 100%; }
//     .sc-hero-right { max-width: 100%; width: 100%; }
//     .sc-hero-img-wrapper { height: 260px; }
//     .sc-hero-stats {
//       left: 50%;
//       transform: translateX(-50%);
//       bottom: -20px;
//       width: max-content;
//       justify-content: center;
//     }

//     .sc-section { padding: 48px 20px; }
//     .sc-section-title { font-size: 1.7rem; }
//     .sc-section-sub { font-size: 0.9rem; margin-bottom: 36px; }

//     .sc-features-grid { grid-template-columns: 1fr; gap: 16px; }
//     .sc-mentor-grid { grid-template-columns: 1fr; gap: 16px; }
//     .sc-comp-row { grid-template-columns: 1fr; gap: 14px; }

//     .sc-cta-banner {
//       margin: 0 20px 48px;
//       padding: 32px 24px;
//       flex-direction: column;
//       text-align: center;
//     }
//     .sc-cta-banner h2 { font-size: 1.6rem; max-width: 100%; }

//     .sc-footer {
//       padding: 16px 20px;
//       flex-direction: column;
//       gap: 8px;
//       text-align: center;
//     }

//     .scp-boards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
//     .scp-classes-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
//     .scp-class-hero { padding: 24px 20px; border-radius: 14px; }
//     .scp-hero-h2 { font-size: 1.35rem; }
//     .scp-subjects-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
//     .scp-subj-header-card { padding: 20px 20px 0; }
//     .scp-subj-name { font-size: 1.4rem; }
//     .scp-ch-title { font-size: 1.35rem; }
//   }

//   /* ══════════════════════════════════════
//      RESPONSIVE — MOBILE  (max-width: 540px)
//   ══════════════════════════════════════ */
//   @media (max-width: 540px) {
//     .sc-navbar { padding: 0 16px; }
//     .sc-hero { padding: 64px 16px 44px; gap: 28px; }
//     .sc-hero-left h1 { font-size: 1.75rem; }
//     .sc-hero-badge { font-size: 0.72rem; padding: 5px 12px; }
//     .sc-hero-img-wrapper { height: 220px; }
//     .sc-hero-stats { gap: 12px; padding: 10px 16px; }
//     .sc-stat-num { font-size: 1.1rem; }

//     .sc-section { padding: 40px 16px; }
//     .sc-section-title { font-size: 1.5rem; }

//     .sc-comp-card { flex-direction: column; gap: 12px; }
//     .sc-comp-icon { width: 44px; height: 44px; }
//     .sc-comp-code { font-size: 1.4rem; }

//     .sc-features-grid { grid-template-columns: 1fr; gap: 14px; }
//     .sc-feature-card { padding: 22px; }

//     .sc-mentor-card { flex-direction: column; text-align: center; gap: 12px; }
//     .sc-mentor-grid { grid-template-columns: 1fr; }

//     .sc-cta-banner { margin: 0 16px 40px; padding: 28px 20px; }
//     .sc-cta-banner h2 { font-size: 1.4rem; }
//     .sc-cta-banner p { font-size: 0.85rem; }
//     .sc-btn-cta-white { padding: 12px 24px; font-size: 0.9rem; }

//     .sc-footer { padding: 16px; font-size: 0.78rem; }

//     .scp-boards-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
//     .scp-board-card { padding: 20px 14px; }
//     .scp-board-emoji { font-size: 1.8rem; }
//     .scp-board-name { font-size: 1rem; }
//     .scp-board-full { font-size: 0.68rem; }

//     .scp-classes-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
//     .scp-class-card-header { padding: 18px 14px; }
//     .scp-class-card-body { padding: 12px 14px; }

//     .scp-subjects-grid { grid-template-columns: 1fr; gap: 10px; }
//     .scp-class-hero { padding: 20px 16px; }
//     .scp-hero-h2 { font-size: 1.2rem; }
//     .scp-hero-desc { font-size: 0.82rem; }

//     .scp-subj-header-card { padding: 16px 16px 0; }
//     .scp-subj-big-icon { font-size: 2.4rem; }
//     .scp-subj-name { font-size: 1.2rem; }
//     .scp-ch-title { font-size: 1.1rem; }
//     .scp-tab-btn { padding: 10px 16px; font-size: 0.8rem; }
//     .scp-chapter-pill { font-size: 0.72rem; padding: 4px 11px; }
//   }

//   /* ══════════════════════════════════════
//      RESPONSIVE — TINY PHONE  (max-width: 380px)
//   ══════════════════════════════════════ */
//   @media (max-width: 380px) {
//     .sc-hero-left h1 { font-size: 1.55rem; }
//     .sc-logo-text { font-size: 1.15rem; }
//     .scp-boards-grid { grid-template-columns: 1fr; }
//     .scp-classes-grid { grid-template-columns: 1fr; }
//     .sc-hero-stats { flex-wrap: wrap; justify-content: center; gap: 8px; }
//   }
// `;

// // ─── ASSET ────────────────────────────────────────────────────────────────────

// import schoolImg from "../../assets/school.jpeg";

// // ─── BOARD PORTAL COMPONENT ───────────────────────────────────────────────────

// function BoardPortal() {
//   const [portalPage, setPortalPage]           = useState("home");
//   const [selectedBoard, setSelectedBoard]     = useState(null);
//   const [selectedClass, setSelectedClass]     = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [activeTab, setActiveTab]             = useState("chapters");

//   const getBoard     = () => BOARDS.find((b) => b.id === selectedBoard);
//   const getClassData = () => selectedClass ? (CLASSES[selectedBoard] || []).find((c) => c.id === selectedClass) : null;
//   const getSubjData  = () => {
//     const cls = getClassData();
//     return cls && selectedSubject ? cls.subjects.find((s) => s.name === selectedSubject) : null;
//   };

//   const goHome = () => {
//     setPortalPage("home"); setSelectedBoard(null);
//     setSelectedClass(null); setSelectedSubject(null);
//   };
//   const goClasses = (boardId) => {
//     setSelectedBoard(boardId); setPortalPage("classes");
//     setSelectedClass(null); setSelectedSubject(null);
//   };
//   const goClassDetail = (classId) => {
//     setSelectedClass(classId); setPortalPage("classDetail");
//     setSelectedSubject(null); setActiveTab("chapters");
//   };
//   const goSubject = (subjectName) => {
//     setSelectedSubject(subjectName); setPortalPage("subject");
//     setActiveTab("chapters");
//   };
//   const goBack = () => {
//     if (portalPage === "subject")          { setPortalPage("classDetail"); setSelectedSubject(null); }
//     else if (portalPage === "classDetail") { setPortalPage("classes"); setSelectedClass(null); }
//     else if (portalPage === "classes")     { setPortalPage("home"); setSelectedBoard(null); }
//   };

//   const board = getBoard();
//   const cls   = getClassData();
//   const subj  = getSubjData();

//   const Breadcrumb = () => {
//     if (portalPage === "home") return null;
//     return (
//       <div className="scp-breadcrumb">
//         <span style={{ cursor: "pointer", color: "var(--orange)" }} onClick={goHome}>Boards</span>
//         {board && (
//           <>
//             <ChevronRight size={12} className="scp-bc-sep" />
//             <span style={{ cursor: "pointer", color: board.color }} onClick={() => goClasses(board.id)}>{board.name}</span>
//           </>
//         )}
//         {cls && (
//           <>
//             <ChevronRight size={12} className="scp-bc-sep" />
//             <span style={{ cursor: "pointer", color: "var(--text)" }} onClick={() => goClassDetail(cls.id)}>{cls.label}</span>
//           </>
//         )}
//         {subj && (
//           <>
//             <ChevronRight size={12} className="scp-bc-sep" />
//             <span style={{ color: "var(--orange)" }}>{subj.name}</span>
//           </>
//         )}
//       </div>
//     );
//   };

//   const BackBtn = () =>
//     portalPage !== "home" ? (
//       <button className="scp-back-btn" onClick={goBack}>
//         <ArrowLeft size={14} /> Back
//       </button>
//     ) : null;

//   // ── HOME — Board selection ──
//   if (portalPage === "home") {
//     return (
//       <>
//         <div className="sc-section-tag">School Program</div>
//         <h2 className="sc-section-title">Choose Your <span>Board</span></h2>
//         <p className="sc-section-sub">
//           Complete study material for CBSE, Bihar Board, UP Board, and ICSE — all in one place.
//         </p>
//         <div className="scp-boards-grid">
//           {BOARDS.map((b) => (
//             <div key={b.id} className="scp-board-card" style={{ borderColor: b.color + "30" }} onClick={() => goClasses(b.id)}>
//               <div className="scp-board-emoji">{b.emoji}</div>
//               <div className="scp-board-name" style={{ color: b.color }}>{b.name}</div>
//               <div className="scp-board-full">{b.fullName}</div>
//               <div className="scp-board-tagline" style={{ background: b.accent, color: b.color }}>{b.tagline}</div>
//               <div className="scp-board-pills">
//                 {[9, 10, 11, 12].map((c) => (
//                   <span key={c} className="scp-class-pill" style={{ background: b.color + "22", color: b.color }}>
//                     Class {c}
//                   </span>
//                 ))}
//               </div>
//               <button className="scp-board-cta" style={{ background: b.color }}>Explore Classes →</button>
//             </div>
//           ))}
//         </div>
//       </>
//     );
//   }

//   // ── CLASSES ──
//   if (portalPage === "classes" && board) {
//     const boardClasses = CLASSES[board.id] || [];
//     return (
//       <>
//         <BackBtn />
//         <Breadcrumb />
//         <div className="scp-classes-header">
//           <span className="scp-ch-emoji">{board.emoji}</span>
//           <div>
//             <div className="scp-ch-label" style={{ color: board.color }}>{board.name}</div>
//             <div className="scp-ch-title">{board.fullName}</div>
//             <div className="scp-ch-sub">Select your class — from 9 to 12</div>
//           </div>
//         </div>
//         <div className="scp-classes-grid">
//           {boardClasses.map((c) => {
//             const preview = c.description.substring(0, 110) + "...";
//             return (
//               <div key={c.id} className="scp-class-card" onClick={() => goClassDetail(c.id)}>
//                 <div className="scp-class-card-header" style={{ background: `linear-gradient(135deg, ${board.color}, ${board.color}cc)` }}>
//                   <div className="scp-cc-icon">📚</div>
//                   <div className="scp-cc-label">{c.label}</div>
//                   <div className="scp-cc-tag">{c.tagline}</div>
//                 </div>
//                 <div className="scp-class-card-body">
//                   <p>{preview}</p>
//                   <div className="scp-subject-tags">
//                     {c.subjects.slice(0, 3).map((s) => (
//                       <span key={s.name} className="scp-subject-tag" style={{ background: board.color + "18", color: board.color }}>
//                         {s.icon} {s.name}
//                       </span>
//                     ))}
//                   </div>
//                   <button className="scp-class-cta" style={{ background: board.color }}>View Details →</button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </>
//     );
//   }

//   // ── CLASS DETAIL ──
//   if (portalPage === "classDetail" && board && cls) {
//     return (
//       <>
//         <BackBtn />
//         <Breadcrumb />
//         <div className="scp-class-hero" style={{ background: `linear-gradient(135deg, ${board.color}, ${board.color}aa)` }}>
//           <div className="scp-hero-label">{board.name} • {cls.label}</div>
//           <div className="scp-hero-h2">{cls.tagline}</div>
//           <div className="scp-hero-desc">{cls.description}</div>
//           <div className="scp-highlights">
//             {cls.highlights.map((h) => (
//               <span key={h} className="scp-highlight-tag">✓ {h}</span>
//             ))}
//           </div>
//         </div>
//         <div className="scp-subjects-header">
//           <h3>Subjects</h3>
//           <span className="scp-count-badge" style={{ background: board.color + "18", color: board.color }}>
//             {cls.subjects.length} Subjects
//           </span>
//         </div>
//         <div className="scp-subjects-grid">
//           {cls.subjects.map((s) => (
//             <div key={s.name} className="scp-subject-card" onClick={() => goSubject(s.name)}>
//               <div className="scp-sub-emoji">{s.icon}</div>
//               <div className="scp-sub-name">{s.name}</div>
//               <div className="scp-sub-meta">{s.chapters.length} Chapters • Full Syllabus</div>
//               <div className="scp-sub-tags">
//                 <span className="scp-sub-tag" style={{ background: board.color + "18", color: board.color }}>Chapters</span>
//                 <span className="scp-sub-tag" style={{ background: "#f0fdf4", color: "#16a34a" }}>Syllabus</span>
//               </div>
//               <button className="scp-sub-cta" style={{ background: board.color }}>Open Subject →</button>
//             </div>
//           ))}
//         </div>
//       </>
//     );
//   }

//   // ── SUBJECT DETAIL ──
//   if (portalPage === "subject" && board && cls && subj) {
//     const totalTopics = subj.syllabus.reduce((a, u) => a + u.topics.length, 0);
//     return (
//       <>
//         <BackBtn />
//         <Breadcrumb />
//         <div className="scp-subj-header-card">
//           <div className="scp-subj-header-top">
//             <div className="scp-subj-big-icon">{subj.icon}</div>
//             <div>
//               <div className="scp-subj-board-label" style={{ color: board.color }}>{board.name} • {cls.label}</div>
//               <div className="scp-subj-name">{subj.name}</div>
//               <div className="scp-subj-meta">{subj.chapters.length} Chapters • Complete Syllabus Included</div>
//             </div>
//           </div>
//           <div className="scp-tabs">
//             <button
//               className={`scp-tab-btn${activeTab === "chapters" ? " active" : ""}`}
//               style={activeTab === "chapters" ? { background: board.color, borderBottomColor: board.color } : {}}
//               onClick={() => setActiveTab("chapters")}
//             >
//               📋 Chapters
//             </button>
//             <button
//               className={`scp-tab-btn${activeTab === "syllabus" ? " active" : ""}`}
//               style={activeTab === "syllabus" ? { background: board.color, borderBottomColor: board.color } : {}}
//               onClick={() => setActiveTab("syllabus")}
//             >
//               📝 Syllabus
//             </button>
//           </div>
//         </div>

//         {activeTab === "chapters" ? (
//           <div className="scp-chapters-box">
//             <h3>All Chapters</h3>
//             <div className="scp-chapter-pills">
//               {subj.chapters.map((ch, i) => (
//                 <span key={ch} className="scp-chapter-pill">
//                   <span style={{ color: board.color, fontWeight: 800, marginRight: 5 }}>{i + 1}.</span>
//                   {ch}
//                 </span>
//               ))}
//             </div>
//             <div className="scp-study-tip" style={{ background: board.color + "0a", border: `1.5px solid ${board.color}28` }}>
//               <div className="scp-tip-label" style={{ color: board.color }}>💡 Study Tip</div>
//               <p>
//                 Check the Syllabus tab to see detailed topics for each unit.
//                 Make sure to solve NCERT questions along with each chapter for best results.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="scp-syllabus-meta">📚 {subj.syllabus.length} Units • {totalTopics} Topics</div>
//             {subj.syllabus.map((unit, ui) => (
//               <div key={unit.unit} className="scp-syllabus-unit">
//                 <div className="scp-unit-header">
//                   <div className="scp-unit-num" style={{ background: board.color }}>{ui + 1}</div>
//                   <div className="scp-unit-title">{unit.unit}</div>
//                 </div>
//                 {unit.topics.map((t) => (
//                   <div key={t} className="scp-topic-item" style={{ borderLeftColor: board.color + "50" }}>
//                     <span style={{ color: board.color, marginRight: 8 }}>•</span>
//                     {t}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//       </>
//     );
//   }

//   return null;
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// export default function Schoolclass() {
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const styleId = "schoolclass-styles";
//     if (!document.getElementById(styleId)) {
//       const tag = document.createElement("style");
//       tag.id = styleId;
//       tag.textContent = css;
//       document.head.appendChild(tag);
//     }
//     return () => {
//       const tag = document.getElementById(styleId);
//       if (tag) tag.remove();
//     };
//   }, []);

//   const scrollToClasses = (e) => {
//     e.preventDefault();
//     document.getElementById("classes")?.scrollIntoView({ behavior: "smooth" });
//   };

//   const goHome = () => navigate("/");

//   return (
//     <div className={`sc-wrap${darkMode ? " dark-mode" : ""}`}>

//       {/* ── NAVBAR ── */}
//       <nav className="sc-navbar">
//         <div className="sc-nav-left">
//           <button className="sc-logo-btn" onClick={goHome}>
//             <div className="sc-logo-icon">
//               <GraduationCap size={22} color="white" />
//             </div>
//             <span className="sc-logo-text">
//               <span className="l-green">ILM </span>
//               <span className="l-orange">ORA</span>
//             </span>
//           </button>
//         </div>
//         <div className="sc-nav-right">
//           <button
//             className="sc-dark-toggle"
//             onClick={() => setDarkMode((prev) => !prev)}
//             aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//           >
//             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//           </button>
//         </div>
//       </nav>

//       {/* ── HERO ── */}
//       <section className="sc-hero">
//         <div className="sc-hero-left">
//           <div className="sc-hero-badge">
//             <BookOpen size={14} />
//             Advanced Learning Platform for School Students
//           </div>
//           <h1>
//             Become the <span className="highlight">Top 1%</span>
//             <br />
//             in Your Class
//           </h1>
//           <p>
//             Learn Science, Math, English &amp; more from India's top educators.
//             Designed for Class 9th, 10th, 11th &amp; 12th students.
//           </p>
//           <div className="sc-hero-cta">
//             <button className="sc-btn-start" onClick={scrollToClasses}>
//               Start Learning →
//             </button>
//             <button className="sc-btn-explore" onClick={scrollToClasses}>
//               Explore Courses
//             </button>
//           </div>
//         </div>

//         <div className="sc-hero-right">
//           <div className="sc-hero-img-wrapper">
//             <img src={schoolImg} alt="Student" />
//           </div>
//           <div className="sc-hero-stats">
//             {stats.map((s) => (
//               <div className="sc-stat" key={s.label}>
//                 <div className="sc-stat-num">{s.num}</div>
//                 <div className="sc-stat-label">{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── COMPETITIVE EXAMS ── */}
//       <section className="sc-section sc-section-alt">
//         <div className="sc-section-tag">Competitive Exams</div>
//         <h2 className="sc-section-title">Crack <span>NEET &amp; JEE</span></h2>
//         <p className="sc-section-sub">
//           Targeted preparation for top medical and engineering entrance exams —
//           curated by experts with proven results.
//         </p>
//         <div className="sc-comp-row">
//           {competitiveExams.map((exam) => (
//             <div className="sc-comp-card" key={exam.code} style={{ "--comp-color": exam.color }}>
//               <div className="sc-comp-icon" style={{ background: exam.color }}>
//                 <exam.Icon size={22} />
//               </div>
//               <div className="sc-comp-body">
//                 <div className="sc-comp-header">
//                   <span className="sc-comp-code" style={{ color: exam.color }}>{exam.code}</span>
//                   <span className="sc-comp-tag" style={{ background: exam.lightColor, color: exam.color }}>{exam.tag}</span>
//                 </div>
//                 <div className="sc-comp-label">{exam.label}</div>
//                 <div className="sc-comp-subjects">
//                   {exam.subjects.map((sub) => (
//                     <span className="sc-comp-pill" key={sub} style={{ background: exam.lightColor, color: exam.color }}>{sub}</span>
//                   ))}
//                 </div>
//                 <button className="sc-comp-cta" style={{ background: exam.color }} onClick={() => navigate(exam.route)}>
//                   Explore {exam.code} Prep →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── BOARD PORTAL ── */}
//       <section className="sc-section" id="classes">
//         <BoardPortal />
//       </section>

//       {/* ── WHY ILM ORA ── */}
//       <section className="sc-section sc-section-alt">
//         <div className="sc-section-tag">Why Choose Us</div>
//         <h2 className="sc-section-title">Learn Smarter, <span>Score Higher</span></h2>
//         <p className="sc-section-sub">
//           Everything you need to ace your exams and build a strong academic foundation.
//         </p>
//         <div className="sc-features-grid">
//           {features.map((f) => (
//             <div className="sc-feature-card" key={f.title}>
//               <div className="sc-feature-icon"><f.Icon size={22} /></div>
//               <div className="sc-feature-title">{f.title}</div>
//               <div className="sc-feature-text">{f.text}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── MENTORS ── */}
//       <section className="sc-section">
//         <div className="sc-section-tag">Our Educators</div>
//         <h2 className="sc-section-title">Learn from the <span>Best</span></h2>
//         <p className="sc-section-sub">
//           Our school faculty brings decades of teaching experience from top institutions.
//         </p>
//         <div className="sc-mentor-grid">
//           {mentors.map((m) => (
//             <div className="sc-mentor-card" key={m.name}>
//               <div className="sc-mentor-avatar"><m.Icon size={26} /></div>
//               <div>
//                 <div className="sc-mentor-sub">{m.subject}</div>
//                 <div className="sc-mentor-name">{m.name}</div>
//                 <div className="sc-mentor-exp">{m.exp}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── CTA BANNER ── */}
//       <div className="sc-cta-banner">
//         <div>
//           <h2>Ready to <span>Transform</span> Your Results?</h2>
//           <p>Join 10,000+ students already achieving their academic goals with ILM ORA.</p>
//         </div>
//         <button className="sc-btn-cta-white" onClick={goHome}>Start for Free →</button>
//       </div>

//       {/* ── FOOTER ── */}
//       <footer className="sc-footer">
//         <button className="sc-logo-btn" onClick={goHome}>
//           <div className="sc-logo-icon">
//             <GraduationCap size={22} color="white" />
//           </div>
//           <span className="sc-logo-text">
//             <span className="l-green">ILM </span>
//             <span className="l-orange">ORA</span>
//           </span>
//         </button>
//         <p>© 2024 ILM ORA · Advanced Learning Platform for Modern Professionals</p>
//         <p>Courses · Mentors · Free Services</p>
//       </footer>

//     </div>
//   );
// } 


























import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video, FileText, Bot, BarChart2, Users, Gift,
  FlaskConical, Calculator, BookOpen, Cpu, Trophy, Target,
  Microscope, GraduationCap, Moon, Sun, ArrowLeft, ChevronRight,
  Brain, Atom, Globe, Languages, Zap, Search, Filter,
  TrendingUp, Award, Clock, Star, CheckCircle, BarChart,
  Layers, Code2, Database, Network, Eye, MessageSquare,
  Shield, Lightbulb, ChevronDown, Play, FileQuestion,
  PenTool, Flame, Calendar, BookMarked, Hash,
} from "lucide-react";

import schoolImg from "../../assets/school.jpeg";

// ─── BOARD LOGOS (graceful fallback if PNGs not present) ─────────────────────
let cbseLogo, biharLogo, icseLogo, upLogo;
try { cbseLogo  = require("../../assets/boards/cbse.png");        } catch (_) { cbseLogo  = null; }
try { biharLogo = require("../../assets/boards/bihar-board.png"); } catch (_) { biharLogo = null; }
try { icseLogo  = require("../../assets/boards/icse.png");        } catch (_) { icseLogo  = null; }
try { upLogo    = require("../../assets/boards/up-board.png");    } catch (_) { upLogo    = null; }

// ─── STATS ────────────────────────────────────────────────────────────────────
const stats = [
  { num: "50K+", label: "Students" },
  { num: "98%",  label: "Pass Rate" },
  { num: "500+", label: "Video Lessons" },
  { num: "4",    label: "Boards" },
];

// ─── COMPETITIVE EXAMS ────────────────────────────────────────────────────────
const competitiveExams = [
  {
    Icon: Microscope, code: "NEET", label: "Medical Entrance Exam",
    subjects: ["Physics", "Chemistry", "Biology", "Botany", "Zoology"],
    route: "/competitive/neet", color: "#16a34a", lightColor: "#f0fdf4", tag: "Medical",
  },
  {
    Icon: Calculator, code: "JEE", label: "Engineering Entrance Exam",
    subjects: ["Physics", "Chemistry", "Mathematics", "Algebra", "Calculus"],
    route: "/competitive/jee", color: "#2563eb", lightColor: "#eff6ff", tag: "Engineering",
  },
];

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const features = [
  { Icon: Video,      title: "HD Video Lectures",        text: "Crystal-clear video lessons recorded by top subject experts, available 24/7." },
  { Icon: FileText,   title: "Past Paper Practice",      text: "Access 10+ years of board exam past papers with complete solutions." },
  { Icon: Bot,        title: "AI-Powered Doubt Solving", text: "Get instant answers to your doubts 24/7 with our intelligent AI tutor." },
  { Icon: BarChart2,  title: "Progress Tracking",        text: "Detailed analytics, weekly reports, and personalized improvement plans." },
  { Icon: Users,      title: "Live Mentorship Sessions", text: "Weekly live sessions with experienced teachers to prepare you for exams." },
  { Icon: Gift,       title: "Free Study Material",      text: "Download free notes, MCQ banks, and study guides curated by specialists." },
];

// ─── MENTORS ──────────────────────────────────────────────────────────────────
const mentors = [
  { Icon: Calculator, subject: "Physics & Mathematics", name: "Sir Ahmed Raza",   exp: "15 years · 4,200+ students" },
  { Icon: Microscope, subject: "Chemistry & Biology",   name: "Ma'am Sana Iqbal", exp: "12 years · 3,800+ students" },
  { Icon: Cpu,        subject: "Computer Science & AI", name: "Sir Bilal Hassan",  exp: "8 years · 2,500+ students" },
];

// ─── DASHBOARD CARDS ──────────────────────────────────────────────────────────
const dashCards = [
  { icon: Flame,    label: "Study Streak",     value: "12 Days",  color: "#f97316" },
  { icon: Target,   label: "Daily Goal",       value: "4/6 Done", color: "#8b5cf6" },
  { icon: Trophy,   label: "Rank This Week",   value: "#3",       color: "#f59e0b" },
  { icon: TrendingUp, label: "Avg. Score",     value: "87%",      color: "#10b981" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  AI SUBJECT (shared across all boards/classes)
// ─────────────────────────────────────────────────────────────────────────────
const AI_SUBJECT_9_10 = {
  name: "Artificial Intelligence",
  icon: Brain,
  stream: "all",
  chapters: [
    "Introduction to Artificial Intelligence",
    "AI Project Cycle",
    "Python Basics for AI",
    "Data Handling & Visualization",
    "Machine Learning Fundamentals",
    "Neural Networks Basics",
    "Generative AI & Prompt Engineering",
    "Chatbots & Conversational AI",
    "Computer Vision",
    "Natural Language Processing",
    "AI Ethics & Responsible AI",
    "AI in Society",
  ],
  syllabus: [
    { unit: "Unit 1 – Introduction to AI", topics: ["What is Artificial Intelligence?", "History & Evolution of AI", "Types of AI: Narrow, General, Super", "Applications of AI in Daily Life", "AI vs Human Intelligence"] },
    { unit: "Unit 2 – AI Project Cycle",   topics: ["Problem Scoping", "Data Acquisition", "Data Exploration", "Modelling", "Evaluation", "Deployment"] },
    { unit: "Unit 3 – Python Basics",      topics: ["Variables & Data Types", "Control Flow (if/else, loops)", "Functions & Modules", "Lists, Tuples, Dictionaries", "File Handling", "Libraries: NumPy, Pandas"] },
    { unit: "Unit 4 – Data Science",       topics: ["Data Collection Methods", "Data Cleaning", "Exploratory Data Analysis", "Data Visualization with Matplotlib", "Statistical Insights"] },
    { unit: "Unit 5 – Machine Learning",   topics: ["Supervised Learning", "Unsupervised Learning", "Regression & Classification", "Decision Trees", "Model Evaluation Metrics"] },
    { unit: "Unit 6 – Neural Networks",    topics: ["Biological vs Artificial Neurons", "Perceptron Model", "Activation Functions", "Deep Learning Intro", "Training a Neural Network"] },
    { unit: "Unit 7 – Generative AI",      topics: ["What is Generative AI?", "Large Language Models (LLMs)", "Prompt Engineering Basics", "ChatGPT & Gemini", "Creative AI Applications"] },
    { unit: "Unit 8 – Chatbots & NLP",     topics: ["Natural Language Processing Basics", "Tokenization", "Sentiment Analysis", "Chatbot Design", "Voice Assistants"] },
    { unit: "Unit 9 – Computer Vision",    topics: ["Image Processing Basics", "Object Detection", "Face Recognition", "OpenCV Introduction", "Real-world Applications"] },
    { unit: "Unit 10 – AI Ethics",         topics: ["Bias in AI Systems", "Fairness & Accountability", "Privacy & Data Security", "Responsible AI Principles", "AI Governance & Policy"] },
  ],
};

const AI_SUBJECT_11_12 = {
  ...AI_SUBJECT_9_10,
  chapters: [...AI_SUBJECT_9_10.chapters, "Advanced Deep Learning", "Reinforcement Learning", "AI Research & Future Trends"],
  syllabus: [
    ...AI_SUBJECT_9_10.syllabus,
    { unit: "Unit 11 – Advanced Deep Learning",       topics: ["CNNs", "RNNs & LSTMs", "Transformers", "Transfer Learning", "GAN – Generative Adversarial Networks"] },
    { unit: "Unit 12 – Reinforcement Learning",       topics: ["RL Concepts", "Reward Functions", "Q-Learning", "Policy Gradient Methods", "Game Playing AI"] },
    { unit: "Unit 13 – AI Research & Future Trends",  topics: ["AGI & Superintelligence", "AI Safety Research", "Emerging AI Tools", "Career Paths in AI", "Building an AI Portfolio"] },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  CBSE DATA
// ─────────────────────────────────────────────────────────────────────────────
const CBSE_CLASSES = [
  {
    id: 9, label: "Class 9", tagline: "Foundation of Excellence",
    streams: null,
    description: "Class 9 is the foundation year for board examinations. Advanced concepts in Science, Mathematics, Social Science, and Languages form the core. Strong performance here sets the stage for Class 10 boards.",
    highlights: ["Advanced Science Intro", "Algebra & Geometry", "History & Civics", "English Literature"],
    subjects: [
      { name: "Mathematics",    icon: Calculator, stream: "all",
        chapters: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines & Angles", "Triangles", "Quadrilaterals", "Circles", "Heron's Formula", "Surface Areas & Volumes", "Statistics", "Probability"],
        syllabus: [
          { unit: "Unit 1 – Number Systems",           topics: ["Real Numbers", "Irrational Numbers", "Laws of Exponents"] },
          { unit: "Unit 2 – Algebra",                  topics: ["Polynomials", "Linear Equations in Two Variables"] },
          { unit: "Unit 3 – Geometry",                 topics: ["Lines & Angles", "Triangles", "Quadrilaterals", "Circles"] },
          { unit: "Unit 4 – Mensuration",              topics: ["Areas", "Surface Areas & Volumes"] },
          { unit: "Unit 5 – Statistics & Probability", topics: ["Statistics", "Probability"] },
        ],
      },
      { name: "Science", icon: FlaskConical, stream: "all",
        chapters: ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms & Molecules", "Structure of Atom", "Cell – The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Motion", "Force & Laws of Motion", "Gravitation", "Work & Energy", "Sound", "Natural Resources"],
        syllabus: [
          { unit: "Unit 1 – Matter",                       topics: ["Matter in our Surroundings", "Is Matter Pure?", "Atoms & Molecules", "Structure of Atom"] },
          { unit: "Unit 2 – Organization in Living World", topics: ["Cell: Basic Unit", "Tissues", "Diversity in Living Organisms"] },
          { unit: "Unit 3 – Motion, Force & Work",         topics: ["Motion", "Force & Newton's Laws", "Gravitation", "Work & Energy", "Sound"] },
          { unit: "Unit 4 – Natural Resources",            topics: ["Natural Resources", "Improvement in Food Resources"] },
        ],
      },
      { name: "Social Science", icon: Globe, stream: "all",
        chapters: ["The French Revolution", "Socialism in Europe & the Russian Revolution", "Nazism & the Rise of Hitler", "Forest Society & Colonialism", "Pastoralists in the Modern World", "India – Size & Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation & Wildlife", "What is Democracy?", "Constitutional Design", "The Story of Village Palampur"],
        syllabus: [
          { unit: "History – India & the Contemporary World I", topics: ["French Revolution", "Socialism in Europe", "Nazism & Rise of Hitler", "Forest Society", "Pastoralists"] },
          { unit: "Geography – Contemporary India I",           topics: ["India: Size & Location", "Physical Features", "Drainage", "Climate", "Natural Vegetation"] },
          { unit: "Civics – Democratic Politics I",             topics: ["What is Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions"] },
          { unit: "Economics",                                  topics: ["Village Palampur", "People as Resource", "Poverty as Challenge", "Food Security"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Snake & the Mirror", "My Childhood", "Packing", "The Bond of Love", "Reach for the Top", "The Lost Child", "Adventures of Toto", "Iswaran the Storyteller"],
        syllabus: [
          { unit: "Reading",               topics: ["Unseen Passages", "Note Making"] },
          { unit: "Writing",               topics: ["Formal Letters", "Story Writing", "Descriptive Paragraphs"] },
          { unit: "Grammar",               topics: ["Tenses", "Modals", "Voice", "Clauses"] },
          { unit: "Literature – Beehive",  topics: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind"] },
          { unit: "Literature – Moments",  topics: ["The Lost Child", "Adventures of Toto", "Iswaran the Storyteller"] },
        ],
      },
      { name: "Hindi", icon: Languages, stream: "all",
        chapters: ["Do Bailon Ki Katha", "Lhasa Ki Or", "Upbhoktavad Ki Sanskriti", "Sakhiyan Evam Sabad", "Vakh", "Savaiye", "Kaidi aur Kokila", "Gram Shree", "Megh Aaye"],
        syllabus: [
          { unit: "Kshitij – Prose",  topics: ["Do Bailon Ki Katha", "Lhasa Ki Or", "Upbhoktavad Ki Sanskriti", "Sanwle Sapnon Ki Yaad"] },
          { unit: "Kshitij – Poetry", topics: ["Sakhiyan Evam Sabad", "Vakh", "Savaiye", "Kaidi aur Kokila", "Gram Shree", "Megh Aaye"] },
          { unit: "Grammar",          topics: ["Word Study", "Sentence Study", "Unseen Passage"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 10, label: "Class 10", tagline: "Board Exam Year – Make It Count",
    streams: null,
    description: "Class 10 is the most crucial milestone in school education. CBSE Board Exams determine your academic trajectory. Dedicated preparation, conceptual clarity, and consistent practice across all subjects is essential.",
    highlights: ["CBSE Board Examination", "Real Numbers & Polynomials", "Chemical Reactions", "India & its Neighbours"],
    subjects: [
      { name: "Mathematics", icon: Calculator, stream: "all",
        chapters: ["Real Numbers", "Polynomials", "Pair of Linear Equations", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Applications of Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas & Volumes", "Statistics", "Probability"],
        syllabus: [
          { unit: "Unit 1 – Number Systems",           topics: ["Real Numbers", "Euclid's Division Lemma", "Fundamental Theorem of Arithmetic"] },
          { unit: "Unit 2 – Algebra",                  topics: ["Polynomials", "Pair of Linear Equations", "Quadratic Equations", "Arithmetic Progressions"] },
          { unit: "Unit 3 – Geometry",                 topics: ["Triangles", "Circles", "Constructions"] },
          { unit: "Unit 4 – Trigonometry",             topics: ["Intro to Trigonometry", "Trigonometric Identities", "Heights & Distances"] },
          { unit: "Unit 5 – Statistics & Probability", topics: ["Statistics", "Probability"] },
        ],
      },
      { name: "Science", icon: FlaskConical, stream: "all",
        chapters: ["Chemical Reactions & Equations", "Acids, Bases & Salts", "Metals & Non-metals", "Carbon & its Compounds", "Life Processes", "Control & Coordination", "How Do Organisms Reproduce?", "Heredity & Evolution", "Light – Reflection & Refraction", "Human Eye & Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"],
        syllabus: [
          { unit: "Chemical Substances",  topics: ["Chemical Reactions", "Acids, Bases & Salts", "Metals & Non-metals", "Carbon & its Compounds", "Periodic Classification"] },
          { unit: "World of Living",       topics: ["Life Processes", "Control & Coordination", "How do Organisms Reproduce", "Heredity & Evolution"] },
          { unit: "Natural Phenomena",    topics: ["Light – Reflection & Refraction", "Human Eye"] },
          { unit: "Effects of Current",   topics: ["Electricity", "Magnetic Effects of Current"] },
          { unit: "Natural Resources",    topics: ["Our Environment", "Sustainable Management"] },
        ],
      },
      { name: "Social Science", icon: Globe, stream: "all",
        chapters: ["Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "Age of Industrialisation", "Print Culture & Modern World", "Resources & Development", "Forest & Wildlife Resources", "Water Resources", "Agriculture", "Minerals & Energy Resources", "Power Sharing", "Federalism", "Political Parties", "Outcomes of Democracy", "Development", "Sectors of Economy"],
        syllabus: [
          { unit: "History – India & Contemporary World II", topics: ["Nationalism in Europe", "Nationalism in India", "Making of Global World", "Age of Industrialisation", "Print Culture"] },
          { unit: "Geography – Contemporary India II",       topics: ["Resources & Development", "Forest & Wildlife", "Water Resources", "Agriculture", "Minerals & Energy"] },
          { unit: "Civics – Democratic Politics II",         topics: ["Power Sharing", "Federalism", "Gender, Religion & Caste", "Political Parties", "Outcomes of Democracy"] },
          { unit: "Economics",                               topics: ["Development", "Sectors of Economy", "Money & Credit", "Globalisation"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["A Letter to God", "Nelson Mandela", "Two Stories About Flying", "From the Diary of Anne Frank", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "A Triumph of Surgery", "The Thief's Story", "The Midnight Visitor", "A Question of Trust", "Footprints Without Feet"],
        syllabus: [
          { unit: "Reading",                    topics: ["Factual Passages", "Discursive Passages"] },
          { unit: "Writing",                    topics: ["Formal Letters", "Analytical Paragraphs", "Emails"] },
          { unit: "Grammar",                    topics: ["Tenses", "Modals", "Subject-Verb Agreement", "Reported Speech"] },
          { unit: "Literature – First Flight",  topics: ["A Letter to God", "Nelson Mandela", "Two Stories About Flying", "Diary of Anne Frank"] },
          { unit: "Literature – Footprints",    topics: ["A Triumph of Surgery", "The Thief's Story", "The Midnight Visitor", "A Question of Trust"] },
        ],
      },
      { name: "Hindi", icon: Languages, stream: "all",
        chapters: ["Netaji Ka Chashma", "Balgobin Bhagat", "Lakhnavee Andaz", "Maanviya Karuna Ki Divya Chamak", "Surdas", "Tulsidas", "Dev", "Jaishankar Prasad", "Suryakant Tripathi Nirala"],
        syllabus: [
          { unit: "Prose",   topics: ["Netaji Ka Chashma", "Balgobin Bhagat", "Lakhnavee Andaz", "Maanviya Karuna Ki Divya Chamak"] },
          { unit: "Poetry",  topics: ["Surdas", "Tulsidas", "Dev", "Jaishankar Prasad", "Suryakant Tripathi"] },
          { unit: "Grammar", topics: ["Voice (Vachya)", "Pad Parichay", "Ras", "Alankar"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 11, label: "Class 11", tagline: "Stream Selection & Deep Learning",
    streams: ["Science", "Commerce", "Arts"],
    description: "Class 11 marks a turning point — stream-specific deep learning begins. College-level concepts demand independent thinking, problem-solving, and deeper understanding across Science, Commerce, or Arts.",
    highlights: ["Stream-specific Deep Learning", "Physics, Chemistry & Biology", "Accountancy & Economics", "Advanced Mathematics"],
    subjects: [
      // SCIENCE STREAM
      { name: "Physics",    icon: Atom,         stream: "Science",
        chapters: ["Units & Measurement", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy & Power", "System of Particles", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"],
        syllabus: [
          { unit: "Unit 1 – Physical World & Measurement", topics: ["Physical World", "Units & Measurements"] },
          { unit: "Unit 2 – Kinematics",                   topics: ["Motion in a Straight Line", "Motion in a Plane"] },
          { unit: "Unit 3 – Laws of Motion",               topics: ["Newton's Laws", "Friction", "Circular Motion"] },
          { unit: "Unit 4 – Work, Energy & Power",         topics: ["Work-Energy Theorem", "Conservation of Energy", "Collisions"] },
          { unit: "Unit 5 – Thermodynamics",               topics: ["Thermal Properties", "Thermodynamics Laws", "Kinetic Theory"] },
          { unit: "Unit 6 – Oscillations & Waves",         topics: ["Oscillations", "Waves"] },
        ],
      },
      { name: "Chemistry",  icon: FlaskConical, stream: "Science",
        chapters: ["Some Basic Concepts", "Structure of Atom", "Classification of Elements", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions", "Hydrogen", "s-Block Elements", "p-Block Elements", "Organic Chemistry Basics", "Hydrocarbons", "Environmental Chemistry"],
        syllabus: [
          { unit: "Unit 1 – Basic Concepts",    topics: ["Mole Concept", "Stoichiometry", "Atomic Structure", "Chemical Bonding"] },
          { unit: "Unit 2 – States of Matter",  topics: ["Gases", "Liquids", "Solids"] },
          { unit: "Unit 3 – Equilibrium",       topics: ["Chemical Equilibrium", "Ionic Equilibrium", "Acids & Bases"] },
          { unit: "Unit 4 – Organic Chemistry", topics: ["Basics of Organic Chemistry", "Hydrocarbons"] },
        ],
      },
      { name: "Mathematics", icon: Calculator,  stream: "Science",
        chapters: ["Sets", "Relations & Functions", "Trigonometric Functions", "Complex Numbers", "Linear Inequalities", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series", "Straight Lines", "Conic Sections", "Introduction to 3D Geometry", "Limits & Derivatives", "Statistics", "Probability"],
        syllabus: [
          { unit: "Unit 1 – Sets & Functions",        topics: ["Sets", "Relations & Functions", "Trigonometric Functions"] },
          { unit: "Unit 2 – Algebra",                 topics: ["Complex Numbers", "Linear Inequalities", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series"] },
          { unit: "Unit 3 – Coordinate Geometry",     topics: ["Straight Lines", "Conic Sections", "3D Geometry Intro"] },
          { unit: "Unit 4 – Calculus",                topics: ["Limits & Derivatives"] },
          { unit: "Unit 5 – Statistics & Probability",topics: ["Statistics", "Probability"] },
        ],
      },
      { name: "Biology",    icon: Microscope,   stream: "Science",
        chapters: ["Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals", "Cell: Unit of Life", "Biomolecules", "Cell Cycle & Division", "Transport in Plants", "Mineral Nutrition", "Photosynthesis", "Respiration in Plants", "Plant Growth & Development", "Digestion & Absorption", "Breathing & Exchange of Gases", "Body Fluids & Circulation", "Excretory Products & Elimination", "Locomotion & Movement", "Neural Control & Coordination", "Chemical Coordination & Integration"],
        syllabus: [
          { unit: "Unit 1 – Diversity in Living World",  topics: ["Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"] },
          { unit: "Unit 2 – Structural Organization",    topics: ["Morphology of Flowering Plants", "Anatomy of Plants", "Animal Tissues"] },
          { unit: "Unit 3 – Cell",                       topics: ["Cell: Unit of Life", "Biomolecules", "Cell Cycle & Division"] },
          { unit: "Unit 4 – Plant Physiology",           topics: ["Photosynthesis", "Respiration in Plants", "Plant Growth"] },
          { unit: "Unit 5 – Human Physiology",           topics: ["Digestion", "Breathing & Exchange", "Body Fluids", "Excretion"] },
        ],
      },
      // COMMERCE STREAM
      { name: "Accountancy",     icon: BarChart,    stream: "Commerce",
        chapters: ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Transactions I", "Recording of Transactions II", "Bank Reconciliation Statement", "Trial Balance & Rectification of Errors", "Depreciation, Provisions & Reserves", "Bills of Exchange", "Financial Statements I", "Financial Statements II", "Accounts from Incomplete Records", "Applications of Computers in Accounting"],
        syllabus: [
          { unit: "Part A – Financial Accounting I",  topics: ["Meaning & Objectives of Accounting", "Accounting Principles", "Recording Transactions", "Trial Balance", "Financial Statements"] },
          { unit: "Part B – Financial Accounting II", topics: ["Depreciation", "Provisions & Reserves", "Bills of Exchange", "Bank Reconciliation"] },
        ],
      },
      { name: "Business Studies", icon: TrendingUp, stream: "Commerce",
        chapters: ["Business, Trade & Commerce", "Forms of Business Organisation", "Private, Public & Global Enterprises", "Business Services", "Emerging Modes of Business", "Social Responsibilities & Ethics", "Formation of a Company", "Sources of Business Finance", "Small Business", "Internal Trade", "International Business I"],
        syllabus: [
          { unit: "Part I – Foundation of Business",        topics: ["Nature & Purpose of Business", "Forms of Business", "Public Enterprises", "Business Services"] },
          { unit: "Part II – Finance & Trade",              topics: ["Sources of Finance", "Internal Trade", "International Business"] },
        ],
      },
      { name: "Economics",       icon: BarChart2,   stream: "Commerce",
        chapters: ["Introduction to Statistics", "Collection of Data", "Organisation of Data", "Presentation of Data", "Measures of Central Tendency", "Measures of Dispersion", "Correlation", "Introduction to Index Numbers", "Indian Economy on Eve of Independence", "Economic Reforms since 1991", "Human Capital Formation in India", "Rural Development", "Employment – Growth, Informalisation & Other Issues", "Infrastructure", "Environment & Sustainable Development"],
        syllabus: [
          { unit: "Statistics for Economics", topics: ["Collection & Organisation of Data", "Presentation", "Central Tendency", "Dispersion", "Correlation", "Index Numbers"] },
          { unit: "Indian Economic Development", topics: ["Indian Economy Pre-Independence", "Post-1991 Reforms", "Human Capital", "Rural Development", "Employment", "Infrastructure"] },
        ],
      },
      // ARTS STREAM
      { name: "History",              icon: BookMarked, stream: "Arts",
        chapters: ["Writing & City Life (Mesopotamia)", "An Empire Across Three Continents (Roman Empire)", "Nomadic Empires", "The Three Orders (Medieval Europe)", "Changing Cultural Traditions", "Displacing Indigenous Peoples", "Paths to Modernisation"],
        syllabus: [
          { unit: "Themes in World History I", topics: ["Early Cities", "Roman Empire", "Nomadic Empires", "Medieval Europe", "Renaissance", "Age of Exploration"] },
        ],
      },
      { name: "Political Science",    icon: Shield,     stream: "Arts",
        chapters: ["Political Theory: An Introduction", "Freedom", "Equality", "Social Justice", "Rights", "Citizenship", "Nationalism", "Secularism", "Peace", "Development"],
        syllabus: [
          { unit: "Political Theory",  topics: ["Freedom", "Equality", "Social Justice", "Rights", "Citizenship", "Nationalism", "Secularism", "Peace", "Development"] },
        ],
      },
      { name: "Geography",            icon: Globe,      stream: "Arts",
        chapters: ["Geography as a Discipline", "The Earth", "Interior of the Earth", "Distribution of Oceans & Continents", "Minerals & Rocks", "Geomorphic Processes", "Landforms & their Evolution", "Atmosphere", "Solar Radiation", "Atmospheric Circulation", "Water in Atmosphere", "World Climate & Climate Change", "Water (Oceans)", "Movements of Ocean Water"],
        syllabus: [
          { unit: "Part A – Physical Geography",  topics: ["Earth's Interior", "Oceans & Continents", "Geomorphic Processes", "Atmosphere", "Climate", "Ocean Movements"] },
        ],
      },
      { name: "English",              icon: BookOpen,   stream: "all",
        chapters: ["The Portrait of a Lady", "We're Not Afraid to Die", "Discovering Tut", "The Laburnum Top", "A Photograph", "The Voice of the Rain", "The Ailing Planet", "The Browning Version", "Mothers Day", "Birth", "The Adventure"],
        syllabus: [
          { unit: "Reading",    topics: ["Unseen Passages", "Note Making & Summarizing"] },
          { unit: "Writing",    topics: ["Notice Writing", "Letter Writing", "Article/Speech Writing"] },
          { unit: "Grammar",    topics: ["Narration", "Voice", "Modals", "Punctuation"] },
          { unit: "Literature – Hornbill", topics: ["The Portrait of a Lady", "We're Not Afraid to Die", "Discovering Tut", "The Ailing Planet"] },
          { unit: "Literature – Snapshots", topics: ["The Summer of the Beautiful White Horse", "The Address", "Mother's Day", "Birth"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
  {
    id: 12, label: "Class 12", tagline: "Board Exam + JEE/NEET/CUET Prep",
    streams: ["Science", "Commerce", "Arts"],
    description: "Class 12 is the ultimate milestone — board results, JEE/NEET/CUET performance, and college applications converge. Peak academic performance, strategic preparation, and focused revision are essential.",
    highlights: ["CBSE Board Exams", "JEE/NEET Preparation", "CUET Readiness", "College Applications"],
    subjects: [
      { name: "Physics",    icon: Atom,         stream: "Science",
        chapters: ["Electric Charges & Fields", "Electrostatic Potential & Capacitance", "Current Electricity", "Moving Charges & Magnetism", "Magnetism & Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics", "Wave Optics", "Dual Nature of Radiation & Matter", "Atoms", "Nuclei", "Semiconductor Electronics"],
        syllabus: [
          { unit: "Unit 1 – Electrostatics",      topics: ["Electric Charges & Fields", "Electrostatic Potential", "Capacitance"] },
          { unit: "Unit 2 – Current Electricity",  topics: ["Current, Resistance, EMF", "Kirchhoff's Laws", "Wheatstone Bridge"] },
          { unit: "Unit 3 – Magnetic Effects",     topics: ["Moving Charges & Magnetism", "Magnetism & Matter", "EMI", "AC"] },
          { unit: "Unit 4 – Optics",               topics: ["Ray Optics", "Wave Optics"] },
          { unit: "Unit 5 – Modern Physics",       topics: ["Dual Nature of Radiation", "Atoms", "Nuclei", "Semiconductors"] },
        ],
      },
      { name: "Chemistry",  icon: FlaskConical, stream: "Science",
        chapters: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principles & Processes of Isolation of Elements", "p-Block Elements", "d & f Block Elements", "Coordination Compounds", "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers", "Aldehydes, Ketones & Carboxylic Acids", "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"],
        syllabus: [
          { unit: "Unit 1 – Solid State & Solutions",    topics: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics"] },
          { unit: "Unit 2 – Surface Chemistry & Metals", topics: ["Surface Chemistry", "General Principles", "p,d,f Block Elements", "Coordination Compounds"] },
          { unit: "Unit 3 – Organic Chemistry",          topics: ["Haloalkanes", "Alcohols", "Aldehydes & Ketones", "Carboxylic Acids", "Amines"] },
          { unit: "Unit 4 – Biochemistry",               topics: ["Biomolecules", "Polymers", "Chemistry in Everyday Life"] },
        ],
      },
      { name: "Mathematics", icon: Calculator,  stream: "Science",
        chapters: ["Relations & Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity & Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vectors", "Three Dimensional Geometry", "Linear Programming", "Probability"],
        syllabus: [
          { unit: "Unit 1 – Relations & Functions",            topics: ["Relations & Functions", "Inverse Trigonometric Functions"] },
          { unit: "Unit 2 – Algebra",                          topics: ["Matrices", "Determinants"] },
          { unit: "Unit 3 – Calculus",                         topics: ["Continuity & Differentiability", "Applications of Derivatives", "Integrals", "Differential Equations"] },
          { unit: "Unit 4 – Vectors & 3D",                     topics: ["Vectors", "3D Geometry"] },
          { unit: "Unit 5 – Linear Programming & Probability", topics: ["Linear Programming", "Probability"] },
        ],
      },
      { name: "Biology",    icon: Microscope,   stream: "Science",
        chapters: ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance & Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health & Disease", "Microbes in Human Welfare", "Biotechnology Principles & Processes", "Biotechnology & its Applications", "Organisms & Populations", "Ecosystem", "Biodiversity & Conservation", "Environmental Issues"],
        syllabus: [
          { unit: "Unit 1 – Reproduction",             topics: ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health"] },
          { unit: "Unit 2 – Genetics & Evolution",     topics: ["Principles of Inheritance", "Molecular Basis of Inheritance", "Evolution"] },
          { unit: "Unit 3 – Biology in Human Welfare", topics: ["Human Health & Disease", "Microbes in Human Welfare"] },
          { unit: "Unit 4 – Biotechnology",            topics: ["Principles of Biotechnology", "Biotechnology & its Applications"] },
          { unit: "Unit 5 – Ecology",                  topics: ["Organisms & Populations", "Ecosystem", "Biodiversity", "Environmental Issues"] },
        ],
      },
      { name: "Accountancy",     icon: BarChart,    stream: "Commerce",
        chapters: ["Accounting for Not-for-Profit Organisation", "Accounting for Partnership: Basic Concepts", "Reconstitution of Partnership", "Dissolution of Partnership Firm", "Accounting for Share Capital", "Issue & Redemption of Debentures", "Financial Statements of a Company", "Analysis of Financial Statements", "Accounting Ratios", "Cash Flow Statement"],
        syllabus: [
          { unit: "Part A – Partnership Accounts", topics: ["Not-for-Profit Organisations", "Partnership Basics", "Reconstitution", "Dissolution"] },
          { unit: "Part B – Company Accounts",     topics: ["Share Capital", "Debentures", "Financial Statements", "Analysis & Ratios", "Cash Flow"] },
        ],
      },
      { name: "Business Studies", icon: TrendingUp, stream: "Commerce",
        chapters: ["Nature & Significance of Management", "Principles of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Financial Management", "Financial Markets", "Marketing Management", "Consumer Protection", "Entrepreneurship Development"],
        syllabus: [
          { unit: "Part I – Principles & Functions of Management", topics: ["Nature of Management", "Principles", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling"] },
          { unit: "Part II – Business Finance & Marketing",        topics: ["Financial Management", "Financial Markets", "Marketing", "Consumer Protection"] },
        ],
      },
      { name: "Economics",       icon: BarChart2,   stream: "Commerce",
        chapters: ["Introduction to Macro Economics", "National Income Accounting", "Money & Banking", "Determination of Income & Employment", "Government Budget & the Economy", "Open Economy Macroeconomics", "Development Experience of India", "Economic Reforms since 1991", "Current Challenges facing Indian Economy"],
        syllabus: [
          { unit: "Macro Economics",             topics: ["National Income", "Money & Banking", "Income Determination", "Government Budget", "Open Economy"] },
          { unit: "Indian Economic Development", topics: ["Development Experience", "Post-1991 Reforms", "Current Challenges"] },
        ],
      },
      { name: "History",           icon: BookMarked, stream: "Arts",
        chapters: ["Bricks, Beads & Bones (Harappan Civilisation)", "Kings, Farmers & Towns", "Kinship, Caste & Class", "Thinkers, Beliefs & Buildings", "Through the Eyes of Travellers", "Bhakti-Sufi Traditions", "An Imperial Capital: Vijayanagara", "Peasants, Zamindars & the State", "Kings & Chronicles (Mughal Court)", "Colonialism & the Countryside", "Rebels & the Raj", "Colonial Cities", "Mahatma Gandhi & Nationalist Movement", "Understanding Partition", "Framing the Constitution"],
        syllabus: [
          { unit: "Themes in Indian History I",   topics: ["Harappan Civilisation", "Kings, Farmers & Towns", "Kinship, Caste & Class", "Thinkers & Beliefs"] },
          { unit: "Themes in Indian History II",  topics: ["Travellers' Accounts", "Bhakti-Sufi Traditions", "Vijayanagara", "Mughal Court"] },
          { unit: "Themes in Indian History III", topics: ["Colonialism", "Rebels & Raj", "Colonial Cities", "Gandhi", "Partition", "Constitution"] },
        ],
      },
      { name: "Political Science",  icon: Shield,     stream: "Arts",
        chapters: ["The Cold War Era", "The End of Bipolarity", "US Hegemony in World Politics", "Alternative Centres of Power", "Contemporary South Asia", "International Organisations", "Security in Contemporary World", "Environment & Natural Resources", "Globalisation", "Challenges of Nation-Building", "Era of One-Party Dominance", "Politics of Planned Development", "India's External Relations", "Challenges to & Restoration of Congress System", "Crisis of Democratic Order", "Rise of Popular Movements", "Regional Aspirations", "Recent Developments in Indian Politics"],
        syllabus: [
          { unit: "Contemporary World Politics", topics: ["Cold War Era", "End of Bipolarity", "US Hegemony", "Alternative Centres", "South Asia", "International Organisations", "Security", "Environment", "Globalisation"] },
          { unit: "Politics in India since Independence", topics: ["Nation Building", "One-Party Dominance", "Planned Development", "External Relations", "Congress System", "Democratic Order", "Popular Movements", "Regional Aspirations", "Recent Developments"] },
        ],
      },
      { name: "Geography",         icon: Globe,      stream: "Arts",
        chapters: ["Human Geography: Nature & Scope", "The World Population", "Population Composition", "Human Development", "Primary Activities", "Secondary Activities", "Tertiary & Quaternary Activities", "Transport & Communication", "International Trade", "Human Settlements", "Population of India", "Migration in India", "Human Development (India)", "Human Settlements (India)", "Land Resources & Agriculture", "Water Resources", "Mineral & Energy Resources", "Manufacturing Industries", "Planning & Sustainable Development", "Transport & Communication (India)", "International Trade (India)"],
        syllabus: [
          { unit: "Part A – Fundamentals of Human Geography", topics: ["Human Geography", "World Population", "Human Development", "Activities", "Transport", "International Trade"] },
          { unit: "Part B – India: People & Economy",         topics: ["Population", "Migration", "Human Development", "Resources", "Agriculture", "Industries", "Planning & Transport"] },
        ],
      },
      { name: "English",           icon: BookOpen,   stream: "all",
        chapters: ["The Last Lesson", "Lost Spring", "Deep Water", "The Rattrap", "Indigo", "Poets & Pancakes", "The Interview", "Going Places", "My Mother at Sixty-six", "An Elementary School Classroom in a Slum", "Keeping Quiet", "A Thing of Beauty", "A Roadside Stand", "Aunt Jennifer's Tigers"],
        syllabus: [
          { unit: "Reading",                 topics: ["Unseen Passages", "Note Making"] },
          { unit: "Writing",                 topics: ["Notice", "Advertisement", "Letter", "Article", "Report"] },
          { unit: "Grammar",                 topics: ["Gap Filling", "Editing", "Omission", "Sentence Reordering"] },
          { unit: "Literature – Flamingo",   topics: ["The Last Lesson", "Lost Spring", "Deep Water", "The Rattrap", "Indigo", "Poets & Pancakes"] },
          { unit: "Literature – Vistas",     topics: ["The Third Level", "The Tiger King", "Journey to the End of the Earth", "The Enemy"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  BIHAR BOARD (BSEB)
// ─────────────────────────────────────────────────────────────────────────────
const BIHAR_CLASSES = [
  {
    id: 9, label: "Class 9", tagline: "BSEB Foundation Year",
    streams: null,
    description: "Bihar Board Class 9 follows SCERT Bihar curriculum. This year builds core concepts in Mathematics, Science, Social Science, and languages that form the foundation for Class 10 Matric examinations.",
    highlights: ["BSEB SCERT Curriculum", "Hindi Medium Focus", "Practical Science", "Sanskrit Option"],
    subjects: [
      { name: "Mathematics", icon: Calculator, stream: "all",
        chapters: ["Number System", "Polynomial", "Linear Equations in Two Variables", "Co-ordinate Geometry", "Introduction to Euclid's Geometry", "Lines & Angles", "Triangle", "Quadrilateral", "Circles", "Heron's Formula", "Surface Area & Volume", "Statistics", "Probability"],
        syllabus: [
          { unit: "Unit 1 – Number System",      topics: ["Real Numbers", "Rational & Irrational Numbers", "Representation on Number Line"] },
          { unit: "Unit 2 – Algebra",             topics: ["Polynomials", "Linear Equations"] },
          { unit: "Unit 3 – Geometry",            topics: ["Euclid's Geometry", "Lines & Angles", "Triangles", "Quadrilaterals", "Circles"] },
          { unit: "Unit 4 – Mensuration",         topics: ["Area", "Surface Area", "Volume"] },
          { unit: "Unit 5 – Statistics",          topics: ["Data Collection", "Bar Graphs", "Mean, Median, Mode"] },
        ],
      },
      { name: "Science", icon: FlaskConical, stream: "all",
        chapters: ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms & Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Why Do We Fall Ill?", "Natural Resources", "Improvement in Food Resources", "Motion", "Force & Laws of Motion", "Gravitation", "Work & Energy", "Sound"],
        syllabus: [
          { unit: "Chemistry",   topics: ["Matter", "Atoms & Molecules", "Chemical Reactions"] },
          { unit: "Biology",     topics: ["Cell", "Tissues", "Living Organisms", "Health & Disease"] },
          { unit: "Physics",     topics: ["Motion", "Force", "Gravitation", "Work, Energy & Sound"] },
        ],
      },
      { name: "Social Science", icon: Globe, stream: "all",
        chapters: ["French Revolution", "Russian Revolution & Socialism", "Rise of Nazism", "Forest & Wildlife", "Physical Features of Bihar", "Climate of Bihar", "What is Democracy?", "Story of Village Palampur", "Poverty in Bihar"],
        syllabus: [
          { unit: "History",     topics: ["French Revolution", "Russian Revolution", "Rise of Nazism", "Forest & Tribals"] },
          { unit: "Geography",   topics: ["Physical Features", "Climate", "Natural Resources of Bihar"] },
          { unit: "Civics",      topics: ["Democracy", "Constitutional Design", "State Government"] },
          { unit: "Economics",   topics: ["Village Economy", "Poverty", "Food Security in Bihar"] },
        ],
      },
      { name: "Hindi", icon: Languages, stream: "all",
        chapters: ["Dukh Ka Adhikar", "Hamid Khan", "Do Bailon Ki Katha", "Lakhnavi Andaz", "Sal Ki Aakhiri Sheekh", "Ek Kutta Aur Ek Maina", "Sakhiyan Evam Sabad", "Vakh", "Savaiye", "Kaidi Aur Kokila", "Megh Aaye"],
        syllabus: [
          { unit: "Gadya Khand (Prose)",  topics: ["Dukh Ka Adhikar", "Hamid Khan", "Do Bailon Ki Katha"] },
          { unit: "Padya Khand (Poetry)", topics: ["Sakhiyan evam Sabad", "Vakh", "Savaiye", "Megh Aaye"] },
          { unit: "Vyakaran (Grammar)",   topics: ["Sangya", "Sarvnam", "Sandhi", "Alankar", "Nibandh Lekhan"] },
        ],
      },
      { name: "Sanskrit", icon: BookMarked, stream: "all",
        chapters: ["Mangalacharanam", "Bhoomiputra", "Dhanaanjayah", "Shashvati Pratishtham Labhate", "Saubhagyam", "Rajniti", "Virabandhun Padam", "Subhashitani"],
        syllabus: [
          { unit: "Gadya",    topics: ["Prose Passages", "Comprehension"] },
          { unit: "Padya",    topics: ["Poetry Explanation", "Shloka Memorization"] },
          { unit: "Vyakaran", topics: ["Sandhi", "Samas", "Dhatu Roop", "Shabd Roop", "Translation"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 10, label: "Class 10", tagline: "BSEB Matric Board Exam",
    streams: null,
    description: "Bihar Board Class 10 (Matric) is a pivotal milestone. The BSEB Matric examinations determine your stream selection for Intermediate (Class 11-12). Comprehensive preparation is essential for all subjects.",
    highlights: ["BSEB Matric Examination", "All Bihar State Ranking", "Stream Selection Basis", "Practical Examinations"],
    subjects: [
      { name: "Mathematics", icon: Calculator, stream: "all",
        chapters: ["Real Numbers", "Polynomials", "Pair of Linear Equations", "Quadratic Equations", "Arithmetic Progression", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas & Volumes", "Statistics", "Probability"],
        syllabus: [
          { unit: "Unit 1 – Real Numbers",       topics: ["Euclid's Division Algorithm", "Fundamental Theorem of Arithmetic", "Irrational Numbers", "Decimal Expansions"] },
          { unit: "Unit 2 – Algebra",             topics: ["Polynomials", "Linear Equations", "Quadratic Equations", "AP"] },
          { unit: "Unit 3 – Geometry",            topics: ["Similar Triangles", "Circles", "Tangents"] },
          { unit: "Unit 4 – Trigonometry",        topics: ["Trigonometric Ratios", "Identities", "Heights & Distances"] },
          { unit: "Unit 5 – Mensuration",         topics: ["Areas of Circles", "Surface Areas & Volumes"] },
          { unit: "Unit 6 – Statistics",          topics: ["Mean, Median, Mode", "Cumulative Frequency", "Probability"] },
        ],
      },
      { name: "Science", icon: FlaskConical, stream: "all",
        chapters: ["Chemical Reactions & Equations", "Acids, Bases & Salts", "Metals & Non-Metals", "Carbon & its Compounds", "Periodic Classification of Elements", "Life Processes", "Control & Coordination", "How Do Organisms Reproduce?", "Heredity & Evolution", "Light – Reflection & Refraction", "Human Eye & Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy", "Our Environment", "Management of Natural Resources"],
        syllabus: [
          { unit: "Chemistry",         topics: ["Chemical Reactions", "Acids, Bases & Salts", "Metals & Non-metals", "Carbon Compounds", "Periodic Table"] },
          { unit: "Biology",           topics: ["Life Processes", "Control & Coordination", "Reproduction", "Heredity & Evolution"] },
          { unit: "Physics",           topics: ["Light", "Human Eye", "Electricity", "Magnetic Effects", "Energy Sources"] },
          { unit: "Environment",       topics: ["Our Environment", "Natural Resources Management"] },
        ],
      },
      { name: "Social Science", icon: Globe, stream: "all",
        chapters: ["Nationalism in Europe", "Nationalism in India", "Making of a Global World", "Age of Industrialisation", "Resources & Development", "Forest & Wildlife Resources", "Water Resources", "Agriculture", "Minerals & Energy Resources", "Manufacturing Industries", "Lifelines of National Economy", "Power Sharing", "Federalism", "Political Parties", "Outcomes of Democracy", "Development", "Money & Credit", "Globalisation"],
        syllabus: [
          { unit: "History",     topics: ["European Nationalism", "Indian Nationalism", "Globalisation", "Industrialisation"] },
          { unit: "Geography",   topics: ["Resources", "Agriculture", "Industries", "Transport"] },
          { unit: "Civics",      topics: ["Power Sharing", "Federalism", "Political Parties", "Democracy Outcomes"] },
          { unit: "Economics",   topics: ["Development", "Money & Credit", "Globalisation", "Consumer Rights"] },
        ],
      },
      { name: "Hindi", icon: Languages, stream: "all",
        chapters: ["Swar-Vyanjan", "Netaji Ka Chashma", "Balgobin Bhagat", "Lakhnavee Andaz", "Maanviya Karuna Ki Divya Chamak", "Surdas Ke Pad", "Tulsidas Ke Dohe", "Dev", "Jaishankar Prasad", "Suryakant Tripathi Nirala"],
        syllabus: [
          { unit: "Gadya (Prose)",     topics: ["Netaji Ka Chashma", "Balgobin Bhagat", "Lakhnavee Andaz"] },
          { unit: "Padya (Poetry)",    topics: ["Surdas", "Tulsidas", "Dev", "Prasad", "Nirala"] },
          { unit: "Vyakaran",          topics: ["Sandhi", "Samas", "Alankar", "Ras", "Letter Writing"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["A Letter to God", "Nelson Mandela – Long Walk to Freedom", "Two Stories About Flying", "From the Diary of Anne Frank", "A Triumph of Surgery", "The Thief's Story", "Footprints Without Feet"],
        syllabus: [
          { unit: "Reading",    topics: ["Comprehension Passages", "Note Making"] },
          { unit: "Writing",    topics: ["Letter Writing", "Paragraph Writing", "Essay Writing"] },
          { unit: "Grammar",    topics: ["Tenses", "Voice", "Narration", "Transformation"] },
          { unit: "Literature", topics: ["First Flight Chapters", "Footprints Stories"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 11, label: "Class 11", tagline: "BSEB Intermediate – First Year",
    streams: ["Science", "Commerce", "Arts"],
    description: "Bihar Board Intermediate (Class 11) — also called I.Sc / I.Com / I.A. Students select their stream based on Matric performance. BSEB follows NCERT pattern with state-specific additions.",
    highlights: ["BSEB Intermediate", "Stream-wise I.Sc/I.Com/I.A.", "State-level Competition", "NCERT + Bihar State Books"],
    subjects: [
      { name: "Physics",    icon: Atom,         stream: "Science",
        chapters: ["Physical World & Measurement", "Kinematics", "Laws of Motion", "Work, Energy & Power", "Motion of System of Particles", "Gravitation", "Properties of Bulk Matter", "Thermodynamics", "Oscillations & Waves"],
        syllabus: [
          { unit: "Unit 1 – Physical World",    topics: ["Nature of Physics", "Units & Dimensions"] },
          { unit: "Unit 2 – Kinematics",        topics: ["Straight Line Motion", "Projectile Motion", "Relative Motion"] },
          { unit: "Unit 3 – Laws of Motion",    topics: ["Newton's Laws", "Friction", "Dynamics of Circular Motion"] },
          { unit: "Unit 4 – Thermodynamics",    topics: ["Thermal Expansion", "Laws of Thermodynamics", "Kinetic Theory"] },
          { unit: "Unit 5 – Oscillations",      topics: ["SHM", "Oscillations of Spring", "Sound Waves"] },
        ],
      },
      { name: "Chemistry",  icon: FlaskConical, stream: "Science",
        chapters: ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements", "Chemical Bonding & Molecular Structure", "States of Matter", "Chemical Thermodynamics", "Equilibrium", "Redox Reactions", "Hydrogen", "The s-Block Elements", "Organic Chemistry", "Hydrocarbons"],
        syllabus: [
          { unit: "Physical Chemistry",  topics: ["Mole Concept", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Redox"] },
          { unit: "Inorganic Chemistry", topics: ["s-Block Elements", "Hydrogen", "Environmental Chemistry"] },
          { unit: "Organic Chemistry",   topics: ["IUPAC Nomenclature", "Hydrocarbons", "Reactions of Organic Compounds"] },
        ],
      },
      { name: "Mathematics", icon: Calculator,  stream: "Science",
        chapters: ["Sets", "Relations & Functions", "Trigonometric Functions", "Principle of Mathematical Induction", "Complex Numbers", "Linear Inequalities", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series", "Straight Lines", "Conic Sections", "3D Geometry", "Limits & Derivatives", "Mathematical Reasoning", "Statistics", "Probability"],
        syllabus: [
          { unit: "Algebra",               topics: ["Sets", "Relations", "Trigonometry", "Complex Numbers", "Induction"] },
          { unit: "Coordinate Geometry",   topics: ["Straight Lines", "Conic Sections", "3D Geometry Intro"] },
          { unit: "Calculus",              topics: ["Limits", "Derivatives"] },
          { unit: "Statistics",            topics: ["Measures of Dispersion", "Probability"] },
        ],
      },
      { name: "Biology",    icon: Microscope,   stream: "Science",
        chapters: ["Diversity in Living World", "Structural Organisation in Plants & Animals", "Cell: Structure & Function", "Plant Physiology", "Human Physiology"],
        syllabus: [
          { unit: "Diversity in Living World",      topics: ["Classification", "Plant Kingdom", "Animal Kingdom"] },
          { unit: "Structural Organisation",         topics: ["Morphology", "Anatomy", "Animal Tissues"] },
          { unit: "Cell Biology",                    topics: ["Cell Structure", "Biomolecules", "Cell Division"] },
          { unit: "Plant Physiology",                topics: ["Transport", "Photosynthesis", "Plant Growth"] },
          { unit: "Human Physiology",                topics: ["Digestion", "Respiration", "Circulation", "Excretion"] },
        ],
      },
      { name: "Accountancy",     icon: BarChart,    stream: "Commerce",
        chapters: ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Transactions", "Trial Balance", "Financial Statements", "Depreciation", "Bills of Exchange", "Bank Reconciliation"],
        syllabus: [
          { unit: "Part A – Basics",         topics: ["Introduction", "Theory Base", "Recording Transactions", "Trial Balance"] },
          { unit: "Part B – Financial A/C",  topics: ["Financial Statements", "Depreciation", "Bills of Exchange", "BRS"] },
        ],
      },
      { name: "Business Studies", icon: TrendingUp, stream: "Commerce",
        chapters: ["Business, Trade & Commerce", "Forms of Business Organisation", "Business Services", "Emerging Modes", "Social Responsibilities", "Formation of a Company", "Sources of Finance", "Internal Trade", "International Business"],
        syllabus: [
          { unit: "Foundation of Business",  topics: ["Nature & Purpose", "Forms of Organisation", "Services", "Responsibilities"] },
          { unit: "Finance & Trade",         topics: ["Sources of Finance", "Internal Trade", "International Business"] },
        ],
      },
      { name: "Economics",       icon: BarChart2,   stream: "Commerce",
        chapters: ["Introduction to Statistics", "Collection of Data", "Organisation of Data", "Presentation of Data", "Measures of Central Tendency", "Measures of Dispersion", "Indian Economy", "Economic Reforms"],
        syllabus: [
          { unit: "Statistics for Economics", topics: ["Data Collection & Organisation", "Presentation", "Central Tendency", "Dispersion"] },
          { unit: "Indian Economic Dev.",     topics: ["Indian Economy Pre-Independence", "Post-1991 Reforms", "Current Issues"] },
        ],
      },
      { name: "History",         icon: BookMarked, stream: "Arts",
        chapters: ["Early Societies", "Empire", "Changing Traditions", "Paths to Modernisation"],
        syllabus: [
          { unit: "World History – Part I", topics: ["Early Societies", "Empire Building", "Nomadic Empires", "Changing Traditions"] },
          { unit: "World History – Part II",topics: ["Industrial Revolution", "Colonialism", "Paths to Modernisation"] },
        ],
      },
      { name: "Political Science", icon: Shield, stream: "Arts",
        chapters: ["Political Theory", "Freedom", "Equality", "Social Justice", "Rights", "Citizenship", "Nationalism", "Secularism", "Development"],
        syllabus: [
          { unit: "Political Theory", topics: ["Political Theory Introduction", "Freedom", "Equality", "Social Justice", "Rights", "Secularism", "Nationalism", "Development"] },
        ],
      },
      { name: "Geography",        icon: Globe,     stream: "Arts",
        chapters: ["Geography as a Discipline", "The Earth", "Interior of the Earth", "Atmosphere", "Water", "Life on the Earth", "India – Location", "Structure of India", "Drainage System of India", "Climate of India", "Natural Vegetation of India"],
        syllabus: [
          { unit: "Physical Geography",        topics: ["Earth Interior", "Landforms", "Atmosphere", "Climate", "Ocean"] },
          { unit: "India – Physical Features", topics: ["Location", "Structure", "Drainage", "Climate", "Vegetation"] },
        ],
      },
      { name: "Hindi",   icon: Languages, stream: "all",
        chapters: ["Badalte Parivesh mein Stree", "Baat Sidhi Thi Par", "Saman", "Ek Kutta Aur Ek Maina", "Yahi Hai Zindagi", "Hanste Hue Mera Akelapan", "Bharat Maa"],
        syllabus: [
          { unit: "Gadya (Prose)",     topics: ["Essay", "Reportage", "Autobiography"] },
          { unit: "Padya (Poetry)",    topics: ["Modern Hindi Poetry", "Classical Poetry"] },
          { unit: "Vyakaran",          topics: ["Advanced Grammar", "Composition", "Translation"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["The Portrait of a Lady", "We're Not Afraid to Die", "A Photograph", "The Voice of the Rain", "The Laburnum Top", "Father to Son", "Mother's Day"],
        syllabus: [
          { unit: "Reading",    topics: ["Comprehension", "Note Making"] },
          { unit: "Writing",    topics: ["Letter Writing", "Essay", "Article"] },
          { unit: "Grammar",    topics: ["Tenses", "Voice", "Narration", "Clause Analysis"] },
          { unit: "Literature", topics: ["Hornbill Prose", "Hornbill Poetry", "Snapshots Supplementary"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
  {
    id: 12, label: "Class 12", tagline: "BSEB Intermediate – Final Board",
    streams: ["Science", "Commerce", "Arts"],
    description: "Bihar Board Intermediate (Class 12) Final Year. BSEB Board Examinations are conducted state-wide. Performance determines college admissions through BCECE (engineering/medical) and state university entrance tests.",
    highlights: ["BSEB Final Board Exam", "BCECE Engineering/Medical", "State University Admissions", "All Bihar Rank"],
    subjects: [
      { name: "Physics",    icon: Atom,         stream: "Science",
        chapters: ["Electric Charges & Fields", "Electrostatic Potential", "Current Electricity", "Moving Charges & Magnetism", "Magnetism", "EMI", "Alternating Current", "EM Waves", "Ray Optics", "Wave Optics", "Dual Nature", "Atoms", "Nuclei", "Semiconductors", "Communication Systems"],
        syllabus: [
          { unit: "Electrostatics",    topics: ["Coulomb's Law", "Electric Field", "Potential", "Capacitors"] },
          { unit: "Current",           topics: ["Ohm's Law", "Kirchhoff's Laws", "Wheatstone Bridge", "Potentiometer"] },
          { unit: "Magnetism & EMI",   topics: ["Biot-Savart Law", "Ampere's Law", "Faraday's Law", "AC Circuits"] },
          { unit: "Optics",            topics: ["Reflection", "Refraction", "Prism", "Wave Optics", "Diffraction"] },
          { unit: "Modern Physics",    topics: ["Photoelectric Effect", "Bohr Model", "Nuclear Reactions", "Semiconductors"] },
        ],
      },
      { name: "Chemistry",  icon: FlaskConical, stream: "Science",
        chapters: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "Isolation of Metals", "p-Block Elements", "d & f Block Elements", "Coordination Compounds", "Haloalkanes", "Alcohols & Phenols", "Aldehydes & Ketones", "Carboxylic Acids", "Amines", "Biomolecules", "Polymers", "Chemistry in Daily Life"],
        syllabus: [
          { unit: "Physical Chemistry",  topics: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry"] },
          { unit: "Inorganic Chemistry", topics: ["p-Block", "d & f Block", "Coordination Compounds", "Qualitative Analysis"] },
          { unit: "Organic Chemistry",   topics: ["Haloalkanes", "Alcohols", "Carbonyl Compounds", "Amines", "Biomolecules"] },
        ],
      },
      { name: "Mathematics", icon: Calculator,  stream: "Science",
        chapters: ["Relations & Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity & Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vectors", "3D Geometry", "Linear Programming", "Probability"],
        syllabus: [
          { unit: "Relations & Functions", topics: ["Functions", "Inverse Trigonometric Functions"] },
          { unit: "Algebra",               topics: ["Matrices", "Determinants"] },
          { unit: "Calculus",              topics: ["Differentiation", "Integration", "Differential Equations"] },
          { unit: "Vectors & 3D",          topics: ["Vector Algebra", "3D Geometry"] },
          { unit: "Linear Programming",    topics: ["LPP", "Graphical Method"] },
          { unit: "Probability",           topics: ["Bayes' Theorem", "Random Variables", "Binomial Distribution"] },
        ],
      },
      { name: "Biology",    icon: Microscope,   stream: "Science",
        chapters: ["Reproduction", "Genetics & Evolution", "Biology in Human Welfare", "Biotechnology", "Ecology"],
        syllabus: [
          { unit: "Reproduction",             topics: ["Plant Reproduction", "Human Reproduction", "Reproductive Health"] },
          { unit: "Genetics & Evolution",      topics: ["Mendelian Genetics", "DNA Structure", "Gene Expression", "Evolution"] },
          { unit: "Biology in Human Welfare",  topics: ["Health & Disease", "Microbes", "Immune System"] },
          { unit: "Biotechnology",             topics: ["rDNA Technology", "Genetically Modified Organisms", "Applications"] },
          { unit: "Ecology",                   topics: ["Ecosystem", "Biodiversity", "Environmental Issues"] },
        ],
      },
      { name: "Accountancy",    icon: BarChart,    stream: "Commerce",
        chapters: ["Partnership Accounts", "Reconstitution of Partnership", "Dissolution", "Share Capital", "Debentures", "Financial Statements", "Analysis of Financial Statements", "Cash Flow Statement"],
        syllabus: [
          { unit: "Partnership",      topics: ["Partnership Basics", "Reconstitution", "Dissolution"] },
          { unit: "Company Accounts", topics: ["Share Capital", "Debentures", "Financial Statements Analysis", "Cash Flow"] },
        ],
      },
      { name: "Business Studies", icon: TrendingUp, stream: "Commerce",
        chapters: ["Nature of Management", "Principles of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Financial Management", "Marketing"],
        syllabus: [
          { unit: "Management",          topics: ["Principles", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling"] },
          { unit: "Finance & Marketing", topics: ["Financial Management", "Financial Markets", "Marketing", "Consumer Protection"] },
        ],
      },
      { name: "Economics",      icon: BarChart2,   stream: "Commerce",
        chapters: ["Macro Economics Intro", "National Income", "Money & Banking", "Income Determination", "Government Budget", "Open Economy", "Development Experience", "Economic Reforms", "Current Challenges"],
        syllabus: [
          { unit: "Macro Economics",            topics: ["National Income", "Money & Banking", "Income Determination", "Fiscal Policy", "Open Economy"] },
          { unit: "Indian Economic Development",topics: ["Pre-Independence Economy", "Post-1991 Reforms", "Current Challenges"] },
        ],
      },
      { name: "History",          icon: BookMarked, stream: "Arts",
        chapters: ["Harappan Civilisation", "Kings, Farmers & Towns", "Kinship & Class", "Thinkers & Beliefs", "Bhakti Traditions", "Mughal Court", "Colonialism in the Countryside", "Nationalist Movement", "Partition", "Framing the Constitution"],
        syllabus: [
          { unit: "Ancient India",     topics: ["Harappan Civ", "Vedic Society", "Buddhism & Jainism", "Mahajanpadas"] },
          { unit: "Medieval India",    topics: ["Bhakti Movement", "Mughal Empire", "Regional Kingdoms"] },
          { unit: "Modern India",      topics: ["Colonialism", "Freedom Movement", "Partition", "Constitution"] },
        ],
      },
      { name: "Political Science", icon: Shield,   stream: "Arts",
        chapters: ["Cold War Era", "End of Bipolarity", "US Hegemony", "South Asia", "International Organisations", "Challenges of Nation Building", "Era of One-Party Dominance", "India's External Relations", "Rise of Popular Movements", "Recent Developments"],
        syllabus: [
          { unit: "Contemporary World Politics", topics: ["Cold War", "Bipolarity End", "US Hegemony", "South Asia", "International Orgs"] },
          { unit: "Indian Politics Since 1947",  topics: ["Nation Building", "One-Party Era", "External Relations", "Popular Movements", "Recent Politics"] },
        ],
      },
      { name: "Geography",        icon: Globe,     stream: "Arts",
        chapters: ["Population Geography", "Human Development", "Primary Activities", "Secondary Activities", "Tertiary Activities", "Transport & Communication", "International Trade", "Population of India", "Migration", "Land Resources", "Water Resources", "Industries in India"],
        syllabus: [
          { unit: "Human Geography",        topics: ["Population", "Human Development", "Economic Activities", "Transport", "Trade"] },
          { unit: "India – People & Economy",topics: ["Population", "Migration", "Resources", "Agriculture", "Industries"] },
        ],
      },
      { name: "Hindi",   icon: Languages, stream: "all",
        chapters: ["Bazar Darshan", "Kam Karo", "Shram Vibhajan aur Jati Pratha", "Vishnu Khare", "Usha", "Badal Raag", "Kavita ke Bare Mein"],
        syllabus: [
          { unit: "Gadya (Prose)",     topics: ["Bazar Darshan", "Shram Vibhajan aur Jati Pratha"] },
          { unit: "Padya (Poetry)",    topics: ["Modern Poetry", "Progressive Poetry", "Contemporary Poetry"] },
          { unit: "Vyakaran",          topics: ["Advanced Composition", "Translation", "Letter Writing", "Precise Writing"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["The Last Lesson", "Lost Spring", "Deep Water", "The Rattrap", "Indigo", "Going Places", "My Mother at Sixty-six", "An Elementary School", "Keeping Quiet", "A Thing of Beauty"],
        syllabus: [
          { unit: "Reading",    topics: ["Unseen Passages", "Note Making"] },
          { unit: "Writing",    topics: ["Notice", "Article", "Letter", "Report Writing"] },
          { unit: "Grammar",    topics: ["Editing", "Gap Filling", "Sentence Transformation"] },
          { unit: "Literature", topics: ["Flamingo Prose", "Flamingo Poetry", "Vistas"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  ICSE DATA
// ─────────────────────────────────────────────────────────────────────────────
const ICSE_CLASSES = [
  {
    id: 9, label: "Class 9", tagline: "ICSE – Building Excellence",
    streams: null,
    description: "ICSE Class 9 offers a broad and rigorous curriculum under CISCE. It emphasizes English language proficiency, analytical thinking, and in-depth subject knowledge across Sciences, Mathematics, and Humanities.",
    highlights: ["CISCE Curriculum", "Strong English Focus", "6-Subject Structure", "Project-Based Learning"],
    subjects: [
      { name: "Mathematics", icon: Calculator, stream: "all",
        chapters: ["Pure Arithmetic (Rational Numbers)", "Commercial Mathematics", "Algebra (Expansions & Identities)", "Factorization", "Simultaneous Equations", "Indices (Exponents)", "Logarithms", "Triangles & Congruence", "Isosceles Triangle", "Inequalities in Triangles", "Mid-point & Intercept Theorems", "Pythagoras Theorem", "Rectilinear Figures", "Constructions of Polygons", "Area Theorems", "Circle (Chord Properties)", "Statistics (Mean, Median, Mode, Histogram)"],
        syllabus: [
          { unit: "Number System",           topics: ["Rational Numbers", "Irrational Numbers", "Ratio & Proportion"] },
          { unit: "Commercial Math",         topics: ["Compound Interest", "Profit & Loss", "GST"] },
          { unit: "Algebra",                 topics: ["Expansions", "Factorisation", "Simultaneous Equations", "Indices", "Logarithms"] },
          { unit: "Geometry",                topics: ["Congruence", "Inequalities", "Mid-Point Theorem", "Pythagoras", "Rectilinear Figures"] },
          { unit: "Mensuration & Statistics",topics: ["Area of Plane Figures", "Statistics Basics"] },
        ],
      },
      { name: "Physics", icon: Atom, stream: "all",
        chapters: ["Measurements & Experimentation", "Motion in One Dimension", "Laws of Motion", "Pressure in Fluids & Atmospheric Pressure", "Upthrust in Fluids & Archimedes Principle", "Heat & Energy", "Reflection of Light", "Propagation of Sound Waves"],
        syllabus: [
          { unit: "Measurements", topics: ["SI Units", "Measuring Instruments", "Errors"] },
          { unit: "Motion",       topics: ["Kinematics", "Speed, Velocity, Acceleration", "Graphs"] },
          { unit: "Force",        topics: ["Newton's Laws", "Momentum", "Simple Machines"] },
          { unit: "Energy",       topics: ["Heat", "Calorimetry", "Light", "Sound"] },
        ],
      },
      { name: "Chemistry", icon: FlaskConical, stream: "all",
        chapters: ["The Language of Chemistry", "Chemical Changes & Reactions", "Water", "Atomic Structure & Chemical Bonding", "The Periodic Table", "Study of the First Element – Hydrogen", "Study of Gas Laws", "Atmospheric Pollution"],
        syllabus: [
          { unit: "Basic Chemistry",     topics: ["Language of Chemistry", "Chemical Equations", "Mole Concept"] },
          { unit: "Physical Chemistry",  topics: ["Atomic Structure", "Chemical Bonding", "Gas Laws"] },
          { unit: "Inorganic Chemistry", topics: ["Periodic Table", "Hydrogen", "Water Chemistry"] },
          { unit: "Environmental",       topics: ["Air Pollution", "Acid Rain", "Greenhouse Effect"] },
        ],
      },
      { name: "Biology", icon: Microscope, stream: "all",
        chapters: ["Basic Biology", "Nutrition", "Flower – Structure & Pollination", "The Leaf", "The Root", "The Stem", "Transpiration", "Photosynthesis", "Cell – The Unit of Life", "Tissues – Plants & Animals", "Chromosomes & Cell Division"],
        syllabus: [
          { unit: "Plant Biology",         topics: ["Nutrition", "Transpiration", "Photosynthesis", "Flower Structure"] },
          { unit: "Cell Biology",          topics: ["Cell Structure", "Cell Division", "Tissues"] },
          { unit: "Human Biology Intro",   topics: ["Basic Body Systems", "Nutrition & Digestion Intro"] },
        ],
      },
      { name: "History & Civics", icon: BookMarked, stream: "all",
        chapters: ["Harappan Civilisation", "Vedic Age", "Rise of Jainism & Buddhism", "Mauryan Empire", "Ashoka", "Gupta Empire", "Medieval India – Delhi Sultanate", "Mughal Empire", "The Marathas", "Beginning of British Rule", "Our Constitution", "Fundamental Rights & Duties", "Central & State Government"],
        syllabus: [
          { unit: "History",  topics: ["Ancient India", "Medieval India", "Early Modern India"] },
          { unit: "Civics",   topics: ["Constitution of India", "Fundamental Rights & Duties", "Parliament", "State Government"] },
        ],
      },
      { name: "Geography", icon: Globe, stream: "all",
        chapters: ["The Earth as a Planet", "Geographic Grid", "Rotation & Revolution", "Structure of the Earth", "Landforms", "Hydrosphere", "Atmosphere", "Pollution", "Natural Regions of the World", "Map Skills"],
        syllabus: [
          { unit: "Physical Geography", topics: ["Earth's Structure", "Landforms", "Hydrosphere", "Atmosphere"] },
          { unit: "World Geography",    topics: ["Natural Regions", "Climate Zones", "Human Geography Basics"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 10, label: "Class 10", tagline: "ICSE Board – The Big Exam",
    streams: null,
    description: "ICSE Class 10 Board Examination (CISCE) is recognized globally for its rigor and breadth. The syllabus demands analytical thinking, strong English skills, and deep conceptual understanding across all subjects.",
    highlights: ["CISCE Board Exam", "International Recognition", "Analytical Thinking", "Strong English"],
    subjects: [
      { name: "Mathematics", icon: Calculator, stream: "all",
        chapters: ["GST (Goods & Services Tax)", "Banking", "Shares & Dividends", "Linear Inequations", "Quadratic Equations", "Ratio & Proportion", "Factorization of Polynomials", "Matrices", "Arithmetic & Geometric Progressions", "Coordinate Geometry", "Similarity", "Loci", "Circles", "Constructions", "Mensuration", "Trigonometry", "Statistics", "Probability"],
        syllabus: [
          { unit: "Commercial Math",      topics: ["GST", "Banking & Compound Interest", "Shares & Dividends"] },
          { unit: "Algebra",              topics: ["Linear Inequations", "Quadratic Equations", "Polynomials", "Matrices", "AP & GP"] },
          { unit: "Geometry",             topics: ["Similarity", "Circles", "Loci", "Constructions"] },
          { unit: "Trigonometry",         topics: ["Trigonometric Identities", "Heights & Distances"] },
          { unit: "Mensuration",          topics: ["Cylinder, Cone, Sphere"] },
          { unit: "Statistics",           topics: ["Mean, Median, Mode", "Histogram", "Ogive", "Probability"] },
        ],
      },
      { name: "Physics", icon: Atom, stream: "all",
        chapters: ["Force", "Work, Energy & Power", "Machines", "Refraction of Light", "Refraction Through Lens", "Spectrum", "Sound", "Electricity", "Electrical Power & Household Electricity", "Magnetic Effects of Current", "Calorimetry", "Radioactivity & Nuclear Energy"],
        syllabus: [
          { unit: "Forces & Energy",   topics: ["Force Types", "Work-Energy Theorem", "Simple Machines", "Power"] },
          { unit: "Light & Sound",     topics: ["Refraction", "Lenses", "Spectrum", "Sound Propagation"] },
          { unit: "Electricity",       topics: ["Ohm's Law", "Circuits", "Household Electricity", "Safety"] },
          { unit: "Modern Physics",    topics: ["Magnetic Effects", "Calorimetry", "Radioactivity"] },
        ],
      },
      { name: "Chemistry", icon: FlaskConical, stream: "all",
        chapters: ["Periodic Table & Properties", "Chemical Bonding", "Acids, Bases & Salts", "Analytical Chemistry – Uses of Ammonium Hydroxide & NaOH", "Mole Concept & Stoichiometry", "Electrolysis", "Metallurgy", "Study of Compounds – HCl, HNO3, H2SO4, Ammonia", "Organic Chemistry"],
        syllabus: [
          { unit: "Physical Chemistry",  topics: ["Mole Concept", "Electrolysis", "Energy Changes"] },
          { unit: "Inorganic Chemistry", topics: ["Periodic Table", "Chemical Bonding", "Acids & Bases", "Metals", "Non-metals"] },
          { unit: "Analytical",          topics: ["Salt Analysis", "Uses of Ammonium Hydroxide", "Organic Intro"] },
        ],
      },
      { name: "Biology", icon: Microscope, stream: "all",
        chapters: ["Cell Division", "Structure of Chromosomes & Genes", "Absorption by Roots", "Transpiration", "Photosynthesis", "Chemical Coordination", "The Nervous System & Sense Organs", "The Endocrine System", "The Reproductive System", "Population – Origin & Evolution", "Pollution"],
        syllabus: [
          { unit: "Cell Biology & Genetics",  topics: ["Cell Division", "Chromosomes", "Genes & Heredity"] },
          { unit: "Plant Biology",            topics: ["Absorption", "Transpiration", "Photosynthesis"] },
          { unit: "Human Biology",            topics: ["Nervous System", "Endocrine System", "Reproduction"] },
          { unit: "Environment",              topics: ["Population", "Evolution", "Pollution"] },
        ],
      },
      { name: "History & Civics", icon: BookMarked, stream: "all",
        chapters: ["The Indian National Congress (Foundation)", "The Partition of Bengal", "Swadeshi Movement", "Formation of Muslim League", "Home Rule Movement", "Lucknow Pact", "Gandhian Era", "Non-Cooperation Movement", "Civil Disobedience", "Quit India Movement", "India's Independence", "The United Nations", "Major Organs of UN", "Specialised Agencies", "The Indian Constitution", "Fundamental Rights"],
        syllabus: [
          { unit: "History – Freedom Movement", topics: ["INC Foundation", "Bengal Partition", "Swadeshi", "Muslim League", "Gandhian Era", "Non-Cooperation", "Civil Disobedience", "Quit India", "Independence"] },
          { unit: "Civics",                     topics: ["United Nations", "Major Organs", "UN Agencies", "Indian Constitution", "Fundamental Rights"] },
        ],
      },
      { name: "Geography", icon: Globe, stream: "all",
        chapters: ["India – Location, Size, Extent", "India – Physical Features", "India – Drainage", "Climate of India", "Natural Vegetation & Wildlife", "Soil Resources", "Mineral & Energy Resources", "Agriculture in India", "Manufacturing Industries", "Transport in India", "Waste Generation & Management", "Map of India"],
        syllabus: [
          { unit: "Physical Geography of India",  topics: ["Location & Size", "Physical Features", "Drainage", "Climate", "Vegetation"] },
          { unit: "Economic Geography of India",  topics: ["Resources", "Agriculture", "Industries", "Transport"] },
          { unit: "Environmental Geography",      topics: ["Waste Management", "Pollution"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 11, label: "Class 11", tagline: "ISC – Year One of Intensive Study",
    streams: ["Science", "Commerce", "Arts"],
    description: "ISC (Indian School Certificate) Class 11 is part of the CISCE Senior Secondary program. Students choose electives based on their stream. ISC is known for its analytical depth and comprehensive examination pattern.",
    highlights: ["ISC CISCE Program", "Elective-Based Learning", "Analytical Depth", "Global Recognition"],
    subjects: [
      { name: "Physics",    icon: Atom,        stream: "Science",
        chapters: ["Physical World & Measurement", "Kinematics", "Laws of Motion", "Work, Energy & Power", "Circular Motion", "Gravitation", "Properties of Matter", "Oscillations", "Heat & Thermodynamics", "Waves"],
        syllabus: [
          { unit: "Mechanics",          topics: ["Measurements", "Kinematics", "Newton's Laws", "Work-Energy", "Circular Motion", "Gravitation"] },
          { unit: "Properties of Matter",topics: ["Elasticity", "Viscosity", "Surface Tension"] },
          { unit: "Thermodynamics",      topics: ["Thermal Expansion", "Kinetic Theory", "Laws of Thermodynamics"] },
          { unit: "Waves",               topics: ["Wave Motion", "Sound", "Resonance"] },
        ],
      },
      { name: "Chemistry",  icon: FlaskConical,stream: "Science",
        chapters: ["Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding", "The Gaseous State", "Chemical Energetics", "Chemical Equilibrium", "Ionic Equilibrium", "Hydrogen", "s-Block Elements", "Organic Chemistry Fundamentals", "Hydrocarbons"],
        syllabus: [
          { unit: "Physical Chemistry",  topics: ["Mole Concept", "Atomic Structure", "Chemical Bonding", "Gaseous State", "Energetics", "Equilibrium"] },
          { unit: "Inorganic Chemistry", topics: ["s-Block", "Hydrogen", "Non-Metals"] },
          { unit: "Organic Chemistry",   topics: ["Hydrocarbons", "Nomenclature", "Basic Reactions"] },
        ],
      },
      { name: "Mathematics", icon: Calculator, stream: "Science",
        chapters: ["Sets & Functions", "Relations", "Trigonometry", "Algebra of Complex Numbers", "Linear Inequations", "Permutations & Combinations", "Mathematical Induction", "Binomial Theorem", "Sequences & Series", "Coordinate Geometry", "Conic Sections", "Limits & Derivatives", "Mathematical Reasoning", "Statistics", "Probability"],
        syllabus: [
          { unit: "Algebra",           topics: ["Sets", "Relations", "Trigonometry", "Complex Numbers", "Permutations", "Induction", "Binomial Theorem", "Sequences"] },
          { unit: "Coordinate Geometry",topics: ["Lines", "Conic Sections", "3D Geometry Intro"] },
          { unit: "Calculus",           topics: ["Limits", "Derivatives"] },
          { unit: "Statistics",         topics: ["Measures of Dispersion", "Probability"] },
        ],
      },
      { name: "Biology",    icon: Microscope,  stream: "Science",
        chapters: ["Diversity of Living Organisms", "Cell – The Unit of Life", "Cell Division", "Plant Physiology", "Morphology of Flowering Plants", "Animal Tissues", "Digestion", "Respiration", "Circulation", "Excretion", "Nervous System", "Locomotion"],
        syllabus: [
          { unit: "Diversity & Cell",     topics: ["Biological Classification", "Cell Structure", "Cell Division"] },
          { unit: "Plant Biology",        topics: ["Morphology", "Photosynthesis", "Transpiration", "Growth"] },
          { unit: "Human Biology",        topics: ["Digestion", "Respiration", "Circulation", "Excretion", "Nervous System"] },
        ],
      },
      { name: "Accounts",        icon: BarChart,    stream: "Commerce",
        chapters: ["Introduction to Accounting", "Theory Base", "Accounting Equation", "Recording Transactions", "Special Purpose Books", "Trial Balance", "Depreciation", "Provisions & Reserves", "Bank Reconciliation", "Bills of Exchange", "Final Accounts"],
        syllabus: [
          { unit: "Basics",         topics: ["Introduction", "Theory Base", "Accounting Equation"] },
          { unit: "Book-Keeping",   topics: ["Recording", "Special Books", "Trial Balance"] },
          { unit: "Final Accounts", topics: ["Depreciation", "Final Accounts of Sole Proprietor"] },
        ],
      },
      { name: "Economics",       icon: BarChart2,   stream: "Commerce",
        chapters: ["Introduction to Economics", "Consumer Behaviour & Demand", "Producer Behaviour & Supply", "Forms of Market", "National Income", "Money & Banking", "Inflation", "Government Budget"],
        syllabus: [
          { unit: "Microeconomics", topics: ["Demand & Supply", "Consumer Behaviour", "Market Forms", "Production"] },
          { unit: "Macroeconomics", topics: ["National Income", "Money & Banking", "Inflation", "Fiscal Policy"] },
        ],
      },
      { name: "History",         icon: BookMarked, stream: "Arts",
        chapters: ["The Harappan Civilisation", "The Vedic Age", "Mahajanpadas", "The Mauryan Period", "The Gupta Era", "Bhakti Sufi Traditions", "The Mughal Empire"],
        syllabus: [
          { unit: "Ancient India",    topics: ["Harappan Civilisation", "Vedic Age", "Mahajanpadas", "Mauryan Period", "Gupta Era"] },
          { unit: "Medieval India",   topics: ["Bhakti & Sufi Movements", "Mughal Empire"] },
        ],
      },
      { name: "Political Science", icon: Shield, stream: "Arts",
        chapters: ["Introduction to Political Science", "Democracy", "Rights", "Equality", "Secularism", "Federalism", "Indian Constitution"],
        syllabus: [
          { unit: "Political Theory", topics: ["Democracy", "Rights", "Equality", "Secularism", "Federalism"] },
          { unit: "Indian Polity",    topics: ["Constitution", "Fundamental Rights", "DPSP", "Parliamentary System"] },
        ],
      },
      { name: "English",          icon: BookOpen, stream: "all",
        chapters: ["Prose Selections", "Poetry Selections", "Drama Selections", "Writing Skills", "Grammar"],
        syllabus: [
          { unit: "Literature",  topics: ["Prose", "Poetry", "Drama", "Novel"] },
          { unit: "Language",    topics: ["Comprehension", "Composition", "Grammar", "Notice & Letter Writing"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
  {
    id: 12, label: "Class 12", tagline: "ISC Board – Global Recognition",
    streams: ["Science", "Commerce", "Arts"],
    description: "ISC (Indian School Certificate) Class 12 Board Examination is conducted by CISCE and recognized globally by universities. Performance here opens doors to top Indian and international universities.",
    highlights: ["ISC Board Exam", "Global University Recognition", "CISCE Certification", "Top College Admissions"],
    subjects: [
      { name: "Physics",    icon: Atom,        stream: "Science",
        chapters: ["Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Alternating Currents", "Electromagnetic Waves", "Optics", "Dual Nature of Radiation", "Atoms & Nuclei", "Semiconductors", "Communication Systems"],
        syllabus: [
          { unit: "Electrostatics & Current", topics: ["Coulomb's Law", "Potential", "Capacitors", "Ohm's Law", "Kirchhoff's Laws"] },
          { unit: "Magnetism & EMI",          topics: ["Biot-Savart", "Ampere", "Faraday", "AC Circuits"] },
          { unit: "Optics",                   topics: ["Refraction", "Lenses", "Wave Optics", "Interference", "Diffraction"] },
          { unit: "Modern Physics",           topics: ["Photoelectric Effect", "de Broglie", "Bohr Model", "Nuclear Physics"] },
          { unit: "Semiconductors",           topics: ["p-n Junction", "Diode", "Transistor", "Logic Gates"] },
        ],
      },
      { name: "Chemistry",  icon: FlaskConical,stream: "Science",
        chapters: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "p-Block Elements", "d & f Block Elements", "Coordination Compounds", "Haloalkanes", "Alcohols & Ethers", "Carbonyl Compounds", "Carboxylic Acids", "Amines", "Polymers", "Biomolecules", "Chemistry of Everyday Life"],
        syllabus: [
          { unit: "Physical Chemistry",  topics: ["Solid State", "Solutions", "Electrochemistry", "Kinetics", "Surface Chemistry"] },
          { unit: "Inorganic Chemistry", topics: ["p-Block", "d & f Block", "Coordination Compounds"] },
          { unit: "Organic Chemistry",   topics: ["Haloalkanes", "Alcohols", "Carbonyl Compounds", "Amines", "Biomolecules", "Polymers"] },
        ],
      },
      { name: "Mathematics", icon: Calculator, stream: "Science",
        chapters: ["Relations & Functions", "Inverse Trigonometry", "Algebra – Matrices & Determinants", "Calculus – Differentiation", "Calculus – Integration", "Differential Equations", "Probability", "Vectors", "3D Geometry", "Linear Programming"],
        syllabus: [
          { unit: "Relations & Algebra",   topics: ["Functions", "Inverse Trig", "Matrices", "Determinants"] },
          { unit: "Calculus",              topics: ["Differentiation", "Integration", "Applications", "Differential Equations"] },
          { unit: "Probability & Vectors", topics: ["Probability", "Vector Algebra", "3D Geometry", "Linear Programming"] },
        ],
      },
      { name: "Biology",    icon: Microscope,  stream: "Science",
        chapters: ["Reproduction", "Genetics", "Evolution", "Health & Disease", "Biotechnology", "Ecology"],
        syllabus: [
          { unit: "Reproduction & Genetics", topics: ["Plant Reproduction", "Human Reproduction", "Mendelian Genetics", "DNA"] },
          { unit: "Evolution",               topics: ["Origin of Life", "Darwinism", "Molecular Evolution", "Speciation"] },
          { unit: "Health & Biotechnology",  topics: ["Immunity", "Diseases", "Biotech Principles", "Applications"] },
          { unit: "Ecology",                 topics: ["Ecosystems", "Biodiversity", "Environment"] },
        ],
      },
      { name: "Accounts",       icon: BarChart,    stream: "Commerce",
        chapters: ["Partnership Accounts", "Admission of a Partner", "Retirement & Death of a Partner", "Dissolution", "Company Accounts – Share Capital", "Debentures", "Financial Statements", "Analysis of Statements", "Cash Flow"],
        syllabus: [
          { unit: "Partnership",         topics: ["Basics", "Admission", "Retirement", "Death", "Dissolution"] },
          { unit: "Company Accounts",    topics: ["Share Capital", "Debentures", "Financial Statements"] },
          { unit: "Financial Analysis",  topics: ["Ratio Analysis", "Cash Flow Statement"] },
        ],
      },
      { name: "Economics",      icon: BarChart2,   stream: "Commerce",
        chapters: ["National Income Accounting", "Money & Banking", "Determination of Income", "Government Budget", "Open Economy", "Balance of Payments", "Economic Growth & Development", "Poverty & Inequality"],
        syllabus: [
          { unit: "Macroeconomics",  topics: ["National Income", "Money & Banking", "Income Determination", "Govt Budget", "Open Economy"] },
          { unit: "Indian Economy",  topics: ["Economic Growth", "Development", "Poverty", "Inequality", "Reforms"] },
        ],
      },
      { name: "History",          icon: BookMarked, stream: "Arts",
        chapters: ["Harappan Civilisation to Gupta Empire", "Medieval India", "Mughal Empire", "The Rise of British India", "Freedom Movement", "Partition of India", "Post-Independence India", "World History – World Wars"],
        syllabus: [
          { unit: "Ancient & Medieval India", topics: ["Harappan Civilisation", "Vedic Age", "Guptas", "Medieval India", "Mughals"] },
          { unit: "Modern India",             topics: ["British Rule", "Freedom Movement", "Partition", "Post-Independence"] },
          { unit: "World History",            topics: ["World War I", "World War II", "Cold War", "Decolonisation"] },
        ],
      },
      { name: "Political Science", icon: Shield,   stream: "Arts",
        chapters: ["Indian Constitution", "Parliament", "Judiciary", "State Government", "Local Self Government", "Electoral System", "Political Parties", "Indian Foreign Policy"],
        syllabus: [
          { unit: "Indian Polity",      topics: ["Constitution", "Fundamental Rights", "Parliament", "Judiciary", "State Govt", "Local Governance"] },
          { unit: "Political Process",  topics: ["Electoral System", "Political Parties", "Coalition Politics", "Foreign Policy"] },
        ],
      },
      { name: "English",          icon: BookOpen,  stream: "all",
        chapters: ["Prose Selections", "Poetry Selections", "Drama", "Short Stories", "Composition", "Grammar"],
        syllabus: [
          { unit: "Literature",     topics: ["Prescribed Prose", "Poetry Analysis", "Drama Study", "Short Stories"] },
          { unit: "Language",       topics: ["Comprehension", "Essay & Article Writing", "Letter Writing", "Grammar"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  UP BOARD DATA (UPMSP)
// ─────────────────────────────────────────────────────────────────────────────
const UPBOARD_CLASSES = [
  {
    id: 9, label: "Class 9", tagline: "UP Board – High School Foundation",
    streams: null,
    description: "UP Board Class 9 follows UPMSP curriculum (High School). It uses both NCERT and State Board books. Hindi medium is dominant with emphasis on Sanskrit, Hindi Literature, and Practical Science.",
    highlights: ["UPMSP Curriculum", "Hindi Medium Dominant", "Sanskrit Compulsory", "NCERT + State Books"],
    subjects: [
      { name: "Mathematics", icon: Calculator, stream: "all",
        chapters: ["Sankhya Paddhati (Number Systems)", "Bal-Ganit (Polynomials)", "Do Charo Ka Sar-Samaika", "Rekha Ganit", "Euclid Ki Rekha Ganit", "Rekhao aur Kono", "Tribhuj", "Samantar Chaturbhuj aur Vrit", "Heron Ka Sutra", "Prushth Kshetrafal aur Aayatan", "Aankde", "Sambhavna"],
        syllabus: [
          { unit: "Sankhya Paddhati",   topics: ["Vasthavick Sankhyaen", "Parimey Sankhyaen", "Ghatatank Ke Niyam"] },
          { unit: "Beejganit",          topics: ["Polynomials", "Linear Equations in Two Variables"] },
          { unit: "Rekha Ganit",        topics: ["Euclid Ka Rekha Ganit", "Rekhao aur Kono", "Tribhuj", "Chaturbhuj", "Vritta"] },
          { unit: "Kshetramiti",        topics: ["Heron Ka Sutra", "Prushth Kshetrafal", "Aayatan"] },
          { unit: "Aankde",             topics: ["Aankdon ka Sangrahan", "Bar Graph", "Madhya, Madhyika, Bahulak"] },
        ],
      },
      { name: "Science (Vigyan)", icon: FlaskConical, stream: "all",
        chapters: ["Hamare Aas-Paas ke Padarth", "Kya Padarth Shuddh Hai?", "Parmanu Aur Anu", "Parmanu Ki Sanrachna", "Jivan Ki Mul Ikai", "Utak", "Jaiv Vividhata", "Gati", "Bal aur Gati Ke Niyam", "Gurutvakarshan", "Karya aur Urja", "Dhwani", "Praakritik Sampada"],
        syllabus: [
          { unit: "Rasayan Vigyan",  topics: ["Padarth", "Parmanu Aur Anu", "Parmanu Ki Sanrachna"] },
          { unit: "Jiv Vigyan",      topics: ["Koshika", "Utak", "Jaiv Vividhata", "Rog aur Swasthya"] },
          { unit: "Bhautiki",        topics: ["Gati", "Bal", "Gurutvakarshan", "Karya aur Urja", "Dhwani"] },
        ],
      },
      { name: "Social Science", icon: Globe, stream: "all",
        chapters: ["Phranseesi Kranti", "Rusi Kranti", "Nazism aur Hitler Ka Uday", "Van aur Janajaati", "Bharat – Sthiti aur Aakaar", "Bharat Ka Bhautik Swaroop", "Apawah Tantra", "Jalwayu", "Paarikritik Vanaspati aur Jeev-Jantu", "Loktantra Kya Hai?", "Graam Swaraj", "Niradhnata: Ek Chunauti"],
        syllabus: [
          { unit: "Itihas",      topics: ["Phranseesi Kranti", "Rusi Kranti", "Nazism", "Van aur Janajaati"] },
          { unit: "Bhugol",      topics: ["Bharat Ka Bhuogl", "Nadi Praanali", "Jalwayu", "Vanaspati"] },
          { unit: "Nagrik Shastra", topics: ["Loktantra", "Samvidhan Nirman", "Sarkar"] },
          { unit: "Arthshastra",   topics: ["Gramin Arth Vyavastha", "Niradhnata", "Khadya Suraksha"] },
        ],
      },
      { name: "Hindi", icon: Languages, stream: "all",
        chapters: ["Padya Sahitya", "Gadya Sahitya", "Sanskrit", "Vyakaran", "Lekhan"],
        syllabus: [
          { unit: "Padya (Poetry)",    topics: ["Tulsidas", "Surdas", "Kabir", "Bihari", "Maithilisharan Gupt", "Sumitranandan Pant", "Mahadevi Verma"] },
          { unit: "Gadya (Prose)",     topics: ["Prem Chand", "Jaishankar Prasad", "Ram Chandra Shukla", "Hazari Prasad Dwivedi"] },
          { unit: "Sanskrit",          topics: ["Gadya Paath", "Padya Paath", "Vyakaran", "Anuvad"] },
          { unit: "Vyakaran",          topics: ["Sandhi", "Samas", "Muhavare", "Lokoktiyan", "Nibandh", "Patra Lekhan"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 10, label: "Class 10", tagline: "UP Board High School Exam",
    streams: null,
    description: "UP Board High School Examination (Class 10) is conducted by UPMSP. It's one of India's largest board exams with millions of students. Results are crucial for stream selection in Intermediate (Class 11-12).",
    highlights: ["UPMSP High School Exam", "One of India's Largest Boards", "All UP State Ranking", "Stream Selection Basis"],
    subjects: [
      { name: "Mathematics", icon: Calculator, stream: "all",
        chapters: ["Vasthavick Sankhyaen (Real Numbers)", "Polynomials", "Do Charo Ka Yugm (Pair of Linear Equations)", "Dwidhaat Samikarana (Quadratic Equations)", "Samananthar Shrenee (AP)", "Tribhuj (Triangles)", "Samanvaya Rekha Ganit (Coordinate Geometry)", "Trikonmiti (Trigonometry)", "Vritta (Circles)", "Rachna (Constructions)", "Vrittaon Se Sambandhit Kshetrafal", "Prushtheeya Kshetrafal aur Aayatan", "Aankde (Statistics)", "Sambhavna (Probability)"],
        syllabus: [
          { unit: "Sankhya Paddhati",   topics: ["Euclid Ki Vibhajan Vidhee", "Parmey Sankhyaon Ka Muladhaar Prameya", "Vasthavick Sankhyaen"] },
          { unit: "Beejganit",          topics: ["Polynomials", "Yugmi Rekhik Samikarana", "Dwidhaat Samikarana", "Samananthar Shrenee"] },
          { unit: "Rekha Ganit",        topics: ["Tribhuj", "Vritta", "Rachna"] },
          { unit: "Trikonmiti",         topics: ["Trikonmiti Parichay", "Trikonmiti Tatsamak", "Unchai aur Doori"] },
          { unit: "Kshetramiti",        topics: ["Vrittaon Ka Kshetrafal", "Prushtheeya Kshetrafal aur Aayatan"] },
          { unit: "Aankde",             topics: ["Aankde", "Sambhavna"] },
        ],
      },
      { name: "Science (Vigyan)", icon: FlaskConical, stream: "all",
        chapters: ["Rasaayanik Abhikriyaen aur Samikarnan", "Amla, Chhaar aur Lavan", "Dhaatuyen aur Adhaatuyen", "Kaarbann aur Usake Yaugik", "Tattvaon Ka Aavartee Vargikaran", "Jeevann Prkiryaen", "Niyantran aur Samannvay", "Jeev Kaise Prajanann Karate Hain?", "Aanuvansikta aur Vikash", "Prakash – Paraavartann aur Apavaartann", "Manav Netr aur Rangamay Sansaar", "Vidyut", "Vidyut Dhaara Ke Chumbakeeya Prabhav", "Urjaa ke Srot", "Hamaara Paryavaran"],
        syllabus: [
          { unit: "Rasayan Vigyan",  topics: ["Rasaayanik Abhikriyaen", "Amla aur Chhaar", "Dhaatuyen aur Adhaatuyen", "Kaarbann Yaugik", "Aavartee Saaranee"] },
          { unit: "Jiv Vigyan",      topics: ["Jeevann Prkiryaen", "Niyantran", "Prajanann", "Aanuvansikta aur Vikash"] },
          { unit: "Bhautiki",        topics: ["Prakash", "Manav Netr", "Vidyut", "Chaumbakeeya Prabhav"] },
          { unit: "Paryavaran",      topics: ["Hamaara Paryavaran", "Urjaa ke Srot"] },
        ],
      },
      { name: "Social Science", icon: Globe, stream: "all",
        chapters: ["Yurop Mein Rashtravad", "Bharat Mein Rashtravad", "Vaishveekaran", "Audyogikaran Ka Yug", "Sansaadhan aur Vikas", "Van aur Jangalee Jeev", "Paanee ke Sansaadhan", "Krishi", "Satta Mein Bhaagedaaree", "Sangheeyata", "Rajneeteek Daln", "Vikas", "Mudra aur Saakh"],
        syllabus: [
          { unit: "Itihas",         topics: ["Rashtravad Yurop", "Bharat Mein Rashtravad", "Vaishveekaran", "Audyogikarana"] },
          { unit: "Bhugol",         topics: ["Sansaadhan", "Krishi", "Udyog", "Parivahan"] },
          { unit: "Rajniti Shastra",topics: ["Satta Mein Bhaagedaaree", "Sangheeyata", "Rajneeteek Dal", "Loktantra ke Parinaam"] },
          { unit: "Arthshastra",    topics: ["Vikas", "Arthavyavastha Ke Kshhetr", "Mudra aur Saakh", "Vaishveekaran"] },
        ],
      },
      { name: "Hindi", icon: Languages, stream: "all",
        chapters: ["Gadya Sahitya", "Padya Sahitya", "Sanskrit", "Khanda Kavya", "Nibandh aur Lekhan"],
        syllabus: [
          { unit: "Gadya Khand",   topics: ["Prem Chand", "Gulabray", "Seeta Devi", "Kalyaan Dube"] },
          { unit: "Padya Khand",   topics: ["Surdas", "Tulsidas", "Biharilal", "Jayshankar Prasad", "Sumitranandan Pant", "Mahadevi Verma", "Ramdhari Singh Dinkar"] },
          { unit: "Sanskrit",      topics: ["Gadya", "Padya", "Vyakaran", "Anuvad", "Sandhana"] },
          { unit: "Vyakaran",      topics: ["Sandhi", "Samas", "Vachan", "Karak", "Alankar", "Nibandh", "Patra Lekhan"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["Prose Passages", "Poetry", "Grammar", "Composition", "Unseen Passages"],
        syllabus: [
          { unit: "Reading",     topics: ["Unseen Prose Passages", "Unseen Poetry Passages"] },
          { unit: "Writing",     topics: ["Essay Writing", "Letter Writing", "Story Writing"] },
          { unit: "Grammar",     topics: ["Tenses", "Voice", "Narration", "Sentences", "Vocabulary"] },
          { unit: "Literature",  topics: ["Prose Lessons", "Poetry Lessons", "Supplementary Reader"] },
        ],
      },
      AI_SUBJECT_9_10,
    ],
  },
  {
    id: 11, label: "Class 11", tagline: "UP Intermediate – Pratham Varsh",
    streams: ["Science", "Commerce", "Arts"],
    description: "UP Board Intermediate (Class 11) – Pratham Varsh. UPMSP conducts Intermediate exams which determine Higher Education access. Stream selection is based on High School performance.",
    highlights: ["UPMSP Intermediate", "I.Sc / I.Com / I.A.", "Large Student Base", "State University Access"],
    subjects: [
      { name: "Physics (Bhautiki)", icon: Atom, stream: "Science",
        chapters: ["Maatrak aur Maapann", "Sarval Rekhiya Gati", "Samaatal Mein Gati", "Gati Ke Niyam", "Karya Urjaa aur Saktee", "Kaanon Paddarth Ka Yantrik", "Gurutvakarshan", "Thaas Ke Yaantrik Gundharma", "Tharlo Ka Yaantrik Gundharma", "Praavarthann aur Tarangein"],
        syllabus: [
          { unit: "Yantrikee",      topics: ["Maapann", "Kinetics", "Newton Ke Niyam", "Karya aur Urjaa", "Gurutvakarshan"] },
          { unit: "Dravya Gundharma",topics: ["Thaas", "Tharlo", "Marparavann aur Tarangein"] },
        ],
      },
      { name: "Chemistry (Rasayan)", icon: FlaskConical, stream: "Science",
        chapters: ["Rasayan Vigyan Ki Kuch Maul Avadharanaen", "Parmanu Ki Sanrachna", "Tatvaon Ka Avartee Vargikaran", "Rasaayanik Bandhan", "Dravya Ki Avasthaen", "Rachnaatmak Ooshmarasa Vigyaan", "Saamamyavasthaa", "Apachayan-Aapachayan Abhikriyaen", "Hydrogen", "s-Khand Tatv", "Kaarbann Ke Tatvaon", "Hydrokaarbann"],
        syllabus: [
          { unit: "Bhaautik Rasayan",    topics: ["Parmanu", "Avartee Sarni", "Rasaayanik Bandhan", "Dravya Avastha", "Saamamyavastha"] },
          { unit: "Akarbaanik Rasayan",  topics: ["Hydrogen", "s-Khand", "Paryavaran Rasayan"] },
          { unit: "Kaarbaanik Rasayan",  topics: ["IUPAC Naamkaran", "Hydrokaarbann", "Kaarbaanik Abhikriyaen"] },
        ],
      },
      { name: "Mathematics (Ganit)", icon: Calculator, stream: "Science",
        chapters: ["Samuchchay", "Sambandh aur Prakar", "Trikonmiti Prakar", "Gunanthar Atankik Sankhyaen", "Rekheey Asmaanataen", "Kramasampadan aur Sanyojan", "Dvipad Prameya", "Anukram aur Shrenee", "Saral Rekha", "Shaankav Khand", "Teen Aayamee Rekha Ganit", "Seemaa aur Avakalan"],
        syllabus: [
          { unit: "Beejganit",        topics: ["Samuchchay", "Sambandh", "Trikonmiti", "Samaas Sankhyaen", "Anukram"] },
          { unit: "Samanvaya Rekha Ganit", topics: ["Saral Rekha", "Shaankav Khand", "Teen Aayamee"] },
          { unit: "Kalan",            topics: ["Seemaa", "Avakalan"] },
          { unit: "Aankde aur Sambhavna", topics: ["Sankhyikee", "Sambhavna"] },
        ],
      },
      { name: "Biology (Jeev Vigyan)", icon: Microscope, stream: "Science",
        chapters: ["Jeev Jagat Mein Vividhata", "Pushpi Padpan Ki Aakarikeey", "Jeev Ka Sanrachnatmak Sangathan", "Koshika: Jeevann Ki Ikaai", "Paudha Kriyavidhee", "Manav Kriyavidhee"],
        syllabus: [
          { unit: "Jeev Jagat Mein Vividhata",      topics: ["Jeev Jagat", "Vaspatee Jagat", "Praanee Jagat"] },
          { unit: "Koshika Vigyan",                  topics: ["Koshika Sanrachna", "Jeev Anu", "Koshika Vibhajan"] },
          { unit: "Paudha Kriyavidhee",              topics: ["Parivahan", "Prakash Sanglesshan", "Shwasann", "Vriddhi"] },
          { unit: "Manav Kriyavidhee",               topics: ["Pachan", "Shwasann", "Parisancharan", "Utsarjan"] },
        ],
      },
      { name: "Accountancy (Lekhankan)", icon: BarChart, stream: "Commerce",
        chapters: ["Lekhankan Parichay", "Lekhankan Ka Siddhantik Aadhar", "Lena-Dena Ka Abhilekhan", "Tallnama", "Vitt Vivarann", "Hraas", "Vishesh Prayojan Pustak", "Bank Milvaan Vivarann"],
        syllabus: [
          { unit: "Mool Siddhant", topics: ["Lekhankan Parichay", "Pratilipi", "Siddhant"] },
          { unit: "Abhilekhan",    topics: ["Journal", "Ledger", "Tallnama", "Vishesh Prayojan Pustak"] },
          { unit: "Vitt Vivarann", topics: ["Aantim Khaate", "Hraas", "Bank Milvaan"] },
        ],
      },
      { name: "Economics (Arthashastra)", icon: BarChart2, stream: "Commerce",
        chapters: ["Parichay", "Upbhokta Vyavahaar", "Utpadann", "Baajaar Ke Roop", "Rashtriya Aay", "Mudra aur Bankking", "Mudraspheeti", "Sarkaar Ka Bajat"],
        syllabus: [
          { unit: "Vyashtee Arthashastra", topics: ["Upbhokta Vyavahaar", "Maang", "Urjaa", "Bazaar"] },
          { unit: "Samashtee Arthashastra",topics: ["Rashtriya Aay", "Mudra", "Bankking", "Sarkaar Bajat"] },
        ],
      },
      { name: "History (Itihas)", icon: BookMarked, stream: "Arts",
        chapters: ["Vishv Itihas – Prarambhik Samaj", "Samprajya", "Badalte Pravrittiyan", "Adhunikta Ki Raahein"],
        syllabus: [
          { unit: "Vishv Itihas", topics: ["Prarambhik Samaj", "Samprajya Nirman", "Sanskriti aur Dharma", "Adhunikta"] },
        ],
      },
      { name: "Political Science (Rajniti Vigyan)", icon: Shield, stream: "Arts",
        chapters: ["Rajnitik Siddhant Parichay", "Swatantrata", "Samata", "Samajik Nyay", "Adhikar", "Nagarikta", "Rashtrawaad", "Dharmanirapekshata"],
        syllabus: [
          { unit: "Rajniti Siddhant", topics: ["Swatantrata", "Samata", "Nyay", "Adhikar", "Nagarikta", "Rashtrawaad", "Dharmanirapekshata"] },
        ],
      },
      { name: "Geography (Bhugol)", icon: Globe, stream: "Arts",
        chapters: ["Manaav Bhugol: Prakriti aur Paridrishya", "Vishv Jansankhya", "Jansankhya Sanyojan", "Manaav Vikas", "Prathmik Gatividhiyan", "Dweeteek Gatividhiyan", "Parteeya aur Chaturthaank Gatividhiyan", "Parivahan aur Sanchar", "Antarrashtriya Vyaapar"],
        syllabus: [
          { unit: "Manaav Bhugol Mool Tatv", topics: ["Jansankhya", "Manaav Vikas", "Arthik Gatividhiyan", "Parivahan", "Vyaapar"] },
        ],
      },
      { name: "Hindi (Hindi Sahitya)", icon: Languages, stream: "all",
        chapters: ["Gadya Sahitya", "Padya Sahitya", "Natak aur Ekaanki", "Nibandh", "Vyakaran"],
        syllabus: [
          { unit: "Gadya",    topics: ["Nibandh", "Kahani", "Naatak", "Upanyaas Ansh"] },
          { unit: "Padya",    topics: ["Aadhunik Kavitaa", "Prayogvaad", "Nayi Kavita"] },
          { unit: "Vyakaran", topics: ["Ucchatar Vyakaran", "Sahitya Vigyan", "Rachna"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["Prose", "Poetry", "Drama", "Short Stories", "Grammar", "Composition"],
        syllabus: [
          { unit: "Literature",  topics: ["Prose Selections", "Poetry Analysis", "Drama", "Short Stories"] },
          { unit: "Language",    topics: ["Comprehension", "Essay", "Letter Writing", "Grammar"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
  {
    id: 12, label: "Class 12", tagline: "UP Intermediate – Dwiteeya Varsh",
    streams: ["Science", "Commerce", "Arts"],
    description: "UP Board Intermediate (Class 12) – Dwiteeya Varsh. Final UPMSP board examination. Results determine Higher Education (college admissions, competitive exams like UPTU/AKTU for engineering, CPMT for medical).",
    highlights: ["UPMSP Final Board", "UPTU/AKTU Engineering", "CPMT Medical Prep", "All UP Rank"],
    subjects: [
      { name: "Physics (Bhautiki)", icon: Atom, stream: "Science",
        chapters: ["Stir Vidyut", "Viddyut Dhara", "Gati-Maan Aavesh aur Chumbaktv", "Chumbaktv aur Chaumbakeeya Padarth", "Viddyut Chaumbakeeya Pravartann", "Pradaavartee Dhara", "Viddyut Chaumbakeeya Tarangein", "Prakash – Parvartann aur Apavartann", "Prakash – Tavaran Darshan", "Visharun Ki Dviit Prakriti", "Parmanu", "Naabhik", "Arda Chaalak Yuktiyan"],
        syllabus: [
          { unit: "Stir Vidyut aur Dhara", topics: ["Vidyut Bhaar", "Vidyut Chettra", "Vidyut Vibhav", "Sandharitra", "Ohm Ka Niyam", "Kirchhoff Ke Niyam"] },
          { unit: "Chumbaktv aur Pravartann", topics: ["Biot-Savart Niyam", "Ampere Ka Niyam", "Faraday Ka Niyam", "AC Paripath"] },
          { unit: "Prkash aur Adhunik Bhautiki", topics: ["Parvartann", "Apavartann", "Tavaran Darshan", "Dviit Prakriti", "Parmanu Maadal", "Naabhikeeya Bhaoutiki"] },
        ],
      },
      { name: "Chemistry (Rasayan)", icon: FlaskConical, stream: "Science",
        chapters: ["Thaas Avastha", "Vishleshan", "Vidyut Rasayan", "Rasaayanik Balgati", "Prushth Rasayan", "Tattvaon Ka Nirharann", "p-Khand Tatv", "d aur f Khand Tatv", "Upsahanvala Yaugik", "Haloalkane aur Haloarene", "Alchohaol Phenol Ether", "Aaldehaaida Ketone Karboksalik Amla", "Amine", "Jeev Anu", "Polymer", "Pratideen Jeevann Mein Rasayan"],
        syllabus: [
          { unit: "Bhaautik Rasayan",    topics: ["Thaas Avastha", "Vishleshan", "Vidyut Rasayan", "Balgati", "Prushth Rasayan"] },
          { unit: "Akarbaanik Rasayan",  topics: ["Dhatu Nirharann", "p-Khand", "d aur f Khand", "Upsahanvala Yaugik"] },
          { unit: "Kaarbaanik Rasayan",  topics: ["Halo Yaugik", "Alcohaol", "Carbonyl Yaugik", "Amine", "Jeev Anu"] },
        ],
      },
      { name: "Mathematics (Ganit)", icon: Calculator, stream: "Science",
        chapters: ["Sambandh aur Prakar", "Pratiloma Trikonmiti Prakar", "Aavyuuh aur Avadharak", "Aatyatata aur Avakalan Yogyata", "Avakalan Ke Prayog", "Samaakal", "Samaakal Ke Prayog", "Avakalneeya Samikarana", "Sados", "Teen Aayamee Rekha Ganit", "Rekheey Kramaadesh", "Sambhavna"],
        syllabus: [
          { unit: "Sambandh aur Beejganit", topics: ["Sambandh", "Pratiloma Trikonmiti", "Aavyuuh", "Avadharak"] },
          { unit: "Kalan",                  topics: ["Aatyatata", "Avakalan", "Samaakal", "Avakalneeya Samikarana"] },
          { unit: "Sados aur 3D",           topics: ["Sados Beejganit", "Teen Aayamee Rekha Ganit"] },
          { unit: "Rekheey Kramaadesh aur Sambhavna", topics: ["LPP", "Sambhavna Siddhant"] },
        ],
      },
      { name: "Biology (Jeev Vigyan)", icon: Microscope, stream: "Science",
        chapters: ["Prajann", "Aanuvansikta aur Vikash", "Jeev aur Maanav Kalyaan", "Jeev Proudyogiki", "Paristhiti Vigyan"],
        syllabus: [
          { unit: "Prajann aur Aanuvansikta", topics: ["Jeevon Mein Prajann", "Pushpi Padpon Mein Laingik Prajann", "Maanav Prajann", "Prajann Swasthya", "Aanuvansikta", "DNA Sanrachna", "Vikas"] },
          { unit: "Jeev Praudyogiki",          topics: ["rDNA Taknik", "Transgenic Jeev", "Prayog"] },
          { unit: "Paristhiti Vigyan",         topics: ["Paristhiti Tantra", "Jeev Vividhata", "Paryaavaran"] },
        ],
      },
      { name: "Accountancy (Lekhankan)", icon: BarChart, stream: "Commerce",
        chapters: ["Sajhedaaree Lekhankan", "Sanjha Saajhedaar Ka Pravet", "Sanyukt Sanjha Ka Punargathan", "Saajhedaaree Firm Ka Samapann", "Akshardhan Lekhankan", "Rinpatra", "Vitt Vivarann", "Vitt Vivarannon Ka Vishleshan", "Naakad Pravah Vivarann"],
        syllabus: [
          { unit: "Sajhedaaree",          topics: ["Aadhar", "Pravet", "Punargathan", "Samapann"] },
          { unit: "Company Lekhankan",    topics: ["Akshardhan", "Rinpatra", "Vitt Vivarann"] },
          { unit: "Vishleshan",           topics: ["Anupaat Vishleshan", "Naakad Pravah"] },
        ],
      },
      { name: "Economics (Arthashastra)", icon: BarChart2, stream: "Commerce",
        chapters: ["Samashtee Arthashastra Parichay", "Rashtriya Aay Lekhankan", "Mudra aur Bankking", "Aay aur Rozgaar Nirdharan", "Sarkaar Ka Bajat", "Mukt Arthvyavastha", "Bharat Ka Vikas Anubhav", "Arthik Sudhaar 1991", "Vartamaan Chunautiyan"],
        syllabus: [
          { unit: "Samashtee Arthashastra", topics: ["Rashtriya Aay", "Mudra", "Bankking", "Aay Nirdharan", "Sarkaar Bajat", "Mukt Arthvyavastha"] },
          { unit: "Bharat Ka Arthik Vikas", topics: ["Swatantrata Poorv Arthvyavastha", "Sudhaar 1991", "Vartamaan Chunautiyan"] },
        ],
      },
      { name: "History (Itihas)", icon: BookMarked, stream: "Arts",
        chapters: ["Harappan Sabhyata", "Samrat Ashok", "Maurya Saamrajya", "Gupta Kal", "Bhakti Sufi Parampara", "Mughal Saamrajya", "Angrezon Ka Bharat Aagman", "Swatantrata Sangram", "Vibhajan", "Samvidhan Nirman"],
        syllabus: [
          { unit: "Praacheen Bharat",   topics: ["Harappan Sabhyata", "Vedic Kal", "Maurya", "Gupta"] },
          { unit: "Madhyakaleen Bharat",topics: ["Bhakti Andolan", "Mughal Saamrajya", "Marathe"] },
          { unit: "Aadhunik Bharat",    topics: ["Angrezon Ka Aagman", "Kranti 1857", "Swatantrata Sangram", "Vibhajan", "Samvidhan"] },
        ],
      },
      { name: "Political Science (Rajniti Vigyan)", icon: Shield, stream: "Arts",
        chapters: ["Sheet Yuddh Ka Daur", "Dwidhruveeyata Ka Ant", "US Hegemony", "Dakshin Asia", "Antarrashtriya Sansthaen", "Rashtr Nirman Ki Chunautiyan", "Ek Dalee Raajneeti", "Bharat Ke Baahy Sambandh", "Aalokik Aandolan", "Haaliaa Rajnitik Vikash"],
        syllabus: [
          { unit: "Samkaleen Vishv Rajneeti", topics: ["Sheet Yuddh", "Dwidhruveeyata Ka Ant", "US Hegemon", "Dakshin Asia", "Antarrashtriya Sansthaen"] },
          { unit: "Bharat Mein Swatantrata Ke Baad Rajneeti", topics: ["Rashtr Nirman", "Ek Dalee Raajneeti", "Baahy Sambandh", "Aandolan", "Haaliaa Vikash"] },
        ],
      },
      { name: "Geography (Bhugol)", icon: Globe, stream: "Arts",
        chapters: ["Manav Bhugol", "Vishv Jansankhya", "Manav Vikas", "Prathmik Gatividhiyan", "Dweeteek Gatividhiyan", "Parivahan aur Sanchar", "Antarrashtriya Vyaapar", "Bharat Ki Jansankhya", "Bharat Mein Pravasan", "Bhoomi Sansaadhan", "Jal Sansaadhan", "Bharat Ke Udyog"],
        syllabus: [
          { unit: "Manav Bhugol Ke Mool Tatv",  topics: ["Jansankhya", "Manav Vikas", "Arthik Gatividhiyan", "Parivahan", "Vyaapar"] },
          { unit: "Bharat – Log aur Arthvyavastha",topics: ["Jansankhya", "Pravasan", "Sansaadhan", "Udyog"] },
        ],
      },
      { name: "Hindi (Hindi Sahitya)", icon: Languages, stream: "all",
        chapters: ["Gadya Sahitya", "Padya Sahitya", "Naatak", "Nibandh", "Vyakaran"],
        syllabus: [
          { unit: "Gadya",    topics: ["Kahani", "Nibandh", "Naatak", "Upanyaas Ansh"] },
          { unit: "Padya",    topics: ["Aadhunik Kavitaa", "Prayogvaad", "Nayi Kavita", "Jan Kavita"] },
          { unit: "Vyakaran", topics: ["Rachna Kaushal", "Anuvad", "Vyakaran Vishleshan", "Patra aur Praaroop"] },
        ],
      },
      { name: "English", icon: BookOpen, stream: "all",
        chapters: ["Prose Passages", "Poetry", "Drama", "Grammar", "Composition"],
        syllabus: [
          { unit: "Literature",  topics: ["Prose", "Poetry", "Drama"] },
          { unit: "Language",    topics: ["Reading", "Writing", "Grammar"] },
        ],
      },
      { ...AI_SUBJECT_11_12, stream: "all" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  COMBINED CLASSES MAP
// ─────────────────────────────────────────────────────────────────────────────
const CLASSES = {
  cbse:    CBSE_CLASSES,
  bihar:   BIHAR_CLASSES,
  icse:    ICSE_CLASSES,
  upboard: UPBOARD_CLASSES,
};

// ─────────────────────────────────────────────────────────────────────────────
//  BOARDS
// ─────────────────────────────────────────────────────────────────────────────
const BOARDS = [
  { id: "cbse",    name: "CBSE",        fullName: "Central Board of Secondary Education",       color: "#f97316", accent: "#fff7ed", logo: cbseLogo,  tagline: "National Level • All India Recognition",    abbr: "C" },
  { id: "bihar",   name: "Bihar Board", fullName: "Bihar School Examination Board",             color: "#16a34a", accent: "#f0fdf4", logo: biharLogo, tagline: "State Level • BSEB Certified",               abbr: "B" },
  { id: "icse",    name: "ICSE",        fullName: "Indian Certificate of Secondary Education",  color: "#c2410c", accent: "#fff1ec", logo: icseLogo,  tagline: "National Level • CISCE Board",              abbr: "I" },
  { id: "upboard", name: "UP Board",    fullName: "Uttar Pradesh Madhyamik Shiksha Parishad",   color: "#7c3aed", accent: "#f5f3ff", logo: upLogo,    tagline: "State Level • UPMSP Certified",             abbr: "U" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  PREMIUM CSS
// ─────────────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --green: #1a5c2a;
    --orange: #f47b20;
    --dark: #0f172a;
    --bg: #f8f5f0;
    --white: #ffffff;
    --light-orange: #fff4ec;
    --text: #1e293b;
    --muted: #64748b;
    --nav-bg: rgba(255,255,255,0.92);
    --nav-border: rgba(0,0,0,0.07);
    --nav-text: #1e293b;
    --nav-muted: #64748b;
    --toggle-bg: #f1f5f9;
    --toggle-hover: #e2e8f0;
    --card-bg: #ffffff;
    --card-border: rgba(0,0,0,0.06);
    --glass: rgba(255,255,255,0.7);
    --glass-border: rgba(255,255,255,0.5);
  }

  .sc-wrap.dark-mode {
    --bg: #0b0f1a;
    --white: #111827;
    --dark: #f8fafc;
    --text: #e2e8f0;
    --muted: #94a3b8;
    --light-orange: #1c1410;
    --nav-bg: rgba(17,24,39,0.95);
    --nav-border: rgba(255,255,255,0.07);
    --nav-text: #e2e8f0;
    --nav-muted: #94a3b8;
    --toggle-bg: #1f2937;
    --toggle-hover: #374151;
    --card-bg: #111827;
    --card-border: rgba(255,255,255,0.06);
    --glass: rgba(17,24,39,0.7);
    --glass-border: rgba(255,255,255,0.08);
  }

  .sc-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .sc-wrap {
    font-family: 'Poppins', sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background 0.4s, color 0.4s;
    width: 100%;
    overflow-x: hidden;
  }

  /* ── NAVBAR ── */
  .sc-navbar {
    position: sticky; top: 0; z-index: 200;
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    padding: 0 80px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 24px rgba(0,0,0,0.06);
    transition: background 0.4s, border-color 0.4s;
  }
  .sc-nav-left { display: flex; align-items: center; gap: 32px; }
  .sc-nav-right { display: flex; align-items: center; gap: 12px; }

  .sc-dark-toggle {
    width: 40px; height: 40px; border-radius: 50%;
    border: none; background: var(--toggle-bg);
    color: var(--nav-text);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.3s;
    flex-shrink: 0;
  }
  .sc-dark-toggle:hover { background: var(--toggle-hover); transform: rotate(20deg); }

  .sc-logo-btn {
    display: flex; align-items: center; gap: 10px;
    background: transparent; border: none; cursor: pointer;
    padding: 0; text-decoration: none;
  }
  .sc-logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #f97316, #fb923c);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(249,115,22,0.4);
    flex-shrink: 0;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .sc-logo-btn:hover .sc-logo-icon { transform: scale(1.08); box-shadow: 0 8px 24px rgba(249,115,22,0.5); }
  .sc-logo-text {
    font-family: 'Nunito', sans-serif;
    font-size: 1.6rem; font-weight: 900; letter-spacing: -0.5px;
  }
  .sc-logo-text .l-green  { color: var(--green); }
  .sc-logo-text .l-orange { color: #f97316; }

  /* ── HERO ── */
  .sc-hero {
    position: relative; overflow: hidden;
    background: var(--bg);
    display: flex; align-items: center; justify-content: space-between;
    padding: 80px 80px 80px; min-height: 580px; gap: 48px;
    transition: background 0.4s;
  }
  .sc-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(249,115,22,0.08), transparent),
                radial-gradient(ellipse 40% 60% at 10% 90%, rgba(26,92,42,0.06), transparent);
    pointer-events: none;
  }

  .sc-hero-left { flex: 1; max-width: 580px; position: relative; z-index: 1; }

  .sc-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: 30px; padding: 7px 18px;
    font-size: 0.82rem; font-weight: 600; color: var(--orange);
    margin-bottom: 28px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    transition: background 0.4s;
  }

  .sc-hero-left h1 {
    font-family: 'Nunito', sans-serif;
    font-size: 3.4rem; font-weight: 900; line-height: 1.12;
    color: var(--dark); margin-bottom: 20px;
    letter-spacing: -1px;
  }
  .sc-hero-left h1 .highlight {
    color: var(--orange);
    background: linear-gradient(135deg, #f97316, #fb923c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sc-hero-left p { font-size: 1.05rem; color: var(--muted); line-height: 1.75; margin-bottom: 40px; max-width: 440px; }

  .sc-hero-cta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

  .sc-btn-start {
    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: white; border: none;
    padding: 15px 32px; border-radius: 12px;
    font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(15,23,42,0.3);
  }
  .sc-btn-start:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(15,23,42,0.35); }

  .sc-btn-explore {
    background: transparent; color: var(--dark);
    border: 2px solid var(--card-border);
    padding: 13px 28px; border-radius: 12px;
    font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
    background: var(--card-bg);
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .sc-btn-explore:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-2px); }

  .sc-hero-right { flex: 1; max-width: 520px; position: relative; z-index: 1; }

  .sc-hero-img-wrapper {
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.18);
    height: 400px; position: relative;
  }
  .sc-hero-img-wrapper img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
  .sc-hero-img-wrapper::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,23,42,0.3) 0%, transparent 50%);
  }

  .sc-hero-stats {
    position: absolute; bottom: -24px; left: -24px;
    background: var(--card-bg);
    border-radius: 16px; padding: 16px 24px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.14);
    display: flex; gap: 24px;
    border: 1.5px solid var(--card-border);
    transition: background 0.4s;
    backdrop-filter: blur(10px);
  }
  .sc-stat { text-align: center; }
  .sc-stat-num { font-size: 1.5rem; font-weight: 900; color: var(--dark); font-family: 'Nunito', sans-serif; }
  .sc-stat-label { font-size: 0.7rem; color: var(--muted); font-weight: 500; margin-top: 2px; }

  /* ── DASHBOARD ── */
  .sc-dash-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    margin-bottom: 0;
  }
  .sc-dash-card {
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: 16px; padding: 20px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: transform 0.2s, box-shadow 0.2s, background 0.4s;
    cursor: default;
  }
  .sc-dash-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.1); }
  .sc-dash-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sc-dash-label { font-size: 0.75rem; color: var(--muted); font-weight: 500; }
  .sc-dash-val   { font-size: 1.3rem; font-weight: 800; color: var(--dark); font-family: 'Nunito', sans-serif; }

  /* ── SEARCH BAR ── */
  .sc-search-wrap {
    display: flex; align-items: center; gap: 12px;
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: 14px; padding: 12px 20px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.4s;
    margin-bottom: 28px;
  }
  .sc-search-wrap:focus-within { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
  .sc-search-input {
    border: none; background: transparent; font-family: 'Poppins', sans-serif;
    font-size: 0.95rem; color: var(--text); flex: 1; outline: none;
  }
  .sc-search-input::placeholder { color: var(--muted); }

  /* ── SECTION COMMON ── */
  .sc-section { padding: 80px 80px; }
  .sc-section-alt { background: var(--card-bg); transition: background 0.4s; }

  .sc-section-tag {
    display: inline-block;
    background: linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.06));
    color: var(--orange); font-size: 0.78rem; font-weight: 700;
    padding: 5px 16px; border-radius: 20px;
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;
    border: 1px solid rgba(249,115,22,0.2);
    transition: background 0.4s;
  }

  .sc-section-title {
    font-family: 'Nunito', sans-serif; font-size: 2.4rem; font-weight: 900;
    color: var(--dark); margin-bottom: 12px; letter-spacing: -0.5px;
  }
  .sc-section-title span { color: var(--orange); }
  .sc-section-sub { color: var(--muted); font-size: 1rem; margin-bottom: 52px; max-width: 520px; line-height: 1.7; }

  /* ── COMPETITIVE EXAMS ── */
  .sc-comp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  .sc-comp-card {
    background: var(--card-bg);
    border-radius: 20px; padding: 28px;
    border: 1.5px solid var(--card-border);
    display: flex; align-items: flex-start; gap: 20px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s, border-color 0.3s, background 0.4s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
  .sc-comp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--comp-color), var(--comp-color)88);
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
  }
  .sc-comp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.12); border-color: var(--comp-color); }
  .sc-comp-card:hover::before { transform: scaleX(1); }

  .sc-comp-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; margin-top: 2px; }
  .sc-comp-body { flex: 1; min-width: 0; }
  .sc-comp-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
  .sc-comp-code { font-family: 'Nunito', sans-serif; font-size: 1.8rem; font-weight: 900; line-height: 1; }
  .sc-comp-tag { font-size: 0.66rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; font-family: 'Poppins', sans-serif; letter-spacing: 0.4px; }
  .sc-comp-label { font-size: 0.8rem; color: var(--muted); margin-bottom: 12px; }
  .sc-comp-subjects { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .sc-comp-pill { font-size: 0.67rem; padding: 3px 10px; border-radius: 10px; font-weight: 600; }
  .sc-comp-cta {
    border: none; padding: 9px 20px; border-radius: 10px;
    font-family: 'Poppins', sans-serif; font-size: 0.8rem; font-weight: 700;
    cursor: pointer; color: white; transition: opacity 0.2s, transform 0.15s;
    display: inline-block;
  }
  .sc-comp-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  /* ── FEATURES ── */
  .sc-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .sc-feature-card {
    background: var(--bg); border-radius: 18px; padding: 30px;
    border: 1.5px solid var(--card-border);
    transition: transform 0.2s, box-shadow 0.2s, background 0.4s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  }
  .sc-feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.08); }
  .sc-feature-icon {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05));
    border-radius: 14px; display: flex; align-items: center; justify-content: center;
    color: var(--orange); margin-bottom: 16px;
    border: 1px solid rgba(249,115,22,0.15);
  }
  .sc-feature-title { font-weight: 700; font-size: 1.05rem; color: var(--dark); margin-bottom: 10px; }
  .sc-feature-text { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }

  /* ── MENTORS ── */
  .sc-mentor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .sc-mentor-card {
    background: var(--card-bg); border-radius: 20px; padding: 28px;
    display: flex; align-items: center; gap: 18px;
    border: 1.5px solid var(--card-border);
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    transition: transform 0.2s, box-shadow 0.2s, background 0.4s;
  }
  .sc-mentor-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(249,115,22,0.1); }
  .sc-mentor-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, var(--orange), #fb923c);
    display: flex; align-items: center; justify-content: center;
    color: white; flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
  }
  .sc-mentor-name { font-weight: 700; font-size: 1rem; color: var(--dark); }
  .sc-mentor-sub  { font-size: 0.8rem; color: var(--orange); font-weight: 600; margin-bottom: 4px; }
  .sc-mentor-exp  { font-size: 0.78rem; color: var(--muted); }

  /* ── CTA BANNER ── */
  .sc-cta-banner {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    margin: 0 80px 80px;
    border-radius: 24px; padding: 60px 72px;
    display: flex; align-items: center; justify-content: space-between; gap: 40px;
    box-shadow: 0 24px 64px rgba(15,23,42,0.3);
    position: relative; overflow: hidden;
    transition: background 0.4s;
  }
  .sc-cta-banner::before {
    content: ''; position: absolute; top: -60px; right: -40px;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.2), transparent 70%);
  }
  .sc-cta-banner h2 {
    font-family: 'Nunito', sans-serif; font-size: 2.2rem; font-weight: 900;
    color: #f8fafc; max-width: 460px; line-height: 1.25; letter-spacing: -0.5px;
  }
  .sc-cta-banner h2 span { color: var(--orange); }
  .sc-cta-banner p { color: rgba(255,255,255,0.55); margin-top: 12px; font-size: 0.97rem; }
  .sc-btn-cta-white {
    background: white; color: #0f172a;
    border: none; padding: 15px 36px; border-radius: 12px;
    font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: all 0.2s; position: relative; z-index: 1;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
  .sc-btn-cta-white:hover { background: var(--orange); color: white; transform: translateY(-2px); }

  /* ── FOOTER ── */
  .sc-footer {
    background: var(--card-bg); border-top: 1px solid var(--card-border);
    padding: 28px 80px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.85rem; color: var(--muted);
    transition: background 0.4s, border-color 0.4s; flex-wrap: wrap; gap: 12px;
  }

  /* ════════════════════════════════
     BOARD PORTAL  (.scp- prefix)
  ════════════════════════════════ */

  .scp-back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--card-bg); border: 1.5px solid var(--card-border);
    border-radius: 12px; padding: 9px 20px;
    font-size: 0.85rem; font-weight: 600; color: var(--dark);
    cursor: pointer; margin-bottom: 24px;
    transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .scp-back-btn:hover { background: var(--light-orange); color: var(--orange); border-color: var(--orange); transform: translateX(-2px); }

  .scp-breadcrumb {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.8rem; font-weight: 600; color: var(--muted);
    margin-bottom: 32px; flex-wrap: wrap;
  }
  .scp-bc-sep { opacity: 0.4; }

  /* BOARD CARDS */
  .scp-boards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  .scp-board-card {
    background: var(--card-bg); border-radius: 24px; padding: 32px 24px;
    border: 1.5px solid var(--card-border); cursor: pointer;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
    transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s, border-color 0.3s, background 0.4s;
    position: relative; overflow: hidden;
  }
  .scp-board-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--bc-color, var(--orange));
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s;
  }
  .scp-board-card:hover { transform: translateY(-8px); box-shadow: 0 24px 56px rgba(0,0,0,0.14); }
  .scp-board-card:hover::before { transform: scaleX(1); }

  .scp-board-logo-wrap {
    width: 64px; height: 64px; margin-bottom: 16px; border-radius: 16px;
    overflow: hidden; display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--card-border); background: var(--bg);
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    transition: background 0.4s;
    flex-shrink: 0;
  }
  .scp-board-logo-wrap img { width: 100%; height: 100%; object-fit: contain; }
  .scp-board-logo-abbr {
    font-size: 1.6rem; font-weight: 900; font-family: 'Nunito', sans-serif;
  }

  .scp-board-name  { font-size: 1.3rem; font-weight: 900; margin-bottom: 4px; font-family: 'Nunito', sans-serif; }
  .scp-board-full  { font-size: 0.73rem; color: var(--muted); font-weight: 500; margin-bottom: 12px; line-height: 1.45; }

  .scp-board-tagline {
    display: inline-block; border-radius: 8px; padding: 4px 12px;
    font-size: 0.7rem; font-weight: 700; margin-bottom: 18px;
    letter-spacing: 0.3px;
  }

  .scp-board-pills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 18px; }
  .scp-class-pill {
    border-radius: 8px; padding: 3px 10px;
    font-size: 0.7rem; font-weight: 700; font-family: 'Poppins', sans-serif;
  }

  .scp-board-cta {
    width: 100%; border: none; border-radius: 12px; padding: 11px 0;
    color: white; font-family: 'Poppins', sans-serif;
    font-size: 0.84rem; font-weight: 700; cursor: pointer; text-align: center;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
  }
  .scp-board-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  /* CLASSES */
  .scp-classes-header { display: flex; align-items: center; gap: 20px; margin-bottom: 36px; flex-wrap: wrap; }
  .scp-ch-icon-wrap {
    width: 64px; height: 64px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    color: white; flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  }
  .scp-ch-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .scp-ch-title { font-family: 'Nunito', sans-serif; font-size: 1.8rem; font-weight: 900; color: var(--dark); margin-bottom: 2px; }
  .scp-ch-sub   { font-size: 0.82rem; color: var(--muted); font-weight: 500; }

  .scp-classes-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  .scp-class-card {
    background: var(--card-bg); border-radius: 20px;
    border: 1.5px solid var(--card-border); overflow: hidden;
    cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    transition: transform 0.25s, box-shadow 0.25s, background 0.4s;
  }
  .scp-class-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
  .scp-class-card-header { padding: 24px 22px; color: white; position: relative; overflow: hidden; }
  .scp-class-card-header::after {
    content: ''; position: absolute; top: -20px; right: -20px;
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.1);
  }
  .scp-cc-icon-wrap {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }
  .scp-cc-label { font-size: 1.55rem; font-weight: 900; font-family: 'Nunito', sans-serif; }
  .scp-cc-tag   { font-size: 0.72rem; opacity: 0.88; font-weight: 600; margin-top: 4px; }

  .scp-class-card-body { padding: 18px 22px; }
  .scp-class-card-body p { font-size: 0.78rem; color: var(--muted); line-height: 1.55; margin-bottom: 14px; }
  .scp-subject-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
  .scp-subject-tag {
    border-radius: 8px; padding: 3px 10px;
    font-size: 0.68rem; font-weight: 700; font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 4px;
  }
  .scp-class-cta {
    width: 100%; border: none; border-radius: 10px; padding: 10px 0;
    color: white; font-family: 'Poppins', sans-serif;
    font-size: 0.8rem; font-weight: 700; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.18);
  }
  .scp-class-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  /* STREAMS */
  .scp-stream-tabs {
    display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .scp-stream-tab {
    padding: 9px 24px; border-radius: 50px;
    font-size: 0.85rem; font-weight: 700; cursor: pointer;
    border: 1.5px solid var(--card-border);
    background: var(--card-bg); color: var(--muted);
    transition: all 0.2s; font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 7px;
  }
  .scp-stream-tab.active { color: white; border-color: transparent; box-shadow: 0 4px 14px rgba(0,0,0,0.2); }
  .scp-stream-tab:hover:not(.active) { border-color: var(--orange); color: var(--orange); }

  /* CLASS HERO */
  .scp-class-hero {
    border-radius: 24px; padding: 40px 36px; margin-bottom: 36px;
    color: white; position: relative; overflow: hidden;
  }
  .scp-class-hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }
  .scp-hero-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.82; margin-bottom: 10px; }
  .scp-hero-h2 { font-family: 'Nunito', sans-serif; font-size: 2rem; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.5px; }
  .scp-hero-desc { font-size: 0.92rem; line-height: 1.72; opacity: 0.88; max-width: 700px; margin-bottom: 24px; }
  .scp-highlights { display: flex; gap: 8px; flex-wrap: wrap; }
  .scp-highlight-tag {
    background: rgba(255,255,255,0.18); backdrop-filter: blur(4px);
    border-radius: 8px; padding: 5px 14px;
    font-size: 0.75rem; font-weight: 600;
    border: 1px solid rgba(255,255,255,0.2);
  }

  /* SUBJECTS */
  .scp-subjects-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  .scp-subjects-header h3 { font-size: 1.2rem; font-weight: 800; color: var(--dark); font-family: 'Nunito', sans-serif; }
  .scp-count-badge { border-radius: 10px; padding: 4px 14px; font-size: 0.75rem; font-weight: 700; }

  .scp-subjects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }

  .scp-subject-card {
    background: var(--card-bg); border: 1.5px solid var(--card-border);
    border-radius: 18px; padding: 24px 20px; cursor: pointer;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: transform 0.25s, box-shadow 0.25s, background 0.4s, border-color 0.25s;
    position: relative; overflow: hidden;
  }
  .scp-subject-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--subj-color, var(--orange));
    transform: scaleX(0); transform-origin: left; transition: transform 0.25s;
  }
  .scp-subject-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
  .scp-subject-card:hover::before { transform: scaleX(1); }
  .scp-subject-card.ai-card { background: linear-gradient(135deg, rgba(139,92,246,0.05), rgba(59,130,246,0.05)); border-color: rgba(139,92,246,0.25); }

  .scp-sub-icon-wrap {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px; flex-shrink: 0;
    transition: transform 0.2s;
  }
  .scp-subject-card:hover .scp-sub-icon-wrap { transform: scale(1.08); }

  .scp-sub-name   { font-size: 1.05rem; font-weight: 800; color: var(--dark); margin-bottom: 5px; font-family: 'Nunito', sans-serif; }
  .scp-sub-meta   { font-size: 0.73rem; color: var(--muted); margin-bottom: 14px; }
  .scp-sub-tags   { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
  .scp-sub-tag    { border-radius: 6px; padding: 3px 10px; font-size: 0.67rem; font-weight: 700; }
  .scp-sub-cta {
    width: 100%; border: none; border-radius: 10px; padding: 9px 0;
    color: white; font-family: 'Poppins', sans-serif;
    font-size: 0.78rem; font-weight: 700; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.18);
  }
  .scp-sub-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  /* SUBJECT DETAIL */
  .scp-subj-header-card {
    background: var(--card-bg); border: 1.5px solid var(--card-border);
    border-radius: 22px; padding: 32px 32px 0; margin-bottom: 24px;
    transition: background 0.4s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
  .scp-subj-header-top { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
  .scp-subj-big-icon {
    width: 72px; height: 72px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }
  .scp-subj-board-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
  .scp-subj-name { font-family: 'Nunito', sans-serif; font-size: 1.8rem; font-weight: 900; color: var(--dark); margin-top: 2px; letter-spacing: -0.3px; }
  .scp-subj-meta { font-size: 0.8rem; color: var(--muted); margin-top: 5px; }

  .scp-tabs {
    display: flex; gap: 2px;
    border-top: 1.5px solid var(--card-border);
    margin-top: 4px; overflow-x: auto;
    scrollbar-width: none;
  }
  .scp-tabs::-webkit-scrollbar { display: none; }
  .scp-tab-btn {
    cursor: pointer; padding: 13px 24px;
    border-radius: 10px 10px 0 0;
    font-size: 0.84rem; font-weight: 700; border: none;
    border-bottom: 3px solid transparent;
    transition: all 0.2s; background: transparent; color: var(--muted);
    font-family: 'Poppins', sans-serif; white-space: nowrap;
    display: flex; align-items: center; gap: 7px;
  }
  .scp-tab-btn.active { color: white; }
  .scp-tab-btn:not(.active):hover { color: var(--dark); background: var(--bg); }

  /* TAB CONTENT */
  .scp-chapters-box {
    background: var(--card-bg); border-radius: 20px;
    border: 1.5px solid var(--card-border); padding: 28px;
    transition: background 0.4s;
  }
  .scp-chapters-box h3 { font-size: 1.05rem; font-weight: 800; color: var(--dark); margin-bottom: 20px; font-family: 'Nunito', sans-serif; }
  .scp-chapter-pills { display: flex; flex-wrap: wrap; gap: 4px; }
  .scp-chapter-pill {
    background: var(--light-orange); border-radius: 20px;
    padding: 6px 16px; font-size: 0.78rem; font-weight: 600;
    color: var(--text); margin: 3px; display: inline-flex; align-items: center; gap: 6px;
    transition: background 0.3s, transform 0.15s;
    cursor: default; border: 1px solid rgba(249,115,22,0.12);
  }
  .scp-chapter-pill:hover { transform: scale(1.03); }

  .scp-study-tip {
    margin-top: 24px; border-radius: 14px; padding: 18px 22px;
    display: flex; align-items: flex-start; gap: 12px;
  }
  .scp-tip-label { font-size: 0.84rem; font-weight: 800; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .scp-study-tip p { font-size: 0.8rem; color: var(--muted); line-height: 1.65; }

  .scp-coming-soon {
    background: var(--card-bg); border-radius: 20px;
    border: 1.5px solid var(--card-border); padding: 56px 28px;
    text-align: center; transition: background 0.4s;
  }
  .scp-coming-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05));
    display: flex; align-items: center; justify-content: center;
    color: var(--orange); margin: 0 auto 16px;
    border: 1px solid rgba(249,115,22,0.2);
  }
  .scp-coming-title { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 800; color: var(--dark); margin-bottom: 8px; }
  .scp-coming-sub { font-size: 0.85rem; color: var(--muted); }

  .scp-syllabus-meta { margin-bottom: 20px; font-size: 0.83rem; color: var(--muted); font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .scp-syllabus-unit {
    background: var(--card-bg); border-radius: 16px; margin-bottom: 12px;
    padding: 20px 22px; border: 1.5px solid var(--card-border);
    transition: background 0.4s, box-shadow 0.2s;
  }
  .scp-syllabus-unit:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
  .scp-unit-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
  .scp-unit-num {
    color: white; border-radius: 10px;
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 800; flex-shrink: 0;
  }
  .scp-unit-title { font-size: 0.93rem; font-weight: 800; color: var(--dark); font-family: 'Nunito', sans-serif; }
  .scp-topic-item {
    padding: 5px 16px; font-size: 0.81rem; color: var(--muted);
    border-left: 3px solid var(--card-border); margin: 5px 0; line-height: 1.5;
    display: flex; align-items: center; gap: 8px;
    transition: color 0.15s;
  }
  .scp-topic-item:hover { color: var(--text); }

  /* ════════════════════════════════
     RESPONSIVE
  ════════════════════════════════ */
  @media (max-width: 1200px) {
    .sc-navbar { padding: 0 48px; }
    .sc-hero { padding: 72px 48px 64px; }
    .sc-section { padding: 72px 48px; }
    .sc-cta-banner { margin: 0 48px 72px; padding: 48px 48px; }
    .sc-footer { padding: 24px 48px; }
    .scp-boards-grid { grid-template-columns: repeat(2, 1fr); }
    .scp-classes-grid { grid-template-columns: repeat(2, 1fr); }
    .sc-dash-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 1024px) {
    .sc-navbar { padding: 0 32px; }
    .sc-hero { padding: 72px 32px 56px; gap: 32px; }
    .sc-hero-left h1 { font-size: 2.6rem; }
    .sc-hero-right { max-width: 420px; }
    .sc-hero-img-wrapper { height: 340px; }
    .sc-section { padding: 64px 32px; }
    .sc-section-title { font-size: 2rem; }
    .sc-features-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .sc-mentor-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .sc-comp-row { grid-template-columns: 1fr 1fr; gap: 16px; }
    .sc-cta-banner { margin: 0 32px 64px; padding: 40px 40px; gap: 28px; }
    .sc-footer { padding: 20px 32px; }
    .scp-boards-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .scp-classes-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .scp-subjects-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  }
  @media (max-width: 768px) {
    .sc-navbar { padding: 0 20px; height: 58px; }
    .sc-logo-text { font-size: 1.35rem; }
    .sc-logo-icon { width: 36px; height: 36px; }
    .sc-hero { flex-direction: column; padding: 64px 20px 56px; min-height: auto; gap: 36px; }
    .sc-hero-left { max-width: 100%; }
    .sc-hero-left h1 { font-size: 2rem; }
    .sc-hero-left p { max-width: 100%; }
    .sc-hero-right { max-width: 100%; width: 100%; }
    .sc-hero-img-wrapper { height: 260px; }
    .sc-hero-stats { left: 50%; transform: translateX(-50%); bottom: -24px; width: max-content; }
    .sc-section { padding: 56px 20px; }
    .sc-section-title { font-size: 1.8rem; }
    .sc-features-grid { grid-template-columns: 1fr; gap: 16px; }
    .sc-mentor-grid { grid-template-columns: 1fr; gap: 16px; }
    .sc-comp-row { grid-template-columns: 1fr; gap: 14px; }
    .sc-cta-banner { margin: 0 20px 56px; padding: 36px 28px; flex-direction: column; text-align: center; }
    .sc-cta-banner h2 { font-size: 1.7rem; max-width: 100%; }
    .sc-footer { padding: 20px; flex-direction: column; text-align: center; }
    .sc-dash-row { grid-template-columns: repeat(2, 1fr); }
    .scp-boards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .scp-classes-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .scp-class-hero { padding: 28px 22px; border-radius: 18px; }
    .scp-hero-h2 { font-size: 1.5rem; }
    .scp-subjects-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
    .scp-subj-header-card { padding: 22px 20px 0; }
    .scp-subj-name { font-size: 1.4rem; }
  }
  @media (max-width: 540px) {
    .sc-navbar { padding: 0 16px; }
    .sc-hero { padding: 60px 16px 44px; gap: 28px; }
    .sc-hero-left h1 { font-size: 1.7rem; }
    .sc-hero-badge { font-size: 0.72rem; padding: 5px 13px; }
    .sc-hero-img-wrapper { height: 220px; }
    .sc-hero-stats { gap: 14px; padding: 12px 18px; }
    .sc-stat-num { font-size: 1.2rem; }
    .sc-section { padding: 48px 16px; }
    .sc-section-title { font-size: 1.55rem; }
    .sc-comp-card { flex-direction: column; gap: 14px; }
    .sc-feature-card { padding: 22px; }
    .sc-mentor-card { flex-direction: column; text-align: center; gap: 14px; }
    .sc-cta-banner { margin: 0 16px 44px; padding: 32px 20px; }
    .sc-cta-banner h2 { font-size: 1.45rem; }
    .sc-footer { padding: 16px; font-size: 0.78rem; }
    .sc-dash-row { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .scp-boards-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .scp-board-card { padding: 20px 16px; }
    .scp-board-name { font-size: 1rem; }
    .scp-classes-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .scp-subjects-grid { grid-template-columns: 1fr; gap: 10px; }
    .scp-class-hero { padding: 22px 16px; }
    .scp-hero-h2 { font-size: 1.25rem; }
    .scp-hero-desc { font-size: 0.83rem; }
    .scp-subj-header-card { padding: 18px 16px 0; }
    .scp-subj-big-icon { width: 56px; height: 56px; }
    .scp-subj-name { font-size: 1.25rem; }
    .scp-tab-btn { padding: 11px 16px; font-size: 0.78rem; }
    .scp-chapter-pill { font-size: 0.73rem; padding: 4px 12px; }
  }
  @media (max-width: 380px) {
    .sc-hero-left h1 { font-size: 1.5rem; }
    .sc-logo-text { font-size: 1.1rem; }
    .scp-boards-grid { grid-template-columns: 1fr; }
    .scp-classes-grid { grid-template-columns: 1fr; }
    .sc-hero-stats { flex-wrap: wrap; justify-content: center; gap: 10px; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  SUBJECT COLOR MAP
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECT_COLORS = {
  "Mathematics": { bg: "rgba(59,130,246,0.1)", icon: "#3b82f6", btn: "#3b82f6" },
  "Ganit": { bg: "rgba(59,130,246,0.1)", icon: "#3b82f6", btn: "#3b82f6" },
  "Mathematics (Ganit)": { bg: "rgba(59,130,246,0.1)", icon: "#3b82f6", btn: "#3b82f6" },
  "Science": { bg: "rgba(16,185,129,0.1)", icon: "#10b981", btn: "#10b981" },
  "Science (Vigyan)": { bg: "rgba(16,185,129,0.1)", icon: "#10b981", btn: "#10b981" },
  "Vigyan": { bg: "rgba(16,185,129,0.1)", icon: "#10b981", btn: "#10b981" },
  "Physics": { bg: "rgba(99,102,241,0.1)", icon: "#6366f1", btn: "#6366f1" },
  "Physics (Bhautiki)": { bg: "rgba(99,102,241,0.1)", icon: "#6366f1", btn: "#6366f1" },
  "Bhautiki": { bg: "rgba(99,102,241,0.1)", icon: "#6366f1", btn: "#6366f1" },
  "Chemistry": { bg: "rgba(16,185,129,0.1)", icon: "#10b981", btn: "#10b981" },
  "Chemistry (Rasayan)": { bg: "rgba(16,185,129,0.1)", icon: "#10b981", btn: "#10b981" },
  "Rasayan": { bg: "rgba(16,185,129,0.1)", icon: "#10b981", btn: "#10b981" },
  "Biology": { bg: "rgba(34,197,94,0.1)", icon: "#22c55e", btn: "#22c55e" },
  "Biology (Jeev Vigyan)": { bg: "rgba(34,197,94,0.1)", icon: "#22c55e", btn: "#22c55e" },
  "Jeev Vigyan": { bg: "rgba(34,197,94,0.1)", icon: "#22c55e", btn: "#22c55e" },
  "Social Science": { bg: "rgba(245,158,11,0.1)", icon: "#f59e0b", btn: "#f59e0b" },
  "English": { bg: "rgba(249,115,22,0.1)", icon: "#f97316", btn: "#f97316" },
  "Hindi": { bg: "rgba(239,68,68,0.1)", icon: "#ef4444", btn: "#ef4444" },
  "Hindi (Hindi Sahitya)": { bg: "rgba(239,68,68,0.1)", icon: "#ef4444", btn: "#ef4444" },
  "Hindi Sahitya": { bg: "rgba(239,68,68,0.1)", icon: "#ef4444", btn: "#ef4444" },
  "Sanskrit": { bg: "rgba(234,179,8,0.1)", icon: "#eab308", btn: "#eab308" },
  "Accountancy": { bg: "rgba(20,184,166,0.1)", icon: "#14b8a6", btn: "#14b8a6" },
  "Accountancy (Lekhankan)": { bg: "rgba(20,184,166,0.1)", icon: "#14b8a6", btn: "#14b8a6" },
  "Lekhankan": { bg: "rgba(20,184,166,0.1)", icon: "#14b8a6", btn: "#14b8a6" },
  "Accounts": { bg: "rgba(20,184,166,0.1)", icon: "#14b8a6", btn: "#14b8a6" },
  "Business Studies": { bg: "rgba(6,182,212,0.1)", icon: "#06b6d4", btn: "#06b6d4" },
  "Economics": { bg: "rgba(234,179,8,0.1)", icon: "#eab308", btn: "#eab308" },
  "Economics (Arthashastra)": { bg: "rgba(234,179,8,0.1)", icon: "#eab308", btn: "#eab308" },
  "Arthashastra": { bg: "rgba(234,179,8,0.1)", icon: "#eab308", btn: "#eab308" },
  "History": { bg: "rgba(168,85,247,0.1)", icon: "#a855f7", btn: "#a855f7" },
  "History (Itihas)": { bg: "rgba(168,85,247,0.1)", icon: "#a855f7", btn: "#a855f7" },
  "Itihas": { bg: "rgba(168,85,247,0.1)", icon: "#a855f7", btn: "#a855f7" },
  "Political Science": { bg: "rgba(244,63,94,0.1)", icon: "#f43f5e", btn: "#f43f5e" },
  "Political Science (Rajniti Vigyan)": { bg: "rgba(244,63,94,0.1)", icon: "#f43f5e", btn: "#f43f5e" },
  "Geography": { bg: "rgba(14,165,233,0.1)", icon: "#0ea5e9", btn: "#0ea5e9" },
  "Geography (Bhugol)": { bg: "rgba(14,165,233,0.1)", icon: "#0ea5e9", btn: "#0ea5e9" },
  "History & Civics": { bg: "rgba(168,85,247,0.1)", icon: "#a855f7", btn: "#a855f7" },
  "Artificial Intelligence": { bg: "rgba(139,92,246,0.1)", icon: "#8b5cf6", btn: "linear-gradient(135deg,#8b5cf6,#3b82f6)" },
};

const getSubjectColors = (name) =>
  SUBJECT_COLORS[name] || { bg: "rgba(249,115,22,0.1)", icon: "#f97316", btn: "#f97316" };

// ─────────────────────────────────────────────────────────────────────────────
//  TABS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "chapters",  label: "Chapters",     Icon: BookOpen },
  { key: "syllabus",  label: "Syllabus",     Icon: FileText },
  { key: "notes",     label: "Notes",        Icon: PenTool },
  { key: "pyq",       label: "PYQ",          Icon: FileQuestion },
  { key: "mcq",       label: "MCQ Practice", Icon: Target },
  { key: "ai",        label: "AI Assistant", Icon: Brain },
];

// ─────────────────────────────────────────────────────────────────────────────
//  BOARD PORTAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function BoardPortal() {
  const [portalPage, setPortalPage]           = useState("home");
  const [selectedBoard, setSelectedBoard]     = useState(null);
  const [selectedClass, setSelectedClass]     = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTab, setActiveTab]             = useState("chapters");
  const [activeStream, setActiveStream]       = useState("all");
  const [search, setSearch]                   = useState("");

  const getBoard     = () => BOARDS.find((b) => b.id === selectedBoard);
  const getClassData = () => selectedClass ? (CLASSES[selectedBoard] || []).find((c) => c.id === selectedClass) : null;
  const getSubjData  = () => {
    const cls = getClassData();
    return cls && selectedSubject ? cls.subjects.find((s) => s.name === selectedSubject) : null;
  };

  const goHome = () => { setPortalPage("home"); setSelectedBoard(null); setSelectedClass(null); setSelectedSubject(null); setSearch(""); };
  const goClasses = (boardId) => { setSelectedBoard(boardId); setPortalPage("classes"); setSelectedClass(null); setSelectedSubject(null); setSearch(""); };
  const goClassDetail = (classId) => {
    const cls = (CLASSES[selectedBoard] || []).find(c => c.id === classId);
    setSelectedClass(classId); setPortalPage("classDetail"); setSelectedSubject(null);
    setActiveTab("chapters");
    setActiveStream(cls?.streams ? cls.streams[0] : "all");
    setSearch("");
  };
  const goSubject = (subjectName) => { setSelectedSubject(subjectName); setPortalPage("subject"); setActiveTab("chapters"); };
  const goBack = () => {
    if (portalPage === "subject")          { setPortalPage("classDetail"); setSelectedSubject(null); }
    else if (portalPage === "classDetail") { setPortalPage("classes"); setSelectedClass(null); }
    else if (portalPage === "classes")     { setPortalPage("home"); setSelectedBoard(null); }
  };

  const board = getBoard();
  const cls   = getClassData();
  const subj  = getSubjData();

  const Breadcrumb = () => {
    if (portalPage === "home") return null;
    return (
      <div className="scp-breadcrumb">
        <span style={{ cursor: "pointer", color: "var(--orange)" }} onClick={goHome}>Boards</span>
        {board && (
          <>
            <ChevronRight size={13} className="scp-bc-sep" />
            <span style={{ cursor: "pointer", color: board.color }} onClick={() => goClasses(board.id)}>{board.name}</span>
          </>
        )}
        {cls && (
          <>
            <ChevronRight size={13} className="scp-bc-sep" />
            <span style={{ cursor: "pointer", color: "var(--text)" }} onClick={() => goClassDetail(cls.id)}>{cls.label}</span>
          </>
        )}
        {subj && (
          <>
            <ChevronRight size={13} className="scp-bc-sep" />
            <span style={{ color: "var(--orange)" }}>{subj.name}</span>
          </>
        )}
      </div>
    );
  };

  const BackBtn = () =>
    portalPage !== "home" ? (
      <button className="scp-back-btn" onClick={goBack}>
        <ArrowLeft size={15} /> Back
      </button>
    ) : null;

  // ── HOME ──
  if (portalPage === "home") {
    const filteredBoards = BOARDS.filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.fullName.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <>
        <div className="sc-section-tag">School Program</div>
        <h2 className="sc-section-title">Choose Your <span>Board</span></h2>
        <p className="sc-section-sub">Complete study material for CBSE, Bihar Board, UP Board, and ICSE — all in one place with real syllabus.</p>

        {/* SEARCH */}
        <div className="sc-search-wrap">
          <Search size={18} color="var(--muted)" />
          <input className="sc-search-input" placeholder="Search board..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* DASHBOARD */}
        <div className="sc-dash-row" style={{ marginBottom: 36 }}>
          {dashCards.map(dc => (
            <div className="sc-dash-card" key={dc.label}>
              <div className="sc-dash-icon" style={{ background: dc.color + "18" }}>
                <dc.icon size={22} color={dc.color} />
              </div>
              <div>
                <div className="sc-dash-label">{dc.label}</div>
                <div className="sc-dash-val">{dc.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="scp-boards-grid">
          {filteredBoards.map((b) => (
            <div key={b.id} className="scp-board-card" style={{ "--bc-color": b.color }} onClick={() => goClasses(b.id)}>
              <div className="scp-board-logo-wrap" style={{ borderColor: b.color + "30" }}>
                {b.logo
                  ? <img src={b.logo} alt={b.name} />
                  : <span className="scp-board-logo-abbr" style={{ color: b.color }}>{b.abbr}</span>
                }
              </div>
              <div className="scp-board-name" style={{ color: b.color }}>{b.name}</div>
              <div className="scp-board-full">{b.fullName}</div>
              <div className="scp-board-tagline" style={{ background: b.accent, color: b.color }}>{b.tagline}</div>
              <div className="scp-board-pills">
                {[9, 10, 11, 12].map((c) => (
                  <span key={c} className="scp-class-pill" style={{ background: b.color + "18", color: b.color }}>Cl {c}</span>
                ))}
              </div>
              <button className="scp-board-cta" style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}cc)` }}>
                Explore Classes →
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  // ── CLASSES ──
  if (portalPage === "classes" && board) {
    const boardClasses = CLASSES[board.id] || [];
    const filtered = boardClasses.filter(c =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <>
        <BackBtn />
        <Breadcrumb />
        <div className="scp-classes-header">
          <div className="scp-ch-icon-wrap" style={{ background: `linear-gradient(135deg, ${board.color}, ${board.color}cc)` }}>
            {board.logo
              ? <img src={board.logo} alt={board.name} style={{ width: 36, height: 36, objectFit: "contain" }} />
              : <GraduationCap size={28} color="white" />
            }
          </div>
          <div>
            <div className="scp-ch-label" style={{ color: board.color }}>{board.name}</div>
            <div className="scp-ch-title">{board.fullName}</div>
            <div className="scp-ch-sub">Select your class — 9 to 12</div>
          </div>
        </div>

        <div className="sc-search-wrap">
          <Search size={18} color="var(--muted)" />
          <input className="sc-search-input" placeholder="Search class..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="scp-classes-grid">
          {filtered.map((c) => {
            const preview = c.description.substring(0, 105) + "...";
            return (
              <div key={c.id} className="scp-class-card" onClick={() => goClassDetail(c.id)}>
                <div className="scp-class-card-header" style={{ background: `linear-gradient(135deg, ${board.color}, ${board.color}bb)` }}>
                  <div className="scp-cc-icon-wrap"><GraduationCap size={20} /></div>
                  <div className="scp-cc-label">{c.label}</div>
                  <div className="scp-cc-tag">{c.tagline}</div>
                </div>
                <div className="scp-class-card-body">
                  <p>{preview}</p>
                  <div className="scp-subject-tags">
                    {c.subjects.slice(0, 3).map((s) => {
                      const sc = getSubjectColors(s.name);
                      const SIcon = s.icon;
                      return (
                        <span key={s.name} className="scp-subject-tag" style={{ background: sc.bg, color: sc.icon }}>
                          <SIcon size={11} />
                          {s.name.length > 12 ? s.name.substring(0, 12) + "…" : s.name}
                        </span>
                      );
                    })}
                  </div>
                  <button className="scp-class-cta" style={{ background: `linear-gradient(135deg, ${board.color}, ${board.color}cc)` }}>View Details →</button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ── CLASS DETAIL ──
  if (portalPage === "classDetail" && board && cls) {
    const streams = cls.streams;
    const allSubjects = cls.subjects;

    const displayedSubjects = allSubjects.filter(s => {
      const streamMatch = activeStream === "all" || s.stream === "all" || s.stream === activeStream;
      const searchMatch = !search || s.name.toLowerCase().includes(search.toLowerCase());
      return streamMatch && searchMatch;
    });

    const STREAM_ICONS = { Science: Atom, Commerce: BarChart2, Arts: BookMarked };

    return (
      <>
        <BackBtn />
        <Breadcrumb />
        <div className="scp-class-hero" style={{ background: `linear-gradient(135deg, ${board.color} 0%, ${board.color}99 100%)` }}>
          <div className="scp-hero-label">{board.name} • {cls.label}</div>
          <div className="scp-hero-h2">{cls.tagline}</div>
          <div className="scp-hero-desc">{cls.description}</div>
          <div className="scp-highlights">
            {cls.highlights.map((h) => (
              <span key={h} className="scp-highlight-tag"><CheckCircle size={12} style={{ marginRight: 4 }} />{h}</span>
            ))}
          </div>
        </div>

        {streams && (
          <div className="scp-stream-tabs">
            {streams.map(st => {
              const SIcon = STREAM_ICONS[st] || BookOpen;
              const isActive = activeStream === st;
              return (
                <button
                  key={st}
                  className={`scp-stream-tab${isActive ? " active" : ""}`}
                  style={isActive ? { background: `linear-gradient(135deg, ${board.color}, ${board.color}cc)`, borderColor: "transparent" } : {}}
                  onClick={() => setActiveStream(st)}
                >
                  <SIcon size={15} /> {st}
                </button>
              );
            })}
            <button
              className={`scp-stream-tab${activeStream === "all" ? " active" : ""}`}
              style={activeStream === "all" ? { background: `linear-gradient(135deg, ${board.color}, ${board.color}cc)`, borderColor: "transparent" } : {}}
              onClick={() => setActiveStream("all")}
            >
              <Layers size={15} /> All Subjects
            </button>
          </div>
        )}

        <div className="scp-subjects-header">
          <h3>Subjects</h3>
          <span className="scp-count-badge" style={{ background: board.color + "18", color: board.color }}>
            {displayedSubjects.length} Subjects
          </span>
        </div>

        <div className="sc-search-wrap">
          <Search size={18} color="var(--muted)" />
          <input className="sc-search-input" placeholder="Search subject..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="scp-subjects-grid">
          {displayedSubjects.map((s) => {
            const sc = getSubjectColors(s.name);
            const SIcon = s.icon;
            const isAI = s.name === "Artificial Intelligence";
            return (
              <div
                key={s.name}
                className={`scp-subject-card${isAI ? " ai-card" : ""}`}
                style={{ "--subj-color": sc.icon }}
                onClick={() => goSubject(s.name)}
              >
                <div className="scp-sub-icon-wrap" style={{ background: sc.bg }}>
                  <SIcon size={26} color={sc.icon} />
                </div>
                <div className="scp-sub-name">{s.name}</div>
                <div className="scp-sub-meta">{s.chapters.length} Chapters • Full Syllabus</div>
                <div className="scp-sub-tags">
                  <span className="scp-sub-tag" style={{ background: sc.bg, color: sc.icon }}>Chapters</span>
                  <span className="scp-sub-tag" style={{ background: "#f0fdf4", color: "#16a34a" }}>Syllabus</span>
                  {isAI && <span className="scp-sub-tag" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>Premium</span>}
                </div>
                <button className="scp-sub-cta" style={{ background: typeof sc.btn === "string" && sc.btn.includes("gradient") ? sc.btn : `linear-gradient(135deg, ${sc.btn}, ${sc.btn}cc)` }}>
                  Open Subject →
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ── SUBJECT DETAIL ──
  if (portalPage === "subject" && board && cls && subj) {
    const sc = getSubjectColors(subj.name);
    const SIcon = subj.icon;
    const totalTopics = subj.syllabus.reduce((a, u) => a + u.topics.length, 0);
    const isAI = subj.name === "Artificial Intelligence";

    const ComingSoon = ({ tabName, TabIcon }) => (
      <div className="scp-coming-soon">
        <div className="scp-coming-icon"><TabIcon size={28} /></div>
        <div className="scp-coming-title">{tabName} Coming Soon</div>
        <div className="scp-coming-sub">Our team is curating premium {tabName.toLowerCase()} for {subj.name}. Check back soon!</div>
      </div>
    );

    return (
      <>
        <BackBtn />
        <Breadcrumb />
        <div className="scp-subj-header-card">
          <div className="scp-subj-header-top">
            <div className="scp-subj-big-icon" style={{ background: isAI ? "linear-gradient(135deg,#8b5cf6,#3b82f6)" : sc.bg }}>
              <SIcon size={32} color={isAI ? "white" : sc.icon} />
            </div>
            <div>
              <div className="scp-subj-board-label" style={{ color: board.color }}>{board.name} • {cls.label}</div>
              <div className="scp-subj-name">{subj.name}</div>
              <div className="scp-subj-meta">{subj.chapters.length} Chapters • {subj.syllabus.length} Units • {totalTopics} Topics</div>
            </div>
          </div>
          <div className="scp-tabs">
            {TABS.map(({ key, label, Icon: TIcon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  className={`scp-tab-btn${isActive ? " active" : ""}`}
                  style={isActive ? { background: isAI ? "linear-gradient(135deg,#8b5cf6,#3b82f6)" : sc.btn, borderBottomColor: isAI ? "#8b5cf6" : sc.btn } : {}}
                  onClick={() => setActiveTab(key)}
                >
                  <TIcon size={14} /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "chapters" && (
          <div className="scp-chapters-box">
            <h3>All Chapters — {subj.name}</h3>
            <div className="scp-chapter-pills">
              {subj.chapters.map((ch, i) => (
                <span key={ch} className="scp-chapter-pill">
                  <span style={{ color: isAI ? "#8b5cf6" : sc.icon, fontWeight: 800, minWidth: 18 }}>{i + 1}.</span>
                  {ch}
                </span>
              ))}
            </div>
            <div className="scp-study-tip" style={{ background: (isAI ? "#8b5cf6" : sc.icon) + "0a", border: `1.5px solid ${isAI ? "#8b5cf6" : sc.icon}28`, marginTop: 24, borderRadius: 14, padding: "18px 22px" }}>
              <div>
                <div className="scp-tip-label" style={{ color: isAI ? "#8b5cf6" : sc.icon, fontSize: "0.84rem", fontWeight: 800, marginBottom: 6 }}>
                  <Lightbulb size={16} /> Study Tip
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.65 }}>
                  Review the Syllabus tab for detailed unit-wise topics. Practice MCQs after each chapter for better retention and exam readiness.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "syllabus" && (
          <div>
            <div className="scp-syllabus-meta">
              <BookOpen size={16} color="var(--orange)" />
              {subj.syllabus.length} Units • {totalTopics} Topics
            </div>
            {subj.syllabus.map((unit, ui) => (
              <div key={unit.unit} className="scp-syllabus-unit">
                <div className="scp-unit-header">
                  <div className="scp-unit-num" style={{ background: isAI ? "linear-gradient(135deg,#8b5cf6,#3b82f6)" : sc.btn }}>{ui + 1}</div>
                  <div className="scp-unit-title">{unit.unit}</div>
                </div>
                {unit.topics.map((t) => (
                  <div key={t} className="scp-topic-item" style={{ borderLeftColor: (isAI ? "#8b5cf6" : sc.icon) + "50" }}>
                    <span style={{ color: isAI ? "#8b5cf6" : sc.icon, fontSize: "1rem" }}>•</span> {t}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && <ComingSoon tabName="Notes" TabIcon={PenTool} />}
        {activeTab === "pyq"   && <ComingSoon tabName="Past Year Questions" TabIcon={FileQuestion} />}
        {activeTab === "mcq"   && <ComingSoon tabName="MCQ Practice" TabIcon={Target} />}
        {activeTab === "ai"    && <ComingSoon tabName="AI Assistant" TabIcon={Brain} />}
      </>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Schoolclass() {
  const navigate  = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const styleId = "schoolclass-premium-styles";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId; tag.textContent = css;
      document.head.appendChild(tag);
    }
    return () => { const tag = document.getElementById(styleId); if (tag) tag.remove(); };
  }, []);

  const scrollToClasses = (e) => { e.preventDefault(); document.getElementById("classes")?.scrollIntoView({ behavior: "smooth" }); };
  const goHome = () => navigate("/");

  return (
    <div className={`sc-wrap${darkMode ? " dark-mode" : ""}`}>

      {/* ── NAVBAR ── */}
      <nav className="sc-navbar">
        <div className="sc-nav-left">
          <button className="sc-logo-btn" onClick={goHome}>
            <div className="sc-logo-icon"><GraduationCap size={22} color="white" /></div>
            <span className="sc-logo-text"><span className="l-green">ILM </span><span className="l-orange">ORA</span></span>
          </button>
        </div>
        <div className="sc-nav-right">
          <button className="sc-dark-toggle" onClick={() => setDarkMode(p => !p)} aria-label="Toggle dark mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="sc-hero">
        <div className="sc-hero-left">
          <div className="sc-hero-badge"><BookOpen size={14} />Premium LMS Platform for Indian School Students</div>
          <h1>Become the <span className="highlight">Top 1%</span><br />in Your Class</h1>
          <p>Real syllabus for CBSE, Bihar Board, ICSE & UP Board. Covering Classes 9–12 with AI-powered learning tools designed for Indian students.</p>
          <div className="sc-hero-cta">
            <button className="sc-btn-start" onClick={scrollToClasses}>Start Learning →</button>
            <button className="sc-btn-explore" onClick={scrollToClasses}>Explore Courses</button>
          </div>
        </div>
        <div className="sc-hero-right">
          <div className="sc-hero-img-wrapper"><img src={schoolImg} alt="Student studying" /></div>
          <div className="sc-hero-stats">
            {stats.map((s) => (
              <div className="sc-stat" key={s.label}>
                <div className="sc-stat-num">{s.num}</div>
                <div className="sc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPETITIVE EXAMS ── */}
      <section className="sc-section sc-section-alt">
        <div className="sc-section-tag">Competitive Exams</div>
        <h2 className="sc-section-title">Crack <span>NEET & JEE</span></h2>
        <p className="sc-section-sub">Targeted preparation for top medical and engineering entrance exams — curated by subject experts with proven results.</p>
        <div className="sc-comp-row">
          {competitiveExams.map((exam) => (
            <div className="sc-comp-card" key={exam.code} style={{ "--comp-color": exam.color }}>
              <div className="sc-comp-icon" style={{ background: `linear-gradient(135deg, ${exam.color}, ${exam.color}cc)` }}>
                <exam.Icon size={24} />
              </div>
              <div className="sc-comp-body">
                <div className="sc-comp-header">
                  <span className="sc-comp-code" style={{ color: exam.color }}>{exam.code}</span>
                  <span className="sc-comp-tag" style={{ background: exam.lightColor, color: exam.color }}>{exam.tag}</span>
                </div>
                <div className="sc-comp-label">{exam.label}</div>
                <div className="sc-comp-subjects">
                  {exam.subjects.map((sub) => (
                    <span className="sc-comp-pill" key={sub} style={{ background: exam.lightColor, color: exam.color }}>{sub}</span>
                  ))}
                </div>
                <button className="sc-comp-cta" style={{ background: `linear-gradient(135deg, ${exam.color}, ${exam.color}cc)` }} onClick={() => navigate(exam.route)}>
                  Explore {exam.code} Prep →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOARD PORTAL ── */}
      <section className="sc-section" id="classes">
        <BoardPortal />
      </section>

      {/* ── WHY ILM ORA ── */}
      <section className="sc-section sc-section-alt">
        <div className="sc-section-tag">Why Choose Us</div>
        <h2 className="sc-section-title">Learn Smarter, <span>Score Higher</span></h2>
        <p className="sc-section-sub">Everything you need to ace your exams and build a strong academic foundation — all in one premium platform.</p>
        <div className="sc-features-grid">
          {features.map((f) => (
            <div className="sc-feature-card" key={f.title}>
              <div className="sc-feature-icon"><f.Icon size={22} /></div>
              <div className="sc-feature-title">{f.title}</div>
              <div className="sc-feature-text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <section className="sc-section">
        <div className="sc-section-tag">Our Educators</div>
        <h2 className="sc-section-title">Learn from the <span>Best</span></h2>
        <p className="sc-section-sub">Our school faculty brings decades of teaching experience from top institutions across India.</p>
        <div className="sc-mentor-grid">
          {mentors.map((m) => (
            <div className="sc-mentor-card" key={m.name}>
              <div className="sc-mentor-avatar"><m.Icon size={26} /></div>
              <div>
                <div className="sc-mentor-sub">{m.subject}</div>
                <div className="sc-mentor-name">{m.name}</div>
                <div className="sc-mentor-exp">{m.exp}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="sc-cta-banner">
        <div>
          <h2>Ready to <span>Transform</span> Your Results?</h2>
          <p>Join 50,000+ students already achieving their academic goals with ILM ORA.</p>
        </div>
        <button className="sc-btn-cta-white" onClick={goHome}>Start for Free →</button>
      </div>

      {/* ── FOOTER ── */}
      <footer className="sc-footer">
        <button className="sc-logo-btn" onClick={goHome}>
          <div className="sc-logo-icon"><GraduationCap size={22} color="white" /></div>
          <span className="sc-logo-text"><span className="l-green">ILM </span><span className="l-orange">ORA</span></span>
        </button>
        <p>© 2024 ILM ORA · Premium LMS Platform for Indian Students</p>
        <p>CBSE · Bihar Board · ICSE · UP Board</p>
      </footer>

    </div>
  );
}