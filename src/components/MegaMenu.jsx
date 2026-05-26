import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown, ChevronRight, X, Target, Palette, TrendingUp,
  BarChart2, Bot, Zap, FlaskConical, BookOpen, Brush, Award,
  BookMarked, GraduationCap, Microscope, Calculator, Code2,
  Database, Cloud, Brain, Server, Shield, MessageSquare, Mic,
  Briefcase, Building2, FileText, ClipboardList, Flag, BarChart,
  Search, LineChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  {
    id: "courses",
    label: "Courses",
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
      { name: "Full Stack Dev",   desc: "Frontend + Backend",    Icon: Code2,    route: "/platforms" },
      { name: "Data Engineering", desc: "Big data pipelines",    Icon: Database, route: "/platforms" },
      { name: "Cloud & DevOps",   desc: "Cloud infrastructure",  Icon: Cloud,    route: "/platforms" },
      { name: "AI Engineer",      desc: "ML & AI systems",       Icon: Brain,    route: "/platforms" },
      { name: "Backend Java",     desc: "Enterprise backend",    Icon: Server,   route: "/platforms" },
      { name: "Cyber Security",   desc: "Security fundamentals", Icon: Shield,   route: "/platforms" },
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
];

export default function MegaMenu({ onItemClick }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") setIsOpen(false); };
    if (isOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen]);

  useEffect(() => {
    const onOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [isOpen]);

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

  const COURSE_GROUPS = [
    { key: "product", label: "Product",  Icon: Target     },
    { key: "design",  label: "Design",   Icon: Palette    },
    { key: "growth",  label: "Growth",   Icon: TrendingUp },
  ];

  return (
    <>
      <div
        ref={menuRef}
        className="mm-root"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* TRIGGER */}
        <button
          className="mm-trigger"
          onClick={() => setIsOpen((p) => !p)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          All Courses
          <ChevronDown size={16} className={`mm-chevron ${isOpen ? "mm-chevron--open" : ""}`} />
        </button>

        {/* DROPDOWN */}
        {isOpen && (
          <div className={`mm-dropdown ${isMobile ? "mm-dropdown--mobile" : ""}`}>

            {/* MOBILE */}
            {isMobile ? (
              <div className="mm-mobile-wrap">
                <div className="mm-mobile-header">
                  <span className="mm-mobile-title">All Courses</span>
                  <button className="mm-mobile-close" onClick={() => setIsOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
                {CATEGORIES.map((cat) => {
                  const CatIcon = cat.Icon;
                  return (
                    <div key={cat.id} className="mm-mobile-section">
                      <button
                        className="mm-mobile-cat-btn"
                        onClick={() =>
                          setActiveCategory(activeCategory === cat.id ? null : cat.id)
                        }
                      >
                        <span className="mm-mobile-cat-left">
                          <span className="mm-mobile-cat-icon"><CatIcon size={18} /></span>
                          <span className="mm-mobile-cat-label">{cat.label}</span>
                        </span>
                        <ChevronRight
                          size={15}
                          style={{
                            transform: activeCategory === cat.id ? "rotate(90deg)" : "none",
                            transition: "transform 0.2s",
                            color: "#94a3b8",
                          }}
                        />
                      </button>
                      {activeCategory === cat.id && (
                        <div className="mm-mobile-items">
                          {cat.id === "courses"
                            ? COURSE_GROUPS.map(({ key, label, Icon: GIcon }) => {
                                const groupItems = cat.items.filter((i) => i.tab === key);
                                if (!groupItems.length) return null;
                                return (
                                  <div key={key}>
                                    <div className="mm-mobile-group-label">
                                      <GIcon size={10} /> {label}
                                    </div>
                                    {groupItems.map((item) => {
                                      const ItemIcon = item.Icon;
                                      return (
                                        <button
                                          key={item.name}
                                          className="mm-mobile-item"
                                          onClick={() => handleItemClick(item)}
                                        >
                                          <span className="mm-mobile-item-icon"><ItemIcon size={17} /></span>
                                          <div>
                                            <div className="mm-mobile-item-name">{item.name}</div>
                                            <div className="mm-mobile-item-desc">{item.desc}</div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              })
                            : cat.items.map((item) => {
                                const ItemIcon = item.Icon;
                                return (
                                  <button
                                    key={item.name}
                                    className="mm-mobile-item"
                                    onClick={() => handleItemClick(item)}
                                  >
                                    <span className="mm-mobile-item-icon"><ItemIcon size={17} /></span>
                                    <div>
                                      <div className="mm-mobile-item-name">{item.name}</div>
                                      <div className="mm-mobile-item-desc">{item.desc}</div>
                                    </div>
                                  </button>
                                );
                              })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            ) : (
              /* DESKTOP */
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
                        {isActive && (
                          <span className="mm-left-active-dot" />
                        )}
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
                        <h3 className="mm-right-heading">
                          Explore {activeCat.label}
                        </h3>
                        <p className="mm-right-sub">{activeCat.description}</p>
                      </>
                    )}
                  </div>

                  {/* Courses: grouped by tab */}
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
                  ) : (
                    /* Other categories: flat grid */
                    <div className="mm-right-grid mm-right-grid--flat">
                      {activeCat?.items.map((item) => {
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
                  )}

                  {/* Footer CTA strip matching ILM ORA style */}
                  <div className="mm-right-footer">
                    <span className="mm-footer-text">Not sure where to start?</span>
                    <button className="mm-footer-cta">Explore All Programs →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && isMobile && (
        <div className="mm-overlay" onClick={() => setIsOpen(false)} />
      )}

      <style>{`
        /* ─── Fonts matching ILM ORA site ─── */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mm-root {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ─── Trigger ─── */
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

        /* ─── Dropdown shell ─── */
        .mm-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          z-index: 1000;
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

        /* ─── Desktop layout ─── */
        .mm-desktop { display: flex; height: 490px; }

        /* LEFT PANEL */
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
          font-family: 'Plus Jakarta Sans', sans-serif;
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
          position: relative;
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
          font-family: 'Plus Jakarta Sans', sans-serif;
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
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mm-left-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          flex-shrink: 0;
        }

        /* RIGHT PANEL */
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

        /* Right Header — ILM ORA hero-style */
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
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mm-right-note {
          font-size: 10.5px;
          color: #9ca3af;
          font-style: italic;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mm-right-heading {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin: 0 0 3px;
          line-height: 1.2;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        /* ILM ORA style: last word in orange */
        .mm-right-sub {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Course tab groups */
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

        /* Items grid */
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
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em;
        }
        .mm-item-desc {
          font-size: 10.5px;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mm-item-arrow {
          color: #d1d5db;
          opacity: 0;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        /* Footer strip — matches ILM ORA CTA style */
        .mm-right-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding: 12px 0 14px;
          border-top: 1px solid #f3f4f6;
          margin-top: 14px;
        }
        .mm-footer-text {
          font-size: 12px;
          color: #6b7280;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
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
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s ease;
          letter-spacing: -0.01em;
        }
        .mm-footer-cta:hover {
          background: #ea6c0a;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(249,115,22,0.35);
        }

        /* ─── Mobile ─── */
        .mm-dropdown--mobile {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          min-width: unset;
          border-radius: 0 0 20px 20px;
          max-height: 75vh;
          overflow-y: auto;
        }
        .mm-mobile-wrap { padding: 0; }
        .mm-mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid #f3f4f6;
        }
        .mm-mobile-title {
          font-size: 15px;
          font-weight: 800;
          color: #1a1a2e;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mm-mobile-close {
          border: none;
          background: #f5f5f5;
          border-radius: 8px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
        }
        .mm-mobile-section { border-bottom: 1px solid #f9fafb; }
        .mm-mobile-cat-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 18px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }
        .mm-mobile-cat-left { display: flex; align-items: center; gap: 10px; }
        .mm-mobile-cat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #fff5ee;
          color: #f97316;
          flex-shrink: 0;
          border: 1px solid rgba(249,115,22,0.12);
        }
        .mm-mobile-cat-label {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a2e;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mm-mobile-items {
          padding: 8px 14px 12px;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mm-mobile-group-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 9.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #f97316;
          background: #fff5ee;
          border: 1px solid rgba(249,115,22,0.15);
          padding: 2px 9px;
          border-radius: 100px;
          margin: 6px 0 4px;
          width: fit-content;
        }
        .mm-mobile-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          border: none;
          background: #ffffff;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
          border: 1px solid #f3f4f6;
        }
        .mm-mobile-item:hover { background: #fff7ed; border-color: rgba(249,115,22,0.2); }
        .mm-mobile-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #fff5ee;
          color: #f97316;
          flex-shrink: 0;
        }
        .mm-mobile-item-name {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a2e;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .mm-mobile-item-desc {
          font-size: 11px;
          color: #9ca3af;
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin-top: 1px;
        }

        .mm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 999;
          backdrop-filter: blur(2px);
        }
      `}</style>
    </>
  );
}