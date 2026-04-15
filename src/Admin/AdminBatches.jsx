import {
  ArrowLeft, Building2, CheckCircle2, ChevronRight,
  GitBranch, GripVertical, Layers, Plus, Search,
  Trash2, UserCheck, Users, X, Sparkles, Activity,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBatch, getAllBatches } from "../services/batchService";
import CreateBatchModal from "./CreateBatchModal";

/* ─── theme token map — same as AdminDashboard ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    barBg: "rgba(255,255,255,0.05)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    actIcon: "rgba(255,255,255,0.3)",
    actBar: "rgba(255,255,255,0.5)",
    gridLine: "rgba(255,255,255,0.5)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    liveColor: "#34d399",
    liveText: "#34d399",
    navBtnBg: "rgba(255,255,255,0.04)",
    navBtnBorder: "rgba(255,255,255,0.08)",
    navBtnColor: "#888",
    todayBg: "#ffffff",
    todayText: "#000000",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    barBg: "#f1f5f9",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    actIcon: "#94a3b8",
    actBar: "#94a3b8",
    gridLine: "rgba(0,0,0,0.12)",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    navBtnBg: "#f8fafc",
    navBtnBorder: "#e2e8f0",
    navBtnColor: "#64748b",
    todayBg: "#0f172a",
    todayText: "#ffffff",
  },
};

/* ── gradient pool ── */
const GRAD_COLORS = [
  ["#a78bfa", "#7c3aed"],
  ["#22d3ee", "#0891b2"],
  ["#f43f5e", "#be123c"],
  ["#f59e0b", "#b45309"],
  ["#34d399", "#059669"],
  ["#818cf8", "#4338ca"],
];
const gradColor = name => GRAD_COLORS[(name?.charCodeAt(0) ?? 0) % GRAD_COLORS.length];

/* ── nav tabs ── */
const TABS = [
  { label: "Departments", path: "/admin/departmentlist", icon: Building2 },
  { label: "Branches",    path: "/admin/branches",       icon: GitBranch  },
  { label: "Batches",     path: "/admin/batches",        icon: Layers     },
];

/* ── workflow steps ── */
const STEPS = [
  { icon: Layers,    label: "Create a batch"                },
  { icon: UserCheck, label: "Assign trainer to batch"       },
  { icon: Users,     label: "Assign students under trainer" },
];

/* ══ drag-and-drop hook ══ */
function useDragList(items, setItems) {
  const dragIdx = useRef(null), overIdx = useRef(null);
  const [active, setActive] = useState(null), [over, setOver] = useState(null);
  const handlers = i => ({
    draggable: true,
    onDragStart: () => { dragIdx.current = i; setActive(i); },
    onDragOver:  e  => { e.preventDefault(); overIdx.current = i; setOver(i); },
    onDrop: () => {
      const f = dragIdx.current, t = overIdx.current;
      if (f !== null && t !== null && f !== t) {
        const n = [...items]; const [m] = n.splice(f, 1); n.splice(t, 0, m); setItems(n);
      }
      dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null);
    },
    onDragEnd: () => { dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null); },
  });
  return { handlers, active, over };
}

/* ══════════ MAIN ══════════ */
const AdminBatches = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  /* ── backend state — all unchanged ── */
  const [batches, setBatches]               = useState([]);
  const [search, setSearch]                 = useState("");
  const [createdBatchId, setCreatedBatchId] = useState(null);
  const [panelOpen, setPanelOpen]           = useState(false);

  const loadBatches = async () => {
    try {
      const res  = await getAllBatches();
      const list = res?.data?.data || res?.data?.batches || res?.data || [];
      setBatches(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load batches", err);
      setBatches([]);
    }
  };

  useEffect(() => { loadBatches(); }, []);

  const filteredBatches = batches.filter(b =>
    b?.batchName?.toLowerCase().includes(search.toLowerCase())
  );

  const { handlers: dragH, active: dActive, over: dOver } = useDragList(batches, setBatches);

  const pill = {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "4px 10px", borderRadius: 999, background: t.pillBg,
    border: `1px solid ${t.pillBorder}`, color: t.pillText,
    fontFamily: "'Poppins',sans-serif",
  };

  /* ══════════ RENDER ══════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .bfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .grip-btn{opacity:0;transition:opacity 0.2s}
        .batch-row:hover .grip-btn{opacity:1}
      `}</style>

      <div style={{
        minHeight: "100vh", background: t.pageBg, color: t.text,
        fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s",
      }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: 24, paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="bfade" style={{
            borderRadius: 24, padding: "30px 36px",
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            position: "relative", overflow: "hidden",
            marginBottom: 20, boxShadow: t.shadow,
          }}>
            {/* grid overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* glow blobs */}
            <div style={{
              position: "absolute", top: "-30%", left: "40%", width: 300, height: 200,
              background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-40%", right: "10%", width: 250, height: 200,
              background: "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                {/* back + label */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <button
                    onClick={() => navigate(-1)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 14px", borderRadius: 10,
                      border: `1px solid ${t.borderHov}`,
                      background: t.actBg, color: t.textSub,
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Sparkles size={11} color={t.textSub} />
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                      textTransform: "uppercase", color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}>Admin Portal</span>
                  </div>
                </div>

                <h1 style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                  fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text,
                  margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
                }}>Batch Management</h1>
                <p style={{
                  fontSize: 12, color: t.textSub, marginTop: 7,
                  fontWeight: 500, fontFamily: "'Poppins',sans-serif",
                }}>Create batches and assign trainers &amp; students</p>
              </div>

              {/* right side badges */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 12, padding: "8px 16px",
                  fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub,
                }}>
                  <Layers size={13} color="#f59e0b" />
                  <span style={{ color: t.text, fontWeight: 700 }}>{batches.length}</span>
                  <span>Batches</span>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 10, padding: "8px 14px",
                }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>

                <div className="livebadge" style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: isDark ? "rgba(52,211,153,0.08)" : "rgba(22,163,74,0.08)",
                  border: isDark ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(22,163,74,0.3)",
                  borderRadius: 999, padding: "8px 18px",
                  color: t.liveText, fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.liveColor, display: "inline-block" }} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ ACTION BAR ═══ */}
          <div className="bfade" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            {/* Tab switcher */}
            <div style={{
              display: "flex", gap: 4, borderRadius: 14,
              background: t.cardBg, border: `1px solid ${t.border}`,
              padding: 4, boxShadow: t.shadow,
            }}>
              {TABS.map(({ label, path, icon: Icon }) => {
                const isActive = typeof location !== "undefined" && location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 16px", borderRadius: 10,
                      border: "none", cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 600,
                      background: isActive
                        ? "linear-gradient(135deg,#22d3ee,#3b82f6)"
                        : "transparent",
                      color: isActive ? "#fff" : t.textSub,
                      boxShadow: isActive ? "0 2px 8px rgba(34,211,238,0.3)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={13} /> {label}
                  </button>
                );
              })}
            </div>

            {/* Search + Create */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{
                  position: "absolute", left: 11, top: "50%",
                  transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none",
                }} />
                <input
                  placeholder="Search batches…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    paddingLeft: 34, paddingRight: 14, height: 36, width: 220,
                    borderRadius: 10, border: `1px solid ${t.border}`,
                    background: t.cardBg, color: t.text,
                    fontSize: 11, fontFamily: "'Poppins',sans-serif",
                    outline: "none", boxShadow: t.shadow,
                  }}
                />
              </div>
              <button
                onClick={() => setPanelOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 18px", borderRadius: 10,
                  background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
                  border: "none", color: "#fff",
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif",
                  boxShadow: "0 4px 14px rgba(34,211,238,0.35)",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={14} /> Create Batch
              </button>
            </div>
          </div>

          {/* ═══ WORKFLOW CARD ═══ */}
          <div className="bfade" style={{
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 20, padding: 22, marginBottom: 20, boxShadow: t.shadow,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: t.textLabel,
                fontFamily: "'Poppins',sans-serif",
              }}>How it works</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              {STEPS.map(({ icon: Icon, label }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(34,211,238,0.15))",
                      border: "1px solid rgba(34,211,238,0.25)",
                    }}>
                      <Icon size={18} color="#22d3ee" />
                    </div>
                    <div>
                      <p style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: "#22d3ee",
                        margin: 0, fontFamily: "'Poppins',sans-serif",
                      }}>Step {i + 1}</p>
                      <p style={{
                        fontSize: 12, fontWeight: 600, color: t.text,
                        margin: "3px 0 0", fontFamily: "'Poppins',sans-serif",
                      }}>{label}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={16} color={t.textMuted} style={{ marginLeft: 4 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ MAIN — batches list + inline panel ═══ */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

            {/* BATCHES CARD */}
            <div style={{
              flex: 1, minWidth: 0,
              transition: "all 0.3s",
            }}>
              <div style={{
                background: t.cardBg, border: `1px solid ${t.border}`,
                borderRadius: 20, overflow: "hidden", boxShadow: t.shadow,
              }}>
                {/* card header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 22px",
                  borderBottom: `1px solid ${t.border}`,
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                }}>
                  <div>
                    <p style={{
                      fontSize: 13, fontWeight: 700, color: t.text,
                      margin: 0, fontFamily: "'Poppins',sans-serif",
                    }}>Existing Batches</p>
                    <p style={{
                      fontSize: 10, color: t.textMuted, margin: "3px 0 0",
                      fontFamily: "'Poppins',sans-serif",
                    }}>
                      {filteredBatches.length} record{filteredBatches.length !== 1 && "s"} found
                      {batches.length > 0 && (
                        <span style={{ marginLeft: 8, color: t.textLabel }}>
                          · Drag to reorder
                        </span>
                      )}
                    </p>
                  </div>
                  <span style={pill}>All Batches</span>
                </div>

                {/* card content */}
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  {!Array.isArray(batches) || batches.length === 0 ? (
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", padding: "52px 0", gap: 12,
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
                      }}>
                        <Layers size={22} color={t.emptyIcon} />
                      </div>
                      <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
                        No batches created yet
                      </p>
                      <p style={{ fontSize: 10, color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
                        Click "Create Batch" to get started
                      </p>
                    </div>
                  ) : (
                    filteredBatches.map((b, index) => {
                      const dh         = dragH(index);
                      const isDragging = dActive === index;
                      const isOver     = dOver === index && dActive !== index;
                      const [c1, c2]   = gradColor(b.batchName);

                      return (
                        <div
                          key={b.id}
                          {...dh}
                          className="batch-row"
                          style={{
                            display: "flex", flexDirection: "row",
                            alignItems: "center", justifyContent: "space-between",
                            gap: 16, borderRadius: 16, padding: "14px 16px",
                            border: `1px solid ${isOver ? "#22d3ee" : isDragging ? t.borderHov : t.border}`,
                            background: isDragging
                              ? t.actBg
                              : isOver
                              ? (isDark ? "rgba(34,211,238,0.06)" : "rgba(34,211,238,0.04)")
                              : t.recentItemBg,
                            opacity: isDragging ? 0.5 : 1,
                            transition: "all 0.15s", cursor: "default",
                            position: "relative",
                            boxShadow: isOver ? `0 0 0 2px #22d3ee33` : "none",
                          }}
                        >
                          {/* drop indicator */}
                          {isOver && (
                            <div style={{
                              position: "absolute", top: -1, left: 24, right: 24,
                              height: 2, background: "#22d3ee", borderRadius: 99,
                            }} />
                          )}

                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {/* drag grip */}
                            <div
                              className="grip-btn"
                              style={{
                                cursor: "grab", padding: 6, borderRadius: 8,
                                background: t.actBg, flexShrink: 0,
                              }}
                            >
                              <GripVertical size={14} color={t.textMuted} />
                            </div>

                            {/* avatar */}
                            <div style={{
                              width: 42, height: 42, borderRadius: 12,
                              background: `linear-gradient(135deg,${c1},${c2})`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontWeight: 800, fontSize: 15,
                              fontFamily: "'Poppins',sans-serif",
                              boxShadow: `0 4px 12px ${c1}44`,
                              flexShrink: 0,
                            }}>
                              {b.batchName?.charAt(0)?.toUpperCase()}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <p style={{
                                fontSize: 13, fontWeight: 700, color: t.text,
                                margin: 0, fontFamily: "'Poppins',sans-serif",
                              }}>{b.batchName}</p>
                              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <span style={{
                                  display: "flex", alignItems: "center", gap: 4,
                                  fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif",
                                }}>
                                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.textMuted, display: "inline-block" }} />
                                  ID: {b.id}
                                </span>
                                <span style={{
                                  display: "flex", alignItems: "center", gap: 4,
                                  fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif",
                                }}>
                                  <GitBranch size={10} /> Branch: {b.branchId}
                                </span>
                              </div>
                              {b.trainerEmail ? (
                                <span style={{
                                  display: "flex", alignItems: "center", gap: 5,
                                  fontSize: 10, fontWeight: 600,
                                  color: isDark ? "#34d399" : "#16a34a",
                                  fontFamily: "'Poppins',sans-serif",
                                }}>
                                  <CheckCircle2 size={12} color={isDark ? "#34d399" : "#16a34a"} />
                                  {b.trainerEmail}
                                </span>
                              ) : (
                                <span style={{
                                  display: "flex", alignItems: "center", gap: 5,
                                  fontSize: 10, fontWeight: 600, color: "#f59e0b",
                                  fontFamily: "'Poppins',sans-serif",
                                }}>
                                  <span style={{
                                    width: 6, height: 6, borderRadius: "50%",
                                    background: "#f59e0b", display: "inline-block",
                                    animation: "pulse 1.5s ease infinite",
                                  }} />
                                  Trainer not assigned
                                </span>
                              )}
                            </div>
                          </div>

                          {/* action buttons — unchanged logic */}
                          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                            <button
                              onClick={() => navigate(`/admin/batches/${b.id}/assign-trainer`)}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 14px", borderRadius: 9,
                                border: "1px solid rgba(34,211,238,0.3)",
                                background: "rgba(34,211,238,0.08)",
                                color: isDark ? "#22d3ee" : "#0891b2",
                                fontSize: 11, fontWeight: 600, cursor: "pointer",
                                fontFamily: "'Poppins',sans-serif", transition: "all 0.15s",
                              }}
                            >
                              <UserCheck size={13} />
                              {b.trainerEmail ? "Manage Students" : "Assign Trainer"}
                            </button>
                            <button
                              onClick={() => navigate(`/admin/batches/${b.id}/trainers`)}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 14px", borderRadius: 9,
                                border: `1px solid ${t.border}`,
                                background: t.actBg,
                                color: t.textSub,
                                fontSize: 11, fontWeight: 600, cursor: "pointer",
                                fontFamily: "'Poppins',sans-serif", transition: "all 0.15s",
                              }}
                            >
                              <Users size={13} /> Trainers
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm("Delete this batch permanently?")) return;
                                try { await deleteBatch(b.id); loadBatches(); }
                                catch (e) { console.error("Delete failed", e); alert("Failed to delete batch"); }
                              }}
                              style={{
                                width: 34, height: 34, borderRadius: 9,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)",
                                color: "#f43f5e", cursor: "pointer", transition: "all 0.15s",
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* ═══ INLINE SLIDE PANEL ═══ */}
            <div style={{
              flexShrink: 0,
              width: panelOpen ? 384 : 0,
              opacity: panelOpen ? 1 : 0,
              pointerEvents: panelOpen ? "auto" : "none",
              overflow: "hidden",
              transition: "width 0.3s ease, opacity 0.3s ease",
            }}>
              <div style={{
                width: 384, borderRadius: 20,
                border: `1px solid ${t.border}`,
                background: t.cardBg, overflow: "hidden",
                boxShadow: t.shadowHov,
              }}>
                {/* panel header */}
                <div style={{
                  background: "linear-gradient(135deg,#1a56db,#06b6d4)",
                  padding: "18px 20px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: "rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Plus size={16} color="#fff" />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Poppins',sans-serif" }}>New Batch</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>Fill in the batch details</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPanelOpen(false)}
                      style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "rgba(255,255,255,0.15)",
                        border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                    >
                      <X size={14} color="#fff" />
                    </button>
                  </div>

                  {/* step bar */}
                  <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                    {["Batch Info", "Assign Trainer", "Add Students"].map((step, i) => (
                      <div
                        key={step}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "6px 10px", borderRadius: 8,
                          background: i === 0 ? "rgba(255,255,255,0.2)" : "transparent",
                          color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)",
                          fontSize: 10, fontWeight: 600,
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 800,
                          background: i === 0 ? "#fff" : "rgba(255,255,255,0.2)",
                          color: i === 0 ? "#1a56db" : "rgba(255,255,255,0.6)",
                          flexShrink: 0,
                        }}>{i + 1}</div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* panel body */}
                <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 280px)" }}>
                  <CreateBatchModal
                    inline
                    onClose={() => setPanelOpen(false)}
                    onSuccess={newBatch => {
                      setPanelOpen(false);
                      setCreatedBatchId(newBatch.id);
                      loadBatches();
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBatches;