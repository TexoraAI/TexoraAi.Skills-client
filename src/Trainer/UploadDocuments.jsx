// import {
//   CheckCircle, ChevronDown, Eye, Folder,
//   Loader2, Plus, Sparkles, Trash2, UploadCloud, X,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { courseService } from "../services/courseService";
// import fileService from "../services/fileService";
// import videoService from "../services/videoService";
// import {
//   CardHeader, FieldLabel, PageHero, PageShell,
//   Pill, PrimaryButton, ThemedCard, ThemedInput,
//   ThemedSelect, ThemedTextarea, useTrainerTheme,
// } from "./trainerTheme";

// /* ─────────────────── HELPERS ─────────────────── */
// const extractTitle = (fileName) =>
//   fileName
//     .replace(/\.[^/.]+$/, "")
//     .replace(/[_-]/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// const DEFAULT_CATEGORIES = [
//   "Notes", "Assignment", "Slides", "Study Material",
//   "Reference Material", "Syllabus", "Question Bank",
//   "Previous Year Papers", "Lab Manual", "Case Study",
// ];

// const getViewMode = (originalName = "", contentType = "") => {
//   const name = originalName.toLowerCase();
//   const type = contentType.toLowerCase();
//   if (name.endsWith(".pdf")  || type.includes("pdf"))                         return "pdf";
//   if (name.match(/\.(png|jpg|jpeg|gif|webp)$/) || type.startsWith("image"))  return "image";
//   if (name.endsWith(".txt")  || type.includes("text/plain"))                  return "text";
//   if (name.match(/\.(docx|doc)$/))                                            return "docx";
//   if (name.match(/\.(xlsx|xls)$/))                                            return "xlsx";
//   if (name.match(/\.(pptx|ppt)$/))                                            return "pptx";
//   return "none";
// };

// /* ─── Load scripts dynamically ──────────────────────────────── */
// const loadScript = (src) =>
//   new Promise((resolve, reject) => {
//     if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
//     const s = document.createElement("script");
//     s.src = src;
//     s.onload = resolve;
//     s.onerror = reject;
//     document.head.appendChild(s);
//   });

// /* ═══════════════════════════════════════════════════════════
//    DOCX VIEWER
// ═══════════════════════════════════════════════════════════ */
// const DocxViewer = ({ arrayBuffer, isDark }) => {
//   const [html, setHtml] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js");
//         const result = await window.mammoth.convertToHtml({ arrayBuffer });
//         setHtml(result.value || "<p>No content found.</p>");
//       } catch (e) {
//         console.error("DOCX render error:", e);
//         setError("Could not render this Word document.");
//       }
//     })();
//   }, [arrayBuffer]);

//   const bg   = isDark ? "#111" : "#fff";
//   const text = isDark ? "#e2e8f0" : "#1a1a1a";

//   if (error) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
//       color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "center", padding: 40 }}>
//       <div style={{ fontSize: 44, opacity: 0.4 }}>📄</div>
//       <p style={{ fontWeight: 700, margin: 0, color: text }}>{error}</p>
//     </div>
//   );

//   if (!html) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
//       color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>
//       <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)",
//         borderTopColor: "#6366f1", animation: "spin 0.7s linear infinite" }} />
//       Rendering document…
//     </div>
//   );

//   return (
//     <div style={{ flex: 1, overflowY: "auto", background: bg, padding: "40px",
//       boxSizing: "border-box" }}>
//       <div
//         style={{ maxWidth: 860, margin: "0 auto", fontFamily: "'Calibri','Segoe UI',sans-serif",
//           fontSize: 14, lineHeight: 1.7, color: text }}
//         dangerouslySetInnerHTML={{ __html: html }}
//       />
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════
//    XLSX VIEWER
// ═══════════════════════════════════════════════════════════ */
// const XlsxViewer = ({ arrayBuffer, isDark }) => {
//   const [sheets, setSheets] = useState({});
//   const [sheetNames, setSheetNames] = useState([]);
//   const [activeSheet, setActiveSheet] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
//         const workbook = window.XLSX.read(arrayBuffer, { type: "array" });
//         const names = workbook.SheetNames;
//         const parsed = {};
//         names.forEach((name) => {
//           parsed[name] = window.XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 });
//         });
//         setSheets(parsed);
//         setSheetNames(names);
//         setActiveSheet(names[0] || "");
//       } catch (e) {
//         console.error("XLSX render error:", e);
//         setError("Could not render this spreadsheet.");
//       }
//     })();
//   }, [arrayBuffer]);

//   const bg      = isDark ? "#111" : "#fff";
//   const text    = isDark ? "#e2e8f0" : "#1a1a1a";
//   const border  = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
//   const rowBg   = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";
//   const hoverBg = isDark ? "rgba(124,58,237,0.1)" : "#ede9fe";

//   if (error) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
//       color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "center", padding: 40 }}>
//       <div style={{ fontSize: 44, opacity: 0.4 }}>📊</div>
//       <p style={{ fontWeight: 700, margin: 0, color: text }}>{error}</p>
//     </div>
//   );

//   if (!activeSheet) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
//       color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>
//       <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)",
//         borderTopColor: "#6366f1", animation: "spin 0.7s linear infinite" }} />
//       Rendering spreadsheet…
//     </div>
//   );

//   const rows = sheets[activeSheet] || [];
//   const headers = rows[0] || [];
//   const dataRows = rows.slice(1);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
//       {sheetNames.length > 1 && (
//         <div style={{ display: "flex", gap: 6, padding: "12px 24px 0", background: isDark ? "#0a0a0a" : "#f1f5f9",
//           borderBottom: `1px solid ${border}`, flexShrink: 0, flexWrap: "wrap" }}>
//           {sheetNames.map((name) => (
//             <button key={name} onClick={() => setActiveSheet(name)} style={{
//               padding: "6px 14px", borderRadius: "8px 8px 0 0", fontSize: 12,
//               fontWeight: 600, cursor: "pointer", border: "none",
//               fontFamily: "'Poppins',sans-serif", transition: "all 0.15s",
//               background: activeSheet === name ? "#6366f1" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
//               color: activeSheet === name ? "#fff" : (isDark ? "#94a3b8" : "#64748b"),
//             }}>
//               {name}
//             </button>
//           ))}
//         </div>
//       )}
//       <div style={{ flex: 1, overflow: "auto", background: bg, padding: 24 }}>
//         <table style={{ borderCollapse: "collapse", fontSize: 12,
//           fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
//           <thead>
//             <tr>
//               {headers.map((h, i) => (
//                 <th key={i} style={{ background: "#6366f1", color: "#fff", padding: "8px 14px",
//                   fontWeight: 700, border: `1px solid #4f46e5`, position: "sticky", top: 0 }}>
//                   {h !== undefined && h !== null ? String(h) : ""}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {dataRows.map((row, ri) => (
//               <tr key={ri}>
//                 {headers.map((_, ci) => (
//                   <td key={ci} style={{ padding: "7px 14px", border: `1px solid ${border}`,
//                     color: text, background: ri % 2 === 1 ? rowBg : "transparent" }}>
//                     {row[ci] !== undefined && row[ci] !== null ? String(row[ci]) : ""}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {dataRows.length === 0 && (
//           <p style={{ color: "#64748b", fontFamily: "'Poppins',sans-serif", fontSize: 13,
//             textAlign: "center", marginTop: 24 }}>
//             This sheet is empty.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════
//    PPTX VIEWER
// ═══════════════════════════════════════════════════════════ */
// const PptxViewer = ({ arrayBuffer, isDark }) => {
//   const [slides, setSlides] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
//         const zip = await window.JSZip.loadAsync(arrayBuffer);
//         const slideFiles = Object.keys(zip.files)
//           .filter((f) => f.match(/^ppt\/slides\/slide\d+\.xml$/))
//           .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

//         if (slideFiles.length === 0) { setError("No slides found."); return; }

//         const parsedSlides = await Promise.all(
//           slideFiles.map(async (slideFile) => {
//             const xmlStr = await zip.files[slideFile].async("string");
//             const xmlDoc = new DOMParser().parseFromString(xmlStr, "application/xml");
//             const texts = [];
//             xmlDoc.querySelectorAll("t").forEach((el) => {
//               const t = el.textContent?.trim();
//               if (t) texts.push(t);
//             });
//             return texts;
//           })
//         );
//         setSlides(parsedSlides);
//       } catch (e) {
//         console.error("PPTX render error:", e);
//         setError("Could not render this presentation.");
//       }
//     })();
//   }, [arrayBuffer]);

//   const text  = isDark ? "#e2e8f0" : "#1a1a1a";

//   if (error) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
//       color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "center", padding: 40 }}>
//       <div style={{ fontSize: 44, opacity: 0.4 }}>📊</div>
//       <p style={{ fontWeight: 700, margin: 0, color: text }}>{error}</p>
//     </div>
//   );

//   if (slides.length === 0) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
//       color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>
//       <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)",
//         borderTopColor: "#6366f1", animation: "spin 0.7s linear infinite" }} />
//       Rendering presentation…
//     </div>
//   );

//   const slide = slides[currentSlide] || [];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#1e1e2e" }}>
//       <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center",
//         justifyContent: "center", padding: 24 }}>
//         <div style={{ width: "100%", maxWidth: 720, minHeight: 380,
//           background: "#ffffff", borderRadius: 12,
//           boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
//           padding: "40px 48px", boxSizing: "border-box",
//           display: "flex", flexDirection: "column", gap: 12 }}>
//           <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1",
//             fontFamily: "'Poppins',sans-serif", letterSpacing: "0.08em",
//             textTransform: "uppercase", marginBottom: 8 }}>
//             Slide {currentSlide + 1} / {slides.length}
//           </div>
//           {slide.length === 0 ? (
//             <p style={{ color: "#94a3b8", fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>
//               (Empty slide or image-only content)
//             </p>
//           ) : slide.map((t, i) => (
//             <p key={i} style={{ margin: 0, fontSize: i === 0 ? 20 : 14,
//               fontWeight: i === 0 ? 700 : 400,
//               color: i === 0 ? "#1e1b4b" : "#374151",
//               fontFamily: "'Poppins',sans-serif", lineHeight: 1.6 }}>
//               {i === 0 ? t : `• ${t}`}
//             </p>
//           ))}
//         </div>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
//         gap: 12, padding: "12px 20px", background: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
//         <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
//           disabled={currentSlide === 0}
//           style={{ padding: "8px 20px", borderRadius: 8, border: "none",
//             background: currentSlide === 0 ? "rgba(255,255,255,0.1)" : "#6366f1",
//             color: currentSlide === 0 ? "rgba(255,255,255,0.3)" : "#fff",
//             fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
//             cursor: currentSlide === 0 ? "not-allowed" : "pointer" }}>
//           ← Prev
//         </button>
//         <div style={{ display: "flex", gap: 6 }}>
//           {slides.map((_, i) => (
//             <button key={i} onClick={() => setCurrentSlide(i)} style={{
//               width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4, border: "none",
//               background: i === currentSlide ? "#6366f1" : "rgba(255,255,255,0.3)",
//               cursor: "pointer", transition: "all 0.2s", padding: 0 }} />
//           ))}
//         </div>
//         <button onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
//           disabled={currentSlide === slides.length - 1}
//           style={{ padding: "8px 20px", borderRadius: 8, border: "none",
//             background: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.1)" : "#6366f1",
//             color: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.3)" : "#fff",
//             fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
//             cursor: currentSlide === slides.length - 1 ? "not-allowed" : "pointer" }}>
//           Next →
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════
//    FILE PREVIEW MODAL (Trainer)
// ═══════════════════════════════════════════════════════════ */
// const PreviewModal = ({ preview, onClose, isDark }) => {
//   if (!preview) return null;

//   const bg     = isDark ? "#111" : "#fff";
//   const border = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
//   const text   = isDark ? "#fff" : "#0f172a";
//   const muted  = isDark ? "#94a3b8" : "#64748b";

//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 999,
//       background: "rgba(0,0,0,0.75)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(4px)",
//     }}>
//       <div style={{
//         background: bg, border: `1px solid ${border}`,
//         borderRadius: 20, width: "90vw", height: "90vh",
//         display: "flex", flexDirection: "column",
//         boxShadow: "0 8px 40px rgba(0,0,0,0.4)", overflow: "hidden",
//       }}>
//         {/* Header */}
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "14px 20px", borderBottom: `1px solid ${border}`, flexShrink: 0,
//         }}>
//           <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: text,
//             fontFamily: "'Poppins',sans-serif", overflow: "hidden",
//             textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//             {preview.name}
//           </p>
//           <button onClick={onClose} style={{
//             width: 32, height: 32, borderRadius: 8, border: "none",
//             background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
//             color: muted, display: "flex", alignItems: "center",
//             justifyContent: "center", cursor: "pointer",
//           }}>
//             <X size={14} />
//           </button>
//         </div>

//         {/* Body */}
//         <div style={{
//           flex: 1, overflow: "hidden",
//           background: isDark ? "#0a0a0a" : "#f8fafc",
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}>
//           {/* PDF */}
//           {preview.mode === "pdf" && (
//             <iframe src={preview.url} title="PDF Preview"
//               style={{ width: "100%", height: "100%", border: "none" }} />
//           )}

//           {/* Image */}
//           {preview.mode === "image" && (
//             <img src={preview.url} alt="Preview"
//               style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
//           )}

//           {/* Plain text */}
//           {preview.mode === "text" && (
//             <iframe src={preview.url} title="Text Preview"
//               style={{ width: "100%", height: "100%", border: "none",
//                 background: "#fff", fontFamily: "monospace" }} />
//           )}

//           {/* DOCX */}
//           {preview.mode === "docx" && (
//             <DocxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />
//           )}

//           {/* XLSX */}
//           {preview.mode === "xlsx" && (
//             <XlsxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />
//           )}

//           {/* PPTX */}
//           {preview.mode === "pptx" && (
//             <PptxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />
//           )}

//           {/* Cannot preview (ZIP etc.) */}
//           {preview.mode === "none" && (
//             <div style={{ textAlign: "center", color: muted, fontFamily: "'Poppins',sans-serif" }}>
//               <div style={{ fontSize: 44, marginBottom: 12, opacity: 0.4 }}>📄</div>
//               <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>
//                 Preview not available
//               </p>
//               <p style={{ fontSize: 12, margin: 0 }}>
//                 This file type cannot be previewed in the browser.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════
//    CUSTOM CATEGORY DROPDOWN
// ═══════════════════════════════════════════════════════════ */
// const CategoryDropdown = ({ t, isDark, value, onChange, categories, onAddCategory }) => {
//   const [open, setOpen]     = useState(false);
//   const [newCat, setNewCat] = useState("");
//   const [error, setError]   = useState("");
//   const wrapperRef          = useRef(null);
//   const inputRef            = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setOpen(false); setNewCat(""); setError("");
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//     if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 50);
//   }, [open]);

//   const handleAdd = () => {
//     const trimmed = newCat.trim();
//     if (!trimmed) { setError("Please enter a category name"); return; }
//     if (categories.includes(trimmed)) { setError("Category already exists"); return; }
//     onAddCategory(trimmed);
//     setNewCat(""); setError(""); setOpen(false);
//   };

//   const dropBg     = isDark ? "#1a1a2e" : "#ffffff";
//   const dropBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
//   const hoverBg    = isDark ? "rgba(124,58,237,0.14)" : "rgba(124,58,237,0.07)";
//   const selectedBg = isDark ? "rgba(124,58,237,0.24)" : "rgba(124,58,237,0.11)";
//   const addBg      = isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.04)";
//   const addBorder  = isDark ? "rgba(124,58,237,0.3)"  : "rgba(124,58,237,0.2)";

//   return (
//     <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
//       <button
//         type="button"
//         onClick={() => { setOpen((p) => !p); setNewCat(""); setError(""); }}
//         style={{
//           width: "100%", display: "flex", alignItems: "center",
//           justifyContent: "space-between", height: 38, padding: "0 12px",
//           borderRadius: 10, border: `1px solid ${open ? "#7c3aed" : t.inputBorder}`,
//           background: t.inputBg, color: value ? t.text : t.textSub,
//           fontFamily: "'Poppins', sans-serif", fontSize: 13,
//           cursor: "pointer", outline: "none", transition: "border 0.15s",
//         }}
//       >
//         <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//           {value || "Select Category"}
//         </span>
//         <ChevronDown size={14} color={t.textSub} style={{
//           flexShrink: 0, marginLeft: 6,
//           transform: open ? "rotate(180deg)" : "rotate(0)",
//           transition: "transform 0.2s",
//         }} />
//       </button>

//       {open && (
//         <div style={{
//           position: "absolute", bottom: "calc(100% + 5px)", left: 0, right: 0,
//           background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 12,
//           boxShadow: isDark ? "0 -8px 32px rgba(0,0,0,0.6)" : "0 -6px 24px rgba(0,0,0,0.13)",
//           zIndex: 1000, overflow: "hidden", display: "flex", flexDirection: "column",
//         }}>
//           <div style={{ maxHeight: 210, overflowY: "auto" }}>
//             <div onClick={() => { onChange(""); setOpen(false); }} style={{
//               padding: "9px 14px", fontSize: 12, fontFamily: "'Poppins', sans-serif",
//               color: t.textSub, cursor: "pointer", borderBottom: `1px solid ${dropBorder}`,
//             }}>
//               Select Category
//             </div>
//             {categories.map((cat) => {
//               const sel = value === cat;
//               return (
//                 <div key={cat} onClick={() => { onChange(cat); setOpen(false); }} style={{
//                   padding: "10px 14px", fontSize: 13, fontFamily: "'Poppins', sans-serif",
//                   color: sel ? "#7c3aed" : t.text, fontWeight: sel ? 700 : 500,
//                   background: sel ? selectedBg : "transparent", cursor: "pointer",
//                   display: "flex", alignItems: "center", justifyContent: "space-between",
//                   transition: "background 0.1s",
//                 }}
//                   onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = hoverBg; }}
//                   onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
//                 >
//                   {cat}
//                   {sel && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
//                 </div>
//               );
//             })}
//           </div>
//           <div style={{ borderTop: `1px solid ${dropBorder}`, padding: "10px 12px", background: addBg }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
//               <Plus size={12} color="#7c3aed" />
//               <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: "#7c3aed", letterSpacing: "0.02em" }}>
//                 ADD NEW CATEGORY
//               </span>
//             </div>
//             <input ref={inputRef} value={newCat}
//               onChange={(e) => { setNewCat(e.target.value); setError(""); }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") { e.stopPropagation(); handleAdd(); }
//                 if (e.key === "Escape") setOpen(false);
//               }}
//               placeholder="Enter new category"
//               style={{
//                 width: "100%", boxSizing: "border-box", height: 32, padding: "0 10px",
//                 borderRadius: 8, border: `1px solid ${error ? "#f87171" : addBorder}`,
//                 background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
//                 fontFamily: "'Poppins', sans-serif", fontSize: 12,
//                 color: t.text, outline: "none", marginBottom: 7,
//               }}
//             />
//             <button type="button" onClick={handleAdd} style={{
//               width: "100%", height: 30, borderRadius: 8, border: "none",
//               cursor: "pointer", background: "#7c3aed", color: "#fff",
//               fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               gap: 5, transition: "opacity 0.15s",
//             }}>
//               <Plus size={12} /> Add Category
//             </button>
//             {error && <p style={{ margin: "5px 0 0", fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#f87171" }}>{error}</p>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════════════════ */
// const UploadDocuments = () => {
//   const { t, isDark } = useTrainerTheme();

//   const [file, setFile]               = useState(null);
//   const [files, setFiles]             = useState([]);
//   const [batches, setBatches]         = useState([]);
//   const [courses, setCourses]         = useState([]);
//   const [loading, setLoading]         = useState(false);
//   const [message, setMessage]         = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [isDragging, setIsDragging]   = useState(false);
//   const [preview, setPreview]         = useState(null);

//   const [title, setTitle]             = useState("");
//   const [description, setDescription] = useState("");
//   const [batchId, setBatchId]         = useState("");
//   const [courseId, setCourseId]       = useState("");
//   const [category, setCategory]       = useState("");
//   const [categories, setCategories]   = useState([...DEFAULT_CATEGORIES]);

//   useEffect(() => {
//     loadFiles(); loadBatches(); loadCourses();
//   }, []);

//   const loadFiles = async () => {
//     try { const res = await fileService.getTrainerFiles(); setFiles(res.data || []); }
//     catch (err) { console.error(err); }
//   };

//   const loadBatches = async () => {
//     try { const res = await videoService.getTrainerBatches(); setBatches(res.data || []); }
//     catch (err) { console.error("Failed to load batches", err); }
//   };

//   const loadCourses = async () => {
//     try { const res = await courseService.getMyCourses(); setCourses(res?.data || []); }
//     catch (err) { console.error("Failed to load courses", err); }
//   };

//   const validateAndSetFile = (selectedFile) => {
//     if (!selectedFile) return;
//     if (selectedFile.size > 100 * 1024 * 1024) {
//       setMessage("File exceeds 100MB"); setMessageType("error"); setFile(null); return;
//     }
//     setFile(selectedFile);
//     setTitle(extractTitle(selectedFile.name));
//     setMessage("");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault(); setIsDragging(false);
//     validateAndSetFile(e.dataTransfer.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file || !batchId) {
//       setMessage("Please select a batch and file"); setMessageType("error"); return;
//     }
//     try {
//       setLoading(true);
//       await fileService.uploadFile(file, batchId, title, description, courseId || null, category || null);
//       setMessage("File published successfully"); setMessageType("success");
//       setFile(null); setTitle(""); setDescription("");
//       setBatchId(""); setCourseId(""); setCategory("");
//       loadFiles();
//     } catch {
//       setMessage("Upload failed. Please try again."); setMessageType("error");
//     } finally { setLoading(false); }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fileService.deleteFile(id);
//       setFiles(files.filter((f) => f.id !== id));
//       setMessage("File deleted successfully"); setMessageType("success");
//     } catch { setMessage("Delete failed"); setMessageType("error"); }
//   };

//   // ✅ FIXED: use arrayBuffer for office files, blob URL for pdf/image/text
//   const handleView = async (fileItem) => {
//     try {
//       const res         = await fileService.viewFileBlob(fileItem.id);
//       const contentType = res.headers["content-type"] || "application/octet-stream";
//       const mode        = getViewMode(fileItem.originalName, contentType);
//       const name        = fileItem.originalName || fileItem.title;

//       if (["docx", "xlsx", "pptx"].includes(mode)) {
//         // Pass raw arrayBuffer — rendered entirely in the browser
//         setPreview({ mode, arrayBuffer: res.data, name });
//       } else {
//         const blob = new Blob([res.data], { type: contentType });
//         const url  = URL.createObjectURL(blob);
//         setPreview({ mode, url, name });
//       }
//     } catch (err) {
//       console.error("View failed", err);
//       alert("Could not open file. Please try again.");
//     }
//   };

//   const closePreview = () => {
//     if (preview?.url) URL.revokeObjectURL(preview.url);
//     setPreview(null);
//   };

//   const handleAddCategory = (name) => {
//     if (!categories.includes(name)) setCategories((prev) => [...prev, name]);
//     setCategory(name);
//   };

//   return (
//     <PageShell t={t}>
//       {/* PREVIEW MODAL */}
//       <PreviewModal preview={preview} onClose={closePreview} isDark={isDark} />

//       {/* HERO */}
//       <PageHero
//         t={t} isDark={isDark} icon={Folder}
//         badge="Content Management" title="Document Studio"
//         subtitle="Upload training documents — PDF, Word, PPT, ZIP and more"
//         color="#2563eb"
//       />

//       {/* UPLOAD CARD */}
//       <ThemedCard t={t} style={{ marginBottom: 20 }}>
//         <CardHeader t={t} icon={Sparkles} color="#2563eb" title="Upload Document" />

//         {/* DROP ZONE */}
//         <div
//           onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//           onDragLeave={() => setIsDragging(false)}
//           onDrop={handleDrop}
//           style={{
//             borderRadius: 12,
//             border: `2px dashed ${isDragging ? "#2563eb" : t.inputBorder}`,
//             padding: "24px", textAlign: "center",
//             background: isDragging ? "rgba(37,99,235,0.04)" : t.inputBg,
//             marginBottom: 18, transition: "all 0.2s",
//           }}
//         >
//           {!file ? (
//             <>
//               <UploadCloud size={30} color="#2563eb" style={{ display: "block", margin: "0 auto 10px" }} />
//               <p style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 12 }}>
//                 Drag & drop any file here — PDF, Word, PPT, ZIP, Images (max 100MB)
//               </p>
//               <label style={{
//                 display: "inline-flex", alignItems: "center", gap: 8,
//                 padding: "8px 18px", borderRadius: 10, background: "#2563eb", color: "#fff",
//                 fontSize: 12, fontWeight: 700, fontFamily: "'Poppins',sans-serif", cursor: "pointer",
//               }}>
//                 Browse File
//                 <input type="file" hidden accept="*" onChange={(e) => validateAndSetFile(e.target.files[0])} />
//               </label>
//             </>
//           ) : (
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
//               <CheckCircle size={20} color="#34d399" />
//               <p style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
//                 {file.name}
//               </p>
//               <button onClick={() => setFile(null)} style={{
//                 background: "transparent", border: "none", cursor: "pointer",
//                 fontSize: 11, color: "#f87171", fontFamily: "'Poppins',sans-serif",
//               }}>
//                 Remove
//               </button>
//             </div>
//           )}
//         </div>

//         {/* INPUTS GRID */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 14 }}>
//           <div>
//             <FieldLabel t={t}>Document Title</FieldLabel>
//             <ThemedInput t={t} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" />
//           </div>
//           <div>
//             <FieldLabel t={t}>Select Batch</FieldLabel>
//             <ThemedSelect t={t} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
//               <option value="">Select Batch</option>
//               {batches.map((b) => <option key={b.id} value={b.id}>{b.name || "Batch"} (ID: {b.id})</option>)}
//             </ThemedSelect>
//           </div>
//           <div>
//             <FieldLabel t={t}>Select Course</FieldLabel>
//             <ThemedSelect t={t} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//               <option value="">Select Course</option>
//               {courses.map((c) => <option key={c.id} value={c.id}>{c.title || c.name || "Course"}</option>)}
//             </ThemedSelect>
//           </div>
//           <div>
//             <FieldLabel t={t}>Document Category</FieldLabel>
//             <CategoryDropdown
//               t={t} isDark={isDark} value={category}
//               onChange={setCategory} categories={categories}
//               onAddCategory={handleAddCategory}
//             />
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <div style={{ marginBottom: 18 }}>
//           <FieldLabel t={t}>Description</FieldLabel>
//           <ThemedTextarea t={t} rows={2} value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Brief description of this document" />
//         </div>

//         {/* ACTION ROW */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
//           {message && (
//             <p style={{ fontSize: 13, fontFamily: "'Poppins',sans-serif", margin: 0, color: messageType === "success" ? t.liveText : "#f87171" }}>
//               {message}
//             </p>
//           )}
//           <PrimaryButton color="#34d399" onClick={handleUpload} disabled={!file || loading}
//             style={{ marginLeft: "auto", opacity: (!file || loading) ? 0.6 : 1 }}>
//             {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : null}
//             {loading ? "Publishing..." : "Publish Document"}
//           </PrimaryButton>
//         </div>
//       </ThemedCard>

//       {/* UPLOADED FILES LIST */}
//       {files.length > 0 && (
//         <ThemedCard t={t}>
//           <CardHeader t={t} icon={Folder} color="#2563eb" title="Uploaded Documents"
//             right={<Pill t={t}>{files.length} files</Pill>} />
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {files.map((fileItem) => (
//               <div key={fileItem.id} style={{
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 padding: "12px 16px", borderRadius: 12,
//                 background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
//                 gap: 12, flexWrap: "wrap",
//               }}>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//                     {fileItem.title || fileItem.originalName || "No Title"}
//                   </p>
//                   <p style={{ fontSize: 11, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>
//                     {fileItem.description || "No Description"}
//                   </p>
//                   <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
//                     {fileItem.batchId && (
//                       <span style={{ fontSize: 10, color: "#2563eb", background: "rgba(37,99,235,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
//                         Batch: {fileItem.batchId}
//                       </span>
//                     )}
//                     {fileItem.courseId && (
//                       <span style={{ fontSize: 10, color: "#0891b2", background: "rgba(8,145,178,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
//                         Course: {fileItem.courseId}
//                       </span>
//                     )}
//                     {fileItem.category && (
//                       <span style={{ fontSize: 10, color: "#7c3aed", background: "rgba(124,58,237,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
//                         {fileItem.category}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button onClick={() => handleView(fileItem)} style={{
//                     width: 32, height: 32, borderRadius: 9,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: "rgba(37,99,235,0.10)", border: "1px solid rgba(37,99,235,0.25)",
//                     cursor: "pointer", transition: "all 0.2s",
//                   }}>
//                     <Eye size={13} color="#2563eb" />
//                   </button>
//                   <button onClick={() => handleDelete(fileItem.id)} style={{
//                     width: 32, height: 32, borderRadius: 9,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.25)",
//                     cursor: "pointer", transition: "all 0.2s",
//                   }}>
//                     <Trash2 size={13} color="#f87171" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ThemedCard>
//       )}
//     </PageShell>
//   );
// };

// export default UploadDocuments;old woekrring
























import {
  CheckCircle, ChevronDown, Eye, Folder,
  Loader2, Plus, Save, Sparkles, Trash2, UploadCloud, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { courseService } from "../services/courseService";
import fileService from "../services/fileService";
import videoService from "../services/videoService";
import {
  CardHeader, FieldLabel, PageHero, PageShell,
  Pill, PrimaryButton, ThemedCard, ThemedInput,
  ThemedSelect, ThemedTextarea, useTrainerTheme,
} from "./trainerTheme";

/* ─────────────────── HELPERS ─────────────────── */
const extractTitle = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const DEFAULT_CATEGORIES = [
  "Notes", "Assignment", "Slides", "Study Material",
  "Reference Material", "Syllabus", "Question Bank",
  "Previous Year Papers", "Lab Manual", "Case Study",
];

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

/* ── Resolve batchId: "default_segment" → null for API ──────── */
const resolveBatchId = (batchId) => {
  if (!batchId || batchId === "default_segment") return null;
  return batchId;
};

/* ═══════════════════════════════════════════════════════════
   DOCX VIEWER
═══════════════════════════════════════════════════════════ */
const DocxViewer = ({ arrayBuffer, isDark }) => {
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

  const bg   = isDark ? "#111" : "#fff";
  const text = isDark ? "#e2e8f0" : "#1a1a1a";

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 44, opacity: 0.4 }}>📄</div>
      <p style={{ fontWeight: 700, margin: 0, color: text }}>{error}</p>
    </div>
  );

  if (!html) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)",
        borderTopColor: "#6366f1", animation: "spin 0.7s linear infinite" }} />
      Rendering document…
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", background: bg, padding: "40px",
      boxSizing: "border-box" }}>
      <div
        style={{ maxWidth: 860, margin: "0 auto", fontFamily: "'Calibri','Segoe UI',sans-serif",
          fontSize: 14, lineHeight: 1.7, color: text }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   XLSX VIEWER
═══════════════════════════════════════════════════════════ */
const XlsxViewer = ({ arrayBuffer, isDark }) => {
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

  const bg      = isDark ? "#111" : "#fff";
  const text    = isDark ? "#e2e8f0" : "#1a1a1a";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const rowBg   = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 44, opacity: 0.4 }}>📊</div>
      <p style={{ fontWeight: 700, margin: 0, color: text }}>{error}</p>
    </div>
  );

  if (!activeSheet) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)",
        borderTopColor: "#6366f1", animation: "spin 0.7s linear infinite" }} />
      Rendering spreadsheet…
    </div>
  );

  const rows = sheets[activeSheet] || [];
  const headers = rows[0] || [];
  const dataRows = rows.slice(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {sheetNames.length > 1 && (
        <div style={{ display: "flex", gap: 6, padding: "12px 24px 0", background: isDark ? "#0a0a0a" : "#f1f5f9",
          borderBottom: `1px solid ${border}`, flexShrink: 0, flexWrap: "wrap" }}>
          {sheetNames.map((name) => (
            <button key={name} onClick={() => setActiveSheet(name)} style={{
              padding: "6px 14px", borderRadius: "8px 8px 0 0", fontSize: 12,
              fontWeight: 600, cursor: "pointer", border: "none",
              fontFamily: "'Poppins',sans-serif", transition: "all 0.15s",
              background: activeSheet === name ? "#6366f1" : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
              color: activeSheet === name ? "#fff" : (isDark ? "#94a3b8" : "#64748b"),
            }}>
              {name}
            </button>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflow: "auto", background: bg, padding: 24 }}>
        <table style={{ borderCollapse: "collapse", fontSize: 12,
          fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ background: "#6366f1", color: "#fff", padding: "8px 14px",
                  fontWeight: 700, border: `1px solid #4f46e5`, position: "sticky", top: 0 }}>
                  {h !== undefined && h !== null ? String(h) : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {headers.map((_, ci) => (
                  <td key={ci} style={{ padding: "7px 14px", border: `1px solid ${border}`,
                    color: text, background: ri % 2 === 1 ? rowBg : "transparent" }}>
                    {row[ci] !== undefined && row[ci] !== null ? String(row[ci]) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {dataRows.length === 0 && (
          <p style={{ color: "#64748b", fontFamily: "'Poppins',sans-serif", fontSize: 13,
            textAlign: "center", marginTop: 24 }}>
            This sheet is empty.
          </p>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PPTX VIEWER
═══════════════════════════════════════════════════════════ */
const PptxViewer = ({ arrayBuffer, isDark }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
        const zip = await window.JSZip.loadAsync(arrayBuffer);
        const slideFiles = Object.keys(zip.files)
          .filter((f) => f.match(/^ppt\/slides\/slide\d+\.xml$/))
          .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

        if (slideFiles.length === 0) { setError("No slides found."); return; }

        const parsedSlides = await Promise.all(
          slideFiles.map(async (slideFile) => {
            const xmlStr = await zip.files[slideFile].async("string");
            const xmlDoc = new DOMParser().parseFromString(xmlStr, "application/xml");
            const texts = [];
            xmlDoc.querySelectorAll("t").forEach((el) => {
              const t = el.textContent?.trim();
              if (t) texts.push(t);
            });
            return texts;
          })
        );
        setSlides(parsedSlides);
      } catch (e) {
        console.error("PPTX render error:", e);
        setError("Could not render this presentation.");
      }
    })();
  }, [arrayBuffer]);

  const text  = isDark ? "#e2e8f0" : "#1a1a1a";

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 44, opacity: 0.4 }}>📊</div>
      <p style={{ fontWeight: 700, margin: 0, color: text }}>{error}</p>
    </div>
  );

  if (slides.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      color: "#94a3b8", fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)",
        borderTopColor: "#6366f1", animation: "spin 0.7s linear infinite" }} />
      Rendering presentation…
    </div>
  );

  const slide = slides[currentSlide] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#1e1e2e" }}>
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center",
        justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 720, minHeight: 380,
          background: "#ffffff", borderRadius: 12,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          padding: "40px 48px", boxSizing: "border-box",
          display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1",
            fontFamily: "'Poppins',sans-serif", letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 8 }}>
            Slide {currentSlide + 1} / {slides.length}
          </div>
          {slide.length === 0 ? (
            <p style={{ color: "#94a3b8", fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>
              (Empty slide or image-only content)
            </p>
          ) : slide.map((t, i) => (
            <p key={i} style={{ margin: 0, fontSize: i === 0 ? 20 : 14,
              fontWeight: i === 0 ? 700 : 400,
              color: i === 0 ? "#1e1b4b" : "#374151",
              fontFamily: "'Poppins',sans-serif", lineHeight: 1.6 }}>
              {i === 0 ? t : `• ${t}`}
            </p>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        gap: 12, padding: "12px 20px", background: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
        <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
          disabled={currentSlide === 0}
          style={{ padding: "8px 20px", borderRadius: 8, border: "none",
            background: currentSlide === 0 ? "rgba(255,255,255,0.1)" : "#6366f1",
            color: currentSlide === 0 ? "rgba(255,255,255,0.3)" : "#fff",
            fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
            cursor: currentSlide === 0 ? "not-allowed" : "pointer" }}>
          ← Prev
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{
              width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4, border: "none",
              background: i === currentSlide ? "#6366f1" : "rgba(255,255,255,0.3)",
              cursor: "pointer", transition: "all 0.2s", padding: 0 }} />
          ))}
        </div>
        <button onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
          disabled={currentSlide === slides.length - 1}
          style={{ padding: "8px 20px", borderRadius: 8, border: "none",
            background: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.1)" : "#6366f1",
            color: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.3)" : "#fff",
            fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
            cursor: currentSlide === slides.length - 1 ? "not-allowed" : "pointer" }}>
          Next →
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   FILE PREVIEW MODAL
═══════════════════════════════════════════════════════════ */
const PreviewModal = ({ preview, onClose, isDark }) => {
  if (!preview) return null;

  const bg     = isDark ? "#111" : "#fff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const text   = isDark ? "#fff" : "#0f172a";
  const muted  = isDark ? "#94a3b8" : "#64748b";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: bg, border: `1px solid ${border}`,
        borderRadius: 20, width: "90vw", height: "90vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)", overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: `1px solid ${border}`, flexShrink: 0,
        }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: text,
            fontFamily: "'Poppins',sans-serif", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {preview.name}
          </p>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "none",
            background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
            color: muted, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
          }}>
            <X size={14} />
          </button>
        </div>

        <div style={{
          flex: 1, overflow: "hidden",
          background: isDark ? "#0a0a0a" : "#f8fafc",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {preview.mode === "pdf"   && <iframe src={preview.url} title="PDF Preview" style={{ width: "100%", height: "100%", border: "none" }} />}
          {preview.mode === "image" && <img src={preview.url} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
          {preview.mode === "text"  && <iframe src={preview.url} title="Text Preview" style={{ width: "100%", height: "100%", border: "none", background: "#fff", fontFamily: "monospace" }} />}
          {preview.mode === "docx"  && <DocxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />}
          {preview.mode === "xlsx"  && <XlsxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />}
          {preview.mode === "pptx"  && <PptxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />}
          {preview.mode === "none"  && (
            <div style={{ textAlign: "center", color: muted, fontFamily: "'Poppins',sans-serif" }}>
              <div style={{ fontSize: 44, marginBottom: 12, opacity: 0.4 }}>📄</div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>Preview not available</p>
              <p style={{ fontSize: 12, margin: 0 }}>This file type cannot be previewed in the browser.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CUSTOM CATEGORY DROPDOWN
═══════════════════════════════════════════════════════════ */
const CategoryDropdown = ({ t, isDark, value, onChange, categories, onAddCategory }) => {
  const [open, setOpen]     = useState(false);
  const [newCat, setNewCat] = useState("");
  const [error, setError]   = useState("");
  const wrapperRef          = useRef(null);
  const inputRef            = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false); setNewCat(""); setError("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed) { setError("Please enter a category name"); return; }
    if (categories.includes(trimmed)) { setError("Category already exists"); return; }
    onAddCategory(trimmed);
    setNewCat(""); setError(""); setOpen(false);
  };

  const dropBg     = isDark ? "#1a1a2e" : "#ffffff";
  const dropBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const hoverBg    = isDark ? "rgba(124,58,237,0.14)" : "rgba(124,58,237,0.07)";
  const selectedBg = isDark ? "rgba(124,58,237,0.24)" : "rgba(124,58,237,0.11)";
  const addBg      = isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.04)";
  const addBorder  = isDark ? "rgba(124,58,237,0.3)"  : "rgba(124,58,237,0.2)";

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => { setOpen((p) => !p); setNewCat(""); setError(""); }}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 38, padding: "0 12px",
          borderRadius: 10, border: `1px solid ${open ? "#7c3aed" : t.inputBorder}`,
          background: t.inputBg, color: value ? t.text : t.textSub,
          fontFamily: "'Poppins', sans-serif", fontSize: 13,
          cursor: "pointer", outline: "none", transition: "border 0.15s",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || "Select Category"}
        </span>
        <ChevronDown size={14} color={t.textSub} style={{
          flexShrink: 0, marginLeft: 6,
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.2s",
        }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0,
          background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 12,
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 6px 24px rgba(0,0,0,0.13)",
          zIndex: 1000, overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div style={{ maxHeight: 210, overflowY: "auto" }}>
            <div onClick={() => { onChange(""); setOpen(false); }} style={{
              padding: "9px 14px", fontSize: 12, fontFamily: "'Poppins', sans-serif",
              color: t.textSub, cursor: "pointer", borderBottom: `1px solid ${dropBorder}`,
            }}>
              Select Category
            </div>
            {categories.map((cat) => {
              const sel = value === cat;
              return (
                <div key={cat} onClick={() => { onChange(cat); setOpen(false); }} style={{
                  padding: "10px 14px", fontSize: 13, fontFamily: "'Poppins', sans-serif",
                  color: sel ? "#7c3aed" : t.text, fontWeight: sel ? 700 : 500,
                  background: sel ? selectedBg : "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = hoverBg; }}
                  onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                >
                  {cat}
                  {sel && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: `1px solid ${dropBorder}`, padding: "10px 12px", background: addBg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
              <Plus size={12} color="#7c3aed" />
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: "#7c3aed", letterSpacing: "0.02em" }}>
                ADD NEW CATEGORY
              </span>
            </div>
            <input ref={inputRef} value={newCat}
              onChange={(e) => { setNewCat(e.target.value); setError(""); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.stopPropagation(); handleAdd(); }
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Enter new category"
              style={{
                width: "100%", boxSizing: "border-box", height: 32, padding: "0 10px",
                borderRadius: 8, border: `1px solid ${error ? "#f87171" : addBorder}`,
                background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                fontFamily: "'Poppins', sans-serif", fontSize: 12,
                color: t.text, outline: "none", marginBottom: 7,
              }}
            />
            <button type="button" onClick={handleAdd} style={{
              width: "100%", height: 30, borderRadius: 8, border: "none",
              cursor: "pointer", background: "#7c3aed", color: "#fff",
              fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 5, transition: "opacity 0.15s",
            }}>
              <Plus size={12} /> Add Category
            </button>
            {error && <p style={{ margin: "5px 0 0", fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#f87171" }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DRAFT BADGE — shown on file cards that are drafts
═══════════════════════════════════════════════════════════ */
const DraftBadge = () => (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
    background: "rgba(234,179,8,0.15)", color: "#ca8a04",
    fontFamily: "'Poppins',sans-serif", border: "1px solid rgba(234,179,8,0.3)",
    display: "inline-flex", alignItems: "center", gap: 4,
  }}>
    ✏️ Draft
  </span>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const UploadDocuments = () => {
  const { t, isDark } = useTrainerTheme();

  const [file, setFile]               = useState(null);
  const [files, setFiles]             = useState([]);
  const [batches, setBatches]         = useState([]);
  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);   // ← NEW
  const [message, setMessage]         = useState("");
  const [messageType, setMessageType] = useState("");
  const [isDragging, setIsDragging]   = useState(false);
  const [preview, setPreview]         = useState(null);

  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [batchId, setBatchId]         = useState("");
  const [courseId, setCourseId]       = useState("");
  const [category, setCategory]       = useState("");
  const [categories, setCategories]   = useState([...DEFAULT_CATEGORIES]);

  useEffect(() => {
    loadFiles(); loadBatches(); loadCourses();
  }, []);

  const loadFiles = async () => {
    try { const res = await fileService.getTrainerFiles(); setFiles(res.data || []); }
    catch (err) { console.error(err); }
  };

  const loadBatches = async () => {
    try { const res = await videoService.getTrainerBatches(); setBatches(res.data || []); }
    catch (err) { console.error("Failed to load batches", err); }
  };

  const loadCourses = async () => {
    try { const res = await courseService.getMyCourses(); setCourses(res?.data || []); }
    catch (err) { console.error("Failed to load courses", err); }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.size > 100 * 1024 * 1024) {
      setMessage("File exceeds 100MB"); setMessageType("error"); setFile(null); return;
    }
    setFile(selectedFile);
    setTitle(extractTitle(selectedFile.name));
    setMessage("");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  /* ── Reset form fields ────────────────────────────────────── */
  const resetForm = () => {
    setFile(null); setTitle(""); setDescription("");
    setBatchId(""); setCourseId(""); setCategory("");
  };

  /* ── PUBLISH (status = "published") ──────────────────────── */
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file"); setMessageType("error"); return;
    }
    // batchId is now optional — "default_segment" or "" → null
    try {
      setLoading(true);
      await fileService.uploadFile(
        file,
        resolveBatchId(batchId),
        title,
        description,
        courseId  || null,
        category  || null,
        "published",           // ← status param
      );
      setMessage("File published successfully"); setMessageType("success");
      resetForm();
      loadFiles();
    } catch {
      setMessage("Upload failed. Please try again."); setMessageType("error");
    } finally { setLoading(false); }
  };

  /* ── SAVE AS DRAFT (status = "draft") ───────────────────── */
  const handleSaveDraft = async () => {
    if (!file) {
      setMessage("Please select a file to save as draft"); setMessageType("error"); return;
    }
    try {
      setDraftLoading(true);
      await fileService.uploadFile(
        file,
        resolveBatchId(batchId),
        title || extractTitle(file.name),
        description,
        courseId  || null,
        category  || null,
        "draft",               // ← status param
      );
      setMessage("Draft saved successfully"); setMessageType("success");
      resetForm();
      loadFiles();
    } catch {
      setMessage("Could not save draft. Please try again."); setMessageType("error");
    } finally { setDraftLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await fileService.deleteFile(id);
      setFiles(files.filter((f) => f.id !== id));
      setMessage("File deleted successfully"); setMessageType("success");
    } catch { setMessage("Delete failed"); setMessageType("error"); }
  };

  const handleView = async (fileItem) => {
    try {
      const res         = await fileService.viewFileBlob(fileItem.id);
      const contentType = res.headers["content-type"] || "application/octet-stream";
      const mode        = getViewMode(fileItem.originalName, contentType);
      const name        = fileItem.originalName || fileItem.title;

      if (["docx", "xlsx", "pptx"].includes(mode)) {
        setPreview({ mode, arrayBuffer: res.data, name });
      } else {
        const blob = new Blob([res.data], { type: contentType });
        const url  = URL.createObjectURL(blob);
        setPreview({ mode, url, name });
      }
    } catch (err) {
      console.error("View failed", err);
      alert("Could not open file. Please try again.");
    }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const handleAddCategory = (name) => {
    if (!categories.includes(name)) setCategories((prev) => [...prev, name]);
    setCategory(name);
  };

  /* ── Inline styles shared by action buttons ──────────────── */
  const draftBtnStyle = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "9px 18px", borderRadius: 10,
    border: isDark ? "1px solid rgba(234,179,8,0.4)" : "1px solid rgba(202,138,4,0.4)",
    background: isDark ? "rgba(234,179,8,0.08)" : "rgba(254,249,195,0.8)",
    color: isDark ? "#fbbf24" : "#92400e",
    fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
    cursor: (!file || draftLoading) ? "not-allowed" : "pointer",
    opacity: (!file || draftLoading) ? 0.55 : 1,
    transition: "all 0.2s",
  };

  return (
    <PageShell t={t}>
      {/* PREVIEW MODAL */}
      <PreviewModal preview={preview} onClose={closePreview} isDark={isDark} />

      {/* HERO */}
      <PageHero
        t={t} isDark={isDark} icon={Folder}
        badge="Content Management" title="Document Studio"
        subtitle="Upload training documents — PDF, Word, PPT, ZIP and more"
        color="#2563eb"
      />

      {/* UPLOAD CARD */}
      <ThemedCard t={t} style={{ marginBottom: 20 }}>
        <CardHeader t={t} icon={Sparkles} color="#2563eb" title="Upload Document" />

        {/* DROP ZONE */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            borderRadius: 12,
            border: `2px dashed ${isDragging ? "#2563eb" : t.inputBorder}`,
            padding: "24px", textAlign: "center",
            background: isDragging ? "rgba(37,99,235,0.04)" : t.inputBg,
            marginBottom: 18, transition: "all 0.2s",
          }}
        >
          {!file ? (
            <>
              <UploadCloud size={30} color="#2563eb" style={{ display: "block", margin: "0 auto 10px" }} />
              <p style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 12 }}>
                Drag & drop any file here — PDF, Word, PPT, ZIP, Images (max 100MB)
              </p>
              <label style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 18px", borderRadius: 10, background: "#2563eb", color: "#fff",
                fontSize: 12, fontWeight: 700, fontFamily: "'Poppins',sans-serif", cursor: "pointer",
              }}>
                Browse File
                <input type="file" hidden accept="*" onChange={(e) => validateAndSetFile(e.target.files[0])} />
              </label>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <CheckCircle size={20} color="#34d399" />
              <p style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
                {file.name}
              </p>
              <button onClick={() => setFile(null)} style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontSize: 11, color: "#f87171", fontFamily: "'Poppins',sans-serif",
              }}>
                Remove
              </button>
            </div>
          )}
        </div>

        {/* INPUTS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 14 }}>
          <div>
            <FieldLabel t={t}>Document Title</FieldLabel>
            <ThemedInput t={t} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" />
          </div>

          {/* ── BATCH SELECT with Default Segment ── */}
          <div>
            <FieldLabel t={t}>Select Batch</FieldLabel>
            <ThemedSelect t={t} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
              {/* Default Segment — available when no specific batch is needed */}
              <option value="default_segment"> Default Segment (No Batch)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || "Batch"} (ID: {b.id})
                </option>
              ))}
            </ThemedSelect>
            {batchId === "default_segment" && (
              <p style={{
                margin: "5px 0 0", fontSize: 11,
                fontFamily: "'Poppins',sans-serif",
                color: isDark ? "#60a5fa" : "#2563eb",
              }}>
                ℹ️ This document won't be tied to any specific batch.
              </p>
            )}
          </div>

          <div>
            <FieldLabel t={t}>Select Course</FieldLabel>
            <ThemedSelect t={t} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title || c.name || "Course"}</option>)}
            </ThemedSelect>
          </div>
          <div>
            <FieldLabel t={t}>Document Category</FieldLabel>
            <CategoryDropdown
              t={t} isDark={isDark} value={category}
              onChange={setCategory} categories={categories}
              onAddCategory={handleAddCategory}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: 18 }}>
          <FieldLabel t={t}>Description</FieldLabel>
          <ThemedTextarea t={t} rows={2} value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this document" />
        </div>

        {/* ACTION ROW */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {message && (
            <p style={{
              fontSize: 13, fontFamily: "'Poppins',sans-serif", margin: 0,
              color: messageType === "success" ? t.liveText : "#f87171",
            }}>
              {message}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginLeft: "auto", alignItems: "center", flexWrap: "wrap" }}>
            {/* ── Save as Draft ── */}
            <button
              onClick={handleSaveDraft}
              disabled={!file || draftLoading}
              style={draftBtnStyle}
            >
              {draftLoading
                ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                : <Save size={13} />
              }
              {draftLoading ? "Saving…" : "Save as Draft"}
            </button>

            {/* ── Publish ── */}
            <PrimaryButton
              color="#34d399"
              onClick={handleUpload}
              disabled={!file || loading}
              style={{ opacity: (!file || loading) ? 0.6 : 1 }}
            >
              {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
              {loading ? "Publishing..." : "Publish Document"}
            </PrimaryButton>
          </div>
        </div>
      </ThemedCard>

      {/* UPLOADED FILES LIST */}
      {files.length > 0 && (
        <ThemedCard t={t}>
          <CardHeader t={t} icon={Folder} color="#2563eb" title="Uploaded Documents"
            right={<Pill t={t}>{files.length} files</Pill>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {files.map((fileItem) => (
              <div key={fileItem.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderRadius: 12,
                background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
                gap: 12, flexWrap: "wrap",
                /* Subtle yellow tint for drafts */
                ...(fileItem.status === "draft" && {
                  borderColor: isDark ? "rgba(234,179,8,0.3)" : "rgba(202,138,4,0.25)",
                  background: isDark ? "rgba(234,179,8,0.05)" : "rgba(254,252,232,0.6)",
                }),
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                      {fileItem.title || fileItem.originalName || "No Title"}
                    </p>
                    {/* Draft badge */}
                    {fileItem.status === "draft" && <DraftBadge />}
                  </div>
                  <p style={{ fontSize: 11, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                    {fileItem.description || "No Description"}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
                    {/* Show "Default Segment" if batchId is null / default_segment */}
                    {fileItem.batchId ? (
                      <span style={{ fontSize: 10, color: "#2563eb", background: "rgba(37,99,235,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                        Batch: {fileItem.batchId}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, color: "#64748b", background: "rgba(100,116,139,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                        📁 Default Segment
                      </span>
                    )}
                    {fileItem.courseId && (
                      <span style={{ fontSize: 10, color: "#0891b2", background: "rgba(8,145,178,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                        Course: {fileItem.courseId}
                      </span>
                    )}
                    {fileItem.category && (
                      <span style={{ fontSize: 10, color: "#7c3aed", background: "rgba(124,58,237,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                        {fileItem.category}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleView(fileItem)} style={{
                    width: 32, height: 32, borderRadius: 9,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(37,99,235,0.10)", border: "1px solid rgba(37,99,235,0.25)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <Eye size={13} color="#2563eb" />
                  </button>
                  <button onClick={() => handleDelete(fileItem.id)} style={{
                    width: 32, height: 32, borderRadius: 9,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.25)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <Trash2 size={13} color="#f87171" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ThemedCard>
      )}
    </PageShell>
  );
};

export default UploadDocuments;