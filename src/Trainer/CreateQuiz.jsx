
// // src/trainer/CreateQuiz.jsx
// import { useEffect, useState } from "react";
// import { addOption, addQuestion, createQuiz } from "../services/assessmentService";
// import { getTrainerBatches } from "../services/batchService";
// import { ChevronDown, ClipboardList, ClipboardCheck, HelpCircle, Loader2, PlusCircle, CheckCircle2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import auth from "../auth";
// import {
//   useTrainerTheme, PageShell, PageHero, ThemedCard,
//   ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
//   PrimaryButton, SecondaryButton, Pill,
// } from "./trainerTheme";

// const PANELS = ["details", "questions", "review"];

// const CreateQuiz = () => {
//   const navigate = useNavigate();
//   const { t, isDark } = useTrainerTheme();

//   const [title, setTitle] = useState("");
//   const [batchId, setBatchId] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [open, setOpen] = useState("details");
//   const [questions, setQuestions] = useState([
//     { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" },
//   ]);

//   useEffect(() => {
//     if (!auth.isAuthenticated()) { alert("Please login again"); return; }
//     const loadBatches = async () => {
//       try {
//         const res = await getTrainerBatches();
//         setBatches(res || []);
//       } catch (err) { console.error("Failed to load trainer batches", err); }
//     };
//     loadBatches();
//   }, []);

//   const addNewQuestion = () => {
//     setQuestions([...questions, { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" }]);
//   };

//   // ✅ Full validation + immutable state updates from component 2
//   const handleSaveQuiz = async () => {
//     try {
//       // 🔥 FULL VALIDATION
//       for (const q of questions) {
//         if (!q.text || !q.text.trim()) {
//           alert("Please enter question text");
//           return;
//         }
//         if (!q.correctOption) {
//           alert("Please select correct option for all questions");
//           return;
//         }
//         for (const key of ["A", "B", "C", "D"]) {
//           const opt = q.options[key];
//           if (!opt || !opt.trim()) {
//             alert(`Please fill option ${key} for all questions`);
//             return;
//           }
//         }
//       }

//       if (!batchId) {
//         alert("Please select a batch");
//         return;
//       }

//       setLoading(true);

//       // ✅ CREATE QUIZ
//       const quizRes = await createQuiz({ title, batchId, instructions });
//       const quizId = quizRes.data.id;

//       // 🔥 DEBUG
//       console.log("QUESTIONS:", JSON.stringify(questions, null, 2));

//       // ✅ SAVE QUESTIONS + OPTIONS (with trim, same as component 2)
//       for (const q of questions) {
//         const qRes = await addQuestion({
//           quizId,
//           text: q.text.trim(),
//         });

//         const questionId = qRes.data.id;

//         for (const key of ["A", "B", "C", "D"]) {
//           const optionText = q.options[key].trim();
//           await addOption({
//             questionId,
//             text: optionText,
//             correct: key === q.correctOption,
//           });
//         }
//       }

//       alert("✅ Quiz created successfully");

//       // ✅ RESET FORM
//       setTitle("");
//       setBatchId("");
//       setInstructions("");
//       setQuestions([{ text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" }]);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "❌ Failed to create quiz");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

//   const panelMeta = {
//     details:   { label: "Quiz Details",      sub: "Title, batch & instructions", color: "#22d3ee", num: 1, next: "questions", nextLabel: "Next: Add Questions →" },
//     questions: { label: "Questions",          sub: `${questions.length} question${questions.length !== 1 ? "s" : ""} added`, color: "#7c3aed", num: 2, next: "review", nextLabel: "Next: Review →" },
//     review:    { label: "Review & Publish",   sub: "Confirm and save",           color: "#34d399", num: 3, next: null, nextLabel: null },
//   };

//   return (
//     <PageShell t={t}>
//       {/* HERO */}
//       <PageHero
//   t={t}
//   isDark={isDark}
//   icon={ClipboardList}
//   badge="Assessment Builder"
//   title="Quiz Builder"
//   subtitle="Create quizzes with multiple choice questions for your batches."
//   color="#22d3ee"
//   right={
//     <button
//       onClick={() => navigate("/trainer/my-quizzes")}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 8,
//         padding: "9px 16px",
//         borderRadius: 12,
//         cursor: "pointer",
//         background: t.actBg,
//         border: `1px solid ${t.border}`,
//         color: t.textSub,
//         fontSize: 12,
//         fontWeight: 600,
//         fontFamily: "'Poppins',sans-serif",
//         transition: "all 0.2s",
//       }}
//     >
//       <ClipboardCheck size={14} />
//       My Quizzes
//     </button>
//   }
// />

//       {/* ACCORDION PANELS */}
//       <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//         {PANELS.map((key) => {
//           const meta = panelMeta[key];
//           const isOpen = open === key;

//           return (
//             <div key={key} style={{
//               background: t.cardBg,
//               border: `1px solid ${isOpen ? meta.color + "40" : t.border}`,
//               borderRadius: 20,
//               overflow: "hidden",
//               boxShadow: isOpen ? `0 0 0 1px ${meta.color}20, ${t.shadow}` : t.shadow,
//               transition: "all 0.2s",
//             }}>
//               {/* Header */}
//               <button
//                 onClick={() => toggle(key)}
//                 style={{
//                   width: "100%", display: "flex", alignItems: "center", gap: 14,
//                   padding: "16px 20px", textAlign: "left",
//                   background: isOpen ? `${meta.color}06` : "transparent",
//                   border: "none", cursor: "pointer",
//                   borderBottom: isOpen ? `1px solid ${t.border}` : "none",
//                   transition: "background 0.2s",
//                 }}
//               >
//                 <div style={{
//                   width: 32, height: 32, borderRadius: 999,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   background: `${meta.color}20`, border: `1px solid ${meta.color}40`,
//                   flexShrink: 0,
//                 }}>
//                   <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
//                   <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
//                 </div>
//                 {/* step dots */}
//                 <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
//                   {PANELS.map((p, pi) => (
//                     <span key={p} style={{
//                       width: p === key ? 18 : 6, height: 6, borderRadius: 999,
//                       background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg,
//                       transition: "all 0.3s",
//                     }} />
//                   ))}
//                 </div>
//                 <ChevronDown size={16} color={t.textMuted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
//               </button>

//               {/* Body */}
//               {isOpen && (
//                 <div style={{ padding: "20px 20px 24px" }}>

//                   {/* PANEL 1 — DETAILS */}
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
//                             {batches.map((b) => (
//                               <option key={b.id} value={b.id}>Batch {b.id}</option>
//                             ))}
//                           </ThemedSelect>
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

//                   {/* PANEL 2 — QUESTIONS */}
//                   {key === "questions" && (
//                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                       {questions.map((q, index) => (
//                         <div key={index} style={{
//                           background: t.recentItemBg,
//                           border: `1px solid ${t.recentItemBorder}`,
//                           borderRadius: 16, padding: 16,
//                         }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
//                             <div style={{
//                               width: 24, height: 24, borderRadius: 8,
//                               background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
//                               display: "flex", alignItems: "center", justifyContent: "center",
//                             }}>
//                               <span style={{ fontSize: 10, fontWeight: 800, color: "#7c3aed", fontFamily: "'Poppins',sans-serif" }}>{index + 1}</span>
//                             </div>
//                             <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Poppins',sans-serif" }}>
//                               Question {index + 1}
//                             </span>
//                           </div>

//                           {/* ✅ Immutable update for question text (from component 2) */}
//                           <ThemedInput
//                             t={t}
//                             value={q.text}
//                             onChange={(e) => {
//                               const updated = [...questions];
//                               updated[index] = { ...updated[index], text: e.target.value };
//                               setQuestions(updated);
//                             }}
//                             placeholder="Enter question text"
//                             style={{ marginBottom: 12 }}
//                           />

//                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                             {["A", "B", "C", "D"].map((optKey) => (
//                               <label key={optKey} style={{
//                                 display: "flex", alignItems: "center", gap: 10,
//                                 borderRadius: 12, padding: "10px 12px", cursor: "pointer",
//                                 border: `1px solid ${q.correctOption === optKey ? "#34d399" : t.inputBorder}`,
//                                 background: q.correctOption === optKey ? "rgba(52,211,153,0.08)" : t.inputBg,
//                                 transition: "all 0.15s",
//                               }}>
//                                 {/* ✅ Immutable update for correctOption (from component 2) */}
//                                 <input
//                                   type="radio"
//                                   name={`correct-${index}`}
//                                   checked={q.correctOption === optKey}
//                                   onChange={() => {
//                                     const updated = [...questions];
//                                     updated[index] = { ...updated[index], correctOption: optKey };
//                                     setQuestions(updated);
//                                   }}
//                                   style={{ accentColor: "#34d399" }}
//                                 />
//                                 <span style={{
//                                   width: 20, height: 20, borderRadius: 6, flexShrink: 0,
//                                   display: "flex", alignItems: "center", justifyContent: "center",
//                                   background: q.correctOption === optKey ? "#34d399" : t.barBg,
//                                   fontSize: 10, fontWeight: 800, color: q.correctOption === optKey ? "#fff" : t.textMuted,
//                                   fontFamily: "'Poppins',sans-serif",
//                                 }}>{optKey}</span>
//                                 {/* ✅ Immutable update for option text (from component 2) */}
//                                 <input
//                                   value={q.options[optKey] || ""}
//                                   onChange={(e) => {
//                                     const updated = [...questions];
//                                     updated[index] = {
//                                       ...updated[index],
//                                       options: {
//                                         ...updated[index].options,
//                                         [optKey]: e.target.value,
//                                       },
//                                     };
//                                     setQuestions(updated);
//                                   }}
//                                   placeholder={`Option ${optKey}`}
//                                   style={{ flex: 1, background: "transparent", outline: "none", border: "none", fontSize: 13, color: t.text, fontFamily: "'Poppins',sans-serif" }}
//                                 />
//                               </label>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                         <button
//                           onClick={addNewQuestion}
//                           style={{
//                             display: "flex", alignItems: "center", gap: 8,
//                             padding: "9px 16px", borderRadius: 12,
//                             border: `2px dashed rgba(124,58,237,0.4)`,
//                             background: "transparent", color: "#7c3aed",
//                             fontSize: 12, fontWeight: 600, cursor: "pointer",
//                             fontFamily: "'Poppins',sans-serif",
//                           }}
//                         >
//                           <PlusCircle size={14} /> Add Question
//                         </button>
//                         <PrimaryButton color={meta.color} onClick={() => setOpen("review")}>{meta.nextLabel}</PrimaryButton>
//                       </div>
//                     </div>
//                   )}

//                   {/* PANEL 3 — REVIEW */}
//                   {key === "review" && (
//                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                       <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
//                         {[
//                           { label: "Title",     val: title || "—" },
//                           { label: "Batch",     val: batchId ? `Batch ${batchId}` : "—" },
//                           { label: "Questions", val: questions.length },
//                         ].map(({ label, val }) => (
//                           <div key={label} style={{
//                             background: t.recentItemBg,
//                             border: `1px solid ${t.recentItemBorder}`,
//                             borderRadius: 14, padding: "12px 16px",
//                           }}>
//                             <p style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
//                             <p style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>{val}</p>
//                           </div>
//                         ))}
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                         <button
//                           onClick={() => setOpen("questions")}
//                           style={{ fontSize: 12, color: t.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}
//                         >← Back to Questions</button>
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
  uploadBulkQuiz,          // ← NEW import
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

const CreateQuiz = () => {
  const navigate  = useNavigate();
  const { t, isDark } = useTrainerTheme();

  // ── Existing state ────────────────────────────────────────────────────────
  const [title,        setTitle]        = useState("");
  const [batchId,      setBatchId]      = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading,      setLoading]      = useState(false);
  const [batches,      setBatches]      = useState([]);
  const [open,         setOpen]         = useState("details");
  const [questions,    setQuestions]    = useState([
    { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" },
  ]);

  // ── NEW: Upload state ─────────────────────────────────────────────────────
  const [uploading,    setUploading]    = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); // File object
  const [uploadStatus, setUploadStatus] = useState(null); // "success" | "error" | null
  const [uploadMsg,    setUploadMsg]    = useState("");
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef(null);

  // ── Load batches ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth.isAuthenticated()) { alert("Please login again"); return; }
    const loadBatches = async () => {
      try {
        const res = await getTrainerBatches();
        setBatches(res || []);
      } catch (err) { console.error("Failed to load trainer batches", err); }
    };
    loadBatches();
  }, []);

  // ── Existing: add blank question ──────────────────────────────────────────
  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" },
    ]);
  };

  // ── NEW: handle file chosen (via input or drag) ───────────────────────────
  const handleFileChosen = async (file) => {
    if (!file) return;

    const allowed = [".pdf", ".doc", ".docx", ".txt", ".csv"];
    const ext     = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setUploadStatus("error");
      setUploadMsg("Invalid file type. Allowed: .pdf, .doc, .docx, .txt, .csv");
      return;
    }

    setUploadedFile(file);
    setUploadStatus(null);
    setUploadMsg("");
    setUploading(true);

    try {
      const data = await uploadBulkQuiz(file);

      // ✅ Populate form from API response
      if (data.title)     setTitle(data.title);
      if (data.questions) setQuestions(data.questions);

      setUploadStatus("success");
      setUploadMsg(
        `✅ ${data.questions?.length || 0} question${
          (data.questions?.length || 0) !== 1 ? "s" : ""
        } loaded from "${file.name}"`
      );

      // Auto-navigate to questions panel so trainer can review
      setOpen("questions");

    } catch (err) {
      console.error("Bulk upload failed", err);
      const msg =
        err?.response?.data?.error || err.message || "Upload failed. Please try again.";
      setUploadStatus("error");
      setUploadMsg(`❌ ${msg}`);
      setUploadedFile(null);
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadStatus(null);
    setUploadMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Existing: save quiz ───────────────────────────────────────────────────
  const handleSaveQuiz = async () => {
    try {
      // Validation
      for (const q of questions) {
        if (!q.text?.trim()) { alert("Please enter question text"); return; }
        if (!q.correctOption) { alert("Please select correct option for all questions"); return; }
        for (const key of ["A", "B", "C", "D"]) {
          if (!q.options[key]?.trim()) {
            alert(`Please fill option ${key} for all questions`); return;
          }
        }
      }
      if (!batchId) { alert("Please select a batch"); return; }

      setLoading(true);

      const quizRes = await createQuiz({ title, batchId, instructions });
      const quizId  = quizRes.data.id;

      for (const q of questions) {
        const qRes      = await addQuestion({ quizId, text: q.text.trim() });
        const questionId = qRes.data.id;
        for (const key of ["A", "B", "C", "D"]) {
          await addOption({
            questionId,
            text:    q.options[key].trim(),
            correct: key === q.correctOption,
          });
        }
      }

      alert("✅ Quiz created successfully");

      // Reset
      setTitle(""); setBatchId(""); setInstructions("");
      setQuestions([{ text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" }]);
      clearUpload();

    } catch (err) {
      console.error(err);
      alert(err.message || "❌ Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

  // ── Panel metadata (unchanged) ────────────────────────────────────────────
  const panelMeta = {
    details:   { label: "Quiz Details",    sub: "Title, batch & instructions", color: "#22d3ee", num: 1, next: "questions", nextLabel: "Next: Add Questions →" },
    questions: { label: "Questions",        sub: `${questions.length} question${questions.length !== 1 ? "s" : ""} added`, color: "#7c3aed", num: 2, next: "review", nextLabel: "Next: Review →" },
    review:    { label: "Review & Publish", sub: "Confirm and save",           color: "#34d399", num: 3, next: null,        nextLabel: null },
  };

  // ── Drag & drop handlers ──────────────────────────────────────────────────
  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true);  };
  const onDragLeave = ()  => { setDragOver(false); };
  const onDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChosen(file);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageShell t={t}>
      {/* HERO */}
      <PageHero
        t={t}
        isDark={isDark}
        icon={ClipboardList}
        badge="Assessment Builder"
        title="Quiz Builder"
        subtitle="Create quizzes with multiple choice questions for your batches."
        color="#22d3ee"
        right={
          <button
            onClick={() => navigate("/trainer/my-quizzes")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 16px", borderRadius: 12, cursor: "pointer",
              background: t.actBg, border: `1px solid ${t.border}`,
              color: t.textSub, fontSize: 12, fontWeight: 600,
              fontFamily: "'Poppins',sans-serif", transition: "all 0.2s",
            }}
          >
            <ClipboardCheck size={14} /> My Quizzes
          </button>
        }
      />

      {/* ACCORDION PANELS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PANELS.map((key) => {
          const meta   = panelMeta[key];
          const isOpen = open === key;

          return (
            <div
              key={key}
              style={{
                background: t.cardBg,
                border: `1px solid ${isOpen ? meta.color + "40" : t.border}`,
                borderRadius: 20, overflow: "hidden",
                boxShadow: isOpen ? `0 0 0 1px ${meta.color}20, ${t.shadow}` : t.shadow,
                transition: "all 0.2s",
              }}
            >
              {/* ── Panel Header ─────────────────────────────────────────── */}
              <button
                onClick={() => toggle(key)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 20px", textAlign: "left",
                  background: isOpen ? `${meta.color}06` : "transparent",
                  border: "none", cursor: "pointer",
                  borderBottom: isOpen ? `1px solid ${t.border}` : "none",
                  transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${meta.color}20`, border: `1px solid ${meta.color}40`,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
                  <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
                </div>
                <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
                  {PANELS.map((p, pi) => (
                    <span key={p} style={{
                      width: p === key ? 18 : 6, height: 6, borderRadius: 999,
                      background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg,
                      transition: "all 0.3s",
                    }} />
                  ))}
                </div>
                <ChevronDown
                  size={16} color={t.textMuted}
                  style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
                />
              </button>

              {/* ── Panel Body ───────────────────────────────────────────── */}
              {isOpen && (
                <div style={{ padding: "20px 20px 24px" }}>

                  {/* ══════════════════ PANEL 1 — DETAILS ══════════════════ */}
                  {key === "details" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <FieldLabel t={t}>Quiz Title</FieldLabel>
                          <ThemedInput
                            t={t} value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. React Fundamentals"
                          />
                        </div>
                        <div>
                          <FieldLabel t={t}>Select Batch</FieldLabel>
                          <ThemedSelect
                            t={t} value={batchId}
                            onChange={(e) => setBatchId(Number(e.target.value))}
                          >
                            <option value="">Select Batch</option>
                            {batches.map((b) => (
                              <option key={b.id} value={b.id}>Batch {b.id}</option>
                            ))}
                          </ThemedSelect>
                        </div>
                      </div>
                      <div>
                        <FieldLabel t={t}>Instructions</FieldLabel>
                        <ThemedTextarea
                          t={t} value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Quiz instructions for students…" rows={3}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <PrimaryButton color={meta.color} onClick={() => setOpen("questions")}>
                          {meta.nextLabel}
                        </PrimaryButton>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════ PANEL 2 — QUESTIONS ══════════════════ */}
                  {key === "questions" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                      {/* ── NEW: Bulk Upload Section ─────────────────────── */}
                      <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        style={{
                          border: `2px dashed ${dragOver ? "#22d3ee" : uploadStatus === "success" ? "#34d399" : uploadStatus === "error" ? "#f87171" : "rgba(124,58,237,0.35)"}`,
                          borderRadius: 16,
                          padding: "20px 16px",
                          background: dragOver
                            ? "rgba(34,211,238,0.05)"
                            : uploadStatus === "success"
                            ? "rgba(52,211,153,0.05)"
                            : uploadStatus === "error"
                            ? "rgba(248,113,113,0.05)"
                            : "transparent",
                          transition: "all 0.2s",
                          textAlign: "center",
                        }}
                      >
                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.csv"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChosen(e.target.files?.[0])}
                        />

                        {uploading ? (
                          /* Loading state */
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <Loader2 size={22} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
                            <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                              Parsing quiz file with AI…
                            </p>
                          </div>

                        ) : uploadedFile && uploadStatus === "success" ? (
                          /* Success state */
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <FileText size={16} color="#34d399" />
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399", fontFamily: "'Poppins',sans-serif" }}>
                                {uploadMsg}
                              </span>
                              <button
                                onClick={clearUpload}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                                title="Clear upload"
                              >
                                <X size={14} color={t.textMuted} />
                              </button>
                            </div>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                fontSize: 11, color: t.textMuted, background: "none",
                                border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                                textDecoration: "underline",
                              }}
                            >
                              Upload a different file
                            </button>
                          </div>

                        ) : (
                          /* Default / error state */
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 12,
                              background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <Upload size={18} color="#7c3aed" />
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                                Upload Quiz File
                              </p>
                              <p style={{ fontSize: 11, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                                Drag & drop or click to browse · .pdf .doc .docx .txt .csv
                              </p>
                            </div>
                            {uploadStatus === "error" && (
                              <p style={{
                                fontSize: 11, color: "#f87171", margin: 0,
                                fontFamily: "'Poppins',sans-serif", fontWeight: 500,
                              }}>
                                {uploadMsg}
                              </p>
                            )}
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 16px", borderRadius: 10,
                                border: "1px solid rgba(124,58,237,0.4)",
                                background: "rgba(124,58,237,0.08)",
                                color: "#7c3aed", fontSize: 12, fontWeight: 600,
                                cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                                transition: "all 0.2s",
                              }}
                            >
                              <Upload size={13} /> Choose File
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1, height: 1, background: t.border }} />
                        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                          or add questions manually
                        </span>
                        <div style={{ flex: 1, height: 1, background: t.border }} />
                      </div>

                      {/* ── Existing: question cards (unchanged logic) ──── */}
                      {questions.map((q, index) => (
                        <div
                          key={index}
                          style={{
                            background: t.recentItemBg,
                            border: `1px solid ${t.recentItemBorder}`,
                            borderRadius: 16, padding: 16,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: 8,
                              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <span style={{ fontSize: 10, fontWeight: 800, color: "#7c3aed", fontFamily: "'Poppins',sans-serif" }}>{index + 1}</span>
                            </div>
                            <span style={{
                              fontSize: 11, fontWeight: 600, color: t.textMuted,
                              textTransform: "uppercase", letterSpacing: "0.08em",
                              fontFamily: "'Poppins',sans-serif",
                            }}>
                              Question {index + 1}
                            </span>
                          </div>

                          <ThemedInput
                            t={t}
                            value={q.text}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[index] = { ...updated[index], text: e.target.value };
                              setQuestions(updated);
                            }}
                            placeholder="Enter question text"
                            style={{ marginBottom: 12 }}
                          />

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {["A", "B", "C", "D"].map((optKey) => (
                              <label
                                key={optKey}
                                style={{
                                  display: "flex", alignItems: "center", gap: 10,
                                  borderRadius: 12, padding: "10px 12px", cursor: "pointer",
                                  border: `1px solid ${q.correctOption === optKey ? "#34d399" : t.inputBorder}`,
                                  background: q.correctOption === optKey ? "rgba(52,211,153,0.08)" : t.inputBg,
                                  transition: "all 0.15s",
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`correct-${index}`}
                                  checked={q.correctOption === optKey}
                                  onChange={() => {
                                    const updated = [...questions];
                                    updated[index] = { ...updated[index], correctOption: optKey };
                                    setQuestions(updated);
                                  }}
                                  style={{ accentColor: "#34d399" }}
                                />
                                <span style={{
                                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  background: q.correctOption === optKey ? "#34d399" : t.barBg,
                                  fontSize: 10, fontWeight: 800,
                                  color: q.correctOption === optKey ? "#fff" : t.textMuted,
                                  fontFamily: "'Poppins',sans-serif",
                                }}>
                                  {optKey}
                                </span>
                                <input
                                  value={q.options[optKey] || ""}
                                  onChange={(e) => {
                                    const updated = [...questions];
                                    updated[index] = {
                                      ...updated[index],
                                      options: { ...updated[index].options, [optKey]: e.target.value },
                                    };
                                    setQuestions(updated);
                                  }}
                                  placeholder={`Option ${optKey}`}
                                  style={{
                                    flex: 1, background: "transparent", outline: "none",
                                    border: "none", fontSize: 13, color: t.text,
                                    fontFamily: "'Poppins',sans-serif",
                                  }}
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* ── Bottom action row ─────────────────────────────── */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <button
                          onClick={addNewQuestion}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "9px 16px", borderRadius: 12,
                            border: "2px dashed rgba(124,58,237,0.4)",
                            background: "transparent", color: "#7c3aed",
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          <PlusCircle size={14} /> Add Question
                        </button>
                        <PrimaryButton color={meta.color} onClick={() => setOpen("review")}>
                          {meta.nextLabel}
                        </PrimaryButton>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════ PANEL 3 — REVIEW ══════════════════ */}
                  {key === "review" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        {[
                          { label: "Title",     val: title || "—" },
                          { label: "Batch",     val: batchId ? `Batch ${batchId}` : "—" },
                          { label: "Questions", val: questions.length },
                        ].map(({ label, val }) => (
                          <div
                            key={label}
                            style={{
                              background: t.recentItemBg,
                              border: `1px solid ${t.recentItemBorder}`,
                              borderRadius: 14, padding: "12px 16px",
                            }}
                          >
                            <p style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
                            <p style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>{val}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <button
                          onClick={() => setOpen("questions")}
                          style={{ fontSize: 12, color: t.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}
                        >
                          ← Back to Questions
                        </button>
                        <PrimaryButton
                          color="#34d399"
                          onClick={handleSaveQuiz}
                          disabled={loading}
                          style={{ opacity: loading ? 0.6 : 1 }}
                        >
                          {loading
                            ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                            : <><CheckCircle2 size={14} /> Publish Quiz</>
                          }
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