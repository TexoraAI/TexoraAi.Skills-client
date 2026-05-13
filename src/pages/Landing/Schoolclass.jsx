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
//   Globe,
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
//   { num: "10K+", label: "Students" },
//   { num: "95%",  label: "Pass Rate" },
//   { num: "200+", label: "Video Lessons" },
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

//   .sc-nav-left {
//     display: flex;
//     align-items: center;
//   }

//   .sc-nav-right {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//   }

//   /* Dark mode toggle button */
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
//   .sc-dark-toggle:hover {
//     background: var(--toggle-hover);
//     transform: rotate(15deg);
//   }

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
//   .sc-btn-start:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 20px rgba(26,31,46,0.25);
//   }

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
//     background: linear-gradient(135deg, #d4b896, #c9a87c);
//     height: 380px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .sc-hero-placeholder {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 100%;
//     color: rgba(255,255,255,0.85);
//     font-size: 0.9rem;
//     text-align: center;
//     gap: 14px;
//   }
//   .sc-hero-placeholder .ph-icon {
//     width: 72px;
//     height: 72px;
//     background: rgba(255,255,255,0.2);
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
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
//   .sc-stat-num {
//     font-size: 1.4rem;
//     font-weight: 800;
//     color: var(--dark);
//     font-family: 'Nunito', sans-serif;
//   }
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
//   .sc-class-card:hover {
//     border-color: var(--orange);
//     transform: translateY(-6px);
//     box-shadow: 0 16px 40px rgba(244,123,32,0.15);
//   }
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

//   .sc-class-num {
//     font-family: 'Nunito', sans-serif;
//     font-size: 2rem;
//     font-weight: 900;
//     color: var(--dark);
//   }
//   .sc-class-num span { color: var(--orange); }

//   .sc-class-label { font-size: 0.85rem; color: var(--muted); margin-bottom: 18px; }

//   .sc-subjects {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 6px;
//     justify-content: center;
//     margin-bottom: 20px;
//   }

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

//   .sc-feature-card {
//     background: var(--bg);
//     border-radius: 14px;
//     padding: 28px;
//     transition: background 0.3s;
//   }

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

//   .sc-feature-title {
//     font-weight: 700;
//     font-size: 1.05rem;
//     color: var(--dark);
//     margin-bottom: 8px;
//     font-family: 'Poppins', sans-serif;
//   }

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

//   /* ── RESPONSIVE ── */
//   @media (max-width: 1024px) {
//     .sc-navbar { padding: 0 40px; }
//     .sc-class-grid { grid-template-columns: repeat(2, 1fr); }
//     .sc-features-grid, .sc-mentor-grid { grid-template-columns: repeat(2, 1fr); }
//     .sc-hero   { padding: 80px 40px 48px; }
//     .sc-section { padding: 56px 40px; }
//     .sc-cta-banner { margin: 0 40px 56px; padding: 40px; flex-direction: column; text-align: center; }
//     .sc-footer { padding: 20px 40px; }
//   }

//   @media (max-width: 768px) {
//     .sc-navbar { padding: 0 20px; }
//     .sc-hero { flex-direction: column; padding: 80px 20px 48px; }
//     .sc-hero-left h1 { font-size: 2.2rem; }
//     .sc-hero-right { max-width: 100%; width: 100%; }
//     .sc-class-grid { grid-template-columns: 1fr 1fr; }
//     .sc-section { padding: 48px 20px; }
//     .sc-features-grid, .sc-mentor-grid { grid-template-columns: 1fr; }
//     .sc-cta-banner { margin: 0 20px 48px; padding: 32px 24px; }
//     .sc-footer { padding: 16px 20px; flex-direction: column; gap: 8px; text-align: center; }
//   }
// `;

// // ─── COMPONENT ────────────────────────────────────────────────────────────────

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
//         {/* Left — ILM ORA Logo */}
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

//         {/* Right — Dark Mode Toggle */}
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
//             <div className="sc-hero-placeholder">
//               <div className="ph-icon">
//                 <BookOpen size={36} color="white" />
//               </div>
//               <p>Your Learning Journey Starts Here</p>
//             </div>
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

//       {/* ── CLASS CARDS ── */}
//       <section className="sc-section sc-section-alt" id="classes">
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
//               Explore Class {cls.num}
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── WHY ILM ORA ── */}
//       <section className="sc-section">
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
//       <section className="sc-section sc-section-alt">
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
// }












import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  FileText,
  Bot,
  BarChart2,
  Users,
  Gift,
  FlaskConical,
  Calculator,
  BookOpen,
  Globe,
  Cpu,
  Trophy,
  Target,
  Microscope,
  GraduationCap,
  Moon,
  Sun,
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const stats = [
  { num: "5K+", label: "Students" },
  { num: "95%",  label: "Pass Rate" },
  { num: "50+", label: "Video Lessons" },
];

const classes = [
  {
    Icon: BookOpen,
    num: "9",
    suffix: "th",
    label: "Foundation Building",
    subjects: ["Mathematics", "Science", "English", "Social Studies", "Urdu"],
    route: "/school-class/9",
  },
  {
    Icon: Target,
    num: "10",
    suffix: "th",
    label: "Matric Preparation",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    route: "/school-class/10",
  },
  {
    Icon: FlaskConical,
    num: "11",
    suffix: "th",
    label: "Intermediate Year 1",
    subjects: ["Physics", "Chemistry", "Bio / CS", "Mathematics", "English"],
    route: "/school-class/11",
  },
  {
    Icon: Trophy,
    num: "12",
    suffix: "th",
    label: "Intermediate Year 2",
    subjects: ["Physics", "Chemistry", "Bio / CS", "Mathematics", "English"],
    route: "/school-class/12",
  },
];

const features = [
  {
    Icon: Video,
    title: "HD Video Lectures",
    text: "Watch crystal-clear video lessons recorded by top subject experts, available 24/7 at your convenience.",
  },
  {
    Icon: FileText,
    title: "Past Paper Practice",
    text: "Access 10+ years of board exam past papers with complete solutions and marking schemes.",
  },
  {
    Icon: Bot,
    title: "AI-Powered Doubt Solving",
    text: "Get instant answers to your doubts 24/7 with our intelligent AI tutor powered by advanced technology.",
  },
  {
    Icon: BarChart2,
    title: "Progress Tracking",
    text: "Monitor your performance with detailed analytics, weekly reports, and personalized improvement plans.",
  },
  {
    Icon: Users,
    title: "Live Mentorship Sessions",
    text: "Weekly live sessions with experienced teachers to clarify concepts and prepare you for exams.",
  },
  {
    Icon: Gift,
    title: "Free Study Material",
    text: "Download free notes, MCQ banks, and study guides curated by subject specialists.",
  },
];

const mentors = [
  {
    Icon: Calculator,
    subject: "Physics & Mathematics",
    name: "Sir Ahmed Raza",
    exp: "15 years experience · 4,200+ students",
  },
  {
    Icon: Microscope,
    subject: "Chemistry & Biology",
    name: "Ma'am Sana Iqbal",
    exp: "12 years experience · 3,800+ students",
  },
  {
    Icon: Cpu,
    subject: "Computer Science",
    name: "Sir Bilal Hassan",
    exp: "8 years experience · 2,500+ students",
  },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --green: #1a5c2a;
    --orange: #f47b20;
    --dark: #1a1f2e;
    --bg: #f5ede4;
    --white: #ffffff;
    --light-orange: #fff4ec;
    --text: #3a3a3a;
    --muted: #6b6b6b;

    --nav-bg: #ffffff;
    --nav-border: #ede0d5;
    --nav-text: #3a3a3a;
    --nav-muted: #6b6b6b;
    --toggle-bg: #f0e6dd;
    --toggle-hover: #e8d5c4;
  }

  .sc-wrap.dark-mode {
    --bg: #111827;
    --white: #1f2937;
    --dark: #f9fafb;
    --text: #e5e7eb;
    --muted: #9ca3af;
    --light-orange: #2a1f14;

    --nav-bg: #1f2937;
    --nav-border: #374151;
    --nav-text: #e5e7eb;
    --nav-muted: #9ca3af;
    --toggle-bg: #374151;
    --toggle-hover: #4b5563;
  }

  .sc-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .sc-wrap {
    font-family: 'Poppins', sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
  }

  /* ── NAVBAR ── */
  .sc-navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    padding: 0 80px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
    transition: background 0.3s, border-color 0.3s;
  }

  .sc-nav-left {
    display: flex;
    align-items: center;
  }

  .sc-nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* Dark mode toggle button */
  .sc-dark-toggle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--toggle-bg);
    color: var(--nav-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .sc-dark-toggle:hover {
    background: var(--toggle-hover);
    transform: rotate(15deg);
  }

  /* ── LOGO ── */
  .sc-logo-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
  }

  .sc-logo-icon {
    width: 40px;
    height: 40px;
    background: #F97316;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(249,115,22,0.35);
    flex-shrink: 0;
  }

  .sc-logo-text {
    font-family: 'Nunito', sans-serif;
    font-size: 1.6rem;
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .sc-logo-text .l-green  { color: var(--green); }
  .sc-logo-text .l-orange { color: #F97316; }

  /* ── HERO ── */
  .sc-hero {
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 80px 80px 64px;
    min-height: 520px;
    gap: 40px;
    transition: background 0.3s;
  }

  .sc-hero-left { flex: 1; max-width: 540px; }

  .sc-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--white);
    border: 1.5px solid #e8d5c4;
    border-radius: 30px;
    padding: 6px 16px;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--orange);
    margin-bottom: 28px;
    transition: background 0.3s, border-color 0.3s;
  }

  .sc-hero-left h1 {
    font-family: 'Nunito', sans-serif;
    font-size: 3.2rem;
    font-weight: 900;
    line-height: 1.15;
    color: var(--dark);
    margin-bottom: 20px;
  }
  .sc-hero-left h1 .highlight { color: var(--orange); }

  .sc-hero-left p {
    font-size: 1rem;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 36px;
    max-width: 420px;
  }

  .sc-hero-cta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

  .sc-btn-start {
    background: var(--dark);
    color: var(--white);
    border: none;
    padding: 14px 28px;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .sc-btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(26,31,46,0.25);
  }

  .sc-btn-explore {
    background: transparent;
    color: var(--dark);
    border: 2px solid var(--dark);
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .sc-btn-explore:hover { background: var(--dark); color: var(--white); }

  .sc-hero-right { flex: 1; max-width: 500px; position: relative; }

  .sc-hero-img-wrapper {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    height: 380px;
  }

  .sc-hero-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  .sc-hero-stats {
    position: absolute;
    bottom: -20px;
    left: -20px;
    background: var(--white);
    border-radius: 12px;
    padding: 12px 20px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    display: flex;
    gap: 20px;
    transition: background 0.3s;
  }

  .sc-stat { text-align: center; }
  .sc-stat-num {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--dark);
    font-family: 'Nunito', sans-serif;
  }
  .sc-stat-label { font-size: 0.72rem; color: var(--muted); }

  /* ── SECTION COMMON ── */
  .sc-section { padding: 72px 80px; }
  .sc-section-alt { background: var(--white); transition: background 0.3s; }

  .sc-section-tag {
    display: inline-block;
    background: var(--light-orange);
    color: var(--orange);
    font-size: 0.8rem;
    font-weight: 700;
    padding: 4px 14px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 14px;
    transition: background 0.3s;
  }

  .sc-section-title {
    font-family: 'Nunito', sans-serif;
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--dark);
    margin-bottom: 10px;
  }
  .sc-section-title span { color: var(--orange); }

  .sc-section-sub {
    color: var(--muted);
    font-size: 0.97rem;
    margin-bottom: 48px;
    max-width: 520px;
  }

  /* ── CLASS CARDS ── */
  .sc-class-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .sc-class-card {
    background: var(--white);
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    border: 2px solid transparent;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.3s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .sc-class-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: var(--orange);
    transform: scaleX(0);
    transition: transform 0.25s;
  }
  .sc-class-card:hover {
    border-color: var(--orange);
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(244,123,32,0.15);
  }
  .sc-class-card:hover::before { transform: scaleX(1); }

  .sc-class-icon {
    width: 64px;
    height: 64px;
    background: var(--light-orange);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
    color: var(--orange);
    transition: background 0.3s;
  }

  .sc-class-num {
    font-family: 'Nunito', sans-serif;
    font-size: 2rem;
    font-weight: 900;
    color: var(--dark);
  }
  .sc-class-num span { color: var(--orange); }

  .sc-class-label { font-size: 0.85rem; color: var(--muted); margin-bottom: 18px; }

  .sc-subjects {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    margin-bottom: 20px;
  }

  .sc-pill {
    background: var(--bg);
    color: var(--text);
    font-size: 0.72rem;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    transition: background 0.3s, color 0.3s;
  }

  .sc-class-cta {
    background: var(--dark);
    color: var(--white);
    border: none;
    padding: 10px 22px;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s;
  }
  .sc-class-cta:hover { background: var(--orange); }

  /* ── FEATURES ── */
  .sc-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

  .sc-feature-card {
    background: var(--bg);
    border-radius: 14px;
    padding: 28px;
    transition: background 0.3s;
  }

  .sc-feature-icon {
    width: 48px;
    height: 48px;
    background: var(--light-orange);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--orange);
    margin-bottom: 14px;
    transition: background 0.3s;
  }

  .sc-feature-title {
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--dark);
    margin-bottom: 8px;
    font-family: 'Poppins', sans-serif;
  }

  .sc-feature-text { font-size: 0.88rem; color: var(--muted); line-height: 1.6; }

  /* ── MENTORS ── */
  .sc-mentor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

  .sc-mentor-card {
    background: var(--white);
    border-radius: 16px;
    padding: 28px;
    display: flex;
    align-items: center;
    gap: 18px;
    border: 1.5px solid #ede0d5;
    transition: box-shadow 0.2s, background 0.3s, border-color 0.3s;
  }
  .sc-mentor-card:hover { box-shadow: 0 8px 28px rgba(244,123,32,0.12); }

  .sc-mentor-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--orange), #ff9a4a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .sc-mentor-name { font-weight: 700; font-size: 1rem; color: var(--dark); font-family: 'Poppins', sans-serif; }
  .sc-mentor-sub  { font-size: 0.8rem; color: var(--orange); font-weight: 600; margin-bottom: 4px; font-family: 'Poppins', sans-serif; }
  .sc-mentor-exp  { font-size: 0.78rem; color: var(--muted); font-family: 'Poppins', sans-serif; }

  /* ── CTA BANNER ── */
  .sc-cta-banner {
    background: var(--dark);
    margin: 0 80px 72px;
    border-radius: 20px;
    padding: 56px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    transition: background 0.3s;
  }

  .sc-cta-banner h2 {
    font-family: 'Nunito', sans-serif;
    font-size: 2rem;
    font-weight: 900;
    color: var(--white);
    max-width: 420px;
    line-height: 1.3;
  }
  .sc-cta-banner h2 span { color: var(--orange); }
  .sc-cta-banner p { color: rgba(255,255,255,0.6); margin-top: 10px; font-size: 0.95rem; }

  .sc-btn-cta-white {
    background: var(--white);
    color: var(--dark);
    border: none;
    padding: 14px 32px;
    border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }
  .sc-btn-cta-white:hover { background: var(--orange); color: var(--white); }

  /* ── FOOTER ── */
  .sc-footer {
    background: var(--white);
    border-top: 1px solid #ede0d5;
    padding: 24px 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--muted);
    font-family: 'Poppins', sans-serif;
    transition: background 0.3s, border-color 0.3s;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .sc-navbar { padding: 0 40px; }
    .sc-class-grid { grid-template-columns: repeat(2, 1fr); }
    .sc-features-grid, .sc-mentor-grid { grid-template-columns: repeat(2, 1fr); }
    .sc-hero   { padding: 80px 40px 48px; }
    .sc-section { padding: 56px 40px; }
    .sc-cta-banner { margin: 0 40px 56px; padding: 40px; flex-direction: column; text-align: center; }
    .sc-footer { padding: 20px 40px; }
  }

  @media (max-width: 768px) {
    .sc-navbar { padding: 0 20px; }
    .sc-hero { flex-direction: column; padding: 80px 20px 48px; }
    .sc-hero-left h1 { font-size: 2.2rem; }
    .sc-hero-right { max-width: 100%; width: 100%; }
    .sc-class-grid { grid-template-columns: 1fr 1fr; }
    .sc-section { padding: 48px 20px; }
    .sc-features-grid, .sc-mentor-grid { grid-template-columns: 1fr; }
    .sc-cta-banner { margin: 0 20px 48px; padding: 32px 24px; }
    .sc-footer { padding: 16px 20px; flex-direction: column; gap: 8px; text-align: center; }
  }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────

import schoolImg from "../../assets/school.jpeg";

export default function Schoolclass() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const styleId = "schoolclass-styles";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    return () => {
      const tag = document.getElementById(styleId);
      if (tag) tag.remove();
    };
  }, []);

  const scrollToClasses = (e) => {
    e.preventDefault();
    document.getElementById("classes")?.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = () => navigate("/");

  return (
    <div className={`sc-wrap${darkMode ? " dark-mode" : ""}`}>

      {/* ── NAVBAR ── */}
      <nav className="sc-navbar">
        <div className="sc-nav-left">
          <button className="sc-logo-btn" onClick={goHome}>
            <div className="sc-logo-icon">
              <GraduationCap size={22} color="white" />
            </div>
            <span className="sc-logo-text">
              <span className="l-green">ILM </span>
              <span className="l-orange">ORA</span>
            </span>
          </button>
        </div>

        <div className="sc-nav-right">
          <button
            className="sc-dark-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="sc-hero">
        <div className="sc-hero-left">
          <div className="sc-hero-badge">
            <BookOpen size={14} />
            Advanced Learning Platform for School Students
          </div>
          <h1>
            Become the <span className="highlight">Top 1%</span>
            <br />
            in Your Class
          </h1>
          <p>
            Learn Science, Math, English &amp; more from Pakistan's top educators.
            Designed for Class 9th, 10th, 11th &amp; 12th students.
          </p>
          <div className="sc-hero-cta">
            <button className="sc-btn-start" onClick={scrollToClasses}>
              Start Learning →
            </button>
            <button className="sc-btn-explore" onClick={scrollToClasses}>
              Explore Courses
            </button>
          </div>
        </div>

        <div className="sc-hero-right">
          <div className="sc-hero-img-wrapper">
            <img src={schoolImg} alt="Student" />
          </div>
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

      {/* ── CLASS CARDS ── */}
      <section className="sc-section sc-section-alt" id="classes">
        <div className="sc-section-tag">School Program</div>
        <h2 className="sc-section-title">
          Pick Your <span>Class</span>
        </h2>
        <p className="sc-section-sub">
          Comprehensive curriculum designed for CBSE &amp; Punjab boards — learn
          at your own pace.
        </p>

        <div className="sc-class-grid">
          {classes.map((cls) => (
            <div className="sc-class-card" key={cls.num}>
              <div className="sc-class-icon">
                <cls.Icon size={28} />
              </div>
              <div className="sc-class-num">
                <span>{cls.num}</span>
                {cls.suffix}
              </div>
              <div className="sc-class-label">{cls.label}</div>
              <div className="sc-subjects">
                {cls.subjects.map((sub) => (
                  <span className="sc-pill" key={sub}>{sub}</span>
                ))}
              </div>
              <button className="sc-class-cta" onClick={() => navigate(cls.route)}>
                Explore Class {cls.num}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ILM ORA ── */}
      <section className="sc-section">
        <div className="sc-section-tag">Why Choose Us</div>
        <h2 className="sc-section-title">
          Learn Smarter, <span>Score Higher</span>
        </h2>
        <p className="sc-section-sub">
          Everything you need to ace your exams and build a strong academic
          foundation.
        </p>

        <div className="sc-features-grid">
          {features.map((f) => (
            <div className="sc-feature-card" key={f.title}>
              <div className="sc-feature-icon">
                <f.Icon size={22} />
              </div>
              <div className="sc-feature-title">{f.title}</div>
              <div className="sc-feature-text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <section className="sc-section sc-section-alt">
        <div className="sc-section-tag">Our Educators</div>
        <h2 className="sc-section-title">
          Learn from the <span>Best</span>
        </h2>
        <p className="sc-section-sub">
          Our school faculty brings decades of teaching experience from top
          institutions.
        </p>

        <div className="sc-mentor-grid">
          {mentors.map((m) => (
            <div className="sc-mentor-card" key={m.name}>
              <div className="sc-mentor-avatar">
                <m.Icon size={26} />
              </div>
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
          <h2>
            Ready to <span>Transform</span> Your Results?
          </h2>
          <p>
            Join 10,000+ students already achieving their academic goals with
            ILM ORA.
          </p>
        </div>
        <button className="sc-btn-cta-white" onClick={goHome}>
          Start for Free →
        </button>
      </div>

      {/* ── FOOTER ── */}
      <footer className="sc-footer">
        <button className="sc-logo-btn" onClick={goHome}>
          <div className="sc-logo-icon">
            <GraduationCap size={22} color="white" />
          </div>
          <span className="sc-logo-text">
            <span className="l-green">ILM </span>
            <span className="l-orange">ORA</span>
          </span>
        </button>

        <p>© 2024 ILM ORA · Advanced Learning Platform for Modern Professionals</p>
        <p>Courses · Mentors · Free Services</p>
      </footer>

    </div>
  );
}