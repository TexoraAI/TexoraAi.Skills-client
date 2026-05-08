// import {
//   CheckCircle, ChevronDown, Eye, Folder,
//   Loader2, Plus, Save, Sparkles, Trash2, UploadCloud, X,
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

// /* ── Resolve batchId: "default_segment" → null for API ──────── */
// const resolveBatchId = (batchId) => {
//   if (!batchId || batchId === "default_segment") return null;
//   return batchId;
// };

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
//    FILE PREVIEW MODAL
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

//         <div style={{
//           flex: 1, overflow: "hidden",
//           background: isDark ? "#0a0a0a" : "#f8fafc",
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}>
//           {preview.mode === "pdf"   && <iframe src={preview.url} title="PDF Preview" style={{ width: "100%", height: "100%", border: "none" }} />}
//           {preview.mode === "image" && <img src={preview.url} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
//           {preview.mode === "text"  && <iframe src={preview.url} title="Text Preview" style={{ width: "100%", height: "100%", border: "none", background: "#fff", fontFamily: "monospace" }} />}
//           {preview.mode === "docx"  && <DocxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />}
//           {preview.mode === "xlsx"  && <XlsxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />}
//           {preview.mode === "pptx"  && <PptxViewer arrayBuffer={preview.arrayBuffer} isDark={isDark} />}
//           {preview.mode === "none"  && (
//             <div style={{ textAlign: "center", color: muted, fontFamily: "'Poppins',sans-serif" }}>
//               <div style={{ fontSize: 44, marginBottom: 12, opacity: 0.4 }}>📄</div>
//               <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>Preview not available</p>
//               <p style={{ fontSize: 12, margin: 0 }}>This file type cannot be previewed in the browser.</p>
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
//           position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0,
//           background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 12,
//           boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 6px 24px rgba(0,0,0,0.13)",
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
//    DRAFT BADGE — shown on file cards that are drafts
// ═══════════════════════════════════════════════════════════ */
// const DraftBadge = () => (
//   <span style={{
//     fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
//     background: "rgba(234,179,8,0.15)", color: "#ca8a04",
//     fontFamily: "'Poppins',sans-serif", border: "1px solid rgba(234,179,8,0.3)",
//     display: "inline-flex", alignItems: "center", gap: 4,
//   }}>
//     ✏️ Draft
//   </span>
// );

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
//   const [draftLoading, setDraftLoading] = useState(false);   // ← NEW
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

//   /* ── Reset form fields ────────────────────────────────────── */
//   const resetForm = () => {
//     setFile(null); setTitle(""); setDescription("");
//     setBatchId(""); setCourseId(""); setCategory("");
//   };

//   /* ── PUBLISH (status = "published") ──────────────────────── */
//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a file"); setMessageType("error"); return;
//     }
//     // batchId is now optional — "default_segment" or "" → null
//     try {
//       setLoading(true);
//       await fileService.uploadFile(
//         file,
//         resolveBatchId(batchId),
//         title,
//         description,
//         courseId  || null,
//         category  || null,
//         "published",           // ← status param
//       );
//       setMessage("File published successfully"); setMessageType("success");
//       resetForm();
//       loadFiles();
//     } catch {
//       setMessage("Upload failed. Please try again."); setMessageType("error");
//     } finally { setLoading(false); }
//   };

//   /* ── SAVE AS DRAFT (status = "draft") ───────────────────── */
//   const handleSaveDraft = async () => {
//     if (!file) {
//       setMessage("Please select a file to save as draft"); setMessageType("error"); return;
//     }
//     try {
//       setDraftLoading(true);
//       await fileService.uploadFile(
//         file,
//         resolveBatchId(batchId),
//         title || extractTitle(file.name),
//         description,
//         courseId  || null,
//         category  || null,
//         "draft",               // ← status param
//       );
//       setMessage("Draft saved successfully"); setMessageType("success");
//       resetForm();
//       loadFiles();
//     } catch {
//       setMessage("Could not save draft. Please try again."); setMessageType("error");
//     } finally { setDraftLoading(false); }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fileService.deleteFile(id);
//       setFiles(files.filter((f) => f.id !== id));
//       setMessage("File deleted successfully"); setMessageType("success");
//     } catch { setMessage("Delete failed"); setMessageType("error"); }
//   };

//   const handleView = async (fileItem) => {
//     try {
//       const res         = await fileService.viewFileBlob(fileItem.id);
//       const contentType = res.headers["content-type"] || "application/octet-stream";
//       const mode        = getViewMode(fileItem.originalName, contentType);
//       const name        = fileItem.originalName || fileItem.title;

//       if (["docx", "xlsx", "pptx"].includes(mode)) {
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

//   /* ── Inline styles shared by action buttons ──────────────── */
//   const draftBtnStyle = {
//     display: "inline-flex", alignItems: "center", gap: 6,
//     padding: "9px 18px", borderRadius: 10,
//     border: isDark ? "1px solid rgba(234,179,8,0.4)" : "1px solid rgba(202,138,4,0.4)",
//     background: isDark ? "rgba(234,179,8,0.08)" : "rgba(254,249,195,0.8)",
//     color: isDark ? "#fbbf24" : "#92400e",
//     fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
//     cursor: (!file || draftLoading) ? "not-allowed" : "pointer",
//     opacity: (!file || draftLoading) ? 0.55 : 1,
//     transition: "all 0.2s",
//   };

//   return (
//     <PageShell t={t}>
//       {/* PREVIEW MODAL */}
//       <PreviewModal preview={preview} onClose={closePreview} isDark={isDark} />

//       {/* HERO
//       <PageHero
//         t={t} isDark={isDark} icon={Folder}
//         badge="Content Management" title="Document Studio"
//         subtitle="Upload training documents — PDF, Word, PPT, ZIP and more"
//         color="#2563eb"
//       /> */}

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

//           {/* ── BATCH SELECT with Default Segment ── */}
//           <div>
//             <FieldLabel t={t}>Select Batch</FieldLabel>
//             <ThemedSelect t={t} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
//               {/* Default Segment — available when no specific batch is needed */}
//               <option value="default_segment"> Default Segment (No Batch)</option>
//               {batches.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name || "Batch"} (ID: {b.id})
//                 </option>
//               ))}
//             </ThemedSelect>
//             {batchId === "default_segment" && (
//               <p style={{
//                 margin: "5px 0 0", fontSize: 11,
//                 fontFamily: "'Poppins',sans-serif",
//                 color: isDark ? "#60a5fa" : "#2563eb",
//               }}>
//                 ℹ️ This document won't be tied to any specific batch.
//               </p>
//             )}
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
//             <p style={{
//               fontSize: 13, fontFamily: "'Poppins',sans-serif", margin: 0,
//               color: messageType === "success" ? t.liveText : "#f87171",
//             }}>
//               {message}
//             </p>
//           )}

//           <div style={{ display: "flex", gap: 10, marginLeft: "auto", alignItems: "center", flexWrap: "wrap" }}>
//             {/* ── Save as Draft ── */}
//             <button
//               onClick={handleSaveDraft}
//               disabled={!file || draftLoading}
//               style={draftBtnStyle}
//             >
//               {draftLoading
//                 ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
//                 : <Save size={13} />
//               }
//               {draftLoading ? "Saving…" : "Save as Draft"}
//             </button>

//             {/* ── Publish ── */}
//             <PrimaryButton
//               color="#34d399"
//               onClick={handleUpload}
//               disabled={!file || loading}
//               style={{ opacity: (!file || loading) ? 0.6 : 1 }}
//             >
//               {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
//               {loading ? "Publishing..." : "Publish Document"}
//             </PrimaryButton>
//           </div>
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
//                 /* Subtle yellow tint for drafts */
//                 ...(fileItem.status === "draft" && {
//                   borderColor: isDark ? "rgba(234,179,8,0.3)" : "rgba(202,138,4,0.25)",
//                   background: isDark ? "rgba(234,179,8,0.05)" : "rgba(254,252,232,0.6)",
//                 }),
//               }}>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//                     <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//                       {fileItem.title || fileItem.originalName || "No Title"}
//                     </p>
//                     {/* Draft badge */}
//                     {fileItem.status === "draft" && <DraftBadge />}
//                   </div>
//                   <p style={{ fontSize: 11, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>
//                     {fileItem.description || "No Description"}
//                   </p>
//                   <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
//                     {/* Show "Default Segment" if batchId is null / default_segment */}
//                     {fileItem.batchId ? (
//                       <span style={{ fontSize: 10, color: "#2563eb", background: "rgba(37,99,235,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
//                         Batch: {fileItem.batchId}
//                       </span>
//                     ) : (
//                       <span style={{ fontSize: 10, color: "#64748b", background: "rgba(100,116,139,0.10)", padding: "2px 8px", borderRadius: 6, fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
//                         📁 Default Segment
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

// export default UploadDocuments;
















import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  Download,
  Send,
  Save,
  ChevronDown,
  Check,
  X,
  File,
  FileImage,
  Archive,
  Pencil,
  Upload,
} from "lucide-react";
import fileService from "../services/fileService";
import videoService from "../services/videoService";
import { courseService } from "../services/courseService";
import { useTrainerTheme } from "./trainerTheme";

const FF = "'Poppins', sans-serif";

const getColors = (isDark) => ({
  cardBg: isDark ? "#1a1d27" : "#ffffff",
  cardBorder: isDark ? "#2e3245" : "#e0e0e0",
  inputBg: isDark ? "#12151f" : "#fafafa",
  inputBorder: isDark ? "#2e3245" : "#d3d3d3",
  textPrimary: isDark ? "#f0f0f0" : "#0d0d0d",
  textSub: isDark ? "#8a8fa8" : "#606060",
  textMuted: isDark ? "#555970" : "#aaaaaa",
  accent: "#065fd4",
  accentBg: isDark ? "#0d2a5e" : "#e8f0fe",
  accentLight: isDark ? "#162644" : "#f0f7ff",
  divider: isDark ? "#2e3245" : "#e5e5e5",
  hoverBg: isDark ? "#22263a" : "#f2f2f2",
  successColor: isDark ? "#34d399" : "#00873e",
  errorColor: isDark ? "#f87171" : "#cc0000",
  zeroBg: isDark ? "#0d1118" : "#f9f9f9",
  draftColor: isDark ? "#fbbf24" : "#92400e",
  draftBg: isDark ? "rgba(234,179,8,0.08)" : "rgba(254,249,195,0.8)",
  draftBorder: isDark ? "rgba(234,179,8,0.35)" : "rgba(202,138,4,0.35)",
  pageBg: isDark ? "#0d1118" : "#f4f6fb",
  modalBg: isDark ? "#18181b" : "#ffffff",
  modalOverlay: isDark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.45)",
});

const lbl = (c) => ({
  fontSize: 12,
  fontWeight: 500,
  color: c.textSub,
  marginBottom: 5,
  fontFamily: FF,
  display: "block",
});
const inp = (c) => ({
  width: "100%",
  padding: "9px 13px",
  border: `1px solid ${c.inputBorder}`,
  borderRadius: 4,
  background: c.inputBg,
  color: c.textPrimary,
  fontSize: 13,
  outline: "none",
  fontFamily: FF,
  boxSizing: "border-box",
});

const fileIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return { icon: FileText, color: "#ef4444" };
  if (n.endsWith(".docx") || n.endsWith(".doc"))
    return { icon: FileText, color: "#3b82f6" };
  if (n.endsWith(".pptx") || n.endsWith(".ppt"))
    return { icon: FileText, color: "#f97316" };
  if (n.endsWith(".xlsx") || n.endsWith(".xls"))
    return { icon: FileText, color: "#22c55e" };
  if (n.endsWith(".zip") || n.endsWith(".rar"))
    return { icon: Archive, color: "#a855f7" };
  if (/\.(png|jpg|jpeg|gif|webp)$/.test(n))
    return { icon: FileImage, color: "#06b6d4" };
  return { icon: File, color: "#6b7280" };
};

const fmtSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/* ─── determines if a file can be viewed inline in the browser ─── */
const canViewInline = (name = "") => {
  const n = name.toLowerCase();
  return /\.(pdf|png|jpg|jpeg|gif|webp|txt)$/.test(n);
};

/* ─── builds the correct viewer URL for any file type ─── */
const getViewerUrl = (originalName = "", blobUrl = "") => {
  const n = originalName.toLowerCase();
  // PDF and images open directly in browser
  if (/\.(pdf|png|jpg|jpeg|gif|webp|txt)$/.test(n)) return blobUrl;
  // Office files → Google Docs Viewer (needs a public URL, so we use MS Office Online with blob)
  // Since files are private/local, best approach: open blob directly and let browser handle it
  // For .doc/.docx/.ppt/.pptx/.xls/.xlsx → use Office Online viewer via blob URL trick
  return blobUrl; // browser will prompt download for unsupported types — that's correct behavior
};

/* ═══════════════════════════════════════════════════════════════════
   FILE PREVIEW MODAL
   - PDF / images → renders directly via <iframe> / <img>
   - Office docs (docx, pptx, xlsx) → uses Microsoft Office Online viewer
     which requires a publicly accessible URL. Since your backend is local,
     we fall back to an embedded iframe with the blob URL; browser will
     show native viewer or "download" prompt. For production, expose a
     public /view/{id} URL and pass it to the Office Online viewer.
   - .doc / old formats → direct download (no browser rendering possible)
═══════════════════════════════════════════════════════════════════ */
const FilePreviewModal = ({ doc, onClose, isDark, c }) => {
  const [loading, setLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState("");

  const name = (doc.originalName || "").toLowerCase();
  const isPdf = name.endsWith(".pdf");
  const isImage = /\.(png|jpg|jpeg|gif|webp)$/.test(name);
  const isTxt = name.endsWith(".txt");
  const isOfficeNew =
    name.endsWith(".docx") || name.endsWith(".pptx") || name.endsWith(".xlsx");
  const isOfficeOld =
    name.endsWith(".doc") || name.endsWith(".ppt") || name.endsWith(".xls");

  useEffect(() => {
    let objectUrl = null;
    const load = async () => {
      try {
        const res = await fileService.viewFileBlob(doc.id);
        const contentType =
          res.headers?.["content-type"] ||
          (isPdf
            ? "application/pdf"
            : isImage
              ? "image/jpeg"
              : "application/octet-stream");
        const blob = new Blob([res.data], { type: contentType });
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (e) {
        setError("Could not load file preview.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc.id]);

  // For new Office formats: use Microsoft Office Online viewer
  // NOTE: This only works with a publicly accessible URL.
  // If your backend is on localhost, swap `blobUrl` with your public URL.
  const msViewerUrl = blobUrl
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(blobUrl)}`
    : null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: c.modalOverlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: c.modalBg,
          borderRadius: 14,
          width: "92vw",
          maxWidth: 900,
          height: "88vh",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${c.cardBorder}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          overflow: "hidden",
          fontFamily: FF,
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${c.cardBorder}`,
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: c.textPrimary,
                fontFamily: FF,
              }}
            >
              {doc.title || doc.originalName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: c.textSub,
                fontFamily: FF,
                marginTop: 1,
              }}
            >
              {doc.originalName} · {fmtSize(doc.size)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Download button always available */}
            {blobUrl && (
              <a
                href={blobUrl}
                download={doc.originalName}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 13px",
                  borderRadius: 7,
                  border: `1px solid ${c.cardBorder}`,
                  background: c.zeroBg,
                  color: c.textPrimary,
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: FF,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Download size={12} /> Download
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: c.textSub,
                display: "flex",
                alignItems: "center",
                padding: 4,
                borderRadius: 6,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* body */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            background: isDark ? "#0d1118" : "#f4f4f4",
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "3px solid " + c.cardBorder,
                  borderTopColor: c.accent,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>
                Loading preview…
              </span>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {error && !loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <FileText size={40} color={c.textMuted} />
              <span style={{ fontSize: 13, color: c.textSub, fontFamily: FF }}>
                {error}
              </span>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <>
              {/* PDF */}
              {isPdf && (
                <iframe
                  src={blobUrl}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="PDF Preview"
                />
              )}

              {/* Images */}
              {isImage && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "auto",
                    padding: 16,
                  }}
                >
                  <img
                    src={blobUrl}
                    alt={doc.originalName}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}

              {/* Plain text */}
              {isTxt && (
                <iframe
                  src={blobUrl}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "#fff",
                    color: "#000",
                    padding: 0,
                  }}
                  title="Text Preview"
                />
              )}

              {/* New Office formats — try MS Office Online viewer */}
              {isOfficeNew && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: c.accentBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FileText size={26} color={c.accent} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: c.textPrimary,
                        fontFamily: FF,
                        marginBottom: 6,
                      }}
                    >
                      {name.endsWith(".docx")
                        ? "Word Document"
                        : name.endsWith(".pptx")
                          ? "PowerPoint Presentation"
                          : "Excel Spreadsheet"}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: c.textSub,
                        fontFamily: FF,
                        lineHeight: 1.6,
                        maxWidth: 420,
                      }}
                    >
                      Browser cannot render Office files directly. Use one of
                      the options below to view this file:
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <a
                      href={blobUrl}
                      download={doc.originalName}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 18px",
                        borderRadius: 8,
                        border: "none",
                        background: c.accent,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: FF,
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Download size={14} /> Download & Open Locally
                    </a>
                    {/* Google Docs viewer link — works only if file is publicly accessible */}
                    <a
                      href={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + `/api/file/view/${doc.id}`)}&embedded=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 18px",
                        borderRadius: 8,
                        border: `1px solid ${c.cardBorder}`,
                        background: c.zeroBg,
                        color: c.textPrimary,
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: FF,
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={14} /> Try Google Docs Viewer
                    </a>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: c.textMuted,
                      fontFamily: FF,
                      textAlign: "center",
                      maxWidth: 380,
                    }}
                  >
                    💡 Google Docs Viewer requires the file to be publicly
                    accessible. Download is always available.
                  </div>
                </div>
              )}

              {/* Old Office formats (.doc, .ppt, .xls) — can't be rendered anywhere */}
              {isOfficeOld && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: "rgba(234,179,8,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FileText size={26} color="#fbbf24" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: c.textPrimary,
                        fontFamily: FF,
                        marginBottom: 6,
                      }}
                    >
                      Legacy Office Format
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: c.textSub,
                        fontFamily: FF,
                        lineHeight: 1.6,
                        maxWidth: 380,
                      }}
                    >
                      <strong>.doc / .ppt / .xls</strong> files cannot be
                      previewed in the browser. Download the file and open it in
                      Microsoft Office or LibreOffice.
                    </div>
                  </div>
                  <a
                    href={blobUrl}
                    download={doc.originalName}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 18px",
                      borderRadius: 8,
                      border: "none",
                      background: c.accent,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: FF,
                      textDecoration: "none",
                    }}
                  >
                    <Download size={14} /> Download File
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   EDIT MODAL
═══════════════════════════════════════════════════════════════════ */
const EditModal = ({ doc, batches, courses, c, isDark, onClose, onSaved }) => {
  const [title, setTitle] = useState(doc.title || doc.originalName || "");
  const [description, setDescription] = useState(doc.description || "");
  const [category, setCategory] = useState(doc.category || "");
  const [batchId, setBatchId] = useState(
    doc.batchId ? String(doc.batchId) : "",
  );
  const [courseId, setCourseId] = useState(
    doc.courseId ? String(doc.courseId) : "",
  );
  const [status, setStatus] = useState(doc.status || "draft");
  const [newFile, setNewFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const CATEGORIES = ["Notes", "Assignment", "Slides", "Reference", "Other"];

  const rowStyle = { display: "flex", flexDirection: "column", gap: 3 };
  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: c.textSub,
    fontFamily: FF,
    marginBottom: 3,
    display: "block",
  };
  const inputStyle = {
    width: "100%",
    fontSize: 12,
    padding: "7px 10px",
    borderRadius: 7,
    border: `1px solid ${c.cardBorder}`,
    background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    color: c.textPrimary,
    fontFamily: FF,
    outline: "none",
    boxSizing: "border-box",
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const resolvedBatch =
        batchId && batchId !== "default_segment" ? batchId : null;
      const resolvedCourse = courseId && courseId !== "" ? courseId : null;
      const res = await fileService.editFile(
        doc.id,
        newFile || null,
        title,
        description,
        resolvedBatch,
        resolvedCourse,
        category,
        status,
      );
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save changes",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: c.modalOverlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: c.modalBg,
          borderRadius: 18,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 24,
          border: `1px solid ${c.cardBorder}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          fontFamily: FF,
          position: "relative",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: c.textPrimary,
              }}
            >
              Edit Document
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: c.textSub }}>
              ID {doc.id} · {doc.originalName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: c.textSub,
              display: "flex",
              alignItems: "center",
              padding: 4,
              borderRadius: 6,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title */}
          <div style={rowStyle}>
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />
          </div>

          {/* Description */}
          <div style={rowStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{
                ...inputStyle,
                minHeight: 68,
                resize: "vertical",
                lineHeight: 1.5,
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description…"
            />
          </div>

          {/* Replace file */}
          <div style={rowStyle}>
            <label style={labelStyle}>
              Replace File{" "}
              <span style={{ fontWeight: 400, opacity: 0.6 }}>
                (leave empty to keep current)
              </span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: `1px solid ${c.cardBorder}`,
                  background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                  color: c.textSub,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FF,
                }}
              >
                <Upload size={12} /> Choose File
              </button>
              <span style={{ fontSize: 11, color: c.textMuted }}>
                {newFile ? newFile.name : doc.originalName || "no file chosen"}
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setNewFile(e.target.files[0] || null)}
            />
          </div>

          {/* Batch + Category in a row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={rowStyle}>
              <label style={labelStyle}>Batch</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              >
                <option value="">No Batch</option>
                {batches.map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name || `Batch ${b.id}`} (ID: {b.id})
                  </option>
                ))}
              </select>
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Category</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">None</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course + Status in a row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={rowStyle}>
              <label style={labelStyle}>Course</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">None</option>
                {courses.map((co) => (
                  <option key={co.value} value={co.value}>
                    {co.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Status</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
                fontSize: 11,
                color: "#f87171",
                fontFamily: FF,
              }}
            >
              {error}
            </div>
          )}

          {/* actions */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              paddingTop: 6,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "8px 18px",
                borderRadius: 9,
                border: `1px solid ${c.cardBorder}`,
                background: "transparent",
                color: c.textSub,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FF,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "8px 22px",
                borderRadius: 9,
                border: "none",
                background: saving
                  ? "#1d4ed8aa"
                  : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: FF,
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
            >
              {saving ? (
                "Saving…"
              ) : (
                <>
                  <Pencil size={12} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── CUSTOM SELECT ─── */
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  c,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const sel = options.find((o) => (o.value ?? o) === value);
  const display = sel ? (sel.label ?? sel) : null;
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          ...inp(c),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
          color: display ? c.textPrimary : c.textMuted,
        }}
      >
        <span style={{ fontSize: 13, fontFamily: FF }}>
          {display ?? placeholder}
        </span>
        <ChevronDown
          size={15}
          color={c.textSub}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        />
      </div>
      {open && (
        <div
          style={{
            position: "fixed",
            zIndex: 99999,
            background: c.cardBg,
            border: `1px solid ${c.inputBorder}`,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
            maxHeight: 220,
            overflowY: "auto",
            width: ref.current ? ref.current.offsetWidth : "auto",
            top: ref.current
              ? ref.current.getBoundingClientRect().bottom + 2
              : "auto",
            left: ref.current
              ? ref.current.getBoundingClientRect().left
              : "auto",
          }}
        >
          {options.map((opt) => {
            const val = opt.value ?? opt;
            const lbl_ = opt.label ?? opt;
            const isSel = val === value;
            return (
              <div
                key={val}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
                style={{
                  padding: "9px 13px",
                  fontSize: 13,
                  fontFamily: FF,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: isSel ? c.accent : c.textPrimary,
                  background: isSel ? c.accentBg : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSel) e.currentTarget.style.background = c.hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isSel) e.currentTarget.style.background = "transparent";
                }}
              >
                {lbl_}
                {isSel && <Check size={13} color={c.accent} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── ASSIGN BATCH BUTTON ─── */
const AssignBatchButton = ({ doc, onAssigned, batches, c }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAssign = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const res = await fileService.assignFileBatch(doc.id, selected);
      onAssigned(res.data);
      setOpen(false);
      setSelected("");
    } catch {
      setError("Failed to assign batch");
    } finally {
      setSaving(false);
    }
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "5px 11px",
          borderRadius: 6,
          border: "1px solid rgba(251,146,60,0.4)",
          background: "rgba(251,146,60,0.08)",
          color: "#fb923c",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: FF,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(251,146,60,0.16)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(251,146,60,0.08)")
        }
      >
        ⚠ No Batch — Assign
      </button>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          fontSize: 12,
          padding: "6px 8px",
          borderRadius: 6,
          border: `1px solid ${c.inputBorder}`,
          background: c.inputBg,
          color: c.textPrimary,
          fontFamily: FF,
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="">Select batch…</option>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name || `Batch ${b.id}`} (ID: {b.id})
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>
          {error}
        </span>
      )}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={handleAssign}
          disabled={!selected || saving}
          style={{
            padding: "5px 12px",
            borderRadius: 6,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: FF,
            opacity: !selected || saving ? 0.5 : 1,
          }}
        >
          {saving ? "Saving…" : "Assign"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setError("");
            setSelected("");
          }}
          style={{
            padding: "5px 10px",
            borderRadius: 6,
            border: `1px solid ${c.inputBorder}`,
            background: "transparent",
            color: c.textSub,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: FF,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ─── PUBLISH BUTTON ─── */
const PublishButton = ({ doc, onPublished }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const handlePublish = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fileService.publishFile(doc.id);
      onPublished(res.data);
    } catch {
      setError("Failed to publish");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <button
        onClick={handlePublish}
        disabled={saving}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 13px",
          borderRadius: 6,
          border: "1px solid rgba(34,197,94,0.4)",
          background: "rgba(34,197,94,0.08)",
          color: "#22c55e",
          fontSize: 11,
          fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer",
          fontFamily: FF,
          opacity: saving ? 0.6 : 1,
          transition: "all .15s",
        }}
        onMouseEnter={(e) => {
          if (!saving)
            e.currentTarget.style.background = "rgba(34,197,94,0.16)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(34,197,94,0.08)";
        }}
      >
        <Send size={11} />
        {saving ? "Publishing…" : "Publish Now"}
      </button>
      {error && (
        <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>
          {error}
        </span>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DOC CARD
═══════════════════════════════════════════════════════════════════ */
const DocCard = ({
  doc,
  onDelete,
  onUpdated,
  onEdit,
  onView,
  batches,
  isDark,
  c,
}) => {
  const { icon: Icon, color: iconColor } = fileIcon(doc.originalName);
  const hasNoBatch = !doc.batchId;
  const isDraft = doc.status === "draft";
  const showPublishBtn = isDraft && !hasNoBatch;
  const showAssignBtn = hasNoBatch;

  const handleDownload = async () => {
    try {
      const res = await fileService.downloadFileBlob(doc.storedName);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalName || "file";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div
      style={{
        background: c.cardBg,
        border: hasNoBatch
          ? "1px solid rgba(251,146,60,0.3)"
          : isDraft
            ? "1px solid rgba(34,197,94,0.25)"
            : `1px solid ${c.cardBorder}`,
        borderRadius: 10,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow .2s",
      }}
    >
      {/* accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 14,
          right: 14,
          height: 2,
          background: hasNoBatch
            ? "linear-gradient(90deg,#fb923c,transparent)"
            : isDraft
              ? "linear-gradient(90deg,#22c55e,transparent)"
              : "linear-gradient(90deg,#065fd4,transparent)",
          borderRadius: "0 0 99px 99px",
          opacity: 0.7,
        }}
      />

      {/* no-batch warning */}
      {hasNoBatch && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#fb923c",
            fontFamily: FF,
            padding: "4px 9px",
            borderRadius: 5,
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.25)",
          }}
        >
          ⚠ Not visible to students — no batch assigned
        </div>
      )}

      {/* file icon + name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            flexShrink: 0,
            background: isDark ? "rgba(255,255,255,0.05)" : "#f4f6fb",
            border: `1px solid ${c.cardBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Icon size={20} color={iconColor} />
          {isDraft && (
            <div
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                padding: "1px 5px",
                borderRadius: 10,
                background: "rgba(234,179,8,0.2)",
                color: "#fbbf24",
                fontSize: 8,
                fontWeight: 700,
                fontFamily: FF,
              }}
            >
              DRAFT
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: c.textPrimary,
              fontFamily: FF,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc.title || doc.originalName}
          </div>
          <div
            style={{
              fontSize: 11,
              color: c.textSub,
              fontFamily: FF,
              marginTop: 2,
            }}
          >
            {doc.originalName} · {fmtSize(doc.size)}
          </div>
        </div>
      </div>

      {/* pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {doc.category && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: "rgba(6,95,212,0.1)",
              color: "#065fd4",
              fontFamily: FF,
            }}
          >
            {doc.category}
          </span>
        )}
        {doc.batchId && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: isDark
                ? "rgba(34,211,238,0.08)"
                : "rgba(34,211,238,0.06)",
              color: "#0891b2",
              fontFamily: FF,
            }}
          >
            Batch {doc.batchId}
          </span>
        )}
        {doc.status && !isDraft && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: "rgba(34,197,94,0.1)",
              color: "#16a34a",
              fontFamily: FF,
            }}
          >
            published
          </span>
        )}
      </div>

      {/* description */}
      {doc.description && (
        <div
          style={{
            fontSize: 11,
            color: c.textSub,
            fontFamily: FF,
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {doc.description}
        </div>
      )}

      {/* action buttons */}
      <div
        style={{
          display: "flex",
          gap: 7,
          flexWrap: "wrap",
          paddingTop: 8,
          borderTop: `1px solid ${c.divider}`,
        }}
      >
        <button
          onClick={() => onView(doc)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 11px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            fontFamily: FF,
            border: `1px solid ${c.inputBorder}`,
            background: c.zeroBg,
            color: c.textPrimary,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = c.zeroBg)}
        >
          <Eye size={11} /> View
        </button>
        <button
          onClick={handleDownload}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 11px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            fontFamily: FF,
            border: `1px solid ${c.inputBorder}`,
            background: c.zeroBg,
            color: c.textPrimary,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = c.zeroBg)}
        >
          <Download size={11} /> Download
        </button>

        {/* ✅ EDIT BUTTON */}
        <button
          onClick={() => onEdit(doc)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 11px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            fontFamily: FF,
            border: "1px solid rgba(99,102,241,0.3)",
            background: "rgba(99,102,241,0.08)",
            color: "#818cf8",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(99,102,241,0.18)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(99,102,241,0.08)")
          }
        >
          <Pencil size={11} /> Edit
        </button>

        <button
          onClick={() => onDelete(doc.id)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 11px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            fontFamily: FF,
            border: "1px solid rgba(248,113,113,0.2)",
            background: "rgba(248,113,113,0.06)",
            color: "#f87171",
            marginLeft: "auto",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(248,113,113,0.14)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(248,113,113,0.06)")
          }
        >
          <Trash2 size={11} /> Delete
        </button>
      </div>

      {showPublishBtn && <PublishButton doc={doc} onPublished={onUpdated} />}
      {showAssignBtn && (
        <AssignBatchButton
          doc={doc}
          onAssigned={onUpdated}
          batches={batches}
          c={c}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN UPLOAD DOCUMENTS COMPONENT
═══════════════════════════════════════════════════════════════════ */
const UploadDocuments = () => {
  const { isDark } = useTrainerTheme();
  const c = getColors(isDark);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [batchId, setBatchId] = useState("default_segment");
  const [courseId, setCourseId] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [draftMsg, setDraftMsg] = useState("");

  const [docs, setDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  // modals
  const [editingDoc, setEditingDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const fileRef = useRef();

  useEffect(() => {
    videoService
      .getTrainerBatches()
      .then((res) => setBatches(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    courseService
      .getMyCourses()
      .then((res) => {
        const raw = res.data || [];
        setCourses(
          raw.map((co) => ({
            value: String(co.id),
            label: co.title ?? co.name ?? `Course ${co.id}`,
          })),
        );
      })
      .catch(() => {});
  }, []);

  const fetchDocs = async () => {
    setDocsLoading(true);
    try {
      const res = await fileService.getTrainerFiles();
      setDocs(res.data || []);
    } finally {
      setDocsLoading(false);
    }
  };
  useEffect(() => {
    fetchDocs();
  }, []);

  const batchOptions = [
    { value: "default_segment", label: "Default Segment (No Batch)" },
    ...batches.map((b) => ({
      value: String(b.id),
      label: `${b.name || "Batch"} (ID: ${b.id})`,
    })),
  ];
  const CATEGORIES = ["Notes", "Assignment", "Slides", "Reference", "Other"];
  const categoryOptions = CATEGORIES.map((cat) => ({ value: cat, label: cat }));
  const resolvedBatch =
    !batchId || batchId === "default_segment" ? null : batchId;

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handlePublish = async () => {
    if (!file) {
      setMessage("❌ Select a file first");
      setMsgType("error");
      return;
    }
    if (!title.trim()) {
      setMessage("❌ Title is required");
      setMsgType("error");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      await fileService.uploadFile(
        file,
        resolvedBatch,
        title,
        description,
        courseId || null,
        category || null,
        "published",
      );
      setMessage("✅ Document published successfully!");
      setMsgType("success");
      resetForm();
      fetchDocs();
    } catch {
      setMessage("❌ Upload failed. Check batch assignment.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async () => {
    if (!file) {
      setDraftMsg("⚠️ Select a file first");
      setTimeout(() => setDraftMsg(""), 3000);
      return;
    }
    try {
      setDraftLoading(true);
      setDraftMsg("");
      await fileService.uploadFile(
        file,
        resolvedBatch,
        title || file.name,
        description,
        courseId || null,
        category || null,
        "draft",
      );
      setDraftMsg("✏️ Draft saved successfully");
      fetchDocs();
    } catch {
      setDraftMsg("⚠️ Could not save draft. Please try again.");
    } finally {
      setDraftLoading(false);
      setTimeout(() => setDraftMsg(""), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    try {
      await fileService.deleteFile(id);
      setDocs((p) => p.filter((d) => d.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleDocUpdated = (updated) => {
    setDocs((p) => p.map((d) => (d.id === updated.id ? updated : d)));
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setBatchId("default_segment");
    setCourseId("");
    setCategory("");
  };

  return (
    <div style={{ fontFamily: FF }}>
      {/* modals */}
      {viewingDoc && (
        <FilePreviewModal
          doc={viewingDoc}
          onClose={() => setViewingDoc(null)}
          isDark={isDark}
          c={c}
        />
      )}
      {editingDoc && (
        <EditModal
          doc={editingDoc}
          batches={batches}
          courses={courses}
          c={c}
          isDark={isDark}
          onClose={() => setEditingDoc(null)}
          onSaved={(updated) => {
            handleDocUpdated(updated);
            setEditingDoc(null);
          }}
        />
      )}

      {/* ── UPLOAD FORM ── */}
      <div
        style={{
          background: c.cardBg,
          border: `1px solid ${c.cardBorder}`,
          borderRadius: 8,
          padding: 24,
          marginBottom: 20,
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: `1px solid ${c.divider}`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: c.accentBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={18} color={c.accent} />
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: c.textPrimary,
                fontFamily: FF,
              }}
            >
              Upload Document
            </div>
            <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>
              PDF, Word, PPT, Excel, ZIP and more
            </div>
          </div>
        </div>

        {/* drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileRef.current.click()}
          style={{
            border: `2px dashed ${dragging ? c.accent : file ? "#22c55e" : c.inputBorder}`,
            borderRadius: 6,
            background: dragging
              ? c.accentLight
              : file
                ? "rgba(34,197,94,0.04)"
                : c.zeroBg,
            cursor: "pointer",
            padding: "22px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 20,
            transition: "all .2s",
          }}
        >
          {file ? (
            <>
              <Check size={18} color="#22c55e" />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#22c55e",
                  fontFamily: FF,
                }}
              >
                {file.name}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setTitle("");
                }}
                style={{
                  fontSize: 11,
                  color: c.textSub,
                  cursor: "pointer",
                  fontFamily: FF,
                  marginLeft: 4,
                }}
              >
                Remove
              </span>
            </>
          ) : (
            <>
              <UploadCloud size={22} color={c.textMuted} />
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: c.textPrimary,
                    fontFamily: FF,
                  }}
                >
                  Drag and drop your file here
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: c.textSub,
                    fontFamily: FF,
                    marginTop: 2,
                  }}
                >
                  or click to browse files
                </div>
              </div>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* fields grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ gridColumn: "1 / 2" }}>
            <label style={lbl(c)}>DOCUMENT TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              style={inp(c)}
              onFocus={(e) => (e.target.style.borderColor = c.accent)}
              onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
            />
          </div>
          <div>
            <label style={lbl(c)}>SELECT BATCH</label>
            <CustomSelect
              value={batchId}
              onChange={setBatchId}
              options={batchOptions}
              placeholder="Select Batch"
              c={c}
            />
          </div>
          <div>
            <label style={lbl(c)}>SELECT COURSE</label>
            <CustomSelect
              value={courseId}
              onChange={setCourseId}
              options={[{ value: "", label: "None" }, ...courses]}
              placeholder="Select Course"
              c={c}
            />
          </div>
          <div>
            <label style={lbl(c)}>DOCUMENT CATEGORY</label>
            <CustomSelect
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              placeholder="Select Category"
              c={c}
            />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl(c)}>DESCRIPTION</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this document…"
            style={{ ...inp(c), resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = c.accent)}
            onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
          />
        </div>

        {batchId === "default_segment" && (
          <div
            style={{
              fontSize: 11,
              color: c.draftColor,
              fontFamily: FF,
              marginBottom: 12,
            }}
          >
            ⚠ No batch selected — document will not be visible to students until
            you assign a batch.
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {draftMsg && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 13px",
                  borderRadius: 20,
                  background: c.draftBg,
                  border: `1px solid ${c.draftBorder}`,
                  color: c.draftColor,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: FF,
                }}
              >
                <Save size={11} /> {draftMsg}
              </div>
            )}
            {message && !draftMsg && (
              <span
                style={{
                  fontSize: 12,
                  fontFamily: FF,
                  color: msgType === "success" ? c.successColor : c.errorColor,
                }}
              >
                {message}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={handleDraft}
              disabled={draftLoading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                borderRadius: 6,
                border: `1px solid ${c.draftBorder}`,
                background: c.draftBg,
                color: c.draftColor,
                fontSize: 13,
                fontWeight: 500,
                cursor: draftLoading ? "not-allowed" : "pointer",
                fontFamily: FF,
                opacity: draftLoading ? 0.6 : 1,
              }}
            >
              <Save size={13} />
              {draftLoading ? "Saving…" : "Save as Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 20px",
                borderRadius: 6,
                border: "none",
                background: "#22c55e",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: FF,
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Send size={13} />
              {loading ? "Publishing…" : "Publish Document"}
            </button>
          </div>
        </div>
      </div>

      {/* ── DOCUMENT LIST ── */}
      {docsLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: c.cardBg,
                borderRadius: 10,
                border: `1px solid ${c.cardBorder}`,
                padding: 16,
                animation: "shimmer 1.5s ease infinite",
              }}
            >
              <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
              <div
                style={{
                  height: 40,
                  borderRadius: 8,
                  background: c.divider,
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  height: 12,
                  width: "70%",
                  borderRadius: 5,
                  background: c.divider,
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "50%",
                  borderRadius: 4,
                  background: c.divider,
                }}
              />
            </div>
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "44px 24px",
            gap: 10,
            background: c.cardBg,
            borderRadius: 10,
            border: `1.5px dashed ${c.cardBorder}`,
          }}
        >
          <FileText size={28} color={c.textMuted} />
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: c.textSub,
              margin: 0,
              fontFamily: FF,
            }}
          >
            No documents yet
          </p>
          <p
            style={{
              fontSize: 11,
              color: c.textMuted,
              margin: 0,
              fontFamily: FF,
            }}
          >
            Upload your first document above
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {docs.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              onDelete={handleDelete}
              onUpdated={handleDocUpdated}
              onEdit={setEditingDoc}
              onView={setViewingDoc}
              batches={batches}
              isDark={isDark}
              c={c}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;
