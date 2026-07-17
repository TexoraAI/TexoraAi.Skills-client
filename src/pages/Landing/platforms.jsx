// import { useState, useEffect, useCallback, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Rocket, BookOpen, Star, Users, Briefcase, Bot, Cloud,
//   Shield, Database, BarChart2, FlaskConical, Plug, Link2, Globe,
//   Sparkles, Server, RefreshCw, Package, Wrench, Headphones,
//   MessageSquare, Brain, Zap, Target, GraduationCap, Layers,
//   TrendingUp, Cpu, Handshake, Search, Bookmark, BookMarked,
//   X, ChevronRight, Menu, Sun, Moon, Layout,
//   Settings, Code2, Activity, Bell,
// } from "lucide-react";

// import heroVideo from "../../assets/collge_student.mp4";
// import discussionVideo from "../../assets/Discussion_collge.mp4";

// // ═══════════════════════════════════════════════
// //  DATA
// // ═══════════════════════════════════════════════
// const platformData = [
//   {
//     id: "dev",
//     name: "Development Engineering Platform",
//     Icon: Code2,
//     shortDesc: "Full-stack development essentials",
//     description:
//       "Master full-stack engineering with modern tools, frameworks, and architectural patterns for production-ready applications.",
//     programs: [
//       {
//         id: "ui-dev", name: "UI Development", Icon: Layout,
//         difficulty: "Beginner", duration: "8 Weeks", popular: true, beginnerFriendly: true,
//         description: "Learn to build clean, responsive, and modern user interfaces for web applications.",
//         careerOutcome: "Frontend Developer / UI Developer",
//         whoIsFor: "Students and beginners who want to build beautiful web pages and frontend screens.",
//         tools: ["HTML", "CSS", "JavaScript", "Responsive Design", "Figma Basics"],
//         syllabus: ["Web fundamentals and browser basics", "HTML structure and semantic tags", "CSS styling, box model, flexbox, and grid", "Responsive design for mobile and desktop", "JavaScript basics for UI interactions", "Forms, validation, and accessibility basics", "Landing page and dashboard UI project", "Portfolio-ready final UI project"],
//       },
//       {
//         id: "backend-dev", name: "Backend Development", Icon: Settings,
//         difficulty: "Intermediate", duration: "10 Weeks", popular: true, beginnerFriendly: false,
//         description: "Learn backend architecture, APIs, authentication, business logic, and database integration.",
//         careerOutcome: "Backend Developer / Full Stack Developer",
//         whoIsFor: "Learners who want to build server-side applications and APIs.",
//         tools: ["Java", "Spring Boot", "Node.js Basics", "REST APIs", "JWT", "PostgreSQL"],
//         syllabus: ["Backend fundamentals and client-server architecture", "REST API design and HTTP methods", "Controllers, services, repositories, and DTOs", "Authentication and authorization basics", "Database integration and transactions", "Error handling and validation", "File upload and notification basics", "Complete backend API project"],
//       },
//       {
//         id: "database", name: "Database", Icon: Database,
//         difficulty: "Beginner", duration: "6 Weeks", popular: false, beginnerFriendly: true,
//         description: "Learn database design, SQL queries, relationships, indexing, and data management.",
//         careerOutcome: "Database Developer / Backend Support Engineer",
//         whoIsFor: "Students who want strong SQL and database foundation.",
//         tools: ["SQL", "PostgreSQL", "MySQL", "ER Diagrams"],
//         syllabus: ["Database fundamentals and DBMS concepts", "Tables, rows, columns, keys, and constraints", "SQL SELECT, INSERT, UPDATE, DELETE", "Joins, grouping, sorting, and filtering", "Relationships and normalization", "Indexes and query optimization basics", "Transactions and data integrity", "Mini database design project"],
//       },
//       {
//         id: "api-soap", name: "API - SOAP", Icon: Plug,
//         difficulty: "Intermediate", duration: "5 Weeks", popular: false, beginnerFriendly: false,
//         description: "Learn SOAP APIs, XML-based services, WSDL, and enterprise integration concepts.",
//         careerOutcome: "Integration Developer / Backend Developer",
//         whoIsFor: "Learners working with enterprise or legacy service integrations.",
//         tools: ["SOAP", "XML", "WSDL", "Postman", "Java"],
//         syllabus: ["SOAP API fundamentals", "XML request and response structure", "WSDL and service contracts", "SOAP headers and body", "Error handling in SOAP services", "Testing SOAP APIs using tools", "Enterprise integration patterns", "SOAP service mini project"],
//       },
//       {
//         id: "graphql", name: "GraphQL API", Icon: Link2,
//         difficulty: "Intermediate", duration: "6 Weeks", popular: false, beginnerFriendly: false,
//         description: "Learn GraphQL schemas, queries, mutations, resolvers, and optimized data fetching.",
//         careerOutcome: "API Developer / Full Stack Developer",
//         whoIsFor: "Developers who want modern API skills beyond REST.",
//         tools: ["GraphQL", "JavaScript", "Node.js", "Apollo Basics"],
//         syllabus: ["GraphQL fundamentals", "Schema, types, and fields", "Queries and mutations", "Resolvers and data sources", "Nested data and relationships", "Error handling and validation", "GraphQL vs REST comparison", "GraphQL API mini project"],
//       },
//       {
//         id: "rest-api", name: "REST API", Icon: Globe,
//         difficulty: "Beginner to Intermediate", duration: "7 Weeks", popular: true, beginnerFriendly: true,
//         description: "Learn to design RESTful APIs using HTTP methods, status codes, resources, and clean endpoints.",
//         careerOutcome: "Backend Developer / API Developer",
//         whoIsFor: "Frontend, backend, and full-stack learners.",
//         tools: ["REST", "HTTP", "Postman", "JSON", "Java/Spring Boot"],
//         syllabus: ["REST architecture basics", "HTTP methods and status codes", "Request body, query params, and path variables", "API response structure and error format", "CRUD API development", "Authentication and protected endpoints", "API testing with Postman", "REST API final project"],
//       },
//     ],
//   },
//   {
//     id: "ai",
//     name: "AI – Agent AI",
//     Icon: Bot,
//     shortDesc: "AI, cloud, data & DevOps in one track",
//     description: "From generative AI to data pipelines — master the tools that power modern intelligent systems and cloud infrastructure.",
//     programs: [
//       {
//         id: "gen-ai", name: "Gen AI", Icon: Sparkles,
//         difficulty: "Beginner", duration: "8 Weeks", popular: true, beginnerFriendly: true,
//         description: "Learn generative AI concepts, prompt engineering, AI tools, and AI-powered workflows.",
//         careerOutcome: "AI Tools Specialist / Gen AI Associate",
//         whoIsFor: "Students, professionals, and creators who want to use AI in real work.",
//         tools: ["ChatGPT", "Prompt Engineering", "AI Agents Basics", "Automation Tools"],
//         syllabus: ["Introduction to generative AI", "LLM basics and AI model behavior", "Prompt engineering fundamentals", "Role prompts, structured prompts, and workflow planning", "AI tools for content, coding, research, and productivity", "AI agents and workflow automation basics", "Responsible AI and safety basics", "Gen AI workflow project"],
//       },
//       {
//         id: "cloud", name: "Cloud", Icon: Cloud,
//         difficulty: "Beginner", duration: "7 Weeks", popular: true, beginnerFriendly: true,
//         description: "Learn cloud fundamentals, compute, storage, networking, and deployment basics.",
//         careerOutcome: "Cloud Associate / Junior Cloud Engineer",
//         whoIsFor: "Beginners starting cloud computing.",
//         tools: ["AWS Basics", "Azure Basics", "Linux Basics", "Cloud Console"],
//         syllabus: ["Cloud computing fundamentals", "IaaS, PaaS, SaaS models", "Compute, storage, and networking basics", "Identity and access basics", "Cloud deployment concepts", "Monitoring and billing basics", "Cloud security fundamentals", "Simple cloud deployment project"],
//       },
//       {
//         id: "cloud-platform", name: "Cloud Platform", Icon: Server,
//         difficulty: "Intermediate", duration: "9 Weeks", popular: false, beginnerFriendly: false,
//         description: "Learn how cloud platforms support scalable applications, infrastructure, and enterprise systems.",
//         careerOutcome: "Cloud Platform Engineer",
//         whoIsFor: "Learners who want deeper cloud platform and infrastructure skills.",
//         tools: ["AWS/Azure/GCP Concepts", "Docker Basics", "Monitoring Tools"],
//         syllabus: ["Cloud platform architecture", "Virtual machines and container basics", "Load balancing and scaling", "Storage services and database services", "Networking and security groups", "Logging and monitoring", "Deployment architecture", "Cloud platform case study project"],
//       },
//       {
//         id: "devops", name: "DevOps", Icon: RefreshCw,
//         difficulty: "Intermediate", duration: "10 Weeks", popular: true, beginnerFriendly: false,
//         description: "Learn CI/CD, automation, deployment pipelines, containers, and release workflows.",
//         careerOutcome: "DevOps Engineer / Release Engineer",
//         whoIsFor: "Developers and operations learners who want modern deployment skills.",
//         tools: ["Git", "GitHub Actions", "Docker", "CI/CD", "Linux"],
//         syllabus: ["DevOps culture and SDLC", "Git and branching strategies", "Build and release pipelines", "CI/CD fundamentals", "Docker and container basics", "Environment variables and deployment configs", "Monitoring deployment health", "CI/CD pipeline project"],
//       },
//       {
//         id: "sre", name: "SRE", Icon: Shield,
//         difficulty: "Advanced", duration: "8 Weeks", popular: false, beginnerFriendly: false,
//         description: "Learn reliability engineering, monitoring, incident response, SLAs, SLOs, and system stability.",
//         careerOutcome: "Site Reliability Engineer",
//         whoIsFor: "Cloud, DevOps, and backend learners interested in production reliability.",
//         tools: ["Monitoring", "Logging", "Alerting", "Linux", "Incident Management"],
//         syllabus: ["SRE fundamentals", "SLIs, SLOs, and SLAs", "Monitoring and observability", "Incident response workflow", "Error budgets and reliability planning", "Capacity and performance basics", "Postmortems and RCA", "Reliability improvement project"],
//       },
//       {
//         id: "data-engineering", name: "Data Engineering", Icon: Package,
//         difficulty: "Intermediate", duration: "10 Weeks", popular: true, beginnerFriendly: false,
//         description: "Learn data pipelines, ETL workflows, warehouses, and large-scale data processing systems.",
//         careerOutcome: "Data Engineer",
//         whoIsFor: "Learners who want to build systems that move and transform data.",
//         tools: ["SQL", "Python Basics", "ETL", "Data Warehouse Concepts"],
//         syllabus: ["Data engineering fundamentals", "Data sources and ingestion", "ETL and ELT workflows", "Batch processing basics", "Data warehouse concepts", "Data quality and validation", "Pipeline scheduling basics", "Data pipeline project"],
//       },
//       {
//         id: "data-engineer", name: "Data Engineer", Icon: Wrench,
//         difficulty: "Intermediate", duration: "9 Weeks", popular: false, beginnerFriendly: false,
//         description: "Prepare for data engineer roles with databases, pipelines, cloud data tools, and analytics systems.",
//         careerOutcome: "Junior Data Engineer",
//         whoIsFor: "Students targeting data engineer jobs.",
//         tools: ["SQL", "Python", "Cloud Data Basics", "Pipelines"],
//         syllabus: ["Role of a data engineer", "SQL for data engineering", "Python for data workflows", "Data modeling basics", "Pipeline design patterns", "Cloud data services overview", "Data validation and monitoring", "Data engineer portfolio project"],
//       },
//       {
//         id: "data-analyst", name: "Data Analyst", Icon: BarChart2,
//         difficulty: "Beginner", duration: "8 Weeks", popular: true, beginnerFriendly: true,
//         description: "Learn data analysis, dashboards, reporting, SQL, Excel, BI tools, and business insights.",
//         careerOutcome: "Data Analyst / BI Analyst",
//         whoIsFor: "Learners who want analytics and reporting roles.",
//         tools: ["Excel", "SQL", "Power BI/Tableau Concepts", "Dashboards"],
//         syllabus: ["Data analysis fundamentals", "Excel for data cleaning and reporting", "SQL for analysis", "Metrics and KPIs", "Dashboard design basics", "Data visualization best practices", "Business insight storytelling", "Analytics dashboard project"],
//       },
//       {
//         id: "data-scientist", name: "Data Scientist", Icon: FlaskConical,
//         difficulty: "Advanced", duration: "12 Weeks", popular: false, beginnerFriendly: false,
//         description: "Learn machine learning, statistics, model building, data exploration, and predictive analytics.",
//         careerOutcome: "Junior Data Scientist / ML Associate",
//         whoIsFor: "Learners interested in AI, ML, prediction, and advanced analytics.",
//         tools: ["Python", "Statistics", "Machine Learning Basics", "Jupyter"],
//         syllabus: ["Data science fundamentals", "Python for data science", "Statistics and probability basics", "Data cleaning and exploration", "Machine learning fundamentals", "Model training and evaluation", "Prediction and classification use cases", "Data science capstone project"],
//       },
//     ],
//   },
//   {
//     id: "cx",
//     name: "Contact Center Platform",
//     Icon: Headphones,
//     shortDesc: "AI-powered CX & conversation design",
//     description: "Design intelligent customer experiences using AI-driven bots, conversation platforms, and modern CX frameworks.",
//     programs: [
//       {
//         id: "cx-ai", name: "AI", Icon: Bot,
//         difficulty: "Beginner", duration: "6 Weeks", popular: true, beginnerFriendly: true,
//         description: "Understand how AI improves customer support, automation, routing, and service quality.",
//         careerOutcome: "AI Customer Experience Associate",
//         whoIsFor: "Learners interested in AI-powered customer experience and support systems.",
//         tools: ["AI Basics", "Customer Support Automation", "Analytics"],
//         syllabus: ["AI in customer experience", "Customer intent and automation", "Smart routing and response suggestions", "AI-assisted agent workflows", "Quality monitoring basics", "Customer analytics basics", "AI ethics in support", "AI support use case project"],
//       },
//       {
//         id: "chatbot", name: "Chatbot", Icon: MessageSquare,
//         difficulty: "Beginner", duration: "6 Weeks", popular: true, beginnerFriendly: true,
//         description: "Learn chatbot flows, conversation design, FAQ automation, and customer interaction handling.",
//         careerOutcome: "Chatbot Designer / CX Automation Associate",
//         whoIsFor: "Support teams and learners building customer-facing bot experiences.",
//         tools: ["Conversation Design", "Bot Flow Builder Concepts", "FAQ Automation"],
//         syllabus: ["Chatbot fundamentals", "Conversation design basics", "Intents, entities, and FAQs", "Bot flow planning", "Fallback and escalation handling", "Testing chatbot conversations", "Customer journey mapping", "Chatbot flow project"],
//       },
//       {
//         id: "ai-bot", name: "AI BOT", Icon: Brain,
//         difficulty: "Intermediate", duration: "7 Weeks", popular: true, beginnerFriendly: false,
//         description: "Build intelligent AI bot experiences with automation, natural language, and smart responses.",
//         careerOutcome: "AI Bot Developer / Automation Associate",
//         whoIsFor: "Learners who want to build smarter bots for customer support and automation.",
//         tools: ["AI Bot Concepts", "NLP Basics", "Automation Workflows"],
//         syllabus: ["AI bot fundamentals", "NLP and intent detection basics", "Smart response generation", "Automation actions and triggers", "Human handoff and escalation", "Bot analytics and improvement", "AI bot testing strategy", "AI bot automation project"],
//       },
//       {
//         id: "tora-cx", name: "TORA CX", Icon: Zap,
//         difficulty: "Intermediate", duration: "8 Weeks", popular: false, beginnerFriendly: false,
//         description: "Explore TORA CX contact center platform concepts for customer experience and support operations.",
//         careerOutcome: "CX Platform Associate / Contact Center Operations Associate",
//         whoIsFor: "Learners and teams working with contact center platforms and customer experience systems.",
//         tools: ["TORA CX Concepts", "Contact Center Workflows", "Reporting", "Automation"],
//         syllabus: ["Contact center platform fundamentals", "Customer experience workflows", "Agent and supervisor operations", "Ticket routing and queue management", "Reporting and performance metrics", "Automation in CX platforms", "Quality and compliance basics", "TORA CX workflow project"],
//       },
//     ],
//   },
// ];

// // ═══════════════════════════════════════════════
// //  HELPERS
// // ═══════════════════════════════════════════════
// function getDifficultyClass(difficulty) {
//   const d = difficulty.toLowerCase();
//   if (d.includes("beginner") && !d.includes("intermediate")) return "Beginner";
//   if (d.includes("intermediate")) return "Intermediate";
//   if (d.includes("advanced")) return "Advanced";
//   return "other";
// }

// function findProgramById(programId) {
//   for (const platform of platformData) {
//     const prog = platform.programs.find((p) => p.id === programId);
//     if (prog) return { program: prog, platform };
//   }
//   return null;
// }

// // ═══════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════
// const cssText = `
// :root {
//   --bg: #fffaf5; --surface: #ffffff; --surface2: #fdf6ee;
//   --dark: #0f172a; --dark2: #1e293b; --mid: #374151; --muted: #64748b;
//   --border: #e8e0d6; --border2: #f0e8df;
//   --orange: #f97316; --orange-d: #ea6c0a; --orange-lt: #fff7ed;
//   --orange-md: #fed7aa; --orange-glow: rgba(249,115,22,.18);
//   --green: #16a34a; --green-lt: #f0fdf4;
//   --radius-sm: 8px; --radius: 14px; --radius-lg: 20px;
//   --shadow-sm: 0 1px 6px rgba(15,23,42,.06);
//   --shadow: 0 4px 20px rgba(15,23,42,.09);
//   --shadow-lg: 0 12px 48px rgba(15,23,42,.13);
//   --transition: .22s cubic-bezier(.4,0,.2,1);
//   --font-display: 'Georgia','Times New Roman',serif;
//   --font-body: 'Segoe UI',system-ui,-apple-system,sans-serif;
// }
// [data-theme="dark"] {
//   --bg: #0f1117; --surface: #1a1f2e; --surface2: #141824;
//   --dark: #f1f5f9; --dark2: #e2e8f0; --mid: #cbd5e1; --muted: #94a3b8;
//   --border: #2a3244; --border2: #222840;
//   --orange-lt: #1c1208; --orange-md: #7c3d12; --green-lt: #052e16;
// }
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
// html{scroll-behavior:smooth;font-size:16px}
// body{font-family:var(--font-body);background:var(--bg);color:var(--dark);line-height:1.6;min-height:100vh;transition:background var(--transition),color var(--transition)}
// a{text-decoration:none;color:inherit}
// ul{list-style:none}
// button{font-family:inherit;cursor:pointer}
// ::-webkit-scrollbar{width:6px;height:6px}
// ::-webkit-scrollbar-track{background:var(--bg)}
// ::-webkit-scrollbar-thumb{background:var(--border);border-radius:999px}
// ::-webkit-scrollbar-thumb:hover{background:var(--orange)}

// /* ── NAVBAR ── */
// .ilmora-navbar {
//   position: sticky;
//   top: 0;
//   z-index: 200;
//   background: #ffffff;
//   border-bottom: 1.5px solid #e8e0d6;
//   box-shadow: 0 2px 16px rgba(15,23,42,0.08);
//   transition: background var(--transition), border-color var(--transition);
//   width: 100%;
//   min-height: 66px;
//   contain: layout style;
// }
// [data-theme="dark"] .ilmora-navbar {
//   background: #1a1f2e;
//   border-bottom-color: #2a3244;
// }
// .ilmora-nav-inner {
//   max-width: 1280px;
//   margin: 0 auto;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0 32px;
//   height: 66px;
//   flex-wrap: nowrap;
//   gap: 0;
// }
// .ilmora-nav-logo {
//   font-family: var(--font-display);
//   font-size: 1.55rem;
//   font-weight: 700;
//   letter-spacing: -.5px;
//   flex-shrink: 0;
//   cursor: pointer;
//   text-decoration: none;
//   color: inherit;
//   min-width: max-content;
// }
// .ilmora-nav-logo .ilm { color: var(--green); }
// .ilmora-nav-logo .ora { color: var(--orange); }

// .ilmora-nav-links {
//   display: flex;
//   align-items: center;
//   gap: 2px;
//   flex: 1;
//   justify-content: center;
//   overflow: hidden;
//   min-width: 0;
// }
// .ilmora-nav-links a,
// .ilmora-nav-links button {
//   font-size: .875rem;
//   font-weight: 500;
//   color: #0f172a;
//   padding: 7px 13px;
//   border-radius: var(--radius-sm);
//   transition: color var(--transition), background var(--transition);
//   white-space: nowrap;
//   background: none;
//   border: none;
//   cursor: pointer;
//   text-decoration: none;
//   display: inline-flex;
//   align-items: center;
//   line-height: 1;
// }
// [data-theme="dark"] .ilmora-nav-links a,
// [data-theme="dark"] .ilmora-nav-links button { color: #e2e8f0; }
// .ilmora-nav-links a:hover,
// .ilmora-nav-links button:hover { color: #f97316; background: var(--surface2); }

// .ilmora-nav-right {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   flex-shrink: 0;
//   min-width: max-content;
// }
// .ilmora-btn-theme {
//   width: 38px; height: 38px;
//   border-radius: 50%;
//   background: var(--surface2);
//   border: 1.5px solid var(--border);
//   display: flex; align-items: center; justify-content: center;
//   transition: background var(--transition), border-color var(--transition), transform var(--transition);
//   color: var(--mid);
//   flex-shrink: 0;
// }
// .ilmora-btn-theme:hover {
//   border-color: var(--orange);
//   background: var(--orange-lt);
//   transform: rotate(20deg);
// }

// .ilmora-hamburger {
//   display: none;
//   align-items: center; justify-content: center;
//   width: 38px; height: 38px;
//   background: none; border: none; padding: 4px;
//   cursor: pointer; color: var(--dark);
//   flex-shrink: 0;
// }
// .ilmora-mobile-menu {
//   display: none;
//   flex-direction: column;
//   background: var(--surface);
//   border-top: 1.5px solid var(--border);
//   padding: 12px 24px 20px;
//   gap: 2px;
//   position: relative;
//   z-index: 199;
// }
// .ilmora-mobile-menu.open { display: flex; }
// .ilmora-mobile-menu a,
// .ilmora-mobile-menu button.mobile-nav-btn {
//   padding: 10px 12px;
//   border-radius: var(--radius-sm);
//   font-weight: 500;
//   color: #0f172a;
//   background: none; border: none;
//   text-align: left;
//   font-size: 1rem;
//   cursor: pointer;
//   width: 100%;
//   text-decoration: none;
//   display: block;
// }
// [data-theme="dark"] .ilmora-mobile-menu a,
// [data-theme="dark"] .ilmora-mobile-menu button.mobile-nav-btn { color: #e2e8f0; }
// .ilmora-mobile-menu a:hover,
// .ilmora-mobile-menu button.mobile-nav-btn:hover {
//   color: var(--orange);
//   background: var(--surface2);
// }
// .ilmora-mobile-menu-bottom {
//   display: flex; align-items: center; gap: 10px;
//   margin-top: 10px; padding-top: 10px;
//   border-top: 1.5px solid var(--border);
// }

// @media(max-width: 960px) {
//   .ilmora-nav-links { display: none; }
//   .ilmora-hamburger { display: flex; }
// }
// @media(max-width: 680px) {
//   .ilmora-nav-inner { padding: 0 20px; }
// }

// /* ══════════════════════════════════════════════
//    HERO
// ══════════════════════════════════════════════ */
// .ilmora-hero {
//   position: relative; overflow: hidden;
//   padding: 72px 32px;
//   background: var(--bg);
// }
// .ilmora-hero::before {
//   content: ''; position: absolute; inset: 0; pointer-events: none;
//   background:
//     radial-gradient(ellipse 60% 70% at 0% 50%, rgba(249,115,22,.10) 0%, transparent 60%),
//     radial-gradient(ellipse 40% 50% at 100% 20%, rgba(22,163,74,.07) 0%, transparent 55%);
// }
// .ilmora-hero-inner {
//   max-width: 1200px; margin: 0 auto;
//   display: grid; grid-template-columns: 1fr 480px;
//   gap: 52px; align-items: center; position: relative;
// }
// .ilmora-hero-text { display: flex; flex-direction: column; align-items: flex-start; }
// .ilmora-hero-badge {
//   display: inline-flex; align-items: center; gap: 8px;
//   background: var(--orange-lt); border: 1.5px solid var(--orange-md);
//   color: var(--orange); font-size: .78rem; font-weight: 700;
//   letter-spacing: .04em; text-transform: uppercase;
//   padding: 5px 15px; border-radius: 999px; margin-bottom: 22px;
//   animation: ilmoraFadeUp .5s ease both;
// }
// .ilmora-hero h1 {
//   font-family: var(--font-display);
//   font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700;
//   letter-spacing: -.5px; line-height: 1.18; margin-bottom: 18px;
//   color: var(--dark); animation: ilmoraFadeUp .55s .06s ease both;
// }
// .ilmora-hero h1 .highlight {
//   color: var(--orange); position: relative; display: inline-block;
// }
// .ilmora-hero h1 .highlight::after {
//   content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
//   height: 3px; background: var(--orange); border-radius: 999px; opacity: .35;
// }
// .ilmora-hero-sub {
//   font-size: 1rem; color: var(--muted); max-width: 520px;
//   margin: 0 0 32px; line-height: 1.7;
//   animation: ilmoraFadeUp .6s .12s ease both;
// }
// .ilmora-hero-btns {
//   display: flex; gap: 12px; flex-wrap: wrap;
//   animation: ilmoraFadeUp .65s .18s ease both;
// }
// .ilmora-btn-primary {
//   display: inline-flex; align-items: center; gap: 7px;
//   background: var(--orange); color: #fff; padding: 13px 28px;
//   border-radius: 10px; font-size: .95rem; font-weight: 700; border: none;
//   transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
//   cursor: pointer;
// }
// .ilmora-btn-primary:hover {
//   background: var(--orange-d); transform: translateY(-2px);
//   box-shadow: 0 8px 28px rgba(249,115,22,.35);
// }
// .ilmora-hero-stats {
//   display: flex; gap: 40px; flex-wrap: wrap;
//   margin-top: 44px; animation: ilmoraFadeUp .7s .24s ease both;
// }
// .ilmora-hero-stat { text-align: left; }
// .ilmora-hero-stat .num {
//   font-family: var(--font-display); font-size: 1.8rem;
//   font-weight: 700; color: var(--dark);
// }
// .ilmora-hero-stat .num b { color: var(--orange); }
// .ilmora-hero-stat .lbl { font-size: .75rem; color: var(--muted); font-weight: 500; margin-top: 1px; }
// .ilmora-hero-video-wrap {
//   position: relative; border-radius: 20px; overflow: hidden;
//   box-shadow: 0 24px 64px rgba(15,23,42,.18), 0 0 0 1.5px var(--border);
//   animation: ilmoraFadeUp .7s .3s ease both;
//   aspect-ratio: 16/10; background: var(--dark2);
// }
// .ilmora-hero-video-wrap video {
//   width: 100%; height: 100%; object-fit: cover; display: block;
// }
// .ilmora-hero-video-wrap::before {
//   content: ''; position: absolute; top: 0; left: 0; right: 0;
//   height: 3px; background: linear-gradient(90deg, var(--orange), var(--green)); z-index: 2;
// }
// .ilmora-video-badge {
//   position: absolute; bottom: 16px; left: 16px;
//   background: rgba(15,23,42,.82); backdrop-filter: blur(10px);
//   color: #fff; font-size: .75rem; font-weight: 700;
//   padding: 7px 14px; border-radius: 999px;
//   border: 1px solid rgba(255,255,255,.12);
//   display: flex; align-items: center; gap: 7px;
//   z-index: 3; letter-spacing: .03em;
// }
// .ilmora-video-badge .vbdot {
//   width: 7px; height: 7px; border-radius: 50%;
//   background: #22c55e;
//   animation: livePulse 1.4s ease-in-out infinite;
//   flex-shrink: 0;
// }
// @keyframes livePulse {
//   0%,100% { opacity: 1; transform: scale(1); }
//   50% { opacity: .5; transform: scale(1.35); }
// }
// @media(max-width: 1060px) {
//   .ilmora-hero-inner { grid-template-columns: 1fr; gap: 36px; }
//   .ilmora-hero-text { align-items: center; text-align: center; }
//   .ilmora-hero h1 { text-align: center; }
//   .ilmora-hero-sub { text-align: center; margin: 0 auto 32px; }
//   .ilmora-hero-btns { justify-content: center; }
//   .ilmora-hero-stats { justify-content: center; }
//   .ilmora-hero-stat { text-align: center; }
//   .ilmora-hero-video-wrap { max-width: 560px; margin: 0 auto; }
// }
// @media(max-width: 680px) {
//   .ilmora-hero { padding: 56px 20px 52px; }
//   .ilmora-hero-stats { gap: 24px; }
// }

// /* SECTION */
// .ilmora-section-wrap { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
// .ilmora-section-header { text-align: center; margin-bottom: 36px; }
// .ilmora-section-tag {
//   display: inline-flex; align-items: center; gap: 6px;
//   background: var(--orange-lt); color: var(--orange);
//   font-size: .75rem; font-weight: 700; letter-spacing: .06em;
//   text-transform: uppercase; padding: 4px 13px;
//   border-radius: 999px; margin-bottom: 14px;
// }
// .ilmora-section-header h2 {
//   font-family: var(--font-display);
//   font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 700;
//   letter-spacing: -.3px; margin-bottom: 12px;
// }
// .ilmora-section-header p {
//   color: var(--muted); max-width: 540px; margin: 0 auto; font-size: .95rem;
// }

// /* BANNER WITH TABS */
// .ilmora-tabs-banner {
//   background: linear-gradient(135deg, var(--orange) 0%, #fb923c 55%, #f59e0b 100%);
//   border-radius: var(--radius); padding: 18px 22px 0;
//   margin-bottom: 20px; overflow: hidden; position: relative;
//   box-shadow: 0 6px 28px rgba(249,115,22,.30);
// }
// .ilmora-tabs-banner::before {
//   content: ''; position: absolute; top: -40px; right: -40px;
//   width: 160px; height: 160px; border-radius: 50%;
//   background: rgba(255,255,255,.07); pointer-events: none;
// }
// .ilmora-tabs-banner::after {
//   content: ''; position: absolute; bottom: 10px; left: 38%;
//   width: 100px; height: 100px; border-radius: 50%;
//   background: rgba(255,255,255,.05); pointer-events: none;
// }
// .ilmora-tabs-banner-top {
//   display: flex; align-items: center; justify-content: space-between;
//   gap: 12px; margin-bottom: 16px; position: relative; z-index: 1;
// }
// .ilmora-tabs-banner-left { display: flex; align-items: center; gap: 11px; }
// .ilmora-tabs-banner-icon {
//   width: 36px; height: 36px; border-radius: 9px;
//   background: rgba(255,255,255,.2); border: 1.5px solid rgba(255,255,255,.3);
//   display: flex; align-items: center; justify-content: center;
//   flex-shrink: 0; color: #fff;
// }
// .ilmora-tabs-banner-text { display: flex; flex-direction: column; gap: 1px; }
// .ilmora-tabs-banner-title { font-size: .875rem; font-weight: 700; color: #fff; white-space: nowrap; }
// .ilmora-tabs-banner-sub { font-size: .72rem; color: rgba(255,255,255,.78); white-space: nowrap; }
// .ilmora-tabs-banner-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
// .ilmora-tabs-banner-pill {
//   display: inline-flex; align-items: center; gap: 5px;
//   background: rgba(255,255,255,.22); border: 1.5px solid rgba(255,255,255,.38);
//   color: #fff; font-size: .7rem; font-weight: 700; padding: 5px 13px;
//   border-radius: 999px; letter-spacing: .04em; text-transform: uppercase;
//   white-space: nowrap; cursor: default; transition: background var(--transition);
// }
// .ilmora-tabs-banner-pulse {
//   width: 7px; height: 7px; border-radius: 50%; background: #fff;
//   animation: livePulse 1.4s ease-in-out infinite; flex-shrink: 0;
// }
// .ilmora-banner-tabs {
//   display: flex; align-items: flex-end; gap: 2px;
//   overflow-x: auto; -webkit-overflow-scrolling: touch;
//   scrollbar-width: none; position: relative; z-index: 1;
// }
// .ilmora-banner-tabs::-webkit-scrollbar { display: none; }
// .ilmora-banner-tab {
//   display: flex; align-items: center; gap: 8px;
//   padding: 11px 20px 12px; border: none;
//   background: rgba(255,255,255,.12); color: rgba(255,255,255,.82);
//   font-size: .875rem; font-weight: 600; cursor: pointer;
//   white-space: nowrap; flex-shrink: 0;
//   border-radius: 10px 10px 0 0;
//   transition: background var(--transition), color var(--transition);
//   margin-right: 2px;
// }
// .ilmora-banner-tab:hover { background: rgba(255,255,255,.22); color: #fff; }
// .ilmora-banner-tab.active { background: var(--surface); color: var(--orange); font-weight: 700; }
// [data-theme="dark"] .ilmora-banner-tab.active { background: var(--surface); color: var(--orange); }
// .ilmora-banner-tab-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
// .ilmora-banner-tab-count {
//   display: inline-flex; align-items: center; justify-content: center;
//   min-width: 20px; height: 20px; padding: 0 5px; border-radius: 999px;
//   font-size: .68rem; font-weight: 800;
//   background: rgba(255,255,255,.25); color: #fff;
//   border: 1px solid rgba(255,255,255,.3);
//   transition: background var(--transition), color var(--transition);
// }
// .ilmora-banner-tab.active .ilmora-banner-tab-count {
//   background: var(--orange); color: #fff; border-color: var(--orange);
// }
// @media(max-width: 700px) {
//   .ilmora-tabs-banner { padding: 14px 16px 0; }
//   .ilmora-banner-tab { padding: 9px 14px 10px; font-size: .8rem; }
//   .ilmora-tabs-banner-sub { display: none; }
// }
// @media(max-width: 480px) { .ilmora-tabs-banner-right { display: none; } }

// /* PLATFORM SECTION */
// .ilmora-platforms-section { padding: 80px 0; }
// .ilmora-programs-panel { min-height: 400px; }
// .ilmora-panel-top {
//   background: var(--surface); border: 1.5px solid var(--border);
//   border-radius: var(--radius); padding: 24px 28px 20px; margin-bottom: 20px;
// }
// .ilmora-panel-title-row {
//   display: flex; align-items: flex-start; justify-content: space-between;
//   gap: 16px; flex-wrap: wrap; margin-bottom: 8px;
// }
// .ilmora-panel-icon-name { display: flex; align-items: center; gap: 12px; }
// .ilmora-panel-icon {
//   width: 46px; height: 46px;
//   background: var(--orange-lt); border: 1.5px solid var(--orange-md);
//   border-radius: 12px; display: flex; align-items: center; justify-content: center;
//   flex-shrink: 0; color: var(--orange);
// }
// .ilmora-panel-title {
//   font-family: var(--font-display); font-size: 1.35rem;
//   font-weight: 700; color: var(--dark);
// }
// .ilmora-panel-badge {
//   background: var(--orange); color: #fff; font-size: .75rem; font-weight: 700;
//   padding: 4px 12px; border-radius: 999px; flex-shrink: 0;
//   align-self: flex-start; margin-top: 2px;
// }
// .ilmora-panel-desc { font-size: .875rem; color: var(--muted); margin-bottom: 18px; line-height: 1.65; }
// .ilmora-panel-controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
// .ilmora-panel-search-wrap { position: relative; flex: 1; min-width: 200px; }
// .ilmora-panel-search-wrap .ilmora-search-icon {
//   position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
//   display: flex; align-items: center; color: var(--muted); pointer-events: none;
// }
// .ilmora-panel-search {
//   width: 100%; padding: 9px 12px 9px 38px;
//   border: 1.5px solid var(--border); border-radius: var(--radius-sm);
//   background: var(--bg); color: var(--dark); font-size: .875rem;
//   transition: border-color var(--transition), box-shadow var(--transition); outline: none;
// }
// .ilmora-panel-search:focus {
//   border-color: var(--orange); box-shadow: 0 0 0 3px var(--orange-glow);
// }
// .ilmora-panel-search::placeholder { color: var(--muted); }
// .ilmora-filter-btns { display: flex; gap: 6px; flex-wrap: wrap; }
// .ilmora-filter-btn {
//   padding: 7px 14px; border-radius: var(--radius-sm);
//   font-size: .8rem; font-weight: 600;
//   background: var(--bg); color: var(--muted);
//   border: 1.5px solid var(--border); transition: all var(--transition); cursor: pointer;
// }
// .ilmora-filter-btn:hover { border-color: var(--orange-md); color: var(--dark); }
// .ilmora-filter-btn.active {
//   background: var(--orange); color: #fff; border-color: var(--orange);
//   box-shadow: 0 2px 10px rgba(249,115,22,.25);
// }

// /* PROGRAM CARDS */
// .ilmora-programs-grid {
//   display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
//   gap: 16px; transition: opacity var(--transition);
// }
// .ilmora-programs-grid.fading { opacity: 0; transform: translateY(8px); }
// .ilmora-prog-card {
//   background: var(--surface); border: 1.5px solid var(--border);
//   border-radius: var(--radius); padding: 20px; cursor: pointer;
//   display: flex; flex-direction: column; gap: 10px;
//   transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
//   animation: ilmoraCardIn .3s ease both;
// }
// .ilmora-prog-card:hover {
//   border-color: var(--orange-md);
//   box-shadow: 0 6px 28px rgba(249,115,22,.12);
//   transform: translateY(-3px);
// }
// .ilmora-prog-card-head { display: flex; align-items: center; gap: 12px; }
// .ilmora-prog-card-icon {
//   width: 40px; height: 40px; border-radius: 10px;
//   background: var(--orange-lt); border: 1.5px solid var(--orange-md);
//   display: flex; align-items: center; justify-content: center;
//   flex-shrink: 0; color: var(--orange);
// }
// .ilmora-prog-card-name { font-size: .925rem; font-weight: 700; color: var(--dark); line-height: 1.3; }
// .ilmora-prog-card-desc { font-size: .8rem; color: var(--muted); line-height: 1.55; flex: 1; }
// .ilmora-prog-card-badges { display: flex; gap: 6px; flex-wrap: wrap; }
// .ilmora-badge {
//   display: inline-flex; align-items: center; gap: 4px;
//   font-size: .7rem; font-weight: 700; padding: 2px 8px;
//   border-radius: 999px; border: 1.5px solid;
// }
// .ilmora-badge-Beginner { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
// .ilmora-badge-Intermediate { background: #fff7ed; color: #f97316; border-color: #fed7aa; }
// .ilmora-badge-Advanced { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
// .ilmora-badge-other { background: var(--surface2); color: var(--muted); border-color: var(--border); }
// .ilmora-badge-duration { background: var(--surface2); color: var(--muted); border-color: var(--border); }
// .ilmora-badge-popular { background: #fff7ed; color: #f97316; border-color: #fed7aa; }
// .ilmora-badge-beginner-friendly { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
// .ilmora-prog-card-actions { display: flex; gap: 8px; margin-top: 2px; }
// .ilmora-btn-syllabus {
//   flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//   background: var(--orange); color: #fff; padding: 8px 14px;
//   border-radius: 8px; font-size: .78rem; font-weight: 700; border: none;
//   transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
// }
// .ilmora-btn-syllabus:hover {
//   background: var(--orange-d); transform: translateY(-1px);
//   box-shadow: 0 4px 14px rgba(249,115,22,.3);
// }
// .ilmora-btn-save {
//   display: inline-flex; align-items: center; justify-content: center; gap: 5px;
//   background: var(--bg); color: var(--muted); padding: 8px 12px;
//   border-radius: 8px; font-size: .78rem; font-weight: 600;
//   border: 1.5px solid var(--border); transition: all var(--transition); white-space: nowrap;
// }
// .ilmora-btn-save:hover { border-color: var(--orange-md); color: var(--orange); background: var(--orange-lt); }
// .ilmora-btn-save.saved { background: var(--orange-lt); color: var(--orange); border-color: var(--orange); }

// /* EMPTY STATE */
// .ilmora-empty-state { grid-column: 1/-1; text-align: center; padding: 56px 20px; }
// .ilmora-empty-state .empty-icon {
//   display: flex; justify-content: center; margin-bottom: 14px; opacity: .4; color: var(--muted);
// }
// .ilmora-empty-state h3 { font-size: 1.05rem; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
// .ilmora-empty-state p { color: var(--muted); font-size: .875rem; }

// /* WHY CHOOSE */
// .ilmora-why-section { padding: 80px 0; background: var(--surface); }
// .ilmora-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
// .ilmora-why-card {
//   background: var(--bg); border: 1.5px solid var(--border);
//   border-radius: var(--radius); padding: 30px 26px;
//   transition: box-shadow var(--transition), transform var(--transition);
// }
// .ilmora-why-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
// .ilmora-why-icon {
//   width: 50px; height: 50px; border-radius: 12px;
//   background: var(--orange-lt); border: 1.5px solid var(--orange-md);
//   display: flex; align-items: center; justify-content: center;
//   margin-bottom: 16px; color: var(--orange);
// }
// .ilmora-why-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
// .ilmora-why-card p { font-size: .83rem; color: var(--muted); line-height: 1.65; }

// .ilmora-discussion-strip {
//   margin-bottom: 52px; display: grid;
//   grid-template-columns: 1fr 1fr; gap: 28px; align-items: center;
// }
// .ilmora-discussion-video-wrap {
//   position: relative; border-radius: 18px; overflow: hidden;
//   box-shadow: 0 16px 48px rgba(15,23,42,.14), 0 0 0 1.5px var(--border);
//   aspect-ratio: 16/9; background: var(--dark2);
// }
// .ilmora-discussion-video-wrap video {
//   width: 100%; height: 100%; object-fit: cover; display: block;
// }
// .ilmora-discussion-video-wrap::after {
//   content: ''; position: absolute; inset: 0;
//   background: linear-gradient(135deg, rgba(249,115,22,.08) 0%, transparent 60%);
//   pointer-events: none;
// }
// .ilmora-discussion-video-wrap::before {
//   content: ''; position: absolute; top: 0; left: 0; right: 0;
//   height: 3px; background: linear-gradient(90deg, var(--green), var(--orange)); z-index: 2;
// }
// .ilmora-discussion-text h3 {
//   font-family: var(--font-display); font-size: 1.6rem; font-weight: 700;
//   color: var(--dark); line-height: 1.3; margin-bottom: 14px;
// }
// .ilmora-discussion-text h3 span { color: var(--orange); }
// .ilmora-discussion-text p {
//   font-size: .93rem; color: var(--muted); line-height: 1.75; margin-bottom: 22px;
// }
// .ilmora-discussion-pills { display: flex; gap: 10px; flex-wrap: wrap; }
// .ilmora-dpill {
//   display: inline-flex; align-items: center; gap: 6px;
//   background: var(--orange-lt); border: 1.5px solid var(--orange-md);
//   color: var(--orange); font-size: .77rem; font-weight: 700;
//   padding: 5px 13px; border-radius: 999px;
// }
// @media(max-width: 900px) {
//   .ilmora-discussion-strip { grid-template-columns: 1fr; }
//   .ilmora-discussion-video-wrap { max-width: 560px; }
// }
// @media(max-width: 680px) { .ilmora-why-grid { grid-template-columns: repeat(2, 1fr); } }
// @media(max-width: 520px) { .ilmora-why-grid { grid-template-columns: 1fr; } }

// /* MODAL */
// .ilmora-modal-overlay {
//   position: fixed; inset: 0; z-index: 500;
//   background: rgba(15,23,42,.55); backdrop-filter: blur(5px);
//   display: flex; align-items: center; justify-content: center;
//   padding: 24px; opacity: 0; pointer-events: none;
//   transition: opacity var(--transition);
// }
// .ilmora-modal-overlay.open { opacity: 1; pointer-events: auto; }
// .ilmora-modal {
//   background: var(--surface); border: 1.5px solid var(--border);
//   border-radius: var(--radius-lg); width: 100%; max-width: 720px;
//   max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg);
//   transform: scale(.96) translateY(12px); transition: transform var(--transition);
// }
// .ilmora-modal-overlay.open .ilmora-modal { transform: scale(1) translateY(0); }
// .ilmora-modal-header {
//   display: flex; align-items: flex-start; justify-content: space-between;
//   gap: 16px; padding: 28px 28px 20px; border-bottom: 1.5px solid var(--border);
//   position: sticky; top: 0; background: var(--surface); z-index: 1;
//   border-radius: var(--radius-lg) var(--radius-lg) 0 0;
// }
// .ilmora-modal-title-group { display: flex; align-items: center; gap: 14px; }
// .ilmora-modal-icon {
//   width: 52px; height: 52px; border-radius: 12px;
//   background: var(--orange-lt); border: 1.5px solid var(--orange-md);
//   display: flex; align-items: center; justify-content: center;
//   flex-shrink: 0; color: var(--orange);
// }
// .ilmora-modal-title {
//   font-family: var(--font-display); font-size: 1.25rem; font-weight: 700;
//   color: var(--dark); line-height: 1.3; margin-bottom: 4px;
// }
// .ilmora-modal-platform {
//   font-size: .78rem; color: var(--orange); font-weight: 600;
//   background: var(--orange-lt); border: 1px solid var(--orange-md);
//   padding: 2px 9px; border-radius: 999px; display: inline-block;
// }
// .ilmora-modal-close {
//   width: 34px; height: 34px; border-radius: 50%;
//   background: var(--surface2); border: 1.5px solid var(--border);
//   display: flex; align-items: center; justify-content: center;
//   color: var(--muted); flex-shrink: 0; transition: all var(--transition);
// }
// .ilmora-modal-close:hover {
//   background: var(--orange-lt); border-color: var(--orange); color: var(--orange);
// }
// .ilmora-modal-body { padding: 24px 28px 28px; }
// .ilmora-modal-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
// .ilmora-modal-desc {
//   font-size: .9rem; color: var(--muted); line-height: 1.7; margin-bottom: 22px;
//   padding: 16px; background: var(--surface2); border-radius: var(--radius-sm);
//   border: 1px solid var(--border2);
// }
// .ilmora-modal-info-grid {
//   display: grid; grid-template-columns: repeat(2, 1fr);
//   gap: 14px; margin-bottom: 22px;
// }
// .ilmora-modal-info-block {
//   background: var(--surface2); border: 1px solid var(--border2);
//   border-radius: var(--radius-sm); padding: 14px 16px;
// }
// .ilmora-modal-info-label {
//   display: flex; align-items: center; gap: 5px;
//   font-size: .7rem; font-weight: 700; color: var(--orange);
//   text-transform: uppercase; letter-spacing: .05em; margin-bottom: 5px;
// }
// .ilmora-modal-info-value { font-size: .875rem; color: var(--dark); font-weight: 600; }
// .ilmora-modal-tools { margin-bottom: 22px; }
// .ilmora-modal-section-title {
//   display: flex; align-items: center; gap: 7px;
//   font-size: .875rem; font-weight: 700; color: var(--dark); margin-bottom: 12px;
// }
// .ilmora-tools-list { display: flex; gap: 7px; flex-wrap: wrap; }
// .ilmora-tool-tag {
//   background: var(--surface2); color: var(--mid); font-size: .77rem;
//   font-weight: 600; padding: 4px 11px; border-radius: 999px;
//   border: 1px solid var(--border);
// }
// .ilmora-syllabus-list { display: flex; flex-direction: column; gap: 8px; }
// .ilmora-syllabus-item {
//   display: flex; align-items: flex-start; gap: 10px;
//   background: var(--surface2); border: 1px solid var(--border2);
//   border-radius: var(--radius-sm); padding: 11px 14px;
//   font-size: .845rem; color: var(--dark); line-height: 1.5;
// }
// .ilmora-syllabus-num {
//   width: 22px; height: 22px; border-radius: 50%;
//   background: var(--orange); color: #fff; font-size: .7rem; font-weight: 700;
//   display: flex; align-items: center; justify-content: center;
//   flex-shrink: 0; margin-top: 1px;
// }
// .ilmora-modal-footer {
//   display: flex; align-items: center; justify-content: flex-end; gap: 10px;
//   padding: 18px 28px; border-top: 1.5px solid var(--border);
//   background: var(--surface); border-radius: 0 0 var(--radius-lg) var(--radius-lg);
//   position: sticky; bottom: 0; z-index: 1;
// }
// .ilmora-btn-modal-save {
//   display: inline-flex; align-items: center; gap: 6px;
//   background: var(--orange); color: #fff; padding: 10px 22px;
//   border-radius: var(--radius-sm); font-size: .875rem; font-weight: 700; border: none;
//   transition: background var(--transition), transform var(--transition);
// }
// .ilmora-btn-modal-save:hover { background: var(--orange-d); transform: translateY(-1px); }
// .ilmora-btn-modal-close {
//   display: inline-flex; align-items: center; gap: 6px;
//   background: var(--surface2); color: var(--mid); padding: 10px 22px;
//   border-radius: var(--radius-sm); font-size: .875rem; font-weight: 600;
//   border: 1.5px solid var(--border); transition: all var(--transition);
// }
// .ilmora-btn-modal-close:hover { border-color: var(--orange-md); color: var(--dark); }

// /* TOAST */
// .ilmora-toast-container {
//   position: fixed; bottom: 28px; right: 28px; z-index: 900;
//   display: flex; flex-direction: column; gap: 10px; pointer-events: none;
// }
// .ilmora-toast {
//   background: var(--dark); color: #fff; padding: 12px 18px; border-radius: 10px;
//   font-size: .845rem; font-weight: 600; box-shadow: 0 8px 28px rgba(15,23,42,.2);
//   display: flex; align-items: center; gap: 10px;
//   min-width: 220px; max-width: 340px; pointer-events: auto;
//   animation: ilmoraToastIn .3s cubic-bezier(.34,1.56,.64,1) both;
// }
// .ilmora-toast-dot {
//   width: 8px; height: 8px; border-radius: 50%;
//   background: var(--orange); flex-shrink: 0;
// }

// /* FOOTER */
// .ilmora-footer {
//   background: var(--dark); color: #94a3b8;
//   padding: 28px 32px; text-align: center; font-size: .845rem;
// }
// .ilmora-footer .foot-logo {
//   font-family: var(--font-display); font-size: 1.25rem;
//   font-weight: 700; margin-bottom: 8px;
// }
// .ilmora-footer .foot-logo .ilm { color: var(--green); }
// .ilmora-footer .foot-logo .ora { color: var(--orange); }

// /* ANIMATIONS */
// @keyframes ilmoraFadeUp {
//   from { opacity: 0; transform: translateY(18px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// @keyframes ilmoraCardIn {
//   from { opacity: 0; transform: translateY(12px) scale(.98); }
//   to { opacity: 1; transform: translateY(0) scale(1); }
// }
// @keyframes ilmoraToastIn {
//   from { opacity: 0; transform: translateX(50px) scale(.9); }
//   to { opacity: 1; transform: translateX(0) scale(1); }
// }

// /* RESPONSIVE */
// @media(max-width: 680px) {
//   .ilmora-section-wrap { padding: 0 20px; }
//   .ilmora-modal-info-grid { grid-template-columns: 1fr; }
//   .ilmora-modal-header,
//   .ilmora-modal-body,
//   .ilmora-modal-footer { padding-left: 20px; padding-right: 20px; }
//   .ilmora-banner-tab { padding: 9px 12px 10px; font-size: .8rem; }
// }
// `;

// // ═══════════════════════════════════════════════
// //  STYLE INJECTION — React-managed, survives back navigation
// // ═══════════════════════════════════════════════
// const STYLE_ID = "ilmora-platforms-styles";

// // ✅ BUG FIX 1: Added cleanup return to remove injected styles on unmount.
// // Previously styles stayed in <head> after navigating away, breaking other pages on back navigation.
// function useInjectStyles() {
//   useEffect(() => {
//     let el = document.getElementById(STYLE_ID);
//     if (!el) {
//       el = document.createElement("style");
//       el.id = STYLE_ID;
//       document.head.appendChild(el);
//     }
//     el.textContent = cssText;
//     return () => {
//       const toRemove = document.getElementById(STYLE_ID);
//       if (toRemove) toRemove.remove();
//     };
//   }, []);
// }

// // ═══════════════════════════════════════════════
// //  TOAST HOOK
// // ═══════════════════════════════════════════════
// function useToasts() {
//   const [toasts, setToasts] = useState([]);
//   const showToast = useCallback((message) => {
//     const id = Date.now() + Math.random();
//     setToasts((prev) => [...prev, { id, message }]);
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
//   }, []);
//   return { toasts, showToast };
// }

// // ═══════════════════════════════════════════════
// //  NAVBAR
// // ═══════════════════════════════════════════════
// function Navbar({ darkMode, onToggleTheme }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleScrollLink = (e, sectionId) => {
//     e.preventDefault();
//     setMobileOpen(false);
//     const el = document.getElementById(sectionId);
//     if (el) el.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <header>
//       <nav className="ilmora-navbar">
//         <div className="ilmora-nav-inner">
//           <Link to="/" className="ilmora-nav-logo">
//             <span className="ilm">ILM</span>
//             <span className="ora" style={{ marginLeft: "4px" }}>ORA</span>
//           </Link>

//           <ul className="ilmora-nav-links">
//             <li>
//               <a href="#courses" onClick={(e) => handleScrollLink(e, "courses")}>
//                 Courses
//               </a>
//             </li>
//             <li>
//               <a href="#mentors" onClick={(e) => handleScrollLink(e, "mentors")}>
//                 Mentors
//               </a>
//             </li>
//             <li>
//               <a href="#why-choose" onClick={(e) => handleScrollLink(e, "why-choose")}>
//                 Success Stories
//               </a>
//             </li>
//             <li>
              
//             </li>
//             <li>
//               <button onClick={() => navigate("/school-class")}>
//                 School Programs
//               </button>
//             </li>
//           </ul>

//           <div className="ilmora-nav-right">
//             <button
//               className="ilmora-btn-theme"
//               onClick={onToggleTheme}
//               title="Toggle dark mode"
//             >
//               {darkMode ? <Sun size={16} /> : <Moon size={16} />}
//             </button>
//             <button
//               className="ilmora-hamburger"
//               onClick={() => setMobileOpen((v) => !v)}
//               aria-label={mobileOpen ? "Close menu" : "Open menu"}
//               aria-expanded={mobileOpen}
//             >
//               {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>
//         </div>

//         <div className={`ilmora-mobile-menu ${mobileOpen ? "open" : ""}`} role="menu">
//           <a href="#courses" onClick={(e) => handleScrollLink(e, "courses")}>Courses</a>
//           <a href="#mentors" onClick={(e) => handleScrollLink(e, "mentors")}>Mentors</a>
//           <a href="#why-choose" onClick={(e) => handleScrollLink(e, "why-choose")}>Success Stories</a>
//           <button
//             className="mobile-nav-btn"
//             onClick={() => { navigate("/explore-programs"); setMobileOpen(false); }}
//           >
//             Free Services
//           </button>
//           <button
//             className="mobile-nav-btn"
//             onClick={() => { navigate("/school-class"); setMobileOpen(false); }}
//           >
//             School Programs
//           </button>
//           <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />
//           <div className="ilmora-mobile-menu-bottom">
//             <button className="ilmora-btn-theme" onClick={onToggleTheme}>
//               {darkMode ? <Sun size={16} /> : <Moon size={16} />}
//             </button>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// // ═══════════════════════════════════════════════
// //  HERO
// // ═══════════════════════════════════════════════
// function Hero({ onExplore }) {
//   return (
//     <section className="ilmora-hero" id="hero">
//       <div className="ilmora-hero-inner">
//         <div className="ilmora-hero-text">
//           <div className="ilmora-hero-badge">
//             <Rocket size={13} /> Career-Ready Learning
//           </div>
//           <h1>
//             Explore Career-Ready<br />
//             Learning <span className="highlight">Platforms</span>
//           </h1>
//           <p className="ilmora-hero-sub">
//             Choose a platform, explore related programs, and view structured
//             syllabus paths designed for modern careers.
//           </p>
//           <div className="ilmora-hero-btns">
//             <button className="ilmora-btn-primary" onClick={onExplore}>
//               Explore Platforms <ChevronRight size={16} />
//             </button>
//           </div>
//           <div className="ilmora-hero-stats">
//             {[
//               { num: "3",   sup: "+",  lbl: "Learning Platforms" },
//               { num: "19",  sup: "+",  lbl: "Programs" },
//               { num: "100", sup: "%",  lbl: "Practical Focus" },
//               { num: "24",  sup: "/7", lbl: "Mentor Support" },
//             ].map((s) => (
//               <div className="ilmora-hero-stat" key={s.lbl}>
//                 <div className="num">{s.num}<b>{s.sup}</b></div>
//                 <div className="lbl">{s.lbl}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="ilmora-hero-video-wrap">
//           <video src={heroVideo} autoPlay loop muted playsInline preload="auto" />
//           <div className="ilmora-video-badge">
//             <span className="vbdot" /> Real Students. Real Learning.
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ═══════════════════════════════════════════════
// //  BANNER WITH TABS
// // ═══════════════════════════════════════════════
// function BannerWithTabs({ platforms, activePlatformId, onSelect }) {
//   return (
//     <div className="ilmora-tabs-banner" role="navigation" aria-label="Platform selector">
//       <div className="ilmora-tabs-banner-top">
//         <div className="ilmora-tabs-banner-left">
//           <div className="ilmora-tabs-banner-icon">
//             <Bell size={15} />
//           </div>
//           <div className="ilmora-tabs-banner-text">
//             <span className="ilmora-tabs-banner-title">Choose Your Platform</span>
//             <span className="ilmora-tabs-banner-sub">Select a track to explore programs</span>
//           </div>
//         </div>
//         <div className="ilmora-tabs-banner-right">
//           <span className="ilmora-tabs-banner-pill">
//             <span className="ilmora-tabs-banner-pulse" /> Enrolling Now
//           </span>
//         </div>
//       </div>
//       <div className="ilmora-banner-tabs" role="tablist">
//         {platforms.map((platform) => {
//           const TabIcon = platform.Icon;
//           return (
//             <button
//               key={platform.id}
//               role="tab"
//               aria-selected={platform.id === activePlatformId}
//               className={`ilmora-banner-tab ${platform.id === activePlatformId ? "active" : ""}`}
//               onClick={() => onSelect(platform.id)}
//             >
//               <span className="ilmora-banner-tab-icon"><TabIcon size={15} /></span>
//               <span>{platform.name}</span>
//               <span className="ilmora-banner-tab-count">{platform.programs.length}</span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════
// //  DIFFICULTY BADGE
// // ═══════════════════════════════════════════════
// function DifficultyBadge({ difficulty }) {
//   const cls = getDifficultyClass(difficulty);
//   const icons = {
//     Beginner: <GraduationCap size={10} />,
//     Intermediate: <TrendingUp size={10} />,
//     Advanced: <Cpu size={10} />,
//     other: null,
//   };
//   return (
//     <span className={`ilmora-badge ilmora-badge-${cls}`}>
//       {icons[cls]}{difficulty}
//     </span>
//   );
// }

// // ═══════════════════════════════════════════════
// //  PROGRAM CARD
// // ═══════════════════════════════════════════════
// function ProgramCard({ prog, savedInterests, onSyllabus, onSave }) {
//   const isSaved = savedInterests.has(prog.id);
//   const CardIcon = prog.Icon;
//   return (
//     <article
//       className="ilmora-prog-card"
//       tabIndex={0}
//       onClick={() => onSyllabus(prog.id)}
//       onKeyDown={(e) => { if (e.key === "Enter") onSyllabus(prog.id); }}
//     >
//       <div className="ilmora-prog-card-head">
//         <div className="ilmora-prog-card-icon"><CardIcon size={18} /></div>
//         <div className="ilmora-prog-card-name">{prog.name}</div>
//       </div>
//       <div className="ilmora-prog-card-desc">{prog.description}</div>
//       <div className="ilmora-prog-card-badges">
//         <DifficultyBadge difficulty={prog.difficulty} />
//         <span className="ilmora-badge ilmora-badge-duration">
//           <Activity size={10} /> {prog.duration}
//         </span>
//         {prog.popular && (
//           <span className="ilmora-badge ilmora-badge-popular">
//             <Star size={10} /> Popular
//           </span>
//         )}
//         {prog.beginnerFriendly && (
//           <span className="ilmora-badge ilmora-badge-beginner-friendly">
//             <GraduationCap size={10} /> Beginner
//           </span>
//         )}
//       </div>
//       <div className="ilmora-prog-card-actions">
//         <button
//           className="ilmora-btn-syllabus"
//           onClick={(e) => { e.stopPropagation(); onSyllabus(prog.id); }}
//         >
//           <BookOpen size={13} /> View Syllabus
//         </button>
//         <button
//           className={`ilmora-btn-save ${isSaved ? "saved" : ""}`}
//           onClick={(e) => { e.stopPropagation(); onSave(prog.id, prog.name); }}
//         >
//           {isSaved
//             ? <><BookMarked size={13} /> Saved</>
//             : <><Bookmark size={13} /> Save</>}
//         </button>
//       </div>
//     </article>
//   );
// }

// // ═══════════════════════════════════════════════
// //  SYLLABUS MODAL
// // ═══════════════════════════════════════════════
// function SyllabusModal({ prog, platform, savedInterests, onClose, onSave }) {
//   const isSaved = prog && savedInterests.has(prog.id);

//   useEffect(() => {
//     if (!prog) return;
//     const handler = (e) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [prog, onClose]);

//   useEffect(() => {
//     document.body.style.overflow = prog ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [prog]);

//   if (!prog) return null;
//   const ModalIcon = prog.Icon;

//   return (
//     <div
//       className={`ilmora-modal-overlay ${prog ? "open" : ""}`}
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div className="ilmora-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="ilmora-modal-header">
//           <div className="ilmora-modal-title-group">
//             <div className="ilmora-modal-icon"><ModalIcon size={24} /></div>
//             <div>
//               <div className="ilmora-modal-title">{prog.name}</div>
//               <span className="ilmora-modal-platform">{platform.name}</span>
//             </div>
//           </div>
//           <button className="ilmora-modal-close" onClick={onClose} aria-label="Close">
//             <X size={16} />
//           </button>
//         </div>
//         <div className="ilmora-modal-body">
//           <div className="ilmora-modal-meta">
//             <DifficultyBadge difficulty={prog.difficulty} />
//             <span className="ilmora-badge ilmora-badge-duration">
//               <Activity size={10} /> {prog.duration}
//             </span>
//             {prog.popular && (
//               <span className="ilmora-badge ilmora-badge-popular">
//                 <Star size={10} /> Popular
//               </span>
//             )}
//             {prog.beginnerFriendly && (
//               <span className="ilmora-badge ilmora-badge-beginner-friendly">
//                 <GraduationCap size={10} /> Beginner Friendly
//               </span>
//             )}
//           </div>
//           <div className="ilmora-modal-desc">{prog.description}</div>
//           <div className="ilmora-modal-info-grid">
//             <div className="ilmora-modal-info-block">
//               <div className="ilmora-modal-info-label"><Target size={11} /> Career Outcome</div>
//               <div className="ilmora-modal-info-value">{prog.careerOutcome}</div>
//             </div>
//             <div className="ilmora-modal-info-block">
//               <div className="ilmora-modal-info-label"><Users size={11} /> Who Is This For</div>
//               <div className="ilmora-modal-info-value">{prog.whoIsFor}</div>
//             </div>
//           </div>
//           <div className="ilmora-modal-tools">
//             <div className="ilmora-modal-section-title"><Wrench size={15} /> Tools & Technologies</div>
//             <div className="ilmora-tools-list">
//               {prog.tools.map((t) => (
//                 <span key={t} className="ilmora-tool-tag">{t}</span>
//               ))}
//             </div>
//           </div>
//           <div>
//             <div className="ilmora-modal-section-title"><BookOpen size={15} /> Syllabus Modules</div>
//             <div className="ilmora-syllabus-list">
//               {prog.syllabus.map((mod, i) => (
//                 <div key={i} className="ilmora-syllabus-item">
//                   <span className="ilmora-syllabus-num">{i + 1}</span>
//                   <span>{mod}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="ilmora-modal-footer">
//           <button className="ilmora-btn-modal-close" onClick={onClose}>
//             <X size={14} /> Close
//           </button>
//           <button
//             className="ilmora-btn-modal-save"
//             onClick={() => { onSave(prog.id, prog.name); onClose(); }}
//           >
//             {isSaved
//               ? <><BookMarked size={14} /> Already Saved</>
//               : <><Bookmark size={14} /> Save Interest</>}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════
// //  WHY CHOOSE
// // ═══════════════════════════════════════════════
// function WhyChoose() {
//   const cards = [
//     { Icon: Target,        title: "Industry-Aligned Curriculum",  text: "Every program is crafted with input from working engineers and industry leaders to reflect what employers actually need today." },
//     { Icon: GraduationCap, title: "Expert Mentors",               text: "Learn directly from seasoned professionals with years of real-world experience across development, AI, cloud, and CX platforms." },
//     { Icon: Layers,        title: "Project-Based Learning",       text: "Build portfolio-ready projects from day one. Every module ends with a hands-on deliverable you can showcase to future employers." },
//     { Icon: Rocket,        title: "Fast-Track Career Growth",     text: "Structured paths move you from beginner to job-ready efficiently — with clear milestones and real measurable outcomes." },
//     { Icon: Bot,           title: "AI & Cloud Ready",             text: "Future-proof your skills with dedicated tracks for cloud platforms, DevOps, generative AI, data science, and agent automation." },
//     { Icon: Handshake,     title: "Supportive Community",         text: "Join a thriving network of learners, alumni, and mentors. Collaborate, get feedback, and grow together beyond the classroom." },
//   ];
//   return (
//     <section className="ilmora-why-section" id="why-choose">
//       <div className="ilmora-section-wrap">
//         <div className="ilmora-section-header">
//           <div className="ilmora-section-tag"><Star size={12} /> Why ILM ORA</div>
//           <h2>Why Choose These Platforms</h2>
//           <p>We combine expert mentorship with real-world projects so you graduate with skills employers trust.</p>
//         </div>
//         <div className="ilmora-discussion-strip">
//           <div className="ilmora-discussion-video-wrap">
//             <video src={discussionVideo} autoPlay loop muted playsInline preload="auto" />
//           </div>
//           <div className="ilmora-discussion-text">
//             <h3>Learn Together,<br /><span>Grow Together</span></h3>
//             <p>
//               Our programs are built around collaborative learning. You'll work with peers,
//               get mentor feedback, and tackle real-world problems as a team — just like in
//               a professional environment.
//             </p>
//             <div className="ilmora-discussion-pills">
//               <span className="ilmora-dpill"><Users size={12} /> Peer Learning</span>
//               <span className="ilmora-dpill"><GraduationCap size={12} /> Mentor Guidance</span>
//               <span className="ilmora-dpill"><Star size={12} /> Real Projects</span>
//               <span className="ilmora-dpill"><Briefcase size={12} /> Job Ready</span>
//             </div>
//           </div>
//         </div>
//         <div className="ilmora-why-grid">
//           {cards.map((c) => {
//             const CardIcon = c.Icon;
//             return (
//               <article key={c.title} className="ilmora-why-card">
//                 <div className="ilmora-why-icon"><CardIcon size={22} /></div>
//                 <h3>{c.title}</h3>
//                 <p>{c.text}</p>
//               </article>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ═══════════════════════════════════════════════
// //  FOOTER
// // ═══════════════════════════════════════════════
// function Footer() {
//   return (
//     <footer className="ilmora-footer">
//       <div className="foot-logo">
//         <span className="ilm">ILM</span> <span className="ora">ORA</span>
//       </div>
//       <p>© 2026 ILM ORA. All rights reserved.</p>
//     </footer>
//   );
// }

// // ═══════════════════════════════════════════════
// //  TOAST CONTAINER
// // ═══════════════════════════════════════════════
// function ToastContainer({ toasts }) {
//   return (
//     <div className="ilmora-toast-container">
//       {toasts.map((t) => (
//         <div key={t.id} className="ilmora-toast">
//           <span className="ilmora-toast-dot" />
//           <span>{t.message}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════
// //  MAIN EXPORT
// // ═══════════════════════════════════════════════
// export default function Platforms() {
//   useInjectStyles();

//   const [darkMode, setDarkMode]               = useState(false);
//   const [activePlatformId, setActivePlatformId] = useState("dev");
//   const [activeFilter, setActiveFilter]       = useState("all");
//   const [searchQuery, setSearchQuery]         = useState("");
//   const [modalProgram, setModalProgram]       = useState(null);
//   const [modalPlatform, setModalPlatform]     = useState(null);
//   const [savedInterests, setSavedInterests]   = useState(new Set());
//   const [fading, setFading]                   = useState(false);
//   const { toasts, showToast }                 = useToasts();
//   const platformsSectionRef                   = useRef(null);

//   // ✅ BUG FIX 2: Added cleanup return to reset data-theme on unmount.
//   // Previously data-theme="dark" persisted on <html> after navigating away,
//   // causing the main site's navbar and other pages to render with wrong styles.
//   useEffect(() => {
//     document.documentElement.dataset.theme = darkMode ? "dark" : "";
//     return () => {
//       document.documentElement.dataset.theme = "";
//     };
//   }, [darkMode]);

//   // Reset scroll on mount (fixes back-nav scroll position)
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "instant" });
//   }, []);

//   const activePlatform = platformData.find((p) => p.id === activePlatformId);

//   const filteredPrograms = (() => {
//     let programs = activePlatform.programs;
//     if (activeFilter === "popular")
//       programs = programs.filter((p) => p.popular);
//     else if (activeFilter === "beginner")
//       programs = programs.filter((p) => p.beginnerFriendly);
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       programs = programs.filter(
//         (p) =>
//           p.name.toLowerCase().includes(q) ||
//           p.description.toLowerCase().includes(q) ||
//           p.tools.some((t) => t.toLowerCase().includes(q)) ||
//           p.syllabus.some((s) => s.toLowerCase().includes(q)) ||
//           p.careerOutcome.toLowerCase().includes(q) ||
//           p.whoIsFor.toLowerCase().includes(q)
//       );
//     }
//     return programs;
//   })();

//   const handleSetPlatform = (id) => {
//     if (id === activePlatformId) return;
//     setFading(true);
//     setTimeout(() => {
//       setActivePlatformId(id);
//       setActiveFilter("all");
//       setSearchQuery("");
//       setFading(false);
//       showToast(`${platformData.find((p) => p.id === id).name} selected`);
//     }, 160);
//   };

//   const handleSetFilter = (f) => {
//     setFading(true);
//     setTimeout(() => { setActiveFilter(f); setFading(false); }, 160);
//   };

//   const handleSaveInterest = (progId, progName) => {
//     if (savedInterests.has(progId)) {
//       showToast(`Already saved: ${progName}`);
//       return;
//     }
//     setSavedInterests((prev) => new Set([...prev, progId]));
//     showToast(`Interest saved for ${progName}`);
//   };

//   const openModal = (progId) => {
//     const result = findProgramById(progId);
//     if (!result) return;
//     setModalProgram(result.program);
//     setModalPlatform(result.platform);
//   };

//   const closeModal = () => {
//     setModalProgram(null);
//     setModalPlatform(null);
//   };

//   const scrollToPlatforms = () =>
//     platformsSectionRef.current?.scrollIntoView({ behavior: "smooth" });

//   const ActivePlatformIcon = activePlatform.Icon;

//   return (
//     <>
//       <Navbar
//         darkMode={darkMode}
//         onToggleTheme={() => setDarkMode((v) => !v)}
//       />

//       <Hero onExplore={scrollToPlatforms} />

//       <section id="platforms" className="ilmora-platforms-section" ref={platformsSectionRef}>
//         <div className="ilmora-section-wrap">
//           <div className="ilmora-section-header">
//             <div className="ilmora-section-tag">
//               <BookOpen size={12} /> All Platforms
//             </div>
//             <h2>Choose Your Learning Platform</h2>
//             <p>Select a platform to explore its programs and structured learning paths.</p>
//           </div>

//           <BannerWithTabs
//             platforms={platformData}
//             activePlatformId={activePlatformId}
//             onSelect={handleSetPlatform}
//           />

//           <div className="ilmora-programs-panel">
//             <div className="ilmora-panel-top">
//               <div className="ilmora-panel-title-row">
//                 <div className="ilmora-panel-icon-name">
//                   <div className="ilmora-panel-icon">
//                     <ActivePlatformIcon size={22} />
//                   </div>
//                   <div className="ilmora-panel-title">{activePlatform.name}</div>
//                 </div>
//                 <div className="ilmora-panel-badge">
//                   {activePlatform.programs.length} Programs
//                 </div>
//               </div>
//               <div className="ilmora-panel-desc">{activePlatform.description}</div>
//               <div className="ilmora-panel-controls">
//                 <div className="ilmora-panel-search-wrap">
//                   <span className="ilmora-search-icon"><Search size={15} /></span>
//                   <input
//                     className="ilmora-panel-search"
//                     type="text"
//                     placeholder="Search programs, tools, topics…"
//                     autoComplete="off"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <div className="ilmora-filter-btns">
//                   {["all", "popular", "beginner"].map((f) => (
//                     <button
//                       key={f}
//                       className={`ilmora-filter-btn ${activeFilter === f ? "active" : ""}`}
//                       onClick={() => handleSetFilter(f)}
//                     >
//                       {f === "all" ? "All" : f === "popular" ? "Popular" : "Beginner Friendly"}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className={`ilmora-programs-grid ${fading ? "fading" : ""}`}>
//               {filteredPrograms.length === 0 ? (
//                 <div className="ilmora-empty-state">
//                   <div className="empty-icon"><Search size={48} /></div>
//                   <h3>No programs found</h3>
//                   <p>Try another keyword.</p>
//                 </div>
//               ) : (
//                 filteredPrograms.map((prog) => (
//                   <ProgramCard
//                     key={prog.id}
//                     prog={prog}
//                     savedInterests={savedInterests}
//                     onSyllabus={openModal}
//                     onSave={handleSaveInterest}
//                   />
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       <WhyChoose />
//       <Footer />

//       <SyllabusModal
//         prog={modalProgram}
//         platform={modalPlatform}
//         savedInterests={savedInterests}
//         onClose={closeModal}
//         onSave={handleSaveInterest}
//       />

//       <ToastContainer toasts={toasts} />
//     </>
//   );
// }





























































import { useState, useEffect, useCallback, useRef } from "react";
import {
  Rocket, BookOpen, Star, Users, Briefcase, Bot, Cloud,
  Shield, Database, BarChart2, FlaskConical, Plug, Link2, Globe,
  Sparkles, Server, RefreshCw, Package, Wrench, Headphones,
  MessageSquare, Brain, Zap, Target, GraduationCap, Layers,
  TrendingUp, Cpu, Handshake, Search, Bookmark, BookMarked,
  X, ChevronRight, Layout,
  Settings, Code2, Activity, Bell,
} from "lucide-react";

import heroVideo from "../../assets/collge_student.mp4";
import discussionVideo from "../../assets/Discussion_collge.mp4";

// ✅ Shared shell used by every other public page (Careers, About,
// Pricing, Contact, FAQ, etc). It renders the ONE global
// AnnouncementBanner → Navbar → ... → Footer for the whole site.
// Adjust this relative path if Platforms.jsx lives somewhere other
// than the same folder as Careers.jsx.
import PublicLayout from "../Landing/components/PublicLayout";

// ═══════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════
const platformData = [
  {
    id: "dev",
    name: "Development Engineering Platform",
    Icon: Code2,
    shortDesc: "Full-stack development essentials",
    description:
      "Master full-stack engineering with modern tools, frameworks, and architectural patterns for production-ready applications.",
    programs: [
      {
        id: "ui-dev", name: "UI Development", Icon: Layout,
        difficulty: "Beginner", duration: "8 Weeks", popular: true, beginnerFriendly: true,
        description: "Learn to build clean, responsive, and modern user interfaces for web applications.",
        careerOutcome: "Frontend Developer / UI Developer",
        whoIsFor: "Students and beginners who want to build beautiful web pages and frontend screens.",
        tools: ["HTML", "CSS", "JavaScript", "Responsive Design", "Figma Basics"],
        syllabus: ["Web fundamentals and browser basics", "HTML structure and semantic tags", "CSS styling, box model, flexbox, and grid", "Responsive design for mobile and desktop", "JavaScript basics for UI interactions", "Forms, validation, and accessibility basics", "Landing page and dashboard UI project", "Portfolio-ready final UI project"],
      },
      {
        id: "backend-dev", name: "Backend Development", Icon: Settings,
        difficulty: "Intermediate", duration: "10 Weeks", popular: true, beginnerFriendly: false,
        description: "Learn backend architecture, APIs, authentication, business logic, and database integration.",
        careerOutcome: "Backend Developer / Full Stack Developer",
        whoIsFor: "Learners who want to build server-side applications and APIs.",
        tools: ["Java", "Spring Boot", "Node.js Basics", "REST APIs", "JWT", "PostgreSQL"],
        syllabus: ["Backend fundamentals and client-server architecture", "REST API design and HTTP methods", "Controllers, services, repositories, and DTOs", "Authentication and authorization basics", "Database integration and transactions", "Error handling and validation", "File upload and notification basics", "Complete backend API project"],
      },
      {
        id: "database", name: "Database", Icon: Database,
        difficulty: "Beginner", duration: "6 Weeks", popular: false, beginnerFriendly: true,
        description: "Learn database design, SQL queries, relationships, indexing, and data management.",
        careerOutcome: "Database Developer / Backend Support Engineer",
        whoIsFor: "Students who want strong SQL and database foundation.",
        tools: ["SQL", "PostgreSQL", "MySQL", "ER Diagrams"],
        syllabus: ["Database fundamentals and DBMS concepts", "Tables, rows, columns, keys, and constraints", "SQL SELECT, INSERT, UPDATE, DELETE", "Joins, grouping, sorting, and filtering", "Relationships and normalization", "Indexes and query optimization basics", "Transactions and data integrity", "Mini database design project"],
      },
      {
        id: "api-soap", name: "API - SOAP", Icon: Plug,
        difficulty: "Intermediate", duration: "5 Weeks", popular: false, beginnerFriendly: false,
        description: "Learn SOAP APIs, XML-based services, WSDL, and enterprise integration concepts.",
        careerOutcome: "Integration Developer / Backend Developer",
        whoIsFor: "Learners working with enterprise or legacy service integrations.",
        tools: ["SOAP", "XML", "WSDL", "Postman", "Java"],
        syllabus: ["SOAP API fundamentals", "XML request and response structure", "WSDL and service contracts", "SOAP headers and body", "Error handling in SOAP services", "Testing SOAP APIs using tools", "Enterprise integration patterns", "SOAP service mini project"],
      },
      {
        id: "graphql", name: "GraphQL API", Icon: Link2,
        difficulty: "Intermediate", duration: "6 Weeks", popular: false, beginnerFriendly: false,
        description: "Learn GraphQL schemas, queries, mutations, resolvers, and optimized data fetching.",
        careerOutcome: "API Developer / Full Stack Developer",
        whoIsFor: "Developers who want modern API skills beyond REST.",
        tools: ["GraphQL", "JavaScript", "Node.js", "Apollo Basics"],
        syllabus: ["GraphQL fundamentals", "Schema, types, and fields", "Queries and mutations", "Resolvers and data sources", "Nested data and relationships", "Error handling and validation", "GraphQL vs REST comparison", "GraphQL API mini project"],
      },
      {
        id: "rest-api", name: "REST API", Icon: Globe,
        difficulty: "Beginner to Intermediate", duration: "7 Weeks", popular: true, beginnerFriendly: true,
        description: "Learn to design RESTful APIs using HTTP methods, status codes, resources, and clean endpoints.",
        careerOutcome: "Backend Developer / API Developer",
        whoIsFor: "Frontend, backend, and full-stack learners.",
        tools: ["REST", "HTTP", "Postman", "JSON", "Java/Spring Boot"],
        syllabus: ["REST architecture basics", "HTTP methods and status codes", "Request body, query params, and path variables", "API response structure and error format", "CRUD API development", "Authentication and protected endpoints", "API testing with Postman", "REST API final project"],
      },
    ],
  },
  {
    id: "ai",
    name: "AI – Agent AI",
    Icon: Bot,
    shortDesc: "AI, cloud, data & DevOps in one track",
    description: "From generative AI to data pipelines — master the tools that power modern intelligent systems and cloud infrastructure.",
    programs: [
      {
        id: "gen-ai", name: "Gen AI", Icon: Sparkles,
        difficulty: "Beginner", duration: "8 Weeks", popular: true, beginnerFriendly: true,
        description: "Learn generative AI concepts, prompt engineering, AI tools, and AI-powered workflows.",
        careerOutcome: "AI Tools Specialist / Gen AI Associate",
        whoIsFor: "Students, professionals, and creators who want to use AI in real work.",
        tools: ["ChatGPT", "Prompt Engineering", "AI Agents Basics", "Automation Tools"],
        syllabus: ["Introduction to generative AI", "LLM basics and AI model behavior", "Prompt engineering fundamentals", "Role prompts, structured prompts, and workflow planning", "AI tools for content, coding, research, and productivity", "AI agents and workflow automation basics", "Responsible AI and safety basics", "Gen AI workflow project"],
      },
      {
        id: "cloud", name: "Cloud", Icon: Cloud,
        difficulty: "Beginner", duration: "7 Weeks", popular: true, beginnerFriendly: true,
        description: "Learn cloud fundamentals, compute, storage, networking, and deployment basics.",
        careerOutcome: "Cloud Associate / Junior Cloud Engineer",
        whoIsFor: "Beginners starting cloud computing.",
        tools: ["AWS Basics", "Azure Basics", "Linux Basics", "Cloud Console"],
        syllabus: ["Cloud computing fundamentals", "IaaS, PaaS, SaaS models", "Compute, storage, and networking basics", "Identity and access basics", "Cloud deployment concepts", "Monitoring and billing basics", "Cloud security fundamentals", "Simple cloud deployment project"],
      },
      {
        id: "cloud-platform", name: "Cloud Platform", Icon: Server,
        difficulty: "Intermediate", duration: "9 Weeks", popular: false, beginnerFriendly: false,
        description: "Learn how cloud platforms support scalable applications, infrastructure, and enterprise systems.",
        careerOutcome: "Cloud Platform Engineer",
        whoIsFor: "Learners who want deeper cloud platform and infrastructure skills.",
        tools: ["AWS/Azure/GCP Concepts", "Docker Basics", "Monitoring Tools"],
        syllabus: ["Cloud platform architecture", "Virtual machines and container basics", "Load balancing and scaling", "Storage services and database services", "Networking and security groups", "Logging and monitoring", "Deployment architecture", "Cloud platform case study project"],
      },
      {
        id: "devops", name: "DevOps", Icon: RefreshCw,
        difficulty: "Intermediate", duration: "10 Weeks", popular: true, beginnerFriendly: false,
        description: "Learn CI/CD, automation, deployment pipelines, containers, and release workflows.",
        careerOutcome: "DevOps Engineer / Release Engineer",
        whoIsFor: "Developers and operations learners who want modern deployment skills.",
        tools: ["Git", "GitHub Actions", "Docker", "CI/CD", "Linux"],
        syllabus: ["DevOps culture and SDLC", "Git and branching strategies", "Build and release pipelines", "CI/CD fundamentals", "Docker and container basics", "Environment variables and deployment configs", "Monitoring deployment health", "CI/CD pipeline project"],
      },
      {
        id: "sre", name: "SRE", Icon: Shield,
        difficulty: "Advanced", duration: "8 Weeks", popular: false, beginnerFriendly: false,
        description: "Learn reliability engineering, monitoring, incident response, SLAs, SLOs, and system stability.",
        careerOutcome: "Site Reliability Engineer",
        whoIsFor: "Cloud, DevOps, and backend learners interested in production reliability.",
        tools: ["Monitoring", "Logging", "Alerting", "Linux", "Incident Management"],
        syllabus: ["SRE fundamentals", "SLIs, SLOs, and SLAs", "Monitoring and observability", "Incident response workflow", "Error budgets and reliability planning", "Capacity and performance basics", "Postmortems and RCA", "Reliability improvement project"],
      },
      {
        id: "data-engineering", name: "Data Engineering", Icon: Package,
        difficulty: "Intermediate", duration: "10 Weeks", popular: true, beginnerFriendly: false,
        description: "Learn data pipelines, ETL workflows, warehouses, and large-scale data processing systems.",
        careerOutcome: "Data Engineer",
        whoIsFor: "Learners who want to build systems that move and transform data.",
        tools: ["SQL", "Python Basics", "ETL", "Data Warehouse Concepts"],
        syllabus: ["Data engineering fundamentals", "Data sources and ingestion", "ETL and ELT workflows", "Batch processing basics", "Data warehouse concepts", "Data quality and validation", "Pipeline scheduling basics", "Data pipeline project"],
      },
      {
        id: "data-engineer", name: "Data Engineer", Icon: Wrench,
        difficulty: "Intermediate", duration: "9 Weeks", popular: false, beginnerFriendly: false,
        description: "Prepare for data engineer roles with databases, pipelines, cloud data tools, and analytics systems.",
        careerOutcome: "Junior Data Engineer",
        whoIsFor: "Students targeting data engineer jobs.",
        tools: ["SQL", "Python", "Cloud Data Basics", "Pipelines"],
        syllabus: ["Role of a data engineer", "SQL for data engineering", "Python for data workflows", "Data modeling basics", "Pipeline design patterns", "Cloud data services overview", "Data validation and monitoring", "Data engineer portfolio project"],
      },
      {
        id: "data-analyst", name: "Data Analyst", Icon: BarChart2,
        difficulty: "Beginner", duration: "8 Weeks", popular: true, beginnerFriendly: true,
        description: "Learn data analysis, dashboards, reporting, SQL, Excel, BI tools, and business insights.",
        careerOutcome: "Data Analyst / BI Analyst",
        whoIsFor: "Learners who want analytics and reporting roles.",
        tools: ["Excel", "SQL", "Power BI/Tableau Concepts", "Dashboards"],
        syllabus: ["Data analysis fundamentals", "Excel for data cleaning and reporting", "SQL for analysis", "Metrics and KPIs", "Dashboard design basics", "Data visualization best practices", "Business insight storytelling", "Analytics dashboard project"],
      },
      {
        id: "data-scientist", name: "Data Scientist", Icon: FlaskConical,
        difficulty: "Advanced", duration: "12 Weeks", popular: false, beginnerFriendly: false,
        description: "Learn machine learning, statistics, model building, data exploration, and predictive analytics.",
        careerOutcome: "Junior Data Scientist / ML Associate",
        whoIsFor: "Learners interested in AI, ML, prediction, and advanced analytics.",
        tools: ["Python", "Statistics", "Machine Learning Basics", "Jupyter"],
        syllabus: ["Data science fundamentals", "Python for data science", "Statistics and probability basics", "Data cleaning and exploration", "Machine learning fundamentals", "Model training and evaluation", "Prediction and classification use cases", "Data science capstone project"],
      },
    ],
  },
  {
    id: "cx",
    name: "Contact Center Platform",
    Icon: Headphones,
    shortDesc: "AI-powered CX & conversation design",
    description: "Design intelligent customer experiences using AI-driven bots, conversation platforms, and modern CX frameworks.",
    programs: [
      {
        id: "cx-ai", name: "AI", Icon: Bot,
        difficulty: "Beginner", duration: "6 Weeks", popular: true, beginnerFriendly: true,
        description: "Understand how AI improves customer support, automation, routing, and service quality.",
        careerOutcome: "AI Customer Experience Associate",
        whoIsFor: "Learners interested in AI-powered customer experience and support systems.",
        tools: ["AI Basics", "Customer Support Automation", "Analytics"],
        syllabus: ["AI in customer experience", "Customer intent and automation", "Smart routing and response suggestions", "AI-assisted agent workflows", "Quality monitoring basics", "Customer analytics basics", "AI ethics in support", "AI support use case project"],
      },
      {
        id: "chatbot", name: "Chatbot", Icon: MessageSquare,
        difficulty: "Beginner", duration: "6 Weeks", popular: true, beginnerFriendly: true,
        description: "Learn chatbot flows, conversation design, FAQ automation, and customer interaction handling.",
        careerOutcome: "Chatbot Designer / CX Automation Associate",
        whoIsFor: "Support teams and learners building customer-facing bot experiences.",
        tools: ["Conversation Design", "Bot Flow Builder Concepts", "FAQ Automation"],
        syllabus: ["Chatbot fundamentals", "Conversation design basics", "Intents, entities, and FAQs", "Bot flow planning", "Fallback and escalation handling", "Testing chatbot conversations", "Customer journey mapping", "Chatbot flow project"],
      },
      {
        id: "ai-bot", name: "AI BOT", Icon: Brain,
        difficulty: "Intermediate", duration: "7 Weeks", popular: true, beginnerFriendly: false,
        description: "Build intelligent AI bot experiences with automation, natural language, and smart responses.",
        careerOutcome: "AI Bot Developer / Automation Associate",
        whoIsFor: "Learners who want to build smarter bots for customer support and automation.",
        tools: ["AI Bot Concepts", "NLP Basics", "Automation Workflows"],
        syllabus: ["AI bot fundamentals", "NLP and intent detection basics", "Smart response generation", "Automation actions and triggers", "Human handoff and escalation", "Bot analytics and improvement", "AI bot testing strategy", "AI bot automation project"],
      },
      {
        id: "tora-cx", name: "TORA CX", Icon: Zap,
        difficulty: "Intermediate", duration: "8 Weeks", popular: false, beginnerFriendly: false,
        description: "Explore TORA CX contact center platform concepts for customer experience and support operations.",
        careerOutcome: "CX Platform Associate / Contact Center Operations Associate",
        whoIsFor: "Learners and teams working with contact center platforms and customer experience systems.",
        tools: ["TORA CX Concepts", "Contact Center Workflows", "Reporting", "Automation"],
        syllabus: ["Contact center platform fundamentals", "Customer experience workflows", "Agent and supervisor operations", "Ticket routing and queue management", "Reporting and performance metrics", "Automation in CX platforms", "Quality and compliance basics", "TORA CX workflow project"],
      },
    ],
  },
];

// ═══════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════
function getDifficultyClass(difficulty) {
  const d = difficulty.toLowerCase();
  if (d.includes("beginner") && !d.includes("intermediate")) return "Beginner";
  if (d.includes("intermediate")) return "Intermediate";
  if (d.includes("advanced")) return "Advanced";
  return "other";
}

function findProgramById(programId) {
  for (const platform of platformData) {
    const prog = platform.programs.find((p) => p.id === programId);
    if (prog) return { program: prog, platform };
  }
  return null;
}

// ═══════════════════════════════════════════════
//  STYLES
//  ✅ ALIGNMENT FIX: everything is scoped under `.ilm-plat` instead
//  of bare `*` / `html` / `body` / `a` / `ul` / `button` selectors
//  and an unscoped `:root`. Those global rules used to leak outside
//  this component (stripping margin/padding off, and overriding
//  CSS variables used by) PublicLayout's shared navbar and footer —
//  that's what caused the "cut"/misaligned look on other pages.
//  This mirrors the same fix already applied on the Careers page.
// ═══════════════════════════════════════════════
const cssText = `
.ilm-plat {
  --bg: #fffaf5; --surface: #ffffff; --surface2: #fdf6ee;
  --dark: #0f172a; --dark2: #1e293b; --mid: #374151; --muted: #64748b;
  --border: #e8e0d6; --border2: #f0e8df;
  --orange: #f97316; --orange-d: #ea6c0a; --orange-lt: #fff7ed;
  --orange-md: #fed7aa; --orange-glow: rgba(249,115,22,.18);
  --green: #16a34a; --green-lt: #f0fdf4;
  --radius-sm: 8px; --radius: 14px; --radius-lg: 20px;
  --shadow-sm: 0 1px 6px rgba(15,23,42,.06);
  --shadow: 0 4px 20px rgba(15,23,42,.09);
  --shadow-lg: 0 12px 48px rgba(15,23,42,.13);
  --transition: .22s cubic-bezier(.4,0,.2,1);
  --font-display: 'Georgia','Times New Roman',serif;
  --font-body: 'Segoe UI',system-ui,-apple-system,sans-serif;

  font-family: var(--font-body);
  background: var(--bg);
  color: var(--dark);
  line-height: 1.6;
  font-size: 16px;
  scroll-behavior: smooth;
  transition: background var(--transition), color var(--transition);
}
.ilm-plat[data-theme="dark"] {
  --bg: #0f1117; --surface: #1a1f2e; --surface2: #141824;
  --dark: #f1f5f9; --dark2: #e2e8f0; --mid: #cbd5e1; --muted: #94a3b8;
  --border: #2a3244; --border2: #222840;
  --orange-lt: #1c1208; --orange-md: #7c3d12; --green-lt: #052e16;
}
.ilm-plat, .ilm-plat *, .ilm-plat *::before, .ilm-plat *::after { box-sizing: border-box; }
.ilm-plat a { text-decoration: none; color: inherit; }
.ilm-plat ul { list-style: none; }
.ilm-plat button { font-family: inherit; cursor: pointer; }
.ilm-plat ::-webkit-scrollbar { width: 6px; height: 6px; }
.ilm-plat ::-webkit-scrollbar-track { background: var(--bg); }
.ilm-plat ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }
.ilm-plat ::-webkit-scrollbar-thumb:hover { background: var(--orange); }

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
.ilmora-hero {
  position: relative; overflow: hidden;
  padding: 72px 32px;
  background: var(--bg);
}
.ilmora-hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 60% 70% at 0% 50%, rgba(249,115,22,.10) 0%, transparent 60%),
    radial-gradient(ellipse 40% 50% at 100% 20%, rgba(22,163,74,.07) 0%, transparent 55%);
}
.ilmora-hero-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 480px;
  gap: 52px; align-items: center; position: relative;
}
.ilmora-hero-text { display: flex; flex-direction: column; align-items: flex-start; }
.ilmora-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--orange-lt); border: 1.5px solid var(--orange-md);
  color: var(--orange); font-size: .78rem; font-weight: 700;
  letter-spacing: .04em; text-transform: uppercase;
  padding: 5px 15px; border-radius: 999px; margin-bottom: 22px;
  animation: ilmoraFadeUp .5s ease both;
}
.ilmora-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700;
  letter-spacing: -.5px; line-height: 1.18; margin-bottom: 18px;
  color: var(--dark); animation: ilmoraFadeUp .55s .06s ease both;
}
.ilmora-hero h1 .highlight {
  color: var(--orange); position: relative; display: inline-block;
}
.ilmora-hero h1 .highlight::after {
  content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
  height: 3px; background: var(--orange); border-radius: 999px; opacity: .35;
}
.ilmora-hero-sub {
  font-size: 1rem; color: var(--muted); max-width: 520px;
  margin: 0 0 32px; line-height: 1.7;
  animation: ilmoraFadeUp .6s .12s ease both;
}
.ilmora-hero-btns {
  display: flex; gap: 12px; flex-wrap: wrap;
  animation: ilmoraFadeUp .65s .18s ease both;
}
.ilmora-btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--orange); color: #fff; padding: 13px 28px;
  border-radius: 10px; font-size: .95rem; font-weight: 700; border: none;
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
  cursor: pointer;
}
.ilmora-btn-primary:hover {
  background: var(--orange-d); transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(249,115,22,.35);
}
.ilmora-hero-stats {
  display: flex; gap: 40px; flex-wrap: wrap;
  margin-top: 44px; animation: ilmoraFadeUp .7s .24s ease both;
}
.ilmora-hero-stat { text-align: left; }
.ilmora-hero-stat .num {
  font-family: var(--font-display); font-size: 1.8rem;
  font-weight: 700; color: var(--dark);
}
.ilmora-hero-stat .num b { color: var(--orange); }
.ilmora-hero-stat .lbl { font-size: .75rem; color: var(--muted); font-weight: 500; margin-top: 1px; }
.ilmora-hero-video-wrap {
  position: relative; border-radius: 20px; overflow: hidden;
  box-shadow: 0 24px 64px rgba(15,23,42,.18), 0 0 0 1.5px var(--border);
  animation: ilmoraFadeUp .7s .3s ease both;
  aspect-ratio: 16/10; background: var(--dark2);
}
.ilmora-hero-video-wrap video {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.ilmora-hero-video-wrap::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: linear-gradient(90deg, var(--orange), var(--green)); z-index: 2;
}
.ilmora-video-badge {
  position: absolute; bottom: 16px; left: 16px;
  background: rgba(15,23,42,.82); backdrop-filter: blur(10px);
  color: #fff; font-size: .75rem; font-weight: 700;
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,.12);
  display: flex; align-items: center; gap: 7px;
  z-index: 3; letter-spacing: .03em;
}
.ilmora-video-badge .vbdot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e;
  animation: livePulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes livePulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.35); }
}
@media(max-width: 1060px) {
  .ilmora-hero-inner { grid-template-columns: 1fr; gap: 36px; }
  .ilmora-hero-text { align-items: center; text-align: center; }
  .ilmora-hero h1 { text-align: center; }
  .ilmora-hero-sub { text-align: center; margin: 0 auto 32px; }
  .ilmora-hero-btns { justify-content: center; }
  .ilmora-hero-stats { justify-content: center; }
  .ilmora-hero-stat { text-align: center; }
  .ilmora-hero-video-wrap { max-width: 560px; margin: 0 auto; }
}
@media(max-width: 680px) {
  .ilmora-hero { padding: 56px 20px 52px; }
  .ilmora-hero-stats { gap: 24px; }
}

/* SECTION */
.ilmora-section-wrap { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
.ilmora-section-header { text-align: center; margin-bottom: 36px; }
.ilmora-section-tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--orange-lt); color: var(--orange);
  font-size: .75rem; font-weight: 700; letter-spacing: .06em;
  text-transform: uppercase; padding: 4px 13px;
  border-radius: 999px; margin-bottom: 14px;
}
.ilmora-section-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 700;
  letter-spacing: -.3px; margin-bottom: 12px;
}
.ilmora-section-header p {
  color: var(--muted); max-width: 540px; margin: 0 auto; font-size: .95rem;
}

/* BANNER WITH TABS */
.ilmora-tabs-banner {
  background: linear-gradient(135deg, var(--orange) 0%, #fb923c 55%, #f59e0b 100%);
  border-radius: var(--radius); padding: 18px 22px 0;
  margin-bottom: 20px; overflow: hidden; position: relative;
  box-shadow: 0 6px 28px rgba(249,115,22,.30);
}
.ilmora-tabs-banner::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,.07); pointer-events: none;
}
.ilmora-tabs-banner::after {
  content: ''; position: absolute; bottom: 10px; left: 38%;
  width: 100px; height: 100px; border-radius: 50%;
  background: rgba(255,255,255,.05); pointer-events: none;
}
.ilmora-tabs-banner-top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 16px; position: relative; z-index: 1;
}
.ilmora-tabs-banner-left { display: flex; align-items: center; gap: 11px; }
.ilmora-tabs-banner-icon {
  width: 36px; height: 36px; border-radius: 9px;
  background: rgba(255,255,255,.2); border: 1.5px solid rgba(255,255,255,.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: #fff;
}
.ilmora-tabs-banner-text { display: flex; flex-direction: column; gap: 1px; }
.ilmora-tabs-banner-title { font-size: .875rem; font-weight: 700; color: #fff; white-space: nowrap; }
.ilmora-tabs-banner-sub { font-size: .72rem; color: rgba(255,255,255,.78); white-space: nowrap; }
.ilmora-tabs-banner-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ilmora-tabs-banner-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.22); border: 1.5px solid rgba(255,255,255,.38);
  color: #fff; font-size: .7rem; font-weight: 700; padding: 5px 13px;
  border-radius: 999px; letter-spacing: .04em; text-transform: uppercase;
  white-space: nowrap; cursor: default; transition: background var(--transition);
}
.ilmora-tabs-banner-pulse {
  width: 7px; height: 7px; border-radius: 50%; background: #fff;
  animation: livePulse 1.4s ease-in-out infinite; flex-shrink: 0;
}
.ilmora-banner-tabs {
  display: flex; align-items: flex-end; gap: 2px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none; position: relative; z-index: 1;
}
.ilmora-banner-tabs::-webkit-scrollbar { display: none; }
.ilmora-banner-tab {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 20px 12px; border: none;
  background: rgba(255,255,255,.12); color: rgba(255,255,255,.82);
  font-size: .875rem; font-weight: 600; cursor: pointer;
  white-space: nowrap; flex-shrink: 0;
  border-radius: 10px 10px 0 0;
  transition: background var(--transition), color var(--transition);
  margin-right: 2px;
}
.ilmora-banner-tab:hover { background: rgba(255,255,255,.22); color: #fff; }
.ilmora-banner-tab.active { background: var(--surface); color: var(--orange); font-weight: 700; }
.ilm-plat[data-theme="dark"] .ilmora-banner-tab.active { background: var(--surface); color: var(--orange); }
.ilmora-banner-tab-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ilmora-banner-tab-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 5px; border-radius: 999px;
  font-size: .68rem; font-weight: 800;
  background: rgba(255,255,255,.25); color: #fff;
  border: 1px solid rgba(255,255,255,.3);
  transition: background var(--transition), color var(--transition);
}
.ilmora-banner-tab.active .ilmora-banner-tab-count {
  background: var(--orange); color: #fff; border-color: var(--orange);
}
@media(max-width: 700px) {
  .ilmora-tabs-banner { padding: 14px 16px 0; }
  .ilmora-banner-tab { padding: 9px 14px 10px; font-size: .8rem; }
  .ilmora-tabs-banner-sub { display: none; }
}
@media(max-width: 480px) { .ilmora-tabs-banner-right { display: none; } }

/* PLATFORM SECTION */
.ilmora-platforms-section { padding: 80px 0; }
.ilmora-programs-panel { min-height: 400px; }
.ilmora-panel-top {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--radius); padding: 24px 28px 20px; margin-bottom: 20px;
}
.ilmora-panel-title-row {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 8px;
}
.ilmora-panel-icon-name { display: flex; align-items: center; gap: 12px; }
.ilmora-panel-icon {
  width: 46px; height: 46px;
  background: var(--orange-lt); border: 1.5px solid var(--orange-md);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--orange);
}
.ilmora-panel-title {
  font-family: var(--font-display); font-size: 1.35rem;
  font-weight: 700; color: var(--dark);
}
.ilmora-panel-badge {
  background: var(--orange); color: #fff; font-size: .75rem; font-weight: 700;
  padding: 4px 12px; border-radius: 999px; flex-shrink: 0;
  align-self: flex-start; margin-top: 2px;
}
.ilmora-panel-desc { font-size: .875rem; color: var(--muted); margin-bottom: 18px; line-height: 1.65; }
.ilmora-panel-controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.ilmora-panel-search-wrap { position: relative; flex: 1; min-width: 200px; }
.ilmora-panel-search-wrap .ilmora-search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; color: var(--muted); pointer-events: none;
}
.ilmora-panel-search {
  width: 100%; padding: 9px 12px 9px 38px;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  background: var(--bg); color: var(--dark); font-size: .875rem;
  transition: border-color var(--transition), box-shadow var(--transition); outline: none;
}
.ilmora-panel-search:focus {
  border-color: var(--orange); box-shadow: 0 0 0 3px var(--orange-glow);
}
.ilmora-panel-search::placeholder { color: var(--muted); }
.ilmora-filter-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.ilmora-filter-btn {
  padding: 7px 14px; border-radius: var(--radius-sm);
  font-size: .8rem; font-weight: 600;
  background: var(--bg); color: var(--muted);
  border: 1.5px solid var(--border); transition: all var(--transition); cursor: pointer;
}
.ilmora-filter-btn:hover { border-color: var(--orange-md); color: var(--dark); }
.ilmora-filter-btn.active {
  background: var(--orange); color: #fff; border-color: var(--orange);
  box-shadow: 0 2px 10px rgba(249,115,22,.25);
}

/* PROGRAM CARDS */
.ilmora-programs-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px; transition: opacity var(--transition);
}
.ilmora-programs-grid.fading { opacity: 0; transform: translateY(8px); }
.ilmora-prog-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--radius); padding: 20px; cursor: pointer;
  display: flex; flex-direction: column; gap: 10px;
  transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
  animation: ilmoraCardIn .3s ease both;
}
.ilmora-prog-card:hover {
  border-color: var(--orange-md);
  box-shadow: 0 6px 28px rgba(249,115,22,.12);
  transform: translateY(-3px);
}
.ilmora-prog-card-head { display: flex; align-items: center; gap: 12px; }
.ilmora-prog-card-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--orange-lt); border: 1.5px solid var(--orange-md);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--orange);
}
.ilmora-prog-card-name { font-size: .925rem; font-weight: 700; color: var(--dark); line-height: 1.3; }
.ilmora-prog-card-desc { font-size: .8rem; color: var(--muted); line-height: 1.55; flex: 1; }
.ilmora-prog-card-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.ilmora-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: .7rem; font-weight: 700; padding: 2px 8px;
  border-radius: 999px; border: 1.5px solid;
}
.ilmora-badge-Beginner { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.ilmora-badge-Intermediate { background: #fff7ed; color: #f97316; border-color: #fed7aa; }
.ilmora-badge-Advanced { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
.ilmora-badge-other { background: var(--surface2); color: var(--muted); border-color: var(--border); }
.ilmora-badge-duration { background: var(--surface2); color: var(--muted); border-color: var(--border); }
.ilmora-badge-popular { background: #fff7ed; color: #f97316; border-color: #fed7aa; }
.ilmora-badge-beginner-friendly { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.ilmora-prog-card-actions { display: flex; gap: 8px; margin-top: 2px; }
.ilmora-btn-syllabus {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  background: var(--orange); color: #fff; padding: 8px 14px;
  border-radius: 8px; font-size: .78rem; font-weight: 700; border: none;
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
}
.ilmora-btn-syllabus:hover {
  background: var(--orange-d); transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(249,115,22,.3);
}
.ilmora-btn-save {
  display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  background: var(--bg); color: var(--muted); padding: 8px 12px;
  border-radius: 8px; font-size: .78rem; font-weight: 600;
  border: 1.5px solid var(--border); transition: all var(--transition); white-space: nowrap;
}
.ilmora-btn-save:hover { border-color: var(--orange-md); color: var(--orange); background: var(--orange-lt); }
.ilmora-btn-save.saved { background: var(--orange-lt); color: var(--orange); border-color: var(--orange); }

/* EMPTY STATE */
.ilmora-empty-state { grid-column: 1/-1; text-align: center; padding: 56px 20px; }
.ilmora-empty-state .empty-icon {
  display: flex; justify-content: center; margin-bottom: 14px; opacity: .4; color: var(--muted);
}
.ilmora-empty-state h3 { font-size: 1.05rem; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
.ilmora-empty-state p { color: var(--muted); font-size: .875rem; }

/* WHY CHOOSE */
.ilmora-why-section { padding: 80px 0; background: var(--surface); }
.ilmora-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.ilmora-why-card {
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: var(--radius); padding: 30px 26px;
  transition: box-shadow var(--transition), transform var(--transition);
}
.ilmora-why-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
.ilmora-why-icon {
  width: 50px; height: 50px; border-radius: 12px;
  background: var(--orange-lt); border: 1.5px solid var(--orange-md);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px; color: var(--orange);
}
.ilmora-why-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
.ilmora-why-card p { font-size: .83rem; color: var(--muted); line-height: 1.65; }

.ilmora-discussion-strip {
  margin-bottom: 52px; display: grid;
  grid-template-columns: 1fr 1fr; gap: 28px; align-items: center;
}
.ilmora-discussion-video-wrap {
  position: relative; border-radius: 18px; overflow: hidden;
  box-shadow: 0 16px 48px rgba(15,23,42,.14), 0 0 0 1.5px var(--border);
  aspect-ratio: 16/9; background: var(--dark2);
}
.ilmora-discussion-video-wrap video {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.ilmora-discussion-video-wrap::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(249,115,22,.08) 0%, transparent 60%);
  pointer-events: none;
}
.ilmora-discussion-video-wrap::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: linear-gradient(90deg, var(--green), var(--orange)); z-index: 2;
}
.ilmora-discussion-text h3 {
  font-family: var(--font-display); font-size: 1.6rem; font-weight: 700;
  color: var(--dark); line-height: 1.3; margin-bottom: 14px;
}
.ilmora-discussion-text h3 span { color: var(--orange); }
.ilmora-discussion-text p {
  font-size: .93rem; color: var(--muted); line-height: 1.75; margin-bottom: 22px;
}
.ilmora-discussion-pills { display: flex; gap: 10px; flex-wrap: wrap; }
.ilmora-dpill {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--orange-lt); border: 1.5px solid var(--orange-md);
  color: var(--orange); font-size: .77rem; font-weight: 700;
  padding: 5px 13px; border-radius: 999px;
}
@media(max-width: 900px) {
  .ilmora-discussion-strip { grid-template-columns: 1fr; }
  .ilmora-discussion-video-wrap { max-width: 560px; }
}
@media(max-width: 680px) { .ilmora-why-grid { grid-template-columns: repeat(2, 1fr); } }
@media(max-width: 520px) { .ilmora-why-grid { grid-template-columns: 1fr; } }

/* MODAL */
.ilmora-modal-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(15,23,42,.55); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; opacity: 0; pointer-events: none;
  transition: opacity var(--transition);
}
.ilmora-modal-overlay.open { opacity: 1; pointer-events: auto; }
.ilmora-modal {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--radius-lg); width: 100%; max-width: 720px;
  max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg);
  transform: scale(.96) translateY(12px); transition: transform var(--transition);
}
.ilmora-modal-overlay.open .ilmora-modal { transform: scale(1) translateY(0); }
.ilmora-modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; padding: 28px 28px 20px; border-bottom: 1.5px solid var(--border);
  position: sticky; top: 0; background: var(--surface); z-index: 1;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.ilmora-modal-title-group { display: flex; align-items: center; gap: 14px; }
.ilmora-modal-icon {
  width: 52px; height: 52px; border-radius: 12px;
  background: var(--orange-lt); border: 1.5px solid var(--orange-md);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--orange);
}
.ilmora-modal-title {
  font-family: var(--font-display); font-size: 1.25rem; font-weight: 700;
  color: var(--dark); line-height: 1.3; margin-bottom: 4px;
}
.ilmora-modal-platform {
  font-size: .78rem; color: var(--orange); font-weight: 600;
  background: var(--orange-lt); border: 1px solid var(--orange-md);
  padding: 2px 9px; border-radius: 999px; display: inline-block;
}
.ilmora-modal-close {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--surface2); border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--muted); flex-shrink: 0; transition: all var(--transition);
}
.ilmora-modal-close:hover {
  background: var(--orange-lt); border-color: var(--orange); color: var(--orange);
}
.ilmora-modal-body { padding: 24px 28px 28px; }
.ilmora-modal-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.ilmora-modal-desc {
  font-size: .9rem; color: var(--muted); line-height: 1.7; margin-bottom: 22px;
  padding: 16px; background: var(--surface2); border-radius: var(--radius-sm);
  border: 1px solid var(--border2);
}
.ilmora-modal-info-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 14px; margin-bottom: 22px;
}
.ilmora-modal-info-block {
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: var(--radius-sm); padding: 14px 16px;
}
.ilmora-modal-info-label {
  display: flex; align-items: center; gap: 5px;
  font-size: .7rem; font-weight: 700; color: var(--orange);
  text-transform: uppercase; letter-spacing: .05em; margin-bottom: 5px;
}
.ilmora-modal-info-value { font-size: .875rem; color: var(--dark); font-weight: 600; }
.ilmora-modal-tools { margin-bottom: 22px; }
.ilmora-modal-section-title {
  display: flex; align-items: center; gap: 7px;
  font-size: .875rem; font-weight: 700; color: var(--dark); margin-bottom: 12px;
}
.ilmora-tools-list { display: flex; gap: 7px; flex-wrap: wrap; }
.ilmora-tool-tag {
  background: var(--surface2); color: var(--mid); font-size: .77rem;
  font-weight: 600; padding: 4px 11px; border-radius: 999px;
  border: 1px solid var(--border);
}
.ilmora-syllabus-list { display: flex; flex-direction: column; gap: 8px; }
.ilmora-syllabus-item {
  display: flex; align-items: flex-start; gap: 10px;
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: var(--radius-sm); padding: 11px 14px;
  font-size: .845rem; color: var(--dark); line-height: 1.5;
}
.ilmora-syllabus-num {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--orange); color: #fff; font-size: .7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.ilmora-modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 18px 28px; border-top: 1.5px solid var(--border);
  background: var(--surface); border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  position: sticky; bottom: 0; z-index: 1;
}
.ilmora-btn-modal-save {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--orange); color: #fff; padding: 10px 22px;
  border-radius: var(--radius-sm); font-size: .875rem; font-weight: 700; border: none;
  transition: background var(--transition), transform var(--transition);
}
.ilmora-btn-modal-save:hover { background: var(--orange-d); transform: translateY(-1px); }
.ilmora-btn-modal-close {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--surface2); color: var(--mid); padding: 10px 22px;
  border-radius: var(--radius-sm); font-size: .875rem; font-weight: 600;
  border: 1.5px solid var(--border); transition: all var(--transition);
}
.ilmora-btn-modal-close:hover { border-color: var(--orange-md); color: var(--dark); }

/* TOAST */
.ilmora-toast-container {
  position: fixed; bottom: 28px; right: 28px; z-index: 900;
  display: flex; flex-direction: column; gap: 10px; pointer-events: none;
}
.ilmora-toast {
  background: var(--dark); color: #fff; padding: 12px 18px; border-radius: 10px;
  font-size: .845rem; font-weight: 600; box-shadow: 0 8px 28px rgba(15,23,42,.2);
  display: flex; align-items: center; gap: 10px;
  min-width: 220px; max-width: 340px; pointer-events: auto;
  animation: ilmoraToastIn .3s cubic-bezier(.34,1.56,.64,1) both;
}
.ilmora-toast-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--orange); flex-shrink: 0;
}

/* ANIMATIONS */
@keyframes ilmoraFadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ilmoraCardIn {
  from { opacity: 0; transform: translateY(12px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes ilmoraToastIn {
  from { opacity: 0; transform: translateX(50px) scale(.9); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}

/* RESPONSIVE */
@media(max-width: 680px) {
  .ilmora-section-wrap { padding: 0 20px; }
  .ilmora-modal-info-grid { grid-template-columns: 1fr; }
  .ilmora-modal-header,
  .ilmora-modal-body,
  .ilmora-modal-footer { padding-left: 20px; padding-right: 20px; }
  .ilmora-banner-tab { padding: 9px 12px 10px; font-size: .8rem; }
}
`;

// ═══════════════════════════════════════════════
//  STYLE INJECTION — React-managed, survives back navigation
// ═══════════════════════════════════════════════
const STYLE_ID = "ilmora-platforms-styles";

function useInjectStyles() {
  useEffect(() => {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = cssText;
    return () => {
      const toRemove = document.getElementById(STYLE_ID);
      if (toRemove) toRemove.remove();
    };
  }, []);
}

// ═══════════════════════════════════════════════
//  TOAST HOOK
// ═══════════════════════════════════════════════
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);
  return { toasts, showToast };
}

// ═══════════════════════════════════════════════
//  HERO
// ═══════════════════════════════════════════════
function Hero({ onExplore }) {
  return (
    <section className="ilmora-hero" id="hero">
      <div className="ilmora-hero-inner">
        <div className="ilmora-hero-text">
          <div className="ilmora-hero-badge">
            <Rocket size={13} /> Career-Ready Learning
          </div>
          <h1>
            Explore Career-Ready<br />
            Learning <span className="highlight">Platforms</span>
          </h1>
          <p className="ilmora-hero-sub">
            Choose a platform, explore related programs, and view structured
            syllabus paths designed for modern careers.
          </p>
          <div className="ilmora-hero-btns">
            <button className="ilmora-btn-primary" onClick={onExplore}>
              Explore Platforms <ChevronRight size={16} />
            </button>
          </div>
          <div className="ilmora-hero-stats">
            {[
              { num: "3",   sup: "+",  lbl: "Learning Platforms" },
              { num: "19",  sup: "+",  lbl: "Programs" },
              { num: "100", sup: "%",  lbl: "Practical Focus" },
              { num: "24",  sup: "/7", lbl: "Mentor Support" },
            ].map((s) => (
              <div className="ilmora-hero-stat" key={s.lbl}>
                <div className="num">{s.num}<b>{s.sup}</b></div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="ilmora-hero-video-wrap">
          <video src={heroVideo} autoPlay loop muted playsInline preload="auto" />
          <div className="ilmora-video-badge">
            <span className="vbdot" /> Real Students. Real Learning.
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════
//  BANNER WITH TABS
// ═══════════════════════════════════════════════
function BannerWithTabs({ platforms, activePlatformId, onSelect }) {
  return (
    <div className="ilmora-tabs-banner" role="navigation" aria-label="Platform selector">
      <div className="ilmora-tabs-banner-top">
        <div className="ilmora-tabs-banner-left">
          <div className="ilmora-tabs-banner-icon">
            <Bell size={15} />
          </div>
          <div className="ilmora-tabs-banner-text">
            <span className="ilmora-tabs-banner-title">Choose Your Platform</span>
            <span className="ilmora-tabs-banner-sub">Select a track to explore programs</span>
          </div>
        </div>
        <div className="ilmora-tabs-banner-right">
          <span className="ilmora-tabs-banner-pill">
            <span className="ilmora-tabs-banner-pulse" /> Enrolling Now
          </span>
        </div>
      </div>
      <div className="ilmora-banner-tabs" role="tablist">
        {platforms.map((platform) => {
          const TabIcon = platform.Icon;
          return (
            <button
              key={platform.id}
              role="tab"
              aria-selected={platform.id === activePlatformId}
              className={`ilmora-banner-tab ${platform.id === activePlatformId ? "active" : ""}`}
              onClick={() => onSelect(platform.id)}
            >
              <span className="ilmora-banner-tab-icon"><TabIcon size={15} /></span>
              <span>{platform.name}</span>
              <span className="ilmora-banner-tab-count">{platform.programs.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  DIFFICULTY BADGE
// ═══════════════════════════════════════════════
function DifficultyBadge({ difficulty }) {
  const cls = getDifficultyClass(difficulty);
  const icons = {
    Beginner: <GraduationCap size={10} />,
    Intermediate: <TrendingUp size={10} />,
    Advanced: <Cpu size={10} />,
    other: null,
  };
  return (
    <span className={`ilmora-badge ilmora-badge-${cls}`}>
      {icons[cls]}{difficulty}
    </span>
  );
}

// ═══════════════════════════════════════════════
//  PROGRAM CARD
// ═══════════════════════════════════════════════
function ProgramCard({ prog, savedInterests, onSyllabus, onSave }) {
  const isSaved = savedInterests.has(prog.id);
  const CardIcon = prog.Icon;
  return (
    <article
      className="ilmora-prog-card"
      tabIndex={0}
      onClick={() => onSyllabus(prog.id)}
      onKeyDown={(e) => { if (e.key === "Enter") onSyllabus(prog.id); }}
    >
      <div className="ilmora-prog-card-head">
        <div className="ilmora-prog-card-icon"><CardIcon size={18} /></div>
        <div className="ilmora-prog-card-name">{prog.name}</div>
      </div>
      <div className="ilmora-prog-card-desc">{prog.description}</div>
      <div className="ilmora-prog-card-badges">
        <DifficultyBadge difficulty={prog.difficulty} />
        <span className="ilmora-badge ilmora-badge-duration">
          <Activity size={10} /> {prog.duration}
        </span>
        {prog.popular && (
          <span className="ilmora-badge ilmora-badge-popular">
            <Star size={10} /> Popular
          </span>
        )}
        {prog.beginnerFriendly && (
          <span className="ilmora-badge ilmora-badge-beginner-friendly">
            <GraduationCap size={10} /> Beginner
          </span>
        )}
      </div>
      <div className="ilmora-prog-card-actions">
        <button
          className="ilmora-btn-syllabus"
          onClick={(e) => { e.stopPropagation(); onSyllabus(prog.id); }}
        >
          <BookOpen size={13} /> View Syllabus
        </button>
        <button
          className={`ilmora-btn-save ${isSaved ? "saved" : ""}`}
          onClick={(e) => { e.stopPropagation(); onSave(prog.id, prog.name); }}
        >
          {isSaved
            ? <><BookMarked size={13} /> Saved</>
            : <><Bookmark size={13} /> Save</>}
        </button>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════
//  SYLLABUS MODAL
// ═══════════════════════════════════════════════
function SyllabusModal({ prog, platform, savedInterests, onClose, onSave }) {
  const isSaved = prog && savedInterests.has(prog.id);

  useEffect(() => {
    if (!prog) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [prog, onClose]);

  useEffect(() => {
    document.body.style.overflow = prog ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [prog]);

  if (!prog) return null;
  const ModalIcon = prog.Icon;

  return (
    <div
      className={`ilmora-modal-overlay ${prog ? "open" : ""}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="ilmora-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ilmora-modal-header">
          <div className="ilmora-modal-title-group">
            <div className="ilmora-modal-icon"><ModalIcon size={24} /></div>
            <div>
              <div className="ilmora-modal-title">{prog.name}</div>
              <span className="ilmora-modal-platform">{platform.name}</span>
            </div>
          </div>
          <button className="ilmora-modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="ilmora-modal-body">
          <div className="ilmora-modal-meta">
            <DifficultyBadge difficulty={prog.difficulty} />
            <span className="ilmora-badge ilmora-badge-duration">
              <Activity size={10} /> {prog.duration}
            </span>
            {prog.popular && (
              <span className="ilmora-badge ilmora-badge-popular">
                <Star size={10} /> Popular
              </span>
            )}
            {prog.beginnerFriendly && (
              <span className="ilmora-badge ilmora-badge-beginner-friendly">
                <GraduationCap size={10} /> Beginner Friendly
              </span>
            )}
          </div>
          <div className="ilmora-modal-desc">{prog.description}</div>
          <div className="ilmora-modal-info-grid">
            <div className="ilmora-modal-info-block">
              <div className="ilmora-modal-info-label"><Target size={11} /> Career Outcome</div>
              <div className="ilmora-modal-info-value">{prog.careerOutcome}</div>
            </div>
            <div className="ilmora-modal-info-block">
              <div className="ilmora-modal-info-label"><Users size={11} /> Who Is This For</div>
              <div className="ilmora-modal-info-value">{prog.whoIsFor}</div>
            </div>
          </div>
          <div className="ilmora-modal-tools">
            <div className="ilmora-modal-section-title"><Wrench size={15} /> Tools & Technologies</div>
            <div className="ilmora-tools-list">
              {prog.tools.map((t) => (
                <span key={t} className="ilmora-tool-tag">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="ilmora-modal-section-title"><BookOpen size={15} /> Syllabus Modules</div>
            <div className="ilmora-syllabus-list">
              {prog.syllabus.map((mod, i) => (
                <div key={i} className="ilmora-syllabus-item">
                  <span className="ilmora-syllabus-num">{i + 1}</span>
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ilmora-modal-footer">
          <button className="ilmora-btn-modal-close" onClick={onClose}>
            <X size={14} /> Close
          </button>
          <button
            className="ilmora-btn-modal-save"
            onClick={() => { onSave(prog.id, prog.name); onClose(); }}
          >
            {isSaved
              ? <><BookMarked size={14} /> Already Saved</>
              : <><Bookmark size={14} /> Save Interest</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  WHY CHOOSE
// ═══════════════════════════════════════════════
function WhyChoose() {
  const cards = [
    { Icon: Target,        title: "Industry-Aligned Curriculum",  text: "Every program is crafted with input from working engineers and industry leaders to reflect what employers actually need today." },
    { Icon: GraduationCap, title: "Expert Mentors",               text: "Learn directly from seasoned professionals with years of real-world experience across development, AI, cloud, and CX platforms." },
    { Icon: Layers,        title: "Project-Based Learning",       text: "Build portfolio-ready projects from day one. Every module ends with a hands-on deliverable you can showcase to future employers." },
    { Icon: Rocket,        title: "Fast-Track Career Growth",     text: "Structured paths move you from beginner to job-ready efficiently — with clear milestones and real measurable outcomes." },
    { Icon: Bot,           title: "AI & Cloud Ready",             text: "Future-proof your skills with dedicated tracks for cloud platforms, DevOps, generative AI, data science, and agent automation." },
    { Icon: Handshake,     title: "Supportive Community",         text: "Join a thriving network of learners, alumni, and mentors. Collaborate, get feedback, and grow together beyond the classroom." },
  ];
  return (
    <section className="ilmora-why-section" id="why-choose">
      <div className="ilmora-section-wrap">
        <div className="ilmora-section-header">
          <div className="ilmora-section-tag"><Star size={12} /> Why ILM ORA</div>
          <h2>Why Choose These Platforms</h2>
          <p>We combine expert mentorship with real-world projects so you graduate with skills employers trust.</p>
        </div>
        <div className="ilmora-discussion-strip">
          <div className="ilmora-discussion-video-wrap">
            <video src={discussionVideo} autoPlay loop muted playsInline preload="auto" />
          </div>
          <div className="ilmora-discussion-text">
            <h3>Learn Together,<br /><span>Grow Together</span></h3>
            <p>
              Our programs are built around collaborative learning. You'll work with peers,
              get mentor feedback, and tackle real-world problems as a team — just like in
              a professional environment.
            </p>
            <div className="ilmora-discussion-pills">
              <span className="ilmora-dpill"><Users size={12} /> Peer Learning</span>
              <span className="ilmora-dpill"><GraduationCap size={12} /> Mentor Guidance</span>
              <span className="ilmora-dpill"><Star size={12} /> Real Projects</span>
              <span className="ilmora-dpill"><Briefcase size={12} /> Job Ready</span>
            </div>
          </div>
        </div>
        <div className="ilmora-why-grid">
          {cards.map((c) => {
            const CardIcon = c.Icon;
            return (
              <article key={c.title} className="ilmora-why-card">
                <div className="ilmora-why-icon"><CardIcon size={22} /></div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════
//  TOAST CONTAINER
// ═══════════════════════════════════════════════
function ToastContainer({ toasts }) {
  return (
    <div className="ilmora-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="ilmora-toast">
          <span className="ilmora-toast-dot" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MAIN EXPORT
//  ✅ Custom Navbar/Footer removed. This page is now rendered
//  INSIDE PublicLayout, so it gets the exact same
//  AnnouncementBanner → Navbar → ... → Footer shell (and identical
//  alignment) as the Careers page and every other public page.
//  Pass these props from your route the same way you already do
//  for Careers, e.g.:
//    <Route path="/platforms" element={
//      <Platforms theme={theme} toggleTheme={toggleTheme}
//                 setShowLoginModal={setShowLoginModal}
//                 scrollToSection={scrollToSection} />
//    } />
// ═══════════════════════════════════════════════
export default function Platforms({ theme, toggleTheme, setShowLoginModal, scrollToSection }) {
  useInjectStyles();

  // Dark mode now follows the shared site-wide theme instead of a
  // page-local toggle (that toggle lived in the removed navbar).
  const darkMode = theme === "dark";

  const [activePlatformId, setActivePlatformId] = useState("dev");
  const [activeFilter, setActiveFilter]       = useState("all");
  const [searchQuery, setSearchQuery]         = useState("");
  const [modalProgram, setModalProgram]       = useState(null);
  const [modalPlatform, setModalPlatform]     = useState(null);
  const [savedInterests, setSavedInterests]   = useState(new Set());
  const [fading, setFading]                   = useState(false);
  const { toasts, showToast }                 = useToasts();
  const platformsSectionRef                   = useRef(null);

  // Reset scroll on mount (fixes back-nav scroll position)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const activePlatform = platformData.find((p) => p.id === activePlatformId);

  const filteredPrograms = (() => {
    let programs = activePlatform.programs;
    if (activeFilter === "popular")
      programs = programs.filter((p) => p.popular);
    else if (activeFilter === "beginner")
      programs = programs.filter((p) => p.beginnerFriendly);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      programs = programs.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tools.some((t) => t.toLowerCase().includes(q)) ||
          p.syllabus.some((s) => s.toLowerCase().includes(q)) ||
          p.careerOutcome.toLowerCase().includes(q) ||
          p.whoIsFor.toLowerCase().includes(q)
      );
    }
    return programs;
  })();

  const handleSetPlatform = (id) => {
    if (id === activePlatformId) return;
    setFading(true);
    setTimeout(() => {
      setActivePlatformId(id);
      setActiveFilter("all");
      setSearchQuery("");
      setFading(false);
      showToast(`${platformData.find((p) => p.id === id).name} selected`);
    }, 160);
  };

  const handleSetFilter = (f) => {
    setFading(true);
    setTimeout(() => { setActiveFilter(f); setFading(false); }, 160);
  };

  const handleSaveInterest = (progId, progName) => {
    if (savedInterests.has(progId)) {
      showToast(`Already saved: ${progName}`);
      return;
    }
    setSavedInterests((prev) => new Set([...prev, progId]));
    showToast(`Interest saved for ${progName}`);
  };

  const openModal = (progId) => {
    const result = findProgramById(progId);
    if (!result) return;
    setModalProgram(result.program);
    setModalPlatform(result.platform);
  };

  const closeModal = () => {
    setModalProgram(null);
    setModalPlatform(null);
  };

  const scrollToPlatforms = () =>
    platformsSectionRef.current?.scrollIntoView({ behavior: "smooth" });

  const ActivePlatformIcon = activePlatform.Icon;

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
      <div className="ilm-plat" data-theme={darkMode ? "dark" : undefined}>
        <Hero onExplore={scrollToPlatforms} />

        <section id="platforms" className="ilmora-platforms-section" ref={platformsSectionRef}>
          <div className="ilmora-section-wrap">
            <div className="ilmora-section-header">
              <div className="ilmora-section-tag">
                <BookOpen size={12} /> All Platforms
              </div>
              <h2>Choose Your Learning Platform</h2>
              <p>Select a platform to explore its programs and structured learning paths.</p>
            </div>

            <BannerWithTabs
              platforms={platformData}
              activePlatformId={activePlatformId}
              onSelect={handleSetPlatform}
            />

            <div className="ilmora-programs-panel">
              <div className="ilmora-panel-top">
                <div className="ilmora-panel-title-row">
                  <div className="ilmora-panel-icon-name">
                    <div className="ilmora-panel-icon">
                      <ActivePlatformIcon size={22} />
                    </div>
                    <div className="ilmora-panel-title">{activePlatform.name}</div>
                  </div>
                  <div className="ilmora-panel-badge">
                    {activePlatform.programs.length} Programs
                  </div>
                </div>
                <div className="ilmora-panel-desc">{activePlatform.description}</div>
                <div className="ilmora-panel-controls">
                  <div className="ilmora-panel-search-wrap">
                    <span className="ilmora-search-icon"><Search size={15} /></span>
                    <input
                      className="ilmora-panel-search"
                      type="text"
                      placeholder="Search programs, tools, topics…"
                      autoComplete="off"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="ilmora-filter-btns">
                    {["all", "popular", "beginner"].map((f) => (
                      <button
                        key={f}
                        className={`ilmora-filter-btn ${activeFilter === f ? "active" : ""}`}
                        onClick={() => handleSetFilter(f)}
                      >
                        {f === "all" ? "All" : f === "popular" ? "Popular" : "Beginner Friendly"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`ilmora-programs-grid ${fading ? "fading" : ""}`}>
                {filteredPrograms.length === 0 ? (
                  <div className="ilmora-empty-state">
                    <div className="empty-icon"><Search size={48} /></div>
                    <h3>No programs found</h3>
                    <p>Try another keyword.</p>
                  </div>
                ) : (
                  filteredPrograms.map((prog) => (
                    <ProgramCard
                      key={prog.id}
                      prog={prog}
                      savedInterests={savedInterests}
                      onSyllabus={openModal}
                      onSave={handleSaveInterest}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <WhyChoose />

        <SyllabusModal
          prog={modalProgram}
          platform={modalPlatform}
          savedInterests={savedInterests}
          onClose={closeModal}
          onSave={handleSaveInterest}
        />

        <ToastContainer toasts={toasts} />
      </div>
    </PublicLayout>
  );
}