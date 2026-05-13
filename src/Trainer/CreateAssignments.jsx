// // src/trainer/CreateAssignments.jsx
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, ChevronRight, FileText, List, Upload, X } from "lucide-react";
// import { createAssignment, uploadAssignmentFile } from "@/services/assessmentService";
// import { getTrainerBatches } from "@/services/batchService";
// import {
//   useTrainerTheme, PageShell, PageHero, ThemedCard,
//   ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
//   PrimaryButton, SecondaryButton,
// } from "./trainerTheme";

// const PANELS = ["basic", "details", "attachments"];

// const CreateAssignments = () => {
//   const navigate = useNavigate();
//   const { t, isDark } = useTrainerTheme();

//   const [batches, setBatches] = useState([]);
//   const [open, setOpen] = useState("basic");
//   const [formData, setFormData] = useState({
//     title: "", description: "", batch: "",
//     deadline: "", maxMarks: "", duration: "", attachments: [],
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await getTrainerBatches();
//         setBatches(res || []);
//       } catch (err) { console.error("Failed to load trainer batches", err); }
//     };
//     loadBatches();
//   }, []);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData((prev) => ({ ...prev, attachments: files }));
//   };

//   const removeFile = (index) => {
//     setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const response = await createAssignment({
//         title: formData.title, description: formData.description,
//         batchId: Number(formData.batch), deadline: formData.deadline,
//         maxMarks: Number(formData.maxMarks), duration: formData.duration,
//       });
//       const assignmentId = response.data.id;
//       if (formData.attachments.length > 0) {
//         for (let file of formData.attachments) {
//           await uploadAssignmentFile(assignmentId, file);
//         }
//       }
//       setShowSuccess(true);
//       setFormData({ title: "", description: "", batch: "", deadline: "", maxMarks: "", duration: "", attachments: [] });
//     } catch (error) {
//       console.error("Assignment creation error:", error);
//       alert("Failed to create assignment.");
//     }
//     setIsSubmitting(false);
//   };

//   const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

//   const completedPanels = {
//     basic: !!(formData.title && formData.description),
//     details: !!(formData.batch && formData.deadline && formData.maxMarks),
//     attachments: false,
//   };

//   const panelMeta = {
//     basic:       { num: 1, label: "Basic Information",    sub: "Title & description",       color: "#7c3aed", next: "details",      nextLabel: "Continue to Details" },
//     details:     { num: 2, label: "Assignment Details",   sub: "Batch, deadline & marks",   color: "#2563eb", next: "attachments",  nextLabel: "Continue to Attachments" },
//     attachments: { num: 3, label: "Attachments & Submit", sub: `${formData.attachments.length} file${formData.attachments.length !== 1 ? "s" : ""} selected`, color: "#34d399", next: null, nextLabel: null },
//   };

//   return (
//     <PageShell t={t}>
      
//       {/* SUCCESS BANNER */}
//       {showSuccess && (
//         <div style={{
//           display: "flex", alignItems: "center", gap: 12,
//           padding: "14px 18px", borderRadius: 14, marginBottom: 16,
//           background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
//         }}>
//           <CheckCircle size={16} color="#34d399" />
//           <p style={{ fontSize: 13, fontWeight: 600, color: "#34d399", margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//             Assignment Created Successfully!
//           </p>
//         </div>
//       )}

//       {/* STEPPER */}
//       <form onSubmit={handleSubmit}>
//         <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 20, overflow: "hidden", border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
//           {PANELS.map((key, idx) => {
//             const meta = panelMeta[key];
//             const isOpen = open === key;
//             const isCompleted = completedPanels[key];
//             const isLast = idx === PANELS.length - 1;

//             return (
//               <div key={key} style={{ borderBottom: !isLast ? `1px solid ${t.border}` : "none" }}>
//                 {/* Header */}
//                 <button
//                   type="button"
//                   onClick={() => toggle(key)}
//                   style={{
//                     width: "100%", display: "flex", alignItems: "center", gap: 12,
//                     padding: "16px 20px", textAlign: "left",
//                     background: isOpen ? `${meta.color}06` : t.cardBg,
//                     border: "none", cursor: "pointer", transition: "background 0.2s",
//                     borderBottom: isOpen ? `1px solid ${t.border}` : "none",
//                   }}
//                 >
//                   <div style={{
//                     width: 32, height: 32, borderRadius: 999,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: isCompleted ? "rgba(52,211,153,0.15)" : isOpen ? `${meta.color}20` : t.inputBg,
//                     border: `1px solid ${isCompleted ? "rgba(52,211,153,0.3)" : isOpen ? `${meta.color}40` : t.inputBorder}`,
//                     flexShrink: 0, transition: "all 0.2s",
//                   }}>
//                     {isCompleted
//                       ? <CheckCircle size={14} color="#34d399" />
//                       : <span style={{ fontSize: 11, fontWeight: 800, color: isOpen ? meta.color : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
//                     }
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: isOpen ? t.text : t.textSub, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
//                     <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
//                   </div>
//                   <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
//                     {PANELS.map((p, pi) => (
//                       <span key={p} style={{
//                         borderRadius: 999, transition: "all 0.3s",
//                         width: p === key ? 18 : 6, height: 6,
//                         background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg,
//                       }} />
//                     ))}
//                   </div>
//                   <ChevronRight size={14} color={t.textMuted} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
//                 </button>

//                 {/* Body */}
//                 {isOpen && (
//                   <div style={{ background: t.cardBg, padding: "20px 20px 24px" }}>
//                     <div style={{ display: "flex", gap: 16 }}>
//                       <div style={{ width: 1, background: `${meta.color}30`, borderRadius: 999, flexShrink: 0 }} />
//                       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

//                         {/* PANEL 1 */}
//                         {key === "basic" && (
//                           <>
//                             <div>
//                               <FieldLabel t={t}>Assignment Title</FieldLabel>
//                               <ThemedInput t={t} placeholder="e.g. React Hooks Assignment" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
//                             </div>
//                             <div>
//                               <FieldLabel t={t}>Description</FieldLabel>
//                               <ThemedTextarea t={t} rows={3} placeholder="Describe the assignment task..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
//                             </div>
//                             <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                               <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("details")}>
//                                 {meta.nextLabel} <ChevronRight size={13} />
//                               </PrimaryButton>
//                             </div>
//                           </>
//                         )}

//                         {/* PANEL 2 */}
//                         {key === "details" && (
//                           <>
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                               <div>
//                                 <FieldLabel t={t}>Select Batch</FieldLabel>
//                                 <ThemedSelect t={t} value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required>
//                                   <option value="">Select Batch</option>
//                                   {batches.map((b) => (<option key={b.id} value={b.id}>Batch {b.id}</option>))}
//                                 </ThemedSelect>
//                               </div>
//                               <div>
//                                 <FieldLabel t={t}>Deadline</FieldLabel>
//                                 <ThemedInput t={t} type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
//                               </div>
//                               <div>
//                                 <FieldLabel t={t}>Maximum Marks</FieldLabel>
//                                 <ThemedInput t={t} type="number" placeholder="e.g. 100" value={formData.maxMarks} onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })} required />
//                               </div>
//                               <div>
//                                 <FieldLabel t={t}>Duration (optional)</FieldLabel>
//                                 <ThemedInput t={t} placeholder="e.g. 2 hours" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
//                               </div>
//                             </div>
//                             <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                               <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("attachments")}>
//                                 {meta.nextLabel} <ChevronRight size={13} />
//                               </PrimaryButton>
//                             </div>
//                           </>
//                         )}

//                         {/* PANEL 3 */}
//                         {key === "attachments" && (
//                           <>
//                             <label style={{ cursor: "pointer" }}>
//                               <div style={{
//                                 borderRadius: 16, border: `2px dashed ${t.inputBorder}`,
//                                 padding: "32px 24px", textAlign: "center", background: t.inputBg,
//                                 transition: "all 0.2s",
//                               }}>
//                                 <div style={{
//                                   width: 40, height: 40, borderRadius: 12,
//                                   background: t.actBg, border: `1px solid ${t.border}`,
//                                   display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
//                                 }}>
//                                   <Upload size={16} color={t.textMuted} />
//                                 </div>
//                                 <p style={{ fontSize: 13, fontWeight: 600, color: t.textSub, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif" }}>Click to upload files</p>
//                                 <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>PDF, DOC, DOCX, ZIP, TXT</p>
//                                 <input type="file" multiple onChange={handleFileChange} hidden accept=".pdf,.doc,.docx,.zip,.txt" />
//                               </div>
//                             </label>

//                             {formData.attachments.length > 0 && (
//                               <div style={{ borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden" }}>
//                                 {formData.attachments.map((file, index) => (
//                                   <div key={index} style={{
//                                     display: "flex", alignItems: "center", gap: 10,
//                                     padding: "10px 14px",
//                                     borderBottom: index < formData.attachments.length - 1 ? `1px solid ${t.border}` : "none",
//                                   }}>
//                                     <div style={{
//                                       width: 24, height: 24, borderRadius: 7,
//                                       background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
//                                       display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                                     }}>
//                                       <FileText size={12} color="#7c3aed" />
//                                     </div>
//                                     <span style={{ fontSize: 12, color: t.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins',sans-serif" }}>{file.name}</span>
//                                     <button type="button" onClick={() => removeFile(index)} style={{
//                                       width: 20, height: 20, borderRadius: 999, background: t.actBg,
//                                       border: `1px solid ${t.border}`, display: "flex", alignItems: "center",
//                                       justifyContent: "center", cursor: "pointer", flexShrink: 0,
//                                     }}>
//                                       <X size={10} color={t.textMuted} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                             {/* Summary */}
//                             <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
//                               {[
//                                 { label: "Title",     val: formData.title || "—" },
//                                 { label: "Batch",     val: formData.batch ? `Batch ${formData.batch}` : "—" },
//                                 { label: "Max Marks", val: formData.maxMarks || "—" },
//                               ].map(({ label, val }) => (
//                                 <div key={label} style={{
//                                   background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
//                                   borderRadius: 12, padding: "10px 14px",
//                                 }}>
//                                   <p style={{ fontSize: 9, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
//                                   <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</p>
//                                 </div>
//                               ))}
//                             </div>

//                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                               <button type="button" onClick={() => setOpen("details")} style={{
//                                 display: "flex", alignItems: "center", gap: 4,
//                                 fontSize: 12, color: t.textMuted, background: "none", border: "none",
//                                 cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500,
//                               }}>
//                                 <ChevronRight size={12} style={{ transform: "rotate(180deg)" }} /> Back to Details
//                               </button>
//                               <PrimaryButton color="#7c3aed" type="submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.6 : 1 }}>
//                                 {isSubmitting ? (
//                                   <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Creating…</>
//                                 ) : (
//                                   <><CheckCircle size={14} /> Create Assignment</>
//                                 )}
//                               </PrimaryButton>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </form>
//     </PageShell>
//   );
// };

// export default CreateAssignments;



































// src/trainer/CreateAssignments.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, ChevronRight, FileText, Upload, X,
  Bold, Italic, Underline, Strikethrough, Pin,
  AlignLeft, Paperclip, Settings2,
} from "lucide-react";
import { createAssignment, uploadAssignmentFile } from "@/services/assessmentService";
import { getTrainerBatches } from "@/services/batchService";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard,
  ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
  PrimaryButton, SecondaryButton,
} from "./trainerTheme";

/* ─── inject once ─── */
const _STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.ca-panel { transition: all 0.22s cubic-bezier(0.4,0,0.2,1); }

.ca-header {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 18px; cursor: pointer;
  border: none; width: 100%; text-align: left;
  background: transparent; font-family: 'Poppins', sans-serif;
  position: relative; overflow: hidden;
}
.ca-header::before {
  content: '';
  position: absolute; inset: 0;
  background: currentColor;
  opacity: 0; transition: opacity 0.18s;
  pointer-events: none;
}
.ca-header:hover::before { opacity: 0.04; }
.ca-header.open::before  { opacity: 0.03; }

.ca-step-circle {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.22s;
  font-size: 11px; font-weight: 800;
  font-family: 'Poppins', sans-serif;
}

.ca-dot-bar span {
  display: inline-block; height: 4px; border-radius: 999px;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}

.ca-body {
  overflow: hidden;
  animation: ca-slide-in 0.22s cubic-bezier(0.4,0,0.2,1);
}
@keyframes ca-slide-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Rich editor */
.rde-wrap { border-radius: 7px; overflow: hidden; transition: box-shadow 0.2s; }
.rde-wrap:focus-within { box-shadow: 0 0 0 2px rgba(124,58,237,0.18); }
.rde-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 1px; padding: 5px 8px; }
.rde-btn {
  width: 28px; height: 28px; border-radius: 6px; border: none;
  background: transparent; cursor: pointer; display: inline-flex;
  align-items: center; justify-content: center; transition: background 0.12s;
  font-size: 12px; font-weight: 700; font-family: 'Poppins', sans-serif;
  flex-shrink: 0;
}
.rde-btn:hover  { background: rgba(0,0,0,0.07); }
.rde-btn.active { background: rgba(124,58,237,0.13); }
.rde-sep { width: 1px; height: 16px; margin: 0 3px; flex-shrink: 0; }
.rde-swatch {
  width: 18px; height: 18px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent; transition: transform 0.12s, border-color 0.12s;
  flex-shrink: 0;
}
.rde-swatch:hover   { transform: scale(1.2); }
.rde-swatch.sel     { border-color: #7c3aed; transform: scale(1.1); }

/* compact inputs */
.ca-input {
  width: 100%; padding: 8px 11px;
  border-radius: 7px; outline: none;
  font-family: 'Poppins', sans-serif; font-size: 12.5px;
  box-sizing: border-box; transition: border-color 0.18s, box-shadow 0.18s;
}
.ca-input:focus { box-shadow: 0 0 0 2px rgba(124,58,237,0.18); }

/* file row */
.ca-file-row { display: flex; align-items: center; gap: 9px; padding: 8px 12px; transition: background 0.12s; }
.ca-file-row:hover { background: rgba(124,58,237,0.04); }

/* summary card */
.ca-sum-card { border-radius: 9px; padding: 9px 12px; }

/* submit btn */
.ca-submit {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px; border-radius: 8px; border: none;
  font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700;
  cursor: pointer; transition: all 0.18s; letter-spacing: 0.01em;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  color: #fff; box-shadow: 0 4px 14px rgba(124,58,237,0.38);
}
.ca-submit:hover   { box-shadow: 0 6px 20px rgba(124,58,237,0.5); transform: translateY(-1px); }
.ca-submit:active  { transform: translateY(0); }
.ca-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

/* continue btn */
.ca-continue {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px; border: none;
  font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s;
}
.ca-continue:hover { transform: translateX(2px); }

@keyframes ca-spin { to { transform: rotate(360deg); } }
`;

if (!document.getElementById("ca-style-v3")) {
  const s = document.createElement("style");
  s.id = "ca-style-v3";
  s.textContent = _STYLES;
  document.head.appendChild(s);
}

/* ─── text colors ─── */
const TX_COLORS = [
  { label: "Default", v: "default", bg: "transparent", bd: "#bbb" },
  { label: "Red",     v: "#d93025", bg: "#d93025" },
  { label: "Orange",  v: "#e67c00", bg: "#e67c00" },
  { label: "Green",   v: "#188038", bg: "#188038" },
  { label: "Blue",    v: "#1967d2", bg: "#1967d2" },
  { label: "Purple",  v: "#7c3aed", bg: "#7c3aed" },
  { label: "Pink",    v: "#e52592", bg: "#e52592" },
  { label: "Gray",    v: "#6b7280", bg: "#6b7280" },
];

/* ═══ RICH DESCRIPTION EDITOR ═══ */
const RichDescriptionEditor = ({ value, onChange, placeholder, t }) => {
  const [fmt,   setFmt]   = useState({ bold: false, italic: false, underline: false, strike: false, h1: false, h2: false });
  const [txCol, setTxCol] = useState("default");
  const [cpOpen, setCpOpen] = useState(false);
  const cpRef = useRef();

  useEffect(() => {
    const h = (e) => { if (cpRef.current && !cpRef.current.contains(e.target)) setCpOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (k) => setFmt(p => ({ ...p, [k]: !p[k] }));

  const Btn = ({ k, title, children }) => (
    <button type="button" className={`rde-btn${fmt[k] ? " active" : ""}`}
      onClick={() => toggle(k)} title={title}
      style={{ color: fmt[k] ? "#7c3aed" : t.textSub }}>
      {children}
    </button>
  );

  return (
    <div className="rde-wrap" style={{ border: `1px solid ${t.inputBorder}`, background: t.inputBg }}>
      {/* toolbar */}
      <div className="rde-toolbar" style={{ borderBottom: `1px solid ${t.border}` }}>
        <button type="button" className={`rde-btn${fmt.h1?" active":""}`} onClick={() => toggle("h1")} style={{ color: fmt.h1 ? "#7c3aed" : t.textSub }}>
          <span style={{ fontSize: 11, fontWeight: 800 }}>H1</span>
        </button>
        <button type="button" className={`rde-btn${fmt.h2?" active":""}`} onClick={() => toggle("h2")} style={{ color: fmt.h2 ? "#7c3aed" : t.textSub }}>
          <span style={{ fontSize: 11, fontWeight: 800 }}>H2</span>
        </button>
        <button type="button" className="rde-btn" onClick={() => setFmt({ bold:false, italic:false, underline:false, strike:false, h1:false, h2:false })} style={{ color: t.textSub }}>
          <span style={{ fontSize: 11 }}>Aa</span>
        </button>
        <div className="rde-sep" style={{ background: t.border }} />
        <Btn k="bold"      title="Bold"><Bold size={12} strokeWidth={fmt.bold ? 3 : 2} /></Btn>
        <Btn k="italic"    title="Italic"><Italic size={12} /></Btn>
        <Btn k="underline" title="Underline"><Underline size={12} /></Btn>
        <Btn k="strike"    title="Strike"><Strikethrough size={12} /></Btn>
        <div className="rde-sep" style={{ background: t.border }} />
        {/* color */}
        <div style={{ position: "relative" }} ref={cpRef}>
          <button type="button" className="rde-btn" onClick={() => setCpOpen(p => !p)} title="Text color"
            style={{ color: t.textSub }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
              <span style={{ fontSize:12, fontWeight:800, color: txCol!=="default" ? txCol : t.text, lineHeight:1 }}>A</span>
              <div style={{ width:14, height:3, borderRadius:2, background: txCol!=="default" ? txCol : t.textSub }} />
            </div>
          </button>
          {cpOpen && (
            <div style={{ position:"absolute", top:"110%", left:0, zIndex:9999, background: t.cardBg, border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", boxShadow:"0 8px 28px rgba(0,0,0,0.18)", minWidth:220 }}>
              <div style={{ fontSize:10, fontWeight:700, color: t.textMuted, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:8 }}>Color</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {TX_COLORS.map(c => (
                  <div key={c.v} className={`rde-swatch${txCol===c.v?" sel":""}`}
                    style={{ background: c.bg, border: c.bd ? `2px solid ${c.bd}` : txCol===c.v ? "2px solid #7c3aed" : "2px solid transparent", boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.08)" }}
                    onClick={() => { setTxCol(c.v); setCpOpen(false); }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ marginLeft:"auto" }}>
          <button type="button" className="rde-btn" title="Pin" style={{ color: t.textSub }}><Pin size={11} /></button>
        </div>
      </div>
      {/* textarea */}
      <textarea
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:"100%", padding:"9px 12px", border:"none", outline:"none",
          background: t.inputBg, fontFamily:"'Poppins',sans-serif", boxSizing:"border-box",
          resize:"vertical", borderBottomLeftRadius:7, borderBottomRightRadius:7,
          fontSize: fmt.h1 ? 18 : fmt.h2 ? 14 : 12.5,
          fontWeight: fmt.bold ? 700 : 400,
          fontStyle: fmt.italic ? "italic" : "normal",
          textDecoration: fmt.underline ? "underline" : fmt.strike ? "line-through" : "none",
          color: txCol!=="default" ? txCol : t.text,
        }}
      />
    </div>
  );
};

/* ═══ PANEL ICONS ═══ */
const PANEL_ICONS = { basic: AlignLeft, details: Settings2, attachments: Paperclip };
const PANELS = ["basic", "details", "attachments"];

/* ═══ MAIN ═══ */
const CreateAssignments = () => {
  const navigate = useNavigate();
  const { t, isDark } = useTrainerTheme();

  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState("basic");
  const [formData, setFormData] = useState({
    title: "", description: "", batch: "",
    deadline: "", maxMarks: "", duration: "", attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      try { const res = await getTrainerBatches(); setBatches(res || []); }
      catch (err) { console.error("Failed to load trainer batches", err); }
    };
    loadBatches();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, attachments: files }));
  };
  const removeFile = (index) =>
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createAssignment({
        title: formData.title, description: formData.description,
        batchId: Number(formData.batch), deadline: formData.deadline,
        maxMarks: Number(formData.maxMarks), duration: formData.duration,
      });
      const assignmentId = response.data.id;
      if (formData.attachments.length > 0) {
        for (let file of formData.attachments)
          await uploadAssignmentFile(assignmentId, file);
      }
      setShowSuccess(true);
      setFormData({ title:"", description:"", batch:"", deadline:"", maxMarks:"", duration:"", attachments:[] });
    } catch (error) {
      console.error("Assignment creation error:", error);
      alert("Failed to create assignment.");
    }
    setIsSubmitting(false);
  };

  const toggle = (panel) => setOpen(prev => prev === panel ? null : panel);

  const completedPanels = {
    basic:       !!(formData.title && formData.description),
    details:     !!(formData.batch && formData.deadline && formData.maxMarks),
    attachments: false,
  };

  const panelMeta = {
    basic:       { num:1, label:"Basic Information",    sub:"Title & description",      color:"#7c3aed", nextLabel:"Details →" },
    details:     { num:2, label:"Assignment Details",   sub:"Batch, deadline & marks",  color:"#2563eb", nextLabel:"Attachments →" },
    attachments: { num:3, label:"Attachments & Submit", sub:`${formData.attachments.length} file${formData.attachments.length!==1?"s":""} selected`, color:"#059669", nextLabel:null },
  };

  /* compact input style using t tokens */
  const ci = (accentColor) => ({
    width:"100%", padding:"7px 11px",
    border:`1px solid ${t.inputBorder}`,
    borderRadius:7, background: t.inputBg,
    color: t.text, fontFamily:"'Poppins',sans-serif",
    fontSize:12.5, outline:"none", boxSizing:"border-box",
    transition:"border-color 0.18s, box-shadow 0.18s",
  });

  const onFocus = (e, color) => {
    e.target.style.borderColor = color;
    e.target.style.boxShadow = `0 0 0 2px ${color}28`;
  };
  const onBlur = (e) => {
    e.target.style.borderColor = t.inputBorder;
    e.target.style.boxShadow = "none";
  };

  return (
    <PageShell t={t}>

      {/* ── SUCCESS ── */}
      {showSuccess && (
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          padding:"11px 16px", borderRadius:10, marginBottom:14,
          background:"rgba(5,150,105,0.08)", border:"1px solid rgba(5,150,105,0.22)",
        }}>
          <div style={{ width:24, height:24, borderRadius:"50%", background:"rgba(5,150,105,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <CheckCircle size={13} color="#059669" />
          </div>
          <span style={{ fontSize:12.5, fontWeight:600, color:"#059669", fontFamily:"'Poppins',sans-serif" }}>
            Assignment Created Successfully!
          </span>
        </div>
      )}

      {/* ── FORM CARD ── */}
      <form onSubmit={handleSubmit}>
        <div style={{
          borderRadius:14, overflow:"hidden",
          border:`1px solid ${t.border}`,
          boxShadow: isDark
            ? "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.45)"
            : "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06)",
        }}>
          {PANELS.map((key, idx) => {
            const meta      = panelMeta[key];
            const isOpen    = open === key;
            const isDone    = completedPanels[key];
            const isLast    = idx === PANELS.length - 1;
            const PanelIcon = PANEL_ICONS[key];

            /* left accent strip color */
            const stripColor = isDone ? "#059669" : isOpen ? meta.color : "transparent";

            return (
              <div key={key} className="ca-panel"
                style={{ borderBottom: !isLast ? `1px solid ${t.border}` : "none" }}>

                {/* ── HEADER ── */}
                <button
                  type="button"
                  className={`ca-header${isOpen ? " open" : ""}`}
                  onClick={() => toggle(key)}
                  style={{ background: isOpen
                    ? isDark ? `rgba(255,255,255,0.02)` : `${meta.color}05`
                    : t.cardBg,
                    borderBottom: isOpen ? `1px solid ${t.border}` : "none",
                  }}
                >
                  {/* left accent bar */}
                  <div style={{
                    position:"absolute", left:0, top:0, bottom:0, width:3,
                    background: stripColor,
                    borderRadius:"0 2px 2px 0",
                    transition:"background 0.22s",
                  }} />

                  {/* step badge */}
                  <div className="ca-step-circle" style={{
                    marginLeft:8,
                    background: isDone ? "rgba(5,150,105,0.12)" : isOpen ? `${meta.color}18` : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                    border: `1.5px solid ${isDone ? "rgba(5,150,105,0.35)" : isOpen ? `${meta.color}45` : t.inputBorder}`,
                    color: isDone ? "#059669" : isOpen ? meta.color : t.textMuted,
                  }}>
                    {isDone ? <CheckCircle size={13} color="#059669" /> : meta.num}
                  </div>

                  {/* icon */}
                  <div style={{
                    width:32, height:32, borderRadius:8, flexShrink:0,
                    background: isOpen ? `${meta.color}12` : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"background 0.22s",
                  }}>
                    <PanelIcon size={14} color={isOpen ? meta.color : t.textMuted} />
                  </div>

                  {/* label */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color: isOpen ? t.text : t.textSub, fontFamily:"'Poppins',sans-serif", lineHeight:1.2 }}>
                      {meta.label}
                    </div>
                    <div style={{ fontSize:10.5, color: t.textMuted, fontFamily:"'Poppins',sans-serif", marginTop:2 }}>
                      {meta.sub}
                    </div>
                  </div>

                  {/* dot stepper */}
                  <div className="ca-dot-bar" style={{ display:"flex", gap:4, alignItems:"center", marginRight:6 }}>
                    {PANELS.map((p, pi) => (
                      <span key={p} style={{
                        width: p === key ? 16 : 5,
                        height: 4,
                        borderRadius: 999,
                        background: p === key
                          ? meta.color
                          : pi < PANELS.indexOf(key)
                            ? isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"
                            : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                      }} />
                    ))}
                  </div>

                  {/* chevron */}
                  <ChevronRight size={14} color={t.textMuted}
                    style={{ transform: isOpen ? "rotate(90deg)" : "none", transition:"transform 0.22s", flexShrink:0 }} />
                </button>

                {/* ── BODY ── */}
                {isOpen && (
                  <div className="ca-body" style={{ background: t.cardBg, padding:"16px 20px 20px 28px" }}>
                    {/* vertical accent line */}
                    <div style={{ display:"flex", gap:16 }}>
                      <div style={{ width:2, borderRadius:999, flexShrink:0, background:`${meta.color}25`, minHeight:40 }} />
                      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:13 }}>

                        {/* ══ PANEL 1 ══ */}
                        {key === "basic" && (
                          <>
                            <div>
                              <div style={{ fontSize:10.5, fontWeight:700, color: t.textMuted, fontFamily:"'Poppins',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
                                Assignment Title
                              </div>
                              <ThemedInput
                                t={t}
                                placeholder="e.g. React Hooks Assignment"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <div style={{ fontSize:10.5, fontWeight:700, color: t.textMuted, fontFamily:"'Poppins',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
                                Description
                              </div>
                              <RichDescriptionEditor
                                value={formData.description}
                                onChange={val => setFormData({ ...formData, description: val })}
                                placeholder="Describe the assignment task..."
                                t={t}
                              />
                            </div>
                            <div style={{ display:"flex", justifyContent:"flex-end" }}>
                              <button type="button" className="ca-continue"
                                onClick={() => setOpen("details")}
                                style={{ background:`${meta.color}14`, color: meta.color, border:`1px solid ${meta.color}30` }}>
                                {meta.nextLabel} <ChevronRight size={12} />
                              </button>
                            </div>
                          </>
                        )}

                        {/* ══ PANEL 2 ══ */}
                        {key === "details" && (
                          <>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                              <div>
                                <div style={{ fontSize:10.5, fontWeight:700, color: t.textMuted, fontFamily:"'Poppins',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>Select Batch</div>
                                <ThemedSelect t={t} value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} required>
                                  <option value="">Select Batch</option>
                                  {batches.map(b => <option key={b.id} value={b.id}>Batch {b.id}</option>)}
                                </ThemedSelect>
                              </div>
                              <div>
                                <div style={{ fontSize:10.5, fontWeight:700, color: t.textMuted, fontFamily:"'Poppins',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>Deadline</div>
                                <ThemedInput t={t} type="datetime-local" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} required />
                              </div>
                              <div>
                                <div style={{ fontSize:10.5, fontWeight:700, color: t.textMuted, fontFamily:"'Poppins',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>Max Marks</div>
                                <ThemedInput t={t} type="number" placeholder="e.g. 100" value={formData.maxMarks} onChange={e => setFormData({ ...formData, maxMarks: e.target.value })} required />
                              </div>
                              <div>
                                <div style={{ fontSize:10.5, fontWeight:700, color: t.textMuted, fontFamily:"'Poppins',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>Duration <span style={{ fontWeight:400, opacity:0.6 }}>(opt.)</span></div>
                                <ThemedInput t={t} placeholder="e.g. 2 hours" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                              </div>
                            </div>
                            <div style={{ display:"flex", justifyContent:"flex-end" }}>
                              <button type="button" className="ca-continue"
                                onClick={() => setOpen("attachments")}
                                style={{ background:`${meta.color}14`, color: meta.color, border:`1px solid ${meta.color}30` }}>
                                {meta.nextLabel} <ChevronRight size={12} />
                              </button>
                            </div>
                          </>
                        )}

                        {/* ══ PANEL 3 ══ */}
                        {key === "attachments" && (
                          <>
                            {/* drop zone */}
                            <label style={{ cursor:"pointer", display:"block" }}>
                              <div style={{
                                border:`1.5px dashed ${t.inputBorder}`,
                                borderRadius:10, padding:"20px 16px",
                                textAlign:"center", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                                transition:"border-color 0.18s",
                              }}>
                                <div style={{
                                  width:36, height:36, borderRadius:9, margin:"0 auto 9px",
                                  background:`${meta.color}12`, border:`1px solid ${meta.color}28`,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                }}>
                                  <Upload size={15} color={meta.color} />
                                </div>
                                <div style={{ fontSize:12, fontWeight:600, color: t.textSub, fontFamily:"'Poppins',sans-serif", marginBottom:3 }}>
                                  Click to upload files
                                </div>
                                <div style={{ fontSize:10.5, color: t.textMuted, fontFamily:"'Poppins',sans-serif" }}>
                                  PDF · DOC · DOCX · ZIP · TXT
                                </div>
                                <input type="file" multiple onChange={handleFileChange} hidden accept=".pdf,.doc,.docx,.zip,.txt" />
                              </div>
                            </label>

                            {/* file list */}
                            {formData.attachments.length > 0 && (
                              <div style={{ borderRadius:9, border:`1px solid ${t.border}`, overflow:"hidden" }}>
                                {formData.attachments.map((file, index) => (
                                  <div key={index} className="ca-file-row"
                                    style={{ borderBottom: index < formData.attachments.length-1 ? `1px solid ${t.border}` : "none" }}>
                                    <div style={{ width:24, height:24, borderRadius:6, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                      <FileText size={11} color="#7c3aed" />
                                    </div>
                                    <span style={{ fontSize:11.5, color: t.text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Poppins',sans-serif" }}>
                                      {file.name}
                                    </span>
                                    <button type="button" onClick={() => removeFile(index)}
                                      style={{ width:20, height:20, borderRadius:"50%", border:`1px solid ${t.border}`, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                                      <X size={9} color={t.textMuted} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* summary */}
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                              {[
                                { label:"Title",     val: formData.title || "—",                          color:"#7c3aed" },
                                { label:"Batch",     val: formData.batch ? `Batch ${formData.batch}` : "—", color:"#2563eb" },
                                { label:"Max Marks", val: formData.maxMarks || "—",                        color:"#059669" },
                              ].map(({ label, val, color }) => (
                                <div key={label} className="ca-sum-card"
                                  style={{
                                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                    border:`1px solid ${t.border}`,
                                    borderTop:`2px solid ${color}50`,
                                  }}>
                                  <div style={{ fontSize:9, fontWeight:700, color: t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", fontFamily:"'Poppins',sans-serif", marginBottom:4 }}>
                                    {label}
                                  </div>
                                  <div style={{ fontSize:12.5, fontWeight:700, color: t.text, fontFamily:"'Poppins',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                    {val}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* actions */}
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:2 }}>
                              <button type="button" onClick={() => setOpen("details")}
                                style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5, color: t.textMuted, background:"none", border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:500 }}>
                                <ChevronRight size={11} style={{ transform:"rotate(180deg)" }} /> Back
                              </button>
                              <button type="submit" className="ca-submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <>
                                    <div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.35)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"ca-spin 0.85s linear infinite" }} />
                                    Creating…
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={13} />
                                    Create Assignment
                                  </>
                                )}
                              </button>
                            </div>
                          </>
                        )}

                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </form>
    </PageShell>
  );
};

export default CreateAssignments;




// // src/trainer/CreateAssignments.jsx
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   CheckCircle, ChevronRight, FileText, List, Upload, X,
//   Bold, Italic, Underline, Strikethrough, Pin,
// } from "lucide-react";
// import { createAssignment, uploadAssignmentFile } from "@/services/assessmentService";
// import { getTrainerBatches } from "@/services/batchService";
// import {
//   useTrainerTheme, PageShell, PageHero, ThemedCard,
//   ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
//   PrimaryButton, SecondaryButton,
// } from "./trainerTheme";

// /* ─────────────────── RICH EDITOR STYLES (injected once) ─────────────────── */
// const RICH_EDITOR_STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

// .ud-note-toolbar {
//   display: flex;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 2px;
//   padding: 6px 8px;
//   border-bottom: 1px solid var(--ud-divider, #e5e5e5);
// }
// .ud-note-toolbar-btn {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   width: 30px;
//   height: 30px;
//   border-radius: 50%;
//   border: none;
//   background: transparent;
//   cursor: pointer;
//   transition: background 0.15s;
//   font-size: 13px;
//   font-weight: 600;
//   font-family: 'Poppins', sans-serif;
//   color: #444;
//   flex-shrink: 0;
// }
// .ud-note-toolbar-btn:hover { background: rgba(0,0,0,0.08); }
// .ud-note-toolbar-btn.active { background: rgba(6,95,212,0.12); color: #065fd4; }
// .ud-note-toolbar-sep {
//   width: 1px;
//   height: 20px;
//   background: #ddd;
//   margin: 0 4px;
//   flex-shrink: 0;
// }
// .ud-color-swatch {
//   width: 22px;
//   height: 22px;
//   border-radius: 50%;
//   cursor: pointer;
//   border: 2px solid transparent;
//   transition: transform 0.15s, border-color 0.15s;
//   flex-shrink: 0;
// }
// .ud-color-swatch:hover { transform: scale(1.15); }
// .ud-color-swatch.selected { border-color: #065fd4; transform: scale(1.1); }
// .ud-note-editor-wrap {
//   border-radius: 6px;
//   overflow: hidden;
//   transition: box-shadow 0.2s;
// }
// .ud-note-editor-wrap:focus-within {
//   box-shadow: 0 2px 12px rgba(6,95,212,0.13);
// }
// `;

// if (!document.getElementById("ud-rich-st-assign")) {
//   const s = document.createElement("style");
//   s.id = "ud-rich-st-assign";
//   s.textContent = RICH_EDITOR_STYLES;
//   document.head.appendChild(s);
// }

// /* ─────────────────── NOTE TEXT COLORS ─────────────────── */
// const TEXT_COLORS = [
//   { label: "Default", value: "default", color: "transparent", border: "#aaa" },
//   { label: "Red",     value: "#d93025", color: "#d93025" },
//   { label: "Orange",  value: "#e67c00", color: "#e67c00" },
//   { label: "Yellow",  value: "#e5c100", color: "#e5c100" },
//   { label: "Green",   value: "#188038", color: "#188038" },
//   { label: "Teal",    value: "#0097a7", color: "#0097a7" },
//   { label: "Blue",    value: "#1967d2", color: "#1967d2" },
//   { label: "Purple",  value: "#a142f4", color: "#a142f4" },
//   { label: "Pink",    value: "#e52592", color: "#e52592" },
//   { label: "Brown",   value: "#795548", color: "#795548" },
//   { label: "Gray",    value: "#9e9e9e", color: "#9e9e9e" },
// ];

// /* ─────────────────── RICH DESCRIPTION EDITOR ─────────────────── */
// const RichDescriptionEditor = ({ value, onChange, placeholder = "Describe the assignment task...", t }) => {
//   const [showColorPicker,   setShowColorPicker]   = useState(false);
//   const [activeFormats,     setActiveFormats]      = useState({ bold: false, italic: false, underline: false, strike: false, h1: false, h2: false });
//   const [selectedTextColor, setSelectedTextColor]  = useState("default");

//   const colorPickerRef = useRef(null);
//   const textareaRef    = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
//         setShowColorPicker(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleChange  = (e) => onChange(e.target.value);
//   const toggleFormat  = (fmt) => setActiveFormats((p) => ({ ...p, [fmt]: !p[fmt] }));
//   const getTextStyle  = () =>
//     selectedTextColor !== "default" ? { color: selectedTextColor } : { color: t.text };

//   const ToolBtn = ({ onClick, active, title, children }) => (
//     <button
//       type="button"
//       className={`ud-note-toolbar-btn${active ? " active" : ""}`}
//       onClick={onClick}
//       title={title}
//       style={{ color: active ? "#065fd4" : t.textSub }}
//     >
//       {children}
//     </button>
//   );

//   return (
//     <div
//       className="ud-note-editor-wrap"
//       style={{ border: `1px solid ${t.inputBorder}`, borderRadius: 6, background: t.inputBg }}
//     >
//       {/* ── Toolbar ── */}
//       <div className="ud-note-toolbar" style={{ borderBottomColor: t.border }}>
//         <ToolBtn active={activeFormats.h1} onClick={() => toggleFormat("h1")} title="Heading 1">
//           <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>H1</span>
//         </ToolBtn>
//         <ToolBtn active={activeFormats.h2} onClick={() => toggleFormat("h2")} title="Heading 2">
//           <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>H2</span>
//         </ToolBtn>
//         <ToolBtn active={activeFormats.normal} onClick={() => toggleFormat("normal")} title="Normal text">
//           <span style={{ fontSize: 12, fontFamily: "'Poppins',sans-serif" }}>Aa</span>
//         </ToolBtn>

//         <div className="ud-note-toolbar-sep" style={{ background: t.border }} />

//         <ToolBtn active={activeFormats.bold} onClick={() => toggleFormat("bold")} title="Bold">
//           <Bold size={14} strokeWidth={activeFormats.bold ? 3 : 2} />
//         </ToolBtn>
//         <ToolBtn active={activeFormats.italic} onClick={() => toggleFormat("italic")} title="Italic">
//           <Italic size={14} />
//         </ToolBtn>
//         <ToolBtn active={activeFormats.underline} onClick={() => toggleFormat("underline")} title="Underline">
//           <Underline size={14} />
//         </ToolBtn>
//         <ToolBtn active={activeFormats.strike} onClick={() => toggleFormat("strike")} title="Strikethrough">
//           <Strikethrough size={14} />
//         </ToolBtn>

//         <div className="ud-note-toolbar-sep" style={{ background: t.border }} />

//         {/* Text color button + popover */}
//         <div style={{ position: "relative" }} ref={colorPickerRef}>
//           <button
//             type="button"
//             className="ud-note-toolbar-btn"
//             title="Text color"
//             onClick={() => setShowColorPicker((p) => (p === "text" ? false : "text"))}
//             style={{ color: t.textSub }}
//           >
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
//               <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Poppins',sans-serif", color: selectedTextColor !== "default" ? selectedTextColor : t.text, lineHeight: 1 }}>A</span>
//               <div style={{ width: 16, height: 3, borderRadius: 2, background: selectedTextColor !== "default" ? selectedTextColor : t.textSub }} />
//             </div>
//           </button>

//           {showColorPicker === "text" && (
//             <div style={{
//               position: "absolute", zIndex: 99999,
//               background: t.cardBg, borderRadius: 8,
//               boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
//               padding: "12px 14px", minWidth: 280,
//               top: "100%", left: 0,
//               border: `1px solid ${t.border}`,
//             }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>
//                 Text Color
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//                 {TEXT_COLORS.map((col) => (
//                   <div
//                     key={col.value}
//                     className={`ud-color-swatch${selectedTextColor === col.value ? " selected" : ""}`}
//                     title={col.label}
//                     onClick={() => { setSelectedTextColor(col.value); setShowColorPicker(false); }}
//                     style={{
//                       background: col.color,
//                       border: col.border
//                         ? `2px solid ${col.border}`
//                         : selectedTextColor === col.value
//                           ? "2px solid #065fd4"
//                           : "2px solid transparent",
//                       boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Pin */}
//         <div style={{ marginLeft: "auto" }}>
//           <ToolBtn title="Pin note"><Pin size={14} /></ToolBtn>
//         </div>
//       </div>

//       {/* ── Textarea ── */}
//       <textarea
//         ref={textareaRef}
//         rows={4}
//         value={value}
//         onChange={handleChange}
//         placeholder={placeholder}
//         style={{
//           width: "100%",
//           padding: "9px 13px",
//           border: "none",
//           borderRadius: 0,
//           borderBottomLeftRadius: 6,
//           borderBottomRightRadius: 6,
//           background: t.inputBg,
//           outline: "none",
//           fontFamily: "'Poppins',sans-serif",
//           boxSizing: "border-box",
//           resize: "vertical",
//           fontWeight: activeFormats.bold ? 700 : 400,
//           fontStyle: activeFormats.italic ? "italic" : "normal",
//           textDecoration: activeFormats.underline ? "underline" : activeFormats.strike ? "line-through" : "none",
//           fontSize: activeFormats.h1 ? 20 : activeFormats.h2 ? 16 : 13,
//           ...getTextStyle(),
//         }}
//         onFocus={(e) => (e.target.style.outline = "none")}
//         onBlur={(e)  => (e.target.style.outline = "none")}
//       />
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════════
//    MAIN COMPONENT — all original logic preserved exactly
//    Only change: Description field uses RichDescriptionEditor
// ═══════════════════════════════════════════════════════════════════ */
// const PANELS = ["basic", "details", "attachments"];

// const CreateAssignments = () => {
//   const navigate = useNavigate();
//   const { t, isDark } = useTrainerTheme();

//   const [batches, setBatches] = useState([]);
//   const [open, setOpen] = useState("basic");
//   const [formData, setFormData] = useState({
//     title: "", description: "", batch: "",
//     deadline: "", maxMarks: "", duration: "", attachments: [],
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await getTrainerBatches();
//         setBatches(res || []);
//       } catch (err) { console.error("Failed to load trainer batches", err); }
//     };
//     loadBatches();
//   }, []);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData((prev) => ({ ...prev, attachments: files }));
//   };

//   const removeFile = (index) => {
//     setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const response = await createAssignment({
//         title: formData.title, description: formData.description,
//         batchId: Number(formData.batch), deadline: formData.deadline,
//         maxMarks: Number(formData.maxMarks), duration: formData.duration,
//       });
//       const assignmentId = response.data.id;
//       if (formData.attachments.length > 0) {
//         for (let file of formData.attachments) {
//           await uploadAssignmentFile(assignmentId, file);
//         }
//       }
//       setShowSuccess(true);
//       setFormData({ title: "", description: "", batch: "", deadline: "", maxMarks: "", duration: "", attachments: [] });
//     } catch (error) {
//       console.error("Assignment creation error:", error);
//       alert("Failed to create assignment.");
//     }
//     setIsSubmitting(false);
//   };

//   const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

//   const completedPanels = {
//     basic:       !!(formData.title && formData.description),
//     details:     !!(formData.batch && formData.deadline && formData.maxMarks),
//     attachments: false,
//   };

//   const panelMeta = {
//     basic:       { num: 1, label: "Basic Information",    sub: "Title & description",       color: "#7c3aed", next: "details",      nextLabel: "Continue to Details" },
//     details:     { num: 2, label: "Assignment Details",   sub: "Batch, deadline & marks",   color: "#2563eb", next: "attachments",  nextLabel: "Continue to Attachments" },
//     attachments: { num: 3, label: "Attachments & Submit", sub: `${formData.attachments.length} file${formData.attachments.length !== 1 ? "s" : ""} selected`, color: "#34d399", next: null, nextLabel: null },
//   };

//   return (
//     <PageShell t={t}>

//       {/* SUCCESS BANNER */}
//       {showSuccess && (
//         <div style={{
//           display: "flex", alignItems: "center", gap: 12,
//           padding: "14px 18px", borderRadius: 14, marginBottom: 16,
//           background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
//         }}>
//           <CheckCircle size={16} color="#34d399" />
//           <p style={{ fontSize: 13, fontWeight: 600, color: "#34d399", margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//             Assignment Created Successfully!
//           </p>
//         </div>
//       )}

//       {/* STEPPER */}
//       <form onSubmit={handleSubmit}>
//         <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 20, overflow: "hidden", border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
//           {PANELS.map((key, idx) => {
//             const meta        = panelMeta[key];
//             const isOpen      = open === key;
//             const isCompleted = completedPanels[key];
//             const isLast      = idx === PANELS.length - 1;

//             return (
//               <div key={key} style={{ borderBottom: !isLast ? `1px solid ${t.border}` : "none" }}>
//                 {/* Header */}
//                 <button
//                   type="button"
//                   onClick={() => toggle(key)}
//                   style={{
//                     width: "100%", display: "flex", alignItems: "center", gap: 12,
//                     padding: "16px 20px", textAlign: "left",
//                     background: isOpen ? `${meta.color}06` : t.cardBg,
//                     border: "none", cursor: "pointer", transition: "background 0.2s",
//                     borderBottom: isOpen ? `1px solid ${t.border}` : "none",
//                   }}
//                 >
//                   <div style={{
//                     width: 32, height: 32, borderRadius: 999,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: isCompleted ? "rgba(52,211,153,0.15)" : isOpen ? `${meta.color}20` : t.inputBg,
//                     border: `1px solid ${isCompleted ? "rgba(52,211,153,0.3)" : isOpen ? `${meta.color}40` : t.inputBorder}`,
//                     flexShrink: 0, transition: "all 0.2s",
//                   }}>
//                     {isCompleted
//                       ? <CheckCircle size={14} color="#34d399" />
//                       : <span style={{ fontSize: 11, fontWeight: 800, color: isOpen ? meta.color : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
//                     }
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: isOpen ? t.text : t.textSub, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
//                     <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
//                   </div>
//                   <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
//                     {PANELS.map((p, pi) => (
//                       <span key={p} style={{
//                         borderRadius: 999, transition: "all 0.3s",
//                         width: p === key ? 18 : 6, height: 6,
//                         background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg,
//                       }} />
//                     ))}
//                   </div>
//                   <ChevronRight size={14} color={t.textMuted} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
//                 </button>

//                 {/* Body */}
//                 {isOpen && (
//                   <div style={{ background: t.cardBg, padding: "20px 20px 24px" }}>
//                     <div style={{ display: "flex", gap: 16 }}>
//                       <div style={{ width: 1, background: `${meta.color}30`, borderRadius: 999, flexShrink: 0 }} />
//                       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

//                         {/* PANEL 1 */}
//                         {key === "basic" && (
//                           <>
//                             <div>
//                               <FieldLabel t={t}>Assignment Title</FieldLabel>
//                               <ThemedInput t={t} placeholder="e.g. React Hooks Assignment" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
//                             </div>
//                             <div>
//                               <FieldLabel t={t}>Description</FieldLabel>
//                               {/* ── RichDescriptionEditor replaces ThemedTextarea ── */}
//                               <RichDescriptionEditor
//                                 value={formData.description}
//                                 onChange={(val) => setFormData({ ...formData, description: val })}
//                                 placeholder="Describe the assignment task..."
//                                 t={t}
//                               />
//                             </div>
//                             <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                               <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("details")}>
//                                 {meta.nextLabel} <ChevronRight size={13} />
//                               </PrimaryButton>
//                             </div>
//                           </>
//                         )}

//                         {/* PANEL 2 */}
//                         {key === "details" && (
//                           <>
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                               <div>
//                                 <FieldLabel t={t}>Select Batch</FieldLabel>
//                                 <ThemedSelect t={t} value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required>
//                                   <option value="">Select Batch</option>
//                                   {batches.map((b) => (<option key={b.id} value={b.id}>Batch {b.id}</option>))}
//                                 </ThemedSelect>
//                               </div>
//                               <div>
//                                 <FieldLabel t={t}>Deadline</FieldLabel>
//                                 <ThemedInput t={t} type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
//                               </div>
//                               <div>
//                                 <FieldLabel t={t}>Maximum Marks</FieldLabel>
//                                 <ThemedInput t={t} type="number" placeholder="e.g. 100" value={formData.maxMarks} onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })} required />
//                               </div>
//                               <div>
//                                 <FieldLabel t={t}>Duration (optional)</FieldLabel>
//                                 <ThemedInput t={t} placeholder="e.g. 2 hours" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
//                               </div>
//                             </div>
//                             <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                               <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("attachments")}>
//                                 {meta.nextLabel} <ChevronRight size={13} />
//                               </PrimaryButton>
//                             </div>
//                           </>
//                         )}

//                         {/* PANEL 3 */}
//                         {key === "attachments" && (
//                           <>
//                             <label style={{ cursor: "pointer" }}>
//                               <div style={{
//                                 borderRadius: 16, border: `2px dashed ${t.inputBorder}`,
//                                 padding: "32px 24px", textAlign: "center", background: t.inputBg,
//                                 transition: "all 0.2s",
//                               }}>
//                                 <div style={{
//                                   width: 40, height: 40, borderRadius: 12,
//                                   background: t.actBg, border: `1px solid ${t.border}`,
//                                   display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
//                                 }}>
//                                   <Upload size={16} color={t.textMuted} />
//                                 </div>
//                                 <p style={{ fontSize: 13, fontWeight: 600, color: t.textSub, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif" }}>Click to upload files</p>
//                                 <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>PDF, DOC, DOCX, ZIP, TXT</p>
//                                 <input type="file" multiple onChange={handleFileChange} hidden accept=".pdf,.doc,.docx,.zip,.txt" />
//                               </div>
//                             </label>

//                             {formData.attachments.length > 0 && (
//                               <div style={{ borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden" }}>
//                                 {formData.attachments.map((file, index) => (
//                                   <div key={index} style={{
//                                     display: "flex", alignItems: "center", gap: 10,
//                                     padding: "10px 14px",
//                                     borderBottom: index < formData.attachments.length - 1 ? `1px solid ${t.border}` : "none",
//                                   }}>
//                                     <div style={{
//                                       width: 24, height: 24, borderRadius: 7,
//                                       background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
//                                       display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                                     }}>
//                                       <FileText size={12} color="#7c3aed" />
//                                     </div>
//                                     <span style={{ fontSize: 12, color: t.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins',sans-serif" }}>{file.name}</span>
//                                     <button type="button" onClick={() => removeFile(index)} style={{
//                                       width: 20, height: 20, borderRadius: 999, background: t.actBg,
//                                       border: `1px solid ${t.border}`, display: "flex", alignItems: "center",
//                                       justifyContent: "center", cursor: "pointer", flexShrink: 0,
//                                     }}>
//                                       <X size={10} color={t.textMuted} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                             {/* Summary */}
//                             <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
//                               {[
//                                 { label: "Title",     val: formData.title || "—" },
//                                 { label: "Batch",     val: formData.batch ? `Batch ${formData.batch}` : "—" },
//                                 { label: "Max Marks", val: formData.maxMarks || "—" },
//                               ].map(({ label, val }) => (
//                                 <div key={label} style={{
//                                   background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
//                                   borderRadius: 12, padding: "10px 14px",
//                                 }}>
//                                   <p style={{ fontSize: 9, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
//                                   <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</p>
//                                 </div>
//                               ))}
//                             </div>

//                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                               <button type="button" onClick={() => setOpen("details")} style={{
//                                 display: "flex", alignItems: "center", gap: 4,
//                                 fontSize: 12, color: t.textMuted, background: "none", border: "none",
//                                 cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500,
//                               }}>
//                                 <ChevronRight size={12} style={{ transform: "rotate(180deg)" }} /> Back to Details
//                               </button>
//                               <PrimaryButton color="#7c3aed" type="submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.6 : 1 }}>
//                                 {isSubmitting ? (
//                                   <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Creating…</>
//                                 ) : (
//                                   <><CheckCircle size={14} /> Create Assignment</>
//                                 )}
//                               </PrimaryButton>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </form>
//     </PageShell>
//   );
// };

// export default CreateAssignments;