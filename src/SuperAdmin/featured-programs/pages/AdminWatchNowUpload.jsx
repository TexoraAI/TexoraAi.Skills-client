// import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import {
//   Upload,
//   X,
//   Image as ImageIcon,
//   CheckCircle,
//   Loader,
//   Plus,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
//   ChevronLeft,
//   ChevronRight,
//   ArrowLeft,
//   Eye,
//   FileText,
//   Play,
//   Edit2,
//   Search,
//   GripVertical,
//   Star,
//   Radio,
//   Sparkles,
//   Users,
//   TrendingUp,
//   Clock3,
//   CalendarDays,
//   Grid3x3,
//   SlidersHorizontal,
//   Bookmark,
//   Settings,
//   Save,
//   Archive,
//   Rocket,
//   FileEdit,
//   Video,
//   Layers,
//   ListVideo,
// } from "lucide-react";
// import videoService from "../../../services/videoService";
// import { useNavigate } from "react-router-dom";
// // ⚠️ Adjust this import path to match where ThemeContext actually lives
// // relative to this file (same context used by SuperAdminDashboard.jsx).
// import { useTheme } from "../../context/ThemeContext";

// /* ============================================================
//    THEME TOKENS — identical pattern to SuperAdminDashboard /
//    Featured Programs so the CMS shares one design language.
//    ============================================================ */
// const getTokens = (dark) => ({
//   pageBg: dark ? "#0f1115" : "#f1f3f9",
//   surface: dark ? "#1a1d27" : "#ffffff",
//   surfaceBorder: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
//   panelHeaderBg: dark ? "rgba(255,255,255,0.03)" : "#fafafa",
//   innerBg: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
//   innerBorder: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
//   faintBorder: dark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
//   hoverBg: dark ? "rgba(255,255,255,0.05)" : "#fafafa",
//   textPrimary: dark ? "#f1f5f9" : "#111827",
//   textSecondary: dark ? "#cbd5e1" : "#374151",
//   textMuted: dark ? "#94a3b8" : "#6b7280",
//   textFaint: dark ? "#64748b" : "#9ca3af",
//   inputBg: dark ? "rgba(255,255,255,0.05)" : "#ffffff",
//   inputBorder: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid #d1d5db",
//   dashedBorder: dark ? "rgba(255,255,255,0.18)" : "#d1d5db",
//   emptyIconBg: dark ? "rgba(124,58,237,0.18)" : "#f3f0ff",
//   dragBg: dark ? "rgba(255,255,255,0.03)" : "#fafafa",
//   dragActiveBg: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
//   fileChipBg: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
//   fileChipBorder: dark ? "1px solid rgba(167,139,250,0.35)" : "1px solid #c4b5fd",
//   thumbBg: dark ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.12))" : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
//   thumbBorder: dark ? "1px solid rgba(167,139,250,0.3)" : "1px solid #c4b5fd",
//   shadow: dark ? "0 1px 6px rgba(0,0,0,0.3)" : "0 1px 6px rgba(0,0,0,0.05)",
//   shadowLg: dark ? "0 8px 30px rgba(0,0,0,0.45)" : "0 8px 30px rgba(0,0,0,0.12)",
//   accent: "#7c3aed",
//   accentDark: "#6d28d9",
//   accentSoft: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
//   previewBg: dark ? "#0b0d12" : "#f8f7fc",
// });

// const getInputStyle = (t) => ({
//   width: "100%",
//   padding: "9px 12px",
//   borderRadius: 8,
//   border: t.inputBorder,
//   background: t.inputBg,
//   color: t.textPrimary,
//   fontSize: 13,
//   fontFamily: "Inter,sans-serif",
//   outline: "none",
//   boxSizing: "border-box",
//   transition: "border-color 0.15s",
// });

// function getStatusConfig(status, dark) {
//   const map = {
//     published: dark ? { bg: "rgba(34,197,94,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.35)", label: "Published" } : { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Published" },
//     active: dark ? { bg: "rgba(34,197,94,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.35)", label: "Active" } : { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Active" },
//     draft: dark ? { bg: "rgba(217,119,6,0.15)", color: "#fbbf24", border: "rgba(251,191,36,0.35)", label: "Draft" } : { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Draft" },
//     inactive: dark ? { bg: "rgba(239,68,68,0.15)", color: "#f87171", border: "rgba(248,113,113,0.35)", label: "Inactive" } : { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Inactive" },
//     archived: dark ? { bg: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "rgba(255,255,255,0.15)", label: "Archived" } : { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: "Archived" },
//   };
//   return map[status] || (dark ? { bg: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "rgba(255,255,255,0.15)", label: status || "—" } : { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: status || "—" });
// }

// /* Small localStorage helper — guarded, since this runs in the real app
//    (not a sandboxed preview), so persisting the editor width is safe. */
// function useLocalStorageNumber(key, fallback, min, max) {
//   const [value, setValue] = useState(() => {
//     try {
//       const raw = window.localStorage.getItem(key);
//       const n = raw ? Number(raw) : fallback;
//       return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
//     } catch {
//       return fallback;
//     }
//   });
//   const setAndPersist = useCallback(
//     (next) => {
//       const clamped = Math.min(max, Math.max(min, next));
//       setValue(clamped);
//       try {
//         window.localStorage.setItem(key, String(clamped));
//       } catch {
//         /* ignore */
//       }
//     },
//     [key, min, max],
//   );
//   return [value, setAndPersist];
// }

// /* Small boolean localStorage helper — used to remember whether the
//    Live Preview panel should be open, so it doesn't force itself onto
//    the screen (and squeeze the other two panels) every time the page
//    loads or the browser is zoomed in. */
// function useLocalStorageBool(key, fallback) {
//   const [value, setValue] = useState(() => {
//     try {
//       const raw = window.localStorage.getItem(key);
//       return raw === null ? fallback : raw === "1";
//     } catch {
//       return fallback;
//     }
//   });
//   const setAndPersist = useCallback(
//     (next) => {
//       setValue(next);
//       try {
//         window.localStorage.setItem(key, next ? "1" : "0");
//       } catch {
//         /* ignore */
//       }
//     },
//     [key],
//   );
//   return [value, setAndPersist];
// }

// /* ============================================================
//    FORM ATOMS
//    ============================================================ */
// function Toggle({ value, onChange, dark }) {
//   return (
//     <button
//       type="button"
//       onClick={onChange}
//       style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: value ? "#7c3aed" : dark ? "rgba(255,255,255,0.15)" : "#d1d5db", position: "relative", flexShrink: 0, transition: "background 0.2s" }}
//     >
//       <span style={{ position: "absolute", top: 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", left: value ? 20 : 2, transition: "left 0.2s" }} />
//     </button>
//   );
// }

// function StatusBadge({ status, dark, onChange, options }) {
//   const cfg = getStatusConfig(status, dark);
//   if (!onChange) {
//     return (
//       <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: "Inter,sans-serif", whiteSpace: "nowrap" }}>
//         {cfg.label}
//       </span>
//     );
//   }
//   const cycle = options || ["published", "draft", "inactive"];
//   return (
//     <button
//       type="button"
//       title="Click to change status"
//       onClick={() => {
//         const idx = cycle.indexOf(status);
//         onChange(cycle[(idx + 1) % cycle.length]);
//       }}
//       style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: "Inter,sans-serif", cursor: "pointer", whiteSpace: "nowrap" }}
//     >
//       {cfg.label}
//     </button>
//   );
// }

// function TextInput({ value, onChange, placeholder, t, type = "text" }) {
//   return <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={getInputStyle(t)} />;
// }

// function TextAreaInput({ value, onChange, placeholder, t, rows = 3 }) {
//   return <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...getInputStyle(t), resize: "vertical", fontFamily: "Inter,sans-serif" }} />;
// }

// function NumberInput({ value, onChange, placeholder, t, min, max }) {
//   return (
//     <input
//       type="number"
//       value={value ?? ""}
//       min={min}
//       max={max}
//       onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
//       placeholder={placeholder}
//       style={getInputStyle(t)}
//     />
//   );
// }

// function SelectInput({ value, onChange, options, t, placeholder = "Select…" }) {
//   return (
//     <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ ...getInputStyle(t), cursor: "pointer" }}>
//       <option value="">{placeholder}</option>
//       {options.map((opt) => {
//         const val = typeof opt === "string" ? opt : opt.value;
//         const label = typeof opt === "string" ? opt : opt.label;
//         return (
//           <option key={val} value={val}>
//             {label}
//           </option>
//         );
//       })}
//     </select>
//   );
// }

// function ColorInput({ value, onChange, t }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//       <input type="color" value={value || "#7c3aed"} onChange={(e) => onChange(e.target.value)} style={{ width: 40, height: 34, borderRadius: 8, border: t.inputBorder, background: "none", cursor: "pointer", padding: 2 }} />
//       <TextInput value={value} onChange={onChange} placeholder="#7c3aed" t={t} />
//     </div>
//   );
// }

// function TagsInput({ value, onChange, t, placeholder = "Type and press Enter…" }) {
//   const [draft, setDraft] = useState("");
//   const list = Array.isArray(value) ? value : [];
//   const addTag = () => {
//     const v = draft.trim();
//     if (!v) return;
//     if (!list.includes(v)) onChange([...list, v]);
//     setDraft("");
//   };
//   return (
//     <div>
//       <div style={{ display: "flex", gap: 8 }}>
//         <input
//           value={draft}
//           onChange={(e) => setDraft(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               addTag();
//             }
//           }}
//           placeholder={placeholder}
//           style={getInputStyle(t)}
//         />
//         <button type="button" onClick={addTag} style={{ padding: "0 14px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
//           Add
//         </button>
//       </div>
//       {list.length > 0 && (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
//           {list.map((tag, i) => (
//             <span key={`${tag}-${i}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "4px 8px 4px 10px", borderRadius: 999, background: t.fileChipBg, border: t.fileChipBorder, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
//               {tag}
//               <X size={11} style={{ cursor: "pointer" }} onClick={() => onChange(list.filter((_, idx) => idx !== i))} />
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function RatingInput({ value, onChange, t }) {
//   const v = Number(value) || 0;
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star key={star} size={17} onClick={() => onChange(star)} style={{ cursor: "pointer" }} color={star <= v ? "#f59e0b" : t.textFaint} fill={star <= v ? "#f59e0b" : "none"} />
//       ))}
//       <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 6, fontFamily: "Inter,sans-serif" }}>{v ? v.toFixed(1) : "—"}</span>
//     </div>
//   );
// }

// function ImageUploadField({ value, onChange, t, dark, aspect = "16 / 9" }) {
//   const inputRef = useRef(null);
//   const [dragOver, setDragOver] = useState(false);
//   const preview = typeof value === "string" ? value : value?.preview;
//   const handleFile = (file) => {
//     if (!file || !file.type?.startsWith("image/")) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => onChange({ file, preview: ev.target.result });
//     reader.readAsDataURL(file);
//   };
//   return (
//     <div>
//       <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
//       <div
//         onClick={() => inputRef.current?.click()}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() => setDragOver(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setDragOver(false);
//           handleFile(e.dataTransfer.files[0]);
//         }}
//         style={{
//           position: "relative",
//           aspectRatio: aspect,
//           borderRadius: 10,
//           cursor: "pointer",
//           border: `1.5px dashed ${dragOver ? "#7c3aed" : t.dashedBorder}`,
//           background: dragOver ? t.dragActiveBg : t.dragBg,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           overflow: "hidden",
//         }}
//       >
//         {preview ? (
//           <>
//             <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onChange(null);
//               }}
//               style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
//             >
//               <X size={12} />
//             </button>
//           </>
//         ) : (
//           <div style={{ textAlign: "center", padding: 12 }}>
//             <ImageIcon size={20} color={t.textFaint} style={{ margin: "0 auto 6px" }} />
//             <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif" }}>Click or drag an image</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function VideoUploadField({ value, onChange, t }) {
//   const inputRef = useRef(null);
//   const handleFile = (file) => {
//     if (!file) return;
//     const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
//     if (!allowed.includes(file.type)) return;
//     onChange({ file, fileName: file.name, url: "" });
//   };
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//       <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
//       <div onClick={() => inputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, cursor: "pointer", border: t.inputBorder, background: t.inputBg }}>
//         <Upload size={14} color={t.textMuted} />
//         <span style={{ fontSize: 12, color: value?.fileName ? t.textPrimary : t.textFaint, fontFamily: "Inter,sans-serif" }}>{value?.fileName || "Upload video file (MP4, WebM, MOV)"}</span>
//       </div>
//     </div>
//   );
// }

// function LinkInput({ value, onChange, t, placeholder }) {
//   return <TextInput value={value} onChange={onChange} placeholder={placeholder || "https://…"} t={t} />;
// }

// function FileUploadField({ value, onChange, t, accept = ".pdf" }) {
//   const inputRef = useRef(null);
//   return (
//     <div>
//       <input
//         ref={inputRef}
//         type="file"
//         accept={accept}
//         style={{ display: "none" }}
//         onChange={(e) => {
//           const file = e.target.files[0];
//           if (file) onChange({ file, fileName: file.name });
//         }}
//       />
//       <div onClick={() => inputRef.current?.click()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "9px 12px", borderRadius: 8, cursor: "pointer", border: t.inputBorder, background: t.inputBg }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
//           <FileText size={14} color={t.textMuted} />
//           <span style={{ fontSize: 12, color: value?.fileName ? t.textPrimary : t.textFaint, fontFamily: "Inter,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value?.fileName || "Upload attachment"}</span>
//         </div>
//         {value?.fileName && (
//           <X
//             size={13}
//             color={t.textFaint}
//             style={{ cursor: "pointer", flexShrink: 0 }}
//             onClick={(e) => {
//               e.stopPropagation();
//               onChange(null);
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function Field({ label, required, children, t, span }) {
//   return (
//     <div style={span ? { gridColumn: "1 / -1" } : undefined}>
//       <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: t.textMuted, fontFamily: "Inter,sans-serif", marginBottom: 6 }}>
//         {label} {required && <span style={{ color: "#7c3aed" }}>*</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// function FieldGrid({ children }) {
//   return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>{children}</div>;
// }

// function DynamicField({ field, value, onChange, t, dark }) {
//   switch (field.type) {
//     case "textarea":
//       return <TextAreaInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} />;
//     case "number":
//       return <NumberInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} min={field.min} max={field.max} />;
//     case "select":
//       return <SelectInput value={value} onChange={onChange} options={field.options} t={t} />;
//     case "toggle":
//       return <Toggle value={!!value} onChange={() => onChange(!value)} dark={dark} />;
//     case "tags":
//       return <TagsInput value={value} onChange={onChange} t={t} placeholder={field.placeholder} />;
//     case "rating":
//       return <RatingInput value={value} onChange={onChange} t={t} />;
//     case "color":
//       return <ColorInput value={value} onChange={onChange} t={t} />;
//     case "date":
//       return <TextInput type="date" value={value} onChange={onChange} t={t} />;
//     case "time":
//       return <TextInput type="time" value={value} onChange={onChange} t={t} />;
//     case "link":
//       return <LinkInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} />;
//     case "image":
//       return <ImageUploadField value={value} onChange={onChange} t={t} dark={dark} />;
//     case "video":
//       return <VideoUploadField value={value} onChange={onChange} t={t} />;
//     case "file":
//       return <FileUploadField value={value} onChange={onChange} t={t} accept={field.accept} />;
//     case "text":
//     default:
//       return <TextInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} />;
//   }
// }

// /* ============================================================
//    SCHEMAS
//    ============================================================ */
// const STATUS_OPTIONS = ["published", "draft", "inactive"];
// const ACTIVE_OPTIONS = ["active", "inactive"];
// const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
// const LANGUAGE_OPTIONS = ["English", "Hindi", "Urdu", "Hinglish"];
// const CATEGORY_NAME_OPTIONS = ["AI & ML", "Web Development", "Data Science", "Interview Preparation", "Resume Building", "Soft Skills", "Career Guidance"];
// const LIVE_STATUS_OPTIONS = ["live", "scheduled", "ended"];

// /* Distinct accent per category — used for chips, thumbnails and the
//    stat cards so the CMS reads as colorful/data-rich, matching the
//    Companies page design language, instead of monochrome purple. */
// const CATEGORY_COLORS = {
//   "AI & ML": "#8b5cf6",
//   "Web Development": "#3b82f6",
//   "Data Science": "#0ea5e9",
//   "Interview Preparation": "#f97316",
//   "Resume Building": "#ec4899",
//   "Soft Skills": "#10b981",
//   "Career Guidance": "#14b8a6",
// };
// const colorForCategory = (cat) => CATEGORY_COLORS[cat] || "#7c3aed";
// const tint = (hex, dark) => (dark ? `${hex}26` : `${hex}14`); // ~15%/8% alpha tint for backgrounds

// const VIDEO_LIBRARY_FIELDS = [
//   { key: "videoFile", label: "Upload Video", type: "video" },
//   { key: "externalUrl", label: "External Video URL", type: "link", placeholder: "https://youtube.com/…" },
//   { key: "thumbnail", label: "Thumbnail", type: "image" },
//   { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. React JS Crash Course" },
//   { key: "description", label: "Description", type: "textarea" },
//   { key: "category", label: "Category", type: "select", options: CATEGORY_NAME_OPTIONS },
//   { key: "skill", label: "Skill", type: "text" },
//   { key: "trainer", label: "Trainer", type: "text" },
//   { key: "difficulty", label: "Difficulty", type: "select", options: DIFFICULTY_OPTIONS },
//   { key: "duration", label: "Duration", type: "text", placeholder: "18 min" },
//   { key: "language", label: "Language", type: "select", options: LANGUAGE_OPTIONS },
//   { key: "tags", label: "Tags", type: "tags" },
//   { key: "pdfAttachment", label: "PDF Resource", type: "file", accept: ".pdf" },
//   { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
// ];

// const HERO_FIELDS = [
//   { key: "badgeText", label: "Hero Badge", type: "text", placeholder: "Watch Now" },
//   { key: "heading", label: "Hero Heading", type: "text", placeholder: "Learn from Industry Experts" },
//   { key: "description", label: "Hero Description", type: "textarea", span: true },
//   { key: "features", label: "Hero Features", type: "tags", placeholder: "Add a feature and press Enter", span: true },
//   { key: "bannerImage", label: "Hero Image", type: "image" },
//   { key: "buttonEnabled", label: "Hero Button", type: "toggle" },
//   { key: "buttonText", label: "Hero Button Text", type: "text" },
//   { key: "buttonLink", label: "Hero Button Link", type: "link", placeholder: "/watch-now" },
// ];
// const HERO_SEED = {
//   badgeText: "Watch Now",
//   heading: "Learn from Industry Experts",
//   description: "Watch live masterclasses, career guidance, mock interviews, product demos and AI learning sessions from top professionals.",
//   features: ["Featured Learning Videos", "Expert Mentors", "AI Powered Learning", "Career Roadmaps"],
//   bannerImage: null,
//   buttonEnabled: true,
//   buttonText: "Watch Now",
//   buttonLink: "/watch-now",
// };

// const LIVE_SESSION_FIELDS = [
//   { key: "liveBadgeText", label: "Live Badge", type: "text", placeholder: "Live Session" },
//   { key: "sessionTitle", label: "Session Title", type: "text" },
//   { key: "description", label: "Description", type: "textarea", span: true },
//   { key: "trainerName", label: "Trainer", type: "text" },
//   { key: "trainerImage", label: "Trainer Image", type: "image" },
//   { key: "sessionThumbnail", label: "Session Thumbnail", type: "image" },
//   { key: "joinLiveButtonEnabled", label: "Join Live Button", type: "toggle" },
//   { key: "joinLiveLink", label: "Join Live Link", type: "link" },
//   { key: "sessionDate", label: "Date", type: "date" },
//   { key: "sessionTime", label: "Time", type: "time" },
//   { key: "liveStatus", label: "Status", type: "select", options: LIVE_STATUS_OPTIONS },
// ];
// const LIVE_SESSION_SEED = {
//   liveBadgeText: "Live Session",
//   sessionTitle: "Machine Learning Masterclass",
//   description: "Build real ML models and advance your career",
//   trainerName: "Alfred Elver",
//   trainerImage: null,
//   sessionThumbnail: null,
//   joinLiveButtonEnabled: true,
//   joinLiveLink: "",
//   sessionDate: "",
//   sessionTime: "",
//   liveStatus: "live",
// };

// const CATEGORY_FIELDS = [
//   { key: "name", label: "Category Name", type: "text", required: true },
//   { key: "icon", label: "Icon", type: "text", placeholder: "e.g. sparkles, code" },
//   { key: "color", label: "Color", type: "color" },
//   { key: "status", label: "Status", type: "select", options: ACTIVE_OPTIONS },
// ];

// const TRAINER_FIELDS = [
//   { key: "photo", label: "Photo", type: "image" },
//   { key: "name", label: "Name", type: "text", required: true },
//   { key: "designation", label: "Designation", type: "text" },
//   { key: "company", label: "Company", type: "text" },
//   { key: "experience", label: "Experience", type: "text", placeholder: "5+ years" },
//   { key: "rating", label: "Rating", type: "rating" },
//   { key: "linkedinUrl", label: "LinkedIn", type: "link" },
//   { key: "twitterUrl", label: "Twitter / X", type: "link" },
//   { key: "websiteUrl", label: "Website", type: "link" },
//   { key: "status", label: "Status", type: "select", options: ACTIVE_OPTIONS },
// ];

// const WEBINAR_FIELDS = [
//   { key: "banner", label: "Banner", type: "image" },
//   { key: "title", label: "Webinar Title", type: "text", required: true },
//   { key: "speaker", label: "Speaker", type: "text" },
//   { key: "date", label: "Date", type: "date" },
//   { key: "time", label: "Time", type: "time" },
//   { key: "registrationLink", label: "Registration Link", type: "link" },
//   { key: "meetingLink", label: "Meeting Link", type: "link" },
//   { key: "reminderEnabled", label: "Reminder", type: "toggle" },
//   { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
// ];

// const SEARCH_TOGGLE_FIELDS = [
//   { key: "searchEnabled", label: "Search", type: "toggle" },
//   { key: "categoryFilterEnabled", label: "Category Filter", type: "toggle" },
//   { key: "skillFilterEnabled", label: "Skill Filter", type: "toggle" },
//   { key: "trainerFilterEnabled", label: "Trainer Filter", type: "toggle" },
//   { key: "durationFilterEnabled", label: "Duration Filter", type: "toggle" },
//   { key: "languageFilterEnabled", label: "Language Filter", type: "toggle" },
//   { key: "difficultyFilterEnabled", label: "Difficulty Filter", type: "toggle" },
// ];
// const SEARCH_SEED = { searchEnabled: true, categoryFilterEnabled: true, skillFilterEnabled: true, trainerFilterEnabled: true, durationFilterEnabled: true, languageFilterEnabled: true, difficultyFilterEnabled: true };

// const PLAYER_TOGGLE_FIELDS = [
//   { key: "resumePlayback", label: "Resume Playback", type: "toggle" },
//   { key: "speedControl", label: "Speed Control", type: "toggle" },
//   { key: "fullScreen", label: "Fullscreen", type: "toggle" },
//   { key: "downloadResources", label: "Download Resources", type: "toggle" },
//   { key: "share", label: "Share", type: "toggle" },
//   { key: "notes", label: "Notes", type: "toggle" },
//   { key: "comments", label: "Comments", type: "toggle" },
//   { key: "like", label: "Likes", type: "toggle" },
// ];
// const PLAYER_SEED = { resumePlayback: true, speedControl: true, fullScreen: true, downloadResources: false, share: true, notes: true, comments: true, like: true };

// const LANDING_SECTION_DEFS = [
//   { key: "featuredVideos", label: "Featured Videos", icon: Play },
//   { key: "continueLearning", label: "Continue Learning", icon: Clock3 },
//   { key: "recommendedVideos", label: "Recommended Videos", icon: Sparkles },
//   { key: "trendingVideos", label: "Trending Videos", icon: TrendingUp },
//   { key: "recentlyAdded", label: "Recently Added", icon: FileText },
// ];

// const WIZARD_STEPS = [
//   { n: 1, key: "video", label: "Video Library", icon: Video },
//   { n: 2, key: "hero", label: "Hero & Live", icon: Sparkles },
//   { n: 3, key: "sections", label: "Landing Sections", icon: Layers },
//   { n: 4, key: "people", label: "Categories & Trainers", icon: Users },
//   { n: 5, key: "webinars", label: "Webinars", icon: CalendarDays },
//   { n: 6, key: "settings", label: "Search & Player", icon: SlidersHorizontal },
//   { n: 7, key: "publish", label: "Publish", icon: Rocket },
// ];

// /* ============================================================
//    API ADAPTER — routes through videoService first, falls back to
//    seed/local data so the CMS stays fully usable while the backend
//    routes are being wired up (same withFallback pattern used
//    elsewhere in Super Admin). Nothing else needs to change once
//    the real endpoints exist on videoService.
//    ============================================================ */
// async function withFallback(fn, fallback) {
//   try {
//     const res = await fn();
//     const data = res?.data ?? res;
//     return data ?? fallback;
//   } catch {
//     return fallback;
//   }
// }

// const SEED_VIDEOS = [
//   { id: "vid-1", title: "React JS Crash Course", category: "Web Development", trainer: "John Doe", duration: "18 min", difficulty: "Beginner", rating: 4.8, status: "published", views: 12400 },
//   { id: "vid-2", title: "AI Career Roadmap", category: "Career Guidance", trainer: "Jane Smith", duration: "22 min", difficulty: "Intermediate", rating: 4.7, status: "published", views: 8700 },
//   { id: "vid-3", title: "Mock Interview Guide", category: "Interview Preparation", trainer: "Robert Brown", duration: "15 min", difficulty: "Intermediate", rating: 4.9, status: "draft", views: 4200 },
//   { id: "vid-4", title: "Python for Beginners", category: "Web Development", trainer: "Michael Lee", duration: "26 min", difficulty: "Beginner", rating: 4.6, status: "published", views: 15300 },
//   { id: "vid-5", title: "Excel Advanced Tips", category: "Data Science", trainer: "Sarah Wilson", duration: "12 min", difficulty: "Advanced", rating: 4.5, status: "inactive", views: 2100 },
// ];

// /* Compact view-count formatter, e.g. 12400 -> "12.4K" */
// function formatViews(n) {
//   const num = Number(n) || 0;
//   if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
//   return String(num);
// }
// const SEED_CATEGORIES = CATEGORY_NAME_OPTIONS.map((name, i) => ({ id: `cat-${i + 1}`, name, color: "#7c3aed", icon: "sparkles", status: "active" }));
// const SEED_TRAINERS = [
//   { id: "tr-1", name: "Alfred Elver", designation: "ML Engineer", company: "Aviso AI", rating: 4.9, status: "active" },
//   { id: "tr-2", name: "Riya Sharma", designation: "Sr. Product Manager", company: "Fintech Co", rating: 4.8, status: "active" },
// ];
// const SEED_WEBINARS = [{ id: "web-1", title: "Breaking Into Product Management", speaker: "Riya Sharma", status: "published" }];

// const api = {
//   listVideos: () => withFallback(() => videoService.getWatchNowVideos?.(), SEED_VIDEOS),
//   saveVideo: (payload) =>
//     withFallback(() => (payload.id ? videoService.updateWatchNowVideo?.(payload.id, payload) : videoService.createWatchNowVideo?.(payload)), { id: payload.id || `vid-${Date.now()}`, ...payload }),
//   deleteVideo: (id) => withFallback(() => videoService.deleteWatchNowVideo?.(id), { id }),

//   getConfig: (key, seed) => withFallback(() => videoService.getWatchNowSectionConfig?.(key), seed),
//   saveConfig: (key, payload) => withFallback(() => videoService.updateWatchNowSectionConfig?.(key, payload), payload),

//   listCollection: (key, seed) => withFallback(() => videoService.getWatchNowSectionItems?.(key), seed),
//   saveCollectionItem: (key, payload) =>
//     withFallback(() => (payload.id ? videoService.updateWatchNowSectionItem?.(key, payload.id, payload) : videoService.createWatchNowSectionItem?.(key, payload)), { id: payload.id || `${key}-${Date.now()}`, ...payload }),
//   deleteCollectionItem: (key, id) => withFallback(() => videoService.deleteWatchNowSectionItem?.(key, id), { id }),

//   getSectionAssignments: () => withFallback(() => videoService.getWatchNowLandingSections?.(), {}),
//   saveSectionAssignments: (payload) => withFallback(() => videoService.updateWatchNowLandingSections?.(payload), payload),

//   publish: (payload) => withFallback(() => videoService.publishWatchNowChanges?.(payload), payload),
// };

// /* ============================================================
//    TOP STATS BAR — full-width metric row rendered above the
//    3-panel body (moved out of the left Videos panel per request:
//    stats should sit at the top of the page, not in the sidebar).
//    ============================================================ */
// function TopStatsBar({ t, dark, counts, statusFilter, setStatusFilter }) {
//   const STAT_DEFS = [
//     {
//       key: "",
//       label: "Total Videos",
//       value: counts.total,
//       sub: `${counts.active} published`,
//       gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
//       icon: ListVideo,
//     },
//     {
//       key: "published",
//       label: "Active",
//       value: counts.active,
//       sub: `${counts.total ? Math.round((counts.active / counts.total) * 100) : 0}% of total`,
//       gradient: "linear-gradient(135deg, #22c55e, #15803d)",
//       icon: CheckCircle,
//     },
//     {
//       key: "draft",
//       label: "Draft",
//       value: counts.draft,
//       sub: `${counts.draft} pending review`,
//       gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
//       icon: FileEdit,
//     },
//     {
//       key: "inactive",
//       label: "Inactive",
//       value: counts.inactive,
//       sub: `${counts.inactive} disabled`,
//       gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
//       icon: X,
//     },
//   ];
//   return (
//     <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//       {STAT_DEFS.map((s) => {
//         const isActive = statusFilter === s.key && s.key !== "";
//         return (
//           <button
//             key={s.label}
//             type="button"
//             onClick={() => setStatusFilter(statusFilter === s.key ? "" : s.key)}
//             style={{
//               textAlign: "left",
//               padding: "16px 18px",
//               borderRadius: 16,
//               background: s.gradient,
//               border: "none",
//               cursor: "pointer",
//               boxShadow: isActive ? "0 0 0 3px rgba(255,255,255,0.55), 0 10px 24px rgba(0,0,0,0.18)" : "0 6px 18px rgba(0,0,0,0.12)",
//               fontFamily: "Inter,sans-serif",
//               flex: "1 1 150px",
//               minWidth: 150,
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             {/* Faint decorative icon watermark, echoes the reference cards */}
//             <s.icon size={72} color="rgba(255,255,255,0.12)" style={{ position: "absolute", right: -12, top: -12 }} />
//             <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative" }}>
//               <s.icon size={17} color="#fff" />
//             </div>
//             <p style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1, position: "relative" }}>{s.value}</p>
//             <p style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "5px 0 8px", position: "relative" }}>{s.label}</p>
//             <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.8)", margin: 0, display: "flex", alignItems: "center", gap: 5, position: "relative" }}>
//               <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.8)", display: "inline-block", flexShrink: 0 }} />
//               {s.sub}
//             </p>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// /* ============================================================
//    SEARCH + FILTER BAR — full-width row: search input, filter
//    icon, category dropdown, status dropdown, live results count.
//    ============================================================ */
// function SearchFilterBar({ t, search, setSearch, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, resultCount }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//       <div style={{ position: "relative", flex: "1 1 200px", minWidth: 200 }}>
//         <Search size={14} color={t.textFaint} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search videos by title or instructor…"
//           style={{ ...getInputStyle(t), paddingLeft: 34, height: 38 }}
//         />
//       </div>
//       <div style={{ width: 38, height: 38, borderRadius: 8, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//         <SlidersHorizontal size={14} color={t.textMuted} />
//       </div>
//       <select
//         value={categoryFilter}
//         onChange={(e) => setCategoryFilter(e.target.value)}
//         style={{ ...getInputStyle(t), height: 38, width: 160, cursor: "pointer", flexShrink: 0 }}
//       >
//         <option value="">All Categories</option>
//         {CATEGORY_NAME_OPTIONS.map((c) => (
//           <option key={c} value={c}>
//             {c}
//           </option>
//         ))}
//       </select>
//       <select
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
//         style={{ ...getInputStyle(t), height: 38, width: 140, cursor: "pointer", flexShrink: 0 }}
//       >
//         <option value="">All Status</option>
//         <option value="published">Published</option>
//         <option value="draft">Draft</option>
//         <option value="inactive">Inactive</option>
//       </select>
//       <span style={{ fontSize: 12, fontWeight: 600, color: t.textFaint, fontFamily: "Inter,sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>{resultCount} Results</span>
//     </div>
//   );
// }

// /* ============================================================
//    CATEGORY PILLS ROW — horizontally scrollable, with left/right
//    scroll-arrow buttons like a carousel.
//    ============================================================ */
// function CategoryPillsRow({ t, categoryFilter, setCategoryFilter }) {
//   const scrollRef = useRef(null);
//   const scrollBy = (dx) => scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });
//   const pills = [{ key: "", label: "All" }, ...CATEGORY_NAME_OPTIONS.map((c) => ({ key: c, label: c }))];
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//       <button
//         type="button"
//         onClick={() => scrollBy(-160)}
//         style={{ width: 26, height: 26, borderRadius: "50%", border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
//       >
//         <ChevronLeft size={13} color={t.textMuted} />
//       </button>
//       <div ref={scrollRef} style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
//         {pills.map((c) => {
//           const isActive = categoryFilter === c.key;
//           const color = c.key ? colorForCategory(c.key) : "#7c3aed";
//           return (
//             <button
//               key={c.label}
//               type="button"
//               onClick={() => setCategoryFilter(c.key)}
//               style={{
//                 flexShrink: 0,
//                 padding: "7px 14px",
//                 borderRadius: 999,
//                 fontSize: 12,
//                 fontWeight: 700,
//                 fontFamily: "Inter,sans-serif",
//                 cursor: "pointer",
//                 whiteSpace: "nowrap",
//                 border: isActive ? "none" : t.inputBorder,
//                 background: isActive ? color : t.inputBg,
//                 color: isActive ? "#fff" : t.textSecondary,
//               }}
//             >
//               {c.label}
//             </button>
//           );
//         })}
//       </div>
//       <button
//         type="button"
//         onClick={() => scrollBy(160)}
//         style={{ width: 26, height: 26, borderRadius: "50%", border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
//       >
//         <ChevronRight size={13} color={t.textMuted} />
//       </button>
//     </div>
//   );
// }

// /* ============================================================
//    PAGINATION — simple client-side pager for the video list.
//    ============================================================ */
// function Pagination({ t, page, setPage, pageSize, setPageSize, total }) {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
//   const to = Math.min(total, page * pageSize);
//   return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
//       <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "Inter,sans-serif" }}>
//         Showing {from} to {to} of {total} results
//       </span>
//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <button
//           disabled={page <= 1}
//           onClick={() => setPage(Math.max(1, page - 1))}
//           style={{ width: 28, height: 28, borderRadius: 7, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.5 : 1 }}
//         >
//           <ChevronLeft size={13} color={t.textMuted} />
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//           <button
//             key={n}
//             onClick={() => setPage(n)}
//             style={{
//               width: 28,
//               height: 28,
//               borderRadius: 7,
//               border: n === page ? "none" : t.inputBorder,
//               background: n === page ? "#7c3aed" : t.inputBg,
//               color: n === page ? "#fff" : t.textSecondary,
//               fontSize: 12,
//               fontWeight: 700,
//               cursor: "pointer",
//               fontFamily: "Inter,sans-serif",
//             }}
//           >
//             {n}
//           </button>
//         ))}
//         <button
//           disabled={page >= totalPages}
//           onClick={() => setPage(Math.min(totalPages, page + 1))}
//           style={{ width: 28, height: 28, borderRadius: 7, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.5 : 1 }}
//         >
//           <ChevronRight size={13} color={t.textMuted} />
//         </button>
//       </div>
//       <select
//         value={pageSize}
//         onChange={(e) => {
//           setPageSize(Number(e.target.value));
//           setPage(1);
//         }}
//         style={{ ...getInputStyle(t), width: 90, height: 30, fontSize: 11.5, cursor: "pointer" }}
//       >
//         {[5, 10, 20, 50].map((n) => (
//           <option key={n} value={n}>
//             {n} / page
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// /* ============================================================
//    LEFT PANEL — Video List. Full-width main content column:
//    stats bar, search + filters, category pills, a row-per-video
//    list (thumbnail, title, category/instructor, status, views,
//    menu), and pagination — mirrors the reference dashboard layout.
//    ============================================================ */
// function VideoListPanel({ t, dark, videos, loading, selectedId, onSelect, counts, search, setSearch, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter }) {
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [openMenuId, setOpenMenuId] = useState(null);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return videos.filter((v) => {
//       const matchSearch = !q || String(v.title || "").toLowerCase().includes(q) || String(v.trainer || "").toLowerCase().includes(q);
//       const matchCat = !categoryFilter || v.category === categoryFilter;
//       const matchStatus = !statusFilter || v.status === statusFilter;
//       return matchSearch && matchCat && matchStatus;
//     });
//   }, [videos, search, categoryFilter, statusFilter]);

//   useEffect(() => {
//     setPage(1);
//   }, [search, categoryFilter, statusFilter, pageSize]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageSafe = Math.min(page, totalPages);
//   const pageItems = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

//   return (
//     <div style={{ flex: "1 1 360px", minWidth: 360, display: "flex", flexDirection: "column", height: "100%", borderRight: t.surfaceBorder, background: t.pageBg }}>
//       <div style={{ padding: "18px 22px 0", flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
//         <TopStatsBar t={t} dark={dark} counts={counts} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
//         <SearchFilterBar
//           t={t}
//           search={search}
//           setSearch={setSearch}
//           categoryFilter={categoryFilter}
//           setCategoryFilter={setCategoryFilter}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//           resultCount={filtered.length}
//         />
//         <CategoryPillsRow t={t} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
//       </div>

//       <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px" }}>
//         <div style={{ background: t.surface, border: t.surfaceBorder, borderRadius: 14, overflow: "visible" }}>
//           {loading ? (
//             <div style={{ display: "flex", justifyContent: "center", padding: 50 }}>
//               <Loader size={18} color={t.textMuted} style={{ animation: "spin 1s linear infinite" }} />
//             </div>
//           ) : pageItems.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "50px 16px" }}>
//               <div style={{ width: 44, height: 44, borderRadius: 12, background: t.emptyIconBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
//                 <ListVideo size={19} color="#7c3aed" />
//               </div>
//               <p style={{ fontSize: 12.5, fontWeight: 600, color: t.textPrimary, margin: "0 0 3px", fontFamily: "Inter,sans-serif" }}>No videos found</p>
//               <p style={{ fontSize: 11.5, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif" }}>Try clearing your filters, or add a new video.</p>
//             </div>
//           ) : (
//             pageItems.map((v, idx) => {
//               const active = v.id === selectedId;
//               const preview = typeof v.thumbnail === "string" ? v.thumbnail : v.thumbnail?.preview;
//               const catColor = colorForCategory(v.category);
//               return (
//                 <div
//                   key={v.id}
//                   onClick={() => onSelect(v.id)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 14,
//                     padding: "14px 16px",
//                     cursor: "pointer",
//                     borderBottom: idx < pageItems.length - 1 ? t.surfaceBorder : "none",
//                     background: active ? t.accentSoft : "transparent",
//                     position: "relative",
//                   }}
//                 >
//                   {preview ? (
//                     <img src={preview} alt="" style={{ width: 96, height: 62, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
//                   ) : (
//                     <div style={{ width: 96, height: 62, borderRadius: 10, background: `linear-gradient(135deg, ${catColor}, #6d28d9)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
//                       <Play size={20} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" />
//                       {v.duration && (
//                         <span style={{ position: "absolute", bottom: 4, right: 5, padding: "1.5px 5px", borderRadius: 4, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9, fontFamily: "Inter,sans-serif" }}>{v.duration}</span>
//                       )}
//                     </div>
//                   )}
//                   <div style={{ minWidth: 0, flex: 1 }}>
//                     <p style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, margin: "0 0 5px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title || "Untitled"}</p>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, color: catColor, fontFamily: "Inter,sans-serif" }}>{v.category || "Uncategorized"}</span>
//                       <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: t.textMuted, fontFamily: "Inter,sans-serif" }}>
//                         <span style={{ width: 16, height: 16, borderRadius: "50%", background: t.innerBg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                           <Users size={9} color={t.textFaint} />
//                         </span>
//                         {v.trainer || "Unassigned"}
//                       </span>
//                     </div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>
//                       <Eye size={12} /> {formatViews(v.views)} views
//                     </div>
//                   </div>
//                   <StatusBadge status={v.status} dark={dark} />
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setOpenMenuId(openMenuId === v.id ? null : v.id);
//                     }}
//                     style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: t.textFaint, fontSize: 16, fontWeight: 800 }}
//                   >
//                     ⋮
//                   </button>
//                   {openMenuId === v.id && (
//                     <div
//                       onClick={(e) => e.stopPropagation()}
//                       style={{ position: "absolute", right: 16, top: 46, zIndex: 6, width: 150, background: t.surface, border: t.surfaceBorder, borderRadius: 10, boxShadow: t.shadowLg, overflow: "hidden" }}
//                     >
//                       <button
//                         onClick={() => {
//                           onSelect(v.id);
//                           setOpenMenuId(null);
//                         }}
//                         style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}
//                       >
//                         <Edit2 size={12} /> Edit
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {!loading && filtered.length > 0 && (
//           <div style={{ marginTop: 16 }}>
//             <Pagination t={t} page={pageSafe} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={filtered.length} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    RESIZE HANDLE — VS Code / Figma style vertical divider
//    ============================================================ */
// function ResizeHandle({ onDrag, t }) {
//   const draggingRef = useRef(false);
//   useEffect(() => {
//     const onMove = (e) => {
//       if (!draggingRef.current) return;
//       onDrag(e.movementX);
//     };
//     const onUp = () => {
//       draggingRef.current = false;
//       document.body.style.cursor = "";
//       document.body.style.userSelect = "";
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//     return () => {
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//     };
//   }, [onDrag]);

//   return (
//     <div
//       onMouseDown={() => {
//         draggingRef.current = true;
//         document.body.style.cursor = "col-resize";
//         document.body.style.userSelect = "none";
//       }}
//       title="Drag to resize"
//       style={{ width: 6, flexShrink: 0, cursor: "col-resize", position: "relative", background: "transparent" }}
//     >
//       <div style={{ position: "absolute", left: 2, top: 0, bottom: 0, width: 2, borderRadius: 2, background: t.faintBorder }} />
//     </div>
//   );
// }

// /* ============================================================
//    INLINE LIST EDITOR — generic add/edit/delete/reorder list used
//    for Categories, Trainers and Webinars. Editing happens inline
//    (accordion under the row) — never a popup.
//    ============================================================ */
// function InlineListEditor({ t, dark, title, icon: Icon, fields, items, onChange }) {
//   const [editingId, setEditingId] = useState(null);
//   const dragIndexRef = useRef(null);

//   const titleKey = fields.find((f) => ["title", "name"].includes(f.key))?.key || fields[0]?.key;

//   const addNew = () => {
//     const id = `new-${Date.now()}`;
//     onChange([...items, { id, status: "active" }]);
//     setEditingId(id);
//   };

//   const updateItem = (id, key, val) => {
//     onChange(items.map((it) => (it.id === id ? { ...it, [key]: val } : it)));
//   };

//   const removeItem = (id) => {
//     onChange(items.filter((it) => it.id !== id));
//     if (editingId === id) setEditingId(null);
//   };

//   const handleDrop = (targetIdx) => {
//     const from = dragIndexRef.current;
//     dragIndexRef.current = null;
//     if (from == null || from === targetIdx) return;
//     const next = [...items];
//     const [moved] = next.splice(from, 1);
//     next.splice(targetIdx, 0, moved);
//     onChange(next);
//   };

//   return (
//     <div style={{ border: t.surfaceBorder, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: t.panelHeaderBg, borderBottom: t.surfaceBorder }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <Icon size={14} color="#7c3aed" />
//           <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>{title}</span>
//           <span style={{ fontSize: 10.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>({items.length})</span>
//         </div>
//         <button type="button" onClick={addNew} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7, border: "none", background: t.accent, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
//           <Plus size={12} /> Add
//         </button>
//       </div>

//       {items.length === 0 ? (
//         <p style={{ padding: 16, fontSize: 12, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif", textAlign: "center" }}>Nothing here yet — click Add to create one.</p>
//       ) : (
//         <div>
//           {items.map((item, idx) => (
//             <div key={item.id} draggable onDragStart={() => (dragIndexRef.current = idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(idx)} style={{ borderBottom: idx < items.length - 1 ? t.surfaceBorder : "none" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", cursor: "grab" }}>
//                 <GripVertical size={13} color={t.textFaint} />
//                 <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>{item[titleKey] || "Untitled"}</span>
//                 {item.status && <StatusBadge status={item.status} dark={dark} onChange={(s) => updateItem(item.id, "status", s)} options={ACTIVE_OPTIONS.includes(item.status) ? ACTIVE_OPTIONS : STATUS_OPTIONS} />}
//                 <button onClick={() => setEditingId(editingId === item.id ? null : item.id)} style={{ width: 26, height: 26, borderRadius: 6, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                   <Edit2 size={12} color={t.textMuted} />
//                 </button>
//                 <button onClick={() => removeItem(item.id)} style={{ width: 26, height: 26, borderRadius: 6, border: dark ? "1px solid rgba(248,113,113,0.3)" : "1px solid #fecaca", background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                   <Trash2 size={12} color={dark ? "#f87171" : "#dc2626"} />
//                 </button>
//               </div>
//               {editingId === item.id && (
//                 <div style={{ padding: "4px 14px 16px", background: t.innerBg }}>
//                   <FieldGrid>
//                     {fields.map((f) => (
//                       <Field key={f.key} label={f.label} required={f.required} t={t} span={f.key === "description"}>
//                         <DynamicField field={f} value={item[f.key]} onChange={(v) => updateItem(item.id, f.key, v)} t={t} dark={dark} />
//                       </Field>
//                     ))}
//                   </FieldGrid>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    STEP CONTENTS
//    ============================================================ */
// function StepVideoLibrary({ t, dark, video, setVideo }) {
//   if (!video) {
//     return (
//       <div style={{ textAlign: "center", padding: "50px 20px" }}>
//         <Video size={22} color={t.textFaint} style={{ margin: "0 auto 10px" }} />
//         <p style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>No video selected</p>
//         <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif" }}>Pick a video from the list, or continue to the next steps to edit site-wide sections.</p>
//       </div>
//     );
//   }
//   return (
//     <FieldGrid>
//       {VIDEO_LIBRARY_FIELDS.map((f) => (
//         <Field key={f.key} label={f.label} required={f.required} t={t} span={f.key === "description"}>
//           <DynamicField field={f} value={video[f.key]} onChange={(v) => setVideo((prev) => ({ ...prev, [f.key]: v }))} t={t} dark={dark} />
//         </Field>
//       ))}
//     </FieldGrid>
//   );
// }

// function StepHeroLive({ t, dark, hero, setHero, live, setLive }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
//       <div>
//         <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
//           <Sparkles size={14} color="#7c3aed" /> Hero Section
//         </h3>
//         <FieldGrid>
//           {HERO_FIELDS.map((f) => (
//             <Field key={f.key} label={f.label} required={f.required} t={t} span={f.span}>
//               <DynamicField field={f} value={hero[f.key]} onChange={(v) => setHero((prev) => ({ ...prev, [f.key]: v }))} t={t} dark={dark} />
//             </Field>
//           ))}
//         </FieldGrid>
//       </div>
//       <div style={{ height: 1, background: t.faintBorder }} />
//       <div>
//         <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
//           <Radio size={14} color="#7c3aed" /> Live Session Highlight
//         </h3>
//         <FieldGrid>
//           {LIVE_SESSION_FIELDS.map((f) => (
//             <Field key={f.key} label={f.label} required={f.required} t={t} span={f.span}>
//               <DynamicField field={f} value={live[f.key]} onChange={(v) => setLive((prev) => ({ ...prev, [f.key]: v }))} t={t} dark={dark} />
//             </Field>
//           ))}
//         </FieldGrid>
//       </div>
//     </div>
//   );
// }

// function StepLandingSections({ t, dark, videos, assignments, setAssignments }) {
//   const [addingTo, setAddingTo] = useState(null);
//   const dragRef = useRef(null);

//   const setForSection = (key, updater) => {
//     setAssignments((prev) => ({ ...prev, [key]: updater(prev[key] || []) }));
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//       {LANDING_SECTION_DEFS.map((section) => {
//         const list = assignments[section.key] || [];
//         const availableToAdd = videos.filter((v) => !list.some((e) => e.videoId === v.id));
//         return (
//           <div key={section.key} style={{ border: t.surfaceBorder, borderRadius: 12, overflow: "hidden" }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: t.panelHeaderBg, borderBottom: t.surfaceBorder }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <section.icon size={14} color="#7c3aed" />
//                 <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>{section.label}</span>
//                 <span style={{ fontSize: 10.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>({list.length})</span>
//               </div>
//               <div style={{ position: "relative" }}>
//                 <button
//                   type="button"
//                   onClick={() => setAddingTo(addingTo === section.key ? null : section.key)}
//                   style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7, border: "none", background: t.accent, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
//                 >
//                   <Plus size={12} /> Add Video
//                 </button>
//                 {addingTo === section.key && (
//                   <div style={{ position: "absolute", right: 0, top: 32, zIndex: 5, width: 220, maxHeight: 220, overflowY: "auto", background: t.surface, border: t.surfaceBorder, borderRadius: 10, boxShadow: t.shadowLg }}>
//                     {availableToAdd.length === 0 ? (
//                       <p style={{ fontSize: 11.5, color: t.textFaint, padding: 12, margin: 0, fontFamily: "Inter,sans-serif" }}>All videos already added.</p>
//                     ) : (
//                       availableToAdd.map((v) => (
//                         <button
//                           key={v.id}
//                           onClick={() => {
//                             setForSection(section.key, (l) => [...l, { videoId: v.id, enabled: true }]);
//                             setAddingTo(null);
//                           }}
//                           style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: 11.5, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}
//                         >
//                           {v.title}
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//             {list.length === 0 ? (
//               <p style={{ padding: 14, fontSize: 11.5, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif" }}>No videos assigned to this section yet.</p>
//             ) : (
//               list.map((entry, idx) => {
//                 const v = videos.find((vv) => vv.id === entry.videoId);
//                 return (
//                   <div
//                     key={entry.videoId}
//                     draggable
//                     onDragStart={() => (dragRef.current = idx)}
//                     onDragOver={(e) => e.preventDefault()}
//                     onDrop={() => {
//                       const from = dragRef.current;
//                       if (from == null || from === idx) return;
//                       setForSection(section.key, (l) => {
//                         const next = [...l];
//                         const [moved] = next.splice(from, 1);
//                         next.splice(idx, 0, moved);
//                         return next;
//                       });
//                     }}
//                     style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderTop: t.faintBorder ? `1px solid ${t.faintBorder}` : t.surfaceBorder, cursor: "grab" }}
//                   >
//                     <GripVertical size={13} color={t.textFaint} />
//                     <span style={{ flex: 1, fontSize: 12, color: t.textSecondary, fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v?.title || "(removed video)"}</span>
//                     <Toggle value={!!entry.enabled} onChange={() => setForSection(section.key, (l) => l.map((e) => (e.videoId === entry.videoId ? { ...e, enabled: !e.enabled } : e)))} dark={dark} />
//                     <button
//                       onClick={() => setForSection(section.key, (l) => l.filter((e) => e.videoId !== entry.videoId))}
//                       style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
//                     >
//                       <X size={13} color={t.textFaint} />
//                     </button>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function StepCategoriesTrainers({ t, dark, categories, setCategories, trainers, setTrainers }) {
//   return (
//     <div>
//       <InlineListEditor t={t} dark={dark} title="Categories" icon={Grid3x3} fields={CATEGORY_FIELDS} items={categories} onChange={setCategories} />
//       <InlineListEditor t={t} dark={dark} title="Trainers" icon={Users} fields={TRAINER_FIELDS} items={trainers} onChange={setTrainers} />
//     </div>
//   );
// }

// function StepWebinars({ t, dark, webinars, setWebinars }) {
//   return <InlineListEditor t={t} dark={dark} title="Upcoming Webinars" icon={CalendarDays} fields={WEBINAR_FIELDS} items={webinars} onChange={setWebinars} />;
// }

// function StepSettings({ t, dark, search, setSearch, player, setPlayer }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
//       <div>
//         <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
//           <SlidersHorizontal size={14} color="#7c3aed" /> Search & Filters
//         </h3>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {SEARCH_TOGGLE_FIELDS.map((f) => (
//             <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, border: t.innerBorder, background: t.innerBg }}>
//               <span style={{ fontSize: 12.5, color: t.textSecondary, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>{f.label}</span>
//               <Toggle value={!!search[f.key]} onChange={() => setSearch((p) => ({ ...p, [f.key]: !p[f.key] }))} dark={dark} />
//             </div>
//           ))}
//         </div>
//       </div>
//       <div style={{ height: 1, background: t.faintBorder }} />
//       <div>
//         <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
//           <Settings size={14} color="#7c3aed" /> Video Player
//         </h3>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {PLAYER_TOGGLE_FIELDS.map((f) => (
//             <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, border: t.innerBorder, background: t.innerBg }}>
//               <span style={{ fontSize: 12.5, color: t.textSecondary, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>{f.label}</span>
//               <Toggle value={!!player[f.key]} onChange={() => setPlayer((p) => ({ ...p, [f.key]: !p[f.key] }))} dark={dark} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StepPublish({ t, dark, video, onSaveDraft, onSaveChanges, onPublish, onArchive, saving, lastAction }) {
//   const actionBtn = (label, icon, onClick, bg, color) => (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={saving}
//       style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 16px", borderRadius: 9, border: "none", background: bg, color, fontSize: 12.5, fontWeight: 700, cursor: saving ? "default" : "pointer", fontFamily: "Inter,sans-serif", opacity: saving ? 0.7 : 1 }}
//     >
//       {icon}
//       {label}
//     </button>
//   );
//   return (
//     <div>
//       <div style={{ border: t.innerBorder, background: t.innerBg, borderRadius: 12, padding: 16, marginBottom: 18 }}>
//         <p style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>Ready to publish?</p>
//         <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif", lineHeight: 1.5 }}>
//           Save your progress as a draft any time, or push all changes across Video Library, Hero &amp; Live Session, Landing Sections, Categories, Trainers, Webinars and Settings live to the WatchNow page.
//         </p>
//         {video && (
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
//             <span style={{ fontSize: 11.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>Current video status:</span>
//             <StatusBadge status={video.status} dark={dark} />
//           </div>
//         )}
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
//         {actionBtn(saving === "draft" ? "Saving…" : "Save Draft", <FileEdit size={14} />, onSaveDraft, t.inputBg, t.textSecondary)}
//         {actionBtn(saving === "changes" ? "Saving…" : "Save Changes", <Save size={14} />, onSaveChanges, t.accentSoft, t.accent)}
//         {actionBtn(saving === "publish" ? "Publishing…" : "Publish", <Rocket size={14} />, onPublish, "linear-gradient(135deg,#7c3aed,#6d28d9)", "#fff")}
//         {actionBtn(saving === "archive" ? "Archiving…" : "Archive", <Archive size={14} />, onArchive, dark ? "rgba(239,68,68,0.12)" : "#fef2f2", dark ? "#f87171" : "#dc2626")}
//       </div>

//       {lastAction && (
//         <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 12, color: "#16a34a", fontFamily: "Inter,sans-serif" }}>
//           <CheckCircle size={14} /> {lastAction}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    CENTER PANEL — resizable, 7-step wizard (mirrors the numbered
//    tab bar used on Featured Programs' Add Program editor)
//    ============================================================ */
// function EditorPanel({ t, dark, width, onClose, activeStep, setActiveStep, ...stepProps }) {
//   return (
//     <div style={{ width, flexShrink: 0, display: "flex", flexDirection: "column", height: "100%", background: t.surface, borderRight: t.surfaceBorder, animation: "slideIn 0.18s ease-out" }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: t.surfaceBorder, background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
//         <div>
//           <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: 0, fontFamily: "Inter,sans-serif" }}>WatchNow Editor</p>
//           <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "2px 0 0", fontFamily: "Inter,sans-serif" }}>{WIZARD_STEPS[activeStep - 1].label}</p>
//         </div>
//         <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//           <X size={14} color="#fff" />
//         </button>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", overflowX: "auto", borderBottom: t.surfaceBorder, padding: "14px 18px" }}>
//         {WIZARD_STEPS.map((step, idx) => {
//           const active = step.n === activeStep;
//           const done = step.n < activeStep;
//           return (
//             <React.Fragment key={step.key}>
//               <button
//                 onClick={() => setActiveStep(step.n)}
//                 style={{ display: "flex", alignItems: "center", gap: 7, padding: 0, border: "none", background: "transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
//               >
//                 <span
//                   style={{
//                     width: 22,
//                     height: 22,
//                     borderRadius: "50%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 11,
//                     fontWeight: 700,
//                     color: active || done ? "#fff" : t.textFaint,
//                     background: active || done ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : t.innerBg,
//                     border: active || done ? "none" : t.inputBorder,
//                     fontFamily: "Inter,sans-serif",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {done ? <CheckCircle size={12} /> : step.n}
//                 </span>
//                 <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? t.accent : t.textSecondary, fontFamily: "Inter,sans-serif" }}>{step.label}</span>
//               </button>
//               {idx < WIZARD_STEPS.length - 1 && <div style={{ width: 22, height: 1, background: done ? t.accent : t.faintBorder, margin: "0 8px", flexShrink: 0 }} />}
//             </React.Fragment>
//           );
//         })}
//       </div>

//       <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
//         {activeStep === 1 && <StepVideoLibrary t={t} dark={dark} video={stepProps.video} setVideo={stepProps.setVideo} />}
//         {activeStep === 2 && <StepHeroLive t={t} dark={dark} hero={stepProps.hero} setHero={stepProps.setHero} live={stepProps.live} setLive={stepProps.setLive} />}
//         {activeStep === 3 && <StepLandingSections t={t} dark={dark} videos={stepProps.videos} assignments={stepProps.assignments} setAssignments={stepProps.setAssignments} />}
//         {activeStep === 4 && <StepCategoriesTrainers t={t} dark={dark} categories={stepProps.categories} setCategories={stepProps.setCategories} trainers={stepProps.trainers} setTrainers={stepProps.setTrainers} />}
//         {activeStep === 5 && <StepWebinars t={t} dark={dark} webinars={stepProps.webinars} setWebinars={stepProps.setWebinars} />}
//         {activeStep === 6 && <StepSettings t={t} dark={dark} search={stepProps.search} setSearch={stepProps.setSearch} player={stepProps.player} setPlayer={stepProps.setPlayer} />}
//         {activeStep === 7 && (
//           <StepPublish
//             t={t}
//             dark={dark}
//             video={stepProps.video}
//             saving={stepProps.saving}
//             lastAction={stepProps.lastAction}
//             onSaveDraft={stepProps.onSaveDraft}
//             onSaveChanges={stepProps.onSaveChanges}
//             onPublish={stepProps.onPublish}
//             onArchive={stepProps.onArchive}
//           />
//         )}
//       </div>

//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: t.surfaceBorder }}>
//         <button
//           disabled={activeStep === 1}
//           onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
//           style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 8, border: t.inputBorder, background: t.inputBg, color: t.textSecondary, fontSize: 12, fontWeight: 600, cursor: activeStep === 1 ? "default" : "pointer", opacity: activeStep === 1 ? 0.5 : 1, fontFamily: "Inter,sans-serif" }}
//         >
//           <ChevronLeft size={13} /> Back
//         </button>
//         {activeStep < 7 ? (
//           <button
//             onClick={() => setActiveStep((s) => Math.min(7, s + 1))}
//             style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
//           >
//             Next <ChevronRight size={13} />
//           </button>
//         ) : (
//           <button
//             onClick={stepProps.onSaveChanges}
//             style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
//           >
//             <Save size={13} /> Save Changes
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    RIGHT PANEL — Live Preview, mirrors landing-page markup.
//    This panel is now shown/hidden on demand (see `showPreview`
//    in the main component) instead of always occupying a third
//    column — that was the main cause of the layout looking
//    squeezed / broken at 100% zoom.
//    ============================================================ */
// function LivePreviewPanel({ t, dark, hero, live, video, videos, categories, onClose }) {
//   const heroImg = typeof hero.bannerImage === "string" ? hero.bannerImage : hero.bannerImage?.preview;
//   const liveThumb = typeof live.sessionThumbnail === "string" ? live.sessionThumbnail : live.sessionThumbnail?.preview;
//   const videoThumb = video ? (typeof video.thumbnail === "string" ? video.thumbnail : video.thumbnail?.preview) : null;

//   return (
//     <div style={{ flex: "0 0 320px", width: 320, minWidth: 320, display: "flex", flexDirection: "column", height: "100%", background: t.previewBg, borderLeft: t.surfaceBorder }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 18px", borderBottom: t.surfaceBorder, background: t.surface }}>
//         <Eye size={14} color={t.textMuted} />
//         <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>Live Preview</span>
//         <span style={{ fontSize: 10.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>— updates as you type</span>
//         {onClose && (
//           <button
//             onClick={onClose}
//             title="Hide preview"
//             style={{ marginLeft: "auto", width: 24, height: 24, borderRadius: 6, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
//           >
//             <X size={12} color={t.textMuted} />
//           </button>
//         )}
//       </div>

//       <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
//         {/* Hero — fixed pixel height (not aspect-ratio) so it can never
//             collapse or render blank regardless of parent flex sizing. */}
//         <div style={{ borderRadius: 16, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadowLg }}>
//           <div
//             style={{
//               position: "relative",
//               minHeight: 170,
//               background: heroImg ? `url(${heroImg}) center/cover` : "linear-gradient(135deg,#7c3aed 0%,#a855f7 55%,#ec4899 100%)",
//               display: "flex",
//               alignItems: "flex-end",
//               padding: 18,
//             }}
//           >
//             <div style={{ position: "absolute", inset: 0, background: heroImg ? "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.05))" : "transparent" }} />
//             <div style={{ position: "relative", zIndex: 1 }}>
//               <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Inter,sans-serif", marginBottom: 8 }}>
//                 {hero.badgeText || "Badge"}
//               </span>
//               <h1 style={{ fontSize: 19, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "Inter,sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>{hero.heading || "Hero heading"}</h1>
//             </div>
//           </div>
//           <div style={{ padding: 14 }}>
//             <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 10px", fontFamily: "Inter,sans-serif", lineHeight: 1.5 }}>{hero.description || "Hero description will appear here."}</p>
//             {Array.isArray(hero.features) && hero.features.length > 0 && (
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
//                 {hero.features.map((f, i) => (
//                   <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: t.fileChipBg, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
//                     {f}
//                   </span>
//                 ))}
//               </div>
//             )}
//             {hero.buttonEnabled && (
//               <span style={{ display: "inline-block", padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "Inter,sans-serif", boxShadow: "0 4px 12px rgba(124,58,237,0.35)" }}>
//                 {hero.buttonText || "Watch Now"}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Live Session */}
//         <div style={{ borderRadius: 16, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadow, display: "flex" }}>
//           <div style={{ width: 118, minHeight: 96, flexShrink: 0, position: "relative", background: liveThumb ? `url(${liveThumb}) center/cover` : "linear-gradient(135deg,#0ea5e9,#7c3aed)" }}>
//             {live.liveStatus === "live" && (
//               <span style={{ position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 999, background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>
//                 <Radio size={9} /> LIVE
//               </span>
//             )}
//           </div>
//           <div style={{ padding: 12, flex: 1, minWidth: 0 }}>
//             <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: t.accent, margin: "0 0 3px", fontFamily: "Inter,sans-serif" }}>{live.liveBadgeText || "Live Session"}</p>
//             <p style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary, margin: "0 0 3px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{live.sessionTitle || "Session title"}</p>
//             <p style={{ fontSize: 11, color: t.textMuted, margin: "0 0 6px", fontFamily: "Inter,sans-serif" }}>{live.trainerName || "Trainer name"}</p>
//             {live.joinLiveButtonEnabled && (
//               <span style={{ display: "inline-block", padding: "5px 10px", borderRadius: 7, background: t.accentSoft, color: t.accent, fontSize: 10.5, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>Join Live</span>
//             )}
//           </div>
//         </div>

//         {/* Current video card */}
//         <div>
//           <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: t.textFaint, margin: "0 0 8px", fontFamily: "Inter,sans-serif" }}>Video Card Preview</p>
//           {video ? (
//             <div style={{ borderRadius: 14, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadow, maxWidth: 260 }}>
//               <div style={{ minHeight: 140, position: "relative", background: videoThumb ? `url(${videoThumb}) center/cover` : `linear-gradient(135deg, ${colorForCategory(video.category)}, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <Play size={14} color="#7c3aed" fill="#7c3aed" />
//                 </div>
//                 {video.duration && (
//                   <span style={{ position: "absolute", bottom: 6, right: 6, padding: "2px 6px", borderRadius: 5, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9.5, fontFamily: "Inter,sans-serif" }}>{video.duration}</span>
//                 )}
//               </div>
//               <div style={{ padding: 12 }}>
//                 {video.category && (
//                   <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 999, background: `${colorForCategory(video.category)}18`, color: colorForCategory(video.category), fontSize: 9.5, fontWeight: 700, fontFamily: "Inter,sans-serif", marginBottom: 6 }}>
//                     {video.category}
//                   </span>
//                 )}
//                 <p style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>{video.title || "Video title"}</p>
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                   <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "Inter,sans-serif" }}>{video.trainer || "Trainer"}</span>
//                   {video.rating ? (
//                     <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
//                       <Star size={11} color="#f59e0b" fill="#f59e0b" /> {Number(video.rating).toFixed(1)}
//                     </span>
//                   ) : null}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div style={{ padding: 24, textAlign: "center", border: `1.5px dashed ${t.dashedBorder}`, borderRadius: 14, maxWidth: 260, background: t.innerBg }}>
//               <ImageIcon size={18} color={t.textFaint} style={{ margin: "0 auto 8px" }} />
//               <p style={{ fontSize: 11.5, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif" }}>Select a video to preview its card</p>
//             </div>
//           )}
//         </div>

//         {/* Featured Videos row */}
//         {Array.isArray(videos) && videos.length > 0 && (
//           <div>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
//               <p style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>Featured Videos</p>
//               <span style={{ fontSize: 11, fontWeight: 700, color: t.accent, fontFamily: "Inter,sans-serif" }}>View All</span>
//             </div>
//             <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
//               {videos.slice(0, 3).map((fv) => {
//                 const fvThumb = typeof fv.thumbnail === "string" ? fv.thumbnail : fv.thumbnail?.preview;
//                 const fvColor = colorForCategory(fv.category);
//                 return (
//                   <div key={fv.id} style={{ width: 140, flexShrink: 0, borderRadius: 12, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadow }}>
//                     <div style={{ height: 80, position: "relative", background: fvThumb ? `url(${fvThumb}) center/cover` : `linear-gradient(135deg, ${fvColor}, #6d28d9)` }}>
//                       {fv.duration && (
//                         <span style={{ position: "absolute", bottom: 5, right: 5, padding: "1px 5px", borderRadius: 4, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 8.5, fontFamily: "Inter,sans-serif" }}>{fv.duration}</span>
//                       )}
//                     </div>
//                     <div style={{ padding: 9 }}>
//                       <p style={{ fontSize: 11, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fv.title}</p>
//                       <p style={{ fontSize: 10, color: t.textMuted, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>{fv.trainer || "—"}</p>
//                       {fv.rating ? (
//                         <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
//                           <Star size={9} color="#f59e0b" fill="#f59e0b" /> {Number(fv.rating).toFixed(1)}
//                         </span>
//                       ) : null}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Categories grid */}
//         {Array.isArray(categories) && categories.length > 0 && (
//           <div>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
//               <p style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>Categories</p>
//               <span style={{ fontSize: 11, fontWeight: 700, color: t.accent, fontFamily: "Inter,sans-serif" }}>View All</span>
//             </div>
//             <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//               {categories.slice(0, 5).map((cat) => {
//                 const cColor = colorForCategory(cat.name);
//                 return (
//                   <div key={cat.id} style={{ width: 96, padding: "10px 8px", borderRadius: 10, border: t.surfaceBorder, background: t.surface, textAlign: "center" }}>
//                     <div style={{ width: 30, height: 30, borderRadius: 8, background: tint(cColor, dark), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
//                       <Sparkles size={14} color={cColor} />
//                     </div>
//                     <p style={{ fontSize: 10.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 2px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cat.name}</p>
//                     <p style={{ fontSize: 9.5, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif" }}>0 videos</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    MAIN — Super Admin ▸ WatchNow Management (up-to-3-panel CMS)
//    ============================================================ */
// export default function AdminWatchNowManagement() {
//   const navigate = useNavigate();
//   const { dark } = useTheme();
//   const t = getTokens(dark);

//   // Left panel — video list
//   const [videos, setVideos] = useState([]);
//   const [videosLoading, setVideosLoading] = useState(true);
//   const [search, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedId, setSelectedId] = useState(null);

//   // Center panel — editor
//   const [showEditor, setShowEditor] = useState(false);
//   const [activeStep, setActiveStep] = useState(1);
//   const [panelWidth, setPanelWidth] = useLocalStorageNumber("watchnow-cms-editor-width", 460, 350, 900);
//   const [currentVideo, setCurrentVideo] = useState(null);

//   // Right panel — Live Preview. Off by default: it's optional, opened
//   // only when the user wants it, so at normal zoom levels the list +
//   // editor always have enough room and nothing gets visually squeezed.
//   const [showPreview, setShowPreview] = useLocalStorageBool("watchnow-cms-show-preview", false);

//   // Global config state (steps 2–6)
//   const [heroValues, setHeroValues] = useState(HERO_SEED);
//   const [liveValues, setLiveValues] = useState(LIVE_SESSION_SEED);
//   const [assignments, setAssignments] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [trainers, setTrainers] = useState([]);
//   const [webinars, setWebinars] = useState([]);
//   const [searchSettings, setSearchSettings] = useState(SEARCH_SEED);
//   const [playerSettings, setPlayerSettings] = useState(PLAYER_SEED);

//   const [saving, setSaving] = useState(false);
//   const [lastAction, setLastAction] = useState("");

//   useEffect(() => {
//     let active = true;
//     setVideosLoading(true);
//     api.listVideos().then((list) => {
//       if (!active) return;
//       setVideos(Array.isArray(list) ? list : []);
//       setVideosLoading(false);
//     });
//     api.getConfig("hero", HERO_SEED).then((d) => active && setHeroValues({ ...HERO_SEED, ...(d || {}) }));
//     api.getConfig("liveSession", LIVE_SESSION_SEED).then((d) => active && setLiveValues({ ...LIVE_SESSION_SEED, ...(d || {}) }));
//     api.getConfig("searchFilters", SEARCH_SEED).then((d) => active && setSearchSettings({ ...SEARCH_SEED, ...(d || {}) }));
//     api.getConfig("videoPlayerSettings", PLAYER_SEED).then((d) => active && setPlayerSettings({ ...PLAYER_SEED, ...(d || {}) }));
//     api.listCollection("categories", SEED_CATEGORIES).then((d) => active && setCategories(Array.isArray(d) ? d : []));
//     api.listCollection("trainers", SEED_TRAINERS).then((d) => active && setTrainers(Array.isArray(d) ? d : []));
//     api.listCollection("webinars", SEED_WEBINARS).then((d) => active && setWebinars(Array.isArray(d) ? d : []));
//     api.getSectionAssignments().then((d) => active && setAssignments(d && Object.keys(d).length ? d : {}));
//     return () => {
//       active = false;
//     };
//   }, []);

//   // Counts lifted up so the top stats bar (full-width, above the
//   // 3-panel body) and the status quick-filters share one source.
//   const counts = useMemo(() => {
//     const c = { total: videos.length, active: 0, draft: 0, inactive: 0 };
//     videos.forEach((v) => {
//       if (v.status === "published" || v.status === "active") c.active += 1;
//       else if (v.status === "draft") c.draft += 1;
//       else c.inactive += 1;
//     });
//     return c;
//   }, [videos]);

//   const openEditorFor = (id) => {
//     const found = videos.find((v) => v.id === id);
//     setCurrentVideo(found ? { ...found } : { status: "draft" });
//     setSelectedId(id || null);
//     setActiveStep(1);
//     setShowEditor(true);
//   };

//   const handleAddNew = () => {
//     setCurrentVideo({ status: "draft" });
//     setSelectedId(null);
//     setActiveStep(1);
//     setShowEditor(true);
//   };

//   const handleSelect = (id) => openEditorFor(id);

//   const persistEverything = async (statusOverride) => {
//     const payload = currentVideo ? { ...currentVideo, status: statusOverride || currentVideo.status || "draft" } : null;
//     if (payload) {
//       const saved = await api.saveVideo(payload);
//       setVideos((prev) => {
//         const exists = prev.some((v) => v.id === saved.id);
//         return exists ? prev.map((v) => (v.id === saved.id ? { ...v, ...saved } : v)) : [...prev, { ...payload, ...saved }];
//       });
//       setCurrentVideo({ ...payload, ...saved });
//       setSelectedId(saved.id);
//     }
//     await api.saveConfig("hero", heroValues);
//     await api.saveConfig("liveSession", liveValues);
//     await api.saveConfig("searchFilters", searchSettings);
//     await api.saveConfig("videoPlayerSettings", playerSettings);
//     await api.saveSectionAssignments(assignments);
//     return payload;
//   };

//   const handleSaveDraft = async () => {
//     setSaving("draft");
//     await persistEverything("draft");
//     setSaving(false);
//     setLastAction("Saved as draft.");
//     setTimeout(() => setLastAction(""), 2500);
//   };
//   const handleSaveChanges = async () => {
//     setSaving("changes");
//     await persistEverything();
//     setSaving(false);
//     setLastAction("Changes saved.");
//     setTimeout(() => setLastAction(""), 2500);
//   };
//   const handlePublish = async () => {
//     setSaving("publish");
//     const payload = await persistEverything("published");
//     await api.publish(payload || {});
//     setSaving(false);
//     setLastAction("Published to WatchNow.");
//     setTimeout(() => setLastAction(""), 2500);
//   };
//   const handleArchive = async () => {
//     setSaving("archive");
//     await persistEverything("archived");
//     setSaving(false);
//     setLastAction("Archived.");
//     setTimeout(() => setLastAction(""), 2500);
//   };

//   const stepProps = {
//     video: currentVideo,
//     setVideo: setCurrentVideo,
//     hero: heroValues,
//     setHero: setHeroValues,
//     live: liveValues,
//     setLive: setLiveValues,
//     videos,
//     assignments,
//     setAssignments,
//     categories,
//     setCategories,
//     trainers,
//     setTrainers,
//     webinars,
//     setWebinars,
//     search: searchSettings,
//     setSearch: setSearchSettings,
//     player: playerSettings,
//     setPlayer: setPlayerSettings,
//     saving,
//     lastAction,
//     onSaveDraft: handleSaveDraft,
//     onSaveChanges: handleSaveChanges,
//     onPublish: handlePublish,
//     onArchive: handleArchive,
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
//         * { box-sizing: border-box; }
//       `}</style>
//       <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: t.pageBg, fontFamily: "Inter,sans-serif" }}>
//         {/* Top bar */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px 10px", background: t.surface, flexShrink: 0, flexWrap: "wrap" }}>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <p style={{ fontSize: 11, fontWeight: 600, color: t.accent, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>WatchNow &nbsp;›&nbsp; Videos</p>
//             <h1 style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>WatchNow Management</h1>
//             <p style={{ fontSize: 12.5, color: t.textMuted, margin: "3px 0 0", fontFamily: "Inter,sans-serif" }}>Manage every section of the WatchNow page from one place</p>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//             {!showEditor && (
//               <button
//                 onClick={() => {
//                   setCurrentVideo(null);
//                   setSelectedId(null);
//                   setActiveStep(2);
//                   setShowEditor(true);
//                 }}
//                 style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 8, border: t.inputBorder, background: t.inputBg, color: t.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
//               >
//                 <Settings size={13} /> Site Sections
//               </button>
//             )}
//             {/* Live Preview is opt-in — keeps the layout usable at 100%
//                 zoom instead of always reserving a third column. */}
//             <button
//               onClick={() => setShowPreview((p) => !p)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "9px 14px",
//                 borderRadius: 8,
//                 border: showPreview ? "none" : t.inputBorder,
//                 background: showPreview ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : t.inputBg,
//                 color: showPreview ? "#fff" : t.textSecondary,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 fontFamily: "Inter,sans-serif",
//               }}
//             >
//               <Eye size={13} /> {showPreview ? "Hide Preview" : "Show Preview"}
//             </button>
//             <button
//               type="button"
//               onClick={handleAddNew}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "9px 16px",
//                 borderRadius: 8,
//                 border: "none",
//                 background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
//                 color: "#fff",
//                 fontSize: 12,
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 fontFamily: "Inter,sans-serif",
//                 boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
//               }}
//             >
//               <Plus size={13} /> Add Video
//             </button>
//           </div>
//         </div>

//         {/* Up-to-3-panel body. overflowX:auto is a safety net — if the
//             viewport / browser zoom ever leaves less room than the panels'
//             minimum widths need, the row scrolls horizontally instead of
//             squeezing/clipping any panel's content. */}
//         <div style={{ flex: 1, display: "flex", minHeight: 0, overflowX: "auto" }}>
//           <VideoListPanel
//             t={t}
//             dark={dark}
//             videos={videos}
//             loading={videosLoading}
//             selectedId={selectedId}
//             onSelect={handleSelect}
//             counts={counts}
//             search={search}
//             setSearch={setSearchQuery}
//             categoryFilter={categoryFilter}
//             setCategoryFilter={setCategoryFilter}
//             statusFilter={statusFilter}
//             setStatusFilter={setStatusFilter}
//           />

//           {showEditor && (
//             <>
//               <EditorPanel t={t} dark={dark} width={panelWidth} onClose={() => setShowEditor(false)} activeStep={activeStep} setActiveStep={setActiveStep} {...stepProps} />
//               <ResizeHandle t={t} onDrag={(dx) => setPanelWidth(panelWidth + dx)} />
//             </>
//           )}

//           {showPreview && (
//             <LivePreviewPanel
//               t={t}
//               dark={dark}
//               hero={heroValues}
//               live={liveValues}
//               video={currentVideo}
//               videos={videos}
//               categories={categories}
//               onClose={() => setShowPreview(false)}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// }



































































import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  Loader,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Eye,
  FileText,
  Play,
  Edit2,
  Search,
  GripVertical,
  Star,
  Radio,
  Sparkles,
  Users,
  TrendingUp,
  Clock3,
  CalendarDays,
  Grid3x3,
  SlidersHorizontal,
  Bookmark,
  Settings,
  Save,
  Archive,
  Rocket,
  FileEdit,
  Video,
  Layers,
  ListVideo,
} from "lucide-react";
import videoService from "../../../services/videoService";
import { useNavigate } from "react-router-dom";
// ⚠️ Adjust this import path to match where ThemeContext actually lives
// relative to this file (same context used by SuperAdminDashboard.jsx).
import { useTheme } from "../../context/ThemeContext";

/* ============================================================
   THEME TOKENS — identical pattern to SuperAdminDashboard /
   Featured Programs so the CMS shares one design language.
   ============================================================ */
const getTokens = (dark) => ({
  pageBg: dark ? "#0f1115" : "#f1f3f9",
  surface: dark ? "#1a1d27" : "#ffffff",
  surfaceBorder: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
  panelHeaderBg: dark ? "rgba(255,255,255,0.03)" : "#fafafa",
  innerBg: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
  innerBorder: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
  faintBorder: dark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
  hoverBg: dark ? "rgba(255,255,255,0.05)" : "#fafafa",
  textPrimary: dark ? "#f1f5f9" : "#111827",
  textSecondary: dark ? "#cbd5e1" : "#374151",
  textMuted: dark ? "#94a3b8" : "#6b7280",
  textFaint: dark ? "#64748b" : "#9ca3af",
  inputBg: dark ? "rgba(255,255,255,0.05)" : "#ffffff",
  inputBorder: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid #d1d5db",
  dashedBorder: dark ? "rgba(255,255,255,0.18)" : "#d1d5db",
  emptyIconBg: dark ? "rgba(124,58,237,0.18)" : "#f3f0ff",
  dragBg: dark ? "rgba(255,255,255,0.03)" : "#fafafa",
  dragActiveBg: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
  fileChipBg: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
  fileChipBorder: dark ? "1px solid rgba(167,139,250,0.35)" : "1px solid #c4b5fd",
  thumbBg: dark ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.12))" : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
  thumbBorder: dark ? "1px solid rgba(167,139,250,0.3)" : "1px solid #c4b5fd",
  shadow: dark ? "0 1px 6px rgba(0,0,0,0.3)" : "0 1px 6px rgba(0,0,0,0.05)",
  shadowLg: dark ? "0 8px 30px rgba(0,0,0,0.45)" : "0 8px 30px rgba(0,0,0,0.12)",
  accent: "#7c3aed",
  accentDark: "#6d28d9",
  accentSoft: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
  previewBg: dark ? "#0b0d12" : "#f8f7fc",
});

const getInputStyle = (t) => ({
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: t.inputBorder,
  background: t.inputBg,
  color: t.textPrimary,
  fontSize: 13,
  fontFamily: "Inter,sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
});

function getStatusConfig(status, dark) {
  const map = {
    published: dark ? { bg: "rgba(34,197,94,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.35)", label: "Published" } : { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Published" },
    active: dark ? { bg: "rgba(34,197,94,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.35)", label: "Active" } : { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Active" },
    draft: dark ? { bg: "rgba(217,119,6,0.15)", color: "#fbbf24", border: "rgba(251,191,36,0.35)", label: "Draft" } : { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Draft" },
    inactive: dark ? { bg: "rgba(239,68,68,0.15)", color: "#f87171", border: "rgba(248,113,113,0.35)", label: "Inactive" } : { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Inactive" },
    archived: dark ? { bg: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "rgba(255,255,255,0.15)", label: "Archived" } : { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: "Archived" },
  };
  return map[status] || (dark ? { bg: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "rgba(255,255,255,0.15)", label: status || "—" } : { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: status || "—" });
}

/* Small localStorage helper — guarded, since this runs in the real app
   (not a sandboxed preview), so persisting the editor width is safe. */
function useLocalStorageNumber(key, fallback, min, max) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      const n = raw ? Number(raw) : fallback;
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
    } catch {
      return fallback;
    }
  });
  const setAndPersist = useCallback(
    (next) => {
      const clamped = Math.min(max, Math.max(min, next));
      setValue(clamped);
      try {
        window.localStorage.setItem(key, String(clamped));
      } catch {
        /* ignore */
      }
    },
    [key, min, max],
  );
  return [value, setAndPersist];
}

/* Small boolean localStorage helper — used to remember whether the
   Live Preview panel should be open, so it doesn't force itself onto
   the screen (and squeeze the other two panels) every time the page
   loads or the browser is zoomed in. */
function useLocalStorageBool(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : raw === "1";
    } catch {
      return fallback;
    }
  });
  const setAndPersist = useCallback(
    (next) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        /* ignore */
      }
    },
    [key],
  );
  return [value, setAndPersist];
}

/* ============================================================
   FORM ATOMS
   ============================================================ */
function Toggle({ value, onChange, dark }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: value ? "#7c3aed" : dark ? "rgba(255,255,255,0.15)" : "#d1d5db", position: "relative", flexShrink: 0, transition: "background 0.2s" }}
    >
      <span style={{ position: "absolute", top: 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", left: value ? 20 : 2, transition: "left 0.2s" }} />
    </button>
  );
}

function StatusBadge({ status, dark, onChange, options }) {
  const cfg = getStatusConfig(status, dark);
  if (!onChange) {
    return (
      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: "Inter,sans-serif", whiteSpace: "nowrap" }}>
        {cfg.label}
      </span>
    );
  }
  const cycle = options || ["published", "draft", "inactive"];
  return (
    <button
      type="button"
      title="Click to change status"
      onClick={() => {
        const idx = cycle.indexOf(status);
        onChange(cycle[(idx + 1) % cycle.length]);
      }}
      style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: "Inter,sans-serif", cursor: "pointer", whiteSpace: "nowrap" }}
    >
      {cfg.label}
    </button>
  );
}

function TextInput({ value, onChange, placeholder, t, type = "text" }) {
  return <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={getInputStyle(t)} />;
}

function TextAreaInput({ value, onChange, placeholder, t, rows = 3 }) {
  return <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...getInputStyle(t), resize: "vertical", fontFamily: "Inter,sans-serif" }} />;
}

function NumberInput({ value, onChange, placeholder, t, min, max }) {
  return (
    <input
      type="number"
      value={value ?? ""}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      placeholder={placeholder}
      style={getInputStyle(t)}
    />
  );
}

function SelectInput({ value, onChange, options, t, placeholder = "Select…" }) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ ...getInputStyle(t), cursor: "pointer" }}>
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

function ColorInput({ value, onChange, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <input type="color" value={value || "#7c3aed"} onChange={(e) => onChange(e.target.value)} style={{ width: 40, height: 34, borderRadius: 8, border: t.inputBorder, background: "none", cursor: "pointer", padding: 2 }} />
      <TextInput value={value} onChange={onChange} placeholder="#7c3aed" t={t} />
    </div>
  );
}

function TagsInput({ value, onChange, t, placeholder = "Type and press Enter…" }) {
  const [draft, setDraft] = useState("");
  const list = Array.isArray(value) ? value : [];
  const addTag = () => {
    const v = draft.trim();
    if (!v) return;
    if (!list.includes(v)) onChange([...list, v]);
    setDraft("");
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          style={getInputStyle(t)}
        />
        <button type="button" onClick={addTag} style={{ padding: "0 14px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
          Add
        </button>
      </div>
      {list.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {list.map((tag, i) => (
            <span key={`${tag}-${i}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "4px 8px 4px 10px", borderRadius: 999, background: t.fileChipBg, border: t.fileChipBorder, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
              {tag}
              <X size={11} style={{ cursor: "pointer" }} onClick={() => onChange(list.filter((_, idx) => idx !== i))} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingInput({ value, onChange, t }) {
  const v = Number(value) || 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={17} onClick={() => onChange(star)} style={{ cursor: "pointer" }} color={star <= v ? "#f59e0b" : t.textFaint} fill={star <= v ? "#f59e0b" : "none"} />
      ))}
      <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 6, fontFamily: "Inter,sans-serif" }}>{v ? v.toFixed(1) : "—"}</span>
    </div>
  );
}

function ImageUploadField({ value, onChange, t, dark, aspect = "16 / 9" }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const preview = typeof value === "string" ? value : value?.preview;
  const handleFile = (file) => {
    if (!file || !file.type?.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ file, preview: ev.target.result });
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          position: "relative",
          aspectRatio: aspect,
          borderRadius: 10,
          cursor: "pointer",
          border: `1.5px dashed ${dragOver ? "#7c3aed" : t.dashedBorder}`,
          background: dragOver ? t.dragActiveBg : t.dragBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 12 }}>
            <ImageIcon size={20} color={t.textFaint} style={{ margin: "0 auto 6px" }} />
            <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif" }}>Click or drag an image</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoUploadField({ value, onChange, t }) {
  const inputRef = useRef(null);
  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (!allowed.includes(file.type)) return;
    onChange({ file, fileName: file.name, url: "" });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
      <div onClick={() => inputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, cursor: "pointer", border: t.inputBorder, background: t.inputBg }}>
        <Upload size={14} color={t.textMuted} />
        <span style={{ fontSize: 12, color: value?.fileName ? t.textPrimary : t.textFaint, fontFamily: "Inter,sans-serif" }}>{value?.fileName || "Upload video file (MP4, WebM, MOV)"}</span>
      </div>
    </div>
  );
}

function LinkInput({ value, onChange, t, placeholder }) {
  return <TextInput value={value} onChange={onChange} placeholder={placeholder || "https://…"} t={t} />;
}

function FileUploadField({ value, onChange, t, accept = ".pdf" }) {
  const inputRef = useRef(null);
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onChange({ file, fileName: file.name });
        }}
      />
      <div onClick={() => inputRef.current?.click()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "9px 12px", borderRadius: 8, cursor: "pointer", border: t.inputBorder, background: t.inputBg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <FileText size={14} color={t.textMuted} />
          <span style={{ fontSize: 12, color: value?.fileName ? t.textPrimary : t.textFaint, fontFamily: "Inter,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value?.fileName || "Upload attachment"}</span>
        </div>
        {value?.fileName && (
          <X
            size={13}
            color={t.textFaint}
            style={{ cursor: "pointer", flexShrink: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children, t, span }) {
  return (
    <div style={span ? { gridColumn: "1 / -1" } : undefined}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: t.textMuted, fontFamily: "Inter,sans-serif", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#7c3aed" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function FieldGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>{children}</div>;
}

function DynamicField({ field, value, onChange, t, dark }) {
  switch (field.type) {
    case "textarea":
      return <TextAreaInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} />;
    case "number":
      return <NumberInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} min={field.min} max={field.max} />;
    case "select":
      return <SelectInput value={value} onChange={onChange} options={field.options} t={t} />;
    case "toggle":
      return <Toggle value={!!value} onChange={() => onChange(!value)} dark={dark} />;
    case "tags":
      return <TagsInput value={value} onChange={onChange} t={t} placeholder={field.placeholder} />;
    case "rating":
      return <RatingInput value={value} onChange={onChange} t={t} />;
    case "color":
      return <ColorInput value={value} onChange={onChange} t={t} />;
    case "date":
      return <TextInput type="date" value={value} onChange={onChange} t={t} />;
    case "time":
      return <TextInput type="time" value={value} onChange={onChange} t={t} />;
    case "link":
      return <LinkInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} />;
    case "image":
      return <ImageUploadField value={value} onChange={onChange} t={t} dark={dark} />;
    case "video":
      return <VideoUploadField value={value} onChange={onChange} t={t} />;
    case "file":
      return <FileUploadField value={value} onChange={onChange} t={t} accept={field.accept} />;
    case "text":
    default:
      return <TextInput value={value} onChange={onChange} placeholder={field.placeholder} t={t} />;
  }
}

/* ============================================================
   SCHEMAS
   ============================================================ */
const STATUS_OPTIONS = ["published", "draft", "inactive"];
const ACTIVE_OPTIONS = ["active", "inactive"];
const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const LANGUAGE_OPTIONS = ["English", "Hindi", "Urdu", "Hinglish"];
const CATEGORY_NAME_OPTIONS = ["AI & ML", "Web Development", "Data Science", "Interview Preparation", "Resume Building", "Soft Skills", "Career Guidance"];
const LIVE_STATUS_OPTIONS = ["live", "scheduled", "ended"];

/* Distinct accent per category — used for chips, thumbnails and the
   stat cards so the CMS reads as colorful/data-rich, matching the
   Companies page design language, instead of monochrome purple. */
const CATEGORY_COLORS = {
  "AI & ML": "#8b5cf6",
  "Web Development": "#3b82f6",
  "Data Science": "#0ea5e9",
  "Interview Preparation": "#f97316",
  "Resume Building": "#ec4899",
  "Soft Skills": "#10b981",
  "Career Guidance": "#14b8a6",
};
const colorForCategory = (cat) => CATEGORY_COLORS[cat] || "#7c3aed";
const tint = (hex, dark) => (dark ? `${hex}26` : `${hex}14`); // ~15%/8% alpha tint for backgrounds

const VIDEO_LIBRARY_FIELDS = [
  { key: "videoFile", label: "Upload Video", type: "video" },
  { key: "externalUrl", label: "External Video URL", type: "link", placeholder: "https://youtube.com/…" },
  { key: "thumbnail", label: "Thumbnail", type: "image" },
  { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. React JS Crash Course" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "category", label: "Category", type: "select", options: CATEGORY_NAME_OPTIONS },
  { key: "skill", label: "Skill", type: "text" },
  { key: "trainer", label: "Trainer", type: "text" },
  { key: "difficulty", label: "Difficulty", type: "select", options: DIFFICULTY_OPTIONS },
  { key: "duration", label: "Duration", type: "text", placeholder: "18 min" },
  { key: "language", label: "Language", type: "select", options: LANGUAGE_OPTIONS },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "pdfAttachment", label: "PDF Resource", type: "file", accept: ".pdf" },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
];

const HERO_FIELDS = [
  { key: "badgeText", label: "Hero Badge", type: "text", placeholder: "Watch Now" },
  { key: "heading", label: "Hero Heading", type: "text", placeholder: "Learn from Industry Experts" },
  { key: "description", label: "Hero Description", type: "textarea", span: true },
  { key: "features", label: "Hero Features", type: "tags", placeholder: "Add a feature and press Enter", span: true },
  { key: "bannerImage", label: "Hero Image", type: "image" },
  { key: "buttonEnabled", label: "Hero Button", type: "toggle" },
  { key: "buttonText", label: "Hero Button Text", type: "text" },
  { key: "buttonLink", label: "Hero Button Link", type: "link", placeholder: "/watch-now" },
];
const HERO_SEED = {
  badgeText: "Watch Now",
  heading: "Learn from Industry Experts",
  description: "Watch live masterclasses, career guidance, mock interviews, product demos and AI learning sessions from top professionals.",
  features: ["Featured Learning Videos", "Expert Mentors", "AI Powered Learning", "Career Roadmaps"],
  bannerImage: null,
  buttonEnabled: true,
  buttonText: "Watch Now",
  buttonLink: "/watch-now",
};

const LIVE_SESSION_FIELDS = [
  { key: "liveBadgeText", label: "Live Badge", type: "text", placeholder: "Live Session" },
  { key: "sessionTitle", label: "Session Title", type: "text" },
  { key: "description", label: "Description", type: "textarea", span: true },
  { key: "trainerName", label: "Trainer", type: "text" },
  { key: "trainerImage", label: "Trainer Image", type: "image" },
  { key: "sessionThumbnail", label: "Session Thumbnail", type: "image" },
  { key: "joinLiveButtonEnabled", label: "Join Live Button", type: "toggle" },
  { key: "joinLiveLink", label: "Join Live Link", type: "link" },
  { key: "sessionDate", label: "Date", type: "date" },
  { key: "sessionTime", label: "Time", type: "time" },
  { key: "liveStatus", label: "Status", type: "select", options: LIVE_STATUS_OPTIONS },
];
const LIVE_SESSION_SEED = {
  liveBadgeText: "Live Session",
  sessionTitle: "Machine Learning Masterclass",
  description: "Build real ML models and advance your career",
  trainerName: "Alfred Elver",
  trainerImage: null,
  sessionThumbnail: null,
  joinLiveButtonEnabled: true,
  joinLiveLink: "",
  sessionDate: "",
  sessionTime: "",
  liveStatus: "live",
};

const CATEGORY_FIELDS = [
  { key: "name", label: "Category Name", type: "text", required: true },
  { key: "icon", label: "Icon", type: "text", placeholder: "e.g. sparkles, code" },
  { key: "color", label: "Color", type: "color" },
  { key: "status", label: "Status", type: "select", options: ACTIVE_OPTIONS },
];

const TRAINER_FIELDS = [
  { key: "photo", label: "Photo", type: "image" },
  { key: "name", label: "Name", type: "text", required: true },
  { key: "designation", label: "Designation", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "experience", label: "Experience", type: "text", placeholder: "5+ years" },
  { key: "rating", label: "Rating", type: "rating" },
  { key: "linkedinUrl", label: "LinkedIn", type: "link" },
  { key: "twitterUrl", label: "Twitter / X", type: "link" },
  { key: "websiteUrl", label: "Website", type: "link" },
  { key: "status", label: "Status", type: "select", options: ACTIVE_OPTIONS },
];

const WEBINAR_FIELDS = [
  { key: "banner", label: "Banner", type: "image" },
  { key: "title", label: "Webinar Title", type: "text", required: true },
  { key: "speaker", label: "Speaker", type: "text" },
  { key: "date", label: "Date", type: "date" },
  { key: "time", label: "Time", type: "time" },
  { key: "registrationLink", label: "Registration Link", type: "link" },
  { key: "meetingLink", label: "Meeting Link", type: "link" },
  { key: "reminderEnabled", label: "Reminder", type: "toggle" },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
];

const SEARCH_TOGGLE_FIELDS = [
  { key: "searchEnabled", label: "Search", type: "toggle" },
  { key: "categoryFilterEnabled", label: "Category Filter", type: "toggle" },
  { key: "skillFilterEnabled", label: "Skill Filter", type: "toggle" },
  { key: "trainerFilterEnabled", label: "Trainer Filter", type: "toggle" },
  { key: "durationFilterEnabled", label: "Duration Filter", type: "toggle" },
  { key: "languageFilterEnabled", label: "Language Filter", type: "toggle" },
  { key: "difficultyFilterEnabled", label: "Difficulty Filter", type: "toggle" },
];
const SEARCH_SEED = { searchEnabled: true, categoryFilterEnabled: true, skillFilterEnabled: true, trainerFilterEnabled: true, durationFilterEnabled: true, languageFilterEnabled: true, difficultyFilterEnabled: true };

const PLAYER_TOGGLE_FIELDS = [
  { key: "resumePlayback", label: "Resume Playback", type: "toggle" },
  { key: "speedControl", label: "Speed Control", type: "toggle" },
  { key: "fullScreen", label: "Fullscreen", type: "toggle" },
  { key: "downloadResources", label: "Download Resources", type: "toggle" },
  { key: "share", label: "Share", type: "toggle" },
  { key: "notes", label: "Notes", type: "toggle" },
  { key: "comments", label: "Comments", type: "toggle" },
  { key: "like", label: "Likes", type: "toggle" },
];
const PLAYER_SEED = { resumePlayback: true, speedControl: true, fullScreen: true, downloadResources: false, share: true, notes: true, comments: true, like: true };

const LANDING_SECTION_DEFS = [
  { key: "featuredVideos", label: "Featured Videos", icon: Play },
  { key: "continueLearning", label: "Continue Learning", icon: Clock3 },
  { key: "recommendedVideos", label: "Recommended Videos", icon: Sparkles },
  { key: "trendingVideos", label: "Trending Videos", icon: TrendingUp },
  { key: "recentlyAdded", label: "Recently Added", icon: FileText },
];

const WIZARD_STEPS = [
  { n: 1, key: "video", label: "Video Library", icon: Video },
  { n: 2, key: "hero", label: "Hero & Live", icon: Sparkles },
  { n: 3, key: "sections", label: "Landing Sections", icon: Layers },
  { n: 4, key: "people", label: "Categories & Trainers", icon: Users },
  { n: 5, key: "webinars", label: "Webinars", icon: CalendarDays },
  { n: 6, key: "settings", label: "Search & Player", icon: SlidersHorizontal },
  { n: 7, key: "publish", label: "Publish", icon: Rocket },
];

/* ============================================================
   API ADAPTER — routes through videoService first, falls back to
   seed/local data so the CMS stays fully usable while the backend
   routes are being wired up (same withFallback pattern used
   elsewhere in Super Admin). Nothing else needs to change once
   the real endpoints exist on videoService.
   ============================================================ */
async function withFallback(fn, fallback) {
  try {
    const res = await fn();
    const data = res?.data ?? res;
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

const SEED_VIDEOS = [
  { id: "vid-1", title: "React JS Crash Course", category: "Web Development", trainer: "John Doe", duration: "18 min", difficulty: "Beginner", rating: 4.8, status: "published", views: 12400 },
  { id: "vid-2", title: "AI Career Roadmap", category: "Career Guidance", trainer: "Jane Smith", duration: "22 min", difficulty: "Intermediate", rating: 4.7, status: "published", views: 8700 },
  { id: "vid-3", title: "Mock Interview Guide", category: "Interview Preparation", trainer: "Robert Brown", duration: "15 min", difficulty: "Intermediate", rating: 4.9, status: "draft", views: 4200 },
  { id: "vid-4", title: "Python for Beginners", category: "Web Development", trainer: "Michael Lee", duration: "26 min", difficulty: "Beginner", rating: 4.6, status: "published", views: 15300 },
  { id: "vid-5", title: "Excel Advanced Tips", category: "Data Science", trainer: "Sarah Wilson", duration: "12 min", difficulty: "Advanced", rating: 4.5, status: "inactive", views: 2100 },
];

/* Compact view-count formatter, e.g. 12400 -> "12.4K" */
function formatViews(n) {
  const num = Number(n) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}
const SEED_CATEGORIES = CATEGORY_NAME_OPTIONS.map((name, i) => ({ id: `cat-${i + 1}`, name, color: "#7c3aed", icon: "sparkles", status: "active" }));
const SEED_TRAINERS = [
  { id: "tr-1", name: "Alfred Elver", designation: "ML Engineer", company: "Aviso AI", rating: 4.9, status: "active" },
  { id: "tr-2", name: "Riya Sharma", designation: "Sr. Product Manager", company: "Fintech Co", rating: 4.8, status: "active" },
];
const SEED_WEBINARS = [{ id: "web-1", title: "Breaking Into Product Management", speaker: "Riya Sharma", status: "published" }];

const api = {
  listVideos: () => withFallback(() => videoService.getWatchNowVideos?.(), SEED_VIDEOS),
  saveVideo: (payload) =>
    withFallback(() => (payload.id ? videoService.updateWatchNowVideo?.(payload.id, payload) : videoService.createWatchNowVideo?.(payload)), { id: payload.id || `vid-${Date.now()}`, ...payload }),
  deleteVideo: (id) => withFallback(() => videoService.deleteWatchNowVideo?.(id), { id }),

  getConfig: (key, seed) => withFallback(() => videoService.getWatchNowSectionConfig?.(key), seed),
  saveConfig: (key, payload) => withFallback(() => videoService.updateWatchNowSectionConfig?.(key, payload), payload),

  listCollection: (key, seed) => withFallback(() => videoService.getWatchNowSectionItems?.(key), seed),
  saveCollectionItem: (key, payload) =>
    withFallback(() => (payload.id ? videoService.updateWatchNowSectionItem?.(key, payload.id, payload) : videoService.createWatchNowSectionItem?.(key, payload)), { id: payload.id || `${key}-${Date.now()}`, ...payload }),
  deleteCollectionItem: (key, id) => withFallback(() => videoService.deleteWatchNowSectionItem?.(key, id), { id }),

  getSectionAssignments: () => withFallback(() => videoService.getWatchNowLandingSections?.(), {}),
  saveSectionAssignments: (payload) => withFallback(() => videoService.updateWatchNowLandingSections?.(payload), payload),

  publish: (payload) => withFallback(() => videoService.publishWatchNowChanges?.(payload), payload),
};

/* ============================================================
   TOP STATS BAR — full-width metric row rendered above the
   3-panel body (moved out of the left Videos panel per request:
   stats should sit at the top of the page, not in the sidebar).
   ============================================================ */
function TopStatsBar({ t, dark, counts, statusFilter, setStatusFilter }) {
  const STAT_DEFS = [
    {
      key: "",
      label: "Total Videos",
      value: counts.total,
      sub: `${counts.active} published`,
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
      icon: ListVideo,
    },
    {
      key: "published",
      label: "Active",
      value: counts.active,
      sub: `${counts.total ? Math.round((counts.active / counts.total) * 100) : 0}% of total`,
      gradient: "linear-gradient(135deg, #22c55e, #15803d)",
      icon: CheckCircle,
    },
    {
      key: "draft",
      label: "Draft",
      value: counts.draft,
      sub: `${counts.draft} pending review`,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      icon: FileEdit,
    },
    {
      key: "inactive",
      label: "Inactive",
      value: counts.inactive,
      sub: `${counts.inactive} disabled`,
      gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
      icon: X,
    },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {STAT_DEFS.map((s) => {
        const isActive = statusFilter === s.key && s.key !== "";
        return (
          <button
            key={s.label}
            type="button"
            onClick={() => setStatusFilter(statusFilter === s.key ? "" : s.key)}
            style={{
              textAlign: "left",
              padding: "16px 18px",
              borderRadius: 16,
              background: s.gradient,
              border: "none",
              cursor: "pointer",
              boxShadow: isActive ? "0 0 0 3px rgba(255,255,255,0.55), 0 10px 24px rgba(0,0,0,0.18)" : "0 6px 18px rgba(0,0,0,0.12)",
              fontFamily: "Inter,sans-serif",
              flex: "1 1 150px",
              minWidth: 150,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Faint decorative icon watermark, echoes the reference cards */}
            <s.icon size={72} color="rgba(255,255,255,0.12)" style={{ position: "absolute", right: -12, top: -12 }} />
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative" }}>
              <s.icon size={17} color="#fff" />
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1, position: "relative" }}>{s.value}</p>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "5px 0 8px", position: "relative" }}>{s.label}</p>
            <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.8)", margin: 0, display: "flex", alignItems: "center", gap: 5, position: "relative" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.8)", display: "inline-block", flexShrink: 0 }} />
              {s.sub}
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   SEARCH + FILTER BAR — full-width row: search input, filter
   icon, category dropdown, status dropdown, live results count.
   ============================================================ */
function SearchFilterBar({ t, search, setSearch, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, resultCount }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <div style={{ position: "relative", flex: "1 1 200px", minWidth: 200 }}>
        <Search size={14} color={t.textFaint} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos by title or instructor…"
          style={{ ...getInputStyle(t), paddingLeft: 34, height: 38 }}
        />
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 8, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <SlidersHorizontal size={14} color={t.textMuted} />
      </div>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        style={{ ...getInputStyle(t), height: 38, width: 160, cursor: "pointer", flexShrink: 0 }}
      >
        <option value="">All Categories</option>
        {CATEGORY_NAME_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ ...getInputStyle(t), height: 38, width: 140, cursor: "pointer", flexShrink: 0 }}
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="inactive">Inactive</option>
      </select>
      <span style={{ fontSize: 12, fontWeight: 600, color: t.textFaint, fontFamily: "Inter,sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>{resultCount} Results</span>
    </div>
  );
}

/* ============================================================
   CATEGORY PILLS ROW — horizontally scrollable, with left/right
   scroll-arrow buttons like a carousel.
   ============================================================ */
function CategoryPillsRow({ t, categoryFilter, setCategoryFilter }) {
  const scrollRef = useRef(null);
  const scrollBy = (dx) => scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  const pills = [{ key: "", label: "All" }, ...CATEGORY_NAME_OPTIONS.map((c) => ({ key: c, label: c }))];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button
        type="button"
        onClick={() => scrollBy(-160)}
        style={{ width: 26, height: 26, borderRadius: "50%", border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
      >
        <ChevronLeft size={13} color={t.textMuted} />
      </button>
      <div ref={scrollRef} style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
        {pills.map((c) => {
          const isActive = categoryFilter === c.key;
          const color = c.key ? colorForCategory(c.key) : "#7c3aed";
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setCategoryFilter(c.key)}
              style={{
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Inter,sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
                border: isActive ? "none" : t.inputBorder,
                background: isActive ? color : t.inputBg,
                color: isActive ? "#fff" : t.textSecondary,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(160)}
        style={{ width: 26, height: 26, borderRadius: "50%", border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
      >
        <ChevronRight size={13} color={t.textMuted} />
      </button>
    </div>
  );
}

/* ============================================================
   PAGINATION — simple client-side pager for the video list.
   ============================================================ */
function Pagination({ t, page, setPage, pageSize, setPageSize, total }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
      <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "Inter,sans-serif" }}>
        Showing {from} to {to} of {total} results
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          style={{ width: 28, height: 28, borderRadius: 7, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={13} color={t.textMuted} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: n === page ? "none" : t.inputBorder,
              background: n === page ? "#7c3aed" : t.inputBg,
              color: n === page ? "#fff" : t.textSecondary,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
            }}
          >
            {n}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          style={{ width: 28, height: 28, borderRadius: 7, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.5 : 1 }}
        >
          <ChevronRight size={13} color={t.textMuted} />
        </button>
      </div>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
          setPage(1);
        }}
        style={{ ...getInputStyle(t), width: 90, height: 30, fontSize: 11.5, cursor: "pointer" }}
      >
        {[5, 10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n} / page
          </option>
        ))}
      </select>
    </div>
  );
}

/* ============================================================
   LEFT PANEL — Video List. Full-width main content column:
   stats bar, search + filters, category pills, a row-per-video
   list (thumbnail, title, category/instructor, status, views,
   menu), and pagination — mirrors the reference dashboard layout.
   ============================================================ */
function VideoListPanel({ t, dark, videos, loading, selectedId, onSelect, counts, search, setSearch, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return videos.filter((v) => {
      const matchSearch = !q || String(v.title || "").toLowerCase().includes(q) || String(v.trainer || "").toLowerCase().includes(q);
      const matchCat = !categoryFilter || v.category === categoryFilter;
      const matchStatus = !statusFilter || v.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [videos, search, categoryFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div style={{ flex: "1 1 360px", minWidth: 360, display: "flex", flexDirection: "column", height: "100%", borderRight: t.surfaceBorder, background: t.pageBg }}>
      <div style={{ padding: "18px 22px 0", flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        <TopStatsBar t={t} dark={dark} counts={counts} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        <SearchFilterBar
          t={t}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          resultCount={filtered.length}
        />
        <CategoryPillsRow t={t} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px" }}>
        <div style={{ background: t.surface, border: t.surfaceBorder, borderRadius: 14, overflow: "visible" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 50 }}>
              <Loader size={18} color={t.textMuted} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : pageItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 16px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: t.emptyIconBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <ListVideo size={19} color="#7c3aed" />
              </div>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: t.textPrimary, margin: "0 0 3px", fontFamily: "Inter,sans-serif" }}>No videos found</p>
              <p style={{ fontSize: 11.5, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif" }}>Try clearing your filters, or add a new video.</p>
            </div>
          ) : (
            pageItems.map((v, idx) => {
              const active = v.id === selectedId;
              const preview = typeof v.thumbnail === "string" ? v.thumbnail : v.thumbnail?.preview;
              const catColor = colorForCategory(v.category);
              return (
                <div
                  key={v.id}
                  onClick={() => onSelect(v.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    cursor: "pointer",
                    borderBottom: idx < pageItems.length - 1 ? t.surfaceBorder : "none",
                    background: active ? t.accentSoft : "transparent",
                    position: "relative",
                  }}
                >
                  {preview ? (
                    <img src={preview} alt="" style={{ width: 96, height: 62, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 96, height: 62, borderRadius: 10, background: `linear-gradient(135deg, ${catColor}, #6d28d9)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                      <Play size={20} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" />
                      {v.duration && (
                        <span style={{ position: "absolute", bottom: 4, right: 5, padding: "1.5px 5px", borderRadius: 4, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9, fontFamily: "Inter,sans-serif" }}>{v.duration}</span>
                      )}
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, margin: "0 0 5px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title || "Untitled"}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: catColor, fontFamily: "Inter,sans-serif" }}>{v.category || "Uncategorized"}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: t.textMuted, fontFamily: "Inter,sans-serif" }}>
                        <span style={{ width: 16, height: 16, borderRadius: "50%", background: t.innerBg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Users size={9} color={t.textFaint} />
                        </span>
                        {v.trainer || "Unassigned"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>
                      <Eye size={12} /> {formatViews(v.views)} views
                    </div>
                  </div>
                  <StatusBadge status={v.status} dark={dark} />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === v.id ? null : v.id);
                    }}
                    style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: t.textFaint, fontSize: 16, fontWeight: 800 }}
                  >
                    ⋮
                  </button>
                  {openMenuId === v.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: "absolute", right: 16, top: 46, zIndex: 6, width: 150, background: t.surface, border: t.surfaceBorder, borderRadius: 10, boxShadow: t.shadowLg, overflow: "hidden" }}
                    >
                      <button
                        onClick={() => {
                          onSelect(v.id);
                          setOpenMenuId(null);
                        }}
                        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Pagination t={t} page={pageSafe} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={filtered.length} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   RESIZE HANDLE — VS Code / Figma style vertical divider
   ============================================================ */
function ResizeHandle({ onDrag, t }) {
  const draggingRef = useRef(false);
  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      onDrag(e.movementX);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onDrag]);

  return (
    <div
      onMouseDown={() => {
        draggingRef.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      title="Drag to resize"
      style={{ width: 6, flexShrink: 0, cursor: "col-resize", position: "relative", background: "transparent" }}
    >
      <div style={{ position: "absolute", left: 2, top: 0, bottom: 0, width: 2, borderRadius: 2, background: t.faintBorder }} />
    </div>
  );
}

/* ============================================================
   INLINE LIST EDITOR — generic add/edit/delete/reorder list used
   for Categories, Trainers and Webinars. Editing happens inline
   (accordion under the row) — never a popup.
   ============================================================ */
function InlineListEditor({ t, dark, title, icon: Icon, fields, items, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const dragIndexRef = useRef(null);

  const titleKey = fields.find((f) => ["title", "name"].includes(f.key))?.key || fields[0]?.key;

  const addNew = () => {
    const id = `new-${Date.now()}`;
    onChange([...items, { id, status: "active" }]);
    setEditingId(id);
  };

  const updateItem = (id, key, val) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [key]: val } : it)));
  };

  const removeItem = (id) => {
    onChange(items.filter((it) => it.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleDrop = (targetIdx) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from == null || from === targetIdx) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(targetIdx, 0, moved);
    onChange(next);
  };

  return (
    <div style={{ border: t.surfaceBorder, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: t.panelHeaderBg, borderBottom: t.surfaceBorder }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={14} color="#7c3aed" />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>{title}</span>
          <span style={{ fontSize: 10.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>({items.length})</span>
        </div>
        <button type="button" onClick={addNew} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7, border: "none", background: t.accent, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
          <Plus size={12} /> Add
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ padding: 16, fontSize: 12, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif", textAlign: "center" }}>Nothing here yet — click Add to create one.</p>
      ) : (
        <div>
          {items.map((item, idx) => (
            <div key={item.id} draggable onDragStart={() => (dragIndexRef.current = idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(idx)} style={{ borderBottom: idx < items.length - 1 ? t.surfaceBorder : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", cursor: "grab" }}>
                <GripVertical size={13} color={t.textFaint} />
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>{item[titleKey] || "Untitled"}</span>
                {item.status && <StatusBadge status={item.status} dark={dark} onChange={(s) => updateItem(item.id, "status", s)} options={ACTIVE_OPTIONS.includes(item.status) ? ACTIVE_OPTIONS : STATUS_OPTIONS} />}
                <button onClick={() => setEditingId(editingId === item.id ? null : item.id)} style={{ width: 26, height: 26, borderRadius: 6, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Edit2 size={12} color={t.textMuted} />
                </button>
                <button onClick={() => removeItem(item.id)} style={{ width: 26, height: 26, borderRadius: 6, border: dark ? "1px solid rgba(248,113,113,0.3)" : "1px solid #fecaca", background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Trash2 size={12} color={dark ? "#f87171" : "#dc2626"} />
                </button>
              </div>
              {editingId === item.id && (
                <div style={{ padding: "4px 14px 16px", background: t.innerBg }}>
                  <FieldGrid>
                    {fields.map((f) => (
                      <Field key={f.key} label={f.label} required={f.required} t={t} span={f.key === "description"}>
                        <DynamicField field={f} value={item[f.key]} onChange={(v) => updateItem(item.id, f.key, v)} t={t} dark={dark} />
                      </Field>
                    ))}
                  </FieldGrid>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   STEP CONTENTS
   ============================================================ */
function StepVideoLibrary({ t, dark, video, setVideo }) {
  if (!video) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px" }}>
        <Video size={22} color={t.textFaint} style={{ margin: "0 auto 10px" }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>No video selected</p>
        <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif" }}>Pick a video from the list, or continue to the next steps to edit site-wide sections.</p>
      </div>
    );
  }
  return (
    <FieldGrid>
      {VIDEO_LIBRARY_FIELDS.map((f) => (
        <Field key={f.key} label={f.label} required={f.required} t={t} span={f.key === "description"}>
          <DynamicField field={f} value={video[f.key]} onChange={(v) => setVideo((prev) => ({ ...prev, [f.key]: v }))} t={t} dark={dark} />
        </Field>
      ))}
    </FieldGrid>
  );
}

function StepHeroLive({ t, dark, hero, setHero, live, setLive }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
          <Sparkles size={14} color="#7c3aed" /> Hero Section
        </h3>
        <FieldGrid>
          {HERO_FIELDS.map((f) => (
            <Field key={f.key} label={f.label} required={f.required} t={t} span={f.span}>
              <DynamicField field={f} value={hero[f.key]} onChange={(v) => setHero((prev) => ({ ...prev, [f.key]: v }))} t={t} dark={dark} />
            </Field>
          ))}
        </FieldGrid>
      </div>
      <div style={{ height: 1, background: t.faintBorder }} />
      <div>
        <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
          <Radio size={14} color="#7c3aed" /> Live Session Highlight
        </h3>
        <FieldGrid>
          {LIVE_SESSION_FIELDS.map((f) => (
            <Field key={f.key} label={f.label} required={f.required} t={t} span={f.span}>
              <DynamicField field={f} value={live[f.key]} onChange={(v) => setLive((prev) => ({ ...prev, [f.key]: v }))} t={t} dark={dark} />
            </Field>
          ))}
        </FieldGrid>
      </div>
    </div>
  );
}

function StepLandingSections({ t, dark, videos, assignments, setAssignments }) {
  const [addingTo, setAddingTo] = useState(null);
  const dragRef = useRef(null);

  const setForSection = (key, updater) => {
    setAssignments((prev) => ({ ...prev, [key]: updater(prev[key] || []) }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {LANDING_SECTION_DEFS.map((section) => {
        const list = assignments[section.key] || [];
        const availableToAdd = videos.filter((v) => !list.some((e) => e.videoId === v.id));
        return (
          <div key={section.key} style={{ border: t.surfaceBorder, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: t.panelHeaderBg, borderBottom: t.surfaceBorder }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <section.icon size={14} color="#7c3aed" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>{section.label}</span>
                <span style={{ fontSize: 10.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>({list.length})</span>
              </div>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setAddingTo(addingTo === section.key ? null : section.key)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7, border: "none", background: t.accent, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
                >
                  <Plus size={12} /> Add Video
                </button>
                {addingTo === section.key && (
                  <div style={{ position: "absolute", right: 0, top: 32, zIndex: 5, width: 220, maxHeight: 220, overflowY: "auto", background: t.surface, border: t.surfaceBorder, borderRadius: 10, boxShadow: t.shadowLg }}>
                    {availableToAdd.length === 0 ? (
                      <p style={{ fontSize: 11.5, color: t.textFaint, padding: 12, margin: 0, fontFamily: "Inter,sans-serif" }}>All videos already added.</p>
                    ) : (
                      availableToAdd.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setForSection(section.key, (l) => [...l, { videoId: v.id, enabled: true }]);
                            setAddingTo(null);
                          }}
                          style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: 11.5, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}
                        >
                          {v.title}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            {list.length === 0 ? (
              <p style={{ padding: 14, fontSize: 11.5, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif" }}>No videos assigned to this section yet.</p>
            ) : (
              list.map((entry, idx) => {
                const v = videos.find((vv) => vv.id === entry.videoId);
                return (
                  <div
                    key={entry.videoId}
                    draggable
                    onDragStart={() => (dragRef.current = idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      const from = dragRef.current;
                      if (from == null || from === idx) return;
                      setForSection(section.key, (l) => {
                        const next = [...l];
                        const [moved] = next.splice(from, 1);
                        next.splice(idx, 0, moved);
                        return next;
                      });
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderTop: t.faintBorder ? `1px solid ${t.faintBorder}` : t.surfaceBorder, cursor: "grab" }}
                  >
                    <GripVertical size={13} color={t.textFaint} />
                    <span style={{ flex: 1, fontSize: 12, color: t.textSecondary, fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v?.title || "(removed video)"}</span>
                    <Toggle value={!!entry.enabled} onChange={() => setForSection(section.key, (l) => l.map((e) => (e.videoId === entry.videoId ? { ...e, enabled: !e.enabled } : e)))} dark={dark} />
                    <button
                      onClick={() => setForSection(section.key, (l) => l.filter((e) => e.videoId !== entry.videoId))}
                      style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <X size={13} color={t.textFaint} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepCategoriesTrainers({ t, dark, categories, setCategories, trainers, setTrainers }) {
  return (
    <div>
      <InlineListEditor t={t} dark={dark} title="Categories" icon={Grid3x3} fields={CATEGORY_FIELDS} items={categories} onChange={setCategories} />
      <InlineListEditor t={t} dark={dark} title="Trainers" icon={Users} fields={TRAINER_FIELDS} items={trainers} onChange={setTrainers} />
    </div>
  );
}

function StepWebinars({ t, dark, webinars, setWebinars }) {
  return <InlineListEditor t={t} dark={dark} title="Upcoming Webinars" icon={CalendarDays} fields={WEBINAR_FIELDS} items={webinars} onChange={setWebinars} />;
}

function StepSettings({ t, dark, search, setSearch, player, setPlayer }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
          <SlidersHorizontal size={14} color="#7c3aed" /> Search & Filters
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SEARCH_TOGGLE_FIELDS.map((f) => (
            <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, border: t.innerBorder, background: t.innerBg }}>
              <span style={{ fontSize: 12.5, color: t.textSecondary, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>{f.label}</span>
              <Toggle value={!!search[f.key]} onChange={() => setSearch((p) => ({ ...p, [f.key]: !p[f.key] }))} dark={dark} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: t.faintBorder }} />
      <div>
        <h3 style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 12px", fontFamily: "Inter,sans-serif" }}>
          <Settings size={14} color="#7c3aed" /> Video Player
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PLAYER_TOGGLE_FIELDS.map((f) => (
            <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, border: t.innerBorder, background: t.innerBg }}>
              <span style={{ fontSize: 12.5, color: t.textSecondary, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>{f.label}</span>
              <Toggle value={!!player[f.key]} onChange={() => setPlayer((p) => ({ ...p, [f.key]: !p[f.key] }))} dark={dark} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepPublish({ t, dark, video, onSaveDraft, onSaveChanges, onPublish, onArchive, saving, lastAction }) {
  const actionBtn = (label, icon, onClick, bg, color) => (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 16px", borderRadius: 9, border: "none", background: bg, color, fontSize: 12.5, fontWeight: 700, cursor: saving ? "default" : "pointer", fontFamily: "Inter,sans-serif", opacity: saving ? 0.7 : 1 }}
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div>
      <div style={{ border: t.innerBorder, background: t.innerBg, borderRadius: 12, padding: 16, marginBottom: 18 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>Ready to publish?</p>
        <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "Inter,sans-serif", lineHeight: 1.5 }}>
          Save your progress as a draft any time, or push all changes across Video Library, Hero &amp; Live Session, Landing Sections, Categories, Trainers, Webinars and Settings live to the WatchNow page.
        </p>
        {video && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <span style={{ fontSize: 11.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>Current video status:</span>
            <StatusBadge status={video.status} dark={dark} />
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        {actionBtn(saving === "draft" ? "Saving…" : "Save Draft", <FileEdit size={14} />, onSaveDraft, t.inputBg, t.textSecondary)}
        {actionBtn(saving === "changes" ? "Saving…" : "Save Changes", <Save size={14} />, onSaveChanges, t.accentSoft, t.accent)}
        {actionBtn(saving === "publish" ? "Publishing…" : "Publish", <Rocket size={14} />, onPublish, "linear-gradient(135deg,#7c3aed,#6d28d9)", "#fff")}
        {actionBtn(saving === "archive" ? "Archiving…" : "Archive", <Archive size={14} />, onArchive, dark ? "rgba(239,68,68,0.12)" : "#fef2f2", dark ? "#f87171" : "#dc2626")}
      </div>

      {lastAction && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 12, color: "#16a34a", fontFamily: "Inter,sans-serif" }}>
          <CheckCircle size={14} /> {lastAction}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CENTER PANEL — resizable, 7-step wizard (mirrors the numbered
   tab bar used on Featured Programs' Add Program editor)
   ============================================================ */
function EditorPanel({ t, dark, width, onClose, activeStep, setActiveStep, ...stepProps }) {
  return (
    <div style={{ width, flexShrink: 0, display: "flex", flexDirection: "column", height: "100%", background: t.surface, borderRight: t.surfaceBorder, animation: "slideIn 0.18s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: t.surfaceBorder, background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: 0, fontFamily: "Inter,sans-serif" }}>WatchNow Editor</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "2px 0 0", fontFamily: "Inter,sans-serif" }}>{WIZARD_STEPS[activeStep - 1].label}</p>
        </div>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={14} color="#fff" />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", overflowX: "auto", borderBottom: t.surfaceBorder, padding: "14px 18px" }}>
        {WIZARD_STEPS.map((step, idx) => {
          const active = step.n === activeStep;
          const done = step.n < activeStep;
          return (
            <React.Fragment key={step.key}>
              <button
                onClick={() => setActiveStep(step.n)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: 0, border: "none", background: "transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: active || done ? "#fff" : t.textFaint,
                    background: active || done ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : t.innerBg,
                    border: active || done ? "none" : t.inputBorder,
                    fontFamily: "Inter,sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {done ? <CheckCircle size={12} /> : step.n}
                </span>
                <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? t.accent : t.textSecondary, fontFamily: "Inter,sans-serif" }}>{step.label}</span>
              </button>
              {idx < WIZARD_STEPS.length - 1 && <div style={{ width: 22, height: 1, background: done ? t.accent : t.faintBorder, margin: "0 8px", flexShrink: 0 }} />}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
        {activeStep === 1 && <StepVideoLibrary t={t} dark={dark} video={stepProps.video} setVideo={stepProps.setVideo} />}
        {activeStep === 2 && <StepHeroLive t={t} dark={dark} hero={stepProps.hero} setHero={stepProps.setHero} live={stepProps.live} setLive={stepProps.setLive} />}
        {activeStep === 3 && <StepLandingSections t={t} dark={dark} videos={stepProps.videos} assignments={stepProps.assignments} setAssignments={stepProps.setAssignments} />}
        {activeStep === 4 && <StepCategoriesTrainers t={t} dark={dark} categories={stepProps.categories} setCategories={stepProps.setCategories} trainers={stepProps.trainers} setTrainers={stepProps.setTrainers} />}
        {activeStep === 5 && <StepWebinars t={t} dark={dark} webinars={stepProps.webinars} setWebinars={stepProps.setWebinars} />}
        {activeStep === 6 && <StepSettings t={t} dark={dark} search={stepProps.search} setSearch={stepProps.setSearch} player={stepProps.player} setPlayer={stepProps.setPlayer} />}
        {activeStep === 7 && (
          <StepPublish
            t={t}
            dark={dark}
            video={stepProps.video}
            saving={stepProps.saving}
            lastAction={stepProps.lastAction}
            onSaveDraft={stepProps.onSaveDraft}
            onSaveChanges={stepProps.onSaveChanges}
            onPublish={stepProps.onPublish}
            onArchive={stepProps.onArchive}
          />
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: t.surfaceBorder }}>
        <button
          disabled={activeStep === 1}
          onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 8, border: t.inputBorder, background: t.inputBg, color: t.textSecondary, fontSize: 12, fontWeight: 600, cursor: activeStep === 1 ? "default" : "pointer", opacity: activeStep === 1 ? 0.5 : 1, fontFamily: "Inter,sans-serif" }}
        >
          <ChevronLeft size={13} /> Back
        </button>
        {activeStep < 7 ? (
          <button
            onClick={() => setActiveStep((s) => Math.min(7, s + 1))}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
          >
            Next <ChevronRight size={13} />
          </button>
        ) : (
          <button
            onClick={stepProps.onSaveChanges}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
          >
            <Save size={13} /> Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   RIGHT PANEL — Live Preview, mirrors landing-page markup.
   This panel is now shown/hidden on demand (see `showPreview`
   in the main component) instead of always occupying a third
   column — that was the main cause of the layout looking
   squeezed / broken at 100% zoom.
   ============================================================ */
function LivePreviewPanel({ t, dark, hero, live, video, videos, categories, onClose }) {
  const heroImg = typeof hero.bannerImage === "string" ? hero.bannerImage : hero.bannerImage?.preview;
  const liveThumb = typeof live.sessionThumbnail === "string" ? live.sessionThumbnail : live.sessionThumbnail?.preview;
  const videoThumb = video ? (typeof video.thumbnail === "string" ? video.thumbnail : video.thumbnail?.preview) : null;

  return (
    <div style={{ flex: "0 0 320px", width: 320, minWidth: 320, display: "flex", flexDirection: "column", height: "100%", background: t.previewBg, borderLeft: t.surfaceBorder }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 18px", borderBottom: t.surfaceBorder, background: t.surface }}>
        <Eye size={14} color={t.textMuted} />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, fontFamily: "Inter,sans-serif" }}>Live Preview</span>
        <span style={{ fontSize: 10.5, color: t.textFaint, fontFamily: "Inter,sans-serif" }}>— updates as you type</span>
        {onClose && (
          <button
            onClick={onClose}
            title="Hide preview"
            style={{ marginLeft: "auto", width: 24, height: 24, borderRadius: 6, border: t.inputBorder, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <X size={12} color={t.textMuted} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Hero — fixed pixel height (not aspect-ratio) so it can never
            collapse or render blank regardless of parent flex sizing. */}
        <div style={{ borderRadius: 16, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadowLg }}>
          <div
            style={{
              position: "relative",
              minHeight: 170,
              background: heroImg ? `url(${heroImg}) center/cover` : "linear-gradient(135deg,#7c3aed 0%,#a855f7 55%,#ec4899 100%)",
              display: "flex",
              alignItems: "flex-end",
              padding: 18,
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: heroImg ? "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.05))" : "transparent" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "Inter,sans-serif", marginBottom: 8 }}>
                {hero.badgeText || "Badge"}
              </span>
              <h1 style={{ fontSize: 19, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "Inter,sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>{hero.heading || "Hero heading"}</h1>
            </div>
          </div>
          <div style={{ padding: 14 }}>
            <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 10px", fontFamily: "Inter,sans-serif", lineHeight: 1.5 }}>{hero.description || "Hero description will appear here."}</p>
            {Array.isArray(hero.features) && hero.features.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {hero.features.map((f, i) => (
                  <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: t.fileChipBg, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
            {hero.buttonEnabled && (
              <span style={{ display: "inline-block", padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "Inter,sans-serif", boxShadow: "0 4px 12px rgba(124,58,237,0.35)" }}>
                {hero.buttonText || "Watch Now"}
              </span>
            )}
          </div>
        </div>

        {/* Live Session */}
        <div style={{ borderRadius: 16, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadow, display: "flex" }}>
          <div style={{ width: 118, minHeight: 96, flexShrink: 0, position: "relative", background: liveThumb ? `url(${liveThumb}) center/cover` : "linear-gradient(135deg,#0ea5e9,#7c3aed)" }}>
            {live.liveStatus === "live" && (
              <span style={{ position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 999, background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>
                <Radio size={9} /> LIVE
              </span>
            )}
          </div>
          <div style={{ padding: 12, flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: t.accent, margin: "0 0 3px", fontFamily: "Inter,sans-serif" }}>{live.liveBadgeText || "Live Session"}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary, margin: "0 0 3px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{live.sessionTitle || "Session title"}</p>
            <p style={{ fontSize: 11, color: t.textMuted, margin: "0 0 6px", fontFamily: "Inter,sans-serif" }}>{live.trainerName || "Trainer name"}</p>
            {live.joinLiveButtonEnabled && (
              <span style={{ display: "inline-block", padding: "5px 10px", borderRadius: 7, background: t.accentSoft, color: t.accent, fontSize: 10.5, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>Join Live</span>
            )}
          </div>
        </div>

        {/* Current video card */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: t.textFaint, margin: "0 0 8px", fontFamily: "Inter,sans-serif" }}>Video Card Preview</p>
          {video ? (
            <div style={{ borderRadius: 14, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadow, maxWidth: 260 }}>
              <div style={{ minHeight: 140, position: "relative", background: videoThumb ? `url(${videoThumb}) center/cover` : `linear-gradient(135deg, ${colorForCategory(video.category)}, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={14} color="#7c3aed" fill="#7c3aed" />
                </div>
                {video.duration && (
                  <span style={{ position: "absolute", bottom: 6, right: 6, padding: "2px 6px", borderRadius: 5, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9.5, fontFamily: "Inter,sans-serif" }}>{video.duration}</span>
                )}
              </div>
              <div style={{ padding: 12 }}>
                {video.category && (
                  <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 999, background: `${colorForCategory(video.category)}18`, color: colorForCategory(video.category), fontSize: 9.5, fontWeight: 700, fontFamily: "Inter,sans-serif", marginBottom: 6 }}>
                    {video.category}
                  </span>
                )}
                <p style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>{video.title || "Video title"}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "Inter,sans-serif" }}>{video.trainer || "Trainer"}</span>
                  {video.rating ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
                      <Star size={11} color="#f59e0b" fill="#f59e0b" /> {Number(video.rating).toFixed(1)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: "center", border: `1.5px dashed ${t.dashedBorder}`, borderRadius: 14, maxWidth: 260, background: t.innerBg }}>
              <ImageIcon size={18} color={t.textFaint} style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 11.5, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif" }}>Select a video to preview its card</p>
            </div>
          )}
        </div>

        {/* Featured Videos row */}
        {Array.isArray(videos) && videos.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>Featured Videos</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.accent, fontFamily: "Inter,sans-serif" }}>View All</span>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
              {videos.slice(0, 3).map((fv) => {
                const fvThumb = typeof fv.thumbnail === "string" ? fv.thumbnail : fv.thumbnail?.preview;
                const fvColor = colorForCategory(fv.category);
                return (
                  <div key={fv.id} style={{ width: 140, flexShrink: 0, borderRadius: 12, overflow: "hidden", border: t.surfaceBorder, background: t.surface, boxShadow: t.shadow }}>
                    <div style={{ height: 80, position: "relative", background: fvThumb ? `url(${fvThumb}) center/cover` : `linear-gradient(135deg, ${fvColor}, #6d28d9)` }}>
                      {fv.duration && (
                        <span style={{ position: "absolute", bottom: 5, right: 5, padding: "1px 5px", borderRadius: 4, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 8.5, fontFamily: "Inter,sans-serif" }}>{fv.duration}</span>
                      )}
                    </div>
                    <div style={{ padding: 9 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fv.title}</p>
                      <p style={{ fontSize: 10, color: t.textMuted, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>{fv.trainer || "—"}</p>
                      {fv.rating ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: t.textSecondary, fontFamily: "Inter,sans-serif" }}>
                          <Star size={9} color="#f59e0b" fill="#f59e0b" /> {Number(fv.rating).toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories grid */}
        {Array.isArray(categories) && categories.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>Categories</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.accent, fontFamily: "Inter,sans-serif" }}>View All</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.slice(0, 5).map((cat) => {
                const cColor = colorForCategory(cat.name);
                return (
                  <div key={cat.id} style={{ width: 96, padding: "10px 8px", borderRadius: 10, border: t.surfaceBorder, background: t.surface, textAlign: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: tint(cColor, dark), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                      <Sparkles size={14} color={cColor} />
                    </div>
                    <p style={{ fontSize: 10.5, fontWeight: 700, color: t.textPrimary, margin: "0 0 2px", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cat.name}</p>
                    <p style={{ fontSize: 9.5, color: t.textFaint, margin: 0, fontFamily: "Inter,sans-serif" }}>0 videos</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN — Super Admin ▸ WatchNow Management (up-to-3-panel CMS)
   ============================================================ */
export default function AdminWatchNowManagement() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const t = getTokens(dark);

  // Left panel — video list
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [search, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Center panel — editor
  const [showEditor, setShowEditor] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [panelWidth, setPanelWidth] = useLocalStorageNumber("watchnow-cms-editor-width", 460, 350, 900);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Right panel — Live Preview. Off by default: it's optional, opened
  // only when the user wants it, so at normal zoom levels the list +
  // editor always have enough room and nothing gets visually squeezed.
  const [showPreview, setShowPreview] = useLocalStorageBool("watchnow-cms-show-preview", false);

  // Global config state (steps 2–6)
  const [heroValues, setHeroValues] = useState(HERO_SEED);
  const [liveValues, setLiveValues] = useState(LIVE_SESSION_SEED);
  const [assignments, setAssignments] = useState({});
  const [categories, setCategories] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [searchSettings, setSearchSettings] = useState(SEARCH_SEED);
  const [playerSettings, setPlayerSettings] = useState(PLAYER_SEED);

  const [saving, setSaving] = useState(false);
  const [lastAction, setLastAction] = useState("");

  useEffect(() => {
    let active = true;
    setVideosLoading(true);
    api.listVideos().then((list) => {
      if (!active) return;
      setVideos(Array.isArray(list) ? list : []);
      setVideosLoading(false);
    });
    api.getConfig("hero", HERO_SEED).then((d) => active && setHeroValues({ ...HERO_SEED, ...(d || {}) }));
    api.getConfig("liveSession", LIVE_SESSION_SEED).then((d) => active && setLiveValues({ ...LIVE_SESSION_SEED, ...(d || {}) }));
    api.getConfig("searchFilters", SEARCH_SEED).then((d) => active && setSearchSettings({ ...SEARCH_SEED, ...(d || {}) }));
    api.getConfig("videoPlayerSettings", PLAYER_SEED).then((d) => active && setPlayerSettings({ ...PLAYER_SEED, ...(d || {}) }));
    api.listCollection("categories", SEED_CATEGORIES).then((d) => active && setCategories(Array.isArray(d) ? d : []));
    api.listCollection("trainers", SEED_TRAINERS).then((d) => active && setTrainers(Array.isArray(d) ? d : []));
    api.listCollection("webinars", SEED_WEBINARS).then((d) => active && setWebinars(Array.isArray(d) ? d : []));
    api.getSectionAssignments().then((d) => active && setAssignments(d && Object.keys(d).length ? d : {}));
    return () => {
      active = false;
    };
  }, []);

  // Counts lifted up so the top stats bar (full-width, above the
  // 3-panel body) and the status quick-filters share one source.
  const counts = useMemo(() => {
    const c = { total: videos.length, active: 0, draft: 0, inactive: 0 };
    videos.forEach((v) => {
      if (v.status === "published" || v.status === "active") c.active += 1;
      else if (v.status === "draft") c.draft += 1;
      else c.inactive += 1;
    });
    return c;
  }, [videos]);

  const openEditorFor = (id) => {
    const found = videos.find((v) => v.id === id);
    setCurrentVideo(found ? { ...found } : { status: "draft" });
    setSelectedId(id || null);
    setActiveStep(1);
    setShowEditor(true);
  };

  const handleAddNew = () => {
    setCurrentVideo({ status: "draft" });
    setSelectedId(null);
    setActiveStep(1);
    setShowEditor(true);
  };

  const handleSelect = (id) => openEditorFor(id);

  const persistEverything = async (statusOverride) => {
    const payload = currentVideo ? { ...currentVideo, status: statusOverride || currentVideo.status || "draft" } : null;
    if (payload) {
      const saved = await api.saveVideo(payload);
      setVideos((prev) => {
        const exists = prev.some((v) => v.id === saved.id);
        return exists ? prev.map((v) => (v.id === saved.id ? { ...v, ...saved } : v)) : [...prev, { ...payload, ...saved }];
      });
      setCurrentVideo({ ...payload, ...saved });
      setSelectedId(saved.id);
    }
    await api.saveConfig("hero", heroValues);
    await api.saveConfig("liveSession", liveValues);
    await api.saveConfig("searchFilters", searchSettings);
    await api.saveConfig("videoPlayerSettings", playerSettings);
    await api.saveSectionAssignments(assignments);
    return payload;
  };

  const handleSaveDraft = async () => {
    setSaving("draft");
    await persistEverything("draft");
    setSaving(false);
    setLastAction("Saved as draft.");
    setTimeout(() => setLastAction(""), 2500);
  };
  const handleSaveChanges = async () => {
    setSaving("changes");
    await persistEverything();
    setSaving(false);
    setLastAction("Changes saved.");
    setTimeout(() => setLastAction(""), 2500);
  };
  const handlePublish = async () => {
    setSaving("publish");
    const payload = await persistEverything("published");
    await api.publish(payload || {});
    setSaving(false);
    setLastAction("Published to WatchNow.");
    setTimeout(() => setLastAction(""), 2500);
  };
  const handleArchive = async () => {
    setSaving("archive");
    await persistEverything("archived");
    setSaving(false);
    setLastAction("Archived.");
    setTimeout(() => setLastAction(""), 2500);
  };

  const stepProps = {
    video: currentVideo,
    setVideo: setCurrentVideo,
    hero: heroValues,
    setHero: setHeroValues,
    live: liveValues,
    setLive: setLiveValues,
    videos,
    assignments,
    setAssignments,
    categories,
    setCategories,
    trainers,
    setTrainers,
    webinars,
    setWebinars,
    search: searchSettings,
    setSearch: setSearchSettings,
    player: playerSettings,
    setPlayer: setPlayerSettings,
    saving,
    lastAction,
    onSaveDraft: handleSaveDraft,
    onSaveChanges: handleSaveChanges,
    onPublish: handlePublish,
    onArchive: handleArchive,
  };

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; }
      `}</style>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: t.pageBg, fontFamily: "Inter,sans-serif" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px 10px", background: t.surface, flexShrink: 0, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: t.accent, margin: "0 0 4px", fontFamily: "Inter,sans-serif" }}>WatchNow &nbsp;›&nbsp; Videos</p>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary, margin: 0, fontFamily: "Inter,sans-serif" }}>WatchNow Management</h1>
            <p style={{ fontSize: 12.5, color: t.textMuted, margin: "3px 0 0", fontFamily: "Inter,sans-serif" }}>Manage every section of the WatchNow page from one place</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {!showEditor && (
              <button
                onClick={() => {
                  setCurrentVideo(null);
                  setSelectedId(null);
                  setActiveStep(2);
                  setShowEditor(true);
                }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 8, border: t.inputBorder, background: t.inputBg, color: t.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
              >
                <Settings size={13} /> Site Sections
              </button>
            )}
            {/* Live Preview is opt-in — keeps the layout usable at 100%
                zoom instead of always reserving a third column. */}
            <button
              onClick={() => setShowPreview((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 14px",
                borderRadius: 8,
                border: showPreview ? "none" : t.inputBorder,
                background: showPreview ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : t.inputBg,
                color: showPreview ? "#fff" : t.textSecondary,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              <Eye size={13} /> {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <button
              type="button"
              onClick={handleAddNew}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
                boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
              }}
            >
              <Plus size={13} /> Add Video
            </button>
          </div>
        </div>

        {/* Up-to-3-panel body. overflowX:auto is a safety net — if the
            viewport / browser zoom ever leaves less room than the panels'
            minimum widths need, the row scrolls horizontally instead of
            squeezing/clipping any panel's content. */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, overflowX: "auto" }}>
          {showEditor && (
            <>
              <EditorPanel t={t} dark={dark} width={panelWidth} onClose={() => setShowEditor(false)} activeStep={activeStep} setActiveStep={setActiveStep} {...stepProps} />
              <ResizeHandle t={t} onDrag={(dx) => setPanelWidth(panelWidth + dx)} />
            </>
          )}

          <VideoListPanel
            t={t}
            dark={dark}
            videos={videos}
            loading={videosLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
            counts={counts}
            search={search}
            setSearch={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {showPreview && (
            <LivePreviewPanel
              t={t}
              dark={dark}
              hero={heroValues}
              live={liveValues}
              video={currentVideo}
              videos={videos}
              categories={categories}
              onClose={() => setShowPreview(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}