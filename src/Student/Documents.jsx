
// import React, { useEffect, useState } from "react";
// import fileService from "../services/fileService";
// import { progressService } from "../services/progressService";
// import { FaEye, FaTimes, FaFileAlt, FaFile, FaFilePdf, FaFileImage, FaCheckCircle } from "react-icons/fa";

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

//   .dc-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

//   .dc-header {
//     background: var(--dc-card);
//     border: 1px solid var(--dc-border);
//     border-radius: var(--dc-radius);
//     padding: 28px 32px;
//     box-shadow: var(--dc-shadow);
//     display: flex; align-items: center; justify-content: space-between;
//     gap: 20px; flex-wrap: wrap;
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
//     background: rgba(167,139,250,0.08); color: var(--dc-accent4);
//     font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
//     text-transform: uppercase; margin-bottom: 6px;
//   }

//   .dc-h1 { font-size: 24px; font-weight: 800; color: var(--dc-text); margin: 0 0 2px; }
//   .dc-subtitle { font-size: 13px; color: var(--dc-muted); margin: 0; }

//   .dc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

//   .dc-stat {
//     display: flex; align-items: center; gap: 10px;
//     padding: 12px 18px; border-radius: 14px;
//     background: var(--dc-bg); border: 1px solid var(--dc-border);
//     box-shadow: var(--dc-shadow);
//   }

//   .dc-stat-icon {
//     width: 36px; height: 36px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 14px; flex-shrink: 0;
//   }

//   .dc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
//   .dc-stat-lbl { font-size: 10px; font-weight: 600; color: var(--dc-muted); text-transform: uppercase; letter-spacing: 0.06em; }

//   /* progress bar inside stat */
//   .dc-progress-bar-wrap {
//     width: 64px; height: 4px; border-radius: 99px;
//     background: rgba(52,211,153,0.15); overflow: hidden; margin-top: 4px;
//   }

//   .dc-progress-bar {
//     height: 100%; border-radius: 99px; background: var(--dc-accent3);
//     transition: width 0.5s ease;
//   }

//   .dc-list { display: flex; flex-direction: column; gap: 10px; }

//   .dc-item {
//     display: flex; align-items: center; justify-content: space-between;
//     gap: 12px; padding: 16px 20px;
//     background: var(--dc-card);
//     border: 1px solid var(--dc-border);
//     border-radius: 16px; box-shadow: var(--dc-shadow);
//     transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
//   }

//   .dc-item:hover { transform: translateY(-2px); box-shadow: var(--dc-shadow-lg); border-color: rgba(167,139,250,0.20); }

//   /* watched state */
//   .dc-item.previewed {
//     background: rgba(52,211,153,0.04);
//     border-color: rgba(52,211,153,0.25);
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

//   .dc-item-meta { display: flex; gap: 8px; font-size: 11px; color: var(--dc-muted); align-items: center; }

//   .dc-item-meta span {
//     padding: 2px 7px; border-radius: 6px;
//     background: var(--dc-bg); border: 1px solid var(--dc-border);
//   }

//   .dc-previewed-badge {
//     display: inline-flex; align-items: center; gap: 4px;
//     font-size: 10px; font-weight: 700; color: var(--dc-accent3);
//   }

//   .dc-preview-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 9px 16px; border-radius: 10px; border: none;
//     font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
//     cursor: pointer; transition: opacity 0.2s, transform 0.15s;
//     white-space: nowrap; flex-shrink: 0;
//   }

//   .dc-preview-btn:hover { opacity: 0.85; transform: translateY(-1px); }

//   .dc-preview-btn.new { background: var(--dc-accent4); color: #0a0a0a; }
//   .dc-preview-btn.seen { background: var(--dc-accent3); color: #0a0a0a; }

//   .dc-empty { text-align: center; padding: 60px 20px; color: var(--dc-muted); font-size: 14px; font-weight: 500; }
//   .dc-empty-icon { font-size: 40px; opacity: 0.4; margin-bottom: 12px; }

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
//     width: 90vw; height: 90vh; overflow: hidden;
//     display: flex; flex-direction: column;
//     box-shadow: var(--dc-shadow-lg);
//   }

//   .dc-modal-head {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 14px 20px; border-bottom: 1px solid var(--dc-border); flex-shrink: 0;
//   }

//   .dc-modal-name { font-size: 13px; font-weight: 700; color: var(--dc-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }

//   .dc-modal-close {
//     width: 32px; height: 32px; border-radius: 8px; border: none;
//     background: var(--dc-bg); color: var(--dc-muted);
//     display: flex; align-items: center; justify-content: center;
//     cursor: pointer; font-size: 14px; transition: background 0.2s, color 0.2s;
//   }

//   .dc-modal-close:hover { background: rgba(248,113,113,0.12); color: #f87171; }

//   .dc-modal-body {
//     flex: 1; overflow: hidden; background: var(--dc-bg);
//     display: flex; align-items: center; justify-content: center;
//   }

//   .dc-no-preview { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--dc-muted); font-size: 14px; }
//   .dc-no-preview-icon { font-size: 44px; opacity: 0.4; }
// `;

// if (!document.getElementById("dc-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "dc-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// // ✅ Decode email from JWT
// const getEmailFromToken = () => {
//   try {
//     const token = localStorage.getItem("lms_token");
//     if (!token) return null;
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch {
//     return null;
//   }
// };

// const isDarkMode = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const Documents = () => {
//   const [docs, setDocs] = useState([]);
//   const [preview, setPreview] = useState(null);

//   // ✅ Progress state from backend
//   const [downloadedFileIds, setDownloadedFileIds] = useState([]);
//   const [downloadPercentage, setDownloadPercentage] = useState(0);

//   const [dark, setDark] = useState(isDarkMode);
//   const studentEmail = getEmailFromToken();

//   // ✅ Load files + progress on mount
//   useEffect(() => {
//     fileService
//       .getStudentFiles()
//       .then(async (res) => {
//         const data = res.data || [];
//         setDocs(data);

//         if (data.length > 0 && studentEmail) {
//           try {
//             const prog = await progressService.getFileProgress(
//               studentEmail,
//               data[0].batchId,
//             );
//             setDownloadedFileIds(prog.data.downloadedFileIds || []);
//             setDownloadPercentage(prog.data.downloadPercentage || 0);
//           } catch {
//             setDownloadedFileIds([]);
//             setDownloadPercentage(0);
//           }
//         }
//       })
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDarkMode()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   // ✅ Open preview + mark as downloaded
//   const openPreview = async (file) => {
//     try {
//       const res = await fileService.downloadFileBlob(file.storedName);
//       const blob = new Blob([res.data], { type: file.contentType || "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       setPreview({ url, type: blob.type, name: file.originalName });

//       if (studentEmail && file.batchId) {
//         try {
//           const prog = await progressService.markFileDownloaded(
//             studentEmail,
//             file.batchId,
//             file.id,
//             docs.length,
//           );
//           setDownloadedFileIds(prog.data.downloadedFileIds || []);
//           setDownloadPercentage(prog.data.downloadPercentage || 0);
//         } catch (err) {
//           console.error("Mark downloaded failed", err);
//         }
//       }
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
//     if (type.includes("pdf"))     return { icon: <FaFilePdf />,   bg: "rgba(251,146,60,0.10)",  color: "var(--dc-accent2)" };
//     if (type.startsWith("image")) return { icon: <FaFileImage />, bg: "rgba(52,211,153,0.10)",  color: "var(--dc-accent3)" };
//     return                               { icon: <FaFile />,       bg: "rgba(34,211,238,0.10)",  color: "var(--dc-accent1)" };
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

//             {/* ✅ Previewed progress stat */}
//             {docs.length > 0 && (
//               <div className="dc-stat">
//                 <div className="dc-stat-icon" style={{ background: "rgba(52,211,153,0.10)", color: "var(--dc-accent3)" }}>
//                   <FaCheckCircle />
//                 </div>
//                 <div>
//                   <div className="dc-stat-val" style={{ color: "var(--dc-accent3)" }}>
//                     {downloadedFileIds.length} / {docs.length}
//                   </div>
//                   <div className="dc-stat-lbl">Previewed</div>
//                   <div className="dc-progress-bar-wrap">
//                     <div className="dc-progress-bar" style={{ width: `${downloadPercentage}%` }} />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── List ── */}
//         <div className="dc-list">
//           {docs.map((d) => {
//             const type = d.contentType || "";
//             const { icon, bg, color } = fileIcon(type);
//             // ✅ Check downloadedFileIds from backend
//             const isPreviewed = downloadedFileIds.includes(d.id);

//             return (
//               <div key={d.id} className={`dc-item${isPreviewed ? " previewed" : ""}`}>
//                 <div className="dc-item-left">
//                   <div className="dc-item-icon" style={{ background: bg, color }}>
//                     {icon}
//                   </div>
//                   <div style={{ minWidth: 0 }}>
//                     <p className="dc-item-name">{d.originalName}</p>
//                     <div className="dc-item-meta">
//                       <span>{type.split("/")[1]?.toUpperCase() || "FILE"}</span>
//                       <span>{Math.round(d.size / 1024)} KB</span>
//                       {isPreviewed && (
//                         <span className="dc-previewed-badge">
//                           <FaCheckCircle size={10} /> Previewed
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* ✅ Button changes after preview */}
//                 <button
//                   className={`dc-preview-btn${isPreviewed ? " seen" : " new"}`}
//                   onClick={() => openPreview(d)}
//                 >
//                   <FaEye style={{ fontSize: 12 }} />
//                   {isPreviewed ? "View Again" : "Preview"}
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

// export default Documents;




















import React, { useEffect, useState } from "react";
import fileService from "../services/fileService";
import { progressService } from "../services/progressService";
import {
  FaCheckCircle, FaEye, FaFile, FaFileAlt,
  FaFileImage, FaFilePdf, FaTimes,
} from "react-icons/fa";

/* ─── Styles ─────────────────────────────────────────────────── */
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
    font-family: 'Poppins', sans-serif; min-height: 100vh;
    background: var(--dc-bg); color: var(--dc-text);
    padding: 24px; box-sizing: border-box; transition: background 0.3s;
  }

  .dc-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  .dc-header {
    border-radius: var(--dc-radius); padding: 28px 32px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
    box-shadow: 0 8px 32px rgba(99,102,241,0.3);
    display: flex; align-items: center; justify-content: space-between;
    gap: 20px; flex-wrap: wrap;
  }

  .dc-header-left { display: flex; align-items: center; gap: 16px; }

  .dc-header-icon-box {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0; font-size: 22px;
  }

  .dc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 50px;
    background: rgba(255,255,255,0.2); color: #fff;
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 6px;
  }

  .dc-h1   { font-size: 24px; font-weight: 800; color: #fff; margin: 0 0 2px; }
  .dc-subtitle { font-size: 13px; color: rgba(255,255,255,0.85); margin: 0; }

  .dc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

  .dc-stat {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 14px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.20);
  }

  .dc-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0; color: #fff;
  }

  .dc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; color: #fff; }
  .dc-stat-lbl { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.06em; }

  .dc-progress-bar-wrap {
    width: 64px; height: 4px; border-radius: 99px;
    background: rgba(255,255,255,0.2); overflow: hidden; margin-top: 4px;
  }
  .dc-progress-bar { height: 100%; border-radius: 99px; background: #34d399; transition: width 0.5s ease; }

  .dc-unlock-banner {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 12px;
    background: rgba(251,146,60,0.08); border: 1px solid rgba(251,146,60,0.22);
    font-size: 12px; font-weight: 600; color: #fb923c;
    font-family: 'Poppins', sans-serif;
  }

  .dc-list { display: flex; flex-direction: column; gap: 10px; }

  .dc-item {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 16px 20px;
    background: var(--dc-card); border: 1px solid var(--dc-border);
    border-radius: 16px; box-shadow: var(--dc-shadow);
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }

  .dc-item:hover { transform: translateY(-2px); box-shadow: var(--dc-shadow-lg); border-color: rgba(167,139,250,0.20); }
  .dc-item.previewed { background: rgba(52,211,153,0.04); border-color: rgba(52,211,153,0.25); }
  .dc-item.locked { opacity: 0.45; }

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

  .dc-item-meta {
    display: flex; gap: 8px; font-size: 11px; color: var(--dc-muted);
    align-items: center; flex-wrap: wrap;
  }

  .dc-item-meta .dc-chip {
    padding: 2px 7px; border-radius: 6px;
    background: var(--dc-bg); border: 1px solid var(--dc-border);
  }

  .dc-category-chip {
    padding: 2px 7px; border-radius: 6px;
    font-size: 11px; font-weight: 700;
    color: #7c3aed; background: rgba(124,58,237,0.10);
    border: 1px solid rgba(124,58,237,0.18);
  }

  .dc-previewed-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; color: var(--dc-accent3);
  }

  .dc-view-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 10px; border: none;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s;
    white-space: nowrap; flex-shrink: 0;
    background: var(--dc-accent4); color: #0a0a0a;
  }

  .dc-view-btn.seen   { background: var(--dc-accent3); }
  .dc-view-btn.locked { background: var(--dc-border); color: var(--dc-muted); cursor: not-allowed; }
  .dc-view-btn:not(.locked):hover { opacity: 0.85; transform: translateY(-1px); }

  .dc-empty { text-align: center; padding: 60px 20px; color: var(--dc-muted); font-size: 14px; font-weight: 500; }
  .dc-empty-icon { font-size: 40px; opacity: 0.4; margin-bottom: 12px; }

  .dc-modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(4px);
  }

  .dc-modal {
    background: var(--dc-card); border: 1px solid var(--dc-border);
    border-radius: var(--dc-radius); width: 90vw; height: 90vh;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: var(--dc-shadow-lg);
  }

  .dc-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; border-bottom: 1px solid var(--dc-border); flex-shrink: 0;
  }

  .dc-modal-name {
    font-size: 13px; font-weight: 700; color: var(--dc-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0;
  }

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

  .dc-office-body {
    flex: 1; overflow-y: auto; background: #ffffff;
    padding: 40px; box-sizing: border-box;
  }

  .dc-office-body .dc-docx-content {
    max-width: 860px; margin: 0 auto;
    font-family: 'Calibri', 'Segoe UI', sans-serif;
    font-size: 14px; line-height: 1.7; color: #1a1a1a;
  }

  .dc-office-body .dc-docx-content table {
    border-collapse: collapse; width: 100%; margin: 16px 0;
  }
  .dc-office-body .dc-docx-content table td,
  .dc-office-body .dc-docx-content table th {
    border: 1px solid #d1d5db; padding: 8px 12px; font-size: 13px;
  }
  .dc-office-body .dc-docx-content table th {
    background: #f3f4f6; font-weight: 700;
  }

  .dc-xlsx-body {
    flex: 1; overflow: auto; background: #ffffff; padding: 24px;
  }

  .dc-xlsx-table {
    border-collapse: collapse; font-size: 12px;
    font-family: 'Poppins', sans-serif; white-space: nowrap;
  }

  .dc-xlsx-table th {
    background: #6366f1; color: #fff; padding: 8px 14px;
    font-weight: 700; border: 1px solid #4f46e5; position: sticky; top: 0;
  }

  .dc-xlsx-table td {
    padding: 7px 14px; border: 1px solid #e2e8f0; color: #1a1a1a;
  }

  .dc-xlsx-table tr:nth-child(even) td { background: #f8fafc; }
  .dc-xlsx-table tr:hover td { background: #ede9fe; }

  .dc-xlsx-sheet-tabs {
    display: flex; gap: 6px; padding: 12px 24px 0; background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0; flex-shrink: 0; flex-wrap: wrap;
  }

  .dc-xlsx-tab {
    padding: 6px 14px; border-radius: 8px 8px 0 0; font-size: 12px;
    font-weight: 600; cursor: pointer; border: none;
    font-family: 'Poppins', sans-serif; transition: all 0.15s;
  }

  .dc-xlsx-tab.active { background: #6366f1; color: #fff; }
  .dc-xlsx-tab:not(.active) { background: #e2e8f0; color: #64748b; }
  .dc-xlsx-tab:not(.active):hover { background: #c7d2fe; color: #4338ca; }

  .dc-loading {
    display: flex; flex-direction: column; align-items: center;
    gap: 12px; color: var(--dc-muted); font-size: 14px; font-weight: 500;
    font-family: 'Poppins', sans-serif;
  }

  .dc-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid var(--dc-border);
    border-top-color: #6366f1;
    animation: dc-spin 0.7s linear infinite;
  }

  @keyframes dc-spin { to { transform: rotate(360deg); } }

  .dc-no-preview {
    display: flex; flex-direction: column; align-items: center;
    gap: 12px; color: var(--dc-muted); font-size: 14px;
    font-family: 'Poppins', sans-serif; text-align: center; padding: 40px;
  }
  .dc-no-preview-icon { font-size: 44px; opacity: 0.35; }
`;

if (!document.getElementById("dc-styles")) {
  const tag = document.createElement("style");
  tag.id = "dc-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

/* ─── Load scripts dynamically ──────────────────────────────── */
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

/* ─── Helpers ─────────────────────────────────────────────── */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch { return null; }
};

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const getViewMode = (originalName = "", contentType = "") => {
  const name = originalName.toLowerCase();
  const type = contentType.toLowerCase();
  if (name.endsWith(".pdf")  || type.includes("pdf"))                         return "pdf";
  if (name.match(/\.(png|jpg|jpeg|gif|webp)$/) || type.startsWith("image"))  return "image";
  if (name.endsWith(".txt")  || type.includes("text/plain"))                  return "text";
  if (name.match(/\.(docx|doc)$/))                                            return "docx";
  if (name.match(/\.(xlsx|xls)$/))                                            return "xlsx";
  if (name.match(/\.(pptx|ppt)$/))                                            return "pptx";
  return "none";
};

const fileIconInfo = (originalName = "", contentType = "") => {
  const name = originalName.toLowerCase();
  const type = contentType.toLowerCase();
  if (name.endsWith(".pdf") || type.includes("pdf"))
    return { icon: <FaFilePdf />, bg: "rgba(251,146,60,0.10)", color: "#fb923c" };
  if (type.startsWith("image") || name.match(/\.(png|jpg|jpeg|gif|webp)$/))
    return { icon: <FaFileImage />, bg: "rgba(52,211,153,0.10)", color: "#34d399" };
  return { icon: <FaFile />, bg: "rgba(34,211,238,0.10)", color: "#22d3ee" };
};

/* ─── DOCX Viewer ─────────────────────────────────────────── */
const DocxViewer = ({ arrayBuffer }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js");
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        setHtml(result.value || "<p>No content found.</p>");
      } catch (e) {
        console.error("DOCX render error:", e);
        setError("Could not render this Word document.");
      }
    })();
  }, [arrayBuffer]);

  if (error) return (
    <div className="dc-no-preview">
      <div className="dc-no-preview-icon">📄</div>
      <p style={{ fontWeight: 700, margin: "0 0 6px", color: "#0f172a" }}>{error}</p>
    </div>
  );

  if (!html) return (
    <div className="dc-loading">
      <div className="dc-spinner" />
      Rendering document…
    </div>
  );

  return (
    <div className="dc-office-body">
      <div
        className="dc-docx-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

/* ─── XLSX Viewer ─────────────────────────────────────────── */
const XlsxViewer = ({ arrayBuffer }) => {
  const [sheets, setSheets] = useState({});
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
        const workbook = window.XLSX.read(arrayBuffer, { type: "array" });
        const names = workbook.SheetNames;
        const parsed = {};
        names.forEach((name) => {
          parsed[name] = window.XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 });
        });
        setSheets(parsed);
        setSheetNames(names);
        setActiveSheet(names[0] || "");
      } catch (e) {
        console.error("XLSX render error:", e);
        setError("Could not render this spreadsheet.");
      }
    })();
  }, [arrayBuffer]);

  if (error) return (
    <div className="dc-no-preview">
      <div className="dc-no-preview-icon">📊</div>
      <p style={{ fontWeight: 700, margin: "0 0 6px", color: "#0f172a" }}>{error}</p>
    </div>
  );

  if (!activeSheet) return (
    <div className="dc-loading">
      <div className="dc-spinner" />
      Rendering spreadsheet…
    </div>
  );

  const rows = sheets[activeSheet] || [];
  const headers = rows[0] || [];
  const dataRows = rows.slice(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {sheetNames.length > 1 && (
        <div className="dc-xlsx-sheet-tabs">
          {sheetNames.map((name) => (
            <button
              key={name}
              className={`dc-xlsx-tab${activeSheet === name ? " active" : ""}`}
              onClick={() => setActiveSheet(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <div className="dc-xlsx-body">
        <table className="dc-xlsx-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h !== undefined && h !== null ? String(h) : ""}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {headers.map((_, ci) => (
                  <td key={ci}>{row[ci] !== undefined && row[ci] !== null ? String(row[ci]) : ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {dataRows.length === 0 && (
          <p style={{ color: "#64748b", fontFamily: "'Poppins',sans-serif", fontSize: 13, textAlign: "center", marginTop: 24 }}>
            This sheet is empty.
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── PPTX Viewer ─────────────────────────────────────────── */
const PptxViewer = ({ arrayBuffer, fileName }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Use JSZip to unzip the PPTX and extract slide text
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");

        const zip = await window.JSZip.loadAsync(arrayBuffer);
        const slideFiles = Object.keys(zip.files)
          .filter((f) => f.match(/^ppt\/slides\/slide\d+\.xml$/))
          .sort((a, b) => {
            const na = parseInt(a.match(/\d+/)[0]);
            const nb = parseInt(b.match(/\d+/)[0]);
            return na - nb;
          });

        if (slideFiles.length === 0) {
          setError("No slides found in this presentation.");
          return;
        }

        const parsedSlides = await Promise.all(
          slideFiles.map(async (slideFile) => {
            const xmlStr = await zip.files[slideFile].async("string");
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlStr, "application/xml");

            // Extract all text runs
            const textElements = xmlDoc.querySelectorAll("t");
            const texts = [];
            textElements.forEach((el) => {
              const text = el.textContent?.trim();
              if (text) texts.push(text);
            });

            return texts;
          })
        );

        setSlides(parsedSlides);
        setCurrentSlide(0);
      } catch (e) {
        console.error("PPTX render error:", e);
        setError("Could not render this presentation.");
      }
    })();
  }, [arrayBuffer]);

  if (error) return (
    <div className="dc-no-preview">
      <div className="dc-no-preview-icon">📊</div>
      <p style={{ fontWeight: 700, margin: "0 0 6px", color: "#0f172a" }}>{error}</p>
    </div>
  );

  if (slides.length === 0) return (
    <div className="dc-loading">
      <div className="dc-spinner" />
      Rendering presentation…
    </div>
  );

  const slide = slides[currentSlide] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#1e1e2e" }}>
      {/* Slide area */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{
          width: "100%", maxWidth: 720, minHeight: 380,
          background: "#ffffff", borderRadius: 12,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          padding: "40px 48px", boxSizing: "border-box",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#6366f1",
            fontFamily: "'Poppins',sans-serif", letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 8,
          }}>
            Slide {currentSlide + 1} / {slides.length}
          </div>
          {slide.length === 0 ? (
            <p style={{ color: "#94a3b8", fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>
              (Empty slide or image-only content)
            </p>
          ) : (
            slide.map((text, i) => {
              const isTitle = i === 0;
              return (
                <p key={i} style={{
                  margin: 0,
                  fontSize: isTitle ? 20 : 14,
                  fontWeight: isTitle ? 700 : 400,
                  color: isTitle ? "#1e1b4b" : "#374151",
                  fontFamily: "'Poppins',sans-serif",
                  lineHeight: 1.6,
                }}>
                  {isTitle ? text : `• ${text}`}
                </p>
              );
            })
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 12, padding: "12px 20px", background: "rgba(0,0,0,0.4)",
        flexShrink: 0,
      }}>
        <button
          onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
          disabled={currentSlide === 0}
          style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: currentSlide === 0 ? "rgba(255,255,255,0.1)" : "#6366f1",
            color: currentSlide === 0 ? "rgba(255,255,255,0.3)" : "#fff",
            fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
            cursor: currentSlide === 0 ? "not-allowed" : "pointer", transition: "all 0.2s",
          }}
        >
          ← Prev
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? 24 : 8,
                height: 8, borderRadius: 4, border: "none",
                background: i === currentSlide ? "#6366f1" : "rgba(255,255,255,0.3)",
                cursor: "pointer", transition: "all 0.2s", padding: 0,
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
          disabled={currentSlide === slides.length - 1}
          style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.1)" : "#6366f1",
            color: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.3)" : "#fff",
            fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
            cursor: currentSlide === slides.length - 1 ? "not-allowed" : "pointer", transition: "all 0.2s",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

/* ─── Component ─────────────────────────────────────────────── */
const Documents = () => {
  const [docs, setDocs]     = useState([]);
  const [preview, setPreview] = useState(null);

  const [downloadedFileIds, setDownloadedFileIds]   = useState([]);
  const [downloadPercentage, setDownloadPercentage] = useState(0);

  const [dark, setDark] = useState(isDarkMode);
  const studentEmail    = getEmailFromToken();

  useEffect(() => {
    fileService.getStudentFiles()
      .then(async (res) => {
        const data = res.data || [];
        setDocs(data);
        if (data.length > 0 && studentEmail) {
          try {
            const prog = await progressService.getFileProgress(studentEmail, data[0].batchId);
            setDownloadedFileIds(prog.data.downloadedFileIds || []);
            setDownloadPercentage(prog.data.downloadPercentage || 0);
          } catch {
            setDownloadedFileIds([]); setDownloadPercentage(0);
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

  const openPreview = async (file) => {
    try {
      const res = await fileService.viewFileBlob(file.id);
      const contentType = res.headers["content-type"] || "application/octet-stream";
      const mode = getViewMode(file.originalName, contentType);

      // Mark progress for all file types
      if (studentEmail && file.batchId) {
        try {
          const prog = await progressService.markFileDownloaded(
            studentEmail, file.batchId, file.id, docs.length,
          );
          setDownloadedFileIds(prog.data.downloadedFileIds || []);
          setDownloadPercentage(prog.data.downloadPercentage || 0);
        } catch (err) { console.error("Mark progress failed", err); }
      }

      // For office files (docx/xlsx/pptx) — pass raw arrayBuffer
      if (["docx", "xlsx", "pptx"].includes(mode)) {
        setPreview({ mode, arrayBuffer: res.data, name: file.originalName });
        return;
      }

      // For pdf/image/text — create blob URL
      const blob = new Blob([res.data], { type: contentType });
      const url  = URL.createObjectURL(blob);
      setPreview({ mode, url, name: file.originalName });

    } catch {
      alert("Could not open file. Please try again.");
    }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const totalSizeKB = Math.round(docs.reduce((acc, d) => acc + (d.size || 0), 0) / 1024);

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
              <div className="dc-stat-icon"><FaFileAlt /></div>
              <div>
                <div className="dc-stat-val">{docs.length}</div>
                <div className="dc-stat-lbl">Files</div>
              </div>
            </div>
            <div className="dc-stat">
              <div className="dc-stat-icon"><FaFile /></div>
              <div>
                <div className="dc-stat-val">{totalSizeKB}</div>
                <div className="dc-stat-lbl">Storage KB</div>
              </div>
            </div>
            {docs.length > 0 && (
              <div className="dc-stat">
                <div className="dc-stat-icon"><FaCheckCircle /></div>
                <div>
                  <div className="dc-stat-val">{downloadedFileIds.length} / {docs.length}</div>
                  <div className="dc-stat-lbl">Previewed</div>
                  <div className="dc-progress-bar-wrap">
                    <div className="dc-progress-bar" style={{ width: `${downloadPercentage}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Banner ── */}
        {docs.length > 0 && (
          <div className="dc-unlock-banner">
            🔓 Files are unlocked sequentially — preview each file to unlock the next one
          </div>
        )}

        {/* ── List ── */}
        <div className="dc-list">
          {docs.map((d, index) => {
            const { icon, bg, color } = fileIconInfo(d.originalName, d.contentType || "");
            const isPreviewed    = downloadedFileIds.includes(d.id);
            const prevPreviewed  = index === 0 || downloadedFileIds.includes(docs[index - 1]?.id);
            const isLocked       = !isPreviewed && !prevPreviewed;

            const btnLabel = isLocked
              ? "🔒 Locked"
              : isPreviewed
                ? "View Again"
                : "View";

            return (
              <div key={d.id} className={`dc-item${isPreviewed ? " previewed" : ""}${isLocked ? " locked" : ""}`}>
                <div className="dc-item-left">
                  <div className="dc-item-icon" style={{ background: bg, color }}>{icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <p className="dc-item-name">{index + 1}. {d.originalName}</p>
                    <div className="dc-item-meta">
                      <span className="dc-chip">{d.contentType || d.originalName?.split(".").pop()?.toUpperCase() || "FILE"}</span>
                      <span className="dc-chip">{Math.round((d.size || 0) / 1024)} KB</span>
                      {d.category && <span className="dc-category-chip">{d.category}</span>}
                      {isPreviewed && (
                        <span className="dc-previewed-badge">
                          <FaCheckCircle size={10} /> Previewed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className={`dc-view-btn${isPreviewed ? " seen" : ""}${isLocked ? " locked" : ""}`}
                  onClick={() => !isLocked && openPreview(d)}
                  disabled={isLocked}
                >
                  <FaEye style={{ fontSize: 12 }} />
                  {btnLabel}
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

            {/* PDF */}
            {preview.mode === "pdf" && (
              <div className="dc-modal-body">
                <iframe src={preview.url} title="PDF"
                  style={{ width: "100%", height: "100%", border: "none" }} />
              </div>
            )}

            {/* Image */}
            {preview.mode === "image" && (
              <div className="dc-modal-body">
                <img src={preview.url} alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            )}

            {/* Plain text */}
            {preview.mode === "text" && (
              <div className="dc-modal-body">
                <iframe src={preview.url} title="Text"
                  style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} />
              </div>
            )}

            {/* DOCX — mammoth renders to HTML */}
            {preview.mode === "docx" && (
              <DocxViewer arrayBuffer={preview.arrayBuffer} />
            )}

            {/* XLSX — SheetJS renders table */}
            {preview.mode === "xlsx" && (
              <XlsxViewer arrayBuffer={preview.arrayBuffer} />
            )}

            {/* PPTX — slide-by-slide text viewer */}
            {preview.mode === "pptx" && (
              <PptxViewer arrayBuffer={preview.arrayBuffer} fileName={preview.name} />
            )}

            {/* Unknown / ZIP */}
            {preview.mode === "none" && (
              <div className="dc-modal-body">
                <div className="dc-no-preview">
                  <div className="dc-no-preview-icon">📦</div>
                  <p style={{ fontWeight: 700, margin: "0 0 6px", color: "var(--dc-text)" }}>
                    Preview not available
                  </p>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    This file type cannot be viewed in the browser.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;