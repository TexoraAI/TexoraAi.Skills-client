// import { useEffect, useRef, useState } from "react";
// import {
//   UploadCloud,
//   FileText,
//   Trash2,
//   Eye,
//   Download,
//   Send,
//   Save,
//   ChevronDown,
//   Check,
//   X,
//   File,
//   FileImage,
//   Archive,
//   Pencil,
//   Upload,
// } from "lucide-react";
// import fileService from "../services/fileService";
// import videoService from "../services/videoService";
// import { courseService } from "../services/courseService";
// import { useTrainerTheme } from "./trainerTheme";

// const FF = "'Poppins', sans-serif";

// const getColors = (isDark) => ({
//   cardBg: isDark ? "#1a1d27" : "#ffffff",
//   cardBorder: isDark ? "#2e3245" : "#e0e0e0",
//   inputBg: isDark ? "#12151f" : "#fafafa",
//   inputBorder: isDark ? "#2e3245" : "#d3d3d3",
//   textPrimary: isDark ? "#f0f0f0" : "#0d0d0d",
//   textSub: isDark ? "#8a8fa8" : "#606060",
//   textMuted: isDark ? "#555970" : "#aaaaaa",
//   accent: "#065fd4",
//   accentBg: isDark ? "#0d2a5e" : "#e8f0fe",
//   accentLight: isDark ? "#162644" : "#f0f7ff",
//   divider: isDark ? "#2e3245" : "#e5e5e5",
//   hoverBg: isDark ? "#22263a" : "#f2f2f2",
//   successColor: isDark ? "#34d399" : "#00873e",
//   errorColor: isDark ? "#f87171" : "#cc0000",
//   zeroBg: isDark ? "#0d1118" : "#f9f9f9",
//   draftColor: isDark ? "#fbbf24" : "#92400e",
//   draftBg: isDark ? "rgba(234,179,8,0.08)" : "rgba(254,249,195,0.8)",
//   draftBorder: isDark ? "rgba(234,179,8,0.35)" : "rgba(202,138,4,0.35)",
//   pageBg: isDark ? "#0d1118" : "#f4f6fb",
//   modalBg: isDark ? "#18181b" : "#ffffff",
//   modalOverlay: isDark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.45)",
// });

// const lbl = (c) => ({
//   fontSize: 12,
//   fontWeight: 500,
//   color: c.textSub,
//   marginBottom: 5,
//   fontFamily: FF,
//   display: "block",
// });
// const inp = (c) => ({
//   width: "100%",
//   padding: "9px 13px",
//   border: `1px solid ${c.inputBorder}`,
//   borderRadius: 4,
//   background: c.inputBg,
//   color: c.textPrimary,
//   fontSize: 13,
//   outline: "none",
//   fontFamily: FF,
//   boxSizing: "border-box",
// });

// const fileIcon = (name = "") => {
//   const n = name.toLowerCase();
//   if (n.endsWith(".pdf")) return { icon: FileText, color: "#ef4444" };
//   if (n.endsWith(".docx") || n.endsWith(".doc"))
//     return { icon: FileText, color: "#3b82f6" };
//   if (n.endsWith(".pptx") || n.endsWith(".ppt"))
//     return { icon: FileText, color: "#f97316" };
//   if (n.endsWith(".xlsx") || n.endsWith(".xls"))
//     return { icon: FileText, color: "#22c55e" };
//   if (n.endsWith(".zip") || n.endsWith(".rar"))
//     return { icon: Archive, color: "#a855f7" };
//   if (/\.(png|jpg|jpeg|gif|webp)$/.test(n))
//     return { icon: FileImage, color: "#06b6d4" };
//   return { icon: File, color: "#6b7280" };
// };

// const fmtSize = (bytes) => {
//   if (!bytes) return "—";
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//   return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
// };

// /* ─── determines if a file can be viewed inline in the browser ─── */
// const canViewInline = (name = "") => {
//   const n = name.toLowerCase();
//   return /\.(pdf|png|jpg|jpeg|gif|webp|txt)$/.test(n);
// };

// /* ─── builds the correct viewer URL for any file type ─── */
// const getViewerUrl = (originalName = "", blobUrl = "") => {
//   const n = originalName.toLowerCase();
//   // PDF and images open directly in browser
//   if (/\.(pdf|png|jpg|jpeg|gif|webp|txt)$/.test(n)) return blobUrl;
//   // Office files → Google Docs Viewer (needs a public URL, so we use MS Office Online with blob)
//   // Since files are private/local, best approach: open blob directly and let browser handle it
//   // For .doc/.docx/.ppt/.pptx/.xls/.xlsx → use Office Online viewer via blob URL trick
//   return blobUrl; // browser will prompt download for unsupported types — that's correct behavior
// };

// /* ═══════════════════════════════════════════════════════════════════
//    FILE PREVIEW MODAL
//    - PDF / images → renders directly via <iframe> / <img>
//    - Office docs (docx, pptx, xlsx) → uses Microsoft Office Online viewer
//      which requires a publicly accessible URL. Since your backend is local,
//      we fall back to an embedded iframe with the blob URL; browser will
//      show native viewer or "download" prompt. For production, expose a
//      public /view/{id} URL and pass it to the Office Online viewer.
//    - .doc / old formats → direct download (no browser rendering possible)
// ═══════════════════════════════════════════════════════════════════ */
// const FilePreviewModal = ({ doc, onClose, isDark, c }) => {
//   const [loading, setLoading] = useState(true);
//   const [blobUrl, setBlobUrl] = useState(null);
//   const [error, setError] = useState("");

//   const name = (doc.originalName || "").toLowerCase();
//   const isPdf = name.endsWith(".pdf");
//   const isImage = /\.(png|jpg|jpeg|gif|webp)$/.test(name);
//   const isTxt = name.endsWith(".txt");
//   const isOfficeNew =
//     name.endsWith(".docx") || name.endsWith(".pptx") || name.endsWith(".xlsx");
//   const isOfficeOld =
//     name.endsWith(".doc") || name.endsWith(".ppt") || name.endsWith(".xls");

//   useEffect(() => {
//     let objectUrl = null;
//     const load = async () => {
//       try {
//         const res = await fileService.viewFileBlob(doc.id);
//         const contentType =
//           res.headers?.["content-type"] ||
//           (isPdf
//             ? "application/pdf"
//             : isImage
//               ? "image/jpeg"
//               : "application/octet-stream");
//         const blob = new Blob([res.data], { type: contentType });
//         objectUrl = URL.createObjectURL(blob);
//         setBlobUrl(objectUrl);
//       } catch (e) {
//         setError("Could not load file preview.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//     return () => {
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [doc.id]);

//   // For new Office formats: use Microsoft Office Online viewer
//   // NOTE: This only works with a publicly accessible URL.
//   // If your backend is on localhost, swap `blobUrl` with your public URL.
//   const msViewerUrl = blobUrl
//     ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(blobUrl)}`
//     : null;

//   const handleBackdrop = (e) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div
//       onClick={handleBackdrop}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 99999,
//         background: c.modalOverlay,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 16,
//       }}
//     >
//       <div
//         style={{
//           background: c.modalBg,
//           borderRadius: 14,
//           width: "92vw",
//           maxWidth: 900,
//           height: "88vh",
//           display: "flex",
//           flexDirection: "column",
//           border: `1px solid ${c.cardBorder}`,
//           boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
//           overflow: "hidden",
//           fontFamily: FF,
//         }}
//       >
//         {/* header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "14px 20px",
//             borderBottom: `1px solid ${c.cardBorder}`,
//             flexShrink: 0,
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: 14,
//                 fontWeight: 600,
//                 color: c.textPrimary,
//                 fontFamily: FF,
//               }}
//             >
//               {doc.title || doc.originalName}
//             </div>
//             <div
//               style={{
//                 fontSize: 11,
//                 color: c.textSub,
//                 fontFamily: FF,
//                 marginTop: 1,
//               }}
//             >
//               {doc.originalName} · {fmtSize(doc.size)}
//             </div>
//           </div>
//           <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//             {/* Download button always available */}
//             {blobUrl && (
//               <a
//                 href={blobUrl}
//                 download={doc.originalName}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 5,
//                   padding: "6px 13px",
//                   borderRadius: 7,
//                   border: `1px solid ${c.cardBorder}`,
//                   background: c.zeroBg,
//                   color: c.textPrimary,
//                   fontSize: 12,
//                   fontWeight: 500,
//                   fontFamily: FF,
//                   textDecoration: "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 <Download size={12} /> Download
//               </a>
//             )}
//             <button
//               onClick={onClose}
//               style={{
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: c.textSub,
//                 display: "flex",
//                 alignItems: "center",
//                 padding: 4,
//                 borderRadius: 6,
//               }}
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* body */}
//         <div
//           style={{
//             flex: 1,
//             overflow: "hidden",
//             position: "relative",
//             background: isDark ? "#0d1118" : "#f4f4f4",
//           }}
//         >
//           {loading && (
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 12,
//               }}
//             >
//               <div
//                 style={{
//                   width: 32,
//                   height: 32,
//                   border: "3px solid " + c.cardBorder,
//                   borderTopColor: c.accent,
//                   borderRadius: "50%",
//                   animation: "spin 0.8s linear infinite",
//                 }}
//               />
//               <span style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>
//                 Loading preview…
//               </span>
//               <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
//             </div>
//           )}

//           {error && !loading && (
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 10,
//               }}
//             >
//               <FileText size={40} color={c.textMuted} />
//               <span style={{ fontSize: 13, color: c.textSub, fontFamily: FF }}>
//                 {error}
//               </span>
//             </div>
//           )}

//           {!loading && !error && blobUrl && (
//             <>
//               {/* PDF */}
//               {isPdf && (
//                 <iframe
//                   src={blobUrl}
//                   style={{ width: "100%", height: "100%", border: "none" }}
//                   title="PDF Preview"
//                 />
//               )}

//               {/* Images */}
//               {isImage && (
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     overflow: "auto",
//                     padding: 16,
//                   }}
//                 >
//                   <img
//                     src={blobUrl}
//                     alt={doc.originalName}
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "100%",
//                       objectFit: "contain",
//                       borderRadius: 6,
//                     }}
//                   />
//                 </div>
//               )}

//               {/* Plain text */}
//               {isTxt && (
//                 <iframe
//                   src={blobUrl}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     border: "none",
//                     background: "#fff",
//                     color: "#000",
//                     padding: 0,
//                   }}
//                   title="Text Preview"
//                 />
//               )}

//               {/* New Office formats — try MS Office Online viewer */}
//               {isOfficeNew && (
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 16,
//                     padding: 24,
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 56,
//                       height: 56,
//                       borderRadius: 14,
//                       background: c.accentBg,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <FileText size={26} color={c.accent} />
//                   </div>
//                   <div style={{ textAlign: "center" }}>
//                     <div
//                       style={{
//                         fontSize: 14,
//                         fontWeight: 600,
//                         color: c.textPrimary,
//                         fontFamily: FF,
//                         marginBottom: 6,
//                       }}
//                     >
//                       {name.endsWith(".docx")
//                         ? "Word Document"
//                         : name.endsWith(".pptx")
//                           ? "PowerPoint Presentation"
//                           : "Excel Spreadsheet"}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 12,
//                         color: c.textSub,
//                         fontFamily: FF,
//                         lineHeight: 1.6,
//                         maxWidth: 420,
//                       }}
//                     >
//                       Browser cannot render Office files directly. Use one of
//                       the options below to view this file:
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: 10,
//                       flexWrap: "wrap",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <a
//                       href={blobUrl}
//                       download={doc.originalName}
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: 6,
//                         padding: "9px 18px",
//                         borderRadius: 8,
//                         border: "none",
//                         background: c.accent,
//                         color: "#fff",
//                         fontSize: 13,
//                         fontWeight: 600,
//                         fontFamily: FF,
//                         textDecoration: "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <Download size={14} /> Download & Open Locally
//                     </a>
//                     {/* Google Docs viewer link — works only if file is publicly accessible */}
//                     <a
//                       href={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + `/api/file/view/${doc.id}`)}&embedded=true`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: 6,
//                         padding: "9px 18px",
//                         borderRadius: 8,
//                         border: `1px solid ${c.cardBorder}`,
//                         background: c.zeroBg,
//                         color: c.textPrimary,
//                         fontSize: 13,
//                         fontWeight: 500,
//                         fontFamily: FF,
//                         textDecoration: "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <Eye size={14} /> Try Google Docs Viewer
//                     </a>
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 11,
//                       color: c.textMuted,
//                       fontFamily: FF,
//                       textAlign: "center",
//                       maxWidth: 380,
//                     }}
//                   >
//                     💡 Google Docs Viewer requires the file to be publicly
//                     accessible. Download is always available.
//                   </div>
//                 </div>
//               )}

//               {/* Old Office formats (.doc, .ppt, .xls) — can't be rendered anywhere */}
//               {isOfficeOld && (
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 16,
//                     padding: 24,
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 56,
//                       height: 56,
//                       borderRadius: 14,
//                       background: "rgba(234,179,8,0.1)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <FileText size={26} color="#fbbf24" />
//                   </div>
//                   <div style={{ textAlign: "center" }}>
//                     <div
//                       style={{
//                         fontSize: 14,
//                         fontWeight: 600,
//                         color: c.textPrimary,
//                         fontFamily: FF,
//                         marginBottom: 6,
//                       }}
//                     >
//                       Legacy Office Format
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 12,
//                         color: c.textSub,
//                         fontFamily: FF,
//                         lineHeight: 1.6,
//                         maxWidth: 380,
//                       }}
//                     >
//                       <strong>.doc / .ppt / .xls</strong> files cannot be
//                       previewed in the browser. Download the file and open it in
//                       Microsoft Office or LibreOffice.
//                     </div>
//                   </div>
//                   <a
//                     href={blobUrl}
//                     download={doc.originalName}
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 6,
//                       padding: "9px 18px",
//                       borderRadius: 8,
//                       border: "none",
//                       background: c.accent,
//                       color: "#fff",
//                       fontSize: 13,
//                       fontWeight: 600,
//                       fontFamily: FF,
//                       textDecoration: "none",
//                     }}
//                   >
//                     <Download size={14} /> Download File
//                   </a>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════════
//    EDIT MODAL
// ═══════════════════════════════════════════════════════════════════ */
// const EditModal = ({ doc, batches, courses, c, isDark, onClose, onSaved }) => {
//   const [title, setTitle] = useState(doc.title || doc.originalName || "");
//   const [description, setDescription] = useState(doc.description || "");
//   const [category, setCategory] = useState(doc.category || "");
//   const [batchId, setBatchId] = useState(
//     doc.batchId ? String(doc.batchId) : "",
//   );
//   const [courseId, setCourseId] = useState(
//     doc.courseId ? String(doc.courseId) : "",
//   );
//   const [status, setStatus] = useState(doc.status || "draft");
//   const [newFile, setNewFile] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const fileRef = useRef();

//   const CATEGORIES = ["Notes", "Assignment", "Slides", "Reference", "Other"];

//   const rowStyle = { display: "flex", flexDirection: "column", gap: 3 };
//   const labelStyle = {
//     fontSize: 11,
//     fontWeight: 600,
//     color: c.textSub,
//     fontFamily: FF,
//     marginBottom: 3,
//     display: "block",
//   };
//   const inputStyle = {
//     width: "100%",
//     fontSize: 12,
//     padding: "7px 10px",
//     borderRadius: 7,
//     border: `1px solid ${c.cardBorder}`,
//     background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
//     color: c.textPrimary,
//     fontFamily: FF,
//     outline: "none",
//     boxSizing: "border-box",
//   };

//   const handleSave = async () => {
//     if (!title.trim()) {
//       setError("Title is required");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     try {
//       const resolvedBatch =
//         batchId && batchId !== "default_segment" ? batchId : null;
//       const resolvedCourse = courseId && courseId !== "" ? courseId : null;
//       const res = await fileService.editFile(
//         doc.id,
//         newFile || null,
//         title,
//         description,
//         resolvedBatch,
//         resolvedCourse,
//         category,
//         status,
//       );
//       onSaved(res.data);
//       onClose();
//     } catch (err) {
//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to save changes",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleBackdrop = (e) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div
//       onClick={handleBackdrop}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 99999,
//         background: c.modalOverlay,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 16,
//       }}
//     >
//       <div
//         style={{
//           background: c.modalBg,
//           borderRadius: 18,
//           width: "100%",
//           maxWidth: 520,
//           maxHeight: "90vh",
//           overflowY: "auto",
//           padding: 24,
//           border: `1px solid ${c.cardBorder}`,
//           boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
//           fontFamily: FF,
//           position: "relative",
//         }}
//       >
//         {/* header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 20,
//           }}
//         >
//           <div>
//             <h3
//               style={{
//                 margin: 0,
//                 fontSize: 15,
//                 fontWeight: 700,
//                 color: c.textPrimary,
//               }}
//             >
//               Edit Document
//             </h3>
//             <p style={{ margin: "2px 0 0", fontSize: 11, color: c.textSub }}>
//               ID {doc.id} · {doc.originalName}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: c.textSub,
//               display: "flex",
//               alignItems: "center",
//               padding: 4,
//               borderRadius: 6,
//             }}
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {/* Title */}
//           <div style={rowStyle}>
//             <label style={labelStyle}>Title *</label>
//             <input
//               style={inputStyle}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Document title"
//             />
//           </div>

//           {/* Description */}
//           <div style={rowStyle}>
//             <label style={labelStyle}>Description</label>
//             <textarea
//               style={{
//                 ...inputStyle,
//                 minHeight: 68,
//                 resize: "vertical",
//                 lineHeight: 1.5,
//               }}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Brief description…"
//             />
//           </div>

//           {/* Replace file */}
//           <div style={rowStyle}>
//             <label style={labelStyle}>
//               Replace File{" "}
//               <span style={{ fontWeight: 400, opacity: 0.6 }}>
//                 (leave empty to keep current)
//               </span>
//             </label>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <button
//                 onClick={() => fileRef.current?.click()}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "7px 14px",
//                   borderRadius: 8,
//                   border: `1px solid ${c.cardBorder}`,
//                   background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
//                   color: c.textSub,
//                   fontSize: 11,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   fontFamily: FF,
//                 }}
//               >
//                 <Upload size={12} /> Choose File
//               </button>
//               <span style={{ fontSize: 11, color: c.textMuted }}>
//                 {newFile ? newFile.name : doc.originalName || "no file chosen"}
//               </span>
//             </div>
//             <input
//               ref={fileRef}
//               type="file"
//               style={{ display: "none" }}
//               onChange={(e) => setNewFile(e.target.files[0] || null)}
//             />
//           </div>

//           {/* Batch + Category in a row */}
//           <div
//             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
//           >
//             <div style={rowStyle}>
//               <label style={labelStyle}>Batch</label>
//               <select
//                 style={{ ...inputStyle, cursor: "pointer" }}
//                 value={batchId}
//                 onChange={(e) => setBatchId(e.target.value)}
//               >
//                 <option value="">No Batch</option>
//                 {batches.map((b) => (
//                   <option key={b.id} value={String(b.id)}>
//                     {b.name || `Batch ${b.id}`} (ID: {b.id})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={rowStyle}>
//               <label style={labelStyle}>Category</label>
//               <select
//                 style={{ ...inputStyle, cursor: "pointer" }}
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <option value="">None</option>
//                 {CATEGORIES.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Course + Status in a row */}
//           <div
//             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
//           >
//             <div style={rowStyle}>
//               <label style={labelStyle}>Course</label>
//               <select
//                 style={{ ...inputStyle, cursor: "pointer" }}
//                 value={courseId}
//                 onChange={(e) => setCourseId(e.target.value)}
//               >
//                 <option value="">None</option>
//                 {courses.map((co) => (
//                   <option key={co.value} value={co.value}>
//                     {co.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={rowStyle}>
//               <label style={labelStyle}>Status</label>
//               <select
//                 style={{ ...inputStyle, cursor: "pointer" }}
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//               >
//                 <option value="draft">Draft</option>
//                 <option value="published">Published</option>
//               </select>
//             </div>
//           </div>

//           {error && (
//             <div
//               style={{
//                 padding: "8px 12px",
//                 borderRadius: 8,
//                 background: "rgba(248,113,113,0.08)",
//                 border: "1px solid rgba(248,113,113,0.25)",
//                 fontSize: 11,
//                 color: "#f87171",
//                 fontFamily: FF,
//               }}
//             >
//               {error}
//             </div>
//           )}

//           {/* actions */}
//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               justifyContent: "flex-end",
//               paddingTop: 6,
//             }}
//           >
//             <button
//               onClick={onClose}
//               style={{
//                 padding: "8px 18px",
//                 borderRadius: 9,
//                 border: `1px solid ${c.cardBorder}`,
//                 background: "transparent",
//                 color: c.textSub,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 fontFamily: FF,
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               style={{
//                 padding: "8px 22px",
//                 borderRadius: 9,
//                 border: "none",
//                 background: saving
//                   ? "#1d4ed8aa"
//                   : "linear-gradient(135deg,#2563eb,#1d4ed8)",
//                 color: "#fff",
//                 fontSize: 12,
//                 fontWeight: 700,
//                 cursor: saving ? "not-allowed" : "pointer",
//                 fontFamily: FF,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 7,
//                 boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
//               }}
//             >
//               {saving ? (
//                 "Saving…"
//               ) : (
//                 <>
//                   <Pencil size={12} /> Save Changes
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── CUSTOM SELECT ─── */
// const CustomSelect = ({
//   value,
//   onChange,
//   options,
//   placeholder = "Select...",
//   c,
// }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef();
//   useEffect(() => {
//     const close = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);
//   const sel = options.find((o) => (o.value ?? o) === value);
//   const display = sel ? (sel.label ?? sel) : null;
//   return (
//     <div ref={ref} style={{ position: "relative", width: "100%" }}>
//       <div
//         onClick={() => setOpen((p) => !p)}
//         style={{
//           ...inp(c),
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           cursor: "pointer",
//           userSelect: "none",
//           color: display ? c.textPrimary : c.textMuted,
//         }}
//       >
//         <span style={{ fontSize: 13, fontFamily: FF }}>
//           {display ?? placeholder}
//         </span>
//         <ChevronDown
//           size={15}
//           color={c.textSub}
//           style={{
//             transform: open ? "rotate(180deg)" : "none",
//             transition: "transform .2s",
//           }}
//         />
//       </div>
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             zIndex: 99999,
//             background: c.cardBg,
//             border: `1px solid ${c.inputBorder}`,
//             borderRadius: 4,
//             overflow: "hidden",
//             boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
//             maxHeight: 220,
//             overflowY: "auto",
//             width: ref.current ? ref.current.offsetWidth : "auto",
//             top: ref.current
//               ? ref.current.getBoundingClientRect().bottom + 2
//               : "auto",
//             left: ref.current
//               ? ref.current.getBoundingClientRect().left
//               : "auto",
//           }}
//         >
//           {options.map((opt) => {
//             const val = opt.value ?? opt;
//             const lbl_ = opt.label ?? opt;
//             const isSel = val === value;
//             return (
//               <div
//                 key={val}
//                 onClick={() => {
//                   onChange(val);
//                   setOpen(false);
//                 }}
//                 style={{
//                   padding: "9px 13px",
//                   fontSize: 13,
//                   fontFamily: FF,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   color: isSel ? c.accent : c.textPrimary,
//                   background: isSel ? c.accentBg : "transparent",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isSel) e.currentTarget.style.background = c.hoverBg;
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isSel) e.currentTarget.style.background = "transparent";
//                 }}
//               >
//                 {lbl_}
//                 {isSel && <Check size={13} color={c.accent} />}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─── ASSIGN BATCH BUTTON ─── */
// const AssignBatchButton = ({ doc, onAssigned, batches, c }) => {
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const handleAssign = async () => {
//     if (!selected) return;
//     setSaving(true);
//     setError("");
//     try {
//       const res = await fileService.assignFileBatch(doc.id, selected);
//       onAssigned(res.data);
//       setOpen(false);
//       setSelected("");
//     } catch {
//       setError("Failed to assign batch");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open)
//     return (
//       <button
//         onClick={() => setOpen(true)}
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: 5,
//           padding: "5px 11px",
//           borderRadius: 6,
//           border: "1px solid rgba(251,146,60,0.4)",
//           background: "rgba(251,146,60,0.08)",
//           color: "#fb923c",
//           fontSize: 11,
//           fontWeight: 600,
//           cursor: "pointer",
//           fontFamily: FF,
//         }}
//         onMouseEnter={(e) =>
//           (e.currentTarget.style.background = "rgba(251,146,60,0.16)")
//         }
//         onMouseLeave={(e) =>
//           (e.currentTarget.style.background = "rgba(251,146,60,0.08)")
//         }
//       >
//         ⚠ No Batch — Assign
//       </button>
//     );

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//       <select
//         value={selected}
//         onChange={(e) => setSelected(e.target.value)}
//         style={{
//           fontSize: 12,
//           padding: "6px 8px",
//           borderRadius: 6,
//           border: `1px solid ${c.inputBorder}`,
//           background: c.inputBg,
//           color: c.textPrimary,
//           fontFamily: FF,
//           outline: "none",
//           cursor: "pointer",
//         }}
//       >
//         <option value="">Select batch…</option>
//         {batches.map((b) => (
//           <option key={b.id} value={b.id}>
//             {b.name || `Batch ${b.id}`} (ID: {b.id})
//           </option>
//         ))}
//       </select>
//       {error && (
//         <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>
//           {error}
//         </span>
//       )}
//       <div style={{ display: "flex", gap: 6 }}>
//         <button
//           onClick={handleAssign}
//           disabled={!selected || saving}
//           style={{
//             padding: "5px 12px",
//             borderRadius: 6,
//             border: "none",
//             background: "#2563eb",
//             color: "#fff",
//             fontSize: 11,
//             fontWeight: 600,
//             cursor: "pointer",
//             fontFamily: FF,
//             opacity: !selected || saving ? 0.5 : 1,
//           }}
//         >
//           {saving ? "Saving…" : "Assign"}
//         </button>
//         <button
//           onClick={() => {
//             setOpen(false);
//             setError("");
//             setSelected("");
//           }}
//           style={{
//             padding: "5px 10px",
//             borderRadius: 6,
//             border: `1px solid ${c.inputBorder}`,
//             background: "transparent",
//             color: c.textSub,
//             fontSize: 11,
//             cursor: "pointer",
//             fontFamily: FF,
//           }}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ─── PUBLISH BUTTON ─── */
// const PublishButton = ({ doc, onPublished }) => {
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const handlePublish = async () => {
//     setSaving(true);
//     setError("");
//     try {
//       const res = await fileService.publishFile(doc.id);
//       onPublished(res.data);
//     } catch {
//       setError("Failed to publish");
//     } finally {
//       setSaving(false);
//     }
//   };
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//       <button
//         onClick={handlePublish}
//         disabled={saving}
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: 6,
//           padding: "6px 13px",
//           borderRadius: 6,
//           border: "1px solid rgba(34,197,94,0.4)",
//           background: "rgba(34,197,94,0.08)",
//           color: "#22c55e",
//           fontSize: 11,
//           fontWeight: 600,
//           cursor: saving ? "not-allowed" : "pointer",
//           fontFamily: FF,
//           opacity: saving ? 0.6 : 1,
//           transition: "all .15s",
//         }}
//         onMouseEnter={(e) => {
//           if (!saving)
//             e.currentTarget.style.background = "rgba(34,197,94,0.16)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.background = "rgba(34,197,94,0.08)";
//         }}
//       >
//         <Send size={11} />
//         {saving ? "Publishing…" : "Publish Now"}
//       </button>
//       {error && (
//         <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>
//           {error}
//         </span>
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════════
//    DOC CARD
// ═══════════════════════════════════════════════════════════════════ */
// const DocCard = ({
//   doc,
//   onDelete,
//   onUpdated,
//   onEdit,
//   onView,
//   batches,
//   isDark,
//   c,
// }) => {
//   const { icon: Icon, color: iconColor } = fileIcon(doc.originalName);
//   const hasNoBatch = !doc.batchId;
//   const isDraft = doc.status === "draft";
//   const showPublishBtn = isDraft && !hasNoBatch;
//   const showAssignBtn = hasNoBatch;

//   const handleDownload = async () => {
//     try {
//       const res = await fileService.downloadFileBlob(doc.storedName);
//       const url = URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = doc.originalName || "file";
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch {
//       alert("Download failed");
//     }
//   };

//   return (
//     <div
//       style={{
//         background: c.cardBg,
//         border: hasNoBatch
//           ? "1px solid rgba(251,146,60,0.3)"
//           : isDraft
//             ? "1px solid rgba(34,197,94,0.25)"
//             : `1px solid ${c.cardBorder}`,
//         borderRadius: 10,
//         padding: "14px 16px",
//         display: "flex",
//         flexDirection: "column",
//         gap: 10,
//         position: "relative",
//         overflow: "hidden",
//         transition: "box-shadow .2s",
//       }}
//     >
//       {/* accent line */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 14,
//           right: 14,
//           height: 2,
//           background: hasNoBatch
//             ? "linear-gradient(90deg,#fb923c,transparent)"
//             : isDraft
//               ? "linear-gradient(90deg,#22c55e,transparent)"
//               : "linear-gradient(90deg,#065fd4,transparent)",
//           borderRadius: "0 0 99px 99px",
//           opacity: 0.7,
//         }}
//       />

//       {/* no-batch warning */}
//       {hasNoBatch && (
//         <div
//           style={{
//             fontSize: 10,
//             fontWeight: 600,
//             color: "#fb923c",
//             fontFamily: FF,
//             padding: "4px 9px",
//             borderRadius: 5,
//             background: "rgba(251,146,60,0.08)",
//             border: "1px solid rgba(251,146,60,0.25)",
//           }}
//         >
//           ⚠ Not visible to students — no batch assigned
//         </div>
//       )}

//       {/* file icon + name */}
//       <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
//         <div
//           style={{
//             width: 40,
//             height: 40,
//             borderRadius: 8,
//             flexShrink: 0,
//             background: isDark ? "rgba(255,255,255,0.05)" : "#f4f6fb",
//             border: `1px solid ${c.cardBorder}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             position: "relative",
//           }}
//         >
//           <Icon size={20} color={iconColor} />
//           {isDraft && (
//             <div
//               style={{
//                 position: "absolute",
//                 top: -5,
//                 right: -5,
//                 padding: "1px 5px",
//                 borderRadius: 10,
//                 background: "rgba(234,179,8,0.2)",
//                 color: "#fbbf24",
//                 fontSize: 8,
//                 fontWeight: 700,
//                 fontFamily: FF,
//               }}
//             >
//               DRAFT
//             </div>
//           )}
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div
//             style={{
//               fontSize: 13,
//               fontWeight: 600,
//               color: c.textPrimary,
//               fontFamily: FF,
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {doc.title || doc.originalName}
//           </div>
//           <div
//             style={{
//               fontSize: 11,
//               color: c.textSub,
//               fontFamily: FF,
//               marginTop: 2,
//             }}
//           >
//             {doc.originalName} · {fmtSize(doc.size)}
//           </div>
//         </div>
//       </div>

//       {/* pills */}
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
//         {doc.category && (
//           <span
//             style={{
//               fontSize: 10,
//               fontWeight: 600,
//               padding: "2px 8px",
//               borderRadius: 20,
//               background: "rgba(6,95,212,0.1)",
//               color: "#065fd4",
//               fontFamily: FF,
//             }}
//           >
//             {doc.category}
//           </span>
//         )}
//         {doc.batchId && (
//           <span
//             style={{
//               fontSize: 10,
//               fontWeight: 600,
//               padding: "2px 8px",
//               borderRadius: 20,
//               background: isDark
//                 ? "rgba(34,211,238,0.08)"
//                 : "rgba(34,211,238,0.06)",
//               color: "#0891b2",
//               fontFamily: FF,
//             }}
//           >
//             Batch {doc.batchId}
//           </span>
//         )}
//         {doc.status && !isDraft && (
//           <span
//             style={{
//               fontSize: 10,
//               fontWeight: 600,
//               padding: "2px 8px",
//               borderRadius: 20,
//               background: "rgba(34,197,94,0.1)",
//               color: "#16a34a",
//               fontFamily: FF,
//             }}
//           >
//             published
//           </span>
//         )}
//       </div>

//       {/* description */}
//       {doc.description && (
//         <div
//           style={{
//             fontSize: 11,
//             color: c.textSub,
//             fontFamily: FF,
//             lineHeight: 1.5,
//             overflow: "hidden",
//             display: "-webkit-box",
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: "vertical",
//           }}
//         >
//           {doc.description}
//         </div>
//       )}

//       {/* action buttons */}
//       <div
//         style={{
//           display: "flex",
//           gap: 7,
//           flexWrap: "wrap",
//           paddingTop: 8,
//           borderTop: `1px solid ${c.divider}`,
//         }}
//       >
//         <button
//           onClick={() => onView(doc)}
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 4,
//             padding: "5px 11px",
//             borderRadius: 6,
//             cursor: "pointer",
//             fontSize: 11,
//             fontWeight: 500,
//             fontFamily: FF,
//             border: `1px solid ${c.inputBorder}`,
//             background: c.zeroBg,
//             color: c.textPrimary,
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
//           onMouseLeave={(e) => (e.currentTarget.style.background = c.zeroBg)}
//         >
//           <Eye size={11} /> View
//         </button>
//         <button
//           onClick={handleDownload}
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 4,
//             padding: "5px 11px",
//             borderRadius: 6,
//             cursor: "pointer",
//             fontSize: 11,
//             fontWeight: 500,
//             fontFamily: FF,
//             border: `1px solid ${c.inputBorder}`,
//             background: c.zeroBg,
//             color: c.textPrimary,
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
//           onMouseLeave={(e) => (e.currentTarget.style.background = c.zeroBg)}
//         >
//           <Download size={11} /> Download
//         </button>

//         {/* ✅ EDIT BUTTON */}
//         <button
//           onClick={() => onEdit(doc)}
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 4,
//             padding: "5px 11px",
//             borderRadius: 6,
//             cursor: "pointer",
//             fontSize: 11,
//             fontWeight: 500,
//             fontFamily: FF,
//             border: "1px solid rgba(99,102,241,0.3)",
//             background: "rgba(99,102,241,0.08)",
//             color: "#818cf8",
//           }}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.background = "rgba(99,102,241,0.18)")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.background = "rgba(99,102,241,0.08)")
//           }
//         >
//           <Pencil size={11} /> Edit
//         </button>

//         <button
//           onClick={() => onDelete(doc.id)}
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 4,
//             padding: "5px 11px",
//             borderRadius: 6,
//             cursor: "pointer",
//             fontSize: 11,
//             fontWeight: 500,
//             fontFamily: FF,
//             border: "1px solid rgba(248,113,113,0.2)",
//             background: "rgba(248,113,113,0.06)",
//             color: "#f87171",
//             marginLeft: "auto",
//           }}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.background = "rgba(248,113,113,0.14)")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.background = "rgba(248,113,113,0.06)")
//           }
//         >
//           <Trash2 size={11} /> Delete
//         </button>
//       </div>

//       {showPublishBtn && <PublishButton doc={doc} onPublished={onUpdated} />}
//       {showAssignBtn && (
//         <AssignBatchButton
//           doc={doc}
//           onAssigned={onUpdated}
//           batches={batches}
//           c={c}
//         />
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════════
//    MAIN UPLOAD DOCUMENTS COMPONENT
// ═══════════════════════════════════════════════════════════════════ */
// const UploadDocuments = () => {
//   const { isDark } = useTrainerTheme();
//   const c = getColors(isDark);

//   const [file, setFile] = useState(null);
//   const [dragging, setDragging] = useState(false);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [batchId, setBatchId] = useState("default_segment");
//   const [courseId, setCourseId] = useState("");
//   const [category, setCategory] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [draftLoading, setDraftLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [msgType, setMsgType] = useState("");
//   const [draftMsg, setDraftMsg] = useState("");

//   const [docs, setDocs] = useState([]);
//   const [docsLoading, setDocsLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [courses, setCourses] = useState([]);

//   // modals
//   const [editingDoc, setEditingDoc] = useState(null);
//   const [viewingDoc, setViewingDoc] = useState(null);

//   const fileRef = useRef();

//   useEffect(() => {
//     videoService
//       .getTrainerBatches()
//       .then((res) => setBatches(res.data || []))
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     courseService
//       .getMyCourses()
//       .then((res) => {
//         const raw = res.data || [];
//         setCourses(
//           raw.map((co) => ({
//             value: String(co.id),
//             label: co.title ?? co.name ?? `Course ${co.id}`,
//           })),
//         );
//       })
//       .catch(() => {});
//   }, []);

//   const fetchDocs = async () => {
//     setDocsLoading(true);
//     try {
//       const res = await fileService.getTrainerFiles();
//       setDocs(res.data || []);
//     } finally {
//       setDocsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchDocs();
//   }, []);

//   const batchOptions = [
//     { value: "default_segment", label: "Default Segment (No Batch)" },
//     ...batches.map((b) => ({
//       value: String(b.id),
//       label: `${b.name || "Batch"} (ID: ${b.id})`,
//     })),
//   ];
//   const CATEGORIES = ["Notes", "Assignment", "Slides", "Reference", "Other"];
//   const categoryOptions = CATEGORIES.map((cat) => ({ value: cat, label: cat }));
//   const resolvedBatch =
//     !batchId || batchId === "default_segment" ? null : batchId;

//   const handleFile = (f) => {
//     if (!f) return;
//     setFile(f);
//     if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
//   };

//   const handlePublish = async () => {
//     if (!file) {
//       setMessage("❌ Select a file first");
//       setMsgType("error");
//       return;
//     }
//     if (!title.trim()) {
//       setMessage("❌ Title is required");
//       setMsgType("error");
//       return;
//     }
//     try {
//       setLoading(true);
//       setMessage("");
//       await fileService.uploadFile(
//         file,
//         resolvedBatch,
//         title,
//         description,
//         courseId || null,
//         category || null,
//         "published",
//       );
//       setMessage("✅ Document published successfully!");
//       setMsgType("success");
//       resetForm();
//       fetchDocs();
//     } catch {
//       setMessage("❌ Upload failed. Check batch assignment.");
//       setMsgType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDraft = async () => {
//     if (!file) {
//       setDraftMsg("⚠️ Select a file first");
//       setTimeout(() => setDraftMsg(""), 3000);
//       return;
//     }
//     try {
//       setDraftLoading(true);
//       setDraftMsg("");
//       await fileService.uploadFile(
//         file,
//         resolvedBatch,
//         title || file.name,
//         description,
//         courseId || null,
//         category || null,
//         "draft",
//       );
//       setDraftMsg("✏️ Draft saved successfully");
//       fetchDocs();
//     } catch {
//       setDraftMsg("⚠️ Could not save draft. Please try again.");
//     } finally {
//       setDraftLoading(false);
//       setTimeout(() => setDraftMsg(""), 4000);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this document?")) return;
//     try {
//       await fileService.deleteFile(id);
//       setDocs((p) => p.filter((d) => d.id !== id));
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   const handleDocUpdated = (updated) => {
//     setDocs((p) => p.map((d) => (d.id === updated.id ? updated : d)));
//   };

//   const resetForm = () => {
//     setFile(null);
//     setTitle("");
//     setDescription("");
//     setBatchId("default_segment");
//     setCourseId("");
//     setCategory("");
//   };

//   return (
//     <div style={{ fontFamily: FF }}>
//       {/* modals */}
//       {viewingDoc && (
//         <FilePreviewModal
//           doc={viewingDoc}
//           onClose={() => setViewingDoc(null)}
//           isDark={isDark}
//           c={c}
//         />
//       )}
//       {editingDoc && (
//         <EditModal
//           doc={editingDoc}
//           batches={batches}
//           courses={courses}
//           c={c}
//           isDark={isDark}
//           onClose={() => setEditingDoc(null)}
//           onSaved={(updated) => {
//             handleDocUpdated(updated);
//             setEditingDoc(null);
//           }}
//         />
//       )}

//       {/* ── UPLOAD FORM ── */}
//       <div
//         style={{
//           background: c.cardBg,
//           border: `1px solid ${c.cardBorder}`,
//           borderRadius: 8,
//           padding: 24,
//           marginBottom: 20,
//         }}
//       >
//         {/* header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             marginBottom: 20,
//             paddingBottom: 16,
//             borderBottom: `1px solid ${c.divider}`,
//           }}
//         >
//           <div
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 8,
//               background: c.accentBg,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <FileText size={18} color={c.accent} />
//           </div>
//           <div>
//             <div
//               style={{
//                 fontSize: 15,
//                 fontWeight: 600,
//                 color: c.textPrimary,
//                 fontFamily: FF,
//               }}
//             >
//               Upload Document
//             </div>
//             <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>
//               PDF, Word, PPT, Excel, ZIP and more
//             </div>
//           </div>
//         </div>

//         {/* drop zone */}
//         <div
//           onDragOver={(e) => {
//             e.preventDefault();
//             setDragging(true);
//           }}
//           onDragLeave={() => setDragging(false)}
//           onDrop={(e) => {
//             e.preventDefault();
//             setDragging(false);
//             handleFile(e.dataTransfer.files[0]);
//           }}
//           onClick={() => fileRef.current.click()}
//           style={{
//             border: `2px dashed ${dragging ? c.accent : file ? "#22c55e" : c.inputBorder}`,
//             borderRadius: 6,
//             background: dragging
//               ? c.accentLight
//               : file
//                 ? "rgba(34,197,94,0.04)"
//                 : c.zeroBg,
//             cursor: "pointer",
//             padding: "22px 24px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 12,
//             marginBottom: 20,
//             transition: "all .2s",
//           }}
//         >
//           {file ? (
//             <>
//               <Check size={18} color="#22c55e" />
//               <span
//                 style={{
//                   fontSize: 13,
//                   fontWeight: 600,
//                   color: "#22c55e",
//                   fontFamily: FF,
//                 }}
//               >
//                 {file.name}
//               </span>
//               <span
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setFile(null);
//                   setTitle("");
//                 }}
//                 style={{
//                   fontSize: 11,
//                   color: c.textSub,
//                   cursor: "pointer",
//                   fontFamily: FF,
//                   marginLeft: 4,
//                 }}
//               >
//                 Remove
//               </span>
//             </>
//           ) : (
//             <>
//               <UploadCloud size={22} color={c.textMuted} />
//               <div>
//                 <div
//                   style={{
//                     fontSize: 13,
//                     fontWeight: 500,
//                     color: c.textPrimary,
//                     fontFamily: FF,
//                   }}
//                 >
//                   Drag and drop your file here
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: c.textSub,
//                     fontFamily: FF,
//                     marginTop: 2,
//                   }}
//                 >
//                   or click to browse files
//                 </div>
//               </div>
//             </>
//           )}
//           <input
//             ref={fileRef}
//             type="file"
//             hidden
//             onChange={(e) => handleFile(e.target.files[0])}
//           />
//         </div>

//         {/* fields grid */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr 1fr 1fr",
//             gap: 14,
//             marginBottom: 14,
//           }}
//         >
//           <div style={{ gridColumn: "1 / 2" }}>
//             <label style={lbl(c)}>DOCUMENT TITLE</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter document title"
//               style={inp(c)}
//               onFocus={(e) => (e.target.style.borderColor = c.accent)}
//               onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
//             />
//           </div>
//           <div>
//             <label style={lbl(c)}>SELECT BATCH</label>
//             <CustomSelect
//               value={batchId}
//               onChange={setBatchId}
//               options={batchOptions}
//               placeholder="Select Batch"
//               c={c}
//             />
//           </div>
//           <div>
//             <label style={lbl(c)}>SELECT COURSE</label>
//             <CustomSelect
//               value={courseId}
//               onChange={setCourseId}
//               options={[{ value: "", label: "None" }, ...courses]}
//               placeholder="Select Course"
//               c={c}
//             />
//           </div>
//           <div>
//             <label style={lbl(c)}>DOCUMENT CATEGORY</label>
//             <CustomSelect
//               value={category}
//               onChange={setCategory}
//               options={categoryOptions}
//               placeholder="Select Category"
//               c={c}
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: 18 }}>
//           <label style={lbl(c)}>DESCRIPTION</label>
//           <textarea
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Brief description of this document…"
//             style={{ ...inp(c), resize: "vertical" }}
//             onFocus={(e) => (e.target.style.borderColor = c.accent)}
//             onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
//           />
//         </div>

//         {batchId === "default_segment" && (
//           <div
//             style={{
//               fontSize: 11,
//               color: c.draftColor,
//               fontFamily: FF,
//               marginBottom: 12,
//             }}
//           >
//             ⚠ No batch selected — document will not be visible to students until
//             you assign a batch.
//           </div>
//         )}

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             gap: 10,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               flexWrap: "wrap",
//             }}
//           >
//             {draftMsg && (
//               <div
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "5px 13px",
//                   borderRadius: 20,
//                   background: c.draftBg,
//                   border: `1px solid ${c.draftBorder}`,
//                   color: c.draftColor,
//                   fontSize: 12,
//                   fontWeight: 600,
//                   fontFamily: FF,
//                 }}
//               >
//                 <Save size={11} /> {draftMsg}
//               </div>
//             )}
//             {message && !draftMsg && (
//               <span
//                 style={{
//                   fontSize: 12,
//                   fontFamily: FF,
//                   color: msgType === "success" ? c.successColor : c.errorColor,
//                 }}
//               >
//                 {message}
//               </span>
//             )}
//           </div>
//           <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//             <button
//               onClick={handleDraft}
//               disabled={draftLoading}
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "9px 18px",
//                 borderRadius: 6,
//                 border: `1px solid ${c.draftBorder}`,
//                 background: c.draftBg,
//                 color: c.draftColor,
//                 fontSize: 13,
//                 fontWeight: 500,
//                 cursor: draftLoading ? "not-allowed" : "pointer",
//                 fontFamily: FF,
//                 opacity: draftLoading ? 0.6 : 1,
//               }}
//             >
//               <Save size={13} />
//               {draftLoading ? "Saving…" : "Save as Draft"}
//             </button>
//             <button
//               onClick={handlePublish}
//               disabled={loading}
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "9px 20px",
//                 borderRadius: 6,
//                 border: "none",
//                 background: "#22c55e",
//                 color: "#fff",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 cursor: loading ? "not-allowed" : "pointer",
//                 fontFamily: FF,
//                 opacity: loading ? 0.6 : 1,
//               }}
//             >
//               <Send size={13} />
//               {loading ? "Publishing…" : "Publish Document"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── DOCUMENT LIST ── */}
//       {docsLoading ? (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: 14,
//           }}
//         >
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               style={{
//                 background: c.cardBg,
//                 borderRadius: 10,
//                 border: `1px solid ${c.cardBorder}`,
//                 padding: 16,
//                 animation: "shimmer 1.5s ease infinite",
//               }}
//             >
//               <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
//               <div
//                 style={{
//                   height: 40,
//                   borderRadius: 8,
//                   background: c.divider,
//                   marginBottom: 10,
//                 }}
//               />
//               <div
//                 style={{
//                   height: 12,
//                   width: "70%",
//                   borderRadius: 5,
//                   background: c.divider,
//                   marginBottom: 8,
//                 }}
//               />
//               <div
//                 style={{
//                   height: 10,
//                   width: "50%",
//                   borderRadius: 4,
//                   background: c.divider,
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//       ) : docs.length === 0 ? (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "44px 24px",
//             gap: 10,
//             background: c.cardBg,
//             borderRadius: 10,
//             border: `1.5px dashed ${c.cardBorder}`,
//           }}
//         >
//           <FileText size={28} color={c.textMuted} />
//           <p
//             style={{
//               fontSize: 13,
//               fontWeight: 600,
//               color: c.textSub,
//               margin: 0,
//               fontFamily: FF,
//             }}
//           >
//             No documents yet
//           </p>
//           <p
//             style={{
//               fontSize: 11,
//               color: c.textMuted,
//               margin: 0,
//               fontFamily: FF,
//             }}
//           >
//             Upload your first document above
//           </p>
//         </div>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: 14,
//           }}
//         >
//           {docs.map((doc) => (
//             <DocCard
//               key={doc.id}
//               doc={doc}
//               onDelete={handleDelete}
//               onUpdated={handleDocUpdated}
//               onEdit={setEditingDoc}
//               onView={setViewingDoc}
//               batches={batches}
//               isDark={isDark}
//               c={c}
//             />
//           ))}
//         </div>
//       )}
//     </div>
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
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Pin,
} from "lucide-react";
import fileService from "../services/fileService";
import videoService from "../services/videoService";
import { courseService } from "../services/courseService";
import { useTrainerTheme } from "./trainerTheme";

const FF = "'Poppins', sans-serif";

/* ─────────────────── RESPONSIVE STYLES ─────────────────── */
const RICH_EDITOR_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.ud-note-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--ud-divider, #e5e5e5);
}
.ud-note-toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: #444;
  flex-shrink: 0;
}
.ud-note-toolbar-btn:hover { background: rgba(0,0,0,0.08); }
.ud-note-toolbar-btn.active { background: rgba(6,95,212,0.12); color: #065fd4; }
.ud-note-toolbar-sep {
  width: 1px;
  height: 20px;
  background: #ddd;
  margin: 0 4px;
  flex-shrink: 0;
}
.ud-color-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.ud-color-swatch:hover { transform: scale(1.15); }
.ud-color-swatch.selected { border-color: #065fd4; transform: scale(1.1); }
.ud-color-popover {
  position: absolute;
  z-index: 99999;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 12px 14px;
  min-width: 280px;
}
.ud-note-editor-wrap {
  border-radius: 6px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.ud-note-editor-wrap:focus-within {
  box-shadow: 0 2px 12px rgba(6,95,212,0.13);
}
`;

if (!document.getElementById("ud-rich-st")) {
  const s = document.createElement("style");
  s.id = "ud-rich-st";
  s.textContent = RICH_EDITOR_STYLES;
  document.head.appendChild(s);
}

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
const pBtn = () => ({
  padding: "9px 20px",
  borderRadius: 4,
  border: "none",
  background: "#065fd4",
  color: "#fff",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: FF,
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

/* ─────────────────── NOTE TEXT COLORS ─────────────────── */
const TEXT_COLORS = [
  { label: "Default", value: "default", color: "transparent", border: "#aaa" },
  { label: "Red",     value: "#d93025", color: "#d93025" },
  { label: "Orange",  value: "#e67c00", color: "#e67c00" },
  { label: "Yellow",  value: "#e5c100", color: "#e5c100" },
  { label: "Green",   value: "#188038", color: "#188038" },
  { label: "Teal",    value: "#0097a7", color: "#0097a7" },
  { label: "Blue",    value: "#1967d2", color: "#1967d2" },
  { label: "Purple",  value: "#a142f4", color: "#a142f4" },
  { label: "Pink",    value: "#e52592", color: "#e52592" },
  { label: "Brown",   value: "#795548", color: "#795548" },
  { label: "Gray",    value: "#9e9e9e", color: "#9e9e9e" },
];

/* ─────────────────── RICH DESCRIPTION EDITOR ─────────────────── */
const RichDescriptionEditor = ({ value, onChange, placeholder = "Tell viewers about your video", c }) => {
  const [showColorPicker, setShowColorPicker] = useState(false); // "text" | false
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false, strike: false, h1: false, h2: false });
  const [selectedTextColor, setSelectedTextColor] = useState("default");

  const colorPickerRef = useRef(null);
  const textareaRef    = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const toggleFormat = (fmt) => setActiveFormats((p) => ({ ...p, [fmt]: !p[fmt] }));

  const getTextStyle = () =>
    selectedTextColor !== "default" ? { color: selectedTextColor } : { color: c.textPrimary };

  const ToolBtn = ({ onClick, active, title, children }) => (
    <button
      type="button"
      className={`ud-note-toolbar-btn${active ? " active" : ""}`}
      onClick={onClick}
      title={title}
      style={{ color: active ? c.accent : c.textSub }}
    >
      {children}
    </button>
  );

  return (
    <div
      className="ud-note-editor-wrap"
      style={{ border: `1px solid ${c.inputBorder}`, borderRadius: 6, background: c.inputBg }}
    >
      {/* ── Row 1: Heading + Text formatting + Text color ── */}
      <div className="ud-note-toolbar" style={{ borderBottomColor: c.divider }}>
        <ToolBtn active={activeFormats.h1} onClick={() => toggleFormat("h1")} title="Heading 1">
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FF }}>H1</span>
        </ToolBtn>
        <ToolBtn active={activeFormats.h2} onClick={() => toggleFormat("h2")} title="Heading 2">
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FF }}>H2</span>
        </ToolBtn>
        <ToolBtn active={activeFormats.normal} onClick={() => toggleFormat("normal")} title="Normal text">
          <span style={{ fontSize: 12, fontFamily: FF }}>Aa</span>
        </ToolBtn>

        <div className="ud-note-toolbar-sep" style={{ background: c.divider }} />

        <ToolBtn active={activeFormats.bold} onClick={() => toggleFormat("bold")} title="Bold">
          <Bold size={14} strokeWidth={activeFormats.bold ? 3 : 2} />
        </ToolBtn>
        <ToolBtn active={activeFormats.italic} onClick={() => toggleFormat("italic")} title="Italic">
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn active={activeFormats.underline} onClick={() => toggleFormat("underline")} title="Underline">
          <Underline size={14} />
        </ToolBtn>
        <ToolBtn active={activeFormats.strike} onClick={() => toggleFormat("strike")} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolBtn>

        <div className="ud-note-toolbar-sep" style={{ background: c.divider }} />

        {/* Text color button + popover */}
        <div style={{ position: "relative" }} ref={colorPickerRef}>
          <button
            type="button"
            className="ud-note-toolbar-btn"
            title="Text color"
            onClick={() => setShowColorPicker((p) => p === "text" ? false : "text")}
            style={{ color: c.textSub }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: FF, color: selectedTextColor !== "default" ? selectedTextColor : c.textPrimary, lineHeight: 1 }}>A</span>
              <div style={{ width: 16, height: 3, borderRadius: 2, background: selectedTextColor !== "default" ? selectedTextColor : c.textSub }} />
            </div>
          </button>

          {showColorPicker === "text" && (
            <div
              style={{
                position: "absolute",
                zIndex: 99999,
                background: c.cardBg,
                borderRadius: 8,
                boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                padding: "12px 14px",
                minWidth: 280,
                top: "100%",
                left: 0,
                border: `1px solid ${c.cardBorder}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: c.textSub, fontFamily: FF, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>Text Color</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {TEXT_COLORS.map((col) => (
                  <div
                    key={col.value}
                    className={`ud-color-swatch${selectedTextColor === col.value ? " selected" : ""}`}
                    title={col.label}
                    onClick={() => { setSelectedTextColor(col.value); setShowColorPicker(false); }}
                    style={{
                      background: col.color,
                      border: col.border
                        ? `2px solid ${col.border}`
                        : selectedTextColor === col.value
                          ? `2px solid ${c.accent}`
                          : "2px solid transparent",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pin */}
        <div style={{ marginLeft: "auto" }}>
          <ToolBtn title="Pin note"><Pin size={14} /></ToolBtn>
        </div>
      </div>

      {/* ── Textarea ── */}
      <textarea
        ref={textareaRef}
        rows={4}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          ...inp(c),
          resize: "vertical",
          border: "none",
          borderRadius: 0,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          fontWeight: activeFormats.bold ? 700 : 400,
          fontStyle: activeFormats.italic ? "italic" : "normal",
          textDecoration: activeFormats.underline ? "underline" : activeFormats.strike ? "line-through" : "none",
          fontSize: activeFormats.h1 ? 20 : activeFormats.h2 ? 16 : 13,
          ...getTextStyle(),
          background: c.inputBg,
        }}
        onFocus={(e) => (e.target.style.outline = "none")}
        onBlur={(e) => (e.target.style.outline = "none")}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   FILE PREVIEW MODAL
═══════════════════════════════════════════════════════════════════ */
const FilePreviewModal = ({ doc, onClose, isDark, c }) => {
  const [loading, setLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError]     = useState("");

  const name = (doc.originalName || "").toLowerCase();
  const isPdf      = name.endsWith(".pdf");
  const isImage    = /\.(png|jpg|jpeg|gif|webp)$/.test(name);
  const isTxt      = name.endsWith(".txt");
  const isOfficeNew = name.endsWith(".docx") || name.endsWith(".pptx") || name.endsWith(".xlsx");
  const isOfficeOld = name.endsWith(".doc")  || name.endsWith(".ppt")  || name.endsWith(".xls");

  useEffect(() => {
    let objectUrl = null;
    const load = async () => {
      try {
        const res = await fileService.viewFileBlob(doc.id);
        const contentType = res.headers?.["content-type"] || (isPdf ? "application/pdf" : isImage ? "image/jpeg" : "application/octet-stream");
        const blob = new Blob([res.data], { type: contentType });
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch {
        setError("Could not load file preview.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [doc.id]);

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div onClick={handleBackdrop} style={{ position: "fixed", inset: 0, zIndex: 99999, background: c.modalOverlay, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: c.modalBg, borderRadius: 14, width: "92vw", maxWidth: 900, height: "88vh", display: "flex", flexDirection: "column", border: `1px solid ${c.cardBorder}`, boxShadow: "0 24px 64px rgba(0,0,0,0.45)", overflow: "hidden", fontFamily: FF }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${c.cardBorder}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary, fontFamily: FF }}>{doc.title || doc.originalName}</div>
            <div style={{ fontSize: 11, color: c.textSub, fontFamily: FF, marginTop: 1 }}>{doc.originalName} · {fmtSize(doc.size)}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {blobUrl && (
              <a href={blobUrl} download={doc.originalName} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 13px", borderRadius: 7, border: `1px solid ${c.cardBorder}`, background: c.zeroBg, color: c.textPrimary, fontSize: 12, fontWeight: 500, fontFamily: FF, textDecoration: "none" }}>
                <Download size={12} /> Download
              </a>
            )}
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: c.textSub, display: "flex", alignItems: "center", padding: 4, borderRadius: 6 }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative", background: isDark ? "#0d1118" : "#f4f4f4" }}>
          {loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 32, height: 32, border: "3px solid " + c.cardBorder, borderTopColor: c.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>Loading preview…</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {error && !loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
              <FileText size={40} color={c.textMuted} />
              <span style={{ fontSize: 13, color: c.textSub, fontFamily: FF }}>{error}</span>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <>
              {isPdf && <iframe src={blobUrl} style={{ width: "100%", height: "100%", border: "none" }} title="PDF Preview" />}
              {isImage && (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto", padding: 16 }}>
                  <img src={blobUrl} alt={doc.originalName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 6 }} />
                </div>
              )}
              {isTxt && <iframe src={blobUrl} style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} title="Text Preview" />}
              {isOfficeNew && (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: c.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={26} color={c.accent} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary, fontFamily: FF, marginBottom: 6 }}>
                      {name.endsWith(".docx") ? "Word Document" : name.endsWith(".pptx") ? "PowerPoint Presentation" : "Excel Spreadsheet"}
                    </div>
                    <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF, lineHeight: 1.6, maxWidth: 420 }}>
                      Browser cannot render Office files directly. Use one of the options below to view this file:
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                    <a href={blobUrl} download={doc.originalName} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: FF, textDecoration: "none" }}>
                      <Download size={14} /> Download & Open Locally
                    </a>
                    <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + `/api/file/view/${doc.id}`)}&embedded=true`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c.cardBorder}`, background: c.zeroBg, color: c.textPrimary, fontSize: 13, fontWeight: 500, fontFamily: FF, textDecoration: "none" }}>
                      <Eye size={14} /> Try Google Docs Viewer
                    </a>
                  </div>
                  <div style={{ fontSize: 11, color: c.textMuted, fontFamily: FF, textAlign: "center", maxWidth: 380 }}>
                    💡 Google Docs Viewer requires the file to be publicly accessible. Download is always available.
                  </div>
                </div>
              )}
              {isOfficeOld && (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(234,179,8,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={26} color="#fbbf24" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary, fontFamily: FF, marginBottom: 6 }}>Legacy Office Format</div>
                    <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF, lineHeight: 1.6, maxWidth: 380 }}>
                      <strong>.doc / .ppt / .xls</strong> files cannot be previewed in the browser. Download and open in Microsoft Office or LibreOffice.
                    </div>
                  </div>
                  <a href={blobUrl} download={doc.originalName} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: FF, textDecoration: "none" }}>
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
  const [title,       setTitle]       = useState(doc.title || doc.originalName || "");
  const [description, setDescription] = useState(doc.description || "");
  const [category,    setCategory]    = useState(doc.category || "");
  const [batchId,     setBatchId]     = useState(doc.batchId ? String(doc.batchId) : "");
  const [courseId,    setCourseId]    = useState(doc.courseId ? String(doc.courseId) : "");
  const [status,      setStatus]      = useState(doc.status || "draft");
  const [newFile,     setNewFile]     = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const fileRef = useRef();

  const CATEGORIES = ["Notes", "Assignment", "Slides", "Reference", "Other"];

  const rowStyle   = { display: "flex", flexDirection: "column", gap: 3 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: c.textSub, fontFamily: FF, marginBottom: 3, display: "block" };
  const inputStyle = { width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 7, border: `1px solid ${c.cardBorder}`, background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc", color: c.textPrimary, fontFamily: FF, outline: "none", boxSizing: "border-box" };

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true); setError("");
    try {
      const resolvedBatch  = batchId  && batchId  !== "default_segment" ? batchId  : null;
      const resolvedCourse = courseId && courseId !== ""                ? courseId : null;
      const res = await fileService.editFile(doc.id, newFile || null, title, description, resolvedBatch, resolvedCourse, category, status);
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div onClick={handleBackdrop} style={{ position: "fixed", inset: 0, zIndex: 99999, background: c.modalOverlay, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: c.modalBg, borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 24, border: `1px solid ${c.cardBorder}`, boxShadow: "0 24px 64px rgba(0,0,0,0.4)", fontFamily: FF }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: c.textPrimary }}>Edit Document</h3>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: c.textSub }}>ID {doc.id} · {doc.originalName}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: c.textSub, display: "flex", alignItems: "center", padding: 4, borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title */}
          <div style={rowStyle}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" />
          </div>

          {/* Description */}
          <div style={rowStyle}>
            <label style={labelStyle}>Description</label>
            <RichDescriptionEditor
              value={description}
              onChange={setDescription}
              placeholder="Brief description…"
              c={c}
            />
          </div>

          {/* Replace file */}
          <div style={rowStyle}>
            <label style={labelStyle}>Replace File <span style={{ fontWeight: 400, opacity: 0.6 }}>(leave empty to keep current)</span></label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: `1px solid ${c.cardBorder}`, background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9", color: c.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FF }}
              >
                <Upload size={12} /> Choose File
              </button>
              <span style={{ fontSize: 11, color: c.textMuted }}>{newFile ? newFile.name : doc.originalName || "no file chosen"}</span>
            </div>
            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => setNewFile(e.target.files[0] || null)} />
          </div>

          {/* Batch + Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={rowStyle}>
              <label style={labelStyle}>Batch</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
                <option value="">No Batch</option>
                {batches.map((b) => <option key={b.id} value={String(b.id)}>{b.name || `Batch ${b.id}`} (ID: {b.id})</option>)}
              </select>
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">None</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Course + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={rowStyle}>
              <label style={labelStyle}>Course</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">None</option>
                {courses.map((co) => <option key={co.value} value={co.value}>{co.label}</option>)}
              </select>
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", fontSize: 11, color: "#f87171", fontFamily: FF }}>
              {error}
            </div>
          )}

          {/* actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 6 }}>
            <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 9, border: `1px solid ${c.cardBorder}`, background: "transparent", color: c.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: "8px 22px", borderRadius: 9, border: "none", background: saving ? "#1d4ed8aa" : "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: FF, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}
            >
              {saving ? "Saving…" : <><Pencil size={12} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── CUSTOM SELECT ─── */
const CustomSelect = ({ value, onChange, options, placeholder = "Select...", c }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const sel     = options.find((o) => (o.value ?? o) === value);
  const display = sel ? (sel.label ?? sel) : null;
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <div onClick={() => setOpen((p) => !p)} style={{ ...inp(c), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none", color: display ? c.textPrimary : c.textMuted }}>
        <span style={{ fontSize: 13, fontFamily: FF }}>{display ?? placeholder}</span>
        <ChevronDown size={15} color={c.textSub} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </div>
      {open && (
        <div style={{ position: "fixed", zIndex: 99999, background: c.cardBg, border: `1px solid ${c.inputBorder}`, borderRadius: 4, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.25)", maxHeight: 220, overflowY: "auto", width: ref.current ? ref.current.offsetWidth : "auto", top: ref.current ? ref.current.getBoundingClientRect().bottom + 2 : "auto", left: ref.current ? ref.current.getBoundingClientRect().left : "auto" }}>
          {options.map((opt) => {
            const val  = opt.value ?? opt;
            const lbl_ = opt.label ?? opt;
            const isSel = val === value;
            return (
              <div key={val} onClick={() => { onChange(val); setOpen(false); }} style={{ padding: "9px 13px", fontSize: 13, fontFamily: FF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: isSel ? c.accent : c.textPrimary, background: isSel ? c.accentBg : "transparent" }}
                onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
              >
                {lbl_}{isSel && <Check size={13} color={c.accent} />}
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
  const [open,     setOpen]     = useState(false);
  const [selected, setSelected] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const handleAssign = async () => {
    if (!selected) return;
    setSaving(true); setError("");
    try {
      const res = await fileService.assignFileBatch(doc.id, selected);
      onAssigned(res.data); setOpen(false); setSelected("");
    } catch { setError("Failed to assign batch"); }
    finally { setSaving(false); }
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 6, border: "1px solid rgba(251,146,60,0.4)", background: "rgba(251,146,60,0.08)", color: "#fb923c", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FF }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,146,60,0.16)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(251,146,60,0.08)")}
      >
        ⚠ No Batch — Assign
      </button>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} style={{ fontSize: 12, padding: "6px 8px", borderRadius: 6, border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.textPrimary, fontFamily: FF, outline: "none", cursor: "pointer" }}>
        <option value="">Select batch…</option>
        {batches.map((b) => <option key={b.id} value={b.id}>{b.name || `Batch ${b.id}`} (ID: {b.id})</option>)}
      </select>
      {error && <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>{error}</span>}
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={handleAssign} disabled={!selected || saving} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FF, opacity: !selected || saving ? 0.5 : 1 }}>
          {saving ? "Saving…" : "Assign"}
        </button>
        <button onClick={() => { setOpen(false); setError(""); setSelected(""); }} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${c.inputBorder}`, background: "transparent", color: c.textSub, fontSize: 11, cursor: "pointer", fontFamily: FF }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ─── PUBLISH BUTTON ─── */
const PublishButton = ({ doc, onPublished }) => {
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const handlePublish = async () => {
    setSaving(true); setError("");
    try { const res = await fileService.publishFile(doc.id); onPublished(res.data); }
    catch { setError("Failed to publish"); }
    finally { setSaving(false); }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <button onClick={handlePublish} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.4)", background: "rgba(34,197,94,0.08)", color: "#22c55e", fontSize: 11, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: FF, opacity: saving ? 0.6 : 1 }}
        onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "rgba(34,197,94,0.16)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.08)"; }}
      >
        <Send size={11} />{saving ? "Publishing…" : "Publish Now"}
      </button>
      {error && <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>{error}</span>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DOC CARD
═══════════════════════════════════════════════════════════════════ */
const DocCard = ({ doc, onDelete, onUpdated, onEdit, onView, batches, isDark, c }) => {
  const { icon: Icon, color: iconColor } = fileIcon(doc.originalName);
  const hasNoBatch     = !doc.batchId;
  const isDraft        = doc.status === "draft";
  const showPublishBtn = isDraft && !hasNoBatch;
  const showAssignBtn  = hasNoBatch;

  const handleDownload = async () => {
    try {
      const res = await fileService.downloadFileBlob(doc.storedName);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href = url; a.download = doc.originalName || "file"; a.click();
      URL.revokeObjectURL(url);
    } catch { alert("Download failed"); }
  };

  return (
    <div style={{ background: c.cardBg, border: hasNoBatch ? "1px solid rgba(251,146,60,0.3)" : isDraft ? "1px solid rgba(34,197,94,0.25)" : `1px solid ${c.cardBorder}`, borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden", transition: "box-shadow .2s" }}>
      {/* accent line */}
      <div style={{ position: "absolute", top: 0, left: 14, right: 14, height: 2, background: hasNoBatch ? "linear-gradient(90deg,#fb923c,transparent)" : isDraft ? "linear-gradient(90deg,#22c55e,transparent)" : "linear-gradient(90deg,#065fd4,transparent)", borderRadius: "0 0 99px 99px", opacity: 0.7 }} />

      {hasNoBatch && (
        <div style={{ fontSize: 10, fontWeight: 600, color: "#fb923c", fontFamily: FF, padding: "4px 9px", borderRadius: 5, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.25)" }}>
          ⚠ Not visible to students — no batch assigned
        </div>
      )}

      {/* file icon + name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: isDark ? "rgba(255,255,255,0.05)" : "#f4f6fb", border: `1px solid ${c.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <Icon size={20} color={iconColor} />
          {isDraft && <div style={{ position: "absolute", top: -5, right: -5, padding: "1px 5px", borderRadius: 10, background: "rgba(234,179,8,0.2)", color: "#fbbf24", fontSize: 8, fontWeight: 700, fontFamily: FF }}>DRAFT</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary, fontFamily: FF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title || doc.originalName}</div>
          <div style={{ fontSize: 11, color: c.textSub, fontFamily: FF, marginTop: 2 }}>{doc.originalName} · {fmtSize(doc.size)}</div>
        </div>
      </div>

      {/* pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {doc.category && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(6,95,212,0.1)", color: "#065fd4", fontFamily: FF }}>{doc.category}</span>}
        {doc.batchId  && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: isDark ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.06)", color: "#0891b2", fontFamily: FF }}>Batch {doc.batchId}</span>}
        {doc.status && !isDraft && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(34,197,94,0.1)", color: "#16a34a", fontFamily: FF }}>published</span>}
      </div>

      {doc.description && (
        <div style={{ fontSize: 11, color: c.textSub, fontFamily: FF, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {doc.description}
        </div>
      )}

      {/* action buttons */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", paddingTop: 8, borderTop: `1px solid ${c.divider}` }}>
        <button onClick={() => onView(doc)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: FF, border: `1px solid ${c.inputBorder}`, background: c.zeroBg, color: c.textPrimary }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = c.zeroBg)}
        >
          <Eye size={11} /> View
        </button>
        <button onClick={handleDownload} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: FF, border: `1px solid ${c.inputBorder}`, background: c.zeroBg, color: c.textPrimary }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = c.zeroBg)}
        >
          <Download size={11} /> Download
        </button>
        <button onClick={() => onEdit(doc)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: FF, border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)", color: "#818cf8" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
        >
          <Pencil size={11} /> Edit
        </button>
        <button onClick={() => onDelete(doc.id)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: FF, border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.06)", color: "#f87171", marginLeft: "auto" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.14)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.06)")}
        >
          <Trash2 size={11} /> Delete
        </button>
      </div>

      {showPublishBtn && <PublishButton doc={doc} onPublished={onUpdated} />}
      {showAssignBtn  && <AssignBatchButton doc={doc} onAssigned={onUpdated} batches={batches} c={c} />}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN UPLOAD DOCUMENTS COMPONENT
═══════════════════════════════════════════════════════════════════ */
const UploadDocuments = () => {
  const { isDark } = useTrainerTheme();
  const c = getColors(isDark);

  const [file,        setFile]        = useState(null);
  const [dragging,    setDragging]    = useState(false);
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [batchId,     setBatchId]     = useState("default_segment");
  const [courseId,    setCourseId]    = useState("");
  const [category,    setCategory]    = useState("");

  const [loading,      setLoading]      = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [message,      setMessage]      = useState("");
  const [msgType,      setMsgType]      = useState("");
  const [draftMsg,     setDraftMsg]     = useState("");

  const [docs,        setDocs]        = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [batches,     setBatches]     = useState([]);
  const [courses,     setCourses]     = useState([]);

  const [editingDoc, setEditingDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const fileRef = useRef();

  useEffect(() => {
    videoService.getTrainerBatches().then((res) => setBatches(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    courseService.getMyCourses().then((res) => {
      const raw = res.data || [];
      setCourses(raw.map((co) => ({ value: String(co.id), label: co.title ?? co.name ?? `Course ${co.id}` })));
    }).catch(() => {});
  }, []);

  const fetchDocs = async () => {
    setDocsLoading(true);
    try { const res = await fileService.getTrainerFiles(); setDocs(res.data || []); }
    finally { setDocsLoading(false); }
  };
  useEffect(() => { fetchDocs(); }, []);

  const batchOptions = [
    { value: "default_segment", label: "Default Segment (No Batch)" },
    ...batches.map((b) => ({ value: String(b.id), label: `${b.name || "Batch"} (ID: ${b.id})` })),
  ];
  const CATEGORIES      = ["Notes", "Assignment", "Slides", "Reference", "Other"];
  const categoryOptions = CATEGORIES.map((cat) => ({ value: cat, label: cat }));
  const resolvedBatch   = !batchId || batchId === "default_segment" ? null : batchId;

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handlePublish = async () => {
    if (!file)         { setMessage("❌ Select a file first");    setMsgType("error"); return; }
    if (!title.trim()) { setMessage("❌ Title is required");      setMsgType("error"); return; }
    try {
      setLoading(true); setMessage("");
      await fileService.uploadFile(file, resolvedBatch, title, description, courseId || null, category || null, "published");
      setMessage("✅ Document published successfully!"); setMsgType("success");
      resetForm(); fetchDocs();
    } catch { setMessage("❌ Upload failed. Check batch assignment."); setMsgType("error"); }
    finally { setLoading(false); }
  };

  const handleDraft = async () => {
    if (!file) { setDraftMsg("⚠️ Select a file first"); setTimeout(() => setDraftMsg(""), 3000); return; }
    try {
      setDraftLoading(true); setDraftMsg("");
      await fileService.uploadFile(file, resolvedBatch, title || file.name, description, courseId || null, category || null, "draft");
      setDraftMsg("✏️ Draft saved successfully"); fetchDocs();
    } catch { setDraftMsg("⚠️ Could not save draft. Please try again."); }
    finally { setDraftLoading(false); setTimeout(() => setDraftMsg(""), 4000); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    try { await fileService.deleteFile(id); setDocs((p) => p.filter((d) => d.id !== id)); }
    catch { alert("Delete failed"); }
  };

  const handleDocUpdated = (updated) => setDocs((p) => p.map((d) => (d.id === updated.id ? updated : d)));

  const resetForm = () => {
    setFile(null); setTitle(""); setDescription("");
    setBatchId("default_segment"); setCourseId(""); setCategory("");
  };

  return (
    <div style={{ fontFamily: FF }}>
      {/* modals */}
      {viewingDoc && <FilePreviewModal doc={viewingDoc} onClose={() => setViewingDoc(null)} isDark={isDark} c={c} />}
      {editingDoc && (
        <EditModal
          doc={editingDoc} batches={batches} courses={courses} c={c} isDark={isDark}
          onClose={() => setEditingDoc(null)}
          onSaved={(updated) => { handleDocUpdated(updated); setEditingDoc(null); }}
        />
      )}

      {/* ── UPLOAD FORM ── */}
      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 8, padding: 24, marginBottom: 20 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${c.divider}` }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: c.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={18} color={c.accent} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: c.textPrimary, fontFamily: FF }}>Upload Document</div>
            <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>PDF, Word, PPT, Excel, ZIP and more</div>
          </div>
        </div>

        {/* drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
          style={{ border: `2px dashed ${dragging ? c.accent : file ? "#22c55e" : c.inputBorder}`, borderRadius: 6, background: dragging ? c.accentLight : file ? "rgba(34,197,94,0.04)" : c.zeroBg, cursor: "pointer", padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20, transition: "all .2s" }}
        >
          {file ? (
            <>
              <Check size={18} color="#22c55e" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#22c55e", fontFamily: FF }}>{file.name}</span>
              <span onClick={(e) => { e.stopPropagation(); setFile(null); setTitle(""); }} style={{ fontSize: 11, color: c.textSub, cursor: "pointer", fontFamily: FF, marginLeft: 4 }}>Remove</span>
            </>
          ) : (
            <>
              <UploadCloud size={22} color={c.textMuted} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>Drag and drop your file here</div>
                <div style={{ fontSize: 11, color: c.textSub, fontFamily: FF, marginTop: 2 }}>or click to browse files</div>
              </div>
            </>
          )}
          <input ref={fileRef} type="file" hidden onChange={(e) => handleFile(e.target.files[0])} />
        </div>

        {/* fields grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ gridColumn: "1 / 2" }}>
            <label style={lbl(c)}>DOCUMENT TITLE</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter document title" style={inp(c)}
              onFocus={(e) => (e.target.style.borderColor = c.accent)}
              onBlur={(e)  => (e.target.style.borderColor = c.inputBorder)}
            />
          </div>
          <div>
            <label style={lbl(c)}>SELECT BATCH</label>
            <CustomSelect value={batchId} onChange={setBatchId} options={batchOptions} placeholder="Select Batch" c={c} />
          </div>
          <div>
            <label style={lbl(c)}>SELECT COURSE</label>
            <CustomSelect value={courseId} onChange={setCourseId} options={[{ value: "", label: "None" }, ...courses]} placeholder="Select Course" c={c} />
          </div>
          <div>
            <label style={lbl(c)}>DOCUMENT CATEGORY</label>
            <CustomSelect value={category} onChange={setCategory} options={categoryOptions} placeholder="Select Category" c={c} />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: 18 }}>
          <label style={lbl(c)}>DESCRIPTION</label>
          <RichDescriptionEditor
            value={description}
            onChange={setDescription}
            placeholder="Brief description of this document…"
            c={c}
          />
        </div>

        {batchId === "default_segment" && (
          <div style={{ fontSize: 11, color: c.draftColor, fontFamily: FF, marginBottom: 12 }}>
            ⚠ No batch selected — document will not be visible to students until you assign a batch.
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {draftMsg && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 13px", borderRadius: 20, background: c.draftBg, border: `1px solid ${c.draftBorder}`, color: c.draftColor, fontSize: 12, fontWeight: 600, fontFamily: FF }}>
                <Save size={11} /> {draftMsg}
              </div>
            )}
            {message && !draftMsg && (
              <span style={{ fontSize: 12, fontFamily: FF, color: msgType === "success" ? c.successColor : c.errorColor }}>
                {message}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={handleDraft} disabled={draftLoading} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 6, border: `1px solid ${c.draftBorder}`, background: c.draftBg, color: c.draftColor, fontSize: 13, fontWeight: 500, cursor: draftLoading ? "not-allowed" : "pointer", fontFamily: FF, opacity: draftLoading ? 0.6 : 1 }}>
              <Save size={13} />{draftLoading ? "Saving…" : "Save as Draft"}
            </button>
            <button onClick={handlePublish} disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 6, border: "none", background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: FF, opacity: loading ? 0.6 : 1 }}>
              <Send size={13} />{loading ? "Publishing…" : "Publish Document"}
            </button>
          </div>
        </div>
      </div>

      {/* ── DOCUMENT LIST ── */}
      {docsLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: c.cardBg, borderRadius: 10, border: `1px solid ${c.cardBorder}`, padding: 16, animation: "shimmer 1.5s ease infinite" }}>
              <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
              <div style={{ height: 40, borderRadius: 8, background: c.divider, marginBottom: 10 }} />
              <div style={{ height: 12, width: "70%", borderRadius: 5, background: c.divider, marginBottom: 8 }} />
              <div style={{ height: 10, width: "50%", borderRadius: 4, background: c.divider }} />
            </div>
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "44px 24px", gap: 10, background: c.cardBg, borderRadius: 10, border: `1.5px dashed ${c.cardBorder}` }}>
          <FileText size={28} color={c.textMuted} />
          <p style={{ fontSize: 13, fontWeight: 600, color: c.textSub, margin: 0, fontFamily: FF }}>No documents yet</p>
          <p style={{ fontSize: 11, color: c.textMuted, margin: 0, fontFamily: FF }}>Upload your first document above</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {docs.map((doc) => (
            <DocCard key={doc.id} doc={doc} onDelete={handleDelete} onUpdated={handleDocUpdated} onEdit={setEditingDoc} onView={setViewingDoc} batches={batches} isDark={isDark} c={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;