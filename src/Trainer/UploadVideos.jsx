// // src/trainer/UploadVideos.jsx
// import { useEffect, useRef, useState } from "react";
// import videoService from "../services/videoService";
// import VideoList from "./VideoList";
// import UploadDocuments from "./UploadDocuments";
// import CreateQuiz from "./CreateQuiz";
// import CreateAssignments from "./CreateAssignments";
// import {
//   UploadCloud, Video, FileText, ClipboardEdit, BookOpen, Link,
//   ChevronDown, Eye, Lock, Globe, Send, Save, X, Check, Search, Plus,
// } from "lucide-react";
// import { useTrainerTheme, PageShell, PageHero } from "./trainerTheme";

// /* ─────────────────── FONT ─────────────────── */
// const FF = "'Poppins', sans-serif";

// /* ─────────────────── THEME COLOR MAP ─────────────────── */
// // All colors derive from isDark — nothing is hardcoded white/black in components.
// const getColors = (isDark) => ({
//   cardBg:       isDark ? "#1a1d27" : "#ffffff",
//   cardBorder:   isDark ? "#2e3245" : "#e0e0e0",
//   inputBg:      isDark ? "#12151f" : "#fafafa",
//   inputBorder:  isDark ? "#2e3245" : "#d3d3d3",
//   textPrimary:  isDark ? "#f0f0f0" : "#0d0d0d",
//   textSub:      isDark ? "#8a8fa8" : "#606060",
//   textMuted:    isDark ? "#555970" : "#aaaaaa",
//   accent:       "#065fd4",
//   accentBg:     isDark ? "#0d2a5e" : "#e8f0fe",
//   accentLight:  isDark ? "#162644" : "#f0f7ff",
//   divider:      isDark ? "#2e3245" : "#e5e5e5",
//   hoverBg:      isDark ? "#22263a" : "#f2f2f2",
//   successColor: isDark ? "#34d399" : "#00873e",
//   errorColor:   isDark ? "#f87171" : "#cc0000",
//   toggleOff:    isDark ? "#444860" : "#aaaaaa",
//   zeroBg:       isDark ? "#0d1118" : "#f9f9f9",
// });

// const lbl = (c) => ({ fontSize: 12, fontWeight: 500, color: c.textSub, marginBottom: 6, fontFamily: FF, display: "block" });
// const inp = (c) => ({ width: "100%", padding: "10px 14px", border: `1px solid ${c.inputBorder}`, borderRadius: 4, background: c.inputBg, color: c.textPrimary, fontSize: 14, outline: "none", fontFamily: FF, boxSizing: "border-box", transition: "border-color .15s" });
// const pBtn   = ()  => ({ padding: "9px 20px", borderRadius: 4, border: "none", background: "#065fd4", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FF });
// const oBtn   = (c) => ({ padding: "9px 20px", borderRadius: 4, border: `1px solid ${c.inputBorder}`, background: c.cardBg, color: c.textPrimary, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FF });
// const dkBtn  = (c) => ({ padding: "9px 22px", borderRadius: 20, border: "none", background: c.textPrimary, color: c.cardBg, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FF });

// /* ─────────────────── STEP PROGRESS BAR ─────────────────── */
// const StepProgressBar = ({ activeStep, setActiveStep, c }) => {
//   const steps = [{ key: 1, label: "Details" }, { key: 2, label: "Video elements" }, { key: 3, label: "Checks" }, { key: 4, label: "Visibility" }];
//   return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
//       {steps.map((step, i) => {
//         const isActive = activeStep === step.key;
//         const isDone   = activeStep > step.key;
//         return (
//           <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
//             <div onClick={() => setActiveStep(step.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", minWidth: 80 }}>
//               <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${(isActive || isDone) ? c.accent : c.textMuted}`, background: (isActive || isDone) ? c.accent : c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, transition: "all .2s" }}>
//                 {isDone ? <Check size={13} color="#fff" strokeWidth={3} /> : <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#fff" : c.textMuted, fontFamily: FF }}>{step.key}</span>}
//               </div>
//               <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: (isActive || isDone) ? c.accent : c.textSub, fontFamily: FF, whiteSpace: "nowrap" }}>{step.label}</span>
//             </div>
//             {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: isDone ? c.accent : c.divider, margin: "0 4px", marginBottom: 20, transition: "background .2s" }} />}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// /* ─────────────────── MODAL ─────────────────── */
// const Modal = ({ title, onClose, children, c }) => (
//   <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
//     <div onClick={(e) => e.stopPropagation()} style={{ background: c.cardBg, borderRadius: 6, width: "100%", maxWidth: 500, border: `1px solid ${c.cardBorder}`, boxShadow: "0 12px 48px rgba(0,0,0,0.4)", overflow: "hidden" }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px", borderBottom: `1px solid ${c.divider}` }}>
//         <div style={{ fontSize: 16, fontWeight: 600, color: c.textPrimary, fontFamily: FF }}>{title}</div>
//         <div onClick={onClose} style={{ cursor: "pointer", color: c.textSub, display: "flex", padding: 4, borderRadius: "50%" }} onMouseEnter={e => e.currentTarget.style.background = c.hoverBg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><X size={18} /></div>
//       </div>
//       <div style={{ padding: "18px 24px 22px", overflowY: "auto", maxHeight: "80vh" }}>{children}</div>
//     </div>
//   </div>
// );

// /* ─────────────────── SUBTITLE MODAL ─────────────────── */
// const SubtitleModal = ({ onClose, onSave, c }) => {
//   const [file, setFile] = useState(null);
//   const [lang, setLang] = useState("English");
//   const fileRef = useRef();
//   return (
//     <Modal title="Add Subtitles / Captions" onClose={onClose} c={c}>
//       <div style={{ marginBottom: 14 }}>
//         <label style={lbl(c)}>Language</label>
//         <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ ...inp(c), appearance: "none", cursor: "pointer" }}>
//           {["English", "Hindi", "Bengali", "Tamil", "Telugu"].map((l) => <option key={l} value={l} style={{ background: c.cardBg, color: c.textPrimary }}>{l}</option>)}
//         </select>
//       </div>
//       <div style={{ marginBottom: 18 }}>
//         <label style={lbl(c)}>Subtitle File (.srt / .vtt)</label>
//         <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 28, border: `2px dashed ${file ? c.accent : c.inputBorder}`, borderRadius: 4, background: file ? c.accentLight : c.zeroBg, cursor: "pointer" }}>
//           <FileText size={28} color={file ? c.accent : c.textMuted} />
//           {file ? <span style={{ fontSize: 13, fontWeight: 600, color: c.accent, fontFamily: FF }}>✓ {file.name}</span>
//                 : <><span style={{ fontSize: 13, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>Click to upload subtitle file</span><span style={{ fontSize: 11, color: c.textSub, fontFamily: FF }}>.SRT or .VTT supported</span></>}
//           <input ref={fileRef} type="file" accept=".srt,.vtt" hidden onChange={(e) => setFile(e.target.files[0])} />
//         </label>
//       </div>
//       <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//         <button onClick={onClose} style={oBtn(c)}>Cancel</button>
//         <button onClick={() => { onSave({ file, lang }); onClose(); }} style={pBtn()}>Add Subtitles</button>
//       </div>
//     </Modal>
//   );
// };

// /* ─────────────────── END SCREEN MODAL ─────────────────── */
// const EndScreenModal = ({ onClose, onSave, c }) => {
//   const [selected, setSelected] = useState(null);
//   const templates = [
//     { id: "related",   label: "Related Video",    desc: "Suggest another lecture at end" },
//     { id: "subscribe", label: "Subscribe Prompt", desc: "Encourage course enrollment" },
//     { id: "playlist",  label: "Course Playlist",  desc: "Show the full course playlist" },
//     { id: "custom",    label: "Custom Link",      desc: "Redirect to any URL after video" },
//   ];
//   return (
//     <Modal title="Add End Screen" onClose={onClose} c={c}>
//       <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginBottom: 14, marginTop: 0 }}>Choose a template to show in the last 20 seconds of your lecture</p>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
//         {templates.map((tpl) => (
//           <div key={tpl.id} onClick={() => setSelected(tpl.id)} style={{ padding: "13px 15px", borderRadius: 4, cursor: "pointer", border: selected === tpl.id ? `2px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: selected === tpl.id ? c.accentLight : c.inputBg }}>
//             <div style={{ fontSize: 13, fontWeight: 600, color: selected === tpl.id ? c.accent : c.textPrimary, fontFamily: FF, marginBottom: 3 }}>{tpl.label}</div>
//             <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>{tpl.desc}</div>
//           </div>
//         ))}
//       </div>
//       <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//         <button onClick={onClose} style={oBtn(c)}>Cancel</button>
//         <button disabled={!selected} onClick={() => { onSave(selected); onClose(); }} style={{ ...pBtn(), opacity: selected ? 1 : 0.5, cursor: selected ? "pointer" : "not-allowed" }}>Add End Screen</button>
//       </div>
//     </Modal>
//   );
// };

// /* ─────────────────── CARDS MODAL ─────────────────── */
// const CardsModal = ({ onClose, onSave, c }) => {
//   const [type, setType] = useState("video");
//   const [url, setUrl]   = useState("");
//   const [label, setLabel] = useState("");
//   return (
//     <Modal title="Add Card" onClose={onClose} c={c}>
//       <div style={{ display: "flex", marginBottom: 16, borderBottom: `1px solid ${c.divider}` }}>
//         {[{ key: "video", label: "Video Card" }, { key: "link", label: "Link Card" }].map(({ key, label: lbl_ }) => (
//           <button key={key} onClick={() => setType(key)} style={{ padding: "9px 16px", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 13, fontWeight: type === key ? 600 : 400, background: "transparent", color: type === key ? c.accent : c.textSub, borderBottom: type === key ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1 }}>{lbl_}</button>
//         ))}
//       </div>
//       <div style={{ marginBottom: 14 }}>
//         <label style={lbl(c)}>{type === "video" ? "Video / Lecture URL" : "External Link URL"}</label>
//         <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={type === "video" ? "https://..." : "https://example.com"} style={inp(c)} onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
//       </div>
//       <div style={{ marginBottom: 18 }}>
//         <label style={lbl(c)}>Card Label (shown to students)</label>
//         <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Watch next: React Hooks" style={inp(c)} onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
//       </div>
//       <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//         <button onClick={onClose} style={oBtn(c)}>Cancel</button>
//         <button disabled={!url.trim()} onClick={() => { onSave({ type, url, label }); onClose(); }} style={{ ...pBtn(), opacity: url.trim() ? 1 : 0.5, cursor: url.trim() ? "pointer" : "not-allowed" }}>Add Card</button>
//       </div>
//     </Modal>
//   );
// };

// /* ─────────────────── CUSTOM SELECT ─────────────────── */
// const CustomSelect = ({ value, onChange, options, placeholder = "Select...", c }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef();
//   useEffect(() => {
//     const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);
//   const sel = options.find((o) => (o.value ?? o) === value);
//   const display = sel ? (sel.label ?? sel) : null;
//   return (
//     <div ref={ref} style={{ position: "relative", width: "100%" }}>
//       <div onClick={() => setOpen((p) => !p)} style={{ ...inp(c), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none", color: display ? c.textPrimary : c.textMuted }}>
//         <span style={{ fontSize: 14, fontFamily: FF }}>{display ?? placeholder}</span>
//         <ChevronDown size={16} color={c.textSub} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
//       </div>
//       {open && (
//         <div style={{ position: "fixed", zIndex: 99999, background: c.cardBg, border: `1px solid ${c.inputBorder}`, borderRadius: 4, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.35)", maxHeight: 220, overflowY: "auto", width: ref.current ? ref.current.offsetWidth : "auto", top: ref.current ? ref.current.getBoundingClientRect().bottom + 2 : "auto", left: ref.current ? ref.current.getBoundingClientRect().left : "auto" }}>
//           {options.map((opt) => {
//             const val = opt.value ?? opt, lbl_ = opt.label ?? opt, isSel = val === value;
//             return (
//               <div key={val} onClick={() => { onChange(val); setOpen(false); }} style={{ padding: "10px 14px", fontSize: 14, fontFamily: FF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: isSel ? c.accent : c.textPrimary, background: isSel ? c.accentBg : "transparent" }}
//                 onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
//                 onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
//                 {lbl_}{isSel && <Check size={14} color={c.accent} />}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─────────────────── SEARCHABLE SELECT ─────────────────── */
// const SearchableSelect = ({ value, onChange, options = [], placeholder = "Search or select…", onAdd, c }) => {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const wrapRef = useRef(null), inputRef = useRef(null);
//   const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
//   const selectedLabel = norm.find((o) => o.value === value)?.label ?? null;
//   const q = query.trim().toLowerCase();
//   const filtered = q ? norm.filter((o) => o.label.toLowerCase().includes(q)) : norm;
//   const exactMatch = norm.some((o) => o.label.toLowerCase() === q);
//   useEffect(() => { const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setQuery(""); } }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
//   useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 40); }, [open]);
//   const select = (val) => { onChange(val); setOpen(false); setQuery(""); };
//   const useCustom = () => { if (!query.trim()) return; onChange(query.trim()); setOpen(false); setQuery(""); };
//   const clearValue = (e) => { e.stopPropagation(); onChange(""); setQuery(""); };
//   const hl = (text, q) => { if (!q) return text; const idx = text.toLowerCase().indexOf(q.toLowerCase()); if (idx === -1) return text; return (<>{text.slice(0, idx)}<mark style={{ background: c.accentBg, color: c.accent, borderRadius: 2, padding: "0 1px" }}>{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>); };
//   return (
//     <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
//       <div onClick={() => setOpen((p) => !p)} style={{ ...inp(c), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none", color: selectedLabel ? c.textPrimary : c.textMuted, borderColor: open ? c.accent : c.inputBorder, borderRadius: open ? "4px 4px 0 0" : 4 }}>
//         <span style={{ fontSize: 14, fontFamily: FF, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedLabel ?? placeholder}</span>
//         <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//           {value && <span onClick={clearValue} style={{ display: "flex", alignItems: "center", color: c.textSub, cursor: "pointer" }}><X size={13} /></span>}
//           <ChevronDown size={15} color={c.textSub} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
//         </div>
//       </div>
//       {open && (
//         <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 99999, background: c.cardBg, border: `1px solid ${c.accent}`, borderTop: "none", borderRadius: "0 0 4px 4px", boxShadow: "0 6px 24px rgba(0,0,0,0.35)", overflow: "hidden" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${c.divider}`, background: c.zeroBg }}>
//             <Search size={14} color={c.textSub} />
//             <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && query.trim() && !exactMatch) useCustom(); if (e.key === "Escape") { setOpen(false); setQuery(""); } }} placeholder="Search…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: c.textPrimary, fontSize: 14, fontFamily: FF }} />
//           </div>
//           <div style={{ maxHeight: 200, overflowY: "auto" }}>
//             {query.trim() && !exactMatch && (<div onClick={useCustom} style={{ padding: "10px 14px", fontSize: 13, fontFamily: FF, cursor: "pointer", color: c.accent, fontWeight: 500, background: c.accentLight, borderBottom: `1px solid ${c.divider}` }} onMouseEnter={e => e.currentTarget.style.background = c.accentBg} onMouseLeave={e => e.currentTarget.style.background = c.accentLight}>+ Use &quot;{query.trim()}&quot;</div>)}
//             {filtered.map((opt) => { const isSel = opt.value === value; return (<div key={opt.value} onClick={() => select(opt.value)} style={{ padding: "10px 14px", fontSize: 14, fontFamily: FF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: isSel ? c.accent : c.textPrimary, background: isSel ? c.accentBg : "transparent", fontWeight: isSel ? 500 : 400 }} onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }} onMouseLeave={e => { e.currentTarget.style.background = isSel ? c.accentBg : "transparent"; }}><span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hl(opt.label, q)}</span>{isSel && <Check size={14} color={c.accent} />}</div>); })}
//             {filtered.length === 0 && query.trim() && <div style={{ padding: "10px 14px", fontSize: 13, color: c.textSub, fontFamily: FF, textAlign: "center" }}>Not found — press Enter to use custom</div>}
//           </div>
//           {onAdd && (<div onClick={() => { setOpen(false); setQuery(""); onAdd(); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 14px", fontSize: 13, fontFamily: FF, cursor: "pointer", color: c.accent, borderTop: `1px solid ${c.divider}`, fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.background = c.accentLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Plus size={14} />Add New Course</div>)}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─────────────────── TAB CONFIG ─────────────────── */
// const TABS = [
//   { key: "upload-video",      label: "Upload Video",      icon: Video },
//   { key: "upload-document",   label: "Upload Document",   icon: FileText },
//   { key: "create-quiz",       label: "Create Quiz",       icon: ClipboardEdit },
//   { key: "create-assignment", label: "Create Assignment", icon: BookOpen },
// ];

// /* ─────────────────── VIDEO UPLOAD ZONE ─────────────────── */
// const VideoUploadZone = ({ file, setFile, setTitle, videoUrl, setVideoUrl, videoType, setVideoType, c }) => {
//   const [dragging, setDragging] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [done, setDone] = useState(false);
//   const fileRef = useRef();
//   const runProgress = () => { setUploading(true); setDone(false); setProgress(0); let p = 0; const iv = setInterval(() => { p = Math.min(p + Math.floor(Math.random() * 12) + 3, 100); setProgress(p); if (p >= 100) { clearInterval(iv); setUploading(false); setDone(true); } }, 180); };
//   const exTitle = (name) => name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
//   const handleFile = (f) => { if (!f || !f.type.startsWith("video/")) return; setFile(f); setTitle(exTitle(f.name)); runProgress(); };
//   const tabS = (active) => ({ padding: "8px 16px", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 13, fontWeight: active ? 500 : 400, background: "transparent", color: active ? c.accent : c.textSub, borderBottom: active ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1 });
//   return (
//     <div>
//       <div style={{ display: "flex", borderBottom: `1px solid ${c.divider}`, marginBottom: 16 }}>
//         <button onClick={() => setVideoType("upload")} style={tabS(videoType === "upload")}><UploadCloud size={13} style={{ marginRight: 5 }} />Upload File</button>
//         <button onClick={() => setVideoType("url")}    style={tabS(videoType === "url")}><Link size={13} style={{ marginRight: 5 }} />Video URL</button>
//       </div>
//       {videoType === "upload" ? (
//         <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }} onClick={() => fileRef.current.click()}
//           style={{ border: `2px dashed ${dragging ? c.accent : c.inputBorder}`, borderRadius: 4, background: dragging ? c.accentLight : c.zeroBg, cursor: "pointer", transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 200, padding: 24 }}>
//           {!file ? (
//             <>
//               <div style={{ width: 72, height: 72, borderRadius: "50%", background: c.hoverBg, display: "flex", alignItems: "center", justifyContent: "center" }}><UploadCloud size={32} color={c.textMuted} /></div>
//               <div style={{ textAlign: "center" }}>
//                 <div style={{ fontSize: 15, fontWeight: 400, color: c.textPrimary, fontFamily: FF, marginBottom: 6 }}>Drag and drop video files to upload</div>
//                 <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginBottom: 16 }}>Your videos will be private until you publish them.</div>
//                 <button style={dkBtn(c)} onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>Upload Video</button>
//               </div>
//             </>
//           ) : (
//             <>
//               <video src={URL.createObjectURL(file)} style={{ width: "100%", borderRadius: 4, maxHeight: 150, objectFit: "contain", background: "#000" }} controls />
//               <div style={{ fontSize: 13, color: c.successColor, fontWeight: 500, fontFamily: FF }}>✓ {file.name}</div>
//             </>
//           )}
//           <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
//         </div>
//       ) : (
//         <div>
//           <label style={lbl(c)}>YouTube / Vimeo / Direct MP4 URL</label>
//           <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inp(c)} onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
//         </div>
//       )}
//       {(uploading || done) && file && (
//         <div style={{ marginTop: 12, background: c.zeroBg, border: `1px solid ${c.cardBorder}`, borderRadius: 4, padding: "12px 16px" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//             <span style={{ fontSize: 13, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>{file.name}</span>
//             <span style={{ fontSize: 13, fontWeight: 500, color: c.accent, fontFamily: FF }}>{progress}%</span>
//           </div>
//           <div style={{ height: 3, background: c.divider, borderRadius: 10, overflow: "hidden" }}><div style={{ height: "100%", width: `${progress}%`, background: c.accent, borderRadius: 10, transition: "width .3s" }} /></div>
//           <div style={{ fontSize: 12, color: c.textSub, marginTop: 6, fontFamily: FF }}>{done ? "✓ Upload complete" : progress < 40 ? "Checking 0%... 10 minutes left" : progress < 80 ? "Processing..." : "Almost done..."}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─────────────────── TAG INPUT ─────────────────── */
// const TagInput = ({ tags, setTags, c }) => {
//   const [val, setVal] = useState("");
//   const addTag = (e) => { if (e.key !== "Enter") return; const v = val.trim(); if (!v || tags.includes(v)) { setVal(""); return; } setTags((p) => [...p, v]); setVal(""); };
//   return (
//     <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "7px 11px", border: `1px solid ${c.inputBorder}`, borderRadius: 4, background: c.inputBg, minHeight: 42 }}>
//       {tags.map((tag) => <div key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 3, background: c.accentBg, color: c.accent, fontSize: 12, fontWeight: 500, fontFamily: FF }}>{tag}<X size={10} style={{ cursor: "pointer" }} onClick={() => setTags((p) => p.filter((tg) => tg !== tag))} /></div>)}
//       <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={addTag} placeholder={tags.length === 0 ? "Add tag, press Enter..." : ""} style={{ border: "none", outline: "none", background: "transparent", color: c.textPrimary, fontSize: 13, minWidth: 100, flex: 1, fontFamily: FF }} />
//     </div>
//   );
// };

// /* ─────────────────── AUDIENCE CARD ─────────────────── */
// const AudienceCard = ({ value, selected, onChange, title, desc, c }) => (
//   <label onClick={() => onChange(value)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 15px", borderRadius: 4, cursor: "pointer", border: selected ? `2px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: selected ? c.accentLight : c.inputBg }}>
//     <input type="radio" checked={selected} readOnly style={{ marginTop: 2, accentColor: c.accent }} />
//     <div>
//       <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FF, color: c.textPrimary }}>{title}</div>
//       <div style={{ fontSize: 13, fontFamily: FF, marginTop: 2, color: c.textSub }}>{desc}</div>
//     </div>
//   </label>
// );

// /* ─────────────────── VISIBILITY CARD ─────────────────── */
// const VisCard = ({ value, selected, onChange, icon: Icon, title, desc, c }) => (
//   <label onClick={() => onChange(value)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 4, cursor: "pointer", border: selected ? `2px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: selected ? c.accentLight : c.inputBg }}>
//     <input type="radio" checked={selected} readOnly style={{ accentColor: c.accent }} />
//     <Icon size={18} color={selected ? c.accent : c.textSub} />
//     <div>
//       <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FF, color: c.textPrimary }}>{title}</div>
//       <div style={{ fontSize: 13, fontFamily: FF, color: c.textSub }}>{desc}</div>
//     </div>
//   </label>
// );

// /* ─────────────────── COURSE CHIP ─────────────────── */
// const CourseChip = ({ label, c }) => {
//   const [active, setActive] = useState(false);
//   return <div onClick={() => setActive((p) => !p)} style={{ padding: "5px 11px", borderRadius: 3, cursor: "pointer", border: active ? `1.5px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: active ? c.accentBg : c.zeroBg, color: active ? c.accent : c.textSub, fontSize: 12, fontWeight: active ? 500 : 400, fontFamily: FF, display: "inline-flex", alignItems: "center", gap: 5 }}>{active && <Check size={10} />}{label}</div>;
// };

// /* ─────────────────── SECTION TITLE ─────────────────── */
// const SecTitle = ({ title, subtitle, c }) => (
//   <div style={{ marginBottom: 18 }}>
//     <h3 style={{ fontSize: 16, fontWeight: 600, color: c.textPrimary, fontFamily: FF, margin: "0 0 4px" }}>{title}</h3>
//     {subtitle && <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, margin: 0 }}>{subtitle}</p>}
//   </div>
// );
// const Divider = ({ c }) => <div style={{ height: 1, background: c.divider, margin: "22px 0" }} />;

// /* ─────────────────── CONSTANTS ─────────────────── */
// const CATEGORIES = ["Education", "Technology", "Programming", "Design", "Data Science", "Business", "Mathematics"];
// const LANGUAGES  = ["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"];
// const COURSES    = ["React Masterclass", "JS Fundamentals", "Node.js Backend", "CSS & Design"];

// /* ─────────────────── STEP 1: DETAILS ─────────────────── */
// const StepDetails = ({ file, setFile, title, setTitle, videoUrl, setVideoUrl, videoType, setVideoType, shortDesc, setShortDesc, batchId, setBatchId, batchOptions, tags, setTags, category, setCategory, language, setLanguage, course, setCourse, audience, setAudience, ageRestrict, setAgeRestrict, setShowCourseModal, c }) => (
//   <div style={{ display: "flex", gap: 32 }}>
//     <div style={{ flex: 1, minWidth: 0 }}>
//       <SecTitle title="Details" c={c} />
//       <div style={{ marginBottom: 18 }}>
//         <label style={lbl(c)}>Video Upload</label>
//         <VideoUploadZone file={file} setFile={setFile} setTitle={setTitle} videoUrl={videoUrl} setVideoUrl={setVideoUrl} videoType={videoType} setVideoType={setVideoType} c={c} />
//       </div>
//       <Divider c={c} />
//       <div style={{ marginBottom: 14 }}>
//         <label style={lbl(c)}>Title (required)</label>
//         <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a title that describes your video" style={inp(c)} onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
//         <div style={{ fontSize: 11, color: c.textMuted, textAlign: "right", marginTop: 4, fontFamily: FF }}>{title.length}/100</div>
//       </div>
//       <div style={{ marginBottom: 14 }}>
//         <label style={lbl(c)}>Description</label>
//         <textarea rows={4} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Tell viewers about your video" style={{ ...inp(c), resize: "vertical" }} onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
//         <div><label style={lbl(c)}>Category</label><CustomSelect value={category} onChange={setCategory} options={CATEGORIES} placeholder="Select Category" c={c} /></div>
//         <div><label style={lbl(c)}>Language</label><CustomSelect value={language} onChange={setLanguage} options={LANGUAGES} c={c} /></div>
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
//         <div><label style={lbl(c)}>Select Batch</label><CustomSelect value={batchId} onChange={setBatchId} options={batchOptions} placeholder="Select Batch" c={c} /></div>
//         <div><label style={lbl(c)}>Tags</label><TagInput tags={tags} setTags={setTags} c={c} /></div>
//       </div>
//       <Divider c={c} />
//       <div style={{ marginBottom: 14 }}>
//         <label style={lbl(c)}>Course / Playlist</label>
//         <SearchableSelect value={course} onChange={setCourse} options={COURSES} placeholder="Map to Course" onAdd={() => setShowCourseModal(true)} c={c} />
//       </div>
//       <div style={{ marginBottom: 14 }}>
//         <label style={lbl(c)}>Also Add To (multi-select)</label>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>{COURSES.map((cr) => <CourseChip key={cr} label={cr} c={c} />)}</div>
//       </div>
//       <Divider c={c} />
//       <div style={{ marginBottom: 14 }}>
//         <label style={lbl(c)}>Audience</label>
//         <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginBottom: 10, marginTop: 0 }}>Is this video made for kids? (required)</p>
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           <AudienceCard value="kids"     selected={audience === "kids"}     onChange={setAudience} title="Yes, it's made for kids"    desc="Appropriate for children" c={c} />
//           <AudienceCard value="not-kids" selected={audience === "not-kids"} onChange={setAudience} title="No, it's not made for kids" desc="General audience content"  c={c} />
//         </div>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 15px", border: `1px solid ${c.inputBorder}`, borderRadius: 4, background: c.zeroBg }}>
//         <div>
//           <div style={{ fontSize: 14, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>Age Restriction (18+)</div>
//           <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginTop: 2 }}>Restrict to adults only</div>
//         </div>
//         <div onClick={() => setAgeRestrict((p) => !p)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0, backgroundColor: ageRestrict ? c.accent : c.toggleOff }}>
//           <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: ageRestrict ? 22 : 2, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
//         </div>
//       </div>
//     </div>
//     {/* RIGHT SIDEBAR */}
//     <div style={{ width: 230, flexShrink: 0 }}>
//       <div style={{ position: "sticky", top: 16 }}>
//         <div style={{ background: "#000", borderRadius: 4, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, overflow: "hidden" }}>
//           {file ? <video src={URL.createObjectURL(file)} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Video size={28} color="#555" />}
//         </div>
//         {file && (
//           <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF, marginBottom: 10 }}>
//             <div style={{ fontWeight: 600, color: c.textPrimary, marginBottom: 3, fontSize: 12 }}>Video link</div>
//             <div style={{ color: c.accent, wordBreak: "break-all", cursor: "pointer" }}>{videoUrl || "Upload to get link"}</div>
//           </div>
//         )}
//         <div style={{ borderTop: `1px solid ${c.divider}`, paddingTop: 10 }}>
//           <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF, marginBottom: 5 }}><span style={{ fontWeight: 600, color: c.textPrimary }}>Filename: </span>{file?.name ?? "—"}</div>
//           <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}><span style={{ fontWeight: 600, color: c.textPrimary }}>Size: </span>{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "—"}</div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// /* ─────────────────── STEP 2: VIDEO ELEMENTS ─────────────────── */
// const StepElements = ({ c }) => {
//   const [modal, setModal] = useState(null);
//   const [subtitles, setSubtitles] = useState([]);
//   const [endScreen, setEndScreen] = useState(null);
//   const [cards, setCards] = useState([]);
//   const ELEMS = [
//     { key: "subtitle",  label: "Add subtitles",     sub: "Help more people discover your video by adding subtitles in more languages.", Icon: FileText, badge: subtitles.length > 0 ? `${subtitles.length} added` : null },
//     { key: "endscreen", label: "Add an end screen", sub: "Promote relevant content at the end of your video.", Icon: Video, badge: endScreen ? "1 template" : null },
//     { key: "cards",     label: "Add cards",         sub: "Promote related content during your video.", Icon: Link, badge: cards.length > 0 ? `${cards.length} card${cards.length > 1 ? "s" : ""}` : null },
//   ];
//   return (
//     <>
//       {modal === "subtitle"  && <SubtitleModal  onClose={() => setModal(null)} onSave={(d) => setSubtitles((p) => [...p, d])} c={c} />}
//       {modal === "endscreen" && <EndScreenModal onClose={() => setModal(null)} onSave={(d) => setEndScreen(d)} c={c} />}
//       {modal === "cards"     && <CardsModal     onClose={() => setModal(null)} onSave={(d) => setCards((p) => [...p, d])} c={c} />}
//       <SecTitle title="Video elements" subtitle="Add subtitles and end screen elements to enhance your lecture" c={c} />
//       <div style={{ border: `1px solid ${c.cardBorder}`, borderRadius: 4, overflow: "hidden" }}>
//         {ELEMS.map(({ key, label, sub, Icon, badge }, i) => (
//           <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: i < ELEMS.length - 1 ? `1px solid ${c.divider}` : "none", background: c.cardBg }}>
//             <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
//               <div style={{ width: 38, height: 38, background: c.zeroBg, border: `1px solid ${c.divider}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={17} color={c.textSub} /></div>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
//                   <div style={{ fontSize: 14, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>{label}</div>
//                   {badge && <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 7px", borderRadius: 3, background: c.accentBg, color: c.accent, fontFamily: FF }}>✓ {badge}</span>}
//                 </div>
//                 <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF, maxWidth: 380 }}>{sub}</div>
//               </div>
//             </div>
//             <button onClick={() => setModal(key)} style={{ ...oBtn(c), whiteSpace: "nowrap", flexShrink: 0, color: c.accent }} onMouseEnter={e => e.currentTarget.style.background = c.accentLight} onMouseLeave={e => e.currentTarget.style.background = c.cardBg}>+ Add</button>
//           </div>
//         ))}
//       </div>
//       {(subtitles.length > 0 || endScreen || cards.length > 0) && (
//         <div style={{ marginTop: 16, padding: "14px 18px", background: c.zeroBg, borderRadius: 4, border: `1px solid ${c.cardBorder}` }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: c.textSub, fontFamily: FF, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>Added Elements</div>
//           {subtitles.map((s, i) => (<div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}><span style={{ fontSize: 13, color: c.textPrimary, fontFamily: FF }}>📄 Subtitle ({s.lang}){s.file ? ` — ${s.file.name}` : ""}</span><X size={13} color={c.textSub} style={{ cursor: "pointer" }} onClick={() => setSubtitles((p) => p.filter((_, j) => j !== i))} /></div>))}
//           {endScreen && (<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}><span style={{ fontSize: 13, color: c.textPrimary, fontFamily: FF }}>🖥️ End screen — {endScreen}</span><X size={13} color={c.textSub} style={{ cursor: "pointer" }} onClick={() => setEndScreen(null)} /></div>)}
//           {cards.map((card, i) => (<div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}><span style={{ fontSize: 13, color: c.textPrimary, fontFamily: FF }}>🔗 {card.type === "video" ? "Video" : "Link"} card — {card.label || card.url}</span><X size={13} color={c.textSub} style={{ cursor: "pointer" }} onClick={() => setCards((p) => p.filter((_, j) => j !== i))} /></div>))}
//         </div>
//       )}
//     </>
//   );
// };

// /* ─────────────────── STEP 3: CHECKS ─────────────────── */
// const StepChecks = ({ c }) => (
//   <div>
//     <SecTitle title="Checks" subtitle="We check for issues that might impact your ability to monetize or distribute this video." c={c} />
//     <div style={{ border: `1px solid ${c.cardBorder}`, borderRadius: 4, overflow: "hidden" }}>
//       {[{ label: "Copyright check", status: "No issues found" }, { label: "Ad suitability", status: "Suitable for most advertisers" }, { label: "Community Guidelines", status: "No violations detected" }].map((item, i, arr) => (
//         <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: i < arr.length - 1 ? `1px solid ${c.divider}` : "none", background: c.cardBg }}>
//           <div>
//             <div style={{ fontSize: 14, fontWeight: 500, color: c.textPrimary, fontFamily: FF, marginBottom: 2 }}>{item.label}</div>
//             <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF }}>{item.status}</div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 6, color: c.successColor, fontSize: 13, fontWeight: 500, fontFamily: FF }}><Check size={15} color={c.successColor} strokeWidth={2.5} />No issues</div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// /* ─────────────────── STEP 4: VISIBILITY ─────────────────── */
// const StepVisibility = ({ visibility, setVisibility, c }) => (
//   <div>
//     <SecTitle title="Visibility" subtitle="Choose when to publish and who can see your video" c={c} />
//     <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//       <VisCard value="public"   selected={visibility === "public"}   onChange={setVisibility} icon={Globe} title="Public"   desc="Everyone can watch your video" c={c} />
//       <VisCard value="unlisted" selected={visibility === "unlisted"} onChange={setVisibility} icon={Eye}   title="Unlisted" desc="Anyone with the video link can watch your video" c={c} />
//       <VisCard value="private"  selected={visibility === "private"}  onChange={setVisibility} icon={Lock}  title="Private"  desc="Only enrolled batch students can view" c={c} />
//     </div>
//   </div>
// );

// /* ─────────────────── ADD COURSE FORM ─────────────────── */
// const AddCourseForm = ({ onSave, onClose, c }) => {
//   const [name, setName] = useState("");
//   return (
//     <div>
//       <label style={lbl(c)}>Course Name</label>
//       <input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onSave(name.trim()); }} placeholder="e.g. Advanced React Patterns" style={{ ...inp(c), marginBottom: 16 }} autoFocus onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
//       <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//         <button onClick={onClose} style={oBtn(c)}>Cancel</button>
//         <button disabled={!name.trim()} onClick={() => name.trim() && onSave(name.trim())} style={{ ...pBtn(), opacity: name.trim() ? 1 : 0.5, cursor: name.trim() ? "pointer" : "not-allowed" }}>Add Course</button>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────── MAIN UPLOAD PANEL ─────────────────── */
// const UploadVideoPanel = ({ t, isDark }) => {
//   const c = getColors(isDark);
//   const [showCourseModal, setShowCourseModal] = useState(false);
//   const [file, setFile]               = useState(null);
//   const [title, setTitle]             = useState("");
//   const [shortDesc, setShortDesc]     = useState("");
//   const [batchId, setBatchId]         = useState("");
//   const [batches, setBatches]         = useState([]);
//   const [loading, setLoading]         = useState(false);
//   const [message, setMessage]         = useState("");
//   const [refreshKey, setRefreshKey]   = useState(0);
//   const [videoType, setVideoType]     = useState("upload");
//   const [videoUrl, setVideoUrl]       = useState("");
//   const [activeStep, setActiveStep]   = useState(1);
//   const [tags, setTags]               = useState([]);
//   const [audience, setAudience]       = useState("not-kids");
//   const [ageRestrict, setAgeRestrict] = useState(false);
//   const [visibility, setVisibility]   = useState("public");
//   const [category, setCategory]       = useState("");
//   const [language, setLanguage]       = useState("English");
//   const [course, setCourse]           = useState("");
//   const [draftMsg, setDraftMsg]       = useState("");

//   useEffect(() => {
//     (async () => {
//       try { const res = await videoService.getTrainerBatches(); setBatches(res.data || []); }
//       catch (err) { console.error("Failed to load batches", err); }
//     })();
//   }, []);

//   const batchOptions = batches.map((b) => ({ value: String(b.id), label: `${b.name || "Batch"} (ID: ${b.id})` }));

//   const handlePublish = async () => {
//     if (videoType === "upload" && !file)         { setMessage("❌ Select a video file"); return; }
//     if (videoType === "url" && !videoUrl.trim()) { setMessage("❌ Enter a video URL"); return; }
//     if (!title.trim() || !batchId)               { setMessage("❌ Title & batch are required"); return; }
//     try {
//       setLoading(true); setMessage("");
//       if (videoType === "upload") await videoService.uploadVideo(file, title, shortDesc, batchId);
//       else await videoService.uploadVideoUrl?.(videoUrl, title, shortDesc, batchId);
//       setMessage("✅ Lecture published successfully!");
//       setRefreshKey((p) => p + 1);
//       setFile(null); setTitle(""); setShortDesc(""); setBatchId(""); setVideoUrl(""); setTags([]);
//     } catch { setMessage("❌ Upload failed (check batch assignment)"); }
//     finally { setLoading(false); }
//   };

//   const handleDraft = () => { setDraftMsg("✓ Draft saved"); setTimeout(() => setDraftMsg(""), 3000); };

//   return (
//     <>
//       {showCourseModal && (
//         <Modal title="Add New Course" onClose={() => setShowCourseModal(false)} c={c}>
//           <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, margin: "0 0 14px" }}>Enter the name of the new course to add it to your list.</p>
//           <AddCourseForm onSave={(newCourse) => { COURSES.push(newCourse); setCourse(newCourse); setShowCourseModal(false); }} onClose={() => setShowCourseModal(false)} c={c} />
//         </Modal>
//       )}

//       {/* Step header */}
//       <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 6, padding: "18px 28px 14px", marginBottom: 16 }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
//           <div style={{ fontSize: 17, fontWeight: 600, color: c.textPrimary, fontFamily: FF }}>{file ? (title || file.name) : "Publish Lecture"}</div>
//           <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>{file ? "Saved as private" : "Not saved"}</div>
//         </div>
//         <StepProgressBar activeStep={activeStep} setActiveStep={setActiveStep} c={c} />
//       </div>

//       {/* Content */}
//       <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 6, padding: 28, marginBottom: 14 }}>
//         {activeStep === 1 && <StepDetails file={file} setFile={setFile} title={title} setTitle={setTitle} videoUrl={videoUrl} setVideoUrl={setVideoUrl} videoType={videoType} setVideoType={setVideoType} shortDesc={shortDesc} setShortDesc={setShortDesc} batchId={batchId} setBatchId={setBatchId} batchOptions={batchOptions} tags={tags} setTags={setTags} category={category} setCategory={setCategory} language={language} setLanguage={setLanguage} course={course} setCourse={setCourse} audience={audience} setAudience={setAudience} ageRestrict={ageRestrict} setAgeRestrict={setAgeRestrict} setShowCourseModal={setShowCourseModal} c={c} />}
//         {activeStep === 2 && <StepElements c={c} />}
//         {activeStep === 3 && <StepChecks c={c} />}
//         {activeStep === 4 && <StepVisibility visibility={visibility} setVisibility={setVisibility} c={c} />}
//       </div>

//       {/* Bottom bar */}
//       <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 6, padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div style={{ fontSize: 13, fontFamily: FF, color: draftMsg ? c.successColor : message.startsWith("✅") ? c.successColor : c.errorColor }}>{draftMsg || message}</div>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           {activeStep > 1 && <button onClick={() => setActiveStep(p => p - 1)} style={oBtn(c)}>Back</button>}
//           <button onClick={handleDraft} style={{ ...oBtn(c), display: "flex", alignItems: "center", gap: 6 }}><Save size={13} />Save Draft</button>
//           {activeStep < 4
//             ? <button onClick={() => setActiveStep(p => p + 1)} style={{ ...pBtn(), display: "flex", alignItems: "center", gap: 6 }}>Next</button>
//             : <button onClick={handlePublish} disabled={loading} style={{ ...pBtn(), display: "flex", alignItems: "center", gap: 6, opacity: loading ? 0.6 : 1 }}><Send size={13} />{loading ? "Publishing..." : "Publish"}</button>
//           }
//         </div>
//       </div>

//       <div style={{ marginTop: 18 }}><VideoList refreshKey={refreshKey} trainerMode={true} /></div>
//     </>
//   );
// };

// /* ─────────────────── TAB BAR ─────────────────── */
// const TabBar = ({ activeTab, setActiveTab, c }) => (
//   <div style={{ display: "flex", borderBottom: `1px solid ${c.divider}`, marginBottom: 18 }}>
//     {TABS.map(({ key, label, icon: Icon }) => {
//       const isActive = activeTab === key;
//       return (
//         <button key={key} onClick={() => setActiveTab(key)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 18px", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 13, fontWeight: isActive ? 600 : 400, background: "transparent", color: isActive ? c.accent : c.textSub, borderBottom: isActive ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1, transition: "all .15s" }}>
//           <Icon size={15} />{label}
//         </button>
//       );
//     })}
//   </div>
// );

// /* ─────────────────── MAIN PAGE ─────────────────── */
// const UploadVideos = () => {
//   const { t, isDark } = useTrainerTheme();
//   const c = getColors(isDark);
//   const [activeTab, setActiveTab] = useState("upload-video");

//   const heroMeta = ({
//     "upload-video":      { title: "Publish New Lecture",   subtitle: "Upload recorded lectures for students.",            icon: Video,        color: "#065fd4" },
//     "upload-document":   { title: "Upload Documents",      subtitle: "Share study material and resources with students.", icon: FileText,      color: "#065fd4" },
//     "create-quiz":       { title: "Create Quiz",           subtitle: "Build interactive quizzes for your batch.",         icon: ClipboardEdit, color: "#065fd4" },
//     "create-assignment": { title: "Create Assignment",     subtitle: "Set assignments and track submissions.",            icon: BookOpen,      color: "#065fd4" },
//   })[activeTab] || { title: "Trainer Studio", subtitle: "", icon: Video, color: "#065fd4" };

//   const renderPanel = () => {
//     switch (activeTab) {
//       case "upload-video":      return <UploadVideoPanel t={t} isDark={isDark} />;
//       case "upload-document":   return <UploadDocuments />;
//       case "create-quiz":       return <CreateQuiz />;
//       case "create-assignment": return <CreateAssignments />;
//       default:                  return null;
//     }
//   };

//   return (
//     <PageShell t={t}>
//       <PageHero t={t} isDark={isDark} icon={heroMeta.icon} badge="Trainer Studio" title={heroMeta.title} subtitle={heroMeta.subtitle} color={heroMeta.color} />
//       <TabBar activeTab={activeTab} setActiveTab={setActiveTab} c={c} />
//       {renderPanel()}
//     </PageShell>
//   );
// };

// export default UploadVideos;




























import { useEffect, useRef, useState } from "react";
import videoService from "../services/videoService";
import { courseService } from "../services/courseService";
import VideoList from "./VideoList";
import UploadDocuments from "./UploadDocuments";
import CreateQuiz from "./CreateQuiz";
import CreateAssignments from "./CreateAssignments";
import {
  UploadCloud, Video, FileText, ClipboardEdit, BookOpen, Link,
  ChevronDown, Eye, Lock, Globe, Send, Save, X, Check, Search, Plus,
} from "lucide-react";
import { useTrainerTheme, PageShell, PageHero } from "./trainerTheme";

/* ─────────────────── FONT ─────────────────── */
const FF = "'Poppins', sans-serif";

/* ─────────────────── THEME COLOR MAP ─────────────────── */
const getColors = (isDark) => ({
  cardBg:       isDark ? "#1a1d27" : "#ffffff",
  cardBorder:   isDark ? "#2e3245" : "#e0e0e0",
  inputBg:      isDark ? "#12151f" : "#fafafa",
  inputBorder:  isDark ? "#2e3245" : "#d3d3d3",
  textPrimary:  isDark ? "#f0f0f0" : "#0d0d0d",
  textSub:      isDark ? "#8a8fa8" : "#606060",
  textMuted:    isDark ? "#555970" : "#aaaaaa",
  accent:       "#065fd4",
  accentBg:     isDark ? "#0d2a5e" : "#e8f0fe",
  accentLight:  isDark ? "#162644" : "#f0f7ff",
  divider:      isDark ? "#2e3245" : "#e5e5e5",
  hoverBg:      isDark ? "#22263a" : "#f2f2f2",
  successColor: isDark ? "#34d399" : "#00873e",
  errorColor:   isDark ? "#f87171" : "#cc0000",
  toggleOff:    isDark ? "#444860" : "#aaaaaa",
  zeroBg:       isDark ? "#0d1118" : "#f9f9f9",
});

const lbl  = (c) => ({ fontSize: 12, fontWeight: 500, color: c.textSub, marginBottom: 6, fontFamily: FF, display: "block" });
const inp  = (c) => ({ width: "100%", padding: "10px 14px", border: `1px solid ${c.inputBorder}`, borderRadius: 4, background: c.inputBg, color: c.textPrimary, fontSize: 14, outline: "none", fontFamily: FF, boxSizing: "border-box", transition: "border-color .15s" });
const pBtn = ()  => ({ padding: "9px 20px", borderRadius: 4, border: "none", background: "#065fd4", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FF });
const oBtn = (c) => ({ padding: "9px 20px", borderRadius: 4, border: `1px solid ${c.inputBorder}`, background: c.cardBg, color: c.textPrimary, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FF });
const dkBtn= (c) => ({ padding: "9px 22px", borderRadius: 20, border: "none", background: c.textPrimary, color: c.cardBg, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FF });

/* ─────────────────── URL → EMBED CONVERTER ─────────────────── */
/**
 * Converts a YouTube / Vimeo / direct video URL into a proper embeddable URL.
 * Returns { type: "iframe" | "video", url: string } so the caller knows
 * whether to render an <iframe> or a <video> tag.
 */
const parseVideoUrl = (rawUrl) => {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();

  // ── YouTube formats ──────────────────────────────────────────
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/shorts/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID  (already embed)
  const ytWatch   = url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/);
  const ytShorts  = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  const ytEmbed   = url.match(/youtube\.com\/embed\/([\w-]{11})/);

  if (ytWatch || ytShorts || ytEmbed) {
    const id = (ytWatch || ytShorts || ytEmbed)[1];
    return { type: "iframe", url: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` };
  }

  // ── Vimeo formats ────────────────────────────────────────────
  // https://vimeo.com/VIDEO_ID
  // https://player.vimeo.com/video/VIDEO_ID  (already embed)
  const vimeo = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
  if (vimeo) {
    return { type: "iframe", url: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  // ── Direct video file (mp4, webm, ogg, mov) ─────────────────
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) {
    return { type: "video", url };
  }

  // ── Unknown — try as direct video and hope for the best ──────
  return { type: "video", url };
};

/* ─────────────────── VIDEO PREVIEW PLAYER ─────────────────── */
/**
 * Renders the correct player depending on whether the source is:
 *   - a File object  → <video> with object URL
 *   - a YouTube/Vimeo URL → <iframe> embed
 *   - a direct video URL  → <video> tag
 */
const VideoPreviewPlayer = ({ file, videoUrl, style = {} }) => {
  const defaultStyle = {
    width: "100%",
    borderRadius: 4,
    background: "#000",
    aspectRatio: "16/9",
    objectFit: "contain",
    border: "none",
    ...style,
  };

  // Priority 1: uploaded file
  if (file) {
    return (
      <video
        src={URL.createObjectURL(file)}
        style={defaultStyle}
        controls
      />
    );
  }

  // Priority 2: URL
  if (videoUrl && videoUrl.trim()) {
    const parsed = parseVideoUrl(videoUrl);
    if (parsed) {
      if (parsed.type === "iframe") {
        return (
          <iframe
            src={parsed.url}
            style={defaultStyle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video preview"
          />
        );
      }
      // direct video
      return (
        <video
          src={parsed.url}
          style={defaultStyle}
          controls
        />
      );
    }
  }

  // Fallback placeholder
  return (
    <div style={{ ...defaultStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Video size={28} color="#555" />
    </div>
  );
};

/* ─────────────────── STEP PROGRESS BAR ─────────────────── */
const StepProgressBar = ({ activeStep, setActiveStep, c }) => {
  const steps = [
    { key: 1, label: "Details" },
    { key: 2, label: "Video elements" },
    { key: 3, label: "Checks" },
    { key: 4, label: "Visibility" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
      {steps.map((step, i) => {
        const isActive = activeStep === step.key;
        const isDone   = activeStep > step.key;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div onClick={() => setActiveStep(step.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", minWidth: 80 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${(isActive || isDone) ? c.accent : c.textMuted}`, background: (isActive || isDone) ? c.accent : c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, transition: "all .2s" }}>
                {isDone
                  ? <Check size={13} color="#fff" strokeWidth={3} />
                  : <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#fff" : c.textMuted, fontFamily: FF }}>{step.key}</span>
                }
              </div>
              <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: (isActive || isDone) ? c.accent : c.textSub, fontFamily: FF, whiteSpace: "nowrap" }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: isDone ? c.accent : c.divider, margin: "0 4px", marginBottom: 20, transition: "background .2s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────── MODAL ─────────────────── */
const Modal = ({ title, onClose, children, c }) => (
  <div
    style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ background: c.cardBg, borderRadius: 6, width: "100%", maxWidth: 500, border: `1px solid ${c.cardBorder}`, boxShadow: "0 12px 48px rgba(0,0,0,0.4)", overflow: "hidden" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px", borderBottom: `1px solid ${c.divider}` }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: c.textPrimary, fontFamily: FF }}>{title}</div>
        <div
          onClick={onClose}
          style={{ cursor: "pointer", color: c.textSub, display: "flex", padding: 4, borderRadius: "50%" }}
          onMouseEnter={e => e.currentTarget.style.background = c.hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <X size={18} />
        </div>
      </div>
      <div style={{ padding: "18px 24px 22px", overflowY: "auto", maxHeight: "80vh" }}>{children}</div>
    </div>
  </div>
);

/* ─────────────────── SUBTITLE MODAL ─────────────────── */
const SubtitleModal = ({ onClose, onSave, c }) => {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState("English");
  const fileRef = useRef();
  return (
    <Modal title="Add Subtitles / Captions" onClose={onClose} c={c}>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl(c)}>Language</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ ...inp(c), appearance: "none", cursor: "pointer" }}>
          {["English", "Hindi", "Bengali", "Tamil", "Telugu"].map((l) => (
            <option key={l} value={l} style={{ background: c.cardBg, color: c.textPrimary }}>{l}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={lbl(c)}>Subtitle File (.srt / .vtt)</label>
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 28, border: `2px dashed ${file ? c.accent : c.inputBorder}`, borderRadius: 4, background: file ? c.accentLight : c.zeroBg, cursor: "pointer" }}>
          <FileText size={28} color={file ? c.accent : c.textMuted} />
          {file
            ? <span style={{ fontSize: 13, fontWeight: 600, color: c.accent, fontFamily: FF }}>✓ {file.name}</span>
            : <>
                <span style={{ fontSize: 13, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>Click to upload subtitle file</span>
                <span style={{ fontSize: 11, color: c.textSub, fontFamily: FF }}>.SRT or .VTT supported</span>
              </>
          }
          <input ref={fileRef} type="file" accept=".srt,.vtt" hidden onChange={(e) => setFile(e.target.files[0])} />
        </label>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={oBtn(c)}>Cancel</button>
        <button onClick={() => { onSave({ file, lang }); onClose(); }} style={pBtn()}>Add Subtitles</button>
      </div>
    </Modal>
  );
};

/* ─────────────────── END SCREEN MODAL ─────────────────── */
const EndScreenModal = ({ onClose, onSave, c }) => {
  const [selected, setSelected] = useState(null);
  const templates = [
    { id: "related",   label: "Related Video",    desc: "Suggest another lecture at end" },
    { id: "subscribe", label: "Subscribe Prompt", desc: "Encourage course enrollment" },
    { id: "playlist",  label: "Course Playlist",  desc: "Show the full course playlist" },
    { id: "custom",    label: "Custom Link",      desc: "Redirect to any URL after video" },
  ];
  return (
    <Modal title="Add End Screen" onClose={onClose} c={c}>
      <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginBottom: 14, marginTop: 0 }}>
        Choose a template to show in the last 20 seconds of your lecture
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => setSelected(tpl.id)}
            style={{ padding: "13px 15px", borderRadius: 4, cursor: "pointer", border: selected === tpl.id ? `2px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: selected === tpl.id ? c.accentLight : c.inputBg }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: selected === tpl.id ? c.accent : c.textPrimary, fontFamily: FF, marginBottom: 3 }}>{tpl.label}</div>
            <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>{tpl.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={oBtn(c)}>Cancel</button>
        <button
          disabled={!selected}
          onClick={() => { onSave(selected); onClose(); }}
          style={{ ...pBtn(), opacity: selected ? 1 : 0.5, cursor: selected ? "pointer" : "not-allowed" }}
        >
          Add End Screen
        </button>
      </div>
    </Modal>
  );
};

/* ─────────────────── CARDS MODAL ─────────────────── */
const CardsModal = ({ onClose, onSave, c }) => {
  const [type, setType]   = useState("video");
  const [url, setUrl]     = useState("");
  const [label, setLabel] = useState("");
  return (
    <Modal title="Add Card" onClose={onClose} c={c}>
      <div style={{ display: "flex", marginBottom: 16, borderBottom: `1px solid ${c.divider}` }}>
        {[{ key: "video", label: "Video Card" }, { key: "link", label: "Link Card" }].map(({ key, label: lbl_ }) => (
          <button
            key={key}
            onClick={() => setType(key)}
            style={{ padding: "9px 16px", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 13, fontWeight: type === key ? 600 : 400, background: "transparent", color: type === key ? c.accent : c.textSub, borderBottom: type === key ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1 }}
          >
            {lbl_}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl(c)}>{type === "video" ? "Video / Lecture URL" : "External Link URL"}</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={type === "video" ? "https://..." : "https://example.com"} style={inp(c)} onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={lbl(c)}>Card Label (shown to students)</label>
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Watch next: React Hooks" style={inp(c)} onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={oBtn(c)}>Cancel</button>
        <button
          disabled={!url.trim()}
          onClick={() => { onSave({ type, url, label }); onClose(); }}
          style={{ ...pBtn(), opacity: url.trim() ? 1 : 0.5, cursor: url.trim() ? "pointer" : "not-allowed" }}
        >
          Add Card
        </button>
      </div>
    </Modal>
  );
};

/* ─────────────────── CUSTOM SELECT ─────────────────── */
const CustomSelect = ({ value, onChange, options, placeholder = "Select...", c }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const sel = options.find((o) => (o.value ?? o) === value);
  const display = sel ? (sel.label ?? sel) : null;
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setOpen((p) => !p)}
        style={{ ...inp(c), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none", color: display ? c.textPrimary : c.textMuted }}
      >
        <span style={{ fontSize: 14, fontFamily: FF }}>{display ?? placeholder}</span>
        <ChevronDown size={16} color={c.textSub} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </div>
      {open && (
        <div style={{ position: "fixed", zIndex: 99999, background: c.cardBg, border: `1px solid ${c.inputBorder}`, borderRadius: 4, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.35)", maxHeight: 220, overflowY: "auto", width: ref.current ? ref.current.offsetWidth : "auto", top: ref.current ? ref.current.getBoundingClientRect().bottom + 2 : "auto", left: ref.current ? ref.current.getBoundingClientRect().left : "auto" }}>
          {options.map((opt) => {
            const val = opt.value ?? opt, lbl_ = opt.label ?? opt, isSel = val === value;
            return (
              <div
                key={val}
                onClick={() => { onChange(val); setOpen(false); }}
                style={{ padding: "10px 14px", fontSize: 14, fontFamily: FF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: isSel ? c.accent : c.textPrimary, background: isSel ? c.accentBg : "transparent" }}
                onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
              >
                {lbl_}{isSel && <Check size={14} color={c.accent} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────────── SEARCHABLE SELECT ─────────────────── */
const SearchableSelect = ({ value, onChange, options = [], placeholder = "Search or select…", onAdd, loading = false, c }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef  = useRef(null);
  const inputRef = useRef(null);

  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const selectedLabel = norm.find((o) => o.value === value)?.label ?? null;
  const q = query.trim().toLowerCase();
  const filtered = q ? norm.filter((o) => o.label.toLowerCase().includes(q)) : norm;
  const exactMatch = norm.some((o) => o.label.toLowerCase() === q);

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 40); }, [open]);

  const select    = (val) => { onChange(val); setOpen(false); setQuery(""); };
  const useCustom = ()    => { if (!query.trim()) return; onChange(query.trim()); setOpen(false); setQuery(""); };
  const clearValue= (e)   => { e.stopPropagation(); onChange(""); setQuery(""); };

  const hl = (text, q) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>{text.slice(0, idx)}<mark style={{ background: c.accentBg, color: c.accent, borderRadius: 2, padding: "0 1px" }}>{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>
    );
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setOpen((p) => !p)}
        style={{ ...inp(c), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none", color: selectedLabel ? c.textPrimary : c.textMuted, borderColor: open ? c.accent : c.inputBorder, borderRadius: open ? "4px 4px 0 0" : 4 }}
      >
        <span style={{ fontSize: 14, fontFamily: FF, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {loading ? "Loading courses…" : (selectedLabel ?? placeholder)}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {value && !loading && <span onClick={clearValue} style={{ display: "flex", alignItems: "center", color: c.textSub, cursor: "pointer" }}><X size={13} /></span>}
          <ChevronDown size={15} color={c.textSub} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </div>
      </div>

      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 99999, background: c.cardBg, border: `1px solid ${c.accent}`, borderTop: "none", borderRadius: "0 0 4px 4px", boxShadow: "0 6px 24px rgba(0,0,0,0.35)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${c.divider}`, background: c.zeroBg }}>
            <Search size={14} color={c.textSub} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim() && !exactMatch) useCustom();
                if (e.key === "Escape") { setOpen(false); setQuery(""); }
              }}
              placeholder="Search courses…"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: c.textPrimary, fontSize: 14, fontFamily: FF }}
            />
          </div>

          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {loading && (
              <div style={{ padding: "12px 14px", fontSize: 13, color: c.textSub, fontFamily: FF, textAlign: "center" }}>
                Loading your courses…
              </div>
            )}

            {!loading && query.trim() && !exactMatch && (
              <div
                onClick={useCustom}
                style={{ padding: "10px 14px", fontSize: 13, fontFamily: FF, cursor: "pointer", color: c.accent, fontWeight: 500, background: c.accentLight, borderBottom: `1px solid ${c.divider}` }}
                onMouseEnter={e => e.currentTarget.style.background = c.accentBg}
                onMouseLeave={e => e.currentTarget.style.background = c.accentLight}
              >
                + Use &quot;{query.trim()}&quot;
              </div>
            )}

            {!loading && filtered.map((opt) => {
              const isSel = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => select(opt.value)}
                  style={{ padding: "10px 14px", fontSize: 14, fontFamily: FF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: isSel ? c.accent : c.textPrimary, background: isSel ? c.accentBg : "transparent", fontWeight: isSel ? 500 : 400 }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isSel ? c.accentBg : "transparent"; }}
                >
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hl(opt.label, q)}</div>
                    {opt.subtitle && <div style={{ fontSize: 11, color: c.textMuted, fontFamily: FF, marginTop: 2 }}>{opt.subtitle}</div>}
                  </div>
                  {isSel && <Check size={14} color={c.accent} />}
                </div>
              );
            })}

            {!loading && filtered.length === 0 && (
              <div style={{ padding: "10px 14px", fontSize: 13, color: c.textSub, fontFamily: FF, textAlign: "center" }}>
                {query.trim() ? "Not found — press Enter to use custom" : "No courses found"}
              </div>
            )}
          </div>

          {onAdd && (
            <div
              onClick={() => { setOpen(false); setQuery(""); onAdd(); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 14px", fontSize: 13, fontFamily: FF, cursor: "pointer", color: c.accent, borderTop: `1px solid ${c.divider}`, fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.background = c.accentLight}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Plus size={14} />Add New Course
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────── TAB CONFIG ─────────────────── */
const TABS = [
  { key: "upload-video",      label: "Upload Video",      icon: Video },
  { key: "upload-document",   label: "Upload Document",   icon: FileText },
  { key: "create-quiz",       label: "Create Quiz",       icon: ClipboardEdit },
  { key: "create-assignment", label: "Create Assignment", icon: BookOpen },
];

/* ─────────────────── VIDEO UPLOAD ZONE ─────────────────── */
const VideoUploadZone = ({ file, setFile, setTitle, videoUrl, setVideoUrl, videoType, setVideoType, c }) => {
  const [dragging,  setDragging]  = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done,      setDone]      = useState(false);
  const fileRef = useRef();

  const runProgress = () => {
    setUploading(true); setDone(false); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + Math.floor(Math.random() * 12) + 3, 100);
      setProgress(p);
      if (p >= 100) { clearInterval(iv); setUploading(false); setDone(true); }
    }, 180);
  };

  const exTitle = (name) =>
    name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("video/")) return;
    setFile(f);
    setTitle(exTitle(f.name));
    runProgress();
  };

  const tabS = (active) => ({
    padding: "8px 16px", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 13,
    fontWeight: active ? 500 : 400, background: "transparent",
    color: active ? c.accent : c.textSub,
    borderBottom: active ? `2px solid ${c.accent}` : "2px solid transparent",
    marginBottom: -1,
  });

  // Detect if a URL has been entered for preview
  const parsedUrl = videoType === "url" ? parseVideoUrl(videoUrl) : null;
  const showUrlPreview = parsedUrl && videoUrl.trim().length > 10;

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", borderBottom: `1px solid ${c.divider}`, marginBottom: 16 }}>
        <button onClick={() => setVideoType("upload")} style={tabS(videoType === "upload")}>
          <UploadCloud size={13} style={{ marginRight: 5 }} />Upload File
        </button>
        <button onClick={() => setVideoType("url")} style={tabS(videoType === "url")}>
          <Link size={13} style={{ marginRight: 5 }} />Video URL
        </button>
      </div>

      {videoType === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
          style={{ border: `2px dashed ${dragging ? c.accent : c.inputBorder}`, borderRadius: 4, background: dragging ? c.accentLight : c.zeroBg, cursor: "pointer", transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 200, padding: 24 }}
        >
          {!file ? (
            <>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: c.hoverBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UploadCloud size={32} color={c.textMuted} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 400, color: c.textPrimary, fontFamily: FF, marginBottom: 6 }}>Drag and drop video files to upload</div>
                <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginBottom: 16 }}>Your videos will be private until you publish them.</div>
                <button style={dkBtn(c)} onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>Select files</button>
              </div>
            </>
          ) : (
            <>
              <video src={URL.createObjectURL(file)} style={{ width: "100%", borderRadius: 4, maxHeight: 150, objectFit: "contain", background: "#000" }} controls />
              <div style={{ fontSize: 13, color: c.successColor, fontWeight: 500, fontFamily: FF }}>✓ {file.name}</div>
            </>
          )}
          <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        /* ── URL INPUT TAB ── */
        <div>
          <label style={lbl(c)}>YouTube / Vimeo / Direct MP4 URL</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            style={inp(c)}
            onFocus={e => e.target.style.borderColor = c.accent}
            onBlur={e => e.target.style.borderColor = c.inputBorder}
          />

          {/* Live preview of the URL video */}
          {showUrlPreview && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Check size={12} color={c.successColor} />
                <span style={{ color: c.successColor, fontWeight: 500 }}>
                  {parsedUrl.type === "iframe" ? "YouTube/Vimeo embed detected — preview below" : "Direct video URL detected"}
                </span>
              </div>
              <div style={{ borderRadius: 6, overflow: "hidden", border: `1px solid ${c.cardBorder}`, background: "#000" }}>
                <VideoPreviewPlayer videoUrl={videoUrl} style={{ maxHeight: 260, borderRadius: 0 }} />
              </div>
            </div>
          )}

          {/* Helper text for unsupported/short URLs */}
          {videoUrl.trim().length > 0 && videoUrl.trim().length <= 10 && (
            <div style={{ fontSize: 12, color: c.textMuted, marginTop: 6, fontFamily: FF }}>
              Paste a full YouTube, Vimeo, or direct .mp4 URL
            </div>
          )}
        </div>
      )}

      {/* Upload progress bar (file uploads only) */}
      {(uploading || done) && file && (
        <div style={{ marginTop: 12, background: c.zeroBg, border: `1px solid ${c.cardBorder}`, borderRadius: 4, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>{file.name}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: c.accent, fontFamily: FF }}>{progress}%</span>
          </div>
          <div style={{ height: 3, background: c.divider, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: c.accent, borderRadius: 10, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: c.textSub, marginTop: 6, fontFamily: FF }}>
            {done ? "✓ Upload complete" : progress < 40 ? "Checking 0%... 10 minutes left" : progress < 80 ? "Processing..." : "Almost done..."}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────── TAG INPUT ─────────────────── */
const TagInput = ({ tags, setTags, c }) => {
  const [val, setVal] = useState("");
  const addTag = (e) => {
    if (e.key !== "Enter") return;
    const v = val.trim();
    if (!v || tags.includes(v)) { setVal(""); return; }
    setTags((p) => [...p, v]);
    setVal("");
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "7px 11px", border: `1px solid ${c.inputBorder}`, borderRadius: 4, background: c.inputBg, minHeight: 42 }}>
      {tags.map((tag) => (
        <div key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 3, background: c.accentBg, color: c.accent, fontSize: 12, fontWeight: 500, fontFamily: FF }}>
          {tag}<X size={10} style={{ cursor: "pointer" }} onClick={() => setTags((p) => p.filter((tg) => tg !== tag))} />
        </div>
      ))}
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={addTag}
        placeholder={tags.length === 0 ? "Add tag, press Enter..." : ""}
        style={{ border: "none", outline: "none", background: "transparent", color: c.textPrimary, fontSize: 13, minWidth: 100, flex: 1, fontFamily: FF }}
      />
    </div>
  );
};

/* ─────────────────── AUDIENCE CARD ─────────────────── */
const AudienceCard = ({ value, selected, onChange, title, desc, c }) => (
  <label
    onClick={() => onChange(value)}
    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 15px", borderRadius: 4, cursor: "pointer", border: selected ? `2px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: selected ? c.accentLight : c.inputBg }}
  >
    <input type="radio" checked={selected} readOnly style={{ marginTop: 2, accentColor: c.accent }} />
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FF, color: c.textPrimary }}>{title}</div>
      <div style={{ fontSize: 13, fontFamily: FF, marginTop: 2, color: c.textSub }}>{desc}</div>
    </div>
  </label>
);

/* ─────────────────── VISIBILITY CARD ─────────────────── */
const VisCard = ({ value, selected, onChange, icon: Icon, title, desc, c }) => (
  <label
    onClick={() => onChange(value)}
    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 4, cursor: "pointer", border: selected ? `2px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: selected ? c.accentLight : c.inputBg }}
  >
    <input type="radio" checked={selected} readOnly style={{ accentColor: c.accent }} />
    <Icon size={18} color={selected ? c.accent : c.textSub} />
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FF, color: c.textPrimary }}>{title}</div>
      <div style={{ fontSize: 13, fontFamily: FF, color: c.textSub }}>{desc}</div>
    </div>
  </label>
);

/* ─────────────────── COURSE CHIP ─────────────────── */
const CourseChip = ({ label, c }) => {
  const [active, setActive] = useState(false);
  return (
    <div
      onClick={() => setActive((p) => !p)}
      style={{ padding: "5px 11px", borderRadius: 3, cursor: "pointer", border: active ? `1.5px solid ${c.accent}` : `1px solid ${c.inputBorder}`, background: active ? c.accentBg : c.zeroBg, color: active ? c.accent : c.textSub, fontSize: 12, fontWeight: active ? 500 : 400, fontFamily: FF, display: "inline-flex", alignItems: "center", gap: 5 }}
    >
      {active && <Check size={10} />}{label}
    </div>
  );
};

/* ─────────────────── SECTION TITLE ─────────────────── */
const SecTitle = ({ title, subtitle, c }) => (
  <div style={{ marginBottom: 18 }}>
    <h3 style={{ fontSize: 16, fontWeight: 600, color: c.textPrimary, fontFamily: FF, margin: "0 0 4px" }}>{title}</h3>
    {subtitle && <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, margin: 0 }}>{subtitle}</p>}
  </div>
);

const Divider = ({ c }) => <div style={{ height: 1, background: c.divider, margin: "22px 0" }} />;

/* ─────────────────── CONSTANTS ─────────────────── */
const CATEGORIES = ["Education", "Technology", "Programming", "Design", "Data Science", "Business", "Mathematics"];
const LANGUAGES  = ["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"];

/* ─────────────────── STEP 1: DETAILS ─────────────────── */
const StepDetails = ({
  file, setFile, title, setTitle,
  videoUrl, setVideoUrl, videoType, setVideoType,
  shortDesc, setShortDesc,
  batchId, setBatchId, batchOptions,
  tags, setTags,
  category, setCategory,
  language, setLanguage,
  course, setCourse,
  courseOptions, coursesLoading,
  audience, setAudience,
  ageRestrict, setAgeRestrict,
  setShowCourseModal,
  c,
}) => (
  <div style={{ display: "flex", gap: 32 }}>
    {/* ── LEFT: main form ── */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <SecTitle title="Details" c={c} />

      {/* Video upload zone */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl(c)}>Video Upload</label>
        <VideoUploadZone
          file={file} setFile={setFile} setTitle={setTitle}
          videoUrl={videoUrl} setVideoUrl={setVideoUrl}
          videoType={videoType} setVideoType={setVideoType}
          c={c}
        />
      </div>

      <Divider c={c} />

      {/* Title */}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl(c)}>Title (required)</label>
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a title that describes your video"
          style={inp(c)}
          onFocus={e => e.target.style.borderColor = c.accent}
          onBlur={e => e.target.style.borderColor = c.inputBorder}
        />
        <div style={{ fontSize: 11, color: c.textMuted, textAlign: "right", marginTop: 4, fontFamily: FF }}>{title.length}/100</div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl(c)}>Description</label>
        <textarea
          rows={4} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)}
          placeholder="Tell viewers about your video"
          style={{ ...inp(c), resize: "vertical" }}
          onFocus={e => e.target.style.borderColor = c.accent}
          onBlur={e => e.target.style.borderColor = c.inputBorder}
        />
      </div>

      {/* Category + Language */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={lbl(c)}>Category</label>
          <CustomSelect value={category} onChange={setCategory} options={CATEGORIES} placeholder="Select Category" c={c} />
        </div>
        <div>
          <label style={lbl(c)}>Language</label>
          <CustomSelect value={language} onChange={setLanguage} options={LANGUAGES} c={c} />
        </div>
      </div>

      {/* Batch + Tags */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={lbl(c)}>Select Batch</label>
          <CustomSelect value={batchId} onChange={setBatchId} options={batchOptions} placeholder="Select Batch" c={c} />
        </div>
        <div>
          <label style={lbl(c)}>Tags</label>
          <TagInput tags={tags} setTags={setTags} c={c} />
        </div>
      </div>

      <Divider c={c} />

      {/* Course / Playlist */}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl(c)}>Course / Playlist</label>
        <SearchableSelect
          value={course}
          onChange={setCourse}
          options={courseOptions}
          placeholder="Map to a course…"
          onAdd={() => setShowCourseModal(true)}
          loading={coursesLoading}
          c={c}
        />
      </div>

      {/* Also Add To chips */}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl(c)}>Also Add To (multi-select)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
          {courseOptions.length === 0 && !coursesLoading && (
            <span style={{ fontSize: 12, color: c.textMuted, fontFamily: FF }}>No courses found</span>
          )}
          {coursesLoading && (
            <span style={{ fontSize: 12, color: c.textMuted, fontFamily: FF }}>Loading…</span>
          )}
          {courseOptions.map((cr) => <CourseChip key={cr.value} label={cr.label} c={c} />)}
        </div>
      </div>

      <Divider c={c} />

      {/* Audience */}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl(c)}>Audience</label>
        <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginBottom: 10, marginTop: 0 }}>
          Is this video made for kids? (required)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AudienceCard value="kids"     selected={audience === "kids"}     onChange={setAudience} title="Yes, it's made for kids"    desc="Appropriate for children" c={c} />
          <AudienceCard value="not-kids" selected={audience === "not-kids"} onChange={setAudience} title="No, it's not made for kids" desc="General audience content"  c={c} />
        </div>
      </div>

      {/* Age restriction toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 15px", border: `1px solid ${c.inputBorder}`, borderRadius: 4, background: c.zeroBg }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>Age Restriction (18+)</div>
          <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF, marginTop: 2 }}>Restrict to adults only</div>
        </div>
        <div
          onClick={() => setAgeRestrict((p) => !p)}
          style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0, backgroundColor: ageRestrict ? c.accent : c.toggleOff }}
        >
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: ageRestrict ? 22 : 2, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
        </div>
      </div>
    </div>

    {/* ── RIGHT: sticky preview sidebar ── */}
    <div style={{ width: 230, flexShrink: 0 }}>
      <div style={{ position: "sticky", top: 16 }}>
        {/* Preview player — handles file, YouTube, Vimeo, direct MP4 */}
        <div style={{ borderRadius: 4, overflow: "hidden", marginBottom: 12, background: "#000", aspectRatio: "16/9" }}>
          <VideoPreviewPlayer
            file={file}
            videoUrl={videoType === "url" ? videoUrl : ""}
            style={{ borderRadius: 0 }}
          />
        </div>

        {(file || videoUrl) && (
          <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF, marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: c.textPrimary, marginBottom: 3, fontSize: 12 }}>
              {videoType === "url" ? "Video URL" : "Video link"}
            </div>
            <div style={{ color: c.accent, wordBreak: "break-all", cursor: "pointer", fontSize: 11 }}>
              {videoType === "url" ? (videoUrl || "Enter URL above") : "Upload to get link"}
            </div>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${c.divider}`, paddingTop: 10 }}>
          <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF, marginBottom: 5 }}>
            <span style={{ fontWeight: 600, color: c.textPrimary }}>
              {videoType === "url" ? "Source: " : "Filename: "}
            </span>
            {videoType === "url"
              ? (videoUrl ? "URL" : "—")
              : (file?.name ?? "—")
            }
          </div>
          <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>
            <span style={{ fontWeight: 600, color: c.textPrimary }}>Size: </span>
            {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : videoType === "url" && videoUrl ? "External" : "—"}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────── STEP 2: VIDEO ELEMENTS ─────────────────── */
const StepElements = ({ c }) => {
  const [modal,     setModal]     = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [endScreen, setEndScreen] = useState(null);
  const [cards,     setCards]     = useState([]);

  const ELEMS = [
    { key: "subtitle",  label: "Add subtitles",     sub: "Help more people discover your video by adding subtitles in more languages.", Icon: FileText, badge: subtitles.length > 0 ? `${subtitles.length} added` : null },
    { key: "endscreen", label: "Add an end screen", sub: "Promote relevant content at the end of your video.", Icon: Video, badge: endScreen ? "1 template" : null },
    { key: "cards",     label: "Add cards",         sub: "Promote related content during your video.", Icon: Link, badge: cards.length > 0 ? `${cards.length} card${cards.length > 1 ? "s" : ""}` : null },
  ];

  return (
    <>
      {modal === "subtitle"  && <SubtitleModal  onClose={() => setModal(null)} onSave={(d) => setSubtitles((p) => [...p, d])} c={c} />}
      {modal === "endscreen" && <EndScreenModal onClose={() => setModal(null)} onSave={(d) => setEndScreen(d)} c={c} />}
      {modal === "cards"     && <CardsModal     onClose={() => setModal(null)} onSave={(d) => setCards((p) => [...p, d])} c={c} />}

      <SecTitle title="Video elements" subtitle="Add subtitles and end screen elements to enhance your lecture" c={c} />

      <div style={{ border: `1px solid ${c.cardBorder}`, borderRadius: 4, overflow: "hidden" }}>
        {ELEMS.map(({ key, label, sub, Icon, badge }, i) => (
          <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: i < ELEMS.length - 1 ? `1px solid ${c.divider}` : "none", background: c.cardBg }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 38, height: 38, background: c.zeroBg, border: `1px solid ${c.divider}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} color={c.textSub} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: c.textPrimary, fontFamily: FF }}>{label}</div>
                  {badge && <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 7px", borderRadius: 3, background: c.accentBg, color: c.accent, fontFamily: FF }}>✓ {badge}</span>}
                </div>
                <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF, maxWidth: 380 }}>{sub}</div>
              </div>
            </div>
            <button
              onClick={() => setModal(key)}
              style={{ ...oBtn(c), whiteSpace: "nowrap", flexShrink: 0, color: c.accent }}
              onMouseEnter={e => e.currentTarget.style.background = c.accentLight}
              onMouseLeave={e => e.currentTarget.style.background = c.cardBg}
            >
              + Add
            </button>
          </div>
        ))}
      </div>

      {(subtitles.length > 0 || endScreen || cards.length > 0) && (
        <div style={{ marginTop: 16, padding: "14px 18px", background: c.zeroBg, borderRadius: 4, border: `1px solid ${c.cardBorder}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: c.textSub, fontFamily: FF, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>Added Elements</div>
          {subtitles.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 13, color: c.textPrimary, fontFamily: FF }}>📄 Subtitle ({s.lang}){s.file ? ` — ${s.file.name}` : ""}</span>
              <X size={13} color={c.textSub} style={{ cursor: "pointer" }} onClick={() => setSubtitles((p) => p.filter((_, j) => j !== i))} />
            </div>
          ))}
          {endScreen && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 13, color: c.textPrimary, fontFamily: FF }}>🖥️ End screen — {endScreen}</span>
              <X size={13} color={c.textSub} style={{ cursor: "pointer" }} onClick={() => setEndScreen(null)} />
            </div>
          )}
          {cards.map((card, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 13, color: c.textPrimary, fontFamily: FF }}>🔗 {card.type === "video" ? "Video" : "Link"} card — {card.label || card.url}</span>
              <X size={13} color={c.textSub} style={{ cursor: "pointer" }} onClick={() => setCards((p) => p.filter((_, j) => j !== i))} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ─────────────────── STEP 3: CHECKS ─────────────────── */
const StepChecks = ({ c }) => (
  <div>
    <SecTitle title="Checks" subtitle="We check for issues that might impact your ability to monetize or distribute this video." c={c} />
    <div style={{ border: `1px solid ${c.cardBorder}`, borderRadius: 4, overflow: "hidden" }}>
      {[
        { label: "Copyright check",       status: "No issues found" },
        { label: "Ad suitability",        status: "Suitable for most advertisers" },
        { label: "Community Guidelines",  status: "No violations detected" },
      ].map((item, i, arr) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: i < arr.length - 1 ? `1px solid ${c.divider}` : "none", background: c.cardBg }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: c.textPrimary, fontFamily: FF, marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: c.textSub, fontFamily: FF }}>{item.status}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: c.successColor, fontSize: 13, fontWeight: 500, fontFamily: FF }}>
            <Check size={15} color={c.successColor} strokeWidth={2.5} />No issues
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────── STEP 4: VISIBILITY ─────────────────── */
const StepVisibility = ({ visibility, setVisibility, c }) => (
  <div>
    <SecTitle title="Visibility" subtitle="Choose when to publish and who can see your video" c={c} />
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <VisCard value="public"   selected={visibility === "public"}   onChange={setVisibility} icon={Globe} title="Public"   desc="Everyone can watch your video" c={c} />
      <VisCard value="unlisted" selected={visibility === "unlisted"} onChange={setVisibility} icon={Eye}   title="Unlisted" desc="Anyone with the video link can watch your video" c={c} />
      <VisCard value="private"  selected={visibility === "private"}  onChange={setVisibility} icon={Lock}  title="Private"  desc="Only enrolled batch students can view" c={c} />
    </div>
  </div>
);

/* ─────────────────── ADD COURSE FORM ─────────────────── */
const AddCourseForm = ({ onSave, onClose, c }) => {
  const [name, setName] = useState("");
  return (
    <div>
      <label style={lbl(c)}>Course Name</label>
      <input
        type="text" value={name} onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onSave(name.trim()); }}
        placeholder="e.g. Advanced React Patterns"
        style={{ ...inp(c), marginBottom: 16 }}
        autoFocus
        onFocus={e => e.target.style.borderColor = c.accent}
        onBlur={e => e.target.style.borderColor = c.inputBorder}
      />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={oBtn(c)}>Cancel</button>
        <button
          disabled={!name.trim()}
          onClick={() => name.trim() && onSave(name.trim())}
          style={{ ...pBtn(), opacity: name.trim() ? 1 : 0.5, cursor: name.trim() ? "pointer" : "not-allowed" }}
        >
          Add Course
        </button>
      </div>
    </div>
  );
};

/* ─────────────────── MAIN UPLOAD PANEL ─────────────────── */
const UploadVideoPanel = ({ t, isDark }) => {
  const c = getColors(isDark);

  const [showCourseModal, setShowCourseModal] = useState(false);

  const [file,        setFile]        = useState(null);
  const [title,       setTitle]       = useState("");
  const [shortDesc,   setShortDesc]   = useState("");
  const [batchId,     setBatchId]     = useState("");
  const [videoType,   setVideoType]   = useState("upload");
  const [videoUrl,    setVideoUrl]    = useState("");
  const [tags,        setTags]        = useState([]);
  const [audience,    setAudience]    = useState("not-kids");
  const [ageRestrict, setAgeRestrict] = useState(false);
  const [visibility,  setVisibility]  = useState("public");
  const [category,    setCategory]    = useState("");
  const [language,    setLanguage]    = useState("English");
  const [course,      setCourse]      = useState("");

  const [activeStep,  setActiveStep]  = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [message,     setMessage]     = useState("");
  const [draftMsg,    setDraftMsg]    = useState("");
  const [refreshKey,  setRefreshKey]  = useState(0);

  const [batches,     setBatches]     = useState([]);
  const [courseOptions,  setCourseOptions]  = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await videoService.getTrainerBatches();
        setBatches(res.data || []);
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setCoursesLoading(true);
      try {
        const res = await courseService.getMyCourses();
        const raw = res.data || [];
        setCourseOptions(
          raw.map((c) => ({
            value:    String(c.id),
            label:    c.title ?? c.name ?? `Course ${c.id}`,
            subtitle: c.category ?? "",
          }))
        );
      } catch (err) {
        console.error("Failed to load courses", err);
        setCourseOptions([]);
      } finally {
        setCoursesLoading(false);
      }
    })();
  }, []);

  const batchOptions = batches.map((b) => ({
    value: String(b.id),
    label: `${b.name || "Batch"} (ID: ${b.id})`,
  }));

  const handlePublish = async () => {
    if (videoType === "upload" && !file)           { setMessage("❌ Select a video file"); return; }
    if (videoType === "url"    && !videoUrl.trim()) { setMessage("❌ Enter a video URL"); return; }
    if (!title.trim() || !batchId)                 { setMessage("❌ Title & batch are required"); return; }

    const meta = { tags, category, language, visibility, audience, ageRestrict, course };

    try {
      setLoading(true); setMessage("");
      if (videoType === "upload") {
        await videoService.uploadVideo(file, title, shortDesc, batchId, meta);
      } else {
        // Pass the embed-converted URL to the service so it's stored correctly
        const parsed = parseVideoUrl(videoUrl);
        await videoService.uploadVideoUrl(
          parsed ? parsed.url : videoUrl,
          title, shortDesc, batchId,
          { ...meta, videoSourceType: parsed?.type ?? "video", originalUrl: videoUrl }
        );
      }
      setMessage("✅ Lecture published successfully!");
      setRefreshKey((p) => p + 1);
      setFile(null); setTitle(""); setShortDesc(""); setBatchId("");
      setVideoUrl(""); setTags([]); setCategory(""); setCourse("");
      setAgeRestrict(false); setVisibility("public"); setAudience("not-kids");
      setActiveStep(1);
    } catch {
      setMessage("❌ Upload failed (check batch assignment)");
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = () => {
    setDraftMsg("✓ Draft saved");
    setTimeout(() => setDraftMsg(""), 3000);
  };

  return (
    <>
      {showCourseModal && (
        <Modal title="Add New Course" onClose={() => setShowCourseModal(false)} c={c}>
          <p style={{ fontSize: 13, color: c.textSub, fontFamily: FF, margin: "0 0 14px" }}>
            Enter a name for the new course.
          </p>
          <AddCourseForm
            onSave={(newName) => {
              const newOpt = { value: newName, label: newName, subtitle: "" };
              setCourseOptions((prev) => [...prev, newOpt]);
              setCourse(newName);
              setShowCourseModal(false);
            }}
            onClose={() => setShowCourseModal(false)}
            c={c}
          />
        </Modal>
      )}

      {/* Step header */}
      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 6, padding: "18px 28px 14px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: c.textPrimary, fontFamily: FF }}>
            {file ? (title || file.name) : videoUrl ? (title || "Video URL") : "Publish Lecture"}
          </div>
          <div style={{ fontSize: 12, color: c.textSub, fontFamily: FF }}>
            {(file || videoUrl) ? "Saved as private" : "Not saved"}
          </div>
        </div>
        <StepProgressBar activeStep={activeStep} setActiveStep={setActiveStep} c={c} />
      </div>

      {/* Step content */}
      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 6, padding: 28, marginBottom: 14 }}>
        {activeStep === 1 && (
          <StepDetails
            file={file} setFile={setFile}
            title={title} setTitle={setTitle}
            videoUrl={videoUrl} setVideoUrl={setVideoUrl}
            videoType={videoType} setVideoType={setVideoType}
            shortDesc={shortDesc} setShortDesc={setShortDesc}
            batchId={batchId} setBatchId={setBatchId} batchOptions={batchOptions}
            tags={tags} setTags={setTags}
            category={category} setCategory={setCategory}
            language={language} setLanguage={setLanguage}
            course={course} setCourse={setCourse}
            courseOptions={courseOptions} coursesLoading={coursesLoading}
            audience={audience} setAudience={setAudience}
            ageRestrict={ageRestrict} setAgeRestrict={setAgeRestrict}
            setShowCourseModal={setShowCourseModal}
            c={c}
          />
        )}
        {activeStep === 2 && <StepElements c={c} />}
        {activeStep === 3 && <StepChecks c={c} />}
        {activeStep === 4 && <StepVisibility visibility={visibility} setVisibility={setVisibility} c={c} />}
      </div>

      {/* Bottom action bar */}
      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 6, padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, fontFamily: FF, color: draftMsg ? c.successColor : message.startsWith("✅") ? c.successColor : c.errorColor }}>
          {draftMsg || message}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {activeStep > 1 && (
            <button onClick={() => setActiveStep((p) => p - 1)} style={oBtn(c)}>Back</button>
          )}
          <button onClick={handleDraft} style={{ ...oBtn(c), display: "flex", alignItems: "center", gap: 6 }}>
            <Save size={13} />Save Draft
          </button>
          {activeStep < 4
            ? <button onClick={() => setActiveStep((p) => p + 1)} style={{ ...pBtn(), display: "flex", alignItems: "center", gap: 6 }}>Next</button>
            : <button onClick={handlePublish} disabled={loading} style={{ ...pBtn(), display: "flex", alignItems: "center", gap: 6, opacity: loading ? 0.6 : 1 }}>
                <Send size={13} />{loading ? "Publishing..." : "Publish"}
              </button>
          }
        </div>
      </div>

      {/* Video list below */}
      <div style={{ marginTop: 18 }}>
        <VideoList refreshKey={refreshKey} trainerMode={true} />
      </div>
    </>
  );
};

/* ─────────────────── TAB BAR ─────────────────── */
const TabBar = ({ activeTab, setActiveTab, c }) => (
  <div style={{ display: "flex", borderBottom: `1px solid ${c.divider}`, marginBottom: 18 }}>
    {TABS.map(({ key, label, icon: Icon }) => {
      const isActive = activeTab === key;
      return (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 18px", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 13, fontWeight: isActive ? 600 : 400, background: "transparent", color: isActive ? c.accent : c.textSub, borderBottom: isActive ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1, transition: "all .15s" }}
        >
          <Icon size={15} />{label}
        </button>
      );
    })}
  </div>
);

/* ─────────────────── MAIN PAGE ─────────────────── */
const UploadVideos = () => {
  const { t, isDark } = useTrainerTheme();
  const c = getColors(isDark);
  const [activeTab, setActiveTab] = useState("upload-video");

  const heroMeta = ({
    "upload-video":      { title: "Publish New Lecture",   subtitle: "Upload recorded lectures for students.",            icon: Video,        color: "#065fd4" },
    "upload-document":   { title: "Upload Documents",      subtitle: "Share study material and resources with students.", icon: FileText,      color: "#065fd4" },
    "create-quiz":       { title: "Create Quiz",           subtitle: "Build interactive quizzes for your batch.",         icon: ClipboardEdit, color: "#065fd4" },
    "create-assignment": { title: "Create Assignment",     subtitle: "Set assignments and track submissions.",            icon: BookOpen,      color: "#065fd4" },
  })[activeTab] || { title: "Trainer Studio", subtitle: "", icon: Video, color: "#065fd4" };

  const renderPanel = () => {
    switch (activeTab) {
      case "upload-video":      return <UploadVideoPanel t={t} isDark={isDark} />;
      case "upload-document":   return <UploadDocuments />;
      case "create-quiz":       return <CreateQuiz />;
      case "create-assignment": return <CreateAssignments />;
      default:                  return null;
    }
  };

  return (
    <PageShell t={t}>
      <PageHero t={t} isDark={isDark} icon={heroMeta.icon} badge="Trainer Studio" title={heroMeta.title} subtitle={heroMeta.subtitle} color={heroMeta.color} />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} c={c} />
      {renderPanel()}
    </PageShell>
  );
};

export default UploadVideos;