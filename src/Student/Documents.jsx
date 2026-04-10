// import React, { useEffect, useState } from "react";
// import fileService from "../services/fileService";

// // ICONS
// import {
//   FaEye,
//   FaTimes,
//   FaFileAlt,
//   FaFile,
//   FaFilePdf,
//   FaFileImage,
// } from "react-icons/fa";

// const Documents = () => {
//   const [docs, setDocs] = useState([]);
//   const [preview, setPreview] = useState(null);

//   // ================= FETCH FILES =================
//   useEffect(() => {
//     fileService
//       .getStudentFiles()
//       .then((res) => setDocs(res.data || []))
//       .catch(console.error);
//   }, []);

//   // ================= PREVIEW =================
//   const openPreview = async (file) => {
//     try {
//       const res = await fileService.downloadFileBlob(file.storedName);
//       const blob = new Blob([res.data], {
//         type: file.contentType || "application/pdf",
//       });
//       const url = URL.createObjectURL(blob);

//       setPreview({
//         url,
//         type: blob.type,
//         name: file.originalName,
//       });
//     } catch {
//       alert("Preview failed");
//     }
//   };

//   const closePreview = () => {
//     if (preview?.url) URL.revokeObjectURL(preview.url);
//     setPreview(null);
//   };

//   // ================= TOTAL SIZE =================
//   const totalSize = docs.reduce((acc, d) => acc + (d.size || 0), 0);
//   const totalSizeKB = Math.round(totalSize / 1024);

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       {/* ================= LIGHT BLUE HERO ================= */}
//       <header
//         className="relative overflow-hidden
//         bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//         dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
//       >
//         {/* overlay */}
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative px-6 py-8 max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
//             <FaFileAlt />
//             Documents
//           </h1>

//           <p className="text-sm text-white/90 mb-4">
//             Access all study materials shared by your trainers
//           </p>

//           <div className="flex gap-3 flex-wrap">
//             <Stat label="Files" value={docs.length} />
//             <Stat label="Storage (KB)" value={totalSizeKB} />
//           </div>
//         </div>
//       </header>

//       {/* ================= DOCUMENT LIST ================= */}
//       <div className="max-w-7xl mx-auto px-6 py-8 space-y-3">
//         {docs.map((d) => {
//           const type = d.contentType || "";

//           return (
//             <div
//               key={d.id}
//               className="flex items-center justify-between p-4 rounded-xl
//                          bg-white dark:bg-slate-900
//                          border border-slate-200 dark:border-slate-800
//                          hover:shadow-md transition"
//             >
//               {/* LEFT */}
//               <div className="flex items-center gap-3 min-w-0">
//                 <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
//                   {type.includes("pdf") ? (
//                     <FaFilePdf />
//                   ) : type.startsWith("image") ? (
//                     <FaFileImage />
//                   ) : (
//                     <FaFile />
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <p className="font-medium truncate text-slate-900 dark:text-slate-100">
//                     {d.originalName}
//                   </p>
//                   <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
//                     <span>{type.split("/")[1]?.toUpperCase() || "FILE"}</span>
//                     <span>{Math.round(d.size / 1024)} KB</span>
//                   </div>
//                 </div>
//               </div>

//               {/* PREVIEW */}
//               <button
//                 onClick={() => openPreview(d)}
//                 className="px-3 py-1.5 text-xs rounded-lg
//                            bg-blue-600 hover:bg-blue-700
//                            text-white flex items-center gap-2 transition"
//               >
//                 <FaEye size={12} />
//                 Preview
//               </button>
//             </div>
//           );
//         })}

//         {docs.length === 0 && (
//           <p className="text-center text-slate-500 dark:text-slate-400">
//             No documents available
//           </p>
//         )}
//       </div>

//       {/* ================= PREVIEW MODAL ================= */}
//       {preview && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
//           <div className="bg-white dark:bg-slate-900 w-full h-full md:h-[90%] md:w-[90%] rounded-none md:rounded-xl overflow-hidden">
//             {/* HEADER */}
//             <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
//               <p className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
//                 {preview.name}
//               </p>
//               <button
//                 onClick={closePreview}
//                 className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* CONTENT */}
//             <div className="h-full bg-slate-100 dark:bg-slate-950">
//               {preview.type.includes("pdf") && (
//                 <iframe
//                   src={preview.url}
//                   title="PDF Preview"
//                   className="w-full h-full"
//                 />
//               )}

//               {preview.type.startsWith("image") && (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img
//                     src={preview.url}
//                     alt="Preview"
//                     className="max-w-full max-h-full"
//                   />
//                 </div>
//               )}

//               {!preview.type.includes("pdf") &&
//                 !preview.type.startsWith("image") && (
//                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
//                     <FaFileAlt size={48} />
//                     <p className="mt-2 text-sm">Preview not available</p>
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ================= STAT =================
// const Stat = ({ label, value }) => (
//   <div className="px-4 py-2 rounded-lg bg-white/30 backdrop-blur-sm text-white shadow">
//     <p className="text-lg font-bold leading-none">{value}</p>
//     <p className="text-[11px] text-white/80">{label}</p>
//   </div>
// );

// export default Documents;old ui 




















// import React, { useEffect, useState } from "react";
// import fileService from "../services/fileService";
// import { FaEye, FaTimes, FaFileAlt, FaFile, FaFilePdf, FaFileImage } from "react-icons/fa";

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --dc-bg:        #f1f5f9;
//     --dc-card:      #ffffff;
//     --dc-text:      #0f172a;
//     --dc-muted:     #64748b;
//     --dc-border:    #e2e8f0;
//     --dc-accent1:   #22d3ee;
//     --dc-accent2:   #fb923c;
//     --dc-accent3:   #34d399;
//     --dc-accent4:   #a78bfa;
//     --dc-shadow:    0 4px 24px rgba(0,0,0,0.06);
//     --dc-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//     --dc-radius:    20px;
//   }

//   .dc-dark {
//     --dc-bg:        #0a0a0a;
//     --dc-card:      #111111;
//     --dc-text:      #ffffff;
//     --dc-muted:     #94a3b8;
//     --dc-border:    rgba(255,255,255,0.06);
//     --dc-shadow:    0 4px 24px rgba(0,0,0,0.40);
//     --dc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
//   }

//   .dc-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--dc-bg);
//     color: var(--dc-text);
//     padding: 24px;
//     box-sizing: border-box;
//     transition: background 0.3s;
//   }

//   .dc-inner {
//     max-width: 1100px;
//     margin: 0 auto;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//   }

//   /* ── Header card ── */
//   .dc-header {
//     background: var(--dc-card);
//     border: 1px solid var(--dc-border);
//     border-radius: var(--dc-radius);
//     padding: 28px 32px;
//     box-shadow: var(--dc-shadow);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 20px;
//     flex-wrap: wrap;
//   }

//   .dc-header-left { display: flex; align-items: center; gap: 16px; }

//   .dc-header-icon-box {
//     width: 52px; height: 52px; border-radius: 14px;
//     background: rgba(167,139,250,0.10);
//     border: 1px solid rgba(167,139,250,0.18);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--dc-accent4); flex-shrink: 0; font-size: 22px;
//   }

//   .dc-badge {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 4px 11px; border-radius: 50px;
//     border: 1px solid var(--dc-border);
//     background: rgba(167,139,250,0.08);
//     color: var(--dc-accent4);
//     font-size: 10px; font-weight: 700;
//     letter-spacing: 0.08em; text-transform: uppercase;
//     margin-bottom: 6px;
//   }

//   .dc-h1 { font-size: 24px; font-weight: 800; color: var(--dc-text); margin: 0 0 2px; }
//   .dc-subtitle { font-size: 13px; color: var(--dc-muted); margin: 0; }

//   .dc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

//   .dc-stat {
//     display: flex; align-items: center; gap: 10px;
//     padding: 12px 18px; border-radius: 14px;
//     background: var(--dc-bg);
//     border: 1px solid var(--dc-border);
//     box-shadow: var(--dc-shadow);
//   }

//   .dc-stat-icon {
//     width: 36px; height: 36px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 14px; flex-shrink: 0;
//   }

//   .dc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
//   .dc-stat-lbl { font-size: 10px; font-weight: 600; color: var(--dc-muted); text-transform: uppercase; letter-spacing: 0.06em; }

//   /* ── List ── */
//   .dc-list { display: flex; flex-direction: column; gap: 10px; }

//   .dc-item {
//     display: flex; align-items: center; justify-content: space-between;
//     gap: 12px; padding: 16px 20px;
//     background: var(--dc-card);
//     border: 1px solid var(--dc-border);
//     border-radius: 16px;
//     box-shadow: var(--dc-shadow);
//     transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
//   }

//   .dc-item:hover {
//     transform: translateY(-2px);
//     box-shadow: var(--dc-shadow-lg);
//     border-color: rgba(167,139,250,0.20);
//   }

//   .dc-item-left { display: flex; align-items: center; gap: 12px; min-width: 0; }

//   .dc-item-icon {
//     width: 40px; height: 40px; border-radius: 11px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 16px; flex-shrink: 0;
//   }

//   .dc-item-name {
//     font-size: 13px; font-weight: 600; color: var(--dc-text);
//     white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 3px;
//   }

//   .dc-item-meta {
//     display: flex; gap: 8px;
//     font-size: 11px; color: var(--dc-muted);
//   }

//   .dc-item-meta span {
//     padding: 2px 7px; border-radius: 6px;
//     background: var(--dc-bg); border: 1px solid var(--dc-border);
//   }

//   .dc-preview-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 9px 16px; border-radius: 10px; border: none;
//     background: var(--dc-accent4); color: #0a0a0a;
//     font-family: 'Poppins', sans-serif;
//     font-size: 12px; font-weight: 700;
//     cursor: pointer;
//     transition: opacity 0.2s, transform 0.15s;
//     white-space: nowrap; flex-shrink: 0;
//   }

//   .dc-preview-btn:hover { opacity: 0.85; transform: translateY(-1px); }

//   .dc-empty {
//     text-align: center; padding: 60px 20px;
//     color: var(--dc-muted); font-size: 14px; font-weight: 500;
//   }

//   .dc-empty-icon { font-size: 40px; opacity: 0.4; margin-bottom: 12px; }

//   /* ── Modal ── */
//   .dc-modal-overlay {
//     position: fixed; inset: 0; z-index: 50;
//     background: rgba(0,0,0,0.72);
//     display: flex; align-items: center; justify-content: center;
//     backdrop-filter: blur(4px);
//   }

//   .dc-modal {
//     background: var(--dc-card);
//     border: 1px solid var(--dc-border);
//     border-radius: var(--dc-radius);
//     width: 90vw; height: 90vh;
//     overflow: hidden;
//     display: flex; flex-direction: column;
//     box-shadow: var(--dc-shadow-lg);
//   }

//   .dc-modal-head {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 14px 20px;
//     border-bottom: 1px solid var(--dc-border);
//     flex-shrink: 0;
//   }

//   .dc-modal-name {
//     font-size: 13px; font-weight: 700; color: var(--dc-text);
//     white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
//     margin: 0;
//   }

//   .dc-modal-close {
//     width: 32px; height: 32px; border-radius: 8px; border: none;
//     background: var(--dc-bg); color: var(--dc-muted);
//     display: flex; align-items: center; justify-content: center;
//     cursor: pointer; font-size: 14px;
//     transition: background 0.2s, color 0.2s;
//   }

//   .dc-modal-close:hover { background: rgba(248,113,113,0.12); color: #f87171; }

//   .dc-modal-body {
//     flex: 1; overflow: hidden;
//     background: var(--dc-bg);
//     display: flex; align-items: center; justify-content: center;
//   }

//   .dc-no-preview {
//     display: flex; flex-direction: column; align-items: center;
//     gap: 12px; color: var(--dc-muted); font-size: 14px;
//   }

//   .dc-no-preview-icon { font-size: 44px; opacity: 0.4; }
// `;

// if (!document.getElementById("dc-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "dc-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const Documents = () => {
//   const [docs, setDocs]     = useState([]);
//   const [preview, setPreview] = useState(null);
//   const [dark, setDark]     = useState(isDark);

//   useEffect(() => {
//     fileService.getStudentFiles()
//       .then((res) => setDocs(res.data || []))
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDark()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   const openPreview = async (file) => {
//     try {
//       const res = await fileService.downloadFileBlob(file.storedName);
//       const blob = new Blob([res.data], { type: file.contentType || "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       setPreview({ url, type: blob.type, name: file.originalName });
//     } catch {
//       alert("Preview failed");
//     }
//   };

//   const closePreview = () => {
//     if (preview?.url) URL.revokeObjectURL(preview.url);
//     setPreview(null);
//   };

//   const totalSizeKB = Math.round(docs.reduce((acc, d) => acc + (d.size || 0), 0) / 1024);

//   const fileIcon = (type) => {
//     if (type.includes("pdf"))       return { icon: <FaFilePdf />,   bg: "rgba(251,146,60,0.10)",  color: "var(--dc-accent2)" };
//     if (type.startsWith("image"))   return { icon: <FaFileImage />, bg: "rgba(52,211,153,0.10)",  color: "var(--dc-accent3)" };
//     return                                 { icon: <FaFile />,       bg: "rgba(34,211,238,0.10)",  color: "var(--dc-accent1)" };
//   };

//   return (
//     <div className={`dc-root${dark ? " dc-dark" : ""}`}>
//       <div className="dc-inner">

//         {/* ── Header ── */}
//         <div className="dc-header">
//           <div className="dc-header-left">
//             <div className="dc-header-icon-box"><FaFileAlt /></div>
//             <div>
//               <div className="dc-badge"><FaFileAlt style={{ fontSize: 9 }} /> Documents</div>
//               <h1 className="dc-h1">Documents</h1>
//               <p className="dc-subtitle">Access all study materials shared by your trainers</p>
//             </div>
//           </div>

//           <div className="dc-stats">
//             <div className="dc-stat">
//               <div className="dc-stat-icon" style={{ background: "rgba(34,211,238,0.10)", color: "var(--dc-accent1)" }}>
//                 <FaFileAlt />
//               </div>
//               <div>
//                 <div className="dc-stat-val" style={{ color: "var(--dc-accent1)" }}>{docs.length}</div>
//                 <div className="dc-stat-lbl">Files</div>
//               </div>
//             </div>
//             <div className="dc-stat">
//               <div className="dc-stat-icon" style={{ background: "rgba(251,146,60,0.10)", color: "var(--dc-accent2)" }}>
//                 <FaFile />
//               </div>
//               <div>
//                 <div className="dc-stat-val" style={{ color: "var(--dc-accent2)" }}>{totalSizeKB}</div>
//                 <div className="dc-stat-lbl">Storage KB</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── List ── */}
//         <div className="dc-list">
//           {docs.map((d) => {
//             const type = d.contentType || "";
//             const { icon, bg, color } = fileIcon(type);
//             return (
//               <div key={d.id} className="dc-item">
//                 <div className="dc-item-left">
//                   <div className="dc-item-icon" style={{ background: bg, color }}>
//                     {icon}
//                   </div>
//                   <div style={{ minWidth: 0 }}>
//                     <p className="dc-item-name">{d.originalName}</p>
//                     <div className="dc-item-meta">
//                       <span>{type.split("/")[1]?.toUpperCase() || "FILE"}</span>
//                       <span>{Math.round(d.size / 1024)} KB</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button className="dc-preview-btn" onClick={() => openPreview(d)}>
//                   <FaEye style={{ fontSize: 12 }} />
//                   Preview
//                 </button>
//               </div>
//             );
//           })}

//           {docs.length === 0 && (
//             <div className="dc-empty">
//               <div className="dc-empty-icon"><FaFileAlt /></div>
//               No documents available
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Modal ── */}
//       {preview && (
//         <div className={`dc-modal-overlay${dark ? " dc-dark" : ""}`}>
//           <div className="dc-modal">
//             <div className="dc-modal-head">
//               <p className="dc-modal-name">{preview.name}</p>
//               <button className="dc-modal-close" onClick={closePreview}><FaTimes /></button>
//             </div>
//             <div className="dc-modal-body">
//               {preview.type.includes("pdf") && (
//                 <iframe src={preview.url} title="PDF Preview" style={{ width: "100%", height: "100%", border: "none" }} />
//               )}
//               {preview.type.startsWith("image") && (
//                 <img src={preview.url} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
//               )}
//               {!preview.type.includes("pdf") && !preview.type.startsWith("image") && (
//                 <div className="dc-no-preview">
//                   <div className="dc-no-preview-icon"><FaFileAlt /></div>
//                   Preview not available
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Documents; updated ui no progress service add this ui 

















import React, { useEffect, useState } from "react";
import fileService from "../services/fileService";
import { progressService } from "../services/progressService";
import { FaEye, FaTimes, FaFileAlt, FaFile, FaFilePdf, FaFileImage, FaCheckCircle } from "react-icons/fa";

/* ─── Styles ─────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --dc-bg:        #f1f5f9;
    --dc-card:      #ffffff;
    --dc-text:      #0f172a;
    --dc-muted:     #64748b;
    --dc-border:    #e2e8f0;
    --dc-accent1:   #22d3ee;
    --dc-accent2:   #fb923c;
    --dc-accent3:   #34d399;
    --dc-accent4:   #a78bfa;
    --dc-shadow:    0 4px 24px rgba(0,0,0,0.06);
    --dc-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --dc-radius:    20px;
  }

  .dc-dark {
    --dc-bg:        #0a0a0a;
    --dc-card:      #111111;
    --dc-text:      #ffffff;
    --dc-muted:     #94a3b8;
    --dc-border:    rgba(255,255,255,0.06);
    --dc-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --dc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .dc-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--dc-bg);
    color: var(--dc-text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s;
  }

  .dc-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  .dc-header {
    background: var(--dc-card);
    border: 1px solid var(--dc-border);
    border-radius: var(--dc-radius);
    padding: 28px 32px;
    box-shadow: var(--dc-shadow);
    display: flex; align-items: center; justify-content: space-between;
    gap: 20px; flex-wrap: wrap;
  }

  .dc-header-left { display: flex; align-items: center; gap: 16px; }

  .dc-header-icon-box {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(167,139,250,0.10);
    border: 1px solid rgba(167,139,250,0.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--dc-accent4); flex-shrink: 0; font-size: 22px;
  }

  .dc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 50px;
    border: 1px solid var(--dc-border);
    background: rgba(167,139,250,0.08); color: var(--dc-accent4);
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 6px;
  }

  .dc-h1 { font-size: 24px; font-weight: 800; color: var(--dc-text); margin: 0 0 2px; }
  .dc-subtitle { font-size: 13px; color: var(--dc-muted); margin: 0; }

  .dc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

  .dc-stat {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 14px;
    background: var(--dc-bg); border: 1px solid var(--dc-border);
    box-shadow: var(--dc-shadow);
  }

  .dc-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }

  .dc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
  .dc-stat-lbl { font-size: 10px; font-weight: 600; color: var(--dc-muted); text-transform: uppercase; letter-spacing: 0.06em; }

  /* progress bar inside stat */
  .dc-progress-bar-wrap {
    width: 64px; height: 4px; border-radius: 99px;
    background: rgba(52,211,153,0.15); overflow: hidden; margin-top: 4px;
  }

  .dc-progress-bar {
    height: 100%; border-radius: 99px; background: var(--dc-accent3);
    transition: width 0.5s ease;
  }

  .dc-list { display: flex; flex-direction: column; gap: 10px; }

  .dc-item {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 16px 20px;
    background: var(--dc-card);
    border: 1px solid var(--dc-border);
    border-radius: 16px; box-shadow: var(--dc-shadow);
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }

  .dc-item:hover { transform: translateY(-2px); box-shadow: var(--dc-shadow-lg); border-color: rgba(167,139,250,0.20); }

  /* watched state */
  .dc-item.previewed {
    background: rgba(52,211,153,0.04);
    border-color: rgba(52,211,153,0.25);
  }

  .dc-item-left { display: flex; align-items: center; gap: 12px; min-width: 0; }

  .dc-item-icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }

  .dc-item-name {
    font-size: 13px; font-weight: 600; color: var(--dc-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 3px;
  }

  .dc-item-meta { display: flex; gap: 8px; font-size: 11px; color: var(--dc-muted); align-items: center; }

  .dc-item-meta span {
    padding: 2px 7px; border-radius: 6px;
    background: var(--dc-bg); border: 1px solid var(--dc-border);
  }

  .dc-previewed-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; color: var(--dc-accent3);
  }

  .dc-preview-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 16px; border-radius: 10px; border: none;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s;
    white-space: nowrap; flex-shrink: 0;
  }

  .dc-preview-btn:hover { opacity: 0.85; transform: translateY(-1px); }

  .dc-preview-btn.new { background: var(--dc-accent4); color: #0a0a0a; }
  .dc-preview-btn.seen { background: var(--dc-accent3); color: #0a0a0a; }

  .dc-empty { text-align: center; padding: 60px 20px; color: var(--dc-muted); font-size: 14px; font-weight: 500; }
  .dc-empty-icon { font-size: 40px; opacity: 0.4; margin-bottom: 12px; }

  .dc-modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.72);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(4px);
  }

  .dc-modal {
    background: var(--dc-card);
    border: 1px solid var(--dc-border);
    border-radius: var(--dc-radius);
    width: 90vw; height: 90vh; overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: var(--dc-shadow-lg);
  }

  .dc-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; border-bottom: 1px solid var(--dc-border); flex-shrink: 0;
  }

  .dc-modal-name { font-size: 13px; font-weight: 700; color: var(--dc-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }

  .dc-modal-close {
    width: 32px; height: 32px; border-radius: 8px; border: none;
    background: var(--dc-bg); color: var(--dc-muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; transition: background 0.2s, color 0.2s;
  }

  .dc-modal-close:hover { background: rgba(248,113,113,0.12); color: #f87171; }

  .dc-modal-body {
    flex: 1; overflow: hidden; background: var(--dc-bg);
    display: flex; align-items: center; justify-content: center;
  }

  .dc-no-preview { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--dc-muted); font-size: 14px; }
  .dc-no-preview-icon { font-size: 44px; opacity: 0.4; }
`;

if (!document.getElementById("dc-styles")) {
  const tag = document.createElement("style");
  tag.id = "dc-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

// ✅ Decode email from JWT
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [preview, setPreview] = useState(null);

  // ✅ Progress state from backend
  const [downloadedFileIds, setDownloadedFileIds] = useState([]);
  const [downloadPercentage, setDownloadPercentage] = useState(0);

  const [dark, setDark] = useState(isDarkMode);
  const studentEmail = getEmailFromToken();

  // ✅ Load files + progress on mount
  useEffect(() => {
    fileService
      .getStudentFiles()
      .then(async (res) => {
        const data = res.data || [];
        setDocs(data);

        if (data.length > 0 && studentEmail) {
          try {
            const prog = await progressService.getFileProgress(
              studentEmail,
              data[0].batchId,
            );
            setDownloadedFileIds(prog.data.downloadedFileIds || []);
            setDownloadPercentage(prog.data.downloadPercentage || 0);
          } catch {
            setDownloadedFileIds([]);
            setDownloadPercentage(0);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDarkMode()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // ✅ Open preview + mark as downloaded
  const openPreview = async (file) => {
    try {
      const res = await fileService.downloadFileBlob(file.storedName);
      const blob = new Blob([res.data], { type: file.contentType || "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPreview({ url, type: blob.type, name: file.originalName });

      if (studentEmail && file.batchId) {
        try {
          const prog = await progressService.markFileDownloaded(
            studentEmail,
            file.batchId,
            file.id,
            docs.length,
          );
          setDownloadedFileIds(prog.data.downloadedFileIds || []);
          setDownloadPercentage(prog.data.downloadPercentage || 0);
        } catch (err) {
          console.error("Mark downloaded failed", err);
        }
      }
    } catch {
      alert("Preview failed");
    }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const totalSizeKB = Math.round(docs.reduce((acc, d) => acc + (d.size || 0), 0) / 1024);

  const fileIcon = (type) => {
    if (type.includes("pdf"))     return { icon: <FaFilePdf />,   bg: "rgba(251,146,60,0.10)",  color: "var(--dc-accent2)" };
    if (type.startsWith("image")) return { icon: <FaFileImage />, bg: "rgba(52,211,153,0.10)",  color: "var(--dc-accent3)" };
    return                               { icon: <FaFile />,       bg: "rgba(34,211,238,0.10)",  color: "var(--dc-accent1)" };
  };

  return (
    <div className={`dc-root${dark ? " dc-dark" : ""}`}>
      <div className="dc-inner">

        {/* ── Header ── */}
        <div className="dc-header">
          <div className="dc-header-left">
            <div className="dc-header-icon-box"><FaFileAlt /></div>
            <div>
              <div className="dc-badge"><FaFileAlt style={{ fontSize: 9 }} /> Documents</div>
              <h1 className="dc-h1">Documents</h1>
              <p className="dc-subtitle">Access all study materials shared by your trainers</p>
            </div>
          </div>

          <div className="dc-stats">
            <div className="dc-stat">
              <div className="dc-stat-icon" style={{ background: "rgba(34,211,238,0.10)", color: "var(--dc-accent1)" }}>
                <FaFileAlt />
              </div>
              <div>
                <div className="dc-stat-val" style={{ color: "var(--dc-accent1)" }}>{docs.length}</div>
                <div className="dc-stat-lbl">Files</div>
              </div>
            </div>

            <div className="dc-stat">
              <div className="dc-stat-icon" style={{ background: "rgba(251,146,60,0.10)", color: "var(--dc-accent2)" }}>
                <FaFile />
              </div>
              <div>
                <div className="dc-stat-val" style={{ color: "var(--dc-accent2)" }}>{totalSizeKB}</div>
                <div className="dc-stat-lbl">Storage KB</div>
              </div>
            </div>

            {/* ✅ Previewed progress stat */}
            {docs.length > 0 && (
              <div className="dc-stat">
                <div className="dc-stat-icon" style={{ background: "rgba(52,211,153,0.10)", color: "var(--dc-accent3)" }}>
                  <FaCheckCircle />
                </div>
                <div>
                  <div className="dc-stat-val" style={{ color: "var(--dc-accent3)" }}>
                    {downloadedFileIds.length} / {docs.length}
                  </div>
                  <div className="dc-stat-lbl">Previewed</div>
                  <div className="dc-progress-bar-wrap">
                    <div className="dc-progress-bar" style={{ width: `${downloadPercentage}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── List ── */}
        <div className="dc-list">
          {docs.map((d) => {
            const type = d.contentType || "";
            const { icon, bg, color } = fileIcon(type);
            // ✅ Check downloadedFileIds from backend
            const isPreviewed = downloadedFileIds.includes(d.id);

            return (
              <div key={d.id} className={`dc-item${isPreviewed ? " previewed" : ""}`}>
                <div className="dc-item-left">
                  <div className="dc-item-icon" style={{ background: bg, color }}>
                    {icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p className="dc-item-name">{d.originalName}</p>
                    <div className="dc-item-meta">
                      <span>{type.split("/")[1]?.toUpperCase() || "FILE"}</span>
                      <span>{Math.round(d.size / 1024)} KB</span>
                      {isPreviewed && (
                        <span className="dc-previewed-badge">
                          <FaCheckCircle size={10} /> Previewed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Button changes after preview */}
                <button
                  className={`dc-preview-btn${isPreviewed ? " seen" : " new"}`}
                  onClick={() => openPreview(d)}
                >
                  <FaEye style={{ fontSize: 12 }} />
                  {isPreviewed ? "View Again" : "Preview"}
                </button>
              </div>
            );
          })}

          {docs.length === 0 && (
            <div className="dc-empty">
              <div className="dc-empty-icon"><FaFileAlt /></div>
              No documents available
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {preview && (
        <div className={`dc-modal-overlay${dark ? " dc-dark" : ""}`}>
          <div className="dc-modal">
            <div className="dc-modal-head">
              <p className="dc-modal-name">{preview.name}</p>
              <button className="dc-modal-close" onClick={closePreview}><FaTimes /></button>
            </div>
            <div className="dc-modal-body">
              {preview.type.includes("pdf") && (
                <iframe src={preview.url} title="PDF Preview" style={{ width: "100%", height: "100%", border: "none" }} />
              )}
              {preview.type.startsWith("image") && (
                <img src={preview.url} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              )}
              {!preview.type.includes("pdf") && !preview.type.startsWith("image") && (
                <div className="dc-no-preview">
                  <div className="dc-no-preview-icon"><FaFileAlt /></div>
                  Preview not available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;