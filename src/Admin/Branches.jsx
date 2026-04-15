import {
  ArrowLeft, Building2, ChevronRight, GitBranch, GripVertical,
  Layers, MapPin, Pencil, Plus, Search, Trash2, Users, X, Sparkles, Activity,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createBranch, deleteBranch, getBranches, updateBranch } from "../services/batchService";

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
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    inputText: "#ffffff",
    skeletonBg: "rgba(255,255,255,0.07)",
    theadBg: "rgba(255,255,255,0.03)",
    rowHov: "rgba(34,211,238,0.04)",
    rowOver: "rgba(34,211,238,0.07)",
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
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    skeletonBg: "#e2e8f0",
    theadBg: "rgba(0,0,0,0.02)",
    rowHov: "rgba(34,211,238,0.04)",
    rowOver: "rgba(34,211,238,0.07)",
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

/* ══ drag list hook ══ */
function useDragList(items, setItems) {
  const dragIdx = useRef(null), overIdx = useRef(null);
  const [active, setActive] = useState(null), [over, setOver] = useState(null);
  const handlers = i => ({
    draggable: true,
    onDragStart: () => { dragIdx.current = i; setActive(i); },
    onDragOver:  e  => { e.preventDefault(); overIdx.current = i; setOver(i); },
    onDrop: () => {
      const f = dragIdx.current, tv = overIdx.current;
      if (f !== null && tv !== null && f !== tv) {
        const n = [...items]; const [m] = n.splice(f, 1); n.splice(tv, 0, m); setItems(n);
      }
      dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null);
    },
    onDragEnd: () => { dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null); },
  });
  return { handlers, active, over };
}

/* ══════════ MAIN ══════════ */
const Branches = () => {
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

  /* ── backend state (all unchanged) ── */
  const [branches, setBranches]   = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({ name: "", city: "" });
  const [panelOpen, setPanelOpen] = useState(false);
  const [locationOptions, setLocationOptions] = useState([
    "Delhi","Mumbai","Kolkata","Chennai","Bangalore","Hyderabad","Pune",
    "Ahmedabad","Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore",
    "Bhopal","Patna","Ranchi","Raipur","Chandigarh","Noida","Gurgaon",
    "Faridabad","Ghaziabad","Meerut","Agra","Varanasi","Prayagraj",
    "Gwalior","Jabalpur","Udaipur","Jodhpur","Amritsar","Ludhiana",
    "Dehradun","Shimla","Srinagar","Jammu","Thiruvananthapuram","Kochi",
    "Coimbatore","Madurai","Mysore","Mangalore","Visakhapatnam","Vijayawada",
    "Tirupati","Bhubaneswar","Cuttack","Guwahati","Silchar","Imphal",
    "Aizawl","Shillong","Gangtok","Itanagar","Panaji",
  ]);

  useEffect(() => { loadBranches(); }, []);

  const loadBranches = async () => {
    try {
      const res  = await getBranches();
      const data = res?.data;
      if      (Array.isArray(data))       setBranches(data);
      else if (Array.isArray(data?.data)) setBranches(data.data);
      else                                setBranches([]);
    } catch (e) { console.error("Failed to load branches", e); setBranches([]); }
    finally { setLoading(false); }
  };

  const filtered = Array.isArray(branches)
    ? branches.filter(b => b?.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const resetPanel = () => { setPanelOpen(false); setEditingId(null); setForm({ name: "", city: "" }); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim()) return;
    try {
      editingId ? await updateBranch(editingId, form) : await createBranch(form);
      resetPanel(); loadBranches();
    } catch (e) { console.error("Save failed", e); }
  };

  const handleEdit = branch => {
    setEditingId(branch.id); setForm({ name: branch.name, city: branch.city }); setPanelOpen(true);
  };

  const handleDelete = async branch => {
    if (!confirm(`Delete branch "${branch.name}"?\nAll batches will also be removed.`)) return;
    try { await deleteBranch(branch.id); loadBranches(); }
    catch (e) { console.error("Delete failed", e); alert("Failed to delete branch"); }
  };

  const { handlers: dragH, active: dActive, over: dOver } = useDragList(branches, setBranches);

  const pill = {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "4px 10px", borderRadius: 999, background: t.pillBg,
    border: `1px solid ${t.pillBorder}`, color: t.pillText,
    fontFamily: "'Poppins',sans-serif",
  };

  const inputStyle = {
    width: "100%", height: 38, borderRadius: 10,
    border: `1px solid ${t.inputBorder}`,
    background: t.inputBg, color: t.inputText,
    fontSize: 12, fontFamily: "'Poppins',sans-serif",
    padding: "0 12px", outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: t.textMuted,
    fontFamily: "'Poppins',sans-serif",
    display: "flex", alignItems: "center", gap: 5, marginBottom: 6,
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
        @keyframes shimmer{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}
        .skeleton{animation:shimmer 1.5s ease infinite}
        .grip-btn{opacity:0;transition:opacity 0.2s}
        .branch-row:hover .grip-btn{opacity:1}
        .branch-row:hover .row-actions{opacity:1}
        .row-actions{opacity:0;transition:opacity 0.2s}
        .branch-row:hover .branch-name{color:#22d3ee}
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
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
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
                }}>Branch Management</h1>
                <p style={{
                  fontSize: 12, color: t.textSub, marginTop: 7,
                  fontWeight: 500, fontFamily: "'Poppins',sans-serif",
                }}>Manage organisation branches &amp; locations</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 12, padding: "8px 16px",
                  fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub,
                }}>
                  <GitBranch size={13} color="#22d3ee" />
                  <span style={{ color: t.text, fontWeight: 700 }}>{branches.length}</span>
                  <span>Branches</span>
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
            <div style={{
              display: "flex", gap: 4, borderRadius: 14,
              background: t.cardBg, border: `1px solid ${t.border}`,
              padding: 4, boxShadow: t.shadow,
            }}>
              {TABS.map(({ label, path, icon: Icon }) => {
                const isActive = typeof location !== "undefined" && location.pathname === path;
                return (
                  <button key={path} onClick={() => navigate(path)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 16px", borderRadius: 10,
                    border: "none", cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 600,
                    background: isActive ? "linear-gradient(135deg,#22d3ee,#3b82f6)" : "transparent",
                    color: isActive ? "#fff" : t.textSub,
                    boxShadow: isActive ? "0 2px 8px rgba(34,211,238,0.3)" : "none",
                    transition: "all 0.2s",
                  }}>
                    <Icon size={13} /> {label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{
                  position: "absolute", left: 11, top: "50%",
                  transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none",
                }} />
                <input
                  placeholder="Search branches…"
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
                onClick={() => { resetPanel(); setPanelOpen(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 18px", borderRadius: 10,
                  background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
                  border: "none", color: "#fff",
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif",
                  boxShadow: "0 4px 14px rgba(34,211,238,0.35)",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
              >
                <Plus size={14} /> Add Branch
              </button>
            </div>
          </div>

          {/* ═══ MAIN — table + inline panel ═══ */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

            {/* TABLE CARD */}
            <div style={{ flex: 1, minWidth: 0, transition: "all 0.3s" }}>
              <div style={{
                background: t.cardBg, border: `1px solid ${t.border}`,
                borderRadius: 20, overflow: "hidden", boxShadow: t.shadow,
              }}>
                {/* card header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 22px", borderBottom: `1px solid ${t.border}`,
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                      All Branches
                    </p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                      {filtered.length} record{filtered.length !== 1 && "s"} found
                      {branches.length > 0 && (
                        <span style={{ marginLeft: 8, color: t.textLabel }}>· Drag to reorder</span>
                      )}
                    </p>
                  </div>
                  <span style={pill}>All Branches</span>
                </div>

                {/* table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.border}` }}>
                        {["", "#", "Branch", "City", "Students", "Actions"].map((h, i) => (
                          <th key={i} style={{
                            padding: i === 0 ? "12px 8px 12px 18px" : "12px 16px",
                            textAlign: i === 5 ? "right" : "left",
                            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                            textTransform: "uppercase", color: t.textMuted,
                            fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [1, 2, 3].map(i => (
                          <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                            {[8, 24, 140, 80, 64, 40].map((w, j) => (
                              <td key={j} style={{ padding: "14px 16px" }}>
                                <div className="skeleton" style={{ height: 10, width: w, borderRadius: 5, background: t.skeletonBg }} />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6}>
                            <div style={{
                              display: "flex", flexDirection: "column", alignItems: "center",
                              justifyContent: "center", padding: "52px 0", gap: 12,
                            }}>
                              <div style={{
                                width: 52, height: 52, borderRadius: 14,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
                              }}>
                                <GitBranch size={22} color={t.emptyIcon} />
                              </div>
                              <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
                                No branches yet
                              </p>
                              <p style={{ fontSize: 10, color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
                                Click "Add Branch" to get started
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((b, index) => {
                          const dh         = dragH(index);
                          const isDragging = dActive === index;
                          const isOver     = dOver === index && dActive !== index;
                          const [c1, c2]   = gradColor(b.name);

                          return (
                            <tr
                              key={b.id}
                              {...dh}
                              className="branch-row"
                              style={{
                                borderBottom: `1px solid ${t.border}`,
                                background: isDragging
                                  ? t.actBg
                                  : isOver ? t.rowOver : "transparent",
                                opacity: isDragging ? 0.5 : 1,
                                transition: "background 0.15s",
                                cursor: "default",
                                position: "relative",
                                outline: isOver ? `2px solid #22d3ee` : "none",
                                outlineOffset: -1,
                              }}
                            >
                              {/* grip */}
                              <td style={{ padding: "14px 8px 14px 18px", width: 32 }}>
                                <div className="grip-btn" style={{
                                  cursor: "grab", padding: 5, borderRadius: 7,
                                  background: t.actBg, display: "inline-flex",
                                }}>
                                  <GripVertical size={13} color={t.textMuted} />
                                </div>
                              </td>

                              {/* index */}
                              <td style={{ padding: "14px 16px", width: 40 }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                              </td>

                              {/* name */}
                              <td style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: `linear-gradient(135deg,${c1},${c2})`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 800, fontSize: 14,
                                    fontFamily: "'Poppins',sans-serif",
                                    boxShadow: `0 3px 10px ${c1}44`, flexShrink: 0,
                                  }}>
                                    {b.name?.charAt(0)?.toUpperCase()}
                                  </div>
                                  <span className="branch-name" style={{
                                    fontSize: 12, fontWeight: 700, color: t.text,
                                    fontFamily: "'Poppins',sans-serif",
                                    transition: "color 0.15s",
                                  }}>{b.name}</span>
                                </div>
                              </td>

                              {/* city */}
                              <td style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <MapPin size={12} color="#22d3ee" />
                                  <span style={{
                                    display: "inline-flex", alignItems: "center",
                                    padding: "3px 10px", borderRadius: 999,
                                    background: "rgba(34,211,238,0.08)",
                                    border: "1px solid rgba(34,211,238,0.2)",
                                    fontSize: 10, fontWeight: 600,
                                    color: isDark ? "#22d3ee" : "#0891b2",
                                    fontFamily: "'Poppins',sans-serif",
                                  }}>{b.city}</span>
                                </div>
                              </td>

                              {/* students */}
                              <td style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <Users size={12} color={t.textMuted} />
                                  <span style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                                    0 Students
                                  </span>
                                </div>
                              </td>

                              {/* actions */}
                              <td style={{ padding: "14px 22px 14px 16px", textAlign: "right" }}>
                                <div className="row-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                                  <button
                                    onClick={() => handleEdit(b)}
                                    style={{
                                      width: 32, height: 32, borderRadius: 8,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      background: "rgba(34,211,238,0.08)",
                                      border: "1px solid rgba(34,211,238,0.2)",
                                      color: isDark ? "#22d3ee" : "#0891b2",
                                      cursor: "pointer", transition: "all 0.15s",
                                    }}
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(b)}
                                    style={{
                                      width: 32, height: 32, borderRadius: 8,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      background: "rgba(244,63,94,0.08)",
                                      border: "1px solid rgba(244,63,94,0.2)",
                                      color: "#f43f5e",
                                      cursor: "pointer", transition: "all 0.15s",
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ═══ INLINE SLIDE PANEL ═══ */}
            <div style={{
              flexShrink: 0,
              width: panelOpen ? 340 : 0,
              opacity: panelOpen ? 1 : 0,
              pointerEvents: panelOpen ? "auto" : "none",
              overflow: "hidden",
              transition: "width 0.3s ease, opacity 0.3s ease",
            }}>
              <div style={{
                width: 340, borderRadius: 20,
                border: `1px solid ${t.border}`,
                background: t.cardBg, overflow: "hidden",
                boxShadow: t.shadowHov,
              }}>
                {/* panel header */}
                <div style={{ background: "linear-gradient(135deg,#1a56db,#06b6d4)", padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: "rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {editingId ? <Pencil size={15} color="#fff" /> : <Plus size={15} color="#fff" />}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                          {editingId ? "Edit Branch" : "New Branch"}
                        </p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                          Fill in the details below
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetPanel}
                      style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "rgba(255,255,255,0.15)", border: "none",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <X size={14} color="#fff" />
                    </button>
                  </div>

                  {/* step bar */}
                  <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                    {["Branch Info", "Location"].map((step, i) => (
                      <div key={step} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 10px", borderRadius: 8,
                        background: i === 0 ? "rgba(255,255,255,0.2)" : "transparent",
                        color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)",
                        fontSize: 10, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                      }}>
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
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* branch name */}
                  <div>
                    <label style={labelStyle}>
                      <GitBranch size={11} /> Branch Name *
                    </label>
                    <input
                      placeholder="e.g. North Campus"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>

                  {/* city */}
                  <div>
                    <label style={labelStyle}>
                      <MapPin size={11} /> City / Location *
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <select
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        style={{ ...inputStyle, flex: 1 }}
                      >
                        <option value="">Select City</option>
                        {locationOptions.map((city, i) => (
                          <option key={i} value={city}>{city}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const newCity = prompt("Enter new location");
                          if (!newCity) return;
                          if (!locationOptions.includes(newCity)) setLocationOptions(p => [...p, newCity]);
                          setForm(f => ({ ...f, city: newCity }));
                        }}
                        style={{
                          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                          border: `1px solid ${t.inputBorder}`,
                          background: t.inputBg, color: t.textMuted,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* live preview */}
                  {form.name && form.city && (() => {
                    const [pc1, pc2] = gradColor(form.name);
                    return (
                      <div style={{
                        borderRadius: 12,
                        border: "1px solid rgba(34,211,238,0.2)",
                        background: isDark ? "rgba(34,211,238,0.05)" : "rgba(34,211,238,0.04)",
                        padding: 14,
                      }}>
                        <p style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                          textTransform: "uppercase", color: "#22d3ee",
                          fontFamily: "'Poppins',sans-serif", margin: "0 0 10px",
                        }}>Preview</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `linear-gradient(135deg,${pc1},${pc2})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 800, fontSize: 14,
                            fontFamily: "'Poppins',sans-serif",
                            boxShadow: `0 3px 10px ${pc1}44`, flexShrink: 0,
                          }}>
                            {form.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                              {form.name}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                              <MapPin size={10} color="#22d3ee" />
                              <span style={{ fontSize: 10, color: isDark ? "#22d3ee" : "#0891b2", fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
                                {form.city}
                              </span>
                            </div>
                          </div>
                          <span style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "3px 10px", borderRadius: 999,
                            background: "rgba(52,211,153,0.1)",
                            border: "1px solid rgba(52,211,153,0.25)",
                            fontSize: 9, fontWeight: 700,
                            color: isDark ? "#34d399" : "#16a34a",
                            fontFamily: "'Poppins',sans-serif",
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: isDark ? "#34d399" : "#16a34a", display: "inline-block" }} />
                            Active
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* panel footer */}
                <div style={{
                  borderTop: `1px solid ${t.border}`,
                  padding: "14px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <button
                    onClick={resetPanel}
                    style={{
                      padding: "8px 18px", borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.actBg, color: t.textSub,
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 20px", borderRadius: 10,
                      background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
                      border: "none", color: "#fff",
                      fontSize: 11, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                      boxShadow: "0 4px 14px rgba(34,211,238,0.35)",
                    }}
                  >
                    {editingId ? "Save Changes" : "Add Branch"} <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Branches;