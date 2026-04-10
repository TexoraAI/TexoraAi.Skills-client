// import React, { useEffect, useState } from "react";
// import { Award, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";

// import fileService from "@/services/fileService";
// import auth from "@/auth";

// const Certificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedCard, setExpandedCard] = useState(null);

//   /* ================= FETCH STUDENT CERTIFICATES ================= */
//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const { email } = auth.getCurrentUser();
//         if (!email) {
//           console.error("Student email not found in auth storage");
//           setLoading(false);
//           return;
//         }
//         const res = await fileService.getStudentCertificates(email);
//         setCertificates(res.data || []);
//       } catch (err) {
//         console.error("Failed to fetch certificates", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCertificates();
//   }, []);

//   /* ================= ACTIONS ================= */
//   const handlePreview = async (fileName) => {
//     try {
//       const res = await fileService.getCertificateBlob(fileName);
//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//     } catch {
//       alert("Unable to preview certificate");
//     }
//   };

//   const handleDownload = async (fileName) => {
//     try {
//       const res = await fileService.getCertificateBlob(fileName);
//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch {
//       alert("Unable to download certificate");
//     }
//   };

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0f1b38]">
//         <p className="text-slate-500 dark:text-slate-400 text-sm">
//           Loading certificates...
//         </p>
//       </div>
//     );
//   }

//   const total = certificates.length;
//   const recent = certificates.filter((c) => {
//     if (!c.issuedDate) return false;
//     const diff = Date.now() - new Date(c.issuedDate).getTime();
//     return diff < 7 * 24 * 60 * 60 * 1000;
//   }).length;

//   /* Stat card inline styles — rich gradients for both modes */
//   const statCards = [
//     {
//       label: "TOTAL CERTIFICATES",
//       value: total,
//       sub: "All issued",
//       lightStyle: { background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" },
//       darkStyle:  { background: "linear-gradient(135deg, #1e3a5f, #16304f)" },
//     },
//     {
//       label: "AVAILABLE NOW",
//       value: total,
//       sub: "Ready to view",
//       lightStyle: { background: "linear-gradient(135deg, #0f766e, #0891b2)" },
//       darkStyle:  { background: "linear-gradient(135deg, #0f4d5e, #0b3d4d)" },
//     },
//     {
//       label: "THIS WEEK",
//       value: recent,
//       sub: "Newly issued",
//       lightStyle: { background: "linear-gradient(135deg, #4338ca, #6366f1)" },
//       darkStyle:  { background: "linear-gradient(135deg, #1a3a52, #12304a)" },
//     },
//     {
//       label: "ACTIVE",
//       value: total,
//       sub: "Valid & active",
//       lightStyle: { background: "linear-gradient(135deg, #0369a1, #0ea5e9)" },
//       darkStyle:  { background: "linear-gradient(135deg, #1b3d5a, #143351)" },
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] px-6 py-8">

//       {/* ===== PAGE TITLE ===== */}
//       <div className="max-w-6xl mx-auto mb-6">
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-wide">
//           Certificate Database
//         </h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
//           View, preview and download your issued certificates
//         </p>
//       </div>

//       {/* ===== STAT CARDS ===== */}
//       <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         {statCards.map((s, i) => (
//           <div
//             key={i}
//             className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
//             style={s.lightStyle}
//           >
//             <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">
//               {s.label}
//             </span>
//             <span className="text-2xl font-extrabold">{s.value}</span>
//             <span className="text-xs text-white/60">{s.sub}</span>
//           </div>
//         ))}
//       </div>

//       <div className="max-w-6xl mx-auto">

//         {/* ===== EMPTY STATE ===== */}
//         {certificates.length === 0 && (
//           <div className="rounded-2xl border border-slate-200 dark:border-white/10
//                           bg-white dark:bg-[#162040] p-12 text-center shadow-sm">
//             <Award className="w-12 h-12 text-slate-300 dark:text-slate-500 mx-auto mb-3" />
//             <p className="text-slate-500 dark:text-slate-400 text-sm">
//               No certificates issued yet.
//             </p>
//           </div>
//         )}

//         {/* ===== CERTIFICATE GRID ===== */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {certificates.map((c, idx) => {
//             const isExpanded = expandedCard === idx;
//             return (
//               <div
//                 key={idx}
//                 className={`rounded-2xl border transition-all duration-300 overflow-hidden
//                   bg-white dark:bg-gradient-to-br dark:from-[#162040] dark:to-[#1a2952]
//                   ${isExpanded
//                     ? "border-blue-400 dark:border-cyan-500/50 shadow-lg"
//                     : "border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-cyan-700/40 shadow-sm"
//                   }`}
//               >
//                 {/* ---- TOP BAR ---- */}
//                 <div className="flex items-center justify-between px-5 pt-5 pb-3">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-cyan-900/40
//                                     border border-blue-200 dark:border-cyan-700/30">
//                       <Award className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
//                     </div>
//                     <span className="text-[10px] font-bold tracking-widest uppercase
//                                      px-2.5 py-1 rounded-full
//                                      bg-blue-100 dark:bg-cyan-900/40
//                                      text-blue-700 dark:text-cyan-300
//                                      border border-blue-200 dark:border-cyan-700/30">
//                       {c.type}
//                     </span>
//                   </div>

//                   {/* ← → Toggle arrows */}
//                   <button
//                     onClick={() => setExpandedCard(isExpanded ? null : idx)}
//                     title={isExpanded ? "Collapse" : "Expand"}
//                     className="flex items-center gap-0.5 px-2 py-1 rounded-lg
//                                bg-slate-100 dark:bg-white/5
//                                border border-slate-200 dark:border-white/10
//                                hover:bg-blue-50 dark:hover:bg-white/10
//                                hover:border-blue-300 dark:hover:border-cyan-600/40
//                                text-slate-400 dark:text-slate-300
//                                hover:text-blue-600 dark:hover:text-cyan-300
//                                transition"
//                   >
//                     <ChevronLeft className="w-3.5 h-3.5" />
//                     <ChevronRight className="w-3.5 h-3.5" />
//                   </button>
//                 </div>

//                 {/* ---- COURSE NAME ---- */}
//                 <div className="px-5 pb-3">
//                   <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
//                     {c.courseName}
//                   </h3>
//                   <p className="text-xs text-slate-400 mt-0.5">
//                     Issued on:{" "}
//                     {c.issuedDate
//                       ? new Date(c.issuedDate).toLocaleDateString()
//                       : "-"}
//                   </p>
//                 </div>

//                 {/* ---- EXPANDED DETAILS ---- */}
//                 {isExpanded && (
//                   <div className="px-5 pb-4 pt-3 border-t border-slate-100 dark:border-white/8 space-y-2">
//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                       <div className="bg-slate-50 dark:bg-white/5
//                                       border border-slate-100 dark:border-white/5
//                                       rounded-lg px-3 py-2">
//                         <span className="text-slate-400 block">File Name</span>
//                         <span className="text-slate-700 dark:text-slate-200 font-medium truncate block">
//                           {c.fileName || "-"}
//                         </span>
//                       </div>
//                       <div className="bg-slate-50 dark:bg-white/5
//                                       border border-slate-100 dark:border-white/5
//                                       rounded-lg px-3 py-2">
//                         <span className="text-slate-400 block">Type</span>
//                         <span className="text-slate-700 dark:text-slate-200 font-medium">
//                           {c.type || "-"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ---- DIVIDER ---- */}
//                 <div className="mx-5 border-t border-slate-100 dark:border-white/8" />

//                 {/* ---- ACTIONS ---- */}
//                 <div className="flex gap-2 px-5 py-4">
//                   <button
//                     onClick={() => handlePreview(c.fileName)}
//                     className="flex-1 flex items-center justify-center gap-2
//                                px-4 py-2.5 rounded-xl text-sm font-semibold
//                                bg-blue-600 hover:bg-blue-700
//                                text-white transition shadow-sm"
//                   >
//                     <Eye className="w-4 h-4" />
//                     Preview
//                   </button>
//                   <button
//                     onClick={() => handleDownload(c.fileName)}
//                     className="flex-1 flex items-center justify-center gap-2
//                                px-4 py-2.5 rounded-xl text-sm font-semibold
//                                bg-slate-100 dark:bg-white/8
//                                border border-slate-200 dark:border-white/12
//                                hover:bg-slate-200 dark:hover:bg-white/14
//                                text-slate-700 dark:text-slate-200 transition"
//                   >
//                     <Download className="w-4 h-4" />
//                     Download
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Certificates;






















import React, { useEffect, useState } from "react";
import { Award, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import fileService from "@/services/fileService";
import auth from "@/auth";

/* ─── Styles ─────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --ct-bg:        #f1f5f9;
    --ct-card:      #ffffff;
    --ct-text:      #0f172a;
    --ct-muted:     #64748b;
    --ct-border:    #e2e8f0;
    --ct-accent1:   #22d3ee;
    --ct-accent2:   #fb923c;
    --ct-accent3:   #34d399;
    --ct-accent4:   #a78bfa;
    --ct-shadow:    0 4px 24px rgba(0,0,0,0.06);
    --ct-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --ct-radius:    20px;
  }

  .ct-dark {
    --ct-bg:        #0a0a0a;
    --ct-card:      #111111;
    --ct-text:      #ffffff;
    --ct-muted:     #94a3b8;
    --ct-border:    rgba(255,255,255,0.06);
    --ct-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --ct-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .ct-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--ct-bg);
    color: var(--ct-text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s;
  }

  .ct-inner { max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  /* ── Header ── */
  .ct-header {
    background: var(--ct-card);
    border: 1px solid var(--ct-border);
    border-radius: var(--ct-radius);
    padding: 28px 32px;
    box-shadow: var(--ct-shadow);
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
  }

  .ct-header-left { display: flex; align-items: center; gap: 16px; }

  .ct-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(34,211,238,0.10);
    border: 1px solid rgba(34,211,238,0.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--ct-accent1); flex-shrink: 0;
  }

  .ct-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 50px;
    border: 1px solid var(--ct-border);
    background: rgba(34,211,238,0.08);
    color: var(--ct-accent1);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
  }

  .ct-h1 { font-size: 24px; font-weight: 800; color: var(--ct-text); margin: 0 0 2px; }
  .ct-subtitle { font-size: 13px; color: var(--ct-muted); margin: 0; }

  /* ── Stat chips ── */
  .ct-stats { display: flex; gap: 12px; flex-wrap: wrap; }

  .ct-stat {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 14px;
    background: var(--ct-bg); border: 1px solid var(--ct-border);
    box-shadow: var(--ct-shadow);
  }

  .ct-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .ct-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
  .ct-stat-lbl { font-size: 10px; font-weight: 600; color: var(--ct-muted); text-transform: uppercase; letter-spacing: 0.06em; }

  /* ── Grid ── */
  .ct-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  /* ── Card ── */
  .ct-card {
    background: var(--ct-card);
    border: 1px solid var(--ct-border);
    border-radius: var(--ct-radius);
    box-shadow: var(--ct-shadow);
    overflow: hidden;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }

  .ct-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--ct-shadow-lg);
    border-color: rgba(34,211,238,0.20);
  }

  .ct-card.ct-expanded { border-color: rgba(34,211,238,0.30); }

  .ct-card-top {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 20px 14px;
  }

  .ct-card-top-left { display: flex; align-items: center; gap: 10px; }

  .ct-award-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(34,211,238,0.10);
    border: 1px solid rgba(34,211,238,0.15);
    color: var(--ct-accent1);
    flex-shrink: 0;
  }

  .ct-type-tag {
    padding: 4px 10px; border-radius: 8px;
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
    background: rgba(34,211,238,0.08);
    border: 1px solid rgba(34,211,238,0.15);
    color: var(--ct-accent1);
  }

  .ct-expand-btn {
    display: flex; align-items: center; gap: 1px;
    padding: 6px 10px; border-radius: 9px; border: none;
    background: var(--ct-bg);
    border: 1px solid var(--ct-border);
    color: var(--ct-muted);
    cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
    flex-shrink: 0;
  }

  .ct-expand-btn:hover {
    border-color: rgba(34,211,238,0.30);
    color: var(--ct-accent1);
    background: rgba(34,211,238,0.05);
  }

  .ct-card-info { padding: 0 20px 16px; }

  .ct-course-name {
    font-size: 15px; font-weight: 700; color: var(--ct-text);
    margin: 0 0 4px; line-height: 1.35;
  }

  .ct-issued-date { font-size: 11px; color: var(--ct-muted); margin: 0; }

  /* expanded details */
  .ct-details {
    padding: 14px 20px;
    border-top: 1px solid var(--ct-border);
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }

  .ct-detail-cell {
    background: var(--ct-bg);
    border: 1px solid var(--ct-border);
    border-radius: 10px;
    padding: 10px 12px;
  }

  .ct-detail-lbl { font-size: 10px; color: var(--ct-muted); margin: 0 0 3px; }
  .ct-detail-val { font-size: 12px; font-weight: 600; color: var(--ct-text); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .ct-divider { height: 1px; background: var(--ct-border); margin: 0 20px; }

  /* actions */
  .ct-actions { display: flex; gap: 10px; padding: 16px 20px; }

  .ct-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 12px 16px; border-radius: 14px; border: none;
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  }

  .ct-btn:hover { opacity: 0.85; transform: translateY(-1px); }

  .ct-btn-cyan { background: var(--ct-accent1); color: #0a0a0a; }

  .ct-btn-outline {
    background: transparent; color: var(--ct-text);
    border: 1px solid var(--ct-border) !important;
  }

  .ct-btn-outline:hover { border-color: rgba(34,211,238,0.30) !important; color: var(--ct-accent1); }

  /* ── Empty ── */
  .ct-empty {
    background: var(--ct-card);
    border: 1px solid var(--ct-border);
    border-radius: var(--ct-radius);
    padding: 60px 20px;
    text-align: center;
    box-shadow: var(--ct-shadow);
  }

  .ct-empty-icon { color: var(--ct-muted); opacity: 0.4; margin-bottom: 12px; }
  .ct-empty-text { font-size: 14px; font-weight: 500; color: var(--ct-muted); margin: 0; }

  /* Loading */
  .ct-loading {
    min-height: 100vh; display: flex;
    align-items: center; justify-content: center;
    font-family: 'Poppins', sans-serif;
    font-size: 14px; color: var(--ct-muted);
  }
`;

if (!document.getElementById("ct-styles")) {
  const tag = document.createElement("style");
  tag.id = "ct-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [dark, setDark]                 = useState(isDark);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { email } = auth.getCurrentUser();
        if (!email) { setLoading(false); return; }
        const res = await fileService.getStudentCertificates(email);
        setCertificates(res.data || []);
      } catch (err) {
        console.error("Failed to fetch certificates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const handlePreview = async (fileName) => {
    try {
      const res = await fileService.getCertificateBlob(fileName);
      const blob = new Blob([res.data], { type: "application/pdf" });
      window.open(window.URL.createObjectURL(blob), "_blank");
    } catch { alert("Unable to preview certificate"); }
  };

  const handleDownload = async (fileName) => {
    try {
      const res = await fileService.getCertificateBlob(fileName);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = fileName;
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); window.URL.revokeObjectURL(url);
    } catch { alert("Unable to download certificate"); }
  };

  if (loading) {
    return <div className={`ct-loading${dark ? " ct-dark" : ""}`}>Loading certificates...</div>;
  }

  const total  = certificates.length;
  const recent = certificates.filter((c) => {
    if (!c.issuedDate) return false;
    return Date.now() - new Date(c.issuedDate).getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const statCards = [
    { label: "Total",     value: total,  accent: "var(--ct-accent1)", bg: "rgba(34,211,238,0.10)" },
    { label: "Available", value: total,  accent: "var(--ct-accent3)", bg: "rgba(52,211,153,0.10)" },
    { label: "This Week", value: recent, accent: "var(--ct-accent2)", bg: "rgba(251,146,60,0.10)" },
    { label: "Active",    value: total,  accent: "var(--ct-accent4)", bg: "rgba(167,139,250,0.10)" },
  ];

  return (
    <div className={`ct-root${dark ? " ct-dark" : ""}`}>
      <div className="ct-inner">

        {/* ── Header ── */}
        <div className="ct-header">
          <div className="ct-header-left">
            <div className="ct-header-icon"><Award size={24} /></div>
            <div>
              <div className="ct-badge"><Award size={10} /> Certificate Database</div>
              <h1 className="ct-h1">Certificate Database</h1>
              <p className="ct-subtitle">View, preview and download your issued certificates</p>
            </div>
          </div>

          <div className="ct-stats">
            {statCards.map((s, i) => (
              <div key={i} className="ct-stat">
                <div className="ct-stat-icon" style={{ background: s.bg, color: s.accent }}>
                  <Award size={16} />
                </div>
                <div>
                  <div className="ct-stat-val" style={{ color: s.accent }}>{s.value}</div>
                  <div className="ct-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Empty ── */}
        {certificates.length === 0 && (
          <div className="ct-empty">
            <div className="ct-empty-icon"><Award size={44} /></div>
            <p className="ct-empty-text">No certificates issued yet.</p>
          </div>
        )}

        {/* ── Grid ── */}
        <div className="ct-grid">
          {certificates.map((c, idx) => {
            const isExpanded = expandedCard === idx;
            return (
              <div key={idx} className={`ct-card${isExpanded ? " ct-expanded" : ""}`}>

                <div className="ct-card-top">
                  <div className="ct-card-top-left">
                    <div className="ct-award-icon"><Award size={18} /></div>
                    <span className="ct-type-tag">{c.type}</span>
                  </div>
                  <button
                    className="ct-expand-btn"
                    onClick={() => setExpandedCard(isExpanded ? null : idx)}
                  >
                    <ChevronLeft size={14} />
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="ct-card-info">
                  <h3 className="ct-course-name">{c.courseName}</h3>
                  <p className="ct-issued-date">
                    Issued on: {c.issuedDate ? new Date(c.issuedDate).toLocaleDateString() : "—"}
                  </p>
                </div>

                {isExpanded && (
                  <div className="ct-details">
                    <div className="ct-detail-cell">
                      <p className="ct-detail-lbl">File Name</p>
                      <p className="ct-detail-val">{c.fileName || "—"}</p>
                    </div>
                    <div className="ct-detail-cell">
                      <p className="ct-detail-lbl">Type</p>
                      <p className="ct-detail-val">{c.type || "—"}</p>
                    </div>
                  </div>
                )}

                <div className="ct-divider" />

                <div className="ct-actions">
                  <button className="ct-btn ct-btn-cyan" onClick={() => handlePreview(c.fileName)}>
                    <Eye size={14} /> Preview
                  </button>
                  <button className="ct-btn ct-btn-outline" onClick={() => handleDownload(c.fileName)}>
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Certificates;