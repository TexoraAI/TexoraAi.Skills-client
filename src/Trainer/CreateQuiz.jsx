// // src/trainer/CreateQuiz.jsx
// import { useEffect, useRef, useState } from "react";
// import {
//   addOption,
//   addQuestion,
//   createQuiz,
//   uploadBulkQuiz,
// } from "../services/assessmentService";
// import { getTrainerBatches } from "../services/batchService";
// import {
//   ChevronDown,
//   ClipboardList,
//   ClipboardCheck,
//   Loader2,
//   PlusCircle,
//   CheckCircle2,
//   Upload,
//   FileText,
//   Plus,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import auth from "../auth";
// import {
//   useTrainerTheme,
//   PageShell,
//   PageHero,
//   ThemedInput,
//   ThemedTextarea,
//   ThemedSelect,
//   FieldLabel,
//   PrimaryButton,
// } from "./trainerTheme";

// const PANELS = ["details", "questions", "review"];

// /* ═══════════════════════════════════════════════════════════
//    REUSABLE CUSTOM DROPDOWN WITH INLINE ADD
//    – ＋ button beside the trigger (same as EnhancedSelect in CompleteProfile)
//    – clicking ＋ shows an inline text input + Add/✕ buttons below
//    – dropdown panel also has add-new footer
//    – opens DOWNWARD by default, flips UP only when no room below
// ═══════════════════════════════════════════════════════════ */
// const AddableDropdown = ({
//   t,
//   isDark,
//   label,
//   value,
//   onChange,
//   options,
//   onAdd,
//   placeholder = "Select…",
// }) => {
//   const [open,         setOpen]         = useState(false);
//   const [showAddInput, setShowAddInput] = useState(false);
//   const [newVal,       setNewVal]       = useState("");
//   const [error,        setError]        = useState("");
//   const [openUp,       setOpenUp]       = useState(false);
//   const wrapperRef  = useRef(null);
//   const inputRef    = useRef(null);   // inside dropdown footer
//   const addInputRef = useRef(null);   // inline below trigger

//   useEffect(() => {
//     const handler = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setOpen(false); setShowAddInput(false); setNewVal(""); setError("");
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => { if (open)         setTimeout(() => inputRef.current?.focus(),    60); }, [open]);
//   useEffect(() => { if (showAddInput) setTimeout(() => addInputRef.current?.focus(), 60); }, [showAddInput]);

//   const handleToggle = () => {
//     if (!open && wrapperRef.current) {
//       const PANEL_HEIGHT = 310;
//       const rect         = wrapperRef.current.getBoundingClientRect();
//       const spaceBelow   = window.innerHeight - rect.bottom;
//       setOpenUp(spaceBelow < PANEL_HEIGHT && rect.top > PANEL_HEIGHT);
//     }
//     setOpen((p) => !p);
//     setNewVal(""); setError("");
//   };

//   const handleAdd = () => {
//     const trimmed = newVal.trim();
//     if (!trimmed)                  { setError("Please enter a value"); return; }
//     if (options.includes(trimmed)) { setError("Already exists");       return; }
//     onAdd(trimmed);
//     setNewVal(""); setError(""); setOpen(false); setShowAddInput(false);
//   };

//   const dropBg     = isDark ? "#1a1a2e"               : "#ffffff";
//   const dropBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
//   const hoverBg    = isDark ? "rgba(124,58,237,0.14)" : "rgba(124,58,237,0.07)";
//   const selBg      = isDark ? "rgba(124,58,237,0.24)" : "rgba(124,58,237,0.11)";
//   const addBg      = isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.04)";
//   const addBorder  = isDark ? "rgba(124,58,237,0.3)"  : "rgba(124,58,237,0.2)";

//   const panelPos    = openUp ? { bottom: "calc(100% + 5px)", top: "auto" } : { top: "calc(100% + 5px)", bottom: "auto" };
//   const panelShadow = openUp
//     ? (isDark ? "0 -8px 32px rgba(0,0,0,0.6)" : "0 -6px 24px rgba(0,0,0,0.13)")
//     : (isDark ? "0  8px 32px rgba(0,0,0,0.6)" : "0  6px 24px rgba(0,0,0,0.13)");

//   return (
//     <div ref={wrapperRef} style={{ width: "100%" }}>

//       {/* ── Row: trigger + ＋ button ── */}
//       <div style={{ display: "flex", gap: 6, alignItems: "center", position: "relative" }}>

//         {/* dropdown trigger */}
//         <button
//           type="button"
//           onClick={handleToggle}
//           style={{
//             flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
//             height: 38, padding: "0 12px", borderRadius: 10,
//             border: `1px solid ${open ? "#7c3aed" : t.inputBorder}`,
//             background: t.inputBg, color: value ? t.text : t.textSub,
//             fontFamily: "'Poppins', sans-serif", fontSize: 13,
//             cursor: "pointer", outline: "none", transition: "border 0.15s",
//           }}
//         >
//           <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//             {value || placeholder}
//           </span>
//           <ChevronDown size={14} color={t.textSub}
//             style={{ flexShrink: 0, marginLeft: 6, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
//           />
//         </button>
//         {/* dropdown panel */}
//         {open && (
//           <div style={{
//             position: "absolute", ...panelPos,
//             left: 0, right: 0,   // leaves room for the ＋ button (38px + 6px gap)
//             background: dropBg, border: `1px solid ${dropBorder}`,
//             borderRadius: 12, boxShadow: panelShadow,
//             zIndex: 1000, overflow: "hidden",
//             display: "flex", flexDirection: "column",
//           }}>
//             {/* option list */}
//             <div style={{ maxHeight: 200, overflowY: "auto" }}>
//               <div
//                 onClick={() => { onChange(""); setOpen(false); }}
//                 style={{ padding: "9px 14px", fontSize: 12, fontFamily: "'Poppins', sans-serif", color: t.textSub, cursor: "pointer", borderBottom: `1px solid ${dropBorder}` }}
//               >
//                 {placeholder}
//               </div>
//               {options.map((opt) => {
//                 const sel = value === opt;
//                 return (
//                   <div key={opt}
//                     onClick={() => { onChange(opt); setOpen(false); }}
//                     style={{ padding: "10px 14px", fontSize: 13, fontFamily: "'Poppins', sans-serif", color: sel ? "#7c3aed" : t.text, fontWeight: sel ? 700 : 500, background: sel ? selBg : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.1s" }}
//                     onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = hoverBg; }}
//                     onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
//                   >
//                     {opt}
//                     {sel && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
//                   </div>
//                 );
//               })}
//             </div>
//             {/* add-new footer inside dropdown */}
//             <div style={{ borderTop: `1px solid ${dropBorder}`, padding: "10px 12px", background: addBg }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
//                 <Plus size={12} color="#7c3aed" />
//                 <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: "#7c3aed", letterSpacing: "0.02em" }}>
//                   ADD NEW {label.toUpperCase()}
//                 </span>
//               </div>
//               <input
//                 ref={inputRef}
//                 value={newVal}
//                 onChange={(e) => { setNewVal(e.target.value); setError(""); }}
//                 onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); handleAdd(); } if (e.key === "Escape") setOpen(false); }}
//                 placeholder={`Enter new ${label.toLowerCase()}`}
//                 style={{ width: "100%", boxSizing: "border-box", height: 32, padding: "0 10px", borderRadius: 8, border: `1px solid ${error ? "#f87171" : addBorder}`, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: t.text, outline: "none", marginBottom: 7 }}
//               />
//               <button type="button" onClick={handleAdd}
//                 style={{ width: "100%", height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: "#7c3aed", color: "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
//                 <Plus size={12} /> Add {label}
//               </button>
//               {error && <p style={{ margin: "5px 0 0", fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#f87171" }}>{error}</p>}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── Inline add input (below trigger, shown when ＋ clicked) ── */}
//       {showAddInput && (
//         <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
//           <input
//             ref={addInputRef}
//             type="text"
//             value={newVal}
//             onChange={(e) => { setNewVal(e.target.value); setError(""); }}
//             placeholder={`Type custom ${label.toLowerCase()}…`}
//             onKeyDown={(e) => {
//               if (e.key === "Enter")  { e.stopPropagation(); handleAdd(); }
//               if (e.key === "Escape") { setShowAddInput(false); setNewVal(""); setError(""); }
//             }}
//             style={{
//               flex: 1, height: 36, padding: "0 12px", borderRadius: 9,
//               border: `1.5px solid ${error ? "#f87171" : addBorder}`,
//               background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
//               fontFamily: "'Poppins', sans-serif", fontSize: 13,
//               color: t.text, outline: "none", transition: "border 0.15s",
//             }}
//           />
//           <button type="button" onClick={handleAdd}
//             style={{ padding: "0 14px", height: 36, background: "#7c3aed", border: "none", borderRadius: 9, color: "#fff", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, transition: "opacity 0.15s" }}
//             onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
//             onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
//           >
//             Add
//           </button>
//           <button type="button" onClick={() => { setShowAddInput(false); setNewVal(""); setError(""); }}
//             style={{ padding: "0 10px", height: 36, background: isDark ? "rgba(255,255,255,0.06)" : "#f5f5f5", border: `1.5px solid ${t.inputBorder}`, borderRadius: 9, color: t.textSub, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 13 }}>
//             ✕
//           </button>
//         </div>
//       )}
//       {error && showAddInput && (
//         <p style={{ margin: "4px 0 0", fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#f87171" }}>{error}</p>
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════
//    DEFAULT OPTIONS
// ═══════════════════════════════════════════════════════════ */
// const DEFAULT_QUIZ_TYPES   = ["Multiple Choice", "True / False", "Fill in the Blank", "Short Answer"];
// const DEFAULT_DIFFICULTIES = ["Easy", "Medium", "Hard", "Expert"];
// const DEFAULT_CATEGORIES   = ["General", "Mathematics", "Science", "Programming", "Language", "Aptitude", "Domain Specific"];

// /* ═══════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════════════════ */
// const CreateQuiz = () => {
//   const navigate      = useNavigate();
//   const { t, isDark } = useTrainerTheme();

//   const [title,        setTitle]        = useState("");
//   const [batchId,      setBatchId]      = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [quizType,     setQuizType]     = useState("");
//   const [difficulty,   setDifficulty]   = useState("");
//   const [category,     setCategory]     = useState("");
//   const [timeLimit,    setTimeLimit]    = useState("");
//   const [totalMarks,   setTotalMarks]   = useState("");

//   const [quizTypes,    setQuizTypes]    = useState([...DEFAULT_QUIZ_TYPES]);
//   const [difficulties, setDifficulties] = useState([...DEFAULT_DIFFICULTIES]);
//   const [categories,   setCategories]   = useState([...DEFAULT_CATEGORIES]);

//   const [loading,      setLoading]      = useState(false);
//   const [batches,      setBatches]      = useState([]);
//   const [open,         setOpen]         = useState("details");
//   const [questions,    setQuestions]    = useState([
//     { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" },
//   ]);

//   const [uploading,    setUploading]    = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [uploadMsg,    setUploadMsg]    = useState("");
//   const [dragOver,     setDragOver]     = useState(false);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (!auth.isAuthenticated()) { alert("Please login again"); return; }
//     const loadBatches = async () => {
//       try { const res = await getTrainerBatches(); setBatches(res || []); }
//       catch (err) { console.error("Failed to load trainer batches", err); }
//     };
//     loadBatches();
//   }, []);

//   const addNewQuestion = () => setQuestions([...questions, { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" }]);

//   const handleFileChosen = async (file) => {
//     if (!file) return;
//     const allowed = [".pdf", ".doc", ".docx", ".txt", ".csv"];
//     const ext     = "." + file.name.split(".").pop().toLowerCase();
//     if (!allowed.includes(ext)) { setUploadStatus("error"); setUploadMsg("Invalid file type. Allowed: .pdf .doc .docx .txt .csv"); return; }
//     setUploadedFile(file); setUploadStatus(null); setUploadMsg(""); setUploading(true);
//     try {
//       const data = await uploadBulkQuiz(file);
//       if (data.title)     setTitle(data.title);
//       if (data.questions) setQuestions(data.questions);
//       setUploadStatus("success");
//       setUploadMsg(`✅ ${data.questions?.length || 0} question${(data.questions?.length || 0) !== 1 ? "s" : ""} loaded from "${file.name}"`);
//       setOpen("questions");
//     } catch (err) {
//       const msg = err?.response?.data?.error || err.message || "Upload failed.";
//       setUploadStatus("error"); setUploadMsg(`❌ ${msg}`); setUploadedFile(null);
//     } finally {
//       setUploading(false);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   const clearUpload = () => { setUploadedFile(null); setUploadStatus(null); setUploadMsg(""); if (fileInputRef.current) fileInputRef.current.value = ""; };

//   const handleSaveQuiz = async () => {
//     for (const q of questions) {
//       if (!q.text?.trim())  { alert("Please enter question text"); return; }
//       if (!q.correctOption) { alert("Please select correct option for all questions"); return; }
//       for (const key of ["A", "B", "C", "D"]) { if (!q.options[key]?.trim()) { alert(`Please fill option ${key} for all questions`); return; } }
//     }
//     if (!batchId) { alert("Please select a batch"); return; }
//     try {
//       setLoading(true);
//       const quizRes = await createQuiz({ title, batchId, instructions, quizType, difficulty, category, timeLimit, totalMarks });
//       const quizId  = quizRes.data.id;
//       for (const q of questions) {
//         const qRes       = await addQuestion({ quizId, text: q.text.trim() });
//         const questionId = qRes.data.id;
//         for (const key of ["A", "B", "C", "D"]) await addOption({ questionId, text: q.options[key].trim(), correct: key === q.correctOption });
//       }
//       alert("✅ Quiz created successfully");
//       setTitle(""); setBatchId(""); setInstructions(""); setQuizType(""); setDifficulty(""); setCategory(""); setTimeLimit(""); setTotalMarks("");
//       setQuestions([{ text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" }]);
//       clearUpload();
//     } catch (err) { console.error(err); alert(err.message || "❌ Failed to create quiz"); }
//     finally { setLoading(false); }
//   };

//   const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

//   const panelMeta = {
//     details:   { label: "Quiz Details",    sub: "Title, type, difficulty & settings", color: "#22d3ee", num: 1, nextLabel: "Next: Add Questions →" },
//     questions: { label: "Questions",       sub: `${questions.length} question${questions.length !== 1 ? "s" : ""} added`, color: "#7c3aed", num: 2, nextLabel: "Next: Review →" },
//     review:    { label: "Review & Publish",sub: "Confirm and save",                  color: "#34d399", num: 3, nextLabel: null },
//   };

//   const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
//   const onDragLeave = ()  => setDragOver(false);
//   const onDrop      = (e) => { e.preventDefault(); setDragOver(false); handleFileChosen(e.dataTransfer.files?.[0]); };

//   const numInputStyle = { width: "100%", height: 38, padding: "0 12px", borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.text, fontFamily: "'Poppins', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" };

//   return (
//     <PageShell t={t}>
//       <PageHero
//         t={t} isDark={isDark} icon={ClipboardList} badge="Assessment Builder"
//         title="Quiz Builder" subtitle="Create quizzes with multiple choice questions for your batches." color="#22d3ee"
//         right={
//           <button onClick={() => navigate("/trainer/my-quizzes")}
//             style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 12, cursor: "pointer", background: t.actBg, border: `1px solid ${t.border}`, color: t.textSub, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}>
//             <ClipboardCheck size={14} /> My Quizzes
//           </button>
//         }
//       />

//       <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//         {PANELS.map((key) => {
//           const meta   = panelMeta[key];
//           const isOpen = open === key;
//           return (
//             <div key={key} style={{ background: t.cardBg, border: `1px solid ${isOpen ? meta.color + "40" : t.border}`, borderRadius: 20, overflow: "hidden", boxShadow: isOpen ? `0 0 0 1px ${meta.color}20, ${t.shadow}` : t.shadow, transition: "all 0.2s" }}>
//               <button onClick={() => toggle(key)}
//                 style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", textAlign: "left", background: isOpen ? `${meta.color}06` : "transparent", border: "none", cursor: "pointer", borderBottom: isOpen ? `1px solid ${t.border}` : "none", transition: "background 0.2s" }}>
//                 <div style={{ width: 32, height: 32, borderRadius: 999, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${meta.color}20`, border: `1px solid ${meta.color}40` }}>
//                   <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
//                   <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
//                 </div>
//                 <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
//                   {PANELS.map((p, pi) => (
//                     <span key={p} style={{ width: p === key ? 18 : 6, height: 6, borderRadius: 999, background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg, transition: "all 0.3s" }} />
//                   ))}
//                 </div>
//                 <ChevronDown size={16} color={t.textMuted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
//               </button>

//               {isOpen && (
//                 <div style={{ padding: "20px 20px 24px" }}>

//                   {/* ══════ PANEL 1 — DETAILS ══════ */}
//                   {key === "details" && (
//                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                         <div>
//                           <FieldLabel t={t}>Quiz Title</FieldLabel>
//                           <ThemedInput t={t} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Fundamentals" />
//                         </div>
//                         <div>
//                           <FieldLabel t={t}>Select Batch</FieldLabel>
//                           <ThemedSelect t={t} value={batchId} onChange={(e) => setBatchId(Number(e.target.value))}>
//                             <option value="">Select Batch</option>
//                             {batches.map((b) => <option key={b.id} value={b.id}>Batch {b.id}</option>)}
//                           </ThemedSelect>
//                         </div>
//                       </div>

//                       {/* ── Quiz Type / Difficulty / Category — each has ＋ button ── */}
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
//                         <div>
//                           <FieldLabel t={t}>Quiz Type</FieldLabel>
//                           <AddableDropdown t={t} isDark={isDark} label="Quiz Type" placeholder="Select Type" value={quizType} onChange={setQuizType} options={quizTypes} onAdd={(v) => { setQuizTypes((p) => [...p, v]); setQuizType(v); }} />
//                         </div>
//                         <div>
//                           <FieldLabel t={t}>Difficulty</FieldLabel>
//                           <AddableDropdown t={t} isDark={isDark} label="Difficulty" placeholder="Select Difficulty" value={difficulty} onChange={setDifficulty} options={difficulties} onAdd={(v) => { setDifficulties((p) => [...p, v]); setDifficulty(v); }} />
//                         </div>
//                         <div>
//                           <FieldLabel t={t}>Category</FieldLabel>
//                           <AddableDropdown t={t} isDark={isDark} label="Category" placeholder="Select Category" value={category} onChange={setCategory} options={categories} onAdd={(v) => { setCategories((p) => [...p, v]); setCategory(v); }} />
//                         </div>
//                       </div>

//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                         <div>
//                           <FieldLabel t={t}>⏱ Time Limit (minutes)</FieldLabel>
//                           <div style={{ position: "relative" }}>
//                             <input type="number" min="1" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="e.g. 30" style={numInputStyle} />
//                             {timeLimit && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: t.textMuted, fontFamily: "'Poppins', sans-serif", pointerEvents: "none" }}>min</span>}
//                           </div>
//                         </div>
//                         <div>
//                           <FieldLabel t={t}> Total Marks</FieldLabel>
//                           <input type="number" min="1" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g. 100" style={numInputStyle} />
//                         </div>
//                       </div>

//                       <div>
//                         <FieldLabel t={t}>Instructions</FieldLabel>
//                         <ThemedTextarea t={t} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Quiz instructions for students…" rows={3} />
//                       </div>
//                       <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                         <PrimaryButton color={meta.color} onClick={() => setOpen("questions")}>{meta.nextLabel}</PrimaryButton>
//                       </div>
//                     </div>
//                   )}

//                   {/* ══════ PANEL 2 — QUESTIONS ══════ */}
//                   {key === "questions" && (
//                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                       <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
//                         style={{ border: `2px dashed ${dragOver ? "#22d3ee" : uploadStatus === "success" ? "#34d399" : uploadStatus === "error" ? "#f87171" : "rgba(124,58,237,0.35)"}`, borderRadius: 16, padding: "20px 16px", background: dragOver ? "rgba(34,211,238,0.05)" : uploadStatus === "success" ? "rgba(52,211,153,0.05)" : uploadStatus === "error" ? "rgba(248,113,113,0.05)" : "transparent", transition: "all 0.2s", textAlign: "center" }}>
//                         <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv" style={{ display: "none" }} onChange={(e) => handleFileChosen(e.target.files?.[0])} />
//                         {uploading ? (
//                           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
//                             <Loader2 size={22} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
//                             <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Parsing quiz file with AI…</p>
//                           </div>
//                         ) : uploadedFile && uploadStatus === "success" ? (
//                           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                               <FileText size={16} color="#34d399" />
//                               <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399", fontFamily: "'Poppins',sans-serif" }}>{uploadMsg}</span>
//                               <button onClick={clearUpload} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} color={t.textMuted} /></button>
//                             </div>
//                             <button onClick={() => fileInputRef.current?.click()} style={{ fontSize: 11, color: t.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", textDecoration: "underline" }}>Upload a different file</button>
//                           </div>
//                         ) : (
//                           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
//                             <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}><Upload size={18} color="#7c3aed" /></div>
//                             <div>
//                               <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Upload Quiz File</p>
//                               <p style={{ fontSize: 11, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>Drag & drop or click to browse · .pdf .doc .docx .txt .csv</p>
//                             </div>
//                             {uploadStatus === "error" && <p style={{ fontSize: 11, color: "#f87171", margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{uploadMsg}</p>}
//                             <button onClick={() => fileInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.08)", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}><Upload size={13} /> Choose File</button>
//                           </div>
//                         )}
//                       </div>

//                       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                         <div style={{ flex: 1, height: 1, background: t.border }} />
//                         <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>or add questions manually</span>
//                         <div style={{ flex: 1, height: 1, background: t.border }} />
//                       </div>

//                       {questions.map((q, index) => (
//                         <div key={index} style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 16, padding: 16 }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
//                             <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                               <span style={{ fontSize: 10, fontWeight: 800, color: "#7c3aed", fontFamily: "'Poppins',sans-serif" }}>{index + 1}</span>
//                             </div>
//                             <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Poppins',sans-serif" }}>Question {index + 1}</span>
//                           </div>
//                           <ThemedInput t={t} value={q.text} onChange={(e) => { const u = [...questions]; u[index] = { ...u[index], text: e.target.value }; setQuestions(u); }} placeholder="Enter question text" style={{ marginBottom: 12 }} />
//                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                             {["A", "B", "C", "D"].map((optKey) => (
//                               <label key={optKey} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, padding: "10px 12px", cursor: "pointer", border: `1px solid ${q.correctOption === optKey ? "#34d399" : t.inputBorder}`, background: q.correctOption === optKey ? "rgba(52,211,153,0.08)" : t.inputBg, transition: "all 0.15s" }}>
//                                 <input type="radio" name={`correct-${index}`} checked={q.correctOption === optKey} onChange={() => { const u = [...questions]; u[index] = { ...u[index], correctOption: optKey }; setQuestions(u); }} style={{ accentColor: "#34d399" }} />
//                                 <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: q.correctOption === optKey ? "#34d399" : t.barBg, fontSize: 10, fontWeight: 800, color: q.correctOption === optKey ? "#fff" : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{optKey}</span>
//                                 <input value={q.options[optKey] || ""} onChange={(e) => { const u = [...questions]; u[index] = { ...u[index], options: { ...u[index].options, [optKey]: e.target.value } }; setQuestions(u); }} placeholder={`Option ${optKey}`} style={{ flex: 1, background: "transparent", outline: "none", border: "none", fontSize: 13, color: t.text, fontFamily: "'Poppins',sans-serif" }} />
//                               </label>
//                             ))}
//                           </div>
//                         </div>
//                       ))}

//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                         <button onClick={addNewQuestion} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 12, border: "2px dashed rgba(124,58,237,0.4)", background: "transparent", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
//                           <PlusCircle size={14} /> Add Question
//                         </button>
//                         <PrimaryButton color={meta.color} onClick={() => setOpen("review")}>{meta.nextLabel}</PrimaryButton>
//                       </div>
//                     </div>
//                   )}

//                   {/* ══════ PANEL 3 — REVIEW ══════ */}
//                   {key === "review" && (
//                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
//                         {[
//                           { label: "Title",       val: title      || "—" },
//                           { label: "Batch",       val: batchId    ? `Batch ${batchId}` : "—" },
//                           { label: "Type",        val: quizType   || "—" },
//                           { label: "Difficulty",  val: difficulty || "—" },
//                           { label: "Category",    val: category   || "—" },
//                           { label: "Time Limit",  val: timeLimit  ? `${timeLimit} min` : "—" },
//                           { label: "Total Marks", val: totalMarks || "—" },
//                           { label: "Questions",   val: questions.length },
//                         ].map(({ label, val }) => (
//                           <div key={label} style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 14, padding: "12px 16px" }}>
//                             <p style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
//                             <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", wordBreak: "break-word" }}>{val}</p>
//                           </div>
//                         ))}
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                         <button onClick={() => setOpen("questions")} style={{ fontSize: 12, color: t.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>← Back to Questions</button>
//                         <PrimaryButton color="#34d399" onClick={handleSaveQuiz} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
//                           {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><CheckCircle2 size={14} /> Publish Quiz</>}
//                         </PrimaryButton>
//                       </div>
//                     </div>
//                   )}

//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </PageShell>
//   );
// };

// export default CreateQuiz;

















































// src/trainer/CreateQuiz.jsx
import { useEffect, useRef, useState } from "react";
import {
  addOption,
  addQuestion,
  createQuiz,
  uploadBulkQuiz,
} from "../services/assessmentService";
import { getTrainerBatches } from "../services/batchService";
import {
  ChevronDown,
  ClipboardList,
  ClipboardCheck,
  Loader2,
  PlusCircle,
  CheckCircle2,
  Upload,
  FileText,
  Plus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import auth from "../auth";
import {
  useTrainerTheme,
  PageShell,
  PageHero,
  ThemedInput,
  ThemedTextarea,
  ThemedSelect,
  FieldLabel,
  PrimaryButton,
} from "./trainerTheme";

const PANELS = ["details", "questions", "review"];

/* ═══════════════════════════════════════════════════════════
   REUSABLE CUSTOM DROPDOWN WITH INLINE ADD
═══════════════════════════════════════════════════════════ */
const AddableDropdown = ({
  t,
  isDark,
  label,
  value,
  onChange,
  options,
  onAdd,
  placeholder = "Select…",
}) => {
  const [open,         setOpen]         = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newVal,       setNewVal]       = useState("");
  const [error,        setError]        = useState("");
  const [openUp,       setOpenUp]       = useState(false);
  const wrapperRef  = useRef(null);
  const inputRef    = useRef(null);
  const addInputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false); setShowAddInput(false); setNewVal(""); setError("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { if (open)         setTimeout(() => inputRef.current?.focus(),    60); }, [open]);
  useEffect(() => { if (showAddInput) setTimeout(() => addInputRef.current?.focus(), 60); }, [showAddInput]);

  const handleToggle = () => {
    if (!open && wrapperRef.current) {
      const PANEL_HEIGHT = 310;
      const rect         = wrapperRef.current.getBoundingClientRect();
      const spaceBelow   = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < PANEL_HEIGHT && rect.top > PANEL_HEIGHT);
    }
    setOpen((p) => !p);
    setNewVal(""); setError("");
  };

  const handleAdd = () => {
    const trimmed = newVal.trim();
    if (!trimmed)                  { setError("Please enter a value"); return; }
    if (options.includes(trimmed)) { setError("Already exists");       return; }
    onAdd(trimmed);
    setNewVal(""); setError(""); setOpen(false); setShowAddInput(false);
  };

  const dropBg     = isDark ? "#1a1a2e"               : "#ffffff";
  const dropBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const hoverBg    = isDark ? "rgba(124,58,237,0.14)" : "rgba(124,58,237,0.07)";
  const selBg      = isDark ? "rgba(124,58,237,0.24)" : "rgba(124,58,237,0.11)";
  const addBg      = isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.04)";
  const addBorder  = isDark ? "rgba(124,58,237,0.3)"  : "rgba(124,58,237,0.2)";

  const panelPos    = openUp ? { bottom: "calc(100% + 5px)", top: "auto" } : { top: "calc(100% + 5px)", bottom: "auto" };
  const panelShadow = openUp
    ? (isDark ? "0 -8px 32px rgba(0,0,0,0.6)" : "0 -6px 24px rgba(0,0,0,0.13)")
    : (isDark ? "0  8px 32px rgba(0,0,0,0.6)" : "0  6px 24px rgba(0,0,0,0.13)");

  return (
    <div ref={wrapperRef} style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", position: "relative" }}>
        <button
          type="button"
          onClick={handleToggle}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
            height: 38, padding: "0 12px", borderRadius: 10,
            border: `1px solid ${open ? "#7c3aed" : t.inputBorder}`,
            background: t.inputBg, color: value ? t.text : t.textSub,
            fontFamily: "'Poppins', sans-serif", fontSize: 13,
            cursor: "pointer", outline: "none", transition: "border 0.15s",
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value || placeholder}
          </span>
          <ChevronDown size={14} color={t.textSub}
            style={{ flexShrink: 0, marginLeft: 6, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
          />
        </button>
        {open && (
          <div style={{
            position: "absolute", ...panelPos,
            left: 0, right: 0,
            background: dropBg, border: `1px solid ${dropBorder}`,
            borderRadius: 12, boxShadow: panelShadow,
            zIndex: 1000, overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              <div
                onClick={() => { onChange(""); setOpen(false); }}
                style={{ padding: "9px 14px", fontSize: 12, fontFamily: "'Poppins', sans-serif", color: t.textSub, cursor: "pointer", borderBottom: `1px solid ${dropBorder}` }}
              >
                {placeholder}
              </div>
              {options.map((opt) => {
                const sel = value === opt;
                return (
                  <div key={opt}
                    onClick={() => { onChange(opt); setOpen(false); }}
                    style={{ padding: "10px 14px", fontSize: 13, fontFamily: "'Poppins', sans-serif", color: sel ? "#7c3aed" : t.text, fontWeight: sel ? 700 : 500, background: sel ? selBg : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                  >
                    {opt}
                    {sel && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: `1px solid ${dropBorder}`, padding: "10px 12px", background: addBg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
                <Plus size={12} color="#7c3aed" />
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: "#7c3aed", letterSpacing: "0.02em" }}>
                  ADD NEW {label.toUpperCase()}
                </span>
              </div>
              <input
                ref={inputRef}
                value={newVal}
                onChange={(e) => { setNewVal(e.target.value); setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); handleAdd(); } if (e.key === "Escape") setOpen(false); }}
                placeholder={`Enter new ${label.toLowerCase()}`}
                style={{ width: "100%", boxSizing: "border-box", height: 32, padding: "0 10px", borderRadius: 8, border: `1px solid ${error ? "#f87171" : addBorder}`, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: t.text, outline: "none", marginBottom: 7 }}
              />
              <button type="button" onClick={handleAdd}
                style={{ width: "100%", height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: "#7c3aed", color: "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Plus size={12} /> Add {label}
              </button>
              {error && <p style={{ margin: "5px 0 0", fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#f87171" }}>{error}</p>}
            </div>
          </div>
        )}
      </div>

      {showAddInput && (
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input
            ref={addInputRef}
            type="text"
            value={newVal}
            onChange={(e) => { setNewVal(e.target.value); setError(""); }}
            placeholder={`Type custom ${label.toLowerCase()}…`}
            onKeyDown={(e) => {
              if (e.key === "Enter")  { e.stopPropagation(); handleAdd(); }
              if (e.key === "Escape") { setShowAddInput(false); setNewVal(""); setError(""); }
            }}
            style={{
              flex: 1, height: 36, padding: "0 12px", borderRadius: 9,
              border: `1.5px solid ${error ? "#f87171" : addBorder}`,
              background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
              fontFamily: "'Poppins', sans-serif", fontSize: 13,
              color: t.text, outline: "none", transition: "border 0.15s",
            }}
          />
          <button type="button" onClick={handleAdd}
            style={{ padding: "0 14px", height: 36, background: "#7c3aed", border: "none", borderRadius: 9, color: "#fff", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, transition: "opacity 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Add
          </button>
          <button type="button" onClick={() => { setShowAddInput(false); setNewVal(""); setError(""); }}
            style={{ padding: "0 10px", height: 36, background: isDark ? "rgba(255,255,255,0.06)" : "#f5f5f5", border: `1.5px solid ${t.inputBorder}`, borderRadius: 9, color: t.textSub, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 13 }}>
            ✕
          </button>
        </div>
      )}
      {error && showAddInput && (
        <p style={{ margin: "4px 0 0", fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#f87171" }}>{error}</p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DEFAULT OPTIONS
═══════════════════════════════════════════════════════════ */
const DEFAULT_QUIZ_TYPES   = ["Multiple Choice", "True / False", "Fill in the Blank", "Short Answer"];
const DEFAULT_DIFFICULTIES = ["Easy", "Medium", "Hard", "Expert"];
const DEFAULT_CATEGORIES   = ["General", "Mathematics", "Science", "Programming", "Language", "Aptitude", "Domain Specific"];

/* ═══════════════════════════════════════════════════════════
   HELPER — returns a blank question shaped for the quiz type
═══════════════════════════════════════════════════════════ */
const getDefaultQuestion = (type) => {
  if (type === "True / False")
    return { text: "", options: { A: "True", B: "False" }, correctOption: "" };
  if (type === "Fill in the Blank" || type === "Short Answer")
    return { text: "", answer: "" };
  // Multiple Choice (default / empty)
  return { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" };
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const CreateQuiz = () => {
  const navigate      = useNavigate();
  const { t, isDark } = useTrainerTheme();

  const [title,        setTitle]        = useState("");
  const [batchId,      setBatchId]      = useState("");
  const [instructions, setInstructions] = useState("");
  const [quizType,     setQuizType]     = useState("");
  const [difficulty,   setDifficulty]   = useState("");
  const [category,     setCategory]     = useState("");
  const [timeLimit,    setTimeLimit]    = useState("");
  const [totalMarks,   setTotalMarks]   = useState("");

  const [quizTypes,    setQuizTypes]    = useState([...DEFAULT_QUIZ_TYPES]);
  const [difficulties, setDifficulties] = useState([...DEFAULT_DIFFICULTIES]);
  const [categories,   setCategories]   = useState([...DEFAULT_CATEGORIES]);

  const [loading,      setLoading]      = useState(false);
  const [batches,      setBatches]      = useState([]);
  const [open,         setOpen]         = useState("details");
  const [questions,    setQuestions]    = useState([
    getDefaultQuestion(""),
  ]);

  const [uploading,    setUploading]    = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMsg,    setUploadMsg]    = useState("");
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) { alert("Please login again"); return; }
    const loadBatches = async () => {
      try { const res = await getTrainerBatches(); setBatches(res || []); }
      catch (err) { console.error("Failed to load trainer batches", err); }
    };
    loadBatches();
  }, []);

  // ✅ FIX: reset questions when quiz type changes
  useEffect(() => {
    setQuestions([getDefaultQuestion(quizType)]);
  }, [quizType]);

  // ✅ FIX: addNewQuestion uses current quizType
  const addNewQuestion = () => setQuestions([...questions, getDefaultQuestion(quizType)]);

  // const handleFileChosen = async (file) => {
  //   if (!file) return;
  //   const allowed = [".pdf", ".doc", ".docx", ".txt", ".csv"];
  //   const ext     = "." + file.name.split(".").pop().toLowerCase();
  //   if (!allowed.includes(ext)) { setUploadStatus("error"); setUploadMsg("Invalid file type. Allowed: .pdf .doc .docx .txt .csv"); return; }
  //   setUploadedFile(file); setUploadStatus(null); setUploadMsg(""); setUploading(true);
  //   try {
  //     const data = await uploadBulkQuiz(file);
  //     if (data.title)     setTitle(data.title);
  //     if (data.questions) setQuestions(data.questions);
  //     setUploadStatus("success");
  //     setUploadMsg(`✅ ${data.questions?.length || 0} question${(data.questions?.length || 0) !== 1 ? "s" : ""} loaded from "${file.name}"`);
  //     setOpen("questions");
  //   } catch (err) {
  //     const msg = err?.response?.data?.error || err.message || "Upload failed.";
  //     setUploadStatus("error"); setUploadMsg(`❌ ${msg}`); setUploadedFile(null);
  //   } finally {
  //     setUploading(false);
  //     if (fileInputRef.current) fileInputRef.current.value = "";
  //   }
  // };
const handleFileChosen = async (file) => {
    if (!file) return;
    const allowed = [".pdf", ".doc", ".docx", ".txt", ".csv"];
    const ext     = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setUploadStatus("error");
      setUploadMsg("Invalid file type. Allowed: .pdf .doc .docx .txt .csv");
      return;
    }
    setUploadedFile(file); setUploadStatus(null); setUploadMsg(""); setUploading(true);
    try {
      const data = await uploadBulkQuiz(file);
      if (data.title)     setTitle(data.title);
      if (data.quizType)  setQuizType(data.quizType);   // ← sets quiz type from AI
      if (data.questions) setQuestions(data.questions);
      setUploadStatus("success");
      setUploadMsg(`✅ ${data.questions?.length || 0} question${(data.questions?.length || 0) !== 1 ? "s" : ""} loaded from "${file.name}"`);
      setOpen("questions");
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Upload failed.";
      setUploadStatus("error"); setUploadMsg(`❌ ${msg}`); setUploadedFile(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
};
 


  const clearUpload = () => { setUploadedFile(null); setUploadStatus(null); setUploadMsg(""); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleSaveQuiz = async () => {
    // ✅ FIX: validation based on quiz type
    for (const q of questions) {
      if (!q.text?.trim()) { alert("Please enter question text"); return; }

      if (quizType === "Fill in the Blank" || quizType === "Short Answer") {
        if (!q.answer?.trim()) { alert("Please enter the answer for all questions"); return; }
      } else if (quizType === "True / False") {
        if (!q.correctOption) { alert("Please select True or False for all questions"); return; }
      } else {
        // Multiple Choice (default)
        if (!q.correctOption) { alert("Please select correct option for all questions"); return; }
        for (const key of ["A", "B", "C", "D"]) {
          if (!q.options[key]?.trim()) { alert(`Please fill option ${key} for all questions`); return; }
        }
      }
    }

    if (!batchId) { alert("Please select a batch"); return; }

    try {
      setLoading(true);
      const quizRes = await createQuiz({ title, batchId, instructions, quizType, difficulty, category, timeLimit, totalMarks });
      const quizId  = quizRes.data.id;

      for (const q of questions) {
        const qRes       = await addQuestion({ quizId, text: q.text.trim() });
        const questionId = qRes.data.id;

        if (quizType === "Fill in the Blank" || quizType === "Short Answer") {
          // Save answer as the only correct option
          await addOption({ questionId, text: q.answer.trim(), correct: true });
        } else if (quizType === "True / False") {
          await addOption({ questionId, text: "True",  correct: q.correctOption === "A" });
          await addOption({ questionId, text: "False", correct: q.correctOption === "B" });
        } else {
          // Multiple Choice
          for (const key of ["A", "B", "C", "D"]) {
            await addOption({ questionId, text: q.options[key].trim(), correct: key === q.correctOption });
          }
        }
      }

      alert("✅ Quiz created successfully");
      setTitle(""); setBatchId(""); setInstructions(""); setQuizType(""); setDifficulty(""); setCategory(""); setTimeLimit(""); setTotalMarks("");
      setQuestions([getDefaultQuestion("")]);
      clearUpload();
    } catch (err) { console.error(err); alert(err.message || "❌ Failed to create quiz"); }
    finally { setLoading(false); }
  };

  const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

  const panelMeta = {
    details:   { label: "Quiz Details",    sub: "Title, type, difficulty & settings", color: "#22d3ee", num: 1, nextLabel: "Next: Add Questions →" },
    questions: { label: "Questions",       sub: `${questions.length} question${questions.length !== 1 ? "s" : ""} added`, color: "#7c3aed", num: 2, nextLabel: "Next: Review →" },
    review:    { label: "Review & Publish",sub: "Confirm and save",                  color: "#34d399", num: 3, nextLabel: null },
  };

  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = ()  => setDragOver(false);
  const onDrop      = (e) => { e.preventDefault(); setDragOver(false); handleFileChosen(e.dataTransfer.files?.[0]); };

  const numInputStyle = { width: "100%", height: 38, padding: "0 12px", borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.text, fontFamily: "'Poppins', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <PageShell t={t}>
      <PageHero
        t={t} isDark={isDark} icon={ClipboardList} badge="Assessment Builder"
        title="Quiz Builder" subtitle="Create quizzes with multiple choice questions for your batches." color="#22d3ee"
        right={
          <button onClick={() => navigate("/trainer/my-quizzes")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 12, cursor: "pointer", background: t.actBg, border: `1px solid ${t.border}`, color: t.textSub, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}>
            <ClipboardCheck size={14} /> My Quizzes
          </button>
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PANELS.map((key) => {
          const meta   = panelMeta[key];
          const isOpen = open === key;
          return (
            <div key={key} style={{ background: t.cardBg, border: `1px solid ${isOpen ? meta.color + "40" : t.border}`, borderRadius: 20, overflow: "hidden", boxShadow: isOpen ? `0 0 0 1px ${meta.color}20, ${t.shadow}` : t.shadow, transition: "all 0.2s" }}>
              <button onClick={() => toggle(key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", textAlign: "left", background: isOpen ? `${meta.color}06` : "transparent", border: "none", cursor: "pointer", borderBottom: isOpen ? `1px solid ${t.border}` : "none", transition: "background 0.2s" }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${meta.color}20`, border: `1px solid ${meta.color}40` }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
                  <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
                </div>
                <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
                  {PANELS.map((p, pi) => (
                    <span key={p} style={{ width: p === key ? 18 : 6, height: 6, borderRadius: 999, background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg, transition: "all 0.3s" }} />
                  ))}
                </div>
                <ChevronDown size={16} color={t.textMuted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
              </button>

              {isOpen && (
                <div style={{ padding: "20px 20px 24px" }}>

                  {/* ══════ PANEL 1 — DETAILS ══════ */}
                  {key === "details" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <FieldLabel t={t}>Quiz Title</FieldLabel>
                          <ThemedInput t={t} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Fundamentals" />
                        </div>
                        <div>
                          <FieldLabel t={t}>Select Batch</FieldLabel>
                          <ThemedSelect t={t} value={batchId} onChange={(e) => setBatchId(Number(e.target.value))}>
                            <option value="">Select Batch</option>
                            {batches.map((b) => <option key={b.id} value={b.id}>Batch {b.id}</option>)}
                          </ThemedSelect>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        <div>
                          <FieldLabel t={t}>Quiz Type</FieldLabel>
                          <AddableDropdown t={t} isDark={isDark} label="Quiz Type" placeholder="Select Type" value={quizType} onChange={setQuizType} options={quizTypes} onAdd={(v) => { setQuizTypes((p) => [...p, v]); setQuizType(v); }} />
                        </div>
                        <div>
                          <FieldLabel t={t}>Difficulty</FieldLabel>
                          <AddableDropdown t={t} isDark={isDark} label="Difficulty" placeholder="Select Difficulty" value={difficulty} onChange={setDifficulty} options={difficulties} onAdd={(v) => { setDifficulties((p) => [...p, v]); setDifficulty(v); }} />
                        </div>
                        <div>
                          <FieldLabel t={t}>Category</FieldLabel>
                          <AddableDropdown t={t} isDark={isDark} label="Category" placeholder="Select Category" value={category} onChange={setCategory} options={categories} onAdd={(v) => { setCategories((p) => [...p, v]); setCategory(v); }} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <FieldLabel t={t}>⏱ Time Limit (minutes)</FieldLabel>
                          <div style={{ position: "relative" }}>
                            <input type="number" min="1" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="e.g. 30" style={numInputStyle} />
                            {timeLimit && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: t.textMuted, fontFamily: "'Poppins', sans-serif", pointerEvents: "none" }}>min</span>}
                          </div>
                        </div>
                        <div>
                          <FieldLabel t={t}> Total Marks</FieldLabel>
                          <input type="number" min="1" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g. 100" style={numInputStyle} />
                        </div>
                      </div>

                      <div>
                        <FieldLabel t={t}>Instructions</FieldLabel>
                        <ThemedTextarea t={t} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Quiz instructions for students…" rows={3} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <PrimaryButton color={meta.color} onClick={() => setOpen("questions")}>{meta.nextLabel}</PrimaryButton>
                      </div>
                    </div>
                  )}

                  {/* ══════ PANEL 2 — QUESTIONS ══════ */}
                  {key === "questions" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                        style={{ border: `2px dashed ${dragOver ? "#22d3ee" : uploadStatus === "success" ? "#34d399" : uploadStatus === "error" ? "#f87171" : "rgba(124,58,237,0.35)"}`, borderRadius: 16, padding: "20px 16px", background: dragOver ? "rgba(34,211,238,0.05)" : uploadStatus === "success" ? "rgba(52,211,153,0.05)" : uploadStatus === "error" ? "rgba(248,113,113,0.05)" : "transparent", transition: "all 0.2s", textAlign: "center" }}>
                        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv" style={{ display: "none" }} onChange={(e) => handleFileChosen(e.target.files?.[0])} />
                        {uploading ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <Loader2 size={22} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
                            <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Parsing quiz file with AI…</p>
                          </div>
                        ) : uploadedFile && uploadStatus === "success" ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <FileText size={16} color="#34d399" />
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399", fontFamily: "'Poppins',sans-serif" }}>{uploadMsg}</span>
                              <button onClick={clearUpload} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} color={t.textMuted} /></button>
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} style={{ fontSize: 11, color: t.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", textDecoration: "underline" }}>Upload a different file</button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}><Upload size={18} color="#7c3aed" /></div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Upload Quiz File</p>
                              <p style={{ fontSize: 11, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>Drag & drop or click to browse · .pdf .doc .docx .txt .csv</p>
                            </div>
                            {uploadStatus === "error" && <p style={{ fontSize: 11, color: "#f87171", margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{uploadMsg}</p>}
                            <button onClick={() => fileInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.08)", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}><Upload size={13} /> Choose File</button>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1, height: 1, background: t.border }} />
                        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>or add questions manually</span>
                        <div style={{ flex: 1, height: 1, background: t.border }} />
                      </div>

                      {/* ✅ FIX: question UI adapts to quizType */}
                      {questions.map((q, index) => (
                        <div key={index} style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 16, padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 10, fontWeight: 800, color: "#7c3aed", fontFamily: "'Poppins',sans-serif" }}>{index + 1}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Poppins',sans-serif" }}>Question {index + 1}</span>
                          </div>

                          <ThemedInput t={t} value={q.text}
                            onChange={(e) => { const u = [...questions]; u[index] = { ...u[index], text: e.target.value }; setQuestions(u); }}
                            placeholder="Enter question text" style={{ marginBottom: 12 }} />

                          {/* ── Multiple Choice: 4 editable options ── */}
                          {(quizType === "Multiple Choice" || quizType === "") && (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                              {["A", "B", "C", "D"].map((optKey) => (
                                <label key={optKey} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, padding: "10px 12px", cursor: "pointer", border: `1px solid ${q.correctOption === optKey ? "#34d399" : t.inputBorder}`, background: q.correctOption === optKey ? "rgba(52,211,153,0.08)" : t.inputBg, transition: "all 0.15s" }}>
                                  <input type="radio" name={`correct-${index}`} checked={q.correctOption === optKey}
                                    onChange={() => { const u = [...questions]; u[index] = { ...u[index], correctOption: optKey }; setQuestions(u); }}
                                    style={{ accentColor: "#34d399" }} />
                                  <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: q.correctOption === optKey ? "#34d399" : t.barBg, fontSize: 10, fontWeight: 800, color: q.correctOption === optKey ? "#fff" : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{optKey}</span>
                                  <input value={q.options[optKey] || ""}
                                    onChange={(e) => { const u = [...questions]; u[index] = { ...u[index], options: { ...u[index].options, [optKey]: e.target.value } }; setQuestions(u); }}
                                    placeholder={`Option ${optKey}`}
                                    style={{ flex: 1, background: "transparent", outline: "none", border: "none", fontSize: 13, color: t.text, fontFamily: "'Poppins',sans-serif" }} />
                                </label>
                              ))}
                            </div>
                          )}

                          {/* ── True / False: 2 fixed options ── */}
                          {quizType === "True / False" && (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                              {["A", "B"].map((optKey) => (
                                <label key={optKey} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, padding: "10px 12px", cursor: "pointer", border: `1px solid ${q.correctOption === optKey ? "#34d399" : t.inputBorder}`, background: q.correctOption === optKey ? "rgba(52,211,153,0.08)" : t.inputBg, transition: "all 0.15s" }}>
                                  <input type="radio" name={`correct-${index}`} checked={q.correctOption === optKey}
                                    onChange={() => { const u = [...questions]; u[index] = { ...u[index], correctOption: optKey }; setQuestions(u); }}
                                    style={{ accentColor: "#34d399" }} />
                                  <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: q.correctOption === optKey ? "#34d399" : t.barBg, fontSize: 10, fontWeight: 800, color: q.correctOption === optKey ? "#fff" : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                                    {optKey === "A" ? "T" : "F"}
                                  </span>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
                                    {optKey === "A" ? "True" : "False"}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          {/* ── Fill in the Blank / Short Answer: text answer ── */}
                          {(quizType === "Fill in the Blank" || quizType === "Short Answer") && (
                            <div>
                              <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginBottom: 6, margin: "0 0 6px 0" }}>
                                {quizType === "Fill in the Blank" ? "Correct Answer (blank)" : "Model Answer"}
                              </p>
                              <ThemedInput t={t} value={q.answer || ""}
                                onChange={(e) => { const u = [...questions]; u[index] = { ...u[index], answer: e.target.value }; setQuestions(u); }}
                                placeholder={quizType === "Fill in the Blank" ? "Enter the correct word/phrase" : "Enter the expected answer"} />
                            </div>
                          )}
                        </div>
                      ))}

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <button onClick={addNewQuestion} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 12, border: "2px dashed rgba(124,58,237,0.4)", background: "transparent", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                          <PlusCircle size={14} /> Add Question
                        </button>
                        <PrimaryButton color={meta.color} onClick={() => setOpen("review")}>{meta.nextLabel}</PrimaryButton>
                      </div>
                    </div>
                  )}

                  {/* ══════ PANEL 3 — REVIEW ══════ */}
                  {key === "review" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                        {[
                          { label: "Title",       val: title      || "—" },
                          { label: "Batch",       val: batchId    ? `Batch ${batchId}` : "—" },
                          { label: "Type",        val: quizType   || "—" },
                          { label: "Difficulty",  val: difficulty || "—" },
                          { label: "Category",    val: category   || "—" },
                          { label: "Time Limit",  val: timeLimit  ? `${timeLimit} min` : "—" },
                          { label: "Total Marks", val: totalMarks || "—" },
                          { label: "Questions",   val: questions.length },
                        ].map(({ label, val }) => (
                          <div key={label} style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 14, padding: "12px 16px" }}>
                            <p style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", wordBreak: "break-word" }}>{val}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <button onClick={() => setOpen("questions")} style={{ fontSize: 12, color: t.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>← Back to Questions</button>
                        <PrimaryButton color="#34d399" onClick={handleSaveQuiz} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
                          {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><CheckCircle2 size={14} /> Publish Quiz</>}
                        </PrimaryButton>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};

export default CreateQuiz;