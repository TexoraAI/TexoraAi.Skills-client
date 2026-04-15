import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteAssignment,
  getTrainerAssignments,
} from "@/services/assessmentService";

import {
  Calendar, Pencil, Plus, Trash2, ClipboardList,
  Eye, Sparkles, Activity,
} from "lucide-react";

/* ─── Design tokens — matched to Trainer Dashboard screenshot ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.35)", textMuted: "rgba(255,255,255,0.22)",
    actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)", actBar: "rgba(255,255,255,0.5)",
    gridLine: "rgba(255,255,255,0.5)", shadow: "0 4px 20px rgba(0,0,0,0.4)",
    skeletonBg: "rgba(255,255,255,0.07)", emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)",
    liveColor: "#34d399", liveText: "#34d399",
    cardHov: "#161616",
  },
  light: {
    pageBg: "#f0f4ff",          /* matches screenshot bg */
    cardBg: "#ffffff",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    actBar: "#94a3b8",
    gridLine: "rgba(0,0,0,0.12)",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    skeletonBg: "#e2e8f0",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    cardHov: "#f8fafc",
  },
};

/* ─── Accent colours ─── */
const CYAN   = "#22d3ee";
const ORANGE = "#fb923c";
const RED    = "#f87171";
const GREEN  = "#34d399";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  /* ── theme detection ── */
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      )
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  /* ── data ── */
  useEffect(() => { loadAssignments(); }, []);

  const loadAssignments = async () => {
    try {
      const res = await getTrainerAssignments();
      setAssignments(res.data);
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteAssignment(id);
      loadAssignments();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* ── skeleton cards ── */
  const SkeletonCard = () => (
    <div style={{
      background: t.cardBg, borderRadius: 20,
      border: `1px solid ${t.border}`,
      padding: 22, display: "flex", flexDirection: "column", gap: 14,
      boxShadow: t.shadow, animation: "shimmer 1.5s ease infinite",
    }}>
      {[80, 55, 40, 30].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 16 : 10, width: `${w}%`, borderRadius: 6, background: t.skeletonBg }} />
      ))}
    </div>
  );

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shimmer { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        @keyframes blink   { 0%,100% { opacity:1 } 50% { opacity:.15 } }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(52,211,153,.5) }
          70%  { box-shadow: 0 0 0 8px rgba(52,211,153,0)  }
          100% { box-shadow: 0 0 0 0   rgba(52,211,153,0)  }
        }
        .ma-fade    { animation: fadeUp .45s ease both }
        .ma-live    { animation: pulse-ring 2.2s ease-out infinite }
        .d1 { animation: blink 1.6s ease infinite }
        .d2 { animation: blink 1.6s .3s ease infinite }
        .d3 { animation: blink 1.6s .6s ease infinite }

        .ma-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 22px;
          display: flex; flex-direction: column; gap: 14px;
          box-shadow: var(--card-shadow);
          transition: box-shadow .2s, border-color .2s, transform .2s;
          font-family: 'Poppins', sans-serif;
          position: relative; overflow: hidden;
        }
        .ma-card:hover {
          box-shadow: 0 8px 32px rgba(34,211,238,.12), 0 2px 8px rgba(0,0,0,.06);
          border-color: rgba(34,211,238,.35);
          transform: translateY(-2px);
        }
        .ma-card:hover .ma-card-glow { opacity: 1 !important; }

        .ma-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all .18s; font-family: 'Poppins', sans-serif;
          border: none; white-space: nowrap;
        }
        .ma-btn:active { transform: scale(.97); }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: t.pageBg,
        color: t.text,
        fontFamily: "'Poppins', sans-serif",
        transition: "background .3s, color .3s",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 52px" }}>

          {/* ═══════════════ HERO ═══════════════ */}
          <div className="ma-fade" style={{
            borderRadius: 24, padding: "28px 32px",
            background: t.heroBg,
            border: `1px solid ${isDark ? T.dark.border : "#e2e8f0"}`,
            position: "relative", overflow: "hidden",
            marginBottom: 20,
            boxShadow: isDark ? T.dark.shadow : "0 1px 8px rgba(0,0,0,.07)",
          }}>
            {/* grid overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: isDark ? .04 : .025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),
                                linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* cyan glow */}
            <div style={{
              position: "absolute", top: "-30%", left: "42%",
              width: 300, height: 200,
              background: `radial-gradient(ellipse,${CYAN}0a,transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative", display: "flex",
              alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 16,
            }}>
              {/* left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: ".22em",
                    textTransform: "uppercase", color: t.textSub,
                  }}>Overview</span>
                </div>

                <h1 style={{
                  fontFamily: "'Poppins', sans-serif", fontWeight: 900,
                  fontSize: "clamp(1.6rem,3vw,2.2rem)", color: t.text,
                  margin: 0, lineHeight: 1.1, letterSpacing: "-.02em",
                }}>My Assignments</h1>

                <p style={{ fontSize: 13, color: t.textSub, marginTop: 6, fontWeight: 500 }}>
                  Manage your created assignments
                </p>
              </div>

              {/* right — badges + create button */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* count badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 12, padding: "8px 16px",
                  fontSize: 11, fontWeight: 600, color: t.textSub,
                }}>
                  <ClipboardList size={13} color={CYAN} />
                  <span style={{ color: t.text, fontWeight: 700 }}>{assignments.length}</span>
                  <span>Assignments</span>
                </div>

                {/* activity bars */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 10, padding: "8px 12px",
                }}>
                  <Activity size={12} color={t.actBar} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7,  borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>

                {/* LIVE */}
                <div className="ma-live" style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: isDark ? "rgba(52,211,153,.08)" : "rgba(22,163,74,.08)",
                  border: isDark ? "1px solid rgba(52,211,153,.3)" : "1px solid rgba(22,163,74,.3)",
                  borderRadius: 999, padding: "8px 18px",
                  color: t.liveText, fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.liveColor, display: "inline-block" }} />
                  LIVE
                </div>

                {/* Create button */}
                <button
                  className="ma-btn"
                  onClick={() => navigate("/trainer/create-assignments")}
                  style={{
                    background: `linear-gradient(135deg,${CYAN},#3b82f6)`,
                    color: "#fff",
                    padding: "9px 20px",
                    borderRadius: 11,
                    fontSize: 12,
                    boxShadow: `0 4px 14px ${CYAN}44`,
                  }}
                >
                  <Plus size={14} /> Create New
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════ LOADING ═══════════════ */}
          {loading && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18,
            }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ═══════════════ EMPTY STATE ═══════════════ */}
          {!loading && assignments.length === 0 && (
            <div className="ma-fade" style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "72px 24px", gap: 14,
              background: t.cardBg, borderRadius: 20,
              border: `1.5px dashed ${t.emptyBorder}`,
              boxShadow: t.shadow,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${CYAN}12`,
                border: `1px solid ${CYAN}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ClipboardList size={24} color={CYAN} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0 }}>
                No assignments yet
              </p>
              <p style={{ fontSize: 12, color: t.textMuted, margin: 0, textAlign: "center" }}>
                Click "Create New" to add your first assignment
              </p>
              <button
                className="ma-btn"
                onClick={() => navigate("/trainer/create-assignments")}
                style={{
                  background: `linear-gradient(135deg,${CYAN},#3b82f6)`,
                  color: "#fff", marginTop: 4,
                  boxShadow: `0 4px 14px ${CYAN}44`,
                }}
              >
                <Plus size={14} /> Create Assignment
              </button>
            </div>
          )}

          {/* ═══════════════ CARDS GRID ═══════════════ */}
          {!loading && assignments.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18,
            }}>
              {assignments.map((a, idx) => {
                const isExpired = new Date(a.deadline) < new Date();

                return (
                  <div
                    key={a.id}
                    className="ma-card ma-fade"
                    style={{
                      "--card-bg":     t.cardBg,
                      "--card-border": t.border,
                      "--card-shadow": t.shadow,
                      animationDelay:  `${idx * 60}ms`,
                    }}
                  >
                    {/* hover glow */}
                    <div className="ma-card-glow" style={{
                      position: "absolute", top: -20, right: -20,
                      width: 100, height: 100, borderRadius: "50%",
                      background: CYAN, filter: "blur(40px)",
                      opacity: 0, transition: "opacity .4s", pointerEvents: "none",
                    }} />

                    {/* ── top accent line ── */}
                    <div style={{
                      position: "absolute", top: 0, left: 20, right: 20, height: 2,
                      background: isExpired
                        ? `linear-gradient(90deg,${RED},transparent)`
                        : `linear-gradient(90deg,${CYAN},transparent)`,
                      borderRadius: "0 0 99px 99px",
                    }} />

                    {/* Title + Status badge */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, paddingTop: 4 }}>
                      <h2 style={{
                        fontSize: 14, fontWeight: 700, color: t.text,
                        margin: 0, lineHeight: 1.35, flex: 1,
                      }}>
                        {a.title}
                      </h2>

                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 10px", borderRadius: 999, flexShrink: 0,
                        fontSize: 10, fontWeight: 700,
                        background: isExpired ? `${RED}14`   : `${GREEN}14`,
                        border:     isExpired ? `1px solid ${RED}33`  : `1px solid ${GREEN}33`,
                        color:      isExpired ? RED : (isDark ? GREEN : "#16a34a"),
                      }}>
                        {!isExpired && (
                          <span style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: isDark ? GREEN : "#16a34a",
                            display: "inline-block",
                            animation: "blink 1.6s ease infinite",
                          }} />
                        )}
                        {isExpired ? "Expired" : "Active"}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: 12, color: t.textSub, margin: 0,
                      lineHeight: 1.6, overflow: "hidden",
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {a.description}
                    </p>

                    {/* Meta row */}
                    <div style={{
                      display: "flex", flexDirection: "column", gap: 6,
                      padding: "10px 12px", borderRadius: 10,
                      background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                      border: `1px solid ${t.border}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: t.textSub }}>
                        <Calendar size={12} color={CYAN} />
                        {new Date(a.deadline).toLocaleString()}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: t.textSub }}>
                        <span style={{
                          width: 12, height: 12, borderRadius: 3,
                          background: `${ORANGE}20`, border: `1px solid ${ORANGE}40`,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 8, fontWeight: 800, color: ORANGE,
                        }}>M</span>
                        <span>
                          <strong style={{ color: t.text, fontWeight: 700 }}>{a.maxMarks}</strong>
                          &nbsp;Marks
                        </span>
                      </div>
                    </div>

                    {/* separator */}
                    <div style={{ height: 1, background: t.border }} />

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Edit + Delete row */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="ma-btn"
                          style={{
                            flex: 1,
                            background: isDark ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.07)",
                            border: `1px solid ${CYAN}33`,
                            color: isDark ? CYAN : "#0891b2",
                          }}
                          onClick={() => navigate(`/trainer/edit-assignment/${a.id}`)}
                        >
                          <Pencil size={13} /> Edit
                        </button>

                        <button
                          className="ma-btn"
                          style={{
                            flex: 1,
                            background: `${RED}10`,
                            border: `1px solid ${RED}30`,
                            color: RED,
                          }}
                          onClick={() => handleDelete(a.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>

                      {/* View Submissions */}
                      <button
                        className="ma-btn"
                        style={{
                          width: "100%",
                          background: `linear-gradient(135deg,${CYAN},#3b82f6)`,
                          color: "#fff",
                          fontSize: 12,
                          padding: "10px 16px",
                          boxShadow: `0 4px 14px ${CYAN}33`,
                        }}
                        onClick={() => navigate(`/trainer/submissions/${a.id}`)}
                      >
                        <Eye size={14} /> View Submissions
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}