
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown, ChevronRight, X, Target, Palette, TrendingUp,
  BarChart2, BarChart3, Bot, Zap, FlaskConical, BookOpen, Brush, Award,
  BookMarked, GraduationCap, Microscope, Calculator, Code2,
  Database, Cloud, Brain, Server, Shield, MessageSquare, Mic,
  Briefcase, Building2, FileText, ClipboardList, Flag, BarChart,
  Search, LineChart, ArrowLeft, Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CATEGORIES = [
  {
    id: "courses",
    label: "All Courses",
    description: "PM, Design, Growth, AI",
    Icon: Target,
    items: [
      { name: "Product Management",    desc: "Master PM fundamentals",         Icon: Target,      route: "/", tab: "product" },
      { name: "Product Analytics",     desc: "Data-driven decisions",          Icon: BarChart,    route: "/", tab: "product" },
      { name: "Product Strategy",      desc: "Strategy & positioning",         Icon: LineChart,   route: "/", tab: "product" },
      { name: "Data Analytics",        desc: "Analytics & BI tools",           Icon: BarChart2,   route: "/", tab: "product" },
      { name: "Gen AI",                desc: "Generative AI essentials",       Icon: Bot,         route: "/", tab: "product" },
      { name: "UI/UX Design",          desc: "Design beautiful interfaces",    Icon: Palette,     route: "/", tab: "design"  },
      { name: "Design Systems",        desc: "Scalable component libraries",   Icon: Brush,       route: "/", tab: "design"  },
      { name: "User Research",         desc: "Interviews & usability testing", Icon: Search,      route: "/", tab: "design"  },
      { name: "Growth Marketing",      desc: "Growth loops & strategies",      Icon: TrendingUp,  route: "/", tab: "growth"  },
      { name: "SEO & Content",         desc: "Organic growth at scale",        Icon: FileText,    route: "/", tab: "growth"  },
      { name: "Performance Marketing", desc: "Paid ads at scale",              Icon: Zap,         route: "/", tab: "growth"  },
    ],
  },
  {
    id: "school-boards",
    label: "School Boards",
    description: "CBSE, Bihar, ICSE, UP Board",
    Icon: GraduationCap,
    items: [
      { name: "CBSE Science",  desc: "Class 9–12 Science stream",   Icon: FlaskConical, route: "/school-class" },
      { name: "CBSE Commerce", desc: "Class 11–12 Commerce stream", Icon: BarChart2,    route: "/school-class" },
      { name: "CBSE Arts",     desc: "Class 11–12 Arts stream",     Icon: Brush,        route: "/school-class" },
      { name: "ICSE",          desc: "CISCE Board – Class 9–12",    Icon: Award,        route: "/school-class" },
      { name: "UP Board",      desc: "UPMSP – Class 9–12",          Icon: BookMarked,   route: "/school-class" },
      { name: "Bihar Board",   desc: "BSEB – Class 9–12",           Icon: BookOpen,     route: "/school-class" },
    ],
  },
  {
    id: "competitive",
    label: "Competitive Exams",
    description: "JEE, NEET",
    Icon: Award,
    items: [
      { name: "IIT JEE", desc: "Engineering entrance", Icon: Calculator, route: "/school-class" },
      { name: "NEET",    desc: "Medical entrance",     Icon: Microscope, route: "/school-class" },
    ],
  },
  {
    id: "career-tracks",
    label: "Career Tracks",
    description: "Full Stack, AI, DevOps",
    Icon: Code2,
    items: [
      { name: "Full Stack Dev",                desc: "Frontend + Backend",    Icon: Code2,     route: "/platforms" },
      { name: "Data Engineering",              desc: "Big data pipelines",    Icon: Database,  route: "/platforms" },
      { name: "Cloud & DevOps",                desc: "Cloud infrastructure",  Icon: Cloud,     route: "/platforms" },
      { name: "AI Engineer",                   desc: "ML & AI systems",       Icon: Brain,     route: "/platforms" },
      { name: "Backend Java",                  desc: "Enterprise backend",    Icon: Server,    route: "/platforms" },
      { name: "Cyber Security",                desc: "Security fundamentals", Icon: Shield,    route: "/platforms" },
      { name: "Forward Deployed Engineering",  desc: "Applied AI, FDE",       Icon: Briefcase, route: "/fde-academy" },
    ],
  },
  {
    id: "ilm-ora-talk",
    label: "ILM ORA Talk",
    description: "English, Public Speaking",
    Icon: Mic,
    items: [
      { name: "Spoken English",          desc: "English fluency basics",  Icon: MessageSquare, route: "/ilm-ora-talk" },
      { name: "Public Speaking",         desc: "Confidence & delivery",   Icon: Mic,           route: "/ilm-ora-talk" },
      { name: "Interview Communication", desc: "Crack interviews",        Icon: Briefcase,     route: "/ilm-ora-talk" },
      { name: "Corporate Communication", desc: "Professional skills",     Icon: Building2,     route: "/ilm-ora-talk" },
      { name: "Presentation Skills",     desc: "Effective presentations", Icon: Target,        route: "/ilm-ora-talk" },
    ],
  },
  {
    id: "study-abroad",
    label: "Study Abroad",
    description: "IELTS, TOEFL, UK, USA",
    Icon: Flag,
    items: [
      { name: "IELTS Preparation", desc: "IELTS exam prep",  Icon: FileText,      route: "/study-abroad" },
      { name: "TOEFL Preparation", desc: "TOEFL exam prep",  Icon: ClipboardList, route: "/study-abroad" },
      { name: "Study in UK",       desc: "UK universities",  Icon: Flag,          route: "/study-abroad" },
      { name: "Study in Canada",   desc: "Canada programs",  Icon: Flag,          route: "/study-abroad" },
      { name: "Study in USA",      desc: "US universities",  Icon: Flag,          route: "/study-abroad" },
      { name: "Study in Germany",  desc: "Germany programs", Icon: Flag,          route: "/study-abroad" },
    ],
  },
  {
    id: "ilm-ora-gulf",
    label: "ILM ORA Gulf",
    description: "UAE, Oman, Kuwait, Qatar & more",
    Icon: Flag,
    isGulf: true,
    items: [
      { name: "Oman",         flagCode: "om", route: "/ilm-ora-gulf" },
      { name: "UAE",          flagCode: "ae", route: "/ilm-ora-gulf" },
      { name: "Malaysia",     flagCode: "my", route: "/ilm-ora-gulf" },
      { name: "Kuwait",       flagCode: "kw", route: "/ilm-ora-gulf" },
      { name: "Qatar",        flagCode: "qa", route: "/ilm-ora-gulf" },
      { name: "Saudi Arabia", flagCode: "sa", route: "/ilm-ora-gulf" },
      { name: "Bahrain",      flagCode: "bh", route: "/ilm-ora-gulf" },
      { name: "Uganda",       flagCode: "ug", route: "/ilm-ora-gulf" },
      { name: "Nigeria",      flagCode: "ng", route: "/ilm-ora-gulf" },
      { name: "Tanzania",     flagCode: "tz", route: "/ilm-ora-gulf" },
      { name: "Singapore",    flagCode: "sg", route: "/ilm-ora-gulf" },
    ],
  },
  {
    id: "ilm-ora-feature",
    label: "ILM ORA Feature",
    description: "Student, Trainer & Manager Hubs",
    Icon: GraduationCap,
    items: [
      {
        name: "Student Hub",
        desc: "AI-Powered Learning & Career Growth",
        Icon: GraduationCap,
        route: "/student-hub",
      },
      {
        name: "Trainer Hub",
        desc: "Training Management & Mentorship",
        Icon: Users,
        route: "/trainer-hub",
      },
      {
        name: "Manager Hub",
        desc: "Analytics, Performance & Team Development ",
        Icon: BarChart3,
        route: "/manager-hub",
      },
    ],
  },
];

const COURSE_GROUPS = [
  { key: "product", label: "Product",  Icon: Target     },
  { key: "design",  label: "Design",   Icon: Palette    },
  { key: "growth",  label: "Growth",   Icon: TrendingUp },
];

/* ─────────────────────────────────────────────────────────────────
   MOBILE FULL-SCREEN NAVIGATION
   Only rendered when windowWidth < 1024  (matches LMSHomepage lg breakpoint)
───────────────────────────────────────────── */
function MobileFullScreenNav({ onItemClick, onClose }) {
  const [view, setView] = useState("main"); // "main" | "category"
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setView("category");
  };

  const handleBack = () => {
    setView("main");
    setSelectedCategory(null);
  };

  const handleItemClick = (item) => {
    if (item.route && item.route !== "#") {
      onItemClick(item);
    }
    onClose();
  };

  /* ── SCREEN 1: Main menu ── */
  if (view === "main") {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#ffffff",
        zIndex: 99999,
        overflowY: "auto",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          borderBottom: "1px solid #f3f4f6",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em" }}>
            Explore
          </span>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f5f5f5",
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b7280",
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "8px 0 32px" }}>
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.Icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  border: "none",
                  borderBottom: "1px solid #f9fafb",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "#fff5ee",
                    color: "#f97316",
                    border: "1px solid rgba(249,115,22,0.15)",
                    flexShrink: 0,
                  }}>
                    <CatIcon size={18} />
                  </span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                      {cat.description}
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: "#d1d5db", flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── SCREEN 2: Category items ── */
  if (view === "category" && selectedCategory) {
    const cat = selectedCategory;

    return (
      <div style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#ffffff",
        zIndex: 99999,
        overflowY: "auto",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid #f3f4f6",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}>
          <button
            onClick={handleBack}
            style={{
              border: "none",
              background: "#f5f5f5",
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b7280",
              flexShrink: 0,
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em" }}>
              {cat.label}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
              {cat.description}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f5f5f5",
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b7280",
              flexShrink: 0,
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: "8px 0 32px" }}>
          {cat.id === "courses" ? (
            /* Courses: grouped by Product / Design / Growth */
            COURSE_GROUPS.map(({ key, label, Icon: GIcon }) => {
              const groupItems = cat.items.filter((i) => i.tab === key);
              if (!groupItems.length) return null;
              return (
                <div key={key}>
                  {/* Group label */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "14px 20px 8px",
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "#f97316",
                  }}>
                    <GIcon size={12} />
                    {label}
                  </div>
                  {groupItems.map((item) => {
                    const ItemIcon = item.Icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleItemClick(item)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 20px",
                          border: "none",
                          borderBottom: "1px solid #f9fafb",
                          background: "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: 11,
                          background: "#fff5ee",
                          color: "#f97316",
                          border: "1px solid rgba(249,115,22,0.12)",
                          flexShrink: 0,
                        }}>
                          <ItemIcon size={17} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                            {item.desc}
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: "#d1d5db", flexShrink: 0 }} />
                      </button>
                    );
                  })}
                </div>
              );
            })
          ) : cat.isGulf ? (
            /* Gulf: flag + country name */
            cat.items.map((item) => (
              <button
                key={item.name}
                onClick={() => handleItemClick(item)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  border: "none",
                  borderBottom: "1px solid #f9fafb",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{
                  width: 44,
                  height: 30,
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid #e8e8e8",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f0f0f0",
                }}>
                  <img
                    src={`https://flagcdn.com/w40/${item.flagCode}.png`}
                    alt={item.name}
                    width="44"
                    height="30"
                    style={{ objectFit: "cover", display: "block" }}
                  />
                </span>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", flex: 1 }}>
                  {item.name}
                </div>
                <ChevronRight size={16} style={{ color: "#d1d5db", flexShrink: 0 }} />
              </button>
            ))
          ) : (
            /* All other categories (including ilm-ora-feature) */
            cat.items.map((item) => {
              const ItemIcon = item.Icon;
              return (
                <button
                  key={item.name}
                  onClick={() => !item.comingSoon && handleItemClick(item)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 20px",
                    border: "none",
                    borderBottom: "1px solid #f9fafb",
                    background: "transparent",
                    cursor: item.comingSoon ? "default" : "pointer",
                    textAlign: "left",
                    opacity: item.comingSoon ? 0.65 : 1,
                  }}
                >
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: "#fff5ee",
                    color: "#f97316",
                    border: "1px solid rgba(249,115,22,0.12)",
                    flexShrink: 0,
                  }}>
                    <ItemIcon size={17} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 6 }}>
                      {item.name}
                      {item.comingSoon && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#f97316", background: "#fff5ee", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 100, padding: "1px 7px" }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>
                  {!item.comingSoon && <ChevronRight size={16} style={{ color: "#d1d5db", flexShrink: 0 }} />}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────
   MAIN MEGA MENU COMPONENT
───────────────────────────────────────────── */
export default function MegaMenu({ onItemClick }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ─────────────────────────────────────────────────────────────────
     KEY CHANGE: threshold is now 1024 (matches `lg` in LMSHomepage).
     - windowWidth < 1024  → mobile full-screen nav (hamburger visible)
     - windowWidth >= 1024 → desktop dropdown (full navbar visible)
  ───────────────────────────────────────────────────────────────── */
  const isMobile = windowWidth < 1024;

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") setIsOpen(false); };
    if (isOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen]);

  useEffect(() => {
    if (!isMobile) {
      const onOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
      };
      if (isOpen) document.addEventListener("mousedown", onOutside);
      return () => document.removeEventListener("mousedown", onOutside);
    }
  }, [isOpen, isMobile]);

  const handleMouseEnter = () => {
    if (!isMobile) { clearTimeout(timeoutRef.current); setIsOpen(true); }
  };
  const handleMouseLeave = () => {
    if (!isMobile) { timeoutRef.current = setTimeout(() => setIsOpen(false), 180); }
  };

  const handleItemClick = (item) => {
    if (onItemClick) onItemClick(item);
    setIsOpen(false);

    if (item.tab) {
      window.dispatchEvent(new CustomEvent("mm-course-tab", { detail: { tab: item.tab } }));
      if (window.location.pathname === "/") {
        setTimeout(() => {
          const el = document.getElementById("courses");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      } else {
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("mm-course-tab", { detail: { tab: item.tab } }));
          const el = document.getElementById("courses");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400);
      }
    } else {
      navigate(item.route);
    }
  };

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  /* ─── DESKTOP TWO-PANEL (>= 1024px only) ─── */
  const renderDesktopMenu = () => (
    <div className="mm-desktop">
      {/* Left panel */}
      <div className="mm-left">
        <div className="mm-left-header">Browse Categories</div>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const CatIcon = cat.Icon;
          return (
            <button
              key={cat.id}
              className={`mm-left-item ${isActive ? "mm-left-item--active" : ""}`}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onClick={() => setActiveCategory(cat.id)}
            >
              <div className="mm-left-item-inner">
                <span className="mm-left-icon"><CatIcon size={17} /></span>
                <div className="mm-left-text">
                  <span className="mm-left-label">{cat.label}</span>
                  <span className="mm-left-desc">{cat.description}</span>
                </div>
              </div>
              {isActive && <span className="mm-left-active-dot" />}
            </button>
          );
        })}
      </div>

      {/* Right panel */}
      <div className="mm-right">
        <div className="mm-right-header">
          {activeCat && (
            <>
              <div className="mm-right-header-top">
                <span className="mm-right-badge">
                  <activeCat.Icon size={13} />
                  {activeCat.label}
                </span>
                {activeCat.id === "courses" && (
                  <span className="mm-right-note">↗ Opens on homepage</span>
                )}
              </div>
              <h3 className="mm-right-heading">Explore {activeCat.label}</h3>
              <p className="mm-right-sub">{activeCat.description}</p>
            </>
          )}
        </div>

        {activeCat?.id === "courses" ? (
          <div className="mm-course-tabs">
            {COURSE_GROUPS.map(({ key, label, Icon: GIcon }) => {
              const items = activeCat.items.filter((i) => i.tab === key);
              if (!items.length) return null;
              return (
                <div key={key} className="mm-course-group">
                  <div className="mm-course-group-label">
                    <GIcon size={11} />
                    {label}
                  </div>
                  <div className="mm-right-grid">
                    {items.map((item) => {
                      const ItemIcon = item.Icon;
                      return (
                        <button
                          key={item.name}
                          className="mm-item-card"
                          onClick={() => handleItemClick(item)}
                        >
                          <span className="mm-item-icon-wrap"><ItemIcon size={17} /></span>
                          <div className="mm-item-body">
                            <span className="mm-item-name">{item.name}</span>
                            <span className="mm-item-desc">{item.desc}</span>
                          </div>
                          <ChevronRight size={13} className="mm-item-arrow" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeCat?.isGulf ? (
          <div className="mm-right-grid mm-right-grid--flat">
            {activeCat.items.map((item) => (
              <button
                key={item.name}
                className="mm-item-card mm-gulf-card"
                onClick={() => handleItemClick(item)}
              >
                <span className="mm-gulf-flag">
                  <img
                    src={`https://flagcdn.com/w40/${item.flagCode}.png`}
                    alt={item.name}
                    width="36"
                    height="24"
                    style={{ borderRadius: "4px", objectFit: "cover", display: "block" }}
                  />
                </span>
                <div className="mm-item-body">
                  <span className="mm-item-name">{item.name}</span>
                </div>
                <ChevronRight size={13} className="mm-item-arrow" />
              </button>
            ))}
          </div>
        ) : (
          <div className="mm-right-grid mm-right-grid--flat">
            {activeCat?.items.map((item) => {
              const ItemIcon = item.Icon;
              return (
                <button
                  key={item.name}
                  className={`mm-item-card ${item.comingSoon ? "mm-item-card--disabled" : ""}`}
                  onClick={() => !item.comingSoon && handleItemClick(item)}
                  style={item.comingSoon ? { opacity: 0.65, cursor: "default" } : {}}
                >
                  <span className="mm-item-icon-wrap"><ItemIcon size={17} /></span>
                  <div className="mm-item-body">
                    <span className="mm-item-name" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {item.name}
                      {item.comingSoon && (
                        <span style={{ fontSize: 9, fontWeight: 600, color: "#f97316", background: "#fff5ee", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 100, padding: "1px 6px", whiteSpace: "nowrap" }}>
                          Soon
                        </span>
                      )}
                    </span>
                    <span className="mm-item-desc">{item.desc}</span>
                  </div>
                  {!item.comingSoon && <ChevronRight size={13} className="mm-item-arrow" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="mm-right-footer">
          <span className="mm-footer-text">Not sure where to start?</span>
          <button className="mm-footer-cta">Explore All Programs →</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mm-root {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mm-trigger {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 9px 16px !important;
          border-radius: 10px !important;
          border: none !important;
          background: transparent !important;
          font-family: 'Plus Jakarta Sans', inherit !important;
          font-size: 14.5px !important;
          font-weight: 600 !important;
          color: #1a1a2e !important;
          cursor: pointer !important;
          transition: all 0.18s ease !important;
          white-space: nowrap !important;
          letter-spacing: -0.01em !important;
        }
        .mm-trigger:hover {
          background: rgba(249,115,22,0.06) !important;
          color: #f97316 !important;
        }
        .mm-chevron {
          transition: transform 0.25s cubic-bezier(.4,0,.2,1);
          flex-shrink: 0;
          color: currentColor;
        }
        .mm-chevron--open { transform: rotate(180deg); }

        /* Desktop dropdown shell — only shown >= 1024px */
        .mm-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          z-index: 9999;
          background: #ffffff;
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 20px;
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.04),
            0 24px 48px -8px rgba(0,0,0,0.14),
            0 0 0 1px rgba(255,255,255,0.6) inset;
          overflow: hidden;
          animation: mmIn 0.2s cubic-bezier(.16,1,.3,1);
          min-width: 860px;
        }
        @keyframes mmIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Desktop layout ── */
        .mm-desktop { display: flex; height: 490px; }

        .mm-left {
          width: 248px;
          flex-shrink: 0;
          background: #fafafa;
          border-right: 1px solid #f0f0f0;
          overflow-y: auto;
          padding: 16px 0 12px;
          scrollbar-width: none;
        }
        .mm-left::-webkit-scrollbar { display: none; }

        .mm-left-header {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a0aec0;
          padding: 0 16px 10px;
        }

        .mm-left-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 14px 10px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .mm-left-item:hover { background: #f5f5f5; }
        .mm-left-item--active {
          background: #fff;
          box-shadow: inset 3px 0 0 #f97316;
        }
        .mm-left-item-inner { display: flex; align-items: center; gap: 11px; min-width: 0; flex: 1; }

        .mm-left-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #fff5ee;
          color: #f97316;
          flex-shrink: 0;
          border: 1px solid rgba(249,115,22,0.12);
          transition: all 0.15s;
        }
        .mm-left-item--active .mm-left-icon {
          background: #f97316;
          color: #fff;
          border-color: #f97316;
          box-shadow: 0 4px 12px rgba(249,115,22,0.35);
        }

        .mm-left-text { display: flex; flex-direction: column; min-width: 0; }
        .mm-left-label {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a2e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.15s;
        }
        .mm-left-item--active .mm-left-label { color: #f97316; }
        .mm-left-desc {
          font-size: 10.5px;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }
        .mm-left-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          flex-shrink: 0;
        }

        .mm-right {
          flex: 1;
          overflow-y: auto;
          padding: 20px 20px 0;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
          display: flex;
          flex-direction: column;
        }
        .mm-right::-webkit-scrollbar { width: 4px; }
        .mm-right::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .mm-right-header {
          margin-bottom: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        .mm-right-header-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .mm-right-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px 3px 8px;
          border-radius: 100px;
          background: #fff5ee;
          border: 1px solid rgba(249,115,22,0.2);
          color: #f97316;
          font-size: 11px;
          font-weight: 700;
        }
        .mm-right-note { font-size: 10.5px; color: #9ca3af; font-style: italic; }
        .mm-right-heading {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin: 0 0 3px;
          line-height: 1.2;
        }
        .mm-right-sub { font-size: 12px; color: #6b7280; margin: 0; }

        .mm-course-tabs { display: flex; flex-direction: column; gap: 14px; flex: 1; }
        .mm-course-group-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #f97316;
          background: #fff5ee;
          border: 1px solid rgba(249,115,22,0.15);
          padding: 3px 10px;
          border-radius: 100px;
          margin-bottom: 7px;
          width: fit-content;
        }

        .mm-right-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .mm-right-grid--flat { margin-top: 2px; }

        .mm-item-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #f3f4f6;
          background: #fafafa;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
          position: relative;
          overflow: hidden;
        }
        .mm-item-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(249,115,22,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.18s;
        }
        .mm-item-card:hover {
          background: #fff;
          border-color: rgba(249,115,22,0.25);
          box-shadow: 0 4px 16px rgba(249,115,22,0.1);
          transform: translateY(-1px);
        }
        .mm-item-card:hover::before { opacity: 1; }
        .mm-item-card:hover .mm-item-name { color: #f97316; }
        .mm-item-card:hover .mm-item-arrow { opacity: 1; transform: translateX(3px); color: #f97316; }
        .mm-item-card:hover .mm-item-icon-wrap {
          background: #f97316;
          color: #fff;
          box-shadow: 0 4px 10px rgba(249,115,22,0.3);
        }
        .mm-item-card--disabled:hover {
          transform: none;
          box-shadow: none;
          border-color: #f3f4f6;
          background: #fafafa;
        }
        .mm-item-card--disabled:hover::before { opacity: 0; }
        .mm-item-card--disabled:hover .mm-item-name { color: #1a1a2e; }
        .mm-item-card--disabled:hover .mm-item-icon-wrap { background: #fff5ee; color: #f97316; box-shadow: none; }

        .mm-item-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #fff5ee;
          color: #f97316;
          flex-shrink: 0;
          border: 1px solid rgba(249,115,22,0.1);
          transition: all 0.18s ease;
        }
        .mm-item-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .mm-item-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #1a1a2e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.15s;
          letter-spacing: -0.01em;
        }
        .mm-item-desc {
          font-size: 10.5px;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }
        .mm-item-arrow {
          color: #d1d5db;
          opacity: 0;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        .mm-right-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0 14px;
          border-top: 1px solid #f3f4f6;
          margin-top: 14px;
        }
        .mm-footer-text { font-size: 12px; color: #6b7280; }
        .mm-footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 100px;
          border: none;
          background: #f97316;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          letter-spacing: -0.01em;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mm-footer-cta:hover {
          background: #ea6c0a;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(249,115,22,0.35);
        }

        .mm-gulf-card { align-items: center; }
        .mm-gulf-flag {
          flex-shrink: 0;
          width: 44px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          overflow: hidden;
          background: #f0f0f0;
          border: 1px solid #e8e8e8;
        }
        .mm-gulf-flag img {
          width: 44px;
          height: 30px;
          object-fit: cover;
          display: block;
          border-radius: 4px;
        }
      `}</style>

      {/* ── Mobile full-screen nav (< 1024px) ── */}
      {isMobile && isOpen && (
        <MobileFullScreenNav
          onItemClick={handleItemClick}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* ── Desktop trigger + dropdown (>= 1024px) ── */}
      <div
        ref={menuRef}
        className="mm-root"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="mm-trigger"
          onClick={() => setIsOpen((p) => !p)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          All Courses
          <ChevronDown
            size={16}
            className={`mm-chevron ${isOpen ? "mm-chevron--open" : ""}`}
          />
        </button>

        {/* Desktop dropdown — only when >= 1024px */}
        {!isMobile && isOpen && (
          <div className="mm-dropdown">
            {renderDesktopMenu()}
          </div>
        )}
      </div>
    </>
  );
}