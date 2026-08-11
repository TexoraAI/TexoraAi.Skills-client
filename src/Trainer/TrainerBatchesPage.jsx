
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getTrainerBatches } from "../services/batchService";
// import { ChevronDown, ChevronUp, Users, BookOpen, Hash } from "lucide-react";

// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

// :root {
//   --bg: #f1f5f9;
//   --card: #ffffff;
//   --tx: #0f172a;
//   --mu: #64748b;
//   --bd: #e2e8f0;
//   --c1: #22d3ee;
//   --sh: 0 4px 24px rgba(0,0,0,0.06);
//   --shl: 0 8px 40px rgba(0,0,0,0.10);
//   --r: 20px;
// }
// .tb-dk {
//   --bg: #0a0a0a;
//   --card: #111111;
//   --tx: #ffffff;
//   --mu: #94a3b8;
//   --bd: rgba(255,255,255,0.06);
//   --sh: 0 4px 24px rgba(0,0,0,0.40);
//   --shl: 0 8px 40px rgba(0,0,0,0.60);
// }

// /* ── Base: full page, no centering ── */
// .tb {
//   font-family: 'Poppins', sans-serif;
//   min-height: 100vh;
//   width: 100%;
//   background: var(--bg);
//   color: var(--tx);
//   padding: 16px;
//   box-sizing: border-box;
//   /* Remove any inherited centering */
//   display: block;
//   margin: 0;
// }

// /* Inner wrapper stretches full width with padding */
// .tb-in {
//   width: 100%;
//   max-width: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
//   box-sizing: border-box;
// }

// /* ── Hero Header ── */
// .tb-hdr {
//   background: var(--card);
//   border: 1px solid var(--bd);
//   border-radius: var(--r);
//   padding: 24px 20px;
//   box-shadow: var(--sh);
//   display: flex;
//   align-items: flex-start;
//   gap: 16px;
//   position: relative;
//   overflow: hidden;
//   width: 100%;
//   box-sizing: border-box;
// }
// .tb-hdr::before {
//   content: '';
//   position: absolute;
//   inset: 0;
//   background: linear-gradient(135deg, rgba(34,211,238,0.04) 0%, transparent 60%);
//   pointer-events: none;
// }
// .tb-hdr::after {
//   content: '';
//   position: absolute;
//   top: -40px; right: -40px;
//   width: 160px; height: 160px;
//   background: radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%);
//   pointer-events: none;
// }
// .tb-ico {
//   width: 48px; height: 48px;
//   border-radius: 14px;
//   background: rgba(34,211,238,.10);
//   border: 1px solid rgba(34,211,238,.20);
//   display: flex; align-items: center; justify-content: center;
//   color: var(--c1);
//   flex-shrink: 0;
// }
// .tb-bdg {
//   display: inline-flex; align-items: center; gap: 5px;
//   padding: 3px 10px;
//   border-radius: 50px;
//   border: 1px solid var(--bd);
//   background: rgba(34,211,238,.07);
//   color: var(--c1);
//   font-size: 9px; font-weight: 700;
//   letter-spacing: .10em;
//   text-transform: uppercase;
//   margin-bottom: 8px;
// }

// /* ── GRADIENT TITLE ── */
// .tb-h1 {
//   font-size: clamp(1.5rem, 4vw, 2.2rem);
//   font-weight: 800;
//   margin: 0 0 4px;
//   line-height: 1.1;
//   letter-spacing: -0.02em;
//   color: var(--tx);
// }
// .tb-h1-plain { color: var(--tx); }
// .tb-h1-grad {
//   background: linear-gradient(135deg, #a78bfa, #22d3ee);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   background-clip: text;
// }

// .tb-sub { font-size: 12px; color: var(--mu); margin: 0; }

// /* count pill */
// .tb-count {
//   margin-left: auto;
//   flex-shrink: 0;
//   display: flex; align-items: center; gap: 6px;
//   padding: 8px 14px;
//   border-radius: 12px;
//   border: 1px solid var(--bd);
//   background: rgba(34,211,238,.06);
//   font-size: 13px; font-weight: 700;
//   color: var(--c1);
//   white-space: nowrap;
//   align-self: center;
// }

// /* ── Batch list ── */
// .tb-list {
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   width: 100%;
// }
// .tb-card {
//   background: var(--card);
//   border: 1px solid var(--bd);
//   border-radius: var(--r);
//   overflow: hidden;
//   box-shadow: var(--sh);
//   transition: box-shadow .2s, border-color .2s;
//   width: 100%;
//   box-sizing: border-box;
// }
// .tb-card:hover { box-shadow: var(--shl); border-color: rgba(34,211,238,.22); }

// .tb-row {
//   display: flex; align-items: center;
//   justify-content: space-between;
//   padding: 16px 20px;
//   cursor: pointer; user-select: none;
//   transition: background .15s;
//   gap: 12px;
//   width: 100%;
//   box-sizing: border-box;
// }
// .tb-row:hover { background: rgba(34,211,238,.03); }
// .tb-row.open { background: rgba(34,211,238,.05); }

// .tb-rl { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
// .tb-bico {
//   width: 40px; height: 40px;
//   border-radius: 12px;
//   background: rgba(34,211,238,.10);
//   border: 1px solid rgba(34,211,238,.15);
//   display: flex; align-items: center; justify-content: center;
//   color: var(--c1);
//   flex-shrink: 0;
// }
// .tb-bname {
//   font-size: 14px; font-weight: 700;
//   color: var(--tx); margin: 0 0 3px;
//   white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
// }
// .tb-bid { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--mu); }
// .tb-chev { color: var(--mu); flex-shrink: 0; }

// /* Expand panel */
// .tb-exp {
//   padding: 14px 20px;
//   border-top: 1px solid var(--bd);
//   display: flex; align-items: center;
//   justify-content: space-between;
//   gap: 12px;
//   flex-wrap: wrap;
//   background: rgba(34,211,238,.025);
//   width: 100%;
//   box-sizing: border-box;
// }
// .tb-etxt { font-size: 12px; color: var(--mu); flex: 1; min-width: 160px; }
// .tb-etxt strong { color: var(--tx); }
// .tb-obtn {
//   padding: 10px 22px; border-radius: 12px; border: none;
//   background: linear-gradient(135deg, #a78bfa, #22d3ee);
//   color: #0a0a0a;
//   font-family: 'Poppins', sans-serif;
//   font-size: 13px; font-weight: 700;
//   cursor: pointer; white-space: nowrap;
//   transition: opacity .2s, transform .15s;
//   box-shadow: 0 4px 14px rgba(167,139,250,0.35);
// }
// .tb-obtn:hover { opacity: .88; transform: translateY(-1px); }

// /* Empty */
// .tb-empty {
//   background: var(--card);
//   border: 1px solid var(--bd);
//   border-radius: var(--r);
//   padding: 60px 20px;
//   text-align: center;
//   box-shadow: var(--sh);
//   width: 100%;
//   box-sizing: border-box;
// }
// .tb-ei { opacity: .3; margin-bottom: 14px; }
// .tb-et { font-size: 15px; font-weight: 700; color: var(--mu); margin: 0 0 6px; }
// .tb-es { font-size: 12px; color: var(--mu); margin: 0; }

// /* ── RESPONSIVE ── */

// /* Tablet (≥ 640px) */
// @media (min-width: 640px) {
//   .tb { padding: 24px; }
//   .tb-hdr { padding: 28px 28px; }
//   .tb-ico { width: 52px; height: 52px; }
//   .tb-row { padding: 18px 24px; }
//   .tb-exp { padding: 16px 24px; }
//   .tb-etxt { font-size: 13px; }
// }

// /* Desktop (≥ 1024px) */
// @media (min-width: 1024px) {
//   .tb { padding: 36px 32px; }
//   .tb-hdr { padding: 32px 36px; }
//   .tb-in { gap: 20px; }
// }

// /* Small phone (≤ 400px) */
// @media (max-width: 400px) {
//   .tb { padding: 12px; }
//   .tb-hdr { flex-wrap: wrap; }
//   .tb-count { margin-left: 0; }
//   .tb-row { padding: 14px 16px; }
//   .tb-bname { font-size: 13px; }
//   .tb-exp { padding: 12px 16px; }
//   .tb-obtn { width: 100%; text-align: center; }
// }
// `;

// if (!document.getElementById("tb-st")) {
//   const t = document.createElement("style");
//   t.id = "tb-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const TrainerBatchesPage = () => {
//   const [batches, setBatches] = useState([]);
//   const [expanded, setExpanded] = useState({});
//   const [dark, setDark] = useState(isDark);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       const res = await getTrainerBatches();
//       setBatches(res || []);
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     o.observe(document.body,            { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

//   return (
//     <div className={`tb${dark ? " tb-dk" : ""}`}>
//       <div className="tb-in">

//         {/* ════════════ HERO HEADER ════════════ */}
//         <div className="tb-hdr">
//           <div className="tb-ico">
//             <Users size={24} />
//           </div>

//           <div style={{ minWidth: 0, flex: 1 }}>
//             {/* eyebrow badge */}
//             <div className="tb-bdg">
//               <Users size={9} /> Batch Management
//             </div>

//             {/* ── GRADIENT TITLE ── */}
//             <h1 className="tb-h1">
//               <span className="tb-h1-plain">My </span>
//               <span className="tb-h1-grad">Batches</span>
//             </h1>

//             <p className="tb-sub">
//               {batches.length} batch{batches.length !== 1 ? "es" : ""} assigned
//             </p>
//           </div>

//           {/* count pill */}
//           <div className="tb-count">
//             <Users size={14} />
//             {batches.length}
//           </div>
//         </div>
//         {/* ═════════════════════════════════════ */}

//         {/* ════════════ BATCH LIST ════════════ */}
//         <div className="tb-list">
//           {batches.map((b) => {
//             const isOpen = expanded[b.id];
//             return (
//               <div key={b.id} className="tb-card">
//                 <div
//                   className={`tb-row${isOpen ? " open" : ""}`}
//                   onClick={() => toggle(b.id)}
//                 >
//                   <div className="tb-rl">
//                     <div className="tb-bico">
//                       <BookOpen size={18} />
//                     </div>
//                     <div style={{ minWidth: 0 }}>
//                       <p className="tb-bname">{b.batchName}</p>
//                       <div className="tb-bid">
//                         <Hash size={11} />
//                         <span>Batch ID: {b.id}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="tb-chev">
//                     {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                   </div>
//                 </div>

//                 {isOpen && (
//                   <div className="tb-exp">
//                     <p className="tb-etxt">
//                       Click <strong>Open Classroom</strong> to manage students,
//                       content, and more for this batch.
//                     </p>
//                     <button
//                       className="tb-obtn"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/trainer/batches/${b.id}/students`);
//                       }}
//                     >
//                       Open Classroom
//                     </button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* ════════════ EMPTY STATE ════════════ */}
//         {batches.length === 0 && (
//           <div className="tb-empty">
//             <div className="tb-ei">
//               <Users size={44} style={{ color: "var(--mu)" }} />
//             </div>
//             <p className="tb-et">No batches assigned yet</p>
//             <p className="tb-es">Your batches will appear here once assigned.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrainerBatchesPage;










































import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "../services/batchService";
import { ChevronDown, ChevronUp, Users, BookOpen, Hash, GraduationCap } from "lucide-react";

// ── Global Design System — single source of truth for colors, typography,
// spacing, radius, shadows, StatCard, and PageContainer. This page inherits
// from the same tokens as the Trainer Dashboard (golden reference); nothing
// here should diverge from what's exported below.
import { T, FONT_FAMILY, StatCard, PageContainer } from "@/design-system";

/* ─── Local page styles (layout/animation only — colors always come from T) ─── */
function pageStyles() {
  return `
    @keyframes tbfade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .tb-fade { animation: tbfade .35s ease both; }
    .tb-row:hover { background: var(--tb-row-hov); }
    .tb-obtn:hover { opacity: .88; transform: translateY(-1px); }
    @media (max-width: 480px) {
      .tb-row { padding: 14px 16px !important; }
      .tb-exp { padding: 14px 16px !important; flex-direction: column; align-items: stretch !important; }
      .tb-obtn { width: 100%; text-align: center; }
    }
  `;
}

const TrainerBatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTrainerBatches();
        setBatches(res || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const card = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow };

  const stat = {
    label: "Batches Assigned",
    numericValue: batches.length,
    change: `${batches.length} batch${batches.length !== 1 ? "es" : ""}`,
    trend: "up",
    icon: Users,
    colorKey: "blue",
  };

  return (
    <>
      <style>{pageStyles()}</style>
      <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
        {/* ═══ HERO ═══ */}
        <div
          className="dfade"
          style={{
            padding: "8px 0 24px",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${t.borderHero}`,
            marginBottom: 20,
            boxShadow: "none",
          }}
        >
          <div className="hero-flex">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} className="d1" />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: t.textSub, fontFamily: FONT_FAMILY }}>
                  Batch Management
                </span>
              </div>
              <h1
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem,3vw,2.2rem)",
                  margin: "0 0 6px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                <span style={{ color: t.text }}>My </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Batches
                </span>
              </h1>
              <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500, fontFamily: FONT_FAMILY }}>
                {batches.length} batch{batches.length !== 1 ? "es" : ""} assigned
              </p>
            </div>

            <div className="hero-badges">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: t.actBg,
                  border: `1px solid ${t.actBorder}`,
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                  color: t.text,
                }}
              >
                <Users size={14} color={t.textSub} />
                {batches.length}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "2px solid rgba(167,139,250,0.2)",
                borderTopColor: "#a78bfa",
                animation: "spin .8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* ═══ STAT ═══ */}
            <div className="stat-grid" style={{ marginBottom: 20 }}>
              <StatCard stat={stat} index={0} loading={false} />
            </div>

            {/* ═══ BATCH LIST ═══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="tb-fade">
              {batches.map((b) => {
                const isOpen = expanded[b.id];
                return (
                  <div key={b.id} style={{ ...card, overflow: "hidden" }}>
                    <div
                      className="tb-row"
                      onClick={() => toggle(b.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "18px 22px",
                        cursor: "pointer",
                        userSelect: "none",
                        background: isOpen ? t.recentItemBg : "transparent",
                        transition: "background .15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: t.iconBg,
                            border: `1px solid ${t.iconBorder}`,
                          }}
                        >
                          <BookOpen size={18} color={t.text} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: t.text,
                              margin: "0 0 3px",
                              fontFamily: FONT_FAMILY,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {b.batchName}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: t.textMuted }}>
                            <Hash size={11} />
                            <span>Batch ID: {b.id}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ color: t.textMuted, flexShrink: 0 }}>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        className="tb-exp"
                        style={{
                          padding: "16px 22px",
                          borderTop: `1px solid ${t.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                          background: t.recentItemBg,
                        }}
                      >
                        <p style={{ fontSize: 12, color: t.textSub, flex: 1, minWidth: 160, margin: 0, fontFamily: FONT_FAMILY }}>
                          Click <strong style={{ color: t.text }}>Open Classroom</strong> to manage students, content, and more for this batch.
                        </p>
                        <button
                          className="tb-obtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/trainer/batches/${b.id}/students`);
                          }}
                          style={{
                            padding: "10px 22px",
                            borderRadius: 12,
                            border: "none",
                            background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                            color: "#0a0a0a",
                            fontFamily: FONT_FAMILY,
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "opacity .2s, transform .15s",
                            boxShadow: "0 4px 14px rgba(167,139,250,0.35)",
                          }}
                        >
                          Open Classroom
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ═══ EMPTY STATE ═══ */}
            {batches.length === 0 && (
              <div style={{ ...card, padding: "60px 20px", textAlign: "center" }} className="tb-fade">
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1.5px dashed ${t.emptyBorder}`,
                    background: t.emptyBg,
                  }}
                >
                  <GraduationCap size={26} color={t.emptyIcon} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: t.textMuted, margin: "0 0 6px", fontFamily: FONT_FAMILY }}>
                  No batches assigned yet
                </p>
                <p style={{ fontSize: 12, color: t.textLabel, margin: 0, fontFamily: FONT_FAMILY }}>
                  Your batches will appear here once assigned.
                </p>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
};

export default TrainerBatchesPage;