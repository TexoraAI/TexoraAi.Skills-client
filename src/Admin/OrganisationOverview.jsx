import {
    Activity,
    AlertCircle,
    ArrowRight,
    Building2,
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    GitBranch,
    Info,
    Layers,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Sparkles,
    Trash2,
    Users,
    X,
    BarChart3,
    TrendingUp,
    GripVertical,
  } from "lucide-react";
  import { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import ReactDOM from "react-dom";
  
  import {
    createBranch,
    createDepartment,
    deleteBatch,
    deleteBranch,
    deleteDepartment,
    getAllBatches,
    getBranches,
    getDepartments,
    updateBranch,
    updateDepartment,
    createBatch,
  } from "../services/batchService";
  import authService from "../services/authService";
  import userService from "../services/userService";
  
  /* ═══════════════════════════════════════════════════════════════════════════
     THEME
  ═══════════════════════════════════════════════════════════════════════════ */
  const T = {
    dark: {
      pageBg: "#0a0a0f",
      cardBg: "#13131a",
      cardBgHov: "#1a1a24",
      heroBg: "#13131a",
      border: "rgba(255,255,255,0.08)",
      borderHov: "rgba(255,255,255,0.18)",
      borderHero: "rgba(255,255,255,0.08)",
      text: "#f1f5f9",
      textSub: "rgba(255,255,255,0.55)",
      textMuted: "rgba(255,255,255,0.32)",
      pillBg: "rgba(255,255,255,0.06)",
      pillBorder: "rgba(255,255,255,0.1)",
      actBg: "rgba(255,255,255,0.06)",
      actBorder: "rgba(255,255,255,0.1)",
      shadow: "0 2px 12px rgba(0,0,0,0.4)",
      shadowHov: "0 16px 48px rgba(0,0,0,0.6)",
      emptyBorder: "rgba(255,255,255,0.1)",
      emptyBg: "rgba(255,255,255,0.03)",
      emptyIcon: "rgba(255,255,255,0.18)",
      inputBg: "rgba(255,255,255,0.06)",
      inputBorder: "rgba(255,255,255,0.12)",
      inputText: "#f1f5f9",
      skeletonBg: "rgba(255,255,255,0.08)",
      theadBg: "rgba(255,255,255,0.04)",
      rowHov: "rgba(255,255,255,0.04)",
      dropdownBg: "#1a1a24",
      dropdownItemHov: "rgba(255,255,255,0.08)",
      errorBg: "rgba(244,63,94,0.1)",
      errorBorder: "rgba(244,63,94,0.28)",
      bannerBg: "rgba(59,130,246,0.09)",
      bannerBorder: "rgba(59,130,246,0.22)",
      gridLine: "rgba(255,255,255,0.4)",
      handleBg: "rgba(255,255,255,0.10)",
      handleBgHov: "#3b82f6",
      panelBg: "#0f0f16",
    },
    light: {
      pageBg: "#f0f4f8",
      cardBg: "#ffffff",
      cardBgHov: "#fafbff",
      heroBg: "#ffffff",
      border: "#e2e8f0",
      borderHov: "#c7d2e0",
      borderHero: "#e2e8f0",
      text: "#0f172a",
      textSub: "#64748b",
      textMuted: "#94a3b8",
      pillBg: "#f1f5f9",
      pillBorder: "#e2e8f0",
      actBg: "#f8fafc",
      actBorder: "#e2e8f0",
      shadow: "0 1px 3px rgba(15,23,42,0.06), 0 6px 20px rgba(15,23,42,0.06)",
      shadowHov: "0 10px 32px rgba(15,23,42,0.12)",
      emptyBorder: "#e2e8f0",
      emptyBg: "#f8fafc",
      emptyIcon: "#cbd5e1",
      inputBg: "#ffffff",
      inputBorder: "#e2e8f0",
      inputText: "#0f172a",
      skeletonBg: "#edf2f7",
      theadBg: "#f8fafc",
      rowHov: "#f7f9fc",
      dropdownBg: "#ffffff",
      dropdownItemHov: "#f1f5f9",
      errorBg: "rgba(244,63,94,0.06)",
      errorBorder: "rgba(244,63,94,0.2)",
      bannerBg: "#eff6ff",
      bannerBorder: "#bfdbfe",
      gridLine: "rgba(15,23,42,0.08)",
      handleBg: "#e2e8f0",
      handleBgHov: "#3b82f6",
      panelBg: "#fbfcfe",
    },
  };
  
  /* ═══════════════════════════════════════════════════════════════════════════
     CONSTANTS
  ═══════════════════════════════════════════════════════════════════════════ */
  const GRAD_COLORS = [
    ["#a78bfa", "#7c3aed"],
    ["#22d3ee", "#0891b2"],
    ["#f43f5e", "#be123c"],
    ["#f59e0b", "#b45309"],
    ["#34d399", "#059669"],
    ["#818cf8", "#4338ca"],
  ];
  const gradColor = (name) =>
    GRAD_COLORS[(name?.charCodeAt(0) ?? 0) % GRAD_COLORS.length];
  
  const DEPARTMENT_OPTIONS = [
    "Engineering","Computer Science","Electronics & Communication",
    "Mechanical Engineering","Civil Engineering","Information Technology",
    "MBA","Business Administration","Finance & Accounting",
    "Human Resources","Marketing","Sales & Business Development",
    "Data Science & AI","Cybersecurity","Cloud Computing",
    "Product Management","Operations","Research & Development",
    "Legal & Compliance","Quality Assurance","Design & UX",
    "Content & Communications","Customer Support","Logistics & Supply Chain",
    "Healthcare Management","Biotechnology","Architecture",
    "Physics","Mathematics","Chemistry",
  ];
  
  const CITY_OPTIONS = [
    "Delhi","Mumbai","Kolkata","Chennai","Bangalore","Hyderabad","Pune",
    "Ahmedabad","Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore",
    "Bhopal","Patna","Ranchi","Raipur","Chandigarh","Noida","Gurgaon",
    "Faridabad","Ghaziabad","Meerut","Agra","Varanasi","Prayagraj",
    "Gwalior","Jabalpur","Udaipur","Jodhpur","Amritsar","Ludhiana",
    "Dehradun","Shimla","Srinagar","Jammu","Thiruvananthapuram","Kochi",
    "Coimbatore","Madurai","Mysore","Mangalore","Visakhapatnam","Vijayawada",
  ];
  
  const ROLE_CFG = {
    ROLE_ADMIN:   { label: "Admin",   color: "#f43f5e", bg: "rgba(244,63,94,0.12)"  },
    ROLE_TRAINER: { label: "Trainer", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
    ROLE_STUDENT: { label: "Student", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  };
  
  const ROLE_TO_AUTH_ROLE = { ROLE_STUDENT: "STUDENT", ROLE_TRAINER: "TRAINER" };
  
  const CATS = [
    { id:"departments", label:"Departments", singular:"Department", icon:Building2,
      color:"#3b82f6", grad:["#3b82f6","#2563eb"], soft:"#eff6ff", softDark:"rgba(59,130,246,0.18)" },
    { id:"branches",    label:"Branches",    singular:"Branch",     icon:GitBranch,
      color:"#10b981", grad:["#10b981","#059669"], soft:"#ecfdf5", softDark:"rgba(16,185,129,0.18)" },
    { id:"batches",     label:"Batches",     singular:"Batch",      icon:Layers,
      color:"#f59e0b", grad:["#f59e0b","#d97706"], soft:"#fffbeb", softDark:"rgba(245,158,11,0.18)" },
    { id:"users",       label:"Users",       singular:"User",       icon:Users,
      color:"#8b5cf6", grad:["#8b5cf6","#7c3aed"], soft:"#f5f3ff", softDark:"rgba(139,92,246,0.18)" },
  ];
  const catById = (id) => CATS.find((c) => c.id === id);
  const softBg  = (cat, isDark) => isDark ? cat.softDark : cat.soft;
  
  /* ═══════════════════════════════════════════════════════════════════════════
     HOOKS
  ═══════════════════════════════════════════════════════════════════════════ */
  function useDarkMode() {
    const [isDark, setIsDark] = useState(
      () =>
        typeof document !== "undefined" &&
        (document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"),
    );
    useEffect(() => {
      const obs = new MutationObserver(() =>
        setIsDark(
          document.documentElement.classList.contains("dark") ||
            document.documentElement.getAttribute("data-theme") === "dark",
        ),
      );
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class","data-theme"] });
      return () => obs.disconnect();
    }, []);
    return isDark;
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     GLOBAL CSS (injected once)
  ═══════════════════════════════════════════════════════════════════════════ */
  const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  
  @keyframes oo-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes oo-popIn   { from{opacity:0;transform:scale(0.97) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes oo-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes oo-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes oo-panelFadeIn { from{opacity:0; transform:translateX(8px);} to{opacity:1; transform:translateX(0);} }
  
  .oo-fade     { animation: oo-fadeUp  0.38s ease both; }
  .oo-pop      { animation: oo-popIn   0.18s ease both; }
  .oo-spin-cls { animation: oo-spin    0.9s linear infinite; }
  .oo-panel-content-anim { animation: oo-panelFadeIn 0.22s ease both; }
  
  .oo-shimmer-el {
    animation: oo-shimmer 1.5s infinite;
    background-image: linear-gradient(90deg,transparent 0%,rgba(148,163,184,0.14) 50%,transparent 100%);
    background-size: 200% 100%;
  }
  
  .oo-focusable:focus-visible { outline: 2.5px solid #3b82f6; outline-offset: 2px; border-radius: 8px; }
  
  /* ── Buttons ── */
  .oo-btn-primary {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 20px; border-radius:12px; border:none;
    background:linear-gradient(135deg,#2563eb,#4f46e5);
    color:#fff; font-size:13px; font-weight:700; cursor:pointer;
    font-family:'Poppins',sans-serif; white-space:nowrap;
    box-shadow:0 4px 16px rgba(37,99,235,0.3);
    transition:transform 0.15s ease, box-shadow 0.15s ease;
  }
  .oo-btn-primary:hover  { transform:translateY(-1px); box-shadow:0 8px 24px rgba(37,99,235,0.38); }
  .oo-btn-primary:active { transform:translateY(0); }
  .oo-btn-primary:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
  
  .oo-btn-ghost {
    display:inline-flex; align-items:center; gap:6px;
    height:40px; padding:0 14px; border-radius:11px;
    border:1px solid #e2e8f0; background:#f8fafc; color:#64748b;
    font-size:12px; font-weight:600; cursor:pointer;
    font-family:'Poppins',sans-serif; white-space:nowrap;
    transition:background 0.14s, border-color 0.14s;
  }
  .oo-btn-ghost:hover { border-color:#cbd5e1; background:#fff; }
  
  .oo-btn-danger {
    display:inline-flex; align-items:center; gap:6px;
    padding:10px 24px; border-radius:12px; border:none;
    background:linear-gradient(135deg,#f43f5e,#be123c);
    color:#fff; font-size:13px; font-weight:700; cursor:pointer;
    font-family:'Poppins',sans-serif;
    transition:transform 0.15s ease;
  }
  .oo-btn-danger:hover { transform:translateY(-1px); }
  
  .oo-icon-btn {
    width:32px; height:32px; border-radius:9px;
    display:inline-flex; align-items:center; justify-content:center;
    cursor:pointer; transition:transform 0.13s, filter 0.13s;
    flex-shrink:0;
  }
  .oo-icon-btn:hover   { transform:translateY(-1px); filter:brightness(1.06); }
  .oo-icon-btn:disabled{ cursor:not-allowed; opacity:0.55; transform:none; }
  
  /* ── Table rows ── */
  .oo-tr { transition:background 0.12s ease; }
  
  /* ── Overview rows ── */
  .oo-ov-row {
    display:flex; align-items:center; justify-content:space-between; gap:10px;
    padding:8px 8px; border-radius:10px; transition:background 0.12s ease; cursor:default;
  }
  
  /* ── View-all button ── */
  .oo-view-all {
    display:flex; align-items:center; justify-content:center; gap:5px;
    width:100%; padding:12px 0; font-size:12px; font-weight:700;
    background:none; border:none; border-top:1px solid; cursor:pointer;
    font-family:'Poppins',sans-serif; transition:background 0.12s ease;
    text-decoration:none;
  }
  
  /* ── Tab button ── */
  .oo-tab {
    display:inline-flex; align-items:center; gap:7px;
    padding:12px 16px; border:none; background:transparent;
    font-size:12.5px; cursor:pointer; font-family:'Poppins',sans-serif;
    white-space:nowrap; flex-shrink:0;
    border-bottom:2.5px solid transparent;
    transition:color 0.14s ease, border-color 0.14s ease;
  }
  
  /* ── Menu item ── */
  .oo-menu-item {
    display:flex; align-items:center; gap:10px;
    width:100%; padding:9px 13px; border-radius:9px;
    border:none; background:none; font-size:12.5px; font-weight:600;
    cursor:pointer; font-family:'Poppins',sans-serif; text-align:left;
    transition:background 0.12s ease;
  }
  
  /* ── Stat card hover lift ── */
  .oo-stat-card {
    transition:transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    cursor:pointer; user-select:none;
  }
  .oo-stat-card:hover { transform:translateY(-3px); }
  
  /* ── Grid layouts ── */
  .oo-stat-grid {
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:16px;
  }
  @media(max-width:1024px){
    .oo-stat-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media(max-width:540px){
    .oo-stat-grid { grid-template-columns:1fr 1fr; gap:10px; }
  }
  @media(max-width:360px){
    .oo-stat-grid { grid-template-columns:1fr; }
  }
  
  .oo-quad-grid {
    display:grid;
    grid-template-columns:repeat(4,minmax(0,1fr));
    gap:16px;
  }
  @media(max-width:1100px){ .oo-quad-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media(max-width:600px) { .oo-quad-grid { grid-template-columns:1fr; } }
  
  .oo-bottom-grid {
    display:grid;
    grid-template-columns:1fr 320px;
    gap:16px;
    margin-top:18px;
  }
  @media(max-width:900px){ .oo-bottom-grid { grid-template-columns:1fr; } }
  
  /* ── SPLIT-VIEW SHELL (replaces the old overlay SlidePanel) ── */
  .oo-split-shell {
    display:flex;
    align-items:stretch;
    width:100%;
    min-height:100vh;
  }
  .oo-split-left {
    flex:1 1 auto;
    min-width:0;
    overflow-y:auto;
  }
  .oo-split-divider {
    flex:0 0 auto;
    width:6px;
    cursor:col-resize;
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    touch-action:none;
    -webkit-user-select:none; user-select:none;
    background:transparent;
    z-index:5;
  }
  .oo-split-divider::before {
    content:""; position:absolute; top:0; left:50%; transform:translateX(-50%);
    width:1px; height:100%; background:var(--oo-divider-line); transition:background 0.15s ease, width 0.15s ease;
  }
  .oo-split-divider:hover::before,
  .oo-split-divider.oo-dragging::before {
    width:2px; background:var(--oo-divider-line-hov);
  }
  .oo-split-grip {
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:18px; height:46px; border-radius:7px;
    display:flex; align-items:center; justify-content:center;
    background:var(--oo-divider-grip-bg);
    border:1px solid var(--oo-divider-grip-border);
    color:var(--oo-divider-grip-fg);
    opacity:0; transition:opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
    pointer-events:none;
  }
  .oo-split-divider:hover .oo-split-grip,
  .oo-split-divider.oo-dragging .oo-split-grip {
    opacity:1;
  }
  .oo-split-divider.oo-dragging .oo-split-grip,
  .oo-split-divider:hover .oo-split-grip {
    background:var(--oo-divider-line-hov); color:#fff; border-color:var(--oo-divider-line-hov);
  }
  .oo-split-right {
    flex:0 0 auto;
    height:100vh;
    position:sticky;
    top:0;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    transition:width 0.18s cubic-bezier(0.4,0,0.2,1);
  }
  .oo-split-right.oo-resizing { transition:none; }
  @media(max-width:900px){
    .oo-split-shell { flex-direction:column; }
    .oo-split-divider { display:none; }
    .oo-split-right {
      width:100% !important;
      height:auto;
      position:relative;
      border-top:1px solid var(--oo-divider-line);
      max-height:80vh;
    }
  }
  
  /* ── Reduced motion ── */
  @media(prefers-reduced-motion:reduce){
    .oo-fade,.oo-pop,.oo-spin-cls,.oo-shimmer-el,.oo-panel-content-anim{animation:none!important;}
    .oo-btn-primary,.oo-btn-ghost,.oo-icon-btn,.oo-stat-card,.oo-split-right{transition:none!important;}
  }
  `;
  
  function InjectStyles() {
    useEffect(() => {
      const id = "oo-global-styles";
      if (document.getElementById(id)) return;
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
      return () => { /* leave styles for remounts */ };
    }, []);
    return null;
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     SPLIT-VIEW SHELL
     Replaces the old portal/overlay SlidePanel. The right form panel is a
     genuine flex sibling of the left content — part of normal page layout.
     No overlay, no blur, no dimming, no fixed/absolute positioning over the
     page, no popup feel. The divider between them is fully drag-resizable.
  ═══════════════════════════════════════════════════════════════════════════ */
  const PANEL_DEFAULT_WIDTH = 420;
  const PANEL_MIN_WIDTH = 360;
  const PANEL_MAX_WIDTH = 650;
  
  function SplitShell({ t, isDark, panelOpen, children, panelContent }) {
    const [width, setWidth] = useState(PANEL_DEFAULT_WIDTH);
    const [isResizing, setIsResizing] = useState(false);
    const dragState = useRef(null);
  
    const clampWidth = useCallback((w) => {
      const viewportMax = typeof window !== "undefined" ? window.innerWidth - 280 : PANEL_MAX_WIDTH;
      return Math.min(Math.max(w, PANEL_MIN_WIDTH), Math.min(PANEL_MAX_WIDTH, viewportMax));
    }, []);
  
    const handlePointerMove = useCallback((e) => {
      if (!dragState.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      // Panel is anchored to the right edge, so dragging LEFT increases width
      const delta = dragState.current.startX - clientX;
      setWidth(clampWidth(dragState.current.startWidth + delta));
      e.preventDefault?.();
    }, [clampWidth]);
  
    const handlePointerUp = useCallback(() => {
      dragState.current = null;
      setIsResizing(false);
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("touchend", handlePointerUp);
    }, [handlePointerMove]);
  
    const handlePointerDown = useCallback((e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      dragState.current = { startX: clientX, startWidth: width };
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", handlePointerMove);
      document.addEventListener("mouseup", handlePointerUp);
      document.addEventListener("touchmove", handlePointerMove, { passive: false });
      document.addEventListener("touchend", handlePointerUp);
      e.preventDefault();
    }, [handlePointerMove, handlePointerUp, width]);
  
    const handleDoubleClick = () => setWidth(PANEL_DEFAULT_WIDTH);
  
    const cssVars = {
      "--oo-divider-line": isDark ? "rgba(255,255,255,0.10)" : "#e2e8f0",
      "--oo-divider-line-hov": "#3b82f6",
      "--oo-divider-grip-bg": isDark ? "rgba(255,255,255,0.08)" : "#ffffff",
      "--oo-divider-grip-border": t.border,
      "--oo-divider-grip-fg": t.textMuted,
    };
  
    return (
      <div className="oo-split-shell" style={cssVars}>
        <div className="oo-split-left">
          {children}
        </div>
  
        {panelOpen && (
          <>
            <div
              className={`oo-split-divider ${isResizing ? "oo-dragging" : ""}`}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              onDoubleClick={handleDoubleClick}
              title="Drag to resize · double-click to reset"
              role="separator"
              aria-orientation="vertical"
            >
              <div className="oo-split-grip">
                <GripVertical size={12} />
              </div>
            </div>
  
            <div
              className={`oo-split-right ${isResizing ? "oo-resizing" : ""}`}
              style={{
                width,
                background: t.panelBg,
                borderLeft: `1px solid ${t.border}`,
              }}
            >
              {panelContent}
            </div>
          </>
        )}
      </div>
    );
  }
  
  /* Panel header + scrollable body used inside the right pane */
  function SidePanelFrame({ t, title, subtitle, onClose, children }) {
    return (
      <div className="oo-panel-content-anim" style={{ display:"flex", flexDirection:"column", height:"100%" }}>
        {/* Premium header */}
        <div style={{
          padding:"20px 22px", borderBottom:`1px solid ${t.border}`,
          display:"flex", alignItems:"flex-start", justifyContent:"space-between",
          flexShrink:0, background:t.theadBg,
        }}>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:16, fontWeight:800, color:t.text, margin:0, fontFamily:"'Poppins',sans-serif" }}>{title}</p>
            {subtitle && <p style={{ fontSize:12, color:t.textMuted, margin:"4px 0 0" }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="oo-icon-btn"
            style={{ border:`1px solid ${t.border}`, background:t.actBg, color:t.textSub, marginLeft:12 }}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
        {/* Scrollable body */}
        <div style={{ flex:1, padding:"22px 24px", overflowY:"auto" }}>
          {children}
        </div>
      </div>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     SHARED PRIMITIVES
  ═══════════════════════════════════════════════════════════════════════════ */
  function Skeleton({ t, rows = 5 }) {
    return (
      <div style={{ padding:"4px 0" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="oo-shimmer-el" style={{ height:46, borderRadius:11, background:t.skeletonBg, marginBottom:9 }} />
        ))}
      </div>
    );
  }
  
  function EmptyState({ t, icon: Icon, title, desc, onAdd, addLabel, compact }) {
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding: compact ? "28px 14px" : "56px 20px",
        textAlign:"center", border:`1.5px dashed ${t.emptyBorder}`,
        borderRadius:16, background:t.emptyBg, gap:10,
      }}>
        <div style={{
          width: compact ? 44 : 58, height: compact ? 44 : 58, borderRadius:"50%",
          background:t.emptyBg, border:`1px solid ${t.emptyBorder}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon size={compact ? 19 : 26} color={t.emptyIcon} />
        </div>
        <p style={{ fontWeight:700, fontSize: compact ? 13 : 15, color:t.text, margin:0 }}>{title}</p>
        {desc && <p style={{ fontSize:12, color:t.textMuted, margin:0, lineHeight:1.5 }}>{desc}</p>}
        {onAdd && (
          <button onClick={onAdd} className="oo-btn-primary" style={{ marginTop:6, fontSize:12, padding:"9px 18px" }}>
            <Plus size={13} /> {addLabel}
          </button>
        )}
      </div>
    );
  }
  
  /* Stat card — matches reference: icon on left, big number, label, chevron */
  function StatCard({ t, isDark, cat, count, active, onClick }) {
    const Icon = cat.icon;
    return (
      <div
        onClick={onClick}
        role="button" tabIndex={0}
        onKeyDown={(e) => (e.key==="Enter"||e.key===" ") && onClick?.()}
        className="oo-stat-card oo-focusable"
        style={{
          borderRadius:18, padding:"20px 18px 18px",
          background:t.cardBg,
          border: active ? `2px solid ${cat.color}55` : `1px solid ${t.border}`,
          boxShadow: active ? `0 0 0 3px ${cat.color}18, ${t.shadow}` : t.shadow,
        }}
      >
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{
            width:46, height:46, borderRadius:14,
            background:`linear-gradient(135deg,${cat.grad[0]},${cat.grad[1]})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 16px ${cat.color}35`,
          }}>
            <Icon size={22} color="#fff" />
          </div>
          <div style={{
            width:28, height:28, borderRadius:8, background:softBg(cat,isDark),
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <ChevronRight size={14} color={cat.color} />
          </div>
        </div>
        <p style={{ fontSize:"clamp(1.6rem,2.8vw,2rem)", fontWeight:900, color:t.text, margin:"0 0 2px", lineHeight:1, fontFamily:"'Poppins',sans-serif" }}>
          {count ?? <Loader2 size={18} className="oo-spin-cls" color={t.textMuted} />}
        </p>
        <p style={{ fontSize:13.5, fontWeight:700, color: active ? cat.color : t.text, margin:"2px 0 1px", fontFamily:"'Poppins',sans-serif" }}>
          {cat.label}
        </p>
        <p style={{ fontSize:11, color:t.textMuted, margin:0 }}>Total {cat.label.toLowerCase()}</p>
      </div>
    );
  }
  
  /* Toolbar */
  function TableToolbar({ t, search, onSearch, placeholder, onAdd, addLabel, children }) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 200px", minWidth:180 }}>
          <Search size={13} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:t.textMuted }} />
          <input
            value={search} onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder} className="oo-focusable"
            style={{
              width:"100%", height:40, borderRadius:11, border:`1px solid ${t.inputBorder}`,
              background:t.inputBg, color:t.inputText, fontSize:12.5, fontFamily:"'Poppins',sans-serif",
              paddingLeft:34, paddingRight:12, outline:"none", boxSizing:"border-box",
            }}
          />
        </div>
        {children}
        <button onClick={onAdd} className="oo-btn-primary" style={{ flexShrink:0, padding:"10px 16px", fontSize:12.5 }}>
          <Plus size={13} /> {addLabel}
        </button>
      </div>
    );
  }
  
  function OpenFullPageLink({ t, navigate, to, label }) {
    if (!navigate || !to) return null;
    return (
      <button onClick={() => navigate(to)} className="oo-btn-ghost" style={{ fontSize:12, height:40 }}>
        {label} <ChevronRight size={13} />
      </button>
    );
  }
  
  function DataTable({ t, columns, rows, loading, emptyState }) {
    if (loading) return <Skeleton t={t} />;
    if (!rows.length) return emptyState;
    return (
      <div style={{ overflowX:"auto", borderRadius:14, border:`1px solid ${t.border}` }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:520 }}>
          <thead>
            <tr style={{ background:t.theadBg }}>
              {columns.map((col) => (
                <th key={col.key} style={{
                  padding:"11px 14px", textAlign:col.align||"left",
                  fontSize:9.5, fontWeight:700, letterSpacing:"0.1em",
                  textTransform:"uppercase", color:t.textMuted,
                  borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap",
                  fontFamily:"'Poppins',sans-serif",
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="oo-tr" style={{
                borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${t.border}`,
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = t.rowHov}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{
                    padding:"11px 14px", fontSize:12.5, color:t.text,
                    verticalAlign:"middle", textAlign:col.align||"left",
                    fontFamily:"'Poppins',sans-serif", ...(col.style||{}),
                  }}>
                    {col.render ? col.render(row, ri) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  function FormField({ t, label, children }) {
    return (
      <div style={{ marginBottom:18 }}>
        <label style={{
          display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em",
          textTransform:"uppercase", color:t.textMuted, marginBottom:8,
          fontFamily:"'Poppins',sans-serif",
        }}>
          {label}
        </label>
        {children}
      </div>
    );
  }
  
  function OOInput({ t, ...props }) {
    return (
      <input
        {...props}
        className={`oo-focusable ${props.className||""}`}
        style={{
          width:"100%", height:44, borderRadius:11, border:`1.5px solid ${t.inputBorder}`,
          background:t.inputBg, color:t.inputText, fontSize:13, fontFamily:"'Poppins',sans-serif",
          padding:"0 14px", outline:"none", boxSizing:"border-box",
          transition:"border-color 0.14s",
          ...(props.style||{}),
        }}
      />
    );
  }
  
  function OOSelect({ t, children, ...props }) {
    return (
      <select
        {...props}
        className="oo-focusable"
        style={{
          width:"100%", height:44, borderRadius:11, border:`1.5px solid ${t.inputBorder}`,
          background:t.inputBg, color:t.inputText, fontSize:13, fontFamily:"'Poppins',sans-serif",
          padding:"0 14px", outline:"none", boxSizing:"border-box", cursor:"pointer",
          transition:"border-color 0.14s",
          ...(props.style||{}),
        }}
      >
        {children}
      </select>
    );
  }
  
  function SaveBtn({ saving, label, onClick, t }) {
    return (
      <button
        onClick={onClick} disabled={saving}
        className="oo-btn-primary"
        style={{ width:"100%", justifyContent:"center", padding:"13px 0", fontSize:13.5, marginTop:24 }}
      >
        {saving ? <><Loader2 size={15} className="oo-spin-cls" /> Saving…</> : <><ChevronRight size={15} /> {label}</>}
      </button>
    );
  }
  
  function ErrorBanner({ t, message }) {
    if (!message) return null;
    return (
      <div style={{
        display:"flex", alignItems:"center", gap:9, padding:"10px 14px",
        borderRadius:11, background:t.errorBg, border:`1px solid ${t.errorBorder}`,
        marginBottom:6, marginTop:4,
      }}>
        <AlertCircle size={14} color="#f43f5e" style={{ flexShrink:0 }} />
        <span style={{ fontSize:12, color:"#f43f5e", fontFamily:"'Poppins',sans-serif" }}>{message}</span>
      </div>
    );
  }
  
  /* Plan-limit notice — kept inline (non-blocking banner) instead of a modal,
     consistent with "no popup / no overlay" requirement. */
  function LimitErrorBanner({ t, message, onDismiss }) {
    if (!message) return null;
    return (
      <div style={{
        display:"flex", alignItems:"flex-start", gap:10, padding:"14px 16px",
        borderRadius:14, background:"rgba(244,63,94,0.08)",
        border:"1.5px solid rgba(244,63,94,0.28)", marginBottom:14,
      }}>
        <AlertCircle size={18} color="#f43f5e" style={{ flexShrink:0, marginTop:1 }} />
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:800, color:"#f43f5e", margin:"0 0 4px", fontFamily:"'Poppins',sans-serif" }}>
            Plan Limit Reached
          </p>
          <p style={{ fontSize:12, color:t.textSub, margin:0, lineHeight:1.6 }}>
            {message}. Please contact your Super Admin to upgrade your plan.
          </p>
        </div>
        <button onClick={onDismiss} className="oo-icon-btn" style={{ width:24, height:24, background:"transparent", color:"#f43f5e" }}>
          <X size={13} />
        </button>
      </div>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     PANEL FORMS — pure form bodies, rendered inside SidePanelFrame from the
     split-view's right pane. Each receives everything via props so the
     data-fetching tabs below can lift state to the page level.
  ═══════════════════════════════════════════════════════════════════════════ */
  function DepartmentForm({ t, mode, initial, onCancel, onSubmitted }) {
    const [form, setForm] = useState(initial || { name:"", head:"" });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [limitError, setLimitError] = useState(null);
    const [customOptions, setCustomOptions] = useState([]);
    const allOptions = [...DEPARTMENT_OPTIONS, ...customOptions];
  
    useEffect(() => { setForm(initial || { name:"", head:"" }); setFormError(""); setLimitError(null); }, [initial, mode]);
  
    const getOrgId = useCallback(() => {
      try {
        const token = localStorage.getItem("lms_token");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.organizationId || payload.orgId || null;
      } catch { return null; }
    }, []);
  
    const handleSave = async () => {
      if (!form.name.trim()) { setFormError("Department name is required."); return; }
      if (!form.head.trim()) { setFormError("Department head is required."); return; }
      setFormError(""); setLimitError(null);
      try {
        setSaving(true);
        if (mode === "create") {
          const res = await createDepartment({ name:form.name.trim(), head:form.head.trim(), organizationId:getOrgId() });
          onSubmitted(res.data, "create");
        } else {
          const res = await updateDepartment(initial.id, { name:form.name.trim(), head:form.head.trim() });
          onSubmitted(res.data, "edit");
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data || "Something went wrong.";
        const text = typeof msg === "string" ? msg : "Something went wrong.";
        if (text.toLowerCase().includes("limit") || text.toLowerCase().includes("max")) setLimitError(text);
        else setFormError(text);
      } finally { setSaving(false); }
    };
  
    return (
      <>
        <LimitErrorBanner t={t} message={limitError} onDismiss={() => setLimitError(null)} />
        <FormField t={t} label="Department Name *">
          <OOSelect t={t} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name:e.target.value }))} style={{ color:form.name ? t.inputText : t.textMuted }}>
            <option value="">Select department…</option>
            {allOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            <option value="__custom__">+ Add custom…</option>
          </OOSelect>
        </FormField>
        {form.name === "__custom__" && (
          <FormField t={t} label="Custom Name">
            <OOInput t={t} placeholder="Enter department name" onChange={(e) => {
              setCustomOptions((p) => [...p.filter((x) => x !== e.target.value), e.target.value]);
              setForm((f) => ({ ...f, name:e.target.value }));
            }} />
          </FormField>
        )}
        <FormField t={t} label="Department Head *">
          <OOInput t={t} value={form.head} onChange={(e) => setForm((f) => ({ ...f, head:e.target.value }))} placeholder="e.g. Dr. Rahul Sharma" />
        </FormField>
        <ErrorBanner t={t} message={formError} />
        <SaveBtn t={t} saving={saving} label={mode==="create" ? "Add Department" : "Save Changes"} onClick={handleSave} />
      </>
    );
  }
  
  function BranchForm({ t, mode, initial, departments, onCancel, onSubmitted }) {
    const [form, setForm] = useState(initial || { name:"", city:"", departmentId:"" });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [limitError, setLimitError] = useState(null);
  
    useEffect(() => { setForm(initial || { name:"", city:"", departmentId:"" }); setSaveError(""); setLimitError(null); }, [initial, mode]);
  
    const handleSave = async () => {
      if (!form.name.trim() || !form.city.trim()) { setSaveError("Name and city are required."); return; }
      setSaveError(""); setLimitError(null);
      try {
        setSaving(true);
        const res = mode === "edit" ? await updateBranch(initial.id, form) : await createBranch(form);
        onSubmitted(res?.data, mode);
      } catch (e) {
        const msg = e?.response?.data?.message || e?.response?.data || "Something went wrong.";
        const text = typeof msg === "string" ? msg : "Something went wrong.";
        if (text.toLowerCase().includes("limit") || text.toLowerCase().includes("max")) setLimitError(text);
        else setSaveError(text);
      } finally { setSaving(false); }
    };
  
    return (
      <>
        <LimitErrorBanner t={t} message={limitError} onDismiss={() => setLimitError(null)} />
        <FormField t={t} label="Branch Name *">
          <OOInput t={t} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name:e.target.value }))} placeholder="e.g. Patna Main Campus" />
        </FormField>
        <FormField t={t} label="City *">
          <OOSelect t={t} value={form.city} onChange={(e) => setForm((f) => ({ ...f, city:e.target.value }))}>
            <option value="">Select city…</option>
            {CITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </OOSelect>
        </FormField>
        <FormField t={t} label="Department">
          <OOSelect t={t} value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId:e.target.value }))}>
            <option value="">Select department…</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </OOSelect>
        </FormField>
        <ErrorBanner t={t} message={saveError} />
        <SaveBtn t={t} saving={saving} label={mode==="edit" ? "Save Changes" : "Add Branch"} onClick={handleSave} />
      </>
    );
  }
  
  function BatchForm({ t, branches, onSubmitted }) {
    const [form, setForm] = useState({ batchName:"", branchId:"" });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [limitError, setLimitError] = useState(null);
  
    const handleSave = async () => {
      if (!form.batchName.trim()) { setFormError("Batch name is required."); return; }
      if (!form.branchId) { setFormError("Please select a branch."); return; }
      setFormError(""); setLimitError(null);
      try {
        setSaving(true);
        const res = await createBatch({ batchName: form.batchName.trim(), branchId: form.branchId });
        onSubmitted(res?.data);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data || "Something went wrong.";
        const text = typeof msg === "string" ? msg : "Something went wrong.";
        if (text.toLowerCase().includes("limit") || text.toLowerCase().includes("max")) setLimitError(text);
        else setFormError(text);
      } finally { setSaving(false); }
    };
  
    return (
      <>
        <LimitErrorBanner t={t} message={limitError} onDismiss={() => setLimitError(null)} />
        <FormField t={t} label="Batch Name *">
          <OOInput t={t} value={form.batchName} onChange={(e) => setForm((f) => ({ ...f, batchName:e.target.value }))} placeholder="Enter batch name" />
        </FormField>
        <FormField t={t} label="Branch *">
          <OOSelect t={t} value={form.branchId} onChange={(e) => setForm((f) => ({ ...f, branchId:e.target.value }))}>
            <option value="">Select branch…</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </OOSelect>
        </FormField>
        <ErrorBanner t={t} message={formError} />
        <SaveBtn t={t} saving={saving} label="Add Batch" onClick={handleSave} />
      </>
    );
  }
  
  function UserForm({ t, mode, initial, loggedInUser, onSubmitted }) {
    const [formData, setFormData] = useState(initial || { displayName:"", email:"", password:"", roles:"ROLE_STUDENT" });
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState("");
    const [limitError, setLimitError] = useState(null);
    const [saving, setSaving] = useState(false);
  
    useEffect(() => {
      setFormData(initial || { displayName:"", email:"", password:"", roles:"ROLE_STUDENT" });
      setFormError(""); setLimitError(null); setShowPassword(false);
    }, [initial, mode]);
  
    const getPasswordStrength = (pw) => {
      if (!pw) return { score:0, label:"", color:"" };
      let score = 0;
      if (pw.length>=8) score++; if (pw.length>=12) score++;
      if (/[A-Z]/.test(pw)) score++; if (/[a-z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++; if (/[^A-Za-z0-9]/.test(pw)) score++;
      if (score<=2) return { score, label:"Weak",   color:"#f43f5e" };
      if (score<=4) return { score, label:"Fair",   color:"#f59e0b" };
      if (score===5) return { score, label:"Good",  color:"#3b82f6" };
      return { score, label:"Strong", color:"#10b981" };
    };
    const pwStr = getPasswordStrength(formData.password);
  
    const handleSave = async (e) => {
      e?.preventDefault?.();
      if (!formData.displayName.trim() || !formData.email.trim()) { setFormError("Name and email are required."); return; }
      setFormError(""); setLimitError(null);
      try {
        setSaving(true);
        if (mode === "edit") {
          await authService.adminUpdateUserByEmail(initial.email, { name:formData.displayName, email:formData.email, role:ROLE_TO_AUTH_ROLE[formData.roles] });
          const res = await userService.updateUser(initial.id, { displayName:formData.displayName });
          onSubmitted(res.data, "edit");
          if (loggedInUser && loggedInUser.email===initial.email && loggedInUser.roles!==formData.roles) {
            alert("Your role has been changed. Please login again."); localStorage.clear(); window.location.href="/login"; return;
          }
        } else {
          const currentUser = JSON.parse(localStorage.getItem("lms_user") || "null");
          const orgId = currentUser?.organizationId || null;
          await userService.createAuthUser({ email:formData.email, password:formData.password, displayName:formData.displayName, roles:formData.roles, organizationId:orgId });
          onSubmitted(null, "create");
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data || "Something went wrong.";
        const text = typeof msg === "string" ? msg : "Something went wrong.";
        if (text.toLowerCase().includes("limit")||text.toLowerCase().includes("max")) setLimitError(text);
        else setFormError(text);
      } finally { setSaving(false); }
    };
  
    return (
      <>
        <LimitErrorBanner t={t} message={limitError} onDismiss={() => setLimitError(null)} />
        <FormField t={t} label="Full Name *">
          <OOInput t={t} value={formData.displayName} onChange={(e) => setFormData((f) => ({ ...f, displayName:e.target.value }))} placeholder="e.g. Rahul Sharma" />
        </FormField>
        <FormField t={t} label="Email *">
          <OOInput t={t} type="email" value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email:e.target.value }))} placeholder="user@email.com" />
        </FormField>
        {mode !== "edit" && (
          <FormField t={t} label="Password *">
            <div style={{ position:"relative" }}>
              <OOInput t={t} type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData((f) => ({ ...f, password:e.target.value }))} placeholder="Min. 8 characters" style={{ paddingRight:44 }} />
              <button onClick={() => setShowPassword((p) => !p)} type="button" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:t.textMuted, display:"flex" }}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {formData.password && (
              <div style={{ marginTop:8 }}>
                <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=pwStr.score ? pwStr.color : t.border, transition:"background 0.2s" }} />
                  ))}
                </div>
                <span style={{ fontSize:10, color:pwStr.color, fontWeight:700 }}>{pwStr.label}</span>
              </div>
            )}
          </FormField>
        )}
        <FormField t={t} label="Role">
          <OOSelect t={t} value={formData.roles} onChange={(e) => setFormData((f) => ({ ...f, roles:e.target.value }))}>
            <option value="ROLE_STUDENT">Student</option>
            <option value="ROLE_TRAINER">Trainer</option>
          </OOSelect>
        </FormField>
        <ErrorBanner t={t} message={formError} />
        <SaveBtn t={t} saving={saving} label={mode==="edit" ? "Save Changes" : "Add User"} onClick={handleSave} />
      </>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     DEPARTMENTS TAB
  ═══════════════════════════════════════════════════════════════════════════ */
  function DepartmentsTab({ t, isDark, navigate, onOpenPanel }) {
    const [departments, setDepartments]   = useState([]);
    const [loading, setLoading]           = useState(true);
    const [deleting, setDeleting]         = useState(null);
    const [search, setSearch]             = useState("");
  
    useEffect(() => { fetchDepartments(); }, []);
  
    const fetchDepartments = async () => {
      try { setLoading(true); const res = await getDepartments(); setDepartments(res.data || []); }
      catch (err) { console.error("getDepartments:", err); }
      finally { setLoading(false); }
    };
  
    const handleAdd = () => onOpenPanel({
      type: "department", mode: "create", initial: { name:"", head:"" },
      onSubmitted: (data) => { setDepartments((p) => [...p, data]); onOpenPanel(null); },
    });
  
    const handleEdit = (dept) => onOpenPanel({
      type: "department", mode: "edit", initial: { id:dept.id, name:dept.name, head:dept.head||"" },
      onSubmitted: (data) => { setDepartments((p) => p.map((d) => d.id === dept.id ? data : d)); onOpenPanel(null); },
    });
  
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this department? All branches and batches will also be deleted.")) return;
      try { setDeleting(id); await deleteDepartment(id); setDepartments((p) => p.filter((d) => d.id !== id)); }
      catch { alert("Delete failed."); }
      finally { setDeleting(null); }
    };
  
    const filtered = departments.filter((d) => d.name?.toLowerCase().includes(search.toLowerCase()));
  
    const columns = [
      { key:"#", label:"#", style:{ width:44 }, render:(_,i) => <span style={{ fontSize:11, color:t.textMuted, fontWeight:600 }}>{i+1}</span> },
      { key:"name", label:"Department", render:(row) => {
        const [c1,c2] = gradColor(row.name);
        return (
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${c1},${c2})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, flexShrink:0 }}>
              {row.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontWeight:600, color:t.text, fontSize:13.5 }}>{row.name}</span>
          </div>
        );
      }},
      { key:"head", label:"Department Head", render:(row) => <span style={{ color:t.textSub, fontSize:12.5 }}>{row.head||"—"}</span> },
      { key:"actions", label:"Actions", align:"right", render:(row) => (
        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
          <button onClick={() => handleEdit(row)} className="oo-icon-btn" style={{ border:`1px solid ${t.border}`, background:t.actBg, color:t.textSub }} title="Edit"><Pencil size={13} /></button>
          <button onClick={() => handleDelete(row.id)} disabled={deleting===row.id} className="oo-icon-btn" style={{ border:"1px solid rgba(244,63,94,0.24)", background:"rgba(244,63,94,0.08)", color:"#f43f5e" }} title="Delete">
            {deleting===row.id ? <Loader2 size={13} className="oo-spin-cls" /> : <Trash2 size={13} />}
          </button>
        </div>
      )},
    ];
  
    return (
      <>
        <TableToolbar t={t} search={search} onSearch={setSearch} placeholder="Search departments…" onAdd={handleAdd} addLabel="Add Department">
          <OpenFullPageLink t={t} navigate={navigate} to="/admin/departmentlist" label="Full List" />
        </TableToolbar>
        <DataTable t={t} columns={columns} rows={filtered} loading={loading}
          emptyState={<EmptyState t={t} icon={Building2} title="No departments yet" desc="Create your first department to get started" onAdd={handleAdd} addLabel="Add Department" />}
        />
      </>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     BRANCHES TAB
  ═══════════════════════════════════════════════════════════════════════════ */
  function BranchesTab({ t, isDark, navigate, onOpenPanel }) {
    const [branches, setBranches]       = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState("");
    const [filterDept, setFilterDept]   = useState("");
  
    useEffect(() => { loadBranches(); loadDepts(); }, []);
  
    const loadBranches = async () => {
      try {
        const res = await getBranches(); const data = res?.data;
        if (Array.isArray(data)) setBranches(data);
        else if (Array.isArray(data?.data)) setBranches(data.data);
        else setBranches([]);
      } catch (e) { console.error("Failed to load branches", e); }
      finally { setLoading(false); }
    };
  
    const loadDepts = async () => {
      try { const res = await getDepartments(); setDepartments(Array.isArray(res?.data) ? res.data : []); }
      catch (e) { console.error("load depts:", e); }
    };
  
    const handleAdd = () => onOpenPanel({
      type: "branch", mode: "create", initial: { name:"", city:"", departmentId:"" }, departments,
      onSubmitted: () => { loadBranches(); onOpenPanel(null); },
    });
  
    const handleEdit = (b) => onOpenPanel({
      type: "branch", mode: "edit", initial: { id:b.id, name:b.name, city:b.city, departmentId:b.departmentId||"" }, departments,
      onSubmitted: () => { loadBranches(); onOpenPanel(null); },
    });
  
    const handleDelete = async (b) => {
      if (!confirm(`Delete branch "${b.name}"? All batches will also be removed.`)) return;
      try { await deleteBranch(b.id); loadBranches(); } catch { alert("Failed to delete branch"); }
    };
  
    const deptName = (id) => departments.find((d) => d.id===id || d.id===Number(id))?.name || "—";
    const filtered = branches.filter((b) => {
      const ms = b?.name?.toLowerCase().includes(search.toLowerCase()) || b?.city?.toLowerCase().includes(search.toLowerCase());
      const md = !filterDept || String(b.departmentId) === String(filterDept);
      return ms && md;
    });
  
    const columns = [
      { key:"#", label:"#", style:{ width:44 }, render:(_,i) => <span style={{ fontSize:11, color:t.textMuted, fontWeight:600 }}>{i+1}</span> },
      { key:"name", label:"Branch Name", render:(row) => {
        const [c1,c2] = gradColor(row.name);
        return (
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${c1},${c2})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, flexShrink:0 }}>
              <GitBranch size={15} />
            </div>
            <span style={{ fontWeight:600, color:t.text, fontSize:13.5 }}>{row.name}</span>
          </div>
        );
      }},
      { key:"city", label:"City", render:(row) => (
        <div style={{ display:"flex", alignItems:"center", gap:6, color:t.textSub, fontSize:12.5 }}>
          <MapPin size={13} />{row.city||"—"}
        </div>
      )},
      { key:"dept", label:"Department", render:(row) => <span style={{ color:t.textSub, fontSize:12.5 }}>{deptName(row.departmentId)}</span> },
      { key:"actions", label:"Actions", align:"right", render:(row) => (
        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
          <button onClick={() => handleEdit(row)} className="oo-icon-btn" style={{ border:`1px solid ${t.border}`, background:t.actBg, color:t.textSub }}><Pencil size={13} /></button>
          <button onClick={() => handleDelete(row)} className="oo-icon-btn" style={{ border:"1px solid rgba(244,63,94,0.24)", background:"rgba(244,63,94,0.08)", color:"#f43f5e" }}><Trash2 size={13} /></button>
        </div>
      )},
    ];
  
    return (
      <>
        <TableToolbar t={t} search={search} onSearch={setSearch} placeholder="Search branches…" onAdd={handleAdd} addLabel="Add Branch">
          <OOSelect t={t} value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ minWidth:160, height:40, fontSize:12 }}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </OOSelect>
          <OpenFullPageLink t={t} navigate={navigate} to="/admin/branches" label="Full List" />
        </TableToolbar>
        <DataTable t={t} columns={columns} rows={filtered} loading={loading}
          emptyState={<EmptyState t={t} icon={GitBranch} title="No branches yet" desc="Add your first branch location" onAdd={handleAdd} addLabel="Add Branch" />}
        />
      </>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     BATCHES TAB
  ═══════════════════════════════════════════════════════════════════════════ */
  function BatchesTab({ t, isDark, navigate, onOpenPanel }) {
    const [batches, setBatches]         = useState([]);
    const [branches, setBranches]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState("");
  
    const loadBatches = async () => {
      try {
        const res = await getAllBatches();
        const list = res?.data?.data || res?.data?.batches || res?.data || [];
        setBatches(Array.isArray(list) ? list : []);
      } catch (err) { console.error("Failed to load batches", err); setBatches([]); }
      finally { setLoading(false); }
    };
  
    const loadBranches = async () => {
      try {
        const res = await getBranches(); const data = res?.data;
        if (Array.isArray(data)) setBranches(data);
        else if (Array.isArray(data?.data)) setBranches(data.data);
        else setBranches([]);
      } catch (e) { console.error("Failed to load branches", e); }
    };
  
    useEffect(() => {
      loadBatches();
      loadBranches();
      const onFocus = () => loadBatches();
      window.addEventListener("focus", onFocus);
      document.addEventListener("visibilitychange", onFocus);
      return () => { window.removeEventListener("focus", onFocus); document.removeEventListener("visibilitychange", onFocus); };
    }, []);
  
    const handleAdd = () => onOpenPanel({
      type: "batch", branches,
      onSubmitted: () => { loadBatches(); onOpenPanel(null); },
    });
  
    const handleDelete = async (b) => {
      if (!confirm(`Delete batch "${b.batchName}"?`)) return;
      try { await deleteBatch(b.id); loadBatches(); } catch { alert("Failed to delete batch"); }
    };
  
    const filtered = batches.filter((b) => b?.batchName?.toLowerCase().includes(search.toLowerCase()));
  
    const statusColor = (status) => {
      if (!status) return { bg:"rgba(148,163,184,0.12)", c:"#94a3b8", border:"rgba(148,163,184,0.28)" };
      const s = status.toLowerCase();
      if (s==="active")   return { bg:"rgba(16,185,129,0.1)", c:"#10b981", border:"rgba(16,185,129,0.28)" };
      if (s==="inactive") return { bg:"rgba(244,63,94,0.09)", c:"#f43f5e", border:"rgba(244,63,94,0.24)" };
      return { bg:"rgba(245,158,11,0.1)", c:"#f59e0b", border:"rgba(245,158,11,0.24)" };
    };
  
    const columns = [
      { key:"#", label:"#", style:{ width:44 }, render:(_,i) => <span style={{ fontSize:11, color:t.textMuted, fontWeight:600 }}>{i+1}</span> },
      { key:"batchName", label:"Batch Name", render:(row) => {
        const [c1,c2] = gradColor(row.batchName);
        return (
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${c1},${c2})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, flexShrink:0 }}>
              <Layers size={15} />
            </div>
            <span style={{ fontWeight:600, color:t.text, fontSize:13.5 }}>{row.batchName}</span>
          </div>
        );
      }},
      { key:"dept", label:"Department", render:(row) => <span style={{ fontSize:12.5, color:t.textSub }}>{row.departmentName||row.department?.name||"—"}</span> },
      { key:"branch", label:"Branch",   render:(row) => <span style={{ fontSize:12.5, color:t.textSub }}>{row.branchName||row.branch?.name||"—"}</span> },
      { key:"students", label:"Students", align:"center", render:(row) => (
        <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center" }}>
          <Users size={13} color={t.textMuted} />
          <span style={{ fontSize:13, fontWeight:700, color:t.text }}>{row.studentCount??row.students??"—"}</span>
        </div>
      )},
      { key:"status", label:"Status", align:"center", render:(row) => {
        const { bg, c, border } = statusColor(row.status);
        return <span style={{ padding:"3px 12px", borderRadius:999, fontSize:10.5, fontWeight:700, letterSpacing:"0.06em", background:bg, color:c, border:`1px solid ${border}` }}>{row.status||"Unknown"}</span>;
      }},
      { key:"actions", label:"Actions", align:"right", render:(row) => (
        <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
          <button onClick={() => handleDelete(row)} className="oo-icon-btn" style={{ border:"1px solid rgba(244,63,94,0.24)", background:"rgba(244,63,94,0.08)", color:"#f43f5e" }}><Trash2 size={13} /></button>
        </div>
      )},
    ];
  
    return (
      <>
        <TableToolbar t={t} search={search} onSearch={setSearch} placeholder="Search batches…" onAdd={handleAdd} addLabel="Add Batch">
          <OpenFullPageLink t={t} navigate={navigate} to="/admin/batches" label="Full List" />
        </TableToolbar>
        <DataTable t={t} columns={columns} rows={filtered} loading={loading}
          emptyState={<EmptyState t={t} icon={Layers} title="No batches yet" desc="Create your first batch to assign trainers and students" onAdd={handleAdd} addLabel="Add Batch" />}
        />
      </>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     USERS TAB
  ═══════════════════════════════════════════════════════════════════════════ */
  function UsersTab({ t, isDark, navigate, onOpenPanel }) {
    const [users, setUsers]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState("");
    const [roleFilter, setRoleFilter]   = useState("");
  
    const loggedInUser = JSON.parse(localStorage.getItem("lms_user") || "null");
  
    useEffect(() => { fetchUsers(); }, []);
  
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const role = localStorage.getItem("role");
        if (role === "TENANT_ADMIN") {
          const currentUser = JSON.parse(localStorage.getItem("lms_user") || "null");
          const orgId = currentUser?.organizationId || null;
          if (orgId) {
            const data = await userService.getUsersByOrg(orgId);
            const filtered = Array.isArray(data) ? data.filter((u) => u.roles==="ROLE_STUDENT"||u.roles==="ROLE_TRAINER") : [];
            setUsers(filtered);
          } else setUsers([]);
        } else {
          const res = await userService.getUsers(0, 50);
          setUsers(res.data.content);
        }
      } catch { setUsers([]); }
      finally { setLoading(false); }
    };
  
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this user?")) return;
      try { await userService.deleteUser(id); setUsers((p) => p.filter((u) => u.id !== id)); }
      catch { alert("Failed to delete user"); }
    };
  
    const handleAdd = () => onOpenPanel({
      type: "user", mode: "create", initial: { displayName:"", email:"", password:"", roles:"ROLE_STUDENT" }, loggedInUser,
      onSubmitted: () => { fetchUsers(); onOpenPanel(null); },
    });
  
    const handleEdit = (user) => onOpenPanel({
      type: "user", mode: "edit",
      initial: { id:user.id, email:user.email, displayName:user.displayName||"", password:"", roles:user.roles||"ROLE_STUDENT" },
      loggedInUser,
      onSubmitted: (data) => { setUsers((p) => p.map((u) => u.id===user.id ? data : u)); onOpenPanel(null); },
    });
  
    const filtered = users.filter((u) => {
      const ms = u?.displayName?.toLowerCase().includes(search.toLowerCase()) || u?.email?.toLowerCase().includes(search.toLowerCase());
      const mr = !roleFilter || u.roles===roleFilter;
      return ms && mr;
    });
  
    const columns = [
      { key:"#", label:"#", style:{ width:44 }, render:(_,i) => <span style={{ fontSize:11, color:t.textMuted, fontWeight:600 }}>{i+1}</span> },
      { key:"displayName", label:"User", render:(row) => {
        const [c1,c2] = gradColor(row.displayName||row.email);
        const initials = (row.displayName||row.email||"U").split(" ").map((w)=>w[0]).join("").slice(0,2).toUpperCase();
        return (
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:`linear-gradient(135deg,${c1},${c2})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, flexShrink:0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize:13.5, fontWeight:600, color:t.text, margin:0 }}>{row.displayName||"—"}</p>
              <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                <Mail size={11} color={t.textMuted} />
                <span style={{ fontSize:11, color:t.textMuted }}>{row.email}</span>
              </div>
            </div>
          </div>
        );
      }},
      { key:"roles", label:"Role", render:(row) => {
        const cfg = ROLE_CFG[row.roles] || { label:row.roles||"Unknown", color:"#94a3b8", bg:"rgba(148,163,184,0.12)" };
        return <span style={{ padding:"3px 12px", borderRadius:999, fontSize:10.5, fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.color}30` }}>{cfg.label}</span>;
      }},
      { key:"actions", label:"Actions", align:"right", render:(row) => (
        <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
          <button onClick={() => handleEdit(row)} className="oo-icon-btn" style={{ border:`1px solid ${t.border}`, background:t.actBg, color:t.textSub }}><Pencil size={13} /></button>
          <button onClick={() => handleDelete(row.id)} className="oo-icon-btn" style={{ border:"1px solid rgba(244,63,94,0.24)", background:"rgba(244,63,94,0.08)", color:"#f43f5e" }}><Trash2 size={13} /></button>
        </div>
      )},
    ];
  
    return (
      <>
        <TableToolbar t={t} search={search} onSearch={setSearch} placeholder="Search users…" onAdd={handleAdd} addLabel="Add User">
          <OOSelect t={t} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ minWidth:140, height:40, fontSize:12 }}>
            <option value="">All Roles</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_TRAINER">Trainer</option>
            <option value="ROLE_STUDENT">Student</option>
          </OOSelect>
          <OpenFullPageLink t={t} navigate={navigate} to="/admin/users" label="Full List" />
        </TableToolbar>
        <DataTable t={t} columns={columns} rows={filtered} loading={loading}
          emptyState={<EmptyState t={t} icon={Users} title="No users found" desc="Add your first user to get started" onAdd={handleAdd} addLabel="Add User" />}
        />
      </>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     OVERVIEW COLUMN (reference-style)
  ═══════════════════════════════════════════════════════════════════════════ */
  function OverviewRow({ t, isDark, cat, item }) {
    if (cat.id === "departments") {
      return (
        <div className="oo-ov-row" onMouseEnter={(e)=>e.currentTarget.style.background=t.rowHov} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
          <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:softBg(cat,isDark), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Building2 size={14} color={cat.color} />
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</span>
          </div>
        </div>
      );
    }
    if (cat.id === "branches") {
      return (
        <div className="oo-ov-row" onMouseEnter={(e)=>e.currentTarget.style.background=t.rowHov} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
          <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:softBg(cat,isDark), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <MapPin size={14} color={cat.color} />
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</span>
          </div>
          <span style={{ fontSize:11, color:t.textMuted, flexShrink:0, marginLeft:6 }}>{item._deptName||"—"}</span>
        </div>
      );
    }
    if (cat.id === "batches") {
      return (
        <div className="oo-ov-row" onMouseEnter={(e)=>e.currentTarget.style.background=t.rowHov} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
          <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:softBg(cat,isDark), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Layers size={14} color={cat.color} />
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.batchName}</span>
          </div>
          <span style={{
            fontSize:11, fontWeight:700, flexShrink:0, marginLeft:6,
            background:softBg(cat,isDark), color:cat.color,
            padding:"2px 8px", borderRadius:999,
          }}>{item.studentCount??item.students??0}</span>
        </div>
      );
    }
    // users
    const cfg = ROLE_CFG[item.roles] || { label:item.roles||"—", color:"#94a3b8", bg:"rgba(148,163,184,0.12)" };
    const initials = (item.displayName||item.email||"U").split(" ").map((w)=>w[0]).join("").slice(0,2).toUpperCase();
    const [c1,c2] = gradColor(item.displayName||item.email||"");
    return (
      <div className="oo-ov-row" onMouseEnter={(e)=>e.currentTarget.style.background=t.rowHov} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
          <div style={{ width:30, height:30, borderRadius:9, background:`linear-gradient(135deg,${c1},${c2})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
            {initials}
          </div>
          <span style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.displayName||item.email}</span>
        </div>
        <span style={{ fontSize:10.5, fontWeight:700, padding:"2px 10px", borderRadius:999, background:cfg.bg, color:cfg.color, flexShrink:0 }}>{cfg.label}</span>
      </div>
    );
  }
  
  function OverviewColumn({ t, isDark, cat, items, count, loading, search, onAdd, onViewAll, onDrill }) {
    const Icon = cat.icon;
    const filtered = useMemo(() => {
      if (!search) return items;
      const s = search.toLowerCase();
      return items.filter((it) => {
        const label = it.name || it.batchName || it.displayName || it.email || "";
        return label.toLowerCase().includes(s);
      });
    }, [items, search]);
  
    return (
      <div style={{
        background:t.cardBg, border:`1px solid ${t.border}`,
        borderRadius:18, boxShadow:t.shadow,
        display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden",
      }}>
        {/* Column header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 12px", borderBottom:`1px solid ${t.border}` }}>
          <button onClick={onDrill} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`linear-gradient(135deg,${cat.grad[0]},${cat.grad[1]})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon size={15} color="#fff" />
            </div>
            <span style={{ fontSize:14, fontWeight:800, color:t.text, fontFamily:"'Poppins',sans-serif" }}>
              {cat.label}
              {count !== null && (
                <span style={{ marginLeft:6, fontSize:12, fontWeight:700, color:t.textMuted }}>({count})</span>
              )}
            </span>
          </button>
          <button
            onClick={onAdd}
            className="oo-icon-btn"
            style={{ background:`linear-gradient(135deg,${cat.grad[0]},${cat.grad[1]})`, border:"none", color:"#fff", width:28, height:28, borderRadius:9, boxShadow:`0 4px 12px ${cat.color}40` }}
            title={`Add ${cat.singular}`}
          >
            <Plus size={14} />
          </button>
        </div>
  
        {/* Rows */}
        <div style={{ flex:1, padding:"8px 8px 4px", display:"flex", flexDirection:"column", gap:2, minHeight:160 }}>
          {loading ? (
            <div style={{ padding:"6px" }}>
              {Array.from({ length:5 }).map((_,i) => (
                <div key={i} className="oo-shimmer-el" style={{ height:34, borderRadius:9, background:t.skeletonBg, marginBottom:6 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState t={t} icon={Icon} title={`No ${cat.label.toLowerCase()} yet`} compact onAdd={onAdd} addLabel={`Add ${cat.singular}`} />
          ) : (
            filtered.slice(0, 7).map((item, i) => (
              <OverviewRow key={item.id ?? i} t={t} isDark={isDark} cat={cat} item={item} />
            ))
          )}
        </div>
  
        {/* View all */}
        <button
          onClick={onViewAll}
          className="oo-view-all"
          style={{ color:cat.color, borderTopColor:t.border, fontSize:12, fontFamily:"'Poppins',sans-serif" }}
          onMouseEnter={(e)=>e.currentTarget.style.background=t.rowHov}
          onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}
        >
          View all {cat.label.toLowerCase()} <ArrowRight size={13} />
        </button>
      </div>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     RECENT BATCHES TABLE (overview bottom-left)
  ═══════════════════════════════════════════════════════════════════════════ */
  function RecentBatchesCard({ t, batches, loading, navigate }) {
    const statusColor = (status) => {
      const s = (status||"").toLowerCase();
      if (s==="active")   return { bg:"rgba(16,185,129,0.1)",  c:"#10b981", border:"rgba(16,185,129,0.28)" };
      if (s==="inactive") return { bg:"rgba(244,63,94,0.09)",  c:"#f43f5e", border:"rgba(244,63,94,0.24)" };
      return                     { bg:"rgba(148,163,184,0.1)", c:"#94a3b8", border:"rgba(148,163,184,0.28)" };
    };
  
    return (
      <div style={{ background:t.cardBg, border:`1px solid ${t.border}`, borderRadius:18, boxShadow:t.shadow, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px 14px", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <BarChart3 size={16} color="#fff" />
            </div>
            <span style={{ fontSize:14, fontWeight:800, color:t.text, fontFamily:"'Poppins',sans-serif" }}>Recent Batches</span>
          </div>
          <button onClick={() => navigate?.("/admin/batches")} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#f59e0b", fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>
            View all <ArrowRight size={13} />
          </button>
        </div>
        {loading ? (
          <div style={{ padding:16 }}><Skeleton t={t} rows={4} /></div>
        ) : batches.length === 0 ? (
          <div style={{ padding:32, textAlign:"center" }}>
            <p style={{ color:t.textMuted, fontSize:13 }}>No batches yet</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:480 }}>
              <thead>
                <tr style={{ background:t.theadBg }}>
                  {["Batch Name","Department","Branch","Students","Status"].map((h) => (
                    <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:9.5, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:t.textMuted, borderBottom:`1px solid ${t.border}`, fontFamily:"'Poppins',sans-serif", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batches.slice(0,5).map((b, i) => {
                  const { bg, c, border } = statusColor(b.status);
                  return (
                    <tr key={i} style={{ borderBottom: i===Math.min(batches.length,5)-1 ? "none" : `1px solid ${t.border}` }}
                      onMouseEnter={(e)=>e.currentTarget.style.background=t.rowHov}
                      onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"10px 14px", fontWeight:600, color:t.text, fontSize:12.5, fontFamily:"'Poppins',sans-serif" }}>{b.batchName}</td>
                      <td style={{ padding:"10px 14px", color:t.textSub, fontSize:12, fontFamily:"'Poppins',sans-serif" }}>{b.departmentName||b.department?.name||"—"}</td>
                      <td style={{ padding:"10px 14px", color:t.textSub, fontSize:12, fontFamily:"'Poppins',sans-serif" }}>{b.branchName||b.branch?.name||"—"}</td>
                      <td style={{ padding:"10px 14px", color:t.text, fontSize:12.5, fontWeight:700, fontFamily:"'Poppins',sans-serif" }}>{b.studentCount??b.students??"—"}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ padding:"3px 10px", borderRadius:999, fontSize:10.5, fontWeight:700, background:bg, color:c, border:`1px solid ${border}` }}>{b.status||"Unknown"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     "EVERYTHING IN ONE PLACE" PROMO CARD
  ═══════════════════════════════════════════════════════════════════════════ */
  function PromoCard({ t, isDark }) {
    return (
      <div style={{
        background: isDark
          ? "linear-gradient(135deg,#1e1b4b,#1e3a5f)"
          : "linear-gradient(135deg,#ede9fe,#dbeafe)",
        border:`1px solid ${isDark ? "rgba(139,92,246,0.3)" : "#c4b5fd"}`,
        borderRadius:18, padding:"28px 24px",
        display:"flex", flexDirection:"column", gap:16,
        boxShadow:t.shadow,
      }}>
        {/* illustration placeholder */}
        <div style={{
          width:"100%", height:120, borderRadius:12,
          background: isDark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.1)",
          display:"flex", alignItems:"center", justifyContent:"center",
          border:`1px solid ${isDark ? "rgba(139,92,246,0.2)" : "#ddd6fe"}`,
        }}>
          <TrendingUp size={44} color={isDark ? "#a78bfa" : "#7c3aed"} />
        </div>
        <div>
          <p style={{ fontSize:16, fontWeight:800, color: isDark ? "#f1f5f9" : "#1e1b4b", margin:"0 0 6px", fontFamily:"'Poppins',sans-serif" }}>
            Everything in <span style={{ color:"#7c3aed" }}>One Place</span>
          </p>
          <p style={{ fontSize:12, color: isDark ? "rgba(255,255,255,0.55)" : "#6d28d9", margin:0, lineHeight:1.6 }}>
            Manage departments, branches, batches and users seamlessly from a single dashboard.
          </p>
        </div>
        <button style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:7,
          padding:"11px 20px", borderRadius:12, border:"none",
          background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
          color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
          fontFamily:"'Poppins',sans-serif",
          boxShadow:"0 4px 14px rgba(124,58,237,0.35)",
        }}>
          Learn More <ArrowRight size={14} />
        </button>
      </div>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     SUMMARY BANNER
  ═══════════════════════════════════════════════════════════════════════════ */
  function SummaryBanner({ t, counts, lastUpdated, onRefresh, loading }) {
    const parts = CATS.map((c) => `${counts[c.id]??0} ${counts[c.id]===1 ? c.singular : c.label}`).join("  ·  ");
    return (
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, flexWrap:"wrap",
        padding:"14px 20px", borderRadius:14, background:t.bannerBg,
        border:`1px solid ${t.bannerBorder}`, marginTop:18,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Info size={16} color="#3b82f6" style={{ flexShrink:0 }} />
          <div>
            <span style={{ fontSize:13, fontWeight:800, color:t.text, fontFamily:"'Poppins',sans-serif" }}>Total Summary</span>
            <span style={{ fontSize:12, color:t.textSub, marginLeft:10, fontFamily:"'Poppins',sans-serif" }}>{parts}</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:11, color:t.textMuted, whiteSpace:"nowrap" }}>Last Updated: {lastUpdated||"—"}</span>
          <button
            onClick={onRefresh}
            className="oo-icon-btn"
            style={{ border:`1px solid ${t.actBorder}`, background:t.actBg, color:t.textSub, width:30, height:30 }}
            title="Refresh"
          >
            <RefreshCw size={13} className={loading ? "oo-spin-cls" : ""} />
          </button>
        </div>
      </div>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     ADD-NEW DROPDOWN MENU
  ═══════════════════════════════════════════════════════════════════════════ */
  function AddNewMenu({ t, onPick }) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top:0, left:0, width:210 });
    const btnRef = useRef(null);
    const menuRef = useRef(null);
  
    const computePosition = useCallback(() => {
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const menuWidth = 210;
      // Anchor to the bottom-right of the button, in fixed/viewport coordinates
      // (portaled to document.body, so no parent overflow can clip it).
      let left = rect.right - menuWidth;
      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
      let top = rect.bottom + 9;
      setCoords({ top, left, width: menuWidth });
    }, []);
  
    useEffect(() => {
      if (!open) return;
      computePosition();
      const handleOutside = (e) => {
        if (
          btnRef.current && !btnRef.current.contains(e.target) &&
          menuRef.current && !menuRef.current.contains(e.target)
        ) setOpen(false);
      };
      const handleReposition = () => computePosition();
      document.addEventListener("mousedown", handleOutside);
      window.addEventListener("resize", handleReposition);
      window.addEventListener("scroll", handleReposition, true);
      return () => {
        document.removeEventListener("mousedown", handleOutside);
        window.removeEventListener("resize", handleReposition);
        window.removeEventListener("scroll", handleReposition, true);
      };
    }, [open, computePosition]);
  
    return (
      <div style={{ position:"relative" }}>
        <button ref={btnRef} onClick={() => setOpen((p) => !p)} className="oo-btn-primary">
          <Plus size={15} /> Add New
          <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform 0.15s" }} />
        </button>
        {open && typeof document !== "undefined" && ReactDOM.createPortal(
          <div
            ref={menuRef}
            className="oo-pop"
            style={{
              position:"fixed", top:coords.top, left:coords.left, zIndex:9995,
              minWidth:coords.width, background:t.dropdownBg, border:`1px solid ${t.border}`,
              borderRadius:15, boxShadow:t.shadowHov, padding:6,
            }}
          >
            {CATS.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setOpen(false); onPick(cat.id); }}
                  className="oo-menu-item"
                  style={{ color:t.text }}
                  onMouseEnter={(e)=>e.currentTarget.style.background=t.dropdownItemHov}
                  onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{ width:26, height:26, borderRadius:8, background:`linear-gradient(135deg,${cat.grad[0]},${cat.grad[1]})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={13} color="#fff" />
                  </div>
                  Add {cat.singular}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
      </div>
    );
  }
  
  /* ═══════════════════════════════════════════════════════════════════════════
     MAIN PAGE
  ═══════════════════════════════════════════════════════════════════════════ */
  const OrganisationOverview = () => {
    const navigate  = useNavigate();
    const isDark    = useDarkMode();
    const t         = isDark ? T.dark : T.light;
  
    const [activeView, setActiveView]       = useState("overview");
    const [counts, setCounts]               = useState({ departments:null, branches:null, batches:null, users:null });
    const [preview, setPreview]             = useState({ departments:[], branches:[], batches:[], users:[] });
    const [previewLoading, setPreviewLoading] = useState(true);
    const [lastUpdated, setLastUpdated]     = useState("");
    const [overviewSearch, setOverviewSearch] = useState("");
  
    // Single source of truth for the right-hand split-view panel.
    // null = panel closed. Otherwise: { type, mode, initial, onSubmitted, ...extra }
    const [activePanel, setActivePanel] = useState(null);
  
    const loadOverview = useCallback(async () => {
      setPreviewLoading(true);
      try {
        const [dRes, bRes, btRes] = await Promise.allSettled([getDepartments(), getBranches(), getAllBatches()]);
  
        const deptList = dRes.status==="fulfilled" ? (dRes.value?.data||[]) : [];
        const branchListRaw = bRes.status==="fulfilled" ? bRes.value?.data : [];
        const branchList = Array.isArray(branchListRaw) ? branchListRaw : Array.isArray(branchListRaw?.data) ? branchListRaw.data : [];
        const batchListRaw = btRes.status==="fulfilled" ? (btRes.value?.data?.data||btRes.value?.data?.batches||btRes.value?.data||[]) : [];
        const batchList = Array.isArray(batchListRaw) ? batchListRaw : [];
  
        const deptNameById = (id) => deptList.find((d) => d.id===id||d.id===Number(id))?.name||"—";
        const branchListWithDept = branchList.map((b) => ({ ...b, _deptName:deptNameById(b.departmentId) }));
  
        let userList = [], userCount = 0;
        try {
          const role = localStorage.getItem("role");
          if (role === "TENANT_ADMIN") {
            const currentUser = JSON.parse(localStorage.getItem("lms_user")||"null");
            const orgId = currentUser?.organizationId||null;
            if (orgId) {
              const data = await userService.getUsersByOrg(orgId);
              userList = Array.isArray(data) ? data.filter((u) => u.roles==="ROLE_STUDENT"||u.roles==="ROLE_TRAINER") : [];
              userCount = userList.length;
            }
          } else {
            const res = await userService.getUsers(0, 6);
            userList = res?.data?.content||[];
            userCount = res?.data?.totalElements ?? userList.length;
          }
        } catch {}
  
        setCounts({ departments:deptList.length, branches:branchListWithDept.length, batches:batchList.length, users:userCount });
        setPreview({ departments:deptList, branches:branchListWithDept, batches:batchList, users:userList });
        setLastUpdated(new Date().toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }));
      } catch (e) { console.error("Overview load error:", e); }
      finally { setPreviewLoading(false); }
    }, []);
  
    useEffect(() => { loadOverview(); }, [loadOverview]);
  
    const activeCat     = activeView==="overview" ? null : catById(activeView);
    const headerTitle   = activeCat ? activeCat.label : "Organisation Management";
    const headerSub     = activeCat
      ? `Manage your organisation's ${activeCat.label.toLowerCase()}`
      : "Manage departments · branches · batches · users — all in one place";
  
    // Quick-add from the top "Add New" menu or an overview column's "+" button.
    const handleQuickAdd = (catId) => {
      if (catId === "departments") {
        setActivePanel({
          type:"department", mode:"create", initial:{ name:"", head:"" },
          onSubmitted: () => { loadOverview(); setActivePanel(null); },
        });
      } else if (catId === "branches") {
        setActivePanel({
          type:"branch", mode:"create", initial:{ name:"", city:"", departmentId:"" }, departments:preview.departments,
          onSubmitted: () => { loadOverview(); setActivePanel(null); },
        });
      } else if (catId === "batches") {
        setActivePanel({
          type:"batch", branches:preview.branches,
          onSubmitted: () => { loadOverview(); setActivePanel(null); },
        });
      } else {
        setActivePanel({
          type:"user", mode:"create", initial:{ displayName:"", email:"", password:"", roles:"ROLE_STUDENT" },
          onSubmitted: () => { loadOverview(); setActivePanel(null); },
        });
      }
    };
  
    // Wraps whatever the active tab passes in. `null` closes the panel.
    const handleOpenPanel = useCallback((panelConfig) => {
      setActivePanel(panelConfig);
    }, []);
  
    const closePanel = () => setActivePanel(null);
  
    const panelMeta = activePanel ? catById(
      activePanel.type === "department" ? "departments" :
      activePanel.type === "branch"     ? "branches"     :
      activePanel.type === "batch"      ? "batches"      : "users"
    ) : null;
  
    const panelTitle = activePanel
      ? (activePanel.mode === "edit" ? `Edit ${panelMeta.singular}` : `Add ${panelMeta.singular}`)
      : "";
    const panelSubtitle = activePanel
      ? (activePanel.mode === "edit"
          ? `Update ${panelMeta.singular.toLowerCase()} details`
          : `Create a new ${panelMeta.singular.toLowerCase()} for your organisation`)
      : "";
  
    const panelBody = !activePanel ? null : (
      activePanel.type === "department" ? (
        <DepartmentForm
          t={t} mode={activePanel.mode} initial={activePanel.initial}
          onCancel={closePanel} onSubmitted={activePanel.onSubmitted}
        />
      ) : activePanel.type === "branch" ? (
        <BranchForm
          t={t} mode={activePanel.mode} initial={activePanel.initial}
          departments={activePanel.departments || preview.departments}
          onCancel={closePanel} onSubmitted={activePanel.onSubmitted}
        />
      ) : activePanel.type === "batch" ? (
        <BatchForm
          t={t}
          branches={activePanel.branches || preview.branches}
          onSubmitted={activePanel.onSubmitted}
        />
      ) : activePanel.type === "user" ? (
        <UserForm
          t={t} mode={activePanel.mode} initial={activePanel.initial}
          loggedInUser={activePanel.loggedInUser}
          onSubmitted={activePanel.onSubmitted}
        />
      ) : null
    );
  
    return (
      <>
        <InjectStyles />
  
        <SplitShell
          t={t}
          isDark={isDark}
          panelOpen={!!activePanel}
          panelContent={
            <SidePanelFrame t={t} title={panelTitle} subtitle={panelSubtitle} onClose={closePanel}>
              {panelBody}
            </SidePanelFrame>
          }
        >
          <div style={{ minHeight:"100vh", background:t.pageBg, color:t.text, fontFamily:"'Poppins',sans-serif" }}>
            <div style={{ maxWidth:1440, margin:"0 auto", padding:"20px clamp(12px,3vw,28px) 60px" }}>
  
              {/* ══ HERO HEADER ══ */}
              <div className="oo-fade" style={{
                borderRadius:22, padding:"22px clamp(16px,3vw,32px)",
                background:t.heroBg, border:`1px solid ${t.borderHero}`,
                position:"relative", overflow:"hidden", marginBottom:18, boxShadow:t.shadow,
              }}>
                {/* subtle grid */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity: isDark ? 0.035 : 0.018, backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize:"40px 40px" }} />
                <div style={{ position:"absolute", top:"-40%", left:"50%", width:360, height:220, background:"radial-gradient(ellipse,rgba(99,102,241,0.09),transparent 72%)", pointerEvents:"none" }} />
  
                <div style={{ position:"relative", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
                  <div style={{ minWidth:0 }}>
                    {/* Breadcrumb */}
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10, flexWrap:"wrap" }}>
                      <Sparkles size={11} color={t.textMuted} />
                      <span style={{ fontSize:9.5, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:t.textMuted }}>Admin Portal</span>
                      <ChevronRight size={10} color={t.textMuted} />
                      <button
                        onClick={() => setActiveView("overview")}
                        style={{ fontSize:9.5, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color: activeCat ? t.textMuted : t.text, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"'Poppins',sans-serif" }}
                      >
                        Organisation Manager
                      </button>
                      {activeCat && (
                        <>
                          <ChevronRight size={10} color={t.textMuted} />
                          <span style={{ fontSize:9.5, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:activeCat.color }}>{activeCat.label}</span>
                        </>
                      )}
                    </div>
                    <h1 style={{ fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700, color:t.text, margin:"0 0 5px", lineHeight:1.15, letterSpacing:"-0.01em", fontFamily:"'Poppins',sans-serif" }}>
                      {headerTitle}
                    </h1>
                    <p style={{ fontSize:12.5, color:t.textSub, margin:0, fontWeight:500 }}>{headerSub}</p>
                  </div>
  
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                    {activeView === "overview" && (
                      <button
                        onClick={loadOverview}
                        className="oo-icon-btn"
                        style={{ border:`1px solid ${t.actBorder}`, background:t.actBg, color:t.textSub, width:40, height:40 }}
                        title="Refresh data"
                      >
                        <RefreshCw size={15} className={previewLoading ? "oo-spin-cls" : ""} />
                      </button>
                    )}
                    <AddNewMenu t={t} onPick={handleQuickAdd} />
                  </div>
                </div>
              </div>
  
              {/* ══ STAT CARDS ══ */}
              <div className="oo-fade oo-stat-grid" style={{ marginBottom:18, animationDelay:"0.05s" }}>
                {CATS.map((cat) => (
                  <StatCard
                    key={cat.id} t={t} isDark={isDark} cat={cat}
                    count={counts[cat.id]}
                    active={activeView===cat.id}
                    onClick={() => setActiveView(cat.id)}
                  />
                ))}
              </div>
  
              {/* ══ TAB NAV ══ */}
              <div className="oo-fade" style={{
                display:"flex", alignItems:"center",
                borderBottom:`1.5px solid ${t.border}`,
                marginBottom:20, gap:0, overflowX:"auto",
                animationDelay:"0.08s",
                scrollbarWidth:"none",
              }}>
                <button
                  onClick={() => setActiveView("overview")}
                  className="oo-tab"
                  style={{
                    color: activeView==="overview" ? "#3b82f6" : t.textSub,
                    fontWeight: activeView==="overview" ? 700 : 500,
                    borderBottomColor: activeView==="overview" ? "#3b82f6" : "transparent",
                  }}
                >
                  <Activity size={14} /> Overview
                </button>
                {CATS.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeView===cat.id;
                  return (
                    <button key={cat.id} onClick={() => setActiveView(cat.id)} className="oo-tab"
                      style={{ color: isActive ? cat.color : t.textSub, fontWeight: isActive ? 700 : 500, borderBottomColor: isActive ? cat.color : "transparent" }}
                    >
                      <Icon size={14} /> {cat.label}
                      {counts[cat.id] !== null && (
                        <span style={{
                          fontSize:10.5, fontWeight:700, padding:"2px 8px", borderRadius:999,
                          background: isActive ? softBg(cat,isDark) : t.pillBg,
                          color: isActive ? cat.color : t.textMuted,
                          border:`1px solid ${isActive ? cat.color+"30" : t.pillBorder}`,
                          minWidth:22, textAlign:"center",
                        }}>
                          {counts[cat.id]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
  
              {/* ══ OVERVIEW ══ */}
              {activeView === "overview" && (
                <>
                  {/* Search */}
                  <div className="oo-fade" style={{ position:"relative", maxWidth:440, marginBottom:18, animationDelay:"0.1s" }}>
                    <Search size={13} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:t.textMuted }} />
                    <input
                      value={overviewSearch} onChange={(e) => setOverviewSearch(e.target.value)}
                      placeholder="Search departments, branches, batches, users…"
                      className="oo-focusable"
                      style={{
                        width:"100%", height:42, borderRadius:12, border:`1.5px solid ${t.inputBorder}`,
                        background:t.inputBg, color:t.inputText, fontSize:12.5,
                        fontFamily:"'Poppins',sans-serif", paddingLeft:38, paddingRight:14,
                        outline:"none", boxSizing:"border-box",
                      }}
                    />
                  </div>
  
                  {/* 4-column grid */}
                  <div className="oo-fade oo-quad-grid" style={{ animationDelay:"0.12s" }}>
                    {CATS.map((cat) => (
                      <OverviewColumn
                        key={cat.id} t={t} isDark={isDark} cat={cat}
                        items={preview[cat.id]} count={counts[cat.id]}
                        loading={previewLoading} search={overviewSearch}
                        onAdd={() => handleQuickAdd(cat.id)}
                        onViewAll={() => navigate(
                          cat.id==="departments" ? "/admin/departmentlist" :
                          cat.id==="branches"    ? "/admin/branches"       :
                          cat.id==="batches"     ? "/admin/batches"        : "/admin/users"
                        )}
                        onDrill={() => setActiveView(cat.id)}
                      />
                    ))}
                  </div>
  
                  {/* Bottom row: Recent Batches + Promo */}
                  <div className="oo-fade oo-bottom-grid" style={{ animationDelay:"0.15s" }}>
                    <RecentBatchesCard t={t} batches={preview.batches} loading={previewLoading} navigate={navigate} />
                    <PromoCard t={t} isDark={isDark} />
                  </div>
  
                  {/* Summary banner */}
                  <div className="oo-fade" style={{ animationDelay:"0.18s" }}>
                    <SummaryBanner t={t} counts={counts} lastUpdated={lastUpdated} onRefresh={loadOverview} loading={previewLoading} />
                  </div>
                </>
              )}
  
              {/* ══ DRILL-DOWN ══ */}
              {activeView !== "overview" && (
                <div className="oo-fade" style={{
                  background:t.cardBg, borderRadius:20,
                  border:`1px solid ${t.border}`, boxShadow:t.shadow,
                  padding:"20px 20px 28px",
                }}>
                  {activeView === "departments" && <DepartmentsTab t={t} isDark={isDark} navigate={navigate} onOpenPanel={handleOpenPanel} />}
                  {activeView === "branches"    && <BranchesTab    t={t} isDark={isDark} navigate={navigate} onOpenPanel={handleOpenPanel} />}
                  {activeView === "batches"     && <BatchesTab     t={t} isDark={isDark} navigate={navigate} onOpenPanel={handleOpenPanel} />}
                  {activeView === "users"       && <UsersTab       t={t} isDark={isDark} navigate={navigate} onOpenPanel={handleOpenPanel} />}
                </div>
              )}
            </div>
          </div>
        </SplitShell>
      </>
    );
  };
  
  export default OrganisationOverview;